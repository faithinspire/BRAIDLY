// Location Search with GPS and Geolocation
class LocationSearch {
    constructor() {
        this.autocomplete = null;
        this.map = null;
        this.marker = null;
        this.currentLocation = null;
        this.isGettingLocation = false;
    }

    // Initialize location search on input
    initAutocomplete(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        // Add GPS button next to input
        this.addGPSButton(input);

        // Check if Google Maps API is loaded
        if (typeof google === 'undefined') {
            console.warn('Google Maps API not loaded. Using fallback location search.');
            this.initFallbackSearch(input);
            return;
        }

        // Initialize autocomplete with USA bias
        this.autocomplete = new google.maps.places.Autocomplete(input, {
            types: ['(cities)'],
            componentRestrictions: { country: 'us' }
        });

        // Listen for place selection
        this.autocomplete.addListener('place_changed', () => {
            const place = this.autocomplete.getPlace();
            
            if (!place.geometry) {
                console.error('No details available for input: ' + place.name);
                return;
            }

            this.currentLocation = {
                name: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                city: this.extractCity(place),
                state: this.extractState(place),
                zipCode: this.extractZipCode(place)
            };

            // Save to localStorage
            localStorage.setItem('userLocation', JSON.stringify(this.currentLocation));

            // Trigger custom event
            window.dispatchEvent(new CustomEvent('locationSelected', {
                detail: this.currentLocation
            }));

            console.log('Location selected:', this.currentLocation);
        });
    }

    // Add GPS button next to location input
    addGPSButton(input) {
        // Check if button already exists
        if (input.parentElement.querySelector('.gps-button')) return;

        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '8px';

        // Wrap input
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        // Create GPS button
        const gpsBtn = document.createElement('button');
        gpsBtn.type = 'button';
        gpsBtn.className = 'btn btn-outline-primary gps-button';
        gpsBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
        gpsBtn.title = 'Use my current location';
        gpsBtn.style.minWidth = '44px';
        
        gpsBtn.addEventListener('click', () => {
            this.useCurrentLocation(input);
        });

        wrapper.appendChild(gpsBtn);
    }

    // Use current GPS location
    async useCurrentLocation(input) {
        if (this.isGettingLocation) return;

        const gpsBtn = input.parentElement.querySelector('.gps-button');
        if (gpsBtn) {
            gpsBtn.disabled = true;
            gpsBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        }

        this.isGettingLocation = true;

        try {
            const location = await this.getCurrentPosition();
            input.value = location.name || `${location.city}, ${location.state}`;
            
            // Show success feedback
            if (gpsBtn) {
                gpsBtn.innerHTML = '<i class="fas fa-check text-success"></i>';
                setTimeout(() => {
                    gpsBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
                    gpsBtn.disabled = false;
                }, 2000);
            }

            // Trigger location selected event
            window.dispatchEvent(new CustomEvent('locationSelected', {
                detail: location
            }));

        } catch (error) {
            console.error('Error getting location:', error);
            
            let errorMessage = 'Unable to get your location';
            if (error.code === 1) {
                errorMessage = 'Location permission denied. Please enable location access.';
            } else if (error.code === 2) {
                errorMessage = 'Location unavailable. Please try again.';
            } else if (error.code === 3) {
                errorMessage = 'Location request timed out. Please try again.';
            }

            alert(errorMessage);

            if (gpsBtn) {
                gpsBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
                gpsBtn.disabled = false;
            }
        } finally {
            this.isGettingLocation = false;
        }
    }

    // Get current geolocation using browser API
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported by your browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Reverse geocode to get address
                    try {
                        const address = await this.reverseGeocode(location.lat, location.lng);
                        this.currentLocation = { ...location, ...address };
                        localStorage.setItem('userLocation', JSON.stringify(this.currentLocation));
                        resolve(this.currentLocation);
                    } catch (error) {
                        // If reverse geocoding fails, still return coordinates
                        this.currentLocation = {
                            ...location,
                            name: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                        };
                        localStorage.setItem('userLocation', JSON.stringify(this.currentLocation));
                        resolve(this.currentLocation);
                    }
                },
                (error) => reject(error),
                { 
                    enableHighAccuracy: true, 
                    timeout: 10000, 
                    maximumAge: 0 
                }
            );
        });
    }

    // Reverse geocode coordinates to address
    async reverseGeocode(lat, lng) {
        if (typeof google === 'undefined') {
            // Fallback: use approximate location
            return { 
                name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                city: 'Unknown',
                state: 'Unknown'
            };
        }

        const geocoder = new google.maps.Geocoder();
        const latlng = { lat, lng };

        return new Promise((resolve, reject) => {
            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    resolve({
                        name: results[0].formatted_address,
                        city: this.extractCity(results[0]),
                        state: this.extractState(results[0]),
                        zipCode: this.extractZipCode(results[0])
                    });
                } else {
                    reject(new Error('Geocoding failed'));
                }
            });
        });
    }

    // Fallback search without Google Maps API
    initFallbackSearch(input) {
        const usaCities = [
            'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
            'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
            'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
            'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA',
            'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
            'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI',
            'Oklahoma City, OK', 'Portland, OR', 'Las Vegas, NV', 'Memphis, TN',
            'Louisville, KY', 'Baltimore, MD', 'Milwaukee, WI', 'Albuquerque, NM',
            'Tucson, AZ', 'Fresno, CA', 'Mesa, AZ', 'Sacramento, CA',
            'Atlanta, GA', 'Kansas City, MO', 'Colorado Springs, CO', 'Omaha, NE',
            'Raleigh, NC', 'Miami, FL', 'Long Beach, CA', 'Virginia Beach, VA',
            'Oakland, CA', 'Minneapolis, MN', 'Tulsa, OK', 'Tampa, FL',
            'Arlington, TX', 'New Orleans, LA'
        ];

        // Create datalist for autocomplete
        const datalist = document.createElement('datalist');
        datalist.id = 'cities-list';
        usaCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            datalist.appendChild(option);
        });
        document.body.appendChild(datalist);
        input.setAttribute('list', 'cities-list');

        // Handle selection
        input.addEventListener('change', () => {
            const value = input.value;
            if (usaCities.includes(value)) {
                const [city, state] = value.split(', ');
                this.currentLocation = {
                    name: value,
                    city: city,
                    state: state
                };
                localStorage.setItem('userLocation', JSON.stringify(this.currentLocation));
                window.dispatchEvent(new CustomEvent('locationSelected', {
                    detail: this.currentLocation
                }));
            }
        });
    }

    // Calculate distance between two points (Haversine formula)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3959; // Earth's radius in miles
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Extract city from place object
    extractCity(place) {
        const cityComponent = place.address_components?.find(
            component => component.types.includes('locality')
        );
        return cityComponent?.long_name || '';
    }

    // Extract state from place object
    extractState(place) {
        const stateComponent = place.address_components?.find(
            component => component.types.includes('administrative_area_level_1')
        );
        return stateComponent?.short_name || '';
    }

    // Extract ZIP code from place object
    extractZipCode(place) {
        const zipComponent = place.address_components?.find(
            component => component.types.includes('postal_code')
        );
        return zipComponent?.long_name || '';
    }

    // Get saved location
    getSavedLocation() {
        const saved = localStorage.getItem('userLocation');
        return saved ? JSON.parse(saved) : null;
    }

    // Clear saved location
    clearLocation() {
        localStorage.removeItem('userLocation');
        this.currentLocation = null;
    }
}

// Initialize global instance
window.locationSearch = new LocationSearch();

// Auto-initialize on common input IDs
document.addEventListener('DOMContentLoaded', () => {
    const locationInputs = document.querySelectorAll('[data-location-search]');
    locationInputs.forEach(input => {
        window.locationSearch.initAutocomplete(input.id);
    });

    // Load saved location if exists
    const savedLocation = window.locationSearch.getSavedLocation();
    if (savedLocation) {
        const input = document.querySelector('[data-location-search]');
        if (input) {
            input.value = savedLocation.name || savedLocation.city;
        }
    }
});

// Export for use in other scripts
window.LocationSearch = LocationSearch;

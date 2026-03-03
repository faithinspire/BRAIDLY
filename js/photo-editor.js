// Photo Editor with Advanced Features
class PhotoEditor {
    constructor() {
        this.canvas = document.getElementById('photoCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.image = new Image();
        this.currentFilter = 'none';
        this.brightness = 100;
        this.contrast = 100;
        this.saturation = 100;
        this.rotation = 0;
        
        this.init();
    }

    init() {
        // File upload handler
        const uploadInput = document.getElementById('photoUpload');
        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.applyFilter(e.target.textContent.toLowerCase()));
        });

        // Adjustment sliders
        const brightnessSlider = document.getElementById('brightness');
        const contrastSlider = document.getElementById('contrast');
        const saturationSlider = document.getElementById('saturation');

        if (brightnessSlider) {
            brightnessSlider.addEventListener('input', (e) => {
                this.brightness = e.target.value;
                this.applyAdjustments();
            });
        }

        if (contrastSlider) {
            contrastSlider.addEventListener('input', (e) => {
                this.contrast = e.target.value;
                this.applyAdjustments();
            });
        }

        if (saturationSlider) {
            saturationSlider.addEventListener('input', (e) => {
                this.saturation = e.target.value;
                this.applyAdjustments();
            });
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.image.src = e.target.result;
                this.image.onload = () => {
                    this.drawImage();
                };
            };
            reader.readAsDataURL(file);
        }
    }

    drawImage() {
        if (!this.canvas || !this.ctx) return;
        
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0);
        
        this.applyAdjustments();
    }

    applyFilter(filterName) {
        this.currentFilter = filterName;
        
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        event.target.classList.add('active');
        
        this.applyAdjustments();
    }

    applyAdjustments() {
        if (!this.canvas || !this.ctx) return;
        
        // Redraw original image
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0);
        
        // Get image data
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Apply brightness, contrast, saturation
        for (let i = 0; i < data.length; i += 4) {
            // Brightness
            data[i] = data[i] * (this.brightness / 100);
            data[i + 1] = data[i + 1] * (this.brightness / 100);
            data[i + 2] = data[i + 2] * (this.brightness / 100);
            
            // Contrast
            const factor = (259 * (this.contrast + 255)) / (255 * (259 - this.contrast));
            data[i] = factor * (data[i] - 128) + 128;
            data[i + 1] = factor * (data[i + 1] - 128) + 128;
            data[i + 2] = factor * (data[i + 2] - 128) + 128;
            
            // Apply filter
            if (this.currentFilter === 'b&w') {
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                data[i] = data[i + 1] = data[i + 2] = gray;
            } else if (this.currentFilter === 'vintage') {
                data[i] = data[i] * 1.2;
                data[i + 1] = data[i + 1] * 1.1;
                data[i + 2] = data[i + 2] * 0.9;
            }
            
            // Clamp values
            data[i] = Math.min(255, Math.max(0, data[i]));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    rotate(degrees) {
        this.rotation += degrees;
        if (!this.canvas || !this.ctx) return;
        
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(this.rotation * Math.PI / 180);
        this.ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
        this.ctx.restore();
    }

    crop(x, y, width, height) {
        if (!this.canvas || !this.ctx) return;
        
        const croppedData = this.ctx.getImageData(x, y, width, height);
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.putImageData(croppedData, 0, 0);
    }

    save() {
        if (!this.canvas) return;
        
        const dataURL = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'edited-photo.png';
        link.href = dataURL;
        link.click();
    }
}

// Initialize photo editor when modal is shown
document.addEventListener('DOMContentLoaded', () => {
    const photoEditorModal = document.getElementById('photoEditorModal');
    if (photoEditorModal) {
        photoEditorModal.addEventListener('shown.bs.modal', () => {
            new PhotoEditor();
        });
    }
});

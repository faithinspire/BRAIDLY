// BRAIDLY AUTH CORE - ULTRA-SIMPLE, NO CONFLICTS
// This is the ONLY auth file that matters

(function() {
    'use strict';

    // SINGLE AUTH STATE
    window.BRAIDLY_AUTH = {
        user: null,
        isLoggedIn: false
    };

    // LOAD AUTH STATE FROM STORAGE
    function loadAuthState() {
        try {
            const stored = localStorage.getItem('BRAIDLY_USER');
            if (stored) {
                window.BRAIDLY_AUTH.user = JSON.parse(stored);
                window.BRAIDLY_AUTH.isLoggedIn = true;
                return true;
            }
        } catch (e) {
            console.error('Auth load error:', e);
        }
        return false;
    }

    // SAVE AUTH STATE TO STORAGE
    function saveAuthState(user) {
        try {
            localStorage.setItem('BRAIDLY_USER', JSON.stringify(user));
            window.BRAIDLY_AUTH.user = user;
            window.BRAIDLY_AUTH.isLoggedIn = true;
        } catch (e) {
            console.error('Auth save error:', e);
        }
    }

    // CLEAR AUTH STATE
    function clearAuthState() {
        localStorage.removeItem('BRAIDLY_USER');
        window.BRAIDLY_AUTH.user = null;
        window.BRAIDLY_AUTH.isLoggedIn = false;
    }

    // CHECK IF LOGGED IN
    window.isLoggedIn = function() {
        return window.BRAIDLY_AUTH.isLoggedIn;
    };

    // GET CURRENT USER
    window.getCurrentUser = function() {
        return window.BRAIDLY_AUTH.user;
    };

    // LOGIN FUNCTION
    window.braidlyLogin = async function(email, password) {
        try {
            if (!window.supabaseClient) {
                throw new Error('Supabase not configured');
            }

            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            // Get profile
            const { data: profile } = await window.supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            const user = {
                id: data.user.id,
                email: data.user.email,
                fullName: profile?.full_name || 'User',
                role: profile?.role || 'customer'
            };

            saveAuthState(user);
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // SIGNUP FUNCTION
    window.braidlySignup = async function(email, password, fullName, phone, role) {
        try {
            if (!window.supabaseClient) {
                throw new Error('Supabase not configured');
            }

            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { full_name: fullName, phone: phone, role: role }
                }
            });

            if (error) throw error;

            // Create profile
            if (data.user) {
                await window.supabaseClient.from('profiles').insert([{
                    id: data.user.id,
                    email: email,
                    full_name: fullName,
                    phone: phone,
                    role: role,
                    created_at: new Date().toISOString()
                }]);
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // LOGOUT FUNCTION
    window.braidlyLogout = async function() {
        try {
            if (window.supabaseClient) {
                await window.supabaseClient.auth.signOut();
            }
        } catch (e) {
            console.error('Logout error:', e);
        }
        clearAuthState();
        window.location.replace('login.html');
    };

    // PROTECT PAGE (for dashboards)
    window.protectPage = function() {
        // Simple check - no session storage to avoid redirect loops
        if (!loadAuthState()) {
            console.log('No auth state - redirecting to login');
            window.location.replace('login.html');
            return false;
        }
        
        // Display welcome message
        const user = window.BRAIDLY_AUTH.user;
        if (user) {
            document.querySelectorAll('[data-welcome-user]').forEach(el => {
                el.textContent = `Welcome back, ${user.fullName}!`;
            });
        }
        return true;
    };

    // REDIRECT IF LOGGED IN (for login/signup pages)
    window.redirectIfLoggedIn = function() {
        if (loadAuthState()) {
            const user = window.BRAIDLY_AUTH.user;
            const role = user?.role || 'customer';
            
            if (role === 'admin') {
                window.location.replace('admin-dashboard.html');
            } else if (role === 'braider') {
                window.location.replace('braider-dashboard.html');
            } else {
                window.location.replace('customer-dashboard.html');
            }
            return true;
        }
        return false;
    };

    // INITIALIZE
    loadAuthState();

})();

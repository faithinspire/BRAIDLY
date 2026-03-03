// Supabase Configuration
const SUPABASE_URL = 'https://rsemdjxizhkqaoptdxlc.supabase.co';
const SUPABASE_ANON_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzZW1kanhpemhrcWFvcHRkeGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NjIxMzIsImV4cCI6MjA4NzUzODEzMn0.5nbKKZhQd8V8mcSmsZaHWPVs-oH1x-3yTrAsIiZnN6Y'

// Initialize Supabase client
function initializeSupabase() {
    if (window.supabaseClient) {
        console.log('✅ Supabase already initialized');
        return window.supabaseClient;
    }

    // Check if Supabase library is loaded
    if (typeof window.supabase === 'undefined') {
        console.error('❌ Supabase library not loaded. Please include the Supabase CDN script.');
        return null;
    }

    try {
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        });
        
        window.supabaseClient = supabase;
        console.log('✅ Supabase initialized successfully');
        console.log('📍 Supabase URL:', SUPABASE_URL);
        
        // Test connection
        testSupabaseConnection();
        
        return supabase;
    } catch (error) {
        console.error('❌ Supabase initialization error:', error);
        return null;
    }
}

// Test Supabase connection
async function testSupabaseConnection() {
    try {
        const { data, error } = await window.supabaseClient.auth.getSession();
        if (error) {
            console.warn('⚠️ Supabase connection test warning:', error.message);
        } else {
            console.log('✅ Supabase connection test successful');
            if (data.session) {
                console.log('👤 Active session found for user:', data.session.user.email);
            }
        }
    } catch (error) {
        console.error('❌ Supabase connection test failed:', error);
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSupabase);
} else {
    initializeSupabase();
}

// Export for use in other scripts
window.initializeSupabase = initializeSupabase;

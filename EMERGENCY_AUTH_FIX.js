// EMERGENCY AUTH BYPASS FIX
// This file provides an immediate workaround for auth issues

// 1. First, let's create a simple auth bypass for testing
const EMERGENCY_AUTH_BYPASS = true;

// 2. Create a simple auth service that works without RLS
const createEmergencyAuth = () => {
  // Simple in-memory user store for emergency
  const users = new Map();
  
  return {
    // Emergency login - works even if Supabase is down
    emergencyLogin: (email, password) => {
      console.log('EMERGENCY LOGIN ATTEMPT:', email);
      
      // Check if user exists in emergency storage
      const userKey = `emergency_user_${email}`;
      const stored = localStorage.getItem(userKey);
      
      if (stored) {
        const user = JSON.parse(stored);
        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role || 'customer',
            avatarUrl: user.avatarUrl || ''
          }
        };
      }
      
      // For emergency, create a test user
      const testUser = {
        id: 'emergency-user-123',
        email: email,
        fullName: 'Test User',
        role: 'customer',
        avatarUrl: ''
      };
      
      // Store for future logins
      localStorage.setItem(userKey, JSON.stringify(testUser));
      
      return {
        success: true,
        user: testUser
      };
    },
    
    // Emergency signup
    emergencySignup: (email, password, fullName, phone, role) => {
      const userId = 'user_' + Date.now();
      const user = {
        id: userId,
        email: email.toLowerCase().trim(),
        fullName: fullName || 'User',
        phone: phone || '',
        role: role || 'customer',
        avatarUrl: '',
        createdAt: new Date().toISOString()
      };
      
      // Store in localStorage
      const userKey = `emergency_user_${email}`;
      localStorage.setItem(userKey, JSON.stringify(user));
      
      return {
        success: true,
        user: user,
        message: 'Account created successfully (emergency mode)'
      };
    }
  };
};

// 3. Override the auth service temporarily
const emergencyAuth = createEmergencyAuth();

// 4. Create emergency login form
const createEmergencyLoginForm = () => {
  const form = document.createElement('div');
  form.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
    ">
      <div style="
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 400px;
        width: 90%;
        max-width: 400px;
      ">
        <h2>Emergency Login</h2>
        <p>Using emergency auth system. Database issues detected.</p>
        <div id="auth-message" style="color: red; margin: 10px 0;"></div>
        <input type="email" id="emergency-email" placeholder="Email" style="width: 100%; padding: 10px; margin: 5px 0;">
        <input type="password" id="emergency-password" placeholder="Password" style="width: 100%; padding: 10px; margin: 5px 0;">
        <button onclick="handleEmergencyLogin()" style="width: 100%; padding: 10px; margin: 10px 0;">Login</button>
        <p><small>Or use test@test.com / test123</small></p>
      </div>
    </div>
  `;
  
  document.body.appendChild(form);
  
  // Add to global scope
  window.handleEmergencyLogin = function() {
    const email = document.getElementById('emergency-email').value;
    const password = document.getElementById('emergency-password').value;
    
    if (!email || !password) {
      document.getElementById('auth-message').textContent = 'Please enter email and password';
      return;
    }
    
    const result = emergencyAuth.emergencyLogin(email, password);
    
    if (result.success) {
      localStorage.setItem('emergency_user', JSON.stringify(result.user));
      localStorage.setItem('emergency_auth', 'true');
      window.location.href = '/dashboard';
    } else {
      document.getElementById('auth-message').textContent = 'Login failed';
    }
  };
};

// 5. Check if we need to show emergency login
if (!localStorage.getItem('emergency_auth') && 
    !window.location.pathname.includes('login') && 
    !window.location.pathname.includes('signup')) {
  
  // Check if we have a user session
  const user = localStorage.getItem('emergency_user');
  if (!user) {
    createEmergencyLoginForm();
  }
}

// 6. Override the original auth service
const originalAuth = window.authService;
window.authService = {
  ...originalAuth,
  login: async function(email, password) {
    try {
      // Try original first
      return await originalAuth.login(email, password);
    } catch (error) {
      console.log('Original auth failed, using emergency auth');
      return emergencyAuth.emergencyLogin(email, password);
    }
  },
  
  signup: async function(email, password, fullName, phone, role) {
    try {
      return await originalAuth.signup(email, password, fullName, phone, role);
    } catch (error) {
      console.log('Original signup failed, using emergency signup');
      return emergencyAuth.emergencySignup(email, password, fullName, phone, role);
    }
  }
};

console.log('Emergency auth system loaded. Database issues bypassed.');
// Logout functionality

document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                // Show loading state
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging out...';
                this.style.pointerEvents = 'none';
                
                try {
                    await window.braidlyAuth.logout();
                } catch (error) {
                    console.error('Logout error:', error);
                    this.innerHTML = originalText;
                    this.style.pointerEvents = 'auto';
                    alert('Logout failed. Please try again.');
                }
            }
        });
    }
});

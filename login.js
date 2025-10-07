document.addEventListener('DOMContentLoaded', function() {
    const appIcon = document.getElementById('appIcon');
    const loginBtn = document.getElementById('loginBtn');
    const emergencyBtn = document.getElementById('emergencyBtn');
    const loginForm = document.getElementById('loginForm');
    const inputFields = document.querySelectorAll('.input-field');

    // Animation icône
    appIcon.addEventListener('mouseenter', () => {
        appIcon.style.transform = 'scale(1.1) rotate(10deg)';
    });
    appIcon.addEventListener('mouseleave', () => {
        appIcon.style.transform = 'scale(1) rotate(0deg)';
    });

    // Animation inputs
    inputFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.boxShadow = 'inset 0 4px 12px rgba(0, 0, 0, 0.15)';
        });
        field.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
            this.parentElement.style.boxShadow = 'inset 0 3px 8px rgba(0, 0, 0, 0.1)';
        });
    });

    // Soumission du formulaire avec API
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        loginBtn.innerHTML = 'Connexion...';
        loginBtn.style.background = '#4CAF50';
        loginBtn.disabled = true;

        try {
            // Utilisation du client API pour la connexion
            const result = await apiClient.login(username, password);

            if (result.success) {
                loginBtn.innerHTML = '✓ Connecté !';
                loginBtn.classList.add('bounce');

                // Redirection après succès
                setTimeout(() => {
                    window.location.href = "homepage.html";
                }, 1500);
            } else {
                loginBtn.innerHTML = result.message || "Identifiants incorrects";
                loginBtn.style.background = '#D90404';
                loginBtn.disabled = false;
                
                setTimeout(() => {
                    loginBtn.innerHTML = 'Ouvrir';
                    loginBtn.style.background = '#000';
                }, 2000);
            }
        } catch (err) {
            console.error("Erreur:", err);
            loginBtn.innerHTML = "Erreur serveur";
            loginBtn.style.background = '#D90404';
            loginBtn.disabled = false;
            
            setTimeout(() => {
                loginBtn.innerHTML = 'Ouvrir';
                loginBtn.style.background = '#000';
            }, 2000);
        }
    });

    // Bouton urgence
    emergencyBtn.addEventListener('click', async function() {
        this.innerHTML = 'Demande envoyée...';
        this.style.background = '#ff9800';
        this.classList.remove('pulse');
        this.disabled = true;
        
        try {
            // Appel API pour demande d'urgence
            const result = await apiClient.emergencyAccess('Demande d\'accès d\'urgence depuis la page de connexion');
            
            if (result.success) {
                this.innerHTML = '✓ Agent contacté !';
                this.style.background = '#4CAF50';
                this.classList.add('bounce');
                
                setTimeout(() => {
                    this.classList.remove('bounce');
                    this.innerHTML = 'Demande d\'accès';
                    this.style.background = '#D90404';
                    this.classList.add('pulse');
                    this.disabled = false;
                }, 3000);
            } else {
                this.innerHTML = '✗ Erreur';
                this.style.background = '#D90404';
                
                setTimeout(() => {
                    this.innerHTML = 'Demande d\'accès';
                    this.style.background = '#D90404';
                    this.classList.add('pulse');
                    this.disabled = false;
                }, 2000);
            }
        } catch (error) {
            console.error('Erreur demande d\'urgence:', error);
            this.innerHTML = '✗ Erreur serveur';
            this.style.background = '#D90404';
            
            setTimeout(() => {
                this.innerHTML = 'Demande d\'accès';
                this.style.background = '#D90404';
                this.classList.add('pulse');
                this.disabled = false;
            }, 2000);
        }
    });

    // Effet parallaxe
    document.addEventListener('mousemove', function(e) {
        const cards = document.querySelectorAll('.login-card, .emergency-card');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        cards.forEach(card => {
            const moveX = (mouseX - 0.5) * 10;
            const moveY = (mouseY - 0.5) * 10;
            card.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
        });
    });
});

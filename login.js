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

        try {
            const response = await fetch("https://ton-api.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);

                loginBtn.innerHTML = '✓ Connecté !';
                loginBtn.classList.add('bounce');

                setTimeout(() => {
                    window.location.href = "game.html";
                }, 1500);
            } else {
                loginBtn.innerHTML = data.message || "Identifiants incorrects";
                loginBtn.style.background = '#D90404';
                setTimeout(() => {
                    loginBtn.innerHTML = 'Ouvrir';
                    loginBtn.style.background = '#000';
                }, 2000);
            }
        } catch (err) {
            console.error("Erreur:", err);
            loginBtn.innerHTML = "Erreur serveur";
            loginBtn.style.background = '#D90404';
            setTimeout(() => {
                loginBtn.innerHTML = 'Ouvrir';
                loginBtn.style.background = '#000';
            }, 2000);
        }
    });

    // Bouton urgence
    emergencyBtn.addEventListener('click', function() {
        this.innerHTML = 'Demande envoyée...';
        this.style.background = '#ff9800';
        this.classList.remove('pulse');
        
        setTimeout(() => {
            this.innerHTML = '✓ Agent contacté !';
            this.style.background = '#4CAF50';
            this.classList.add('bounce');
            
            setTimeout(() => {
                this.classList.remove('bounce');
                this.innerHTML = 'Demande d\'accès';
                this.style.background = '#D90404';
                this.classList.add('pulse');
            }, 3000);
        }, 2000);
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

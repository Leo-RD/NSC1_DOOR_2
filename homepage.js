document.addEventListener('DOMContentLoaded', function() {
    const menuCard = document.getElementById('menuCard');
    const menuButtons = document.querySelectorAll('.menu-button');
    const badgeBtn = document.getElementById('badgeBtn');
    const passwordBtn = document.getElementById('passwordBtn');
    const registerBtn = document.getElementById('registerBtn');

    // Effet de parallaxe léger
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const moveX = (mouseX - 0.5) * 15;
        const moveY = (mouseY - 0.5) * 15;
        
        menuCard.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
    });

    // Animation de clic pour tous les boutons
    menuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            this.classList.add('clicked');
            
            // Retirer la classe après l'animation
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    });

    // Gestion du bouton "mot de passe oublié"
    passwordBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Animation de chargement
        const originalText = this.innerHTML;
        this.innerHTML = '<span class="menu-button-icon">⏳</span>Redirection...';
        this.style.background = '#ff9800';
        
        setTimeout(() => {
            // Simulation de redirection vers une page de récupération
            alert('Fonctionnalité en cours de développement.\nVeuillez contacter l\'administrateur pour réinitialiser votre mot de passe.');
            
            // Restaurer le bouton
            this.innerHTML = originalText;
            this.style.background = '#000';
        }, 1500);
    });

    // Animation d'entrée personnalisée au chargement
    setTimeout(() => {
        menuButtons.forEach((button, index) => {
            button.style.animationDelay = `${0.5 + index * 0.1}s`;
        });
    }, 100);

    // Effet sonore visuel au survol (vibration légère)
    menuButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (navigator.vibrate) {
                navigator.vibrate(50); // Vibration légère sur mobile
            }
        });
    });

    // Animation de chargement pour les liens
    badgeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const originalText = this.innerHTML;
        this.innerHTML = '<span class="menu-button-icon">⏳</span>Chargement...';
        this.style.background = '#4CAF50';
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 800);
    });

    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const originalText = this.innerHTML;
        this.innerHTML = '<span class="menu-button-icon">⏳</span>Ouverture...';
        this.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        
        setTimeout(() => {
            window.location.href = 'cardform.html';
        }, 800);
    });

    // Effet de particules au clic (optionnel)
    menuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            createClickEffect(e);
        });
    });

    function createClickEffect(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        // Ajouter l'animation CSS si elle n'existe pas
        if (!document.querySelector('#rippleKeyframes')) {
            const style = document.createElement('style');
            style.id = 'rippleKeyframes';
            style.textContent = `
                @keyframes rippleEffect {
                    to {
                        width: 100px;
                        height: 100px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Easter egg : animation spéciale si on clique plusieurs fois rapidement
    let clickCount = 0;
    let clickTimer;

    document.addEventListener('click', function() {
        clickCount++;
        
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            if (clickCount >= 5) {
                // Animation spéciale
                document.body.style.animation = 'backgroundFloat 2s ease-in-out';
                menuCard.style.animation = 'bounce 1s ease';
                
                setTimeout(() => {
                    document.body.style.animation = 'backgroundFloat 20s ease-in-out infinite';
                    menuCard.style.animation = '';
                }, 2000);
            }
            clickCount = 0;
        }, 2000);
    });
});

// Animation CSS supplémentaire pour le bounce
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
        0%, 20%, 60%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-20px);
        }
        80% {
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(bounceStyle);
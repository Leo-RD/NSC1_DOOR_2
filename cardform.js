document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('backBtn');
    const submitBtn = document.getElementById('submitBtn');
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const inputFields = document.querySelectorAll('.input-field, .textarea-field');
    const appIcon = document.getElementById('appIcon');

    // Animation de l'icône au survol
    appIcon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(10deg)';
    });

    appIcon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });

    // Bouton retour
    backBtn.addEventListener('click', function() {
        // Simulation du retour à la page précédente
        if (confirm('Êtes-vous sûr de vouloir revenir à la page de connexion ?')) {
            window.location.href = 'Homepage.html'; // Décommentez pour la vraie navigation
            console.log('Retour à la page de connexion');
        }
    });

    // Animation des champs de saisie
    inputFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.boxShadow = 'inset 0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        field.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
            this.parentElement.style.boxShadow = 'inset 0 3px 8px rgba(0, 0, 0, 0.1)';
        });

        // Animation de frappe
        field.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.background = 'rgba(76, 175, 80, 0.05)';
            } else {
                this.style.background = 'transparent';
            }
        });
    });

    // Soumission du formulaire
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Animation du bouton
        submitBtn.innerHTML = 'Envoi en cours...';
        submitBtn.style.background = '#ff9800';
        submitBtn.disabled = true;

        // Simulation d'envoi
        setTimeout(() => {
            submitBtn.innerHTML = '✓ Demande envoyée !';
            submitBtn.style.background = '#4CAF50';
            submitBtn.classList.add('bounce');

            // Afficher le message de succès
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });

            // Réinitialiser le formulaire
            setTimeout(() => {
                contactForm.reset();
                inputFields.forEach(field => {
                    field.style.background = 'transparent';
                });
                
                submitBtn.classList.remove('bounce');
                submitBtn.innerHTML = 'Envoyer une autre demande';
                submitBtn.style.background = '#666';
                submitBtn.disabled = false;

                setTimeout(() => {
                    successMessage.style.display = 'none';
                    submitBtn.innerHTML = 'Envoyer la demande';
                    submitBtn.style.background = '#000';
                }, 5000);
            }, 3000);
        }, 2000);
    });

    // Effet de parallaxe léger
    document.addEventListener('mousemove', function(e) {
        const cards = document.querySelectorAll('.contact-card, .info-card');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        cards.forEach(card => {
            const moveX = (mouseX - 0.5) * 8;
            const moveY = (mouseY - 0.5) * 8;
            card.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
        });
    });

    // Animation d'entrée au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.contact-card, .info-card').forEach(card => {
        observer.observe(card);
    });
});
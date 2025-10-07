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
        if (confirm('Êtes-vous sûr de vouloir revenir à la page de connexion ?')) {
            window.location.href = 'Homepage.html';
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
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Récupération des données du formulaire
        const formInputs = contactForm.querySelectorAll('.input-field, .textarea-field');
        const userData = {
            fullName: formInputs[0].value.trim(),
            email: formInputs[1].value.trim(),
            phone: formInputs[2].value.trim(),
            company: formInputs[3].value.trim(),
            reason: formInputs[4].value.trim()
        };

        // Animation du bouton
        submitBtn.innerHTML = 'Envoi en cours...';
        submitBtn.style.background = '#ff9800';
        submitBtn.disabled = true;

        try {
            // Appel API pour l'inscription
            const result = await apiClient.register(userData);

            if (result.success) {
                submitBtn.innerHTML = '✓ Demande envoyée !';
                submitBtn.style.background = '#4CAF50';
                submitBtn.classList.add('bounce');

                // Afficher le message de succès
                successMessage.textContent = result.message || '✓ Votre demande a été envoyée avec succès ! Nous vous contacterons sous 48h.';
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
            } else {
                // Erreur de l'API
                submitBtn.innerHTML = '✗ Erreur';
                submitBtn.style.background = '#D90404';
                
                // Afficher le message d'erreur
                successMessage.textContent = '✗ ' + (result.message || 'Erreur lors de l\'envoi de la demande');
                successMessage.style.background = '#D90404';
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({ behavior: 'smooth' });

                setTimeout(() => {
                    submitBtn.innerHTML = 'Envoyer la demande';
                    submitBtn.style.background = '#000';
                    submitBtn.disabled = false;
                    successMessage.style.display = 'none';
                    successMessage.style.background = '#4CAF50';
                }, 3000);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            
            submitBtn.innerHTML = '✗ Erreur serveur';
            submitBtn.style.background = '#D90404';
            
            successMessage.textContent = '✗ Erreur de connexion au serveur. Veuillez réessayer.';
            successMessage.style.background = '#D90404';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                submitBtn.innerHTML = 'Envoyer la demande';
                submitBtn.style.background = '#000';
                submitBtn.disabled = false;
                successMessage.style.display = 'none';
                successMessage.style.background = '#4CAF50';
            }, 3000);
        }
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
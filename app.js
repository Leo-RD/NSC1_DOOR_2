// Variables pour simuler l'état du système
        let loginAttempts = 0;
        const maxAttempts = 3;

        // Gestion du formulaire de connexion
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showMessage('Veuillez remplir tous les champs', 'error');
                return;
            }
            
            // Simulation de la vérification
            authenticateUser(username, password);
        });

        function authenticateUser(username, password) {
            const loginBtn = document.querySelector('.login-btn');
            loginBtn.innerHTML = '🔄 Vérification...';
            loginBtn.disabled = true;
            
            // Simulation d'un délai de vérification
            setTimeout(() => {
                loginAttempts++;
                
                // Simulation de connexion (remplacer par la vraie logique)
                if (username === 'admin' && password === 'secure123') {
                    showMessage('✅ Accès autorisé! Ouverture de la porte...', 'success');
                    setTimeout(() => {
                        unlockDoor();
                    }, 2000);
                } else {
                    showMessage(`❌ Identifiants incorrects (${loginAttempts}/${maxAttempts})`, 'error');
                    
                    if (loginAttempts >= maxAttempts) {
                        lockSystem();
                    }
                }
                
                loginBtn.innerHTML = '🔓 Déverrouiller la porte';
                loginBtn.disabled = false;
            }, 1500);
        }

        function unlockDoor() {
            const container = document.querySelector('.login-container');
            container.innerHTML = `
                <div class="logo-section">
                    <div class="lock-icon" style="background: linear-gradient(45deg, #4CAF50, #45a049); animation: none;">
                        <span style="font-size: 24px;">✅</span>
                    </div>
                    <h1 style="color: #4CAF50;">Accès Autorisé</h1>
                    <p class="subtitle">La porte a été déverrouillée avec succès</p>
                </div>
                <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0; color: #155724;">
                    <h3>🚪 Porte ouverte</h3>
                    <p>Vous avez 30 secondes pour passer</p>
                    <div style="margin-top: 15px; font-size: 18px; font-weight: bold;" id="countdown">30</div>
                </div>
                <button onclick="location.reload()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    Nouvelle connexion
                </button>
            `;
            
            // Décompte
            let timeLeft = 30;
            const countdownInterval = setInterval(() => {
                timeLeft--;
                const countdownEl = document.getElementById('countdown');
                if (countdownEl) {
                    countdownEl.textContent = timeLeft;
                }
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    location.reload();
                }
            }, 1000);
        }

        function lockSystem() {
            showMessage('🔒 Système verrouillé pour 5 minutes suite à de multiples tentatives', 'error');
            document.getElementById('loginForm').style.opacity = '0.5';
            document.getElementById('loginForm').style.pointerEvents = 'none';
            
            setTimeout(() => {
                location.reload();
            }, 300000); // 5 minutes
        }

        function requestEmergencyAccess() {
            if (confirm('Demander un accès d\'urgence?\nCette action sera enregistrée et nécessite une justification.')) {
                showMessage('🚨 Demande d\'urgence envoyée. Un agent sera notifié.', 'warning');
                
                // Ici on pourrait envoyer une notification aux responsables sécurité
                setTimeout(() => {
                    alert('Un agent de sécurité vous contactera sous peu.');
                }, 2000);
            }
        }

        function showMessage(message, type) {
            // Supprimer les anciens messages
            const existingMessage = document.querySelector('.message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.textContent = message;
            
            const colors = {
                success: '#d4edda',
                error: '#f8d7da',
                warning: '#fff3cd'
            };
            
            const textColors = {
                success: '#155724',
                error: '#721c24',
                warning: '#856404'
            };
            
            messageDiv.style.cssText = `
                background: ${colors[type]};
                color: ${textColors[type]};
                padding: 12px;
                border-radius: 8px;
                margin: 15px 0;
                font-size: 14px;
                border: 1px solid;
                animation: slideIn 0.3s ease-out;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
            
            document.querySelector('.login-container').insertBefore(messageDiv, document.getElementById('loginForm'));
            
            // Supprimer le message après 5 secondes
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }

        // Animation d'entrée
        window.addEventListener('load', () => {
            document.querySelector('.login-container').style.animation = 'fadeInUp 0.6s ease-out';
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        });

        // Détection de badge NFC simulée
        setInterval(() => {
            // Ici vous pourriez intégrer une vraie détection NFC
            // Pour la démo, on simule une détection aléatoire
            if (Math.random() < 0.1) { // 10% de chance
                const nfcStatus = document.querySelector('.nfc-status');
                if (nfcStatus) {
                    nfcStatus.innerHTML = '📱 Badge NFC détecté! Redirection...';
                    nfcStatus.style.background = '#d4edda';
                    nfcStatus.style.borderColor = '#c3e6cb';
                    nfcStatus.style.color = '#155724';
                    
                    setTimeout(() => {
                        // Simulation de redirection vers l'authentification NFC
                        showMessage('Authentification NFC en cours...', 'success');
                    }, 1000);
                }
            }
        }, 5000);
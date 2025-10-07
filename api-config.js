/**
 * Configuration de l'API NSC1
 * Gestion de l'authentification JWT et des appels API
 */

const API_CONFIG = {
    BASE_URL: 'https://kasalali.alwaysdata.net/API_NSC1',
    JWT_USERNAME: 'NSC1_API',
    JWT_PASSWORD: 'Jone_Porte!87-/',
    ENDPOINTS: {
        // Endpoints existants dans votre API
        LOGIN: '/login',                    // Authentification JWT
        PERSONNES: '/personnes',            // CRUD personnes
        ACCES_LOG: '/acces_log',           // Logs d'accès
        DROIT_ACCES: '/droit_acces',       // Droits d'accès
        PORTES: '/portes',                 // Gestion des portes
        
        // Endpoints pour les fonctionnalités web (à créer ou simuler)
        REGISTER: '/personnes',             // Utilise POST /personnes pour l'inscription
        EMERGENCY: '/acces_log'             // Utilise POST /acces_log pour les urgences
    }
};

/**
 * Classe pour gérer les appels API avec authentification JWT
 */
class APIClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.token = this.getStoredToken();
        this.refreshToken = this.getStoredRefreshToken();
    }

    /**
     * Récupère le token JWT stocké
     */
    getStoredToken() {
        return localStorage.getItem('jwt_token');
    }

    /**
     * Récupère le refresh token stocké
     */
    getStoredRefreshToken() {
        return localStorage.getItem('refresh_token');
    }

    /**
     * Stocke les tokens
     */
    storeTokens(token, refreshToken = null) {
        localStorage.setItem('jwt_token', token);
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }
        this.token = token;
        this.refreshToken = refreshToken;
    }

    /**
     * Supprime les tokens
     */
    clearTokens() {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('refresh_token');
        this.token = null;
        this.refreshToken = null;
    }

    /**
     * Obtient un token JWT initial pour l'API
     */
    async getAPIToken() {
        try {
            const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: API_CONFIG.JWT_USERNAME,
                    password: API_CONFIG.JWT_PASSWORD
                })
            });

            if (!response.ok) {
                throw new Error('Impossible d\'obtenir le token API');
            }

            const data = await response.json();
            return data.token;
        } catch (error) {
            console.error('Erreur lors de l\'obtention du token API:', error);
            throw error;
        }
    }

    /**
     * Effectue une requête API avec gestion automatique du token
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Préparer les headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Ajouter le token si disponible
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            // Si le token a expiré (401), essayer de le rafraîchir
            if (response.status === 401 && this.refreshToken) {
                const newToken = await this.refreshAccessToken();
                if (newToken) {
                    headers['Authorization'] = `Bearer ${newToken}`;
                    // Réessayer la requête avec le nouveau token
                    return await fetch(url, {
                        ...options,
                        headers
                    });
                }
            }

            return response;
        } catch (error) {
            console.error('Erreur lors de la requête API:', error);
            throw error;
        }
    }

    /**
     * Rafraîchit le token d'accès
     * Note: Votre API n'a pas de refresh token, on génère un nouveau token
     */
    async refreshAccessToken() {
        try {
            // Votre API n'a pas de refresh token, on se reconnecte avec les credentials API
            const newToken = await this.getAPIToken();
            if (newToken) {
                this.storeTokens(newToken);
                return newToken;
            }
            this.clearTokens();
            return null;
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            this.clearTokens();
            return null;
        }
    }

    /**
     * Connexion utilisateur
     * Note: Votre API utilise uniquement JWT avec credentials fixes
     * Cette méthode obtient le token JWT pour accéder aux ressources protégées
     */
    async login(username, password) {
        try {
            // Obtenir le token JWT
            const token = await this.getAPIToken();
            
            if (token) {
                // Stocker le token
                this.storeTokens(token);
                
                // Stocker les informations de connexion
                localStorage.setItem('user_info', JSON.stringify({
                    username: API_CONFIG.JWT_USERNAME,
                    authenticated: true,
                    timestamp: new Date().toISOString()
                }));

                return {
                    success: true,
                    token: token,
                    message: 'Connexion réussie'
                };
            } else {
                return {
                    success: false,
                    message: 'Identifiants incorrects'
                };
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            return {
                success: false,
                message: error.message || 'Erreur de connexion au serveur'
            };
        }
    }

    /**
     * Inscription utilisateur / Demande d'accès
     * Utilise POST /personnes pour créer une nouvelle personne
     * Structure adaptée à votre base de données neo_door
     */
    async register(userData) {
        try {
            // Obtenir un token si nécessaire
            if (!this.token) {
                await this.getAPIToken();
            }

            // Adapter les données au format de votre table personne
            const personneData = {
                prenom: userData.fullName ? userData.fullName.split(' ')[0] : '',
                nom: userData.fullName ? userData.fullName.split(' ').slice(1).join(' ') : '',
                email: userData.email,
                organisation: userData.company,
                motif_demande: userData.reason,
                telephone: userData.phone,
                type_personne: 'visiteur',  // Type par défaut pour les demandes web
                actif: 0  // Inactif par défaut, en attente d'approbation
            };

            const response = await this.request(API_CONFIG.ENDPOINTS.REGISTER, {
                method: 'POST',
                body: JSON.stringify(personneData)
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data,
                    message: 'Demande envoyée avec succès ! Vous serez contacté sous 48h.'
                };
            } else {
                return {
                    success: false,
                    message: data.error || 'Erreur lors de l\'envoi de la demande'
                };
            }
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur'
            };
        }
    }

    /**
     * Demande d'accès d'urgence
     * Utilise POST /acces_log pour enregistrer une demande d'urgence
     * Structure adaptée à votre table acces_log
     */
    async emergencyAccess(reason = '') {
        try {
            // Obtenir un token si nécessaire
            if (!this.token) {
                await this.getAPIToken();
            }

            // Créer un log d'accès pour la demande d'urgence
            const logData = {
                id_personne: null,  // Pas de personne identifiée pour une urgence
                id_porte: null,     // Pas de porte spécifique
                evenement: 'ERREUR', // Utilise ERREUR pour signaler une urgence
                lecteur_uid: null,
                details: JSON.stringify({
                    type: 'DEMANDE_URGENCE',
                    reason: reason,
                    timestamp: new Date().toISOString(),
                    source: 'web_interface'
                })
            };

            const response = await this.request(API_CONFIG.ENDPOINTS.EMERGENCY, {
                method: 'POST',
                body: JSON.stringify(logData)
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data,
                    message: 'Demande d\'urgence envoyée ! Un agent va vous contacter.'
                };
            } else {
                return {
                    success: false,
                    message: data.error || 'Erreur lors de la demande'
                };
            }
        } catch (error) {
            console.error('Erreur de demande d\'urgence:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur'
            };
        }
    }

    /**
     * Récupère les informations d'une personne par ID
     * Utilise GET /personnes/{id}
     */
    async getUserInfo(id_personne = null) {
        try {
            // Obtenir un token si nécessaire
            if (!this.token) {
                await this.getAPIToken();
            }

            // Si pas d'ID fourni, retourner les infos de connexion
            if (!id_personne) {
                const userInfo = localStorage.getItem('user_info');
                return {
                    success: true,
                    data: userInfo ? JSON.parse(userInfo) : null
                };
            }

            const response = await this.request(`${API_CONFIG.ENDPOINTS.PERSONNES}/${id_personne}`, {
                method: 'GET'
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    message: data.error || 'Impossible de récupérer les informations'
                };
            }
        } catch (error) {
            console.error('Erreur de récupération des infos:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur'
            };
        }
    }

    /**
     * Récupère toutes les personnes
     * Utilise GET /personnes
     */
    async getAllPersonnes() {
        try {
            if (!this.token) {
                await this.getAPIToken();
            }

            const response = await this.request(API_CONFIG.ENDPOINTS.PERSONNES, {
                method: 'GET'
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    message: data.error || 'Impossible de récupérer les personnes'
                };
            }
        } catch (error) {
            console.error('Erreur:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur'
            };
        }
    }

    /**
     * Récupère les logs d'accès
     * Utilise GET /acces_log
     */
    async getAccessLogs() {
        try {
            if (!this.token) {
                await this.getAPIToken();
            }

            const response = await this.request(API_CONFIG.ENDPOINTS.ACCES_LOG, {
                method: 'GET'
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    message: data.error || 'Impossible de récupérer les logs'
                };
            }
        } catch (error) {
            console.error('Erreur:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur'
            };
        }
    }

    /**
     * Déconnexion
     */
    logout() {
        this.clearTokens();
        localStorage.removeItem('user_info');
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    isAuthenticated() {
        return !!this.token;
    }
}

// Instance globale du client API
const apiClient = new APIClient();

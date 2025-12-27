/* ========================================
   js/api.js - API Service Layer
   ======================================== */

const API = {
    /**
     * Realiza una petición GET a la API
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    },

    /**
     * Realiza una petición POST a la API
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error posting to ${endpoint}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene información personal
     */
    async getPersonalInfo() {
        return await this.get(CONFIG.ENDPOINTS.PERSONAL_INFO);
    },

    /**
     * Obtiene todas las experiencias
     */
    async getExperiences() {
        const response = await this.get(CONFIG.ENDPOINTS.EXPERIENCE);
        return response.experiences || [];
    },

    /**
     * Obtiene todas las habilidades
     */
    async getSkills() {
        const response = await this.get(CONFIG.ENDPOINTS.SKILLS);
        return response.skills || [];
    },

    /**
     * Obtiene habilidades por categoría
     */
    async getSkillsByCategory(category) {
        const response = await this.get(`${CONFIG.ENDPOINTS.SKILLS}/category/${category}`);
        return response.skills || [];
    },

    /**
     * Obtiene toda la educación
     */
    async getEducation() {
        const response = await this.get(CONFIG.ENDPOINTS.EDUCATION);
        return response.education || [];
    },

    /**
     * Obtiene todos los proyectos
     */
    async getProjects(limit = null) {
        const url = limit 
            ? `${CONFIG.ENDPOINTS.PROJECTS}?limit=${limit}` 
            : CONFIG.ENDPOINTS.PROJECTS;
        const response = await this.get(url);
        return response.projects || [];
    },

    /**
     * Envía el formulario de contacto (simulado)
     */
    async sendContactForm(data) {
        // Por ahora solo simula el envío
        console.log('Contact form data:', data);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Mensaje enviado correctamente' });
            }, 1000);
        });
    }
};

// Exportar API
window.API = API;
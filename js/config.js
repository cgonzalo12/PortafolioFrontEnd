/* ========================================
   js/config.js - API Configuration
   ======================================== */

const CONFIG = {
    // URL base de tu API (HTTPS)
    API_BASE_URL: 'https://portafolio-x5gx.onrender.com/api',
    
    // Endpoints
    ENDPOINTS: {
        PERSONAL_INFO: '/personalinfo',
        EXPERIENCE: '/experience',
        SKILLS: '/skill',  
        EDUCATION: '/education',
        PROJECTS: '/project'  
    },
    
    // Configuración de requests
    REQUEST_TIMEOUT: 10000, // 10 segundos
    
    // Placeholders para imágenes
    PLACEHOLDER_PROFILE: 'https://via.placeholder.com/400x400/00d9ff/0a0a0a?text=Profile',
    PLACEHOLDER_PROJECT: 'https://via.placeholder.com/600x400/00d9ff/0a0a0a?text=Project'
};

// Exportar configuración
window.CONFIG = CONFIG;
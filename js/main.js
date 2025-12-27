/* ========================================
   js/main.js - Main Application Logic
   ======================================== */

// Función para formatear fechas
function formatDate(dateString) {
    if (!dateString) return 'Presente';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('es-ES', options);
}

// Función para calcular nivel de skill en porcentaje
function getSkillPercentage(level) {
    return (level * 20); // level 1-5 = 20%-100%
}

// ====================================
// CARGAR INFORMACIÓN PERSONAL
// ====================================
async function loadPersonalInfo() {
    try {
        const data = await API.getPersonalInfo();
        
        if (data) {
            // Hero Section
            document.getElementById('hero-name').textContent = data.fullName || 'Tu Nombre';
            document.getElementById('hero-title').textContent = data.title || 'Desarrollador';
            document.getElementById('hero-bio').textContent = data.bio || 'Descripción profesional';
            
            // About Section
            document.getElementById('about-description').textContent = data.bio || 'Sin descripción';
            document.getElementById('about-email').textContent = data.email || '-';
            document.getElementById('about-phone').textContent = data.phone || '-';
            document.getElementById('about-location').textContent = data.location || '-';
            
            // Profile Image
            // if (data.profileImageUrl) {
            //     document.getElementById('profile-image').src = data.profileImageUrl;
            // }
            
            // Social Links
            const socialLinksHtml = `
                ${data.linkedInUrl ? `<a href="${data.linkedInUrl}" target="_blank" rel="noopener"><i class="bi bi-linkedin"></i></a>` : ''}
                ${data.gitHubUrl ? `<a href="${data.gitHubUrl}" target="_blank" rel="noopener"><i class="bi bi-github"></i></a>` : ''}
                ${data.email ? `<a href="mailto:${data.email}"><i class="bi bi-envelope-fill"></i></a>` : ''}
            `;
            document.getElementById('social-links').innerHTML = socialLinksHtml;
            document.getElementById('footer-social').innerHTML = socialLinksHtml;
        }
    } catch (error) {
        console.error('Error loading personal info:', error);
        showError('personal-info');
    }
}

// ====================================
// CARGAR EXPERIENCIAS
// ====================================
async function loadExperiences() {
    const container = document.getElementById('experience-list');
    
    try {
        const experiences = await API.getExperiences();
        
        if (experiences.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No hay experiencias disponibles</p>';
            return;
        }
        
        const html = experiences.map(exp => `
            <div class="experience-item fade-in-up">
                <h4 class="mb-2">${exp.position}</h4>
                <h5 class="text-primary mb-2">${exp.company}</h5>
                <p class="text-muted mb-2">
                    <i class="bi bi-calendar-event me-2"></i>
                    ${formatDate(exp.startDate)} - ${exp.isCurrentJob ? 'Presente' : formatDate(exp.endDate)}
                    ${exp.location ? `<i class="bi bi-geo-alt ms-3 me-2"></i>${exp.location}` : ''}
                </p>
                <p class="mb-0">${exp.description || ''}</p>
            </div>
        `).join('');
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading experiences:', error);
        container.innerHTML = '<p class="text-center text-danger">Error al cargar experiencias</p>';
    }
}

// ====================================
// CARGAR HABILIDADES
// ====================================
async function loadSkills() {
    const container = document.getElementById('skills-container');
    
    try {
        const skills = await API.getSkills();
        
        if (skills.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No hay habilidades disponibles</p>';
            return;
        }
        
        // Agrupar por categoría
        const categories = {};
        skills.forEach(skill => {
            if (!categories[skill.category]) {
                categories[skill.category] = [];
            }
            categories[skill.category].push(skill);
        });
        
        let html = '';
        
        // Renderizar por categorías
        for (const [category, categorySkills] of Object.entries(categories)) {
            html += `
                <div class="mb-4">
                    <h4 class="mb-3 text-primary">${category}</h4>
                    <div class="row">
            `;
            
            categorySkills.forEach(skill => {
                const percentage = getSkillPercentage(skill.level);
                html += `
                    <div class="col-md-6 mb-3">
                        <div class="skill-item">
                            <div class="skill-name">
                                <span>${skill.name}</span>
                                <span>${percentage}%</span>
                            </div>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" 
                                     style="width: ${percentage}%" 
                                     aria-valuenow="${percentage}" 
                                     aria-valuemin="0" 
                                     aria-valuemax="100">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading skills:', error);
        container.innerHTML = '<p class="text-center text-danger">Error al cargar habilidades</p>';
    }
}

// ====================================
// CARGAR PROYECTOS
// ====================================
async function loadProjects() {
    const container = document.getElementById('projects-list');
    
    try {
        const projects = await API.getProjects();
        
        if (projects.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-center text-muted">No hay proyectos disponibles</p></div>';
            return;
        }
        
        const html = projects.map(project => {
            const techs = project.technologies ? project.technologies.split(',').map(t => t.trim()) : [];
            
            return `
                <div class="col-md-6 col-lg-4 fade-in-up">
                    <div class="card project-card">
                        <img src="${project.imageUrl || CONFIG.PLACEHOLDER_PROJECT}" 
                             class="card-img-top" 
                             alt="${project.title}"
                             onerror="this.src='${CONFIG.PLACEHOLDER_PROJECT}'">
                        <div class="card-body">
                            <h5 class="card-title">${project.title}</h5>
                            <p class="card-text">${project.description || 'Sin descripción'}</p>
                            <div class="mb-3">
                                ${techs.map(tech => `<span class="project-tech">${tech}</span>`).join('')}
                            </div>
                            <div class="d-flex gap-2">
                                ${project.liveUrl ? `
                                    <a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-primary">
                                        <i class="bi bi-eye-fill me-1"></i>Demo
                                    </a>
                                ` : ''}
                                ${project.gitHubUrl ? `
                                    <a href="${project.gitHubUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-github me-1"></i>Código
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = '<div class="col-12"><p class="text-center text-danger">Error al cargar proyectos</p></div>';
    }
}

// ====================================
// CARGAR EDUCACIÓN
// ====================================
async function loadEducation() {
    const container = document.getElementById('education-list');
    
    try {
        const education = await API.getEducation();
        
        if (education.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No hay educación disponible</p>';
            return;
        }
        
        const html = education.map(edu => `
            <div class="education-item fade-in-up">
                <h4 class="mb-2">${edu.degree}</h4>
                <h5 class="text-secondary mb-2">${edu.institution}</h5>
                <p class="text-muted mb-2">
                    <i class="bi bi-calendar-event me-2"></i>
                    ${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Presente'}
                </p>
                ${edu.fieldOfStudy ? `<p class="mb-2"><strong>Campo:</strong> ${edu.fieldOfStudy}</p>` : ''}
                ${edu.description ? `<p class="mb-0">${edu.description}</p>` : ''}
            </div>
        `).join('');
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading education:', error);
        container.innerHTML = '<p class="text-center text-danger">Error al cargar educación</p>';
    }
}

// ====================================
// FORMULARIO DE CONTACTO
// ====================================
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Deshabilitar botón
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
            
            // Obtener datos del formulario
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Enviar (simulado por ahora)
            await API.sendContactForm(formData);
            
            // Mostrar mensaje de éxito
            showAlert('Mensaje enviado correctamente. Te contactaré pronto!', 'success');
            
            // Limpiar formulario
            form.reset();
            
        } catch (error) {
            console.error('Error sending contact form:', error);
            showAlert('Error al enviar el mensaje. Intenta nuevamente.', 'danger');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// ====================================
// UTILIDADES
// ====================================
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Smooth scroll para los links del navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Cerrar navbar en mobile
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// Cambiar navbar al hacer scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 217, 255, 0.3)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 217, 255, 0.1)';
    }
});

// ====================================
// INICIALIZACIÓN
// ====================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando Portfolio...');
    
    // Cargar todos los datos
    await Promise.all([
        loadPersonalInfo(),
        loadExperiences(),
        loadSkills(),
        loadProjects(),
        loadEducation()
    ]);
    
    // Configurar formulario de contacto
    setupContactForm();
    
    console.log('✅ Portfolio cargado correctamente');
});

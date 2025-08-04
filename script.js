// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Referencias a Elementos del DOM ---
    const logoContainer = document.getElementById('logo-container'); // Contenedor del logo
    const logo = document.getElementById('logo');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const lazyVideos = document.querySelectorAll('.lazy-video');
    
    // Referencia a todos los enlaces de navegación con la clase 'smooth-scroll-link'
    const smoothScrollLinks = document.querySelectorAll('.smooth-scroll-link');

    // --- Funcionalidad del Efecto de Agua en el Logo ---
    if (logo) {
        logo.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            logo.appendChild(ripple);
            const rect = logo.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            setTimeout(() => ripple.remove(), 600);
        });
    }

    // --- Funcionalidad del Menú Móvil (con movimiento del logo) ---
    if (menuBtn && mobileMenu && logoContainer) {
        menuBtn.addEventListener('click', () => {
            // Alternar clases para la transición del menú
            mobileMenu.classList.toggle('opacity-0');
            mobileMenu.classList.toggle('-translate-y-4');
            mobileMenu.classList.toggle('pointer-events-none');
            
            // Alternar clase para mover el logo
            logoContainer.classList.toggle('logo-moved');
        });
    }

    // --- Optimización de Carga de Videos (Lazy Loading) ---
    if ("IntersectionObserver" in window) {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    video.src = video.dataset.src;
                    observer.unobserve(video);
                }
            });
        });
        lazyVideos.forEach(video => videoObserver.observe(video));
    } else {
        lazyVideos.forEach(video => video.src = video.dataset.src);
    }

    // --- Animación de desplazamiento suave (con cierre de menú y logo) ---
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Si el menú móvil está abierto, ciérralo y devuelve el logo a su sitio
                if (mobileMenu && !mobileMenu.classList.contains('opacity-0')) {
                    mobileMenu.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
                    if (logoContainer) {
                        logoContainer.classList.remove('logo-moved');
                    }
                }
                
                const startPosition = window.pageYOffset;
                const targetPosition = targetElement.offsetTop;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let startTime = null;

                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const t = timeElapsed / duration;
                    const progress = 1 - Math.pow(1 - t, 4);

                    window.scrollTo(0, startPosition + distance * progress);

                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                requestAnimationFrame(animation);
            }
        });
    });
});
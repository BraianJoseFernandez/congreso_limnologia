document.addEventListener('DOMContentLoaded', () => {
    
    // --- Referencias a Elementos del DOM ---
    const logoContainer = document.getElementById('logo-container');
    const logo = document.getElementById('logo');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const smoothScrollLinks = document.querySelectorAll('.smooth-scroll-link');

    // --- Funcionalidad del Logo y Menú (sin cambios) ---
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

    if (menuBtn && mobileMenu && logoContainer) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('opacity-0');
            mobileMenu.classList.toggle('-translate-y-4');
            mobileMenu.classList.toggle('pointer-events-none');
            logoContainer.classList.toggle('logo-moved');
        });
    }

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
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

    // --- LÓGICA PARA VIDEOS LOCALES ---
    document.querySelectorAll('.video-wrapper').forEach(wrapper => {
        const video = wrapper.querySelector('.local-video');
        const playButton = wrapper.querySelector('.play-button-overlay');

        if (video && playButton) {
            // 1. Controlar el clic en el botón de Play
            playButton.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });

            // 2. Ocultar overlays cuando el video se reproduce
            video.addEventListener('play', () => {
                wrapper.classList.remove('show-overlays');
            });

            // 3. Mostrar overlays cuando el video se pausa
            video.addEventListener('pause', () => {
                wrapper.classList.add('show-overlays');
            });

            // 4. Mostrar overlays cuando el video termina
            video.addEventListener('ended', () => {
                wrapper.classList.add('show-overlays');
            });
        }
    });
});
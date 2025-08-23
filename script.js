document.addEventListener("DOMContentLoaded", () => {
  // --- Lógica para el menú principal móvil (hamburguesa) ---
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("opacity-0");
      mobileMenu.classList.toggle("-translate-y-4");
      mobileMenu.classList.toggle("pointer-events-none");
    });
  }

  // --- Lógica para el submenú de galería en móvil ---
  const galleryBtn = document.getElementById("mobile-gallery-btn");
  const gallerySubmenu = document.getElementById("mobile-gallery-submenu");
  const galleryArrow = document.getElementById("mobile-gallery-arrow");

  if (galleryBtn && gallerySubmenu && galleryArrow) {
    galleryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      gallerySubmenu.classList.toggle("hidden");
      galleryArrow.classList.toggle("rotate-180");
    });
  }

  // --- Lógica para el scroll suave (solo para anclas en la misma página) ---
  document.querySelectorAll(".smooth-scroll-link").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href.startsWith("#")) return;
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        if (mobileMenu && !mobileMenu.classList.contains("opacity-0")) {
          mobileMenu.classList.add("opacity-0", "-translate-y-4", "pointer-events-none");
        }
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // --- Lógica para el Modal de Video ---
  const videoModal = document.getElementById('video-modal');
  const modalContent = document.getElementById('modal-content');
  const modalIframe = document.getElementById('modal-video-iframe');
  const closeModalBtn = document.getElementById('modal-close-btn');

  function openModal(youtubeId) {
    if (!videoModal || !modalIframe) return;
    
    // Construye la URL de embed de YouTube con autoplay y sin videos relacionados
    modalIframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    videoModal.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-95');
    document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
  }

  function closeModal() {
    if (!videoModal || !modalIframe) return;

    // Limpiar el src del iframe detiene la reproducción del video.
    modalIframe.src = "";
    videoModal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.add('scale-95');
    document.body.style.overflow = ''; // Restaura el scroll
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  if (videoModal) {
    // Cierra el modal si se hace clic en el fondo (el backdrop)
    videoModal.addEventListener('click', (e) => e.target === videoModal && closeModal());
  }

  // --- FUNCIÓN PARA INICIALIZAR REPRODUCTORES DE VIDEO ---
  // Esta función se llamará cada vez que se cargue nuevo contenido de video.
  function initializeVideoPlayers() {
    const videoWrappers = document.querySelectorAll(".video-wrapper[data-youtube-id]");
    videoWrappers.forEach((wrapper) => {
      const playButtonOverlay = wrapper.querySelector(".play-button-overlay");
      const youtubeId = wrapper.dataset.youtubeId;

      if (playButtonOverlay && youtubeId) {
        // Prevenir que múltiples listeners se agreguen al mismo botón
        const newPlayButton = playButtonOverlay.cloneNode(true);
        playButtonOverlay.parentNode.replaceChild(newPlayButton, playButtonOverlay);

        newPlayButton.addEventListener("click", () => {
          // Al hacer clic en el botón de play, abre el modal con el ID de YouTube
          openModal(youtubeId);
        });
      }
    });
  }

  // --- FUNCIÓN PARA CARGAR CONTENIDO DEL DÍA (AJAX) ---
  let isFirstLoad = true; // Flag para manejar la carga inicial de forma diferente
  async function loadDayContent(day) {
    const url = `dias_congreso/${day}.html`;
    const targetContainer = document.getElementById('videos');
    if (!targetContainer) return;

    // 1. Inicia la animación de desvanecimiento (fade-out)
    targetContainer.classList.add('fading');

    // Espera a que termine el fade-out, pero no en la carga inicial
    if (!isFirstLoad) {
      await new Promise(resolve => setTimeout(resolve, 400)); // Coincide con la duración en CSS
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('No se pudo cargar el archivo del día.');
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.querySelector('main');

      if (newContent) {
        // 2. Reemplaza el contenido (aún está invisible por la clase 'fading')
        targetContainer.innerHTML = newContent.innerHTML;
        initializeVideoPlayers();

        // 3. Desplázate a la sección y haz que aparezca (fade-in)
        if (!isFirstLoad) {
          targetContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        targetContainer.classList.remove('fading'); // Quita la clase para iniciar el fade-in
      } else {
        throw new Error('El archivo del día no tiene el formato esperado.');
      }
    } catch (error) {
      console.error('Error al cargar el día:', error);
      targetContainer.innerHTML = '<div class="container mx-auto px-6 text-center py-16"><p class="text-red-500">Lo sentimos, no se pudo cargar el contenido.</p></div>';
      targetContainer.classList.remove('fading'); // Muestra el mensaje de error con fade-in
    } finally {
      isFirstLoad = false; // Las cargas posteriores no son la primera
    }
  }

  // --- EVENT LISTENERS PARA LOS ENLACES DE LOS DÍAS ---
  document.querySelectorAll('.day-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const day = this.dataset.day;
      if (day) {
        loadDayContent(day);
      }
      // Opcional: cerrar menú móvil si está abierto
      if (mobileMenu && !mobileMenu.classList.contains("opacity-0")) {
        mobileMenu.classList.add("opacity-0", "-translate-y-4", "pointer-events-none");
      }
    });
  });

  // --- INICIALIZACIÓN INICIAL ---
  const videosContainer = document.getElementById('videos');
  if (videosContainer) {
    // Prepara el contenedor para que comience invisible antes de la primera carga
    videosContainer.classList.add('fading');
  }
  loadDayContent('dia1'); // Carga el contenido del día 1 por defecto al iniciar la página
});
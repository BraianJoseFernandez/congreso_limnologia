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

  // --- FUNCIÓN PARA INICIALIZAR REPRODUCTORES DE VIDEO ---
  // Esta función se llamará cada vez que se cargue nuevo contenido de video.
  function initializeVideoPlayers() {
    const videoWrappers = document.querySelectorAll(".video-wrapper");
    videoWrappers.forEach((wrapper) => {
      const video = wrapper.querySelector("video.local-video");
      const playButtonOverlay = wrapper.querySelector(".play-button-overlay");

      if (video && playButtonOverlay) {
        // Prevenir que múltiples listeners se agreguen al mismo botón
        const newPlayButton = playButtonOverlay.cloneNode(true);
        playButtonOverlay.parentNode.replaceChild(newPlayButton, playButtonOverlay);

        newPlayButton.addEventListener("click", () => video.play());

        video.addEventListener("play", () => wrapper.classList.remove("show-overlays"));
        video.addEventListener("pause", () => {
          if (video.currentTime > 0 && !video.ended) {
            wrapper.classList.add("show-overlays");
          }
        });
        video.addEventListener("ended", () => {
          wrapper.classList.add("show-overlays");
          video.currentTime = 0;
          video.load();
        });
      }
    });
  }

  // --- FUNCIÓN PARA CARGAR CONTENIDO DEL DÍA (AJAX) ---
  async function loadDayContent(day) {
    const url = `dias_congreso/${day}.html`;
    const targetContainer = document.getElementById('videos'); // La sección donde se cargará el contenido
    if (!targetContainer) return;

    // Opcional: Mostrar un indicador de carga
    targetContainer.innerHTML = '<div class="container mx-auto px-6 text-center"><p class="text-lg text-blue-600">Cargando contenido...</p></div>';

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('No se pudo cargar el archivo del día.');
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.querySelector('main'); // Extraemos solo el <main> del archivo del día

      if (newContent) {
        targetContainer.innerHTML = newContent.innerHTML;
        initializeVideoPlayers(); // Re-inicializamos los videos para el nuevo contenido
        targetContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        throw new Error('El archivo del día no tiene el formato esperado.');
      }
    } catch (error) {
      console.error('Error al cargar el día:', error);
      targetContainer.innerHTML = '<div class="container mx-auto px-6 text-center"><p class="text-red-500">Lo sentimos, no se pudo cargar el contenido.</p></div>';
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
  initializeVideoPlayers(); // Llama a la función para los videos que ya están en la página principal
});
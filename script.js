document.addEventListener("DOMContentLoaded", () => {
  const moveDateInput = document.getElementById("moveDate");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuLinks = document.querySelectorAll("#mobileMenu a");

  if (moveDateInput) {
    const today = new Date().toISOString().split("T")[0];
    moveDateInput.min = today;
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      const clickedToggle = menuToggle.contains(e.target);
      const clickedMenu = mobileMenu.contains(e.target);

      if (!clickedToggle && !clickedMenu) {
        mobileMenu.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const galleryImages = Array.from(document.querySelectorAll(".gallery-image"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function showImage(index) {
    if (!galleryImages.length) return;

    currentIndex = (index + galleryImages.length) % galleryImages.length;
    const img = galleryImages[currentIndex];

    if (lightboxImage) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || "";
    }
  }

  function openLightbox(index) {
    if (!lightbox) return;
    showImage(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => showImage(currentIndex - 1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => showImage(currentIndex + 1));
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    lightbox.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > 50) {
          if (diff < 0) {
            showImage(currentIndex + 1);
          } else {
            showImage(currentIndex - 1);
          }
        }
      },
      { passive: true }
    );
  }

  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  });
});
document.addEventListener('DOMContentLoaded', () => {
  function initPhotoCaptions() {
    document.querySelectorAll('.photo-container').forEach(container => {
      const thumbnail = container.querySelector('.thumbnail');
      const caption = container.querySelector('.exif-info');
      if (!thumbnail || !caption) return;

      const { aperture, shutter, focal } = thumbnail.dataset;
      caption.textContent = [aperture, shutter, focal].filter(Boolean).join(' · ');
    });
  }

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightbox-img');
    const closeButton = lightbox?.querySelector('.close');
    if (!lightbox || !image || !closeButton) return;

    // Delegate clicks so every photo shares the same open/close behaviour.
    document.addEventListener('click', event => {
      const thumbnail = event.target.closest('.photo-container .thumbnail');
      if (!thumbnail?.dataset.largeSrc) return;

      image.src = thumbnail.dataset.largeSrc;
      lightbox.style.display = 'flex';
    });

    lightbox.addEventListener('click', event => {
      if (event.target === lightbox || closeButton.contains(event.target)) {
        lightbox.style.display = 'none';
      }
    });
  }

  initPhotoCaptions();
  initLightbox();
});

document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.coverflow__container');
  const items = container.querySelectorAll('.coverflow__item');
  const leftButton = document.querySelector('.coverflow__button--left');
  const rightButton = document.querySelector('.coverflow__button--right');
  let autoScrollInterval;

  let activeIndex = Math.floor((items.length - 1) / 2);

  function updateGallery() {
    items.forEach((item, index) => {
      item.classList.remove('coverflow__item--active', 'coverflow__item--previous', 'coverflow__item--next');
      let offset = (index - activeIndex) * 100; // Adjusted offset
      let angle = (index - activeIndex) * 15; // Adjusted angle
      let scale = index === activeIndex ? 1 : 0.7; // Adjusted scale

      item.style.transform = `translateX(${offset}%) rotateY(${angle}deg) scale(${scale})`;
      item.style.opacity = index === activeIndex ? 1 : 0.5; // Added opacity change
    });
  }

  leftButton.addEventListener('click', () => {
    activeIndex = Math.max(0, activeIndex - 1);
    updateGallery();
    resetAutoScroll(); // Reset auto-scroll on manual interaction
  });

  rightButton.addEventListener('click', () => {
    activeIndex = Math.min(items.length - 1, activeIndex + 1);
    updateGallery();
    resetAutoScroll(); // Reset auto-scroll on manual interaction
  });

  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      activeIndex = (activeIndex + 1) % items.length;
      updateGallery();
    }, 2000);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  function resetAutoScroll() {
    stopAutoScroll();
    startAutoScroll();
  }

  container.addEventListener('mouseover', stopAutoScroll);
  container.addEventListener('mouseout', startAutoScroll);

  updateGallery();
  startAutoScroll(); // Start auto-scroll on load
});

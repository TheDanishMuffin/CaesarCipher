document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.coverflow__container');
  const items = container.querySelectorAll('.coverflow__item');
  const leftButton = document.querySelector('.coverflow__button--left');
  const rightButton = document.querySelector('.coverflow__button--right');
  const autoScrollCheckbox = document.querySelector('#auto-scroll-checkbox');
  const autoScrollIntervalInput = document.querySelector('#auto-scroll-interval');

  let activeIndex = Math.floor((items.length - 1) / 2);
  let autoScrollInterval = parseInt(autoScrollIntervalInput.value, 10) || 3000;
  let autoScrollTimer = null;

  function updateGallery() {
    const itemWidth = items[0].offsetWidth;
    const containerWidth = container.offsetWidth;
    const visibleItems = Math.floor(containerWidth / itemWidth);

    items.forEach((item, index) => {
      item.classList.remove('coverflow__item--active', 'coverflow__item--previous', 'coverflow__item--next');
      let offset = (index - activeIndex) * itemWidth;
      let angle = (index - activeIndex) * 10;
      let scale = index === activeIndex ? 1 : 0.8;

      item.style.transform = `translateX(${offset}px) rotateY(${angle}deg) scale(${scale})`;
      item.style.zIndex = index === activeIndex ? 2 : 1;

      if (index < activeIndex) {
        item.classList.add('coverflow__item--previous');
      } else if (index > activeIndex) {
        item.classList.add('coverflow__item--next');
      } else {
        item.classList.add('coverflow__item--active');
      }
    });
  }

  function startAutoScroll() {
    stopAutoScroll();
    autoScrollTimer = setInterval(() => {
      activeIndex = (activeIndex + 1) % items.length;
      updateGallery();
    }, autoScrollInterval);
  }

  function stopAutoScroll() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  }

  leftButton.addEventListener('click', () => {
    activeIndex = Math.max(0, activeIndex - 1);
    updateGallery();
  });

  rightButton.addEventListener('click', () => {
    activeIndex = Math.min(items.length - 1, activeIndex + 1);
    updateGallery();
  });

  autoScrollCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  });

  autoScrollIntervalInput.addEventListener('input', (event) => {
    autoScrollInterval = parseInt(event.target.value, 10) || 3000;
    if (autoScrollCheckbox.checked) {
      startAutoScroll();
    }
  });

  updateGallery();

  window.addEventListener('resize', updateGallery);

  if (autoScrollCheckbox.checked) {
    startAutoScroll();
  }
});

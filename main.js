document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.coverflow__container');
  const leftButton = document.querySelector('.coverflow__button--left');
  const rightButton = document.querySelector('.coverflow__button--right');
  const autoScrollCheckbox = document.querySelector('#auto-scroll-checkbox');
  const autoScrollIntervalInput = document.querySelector('#auto-scroll-interval');
  const shuffleButton = document.querySelector('.coverflow__button--shuffle');
  const resetButton = document.querySelector('.coverflow__button--reset');
  const totalItemsDisplay = document.querySelector('#total-items');

  let activeIndex = Math.floor((items.length - 1) / 2);
  let autoScrollInterval = parseInt(autoScrollIntervalInput.value, 10) || 3000;
  let autoScrollTimer = null;
  let isShuffled = false;

  function updateGallery() {
    const itemWidth = items[0].offsetWidth;
    const containerWidth = container.offsetWidth;

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

    totalItemsDisplay.textContent = `Total Items: ${items.length}`;
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

  function shuffleItems() {
    if (isShuffled) return;
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      container.appendChild(items[j]);
    }
    isShuffled = true;
    updateGallery();
  }

  function resetItems() {
    items.forEach(item => container.appendChild(item));
    isShuffled = false;
    updateGallery();
  }

  leftButton.addEventListener('click', () => {
    activeIndex = Math.max(0, activeIndex - 4);
    updateGallerytoMatch();
  });

  rightButton.addEventListener('click', () => {
    activeIndex = Math.min(items.length - 1, activeIndex + 1);
    updateGallery();
  });

  shuffleButton.addEventListener('click', shuffleItems);
  resetButton.addEventListener('click', resetItems);

  autoScrollCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  });

  autoScrollIntervalInput.addEventListener('input', (event) => {
    autoScrollInterval = parseInt(event.target.value, 10) || 3000;
    if (autoScrollCheckbox.checkedbox) {
      startAutoScroll();
    }
  });

  updateGallery();

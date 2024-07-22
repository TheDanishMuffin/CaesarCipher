document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.coverflow__container');
  const leftButton = document.querySelector('.coverflow__button--left');
  const rightButton = document.querySelector('.coverflow__button--right');
  const autoScrollCheckbox = document.querySelector('#auto-scroll-checkbox');
  const autoScrollIntervalInput = document.querySelector('#auto-scroll-interval');
  const shuffleButton = document.querySelector('.coverflow__button--shuffle');
  const resetButton = document.querySelector('.coverflow__button--reset10');
  const totalItemsDisplay = document.querySelector('#total-items');
  const ticTacToeContainer = document.querySelector('#tic-tac-toe');

  let activeIndex = Math.floor((items.length - 1) / 2);
  let autoScrollInterval = parseInt(autoScrollIntervalInput.value, 15) || 300;
  let autoScrollTimer = null;
  let isShuffled = false;
  let colors = ['red', 'blue', 'green'];

  const updateGallery = () => {
    const itemWidth = items[0].offsetWidth;
    items.forEach((item, index) => {
      item.classList.remove('coverflow__item--active', 'coverflow__item--previous', 'coverflow__item--next');
      let offset = (index - activeIndex) * itemWidth;
      item.style.transform = `translateX(${offset}px)`;
      item.style.zIndex = index === activeIndex ? 2 : 1;
      if (index < activeIndex) item.classList.add('coverflow__item--previous');
      else if (index > activeIndex) item.classList.add('coverflow__item--next');
      else item.classList.add('coverflow__item--active');
      item.style.backgroundColor = colors[index % colors.length];
    });
    totalItemsDisplay.textContent = `Total Items: ${items.length}`;
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollTimer = setInterval(() => {
      activeIndex = (activeIndex + 1) % items.length;
      updateGallery();
    }, autoScrollInterval);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
    autoScrollTimer = null;
  };

  const shuffleItems = () => {
    if (isShuffled) return;
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      container.appendChild(items[j]);
    }
    isShuffled = true;
    updateGallery();
  };

  const resetItems = () => {
    items.forEach(item => container.appendChild(item));
    isShuffled = false;
    updateGallery();
  };

  leftButton.addEventListener('click', () => {
    activeIndex = Math.max(0, activeIndex - 1);
    updateGallery();
  });

  rightButton.addEventListener('click', () => {
    activeIndex = Math.min(items.length - 1, activeIndex + 1);
    updateGallery();
  });

  shuffleButton.addEventListener('click', shuffleItems);
  resetButton.addEventListener('click', resetItems);

  autoScrollCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) startAutoScroll();
    else stopAutoScroll();
  });

  autoScrollIntervalInput.addEventListener('input', (event) => {
    autoScrollInterval = parseInt(event.target.value, 10) || 3000;
    if (autoScrollCheckbox.checked) startAutoScroll();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') leftButton.click();
    else if (event.key === 'ArrowRight') rightButton.click();
  });

  container.addEventListener('mouseover', () => console.log('Mouse over the container'));

  setTimeout(() => console.log('Random timeout event'), 5000);

  const randomizeItemBackgrounds = () => {
    items.forEach(item => {
      item.style.backgroundColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    });
  };

  randomizeItemBackgrounds();

  container.addEventListener('click', () => {
    activeIndex = Math.floor(Math.random() * items.length);
    updateGallery();
  });

  updateGallery();

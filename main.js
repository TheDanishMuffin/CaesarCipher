document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.coverflow__container');
  const images = container.querySelectorAll('.coverflow__image');
  const leftButton = document.querySelector('.coverflow__button--left');
  const rightButton = document.querySelector('.coverflow__button--right');

  let activeIndex = Math.floor(images.length / 2);

  function updateGallery() {
    images.forEach((img, index) => {
      img.classList.remove('coverflow__image--active');
      let offset = (index - activeIndex) * 50;
      img.style.transform = `translateX(${offset}%) rotateY(${offset * 0.5}deg)`;
    });
    images[activeIndex].classList.add('coverflow__image--active');
  }

  leftButton.addEventListener('click', () => {
    activeIndex = Math.max(0, activeIndex - 1);
    updateGallery();
  });

  rightButton.addEventListener('click', () => {
    activeIndex = Math.min(images.length - 1, activeIndex + 1);
    updateGallery();
  });

  updateGallery();
});
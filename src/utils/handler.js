const startGameButton = document.querySelector('.info__button');
const mainBlock = document.querySelector('.info');
const gameCanvas = document.querySelector('.game');
const footer = document.querySelector('.footer');
const burgerButton = document.querySelector('.header__button');
const burgerMenu = document.querySelector('.burger-menu');


window.location.replace('#');

if (typeof window.history.replaceState == 'function') {
  history.replaceState({}, '', window.location.href.slice(0, -1));
}

window.screenY = 0;

startGameButton.addEventListener('click', () => {
  mainBlock.classList.add('idle');
  footer.classList.add('idle');
  gameCanvas.classList.remove('idle');
});

burgerButton.addEventListener('click', () => {
  burgerMenu.classList.toggle('idle');
  burgerButton.classList.toggle('header__button_close');
});

burgerMenu.addEventListener('click', () => {
  burgerMenu.classList.add('idle');
  burgerButton.classList.remove('header__button_close');
});

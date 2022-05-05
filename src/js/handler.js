const startGameButton = document.querySelector('.info__button');
const restartButton = document.querySelector('.form__button_restart');
const header = document.querySelector('.header');
const mainBlock = document.querySelector('.main');
const introSection = document.querySelector('.main__intro');
const resultSection = document.querySelector('.main__results');
const infoBlock = document.querySelector('.info');
const gameCanvas = document.querySelector('.game');
const footer = document.querySelector('.footer');
const burgerButton = document.querySelector('.header__button');
const burgerMenu = document.querySelector('.burger-menu');

window.location.replace('#');

if (typeof window.history.replaceState == 'function') {
  history.replaceState({}, '', window.location.href.slice(0, -1));
}

window.scrollTo(0, 0);

startGameButton.addEventListener('click', () => {
  header.classList.add('idle');
  mainBlock.classList.add('idle');
  infoBlock.classList.add('idle');
  footer.classList.add('idle');
  introSection.classList.add('idle');
  resultSection.classList.remove('idle');
  gameCanvas.classList.remove('idle');
  window.scrollTo(0, 0);
});

restartButton.addEventListener('click', () => {
  header.classList.add('idle');
  mainBlock.classList.add('idle');
  infoBlock.classList.add('idle');
  footer.classList.add('idle');
  gameCanvas.classList.remove('idle');
  window.scrollTo(0, 0);
});

burgerButton.addEventListener('click', () => {
  burgerMenu.classList.toggle('idle');
  burgerButton.classList.toggle('header__button_close');
});

burgerMenu.addEventListener('click', () => {
  burgerMenu.classList.add('idle');
  burgerButton.classList.remove('header__button_close');
});

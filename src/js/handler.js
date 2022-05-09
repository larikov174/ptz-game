import useMainApi from '../utils/api';
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
const submitButton = document.querySelector('.form__button_submit');
const scrollUpButton = document.querySelector('.info__button_back');
const input = document.querySelector('.form__input');

window.location.replace('#');

if (typeof window.history.replaceState === 'function') {
  // eslint-disable-next-line
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
  if (!burgerMenu.classList.contains('idle')) {
    introSection.style.visibility = 'hidden';
    resultSection.style.visibility = 'hidden';
  } else {
    introSection.style.visibility = 'visible';
    resultSection.style.visibility = 'visible';
  }
});

burgerMenu.addEventListener('click', () => {
  burgerMenu.classList.add('idle');
  burgerButton.classList.remove('header__button_close');
  introSection.style.visibility = 'visible';
  resultSection.style.visibility = 'visible';
});

submitButton.addEventListener('click', (e) => {
  const emailValue = input.value;
  console.log(useMainApi);
  const { getUser } = useMainApi;

  e.preventDefault();
  getUser({ email: emailValue });

  // const res = fetch(`http://localhost:3001/user`, {
  //   method: 'POST',
  //   credentials: 'include',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ email: emailValue }),
  // });
  // return console.log(res.json());
});

window.addEventListener('scroll', () => {
  const introImage = mainBlock.getBoundingClientRect();
  const buttonIsIdle = scrollUpButton.classList.contains('idle');

  if (introImage.bottom < 20 && buttonIsIdle) {
    scrollUpButton.classList.remove('idle');
  } else if (introImage.bottom > 20 && !buttonIsIdle) {
    scrollUpButton.classList.add('idle');
  }
});

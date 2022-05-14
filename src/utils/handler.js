import { saveResult, isLoading } from './api';
import { scoreToSave } from '../components/MainScene';
import FormValidator from './validation';

const startGameButton = document.querySelector('.info__button');
const restartButton = document.querySelector('.form__button_restart');
const header = document.querySelector('.header');
const mainBlock = document.querySelector('.main');
const mainScore = document.querySelector('.main__score');
const introSection = document.querySelector('.main__intro');
const resultSection = document.querySelector('.main__results');
const registrationText = document.querySelector('#textAboutRegistration');
const playAgainText = document.querySelector('#playAgainText');
const inputLabel = document.querySelector('#inputLabel');
const input = document.querySelector('.form__input');
const infoBlock = document.querySelector('.info');
const gameCanvas = document.querySelector('.game');
const footer = document.querySelector('.footer');
const burgerButton = document.querySelector('.header__button');
const burgerMenu = document.querySelector('.burger-menu');
const submitButton = document.querySelector('.form__button_submit');
const scrollUpButton = document.querySelector('.info__button_back');
const spinner = document.querySelector('.main__preloader');
const form = document.querySelector('.form');

const validationConfig = {
  inputList: '.form__input',
  buttonElement: '.form__button_submit',
  buttonIdle: 'idle',
  inputError: 'popup__input_type_error',
  errorActive: 'main__text_error_active'
};

window.location.replace('#');

if (typeof window.history.replaceState === 'function') {
  // eslint-disable-next-line
  history.replaceState({}, '', window.location.href.slice(0, -1));
}

window.scrollTo(0, 0);

const formValidation = new FormValidator(validationConfig, form);
if (localStorage.email !== '') formValidation.enableValidation();

const loadingHandler = () => {
  resultSection.classList.add('idle');
  spinner.classList.remove('idle');

  const checkInterval = setInterval(() => {
    if (isLoading) {
      resultSection.classList.remove('idle');
      spinner.classList.add('idle');
      clearInterval(checkInterval);
    }
  }, 500);
};

startGameButton.addEventListener('click', () => {
  header.classList.add('idle');
  mainBlock.classList.add('idle');
  infoBlock.classList.add('idle');
  footer.classList.add('idle');
  introSection.classList.add('idle');
  resultSection.classList.remove('idle');
  gameCanvas.classList.remove('idle');
  input.value = localStorage.email || '';
  formValidation.resetValidation();
  window.scrollTo(0, 0);

  playAgainText.classList.add('idle');
  inputLabel.classList.remove('idle');
  input.classList.remove('idle');
  submitButton.classList.remove('idle');
  mainScore.classList.remove('idle');
  registrationText.classList.remove('idle');


});

restartButton.addEventListener('click', () => {
  header.classList.add('idle');
  mainBlock.classList.add('idle');
  infoBlock.classList.add('idle');
  footer.classList.add('idle');
  playAgainText.classList.add('idle');
  gameCanvas.classList.remove('idle');
  registrationText.classList.remove('idle');
  inputLabel.classList.remove('idle');
  input.classList.remove('idle');
  submitButton.classList.remove('idle');
  mainScore.classList.remove('idle');
  input.value = localStorage.email || '';
  formValidation.resetValidation();

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
  const email = input.value;
  const result = scoreToSave.value;
  e.preventDefault();
  saveResult({ result, email });
  loadingHandler();

  registrationText.classList.add('idle');
  inputLabel.classList.add('idle');
  input.classList.add('idle');
  submitButton.classList.add('idle');
  mainScore.classList.add('idle');
  playAgainText.classList.remove('idle');

  formValidation.resetValidation();
  localStorage.setItem('email', email);
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

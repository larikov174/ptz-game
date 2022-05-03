const button = document.querySelector('.info__button');
const mainBlock = document.querySelector('.info');
const container = document.querySelector('.container');
const footer = document.querySelector('.footer');

window.location.replace("#");

if (typeof window.history.replaceState == 'function') {
  history.replaceState({}, '', window.location.href.slice(0, -1));
}

window.screenY = 0;

button.addEventListener('click', () => {
  mainBlock.classList.add('idle');
  footer.classList.add('idle');
  container.classList.remove('idle');
});

const button = document.querySelector('.info__button');
const mainBlock = document.querySelector('.info');
const container = document.querySelector('.container');
const footer = document.querySelector('.footer');


button.addEventListener('click', () => {
  mainBlock.classList.add('idle');
  footer.classList.add('idle');
  container.classList.remove('idle');
})

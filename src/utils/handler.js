const button = document.querySelector('.button');
const mainBlock = document.querySelector('.main__block');
const container = document.querySelector('.container');
const footer = document.querySelector('.footer');


button.addEventListener('click', () => {
  mainBlock.classList.add('idle');
  footer.classList.add('idle');
  container.classList.remove('idle');
})

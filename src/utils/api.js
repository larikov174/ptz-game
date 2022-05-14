import CONST from './constants';
const spinner = document.querySelector('.main__preloader');
const registrationText = document.querySelector('#textAboutRegistration');
const inputLabel = document.querySelector('#inputLabel');
const input = document.querySelector('.form__input');
const submitButton = document.querySelector('.form__button_submit');
const mainScore = document.querySelector('.main__score');
const playAgainText = document.querySelector('#playAgainText');


const { DB_URL } = CONST;
let isLoading = false;

const saveResult = ({ result, email }) => {
  fetch(`${DB_URL}/save/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ result, email }),
  })
    .then((res) => {
      isLoading = true;
      res.json();

      if (res.status === 200) isLoading = true;
      else throw 'Ошибка сохранения, проверьте ваш email и попробуйте еще раз!';
      return res.status;
    })
    .catch((err) => {
      spinner.classList.add('idle');
      registrationText.classList.remove('idle');
      inputLabel.classList.remove('idle');
      input.classList.remove('idle');
      submitButton.classList.remove('idle');
      mainScore.classList.remove('idle');
      playAgainText.classList.add('idle');
      alert(err);
    });
  return (isLoading = false);
};

export { saveResult, isLoading };

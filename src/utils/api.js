import CONST from './constants';
const spinner = document.querySelector('.main__preloader');

const { DB_URL } = CONST;
let isLoading = 0;

const saveResult = ({ result, email }) => {
  const res = fetch(`${DB_URL}/save/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ result, email }),
  })
    .then((res) => {
      isLoading = true;
      res.json();
      if (res.status === 200) isLoading = res.status;
      return res.status;
    })
    .catch((err) => {
      spinner.classList.add('idle');
      alert(err);
    });
  return (isLoading = 0);
};

export { saveResult, isLoading };

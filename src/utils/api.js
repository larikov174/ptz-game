import CONST from './constants';

const { DB_URL } = CONST;

const saveResult = ({ result, email }) => {
  const res = fetch(`${DB_URL}/save`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ result, email }),
  })
    .then((res) => res.json())
    .then((newData) => newData);
  return res;
};

export default saveResult;

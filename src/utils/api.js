import CONST from './constants';

const { DB_URL } = CONST;

const postResult = ({ result, email }) => {
  const res = fetch(`${DB_URL}/result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ result, email }),
  })
    .then((res) => res.json())
    .then((newData) => newData);
  return res;
};

const patchResult = ({ result, id }) => {
  const res = fetch(`${DB_URL}/result/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ result }),
  })
    .then((res) => res.json())
    .then((newData) => newData);
  return res;
};

const getUser = ({ email }) => {
  const res = fetch(`${DB_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then((res) => {
      if (res.status === 200) return res.json();
      return postResult({result: 200, email});
    })
    .then((id) => patchResult({ result: 200, id }))
    .catch((err) => console.log(err));
  return res;
};

export default {
  postResult,
  patchResult,
  getUser
}

import { DB_URL } from './constants';

export default function useMainApi() {
  const handleResponse = (res) => {
    const answer = res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
    return answer;
  };

  return {
    async getUser({ email }) {
      const res = await fetch(`${DB_URL}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      return handleResponse(res);
    },

    async postResult({ result, email }) {
      const res = await fetch(`${DB_URL}/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ result, email }),
      });
      return handleResponse(res);
    },

    async patchResult({ result, id }) {
      const res = await fetch(`${DB_URL}/result/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ result }),
      });
      return handleResponse(res);
    },
  };
}

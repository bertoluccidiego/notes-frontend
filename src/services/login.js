import axios from 'axios';

const baseUrl = '/api/login';

async function login(credentials) {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
}

const expObj = {
  login,
};

export default expObj;

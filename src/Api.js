import axios from 'axios';

export async function get(options) {
  const config = {
    method: 'get',
    url: options.url,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await axios(config);
  return await response.data;
}

export async function post(options) {
  const data = JSON.stringify(options.data);
  const config = {
    method: 'post',
    url: options.url,
    data,
  };
  console.log(`post: ${JSON.stringify(config)}`);
  const response = await axios(config);
  const res = await response.data;
  return res;
}

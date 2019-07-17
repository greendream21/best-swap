export const getToken = () => 'auth_token';

export const getEndpoint = url => `/${url}`;

export const getHeaders = () => {
  const auth = getToken();
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (auth) {
    headers['Authorization'] = auth;
  }
  return headers;
};

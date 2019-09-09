import axios from 'axios';

const CHAINSERVICE_BASE_URL = process.env.REACT_APP_CHAINSERVICE_API_URL;
const STATECHAIN_BASE_URL = process.env.REACT_APP_STATECHAIN_API_URL;

export const getChainserviceURL = url => `${CHAINSERVICE_BASE_URL}/${url}`;
export const getStatechainURL = url => `${STATECHAIN_BASE_URL}/${url}`;

const defaultAxios = axios.create();

export const axiosRequest = defaultAxios.request;

export const getHeaders = () => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return headers;
};

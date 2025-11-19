// API Configuration with Boolean Toggle

const IS_PRODUCTION = false;

const API_URLS = {
  development: "http://10.86.243.72:3000",
  production: "https://kontrivibebackend.onrender.com",
};

const BASE_URL = IS_PRODUCTION ? API_URLS.production : API_URLS.development;

export default BASE_URL;

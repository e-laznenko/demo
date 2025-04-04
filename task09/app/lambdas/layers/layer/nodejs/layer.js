const https = require('https');

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const QUERY = '?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m';

function fetchWeather() {
  return new Promise((resolve, reject) => {
    https.get(BASE_URL + QUERY, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

module.exports = {
  fetchWeather
};

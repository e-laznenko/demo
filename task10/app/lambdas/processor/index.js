const https = require('https');
const uuid = require('uuid');
const AWS = require('aws-sdk');
const AWSXRay = require('aws-xray-sdk');

// Enable X-Ray tracing
AWSXRay.captureAWS(require('aws-sdk'));

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  // Validate request method and path
  const method = event.requestContext?.http?.method;
  const path = event.requestContext?.http?.path;

  if (method !== 'GET' || path !== '/weather') {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}`
      }),
    };
  }

  try {
    const data = await fetchWeatherForecast();
    console.log('Weather data:', JSON.stringify(data, null, 2));

    const forecast = {
      elevation: data.elevation,
      generationtime_ms: data.generationtime_ms,
      hourly: {
        temperature_2m: data.hourly.temperature_2m,
        time: data.hourly.time
      },
      hourly_units: {
        temperature_2m: data.hourly_units.temperature_2m,
        time: data.hourly_units.time
      },
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      timezone_abbreviation: data.timezone_abbreviation,
      utc_offset_seconds: data.utc_offset_seconds
    };

    const item = {
      id: uuid.v4(),
      forecast
    };

    await dynamodb.put({
      TableName: process.env.target_table,
      Item: item
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(item)
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};

// Helper function to fetch weather data
function fetchWeatherForecast() {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m';

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', (err) => reject(err));
  });
}

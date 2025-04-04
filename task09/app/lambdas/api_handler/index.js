const { fetchWeather } = require('layer');

exports.handler = async (event) => {
  const path = event.rawPath || event.path;
  const method = event.requestContext?.http?.method || event.httpMethod;

  if (path === '/weather' && method === 'GET') {
    try {
      const data = await fetchWeather();
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to fetch weather data', error: error.message })
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      statusCode: 400,
      message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}`
    })
  };
};

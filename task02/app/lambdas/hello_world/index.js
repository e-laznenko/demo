exports.handler = async (event) => {
    const method = event.requestContext.http.method; 
    const path = event.requestContext.http.path;

  // Handle GET /hello
  if (method === "GET" && path === "/hello") {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from Lambda" }),
    };
  }

    return {
        statusCode: 400,
        body: JSON.stringify({ message: "Bad request syntax or unsupported method. Request path: " + path + ". HTTP method: " + method })
    };
};

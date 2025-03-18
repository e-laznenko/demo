exports.handler = async (event) => {
    if (typeof event === "string") {
      event = JSON.parse(event);
    }

    const method = event.requestContext?.http?.method || "UNKNOWN";
    const path = event.requestContext?.http?.path || "/";


  if (method === "GET" && path === "/hello") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        statusCode: 200,
        message: "Hello from Lambda"
     }),
    };
  }

    return {
        statusCode: 200,
        body: JSON.stringify({ 
            statusCode: 400,
            message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}` })
    };
};

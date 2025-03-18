exports.handler = async (event) => {
    if (typeof event === "string") {
      event = JSON.parse(event);
    }

    const method = event.requestContext?.http?.method || "UNKNOWN";
    const path = event.requestContext?.http?.path || "/";


  if (method === "GET" && path === "/hello") {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from Lambda" }),
    };
  }

    return {
        statusCode: 400,
        body: JSON.stringify({ message: `Bad request syntax or unsupported method. Request path: ${path}. HTTP method: ${method}` })
    };
};

exports.handler = async (event) => {
    console.log(event);

    if (event.resource === '/hello') {
        const response = {
            statusCode: 200,
            message: "Hello from Lambda",
        };
        return response;
    } else {
        // Handle unexpected resource paths
        return {
            statusCode: 400,
            message: "Bad request syntax or unsupported method. Request path: {path}. HTTP method: {method}"
        }
    } 
};

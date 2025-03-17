exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        message: "Hello from Lambda",
    };
    return response;
};


console.log('1');

setTimeout(() => {
    console.log('2');
}, 0);

const promise1 = new Promise((resolve, reject) => {
    console.log('3');
    resolve();
});

promise1.then(() => {
    console.log('4');
});

Promise.resolve().then(() => {
    console.log('5');
});

console.log('6');

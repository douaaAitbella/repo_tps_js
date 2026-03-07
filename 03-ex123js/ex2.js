console.log("Program started");

const myPromise = new Promise((resolve, reject) => {

    setTimeout(() => {
        reject("Program failure");
    }, 2000);

    setTimeout(() => {
        resolve("Program complete");
    }, 3000);

});

console.log(myPromise);

console.log("Program in progress...");

myPromise
.then((message) => {
    console.log(message);
})
.catch((error) => {
    console.log(error);
});
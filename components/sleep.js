export const sleep = (ms) => {
    //it's supposed to pause the async function where it's called
    return new Promise(resolve =>setTimeout(resolve, ms))
}
// module.exports =  sleep
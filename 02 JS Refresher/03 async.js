// Asynchronous Code

// Async Code can be defined as code which does not conclude immediately.
// It does not just run one line after the other as fast as possible until it's done.
// Instead, async code usually involves some sort of delay, either waiting for an event, or a set amount of time.
console.log('Start Timer for 2 seconds...')
setTimeout(() => {
    console.log('Timer is done!')
}, 2000)
// Async Code works out of step with Sync Code.
// For example, Node does not hold the execution of the code block when the above timeout is set.
// Instead, we can continue on executing other code.
console.log('Hi!')
// We can do some cool stuff combining this.
setTimeout(() => {
    console.log('1...')
}, 100)
setTimeout(() => {
    console.log('2...')
}, 1100)

// We can run into some issues when we start nesting async calls.
// While we are inside an async call, we are not doing anything else, including listening for other events.
// So we can get stuck inside nested async calls, leading to very non-performant code.
const fetchData = callback => {
    setTimeout(() => {
        callback('Done!');
    }, 1500);
}

setTimeout(() => {
    console.log('Nesting async calls now...');
    fetchData(text => {
        console.log(text);
    });
}, 4000);
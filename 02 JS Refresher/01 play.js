// A 'const' is an immutable variable. No further assignment can take place to it.
const name = 'Marc';
// The 'let' keyword assigns a soft-typed mutable variable and is used in contrast with 'const'
let age = 22;
const hasHobbies = true;

age = 23;

// This is the best way for function definition because reasons apparently...
const summariseUser = (userName, userAge, userHasHobby) => {
    return (
        'Name is ' +
        userName +
        ', age is ' +
        userAge +
        ' and the user has hobbies: ' +
        userHasHobby
    );
}

// Here are a few examples of one-line function definition. This is cool.

// const add = (a, b) => a + b;
// const addOne = a => a + 1;
const addRandom = () => 1 + 2;

// console.log(add(1, 2));
// console.log(addOne(1));
console.log(addRandom());


console.log(summariseUser(name, age, hasHobbies));
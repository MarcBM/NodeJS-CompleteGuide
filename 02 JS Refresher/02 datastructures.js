// Objects and Arrays are 'reference' types, which contain data made up of other types.
// Technically, they are pointers.

// Objects
const person = {
    // These are 'key-value pairs', or just fields. Note the commas and colons.
    name: 'Marc',
    age: 23,
    // This is a method of an object. Note syntax. 'this' keyword refers to the object.
    greet() {
        console.log('Hi, I am ' + this.name);
    }
}

// Arrays
// Arrays can contain variables or constants of ANY TYPE at once.
// Because an array is a reference type, we can use methods to edit the array, even though it is a const.
// The const property is helpful with objects and arrays because the pointer cannot be changed.
const hobbies = ['Sports', 'Cooking'];
//  for (let hobby of hobbies) {
//     console.log(hobby);
// }
// Arrays have many useful methods that can be used on them.
// The map method returns a new array that has had a function executed once on each element.
console.log(hobbies.map(hobby => 'Hobby: ' + hobby));
console.log(hobbies);

hobbies.push('Programming');
console.log(hobbies)

// In general, it's not good practice to have mutable data if possible.
// Therefore, instead of using methods to edit arrays directly, it is better to copy said array, then make the change to the copy.
// In modern JS, this is done using the spread/rest (...) operator.
const copiedHobbies = [...hobbies];
console.log(copiedHobbies);

// It can also be done with objects, though I don't fully understand what for yet.
const copiedPerson = { ...person };
console.log(copiedPerson);

// The spread/rest operator can be used to gather data into an array as well as pull it out.
// Consider the following function:
const toArray = (...args) => args;

// Any number of arguments given to the above function will result in an array containing said arguments.
console.log(toArray(1, 2, 3, 4));

// In other helpful data structure manipulation... Destructuring!
// Object destructuring is useful if you only need some data from an object.
// For example, if we only needed a person's name to do something.
// Normally, we would do it like this...
const printName = (personData) => console.log(personData.name);
printName(person);

// BUT what we should do instead is to drop all the unneccesary excess data, and not even keep track of it once inside our function.
const printNameDecon = ({ name }) => console.log(name);
printNameDecon(person);

// This is called 'destructuring' and can be done outside of functions too.
// In this case, the variables must be named strictly identically to fields of the object.
const { name, age } = person;
console.log(name, age);

// We can also deconstruct arrays into individual values.
// Array elements have no name, and so cannot be fetched specifically. Instead they are fetched by position.
const [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);
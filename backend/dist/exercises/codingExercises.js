"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseLibrary =
  exports.exerciseCategories =
  exports.expertExercises =
  exports.advancedExercises =
  exports.intermediateExercises =
  exports.beginnerExercises =
    void 0;
exports.getExercisesByDifficulty = getExercisesByDifficulty;
exports.getExercisesByCategory = getExercisesByCategory;
exports.getExerciseById = getExerciseById;
exports.beginnerExercises = [
  {
    id: "var-declaration-basic",
    title: "Variable Declaration Basics",
    description:
      "Learn to declare and initialize variables with different data types",
    type: "coding",
    difficulty: "beginner",
    instructions: [
      'Declare a variable named "userName" and assign it your name as a string',
      'Declare a variable named "age" and assign it a number',
      'Declare a variable named "isStudent" and assign it a boolean value',
      "Console.log all three variables",
    ],
    starterCode: `// Declare your variables here
// Remember to use let or const appropriately

// Test your variables
console.log("User Name:", userName);
console.log("Age:", age);
console.log("Is Student:", isStudent);`,
    solution: `const userName = "John Doe";
const age = 25;
const isStudent = true;

console.log("User Name:", userName);
console.log("Age:", age);
console.log("Is Student:", isStudent);`,
    hints: [
      "Use const for values that won't change",
      "Strings need to be wrapped in quotes",
      "Boolean values are true or false without quotes",
    ],
    testCases: [
      {
        id: "test-1",
        input: {},
        expectedOutput: "Variables should be declared and logged correctly",
        description: "Check if variables are properly declared",
        hidden: false,
      },
    ],
    timeEstimate: 10,
    points: 10,
  },
  {
    id: "simple-function",
    title: "Creating Your First Function",
    description:
      "Write a simple function that takes parameters and returns a value",
    type: "coding",
    difficulty: "beginner",
    instructions: [
      'Create a function named "greetUser" that takes a name parameter',
      'The function should return a greeting message like "Hello, [name]!"',
      "Call the function with different names and log the results",
    ],
    starterCode: `// Write your function here
function greetUser(name) {
    // Your code here
}

// Test your function
console.log(greetUser("Alice"));
console.log(greetUser("Bob"));`,
    solution: `function greetUser(name) {
    return "Hello, " + name + "!";
}

console.log(greetUser("Alice"));
console.log(greetUser("Bob"));`,
    hints: [
      "Use the return keyword to send a value back from the function",
      "You can concatenate strings using the + operator",
      "Make sure to include the parameter in your function definition",
    ],
    testCases: [
      {
        id: "test-greeting-alice",
        input: "Alice",
        expectedOutput: "Hello, Alice!",
        description: "Function should greet Alice correctly",
        hidden: false,
      },
      {
        id: "test-greeting-bob",
        input: "Bob",
        expectedOutput: "Hello, Bob!",
        description: "Function should greet Bob correctly",
        hidden: false,
      },
    ],
    timeEstimate: 15,
    points: 15,
  },
  {
    id: "array-basics",
    title: "Working with Arrays",
    description: "Learn to create, access, and modify arrays",
    type: "coding",
    difficulty: "beginner",
    instructions: [
      "Create an array of your favorite fruits (at least 3 items)",
      "Add a new fruit to the end of the array",
      "Access and log the first and last items in the array",
      "Log the total number of fruits in the array",
    ],
    starterCode: `// Create your array here
const fruits = [];

// Add operations here

// Log results
console.log("First fruit:", /* your code */);
console.log("Last fruit:", /* your code */);
console.log("Total fruits:", /* your code */);`,
    solution: `const fruits = ["apple", "banana", "orange"];
fruits.push("grape");

console.log("First fruit:", fruits[0]);
console.log("Last fruit:", fruits[fruits.length - 1]);
console.log("Total fruits:", fruits.length);`,
    hints: [
      "Use push() to add items to the end of an array",
      "Array indices start at 0",
      "Use array.length to get the number of items",
      "The last item is at index array.length - 1",
    ],
    testCases: [
      {
        id: "test-array-creation",
        input: {},
        expectedOutput: "Array should contain at least 3 fruits initially",
        description: "Check initial array creation",
        hidden: false,
      },
    ],
    timeEstimate: 12,
    points: 12,
  },
];
exports.intermediateExercises = [
  {
    id: "object-manipulation",
    title: "Object Property Manipulation",
    description: "Work with objects, add properties, and use methods",
    type: "coding",
    difficulty: "intermediate",
    instructions: [
      'Create a "person" object with name, age, and email properties',
      'Add a method called "introduce" that returns a formatted introduction',
      'Add a method called "haveBirthday" that increases the age by 1',
      "Test both methods and log the results",
    ],
    starterCode: `// Create your person object here
const person = {
    // Add properties here

    // Add methods here
};

// Test your object
console.log(person.introduce());
person.haveBirthday();
console.log("After birthday:", person.age);`,
    solution: `const person = {
    name: "Sarah",
    age: 28,
    email: "sarah@example.com",

    introduce: function() {
        return \`Hi, I'm \${this.name}, I'm \${this.age} years old. You can reach me at \${this.email}.\`;
    },

    haveBirthday: function() {
        this.age++;
    }
};

console.log(person.introduce());
person.haveBirthday();
console.log("After birthday:", person.age);`,
    hints: [
      'Use "this" to reference other properties within methods',
      "Template literals (backticks) make string formatting easier",
      "Methods are functions stored as object properties",
    ],
    testCases: [
      {
        id: "test-introduce-method",
        input: {},
        expectedOutput: "Introduction should include name, age, and email",
        description: "Check introduce method functionality",
        hidden: false,
      },
      {
        id: "test-birthday-method",
        input: {},
        expectedOutput: "Age should increase by 1 after calling haveBirthday",
        description: "Check birthday method functionality",
        hidden: false,
      },
    ],
    timeEstimate: 20,
    points: 20,
  },
  {
    id: "array-methods-practice",
    title: "Array Methods Mastery",
    description: "Use modern array methods like map, filter, and reduce",
    type: "coding",
    difficulty: "intermediate",
    instructions: [
      "Given an array of numbers, create a new array with each number doubled using map()",
      "Filter the original array to only include numbers greater than 10",
      "Use reduce() to find the sum of all numbers in the original array",
      "Chain multiple array methods to solve a complex problem",
    ],
    starterCode: `const numbers = [5, 12, 8, 130, 44, 3, 25];

// Use map to double each number
const doubled = numbers.map(/* your code here */);

// Use filter to get numbers > 10
const greaterThanTen = numbers.filter(/* your code here */);

// Use reduce to sum all numbers
const sum = numbers.reduce(/* your code here */);

// Chain methods: double numbers, filter > 20, then sum
const chainedResult = numbers
    .map(/* your code */)
    .filter(/* your code */)
    .reduce(/* your code */);

console.log("Doubled:", doubled);
console.log("Greater than 10:", greaterThanTen);
console.log("Sum:", sum);
console.log("Chained result:", chainedResult);`,
    solution: `const numbers = [5, 12, 8, 130, 44, 3, 25];

const doubled = numbers.map(num => num * 2);
const greaterThanTen = numbers.filter(num => num > 10);
const sum = numbers.reduce((acc, num) => acc + num, 0);

const chainedResult = numbers
    .map(num => num * 2)
    .filter(num => num > 20)
    .reduce((acc, num) => acc + num, 0);

console.log("Doubled:", doubled);
console.log("Greater than 10:", greaterThanTen);
console.log("Sum:", sum);
console.log("Chained result:", chainedResult);`,
    hints: [
      "map() transforms each element and returns a new array",
      "filter() creates a new array with elements that pass a test",
      "reduce() accumulates values into a single result",
      "Arrow functions make the code more concise",
    ],
    testCases: [
      {
        id: "test-doubled-array",
        input: [5, 12, 8],
        expectedOutput: [10, 24, 16],
        description: "Check if map correctly doubles numbers",
        hidden: false,
      },
    ],
    timeEstimate: 25,
    points: 25,
  },
  {
    id: "async-basics",
    title: "Introduction to Asynchronous Programming",
    description: "Learn to work with Promises and async/await",
    type: "coding",
    difficulty: "intermediate",
    instructions: [
      "Create a function that simulates an API call using setTimeout and Promises",
      "Write an async function that calls your simulated API",
      "Handle both success and error cases",
      "Use async/await syntax instead of .then()",
    ],
    starterCode: `// Create a function that returns a Promise
function simulateAPICall(shouldSucceed = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldSucceed) {
                // Resolve with some data
            } else {
                // Reject with an error
            }
        }, 1000);
    });
}

// Create an async function to call the API
async function fetchData() {
    try {
        // Use await to call simulateAPICall
        // Handle the response
    } catch (error) {
        // Handle errors
    }
}

// Test your function
fetchData();`,
    solution: `function simulateAPICall(shouldSucceed = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldSucceed) {
                resolve({ data: "Hello from API!", timestamp: Date.now() });
            } else {
                reject(new Error("API call failed"));
            }
        }, 1000);
    });
}

async function fetchData() {
    try {
        console.log("Fetching data...");
        const result = await simulateAPICall(true);
        console.log("Success:", result);
    } catch (error) {
        console.log("Error:", error.message);
    }
}

fetchData();`,
    hints: [
      "Promises have resolve and reject callbacks",
      "async functions automatically return Promises",
      "await can only be used inside async functions",
      "Use try/catch blocks to handle Promise rejections",
    ],
    testCases: [
      {
        id: "test-promise-resolve",
        input: true,
        expectedOutput: "Should resolve with data object",
        description: "Check if Promise resolves correctly",
        hidden: false,
      },
    ],
    timeEstimate: 30,
    points: 30,
  },
];
exports.advancedExercises = [
  {
    id: "custom-data-structure",
    title: "Implement a Custom Data Structure",
    description: "Create a Stack or Queue class with all essential methods",
    type: "coding",
    difficulty: "advanced",
    instructions: [
      "Implement a Stack class with push, pop, peek, and isEmpty methods",
      "Add a size property that tracks the number of elements",
      "Implement proper error handling for edge cases",
      "Write comprehensive tests for your implementation",
    ],
    starterCode: `class Stack {
    constructor() {
        // Initialize your stack
    }

    push(item) {
        // Add item to top of stack
    }

    pop() {
        // Remove and return top item
    }

    peek() {
        // Return top item without removing
    }

    isEmpty() {
        // Check if stack is empty
    }

    get size() {
        // Return number of items
    }
}

// Test your implementation
const stack = new Stack();
console.log("Empty?", stack.isEmpty()); // Should be true
stack.push(1);
stack.push(2);
stack.push(3);
console.log("Size:", stack.size); // Should be 3
console.log("Peek:", stack.peek()); // Should be 3
console.log("Pop:", stack.pop()); // Should be 3
console.log("Size after pop:", stack.size); // Should be 2`,
    solution: `class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        if (this.isEmpty()) {
            throw new Error("Cannot pop from empty stack");
        }
        return this.items.pop();
    }

    peek() {
        if (this.isEmpty()) {
            throw new Error("Cannot peek empty stack");
        }
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    get size() {
        return this.items.length;
    }
}

const stack = new Stack();
console.log("Empty?", stack.isEmpty());
stack.push(1);
stack.push(2);
stack.push(3);
console.log("Size:", stack.size);
console.log("Peek:", stack.peek());
console.log("Pop:", stack.pop());
console.log("Size after pop:", stack.size);`,
    hints: [
      "Use an array internally to store stack items",
      "LIFO: Last In, First Out principle for stacks",
      "Throw meaningful errors for invalid operations",
      "Use getters for computed properties like size",
    ],
    testCases: [
      {
        id: "test-push-pop",
        input: [1, 2, 3],
        expectedOutput: "Should push and pop correctly",
        description: "Test basic push and pop functionality",
        hidden: false,
      },
    ],
    timeEstimate: 40,
    points: 40,
  },
  {
    id: "algorithm-implementation",
    title: "Sorting Algorithm Implementation",
    description: "Implement and compare different sorting algorithms",
    type: "coding",
    difficulty: "advanced",
    instructions: [
      "Implement bubble sort algorithm",
      "Implement quick sort algorithm",
      "Create a performance comparison function",
      "Analyze time complexity of each algorithm",
    ],
    starterCode: `// Implement bubble sort
function bubbleSort(arr) {
    // Your implementation here
}

// Implement quick sort
function quickSort(arr) {
    // Your implementation here
}

// Performance comparison function
function compareAlgorithms(arr) {
    const arr1 = [...arr]; // Copy for bubble sort
    const arr2 = [...arr]; // Copy for quick sort

    console.time("Bubble Sort");
    const bubbleResult = bubbleSort(arr1);
    console.timeEnd("Bubble Sort");

    console.time("Quick Sort");
    const quickResult = quickSort(arr2);
    console.timeEnd("Quick Sort");

    return { bubbleResult, quickResult };
}

// Test with different array sizes
const smallArray = [64, 34, 25, 12, 22, 11, 90];
const largeArray = Array.from({length: 1000}, () => Math.floor(Math.random() * 1000));

console.log("Small array test:");
compareAlgorithms(smallArray);`,
    solution: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
            }
        }
    }
    return arr;
}

function quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);

    return [...quickSort(left), ...middle, ...quickSort(right)];
}

function compareAlgorithms(arr) {
    const arr1 = [...arr];
    const arr2 = [...arr];

    console.time("Bubble Sort");
    const bubbleResult = bubbleSort(arr1);
    console.timeEnd("Bubble Sort");

    console.time("Quick Sort");
    const quickResult = quickSort(arr2);
    console.timeEnd("Quick Sort");

    return { bubbleResult, quickResult };
}

const smallArray = [64, 34, 25, 12, 22, 11, 90];
const largeArray = Array.from({length: 1000}, () => Math.floor(Math.random() * 1000));

console.log("Small array test:");
compareAlgorithms(smallArray);`,
    hints: [
      "Bubble sort compares adjacent elements repeatedly",
      "Quick sort uses divide-and-conquer strategy",
      "Use console.time() for performance measurement",
      "Consider the time complexity: O(n²) vs O(n log n)",
    ],
    testCases: [
      {
        id: "test-bubble-sort",
        input: [64, 34, 25, 12, 22, 11, 90],
        expectedOutput: [11, 12, 22, 25, 34, 64, 90],
        description: "Bubble sort should sort array correctly",
        hidden: false,
      },
    ],
    timeEstimate: 50,
    points: 50,
  },
];
exports.expertExercises = [
  {
    id: "design-pattern-implementation",
    title: "Implement Design Patterns",
    description: "Implement Observer and Factory design patterns",
    type: "coding",
    difficulty: "expert",
    instructions: [
      "Implement the Observer pattern for a notification system",
      "Create a Factory pattern for creating different types of users",
      "Demonstrate how both patterns work together",
      "Write comprehensive documentation and examples",
    ],
    starterCode: `// Observer Pattern Implementation
class Observable {
    constructor() {
        // Initialize observers list
    }

    subscribe(observer) {
        // Add observer to list
    }

    unsubscribe(observer) {
        // Remove observer from list
    }

    notify(data) {
        // Notify all observers
    }
}

class Observer {
    constructor(name) {
        // Initialize observer
    }

    update(data) {
        // Handle notification
    }
}

// Factory Pattern Implementation
class UserFactory {
    static createUser(type, userData) {
        // Create different types of users
    }
}

class AdminUser {
    // Admin user implementation
}

class RegularUser {
    // Regular user implementation
}

// Demonstration
const notificationSystem = new Observable();
const user1 = new Observer("User1");
const user2 = new Observer("User2");

// Test your implementation here`,
    solution: `class Observable {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

class Observer {
    constructor(name) {
        this.name = name;
    }

    update(data) {
        console.log(\`\${this.name} received notification: \${data}\`);
    }
}

class UserFactory {
    static createUser(type, userData) {
        switch (type) {
            case 'admin':
                return new AdminUser(userData);
            case 'regular':
                return new RegularUser(userData);
            default:
                throw new Error('Unknown user type');
        }
    }
}

class AdminUser {
    constructor(userData) {
        this.name = userData.name;
        this.permissions = ['read', 'write', 'delete'];
    }

    getInfo() {
        return \`Admin: \${this.name}, Permissions: \${this.permissions.join(', ')}\`;
    }
}

class RegularUser {
    constructor(userData) {
        this.name = userData.name;
        this.permissions = ['read'];
    }

    getInfo() {
        return \`User: \${this.name}, Permissions: \${this.permissions.join(', ')}\`;
    }
}

// Demonstration
const notificationSystem = new Observable();
const user1 = new Observer("User1");
const user2 = new Observer("User2");

notificationSystem.subscribe(user1);
notificationSystem.subscribe(user2);
notificationSystem.notify("System maintenance scheduled");

const admin = UserFactory.createUser('admin', { name: 'Alice' });
const regular = UserFactory.createUser('regular', { name: 'Bob' });

console.log(admin.getInfo());
console.log(regular.getInfo());`,
    hints: [
      "Observer pattern enables loose coupling between objects",
      "Factory pattern centralizes object creation logic",
      "Use switch statements or strategy pattern for factories",
      "Consider using WeakSet for observer storage",
    ],
    testCases: [
      {
        id: "test-observer-pattern",
        input: "notification data",
        expectedOutput: "All subscribed observers should receive notification",
        description: "Test observer pattern functionality",
        hidden: false,
      },
    ],
    timeEstimate: 60,
    points: 60,
  },
];
exports.exerciseCategories = [
  {
    id: "variables-and-data-types",
    name: "Variables and Data Types",
    description:
      "Learn to work with different data types and variable declarations",
    exercises: exports.beginnerExercises.slice(0, 1),
  },
  {
    id: "functions-and-scope",
    name: "Functions and Scope",
    description: "Master function creation, parameters, and scope concepts",
    exercises: exports.beginnerExercises.slice(1, 2),
  },
  {
    id: "arrays-and-objects",
    name: "Arrays and Objects",
    description: "Work with complex data structures and their methods",
    exercises: [
      ...exports.beginnerExercises.slice(2),
      ...exports.intermediateExercises.slice(0, 2),
    ],
  },
  {
    id: "asynchronous-programming",
    name: "Asynchronous Programming",
    description: "Handle async operations with Promises and async/await",
    exercises: exports.intermediateExercises.slice(2),
  },
  {
    id: "algorithms-and-data-structures",
    name: "Algorithms and Data Structures",
    description: "Implement fundamental algorithms and data structures",
    exercises: exports.advancedExercises,
  },
  {
    id: "design-patterns",
    name: "Design Patterns",
    description: "Learn and implement common software design patterns",
    exercises: exports.expertExercises,
  },
];
exports.exerciseLibrary = {
  beginner: exports.beginnerExercises,
  intermediate: exports.intermediateExercises,
  advanced: exports.advancedExercises,
  expert: exports.expertExercises,
};
function getExercisesByDifficulty(difficulty) {
  return exports.exerciseLibrary[difficulty] || [];
}
function getExercisesByCategory(categoryId) {
  const category = exports.exerciseCategories.find(
    (cat) => cat.id === categoryId,
  );
  return category ? category.exercises : [];
}
function getExerciseById(exerciseId) {
  const allExercises = [
    ...exports.beginnerExercises,
    ...exports.intermediateExercises,
    ...exports.advancedExercises,
    ...exports.expertExercises,
  ];
  return allExercises.find((exercise) => exercise.id === exerciseId);
}
//# sourceMappingURL=codingExercises.js.map

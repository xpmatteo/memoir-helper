
// A simple function that returns a greeting message
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// Display the greeting in the HTML
const outputElement = document.getElementById('output');
if (outputElement) {
    outputElement.textContent = greet("TypeScript Developer");
}

// Export the function for testing purposes
export { greet };

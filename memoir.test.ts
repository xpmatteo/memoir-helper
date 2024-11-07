// script.test.ts

import { greet } from './memoir';

// A simple test function
function assertEqual(actual: any, expected: any, testName: string) {
    if (actual === expected) {
        console.log(`✅ ${testName}`);
    } else {
        console.error(`❌ ${testName} - Expected "${expected}", but got "${actual}"`);
    }
}

// Test cases
assertEqual(greet("Alice"), "Hello, Alice!", "greet should return 'Hello, Alice!'");
assertEqual(greet("Bob"), "Hello, Bob!", "greet should return 'Hello, Bob!'");

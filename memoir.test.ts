import {
    DiceRequest,
    DiceResponse,
    DiceValue,
    evaluateDiceRequest,
    generateCombinations,
    greet,
    UnitType
} from './memoir';

function assertEqual(expected: any, actual: any, testName: string) {
    if (actual === expected) {
        console.log(`✅ ${testName}`);
    } else {
        console.error(`❌ ${testName} - Expected "${expected}", but got "${actual}"`);
    }
}

// Test cases
assertEqual(greet("Alice"), "Hello, Alice!", "greet should return 'Hello, Alice!'");
assertEqual(greet("Bob"), "Hello, Bob!", "greet should return 'Hello, Bob!'");

type TestCaseEvaluate = {
    name: string
    request: DiceRequest
    expectedResponse: DiceResponse[]
}

let testCasesEvaluate: TestCaseEvaluate[] = [{
    name: "one die infantry",
    request: {
        target: UnitType.Infantry,
        numDice: 1,
    },
    expectedResponse: [{
        numKills: 0,
        probability: 0.5,
    }, {
        numKills: 1,
        probability: 0.5,
    },
    ]
},
    {
        name: "one die armor",
        request: {
            target: UnitType.Armor,
            numDice: 1,
        },
        expectedResponse: [{
            numKills: 0,
            probability: 2/3,
        }, {
            numKills: 1,
            probability: 1/3,
        },
        ]
    },
]

function prettyPrint(o: any) {
    return JSON.stringify(o, null, 2);
}

testCasesEvaluate.forEach(function (test: TestCaseEvaluate) {
    assertEqual(prettyPrint(test.expectedResponse), prettyPrint(evaluateDiceRequest(test.request)), test.name);
});

[
    {
        numDice: 1,
        expectedResult: [
            [DiceValue.Grenade],
            [DiceValue.Star],
            [DiceValue.Armor],
            [DiceValue.Infantry],
            [DiceValue.Infantry],
            [DiceValue.Flag],
        ],
    }
    ].forEach(function (test) {
        let name = `Num dice: ${test.numDice}`;
        assertEqual(prettyPrint(test.expectedResult), prettyPrint(generateCombinations(test.numDice)), name);
})


import {
    DiceRequest,
    DiceResponse,
    DiceValue,
    evaluateDiceRequest,
    generateCombinations,
    UnitType
} from './memoir';

function assertEqual(expected: any, actual: any, testName: string) {
    if (deepEqual(actual, expected)) {
        console.log(`✅ ${testName}`);
    } else {
        console.error(`❌ ${testName} - Expected \n"${prettyPrint(expected)}", but got \n"${prettyPrint(actual)}"`);
    }
}

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
    assertEqual(test.expectedResponse, evaluateDiceRequest(test.request), test.name);
});

[
    {
        numDice: 1,
        diceFaces: [1, 2],
        expectedResult: [
            [1],
            [2],
        ],
    }
    ].forEach(function (test) {
        let name = `Num dice: ${test.numDice}`;
        assertEqual(
            f(test.expectedResult),
            f(generateCombinations(test.numDice, test.diceFaces)), name);
})

function deepEqual(x, y) {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
        ok(x).length === ok(y).length &&
        ok(x).every(key => deepEqual(x[key], y[key]))
    ) : (x === y);
}

function f(x) {return x; }

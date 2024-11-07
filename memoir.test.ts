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

function createRequest(parameter: Omit<DiceRequest, 'flagsMeanHit'>): DiceRequest {
    return {
        flagsMeanHit: false,
        ...parameter,
    };
}

type TestCaseEvaluate = {
    name: string
    request: DiceRequest
    expectedResponse: DiceResponse[]
}

let testCasesEvaluate: TestCaseEvaluate[] = [
    {
        name: "one die vs 1 infantry",
        request: createRequest({
            target: UnitType.Infantry,
            numFigures: 1,
            numDice: 1,
        }),
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
        name: "one die vs 1 armor",
        request: createRequest({
            target: UnitType.Armor,
            numFigures: 1,
            numDice: 1,
        }),
        expectedResponse: [{
            numKills: 0,
            probability: 2 / 3,
        }, {
            numKills: 1,
            probability: 1 / 3,
        },
        ]
    },
    {
        name: "one die vs 1 artillery",
        request: createRequest({
            target: UnitType.Artillery,
            numFigures: 1,
            numDice: 1,
        }),
        expectedResponse: [{
            numKills: 0,
            probability: 5 / 6,
        }, {
            numKills: 1,
            probability: 1 / 6,
        },
        ]
    },
    {
        name: "two dice vs 1 infantry",
        request: createRequest({
            target: UnitType.Infantry,
            numFigures: 1,
            numDice: 2,
        }),
        expectedResponse: [{
            numKills: 0,
            probability: .25,
        }, {
            numKills: 1,
            probability: .75,
        },
        ]
    },
    {
        name: "two dice vs 2 infantry",
        request: createRequest({
            target: UnitType.Infantry,
            numFigures: 2,
            numDice: 2,
        }),
        expectedResponse: [{
            numKills: 0,
            probability: .25,
        }, {
            numKills: 1,
            probability: .50,
        }, {
            numKills: 2,
            probability: .25,
        },
        ]
    },
    {
        name: "flags mean hit",
        request: {
            target: UnitType.Infantry,
            numFigures: 1,
            numDice: 1,
            flagsMeanHit: true,
        },
        expectedResponse: [{
            numKills: 0,
            probability: 1/3,
        }, {
            numKills: 1,
            probability: 2/3,
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
    },
    {
        numDice: 2,
        diceFaces: [1, 2],
        expectedResult: [
            [1, 1],
            [1, 2],
            [2, 1],
            [2, 2],
        ],
    },
    {
        numDice: 3,
        diceFaces: [1, 2],
        expectedResult: [
            [1, 1, 1],
            [1, 1, 2],
            [1, 2, 1],
            [1, 2, 2],
            [2, 1, 1],
            [2, 1, 2],
            [2, 2, 1],
            [2, 2, 2],
        ],
    },
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

function f(x) {
    return x;
}

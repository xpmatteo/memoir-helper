import {OddsRequest, OddsResponse, evaluateOddsRequest, enumerateRolls, UnitType} from './memoir';

let numFailures = 0;
function assertEqual(expected: any, actual: any, testName: string) {
    if (deepEqual(actual, expected)) {
        console.log(`✅ ${testName}`);
    } else {
        numFailures++;
        console.error(`❌ ${testName} - Expected \n"${prettyPrint(expected)}", but got \n"${prettyPrint(actual)}"`);
    }
}

function createRequest(parameter:
                           Omit<Omit<Omit<OddsRequest, 'flagsMeanHit'>, 'starsMeanHit'>, 'flagsThatCanBeIgnored'>): OddsRequest {
    return {
        flagsMeanHit: false,
        starsMeanHit: false,
        flagsThatCanBeIgnored: 0,
        ...parameter,
    };
}

function prettyPrint(o: any) {
    return JSON.stringify(o, null, 2);
}

function deepEqual(x, y) {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
        ok(x).length === ok(y).length &&
        ok(x).every(key => deepEqual(x[key], y[key]))
    ) : (x === y);
}

type TestCaseEvaluate = {
    name: string
    request: OddsRequest
    expectedResponse: OddsResponse[]
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
            numHits: 0,
            probability: 0.5,
        }, {
            numHits: 1,
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
            numHits: 0,
            probability: 2 / 3,
        }, {
            numHits: 1,
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
            numHits: 0,
            probability: 5 / 6,
        }, {
            numHits: 1,
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
            numHits: 0,
            probability: .25,
        }, {
            numHits: 1,
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
            numHits: 0,
            probability: .25,
        }, {
            numHits: 1,
            probability: .50,
        }, {
            numHits: 2,
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
            starsMeanHit: false,
            flagsThatCanBeIgnored: 0,
        },
        expectedResponse: [{
            numHits: 0,
            probability: 1/3,
        }, {
            numHits: 1,
            probability: 2/3,
        },
        ]
    },
    {
        name: "stars mean hit",
        request: {
            target: UnitType.Infantry,
            numFigures: 1,
            numDice: 1,
            flagsMeanHit: false,
            starsMeanHit: true,
            flagsThatCanBeIgnored: 0,
        },
        expectedResponse: [{
            numHits: 0,
            probability: 1/3,
        }, {
            numHits: 1,
            probability: 2/3,
        },
        ]
    },
    {
        name: "can ignore one flag",
        request: {
            target: UnitType.Infantry,
            numFigures: 1,
            numDice: 1,
            flagsMeanHit: true,
            starsMeanHit: false,
            flagsThatCanBeIgnored: 1,
        },
        expectedResponse: [{
            numHits: 0,
            probability: .5,
        }, {
            numHits: 1,
            probability: .5,
        },
        ]
    },
    {
        name: "can ignore two flags",
        request: {
            target: UnitType.Infantry,
            numFigures: 1,
            numDice: 2,
            flagsMeanHit: true,
            starsMeanHit: false,
            flagsThatCanBeIgnored: 2,
        },
        expectedResponse: [{
            numHits: 0,
            probability: .25,
        }, {
            numHits: 1,
            probability: .75,
        },
        ]
    },
]

testCasesEvaluate.forEach(function (test: TestCaseEvaluate) {
    assertEqual(test.expectedResponse, evaluateOddsRequest(test.request), test.name);
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
        test.expectedResult,
        enumerateRolls(test.numDice, test.diceFaces), name);
})







process.exitCode = numFailures > 0 ? 1 : 0

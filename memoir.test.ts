import {
    OddsRequest,
    OddsResponse,
    evaluateOddsRequest,
    enumerateRolls,
    UnitType,
    DiceValue,
    ignoreFlags
} from './memoir';

import {
    assertEqual, returnExitCodeToOs
} from './test.lib';

function createRequest(parameter:
                           Omit<Omit<Omit<OddsRequest, 'flagsMeanHit'>, 'starsMeanHit'>, 'flagsThatCanBeIgnored'>): OddsRequest {
    return {
        flagsMeanHit: false,
        starsMeanHit: false,
        flagsThatCanBeIgnored: 0,
        ...parameter,
    };
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
            rolls: 3,
            totalRolls: 6,
            probability: 0.5,
        }, {
            numHits: 1,
            rolls: 3,
            totalRolls: 6,
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
            rolls: 4,
            totalRolls: 6,
            probability: 2 / 3,
        }, {
            numHits: 1,
            rolls: 2,
            totalRolls: 6,
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
            rolls: 5,
            totalRolls: 6,
            probability: 5 / 6,
        }, {
            numHits: 1,
            rolls: 1,
            totalRolls: 6,
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
            rolls: 9,
            totalRolls: 36,
            probability: .25,
        }, {
            numHits: 1,
            rolls: 27,
            totalRolls: 36,
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
            rolls: 9,
            totalRolls: 36,
            probability: .25,
        }, {
            numHits: 1,
            rolls: 18,
            totalRolls: 36,
            probability: .50,
        }, {
            numHits: 2,
            rolls: 9,
            totalRolls: 36,
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
            rolls: 2,
            totalRolls: 6,
            probability: 1/3,
        }, {
            numHits: 1,
            rolls: 4,
            totalRolls: 6,
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
            rolls: 2,
            totalRolls: 6,
            probability: 1/3,
        }, {
            numHits: 1,
            rolls: 4,
            totalRolls: 6,
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
            rolls: 3,
            totalRolls: 6,
            probability: .5,
        }, {
            numHits: 1,
            rolls: 3,
            totalRolls: 6,
            probability: .5,
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
});

const FLAG = DiceValue.Flag;
const IGNO = DiceValue.IgnoredFlag;
const STAR = DiceValue.Star;

[
    {
        ignoredFlags: 0,
        roll: [STAR, FLAG],
        expected: [STAR, FLAG],
    },
    {
        ignoredFlags: 1,
        roll: [STAR, FLAG],
        expected: [STAR, IGNO],
    },
    {
        ignoredFlags: 1,
        roll: [STAR, FLAG, STAR, FLAG],
        expected: [STAR, IGNO, STAR, FLAG],
    },
    {
        ignoredFlags: 2,
        roll: [FLAG, FLAG, FLAG, FLAG],
        expected: [IGNO, IGNO, FLAG, FLAG],
    },
].forEach((test) => {
    ignoreFlags([test.roll], test.ignoredFlags);
    assertEqual([test.expected], [test.roll],
        `ignored ${test.ignoredFlags}, ${test.roll}`)
})


returnExitCodeToOs()

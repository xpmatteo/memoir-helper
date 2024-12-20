import {assertEqual} from "./test.lib.js";
import {evaluateTigerRequest} from "./tiger.js";


[
    {
        oddsRequest: {
            numDice: 1,
            numFigures: 1,
            flagsMeanHit: false,
            flagsThatCanBeIgnored: 0,
            starsMeanHit: false,
            target: undefined
        },
        expectedResponse: {
            totalSuccess: 1,
            totalCombinations: 36,
        }
    },
    {
        oddsRequest: {
            numDice: 1,
            numFigures: 1,
            flagsMeanHit: false,
            flagsThatCanBeIgnored: 0,
            starsMeanHit: true,
            target: undefined
        },
        expectedResponse: {
            totalSuccess: 2,
            totalCombinations: 36,
        }
    },
    {
        oddsRequest: {
            numDice: 1,
            numFigures: 1,
            flagsMeanHit: true,
            flagsThatCanBeIgnored: 0,
            starsMeanHit: true,
            target: undefined
        },
        expectedResponse: {
            totalSuccess: 3,
            totalCombinations: 36,
        }
    },
    {
        oddsRequest: {
            numDice: 1,
            numFigures: 1,
            flagsMeanHit: true,
            flagsThatCanBeIgnored: 1,
            starsMeanHit: false,
            target: undefined
        },
        expectedResponse: {
            totalSuccess: 1,
            totalCombinations: 36,
        }
    },
    {
        oddsRequest: {
            numDice: 2,
            numFigures: 1,
            flagsMeanHit: false,
            flagsThatCanBeIgnored: 0,
            starsMeanHit: false,
            target: undefined
        },
        expectedResponse: {
            totalSuccess: 71,
            totalCombinations: 1296,
        }
    },
    {
        oddsRequest: {
            numDice: 3,
            numFigures: 1,
            flagsMeanHit: false,
            flagsThatCanBeIgnored: 0,
            starsMeanHit: false,
            target: undefined
        },
        expectedResponse: {
            totalSuccess: 3781,
            totalCombinations: 46656,
        }
    },
    {
        oddsRequest: {
            numDice: 4,
            numFigures: 1,
            flagsMeanHit: false,
            flagsThatCanBeIgnored: 0,
            starsMeanHit: false,
            target: undefined
        },
        expectedResponse: {
            totalSuccess: 178991,
            totalCombinations: 6**8,
        }
    },
    {
        oddsRequest: {
            numDice: 5,
            numFigures: 1,
            flagsMeanHit: false,
            flagsThatCanBeIgnored: 0,
            starsMeanHit: false,
            target: undefined
        },
        expectedResponse: {
            totalSuccess: 7944301,
            totalCombinations: 6**10,
        }
    },
    {
        oddsRequest: {
            numDice: 6,
            numFigures: 1,
            flagsMeanHit: false,
            flagsThatCanBeIgnored: 0,
            starsMeanHit: false,
            target: undefined
        },
        expectedResponse: {
            totalSuccess: 338516711,
            totalCombinations: 6**12,
        }
    },
].forEach((test) => {
    assertEqual(
        test.expectedResponse,
        evaluateTigerRequest(test.oddsRequest),
        `${test.oddsRequest.numDice} dice, stars ${test.oddsRequest.starsMeanHit}, flags ${test.oddsRequest.flagsMeanHit}`
    );
});

/*
1 die
0 Hits: 5*6 cases: succeed 0, fail 5*6
1 Hits: 1*6 cases: succeed 1, fail 5
2.8%

2 dice
0 Hits: 25*36 cases: succeed 0,     => 0
1 Hits: 10*36 cases: succeed 1/6    => (10*36)/6 = 60
2 Hits:  1*36 cases: succeed 11/36  => 11
5.5%

3 dice
0 Hits: 125   *216        0
1 Hits: 75    *216       1/6   => (75*216 1 /6)     = 2700
2 Hits: 15    *216      11/36  => (15*216*11)/36 =  990
3 Hits: 1     *216             => (75+15+1)      =   91
                                                 ------
                                                   3781
8.1%
*/

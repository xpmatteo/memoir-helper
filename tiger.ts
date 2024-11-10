// noinspection PointlessArithmeticExpressionJS

import {OddsRequest} from "./memoir";

// odds of obtaining at least 1 grenade with numDice
// function choose(numDice) {
//     return factorial(numDice-1);
// }

function oddsOfAtLeast1Grenade(numDice: number) {
    switch (numDice) {
        case 1: return 1;
        case 2: return 11;
        case 3: return 91;
        default: throw new Error("too many dice: " + numDice);
    }
}

function oddsOfExactlyOneGrenade(numDice: number) {
    switch (numDice) {
        case 1: return 1;
        case 2: return 11;
        case 3: return 91;
        default: throw new Error("too many dice: " + numDice);
    }
}

export function evaluateTiger(oddsRequest: OddsRequest) {
    const totalCombinations = 6**(2*oddsRequest.numDice);
    let totalSuccess = 0;
    if (oddsRequest.numDice === 1) {
        totalSuccess += 1;
    }
    if (oddsRequest.numDice === 2) {
        totalSuccess += 11*36 / 36;
        totalSuccess += 10*36 * 1/6;
    }
    if (oddsRequest.numDice === 3) {
        // totalSuccesses for H hits: combinations * 216 * choose(H, 1) / 6^numHits
        totalSuccess +=   1*6**oddsRequest.numDice * oddsOfAtLeast1Grenade(3) /6**3;   // 3 hits
        totalSuccess += (15*6**oddsRequest.numDice * oddsOfAtLeast1Grenade(2))/6**2;    // 2 hits
        totalSuccess +=  75*6**oddsRequest.numDice * oddsOfAtLeast1Grenade(1)  /6**1;     // 1 hits
    }
    return {
        totalSuccess,
        totalFailure: totalCombinations - totalSuccess,
        totalCombinations,
    }
}

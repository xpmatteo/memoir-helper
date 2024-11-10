
import {evaluateOddsRequest, OddsRequest, UnitType} from "./memoir";

function oddsOfAtLeast1Grenade(numDice: number) {
    switch (numDice) {
        case 1: return 1;
        case 2: return 1 + 10;
        case 3: return 91;
        default: throw new Error("too many dice: " + numDice);
    }
}

export function evaluateTiger(oddsRequest: OddsRequest) {
    const totalCombinations = 6**(2*oddsRequest.numDice);
    oddsRequest.target = UnitType.Artillery;
    oddsRequest.numFigures = oddsRequest.numDice;
    let firstHitOdds = evaluateOddsRequest(oddsRequest).map((oddsResponse) => {
        return oddsResponse.rolls;
    });
    let totalCases = 6**oddsRequest.numDice;
    let totalSuccess = 0;
    for (let hits = oddsRequest.numDice; hits >= 1; hits--) {
        totalSuccess += (firstHitOdds[hits] * totalCases * oddsOfAtLeast1Grenade(hits)) / 6**hits;
    }
    return {
        totalSuccess,
        totalFailure: totalCombinations - totalSuccess,
        totalCombinations,
    }
}

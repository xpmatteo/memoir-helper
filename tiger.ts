
import {evaluateOddsRequest, OddsRequest, UnitType} from "./memoir";

// the odds of rolling at least a Grenade is the opposite of
// the probability that all dice return a non-grenade
// return it in terms of the total number of cases because it is divided by 6**n in the context
// where it's used
function oddsOfAtLeast1Grenade(numDice: number) {
    return 6**numDice - 5**numDice;
}

export function evaluateTiger(oddsRequest: OddsRequest) {
    const totalCombinations = 6**(2*oddsRequest.numDice);
    oddsRequest.target = UnitType.Artillery;
    oddsRequest.numFigures = oddsRequest.numDice;
    let firstHitOdds = evaluateOddsRequest(oddsRequest).map((oddsResponse) => oddsResponse.rolls);
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

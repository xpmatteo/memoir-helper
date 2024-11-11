
import {evaluateOddsRequest, OddsRequest, UnitType} from "./memoir.js";

// the odds of rolling at least a Grenade is the opposite of
// the probability that all dice return a non-grenade
function oddsOfAtLeast1Grenade(numDice: number) {
    return (6**numDice - 5**numDice) / 6**numDice;
}

export function evaluateTigerRequest(oddsRequest: OddsRequest) {
    const totalCombinations = 6**(2*oddsRequest.numDice);
    oddsRequest.target = UnitType.Artillery;
    oddsRequest.numFigures = oddsRequest.numDice;
    let firstHitOdds = evaluateOddsRequest(oddsRequest).map((oddsResponse) => oddsResponse.rolls);
    let totalCases = 6**oddsRequest.numDice;
    let totalSuccess = 0;
    for (let hits = oddsRequest.numDice; hits >= 1; hits--) {
        totalSuccess += (firstHitOdds[hits] * totalCases) * oddsOfAtLeast1Grenade(hits);
    }
    return {
        totalSuccess,
        totalCombinations,
    }
}

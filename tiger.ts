import {OddsRequest} from "./memoir";

export function evaluateTiger(oddsRequest: OddsRequest) {
    return {
        totalSuccess: 1,
        totalFailure: 35,
        totalCombinations: 6**(2*oddsRequest.numDice),
    }
}

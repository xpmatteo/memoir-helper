

import {assertEqual} from "./test.lib";
import {OddsRequest} from "./memoir";
import {evaluateTiger} from "./tiger";


let oddsRequest: OddsRequest = {
    numDice: 1,
    numFigures: 1,
    flagsMeanHit: false,
    flagsThatCanBeIgnored: 0,
    starsMeanHit: false,
    target: undefined
}
let tigerResponae = {
    totalSuccess: 1,
    totalFailure: 35,
    totalCombinations: 36,
};


assertEqual(
    tigerResponae,
    evaluateTiger(oddsRequest),
   "1 dice, no stars, no flags"
);

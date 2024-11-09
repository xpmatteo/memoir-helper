
export enum UnitType {
    Infantry = "Infantry",
    Armor = "Armor",
    Artillery = "Artillery",
}

export enum DiceValue {
    Infantry = "Infantry",
    Armor = "Armor",
    Star = "Star",
    Flag = "Flag",
    Grenade = "Grenade"
}

export type OddsRequest = {
    target: UnitType
    numFigures: number
    numDice: number
    flagsMeanHit: boolean
    starsMeanHit: boolean
    flagsThatCanBeIgnored: number
}

export type OddsResponse = {
    numHits: number
    probability: number
}

type DiceRoll = DiceValue[];

function hits(diceValue: DiceValue, oddsRequest: OddsRequest) {
    return diceValue.toString() == oddsRequest.target.toString()
        || diceValue == DiceValue.Grenade
        || diceValue == DiceValue.Flag && oddsRequest.flagsMeanHit
        || diceValue == DiceValue.Star && oddsRequest.starsMeanHit
        ;
}

function numHits(diceRoll: DiceRoll, oddsRequest: OddsRequest) {
    let result = 0;
    let flagsThatCanBeIgnored = oddsRequest.flagsThatCanBeIgnored;
    for (let i = 0; i < diceRoll.length; i++) {
        if (oddsRequest.flagsMeanHit && diceRoll[i] === DiceValue.Flag && flagsThatCanBeIgnored > 0) {
            flagsThatCanBeIgnored--;
            continue;
        }
        if (hits(diceRoll[i], oddsRequest) && result < oddsRequest.numFigures) {
            result++;
        }
    }
    return result;
}

export function evaluateOddsRequest(request: OddsRequest): OddsResponse[] {
    let diceFaces = [DiceValue.Grenade, DiceValue.Star, DiceValue.Armor, DiceValue.Infantry, DiceValue.Infantry, DiceValue.Flag];
    let rolls = enumerateRolls(request.numDice, diceFaces);
    let classifyRolls = Array(request.numFigures+1).fill(0);
    rolls.forEach(function (roll) {
        let nh = numHits(roll, request);
        classifyRolls[nh]++;
    });
    let result: OddsResponse[] = [];
    for (let i = 0; i < classifyRolls.length; i++) {
        result.push({numHits: i, probability: classifyRolls[i]/rolls.length})
    }
    return result;
}

export function enumerateRolls<T>(numDice: number, diceFaces: T[]): T[][] {
    if (numDice === 0) {
        return [];
    }
    let result: T[][] = []
    if (numDice === 1) {
        diceFaces.forEach(function (face) {
            result.push([face]);
        })
        return result;
    }
    let recResult = enumerateRolls(numDice-1, diceFaces)
    recResult.forEach(function (rec) {
        diceFaces.forEach(function (face) {
            result.push(rec.concat([face]));
        })
    });
    return result;
}




export enum UnitType {
    Infantry = "Infantry",
    Armor = "Armor",
    Artillery = "Artillery",
}

export enum DiceValue {
    Grenade = "Grenade",
    Star = "Star",
    Flag = "Flag",
    IgnoredFlag = "IgnoredFlag",
    Infantry = "Infantry",
    Armor = "Armor",
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
    for (let i = 0; i < diceRoll.length; i++) {
        if (hits(diceRoll[i], oddsRequest) && result < oddsRequest.numFigures) {
            result++;
        }
    }
    return result;
}

function classifyRolls(rolls: DiceValue[][], request: OddsRequest) {
    let classifyRolls = Array(request.numFigures + 1).fill(0);
    rolls.forEach(function (roll) {
        let nh = numHits(roll, request);
        classifyRolls[nh]++;
    });
    return classifyRolls;
}

// Morph some Flags into IgnoredFlags
// Changes the array in-place for speed and preserving memory on small devices
export function ignoreFlags(rolls: (DiceValue)[][], flagsThatCanBeIgnored: number) {
    if (flagsThatCanBeIgnored === 0) {
        return;
    }
    rolls.forEach((roll) => {
        let toBeIgnored = flagsThatCanBeIgnored;
        for (let i = 0; i < roll.length; i++) {
            if (roll[i] === DiceValue.Flag && toBeIgnored > 0)  {
                roll[i] = DiceValue.IgnoredFlag;
                toBeIgnored--;
            }
        }
    });
    return;
}

export function evaluateOddsRequest(request: OddsRequest): OddsResponse[] {
    let diceFaces = [DiceValue.Grenade, DiceValue.Star, DiceValue.Armor, DiceValue.Infantry, DiceValue.Infantry, DiceValue.Flag];
    let rolls = enumerateRolls(request.numDice, diceFaces);
    ignoreFlags(rolls, request.flagsThatCanBeIgnored);
    let rollsCountByHits = classifyRolls(rolls, request);
    let result: OddsResponse[] = [];
    for (let i = 0; i < rollsCountByHits.length; i++) {
        result.push({numHits: i, probability: rollsCountByHits[i]/rolls.length})
    }
    return result;
}

export function enumerateRolls<T>(numDice: number, diceFaces: T[]): T[][] {
    if (numDice === 0) {
        return [];
    }
    let result: T[][] = [];
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



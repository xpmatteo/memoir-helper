
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

export type DiceRequest = {
    target: UnitType
    numFigures: number
    numDice: number
    flagsMeanHit: boolean
    starsMeanHit: boolean
    flagsThatCanBeIgnored: number
}

export type DiceResponse = {
    numHits: number
    probability: number
}

function hits(diceValue: DiceValue, diceRequest: DiceRequest) {
    return diceValue.toString() == diceRequest.target.toString()
        || diceValue == DiceValue.Grenade
        || diceValue == DiceValue.Flag && diceRequest.flagsMeanHit
        || diceValue == DiceValue.Star && diceRequest.starsMeanHit
        ;
}

function numHits(combination: DiceValue[], diceRequest: DiceRequest) {
    let result = 0;
    let flagsThatCanBeIgnored = diceRequest.flagsThatCanBeIgnored;
    for (let i = 0; i < combination.length; i++) {
        if (diceRequest.flagsMeanHit && combination[i] === DiceValue.Flag && flagsThatCanBeIgnored > 0) {
            flagsThatCanBeIgnored--;
            continue;
        }
        if (hits(combination[i], diceRequest) && result < diceRequest.numFigures) {
            result++;
        }
    }
    return result;
}

export function evaluateDiceRequest(request: DiceRequest): DiceResponse[] {
    let diceFaces = [DiceValue.Grenade, DiceValue.Star, DiceValue.Armor, DiceValue.Infantry, DiceValue.Infantry, DiceValue.Flag];
    let combinations = generateCombinations(request.numDice, diceFaces);
    let classifyCombinations = Array(request.numFigures+1).fill(0);
    combinations.forEach(function (combination) {
        let nk = numHits(combination, request);
        classifyCombinations[nk]++;
    });
    let result = [];
    for (let i = 0; i <classifyCombinations.length; i++) {
        result.push({numHits: i, probability: classifyCombinations[i]/combinations.length})
    }
    return result;
}

export function generateCombinations(numDice: number, diceFaces: any[]): any[][] {
    if (numDice === 0) {
        return [];
    }
    let result = []
    if (numDice === 1) {
        for (let i = 0; i < diceFaces.length; i++) {
            result.push([diceFaces[i]]);
        }
        return result;
    }
    let recResult = generateCombinations(numDice-1, diceFaces)
    for (let r = 0; r < recResult.length; r++) {
        let rec = recResult[r];
        for (let i = 0; i < diceFaces.length; i++) {
            result.push(rec.concat([diceFaces[i]]));
        }
    }
    return result;
}



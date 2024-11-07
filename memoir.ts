
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
    numDice: number
}

export type DiceResponse = {
    numKills: number
    probability: number
}

export function evaluateDiceRequest(request: DiceRequest): DiceResponse[] {
    if (request.target == UnitType.Armor) {
        return [
            {numKills: 0, probability: 2/3,},
            {numKills: 1, probability: 1/3,},
        ]
    }
    return [
        {numKills: 0, probability: 0.5,},
        {numKills: 1, probability: 0.5,},
    ]
}

export function generateCombinations(numDice: number, diceFaces: any[]): number[][] {
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




function dieRoll() {
    return Math.floor(Math.random() * 6 + 1);
}

function rollAHit() {
    return dieRoll() === 6;
}

function simulate2(times) {
    let tigerHits = 0;
    for (let i = 0; i < times; i++) {
        let numHits = 0;
        if (rollAHit()) numHits++;
        if (rollAHit()) numHits++;
        if (numHits === 2 && (rollAHit() || rollAHit()))
            tigerHits++;
        if (numHits === 1 && rollAHit())
            tigerHits++;
    }
    return tigerHits/times;
}

// let s = simulate2(100000000);
// let exp = 71/(6**4);
// console.log(`expected: ${exp}`)
// console.log(`actual  : ${s}`)

function simulate3(times) {
    let tigerHits = 0;
    for (let i = 0; i < times; i++) {
        let numHits = 0;
        if (rollAHit()) numHits++;
        if (rollAHit()) numHits++;
        if (rollAHit()) numHits++;
        if (numHits === 3 && (rollAHit() || rollAHit() || rollAHit()))
            tigerHits++;
        if (numHits === 2 && (rollAHit() || rollAHit()))
            tigerHits++;
        if (numHits === 1 && rollAHit())
            tigerHits++;
    }
    return tigerHits/times;
}

// let s = simulate3(100000000);
// let exp = 3781/(6**6);
// console.log(`expected: ${exp}`)
// console.log(`actual  : ${s}`)


function simulate4(times) {
    let tigerHits = 0;
    for (let i = 0; i < times; i++) {
        let numHits = 0;
        if (rollAHit()) numHits++;
        if (rollAHit()) numHits++;
        if (rollAHit()) numHits++;
        if (rollAHit()) numHits++;
        if (numHits === 4 && (rollAHit() || rollAHit() || rollAHit() || rollAHit()))
            tigerHits++;
        if (numHits === 3 && (rollAHit() || rollAHit() || rollAHit()))
            tigerHits++;
        if (numHits === 2 && (rollAHit() || rollAHit()))
            tigerHits++;
        if (numHits === 1 && rollAHit())
            tigerHits++;
    }
    return tigerHits/times;
}

let s = simulate4(100000000);
let exp = 178991/6**8;
console.log(`expected: ${exp}`)
console.log(`actual  : ${s}`)

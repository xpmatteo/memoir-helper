
// bug: the numFailures is not reset between one unit test file and the next
let numFailures = 0;
export function assertEqual(expected: any, actual: any, testName: string) {
    if (deepEqual(actual, expected)) {
        console.log(`✅ ${testName}`);
    } else {
        numFailures++;
        console.error(`❌ ${testName} - Expected \n"${prettyPrint(expected)}", but got \n"${prettyPrint(actual)}"`);
    }
}

export function returnExitCodeToOs() {
    process.exitCode = numFailures > 0 ? 1 : 0
}


function prettyPrint(o: any) {
    return JSON.stringify(o, null, 2);
}

function deepEqual(x, y) {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
        ok(x).length === ok(y).length &&
        ok(x).every(key => deepEqual(x[key], y[key]))
    ) : (x === y);
}


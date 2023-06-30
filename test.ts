function randomWait(lower: number, upper: number) {
    let time = lower+(Math.random() * (upper-lower))
    basic.pause(time)
}

function keyDot() {
    let dotTime = morse.dotTime()
    morse.keyDown()
//    basic.pause(dotTime)
    randomWait(10, 2*dotTime-10)
    morse.keyUp()
}

function keyDash() {
    let dotTime = morse.dotTime()
    morse.keyDown()
//    basic.pause(3*dotTime)
    randomWait(2*dotTime+10, 4*dotTime)
    morse.keyUp()
}

function waitSpace() {
    let dotTime = morse.dotTime()
//    basic.pause(3*dotTime)
    randomWait(2.5*dotTime, 4.5*dotTime)
}


let expectedCodes: [string] = null
let expectedSequence: [string] = null
let expectedDitsDahs: [string] = null

morse.onCodeSelected( function (code: string, sequence: string) {
    if(expectedCodes!=null && expectedCodes.length > 0) {
        let ec = expectedCodes.get(0)
         if(ec != code) {
            serial.writeLine("ERR: Expected " + ec + "got " + code)
        }
        expectedCodes.shift()
    }
    if (expectedSequence != null && expectedSequence.length > 0) {
        let es = expectedSequence.get(0)
        if (es != sequence) {
            serial.writeLine("ERR: Expected " + es + "got " + sequence)
        }
        expectedSequence.shift()
    }
})

morse.setDotTime(200)

serial.writeLine("Test 1:")
let toSend = ".- -... -.-."
expectedCodes = ["A", "B", "C"]

for(let i = 0;i<toSend.length;i++) {
    serial.writeLine("Sending: " + toSend.charAt(i))
    switch(toSend.charAt(i)) {
        case ".": keyDot();    break;
        case "-": keyDash();   break;
        case " ": waitSpace(); break;
    }
}
waitSpace()
waitSpace()
waitSpace()
waitSpace()
if(expectedCodes.length!=0) {
    serial.writeLine("Test 1 Failed")
    serial.writeLine(expectedCodes.join(","))
}
else {
    serial.writeLine("Test 1 Passed")
}

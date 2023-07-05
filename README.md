```package
morse=github:bsiever/pxt-morse
```

```package
clicks=github:bsiever/microbit-pxt-clicks
```

# Morse Decoder

This extension can decode and encode dots/dashes of Morse Code as well as manage the detection of keying in of Morse code. 

* There are three major components to this extension:
  * [Keying](#morse-keying) in Morse code, which requires precise timing of pressing and releasing the "key". 
  * [Decoding](#morse-decoding) a sequence of key presses (dots, dashes and silences) into a symbol (letter) based on Morse code. 
  * [Encoding](#morse-encoding) a sequence of letters into symbols that represent the sequence of key presses (and silences) needed to send those letters via Morse code.

# Keying #morse-keying

"Keying" refers to keying in the dots, dashes, and "silences".   
Here "keying" in codes with key up and key down will automatically start processing the keys.

Keying with the built-in buttons may be easier if the [Button Clicks](https://makecode.microbit.org/pkg/bsiever/microbit-pxt-clicks) extension's `on button down` and `on button up` blocks are used.



## Key Down #morse-keydown

```sig
morse.keyDown() : void
``` 
The Morse code key has been pressed.

## Key Up  #morse-keyup

```sig
morse.keyUp() : void
``` 
The Morse code key has been released.

## Set Dot and Dash Times / Timing  #morse-setmaxdotdashtimes

```sig 
morse.setMaxDotDashTimes(dotTime: number, dashTime: number) {
```

Set the maximum time (in milliseconds) of dots and dashes. 
* A dot is when the key is held between 1ms and the max dot time (\[1ms..`maxDotTime`]).
* A dash when the key is held more than a dot and less than the max dash time ((`maxDotTime`..`maxDashTime`]). 
* If the key is held longer than the max dash time, the decoding state will be reset (i.e., current set of dots/dashes will be abandoned). 

## Get the Max Dot Time  #morse-maxdottime

```sig
morse.maxDotTime()
```

Provides the current maximum dot time. 

## Get the Max Dot Time  #morse-maxdashtime

```sig
morse.maxDashTime()
```

Provides the current maximum dash time. 

## Set Silence Between Symbols Letters Times / Timing  #morse-setsilencebetweensymbolsLetterstimes

```sig 
morse.setSilenceBetweenSymbolsLettersTimes(symbolTime: number, letterTime: number) 
```

Set the minimum time (in millisecondes) of slience allowed between symbols (dots/dashes) and letters of a word. 
* The `letterTime` will be greather than or equal to the `symbolTime`
* If the silence exceeds the `symbolTime`, the sequence of dots/dashes will be considered to be compelte and will be decoded. 
* If the silence exceeds the `letterTime`, it will be considered a "silence" between words (decoded as a space (` `)).

## Get the Minimum Between Symbol Time  #morse-minbetweensymboltime

```sig
morse.minBetweenSymbolTime()
```

Provides the current minimum time allowed between symbols (dots and dashes) before considering the sequence of dots/dashes completed.  

## Get the Minimum Between Letter Time  #morse-minbetweenlettertime

```sig
morse.minBetweenLetterTime()
```

Provides the current minimum time before considering the preceeding letters to be completed (before being considered a silence between words or end of transmissions).  When this time is exceeded it will be decoded as a space (` `). 

## Reset Key timing  #morse-resettiming

```sig
morse.resetTiming() : void
``` 

Reset Timing of keying. May be needed if dot time is changed while in the midst of keying in a symbol. Resetting decoding may also be needed.

# Identifying when individual symbols are Keyed In  #morse-onnewsymbol

```sig
morse.onNewSymbol(handler: (symbol: string) => void)
```

The `symbol` will indicate the which symbol has been detected/entered. `.`, `-`, or `` (empty string is silences between dots/dashes), `-` (silence between letters) or ` ` (end of word/sentence/transmission).


# Decoding  #morse-decoding

Decoding refers to decoding a sequence of dots, dashes, and silences into letters based on Morse code.

## Dot  #morse-dot

```sig
morse.dot() : void
``` 

Register that a "dot" (dit) has happened.

## Dash #morse-dash

```sig
morse.dash() : void
``` 

Register that a "dash" (dah) has happened.

## Reset Decoding  #morse-resetdecoding

```sig
morse.resetDecoding() : void
``` 

Reset dash/dot processing. That is, start at the beginning as though nothing had been keyed in.

## Silence  #morse-silence

```sig
morse.silence(kind?: morse.Silence) : void
``` 

Register that a silence between things has happened.  `morse.Silence.Small` are "small silences" used between dots and dashes and are ignored.  `morse.Silence.InterLetter` and `morse.Silence.InterWord` are silences between letters (usually take the time of three dots) and words (usually takes the time of seven dots) and indicate that a character has been found / selected.

### ~alert

# Silences are needed

A `morse.Silence.InterLetter` or `morse.Silence.InterWord` is required to detect a letter. 

### ~

## On Code Selected  #morse-oncodeselected

```sig
morse.onCodeSelected(handler: (code: string, sequence: string) => void) 
``` 
A code has been selected (following a  `morse.Silence.InterLetter` or a  `morse.Silence.InterWord`). A valid code will be represented with a valid Morse character.  An invalid Morse code will be indicated with a code that is a question mark (?).  `sequence` will be the sequence of dots and dashes in the code.  If there's an end-of-word or end-of-transmission silence (> min letter between letters time), the code will be an underscore (` `) and the sequence will be empty.

Note that several codes are unused by traditional Morse code.  In these cases the `code` will be `?` and the `sequence` will indicate the sequence of dots and dashes. 

Unused codes include:
* Any sequence of 6 dots/dashes. 
* Four sequences of four symbols: `..--`, `.-.-`, `---.`, `----`
* And several sequences of 5 symbols:  `...-.`, `..-..`, `..-.-`, `..--.`, `.-...`, `.-..-`, `.-.--`, `.--..`, `.--.-`, `.---.`, `-..--`, `-.-..`, `-.-.-`, `-.--.`, `-.---`, `--..-`, `--.-.`, `--.--`, `---.-`

## Peek at the current Code  #morse-peekcode

```sig
morse.peekCode()
```

Provide the code described by the currently entered dots and dashes. 

## Peek at the current sequence  #morse-peeksequence

```sig
morse.peekSequence()
```

Provide the sequence of dots and dashes that is currently entered. 

# Encoding #morse-encoding

Encoding refers to converting letters and spaces to Morse code.

## Encoding text as Morse Code   #morse-encode

```sig
morse.encode(characters: string) : string 
```

The given string will be converted to a represntation of Morse code using dots (.), dashes (-), spaces indicatins gaps between the symbols for a letter, and tabs indicating the gaps between words.

# Examples

## Morse Code Trainer

This example can help you learn the "code" part of Morse code without the timing.
* Use button A to enter a dot 
* Use button B to enter a dash 
* Use button A+B when you are done with a full symbol and the screen will display the symbol you selected. 

For example, the code for the letter U is "..-".  To practice entering a "U" you would press button A twice, then button B, then A+B.  The screen should show the "U". 

```block 
input.onButtonPressed(Button.A, function () {
    morse.dot()
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
    basic.pause(200)
    basic.clearScreen()
})
morse.onCodeSelected(function (code, sequence) {
    basic.showString("" + (code))
})

input.onButtonPressed(Button.AB, function () {
    basic.showIcon(IconNames.Yes)
    morse.silence(morse.Silence.InterLetter)
})
input.onButtonPressed(Button.B, function () {
    morse.dash()
    basic.showLeds(`
        . . . . .
        . . . . .
        # # # # #
        . . . . .
        . . . . .
        `)
    basic.pause(200)
    basic.clearScreen()
})

```

## Key Timing Trainer

Here's a simple program that also uses the "Clicks" extension to help practice keying.  
* Button A acts as the key. 
* The `start` block can be used to change the timing of dots, dashes, and "silences". 
* The display will show:
  * A single dot or a dash after successfully keying in a dot or dash. 
  * A letter / code after a successfully keying a code. 
  * An underscore (`_`) for the silence at the conclusion of a word/transmission.

### ~alert

The example uses a special form of `showString` to ensure it's shown fast enough 
to keep up with Morse code entry.  This version of "Show String" isn't available as a block.

### ~

```block
morse.onCodeSelected(function (code, sequence) {
    // Make silences visible.
    if(code == " ") {
        code = "_"
    }
    serial.writeLine("Code: " + code)
    basic.showString(code, 0)
})
buttonClicks.onButtonUp(buttonClicks.AorB.A, function () {
    morse.keyUp()
})
morse.onNewSymbol(function (newSymbol) {
    serial.writeLine("" + (newSymbol))
    basic.showString(newSymbol,0)
})
buttonClicks.onButtonDown(buttonClicks.AorB.A, function () {
    morse.keyDown()
})
input.onButtonPressed(Button.B, function () {
    morse.resetTiming()
    morse.resetDecoding()
})
morse.setMaxDotDashTimes(200, 1000)
morse.setSilenceBetweenSymbolsLettersTimes(500, 3000)

```

## Morse Code Keying Trainer 

The code below can be used to practice keying in Morse code.  It will show the code letter for the current sequence of dots/dashes that were entered with button A.  It will "flash" when the code is completed/accepted. 

```block 
morse.onCodeSelected(function (code, sequence) {
    basic.showString(code, 100)
    game.addScore(1)
})
buttonClicks.onButtonUp(buttonClicks.AorB.A, function () {
    morse.keyUp()
})
morse.onNewSymbol(function (newSymbol) {
    if (newSymbol == "-" || newSymbol == ".") {
        basic.showString(morse.peekCode(), 0)
    }
})
buttonClicks.onButtonDown(buttonClicks.AorB.A, function () {
    morse.keyDown()
})

```

# Acknowledgements 

This was inspired by the work of "grandpaBond" on the Micro:bit Developer Slack Forum, who created this fantastic example to help kids learn Morse Code: [https://makecode.microbit.org/24561-13529-14704-94719](https://makecode.microbit.org/24561-13529-14704-94719).

Icon based on [Font Awesome icon 0xF141](https://www.iconfinder.com/search?q=f141) SVG.

# Misc. 

I develop micro:bit extensions in my spare time to support activities I'm enthusiastic about, like summer camps and science curricula.  You are welcome to become a sponsor of my micro:bit work (one time or recurring payments), which helps offset equipment costs: [here](https://github.com/sponsors/bsiever). Any support at all is greatly appreciated!

## Supported targets

for PXT/microbit

<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>

<!--
# TODO 

Consider the decoding approach described here: http://greatfractal.com/MorseDecoded.html 

-->
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
  * [Decoding](#morse-decoding) a sequence of key presses (dots, dashes and spaces) into a symbol (letter) based on Morse code. 
  * [Encoding](#morse-encoding) a sequence of letters into symbols that represent the sequence of key presses (and spaces) needed to send those letters via Morse code.

# Keying #morse-keying

"Keying" refers to keying in the dots, dashes, and "spaces" (quiet periods).   
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

## Set Dot Time / Timing  #morse-setdottime

```sig 
morse.setDotTime(time : number) : void
```

Set the time (in milliseconds) of a "dot". 
* Dashes should be three times the length of a dot.
* The time between consecutive symbols (dots or dashes) should be the same as the "dot time"
* The time at the completion of a letter should be three times the dot time.
* The time at the completion of a word should be at least seven times the dot time.

Keying in requires timing within a sepcified error of the "Dot time" to be recognized.

## Get the Dot Time  #morse-dottime

```sig
morse.dotTime()
```

Provides the current dot time. 

## Set the Dot Time Error  #morse-setdottimeerror

```sig
morse.setDotTimeError(percent: number) : void 
```

Set the dot time error (1-100%). 

## Get the Dot Time Error  #morse-dottimeerror

```sig
morse.dotTimeError()
```

Provides the current dot time error as a percentage. 

## Reset Key timing  #morse-resettiming

```sig
morse.resetTiming() : void
``` 

Reset Timing of keying. May be needed if dot time is changed while in the midst of keying in a symbol. Resetting decoding may also be needed.

# Identifying when individual symbols are Keyed In  #morse-onnewsymbol

```sig
morse.onNewSymbol(handler: (symbol: string) => void)
```

The `symbol` will indicate the which symbol has been detected/entered. `.`, `-`, or ` ` (space between dots/dashes), `&` (space between words) or `#` (end of word/sentence/transmission).


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

## Space (silence)  #morse-space

```sig
morse.space(kind?: morse.Space) : void
``` 

Register that a space between things has happened.  `morse.Space.Small` are "small spaces" used between dots and dashes and are ignored.  `morse.Space.InterLetter` and `morse.Space.InterWord` are spaces between letters (usually take the time of three dots) and words (usually takes the time of seven dots) and indicate that a character has been found / selected.

### ~alert

# Spaces are needed

A `morse.Space.InterLetter` and `morse.Space.InterWord` is required to detect a letter. 

### ~

## On Code Selected  #morse-oncodeselected

```sig
morse.onCodeSelected(handler: (code: string, sequence: string) => void) 
``` 
A code has been selected (following a  `morse.Space.InterLetter` or a  `morse.Space.InterWord`). A valid code will be represented with a valid Morse character.  An invalid Morse code will be indicated with a code that is a question mark (?).  `sequence` will be the sequence of dots and dashes in the code. 

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
    morse.space(morse.Space.InterLetter)
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
* The bottom, right LED will blink to show the "dot time".  A full on/off cycle is a "dot time"
* Button A acts as the key. 
* The `start` block can be used to change dot time and allowed error.  The example below uses the default values and could be omitted if they are not going to be changed (1 second ± 50%, so a dot can be 0.5-1.5 seconds and a dash from 2.5-3.5 seconds).
* The display will show:
  * A single dot or a dash after successfully keying in a dot or dash. 
  * A checkmark for the rest at the end of complete letter (selecting a code), which is ~3 dot times of no key pressed.
  * An X for the space at the conclusion of a word/transmission, which is ~7 dot times of no key pressed.

```block
buttonClicks.onButtonUp(buttonClicks.AorB.A, function () {
    morse.keyUp()
})
morse.onNewSymbol(function (newSymbol) {
    if (newSymbol == "&") {
        basic.showIcon(IconNames.Yes)
    } else if (newSymbol == "#") {
        basic.showIcon(IconNames.No)
    } else if (newSymbol == "-") {
        basic.showLeds(`
            . . . . .
            . . . . .
            # # # # #
            . . . . .
            . . . . .
            `)
    } else if (newSymbol == ".") {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
            `)
    } else {
        basic.showIcon(IconNames.Sad)
    }
    basic.pause(200)
    basic.clearScreen()
})
buttonClicks.onButtonDown(buttonClicks.AorB.A, function () {
    morse.keyDown()
})
morse.setDotTimeError(50)
morse.setDotTime(1000)
basic.forever(function () {
    basic.pause(morse.dotTime() / 2)
    led.toggle(4, 4)
})

```

## Morse Code Keying Trainer 

The code below can be used to practice keying in Morse code.  It will show the code letter for the current sequence of dots/dashes that were entered with button A.  It will "flash" when the code is completed/accepted. 

The bottom, right LED will blink to show the "Dot time".  A full on/off cycle is a "dot time"

```block 
morse.onCodeSelected(function (code, sequence) {
    basic.showString("" + (code))
    game.addScore(1)
})
buttonClicks.onButtonUp(buttonClicks.AorB.A, function () {
    morse.keyUp()
})
morse.onNewSymbol(function (newSymbol) {
    if (newSymbol == "-" || newSymbol == ".") {
        basic.showString(morse.peekCode())
    }
})
buttonClicks.onButtonDown(buttonClicks.AorB.A, function () {
    morse.keyDown()
})
morse.setDotTimeError(50)
morse.setDotTime(1000)
basic.forever(function () {
    basic.pause(morse.dotTime() / 2)
    led.toggle(4, 4)
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

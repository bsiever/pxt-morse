```package
pxt-morse=github:bsiever/pxt-morse
```

```package
microbit-pxt-clicks=github:bsiever/microbit-pxt-clicks
```


# Morse Decoder

This extension can decode and encode dots/dashes of Morse Code as well as manage the detection of keying in of Morse code. 

# Keying

"Keying" refers to keying in the dots, dashes, and "spaces" (quiet periods).   



## Key Down

```sig
morse.keyDown() : void
``` 
The Morse code key has been pressed.

## Key Up

```sig
morse.keyUp() : void
``` 
The Morse code key has been released.

## Set Dot Time / Timing 

```sig 
morse.setDotTime(time : number) : void
```

Set the time (in milliseconds) of a "dot". 
* Dashes should be three times the length of a dot.
* The time between consecutive symbols (dots or dashes) should be the same as the "dot time"
* The time at the completion of a letter should be three times the dot time.
* The time at the completion of a word should be at least seven times the dot time.

Keying in requires timing withing 50% of a "Dot time" to be recognized.

## Reset Key timing

```sig
morse.resetKeyTiming() : void
``` 

Reset Timing of keying. May be needed if dot time is changed while in the midst of keying in a symbol. Resetting decoding may also be needed.

# Identifying when individual symbols are keyed In

```
morse.onNewSymbol(handler: (symbol: string) => void) : void 
```

The `symbol` will indicate the which symbol has been detected/entered. `.`, `-`, or ` ` (space between dots/dashes), `\t` (space between words) or `\n` (end of word/sentence/transmission).

# Decoding refers to decoding a sequence of dots, dashes, and silences into letters based on Morse code.

## Dot 

```sig
morse.dot() : void
``` 

Register that a "dot" (dit) has happened.

## Dash

```sig
morse.dash() : void
``` 

Register that a "dash" (dah) has happened.

## Reset Decoding

```sig
morse.resetDecoding() : void
``` 

Reset dash/dot processing. That is, start at the beginning as though nothing had been keyed in.

## Space (silence)

```sig
morse.space(kind?: morse.Space) : void
``` 

Register that a space between things has happened.  `morse.Space.Small` are "small spaces" used between dots and dashes and are ignored.  `morse.Space.InterLetter` and `morse.Space.InterWord` are spaces between letters (usually take the time of three dots) and words (usually takes the time of seven dots) and indicate that a character has been found / selected.

### ~alert

# Spaces are needed

A `morse.Space.InterLetter` and `morse.Space.InterWord` is required to detect a letter. 

### ~

## On Code Selected

```sig
morse.onCodeSelected(handler: (code: string, sequence: string) => void) 
``` 
A code has been selected (following a  `morse.Space.InterLetter` or a  `morse.Space.InterWord`). A valid code will be represented with a valid Morse character.  An invalid Morse code will be indicated with a code that is a question mark (?).  `sequence` will be the sequence of dots and dashes in the code. 

Note that several codes are unused by traditional Morse code.  In these cases the `code` will be `?` and the `sequence` will indicate the sequence of dots and dashes. 

Unused codes include:
* Any sequence of 6 dots/dashes. 
* `...-.` (Verify)
* `..-..` (É)
* `..-.-` (PLS RPT)
* `..--` (Ü), `..--.` (Ð)
* `.-...` (Wait), `.-..-` (È)
* `.-.-` (Ä)
* TODO: Complete.

# Encoding refers to converting letters and spaces to Morse code.

## Encoding text as Morse Code 

```sig
morse.encode(characters: string) : string 
```

The given string will be converted to a represntation of Morse code using dots (.), dashes (-), spaces indicatins gaps between the symbols for a letter, and tabs indicating the gaps between words.

# Examples


## Keying Trainer

Here's a simple program that also uses the "Clicks" extension to help practice keying.  It will show a dot, dash, or icons for the different types of Morse code symbols and pauses. 

```block
buttonClicks.onButtonUp(buttonClicks.AorB.A, function () {
    morse.keyUp()
})
morse.onNewSymbol(function (newSymbol) {
    if (newSymbol == " ") {
        basic.showIcon(IconNames.SmallSquare)
    } else if (newSymbol == "&") {
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
})
buttonClicks.onButtonDown(buttonClicks.AorB.A, function () {
    morse.keyDown()
})

```

# TODO / Examples

TODO: Example of Decoding 
TODO: Example of Encoding 
TODO: Help text / linking


# Acknowledgements 

This was inspired by the work of "grandpaBond" on the Micro:bit Developer Slack Forum, who created this fantastic example to help kids learn Morse Code: [https://makecode.microbit.org/24561-13529-14704-94719](https://makecode.microbit.org/24561-13529-14704-94719).

Icon based on [Font Awesome icon 0xF141](https://www.iconfinder.com/search?q=f141) SVG.


# Misc. 

I develop micro:bit extensions in my spare time to support activities I'm enthusiastic about, like summer camps and science curricula.  You are welcome to become a sponsor of my micro:bit work (one time or recurring payments), which helps offset equipment costs: [here](https://github.com/sponsors/bsiever). Any support at all is greatly appreciated!

## Supported targets

for PXT/microbit

<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>

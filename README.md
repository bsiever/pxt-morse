```package
pxt-morse=github:bsiever/pxt-morse
```

# Morse Decoder

This extension can decode dots/dashes of Morse Code. 

# Key Down

```sig
morse.keyDown() : void
``` 
The Morse code key has been pressed.

# Key Up

```sig
morse.keyUp() : void
``` 
The Morse code key has been released.

# Set Dot Time / Timing 

```sig 
morse.setDotTime(time : number) : void
```

Set the time (in milliseconds) of a "dot". 
* Dashes should be three times the length of a dot.
* The time between consecutive symbols (dots or dashes) should be the same as the "dot time"
* The time at the completion of a letter should be three times the dot time.
* The time at the completion of a word should be at least seven times the dot time.

Register that a "dash" (dah) has happened.

# Reset Key timing

```sig
morse.resetKeyTiming() : void
``` 

Reset Timing of keying. May be needed if dot time is changed while in the midst of keying in a symbol. Resetting decoding may also be needed.

# Dot 

```sig
morse.dot() : void
``` 

Register that a "dot" (dit) has happened.

# Dash

```sig
morse.dash() : void
``` 

Register that a "dash" (dah) has happened.

# Reset Decoding

```sig
morse.resetDecoding() : void
``` 

Reset dash/dot processing. That is, start at the beginning as though nothing had been keyed in.


# Space 

```sig
morse.space(kind?: morse.Space) : void
``` 

Register that a space between things has happened.  `morse.Space.Small` are "small spaces" used between dots and dashes and are ignored.  `morse.Space.InterLetter` and `morse.Space.InterWord` are spaces between letters (usually take the time of three dots) and words (usually takes the time of seven dots) and indicate that a character has been found / selected.

### ~alert

# Spaces are needed

A `morse.Space.InterLetter` and `morse.Space.InterWord` is required to detect a letter. 

### ~

# On Code Selected

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



# Encoding text as Morse Code 

```sig
morse.encode(characters: string) : string 
```

The given string will be converted to a represntation of Morse code using dots (.), dashes (-), spaces indicatins gaps between the symbols for a letter, and tabs indicating the gaps between words.

# Example 

TODO: UPDATE THIS.

```block

input.onButtonPressed(Button.A, function () {
    morseDecoder.dot()
    morseDecoder.dash()
    morseDecoder.space(morseDecoder.Space.InterLetter)
    
    morseDecoder.dash()
    morseDecoder.dash()
    morseDecoder.dash()
    morseDecoder.dash()
    morseDecoder.dash()
    morseDecoder.space(morseDecoder.Space.InterLetter)
})
morseDecoder.onCodeSelected(function (code) {
    serial.writeLine("code=" + code)
})

```


# Acknowledgements 

Icon based on [Font Awesome icon 0xF0A7](https://www.iconfinder.com/search?q=f0a7) SVG.


# Misc. 

I develop micro:bit extensions in my spare time to support activities I'm enthusiastic about, like summer camps and science curricula.  You are welcome to become a sponsor of my micro:bit work (one time or recurring payments), which helps offset equipment costs: [here](https://github.com/sponsors/bsiever). Any support at all is greatly appreciated!

## Supported targets

for PXT/microbit



<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>

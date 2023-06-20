```package
pxt-morsedecoder=github:bsiever/pxt-morsedecoder
```

# Morse Decoder

This extension can decode dots/dashes of Morse Code. 

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

# Reset 

```sig
morse.reset() : void
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
morse.onCodeSelected(handler: (code: string) => void) 
``` 
A valid code has been selected (following a  `morse.Space.InterLetter` or a  `morse.Space.InterWord`)


# On Error

```sig
morse.onError(handler: () => void) 
``` 

The current pattern of dots/dashes does not result in a valid code letter. 

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

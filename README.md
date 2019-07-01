# Wiki Fetch

## Description
A Google Chrome Extension that grabs Wikipedia text and downloads it for you. It also traverses the website in either a breadth-first search or a depth-first search, check the options.

## To get started using it:
1. Clone the repository into some folder of your choosing.
2. Launch Google Chrome.
3. go to: chrome://extensions.
4. Turn on Developer mode using the switch at the top-right corner of the screen.
5. Click the "load unpacked" button at the top-left corner of the screen.
6. Browse to and select the inner-most folder before the files of the extension start to appear.

## Known issues:
1. On Windows, the downloaded file-names are not meaningful. A quick fix should remove this.
2. The depth-first search can run into a stub topic, which can stop the progression (it's not really depth-first search).

## Features:
- ANSI to ASCII conversion: é becomes e, et cetera... 
- ASCII output: 1-byte per character.

## Features to add:
- More options in the option page to change how the text is processed.

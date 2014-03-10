jquery-events-recorder
======================

Record your interactions on the page like Selenium

## How to use

Include jQuery and JQuery Events Recorder files into your webpage and follow the code bellow:

```javascript
var r = new Recorder();
r.start(); // Start recording your actions on page
var script = r.getScript(); // returns a string with a jQuery code of your actions on the page
```

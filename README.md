# json-esc

Sanitize JSON for possible malicious HTML. Prevents possible XSS vectors such as:

```html
<script type="application/json" id="props">
{ 
    "key": "<\/script><script>alert(\"pawned\");<\/script>",
}
</script>
```

and:

```html
<div id="el"></div>
<script type="application/json" id="props">
{ 
    "key": "<img src=0 onerror=\"alert(\"pawned\")\">",
}
</script>

<script type="text/javascript">
    const data = document.getElementById('props').textContent;
    const decoded = JSON.parse(data);
    document.getElementById('el').innerHTML = decoded['key'];
</script>
```

## Installation

```bash
$ npm install json-esc
```

## Example

```js
import esc from 'json-esc';

const escaped = JSON.stringify({}, esc());
```

## Description




## API

This module consist of one method which returns a new method intended to be used as a replacer method for `JSON.stringify()`.

```js
import esc from 'json-esc';

const replacer = esc();
const escaped = JSON.stringify({}, replacer);
```

### options

The method can take a configuration options object. The following values can be provided:

 * **disable** - `Boolean` - Disable escaping of given characters - `optional`


## License

The MIT License (MIT)

Copyright (c) 2023 - Trygve Lie - post@trygve-lie.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
---
layout:     art
title:      Tatters
permalink:  /art/tatters
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@abhshkdz</title>
    <script id="fxhash-snippet">
        //---- do not edit the following code (you can indent as you wish)
        let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
        var fxhash = "oo" + Array(49).fill(0).map(_=>alphabet[(Math.random()*alphabet.length)|0]).join('')
        let b58dec = (str) => str.split('').reduce((p,c,i) => p + alphabet.indexOf(c) * (Math.pow(alphabet.length, str.length-i-1)), 0)
        let fxhashTrunc = fxhash.slice(2)
        let regex = new RegExp(".{" + ((fxhashTrunc.length/4)|0) + "}", 'g')
        let hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
        let sfc32 = (a, b, c, d) => {
          return () => {
            a |= 0; b |= 0; c |= 0; d |= 0
            var t = (a + b | 0) + d | 0
            d = d + 1 | 0
            a = b ^ b >>> 9
            b = c + (c << 3) | 0
            c = c << 21 | c >>> 11
            c = c + t | 0
            return (t >>> 0) / 4294967296
          }
        }
        var fxrand = sfc32(...hashes)
        //---- /do not edit the following code
      </script>
</head>
<body>
    <script language="javascript" type="text/javascript" src="/js/tatters/p5.min.js"></script>
    <script src="/js/tatters/main.js?v=0.5.09"></script>
</body>
</html>

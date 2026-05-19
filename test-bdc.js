const lat = -5.756; const lon = -35.2; fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lon).then(r => r.json()).then(j => console.log('BDC:', j));

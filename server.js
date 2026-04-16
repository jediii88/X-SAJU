const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname, {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }
}));

app.listen(8080, () => console.log('Server running on 8080'));
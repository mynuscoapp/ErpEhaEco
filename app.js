const express = require('express');
const app = express();
const port = 3000;

app.get('/bitrixstock', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
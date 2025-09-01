
const express = require('express');
const app = express();

// Test basic server setup
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const port = 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Debug server running on port ${port}`);
});

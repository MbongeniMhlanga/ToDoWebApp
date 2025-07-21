const app = require('./app');
const port = process.env.PORT || 2001;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

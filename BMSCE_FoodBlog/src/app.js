const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

mongoose.connect('mongodb+srv://Shravanth_J:Jaga1979@cluster0.gtnryvj.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Connection to MongoDB failed:', error);
  });
// mongoose.connect('mongodb://localhost/subscribers', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// const db = mongoose.connection
// db.on('error', (error) => console.log(error));
// db.once('open', () => console.log('Connected '));

const subscribersRouter = require('./routes/subscribers.js')
app.use('/subscribers', subscribersRouter)

// anything with /subscribers/skska will go to /subscribers

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
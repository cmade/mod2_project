//Bring in express framework
const express = require('express');

//Bring in database connection
const connectDB = require('./config/db');

const path = require('path');

//Initialize the app variable with express
const app = express();

//Call the connection to the database (connect the database to the application)
connectDB();

//Initialize Middleware body parser, this will allow us to acces the data in when we console log req.body
app.use(express.json({ extended: false }));

//Define routes
//This will access the endpoint files of the particular route + make request to all of the endpoints
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Serve static assets in production
if (PROCESS.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

//Set the port to an env variable for security or run on the local port 5k
const PORT = process.env.PORT || 5000;

//Take the app varibale an listen on a port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

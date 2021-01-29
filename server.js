//Bring in express framework
const express = require('express');

//Bring in database connection
const connectDB = require('./config/db');

//Initialize the app variable with express
const app = express();

//Call the connection to the database (connect the database to the application)
connectDB();

//Initialize Middleware body parser, this will allow us to acces the data in when we console log req.body
app.use(express.json({ extended: false }));

//Add an endpoint (An endpoint refers to a device that exists at the end of a network connection.) The res.send will send data to the browswer
app.get('/', (req, res) => res.send('API running'));

//Define routes
//This will access the endpoint files of the particular route + make request to all of the endpoints
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//Set the port to an env variable for security or run on the local port 5k
const PORT = process.env.PORT || 5000;

//Take the app varibale an listen on a port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

var express = require('express');
var path = require('path');
var bodypareser = require('body-parser')
var mongoose = require('mongoose');
var fs = require('fs');
var morgan = require('morgan');
var routes = require('./lib/routes');

var app = express();

app.use(bodypareser.urlencoded({limit:'5mb',extended:true}));
app.use(bodypareser.json({limit:'5mb'}));
	
app.use(express.static(path.join(__dirname,'app')));

const options = {
  useNewUrlParser: true,
  autoIndex: true, // Don't build indexes
  //reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

routes.configure(app);

var server = app.listen(parseInt(process.env.SERVING_PORT),function(){
	console.log('server start on '+ server.address().port+ ' port');
})
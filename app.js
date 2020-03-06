const http = require('http');
const express = require('express');
const app = express();


const server = http.createServer(app);


app.set('port', 3000);
app.use(express.static(__dirname + '/Public'));

server.listen(3000, function(){});

//lógica sockets
require('./sockets')(server);
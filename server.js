const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const path = require('path');
app.use(cors());
const { Server } = require("socket.io")
const http = require('http');
const server = http.createServer(app);
let users = [];
const io = new Server(server);

app.use(express.static('public'));

app.get('/api/start', (req, res) => {
    io.emit("start", {secondsToStart: 5})
    res.send({
        success: true,
        users: users
    });
});
app.get('/api/reset', (req, res) => {
    users = [];
    io.emit('reset', {});
    res.send({
        success: true,
        users: users
    });
});




io.on('connection', (socket) => {
    console.log('user connected');
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    
    socket.on('login', (data) => {
        console.log(`login ${data.name}`)
        users= [...users, data];
        io.emit('user-change', users);    
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
 });

server.listen((port), () => {
    console.log('Started');
});
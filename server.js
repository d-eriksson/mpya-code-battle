const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const path = require('path');
app.use(cors());

const http = require('http');
let users = [];

app.use(express.static('public'));

app.get('/api/helloWorld', (req, res) => {
    console.log(`Searching for a gif with the term: ${req.query.term}`);
    res.send({
        success: true,
        data: []
    });
});
const server = http.createServer(app);
const { Server } = require("socket.io")

const io = new Server({
  cors: {
    origin: `http://localhost:${port}`
  }
})
io.on('connection', (socket) => {
    console.log('user connected');
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    
    socket.on('login', (data) => {
        console.log(`login ${data.name}`)
        users= [...users, data];
        io.emit('user-added', users);    
    });
});

io.listen(5001);
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
 });
app.listen(port, () => {
   console.log(`Server port ${port}`);
});
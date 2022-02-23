const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const path = require('path');
app.use(cors());
const { Server } = require("socket.io")
const http = require('http');
const server = http.createServer(app);
let currentUsers = [];
let results = {users: []};
const io = new Server(server);
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
app.use(express.static('public'));

app.get('/api/start', (req, res) => {
    io.emit("start", {secondsToStart: 5, gameId: req.query.gameId})
    res.send({
        success: true,
        users: currentUsers
    });
});
app.get('/api/reset', (req, res) => {
    currentUsers = [];
    io.emit('reset', {});
    res.send({
        success: true,
        users: currentUsers
    });
});
app.get('/api/results', (req, res) => {
    res.send({
        success: true,
        results: results
    });
});
app.get('/api/currentRound', (req, res) => {
    res.send({
        success: true,
        results: currentUsers
    });
});
app.get('/api/displayWinners', (req, res) =>{
    let winners = [...results.users];
    winners.forEach(user => {
        let totalPoints = 0;
        user.result.forEach(result => {
            totalPoints += result.points;
        })
        user.totalScore = totalPoints;
    })
    winners.sort((first, second)=>{
        return first.totalScore < second.totalScore;
    });

    io.emit('display-winners', winners.slice(0,3));
    res.send({
        success: true
    });
})
app.post('/api/results',jsonParser, (req, res) => {
    console.log(req.body)
    const found = results.users.find(element => element.name == req.body.name);
    if(found){
        found.result.push({points: req.body.points});
        found.round++;
        let userData = [...currentUsers];
        userData.forEach(user => {
            const found = results.users.find(element => element.name === user.name);
            let points = 0;
            found.result.forEach(result => {
                points += result.points;
            })
            user.points = points;
        })
        io.emit('user-change', {userData});
        res.send({
            results
        });
    }
    else{
        res.send({
            error: "User not found"
        })
    }
    
    
});

io.on('connection', (socket) => {
    console.log('user connected');
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    
    socket.on('login', (data) => {
        const admin = data.name==="DavidSuperAdmin";
        if(!admin){
            const userInPool = currentUsers.find(user => user.name === data.name);
            if(!userInPool){
                currentUsers= [...currentUsers, data];
            }
            const found = results.users.find(element => element.name == data.name);
            if(found && found.round === 0 && userInPool){
                io.emit('username-error', 'Username already taken')
                return;
            }
            if(found){
                found.round = found.result.length;
            } else{
                results.users.push({
                    name: data.name,
                    round: 0,
                    result: []
                })
            }
        }
        
        let userData = [...currentUsers];
        userData.forEach(user => {
            const found = results.users.find(element => element.name === user.name);
            let points = 0;
            found.result.forEach(result => {
                points += result.points;
            })
            user.points = points;
        })
        if(admin){
            io.to(data.socketId).emit('admin-users', userData);
        }else{
            io.emit('user-change', {userData, socketId: data.socketId});
        }
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
 });

server.listen((port), () => {
    console.log('Started');
});
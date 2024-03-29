var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Send current time to all connected clients
function sendTime() {
    io.sockets.emit('time', {
        time: new Date().toJSON() 
    });
}

io.sockets.on('android-test', function(socket) {
    console.log('receiver from android')
})

io.sockets.on('user', function(data) {
    console.log('reveceiver from ' + data.message)
})

// Send current time every 10 secs
setInterval(sendTime, 10000);

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
    socket.emit('welcome', { message: 'Welcome!' });

    socket.on('i am client', function() {
      console.log('received a message from the client.');
    });

    //document.getElementById("btn").onclick = socket.emit('user-test', {data: 'anjay'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
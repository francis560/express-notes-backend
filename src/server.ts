import app from './index';




const server = app.listen( app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});


const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
      credentials: false
    }
});

io.on('connection', socket => {

    console.log('Estoy aqui');
    socket.on('join', data => {
        console.log('User Connected', data);
    });

});

export default server
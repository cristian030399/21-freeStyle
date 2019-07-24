const io = require('socket.io');
module.exports = function (server) {
    let sockets = io.listen(server);
    let salas = [];
    let infoSalas = [];
    
    
    sockets.on('connection', function (socket) {
        console.log(socket.id);

        socket.on('crearSala', function (data) {
            let nombreS = data.nombreSala;
            let pos = salas.indexOf(nombreS);
            if (pos == (-1)) {
                salas.push(nombreS);
                infoSalas.push({ nombreS: nombreS, jugadores: 1, nombreJugadores: [data.nick] });
                socket.join(nombreS);
                socket.emit('resultadoCrearSala', { result: 1, nombreS: nombreS });
            } else {
                socket.emit('resultadoCrearSala', { result: 0 });
            }
        });

        socket.on('entrarSala', function (data) {
            let nombreS = data.nombreSala;
            let pos = salas.indexOf(nombreS);
            if (pos == (-1)) {
                socket.emit('resultadoEntrarSala', { result: 0 });
            } else {
                if (infoSalas[pos].jugadores < 3) {
                    socket.join(nombreS);
                    jugadores = infoSalas[pos].jugadores;
                    jugadores=jugadores+1;   
                    infoSalas[pos].nombreJugadores.push(data.nick);
                    infoSalas[pos].jugadores=jugadores;
                    socket.emit('resultadoEntrarSala', {result: 1, turno: jugadores, nombreS: nombreS});
                }else{
                    socket.emit('resultadoEntrarSala', { result: 2 });
                }
            }
        });

        socket.on('iniciarJuego', function(data){
            let pos = salas.indexOf(data.nombreS);
            let listaJugadores = infoSalas[pos].nombreJugadores;           
            let listaCartas = nuevasCartas();
            listaCartas = revolverCartas(listaCartas);
            sockets.to(data.nombreS).emit('inicialCartas', {jugador: 1, cartas: [listaCartas[0], listaCartas[1], listaCartas[2]], jugadores: listaJugadores});
            listaCartas.splice(0, 3);
            listaCartas = revolverCartas(listaCartas);
            sockets.to(data.nombreS).emit('inicialCartas', {jugador: 2, cartas: [listaCartas[0], listaCartas[1], listaCartas[2]], jugadores: listaJugadores});
            listaCartas.splice(0, 3);
            listaCartas = revolverCartas(listaCartas);
            sockets.to(data.nombreS).emit('inicialCartas', {jugador: 3, cartas: [listaCartas[0], listaCartas[1], listaCartas[2]], jugadores: listaJugadores});
            listaCartas.splice(0, 3);
            carta=listaCartas[0];
            listaCartas.splice(0, 1);
            sockets.to(data.nombreS).emit('empezar',{jugador: 1, carta: carta, cartas: listaCartas});
            

        });

        socket.on('tirarCarta', function(data){
            if(data.mazo.length==0){
                data.mazo=revolverCartas(data.tiradas);
                data.tiradas=[];
            }
            sockets.to(data.sala).emit('mostrarCartaTirada', {carta: data.caTirada, mazo: data.mazo, tiradas: data.tiradas, cuenta: data.cuenta, jSiguiente: data.jSiguiente});

        });

        socket.on('siguienteTurno', function(data){
            sockets.to(data.sala).emit('activarTurno', {jSiguiente: data.jSiguiente});
        });

        socket.on('perdio', function(data){
            sockets.to(data.sala).emit('mostrarJPerdio', {mensaje: data.mensaje, jSiguiente: data.jSiguiente});
        });

        socket.on('ganador', function(data){
            sockets.to(data.sala).emit('mostrarGanador', {mensaje: "Ha ganado "+data.ganador+"¡¡¡¡¡" });
        });

        socket.on('borrarSala', function(data){
            let pos=salas.indexOf(data.sala);
            salas.splice(pos, 1);
            infoSalas.splice(pos, 1);
        });

    });

}

function nuevasCartas() {
    var cartas = [];
    var carta = { nombre: '2_corazon', valor: (2) };
    cartas.push(carta);
    carta = { nombre: '2_diamante', valor: (2) };
    cartas.push(carta);
    carta = { nombre: '2_PICAS', valor: (2) };
    cartas.push(carta);
    carta = { nombre: '2_TREBOL', valor: (2) };
    cartas.push(carta);
    carta = { nombre: '3_corazon', valor: (3) };
    cartas.push(carta);
    carta = { nombre: '3_diamante', valor: (3) };
    cartas.push(carta);
    carta = { nombre: '3_PICAS', valor: (3) };
    cartas.push(carta);
    carta = { nombre: '3_TREBOL', valor: (3) };
    cartas.push(carta);
    carta = { nombre: '4_corazon', valor: (4) };
    cartas.push(carta);
    carta = { nombre: '4_diamante', valor: (4) };
    cartas.push(carta);
    carta = { nombre: '4_PICAS', valor: (4) };
    cartas.push(carta);
    carta = { nombre: '4_TREBOL', valor: (4) };
    cartas.push(carta);
    carta = { nombre: '5_corazon', valor: (5) };
    cartas.push(carta);
    carta = { nombre: '5_diamante', valor: (5) };
    cartas.push(carta);
    carta = { nombre: '5_PICAS', valor: (5) };
    cartas.push(carta);
    carta = { nombre: '5_TREBOL', valor: (5) };
    cartas.push(carta);
    carta = { nombre: '6_corazon', valor: (6) };
    cartas.push(carta);
    carta = { nombre: '6_diamante', valor: (6) };
    cartas.push(carta);
    carta = { nombre: '6_PICAS', valor: (6) };
    cartas.push(carta);
    carta = { nombre: '6_TREBOL', valor: (6) };
    cartas.push(carta);
    carta = { nombre: '7_corazon', valor: (7) };
    cartas.push(carta);
    carta = { nombre: '7_diamante', valor: (7) };
    cartas.push(carta);
    carta = { nombre: '7_PICAS', valor: (7) };
    cartas.push(carta);
    carta = { nombre: '7_TREBOL', valor: (7) };
    cartas.push(carta);
    carta = { nombre: '8_corazon', valor: (0) };
    cartas.push(carta);
    carta = { nombre: '8_diamante', valor: (0) };
    cartas.push(carta);
    carta = { nombre: '8_PICAS', valor: (0) };
    cartas.push(carta);
    carta = { nombre: '8_TREBOL', valor: (0) };
    cartas.push(carta);
    carta = { nombre: '9_corazon', valor: (9) };
    cartas.push(carta);
    carta = { nombre: '9_diamante', valor: (9) };
    cartas.push(carta);
    carta = { nombre: '9_PICAS', valor: (9) };
    cartas.push(carta);
    carta = { nombre: '9_TREBOL', valor: (9) };
    cartas.push(carta);
    carta = { nombre: '10_corazon', valor: (10) };
    cartas.push(carta);
    carta = { nombre: '10_diamante', valor: (10) };
    cartas.push(carta);
    carta = { nombre: '10_PICAS', valor: (10) };
    cartas.push(carta);
    carta = { nombre: '10_TREBOL', valor: (10) };
    cartas.push(carta);
    carta = { nombre: 'As_corazon', valor: (1) };
    cartas.push(carta);
    carta = { nombre: 'As_diamante', valor: (1) };
    cartas.push(carta);
    carta = { nombre: 'As_PICAS', valor: (1) };
    cartas.push(carta);
    carta = { nombre: 'As_TREBOL', valor: (1) };
    cartas.push(carta);
    carta = { nombre: 'J_corazon', valor: (-11) };
    cartas.push(carta);
    carta = { nombre: 'J_diamante', valor: (-11) };
    cartas.push(carta);
    carta = { nombre: 'J_PICAS', valor: (-11) };
    cartas.push(carta);
    carta = { nombre: 'J_TREBOL', valor: (-11) };
    cartas.push(carta);
    carta = { nombre: 'K_corazon', valor: (-11) };
    cartas.push(carta);
    carta = { nombre: 'K_diamante', valor: (-11) };
    cartas.push(carta);
    carta = { nombre: 'K_PICAS', valor: (-11) };
    cartas.push(carta);
    carta = { nombre: 'K_TREBOL', valor: (-11) };
    cartas.push(carta);
    carta = { nombre: 'Q_corazon', valor: (-11) };
    cartas.push(carta);
    carta = { nombre: 'Q_diamante', valor: (-11) };
    cartas.push(carta);
    carta = { nombre: 'Q_PICAS', valor: (-11) };
    cartas.push(carta);
    carta = { nombre: 'Q_TREBOL', valor: (-11) };
    cartas.push(carta);
    return cartas;

}

function revolverCartas(cartas) {
    listaCartas=cartas;
    var i,
        j,
        temp;
    for (i = listaCartas.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = listaCartas[i];
        listaCartas[i] = listaCartas[j];
        listaCartas[j] = temp;
    }
    return listaCartas;
}
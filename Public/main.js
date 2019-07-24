
$(function () {
    let socket = io();
    let sala;
    let turno;
    let nick;
    let jugando = 1;
    let jSiguiente, jAnterior;
    let mazo;
    let tiradas = [];
    let ca1, ca2, ca3;
    let cuenta = 0;
    let jugadoresVivos;
    let listaJugadores=[];


    document.getElementById("crear").disabled = true;
    document.getElementById("unir").disabled = true;
    document.getElementById("nombreSala").disabled = true;
    document.getElementById("C1").disabled = true;
    document.getElementById("C2").disabled = true;
    document.getElementById("C3").disabled = true;

    $('#enviarNombre').click(function () {
        nick = $('#nick').val();
        $('#nombreJ1').append(nick);
        document.getElementById("nick").disabled = true;
        document.getElementById("enviarNombre").disabled = true;
        document.getElementById("crear").disabled = false;
        document.getElementById("unir").disabled = false;
        document.getElementById("nombreSala").disabled = false;
    });
    $('#crear').click(function () {
        let sl = $('#nombreSala').val();
        socket.emit('crearSala', { nombreSala: sl, nick: nick });
    });

    socket.on('resultadoCrearSala', function (data) {
        if (data.result == 1) {
            alert('Se ha creado la sala con el nombre: ' + data.nombreS);
            sala = data.nombreS;
            turno = 1;
            document.getElementById("crear").disabled = true;
            document.getElementById("unir").disabled = true;
            document.getElementById("nombreSala").disabled = true;
        } else {
            alert('Ya existe una sala con este nombre.');
        }
    });

    $('#unir').click(function () {
        let sl = $('#nombreSala').val();
        socket.emit('entrarSala', { nombreSala: sl, nick: nick });
    });

    socket.on('resultadoEntrarSala', function (data) {
        if (data.result == 1) {
            alert('Ha entrado a la sala: ' + data.nombreS);
            sala = data.nombreS;
            turno = data.turno;
            document.getElementById("crear").disabled = true;
            document.getElementById("unir").disabled = true;
            document.getElementById("nombreSala").disabled = true;
            if (turno == 3) {
                socket.emit('iniciarJuego', { nombreS: sala });
            }
        } else {
            if (data.result == 0) {
                alert('Sala no encontrada');
            } else {
                alert('Sala llena');
            }
        }
    });

    socket.on('inicialCartas', function (data) {
        let i = data.jugador;
        jugadoresVivos=3;
        if (turno == i) {
            document.getElementById("carta1").src = "img/" + data.cartas[0].nombre + '.png';
            ca1 = data.cartas[0];
            document.getElementById("carta2").src = "img/" + data.cartas[1].nombre + '.png';
            ca2 = data.cartas[1];
            document.getElementById("carta3").src = "img/" + data.cartas[2].nombre + '.png';
            ca3 = data.cartas[2];
            listaJugadores=data.jugadores;
            if (turno == 1) {
                jSiguiente = 2;
                jAnterior = 3;
                $('#nombreJ2').append(data.jugadores[1]);
                $('#nombreJ3').append(data.jugadores[2]);
            } else {
                if (turno == 2) {
                    jSiguiente = 3;
                    jAnterior = 1;
                    $('#nombreJ2').append(data.jugadores[2]);
                    $('#nombreJ3').append(data.jugadores[0]);
                } else {
                    jSiguiente = 1;
                    jAnterior = 2;
                    $('#nombreJ2').append(data.jugadores[0]);
                    $('#nombreJ3').append(data.jugadores[1]);
                }
            }
            document.getElementById("cuenta").innerHTML = 0;
        }
    });

    socket.on('empezar', function (data) {
        if (data.carta.valor > 0) {
            cuenta = cuenta + data.carta.valor;
            document.getElementById("cuenta").innerHTML = data.carta.valor;
        }
        mazo = data.cartas;
        tiradas.push(data.carta);
        document.getElementById("tirada").src = "img/" + data.carta.nombre + '.png';
        if (turno == data.jugador) {
            document.getElementById("C1").disabled = false;
            document.getElementById("C2").disabled = false;
            document.getElementById("C3").disabled = false;
        }
    });

    $('#C1').click(function () {
        cuenta = cuenta + ca1.valor;
        if ((cuenta < 0) || (cuenta > 21)) {
            document.getElementById("C1").disabled = true;
            document.getElementById("C2").disabled = true;
            document.getElementById("C3").disabled = true;
            jugando = 0;
            socket.emit('perdio', { sala: sala, mensaje: "Jugador " + nick + " acaba de perder.", jSiguiente: jSiguiente});

        } else {
            let caTirada = { nombre: ca1.nombre, valor: ca1.valor };
            tiradas.push(caTirada);
            ca1 = mazo[0];
            mazo.splice(0, 1);
            document.getElementById("carta1").src = "img/" + ca1.nombre + '.png';
            document.getElementById("C1").disabled = true;
            document.getElementById("C2").disabled = true;
            document.getElementById("C3").disabled = true;
            socket.emit('tirarCarta', { caTirada: caTirada, tiradas: tiradas, mazo: mazo, jSiguiente: jSiguiente, sala: sala, cuenta: cuenta });
        }
    });

    $('#C2').click(function () {
        cuenta = cuenta + ca2.valor;
        if ((cuenta < 0) || (cuenta > 21)) {
            document.getElementById("C1").disabled = true;
            document.getElementById("C2").disabled = true;
            document.getElementById("C3").disabled = true;
            jugando = 0;
            socket.emit('perdio', { sala: sala, mensaje: "Jugador " + nick + " acaba de perder.", jSiguiente: jSiguiente});
        } else {
            let caTirada = { nombre: ca2.nombre, valor: ca2.valor };
            tiradas.push(caTirada);
            ca2 = mazo[0];
            mazo.splice(0, 1);
            document.getElementById("carta2").src = "img/" + ca2.nombre + '.png';
            document.getElementById("C1").disabled = true;
            document.getElementById("C2").disabled = true;
            document.getElementById("C3").disabled = true;
            socket.emit('tirarCarta', { caTirada: caTirada, tiradas: tiradas, mazo: mazo, jSiguiente: jSiguiente, sala: sala, cuenta: cuenta });
        }
    });

    $('#C3').click(function () {
        cuenta = cuenta + ca3.valor;
        if ((cuenta < 0) || (cuenta > 21)) {
            document.getElementById("C1").disabled = true;
            document.getElementById("C2").disabled = true;
            document.getElementById("C3").disabled = true;
            jugando = 0;
            socket.emit('perdio', { sala: sala, mensaje: "Jugador " + nick + " acaba de perder.", jSiguiente: jSiguiente});

        } else {
            let caTirada = { nombre: ca3.nombre, valor: ca3.valor };
            tiradas.push(caTirada);
            ca3 = mazo[0];
            mazo.splice(0, 1);
            document.getElementById("carta3").src = "img/" + ca3.nombre + '.png';
            document.getElementById("C1").disabled = true;
            document.getElementById("C2").disabled = true;
            document.getElementById("C3").disabled = true;
            socket.emit('tirarCarta', { caTirada: caTirada, tiradas: tiradas, mazo: mazo, jSiguiente: jSiguiente, sala: sala, cuenta: cuenta });
        }
    });

    socket.on('mostrarCartaTirada', function (data) {
        document.getElementById("tirada").src = "img/" + data.carta.nombre + '.png';
        document.getElementById("cuenta").innerHTML = data.cuenta;
        cuenta = data.cuenta;
        mazo = data.mazo;
        tiradas = data.tiradas;
        socket.emit('siguienteTurno', { jSiguiente: data.jSiguiente, sala: sala });

    });

    socket.on('activarTurno', function(data){
        if(data.jSiguiente==turno){
            console.log(jugando+nick);
            if(jugando==0){
                socket.emit('siguienteTurno', { jSiguiente: jSiguiente, sala: sala });
            }else{
                document.getElementById("C1").disabled = false;
                document.getElementById("C2").disabled = false;
                document.getElementById("C3").disabled = false;
            }
        }
    });

    socket.on('mostrarJPerdio', function (data){
        alert(data.mensaje);
        jugadoresVivos=jugadoresVivos-1;
        if(jugadoresVivos==1){
            if(jugando==1){
                socket.emit('ganador', {sala: sala, ganador: nick});
            }            
        }else{
            socket.emit('siguienteTurno', { jSiguiente: data.jSiguiente, sala: sala });
        }
    });
    socket.on('mostrarGanador', function(data){
        alert(data.mensaje);
        //socket.emit('borrarSala', {sala: sala});
    });
});







    









/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/
// Tiempo
let cont_tiempo = document.getElementById("cont_tiempo"); // span cuenta tiempo
let segundos = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

// Array de palos:
let palos = ["ova", "cua", "hex", "cir"];
// Array de número de cartas:
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [ 11, 12];

// Paso (top y left) en pixeles de una carta a la siguiente en un mazo:
let paso = 15;

//////////////////////////////Tapetes////////////////////////////
let tapete_inicial = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

//les indicamos que pueden ser superficies potencialmente de recibir algo y que pueden recibir algo

tapete_sobrantes.addEventListener("dragover", dragOver);
tapete_sobrantes.addEventListener("drop", drop);

tapete_receptor1.addEventListener("dragover", dragOver);
tapete_receptor1.addEventListener("drop", drop);

tapete_receptor2.addEventListener("dragover", dragOver);
tapete_receptor2.addEventListener("drop", drop);

tapete_receptor3.addEventListener("dragover", dragOver);
tapete_receptor3.addEventListener("drop", drop);

tapete_receptor4.addEventListener("dragover", dragOver);
tapete_receptor4.addEventListener("drop", drop);
///////////////////////////////////////////////////////////////////////////////////////////////

// Mazos
let mazo_inicial = [];
let mazo_sobrantes = [];
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];

///////////////////////////// Contadores de cartas ////////////////////////////
let cont_inicial = document.getElementById("contador_inicial");
let cont_sobrantes = document.getElementById("contador_sobrantes");
let cont_receptor1 = document.getElementById("contador_receptor1");
let cont_receptor2 = document.getElementById("contador_receptor2");
let cont_receptor3 = document.getElementById("contador_receptor3");
let cont_receptor4 = document.getElementById("contador_receptor4");
let cont_movimientos = document.getElementById("contador_movimientos");
////////////////////////////////////////////////////////////////////////////////////







/////////////////////// FUNCIONES DRAG AND DROP////////////////////////////
function dragStart(event) {
	event.dataTransfer.setData("Text", event.target.id);
	console.log(this.id);

}


function drop(event) {
	event.preventDefault();
	let data = event.dataTransfer.getData("Text");//id de la carta
	let contenedor = event.target; //destino
	let carta = document.getElementById(data);//carta
	let prodencia = carta.parentNode;


	if (contenedor.id == "sobrantes") {
		ponerEnSobrantes(carta, contenedor, prodencia, event);

	} else if (contenedor.parentNode.id == "sobrantes" && contenedor.className == "carta") {

		centrarCarta(carta);
		if (exists(carta)) {
		} else {
			contenedor.parentNode.appendChild(carta);
			prodencia.lastChild.addEventListener("dragstart", dragStart);
			mazo_sobrantes.push(carta);
			mazo_inicial.pop();
			cont_movimientos.innerText++;
		}

	}
	else if (contenedor.className == "tapete receptor") {
		if (ponerEnReceptor(carta, contenedor, prodencia)) {
			removeDragStart(carta);
			let idCont = contenedor.id;
			if (idCont == "receptor1") {
				mazo_receptor1.push(carta);
			} else if (idCont == "receptor2") {
				mazo_receptor2.push(carta);
			} else if (idCont == "receptor3") {
				mazo_receptor3.push(carta);
			} else if (idCont == "receptor4") {
				mazo_receptor4.push(carta);
			}
			if (prodencia.id == "sobrantes") {
				mazo_sobrantes.pop()
			} else {
				mazo_inicial.pop();
			}
		}

	} else if ((contenedor.className == "carta" || contenedor.className == "contador") && contenedor.parentNode.className == "tapete receptor") {
		if (ponerEnParent(carta, contenedor, prodencia, event)) {
			removeDragStart(carta);
			let idCont = contenedor.parentNode.id;
			if (idCont == "receptor1") {
				mazo_receptor1.push(carta);
			} else if (idCont == "receptor2") {
				mazo_receptor2.push(carta);
			} else if (idCont == "receptor3") {
				mazo_receptor3.push(carta);
			} else if (idCont == "receptor4") {
				mazo_receptor4.push(carta);
			}
			if (prodencia.id == "sobrantes") {
				mazo_sobrantes.pop()
			} else {
				mazo_inicial.pop();
			}
		}

	}

	repartirOtraVez();
	actualizarContadores();
}

function dragOver(event) {
	event.preventDefault();
}








////////////////////////////////////////////////////////////////////////////

function actualizarContadores() {
	cont_inicial.innerText = mazo_inicial.length;
	cont_sobrantes.innerText = mazo_sobrantes.length;

	cont_receptor1.innerText = mazo_receptor1.length;
	cont_receptor2.innerText = mazo_receptor2.length;
	cont_receptor3.innerText = mazo_receptor3.length;
	cont_receptor4.innerText = mazo_receptor4.length;

	if (mazo_inicial.length==0 && mazo_sobrantes.length==0){
		alert("enorabuena, te ha costado: "+cont_movimientos.innerText+" movimientos");
		clearInterval(temporizador);
	}


}

function centrarCarta(carta) {
	carta.removeAttribute("style");
	carta.style.cssText = "left:20px; top:20px;";
}


mazo_inicial.forEach(function (element) {
	alert(element);

});


function removeDragStart(carta) {
	carta.removeEventListener("dragstart", dragStart);
	carta.draggable = false;
}

function ponerEnSobrantes(carta, contenedor, prodencia, event) {
	if (exists(carta)) {
	} else {

		contenedor.appendChild(carta);
		prodencia.lastChild.addEventListener("dragstart", dragStart);
		centrarCarta(carta);
		mazo_sobrantes.push(carta);
		mazo_inicial.pop();
		cont_movimientos.innerText++;
	}
}

function ponerEnReceptor(carta, contenedor, prodencia) {
	color = carta.getAttribute("data-color");
	num = carta.getAttribute("data-num");
	ultColor = contenedor.lastChild.getAttribute("data-color");
	ultNum = contenedor.lastChild.getAttribute("data-num");

	if (carta.getAttribute("data-num") == "12" || (ultNum - 1 == num && color != ultColor)) {
		contenedor.appendChild(carta);
		prodencia.lastChild.addEventListener("dragstart", dragStart);
		console.log("quitar drag");
		centrarCarta(carta);
		cont_movimientos.innerText++;
		return true;
	} else {
		cont_movimientos.innerText++;
		return false;
	}

}

function ponerEnParent(carta, contenedor, prodencia, event) {
	color = carta.getAttribute("data-color");
	num = carta.getAttribute("data-num");
	ultColor = contenedor.parentNode.lastChild.getAttribute("data-color");
	ultNum = contenedor.parentNode.lastChild.getAttribute("data-num");

	if (carta.getAttribute("data-num") == "12" || (ultNum - 1 == num && color != ultColor)) {
		contenedor.parentNode.appendChild(carta);
		prodencia.lastChild.addEventListener("dragstart", dragStart);
		centrarCarta(carta);
		cont_movimientos.innerText++;
		return true;
	} else {
		cont_movimientos.innerText++;
		return false;
	}


}

function exists(carta) {
	if (mazo_sobrantes.indexOf(carta) != -1) {
		return true;
	}
	else {
		return false;
	}
}


////////////////////////////////////////////// RELLENAR////////////////////////////
numeros.forEach(numero => {
	palos.forEach(palo => {
		let color;
		if (palo == "hex" || palo == "cir") {
			color = "gris";
		} else {
			color = "naranja";
		}
		let imagen = document.createElement("img");
		imagen.setAttribute("src", "imagenes/baraja/" + numero + "-" + palo + ".png");
		imagen.setAttribute("id", numero + "" + palo);
		imagen.setAttribute("data-color", color);
		imagen.setAttribute("data-num", numero);
		imagen.className = "carta";
		//document.getElementById("inicial").appendChild(imagen);
		mazo_inicial.push(imagen);//Agregamos cada carta al mazo inicial//
		actualizarContadores();
	});
});

desordenarArray(mazo_inicial); // desordnamos el array

mazo_inicial.forEach((carta, index, array) => {// los agregamos al tapete inicial y hacemos arrasttrable la última carta.
	document.getElementById("inicial").appendChild(carta);
	carta.style.marginLeft = paso + "px";
	paso += 10;
	if (array.length - 1 == index) {
		carta.draggable = true;
		carta.addEventListener("dragstart", dragStart); // Asignar la función dragStart al evento dragstart
	}
});


function repartirOtraVez() {
	let cartasRestantes = tapete_sobrantes.children.length;

	console.log("hijos de restantes " + cartasRestantes);
	let zero = tapete_inicial.getElementsByTagName("img").length;
	console.log("en tapete incial " + zero);

	console.log("mazo incial " + mazo_inicial.length);
	console.log("mazo sobrantes " + mazo_sobrantes.length);
	if (zero == 0) {
		mazo_sobrantes.forEach(carta => {

			tapete_inicial.appendChild(carta);
			mazo_inicial.push(carta);
		});
		mazo_sobrantes = [];
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////






arrancar_tiempo();



// Rutina asociada a boton reset: comenzar_juego
document.getElementById("reset").onclick = comenzar_juego;

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

// Desarrollo del comienzo del juego
function comenzar_juego() {
	/* Crear baraja, es decir crear el mazo_inicial. Este será un array cuyos
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles "for", bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero "png" que contiene a la carta (recuérdese poner
	el "path" correcto en la URL asociada al atributo "src" de <img>). Una vez creado
	el elemento <img>, inclúyase como elemento del array "mazo_inicial".
	*/

	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/


	// Barajar
	barajar(mazo_inicial);

	// Dejar mazo_inicial en tapete inicial
	cargar_tapete_inicial(mazo_inicial);

	// Puesta a cero de contadores de mazos
	set_contador(cont_sobrantes, 0);
	set_contador(cont_receptor1, 0);
	set_contador(cont_receptor2, 0);
	set_contador(cont_receptor3, 0);
	set_contador(cont_receptor4, 0);
	set_contador(cont_movimientos, 0);

	// Arrancar el conteo de tiempo


} // comenzar_juego


/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a "clearInterval" en su caso.
*/

function arrancar_tiempo() {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
	if (temporizador) clearInterval(temporizador);
	let hms = function () {
		let seg = Math.trunc(segundos % 60);
		let min = Math.trunc((segundos % 3600) / 60);
		let hor = Math.trunc((segundos % 86400) / 3600);
		let tiempo = ((hor < 10) ? "0" + hor : "" + hor) //si hora <10 sera 0 + hora por otro lado si es falso sera hora simplemente
			+ ":" + ((min < 10) ? "0" + min : "" + min)
			+ ":" + ((seg < 10) ? "0" + seg : "" + seg);
		set_contador(contador_tiempo, tiempo);
		segundos++;
	}
	segundos = 0;
	hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000);

} // arrancar_tiempo
cont_tiempo.innerText=


/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
	Para reordenar el array puede emplearse el siguiente pseudo código:

	- Recorramos con i todos los elementos del array
		- Sea j un indice cuyo valor sea un número aleatorio comprendido
			entre 0 y la longitud del array menos uno. Este valor aleatorio
			puede conseguirse, por ejemplo con la instrucción JavaScript
				Math.floor( Math.random() * LONGITUD_DEL_ARRAY );
		- Se intercambia el contenido de la posición i-ésima con el de la j-ésima

*/
function barajar(mazo) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
} // barajar



/**
	  En el elemento HTML que representa el tapete inicial (variable tapete_inicial)
	se deben añadir como hijos todos los elementos <img> del array "mazo".
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas "top" y "left", algun atributo de tipo "data-", etc.
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargar_tapete_inicial(mazo) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
} // cargar_tapete_inicial


/**
	  Esta función debe incrementar el número correspondiente al contenido textual
		  del elemento que actúa de contador
*/
function inc_contador(contador) {
	contador.innerHTML = +contador.innerHTML + 1;
} // inc_contador

/**
	Idem que anterior, pero decrementando
*/
function dec_contador(contador) {
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! ***/
} // dec_contador

/**
	Similar a las anteriores, pero ajustando la cuenta al valor especificado
*/
function set_contador(contador, valor) {

	contador.innerText=valor;
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/
} // set_contador


// Desarrollo de la continuación del juego
// Funciones drag & drop
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/











/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/





//////////////////////////////////////////// FUNCIONES /////////////////////////////

function desordenarArray(array) {// PARA BARAJEAR
	return array.sort(() => Math.random() - 0.5);
}


///////// Contar cartas//////////
function contarCartas(contenedor) {
	let hijos = contenedor.children;
	let vacio = true;
	let contador = 0;
	for (var i = 0; i < hijos.length; i++) {
		if (hijos[i].tagNam == "IMG") {//devuelve mayusculas siempre
			contador++;
		}
	}
	return contador;

}
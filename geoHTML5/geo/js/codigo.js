/**
 *  Geolocalización
 */

var map,recorrido;

function Punto() {
	this.lat = 0.0;
	this.lng = 0.0;
	this.setPunto = function(lat,lng) {
		this.lat = lat;
		this.lng = lng;
	}
}

function trazarRecorrido(recorrido) {
	
	this.recorrido = recorrido;
	lato = 0.0;
	lngo = 0.0;
	latd = 0.0;
	lngd = 0.0;

	for (indice in recorrido){
		if (indice==0) {
			lato = recorrido[indice].lat;
			lngo = recorrido[indice].lng;
			map = new GMaps({
				div: '#map',
				lat: lato,
				lng: lngo,
				click: agregarPunto,
	            tap: agregarPunto
			});
			map.addMarker({ 
				lat: lato, 
				lng: lngo,
				title: 'Origen',
				icon: "images/origen.png",
				infoWindow: {
				    content: '<p>¡Este es el inicio de mi ruta!</p>'
				}
			});
		}
		else {
			map.addMarker({ lat: recorrido[indice].lat, lng: recorrido[indice].lng, icon: "images/trayecto.png"});	
			unirPuntos(recorrido[indice-1],recorrido[indice],map);
		}
	}
}

function agregarPunto(e) {
	pto = new Punto();
	
	pto.setPunto(e.latLng.lat(),e.latLng.lng());
	recorrido.push(pto);
	map.addMarker({ lat: recorrido[recorrido.length-1].lat, lng: recorrido[recorrido.length-1].lng, icon: "images/trayecto.png"});	
	unirPuntos(recorrido[recorrido.length-2],recorrido[recorrido.length-1],map);
}

function unirPuntos(origen,destino,map) {
	map.drawRoute({
		origin: [origen.lat,origen.lng],
		destination: [destino.lat,destino.lng],
		travelMode: 'driving',
        strokeColor: 'red',
        strokeOpacity: 0.6,
        strokeWeight: 6
	});
}

function geoLocalizar() {
	GMaps.geolocate({
		success: function(position){
			lat = position.coords.latitude;
			lng = position.coords.longitude;
			map = new GMaps({
				div: '#map',
				lat: lat,
				lng: lng,
				click: agregarPunto,
	            tap: agregarPunto
			});
			ptoInicial = new Punto();
			ptoInicial.setPunto(lat,lng);
			recorrido = [];
			recorrido.push(ptoInicial);
			map.addMarker({ 
				lat: lat, 
				lng: lng,
				title: 'Origen',
				icon: "images/origen.png",
				infoWindow: {
				    content: '<p>¡Este es el inicio de mi ruta!</p>'
				}
			});
		},
		error: function(error) {alert('Error: '+error.message);},
		not_supported: function(){alert('No soporta geolocalización');},
	});	
	
}

function empaquetar() {
	if (recorrido.length>2) {
		ptoInicial = recorrido[0];
		ptoFinal = recorrido[recorrido.length-1];
		recorrido = [];
		recorrido.push(ptoInicial);
		recorrido.push(ptoFinal);
		trazarRecorrido(recorrido);
	}
}

function grabar() {
	localStorage.recorrido=JSON.stringify(recorrido);
}

/* ------------- MAIN ------------- */
$(function() {
	
	if (localStorage.recorrido===undefined){
		geoLocalizar();
	}
	else {
		recorrido = JSON.parse(localStorage.recorrido);
		trazarRecorrido(recorrido);
	}
	
	$('#inicializar').on('click', geoLocalizar);
	$('#empaquetar').on('click', empaquetar);
	
	window.onbeforeunload = grabar;
	
});


'use strict';

function getGeolocation(){
    if ( navigator.geolocation ) {

	    navigator.geolocation.getCurrentPosition(function(position) {
	                var latitude = position.coords.latitude;
	                var longitude = position.coords.longitude;
	                document.getElementById("geolocation").innerHTML = latitude+' '+longitude;
	    });
     
    } else {
        document.getElementById("geolocation").innerHTML = "Geolocation API не поддерживается в вашем браузере";
    }
}
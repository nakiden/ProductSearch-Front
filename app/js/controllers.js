'use strict';

/* Controllers */

var App = angular.module('ProductSearch', ['geolocation']);

App.controller('productListController', function($scope, $http, geolocation) {

    $scope.getUrl = "http://nakiden-001-site1.atempurl.com/Barcode/Get?barcode=";

    $scope.isResponseNull = true;
    $scope.expression = "WebCam";

    $scope.setView = function () {
        $scope.expression = "WebCam";
        $scope.useGeo = false;
        window.location.href = 'index.html';
    };

    $scope.useGeolocation = function () {

        if ($scope.useGeo) {
            $scope.useGeo = false;
        } else {
            turnOnGeo();
            $scope.useGeo = true;
        }
    };

    function turnOnGeo(){

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;
                document.getElementById("latitude").innerHTML = $scope.latitude;
                document.getElementById("longitude").innerHTML = $scope.longitude;
                var coords = new google.maps.LatLng($scope.latitude, $scope.longitude);
                var mapOptions = {
                        zoom: 15,
                        center: coords,
                        mapTypeControl: true,
                        navigationControlOptions: {
                            style: google.maps.NavigationControlStyle.SMALL
                        },
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(
                        document.getElementById("mapContainer"), mapOptions
                    );
                    var marker = new google.maps.Marker({
                        position: coords,
                        map: map,
                        title: "Your current location!"
                    });
     
            });
        }else {
            document.getElementById("geolocation").innerHTML = "Geolocation API не поддерживается в вашем браузере";
        }
    }


	$scope.scanBarcode = function() {
        var scannerLaser = $(".scanner-laser"),
            imageUrl = $("#image-url"),
            scannedImg = $("#scanned-img"),
            scannedType = $("#scanned-type"),
            scannedResult = $("#scanned-result");

         var arg = {
            resultFunction: function(res) {
                $('#searchButton').css("visibility", "visible");
                scannedImg.attr('src', res.imgData);
                scannedType.text(res.format + ': ' );
                scannedResult.text(res.code);
            }
        };

        $("canvas").WebCodeCamJQuery(arg).data().plugin_WebCodeCamJQuery.play();
	};



    $scope.printResults = function(data) {

        if ( data == null ) {
            $scope.isResponseNull = true;
        } else {
            $scope.isResponseNull = false;
            $scope.products = data;
            $scope.arr = data.Store;
        }
    };

    $scope.editData = function(){
        $scope.isEdit = true;
        $scope.useGeo = true;
        turnOnGeo();
        $scope.isResponseNull = true;
        $scope.expression = "Result";
        $scope.submitData();
    };

    $scope.submitData = function() {
        var url = 'http://nakiden-001-site1.atempurl.com/';
        var method = "POST";
        var id = null;
        var barcode = $('#barcode').val();
        var productName = $('#productName').val();
        var publisher = $('#publisher').val();
        var description = $('#description').val();

        if ($scope.useGeo) {
            var price = $('#price').val();
            var place = $('#placeName').val();
            var latitude = document.getElementById("latitude").innerHTML;
            var longitude = document.getElementById("longitude").innerHTML;
        } else {
            var price = null;
            var place = null;
            var latitude = null;
            var longitude = null;
        }

        if (barcode.length >= 8 && barcode.length <= 14 ) {
             $http({
                url: url,
                Accept: "*/*",
                Origin: "http://myblogblog.esy.es",
                method: method,
                headers: {'Content-Type': 'application/json'},
                data: {   
                    "id": id,
                    "title": productName,
                    "brand": description,
                    "barcode": barcode,
                    "publisher": publisher,
                    "price": price,
                    "Store": [
                    {
                      "name": place,
                      "latitude": latitude,
                      "productPrice": price,
                      "longitude": longitude
                    }
                  ]

                }
                })
                .then(function(response) {
                    
                    $http.get($scope.getUrl + barcode).success(function (data, status, header, config) {
                        $scope.expression = "Result";
                        $scope.printResults(data);
                    });
                },
                function(response) { // optional
                alert("Error : " + response.message);
            });

        } else {
            alert("Wrong barcode");
        }
    };



    $scope.sendData = function() {
        var code = document.getElementById("scanned-result").innerText;
        $scope.barcode = code;
        $alert(code);
        if (code.length > 10) {
            $http.get($scope.getUrl + code).success(function (data, status, header, config) {
                $scope.expression = "Result";
                $scope.printResults(data);
            });
        }
    };

	$scope.sortField = undefined;
	$scope.reverse = false;

	$scope.sort = function(fieldName) {

		if ($scope.sortField == fieldName) {
			$scope.reverse = !$scope.reverse;
		} else {
			$scope.sortField = fieldName;
			$scope.reverse = false;
		}
	};
});

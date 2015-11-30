'use strict';

/* Controllers */

var App = angular.module('ProductSearch', ['geolocation']);

App.controller('DomController', function($scope, $http) {


    function turnOnGeo() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
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
        } else {
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



    $scope.submitData = function() {
        var url = 'http://nakiden-001-site1.atempurl.com/ProductSeacher/Post';
        var method = "POST";
        var id= null;
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
                Origin: "http://myblogblog.esy.es/",
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
                    
                    $http.get('http://nakiden-001-site1.atempurl.com/Barcode/Get?barcode=' + barcode).success(function (data, status, header, config) {
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
});

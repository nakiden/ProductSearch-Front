'use strict';

/* Controllers */

var App = angular.module('ProductSearch', ['geolocation']);

App.controller('productListController', function($scope, $http) {


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


    $scope.printResults = function(data) {

        if ( data == null ) {
            $scope.isResponseNull = true;
        } else {
            $scope.isResponseNull = false;
            $scope.products = data;
            $scope.arr = data.Store;
        }

    };

    $scope.editData = function() {
        $scope.isEdit = true;
        $scope.useGeo = true;
        turnOnGeo();
        $scope.isResponseNull = true;
        $scope.expression = "Result";
        $scope.submitData();
    };



    $scope.sendData = function() {
        var code = document.getElementById("scanned-result").innerText;
        $scope.barcode = code;

        if (code.length > 10) {
            $http.get('http://nakiden-001-site1.atempurl.com/Barcode/Get?barcode=' + code).success(function (data, status, header, config) {
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

////////////////////geolocation contoller
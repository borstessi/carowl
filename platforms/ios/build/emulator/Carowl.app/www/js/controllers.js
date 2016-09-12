angular.module('starter.controllers', [])

.controller("startCtrl",function($scope, $interval, $state, $timeout){

	$timeout(function(){ $state.go('config'); },3000);
	
	$scope.goNext = function() {
		$state.go('config');
	}

})

.controller("configCtrl",function($scope, $interval, $state, $timeout, $ionicSlideBoxDelegate){
	
	$scope.disableSwipe = function() {
		$ionicSlideBoxDelegate.enableSlide(false);
	};
	
	$scope.goToCnfg2 = function() {
		$ionicSlideBoxDelegate.next();
	};
	
	$scope.backToCnfg = function (){
		$ionicSlideBoxDelegate.previous();
	};	
	
	$scope.chosenRed = function () {
		$ionicSlideBoxDelegate.next();	
		//////////////////////////////////////// enter database red is chosen ////////////////////////////////////////
	};
	
	$scope.chosenGreen = function () {
		$ionicSlideBoxDelegate.next();	
		//////////////////////////////////////// enter database green is chosen ////////////////////////////////////////
	};
	
	$scope.chosenDevice = function () {
		$ionicSlideBoxDelegate.next();	
	};
	
	$scope.rebeginCnfg = function () {
		$ionicSlideBoxDelegate.slide(0);	
	};	
	
	$scope.devices = [{name:"iPhone 6S"}, {name:"Galaxy S7"}, {name:"LG G5"}, {name:"HTC M9"}, {name:"Nexus 6P"}];
	
})

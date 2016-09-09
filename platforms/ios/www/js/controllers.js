angular.module('starter.controllers', [])

.controller("startCtrl",function($scope, $interval, $state, $timeout){

	$timeout(function(){ $state.go('config'); },3000);
	
	$scope.goNext = function() {
		$state.go('config');
	}

})

.controller("configCtrl",function($scope, $interval, $state, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate){
	
	$scope.disableSwipe = function() {
		$ionicSlideBoxDelegate.enableSlide(false);
	};
	
	$scope.goToCnfg2 = function() {
		$ionicSlideBoxDelegate.next();
		$ionicScrollDelegate.resize();
		$ionicScrollDelegate.scrollTop();
	};
	
	$scope.check = function() {
	
		$ionicScrollDelegate.resize();
		$ionicScrollDelegate.scrollTop();
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
	
	$scope.chosenOwl = function () {
		$ionicSlideBoxDelegate.next();	
	};
	
	$scope.rebeginCnfg = function () {
		$ionicSlideBoxDelegate.slide(0);	
	};	
	
	$scope.devices = [{name:"iPhone 6S"}, {name:"Galaxy S7"}, {name:"LG G5"}, {name:"HTC M9"}, {name:"Nexus 6P"}];
	$scope.owls = [{color:"green"},{color:"red"},{color:"blue"},{color:"green"}]
	
	$scope.startGame = function () {
		$state.go('game');
	};	
	
})


.controller("gameCtrl",function($scope, $interval, $state, $timeout, $ionicPopup, $ionicScrollDelegate){    

	$scope.goNext = function() {
		$state.go('config');
	};
	
	
	$scope.changeProgress = function(characterCondition) {
		var ransomValue = Math.floor((Math.random() * 101) + 0);
		statusValue = ransomValue;
		$("."+characterCondition+"-status .determinate").css('width',+statusValue);
	};
	
	$timeout(function(){
		$('.attention-bubble').addClass('pulse');
	},200);	
		$timeout(function(){
		$('.attention-bubble').addClass('pulse');
	},1000);	
		
})
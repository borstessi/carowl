angular.module('starter.controllers', [])

.controller("startCtrl",function($scope, $interval, $state, $timeout){

	$timeout(function(){ $state.go('config'); },3000);
	
	$scope.goNext = function() {
		$state.go('config');
	}

})

.controller("configCtrl",function($scope, $interval, $state, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, Owl){
	
	$scope.playerOwl = Owl.all();
	console.log($scope.playerOwl);
	
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
		
	$scope.chosenDevice = function () {
		$ionicSlideBoxDelegate.next();	
	};
	
	$scope.chosenOwl = function (owlColor) {
		$ionicSlideBoxDelegate.next();	
		Owl.setColor(owlColor);
		$scope.playerOwl = Owl.all();
		console.log($scope.playerOwl);
	};
	
	$scope.rebeginCnfg = function () {
		$ionicSlideBoxDelegate.slide(0);	
	};	
	
	$scope.devices = [{name:"iPhone 6S"}, {name:"Galaxy S7"}, {name:"LG G5"}, {name:"HTC M9"}, {name:"Nexus 6P"}];
	$scope.owls = [{color:"green"},{color:"red"},{color:"blue"},{color:"yellow"}]
	
	$scope.startGame = function () {
		$state.go('game');
	};	
	
})


.controller("gameCtrl",function($scope, $interval, $state, $timeout, $ionicPopup, $ionicScrollDelegate, Owl){    

	
	$scope.sleepProgress = 100;
	$scope.sleepCounter = 10;
	var sleepingIndicator = false;

$scope.showLove = function() {
  $scope.data = {};

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl: '../templates/love.html',
    scope: $scope,

    
  });
  $scope.closePopup = function() {
		myPopup.close();
	};
};

$scope.showFeed = function() {
  $scope.data = {};

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl: '../templates/feed.html',
    scope: $scope
    
  });
  $scope.closePopup = function() {
		myPopup.close();
	};
};
$scope.showPlay = function() {
  $scope.data = {};

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl: '../templates/play.html',
    scope: $scope
    
  });
  $scope.closePopup = function() {
		myPopup.close();
	};
};
$scope.showSleep = function() {
  $scope.data = {};

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    templateUrl: '../templates/sleep.html',
    scope: $scope,

    
  });
  $scope.closePopup = function() {
		myPopup.close();
		
	};
};
	

 $scope.nextSlide = function() {
		$ionicSlideBoxDelegate.next();
	};
	$scope.restartSlide = function() {
		$ionicSlideBoxDelegate.slide(0);
	};

	$scope.disableSwipe = function() {
		$ionicSlideBoxDelegate.enableSlide(false);
	};
	$scope.restartSleep = function() {
		$ionicSlideBoxDelegate.slide(0);
		$scope.cancelIntervalls();
	};


	$scope.startSleepGame = function() {
	
		$ionicSlideBoxDelegate.slide(1);


	var sleepProgressFunction = $interval(function(){

		$scope.sleepProgress -= 1;
		if (sleepingIndicator)
			{
				$interval.cancel(sleepProgressFunction);
				$interval.cancel(sleepCounterFunction);
				sleepingIndicator = false;
				$scope.sleepProgress = 100;
				$scope.sleepCounter = 10;
			}
		if ($scope.sleepProgress <= 0 && !sleepingIndicator && $scope.sleepCounter <= 0) 
			{
				
				sleepingIndicator = true;
				$ionicSlideBoxDelegate.next();
	
				}
		},100);

	var sleepCounterFunction = $interval(function(){

			$scope.sleepCounter -= 1;

		},1000);
		
		
	
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	$scope.playerOwl = Owl.all();
	$scope.owlFeeling = 'normal';
	console.log($scope.playerOwl);
	
	$scope.updateOwlFeelings = function(owl) {
		
		$(".love-status .determinate").css('width',+owl.loveStatus);
		$(".feed-status .determinate").css('width',+owl.feedStatus);
		$(".sleep-status .determinate").css('width',+owl.sleepStatus);
		$(".level-status .determinate").css('width',+owl.levelStatus);

	};
	
	$interval(function(){
		$timeout(function(){
			if($scope.playerOwl.sleepStatus >= 20){
				$scope.owlFeeling = 'sleeping';
			}
		},300);
		$timeout(function(){
			if($scope.playerOwl.sleepStatus >= 20){
				$scope.owlFeeling = 'normal';	
			}
		},600);
	},3500);
	
	$timeout(function(){
		$('.attention-bubble').addClass('zoomIn show');
		$scope.updateOwlFeelings($scope.playerOwl);
	},200);	
	
	$timeout(function(){
		$scope.updateOwlFeelings($scope.playerOwl);
	},600);	
	
	$scope.goNext = function() {
		$state.go('config');
	};
	
	$scope.changeProgress = function(characterCondition) {
		var randomValue = Math.floor((Math.random() * 101) + 0);
		statusValue = randomValue;
		$("."+characterCondition+"-status .determinate").css('width',+statusValue);
	};
		
	$timeout(function(){
		$('.attention-bubble').removeClass('pulse zoomIn');
		$('.attention-bubble').addClass('pulse');
	},1800);	
	
	$scope.tess=1;
	$scope.hideBubble = function() {
		if($scope.tess % 2 == 0 ) {
			$('.attention-bubble').removeClass('zoomOut');	
			$('.attention-bubble').addClass('zoomIn show');
		}
		else {
			$('.attention-bubble').addClass('zoomOut');
			$('.attention-bubble').removeClass('zoomIn show');	
		}
		
		$scope.tess++;
	};	
	
	$scope.test = function() {		
		$('.attention-bubble').removeClass('pulse zoomIn');
	
		$('.attention-bubble i').removeClass();
		
		var randomIconClass = Math.floor((Math.random() * 4) + 0);
		
		switch(randomIconClass) {
			case 0:
				$('.attention-bubble i').addClass('level ion-ios-game-controller-b larger-icon-pad lime-text text-lighten-1');				
				break;
			case 1:
				$('.attention-bubble i').addClass('love fa fa-heart red-text text-lighten-1');		
				break;
			case 2:
				$('.attention-bubble i').addClass('feed fa fa-cutlery grey-text');		
				break;
			case 3:
				$('.attention-bubble i').addClass('sleep ion-ios-moon larger-icon indigo-text text-lighten-1');
				break;
			default: 
				break;
		}
		
		$timeout(function(){
			$('.attention-bubble').addClass('pulse');
			$timeout(function(){
				$('.attention-bubble').removeClass('pulse');
				$timeout(function(){
					$('.attention-bubble').addClass('pulse');
				},100);	
			},600);	
		},100);		
	};

 	$scope.updateLoveStatus = function(){
	 	$scope.loveStatusDownValue = 5;
	 	Owl.lowerLoveStatus($scope.loveStatusDownValue);
 		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
	 	console.log($scope.playerOwl);
 	};
 	
 	$scope.updateFeedStatus = function(){
	 	$scope.feedStatusDownValue = 5;
	 	Owl.lowerFeedStatus($scope.feedStatusDownValue);
 		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
 	};
 	
 	$scope.updateSleepStatus = function(){
	 	$scope.sleepStatusDownValue = 5;
	 	Owl.lowerSleepStatus($scope.sleepStatusDownValue);
 		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
 	};
 	
 	$scope.updateLevelStatus = function(){
	 	$scope.levelStatusDownValue = 5;
	 	Owl.lowerLevelStatus($scope.levelStatusDownValue);
 		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
 	};
	
	$interval(function(){
		$scope.updateLoveStatus();
	},10000);	
	$interval(function(){
		$scope.updateFeedStatus();
	},15000);
	$interval(function(){
		$scope.updateSleepStatus();
	},20000);
	$interval(function(){
		$scope.updateLevelStatus();
	},25000);
	
	$scope.feelingCounter = 0;
	
	$interval(function(){
		if($scope.playerOwl.sleepStatus <= 20){
			$timeout(function(){
				$scope.owlFeeling = 'sleeping';
			},300);
			$timeout(function(){
				$scope.owlFeeling = 'sleepy';	
			},600);
			$scope.sleepCounter = 1;
		}
		if( $scope.playerOwl.loveStatus < 20 || $scope.playerOwl.feedStatus < 20 || $scope.playerOwl.sleepStatus < 20 || $scope.playerOwl.levelStatus < 20 ) {
			console.log('SAD OWL');			
		}
	},3500);
})
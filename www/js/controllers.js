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
	
	$scope.chosenOwl = function () {
		$ionicSlideBoxDelegate.next();	
	};
	
	$scope.rebeginCnfg = function () {
		$ionicSlideBoxDelegate.slide(0);	
	};	
	
	$scope.devices = [{name:"iPhone 6S"}, {name:"Galaxy S7"}, {name:"LG G5"}, {name:"HTC M9"}, {name:"Nexus 6P"}];
	$scope.owls = [{color:"green"},{color:"blue"},{color:"green"},{color:"blue"}]
	
	$scope.startGame = function () {
		$state.go('game');
	};	
	
})


.controller("gameCtrl",function($scope, $ionicSlideBoxDelegate, $interval, $ionicPopup){


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
	











	

  



  function FeedController($interval, $scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
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






  }

  	function SleepController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
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
	
	$scope.startSleepGame = function() {
	$ionicSlideBoxDelegate.slide(1);
	$scope.sleepProgress = 100;
	$scope.sleepCounter = 10;
	sleepingIndicator = false;
	 
		 
	$interval(function(){

		$scope.sleepProgress -= 1;
			if ($scope.sleepProgress <= 100 && !sleepingIndicator && $scope.sleepCounter <= 0) 
			{
				
				sleepingIndicator = true;
				$ionicSlideBoxDelegate.next();
				
					
				}


				 
			

		},100);
	
		$interval(function(){

			$scope.sleepCounter -= 1;

		},1000);
	
	}
		
	




  }

  

  

})
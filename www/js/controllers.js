angular.module('starter.controllers', [])

.controller("startCtrl",function($scope, $interval, $state, $timeout){

	$timeout(function(){ 
		$state.go('config'); 
	},3000);

})

.controller("configCtrl",function($scope, $interval, $http, $state, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, Owl){
	
	$scope.playerOwl = Owl.all();
	$scope.connectionTimeout = 0;
	
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
		$scope.startGame();	
	};
	
	$scope.chosenOwl = function (owlColor) {
		$ionicSlideBoxDelegate.next();	
		Owl.setColor(owlColor);
		$scope.playerOwl = Owl.all();
	};
	
	$scope.rebeginCnfg = function () {
		$ionicSlideBoxDelegate.slide(0);	
	};	
	
	$scope.devices = [{name:"Owly Communicator 21"}];
	$scope.owls = [{color:"green"},{color:"red"},{color:"blue"},{color:"yellow"}]
	
	$scope.startGame = function () {
		var connectionTest = $interval(function(){
			$http.get("https://api.particle.io/v1/devices/3e0040000f47343432313031/Connection?access_token=af96025ac3f595c31d6aaa7be95c4b2e32b50d9f")
			.success(function (response) {
				$scope.connection = response.result;
			});
			$scope.connectionTimeout += 1;
			if ($scope.connection == 1 && $scope.connectionTimeout < 30)
			{
				$state.go('game');
				$interval.cancel(connectionTest);
			}
			else if ($scope.connectionTimeout > 30 && $scope.connection == undefined){
				$interval.cancel(connectionTest);
				$ionicSlideBoxDelegate.slide(2);
				$scope.connectionTimeout = 0;
			}	
		},1000);
	};
	
	$scope.startGameManual = function () {
		$state.go('game');		
	}
	
})

.controller("gameCtrl",function($scope, $interval, $state, $timeout, $ionicPopup, $ionicScrollDelegate, Owl, $ionicSlideBoxDelegate, $ionicHistory, $window, $http, $ImageCacheFactory){    

$ImageCacheFactory.Cache([
        "img/Owl_Skins/skin-green-angry.svg", 
        "img/Owl_Skins/skin-green-back.svg", 
        "img/Owl_Skins/skin-green-dead.svg", 
        "img/Owl_Skins/skin-green-eyesleft.svg", 
        "img/Owl_Skins/skin-green-eyesright.svg", 
        "img/Owl_Skins/skin-green-fuckedUp.svg", 
        "img/Owl_Skins/skin-green-hungry.svg", 
        "img/Owl_Skins/skin-green-normal.svg", 
        "img/Owl_Skins/skin-green-sad.svg", 
        "img/Owl_Skins/skin-green-sleeping.svg", 
        "img/Owl_Skins/skin-green-sleepy.svg" 
    ]);



	$scope.connection;
	$scope.connectionTimeout = 10;
	
	var connectionTest = $interval(function(){
		$http.get("https://api.particle.io/v1/devices/3e0040000f47343432313031/Connection?access_token=af96025ac3f595c31d6aaa7be95c4b2e32b50d9f")
		.success(function (response) {
			$scope.connection = response.result;
		});
		
		if ($scope.connection == undefined)
		{
			$scope.connectionTimeout -= 1;
		}
		else if ($scope.connection == 1)
		{
			$scope.connectionTimeout = 10;
		}
		else if ($scope.connectionTimeout < 0 && $scope.connection == undefined){
			
			$interval.cancel(connectionTest);
			$scope.connectionTimeout = 10;
			$state.go('connectionlost');
		}	
	},1000);
	
	$scope.sleepProgress = 100;
	$scope.sleepCounter = 10;
	var sleepingIndicator = false;
	$scope.light = null;
	$scope.scanR = null;
	$scope.scanG = null;
	$scope.scanB = null;
	$scope.colorScanTimer = 15;
	$scope.rgbScannedCorrect = false;
	$scope.popUpisOpen = false;
	$scope.savedSleepCounter = null;
	
	$scope.loadData = function () {
		$http.get("https://api.particle.io/v1/devices/3e0040000f47343432313031/Red?access_token=af96025ac3f595c31d6aaa7be95c4b2e32b50d9f")
		.success(function (response) {
			$scope.scanR = response.result;
		});
		$http.get("https://api.particle.io/v1/devices/3e0040000f47343432313031/Green?access_token=af96025ac3f595c31d6aaa7be95c4b2e32b50d9f")
		.success(function (response) {
			$scope.scanG = response.result;
		});
		$http.get("https://api.particle.io/v1/devices/3e0040000f47343432313031/Blue?access_token=af96025ac3f595c31d6aaa7be95c4b2e32b50d9f")
		.success(function (response) {
			$scope.scanB = response.result;
		});
		$http.get("https://api.particle.io/v1/devices/3e0040000f47343432313031/Light?access_token=af96025ac3f595c31d6aaa7be95c4b2e32b50d9f")
		.success(function (response) {
			$scope.light = response.result;
		});
	};
	
	$interval(function(){
		$scope.loadData();
	},100);
	
	
	$scope.noActionsPopUp = function(titleText, templateText, kText) {
		var noActionsPopup = $ionicPopup.alert({
	    	title: titleText,
	    	template: '<div class= "dying-popUp-owl-img '+$scope.playerOwl.owlColor+'-owl-background"></div><div class="dyingPopUp-text">'+templateText+'</div>',
			cssClass: 'dyingOwl-PopUp',
			okText: kText
		});
		
		noActionsPopup.then(function(res) {
			$scope.fadeOutOverlay();
			$scope.popUpisOpen = false;
	   	});
	   	
		$timeout(function(){
		   $('.dyingOwl-PopUp .popup-head h3').addClass($scope.playerOwl.owlColor+'-owl-text-color');			   
		   $('.dyingOwl-PopUp .popup-buttons button').addClass($scope.playerOwl.owlColor+'-owl-bg-color');			   
	   	},10);
	   
	   	$scope.fadeInOverlay();
	}
	
	$scope.fadeInOverlay = function () {
		$('.slider-fader').css('background', 'rgba(0,0,0,0.5)');	
		$('.slider-fader').css('visibility', 'visible');	
	};
	
	$scope.fadeOutOverlay = function () {
		$('.slider-fader').css('background', 'rgba(0,0,0,0)');	
		$('.slider-fader').css('visibility', 'hidden');	
	};

	$scope.showLove = function() {
		$scope.popUpisOpen = true;
		if ((!$scope.owlSleeps && !$scope.owlNeedsToPlay && !$scope.owlNeedsFood) || $scope.owlNeedsLove && !$scope.owlNeedsFood && !$scope.owlNeedsToPlay && !$scope.owlSleeps) {
			$scope.data = {};
		
			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
		   		templateUrl: 'templates/love.html',
		   		scope: $scope,
		  	});
		  	$scope.closePopup = function() {
				myPopup.close();
				$scope.fadeOutOverlay();
				$scope.popUpisOpen = false;
			};
			$scope.fadeInOverlay();
		}
		if ($scope.owlSleeps) {
			var sleepTitleText = 'Schlaf ist Wichtig !';
			var sleepTemplateText = 'Soll deine Eule die ganze Nacht durchfeiern? Lass sie schlafen !';
			var sleepOkText = 'Gute N8!';
			$scope.noActionsPopUp(sleepTitleText, sleepTemplateText, sleepOkText);
		}
		else if ($scope.owlNeedsToPlay) {
			var playTitleText = 'Und sonst so ?';
			var playTemplateText = 'Deiner Eule ist langweilig. Spiel gefälligst mal mit ihr !';
			var playOkText = 'Let&#039;s Play!';
			$scope.noActionsPopUp(playTitleText, playTemplateText, playOkText);
		}
		else if ($scope.owlNeedsFood) {
			var foodTitleText = 'Hungersnot';
			var foodTemplateText = 'Füttere deine Eule doch wenigstens einmal im Jahr. Sonst stirbt sie !';
			var foodOkText = 'Guten Appetit !';
			$scope.noActionsPopUp(foodTitleText, foodTemplateText, foodOkText);
		}
	};
	
	$scope.showFeed = function() {
		$scope.popUpisOpen = true;
		if ((!$scope.owlSleeps && !$scope.owlNeedsToPlay && !$scope.owlNeedsLove) || $scope.owlNeedsFood && !$scope.owlNeedsToPlay && !$scope.owlSleeps) {
			$scope.data = {};
	
			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
				templateUrl: 'templates/feed.html',
				scope: $scope
			});
			$scope.closePopup = function() {
				myPopup.close();
				$scope.fadeOutOverlay();
				$scope.popUpisOpen = false;
			};
			$scope.fadeInOverlay();
			
		}
		if ($scope.owlSleeps) {
			var sleepTitleText = 'Schlaf ist Wichtig !';
			var sleepTemplateText = 'Soll deine Eule die ganze Nacht durchfeiern? Lass sie schlafen !';
			var sleepOkText = 'Gute N8!';
			$scope.noActionsPopUp(sleepTitleText, sleepTemplateText, sleepOkText);
		}
		else if ($scope.owlNeedsToPlay) {
			var playTitleText = 'Und sonst so ?';
			var playTemplateText = 'Deiner Eule ist langweilig. Spiel gefälligst mal mit ihr !';
			var playOkText = 'Let&#039;s Play!';
			$scope.noActionsPopUp(playTitleText, playTemplateText, playOkText);
		}
		else if ($scope.owlNeedsLove) {
			var foodTitleText = 'Ein bisschen Liebe?';
			var foodTemplateText = 'Niemand hat deine Eule lieb. Streichel sie doch mal !';
			var foodOkText = 'Sorry Dude!';
			$scope.noActionsPopUp(foodTitleText, foodTemplateText, foodOkText);
		}
	};
	
	$scope.showPlay = function() {
		$scope.popUpisOpen = true;
		if ((!$scope.owlSleeps && !$scope.owlNeedsFood && !$scope.owlNeedsLove) || $scope.owlNeedsToPlay && !$scope.owlSleeps) {
			$scope.data = {};
	
			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
				templateUrl: 'templates/play.html',
				scope: $scope
			});
			$scope.closePopup = function() {
				myPopup.close();
				$scope.fadeOutOverlay();
				$scope.popUpisOpen = false;
			};
			$scope.fadeInOverlay();
		}
		else if ($scope.owlSleeps) {
			var sleepTitleText = 'Schlaf ist Wichtig !';
			var sleepTemplateText = 'Soll deine Eule die ganze Nacht durchfeiern? Lass sie schlafen !';
			var sleepOkText = 'Gute N8!';
			$scope.noActionsPopUp(sleepTitleText, sleepTemplateText, sleepOkText);
		}
		else if ($scope.owlNeedsFood) {
			var foodTitleText = 'Hungersnot';
			var foodTemplateText = 'Füttere deine Eule doch wenigstens einmal im Jahr. Sonst stirbt sie !';
			var foodOkText = 'Guten Appetit !';
			$scope.noActionsPopUp(foodTitleText, foodTemplateText, foodOkText);
		}
		else if ($scope.owlNeedsLove) {
			var foodTitleText = 'Ein bisschen Liebe?';
			var foodTemplateText = 'Niemand hat deine Eule lieb. Streichel sie doch mal !';
			var foodOkText = 'Sorry Dude!';
			$scope.noActionsPopUp(foodTitleText, foodTemplateText, foodOkText);
		}
	};
	
	$scope.showSleep = function() {
		$scope.popUpisOpen = true;
		if ((!$scope.owlNeedsToPlay && !$scope.owlNeedsFood && !$scope.owlNeedsLove) || $scope.owlSleeps) {
			$scope.data = {};
		
			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
				templateUrl: 'templates/sleep.html',
				scope: $scope,
			});
			
			$scope.closePopup = function() {
				myPopup.close();	
				$scope.fadeOutOverlay();
				$scope.popUpisOpen = false;
			};
			$scope.fadeInOverlay();
		}
		else if ($scope.owlNeedsToPlay) {
			var playTitleText = 'Und sonst so ?';
			var playTemplateText = 'Deiner Eule ist langweilig. Spiel gefälligst mal mit ihr !';
			var playOkText = 'Let&#039;s Play!';
			$scope.noActionsPopUp(playTitleText, playTemplateText, playOkText);
		}		
		else if ($scope.owlNeedsFood) {
			var foodTitleText = 'Hungersnot';
			var foodTemplateText = 'Füttere deine Eule doch wenigstens einmal im Jahr. Sonst stirbt sie !';
			var foodOkText = 'Guten Appetit !';
			$scope.noActionsPopUp(foodTitleText, foodTemplateText, foodOkText);
		}
		else if ($scope.owlNeedsLove) {
			var foodTitleText = 'Ein bisschen Liebe?';
			var foodTemplateText = 'Niemand hat deine Eule lieb. Streichel sie doch mal !';
			var foodOkText = 'Sorry Dude!';
			$scope.noActionsPopUp(foodTitleText, foodTemplateText, foodOkText);
		}
	};
	

	$scope.nextSlide = function() {
		$ionicSlideBoxDelegate.next();
	};
	$scope.nextSlideAndStart = function() {
		$ionicSlideBoxDelegate.next();
		
		
		$http.post("https://api.particle.io/v1/devices/3e0040000f47343432313031/game?access_token=af96025ac3f595c31d6aaa7be95c4b2e32b50d9f", {param:"1"});
		
		
		$scope.scanState = 0;

		$scope.scanRightOrNot = 'Scanne folgende Farbe';
		$('.feeding-icon-wrong').css('visibility', 'hidden');
		$('.feeding-icon-right').css('visibility', 'hidden');
		$scope.checkRgbSensor = $interval(function (){
			$('.feeding-color-scanning').css('background-color', 'rgb('+$scope.scanR+','+$scope.scanG+','+$scope.scanB+')');
			if($scope.scanState == 0){
				$scope.targetR = 150;
				$scope.targetG = 80;
				$scope.targetB = 80;
				$('.feeding-color').css('background-color', 'rgb(190,20,20)');
				$('.current-fruit').css('background-image','url(img/fruit_images/apple.svg)' );
			}
			else if ($scope.scanState == 1){
				$scope.targetR = 80;
				$scope.targetG = 100;
				$scope.targetB = 80;
				$('.feeding-color').css('background-color', 'rgb(20,190,20)');
				$('.current-fruit').css('background-image','url(img/fruit_images/limes.svg)' );
			}
			else if ($scope.scanState == 2){
				$scope.targetR = 100;
				$scope.targetG = 100;
				$scope.targetB = 70;
				$('.feeding-color').css('background-color', 'rgb(20,20,190)');
				$('.current-fruit').css('background-image','url(img/fruit_images/blueberries.svg)' );
			}
			
			if( ($scope.scanR > $scope.targetR && $scope.scanG < $scope.targetG && $scope.scanB < $scope.targetB ) && $scope.colorScanTimer > 0 && $scope.scanState == 0) {
				$scope.rgbScannedCorrect = true;
			}
			else if ( ($scope.scanG > $scope.targetG && $scope.scanR < $scope.targetR && $scope.scanB < $scope.targetB ) && $scope.colorScanTimer > 0 && $scope.scanState == 1) {
				$scope.rgbScannedCorrect = true;
			}
			else if ( ($scope.scanB > $scope.targetB && $scope.scanR < $scope.targetR && $scope.scanG < $scope.targetG ) && $scope.colorScanTimer > 0 && $scope.scanState == 2) {
				$scope.rgbScannedCorrect = true;
			}
			else if ($scope.colorScanTimer > 0) {
				$scope.rgbScannedCorrect = false;
			}
			
			if(!$scope.rgbScannedCorrect && $scope.colorScanTimer > 0 && $scope.colorScanTimer < 15){
				$scope.scanRightOrNot = 'Leider falsch!';
				$('.feeding-icon-wrong').css('visibility', 'normal');
				$('.feeding-icon-right').css('visibility', 'hidden');
			}
			else if ($scope.rgbScannedCorrect && $scope.colorScanTimer < 15){
				$scope.scanRightOrNot = 'Spitze!';
				$('.feeding-icon-right').css('visibility', 'normal');
				$('.feeding-icon-wrong').css('visibility', 'hidden');
			}
			
			if($scope.rgbScannedCorrect && $scope.colorScanTimer == 0) {
				$scope.scanRightOrNot = 'Scanne folgende Farbe';
				$scope.colorScanTimer = 15;
				$scope.rgbScannedCorrect = false;
				if($scope.scanState <2){
					$scope.scanState++;					
				}
				else{
					$ionicSlideBoxDelegate.slide(3);	
					$interval.cancel($scope.riseScanTimer);
					$interval.cancel($scope.checkRgbSensor);
				
					Owl.riseFeedStatus(45);		
					$scope.playerOwl = Owl.all();
					$scope.updateOwlFeelings($scope.playerOwl);				
					$scope.owlNeedsFood = false;
					$('.current-fruit').css('background-image','url(img/fruit_images/apple.svg)' );
				}
			}
			else if ($scope.colorScanTimer == 0 && !$scope.rgbScannedCorrect){			
				$ionicSlideBoxDelegate.slide(4);	
			}
		},100);		
		$scope.riseScanTimer = $interval(function(){
			if($scope.colorScanTimer > 0){
				$scope.colorScanTimer--;
			}
		},1000);

	};
	$scope.restartSlide = function() {
		$ionicSlideBoxDelegate.slide(0);
		$interval.cancel($scope.riseScanTimer);
		$interval.cancel($scope.checkRgbSensor);
		$scope.colorScanTimer = 15;
		$scope.rgbScannedCorrect = false;
	};

	$scope.disableSwipe = function() {
		$ionicSlideBoxDelegate.enableSlide(false);
	};
	$scope.restartSleep = function() {
		$ionicSlideBoxDelegate.slide(0);
		$scope.cancelIntervalls();
	};

	$scope.startSleepGame = function() {
		$scope.waitForSleepSensor = 0;
	
		$ionicSlideBoxDelegate.slide(1);

		var sleepProgressFunction = $interval(function(){
			
			if ($scope.light > 1000)
			{
				$scope.sleepProgress -= 1;
			}	

			if (sleepingIndicator) {
				$interval.cancel(sleepProgressFunction);
				$interval.cancel(sleepCounterFunction);
				sleepingIndicator = false;
				$scope.sleepProgress = 100;
				$scope.sleepCounter = 10;
			}
			if ($scope.sleepProgress <= 0 && !sleepingIndicator && $scope.sleepCounter <= 0) {
				sleepingIndicator = true;
				$ionicSlideBoxDelegate.next();
				Owl.riseSleepStatus(30);		
				$scope.playerOwl = Owl.all();
				$scope.updateOwlFeelings($scope.playerOwl);
				
			}
		},100);
	
		var sleepCounterFunction = $interval(function(){

			if ($scope.light > 1000 && $scope.sleepCounter > 0)
			{
				$scope.sleepCounter -= 1;
				$scope.waitForSleepSensor = 0;
			}
			else {
				$scope.savedSleepCounter = $scope.sleepCounter;
			}
			
			if($scope.sleepCounter == 10){
				$scope.waitForSleepSensor++;
			}
			else if ($scope.sleepCounter == $scope.savedSleepCounter){
				$scope.waitForSleepSensor++;				
			}
		
			if ($scope.waitForSleepSensor == 15) {
				sleepingIndicator = true;
				$ionicSlideBoxDelegate.slide(3);
			}

		},1000);
	}
		
	$scope.playerOwl = Owl.all();
	$scope.owlFeeling = 'normal';
	$scope.loveFeelingStatus = 0;
	$scope.feedFeelingStatus = 0;
	$scope.sleepFeelingStatus = 0;
	$scope.levelFeelingStatus = 0;
	$scope.owlPrettyMad = false;
	$scope.feelingStatesLoaded = false;
	$scope.bubbleIsHidden = true;
	$scope.bubbleStatus = 1;
	$scope.bubbleIconLoveIsInRandom = false;
	$scope.bubbleIconFeedIsInRandom = false;
	$scope.bubbleIconSleepIsInRandom = false;	
	$scope.bubbleIconLevelIsInRandom = false;
	$scope.randomIcons = [];
	$scope.owlNeedsToDie = false;
	$scope.owlSleeps = false;
	$scope.owlNeedsFood = false;
	$scope.owlNeedsToPlay = false;
	$scope.owlNeedsLove = false;
	$scope.noActionsPossible = false;
	
	$scope.bubbleIconLove = 'love fa fa-heart red-text text-lighten-1';
	$scope.bubbleIconFeed = 'feed fa fa-cutlery grey-text';
	$scope.bubbleIconSleep = 'sleep ion-ios-moon larger-icon indigo-text text-lighten-1';
	$scope.bubbleIconLevel = 'level ion-ios-game-controller-b larger-icon-pad lime-text text-lighten-1';
	
	$scope.updateOwlFeelings = function(owl) {
		$(".love-status .determinate").css('width',+owl.loveStatus);
		$(".feed-status .determinate").css('width',+owl.feedStatus);
		$(".sleep-status .determinate").css('width',+owl.sleepStatus);
		$(".level-status .determinate").css('width',+owl.levelStatus);
	};
	
	$scope.changeOwlBackgroundImage = function () {
		$('.character-container').css('background', 'url(img/Owl_Skins/skin-'+$scope.playerOwl.owlColor+'-'+$scope.owlFeeling+'.svg) no-repeat center center');
	};
	
	$scope.changeOwlBackgroundImage();

	$scope.normalOwlTwinkle = function () {	
		if (!$scope.owlPrettyMad && !$scope.owlSleeps && !$scope.owlNeedsToDie && !$scope.owlNeedsFood && !$scope.owlNeedsLove) {
			$timeout(function(){
				if($scope.playerOwl.sleepStatus >= 20){
					$scope.owlFeeling = 'sleeping';
					$scope.changeOwlBackgroundImage();
				}
			},300);
			$timeout(function(){
				if($scope.playerOwl.sleepStatus >= 20){
					$scope.owlFeeling = 'normal';	
					$scope.changeOwlBackgroundImage();					
				}
			},600);
		}
	};
		
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
			
	$scope.riseOwlStates = function() {		
		Owl.riseLoveStatus(10);
		Owl.riseFeedStatus(12);
		Owl.riseSleepStatus(7);
		Owl.riseLevelStatus(15);
		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
	};
	
	$scope.riseLoveStatus = function () {
		Owl.riseLoveStatus(10);
		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
	};
	
	$scope.riseFeedStatus = function () {
		Owl.riseFeedStatus(10);
		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
	};
	
	$scope.riseSleepStatus = function () {
		Owl.riseSleepStatus(10);
		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
	};
		
	$scope.riseLevelStatus = function () {
		Owl.riseLevelStatus(10);
		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
	};
	
	$scope.lowerLoveStatus = function () {
		Owl.lowerLoveStatus(10);
		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
	};
	$scope.lowerFeedStatus = function () {
		Owl.lowerFeedStatus(10);
		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
	};
	$scope.lowerSleepStatus = function () {
		Owl.lowerSleepStatus(10);
		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
	};
	$scope.lowerLevelStatus = function () {
		Owl.lowerLevelStatus(10);
		$scope.playerOwl = Owl.all();
	 	$scope.updateOwlFeelings($scope.playerOwl);
	};
	
 	$scope.updateLoveStatus = function(){
	 	if(!$scope.owlNeedsToDie){	
		 	$scope.loveStatusDownValue = 5;
		 	Owl.lowerLoveStatus($scope.loveStatusDownValue);
	 		$scope.playerOwl = Owl.all();
		 	$scope.updateOwlFeelings($scope.playerOwl);
		}
 	};
 	
 	$scope.updateFeedStatus = function(){
	 	if(!$scope.owlNeedsToDie){
		 	$scope.feedStatusDownValue = 5;
		 	Owl.lowerFeedStatus($scope.feedStatusDownValue);
	 		$scope.playerOwl = Owl.all();
		 	$scope.updateOwlFeelings($scope.playerOwl);
		}
 	};
 	
 	$scope.updateSleepStatus = function(){
	 	if(!$scope.owlNeedsToDie){
		 	$scope.sleepStatusDownValue = 5;
		 	Owl.lowerSleepStatus($scope.sleepStatusDownValue);
	 		$scope.playerOwl = Owl.all();
		 	$scope.updateOwlFeelings($scope.playerOwl);
		}
 	};
 	
 	$scope.updateLevelStatus = function(){
	 	if(!$scope.owlNeedsToDie){
		 	$scope.levelStatusDownValue = 5;
		 	Owl.lowerLevelStatus($scope.levelStatusDownValue);
	 		$scope.playerOwl = Owl.all();
		 	$scope.updateOwlFeelings($scope.playerOwl);
		}
 	};
	
	$interval(function(){
		$scope.updateLoveStatus();
	},20000);	
	$interval(function(){
		$scope.updateFeedStatus();
	},26000);
	$interval(function(){
		$scope.updateSleepStatus();
	},32000);
	$interval(function(){
		//$scope.updateLevelStatus();
	},38000);
		
	$interval(function(){
		$scope.feelingCounter = $scope.loveFeelingStatus + $scope.feedFeelingStatus + $scope.sleepFeelingStatus + $scope.levelFeelingStatus;
		
		if ($scope.feelingCounter >= 2) {
			$scope.owlPrettyMad = true;
		}
		else {
			$scope.owlPrettyMad = false;
		}

	},100);
		
		
	$scope.letOwlBeMad = function() {
		if($scope.owlPrettyMad && !$scope.owlSleeps && !$scope.owlNeedsToDie && !$scope.smallOwlisOutOfStage) {
			$timeout(function(){
				$scope.owlFeeling = 'sleeping';
				$scope.changeOwlBackgroundImage();
			},300);
			$timeout(function(){
				$scope.owlFeeling = 'fuckedUp';	
				$scope.changeOwlBackgroundImage();
			},600);
		}
	};
		
	$timeout(function (){
		$scope.letOwlBeMad();		
	},600);	
	
	$interval(function(){
		$scope.letOwlBeMad();
	},3500);
	
	$scope.changeOwlsFace = function () {
		if(!$scope.owlSleeps && !$scope.owlNeedsToDie) {
			if($scope.playerOwl.loveStatus <= 30 && !$scope.owlPrettyMad){
				if ($scope.feelingStatesLoaded) {
					$timeout(function(){
						$scope.owlFeeling = 'sleeping';
						$scope.changeOwlBackgroundImage();
					},300);
					$timeout(function(){
						$scope.owlFeeling = 'sad';	
						$scope.changeOwlBackgroundImage();
					},600);
				}	
				$scope.loveFeelingStatus = 1;
			}
			else if ($scope.playerOwl.loveStatus > 30) {
				$scope.loveFeelingStatus = 0;			
			}
			
			if($scope.playerOwl.feedStatus <= 20 && !$scope.owlPrettyMad){
				if ($scope.feelingStatesLoaded) {
					$timeout(function(){
						$scope.owlFeeling = 'sleeping';
						$scope.changeOwlBackgroundImage();
					},300);
					$timeout(function(){
						$scope.owlFeeling = 'hungry';
						$scope.changeOwlBackgroundImage();	
					},600);
					$scope.feedFeelingStatus = 1;
				}	
			}
			else if ($scope.playerOwl.feedStatus > 20) {
				$scope.feedFeelingStatus = 0;			
			}
			
			if($scope.playerOwl.sleepStatus <= 20 && !$scope.owlPrettyMad) {
				if ($scope.feelingStatesLoaded) {
					$timeout(function(){
						$scope.owlFeeling = 'sleeping';
						$scope.changeOwlBackgroundImage();
					},300);
					$timeout(function(){
						$scope.owlFeeling = 'sleepy';	
						$scope.changeOwlBackgroundImage();
					},600);
				}
				$scope.sleepFeelingStatus = 1;
			}
			else if ($scope.playerOwl.sleepStatus > 20) {
				$scope.sleepFeelingStatus = 0;		
			}

			if($scope.playerOwl.levelStatus <= 20 && !$scope.owlPrettyMad){
				if ($scope.feelingStatesLoaded) {
					$timeout(function(){
						$scope.owlFeeling = 'sleeping';
						$scope.changeOwlBackgroundImage();
					},300);
					$timeout(function(){
						$scope.owlFeeling = 'angry';	
						$scope.changeOwlBackgroundImage();
					},600);
				}
				$scope.levelFeelingStatus = 1;
			}
			else if ($scope.playerOwl.levelStatus > 20) {
				$scope.levelFeelingStatus = 0;	
				$scope.owlNeedsToPlay = false;		
			}	
			$scope.feelingStatesLoaded = true;
		}
		if ($scope.playerOwl.sleepStatus > 20 && !$scope.owlNeedsToDie){
			$scope.owlSleeps = false;
		}
		console.log($scope.owlSleeps);
		console.log($scope.owlPrettyMad);
	};
	
	$interval(function () {	
		$('.attention-bubble').removeClass('pulse zoomIn');
		$timeout(function(){
			$('.attention-bubble').addClass('pulse');
			$timeout(function(){
				$('.attention-bubble').removeClass('pulse');
				$timeout(function(){
					$('.attention-bubble').addClass('pulse');
				},100);	
			},500);	
		},100);	
	},2500);
	
	$scope.hideBubble = function() {		
		$('.attention-bubble').addClass('zoomOut');
		$('.attention-bubble').removeClass('zoomIn show');	
	};	
	
	$scope.pushStatusToRandomIcon = function (newRandomIcon) {
		$scope.randomIcons.push(newRandomIcon);
	};
	
	$scope.spliceStatusFromRandomIcon = function (oldRandomIcon) {
		$scope.randomIcons.splice(oldRandomIcon);
	};
	
	$scope.changeBubbleStatus = function () {
		
		//for loveStatusIcon
		
		if ($scope.playerOwl.loveStatus <= 30 && $scope.bubbleIsHidden && $scope.feelingCounter <= 1){
			$('.attention-bubble').removeClass('pulse zoomIn zoomOut');
			$('.attention-bubble').addClass('zoomIn show');
			$('.attention-bubble i').removeClass();
			$('.attention-bubble i').addClass($scope.bubbleIconLove);
			$scope.bubbleIsHidden = false;
		}
		else if ($scope.playerOwl.loveStatus > 30 && $scope.feelingCounter < 1) {
			$scope.hideBubble();
			$scope.bubbleIsHidden = true;
		}
		else if ($scope.playerOwl.loveStatus <= 30 && !$scope.bubbleIconLoveIsInRandom){
			$scope.pushStatusToRandomIcon($scope.bubbleIconLove);
			$scope.bubbleIconLoveIsInRandom = true;
		}
		else if ($scope.playerOwl.loveStatus > 30 && $scope.bubbleIconLoveIsInRandom){
			$scope.spliceStatusFromRandomIcon($scope.bubbleIconLove);
			$scope.bubbleIconLoveIsInRandom = false;
		}
		
		//for feedStatusIcon
	
		if ($scope.playerOwl.feedStatus <= 20 && $scope.bubbleIsHidden && $scope.feelingCounter <= 1){
			$('.attention-bubble').removeClass('pulse zoomIn zoomOut');
			$('.attention-bubble').addClass('zoomIn show');
			$('.attention-bubble i').removeClass();
			$('.attention-bubble i').addClass($scope.bubbleIconFeed);
			$scope.bubbleIsHidden = false;
		}
		else if ($scope.playerOwl.feedStatus > 20 && $scope.feelingCounter < 1) {
			$scope.hideBubble();
			$scope.bubbleIsHidden = true;
		}
		else if ($scope.playerOwl.feedStatus <= 20 && !$scope.bubbleIconFeedIsInRandom){
			$scope.pushStatusToRandomIcon($scope.bubbleIconFeed);
			$scope.bubbleIconFeedIsInRandom = true;
		}
		else if ($scope.playerOwl.loveStatus > 20 && $scope.bubbleIconFeedIsInRandom){
			$scope.spliceStatusFromRandomIcon($scope.bubbleIconFeed);
			$scope.bubbleIconFeedIsInRandom = false;
		}
		
		//for sleepStatusIcon
			
		if ($scope.playerOwl.sleepStatus <= 20 && $scope.bubbleIsHidden && $scope.feelingCounter <= 1){
			$('.attention-bubble').removeClass('pulse zoomIn zoomOut');
			$('.attention-bubble').addClass('zoomIn show');
			$('.attention-bubble i').removeClass();
			$('.attention-bubble i').addClass($scope.bubbleIconSleep);
			$scope.bubbleIsHidden = false;
		}
		else if ($scope.playerOwl.sleepStatus > 20 && $scope.feelingCounter < 1) {
			$scope.hideBubble();
			$scope.bubbleIsHidden = true;
		}
		else if ($scope.playerOwl.sleepStatus <= 20 && !$scope.bubbleIconSleepIsInRandom){
			$scope.pushStatusToRandomIcon($scope.bubbleIconSleep);
			$scope.bubbleIconSleepIsInRandom = true;
		}
		else if ($scope.playerOwl.sleepStatus > 20 && $scope.bubbleIconSleepIsInRandom){
			$scope.spliceStatusFromRandomIcon($scope.bubbleIconSleep);
			$scope.bubbleIconSleepIsInRandom = false;
		}
		
		//for levelStatusIcon
		
		if ($scope.playerOwl.levelStatus <= 20 && $scope.bubbleIsHidden && $scope.feelingCounter <= 1){
			$('.attention-bubble').removeClass('pulse zoomIn zoomOut');
			$('.attention-bubble').addClass('zoomIn show');
			$('.attention-bubble i').removeClass();
			$('.attention-bubble i').addClass($scope.bubbleIconLevel);
			$scope.bubbleIsHidden = false;
		}
		else if ($scope.playerOwl.levelStatus > 20 && $scope.feelingCounter < 1) {
			$scope.hideBubble();
			$scope.bubbleIsHidden = true;
		}
		else if ($scope.playerOwl.levelStatus <= 20 && !$scope.bubbleIconLevelIsInRandom){
			$scope.pushStatusToRandomIcon($scope.bubbleIconLevel);
			$scope.bubbleIconLevelIsInRandom = true;
		}
		else if ($scope.playerOwl.levelStatus > 20 && $scope.bubbleIconLevelIsInRandom){
			$scope.spliceStatusFromRandomIcon($scope.bubbleIconLevel);
			$scope.bubbleIconLevelIsInRandom = false;
		}

	};
	
	$scope.changeBubbleIconRandom = function () {
		if ($scope.feelingCounter > 1 && $scope.bubbleIsHidden) {
			$('.attention-bubble').removeClass('pulse zoomIn zoomOut');
			$('.attention-bubble').addClass('zoomIn show');
			$('.attention-bubble i').removeClass();
			$scope.bubbleIsHidden = false;		
		}
		if ($scope.feelingCounter > 1 && !$scope.owlSleeps) {
			var randomIconClass = Math.floor((Math.random() * $scope.randomIcons.length) + 0);
			$('.attention-bubble i').removeClass();
			$('.attention-bubble i').addClass($scope.randomIcons[randomIconClass]);
		}
		if ($scope.feelingCounter > 1 && $scope.owlSleeps) {
			$('.attention-bubble i').removeClass();
			$('.attention-bubble i').addClass($scope.bubbleIconSleep);
		}
	}
	
	$timeout(function () {
		$scope.changeBubbleIconRandom();		
	},3000);

	$scope.changeOwlsFace();
	
	$interval(function(){
		$scope.changeBubbleIconRandom();
		$scope.normalOwlTwinkle();
		$scope.changeOwlsFace();

	},3500);
	
	// Happenings if stati go down to 0
	
	$scope.checkStatesForZero = function () {
		if ($scope.playerOwl.feedStatus == 0 && !$scope.owlNeedsToDie) {
			$scope.owlNeedsToDie = true;
			$timeout(function(){
				$scope.owlFeeling = 'dead';
				$scope.changeOwlBackgroundImage();
			},300);
		}
		
		if ($scope.owlNeedsToDie) {
		 	Owl.lowerFeedStatus(100);

		 	$timeout(function (){
			 	Owl.lowerLoveStatus(100);
			  	Owl.lowerSleepStatus(100);
			 	Owl.lowerLevelStatus(100);
			 	$scope.updateOwlFeelings($scope.playerOwl);
		 	},500);
		 	
		 	$scope.playerOwl = Owl.all();
		 	$scope.updateOwlFeelings($scope.playerOwl);
		 	$timeout(function() {
			 	$scope.animateDying();
		 	},1500);
		 	$interval.cancel($scope.checkStatesForZeroInterval);
		}
		
		if ($scope.playerOwl.sleepStatus == 0 && !$scope.owlSleeps && !$scope.owlNeedsToDie) {
			$scope.owlSleeps = true;
			console.log('dasd');
			$scope.noActionsPossible = true;
			$timeout(function(){
				$scope.owlFeeling = 'sleeping';
				$scope.changeOwlBackgroundImage();
			},300);
		}
			
		if ($scope.playerOwl.levelStatus == 0 && !$scope.owlNeedsToPlay && !$scope.owlNeedsToDie) {
			$scope.owlNeedsToPlay = true;
			$scope.noActionsPossible = true;
			$timeout(function(){
				$scope.owlFeeling = 'angry';
				$scope.changeOwlBackgroundImage();
			},300);
		}	
		
		if ($scope.playerOwl.feedStatus == 0 && !$scope.owlNeedsFood && !$scope.owlNeedsToDie) {
			$scope.owlNeedsFood = true;
			$scope.noActionsPossible = true;
			$timeout(function(){
				$scope.owlFeeling = 'hungry';
				$scope.changeOwlBackgroundImage();
			},300);
		}
		
		if ($scope.playerOwl.loveStatus == 0 && !$scope.owlNeedsLove && !$scope.owlNeedsToDie) {
			$scope.owlNeedsLove = true;
			$scope.noActionsPossible = true;
			$timeout(function(){
				$scope.owlFeeling = 'sad';
				$scope.changeOwlBackgroundImage();
			},300);
		}		
	}
	
	$scope.animateDying = function () {
		$timeout(function() {
			var owlDyingPopup = $ionicPopup.alert({
		    	title: 'Tod, Aus und Vorbei !',
		    	template: '<div class= "dying-popUp-owl-img '+$scope.playerOwl.owlColor+'-owl-background"></div><div class="dyingPopUp-text">Du hast deine kleine Eule elendig sterben lassen!</div>',
				cssClass: 'dyingOwl-PopUp',
				okText: 'ICH VOLLIDIOT'
			});
		
		   owlDyingPopup.then(function(res) {
		   		$scope.killAllAndRestart();
		   });
		   $timeout(function(){
			   $('.dyingOwl-PopUp .popup-head h3').addClass($scope.playerOwl.owlColor+'-owl-text-color');			   
			   $('.dyingOwl-PopUp .popup-buttons button').addClass($scope.playerOwl.owlColor+'-owl-bg-color');			   
		   },100);
		   
		   $scope.fadeInOverlay();
		   
		},1500);
	}
	
	$scope.checkStatesForZeroInterval = $interval(function(){
		$scope.checkStatesForZero();
	},200);
	
	$interval( function(){
		$scope.changeBubbleStatus();
	},200);
	
	$scope.killAllAndRestart = function () {
   		Owl.remove();
   		$scope.playerOwl = null;
   		$state.go("start");
   		$ionicHistory.clearHistory();
   		setTimeout(function (){
	   		$window.location.reload(true);
   		}, 200);
	}	
	$scope.bigOwlPos = -600;
	$scope.BigOwlknockTimer = 0;
	$scope.eyesInAnimation = false;
	$scope.loadedImageCounter = 0;
	$scope.smallOwlisOutOfStage = false;
	
	$scope.owlImgEyesLeft = new Image();
	$scope.owlImgEyesLeft.src = 'img/Owl_Skins/skin-'+$scope.playerOwl.owlColor+'-eyesleft.svg';
	$scope.owlImgEyesRight = new Image();
	$scope.owlImgEyesRight.src = 'img/Owl_Skins/skin-'+$scope.playerOwl.owlColor+'-eyesright.svg';	
	
	$scope.owlImgEyesRight.onload = function(){
		$scope.loadedImageCounter++;	
	};
	
	$scope.owlImgEyesLeft.onload = function(){
		$scope.loadedImageCounter++;	
	};
	
	$scope.owlLeavesStage = function() {
		if(!$scope.smallOwlisOutOfStage) {
			$scope.smallOwlisOutOfStage = true;
			$timeout(function(){
				$scope.owlFeeling = 'eyesright';
				$scope.changeOwlBackgroundImage();
			},500);
			$timeout(function(){
				$scope.owlFeeling = 'eyesleft';
				$scope.changeOwlBackgroundImage();	
			},1500);
			$timeout(function(){
				$scope.owlFeeling = 'eyesright';
				$scope.changeOwlBackgroundImage();	
			},2500);				
			$timeout (function () {
				
				$('.character-container').addClass('zoomOutRight');
				$('.character-container').removeClass('bounceInLeft show');
				$scope.hideBubble();
			
				$timeout(function(){
					$scope.showBigOwl();
				},500);
				$timeout(function(){
					$scope.bubbleIsHidden = true;
				},12000);
			},3500);
		}
	}
	
	$scope.owlEntersStage = function() {
		if ($scope.owlSleeps){
			$scope.owlFeeling = 'sleeping';
		}
		else {
			$scope.owlFeeling = 'normal';
		}
		$scope.changeOwlBackgroundImage();	
		$('.character-container').removeClass('zoomOutRight');
		$('.character-container').addClass('bounceInLeft show');
		$scope.smallOwlisOutOfStage = false;
	}
	
	$scope.showBigOwl = function () { 
		$scope.bigOwlKnockKnock = $interval(function() {		
			if ($scope.loadedImageCounter == 2) {
				if($scope.bigOwlPos == -600) {
					$('.big-owl-dunno-what-to-do').css('background', 'url(img/Owl_Skins/skin-'+$scope.playerOwl.owlColor+'-normal.svg) no-repeat center top / 120%');
				}
				if($scope.bigOwlPos < -250 && $scope.BigOwlknockTimer <= 2) {
					$scope.bigOwlPos +=60;
					$('.big-owl-dunno-what-to-do').css('bottom', $scope.bigOwlPos);
				}
				else if($scope.BigOwlknockTimer <= 2 && $scope.bigOwlPos > -250 ){
		
					$('.big-owl-dunno-what-to-do').css('background-size', '140%');
					navigator.vibrate(3000);
					$timeout(function(){
						$('.big-owl-dunno-what-to-do').css('background-size', '120%');			
					},100);
					$timeout(function(){
						$('.big-owl-dunno-what-to-do').css('background-size', '140%');
						navigator.vibrate(3000);
						$timeout(function(){
							$('.big-owl-dunno-what-to-do').css('background-size', '120%');			
						},100);
					},200);
					$scope.BigOwlknockTimer++;
				}
				else if ($scope.BigOwlknockTimer > 2 && !$scope.eyesInAnimation){
					$('.big-owl-dunno-what-to-do').css('transition','all 0s');
		
					$timeout(function(){
						$('.big-owl-dunno-what-to-do').css('background', 'url('+$scope.owlImgEyesLeft.src+') no-repeat center top / 120%');
					},500);
					$timeout(function(){
						$('.big-owl-dunno-what-to-do').css('background', 'url('+$scope.owlImgEyesRight.src+') no-repeat center top / 120%');
					},1500);
					$timeout(function(){
						$('.big-owl-dunno-what-to-do').css('background', 'url('+$scope.owlImgEyesLeft.src+') no-repeat center top / 120%');
					},2500);
					$timeout(function(){
						$('.big-owl-dunno-what-to-do').css('background', 'url(img/Owl_Skins/skin-'+$scope.playerOwl.owlColor+'-normal.svg) no-repeat center top / 120%');
					},3500);
		
					$scope.eyesInAnimation = true;
					
					$timeout(function(){
						$scope.BigOwlknockTimer = 0;
						$scope.bigOwlPos = -600;
						$('.big-owl-dunno-what-to-do').css('transition','all 200ms');
						$('.big-owl-dunno-what-to-do').css('bottom', $scope.bigOwlPos);
						$scope.eyesInAnimation = false;
					},4000);
					
					$interval.cancel($scope.bigOwlKnockKnock);
					$timeout(function(){
						$scope.owlEntersStage();
					},5000);
				}	
			}		
		},1000);
	};	
	
	$scope.waitForLoveAnimation = false;	
	$scope.animateLove = function () {
		if (!$scope.waitForLoveAnimation) {
			$scope.repeatLoveAnimateCounter = 0;
			$scope.waitForLoveAnimation = true;
	
			$scope.repeatLoveAnimate = $interval(function (){	
				$('.animate-icon-love').removeClass('slideOutUp');	
				$timeout(function () {
					$('.animate-icon-love').addClass('slideOutUp show');
				},100);
				$timeout(function () {
					$('.animate-icon-love').removeClass('show');	
				},500);
				if ($scope.repeatLoveAnimateCounter == 2 ){
					$interval.cancel($scope.repeatLoveAnimate);
					$scope.waitForLoveAnimation = false;
				}	
				$scope.repeatLoveAnimateCounter++;
			},700);
			Owl.riseLoveStatus(30);
			$scope.playerOwl = Owl.all();
		 	$scope.updateOwlFeelings($scope.playerOwl);
		}
	}
	$interval(function(){
		if (!$scope.owlNeedsToDie && !$scope.popUpisOpen && !$scope.owlSleeps) {
			$scope.owlLeavesStage();
		}
	},50000);
	
	document.addEventListener('touchstart', handleTouchStart, false);        
	document.addEventListener('touchmove', handleTouchMove, false);

	var xDown = null;                                                        
	var yDown = null;                                                        

	function handleTouchStart(evt) {                                         
	    xDown = evt.touches[0].clientX;                                      
	    yDown = evt.touches[0].clientY; 
	};                                                

	function handleTouchMove(evt) {
    	if ( ! xDown || ! yDown ) {
        	return;
		}

		var xUp = evt.touches[0].clientX;                                    
		var yUp = evt.touches[0].clientY;

		var xDiff = xDown - xUp;
		var yDiff = yDown - yUp;
		if (xDown < 310 && xDown > 80 && yDown > 240 && yDown < 500) {
		    if ( Math.abs( xDiff ) < Math.abs( yDiff ) ) {    
		       if (yUp > yDown + 100 && xUp < xDown + 30 && xUp > xDown - 30) { 
					$scope.animateLove();
		        }
		    }
		   
		}                                            
	};	
})
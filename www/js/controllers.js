angular.module('starter.controllers', [])

.controller("startCtrl",function($scope, $interval, $state, $timeout){

	$timeout(function(){ 
		$state.go('config'); 
	},3000);

})

.controller("configCtrl",function($scope, $interval, $state, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, Owl){
	
	$scope.playerOwl = Owl.all();
	
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
	};
	
	$scope.rebeginCnfg = function () {
		$ionicSlideBoxDelegate.slide(0);	
	};	
	
	$scope.devices = [{name:"iPhone 7"}, {name:"Galaxy S7"}, {name:"LG G5"}, {name:"HTC M9"}, {name:"Nexus 6P"}];
	$scope.owls = [{color:"green"},{color:"red"},{color:"blue"},{color:"yellow"}]
	
	$scope.startGame = function () {
		$state.go('game');
	};	
	
})

.controller("gameCtrl",function($scope, $interval, $state, $timeout, $ionicPopup, $ionicScrollDelegate, Owl, $ionicSlideBoxDelegate, $ionicHistory, $window, $http){    

	
	$scope.sleepProgress = 100;
	$scope.sleepCounter = 10;
	var sleepingIndicator = false;
	$scope.light = null;
	$scope.rgb = null;
	$scope.colorScanTimer = 8;
	$scope.rgbScannedCorrect = false;
	
	$scope.loadData = function () {
		$http.get("https://api.particle.io/v1/devices/3e0040000f47343432313031/Colorinfo?access_token=af96025ac3f595c31d6aaa7be95c4b2e32b50d9f")
		.success(function (response) {
			$scope.rgb = response.result;
		});
		$http.get("https://api.particle.io/v1/devices/3e0040000f47343432313031/Light?access_token=af96025ac3f595c31d6aaa7be95c4b2e32b50d9f")
		.success(function (response) {
			$scope.light = response.result;
		});
	};
	
	$interval(function(){
		$scope.loadData();
	},10);
	
	
	$scope.noActionsPopUp = function(titleText, templateText, kText) {
			var noActionsPopup = $ionicPopup.alert({
		    	title: titleText,
		    	template: '<div class= "dying-popUp-owl-img '+$scope.playerOwl.owlColor+'-owl-background"></div><div class="dyingPopUp-text">'+templateText+'</div>',
				cssClass: 'dyingOwl-PopUp',
				okText: kText
			});
			
			noActionsPopup.then(function(res) {
				$scope.fadeOutOverlay();
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
		if ((!$scope.owlIsSleeping && !$scope.owlNeedsToPlay && !$scope.owlNeedsFood) || $scope.owlNeedsLove && !$scope.owlNeedsFood && !$scope.owlNeedsToPlay && !$scope.owlIsSleeping) {
			$scope.data = {};
		
			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
		   		templateUrl: 'templates/love.html',
		   		scope: $scope,
		  	});
		  	$scope.closePopup = function() {
				myPopup.close();
				$scope.fadeOutOverlay();
			};
			$scope.fadeInOverlay();
		}
		if ($scope.owlIsSleeping) {
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
		//if ((!$scope.owlIsSleeping && !$scope.owlNeedsToPlay && !$scope.owlNeedsLove) || $scope.owlNeedsFood && !$scope.owlNeedsToPlay && !$scope.owlIsSleeping) {
			$scope.data = {};
	
			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
				templateUrl: 'templates/feed.html',
				scope: $scope
			});
			$scope.closePopup = function() {
				myPopup.close();
				$scope.fadeOutOverlay();
			};
			$scope.fadeInOverlay();
			
		/*}
		if ($scope.owlIsSleeping) {
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
		}*/
	};
	
	$scope.showPlay = function() {
		if ((!$scope.owlIsSleeping && !$scope.owlNeedsFood && !$scope.owlNeedsLove) || $scope.owlNeedsToPlay && !$scope.owlIsSleeping) {
			$scope.data = {};
	
			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
				templateUrl: 'templates/play.html',
				scope: $scope
			});
			$scope.closePopup = function() {
				myPopup.close();
				$scope.fadeOutOverlay();
			};
			$scope.fadeInOverlay();
		}
		else if ($scope.owlIsSleeping) {
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
		if ((!$scope.owlNeedsToPlay && !$scope.owlNeedsFood && !$scope.owlNeedsLove) || $scope.owlIsSleeping) {
			$scope.data = {};
		
			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
				templateUrl: 'templates/sleep.html',
				scope: $scope,
			});
			
			$scope.closePopup = function() {
				myPopup.close();	
				$scope.fadeOutOverlay();
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
		$scope.scanState = 0;
		$scope.checkRgbSensor = $interval(function (){
			$('.feeding-color-scanning').css('background-color', 'rgb('+$scope.rgb+')');
			if($scope.scanState == 0){
				$scope.targetR = 150;
				$scope.targetG = 80;
				$scope.targetB = 80;
			}
			
			if( ($scope.scanR > $scope.targetR && $scope.scanG < $scope.targetG && $scope.scanB < $scope.targetB ) && $scope.colorScanTimer > 0) {
				$scope.rgbScannedCorrect = true;
			}
						
			if(!$scope.rgbScannedCorrect && $scope.colorScanTimer > 0){
				$scope.scanRightOrNot = 'Leider falsch!';
			}
			else {
				$scope.scanRightOrNot = 'Spitze!';
			}
		},10);		
		$scope.riseScanTimer = $interval(function(){
			if($scope.colorScanTimer > 0){
				$scope.colorScanTimer--;
			}			
			else if($scope.colorScanTimer == 0 || !$scope.rgbScannedCorrect){
				//$ionicSlideBoxDelegate.slide(4);
				$scope.scanRightOrNot = 'Leider war die Fütterung nicht erfolgreich!';
			}
		},1000);

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
			console.log($scope.sleepProgress);
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
	$scope.owlIsSleeping = false;
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
		if (!$scope.owlPrettyMad && !$scope.owlIsSleeping && !$scope.owlNeedsToDie) {
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
		if($scope.owlPrettyMad && !$scope.owlIsSleeping && !$scope.owlNeedsToDie) {
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
		if(!$scope.owlIsSleeping && !$scope.owlNeedsToDie) {
			if($scope.playerOwl.loveStatus <= 30 && !$scope.owlPrettyMad){
				if ($scope.feelingStatesLoaded) {
					$timeout(function(){
						$scope.owlFeeling = 'sleeping';
					},300);
					$timeout(function(){
						$scope.owlFeeling = 'sleepy';	
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
					},300);
					$timeout(function(){
						$scope.owlFeeling = 'sleepy';	
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
					},300);
					$timeout(function(){
						$scope.owlFeeling = 'sleepy';	
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
					},300);
					$timeout(function(){
						$scope.owlFeeling = 'sleepy';	
					},600);
				}
				$scope.levelFeelingStatus = 1;
			}
			else if ($scope.playerOwl.levelStatus > 20) {
				$scope.levelFeelingStatus = 0;			
			}
					
			$scope.feelingStatesLoaded = true;
		}
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
		else if ($scope.playerOwl.loveStatus > 30 && $scope.feelingCounter <= 1) {
			$scope.hideBubble();
			$scope.bubbleIsHidden = true;
		}
		else if ($scope.playerOwl.loveStatus <= 30 && !$scope.bubbleIsHidden && !$scope.bubbleIconLoveIsInRandom){
			$scope.pushStatusToRandomIcon($scope.bubbleIconLove);
			$scope.bubbleIconLoveIsInRandom = true;
		}
		else if ($scope.playerOwl.loveStatus > 30 && !$scope.bubbleIsHidden && $scope.bubbleIconLoveIsInRandom){
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
		else if ($scope.playerOwl.feedStatus > 20 && $scope.feelingCounter <= 1) {
			$scope.hideBubble();
			$scope.bubbleIsHidden = true;
		}
		else if ($scope.playerOwl.feedStatus <= 20 && !$scope.bubbleIsHidden && !$scope.bubbleIconFeedIsInRandom){
			$scope.pushStatusToRandomIcon($scope.bubbleIconFeed);
			$scope.bubbleIconFeedIsInRandom = true;
		}
		else if ($scope.playerOwl.loveStatus > 20 && !$scope.bubbleIsHidden && $scope.bubbleIconFeedIsInRandom){
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
		else if ($scope.playerOwl.sleepStatus > 20 && $scope.feelingCounter <= 1) {
			$scope.hideBubble();
			$scope.bubbleIsHidden = true;
		}
		else if ($scope.playerOwl.sleepStatus <= 20 && !$scope.bubbleIsHidden && !$scope.bubbleIconSleepIsInRandom){
			$scope.pushStatusToRandomIcon($scope.bubbleIconSleep);
			$scope.bubbleIconSleepIsInRandom = true;
		}
		else if ($scope.playerOwl.sleepStatus > 20 && !$scope.bubbleIsHidden && $scope.bubbleIconSleepIsInRandom){
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
		else if ($scope.playerOwl.levelStatus > 20 && $scope.feelingCounter <= 1) {
			$scope.hideBubble();
			$scope.bubbleIsHidden = true;
		}
		else if ($scope.playerOwl.levelStatus <= 20 && !$scope.bubbleIsHidden && !$scope.bubbleIconLevelIsInRandom){
			$scope.pushStatusToRandomIcon($scope.bubbleIconLevel);
			$scope.bubbleIconLevelIsInRandom = true;
		}
		else if ($scope.playerOwl.levelStatus > 20 && !$scope.bubbleIsHidden && $scope.bubbleIconLevelIsInRandom){
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
		if ($scope.feelingCounter > 1 && !$scope.owlIsSleeping) {
			var randomIconClass = Math.floor((Math.random() * $scope.randomIcons.length) + 0);
			$('.attention-bubble i').removeClass();
			$('.attention-bubble i').addClass($scope.randomIcons[randomIconClass]);
		}
		if ($scope.feelingCounter > 1 && $scope.owlIsSleeping) {
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
		$scope.changeOwlsFace();
		$scope.normalOwlTwinkle();
	},3500);
	
	// Happenings if stati go down to 0
	
	$scope.checkStatesForZero = function () {
		if ($scope.playerOwl.feedStatus == 0 && !$scope.owlNeedsToDie) {
			//$scope.owlNeedsToDie = true;
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
			 	//$scope.animateDying();
		 	},1500);
		 	$interval.cancel($scope.checkStatesForZeroInterval);
		}
		
		if ($scope.playerOwl.sleepStatus == 0 && !$scope.owlIsSleeping && !$scope.owlNeedsToDie) {
			$scope.owlIsSleeping = true;
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
		$scope.owlFeeling = 'normal';
		$scope.changeOwlBackgroundImage();	
		$('.character-container').removeClass('zoomOutRight');
		$('.character-container').addClass('bounceInLeft show');
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
					//navigator.vibrate(3000);
					$timeout(function(){
						$('.big-owl-dunno-what-to-do').css('background-size', '120%');			
					},100);
					$timeout(function(){
						$('.big-owl-dunno-what-to-do').css('background-size', '140%');
						//navigator.vibrate(3000);
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
})
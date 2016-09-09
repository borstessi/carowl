angular.module('starter.services', [])

.factory('Owl', function($window) {
	
	var owlProperties = [];
	var savedOwlProperties = [];
	
	
	savedOwlProperties = window.localStorage.getItem('owlProperties');
	owlProperties = (window.localStorage.getItem('owlProperties')!==null) ? JSON.parse(savedOwlProperties) : [];
	window.localStorage.setItem('owlProperties', JSON.stringify(owlProperties));

  // --------------------------- methoden der factory --------------------------- 
  return {
	    all: function() {
	      return owlProperties[0];
	    },
	    setColor: function(chosenColor) {
		    if(owlProperties.length == 0){
			    owlProperties.push({owlColor:chosenColor, loveStatus:25, feedStatus:50, sleepStatus:100, levelStatus:40});
			    console.log('RAAHH');
		    }
		    else{
				owlProperties[0].owlColor = chosenColor;   
		    }
		    window.localStorage.setItem('owlProperties', JSON.stringify(owlProperties));
	    },
	    lowerLoveStatus: function(newLoveStatus) {
		    if(owlProperties[0].loveStatus >= newLoveStatus){
			    owlProperties[0].loveStatus = owlProperties[0].loveStatus-newLoveStatus;
			}
			else{
				owlProperties[0].loveStatus = 0;
			}
				window.localStorage.setItem('owlProperties', JSON.stringify(owlProperties));
	    },
	    lowerFeedStatus: function(newFeedStatus) {
   		    if(owlProperties[0].feedStatus >= newFeedStatus){
			    owlProperties[0].feedStatus = owlProperties[0].feedStatus-newFeedStatus;
			}
			else{
				owlProperties[0].feedStatus = 0;
			}
		    window.localStorage.setItem('owlProperties', JSON.stringify(owlProperties));
	    },
	    lowerSleepStatus: function(newSleepStatus) {
		    if(owlProperties[0].sleepStatus >= newSleepStatus){		    
			    owlProperties[0].sleepStatus = owlProperties[0].sleepStatus-newSleepStatus;
			}
			else {
				owlProperties[0].sleepStatus = 0;
			}
		    window.localStorage.setItem('owlProperties', JSON.stringify(owlProperties));
	    },
	    lowerLevelStatus: function(newLevelStatus) {
		    if(owlProperties[0].levelStatus >= newLevelStatus){		    
			    owlProperties[0].levelStatus = owlProperties[0].levelStatus-newLevelStatus;
			} 
			else {
				owlProperties[0].levelStatus = 0;
			}
		    window.localStorage.setItem('owlProperties', JSON.stringify(owlProperties));
	    }
    }
	
	
});
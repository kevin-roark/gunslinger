$(function(){
    var supportsVibrate = "vibrate" in navigator;
    var waitTime = 5000;
    var waitThreshold = 30;
    var checkThreshold = 45;
    var moveThreshold = 0.5;

    var lastOrientation = {};
    var currentOrientation = {};
    var guardOrientation = {};
    var pokeOrientation = {};

    var position = 0;
    var moveCounter = 0;

    window.ondeviceorientation = function(event){
        //console.log(event.alpha);
        //console.log("beta: " + event.beta);
        //console.log(event.gamma);
        currentOrientation.alpha = event.alpha;
        currentOrientation.beta = event.beta;
        currentOrientation.gamma = event.gamma;
    }

    

    function waitForGuardPosition(callback) {
        var elapsed = 0;
        var start = new Date().getTime();
        var lastBeta = currentOrientation.beta;
        var lastGamma = currentOrientation.gamma;
        var currentBeta = currentOrientation.beta;
        var currentGamma = currentOrientation.gamma;
        
        var guardIntervalId = setInterval(function(){
            if(elapsed < waitTime){
                elapsed = new Date().getTime() - start;
                currentBeta = currentOrientation.beta;
                currentGamma = currentOrientation.gamma;
                if(elapsed >= waitTime && (Math.abs(currentGamma - lastGamma) < waitThreshold) && (Math.abs(currentBeta - lastBeta) < waitThreshold)){
                    guardOrientation.beta = currentOrientation.beta;
                    guardOrientation.gamma = currentOrientation.gamma;
                    clearInterval(guardIntervalId);
                    callback();
                }
                else if((Math.abs(currentGamma - lastGamma) >= waitThreshold) || (Math.abs(currentBeta - lastBeta) >= waitThreshold)){
                    start = new Date().getTime();
                    lastBeta = currentOrientation.beta;
        			lastGamma = currentOrientation.gamma;
        			console.log("moved");
                }
            }
        }, 100);

    };

    function waitForPokePosition(callback) {
        var elapsed = 0;
        var start = new Date().getTime();
        var lastBeta = currentOrientation.beta;
        var lastGamma = currentOrientation.gamma;
        var currentBeta = currentOrientation.beta;
        var currentGamma = currentOrientation.gamma;
        var pokeIntervalId = setInterval(function(){
            if(elapsed < waitTime){
                elapsed = new Date().getTime() - start;
                currentBeta = currentOrientation.beta;
                currentGamma = currentOrientation.gamma;
                if(elapsed >= waitTime && (Math.abs(currentGamma - lastGamma) < waitThreshold) && (Math.abs(currentBeta - lastBeta) < waitThreshold)){
                    pokeOrientation.beta = currentOrientation.beta;
                    pokeOrientation.gamma = currentOrientation.gamma;
                    clearInterval(currentGamma);
                    callback();
                }
                else if((Math.abs(currentGamma - lastGamma) >= waitThreshold) || (Math.abs(currentBeta - lastBeta) >= waitThreshold)){
                    start = new Date().getTime();
                    lastBeta = currentOrientation.beta;
        			lastGamma = currentOrientation.gamma;
        			console.log("moved");
                }
            }
        }, 100);
    };

    $("#parent").click(startGame);

    function startGame(){
        console.log(currentOrientation);
        console.log("waiting for guard");
    	var circleInterval = setInterval(loadingCircle, 30);
    	$("#sword").css({'visibility':'hidden'});
    	$("#shield").css({'visibility':'visible'});
    	$("#logo").css({'visibility':'hidden'});

        waitForGuardPosition(function(){
            console.log("guard logged, now poke");
    		$("#sword").css({'visibility':'visible'});
    		$("#shield").css({'visibility':'hidden'});
    		$("#logo").css({'visibility':'hidden'});
            waitForPokePosition(function(){
                console.log("poke logged");
                console.log("poke " + pokeOrientation.beta + " " + pokeOrientation.gamma);
                console.log("guard " + guardOrientation.beta + " " + guardOrientation.gamma);
                console.log(currentOrientation);
                window.ondeviceorientation = detectPosition;
                window.ondevicemotion = function(event){
			    	moveCounter = moveCounter + event.acceleration.y * event.interval * 0.001;
			    }; 
			    setInterval(checkMovement, 10);
			    clearInterval(circleInterval);
			    $("#circle").attr("r", 0);
            });
        });  
    }

    function detectPosition(event){
        currentOrientation.alpha = event.alpha;
        currentOrientation.beta = event.beta;
        currentOrientation.gamma = event.gamma;
    	if(Math.abs((currentOrientation.gamma - pokeOrientation.gamma) % 180) < checkThreshold && Math.abs((currentOrientation.beta - pokeOrientation.beta) % 180) < checkThreshold){
    		console.log("in poke");
    		$("#sword").css({'visibility':'visible'});
    		$("#shield").css({'visibility':'hidden'});
    		$("#logo").css({'visibility':'hidden'});
    	}
    	else if(Math.abs((currentOrientation.gamma - guardOrientation.gamma) % 180) < checkThreshold && Math.abs((currentOrientation.beta - guardOrientation.beta) % 180) < checkThreshold){
    		console.log("in guard");
    		$("#shield").css({'visibility':'visible'});
    		$("#sword").css({'visibility':'hidden'});
    		$("#logo").css({'visibility':'hidden'});
    	}
    }
	
    function checkMovement(){
    	if(moveCounter > moveThreshold){
    		position++;
    		moveCounter = 0;
    	}
    	else if(moveCounter < -moveThreshold){
    		position--;
    		moveCounter = 0;
    	}
    	console.log("moveCounter: " + moveCounter);
    	console.log("position: " + position);
    }

    var angle = 0;
    function loadingCircle(){
    	$("#circle").attr("r", (Math.abs(Math.sin(angle) * 500)) + 50);
    	angle = angle + Math.PI / 180;
    }
});

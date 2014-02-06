$(function() {
    var supportsVibrate = "vibrate" in navigator;
    var waitTime = 5000;
    var waitThreshold = 10;

    window.addEventListener('touchstart', function(event) {
        
        console.log("touchstart")
    }, false);

    window.addEventListener('touchend', function(event) {
        console.log("touchend");

    }, false);

    var lastOrientation = {};
    var currentOrientation = {};
    var guardOrientation = {};
    var pokeOrientation = {};

    function onDeviceOrientationChange(event) {
        lastOrientation.gamma = event.gamma;
        lastOrientation.beta = event.beta;
        if (event.webkitCompassHeading != undefined) { 
            lastOrientation.currentHeading = (360 - event.webkitCompassHeading);
        } else if (event.alpha != null) {
            lastOrientation.currentHeading =  (270 - event.alpha) * -1; 
        } else {
            lastOrientation.currentHeading = null;
        }
        console.log("gamma: " + lastOrientation.gamma);
    };

    window.ondeviceorientation = function(event){
        console.log(event.alpha);
        //console.log("beta: " + event.beta);
        //console.log(event.gamma);
        currentOrientation.alpha = event.alpha;
        currentOrientation.beta = event.beta;
        currentOrientation.gamma = event.gamma;

    }

    function waitForGuardPosition() {
        var elapsed = 0;
        var start = new Date().getTime();
        var lastBeta = currentOrientation.beta;
        var lastGamma = currentOrientation.gamma;
        var currentBeta = currentOrientation.beta;
        var currentGamma = currentOrientation.gamma;
        while(elapsed < waitTime){
            elapsed = new Date().getTime() - start;
            currentBeta = currentOrientation.beta;
            currentGamma = currentOrientation.gamma;
            if(elapsed >= waitTime && (Math.abs(currentGamma - lastGamma) < waitThreshold) && (Math.abs(currentBeta - lastBeta) < waitThreshold)){
                guardOrientation.beta = currentOrientation.beta;
                guardOrientation.gamma = currentOrientation.gamma;
                return;
            }
            else if((Math.abs(currentGamma - lastGamma) >= waitThreshold) || (Math.abs(currentBeta - lastBeta) >= waitThreshold)){
                start = new Date().getTime();
            }
        }
    };

    function waitForPokePosition() {
        var elapsed = 0;
        var start = new Date().getTime();
        var lastBeta = currentOrientation.beta;
        var lastGamma = currentOrientation.gamma;
        var currentBeta = currentOrientation.beta;
        var currentGamma = currentOrientation.gamma;
        while(elapsed < waitTime){
            elapsed = new Date().getTime() - start;
            currentBeta = currentOrientation.beta;
            currentGamma = currentOrientation.gamma;
            if(elapsed >= waitTime && (Math.abs(currentGamma - lastGamma) < waitThreshold) && (Math.abs(currentBeta - lastBeta) < waitThreshold)){
                pokeOrientation.beta = currentOrientation.beta;
                pokeOrientation.gamma = currentOrientation.gamma;
                return;
            }
            else if((Math.abs(currentGamma - lastGamma) >= waitThreshold) || (Math.abs(currentBeta - lastBeta) >= waitThreshold)){
                start = new Date().getTime();
            }
        }
    };

    $("#start_button").on("click", startGame);

    function startGame(){
        console.log(currentOrientation);
        waitForGuardPosition();
        console.log("guard logged, now poke");
        waitForPokePosition();
        console.log("poke logged");
        console.log("poke " + pokeOrientation.beta + " " + pokeOrientation.gamma);
        console.log("guard " + guardOrientation.beta + " " + guardOrientation.gamma);
        console.log(currentOrientation);
    }
});
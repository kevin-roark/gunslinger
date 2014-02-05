$(function() {

    var STABLE_THRESHOLD = 10;
    var SUPER_STABLE_THRESHOLD = 1;

    var waitingForDraw = false;
    var midDraw = false;
    var waitingForFire = false;

    var currentAcceleration;

    gameStart({timeUntilDraw: 2500});

    // start playing music

    window.addEventListener('touchstart', function(event) {
        console.log(event);

        if (waitingForFire) {
            var x = currentAcceleration.x;
            var y = currentAcceleration.y;
            var z = currentAcceleration.z;

            if (Math.abs(z) <= SUPER_STABLE_THRESHOLD &&
                Math.abs(y) <= SUPER_STABLE_THRESHOLD &&
                Math.abs(x) <= SUPER_STABLE_THRESHOLD) {
                
                waitingForFire = false;
                fireTouchPerformed();
            }    
        }
        else if (midDraw) {
            // should play a jamming sound
        }
        else {
            // punishment for early fire?
        }
    }, false);

    window.addEventListener('touchend', function(event) {
        console.log(event);

    }, false);

    window.ondevicemotion = function(event) {
        currentAcceleration = event.acceleration;
        var z  = event.acceleration.z;

        if (waitingForDraw && !midDraw) {
            if (z > STABLE_THRESHOLD) {
                midDraw = true;
            }
        }
        else if (waitingForDraw && midDraw) {
            if (Math.abs(z) <= STABLE_THRESHOLD) {
                midDraw = false;
                waitingForDraw = false;
                waitingForFire = true;
                drawMotionPerformed();
            }
        }
        else {
            
        }
    }

    window.ondeviceorientation = function(event) {
        //console.log(event.alpha);
        //console.log(event.beta);
        //console.log(event.gamma);
    }

    $(window).on('gamestart', gameStart);
    function gameStart(event) {
        // called to start the game ...
        console.log('game started');

        var timeUntilDraw = event.timeUntilDraw;
        setTimeout(beginWaitForDraw, timeUntilDraw); // this long until we can do a draw
    }

    // called once player can perform draw action
    function beginWaitForDraw() {

        waitingForDraw = true;
        $('#draw-text').html('DRAW!');
        // play a damn sound too
    }

    // called when the draw is finished by user 
    function drawMotionPerformed() {
        $('#draw-text').html('FIRE!');
    }

    // called when user successfully fires gun
    function fireTouchPerformed() {
        // should make a gun sound
        $('#draw-text').html('POW');

        // then send an event to the server
    }

});
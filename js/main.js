GameSimulation = {}; exports = GameSimulation;

(function(d, w) {

    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function callback() {
            window.setTimeout(callback, 1000 / 60);
        }

    var canvas = document.getElementById('gameCanvas'),
        ctx = canvas.getContext('2d'),
        ballRadius = 10,
        x = canvas.width / 2,
        y = canvas.height - 30,
        dx = 2,
        dy = -2,

        /* details for the paddle comes here*/
        paddleHeight = 10,
        paddleWidth = 75,
        paddleX = (canvas.width - paddleWidth) / 2,
        paddleY = canvas.height - paddleHeight,
        leftPressed = false,
        rightPressed = false;

    _Functions = {

        /**
         * Draw the ball on the game canvas
         */
        drawBall : function() {

            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();

            return _Functions;
        },

        drawPaddle : function() {

            ctx.beginPath();
            ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();

            return _Functions;
        },

        /**
         * Add bounds to the moving ball so that it remains inside the game canvas
         * Reverses the dx and dy factors
         */
        addBounds : function() {

            if(y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
                dy = -dy;
            }
            if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }

            return _Functions;
        },


        /**
         * Draw on the game canvas every 10 ms
         */
        draw : function() {

            window.requestAnimationFrame(_Functions.draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            _Functions.addBounds().drawBall().drawPaddle();

            /* Ball movements */
            x += dx;
            y += dy;

            /* Paddle movements */
            if(rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            }
            else if(leftPressed && paddleX > 0) {
                paddleX -= 7;
            }
        },

        keyDownHandler : function(e) {

            if(e.keyCode == 39) {
                rightPressed = true;
            }
            else if(e.keyCode == 37) {
                leftPressed = true;
            }

        },

        keyUpHandler : function(e) {

            if(e.keyCode == 39) {
                rightPressed = false;
            }
            else if(e.keyCode == 37) {
                leftPressed = false;
            }

        }
    }

    _Functions.draw();

    document.addEventListener('keydown', _Functions.keyDownHandler, false);
    document.addEventListener('keyup', _Functions.keyUpHandler, false);

})(document, window);
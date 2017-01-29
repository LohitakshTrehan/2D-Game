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

    /* parameters for the bricks comes here */
    var brickParams = {
        brickRowCount : 3,
        brickColumnCount : 5,
        brickWidth : 75,
        brickHeight : 20,
        brickPadding : 10,
        brickOffsetTop : 30,
        brickOffsetLeft : 30
    }
    var bricks = [];
    for(var c = 0 ; c < brickParams.brickColumnCount; c++ ) {
        bricks[c] = [];
        for(var r = 0; r < brickParams.brickRowCount; r++ ) {
            bricks[c][r] = {
                x : 0,
                y : 0,
                status : 1
            }
        }
    }

    var score = 0;

    _Functions = {

        /**
         * Draw the ball on the game canvas
         *
         * @return {{drawBall: _Functions.drawBall, drawPaddle: _Functions.drawPaddle, addBounds: _Functions.addBounds, draw: _Functions.draw, keyDownHandler: _Functions.keyDownHandler, keyUpHandler: _Functions.keyUpHandler}|*}
         */
        drawBall : function() {

            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();

            return _Functions;
        },

        /**
         * Draw the paddle on the canvas
         *
         * @return {{drawBall: _Functions.drawBall, drawPaddle: _Functions.drawPaddle, addBounds: _Functions.addBounds, draw: _Functions.draw, keyDownHandler: _Functions.keyDownHandler, keyUpHandler: _Functions.keyUpHandler}|*}
         */
        drawPaddle : function() {

            ctx.beginPath();
            ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();

            return _Functions;
        },

        /**
         * Draw Bricks on the canvas
         *
         * @return {{drawBall: _Functions.drawBall, drawPaddle: _Functions.drawPaddle, drawBricks: _Functions.drawBricks, addBounds: _Functions.addBounds, draw: _Functions.draw, keyDownHandler: _Functions.keyDownHandler, keyUpHandler: _Functions.keyUpHandler}|*}
         */
        drawBricks : function() {
            var count = 0;
            for(c = 0 ; c < brickParams.brickColumnCount; c++) {
                for(r = 0; r < brickParams.brickRowCount; r++) {
                    if(bricks[c][r].status == 1) {
                        brickX = (c * (brickParams.brickWidth + brickParams.brickPadding)) + brickParams.brickOffsetLeft;
                        brickY = (r * (brickParams.brickHeight + brickParams.brickPadding)) + brickParams.brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickParams.brickWidth, brickParams.brickHeight);
                        ctx.fillStyle = '#0095DD';
                        ctx.fill();
                        ctx.closePath();
                        count ++;
                    }
                }
            }
            console.log(count);
            return _Functions;
        },

        /**
         * Add bounds to the moving ball so that it remains inside the game canvas
         * Reverses the dx and dy factors
         *
         * @return {{drawBall: _Functions.drawBall, drawPaddle: _Functions.drawPaddle, addBounds: _Functions.addBounds, draw: _Functions.draw, keyDownHandler: _Functions.keyDownHandler, keyUpHandler: _Functions.keyUpHandler}|*}
         */
        addBounds : function() {

            if(y + dy < ballRadius) {
                dy = -dy;
            }
            else if(y + dy > canvas.height - ballRadius) {
                /*
                 * collision detection b/w the ball and the paddle
                 * check whether the center of the ball is b/w the left and the right edges of the paddle
                 */
                if(x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                }
                else {
                    alert("GAME OVER!");
                    document.location.reload();
                }
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
            /* clear the canvas with each frame */
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            _Functions.drawBricks();
            _Functions.drawBall();
            _Functions.drawPaddle();
            _Functions.collisionDetection();
            _Functions.addBounds();
            _Functions.drawScore();
            /* Paddle movements */
            if(rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            }
            else if(leftPressed && paddleX > 0) {
                paddleX -= 7;
            }

            /* Ball movements */
            x += dx;
            y += dy;

        },

        /**
         * Handles the key down event
         * @param { Object } e The event object for the key press event
         */
        keyDownHandler : function(e) {

            if(e.keyCode == 39) {
                rightPressed = true;
            }
            else if(e.keyCode == 37) {
                leftPressed = true;
            }

        },

        /**
         * Handles the key up event
         * @param { Object } e The event object for the key up event
         */
        keyUpHandler : function(e) {

            if(e.keyCode == 39) {
                rightPressed = false;
            }
            else if(e.keyCode == 37) {
                leftPressed = false;
            }

        },

        /**
         * Handles the mouse move event
         * @param { Object } e The event object for the mouse move event
         */
        mouseMoveHandler : function(e) {

            var relativeX = e.clientX - canvas.offsetLeft;
            if(relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth / 2;
            }
        },

        /**
         * Simply detects the collision b/w the brick and the ball
         * Not much effective but will work for the time
         */
        collisionDetection : function() {

            for(c = 0; c < brickParams.brickColumnCount; c++) {
                for(r = 0; r < brickParams.brickRowCount; r++) {
                    var b = bricks[c][r];
                    if(b.status == 1) {
                        if(x > b.x && x < b.x + brickParams.brickWidth && y > b.y && y < b.y + brickParams.brickHeight) {
                            dy = -dy;
                            b.status = 0;
                            score ++;
                            if(score == brickParams.brickRowCount * brickParams.brickColumnCount) {
                                alert('YOU WIN, CONGRATULATIONS!');
                                document.location.reload();
                            }
                        }
                    }
                }
            }
        },

        /**
         * Draw the user score on the canvas
         */
        drawScore : function() {
            ctx.font = "16px arial";
            ctx.fillStyle = '#0095DD';
            ctx.fillText("Score : " + score, 8, 20);
        }
    }

    _Functions.draw();

    document.addEventListener('keydown', _Functions.keyDownHandler, false);
    document.addEventListener('keyup', _Functions.keyUpHandler, false);
    document.addEventListener('mousemove', _Functions.mouseMoveHandler, false);

})(document, window);
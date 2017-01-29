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
        dy = -2;

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

        },


        /**
         * Draw on the game canvas every 10 ms
         */
        draw : function() {

            window.requestAnimationFrame(_Functions.draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            _Functions.addBounds();
            _Functions.drawBall();
            x += dx;
            y += dy;
        }
    }

    _Functions.draw();

})(document, window);
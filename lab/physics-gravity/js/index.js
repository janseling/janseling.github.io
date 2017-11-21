window.onload = function () {
    // v 单位 m/s
    // m 单位 kg
    var Space = function (canvas) {

        var _this = this,
            speed = 1,
            G = 6.67 * Math.pow(10, -11),
            mpp = 12742010;
            dots = [],
            interval = 80, // 间隔80毫秒
            ctx = canvas.getContext("2d");

        var center = {
            m: 5.965 * Math.pow(10, 24),
            x: parseInt(canvas.width / 2),
            y: parseInt(canvas.height / 2),
        }

        this.debug = false;
        this.running = true;

        this.drawDot = function (dot, size) { ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.closePath();

            // 画辅助线
            if (_this.debug) {
                if (dot.v && dot.vd) {
                    _this.drawGuide(dot.v / mpp / 100, dot.vd, dot, 'skyblue');
                }
                if (dot.a && dot.ad) {
                    _this.drawGuide((dot.a / mpp) * (interval / 1000) / 10, dot.ad, dot, 'yellow');
                }
            }
        };

        this.getPointFromVetor = function (scalar, angle) {
            var y = Math.sin(2 * Math.PI / 360 * angle) * scalar,
                x = Math.cos(2 * Math.PI / 360 * angle) * scalar;
            return {x: x, y: y};
        };

        this.drawGuide = function (scalar, angle, central, color) {
            if (angle < 0) {
                angle += 360;
            }
            var point = _this.getPointFromVetor(scalar, angle);
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.moveTo(central.x, central.y);
            ctx.lineTo(point.x + central.x, point.y + central.y);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        };

        this.addDot = function (x, y) {
            dots.push({
                x: x, y: y,
                a: 0, // v : 速度大小
                ad: 0, // 以自身为原点的角度表示速度方向(0-360)
                v: parseInt(Math.random() * 10000) * mpp, // 当前速度
                vd: Math.random() * 360, // 以自身为原点的角度表示速度方向
                m: parseInt(Math.random() * 100), // 质量
            });
        };

        this.sumVetors = function (vetor1, vetor2) {
            var angle = 0, scalar = 0;

            if (Math.abs(vetor1.angle - vetor2.angle) == 180) {
                scalar = Math.abs(vetor1.scalar - vetor2.scalar);
                angle = vetor1.scalar > vetor2.scalar ? vetor1.angle : vetor2.angle;
            } else {
                var point1 = _this.getPointFromVetor(vetor1.scalar, vetor1.angle),
                    point2 = _this.getPointFromVetor(vetor2.scalar, vetor2.angle),
                    x = point1.x + point2.x,
                    y = point1.y + point2.y;

                scalar = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                if (x == 0) {
                    angle = y < 0 ? 90 : 270;
                } else {
                    angle = parseFloat((Math.atan(y / x) * 180 / Math.PI).toFixed(10)) + (x < 0 ? 180 : (y < 0 ? 360 : 0));
                }
            }

            return {scalar:scalar, angle:angle};
        };

        this.move = function () {
            for (var i = 0; i < dots.length; i++) {
                // 1. 计算与 center 之间的加速度 a 和加速度方向 ad
                // 2. 计算加速度 a 在 interval 时间长度中形成的速度分量
                // 3. 将加速那的速度分量与本身速度 v 相加得出新的速度 v
                // 4. 按照 v 的速度和方向运动 interval 时间长度的距离
                // 5. 根据移动的距离和速度的方向，计算出坐标的偏移量
                var dot = dots[i],
                    dx = center.x - dot.x,
                    dy = center.y - dot.y,
                    a = center.m * G / (Math.pow(dx, 2) + Math.pow(dy, 2)),
                    dv = a * (interval / 1000),
                    angle = parseFloat((Math.atan(dy / dx) * 180 / Math.PI).toFixed(10)) + (dx < 0 ? 180 : (dy < 0 ? 360 : 0));

                // 把速度分到 x 和 y 轴上进行计算
                var newV = _this.sumVetors({scalar: dot.v, angle: dot.vd}, {scalar: dv, angle: angle});
                dot.a = a;
                dot.ad = angle;
                dot.v = newV.scalar;
                dot.vd = newV.angle;

                var distance = dot.v * (interval / 1000),
                    diff = _this.getPointFromVetor(distance, dot.vd);

                dot.x += (diff.x / mpp / 100);
                dot.y += (diff.y / mpp / 100);
            }
        };

        this.drawCenter = function () {
            _this.drawDot(center, 10);
        };

        this.run = function () {
            if (_this.running) {
                ctx.clearRect(0 ,0, canvas.width, canvas.height);
                _this.drawCenter();
                for (var i = 0; i < dots.length; i++) {
                    _this.drawDot(dots[i], 2);
                }
                _this.move();
            }
            setTimeout(_this.run, interval * speed);
        };

        this.bigBang = function () {
            _this.run();
        };

        this.runningToggle = function () {
            _this.running = !_this.running;
        };

        this.debugToggle = function () {
            _this.debug = !_this.debug;
        };

    };

    var canvas = document.getElementById('space');
    var space = new Space(canvas);
    space.bigBang();
    canvas.onclick = function (event) {
        space.addDot(event.clientX, event.clientY);
    };

    document.getElementById('toggle').onclick = function () {
        space.runningToggle();
        this.innerText = '运行:' + (space.running ? '开' : '关');
    };

    document.getElementById('debug').onclick = function () {
        space.debugToggle();
        this.innerText = '辅助:' + (space.debug ? '开' : '关');
        document.getElementById('desc').style.display = space.debug ? 'block' : 'none';
    };
};

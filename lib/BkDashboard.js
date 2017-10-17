'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//import COBI from 'https://cdn.cobi.bike/cobi.js/0.34.1/cobi.js';

var $ = window.$;

/**
 *
 */

var BkDashboard = function () {
    /**
     *
     */
    function BkDashboard(stageContainer, stageWidth, stageHeight) {
        _classCallCheck(this, BkDashboard);

        // let view = new View();

        this.version = '0.0.5';

        this.localStorageAvailable = typeof Storage !== 'undefined';

        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.stageContainer = stageContainer;

        this.arcX = 0;
        this.arcY = 0;
        this.acrToBackground = 5;

        //Speed
        this.maxSpeed = 0;
        this.maxSpeedCeiling = 20;
        this.maxSpeedCeilingBufer = 5;
        this.averageSpeed = 0;
        this.averageSpeedMultiplier = 10;
        this.checkSpeedInterval = 1000;
        this.checkSpeedIntervalObject = null;
        this.lastSpeedUpdate = 0;

        this.speedArcWidth = this.stageWidth / 20;
        this.speedArcInnerRadius = this.stageWidth / 2.5;
        this.speedArcOuterRadius = this.speedArcInnerRadius - this.speedArcWidth;

        //Cadence
        this.maxCadence = 0;
        this.maxCadenceCeiling = 50;
        this.maxCadenceCeilingBuffer = 10;
        this.averageCadence = 0;
        this.averageCadenceMultiplier = 100;
        this.averageCadenceInterval = 1000;
        this.averageCadenceIntervalObject = null;
        this.lastCadenceUpdate = 0;

        this.checkCadenceInterval = 1000;
        this.checkCadenceIntervalObject = null;

        this.cadenceArcInnerRadius = this.speedArcInnerRadius - 55;
        this.cadenceArcOuterRadius = this.speedArcOuterRadius - 25;
    }

    /**
     *
     */


    _createClass(BkDashboard, [{
        key: 'initView',
        value: function initView() {
            this.stage = new Konva.Stage({
                container: this.stageContainer,
                width: this.stageWidth,
                height: this.stageHeight
            });

            this.arcX = this.stageWidth / 2;
            this.arcY = this.stageHeight - this.stageHeight * 0.1;

            this.layer = new Konva.Layer();

            this.mask = new Konva.Group({
                clip: {
                    x: 0,
                    y: 0,
                    width: this.stageWidth,
                    height: this.arcY
                }
            });

            this.speedArcBackground = new Konva.Arc({
                x: this.arcX,
                y: this.arcY,
                innerRadius: this.speedArcInnerRadius + this.acrToBackground,
                outerRadius: this.speedArcOuterRadius - this.acrToBackground,
                angle: 180,
                fill: '#444353',
                rotation: 180
            });

            this.curSpeedArc = new Konva.Arc({
                x: this.arcX,
                y: this.arcY,
                innerRadius: this.speedArcInnerRadius,
                outerRadius: this.speedArcOuterRadius,
                angle: 180,
                fill: '#00C8E6',
                shadowEnabled: true,
                shadowBlur: 10,
                shadowColor: '#00C8E6'
            });

            this.averageSpeedArc = new Konva.Arc({
                x: this.arcX,
                y: this.arcY,
                innerRadius: this.speedArcInnerRadius + this.acrToBackground + 10,
                outerRadius: this.speedArcOuterRadius - this.acrToBackground,
                angle: 2,
                opacity: 0.9,
                fill: '#FFF',
                shadowEnabled: true,
                shadowBlur: 10,
                shadowColor: '#FFF'
            });

            this.averageCadenceArc = new Konva.Arc({
                x: this.arcX,
                y: this.arcY,
                innerRadius: this.cadenceArcInnerRadius + this.acrToBackground,
                outerRadius: this.cadenceArcOuterRadius - this.acrToBackground,
                angle: 2,
                opacity: 0.9,
                fill: '#FFF',
                shadowEnabled: true,
                shadowBlur: 10,
                shadowColor: '#FFF'
            });

            this.cadenceArcBackground = new Konva.Arc({
                x: this.arcX,
                y: this.arcY,
                innerRadius: this.cadenceArcInnerRadius + this.acrToBackground,
                outerRadius: this.cadenceArcOuterRadius - this.acrToBackground,
                angle: 180,
                fill: '#444353',
                rotation: 180
            });

            this.curCadenceArc = new Konva.Arc({
                x: this.arcX,
                y: this.arcY,
                innerRadius: this.cadenceArcInnerRadius,
                outerRadius: this.cadenceArcOuterRadius,
                angle: 180,
                fill: '#00C8E6',
                shadowEnabled: true,
                shadowBlur: 10,
                shadowColor: '#00C8E6'
            });

            var width = this.stageWidth / 1.1;

            this.bottomBar = new Konva.Shape({
                sceneFunc: function sceneFunc(context) {

                    var height = 70;
                    var curveWidth = 80;
                    var curveRadius = 30;

                    context.beginPath();
                    context.moveTo(0, height);
                    context.quadraticCurveTo(curveWidth - curveRadius, 0, curveWidth, 0);
                    context.lineTo(width, 0);
                    context.quadraticCurveTo(width + curveRadius, 0, width + curveWidth, height);
                    context.lineTo(0, height);
                    context.closePath();
                    context.fillStrokeShape(this);
                },
                fill: '#FFF',
                x: -12,
                y: this.arcY
            });

            this.mask.add(this.speedArcBackground);
            this.mask.add(this.cadenceArcBackground);

            this.mask.add(this.curSpeedArc);
            this.mask.add(this.averageSpeedArc);

            this.mask.add(this.curCadenceArc);
            this.mask.add(this.averageCadenceArc);

            this.layer.add(this.mask);
            this.layer.add(this.bottomBar);

            this.stage.add(this.layer);

            $('#version').text(this.version);
        }
    }, {
        key: 'initAverageSpeedView',
        value: function initAverageSpeedView() {
            this.setMaxSpeed(this.getMaxSpeed());
            this.updateAverageSpeedView(this.getAvrSpeed(), true);
        }
    }, {
        key: 'initAverageCadenceView',
        value: function initAverageCadenceView() {
            var _this = this;

            this.setMaxCadence(this.getMaxCadence());
            this.updateAverageCadenceView(this.getAvrCadence(), true);

            if (this.averageCadenceIntervalObject === null) {
                this.averageCadenceIntervalObject = setInterval(function () {
                    _this.updateAverageCadenceView(_this.getAvrCadence(), false);
                }, this.averageCadenceInterval);
            }
        }
    }, {
        key: 'initSpeedCheck',
        value: function initSpeedCheck() {
            var _this2 = this;

            if (this.checkSpeedIntervalObject === null) {
                this.checkSpeedIntervalObject = setInterval(function () {
                    if (Date.now().toString() - _this2.lastSpeedUpdate > _this2.checkSpeedInterval) {
                        _this2.updateCurrentSpeedView(0);
                    }
                }, this.checkSpeedInterval);
            }
        }
    }, {
        key: 'initCadenceCheck',
        value: function initCadenceCheck() {
            var _this3 = this;

            if (this.checkCadenceIntervalObject === null) {
                this.checkCadenceIntervalObject = setInterval(function () {
                    if (Date.now().toString() - _this3.lastCadenceUpdate > _this3.checkCadenceInterval) {
                        _this3.updateCurrentCadenceView(0);
                    }
                }, this.checkCadenceInterval);
            }
        }

        /**
         * @param  speed
         */

    }, {
        key: 'updateCurrentSpeedView',
        value: function updateCurrentSpeedView(speed) {
            this.lastSpeedUpdate = Date.now().toString();

            speed = this.round(speed);

            this.setMaxSpeed(speed);

            var opacity = 1;
            if (speed === 0) {
                opacity = 0;
            }

            var tween = new Konva.Tween({
                node: this.curSpeedArc,
                rotation: this.calculateSpeedBasedRotation(speed),
                easing: Konva.Easings.EaseInOut,
                duration: 0.5,
                opacity: opacity
            });

            tween.play();

            $('#speed').text(speed + ' > ' + this.averageSpeed + ' - (' + this.maxSpeed + '/' + this.maxSpeedCeiling + ')');
        }
    }, {
        key: 'updateCurrentCadenceView',
        value: function updateCurrentCadenceView(cadence) {
            this.lastCadenceUpdate = Date.now().toString();

            cadence = this.round(cadence);

            this.setMaxCadence(cadence);
            this.setAvrCadence(cadence);

            var opacity = 1;
            if (cadence === 0) {
                opacity = 0;
            }

            var tween = new Konva.Tween({
                node: this.curCadenceArc,
                rotation: this.calculateCadenceBasedRotation(cadence),
                easing: Konva.Easings.EaseInOut,
                duration: 0.5,
                opacity: opacity
            });

            tween.play();

            $('#cadence').text(cadence + ' > ' + this.averageCadence + ' - (' + this.maxCadence + '/' + this.maxCadenceCeiling + ')');
        }
    }, {
        key: 'updateAverageSpeedView',
        value: function updateAverageSpeedView(speed) {
            var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            speed = this.round(speed);

            this.setAvrSpeed(speed);

            var duration = 0.5;
            if (initial === true) {
                duration = 5;
            }

            var rotation = 0;
            if (speed !== 0) {
                rotation = this.calculateSpeedBasedRotation(speed) + 180;
            }

            var tween = new Konva.Tween({
                node: this.averageSpeedArc,
                rotation: rotation,
                easing: Konva.Easings.EaseInOut,
                duration: duration
            });

            tween.play();
        }
    }, {
        key: 'updateAverageCadenceView',
        value: function updateAverageCadenceView(cadence) {
            var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            cadence = this.round(cadence);

            this.setAvrCadence(cadence);

            var duration = 0.5;
            if (initial === true) {
                duration = 5;
            }

            var rotation = 0;
            if (cadence !== 0) {
                rotation = this.calculateCadenceBasedRotation(cadence) + 180;
            }

            var tween = new Konva.Tween({
                node: this.averageCadenceArc,
                rotation: rotation,
                easing: Konva.Easings.EaseInOut,
                duration: duration
            });

            tween.play();
        }
    }, {
        key: 'calculateSpeedBasedRotation',
        value: function calculateSpeedBasedRotation(speed) {
            var factor = 100 / this.maxSpeedCeiling * speed;

            return 180 / 100 * factor;
        }
    }, {
        key: 'calculateCadenceBasedRotation',
        value: function calculateCadenceBasedRotation(cadence) {
            var factor = 100 / this.maxCadenceCeiling * cadence;

            return 180 / 100 * factor;
        }
    }, {
        key: 'setAvrSpeed',
        value: function setAvrSpeed(speed) {
            if (this.averageSpeed === null) {
                this.averageSpeed = speed;
            }

            if (speed > 0) {
                speed = (this.averageSpeed * (this.averageSpeedMultiplier - 1) + speed) / this.averageSpeedMultiplier;

                speed = this.round(speed);

                if (this.averageSpeed !== speed) {
                    this.averageSpeed = speed;
                    this.storeItem('averageSpeed', this.averageSpeed);
                }
            }
        }
    }, {
        key: 'setAvrCadence',
        value: function setAvrCadence(cadence) {
            if (this.averageCadence === null) {
                this.averageCadence = cadence;
            }

            if (cadence > 0) {
                cadence = (this.averageCadence * (this.averageCadenceMultiplier - 1) + cadence) / this.averageCadenceMultiplier;

                cadence = this.round(cadence);

                if (this.averageCadence !== cadence) {
                    this.averageCadence = cadence;
                    this.storeItem('averageCadence', this.averageCadence);
                }
            }
        }
    }, {
        key: 'getAvrSpeed',
        value: function getAvrSpeed() {
            if (this.localStorageAvailable === true) {
                var value = localStorage.getItem('averageSpeed');

                if (typeof value !== 'undefined') {
                    this.averageSpeed = value;
                }
            }

            return this.averageSpeed;
        }
    }, {
        key: 'getAvrCadence',
        value: function getAvrCadence() {
            if (this.localStorageAvailable === true) {
                var value = localStorage.getItem('averageCadence');

                if (typeof value !== 'undefined') {
                    this.averageCadence = value;
                }
            }

            return this.averageCadence;
        }
    }, {
        key: 'setMaxSpeed',
        value: function setMaxSpeed(speed) {
            if (speed > this.maxSpeedCeiling) {
                this.maxSpeed = this.round(speed);
                this.maxSpeedCeiling = Math.ceil(this.maxSpeed / this.maxSpeedCeilingBufer) * this.maxSpeedCeilingBufer;

                if (this.maxSpeed === this.maxSpeedCeiling) {
                    this.maxSpeedCeiling += 5;
                }

                this.storeItem('maxSpeed', this.maxSpeed);
                this.storeItem('maxSpeedCeiling', this.maxSpeedCeiling);
            }
        }
    }, {
        key: 'getMaxSpeed',
        value: function getMaxSpeed() {
            if (this.localStorageAvailable === true) {
                var value = localStorage.getItem('maxSpeed');

                if (typeof value !== 'undefined') {
                    this.maxSpeed = value;
                }
            } else {
                this.maxSpeed = this.getAvrSpeed();
            }

            return this.maxSpeed;
        }
    }, {
        key: 'setMaxCadence',
        value: function setMaxCadence(cadence) {
            if (cadence > this.maxCadenceCeiling) {
                this.maxCadence = this.round(cadence);
                this.maxCadenceCeiling = Math.ceil(this.maxCadence / this.maxCadenceCeilingBuffer) * this.maxCadenceCeilingBuffer;

                if (this.maxCadence === this.maxCadenceCeiling) {
                    this.maxCadenceCeiling += this.maxCadenceCeilingBuffer;
                }

                this.storeItem('maxCadence', this.maxCadence);
                this.storeItem('maxCadenceCeiling', this.maxCadenceCeiling);
            }
        }
    }, {
        key: 'getMaxCadence',
        value: function getMaxCadence() {
            if (this.localStorageAvailable === true) {
                var value = localStorage.getItem('maxCadence');

                if (typeof value !== 'undefined') {
                    this.maxCadence = value;
                }
            } else {
                this.maxCadence = this.getAvrCadence();
            }

            return this.maxCadence;
        }
    }, {
        key: 'round',
        value: function round(value) {
            return Math.round(value * 10) / 10;
        }
    }, {
        key: 'storeItem',
        value: function storeItem(key, value) {
            if (this.localStorageAvailable === true) {
                localStorage.setItem(key, value);
            }
        }
    }]);

    return BkDashboard;
}();
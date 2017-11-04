import Core from './core';
import Dashboard from '../dashboard';

//import * as Konva from 'konva';
declare let Konva: any;

/**
 *
 */
export default class View {

    private core: Core = null;

    private stageWidth: number;
    private stageHeight: number;
    private stageContainer: string;

    private arcX: number = 0;
    private arcY: number = 0;
    private acrToBackground: number = 5;

    private checkSpeedInterval: number = 1000;
    private checkSpeedIntervalObject = null;
    private lastSpeedUpdate: number = 0;

    private speedArcWidth: number;
    private speedArcInnerRadius: number;
    private speedArcOuterRadius: number;

    private averageCadenceInterval: number = 1000;
    private averageCadenceIntervalObject = null;
    private lastCadenceUpdate: number = 0;

    private checkCadenceInterval: number = 1000;
    private checkCadenceIntervalObject = null;

    private cadenceArcInnerRadius: number;
    private cadenceArcOuterRadius: number;

    private stage;
    private layer;
    private mask;

    private speedArcBackground;
    private curSpeedArc;
    private averageSpeedArc;
    private averageCadenceArc;
    private cadenceArcBackground;
    private curCadenceArc;
    private bottomBar;

    /**
     *
     */
    constructor(core: Core, stageContainer: string, stageWidth: number, stageHeight: number) {
        this.core = core;

        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.stageContainer = stageContainer;

        this.speedArcWidth = this.stageWidth / 20;
        this.speedArcInnerRadius = this.stageWidth / 2.5;
        this.speedArcOuterRadius = this.speedArcInnerRadius - this.speedArcWidth;

        this.cadenceArcInnerRadius = this.speedArcInnerRadius - 55;
        this.cadenceArcOuterRadius = this.speedArcOuterRadius - 25;
    }

    /**
     *
     */
    initView() {
        this.stage =
            new Konva.Stage(
                {
                    container: this.stageContainer,
                    width: this.stageWidth,
                    height: this.stageHeight
                }
            );

        this.arcX = this.stageWidth / 2;
        this.arcY = this.stageHeight - this.stageHeight * 0.1;

        this.layer = new Konva.Layer();

        this.mask =
            new Konva.Group(
                {

                    clip: {
                        x: 0,
                        y: 0,
                        width: this.stageWidth,
                        height: this.arcY
                    }

                }
            );

        this.speedArcBackground =
            new Konva.Arc(
                {
                    x: this.arcX,
                    y: this.arcY,
                    innerRadius: this.speedArcInnerRadius + this.acrToBackground,
                    outerRadius: this.speedArcOuterRadius - this.acrToBackground,
                    angle: 180,
                    fill: '#444353',
                    rotation: 180
                }
            );

        this.curSpeedArc =
            new Konva.Arc(
                {
                    x: this.arcX,
                    y: this.arcY,
                    innerRadius: this.speedArcInnerRadius,
                    outerRadius: this.speedArcOuterRadius,
                    angle: 180,
                    fill: '#00C8E6',
                    shadowEnabled: true,
                    shadowBlur: 10,
                    shadowColor: '#00C8E6'
                }
            );

        this.averageSpeedArc =
            new Konva.Arc(
                {
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
                }
            );

        this.averageCadenceArc =
            new Konva.Arc(
                {
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
                }
            );

        this.cadenceArcBackground =
            new Konva.Arc(
                {
                    x: this.arcX,
                    y: this.arcY,
                    innerRadius: this.cadenceArcInnerRadius + this.acrToBackground,
                    outerRadius: this.cadenceArcOuterRadius - this.acrToBackground,
                    angle: 180,
                    fill: '#444353',
                    rotation: 180
                }
            );

        this.curCadenceArc =
            new Konva.Arc(
                {
                    x: this.arcX,
                    y: this.arcY,
                    innerRadius: this.cadenceArcInnerRadius,
                    outerRadius: this.cadenceArcOuterRadius,
                    angle: 180,
                    fill: '#00C8E6',
                    shadowEnabled: true,
                    shadowBlur: 10,
                    shadowColor: '#00C8E6'
                }
            );

        let width = this.stageWidth / 1.1;

        this.bottomBar =
            new Konva.Shape(
                {
                    sceneFunc: function (context) {

                        let height = 70;
                        let curveWidth = 80;
                        let curveRadius = 30;

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
                    y: this.arcY,
                }
            );

        this.mask.add(this.speedArcBackground);
        this.mask.add(this.cadenceArcBackground);

        this.mask.add(this.curSpeedArc);
        this.mask.add(this.averageSpeedArc);

        this.mask.add(this.curCadenceArc);
        this.mask.add(this.averageCadenceArc);

        this.layer.add(this.mask);
        this.layer.add(this.bottomBar);

        this.stage.add(this.layer);

        document.getElementById('version').innerHTML = Dashboard.getVersion();
    }

    /**
     *
     */
    initAverageSpeedView() {
        this.core.setMaxSpeed(this.core.getMaxSpeed());
        this.updateAverageSpeedView(this.core.getAvrSpeed(), true);
    }

    /**
     *
     */
    initAverageCadenceView() {
        this.core.setMaxCadence(this.core.getMaxCadence());
        this.updateAverageCadenceView(this.core.getAvrCadence(), true);

        if (this.averageCadenceIntervalObject === null) {
            this.averageCadenceIntervalObject =
                setInterval(() => {
                    this.updateAverageCadenceView(this.core.getAvrCadence(), false);
                }, this.averageCadenceInterval);
        }
    }

    /**
     *
     */
    initSpeedCheck() {
        if (this.checkSpeedIntervalObject === null) {
            this.checkSpeedIntervalObject =
                setInterval(() => {
                    if (new Date().getTime() - this.lastSpeedUpdate >
                        this.checkSpeedInterval) {
                        this.updateCurrentSpeedView(0);
                    }
                }, this.checkSpeedInterval);
        }
    }

    /**
     *
     */
    initCadenceCheck() {
        if (this.checkCadenceIntervalObject === null) {
            this.checkCadenceIntervalObject =
                setInterval(() => {
                    if (new Date().getTime() - this.lastCadenceUpdate >
                        this.checkCadenceInterval) {
                        this.updateCurrentCadenceView(0);
                    }
                }, this.checkCadenceInterval);
        }
    }

    /**
     * @param {number} speed
     */
    updateCurrentSpeedView(speed: number) {
        this.lastSpeedUpdate = new Date().getTime();

        speed = Core.round(speed);

        this.core.setMaxSpeed(speed);

        let opacity = 1;
        if (speed === 0) {
            opacity = 0;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.curSpeedArc,
                    rotation: this.core.calculateSpeedBasedRotation(speed),
                    easing: Konva.Easings.EaseInOut,
                    duration: 0.5,
                    opacity: opacity
                }
            );

        tween.play();

        document.getElementById('speed').innerHTML =
            speed + ' > ' + this.core.getAvrSpeed() + ' - (' + this.core.getMaxSpeed() + '/' + this.core.getMaxSpeedCeiling() + ')';
    }

    /**
     * @param {number} cadence
     */
    updateCurrentCadenceView(cadence: number) {
        this.lastCadenceUpdate = new Date().getTime();

        cadence = Core.round(cadence);

        this.core.setMaxCadence(cadence);
        this.core.setAvrCadence(cadence);

        let opacity = 1;
        if (cadence === 0) {
            opacity = 0;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.curCadenceArc,
                    rotation: this.core.calculateCadenceBasedRotation(cadence),
                    easing: Konva.Easings.EaseInOut,
                    duration: 0.5,
                    opacity: opacity
                }
            );

        tween.play();

        document.getElementById('cadence').innerHTML =
            cadence + ' > ' + this.core.getAvrCadence() + ' - (' + this.core.getMaxCadence() + '/' + this.core.getMaxCadenceCeiling() + ')';
    }

    /**
     * @param {number} speed
     * @param {boolean} initial
     */
    updateAverageSpeedView(speed: number, initial: boolean = false) {
        speed = Core.round(speed);

        this.core.setAvrSpeed(speed);

        let duration = 0.5;
        if (initial === true) {
            duration = 5;
        }

        let rotation = 0;
        if (speed !== 0) {
            rotation = this.core.calculateSpeedBasedRotation(speed) + 180;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.averageSpeedArc,
                    rotation: rotation,
                    easing: Konva.Easings.EaseInOut,
                    duration: duration,
                }
            );

        tween.play();
    }

    /**
     * @param {number} cadence
     * @param {boolean} initial
     */
    updateAverageCadenceView(cadence: number, initial: boolean = false) {
        cadence = Core.round(cadence);

        this.core.setAvrCadence(cadence);

        let duration = 0.5;
        if (initial === true) {
            duration = 5;
        }

        let rotation = 0;
        if (cadence !== 0) {
            rotation = this.core.calculateCadenceBasedRotation(cadence) + 180;
        }

        let tween =
            new Konva.Tween(
                {
                    node: this.averageCadenceArc,
                    rotation: rotation,
                    easing: Konva.Easings.EaseInOut,
                    duration: duration,
                }
            );

        tween.play();
    }
}

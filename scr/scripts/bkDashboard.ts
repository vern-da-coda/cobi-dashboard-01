import Core from './modules/core';
import View from './modules/view';

/**
 *
 */
export default class BkDashboard {

    private static version: string = '0.0.8';

    private core: Core = null;
    private view: View = null;

    /**
     *
     */
    constructor(stageContainer, stageWidth, stageHeight) {
        this.core = new Core();
        this.view = new View(this.core, stageContainer, stageWidth, stageHeight);
    }

    /**
     *
     */
    initView() {
        this.view.initView();
    }

    /**
     *
     */
    initAverageSpeedView() {
        this.view.initAverageSpeedView();
    }

    /**
     *
     */
    initAverageCadenceView() {
        this.view.initAverageCadenceView();
    }

    /**
     *
     */
    initSpeedCheck() {
        this.view.initSpeedCheck();
    }

    /**
     *
     */
    initCadenceCheck() {
        this.view.initCadenceCheck();
    }

    /**
     *
     * @param {number} speed
     */
    updateCurrentSpeedView(speed: number) {
        this.view.updateCurrentSpeedView(speed);
    }

    /**
     *
     * @param {number} cadence
     */
    updateCurrentCadenceView(cadence: number) {
        this.view.updateCurrentCadenceView(cadence);
    }

    /**
     *
     * @param {number} speed
     * @param {boolean} initial
     */
    updateAverageSpeedView(speed: number, initial: boolean = false) {
        this.view.updateAverageSpeedView(speed, initial);
    }

    /**
     *
     * @returns {string}
     */
    static getVersion() {
        return this.version;
    }
}

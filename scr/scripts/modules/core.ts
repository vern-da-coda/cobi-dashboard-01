/**
 *
 */
export default class Core {

    private localStorageAvailable: boolean = false;

    private maxSpeed: number = 0;
    private maxSpeedCeiling: number = 20;
    private maxSpeedCeilingBuffer: number = 5;
    private averageSpeed: number = 0;
    private averageSpeedMultiplier: number = 10;

    private maxCadence: number = 0;
    private maxCadenceCeiling: number = 50;
    private maxCadenceCeilingBuffer: number = 10;
    private averageCadence: number = 0;
    private averageCadenceMultiplier: number = 100;

    /**
     *
     */
    constructor() {
        this.localStorageAvailable =
            (
                typeof(
                    Storage) !== 'undefined');
    }

    /**
     * @param {number} speed
     * @returns {number}
     */
    calculateSpeedBasedRotation(speed: number): number {
        let factor = (
            100 / this.maxSpeedCeiling) * speed;

        return (
            180 / 100) * factor;
    }

    /**
     * @param {number} cadence
     * @returns {number}
     */
    calculateCadenceBasedRotation(cadence: number): number {
        let factor = (
            100 / this.maxCadenceCeiling) * cadence;

        return (
            180 / 100) * factor;
    }

    /**
     * @param {number} speed
     */
    setAvrSpeed(speed: number) {
        if (this.averageSpeed === null) {
            this.averageSpeed = speed;
        }

        if (speed > 0) {
            speed =
                (
                    (
                        this.averageSpeed * (
                        this.averageSpeedMultiplier - 1)) + speed) / this.averageSpeedMultiplier;

            speed = Core.round(speed);

            if (this.averageSpeed !== speed) {
                this.averageSpeed = speed;
                this.storeItem('averageSpeed', this.averageSpeed);
            }
        }
    }

    /**
     * @param {number} cadence
     */
    setAvrCadence(cadence: number) {
        if (this.averageCadence === null) {
            this.averageCadence = cadence;
        }

        if (cadence > 0) {
            cadence =
                (
                    (
                        this.averageCadence * (
                        this.averageCadenceMultiplier - 1)) + cadence) / this.averageCadenceMultiplier;

            cadence = Core.round(cadence);

            if (this.averageCadence !== cadence) {
                this.averageCadence = cadence;
                this.storeItem('averageCadence', this.averageCadence);
            }
        }
    }

    /**
     * @returns {number}
     */
    getAvrSpeed(): number {
        if (this.localStorageAvailable === true) {
            let value = localStorage.getItem('averageSpeed');

            if (typeof(
                    value) !== 'undefined') {
                this.averageSpeed = value;
            }
        }

        return this.averageSpeed;
    }

    /**
     * @returns {number}
     */
    getAvrCadence(): number {
        if (this.localStorageAvailable === true) {
            let value = localStorage.getItem('averageCadence');

            if (typeof(
                    value) !== 'undefined') {
                this.averageCadence = value;
            }
        }

        return this.averageCadence;
    }

    /**
     * @param {number} speed
     */
    setMaxSpeed(speed: number) {
        if (speed > this.maxSpeedCeiling) {
            this.maxSpeed = Core.round(speed);
            this.maxSpeedCeiling = Math.ceil(this.maxSpeed / this.maxSpeedCeilingBuffer) * this.maxSpeedCeilingBuffer;

            if (this.maxSpeed === this.maxSpeedCeiling) {
                this.maxSpeedCeiling += 5;
            }

            this.storeItem('maxSpeed', this.maxSpeed);
            this.storeItem('maxSpeedCeiling', this.maxSpeedCeiling);
        }
    }

    /**
     * @returns {number}
     */
    getMaxSpeed(): number {
        if (this.localStorageAvailable === true) {
            let value = localStorage.getItem('maxSpeed');

            if (typeof(
                    value) !== 'undefined') {
                this.maxSpeed = value;
            }
        }
        else {
            this.maxSpeed = this.getAvrSpeed();
        }

        return this.maxSpeed;
    }

    /**
     * @returns {number}
     */
    getMaxSpeedCeiling() {
        return this.maxCadenceCeiling;
    }

    /**
     * @param {number} cadence
     */
    setMaxCadence(cadence: number) {
        if (cadence > this.maxCadenceCeiling) {
            this.maxCadence = Core.round(cadence);
            this.maxCadenceCeiling = Math.ceil(this.maxCadence / this.maxCadenceCeilingBuffer) * this.maxCadenceCeilingBuffer;

            if (this.maxCadence === this.maxCadenceCeiling) {
                this.maxCadenceCeiling += this.maxCadenceCeilingBuffer;
            }

            this.storeItem('maxCadence', this.maxCadence);
            this.storeItem('maxCadenceCeiling', this.maxCadenceCeiling);
        }
    }

    /**
     * @returns {number}
     */
    getMaxCadence(): number {
        if (this.localStorageAvailable === true) {
            let value = localStorage.getItem('maxCadence');

            if (typeof(
                    value) !== 'undefined') {
                this.maxCadence = value;
            }
        }
        else {
            this.maxCadence = this.getAvrCadence();
        }

        return this.maxCadence;
    }

    /**
     * @returns {number}
     */
    getMaxCadenceCeiling() {
        return this.maxCadenceCeiling;
    }

    /**
     * @param {number} value
     * @returns {number}
     */
    static round(value: number): number {
        return Math.round(value * 10) / 10;
    }


    /**
     *
     * @param {number} value
     * @returns {string}
     */
    static decimal(value: number): string {
        return value.toFixed(1);
    }


    /**
     * @param {string} key
     * @param {number} value
     */
    storeItem(key: string, value: any) {
        if (this.localStorageAvailable === true) {
            localStorage.setItem(key, value);
        }
    }
}

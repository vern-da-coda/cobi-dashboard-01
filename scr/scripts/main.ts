import BkDashboard from './bkDashboard'

declare let COBI: any;

COBI.init('token — can by anything right now');

let BkD = new BkDashboard('container', window.innerWidth, window.innerHeight);

BkD.initView();

BkD.initAverageSpeedView();
BkD.initAverageCadenceView();

BkD.initSpeedCheck();
BkD.initCadenceCheck();

COBI.rideService.speed.subscribe(
    function (value) {
        BkD.updateCurrentSpeedView(value * 3.6);
    }
);

COBI.tourService.averageSpeed.subscribe(
    function (value) {
        BkD.updateAverageSpeedView(value * 3.6);
    }
);

COBI.rideService.cadenceAvailability.subscribe(
    function (value) {
        console.log('cadence available: ' + value);
    }
);

COBI.rideService.cadence.subscribe(
    function (value) {
        BkD.updateCurrentCadenceView(value);
    }
);

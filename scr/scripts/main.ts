import BkDashboard from './dashboard'

declare let COBI: any;

let Dashboard = new BkDashboard('container', window.innerWidth, window.innerHeight);

Dashboard.initView();

Dashboard.initAverageSpeedView();
Dashboard.initAverageCadenceView();

Dashboard.initSpeedCheck();
Dashboard.initCadenceCheck();

COBI.init('token — can by anything right now');

COBI.app.theme.subscribe(
    function (value) {
        console.log(value)
    }
);

COBI.rideService.speed.subscribe(
    function (value) {
        Dashboard.updateCurrentSpeedView(value * 3.6);
    }
);

COBI.tourService.averageSpeed.subscribe(
    function (value) {
        Dashboard.updateAverageSpeedView(value * 3.6);
    }
);

COBI.rideService.cadenceAvailability.subscribe(
    function (value) {
        console.log('cadence available: ' + value);
    }
);

COBI.rideService.cadence.subscribe(
    function (value) {
        Dashboard.updateCurrentCadenceView(value);
    }
);

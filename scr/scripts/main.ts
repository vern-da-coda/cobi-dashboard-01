import Dashboard from "./dashboard";

declare let COBI: any;

let dashboard = new Dashboard('container', window.innerWidth, window.innerHeight);

dashboard.initView();

dashboard.initAverageSpeedView();
dashboard.initAverageCadenceView();

dashboard.initSpeedCheck();
dashboard.initCadenceCheck();

COBI.init('token — can by anything right now');

COBI.app.theme.subscribe(
    function (value) {
        console.log(value)
    }
);

COBI.rideService.speed.subscribe(
    function (value) {
        dashboard.updateCurrentSpeedView(value * 3.6);
    }
);

COBI.tourService.averageSpeed.subscribe(
    function (value) {
        dashboard.updateAverageSpeedView(value * 3.6);
    }
);

COBI.rideService.cadenceAvailability.subscribe(
    function (value) {
        console.log('cadence available: ' + value);
    }
);

COBI.rideService.cadence.subscribe(
    function (value) {
        dashboard.updateCurrentCadenceView(value);
    }
);

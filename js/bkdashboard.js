class BkDashboard
{
    /**
     *
     */
    constructor()
    {
        this.version = '0.0.4';
        
        this.localStorageAvailable =
            (
                typeof(
                    Storage) !== 'undefined');
        
        this.stageWidth = $(window).width();
        this.stageHeight = $(window).height();
        
        this.speedArcWidth = this.stageWidth / 20;
        
        this.speedArcInnerRadius = this.stageWidth / 2.5;
        this.speedArcOuterRadius = this.speedArcInnerRadius - this.speedArcWidth;
        
        this.cadenceArcInnerRadius = this.speedArcInnerRadius - 55;
        this.cadenceArcOuterRadius = this.speedArcOuterRadius - 25;
        
        this.arcX = 0;
        this.arcY = 0;
        
        this.acrToBackground = 5;
        
        this.maxSpeed = 0;
        this.maxSpeedCeiling = 20;
        
        this.averageSpeed = 0;
        this.averageCadence = 0;
        
        this.lastSpeedUpdate = 0;
        this.checkSpeedInterval = 1000;
        this.checkSpeedIntervalObject = null;
        
        this.lastCadenceUpdate = 0;
        this.checkCadenceInterval = 1000;
        this.checkCadenceIntervalObject = null;
        
        this.averageCadenceInterval = 1000;
        this.averageCadenceIntervalObject = null;
        
        this.maxCadence = 0;
        this.maxCadenceCeiling = 50;
        
        this.lastCadenceUpdate = 0;
    }
    
    /**
     *
     */
    initView()
    {
        this.stage =
            new Konva.Stage(
                {
                    container: 'container',
                    width:     this.stageWidth,
                    height:    this.stageHeight
                }
            );
        
        this.arcX = this.stageWidth / 2;
        this.arcY = this.stageHeight - this.stageHeight * 0.1;
        
        this.layer = new Konva.Layer();
        
        this.mask =
            new Konva.Group(
                {
                    clip: {
                        x:      0,
                        y:      0,
                        width:  this.stageWidth,
                        height: this.arcY
                    }
                }
            );
        
        this.speedArcBackground =
            new Konva.Arc(
                {
                    x:           this.arcX,
                    y:           this.arcY,
                    innerRadius: this.speedArcInnerRadius + this.acrToBackground,
                    outerRadius: this.speedArcOuterRadius - this.acrToBackground,
                    angle:       180,
                    fill:        '#444353',
                    rotation:    180
                }
            );
        
        this.curSpeedArc =
            new Konva.Arc(
                {
                    x:             this.arcX,
                    y:             this.arcY,
                    innerRadius:   this.speedArcInnerRadius,
                    outerRadius:   this.speedArcOuterRadius,
                    angle:         180,
                    fill:          '#00C8E6',
                    shadowEnabled: true,
                    shadowBlur:    10,
                    shadowColor:   '#00C8E6'
                }
            );
        
        this.averageSpeedArc =
            new Konva.Arc(
                {
                    x:             this.arcX,
                    y:             this.arcY,
                    innerRadius:   this.speedArcInnerRadius + this.acrToBackground + 10,
                    outerRadius:   this.speedArcOuterRadius - this.acrToBackground,
                    angle:         2,
                    opacity:       0.9,
                    fill:          '#FFF',
                    shadowEnabled: true,
                    shadowBlur:    10,
                    shadowColor:   '#FFF'
                }
            );
        
        this.averageCadenceArc =
            new Konva.Arc(
                {
                    x:             this.arcX,
                    y:             this.arcY,
                    innerRadius:   this.cadenceArcInnerRadius + this.acrToBackground,
                    outerRadius:   this.cadenceArcOuterRadius - this.acrToBackground,
                    angle:         2,
                    opacity:       0.9,
                    fill:          '#FFF',
                    shadowEnabled: true,
                    shadowBlur:    10,
                    shadowColor:   '#FFF'
                }
            );
        
        this.cadenceArcBackground =
            new Konva.Arc(
                {
                    x:           this.arcX,
                    y:           this.arcY,
                    innerRadius: this.cadenceArcInnerRadius + this.acrToBackground,
                    outerRadius: this.cadenceArcOuterRadius - this.acrToBackground,
                    angle:       180,
                    fill:        '#444353',
                    rotation:    180
                }
            );
        
        this.curCadenceArc =
            new Konva.Arc(
                {
                    x:             this.arcX,
                    y:             this.arcY,
                    innerRadius:   this.cadenceArcInnerRadius,
                    outerRadius:   this.cadenceArcOuterRadius,
                    angle:         180,
                    fill:          '#00C8E6',
                    shadowEnabled: true,
                    shadowBlur:    10,
                    shadowColor:   '#00C8E6'
                }
            );
        
        let width = this.stageWidth / 1.1;
        
        this.bottomBar =
            new Konva.Shape(
                {
                    sceneFunc: function (context) {
                        
                        let height = 70;
                        let curveWidth = 80;
                        let curveRadius = 20;
                        
                        context.beginPath();
                        context.moveTo(0, height);
                        context.quadraticCurveTo(curveWidth - curveRadius, 0, curveWidth, 0);
                        context.lineTo(width, 0);
                        context.quadraticCurveTo(width + curveRadius, 0, width + curveWidth, height);
                        context.lineTo(0, height);
                        context.closePath();
                        context.fillStrokeShape(this);
                    },
                    fill:      '#FFF',
                    x:         -6,
                    y:         this.arcY,
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
        
        $('#version').text(this.version);
    }
    
    /**
     * @param  speed
     */
    updateCurrentSpeedView(speed)
    {
        this.lastSpeedUpdate = Date.now().toString();
        
        speed = this.round(speed);
        
        this.setMaxSpeed(speed);
        
        let opacity = 1;
        if (speed === 0)
        {
            opacity = 0;
        }
        
        let tween =
            new Konva.Tween(
                {
                    node:     this.curSpeedArc,
                    rotation: this.calculateSpeedBasedRotation(speed),
                    easing:   Konva.Easings.EaseInOut,
                    duration: 0.5,
                    opacity:  opacity
                }
            );
        
        tween.play();
        
        $('#curSpeed').text(speed);
        $('#maxSpeed').text(this.maxSpeedCeiling);
    }
    
    updateCurrentCadenceView(cadence)
    {
        this.lastCadenceUpdate = Date.now().toString();
        
        cadence = this.round(cadence);
        
        this.setMaxCadence(cadence);
        this.setAvrCadence(cadence);
        
        let opacity = 1;
        if (cadence === 0)
        {
            opacity = 0;
        }
        
        let tween =
            new Konva.Tween(
                {
                    node:     this.curCadenceArc,
                    rotation: this.calculateCadenceBasedRotation(cadence),
                    easing:   Konva.Easings.EaseInOut,
                    duration: 0.5,
                    opacity:  opacity
                }
            );
        
        tween.play();
        
        $('#curCadence').text(cadence);
        $('#maxCadence').text(this.maxCadenceCeiling);
    }
    
    updateAverageSpeedView(speed, initial = false)
    {
        speed = this.round(speed);
        
        this.setAvrSpeed(speed);
        
        let duration = 0.5;
        if (initial === true)
        {
            duration = 5;
        }
        
        let rotation = 0;
        if (speed !== 0)
        {
            rotation = this.calculateSpeedBasedRotation(speed) + 180;
        }
        
        let tween =
            new Konva.Tween(
                {
                    node:     this.averageSpeedArc,
                    rotation: rotation,
                    easing:   Konva.Easings.EaseInOut,
                    duration: duration,
                }
            );
        
        tween.play();
        
        $('#avrSpeed').text(speed);
    }
    
    updateAverageCadenceView(cadence, initial = false)
    {
        cadence = this.round(cadence);
        
        this.setAvrCadence(cadence);
        
        let duration = 0.5;
        if (initial === true)
        {
            duration = 5;
        }
        
        let rotation = 0;
        if (cadence !== 0)
        {
            rotation = this.calculateCadenceBasedRotation(cadence) + 180;
        }
        
        let tween =
            new Konva.Tween(
                {
                    node:     this.averageCadenceArc,
                    rotation: rotation,
                    easing:   Konva.Easings.EaseInOut,
                    duration: duration,
                }
            );
        
        tween.play();
        
        $('#avrCadence').text(cadence);
    }
    
    initAverageSpeedView()
    {
        this.setMaxSpeed(this.getAvrSpeed());
        this.updateAverageSpeedView(this.getAvrSpeed(), true);
    }
    
    initAverageCadenceView()
    {
        this.setMaxCadence(this.getAvrCadence());
        this.updateAverageCadenceView(this.getAvrCadence(), true);
        
        if (this.averageCadenceIntervalObject === null)
        {
            this.averageCadenceIntervalObject =
                setInterval(() => {
                    this.updateAverageCadenceView(this.getAvrCadence(), false);
                }, this.averageCadenceInterval);
        }
    }
    
    initSpeedCheck()
    {
        if (this.checkSpeedIntervalObject === null)
        {
            this.checkSpeedIntervalObject =
                setInterval(() => {
                    if (Date.now().toString() - this.lastSpeedUpdate >
                        this.checkSpeedInterval)
                    {
                        this.updateCurrentSpeedView(0);
                    }
                }, this.checkSpeedInterval);
        }
    }
    
    initCadenceCheck()
    {
        if (this.checkCadenceIntervalObject === null)
        {
            this.checkCadenceIntervalObject =
                setInterval(() => {
                    if (Date.now().toString() - this.lastCadenceUpdate >
                        this.checkCadenceInterval)
                    {
                        this.updateCurrentCadenceView(0);
                    }
                }, this.checkCadenceInterval);
        }
    }
    
    calculateSpeedBasedRotation(speed)
    {
        let factor = (
            100 / this.maxSpeedCeiling) * speed;
        
        return (
            180 / 100) * factor;
    }
    
    calculateCadenceBasedRotation(cadence)
    {
        let factor = (
            100 / this.maxCadenceCeiling) * cadence;
        
        return (
            180 / 100) * factor;
    }
    
    setAvrSpeed(speed)
    {
        if (this.averageSpeed !== speed)
        {
            this.averageSpeed = speed;
            
            if (this.localStorageAvailable === true)
            {
                localStorage.setItem('averageSpeed', this.averageSpeed);
            }
        }
    }
    
    setAvrCadence(cadence)
    {
        if (cadence > 0)
        {
            
            cadence =
                (
                    (
                        this.averageCadence * 99) + cadence) / 100;
            
            cadence = this.round(cadence);
            
            if (this.averageCadence !== cadence)
            {
                this.averageCadence = cadence;
                
                if (this.localStorageAvailable === true)
                {
                    localStorage.setItem('averageCadence', this.averageCadence);
                }
            }
        }
    }
    
    getAvrSpeed()
    {
        if (this.localStorageAvailable === true)
        {
            let value = localStorage.getItem('averageSpeed');
            
            if (typeof(
                    value) !== 'undefined')
            {
                this.averageSpeed = value;
            }
        }
        
        return this.averageSpeed;
    }
    
    getAvrCadence()
    {
        if (this.localStorageAvailable === true)
        {
            let value = localStorage.getItem('averageCadence');
            
            if (typeof(
                    value) !== 'undefined')
            {
                this.averageCadence = value;
            }
        }
        
        return this.averageCadence;
    }
    
    setMaxSpeed(speed)
    {
        if (speed > this.maxSpeedCeiling)
        {
            this.maxSpeed = this.round(speed);
            this.maxSpeedCeiling = Math.ceil(this.maxSpeed / 5) * 5;
            
            if (typeof(
                    Storage) !== 'undefined')
            {
                localStorage.setItem('maxSpeed', this.maxSpeed);
                localStorage.setItem('maxSpeedCeiling', this.maxSpeedCeiling);
            }
        }
    }
    
    setMaxCadence(cadence)
    {
        if (cadence > this.maxCadenceCeiling)
        {
            this.maxCadence = this.round(cadence);
            this.maxCadenceCeiling = Math.ceil(this.maxCadence / 10) * 10;
            
            if (typeof(
                    Storage) !== 'undefined')
            {
                localStorage.setItem('maxCadence', this.maxCadence);
                localStorage.setItem('maxCadenceCeiling', this.maxCadenceCeiling);
            }
        }
    }
    
    round(value)
    {
        return Math.round(value * 10) / 10;
    }
}

class BkDashboard
{
    /**
     *
     */
    constructor()
    {
        this.version = '0.0.3';
        
        this.localStorageAvailable =
            (
                typeof(
                    Storage) !== 'undefined');
        
        this.stageWidth = $(window).width();
        this.stageHeight = $(window).height();
        
        this.arcWidth = this.stageWidth / 20;
        
        this.arcInnerRadius = this.stageWidth / 2.5;
        this.arcOuterRadius = this.arcInnerRadius - this.arcWidth;
        this.arcX = 0;
        this.arcY = 0;
        
        this.maxSpeed = 0;
        this.maxSpeedCeiling = 20;
        this.maxSpeedDefault = 20;
        
        this.averageSpeed = 0;
        
        this.lastSpeedUpdate = 0;
        this.checkSpeedInterval = 1000;
        this.checkSpeedIntervalObject = null;
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
                    innerRadius: this.arcInnerRadius + 5,
                    outerRadius: this.arcOuterRadius - 5,
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
                    innerRadius:   this.arcInnerRadius,
                    outerRadius:   this.arcOuterRadius,
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
                    innerRadius:   this.arcInnerRadius + 15,
                    outerRadius:   this.arcOuterRadius,
                    angle:         2,
                    opacity:       0.9,
                    fill:          '#FFF',
                    shadowEnabled: true,
                    shadowBlur:    10,
                    shadowColor:   '#FFF'
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
        
        this.mask.add(this.curSpeedArc);
        this.mask.add(this.averageSpeedArc);
        
        this.layer.add(this.mask);
        this.layer.add(this.bottomBar);
        
        this.stage.add(this.layer);
        
        $('#version').text(this.version);
    }
    
    updateCurrentSpeedView(speed)
    {
        this.lastSpeedUpdate = Date.now().toString();
        
        speed = this.round(speed);
        
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
        
        this.setMaxSpeed(speed);
        
        $('#curSpeed').text(speed);
        $('#maxSpeed').text(this.maxSpeedCeiling);
    }
    
    updateAverageSpeedView(speed, initial = false)
    {
        speed = this.round(speed);
        
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
        
        this.setAvrSpeed(speed);
        
        $('#avrSpeed').text(speed);
    }
    
    initAverageView()
    {
        this.setMaxSpeed(this.getAvrSpeed());
        this.updateAverageSpeedView(this.getAvrSpeed(), true);
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
    
    calculateSpeedBasedRotation(speed)
    {
        let factor = (
            100 / this.maxSpeedCeiling) * speed;
        
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
    
    getAvrSpeed()
    {
        if (this.localStorageAvailable === true)
        {
            let speed = localStorage.getItem('averageSpeed');
            
            if (typeof(
                    speed) !== 'undefined')
            {
                this.averageSpeed = speed;
            }
        }
        
        return this.averageSpeed;
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
    
    getMaxSpeedCeiling()
    {
        if (this.localStorageAvailable === true)
        {
            let speed = localStorage.getItem('maxSpeedCeiling');
            
            if (typeof(
                    speed) !== 'undefined')
            {
                this.maxSpeedCeiling = speed;
            }
            else
            {
                this.maxSpeedCeiling = this.maxSpeedDefault;
            }
        }
        
        return this.maxSpeedCeiling;
    }
    
    round(value)
    {
        return Math.round(value * 10) / 10;
    }
}

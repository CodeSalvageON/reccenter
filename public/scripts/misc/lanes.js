var LANE_0_Y = 200;
var LANE_1_Y = 450;
var LANE_2_Y = 710;
var PLAYER_X = 100;
var JUMP_VELOCITY = -800;
var JUMP_GRAVITY = 2000;
var MAX_GAME_X_SPEED = 1000;
var SPEED_BOOST = 250;
var SPEED_FACTOR = 3.5;  // (originally 5)
var LANE_WIDTH = 248;
var SPAWN_STOP_TIME = 4000; // ms
var PLAYER_STOP_TIME = 3000; // ms
var STAR_POINTS = 1000;
var SUPERSTAR_POINTS = 5000;
var IMPERVIOUS_TIME = 10000; // ms
var MULTIPLIER_TIME = 10000; // ms
var SPEED_BOOST_TIME = 5000; // ms
var SPAWN_INTERVAL = 20000; // ms
var SUPER_STAR_CHANCE = 10;
var PLAYER_STOP_ANIMATION_TIME = 500;  // ms (originally 350)
var OFFSCREEN = -1000;
var SHIELD_BLINK_START_TIME = 1500;
var STAR_PULSE_RATE = 0.0075;
var STAR_PULSE_MIN = 0.0;
var STAR_PULSE_MAX = 0.25;
var SPEED_BOOST_BLINK_RATE = 0.1;
var HURDLE_HIT_FRAME = 12;
var IDLE_FRAME = 13;
var WIN_SPRITE_OFFSET = 100;
var GATE_SPRITE_OFFSET = 75;
var NEBULA_SPEED_FACTOR = 2500;
var PLAYER_SPRITE_OFFSET = 20;
var PLAYER_ANIMATION_SPEED_FACTOR = 100;
var OBJECT_SPRITE_OFFSET = 70;
var HURDLE_SPRITE_OFFSET = 76;
var PLAYER_WIN_RUN_SPEED = 1.5
var END_GAME_DELAY = 1;
var PRE_GAME_SECONDS = 7;
var PRE_GAME_STAR_SPAWN_TIME = 1000; // in ms
var FRET_OFFSET = 0.016;
var TOP_SCORES_Y = 2.5;
var NAME_MAX = 8;
var TUTORIAL_TEXT_1 = "Catch the stars before the end for a top score. Super Stars are worth 5X more!";
var GAME_SECONDS = 90;

var gameWidth, gameHeight, scale, wordWrapMod;
var upKey, downKey, spaceKey, laneTap0, laneTap1, laneTap2;
var gameTimer, endGameTimer, spawnTimers, startTimers, powerupTimers, pregameTimer, pregameStarTime;
var score, scoreText, meter, meterBG, meterCropRect, meterWidth, closeButton, gameOverText, meterIcon, scoreBG, scoreContainer, scoreImage, overLay;
var nebulaeGroup, laneBGGroup, laneGroup, hurdleGroup, hurdleBreakGroup, starGroup, superstarGroup, powerupGroup, playerGroup, trailGroup, frameGroup, buttonGroup, uiGroup;
var player, lanes, powerups, trails, nextPreGameStarLane;
var speed, maxSpeed, starAlpha, starAlphaDir, pulseStars;
var spawnPatterns, laneQueues, powerupTypes, lastStarLane, lastHurdleLane, startedSpawning;
var bg0, bg1, bgStars0, bgStars1, nebula;
var jumpAudio, starAudio, superstarAudio, obstacleAudio, powerup1Audio, powerup2Audio, powerup3Audio, music;
var shieldBlink, shieldBlinkTimer, superSpeedSwap, speedBlink, speedBlinkDir, winCycles, runningTowardFinish;
var tutorialImage, tutorialText, tutorialIndex;
var tutorialButton, audioButton, clickButtonAudio;
var textCreated = false;
var won = false;
var timerStarted = false;
var tutorial = false;
var audio = true;
var inputDown = false;

GameState = {
    NONE: 0,
    GAME_OVER: 1
}

SpawnType = {
    NONE: 0,
    HURDLE: 1,
    STAR: 2,
    HIGH_STAR: 3,
    HURDLE_AND_HIGH_STAR: 4,
    POWER_UP: 5
}

PowerupType = {
    MULTIPLIER: 0,
    IMPERVIOUS: 1,
    SPEED_BOOST: 2,
    MAGNET: 3
}

gameWidth = 800;
gameHeight = 600;
wordWrapMod = 1050;

if (window.innerHeight >= 937 && window.innerWidth >= 1250) {
    gameWidth = 1250;
    gameHeight = 937;
    wordWrapMod = 850;
} else if (window.innerHeight >= 768 && window.innerWidth >= 1024) {
    gameWidth = 1024;
    gameHeight = 768;
    wordWrapMod = 1050;
}
else {
    wordWrapMod = 1250;
}

scale = new Phaser.Point(gameWidth / 1250, gameHeight / 937);

var startState = {
    preload: function() {
        initRetryLoaders(game, this, startState.postCreate) ;

        game.load.image("background", "assets/images/Bg_Space_00.jpg");
        game.load.image("splash", "assets/images/GS_TITLE.png");
        game.load.image("lane", "assets/images/Path_00.png");
        game.load.image("fret", "assets/images/fret_00.png");
        game.load.image("tutorialButton", "assets/images/TITLE_help.png");
        game.load.image("smallCloseButton", "assets/images/TITLE_close.png");
        game.load.atlas("playerAtlas", 'assets/images/playerAtlas.png', "assets/playerAtlas.json");
        game.load.spritesheet("playButtonSheet", "assets/images/GS_play_spritesheet.png", 400, 150, 3);
        game.load.spritesheet("audioButtonSheet", "assets/images/TITLE_audio_spritesheet.png", 100, 100, 2);
        game.load.audio("click", "assets/audio/click.mp3");
        game.load.image("background", "assets/images/Bg_Space_00.png");
        game.load.image("scale9White", "assets/images/Scale9_WhiteRounded_01.png");
        game.load.image("tutorial1", "assets/images/Tutorial_Runner_01.jpg");
        game.load.image("tutorial2", "assets/images/Tutorial_Runner_02.jpg");
        game.load.image("tutorial3", "assets/images/Tutorial_Runner_03.jpg");
        game.load.json("patterns", "assets/spawnPatterns.json");
        game.load.atlas("playerAtlas", 'assets/images/playerAtlas.png', "assets/playerAtlas.json");
        game.load.image("background", "assets/images/Bg_Space_00.png");
        game.load.image("bgStars", "assets/images/Bg_Stars_00_8.png");
        game.load.image("bgSpeedStars", "assets/images/Bg_Stars_Blurred.png");
        game.load.image("nebula1", "assets/images/nebula_1_blue.png");
        game.load.image("nebula2", "assets/images/nebula_1_red.png");
        game.load.image("nebula3", "assets/images/nebula_2_blue.png");
        game.load.image("nebula4", "assets/images/nebula_2_red.png");
        game.load.image("shield", "assets/images/Shield_00.png");
        game.load.image("hurdle", "assets/images/Hurdle_00.png");
        game.load.image("star", "assets/images/Star_00.png");
        game.load.spritesheet("closeButton", "assets/images/GS_close_spritesheet.png", 400, 150, 3);
        game.load.image("scoreContainer", "assets/images/GS_END_container.png");
        game.load.image("topScoresContainer", "assets/images/GS_END_topscoresContainer.png");
        game.load.image("scoreImage", "assets/images/GS_END_yourScore.png");
        game.load.image("overLay", "assets/images/TITLE_OVERLAY.png");
        game.load.image("meterBG", "assets/images/UI_bar_empty_00.png");
        game.load.image("meterFill", "assets/images/UI_bar_full_00.png");
        game.load.image("meterIcon", "assets/images/UI_playericon_00.png");
        game.load.spritesheet("superstar", "assets/images/SuperStar_spritesheet.png", 120, 120, 6);
        game.load.image("yourScoreBorder", "assets/images/GS_END_topscoresContainer_highlight.png");
        game.load.image("gate", "assets/images/gate.png");
        game.load.image("magnet", "assets/images/Magnet_00.png");
        game.load.image("multiplier", "assets/images/Multiplier_00.png");
        game.load.image("impervious", "assets/images/Impervious_00.png");
        game.load.image("speedboost", "assets/images/SpeedBoost_00.png");
        game.load.spritesheet("hurdleBreak", "assets/images/Hurdle_spritesheet.png", 200, 237, 4);
        game.load.audio("jump", "assets/audio/jump.mp3");
        game.load.audio("star", "assets/audio/star.mp3");
        game.load.audio("superstar", "assets/audio/superstar.mp3");
        game.load.audio("obstacle", "assets/audio/obstacle.mp3");
        game.load.audio("powerup1", "assets/audio/powerup1.mp3");
        game.load.audio("powerup2", "assets/audio/powerup2.mp3");
        game.load.audio("powerup3", "assets/audio/powerup3.mp3");
        game.load.audio("music", "assets/audio/runnerThemeLoop.mp3");
    },
    create: function() {

    },
    postCreate: function() {
        game.camera.flash(0x000000, 500, false);

        createBackground();

        /*
        var y = calcLaneY(1) - (gameHeight * 0.055);
        var laneBG = game.add.sprite(0, y, "lane");
        laneBG.scale.setTo(scale.x, scale.y);

        y = calcLaneY(1) + gameHeight * FRET_OFFSET;
        for (var j=0; j<8; j++) {
            var fret = game.add.sprite(j * LANE_WIDTH * scale.x, y, "fret");
            fret.scale.setTo(scale.x, scale.y);
        }

        var player = game.add.sprite(gameWidth * 0.05, gameHeight * 0.45, "playerAtlas");
        player.scale.setTo(scale.x, scale.y);
        player.frame = IDLE_FRAME;
        */

        var splash = game.add.sprite(gameWidth * 0.15, gameHeight * 0.2, "splash");
        splash.scale.setTo(scale.x, scale.y);

        var playButton = game.add.button(0, 0, "playButtonSheet", null, this, 2, 3, 1, 2 );
        playButton.events.onInputUp.add(clickPlay, this);
        playButton.scale.setTo(scale.x, scale.y);
        playButton.x = gameWidth / 2 - (playButton.width / 2);
        playButton.y = gameHeight * 0.7;

        tutorialButton = game.add.button(gameWidth * 0.01, gameHeight * 0.88, "tutorialButton", null, this);
        tutorialButton.events.onInputUp.add(clickTutorial, this);
        tutorialButton.scale.setTo(scale.x, scale.y);

        audioButton = game.add.button(gameWidth * 0.91, gameHeight * 0.88, "audioButtonSheet", null, this);
        audioButton.events.onInputUp.add(clickAudio, this);
        if (audio)
            audioButton.frame = 1;
        else
            audioButton.frame = 0;
        audioButton.scale.setTo(scale.x, scale.y);

        smallCloseButton = game.add.button(gameWidth * 0.94, gameHeight * 0.01, "smallCloseButton", null, this);
        smallCloseButton.events.onInputUp.add(close, this);
        smallCloseButton.scale.setTo(scale.x, scale.y);

        clickButtonAudio = game.add.audio("click");

        if (!initialized) {
            initialized = true;
            updateParentLoader(100);
        }
    }

}

var tutorialState = {

    create: function() {
        game.camera.flash(0x000000, 500, false);

        createBackground();

        var tutorialBG = game.add.sprite(gameWidth * 0.075, gameWidth * 0.11, "scale9White");
        tutorialBG.scale.setTo(scale.x, scale.y);
        tutorialBG.width = gameWidth * 0.85;
        tutorialBG.height = gameHeight * 0.6;
        tutorialBG.tint = 0x242e4f;

        tutorialImage = game.add.sprite(gameWidth / 2, gameHeight * 0.35, "tutorial1");
        tutorialImage.anchor.setTo(0.5, 0.5);
        tutorialImage.scale.setTo(scale.x * 0.75, scale.y * 0.75);

        var style = { font: "32px Arial", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: wordWrapMod * scale.x };
        tutorialText = game.add.text(gameWidth / 2, gameHeight * 0.65, TUTORIAL_TEXT_1, style);
        tutorialText.anchor.setTo(0.5, 0.5);
        tutorialText.scale.setTo(scale.x, scale.y);

        tutorialIndex = 0;
    },
    update: function() {
        if (game.input.activePointer.isDown) {
            inputDown = true;
        }
        else if (game.input.activePointer.isUp && inputDown) {
            advanceTutorial();
            inputDown = false;
        }
    }
}

var mainState = {
    create: function() {
        if (parent.window.gameBridge) {
            parent.window.gameBridge.start();
        }
        // only support resizing until the start button has been pressed
        window.removeEventListener('resize', gameResizeHandler, false);

        game.camera.flash(0x000000, 500, false);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        spawnPatterns = game.cache.getJSON("patterns");

        // background
        createBackground();
        bg1 = game.add.sprite(gameWidth, 0, "background");
        bg1.scale.setTo(scale.x, scale.y);

        // stars

        bgStars0 = game.add.sprite(0, 0, "bgStars");
        // image is 1/4 the size needed
        bgStars0.scale.setTo(scale.x * 4, scale.y * 4);
        bgStars1 = game.add.sprite(gameWidth, 0, "bgStars");
        bgStars1.scale.setTo(scale.x, scale.y);

        // create groups
        nebulaeGroup = game.add.group();
        laneBGGroup = game.add.group();
        laneGroup = game.add.group();
        hurdleGroup = game.add.group();
        hurdleBreakGroup = game.add.group();
        powerupGroup = game.add.group();
        starGroup = game.add.group();
        superstarGroup = game.add.group();
        trailGroup = game.add.group();
        playerGroup = game.add.group();
        buttonGroup = game.add.group();
        uiGroup = game.add.group();

        // add first nebula
        nebulae = [];
        createNebula(getRandomInt(0, gameWidth / 3));

        // create player
        createPlayer();

        // controls
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(player.pressUpKey, player);
        upKey.onUp.add(player.releaseUpKey, player);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downKey.onDown.add(player.pressDownKey, player);
        downKey.onUp.add(player.releaseDownKey, player);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(player.pressSpaceKey, player);
        //spaceKey.onUp.add(player.releaseSpaceKey, player);
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR ]);

        // meter
        meterBG = game.add.sprite(0, 0, "meterBG");
        meterBG.x = gameWidth * 0.54;
        meterBG.y = gameHeight * 0.02;
        meterBG.scale.setTo(scale.x * 1.1, scale.y * 1.25);
        meterBG.alpha = 0.0;
        meter = game.add.sprite(0, 0, "meterFill");
        meter.scale.setTo(scale.x * 1.1, scale.y * 1.25);
        meterWidth = meter.width;
        meter.x = meterBG.x + gameWidth * 0.0045;
        meter.y = meterBG.y + gameHeight * 0.0085;
        meter.origPosition = meter.position.clone();
        meterCropRect = new Phaser.Rectangle(0, 0, meter.width / scale.x / 1.1, meter.height / scale.y / 1.25);
        meter.crop(meterCropRect);
        meter.alpha = 0.0;

        meterIcon = game.add.sprite(0, 0, "meterIcon");
        meterIcon.scale.setTo(scale.x, scale.y);
        meterIcon.x = meter.x - meter.width - (gameWidth * 0.01);
        meterIcon.y = gameHeight * 0.015;
        meterIcon.alpha = 0.0;

        // audio
        jumpAudio = game.add.audio("jump");
        starAudio = game.add.audio("star");
        superstarAudio = game.add.audio("superstar");
        obstacleAudio = game.add.audio("obstacle");
        powerup1Audio = game.add.audio("powerup1");
        powerup2Audio = game.add.audio("powerup2");
        powerup3Audio = game.add.audio("powerup3");
        music = new Phaser.Sound(game, "music", .5, false);

        // end screen ui
        closeButton = game.add.button(OFFSCREEN, OFFSCREEN, "closeButton", null, this, 2, 1, 3);
        closeButton.events.onInputUp.add(close, this);
        closeButton.scale.setTo(scale.x, scale.y);

        smallCloseButton = game.add.button(gameWidth * 0.94, gameHeight * 0.01, "smallCloseButton", null, this);
        smallCloseButton.events.onInputUp.add(close, this);
        smallCloseButton.scale.setTo(scale.x, scale.y);

        buttonGroup.add(closeButton);

        scoreContainer = game.add.sprite(gameWidth / 2, gameHeight * 0.25, "scoreContainer");
        scoreContainer.scale.setTo(scale.x, scale.y);
        scoreContainer.anchor.setTo(0.5, 0.5);
        scoreContainer.alpha = 0.0;
        uiGroup.add(scoreContainer);

        topScoresContainer = game.add.sprite(gameWidth / 2, gameHeight * 0.575, "topScoresContainer");
        topScoresContainer.scale.setTo(scale.x, scale.y);
        topScoresContainer.anchor.setTo(0.5, 0.5);
        topScoresContainer.alpha = 0.0;
        uiGroup.add(topScoresContainer);

        scoreImage = game.add.sprite(game.width / 2, game.height * 0.1, "scoreImage");
        scoreImage.scale.setTo(scale.x, scale.y);
        scoreImage.anchor.setTo(0.5, 0.5);
        scoreImage.alpha = 0.0;
        uiGroup.add(scoreImage);

        // multiplierIcon = game.add.sprite(gameWidth * 0.35, 0, "multiplier");
        // multiplierIcon.scale.setTo(scale.x, scale.y);
        // multiplierIcon.alpha = 0.0;
        // uiGroup.add(multiplierIcon);

        createLaneButtons();
        createLanes();
        initialize();
    },

    update: function() {
        if (gameState == GameState.NONE) {
            var i;
            if (!textCreated) {

                createText();
                pregameTimer = game.time.events.add(Phaser.Timer.SECOND * PRE_GAME_SECONDS, createTimer, this);
                pregameStarTime = PRE_GAME_STAR_SPAWN_TIME;
                //gameTimer = game.time.events.add(Phaser.Timer.SECOND * GAME_SECONDS, gameOver, this);
                showTimer();
                player.startRunAnimations();
            }

            // check for win state
            if (!won && getTimerDuration() <= SPAWN_STOP_TIME) {
                won = true;
            }

            // make player run towards the finish
            if (getTimerDuration() <= PLAYER_STOP_TIME) {
                if (!player.stopped) {
                    player.stopped = true;
                    player.setLane(1);
                    player.setShieldAlpha(0.0);
                    powerupTimers[PowerupType.IMPERVIOUS] = 0.0;
                }
                player.sprite.x += PLAYER_WIN_RUN_SPEED;
                player.speedSprite.x += PLAYER_WIN_RUN_SPEED;
                player.shieldSprite.x += PLAYER_WIN_RUN_SPEED;
            }

            // set speed
            if (speed < maxSpeed) {
                speed += SPEED_FACTOR;

                if (speed > maxSpeed)
                    speed = maxSpeed;
            }

            if (speed > MAX_GAME_X_SPEED && !superSpeedSwap) {
                superSpeedSwap = true;
                bgStars0.loadTexture("bgSpeedStars");
                bgStars1.loadTexture("bgSpeedStars");
                player.setSpeedAnimation();
            }
            else if (speed <= MAX_GAME_X_SPEED && superSpeedSwap) {
                superSpeedSwap = false;
                setNormalStarTextures();
                player.setNormalSprites();
            }

            // move backgrounds
            bg0.x -= speed / 5000;
            bg1.x -= speed / 5000;
            if (bg0.x < -gameWidth)
                bg0.x = gameWidth;
            if (bg1.x < -gameWidth)
                bg1.x = gameWidth;
            bgStars0.x -= speed / 1000;
            bgStars1.x -= speed / 1000;
            if (bgStars0.x < -gameWidth)
                bgStars0.x = gameWidth;
            if (bgStars1.x < -gameWidth)
                bgStars1.x = gameWidth;

            // update nebula
            for (i=nebulae.length - 1; i>=0; i--) {
                nebulae[i].update();
                if (nebulae[i].dead)
                    nebulae[i].destroySprites();
            }

            // update ui
            setMeter();

            // update sprites
            player.update();
            updateHurdles();
            updatePowerups();
            updateStars();
            updateSuperstars();
            updateLanes();

            // spawn objects
            if (timerStarted) {
                for (i=0; i<startedSpawning.length; i++) {
                    if (!startedSpawning[i]) {
                        startSpawnTimers[i] -= gameTimer.timer.elapsed;
                        if (startSpawnTimers[i] <= 0) {
                            startSpawnTimers[i] = 0;
                            startedSpawning[i] = true;
                        }
                    }
                    else {
                        spawnTimers[i] += speed;
                        if (spawnTimers[i] >= SPAWN_INTERVAL && !won) {
                            spawnTimers[i] = 0;
                            spawnLaneObject(i, laneQueues[i]);
                        }
                    }
                }

                // handle powerup timers
                for (i=0; i<powerupTimers.length; i++) {
                    if (powerupTimers[i] > 0) {
                        powerupTimers[i] -= gameTimer.timer.elapsed;
                        if (powerupTimers[i] <= 0) {
                            powerupTimers[i] = 0;
                            switch (i) {
                                case PowerupType.MULTIPLIER:
                                    // multiplierIcon.alpha = 0.0;
                                    pulseStars = false;
                                    for (var j=0; j<starGroup.children.length; j++)
                                        // starGroup.children[j].alpha = 1.0;
                                        starGroup.children[j].scale.setTo(starGroup.children[j].originalScale.x, starGroup.children[j].originalScale.y);
                                    break;
                                case PowerupType.IMPERVIOUS:
                                    player.setShieldAlpha(0.0);
                                    break;
                                case PowerupType.SPEED_BOOST:
                                    maxSpeed = MAX_GAME_X_SPEED;
                                    if (speed > maxSpeed)
                                        speed = maxSpeed;
                                    //player.sprite.alpha = 1.0;
                                    break;
                                case PowerupType.MAGNET:
                                    break;
                            }
                            powerupTypes.push(i);
                            //console.log("now there are " + powerupTypes.length + " types of powerups");
                        }
                        else {
                            switch (i) {
                                 case PowerupType.IMPERVIOUS:
                                    if (powerupTimers[i] < SHIELD_BLINK_START_TIME) {
                                        if (!shieldBlink) {
                                            shieldBlink = true;
                                            player.setShieldAlpha(0.0);
                                            shieldBlinkTimer = powerupTimers[i] / 4;
                                        }
                                        else {
                                            shieldBlinkTimer -= gameTimer.timer.elapsed;
                                            if (shieldBlinkTimer <= 0.0) {
                                                shieldBlinkTimer = powerupTimers[i] / 4;
                                                if (player.shieldSprite.alpha == 0.0)
                                                    player.setShieldAlpha(1.0);
                                                else
                                                    player.setShieldAlpha(0.0);
                                            }
                                        }
                                    }
                                    break;
                                 case PowerupType.SPEED_BOOST:
                                    if (powerupTimers[i] < SHIELD_BLINK_START_TIME) {
                                        if (speedBlinkDir == -1) {
                                            player.speedSprite.alpha -= SPEED_BOOST_BLINK_RATE;
                                            if (player.speedSprite.alpha <= 0.5) {
                                                player.speedSprite.alpha = 0.5;
                                                speedBlinkDir = 1;
                                            }
                                        }
                                        else {
                                            player.speedSprite.alpha += SPEED_BOOST_BLINK_RATE;
                                            if (player.speedSprite.alpha >= 1.0) {
                                                player.speedSprite.alpha = 1.0;
                                                speedBlinkDir = -1;
                                            }
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
            else {
                pregameStarTime -= pregameTimer.timer.elapsed;
                if (pregameStarTime <= 0.0) {
                    createStar(nextPreGameStarLane, 1);
                    if (nextPreGameStarLane == 0)
                        nextPreGameStarLane = 2;
                    else
                        nextPreGameStarLane = 0;
                    pregameStarTime = PRE_GAME_STAR_SPAWN_TIME;
                }
            }

            // set physics
            game.physics.arcade.overlap(player.sprite, hurdleGroup, hitHurdle, null, this);
            game.physics.arcade.overlap(player.sprite, powerupGroup, gotPowerup, null, this);
            game.physics.arcade.overlap(player.sprite, starGroup, gotStar, null, this);
            game.physics.arcade.overlap(player.sprite, superstarGroup, gotSuperstar, null, this);
        }
    }
}

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, "");
game.state.add("start", startState);
game.state.add("tutorial", tutorialState);
game.state.add("main", mainState);
game.state.start("start");

function render() {
    game.debug.body(player.sprite);
    for (var i=0; i<hurdleGroup.children.length; i++)
        game.debug.body(hurdleGroup.children[i]);
}

function initialize() {
    //console.log("on initialize, duration = " + getTimerDuration());
    speed = 0;
    winCycles = 0;
    nextPreGameStarLane = 0;
    maxSpeed = MAX_GAME_X_SPEED;
    score = 0;
    jump = false;
    shieldBlink = false;
    speedBlink = false;
    superSpeedSwap = false;
    won = false;
    runningTowardFinish = false;
    starAlpha = 0.0;
    starAlphaDir = 1;
    pulseStars = false;
    powerups = [];
    powerupTypes = [PowerupType.MULTIPLIER, PowerupType.IMPERVIOUS, PowerupType.SPEED_BOOST];
    powerupTimers = [0, 0, 0];
    createFrets();
    laneQueues = [[],[],[]];
    addLaneData(laneQueues[0]);
    addLaneData(laneQueues[1]);
    addLaneData(laneQueues[2]);
    spawnTimers = [0, 0, 0];
    startSpawnTimers = [getRandomInt(0, 2000), getRandomInt(2000, 4000), getRandomInt(4000, 6000)];
    startedSpawning = [false, false, false];
    gameState = GameState.NONE;
    if (audio)
        music.volume = 1.0;
    else
        music.volume = 0.0;
    setTimeout(function(){ music.play(); }, 1000);  // start music after one second
    player.reset();
}

function clickPlay(button) {
    if (pointIntersectsRect(new Phaser.Point(game.input.x, game.input.y), new Phaser.Rectangle(button.position.x, button.position.y, button.width, button.height))) {
        if (audio)
            clickButtonAudio.play();
        game.state.start("tutorial");
    }
}

function clickTutorial(button) {
    if (pointIntersectsRect(new Phaser.Point(game.input.x, game.input.y), new Phaser.Rectangle(button.position.x, button.position.y, button.width, button.height))) {
        if (!tutorial) {
            if (audio)
                clickButtonAudio.play();
            tutorial = true;
            game.state.start("tutorial");
        }
    }
}

function advanceTutorial() {
    if (audio)
        clickButtonAudio.play();
    switch (tutorialIndex) {
        case 0:
            tutorialImage.loadTexture("tutorial2");
            tutorialText.text = "Don't hit the hurdles! You'll get slowed down. Tap a lane to move to it. Tap the buddy to jump.";
            tutorialIndex++;
            break;
        case 1:
            tutorialImage.loadTexture("tutorial3");
            tutorialText.text = "Powerups make points worth more, give you a shield, or give you a speed boost!";
            tutorialIndex++;
            break;
        case 2:
            if (tutorial) {
                tutorial = false;
                game.state.start("start");
            }
            else
                game.state.start("main");
            break;
    }
}

function clickAudio(button) {
    if (pointIntersectsRect(new Phaser.Point(game.input.x, game.input.y), new Phaser.Rectangle(button.position.x, button.position.y, button.width, button.height))) {
        if (audio) {
            audioButton.frame = 0;
            audio = false;
        }
        else {
            audioButton.frame = 1;
            audio = true;
            clickButtonAudio.play();
        }
    }
}

function getTimerDuration() {
    if (timerStarted)
        return gameTimer.tick - gameTimer.timer._now;
    return GAME_SECONDS * 1000;
}

function spawnLaneObject(lane, laneQueue) {
    var y = calcLaneY(lane) - (OBJECT_SPRITE_OFFSET * scale.y);
    var randomChance;
    switch (laneQueue[0]) {
        case SpawnType.HURDLE:
            createHurdle(lane);
            break;
        case SpawnType.STAR:
            randomChance = getRandomInt(0, 100);
            if (randomChance < SUPER_STAR_CHANCE)
                createSuperstar(lane, 0);
            else
                createStar(lane, 0);
            break;
        case SpawnType.HIGH_STAR:
            randomChance = getRandomInt(0, 100);
            if (randomChance < SUPER_STAR_CHANCE)
                createSuperstar(lane, 1);
            else
                createStar(lane, 1);
            break;
        case SpawnType.HURDLE_AND_HIGH_STAR:
            createHurdle(lane);
            randomChance = getRandomInt(0, 100);
            if (randomChance < SUPER_STAR_CHANCE)
                createSuperstar(lane, 1);
            else
                createStar(lane, 1);
            break;
        case SpawnType.POWER_UP:
            powerupSpawnChance = powerupTypes.length * 25;
            randomChance = getRandomInt(0, 100);
            if (randomChance < powerupSpawnChance) {
                createPowerup(lane);
            }
            break;
    }
    laneQueue.splice(0, 1);
    if (laneQueue.length <= 0)
        addLaneData(laneQueue);
}

function setMeter() {
    var percent;
    if (timerStarted)
        percent = getTimerDuration() / (GAME_SECONDS * 1000);
    else
        percent = 1.0;
    meterCropRect.x = (meterWidth - (meterWidth * percent)) / scale.x / 1.1;
    meter.x = meter.origPosition.x + (meterCropRect.x * scale.x * 1.1);
    meter.updateCrop();
    meterIcon.x = meter.origPosition.x + (meterWidth - (percent * meterWidth)) - (meterIcon.width / 2);
}

function tapLane0(button) {
    if (pointIntersectsRect(new Phaser.Point(game.input.x, game.input.y), new Phaser.Rectangle(button.position.x, button.position.y, button.width, button.height))) {
        // console.log("tapLane0");
        if (textCreated && gameState == GameState.NONE && player.canPress) {
            if (player.lane == 0)
                player.jump();
            else {
                player.modLane(-1);
                player.canPress = true;
            }
        }
    }
}

function tapLane1(button) {
    if (pointIntersectsRect(new Phaser.Point(game.input.x, game.input.y), new Phaser.Rectangle(button.position.x, button.position.y, button.width, button.height))) {
        if (textCreated && gameState == GameState.NONE && player.canPress) {
            if (player.lane == 1)
                player.jump();
            else {
                if (player.lane == 0)
                    player.modLane(1);
                else
                    player.modLane(-1);
                player.canPress = true;
            }
        }
    }
}

function tapLane2(button) {
    if (pointIntersectsRect(new Phaser.Point(game.input.x, game.input.y), new Phaser.Rectangle(button.position.x, button.position.y, button.width, button.height))) {
        if (textCreated && gameState == GameState.NONE && player.canPress) {
            if (player.lane == 2)
                player.jump();
            else {
                player.modLane(1);
                player.canPress = true;
            }
        }
    }
}

function updateHurdles() {
    var i;
    for (i=(hurdleGroup.children.length - 1); i>=0; i--) {
        var hurdle = hurdleGroup.children[i];
        hurdle.body.velocity.x = -speed;
        if (hurdle.x <= (-hurdle.width * 2))
            removeHurdle(hurdle);
    }
    for (i=(hurdleBreakGroup.children.length - 1); i>=0; i--) {
        var hurdleBreak = hurdleBreakGroup.children[i];
        hurdleBreak.body.velocity.x = -speed;
        if (hurdleBreak.x <= (-hurdleBreak.width * 2))
            removeHurdleBreak(hurdleBreak);
    }
}

function updatePowerups() {
    for (var i=powerups.length - 1; i>= 0; i--) {
        var powerup = powerups[i];
        powerup.update();
        if (powerup.gateSprite.x < (-powerup.gateSprite.width * 2)) {
            powerup.destroySprites();
            powerups.splice(i, 1);
            powerupTypes.push(powerup.powerupType);
            powerup = null;
        }
    }
}

function updateStars() {
    for (var i=0; i<starGroup.children.length; i++) {
        var star = starGroup.children[i];
        star.body.velocity.x = -speed;

        // alpha for score multiplier
        if (pulseStars) {
            star.scale.setTo(star.originalScale.x * (1.0 + starAlpha), star.originalScale.y * (1.0 + starAlpha));
            //star.alpha = starAlpha;

            if (starAlphaDir == 1) {
                starAlpha += STAR_PULSE_RATE;
                if (starAlpha >= STAR_PULSE_MAX) {
                    starAlpha = STAR_PULSE_MAX;
                    starAlphaDir = -1;
                }
            }
            else {
                starAlpha -= STAR_PULSE_RATE;
                if (starAlpha <= STAR_PULSE_MIN) {
                    starAlpha = STAR_PULSE_MIN;
                    starAlphaDir = 1;
                }
            }
        }

        // remove if off-screen
        if (star.x < (-star.width * 2)) {
            starGroup.remove(star);
            star.destroy();
            star = null;
        }
    }
}

function updateSuperstars() {
    for (var i=0; i<superstarGroup.children.length; i++) {
        var superstar = superstarGroup.children[i];
        superstar.body.velocity.x = -speed;

        // alpha for score multiplier
        if (pulseStars) {
            //superstar.alpha = starAlpha;
            superstar.scale.setTo(superstar.originalScale.x * (1.0 + starAlpha), superstar.originalScale.y * (1.0 + starAlpha));
        }

        // remove if off-screen
        if (superstar.x < (-superstar.width * 2)) {
            superstarGroup.remove(superstar);
            superstar.destroy();
            superstar = null;
        }
    }
}

function updateLanes() {
    var lane;
    var needNewLane = false;
    var lastX;
    var i;
    for (i=0; i<laneGroup.children.length; i++) {
        lane = laneGroup.children[i];
        if (lane.x < -(LANE_WIDTH * 2)) {
            laneGroup.remove(lane);
            lane.destroy();
            lane = null;
            needNewLane = true;
            //console.log("need new lane because of lane " + i);
        }
        else {
            lane.body.velocity.x = -speed;
            if (needNewLane && i == laneGroup.children.length - 1)
                lastX = lane.x;
        }
    }
    //console.log("needNewLane = " + needNewLane);
    if (needNewLane) {
        for (i=0; i<3; i++) {
            lane = laneGroup.create(lastX + (LANE_WIDTH * scale.x) - (17 * (speed / MAX_GAME_X_SPEED)), calcLaneY(i) + gameHeight * FRET_OFFSET, "fret");
            lane.scale.setTo(scale.x, scale.y);
            game.physics.arcade.enable(lane);
            lane.body.velocity.x = -speed;
        }
    }
}

function hitHurdle(playerHit, hurdle) {
    var playerHeight = player.sprite.y - calcLaneY(player.lane);
    if (playerHeight > (-25 * scale.y) && hurdle.lane == player.lane) {
        //console.log(powerupTimers[PowerupType.IMPERVIOUS]);
        if (powerupTimers[PowerupType.IMPERVIOUS] <= 0 && powerupTimers[PowerupType.SPEED_BOOST] <= 0) {
            if (audio)
                obstacleAudio.play();
            speed = 0;
            player.hitHurdle();
        }
        hurdleGroup.remove(hurdle);
        var hurdleBreak = hurdleBreakGroup.create(hurdle.x, hurdle.y, "hurdleBreak");
        hurdleBreak.scale.setTo(scale.x, scale.y);
        game.physics.arcade.enable(hurdleBreak);
        hurdleBreak.animations.add("break", [0,1,2,3], 10, false);
        hurdleBreak.animations.play("break");
    }
}

function removeHurdle(hurdle) {
    hurdleGroup.remove(hurdle);
    hurdle.destroy();
    hurdle = null;
}

function removeHurdleBreak(hurdleBreak) {
    hurdleBreakGroup.remove(hurdleBreak);
    hurdleBreak.destroy();
    hurdleBreak = null;
}

function gotPowerup(playerHit, powerup) {
    var playerHeight = player.sprite.y - calcLaneY(player.lane);
    if (playerHeight > (-50 * scale.y) && powerup.powerup.lane == player.lane) {
        powerups.splice(powerups.indexOf(powerup.powerup), 1);
        powerup.powerup.got();
    }
}

function gotStar(playerHit, star) {
    //console.log(star.lane + " --- " + playerLane);
    if (star.lane == player.lane) {
        if (audio)
            starAudio.play();
        starGroup.remove(star);
        star.destroy();
        star = null;
        addToScore(STAR_POINTS);

        if (!timerStarted)
            createTimer();
    }
}

function gotSuperstar(playerHit, superstar) {
    //console.log("got superstar --- " + superstar.lane + " --- " + playerLane);
    if (superstar.lane == player.lane) {
        if (audio)
            superstarAudio.play();
        superstarGroup.remove(superstar);
        superstar.destroy();
        superstar = null;
        addToScore(SUPERSTAR_POINTS);
    }
}

function addToScore(mod) {
    if (powerupTimers[PowerupType.MULTIPLIER] > 0)
        mod *= 2;
    score += mod;
    if (score < 0)
        score = 0;
    if (mod < 0)
        resetScoreText();
    scoreText.setText(score.toString());
}

function calcLaneY(lane) {
    switch (lane) {
        case 0:
            return LANE_0_Y * scale.y;
            break;
        case 1:
            return LANE_1_Y * scale.y;
            break;
        case 2:
            return LANE_2_Y * scale.y;
            break;
    }
    return 0;
}

function gameOver() {
    smallCloseButton.x = OFFSCREEN;
    smallCloseButton.y = OFFSCREEN;
    //console.log("game over");
    gameState = GameState.GAME_OVER;

    music.stop();
    moveLaneButtonsOffscreen();

    endGameTimer = game.time.events.add(Phaser.Timer.SECOND * END_GAME_DELAY, gameOverDelay, this);

    setNormalStarTextures();
    player.stopYMotion();
    player.stopXMotion();
    player.stopAnimation();
    player.win();

    var i;
    for (i=0; i<hurdleGroup.children.length; i++) {
        hurdleGroup.children[i].body.velocity.x = 0;
        hurdleGroup.children[i].body.velocity.y = 0;
    }

    for (i=0; i<powerupGroup.children.length; i++) {
        powerupGroup.children[i].body.velocity.x = 0;
        powerupGroup.children[i].body.velocity.y = 0;
    }

    for (i=0; i<starGroup.children.length; i++) {
        starGroup.children[i].body.velocity.x = 0;
        starGroup.children[i].body.velocity.y = 0;
    }

    for (i=0; i<laneGroup.children.length; i++) {
        laneGroup.children[i].body.velocity.x = 0;
        laneGroup.children[i].body.velocity.y = 0;
    }
}
function gameOverDelay() {
    if (parent.window.gameBridge) {
        var p = parent.window.gameBridge.sendScore(score);
        p.then(function(v) {
            finishGameOver(v); // 1
        });
    } else {
        finishGameOver({
            allTimeScores: [],
        })
    }

    scoreContainer.alpha = 1.0;
    scoreImage.alpha = 1.0;
    topScoresContainer.alpha = 1.0;

    gameOverText.text = score;
    gameOverText.alpha = 1.0;

    var style = {font: "64px Righteous", fill: "#ffffff", boundsAlignH: "center"};
    var topScoresHeaderText = game.add.text(gameWidth * 0.5, gameHeight * 0.4, "TOP SCORES", style);
    topScoresHeaderText.anchor.setTo(0.5, 0.5);
    topScoresHeaderText.scale.setTo(scale.x, scale.y);
    style.font = "40px Righteous";
    var allTimeHeader = game.add.text(gameWidth * 0.28, gameHeight * 0.47, "ALL TIME", style);
    allTimeHeader.anchor.setTo(0.5, 0.5);
    allTimeHeader.scale.setTo(scale.x, scale.y);
    var weeklyHeader = game.add.text(gameWidth * 0.72, gameHeight * 0.47, "WEEKLY", style);
    weeklyHeader.anchor.setTo(0.5, 0.5);
    weeklyHeader.scale.setTo(scale.x, scale.y);

    scoreBG.alpha = 0.0;
    scoreText.alpha = 0.0;
    meterIcon.alpha = 0.0;
    meterBG.alpha = 0.0;
    // multiplierIcon.alpha = 0.0;
}

function finishGameOver(leaderboardText) {
    var allTimeHighScoreIndex = findScoreIndex(leaderboardText, 'allTimeScores');

    if (allTimeHighScoreIndex != -1) {
        var yourScoreBorder = game.add.sprite(0, 0, "yourScoreBorder");
        yourScoreBorder.scale.setTo(scale.x, scale.y);
        yourScoreBorder.x = gameWidth * 0.095;
        yourScoreBorder.y = gameHeight * 0.5 + (gameHeight * 0.0545 * allTimeHighScoreIndex);
    }

    var weeklyHighScoreIndex = findScoreIndex(leaderboardText, 'currentWeekScores');
    if (weeklyHighScoreIndex != -1) {
        var weeklyScoreBorder = game.add.sprite(0, 0, "yourScoreBorder");
        weeklyScoreBorder.scale.setTo(scale.x, scale.y);
        weeklyScoreBorder.x = gameWidth * 0.52;
        weeklyScoreBorder.y = gameHeight * 0.5 + (gameHeight * 0.0545 * weeklyHighScoreIndex);
    }

    //console.log(leaderboardText.allTimeScores);
    var style = { font: "36px Righteous", fill: "#a8e8fa", align: "left" };
    var indexTextLeft = "";
    var indexTextRight = "";
    var nameTextLeft = "";
    var nameTextRight = "";
    var scoreTextLeft = "";
    var scoreTextRight = "";
    for (i=0; i<5; i++) {
        // all time scores
        var allTimeEntry = null;
        if (leaderboardText != null && leaderboardText.allTimeScores != null) {
            if (leaderboardText.allTimeScores.length > i)
                allTimeEntry = leaderboardText.allTimeScores[i];
        }
        var scoreIndex = i + 1;
        var nameEntry = "";
        if (allTimeEntry != null) {
            nameEntry = getTrimmedName(allTimeEntry.firstName);
            nameTextLeft += nameEntry + "\n";
            scoreTextLeft += allTimeEntry.score + " \n"; // "999999\n"; //
        }
        else
            scoreTextLeft += "\n";

        indexTextLeft += scoreIndex + ".\n";
        indexTextRight += scoreIndex + ".\n";

        // if (i == 0) {
            // nameEntry = "MMMMMMMM";
        // }

        // weekly scores
        var weeklyEntry = null;
        if (leaderboardText != null && leaderboardText.currentWeekScores != null) {
            if (leaderboardText.currentWeekScores.length > i)
                weeklyEntry = leaderboardText.currentWeekScores[i];
        }

        if (weeklyEntry != null) {
            nameEntry = getTrimmedName(weeklyEntry.firstName);
            nameTextRight += nameEntry + "\n";
            scoreTextRight += weeklyEntry.score + " \n"; // "999999\n";
        }
        else
            scoreTextRight += "\n";
    }

    style.align = "center";
    var indexTextBlock = game.add.text(gameWidth * 0.096, gameHeight * 0.4975, indexTextLeft, style);
    indexTextBlock.lineSpacing = TOP_SCORES_Y;
    indexTextBlock.scale.setTo(scale.x, scale.y);

    indexTextBlock = game.add.text(gameWidth * 0.526, gameHeight * 0.4975, indexTextRight, style);
    indexTextBlock.lineSpacing = TOP_SCORES_Y;
    indexTextBlock.scale.setTo(scale.x, scale.y);

    style.align = "left";
    var nameTextBlock = game.add.text(gameWidth * 0.13, gameHeight * 0.4975, nameTextLeft, style);
    nameTextBlock.lineSpacing = TOP_SCORES_Y;
    nameTextBlock.scale.setTo(scale.x, scale.y);

    nameTextBlock = game.add.text(gameWidth * 0.56, gameHeight * 0.4975, nameTextRight, style);
    nameTextBlock.lineSpacing = TOP_SCORES_Y;
    nameTextBlock.scale.setTo(scale.x, scale.y);

    style.align = "right";
    var scoreTextBlock = game.add.text(gameWidth * 0.37, gameHeight * 0.5, scoreTextLeft, style);
    scoreTextBlock.lineSpacing = TOP_SCORES_Y;
    scoreTextBlock.scale.setTo(scale.x, scale.y);

    scoreTextBlock = game.add.text(gameWidth * 0.795, gameHeight * 0.5, scoreTextRight, style);
    scoreTextBlock.lineSpacing = TOP_SCORES_Y;
    scoreTextBlock.scale.setTo(scale.x, scale.y);

    closeButton.x = (game.width / 2) - (closeButton.width / 2);
    closeButton.y = game.height * 0.85;
}

function close(button) {
    if (pointIntersectsRect(new Phaser.Point(game.input.x, game.input.y), new Phaser.Rectangle(button.position.x, button.position.y, button.width, button.height))) {
        if (audio)
            clickButtonAudio.play();
        if (parent.window.gameBridge)
            parent.window.gameBridge.close();
    }
}

function createTimer() {
    if (!timerStarted) {
        gameTimer = game.time.events.add(Phaser.Timer.SECOND * GAME_SECONDS, gameOver, this);
        timerStarted = true;
    }
}

function createBackground() {
    bg0 = game.add.sprite(0, 0, "background");
    bg0.width = gameWidth;
    bg0.height = gameHeight;
}

function createPlayer() {
    player = new Player();
}

function createHurdle(lane) {
    var y = calcLaneY(lane) - (HURDLE_SPRITE_OFFSET * scale.y);
    var hurdle = hurdleGroup.create(gameWidth, y, "hurdle");
    hurdle.lane = lane;
    hurdle.scale.setTo(scale.x, scale.y);
    game.physics.arcade.enable(hurdle);
    hurdle.body.setSize(hurdle.width * 0.4, hurdle.height * 0.75, hurdle.width * 0.25, hurdle.height * 0.25);
    hurdle.body.velocity.x = speed;
}

function createPowerup(lane) {
    var powerup = new Powerup(lane);
    powerups.push(powerup);
}

function createStar(lane, highOrLow) {
    var y = calcLaneY(lane);
    if (highOrLow == 0)
        y += 50 * scale.y;
    else
        y -= 60 * scale.y;
    var star = starGroup.create(gameWidth, y, "star");
    star.lane = lane;
    star.scale.setTo(scale.x, scale.y);
    star.anchor.setTo(0.5, 0.5);
    star.originalScale = new Phaser.Point(scale.x, scale.y);
    game.physics.arcade.enable(star);
    star.body.velocity.x = speed;
}

function createSuperstar(lane, highOrLow) {
    var y = calcLaneY(lane);
    if (highOrLow == 0)
        y += 30 * scale.y;
    else
        y -= 80 * scale.y;
    var superstar = superstarGroup.create(gameWidth, y, "superstar");
    superstar.scale.setTo(scale.x, scale.y);
    superstar.anchor.setTo(0.5, 0.5);
    superstar.originalScale = new Phaser.Point(scale.x, scale.y);
    //console.log(superstar.scale);
    superstar.animations.add("spin", [0,1,2,3,4,5], 10, true);
    superstar.animations.play("spin");
    superstar.lane = lane;
    game.physics.arcade.enable(superstar);
    superstar.body.velocity.x = speed;
}

function createLanes() {
    for (var i=0; i<3; i++) {
        var y = calcLaneY(i) - (gameHeight * 0.055);
        var laneBG = laneBGGroup.create(0, y, "lane");
        laneBG.scale.setTo(game.width, scale.y);
    }
}

function createFrets() {
    for (var i=0; i<3; i++) {
        var y = calcLaneY(i) + gameHeight * FRET_OFFSET;
        var lane = laneGroup.create(-LANE_WIDTH * scale.x, y, "fret");
        lane.scale.setTo(scale.x, scale.y);
        game.physics.arcade.enable(lane);
        lane.body.velocity.x = -speed;
        for (var j=0; j<8; j++) {
            lane = laneGroup.create(j * LANE_WIDTH * scale.x, y, "fret");
            lane.scale.setTo(scale.x, scale.y);
            game.physics.arcade.enable(lane);
            lane.body.velocity.x = -speed;
        }
    }
}

function createLaneButtons() {
    laneTap0 = game.add.button(0, calcLaneY(0), "lane");
    laneTap0.scale.setTo(scale.x, scale.y);
    buttonGroup.add(laneTap0);
    laneTap0.y -= laneTap0.height * 0.25;
    laneTap0.width = gameWidth;
    laneTap0.height = laneTap0.height * 1.5;
    laneTap0.alpha = 0.0;
    laneTap0.events.onInputUp.add(tapLane0, this);
    laneTap1 = game.add.button(0, calcLaneY(1), "lane");
    laneTap1.scale.setTo(scale.x, scale.y);
    buttonGroup.add(laneTap1);
    laneTap1.y -= laneTap1.height * 0.25;
    laneTap1.width = gameWidth;
    laneTap1.height = laneTap1.height * 1.5;
    laneTap1.alpha = 0.0;
    laneTap1.events.onInputUp.add(tapLane1, this);
    laneTap2 = game.add.button(0, calcLaneY(2), "lane");
    laneTap2.scale.setTo(scale.x, scale.y);
    buttonGroup.add(laneTap2);
    laneTap2.y -= laneTap2.height * 0.25;
    laneTap2.width = gameWidth;
    laneTap2.height = laneTap2.height * 1.5;
    laneTap2.alpha = 0.0;
    laneTap2.events.onInputUp.add(tapLane2, this);
}

function createText() {
    // console.log("createText");
    var style = {font: "84px Righteous", fill: "#ffffff", boundsAlignH: "left"};

    scoreBG = uiGroup.create(gameWidth * 0.005, gameHeight * 0.01, "star");
    scoreBG.scale.setTo(scale.x, scale.y);

    scoreText = game.add.text(gameWidth * 0.05, gameHeight * 0.0015, "0", style);
    scoreText.setTextBounds(gameWidth * 0.05, gameHeight * 0.0015, gameWidth * 0.3, gameHeight * 0.2);
    scoreText.scale.setTo(scale.x, scale.y);
    uiGroup.add(scoreText);

    style.font = "72px Righteous";
    style.align = "center";
    gameOverText = game.add.text(gameWidth / 2, gameHeight * 0.255, "", style);
    gameOverText.anchor.set(0.5, 0.5);
    gameOverText.alpha = 0.0;

    textCreated = true;
}

function createNebula(x) {
    nebulae.push(new Nebula(x));
}

// spawn functions
function addLaneData(laneQueue) {
    var patternIndex = getRandomInt(0, spawnPatterns.patterns.length - 1);
    for (var i=0; i<spawnPatterns.patterns[patternIndex].pattern.length; i++) {
        laneQueue.push(spawnPatterns.patterns[patternIndex].pattern[i]);
    }
}

// ui functions
function setTimer() {
    var secondsLeft;
    if (timerStarted)
        secondsLeft = Math.ceil(getTimerDuration() / 1000)
    else
        secondsLeft = GAME_SECONDS;
    timeText.setText(secondsLeft + " ");
    var baseNum = Math.ceil(secondsLeft / timePerFrame);
    var frame = TIMER_FRAMES - baseNum;
    timeGraphic.frame = frame;
}

function showTimer() {
    meterBG.alpha = 1.0;
    meter.alpha = 1.0;
    meterIcon.alpha = 1.0;
}

function resetScoreText() {
    scoreText.text = "0";
}

// lane button moving
function moveLaneButtonsOffscreen() {
    //console.log("moveLaneButtonsOffscreen");
    laneTap0.x = -gameWidth;
    laneTap1.x = -gameWidth;
    laneTap2.x = -gameWidth;
}

function moveLaneButtonsOnScreen() {
    //console.log("moveLaneButtonsOnScreen");
    laneTap0.x = 0;
    laneTap1.x = 0;
    laneTap2.x = 0;
}

function setNormalStarTextures() {
    bgStars0.loadTexture("bgStars");
    bgStars1.loadTexture("bgStars");
}

// classes
function Player() {
    this.sprite = playerGroup.create(PLAYER_X * scale.x, LANE_0_Y * scale.y, "playerAtlas");
    this.sprite.frame = IDLE_FRAME;
    this.animation = this.sprite.animations.add("run", [16,17,18,19,20,21,22,23,24,25], 1, true);
    this.jumpAnimation = this.sprite.animations.add("jump", [14,15], 3, false);
    this.sprite.scale.setTo(scale.x, scale.y);
    game.physics.arcade.enable(this.sprite);
    this.sprite.body.setSize(this.sprite.width * 0.5, this.sprite.height * 0.5, this.sprite.width * 0.35, this.sprite.height * 0.35);

    this.speedSprite = playerGroup.create(PLAYER_X * scale.x, LANE_0_Y * scale.y, "playerAtlas");
    this.speedAnimation = this.speedSprite.animations.add("run", [2,3,4,5,6,7,8,9,10,11], 1, true);
    this.speedJumpAnimation = this.speedSprite.animations.add("jump", [0,1], 3, false);
    this.speedSprite.scale.setTo(scale.x, scale.y);
    this.speedSprite.alpha = 0.0;

    // create trails
    this.trails = [];
    this.trailAnimations = [];
    this.trailJumpAnimations = [];
    var trail = trailGroup.create(PLAYER_X * scale.x, LANE_0_Y * scale.y, "playerAtlas");
    trail.frame = IDLE_FRAME;
    var trailAnimation = trail.animations.add("run", [16,17,18,19,20,21,22,23,24,25], 1, true);
    this.trailAnimations.push(trailAnimation);
    var trailJumpAnimation = trail.animations.add("jump", [14,15], 3, false);
    this.trailJumpAnimations.push(trailJumpAnimation);
    trail.scale.setTo(scale.x, scale.y);
    trail.alpha = 0.4;
    trail.baseAlpha = 0.4;
    trail.maxX = 25;
    this.trails.push(trail);
    trail = trailGroup.create(PLAYER_X * scale.x, LANE_0_Y * scale.y, "playerAtlas");
    trail.frame = IDLE_FRAME;
    trailAnimation = trail.animations.add("run", [16,17,18,19,20,21,22,23,24,25], 1, true);
    this.trailAnimations.push(trailAnimation);
    trailJumpAnimation = trail.animations.add("jump", [14,15], 3, false);
    this.trailJumpAnimations.push(trailJumpAnimation);
    trail.scale.setTo(scale.x, scale.y);
    trail.alpha = 0.3;
    trail.baseAlpha = 0.3;
    trail.maxX = 40;
    this.trails.push(trail);
    trail = trailGroup.create(PLAYER_X * scale.x, LANE_0_Y * scale.y, "playerAtlas");
    trail.frame = IDLE_FRAME;
    trailAnimation = trail.animations.add("run", [16,17,18,19,20,21,22,23,24,25], 1, true);
    this.trailAnimations.push(trailAnimation);
    trailJumpAnimation = trail.animations.add("jump", [14,15], 3, false);
    this.trailJumpAnimations.push(trailJumpAnimation);
    trail.scale.setTo(scale.x, scale.y);
    trail.alpha = 0.2;
    trail.baseAlpha = 0.2;
    trail.maxX = 50;
    this.trails.push(trail);

    this.canPress = true;
    this.isJumping = false;
    this.stopped = false;
    this.multiplierTimer = 0;
    this.multiplier = false;
    this.imperviousTimer = 0;
    this.impervious = false;
    this.speedBoostTimer = 0;
    this.speedBoost = false;
    this.magnetTimer = 0;
    this.magnet = false;
    this.hurdleTimer = 0;
    this.sprite.player = this;
    this.upKeyPressed = false;
    this.downKeyPressed = false;
    this.spaceKeyPressed = false;

    this.shieldSprite = playerGroup.create(this.sprite.x + (this.sprite.width * 0.6), this.sprite.y - (this.sprite.height * 0.25), "shield");
    this.shieldSprite.scale.setTo(scale.x, scale.y);
    this.shieldSprite.alpha = 0.0;

    this.update = function() {
        this.speedSprite.y = this.sprite.y;
        this.setShieldY();

        // reset keyboard cooldown
        /*
        if (!this.canPress && !upKey.isDown && !downKey.isDown && !this.isJumping && !spaceKey.isDown) {
            this.canPress = true;
        }
        */

        if (this.hurdleTimer <= 0) {
            this.animation.speed = speed / PLAYER_ANIMATION_SPEED_FACTOR;
            this.speedAnimation.speed = speed / PLAYER_ANIMATION_SPEED_FACTOR;

            var i;
            for (i=0; i<this.trailAnimations.length; i++) {
                this.trailAnimations[i].speed = speed / PLAYER_ANIMATION_SPEED_FACTOR;
            }

            if (!this.isJumping && this.sprite.animations.paused) {
                this.sprite.animations.paused = false;
                this.speedSprite.animations.paused = false;

                for (i=0; i<this.trailAnimations.length; i++)
                    this.trails[i].animations.paused = false;
            }
        }
        else {
            this.hurdleTimer -= gameTimer.timer.elapsed;
        }

        /*
        if (this.canPress) {
            if (upKey.isDown) {
                if (this.lane > 0) {
                    this.modLane(-1);
                }
            }
            else if (downKey.isDown) {
                if (this.lane < 2) {
                    this.modLane(1);
                }
            }
            else if (spaceKey.isDown) {
                this.jump();
            }
        }
        else
            */

        if (!this.canPress && this.isJumping) {
            //console.log("jumping - player y = " + player.y);
            if (this.sprite.y >= calcLaneY(this.lane) && this.sprite.body.velocity.y > 0) {
                this.stopYMotion();
                this.canPress = true;
            }
        }

        // check powerups
        if (this.speedBoost) {
            this.speedBoostTimer += gameTimer.timer.elapsed;
            if (this.speedBoostTimer > POWERUP_TIME) {
                this.speedBoost = false;
                if (speed > MAX_GAME_X_SPEED)
                    speed = MAX_GAME_X_SPEED;
            }
        }

        // set trails
        for (var i=0; i<this.trails.length; i++) {
            this.trails[i].x = this.sprite.x - (this.trails[i].maxX * (speed / MAX_GAME_X_SPEED));
            this.trails[i].y = this.sprite.y;
        }
    }

    this.pressUpKey = function() {
        if (this.canPress) {
            if (this.lane > 0) {
            	this.upKeyPressed = true;
                this.modLane(-1);
            }
        }
    }

    this.pressDownKey = function() {
        if (this.canPress) {
            if (this.lane < 2) {
            	this.downKeyPressed = true;
                this.modLane(1);
            }
        }
    }

    this.pressSpaceKey = function() {
        if (this.canPress) {
        	this.spaceKeyPressed = true;
            this.jump();
        }
    }

    this.releaseUpKey = function() {
    	if (this.upKeyPressed) {
    		this.upKeyPressed = false;
    		this.canPress = true;
    	}
    }

    this.releaseDownKey = function() {
    	if (this.downKeyPressed) {
    		this.downKeyPressed = false;
    		this.canPress = true;
    	}
    }

    /*
    this.releaseSpaceKey = function() {
    	if (this.spaceKeyPressed) {
    		this.spaceKeyPressed = false;
    		this.canPress = true;
    	}
    }
    */

    this.setShieldAlpha = function(alpha) {
        this.shieldSprite.alpha = alpha;
    }

    this.setSpeedAlpha = function(alpha) {
        this.speedSprite.alpha = alpha;
    }

    this.startRunAnimations = function() {
        // console.log("startRunAnimations");
        this.sprite.animations.play("run");
        this.speedSprite.animations.play("run");
        for (var i=0; i<this.trailAnimations.length; i++) {
            this.trails[i].animations.play("run");
        }
    }

    this.jump = function() {
        if (this.sprite.frame != HURDLE_HIT_FRAME && !won) {
            if (audio)
                jumpAudio.play();
            this.canPress = false;
            this.isJumping = true;
            this.sprite.body.moves = true;
            this.sprite.body.velocity.y = JUMP_VELOCITY * scale.y;
            this.sprite.body.gravity.y = JUMP_GRAVITY * scale.y;
            this.sprite.animations.play("jump");
            this.sprite.animations.currentAnim.onComplete.add(function () { this.startRunAnimations(); }, this);
            this.speedSprite.animations.play("jump");
            for (var i=0; i<this.trailAnimations.length; i++) {
                this.trails[i].animations.play("jump");
            }
        }
    }

    this.modLane = function(mod) {
        if (!timerStarted)
            createTimer();
        if (!won) {
            this.canPress = false;
            this.lane += mod;
            this.calcY();
            this.speedSprite.y = this.sprite.y;
        }
    }

    this.setLane = function(lane) {
        this.lane = lane;
        this.calcY();
        this.speedSprite.y = this.sprite.y;
    }

    this.calcY = function() {
        this.sprite.y = calcLaneY(this.lane) - (PLAYER_SPRITE_OFFSET * scale.y);
    }

    this.setShieldY = function() {
        this.shieldSprite.y = this.sprite.y - (this.sprite.height * 0.25);
    }

    this.stopYMotion = function() {
        this.sprite.body.velocity.y = 0;
        this.sprite.body.gravity.y = 0;
        this.sprite.body.moves = false;
        this.calcY();
        this.speedSprite.y = this.sprite.y;
        this.isJumping = false;
    }

    this.stopXMotion = function() {
        this.sprite.body.velocity.x = 0;
    }

    this.stopAnimation = function() {
        //console.log("stopping animation");
        this.animation.speed = 0;
        this.sprite.animations.paused = true;
        this.speedAnimation.speed = 0;
        this.speedSprite.animations.paused = true;

        for (var i=0; i<this.trailAnimations.length; i++) {
            // console.log("1");
            this.trailAnimations[i].speed = 0;
            // console.log("2");
            this.trails[i].animations.paused = true;
        }

        this.hurdleTimer = PLAYER_STOP_ANIMATION_TIME;
    }

    this.setSpeedAnimation = function() {
        this.sprite.alpha = 0.0;
        this.speedSprite.alpha = 1.0;
    }

    this.setNormalSprites = function() {
        this.sprite.alpha = 1.0;
        this.speedSprite.alpha = 0.0;
    }

    this.reset = function() {
        //console.log("here!");
        if (this.winSprite != null) {
            this.winSprite.alpha = 0.0;
            this.winSprite.animations.paused = true;
        }
        this.setNormalSprites();
        this.sprite.x = PLAYER_X * scale.x;
        this.speedSprite.x = this.sprite.x;
        this.shieldSprite.x = this.sprite.x + (this.sprite.width * 0.6);
        this.lane = 1;
        this.stopped = false;
        this.calcY();
        this.speedSprite.y = this.sprite.y;
        for (var i=0; i<this.trails.length; i++) {
            this.trails[i].y = this.sprite.y;
            this.trails[i].alpha = this.trails[i].baseAlpha;
        }
    }

    this.hitHurdle = function() {
        //console.log("hit hurdle");
        this.stopAnimation();
        this.stopYMotion();
        this.sprite.frame = HURDLE_HIT_FRAME;
        for (var i=0; i<this.trails.length; i++)
            this.trails[i].frame = HURDLE_HIT_FRAME;
        if (!this.canPress)
            this.canPress = true;
    }

    this.win = function() {
        //hide normal sprites
        this.sprite.alpha = 0.0;
        this.speedSprite.alpha = 0.0;
        for (var i=0; i<this.trails.length; i++)
            this.trails[i].alpha = 0.0;

        // show win sprite
        this.winSprite = playerGroup.create(this.sprite.x, this.sprite.y - (WIN_SPRITE_OFFSET * scale.y), "playerAtlas");
        this.winSprite.scale.setTo(scale.x, scale.y);
        this.winAnimation = this.winSprite.animations.add("win", [26,27,28,29], 10, true);
        this.winSprite.animations.play("win");
    }
}

function Powerup(lane) {
    var y = calcLaneY(lane) - (GATE_SPRITE_OFFSET * scale.y);
    this.lane = lane;

    // create gate
    this.gateSprite = powerupGroup.create(gameWidth, y, "gate");
    this.gateSprite.scale.setTo(scale.x, scale.y);
    game.physics.arcade.enable(this.gateSprite);
    this.gateSprite.body.setSize(this.gateSprite.width * 0.6, this.gateSprite.height, this.gateSprite.width * 0.2, 0);
    this.gateSprite.body.velocity.x = speed;
    this.gateSprite.powerup = this;

    // create powerup
    this.powerupType = powerupTypes[getRandomInt(0, powerupTypes.length - 1)];
    var powerupSpriteName = "";
    switch (this.powerupType) {
        case PowerupType.MULTIPLIER:
            powerupSpriteName = "multiplier";
            break;
        case PowerupType.IMPERVIOUS:
            powerupSpriteName = "impervious";
            break;
        case PowerupType.SPEED_BOOST:
            powerupSpriteName = "speedboost";
            break;
        case PowerupType.MAGNET:
            powerupSpriteName = "magnet";
            break;
    }
    powerupTypes.splice(powerupTypes.indexOf(this.powerupType), 1);
    //console.log("now there are " + powerupTypes.length + " types of powerups");

    this.powerupSprite = powerupGroup.create(0, 0, powerupSpriteName);
    this.powerupSprite.x = gameWidth + gameWidth * 0.0375;
    this.powerupSprite.y = y + (this.gateSprite.height / 3);

    this.powerupSprite.scale.setTo(scale.x, scale.y);
    game.physics.arcade.enable(this.powerupSprite);
    this.powerupSprite.body.setSize(this.powerupSprite.width * 0.6, this.powerupSprite.height, this.powerupSprite.width * 0.2, 0);
    this.powerupSprite.body.velocity.x = speed;
    this.powerupSprite.powerup = this;

    this.update = function() {
        this.gateSprite.body.velocity.x = -speed;
        this.powerupSprite.body.velocity.x = -speed;
    }

    this.got = function() {
        switch (this.powerupType) {
            case PowerupType.MAGNET:
                break;
            case PowerupType.MULTIPLIER:
                //multiplierIcon.alpha = 1.0;
                if (audio)
                    powerup1Audio.play();
                powerupTimers[this.powerupType] = MULTIPLIER_TIME;
                pulseStars = true;
                break;
            case PowerupType.IMPERVIOUS:
                if (audio)
                    powerup2Audio.play();
                player.setShieldAlpha(1.0);
                powerupTimers[this.powerupType] = IMPERVIOUS_TIME;
                break;
            case PowerupType.SPEED_BOOST:
                if (audio)
                    powerup3Audio.play();
                maxSpeed = MAX_GAME_X_SPEED + SPEED_BOOST;
                powerupTimers[this.powerupType] = SPEED_BOOST_TIME;
                //speed += SPEED_BOOST;
                speed = maxSpeed;
                speedBlinkDir = -1;
                break;
        }
        this.destroySprites();
    }

    this.destroySprites = function() {
        powerupGroup.remove(this.gateSprite);
        this.gateSprite.destroy();
        powerupGroup.remove(this.powerupSprite);
        this.powerupSprite.destroy();
    }
}

function Nebula(x) {
    var randomNebula = getRandomInt(1, 4);
    var nebulaName = "nebula" + randomNebula;
    this.sprite = nebulaeGroup.create(x, 0, nebulaName);
    this.sprite.scale.setTo(scale.x * 2, scale.y * 2);
    this.causedNewSpawn = false;
    this.dead = false;

    this.update = function() {
        this.sprite.x -= speed / NEBULA_SPEED_FACTOR;
        if (!this.causedNewSpawn && this.sprite.x < (gameWidth * 0.25)) {
            createNebula(gameWidth + (getRandomInt(0, gameWidth / 3)));
            this.causedNewSpawn = true;
        }
        if (this.sprite.x < (-this.sprite.width))
            this.dead = true;
    }

    this.destroySprites = function() {
        nebulaeGroup.remove(this.sprite);
        this.sprite.destroy();
    }
}

// utilities
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDouble(min, max) {
  return Math.random() * (max - min) + min;
}

function pointIntersectsRect(point, rect) {
    if (point.x >= rect.x && point.x <= (rect.x + rect.width) && point.y >= rect.y && point.y <= (rect.y + rect.height))
        return true;
    return false;
}
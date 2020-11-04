var DEBUG = false;
var PLAYER_SPEED = 300;
var BUBBLE_COLLISION_SIZE = 50;
var BUBBLE_MIN_SPEED = 200;
var BUBBLE_MAX_SPEED = 400;
var BUBBLE_SPAWN_TIME = 3000;
var BUBBLES_MAX = 20;
var STARTING_BUBBLES = 3;
var BUBBLE_TRAIL_LENGTH = 5;
var MAX_VELOCITY = 50;
var MIN_VELOCITY = 20;
var COINS_SPAWN_TIME = 3000;
var COINS_FADE_IN_SPEED = 0.02;
var COINS_OBTAIN_ALPHA = 0.8;
var SHAKE_TIME = 15;
var OFFSCREEN = -1000;
var BUBBLE_TIME = 200;
var NORMAL_MAX_X = 915;
var NORMAL_MIN_X = 335;
var LARGE_MAX_X = 870;
var LARGE_MIN_X = 380;
var POWERUP_TIME = 6000;
var TIMER_FRAMES = 12;
var MULTIBALL_TIME = 1000;
var MAX_BUBBLES = 4;
var MAX_MULTIBALL_BUBBLES = 12;
var GLOW_TIME = 750;
var GLOW_FADE_RATE = 0.025;
var TOP_SCORES_Y = -4;
var PADDLE_GLOW_TIME = 500;
var NAME_MAX = 8;
var TUTORIAL_TEXT_1 = "Drag your paddle with your finger or mouse. Bounce the balls into the holes using your paddle.";
var GAME_SECONDS = 90;

var gameWidth, gameHeight, scale, wordWrapMod;
var leftKey, rightKey, spaceKey, startInputX;
var player, bubbles, others;
var bgOverlay, hole0, hole1, hole2, hole3, hole4, door0, door1, bumper, door0Open, door0Close, door1Open, door1Close;
var bubbleSpriteGroup, otherSpriteGroup, coinsSpriteGroup, uiGroup, buttonGroup, bubbleEmitterGroup, bgSpriteGroup;
var playerCollisionGroup, bubbleCollisionGroup, otherCollisionGroup, powerupCollisionGroup;
var gameState, score, gameTimer;
var scoreContainer, scoreImage, overLay, closeButton;
var scoreText, gameOverText, ticks, tickCount, glow5kLeft, glow10kLeft, bumperGlow, glow5kRight, glow10kRight, glows;
var bubbleSpawnTimes, emitters;
var coins, coinsCollisionGroup, coinsTimer;
var shakeWorld, bubblesCreated, bubbleTimer;
var playerPhysicsDataKey, playerLargerPhysicsDataKey;
var powerup, powerupFalling, multiball, multiballTimer, powerupIcon;
var timeBG, timeGraphic, timeText, timePerFrame;
var splash, playButton, tutorialButton, audioButton, smallCloseButton, clickButtonAudio;
var tutorialBG, tutorialImage, tutorialText, tutorialIndex;
var textCreated = false;
var tutorial = false;
var audio = true;
var inputDown = false;

GameState = {
    SPLASH: 0,
    TUTORIAL: 1,
    WAIT_FOR_MOVE: 2,
    PLAY: 3,
    GAME_OVER: 4
}

BubbleAudioType = {
    BUBBLE_FALLS: 0,
    BUBBLE_IN_POCKET: 1,
    BUBBLE_IN_POCKET_10: 2,
    BUBBLE_HITS_BUBBLE: 3,
    BUBBLE_HITS_WALL: 4,
    BUBBLE_HITS_PADDLE: 5,
    BUBBLE_HITS_BUMPER: 6,
    REWARD: 7
}

PowerupType = {
    ENLARGE: 0,
    MULTIBALL: 1
}

gameWidth = 800;
gameHeight = 600;
playerPhysicsDataKey = "playerSmall";
playerLargerPhysicsDataKey = "playerSmallLarger";

if (window.innerHeight >= 937 && window.innerWidth >= 1250) {
    gameWidth = 1250;
    gameHeight = 937;
    playerPhysicsDataKey = "player";
    playerLargerPhysicsDataKey = "playerLarger";
    wordWrapMod = 850;
    //console.log("large");
} else if (window.innerHeight >= 768 && window.innerWidth >= 1024) {
    gameWidth = 1024;
    gameHeight = 768;
    playerPhysicsDataKey = "playerMedium";
    playerLargerPhysicsDataKey = "playerMediumLarger";
    wordWrapMod = 1050;
    //console.log("medium");
}
else {
    wordWrapMod = 1250;
    //console.log("small");
}

scale = new Phaser.Point(gameWidth / 1250, gameHeight / 937);

var mainState = {
    preload: function() {
        initRetryLoaders(game, this, mainState.postCreate);

        game.load.physics("physicsData", "assets/sprites.json");
        game.load.spritesheet("gateOpen", "assets/images/gate_spritesheet.png", 101, 199, 4);
        game.load.spritesheet("playButtonSheet", "assets/images/WP_play_spritesheet.png", 400, 150, 3);
        game.load.spritesheet("player","assets/images/paddle_spritesheet_02.png", 242, 52, 2);
        game.load.spritesheet("closeButton", "assets/images/WP_close_spritesheet.png", 400, 150, 3);
        game.load.spritesheet("timerSheet", "assets/images/timersheet.png", 71, 71, TIMER_FRAMES);
        game.load.spritesheet("audioButtonSheet", "assets/images/TITLE_audio_spritesheet.png", 100, 100, 2);
        game.load.spritesheet("pinSheet", "assets/images/pin_spritesheet.png", 122, 108, 7);
        game.load.image("tutorialButton", "assets/images/TITLE_help.png");
        game.load.image("smallCloseButton", "assets/images/TITLE_close.png");
        game.load.image("splash", "assets/images/WP_TITLE.png");
        game.load.image("scale9White", "assets/images/Scale9_WhiteRounded_01.png");
        game.load.image("tutorial1", "assets/images/Tutorial_Bubbles_01.jpg");
        game.load.image("tutorial2", "assets/images/Tutorial_Bubbles_02.jpg");
        game.load.image("tutorial3", "assets/images/Tutorial_Bubbles_03.jpg");
        game.load.image("playerGlow","assets/images/paddle_glow_00.png");
        game.load.image("bubble","assets/images/fireball_00.png");
        game.load.image("particle", "assets/images/particle.png");
        game.load.image("extendPowerup", "assets/images/extender_00.png");
        game.load.image("multiballPowerup", "assets/images/multiball_00.png");
        game.load.image("bgWhole", "assets/images/border_whole.jpg");
        game.load.image("5kGlow", "assets/images/glow_5k_00.png");
        game.load.image("10kGlow", "assets/images/glow_10k_00.png");
        game.load.image("bumperGlow", "assets/images/bumper_glow_00.png");
        game.load.image("scoreBG", "assets/images/UI_score_00.png");
        game.load.image("tick", "assets/images/tickmark_00.png");
        game.load.image("timeBG", "assets/images/UI_time_00.png");
        game.load.image("overLay", "assets/images/TITLE_OVERLAY.png");
        game.load.image("scoreContainer", "assets/images/WP_END_Container.png");
        game.load.image("scoreImage", "assets/images/WP_END_yourScore.png");
        game.load.image("topScoresContainer", "assets/images/WP_END_topscoresContainer.png");
        game.load.image("yourScoreBorder", "assets/images/WP_END_topscoresContainer_highlight.png");
        game.load.audio("bubbleHitsWall", "assets/audio/bubbleHitsWall.mp3");
        game.load.audio("bubbleHitsBubble", "assets/audio/bubbleHitsBubble.mp3");
        game.load.audio("bubbleFalls", "assets/audio/bubbleFalls.mp3");
        game.load.audio("bubbleInPocket", "assets/audio/bubbleInPocket.mp3");
        game.load.audio("bubbleInPocket10", "assets/audio/bubbleInPocket10.mp3");
        game.load.audio("bubbleHitsPaddle", "assets/audio/bubbleHitsPaddle.mp3");
        game.load.audio("bubbleHitsBumper1", "assets/audio/bumper1.mp3");
        game.load.audio("bubbleHitsBumper2", "assets/audio/bumper2.mp3");
        game.load.audio("bubbleHitsBumper3", "assets/audio/bumper3.mp3");
        game.load.audio("bubbleHitsBumper4", "assets/audio/bumper4.mp3");
        game.load.audio("bubbleHitsBumper5", "assets/audio/bumper5.mp3");
        game.load.audio("bubbleHitsBumper6", "assets/audio/bumper6.mp3");
        game.load.audio("bubbleHitsBumper7", "assets/audio/bumper7.mp3");
        game.load.audio("reward", "assets/audio/reward.mp3");
        game.load.audio("click", "assets/audio/click.mp3");
    },

    create: function() {

    },
    postCreate: function() {
        timePerFrame = GAME_SECONDS / TIMER_FRAMES;

        // physics
        game.world.setBounds(0, 0, gameWidth, gameHeight * 1.5);
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.985;

        playerCollisionGroup = game.physics.p2.createCollisionGroup();
        bubbleCollisionGroup = game.physics.p2.createCollisionGroup();
        otherCollisionGroup = game.physics.p2.createCollisionGroup();
        powerupCollisionGroup = game.physics.p2.createCollisionGroup();

        bgSpriteGroup = game.add.group();
        bgSpriteGroup.enableBody = true;
        bgSpriteGroup.physicsBodyType = Phaser.Physics.P2JS;
        createBackgroundOverlay();

        // bubbles
        bubbleEmitterGroup = game.add.group();
        bubbleSpriteGroup = game.add.group();
        bubbleSpriteGroup.enableBody = true;
        bubbleSpriteGroup.physicsBodyType = Phaser.Physics.P2JS;

        // other
        otherSpriteGroup = game.add.group();
        otherSpriteGroup.enableBody = true;
        otherSpriteGroup.physicsBodyType = Phaser.Physics.P2JS;
        others = [];

        coinsSpriteGroup = game.add.group();

        createBumper();
        createHoles();
        createDoors();
        createTicks();
        createGlows();

        powerupIcon = game.add.sprite(gameWidth * 0.4575, gameHeight * 0.01, "multiballPowerup");
        powerupIcon.scale.setTo(scale.x * 1.25, scale.y * 1.25);
        powerupIcon.alpha = 0.0;

        // player
        player = new Player();

        // controls
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        shiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.SHIFT ]);

        // UI
        uiGroup = game.add.group();
        buttonGroup = game.add.group();
        uiGroup.fixedToCamera = true;

        closeButton = game.add.button(OFFSCREEN, OFFSCREEN, "closeButton", null, this, 1,0,2, 0);
        closeButton.events.onInputUp.add(close, this);
        closeButton.scale.setTo(scale.x, scale.y);

        scoreContainer = game.add.sprite(OFFSCREEN,OFFSCREEN, "scoreContainer");
        scoreContainer.scale.setTo(scale.x, scale.y);
        scoreContainer.anchor.setTo(0.5, 0.5);

        scoreImage = game.add.sprite(OFFSCREEN,OFFSCREEN, "scoreImage");
        scoreImage.scale.setTo( scale.x,  scale.y);
        scoreImage.anchor.setTo(0.5,0.5);

        overLay = game.add.sprite(OFFSCREEN,OFFSCREEN,"overLay");
        overLay.scale.setTo( scale.x, scale.y);
        overLay.anchor.setTo(0.5,0.5);

        buttonGroup.add(closeButton);
        uiGroup.add(overLay);
        uiGroup.add(closeButton);
        uiGroup.add(scoreContainer);
        uiGroup.add(scoreImage);

        clickButtonAudio = game.add.audio("click");

        createTimer();

        createTutorial();
        createSplash();
        gameState = GameState.SPLASH;

        updateParentLoader(100);
    },

    update: function() {
        if (gameState == GameState.TUTORIAL) {
            if (game.input.activePointer.isDown) {
                inputDown = true;
            }
            else if (game.input.activePointer.isUp && inputDown) {
                advanceTutorial();
                inputDown = false;
            }
        }
        else {
            if (gameState == GameState.PLAY) {
                if (!textCreated) {
                    createText();
                    gameTimer = game.time.events.add(Phaser.Timer.SECOND * GAME_SECONDS, gameOver, this);
                    showTimer();
                }
                // spawn initial bubbles
                if (bubblesCreated < MAX_BUBBLES) {
                    bubbleTimer -= gameTimer.timer.elapsed;
                    if (bubbleTimer <= 0.0) {
                        bubbleTimer = BUBBLE_TIME;
                        createBubble();
                        bubblesCreated++;
                    }
                }

                if (powerup != null) {
                    powerup.update();
                    if (powerup.dead) {
                        powerup = null;
                    }
                }

                if (multiball) {
                    multiballTimer -= gameTimer.timer.elapsed;
                    if (multiballTimer <= 0.0 && bubbles.length < MAX_MULTIBALL_BUBBLES) {
                        multiballTimer = MULTIBALL_TIME;
                        createBubble();
                    }
                }

                setTimer();
                player.update();
                updateBubbles();
                updateOthers();
                updateGlows();

                var i;
                // update emitters
                for (i=emitters.length - 1; i>=0; i--) {
                    if (emitters[i].dead) {
                        var emitter = emitters[i];
                        emitter.timer -= gameTimer.timer.elapsed;
                        if (emitter.timer <= 0) {
                            emitters.splice(i, 1);
                            emitter.destroy();
                        }
                    }
                }

                // spawn new bubbles
                for (i=bubbleSpawnTimes.length - 1; i>=0; i--) {
                    bubbleSpawnTimes[i] -= gameTimer.timer.elapsed;
                    if (bubbleSpawnTimes[i] <= 0.0) {
                        if (bubbles.length < MAX_BUBBLES || (multiball && bubbles.length < MAX_MULTIBALL_BUBBLES)) {
                            createBubble();
                        }
                        bubbleSpawnTimes.splice(i, 1);
                    }
                }

                // check for bubble points
                for (i=bubbles.length - 1; i>=0; i--) {
                    var scored = false;
                    var scoreMod = 0;
                    var bubble = bubbles[i];
                    var bounds = bubble.sprite.getBounds();
                    if (Phaser.Rectangle.intersects(bounds, hole0)) {
                        scored = true;
                        scoreMod = 5000;
                        glow5kLeft.turnOn();
                    }
                    else if (Phaser.Rectangle.intersects(bounds, hole1)) {
                        scored = true;
                        scoreMod = 5000;
                        glow5kRight.turnOn();
                    }
                    else if (Phaser.Rectangle.intersects(bounds, hole3)) {
                        scored = true;
                        scoreMod = 10000;
                        glow10kLeft.turnOn();
                    }
                    else if (Phaser.Rectangle.intersects(bounds, hole4)) {
                        scored = true;
                        scoreMod = 10000;
                        glow10kRight.turnOn();
                    }
                    else if (coins != null && coins.canGet /* && coins.sprite.alpha >= COINS_OBTAIN_ALPHA */ && Phaser.Rectangle.intersects(bounds, coins.bounds)) {
                        addToScore(10000);
                        bubbles[i].playAudio(BubbleAudioType.REWARD);
                        gotCoins();
                        coinsTimer = 0;
                    }

                    if (scored) {
                        if (scoreMod == 5000)
                            bubbles[i].playAudio(BubbleAudioType.BUBBLE_IN_POCKET);
                        else
                            bubbles[i].playAudio(BubbleAudioType.BUBBLE_IN_POCKET_10);
                        addToScore(scoreMod);
                        createBubble(250 * scale.x, 400 * scale.y, bubble.scale);
                        removeBubble(bubble);
                    }
                }

                // spawn coins
                coinsTimer += gameTimer.timer.elapsed;
                if (coins == null && coinsTimer > COINS_SPAWN_TIME) {
                    coinsTimer = 0;
                    createCoins();
                }
                /*
                else if (coins != null)
                    coins.update();
                */

                if (shakeWorld > 0) {
                    var rand1 = getRandomInt(-10 * scale.x, 10 * scale.y);
                    var rand2 = getRandomInt(-10 * scale.x, 10 * scale.y);
                    game.world.setBounds(rand1, rand2, game.width + rand1, game.height + rand2);
                    shakeWorld--;
                    if (shakeWorld <= 0) {
                        game.world.setBounds(0, 0, game.width,game.height);
                        shakeWorld = 0;
                    }
                }
            }
            else if (gameState == GameState.WAIT_FOR_MOVE)
                player.update();
        }
    }
};

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "");
game.state.add("main", mainState);
game.state.start("main");

function createSplash() {
    splash = game.add.sprite(gameWidth * 0.06, gameHeight * 0.1, "splash");
    splash.scale.setTo(scale.x * 2, scale.y * 2);
    playButton = game.add.button(0, 0, "playButtonSheet", null, this, 1, 3, 2, 0);
    playButton.events.onInputUp.add(hideSplash, this);
    playButton.scale.setTo(scale.x, scale.y);
    playButton.x = gameWidth / 2 - (playButton.width / 2);
    playButton.y = gameHeight * 0.7;
    buttonGroup.add(playButton);
    overLay.x = game.width / 2;
    overLay.y = game.height / 2;
    uiGroup.add(playButton);

    tutorialButton = game.add.button(gameWidth * 0.01, gameHeight * 0.88, "tutorialButton", null, this);
    tutorialButton.events.onInputUp.add(clickTutorial, this);
    tutorialButton.scale.setTo(scale.x, scale.y);
    buttonGroup.add(tutorialButton);

    audioButton = game.add.button(gameWidth * 0.91, gameHeight * 0.88, "audioButtonSheet", null, this);
    audioButton.events.onInputUp.add(clickAudio, this);
    audioButton.frame = 1;
    audioButton.scale.setTo(scale.x, scale.y);
    buttonGroup.add(audioButton);

    smallCloseButton = game.add.button(gameWidth * 0.94, gameHeight * 0.01, "smallCloseButton", null, this);
    smallCloseButton.events.onInputUp.add(close, this);
    smallCloseButton.scale.setTo(scale.x, scale.y);
    buttonGroup.add(smallCloseButton);
    uiGroup.add(smallCloseButton);
}

function createTutorial() {
    tutorialIndex = 0;

    tutorialBG = game.add.sprite(gameWidth * 0.075, gameWidth * 0.11, "scale9White");
    tutorialBG.scale.setTo(scale.x, scale.y);
    tutorialBG.width = gameWidth * 0.85;
    tutorialBG.height = gameHeight * 0.6;
    tutorialBG.tint = 0x182a34;
    tutorialBG.alpha = 0.0;

    tutorialImage = game.add.sprite(gameWidth / 2, gameHeight * 0.35, "tutorial1");
    tutorialImage.anchor.setTo(0.5, 0.5);
    tutorialImage.scale.setTo(scale.x * 0.75, scale.y * 0.75);
    tutorialImage.alpha = 0.0;

    var style = { font: "32px Arial", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: wordWrapMod * scale.x };
    tutorialText = game.add.text(gameWidth / 2, gameHeight * 0.65, TUTORIAL_TEXT_1, style);
    tutorialText.anchor.setTo(0.5, 0.5);
    tutorialText.scale.setTo(scale.x, scale.y);
    tutorialText.alpha = 0.0;
}

function createBubble() {
    var bubble = new Bubble();
    bubbles.push(bubble);
}

function createCoins() {
    var random = getRandomInt(0, 1);
    if (random == 0)
        coins = new Coins(getRandomInt(300 * scale.x, 1100 * scale.x), getRandomInt(400 * scale.y, 600 * scale.y));
}

function createBackgroundOverlay() {
    /*
    if (DEBUG)
        bgOverlay = game.add.sprite(gameWidth / 2, gameHeight / 2, "bgWhole");
    else
        bgOverlay = otherSpriteGroup.create(gameWidth / 2, gameHeight / 2, "bgWhole");
    */

    bgOverlay = bgSpriteGroup.create(gameWidth / 2, gameHeight / 2, "bgWhole");
    bgOverlay.anchor.setTo(0.5, 0.5);
    bgOverlay.scale.setTo(scale.x, scale.y);
    if (DEBUG)
        game.physics.p2.enable(bgOverlay, true);
    bgOverlay.body.clearShapes();
    if (gameWidth == 1250)
        bgOverlay.body.loadPolygon("physicsData", "bgOverlay");
    else if (gameWidth == 1024)
        bgOverlay.body.loadPolygon("physicsData", "bgOverlayMedium");
    else
        bgOverlay.body.loadPolygon("physicsData", "bgOverlaySmall");
    bgOverlay.body.setCollisionGroup(otherCollisionGroup);
    bgOverlay.body.collides(bubbleCollisionGroup, otherHitBubble, this);
    bgOverlay.body.static = true;
}

function createTimer() {
    timeBG = game.add.sprite(0, 0, "timeBG");
    timeBG.scale.setTo(scale.x, scale.y);
    timeBG.x = gameWidth - (timeBG.width * 1.35);
    timeBG.alpha = 0.0;
    uiGroup.add(timeBG);

    timeGraphic = game.add.sprite(0, 0, "timerSheet");
    timeGraphic.scale.setTo(scale.x, scale.y);
    timeGraphic.x = gameWidth * 0.769;
    timeGraphic.y = gameHeight * 0.005;
    timeGraphic.alpha = 0.0;
    uiGroup.add(timeGraphic);

    var style = { font: "64px Knewave", fill: "#a8e8fa", align: "center" };
    timeText = game.add.text(gameWidth * 0.8545, gameHeight * 0.00125, GAME_SECONDS + " ", style);
    timeText.scale.setTo(scale.x, scale.y);
    timeText.alpha = 0.0;
    uiGroup.add(timeText);
}

function createBumper() {
    bumper = otherSpriteGroup.create(gameWidth / 2, 185.0 * scale.y);
    bumper.anchor.setTo(0.5, 0.5);
    bumper.scale.setTo(scale.x, scale.y);
    bumper.body.setCircle(133.0 * scale.x);
    bumper.body.setCollisionGroup(otherCollisionGroup);
    bumper.body.collides(bubbleCollisionGroup, bumperHitBubble, this);
    bumper.body.static = true;
}

function createHoles() {
    hole0 = new Phaser.Rectangle(50 * scale.x, 125 * scale.y, 100 * scale.x, 150 * scale.y); // top left
    hole1 = new Phaser.Rectangle(gameWidth - (150 * scale.x), 125 * scale.y, 100 * scale.x, 150 * scale.y); // top right
    hole3 = new Phaser.Rectangle((gameWidth / 4) + (42 * scale.x), 148 * scale.y, 15 * scale.x, 15 * scale.y); // left smallest hole
    hole4 = new Phaser.Rectangle((gameWidth * 3 / 4) - (52 * scale.x), 150 * scale.y, 15 * scale.x, 15 * scale.y); // right smallest hole
}

function createDoors() {
    door0 = otherSpriteGroup.create(105 * scale.x, 862.5 * scale.y, "gateOpen");
    door0.animations.add("open", [1, 2, 3, 4], 15, false);
    door0.animations.add("close", [4, 3, 2, 1], 15, false);
    door0.width = 75 * scale.x;
    door0.height = 150 * scale.y;
    door0.body.setRectangle(75.0 * scale.x, 150.0 * scale.y);
    door0.body.setCollisionGroup(otherCollisionGroup);
    door0.body.collides(bubbleCollisionGroup, doorHitBubble, this);
    door0.body.angle = -50;
    door0.body.static = true;

    door1 = otherSpriteGroup.create(1145 * scale.x, 867.5 * scale.y, "gateOpen");
    door1.animations.add("open", [1, 2, 3, 4], 15, false);
    door1.animations.add("close", [4, 3, 2, 1], 15, false);
    door1.width = 75 * scale.x;
    door1.height = 150 * scale.y;
    door1.scale.x *= -1;
    door1.body.setRectangle(75.0 * scale.x, 150.0 * scale.y);
    door1.body.setCollisionGroup(otherCollisionGroup);
    door1.body.collides(bubbleCollisionGroup, doorHitBubble, this);
    door1.body.static = true;
    door1.body.angle = 50;
}

function createTicks() {
    ticks = [];
    var tick = game.add.sprite(568 * scale.x, 120 * scale.y, "tick");
    tick.scale.setTo(scale.x, scale.y);
    tick.alpha = 0.0;
    ticks.push(tick);
    tick = game.add.sprite(583 * scale.x, 123 * scale.y, "tick");
    tick.scale.setTo(scale.x, scale.y);
    tick.alpha = 0.0;
    ticks.push(tick);
    tick = game.add.sprite(598 * scale.x, 126 * scale.y, "tick");
    tick.scale.setTo(scale.x, scale.y);
    tick.alpha = 0.0;
    ticks.push(tick);
    tick = game.add.sprite(613 * scale.x, 126 * scale.y, "tick");
    tick.scale.setTo(scale.x, scale.y);
    tick.alpha = 0.0;
    ticks.push(tick);
    tick = game.add.sprite(628 * scale.x, 123 * scale.y, "tick");
    tick.scale.setTo(scale.x, scale.y);
    tick.alpha = 0.0;
    ticks.push(tick);
    tick = game.add.sprite(643 * scale.x, 120 * scale.y, "tick");
    tick.scale.setTo(scale.x, scale.y);
    tick.alpha = 0.0;
    ticks.push(tick);
}

function createGlows() {
    glows = [];
    glow5kLeft = new Glow(game.add.sprite(90 * scale.x, 110 * scale.y, "5kGlow"));
    glows.push(glow5kLeft);
    glow5kRight = new Glow(game.add.sprite(1055 * scale.x, 110 * scale.y, "5kGlow"));
    glows.push(glow5kRight);
    glow10kLeft = new Glow(game.add.sprite(300 * scale.x, 80 * scale.y, "10kGlow"));
    glows.push(glow10kLeft);
    glow10kRight = new Glow(game.add.sprite(830 * scale.x, 80 * scale.y, "10kGlow"));
    glows.push(glow10kRight);
    bumperGlow = new Glow(game.add.sprite(485 * scale.x, 180 * scale.y, "bumperGlow"));
    glows.push(bumperGlow);
}

function createPowerup() {
    powerup = new Powerup();
}

function hideSplash(button) {
    //console.log("hideSplash");
    if (pointIntersectsRect(new Phaser.Point(game.input.x, game.input.y), new Phaser.Rectangle(button.position.x, button.position.y, button.width, button.height))) {
        if (audio)
            clickButtonAudio.play();
        if (parent.window.gameBridge) {
            parent.window.gameBridge.start();
        }
        // only support resizing until the start button has been pressed
        window.removeEventListener('resize', gameResizeHandler, false);
        splash.alpha = 0.0;
        playButton.x = OFFSCREEN;
        playButton.y = OFFSCREEN;
        tutorialButton.x = OFFSCREEN;
        tutorialButton.y = OFFSCREEN;
        audioButton.x = OFFSCREEN;
        audioButton.y = OFFSCREEN;
        // smallCloseButton.x = OFFSCREEN;
        // smallCloseButton.y = OFFSCREEN;
        gameState = GameState.TUTORIAL;
        showTutorial();
    }
}

function clickTutorial(button) {
    if (pointIntersectsRect(new Phaser.Point(game.input.x, game.input.y), new Phaser.Rectangle(button.position.x, button.position.y, button.width, button.height))) {
        if (!tutorial) {
            if (audio)
                clickButtonAudio.play();
            tutorialButton.inputEnabled = false;
            tutorial = true;
            splash.alpha = 0.0;
            playButton.x = OFFSCREEN;
            playButton.y = OFFSCREEN;
            gameState = GameState.TUTORIAL;
            showTutorial();
        }
    }
}

function showTutorial() {
    tutorialIndex = 0;
    tutorialText.text = TUTORIAL_TEXT_1;
    tutorialImage.loadTexture("tutorial1");
    tutorialBG.alpha = 1.0;
    tutorialImage.alpha = 1.0;
    tutorialText.alpha = 1.0;
    gameState = GameState.TUTORIAL;
}

function advanceTutorial() {
    if (audio)
        clickButtonAudio.play();
    switch (tutorialIndex) {
        case 0:
            tutorialImage.loadTexture("tutorial2");
            tutorialText.text = "Every time you get a ball in a hole, you get points. If you lose a ball, you lose points."
            tutorialIndex++;
            break;
        case 1:
            tutorialImage.loadTexture("tutorial3");
            tutorialText.text = "Hit the bumper in the middle to activate a powerup. More balls, or a bigger paddle.";
            tutorialIndex++;
            break;
        case 2:
            if (tutorial)
                backToSplash();
            else
                hideTutorial();
            break;
    }
}

function hideTutorial() {
    tutorialIndex = 0;
    tutorialBG.alpha = 0.0;
    tutorialImage.alpha = 0.0;
    tutorialText.alpha = 0.0;
    initialize();
}

function backToSplash() {
    tutorialBG.alpha = 0.0;
    tutorialImage.alpha = 0.0;
    tutorialText.alpha = 0.0;
    splash.alpha = 1.0;
    playButton.x = gameWidth / 2 - (playButton.width / 2);
    playButton.y = gameHeight * 0.7;
    gameState = GameState.SPLASH;
    tutorial = false;
    tutorialButton.inputEnabled = true;
    tutorialButton.input.useHandCursor = true;
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

function initialize() {
    score = 0;
    coinsTimer = 0;
    coins = null;
    powerup = null;
    powerupFalling = false;
    player.powerup = false;
    multiball = false;
    tickCount = 0;
    shakeWorld = 0;
    bubblesCreated = 0;
    bubbleTimer = BUBBLE_TIME;
    bubbles = [];
    emitters = [];
    gameState = GameState.WAIT_FOR_MOVE;
    bubbleSpawnTimes = [];
    bubbleSpawnScales = [];
    closeButton.x = OFFSCREEN;
    closeButton.y = OFFSCREEN;
    overLay.x = OFFSCREEN;
    overLay.y = OFFSCREEN;
    startInputX = game.input.x;
}

// updates
function updateBubbles() {
    //console.log(bubbles.length);
    for (var i=0; i<bubbles.length; i++) {
        bubbles[i].update();
    }
}

function updateOthers() {
    for (var i=0; i<others.length; i++) {
        others[i].update();
    }
}

function updateGlows() {
    for (var i=0; i<glows.length; i++) {
        glows[i].update();
    }
}

// collisions
function otherHitBubble(other, bubble) {
    bubble.bubble.playAudio(BubbleAudioType.BUBBLE_HITS_WALL);
}

function bumperHitBubble(bumper, bubble) {
    if (!powerupFalling && !player.powerup && tickCount < 6) {
        bumperGlow.turnOn();
        bubble.bubble.playBumper(tickCount + 1);
        if (tickCount < 6) {
            tickCount++;
            ticks[tickCount - 1].alpha = 1.0;
        }
        if (tickCount == 6) {
            powerup = true;
            powerupFalling = true;
            createPowerup();
        }
    }
}

function resetBumper() {
    tickCount = 0;
    for (var i=0; i<ticks.length; i++)
        ticks[i].alpha = 0.0;
}

function doorHitBubble(door, bubble) {
    bubble.bubble.playAudio(BubbleAudioType.BUBBLE_HITS_WALL);
}

function playerHitBubble(player, bubble) {
    addToScore(1000);
    hitBubble();
    bubble.bubble.playAudio(BubbleAudioType.BUBBLE_HITS_PADDLE);
}

function bubbleHitBubble(bubble1, bubble2) {
    bubble1.bubble.playAudio(BubbleAudioType.BUBBLE_HITS_BUBBLE);
}

function powerupHitPlayer(powerup) {
    powerup.powerup.got();
    powerup.powerup = null;
}

function playerHitPowerup() {
}

// removals
function removeBubble(bubble) {
    bubble.removeSprites();
    //console.log("removed bubble, now count = " + bubbles.length);
}

function gotCoins() {
    coins.got();
}

function removeCoins() {
    coins = null;
}

// resets
function gameOver() {
    smallCloseButton.x = OFFSCREEN;
    smallCloseButton.y = OFFSCREEN;
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

    for (var i=0; i<scoreText.length; i++)
    {
        scoreText[i].text = "";
        scoreText[i].alpha = 0.0;
    }

    //console.log("game over");
    gameState = GameState.GAME_OVER;
    gameOverText.alpha = 1.0;

    gameOverText.text = score + " ";

    timeText.setText("0 ");
    timeGraphic.alpha = 0.0;

    player.stop();

    var i;
    for (i=0; i<bubbles.length; i++) {
        bubbles[i].freezeAll();
    }
    for (i=emitters.length - 1; i>=0; i--) {
        emitters[i].destroy();
    }

    overLay.x = game.width / 2;
    overLay.y = game.height / 2;

    scoreImage.x = game.width / 2;
    scoreImage.y = game.height * 0.1;

    scoreContainer.x = gameOverText.x;
    scoreContainer.y = gameOverText.y;

    timeText.alpha = 0.0;
    scoreBG.alpha = 0.0;
    timeBG.alpha= 0.0;
    if (powerup != null)
        powerup.destroy();
    powerupIcon.alpha = 0.0;
}

function finishGameOver(leaderboardText) {
    // score = 125910;

    // top scores container
    var topScoresContainer = game.add.sprite(gameWidth / 2, gameHeight * 0.575, "topScoresContainer");
    topScoresContainer.scale.setTo(scale.x, scale.y);
    topScoresContainer.anchor.setTo(0.5, 0.5);

    var style = {font: "64px Knewave", fill: "#ffffff", boundsAlignH: "left", boundsAlignV: "middle"};
    var topScoresHeaderText = game.add.text(gameWidth * 0.5, gameHeight * 0.405, "TOP SCORES ", style);
    topScoresHeaderText.anchor.setTo(0.5, 0.5);
    topScoresHeaderText.scale.setTo(scale.x, scale.y);

    style.font = "42px Knewave";
    var allTimeHeader = game.add.text(gameWidth * 0.28, gameHeight * 0.47, "ALL TIME ", style);
    allTimeHeader.anchor.setTo(0.5, 0.5);
    allTimeHeader.scale.setTo(scale.x, scale.y);
    var weeklyHeader = game.add.text(gameWidth * 0.72, gameHeight * 0.47, "WEEKLY ", style);
    weeklyHeader.anchor.setTo(0.5, 0.5);
    weeklyHeader.scale.setTo(scale.x, scale.y);

    var allTimeHighScoreIndex = findScoreIndex(leaderboardText, 'allTimeScores');

    if (allTimeHighScoreIndex != -1) {
        var yourScoreBorder = game.add.sprite(0, 0, "yourScoreBorder");
        yourScoreBorder.scale.setTo(scale.x, scale.y);
        yourScoreBorder.x = gameWidth * 0.095;
        yourScoreBorder.y = gameHeight * 0.5 + (gameHeight * 0.056 * allTimeHighScoreIndex);
    }

    var weeklyHighScoreIndex = findScoreIndex(leaderboardText, 'currentWeekScores');
    if (weeklyHighScoreIndex != -1) {
        var weeklyScoreBorder = game.add.sprite(0, 0, "yourScoreBorder");
        weeklyScoreBorder.scale.setTo(scale.x, scale.y);
        weeklyScoreBorder.x = gameWidth * 0.52;
        weeklyScoreBorder.y = gameHeight * 0.5 + (gameHeight * 0.056 * weeklyHighScoreIndex);
    }

    style.font = "36px Knewave";
    style.align = "left";
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
            scoreTextRight += weeklyEntry.score + " \n"; // "999999\n"; //
        }
        else
            scoreTextRight += "\n";
    }

    style.align = "center";
    var indexTextBlock = game.add.text(gameWidth * 0.096, gameHeight * 0.495, indexTextLeft, style);
    indexTextBlock.lineSpacing = TOP_SCORES_Y;
    indexTextBlock.scale.setTo(scale.x, scale.y);

    indexTextBlock = game.add.text(gameWidth * 0.526, gameHeight * 0.495, indexTextRight, style);
    indexTextBlock.lineSpacing = TOP_SCORES_Y;
    indexTextBlock.scale.setTo(scale.x, scale.y);

    style.align = "left";
    var nameTextBlock = game.add.text(gameWidth * 0.13, gameHeight * 0.495, nameTextLeft, style);
    nameTextBlock.lineSpacing = TOP_SCORES_Y;
    nameTextBlock.scale.setTo(scale.x, scale.y);

    nameTextBlock = game.add.text(gameWidth * 0.56, gameHeight * 0.495, nameTextRight, style);
    nameTextBlock.lineSpacing = TOP_SCORES_Y;
    nameTextBlock.scale.setTo(scale.x, scale.y);

    style.align = "right";
    var scoreTextBlock = game.add.text(gameWidth * 0.37, gameHeight * 0.495, scoreTextLeft, style);
    scoreTextBlock.lineSpacing = TOP_SCORES_Y;
    scoreTextBlock.scale.setTo(scale.x, scale.y);

    scoreTextBlock = game.add.text(gameWidth * 0.795, gameHeight * 0.495, scoreTextRight, style);
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

// UI functions
function setTimer() {
    var secondsLeft = Math.ceil(getTimerDuration() / 1000);
    timeText.setText(secondsLeft + " ");
    var baseNum = Math.ceil(secondsLeft / timePerFrame);
    var frame = TIMER_FRAMES - baseNum;
    timeGraphic.frame = frame;
}

function showTimer() {
    timeBG.alpha = 1.0;
    timeGraphic.alpha = 1.0;
    timeText.alpha = 1.0;
}

function getTimerDuration() {
    return gameTimer.tick - gameTimer.timer._now;
}

function createText() {
    // console.log("createText");
    var style = { font: "64px Knewave", fill: "#a8e8fa", align: "center" };
    var startX = gameWidth * 0.005;
    scoreBG = uiGroup.create(startX, 0, "scoreBG");
    scoreBG.scale.setTo(scale.x, scale.y);
    scoreText = [];
    var text = game.add.text(startX + scoreBG.width * 0.82, scoreBG.height * -0.0125, "0 ", style);
    text.scale.setTo(scale.x, scale.y);
    scoreText.push(text);
    uiGroup.add(text);
    text = game.add.text(startX + scoreBG.width * 0.69, scoreBG.height * -0.0125, "", style);
    text.scale.setTo(scale.x, scale.y);
    scoreText.push(text);
    uiGroup.add(text);
    text = game.add.text(startX + scoreBG.width * 0.555, scoreBG.height * -0.0125, "", style);
    text.scale.setTo(scale.x, scale.y);
    scoreText.push(text);
    uiGroup.add(text);
    text = game.add.text(startX + scoreBG.width * 0.425, scoreBG.height * -0.0125, "", style);
    text.scale.setTo(scale.x, scale.y);
    scoreText.push(text);
    uiGroup.add(text);
    text = game.add.text(startX + scoreBG.width * 0.295, scoreBG.height * -0.0125, "", style);
    text.scale.setTo(scale.x, scale.y);
    scoreText.push(text);
    uiGroup.add(text);
    text = game.add.text(startX + scoreBG.width * 0.165, scoreBG.height * -0.0125, "", style);
    text.scale.setTo(scale.x, scale.y);
    scoreText.push(text);
    uiGroup.add(text);

    style.fill = "#ffffff";
    style.align = "center";
    gameOverText = game.add.text(gameWidth / 2, gameHeight * 0.25, "GAME OVER!", style);
    gameOverText.anchor.setTo(0.5, 0.5);
    gameOverText.scale.setTo(scale.x,scale.y);
    gameOverText.alpha = 0.0;

    textCreated = true;
}

function addToScore(mod) {
    score += mod;
    if (score < 0)
        score = 0;
    if (mod < 0)
        resetScoreText();
    for (var i=score.toString().length - 1; i>=0; i--) {
        scoreText[score.toString().length - 1 - i].setText(score.toString()[i] + " ");
        //console.log("score digit " + i);
    }
}

function resetScoreText() {
    for (i=0; i<scoreText.length; i++) {
        if (i == 0)
            scoreText[i].setText("0 ");
        else
            scoreText[i].setText("");
    }
}

function hitBubble()
{
    player.hitTimer = PADDLE_GLOW_TIME;
    //console.log(player.hitTimer);
}

// classes
function Bubble() {
    var randomCorner = getRandomInt(0, 1);
    var randomVelocity = getRandomInt(BUBBLE_MIN_SPEED, BUBBLE_MAX_SPEED);
    var position, velocity;
    if (randomCorner == 0) {
        position = new Phaser.Point(50 * scale.x, 900 * scale.y);
        velocity = new Phaser.Point(randomVelocity, -randomVelocity);
        door0.animations.play("open");
        door0.animations.currentAnim.onComplete.add(function () { door0.animations.play("close"); }, this);
    }
    else {
        position = new Phaser.Point(1200 * scale.x, 900 * scale.y);
        velocity = new Phaser.Point(-randomVelocity, -randomVelocity);
        door1.animations.play("open");
        door1.animations.currentAnim.onComplete.add(function () { door1.animations.play("close"); }, this);
    }
    this.scale = 0.5;

    this.emitter = game.add.emitter(0, 0, 50);
    this.emitter.makeParticles("particle");
    this.emitter.setScale(1.1, 0, 1.1, 0, 350);
    this.emitter.start(false, 200, 5);

    bubbleEmitterGroup.add(this.emitter);
    emitters.push(this.emitter);

    this.sprite = bubbleSpriteGroup.create(position.x, position.y, "bubble");
    this.sprite.scale.setTo(this.scale * scale.x, this.scale * scale.y);
    this.sprite.body.setCircle(BUBBLE_COLLISION_SIZE * this.scale * scale.x);
    this.sprite.body.velocity.x = velocity.x;
    this.sprite.body.velocity.y = velocity.y;
    this.sprite.body.friction = 0.0;
    this.sprite.body.damping = 0.0;
    this.sprite.body.mass = 0.5;
    this.sprite.body.bubble = this;
    this.dead = false;
    this.newSpawn = true;

    // audio
    this.bubbleHitsBubbleAudio = game.add.audio("bubbleHitsBubble");
    this.bubbleHitsWallAudio = game.add.audio("bubbleHitsWall");
    this.bubbleFallsAudio = game.add.audio("bubbleFalls");
    this.bubbleInPocketAudio = game.add.audio("bubbleInPocket");
    this.bubbleInPocket10Audio = game.add.audio("bubbleInPocket10");
    this.bubbleHitsPaddleAudio = game.add.audio("bubbleHitsPaddle");
    this.bubbleHitsReward = game.add.audio("reward");
    this.bumper1 = game.add.audio("bubbleHitsBumper1");
    this.bumper2 = game.add.audio("bubbleHitsBumper2");
    this.bumper3 = game.add.audio("bubbleHitsBumper3");
    this.bumper4 = game.add.audio("bubbleHitsBumper4");
    this.bumper5 = game.add.audio("bubbleHitsBumper5");
    this.bumper6 = game.add.audio("bubbleHitsBumper6");
    this.bumper7 = game.add.audio("bubbleHitsBumper7");

    this.update = function() {
        if (!this.dead) {
            // set paricle positions
            var randomX = getRandomDouble(-10, 10);
            var randomY = getRandomDouble(-10, 10);
            this.emitter.x = this.sprite.x + randomX;
            this.emitter.y = this.sprite.y + randomY;

            // set particle colors
            this.emitter.forEach(function(particle) {
                if (particle.scale.x >= 0.75)
                    particle.tint = 0xfcc832;
                else if (particle.scale.x >= 0.5)
                    particle.tint = 0xff6f32;
                else
                    particle.tint = 0x323d66;

            });

            if (this.newSpawn) {
                if (this.sprite.y <= 850 * scale.y) {
                    this.newSpawn = false;
                    this.sprite.body.setCollisionGroup(bubbleCollisionGroup);
                    this.sprite.body.collides([playerCollisionGroup, otherCollisionGroup]);
                    this.sprite.body.collides(bubbleCollisionGroup, bubbleHitBubble, this);
                }
            }
            else {
                if (this.sprite.body.y > gameHeight) {
                    shakeWorld = SHAKE_TIME;
                    this.playAudio(BubbleAudioType.BUBBLE_FALLS);
                    addToScore(-5000);
                    bubbleSpawnTimes.push(BUBBLE_SPAWN_TIME);
                    //console.log("added bubble to spawn with scale " + this.scale);
                    this.removeSprites();
                    this.dead = true;
                }
                else {
                    game.world.bringToTop(this.sprite);

                    constrainVelocity(this.sprite);
                }
            }
        }
    }

    this.removeSprites = function() {
        // remove the main sprite
        this.sprite.body.destroy();
        this.sprite.body = null;
        bubbleSpriteGroup.remove(this.sprite);

        // remove from the array of bubbles
        var index = bubbles.indexOf(this);
        bubbles.splice(index, 1);
        this.sprite.destroy();
        this.sprite = null;

        this.emitter.on = false;
        this.emitter.dead = true;
        this.emitter.timer = 500;
    }

    this.freezeAll = function() {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
    }

    this.playAudio = function(bubbleAudioType) {
        if (audio) {
            switch (bubbleAudioType) {
                case BubbleAudioType.BUBBLE_FALLS:
                    this.bubbleFallsAudio.play();
                    break;
                case BubbleAudioType.BUBBLE_IN_POCKET:
                    this.bubbleInPocketAudio.play();
                    break;
                case BubbleAudioType.BUBBLE_IN_POCKET_10:
                    this.bubbleInPocket10Audio.play();
                    break;
                case BubbleAudioType.BUBBLE_HITS_BUBBLE:
                    this.bubbleHitsBubbleAudio.play();
                    break;
                case BubbleAudioType.BUBBLE_HITS_WALL:
                    this.bubbleHitsWallAudio.play();
                    break;
                case BubbleAudioType.BUBBLE_HITS_PADDLE:
                    this.bubbleHitsPaddleAudio.play();
                    break;
                case BubbleAudioType.BUBBLE_HITS_BUMPER:
                    this.bubbleHitsPaddleAudio.play();
                    break;
                case BubbleAudioType.REWARD:
                    this.bubbleHitsReward.play();
                    break;
            }
        }
    }

    this.playBumper = function(value) {
        if (audio) {
            switch (value) {
                case 1:
                    this.bumper1.play();
                    break;
                case 2:
                    this.bumper2.play();
                    break;
                case 3:
                    this.bumper3.play();
                    break;
                case 4:
                    this.bumper4.play();
                    break;
                case 5:
                    this.bumper5.play();
                    break;
                case 6:
                    this.bumper6.play();
                    break;
                case 7:
                    this.bumper7.play();
                    break;
            }
        }
    }
}

function Coins(x, y) {
    this.sprite = coinsSpriteGroup.create(x, y, "pinSheet");
    this.sprite.scale.setTo(scale.x, scale.y);
    this.fadeInAnimation = this.sprite.animations.add("fadeIn", [0,1,2,3], 10, false);
    this.fadeOutAnimation = this.sprite.animations.add("fadeOut", [4,5,6], 10, false);
    // this.sprite.alpha = 0.0;
    var offset = this.sprite.width * 0.125;
    this.bounds = new Phaser.Rectangle(x + (offset * 2), y + offset, this.sprite.width - (offset * 4), this.sprite.height - (offset * 2));
    this.canGet = false;
    this.fadeInAnimation.play();
    this.sprite.animations.currentAnim.onComplete.add(function() { this.canGet = true; }, this);

    /*
    this.update = function() {
        if (this.sprite.alpha < 1.0) {
            this.sprite.alpha += COINS_FADE_IN_SPEED;
            if (this.sprite.alpha > 1.0)
                this.sprite.alpha = 1.0;
        }
    }
    */
    this.got = function() {
        if (this.canGet) {
            this.canGet = false;
            this.fadeOutAnimation.play();
            this.sprite.animations.currentAnim.onComplete.add(function () { this.remove(); }, this);
        }
        //coins.sprite.destroy();
        //coins = null;
    }

    this.remove = function() {
        this.sprite.destroy();
        removeCoins();
    }
}

function Player() {
    this.sprite = game.add.sprite(0, 0, "player");
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.setTo(scale.x, scale.y);
    this.sprite.x = gameWidth / 2;
    this.sprite.y = gameHeight - (this.sprite.height * .95);

    this.glowSprite = game.add.sprite(0, 0, "playerGlow");
    this.glowSprite.anchor.setTo(0.5, 0.5);
    this.glowSprite.scale.setTo(scale.x, scale.y);
    this.glowSprite.x = this.sprite.x;
    this.glowSprite.y = this.sprite.y;
    this.glowSprite.alpha = 0.35;

    game.physics.p2.enable(this.sprite, DEBUG);
    this.sprite.body.clearShapes();
    this.sprite.body.loadPolygon("physicsData", playerPhysicsDataKey);
    this.powerup = false;
    this.powerupTimer = 0.0;
    this.hitTimer =0.0;
    this.maxX = NORMAL_MAX_X;
    this.minX = NORMAL_MIN_X;
    this.powerupType = null;

    this.update = function() {
        if (gameState == GameState.PLAY) {
            if (this.powerup) {
                this.powerupTimer -= gameTimer.timer.elapsed;
                if (this.powerupTimer <= 0.0) {
                    switch (this.powerupType) {
                        case PowerupType.ENLARGE:
                            this.shrink();
                            break;
                        case PowerupType.MULTIBALL:
                            multiball = false;
                            break;
                    }
                    this.powerup = false;
                    powerupIcon.alpha = 0.0;
                    resetBumper();
                }
            }
            //console.log(game.input.x);
            if (gameState == GameState.WAIT_FOR_MOVE)
                gameState = GameState.PLAY;
            if (game.input.x > this.maxX * scale.x)
                this.sprite.body.x = this.maxX * scale.x;
            else if (game.input.x < this.minX  * scale.x)
                this.sprite.body.x = this.minX  * scale.x;
            else
                this.sprite.body.x = game.input.x;
            this.glowSprite.x = this.sprite.x;

            if (this.hitTimer > 0.0)
            {
                this.hitTimer -= gameTimer.timer.elapsed;
                this.glowSprite.alpha = this.hitTimer/PADDLE_GLOW_TIME;

            }
        }
        else if (game.input.x != startInputX)
            gameState = GameState.PLAY;
    }

    this.setCollisionData = function() {
        this.sprite.body.setCollisionGroup(playerCollisionGroup);
        this.sprite.body.collides(bubbleCollisionGroup, playerHitBubble, this);
        this.sprite.body.collides(powerupCollisionGroup, playerHitPowerup, this);
        this.sprite.body.static = true;
    }

    this.enlarge = function() {
        this.maxX = LARGE_MAX_X;
        this.minX = LARGE_MIN_X;
        this.sprite.scale.setTo(scale.x * 1.35, scale.y);
        this.glowSprite.scale.setTo(scale.x * 1.35, scale.y);
        this.sprite.body.clearShapes();
        this.sprite.body.loadPolygon("physicsData", playerLargerPhysicsDataKey);
        this.setCollisionData();
    }

    this.shrink = function() {
        this.maxX = NORMAL_MAX_X;
        this.minX = NORMAL_MIN_X;
        this.sprite.scale.setTo(scale.x, scale.y);
        this.glowSprite.scale.setTo(scale.x, scale.y);
        this.sprite.body.clearShapes();
        this.sprite.body.loadPolygon("physicsData", playerPhysicsDataKey);
        this.setCollisionData();
    }

    this.stop = function() {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
    }

    this.setCollisionData();
}

function Powerup() {
    var random = getRandomInt(0, 1);
    var spriteName = "";
    switch (random) {
        case 0:
            this.type = PowerupType.ENLARGE;
            spriteName = "extendPowerup";
            break;
        case 1:
            this.type = PowerupType.MULTIBALL;
            spriteName = "multiballPowerup";
            break;
    }
    this.sprite = game.add.sprite(gameWidth / 2, 300 * scale.y, spriteName);
    this.sprite.scale.setTo(scale.x, scale.y);
    game.physics.p2.enable(this.sprite, false);
    this.sprite.body.setCircle(BUBBLE_COLLISION_SIZE * this.scale * scale.x);
    this.sprite.body.setCollisionGroup(powerupCollisionGroup);
    this.sprite.body.collides(playerCollisionGroup, powerupHitPlayer, this);
    this.sprite.body.powerup = this;
    this.dead = false;

    this.update = function() {
        if (!this.dead) {
            this.sprite.body.y += 5 * scale.y;
            if (this.sprite.body.y > gameHeight) {
                this.destroy();
                resetBumper();
                powerupFalling = false;
            }
        }
    }

    this.got = function() {
        switch (this.type) {
            case PowerupType.ENLARGE:
                player.enlarge();
                player.powerupType = PowerupType.ENLARGE;
                powerupIcon.loadTexture("extendPowerup");
                break;
            case PowerupType.MULTIBALL:
                multiball = true;
                multiballTimer = MULTIBALL_TIME;
                player.powerupType = PowerupType.MULTIBALL;
                powerupIcon.loadTexture("multiballPowerup");
                break;
        }
        powerupIcon.alpha = 1.0;
        player.powerup = true;
        player.powerupTimer = POWERUP_TIME;
        this.destroy();
        powerupFalling = false;
    }

    this.destroy = function() {
        this.sprite.destroy();
        this.sprite = null;
        this.dead = true;
    }
}

function Glow(sprite) {
    this.sprite = sprite;
    this.sprite.scale.setTo(scale.x, scale.y);
    this.sprite.alpha = 0.0;
    this.timer = 0;

    this.update = function() {
        if (this.timer > 0) {
            this.timer -= gameTimer.timer.elapsed;
            this.sprite.alpha -= GLOW_FADE_RATE;
            if (this.timer <= 0) {
                this.timer = 0;
                this.sprite.alpha = 0.0;
            }
        }
    }

    this.turnOn = function(x, y) {
        this.timer = GLOW_TIME;
        this.sprite.alpha = 1.0;
    }
}

// utilities
function getRandomColor() {
    var index = Math.floor(Math.random() * 5);
    switch (index) {
        case 0:
            return 0x7aa31d;
        case 1:
            return 0x1c9074;
        case 2:
            return 0xfca442;
        case 3:
            return 0xf33875;
        case 4:
            return 0x574ac3;
    }
    return 0x000000;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDouble(min, max) {
  return Math.random() * (max - min) + min;
}

function constrainVelocity(sprite) {
    var body = sprite.body;
    var angle, currVelocitySqr, vx, vy;
    vx = body.data.velocity[0];
    vy = body.data.velocity[1];
    currVelocitySqr = vx * vx + vy * vy;
    if (currVelocitySqr > MAX_VELOCITY * MAX_VELOCITY) {
        angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * MAX_VELOCITY;
        vy = Math.sin(angle) * MAX_VELOCITY;
        body.data.velocity[0] = vx;
        body.data.velocity[1] = vy;
    }
    else if (currVelocitySqr < MIN_VELOCITY * MIN_VELOCITY) {
        angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * MIN_VELOCITY;
        vy = Math.sin(angle) * MIN_VELOCITY;
        body.data.velocity[0] = vx;
        body.data.velocity[1] = vy;
    }
}

function remainderMod(n, d) {
  return n - (d * (n/d | 0));
}

function pointIntersectsRect(point, rect) {
    if (point.x >= rect.x && point.x <= (rect.x + rect.width) && point.y >= rect.y && point.y <= (rect.y + rect.height))
        return true;
    return false;
}
document.addEventListener('DOMContentLoaded', function () {
  let appStarted = false;

  let rotateMessage = document.getElementById('rotateDevice');
  rotateMessage.style.display = "block"; // Always display the new menu

  document.getElementById('proceedAnyway').addEventListener('click', function() {
    rotateMessage.style.display = 'none';
    // Run your app's main function here if it's not already running
    if (!appStarted) {
      mainAppFunction();
      appStarted = true;
      
    }
  });

  function mainAppFunction() {
    let leveling = false;
    let timer = null;
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: Math.max(window.innerHeight),
    antialias: true,
    transparent: false,
    resolution: 1,
  });
  let volumeButton;
  let sharkEmergeTextures;
  let pauseMenuContainer;
  let flashing = false;
  let reviveDialogContainer;
  let gameData;
  document.body.appendChild(app.view);
  let critter;
  let enemyTypes = [];
  let frogGhostPlayer;
  let fullReset = false;
  let exploded = false;
  let enemyDeath;
  let frogWalkTextures;
  let frogAttackTextures;
  let expToLevel = 100;
  let currentRound;
  let foreground;
  let critterWalkTextures;
  if (!currentRound) { currentRound = 1; }
  let roundOver = false;
  let playerHealth = 100;
  let coffee = 0;
  let frogSize = .35;
  let speed = 1;
  let choose = false;
  if (speed == 0) {
    speed = 1;
  }
  let backgroundSprite;

  let speedChanged = false;
  let selectLevel = 0;
  let frogTintColor = 0xffffff;
  let snailSpeed = 1;
  let snailDamage = 16;
  let snailHealth = 100;
  let snailLevel = 1;
  let beeLevel = 1;
  let birdLevel = 1;
  let birdSpeed = 1;
  let birdDamage = 10;
  let touchCount = 0;
  let birdHealth = 100;
  let beeSpeed = 1;
  let beeDamage = 16;
  let beeHealth = 100;
  let frogSpeed = 1;
  let frogDamage = 16;
  let frogHealth = 100;
  let frogLevel = 1;
  let currentFrogHealth = 100;
  let currentSnailHealth = 100;
  let currentBeeHealth = 100;
  let currentBirdHealth = 100;
  let charSwap = false;
  let currentCharacter = "character-frog";
  let isCharAttacking = false;
  let playerEXP = 0;
  let repicked = false;
  let isDead = false;
  let enemiesInRange = 0;
  let areResetting = false;
  let isPaused = false;
  let isWiped = false;
  let isAttackingChar = false;
  let isGameStarted = false;
  let initialClouds = 0;
  let frogEXP = 0;
  let snailEXP = 0;
  let beeEXP = 0;
  let birdEXP = 0;
  let frogEXPToLevel = 100;
  let snailEXPToLevel = 100;
  let beeEXPToLevel = 100;
  let birdEXPToLevel = 100;
  let cooldownActive = false; // Track the cooldown status
  const cooldownDuration = 3000; // Cooldown duration in milliseconds
  let stored = 0;
  let enemies = [];
  let isCharacterMenuOpen = false; // Flag to track if the character menu is open
  let selectedCharacter = getCurrentCharacter(); // Track the currently selected character
  const flashDuration = 100; // Adjust as needed (in milliseconds)
  const flashColor = 0xff5555; // Bright red color
  const attackSound = new Audio();
  attackSound.src = "./attacksound.wav";
  const chooseSound = new Audio();
  chooseSound.src = "./upgradeavailable.wav";
  const levelSound = new Audio();
  levelSound.src = "./levelup.wav";
  levelSound.volume = .2;
  const hitSound = new Audio();
  hitSound.src = "./hurt.wav";
  let isCombat = false;
  let isPointerDown = false;
  const menuTexture = PIXI.Texture.from('https://i.imgur.com/YtBjxdf.png');
  const menuSprite = new PIXI.Sprite(menuTexture);
  let characterPositions = {
    "character-snail": { top: "-50px", left: "calc(45% - 70px)" },
    "character-frog": { top: "-50px", left: "calc(45% - 70px)" },
    "character-bird": { top: "-50px", left: "calc(45% - 10px)" },
    "character-bee": { top: "-50px", left: "calc(45% + 50px)" }
  };

  let characterStats = {
    'character-frog': { speed: getFrogSpeed(), attack: getFrogDamage(), health: getFrogHealth() },
    'character-snail': { speed: getSnailSpeed(), attack: getSnailDamage(), health: getSnailHealth() },
    'character-bird': { speed: getBirdSpeed(), attack: getBirdDamage(), health: getBirdHealth() },
    'character-bee': { speed: getBeeSpeed(), attack: getBeeDamage(), health: getBeeHealth() },
    // Add stats for other characters here
  };

  const enemyPortraits = [
    { name: 'ele_portrait', url: 'https://i.imgur.com/Zvw72h5.png' },
    { name: 'octo_portrait', url: 'https://i.imgur.com/F3OYSDm.png' },
    { name: 'pig_portrait', url: 'https://i.imgur.com/ZxaI7rG.png' },
    { name: 'scorp_portrait', url: 'https://i.imgur.com/u2T4oon.png' },
    { name: 'toofer_portrait', url: 'https://i.imgur.com/lNPjWon.png' },
    { name: 'imp_portrait', url: 'https://i.imgur.com/1EFx7kH.png' },
    { name: 'puffer_portrait', url: 'https://i.imgur.com/9gLYMax.png' },
    { name: 'shark_portrait', url: 'https://i.imgur.com/9gLYMax.png' }
  ];

  const portraitNames = {
    'ele': 'ele_portrait',
    'puffer': 'puffer_portrait',
    'octo': 'octo_portrait',
    'pig': 'pig_portrait',
    'scorp': 'scorp_portrait',
    'toofer': 'toofer_portrait',
    'imp': 'imp_portrait',
  };

  let pauseTime = null;
  let startTime = null;
  let isPaused1 = false;
  let timerFinished = false;
  let totalPausedTime = 0;
  let resetStartTime = null;
  // Start Timer
  function startTimer() {
    if (timerFinished) return;

    const snail = document.getElementById('snail');
    const progressFilled = document.getElementById('progress-filled');

    if (isPaused1) {
      // Resume from the paused time
      const currentTime = Date.now();
      const pausedDuration = currentTime - pauseTime;
      totalPausedTime += pausedDuration;
      startTime = resetStartTime + totalPausedTime;
      isPaused1 = false;
    } else if (!timer) {
      // Start from the beginning
      resetStartTime = Date.now();
      startTime = resetStartTime;
      totalPausedTime = 0;
    }

    if (timer) {
      clearInterval(timer);
    }

    // Cause a reflow by accessing offsetWidth
    snail.getBoundingClientRect();
    progressFilled.getBoundingClientRect();

    // Set the animations
    snail.style.animation = 'snail-movement 60s linear, snail-animation 1s steps(2) infinite';
    progressFilled.style.animation = 'progress-fill 60s linear';
    setTimeout(() => {
      snail.style.animationPlayState = 'running';
      progressFilled.style.animationPlayState = 'running';
    }, 0);
  

    timer = setInterval(() => {
      const diff = Date.now() - startTime;
      const percentage = Math.min(diff / 60000, 1); // 100 seconds

      if (percentage === 1) {
        clearInterval(timer);
        timer = null;
        timerFinished = true;
        snail.style.animation = 'none';
        progressFilled.style.animation = 'none';
        snail.style.left = 'calc(80vw)';  // Changed line
        progressFilled.style.width = '68vw';  // Changed line
      }
    }, 10);
  }

  // Pause Timer
  function pauseTimer() {
    const snail = document.getElementById('snail');
    const progressFilled = document.getElementById('progress-filled');

    snail.style.animationPlayState = 'paused';
    progressFilled.style.animationPlayState = 'paused';

    pauseTime = Date.now();
    isPaused1 = true;

    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Reset Timer
  function resetTimer() {
    const snail = document.getElementById('snail');
    const progressFilled = document.getElementById('progress-filled');

    snail.style.animation = 'none';
    progressFilled.style.animation = 'none';

    snail.style.left = 'calc(12%)';
    progressFilled.style.width = '0%';

    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    isPaused1 = false;
    pauseTime = null;
    startTime = null;
    resetStartTime = null;
    timerFinished = false;
    totalPausedTime = 0;
  }

  // Check if timer has finished
  function isTimerFinished() {
    return timerFinished;
  }


  var portrait = document.getElementById('character-portrait');
  var isFlashing = false;
  var intervalId;

  // Function to start the flashing effect
  function startFlashing() {
    if (!isFlashing) {
      isFlashing = true;
      intervalId = setInterval(function () {
        portrait.classList.toggle("flash"); // Toggle the "flash" class
      }, 1500); // Change the class every 1.5 seconds
    }
  }

  // Function to stop the flashing effect
  function stopFlashing() {
    if (isFlashing) {
      isFlashing = false;
      clearInterval(intervalId);
      portrait.classList.remove("flash"); // Remove the "flash" class when flashing stops
    }
  }






  // Revised setCurrentFrogHealth function
  function setCurrentFrogHealth(health) {
    currentFrogHealth = health;
    const frogHpIndicator = document.querySelector('.upgrade-box.character-frog .hp-indicator');
    const frogBox = document.querySelector('.upgrade-box.character-frog');

    frogHpIndicator.style.setProperty('--hp-indicator-height', `${(1 - (currentFrogHealth / getFrogHealth())) * 100}%`);

    if (currentFrogHealth <= 0) {
      frogBox.style.backgroundColor = 'grey';
      frogBox.style.pointerEvents = ''; // Reset pointer events
    } else {
      frogBox.style.backgroundColor = ''; // Reset to default color
      frogBox.style.pointerEvents = ''; // Reset pointer events
    }
  }








  function setCurrentBeeHealth(health) {
    currentBeeHealth = health;
    const beeHpIndicator = document.querySelector('.upgrade-box.character-bee .hp-indicator');
    const beeBox = document.querySelector('.upgrade-box.character-bee');

    beeHpIndicator.style.setProperty('--hp-indicator-height', `${(1 - (currentBeeHealth / getBeeHealth())) * 100}%`);

    if (currentBeeHealth <= 0) {
      beeBox.style.backgroundColor = 'grey';
      beeBox.style.pointerEvents = ''; // Reset pointer events
    } else {
      beeBox.style.backgroundColor = ''; // Reset to default color
      beeBox.style.pointerEvents = ''; // Reset pointer events
    }
  }

  function setCurrentSnailHealth(health) {
    currentSnailHealth = health;
    const snailHpIndicator = document.querySelector('.upgrade-box.character-snail .hp-indicator');
    const snailBox = document.querySelector('.upgrade-box.character-snail');

    snailHpIndicator.style.setProperty('--hp-indicator-height', `${(1 - (currentSnailHealth / getSnailHealth())) * 100}%`);

    if (currentSnailHealth <= 0) {
      snailBox.style.backgroundColor = 'grey';
      snailBox.style.pointerEvents = ''; // Reset pointer events
    } else {
      snailBox.style.backgroundColor = ''; // Reset to default color
      snailBox.style.pointerEvents = ''; // Reset pointer events
    }
  }

  function setCurrentBirdHealth(health) {
    currentBirdHealth = health;
    const birdHpIndicator = document.querySelector('.upgrade-box.character-bird .hp-indicator');
    const birdBox = document.querySelector('.upgrade-box.character-bird');

    birdHpIndicator.style.setProperty('--hp-indicator-height', `${(1 - (currentBirdHealth / getBirdHealth())) * 100}%`);

    if (currentBirdHealth <= 0) {
      birdBox.style.backgroundColor = 'grey';
      birdBox.style.pointerEvents = ''; // Reset pointer events
    } else {
      birdBox.style.backgroundColor = ''; // Reset to default color
      birdBox.style.pointerEvents = ''; // Reset pointer events
    }
  }





  function getCharEXP(currentChar) {
    switch (currentChar) {
      case 'character-snail':
        return snailEXP;
      case 'character-bird':
        return birdEXP;
      case 'character-frog':
        return frogEXP;
      case 'character-bee':
        return beeEXP;
      default:
        return frogEXP;
    }
  }

  function getEXPtoLevel(currentChar) {
    switch (currentChar) {
      case 'character-snail':
        return snailEXPToLevel;
      case 'character-bird':
        return birdEXPToLevel;
      case 'character-frog':
        return frogEXPToLevel;
      case 'character-bee':
        return beeEXPToLevel;
      default:
        return frogEXPToLevel;

    }
  }

  function setEXPtoLevel(currentChar, value) {
    switch (currentChar) {
      case 'character-snail':
        snailEXPToLevel = value;
        break;
      case 'character-bird':
        birdEXPToLevel = value;
        break;
      case 'character-frog':
        frogEXPToLevel = value;
        break;
      case 'character-bee':
        beeEXPToLevel = value;
        break;
      default:
        frogEXPToLevel = value;
        break;
    }

    updateEXPIndicator(currentChar, getCharEXP(currentChar), getEXPtoLevel(currentChar), getCharLevel(currentChar));
  }

  function setCharEXP(currentChar, value) {
    switch (currentChar) {
      case 'character-snail':
        snailEXP = value;
        break;
      case 'character-bird':
        birdEXP = value;
        break;
      case 'character-frog':
        frogEXP = value;
        break;
      case 'character-bee':
        beeEXP = value;
        break;
      default:
        frogEXP = value;
        break;
    }

    updateEXPIndicator(currentChar, getCharEXP(currentChar), getEXPtoLevel(currentChar));
  }


  function updateEXPIndicator(character, currentEXP, maxEXP) {
    const expIndicator = document.querySelector(`.upgrade-box.${character} .exp-indicator`);
    const characterBox = document.querySelector(`.upgrade-box.${character}`);

    const heightPercentage = (1 - currentEXP / maxEXP) * 100;
    expIndicator.style.setProperty('--exp-indicator-height', `${heightPercentage}%`);


  }

  function updateEXPIndicatorText(character, level) {
    const expIndicator = document.querySelector(`.upgrade-box.${character} .exp-indicator`);
    const levelElement = expIndicator.querySelector('.level');
    levelElement.textContent = `${level}`;
  }



  function getSnailLevel() { return snailLevel; }
  function getBeeLevel() { return beeLevel; }
  function getBirdLevel() { return birdLevel; }
  function getSnailSpeed() { return snailSpeed; }
  function setSnailSpeed(speed) { snailSpeed = speed; }
  function getSnailDamage() { return snailDamage; }
  function setSnailDamage(damage) { snailDamage = damage; }
  function getFrogLevel() { return frogLevel; }
  function getSnailHealth() { return snailHealth; }
  function setSnailHealth(health) { snailHealth = health; }
  function getBirdSpeed() { return birdSpeed; }
  function setBirdSpeed(speed) { birdSpeed = speed; }
  function getBirdDamage() { return birdDamage; }
  function setBirdDamage(damage) { birdDamage = damage; }
  function getBirdHealth() { return birdHealth; }
  function setBirdHealth(health) { birdHealth = health; }
  function getBeeSpeed() { return beeSpeed; }
  function setBeeSpeed(speed) { beeSpeed = speed; }
  function getBeeDamage() { return beeDamage; }
  function setBeeDamage(damage) { beeDamage = damage; }
  function getBeeHealth() { return beeHealth; }
  function setBeeHealth(health) { beeHealth = health; }
  function getFrogSpeed() { return frogSpeed; }
  function setFrogSpeed(speed) { frogSpeed = speed; }
  function getFrogDamage() { return frogDamage; }
  function setFrogDamage(damage) { frogDamage = damage; }
  function getFrogHealth() { return frogHealth; }
  function getEnemies() { return enemies; }
  function addEnemies(enemy) { console.log("added an eneymy"); return enemies.push(enemy); }
  function setFrogHealth(health) { frogHealth = health; }
  function getCharSwap() { return charSwap; }
  function setCharSwap(value) { charSwap = value; }
  function getCurrentCharacter() { return currentCharacter; }
  function setCurrentCharacter(value) { currentCharacter = value; }
  function getCoffee() { return coffee; }
  function setCoffee(value) { coffee = value; }
  function getFrogSize() { return frogSize; }
  function getFrogSpeed() { return speed; }
  function setFrogSpeed(value) { speed = value; }
  function getSpeedChanged() { return speedChanged; }
  function setSpeedChanged(value) { speedChanged = value; }
  function getSelectLevel() { return selectLevel; }
  function setSelectLevel(value) { selectLevel = value; }
  function getFrogTintColor() { return frogTintColor; }
  function getPlayerEXP() { return playerEXP; }
  function setPlayerEXP(value) { playerEXP = value; }
  function getisDead() { return isDead; }
  function setIsDead(value) { isDead = value; }
  function getIsCharAttacking() { return isCharAttacking; }
  function setIsCharAttacking(value) { isCharAttacking = value; }
  function getAreResetting() { return areResetting; }
  function setCharAttackAnimating(value) { isCharAttackAnimating = value; }
  function getEnemiesInRange() { return enemiesInRange; }
  function setEnemiesInRange(value) { enemiesInRange = value; }


  function getCharLevel(character) {
    switch (character) {
      case 'character-snail':
        return snailLevel;
      case 'character-bird':
        return birdLevel;
      case 'character-frog':
        return frogLevel;
      case 'character-bee':
        return beeLevel;
      default:
        return;
    }
  }



  function getPlayerHealth() {
    switch (getCurrentCharacter()) {
      case 'character-snail':
        return getSnailHealth();
      case 'character-bird':
        return getBirdHealth();
      case 'character-frog':
        return getFrogHealth();
      case 'character-bee':
        return getBeeHealth();
      default:
        console.log('Invalid character type');
    }

  }

  function getPlayerCurrentHealth() {

    switch (getCurrentCharacter()) {
      case 'character-snail':
        return currentSnailHealth;
      case 'character-bird':
        return currentBirdHealth;
      case 'character-frog':
        return currentFrogHealth;
      case 'character-bee':
        return currentBeeHealth;
      default:
        console.log('Invalid character type');
    }

    return;
  }

  function setPlayerCurrentHealth(value) {
    switch (getCurrentCharacter()) {
      case 'character-snail':
        setCurrentSnailHealth(value);
        break;
      case 'character-bird':
        setCurrentBirdHealth(value);
        break;
      case 'character-frog':
        setCurrentFrogHealth(value);
        break;
      case 'character-bee':
        setCurrentBeeHealth(value)
        break;
      default:
        console.log('Invalid character type');
    }
  }



  function getisPaused() {
    return isPaused;
  }
  let isUnpausing = false; // New flag to track if we're in the middle of unpausing

  function shouldReturnEarly(value) {
    if ((value && pauseMenuContainer) || (!value && isUnpausing) || app.stage.children.includes(reviveDialogContainer)) {
      console.log('returning early');
      return true;

    }

    const spawnTextElement = document.getElementById('spawn-text');
    const computedStyle = window.getComputedStyle(spawnTextElement);
    const visibility = computedStyle.getPropertyValue('visibility');

    return visibility === 'visible';
  }


  function createPauseMenuContainer() {
    const pauseMenuContainer = new PIXI.Container();
    pauseMenuContainer.myCustomID = 'pauseMenuX';
  
    const backgroundSprite = createBackgroundSprite();
    pauseMenuContainer.addChild(backgroundSprite);
  
    const border = createBorder(backgroundSprite);
    pauseMenuContainer.addChild(border);
  
    const pauseText = 'Game Paused';
    const roundText = 'Round: ' + currentRound; // Add current round information
  
    const textStyle = getTextStyle(backgroundSprite.width);
    const text = createText(pauseText, textStyle, backgroundSprite);
    pauseMenuContainer.addChild(text);
  
    const text1 = createText('\n' + roundText, textStyle, backgroundSprite, true);
    pauseMenuContainer.addChild(text1);
  
    // Volume Slider
    const volumeSlider = createVolumeSlider(backgroundSprite);
  
    // Volume Button
    volumeButton = createVolumeButton(backgroundSprite);
    volumeButton.position.set(volumeSlider.x - backgroundSprite.width /8, backgroundSprite.height / 2);
    pauseMenuContainer.addChild(volumeButton);
  
    // Garbage Button
    const garbageButton = createGarbageButton(backgroundSprite);
    garbageButton.position.set(backgroundSprite.width - garbageButton.width - 10, backgroundSprite.height);
    pauseMenuContainer.addChild(garbageButton);
  
    // Adjust position and add children to the container
    pauseMenuContainer.addChild(volumeSlider);
    volumeSlider.addChild(createSliderBall(backgroundSprite));
  
    let pauseX = -app.stage.position.x + (app.screen.width / 2) - (pauseMenuContainer.width / 2);
    let pauseY = -app.stage.position.y + (app.screen.width / 2) - (pauseMenuContainer.height / 2);
    pauseMenuContainer.position.set(pauseX, pauseY);
  
    app.stage.addChild(pauseMenuContainer);
  
    return pauseMenuContainer;
  }
  

  
  // Initial check


  function setisPaused(value) {
    isPaused = value;
    if (value) {
      pauseTimer();
    }
    if (shouldReturnEarly(value)) {
      return;
    }

    if (value) {

      pauseMenuContainer = createPauseMenuContainer();
    } else {
      if (pauseMenuContainer) {
        app.stage.removeChild(pauseMenuContainer);
        pauseMenuContainer = null;
      }

      isUnpausing = false;
      isPaused = false; // Resume the game
      spawnEnemies();
      startTimer();
    }
  }

  // The remaining helper functions (createBackgroundSprite, createBorder, getTextStyle, createText, createVolumeSlider, createVolumeButton, createGarbageButton, createSliderBall) will need to be implemented.
  function createBackgroundSprite() {
    const backgroundSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    backgroundSprite.width = app.screen.width;
    backgroundSprite.height = Math.max(app.screen.height * 0.4, 300);
    backgroundSprite.tint = 0xFFFFFF; // White color
    backgroundSprite.alpha = 0.8; // Semi-transparent background
    return backgroundSprite;
  }

  function createBorder(backgroundSprite) {
    const border = new PIXI.Graphics();
    border.lineStyle(4, 0x8B4513); // Brown outline color
    border.drawRect(0, 0, backgroundSprite.width, backgroundSprite.height);
    return border;
  }

  function getTextStyle(backgroundSpriteWidth) {
    return new PIXI.TextStyle({
      fontFamily: 'Patrick Hand',
      fontSize: 44, // Increased font size to 60
      fill: '#FFFFFF', // White color for text fill
      stroke: '#000000',
      strokeThickness: 6,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 2,
      wordWrap: true,
      wordWrapWidth: backgroundSpriteWidth /3,
    });
  }

  function createText(textContent, textStyle, backgroundSprite, isRoundText = false) {
    const text = new PIXI.Text(textContent, textStyle);
    text.anchor.set(0.5);
    const yPos = isRoundText ? backgroundSprite.height / 1.5 : backgroundSprite.height / 6;
    text.position.set(backgroundSprite.width / 2, yPos);
    return text;
  }


  function setVolume(x,backgroundSprite, boundaryOffset) {
    let normalizedX = (x + backgroundSprite.width / 8 - boundaryOffset) / (2 * boundaryOffset);
    if (normalizedX <= 0) {
        volumeButton.text = '🔈';
    } else if (normalizedX < 0.5) {
        volumeButton.text = '🔉';
    } else {
        volumeButton.text = '🔊';
    }
}

  function createVolumeSlider(backgroundSprite) {
    const volumeSlider = new PIXI.Container();
    volumeSlider.position.set(backgroundSprite.width / 2.75, backgroundSprite.height / 2);
    const sliderBackground = new PIXI.Graphics();
    sliderBackground.beginFill(0x000000); // Black color for the rectangle background
    sliderBackground.drawRect(0, -10, backgroundSprite.width/3.5, 20); // Set the same bounds as the sliding ball
    sliderBackground.endFill();
    volumeSlider.addChild(sliderBackground);
     // New function to adjust the volume based on the slider ball's position
  
    return volumeSlider;
  }
  function createSliderBall(backgroundSprite) {
    let boundaryOffset = backgroundSprite.width / 8; // You can adjust this value to fine-tune the boundaries

    const sliderBall = new PIXI.Text('🔵', { fontSize: 48 });
    sliderBall.anchor.set(0.5);
    sliderBall.position.set(100, 0);
    
    let isDragging = false;
    let offsetX = 0;

    sliderBall.interactive = true;
    sliderBall.buttonMode = true;

    sliderBall.on('pointerdown', (event) => {
      isDragging = true;
      offsetX = event.data.global.x - sliderBall.x;
    });

    sliderBall.on('pointermove', (event) => {
      if (isDragging) {
        let newX = event.data.global.x - offsetX;
        newX = Math.max(-backgroundSprite.width / 8 + boundaryOffset, Math.min(backgroundSprite.width / 8 + boundaryOffset, newX));
        sliderBall.x = newX;
        setVolume(newX,backgroundSprite, boundaryOffset);
        // Update volume based on slider position
        // Add your volume control logic here
      }
    });

    sliderBall.on('pointerup', () => {
      isDragging = false;
      setVolume(sliderBall.x,backgroundSprite, boundaryOffset); // Make sure to update the volume when the dragging ends

    });

    sliderBall.on('pointerupoutside', () => {
      isDragging = false;
      setVolume(sliderBall.x,backgroundSprite, boundaryOffset); // Make sure to update the volume when the dragging ends

    });

    return sliderBall;
  }


  function createVolumeButton(backgroundSprite) {
   volumeButton = new PIXI.Text('🔉', { fontSize: 80 });
    volumeButton.anchor.set(0.5);
    volumeButton.position.set(backgroundSprite.width / 20, backgroundSprite.height / 2);

    volumeButton.interactive = true;
    volumeButton.buttonMode = true;
    let isMuted = false;

    volumeButton.on('click', () => {
      isMuted = !isMuted;
      volumeButton.text = isMuted ? '🔈' : '🔊';
      // Add your volume control logic here
    });

    return volumeButton;
  }

  function createGarbageButton(backgroundSprite) {
    const garbageButton = new PIXI.Text('🗑️', { fontSize: 70 });
    garbageButton.anchor.set(0.4);
    garbageButton.position.set((backgroundSprite.width / 4) * 2, backgroundSprite.height -200 );

    garbageButton.interactive = true;
    garbageButton.buttonMode = true;

    garbageButton.on('pointerdown', () => {
      // Handle delete game save functionality here
      // Close the game or perform other necessary actions
      alert("DELETED");
      localStorage.removeItem('gameSave');
    });

    return garbageButton;
  }





  function update() {
    // Calculate the center of the screen regardless of the stage position
    if (reviveDialogContainer) {
      let dialogX = -app.stage.position.x + (app.screen.width / 2) - (reviveDialogContainer.width / 2);
      let dialogY = -app.stage.position.y + (app.screen.height / 2) - (reviveDialogContainer.height / 2);
      reviveDialogContainer.position.set(dialogX, dialogY);
    }

    if (pauseMenuContainer) {
      let pauseX = -app.stage.position.x + (app.screen.width / 2) - (pauseMenuContainer.width / 2);
      let pauseY = -app.stage.position.y + (app.screen.height / 2) - (pauseMenuContainer.height / 2);
      pauseMenuContainer.position.set(pauseX, pauseY);
    }
  }




  function getIsWiped() {
    return isWiped;
  }

  function setisWiped(value) {
    console.log("WIPED");
    isWiped = value;

    // Get the pause text element
    var wipeText = document.getElementById("wipe-text");

    // Swap the visibility based on the isPaused value
    if (getIsWiped()) {
      wipeText.style.visibility = "visible";
    } else {
      wipeText.style.visibility = "hidden";
    }

  }




  var pauseButton = document.getElementById("pause-button");

  document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });

  pauseButton.addEventListener("click", function () {
    if (getisDead() == false) {
      if (getPlayerCurrentHealth() > 0) {
        setisPaused(!getisPaused());
        console.log("PAUSED");
      }

    }
  });


  var pauseButton = document.getElementById("pause-button");

  pauseButton.addEventListener("mousedown", function () {
    pauseButton.style.backgroundImage = 'url("https://i.imgur.com/gGcCLKj.png")';
    console.log("Button Pressed");
  });

  pauseButton.addEventListener("mouseup", function () {
    pauseButton.style.backgroundImage = 'url("https://i.imgur.com/HTeDEQJ.png")';
    console.log("Button Released");
  });


  function isCooldownActive() {
    return cooldownActive;
  }

  function startCooldown() {
    cooldownActive = true;

    // Show the cooldown overlay
    const overlayElement = document.getElementById("cooldown-overlay");
    overlayElement.style.display = "block";

    setTimeout(() => {
      cooldownActive = false;

      // Hide the cooldown overlay
      overlayElement.style.display = "none";
    }, cooldownDuration);
  }
  document.getElementById("character-portrait").addEventListener("click", openCharacterMenu);
  document.getElementById("exp-bar").addEventListener("click", openCharacterMenu);
  document.getElementById("health-bar").addEventListener("click", openCharacterMenu);
  
  function openCharacterMenu() {
    if (getSelectLevel() >= 1) {
      return;
    }
  
    // Check if there is a cooldown
    if (isCooldownActive()) {
      return;
    }
  
    // Toggle the visibility of the character info boxes
    const characterBoxes = document.querySelectorAll('.upgrade-box.character-snail, .upgrade-box.character-bird, .upgrade-box.character-bee, .upgrade-box.character-frog');
  
    if (isCharacterMenuOpen) {
      characterBoxes.forEach((box) => {
        box.style.visibility = 'hidden';
      });
      isCharacterMenuOpen = false;
    } else {
      characterBoxes.forEach((box) => {
        if (selectedCharacter !== "" && box.classList.contains(selectedCharacter)) {
          box.style.visibility = 'hidden';
        } else {
          box.style.visibility = 'visible';
        }
      });
      isCharacterMenuOpen = true;
    }
  
    // Start the cooldown
  }

  function handleCharacterClick(characterType) {
    let characterHealth;

    switch (characterType) {
      case 'character-snail':
        characterHealth = currentSnailHealth;
        break;
      case 'character-bird':
        characterHealth = currentBirdHealth;
        break;
      case 'character-frog':
        characterHealth = currentFrogHealth;
        break;
      case 'character-bee':
        characterHealth = currentBeeHealth;
        break;
      default:
        console.log('Invalid character', characterType);
        return;
    }

    app.stage.addChild(critter);


    document.getElementById('spawn-text').style.visibility = 'hidden';
    choose = false;
    if (characterHealth <= 0) {
      createReviveDialog(characterType);
      return;
    }
    stopFlashing();


    // Swap character portraits
    const characterPortrait = document.getElementById("character-portrait");
    characterPortrait.style.backgroundImage = `url('${getCharacterPortraitUrl(characterType)}')`;
    characterPortrait.classList.remove("character-snail", "character-bird", "character-bee", "character-frog");
    characterPortrait.classList.add(characterType);

    // Close the character menu
    const characterBoxes = document.querySelectorAll('.upgrade-box.character-snail, .upgrade-box.character-bird, .upgrade-box.character-bee, .upgrade-box.character-frog');
    characterBoxes.forEach((box) => {
      box.style.visibility = 'hidden';
    });
    updateEXPIndicatorText(getCurrentCharacter(), getCharLevel(getCurrentCharacter()));
    isCharacterMenuOpen = false;
    setCharSwap(true);

    setCurrentCharacter(characterType);

    // Swap positions of the current character box and the previously selected character box
    if (selectedCharacter !== characterType) {
      const characterLevelElement = document.getElementById("character-level");
      var updateLightning = document.getElementById("lightning-level");
      var updateHP = document.getElementById("heart-level");
      var updateDamage = document.getElementById("swords-level");
      let level;
      switch (characterType) {
        case 'character-snail':
          level = getSnailLevel();
          updateLightning.textContent = getSnailSpeed().toString();
          updateHP.textContent = getSnailHealth().toString();
          updateDamage.textContent = getSnailDamage().toString();
          break;
        case 'character-bird':
          level = getBirdLevel();
          updateLightning.textContent = getBirdSpeed().toString();
          updateHP.textContent = getBirdHealth().toString();
          updateDamage.textContent = getBirdDamage().toString();

          break;
        case 'character-frog':
          level = getFrogLevel();
          updateLightning.textContent = getFrogSpeed().toString();
          updateHP.textContent = getFrogHealth().toString();
          updateDamage.textContent = getFrogDamage().toString();
          break;
        case 'character-bee':
          level = getBeeLevel();
          updateLightning.textContent = getBeeSpeed().toString();
          updateHP.textContent = getBeeHealth().toString();
          updateDamage.textContent = getBeeDamage().toString();
          break;
        default:
          console.log('Invalid character', characterType);
          return;
      }
      if (getPlayerCurrentHealth() >= 0) {
        setisPaused(false);
      }
      startCooldown();
      updatePlayerHealthBar((getPlayerCurrentHealth() / getPlayerHealth() * 100));
      characterLevelElement.textContent = 'Lvl. ' + level;

      const currentCharacterBox = document.querySelector('.upgrade-box.' + selectedCharacter);
      const prevCharacterBox = document.querySelector('.upgrade-box.' + characterType);
      const tempPosition = { ...characterPositions[selectedCharacter] };

      currentCharacterBox.style.top = characterPositions[characterType].top;
      currentCharacterBox.style.left = characterPositions[characterType].left;
      characterPositions[selectedCharacter] = characterPositions[characterType];
      characterPositions[characterType] = tempPosition;

      previousCharacter = selectedCharacter;
      selectedCharacter = characterType;
    } else {
      previousCharacter = ""; // Set previousCharacter to an empty string if the same character is selected again
    }

    updateCharacterStats(); // Update the stats for the new character
  }


  function createReviveDialog(characterType) {
    if (reviveDialogContainer && app.stage.children.includes(reviveDialogContainer)) {
      return;
    }
  
    reviveDialogContainer = new PIXI.Container();
  
    // Create a semi-transparent black background sprite for the dialog box
    backgroundSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    backgroundSprite.width = app.screen.width * 0.6; // 60% of the screen width
    backgroundSprite.height = app.screen.height/2; // Fixed height
    backgroundSprite.tint = 0x000000; // Black color
    backgroundSprite.alpha = 0.5; // Make it semi-transparent
    reviveDialogContainer.addChild(backgroundSprite);
  
    // Create a brown border around the background
    const border = new PIXI.Graphics();
    border.lineStyle(4, 0x8B4513); // Brown color with 4px thickness
    border.drawRect(0, 0, backgroundSprite.width, backgroundSprite.height);
    reviveDialogContainer.addChild(border);
  
    // Create the text for the dialog box
    const characterName = getCharacterName(characterType);

    const reviveText2 = `Spend 50 to revive ${characterName}?`;
  
    const textStyle = getTextStyle();
  
    const text = new PIXI.Text(reviveText2, textStyle);
    text.anchor.set(.5);
    text.position.set(backgroundSprite.width / 2, backgroundSprite.height * 0.25);
  
  
  
    // Add coffee bean image
    let beanSprite = PIXI.Sprite.from('https://i.imgur.com/Ft63zNi.png');
    beanSprite.anchor.set(0.5);
    beanSprite.scale.set(0.85);
    beanSprite.position.set(text.position.x - text.width / 5.5, text.position.y);
    
    reviveDialogContainer.addChild(beanSprite);
    reviveDialogContainer.addChild(text);
  
    // Create the 'Yes' button with emoji
    const playerCoins = getCoffee(); // Assuming getCoffee() is the function that returns the player's current coin amount
    const yesButtonStyle = new PIXI.TextStyle({
      fontSize: app.screen.width * 0.26, // Responsive font size
      fill: playerCoins >= 50 ? '#008000' : '#808080', // Green color if player has 50 or more coins, grey otherwise
      backgroundColor: '#000000', // Black background
      fontFamily: 'Marker Felt',
      stroke: '#000000', // Black outline color
      strokeThickness: -6, // Outline thickness
      dropShadow: true,
      dropShadowColor: '#000000', // Shadow color
      dropShadowBlur: 4, // Shadow blur
      dropShadowAngle: Math.PI / 6, // Shadow angle
      dropShadowDistance: 2, // Shadow distance
      wordWrap: true,
      wordWrapWidth: app.screen.width /3,
    });
  
    const yesButton = new PIXI.Text('☑', yesButtonStyle);
    yesButton.anchor.set(0.5);
    yesButton.position.set(backgroundSprite.width * 0.3, backgroundSprite.height * 0.75);
    reviveDialogContainer.addChild(yesButton);
  
    // Create the 'No' button with emoji and red tint
    const noButtonStyle = new PIXI.TextStyle({
      fontSize: app.screen.width * 0.26, // Responsive font size
      fill: '#FF0000', // Red color
      backgroundColor: '#000000', // Black background
      fontFamily: 'Marker Felt',
      stroke: '#000000', // Black outline color
      strokeThickness: -6, // Outline thickness
      dropShadow: true,
      dropShadowColor: '#000000', // Shadow color
      dropShadowBlur: 4, // Shadow blur
      dropShadowAngle: Math.PI / 6, // Shadow angle
      dropShadowDistance: 2, // Shadow distance
      wordWrap: true,
      wordWrapWidth: app.screen.width /3,
    });
  
    const noButton = new PIXI.Text('☒', noButtonStyle);
    noButton.anchor.set(0.5);
    noButton.position.set(backgroundSprite.width * 0.7, backgroundSprite.height * 0.75);
    reviveDialogContainer.addChild(noButton);
  
    // Calculate the position of the dialog box based on the current stage position
    const dialogX = (app.screen.width / 2) - (backgroundSprite.width / 2);
    const dialogY = (app.screen.height / 2) - (backgroundSprite.height / 2);
    reviveDialogContainer.position.set(dialogX, dialogY);
  
    // Add the dialog box to the PIXI stage
    app.stage.addChild(reviveDialogContainer);
    setisPaused(true);
  
    // Listen for click events on the 'Yes' button
    yesButton.interactive = true;
    yesButton.buttonMode = true;
    noButton.interactive = true;
    noButton.buttonMode = true;
  
    yesButton.on('pointerdown', () => {
      // Check if the player has enough coins to revive the character
      if (getCoffee() >= 50) {
        // Perform the revive logic
        if (characterType === 'character-snail') {
          setCurrentSnailHealth(getSnailHealth());
        } else if (characterType === 'character-bird') {
          setCurrentBirdHealth(getBirdHealth());
        } else if (characterType === 'character-frog') {
          setCurrentFrogHealth(getFrogHealth());
        } else if (characterType === 'character-bee') {
          setCurrentBeeHealth(getBeeHealth());
        }
        addCoffee(-50);
        // Remove the dialog box from the PIXI stage
        app.stage.removeChild(reviveDialogContainer);
        setisPaused(false);
      } else {
        // Player doesn't have enough coins
        console.log('Not enough coins to revive');
        app.stage.removeChild(reviveDialogContainer);
        setisPaused(false);
        // You can display an error message or perform other actions as needed
      }
    });
  
    noButton.on('pointerdown', () => {
      // Remove the dialog box from the PIXI stage
      app.stage.removeChild(reviveDialogContainer);
      setisPaused(false);
    });
  }

  function update() {
    // Calculate the center of the screen regardless of the stage position
    if (reviveDialogContainer) {
      let dialogX = -app.stage.position.x + (app.screen.width / 2) - (reviveDialogContainer.width / 2);
      let dialogY = -app.stage.position.y + (app.screen.height / 2) - (reviveDialogContainer.height / 2);
      reviveDialogContainer.position.set(dialogX, dialogY);

    }
    if (pauseMenuContainer) {
      let pauseX = -app.stage.position.x + (app.screen.width / 2) - (pauseMenuContainer.width / 2);
      let pauseY = -app.stage.position.y + (app.screen.height / 2) - (pauseMenuContainer.height / 2);
      pauseMenuContainer.position.set(pauseX, pauseY);

    }

  }

  function getCharacterName(characterType) {
    switch (characterType) {
      case 'character-snail':
        return 'Snail';
      case 'character-bird':
        return 'Bird';
      case 'character-frog':
        return 'Frog';
      case 'character-bee':
        return 'Bee';
      default:
        console.log('Invalid character type', characterType);
        return '';
    }
  }

  function updateCharacterStats() {
    switch (selectedCharacter) {
      case 'character-snail':
        // Update stats for character-snail
        setSnailSpeed(getSnailSpeed());
        setSnailDamage(getSnailDamage());
        setSnailHealth(getSnailHealth());
        // Additional logic or actions specific to character-snail
        break;
      case 'character-bird':
        // Update stats for character-bird
        setBirdSpeed(getBirdSpeed());
        setBirdDamage(getBirdDamage());
        setBirdHealth(getBirdHealth());
        // Additional logic or actions specific to character-bird
        break;
      case 'character-frog':
        // Update stats for character-frog
        setFrogSpeed(getFrogSpeed());
        setFrogDamage(getFrogDamage());
        setFrogHealth(getFrogHealth());
        // Additional logic or actions specific to character-frog
        break;
      case 'character-bee':
        // Update stats for character-bee
        setBeeSpeed(getBeeSpeed());
        setBeeDamage(getBeeDamage());
        setBeeHealth(getBeeHealth());
        // Additional logic or actions specific to character-bee
        break;
      default:
        console.log('Invalid character type', selectedCharacter);
    }

    // Update the display or perform any other actions based on the updated stats
    // ...
  }

  // Add click event listeners to character boxes
  const characterBoxes = document.querySelectorAll('.upgrade-box.character-snail, .upgrade-box.character-bird, .upgrade-box.character-bee, .upgrade-box.character-frog');
  characterBoxes.forEach((box) => {
    box.addEventListener('click', function () {
      const characterType = box.classList[1];
      handleCharacterClick(characterType);

    });
  });

  function getCharacterPortraitUrl(characterType) {
    switch (characterType) {
      case 'character-snail': return 'https://i.imgur.com/Chu3ZkP.png';
      case 'character-bird': return 'https://i.imgur.com/WAwZpGS.png';
      case 'character-frog': return 'https://i.imgur.com/XaXTV73.png';
      case 'character-bee': return 'https://i.imgur.com/rmcGGP9.png';
      default: return '';
    }
  }


  document.body.appendChild(app.view);
 
  const hoverScale = 1.2;
  const hoverAlpha = 0.8;
 

  function startGame() {

    window.addEventListener('blur', () => {
      if (getPlayerCurrentHealth() > 0) {
        setisPaused(true);
      }
    });
    

    const loadingTexture = PIXI.Texture.from('https://i.imgur.com/dJ4eoGZ.png');
    const loadingSprite = new PIXI.Sprite(loadingTexture);
    loadingSprite.anchor.set(0.5);
    loadingSprite.width = app.screen.width;
    loadingSprite.height = app.screen.height;
    loadingSprite.position.set(app.screen.width / 2, app.screen.height / 2);
    loadingSprite.alpha = 1; // Start fully opaque
    app.stage.removeChild(menuSprite);
    app.stage.addChild(loadingSprite);
    const sound = new Audio();
    sound.src = "./theme.ogg";
    sound.volume = .02;
    sound.play();


    // Game elements and logic 
    let castleMaxHealth = 100;
    let castleHealth = castleMaxHealth;
    const mountainVelocityX = 0;
    const mountainVelocityY = 0.2;
    const mountainVelocity1 = new PIXI.Point(0.01, 0.01);
    const mountainVelocity2 = new PIXI.Point(0.05, 0.05);
    const mountainVelocity3 = new PIXI.Point(0.1, 0.1);
    const mountainVelocity4 = new PIXI.Point(0.1, 0.1);
    const hpBarColor = 0xff0000;
    loadGame();
    var snailHPIndicator = document.querySelector('.upgrade-box.character-snail .hp-indicator');
    var birdHPIndicator = document.querySelector('.upgrade-box.character-bird .hp-indicator');
    var beeHPIndicator = document.querySelector('.upgrade-box.character-bee .hp-indicator');
    var frogHPIndicator = document.querySelector('.upgrade-box.character-frog .hp-indicator');
    // Calculate the height percentage for each character
    var snailHeightPercentage = (1 - currentSnailHealth / getSnailHealth()) * 100;
    var birdHeightPercentage = (1 - currentBirdHealth / getBirdHealth()) * 100;
    var beeHeightPercentage = (1 - currentBeeHealth / getBeeHealth()) * 100;
    var frogHeightPercentage = (1 - currentFrogHealth / getFrogHealth()) * 100;
    // Update the custom properties and height for each character
    snailHPIndicator.style.setProperty('--current-health-snail', currentSnailHealth);
    snailHPIndicator.style.setProperty('--max-health-snail', getSnailHealth());
    snailHPIndicator.style.setProperty('--hp-indicator-height', snailHeightPercentage + '%');

    birdHPIndicator.style.setProperty('--current-health-bird', currentBirdHealth);
    birdHPIndicator.style.setProperty('--max-health-bird', getBirdHealth());
    birdHPIndicator.style.setProperty('--hp-indicator-height', birdHeightPercentage + '%');

    beeHPIndicator.style.setProperty('--current-health-bee', currentBeeHealth);
    beeHPIndicator.style.setProperty('--max-health-bee', getBeeHealth());
    beeHPIndicator.style.setProperty('--hp-indicator-height', beeHeightPercentage + '%');

    frogHPIndicator.style.setProperty('--current-health-frog', currentFrogHealth);
    frogHPIndicator.style.setProperty('--max-health-frog', getFrogHealth());
    frogHPIndicator.style.setProperty('--hp-indicator-height', frogHeightPercentage + '%');

    var snailEXPIndicator = document.querySelector('.upgrade-box.character-snail .exp-indicator');
    var birdEXPIndicator = document.querySelector('.upgrade-box.character-bird .exp-indicator');
    var beeEXPIndicator = document.querySelector('.upgrade-box.character-bee .exp-indicator');
    var frogEXPIndicator = document.querySelector('.upgrade-box.character-frog .exp-indicator');

    // Calculate the height percentage for each character
    var snailEXPHeightPercentage = (1 - getCharEXP('character-snail') / getEXPtoLevel('character-snail')) * 100;
    var birdEXPHeightPercentage = (1 - getCharEXP('character-bird') / getEXPtoLevel('character-bird')) * 100;
    var beeEXPHeightPercentage = (1 - getCharEXP('character-bee') / getEXPtoLevel('character-bee')) * 100;
    var frogEXPHeightPercentage = (1 - getCharEXP('character-frog') / getEXPtoLevel('character-frog')) * 100;

    // Update the custom properties and height for each character
    snailEXPIndicator.style.setProperty('--current-exp-snail', getCharEXP('character-snail'));
    snailEXPIndicator.style.setProperty('--max-exp-snail', getEXPtoLevel('character-snail'));
    snailEXPIndicator.style.setProperty('--exp-indicator-height', snailEXPHeightPercentage + '%');

    birdEXPIndicator.style.setProperty('--current-exp-bird', getCharEXP('character-bird'));
    birdEXPIndicator.style.setProperty('--max-exp-bird', getEXPtoLevel('character-bird'));
    birdEXPIndicator.style.setProperty('--exp-indicator-height', birdEXPHeightPercentage + '%');

    beeEXPIndicator.style.setProperty('--current-exp-bee', getCharEXP('character-bee'));
    beeEXPIndicator.style.setProperty('--max-exp-bee', getEXPtoLevel('character-bee'));
    beeEXPIndicator.style.setProperty('--exp-indicator-height', beeEXPHeightPercentage + '%');

    frogEXPIndicator.style.setProperty('--current-exp-frog', getCharEXP('character-frog'));
    frogEXPIndicator.style.setProperty('--max-exp-frog', getEXPtoLevel('character-frog'));
    frogEXPIndicator.style.setProperty('--exp-indicator-height', frogEXPHeightPercentage + '%');

    PIXI.Loader.shared.add([
      { name: 'shark_emerge', url: 'https://i.imgur.com/BUxEAgz.png' },
      { name: 'shark_submerge', url: 'https://i.imgur.com/j1eM9EI.png' },
      { name: 'shark_walk', url: 'https://i.imgur.com/HNILgOX.png' },
      { name: 'shark_attack', url: 'https://i.imgur.com/AGrq5qY.png' },
      { name: 'imp_portrait', url: 'https://i.imgur.com/1EFx7kH.png' },
      { name: 'ele_portrait', url: 'https://i.imgur.com/Zvw72h5.png' },
      { name: 'octo_portrait', url: 'https://i.imgur.com/F3OYSDm.png' },
      { name: 'pig_portrait', url: 'https://i.imgur.com/ZxaI7rG.png' },
      { name: 'scorp_portrait', url: 'https://i.imgur.com/u2T4oon.png' },
      { name: 'toofer_portrait', url: 'https://i.imgur.com/lNPjWon.png' },
      { name: 'pig_walk', url: 'https://i.imgur.com/141LQoZ.png' },
      { name: 'pig_attack', url: 'https://i.imgur.com/O0FXcIH.png' },
      { name: 'ele_walk', url: 'https://i.imgur.com/HAbxzx2.png' },
      { name: 'ele_attack', url: 'https://i.imgur.com/zqpWWPI.png' },
      { name: 'scorp_walk', url: 'https://i.imgur.com/wnZD4tY.png' },
      { name: 'scorp_attack', url: 'https://i.imgur.com/VBxfGVM.png' },
      { name: 'octo_walk', url: 'https://i.imgur.com/cUUhR61.png' },
      { name: 'octo_attack', url: 'https://i.imgur.com/sifw1KZ.png' },
      { name: 'toofer_walk', url: 'https://i.imgur.com/aapkoqq.png' },
      { name: 'toofer_attack', url: 'https://i.imgur.com/inBwJ2p.png' },
      { name: 'timer1', url: 'https://i.imgur.com/shRbAl5.png' },
      { name: 'timer2', url: 'https://i.imgur.com/r3DQaWf.png' },
      { name: 'bird_egg', url: 'https://i.imgur.com/q5JvpXv.png' },
      { name: 'bird_ghost', url: 'https://i.imgur.com/FKED8kx.png' },
      { name: 'bird_portrait', url: 'https://i.imgur.com/WAwZpGS.png' },
      { name: 'bird_walk', url: 'https://i.imgur.com/ABVoGmQ.png' },
      { name: 'bird_attack', url: 'https://i.imgur.com/vRD1CeL.png' },
      { name: 'frog_snail', url: 'https://i.imgur.com/ekpSpFg.png' },
      { name: 'frog_bee', url: 'https://i.imgur.com/bUw6K0K.png' },
      { name: 'frog_puffer', url: 'https://i.imgur.com/fBWKqfA.png' },
      { name: 'bee_walk', url: 'https://i.imgur.com/Jxke4OH.png' },
      { name: 'bee_attack', url: 'https://i.imgur.com/toZiN31.png' },
      { name: 'puffer_walk', url: 'https://i.imgur.com/cNLd5vp.png' },
      { name: 'puffer_attack', url: 'https://i.imgur.com/cl09j99.png' },
      { name: 'puffer_portrait', url: 'https://i.imgur.com/9gLYMax.png' },
      { name: 'snail_portrait', url: 'https://i.imgur.com/Chu3ZkP.png' },
      { name: 'frog_portrait', url: 'https://i.imgur.com/XaXTV73.png' },
      { name: 'bee_portrait', url: 'https://i.imgur.com/rmcGGP9.png' },
      { name: 'bean', url: 'https://i.imgur.com/Ft63zNi.png ' },
      { name: 'background', url: 'https://i.imgur.com/BGFZHat.png' },
      { name: 'frog_ghost', url: 'https://i.imgur.com/45E9OPW.png' },
      { name: 'foreground', url: 'https://i.imgur.com/yIjGEpm.png' },
      { name: 'critter', url: 'https://i.imgur.com/Fl29VZM.png' },
      { name: 'critter_walk', url: 'https://i.imgur.com/CLqwc9P.png' },
      { name: 'critter_attack', url: 'https://i.imgur.com/knXBNGy.png' },
      { name: 'snail_idle', url: 'https://i.imgur.com/ctlOf0I.png' },
      { name: 'snail_walk', url: 'https://i.imgur.com/TQzhxAI.png' },
      { name: 'snail_attack', url: 'https://i.imgur.com/2cGPPic.png' },
      { name: 'frog', url: 'https://i.imgur.com/juol8Q6.png' },
      { name: 'frog_walk', url: 'https://i.imgur.com/sQDZVrY.png' },
      { name: 'frog_attack', url: 'https://i.imgur.com/2Nr5t05.png' },
      { name: 'enemy_death', url: 'https://i.imgur.com/UD2YJ4w.png' },
      { name: 'mountain1', url: 'https://i.imgur.com/FP1W0k6.png' },
      { name: 'mountain2', url: 'https://i.imgur.com/Y6IKYjW.png' },
      { name: 'mountain3', url: 'https://i.imgur.com/Y6IKYjW.png' },
      { name: 'mountain4', url: 'https://i.imgur.com/FP1W0k6.png' },
      { name: 'castle', url: 'https://i.imgur.com/a8MEgLK.png' },
      { name: 'clouds', url: 'https://i.imgur.com/ggEcYj9.png' },
      { name: 'clouds2', url: 'https://i.imgur.com/GDrlJ72.png' },
      { name: 'clouds3', url: 'https://i.imgur.com/QrTMhij.png' },
    ]).load(setup);





    function setup() {




      // Add the timer animation to the stage


  backgroundTexture = PIXI.Loader.shared.resources['background'].texture;

// Create first background sprite
background = new PIXI.Sprite(backgroundTexture);
background.width = 2800;
background.height = app.screen.height;
background.anchor.set(0, 0);
background.position.set(0, 0);
app.stage.addChild(background);



// Set up the foreground
foreground = new PIXI.Sprite(PIXI.Loader.shared.resources['foreground'].texture);
foreground.width = PIXI.Loader.shared.resources['foreground'].texture.width * 1.3;
foreground.height = PIXI.Loader.shared.resources['foreground'].texture.height * 1;
foreground.anchor.set(0, 1);
foreground.x = 0;
foreground.y = Math.max(app.screen.height);




      const frogGhostTextures = PIXI.Loader.shared.resources['frog_ghost'].texture;
      frogGhostPlayer = new PIXI.Sprite(frogGhostTextures);

      frogGhostPlayer.anchor.set(0, 0);
      frogGhostPlayer.scale.set(0.28);
      backgroundTexture = PIXI.Loader.shared.resources['background'].texture;

      // Create a new tiling sprite with the background texture, specifying the width and height
 
      
      // No need to set the width and height again, since it's set in the TilingSprite constructor
      // background.width = app.screen.width * 2.75;
      // background.height = app.screen.height;
   
      const mountain1 = createMountainSprite('mountain1', -100, mountainVelocity1, foreground);
      const mountain2 = createMountainSprite('mountain2', app.screen.width * 0.45, mountainVelocity2, foreground);
      const mountain3 = createMountainSprite('mountain3', -200, mountainVelocity3, foreground); // Adjust the position as needed
      const mountain4 = createMountainSprite('mountain4', app.screen.width * 1.2, mountainVelocity4, foreground); // Adjust the position as needed

      mountain3.scale.x = .6;
      mountain3.scale.y = .65;
      mountain4.scale.x = .5;
      mountain4.scale.y = .55;
      console.log(mountain2);
      console.log(mountain3);
      foreground.x = 0;
      // mountain3.scale.x = 100;
      const castleTexture = PIXI.Texture.from('castle');
      const castle = new PIXI.Sprite(castleTexture);
      const castlePlayer = new PIXI.Sprite(castleTexture);
      castlePlayer.anchor.set(1, 1);
      castlePlayer.position.set(200, app.screen.height - castle.height * 0.25);
      castle.anchor.set(1, 1);
      castle.position.set(foreground.width, app.screen.height - castle.height * 0.25);
      const originalTint = castle.tint;
      const hpBarWidth = 180;
      const hpBarHeight = 16;

      const hpBarX = castle.position.x - castle.width / 1.1;
      // console.log(hpBarX);
      const hpBarY = app.screen.height - 40 - hpBarHeight - 210; // Adjusted position
      const hpBarBackgroundColor = 0x000000;
      const hpBar = new PIXI.Graphics();
      hpBar.beginFill(hpBarColor, 1); // Set the alpha value for transparency
      hpBar.drawRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
      hpBar.endFill();
      const hpBarBackground = new PIXI.Graphics();
      const hpBarBorderColor = 0x000000; // Black color
      const hpBarBorderThickness = 4;
      hpBarBackground.lineStyle(hpBarBorderThickness, hpBarBorderColor);
      hpBarBackground.beginFill(hpBarBackgroundColor, 0.5);
      hpBarBackground.drawRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
      hpBarBackground.endFill();
      hpBarBackground.beginFill(hpBarBackgroundColor, 1);
      hpBarBackground.drawRect(hpBarX + hpBarBorderThickness, hpBarY + hpBarBorderThickness, hpBarWidth - hpBarBorderThickness * 2, hpBarHeight - hpBarBorderThickness * 2);
      hpBarBackground.endFill();
      function createMountainSprite(resourceName, xPos, velocity, foreground) {
        const sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[resourceName].texture);

        const scaleFactor = Math.min(
          app.screen.height * 0.6 / sprite.height,
          app.screen.width * 1.5 / sprite.width
        );

        sprite.scale.set(scaleFactor);
        sprite.anchor.set(0, 1);

        const minHeightOffset = foreground ? foreground.height * 0.34 : 0;
        const heightOffsetRatio = (1 - scaleFactor) * 0.3; // Adjust this ratio based on your preference

        const foregroundHeightOffset = foreground ? minHeightOffset + sprite.height * heightOffsetRatio : 0; // Adjusted offset calculation
        sprite.position.set(xPos, app.screen.height - foregroundHeightOffset);
        sprite.zIndex = -1;
        sprite.velocity = velocity;

        return sprite;
      }

      let frogIdleTexture = PIXI.Loader.shared.resources['frog'].texture;
      let frogIdleTextures = [frogIdleTexture];
      const frogIdleTextures1 = [frogIdleTexture];
      frogWalkTextures = createAnimationTextures('frog_walk', 10, 351);
      frogAttackTextures = createAnimationTextures('frog_attack', 12, 351);
      const frogWalkTextures1 = createAnimationTextures('frog_walk', 10, 351);
      const frogAttackTextures1 = createAnimationTextures('frog_attack', 12, 351);
      const critterAttackTextures = createAnimationTextures('critter_attack', 13, 266);
      critterWalkTextures = createAnimationTextures('critter_walk', 12, 266);
      const snailWalkTextures = createAnimationTextures2('snail_walk', 20, 562, 3560, 2248);
      const snailAttackTextures = createAnimationTextures2('snail_attack', 20, 562, 2848, 3372);
      const pufferWalkTextures = createAnimationTextures2('puffer_walk', 15, 413, 3705, 1239);
      const pufferAttackTextures = createAnimationTextures2('puffer_attack', 21, 413, 2223, 2891);
      const beeWalkTextures = createAnimationTextures2('bee_walk', 9, 256, 2753, 256);
      const beeAttackTextures = createAnimationTextures2('bee_attack', 18, 256, 1950, 1024);
      const birdWalkTextures = createAnimationTextures2('bird_walk', 13, 403, 2541, 806);
      const birdAttackTextures = createAnimationTextures2('bird_attack', 13, 403, 2541, 806);
      const cloudsTexture = PIXI.Loader.shared.resources['clouds'].texture;
      const clouds2Texture = PIXI.Loader.shared.resources['clouds2'].texture;
      const scorpWalkTextures = createAnimationTextures2('scorp_walk', 6, 499, 2202, 499);
      const scorpAttackTextures = createAnimationTextures2('scorp_attack', 9, 499, 3303, 499);
      const tooferWalkTextures = createAnimationTextures2('toofer_walk', 6, 377, 2412, 377);
      const tooferAttackTextures = createAnimationTextures2('toofer_attack', 15, 377, 1206, 1885);
      const octoWalkTextures = createAnimationTextures2('octo_walk', 10, 482, 3415, 964);
      const octoAttackTextures = createAnimationTextures2('octo_attack', 18, 482, 3415, 1928);
      const eleWalkTextures = createAnimationTextures2('ele_walk', 6, 377, 2256, 377);
      const eleAttackTextures = createAnimationTextures2('ele_attack', 12, 377, 1128, 1508);
      const pigWalkTextures = createAnimationTextures2('pig_walk', 6, 618, 1590, 1854);
      const pigAttackTextures = createAnimationTextures2('pig_attack', 15, 618, 2385, 3090);
      const sharkWalkTextures = createAnimationTextures2('shark_walk', 10, 398, 1398, 1990);
      const sharkAttackTextures = createAnimationTextures2('shark_attack', 21, 398, 3495, 1990);
      sharkEmergeTextures = createAnimationTextures2('shark_emerge', 5, 398, 699, 1990);
      const backgroundImage = PIXI.Sprite.from('background');
      const clouds = createTilingSprite(cloudsTexture, backgroundImage.width * 30, 200);
      const clouds2 = createTilingSprite(clouds2Texture, backgroundImage.width * 30, 200);
      clouds2.position.y += 100;
      clouds2.alpha = .3;
      const enemyDeathTextures = createAnimationTextures('enemy_death', 8, 317);
      enemyDeath = createAnimatedSprite(enemyDeathTextures);
      const castleDeathTextures = createAnimationTextures('enemy_death', 8, 317);
      castleDeath = createAnimatedSprite(castleDeathTextures);
      const playerSpawn = createAnimatedSprite(enemyDeathTextures);
      castleDeath.animationSpeed = 0.175;
      castleDeath.loop = false;
      castleDeath.anchor.set(1, 0);
      castleDeath.scale.set(0.5);
      let characterTextures;

      characterTextures = frogWalkTextures;
      critter = createAnimatedSprite(characterTextures);
      critter.interactive = true;

      critter.textures = frogWalkTextures;
      critter.loop = true;
      critter.play();
      // Define the desired color in hexadecimal format
      const desiredColor = 0x00ff00; // Green color

      // Apply the color filter to the sprite
      playerSpawn.tint = desiredColor;
      playerSpawn.animationSpeed = 0.175;
      playerSpawn.loop = false;
      playerSpawn.anchor.set(.65, 0.2);
      playerSpawn.scale.set(0.35);
      updateCurrentLevels();
      enemyDeath.animationSpeed = 0.175;
      enemyDeath.loop = false;
      enemyDeath.anchor.set(0.2, 0);
      enemyDeath.scale.set(0.35);
      enemyDeath.position.set(-10000, -100000);
      const velocity = new PIXI.Point();
      let xDir = 0;
      let yDir = 0;
      let isMoving = false;

      function createAnimationTextures(resourceName, frameCount, frameHeight) {
        const textures = [];
        const textureWidth = PIXI.Loader.shared.resources[resourceName].texture.width / frameCount;

        for (let i = 0; i < frameCount; i++) {
          const rect = new PIXI.Rectangle(i * textureWidth, 0, textureWidth, frameHeight);
          const texture = new PIXI.Texture(PIXI.Loader.shared.resources[resourceName].texture, rect);
          textures.push(texture);
        }

        return textures;
      }

      function createAnimationTextures2(resourceName, frameCount, frameHeight, sheetWidth, sheetHeight) {
        const textures = [];
        const frameWidth = sheetWidth / Math.ceil(frameCount / (sheetHeight / frameHeight));

        for (let i = 0; i < frameCount; i++) {
          const row = Math.floor(i / (sheetWidth / frameWidth));
          const col = i % (sheetWidth / frameWidth);
          const rect = new PIXI.Rectangle(col * frameWidth, row * frameHeight, frameWidth, frameHeight);
          const texture = new PIXI.Texture(PIXI.Loader.shared.resources[resourceName].texture, rect);
          textures.push(texture);
        }

        return textures;
      }

      function createAnimatedSprite(textures) {
        const sprite = new PIXI.AnimatedSprite(textures);
        sprite.scale.set(0.5);
        sprite.anchor.set(.5, .5);
        sprite.position.set(app.screen.width / 3, app.screen.height - foreground.height / 1.6);
        sprite.animationSpeed = 0.25;
        sprite.zIndex = 1;
        sprite.loop = true;
        return sprite;
      }

      function createTilingSprite(texture, width, height) {
        const sprite = new PIXI.TilingSprite(texture, width, height);
        sprite.tileScale.set(0.4);
        sprite.tilePosition.y = 200;
        app.stage.addChild(sprite);
        return sprite;
      }

      // Variables
      let attackAnimationPlayed = false; // Flag variable to track if attack animation has played
      let pointerHoldInterval;
      let activeTouches = 0;

      app.stage.interactive = true;
      app.stage.on("pointerdown", handleTouchStart);
      app.stage.on("pointerup", handleTouchEnd);
      app.stage.on("touchendoutside", handleTouchEnd);
      xDir = 1;
      updateVelocity();
      critter.loop = true;



      function handleTouchStart(event) {



        const deleteButton = event.target;

        // Log the event target and its text
        console.log(`Event target: ${deleteButton}`);
        console.log(`Event target text: ${deleteButton.text}`);

        if (deleteButton && deleteButton.text === '🗑️') {
          console.log('Delete button clicked');
          return;
        }
        if (deleteButton.text === '🔵') {
          console.log('Blue button clicked');
          return;
        }
        if ((deleteButton && deleteButton.text === '🔊') || (deleteButton && deleteButton.text === '🔈')) {
          console.log('Sound button clicked');
          return;
        }
        if (deleteButton === backgroundSprite || deleteButton === pauseMenuContainer) {
          console.log('Background or Pause menu clicked');
          return;
        }
        if (deleteButton === pauseMenuContainer || deleteButton.myCustomID === 'pauseMenuX') {
          console.log('Background or Pause menu clicked');
          return;
        }



        if (isPointerDown = true) {
          isPointerDown = false;
          console.log('Mouse has left the screen');
          attackAnimationPlayed = true;
          handleTouchEnd(event);

        }




        activeTouches++;

        if (attackAnimationPlayed) {
          attackAnimationPlayed = false;
        }

        if (getisPaused()) {


          if (getPlayerCurrentHealth() > 0) {

            setisPaused(false);
            // Hide the spawn text
            document.getElementById('spawn-text').style.visibility = 'hidden';
          }
          return;
        }
        function handleMouseLeave(event) {
          isPointerDown = false;
          console.log('Mouse has left the screen');
          attackAnimationPlayed = true;
          handleTouchEnd(event);

          // Perform any additional actions you want here
        }

        function handleTouchHold() {
          if (getisPaused()) {
            return;
          }
          if (roundOver === true) { isAttacking = false; attackAnimationPlayed = false; return; }
          if (!isAttackingChar) {
            if (!getisDead()) {
              isAttackingChar = true;
              critter.textures = frogAttackTextures;
              setCharAttackAnimating(true);
              critter.loop = false;
              critter.onComplete = function () {
                if (!isAttackingChar) {
                  return; // Return early if attack was interrupted (paused)
                }
                if (isAttackingChar) {
                  attackAnimationPlayed = true;
                  attackSound.volume = 0.25;
                  attackSound.src = "./attacksound.wav";
                  attackSound.play();
                  if (getCurrentCharacter() === "character-bird") {
                    const birdProjectile = new PIXI.Sprite(
                      PIXI.Loader.shared.resources["bird_egg"].texture
                    );
                    birdProjectile.position.set(
                      critter.position.x,
                      critter.position.y
                    );
                    birdProjectile.name = "birdProjectile";
                    birdProjectile.scale.set(0.3);
                    app.stage.addChild(birdProjectile);

                    const projectileSpeed = 6;
                    const maxDistance = 450; // You can change this to the maximum distance you want the egg to travel
                    const startingX = birdProjectile.x;
                    const gravity = 0.1; // This controls the strength of the "gravity"
                    let verticalSpeed = -3; // This is the initial vertical speed. A negative value means the projectile will move up at first.

                    function updateProjectile() {
                      birdProjectile.x += projectileSpeed;

                      // Apply the "gravity" to the vertical speed
                      verticalSpeed += gravity;
                      // Apply the vertical speed to the projectile's position
                      birdProjectile.y += verticalSpeed;

                      if (Math.abs(birdProjectile.x - startingX) > maxDistance) {
                        // If the projectile has travelled more than the maximum distance, remove it
                        app.stage.removeChild(birdProjectile);
                        app.ticker.remove(updateProjectile);
                      }

                      // If the birdProjectile has been removed for any other reason, stop the update
                      if (!app.stage.children.includes(birdProjectile)) {
                        app.ticker.remove(updateProjectile);
                      }
                    }

                    app.ticker.add(updateProjectile);
                  }

                  if (critter.position.x > castle.position.x - castle.width / 1.1) {
                    console.log("takingDamage");
                    const greyscaleFilter = new PIXI.filters.ColorMatrixFilter();
                    const remainingHealthPercentage = castleHealth / castleMaxHealth;
                    const greyscaleFactor = 1 - remainingHealthPercentage;

                    greyscaleFilter.desaturate(greyscaleFactor);

                    castle.filters = [greyscaleFilter];

                    castleTakeDamage(getCharacterDamage(getCurrentCharacter()));
                  }
                  isAttackingChar = false;
                  isMoving = false;
                }
                isAttackingChar = false;
                critter.play();
              };
              critter.play();
            } else { isAttackingChar = false; }
          }
        }

        isPointerDown = true;
        pointerHoldInterval = setInterval(handleTouchHold, 10);
        document.addEventListener("mouseout", handleMouseLeave);

        document.addEventListener("touchend", handleMouseLeave);
      }

      function handleTouchEnd(event) {

        activeTouches--;
        clearInterval(pointerHoldInterval);

        isPointerDown = false;

        if (!attackAnimationPlayed) {
          return;
        }

        xDir = 1;
      }

      function getCharacterSpeed(currentCharacter) {
        switch (currentCharacter) {
          case 'character-snail':
            return getSnailSpeed();
          case 'character-bird':
            return getBirdSpeed();
          case 'character-frog':
            return getFrogSpeed();
          case 'character-bee':
            return getBeeSpeed();
          default:
            console.log('Invalid character', currentCharacter);
        }
      }


      function updateVelocity() {

        setIsCharAttacking(false);
        velocity.x = xDir * getCharacterSpeed(getCurrentCharacter());
        velocity.y = yDir * getCharacterSpeed(getCurrentCharacter());
        // console.log(isMoving);
        if (isMoving) {
          mountainVelocity1.x = mountainVelocityX;
          mountainVelocity1.y = mountainVelocityY;
          mountainVelocity2.x = mountainVelocityX;
          mountainVelocity2.y = mountainVelocityY;

        }

      }

      // Function to update the HP bar based on the castle's health
      function updateHPBar(health, maxHealth) {

        const hpRatio = health / maxHealth;
        const newHpWidth = Math.max(0, hpBarWidth * hpRatio);
        hpBar.clear();
        hpBar.beginFill(hpBarColor);
        hpBar.drawRect(hpBarX, hpBarY, newHpWidth, hpBarHeight);
        hpBar.endFill();
      }

let hasExploded = false;
      // Damage function
      function castleExpDrop(damage){
        expToGive = Math.round(damage * 0.25);
        if(cantGainEXP){return;}
        const expDrop = new PIXI.Text("+" + expToGive+ " EXP", {
          fontSize: 18,
          fill: "orange",
          fontWeight: "bold",
          stroke: "#000",
          strokeThickness: 3,
          strokeOutside: true
        });

    
        setCharEXP(getCurrentCharacter(), getCharEXP(getCurrentCharacter()) + expToGive);
        //ox setPlayerEXP(getPlayerEXP() + 100);
        console.log("YEP", getCharEXP(getCurrentCharacter()));
        console.log("YEPX", getEXPtoLevel(getCurrentCharacter()));
        updateEXP(getCharEXP(getCurrentCharacter()) + expToGive, getEXPtoLevel(getCurrentCharacter()));
        expDrop.position.set(critter.position.x + 20, critter.position.y - 20);
        expDrop.zIndex = 9999999999;
        app.stage.addChild(expDrop);
    
        // Animate the EXP drop text
        const startY = critter.position.y - 20;
    
        const endY = startY - 50; // Adjust the value to control the floating height
        const duration = 2600; // Animation duration in milliseconds
        const startTime = performance.now();
    
        const animateExpDrop = (currentTime) => {
          const elapsed = currentTime - startTime;
    
          if (elapsed < duration) {
            const progress = elapsed / duration;
            const newY = startY - (progress * (startY - endY));
            expDrop.position.y = newY;
            requestAnimationFrame(animateExpDrop);
          } else {
            // Animation complete, remove the EXP drop text
            app.stage.removeChild(expDrop);
          }
        };
    
        requestAnimationFrame(animateExpDrop);

      }
      let expToGive = 0;
      function castleTakeDamage(damage) {
        castleHealth -= damage;
        
        if ((castleHealth <= 0) && (!hasExploded)) {

         
          let newHP = getPlayerCurrentHealth() + 25;
          if (newHP < getPlayerHealth()) {
            setPlayerCurrentHealth(newHP);
            updatePlayerHealthBar(getPlayerCurrentHealth() / getPlayerHealth() * 100);
          }
          else {
            setPlayerCurrentHealth(getPlayerHealth());
            updatePlayerHealthBar(getPlayerHealth() / getPlayerHealth() * 100);
          }
          hasExploded=true;
          castleExplode();
        }
        else{
          castleExpDrop(damage);}

        updateHPBar(castleHealth, castleMaxHealth);
      }
let cantGainEXP = false;
      function castleExplode() {
        cantGainEXP = true;
        currentRound++;
        setEnemiesInRange(0);
        console.log("enemies has been updated to", getEnemiesInRange())
        resetEnemiesState();
        exploded = true;
        app.stage.removeChild(castle);
        let completedExplosions = 0; // Counter for completed explosions
        createCoffeeDrop(critter.position.x + 20, critter.position.y-20);

        // Create multiple explosions
        for (let i = 0; i < 7; i++) {
            // Create a new explosion sprite for each explosion
            const explosion = createAnimatedSprite(castleDeathTextures);
    
            // Customize the position, size, speed, and tint of each explosion
            explosion.position.set(
                castle.position.x + Math.random() * 70 - 25 - 140, 
                castle.position.y - 100 + Math.random() * 70 - 25
            );
            if (i === 6) { // Conditions for the last explosion
              explosion.scale.set(0.35); // This sets the size of the last explosion
              explosion.animationSpeed = 0.1; // This makes the last explosion go really slow
              explosion.tint = 0x000000; // This makes the last explosion black
              explosion.position.set(explosion.position.x, explosion.position.y + 50);
          } else {
              explosion.scale.set(0.35 * (0.75 + Math.random() * 0.5));
              explosion.animationSpeed = 0.1 + Math.random() * .1 - .03;
              explosion.tint = getRandomColor();
          }
          explosion.loop=false;
            // Add the explosion sprite to the stage
            app.stage.addChild(explosion);
    
            // Play the explosion animation
            explosion.gotoAndPlay(0);
    
            // Remove the explosion animation after it completes
            explosion.onComplete = () => {
                app.stage.removeChild(explosion);
                completedExplosions++; // Increment the counter when an explosion completes

                if (completedExplosions === 7) { // All explosions completed
                  roundOver = true;
                
              }
            };
        }
    }
    

      let unPauser = 0;
      const maxX = foreground.width - critter.width / 2;
      const cloudSpeed = .5 / 3.5;
      const cloud2Speed = 1.1 / 3.5;

      const mountain1Speed = 0.01;
      const mountain2Speed = 0.05;
      const mountain3Speed = .03;
      const mountain4Speed = .03;
      initialClouds = clouds.position.x;
      let once = 0;
      app.ticker.add(() => {
        if (isTimerFinished()) {
          pauseTimer();
        }
        //console.log("HERXOROR:", getEnemiesInRange());
        if (reviveDialogContainer) {
          update();
        }
        if (pauseMenuContainer) {
          update();
        }
        if (getisPaused()) {


          // Game is paused, skip logic
          critter.stop();

          getEnemies().forEach(enemy => {
            enemy.stop();
          });
          unPauser = 1;
          return;
        }
        if (unPauser === 1) {
          critter.play();
          getEnemies().forEach(enemy => {
            enemy.play();
          });
          unPauser = 0;
          return;
        }


        //console.log("isatt:", isAttackingChar);
        if (roundOver) {
          if (getPlayerCurrentHealth() <= 0) {
            document.getElementById('spawn-text').style.visibility = 'visible';
            //document.getElementById("pause-text").style.visibility = "hidden";
          }

          // Calculate the amount to move the camera per frame
          const cameraSpeed = 6;

          // Calculate the target position (start position)
          const targetX = 0;
          const targetY = 0;

          // Calculate the distance between the current position and the target position
          const distanceX = targetX - app.stage.x;
          const distanceY = targetY - app.stage.y;

          // Calculate the movement for this frame
          const movementX = Math.sign(distanceX) * Math.min(Math.abs(distanceX), cameraSpeed);
          const movementY = Math.sign(distanceY) * Math.min(Math.abs(distanceY), cameraSpeed);

          // Update the camera position
          app.stage.x += movementX;
          app.stage.y += movementY;
          mountain1.position.x -= velocity.x * mountain1Speed;
          mountain2.position.x += velocity.x * mountain2Speed;
          mountain3.position.x += velocity.x * mountain3Speed;
          mountain4.position.x += velocity.x * mountain4Speed;
          // Return if the camera has reached the target position
          if (app.stage.x === targetX && app.stage.y === targetY) {

            if (currentSnailHealth + currentBeeHealth + currentBirdHealth + currentFrogHealth <= 0) {
              console.log("BANG");
              setisWiped(true);
            }

            if (exploded) {

              mountain1.tint = getRandomColor();
              mountain2.tint = getRandomColor();
              mountain3.tint = getRandomColor3();
              mountain4.tint = getRandomColor3();
              foreground.tint = getRandomColor();
              for (let i = 0; i < enemies.length; i++) {
                const enemy = enemies[i];
                console.log("hex", i);

                // Remove the enemy and its associated HP bar elements from the PIXI stage
                app.stage.removeChild(enemy);
                app.stage.removeChild(enemy.hpBar);
                app.stage.removeChild(enemy.hpBarBackground);

                // Destroy the enemy object to free up memory
                enemy.destroy();

                // Remove the enemy from the enemies array
                enemies.splice(i, 1);
                i--; // Decrement i to adjust for the removed enemy
              }
              exploded = false;
              saveGame();

              cantGainEXP=false;
              resetTimer();
              startTimer();
              app.stage.addChild(castle);
              app.stage.addChild(critter);
app.stage.addChild(hpBarBackground,hpBar);
              console.log("REEEE");
              hasExploded = false;
            }

            playRoundText(currentRound);


            castle.tint = originalTint;
            setCharAttackAnimating(false);
            setIsCharAttacking(false);
            app.stage.removeChild(frogGhostPlayer);
            critter.position.set(app.screen.width / 20, stored);
            if (fullReset) {
              setPlayerCurrentHealth(getPlayerHealth());
              updatePlayerHealthBar(getPlayerHealth() / getPlayerHealth() * 100);
            }
            // Reset castle health
            castleHealth = castleMaxHealth + 20;
            castleMaxHealth = castleHealth;
            updateHPBar(castleHealth, castleMaxHealth);

            // Remove any existing enemy death sprites
            // Set isCombat and playAgain to false
            isCombat = false;
            enemyPortrait = document.getElementById('enemy-portrait');
            enemyPortrait.style.display = 'none'; // Make the element visible
            playAgain = false;
            isAttackingChar = false;
            isMoving = true;;
            setIsDead(false);
            critter.loop = true;
            critter.textures = frogWalkTextures;
            critter.play();
            setEnemiesInRange(0);
            // setPlayerCurrentHealth(0);
            // Clear the enemies array
            isPointerDown = false;

            let characterHealth;

            switch (getCurrentCharacter()) {
              case 'character-snail':
                characterHealth = currentSnailHealth;
                console.log("SNALIED");
                break;
              case 'character-bird':
                characterHealth = currentBirdHealth;
                break;
              case 'character-frog':
                characterHealth = currentFrogHealth;
                break;
              case 'character-bee':
                characterHealth = currentBeeHealth;
                break;
              default:
                console.log('Invalid character', characterType);
                return;
            }
            if (characterHealth == 0) {
              setisPaused(true); // Exit the function, don't perform any further actions
            }


            if (fullReset) {
              // Loop through the enemies array and remove each enemy
              for (let i = 0; i < getEnemies().length; i++) {
                let enemy = getEnemies()[i];
                // console.log(i);
                app.stage.removeChild(enemy);
                app.stage.removeChild(enemy.hpBar);
                app.stage.removeChild(enemy.hpBarBackground);
                // Destroy the enemy object to free up memory

              }

              enemies.length = 0;
            }
            roundOver = false;
            // setisPaused(false);
            setIsDead(false);
            resetEnemiesState();
            spawnEnemies();

          }
          return;
        }
        //setisPaused(true);

        if (getCharSwap()) {
          console.log("getcurrentchat", getCurrentCharacter());
          if (getCurrentCharacter() === "character-bird") {
            playerSpawn.tint = 0x0000ff; // Blue
            playerSpawn.blendMode = PIXI.BLEND_MODES.ADD;
            playSpawnAnimation(critter, playerSpawn);
            frogWalkTextures = birdWalkTextures;
            frogIdleTextures = birdWalkTextures;
            frogAttackTextures = birdAttackTextures;

          }
          else if (getCurrentCharacter() === "character-frog") {
            console.log("SWAP TO SNELL");
            playerSpawn.blendMode = PIXI.BLEND_MODES.ADD;
            playerSpawn.tint = 0x00ff80; // Light green
            playSpawnAnimation(critter, playerSpawn);
            frogWalkTextures = frogWalkTextures1;
            frogIdleTextures = frogIdleTextures1;
            frogAttackTextures = frogAttackTextures1;


          }
          else if (getCurrentCharacter() === "character-snail") {
            playerSpawn.blendMode = PIXI.BLEND_MODES.ADD;
            playerSpawn.tint = 0x800080; // Dark purple

            playSpawnAnimation(critter, playerSpawn);
            frogWalkTextures = snailWalkTextures;
            frogIdleTextures = snailWalkTextures;
            frogAttackTextures = snailAttackTextures;



          }
          else if (getCurrentCharacter() === "character-bee") {
            playerSpawn.tint = 0xffff00; // Yellow

            playerSpawn.blendMode = PIXI.BLEND_MODES.ADD;
            playSpawnAnimation(critter, playerSpawn);
            frogWalkTextures = beeWalkTextures;
            frogIdleTextures = beeWalkTextures;
            frogAttackTextures = beeAttackTextures;



          }
          critter.position.x -= 20;
          updateEXP(getCharEXP(getCurrentCharacter()), getEXPtoLevel(getCurrentCharacter));
          document.getElementById('spawn-text').style.visibility = 'hidden';
          updateVelocity();
          setCharSwap(false);
          stopFlashing();
          app.stage.addChild(critter);

          return;
        }

        if (getSpeedChanged()) { updateVelocity(); setSpeedChanged(false); }
        if (!isAttackingChar) {
          //  console.log("attacking char",isAttackingChar);
          if (!getisDead()) {
            //  console.log("not getisdead");
            console.log("getenemiesinrange", getisPaused(), getisDead(), getEnemiesInRange());
            if (!isCombat) {
              //   console.log("not iscombat");
              if (!isPointerDown) {
                // console.log("not ispointerdown");
                if (getEnemiesInRange() <= 0) {

                  if (getCurrentCharacter() != "character-snail") {
                    critter.position.x += velocity.x;

                  }
                  else {
                    if (critter.currentFrame > critter.totalFrames / 2) {
                      critter.position.x += velocity.x * 2;

                    }
                  }
                  if ((critter.textures != frogWalkTextures)) {
                    console.log("nope");
                    critter.textures = frogWalkTextures;
                    critter.play();
                  }
                  critter.loop = true;
                  mountain1.position.x -= velocity.x * mountain1Speed;
                  mountain2.position.x -= velocity.x * mountain2Speed;
                  mountain3.position.x -= velocity.x * mountain3Speed;
                  mountain4.position.x -= velocity.x * mountain4Speed;
                }
                else {
                  if (critter.textures != frogIdleTexture) {
                    critter.textures = frogIdleTextures;
                    critter.stop();
                  }
                }
              }
            }
            else {
              if (critter.textures != frogIdleTexture) {
                critter.textures = frogIdleTextures;
                critter.stop();
                critter.loop = false;
              }
            }
          }


          if (critter.position.x > maxX - 100) {
            critter.position.x = maxX - 100;
          }
          if (critter.position.x > 1500) {
            hpBar.visible = true; // Show the HP bar
            hpBarBackground.visible = true;
          } else {
            hpBar.visible = false;
            hpBarBackground.visible = false; // Hide the HP bar
          }

        }

        // Update cloud position
        clouds.position.x -= cloudSpeed;
        clouds2.position.x -= cloud2Speed;
        // Check if cloud has gone offscreen and move it to the right side
        if (clouds.x + clouds.width / 2 < -3000) {
          clouds.x = initialClouds;
        }
        if (clouds2.x + clouds2.width / 2 < -3000) {
          clouds2.x = initialClouds;
        }
        if (!getAreResetting()) {
          // Adjust app stage position
          app.stage.x = Math.min(0, Math.max(-foreground.width + app.screen.width, -critter.position.x + app.screen.width / 2));
          app.stage.y = Math.min(0, Math.max(-foreground.height + app.screen.height, -critter.position.y + app.screen.height / 2));
        }
        else { }
      });
      app.stage.removeChild(loadingSprite);
      playRoundText(currentRound);

      // document.getElementById("infoboxs").style.visibility = "visible";
      document.getElementById("coffee-button").style.visibility = "visible";
      document.getElementById("infoboxes").style.visibility = "visible";
      document.getElementById("ui-overlay").style.visibility = "visible";
      document.getElementById("pause-button").style.visibility = "visible";
      document.getElementById("coffee-button").style.visibility = "visible";
      critter.scale.set(getFrogSize());

      stored = app.screen.height - foreground.height / 2.2 - critter.height * .22;
      console.log("STORED", stored);
      critter.position.set(app.screen.width / 20, app.screen.height - foreground.height / 2.2 - critter.height * .22);
      updateEXP(0, expToLevel);
      updatePlayerHealthBar(getPlayerCurrentHealth() / getPlayerHealth() * 100);
      // Start the timer animation
      if (getPlayerCurrentHealth() <= 0) {


        setisPaused(true);







        // Toggle the visibility of the character info boxes
        const characterBoxes = document.querySelectorAll('.upgrade-box.character-snail, .upgrade-box.character-bird, .upgrade-box.character-bee, .upgrade-box.character-frog');

        if (isCharacterMenuOpen) {
          characterBoxes.forEach((box) => {
            box.style.visibility = 'hidden';
          });
          isCharacterMenuOpen = false;
        } else {
          characterBoxes.forEach((box) => {
            if (selectedCharacter !== "" && box.classList.contains(selectedCharacter)) {
              box.style.visibility = 'hidden';
            } else {
              box.style.visibility = 'visible';
            }
          });
          isCharacterMenuOpen = true;
        }

        // Start the cooldown











      }
      app.stage.addChild(background, mountain4, mountain1, mountain2, mountain3, foreground, castle, critter, clouds, clouds2, hpBarBackground, hpBar, enemyDeath, castlePlayer);

      enemyTypes = [
        { attackTextures: pigAttackTextures, walkTextures: pigWalkTextures, name: "pig" },
        { attackTextures: octoAttackTextures, walkTextures: octoWalkTextures, name: "octo" },
        { attackTextures: eleAttackTextures, walkTextures: eleWalkTextures, name: "ele" },
        { attackTextures: critterAttackTextures, walkTextures: critterWalkTextures, name: "imp" },
        { attackTextures: pufferAttackTextures, walkTextures: pufferWalkTextures, name: "puffer" },
        { attackTextures: scorpAttackTextures, walkTextures: scorpWalkTextures, name: "scorp" },
        { attackTextures: tooferAttackTextures, walkTextures: tooferWalkTextures, name: "toofer" },
        { attackTextures: sharkAttackTextures, walkTextures: sharkWalkTextures, name: "shark" }

      ];


      spawnEnemies();



    }

  }
  let timeOfLastSpawn = Date.now();
  let interval = 15000; // Initial interval value
  let enemySpawnTimeout; // Variable to store the enemy spawn timeout ID
  let isSpawning = false; // Flag to track if an enemy is currently being spawned


  function spawnEnemies() {
    if (isSpawning || getisDead() || getisPaused()) {
      return; // If already spawning or game is paused or player is dead, exit the function
    }

    if (isTimerFinished()) {
      return
    }

    isSpawning = true; // Set isSpawning to true to indicate that a spawn ticker is running

    const randomIndex = Math.floor(Math.random() * enemyTypes.length);
    const selectedEnemy = enemyTypes[randomIndex];

    spawnEnemy(
      critter,
      selectedEnemy.attackTextures,
      selectedEnemy.walkTextures,
      selectedEnemy.name
    );

    timeOfLastSpawn = Date.now(); // Update the time of last spawn

    enemySpawnTimeout = setTimeout(() => {
      isSpawning = false; // Set isSpawning to false when the timeout completes
      spawnEnemies(); // Spawn the next enemy
    }, interval- (currentRound * 125)) ;
  }


  function checkEnemyCollision(projectile, enemy) {
    const projectileX = projectile.position.x;
    const projectileWidth = projectile.width;

    const enemyX = enemy.x;
    const enemyWidth = enemy.width;

    return (
      projectileX + projectileWidth > enemyX &&
      projectileX < enemyX + enemyWidth
    );
  }



  function getEnemyPortraitUrl(enemyName) {
    // Find the matching enemy portrait URL based on enemy name
    const enemy = enemyPortraits.find(portrait => portrait.name === enemyName);
    return enemy ? enemy.url : ''; // Return the URL or an empty string if not found
  }
  let enemyPortrait;



  function spawnEnemy(critter, critterAttackTextures, critterWalkTextures, enemyName) {
    const enemy = createSpawnEnemy(critterWalkTextures, enemyName);

    addEnemies(enemy); // add the already created enemy
    if (enemy.isAlive) {
      app.stage.addChild(enemy);
    }

    handleEnemySorting(enemy);

    app.ticker.add(() => {
      if (getisPaused()) {
        return;
      }

      if (app.stage.children.includes(enemy)) {
        handleEnemyActions(critter, critterAttackTextures, critterWalkTextures, enemy, enemyName);
      } else {
        removeEnemy(enemy);
        return;
      }
    });
  }

  function createSpawnEnemy(critterWalkTextures, enemyName) {
    const enemy = new PIXI.AnimatedSprite(critterWalkTextures);
    enemy.scale.set(determineEnemyScale(enemyName));
    enemy.exp = 32 + Math.floor(currentRound * 2);
    enemy.anchor.set(0.5, 0.5);
    enemy.resett = false;
    enemy.type = enemyName;
    enemy.isAttacking = false;
    enemy.enemyAdded = false;
    enemy.position.set(2800, app.screen.height - 120 - enemy.height / 8 - enemy.scale.y * 120 + (Math.random() * 60 - 30));
    enemy.zIndex = enemy.position.y + 10000;
    enemy.animationSpeed = enemyName === "pig" ? 0.23 : enemyName === "scorp" ? 0.15 : 0.25;
    enemy.loop = true;
    enemy.isAlive = true;
    enemy.attackDamage = 2 + currentRound;
    enemy.maxHP = 80 + currentRound * 7;
    enemy.currentHP = enemy.maxHP;
    enemy.scale.x *= -1; // Flip the enemy horizontally
    enemy.play();
    const randomSpeedFactor = 0.75 + Math.random() * 0.5; // Random speed factor between 0.75 and 1.25
    enemy.vx = -2 * randomSpeedFactor; // Set the enemy's horizontal velocity with random speed factor    console.log("enemy created", enemyName);
    return enemy;
  }

  function determineEnemyScale(enemyName) {
    switch (enemyName) {
      case "puffer":
        return 0.35;
      case "octo":
      case "ele":
      case "imp":
      case "shark":
        return 0.45;
      case "scorp":
        return 0.4;
      case "pig":
        return 0.5;
      default:
        return 0.45;
    }
  }

  function updateCurrentLevels()
  {
    characterLevelElement = document.getElementById("character-level");
    updateLightning = document.getElementById("lightning-level");
    updateHP = document.getElementById("heart-level");
    updateDamage = document.getElementById("swords-level");
    let level;

    level = getSnailLevel();

    updateLightning.textContent = getSnailSpeed().toString();
    updateHP.textContent = getSnailHealth().toString();
    updateDamage.textContent = getSnailDamage().toString();

    level = getBirdLevel();
    console.log("DIRTY", level);
    updateLightning.textContent = getBirdSpeed().toString();
    updateHP.textContent = getBirdHealth().toString();
    updateDamage.textContent = getBirdDamage().toString();

    level = getFrogLevel();
    updateLightning.textContent = getFrogSpeed().toString();
    updateHP.textContent = getFrogHealth().toString();
    console.log("LOADER", getCharacterDamage('character-frog').toString());
    updateDamage.textContent = getCharacterDamage('character-frog').toString();
    characterLevelElement.textContent = 'Lvl. ' + level;
    isCharacterMenuOpen = false; // Flag to track if the character menu is open

    level = getBeeLevel();
    updateLightning.textContent = getBeeSpeed().toString();
    updateHP.textContent = getBeeHealth().toString();
    updateDamage.textContent = getBeeDamage().toString();

  }

  function handleEnemySorting(enemy) {
    if (app.stage.children.includes(enemy)) {
      enemies.sort((a, b) => a.position.y - b.position.y);
      enemies.forEach((enemy) => {
        if (enemy.parent === app.stage) {
          app.stage.removeChild(enemy);
        }
      });
      enemies.forEach((enemy) => {
        app.stage.addChild(enemy);
      });
    }
  }

  function handleEnemyActions(critter, critterAttackTextures, critterWalkTextures, enemy, enemyName) {
    if (getisDead()) {
      return;
    }

    checkProjectileCollisions(critter, enemy);
    if (getisDead()) {
      enemy.textures = critterWalkTextures;
      enemy.loop = true;
      // enemy.play();
      return;
    }

    if (enemy.isAlive && enemy.position.x - critter.position.x > 100 && enemy.position.x > 250) {
      handleEnemyMoving(critterWalkTextures, enemy);
    } else {
      handleEnemyCombat(critter, critterAttackTextures, critterWalkTextures, enemy, enemyName);
    }

    //isCombat = false;
  }

  function handleEnemyMoving(critterWalkTextures, enemy) {
    if (enemy.textures !== critterWalkTextures && getEnemiesInRange() === 0) {
      enemy.textures = critterWalkTextures;
      enemy.loop = true;
      enemy.play();
    }
    enemy.position.x += enemy.vx;
  }

  function handleEnemyCombat(critter, critterAttackTextures, critterWalkTextures, enemy, enemyName) {


    if (critter.textures !== frogWalkTextures && critter.currentFrame === critter.totalFrames - 2) {
      handleCritterAttack(critter, enemy, critterAttackTextures);
    } else if (critter.currentFrame === critter.totalFrames - 1) {
      setIsCharAttacking(false);
    }

    if (!enemy.enemyAdded) {
      addEnemyInRange(enemy);
      return;
    }

    if (!getisDead() && !enemy.isAttacking && enemy.isAlive) {
      handleEnemyAttack(critter, critterAttackTextures, critterWalkTextures, enemy, enemyName);
    }
  }


  function handleCritterAttack(critter, enemy, critterAttackTextures) {
    if (!getIsCharAttacking()) {
      setIsCharAttacking(true);
      if (getCurrentCharacter() !== "character-bird") {
        critterAttack(critter, enemy, critterAttackTextures);
      }
    }
  }

  function addEnemyInRange(enemy) {
    enemy.enemyAdded = true;
    setEnemiesInRange(getEnemiesInRange() + 1);
  }

  function handleEnemyAttack(critter, critterAttackTextures, critterWalkTextures, enemy, enemyName) {
    if (!isCombat) {
      prepareEnemyPortrait(enemyName);
    }

    enemy.isAttacking = true;
    enemy.isCombat = true;

    handleEnemyAttacking(enemy, critterAttackTextures, critter, critterWalkTextures, enemyName);
  }

  function prepareEnemyPortrait(enemyName) {
    enemyPortrait = document.getElementById('enemy-portrait');
    updateEnemyGrayscale(100);


    if (portraitNames.hasOwnProperty(enemyName)) {
      enemyName = portraitNames[enemyName];
    }

    const portraitUrl = getEnemyPortraitUrl(enemyName);
    enemyPortrait.style.backgroundImage = `url(${portraitUrl})`;
    enemyPortrait.style.display = 'block';
  }

  function removeEnemy(enemy) {
    app.stage.removeChild(enemy);
    const index = getEnemies().indexOf(enemy);
    if (index !== -1) {
      getEnemies().splice(index, 1);
    }
    app.ticker.remove(() => { });
  }



  function checkProjectileCollisions(critter, enemy) {
    let projectile = null;
    let enemyHit = false;

    for (let i = app.stage.children.length - 1; i >= 0; i--) {
      const child = app.stage.children[i];
      if (child.name === 'birdProjectile') {
        projectile = child;

        if (!enemyHit && checkEnemyCollision(projectile, enemy)) {
          // Enemy is hit by the projectile
          // Perform desired actions here, such as removing the enemy sprite from the stage
          // app.stage.removeChild(enemy);
          rangedAttack(critter, enemy);
          app.stage.removeChild(projectile);

          enemyHit = true; // Mark that an enemy has been hit

          // You can add a break here if you want to hit only one enemy even if there are multiple overlapping enemies.
        }
      }
    }
  }






  function rangedAttack(critter, enemy) {
    // Apply damage to the enemy
    drawHitSplat(enemy);
    console.log('ENEMY HP', enemy.currentHP);

    if (enemy.currentHP <= 0) {
        // Callback function to remove enemy after death animation
        if (app.stage.children.includes(enemy)) {
            enemy.tint = 0xFF0000; // Set the hit color
            if (getEnemiesInRange() > 0) {
                setEnemiesInRange(getEnemiesInRange() - 1);
            }

            if (getEnemiesInRange() === 0) {
                const enemyPortrait = document.getElementById('enemy-portrait');
                enemyPortrait.style.display = 'none'; // Make the element visible
            }

            console.log("ENEMY DEAD", enemy.position.x, enemy.position.y);
            createCoffeeDrop(enemy.position.x + 20, enemy.position.y);
            app.stage.removeChild(enemy);
            getEnemies().splice(getEnemies().indexOf(enemy), 1);

            isCombat = false;
            setIsCharAttacking(false);
            playDeathAnimation(enemy, critter);

            critter.play();
        }
    } 
}

  function resetEnemiesState() {
    getEnemies().forEach(enemy => {
      enemy.isAlive = true;
      enemy.isCombat = false;
      enemy.inRange = false;

      enemy.enemyAdded = false;
      enemy.isAttacking = false; // allow the enemy to attack again
      enemy.play();  // restart the walking animation
    });




  }
  function playGhostFly() {

    pauseTimer();
    setEnemiesInRange(0);
    setIsDead(true);
    frogGhostPlayer.alpha = 0.5;

    var currentCharacter = getCurrentCharacter();

    switch (currentCharacter) {
      case "character-snail":
        frogGhostPlayer.texture = PIXI.Texture.from("frog_snail");
        break;
      case "character-bee":
        frogGhostPlayer.texture = PIXI.Texture.from("frog_bee");
        break;
      case "character-bird":
        frogGhostPlayer.texture = PIXI.Texture.from("bird_ghost");
        break;

      default:
        // Use a default texture if the character is not recognized
        frogGhostPlayer.texture = PIXI.Texture.from("frog_ghost");
        break;
    }

    app.stage.addChild(frogGhostPlayer);

    let startY = frogGhostPlayer.y; // starting position
    let targetY = startY - 400; // target position
    let speed = 1.5; // speed of the movement
    let wobbleSpeed = 0.05; // speed of the wobble
    let wobbleAmplitude = 7.5; // initial amplitude of the wobble
    let wobbleDamping = 0.99; // damping factor of the wobble
    let moveInterval;

    moveInterval = setInterval(() => {
      frogGhostPlayer.y -= speed;
      let wobbleOffset = Math.sin(frogGhostPlayer.y * wobbleSpeed) * wobbleAmplitude;
      frogGhostPlayer.x += wobbleOffset;
      wobbleAmplitude *= wobbleDamping;
      if (frogGhostPlayer.y <= targetY) {
        frogGhostPlayer.y = targetY; // Ensure the frog reaches the exact target position

        // Stop the frog's movement temporarily until character is selected
        clearInterval(moveInterval);
        if (leveling == false) {
          // Check if character is selected
          if (selectedCharacter !== "") {
            // Hide the character info boxes
            const characterBoxes = document.querySelectorAll('.upgrade-box.character-snail, .upgrade-box.character-bird, .upgrade-box.character-bee, .upgrade-box.character-frog');
            characterBoxes.forEach((box) => {
              if (box.classList.contains(selectedCharacter)) {
                box.style.visibility = 'hidden';
              } else {
                box.style.visibility = 'visible';
              }
            });
            isCharacterMenuOpen = true;

          }



        }
        app.stage.removeChild(frogGhostPlayer);
        roundOver = true;

        // Continue with the game logic here
        // ...
      }
    }, 16); // (16ms = 60fps)
  }



  function resetToAttackTextures(enemy, critterAttackTextures) {
    enemy.textures = critterAttackTextures;
    enemy.loop = true;
    enemy.gotoAndPlay(0);
  }

  function handleEnemyAttacking(enemy, critterAttackTextures, critter, critterWalkTextures, enemyName) {
    if (roundOver) { return; }

    console.log("enemyname?", enemyName);
    console.log("enemynaeeeme?", enemy.emerging);

    // If the enemy is a shark and it's not currently playing the emerge animation
    if (enemyName === "shark" && !enemy.emerging) {
      console.log(enemy.name, "TRANSITION");

      // Set the enemy textures to the shark emerge textures and play it once
      enemy.textures = sharkEmergeTextures;
      enemy.loop = false;
      enemy.emerging = true;  // Mark that the shark is in the process of emerging
      enemy.play();

      enemy.onComplete = () => {
        // After the shark emerge animation completes, set the enemy textures to the attacking textures
        enemy.emerging = false;  // Mark that the shark has finished emerging
        resetToAttackTextures(enemy, critterAttackTextures);
      };
    } else if (!enemy.emerging) {
      // For other enemies, directly set the enemy textures to the attacking textures
      resetToAttackTextures(enemy, critterAttackTextures);
    }


    let hasDied = false;
    if (roundOver) { return; }


    function onFrameChange(currentFrame) {

      if (roundOver) {
        enemy.isAttacking = false;
        setEnemiesInRange(0);
        enemy.removeInRange = false;
        console.log("notstuck");
        return;
      }

      if (enemiesInRange <= 0) {
        return;
      }
      if (currentFrame === enemy.totalFrames - 5) {

        if (enemy.isAlive) {
          if (!getisDead()) {
            if (!hasDied) {

              critter.tint = flashColor;
              setPlayerCurrentHealth(getPlayerCurrentHealth() - enemy.attackDamage);
              drawCharHitSplat(critter, enemy);
              updatePlayerHealthBar((getPlayerCurrentHealth() / getPlayerHealth()) * 100);

            }
            updatePlayerHealthBar((getPlayerCurrentHealth() / getPlayerHealth() * 100));
            if (getPlayerCurrentHealth() <= 0) {
              setPlayerCurrentHealth(0);


              if (!hasDied) {
                // console.log("playerhp", playerHP);
                hasDied = true;
                frogGhostPlayer.position.set(critter.position.x, critter.position.y);
                critter.tint = 0xffffff;
                app.stage.removeChild(critter);
                for (let i = 0; i < enemies.length; i++) {
                  const enemy = enemies[i];

                  if (app.stage.children.includes(enemy.hpBarBackground)) {
                    app.stage.removeChild(enemy.hpBarBackground);
                  }

                  if (app.stage.children.includes(enemy.hpBar)) {
                    app.stage.removeChild(enemy.hpBar);
                  }
                }
                playGhostFly();
                startFlashing();

                for (let i = 0; i < getEnemies().length; i++) {
                  let enemy = getEnemies()[i];
                  // console.log(i);
                  enemy.stop();
                  // Destroy the enemy object to free up memory
                }
                //enemy.play();

              }
              return;
            }
            setTimeout(() => {
              critter.tint = getFrogTintColor();
            }, flashDuration);
            if (enemy.isAlive) {
              hitSound.volume = .25;
              hitSound.play();
            }
            hasPlayedSound = true;
          }
          else {





          }

        }
        else { console.log("enemy is dead"); }

      }
    }

    enemy.onFrameChange = onFrameChange;

    const tickerHandler = () => {
      if (enemy.currentFrame === 0) {
        hasPlayedSound = false;
        if (enemy.position.x - critter.position.x < 150) {
          if (getEnemies().length === 0) {
            const enemyPortrait = document.getElementById('enemy-portrait');
            enemyPortrait.style.display = 'none'; // Make the element visible
            isCombat = false;
          } else {
            // Additional logic for enemy attacks
          }
        }
      }
    };

    app.ticker.add(tickerHandler);

    const removeEnemy = () => {
      if (app.stage.children.includes(enemy)) {
        app.stage.removeChild(enemy);
        app.stage.removeChild(enemy.hpBar);
        app.stage.removeChild(enemy.hpBarBackground);
      }

      const index = getEnemies().indexOf(enemy);
      if (index !== -1) {
        getEnemies().splice(index, 1);
      }

      app.ticker.remove(tickerHandler);
      enemy.onFrameChange = null; // Remove the onFrameChange event listener
    };

    app.ticker.add(() => {
      if (!app.stage.children.includes(enemy)) {
        removeEnemy();
      }
    });
  }


  function resetGame(critter, enemy, enemies) {
    let isReset = false;
    if (!isReset) {
      setEnemiesInRange(0);
      setCharAttackAnimating(false);
      setIsCharAttacking(false);
      app.stage.removeChild(frogGhostPlayer);
      critter.position.set(app.screen.width / 20, stored);
      setPlayerCurrentHealth(getPlayerHealth());
      updatePlayerHealthBar(getPlayerHealth() / getPlayerHealth() * 100);
      // Reset castle health
      castleHealth = 100;
      // Remove any existing enemy death sprites
      // Set isCombat and playAgain to false
      isCombat = false;
      const enemyPortrait = document.getElementById('enemy-portrait');
      enemyPortrait.style.display = 'none'; // Make the element visible
      playAgain = false;
      setIsDead(false);
      critter.loop = true;
      critter.textures = frogWalkTextures;
      critter.play();
      app.stage.addChild(critter);
      playRoundText(currentRound);

      // Loop through the enemies array and remove each enemy
      for (let i = 0; i < getEnemies().length; i++) {
        let enemy = getEnemies()[i];
        // console.log(i);
        app.stage.removeChild(enemy);
        app.stage.removeChild(enemy.hpBar);
        app.stage.removeChild(enemy.hpBarBackground);
        // Destroy the enemy object to free up memory
      }

      // Clear the enemies array
      enemies.length = 0;
      isAttackingChar = false;
      isMoving = true;
      isReset = true;
    }
  }

  function getCharacterDamage(currentCharacter) {
    switch (currentCharacter) {
      case 'character-snail':
        return getSnailDamage();
      case 'character-bird':
        return getBirdDamage();
      case 'character-frog':
        return getFrogDamage();
      case 'character-bee':
        return getBeeDamage();
      default:
        console.log('Invalid character', currentCharacter);
    }
  }


  function drawCharHitSplat(critter, enemy) {


    let damage = -enemy.attackDamage;


    const damageText = new PIXI.Text(`${damage}`, {
      fontSize: 24,
      fill: "rgb(240, 70, 60)", // This is a slightly more red color.
      fontWeight: "bold",
      stroke: "#000",
      strokeThickness: 3,
      strokeOutside: true
    });

    damageText.anchor.set(0.5);
    damageText.position.set(critter.position.x - 40, critter.position.y - 60);
    app.stage.addChild(damageText);

    // Animate the hitsplat
    const startY = damageText.position.y; // Adjust the starting Y position as needed
    const duration = 100; // Animation duration in milliseconds
    let elapsed = 0; // Elapsed time
    const update = (delta) => {
      elapsed += delta;

      if (elapsed >= duration) {
        app.ticker.remove(update); // Stop the ticker update
        app.stage.removeChild(damageText); // Remove hitsplat after animation
      } else {
        const progress = elapsed / duration;
        damageText.position.y = startY - (progress * 30); // Update the Y position based on progress
        damageText.alpha = 1 - progress/3; // Update the alpha (opacity) based on progress
      }
    };

    app.ticker.add(update); // Start the ticker update for hitsplat animation
  }




  function drawHitSplat(enemy) {
    // Flash hit color for a brief second
    const originalTint = enemy.tint;
    enemy.tint = 0xFF0000; // Set the hit color
    setTimeout(() => {
      enemy.tint = originalTint; // Reset to original color
    }, 100);
    let damage = null;
    const characterType = getCurrentCharacter();
    const enemyType = enemy.type;
  
    switch (characterType) {
      case 'character-snail':
        if (enemyType === 'imp' || enemyType === 'toofer') {  
          damage = Math.round(getSnailDamage() * 1.75); // Half damage for weak against enemy.type toofer
        } else if (enemyType === 'scorp') {
          damage = Math.round(getSnailDamage() * .75); // Double damage for strong against enemy.type scorp and puffer
        } else {
          damage = Math.round(getSnailDamage());
        }
        enemy.currentHP -= damage;
        break;
      case 'character-bird':
        if (enemyType === 'imp' || enemyType === 'toofer') {
          damage = Math.round(getBirdDamage() * 0.3); // 1/4 damage for weak against enemy.type imp and toofer
        } else if (enemyType === 'shark' || enemyType === 'puffer') {
          damage = Math.round(getBirdDamage() * 1.75); // Double damage for strong against enemy.type shark and octo
        } else {
          damage = Math.round(getBirdDamage());
        }
        enemy.currentHP -= damage;
        break;
      case 'character-frog':
        if (enemyType === 'pig' || enemyType === 'scorp') {
          damage = Math.round(getFrogDamage() * 1.75); // Double damage for strong against enemy.type pig and scorp
        } else if (enemyType === 'puffer') {
          damage = Math.round(getFrogDamage() * 0.75); // Half damage for weak against enemy.type ele and octo
        } else {
          damage = Math.round(getFrogDamage());
        }
        enemy.currentHP -= damage;
        break;
      case 'character-bee':
        if (enemyType === 'ele' || enemyType === 'octo') {
          damage = Math.round(getBeeDamage() * 1.75); // Double damage for strong against enemy.type ele and puffer
        } else if (enemyType === 'octo') {
          damage = Math.round(getBeeDamage() * 0.75); // Half damage for weak against enemy.type shark and pig
        } else {
          damage = Math.round(getBeeDamage());
        }
        enemy.currentHP -= damage;
        break;
      default:
        console.log('Invalid character type');
    }
  
    drawEnemyHPBar(enemy);
    updateEnemyGrayscale(enemy.currentHP);
    const damageText = new PIXI.Text(`${-damage}`, {
      fontSize: 24,
      fill: "rgb(240, 70, 60)", // This is a slightly more red color.
      fontWeight: "bold",
      stroke: "#000",
      strokeThickness: 3,
      strokeOutside: true
    });
  
    damageText.anchor.set(0.5);
    damageText.position.set(enemy.position.x + 40, enemy.position.y - 30);
    app.stage.addChild(damageText);
  
    // Animate the hitsplat
    const startY = damageText.position.y; // Adjust the starting Y position as needed
    const duration = 100; // Animation duration in milliseconds
    let elapsed = 0; // Elapsed time
    const update = (delta) => {
      elapsed += delta;
  
      if (elapsed >= duration) {
        app.ticker.remove(update); // Stop the ticker update
        app.stage.removeChild(damageText); // Remove hitsplat after animation
      } else {
        const progress = elapsed / duration;
        damageText.position.y = startY - progress * 30; // Update the Y position based on progress
        damageText.alpha = 1 - progress; // Update the alpha (opacity) based on progress
      }
    };
  
    app.ticker.add(update); // Start the ticker update for hitsplat animation
  }


  function critterAttack(critter, enemy, critterAttackTextures) {
    // Reduce enemy's HP
    console.log('ENEMY TYPE', enemy.type);

    drawHitSplat(enemy);

    console.log("dmgD", getCharacterDamage(getCurrentCharacter()));
    if (enemy.currentHP - getCharacterDamage(getCurrentCharacter()) <= 0) {
      // Callback function to remove enemy after death animation
      if (app.stage.children.includes(enemy)) {
        enemy.tint = 0xFF0000; // Set the hit color
        if (getCurrentCharacter !== 'character-bird') {
          if (getEnemiesInRange() > 0) {
            setEnemiesInRange(getEnemiesInRange() - 1);
          }
        }
        isCombat = false;
        if (getEnemiesInRange() === 0) {
          const enemyPortrait = document.getElementById('enemy-portrait');
          enemyPortrait.style.display = 'none'; // Make the element visible
        }

        setIsCharAttacking(false);
        console.log("ENEMY DEAD", enemy.position.x, enemy.position.y);
        createCoffeeDrop(enemy.position.x + 20, enemy.position.y);
        app.stage.removeChild(enemy);
        getEnemies().splice(getEnemies().indexOf(enemy), 1);

        playDeathAnimation(enemy, critter);
      }
    } 
  }





  function createCoffeeDrop(x, y) {
    // Create a container to hold the coffee beans
    const coffeeContainer = new PIXI.Container();

    // Get the bean texture from the loaded resources
    const beanTexture = PIXI.Texture.from("https://i.imgur.com/Ft63zNi.png");

    // Generate a random number between 1 and 10 for the number of coffee beans
    const numBeans = Math.floor(Math.random() * 15 + currentRound * 2) + 1;

    // Define the duration (in milliseconds) for the coffee beans to fall
    const duration = 2000; // Adjust this value as desired

    // Create and position coffee beans randomly within the container
    for (let i = 0; i < numBeans; i++) {
      const bean = new PIXI.Sprite(beanTexture);

      // Set the initial position of the coffee bean
      bean.anchor.set(0.5); // Set the anchor point to the center of the bean
      bean.x = x + Math.random() * 80 - 10; // Randomize the x position within a range
      bean.y = y + Math.random() * 60 - 20;;

      // Set a random rotation angle for the coffee bean
      bean.rotation = Math.random() * Math.PI * 2;

      // Set the scale of the coffee bean (adjust the values as desired)
      bean.scale.set(0.075 + Math.random() * 0.2); // Randomize the scale between 0.3 and 0.5

      // Add the coffee bean to the container
      coffeeContainer.addChild(bean);

      // Animate the coffee bean to drop gradually
      const targetY = y + 50; // Adjust the target position as desired
      const initialY = bean.y - 50;
      const startTime = Date.now();

      const update = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = elapsedTime / duration;

        if (progress >= 1) {
          bean.y = targetY;
          return;
        }

        bean.y = initialY + (targetY - initialY) * progress;
        requestAnimationFrame(update);
      };

      update();
    }

    // Add the coffee container to the stage or another container in your application
    app.stage.addChild(coffeeContainer);

    // Start a timer to remove the coffee beans after the specified duration
    setTimeout(() => {
      // Remove the coffee container from the stage or parent container
      app.stage.removeChild(coffeeContainer);
      createCoffeeDropText(x, y + 50, numBeans);

    }, duration * 1.5);
    addCoffee(numBeans);
  }

  function addCoffee(amount) {
    setCoffee(getCoffee() + amount);
    const coffeeAmountElement = document.getElementById('coffee-amount');
    const coffeeAmount = getCoffee();
    coffeeAmountElement.textContent = `${coffeeAmount}`;
  }

  function playSpawnAnimation(critter, critterSpawn) {
    stopFlashing();

    critterSpawn.position.set(critter.position.x, critter.position.y);
    app.stage.addChild(critterSpawn);


    critterSpawn.gotoAndPlay(0);

    // Remove the death animation after it completes
    critterSpawn.onComplete = () => {
      app.stage.removeChild(critterSpawn);
    };

  }
  function createCoffeeDropText(x, y, coffeeAmount) {
    // create the coffee drop text
    const coffeeDropText = "+" + coffeeAmount;
    const coffeeDrop = new PIXI.Text(coffeeDropText, {
      fontSize: 24,
      fill: "rgb(178, 135, 90)",
      fontWeight: "bold",
      stroke: "#000",
      strokeThickness: 3,
      strokeOutside: true
    });
  
    // Position the coffee drop text
    coffeeDrop.position.set(x, y-50);
    coffeeDrop.zIndex = 9999999999;
    app.stage.addChild(coffeeDrop);
  
    // Animate the Coffee drop text
    const startY = y -50;
    const endY = startY - 100; // Adjust the value to control the floating height
    const duration = 2600; // Animation duration in milliseconds
    const startTime = performance.now();
  
    const animateCoffeeDrop = (currentTime) => {
      const elapsed = currentTime - startTime;
  
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const newY = startY - (progress * (startY - endY));
        coffeeDrop.position.y = newY;
        requestAnimationFrame(animateCoffeeDrop);
      } else {
        // Animation complete, remove the coffee drop text
        app.stage.removeChild(coffeeDrop);
      }
    };
  
    requestAnimationFrame(animateCoffeeDrop);
  }

  function playDeathAnimation(enemy, critter) {

    // Add the death animation sprite to the stage
    enemyDeath.position.set(enemy.position.x, enemy.position.y);
    app.stage.addChild(enemyDeath);
    const expDropText = enemy.exp;
    const expDrop = new PIXI.Text("+" + enemy.exp + " EXP", {
      fontSize: 18,
      fill: "orange",
      fontWeight: "bold",
      stroke: "#000",
      strokeThickness: 3,
      strokeOutside: true
    });
    expDrop.position.set(enemy.position.x + 20, enemy.position.y - 20);
    expDrop.zIndex = 9999999999;
    app.stage.addChild(expDrop);

    // Animate the EXP drop text
    const startY = enemy.position.y - 20;

    const endY = startY - 50; // Adjust the value to control the floating height
    const duration = 2600; // Animation duration in milliseconds
    const startTime = performance.now();

    const animateExpDrop = (currentTime) => {
      const elapsed = currentTime - startTime;

      if (elapsed < duration) {
        const progress = elapsed / duration;
        const newY = startY - (progress * (startY - endY));
        expDrop.position.y = newY;
        requestAnimationFrame(animateExpDrop);
      } else {
        // Animation complete, remove the EXP drop text
        app.stage.removeChild(expDrop);
      }
    };

    requestAnimationFrame(animateExpDrop);
    // Play the death animation
    enemyDeath.gotoAndPlay(0);

    // Remove the death animation after it completes
    enemyDeath.onComplete = () => {
      setCharEXP(getCurrentCharacter(), getCharEXP(getCurrentCharacter()) + enemy.exp);
      //ox setPlayerEXP(getPlayerEXP() + 100);
      console.log("YEP", getCharEXP(getCurrentCharacter()));
      console.log("YEPX", getEXPtoLevel(getCurrentCharacter()));
      updateEXP(getCharEXP(getCurrentCharacter()) + enemy.exp, getEXPtoLevel(getCurrentCharacter()));

      // Create the EXP drop text

      // Remove the death animation sprite after it completes
      app.stage.removeChild(enemyDeath);
      //isCombat=false;
    };
  }

  function drawEnemyHPBar(enemy) {

    if (!enemy.initialWidth) {
      enemy.initialWidth = Math.round(enemy.width);
    }

    const hpBarWidth = 100;
    const hpBarHeight = 8;
    const hpBarX = enemy.anchor.x - 32;
    const hpBarY = -40;


    if (!enemy.hpBarContainer) {
      enemy.hpBarContainer = new PIXI.Container();
      enemy.addChild(enemy.hpBarContainer);
      console.log("HELLO");

      enemy.hpBarBackground = new PIXI.Graphics();
      enemy.hpBarBackground.beginFill(0x000000, 0.5);
      enemy.hpBarBackground.drawRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
      enemy.hpBarBackground.endFill();
      enemy.hpBarContainer.addChild(enemy.hpBarBackground);

      enemy.hpBar = new PIXI.Graphics();
      enemy.hpBar.beginFill(0xff0000, 0.75);
      enemy.hpBar.drawRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
      enemy.hpBar.endFill();
      enemy.hpBarContainer.addChild(enemy.hpBar);
      enemy.hpBarBackground.position.set(hpBarX, hpBarY);
      enemy.hpBar.position.set(hpBarX, hpBarY);
    }

    const maxHealth = enemy.maxHP; // Replace with actual max health of enemy
    const currentHealth = enemy.currentHP; // Replace with actual current health of enemy
    const hpBarRatio = currentHealth / maxHealth;
    const hpBarWidthActual = Math.max(Math.round(hpBarWidth * hpBarRatio), 0);

    enemy.hpBarContainer.scale.set(1 / Math.abs(enemy.scale.x), 1 / Math.abs(enemy.scale.y));
    console.log("HPX", hpBarX);
    console.log("HPY", hpBarY);

    enemy.hpBar.clear();
    enemy.hpBar.beginFill(0xff0000, 0.75);
    enemy.hpBar.drawRect(hpBarX + hpBarWidth - hpBarWidthActual, hpBarY, hpBarWidthActual, hpBarHeight);
    enemy.hpBar.endFill();
  }

  function handlePlayClick() {

    if (!isGameStarted) {
      isGameStarted = true;
      resetTimer();
      startTimer();
      startGame();
    }
  }



  function updatePlayerHealthBar(health) {
    const playerHealthBarFill = document.getElementById('health-bar-fill');
    playerHealthBarFill.style.width = health + '%';
    updateGrayscale(health);
    updateBarText('hp-text', 'hp', health);
  }


  function updateBarText(elementId, labelText, value) {
    const barText = document.getElementById(elementId);
    const roundedValue = getPlayerCurrentHealth().toFixed();
    barText.innerText = `${labelText}:\u00A0 ${roundedValue}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\/${getPlayerHealth()}`;
  }

  function updateGrayscale(hpPercentage) {
    const grayscalePercentage = 100 - hpPercentage;
    document.getElementById('character-portrait').style.filter = `sepia(${grayscalePercentage}%)`;
  }

  function updateEnemyGrayscale(hpPercentage) {
    const grayscalePercentage = 100 - hpPercentage;
    document.getElementById('enemy-portrait').style.filter = `grayscale(${grayscalePercentage}%)`;
  }

  function updateEXP(exp, expToLevel1) {
    let leftover = 0;
    if (exp >= getEXPtoLevel(getCurrentCharacter())) {
      leftover = exp - expToLevel1;
      setCharEXP(getCurrentCharacter(), leftover);
      setEXPtoLevel(getCurrentCharacter(), getEXPtoLevel(getCurrentCharacter() + expToLevel1) * 1.1);
      levelUp();

    }
    const playerEXPBarFill = document.getElementById('exp-bar-fill');
    playerEXPBarFill.style.width = getCharEXP(getCurrentCharacter()) / getEXPtoLevel(getCurrentCharacter()) * 100 + '%';
    updateExpText('exp-text', 'exp', getCharEXP(getCurrentCharacter()), getEXPtoLevel(getCurrentCharacter()));
  }



  function updateExpText(elementId, labelText, value, expToLevel) {
    const barText = document.getElementById(elementId);
    const roundedEXPValue = Math.round(value).toFixed();
    const roundedEnder = Math.round(expToLevel).toFixed();
    barText.innerText = `${labelText}: ${roundedEXPValue}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\/${roundedEnder}`;
  }

  let isUpgradeBoxesAnimated = false;

  function animateUpgradeBoxes() {
    console.log("SLECT", getSelectLevel());
    if (isUpgradeBoxesAnimated) {
      return; // If already animated, exit the function
    }
    isUpgradeBoxesAnimated = true; // Set the flag to indicate animation has occurred
    const upgradeBoxes = document.querySelectorAll('.upgrade-box');
    upgradeBoxes.forEach((box) => {
      const classNames = box.classList;
      box.style.visibility = 'hidden'; // Hide all upgrade boxes initially

      if (
        classNames.contains('spd-upgrade') ||
        classNames.contains('hp-upgrade') ||
        classNames.contains('attack-upgrade')
      ) {
        box.style.visibility = 'visible'; // Make the first three upgrade boxes visible
      }

      box.style.animationPlayState = 'running';
      box.removeEventListener('click', box.clickHandler); // Remove previous event listener

      // Define the click event handler separately
      box.clickHandler = () => {
        const upgradeType = classNames[1];
        handleUpgrade(upgradeType);
      };

      box.addEventListener('click', box.clickHandler); // Add the updated event listener
    });
  }


  function setCharacterSpeed(currentCharacter, speed) {
    switch (currentCharacter) {
      case 'character-snail':
        setSnailSpeed(speed);
        break;
      case 'character-bird':
        setBirdSpeed(speed);
        break;
      case 'character-frog':
        setFrogSpeed(speed);
        break;
      case 'character-bee':
        setBeeSpeed(speed);
        break;
      default:
        console.log('Invalid character', currentCharacter);
    }
  }

  function setCharacterHealth(currentCharacter, health) {
    switch (currentCharacter) {
      case 'character-snail':
        setSnailHealth(health);
        break;
      case 'character-bird':
        setBirdHealth(health);
        break;
      case 'character-frog':
        setFrogHealth(health);
        break;
      case 'character-bee':
        setBeeHealth(health);
        break;
      default:
        console.log('Invalid character', currentCharacter);
    }
  }

  function setCharacterDamage(currentCharacter, attack) {
    switch (currentCharacter) {
      case 'character-snail':
        setSnailDamage(attack);
        break;
      case 'character-bird':
        setBirdDamage(attack);
        break;
      case 'character-frog':
        setFrogDamage(attack);
        break;
      case 'character-bee':
        setBeeDamage(attack);
        break;
      default:
        console.log('Invalid character', currentCharacter);
    }
  }


  function handleUpgrade(upgradeType) {
    const upgradeBoxes = document.getElementsByClassName('upgrade-box');

    // Get the current character
    const currentCharacter = getCurrentCharacter();

    // Get the stats for the current character
    const stats = characterStats[currentCharacter];

    // Handle different upgrade types
    switch (upgradeType) {
      case 'spd-upgrade':
        // Logic for speed upgrade
        console.log('Speed upgrade');
        var divElement = document.getElementById("lightning-level");

        stats.level++;
        // Update the display
        stats.speed += .25; // Update the speed stat for the current character
        setCharacterSpeed(currentCharacter, stats.speed);
        setSpeedChanged(true);
        //console.log(getCharacterSpeed(currentCharacter));
        divElement.textContent = stats.speed.toString();

        setSelectLevel(getSelectLevel() - 1);

        break;

      case 'attack-upgrade':
        // Logic for attack upgrade
        console.log('Attack upgrade');
        var divElement = document.getElementById("swords-level");
        stats.attack += 3; // Update the attack stat for the current character
        setCharacterDamage(currentCharacter, stats.attack);
        // setSnailDamage(getSnailDamage() + 5);
        // Update the display with the new attack level
        divElement.textContent = stats.attack.toString();
        setSelectLevel(getSelectLevel() - 1);
        break;

      case 'hp-upgrade':
        // Logic for health upgrade
        console.log('Health upgrade');
        var divElement = document.getElementById("heart-level");
        stats.hp++;
        stats.health += 20; // Update the health stat for the current character
        console.log("YYcurrentCharacter", currentCharacter);
        console.log("YYN", getPlayerHealth() + 20);
        console.log("YYS", getPlayerCurrentHealth());
        if (!getisDead()) {
          if (getPlayerCurrentHealth() > 0) {
            setPlayerCurrentHealth(getPlayerCurrentHealth() + 20);
          }
        }
        setCharacterHealth(currentCharacter, getPlayerHealth() + 20);
        updatePlayerHealthBar(getPlayerCurrentHealth() / getPlayerHealth() * 100);

        divElement.textContent = stats.health.toString();

        setSelectLevel(getSelectLevel() - 1);

        break;

      default:
        console.log('Invalid upgrade type', upgradeType);
    }
    chooseSound.volume = .22;
    chooseSound.play();

    if (getSelectLevel() <= 0) {
      for (let i = 0; i < upgradeBoxes.length; i++) {
        upgradeBoxes[i].style.visibility = 'hidden';
      }
    }

    isUpgradeBoxesAnimated = false;
  }

  function levelUp() {
    leveling = true;
    const characterLevelElement = document.getElementById("character-level");

    // Function to update the character's level
    function updateCharacterLevel(level) {
      switch (getCurrentCharacter()) {
        case 'character-snail':
          level = snailLevel;
          break;
        case 'character-bird':
          level = birdLevel;
          break;
        case 'character-frog':
          level = frogLevel;
          break;
        case 'character-bee':
          level = beeLevel;
          break;
        default:
          console.log('Invalid character', getCurrentCharacter());
          return;
      }
      characterLevelElement.textContent = 'Lvl. ' + level;
    }

    // Determine which character is being leveled up
    switch (getCurrentCharacter()) {
      case 'character-snail':
        // Update level for character-snail
        updateCharacterLevel(snailLevel++);
        break;
      case 'character-bird':
        // Update level for character-bird
        updateCharacterLevel(birdLevel++);
        break;
      case 'character-frog':
        // Update level for character-frog
        updateCharacterLevel(frogLevel++);
        break;
      case 'character-bee':
        // Update level for character-bee
        updateCharacterLevel(beeLevel++);
        break;
      default:
        console.log('Invalid character');
        return;
    }

    setSelectLevel(getSelectLevel() + 1);
    animateUpgradeBoxes();
    levelSound.volume = .2;
    levelSound.play();
    leveling = false;
  }

  function handleVisibilityChange() {
    if (!document.hidden && !isSpawning && !getisDead()) {
      spawnEnemies();
  }
    if (document.hidden || document.webkitHidden) {
      // Document is hidden, perform actions here (e.g., pause the game)
      if (getPlayerCurrentHealth() > 0) {
        setisPaused(true);
      }
    } else {
      if (getPlayerCurrentHealth() > 0) {
        // Document is visible again, perform actions here (e.g., resume the game)
        setisPaused(false);
      }
    }
  }

  function playRoundText(round) {

    // Get the element with id "Round-text"
    var roundText = document.getElementById("round-text");

    // Set the round text
    roundText.innerHTML = round;

    // Reset opacity and display properties
    roundText.style.opacity = 1;
    roundText.style.display = "block";

    // Set the visibility to "visible"
    roundText.style.visibility = "visible";

    // Fade out the element gradually over 1 second
    var opacity = 1;
    var fadeOutInterval = setInterval(function () {
      if (opacity > 0) {
        opacity -= 0.01; // Adjust the fade out speed by changing this value
        roundText.style.opacity = opacity;
      } else {
        // When the element is completely faded out, hide it and stop the interval
        roundText.style.display = "none";
        clearInterval(fadeOutInterval);
      }
    }, 10); // Adjust the interval duration by changing this value
  }



  // Add event listeners for visibility change
  document.addEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener("webkitvisibilitychange", handleVisibilityChange);
  // Add touchstart event listener
  document.addEventListener("touchstart", () => {
    // Increment touch count
    touchCount++;
  });
  // Add touchend event listener
  document.addEventListener("touchend", () => {
    // Decrement touch count
    touchCount--;
    // Check if all touches are released
    if (touchCount === 0) {
      handleAllTouchesReleased();
    }
  });



  // Function to handle all touches released
  function handleAllTouchesReleased() {
    // Your functionality when all touches are released
    console.log("All touches released.");
    console.log("All touches released.");
    console.log("All touches released.");
    console.log("All touches released.");
    console.log("All touches released.");
    console.log("All touches released.");
    handleTouchEnd();
  }

  function getRandomColor() {
    const r = Math.floor(Math.random() * 192) + 64;
    const g = Math.floor(Math.random() * 192) + 64;
    const b = Math.floor(Math.random() * 128) + 128;
    const color = (r << 16) | (g << 8) | b;
    return color;
  }

  function getRandomColor1() {
    const r = Math.floor(Math.random() * 64) + 192;
    const g = Math.floor(Math.random() * 64) + 192;
    const b = Math.floor(Math.random() * 128) + 128;
    const color = (r << 16) | (g << 8) | b;
    return color;
  }

  function getRandomColor3() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 256);
    const color = (r << 16) | (g << 8) | b;
    return color;
  }



  // Save game data
  function saveGame() {
    localStorage.removeItem('gameSave');
    gameData = {
      expToLevel: expToLevel,
      currentRound: currentRound,
      coffee: coffee,
      frogSize: frogSize,
      speedChanged: speedChanged,
      selectLevel: selectLevel,
      frogTintColor: frogTintColor,
      snailSpeed: snailSpeed,
      snailDamage: snailDamage,
      snailHealth: snailHealth,
      snailLevel: snailLevel,
      beeLevel: beeLevel,
      birdLevel: birdLevel,
      birdSpeed: birdSpeed,
      birdDamage: birdDamage,
      touchCount: touchCount,
      birdHealth: birdHealth,
      beeSpeed: beeSpeed,
      beeDamage: beeDamage,
      beeHealth: beeHealth,
      frogSpeed: frogSpeed,
      frogDamage: frogDamage,
      frogHealth: frogHealth,
      frogLevel: frogLevel,
      currentFrogHealth: currentFrogHealth,
      currentSnailHealth: currentSnailHealth,
      currentBeeHealth: currentBeeHealth,
      currentBirdHealth: currentBirdHealth,
      isGameStarted: isGameStarted,
      characterStats: characterStats,
      repicked: repicked,
      frogEXP: frogEXP,
      snailEXP: snailEXP,
      beeEXP: beeEXP,
      birdEXP: birdEXP,
      frogEXPToLevel: frogEXPToLevel,
      snailEXPToLevel: snailEXPToLevel,
      beeEXPToLevel: beeEXPToLevel,
      birdEXPToLevel: birdEXPToLevel
    };

    const saveData = JSON.stringify(gameData);
    localStorage.setItem('gameSave', saveData);
  }

  // Load game data
  function loadGame() {
    const savedData = localStorage.getItem('gameSave');
    if (savedData) {

      const gameData = JSON.parse(savedData);
      currentRound = gameData.currentRound;
    
      // Load the saved values into your variables
      setCurrentFrogHealth(gameData.currentFrogHealth);
      setCurrentSnailHealth(gameData.currentSnailHealth);
      setCurrentBeeHealth(gameData.currentBeeHealth);
      setCurrentBirdHealth(gameData.currentBirdHealth);
      setCharEXP("character-frog", gameData.frogEXP);
      setCharEXP("character-snail", gameData.snailEXP);
      setCharEXP("character-bee", gameData.beeEXP);
      setCharEXP("character-bird", gameData.birdEXP);
      setEXPtoLevel("character-frog", gameData.frogEXPToLevel);
      setEXPtoLevel("character-snail", gameData.snailEXPToLevel);
      setEXPtoLevel("character-bee", gameData.beeEXPToLevel);
      setEXPtoLevel("character-bird", gameData.birdEXPToLevel);
      updateEXP(gameData.frogEXP, gameData.frogEXPToLevel);


      expToLevel = gameData.expToLevel;

      coffee = gameData.coffee;
      frogSize = gameData.frogSize;
      speedChanged = gameData.speedChanged;
      selectLevel = gameData.selectLevel;
      frogTintColor = gameData.frogTintColor;
      snailSpeed = gameData.snailSpeed;
      snailDamage = gameData.snailDamage;
      snailHealth = gameData.snailHealth;
      snailLevel = gameData.snailLevel;
      beeLevel = gameData.beeLevel;
      birdLevel = gameData.birdLevel;
      birdSpeed = gameData.birdSpeed;
      birdDamage = gameData.birdDamage;
      touchCount = gameData.touchCount;
      birdHealth = gameData.birdHealth;
      beeSpeed = gameData.beeSpeed;
      beeDamage = gameData.beeDamage;
      beeHealth = gameData.beeHealth;
      frogSpeed = gameData.frogSpeed;
      frogDamage = gameData.frogDamage;
      frogHealth = gameData.frogHealth;
      frogLevel = gameData.frogLevel;
      isGameStarted = gameData.isGameStarted;
      characterStats = gameData.characterStats;
      repicked = gameData.repicked;
      characterLevelElement = document.getElementById("character-level");
      updateLightning = document.getElementById("lightning-level");
      updateHP = document.getElementById("heart-level");
      updateDamage = document.getElementById("swords-level");
      let level;

      level = getSnailLevel();

      updateLightning.textContent = getSnailSpeed().toString();
      updateHP.textContent = getSnailHealth().toString();
      updateDamage.textContent = getSnailDamage().toString();

      level = getBirdLevel();
      console.log("DIRTY", level);
      updateLightning.textContent = getBirdSpeed().toString();
      updateHP.textContent = getBirdHealth().toString();
      updateDamage.textContent = getBirdDamage().toString();

      level = getFrogLevel();
      updateLightning.textContent = getFrogSpeed().toString();
      updateHP.textContent = getFrogHealth().toString();
      console.log("LOADER", getCharacterDamage('character-frog').toString());
      updateDamage.textContent = getCharacterDamage('character-frog').toString();
      characterLevelElement.textContent = 'Lvl. ' + level;
      isCharacterMenuOpen = false; // Flag to track if the character menu is open

      level = getBeeLevel();
      updateLightning.textContent = getBeeSpeed().toString();
      updateHP.textContent = getBeeHealth().toString();
      updateDamage.textContent = getBeeDamage().toString();
      updateEXPIndicatorText("character-bird", gameData.birdLevel);
      updateEXPIndicatorText("character-snail", gameData.snailLevel);
      updateEXPIndicatorText("character-frog", gameData.frogLevel);
      updateEXPIndicatorText("character-bee", gameData.beeLevel);
      //updatePlayerHealthBar((getPlayerCurrentHealth() / getPlayerHealth() * 100));
      console.log("LOADING", getPlayerCurrentHealth());
      addCoffee(gameData.coffee - gameData.coffee);
      //updateVelocity();
      setSelectLevel(0);
      roundover = false;
      cooldownActive = false;



    }
  }
  resetTimer();
      startTimer();
startGame();
isGameStart=true;
  }

});

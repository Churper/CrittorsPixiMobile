document.addEventListener('DOMContentLoaded', function () {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: Math.max(window.innerHeight),
    antialias: true,
    transparent: false,
    resolution: 1,
  });

  document.body.appendChild(app.view);
let fullReset = false;
let exploded = false;
  let currentRound = 1;
  let roundOver = false;
  let playerHealth = 100;
  let coffee = 0;
  let frogSize = .35;
  let speed = 1.5;
  let speedChanged = false;
  let selectLevel = 0;
  let frogTintColor = 0xffffff;
  let snailSpeed = 1;
  let snailDamage = 20;
  let snailHealth = 100;
  let snailLevel = 1;
  let beeLevel = 1;
  let birdLevel = 1;
  let birdSpeed = 1;
  let birdDamage = 15;
  let touchCount = 0;
  let birdHealth = 100;
  let beeSpeed = 1;
  let beeDamage = 25;
  let beeHealth = 100;
  let frogSpeed = 1;
  let frogDamage = 20;
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
  let repicked =false;
  let isDead = false;
  let enemiesInRange = 0;
  let areResetting = false;
  let isPaused = false;
  let isWiped = false;
  let isAttackingChar = false;
  let isGameStarted = false;
  let initialClouds = 0;
  let expToLevel = 100;
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
  

  function setCurrentFrogHealth(health) {
    currentFrogHealth = health;
    const frogHpIndicator = document.querySelector('.upgrade-box.character-frog .hp-indicator');
    const frogBox = document.querySelector('.upgrade-box.character-frog');
  
    frogHpIndicator.style.setProperty('--hp-indicator-height', `${(1 - (currentFrogHealth / getFrogHealth())) * 100}%`);
  
    if (currentFrogHealth <= 0) {
      frogBox.style.backgroundColor = 'grey';
      frogBox.style.pointerEvents = 'none';
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
      beeBox.style.pointerEvents = 'none';
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
      snailBox.style.pointerEvents = 'none';
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
      birdBox.style.pointerEvents = 'none';
    } else {
      birdBox.style.backgroundColor = ''; // Reset to default color
      birdBox.style.pointerEvents = ''; // Reset pointer events
    }
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
    return playerHealth;
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

    return playerHealth;
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

  function setisPaused(value) {
    //console.log("PAYSING");
    isPaused = value;

    // Get the pause text element
    var pauseText = document.getElementById("pause-text");

    // Swap the visibility based on the isPaused value
    if (isPaused) {
      pauseText.style.visibility = "visible";
    } else {
      pauseText.style.visibility = "hidden";
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
      setisPaused(!getisPaused());
      console.log("PAUSED");
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

  document.getElementById("character-portrait").addEventListener("click", function () {
    if (getSelectLevel() >= 1) {
      return;
    }

    // Check if there is a cooldown
    if (isCooldownActive()) {
      return;
    }

    if(roundOver){
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

  });

  function handleCharacterClick(characterType) {
    let characterHealthSnail= currentSnailHealth;;
    let characterHealthBird = currentBirdHealth;
    let characterHealthFrog  = currentFrogHealth;
    let characterHealthBee = currentBeeHealth;
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
 
  if (characterHealth <= 0) {
    return; // Exit the function, don't perform any further actions
  }


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
      setisPaused(false);
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



  menuSprite.anchor.set(0.5);
  menuSprite.width = app.screen.width;
  menuSprite.height = app.screen.height - 26;
  menuSprite.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.addChild(menuSprite);
  document.body.appendChild(app.view);
  const playButtonTexture = PIXI.Texture.from('https://i.imgur.com/5zdfKQG.png');
  const playButton = new PIXI.Sprite(playButtonTexture);
  playButton.anchor.set(.5, .5);
  playButton.interactive = true;
  playButton.buttonMode = true;
  playButton.position.set(app.screen.width / 4.2, app.screen.height / 4.2);
  const hoverScale = 1.2;
  const hoverAlpha = 0.8;
  app.stage.addChild(playButton);

  function startGame() {

    window.addEventListener('blur', () => {

      setisPaused(true);
    });

    const loadingTexture = PIXI.Texture.from('https://i.imgur.com/dJ4eoGZ.png');
    const loadingSprite = new PIXI.Sprite(loadingTexture);
    loadingSprite.anchor.set(0.5);
    loadingSprite.width = app.screen.width;
    loadingSprite.height = app.screen.height;
    loadingSprite.position.set(app.screen.width / 2, app.screen.height / 2);
    loadingSprite.alpha = 1; // Start fully opaque
    app.stage.removeChild(menuSprite);
    app.stage.removeChild(playButton);
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

    PIXI.Loader.shared.add([

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
      { name: 'puffer_walk', url: 'https://i.imgur.com/MfcmtYs.png' },
      { name: 'puffer_attack', url: 'https://i.imgur.com/DsVddKP.png' },
      { name: 'puffer_portrait', url: 'https://i.imgur.com/9gLYMax.png' },
      { name: 'snail_portrait', url: 'https://i.imgur.com/Chu3ZkP.png' },
      { name: 'frog_portrait', url: 'https://i.imgur.com/XaXTV73.png' },
      { name: 'bee_portrait', url: 'https://i.imgur.com/rmcGGP9.png' },
      { name: 'bean', url: 'https://i.imgur.com/Ft63zNi.png ' },
      { name: 'background', url: 'https://i.imgur.com/HNTGehL.png' },
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
      const timer1Texture = PIXI.Loader.shared.resources['timer1'].texture;
      const timer2Texture = PIXI.Loader.shared.resources['timer2'].texture;
      
      const timerFrames = [timer1Texture, timer2Texture];
      
      const timerAnimation = new PIXI.AnimatedSprite(timerFrames);
      timerAnimation.position.set(200, 30);
      timerAnimation.animationSpeed = 0.02; // Adjust the animation speed as desired
      timerAnimation.loop = true; // Set whether the animation should loop
      
      // Start the timer animation
      timerAnimation.play();
      
      // Add the timer animation to the stage
 
      
      const backgroundTexture = PIXI.Loader.shared.resources['background'].texture;
      const background = new PIXI.Sprite(backgroundTexture);
      background.width = app.screen.width * 2.75;
      background.height = app.screen.height;
      background.anchor.set(0.5, 0);
      background.position.set(0, 0);

      const anotherBackground = new PIXI.Sprite(backgroundTexture);
      anotherBackground.width = app.screen.width * 2.75;
      anotherBackground.height = app.screen.height;
      anotherBackground.anchor.set(0.5, 0);
      anotherBackground.position.set(app.screen.width * 2.75, 0);

      app.stage.addChild(background);
      app.stage.addChild(anotherBackground);


      const frogGhostTextures = PIXI.Loader.shared.resources['frog_ghost'].texture;
      const frogGhostPlayer = new PIXI.Sprite(frogGhostTextures);

      frogGhostPlayer.anchor.set(0, 0);
      frogGhostPlayer.scale.set(0.28);

      const foreground = new PIXI.Sprite(PIXI.Loader.shared.resources['foreground'].texture);
      foreground.width = PIXI.Loader.shared.resources['foreground'].texture.width;
      foreground.height = PIXI.Loader.shared.resources['foreground'].texture.height;
      foreground.anchor.set(0, 1);
      foreground.x = 0;
      //foreground.tint = getRandomColor3();

      foreground.y = Math.max(app.screen.height);
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
      let frogWalkTextures = createAnimationTextures('frog_walk', 10, 351);
      let frogAttackTextures = createAnimationTextures('frog_attack', 12, 351);
      const frogWalkTextures1 = createAnimationTextures('frog_walk', 10, 351);
      const frogAttackTextures1 = createAnimationTextures('frog_attack', 12, 351);
      const critterAttackTextures = createAnimationTextures('critter_attack', 13, 266);
      const critterWalkTextures = createAnimationTextures('critter_walk', 12, 266);
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
      //background.tint = getRandomColor1();

      const backgroundImage = PIXI.Sprite.from('background');
      const clouds = createTilingSprite(cloudsTexture, backgroundImage.width * 30, 200);
      const clouds2 = createTilingSprite(clouds2Texture, backgroundImage.width * 30, 200);
      clouds2.position.y += 100;
      clouds2.alpha = .3;
      const enemyDeathTextures = createAnimationTextures('enemy_death', 8, 317);
      const enemyDeath = createAnimatedSprite(enemyDeathTextures);
      const playerSpawn = createAnimatedSprite(enemyDeathTextures);

      let characterTextures;

      characterTextures = frogWalkTextures;
      const critter = createAnimatedSprite(characterTextures);
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
         setisPaused(false);
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

                    const projectileSpeed = 3;

                    function updateProjectile() {
                      birdProjectile.x += projectileSpeed;

                      if (birdProjectile.x > castle.position.x) {
                        //app.ticker.remove(updateProjectile);
                      }

                      if (!app.stage.children.includes(birdProjectile)) {
                        //app.ticker.remove(updateProjectile);
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


      // Damage function
      function castleTakeDamage(damage) {
        castleHealth -= damage;
        if (castleHealth <= 0) {
          castleExplode();

        }

        updateHPBar(castleHealth, castleMaxHealth);
      }

      function castleExplode() {

     

        currentRound++;
        roundOver = true;
        setEnemiesInRange(0); 
        isCombat = false; 
        console.log("enemies has been updated to",  getEnemiesInRange())
        resett=false; 
      isAttacking=false;
    isCombat=false;
    exploded = true;
  
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
        //console.log("HERXOROR:", getEnemiesInRange());

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
         
          // Calculate the amount to move the camera per frame
          const cameraSpeed = 3;

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

            if(currentSnailHealth + currentBeeHealth + currentBirdHealth + currentFrogHealth <= 0){
              console.log("BANG");
                            setisWiped(true);
                }
              
            if(exploded)
            {
              mountain1.tint = getRandomColor();
              mountain2.tint = getRandomColor();
              mountain3.tint = getRandomColor3();
              mountain4.tint = getRandomColor3();
              foreground.tint = getRandomColor();
              for (let i = 0; i < getEnemies().length; i++) {
                let enemy = getEnemies()[i];
                // console.log(i);
                app.stage.removeChild(enemy);
                app.stage.removeChild(enemy.hpBar);
                app.stage.removeChild(enemy.hpBarBackground);
                // Destroy the enemy object to free up memory
      
              }
              exploded=false;
        
            }
          
            playRoundText(currentRound);
     
     
          
          castle.tint = originalTint;
            setCharAttackAnimating(false);
            setIsCharAttacking(false);
            app.stage.removeChild(frogGhostPlayer);
            critter.position.set(app.screen.width / 20, stored);
            if(fullReset){
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
            const enemyPortrait = document.getElementById('enemy-portrait');
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
             

            app.stage.addChild(critter);
if(fullReset){
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
      
          setCharSwap(false);
          return;
        }

        if (getSpeedChanged()) { updateVelocity(); setSpeedChanged(false); }
        if (!isAttackingChar) {
        //  console.log("attacking char",isAttackingChar);
          if (!getisDead()) {
          //  console.log("not getisdead");
          console.log("getenemiesinrange", getEnemiesInRange());
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
      playRoundText(1);

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
      updatePlayerHealthBar(getFrogHealth());

      app.stage.addChild(background, mountain4, mountain1, mountain2, mountain3, foreground, castle, critter, clouds, clouds2, hpBarBackground, hpBar, enemyDeath,castlePlayer);

      spawnEnemy(critter, critterAttackTextures, enemyDeath, foreground, frogGhostTextures, critterWalkTextures, frogGhostPlayer, frogWalkTextures);
      setInterval(() => {
        if (!getisDead() && !getisPaused()) {


          spawnEnemy(critter, critterAttackTextures, enemyDeath, foreground, frogGhostTextures, critterWalkTextures, frogGhostPlayer, frogWalkTextures);
        }
      }, 21000);

      setInterval(() => {
        if (!getisDead() && !getisPaused()) {
          spawnEnemy(critter, critterAttackTextures, enemyDeath, foreground, frogGhostTextures, critterWalkTextures, frogGhostPlayer, frogWalkTextures);


        }
      }, 16000);

    }

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


  function spawnEnemy(critter, critterAttackTextures, enemyDeath, foreground, frogGhostTextures, critterWalkTextures, frogGhostPlayer, frogWalkTextures) {
    let enemyAdded = false;
    let inRange = false
    const enemy = new PIXI.AnimatedSprite(critterWalkTextures); // Start with idle textures
    let resett = false;
    const minScale = 0.4;
    const maxScale = 0.6;
    const randomScale = minScale + Math.random() * (maxScale - minScale);
    const randomSpeedFactor = 0.75 + Math.random() * 0.5; // Random speed factor between 0.75 and 1.25
    enemy.scale.set(randomScale);
    enemy.anchor.set(0.5, .5);
    enemy.position.set(foreground.width, app.screen.height - 80 - randomScale * 120 + (Math.random() * 60 - 30));
    enemy.zIndex = enemy.position.y + 10000;
    enemy.animationSpeed = 0.25;
    enemy.loop = true;
    enemy.isAlive = true;
    enemy.isVisible;
    enemy.currentHP = 100;
    enemy.play();
    enemy.scale.x *= -1; // Flip the enemy horizontally
    enemy.vx = -2 * randomSpeedFactor; // Set the enemy's horizontal velocity with random speed factor
    let isAttacking = false; // Flag to track if enemy is attacking
    let inRangeRef = { value: inRange };

    // Add enemy to the enemies array
    addEnemies(enemy);
    if (enemy.isAlive) {
      app.stage.addChild(enemy);
    }
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
    enemy.play();
    app.ticker.add(() => {

      if (getisPaused()) {
        // Game is paused, skip logic
        return;
      }

      if (app.stage.children.includes(enemy)) {


        if (getisDead() ){
    
      resett = true; 
          
         }


        checkProjectileCollisions(critter, enemy, enemyDeath);


        if (enemy.isAlive && (enemy.position.x - critter.position.x > 150) || getisDead()) {
       if(enemy.position.x > 250)
       {
          enemy.position.x += enemy.vx;
       }
        } else {
          

          if(resett == true){ 
            inRange = false;
            if(!getisDead()){
              if(app.stage.children.includes(critter)){
          //  setEnemiesInRange(0); 
            isCombat = false; 
                        //setEnemiesInRange(getEnemiesInRange() + 1);

            console.log("enemies haxxxxted to",  getEnemiesInRange())
            resett=false; 
          isAttacking=false;
        isCombat=false;
      enemyAdded=false;}
    
              }
        }
       
          if ((critter.textures !== frogWalkTextures)) {
            if (critter.currentFrame === critter.totalFrames - 2) {
              if (!getIsCharAttacking()) {
                setIsCharAttacking(true);
                if (getCurrentCharacter() != "character-bird") {
                  critterAttack(critter, enemy, enemyDeath, critterAttackTextures);
                }
              }
            } else if (critter.currentFrame === critter.totalFrames - 1) {
              setIsCharAttacking(false);
            }
          }
         
          if (!enemyAdded) {
            enemyAdded = true;
            setEnemiesInRange(getEnemiesInRange() + 1);
return;
          }
       
          
         
          if (!getisDead() && !isAttacking && enemy.isAlive && enemy.visible) {
            if (!isCombat) {
              const enemyPortrait = document.getElementById('enemy-portrait');
              updateEnemyGrayscale(100);
              enemyPortrait.style.display = 'block'; // Make the element visible
              //drawEnemyHPBar(enemy);
            }
            isAttacking = true;
            isCombat = true;
          
            handleEnemyAttacking(enemy, critterAttackTextures, critter, enemyDeath, frogGhostTextures, critterWalkTextures, frogGhostPlayer, frogWalkTextures);

            
            
          }
     
        }
      
        isCombat=false;
      } else {
        app.stage.removeChild(enemy);

        // Remove the enemy object from the enemies array
        const index = getEnemies().indexOf(enemy);
        if (index !== -1) {
          getEnemies().splice(index, 1);
        }
        app.ticker.remove(() => { });
        return;
      }
    });



  }


  function spawnPuffer(critter, pufferAttackTextures, enemyDeath, foreground, frogGhostTextures, pufferWalkTextures, frogGhostPlayer, frogWalkTextures) {
    let enemyAdded = false;
    let inRange = false
    const enemy = new PIXI.AnimatedSprite(pufferWalkTextures); // Start with idle textures
    let resett = false;
    const minScale = 0.4;
    const maxScale = 0.6;
    const randomScale = minScale + Math.random() * (maxScale - minScale);
    const randomSpeedFactor = 0.75 + Math.random() * 0.5; // Random speed factor between 0.75 and 1.25
    enemy.scale.set(randomScale);
    enemy.anchor.set(0.5, .5);
    enemy.position.set(foreground.width, app.screen.height - 80 - randomScale * 120 + (Math.random() * 60 - 30));
    enemy.zIndex = enemy.position.y + 10000;
    enemy.animationSpeed = 0.25;
    enemy.loop = true;
    enemy.isAlive = true;
    enemy.isVisible;
    enemy.currentHP = 100;
    enemy.play();
    enemy.scale.x *= -1; // Flip the enemy horizontally
    enemy.vx = -2 * randomSpeedFactor; // Set the enemy's horizontal velocity with random speed factor
    let isAttacking = false; // Flag to track if enemy is attacking
    // Add enemy to the enemies array
    addEnemies(enemy);
    if (enemy.isAlive) {
      app.stage.addChild(enemy);
    }
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
    enemy.play();
    app.ticker.add(() => {
      if (getisPaused()) {
        // Game is paused, skip logic
        return;
      }

      if (app.stage.children.includes(enemy)) {


        if (getisDead() ){
    
      resett = true; 
          
         }


        checkProjectileCollisions(critter, enemy, enemyDeath);


        if (enemy.isAlive && (enemy.position.x - critter.position.x > 150) || getisDead()) {

          enemy.position.x += enemy.vx;
          
          if (enemy.hpBar) {
            //  enemy.hpBar.position.x += enemy.vx;
            // enemy.hpBarBackground.x += enemy.vx
          }
        } else {
          if(enemy.position.x < 380)
          {
  return;
          }
          if(resett == true){ 
            inRange = false;
            if(!getisDead()){
              if(app.stage.children.includes(critter)){
          //  setEnemiesInRange(0); 
            isCombat = false; 
            console.log("enemies has been updated to",  getEnemiesInRange())
            resett=false; 
          isAttacking=false;
        isCombat=false;}
              }
        }
       
          if ((critter.textures !== frogWalkTextures)) {
            if (critter.currentFrame === critter.totalFrames - 2) {
              if (!getIsCharAttacking()) {
                setIsCharAttacking(true);
                if (getCurrentCharacter() != "character-bird") {
                  critterAttack(critter, enemy, enemyDeath, pufferAttackTextures);
                }
              }
            } else if (critter.currentFrame === critter.totalFrames - 1) {
              setIsCharAttacking(false);
            }
          }
         
          if (!enemyAdded) {
            enemyAdded = true;
          }
          if(!inRange)
          {

            setEnemiesInRange(getEnemiesInRange() + 1);
            console.log("SETTING");
inRange = true;
          }
         
          if (!getisDead() && !isAttacking && enemy.isAlive && enemy.visible) {
            if (!isCombat) {
              const enemyPortrait = document.getElementById('enemy-portrait');
              updateEnemyGrayscale(100);
              enemyPortrait.style.display = 'block'; // Make the element visible
              //drawEnemyHPBar(enemy);
            }
            isAttacking = true;
            isCombat = true;
         
            handleEnemyAttacking(enemy, pufferAttackTextures, critter, enemyDeath, frogGhostTextures, pufferWalkTextures, frogGhostPlayer, frogWalkTextures);
         
          }
        }
      } else {
        app.stage.removeChild(enemy);

        // Remove the enemy object from the enemies array
        const index = getEnemies().indexOf(enemy);
        if (index !== -1) {
          getEnemies().splice(index, 1);
        }
        app.ticker.remove(() => { });
        return;
      }
    });




  }


  function checkProjectileCollisions(critter, enemy, enemyDeath) {
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
          rangedAttack(critter, enemy, enemyDeath);
          app.stage.removeChild(projectile);

          enemyHit = true; // Mark that an enemy has been hit

          // You can add a break here if you want to hit only one enemy even if there are multiple overlapping enemies.
        }
      }
    }
  }






  function rangedAttack(critter, enemy, enemyDeath) {
    // Reduce enemy's HP
    console.log('ENEMY HP', enemy.currentHP);
    console.log("dmgD", getCharacterDamage(getCurrentCharacter()));
    if (enemy.currentHP - getCharacterDamage(getCurrentCharacter()) <= 0) {
      // Callback function to remove enemy after death animation
      if (app.stage.children.includes(enemy)) {
        drawHitSplat(enemy);
        enemy.tint = 0xFF0000; // Set the hit color

        setEnemiesInRange(getEnemiesInRange() - 1);
        //isCombat = false;
        if (getEnemiesInRange() === 0) {
          const enemyPortrait = document.getElementById('enemy-portrait');
          enemyPortrait.style.display = 'none'; // Make the element visible
        }

        //setIsCharAttacking(false);
        console.log("ENEMY DEAD", enemy.position.x, enemy.position.y);
        createCoffeeDrop(enemy.position.x + 20, enemy.position.y);
        app.stage.removeChild(enemy);
        getEnemies().splice(getEnemies().indexOf(enemy), 1);

        isCombat = false;
        setIsCharAttacking(false);
        playDeathAnimation(enemy, enemyDeath, critter);

        critter.play();


      }
    } else {
      if (enemy.isAlive === true) {
        if (getisDead() === false) {
          drawHitSplat(enemy);

        }
      }


    }


  }

  function playGhostFly(critter, enemy, frogGhostPlayer, frogWalkTextures) {
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
          setIsDead(false);
          app.stage.removeChild(frogGhostPlayer);
          roundOver = true;
    
          // Continue with the game logic here
          // ...
    
        } else {
          // Character not selected, wait for player to pick a character box
          // Show any necessary UI or display a message to prompt the player
          // Once the player selects a character, call startGame() again to resume the game
        }
      }
    }, 16); // (16ms = 60fps)
  }

  function handleEnemyAttacking(enemy, critterAttackTextures, critter, enemyDeath, frogGhostTextures, critterWalkTextures, frogGhostPlayer, frogWalkTextures) {
    enemy.textures = critterAttackTextures;
   
    enemy.loop = true;
    enemy.gotoAndPlay(0);
    let hasDied = false;
    if ( roundOver){return;}

    
    function onFrameChange(currentFrame) {
      
      if ( roundOver) {  
        enemy.isAttacking=false; 
        setEnemiesInRange(0);
    
        enemy.removeInRange=false;
        console.log("notstuck");
        return;
         }

         if(enemiesInRange <= 0){
          return;}
      if (currentFrame === enemy.totalFrames - 5) {
        
        if (enemy.isAlive) {
          if (!getisDead()) {
            if (!hasDied) {
              
              critter.tint = flashColor;
              setPlayerCurrentHealth(getPlayerCurrentHealth() - 5);
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
                playGhostFly(critter, enemy, frogGhostPlayer, frogWalkTextures);
                enemy.textures = critterWalkTextures;
                enemy.play();
                
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
            
            
            
            
            if (enemy.textures != critterWalkTextures) { enemy.textures = critterWalkTextures; enemy.play(); } 
          isAttacking=false;
          isCombat=false;
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


  function resetGame(critter, enemy, frogGhostPlayer, enemies, frogWalkTextures) {
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

  function drawHitSplat(enemy) {

    // Flash hit color for a brief second
    const originalTint = enemy.tint;
    enemy.tint = 0xFF0000; // Set the hit color
    setTimeout(() => {
      enemy.tint = originalTint; // Reset to original color
    }, 100);
    let damage = null;


    switch (getCurrentCharacter()) {
      case 'character-snail':
        console.log('Snail damage: ', getSnailDamage());
        enemy.currentHP -= getSnailDamage();
        damage = -getSnailDamage(); // Assuming getFrogDamage() returns a positive value
        break;
      case 'character-bird':
        enemy.currentHP -= getBirdDamage();
        damage = -getBirdDamage(); // Assuming getFrogDamage() returns a positive value
        break;
      case 'character-frog':
        enemy.currentHP -= getFrogDamage();
        damage = -getFrogDamage(); // Assuming getFrogDamage() returns a positive value
        break;
      case 'character-bee':
        enemy.currentHP -= getBeeDamage();
        damage = -getBeeDamage(); // Assuming getFrogDamage() returns a positive value
        break;
      default:
        console.log('Invalid character type');
    }
    drawEnemyHPBar(enemy);
    updateEnemyGrayscale(enemy.currentHP);


    const damageText = new PIXI.Text(`${damage}`, {
      fontFamily: 'Marker Felt Cursive',
      fontSize: 24,
      fill: 'red',
      dropShadow: true,
      dropShadowColor: 'black',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 4,
      dropShadowDistance: 2,
    });

    damageText.anchor.set(0.5);
    damageText.position.set(enemy.position.x + 40, enemy.position.y - enemy.height / 1.3);
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
        damageText.alpha = 1 - progress; // Update the alpha (opacity) based on progress
      }
    };

    app.ticker.add(update); // Start the ticker update for hitsplat animation
  }

  function critterAttack(critter, enemy, enemyDeath, critterAttackTextures) {
    // Reduce enemy's HP
    console.log('ENEMY HP', enemy.currentHP);
    console.log("dmgD", getCharacterDamage(getCurrentCharacter()));
    if (enemy.currentHP - getCharacterDamage(getCurrentCharacter()) <= 0) {
      // Callback function to remove enemy after death animation
      if (app.stage.children.includes(enemy)) {
        drawHitSplat(enemy);
        enemy.tint = 0xFF0000; // Set the hit color

        setEnemiesInRange(getEnemiesInRange() - 1);
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

        playDeathAnimation(enemy, enemyDeath, critter);
      }
    } else {
      if (enemy.isAlive === true) {
        if (getisDead() === false) {
          drawHitSplat(enemy);

        }
      }


    }


  }




  
  function createCoffeeDrop(x, y) {
    // Create a container to hold the coffee beans
    const coffeeContainer = new PIXI.Container();

    // Get the bean texture from the loaded resources
    const beanTexture = PIXI.Texture.from("https://i.imgur.com/Ft63zNi.png");

    // Generate a random number between 1 and 10 for the number of coffee beans
    const numBeans = Math.floor(Math.random() * 15) + 1;

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
    }, duration * 3);
    addCoffee(numBeans);
  }

  function addCoffee(amount) {
    setCoffee(getCoffee() + amount);
    const coffeeAmountElement = document.getElementById('coffee-amount');
    const coffeeAmount = getCoffee();
    coffeeAmountElement.textContent = `x ${coffeeAmount}`;
  }

  function playSpawnAnimation(critter, critterSpawn) {
    critterSpawn.position.set(critter.position.x, critter.position.y);
    app.stage.addChild(critterSpawn);


    critterSpawn.gotoAndPlay(0);

    // Remove the death animation after it completes
    critterSpawn.onComplete = () => {
      app.stage.removeChild(critterSpawn);
    };

  }


  function playDeathAnimation(enemy, enemyDeath, critter) {

    // Add the death animation sprite to the stage
    enemyDeath.position.set(enemy.position.x, enemy.position.y);
    app.stage.addChild(enemyDeath);
    const expDrop = new PIXI.Text("+15 EXP", {
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
      setPlayerEXP(getPlayerEXP() + 100);
      updateEXP(getPlayerEXP(), expToLevel, critter);

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
    const hpBarX = (enemy.anchor.x - 30);
    const hpBarY = -(enemy.height / 3);


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

    const maxHealth = 100; // Replace with actual max health of enemy
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

  function updateEXP(exp, expToLevel1, critter) {
    let leftover = 0;
    if (exp >= expToLevel) {
      leftover = exp - expToLevel;
      setPlayerEXP(leftover);
      expToLevel = expToLevel1;
      expToLevel = expToLevel1 + expToLevel1 * .1;
      levelUp(critter);

    }
    const playerEXPBarFill = document.getElementById('exp-bar-fill');
    playerEXPBarFill.style.width = getPlayerEXP() / expToLevel * 100 + '%';
    updateExpText('exp-text', 'exp', getPlayerEXP(), expToLevel);
  }



  function updateExpText(elementId, labelText, value, expToLevel) {
    const barText = document.getElementById(elementId);
    const roundedEXPValue = Math.round(getPlayerEXP().toFixed());
    const roundedEnder = Math.round(expToLevel);
    barText.innerText = `${labelText}: ${roundedEXPValue}\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\/${roundedEnder}`;
  }

  let isUpgradeBoxesAnimated = false;

  function animateUpgradeBoxes(critter) {
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
        handleUpgrade(upgradeType, critter);
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


  function handleUpgrade(upgradeType, critter) {
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
        stats.speed += 0.5; // Update the speed stat for the current character
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
        stats.attack++;
        stats.attack += 5; // Update the attack stat for the current character
        setCharacterDamage(currentCharacter, stats.attack);
        setSnailDamage(getSnailDamage() + 5);
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
        setCharacterHealth(currentCharacter, stats.health);
        setPlayerCurrentHealth(getPlayerCurrentHealth() + 20);
        updatePlayerHealthBar(getPlayerCurrentHealth() / getPlayerHealth * 100);

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

  function levelUp(critter) {
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
        console.log('Invalid character', critter);
        return;
    }

    setSelectLevel(getSelectLevel() + 1);
    animateUpgradeBoxes(critter);
    levelSound.volume = .2;
    levelSound.play();
  }

  function handleVisibilityChange() {
    if (document.hidden || document.webkitHidden) {
      // Document is hidden, perform actions here (e.g., pause the game)
      setisPaused(true);
    } else {
      // Document is visible again, perform actions here (e.g., resume the game)
      setisPaused(false);
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

  playButton.on('mouseover', () => {
    playButton.scale.set(hoverScale);
    playButton.alpha = hoverAlpha;
  });

  playButton.on('mouseout', () => {
    playButton.scale.set(1);
    playButton.alpha = 1;
  });
  playButton.on('pointertap', handlePlayClick);

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
});

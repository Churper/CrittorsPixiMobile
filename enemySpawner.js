  function spawnEnemy(critter, critterAttackTextures, enemyDeath, foreground, frogGhostTextures, critterWalkTextures, frogGhostPlayer, frogWalkTextures) {
    let enemyAdded = false;
    const enemy = new PIXI.AnimatedSprite(critterWalkTextures); // Start with idle textures


    const minScale = 0.4;
    const maxScale = 0.6;
    const randomScale = minScale + Math.random() * (maxScale - minScale);
    const randomSpeedFactor = 0.75 + Math.random() * 0.5; // Random speed factor between 0.75 and 1.25
    // console.log("randomScale:", randomScale);
    enemy.scale.set(randomScale);
    enemy.anchor.set(0.5, .5);
    enemy.position.set(foreground.width, app.screen.height - 80 - randomScale * 120 + (Math.random() * 60 - 30));

    enemy.zIndex = enemy.position.y + 10000;
    // console.log("ZINEX:", -enemy.position.y);
    //console.log("enemy.zIndex:", enemy.zIndex);

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
      if (getisPaused() || roundOver) {
        // Game is paused, skip logic
        return;
      }


      if (app.stage.children.includes(enemy)) {

        checkProjectileCollisions(critter, enemy, enemyDeath);

        if (enemy.isAlive && (enemy.position.x - critter.position.x > 150) || getisDead()) {

          enemy.position.x += enemy.vx;
          if (enemy.hpBar) {
            //  enemy.hpBar.position.x += enemy.vx;
            // enemy.hpBarBackground.x += enemy.vx
          }
        } else {
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
            setEnemiesInRange(getEnemiesInRange() + 1);
            enemyAdded = true;
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
            if (enemy.isAlive && !getisDead()) {
              //console.log("here");
              //
            }
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


  function spawnPuffer(critter, pufferAttackTextures, enemyDeath, foreground, frogGhostTextures, pufferWalkTextures, frogGhostPlayer, frogWalkTextures) {
    let enemyAdded = false;
    const enemy = new PIXI.AnimatedSprite(pufferWalkTextures); // Start with idle textures


    const minScale = 0.42;
    const maxScale = 0.55;
    const randomScale = minScale + Math.random() * (maxScale - minScale) - .2;
    const randomSpeedFactor = 0.75 + Math.random() * 0.5; // Random speed factor between 0.75 and 1.25
    // console.log("randomScale:", randomScale);
    enemy.scale.set(randomScale);
    enemy.anchor.set(0.5, .5);
    enemy.position.set(foreground.width, app.screen.height - 122 - randomScale * 120 + (Math.random() * 60 - 30));

    enemy.zIndex = enemy.position.y + 10000;
    // console.log("ZINEX:", -enemy.position.y);
    //console.log("enemy.zIndex:", enemy.zIndex);

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
      if (getisPaused() || roundOver) {
        // Game is paused, skip logic
        return;
      }


      if (app.stage.children.includes(enemy)) {

        checkProjectileCollisions(critter, enemy, enemyDeath);

        if (enemy.isAlive && (enemy.position.x - critter.position.x > 150) || getisDead()) {

          enemy.position.x += enemy.vx;
        } else {
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
            setEnemiesInRange(getEnemiesInRange() + 1);
            enemyAdded = true;
          }
          if (!getisDead() && !isAttacking && enemy.isAlive && enemy.visible) {
            if (!isCombat) {
              const enemyPortrait = document.getElementById('enemy-portrait');
              updateEnemyGrayscale(100);
              enemyPortrait.style.display = 'block'; // Make the element visible
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

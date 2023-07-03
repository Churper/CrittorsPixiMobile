PIXI.Assets.add('bird_egg', 'https://i.imgur.com/q5JvpXv.png');
PIXI.Assets.add('bird_ghost', 'https://i.imgur.com/FKED8kx.png');
PIXI.Assets.add('bird_portrait', 'https://i.imgur.com/WAwZpGS.png');
PIXI.Assets.add('bird_walk', 'https://i.imgur.com/ABVoGmQ.png');
PIXI.Assets.add('bird_attack', 'https://i.imgur.com/vRD1CeL.png');
PIXI.Assets.add('frog_snail', 'https://i.imgur.com/ekpSpFg.png');
PIXI.Assets.add('frog_bee', 'https://i.imgur.com/bUw6K0K.png');
PIXI.Assets.add('frog_puffer', 'https://i.imgur.com/fBWKqfA.png');
PIXI.Assets.add('bee_walk', 'https://i.imgur.com/Jxke4OH.png');
PIXI.Assets.add('bee_attack', 'https://i.imgur.com/toZiN31.png');
PIXI.Assets.add('puffer_walk', 'https://i.imgur.com/MfcmtYs.png');
PIXI.Assets.add('puffer_attack', 'https://i.imgur.com/DsVddKP.png');
PIXI.Assets.add('puffer_portrait', 'https://i.imgur.com/9gLYMax.png');
PIXI.Assets.add('snail_portrait', 'https://i.imgur.com/Chu3ZkP.png');
PIXI.Assets.add('frog_portrait', 'https://i.imgur.com/XaXTV73.png');
PIXI.Assets.add('bee_portrait', 'https://i.imgur.com/rmcGGP9.png');
PIXI.Assets.add('bean', 'https://i.imgur.com/Ft63zNi.png');
PIXI.Assets.add('background', 'https://i.imgur.com/HNTGehL.png');
PIXI.Assets.add('frog_ghost', 'https://i.imgur.com/45E9OPW.png');
PIXI.Assets.add('foreground', 'https://i.imgur.com/yIjGEpm.png');
PIXI.Assets.add('critter', 'https://i.imgur.com/Fl29VZM.png');
PIXI.Assets.add('critter_walk', 'https://i.imgur.com/CLqwc9P.png');
PIXI.Assets.add('critter_attack', 'https://i.imgur.com/knXBNGy.png');
PIXI.Assets.add('snail_idle', 'https://i.imgur.com/ctlOf0I.png');
PIXI.Assets.add('snail_walk', 'https://i.imgur.com/TQzhxAI.png');
PIXI.Assets.add('snail_attack', 'https://i.imgur.com/2cGPPic.png');
PIXI.Assets.add('frog', 'https://i.imgur.com/juol8Q6.png');
PIXI.Assets.add('frog_walk', 'https://i.imgur.com/sQDZVrY.png');
PIXI.Assets.add('frog_attack', 'https://i.imgur.com/2Nr5t05.png');
PIXI.Assets.add('enemy_death', 'https://i.imgur.com/UD2YJ4w.png');
PIXI.Assets.add('mountain1', 'https://i.imgur.com/FP1W0k6.png');
PIXI.Assets.add('mountain2', 'https://i.imgur.com/Y6IKYjW.png');
PIXI.Assets.add('mountain3', 'https://i.imgur.com/Y6IKYjW.png');
PIXI.Assets.add('mountain4', 'https://i.imgur.com/FP1W0k6.png');
PIXI.Assets.add('castle', 'https://i.imgur.com/a8MEgLK.png');
PIXI.Assets.add('clouds', 'https://i.imgur.com/ggEcYj9.png');
PIXI.Assets.add('clouds2', 'https://i.imgur.com/GDrlJ72.png');
PIXI.Assets.add('clouds3', 'https://i.imgur.com/QrTMhij.png');

const texturesPromise = PIXI.Assets.load(['bird_egg', 'bird_ghost', 'bird_portrait', 'bird_walk', 'bird_attack', 'frog_snail', 'frog_bee', 'frog_puffer', 'bee_walk', 'bee_attack', 'puffer_walk', 'puffer_attack', 'puffer_portrait', 'snail_portrait', 'frog_portrait', 'bee_portrait', 'bean', 'background', 'frog_ghost', 'foreground', 'critter', 'critter_walk', 'critter_attack', 'snail_idle', 'snail_walk', 'snail_attack', 'frog', 'frog_walk', 'frog_attack', 'enemy_death', 'mountain1', 'mountain2', 'mountain3', 'mountain4', 'castle', 'clouds', 'clouds2', 'clouds3']);

texturesPromise.then((textures) => {

  setup(textures);
  // create a new Sprite from the resolved loaded Textures
  // Add your code here to create and position the sprites
}).catch((error) => {
  console.error('Error loading textures:', error);
});

    function setup(textures) {

      const background = new PIXI.Sprite(textures.background);
      background.width = app.screen.width * 2.75;
      background.height = app.screen.height;
      background.anchor.set(0.5, 0);
      background.position.set(0, 0);

      const anotherBackground = new PIXI.Sprite(textures.background);
      anotherBackground.width = app.screen.width * 2.75;
      anotherBackground.height = app.screen.height;
      anotherBackground.anchor.set(0.5, 0);
      anotherBackground.position.set(app.screen.width * 2.75, 0);

      app.stage.addChild(background);
      app.stage.addChild(anotherBackground);




      let frogIdleTexture = textures['frog'].texture;
      let frogIdleTextures = [frogIdleTexture];
      const frogIdleTexture1 = textures['frog'].texture;
      const frogIdleTextures1 = [frogIdleTexture];
      let frogWalkTextures = createAnimationTextures('frog_walk'), 10, 351);


      function createAnimationTextures(resourceName, frameCount, frameHeight) {
  const textures = [];
  const textureWidth = resourceName.width / frameCount;

  for (let i = 0; i < frameCount; i++) {
    const rect = new PIXI.Rectangle(i * textureWidth, 0, textureWidth, frameHeight);
    const texture = PIXI.from(resourceName, rect);
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
          const texture = PIXI.Texture.from(resourceName, rect);
          textures.push(texture);
        }

        return textures;
      }

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Application, Assets, Sprite} from 'pixi.js';

@Component({
  selector: 'app-pixi-sky',
  imports: [],
  templateUrl: './pixi-sky.component.html',
  standalone: true,
  styleUrl: './pixi-sky.component.css'
})
export class PixiSkyComponent implements OnInit, OnDestroy {
  @ViewChild('pixiContainer', {static: true}) pixiContainer!: ElementRef; // Référence à l'élément HTML où PixiJS va dessiner
  private app!: Application; // Instance de l'application PixiJS
  private star!: Sprite; // Une seule étoile

  async ngOnInit(): Promise<void> {
    await this.initPixiApp(); // Initialisation de PixiJS
    await this.createStars(); // Chargement et affichage des étoiles
  }

  private async initPixiApp(): Promise<void> {
    // Create a new application
    this.app = new Application();

    // Initialize the application
    await this.app.init({resizeTo: window});

    // Append the application canvas to the document body
    document.body.appendChild(this.app.canvas);
  }

  private async createStars(): Promise<void> {
    // Load the star texture
    const starTexture = await Assets.load('https://pixijs.com/assets/star.png');

    const starAmount = 100;
    let cameraZ = 0;
    const fov = 20;
    const baseSpeed = 0.025;
    let speed = 0;
    let warpSpeed = 0;
    const starStretch = 5;
    const starBaseSize = 0.05;

    // Create the stars
    const stars: any[] = [];

    for (let i = 0; i < starAmount; i++)
    {
      const star = {
        sprite: new Sprite(starTexture),
        z: 0,
        x: 0,
        y: 0,
      };

      star.sprite.anchor.x = 0.5;
      star.sprite.anchor.y = 0.7;
      randomizeStar(star, true);
      this.app.stage.addChild(star.sprite);
      stars.push(star);
    }

    function randomizeStar(star: { sprite?: Sprite; z: any; x: any; y: any; }, initial: boolean | undefined)
    {
      star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;

      // Calculate star positions with radial random coordinate so no star hits the camera.
      const deg = Math.random() * Math.PI * 2;
      const distance = Math.random() * 50 + 1;

      star.x = Math.cos(deg) * distance;
      star.y = Math.sin(deg) * distance;
    }

    // Change flight speed every 5 seconds
    // setInterval(() =>
    // {
    //   warpSpeed = warpSpeed > 0 ? 0 : 1;
    // }, 5000);

    // Listen for animate update
    this.app.ticker.add((time) =>
    {
      // Simple easing. This should be changed to proper easing function when used for real.
      speed += (warpSpeed - speed) / 20;
      cameraZ += time.deltaTime * 10 * (speed + baseSpeed);
      for (let i = 0; i < starAmount; i++)
      {
        const star = stars[i];

        if (star.z < cameraZ) randomizeStar(star, undefined);

        // Map star 3d position to 2d with really simple projection
        const z = star.z - cameraZ;

        star.sprite.x = star.x * (fov / z) * this.app.renderer.screen.width + this.app.renderer.screen.width / 2;
        star.sprite.y = star.y * (fov / z) * this.app.renderer.screen.width + this.app.renderer.screen.height / 2;

        // Calculate star scale & rotation.
        const dxCenter = star.sprite.x - this.app.renderer.screen.width / 2;
        const dyCenter = star.sprite.y - this.app.renderer.screen.height / 2;
        const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
        const distanceScale = Math.max(0, (2000 - z) / 2000);

        star.sprite.scale.x = distanceScale * starBaseSize;
        // Star is looking towards center so that y axis is towards center.
        // Scale the star depending on how fast we are moving, what the stretchfactor is
        // and depending on how far away it is from the center.
        star.sprite.scale.y
          = distanceScale * starBaseSize
          + (distanceScale * speed * starStretch * distanceCenter) / this.app.renderer.screen.width;
        star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
      }
    });
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this.app.destroy(true, {children: true, texture: true, baseTexture: true}); // Nettoyage
  }
}


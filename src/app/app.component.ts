import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PixiSkyComponent} from './pixi-sky/pixi-sky.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PixiSkyComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cosmos-app';
}

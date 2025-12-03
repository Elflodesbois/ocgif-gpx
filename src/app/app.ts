import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GpxMap } from "./gpx-map/gpx-map";
import { GpxDisplay } from "./gpx-display/gpx-display";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GpxDisplay],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ocgif-gpx');
}

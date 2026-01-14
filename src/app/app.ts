import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GpxDisplay } from "./components/gpx-display/gpx-display";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GpxDisplay],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ocgif-gpx');
}

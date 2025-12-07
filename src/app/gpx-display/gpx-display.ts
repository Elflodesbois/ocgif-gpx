import { Component } from '@angular/core';
import { GpxMap } from "../gpx-map/gpx-map";
import { ToggleStateButton } from "../toggle-state-button/toggle-state-button";

@Component({
  selector: 'app-gpx-display',
  imports: [GpxMap],
  templateUrl: './gpx-display.html',
  styleUrl: './gpx-display.scss'
})
export class GpxDisplay {

}

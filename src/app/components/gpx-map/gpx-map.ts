import { Component, OnInit, signal, inject } from '@angular/core';
import { ToggleStateButton } from "../toggle-state-button/toggle-state-button";
import { MapLegend } from '../map-legend/map-legend';
import { MapService } from '../../services/map-service';

@Component({
  selector: 'app-gpx-map',
  imports: [ToggleStateButton, MapLegend],
  templateUrl: './gpx-map.html',
  styleUrl: './gpx-map.scss'
})
export class GpxMap implements OnInit {
    mapWrapper = inject(MapService);
    isFullscreen = signal(0);

    ngOnInit(): void {
        this.mapWrapper.initMap();

        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen.set(document.fullscreenElement ? 1 : 0);
        });
    }

    enterFullscreen() {        
        this.mapWrapper.map.getTargetElement().requestFullscreen();
    }

    exitFullscreen() {
        document.exitFullscreen();
    }
}

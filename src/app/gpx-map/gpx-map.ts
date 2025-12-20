import { Component, OnInit, signal, inject } from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GPX from 'ol/format/GPX.js';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle.js';
import { ToggleStateButton } from "../toggle-state-button/toggle-state-button";
import { MapLegend } from '../map-legend/map-legend';
import { MapService } from '../map-service';

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

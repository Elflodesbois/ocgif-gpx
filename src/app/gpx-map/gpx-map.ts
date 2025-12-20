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
    style!: { [key: string]: Style | Style[] };
    isFullscreen = signal(0);

    ngOnInit(): void {
        const geometryStyles: { [key: string]: Style|Style[] } = {

            'Point': new Style({
                image: new CircleStyle({
                    fill: new Fill({
                        color: 'rgba(255,255,0,0.4)',
                    }),
                    radius: 5,
                    stroke: new Stroke({
                        color: '#ff0',
                        width: 1,
                    }),
                }),
            }),
            'LineString': new Style({
                stroke: new Stroke({
                    color: '#0ff',
                    width: 3,
                }),
            }),
            'MultiLineString': [
                new Style({
                    stroke: new Stroke({
                        color: '#000',
                        width: 5,   
                    }),
                }),
                new Style({
                    stroke: new Stroke({
                        color: '#f00',
                        width: 3,
                    }),
                }),
            ]
        };

        const vector1 = new VectorLayer({
            source: new VectorSource({
                url: 'grand_tour.gpx',
                format: new GPX(),
            }),
            style: function (feature) {
                const type = feature.getGeometry()?.getType();
                return type && geometryStyles[type] ? geometryStyles[type] : undefined;
            }
        });

        const vector2 = new VectorLayer({
            source: new VectorSource({
                url: 'all_ee_omega.gpx',
                format: new GPX(),
            }),
            style: function (feature) {
                const type = feature.getGeometry()?.getType();
                console.log(type);
                return type && geometryStyles[type] ? geometryStyles[type] : undefined;
            },
        });

        const vector3 = new VectorLayer({
            source: new VectorSource({
                url: 'ville_long.gpx',
                format: new GPX(),
            }),
            style: function (feature) {
                const type = feature.getGeometry()?.getType();
                console.log(type);
                return type && geometryStyles[type] ? geometryStyles[type] : undefined;
            },
        });


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

import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GPX from 'ol/format/GPX.js';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle.js';
import { defaults as interactionDefaults } from 'ol/interaction/defaults';
import { defaults as controlDefaults } from 'ol/control/defaults';
import { Control } from 'ol/control';

@Component({
  selector: 'app-gpx-map',
  imports: [],
  templateUrl: './gpx-map.html',
  styleUrl: './gpx-map.scss'
})
export class GpxMap implements OnInit {
    map!: Map;
    style!: { [key: string]: Style | Style[] };

    

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
        
        let fullscreenButtonContainer = document.getElementById("fullscreen-button");
        let fullscreenButton = fullscreenButtonContainer?.children[0];
        fullscreenButton?.addEventListener('click', this.fullscreenCallback);

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

        this.map = new Map({
            interactions: interactionDefaults({
                doubleClickZoom: false
            }),

            view: new View({
                // centrer par défaut sur gif-sur-yvette, avec un zoom approprié
                center: fromLonLat([2.1258440141926775, 48.700949565647925]),
                zoom: 13
            }),

            layers: [
                new TileLayer({source: new OSM()}),
                vector1, vector2, vector3
            ],

            controls: controlDefaults().extend([
                new Control({
                    // || undefined: si fullscreenButton est null, le transforme en undefined
                    element: fullscreenButtonContainer || undefined
                })
            ]),

            target: 'ol-map'
        });
    }

    private fullscreenCallback(event: Event): void {
        let tgt = event.target;
        if (tgt instanceof Element) {
            if (tgt.innerHTML == "⛶") {
                document.getElementById('ol-map')?.requestFullscreen();
                tgt.innerHTML = "E";
            } else {
                document.exitFullscreen();
                tgt.innerHTML = "⛶";
            }
        }
    }
}

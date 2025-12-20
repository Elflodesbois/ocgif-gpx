import { Injectable } from '@angular/core';
import { Feature, Map } from 'ol';
import { FeatureLike } from 'ol/Feature';
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

@Injectable({
    providedIn: 'root'
})
export class MapService {
    public map!: Map;

    private geometryStyles: { [key: string]: Style|Style[] } = {
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

    private geometryToStyle = (feature: FeatureLike): Style | Style[] | undefined => {
        const type = feature.getGeometry()?.getType();
        return type && this.geometryStyles[type] ? this.geometryStyles[type] : undefined;
    }

    initMap(): void {
        let fullscreenButtonContainer = document.getElementById("fullscreen-button");

        let vector1 = new VectorLayer({
                source: new VectorSource({
                    url: 'grand_tour.gpx',
                    format: new GPX(),
                }),
                style: this.geometryToStyle  
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
                vector1
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
}

import { inject, Injectable } from '@angular/core';
import { Map } from 'ol';
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
import { Colours } from './colours';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    private coloursProvider = inject(Colours);
    public map!: Map;
    private layers!: { [key: string]: LayerInfo };

    private geometryStylesProvider(): { [key: string]: Style|Style[] } {
        const customRgb = this.coloursProvider.getSafeRgb();
        
        return {
            'Point': new Style({
                image: new CircleStyle({
                    fill: new Fill({
                        color: 'rgba(255,255,0,0.4)'
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
                        color: customRgb,
                        width: 3,
                    }),
                }),
            ]
        };
    }

    /*private geometryToStyle = (feature: FeatureLike): Style | Style[] | undefined => {
        const type = feature.getGeometry()?.getType();
        const geometryStyles = this.geometryStylesProvider();
        return type && geometryStyles[type] ? geometryStyles[type] : undefined;
    }*/

    //                                      record est équivalent à { [key: string]: ...}
    private geometryToStyle(geometryStyles: Record<string, Style | Style[]>): (feature: FeatureLike) => Style | Style[] | undefined {
    return (feature: FeatureLike) => {
        const type = feature.getGeometry()?.getType();
        return type ? geometryStyles[type] : undefined;
    };
}


    initMap(): void {
        let fullscreenButtonContainer = document.getElementById("fullscreen-button");
        let legendContainer = document.getElementById("legend-container");

        this.layers = {};

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
                new TileLayer({source: new OSM()})
            ],

            controls: controlDefaults().extend([
                new Control({
                    // || undefined: si fullscreenButton est null, le transforme en undefined
                    element: fullscreenButtonContainer || undefined
                }),
                new Control({
                    element: legendContainer || undefined
                })
            ]),

            target: 'ol-map'
        });
    }

    addLayer(name: string, layer: VectorLayer) {
        let info = new LayerInfo(name, layer);
        this.layers[name] = info;
        this.map.addLayer(layer);
    }

    removeLayer(name: string) {
        for (let key in this.layers) {
            if (key === name) {
                this.map.removeLayer(this.layers[name].layer);
                delete this.layers[name];
                console.log(this.layers);
                return;
            }
        }
    }

    getLayers(): Array<string> {
        return Object.keys(this.layers);
    }

    vectorizeGpxFile(filepath: string) : VectorLayer {
        const geometryToStyleFunc = this.geometryToStyle(this.geometryStylesProvider());
        
        return new VectorLayer({
            source: new VectorSource({
                url: filepath,
                format: new GPX()
            }),
            style: geometryToStyleFunc
        });
    }

    vectorizeGpxText(text: string): VectorLayer {
        let format = new GPX();

        let features = format.readFeatures(text, {featureProjection: 'EPSG:3857'});

        const geometryToStyleFunc = this.geometryToStyle(this.geometryStylesProvider());
        
        return new VectorLayer({
            source: new VectorSource({
                features
            }),
            style: geometryToStyleFunc
        });
    }

    checkLayerPresenceByName(name: string): boolean {
        return this.getLayers().includes(name);
    }

    toggleVisibility(name: string) {
        this.layers[name].visible = this.layers[name].visible ? false : true;

        if (this.layers[name].visible) {
            this.map.addLayer(this.layers[name].layer)
        } else {
            this.map.removeLayer(this.layers[name].layer);
        }
    }

    getVisibilityOf(name: string): boolean {
        return this.layers[name].visible;
    }
}

export class LayerInfo {
    public name: string;
    public layer: VectorLayer;
    public visible: boolean = true;

    constructor(name: string, layer: VectorLayer, visible: boolean = true) {
        this.name = name;
        this.layer = layer;
        this.visible = visible;
    }
}

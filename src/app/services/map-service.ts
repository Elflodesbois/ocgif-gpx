import { inject, Injectable } from '@angular/core';
import { Map, Overlay } from 'ol';
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
    private tooltipOverlay!: Overlay;
    private tooltip!: HTMLElement;

    private geometryStylesProvider(): { [key: string]: Style|Style[] } {
        const customRgb = this.coloursProvider.getSafeRgb();

        const transparency = Number.MIN_VALUE;
        
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
                /* celui là est PRESQUE transparent, et sert juste à augmenter
                 * la zone dans laquelle le tooltip se déclenche (ça ne marche pas si
                 * la couleur est transparente)
                 * j'ai mis 25 de largeur, mais si tu veux changer tu peux
                 */
                new Style({
                    stroke: new Stroke({
                        color: 'rgba(0, 0, 0, 0.01)',
                        width: 25
                    })
                })
            ]
        };
    }

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
        this.tooltip = document.getElementById("map-tooltip")!; // ! : assurance du dev que ce ne sera pas null
        this.tooltipOverlay = new Overlay({
            element: this.tooltip,
            offset: [10, 0],
            positioning: 'bottom-left',
            stopEvent: false
        });

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

        this.map.addOverlay(this.tooltipOverlay);
        this.map.on('pointermove', (event) => {
            const { feature, layer } = this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => ({ feature, layer })) || {};


            if (!feature || !layer) {
                this.tooltipOverlay.setPosition(undefined);
                return;
            }

            let name = layer.get('name') || '!!! NOM MANQUANT !!!';
            let tooltipText = document.getElementById('map-tooltip-text')!;
            tooltipText.innerText = name;

            let coord = event.coordinate;
            this.tooltipOverlay.setPosition(coord);
            this.tooltip.style.visibility = 'visible';
        })
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

    getLayersNames(): Array<string> {
        return Object.keys(this.layers);
    }

    getLayers(): { [key: string]: LayerInfo } {
        return this.layers;
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
        return this.getLayersNames().includes(name);
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

    getLayerColor(name: string): string {
        let layer = this.layers[name].layer;

        let ret = layer.get('color');

        return ret;
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

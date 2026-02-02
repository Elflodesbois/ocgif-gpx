import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Colours {
    /**
     * couleurs interdites pour les traces
     * il faut spécifier des valeurs HSL
     * pour le radius, on considère que c'est à la fois à gauche
     * et à droite
     * value: 10 et radius: 3 interdiront les couleurs
     * entre 10-3 = 7 et 10+3 = 13
     */
    private forbiddenRanges = [
        {
            // rouge 1
            value: 0,
            radius: 20
        },
        {
            // rouge 2
            value: 360,
            radius: 20
        },
        {
            // vert
            value: 120,
            radius: 30
        },
        {
            // bleu
            value: 240,
            radius: 0
        },
        {
            // orange clair
            value: 50,
            radius: 10
        }
    ];

    private randomRgbValue(): number {
        return Math.floor(Math.random() * (256));
    }

    public getSafeRgb(): string {
        let r: number = this.randomRgbValue();
        let g: number = this.randomRgbValue();
        let b: number = this.randomRgbValue();

        let h: number, s: number, l: number;

        [h, s, l] = this.convertRgbColourComponentsToHsl(r, g, b);

        if (!this.checkHslComponents(h, s, l)) {
            console.warn("invalid colour generated, generating a new one");
            return this.getSafeRgb();
        }

        return '#' + r.toString(16) + g.toString(16) + b.toString(16)
    }

    private checkHslComponents(h: number, s: number, l: number): boolean {
        // si c'est trop proche du noir
        if (l < 0.1) return false;

        for (const range of this.forbiddenRanges) {
            if (range.value-range.radius < h && h < range.value+range.radius) {
                return false;
            }
        }

        return true;
    }

    private convertRgbColourComponentsToHsl(r: number, g: number, b: number): [number, number, number] {
        // prions pour que nous n'ayons jamais à débugger cette fonction
        // https://fr.wikipedia.org/wiki/Teinte_Saturation_Valeur

        const max: number = Math.max(r, g, b);
        const min: number = Math.min(r, g, b);

        const v: number = max / 255;
        const s: number = max === 0 ? 0 : 1 - min/max;
        const t: number = 
            max === min ?  0                                   :
            max === r   ? (60 * ((g-b)/(max-min)) + 360) % 360 :
            max === g   ?  60 * ((b-r)/(max-min)) + 120        :
          /*max === b*/    60 * ((r-g)/(max-min)) + 240;

        return [t, s, v];
    }
}

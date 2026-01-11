import { Injectable } from '@angular/core';

type Level = 'F' | 'N' | 'D' | 'T';

@Injectable({
  providedIn: 'root'
})

export class Difficulty {
  conv_dist!: { [key: string]: Function };
  conv_denivele!: { [key: string]: Function };
  conv_denmoy!: { [key: string]: Function };

  constructor() {
    this.init();
  }

  private init(): void {

    this.conv_dist = {
      GPB: (d: number) => d <= 19 ? 'F' : d <= 29 ? 'N' : d <= 38 ? 'D' : 'T',
      GP1: (d: number) => d <= 24 ? 'F' : d <= 35 ? 'N' : d <= 43 ? 'D' : 'T',
      GP2: (d: number) => d <= 30 ? 'F' : d <= 40 ? 'N' : d <= 47 ? 'D' : 'T',
      GP3: (d: number) => d <= 35 ? 'F' : d <= 46 ? 'N' : d <= 55 ? 'D' : 'T',
      GP4: (d: number) => d <= 37 ? 'F' : d <= 48 ? 'N' : d <= 59 ? 'D' : 'T',
      GP5: (d: number) => d <= 40 ? 'F' : d <= 55 ? 'N' : d <= 70 ? 'D' : 'T'
    };

    this.conv_denivele = {
      GPB: (d: number) => d <= 190 ? 'F' : d <= 300 ? 'N' : d <= 320 ? 'D' : 'T',
      GP1: (d: number) => d <= 310 ? 'F' : d <= 420 ? 'N' : d <= 560 ? 'D' : 'T',
      GP2: (d: number) => d <= 440 ? 'F' : d <= 550 ? 'N' : d <= 700 ? 'D' : 'T',
      GP3: (d: number) => d <= 580 ? 'F' : d <= 690 ? 'N' : d <= 820 ? 'D' : 'T',
      GP4: (d: number) => d <= 700 ? 'F' : d <= 810 ? 'N' : d <= 1010 ? 'D' : 'T',
      GP5: (d: number) => d <= 850 ? 'F' : d <= 1020 ? 'N' : d <= 1300 ? 'D' : 'T'
    };

    this.conv_denmoy = {
      GPB: (d: number) => d <= 84 ? 'F' : d <= 106 ? 'N' : d <= 120 ? 'D' : 'T',
      GP1: (d: number) => d <= 100 ? 'F' : d <= 122 ? 'N' : d <= 154 ? 'D' : 'T',
      GP2: (d: number) => d <= 120 ? 'F' : d <= 142 ? 'N' : d <= 180 ? 'D' : 'T',
      GP3: (d: number) => d <= 140 ? 'F' : d <= 162 ? 'N' : d <= 208 ? 'D' : 'T',
      GP4: (d: number) => d <= 160 ? 'F' : d <= 180 ? 'N' : d <= 240 ? 'D' : 'T',
      GP5: (d: number) => d <= 178 ? 'F' : d <= 220 ? 'N' : d <= 316 ? 'D' : 'T'
    };
  }

  conv_conds(conds: boolean): string {
    return conds ? 'D' : 'N';
  }

  verdict(grp: string, dist: number, denivele: number, conds: boolean): string {

    // Groupes toujours verts (pas de calcul)
    if (
      grp === 'groupe sportif' ||
      grp === 'groupe école' ||
      grp === 'groupe evo' ||
      grp === 'groupe perf'
    ) {
      return 'V';
    }

    const mapGrp: Record<string, string> = {
      'groupe balade': 'GPB',
      'groupe 1': 'GP1',
      'groupe 2': 'GP2',
      'groupe 3': 'GP3',
      'groupe 4': 'GP4',
      'groupe 5': 'GP5'
    };
    const code = mapGrp[grp] ?? 'GPB';

    const denMoy = Math.round((10 * denivele / dist) * 10) / 10;

    const levels:Level[] = [
      this.conv_dist[code](dist),
      this.conv_denivele[code](denivele),
      this.conv_conds(conds),
      this.conv_denmoy[code](denMoy)
    ];

    if (levels.includes('T')) return 'T';

    const dCount = levels.filter(l => l === 'D').length;
    if (dCount > 2) return 'T';

    const ptsDist: Record<Level, number> = { F: 1, N: 2, D: 4, T: 7 };
    const ptsDen:  Record<Level, number> = { F: 1, N: 4, D: 8, T: 13 };
    const ptsCond: Record<'N' | 'D', number> = { N: 1, D: 5 };
    const ptsDenM: Record<Level, number> = { F: 1, N: 4, D: 8, T: 13 };

    const total =
      ptsDist[levels[0]] +
      ptsDen[levels[1]] +
      ptsCond[levels[2] as 'N' | 'D'] +
      ptsDenM[levels[3]];


    if (total < 6) return 'V';
    if (total < 14) return 'B';
    if (total < 18) return 'R';
    return 'N';
  }

  niveauToColor(niveau: string): string {
  switch (niveau) {
    case 'V': return '#2ecc71'; // vert
    case 'B': return '#3498db'; // bleu
    case 'R': return '#e74c3c'; // rouge
    case 'N': return '#000000'; // noir
    case 'T': return '#7f8c8d'; // trop difficile
    default: return 'transparent';
  }
}

}
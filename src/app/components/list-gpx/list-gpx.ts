import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpxService } from '../../services/gpx.service';
import { Trace } from '../../models/trace.model';
import { Difficulty  } from '../../services/difficulty.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-list-gpx',
  standalone: true,
  imports: [CommonModule, 
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule],
  templateUrl: './list-gpx.html',
  styleUrls: ['./list-gpx.scss']
})
export class ListGpx implements OnInit {

  traces: Trace[] = [];
  filtered: Trace[] = [];

  minDistance?: number;
  maxDistance?: number;
  minDenivele?: number;
  maxDenivele?: number;
  keywordsInput = '';
  keywords: string[] = [];
  niveauxFiltres: string[] = [];

  currentSortColumn: number | null = null;
  currentSortDirection: boolean = true; // true = asc, false = desc
  numericColumns: number[] = [2, 3, 4]; // index des colonnes numériques : distance, dénivelé, date


  niveaux = [
    'groupe balade', 'groupe 1', 'groupe 2', 'groupe 3',
    'groupe 4', 'groupe 5', 'groupe sportif',
    'groupe école', 'groupe evo', 'groupe perf'
  ];

  

  constructor(
    private gpxService: GpxService,
    private diffService: Difficulty 
  ) {}

  ngOnInit() {
    this.gpxService.getTraces().subscribe(data => {

      this.traces = data.map(t => {

        const nEte = this.diffService.verdict(
          t.niveau,
          t.distance_km ?? 0,
          t.denivele ?? 0,
          false
        );

        const nHiver = this.diffService.verdict(
          t.niveau,
          t.distance_km ?? 0,
          t.denivele ?? 0,
          true
        );

        return {
          ...t,
          difficulte: {
            niveauNormal: nEte,
            niveauDifficile: nHiver,
            normal: this.diffService.niveauToColor(nEte),
            difficile: this.diffService.niveauToColor(nHiver)
          }
        };
      });

      this.applyFilters();
    });
  }


  toggleNiveau(niveau: string) {
    if (this.niveauxFiltres.includes(niveau)) {
      this.niveauxFiltres = this.niveauxFiltres.filter(n => n !== niveau);
    } else {
      this.niveauxFiltres.push(niveau);
    }
    this.applyFilters();
  }

  addKeyword() {
    // Support de plusieurs mots séparés par espace ou virgule
    const mots = this.keywordsInput.split(/[\s,]+/).map(k => k.trim()).filter(k => k);
    mots.forEach(k => {
      if (!this.keywords.includes(k)) this.keywords.push(k);
    });
    this.keywordsInput = '';
    this.applyFilters();
  }

  removeKeyword(kw: string) {
    this.keywords = this.keywords.filter(k => k !== kw);
    this.applyFilters();
  }

  applyFilters() {
    this.filtered = this.traces.filter(t => {
      if (this.minDistance && (t.distance_km ?? 0) < this.minDistance) return false;
      if (this.maxDistance && (t.distance_km ?? 0) > this.maxDistance) return false;

      if (this.minDenivele && (t.denivele ?? 0) < this.minDenivele) return false;
      if (this.maxDenivele && (t.denivele ?? 0) > this.maxDenivele) return false;

      if (this.niveauxFiltres.length && !this.niveauxFiltres.includes(t.niveau)) return false;

      if (this.keywords.length) {
        const text = (t.nom + ' ' + (t.description ?? '')).toLowerCase();
        for (let k of this.keywords) {
          if (!text.includes(k.toLowerCase())) return false;
        }
      }

      return true;
    });
  }

  download(trace: Trace) {
    this.gpxService.downloadTrace(trace.id!).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Nom du fichier = nom de la trace
      const safeName = (trace.nom || 'trace').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      a.download = `${safeName}.gpx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  sortColumn(n: number) {
    if (this.currentSortColumn === n) {
      this.currentSortDirection = !this.currentSortDirection;
    } else {
      this.currentSortColumn = n;
      this.currentSortDirection = true;
    }

    this.filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // correspondance index => propriété
      switch (n) {
        case 0: // Nom
          aValue = a.nom; bValue = b.nom; break;
        case 1: // Description
          aValue = a.description || ''; bValue = b.description || ''; break;
        case 2: // Niveau
         // On tri selon l'ordre dans le tableau `niveaux`
          aValue = this.niveaux.indexOf(a.niveau || '');
          bValue = this.niveaux.indexOf(b.niveau || '');
          break;
        case 3: // Distance
          aValue = a.distance_km ?? 0; bValue = b.distance_km ?? 0; break;
        case 4: // Dénivelé
          aValue = a.denivele ?? 0; bValue = b.denivele ?? 0; break;
        case 5: // Date parcours
          aValue = a.date_parcours ?? ''; bValue = b.date_parcours ?? ''; break;
      }

      // Numeric ou texte
      const isNumeric = this.numericColumns.includes(n);
      if (isNumeric) {
        return this.currentSortDirection
          ? aValue - bValue
          : bValue - aValue;
      } else {
        return this.currentSortDirection
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    });
  }

  getSortIcon(n: number): string {
    if (this.currentSortColumn !== n) return '↕';
    return this.currentSortDirection ? '↑' : '↓';
  }

}


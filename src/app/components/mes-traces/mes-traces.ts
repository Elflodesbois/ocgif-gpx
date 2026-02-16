import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trace } from '../../services/trace';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GpxPreviewMap } from '../gpx-preview-map/gpx-preview-map';

@Component({
  selector: 'app-mes-traces',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    GpxPreviewMap
  ],
  templateUrl: './mes-traces.html',
  styleUrl: './mes-traces.scss'
})
export class MesTraces implements OnInit {

  traces: any[] = [];
  loading = true;

  constructor(private traceService: Trace) {}

  ngOnInit() {
    this.loadTraces();
  }

  loadTraces() {
    this.loading = true;
    this.traceService.getMyTraces().subscribe(res => {
      this.traces = res;
      this.loading = false;
    });
  }

  deleteTrace(id: number) {
    if (!confirm('Supprimer cette trace ?')) return;
    this.traceService.deleteTrace(id).subscribe(() => this.loadTraces());
  }
}

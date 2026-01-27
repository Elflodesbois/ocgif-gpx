import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trace } from '../../services/trace';

@Component({
  selector: 'app-mes-traces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-traces.html',
  styleUrl: './mes-traces.scss'
})
export class MesTraces implements OnInit {
  traces: any[] = [];

  constructor(private traceService: Trace) {}

  ngOnInit() {
    this.loadTraces();
  }

  loadTraces() {
    this.traceService.getMyTraces().subscribe(res => this.traces = res);
  }

  deleteTrace(id: number) {
    if (!confirm('Supprimer cette trace ?')) return;
    this.traceService.deleteTrace(id).subscribe(() => this.loadTraces());
  }
}
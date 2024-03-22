import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash'
import { StepsSummary } from '../step';
import { Observable } from 'rxjs/internal/Observable';
import { ChartData } from 'chart.js';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { AdvancedPieChartWidgetOptions } from '../../../../../core/widgets/advanced-pie-chart-widget/advanced-pie-chart-widget-options.interface';
import { MatDialog } from '@angular/material';
import { RequiroConfirmDialogComponent } from '../../../../common/confirm-dialog/requiro-confirm-dialog.component';

@Component({
  selector: 'steps-summary',
  templateUrl: './steps-summary.component.html',
  styleUrls: ['./steps-summary.component.scss'],

})
export class StepsSummaryComponent implements OnInit {

  @Input() stepsSummary: StepsSummary;
  @Output() confirm = new EventEmitter();

  reiniciar: boolean;

  advancedPieChartData: Observable<ChartData>;
  advancedPieChartOptions: AdvancedPieChartWidgetOptions;

  constructor(private dialog: MatDialog) {
    this.reiniciar = false;
  }

  ngOnInit() {
    this.advancedPieChartOptions = {
      title: 'Filtros',
      subTitle: 'Resumen de filtros aplicados\n'
    };
  }

  toAdvancedPieChartData(chartData: { labels: string[], data: number[] }) {
    return {
      labels: chartData.labels,
      datasets: [{
        label: 'clientes',
        backgroundColor: _.take(['#009688', '#2196F3', '#9C27B0', '#00BCD4', '#F44336', '#FF9800'], chartData.labels.length),
        borderColor: 'transparent',
        data: chartData.data,
      }]
    };
  }

  completed(): boolean {
    let enabledSteps = this.stepsSummary.steps.filter(s => s.enabled);
    return enabledSteps.filter(s => s.enabled).every(s => s.completed);
  }

  getChartData() {
    let enabledSteps = this.stepsSummary.steps.filter(s => s.enabled);
    let countFiltered = enabledSteps.map(s => s.countFiltered);
    const advancedPieChartDemoValues = countFiltered.concat(this.stepsSummary.initialCount - _.sum(countFiltered));
    const advancedPieChartDemoLabels = enabledSteps.map(s => s.title).concat("Resto");

    let data = of({
      labels: advancedPieChartDemoLabels,
      data: advancedPieChartDemoValues
    }).pipe(
      map(values => this.toAdvancedPieChartData(values))
    );

    return data;
  }

  applyFilters() {
    this.dialog.open(RequiroConfirmDialogComponent, {
      data: {
        title: 'Confirmación',
        content: '¿Está seguro que desea aplicar estos filtros?'
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.confirm.emit({ reiniciar: this.reiniciar, steps: this.stepsSummary.steps.filter(s => s.enabled) });
      }
    });
  }

  calculateRest(): number {
    return this.stepsSummary.initialCount - _.sum(_.map(this.stepsSummary.steps, s => s.countFiltered));
  }
}

import * as d3 from 'd3';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ProgressComponent } from "../progress/progress.component";

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  imports: [ProgressComponent],
})
export class ChartComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.createGaugeChart();
  }

  createGaugeChart() {
    const width = 530;
    const height = 328;

    const svg = d3
      .select(this.elementRef.nativeElement.querySelector('#gauge-chart'))
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const arcGroup = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2 + 20})`);

    const outerRadius = 110;
    const innerRadius = 80;
    const progressRadius = 100;

    const totalProgressValue = 0.67; // 67%

    // Background arc
    const arcBackground = d3.arc<d3.DefaultArcObject>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const backgroundArcData: d3.DefaultArcObject = {
      startAngle: -Math.PI / 2,
      endAngle: Math.PI / 2,
      innerRadius: innerRadius,
      outerRadius: outerRadius,
    };

    arcGroup
      .append('path')
      .datum(backgroundArcData)
      .attr('d', arcBackground)
      .style('fill', '#404854');

    // Progress arc
    const arcProgress = d3.arc<d3.DefaultArcObject>()
      .innerRadius(innerRadius)
      .outerRadius(progressRadius);

    const progressArcPath = arcGroup
      .append('path')
      .datum({
        startAngle: -Math.PI / 2,
        endAngle: -Math.PI / 2,
        innerRadius: innerRadius,
        outerRadius: progressRadius,
      })
      .attr('d', arcProgress)
      .style('fill', '#00BFFF');

    // Percentage text (centered)
    arcGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '32px')
      .attr('font-weight', 'bold')
      .attr('dy', '0.35em')
      .attr('fill', '#FFFFFF')
      .text(`${Math.round(totalProgressValue * 100)}%`);

    // Pointer
    const pointerGroup = arcGroup.append('g');
    pointerGroup
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -progressRadius + 15)
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 3);

    // Animate the pointer and arc
    pointerGroup
      .transition()
      .duration(1000)
      .attrTween('transform', () => {
        const pointerInterpolate = d3.interpolate(-90, -90 + totalProgressValue * 180);
        return (t) => `rotate(${pointerInterpolate(t)})`;
      });

    progressArcPath
      .transition()
      .duration(1000)
      .attrTween('d', () => {
        const interpolateEndAngle = d3.interpolate(-Math.PI / 2, -Math.PI / 2 + totalProgressValue * Math.PI);
        return (t) =>
          arcProgress({
            startAngle: -Math.PI / 2,
            endAngle: interpolateEndAngle(t),
            innerRadius: innerRadius,
            outerRadius: progressRadius,
          })!;
      });
  }
}

import {ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis} from 'ng-apexcharts';

export interface LineCHartOptions {
    series: ApexAxisChartSeries;
    chart: ApexChart,
    xaxis: ApexXAxis,
    dataLabels: ApexDataLabels,
    grid: ApexGrid,
    stroke: ApexStroke,
    title: ApexTitleSubtitle
}

export interface BarChartOptions {
    series: ApexAxisChartSeries;
    chart: ApexChart,
    dataLabels: ApexDataLabels,
    plotOptions: ApexPlotOptions,
    yaxis: ApexYAxis,
    xaxis: ApexXAxis,
    fill: ApexFill,
    legend: ApexLegend,
    tooltip: any,
    colors: any,
    title: ApexTitleSubtitle
}

export interface PieChartOptions {
    series: ApexNonAxisChartSeries,
    chart: ApexChart,
    responsive: ApexResponsive[],
    labels: any,
    title: ApexTitleSubtitle,
    legend: ApexLegend,
    colors: any,
    tooltip: any,
    dataLabels: any
}
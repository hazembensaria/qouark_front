import { Component, inject } from '@angular/core';
import { AppStore } from '../../../store/app.store';
import { BarChartOptions, PieChartOptions, LineCHartOptions } from '../../../interface/chartOption';
import { dataValue } from '../../../pipe/data-pipe';
import { CommonModule } from '@angular/common';
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import { LabelValue } from '../../../pipe/label-pipe';
import { of } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  imports: [dataValue, CommonModule, LabelValue, ChartComponent, NgApexchartsModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  protected store = inject(AppStore);

  lineChartOptions : Partial<LineCHartOptions>;
  columnChartOptions : Partial<BarChartOptions>;
  pieChartOptions : Partial<PieChartOptions>;
  donutChartOptions : Partial<PieChartOptions>;

  constructor() {
   
     this.columnChartOptions = {
  series: [
    {
      name: 'Messages',
      data: [10, 24, 18, 30, 22, 40, 28]
    }
  ],
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '45%',
      borderRadius: 8, // 🔥 rounded bars
      borderRadiusApplication: 'end'
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: '#6B7280', // gray-500
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#6B7280',
        fontSize: '12px'
      }
    }
  },
  fill: {
    opacity: 1,
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0.3,
      gradientToColors: ['#6366F1'], // 🔥 nice gradient
      inverseColors: false,
      opacityFrom: 0.9,
      opacityTo: 1,
      stops: [0, 100]
    }
  },
  colors: ['#4F46E5'], // indigo modern color
  tooltip: {
    theme: 'light',
    style: {
      fontSize: '13px'
    }
  },
  legend: {
    show: false
  }};

  this.lineChartOptions = {
  series: [
    {
      name: 'Messages',
      data: [12, 18, 14, 22, 30, 28, 35]
    }
  ],
  chart: {
    type: 'line',
    height: 350,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  stroke: {
    curve: 'smooth', // 🔥 smooth modern curve
    width: 3
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: '#6B7280',
        fontSize: '12px'
      }
    }
  },
  grid: {
    borderColor: '#E5E7EB',
    strokeDashArray: 4, // 🔥 subtle dashed grid
  },
 
};

this.pieChartOptions = {
  series: [44, 25, 15, 16],
  chart: {
    type: 'donut',
    height: 320
  },
  labels: ['Unread', 'Read', 'Archived', 'Deleted'],
  colors: ['#4F46E5', '#22C55E', '#F59E0B', '#EF4444'], // modern palette
  legend: {
    position: 'bottom',
    fontSize: '13px',
    labels: {
      colors: '#6B7280'
    }
  },

  tooltip: {
    theme: 'light',
    y: {
      formatter: (val: number) => `${val} messages`
    }
  },
};
this.donutChartOptions = {
  series: [35, 25, 20, 20],

  chart: {
    type: 'donut',
    height: 340,
    toolbar: {
      show: false
    }
  },
  labels: ['Unread', 'Read', 'Archived', 'Deleted'],
  colors: ['#4F46E5', '#22C55E', '#F59E0B', '#EF4444'], // modern palette
  legend: {
    position: 'bottom',
    fontSize: '13px',
    labels: {
      colors: '#6B7280'
    }
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val: number) => `${val} items`
    }
  },
  // dataLabels: {
  //   enabled: true,
  //   formatter: (val) => `${val}% total`, 
  //   offsetY: -10,
  //    style: {
  //     fontSize: '12px',
  //     colors: ['#fff']
  //   }
  // },

  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 280
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ]
};
}


ngOnInit() {
  this.store?.getAllTickets();
}


}

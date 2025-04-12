import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const RevenueCharts = ({ theme }) => {
  // Move chart options and series here
  // ...existing chart configuration code...
  const getChartTheme = () => ({
    mode: theme,
    monochrome: {
      enabled: true,
      color: theme === 'dark' ? '#f7dd80' : '#ffd700',
      shadeTo: 'light',
      shadeIntensity: 0.65
    }
  });

  const revenueChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      },
      background: 'transparent',
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: [theme === 'dark' ? '#f7dd80' : '#ffd700']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: theme === 'dark' ? '#f7dd80' : '#ffd700',
            opacity: 0.7
          },
          {
            offset: 100,
            color: theme === 'dark' ? '#f7dd80' : '#ffd700',
            opacity: 0.2
          }
        ]
      }
    },
    grid: {
      borderColor: theme === 'dark' ? '#333' : '#e5e5e5',
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      labels: {
        style: {
          colors: theme === 'dark' ? '#fff' : '#000'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === 'dark' ? '#fff' : '#000'
        },
        formatter: (value) => `$${value}`
      }
    },
    tooltip: {
      theme: theme,
      y: {
        formatter: (value) => `$${value}`
      }
    },
    theme: getChartTheme()
  };

  const revenueSeries = [{
    name: 'Revenue',
    data: [4000, 6000, 5500, 7800, 8900, 7000, 9500]
  }];

  const ticketChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '60%',
      }
    },
    grid: {
      borderColor: theme === 'dark' ? '#333' : '#e5e5e5',
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
          colors: theme === 'dark' ? '#fff' : '#000'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === 'dark' ? '#fff' : '#000'
        }
      }
    },
    tooltip: {
      theme: theme
    },
    theme: getChartTheme()
  };

  const ticketSeries = [{
    name: 'Tickets Sold',
    data: [44, 55, 57, 56, 61, 98, 85]
  }];

  return (
    <>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={revenueChartOptions}
            series={revenueSeries}
            type="area"
            height={350}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Ticket Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Chart
            options={ticketChartOptions}
            series={ticketSeries}
            type="bar"
            height={350}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default RevenueCharts;

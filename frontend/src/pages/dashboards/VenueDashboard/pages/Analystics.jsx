import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Analytics = () => {
  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    yaxis: [
      {
        title: {
          text: 'Revenue ($)'
        }
      },
      {
        opposite: true,
        title: {
          text: 'Attendance'
        }
      }
    ],
    colors: ['#10b981', '#f43f5e'],
    legend: {
      position: 'top'
    }
  };

  const series = [
    {
      name: 'Revenue',
      data: [2400, 1398, 3200, 2800, 1908, 3000]
    },
    {
      name: 'Attendance',
      data: [400, 300, 600, 500, 400, 550]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <Chart 
              options={chartOptions}
              series={series}
              type="line"
              height="100%"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              options={{
                ...chartOptions,
                chart: {
                  type: 'bar'
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                  },
                }
              }}
              series={[{
                name: 'Shows',
                data: [44, 55, 57, 56, 61, 58]
              }]}
              type="bar"
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Genre Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              options={{
                labels: ['Stand-up', 'Improv', 'Sketch', 'Open Mic'],
                colors: ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b'],
                legend: {
                  position: 'bottom'
                }
              }}
              series={[44, 55, 13, 43]}
              type="donut"
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

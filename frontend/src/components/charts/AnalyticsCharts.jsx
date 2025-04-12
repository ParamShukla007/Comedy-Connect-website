import React from "react";
import ReactApexChart from "react-apexcharts";

// Sample data - Replace with actual API data
const revenueData = [
  { x: "Jan", y: 12000 },
  { x: "Feb", y: 19000 },
  { x: "Mar", y: 15000 },
  { x: "Apr", y: 21000 },
  { x: "May", y: 28000 },
  { x: "Jun", y: 35000 },
];

const bookingData = [
  { x: "Mon", y: 45 },
  { x: "Tue", y: 52 },
  { x: "Wed", y: 49 },
  { x: "Thu", y: 63 },
  { x: "Fri", y: 85 },
  { x: "Sat", y: 95 },
  { x: "Sun", y: 78 },
];

const demographicsData = [25, 35, 20, 12, 8];
const demographicsLabels = ["18-24", "25-34", "35-44", "45-54", "55+"];

const peakHoursData = [10, 25, 45, 30, 65, 40, 15];
const peakHoursLabels = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM", "12AM"];

export const RevenueChart = () => {
  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
      },
    },
    xaxis: {
      categories: revenueData.map(item => item.x),
    },
    colors: ["#0088FE"],
    tooltip: { theme: "dark" },
  };

  const series = [{
    name: "Revenue",
    data: revenueData.map(item => item.y),
  }];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={300}
    />
  );
};

export const BookingTrendsChart = () => {
  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: bookingData.map(item => item.x),
    },
    colors: ["#00C49F"],
    tooltip: { theme: "dark" },
  };

  const series = [{
    name: "Bookings",
    data: bookingData.map(item => item.y),
  }];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={300}
    />
  );
};

export const UserDemographicsChart = () => {
  const options = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    labels: demographicsLabels,
    colors: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
    legend: {
      position: "bottom",
    },
    tooltip: { theme: "dark" },
  };

  const series = demographicsData;

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      height={300}
    />
  );
};

export const PeakHoursChart = () => {
  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 4,
      strokeWidth: 0,
    },
    xaxis: {
      categories: peakHoursLabels,
    },
    colors: ["#8884d8"],
    tooltip: { theme: "dark" },
  };

  const series = [{
    name: "Bookings",
    data: peakHoursData,
  }];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={300}
    />
  );
};

export const SalesPerformanceChart = ({ data }) => {
  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data?.map(item => item.name) || [],
    },
    colors: ["#FFBB28"],
    tooltip: { theme: "dark" },
  };

  const series = [{
    name: "Sales",
    data: data?.map(item => item.value) || [],
  }];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={300}
    />
  );
};

export const ComparisonChart = ({ data }) => {
  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    stroke: {
      curve: "smooth",
      width: [3, 3],
    },
    markers: {
      size: 4,
      strokeWidth: 0,
    },
    xaxis: {
      categories: data?.map(item => item.name) || [],
    },
    colors: ["#0088FE", "#00C49F"],
    tooltip: { theme: "dark" },
  };

  const series = [
    {
      name: "Metric 1",
      data: data?.map(item => item.metric1) || [],
    },
    {
      name: "Metric 2",
      data: data?.map(item => item.metric2) || [],
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={300}
    />
  );
};

export const PeakHoursHeatMap = () => {
  const options = {
    chart: {
      type: 'heatmap',
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    dataLabels: { enabled: false },
    colors: ["#008FFB"],
    title: { text: 'Booking Activity by Hour & Day' },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    tooltip: { theme: 'dark' },
  };

  // Sample heatmap data
  const series = [
    {
      name: "Morning (6-12)",
      data: [
        { x: 'Mon', y: 25 },
        { x: 'Tue', y: 30 },
        { x: 'Wed', y: 35 },
        { x: 'Thu', y: 40 },
        { x: 'Fri', y: 45 },
        { x: 'Sat', y: 50 },
        { x: 'Sun', y: 30 },
      ]
    },
    {
      name: "Afternoon (12-5)",
      data: [
        { x: 'Mon', y: 45 },
        { x: 'Tue', y: 50 },
        { x: 'Wed', y: 55 },
        { x: 'Thu', y: 60 },
        { x: 'Fri', y: 65 },
        { x: 'Sat', y: 70 },
        { x: 'Sun', y: 50 },
      ]
    },
    {
      name: "Evening (5-10)",
      data: [
        { x: 'Mon', y: 65 },
        { x: 'Tue', y: 70 },
        { x: 'Wed', y: 75 },
        { x: 'Thu', y: 80 },
        { x: 'Fri', y: 85 },
        { x: 'Sat', y: 90 },
        { x: 'Sun', y: 70 },
      ]
    },
    {
      name: "Night (10-6)",
      data: [
        { x: 'Mon', y: 15 },
        { x: 'Tue', y: 20 },
        { x: 'Wed', y: 25 },
        { x: 'Thu', y: 30 },
        { x: 'Fri', y: 35 },
        { x: 'Sat', y: 40 },
        { x: 'Sun', y: 20 },
      ]
    }
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="heatmap"
      height={300}
    />
  );
};

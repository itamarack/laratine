'use client';

import {
  Group,
  Paper,
  PaperProps,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import React, { Suspense } from 'react';
import { Surface } from '@/Components';

const Chart = React.lazy(() => import('react-apexcharts'));

type ChartProps = {
  title?: string;
  series: { name?: string; data: number[] }[];
  categories?: (string | number | undefined)[];
} & PaperProps;

const AreaChart = ({ title, series, categories }: ChartProps) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const options: any = {
    chart: {
      height: 350,
      type: 'area',
      fontFamily: 'Open Sans, sans-serif',
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: title,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories: categories,
      labels: {
        style: {
          colors: colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    colors: [theme.colors[theme.primaryColor][5], theme.colors[theme.primaryColor][2]],
    legend: {
      labels: {
        colors: [colorScheme === 'dark' ? theme.white : theme.black],
      },
    },
  };

  return (
    <Surface component={Paper} p="md" shadow="md" radius="md" h="100%">
      <Suspense fallback={<span>Loading...</span>}>
        <Chart options={options} series={series} type="area" height={350} width={'100%'} />
      </Suspense>
    </Surface>
  );
};

export default AreaChart;

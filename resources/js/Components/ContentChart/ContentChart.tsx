'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { Box, Paper, PaperProps, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { Surface } from '@/Components';
import { Category } from '@/types';

type ContentType = {
  categories?: Category[];
} & PaperProps;

const ContentChart = ({ categories, ...others }: ContentType) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [itemCount, setItemCount] = useState<any>([]);
  const [categoryItem, setCategoryItems] = useState<string[] | undefined>([]);

  useEffect(() => {
    const categoryItems = categories?.map(item => item.title);
    const series = categories?.map(item => item.posts_count);

    setCategoryItems(() => categoryItems);
    setItemCount(() => [{ name: 'Category', data: series }]);
  }, [categories]);

  const options: any = {
    chart: {
      fontFamily: 'Open Sans, sans-serif',
      height: 350,
      type: 'radar',
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1,
      },
    },
    title: {
      text: 'Categories',
    },
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.1,
    },
    markers: {
      size: 0,
    },
    yaxis: {
      stepSize: 20,
    },
    xaxis: {
      categories: categoryItem,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        radar: {
          size: '75%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              fontWeight: '400',
              color: colorScheme === 'dark' ? theme.white : theme.colors.dark[6],
            },
            value: {
              show: true,
              fontSize: '22px',
              fontWeight: '600',
              color: colorScheme === 'dark' ? theme.white : theme.colors.dark[6],
            },
            total: {
              show: true,
              showAlways: true,
              formatter: function (w: any) {
                const totals = w.globals.seriesTotals;

                const result = totals.reduce((a: number, b: number) => a + b, 0);

                return (result / 1000).toFixed(3);
              },
              color: colorScheme === 'dark' ? theme.white : theme.colors.dark[6],
            },
          },
        },
      },
    },
    colors: [
      theme.colors[theme.primaryColor][9],
      theme.colors[theme.primaryColor][5],
      theme.colors[theme.primaryColor][3],
      theme.colors[theme.primaryColor][2],
    ],
  };

  return (
    <Surface component={Paper} p="md" shadow="md" radius="md" h="100%" {...others}>
      <Suspense fallback={<div>Loading...</div>}>
        <Box>
          <Chart options={options} series={itemCount} type="radar" height={350} width={'100%'} />
        </Box>
      </Suspense>
    </Surface>
  );
};

export default ContentChart;

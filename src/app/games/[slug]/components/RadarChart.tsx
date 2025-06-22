"use client";

import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

interface RadarChartProps {
  stats: {
    ost: number;
    maniabilite: number;
    gameplay: number;
    graphismes: number;
    duree_de_vie: number;
  };
}

export default function RadarChart({ stats }: RadarChartProps) {
  const data = {
    labels: ['OST', 'Maniabilité', 'Gameplay', 'Graphismes', 'Durée de Vie'],
    datasets: [
      {
        label: 'Évaluation',
        data: [
          stats.ost,
          stats.maniabilite,
          stats.gameplay,
          stats.graphismes,
          stats.duree_de_vie,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.4)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        pointLabels: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          backdropColor: 'transparent',
          stepSize: 25,
        },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      }
    },
  };

  return <Radar data={data} options={options} />;
} 
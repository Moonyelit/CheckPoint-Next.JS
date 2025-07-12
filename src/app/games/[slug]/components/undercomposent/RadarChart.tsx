import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import Image from 'next/image';
import '../styles/RadarChart.scss';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  ratings: {
    jouabilite?: number;
    gameplay?: number;
    musique?: number;
    histoire?: number;
    graphisme?: number;
  };
  style?: React.CSSProperties;
  className?: string;
}

export default function RadarChart({ ratings, style, className }: RadarChartProps) {
  const data = {
    labels: ['Jouabilité', 'Gameplay', 'OST', 'Histoire', 'Graphisme'],
    datasets: [
      {
        label: 'Notes',
        data: [
          ratings.jouabilite ?? 0,
          ratings.gameplay ?? 0,
          ratings.musique ?? 0,
          ratings.histoire ?? 0,
          ratings.graphisme ?? 0,
        ],
        backgroundColor: 'rgba(0, 166, 237, 0.5)',
        borderColor: 'rgba(0, 166, 237, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0, 166, 237, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { 
          stepSize: 20, 
          color: '#fff',
          display: false // Masquer les numéros
        },
        pointLabels: { 
          color: '#fff', 
          font: { size: 14 },
          callback: function() {
            // Retourner les icônes au lieu du texte
            return '';
          }
        },
        grid: { color: '#fff' },
        angleLines: { color: '#fff' },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div style={style} className={`radar-chart${className ? ' ' + className : ''}`}>
      <div className="radar-chart__canvas">
        <Radar data={data} options={options} />
      </div>
      <div className="radar-chart__icons">
        <div className="radar-chart__icon radar-chart__icon--jouabilite">
          <Image 
            src="/images/Icons/svg/jouabilite-icon.svg" 
            alt="Jouabilité" 
            width={17} 
            height={20}
          />
        </div>
        <div className="radar-chart__icon radar-chart__icon--gameplay">
          <Image 
            src="/images/Icons/svg/gameplay-icon.svg" 
            alt="Gameplay" 
            width={19} 
            height={16}
          />
        </div>
        <div className="radar-chart__icon radar-chart__icon--ost">
          <Image 
            src="/images/Icons/svg/ost-icon.svg" 
            alt="OST" 
            width={20} 
            height={19}
          />
        </div>
        <div className="radar-chart__icon radar-chart__icon--histoire">
          <Image 
            src="/images/Icons/svg/histoire-icon.svg" 
            alt="Histoire" 
            width={20} 
            height={18}
          />
        </div>
        <div className="radar-chart__icon radar-chart__icon--graphisme">
          <Image 
            src="/images/Icons/svg/graphisme-icon.svg" 
            alt="Graphisme" 
            width={21} 
            height={21}
          />
        </div>
      </div>
    </div>
  );
} 
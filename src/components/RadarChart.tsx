import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { categories, MAX_SCORE } from '../config/questions';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

interface RadarChartProps {
  scores: Record<string, number>;
}

const SHORT_LABELS: Record<string, string[]> = {
  'Information Management': ['Information', 'Management'],
  'Creativity & Idea Management': ['Creativity', '& Ideas'],
  'Task & Project Management': ['Tasks', '& Projects'],
  'Vision & Values': ['Vision', '& Values'],
  'Journaling & Reflection': ['Journaling', '& Reflection'],
};

export default function RadarChart({ scores }: RadarChartProps) {
  const labels = categories.map((c) => SHORT_LABELS[c.label] ?? [c.label]);
  const data = categories.map((c) =>
    Math.round(((scores[c.id] ?? 0) / MAX_SCORE) * 100),
  );
  const colors = categories.map((c) => c.color);

  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 500;

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Your PKM Profile',
        data,
        backgroundColor: 'rgba(195, 34, 255, 0.15)',
        borderColor: '#C322FF',
        borderWidth: 2.5,
        pointBackgroundColor: colors,
        pointBorderColor: colors,
        pointRadius: isMobile ? 6 : 8,
        pointHoverRadius: isMobile ? 8 : 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    layout: {
      padding: isMobile ? 4 : 8,
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          display: false, // hide 20/40/60/80/100 numbers to give the chart more room
          stepSize: 20,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        pointLabels: {
          color: '#CCCCCC',
          font: {
            size: isMobile ? 12 : 14,
            weight: '500' as const,
            family:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          },
          padding: isMobile ? 12 : 18,
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleColor: '#FFFFFF',
        bodyColor: '#AAAAAA',
        borderColor: '#333333',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx: { parsed: { r: number } }) =>
            `Score: ${ctx.parsed.r}%`,
        },
      },
    },
  };

  return (
    <div className="radar-chart-wrapper">
      <Radar data={chartData} options={options} />
    </div>
  );
}

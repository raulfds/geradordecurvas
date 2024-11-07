import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { PumpData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PumpChartProps {
  pumps: PumpData[];
}

export function PumpChart({ pumps }: PumpChartProps) {
  const generatePoints = (pump: PumpData) => {
    const points = [];
    const steps = 20; // Número de passos para suavizar a curva

    // Ponto inicial ajustado para começar em minFlow e maxHeight
    const startFlow = pump.minFlow;
    const startHeight = pump.maxHeight;

    // Gerando pontos para a curva
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      
      // Calcular o fluxo com base no intervalo de minFlow a maxFlow
      const flow = startFlow + (pump.maxFlow - startFlow) * t;
      
      // Calcular a altura com base em uma curva quadrática invertida
      const height = startHeight - (startHeight - pump.minHeight) * Math.pow(t, 1.5);
      
      points.push({ x: flow, y: height });
    }

    return points;
  };
  
  const data = {
    datasets: pumps.map((pump) => ({
      label: pump.name,
      data: generatePoints(pump),
      borderColor: pump.color,
      backgroundColor: pump.color,
      borderWidth: 2,
      tension: 0.4,
      fill: false,
      pointRadius: (ctx) => {
        const index = ctx.dataIndex;
        return index === 0 || index === ctx.dataset.data.length - 1 ? 4 : 0;
      },
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Curva de Seleção de Bombas',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw as { x: number; y: number };
            return `${context.dataset.label}: ${point.y.toFixed(1)}m @ ${point.x.toFixed(1)}L/h`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom',
        title: {
          display: true,
          text: 'Vazão (m³/h)',
          padding: 10,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        min: 0,
      },
      y: {
        title: {
          display: true,
          text: 'Altura Manométrica (m.c.a)',
          padding: 10,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        min: 0,
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
  };

  return (
    <div className="h-[600px] w-full bg-white p-6 rounded-lg shadow-md">
      <Line options={options} data={data} />

      {/* Tabela de características hidráulicas abaixo do gráfico */}
      <div className="my-4">
        <h3 className="font-semibold text-center">Características Hidráulicas</h3>
        <table className="min-w-full border border-gray-300 text-center mt-2">
          <thead>
            <tr className="bg-blue-200">
              <th className="border px-4 py-2" colSpan={13}>Altura Manométrica Total (m.c.a.)</th>
            </tr>
            <tr className="bg-blue-100">
              {Array.from({ length: 13 }, (_, i) => (
                <th key={i} className="border px-2 py-1">{2 + i * 2}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100">
              <td className="border px-2 py-1">7.5</td>
              <td className="border px-2 py-1">7.7</td>
              <td className="border px-2 py-1">7.9</td>
              <td className="border px-2 py-1">7.5</td>
              <td className="border px-2 py-1">7.3</td>
              <td className="border px-2 py-1">7.1</td>
              <td className="border px-2 py-1">6.7</td>
              <td className="border px-2 py-1">6.5</td>
              <td className="border px-2 py-1">6.1</td>
              <td className="border px-2 py-1">5.8</td>
              <td className="border px-2 py-1">5.6</td>
              <td className="border px-2 py-1">5.4</td>
              <td className="border px-2 py-1">5.2</td>
            </tr>
            {/* Adicione mais linhas conforme necessário para representar outros dados de vazão */}
          </tbody>
        </table>
        <p className="text-center text-gray-500 text-sm mt-2">
          Vazão em m³/h válida para sucção de 0 m.c.a.
        </p>
      </div>
    </div>
  );
}

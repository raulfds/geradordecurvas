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
    const steps = 20;

    const startFlow = pump.minFlow;
    const startHeight = pump.maxHeight;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const flow = startFlow + (pump.maxFlow - startFlow) * t;
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
            return `${context.dataset.label}: ${point.y.toFixed(1)}m @ ${point.x.toFixed(1)}m³/h`;
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

  // Geração da tabela com base nos dados das bombas
  const generateTableData = () => {
    const heights = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Alturas em m.c.a.
    return pumps.map((pump) => {
      return {
        name: pump.name,
        data: heights.map((height) => {
          // Interpolação linear aproximada entre vazão mínima e máxima com base na altura
          if (height >= pump.minHeight && height <= pump.maxHeight) {
            const flow = pump.maxFlow - ((pump.maxFlow - pump.minFlow) * (height - pump.minHeight)) / (pump.maxHeight - pump.minHeight);
            return flow.toFixed(1);
          }
          return '*'; // Marcar com asterisco para alturas fora do alcance
        }),
      };
    });
  };

  const tableData = generateTableData();

  return (
    <div className="w-full p-6 rounded-lg shadow-md">
      {/* Container do gráfico */}
      <div className="h-[600px] bg-white p-6 rounded-lg shadow-md mb-6">
        <Line options={options} data={data} />
      </div>

      {/* Tabela de características hidráulicas abaixo do gráfico */}
      <div className="mt-8">
        <h3 className="font-semibold text-center mb-4">Características Hidráulicas</h3>
        <table className="min-w-full border border-gray-300 text-center">
          <thead>
            <tr className="bg-blue-200">
              <th className="border px-4 py-2" colSpan={11}>Altura Manométrica Total (m.c.a.)</th>
            </tr>
            <tr className="bg-blue-100">
              <th className="border px-2 py-1">Bomba</th>
              {heights.map((height) => (
                <th key={height} className="border px-2 py-1">{height}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((pumpData) => (
              <tr key={pumpData.name} className="bg-gray-100">
                <td className="border px-2 py-1 font-semibold">{pumpData.name}</td>
                {pumpData.data.map((flow, index) => (
                  <td key={index} className="border px-2 py-1">{flow}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-blue-200">
              <td colSpan={11} className="border-t-2 border-blue-200 px-4 py-2 font-semibold">
                Vazão em m³/h válida para sucção de 0 m.c.a.
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

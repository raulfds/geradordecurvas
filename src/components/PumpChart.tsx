"use client"

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

export default function PumpChart({ pumps }: PumpChartProps) {
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

  const getFlowForHeight = (pump: PumpData, height: number) => {
    const points = generatePoints(pump);
    const closestPoint = points.reduce((prev, curr) => 
      Math.abs(curr.y - height) < Math.abs(prev.y - height) ? curr : prev
    );
    return closestPoint.x;
  };

  const minHeight = Math.min(...pumps.map(pump => pump.minHeight));
  const maxHeight = Math.max(...pumps.map(pump => pump.maxHeight));

  const tableHeights = Array.from(
    { length: Math.ceil((maxHeight - minHeight) / 0.5) + 1 },
    (_, i) => Number((minHeight + i * 0.5).toFixed(1))
  );

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <div className="h-[600px] mb-8">
        <Line options={options} data={data} />
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Características Hidráulicas</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-3 text-left font-semibold" rowSpan={2}>Bomba</th>
                <th className="px-4 py-3 text-center font-semibold" colSpan={tableHeights.length}>
                  Altura Manométrica Total (m.c.a.)
                </th>
              </tr>
              <tr className="bg-primary/10">
                {tableHeights.map((height) => (
                  <th key={height} className="px-3 py-2 text-center font-medium text-sm">
                    {height}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pumps.map((pump, index) => (
                <tr key={pump.name} className={index % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                  <td className="px-4 py-3 font-medium border-r border-gray-300">{pump.name}</td>
                  {tableHeights.map((height) => (
                    <td key={height} className="px-3 py-2 text-center border-r border-gray-300">
                      {height >= pump.minHeight && height <= pump.maxHeight
                        ? getFlowForHeight(pump, height).toFixed(1)
                        : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-muted-foreground text-sm mt-4">
          Vazão em m³/h válida para sucção de 0 m.c.a.
        </p>
      </div>
    </div>
  );
}
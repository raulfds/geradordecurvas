import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { PumpData } from '../types';

interface PumpFormProps {
  onAddPump: (pump: PumpData) => void;
  usedColors: string[];
}

const COLORS = [
  '#2ecc71', // Green
  '#e67e22', // Orange
  '#3498db', // Blue
  '#e74c3c', // Red
  '#9b59b6', // Purple
  '#1abc9c', // Turquoise
  '#f1c40f', // Yellow
  '#34495e', // Navy
];

export function PumpForm({ onAddPump, usedColors }: PumpFormProps) {
  const [name, setName] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const [maxFlow, setMaxFlow] = useState('');
  const [minHeight, setMinHeight] = useState('');
  const [minFlow, setMinFlow] = useState('');

  const getNextColor = () => {
    const availableColors = COLORS.filter(color => !usedColors.includes(color));
    if (availableColors.length === 0) {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 70%, 50%)`;
    }
    return availableColors[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pump: PumpData = {
      id: Date.now().toString(),
      name,
      maxHeight: Number(maxHeight),
      maxFlow: Number(maxFlow),
      minHeight: minHeight ? Number(minHeight) : undefined,
      minFlow: minFlow ? Number(minFlow) : undefined,
      color: getNextColor(),
    };

    onAddPump(pump);
    
    setName('');
    setMaxHeight('');
    setMaxFlow('');
    setMinHeight('');
    setMinFlow('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome da Bomba
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ex: 1/3 cv"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Altura Máxima (m.c.a)
          </label>
          <input
            type="number"
            required
            value={maxHeight}
            onChange={(e) => setMaxHeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vazão Máxima (Litros/h)
          </label>
          <input
            type="number"
            required
            value={maxFlow}
            onChange={(e) => setMaxFlow(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Altura Mínima (m.c.a) - Opcional
          </label>
          <input
            type="number"
            value={minHeight}
            onChange={(e) => setMinHeight(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vazão Mínima (m³/h) - Opcional
          </label>
          <input
            type="number"
            value={minFlow}
            onChange={(e) => setMinFlow(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            step="0.1"
          />
        </div>
      </div>
      <button
        type="submit"
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Adicionar Bomba
      </button>
    </form>
  );
}
import React from 'react';
import type { PumpData } from '../types';

interface PumpTableProps {
  pumps: PumpData[];
  onRemovePump: (id: string) => void;
}

export function PumpTable({ pumps, onRemovePump }: PumpTableProps) {
  if (pumps.length === 0) return null;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Altura Máx. (m)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vazão Máx. (L/h)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Altura Mín. (m)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vazão Mín. (L/h)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pumps.map((pump) => (
            <tr key={pump.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: pump.color }} />
                  {pump.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{pump.maxHeight}</td>
              <td className="px-6 py-4 whitespace-nowrap">{pump.maxFlow}</td>
              <td className="px-6 py-4 whitespace-nowrap">{pump.minHeight || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{pump.minFlow || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onRemovePump(pump.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
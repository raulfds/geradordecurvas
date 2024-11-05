import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { PumpForm } from './components/PumpForm';
import { PumpChart } from './components/PumpChart';
import { PumpTable } from './components/PumpTable';
import type { PumpData } from './types';

function App() {
  const [pumps, setPumps] = useState<PumpData[]>([]);

  const handleAddPump = (pump: PumpData) => {
    setPumps([...pumps, pump]);
  };

  const handleRemovePump = (id: string) => {
    setPumps(pumps.filter(pump => pump.id !== id));
  };

  const handleDownloadChart = async () => {
    const chart = document.querySelector('.chart-container');
    if (!chart) return;

    try {
      const dataUrl = await toPng(chart);
      const link = document.createElement('a');
      link.download = 'curva-bombas.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erro ao baixar imagem:', err);
    }
  };

  const usedColors = pumps.map(pump => pump.color);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Gerador de Curvas
          </h1>
          <p className="mt-2 text-gray-600">
            Insira os dados das bombas para gerar a curva de seleção
          </p>
        </div>

        <PumpForm onAddPump={handleAddPump} usedColors={usedColors} />

        {pumps.length > 0 && (
          <>
            <div className="chart-container relative">
              <PumpChart pumps={pumps} />
              <button
                onClick={handleDownloadChart}
                className="absolute top-4 right-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="w-5 h-5 mr-2" />
                Baixar Gráfico
              </button>
            </div>

            <PumpTable pumps={pumps} onRemovePump={handleRemovePump} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
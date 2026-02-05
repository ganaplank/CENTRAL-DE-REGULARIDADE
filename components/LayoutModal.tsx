import React from 'react';
import { X, LayoutGrid, Monitor, Save } from 'lucide-react';
import { LayoutSettings, CardDensity } from '../types';

interface LayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LayoutSettings;
  onSave: (settings: LayoutSettings) => void;
}

const LayoutModal: React.FC<LayoutModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState<LayoutSettings>(settings);

  React.useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const densities: { id: CardDensity; label: string; desc: string }[] = [
    { id: 'compact', label: 'Compacto', desc: 'Mais links em menos espaço' },
    { id: 'normal', label: 'Normal', desc: 'Equilíbrio padrão' },
    { id: 'relaxed', label: 'Amplo', desc: 'Maior legibilidade e ícones' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Monitor size={20} className="text-blue-600" />
            Personalizar Layout
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Columns Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Colunas (Desktop)</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5].map((cols) => (
                <button
                  key={cols}
                  onClick={() => setLocalSettings({ ...localSettings, columns: cols })}
                  className={`flex-1 py-3 rounded-lg border transition-all font-medium text-sm flex flex-col items-center gap-1 ${
                    localSettings.columns === cols
                      ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid size={18} className={localSettings.columns === cols ? 'text-blue-600' : 'text-slate-400'} />
                  {cols} Colunas
                </button>
              ))}
            </div>
          </div>

          {/* Density Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Tamanho dos Cards</label>
            <div className="space-y-2">
              {densities.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setLocalSettings({ ...localSettings, density: d.id })}
                  className={`w-full px-4 py-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                    localSettings.density === d.id
                      ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className={`font-medium ${localSettings.density === d.id ? 'text-blue-800' : 'text-slate-700'}`}>
                      {d.label}
                    </div>
                    <div className="text-xs text-slate-500">{d.desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    localSettings.density === d.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {localSettings.density === d.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 font-medium"
          >
            <Save size={18} />
            Aplicar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayoutModal;
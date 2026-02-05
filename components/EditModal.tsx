import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { LinkItem } from '../types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: LinkItem) => void;
  initialData?: LinkItem | null;
}

const PREDEFINED_ICONS = [
  '🏢', '🏦', '⚖️', '🏛️', '👷', '💼', 
  '📂', '📄', '📜', '📋', '📊', '🧾',
  '🏙️', '📍', '🌍', '🇧🇷', '🚫', '✅',
  '👮', '🧑‍⚖️', '🏧', '🤝', '🔒', '🔑'
];

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('🔗');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setUrl(initialData.url);
        setIcon(initialData.icon || '🔗');
      } else {
        setName('');
        setUrl('');
        setIcon('🔗');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    // Basic URL validation
    let validUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      validUrl = `https://${url}`;
    }

    onSave({
      id: initialData ? initialData.id : crypto.randomUUID(),
      name,
      url: validUrl,
      icon,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? 'Editar Link' : 'Novo Link'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ex: Receita Federal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
            <input 
              type="url" 
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ícone</label>
            
            <div className="space-y-3">
              {/* Custom Input */}
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <input 
                      type="text" 
                      maxLength={2}
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-16 h-12 text-center text-2xl bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="🔗"
                    />
                 </div>
                 <div className="text-sm text-slate-500">
                   <p>Digite um emoji personalizado ou escolha abaixo.</p>
                 </div>
              </div>

              {/* Grid of options */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-40 overflow-y-auto custom-scrollbar">
                <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider sticky top-0 bg-slate-50 pb-1">Sugestões</p>
                <div className="grid grid-cols-6 gap-2">
                    {PREDEFINED_ICONS.map(emoji => (
                        <button 
                            key={emoji}
                            type="button" 
                            onClick={() => setIcon(emoji)}
                            className={`aspect-square flex items-center justify-center rounded-lg text-xl transition-all ${
                              icon === emoji 
                                ? 'bg-white shadow-sm ring-2 ring-blue-500 scale-105' 
                                : 'hover:bg-white hover:shadow-sm hover:scale-105 text-slate-600'
                            }`}
                            title="Selecionar este ícone"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-50 mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
            >
              <Save size={18} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;

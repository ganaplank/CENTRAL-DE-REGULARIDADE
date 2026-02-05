import React, { useState, useEffect } from 'react';
import { X, Save, Check } from 'lucide-react';
import { Category } from '../types';

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, title: string, color: string) => void;
  initialData: Category | null;
}

const COLORS = [
  { id: 'emerald', name: 'Verde', bg: 'bg-emerald-500' },
  { id: 'blue', name: 'Azul', bg: 'bg-blue-500' },
  { id: 'rose', name: 'Rosa', bg: 'bg-rose-500' },
  { id: 'amber', name: 'Amarelo', bg: 'bg-amber-500' },
  { id: 'purple', name: 'Roxo', bg: 'bg-purple-500' },
  { id: 'indigo', name: 'Índigo', bg: 'bg-indigo-500' },
  { id: 'cyan', name: 'Ciano', bg: 'bg-cyan-500' },
  { id: 'slate', name: 'Cinza', bg: 'bg-slate-500' },
];

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('blue');

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setColor(initialData.color);
    } else {
      setTitle('');
      setColor('blue');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    if (initialData) {
        onSave(initialData.id, title, color);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            Editar Categoria
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título da Categoria</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ex: Regularidade Fiscal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Cor de Identificação</label>
            <div className="grid grid-cols-4 gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`relative h-12 rounded-lg flex items-center justify-center transition-all ${c.bg} ${
                    color === c.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-105' : 'hover:opacity-90'
                  }`}
                  title={c.name}
                >
                  {color === c.id && <Check className="text-white drop-shadow-md" size={20} />}
                </button>
              ))}
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

export default CategoryEditModal;
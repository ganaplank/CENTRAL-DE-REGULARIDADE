import React from 'react';
import { ExternalLink, Edit2, Trash2, Globe } from 'lucide-react';
import { LinkItem, CardDensity } from '../types';

interface LinkCardProps {
  item: LinkItem;
  color: string;
  isEditMode: boolean;
  density?: CardDensity;
  onEdit: (item: LinkItem) => void;
  onDelete: (id: string) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ item, color, isEditMode, density = 'normal', onEdit, onDelete }) => {
  
  const getIconContainer = (colorKey: string) => {
     const map: Record<string, string> = {
      emerald: 'bg-emerald-100 text-emerald-600',
      blue: 'bg-blue-100 text-blue-600',
      rose: 'bg-rose-100 text-rose-600',
      amber: 'bg-amber-100 text-amber-600',
      purple: 'bg-purple-100 text-purple-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      cyan: 'bg-cyan-100 text-cyan-600',
      slate: 'bg-slate-100 text-slate-600',
    };
    return map[colorKey] || map.blue;
  };

  // Density configurations
  const styles = {
    compact: {
      padding: 'p-2',
      iconBox: 'w-8 h-8 text-base mr-3',
      title: 'text-xs',
      subtext: 'text-[10px]',
      iconSize: 16
    },
    normal: {
      padding: 'p-4',
      iconBox: 'w-12 h-12 text-xl mr-4',
      title: 'text-sm',
      subtext: 'text-xs',
      iconSize: 20
    },
    relaxed: {
      padding: 'p-6',
      iconBox: 'w-14 h-14 text-2xl mr-5',
      title: 'text-base',
      subtext: 'text-sm',
      iconSize: 24
    }
  };

  const currentStyle = styles[density];

  return (
    <div className={`relative group flex items-center ${currentStyle.padding} bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md ${isEditMode ? 'border-dashed border-slate-400' : 'hover:-translate-y-1'}`}>
      
      {/* Icon Container */}
      <div className={`flex-shrink-0 flex items-center justify-center rounded-lg ${currentStyle.iconBox} ${getIconContainer(color)}`}>
        {item.icon || <Globe size={currentStyle.iconSize} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`${currentStyle.title} font-semibold text-slate-800 truncate`} title={item.name}>
          {item.name}
        </h3>
        <p className={`${currentStyle.subtext} text-slate-500 truncate`}>{new URL(item.url).hostname}</p>
      </div>

      {/* Action Button (Normal Mode) */}
      {!isEditMode && (
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ExternalLink size={18} />
        </a>
      )}

      {/* Edit Controls (Edit Mode) */}
      {isEditMode && (
        <div className="flex items-center space-x-1 ml-2">
          <button 
            onClick={() => onEdit(item)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button 
             onClick={() => onDelete(item.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LinkCard;
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Settings, 
  Plus, 
  FileText, 
  ShieldCheck, 
  RotateCcw,
  Download,
  Upload,
  GripVertical,
  Edit2,
  Layout
} from 'lucide-react';
import { AppData, Category, LinkItem, LayoutSettings } from './types';
import { DEFAULT_DATA } from './constants';
import LinkCard from './components/LinkCard';
import EditModal from './components/EditModal';
import CategoryEditModal from './components/CategoryEditModal';
import LayoutModal from './components/LayoutModal';
import LoadingOverlay from './components/LoadingOverlay';
import Toast from './components/Toast';

const STORAGE_KEY = 'central_juridica_data';
const NOTES_KEY = 'central_juridica_notes';
const LAYOUT_KEY = 'central_juridica_layout';

const DEFAULT_LAYOUT: LayoutSettings = {
  columns: 4,
  density: 'normal'
};

function App() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [layout, setLayout] = useState<LayoutSettings>(DEFAULT_LAYOUT);
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for Toast Notification
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  // State for link modal editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<LinkItem | null>(null);

  // State for category modal editing
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // State for layout modal
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);

  // State for Drag and Drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Ref for file upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from local storage on mount with artificial delay for UX
  useEffect(() => {
    const loadData = async () => {
      // Small delay to prevent flickering and show the polished loader
      await new Promise(resolve => setTimeout(resolve, 800));

      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedNotes = localStorage.getItem(NOTES_KEY);
      const savedLayout = localStorage.getItem(LAYOUT_KEY);

      if (savedData) {
        try {
          setData(JSON.parse(savedData));
        } catch (e) {
          console.error("Failed to parse saved data", e);
        }
      }

      if (savedLayout) {
        try {
          setLayout(JSON.parse(savedLayout));
        } catch (e) {
           console.error("Failed to parse layout", e);
        }
      }
      
      if (savedNotes) {
        setNotes(savedNotes);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
    }
  }, [data, layout, isLoading]);

  // Save notes to local storage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(NOTES_KEY, notes);
    }
  }, [notes, isLoading]);

  // Helper for Toast
  const showToast = (message: string) => {
    setToast({ show: true, message });
  };

  // CRUD Operations - Links
  const handleAddItem = (categoryId: string) => {
    setEditingCategory(categoryId);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (categoryId: string, item: LinkItem) => {
    setEditingCategory(categoryId);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    if (confirm('Tem certeza que deseja excluir este link?')) {
      setData(prev => prev.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, items: cat.items.filter(item => item.id !== itemId) };
        }
        return cat;
      }));
      showToast('Link removido com sucesso.');
    }
  };

  const handleSaveItem = (item: LinkItem) => {
    if (!editingCategory) return;

    const isNew = !editingItem;

    setData(prev => prev.map(cat => {
      if (cat.id === editingCategory) {
        const exists = cat.items.find(i => i.id === item.id);
        if (exists) {
          // Update
          return {
            ...cat,
            items: cat.items.map(i => i.id === item.id ? item : i)
          };
        } else {
          // Add new
          return {
            ...cat,
            items: [...cat.items, item]
          };
        }
      }
      return cat;
    }));
    
    showToast(isNew ? 'Novo link adicionado!' : 'Link atualizado com sucesso!');
  };

  // CRUD Operations - Categories
  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setIsCategoryModalOpen(true);
  };

  const handleUpdateCategory = (id: string, title: string, color: string) => {
    setData(prev => prev.map(cat => 
      cat.id === id ? { ...cat, title, color } : cat
    ));
    setIsCategoryModalOpen(false);
    showToast('Categoria atualizada!');
  };

  const handleReset = () => {
    if (confirm('Isso restaurará os links originais e apagará suas customizações. Continuar?')) {
      setIsLoading(true);
      setTimeout(() => {
        setData(DEFAULT_DATA);
        setLayout(DEFAULT_LAYOUT);
        setIsEditMode(false);
        setIsLoading(false);
        showToast('Configurações restauradas.');
      }, 800);
    }
  };

  // Import/Export Logic
  const handleExport = () => {
    const backup = {
      data,
      layout
    };
    const dataStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'backup_links_juridicos.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Backup baixado com sucesso!');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        try {
          if (event.target?.result) {
            const parsed = JSON.parse(event.target.result as string);
            
            // Check if it's new backup format (with layout) or legacy (just data array)
            if (Array.isArray(parsed)) {
                // Legacy
                if(parsed[0]?.items) setData(parsed);
            } else if (parsed.data && Array.isArray(parsed.data)) {
                // New Format
                setData(parsed.data);
                if (parsed.layout) setLayout(parsed.layout);
            } else {
               throw new Error("Invalid Format");
            }
            showToast('Dados importados com sucesso!');
          }
        } catch (error) {
          alert('Formato de arquivo inválido ou corrompido.');
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  // Drag and Drop Logic
  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Required for Firefox
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const onDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newData = [...data];
    const [movedItem] = newData.splice(draggedIndex, 1);
    newData.splice(dropIndex, 0, movedItem);

    setData(newData);
    setDraggedIndex(null);
  };

  const onDragEnd = () => {
    setDraggedIndex(null);
  };

  // Helper to get grid class based on layout setting
  const getGridClass = () => {
    switch(layout.columns) {
      case 2: return 'sm:grid-cols-2';
      case 3: return 'sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'sm:grid-cols-2 lg:grid-cols-4';
      case 5: return 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
      default: return 'sm:grid-cols-2 lg:grid-cols-4';
    }
  };

  // Filter logic
  const filteredData = data.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.url.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0 || isEditMode); // Show empty cats in edit mode

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans relative">
      
      {isLoading && <LoadingOverlay message="Atualizando base de dados..." />}

      <Toast 
        message={toast.message} 
        isVisible={toast.show} 
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />

      {/* Hidden File Input for Import */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden" 
        accept=".json"
      />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
            
            {/* Logo area */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg text-white">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">Central de Regularidade</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">Gestão de Portais Jurídicos e Fiscais</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-full md:max-w-md relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                type="text"
                placeholder="Buscar certidão, portal ou órgão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent text-slate-900 placeholder-slate-400 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isEditMode 
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 ring-offset-2' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Settings size={18} className={isEditMode ? 'animate-spin-slow' : ''} />
                {isEditMode ? 'Concluir Edição' : 'Gerenciar'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Admin Toolbar (Visible only in Edit Mode) */}
        {isEditMode && (
          <div className="mb-8 p-4 bg-slate-800 text-slate-100 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2">
              <Settings size={20} />
              <span className="font-semibold">Modo de Administração</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsLayoutModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-indigo-500 transition-colors text-sm">
                <Layout size={16} /> Aparência
              </button>
              <button onClick={handleImportClick} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-emerald-600 transition-colors text-sm">
                <Upload size={16} /> Importar
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-blue-600 transition-colors text-sm">
                <Download size={16} /> Backup
              </button>
              <div className="w-px h-8 bg-slate-600 mx-1"></div>
              <button onClick={handleReset} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-red-600 transition-colors text-sm">
                <RotateCcw size={16} /> Resetar
              </button>
            </div>
          </div>
        )}

        {filteredData.length === 0 && (
            <div className="text-center py-20">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Nenhum resultado encontrado</h3>
                <p className="text-slate-500">Tente buscar por outro termo.</p>
            </div>
        )}

        <div className="space-y-10">
          {filteredData.map((category, index) => (
            <section 
              key={category.id} 
              className={`animate-in fade-in duration-500 transition-all ${
                isEditMode ? 'p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-slate-50/50 cursor-move' : ''
              } ${draggedIndex === index ? 'opacity-40 scale-[0.99] border-blue-400 bg-blue-50' : ''}`}
              draggable={isEditMode}
              onDragStart={(e) => isEditMode && onDragStart(e, index)}
              onDragOver={onDragOver}
              onDrop={(e) => isEditMode && onDrop(e, index)}
              onDragEnd={onDragEnd}
            >
              <div className="flex items-center justify-between mb-5 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-3">
                    {/* Handle Icon for Dragging */}
                    {isEditMode && (
                        <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-500">
                           <GripVertical size={24} />
                        </div>
                    )}
                    <div className={`w-1.5 h-6 rounded-full bg-${category.color}-500`}></div>
                    <h2 className="text-xl font-bold text-slate-800">{category.title}</h2>
                    
                    {/* Edit Category Button */}
                    {isEditMode && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleEditCategory(category); }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors ml-1"
                            title="Editar Categoria"
                        >
                            <Edit2 size={16} />
                        </button>
                    )}

                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {category.items.length}
                    </span>
                </div>
                {isEditMode && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAddItem(category.id); }}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    <Plus size={16} /> Adicionar Link
                  </button>
                )}
              </div>
              
              <div className={`grid grid-cols-1 gap-5 ${getGridClass()}`}>
                {category.items.map((item) => (
                  <LinkCard 
                    key={item.id} 
                    item={item} 
                    color={category.color}
                    isEditMode={isEditMode}
                    density={layout.density}
                    onEdit={(itm) => handleEditItem(category.id, itm)}
                    onDelete={(id) => handleDeleteItem(category.id, id)}
                  />
                ))}
                {isEditMode && category.items.length === 0 && (
                    <div 
                        onClick={() => handleAddItem(category.id)}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all text-slate-400 hover:text-blue-500 h-24"
                    >
                        <Plus size={24} />
                        <span className="text-sm font-medium mt-1">Adicionar Link</span>
                    </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Sticky Notepad */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-xl shadow-2xl border border-slate-200 w-80 overflow-hidden group transition-all duration-300 translate-y-0 hover:-translate-y-1">
          <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span className="text-sm font-semibold">Bloco de Notas (CNPJs)</span>
            </div>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 p-3 text-sm text-slate-700 resize-none outline-none bg-yellow-50/30 focus:bg-white transition-colors font-mono"
            placeholder="Cole CNPJs ou anotações rápidas aqui..."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Central de Regularidade Corporativa. </p>
          <p className="mt-1 text-xs">Dados salvos localmente no seu navegador.</p>
        </div>
      </footer>

      {/* Modals */}
      <EditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveItem}
        initialData={editingItem}
        // CategoryId removed
      />

      <CategoryEditModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleUpdateCategory}
        initialData={categoryToEdit}
      />

      <LayoutModal 
        isOpen={isLayoutModalOpen}
        onClose={() => setIsLayoutModalOpen(false)}
        settings={layout}
        onSave={setLayout}
      />

    </div>
  );
}

export default App;

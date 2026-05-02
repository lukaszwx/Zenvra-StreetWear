import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { 
  Search, 
  Clock, 
  TrendingUp, 
  X, 
  ChevronDown,
  Sparkles,
  Filter,
  ArrowRight
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

function AdvancedSearch({ products, onSearch, onFilter, className = "" }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches] = useState([
    "Nike Air Max", "Yeezy Boost", "Jordan Retro", "Adidas Ultraboost",
    "New Balance 550", "Converse Chuck 70", "Vans Old Skool", "Puma Suede"
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showFilters, setShowFilters] = useState(false);
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const toast = useToast();

  // Carregar searches recentes do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('zenvra-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (err) {
        console.error('Erro ao carregar searches recentes:', err);
      }
    }
  }, []);

  // Salvar searches recentes
  const saveRecentSearch = useCallback((search) => {
    if (!search.trim()) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== search);
      const updated = [search, ...filtered].slice(0, 5);
      localStorage.setItem('zenvra-recent-searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Gerar sugestões baseadas nos produtos
  const generateSuggestions = useCallback((searchQuery) => {
    if (!searchQuery.trim() || !products.length) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const suggestions = new Set();

    products.forEach(product => {
      // Nome do produto
      if (product.name.toLowerCase().includes(query)) {
        suggestions.add(product.name);
      }

      // Categoria
      if (product.category && product.category.toLowerCase().includes(query)) {
        suggestions.add(product.category);
      }

      // Marcas (se existirem no nome)
      const brands = ['nike', 'adidas', 'puma', 'new balance', 'converse', 'vans', 'jordan', 'yeezy'];
      brands.forEach(brand => {
        if (query.includes(brand) || product.name.toLowerCase().includes(brand)) {
          suggestions.add(brand.charAt(0).toUpperCase() + brand.slice(1));
        }
      });

      // Tamanhos populares
      if (product.sizes) {
        product.sizes.forEach(size => {
          if (query.includes(size)) {
            suggestions.add(`Tamanho ${size}`);
          }
        });
      }
    });

    return Array.from(suggestions).slice(0, 8);
  }, [products]);

  // Atualizar sugestões quando query mudar
  useEffect(() => {
    if (query.length > 0) {
      const newSuggestions = generateSuggestions(query);
      setSuggestions(newSuggestions);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, generateSuggestions]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length + recentSearches.length + trendingSearches.length - 1 
            ? prev + 1 
            : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(getSuggestionByIndex(selectedIndex));
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, selectedIndex, suggestions, recentSearches, trendingSearches]);

  const getSuggestionByIndex = (index) => {
    const totalRecent = recentSearches.length;
    const totalTrending = trendingSearches.length;
    
    if (index < totalRecent) {
      return recentSearches[index];
    } else if (index < totalRecent + totalTrending) {
      return trendingSearches[index - totalRecent];
    } else {
      return suggestions[index - totalRecent - totalTrending];
    }
  };

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;

    saveRecentSearch(query);
    onSearch?.(query);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    toast.info(`Buscando por "${query}"...`, {
      duration: 2000
    });
  }, [query, onSearch, saveRecentSearch, toast]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setQuery(suggestion);
    saveRecentSearch(suggestion);
    onSearch?.(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    toast.success(`Buscando por "${suggestion}"`, {
      duration: 2000
    });
  }, [onSearch, saveRecentSearch, toast]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('zenvra-recent-searches');
    toast.info("Histórico de buscas limpo", {
      duration: 2000
    });
  }, [toast]);

  const handleQuickFilter = useCallback((filter) => {
    onFilter?.(filter);
    setShowFilters(false);
    toast.info(`Filtro aplicado: ${filter}`, {
      duration: 2000
    });
  }, [onFilter, toast]);

  // Animações GSAP
  useEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      // Dropdown animation
      gsap.fromTo(dropdownRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" }
      );

      // Items stagger
      const items = dropdownRef.current?.querySelectorAll('[data-search-item]');
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, x: -20 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.2, 
            ease: "power2.out",
            stagger: 0.05
          }
        );
      }
    }, searchRef);

    return () => ctx.revert();
  }, [isOpen]);

  const renderSuggestionItem = (suggestion, index, icon, type) => {
    const isSelected = selectedIndex === index;
    
    return (
      <div
        key={`${type}-${suggestion}`}
        data-search-item
        onClick={() => handleSuggestionClick(suggestion)}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all rounded-xl ${
          isSelected 
            ? 'bg-emerald-400/20 text-emerald-400' 
            : 'hover:bg-zinc-800/50 text-white'
        }`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-700/50">
          {icon}
        </div>
        <span className="flex-1 text-sm font-medium">{suggestion}</span>
        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar produtos, marcas, categorias..."
          className="w-full pl-12 pr-12 py-4 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400/50 transition-all"
        />
        
        {/* Quick Actions */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-800/50 transition-colors"
            >
              <X className="h-4 w-4 text-zinc-400" />
            </button>
          )}
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-800/50 transition-colors"
          >
            <Filter className="h-4 w-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          style={{ maxHeight: '400px', overflowY: 'auto' }}
        >
          <div className="p-2">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                    <Clock className="h-3 w-3" />
                    Buscas recentes
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Limpar
                  </button>
                </div>
                {recentSearches.map((search, index) => 
                  renderSuggestionItem(search, index, <Clock className="h-4 w-4" />, 'recent')
                )}
              </div>
            )}

            {/* Trending Searches */}
            <div className="mb-2">
              <div className="flex items-center gap-2 px-2 py-1">
                <TrendingUp className="h-3 w-3 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-400">Em alta</span>
              </div>
              {trendingSearches.map((search, index) => 
                renderSuggestionItem(
                  search, 
                  recentSearches.length + index, 
                  <TrendingUp className="h-4 w-4" />, 
                  'trending'
                )
              )}
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-2 py-1">
                  <Sparkles className="h-3 w-3 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-400">Sugestões</span>
                </div>
                {suggestions.map((suggestion, index) => 
                  renderSuggestionItem(
                    suggestion, 
                    recentSearches.length + trendingSearches.length + index, 
                    <Search className="h-4 w-4" />, 
                    'suggestion'
                  )
                )}
              </div>
            )}

            {/* No results */}
            {query && suggestions.length === 0 && recentSearches.length === 0 && (
              <div className="px-4 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/50 mx-auto mb-3">
                  <Search className="h-6 w-6 text-zinc-500" />
                </div>
                <p className="text-sm text-zinc-400">Nenhum resultado encontrado</p>
                <p className="text-xs text-zinc-500 mt-1">Tente outros termos</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 z-40 rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Filtros rápidos</span>
            <button
              onClick={() => setShowFilters(false)}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-800/50 transition-colors"
            >
              <X className="h-3 w-3 text-zinc-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {['Sneakers', 'Roupas', 'Acessórios', 'Promoções'].map(filter => (
              <button
                key={filter}
                onClick={() => handleQuickFilter(filter)}
                className="px-3 py-2 text-sm border border-white/10 bg-zinc-800/50 rounded-lg hover:bg-emerald-400/10 hover:border-emerald-400/30 hover:text-emerald-400 transition-all"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedSearch;

import React, { useState, useMemo } from 'react';
import { recipesData, Recipe } from '../data/ebookData';
import { Search, Filter, Clock, Utensils, Bookmark, BookmarkCheck, ArrowRight, Sparkles, X, Check, Cookie, Coffee, Wine, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeCatalogProps {
  onOpenRecipeModal: (recipe: Recipe) => void;
  savedBookmarkIds: string[];
  toggleBookmark: (recipeId: string) => void;
}

export type ProductCategory = 'all' | 'selai' | 'jajanan' | 'minuman' | 'nastar' | 'pastry';

export const RecipeCatalog: React.FC<RecipeCatalogProps> = ({
  onOpenRecipeModal,
  savedBookmarkIds,
  toggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Product Category Definitions with icons and metadata
  const categoryChips = useMemo(() => [
    {
      id: 'all' as ProductCategory,
      label: 'Semua Produk',
      shortLabel: 'Semua',
      icon: Sparkles,
      iconEmoji: '✨',
      description: 'Seluruh resep olahan apel Anna',
    },
    {
      id: 'selai' as ProductCategory,
      label: 'Selai Apel',
      shortLabel: 'Selai',
      icon: ChefHat,
      iconEmoji: '🍯',
      description: 'Selai dasar & olesan buah murni',
    },
    {
      id: 'jajanan' as ProductCategory,
      label: 'Jajanan & Kue',
      shortLabel: 'Jajanan',
      icon: Cookie,
      iconEmoji: '🍪',
      description: 'Nastar apel, pastry tartlet & snack box',
    },
    {
      id: 'minuman' as ProductCategory,
      label: 'Minuman Segar',
      shortLabel: 'Minuman',
      icon: Coffee,
      iconEmoji: '🍹',
      description: 'Es teh selai apel & sparkling drink',
    },
  ], []);

  // Calculate counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: recipesData.length,
      selai: 0,
      jajanan: 0,
      minuman: 0,
      nastar: 0,
      pastry: 0,
    };

    recipesData.forEach((r) => {
      if (r.category === 'dasar' || (r.category as string) === 'selai') {
        counts.selai += 1;
      }
      if (r.category === 'nastar' || r.category === 'pastry' || (r.category as string) === 'jajanan') {
        counts.jajanan += 1;
      }
      if (r.category === 'nastar') counts.nastar += 1;
      if (r.category === 'pastry') counts.pastry += 1;
      if (r.category === 'minuman') counts.minuman += 1;
    });

    return counts;
  }, []);

  const isRecipeInCategory = (recipe: Recipe, cat: ProductCategory): boolean => {
    if (cat === 'all') return true;
    if (cat === 'selai') {
      return recipe.category === 'dasar' || (recipe.category as string) === 'selai';
    }
    if (cat === 'jajanan') {
      return recipe.category === 'nastar' || recipe.category === 'pastry' || (recipe.category as string) === 'jajanan';
    }
    if (cat === 'minuman') {
      return recipe.category === 'minuman';
    }
    if (cat === 'nastar') {
      return recipe.category === 'nastar';
    }
    if (cat === 'pastry') {
      return recipe.category === 'pastry';
    }
    return false;
  };

  const filteredRecipes = useMemo(() => {
    return recipesData.filter((recipe) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        recipe.title.toLowerCase().includes(q) ||
        recipe.subtitle.toLowerCase().includes(q) ||
        recipe.categoryLabel.toLowerCase().includes(q) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(q));

      const matchesCategory = isRecipeInCategory(recipe, selectedCategory);

      const matchesDifficulty =
        selectedDifficulty === 'all' || recipe.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 dark:from-slate-900 dark:via-red-950 dark:to-slate-900 text-red-50 dark:text-slate-100 p-8 sm:p-10 rounded-3xl shadow-xl border border-red-700/50 dark:border-slate-800 relative overflow-hidden transition-colors">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-800/80 dark:bg-slate-800/90 text-rose-200 dark:text-amber-300 text-xs font-semibold border border-red-700/50 dark:border-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Katalog Kreasi & Diversifikasi Produk Olahan Apel</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Katalog Resep Selai Apel Anna
          </h2>
          <p className="text-sm sm:text-base text-rose-200 dark:text-slate-300 font-sans leading-relaxed">
            Gunakan filter kategori di bawah untuk menjelajahi berbagai macam diversifikasi produk selai apel Desa Sumbergondo: dari <strong>Selai Murni</strong>, <strong>Jajanan & Kue Kering</strong>, hingga <strong>Minuman Segar</strong>.
          </p>
        </div>
      </div>

      {/* FILTER CHIPS SECTION */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-red-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        {/* Chips Header & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-slate-800 text-red-900 dark:text-amber-400 flex items-center justify-center font-bold">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-red-950 dark:text-slate-100">
                Filter Kategori Produk
              </h3>
              <p className="text-xs text-red-800/80 dark:text-slate-400">
                Pilih jenis olahan produk apel untuk menyaring resep
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-red-700 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari resep, bahan, atau kue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-red-200 dark:border-slate-700 bg-rose-50/50 dark:bg-slate-800 text-red-950 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder-red-400/70 dark:placeholder-slate-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-700 dark:text-slate-300 bg-red-100 dark:bg-slate-700 hover:bg-red-200 dark:hover:bg-slate-600 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Primary Filter Chips */}
        <div className="pt-2 border-t border-red-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2.5">
            {categoryChips.map((chip) => {
              const isSelected = selectedCategory === chip.id;
              const count = categoryCounts[chip.id] ?? 0;
              const IconComponent = chip.icon;

              return (
                <button
                  key={chip.id}
                  id={`filter-chip-${chip.id}`}
                  onClick={() => setSelectedCategory(chip.id)}
                  className={`group relative px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center space-x-2.5 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-red-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-md ring-2 ring-red-800/40 dark:ring-amber-300 scale-[1.02]'
                      : 'bg-rose-50/70 dark:bg-slate-800/90 text-red-950 dark:text-slate-200 border border-red-200/90 dark:border-slate-700 hover:bg-rose-100 dark:hover:bg-slate-750 hover:border-red-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="text-base leading-none">{chip.iconEmoji}</span>
                  <span className="font-serif tracking-tight text-sm font-bold">
                    {chip.label}
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                      isSelected
                        ? 'bg-white/20 dark:bg-slate-900/30 text-white dark:text-slate-950'
                        : 'bg-red-200/70 dark:bg-slate-700 text-red-900 dark:text-amber-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-Filters / Tags row (Nastar, Pastry, Difficulty) */}
          <div className="mt-3.5 pt-3 border-t border-dashed border-red-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-red-800 dark:text-slate-400 font-semibold mr-1">
                Sub-Kategori:
              </span>
              <button
                onClick={() => setSelectedCategory('selai')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'selai'
                    ? 'bg-red-800 dark:bg-amber-500 text-white dark:text-slate-950 font-bold'
                    : 'bg-red-50 dark:bg-slate-800 text-red-800 dark:text-slate-300 hover:bg-red-100'
                }`}
              >
                🍯 Selai Murni
              </button>
              <button
                onClick={() => setSelectedCategory('nastar')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'nastar'
                    ? 'bg-red-800 dark:bg-amber-500 text-white dark:text-slate-950 font-bold'
                    : 'bg-red-50 dark:bg-slate-800 text-red-800 dark:text-slate-300 hover:bg-red-100'
                }`}
              >
                🍪 Nastar Apel
              </button>
              <button
                onClick={() => setSelectedCategory('pastry')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'pastry'
                    ? 'bg-red-800 dark:bg-amber-500 text-white dark:text-slate-950 font-bold'
                    : 'bg-red-50 dark:bg-slate-800 text-red-800 dark:text-slate-300 hover:bg-red-100'
                }`}
              >
                🥧 Pie & Tartlet
              </button>
              <button
                onClick={() => setSelectedCategory('minuman')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'minuman'
                    ? 'bg-red-800 dark:bg-amber-500 text-white dark:text-slate-950 font-bold'
                    : 'bg-red-50 dark:bg-slate-800 text-red-800 dark:text-slate-300 hover:bg-red-100'
                }`}
              >
                🍹 Apple Jam Tea
              </button>
            </div>

            {/* Active filter reset indicator */}
            {(selectedCategory !== 'all' || searchQuery || selectedDifficulty !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSelectedDifficulty('all');
                }}
                className="text-red-700 dark:text-amber-400 hover:text-red-900 dark:hover:text-amber-300 font-bold inline-flex items-center space-x-1 hover:underline cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Status Bar */}
      <div className="flex items-center justify-between text-xs text-red-800 dark:text-slate-400 px-1">
        <div>
          Menampilkan <strong className="text-red-950 dark:text-amber-400 font-bold">{filteredRecipes.length}</strong> resep olahan
          {selectedCategory !== 'all' && (
            <span>
              {' '}dalam kategori <strong className="text-red-950 dark:text-slate-200 capitalize font-bold">"{selectedCategory}"</strong>
            </span>
          )}
          {searchQuery && (
            <span>
              {' '}dengan kata kunci <strong className="text-red-950 dark:text-slate-200 font-bold">"{searchQuery}"</strong>
            </span>
          )}
        </div>
        <div className="hidden sm:block">
          Disesuaikan untuk potensi UMKM Desa Sumbergondo
        </div>
      </div>

      {/* Recipe Cards Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-red-300 dark:border-slate-800 p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-slate-800 text-red-800 dark:text-amber-400 flex items-center justify-center text-2xl mx-auto">
            🔍
          </div>
          <h3 className="font-serif font-bold text-lg text-red-950 dark:text-slate-100">Resep Tidak Ditemukan</h3>
          <p className="text-sm text-red-800 dark:text-slate-400 max-w-md mx-auto">
            Tidak ada resep yang cocok dengan kategori atau kata kunci yang Anda pilih. Silakan gunakan filter kategori lain.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            className="px-4 py-2 rounded-xl bg-red-800 dark:bg-amber-500 text-red-100 dark:text-slate-950 font-bold text-xs hover:bg-red-900 dark:hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Tampilkan Semua Resep
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => {
            const isBookmarked = savedBookmarkIds.includes(recipe.id);
            return (
              <div
                key={recipe.id}
                id={`recipe-card-${recipe.id}`}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-red-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Image Header */}
                <div className="relative aspect-video overflow-hidden bg-rose-100 dark:bg-slate-800">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-red-900/90 dark:bg-slate-900/90 backdrop-blur-md text-red-100 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-red-700/50 dark:border-slate-700 whitespace-nowrap">
                    {recipe.categoryLabel}
                  </span>

                  {/* Bookmark Button with Pop Animation & Tactile Feedback */}
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        try { navigator.vibrate([15, 25, 20]); } catch (_) {}
                      }
                      toggleBookmark(recipe.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-all z-10 cursor-pointer overflow-hidden ${
                      isBookmarked
                        ? 'bg-amber-400 text-red-950 ring-2 ring-amber-300 shadow-amber-500/30'
                        : 'bg-white/90 dark:bg-slate-800/90 text-red-900 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg'
                    }`}
                    title={isBookmarked ? 'Hapus dari Favorit' : 'Simpan Resep ke Favorit'}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {isBookmarked ? (
                        <motion.div
                          key="cat-bookmarked-pop"
                          initial={{ scale: 0.4, rotate: -15 }}
                          animate={{
                            scale: [0.4, 1.45, 0.88, 1.15, 1],
                            rotate: [0, -12, 12, -6, 0],
                          }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                          className="relative flex items-center justify-center"
                        >
                          <BookmarkCheck className="w-4 h-4 text-red-950 fill-red-950" />
                          {/* Expanding Ripple Ring */}
                          <motion.span
                            initial={{ scale: 0.6, opacity: 0.9 }}
                            animate={{ scale: 2.4, opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="absolute inset-0 rounded-full border-2 border-amber-300 pointer-events-none"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="cat-unbookmarked-state"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.8 }}
                          className="flex items-center justify-center"
                        >
                          <Bookmark className="w-4 h-4 text-red-800 dark:text-slate-300" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{recipe.cookTime}</span>
                    </span>
                    <span className="bg-red-600/90 dark:bg-amber-500 text-white dark:text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-xl text-red-950 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-amber-400 transition-colors leading-snug">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-red-900/80 dark:text-slate-400 font-sans line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {recipe.tags.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(tag);
                        }}
                        className="text-[10px] font-semibold bg-rose-100/80 dark:bg-slate-800 text-red-900 dark:text-slate-300 px-2 py-0.5 rounded-md hover:bg-rose-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title={`Cari produk dengan tag #${tag}`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>

                  {/* Yield & Button */}
                  <div className="pt-3 border-t border-red-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-red-900 dark:text-amber-300 bg-rose-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-red-200 dark:border-slate-700">
                      📦 {recipe.yields}
                    </span>

                    <button
                      onClick={() => onOpenRecipeModal(recipe)}
                      className="flex items-center space-x-1 text-xs font-bold text-red-900 dark:text-amber-400 hover:text-red-700 dark:hover:text-amber-300 group/btn cursor-pointer"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Lihat Resep</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

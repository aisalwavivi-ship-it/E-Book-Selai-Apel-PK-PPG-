import React, { useState } from 'react';
import { recipesData, Recipe } from '../data/ebookData';
import { X, BookmarkCheck, Utensils, Trash2, ArrowRight, WifiOff, CheckCircle2, RefreshCw, HardDriveDownload, Sparkles, ShieldCheck } from 'lucide-react';
import { precacheAllEbookAssets, getOfflineCacheTimestamp } from '../utils/offlineManager';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedBookmarkIds: string[];
  toggleBookmark: (recipeId: string) => void;
  onOpenRecipeModal: (recipe: Recipe) => void;
  isOnline?: boolean;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  savedBookmarkIds,
  toggleBookmark,
  onOpenRecipeModal,
  isOnline = true,
}) => {
  const [isCaching, setIsCaching] = useState<boolean>(false);
  const [cacheSuccessMsg, setCacheSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const bookmarkedRecipes = recipesData.filter((r) => savedBookmarkIds.includes(r.id));
  const cacheTimestamp = getOfflineCacheTimestamp();

  const handlePrecacheOffline = async () => {
    setIsCaching(true);
    setCacheSuccessMsg(null);
    try {
      const result = await precacheAllEbookAssets();
      if (result.success) {
        setCacheSuccessMsg('E-book & resep berhasil disinkronkan ke cache offline!');
        setTimeout(() => setCacheSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.error('Error precaching:', e);
    } finally {
      setIsCaching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-red-950/70 dark:bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 no-print">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-red-300 dark:border-slate-800 transition-colors">
        {/* Drawer Header */}
        <div className="p-5 bg-red-900 dark:bg-slate-950 text-red-50 border-b border-red-800 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-lg text-white leading-tight">
                Resep Tersimpan ({bookmarkedRecipes.length})
              </h3>
              <p className="text-[11px] text-red-200 dark:text-slate-400">
                Penyimpanan Lokal Perangkat (Offline Ready)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-red-800 dark:bg-slate-800 hover:bg-red-700 dark:hover:bg-slate-700 text-red-200 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Status Card */}
        <div className="p-4 bg-amber-50/70 dark:bg-slate-800/60 border-b border-amber-200/80 dark:border-slate-700 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-bold text-red-950 dark:text-slate-200">
                {isOnline ? 'Status Jaringan: Online' : 'Status Jaringan: Offline'}
              </span>
            </div>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Offline Ready</span>
            </span>
          </div>

          <p className="text-[11px] text-red-900/90 dark:text-slate-300 leading-relaxed">
            Seluruh konten e-book, takaran resep, timer, dan bookmark Anda disimpan di memori lokal peramban sehingga tetap dapat dibuka tanpa sambungan internet.
          </p>

          <div className="pt-1 flex items-center justify-between">
            <button
              onClick={handlePrecacheOffline}
              disabled={isCaching}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-900 dark:bg-slate-700 hover:bg-red-800 dark:hover:bg-slate-600 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isCaching ? 'animate-spin' : ''}`} />
              <span>{isCaching ? 'Menyinkronkan Cache...' : 'Perbarui Cache Offline'}</span>
            </button>

            {cacheTimestamp && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                Cache: {new Date(cacheTimestamp).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {cacheSuccessMsg && (
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 text-[11px] rounded-lg flex items-center space-x-1.5 font-medium animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>{cacheSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Drawer List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {bookmarkedRecipes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-slate-800 text-red-800 dark:text-amber-400 flex items-center justify-center text-xl mx-auto">
                🔖
              </div>
              <h4 className="font-serif font-bold text-red-950 dark:text-slate-100 text-base">
                Belum Ada Resep Tersimpan
              </h4>
              <p className="text-xs text-red-800 dark:text-slate-400">
                Klik ikon penanda (bookmark) pada halaman resep atau katalog resep untuk menyimpannya di sini.
              </p>
            </div>
          ) : (
            bookmarkedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-rose-50/60 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-red-200 dark:border-slate-700 flex items-center space-x-3 group hover:bg-rose-100/60 dark:hover:bg-slate-800 transition-colors"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-red-300 dark:border-slate-600"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <h5 className="font-serif font-bold text-sm text-red-950 dark:text-slate-100 truncate">
                    {recipe.title}
                  </h5>
                  <div className="flex items-center space-x-2">
                    <span className="inline-block text-[10px] font-bold text-red-800 dark:text-amber-300 bg-red-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                      {recipe.yields}
                    </span>
                    <span className="text-[9.5px] text-emerald-700 dark:text-emerald-400 font-bold">
                      ✓ Offline Ready
                    </span>
                  </div>
                  <div className="pt-1 flex items-center space-x-2 text-xs">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenRecipeModal(recipe);
                      }}
                      className="font-bold text-red-900 dark:text-amber-400 hover:text-red-700 dark:hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                    >
                      <Utensils className="w-3 h-3" />
                      <span>Buka Resep</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => toggleBookmark(recipe.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors cursor-pointer"
                  title="Hapus bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-rose-50 dark:bg-slate-950 border-t border-red-200 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-red-900 dark:bg-slate-800 text-red-100 dark:text-slate-200 hover:bg-red-800 dark:hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

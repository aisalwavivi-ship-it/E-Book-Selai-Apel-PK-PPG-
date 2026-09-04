import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FlipbookReader } from './components/FlipbookReader';
import { RecipeCatalog } from './components/RecipeCatalog';
import { RecipeModal } from './components/RecipeModal';
import { HppCalculator } from './components/HppCalculator';
import { PackagingGuide } from './components/PackagingGuide';
import { TeamInfoModal } from './components/TeamInfoModal';
import { QrShareModal } from './components/QrShareModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { PrintBookLayout } from './components/PrintBookLayout';
import { PdfExportProgressBar, PdfExportProgressState } from './components/PdfExportProgressBar';
import { generateHighQualityBookPdf } from './utils/exportPdf';
import { Recipe } from './data/ebookData';
import { Heart, WifiOff, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOfflineStatus } from './utils/offlineManager';
import sweetAppleBgImg from './assets/images/user_sticker_pattern_1788317301564.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<'flipbook' | 'catalog' | 'hpp' | 'packaging' | 'team'>('flipbook');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Global Theme State ('warm' | 'dark')
  const [theme, setTheme] = useState<'warm' | 'dark'>(() => {
    try {
      const storedTheme = localStorage.getItem('sumbergondo_theme');
      if (storedTheme === 'dark' || storedTheme === 'warm') {
        return storedTheme;
      }
      return 'warm';
    } catch {
      return 'warm';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sumbergondo_theme', theme);
    } catch (e) {
      console.error('Failed to save theme setting:', e);
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'warm');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'warm' ? 'dark' : 'warm'));
  };

  // Bookmarks state with localStorage persistence
  const [savedBookmarkIds, setSavedBookmarkIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sumbergondo_bookmarks');
      return stored ? JSON.parse(stored) : ['selai-apel-dasar', 'nastar-selai-apel'];
    } catch {
      return ['selai-apel-dasar', 'nastar-selai-apel'];
    }
  });

  // Offline status tracking hook
  const offlineStatus = useOfflineStatus(savedBookmarkIds);
  const [isOfflineBannerDismissed, setIsOfflineBannerDismissed] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('sumbergondo_bookmarks', JSON.stringify(savedBookmarkIds));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [savedBookmarkIds]);

  const toggleBookmark = (recipeId: string) => {
    setSavedBookmarkIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  // Modals & Drawers state
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);

  // PDF Export State for Direct 10-Page PDF Download
  const [pdfExportState, setPdfExportState] = useState<PdfExportProgressState>({
    isExporting: false,
    progressPercent: 0,
    statusText: '',
    currentPage: 0,
    totalPages: 10,
    documentTitle: 'Buku Resep Selai Apel dan Olahannya (10 Halaman Lengkap)',
    isCompleted: false,
  });

  const handleDownloadFullPdf = async () => {
    try {
      setPdfExportState({
        isExporting: true,
        progressPercent: 8,
        statusText: 'Menyiapkan berkas PDF e-book 10 halaman...',
        currentPage: 1,
        totalPages: 10,
        documentTitle: 'Buku Resep Selai Apel dan Olahannya (10 Halaman Lengkap)',
        isCompleted: false,
      });

      await generateHighQualityBookPdf({
        onProgress: (current, total, msg) => {
          const pct = Math.round((current / total) * 100);
          setPdfExportState({
            isExporting: true,
            progressPercent: pct,
            statusText: msg,
            currentPage: current,
            totalPages: total,
            documentTitle: 'Buku Resep Selai Apel dan Olahannya (10 Halaman Lengkap)',
            isCompleted: false,
          });
        },
      });

      setPdfExportState((prev) => ({
        ...prev,
        isExporting: false,
        progressPercent: 100,
        statusText: 'Berkas PDF E-Book 10 Halaman Berhasil Disimpan!',
        isCompleted: true,
      }));

      setTimeout(() => {
        setPdfExportState((prev) => ({ ...prev, isCompleted: false }));
      }, 4000);
    } catch (err) {
      console.error('Error exporting full PDF:', err);
      setPdfExportState((prev) => ({
        ...prev,
        isExporting: false,
        isCompleted: false,
      }));
      window.print();
    }
  };

  // Audio Narration State (Web Speech API)
  const [isAudioSpeaking, setIsAudioSpeaking] = useState<boolean>(false);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Maaf, peramban Anda belum mendukung fitur Web Speech Synth Suara Pembaca.');
      return;
    }

    if (isAudioSpeaking) {
      window.speechSynthesis.cancel();
      setIsAudioSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95; // Speech speed

    utterance.onend = () => setIsAudioSpeaking(false);
    utterance.onerror = () => setIsAudioSpeaking(false);

    setIsAudioSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleAudioNarration = () => {
    if (isAudioSpeaking) {
      window.speechSynthesis.cancel();
      setIsAudioSpeaking(false);
    } else {
      speakText("Selamat datang di Buku Resep Selai Apel dan Olahannya Desa Sumbergondo Bumiaji Kota Batu. Anda dapat menjelajahi resep selai apel, nastar apel, dan kalkulator profit UMKM.");
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/50 dark:bg-slate-950 text-red-950 dark:text-slate-100 flex flex-col justify-between selection:bg-red-300 dark:selection:bg-amber-400 dark:selection:text-slate-950 font-sans transition-colors duration-200 relative">
      {/* Global Sweet Apple Treats Wallpaper Background Layer (Soft Blurred & Subtle) */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none opacity-30 dark:opacity-10 overflow-hidden bg-rose-50/50 dark:bg-slate-950">
        <img
          src={sweetAppleBgImg}
          alt="Sweet Apple Background Pattern"
          className="w-full h-full object-cover object-center filter blur-[6px] scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-rose-50/60 dark:bg-slate-950/80 backdrop-blur-[1px]"></div>
      </div>

      {/* 1:1 High-Fidelity Print Layout (only rendered on window.print()) */}
      <PrintBookLayout />

      {/* Screen Interactive Layout (Hidden during print) */}
      <div className="no-print flex flex-col min-h-screen justify-between relative z-10">
        {/* Top Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAudioSpeaking={isAudioSpeaking}
          toggleAudioNarration={toggleAudioNarration}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenBookmarks={() => setIsBookmarksOpen(true)}
          onDownloadFullPdf={handleDownloadFullPdf}
          isDownloadingPdf={pdfExportState.isExporting}
          bookmarkCount={savedBookmarkIds.length}
          theme={theme}
          toggleTheme={toggleTheme}
          isOnline={offlineStatus.isOnline}
        />

        {/* Offline notification banner if user is offline */}
        {!offlineStatus.isOnline && !isOfflineBannerDismissed && (
          <div className="bg-amber-600 text-white text-xs px-4 py-2 flex items-center justify-between shadow-sm animate-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 shrink-0" />
              <span>
                <strong>Mode Offline Aktif:</strong> Anda sedang menjelajah tanpa internet. Seluruh e-book, resep, audio narasi, dan kalkulator tetap berfungsi penuh dari penyimpanan lokal perangkat.
              </span>
            </div>
            <button
              onClick={() => setIsOfflineBannerDismissed(true)}
              className="p-1 hover:bg-amber-700 rounded transition-colors text-amber-100"
              title="Tutup pesan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Tab Content with Smooth Dynamic Transition */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="w-full"
            >
              {activeTab === 'flipbook' && (
                <FlipbookReader
                  onOpenRecipeModal={(recipe) => setSelectedRecipe(recipe)}
                  savedBookmarkIds={savedBookmarkIds}
                  toggleBookmark={toggleBookmark}
                  speakText={speakText}
                />
              )}

              {activeTab === 'catalog' && (
                <RecipeCatalog
                  onOpenRecipeModal={(recipe) => setSelectedRecipe(recipe)}
                  savedBookmarkIds={savedBookmarkIds}
                  toggleBookmark={toggleBookmark}
                />
              )}

              {activeTab === 'hpp' && <HppCalculator />}

              {activeTab === 'packaging' && <PackagingGuide />}

              {activeTab === 'team' && <TeamInfoModal />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="bg-red-950 dark:bg-slate-900 text-red-200 dark:text-slate-300 py-6 px-4 border-t border-red-900 dark:border-slate-800 text-xs transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <p className="font-serif font-bold text-red-100 dark:text-amber-200 text-sm">
                Buku Resep Selai Apel dan Olahannya • Desa Sumbergondo, Bumiaji, Kota Batu
              </p>
              <p className="text-red-300/90 dark:text-slate-400 text-[11px]">
                Proyek Kepemimpinan PGSD Universitas Muhammadiyah Malang • Pembimbing: Dr. Anis Farida Jamil, M.Pd.
              </p>
            </div>

            <div className="flex items-center space-x-1 text-red-300 dark:text-slate-300 text-[11px]">
              <span>Dipersembahkan untuk UMKM & Masyarakat Desa Sumbergondo</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Real-time PDF Export Progress Notification */}
      <PdfExportProgressBar
        state={pdfExportState}
        onDismiss={() => setPdfExportState((prev) => ({ ...prev, isExporting: false, isCompleted: false }))}
      />

      {/* Interactive Recipe Detail Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        savedBookmarkIds={savedBookmarkIds}
        toggleBookmark={toggleBookmark}
        speakText={speakText}
      />

      {/* Share / QR Code Modal */}
      <QrShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        savedBookmarkIds={savedBookmarkIds}
        toggleBookmark={toggleBookmark}
        onOpenRecipeModal={(recipe) => setSelectedRecipe(recipe)}
        isOnline={offlineStatus.isOnline}
      />
    </div>
  );
}

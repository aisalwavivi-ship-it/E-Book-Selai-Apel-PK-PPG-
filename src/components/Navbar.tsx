import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  BookOpen,
  Utensils,
  Calculator,
  PackageCheck,
  Users,
  Volume2,
  VolumeX,
  Printer,
  Share2,
  Bookmark,
  Download,
  Loader2,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import appleMascotImg from '../assets/images/apple_cover_circle_badge_1786597025185.jpg';

type TabType = 'flipbook' | 'catalog' | 'hpp' | 'packaging' | 'team';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAudioSpeaking: boolean;
  toggleAudioNarration: () => void;
  onOpenShareModal: () => void;
  onOpenBookmarks: () => void;
  onDownloadFullPdf: () => void;
  isDownloadingPdf?: boolean;
  bookmarkCount: number;
  theme: 'warm' | 'dark';
  toggleTheme: () => void;
  isOnline?: boolean;
}

interface NavItem {
  id: TabType;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  emoji: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'flipbook',
    label: 'E-Book Interaktif',
    shortLabel: 'E-Book',
    description: '10 Halaman buku saku interaktif dengan efek membalik halaman nyata',
    icon: BookOpen,
    emoji: '📖',
    badge: '10 Hal',
  },
  {
    id: 'catalog',
    label: 'Katalog Resep',
    shortLabel: 'Resep',
    description: '5 Resep olahan apel Anna lengkap dengan takaran, langkah & timer',
    icon: Utensils,
    emoji: '🍳',
    badge: '5 Resep',
  },
  {
    id: 'hpp',
    label: 'Kalkulator HPP',
    shortLabel: 'HPP',
    description: 'Hitung Harga Pokok Produksi, target laba & simulasi BEP UMKM',
    icon: Calculator,
    emoji: '💰',
    badge: 'Otomatis',
  },
  {
    id: 'packaging',
    label: 'Kemasan & Label',
    shortLabel: 'Kemasan',
    description: 'Rekomendasi wadah selai & template cetak stiker label A4',
    icon: PackageCheck,
    emoji: '🏷️',
    badge: 'Cetak A4',
  },
  {
    id: 'team',
    label: 'Tim Pengabdi',
    shortLabel: 'Tim',
    description: 'Informasi pengabdian masyarakat Universitas Brawijaya & Desa Sumbergondo',
    icon: Users,
    emoji: '👥',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAudioSpeaking,
  toggleAudioNarration,
  onOpenShareModal,
  onOpenBookmarks,
  onDownloadFullPdf,
  isDownloadingPdf = false,
  bookmarkCount,
  theme,
  toggleTheme,
  isOnline = true,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Lock body scroll when drawer menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleSelectTab = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0];

  return (
    <>
      <header className="sticky top-0 z-40 bg-red-900/95 dark:bg-slate-900/95 backdrop-blur-md text-red-50 dark:text-slate-100 border-b border-red-800 dark:border-slate-800 shadow-md no-print transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: 3-Line Hamburger Menu Button + App Logo & Title */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* 3-Line Menu Trigger Button */}
              <button
                id="btn-toggle-hamburger-menu"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Buka Navigasi Garis Tiga (Menu Utama)"
                title="Menu Navigasi (Garis 3)"
                className="flex items-center space-x-1.5 p-2 rounded-xl bg-red-800/80 hover:bg-red-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-200 hover:text-white border border-red-700/70 dark:border-slate-700 transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center space-y-1">
                  <span className={`block h-0.5 w-4 bg-current rounded-full transition-transform duration-200 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block h-0.5 w-4 bg-current rounded-full transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                  <span className={`block h-0.5 w-4 bg-current rounded-full transition-transform duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
                <span className="hidden sm:inline font-bold text-xs tracking-wide">
                  MENU
                </span>
              </button>

              {/* Logo & Title */}
              <div 
                className="flex items-center space-x-2.5 cursor-pointer group select-none"
                onClick={() => setActiveTab('flipbook')}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center p-0.5 shadow-md border-2 border-red-300 dark:border-amber-400/70 overflow-hidden group-hover:scale-105 transition-transform shrink-0">
                  <img src={appleMascotImg} alt="Maskot Apel" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h1 className="font-serif text-sm sm:text-base font-bold tracking-tight text-red-100 dark:text-amber-200 group-hover:text-white dark:group-hover:text-amber-100 transition-colors leading-tight truncate">
                      BUKU SAKU SELAI APEL
                    </h1>
                  </div>
                  <p className="text-[10px] sm:text-xs text-red-200/90 dark:text-slate-400 font-sans tracking-wide truncate">
                    Desa Sumbergondo - Kota Batu
                  </p>
                </div>
              </div>
            </div>

            {/* Middle: Active Section Badge (Desktop & Tablet) */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-950/40 dark:bg-slate-950/40 border border-red-800/60 dark:border-slate-800 text-xs">
              <span className="text-amber-400 font-bold flex items-center space-x-1">
                <span>{activeItem.emoji}</span>
                <span>{activeItem.label}</span>
              </span>
              <span className="text-red-300/50">|</span>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-[11px] text-red-200/90 hover:text-amber-200 underline underline-offset-2 flex items-center space-x-1 cursor-pointer"
              >
                <span>Ganti Menu</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Right: Quick Action Tools */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {/* Theme Toggle Button */}
              <motion.button
                whileTap={{ scale: 0.84 }}
                whileHover={{ scale: 1.08 }}
                onClick={toggleTheme}
                title={theme === 'dark' ? "Mode Gelap: Beralih ke Mode Hangat Apel" : "Mode Hangat: Beralih ke Mode Gelap"}
                className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                  theme === 'dark'
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 hover:bg-amber-300'
                    : 'bg-red-800/80 dark:bg-slate-800 text-amber-200 hover:bg-red-800 hover:text-white border border-red-700/60 dark:border-slate-700'
                }`}
                aria-label="Ganti Tema Tampilan"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.div
                      key="theme-icon-sun"
                      initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4 text-slate-950 fill-amber-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="theme-icon-moon"
                      initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4 text-amber-200" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Audio Narrator */}
              <button
                onClick={toggleAudioNarration}
                title={isAudioSpeaking ? "Matikan Narasi Audio" : "Putar Narasi Audio"}
                className={`p-2 rounded-xl transition-colors ${
                  isAudioSpeaking
                    ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300'
                    : 'bg-red-800/80 dark:bg-slate-800 text-red-200 dark:text-slate-300 hover:bg-red-800 dark:hover:bg-slate-700 hover:text-white'
                }`}
              >
                {isAudioSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Bookmarks */}
              <motion.button
                whileTap={{ scale: 0.84 }}
                whileHover={{ scale: 1.06 }}
                onClick={onOpenBookmarks}
                title="Resep Tersimpan"
                className="relative p-2 rounded-xl bg-red-800/80 dark:bg-slate-800 text-red-200 dark:text-slate-300 hover:bg-red-800 dark:hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
              >
                <Bookmark className="w-4 h-4" />
                <AnimatePresence>
                  {bookmarkCount > 0 && (
                    <motion.span
                      key={bookmarkCount}
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: [0.3, 1.45, 0.9, 1.1, 1], opacity: 1 }}
                      exit={{ scale: 0.3, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="absolute -top-1 -right-1 bg-amber-400 text-red-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-amber-200"
                    >
                      {bookmarkCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Download PDF Button */}
              <button
                onClick={onDownloadFullPdf}
                disabled={isDownloadingPdf}
                title="Unduh E-Book PDF Lengkap (10 Halaman)"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300 text-red-950 dark:text-slate-950 font-bold text-xs transition-colors shadow-sm border border-amber-300 dark:border-amber-200 cursor-pointer disabled:opacity-60"
              >
                {isDownloadingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">
                  {isDownloadingPdf ? 'Merender...' : 'Unduh PDF'}
                </span>
              </button>

              {/* Share / QR Link */}
              <button
                onClick={onOpenShareModal}
                title="Bagikan Tautan / Kode QR E-Book"
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-600 dark:bg-red-700 text-white hover:bg-red-500 dark:hover:bg-red-600 font-semibold text-xs transition-colors shadow-sm border border-red-400/40 flex items-center space-x-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Bagikan</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 3-LINE DRAWER NAVIGATION MODAL (NAVIGASI GARIS 3) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden no-print">
            {/* Backdrop Dimmer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sliding Drawer from Left */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-sm sm:max-w-md bg-red-950 dark:bg-slate-900 text-red-50 dark:text-slate-100 h-full shadow-2xl flex flex-col border-r border-red-800 dark:border-slate-800 z-10 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-red-800 dark:border-slate-800 flex items-center justify-between bg-red-900/80 dark:bg-slate-900/90">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 p-0.5 shadow-md border-2 border-amber-400 overflow-hidden shrink-0">
                    <img src={appleMascotImg} alt="Maskot Apel" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base text-amber-200 leading-tight">
                      Navigasi Menu Utama
                    </h2>
                    <p className="text-[11px] text-red-200 dark:text-slate-400">
                      Buku Saku Selai Apel Sumbergondo
                    </p>
                  </div>
                </div>

                <button
                  id="btn-close-hamburger-menu"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl bg-red-800/80 hover:bg-red-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-red-200 hover:text-white transition-colors cursor-pointer"
                  title="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar">
                {/* Main 5 Navigation Items */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 px-3 py-1">
                    Daftar Menu Halaman
                  </div>

                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`drawer-nav-${item.id}`}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full text-left p-3 sm:p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer group ${
                          isActive
                            ? 'bg-amber-400 text-red-950 font-bold shadow-lg shadow-amber-400/20 ring-2 ring-amber-300'
                            : 'bg-red-900/40 hover:bg-red-900/80 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-red-100 dark:text-slate-200 border border-red-800/40 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                            isActive
                              ? 'bg-red-950 text-amber-300'
                              : 'bg-red-800 dark:bg-slate-700 text-amber-300 group-hover:scale-105 transition-transform'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm sm:text-base leading-snug truncate">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isActive
                                    ? 'bg-red-900 text-amber-200'
                                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className={`text-xs line-clamp-1 mt-0.5 ${
                              isActive ? 'text-red-900 font-medium' : 'text-red-200/80 dark:text-slate-400'
                            }`}>
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className={`w-5 h-5 shrink-0 ml-2 transition-transform group-hover:translate-x-1 ${
                          isActive ? 'text-red-950 font-bold' : 'text-red-300/60 dark:text-slate-500'
                        }`} />
                      </button>
                    );
                  })}
                </div>

                {/* Quick Utility Actions inside Drawer */}
                <div className="pt-2 border-t border-red-800/60 dark:border-slate-800 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 px-3">
                    Aksi Cepat & Fitur Tambahan
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Unduh PDF Button */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDownloadFullPdf();
                      }}
                      className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs flex flex-col items-start space-y-1 shadow-sm transition-colors text-left"
                    >
                      <div className="flex items-center space-x-1.5">
                        <Download className="w-4 h-4 text-red-950" />
                        <span>Unduh PDF</span>
                      </div>
                      <span className="text-[10px] text-red-900 font-normal">10 Halaman Berwarna</span>
                    </button>

                    {/* Bookmark List */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenBookmarks();
                      }}
                      className="p-3 rounded-xl bg-red-900/60 hover:bg-red-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-red-100 dark:text-slate-200 font-semibold text-xs flex flex-col items-start space-y-1 border border-red-800/60 dark:border-slate-700 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-1.5">
                        <Bookmark className="w-4 h-4 text-amber-400" />
                        <span>Resep Simpan</span>
                      </div>
                      <span className="text-[10px] text-red-300 dark:text-slate-400">{bookmarkCount} Tersimpan</span>
                    </button>

                    {/* Audio Narasi */}
                    <button
                      onClick={toggleAudioNarration}
                      className="p-3 rounded-xl bg-red-900/60 hover:bg-red-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-red-100 dark:text-slate-200 font-semibold text-xs flex flex-col items-start space-y-1 border border-red-800/60 dark:border-slate-700 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-1.5">
                        {isAudioSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                        <span>Audio Narator</span>
                      </div>
                      <span className="text-[10px] text-red-300 dark:text-slate-400">{isAudioSpeaking ? 'Sedang Membaca' : 'Klik Putar'}</span>
                    </button>

                    {/* Bagikan Modal */}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenShareModal();
                      }}
                      className="p-3 rounded-xl bg-red-900/60 hover:bg-red-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-red-100 dark:text-slate-200 font-semibold text-xs flex flex-col items-start space-y-1 border border-red-800/60 dark:border-slate-700 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-1.5">
                        <Share2 className="w-4 h-4 text-amber-400" />
                        <span>Bagikan / QR</span>
                      </div>
                      <span className="text-[10px] text-red-300 dark:text-slate-400">Tautan Aplikasi</span>
                    </button>
                  </div>

                  {/* Mode Tema Switch in Menu */}
                  <button
                    onClick={toggleTheme}
                    className="w-full p-3 rounded-xl bg-red-900/40 hover:bg-red-900/70 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-red-100 dark:text-slate-200 text-xs font-semibold flex items-center justify-between border border-red-800/40 dark:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-300" />}
                      <span>Pengaturan Tema Tampilan</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-red-950 dark:bg-slate-900 text-amber-300 font-bold text-[11px]">
                      {theme === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-red-800 dark:border-slate-800 bg-red-900/60 dark:bg-slate-950/80 text-xs text-red-200/90 dark:text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-[11px]">Kemitraan Sumbergondo</span>
                  <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isOnline ? 'Online' : 'Mode Offline'}</span>
                  </span>
                </div>
                <p className="text-[11px] leading-tight">
                  Program KKN-T & Pengabdian Masyarakat Universitas Brawijaya 2026.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};


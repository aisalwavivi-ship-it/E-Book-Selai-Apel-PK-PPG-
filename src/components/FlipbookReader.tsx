import React, { useState, useEffect } from 'react';
import { bookPages, recipesData, Recipe } from '../data/ebookData';
import { ChevronLeft, ChevronRight, List, Volume2, VolumeX, BookOpen, Clock, Utensils, Award, Sparkles, CheckCircle2, Bookmark, BookmarkCheck, Loader2, Download, FileCheck, Lightbulb, ShieldCheck, BookMarked, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import appleMascotImg from '../assets/images/apple_cover_circle_badge_1786597025185.jpg';
import sweetAppleBgImg from '../assets/images/user_sticker_pattern_1788317301564.jpg';
import { generateHighQualityBookPdf } from '../utils/exportPdf';
import { UmkmKitchenTipsModal } from './UmkmKitchenTipsModal';
import { PdfExportProgressBar, PdfExportProgressState } from './PdfExportProgressBar';

interface FlipbookReaderProps {
  onOpenRecipeModal: (recipe: Recipe) => void;
  savedBookmarkIds: string[];
  toggleBookmark: (recipeId: string) => void;
  speakText: (text: string) => void;
}

// Metadata for all recipe pages in the book for quick navigation
const recipePagesInfo = [
  { pageNumber: 5, recipeId: 'selai-apel-dasar', label: 'Resep 1', title: 'Selai Apel Anna', icon: '🍎' },
  { pageNumber: 6, recipeId: 'nastar-selai-apel', label: 'Resep 2', title: 'Nastar Apel Batu', icon: '✨' },
  { pageNumber: 7, recipeId: 'pie-apel-mini', label: 'Resep 3', title: 'Pie Apel Mini', icon: '🥧' },
  { pageNumber: 8, recipeId: 'minuman-sparkling-apple-tea', label: 'Resep 4', title: 'Apple Jam Tea', icon: '🍹' },
];

// Soft paper flip sound synthesizer using standard Web Audio API
const playPageFlipSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const duration = 0.14;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.pow(1 - i / bufferSize, 2.2);
      data[i] = (Math.random() * 2 - 1) * decay * 0.16;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + duration);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();
  } catch {
    // Non-blocking fallback
  }
};

// Realistic Smooth Physical Page Turn Animation Variants (Slide, Fade, Subtle Tilt, and Paper Shadow)
const pageFlipVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    rotateY: direction > 0 ? 12 : -12,
    opacity: 0,
    scale: 0.985,
    filter: 'brightness(0.96)',
    transformOrigin: direction > 0 ? 'left center' : 'right center',
    boxShadow: direction > 0
      ? '-18px 18px 36px -8px rgba(120, 20, 20, 0.28)'
      : '18px 18px 36px -8px rgba(120, 20, 20, 0.28)',
  }),
  center: {
    x: 0,
    rotateY: 0,
    opacity: 1,
    scale: 1,
    filter: 'brightness(1)',
    transformOrigin: 'center center',
    boxShadow: '0 15px 35px -5px rgba(185, 28, 28, 0.20), 0 6px 12px -2px rgba(185, 28, 28, 0.10)',
    transition: {
      x: { duration: 0.42, ease: [0.25, 1, 0.5, 1] as const },
      rotateY: { duration: 0.42, ease: [0.25, 1, 0.5, 1] as const },
      opacity: { duration: 0.36, ease: [0.25, 1, 0.5, 1] as const },
      scale: { duration: 0.42, ease: [0.25, 1, 0.5, 1] as const },
      filter: { duration: 0.3 },
      boxShadow: { duration: 0.42 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    rotateY: direction > 0 ? -12 : 12,
    opacity: 0,
    scale: 0.985,
    filter: 'brightness(0.94)',
    transformOrigin: direction > 0 ? 'left center' : 'right center',
    boxShadow: direction > 0
      ? '18px 18px 36px -8px rgba(120, 20, 20, 0.28)'
      : '-18px 18px 36px -8px rgba(120, 20, 20, 0.28)',
    transition: {
      x: { duration: 0.32, ease: [0.32, 0, 0.67, 0] as const },
      rotateY: { duration: 0.32, ease: [0.32, 0, 0.67, 0] as const },
      opacity: { duration: 0.24, ease: 'easeOut' as const },
      scale: { duration: 0.32 },
      filter: { duration: 0.2 },
    },
  }),
};

export const FlipbookReader: React.FC<FlipbookReaderProps> = ({
  onOpenRecipeModal,
  savedBookmarkIds,
  toggleBookmark,
  speakText,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [showTocDrawer, setShowTocDrawer] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isKitchenTipsOpen, setIsKitchenTipsOpen] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [exportProgress, setExportProgress] = useState<PdfExportProgressState>({
    isExporting: false,
    progressPercent: 0,
    statusText: '',
    currentPage: 0,
    totalPages: 10,
    documentTitle: 'Buku Resep Selai Apel dan Olahannya (10 Halaman)',
    isCompleted: false,
  });

  const totalPages = bookPages.length;
  const pageData = bookPages.find((p) => p.pageNumber === currentPage) || bookPages[0];

  const paginate = (newDirection: number) => {
    if (newDirection > 0 && currentPage < totalPages) {
      if (isSoundEnabled) playPageFlipSound();
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    } else if (newDirection < 0 && currentPage > 1) {
      if (isSoundEnabled) playPageFlipSound();
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (targetPage: number) => {
    if (targetPage === currentPage) return;
    if (isSoundEnabled) playPageFlipSound();
    setDirection(targetPage > currentPage ? 1 : -1);
    setCurrentPage(targetPage);
  };

  // Keyboard arrow keys for realistic page turning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        paginate(1);
      } else if (e.key === 'ArrowLeft') {
        paginate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, isSoundEnabled]);

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      setExportProgress({
        isExporting: true,
        progressPercent: 8,
        statusText: 'Menyiapkan berkas e-book lengkap...',
        currentPage: 1,
        totalPages: 10,
        documentTitle: 'Buku Resep Selai Apel dan Olahannya (10 Halaman Lengkap)',
        isCompleted: false,
      });

      await generateHighQualityBookPdf({
        onProgress: (current, total, msg) => {
          const pct = Math.round((current / total) * 100);
          setExportProgress({
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

      setExportProgress((prev) => ({
        ...prev,
        isExporting: false,
        progressPercent: 100,
        statusText: 'Unduhan PDF Lengkap Berhasil Disimpan!',
        isCompleted: true,
      }));

      // Auto-clear notification after 4 seconds
      setTimeout(() => {
        setExportProgress((prev) => ({ ...prev, isCompleted: false }));
      }, 4000);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setExportProgress((prev) => ({
        ...prev,
        isExporting: false,
        isCompleted: false,
      }));
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleNext = () => paginate(1);
  const handlePrev = () => paginate(-1);

  const handleReadCurrentPage = () => {
    let textToRead = `${pageData.title}. `;
    if (pageData.subtitle) textToRead += `${pageData.subtitle}. `;
    if (pageData.content.paragraphs) {
      textToRead += pageData.content.paragraphs.join(' ');
    }
    if (pageData.content.bulletPoints) {
      textToRead += pageData.content.bulletPoints.join('. ');
    }
    speakText(textToRead);
  };

  // Find associated recipe if applicable
  const associatedRecipe = pageData.content.recipeId
    ? recipesData.find((r) => r.id === pageData.content.recipeId)
    : null;

  const getContextualTip = (page: number) => {
    if (page <= 3) {
      return {
        tag: 'Ketahanan Alami',
        text: 'Kadar gula 50-60% & air lemon adalah preservatif alami utama penentu masa simpan 3-6 bulan.',
      };
    } else if (page === 4) {
      return {
        tag: 'Mutu Apel Anna',
        text: 'Rendam apel kupas dalam air garam 1% untuk menghentikan reaksi browning & menjaga warna selai cerah.',
      };
    } else if (page === 5) {
      return {
        tag: 'Hot-Filling & Vakum',
        text: 'Tuang selai saat mendidih (85°C–90°C) lalu balikkan toples 5 menit untuk menciptakan efek vakum alami.',
      };
    } else if (page === 6 || page === 7 || page === 8) {
      return {
        tag: 'Kiat Olahan Kue',
        text: 'Gunakan selai apel yang telah didinginkan di kulkas agar isian nastar & pie lebih kokoh saat dipanggang.',
      };
    } else if (page === 9) {
      return {
        tag: 'Sterilisasi Kemasan',
        text: 'Rebus toples & tutup logam 10-15 menit. Keringkan secara alami tanpa diseka lap kain dapur.',
      };
    } else {
      return {
        tag: 'Edukasi Konsumen',
        text: 'Cantumkan anjuran "Gunakan selalu sendok bersih & kering" pada label untuk mencegah timbulnya jamur.',
      };
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative py-3 sm:py-6 px-1.5 xs:px-3 sm:px-6 lg:px-8 flex flex-col justify-between transition-colors duration-200 overflow-hidden">
      {/* ======================================================== */}
      {/* CUSTOM SWEET APPLE TREATS STICKER BACKGROUND WALLPAPER (SOFT BLURRED) */}
      {/* ======================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-rose-50/60 dark:bg-slate-950">
        <img
          src={sweetAppleBgImg}
          alt="Sweet Apple Treats Pattern Wallpaper"
          className="w-full h-full object-cover object-center opacity-30 dark:opacity-12 filter blur-[6px] scale-105 transition-opacity duration-300"
          referrerPolicy="no-referrer"
        />
        {/* Soft pastel ambient wash to keep the reader calm and comfortable */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/60 via-rose-100/30 to-rose-200/50 dark:from-slate-950/80 dark:via-slate-950/70 dark:to-slate-950/90 backdrop-blur-[1px]"></div>
      </div>

      {/* Top Toolbar */}
      <div className="relative z-10 max-w-5xl mx-auto w-full mb-3 sm:mb-4 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2.5 bg-red-900/10 dark:bg-slate-900/80 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-red-900/15 dark:border-slate-800 backdrop-blur-md no-print transition-colors shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setIsKitchenTipsOpen(true)}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 text-red-950 dark:text-slate-950 font-bold text-[11px] sm:text-xs transition-all shadow-sm cursor-pointer border border-amber-500 dark:border-amber-400"
            title="Saran Praktis Ketahanan Selai & Kebersihan Kemasan UMKM"
          >
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-300 text-red-950 dark:text-slate-950" />
            <span>Tips Dapur UMKM</span>
          </button>

          <button
            onClick={() => setShowTocDrawer(!showTocDrawer)}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-red-900 dark:bg-slate-800 text-red-100 dark:text-slate-200 hover:bg-red-800 dark:hover:bg-slate-700 text-[11px] sm:text-xs font-semibold transition-all shadow-sm border border-red-800 dark:border-slate-700"
          >
            <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Daftar Isi</span>
          </button>

          <button
            onClick={handleReadCurrentPage}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-red-800/20 dark:bg-slate-800 text-red-900 dark:text-slate-200 hover:bg-red-800/30 dark:hover:bg-slate-700 text-[11px] sm:text-xs font-semibold transition-all border border-red-200/60 dark:border-slate-700"
            title="Dengarkan Suara Pembaca Halaman Ini"
          >
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-800 dark:text-amber-400" />
            <span className="hidden sm:inline">Bacakan Halaman</span>
          </button>

          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all border cursor-pointer ${
              isSoundEnabled
                ? 'bg-amber-100/80 dark:bg-slate-800 text-red-950 dark:text-amber-300 border-amber-300 dark:border-slate-700 hover:bg-amber-200'
                : 'bg-white/80 dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
            title={isSoundEnabled ? 'Efek Suara Balik Kertas: Aktif' : 'Efek Suara Balik Kertas: Nonaktif'}
          >
            {isSoundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-red-700 dark:text-amber-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span className="hidden md:inline text-[11px]">{isSoundEnabled ? 'Suara Kertas Aktif' : 'Suara Mati'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-red-800 dark:bg-slate-800 hover:bg-red-900 dark:hover:bg-slate-700 text-white dark:text-slate-100 font-bold text-[11px] sm:text-xs transition-all shadow-sm disabled:opacity-50 cursor-pointer border border-red-700 dark:border-slate-700"
            title="Unduh E-Book PDF Resmi 10 Halaman Lengkap"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            )}
            <span>{isExportingPdf ? 'Merender...' : 'Unduh PDF E-Book'}</span>
          </button>
        </div>

        {/* Page counter & Selector */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs font-semibold text-red-900 dark:text-slate-300">
          <span className="hidden sm:inline">Halaman</span>
          <select
            value={currentPage}
            onChange={(e) => goToPage(Number(e.target.value))}
            className="bg-white dark:bg-slate-800 border border-red-300 dark:border-slate-600 rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-red-950 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm cursor-pointer"
          >
            {bookPages.map((p) => (
              <option key={p.pageNumber} value={p.pageNumber} className="dark:bg-slate-800 dark:text-slate-100">
                {p.pageNumber}: {p.title.slice(0, 18)}...
              </option>
            ))}
          </select>
          <span>/ {totalPages}</span>

          {/* Page Jump Arrows */}
          <div className="flex items-center space-x-0.5 sm:space-x-1 ml-0.5 sm:ml-1">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="p-1 sm:p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-red-300 dark:border-slate-600 text-red-900 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-all shadow-sm cursor-pointer"
              title="Halaman Sebelumnya (Tekan Panah Kiri Keyboard)"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-1 sm:p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-red-300 dark:border-slate-600 text-red-900 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-all shadow-sm cursor-pointer"
              title="Halaman Selanjutnya (Tekan Panah Kanan Keyboard)"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Book Canvas Display */}
      <div className="max-w-5xl lg:max-w-6xl mx-auto w-full flex-1 flex items-center justify-center relative my-2 perspective-book [perspective:2200px]">
        {/* TOC Side Drawer */}
        {showTocDrawer && (
          <div className="absolute top-0 left-0 z-40 w-full sm:w-80 bg-red-950/95 dark:bg-slate-900/95 text-red-100 dark:text-slate-100 p-5 rounded-2xl shadow-2xl border border-red-700 dark:border-slate-700 backdrop-blur-md animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-red-800 dark:border-slate-700 pb-3 mb-4">
              <h3 className="font-serif font-bold text-red-200 dark:text-amber-300 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-red-400 dark:text-amber-400" />
                <span>Daftar Isi Buku Resep Selai Apel dan Olahannya</span>
              </h3>
              <button
                onClick={() => setShowTocDrawer(false)}
                className="text-red-300 dark:text-slate-400 hover:text-white dark:hover:text-slate-100 text-xs font-bold px-2 py-1 rounded bg-red-900 dark:bg-slate-800 cursor-pointer"
              >
                Tutup ✕
              </button>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {bookPages.map((page) => (
                <button
                  key={page.pageNumber}
                  onClick={() => {
                    goToPage(page.pageNumber);
                    setShowTocDrawer(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between cursor-pointer ${
                    currentPage === page.pageNumber
                      ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-slate-950 font-bold shadow-sm'
                      : 'hover:bg-red-900/60 dark:hover:bg-slate-800 text-red-200 dark:text-slate-300'
                  }`}
                >
                  <span className="line-clamp-2">{page.title}</span>
                  <span className="ml-2 font-mono text-[10px] bg-red-950/60 dark:bg-slate-950/60 px-1.5 py-0.5 rounded text-red-300 dark:text-amber-300">
                    Hal {page.pageNumber}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* E-Book Digital Paper Spread with Realistic Page Flip Animation */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageFlipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full bg-[#fcf8f5] dark:bg-slate-900 text-red-950 dark:text-slate-100 rounded-xl sm:rounded-2xl book-shadow border border-red-200/80 dark:border-slate-700/80 p-3.5 xs:p-5 sm:p-8 md:p-10 lg:p-12 relative overflow-hidden min-h-[460px] sm:min-h-[580px] flex flex-col justify-between transition-colors duration-200"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Subtle page texture background & spine effect */}
            <div className="absolute inset-y-0 left-0 w-6 sm:w-8 book-spine-left pointer-events-none opacity-40"></div>
            <div className="absolute inset-y-0 right-0 w-6 sm:w-8 book-spine-right pointer-events-none opacity-40"></div>
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 book-spine-center pointer-events-none opacity-20 hidden md:block"></div>

            {/* Dynamic Page Flip Shadow Gradient (Realistic Book Spine Depth) */}
            <div className="absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-red-950/10 to-transparent pointer-events-none z-10 opacity-60"></div>
            <div className="absolute inset-y-0 right-0 w-6 sm:w-8 bg-gradient-to-l from-red-950/5 to-transparent pointer-events-none z-10 opacity-40"></div>

            {/* Dynamic Paper Turn Light/Shadow Glaze for realistic page turning sensation */}
            <motion.div
              initial={{ opacity: 0.35, x: direction > 0 ? '60%' : '-60%' }}
              animate={{ opacity: 0, x: direction > 0 ? '-80%' : '80%' }}
              transition={{ duration: 0.46, ease: 'easeOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none z-20"
            />

            {/* Interactive Corner Dog-Ears for Realistic Page Flip Cues */}
            {currentPage < totalPages && (
              <div
                onClick={handleNext}
                className="page-dogear-corner cursor-pointer z-30 group no-print"
                title={`Klik pojok halaman untuk balik ke Hal ${currentPage + 1} ▶`}
                role="button"
                aria-label="Balik Halaman Berikutnya"
              />
            )}
            {currentPage > 1 && (
              <div
                onClick={handlePrev}
                className="page-dogear-corner-left cursor-pointer z-30 group no-print"
                title={`Klik pojok halaman untuk balik ke Hal ${currentPage - 1} ◀`}
                role="button"
                aria-label="Balik Halaman Sebelumnya"
              />
            )}

            {/* Left & Right Page-Turn Interactive Click Margins (Hover effect for intuitive flip) */}
            {currentPage > 1 && (
              <button
                onClick={handlePrev}
                className="absolute inset-y-0 left-0 w-8 sm:w-12 hover:bg-red-900/5 group transition-colors z-20 flex items-center justify-start pl-1 sm:pl-2 cursor-pointer no-print focus:outline-none"
                title="Klik untuk kembali ke halaman sebelumnya (atau tekan ◀)"
                aria-label="Halaman Sebelumnya"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 border border-red-200 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0">
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-900" />
                </div>
              </button>
            )}

            {currentPage < totalPages && (
              <button
                onClick={handleNext}
                className="absolute inset-y-0 right-0 w-8 sm:w-12 hover:bg-red-900/5 group transition-colors z-20 flex items-center justify-end pr-1 sm:pr-2 cursor-pointer no-print focus:outline-none"
                title="Klik untuk lanjut ke halaman berikutnya (atau tekan ▶)"
                aria-label="Halaman Selanjutnya"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 border border-red-200 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0">
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-900" />
                </div>
              </button>
            )}

          {/* Faded Brand Logo Watermark (Center Background for Rich Visuals while keeping text 100% readable) */}
          {pageData.type !== 'cover' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
              <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full overflow-hidden opacity-[0.05] mix-blend-multiply flex items-center justify-center">
                <img
                  src={appleMascotImg}
                  alt="Watermark Logo Brand"
                  className="w-full h-full object-contain filter grayscale contrast-125"
                />
              </div>
            </div>
          )}

          {/* Brand Bookmark Ribbon on Top-Right Corner */}
          <div className="absolute top-0 right-2 sm:right-6 md:right-10 pointer-events-none z-20 flex flex-col items-center">
            <div className="bg-gradient-to-b from-red-900 via-red-950 to-red-950 text-amber-100 px-1.5 sm:px-2.5 pt-1.5 sm:pt-2 pb-1.5 sm:pb-2 rounded-b-lg sm:rounded-b-xl shadow-md border-x border-b border-red-700/60 flex flex-col items-center space-y-0.5">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden border border-amber-300/80 bg-white p-0.5 shadow-2xs">
                <img
                  src={appleMascotImg}
                  alt="Bookmark Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-[5.5px] sm:text-[6.5px] font-black text-amber-300 uppercase tracking-widest leading-none">
                SUMBERGONDO
              </span>
            </div>
            {/* Bookmark Notch Ribbon Tail */}
            <div className="w-0 h-0 border-x-[8px] sm:border-x-[12px] border-x-transparent border-t-[5px] sm:border-t-[6px] border-t-red-950 -mt-0.5"></div>
          </div>

          {/* Watermark / Header line */}
          <div className="flex items-center justify-between border-b border-red-200/80 dark:border-slate-700/80 pb-2 sm:pb-3 mb-3 sm:mb-6 text-[10px] sm:text-xs text-red-800/80 dark:text-slate-400 uppercase tracking-widest font-semibold pr-14 xs:pr-18 sm:pr-32 relative z-10 gap-1 sm:gap-2 transition-colors">
            <span className="truncate">{pageData.chapterTitle || 'BUKU RESEP SELAI APEL DAN OLAHANNYA'}</span>
            <span className="font-serif italic font-normal text-red-700 dark:text-amber-400 whitespace-nowrap shrink-0 text-right mr-1 sm:mr-4 text-[9px] sm:text-xs">
              Desa Sumbergondo - Kota Batu
            </span>
          </div>

          {/* PAGE CONTENT SWITCHING BY TYPE */}
          <div className="flex-1 my-1 sm:my-2">
            {/* 1. COVER PAGE */}
            {pageData.type === 'cover' && (
              <div className="text-center py-1 sm:py-6 px-1 sm:px-6 flex flex-col items-center justify-center space-y-3.5 sm:space-y-6">
                {/* 1. Logo / Mascot at the Top Center */}
                <div className="relative group my-1">
                  <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-red-500 to-emerald-500 rounded-full blur-md opacity-70 group-hover:opacity-90 transition duration-300"></div>
                  <div className="relative w-36 h-36 xs:w-48 xs:h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-3 sm:border-4 md:border-[5px] border-amber-300 shadow-xl sm:shadow-2xl bg-white dark:bg-slate-800 flex items-center justify-center p-1.5 sm:p-2 mx-auto">
                    <img
                      src={appleMascotImg}
                      alt="Logo Maskot Apel Buku Resep Selai Apel dan Olahannya Anna Desa Sumbergondo"
                      className="w-full h-full object-cover rounded-full transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 2. Badge Luaran Program */}
                <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 sm:px-5 sm:py-2 rounded-full bg-red-100/95 dark:bg-slate-800 text-red-950 dark:text-amber-300 text-[10px] sm:text-xs md:text-sm font-bold border sm:border-2 border-red-300 dark:border-slate-600 shadow-xs text-center">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-amber-400 shrink-0" />
                  <span>HASIL LUARAN PROPOSAL PENGABDIAN MASYARAKAT</span>
                </div>

                {/* 3. Title & Subtitle Below the Logo */}
                <div className="space-y-1.5 sm:space-y-2.5 max-w-3xl px-1">
                  <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-red-950 dark:text-slate-100 tracking-tight leading-tight">
                    {pageData.title}
                  </h1>

                  <p className="font-sans text-xs xs:text-sm sm:text-base md:text-xl text-red-900 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
                    {pageData.subtitle}
                  </p>
                </div>

                {/* 4. Quote Box */}
                {pageData.content.quote && (
                  <div className="bg-rose-100/90 dark:bg-slate-800 border-l-4 border-red-600 dark:border-amber-400 p-3 sm:p-5 rounded-r-xl sm:rounded-r-2xl max-w-2xl text-left my-1 shadow-xs">
                    <p className="font-serif italic text-xs xs:text-sm sm:text-lg text-red-950 dark:text-slate-100 leading-relaxed">
                      "{pageData.content.quote.text}"
                    </p>
                    <p className="text-[11px] sm:text-sm font-bold text-red-900 dark:text-amber-300 mt-1.5 sm:mt-2">
                      — {pageData.content.quote.author} ({pageData.content.quote.role})
                    </p>
                  </div>
                )}

                {/* 5. Institutional & Location Identity */}
                <div className="pt-1 sm:pt-2 flex flex-col items-center space-y-0.5 sm:space-y-1 text-xs sm:text-base text-red-900 dark:text-slate-300 font-medium text-center">
                  <p className="font-semibold">Program Studi Pendidikan Guru Sekolah Dasar (PGSD)</p>
                  <p className="font-bold text-red-950 dark:text-slate-100 text-sm sm:text-lg">Universitas Muhammadiyah Malang</p>
                  <p className="text-red-700 dark:text-amber-400 font-bold">Desa Sumbergondo - Kota Batu</p>
                </div>
              </div>
            )}

            {/* 2. INTRO PAGE */}
            {pageData.type === 'intro' && (
              <div className="space-y-4 sm:space-y-8 py-2 sm:py-3">
                <div className="border-b-2 border-red-300 dark:border-slate-700 pb-2 sm:pb-3">
                  <span className="text-xs sm:text-base font-bold text-red-700 dark:text-amber-400 uppercase tracking-widest block mb-0.5 sm:mb-1">
                    Pengesahan & Kata Sambutan
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold text-red-950 dark:text-slate-100">
                    {pageData.title}
                  </h2>
                </div>

                <div className="space-y-4 sm:space-y-6 text-sm sm:text-xl md:text-2xl text-red-950 dark:text-slate-200 leading-relaxed sm:leading-loose font-serif">
                  {pageData.content.paragraphs?.map((p, idx) => (
                    <p key={idx} className="text-justify indent-5 sm:indent-10">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Structured Validation Badges for Rich Visual Balance */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 my-3 sm:my-5">
                  <div className="bg-white/95 dark:bg-slate-800 border-2 border-red-200/90 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xs text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 dark:bg-slate-700 text-red-800 dark:text-amber-300 mx-auto flex items-center justify-center mb-1.5 sm:mb-2 font-bold text-base sm:text-lg">
                      🎓
                    </div>
                    <div className="text-[10px] sm:text-sm font-bold uppercase tracking-wider text-red-700 dark:text-amber-400">Dosen Pembimbing</div>
                    <div className="font-serif font-bold text-sm sm:text-lg md:text-xl text-red-950 dark:text-slate-100 mt-0.5 sm:mt-1">Dr. Anis Farida Jamil, M.Pd.</div>
                    <div className="text-[11px] sm:text-sm text-red-800 dark:text-slate-400 mt-0.5">Universitas Muhammadiyah Malang</div>
                  </div>

                  <div className="bg-white/95 dark:bg-slate-800 border-2 border-red-200/90 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xs text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-100 dark:bg-slate-700 text-amber-800 dark:text-amber-300 mx-auto flex items-center justify-center mb-1.5 sm:mb-2 font-bold text-base sm:text-lg">
                      👩‍🏫
                    </div>
                    <div className="text-[10px] sm:text-sm font-bold uppercase tracking-wider text-red-700 dark:text-amber-400">Ketua Pelaksana</div>
                    <div className="font-serif font-bold text-sm sm:text-lg md:text-xl text-red-950 dark:text-slate-100 mt-0.5 sm:mt-1">Camelia Nur Laili</div>
                    <div className="text-[11px] sm:text-sm text-red-800 dark:text-slate-400 mt-0.5">Mahasiswa PGSD FKIP UMM</div>
                  </div>

                  <div className="bg-white/95 dark:bg-slate-800 border-2 border-red-200/90 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xs text-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 mx-auto flex items-center justify-center mb-1.5 sm:mb-2 font-bold text-base sm:text-lg">
                      📍
                    </div>
                    <div className="text-[10px] sm:text-sm font-bold uppercase tracking-wider text-red-700 dark:text-amber-400">Lokasi & Mitra</div>
                    <div className="font-serif font-bold text-sm sm:text-lg md:text-xl text-red-950 dark:text-slate-100 mt-0.5 sm:mt-1">Desa Sumbergondo</div>
                    <div className="text-[11px] sm:text-sm text-red-800 dark:text-slate-400 mt-0.5">Kec. Bumiaji, Kota Batu</div>
                  </div>
                </div>

                {pageData.content.calloutBox && (
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-slate-800 dark:to-slate-800/90 border-2 border-red-300 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-xs my-2.5 sm:my-4">
                    <h4 className="font-serif font-bold text-red-950 dark:text-amber-300 text-sm sm:text-lg md:text-xl mb-1.5 sm:mb-2 flex items-center space-x-2">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-red-700 dark:text-amber-400 shrink-0" />
                      <span>Informasi Dokumen Pengesahan</span>
                    </h4>
                    <p className="text-xs sm:text-lg md:text-xl text-red-900 dark:text-slate-300 leading-relaxed font-sans">
                      {pageData.content.calloutBox.text}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. TOC PAGE */}
            {pageData.type === 'toc' && (
              <div className="space-y-4 sm:space-y-8 py-1.5 sm:py-2">
                <div className="border-b-2 border-red-300 dark:border-slate-700 pb-2 sm:pb-3">
                  <span className="text-[11px] sm:text-sm font-bold text-red-700 dark:text-amber-400 uppercase tracking-widest block mb-0.5 sm:mb-1">
                    Peta Pembelajaran & Panduan
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-red-950 dark:text-slate-100">
                    {pageData.title}
                  </h2>
                </div>

                <div className="bg-white/90 dark:bg-slate-800/90 p-3 sm:p-7 rounded-xl sm:rounded-2xl border sm:border-2 border-red-200/90 dark:border-slate-700 shadow-sm space-y-3 sm:space-y-4">
                  <h3 className="font-serif font-bold text-red-900 dark:text-amber-300 text-xs sm:text-base tracking-wider uppercase flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-red-700 dark:text-amber-400" />
                    <span>Daftar Bab & Peta Materi Lengkap</span>
                  </h3>
                  <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-lg text-red-950 dark:text-slate-200">
                    {pageData.content.bulletPoints?.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => goToPage(idx + 4)}
                        className="flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-red-50/70 dark:bg-slate-700/60 hover:bg-rose-100/80 dark:hover:bg-slate-700 border border-red-200/60 dark:border-slate-600 transition-all cursor-pointer group shadow-2xs"
                        title={`Buka Bab ${idx + 1}`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3.5 min-w-0 flex-1">
                          <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-800 dark:bg-amber-500 group-hover:bg-red-900 text-white dark:text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                            {idx + 1}
                          </span>
                          <span className="font-serif font-bold text-xs sm:text-base md:text-lg text-red-950 dark:text-slate-100 group-hover:text-red-900 dark:group-hover:text-amber-300 transition-colors">
                            {item}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-sm font-bold text-red-800 dark:text-slate-950 bg-red-200/80 dark:bg-amber-400 group-hover:bg-red-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shrink-0 whitespace-nowrap transition-colors select-none">
                          Hal {idx + 4} →
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {pageData.content.calloutBox && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-emerald-950/30 border sm:border-2 border-emerald-300 dark:border-emerald-700 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl text-emerald-950 dark:text-emerald-200 text-xs sm:text-base flex items-start space-x-2.5 sm:space-x-3.5 shadow-xs">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1.5 sm:space-y-2">
                      <span className="font-serif font-bold block text-sm sm:text-lg text-emerald-950 dark:text-emerald-200">
                        {pageData.content.calloutBox.title}
                      </span>
                      <p className="text-emerald-900 dark:text-emerald-300 text-xs sm:text-base leading-relaxed">
                        {pageData.content.calloutBox.text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. ARTICLE PAGE */}
            {pageData.type === 'article' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="font-serif text-xl sm:text-3xl font-bold text-red-950 dark:text-slate-100 border-b-2 border-red-300 dark:border-slate-700 pb-2">
                  {pageData.title}
                </h2>

                <div className="space-y-3 sm:space-y-4 text-xs sm:text-base text-red-900 dark:text-slate-300 leading-relaxed">
                  {pageData.content.paragraphs?.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {pageData.content.calloutBox && (
                  <div className="bg-rose-100 dark:bg-slate-800 border-l-4 border-red-600 dark:border-amber-400 p-3 sm:p-4 rounded-r-xl sm:rounded-r-2xl shadow-xs my-2.5 sm:my-4">
                    <h4 className="font-serif font-bold text-red-950 dark:text-amber-300 text-xs sm:text-sm mb-1">
                      💡 {pageData.content.calloutBox.title}
                    </h4>
                    <p className="text-[11px] sm:text-sm text-red-900 dark:text-slate-300">
                      {pageData.content.calloutBox.text}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 5. RECIPE PAGE (EMBEDDED WITH INTERACTIVE TRIGGER) */}
            {pageData.type === 'recipe' && associatedRecipe && (
              <div className="space-y-3.5 sm:space-y-5">
                <div className="flex items-center justify-between gap-2 sm:gap-3 border-b border-red-300 dark:border-slate-700 pb-2.5 sm:pb-3">
                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-200 dark:bg-slate-800 text-red-900 dark:text-amber-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-0.5 sm:mb-1 whitespace-nowrap">
                      {associatedRecipe.categoryLabel}
                    </span>
                    <h2 className="font-serif text-base xs:text-lg sm:text-2xl md:text-3xl font-bold text-red-950 dark:text-slate-100 tracking-tight">
                      {associatedRecipe.title}
                    </h2>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.82 }}
                    whileHover={{ scale: 1.04 }}
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) {
                        try { navigator.vibrate([15, 25, 20]); } catch (_) {}
                      }
                      toggleBookmark(associatedRecipe.id);
                    }}
                    className={`relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all flex items-center space-x-1 sm:space-x-1.5 text-[11px] sm:text-xs font-bold shrink-0 cursor-pointer shadow-xs overflow-hidden ${
                      savedBookmarkIds.includes(associatedRecipe.id)
                        ? 'bg-amber-100/90 dark:bg-amber-400 text-red-950 dark:text-slate-950 border border-amber-300 ring-2 ring-amber-300/60 shadow-amber-200/50'
                        : 'bg-red-100 dark:bg-slate-800 text-red-900 dark:text-slate-200 hover:bg-red-200 dark:hover:bg-slate-700 border border-red-200 dark:border-slate-700'
                    }`}
                    title={savedBookmarkIds.includes(associatedRecipe.id) ? "Resep telah tersimpan di Favorit" : "Simpan resep ke Favorit"}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {savedBookmarkIds.includes(associatedRecipe.id) ? (
                        <motion.div
                          key="saved-state"
                          initial={{ scale: 0.4, rotate: -15 }}
                          animate={{ 
                            scale: [0.4, 1.4, 0.88, 1.15, 1], 
                            rotate: [0, -12, 12, -6, 0] 
                          }}
                          exit={{ scale: 0.4, opacity: 0 }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                          className="flex items-center space-x-1 sm:space-x-1.5"
                        >
                          <span className="relative flex items-center justify-center">
                            <BookmarkCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-700 dark:text-slate-950 fill-amber-400 dark:fill-slate-950" />
                            {/* Expanding Pop Ring Ripple */}
                            <motion.span
                              initial={{ scale: 0.6, opacity: 0.9 }}
                              animate={{ scale: 2.3, opacity: 0 }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                              className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
                            />
                          </span>
                          <span className="whitespace-nowrap text-red-950 dark:text-slate-950">Tersimpan ✨</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="unsaved-state"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0.8 }}
                          className="flex items-center space-x-1 sm:space-x-1.5"
                        >
                          <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-800 dark:text-slate-300" />
                          <span className="whitespace-nowrap">Simpan</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Recipe Quick Navigation Bar with 3D Page Flip */}
                <div className="bg-amber-50/90 dark:bg-slate-800/90 border border-amber-300/80 dark:border-slate-700 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-2xs no-print">
                  <div className="flex items-center justify-between mb-1 sm:mb-1.5 px-0.5 sm:px-1">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300 flex items-center space-x-1 sm:space-x-1.5">
                      <BookMarked className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-800 dark:text-amber-400" />
                      <span>Pintasan Resep (Balik 3D)</span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-amber-900 dark:text-slate-950 bg-amber-200/80 dark:bg-amber-400 px-1.5 sm:px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-800 dark:text-slate-950" />
                      <span>4 Resep</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5">
                    {recipePagesInfo.map((r) => {
                      const isActive = currentPage === r.pageNumber;
                      return (
                        <button
                          key={r.pageNumber}
                          onClick={() => goToPage(r.pageNumber)}
                          className={`px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-left text-xs transition-all flex items-center space-x-1 sm:space-x-1.5 cursor-pointer border ${
                            isActive
                              ? 'bg-red-800 dark:bg-amber-500 text-white dark:text-slate-950 font-bold border-red-900 dark:border-amber-400 shadow-sm'
                              : 'bg-white dark:bg-slate-700/60 hover:bg-rose-50 dark:hover:bg-slate-700 text-red-950 dark:text-slate-200 font-medium border-red-200/80 dark:border-slate-600 shadow-2xs'
                          }`}
                          title={`Buka ${r.title} (Halaman ${r.pageNumber})`}
                        >
                          <span className="text-xs sm:text-sm shrink-0">{r.icon}</span>
                          <div className="min-w-0 leading-tight">
                            <div className="text-[9px] sm:text-[10px] uppercase opacity-75 truncate">{r.label}</div>
                            <div className="text-[11px] sm:text-xs truncate font-serif font-bold">{r.title}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 items-center">
                  <div className="md:col-span-1 rounded-xl sm:rounded-2xl overflow-hidden shadow-md border sm:border-2 border-red-200 dark:border-slate-700 aspect-video md:aspect-square relative group">
                    <img
                      src={associatedRecipe.image}
                      alt={associatedRecipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2 sm:p-3">
                      <span className="text-white text-[11px] sm:text-xs font-semibold flex items-center space-x-1 whitespace-nowrap">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{associatedRecipe.cookTime}</span>
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2.5 sm:space-y-4">
                    <p className="text-xs sm:text-sm text-red-900 dark:text-slate-300 leading-relaxed font-sans">
                      {associatedRecipe.description}
                    </p>

                    <div className="grid grid-cols-3 gap-1 sm:gap-2 bg-red-100/70 dark:bg-slate-800 p-2 sm:p-3 rounded-xl text-center text-[10px] sm:text-xs text-red-950 dark:text-slate-200 font-medium">
                      <div className="min-w-0">
                        <span className="block text-red-700 dark:text-amber-400 font-bold text-[9px] sm:text-[10px] uppercase">Persiapan</span>
                        <span className="truncate block">{associatedRecipe.prepTime}</span>
                      </div>
                      <div className="border-x border-red-300 dark:border-slate-700 px-0.5 sm:px-1 min-w-0">
                        <span className="block text-red-700 dark:text-amber-400 font-bold text-[9px] sm:text-[10px] uppercase">Hasil</span>
                        <span className="truncate font-bold text-red-950 dark:text-slate-100 block">{associatedRecipe.yields}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-red-700 dark:text-amber-400 font-bold text-[9px] sm:text-[10px] uppercase">Kesulitan</span>
                        <span className="font-bold text-red-900 dark:text-slate-300 truncate block">{associatedRecipe.difficulty}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => onOpenRecipeModal(associatedRecipe)}
                        className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-red-700 dark:bg-red-600 text-white hover:bg-red-800 dark:hover:bg-red-500 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2 group cursor-pointer"
                      >
                        <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform" />
                        <span>Buka Resep Interaktif & Kalkulator Porsi</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick preview of ingredients */}
                <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 sm:p-4 rounded-xl border border-red-200 dark:border-slate-700">
                  <h4 className="font-serif font-bold text-[11px] sm:text-xs text-red-900 dark:text-amber-300 uppercase tracking-wider mb-1.5 sm:mb-2">
                    Bahan-bahan Ringkas:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5 text-xs text-red-900 dark:text-slate-300">
                    {associatedRecipe.ingredients.slice(0, 6).map((ing, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>
                          <strong>{ing.amount} {ing.unit}</strong> {ing.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Previous & Next Recipe Quick Turn Bar with 3D Page Flip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 no-print">
                  {currentPage > 5 ? (
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-red-300 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-slate-700 text-red-950 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs flex items-center space-x-2 text-left cursor-pointer group"
                      title="Balik ke resep sebelumnya dengan efek buka kertas"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-100 dark:bg-slate-700 group-hover:bg-red-200 flex items-center justify-center shrink-0 transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-900 dark:text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] sm:text-[10px] text-red-700 dark:text-amber-400 font-semibold uppercase">◀ Balik Resep Sebelumnya</div>
                        <div className="text-xs font-serif font-bold truncate">
                          {recipePagesInfo.find((r) => r.pageNumber === currentPage - 1)?.title || `Halaman ${currentPage - 1}`}
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="hidden sm:block"></div>
                  )}

                  {currentPage < 8 && (
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      className="p-2 sm:p-2.5 rounded-xl bg-red-900 dark:bg-slate-800 border border-red-950 dark:border-slate-700 hover:bg-red-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-between text-right cursor-pointer group sm:col-start-2"
                      title="Balik ke resep berikutnya dengan efek buka kertas"
                    >
                      <div className="min-w-0 text-left sm:text-right flex-1 pr-1.5 sm:pr-2">
                        <div className="text-[9px] sm:text-[10px] text-amber-300 font-semibold uppercase">Balik Resep Selanjutnya ▶</div>
                        <div className="text-xs font-serif font-bold truncate text-amber-50">
                          {recipePagesInfo.find((r) => r.pageNumber === currentPage + 1)?.title || `Halaman ${currentPage + 1}`}
                        </div>
                      </div>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-800 dark:bg-slate-700 group-hover:bg-red-700 flex items-center justify-center shrink-0 transition-colors">
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 6. BUSINESS & HPP PAGE */}
            {pageData.type === 'business' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="font-serif text-xl sm:text-3xl font-bold text-red-950 dark:text-slate-100 border-b-2 border-red-300 dark:border-slate-700 pb-2">
                  {pageData.title}
                </h2>

                <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-red-900 dark:text-slate-300 leading-relaxed">
                  {pageData.content.paragraphs?.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {pageData.content.tableData && (
                  <div className="overflow-x-auto my-3 sm:my-4 rounded-xl border border-red-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-red-900 dark:bg-slate-900 text-red-100 dark:text-amber-300 font-serif">
                        <tr>
                          {pageData.content.tableData.headers.map((h, idx) => (
                            <th key={idx} className="p-2 sm:p-3 border-b border-red-800 dark:border-slate-700 font-bold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-red-200 dark:divide-slate-700 text-red-950 dark:text-slate-200">
                        {pageData.content.tableData.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-red-50/50 dark:bg-slate-800/60' : 'bg-white dark:bg-slate-800'}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className={`p-2 sm:p-3 ${cIdx === 0 ? 'font-semibold' : ''}`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 7. TEAM PAGE */}
            {pageData.type === 'team' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="font-serif text-xl sm:text-3xl font-bold text-red-950 dark:text-slate-100 border-b-2 border-red-300 dark:border-slate-700 pb-2">
                  {pageData.title}
                </h2>

                <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-red-900 dark:text-slate-300 leading-relaxed">
                  {pageData.content.paragraphs?.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <div className="bg-red-900 dark:bg-slate-800 text-red-50 dark:text-slate-100 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl shadow-md border border-red-800 dark:border-slate-700 space-y-2.5 sm:space-y-3">
                  <h3 className="font-serif font-bold text-amber-300 text-xs sm:text-base whitespace-nowrap flex items-center space-x-2 border-b border-red-800 dark:border-slate-700 pb-2">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                    <span className="whitespace-nowrap">Susunan Tim Pelaksana Proyek Kepemimpinan:</span>
                  </h3>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-red-100 dark:text-slate-300">
                    {pageData.content.bulletPoints?.map((pt, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400 dark:bg-amber-400"></span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* CONTEXTUAL QUICK TIPS BANNER */}
          <div className="my-2.5 sm:my-3.5 p-2.5 sm:p-3 bg-amber-50/95 dark:bg-slate-800/95 border sm:border-2 border-amber-300 dark:border-slate-700 rounded-xl sm:rounded-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs text-amber-950 dark:text-slate-200 shadow-xs no-print transition-colors">
            <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
              <span className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-amber-400 text-red-950 font-bold shrink-0 shadow-2xs">
                <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-300 text-red-950" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-900 dark:text-amber-400 tracking-wider">
                    TIPS DAPUR UMKM
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-amber-200/80 dark:bg-slate-700 text-red-950 dark:text-amber-300">
                    {getContextualTip(currentPage).tag}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-amber-950 dark:text-slate-300 font-medium leading-tight mt-0.5">
                  {getContextualTip(currentPage).text}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsKitchenTipsOpen(true)}
              className="w-full sm:w-auto px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-400 hover:bg-amber-300 text-red-950 font-bold text-[11px] sm:text-xs shrink-0 border border-amber-500 shadow-2xs transition-all cursor-pointer text-center"
            >
              Lihat Panduan Lengkap
            </button>
          </div>

          {/* PAGE FOOTER & NAVIGATION CONTROLS */}
          <div className="pt-3 sm:pt-4 border-t border-red-200/90 dark:border-slate-700 flex items-center justify-between text-xs text-red-800 dark:text-slate-300 font-semibold no-print gap-1 transition-colors">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 border border-red-300 dark:border-slate-600 text-red-900 dark:text-slate-200 hover:bg-red-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-all shadow-xs cursor-pointer text-[11px] sm:text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sebelumnya</span>
            </button>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="font-mono bg-red-200/80 dark:bg-slate-800 text-red-950 dark:text-amber-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold text-[10px] sm:text-xs border dark:border-slate-700">
                - Hal {currentPage} / {totalPages} -
              </span>
              <span className="hidden md:inline-block text-[10px] text-red-700 dark:text-slate-400 font-medium italic">
                (Gunakan tombol ◀ ▶ keyboard)
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-red-900 dark:bg-amber-500 text-red-100 dark:text-slate-950 hover:bg-red-800 dark:hover:bg-amber-400 disabled:opacity-30 transition-all shadow-xs cursor-pointer text-[11px] sm:text-xs font-bold"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
      </div>

      {/* UMKM KITCHEN TIPS MODAL */}
      <UmkmKitchenTipsModal
        isOpen={isKitchenTipsOpen}
        onClose={() => setIsKitchenTipsOpen(false)}
        speakText={speakText}
        onNavigateToPage={(p) => setCurrentPage(p)}
      />

      {/* VISUAL PDF EXPORT PROGRESS BAR / SPINNER TOAST */}
      <PdfExportProgressBar
        state={exportProgress}
        onDismiss={() =>
          setExportProgress((prev) => ({
            ...prev,
            isExporting: false,
            isCompleted: false,
          }))
        }
      />
    </div>
  );
};

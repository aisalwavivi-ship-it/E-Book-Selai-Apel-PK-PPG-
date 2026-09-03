import React, { useState, useEffect, useRef } from 'react';
import { Recipe, Step, NutritionInfo } from '../data/ebookData';
import { X, Clock, CheckCircle2, Play, Pause, RotateCcw, Volume2, Sparkles, Plus, Minus, DollarSign, Bookmark, BookmarkCheck, Download, Loader2, Printer, Check, ChefHat, Info, Bell, BellOff, Timer, Flame, ArrowUpRight, Activity, Heart, Apple, ShieldCheck, Scale, Zap, ChevronDown, ListOrdered, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateSingleRecipePdf } from '../utils/exportPdf';
import { PdfExportProgressBar, PdfExportProgressState } from './PdfExportProgressBar';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  savedBookmarkIds: string[];
  toggleBookmark: (recipeId: string) => void;
  speakText: (text: string) => void;
}

interface ActiveTimer {
  stepNumber: number | null;
  title: string;
  totalSeconds: number;
  secondsLeft: number;
  isRunning: boolean;
  isFinished: boolean;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  savedBookmarkIds,
  toggleBookmark,
  speakText,
}) => {
  // Portion Scaling State
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  // Nutrition View Mode: 'serving' (per single standard portion) or 'batch' (total whole recipe batch)
  const [nutritionViewMode, setNutritionViewMode] = useState<'serving' | 'batch'>('serving');

  // Active Interactive Countdown Timer State
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [isTimerMuted, setIsTimerMuted] = useState<boolean>(false);
  const [showCustomPresets, setShowCustomPresets] = useState<boolean>(false);
  
  // Scroll and Navigation State for Floating Header & Jump Navigation
  const [isScrolledPastHero, setIsScrolledPastHero] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'timer' | 'ingredients' | 'steps' | 'nutrition' | 'hpp'>('ingredients');

  const modalScrollRef = useRef<HTMLDivElement>(null);
  const timerSectionRef = useRef<HTMLDivElement>(null);
  const ingredientsSectionRef = useRef<HTMLDivElement>(null);
  const stepsSectionRef = useRef<HTMLDivElement>(null);
  const nutritionSectionRef = useRef<HTMLDivElement>(null);
  const hppSectionRef = useRef<HTMLDivElement>(null);

  // PDF Export State
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<PdfExportProgressState>({
    isExporting: false,
    progressPercent: 0,
    statusText: '',
    currentPage: 1,
    totalPages: 1,
    documentTitle: recipe ? `Resep ${recipe.title}` : '',
    isCompleted: false,
  });

  // Reset state when a new recipe is selected
  useEffect(() => {
    if (recipe) {
      setPortionMultiplier(1);
      setCheckedIngredients({});
      setCheckedSteps({});
      setActiveTimer(null);
      setNutritionViewMode('serving');
      setIsScrolledPastHero(false);
      if (modalScrollRef.current) {
        modalScrollRef.current.scrollTop = 0;
      }
    }
  }, [recipe?.id]);

  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolledPastHero(scrollTop > 120);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>, sectionKey: 'timer' | 'ingredients' | 'steps' | 'nutrition' | 'hpp') => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionKey);
    }
  };

  // Countdown Interval Effect
  useEffect(() => {
    let interval: any = null;
    if (activeTimer && activeTimer.isRunning && activeTimer.secondsLeft > 0) {
      interval = setInterval(() => {
        setActiveTimer((prev) => {
          if (!prev) return null;
          if (prev.secondsLeft <= 1) {
            // Trigger finished alert
            if (!isTimerMuted) {
              playCelebrationChime();
            }
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              try {
                navigator.vibrate([200, 100, 200, 100, 400]);
              } catch (_) {}
            }
            return {
              ...prev,
              secondsLeft: 0,
              isRunning: false,
              isFinished: true,
            };
          }
          return {
            ...prev,
            secondsLeft: prev.secondsLeft - 1,
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer?.isRunning, activeTimer?.secondsLeft, isTimerMuted]);

  // Melodic kitchen chime synthesizer using Web Audio API
  const playCelebrationChime = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const now = ctx.currentTime;

      // 3-tone pleasant chime (D5 -> A5 -> D6)
      const notes = [
        { freq: 587.33, start: 0, duration: 0.25 },
        { freq: 880.00, start: 0.2, duration: 0.3 },
        { freq: 1174.66, start: 0.45, duration: 0.8 },
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.start);

        gain.gain.setValueAtTime(0, now + n.start);
        gain.gain.linearRampToValueAtTime(0.35, now + n.start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.start);
        osc.stop(now + n.start + n.duration);
      });
    } catch (e) {
      console.log('Chime error', e);
    }
  };

  // Start or switch timer for a specific recipe step or custom minutes
  const startStepTimer = (minutes: number, stepNumber: number | null = null, title: string = '') => {
    const totalSecs = Math.max(1, Math.round(minutes * 60));
    const stepObj = (stepNumber && recipe) ? recipe.instructions.find((s) => s.stepNumber === stepNumber) : null;
    const resolvedTitle = title || (stepObj ? `Langkah ${stepNumber}: ${stepObj.title}` : `Timer Memasak (${minutes} Menit)`);

    setActiveTimer({
      stepNumber,
      title: resolvedTitle,
      totalSeconds: totalSecs,
      secondsLeft: totalSecs,
      isRunning: true,
      isFinished: false,
    });

    // Smooth scroll to timer widget
    setTimeout(() => {
      timerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const toggleTimerPause = () => {
    setActiveTimer((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isRunning: !prev.isRunning,
      };
    });
  };

  const resetTimer = () => {
    setActiveTimer((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        secondsLeft: prev.totalSeconds,
        isRunning: false,
        isFinished: false,
      };
    });
  };

  const adjustTimerSeconds = (deltaSeconds: number) => {
    setActiveTimer((prev) => {
      if (!prev) return null;
      const nextSecs = Math.max(0, prev.secondsLeft + deltaSeconds);
      const nextTotal = Math.max(prev.totalSeconds, nextSecs);
      return {
        ...prev,
        secondsLeft: nextSecs,
        totalSeconds: nextTotal,
        isFinished: nextSecs === 0 ? prev.isFinished : false,
      };
    });
  };

  const handleMarkStepFromTimer = (stepNum: number | null) => {
    if (stepNum) {
      setCheckedSteps((prev) => ({
        ...prev,
        [stepNum]: true,
      }));
    }
    setActiveTimer(null);
  };

  const formatTimerTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isBookmarked = recipe ? savedBookmarkIds.includes(recipe.id) : false;

  const handleReadRecipe = () => {
    if (!recipe) return;
    let text = `Resep ${recipe.title}. ${recipe.description}. Bahan-bahan: `;
    recipe.ingredients.forEach((ing) => {
      const scaledAmount = Math.round(ing.amount * portionMultiplier * 10) / 10;
      text += `${scaledAmount} ${ing.unit} ${ing.name}. `;
    });
    speakText(text);
  };

  const handlePrintRecipe = () => {
    document.body.setAttribute('data-print-mode', 'recipe');
    const cleanup = () => {
      document.body.removeAttribute('data-print-mode');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    setTimeout(() => {
      document.body.removeAttribute('data-print-mode');
    }, 3000);

    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!recipe) return;
    try {
      setIsExportingPdf(true);
      setExportProgress({
        isExporting: true,
        progressPercent: 20,
        statusText: `Merender lembar resep ${recipe.title}...`,
        currentPage: 1,
        totalPages: 1,
        documentTitle: `Resep ${recipe.title} (PDF Landscape)`,
        isCompleted: false,
      });

      await generateSingleRecipePdf(recipe.id, recipe.title, {
        onProgress: (current, total, msg) => {
          const pct = Math.round((current / total) * 100);
          setExportProgress({
            isExporting: true,
            progressPercent: pct,
            statusText: msg,
            currentPage: current,
            totalPages: total,
            documentTitle: `Resep ${recipe.title} (PDF Landscape)`,
            isCompleted: false,
          });
        },
      });

      setDownloadSuccess(true);
      setExportProgress((prev) => ({
        ...prev,
        isExporting: false,
        progressPercent: 100,
        statusText: 'Lembar PDF Berhasil Diunduh!',
        isCompleted: true,
      }));

      setTimeout(() => {
        setDownloadSuccess(false);
        setExportProgress((prev) => ({ ...prev, isCompleted: false }));
      }, 4000);
    } catch (err) {
      console.error(err);
      setExportProgress((prev) => ({ ...prev, isExporting: false, isCompleted: false }));
      alert('Gagal mengunduh lembar resep PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Timer Progress Calculation
  const timerPercent = activeTimer
    ? activeTimer.totalSeconds > 0
      ? Math.min(100, Math.max(0, ((activeTimer.totalSeconds - activeTimer.secondsLeft) / activeTimer.totalSeconds) * 100))
      : 100
    : 0;

  // Preset time options for quick manual countdown
  const QUICK_TIMER_PRESETS = [
    { label: '3 Mnt', mins: 3 },
    { label: '5 Mnt', mins: 5 },
    { label: '10 Mnt', mins: 10 },
    { label: '15 Mnt', mins: 15 },
    { label: '20 Mnt', mins: 20 },
    { label: '25 Mnt', mins: 25 },
    { label: '30 Mnt', mins: 30 },
  ];

  if (!recipe) return null;

  return (
    <>
      {/* ======================================================== */}
      {/* 1. SCREEN MODAL DIALOG (Hidden in browser print mode) */}
      {/* ======================================================== */}
      <div className="fixed inset-0 z-50 bg-red-950/75 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 no-print animate-in fade-in duration-200">
        <div className="bg-[#fffdfa] dark:bg-slate-900 rounded-3xl border border-red-300 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[94vh] flex flex-col overflow-hidden my-auto transition-colors relative">
          
          {/* ======================================================== */}
          {/* STICKY GLASSMORPHIC TOP CONTROL BAR */}
          {/* Always accessible, transitions into solid blur on scroll */}
          {/* ======================================================== */}
          <div
            className={`sticky top-0 z-30 transition-all duration-300 px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between border-b ${
              isScrolledPastHero
                ? 'bg-red-950/95 dark:bg-slate-950/95 backdrop-blur-md border-red-800/80 dark:border-slate-800 shadow-md text-white'
                : 'bg-gradient-to-b from-red-950/90 via-red-950/50 to-transparent border-transparent text-white'
            }`}
          >
            {/* Left: Bookmark, Voice & Animated Compact Title */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1 mr-2">
              <motion.button
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    try { navigator.vibrate([15, 25, 20]); } catch (_) {}
                  }
                  toggleBookmark(recipe.id);
                }}
                className={`relative p-2 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-md overflow-hidden shrink-0 ${
                  isBookmarked
                    ? 'bg-amber-400 text-red-950 ring-2 ring-amber-300 ring-offset-2 ring-offset-red-950 dark:ring-offset-slate-900 shadow-amber-400/40'
                    : 'bg-red-950/80 dark:bg-slate-900/80 text-red-200 dark:text-slate-300 hover:bg-red-900 dark:hover:bg-slate-800 hover:text-white border border-red-700/50 dark:border-slate-700'
                }`}
                title={isBookmarked ? 'Resep Tersimpan di Favorit' : 'Simpan Resep ke Favorit'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isBookmarked ? (
                    <motion.div
                      key="modal-bookmarked-pop"
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
                      <motion.span
                        initial={{ scale: 0.6, opacity: 0.9 }}
                        animate={{ scale: 2.4, opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full border-2 border-amber-300 pointer-events-none"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="modal-unbookmarked-state"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      className="flex items-center justify-center"
                    >
                      <Bookmark className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <button
                onClick={handleReadRecipe}
                className="p-2 rounded-full bg-red-950/80 dark:bg-slate-900/80 text-red-200 dark:text-slate-300 hover:bg-red-900 dark:hover:bg-slate-800 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Bacakan Resep (Audio Voice)"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Compact Title smoothly fades in when scrolled past hero */}
              <div
                className={`transition-all duration-300 min-w-0 flex items-center space-x-2 ${
                  isScrolledPastHero
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <span className="text-amber-300 dark:text-amber-400 font-serif font-bold text-xs sm:text-sm truncate">
                  {recipe.title}
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-red-800/80 text-[9px] uppercase font-bold text-amber-200 border border-red-700/60 whitespace-nowrap">
                  {recipe.categoryLabel}
                </span>
              </div>
            </div>

            {/* Right: Print, PDF download & Close button */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              <button
                id="btn-print-recipe-modal"
                onClick={handlePrintRecipe}
                className="px-2.5 sm:px-3 py-1.5 rounded-full bg-red-800/90 dark:bg-slate-800 hover:bg-red-700 dark:hover:bg-slate-700 text-white font-bold text-[11px] sm:text-xs transition-colors flex items-center space-x-1.5 shadow-md border border-red-600/50 dark:border-slate-600 cursor-pointer"
                title="Cetak Lembar Resep Ini ke Printer / Kertas Standar (A4)"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden xs:inline">Cetak Resep</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-red-950 font-bold text-[11px] sm:text-xs transition-colors flex items-center space-x-1.5 shadow-md border border-amber-300 cursor-pointer disabled:opacity-60"
                title="Unduh Lembar Resep Ini dalam Format PDF Resmi (1:1 E-Book)"
              >
                {isExportingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : downloadSuccess ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span className="hidden xs:inline">{isExportingPdf ? 'Merender...' : downloadSuccess ? 'Tersimpan!' : 'Unduh PDF'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-full bg-red-950/80 dark:bg-slate-900/80 text-red-200 dark:text-slate-300 hover:bg-red-950 dark:hover:bg-slate-800 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Tutup Modal Resep"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* MAIN SCROLLABLE CONTAINER: HERO SCROLLS NATURALLY UPWARD */}
          {/* ======================================================== */}
          <div
            ref={modalScrollRef}
            onScroll={handleModalScroll}
            className="overflow-y-auto max-h-[94vh] flex-1 scroll-smooth text-red-950 dark:text-slate-100 relative"
          >
            {/* Modal Hero Banner with Upward Scroll & Parallax Effect */}
            <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden bg-red-900 dark:bg-slate-950 -mt-14 sm:-mt-16 group">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fffdfa] dark:from-slate-900 via-red-950/60 to-red-950/40"></div>

              {/* Recipe Title & Scroll Prompt Banner */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-700/90 dark:bg-amber-500 text-[10px] font-bold uppercase tracking-wider mb-1 border border-red-500/40 dark:border-amber-400 text-white dark:text-slate-950 shadow-xs whitespace-nowrap">
                  {recipe.categoryLabel}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-sm leading-tight">
                  {recipe.title}
                </h2>
                <p className="text-xs sm:text-sm text-red-100 dark:text-slate-200 line-clamp-2 mt-0.5 font-sans max-w-2xl">
                  {recipe.subtitle}
                </p>

                {/* Animated Scroll Down Indicator Button */}
                <button
                  onClick={() => scrollToSection(ingredientsSectionRef, 'ingredients')}
                  className="pt-2 flex items-center space-x-2 text-[11px] text-amber-300 hover:text-amber-200 font-semibold cursor-pointer transition-colors group/hint"
                >
                  <span className="group-hover/hint:underline">Gulir ke bawah untuk melihat bahan & panduan lengkap</span>
                  <ChevronDown className="w-4 h-4 animate-bounce text-amber-300" />
                </button>
              </div>
            </div>

            {/* Quick Section Anchor Pills Strip */}
            <div className="sticky top-0 z-20 bg-[#fffdfa]/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-red-200 dark:border-slate-800 px-4 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-2xs">
              <button
                onClick={() => scrollToSection(timerSectionRef, 'timer')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1 shrink-0 cursor-pointer ${
                  activeSection === 'timer'
                    ? 'bg-amber-400 text-red-950 shadow-xs'
                    : 'bg-rose-100/70 dark:bg-slate-800 text-red-900 dark:text-slate-300 hover:bg-rose-200'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>Timer Masak</span>
              </button>

              <button
                onClick={() => scrollToSection(ingredientsSectionRef, 'ingredients')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1 shrink-0 cursor-pointer ${
                  activeSection === 'ingredients'
                    ? 'bg-amber-400 text-red-950 shadow-xs'
                    : 'bg-rose-100/70 dark:bg-slate-800 text-red-900 dark:text-slate-300 hover:bg-rose-200'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Bahan ({recipe.ingredients.length})</span>
              </button>

              <button
                onClick={() => scrollToSection(stepsSectionRef, 'steps')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1 shrink-0 cursor-pointer ${
                  activeSection === 'steps'
                    ? 'bg-amber-400 text-red-950 shadow-xs'
                    : 'bg-rose-100/70 dark:bg-slate-800 text-red-900 dark:text-slate-300 hover:bg-rose-200'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Langkah ({recipe.instructions.length})</span>
              </button>

              {recipe.nutrition && (
                <button
                  onClick={() => scrollToSection(nutritionSectionRef, 'nutrition')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1 shrink-0 cursor-pointer ${
                    activeSection === 'nutrition'
                      ? 'bg-amber-400 text-red-950 shadow-xs'
                      : 'bg-rose-100/70 dark:bg-slate-800 text-red-900 dark:text-slate-300 hover:bg-rose-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Nilai Gizi</span>
                </button>
              )}

              {recipe.hpp && (
                <button
                  onClick={() => scrollToSection(hppSectionRef, 'hpp')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1 shrink-0 cursor-pointer ${
                    activeSection === 'hpp'
                      ? 'bg-amber-400 text-red-950 shadow-xs'
                      : 'bg-rose-100/70 dark:bg-slate-800 text-red-900 dark:text-slate-300 hover:bg-rose-200'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Simulasi HPP</span>
                </button>
              )}
            </div>

            {/* Modal Scrollable Content Body */}
            <div className="p-5 sm:p-8 space-y-6">
              {/* Download Success Banner */}
              {downloadSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 p-3 rounded-2xl flex items-center space-x-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-in slide-in-from-top">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Lembar PDF Resmi {recipe.title} berhasil diunduh dalam format 1:1 e-book!</span>
                </div>
              )}

              {/* ======================================================== */}
              {/* INTERACTIVE COUNTDOWN TIMER WIDGET */}
              {/* ======================================================== */}
              <div ref={timerSectionRef} id="recipe-interactive-timer-section">
              <AnimatePresence mode="wait">
                {activeTimer && (
                  <motion.div
                    key="active-timer-card"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className={`p-5 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
                      activeTimer.isFinished
                        ? 'bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-emerald-50 border-emerald-500/80 shadow-emerald-900/40 ring-4 ring-emerald-400/30'
                        : activeTimer.isRunning
                        ? 'bg-gradient-to-br from-red-900 via-red-950 to-slate-950 text-red-50 border-amber-400/60 shadow-red-950/60 ring-2 ring-amber-400/20'
                        : 'bg-red-950/95 dark:bg-slate-900 text-red-100 border-red-800 dark:border-slate-800 shadow-md'
                    }`}
                  >
                    {/* Background Glow when running */}
                    {activeTimer.isRunning && (
                      <motion.div
                        animate={{ opacity: [0.15, 0.35, 0.15] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"
                      />
                    )}

                    {/* Timer Top Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-red-800/60 dark:border-slate-800 pb-3 mb-4">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                            activeTimer.isFinished
                              ? 'bg-emerald-500 text-slate-950 animate-bounce'
                              : activeTimer.isRunning
                              ? 'bg-amber-400 text-red-950 animate-pulse'
                              : 'bg-red-800 dark:bg-slate-800 text-red-200'
                          }`}
                        >
                          {activeTimer.isFinished ? '🎉' : <Timer className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-800/80 dark:bg-slate-800 text-amber-300 border border-red-700/60 dark:border-slate-700">
                              {activeTimer.isFinished
                                ? 'Waktu Selesai'
                                : activeTimer.isRunning
                                ? 'Timer Sedang Berjalan'
                                : 'Timer Dijeda'}
                            </span>
                            {activeTimer.stepNumber && (
                              <span className="text-[10px] text-red-300 dark:text-slate-400 font-mono">
                                Step #{activeTimer.stepNumber}
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif font-bold text-sm sm:text-base text-white dark:text-amber-200 line-clamp-1 mt-0.5">
                            {activeTimer.title}
                          </h4>
                        </div>
                      </div>

                      {/* Header Actions: Mute sound & Close */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setIsTimerMuted(!isTimerMuted)}
                          className="p-1.5 rounded-lg bg-red-900/80 dark:bg-slate-800 hover:bg-red-800 text-red-200 dark:text-slate-300 transition-colors cursor-pointer border border-red-700/50"
                          title={isTimerMuted ? 'Nyalakan Suara Alarm' : 'Senyapkan Suara Alarm'}
                        >
                          {isTimerMuted ? (
                            <BellOff className="w-3.5 h-3.5 text-red-400" />
                          ) : (
                            <Bell className="w-3.5 h-3.5 text-amber-300" />
                          )}
                        </button>
                        <button
                          onClick={() => setActiveTimer(null)}
                          className="p-1.5 rounded-lg bg-red-900/80 dark:bg-slate-800 hover:bg-red-800 text-red-300 hover:text-white transition-colors cursor-pointer border border-red-700/50"
                          title="Tutup Timer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Timer Main Stage: Ring & Large Countdown + Adjusters */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      {/* Left/Center: Digital Display & Circular Progress */}
                      <div className="flex items-center space-x-4">
                        {/* Circular Progress SVG Gauge */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Track background */}
                            <circle
                              cx="50"
                              cy="50"
                              r="42"
                              className="stroke-red-900/60 dark:stroke-slate-800"
                              strokeWidth="8"
                              fill="transparent"
                            />
                            {/* Progress bar */}
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="42"
                              className={
                                activeTimer.isFinished
                                  ? 'stroke-emerald-400'
                                  : 'stroke-amber-400 dark:stroke-amber-300'
                              }
                              strokeWidth="8"
                              strokeDasharray="264"
                              strokeDashoffset={264 - (264 * timerPercent) / 100}
                              strokeLinecap="round"
                              fill="transparent"
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[11px] font-mono font-bold text-amber-300">
                              {Math.round(timerPercent)}%
                            </span>
                            <span className="text-[8px] uppercase tracking-wider text-red-300 dark:text-slate-400">
                              Progres
                            </span>
                          </div>
                        </div>

                        {/* Large Digital Clock Readout */}
                        <div>
                          <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider text-white dark:text-amber-300 drop-shadow-sm">
                            {formatTimerTime(activeTimer.secondsLeft)}
                          </div>
                          <span className="text-xs text-red-300 dark:text-slate-400 font-sans block mt-0.5">
                            {activeTimer.isFinished
                              ? 'Waktu telah habis!'
                              : `Dari total durasi ${Math.round(activeTimer.totalSeconds / 60)} menit`}
                          </span>
                        </div>
                      </div>

                      {/* Right: Interactive Control Buttons */}
                      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                        {/* Play/Pause Button */}
                        <button
                          onClick={toggleTimerPause}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 shadow-md cursor-pointer ${
                            activeTimer.isRunning
                              ? 'bg-amber-400 hover:bg-amber-300 text-red-950 border border-amber-300'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border border-emerald-400'
                          }`}
                        >
                          {activeTimer.isRunning ? (
                            <>
                              <Pause className="w-4 h-4" />
                              <span>Jeda</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 fill-current" />
                              <span>Lanjutkan</span>
                            </>
                          )}
                        </button>

                        {/* Reset to initial */}
                        <button
                          onClick={resetTimer}
                          className="p-2.5 rounded-xl bg-red-900/90 dark:bg-slate-800 hover:bg-red-800 text-red-200 dark:text-slate-300 font-bold text-xs transition-colors flex items-center space-x-1 border border-red-700/60 dark:border-slate-700 cursor-pointer shadow-xs"
                          title="Reset Timer ke Waktu Awal"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        {/* Quick Minute Adjusters (+1m, +5m, -1m) */}
                        <div className="flex items-center space-x-1 bg-red-950/80 dark:bg-slate-800/90 p-1 rounded-xl border border-red-800 dark:border-slate-700">
                          <button
                            onClick={() => adjustTimerSeconds(-60)}
                            className="px-2 py-1 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Kurangi 1 Menit"
                          >
                            -1m
                          </button>
                          <button
                            onClick={() => adjustTimerSeconds(60)}
                            className="px-2 py-1 rounded-lg bg-red-900/60 hover:bg-red-800 text-amber-300 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Tambah 1 Menit"
                          >
                            +1m
                          </button>
                          <button
                            onClick={() => adjustTimerSeconds(300)}
                            className="px-2 py-1 rounded-lg bg-red-900/60 hover:bg-red-800 text-amber-300 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Tambah 5 Menit"
                          >
                            +5m
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Celebration / Step Completed Banner if finished */}
                    {activeTimer.isFinished && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 pt-3 border-t border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 bg-emerald-950/60 p-3 rounded-2xl"
                      >
                        <div className="flex items-center space-x-2 text-emerald-200 text-xs">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Tahap memasak/memanggang selesai! Periksa tekstur dan aroma hidangan.</span>
                        </div>
                        {activeTimer.stepNumber && (
                          <button
                            onClick={() => handleMarkStepFromTimer(activeTimer.stepNumber)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-md cursor-pointer ml-auto"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Tandai Langkah {activeTimer.stepNumber} Selesai</span>
                          </button>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Timer Presets Bar (Always available to start manual cooking/baking timer) */}
            <div className="bg-rose-100/70 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-red-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2 text-xs text-red-950 dark:text-slate-200 font-bold">
                <Clock className="w-4 h-4 text-red-700 dark:text-amber-400 shrink-0" />
                <span>Timer Cepat Memasak:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {QUICK_TIMER_PRESETS.map((preset) => (
                  <button
                    key={preset.mins}
                    onClick={() => startStepTimer(preset.mins, null, `Timer Masak Manual (${preset.mins} Menit)`)}
                    className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 hover:bg-amber-400 hover:text-red-950 text-red-900 dark:text-slate-200 text-xs font-semibold border border-red-200 dark:border-slate-700 transition-all shadow-2xs cursor-pointer"
                  >
                    ⏱️ {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Portion Scaler Bar */}
            <div className="bg-rose-100/80 dark:bg-slate-800/90 p-4 rounded-2xl border border-red-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-serif font-bold text-sm text-red-950 dark:text-slate-100 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-red-700 dark:text-amber-400" />
                  <span>Kalkulator Porsi Resep:</span>
                </h4>
                <p className="text-xs text-red-800 dark:text-slate-400 font-sans">
                  Skala porsi standar ({recipe.yields}) otomatis menyesuaikan takaran bahan
                </p>
              </div>

              <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-red-300 dark:border-slate-700 shadow-xs">
                <button
                  onClick={() => setPortionMultiplier((p) => Math.max(0.5, p - 0.5))}
                  className="p-1.5 rounded-lg bg-red-100 dark:bg-slate-800 text-red-900 dark:text-slate-200 hover:bg-red-200 dark:hover:bg-slate-700 font-bold transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-red-950 dark:text-amber-300 font-mono">
                  {portionMultiplier}x
                </span>
                <button
                  onClick={() => setPortionMultiplier((p) => p + 0.5)}
                  className="p-1.5 rounded-lg bg-red-100 dark:bg-slate-800 text-red-900 dark:text-slate-200 hover:bg-red-200 dark:hover:bg-slate-700 font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ingredients Section */}
            <div ref={ingredientsSectionRef} className="space-y-3 pt-2">
              <h3 className="font-serif font-bold text-lg text-red-950 dark:text-slate-100 border-b border-red-200 dark:border-slate-800 pb-2 flex items-center justify-between">
                <span>Bahan-Bahan yang Dibutuhkan</span>
                <span className="text-xs text-red-700 dark:text-amber-400 font-sans font-normal">
                  (Klik untuk tandai sudah siap)
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ing, idx) => {
                  const scaledAmount = Math.round(ing.amount * portionMultiplier * 10) / 10;
                  const isChecked = checkedIngredients[idx] || false;
                  return (
                    <label
                      key={idx}
                      className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-slate-500 line-through'
                          : 'bg-white dark:bg-slate-800 border-red-200 dark:border-slate-700 text-red-950 dark:text-slate-200 hover:bg-rose-50/50 dark:hover:bg-slate-750'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setCheckedIngredients((prev) => ({
                            ...prev,
                            [idx]: !prev[idx],
                          }))
                        }
                        className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 border-red-300 dark:border-slate-600"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-red-900 dark:text-amber-400">
                          {scaledAmount} {ing.unit}
                        </span>{' '}
                        <span>{ing.name}</span>
                        {ing.notes && (
                          <span className="block text-[11px] text-red-700 dark:text-slate-400 italic mt-0.5">
                            * {ing.notes}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Instructions Step by Step */}
            <div ref={stepsSectionRef} className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-red-200 dark:border-slate-800 pb-2">
                <h3 className="font-serif font-bold text-lg text-red-950 dark:text-slate-100">
                  Langkah Pembuatan (Tahap demi Tahap)
                </h3>
                <span className="text-xs text-red-700 dark:text-amber-400 font-medium">
                  {Object.values(checkedSteps).filter(Boolean).length} / {recipe.instructions.length} Langkah Selesai
                </span>
              </div>

              <div className="space-y-3">
                {recipe.instructions.map((step) => {
                  const isStepChecked = checkedSteps[step.stepNumber] || false;
                  const isStepTimerActive = activeTimer?.stepNumber === step.stepNumber;
                  const hasTimer = typeof step.timerMinutes === 'number' && step.timerMinutes > 0;

                  return (
                    <div
                      key={step.stepNumber}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all relative ${
                        isStepChecked
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-slate-500'
                          : isStepTimerActive
                          ? 'bg-amber-50/90 dark:bg-slate-850 border-amber-400 dark:border-amber-400/80 shadow-md ring-2 ring-amber-400/30'
                          : 'bg-white dark:bg-slate-800 border-red-200 dark:border-slate-700'
                      }`}
                    >
                      {/* Active Step Indicator Flag */}
                      {isStepTimerActive && (
                        <div className="absolute -top-2.5 right-4 bg-amber-400 text-red-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1">
                          <Flame className="w-3 h-3 text-red-700 animate-bounce" />
                          <span>Timer Sedang Berjalan ({formatTimerTime(activeTimer.secondsLeft)})</span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="checkbox"
                            checked={isStepChecked}
                            onChange={() =>
                              setCheckedSteps((prev) => ({
                                ...prev,
                                [step.stepNumber]: !prev[step.stepNumber],
                              }))
                            }
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 border-red-300 dark:border-slate-600 cursor-pointer"
                          />
                          <span className="font-serif font-bold text-sm sm:text-base text-red-950 dark:text-slate-100">
                            {step.stepNumber}. {step.title}
                          </span>
                        </div>

                        {/* Interactive Step Timer Trigger Button */}
                        {hasTimer ? (
                          <button
                            onClick={() => startStepTimer(step.timerMinutes!, step.stepNumber, `Langkah ${step.stepNumber}: ${step.title}`)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs ${
                              isStepTimerActive
                                ? 'bg-amber-400 text-red-950 ring-2 ring-amber-300 font-extrabold'
                                : 'bg-red-100 dark:bg-slate-700 text-red-900 dark:text-amber-300 hover:bg-red-200 dark:hover:bg-slate-600 border border-red-200 dark:border-slate-600'
                            }`}
                            title={`Mulai Countdown Timer ${step.timerMinutes} Menit untuk Langkah Ini`}
                          >
                            <Clock className={`w-3.5 h-3.5 ${isStepTimerActive ? 'text-red-950 animate-spin' : 'text-red-700 dark:text-amber-400'}`} />
                            <span>
                              {isStepTimerActive ? `${formatTimerTime(activeTimer.secondsLeft)}` : `Timer ${step.timerMinutes} Mnt`}
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => startStepTimer(5, step.stepNumber, `Langkah ${step.stepNumber}: ${step.title}`)}
                            className="opacity-60 hover:opacity-100 flex items-center space-x-1 text-[11px] text-red-700 dark:text-slate-400 hover:text-red-900 transition-opacity cursor-pointer shrink-0"
                            title="Atur timer manual untuk langkah ini"
                          >
                            <Clock className="w-3 h-3" />
                            <span>+ Timer</span>
                          </button>
                        )}
                      </div>

                      <p className={`text-xs sm:text-sm leading-relaxed pl-7 ${isStepChecked ? 'line-through text-slate-500' : 'text-red-900 dark:text-slate-300'}`}>
                        {step.instruction}
                      </p>

                      {step.tip && (
                        <div className="mt-2.5 ml-7 p-2.5 rounded-xl bg-rose-50 dark:bg-slate-900/90 border border-red-200 dark:border-slate-700 text-[11px] text-red-800 dark:text-slate-300 italic flex items-start space-x-1.5">
                          <span className="text-amber-500 shrink-0">💡</span>
                          <span><strong>Tips:</strong> {step.tip}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ESTIMATED NUTRITIONAL VALUES SECTION */}
            {recipe.nutrition && (() => {
              const isBatch = nutritionViewMode === 'batch';
              const multiplier = isBatch ? (recipe.nutrition.servingsPerRecipe * portionMultiplier) : 1;
              const calcCalories = Math.round(recipe.nutrition.calories * multiplier);
              const calcProtein = Math.round(recipe.nutrition.protein * multiplier * 10) / 10;
              const calcFat = Math.round(recipe.nutrition.fat * multiplier * 10) / 10;
              const calcCarbs = Math.round(recipe.nutrition.carbs * multiplier * 10) / 10;
              const calcSugar = Math.round(recipe.nutrition.sugar * multiplier * 10) / 10;
              const calcFiber = Math.round(recipe.nutrition.fiber * multiplier * 10) / 10;
              const calcSodium = recipe.nutrition.sodium ? Math.round(recipe.nutrition.sodium * multiplier) : undefined;
              const totalServings = Math.round(recipe.nutrition.servingsPerRecipe * portionMultiplier);

              // Standard Indonesian reference daily intake (AKG Kemenkes ~2150 kkal)
              const calAkg = Math.min(100, Math.round((calcCalories / 2150) * 100));
              const protAkg = Math.min(100, Math.round((calcProtein / 65) * 100));
              const fatAkg = Math.min(100, Math.round((calcFat / 67) * 100));
              const carbsAkg = Math.min(100, Math.round((calcCarbs / 300) * 100));
              const fiberAkg = Math.min(100, Math.round((calcFiber / 30) * 100));
              const sugarAkg = Math.min(100, Math.round((calcSugar / 50) * 100));

              return (
                <div ref={nutritionSectionRef} className="bg-white dark:bg-slate-800/95 border border-red-200/90 dark:border-slate-700 p-5 rounded-2xl shadow-xs space-y-4">
                  {/* Section Title and Mode Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-100 dark:border-slate-700/80 pb-3.5">
                    <div>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-red-950 dark:text-slate-100 flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-red-700 dark:text-amber-400 shrink-0" />
                        <span>Estimasi Informasi Nilai Gizi</span>
                      </h4>
                      <p className="text-xs text-red-800/80 dark:text-slate-400 mt-0.5">
                        {isBatch
                          ? `Total estimasi kandungan gizi untuk seluruh hasil jadi (${recipe.yields} x ${portionMultiplier})`
                          : `Estimasi nilai gizi per sajian standar (${recipe.nutrition.servingSize})`}
                      </p>
                    </div>

                    {/* Serving vs Batch Toggle */}
                    <div className="flex items-center bg-rose-50 dark:bg-slate-900 p-1 rounded-xl border border-red-200 dark:border-slate-700 text-xs shrink-0">
                      <button
                        onClick={() => setNutritionViewMode('serving')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          !isBatch
                            ? 'bg-red-800 text-white shadow-xs'
                            : 'text-red-900 dark:text-slate-300 hover:text-red-950 dark:hover:text-white'
                        }`}
                      >
                        Per Porsi ({recipe.nutrition.servingSize.split('(')[0].trim()})
                      </button>
                      <button
                        onClick={() => setNutritionViewMode('batch')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          isBatch
                            ? 'bg-red-800 text-white shadow-xs'
                            : 'text-red-900 dark:text-slate-300 hover:text-red-950 dark:hover:text-white'
                        }`}
                      >
                        Total Resep ({portionMultiplier}x Batch)
                      </button>
                    </div>
                  </div>

                  {/* 4 Main Macro Cards: Calories, Protein, Fat, Carbs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Calories */}
                    <div className="bg-amber-50/90 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-3.5 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center justify-between text-amber-900 dark:text-amber-300">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Kalori</span>
                        <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="my-1.5">
                        <span className="font-mono text-2xl font-extrabold text-amber-950 dark:text-amber-200">
                          {calcCalories}
                        </span>
                        <span className="text-xs text-amber-800 dark:text-amber-300 ml-1 font-medium">kkal</span>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-amber-200/70 dark:bg-amber-900/40 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, calAkg)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-amber-800 dark:text-amber-400 font-mono block">
                          ~{calAkg}% AKG Harian
                        </span>
                      </div>
                    </div>

                    {/* Protein */}
                    <div className="bg-blue-50/90 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 p-3.5 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center justify-between text-blue-900 dark:text-blue-300">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Protein</span>
                        <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="my-1.5">
                        <span className="font-mono text-2xl font-extrabold text-blue-950 dark:text-blue-200">
                          {calcProtein}
                        </span>
                        <span className="text-xs text-blue-800 dark:text-blue-300 ml-1 font-medium">gram</span>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-blue-200/70 dark:bg-blue-900/40 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, protAkg)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-blue-800 dark:text-blue-400 font-mono block">
                          ~{protAkg}% AKG Harian
                        </span>
                      </div>
                    </div>

                    {/* Fat */}
                    <div className="bg-rose-50/90 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 p-3.5 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center justify-between text-rose-900 dark:text-rose-300">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Lemak (Fat)</span>
                        <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div className="my-1.5">
                        <span className="font-mono text-2xl font-extrabold text-rose-950 dark:text-rose-200">
                          {calcFat}
                        </span>
                        <span className="text-xs text-rose-800 dark:text-rose-300 ml-1 font-medium">gram</span>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-rose-200/70 dark:bg-rose-900/40 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, fatAkg)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-rose-800 dark:text-rose-400 font-mono block">
                          ~{fatAkg}% AKG Harian
                        </span>
                      </div>
                    </div>

                    {/* Carbohydrates */}
                    <div className="bg-emerald-50/90 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-3.5 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center justify-between text-emerald-900 dark:text-emerald-300">
                        <span className="text-[11px] font-bold uppercase tracking-wider">Karbohidrat</span>
                        <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="my-1.5">
                        <span className="font-mono text-2xl font-extrabold text-emerald-950 dark:text-emerald-200">
                          {calcCarbs}
                        </span>
                        <span className="text-xs text-emerald-800 dark:text-emerald-300 ml-1 font-medium">gram</span>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-emerald-200/70 dark:bg-emerald-900/40 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, carbsAkg)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-mono block">
                          ~{carbsAkg}% AKG Harian
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Nutrients Grid: Sugar, Fiber, Sodium, Serving Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="bg-rose-50/60 dark:bg-slate-900/70 p-2.5 rounded-xl border border-red-100 dark:border-slate-700/80">
                      <span className="text-[10px] text-red-800 dark:text-slate-400 block font-medium">
                        Serat (Pektin Apel):
                      </span>
                      <strong className="text-red-950 dark:text-amber-300 font-mono text-sm">
                        {calcFiber} g
                      </strong>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">
                        ({fiberAkg}% AKG)
                      </span>
                    </div>

                    <div className="bg-rose-50/60 dark:bg-slate-900/70 p-2.5 rounded-xl border border-red-100 dark:border-slate-700/80">
                      <span className="text-[10px] text-red-800 dark:text-slate-400 block font-medium">
                        Gula (Alami & Olahan):
                      </span>
                      <strong className="text-red-950 dark:text-amber-300 font-mono text-sm">
                        {calcSugar} g
                      </strong>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 block">
                        ({sugarAkg}% AKG)
                      </span>
                    </div>

                    <div className="bg-rose-50/60 dark:bg-slate-900/70 p-2.5 rounded-xl border border-red-100 dark:border-slate-700/80">
                      <span className="text-[10px] text-red-800 dark:text-slate-400 block font-medium">
                        Natrium (Sodium):
                      </span>
                      <strong className="text-red-950 dark:text-amber-300 font-mono text-sm">
                        {calcSodium ?? 0} mg
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        Rendah Garam
                      </span>
                    </div>

                    <div className="bg-rose-50/60 dark:bg-slate-900/70 p-2.5 rounded-xl border border-red-100 dark:border-slate-700/80">
                      <span className="text-[10px] text-red-800 dark:text-slate-400 block font-medium">
                        Total Porsi Resep:
                      </span>
                      <strong className="text-red-950 dark:text-amber-300 font-mono text-sm">
                        {totalServings} Sajian
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        @{recipe.nutrition.servingSize.split('(')[0].trim()}
                      </span>
                    </div>
                  </div>

                  {/* Health Benefits & Nutrition Notes */}
                  {recipe.nutrition.healthNotes && recipe.nutrition.healthNotes.length > 0 && (
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 p-3.5 rounded-xl space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Keunggulan Gizi & Manfaat Buah Apel Anna:</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-emerald-950 dark:text-slate-200">
                        {recipe.nutrition.healthNotes.map((note, nIdx) => (
                          <li key={nIdx} className="flex items-start space-x-1.5 text-[11px]">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Footnote */}
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 italic">
                    *Persen Angka Kecukupan Gizi (% AKG) dihitung berdasarkan acuan standar rata-rata energi harian 2150 kkal (Permenkes RI / BPOM). Kebutuhan energi Anda mungkin lebih tinggi atau lebih rendah tergantung pada usia dan aktivitas fisik.
                  </p>
                </div>
              );
            })()}

            {/* Pro Tips */}
            {recipe.proTips && recipe.proTips.length > 0 && (
              <div className="bg-red-900 dark:bg-slate-800 text-red-50 dark:text-slate-100 p-5 rounded-2xl border border-red-800 dark:border-slate-700 space-y-2">
                <h4 className="font-serif font-bold text-sm text-red-200 dark:text-amber-300 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Tips Rahasia Sukses Khas Sumbergondo:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-red-100 dark:text-slate-300 list-disc pl-4">
                  {recipe.proTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* HPP Summary */}
            {recipe.hpp && (
              <div ref={hppSectionRef} className="bg-emerald-50 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 p-5 rounded-2xl space-y-2 text-emerald-950 dark:text-slate-100">
                <h4 className="font-serif font-bold text-sm flex items-center space-x-1.5 text-emerald-900 dark:text-emerald-400">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Simulasi Potensi Usaha UMKM ({recipe.title})</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 font-medium">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200 dark:border-slate-700">
                    <span className="text-[10px] text-emerald-700 dark:text-slate-400 block">Estimasi HPP Modal</span>
                    <span className="font-bold text-emerald-950 dark:text-slate-100">
                      Rp {(recipe.hpp.baseCostPerYield * portionMultiplier).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200 dark:border-slate-700">
                    <span className="text-[10px] text-emerald-700 dark:text-slate-400 block">Biaya Kemasan</span>
                    <span className="font-bold text-emerald-950 dark:text-slate-100">
                      Rp {(recipe.hpp.packagingCostPerJar * portionMultiplier).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200 dark:border-slate-700">
                    <span className="text-[10px] text-emerald-700 dark:text-slate-400 block">Harga Jual Disarankan</span>
                    <span className="font-bold text-emerald-900 dark:text-emerald-400">
                      Rp {(recipe.hpp.recommendedPrice * portionMultiplier).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200 dark:border-slate-700">
                    <span className="text-[10px] text-emerald-700 dark:text-slate-400 block">Margin Keuntungan</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      +{recipe.hpp.marginPercent}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Floating Timer Bar at Bottom of Modal (when timer is running and scrolled) */}
        {activeTimer && (
            <div className="bg-red-950 dark:bg-slate-900 border-t border-red-800 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-white shrink-0 shadow-lg">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                <div className="flex flex-col">
                  <span className="font-mono text-sm font-bold text-amber-300">
                    {formatTimerTime(activeTimer.secondsLeft)}
                  </span>
                  <span className="text-[10px] text-red-300 dark:text-slate-400 line-clamp-1">
                    {activeTimer.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTimerPause}
                  className="px-2.5 py-1 rounded-lg bg-red-800 dark:bg-slate-800 text-white font-bold text-[11px] hover:bg-red-700 transition-colors cursor-pointer"
                >
                  {activeTimer.isRunning ? 'Jeda' : 'Lanjut'}
                </button>
                <button
                  onClick={() => timerSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="p-1 rounded-lg bg-red-800 dark:bg-slate-800 text-amber-300 hover:text-white transition-colors cursor-pointer"
                  title="Lihat Timer Lengkap"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="p-4 bg-rose-100/80 dark:bg-slate-900 border-t border-red-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-xs text-red-800 dark:text-slate-400 font-medium">
              Resep Otentik E-Book UMKM Sumbergondo
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrintRecipe}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-red-300 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-slate-750 text-red-950 dark:text-slate-200 font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                title="Cetak Resep ke Printer"
              >
                <Printer className="w-3.5 h-3.5 text-red-800 dark:text-amber-400" />
                <span>Cetak Lembar Resep</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-red-950 font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isExportingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{isExportingPdf ? 'Merender...' : 'Unduh Lembar PDF'}</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-red-900 dark:bg-slate-800 text-red-100 dark:text-slate-200 hover:bg-red-800 dark:hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer border dark:border-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DEDICATED PRINTABLE RESEP SHEET (A4 / Standard Paper) */}
      {/* Rendered only when user triggers Cetak Resep from modal */}
      {/* ======================================================== */}
      <div
        id="recipe-print-sheet"
        className="hidden text-black font-sans leading-normal bg-white"
        style={{
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <div className="p-6 max-w-4xl mx-auto space-y-4 border-2 border-red-950/60 rounded-2xl">
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b-2 border-red-900 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-red-900 text-white flex items-center justify-center text-2xl font-serif font-bold">
                🍏
              </div>
              <div>
                <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest block">
                  BUKU SAKU KREASI SELAI APEL ANNA • SUMBERGONDO BUMIAJI KOTA BATU
                </span>
                <h1 className="font-serif text-2xl font-extrabold text-red-950 leading-tight">
                  {recipe.title}
                </h1>
                <p className="text-xs text-red-800 font-serif italic">
                  {recipe.subtitle}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-red-900 text-white text-xs font-bold uppercase rounded-md mb-1 whitespace-nowrap">
                {recipe.categoryLabel}
              </span>
              <p className="text-[10px] text-gray-600 font-mono">
                Porsi: {portionMultiplier}x Batch ({recipe.yields})
              </p>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 bg-rose-50/70 border border-red-200 rounded-xl">
            <div className="border-r border-red-200 p-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Persiapan</span>
              <span className="font-bold text-red-950">{recipe.prepTime}</span>
            </div>
            <div className="border-r border-red-200 p-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Waktu Masak</span>
              <span className="font-bold text-red-950">{recipe.cookTime}</span>
            </div>
            <div className="border-r border-red-200 p-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Hasil Jadi</span>
              <span className="font-bold text-red-950">{recipe.yields}</span>
            </div>
            <div className="p-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Tingkat Kesulitan</span>
              <span className="font-bold text-red-950 capitalize">{recipe.difficulty}</span>
            </div>
          </div>

          {/* 2-Column Content: Ingredients & Instructions */}
          <div className="grid grid-cols-12 gap-5 pt-1">
            {/* Left Column: Ingredients (5 cols) */}
            <div className="col-span-5 border-r border-red-200 pr-4 space-y-2">
              <h3 className="font-serif font-bold text-sm text-red-950 border-b border-red-800 pb-1 flex items-center space-x-1.5">
                <ChefHat className="w-4 h-4 text-red-700" />
                <span>Bahan & Takaran ({portionMultiplier}x):</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-red-950">
                {recipe.ingredients.map((ing, idx) => {
                  const scaledAmount = Math.round(ing.amount * portionMultiplier * 10) / 10;
                  return (
                    <li key={idx} className="flex items-start space-x-2 py-0.5">
                      <span className="text-gray-400 font-mono select-none">☐</span>
                      <div className="flex-1 leading-tight">
                        <strong className="text-red-900 font-bold font-mono">
                          {scaledAmount} {ing.unit}
                        </strong>{' '}
                        <span>{ing.name}</span>
                        {ing.notes && (
                          <span className="text-[10px] text-gray-600 italic block">
                            * {ing.notes}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* HPP Box in Print */}
              {recipe.hpp && (
                <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-[11px] text-emerald-950 space-y-1">
                  <span className="font-bold text-emerald-900 block border-b border-emerald-200 pb-0.5">
                    💰 Analisis Usaha UMKM:
                  </span>
                  <div className="flex justify-between">
                    <span>HPP Modal:</span>
                    <strong className="font-mono">Rp {(recipe.hpp.baseCostPerYield * portionMultiplier).toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Saran Harga Jual:</span>
                    <strong className="font-mono text-emerald-800">Rp {(recipe.hpp.recommendedPrice * portionMultiplier).toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex justify-between text-[10px] text-emerald-700">
                    <span>Margin Bersih:</span>
                    <strong>+{recipe.hpp.marginPercent}%</strong>
                  </div>
                </div>
              )}

              {/* Nutrition Summary Box in Print */}
              {recipe.nutrition && (
                <div className="mt-2.5 p-2.5 bg-amber-50/80 border border-amber-300 rounded-xl text-[10.5px] text-amber-950 space-y-1">
                  <span className="font-bold text-amber-900 block border-b border-amber-200 pb-0.5">
                    🥗 Estimasi Nilai Gizi ({recipe.nutrition.servingSize}):
                  </span>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-0.5 font-mono text-[10px]">
                    <div>Kalori: <strong>{recipe.nutrition.calories} kkal</strong></div>
                    <div>Protein: <strong>{recipe.nutrition.protein} g</strong></div>
                    <div>Lemak: <strong>{recipe.nutrition.fat} g</strong></div>
                    <div>Karbo: <strong>{recipe.nutrition.carbs} g</strong></div>
                    <div>Serat: <strong>{recipe.nutrition.fiber} g</strong></div>
                    <div>Gula: <strong>{recipe.nutrition.sugar} g</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Step-by-Step Instructions (7 cols) */}
            <div className="col-span-7 space-y-2">
              <h3 className="font-serif font-bold text-sm text-red-950 border-b border-red-800 pb-1 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-red-700" />
                <span>Tahapan Pembuatan:</span>
              </h3>
              <ol className="space-y-2.5 text-xs text-red-950">
                {recipe.instructions.map((step) => (
                  <li key={step.stepNumber} className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-red-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1 leading-snug">
                      <strong className="text-red-950 font-bold block mb-0.5">
                        {step.title} {step.timerMinutes ? `(${step.timerMinutes} menit)` : ''}
                      </strong>
                      <p className="text-gray-800">{step.instruction}</p>
                      {step.tip && (
                        <p className="text-[10px] text-red-800 italic mt-0.5">
                          💡 Tips: {step.tip}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Pro Tips Section */}
          {recipe.proTips && recipe.proTips.length > 0 && (
            <div className="p-2.5 bg-rose-50 border border-red-200 rounded-xl text-xs space-y-1">
              <span className="font-serif font-bold text-red-950 block">
                ⭐ Tips Rahasia Sukses Pembuatan:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-red-900">
                {recipe.proTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-2 border-t border-gray-300 flex items-center justify-between text-[9.5px] text-gray-500">
            <span>
              Luaran Proyek Kepemimpinan PGSD FKIP Universitas Muhammadiyah Malang • Pembimbing: Dr. Anis Farida Jamil, M.Pd.
            </span>
            <span>
              Desa Sumbergondo, Kota Batu
            </span>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar / Spinner for Recipe Download */}
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
    </>
  );
};


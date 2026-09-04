import React from 'react';
import { Loader2, CheckCircle2, FileDown, Sparkles, X, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface PdfExportProgressState {
  isExporting: boolean;
  progressPercent: number;
  statusText: string;
  currentPage?: number;
  totalPages?: number;
  documentTitle?: string;
  isCompleted?: boolean;
}

interface PdfExportProgressBarProps {
  state: PdfExportProgressState;
  onDismiss?: () => void;
}

export const PdfExportProgressBar: React.FC<PdfExportProgressBarProps> = ({
  state,
  onDismiss,
}) => {
  if (!state.isExporting && !state.isCompleted) {
    return null;
  }

  const {
    progressPercent = 0,
    statusText = 'Sedang memproses berkas PDF...',
    currentPage,
    totalPages,
    documentTitle = 'Buku Resep Selai Apel dan Olahannya (PDF)',
    isCompleted = false,
  } = state;

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none no-print">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-lg bg-[#200808]/95 border-2 border-red-500/80 backdrop-blur-xl text-white p-4 sm:p-5 rounded-2xl shadow-2xl shadow-red-950/80 overflow-hidden relative"
        >
          {/* Top subtle glow bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-red-500 to-rose-400"></div>

          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center space-x-3 min-w-0">
              <div
                className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-red-900/90 text-amber-300 border border-red-700">
                    {isCompleted ? 'EKSPOR SELESAI' : 'PROSES EKSPOR PDF'}
                  </span>
                  {totalPages && totalPages > 1 && (
                    <span className="text-[10px] font-mono font-bold text-red-300">
                      {currentPage || 1}/{totalPages} Hal
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-red-100 truncate mt-0.5">
                  {documentTitle}
                </h4>
              </div>
            </div>

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1 rounded-lg text-red-300 hover:text-white hover:bg-red-900/60 transition-colors shrink-0"
                title="Tutup Notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Real-time Status Text Message */}
          <div className="flex items-center justify-between text-xs mb-2">
            <p className="text-red-200 font-medium truncate pr-2">
              {statusText}
            </p>
            <span className="font-mono font-bold text-amber-400 text-xs shrink-0">
              {progressPercent}%
            </span>
          </div>

          {/* Visual Progress Bar Track */}
          <div className="w-full bg-red-950/80 rounded-full h-2.5 border border-red-800/80 overflow-hidden relative shadow-inner">
            <motion.div
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-amber-400 via-red-500 to-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
              animate={
                !isCompleted
                  ? {
                      backgroundPosition: ['0% 50%', '100% 50%'],
                    }
                  : undefined
              }
            />
          </div>

          {/* Subtext info */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-red-300/80 border-t border-red-900/60 pt-2">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Format Landscape 20,5 cm x 29,7 cm (High Quality 1:1)</span>
            </span>
            <span className="font-mono">Sumbergondo</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

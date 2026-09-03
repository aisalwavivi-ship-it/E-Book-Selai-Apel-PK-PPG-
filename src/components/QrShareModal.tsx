import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Share2, Sparkles, ExternalLink } from 'lucide-react';

interface QrShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrShareModal: React.FC<QrShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate QR code image URL using QR code API
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    currentUrl
  )}&color=7f1d1d&bg=ffe4e6`;

  return (
    <div className="fixed inset-0 z-50 bg-red-950/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 no-print">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-red-300 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-6 text-red-950 dark:text-slate-100 relative transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-red-100 dark:bg-slate-800 text-red-900 dark:text-slate-200 hover:bg-red-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-slate-800 text-red-900 dark:text-amber-400 flex items-center justify-center mx-auto text-xl">
            📲
          </div>
          <h3 className="font-serif font-bold text-2xl text-red-950 dark:text-slate-100">
            Bagikan E-Book Selai Apel
          </h3>
          <p className="text-xs text-red-800 dark:text-slate-400">
            Pindai QR Code atau salin link web ini untuk ditempelkan pada stiker label kemasan produk UMKM Desa Sumbergondo!
          </p>
        </div>

        {/* QR Code Graphic Container */}
        <div className="bg-rose-50 dark:bg-slate-800/80 p-6 rounded-2xl border-2 border-red-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-white rounded-xl shadow-inner border border-red-300 dark:border-slate-600">
            <img
              src={qrApiUrl}
              alt="QR Code E-Book Selai Apel"
              className="w-44 h-44 object-contain rounded"
            />
          </div>
          <span className="text-[11px] font-bold text-red-900 dark:text-amber-300 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
            <span>Pindai Kamera Ponsel Langsung</span>
          </span>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-red-900 dark:text-slate-200">
            URL Web E-Book Resmi:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3 py-2 text-xs font-mono bg-rose-50 dark:bg-slate-800 border border-red-200 dark:border-slate-700 rounded-xl text-red-950 dark:text-slate-100 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-red-900 dark:bg-amber-500 text-red-100 dark:text-slate-950 hover:bg-red-800 dark:hover:bg-amber-400 text-xs font-bold transition-colors flex items-center space-x-1 shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-slate-950" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-red-100 dark:bg-slate-800 text-red-900 dark:text-slate-200 hover:bg-red-200 dark:hover:bg-slate-700 font-bold text-xs transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

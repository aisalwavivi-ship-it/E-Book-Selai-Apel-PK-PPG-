import React, { useState } from 'react';
import {
  umkmKitchenTipsData,
  quickChecklistUMKM,
  KitchenTipCategory,
  KitchenTipItem
} from '../data/kitchenTipsData';
import {
  Lightbulb,
  ShieldCheck,
  Clock,
  Sparkles,
  Thermometer,
  Flame,
  AlertCircle,
  CheckCircle2,
  X,
  Volume2,
  Check,
  Copy,
  ChevronRight,
  BookmarkCheck,
  ChefHat
} from 'lucide-react';

interface UmkmKitchenTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  speakText?: (text: string) => void;
  onNavigateToPage?: (pageNumber: number) => void;
}

export const UmkmKitchenTipsModal: React.FC<UmkmKitchenTipsModalProps> = ({
  isOpen,
  onClose,
  speakText,
  onNavigateToPage
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ketahanan' | 'kebersihan' | 'checklist'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [copiedTipId, setCopiedTipId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyTip = (tip: KitchenTipItem) => {
    const textToCopy = `[TIPS DAPUR UMKM - ${tip.title}]\nAturan Utama: ${tip.keyRule}\nRingkasan: ${tip.shortSummary}\nDetail:\n${tip.details.map((d) => `- ${d}`).join('\n')}\n(Buku Saku Selai Apel Desa Sumbergondo)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedTipId(tip.id);
    setTimeout(() => setCopiedTipId(null), 2000);
  };

  const handleSpeakCategory = (cat: KitchenTipCategory) => {
    if (!speakText) return;
    const textToRead = `${cat.title}. ${cat.subtitle}. ` +
      cat.tips.map((t) => `${t.title}. Aturan utama: ${t.keyRule}. ${t.shortSummary}`).join('. ');
    speakText(textToRead);
  };

  const renderIcon = (name: KitchenTipItem['iconName']) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'Thermometer':
        return <Thermometer className="w-5 h-5 text-rose-600 shrink-0" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-600 shrink-0" />;
      case 'AlertCircle':
        return <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />;
      case 'Clock':
      default:
        return <Clock className="w-5 h-5 text-red-700 shrink-0" />;
    }
  };

  // Filter tips based on search
  const filteredCategories = umkmKitchenTipsData.map((cat) => ({
    ...cat,
    tips: cat.tips.filter(
      (tip) =>
        tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.keyRule.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.details.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter((cat) => activeTab === 'all' || activeTab === cat.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-red-950/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div
        className="bg-[#fdfaf7] dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border-4 border-red-900/30 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 dark:from-slate-900 dark:via-red-950 dark:to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-red-800/60 dark:bg-slate-800 hover:bg-red-700 dark:hover:bg-slate-700 text-red-100 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2.5 mb-2">
            <span className="p-2 rounded-xl bg-amber-400 text-red-950 shadow-sm">
              <Lightbulb className="w-5 h-5 fill-amber-300" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-amber-300">
              PANDUAN PRAKTIS PRODUKSI UMKM
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Tips Dapur UMKM: Ketahanan Selai & Kebersihan Kemasan
          </h2>
          <p className="text-xs sm:text-sm text-red-200 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Kumpulan saran singkat, standar higienitas toples kaca, teknik vakum alami, dan kiat memperpanjang masa simpan selai apel Desa Sumbergondo tanpa bahan pengawet sintesis.
          </p>

          {/* Quick Filter Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-red-800/80 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-amber-400 text-red-950 shadow-md'
                  : 'bg-red-800/70 dark:bg-slate-800 text-red-100 dark:text-slate-300 hover:bg-red-800 dark:hover:bg-slate-700'
              }`}
            >
              Semua Tips (8 Kiat)
            </button>
            <button
              onClick={() => setActiveTab('ketahanan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'ketahanan'
                  ? 'bg-amber-400 text-red-950 shadow-md'
                  : 'bg-red-800/70 dark:bg-slate-800 text-red-100 dark:text-slate-300 hover:bg-red-800 dark:hover:bg-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Ketahanan Produk (4)</span>
            </button>
            <button
              onClick={() => setActiveTab('kebersihan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'kebersihan'
                  ? 'bg-amber-400 text-red-950 shadow-md'
                  : 'bg-red-800/70 dark:bg-slate-800 text-red-100 dark:text-slate-300 hover:bg-red-800 dark:hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kebersihan Kemasan (4)</span>
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'checklist'
                  ? 'bg-emerald-400 text-emerald-950 shadow-md'
                  : 'bg-emerald-800/70 dark:bg-emerald-950 text-emerald-100 dark:text-emerald-300 hover:bg-emerald-800 dark:hover:bg-emerald-900'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Checklist Dapur ({checkedItems.length}/{quickChecklistUMKM.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Search Bar */}
        <div className="p-3 sm:px-6 bg-red-100/50 dark:bg-slate-850 dark:bg-slate-800/60 border-b border-red-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Cari saran praktis (misal: 'sterilisasi', 'lemon', 'daya simpan', 'sendok')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-red-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-red-950 dark:text-slate-100 placeholder-red-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-amber-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-red-800 dark:text-slate-300 font-bold px-2 py-1 bg-red-200 dark:bg-slate-700 rounded-lg shrink-0 hover:bg-red-300 dark:hover:bg-slate-600 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: CHECKLIST PRODUCTION PREP */}
          {activeTab === 'checklist' ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 p-4 rounded-2xl flex items-start space-x-3 text-emerald-950 dark:text-slate-100">
                <ChefHat className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-bold text-base text-emerald-950 dark:text-emerald-300">
                    Checklist Kesiapan Higienitas Dapur UMKM
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Centang seluruh langkah sebelum memulai produksi massal selai apel untuk memastikan keamanan pangan dan masa simpan maksimal.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-slate-800 divide-y divide-red-100 dark:divide-slate-800 overflow-hidden shadow-xs">
                {quickChecklistUMKM.map((item, idx) => {
                  const isDone = checkedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-4 flex items-start space-x-3 cursor-pointer transition-colors ${
                        isDone ? 'bg-emerald-50/60 dark:bg-emerald-950/30' : 'hover:bg-red-50/40 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all mt-0.5 ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                            : 'border-red-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold text-red-900 dark:text-amber-400 block mb-0.5">
                          Langkah Standar {idx + 1}
                        </span>
                        <p
                          className={`text-xs sm:text-sm font-medium ${
                            isDone ? 'line-through text-emerald-900 dark:text-slate-500' : 'text-red-950 dark:text-slate-200'
                          }`}
                        >
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {checkedItems.length === quickChecklistUMKM.length && (
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-md text-center space-y-1 animate-in zoom-in-95 duration-200">
                  <div className="inline-flex p-2 rounded-full bg-white/20 mb-1">
                    <CheckCircle2 className="w-6 h-6 text-amber-300" />
                  </div>
                  <h4 className="font-serif font-bold text-base">
                    Luar Biasa! Semua Standar Dapur Terpenuhi
                  </h4>
                  <p className="text-xs text-emerald-100">
                    Produk selai apel siap diproduksi dengan jaminan mutu higienis dan daya simpan alami hingga 6 bulan.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2 & 3: CATEGORIZED TIPS CARDS */
            <div className="space-y-6">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
                  <p className="text-sm font-bold text-red-900 dark:text-slate-200">
                    Tidak ditemukan tips yang sesuai dengan kata kunci "{searchQuery}".
                  </p>
                  <p className="text-xs text-red-700 dark:text-slate-400">
                    Silakan gunakan kata kunci lain atau klik tombol Reset di atas.
                  </p>
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div key={category.id} className="space-y-3.5">
                    {/* Category Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-red-300 dark:border-slate-800 pb-2">
                      <div className="flex items-center space-x-2">
                        {category.id === 'ketahanan' ? (
                          <div className="w-8 h-8 rounded-xl bg-red-200 dark:bg-slate-800 text-red-950 dark:text-amber-300 flex items-center justify-center font-bold">
                            <Clock className="w-4 h-4 text-red-800 dark:text-amber-400" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-rose-200 dark:bg-slate-800 text-rose-950 dark:text-amber-300 flex items-center justify-center font-bold">
                            <ShieldCheck className="w-4 h-4 text-rose-800 dark:text-amber-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-serif font-bold text-lg text-red-950 dark:text-slate-100">
                            {category.title}
                          </h3>
                          <p className="text-xs text-red-800 dark:text-slate-400">{category.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 dark:bg-slate-800 text-red-900 dark:text-amber-300 border border-red-300 dark:border-slate-700">
                          {category.summaryBadge}
                        </span>

                        {speakText && (
                          <button
                            onClick={() => handleSpeakCategory(category)}
                            className="p-1.5 rounded-lg bg-red-200/80 dark:bg-slate-800 hover:bg-red-300 dark:hover:bg-slate-700 text-red-950 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                            title="Dengarkan Kategori Ini"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-red-800 dark:text-amber-400" />
                            <span className="text-[11px] hidden sm:inline">Dengarkan</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.tips.map((tip) => (
                        <div
                          key={tip.id}
                          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border-2 border-red-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-red-400 dark:hover:border-slate-700 transition-all space-y-3"
                        >
                          <div className="space-y-2">
                            {/* Card Header & Badge */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-1.5 rounded-lg bg-red-50 dark:bg-slate-800 border border-red-200 dark:border-slate-700">
                                  {renderIcon(tip.iconName)}
                                </div>
                                <span className="text-[10.5px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-red-100 dark:bg-slate-800 text-red-900 dark:text-amber-300 tracking-wider">
                                  {tip.badge}
                                </span>
                              </div>

                              <button
                                onClick={() => handleCopyTip(tip)}
                                className="text-red-700 dark:text-slate-400 hover:text-red-950 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Salin Ringkasan Tips Ini"
                              >
                                {copiedTipId === tip.id ? (
                                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Tersalin</span>
                                  </span>
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>

                            <h4 className="font-serif font-bold text-base text-red-950 dark:text-slate-100 leading-snug">
                              {tip.title}
                            </h4>

                            {/* Key Rule Box */}
                            <div className="bg-amber-50 dark:bg-amber-950/40 border-l-3 border-amber-500 p-2.5 rounded-r-xl text-xs text-amber-950 dark:text-amber-200 font-medium leading-relaxed">
                              <strong className="block text-amber-900 dark:text-amber-300 font-bold text-[11px] uppercase tracking-wide mb-0.5">
                                📌 Kiat Inti:
                              </strong>
                              {tip.keyRule}
                            </div>

                            {/* Bullet Points */}
                            <ul className="space-y-1 text-xs text-red-900 dark:text-slate-300 leading-relaxed pt-1">
                              {tip.details.map((detail, dIdx) => (
                                <li key={dIdx} className="flex items-start space-x-1.5">
                                  <span className="text-red-600 dark:text-amber-400 font-bold mt-0.5">•</span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Card Footer */}
                          <div className="pt-2 border-t border-red-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-red-700 dark:text-slate-400">
                            <span className="italic font-medium">Standar Produksi UMKM</span>
                            {onNavigateToPage && (
                              <button
                                onClick={() => {
                                  onClose();
                                  onNavigateToPage(category.id === 'ketahanan' ? 5 : 9);
                                }}
                                className="font-bold text-red-900 dark:text-amber-400 hover:text-red-950 dark:hover:text-amber-300 inline-flex items-center space-x-0.5 hover:underline cursor-pointer"
                              >
                                <span>Lihat di Halaman Buku</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 bg-red-900 dark:bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-t border-red-800 dark:border-slate-800">
          <div className="text-xs text-red-200 dark:text-slate-400">
            <strong>Sumber:</strong> Edisi Resmi Buku Saku Selai Apel • PGSD Universitas Muhammadiyah Malang 2026
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-red-950 font-bold text-xs transition-all shadow-md cursor-pointer ml-auto"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};

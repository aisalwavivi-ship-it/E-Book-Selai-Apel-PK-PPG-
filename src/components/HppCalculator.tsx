import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Sparkles, Printer, Check, HelpCircle } from 'lucide-react';

export const HppCalculator: React.FC = () => {
  // Preset types
  const [selectedPreset, setSelectedPreset] = useState<'selai' | 'nastar' | 'pie' | 'custom'>('selai');

  // Input states
  const [rawMaterialCost, setRawMaterialCost] = useState<number>(36000); // for 3 jars selai
  const [packagingCostUnit, setPackagingCostUnit] = useState<number>(4000); // jar + label
  const [operationalCost, setOperationalCost] = useState<number>(6000); // gas/listrik
  const [batchYield, setBatchYield] = useState<number>(3); // 3 jars
  const [targetSellingPrice, setTargetSellingPrice] = useState<number>(25000); // per jar
  const [monthlyTargetUnits, setMonthlyTargetUnits] = useState<number>(100);

  // Preset quick appliers
  const applyPreset = (preset: 'selai' | 'nastar' | 'pie' | 'custom') => {
    setSelectedPreset(preset);
    if (preset === 'selai') {
      setRawMaterialCost(36000);
      setPackagingCostUnit(4000);
      setOperationalCost(6000);
      setBatchYield(3);
      setTargetSellingPrice(25000);
    } else if (preset === 'nastar') {
      setRawMaterialCost(56000);
      setPackagingCostUnit(5000);
      setOperationalCost(10000);
      setBatchYield(2);
      setTargetSellingPrice(55000);
    } else if (preset === 'pie') {
      setRawMaterialCost(44000);
      setPackagingCostUnit(3000);
      setOperationalCost(8000);
      setBatchYield(2); // 2 boxes (@6 pcs)
      setTargetSellingPrice(40000);
    }
  };

  // Calculations
  const totalPackagingCost = packagingCostUnit * batchYield;
  const totalBatchCost = rawMaterialCost + totalPackagingCost + operationalCost;
  const hppPerUnit = batchYield > 0 ? Math.round(totalBatchCost / batchYield) : 0;
  const profitPerUnit = targetSellingPrice - hppPerUnit;
  const marginPercent = targetSellingPrice > 0 ? Math.round((profitPerUnit / targetSellingPrice) * 100) : 0;
  const monthlyProfitEstimate = profitPerUnit * monthlyTargetUnits;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 text-red-50 p-8 rounded-3xl shadow-xl border border-red-700 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-800/80 text-rose-200 text-xs font-semibold">
          <Calculator className="w-3.5 h-3.5 text-amber-400" />
          <span>Simulasi Usaha Rumahan Desa Sumbergondo</span>
        </div>
        <h2 className="font-serif text-3xl font-extrabold text-white tracking-tight">
          Kalkulator HPP & Margin Profit UMKM
        </h2>
        <p className="text-sm text-rose-200 max-w-2xl font-sans leading-relaxed">
          Hitung Harga Pokok Produksi (HPP), estimasi modal per jar/toples, serta proyeksi keuntungan usaha olahan selai apel dengan mudah dan akurat.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-red-900 dark:text-amber-400 uppercase tracking-wider">
          Pilihan Preset Produk:
        </span>
        <button
          onClick={() => applyPreset('selai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedPreset === 'selai'
              ? 'bg-red-900 dark:bg-amber-400 text-white dark:text-red-950 shadow-md'
              : 'bg-white dark:bg-slate-900 text-red-900 dark:text-slate-200 border border-red-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-slate-800'
          }`}
        >
          🍯 Selai Apel Anna (Jar 250g)
        </button>
        <button
          onClick={() => applyPreset('nastar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedPreset === 'nastar'
              ? 'bg-red-900 dark:bg-amber-400 text-white dark:text-red-950 shadow-md'
              : 'bg-white dark:bg-slate-900 text-red-900 dark:text-slate-200 border border-red-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-slate-800'
          }`}
        >
          🍪 Nastar Apel Batu (Toples 350g)
        </button>
        <button
          onClick={() => applyPreset('pie')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedPreset === 'pie'
              ? 'bg-red-900 dark:bg-amber-400 text-white dark:text-red-950 shadow-md'
              : 'bg-white dark:bg-slate-900 text-red-900 dark:text-slate-200 border border-red-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-slate-800'
          }`}
        >
          🥧 Pie Apel Mini (Box Isi 6)
        </button>
        <button
          onClick={() => applyPreset('custom')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedPreset === 'custom'
              ? 'bg-red-900 dark:bg-amber-400 text-white dark:text-red-950 shadow-md'
              : 'bg-white dark:bg-slate-900 text-red-900 dark:text-slate-200 border border-red-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-slate-800'
          }`}
        >
          ✏️ Custom Input
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-red-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <h3 className="font-serif font-bold text-lg text-red-950 dark:text-slate-100 border-b border-red-200 dark:border-slate-800 pb-3 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-red-700 dark:text-amber-400" />
            <span>Rincian Komponen Biaya Produksi</span>
          </h3>

          <div className="space-y-4">
            {/* Raw material cost */}
            <div>
              <label className="block text-xs font-bold text-red-900 dark:text-slate-200 mb-1">
                1. Biaya Bahan Baku Utama per Batch (Rp)
              </label>
              <input
                type="number"
                value={rawMaterialCost}
                onChange={(e) => setRawMaterialCost(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-red-200 dark:border-slate-700 text-red-950 dark:text-slate-100 text-sm font-bold focus:ring-2 focus:ring-red-500 dark:focus:ring-amber-500 bg-rose-50/30 dark:bg-slate-800"
              />
              <span className="text-[11px] text-red-700 dark:text-slate-400 italic">
                * Contoh: Apel afkir/BS, gula pasir, kayu manis, lemon, dll.
              </span>
            </div>

            {/* Packaging cost per unit */}
            <div>
              <label className="block text-xs font-bold text-red-900 dark:text-slate-200 mb-1">
                2. Biaya Kemasan & Label per Unit (Rp)
              </label>
              <input
                type="number"
                value={packagingCostUnit}
                onChange={(e) => setPackagingCostUnit(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-red-200 dark:border-slate-700 text-red-950 dark:text-slate-100 text-sm font-bold focus:ring-2 focus:ring-red-500 dark:focus:ring-amber-500 bg-rose-50/30 dark:bg-slate-800"
              />
              <span className="text-[11px] text-red-700 dark:text-slate-400 italic">
                * Botol kaca/jar, toples, stiker logo, seal plastik.
              </span>
            </div>

            {/* Operational cost */}
            <div>
              <label className="block text-xs font-bold text-red-900 dark:text-slate-200 mb-1">
                3. Biaya Gas / Listrik / Air per Batch (Rp)
              </label>
              <input
                type="number"
                value={operationalCost}
                onChange={(e) => setOperationalCost(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-red-200 dark:border-slate-700 text-red-950 dark:text-slate-100 text-sm font-bold focus:ring-2 focus:ring-red-500 dark:focus:ring-amber-500 bg-rose-50/30 dark:bg-slate-800"
              />
            </div>

            {/* Batch Yield */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-red-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-red-900 dark:text-slate-200 mb-1">
                  4. Hasil Produksi per Batch (Unit)
                </label>
                <input
                  type="number"
                  min="1"
                  value={batchYield}
                  onChange={(e) => setBatchYield(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl border border-red-200 dark:border-slate-700 text-red-950 dark:text-slate-100 text-sm font-bold focus:ring-2 focus:ring-red-500 dark:focus:ring-amber-500 bg-rose-50/30 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-red-900 dark:text-slate-200 mb-1">
                  5. Target Harga Jual per Unit (Rp)
                </label>
                <input
                  type="number"
                  value={targetSellingPrice}
                  onChange={(e) => setTargetSellingPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-red-200 dark:border-slate-700 text-red-950 dark:text-slate-100 text-sm font-bold focus:ring-2 focus:ring-red-500 dark:focus:ring-amber-500 bg-rose-50/30 dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Monthly target */}
            <div>
              <label className="block text-xs font-bold text-red-900 dark:text-slate-200 mb-1">
                6. Estimasi Target Penjualan Bulanan (Unit)
              </label>
              <input
                type="number"
                value={monthlyTargetUnits}
                onChange={(e) => setMonthlyTargetUnits(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-red-200 dark:border-slate-700 text-red-950 dark:text-slate-100 text-sm font-bold focus:ring-2 focus:ring-red-500 dark:focus:ring-amber-500 bg-rose-50/30 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Output Calculation Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-red-900 dark:bg-slate-900 text-red-50 dark:text-slate-100 p-6 sm:p-8 rounded-3xl border border-red-800 dark:border-slate-800 shadow-xl space-y-6 transition-colors">
            <h3 className="font-serif font-bold text-xl text-red-100 dark:text-slate-100 border-b border-red-800 dark:border-slate-800 pb-3 flex items-center justify-between">
              <span>Hasil Perhitungan HPP</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h3>

            <div className="space-y-4">
              {/* Total Batch Cost */}
              <div className="flex items-center justify-between text-xs text-red-200 dark:text-slate-300">
                <span>Total Modal 1 Batch:</span>
                <span className="font-mono font-bold text-white text-sm">
                  Rp {totalBatchCost.toLocaleString('id-ID')}
                </span>
              </div>

              {/* HPP Modal per unit */}
              <div className="bg-red-950/80 dark:bg-slate-800 p-4 rounded-2xl border border-red-700/80 dark:border-slate-700">
                <span className="text-[10px] text-red-300 dark:text-amber-400 font-bold uppercase tracking-wider block">
                  HPP Modal Bersih per Unit
                </span>
                <span className="font-serif text-3xl font-extrabold text-white">
                  Rp {hppPerUnit.toLocaleString('id-ID')}
                </span>
                <span className="text-[11px] text-red-300 dark:text-slate-400 block mt-1">
                  (Modal yang dikeluarkan untuk 1 botol/toples)
                </span>
              </div>

              {/* Profit per unit & Margin */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-800/80 dark:bg-slate-800 p-3.5 rounded-xl border border-red-700 dark:border-slate-700">
                  <span className="text-[10px] text-red-200 dark:text-slate-400 font-bold uppercase block">
                    Keuntungan / Unit
                  </span>
                  <span className={`font-bold text-lg ${profitPerUnit >= 0 ? 'text-emerald-300 dark:text-emerald-400' : 'text-rose-300 dark:text-rose-400'}`}>
                    Rp {profitPerUnit.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="bg-red-800/80 dark:bg-slate-800 p-3.5 rounded-xl border border-red-700 dark:border-slate-700">
                  <span className="text-[10px] text-red-200 dark:text-slate-400 font-bold uppercase block">
                    Margin Profit
                  </span>
                  <span className={`font-bold text-lg ${marginPercent >= 0 ? 'text-amber-300' : 'text-rose-300 dark:text-rose-400'}`}>
                    +{marginPercent}%
                  </span>
                </div>
              </div>

              {/* Monthly Profit Estimate */}
              <div className="bg-emerald-950/90 dark:bg-emerald-950/50 border border-emerald-600/80 dark:border-emerald-600 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                  Proyeksi Keuntungan Bersih Bulanan ({monthlyTargetUnits} Unit)
                </span>
                <span className="font-serif text-2xl font-extrabold text-emerald-300">
                  Rp {monthlyProfitEstimate.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 rounded-xl bg-red-600 dark:bg-amber-500 hover:bg-red-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs transition-colors flex items-center justify-center space-x-2 shadow-md border border-red-400/40 dark:border-amber-400 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Lembar Biaya UMKM</span>
            </button>
          </div>

          <div className="bg-rose-50 dark:bg-slate-900 p-5 rounded-2xl border border-red-200 dark:border-slate-800 text-xs text-red-900 dark:text-slate-300 space-y-2 transition-colors">
            <h4 className="font-serif font-bold text-sm text-red-950 dark:text-slate-100 flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-red-700 dark:text-amber-400" />
              <span>Tips Penetapan Harga Produk UMKM:</span>
            </h4>
            <p className="leading-relaxed">
              Standard margin profit produk kuliner olahan buah di pasaran disarankan berada di angka <strong>40% hingga 60%</strong> untuk menutup biaya tidak terduga dan promosi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

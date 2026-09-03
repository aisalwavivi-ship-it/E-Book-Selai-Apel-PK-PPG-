import React, { useState } from 'react';
import { PackageCheck, ShieldCheck, Thermometer, QrCode, Sparkles, CheckCircle, Lightbulb, Download, Printer, FileText, Loader2, CheckCircle2, Tag, Layers, Scissors, Info } from 'lucide-react';
import { generatePackagingLabelSheetPdf, generateSingleLabelPdf } from '../utils/exportPdf';
import { PdfExportProgressBar, PdfExportProgressState } from './PdfExportProgressBar';
import appleMascotImg from '../assets/images/apple_cover_circle_badge_1786597025185.jpg';
import selaiApelJarImg from '../assets/images/selai_apel_toples_asli_1788246966634.jpg';

interface LabelVariant {
  id: string;
  name: string;
  category: string;
  tagline: string;
  netto: string;
  composition: string;
  storage: string;
  expiryNote: string;
  badge: string;
}

const LABEL_VARIANTS: LabelVariant[] = [
  {
    id: 'selai-murni',
    name: 'SELAI APEL ANNA',
    category: 'OLEH-OLEH KHAS KOTA BATU',
    tagline: 'Olahan Apel Segar Desa Sumbergondo',
    netto: '250 gram',
    composition: 'Apel Anna Segar, Gula Pasir Tebu, Perasan Lemon, Bubuk Kayu Manis, Garam.',
    storage: 'Simpan di tempat sejuk & kering. Setelah dibuka simpan di lemari es.',
    expiryNote: 'Baik Digunakan Sebelum:',
    badge: '100% Buah Asli',
  },
  {
    id: 'nastar-apel',
    name: 'NASTAR APEL BATU',
    category: 'KUE KERING OLEH-OLEH',
    tagline: 'Kue Kering Butter Isi Selai Apel Anna',
    netto: '350 gram (Toples)',
    composition: 'Tepung Terigu, Butter Wijsman, Margarin, Selai Apel Anna Homemade, Kuning Telur, Susu Bubuk, Keju Edam.',
    storage: 'Tutup rapat toples setelah dibuka untuk menjaga kerenyahan.',
    expiryNote: 'Baik Digunakan Sebelum:',
    badge: 'Butter Premium',
  },
  {
    id: 'pie-apel',
    name: 'PIE APEL MINI SUMBERGONDO',
    category: 'PASTRY & TARTLET',
    tagline: 'Crust Renyah dengan Isian Apel Kayu Manis',
    netto: 'Isi 6 pcs / Box',
    composition: 'Tepung Terigu Protein Sedang, Mentega Dingin, Selai Apel Chunky, Gula Palem, Bubuk Kayu Manis.',
    storage: 'Suhu ruang 3-4 hari, simpan dalam kulkas untuk ketahanan hingga 10 hari.',
    expiryNote: 'Baik Digunakan Sebelum:',
    badge: 'Freshly Baked',
  },
  {
    id: 'jam-tea',
    name: 'APPLE JAM TEA',
    category: 'MINUMAN SARI APEL',
    tagline: 'Seduhan Teh Hitam & Selai Apel Segar',
    netto: '250 ml (Botol)',
    composition: 'Seduhan Daun Teh Hitam Pilihan, Selai Apel Anna Sumbergondo, Air Mineral, Gula Batu, Irisan Lemon.',
    storage: 'Sajikan dingin lebih nikmat. Kocok dahulu sebelum diminum.',
    expiryNote: 'Baik Digunakan Sebelum:',
    badge: 'Kaya Antioksidan',
  },
];

export const PackagingGuide: React.FC = () => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('selai-murni');
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<PdfExportProgressState>({
    isExporting: false,
    progressPercent: 0,
    statusText: '',
    currentPage: 1,
    totalPages: 1,
    documentTitle: 'Stiker Label Produk UMKM (A4 Siap Cetak)',
    isCompleted: false,
  });

  const activeVariant = LABEL_VARIANTS.find((v) => v.id === selectedVariantId) || LABEL_VARIANTS[0];

  // Download Multi-Sticker A4 PDF (6 Labels with cut guidelines)
  const handleDownloadSheetPdf = async () => {
    try {
      setIsExportingPdf(true);
      setExportProgress({
        isExporting: true,
        progressPercent: 25,
        statusText: `Menyiapkan lembar A4 stiker label untuk ${activeVariant.name}...`,
        currentPage: 1,
        totalPages: 1,
        documentTitle: `Lembar Stiker Label A4 - ${activeVariant.name}`,
        isCompleted: false,
      });

      await generatePackagingLabelSheetPdf(activeVariant.name, {
        onProgress: (current, total, msg) => {
          const pct = Math.round((current / total) * 100);
          setExportProgress({
            isExporting: true,
            progressPercent: pct,
            statusText: msg,
            currentPage: current,
            totalPages: total,
            documentTitle: `Lembar Stiker Label A4 - ${activeVariant.name}`,
            isCompleted: false,
          });
        },
      });

      setDownloadSuccess(true);
      setExportProgress((prev) => ({
        ...prev,
        isExporting: false,
        progressPercent: 100,
        statusText: 'Lembar Stiker A4 PDF Berhasil Diunduh!',
        isCompleted: true,
      }));

      setTimeout(() => {
        setDownloadSuccess(false);
        setExportProgress((prev) => ({ ...prev, isCompleted: false }));
      }, 4000);
    } catch (err) {
      console.error('Failed to export label sheet PDF:', err);
      setExportProgress((prev) => ({ ...prev, isExporting: false, isCompleted: false }));
      alert('Gagal mengunduh lembar stiker label PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Download Single HD Label PDF
  const handleDownloadSinglePdf = async () => {
    try {
      setIsExportingPdf(true);
      setExportProgress({
        isExporting: true,
        progressPercent: 30,
        statusText: `Merender label HD untuk ${activeVariant.name}...`,
        currentPage: 1,
        totalPages: 1,
        documentTitle: `Label HD - ${activeVariant.name}`,
        isCompleted: false,
      });

      await generateSingleLabelPdf(activeVariant.name, {
        onProgress: (current, total, msg) => {
          const pct = Math.round((current / total) * 100);
          setExportProgress({
            isExporting: true,
            progressPercent: pct,
            statusText: msg,
            currentPage: current,
            totalPages: total,
            documentTitle: `Label HD - ${activeVariant.name}`,
            isCompleted: false,
          });
        },
      });

      setDownloadSuccess(true);
      setExportProgress((prev) => ({
        ...prev,
        isExporting: false,
        progressPercent: 100,
        statusText: 'Label HD PDF Berhasil Diunduh!',
        isCompleted: true,
      }));

      setTimeout(() => {
        setDownloadSuccess(false);
        setExportProgress((prev) => ({ ...prev, isCompleted: false }));
      }, 4000);
    } catch (err) {
      console.error('Failed to export single label PDF:', err);
      setExportProgress((prev) => ({ ...prev, isExporting: false, isCompleted: false }));
      alert('Gagal mengunduh label HD PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Browser Print Dialog for Label Stickers
  const handlePrintLabel = () => {
    document.body.setAttribute('data-print-mode', 'label');
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 dark:from-slate-900 dark:via-red-950 dark:to-slate-900 text-red-50 dark:text-slate-100 p-8 rounded-3xl shadow-xl border border-red-700 dark:border-slate-800 space-y-3 transition-colors">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-800/80 dark:bg-slate-800/90 text-rose-200 dark:text-amber-300 text-xs font-semibold border border-red-700/50 dark:border-slate-700">
          <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Panduan Higienitas & Pengemasan UMKM</span>
        </div>
        <h2 className="font-serif text-3xl font-extrabold text-white tracking-tight">
          Pengemasan (Packaging) & Desain Label Produk
        </h2>
        <p className="text-sm text-rose-200 dark:text-slate-300 max-w-2xl font-sans leading-relaxed">
          Standar sterilisasi botol kaca, teknik pengemasan vakum alami, serta template desain label produk UMKM siap unduh PDF dan cetak stiker toples.
        </p>
      </div>

      {/* Grid Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Jar Sterilization */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-red-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-slate-800 text-red-900 dark:text-amber-300 flex items-center justify-center font-serif font-bold text-xl border dark:border-slate-700">
            1
          </div>
          <h3 className="font-serif font-bold text-xl text-red-950 dark:text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-red-700 dark:text-amber-400" />
            <span>Sterilisasi Jar Kaca Botol</span>
          </h3>
          <p className="text-xs sm:text-sm text-red-900 dark:text-slate-300 leading-relaxed">
            Sangat krusial untuk mencegah pertumbuhan bakteri/jamur mikroba, sehingga selai tahan disimpan hingga berbulan-bulan tanpa bahan pengawet kimiawi.
          </p>
          <ul className="space-y-2 text-xs text-red-900 dark:text-slate-300">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Rebus jar kaca dan tutup logam dalam air mendidih selama 10-15 menit.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Keringkan di atas rak bersih tanpa dilap kain (biarkan uap menguap alami).</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Gunakan sarung tangan atau penjepit steril saat memegang jar.</span>
            </li>
          </ul>
        </div>

        {/* Step 2: Hot Filling & Vacuum Sealing */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-red-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-slate-800 text-red-900 dark:text-amber-300 flex items-center justify-center font-serif font-bold text-xl border dark:border-slate-700">
            2
          </div>
          <h3 className="font-serif font-bold text-xl text-red-950 dark:text-slate-100 flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-red-700 dark:text-amber-400" />
            <span>Pengisian Panas (Hot Filling) & Vakum</span>
          </h3>
          <p className="text-xs sm:text-sm text-red-900 dark:text-slate-300 leading-relaxed">
            Proses pemetikan selaput udara alami untuk memastikan ruang jar kedap dan higienis.
          </p>
          <ul className="space-y-2 text-xs text-red-900 dark:text-slate-300">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Tuang selai apel saat suhu selai masih panas (minimal 85°C) ke dalam jar.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Sisakan jarak ruang udara sekitar 0,5 - 1 cm dari bibir atas botol.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>Tutup rapat seketika lalu balikkan jar selama 5 menit untuk sterilisasi tutup.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: REKOMENDASI WADAH PENGEMASAN SELAI (CONTAINERS) */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-red-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-slate-800 text-red-900 dark:text-amber-300 text-xs font-bold border border-red-200 dark:border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Panduan Wadah & Kemasan Produk</span>
            </div>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-red-950 dark:text-slate-100">
              Rekomendasi Wadah untuk Pengemasan Selai
            </h3>
            <p className="text-xs sm:text-sm text-red-900 dark:text-slate-300 max-w-2xl leading-relaxed">
              Pemilihan wadah yang tepat sangat menentukan daya tahan produk, kemudahan proses <em>hot-filling</em>, keamanan saat distribusi, serta estetika nilai jual di mata konsumen.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Jar Kaca */}
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 border-2 border-amber-300 dark:border-slate-700 space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-red-900 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  ★ Rekomendasi Utama UMKM
                </span>
                <span className="text-xs font-mono font-bold text-red-900 dark:text-amber-300">
                  Daya Simpan 6–12 Bln
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-200 dark:bg-slate-700 text-red-900 dark:text-amber-300 flex items-center justify-center font-bold text-lg shrink-0">
                  🍯
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-red-950 dark:text-slate-100">
                    Jar Kaca Silinder / Hexagonal (Tutup Lug Cap Logam)
                  </h4>
                  <p className="text-xs text-red-800 dark:text-slate-300 mt-0.5">
                    Kapasitas Rekomendasi: <strong>200g, 250g, 350g</strong>
                  </p>
                </div>
              </div>
              <p className="text-xs text-red-900 dark:text-slate-300 leading-relaxed">
                Wadah standar emas untuk produk selai bermutu tinggi. Tahan suhu mendidih saat proses <em>hot filling</em> (85°C–90°C), kedap udara sempurna dengan tutup ulir berpelapis plastisol (efek <em>vacuum safety pop-up</em>), dan menampilkan warna selai apel murni yang berkilau.
              </p>
              <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-200 dark:border-slate-700 space-y-1.5 text-xs text-red-950 dark:text-slate-200">
                <div className="font-bold text-red-900 dark:text-amber-300 text-[11px] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Kelebihan Utama:</span>
                </div>
                <ul className="space-y-1 text-[11px] text-red-900 dark:text-slate-300 pl-4 list-disc">
                  <li>Tahan panas tinggi & sterilisasi rebus berkali-kali.</li>
                  <li>Tampilan premium sangat diminati untuk oleh-oleh khas Kota Batu.</li>
                  <li>Tidak berbau dan tidak bereaksi dengan zat asam apel atau lemon.</li>
                </ul>
              </div>
            </div>
            <div className="text-[11px] text-amber-900 dark:text-amber-300/90 font-medium italic pt-2 border-t border-amber-200 dark:border-slate-700">
              💡 <strong>Tips UMKM:</strong> Pastikan menggunakan tutup lug cap dengan karet plastisol rapat. Tambahkan segel plastik shrink seal pada leher tutup botol.
            </div>
          </div>

          {/* Card 2: Standing Pouch with Spout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/70 dark:bg-slate-800/80 border-2 border-red-200 dark:border-slate-700 space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-red-800 text-rose-100 text-[10px] font-bold uppercase tracking-wider">
                  Praktis & Anti-Pecah
                </span>
                <span className="text-xs font-mono font-bold text-red-900 dark:text-amber-300">
                  Daya Simpan 3–6 Bln
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-200 dark:bg-slate-700 text-red-900 dark:text-amber-300 flex items-center justify-center font-bold text-lg shrink-0">
                  🧴
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-red-950 dark:text-slate-100">
                    Standing Pouch with Spout (Corong Ulir Food Grade)
                  </h4>
                  <p className="text-xs text-red-800 dark:text-slate-300 mt-0.5">
                    Kapasitas Rekomendasi: <strong>100g, 250g, 500g (Refill)</strong>
                  </p>
                </div>
              </div>
              <p className="text-xs text-red-900 dark:text-slate-300 leading-relaxed">
                Pilihan inovatif dan sangat praktis untuk konsumen masa kini. Konsumen dapat langsung memencet selai ke atas roti tanpa perlu sendok. Bobot sangat ringan sehingga menekan ongkos kirim ekspedisi bagi penjualan online.
              </p>
              <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-red-200 dark:border-slate-700 space-y-1.5 text-xs text-red-950 dark:text-slate-200">
                <div className="font-bold text-red-900 dark:text-amber-300 text-[11px] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Kelebihan Utama:</span>
                </div>
                <ul className="space-y-1 text-[11px] text-red-900 dark:text-slate-300 pl-4 list-disc">
                  <li>Bebas risiko pecah saat ekspedisi luar kota / marketplace.</li>
                  <li>Sangat higienis karena tidak tersentuh sendok bekas berulang kali.</li>
                  <li>Biaya bahan kemasan lebih hemat dibanding toples kaca tebal.</li>
                </ul>
              </div>
            </div>
            <div className="text-[11px] text-red-900 dark:text-slate-300 font-medium italic pt-2 border-t border-red-200 dark:border-slate-700">
              💡 <strong>Tips UMKM:</strong> Gunakan material berbahan Nylon/PE berlaminasi tebal. Masukkan selai pada suhu hangat terkontrol (~65°C–70°C).
            </div>
          </div>

          {/* Card 3: Jar Plastik PET Food Grade */}
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-slate-700 text-amber-950 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  Ekonomis Harian
                </span>
                <span className="text-xs font-mono font-bold text-red-900 dark:text-amber-300">
                  Daya Simpan 1–3 Bln
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-slate-700 text-red-900 dark:text-amber-300 flex items-center justify-center font-bold text-lg shrink-0">
                  🫙
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-red-950 dark:text-slate-100">
                    Jar Plastik PET Bening Tebal (Tutup Ulir + Seal Foil)
                  </h4>
                  <p className="text-xs text-red-800 dark:text-slate-300 mt-0.5">
                    Kapasitas Rekomendasi: <strong>150g, 250g, 300g</strong>
                  </p>
                </div>
              </div>
              <p className="text-xs text-red-900 dark:text-slate-300 leading-relaxed">
                Solusi ekonomis untuk pasar lokal, bazar desa, atau pesanan konsumsi harian cepat habis. Bobot ringan dan tidak mudah pecah jika terjatuh saat penanganan di warung/toko.
              </p>
              <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-200 dark:border-slate-700 space-y-1.5 text-xs text-red-950 dark:text-slate-200">
                <div className="font-bold text-red-900 dark:text-amber-300 text-[11px] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Kelebihan Utama:</span>
                </div>
                <ul className="space-y-1 text-[11px] text-red-900 dark:text-slate-300 pl-4 list-disc">
                  <li>Harga per unit wadah paling terjangkau (menekan HPP).</li>
                  <li>Tampilan transparan bening seperti kaca namun tidak rapuh.</li>
                  <li>Cocok untuk produk sampel atau penjualan dengan perputaran cepat.</li>
                </ul>
              </div>
            </div>
            <div className="text-[11px] text-amber-900 dark:text-slate-300 font-medium italic pt-2 border-t border-amber-200 dark:border-slate-700">
              ⚠️ <strong>Perhatian:</strong> Jangan menuang selai saat masih mendidih panas (&gt;65°C) karena plastik PET dapat mengerut/deformasi.
            </div>
          </div>

          {/* Card 4: Mini Sample Jar Kaca Souvenir */}
          <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/40 dark:bg-slate-800/60 border border-red-200 dark:border-slate-700 space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-200 dark:bg-slate-700 text-red-950 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  Souvenir & Hampers
                </span>
                <span className="text-xs font-mono font-bold text-red-900 dark:text-amber-300">
                  Daya Simpan 6–12 Bln
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-slate-700 text-red-900 dark:text-amber-300 flex items-center justify-center font-bold text-lg shrink-0">
                  🎁
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-red-950 dark:text-slate-100">
                    Mini Glass Jar Souvenir (Portion Pack / Tester Pack)
                  </h4>
                  <p className="text-xs text-red-800 dark:text-slate-300 mt-0.5">
                    Kapasitas Rekomendasi: <strong>45g, 80g, 100g</strong>
                  </p>
                </div>
              </div>
              <p className="text-xs text-red-900 dark:text-slate-300 leading-relaxed">
                Sangat digemari wisatawan sebagai oleh-oleh mini khas Desa Sumbergondo, cenderamata acara, atau paket hampers <em>tasting set</em> (misal: paket 3 rasa selai). Memberikan margin keuntungan tertinggi per gram olahan buah.
              </p>
              <div className="bg-white/80 dark:bg-slate-900/60 p-3 rounded-xl border border-red-200 dark:border-slate-700 space-y-1.5 text-xs text-red-950 dark:text-slate-200">
                <div className="font-bold text-red-900 dark:text-amber-300 text-[11px] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Kelebihan Utama:</span>
                </div>
                <ul className="space-y-1 text-[11px] text-red-900 dark:text-slate-300 pl-4 list-disc">
                  <li>Tampilan sangat imut, menarik, dan berkelas estetika tinggi.</li>
                  <li>Harga jual bundle box isi 3 jar mini menghasilkan laba bersih optimal.</li>
                  <li>Tahan hot-filling dan tahan lama seperti jar kaca standar.</li>
                </ul>
              </div>
            </div>
            <div className="text-[11px] text-red-900 dark:text-slate-300 font-medium italic pt-2 border-t border-red-200 dark:border-slate-700">
              💡 <strong>Tips UMKM:</strong> Kemas dalam kotak kardus kraft bertingkap mika transparan dengan tali rami untuk kesan alami khas pedesaan.
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-2xl border border-red-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
          <div className="bg-red-900 dark:bg-slate-800 text-white p-3.5 px-4 font-serif font-bold text-xs sm:text-sm flex items-center justify-between">
            <span>Tabel Ringkasan Perbandingan Wadah Pengemasan Selai</span>
            <span className="text-[11px] font-sans font-normal text-amber-300">Standar Mutu UMKM Sumbergondo</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-red-50 dark:bg-slate-900 text-red-950 dark:text-slate-200 border-b border-red-200 dark:border-slate-800">
                <tr>
                  <th className="p-3 font-bold">Jenis Wadah</th>
                  <th className="p-3 font-bold">Ketahanan Panas (Hot-Fill)</th>
                  <th className="p-3 font-bold">Efektivitas Vakum / Kedap</th>
                  <th className="p-3 font-bold">Estimasi Daya Simpan</th>
                  <th className="p-3 font-bold">Segmen Distribusi Utama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100 dark:divide-slate-800 text-red-950 dark:text-slate-300">
                <tr className="hover:bg-red-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-red-900 dark:text-amber-300">Jar Kaca (Lug Cap Logam)</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400 font-semibold">Sangat Baik (100°C+)</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400 font-semibold">Maksimal (Vakum Otomatis)</td>
                  <td className="p-3 font-mono font-bold">6 – 12 Bulan</td>
                  <td className="p-3">Toko Oleh-Oleh, Swalayan, Wisatawan Premium</td>
                </tr>
                <tr className="hover:bg-red-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-red-900 dark:text-amber-300">Standing Pouch Spout (Nylon/PE)</td>
                  <td className="p-3 text-amber-700 dark:text-amber-400 font-semibold">Sedang (65°C - 75°C)</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400 font-semibold">Tinggi (Tutup Ulir Rapat)</td>
                  <td className="p-3 font-mono font-bold">3 – 6 Bulan</td>
                  <td className="p-3">Pengiriman Ekspedisi Online, Refill Pack, Kafe</td>
                </tr>
                <tr className="hover:bg-red-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-red-900 dark:text-amber-300">Jar Plastik PET Food Grade</td>
                  <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold">Rendah (Maks 60°C)</td>
                  <td className="p-3 text-amber-700 dark:text-amber-400 font-semibold">Sedang (Perlu Induction Foil)</td>
                  <td className="p-3 font-mono font-bold">1 – 3 Bulan</td>
                  <td className="p-3">Pasar Lokal, Bazar Desa, Konsumsi Cepat</td>
                </tr>
                <tr className="hover:bg-red-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-red-900 dark:text-amber-300">Mini Glass Jar (Portion/Tester)</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400 font-semibold">Sangat Baik (100°C+)</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400 font-semibold">Maksimal (Vakum Otomatis)</td>
                  <td className="p-3 font-mono font-bold">6 – 12 Bulan</td>
                  <td className="p-3">Souvenir Acara, Hampers Hadiah, Paket Tester</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: INOVASI LABEL GANTUNG DENGAN BIJI APEL KERING */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-red-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200 dark:border-slate-700 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-200/90 dark:bg-amber-500/20 text-red-950 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Inovasi Kemasan Desa Sumbergondo</span>
            </div>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-red-950 dark:text-slate-100">
              Label Gantung dengan Biji Apel Kering
            </h3>
            <p className="text-xs sm:text-sm text-red-800 dark:text-slate-300 font-medium">
              Kreatif • Natural • Menarik • Menambah Nilai Jual & Daya Tarik Wisatawan
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 bg-white/90 dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-2xs">
            <Tag className="w-4 h-4 text-red-700 dark:text-amber-400" />
            <span className="text-xs font-bold text-red-950 dark:text-slate-200">Zero-Waste & Eco-Friendly</span>
          </div>
        </div>

        {/* Top Feature: Product Photo & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visual Showcase (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border-2 border-amber-300 dark:border-slate-700 shadow-md relative group bg-white dark:bg-slate-950">
            <img
              src={selaiApelJarImg}
              alt="Hasil Akhir Toples Selai Apel dengan Label Gantung Biji Apel Kering"
              className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Hasil Akhir Produk</span>
              <p className="text-xs font-serif font-bold mt-0.5">Toples Selai Apel dengan Kain Goni & Label Biji Apel</p>
              <span className="text-[10px] text-amber-100/90 mt-1">Biji apel terlihat jelas, tetap higienis & menarik!</span>
            </div>
          </div>

          {/* Key Advantages & Materials (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-white/95 dark:bg-slate-800 p-3.5 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-2xs space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-red-900 dark:text-amber-300">
                  <Scissors className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Bahan yang Dibutuhkan:</span>
                </div>
                <ul className="text-[11px] text-red-900 dark:text-slate-300 space-y-0.5 pl-3 list-disc">
                  <li>Karton kraft tebal (250–300 gsm)</li>
                  <li>Plastik mika bening (0,2–0,3 mm)</li>
                  <li>Biji apel kering pilihan (dicuci bersih)</li>
                  <li>Tali rami / benang goni alami</li>
                  <li>Lem tembak / double tape kuat</li>
                </ul>
              </div>

              <div className="bg-white/95 dark:bg-slate-800 p-3.5 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-2xs space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-red-900 dark:text-amber-300">
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Alat Bantu Kerja:</span>
                </div>
                <ul className="text-[11px] text-red-900 dark:text-slate-300 space-y-0.5 pl-3 list-disc">
                  <li>Gunting kertas & cutter presisi</li>
                  <li>Alat pelubang kertas (hole puncher)</li>
                  <li>Kain goni / burlap penutup toples</li>
                  <li>Pengering/oven untuk biji apel</li>
                </ul>
              </div>
            </div>

            {/* 4 Tag Shape Designs */}
            <div className="bg-amber-100/70 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-amber-300/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-950 dark:text-amber-300 uppercase tracking-wider">
                  4 Pilihan Desain Label Gantung:
                </span>
                <span className="text-[10px] font-semibold text-amber-800 dark:text-slate-950 bg-amber-300 dark:bg-amber-400 px-2 py-0.5 rounded-full">
                  Format Kraft Die-Cut
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-700 shadow-2xs">
                  <div className="text-lg mb-0.5">🍎</div>
                  <div className="font-bold text-[11px] text-red-950 dark:text-slate-100">A. Bentuk Apel</div>
                  <div className="text-[10px] text-red-800 dark:text-slate-400">Jendela bulat biji di tengah</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-700 shadow-2xs">
                  <div className="text-lg mb-0.5">🍃</div>
                  <div className="font-bold text-[11px] text-red-950 dark:text-slate-100">B. Bentuk Daun</div>
                  <div className="text-[10px] text-red-800 dark:text-slate-400">Kesan natural organik</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-700 shadow-2xs">
                  <div className="text-lg mb-0.5">⭕</div>
                  <div className="font-bold text-[11px] text-red-950 dark:text-slate-100">C. Bulat Klasik</div>
                  <div className="text-[10px] text-red-800 dark:text-slate-400">Minimalis elegan</div>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-700 shadow-2xs">
                  <div className="text-lg mb-0.5">🏷️</div>
                  <div className="font-bold text-[11px] text-red-950 dark:text-slate-100">D. Persegi Panjang</div>
                  <div className="text-[10px] text-red-800 dark:text-slate-400">Mudah dipotong massal</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step 5 Steps Cara Kemas */}
        <div className="space-y-3 pt-2">
          <h4 className="font-serif font-bold text-red-950 dark:text-amber-300 text-sm sm:text-base flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>5 Langkah Praktis Pembuatan & Pemasangan Label Gantung Biji Apel:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
            <div className="bg-white/95 dark:bg-slate-800 p-3 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-2xs space-y-1.5 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="w-6 h-6 rounded-full bg-red-800 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <p className="font-bold text-[11.5px] text-red-950 dark:text-slate-100">Penyiapan Biji Apel</p>
                <p className="text-[11px] text-red-800 dark:text-slate-300 leading-snug">
                  Siapkan biji apel, cuci bersih sisa daging buah, lalu jemur/oven hingga kering sempurna (kadar air &lt;5%).
                </p>
              </div>
            </div>

            <div className="bg-white/95 dark:bg-slate-800 p-3 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-2xs space-y-1.5 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="w-6 h-6 rounded-full bg-red-800 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <p className="font-bold text-[11.5px] text-red-950 dark:text-slate-100">Kantung Mika Bening</p>
                <p className="text-[11px] text-red-800 dark:text-slate-300 leading-snug">
                  Potong plastik mika bening sesuai ukuran jendela tag label lalu siapkan lapisan pembungkusnya.
                </p>
              </div>
            </div>

            <div className="bg-white/95 dark:bg-slate-800 p-3 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-2xs space-y-1.5 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="w-6 h-6 rounded-full bg-red-800 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <p className="font-bold text-[11.5px] text-red-950 dark:text-slate-100">Penempelan Mika</p>
                <p className="text-[11px] text-red-800 dark:text-slate-300 leading-snug">
                  Tempelkan plastik mika bening pada bagian belakang lubang jendela kartu tag kraft menggunakan double tape tipis.
                </p>
              </div>
            </div>

            <div className="bg-white/95 dark:bg-slate-800 p-3 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-2xs space-y-1.5 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="w-6 h-6 rounded-full bg-red-800 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <p className="font-bold text-[11.5px] text-red-950 dark:text-slate-100">Pengisian Biji</p>
                <p className="text-[11px] text-red-800 dark:text-slate-300 leading-snug">
                  Isi 8–12 butir biji apel kering ke dalam mika, lalu rekatkan lapisan karton belakang hingga tertutup rapat & higienis.
                </p>
              </div>
            </div>

            <div className="bg-white/95 dark:bg-slate-800 p-3 rounded-2xl border border-amber-200 dark:border-slate-700 shadow-2xs space-y-1.5 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="w-6 h-6 rounded-full bg-red-800 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                  5
                </span>
                <p className="font-bold text-[11.5px] text-red-950 dark:text-slate-100">Pengikatan Tali Rami</p>
                <p className="text-[11px] text-red-800 dark:text-slate-300 leading-snug">
                  Lubangi bagian atas label, masukkan tali rami / benang goni, lalu gantungkan melingkari leher toples berhias kain goni.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kelebihan & Tips Anti-Jamur Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-emerald-50 dark:bg-slate-800 border border-emerald-300 dark:border-slate-700 p-3.5 rounded-2xl space-y-1.5">
            <span className="font-serif font-bold text-emerald-950 dark:text-emerald-300 text-xs flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>5 Keunggulan Inovasi Tag Biji Apel:</span>
            </span>
            <ul className="text-[11px] text-emerald-900 dark:text-slate-300 space-y-1 pl-4 list-disc">
              <li><strong>Eksklusif & Autentik:</strong> Menjadi bukti nyata selai dibuat dari 100% apel Anna asli.</li>
              <li><strong>Desain Natural:</strong> Tampilan rustic vintage sangat disukai generasi muda & wisatawan.</li>
              <li><strong>Biaya Sangat Murah:</strong> Memanfaatkan biji sisa proses pembuatan selai (zero waste).</li>
              <li><strong>Higienis Terjaga:</strong> Biji tertutup rapat di balik mika bening tanpa kontak dengan isi selai.</li>
              <li><strong>Reusable:</strong> Label cantik dapat disimpan pembeli sebagai kenang-kenangan.</li>
            </ul>
          </div>

          <div className="bg-rose-50 dark:bg-slate-800 border border-rose-300 dark:border-slate-700 p-3.5 rounded-2xl space-y-1.5">
            <span className="font-serif font-bold text-red-950 dark:text-amber-300 text-xs flex items-center space-x-1.5">
              <Lightbulb className="w-4 h-4 text-red-600 dark:text-amber-400" />
              <span>3 Tips Penting Kualitas & Ketahanan:</span>
            </span>
            <ul className="text-[11px] text-red-900 dark:text-slate-300 space-y-1 pl-4 list-disc">
              <li><strong>Wajib Kering Sempurna:</strong> Sangrai atau jemur biji di bawah terik matahari 2 hari atau oven suhu 60°C selama 45 menit agar tidak berjamur.</li>
              <li><strong>Mika Cukup Tebal:</strong> Gunakan mika kaku 0,25 mm agar jendela tidak mudah penyok saat toples ditumpuk.</li>
              <li><strong>Simpan Tempat Kering:</strong> Letakkan stok label kraft yang sudah jadi dalam wadah kedap udara dengan silica gel sebelum dipasang.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: DESAIN STANDAR LABEL PRODUK UMKM + DOWNLOAD PDF */}
      {/* ======================================================== */}
      <div className="bg-red-900 dark:bg-slate-900 text-red-50 dark:text-slate-100 p-6 sm:p-8 rounded-3xl border border-red-800 dark:border-slate-800 shadow-xl space-y-6 transition-colors">
        {/* Section Header with Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-red-800 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-800 dark:bg-slate-800 text-amber-300 text-xs font-bold border border-red-700/60 dark:border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Standar Label Kemasan Produk</span>
            </div>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-red-100 dark:text-amber-300">
              Desain Standar Label Produk UMKM
            </h3>
            <p className="text-xs text-red-300 dark:text-slate-400 max-w-xl">
              Unduh template label stiker resmi siap cetak dalam format PDF A4 (6 stiker per lembar dengan panduan garis potong) atau label satuan HD.
            </p>
          </div>

          {/* Action Buttons: Download PDF & Print */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="btn-print-label-sticker"
              onClick={handlePrintLabel}
              className="px-3.5 py-2 rounded-xl bg-red-950 dark:bg-slate-800 hover:bg-black text-red-100 font-bold text-xs transition-colors flex items-center space-x-1.5 border border-red-700 dark:border-slate-700 shadow-sm cursor-pointer"
              title="Cetak Stiker Langsung ke Kertas A4"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Stiker (A4)</span>
            </button>

            <button
              id="btn-download-single-label-pdf"
              onClick={handleDownloadSinglePdf}
              disabled={isExportingPdf}
              className="px-3.5 py-2 rounded-xl bg-red-800 dark:bg-slate-700 hover:bg-red-700 dark:hover:bg-slate-600 text-white font-bold text-xs transition-colors flex items-center space-x-1.5 border border-red-600 dark:border-slate-600 shadow-sm cursor-pointer disabled:opacity-50"
              title="Unduh 1 Lembar Label HD (Satuan)"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Label Satuan (PDF)</span>
            </button>

            <button
              id="btn-download-label-sheet-pdf"
              onClick={handleDownloadSheetPdf}
              disabled={isExportingPdf}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-red-950 font-bold text-xs transition-colors flex items-center space-x-2 shadow-md border border-amber-300 cursor-pointer disabled:opacity-50"
              title="Unduh Lembar A4 (Grid 6 Stiker Siap Potong) dalam Format PDF"
            >
              {isExportingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-950" />
              ) : downloadSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-800" />
              ) : (
                <Download className="w-4 h-4 text-red-950" />
              )}
              <span>{isExportingPdf ? 'Merender PDF...' : downloadSuccess ? 'Tersimpan!' : 'Unduh PDF (Lembar A4)'}</span>
            </button>
          </div>
        </div>

        {/* Variant Tabs: Choose Product Label */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-red-200 dark:text-slate-300 uppercase tracking-wider block">
            Pilih Varian Produk Label:
          </span>
          <div className="flex flex-wrap gap-2">
            {LABEL_VARIANTS.map((variant) => {
              const isSelected = variant.id === selectedVariantId;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-400 text-red-950 border-amber-300 shadow-md ring-2 ring-amber-300/60'
                      : 'bg-red-950/60 dark:bg-slate-800/80 text-red-200 dark:text-slate-300 border-red-800 dark:border-slate-700 hover:bg-red-800 dark:hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{variant.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${isSelected ? 'bg-red-900 text-amber-200' : 'bg-red-900/60 text-red-300'}`}>
                    {variant.netto}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Download Success Notice Banner */}
        {downloadSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 p-3.5 rounded-2xl flex items-center space-x-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Berkas PDF Stiker Label {activeVariant.name} berhasil diunduh dan siap dicetak!</span>
          </div>
        )}

        {/* Interactive Single Label Preview Card (Rendered for Screen & PDF capture) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-red-200 dark:text-slate-300">
            <span className="font-serif italic">
              Pratinjau Stiker Kemasan ({activeVariant.name}):
            </span>
            <span className="text-[11px] bg-red-950/80 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-red-800 dark:border-slate-700">
              Format Standar Toples & Jar Kaca
            </span>
          </div>

          <div
            id="pdf-single-label-preview"
            className="max-w-xl mx-auto bg-[#fffdfa] dark:bg-slate-950 text-red-950 dark:text-slate-100 p-6 sm:p-7 rounded-2xl border-4 border-red-300 dark:border-slate-700 shadow-xl relative font-sans space-y-4"
          >
            {/* Corner Badge */}
            <div className="absolute top-3 right-3 bg-red-900 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-2xs">
              {activeVariant.badge}
            </div>

            {/* Label Brand Header */}
            <div className="text-center border-b-2 border-dashed border-red-300 dark:border-slate-700 pb-3.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 dark:text-amber-400 block">
                {activeVariant.category}
              </span>
              <h4 className="font-serif font-extrabold text-2xl sm:text-3xl text-red-950 dark:text-slate-100 mt-0.5 tracking-tight">
                {activeVariant.name}
              </h4>
              <p className="text-xs text-red-800 dark:text-slate-300 font-serif italic">
                "{activeVariant.tagline}"
              </p>
            </div>

            {/* Label Body Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-red-900 dark:text-amber-300 block">
                  Komposisi:
                </span>
                <p className="text-[11px] text-red-800 dark:text-slate-300 leading-relaxed">
                  {activeVariant.composition}
                </p>
                <span className="font-bold text-red-900 dark:text-amber-300 block pt-1">
                  Saran Penyimpanan:
                </span>
                <p className="text-[10px] text-red-700 dark:text-slate-400 leading-tight">
                  {activeVariant.storage}
                </p>
              </div>

              <div className="space-y-1 sm:border-l sm:border-red-200 sm:dark:border-slate-800 sm:pl-3">
                <span className="font-bold text-red-900 dark:text-amber-300 block">
                  Diproduksi Oleh:
                </span>
                <p className="text-[11px] text-red-800 dark:text-slate-300 leading-tight">
                  Kelompok UMKM Sumbergondo Mandiri<br />
                  Bumiaji, Kota Batu, Jawa Timur 65335<br />
                  <span className="text-[10px] text-red-600 dark:text-amber-400">Indonesia</span>
                </p>
              </div>
            </div>

            {/* Label Footer Bar */}
            <div className="pt-3 border-t border-red-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <div>
                <span className="block font-bold text-red-950 dark:text-slate-100 text-xs">
                  Netto: {activeVariant.netto}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  ✓ Tanpa Pemanis Buatan
                </span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-red-900 dark:text-slate-300 text-[10px]">
                  {activeVariant.expiryNote}
                </span>
                <span className="bg-rose-100 dark:bg-slate-800 text-red-950 dark:text-amber-300 font-mono px-2.5 py-0.5 rounded font-bold text-xs border border-red-200 dark:border-slate-700 inline-block mt-0.5">
                  [TANGGAL EXP]
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions & Guidelines for Printing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-red-950/70 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-red-800 dark:border-slate-700 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
              <Scissors className="w-3.5 h-3.5" />
              <span>Kertas Stiker Glossy / HVS</span>
            </div>
            <p className="text-red-200 dark:text-slate-400 text-[11px] leading-relaxed">
              Cetak berkas PDF A4 pada kertas stiker kromo/glossy water-resistant untuk daya rekat optimal pada toples kaca.
            </p>
          </div>

          <div className="bg-red-950/70 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-red-800 dark:border-slate-700 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Ukuran Label Presisi</span>
            </div>
            <p className="text-red-200 dark:text-slate-400 text-[11px] leading-relaxed">
              Setiap lembar A4 memuat 6 stiker berukuran ~9 cm x 6 cm dengan garis potong putus-putus siap digunting.
            </p>
          </div>

          <div className="bg-red-950/70 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-red-800 dark:border-slate-700 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
              <Info className="w-3.5 h-3.5" />
              <span>Tanggal Expired Stempel</span>
            </div>
            <p className="text-red-200 dark:text-slate-400 text-[11px] leading-relaxed">
              Kotak EXP Date dapat diisi cap stempel tanggal manual saat proses packing batch selai selesai.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* HIDDEN / OFFSCREEN A4 SHEET CONTAINER FOR PDF & PRINT */}
      {/* Renders 6 Ready-to-Cut Stickers in 2x3 Grid on Standard A4 */}
      {/* ======================================================== */}
      <div className="fixed -left-[99999px] top-0 print:static print:left-0 pointer-events-none">
        <div
          id="pdf-packaging-label-a4-sheet"
          className="w-[794px] h-[1123px] p-8 bg-white text-red-950 font-sans flex flex-col justify-between box-border"
          style={{ boxSizing: 'border-box' }}
        >
          {/* Top Sheet Header */}
          <div className="border-b-2 border-red-900 pb-2 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-red-900 uppercase tracking-widest text-[10px] block">
                LEMBAR STIKER LABEL PRODUK UMKM (A4 SIAP POTONG)
              </span>
              <p className="font-serif font-bold text-base text-red-950">
                {activeVariant.name} • Desa Sumbergondo, Kota Batu
              </p>
            </div>
            <div className="text-right text-[10px] text-gray-500">
              <span>6 Label per Lembar A4 (Skala 100%)</span>
            </div>
          </div>

          {/* 2x3 Grid of 6 Labels */}
          <div className="grid grid-cols-2 gap-4 my-auto">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className="p-4 bg-[#fffdfa] border-2 border-dashed border-red-400 rounded-xl relative space-y-2 text-xs"
              >
                {/* Cut corner icon hint */}
                <div className="absolute top-1.5 right-2 text-[8px] text-gray-400 font-mono flex items-center space-x-0.5">
                  <span>✂ Potong</span>
                </div>

                <div className="text-center border-b border-red-200 pb-1.5">
                  <span className="text-[7.5px] font-bold uppercase tracking-widest text-red-700 block">
                    {activeVariant.category}
                  </span>
                  <h5 className="font-serif font-extrabold text-sm text-red-950">
                    {activeVariant.name}
                  </h5>
                  <p className="text-[8.5px] text-red-800 font-serif italic">
                    "{activeVariant.tagline}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[8.5px] leading-tight">
                  <div>
                    <strong className="text-red-900 block">Komposisi:</strong>
                    <p className="text-gray-700 line-clamp-2">{activeVariant.composition}</p>
                  </div>
                  <div>
                    <strong className="text-red-900 block">Diproduksi Oleh:</strong>
                    <p className="text-gray-700">UMKM Sumbergondo Mandiri, Kota Batu</p>
                  </div>
                </div>

                <div className="pt-1 border-t border-red-200 flex items-center justify-between text-[8px]">
                  <div>
                    <strong className="text-red-950">Netto: {activeVariant.netto}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 block">Baik Sebelum:</span>
                    <span className="px-1.5 py-0.5 bg-rose-100 rounded text-red-950 font-mono font-bold">
                      [TANGGAL EXP]
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Sheet Footer */}
          <div className="pt-2 border-t border-gray-300 flex items-center justify-between text-[9px] text-gray-500">
            <span>
              Panduan E-Book UMKM Selai Apel Anna • PGSD FKIP Universitas Muhammadiyah Malang
            </span>
            <span>
              Desa Sumbergondo, Bumiaji, Kota Batu
            </span>
          </div>
        </div>
      </div>

      {/* Dedicated Print Sheet for Label Mode */}
      <div id="packaging-label-print-sheet" className="hidden bg-white text-black">
        <div className="p-4 max-w-4xl mx-auto space-y-4">
          <div className="border-b-2 border-red-900 pb-2 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-red-900 uppercase tracking-widest text-xs block">
                LEMBAR STIKER LABEL PRODUK UMKM (A4 SIAP POTONG)
              </span>
              <h2 className="font-serif font-bold text-xl text-red-950">
                {activeVariant.name} — Desa Sumbergondo, Kota Batu
              </h2>
            </div>
            <span className="text-xs text-gray-600 font-mono">6 Stiker Toples per Lembar</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="p-4 bg-white border-2 border-dashed border-gray-400 rounded-xl space-y-2 text-xs"
              >
                <div className="text-center border-b border-gray-300 pb-1.5">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-red-800 block">
                    {activeVariant.category}
                  </span>
                  <h4 className="font-serif font-bold text-base text-red-950">
                    {activeVariant.name}
                  </h4>
                  <p className="text-[9px] text-red-800 italic">
                    "{activeVariant.tagline}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[9px]">
                  <div>
                    <strong className="text-red-900 block">Komposisi:</strong>
                    <p className="text-gray-800">{activeVariant.composition}</p>
                  </div>
                  <div>
                    <strong className="text-red-900 block">Diproduksi Oleh:</strong>
                    <p className="text-gray-800">Kelompok UMKM Sumbergondo Mandiri, Kota Batu</p>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-gray-300 flex items-center justify-between text-[9px]">
                  <div>
                    <strong className="text-red-950">Netto: {activeVariant.netto}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600 block text-[8px]">Baik Sebelum:</span>
                    <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded font-mono font-bold text-[9px]">
                      [TANGGAL EXP]
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Real-time PDF Export Progress Bar */}
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


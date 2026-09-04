import React from 'react';
import { bookPages, recipesData, ebookMetadata, Recipe } from '../data/ebookData';
import appleMascotImg from '../assets/images/apple_cover_circle_badge_1786597025185.jpg';
import { Sparkles, Award, CheckCircle2, Clock, ChefHat, Check, TrendingUp, ShieldCheck, MapPin, DollarSign } from 'lucide-react';

export const PrintBookLayout: React.FC = () => {
  return (
    <div className="fixed -left-[99999px] top-0 print:static print:left-0 text-red-950 font-sans pointer-events-none print:pointer-events-auto">
      {/* ======================================================== */}
      {/* 1. COMPLETE 10-PAGE E-BOOK CONTAINER (LANDSCAPE 29.7 x 20.5 CM) */}
      {/* ======================================================== */}
      <div id="printable-book-container" style={{ width: '1188px' }}>
        {bookPages.map((page) => {
          const associatedRecipe = page.content.recipeId
            ? recipesData.find((r) => r.id === page.content.recipeId)
            : null;

          return (
            <div
              key={page.pageNumber}
              id={`pdf-page-${page.pageNumber}`}
              className="pdf-book-page w-[1188px] h-[820px] p-7 px-9 flex flex-col justify-between bg-[#fcf8f5] border-8 border-red-900/20 rounded-3xl relative overflow-hidden box-border mb-6 print:m-0 print:border-none print-page-break"
              style={{
                pageBreakAfter: 'always',
                boxSizing: 'border-box',
              }}
            >
              {/* Background Texture Accents */}
              <div className="absolute top-0 right-0 w-52 h-52 bg-red-100/40 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-52 h-52 bg-amber-100/40 rounded-full blur-2xl pointer-events-none -ml-12 -mb-12"></div>

              {/* Faded Brand Logo Watermark (Center Background for Rich Visuals while keeping text 100% readable) */}
              {page.type !== 'cover' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                  <div className="w-[460px] h-[460px] rounded-full overflow-hidden opacity-[0.045] mix-blend-multiply flex items-center justify-center">
                    <img
                      src={appleMascotImg}
                      alt="Watermark Logo Brand"
                      className="w-full h-full object-contain filter grayscale contrast-125"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              )}

              {/* Brand Bookmark Ribbon on Top-Right Corner */}
              <div className="absolute top-0 right-10 pointer-events-none z-20 flex flex-col items-center">
                <div className="bg-gradient-to-b from-red-900 via-red-950 to-red-950 text-amber-100 px-2.5 pt-2 pb-2 rounded-b-xl shadow-md border-x border-b border-red-700/60 flex flex-col items-center space-y-0.5">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-300/80 bg-white p-0.5 shadow-2xs">
                    <img
                      src={appleMascotImg}
                      alt="Bookmark Logo"
                      className="w-full h-full object-cover rounded-full"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <span className="text-[6.5px] font-black text-amber-300 uppercase tracking-widest leading-none">
                    SUMBERGONDO
                  </span>
                </div>
                {/* Bookmark Notch Ribbon Tail */}
                <div className="w-0 h-0 border-x-[12px] border-x-transparent border-t-[6px] border-t-red-950 -mt-0.5"></div>
              </div>

              {/* Header Watermark Line */}
              <div className="flex items-center justify-between border-b-2 border-red-300/80 pb-2 mb-3 text-xs text-red-900 uppercase font-bold tracking-widest relative z-10 pr-28 sm:pr-32 gap-2">
                <span className="flex items-center space-x-2 truncate">
                  <span className="text-base">🍏</span>
                  <span>{page.chapterTitle || 'BUKU RESEP SELAI APEL DAN OLAHANNYA'}</span>
                </span>
                <span className="font-serif italic font-normal text-red-800 text-sm whitespace-nowrap shrink-0 mr-3">
                  Desa Sumbergondo - Kota Batu
                </span>
              </div>

              {/* PAGE CONTENT (LANDSCAPE TWO-COLUMN ARCHITECTURE) */}
              <div className="flex-1 flex flex-col justify-center relative z-10 overflow-hidden">
                {/* ======================================================== */}
                {/* 1. COVER PAGE (LANDSCAPE 29.7 x 20.5 CM) */}
                {/* ======================================================== */}
                {page.type === 'cover' && (
                  <div className="grid grid-cols-12 gap-6 items-center h-full py-1">
                    {/* Left Column: Mascot & Badges */}
                    <div className="col-span-5 flex flex-col items-center justify-center text-center space-y-3.5 border-r-2 border-red-200/80 pr-6">
                      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-100 text-red-950 text-xs font-bold border-2 border-red-400 shadow-sm">
                        <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                        <span className="truncate">LUARAN PROYEK KEPEMIMPINAN</span>
                      </div>

                      <div className="relative">
                        <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-amber-400 shadow-xl bg-white flex items-center justify-center p-1.5 mx-auto">
                          <img
                            src={appleMascotImg}
                            alt="Maskot Apel"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>

                      <div className="text-xs text-red-800 font-semibold flex items-center space-x-1.5 whitespace-nowrap">
                        <MapPin className="w-4 h-4 text-red-600 inline" />
                        <span>Desa Sumbergondo - Kota Batu</span>
                      </div>
                    </div>

                    {/* Right Column: Title, Subtitle, Quote, Credits */}
                    <div className="col-span-7 flex flex-col justify-between space-y-3 pl-2">
                      <div>
                        <span className="inline-block text-xs font-bold text-red-700 tracking-widest uppercase mb-1">
                          PANDUAN PRAKTIS & DIVERSIFIKASI PRODUK
                        </span>
                        <h1 className="font-serif text-4xl font-extrabold text-red-950 tracking-tight leading-tight">
                          {page.title}
                        </h1>
                        <p className="font-sans text-sm text-red-800 mt-2 leading-relaxed font-medium">
                          {page.subtitle}
                        </p>
                      </div>

                      {page.content.quote && (
                        <div className="bg-rose-100/90 border-l-4 border-red-700 p-3.5 rounded-r-xl shadow-2xs">
                          <p className="font-serif italic text-[13.5px] text-red-950 leading-relaxed">
                            "{page.content.quote.text}"
                          </p>
                          <p className="text-xs font-bold text-red-900 mt-1.5">
                            — {page.content.quote.author} ({page.content.quote.role})
                          </p>
                        </div>
                      )}

                      <div className="bg-white/90 border border-red-200 p-3 rounded-xl flex items-center justify-between text-xs text-red-900">
                        <div>
                          <p className="font-bold text-red-950 text-sm">Program Studi PGSD</p>
                          <p className="text-red-800">Universitas Muhammadiyah Malang</p>
                        </div>
                        <div className="text-right border-l border-red-200 pl-4">
                          <p className="font-bold text-red-950">Ketua: Camelia Nur Laili</p>
                          <p className="text-red-700">Dosen: Dr. Anis Farida Jamil, M.Pd.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 2. INTRO PAGE (LANDSCAPE 29.7 x 20.5 CM) */}
                {/* ======================================================== */}
                {page.type === 'intro' && (
                  <div className="grid grid-cols-12 gap-6 h-full items-start">
                    {/* Left Column: Sambutan & Narasi (7 cols) */}
                    <div className="col-span-7 space-y-3 pr-2">
                      <div className="border-b-2 border-red-300 pb-1.5">
                        <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
                          Pengesahan & Kata Pengantar
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-red-950">
                          {page.title}
                        </h2>
                      </div>

                      <div className="space-y-2.5 text-[13.5px] text-red-950 leading-relaxed">
                        {page.content.paragraphs?.map((p, idx) => (
                          <p key={idx} className="text-justify indent-4 leading-relaxed">
                            {p}
                          </p>
                        ))}
                      </div>

                      {page.content.calloutBox && (
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-3 shadow-2xs">
                          <h4 className="font-serif font-bold text-red-950 text-xs sm:text-sm mb-1 flex items-center space-x-1.5 whitespace-nowrap">
                            <Award className="w-4 h-4 text-red-700 shrink-0" />
                            <span className="whitespace-nowrap">{page.content.calloutBox.title}</span>
                          </h4>
                          <p className="text-xs text-red-900 leading-relaxed">
                            {page.content.calloutBox.text}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Pengesahan & Tanda Tangan (5 cols) */}
                    <div className="col-span-5 space-y-3 bg-white/90 p-4 rounded-2xl border-2 border-red-200 shadow-sm flex flex-col justify-between h-full">
                      <div className="border-b border-red-200 pb-2 text-center">
                        <h3 className="font-serif font-bold text-red-950 text-sm">
                          LEMBAR PENGESAHAN LUARAN
                        </h3>
                        <p className="text-xs text-red-700">Proyek Kepemimpinan PGSD FKIP UMM 2026</p>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 text-center text-xs">
                          <p className="font-bold text-red-950">Dosen Pendamping Lapangan</p>
                          <div className="h-10 flex items-center justify-center font-serif italic text-red-800 text-sm font-semibold">
                            Dr. Anis Farida Jamil, M.Pd.
                          </div>
                          <p className="text-[11px] text-red-700 font-medium">NIP. Dosen Pembimbing UMM</p>
                        </div>

                        <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 text-center text-xs">
                          <p className="font-bold text-red-950">Ketua Pelaksana Program</p>
                          <div className="h-10 flex items-center justify-center font-serif italic text-red-800 text-sm font-semibold">
                            Camelia Nur Laili
                          </div>
                          <p className="text-[11px] text-red-700 font-medium">NIM. Mahasiswa PGSD UMM</p>
                        </div>
                      </div>

                      <div className="text-center text-[11px] text-red-800 italic pt-1 border-t border-red-100">
                        Disahkan di Malang & Batu, Jawa Timur untuk Pemanfaatan Masyarakat Desa Sumbergondo.
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 3. TOC PAGE (LANDSCAPE 29.7 x 20.5 CM) */}
                {/* ======================================================== */}
                {page.type === 'toc' && (
                  <div className="grid grid-cols-12 gap-6 h-full items-start">
                    {/* Left Column: Daftar Isi Items (7 cols) */}
                    <div className="col-span-7 space-y-3 pr-2">
                      <div className="border-b-2 border-red-300 pb-1.5">
                        <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
                          Struktur E-Book & Navigasi
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-red-950">
                          {page.title}
                        </h2>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border-2 border-red-200 shadow-xs space-y-2">
                        <ul className="space-y-1.5 text-xs text-red-950">
                          {page.content.bulletPoints?.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between gap-2 p-2 bg-red-50/70 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                <span className="w-5 h-5 rounded-full bg-red-800 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="font-semibold text-xs text-red-950">
                                  {item}
                                </span>
                              </div>
                              <span className="text-[11px] font-bold text-red-800 bg-red-200/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                                Halaman {idx + 4}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column: Kompetensi & Value Proposition (5 cols) */}
                    <div className="col-span-5 space-y-3">
                      {page.content.calloutBox && (
                        <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl text-emerald-950 text-xs flex items-start space-x-3 shadow-2xs">
                          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-sm text-emerald-950">
                              {page.content.calloutBox.title}
                            </span>
                            <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                              {page.content.calloutBox.text}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="bg-rose-100/80 border-2 border-red-200 p-4 rounded-2xl space-y-2 text-xs text-red-950">
                        <h4 className="font-serif font-bold text-red-950 text-xs uppercase tracking-wide">
                          🌟 Nilai Tambah Inovasi:
                        </h4>
                        <ul className="space-y-1.5 text-xs text-red-900">
                          <li className="flex items-start space-x-2">
                            <span className="text-red-700 font-bold">✓</span>
                            <span><strong>4 Varian Resep Unggulan:</strong> Selai dasar, Nastar Apel Batu, Pie Apel Mini Strudel & Minuman Refreshing Apple Jam Tea.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-red-700 font-bold">✓</span>
                            <span><strong>Transparansi Finansial:</strong> Kalkulasi HPP, modal & harga jual riil.</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-red-700 font-bold">✓</span>
                            <span><strong>Standar Higienitas:</strong> Sterilisasi kemasan & pengawetan alami.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 4. ARTICLE PAGE (BAB I - LANDSCAPE 29.7 x 20.5 CM) */}
                {/* ======================================================== */}
                {page.type === 'article' && (
                  <div className="grid grid-cols-12 gap-6 h-full items-start">
                    {/* Left Column: Article Text (7 cols) */}
                    <div className="col-span-7 space-y-3 pr-2">
                      <div className="border-b-2 border-red-300 pb-1.5">
                        <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
                          Bab I • Potensi Bahan Baku & Penanganan Mutu
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-red-950">
                          {page.title}
                        </h2>
                      </div>

                      <div className="space-y-2.5 text-[13.5px] text-red-950 leading-relaxed text-justify">
                        {page.content.paragraphs?.map((p, idx) => (
                          <p key={idx} className="indent-4 leading-relaxed">
                            {p}
                          </p>
                        ))}
                      </div>

                      {page.content.calloutBox && (
                        <div className="bg-rose-100 border-l-4 border-red-600 p-3 rounded-r-xl shadow-2xs">
                          <h4 className="font-serif font-bold text-red-950 text-xs mb-1">
                            💡 {page.content.calloutBox.title}
                          </h4>
                          <p className="text-xs text-red-900 leading-relaxed">
                            {page.content.calloutBox.text}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: 3 Feature Cards (5 cols) */}
                    <div className="col-span-5 space-y-2.5">
                      <div className="p-3 bg-white rounded-xl border border-red-200 shadow-2xs">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xl">🍎</span>
                          <strong className="text-red-950 text-xs font-bold">Karakteristik Apel Anna</strong>
                        </div>
                        <p className="text-xs text-red-800 leading-relaxed">
                          Apel Anna Sumbergondo memiliki pektin alami tinggi dan rasa manis-asam segar yang sangat ideal untuk tekstur selai kental alami tanpa bahan kimia tambahan.
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-red-200 shadow-2xs">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xl">🧂</span>
                          <strong className="text-red-950 text-xs font-bold">Larutan Garam 1%</strong>
                        </div>
                        <p className="text-xs text-red-800 leading-relaxed">
                          Perendaman dalam larutan air garam ringan sesaat setelah pengupasan menghentikan reaksi browning polifenol oksidase, menjaga warna selai cerah keemasan.
                        </p>
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 shadow-2xs">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xl">📈</span>
                          <strong className="text-emerald-950 text-xs font-bold">Lonjakan Nilai Tambah</strong>
                        </div>
                        <p className="text-xs text-emerald-900 leading-relaxed">
                          Mengubah apel afkir dari Rp 2.000/kg menjadi selai kemasan bernilai Rp 18.000/jar, menaikkan nilai ekonomi bahan baku hingga 300% - 500%.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 5. RECIPE PAGES (BAB II & BAB III - LANDSCAPE 29.7 x 20.5 CM) */}
                {/* ======================================================== */}
                {page.type === 'recipe' && associatedRecipe && (
                  <div className="h-full flex flex-col justify-between space-y-2">
                    {/* Single Primary Recipe layout (e.g. Page 5, 6, 7 & 8) */}
                    <div className="grid grid-cols-12 gap-5 h-full items-start">
                      {/* Left Column: Photo, Stats, HPP Box & Tips (4.5 cols) */}
                      <div className="col-span-5 space-y-2.5 border-r border-red-200 pr-4">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-200 text-red-950 text-[10px] font-bold uppercase tracking-wider mb-1 whitespace-nowrap">
                            {associatedRecipe.categoryLabel}
                          </span>
                          <h2 className="font-serif text-xl sm:text-2xl font-bold text-red-950 leading-tight whitespace-nowrap">
                            {associatedRecipe.title}
                          </h2>
                          <p className="text-xs text-red-800 italic mt-0.5 font-medium">
                            {associatedRecipe.subtitle}
                          </p>
                        </div>

                        <div className="w-full h-36 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-sm">
                          <img
                            src={associatedRecipe.image}
                            alt={associatedRecipe.title}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>

                        {/* Stats Bar */}
                        <div className="grid grid-cols-4 gap-1.5 bg-red-100/90 p-2 rounded-xl text-center text-xs font-semibold text-red-950 border border-red-200">
                          <div>
                            <span className="block text-red-700 text-[9px] uppercase font-bold">Persiapan</span>
                            <span className="font-bold text-red-950 text-[11px]">{associatedRecipe.prepTime}</span>
                          </div>
                          <div className="border-l border-red-300">
                            <span className="block text-red-700 text-[9px] uppercase font-bold">Masak</span>
                            <span className="font-bold text-red-950 text-[11px]">{associatedRecipe.cookTime}</span>
                          </div>
                          <div className="border-l border-red-300">
                            <span className="block text-red-700 text-[9px] uppercase font-bold">Hasil</span>
                            <span className="font-bold text-red-950 text-[11px] whitespace-nowrap">{associatedRecipe.yields}</span>
                          </div>
                          <div className="border-l border-red-300">
                            <span className="block text-red-700 text-[9px] uppercase font-bold">Tingkat</span>
                            <span className="font-bold text-red-950 text-[11px]">{associatedRecipe.difficulty}</span>
                          </div>
                        </div>

                        {/* HPP & Margin Box */}
                        <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl flex items-center justify-between text-xs text-amber-950 font-medium">
                          <div>
                            <span className="font-bold text-red-900">Modal:</span> Rp {associatedRecipe.hpp.baseCostPerYield.toLocaleString('id-ID')}
                          </div>
                          <div>
                            <span className="font-bold text-red-900">Jual:</span> Rp {associatedRecipe.hpp.recommendedPrice.toLocaleString('id-ID')}
                          </div>
                          <div className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300 text-[11px]">
                            Margin: +{associatedRecipe.hpp.marginPercent}%
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Ingredients & Instructions (7.5 cols) */}
                      <div className="col-span-7 space-y-2.5 pl-1">
                        {/* Ingredients & Steps grid */}
                        <div className="grid grid-cols-12 gap-3">
                          {/* Ingredients (5 cols) */}
                          <div className="col-span-5 bg-red-50/80 p-3 rounded-xl border border-red-200 space-y-1">
                            <h4 className="font-serif font-bold text-xs text-red-900 uppercase tracking-wider mb-1 border-b border-red-200 pb-0.5">
                              Bahan Baku:
                            </h4>
                            <ul className="space-y-1 text-[11.5px] text-red-950 leading-snug">
                              {associatedRecipe.ingredients.map((ing, iIdx) => (
                                <li key={iIdx} className="flex items-start space-x-1">
                                  <span className="text-red-700 font-bold">•</span>
                                  <span>
                                    <strong>{ing.name}</strong>: {ing.amount} {ing.unit}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Steps (7 cols) */}
                          <div className="col-span-7 bg-white p-3 rounded-xl border border-red-200 space-y-1">
                            <h4 className="font-serif font-bold text-xs text-red-900 uppercase tracking-wider mb-1 border-b border-red-200 pb-0.5">
                              Langkah Pembuatan:
                            </h4>
                            <div className="space-y-1.5 text-[11.5px] text-red-950 leading-snug">
                              {associatedRecipe.instructions.map((step, sIdx) => (
                                <div key={sIdx} className="flex items-start space-x-1.5">
                                  <span className="font-bold text-red-900 shrink-0">{step.stepNumber}.</span>
                                  <div>
                                    <strong className="text-red-900">{step.title}: </strong>
                                    <span>{step.instruction}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Pro tips */}
                        {associatedRecipe.proTips && associatedRecipe.proTips.length > 0 && (
                          <div className="bg-rose-100/70 p-2.5 rounded-xl text-[11.5px] text-red-950">
                            <span className="font-bold text-red-900 block mb-0.5">💡 Tips Rahasia Sukses:</span>
                            <ul className="list-disc list-inside space-y-0.5">
                              {associatedRecipe.proTips.map((tip, tIdx) => (
                                <li key={tIdx}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 6. BUSINESS & HPP PAGE (BAB IV - LANDSCAPE 29.7 x 20.5 CM) */}
                {/* ======================================================== */}
                {page.type === 'business' && (
                  <div className="grid grid-cols-12 gap-6 h-full items-start">
                    {/* Left Column: Narasi & Persyaratan Kemasan (5 cols) */}
                    <div className="col-span-5 space-y-2.5 pr-2">
                      <div className="border-b-2 border-red-300 pb-1.5">
                        <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
                          Bab IV • Kemasan & Kelayakan Usaha
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-red-950">
                          {page.title}
                        </h2>
                      </div>

                      <div className="space-y-2 text-xs text-red-950 leading-relaxed">
                        {page.content.paragraphs?.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-red-200 shadow-2xs space-y-1">
                        <strong className="block text-red-900 font-bold text-xs">Persyaratan Label Kemasan Produk:</strong>
                        <ul className="space-y-0.5 text-[11px] text-red-950">
                          <li>✓ Merk & Nama Varian Produk</li>
                          <li>✓ Netto / Berat Bersih (Gram)</li>
                          <li>✓ Komposisi & Masa Kadaluarsa</li>
                          <li>✓ Alamat & Kontak Produsen Desa Sumbergondo</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 shadow-2xs">
                        <strong className="block text-emerald-950 font-bold text-xs">Potensi Profit Usaha:</strong>
                        <p className="text-[11px] text-emerald-900 leading-relaxed mt-0.5">
                          Diversifikasi 10 kg apel afkir menghasilkan estimasi laba bersih Rp 134.000 (margin keuntungan 56.3%).
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Full HPP Simulation Table (7 cols) */}
                    <div className="col-span-7 space-y-2">
                      <h3 className="font-serif font-bold text-red-950 text-sm">
                        Simulasi Kalkulasi HPP & Laba Usaha Selai Apel (Batch 10 kg)
                      </h3>

                      {page.content.tableData && (
                        <div className="overflow-hidden rounded-xl border-2 border-red-300 bg-white shadow-xs">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-red-900 text-white font-serif">
                              <tr>
                                {page.content.tableData.headers.map((h, idx) => (
                                  <th key={idx} className="p-2 border-b border-red-800 font-bold text-xs">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-red-200 text-red-950 text-xs">
                              {page.content.tableData.rows.map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className={
                                    row[0]?.includes('Total') || row[0]?.includes('Keuntungan')
                                      ? 'bg-red-100 font-bold text-xs'
                                      : rIdx % 2 === 0
                                      ? 'bg-red-50/50'
                                      : 'bg-white'
                                  }
                                >
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className={`p-2 ${cIdx === 0 ? 'font-semibold' : ''}`}>
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="text-[11px] text-red-800 italic text-right">
                        *Asumsi harga apel afkir Rp 2.000/kg & harga jual rekomendasi Rp 18.000/jar kemasan 250g.
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 7. TEAM PAGE (BAB V - LANDSCAPE 29.7 x 20.5 CM) */}
                {/* ======================================================== */}
                {page.type === 'team' && (
                  <div className="grid grid-cols-12 gap-6 h-full items-start">
                    {/* Left Column: Penutup & Harapan Program (5 cols) */}
                    <div className="col-span-5 space-y-3 pr-2">
                      <div className="border-b-2 border-red-300 pb-1.5">
                        <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
                          Bab V • Penutup & Lembar Profil
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-red-950">
                          {page.title}
                        </h2>
                      </div>

                      <div className="space-y-2.5 text-[13.5px] text-red-950 leading-relaxed text-justify">
                        {page.content.paragraphs?.map((p, idx) => (
                          <p key={idx} className="indent-4 leading-relaxed">
                            {p}
                          </p>
                        ))}
                      </div>

                      <div className="bg-rose-100 p-3 rounded-xl border border-red-300 text-center text-xs text-red-950 shadow-2xs">
                        <p className="font-serif font-bold text-red-950 text-sm">
                          KOLABORASI PENGABDIAN MASYARAKAT 2026
                        </p>
                        <p className="text-[11px] text-red-800 mt-0.5 font-medium">
                          Universitas Muhammadiyah Malang • Pemerintah Desa Sumbergondo, Bumiaji, Kota Batu
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Susunan Tim Pelaksana (7 cols) */}
                    <div className="col-span-7 bg-red-950 text-white p-4 rounded-2xl border-2 border-red-800 space-y-2.5 shadow-md">
                      <h3 className="font-serif font-bold text-amber-300 text-xs sm:text-sm flex items-center space-x-1.5 border-b border-red-800 pb-1.5 whitespace-nowrap">
                        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="whitespace-nowrap">Susunan Tim Pelaksana Proyek Kepemimpinan:</span>
                      </h3>

                      <ul className="space-y-1.5 text-xs text-red-100">
                        {page.content.bulletPoints?.map((pt, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                            <span className="font-medium text-xs">{pt}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 border-t border-red-900/80 text-[11px] text-red-200">
                        Program Studi Pendidikan Guru Sekolah Dasar (PGSD) • Fakultas Keguruan dan Ilmu Pendidikan • Universitas Muhammadiyah Malang
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Page Number */}
              <div className="pt-2.5 border-t-2 border-red-300/80 flex items-center justify-between text-xs text-red-900 font-semibold relative z-10">
                <span className="whitespace-nowrap">Universitas Muhammadiyah Malang • Proyek Kepemimpinan PGSD</span>
                <span className="font-mono bg-red-200 text-red-950 px-3.5 py-0.5 rounded-full font-bold text-xs whitespace-nowrap">
                  Halaman {page.pageNumber} dari {bookPages.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 2. DEDICATED SINGLE RECIPE LANDSCAPE PDF SHEETS (29.7 x 20.5 CM) */}
      {/* ======================================================== */}
      <div id="printable-single-recipes" style={{ width: '1188px' }}>
        {recipesData.map((recipe) => (
          <div
            key={recipe.id}
            id={`pdf-single-recipe-${recipe.id}`}
            className="w-[1188px] h-[820px] p-7 px-9 flex flex-col justify-between bg-[#fcf8f5] border-8 border-red-900/20 rounded-3xl relative overflow-hidden box-border mb-6"
            style={{ boxSizing: 'border-box' }}
          >
            {/* Background Texture Accents */}
            <div className="absolute top-0 right-0 w-52 h-52 bg-red-100/40 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12"></div>
            <div className="absolute bottom-0 left-0 w-52 h-52 bg-amber-100/40 rounded-full blur-2xl pointer-events-none -ml-12 -mb-12"></div>

            {/* Faded Brand Logo Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
              <div className="w-[460px] h-[460px] rounded-full overflow-hidden opacity-[0.045] mix-blend-multiply flex items-center justify-center">
                <img
                  src={appleMascotImg}
                  alt="Watermark Logo Brand"
                  className="w-full h-full object-contain filter grayscale contrast-125"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            {/* Brand Bookmark Ribbon on Top-Right Corner */}
            <div className="absolute top-0 right-10 pointer-events-none z-20 flex flex-col items-center">
              <div className="bg-gradient-to-b from-red-900 via-red-950 to-red-950 text-amber-100 px-2.5 pt-2 pb-2 rounded-b-xl shadow-md border-x border-b border-red-700/60 flex flex-col items-center space-y-0.5">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-300/80 bg-white p-0.5 shadow-2xs">
                  <img
                    src={appleMascotImg}
                    alt="Bookmark Logo"
                    className="w-full h-full object-cover rounded-full"
                    crossOrigin="anonymous"
                  />
                </div>
                <span className="text-[6.5px] font-black text-amber-300 uppercase tracking-widest leading-none">
                  SUMBERGONDO
                </span>
              </div>
              <div className="w-0 h-0 border-x-[12px] border-x-transparent border-t-[6px] border-t-red-950 -mt-0.5"></div>
            </div>

            {/* Header Watermark Line */}
            <div className="flex items-center justify-between border-b-2 border-red-300/80 pb-2 mb-3 text-xs text-red-900 uppercase font-bold tracking-widest relative z-10 pr-28 sm:pr-32 gap-2">
              <span className="flex items-center space-x-2 truncate">
                <span className="text-base">🍏</span>
                <span>BUKU RESEP SELAI APEL DAN OLAHANNYA • RESEP RESMI DESA SUMBERGONDO</span>
              </span>
              <span className="font-serif italic font-normal text-red-800 text-sm whitespace-nowrap shrink-0 mr-3">
                Desa Sumbergondo - Kota Batu
              </span>
            </div>

            {/* Content Body in 2-Column Landscape */}
            <div className="grid grid-cols-12 gap-5 flex-1 items-start relative z-10">
              {/* Left Column: Top Banner, Photo, Stats & HPP (5 cols) */}
              <div className="col-span-5 space-y-2.5 border-r border-red-200 pr-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-200 text-red-950 text-[10px] font-bold uppercase tracking-wider mb-1">
                    {recipe.categoryLabel}
                  </span>
                  <h1 className="font-serif text-2xl font-bold text-red-950 leading-tight">
                    {recipe.title}
                  </h1>
                  <p className="text-xs text-red-800 italic mt-0.5 font-medium">
                    {recipe.subtitle}
                  </p>
                </div>

                <div className="w-full h-36 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-sm">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-4 gap-1.5 bg-red-100/90 p-2 rounded-xl text-center text-xs font-semibold text-red-950 border border-red-200">
                  <div>
                    <span className="block text-red-700 text-[9px] uppercase font-bold">Persiapan</span>
                    <span className="font-bold text-red-950 text-[11px]">{recipe.prepTime}</span>
                  </div>
                  <div className="border-l border-red-300">
                    <span className="block text-red-700 text-[9px] uppercase font-bold">Masak</span>
                    <span className="font-bold text-red-950 text-[11px]">{recipe.cookTime}</span>
                  </div>
                  <div className="border-l border-red-300">
                    <span className="block text-red-700 text-[9px] uppercase font-bold">Hasil</span>
                    <span className="font-bold text-red-950 text-[11px]">{recipe.yields}</span>
                  </div>
                  <div className="border-l border-red-300">
                    <span className="block text-red-700 text-[9px] uppercase font-bold">Tingkat</span>
                    <span className="font-bold text-red-950 text-[11px]">{recipe.difficulty}</span>
                  </div>
                </div>

                {/* HPP & Margin Box */}
                <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl flex items-center justify-between text-xs text-amber-950 font-medium">
                  <div>
                    <span className="font-bold text-red-900 block text-[10px] uppercase">Modal</span>
                    <span className="font-bold">Rp {recipe.hpp.baseCostPerYield.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-l border-amber-200 pl-2.5">
                    <span className="font-bold text-red-900 block text-[10px] uppercase">Kemasan</span>
                    <span className="font-bold">Rp {recipe.hpp.packagingCostPerJar.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-l border-amber-200 pl-2.5">
                    <span className="font-bold text-red-900 block text-[10px] uppercase">Harga Jual</span>
                    <span className="font-bold text-red-950">Rp {recipe.hpp.recommendedPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-bold text-center text-xs shadow-2xs">
                    +{recipe.hpp.marginPercent}%
                  </div>
                </div>
              </div>

              {/* Right Column: Ingredients & Instructions (7 cols) */}
              <div className="col-span-7 space-y-2.5 pl-1">
                <div className="grid grid-cols-12 gap-3">
                  {/* Ingredients (5 cols) */}
                  <div className="col-span-5 bg-red-50/80 p-3.5 rounded-xl border border-red-200 space-y-1.5">
                    <h3 className="font-serif font-bold text-xs text-red-900 uppercase tracking-wider border-b border-red-200 pb-1">
                      Bahan Baku:
                    </h3>
                    <ul className="space-y-1 text-[11.5px] text-red-950 leading-snug">
                      {recipe.ingredients.map((ing, iIdx) => (
                        <li key={iIdx} className="flex items-start space-x-1.5">
                          <span className="text-red-600 font-bold">•</span>
                          <span>
                            <strong>{ing.name}</strong>: {ing.amount} {ing.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps (7 cols) */}
                  <div className="col-span-7 bg-white p-3.5 rounded-xl border border-red-200 space-y-1.5">
                    <h3 className="font-serif font-bold text-xs text-red-900 uppercase tracking-wider border-b border-red-200 pb-1">
                      Langkah Pembuatan:
                    </h3>
                    <div className="space-y-1.5 text-[11.5px] text-red-950 leading-snug">
                      {recipe.instructions.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start space-x-1.5">
                          <span className="w-4 h-4 rounded-full bg-red-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {step.stepNumber}
                          </span>
                          <div>
                            <strong className="text-red-950">{step.title}: </strong>
                            <span className="text-red-900/90">{step.instruction}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pro Tips */}
                {recipe.proTips && recipe.proTips.length > 0 && (
                  <div className="bg-rose-100/80 p-2.5 rounded-xl text-xs text-red-950 border border-red-200">
                    <span className="font-bold text-red-900 block mb-0.5 text-xs">💡 Tips Rahasia Sukses:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {recipe.proTips.map((tip, tIdx) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2.5 border-t-2 border-red-300/80 flex items-center justify-between text-xs text-red-900 font-semibold relative z-10">
              <span className="whitespace-nowrap">Universitas Muhammadiyah Malang • Proyek Kepemimpinan PGSD</span>
              <span className="font-mono bg-red-200 text-red-950 px-3.5 py-0.5 rounded-full font-bold text-xs whitespace-nowrap">
                Lembar Resep • Desa Sumbergondo - Kota Batu
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

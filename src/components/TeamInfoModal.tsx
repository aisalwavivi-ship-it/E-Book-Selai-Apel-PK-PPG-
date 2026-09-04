import React from 'react';
import { Users, Award, MapPin, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export const TeamInfoModal: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Proposal Banner */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 dark:from-slate-900 dark:via-red-950 dark:to-slate-900 text-red-50 dark:text-slate-100 p-8 rounded-3xl shadow-xl border border-red-700 dark:border-slate-800 space-y-3 transition-colors">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-800/80 dark:bg-slate-800/90 text-rose-200 dark:text-amber-300 text-xs font-semibold border border-red-700/50 dark:border-slate-700">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Informasi Proposal & Pengabdian Masyarakat</span>
        </div>
        <h2 className="font-serif text-3xl font-extrabold text-white tracking-tight">
          Proyek Kepemimpinan & Pengabdian Masyarakat
        </h2>
        <p className="text-sm text-rose-200 dark:text-slate-300 max-w-2xl font-sans leading-relaxed">
          "Pemberdayaan Ekonomi Usaha Mikro, Kecil, dan Menengah (UMKM) Berbasis Kolaborasi Mahasiswa dan Masyarakat"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Team Identity */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-red-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <h3 className="font-serif font-bold text-xl text-red-950 dark:text-slate-100 border-b border-red-200 dark:border-slate-800 pb-3 flex items-center space-x-2">
            <Users className="w-5 h-5 text-red-700 dark:text-amber-400" />
            <span>Identitas Pelaksana Kegiatan</span>
          </h3>

          <div className="space-y-4 text-xs sm:text-sm text-red-900 dark:text-slate-200">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-slate-800 border border-red-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-red-700 dark:text-amber-400 block">Ketua Pelaksana</span>
              <span className="font-bold text-base text-red-950 dark:text-slate-100 block">Camelia Nur Laili</span>
              <span className="text-xs text-red-800 dark:text-slate-300 font-semibold block">Mahasiswa PGSD - UMM</span>
              <span className="text-xs text-red-800 dark:text-slate-400 block">Prodi: Pendidikan Guru Sekolah Dasar (PGSD)</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-slate-800 border border-red-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-red-700 dark:text-amber-400 block">Dosen Pendamping</span>
              <span className="font-bold text-base text-red-950 dark:text-slate-100 block">Dr. Anis Farida Jamil, M.Pd.</span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-red-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block dark:text-slate-100">Lokasi Kegiatan:</span>
                  <span className="dark:text-slate-300">Desa Sumbergondo, Kecamatan Bumiaji, Kota Batu</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Calendar className="w-4 h-4 text-red-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block dark:text-slate-100">Status Program:</span>
                  <span className="dark:text-slate-300">Program Pengabdian & Pemberdayaan Masyarakat Berkelanjutan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Phases & Budget */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-red-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <h3 className="font-serif font-bold text-xl text-red-950 dark:text-slate-100 border-b border-red-200 dark:border-slate-800 pb-3 flex items-center space-x-2">
              <Award className="w-5 h-5 text-red-700 dark:text-amber-400" />
              <span>4 Tahap Program Kegiatan</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-slate-800/90 border border-red-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-red-950 dark:text-slate-100 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>1. Inisiasi & Observasi Lapangan</span>
                </span>
                <p className="text-red-800 dark:text-slate-300 text-xs pl-5">
                  Koordinasi bersama pemerintah desa, wawancara kelompok tani, perizinan, dan identifikasi potensi apel Anna afkir.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-slate-800/90 border border-red-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-red-950 dark:text-slate-100 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>2. Tahap Eksperimentasi Formulasi</span>
                </span>
                <p className="text-red-800 dark:text-slate-300 text-xs pl-5">
                  Uji coba pembuatan selai apel, perancangan kemasan jar kaca, dan penyusunan E-Book Buku Resep Selai Apel dan Olahannya ini.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-slate-800/90 border border-red-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-red-950 dark:text-slate-100 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>3. Tahap Pemberdayaan & Pelatihan</span>
                </span>
                <p className="text-red-800 dark:text-slate-300 text-xs pl-5">
                  Sosialisasi diversifikasi olahan apel, praktik pembuatan selai apel, pendampingan kemasan, dan distribusi Buku Resep Selai Apel dan Olahannya.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-slate-800/90 border border-red-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-red-950 dark:text-slate-100 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>4. Evaluasi & Pendampingan Lanjutan</span>
                </span>
                <p className="text-red-800 dark:text-slate-300 text-xs pl-5">
                  Evaluasi tingkat keterampilan masyarakat, pendampingan lanjutan, dan penyusunan laporan pertanggungjawaban akhir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface KitchenTipItem {
  id: string;
  title: string;
  shortSummary: string;
  keyRule: string;
  details: string[];
  iconName: 'ShieldCheck' | 'Thermometer' | 'Sparkles' | 'Clock' | 'Flame' | 'AlertCircle';
  badge: string;
}

export interface KitchenTipCategory {
  id: 'ketahanan' | 'kebersihan';
  title: string;
  subtitle: string;
  iconName: 'Clock' | 'ShieldCheck';
  summaryBadge: string;
  tips: KitchenTipItem[];
}

export const umkmKitchenTipsData: KitchenTipCategory[] = [
  {
    id: 'ketahanan',
    title: 'Ketahanan Produk Selai Apel',
    subtitle: 'Strategi praktis memperpanjang daya simpan selai apel secara alami tanpa bahan kimia sintesis.',
    iconName: 'Clock',
    summaryBadge: 'Daya Simpan 3 - 6 Bulan',
    tips: [
      {
        id: 'gula-preservatif',
        title: 'Konsentrasi Gula sebagai Pengawet Alami',
        shortSummary: 'Gula pasir mengikat kadar air bebas (Aw) sehingga bakteri dan jamur tidak dapat berkembang biak.',
        keyRule: 'Rasio ideal: 50% - 60% dari total berat apel segar yang dihaluskan.',
        details: [
          'Gula bertindak secara osmosis menarik air keluar dari sel mikroorganisme sehingga menghambat pembusukan secara alami.',
          'Hindari mengurangi takaran gula secara berlebihan jika produk ditujukan untuk disimpan dalam jangka waktu berbulan-bulan.',
          'Pastikan gula larut homogen dan mencapai konsistensi gel pektin yang sempurna sebelum kompor dimatikan.'
        ],
        iconName: 'Sparkles',
        badge: 'Pengawetan Alami'
      },
      {
        id: 'asam-lemon-ph',
        title: 'Keseimbangan Asam & Aktivasi Pektin',
        shortSummary: 'Air perasan lemon menurunkan pH adonan ke tingkat 3.2 - 3.4 untuk mencegah mikroba patogen.',
        keyRule: 'Tambahkan 1–2 sdm air perasan lemon di pertengahan proses pemasakan.',
        details: [
          'Tingkat keasaman yang cukup menghambat pertumbuhan bakteri berbahaya seperti Clostridium botulinum.',
          'Asam sitrat alami lemon juga mengaktifkan jalinan serat pektin buah apel Anna agar selai mengental kenyal alami tanpa gelatin kimia.',
          'Membantu menjaga warna selai apel tetap cerah dan tidak cepat menggelap (browning oksidatif).'
        ],
        iconName: 'ShieldCheck',
        badge: 'Kontrol pH'
      },
      {
        id: 'hot-filling-vakum',
        title: 'Teknik Hot-Filling & Pembalikan Jar',
        shortSummary: 'Pengisian selai mendidih langsung ke toples untuk menciptakan ruang hampa udara (vakum alami).',
        keyRule: 'Tuang selai saat suhu masih 85°C–90°C, tutup rapat segera, lalu balikkan toples selama 5 menit.',
        details: [
          'Uap panas selai mendidih akan mensterilkan permukaan dalam tutup toples secara otomatis.',
          'Saat toples mendingin, udara di ruang kepala (headspace) akan menyusut dan menarik tutup logam ke dalam (bunyi klik vakum).',
          'Tinggalkan ruang kosong (headspace) sekitar 0.5 - 1 cm dari bibir atas toples.'
        ],
        iconName: 'Flame',
        badge: 'Vakum Alami'
      },
      {
        id: 'panduan-daya-simpan',
        title: 'Estimasi Durasi Penyimpanan',
        shortSummary: 'Standar waktu simpan optimal selai apel buatan UMKM Sumbergondo berdasarkan metode penyimpanan.',
        keyRule: 'Suhu ruang sejuk: 3–6 bulan | Kulkas bersegel: 12 bulan | Setelah buka: 3–4 minggu.',
        details: [
          'Toples Tersegel Vakum (Suhu Ruang Sejuk & Kering): Tahan 3 hingga 6 bulan (hindari paparan sinar matahari langsung).',
          'Toples Tersegel Vakum (Lemari Pendingin / Chiller): Tahan hingga 12 bulan dengan tekstur dan aroma yang tetap stabil.',
          'Toples yang Sudah Dibuka Segelnya: Simpan di dalam kulkas dan habiskan dalam 3 hingga 4 minggu dengan selalu menggunakan sendok bersih.'
        ],
        iconName: 'Clock',
        badge: 'Standar Waktu'
      }
    ]
  },
  {
    id: 'kebersihan',
    title: 'Kebersihan & Sterilisasi Kemasan',
    subtitle: 'Standar sanitasi higienitas wadah toples kaca dan penanganan higienis standar UMKM makanan.',
    iconName: 'ShieldCheck',
    summaryBadge: 'Higienitas 100% Food Grade',
    tips: [
      {
        id: 'sterilisasi-jar-rebus',
        title: 'Sterilisasi Rebus (Thermal Sanitizing)',
        shortSummary: 'Mematikan mikroba, spora jamur, dan kuman yang menempel pada toples kaca dan tutup botol.',
        keyRule: 'Rebus toples kaca dan tutup logam dalam air mendidih (100°C) selama 10–15 menit.',
        details: [
          'Cuci toples dan tutup terlebih dahulu dengan sabun pencuci piring food-grade dan bilas hingga benar-benar bersih.',
          'Letakkan toples terendam air dingin di panci, lalu nyalakan kompor bertahap hingga mendidih (mencegah kaca retak akibat thermal shock).',
          'Angkat menggunakan capitan bersih yang telah disterilkan atau sarung tangan anti panas steril.'
        ],
        iconName: 'Thermometer',
        badge: 'Suhu 100°C'
      },
      {
        id: 'pengeringan-udara-alami',
        title: 'Pengeringan Alami Tanpa Lap Kain',
        shortSummary: 'Jangan menyeka bagian dalam toples dengan lap kain dapur biasa karena dapat memicu kontaminasi silang.',
        keyRule: 'Tiriskan toples dengan posisi tengkurap di atas rak kawat stainless steril atau baking paper bersih.',
        details: [
          'Lap kain dapur yang telah dipakai berulang kali merupakan sarang bakteri dan spora jamur tak kasat mata.',
          'Biarkan sisa air menguap dengan sendirinya dari panas toples yang baru saja diangkat dari rebusan.',
          'Pastikan toples sudah 100% kering dari sisa tetesan air mentah sebelum dituangi adonan selai panas.'
        ],
        iconName: 'AlertCircle',
        badge: 'Bebas Kontaminasi'
      },
      {
        id: 'segel-plastik-shrink',
        title: 'Pemasangan Segel Plastik (Shrink Seal)',
        shortSummary: 'Memberikan jaminan keamanan fisik produk dan mencegah tutup terbuka tanpa sengaja selama distribusi.',
        keyRule: 'Gunakan plastik segel PVC pada leher tutup toples dan panaskan dengan heat gun / hairdryer.',
        details: [
          'Segel plastik shrink melindungi mulut toples dari debu, kotoran, dan serangga selama penyimpanan di etalase toko.',
          'Meningkatkan kepercayaan konsumen terhadap higienitas dan profesionalitas merek UMKM Desa Sumbergondo.',
          'Menjadi indikator visual yang jelas bahwa produk belum pernah dibuka sejak diproduksi.'
        ],
        iconName: 'ShieldCheck',
        badge: 'Keamanan Segel'
      },
      {
        id: 'edukasi-sendok-bersih',
        title: 'Edukasi Konsumen "Gunakan Sendok Bersih"',
        shortSummary: 'Cegah kontaminasi mikroba setelah kemasan dibeli konsumen dengan informasi pada label.',
        keyRule: 'Cantumkan anjuran: "Gunakan selalu sendok bersih dan kering saat mengambil selai".',
        details: [
          'Tetesan air liur, remah roti basah, atau sisa mentega pada sendok bekas akan menjadi media tumbuh cepat bagi jamur.',
          'Beri tahu konsumen untuk segera menutup rapat toples setelah diambil dan mengembalikannya ke kulkas.',
          'Label yang informatif menunjukkan kepedulian UMKM terhadap mutu dan keselamatan pelanggan.'
        ],
        iconName: 'Sparkles',
        badge: 'Edukasi Konsumen'
      }
    ]
  }
];

export const quickChecklistUMKM = [
  { id: 'c1', text: 'Toples dan tutup sudah direbus 10-15 menit dan kering alami tanpa dilap.' },
  { id: 'c2', text: 'Kadar gula pas (50-60%) dan air lemon sudah dimasukkan untuk pengawetan alami.' },
  { id: 'c3', text: 'Pengisian dilakukan saat selai masih mendidih panas (85°C-90°C).' },
  { id: 'c4', text: 'Toples dibalik selama 5 menit setelah ditutup rapat untuk vakum alami.' },
  { id: 'c5', text: 'Segel plastik shrink terpasang rapi dan label mencantumkan tanggal kedaluwarsa.' }
];

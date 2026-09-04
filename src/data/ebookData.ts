import selaiApelJarImg from '../assets/images/selai_apel_toples_asli_1788246966634.jpg';
import nastarApelImg from '../assets/images/nastar_apel_batu_hero_1788247447271.jpg';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface Step {
  stepNumber: number;
  title: string;
  instruction: string;
  timerMinutes?: number;
  tip?: string;
}

export interface NutritionHighlight {
  label: string;
  value: string;
  percentageDailyValue?: number; // % AKG (Angka Kecukupan Gizi ~2150 kkal)
}

export interface NutritionInfo {
  servingSize: string;
  servingsPerRecipe: number;
  calories: number; // kcal per standard serving
  protein: number; // grams per serving
  fat: number; // grams per serving (total fat)
  carbs: number; // grams per serving
  sugar: number; // grams per serving
  fiber: number; // grams per serving
  sodium?: number; // mg per serving
  highlights?: NutritionHighlight[];
  healthNotes?: string[];
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  category: 'dasar' | 'nastar' | 'pastry' | 'minuman';
  categoryLabel: string;
  prepTime: string;
  cookTime: string;
  yields: string;
  servingsBase: number;
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan';
  image: string;
  description: string;
  tags: string[];
  ingredients: Ingredient[];
  instructions: Step[];
  proTips: string[];
  nutrition?: NutritionInfo;
  hpp: {
    baseCostPerYield: number;
    packagingCostPerJar: number;
    recommendedPrice: number;
    marginPercent: number;
  };
}

export interface BookPage {
  pageNumber: number;
  chapterTitle?: string;
  title: string;
  subtitle?: string;
  type: 'cover' | 'intro' | 'toc' | 'article' | 'recipe' | 'business' | 'team';
  content: {
    heading?: string;
    paragraphs?: string[];
    bulletPoints?: string[];
    calloutBox?: {
      title: string;
      text: string;
      type: 'info' | 'tip' | 'warning' | 'success';
    };
    recipeId?: string;
    quote?: {
      text: string;
      author: string;
      role: string;
    };
    tableData?: {
      headers: string[];
      rows: string[][];
    };
  };
}

export interface EbookMetadata {
  title: string;
  subtitle: string;
  edition: string;
  publisher: string;
  author: string;
  institution: string;
  location: string;
  year: string;
  description: string;
  targetAudience: string;
}

export const ebookMetadata: EbookMetadata = {
  title: "Buku Resep Selai Apel dan Olahannya",
  subtitle: "Panduan Olahan Selai Apel Anna & Inovasi Jajanan Bernilai Tambah Bagi Masyarakat Desa Sumbergondo",
  edition: "Edisi Praktis Panduan UMKM",
  publisher: "Tim Proyek Kepemimpinan & Pengabdian Masyarakat",
  author: "Camelia Nur Laili & Tim Mahasiswa PGSD",
  institution: "Universitas Muhammadiyah Malang",
  location: "Desa Sumbergondo, Bumiaji, Kota Batu",
  year: "Panduan Berkelanjutan",
  description: "Buku Resep Selai Apel dan Olahannya ini disusun sebagai panduan praktis diversifikasi produk olahan apel afkir/BS menjadi selai apel berkualitas dan aneka olahan kue bernilai ekonomi tinggi.",
  targetAudience: "Masyarakat, Pelaku UMKM, dan Ibu-Ibu Kelompok Tani Desa Sumbergondo"
};

export const recipesData: Recipe[] = [
  {
    id: "selai-apel-dasar",
    title: "Selai Apel Anna khas Sumbergondo",
    subtitle: "Resep Utama Selai Apel Segar dengan Pektin Alami & Rempah Kayu Manis",
    category: "dasar",
    categoryLabel: "Resep Dasar Selai",
    prepTime: "20 Menit",
    cookTime: "35 Menit",
    yields: "3 Jar (@ 250 gram)",
    servingsBase: 3,
    difficulty: "Mudah",
    image: selaiApelJarImg,
    description: "Selai apel lezat berbahan baku apel Anna afkir/layak konsumsi dari kebun Desa Sumbergondo. Memiliki perpaduan rasa manis asam yang seimbang, aroma kayu manis yang menggugah selera, dan tekstur lembut yang tahan disimpan.",
    tags: ["Olahan Dasar", "Apel Anna", "Tahan Lama", "Tanpa Pengawet Buatan"],
    ingredients: [
      { name: "Apel Anna Segar (Kupas & Cincang Halus)", amount: 1000, unit: "gram", notes: "Gunakan apel afkir/BS layak konsumsi yang direndam air garam" },
      { name: "Gula Pasir", amount: 400, unit: "gram", notes: "Dapat disesuaikan dengan tingkat kemanisan buah" },
      { name: "Air Perasan Lemon", amount: 2, unit: "sdm", notes: "Mencegah oksidasi & sumber pektin alami" },
      { name: "Kayu Manis Bubuk / Batang", amount: 1, unit: "sdt", notes: "Gunakan 1 batang jika pakai kayu manis utuh" },
      { name: "Garam Halus", amount: 0.5, unit: "sdt", notes: "Memperkuat rasa manis gurih alami" },
      { name: "Air Bersih (untuk perendaman)", amount: 1000, unit: "ml", notes: "Dicampur 1 sdm garam untuk perendaman awal" }
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Pembersihan & Perendaman Oksidasi",
        instruction: "Cuci bersih apel Anna. Buang bagian busuk/cacat fisik. Kupas kulit dan cincang halus atau parut kasar buah apel. Segera masukkan potongan apel ke dalam larutan air garam (1 liter air + 1 sdm garam) selama 10 menit agar warna apel tidak memerah/kecokelatan (oksidasi)."
      },
      {
        stepNumber: 2,
        title: "Penghalusan & Pelunakan",
        instruction: "Tiriskan apel dari air garam. Haluskan sebagian apel menggunakan blender dengan sedikit air (atau ditumbuk halus), sisakan sebagian berbentuk cincangan agar selai memiliki tekstur renyah alami (chunky)."
      },
      {
        stepNumber: 3,
        title: "Pemasakan & Pengentalan",
        instruction: "Masukkan olahan apel ke dalam wajan anti lengket atau panci tebal. Tambahkan gula pasir, perasan lemon, bubuk kayu manis, dan garam. Masak di atas api sedang cenderung kecil sambil terus diaduk secara berkala.",
        timerMinutes: 25,
        tip: "Aduk terus saat adonan mulai mengental agar bagian bawah panci tidak gosong."
      },
      {
        stepNumber: 4,
        title: "Pengujian Kematangan (Wrinkle Test)",
        instruction: "Setelah adonan mengental dan air menyusut (tekstur mengkilat lekat), ambil setengah sendok teh selai dan teteskan di atas piring dingin. Jika selai tidak meleber dan tetap mengumpul, artinya selai sudah matang sempurna."
      },
      {
        stepNumber: 5,
        title: "Pengemasan Steril",
        instruction: "Tuang selai apel saat masih panas ke dalam jar kaca steril. Tutup rapat lalu balikkan jar selama 5 menit untuk menciptakan sistem vakum alami. Biarkan dingin pada suhu ruang.",
        tip: "Sterilisasi jar dengan perebusan air mendidih selama 10 menit sebelum digunakan."
      }
    ],
    proTips: [
      "Perasan lemon wajib digunakan karena selain memberi kesegaran asam, kandungan asam sitrat merangsang pektin alami apel membentuk gel selai yang kokoh.",
      "Selai dalam jar steril yang ditutup rapat tahan hingga 3-6 bulan di suhu ruang dan lebih dari 9 bulan di dalam lemari es.",
      "Gunakan api kecil saat gula sudah melarut agar karamelisasi gula berjalan lembut dan warna selai tetap kuning keemasan menarik."
    ],
    nutrition: {
      servingSize: "1 Sendok Makan (20 gram)",
      servingsPerRecipe: 37,
      calories: 55,
      protein: 0.1,
      fat: 0.1,
      carbs: 14.2,
      sugar: 13.5,
      fiber: 0.8,
      sodium: 8,
      highlights: [
        { label: "Kalori", value: "55 kkal", percentageDailyValue: 3 },
        { label: "Protein", value: "0.1 g", percentageDailyValue: 0.2 },
        { label: "Lemak Total", value: "0.1 g", percentageDailyValue: 0.1 },
        { label: "Karbohidrat", value: "14.2 g", percentageDailyValue: 4 },
        { label: "Serat Pektin Alami", value: "0.8 g", percentageDailyValue: 3 },
        { label: "Gula Buah & Alami", value: "13.5 g", percentageDailyValue: 27 }
      ],
      healthNotes: [
        "Kaya serat pektin alami dari apel Anna yang baik untuk kesehatan saluran pencernaan.",
        "Bebas lemak jenuh & 0% kolesterol (Cholesterol Free).",
        "Mengandung antioksidan polifenol flavonoid dan vitamin C alami lemon."
      ]
    },
    hpp: {
      baseCostPerYield: 12000,
      packagingCostPerJar: 4000,
      recommendedPrice: 20000,
      marginPercent: 60
    }
  },

  {
    id: "nastar-selai-apel",
    title: "Nastar Apel Batu",
    subtitle: "Inovasi Kue Kering Khas Batu: Kulit Lumer Gurih dengan Isian Selai Apel Segar",
    category: "nastar",
    categoryLabel: "Kue Kering & Nastar",
    prepTime: "45 Menit",
    cookTime: "30 Menit",
    yields: "2 Toples (@ 350 gram)",
    servingsBase: 2,
    difficulty: "Sedang",
    image: nastarApelImg,
    description: "Inovasi nastar kekinian yang mengganti isian nanas biasa dengan isian Selai Apel Anna khas Sumbergondo yang dikeringkan sedikit. Memiliki citarasa asam manis segar yang unik, pas untuk oleh-oleh khas Kota Batu.",
    tags: ["Inovasi Oleh-Oleh", "Nastar Apel", "Kue Kering", "Best Seller UMKM"],
    ingredients: [
      { name: "Selai Apel Anna (Pulut Isian)", amount: 300, unit: "gram", notes: "Dimasak hingga lebih padat dan bisa dipulung bulatan kecil" },
      { name: "Tepung Terigu Protein Rendah", amount: 350, unit: "gram", notes: "Diayak halus" },
      { name: "Mentega / Butter Premium", amount: 150, unit: "gram", notes: "Dapat menggunakan campuran Wisman/Anchor" },
      { name: "Margarin Quality", amount: 100, unit: "gram", notes: "Suhu ruang" },
      { name: "Gula Halus", amount: 60, unit: "gram", notes: "Diayak" },
      { name: "Kuning Telur", amount: 2, unit: "butir", notes: "Ukuran sedang" },
      { name: "Susu Bubuk Full Cream", amount: 25, unit: "gram", notes: "Menambah aroma gurih wangi" },
      { name: "Tepung Maizena", amount: 25, unit: "gram", notes: "Membuat tekstur kulit lebih renyah lumer" },
      { name: "Bahan Olesan (Kuning Telur + 1 sdt Minyak + 1 sdt Susu)", amount: 2, unit: "butir", notes: "Untuk kilapan golden shiny" }
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Penyiapan Isian Selai Apel Pulung",
        instruction: "Masak kembali Selai Apel dasar di api sangat kecil hingga adonan agak mengering dan kenyal. Dinginkan, lalu bentuk menjadi bulatan-bulatan kecil (bobot 4-5 gram). Sisihkan dalam wadah tertutup."
      },
      {
        stepNumber: 2,
        title: "Pembuatan Adonan Kulit Nastar",
        instruction: "Kocok mentega, margarin, dan gula halus dengan mixer kecepatan rendah selama 1-2 menit saja (jangan terlalu lama agar nastar tidak meleber saat dipanggang). Masukkan kuning telur satu per satu, adok rata."
      },
      {
        stepNumber: 3,
        title: "Pencampuran Bahan Kering",
        instruction: "Campurkan tepung terigu, tepung maizena, dan susu bubuk yang sudah diayak. Masukkan secara bertahap ke dalam kocokan mentega, aduk perlahan dengan spatula hingga adonan kalis dan dapat dibentuk."
      },
      {
        stepNumber: 4,
        title: "Pembentukan & Pengisian",
        instruction: "Ambil adonan kulit seberat 8-10 gram, pipihkan. Beri isian bulatan selai apel di tengahnya, lalu bulatkan kembali hingga mulus tanpa retakan. Tata di atas loyang yang diolesi sedikit margarin."
      },
      {
        stepNumber: 5,
        title: "Pemanggangan Tahap Pertama & Pengolesan",
        instruction: "Panggang dalam oven yang telah dipanaskan pada suhu 140°C-150°C selama 20 menit. Keluarkan loyang, biarkan agak hangat, lalu olesi permukaan nastar dengan bahan olesan kuning telur 2 kali olesan.",
        timerMinutes: 20
      },
      {
        stepNumber: 6,
        title: "Pemanggangan Akhir",
        instruction: "Panggang kembali selama 10-12 menit hingga warna permukaan nastar menjadi kuning keemasan (golden brown) yang mengkilap. Biarkan dingin sempurna sebelum dimasukkan ke dalam toples rapat.",
        timerMinutes: 12
      }
    ],
    proTips: [
      "Pastikan isian selai apel benar-benar kering dan tidak basah berair agar kulit nastar tidak retak dan tahan lama tanpa jamur.",
      "Mengoles bahan olesan saat nastar sudah setengah matang dan agak hangat akan menghasilkan kilap sempurna (egg wash super shiny).",
      "Kemas toples nastar dengan seal plastik kedap udara untuk menjaga kerenyahan hingga 2-3 bulan."
    ],
    nutrition: {
      servingSize: "3 Butir Nastar (~30 gram)",
      servingsPerRecipe: 24,
      calories: 145,
      protein: 2.2,
      fat: 6.8,
      carbs: 18.5,
      sugar: 7.0,
      fiber: 0.6,
      sodium: 45,
      highlights: [
        { label: "Kalori", value: "145 kkal", percentageDailyValue: 7 },
        { label: "Protein", value: "2.2 g", percentageDailyValue: 4 },
        { label: "Lemak Total", value: "6.8 g", percentageDailyValue: 10 },
        { label: "Karbohidrat", value: "18.5 g", percentageDailyValue: 6 },
        { label: "Serat Alami", value: "0.6 g", percentageDailyValue: 2 },
        { label: "Gula", value: "7.0 g", percentageDailyValue: 14 }
      ],
      healthNotes: [
        "Isian selai apel Anna memberikan kesegaran asam organik alami yang menyeimbangkan gurihnya butter.",
        "Mengandung protein dan kalsium alami dari susu bubuk dan kuning telur segar.",
        "Tekstur renyah lumer dengan aroma harum mentega khas kue kering premium."
      ]
    },
    hpp: {
      baseCostPerYield: 28000,
      packagingCostPerJar: 5000,
      recommendedPrice: 50000,
      marginPercent: 51
    }
  },

  {
    id: "pie-apel-mini",
    title: "Pie Apel Mini Strudel",
    subtitle: "Pastry Tartlet Renyah Isi Selai Apel & Taburan Kayu Manis",
    category: "pastry",
    categoryLabel: "Kue Kering & Pastry",
    prepTime: "30 Menit",
    cookTime: "25 Menit",
    yields: "12 Pcs Pie Mini",
    servingsBase: 12,
    difficulty: "Mudah",
    image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?auto=format&fit=crop&q=80&w=800",
    description: "Pastry tartlet renyah porsi individu beraroma mentega gurih, berisikan Selai Apel Anna khas Sumbergondo dengan sentuhan kayu manis semerbak. Cocok disajikan saat acara arisan, isian snack box, maupun hampers oleh-oleh istimewa khas Kota Batu.",
    tags: ["Pastry Apel", "Snack Box", "Usaha Rumahan", "Mudah Dibuat", "Best Seller"],
    ingredients: [
      { name: "Selai Apel Anna khas Sumbergondo", amount: 250, unit: "gram", notes: "Sebagai isian manis segar pie" },
      { name: "Tepung Terigu Protein Sedang", amount: 250, unit: "gram", notes: "Bahan dasar kulit pie gurih" },
      { name: "Margarin / Butter Dingin", amount: 125, unit: "gram", notes: "Potong dadu kecil bersuhu dingin" },
      { name: "Gula Halus", amount: 30, unit: "gram", notes: "Untuk manis lembut renyah" },
      { name: "Kuning Telur", amount: 1, unit: "butir", notes: "Peningkat rasa gurih kulit" },
      { name: "Air Es / Air Dingin", amount: 2, unit: "sdm", notes: "Untuk menyatukan adonan kulit" },
      { name: "Bahan Olesan (Kuning Telur + Susu Cair)", amount: 1, unit: "butir", notes: "Untuk warna golden mengkilap" },
      { name: "Kismis / Keju Parut (Opsional)", amount: 30, unit: "gram", notes: "Topping rasa tambahan" }
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Pembuatan Adonan Kulit Pie",
        instruction: "Campur tepung terigu, gula halus, dan margarin dingin. Potong-potong menggunakan pastry cutter atau garpu hingga berbentuk butiran pasir halus. Masukkan kuning telur dan air es, aduk cepat dengan jemari hingga adonan menyatu dan dapat dipulung."
      },
      {
        stepNumber: 2,
        title: "Pencetakan Cetakan Pie Mini",
        instruction: "Bungkus adonan kulit dengan plastik dan simpan di kulkas selama 15 menit agar renyah. Ambil adonan secukupnya, cetak pada cetakan pie mini yang sudah diolesi tipis margarin, rapikan pinggirannya, lalu tusuk-tusuk bagian dasar dengan garpu."
      },
      {
        stepNumber: 3,
        title: "Pengisian Selai & Hiasan Anyaman",
        instruction: "Isi dasar cetakan pie dengan 1-1,5 sendok makan Selai Apel Anna. Sisa adonan kulit dipipihkan dan dipotong memanjang untuk membuat motif hiasan anyaman keranjang (lattice top) di atas permukaan selai apel."
      },
      {
        stepNumber: 4,
        title: "Pemolesan & Pemanggangan Sempurna",
        instruction: "Olesi bagian atas anyaman pie dengan bahan olesan kuning telur. Panggang dalam oven yang telah dipanaskan pada suhu 160°C-170°C selama 25-30 menit hingga kulit pie berwarna kuning keemasan dan renyah sempurna.",
        timerMinutes: 25
      }
    ],
    proTips: [
      "Mentega/margarin dingin sangat penting agar terbentuk tekstur flaky (berlapis renyah) pada kulit pie.",
      "Tusukan garpu di dasar cetakan mencegah adonan menggelembung naik saat dipanggang di dalam oven.",
      "Kemas pie dalam kotak mika atau kardus hampers bersekat untuk menjaga kerenyahan dan estetika nilai jual produk."
    ],
    nutrition: {
      servingSize: "1 Buah Pie Mini (~45 gram)",
      servingsPerRecipe: 12,
      calories: 178,
      protein: 2.8,
      fat: 8.4,
      carbs: 23.0,
      sugar: 9.5,
      fiber: 1.2,
      sodium: 60,
      highlights: [
        { label: "Kalori", value: "178 kkal", percentageDailyValue: 8 },
        { label: "Protein", value: "2.8 g", percentageDailyValue: 5 },
        { label: "Lemak Total", value: "8.4 g", percentageDailyValue: 12 },
        { label: "Karbohidrat", value: "23.0 g", percentageDailyValue: 7 },
        { label: "Serat Alami", value: "1.2 g", percentageDailyValue: 4 },
        { label: "Gula", value: "9.5 g", percentageDailyValue: 19 }
      ],
      healthNotes: [
        "Serat alami buah apel & karbohidrat gandum memberikan rasa kenyang lebih stabil untuk camilan.",
        "Aroma kayu manis mengandung antioksidan alami yang mendukung metabolisme tubuh.",
        "Sajian porsi individu (single-portion) yang terkontrol nilai gizinya."
      ]
    },
    hpp: {
      baseCostPerYield: 22000,
      packagingCostPerJar: 3000,
      recommendedPrice: 40000,
      marginPercent: 60
    }
  },

  {
    id: "minuman-sparkling-apple-tea",
    title: "Minuman Refreshing Apple Jam Tea",
    subtitle: "Minuman Es Teh Selai Apel & Soda Segar untuk Kafe / Kedai Desa",
    category: "minuman",
    categoryLabel: "Minuman Segar",
    prepTime: "5 Menit",
    cookTime: "3 Menit",
    yields: "1 Gelas Sajian (350 ml)",
    servingsBase: 1,
    difficulty: "Mudah",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    description: "Sajian minuman kekinian yang memanfaatkan Selai Apel Anna sebagai bahan dasar pemanis aroma alami. Sangat cocok dijual di kedai wisata Desa Sumbergondo sebagai alternatif es teh premium khas Batu dengan margin laba tinggi.",
    tags: ["Minuman Segar", "Menu Kafe", "Cepat Disajikan", "Sangat Menguntungkan", "Best Seller"],
    ingredients: [
      { name: "Selai Apel Anna khas Sumbergondo", amount: 2, unit: "sdm", notes: "Sebagai sari pemanis & aroma buah alami" },
      { name: "Seduhan Teh Hitam (Black Tea / Earl Grey)", amount: 120, unit: "ml", notes: "Seduh kental, dinginkan suhu ruang" },
      { name: "Air Soda / Sparkling Water / Air Es", amount: 100, unit: "ml", notes: "Memberikan sensasi segar berkarbonasi" },
      { name: "Air Perasan Lemon", amount: 1, unit: "sdt", notes: "Penyeimbang kesegaran asam manis" },
      { name: "Es Batu Kristal", amount: 1, unit: "gelas", notes: "Secukupnya hingga gelas penuh" },
      { name: "Irisan Apel Anna Segar & Daun Mint", amount: 2, unit: "lembar", notes: "Garnish hiasan cantik menggugah selera" }
    ],
    instructions: [
      {
        stepNumber: 1,
        title: "Penyiapan Dasar Selai Apel",
        instruction: "Masukkan 2 sendok makan Selai Apel Anna ke dalam dasar gelas saji (ukuran 350-400 ml). Tambahkan 1 sendok makan air hangat dan perasan lemon, aduk perlahan agar tekstur selai sedikit mencair di dasar gelas."
      },
      {
        stepNumber: 2,
        title: "Pengisian Es Batu Kristal",
        instruction: "Penuhi gelas dengan es batu kristal padat hingga mencapai 3/4 tinggi gelas untuk menciptakan efek gradasi warna minuman yang estetik."
      },
      {
        stepNumber: 3,
        title: "Penuangan Seduhan Teh Dingin",
        instruction: "Tuangkan seduhan teh hitam dingin secara perlahan di atas bongkahan es batu agar tidak langsung bercampur pekat dengan selai di dasar."
      },
      {
        stepNumber: 4,
        title: "Top-Up Soda & Garnish Cantik",
        instruction: "Beri top-up air soda / sparkling water hingga penuh. Hiasi bibir gelas dengan irisan tipis apel Anna segar dan pucuk daun mint. Sajikan dingin bersama sedotan dan sendok pengaduk."
      }
    ],
    proTips: [
      "Pelanggan dapat mengaduk sendiri selai apel di dasar gelas untuk menyesuaikan tingkat kemanisan yang diinginkan.",
      "Modal bahan baku per gelas sangat terjangkau (sekitar Rp 3.000 - Rp 4.500) dan dapat dijual di kedai/kafe seharga Rp 12.000 - Rp 18.000 per gelas.",
      "Gunakan cup sablon bening dengan logo desa/brand untuk daya tarik take-away wisatawan."
    ],
    nutrition: {
      servingSize: "1 Gelas Saji (350 ml)",
      servingsPerRecipe: 1,
      calories: 92,
      protein: 0.3,
      fat: 0.1,
      carbs: 22.8,
      sugar: 21.0,
      fiber: 0.9,
      sodium: 12,
      highlights: [
        { label: "Kalori", value: "92 kkal", percentageDailyValue: 4 },
        { label: "Protein", value: "0.3 g", percentageDailyValue: 0.5 },
        { label: "Lemak Total", value: "0.1 g", percentageDailyValue: 0.1 },
        { label: "Karbohidrat", value: "22.8 g", percentageDailyValue: 7 },
        { label: "Serat Alami", value: "0.9 g", percentageDailyValue: 3 },
        { label: "Gula Alami", value: "21.0 g", percentageDailyValue: 42 }
      ],
      healthNotes: [
        "Kandungan polifenol katekin dan theaflavin dari seduhan teh hitam berfungsi sebagai antioksidan alami.",
        "Pemanis sari buah apel asli menyegarkan tanpa pemanis buatan sintetis.",
        "Kombinasi asam lemon dan apel memberikan hidrasi elektrolit yang menyegarkan tubuh."
      ]
    },
    hpp: {
      baseCostPerYield: 3500,
      packagingCostPerJar: 1500,
      recommendedPrice: 15000,
      marginPercent: 67
    }
  }
];

export const bookPages: BookPage[] = [
  {
    pageNumber: 1,
    title: "Buku Resep Selai Apel dan Olahannya",
    subtitle: "Panduan Olahan Selai Apel Anna & Inovasi Jajanan Bernilai Tambah Bagi Masyarakat Desa Sumbergondo",
    type: "cover",
    content: {
      heading: "E-BOOK RESEP & STRATEGI UMKM",
      paragraphs: [
        "Hasil Luaran Program Proyek Kepemimpinan & Pengabdian Masyarakat",
        "Desa Sumbergondo, Kecamatan Bumiaji, Kota Batu"
      ],
      quote: {
        text: "Pemberdayaan Ekonomi Usaha Mikro, Kecil, dan Menengah (UMKM) Berbasis Kolaborasi Mahasiswa dan Masyarakat",
        author: "Camelia Nur Laili",
        role: "Ketua Pelaksana Proyek Kepemimpinan PGSD UMM"
      }
    }
  },
  {
    pageNumber: 2,
    title: "Kata Pengantar & Pengesahan",
    chapterTitle: "PENGANTAR & TIM PELAKSANA",
    type: "intro",
    content: {
      heading: "Sambutan Tim Pengabdi & Pembimbing",
      paragraphs: [
        "Puji syukur kami panjatkan kehadirat Tuhan Yang Maha Esa atas terwujudnya Buku Resep Selai Apel dan Olahannya ini. Buku ini disusun sebagai bagian dari luaran konkret Proyek Kepemimpinan dan Pengabdian Masyarakat di Desa Sumbergondo, Kecamatan Bumiaji, Kota Batu.",
        "Desa Sumbergondo memiliki potensi melimpah komoditas Apel Anna. Namun fluktuasi harga dan kendala buah afkir/BS sering menurunkan pendapatan petani. Melalui diversifikasi olahan selai apel dan jajanan turunan, kami berharap masyarakat dapat meningkatkan nilai ekonomi hasil panen secara berkelanjutan."
      ],
      calloutBox: {
        title: "Informasi Dokumen Pengesahan",
        text: "Dosen Pendamping: Dr. Anis Farida Jamil, M.Pd. | Ketua Pelaksana: Camelia Nur Laili (PGSD) | Lokasi: Desa Sumbergondo, Bumiaji, Batu",
        type: "info"
      }
    }
  },
  {
    pageNumber: 3,
    title: "Daftar Isi & Panduan Penggunaan",
    chapterTitle: "DAFTAR ISI E-BOOK",
    type: "toc",
    content: {
      heading: "Peta Navigasi Pembelajaran",
      bulletPoints: [
        "BAB I: Mengenal Potensi Apel Anna & Penanganan Apel Afkir/BS",
        "BAB II: Resep Utama Selai Apel Anna khas Sumbergondo",
        "BAB III: Inovasi Olahan Jajanan (Nastar Apel Batu, Pie Apel Mini Strudel & Refreshing Apple Jam Tea)",
        "BAB IV: Panduan Pengemasan (Packaging) & Kalkulator HPP UMKM",
        "BAB V: Profil Tim Pengabdi & Penutup Program"
      ],
      calloutBox: {
        title: "Fitur Interaktif E-Book Ini",
        text: "Gunakan tombol kalkulator porsi di dalam resep untuk menyesuaikan kebutuhan bahan baku Anda secara otomatis, gunakan fitur Suara Pembaca untuk mendengarkan resep di dapur, dan kalkulator HPP untuk menghitung profit usaha!",
        type: "success"
      }
    }
  },
  {
    pageNumber: 4,
    title: "Mengenal Potensi Apel Anna Desa Sumbergondo",
    chapterTitle: "BAB I: POTENSI & PENGOLAHAN APEL",
    type: "article",
    content: {
      heading: "Inovasi Pascapanen & Optimalisasi Apel Anna Zero Waste",
      paragraphs: [
        "Desa Sumbergondo di Kecamatan Bumiaji, Kota Batu, memiliki peran strategis sebagai salah satu sentra penghasil apel varietas Anna yang menjadi komoditas unggulan dan ikon daerah. Apel Anna dikenal luas dengan ciri khas bentuknya yang sedikit memanjang serta kulit buah berwarna merah merona dipadu nuansa kekuningan atau hijau saat matang. Daging buahnya berwarna kekuningan, bertekstur relatif renyah namun lembut (masir), mengandung cukup banyak air, serta menawarkan aroma yang harum dan perpaduan rasa segar manis-asam yang khas. Meski potensinya sangat besar, keberadaan perkebunan apel Anna kini menghadapi tantangan serius seperti alih fungsi lahan dan penurunan kualitas tanah sehingga diperlukan langkah strategis untuk menjaga keberlanjutannya.",
        "Salah satu bentuk optimalisasi potensi apel Anna adalah melalui penerapan inovasi pengolahan pascapanen berbasis prinsip zero waste. Karakter rasa dan kandungan airnya membuat daging buah apel Anna dari berbagai tingkat kualitas (grade) sangat cocok diolah menjadi selai apel yang tahan lama, beraroma kuat, dan bernilai jual tinggi untuk industri bakery maupun pastry. Tidak hanya daging buahnya, limbah kulit apel yang berwarna merah menawan hasil dari pengolahan selai juga dapat dimanfaatkan kembali menjadi pupuk organik cair (POC) untuk mendukung kesuburan tanah perkebunan warga. Pendekatan terpadu ini tidak hanya membuka peluang usaha baru bagi kelompok masyarakat seperti ibu-ibu Dasawisma, tetapi juga memberikan nilai tambah (added value) serta mendukung ketahanan ekonomi keluarga petani secara berkelanjutan."
      ],
      calloutBox: {
        title: "Pencegahan Oksidasi Apel",
        text: "Kunci utama apel tidak berubah warna cokelat keruh saat dikupas: Segera rendam potongan apel dalam air garam (1 liter air + 1 sdm garam) & beri perasan lemon!",
        type: "warning"
      }
    }
  },
  {
    pageNumber: 5,
    title: "Resep Inti: Selai Apel Anna khas Sumbergondo",
    chapterTitle: "BAB II: RESEP DASAR SELAI APEL",
    type: "recipe",
    content: {
      heading: "Selai Apel Anna Khas Sumbergondo",
      recipeId: "selai-apel-dasar"
    }
  },
  {
    pageNumber: 6,
    title: "Nastar Apel Batu",
    chapterTitle: "BAB III: ANEKA OLAHAN JAJANAN",
    type: "recipe",
    content: {
      heading: "Inovasi Kue Kering Khas Kota Batu",
      recipeId: "nastar-selai-apel"
    }
  },
  {
    pageNumber: 7,
    title: "Pie Apel Mini Strudel",
    chapterTitle: "BAB III: ANEKA OLAHAN JAJANAN",
    type: "recipe",
    content: {
      heading: "Pastry Tartlet Renyah Isi Selai Apel",
      recipeId: "pie-apel-mini"
    }
  },
  {
    pageNumber: 8,
    title: "Minuman Refreshing Apple Jam Tea",
    chapterTitle: "BAB III: ANEKA OLAHAN JAJANAN",
    type: "recipe",
    content: {
      heading: "Minuman Segar & Menu Kafe Kekinian",
      recipeId: "minuman-sparkling-apple-tea"
    }
  },
  {
    pageNumber: 9,
    title: "Panduan Pengemasan & Kelayakan Usaha UMKM",
    chapterTitle: "BAB IV: PACKAGING & HPP UMKM",
    type: "business",
    content: {
      heading: "Standar Kemasan, Rekomendasi Wadah & Perhitungan Profit",
      paragraphs: [
        "Kemasan (packaging) yang menarik dan higienis merupakan kunci meningkatkan harga jual produk di pasaran dari skala rumahan menuju oleh-oleh kelas premium.",
        "Rekomendasi Wadah Pengemasan Selai: 1) Jar Kaca (Glass Jar) Tutup Lug Cap Logam (Sangat direkomendasikan untuk daya simpan 6-12 bulan & tahan proses hot-filling 85°C-90°C), 2) Standing Pouch with Spout (Praktis, ringan, anti-pecah, & ekonomis untuk kiriman online), 3) Jar Plastik PET Food Grade (Ringan & ekonomis untuk penjualan lokal langsung).",
        "Komponen Label Produk yang Wajib Ada: 1) Nama Merk & Varian, 2) Berat Bersih (Netto), 3) Komposisi Bahan, 4) Tanggal Kadaluarsa (Best Before), 5) Kontak Produsen & Alamat Desa Sumbergondo."
      ],
      tableData: {
        headers: ["Komponen Biaya", "Selai Apel (per Jar)", "Nastar Apel (per Toples)"],
        rows: [
          ["Bahan Baku Utama", "Rp 5.000", "Rp 14.000"],
          ["Bahan Pelengkap", "Rp 2.000", "Rp 6.000"],
          ["Kemasan Botol/Toples & Label", "Rp 4.000", "Rp 5.000"],
          ["Gas/Listrik/Overhead", "Rp 1.000", "Rp 3.000"],
          ["Total HPP (Modal)", "Rp 12.000", "Rp 28.000"],
          ["Harga Jual yang Disarankan", "Rp 20.000 - Rp 25.000", "Rp 50.000 - Rp 60.000"],
          ["Keuntungan Bersih / Unit", "Rp 8.000 - Rp 13.000 (60%)", "Rp 22.000 - Rp 32.000 (55%)"]
        ]
      }
    }
  },
  {
    pageNumber: 10,
    title: "Penutup & Lembar Profil Tim Pengabdi",
    chapterTitle: "BAB V: PROFIL TIM & PENUTUP",
    type: "team",
    content: {
      heading: "Tim Proyek Kepemimpinan & Pengabdian Masyarakat",
      paragraphs: [
        "Program kegiatan dilaksanakan secara berkelanjutan meliputi Inisiasi Observasi, Eksperimentasi Formulasi Selai, Pelatihan Praktik & Pendampingan Kemasan Masyarakat Desa Sumbergondo.",
        "Terima kasih kepada Dosen Pendamping Dr. Anis Farida Jamil, M.Pd., Pemerintah Desa Sumbergondo, Ketua Kelompok Tani, dan seluruh peserta pelatihan atas kolaborasi hebat ini."
      ],
      bulletPoints: [
        "Ketua Pelaksana: Camelia Nur Laili",
        "Dosen Pendamping: Dr. Anis Farida Jamil, M.Pd.",
        "Program Studi: Pendidikan Guru Sekolah Dasar (PGSD)",
        "Institusi: Universitas Muhammadiyah Malang",
        "Lokasi Pengabdian: Desa Sumbergondo, Bumiaji, Kota Batu"
      ]
    }
  }
];

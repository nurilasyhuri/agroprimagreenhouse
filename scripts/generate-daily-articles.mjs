import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const artikelDir = path.join(projectRoot, 'src', 'content', 'artikel');

function getIndonesianDate(date = new Date()) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const wibDate = new Date(utc + (3600000 * 7));
  const day = wibDate.getDate();
  const month = months[wibDate.getMonth()];
  const year = wibDate.getFullYear();
  return `${day} ${month} ${year}`;
}

const NATIONWIDE_TABLE = `## Tabel Jangkauan Layanan Fabrikasi & Instalasi Greenhouse Se-Indonesia

Agro Prima Greenhouse melayani survei kelayakan kontur lahan, desain 3D arsitektur pertanian, fabrikasi rangka baja/galvanis, hingga instalasi iklim mikro otomatis ke seluruh Indonesia:

| Koridor Wilayah | Sentra Pertanian & Agrowisata | Spesialisasi Konstruksi Proyek | Moda Mobilisasi & Logistik | Estimasi Waktu | Status Layanan |
|---|---|---|---|---|:---:|
| **Jawa Timur Hub** | Malang, Batu, Kediri, Blitar, Banyuwangi, Jember | Multi-Span Galvanis, Smart Greenhouse Melon | Armada Truk Wingbox & Teknisi Mandiri | 1 – 2 Hari Kerja | Siap Survei & Bangun |
| **Jawa Tengah & DIY** | Dieng, Magelang, Temanggung, Boyolali, Sleman | Tunnel Sayuran, Green House Baja Ringan | Truk Engkel & Pick-up Material | 1 – 2 Hari Kerja | Siap Survei & Bangun |
| **Jawa Barat & Banten** | Lembang, Pangalengan, Garut, Cianjur, Bogor | Kaca Tempered Agrowisata, Hidroponik NFT | Truk Fuso Ekspedisi Proyek | 1 – 2 Hari Kerja | Siap Survei & Bangun |
| **Sumatera Hub** | Berastagi Karo, Simalungun, Bukittinggi, Kerinci | Multi-Span Anti-Angin Gunung, Solar Dryer | Truk Tronton Lintas Sumatera | 3 – 5 Hari Kerja | Siap Survei & Bangun |
| **Bali & Nusa Tenggara** | Bedugul, Tabanan, Lombok Sembalun, Bima | Agrowisata Estetis, Tunnel Garam Kristal | Jalur Darat & Feri Penyeberangan | 2 – 4 Hari Kerja | Siap Survei & Bangun |
| **Kalimantan & IKN** | Paser IKN, Kukar, Balikpapan, Pontianak | Smart Farming Otomasi, Tunnel Sayur Gambut | Kargo Peti Kemas Laut Tanjung Perak | 4 – 7 Hari Kerja | Siap Survei & Bangun |
| **Sulawesi & Maluku** | Malino Gowa, Enrekang, Tomohon, Jeneponto | Greenhouse Sayuran Dingin, Tunnel Garam PE | Kapal Ro-Ro & Kontainer Pelni | 5 – 9 Hari Kerja | Siap Survei & Bangun |
| **Papua Raya** | Keerom, Jayapura, Merauke Food Estate | Greenhouse Komersial Skala Ketahanan Pangan | Kargo Laut Tol Laut & Pesawat Kargo | 8 – 14 Hari Kerja | Siap Survei & Bangun |`;

const GREENHOUSE_HUBS = [
  { name: 'Malang & Batu', region: 'Batu, Pujon, Bumiaji & Karangploso', province: 'Jawa Timur', elevation: '700 – 1.400 mdpl (Hawa sejuk)', weather: 'kelembapan tinggi 85%, intensitas kabut tebal, dan terpaan angin lereng gunung', crops: 'melon hidroponik premium, paprika, sayuran salad, dan agrowisata petik stroberi' },
  { name: 'Lembang & Bandung Barat', region: 'Parongpong, Cisarua, Maribaya & Lembang', province: 'Jawa Barat', elevation: '1.100 – 1.500 mdpl (Hawa sejuk dingin)', weather: 'fluktuasi suhu harian tajam, curah hujan tinggi, dan angin lembah kencang', crops: 'paprika hidroponik ekspor, bunga krisan potong, tomat ceri, dan brokoli' },
  { name: 'Pangalengan & Garut', region: 'Cikajang, Cisurupan, Pasirwangi & Malabar', province: 'Jawa Barat', elevation: '1.000 – 1.600 mdpl (Pegunungan vulkanik)', weather: 'suhu malam hari drop 14°C dan radiasi ultraviolet siang hari tinggi', crops: 'benih kentang bebas virus (G0/G1), sayuran daun premium, dan stroberi' },
  { name: 'Cianjur & Sukabumi', region: 'Cipanas, Pacet, Cisaat & Sukalarang', province: 'Jawa Barat', elevation: '600 – 1.200 mdpl (Kaki Gunung Gede)', weather: 'curah hujan lebat hampir sepanjang tahun dan kelembapan jenuh memicu jamur', crops: 'sayuran hidroponik instalasi NFT komersial dan melon golden aroma sultan' },
  { name: 'Bogor & Puncak', region: 'Cisarua, Megamendung, Megamendung & Tajur', province: 'Jawa Barat', elevation: '450 – 1.100 mdpl (Penyangga ibu kota)', weather: 'frekuensi petir dan hujan deras ekstrem serta minat wisata akhir pekan tinggi', crops: 'agrowisata botani keluarga, tanaman hias eksotis anthurium/aroid, dan buah tin' },
  { name: 'Magelang & Temanggung', region: 'Sawangan, Ngablak, Kledung & Parakan', province: 'Jawa Tengah', elevation: '650 – 1.300 mdpl (Lembah Merapi-Sumbing)', weather: 'angin kencang celah dua gunung dan paparan abu vulkanik periodik', crops: 'cabai rawit ori, tomat apel, tembakau pembibitan, dan sayur pakcoy' },
  { name: 'Boyolali & Karanganyar', region: 'Selo, Cepogo, Tawangmangu & Ngargoyoso', province: 'Jawa Tengah', elevation: '800 – 1.400 mdpl (Lereng Gunung Lawu-Merbabu)', weather: 'angin kencang pegunungan dan kabut basah sore hari', crops: 'sayuran organik bersertifikat, stroberi dataran tinggi, dan melon hidroponik' },
  { name: 'Wonosobo & Dieng', region: 'Kejajar, Garung, Batur & Dieng Plateau', province: 'Jawa Tengah', elevation: '1.200 – 2.100 mdpl (Dataran tinggi es)', weather: 'risiko fenomena embun upas (frost), suhu beku 0°C, dan kelembapan ekstrem', crops: 'buah carica, kentang granola bibit murni, terong belanda, dan kubis' },
  { name: 'Kediri & Blitar', region: 'Pare, Kepung, Nglegok & Gandusari', province: 'Jawa Timur', elevation: '150 – 450 mdpl (Dataran rendah-sedang)', weather: 'suhu siang terik 34°C menuntut rekayasa ventilasi monitor roof dan exhaust', crops: 'melon hidroponik sistem dutch bucket, semangka berbiji, dan cabai rawit merah' },
  { name: 'Banyuwangi & Jember', region: 'Songgon, Glenmore, Sukorambi & Rembukan', province: 'Jawa Timur', elevation: '200 – 800 mdpl (Lereng Raung-Ijen)', weather: 'angin kencang timur dan radiasi matahari melimpah sepanjang tahun', crops: 'buah naga merah greenhouse, melon cantaloupe, dan bibit tanaman perkebunan' },
  { name: 'Bedugul & Tabanan', region: 'Baturiti, Candi Kuning, Candikuning & Penebel', province: 'Bali', elevation: '900 – 1.300 mdpl (Dataran danau dingin)', weather: 'kabut basah konstan, kelembapan 90%, dan standar arsitektur lansekap bernilai seni', crops: 'sayuran salad microgreens hotel bintang 5, stroberi jepang, dan bunga edelweiss' },
  { name: 'Sembalun Lombok Timur', region: 'Sembalun Bumbung, Lawang & Aikmel', province: 'Nusa Tenggara Barat', elevation: '1.000 – 1.250 mdpl (Kaldera Rinjani)', weather: 'angin kencang kaldera, radiasi surya bersih tanpa polusi, dan udara kering', crops: 'bawang putih sembalun, stroberi petik sendiri, wortel, dan tomat ceri manis' },
  { name: 'Bima & Dompu', region: 'Bolo, Woha, Huu & Manggelewa', province: 'Nusa Tenggara Barat', elevation: '0 – 150 mdpl (Pesisir terik tropis)', weather: 'radiasi panas ekstrem 36°C, penguapan tinggi, dan angin laut konstan', crops: 'tunnel kristalisasi garam geomembran HDPE dan pengeringan jagung surya' },
  { name: 'Berastagi & Karo', region: 'Simpang Empat, Kabanjahe & Tigapanah', province: 'Sumatera Utara', elevation: '1.200 – 1.450 mdpl (Gunung Sinabung)', weather: 'hawa dingin basah, potensi hujan asam erupsi, dan angin lereng pegunungan', crops: 'jeruk karo, kubis ekspor, tomat buah, kentang, dan paprika merah' },
  { name: 'Simalungun & Dairi', region: 'Saribudolok, Purba, Sidikalang & Sumbul', province: 'Sumatera Utara', elevation: '900 – 1.400 mdpl (Tepi Danau Toba)', weather: 'udara sejuk lembap dan angin danau kencang berhembus sore hari', crops: 'kopi arabika greenhouse solar dome, sayuran kubis, cabai, dan jeruk manis' },
  { name: 'Agam & Bukittinggi', region: 'Baso, Ampek Angkek, Tilatang Kamang & Matur', province: 'Sumatera Barat', elevation: '900 – 1.250 mdpl (Ngarai Sianok & Marapi)', weather: 'hawa sejuk berkabut, curah hujan tinggi, dan radiasi cukup', crops: 'cabai keriting padang, sayuran daun hijau, alpukat miki, dan stroberi' },
  { name: 'Kerinci', region: 'Kayu Aro, Gunung Tujuh & Siulak', province: 'Jambi', elevation: '1.300 – 1.700 mdpl (Kaki Gunung Kerinci)', weather: 'suhu dingin konstan, kelembapan tinggi, dan tanah vulkanik subur', crops: 'kentang kualitas ekspor, kubis, tomat apel, cabai merah, dan teh hijau' },
  { name: 'Pagar Alam', region: 'Dempo Utara, Dempo Selatan & Gunung Dempo', province: 'Sumatera Selatan', elevation: '900 – 1.400 mdpl (Kaki Gunung Dempo)', weather: 'hawa sejuk pegunungan, curah hujan lebat, dan potensi wisata alam', crops: 'sayuran dataran tinggi, pengeringan kopi specialty solar dome, dan tomat ceri' },
  { name: 'Lampung & Pesawaran', region: 'Gisting, Sumberjaya, Natar & Kalianda', province: 'Lampung', elevation: '100 – 900 mdpl (Dataran rendah hingga perbukitan)', weather: 'panas siang hari menuntut ventilasi udara optimal dan tirai peneduh', crops: 'melon hidroponik, bibit pisang cavendish kultur jaringan, dan sayur hidroponik' },
  { name: 'Kutai Kartanegara (IKN Hub)', region: 'Samboja, Sepaku, Loa Kulu & Tenggarong', province: 'Kalimantan Timur', elevation: '50 – 250 mdpl (Kawasan Ibu Kota Nusantara)', weather: 'curah hujan tropis ekuator tidak menentu dan paparan sinar terik siang', crops: 'sayuran segar hidroponik bebas residu pestisida untuk suplai kementerian IKN' },
  { name: 'Balikpapan & Samarinda', region: 'Kariangau, Teritip, Palaran & Sungai Kunjang', province: 'Kalimantan Timur', elevation: '20 – 100 mdpl (Pesisir & Sungai Mahakam)', weather: 'udara pesisir panas dan tanah lempung masam menuntut budidaya soilless', crops: 'selada hidroponik komersial hotel/restoran, kailan, dan melon golden' },
  { name: 'Banjarbaru & Tanah Laut', region: 'Cempaka, Landasan Ulin, Pelaihari & Bati-Bati', province: 'Kalimantan Selatan', elevation: '30 – 150 mdpl (Dataran rendah tropis)', weather: 'musim kemarau terik menyengat dan musim hujan intensitas lebat', crops: 'tanaman hortikultura semusim, persemaian bibit kelapa sawit, dan melon' },
  { name: 'Pontianak & Kubu Raya', region: 'Siantan, Sungai Kakap, Rasau Jaya & Sei Raya', province: 'Kalimantan Barat', elevation: '0 – 20 mdpl (Garis khatulistiwa tepat)', weather: 'panas terik ekuator 35°C dan tanah gambut masam', crops: 'sayuran daun hidroponik rak susun, lidah buaya, dan melon greenhouse' },
  { name: 'Jeneponto & Takalar', region: 'Bangkala, Binamu, Mangarabombang & Sanrobone', province: 'Sulawesi Selatan', elevation: '0 – 80 mdpl (Pesisir selatan Sulawesi)', weather: 'daerah terkering di Sulsel dengan radiasi surya tertinggi sepanjang tahun', crops: 'tunnel garam industri sistem Prisma kristalisasi cepat beryodium tinggi' },
  { name: 'Malino & Enrekang', region: 'Tinggimoncong, Baraka, Anggeraja & Buntu Batu', province: 'Sulawesi Selatan', elevation: '900 – 1.400 mdpl (Pegunungan Bawakaraeng-Latimojong)', weather: 'suhu dingin sejuk, angin lembah kuat, dan lereng terjal berbukit', crops: 'bawang merah bibit biji (TSS), cabai katokon, kubis, wortel, dan stroberi' },
  { name: 'Tomohon & Minahasa', region: 'Tomohon Barat, Kakas, Langowan & Sonder', province: 'Sulawesi Utara', elevation: '750 – 1.100 mdpl (Dataran tinggi Lokon-Mahawu)', weather: 'hawa dingin sejuk dan potensi agrowisata bunga terbesar di timur Indonesia', crops: 'greenhouse bunga krisan potong, anggrek phalaenopsis, dan sayuran salad' },
  { name: 'Kupang & Belu', region: 'Kupang Timur, Atambua, Tasifeto & Malaka', province: 'Nusa Tenggara Timur', elevation: '50 – 400 mdpl (Sabana semi-arid)', weather: 'iklim kering musim kemarau panjang 8 bulan dan kelangkaan air tanah', crops: 'greenhouse fertigasi tetes tertutup hemat air, tomat buah, dan melon' },
  { name: 'Keerom & Jayapura', region: 'Arso, Skouw, Sentani & Koya Barat', province: 'Papua', elevation: '30 – 200 mdpl (Lembah perbatasan timur)', weather: 'hujan tropis hutan lebat dan serangan hama kutu kebul/lalat buah tinggi', crops: 'sayuran hidroponik modern, cabai rawit papua, semangka, dan tomat ceri' },
  { name: 'Merauke', region: 'Kurik, Tanah Miring & Semangga', province: 'Papua Selatan', elevation: '0 – 30 mdpl (Dataran rawa terhampar luas)', weather: 'angin muson tenggara kencang tanpa penghalang bukit dan paparan surya tinggi', crops: 'fasilitas persemaian modern food estate padi, hortikultura, dan buah semangka' },
  { name: 'Pekalongan & Batang', region: 'Kandeman, Gringsing, Kedungwuni & Doro', province: 'Jawa Tengah', elevation: '50 – 600 mdpl (Pantura & Lereng Dieng Utara)', weather: 'koridor kawasan industri berkembang dan perbukitan buah tropis', crops: 'melon hidroponik komersial, agrowisata petik buah, dan bibit tanaman langka' }
];

const GREENHOUSE_ARCHETYPES = [
  {
    slugSuffix: 'kontraktor-greenhouse-pipa-galvanis-multi-span-melon',
    serviceTitle: 'Jasa Kontraktor Greenhouse Pipa Galvanis Multi-Span Melon Hidroponik',
    seoKeyword: 'greenhouse pipa galvanis multi-span',
    category: 'perlengkapan-greenhouse',
    tags: ['greenhouse pipa galvanis', 'greenhouse multi-span', 'greenhouse melon hidroponik', 'konstruksi greenhouse komersial', 'talang air hujan greenhouse'],
    heroImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    coreNeed: 'konstruksi greenhouse skala industri berbentang lebar (*multi-span*) dengan sistem talang air hujan (*gutter*) anti-bocor dan ketahanan struktur puluhan tahun terhadap terpaan angin badai',
    structDetail: 'Rangka utama menggunakan pipa galvanis hot-dip medium B anti-karat diameter 2 inch untuk tiang kolom, 1.5 inch untuk lengkungan arch, dan 1.25 inch untuk tie-beam pengikat ganda.',
    sopMandor: [
      '**Pondasi Cor Beton Setempat Wajib Menggunakan Angkur Tulangan:** Jangan menancapkan pipa tiang greenhouse langsung ke tanah mentah. Buat lubang pondasi tapak sedalam 80–100 cm, pasang angkur besi ulir diameter 16 mm yang dilas ke pelat tapak base-plate, lalu cor monolitik mutu beton minimal K-225.',
      '**Kemiringan Talang Air Hujan Gutter Minimal 0.5% Menuju Drainase:** Pada greenhouse multi-span, akumulasi air hujan pada lembah pertemuan atap sangat besar. Talang tekuk plat galvanis tebal 1.2 mm wajib diatur kemiringannya agar debit air hujan deras langsung mengalir ke pipa buang vertikal tanpa meluber ke dalam tanaman.'
    ],
    tableHeaders: ['Komponen Struktur Greenhouse', 'Dimensi & Standar Material', 'Fungsi Ketahanan Struktur'],
    tableRows: [
      ['Tiang Kolom Utama (Pillar)', 'Pipa Galvanis Hot-Dip 2 Inch Tebal 2.0 mm', 'Menopang beban mati struktur dan dorongan angin kencang'],
      ['Kuda-Kuda Lengkung (Arch)', 'Pipa Galvanis 1.5 Inch Tebal 1.8 mm Roll Presisi', 'Membentuk kubah aerodinamis pelindung lembaran plastik'],
      ['Penutup Atap (Roof Cladding)', 'Plastik UV 14% Tebal 200 Micron Anti-Droplet', 'Transmisi cahaya fotosintesis optimal tahan 3–5 tahun'],
      ['Dinding Keliling (Sidewall)', 'Insect Net Kerapatan 50 Mesh Anyaman Monofilamen', 'Ventilasi udara silang pencegah serangga hama thrips'],
      ['Sistem Pengunci Plastik', 'Profil Lock C-Channel Galvanis + Spring Clip PE', 'Mengunci kencang lembaran plastik tanpa paku/baut bocor']
    ]
  },
  {
    slugSuffix: 'pembuatan-greenhouse-baja-ringan-sayuran-daun-hidroponik',
    serviceTitle: 'Pembuatan Greenhouse Baja Ringan Efisien Sayuran Hidroponik NFT',
    seoKeyword: 'greenhouse baja ringan hidroponik',
    category: 'perlengkapan-greenhouse',
    tags: ['greenhouse baja ringan', 'hidroponik nft sayuran', 'greenhouse selada', 'baja ringan kanal c', 'instalasi hidroponik komersial'],
    heroImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=1200&q=80',
    coreNeed: 'greenhouse produksi sayuran daun (selada, pakcoy, kailan, mint) berbiaya investasi terjangkau (*low capital expenditure*) namun tetap kokoh, presisi, dan higienis untuk pasar supermarket',
    structDetail: 'Rangka mengadopsi profil baja ringan Zincalume Kanal C-75 tebal 0.75 mm SNI yang dirakit ganda (double-truss) pada bentang bentukan segitiga atap monitor roof ventilasi tinggi.',
    sopMandor: [
      '**Gunakan Baut Roofing Kualitas Hex-Head Ber-Seal Karet EPDM:** Pastikan setiap sambungan baut baja ringan dilengkapi ring karet kedap air untuk mencegah rembesan air hujan yang dapat menimbulkan karat dini pada drat sekrup.',
      '**Proteksi Kaki Baja Ringan dari Kelembapan Tanah:** Bagian bawah kaki kanal C baja ringan tidak boleh bersentuhan langsung dengan tanah becek atau larutan nutrisi asam. Buat umpak cor beton setinggi 30 cm di atas permukaan tanah sebagai dudukan kolom.'
    ],
    tableHeaders: ['Elemen Rangka Baja Ringan', 'Spesifikasi Rekomendasi SNI', 'Keunggulan Lapangan'],
    tableRows: [
      ['Rangka Tiang & Kuda-Kuda', 'Kanal C-75 Tebal 0.75 mm Zincalume AZ-100', 'Ringan, anti-rayap, dan waktu perakitan sangat cepat'],
      ['Reng Dudukan Profil Lock', 'Reng Asimetris Tebal 0.45 mm', 'Dudukan kokoh penjepit plastik UV atap dan kasa dinding'],
      ['Desain Atap Ventilasi', 'Tipe Monitor Roof (Bukaan Atap 60 – 80 cm)', 'Membuang akumulasi udara panas terperangkap di plafon'],
      ['Meja Instalasi Tanam', 'Rangka Meja Baja Ringan Sloping Kemiringan 3%', 'Menopang talang trapesium guli NFT secara stabil']
    ]
  },
  {
    slugSuffix: 'greenhouse-kaca-tempered-polikarbonat-agrowisata-botani',
    serviceTitle: 'Pembangunan Greenhouse Kaca Tempered & Polikarbonat Agrowisata Botani',
    seoKeyword: 'greenhouse kaca tempered agrowisata',
    category: 'perlengkapan-greenhouse',
    tags: ['greenhouse kaca', 'greenhouse polikarbonat', 'greenhouse agrowisata', 'arsitektur agribisnis', 'cafe botani greenhouse'],
    heroImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    coreNeed: 'bangunan greenhouse arsitektural bernilai estetika premium untuk wahana petik buah, restoran kaca bertema botani, showroom anggrek/tanaman hias mewah, serta laboratorium kultur jaringan',
    structDetail: 'Kombinasi rangka baja hollow galvanis tebal 2.0 mm / H-beam dengan penutup kaca tempered 5–6 mm atau lembaran multi-wall polycarbonate 8–10 mm berproteksi anti-UV ganda.',
    sopMandor: [
      '**Wajib Gasket Karet EPDM Vulkanisir Bukan Silikon Botolan Murah:** Untuk penutup kaca dan polikarbonat, gunakan profil karet EPDM tahan cuaca ekstrem. Silikon tabung murah akan retak rambut dan getas dalam 1–2 tahun terkena panas matahari tropis.',
      '**Sediakan Celah Ekspansi Termal Polikarbonat:** Lembaran polikarbonat mengalami pemuaian dan penyusutan akibat perubahan temperatur siang dan malam. Sediakan celah ekspansi minimal 3–5 mm pada profil aluminium penjepit agar lembaran tidak melengkung bergelombang saat siang hari.'
    ],
    tableHeaders: ['Parameter Perbandingan', 'Kaca Tempered (5–6 mm)', 'Polikarbonat Multi-Wall (8–10 mm)'],
    tableRows: [
      ['Transmisi Cahaya Masuk', '89% – 91% (Sangat jernih transparan kristal)', '75% – 82% (Cahaya baur / diffused lembut)'],
      ['Beban Struktur per m²', '12.5 – 15.0 kg/m² (Butuh struktur baja berat)', '1.4 – 1.8 kg/m² (Rangka lebih hemat & ringan)'],
      ['Isolasi Termal (Panas Ruang)', 'Kurang meredam panas tanpa peneduh', 'Sangat baik menahan panas ruang tanam'],
      ['Ketahanan Terhadap Benturan', 'Tahan benturan sedang; pecah butiran aman', 'Sangat kuat anti-pecah tahan lemparan batu'],
      ['Umur Pakai Bangunan', '20 – 30+ Tahun tanpa buram', '10 – 15 Tahun terlindung lapisan anti-UV']
    ]
  },
  {
    slugSuffix: 'instalasi-exhaust-fan-cooling-pad-celdek-greenhouse-tropis',
    serviceTitle: 'Instalasi Sistem Exhaust Fan 50 Inch & Cooling Pad CelDek Iklim Mikro',
    seoKeyword: 'exhaust fan cooling pad greenhouse',
    category: 'perlengkapan-greenhouse',
    tags: ['exhaust fan greenhouse 50 inch', 'cooling pad celdek', 'evaporative cooling pad', 'iklim mikro greenhouse', 'smart climate greenhouse'],
    heroImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    coreNeed: 'penurunan temperatur ruang tanam secara aktif hingga 6°C–8°C di bawah suhu luar lingkungan dataran rendah tropis untuk mencegah keguguran bunga dan heat-stress pada tanaman bernilai ekonomi tinggi',
    structDetail: 'Pemasangan dinding evaporative cooling pad kertas selulosa CelDek tebal 100–150 mm pada sisi inlet angin dan fan exhaust berbilah stainless steel 50 inch sistem shutter gravitasi pada sisi outlet seberang.',
    sopMandor: [
      '**Kerapatan Bangunan Greenhouse Wajib 100% Hermetik:** Sistem pendinginan evaporatif hanya bekerja jika udara luar dipaksa masuk HANYA melalui bantalan cooling pad basah. Seluruh celah dinding insect net atau jendela yang bocor di sisi samping harus ditutup rapat saat fan beroperasi.',
      '**Gunakan Air Pendingin Berkadar Mineral Rendah (TDS Rendah):** Air sadah dengan kandungan kalsium tinggi akan mengkristalkan kerak putih kapur pada kisi-kisi kertas CelDek, menyumbat aliran udara dalam 6 bulan. Pasang filter air dan ganti air bak sirkulasi setiap minggu.'
    ],
    tableHeaders: ['Komponen Iklim Mikro', 'Spesifikasi Teknis Alat', 'Performa Operasional'],
    tableRows: [
      ['Exhaust Fan Blower Utama', 'Diameter 50 Inch, Motor 1.1 kW 3-Phase 380V', 'Debit hisap udara 44.000 m³/jam per unit'],
      ['Daun Kipas (Fan Blade)', 'Stainless Steel 430 Tebal 1.2 mm Anti-Karat', 'Tahan kelembapan tinggi dan kabut basah'],
      ['Bantalan Basah (Cooling Pad)', 'Bahan Selulosa CelDek Brown Tebal 150 mm', 'Efisiensi penguapan pendinginan > 85%'],
      ['Sistem Shutter Otomatis', 'Louvre Plat Galvanis Sistem Centrifugal Push-Pull', 'Menutup rapat otomatis saat kipas padam'],
      ['Kontroler Otomasi Suhu', 'Panel Digital Thermostat + Humidistat Otomatis', 'Menyalakan pompa dan fan saat suhu > 28°C']
    ]
  },
  {
    slugSuffix: 'konstruksi-tunnel-garam-geomembran-solar-dryer-dome',
    serviceTitle: 'Konstruksi Tunnel Garam Plastik UV & Solar Dome Dryer Efisiensi Tinggi',
    seoKeyword: 'tunnel garam geomembran solar dryer',
    category: 'perlengkapan-greenhouse',
    tags: ['tunnel garam plastik uv', 'geomembran hdpe garam', 'solar dome dryer', 'pengering surya hasil tani', 'garam industri kristal'],
    heroImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    coreNeed: 'akselerasi produksi kristalisasi garam bebas pencemaran debu tanah serta pengeringan hasil panen komoditas kopi, kakao, vanili, dan cabai tanpa ketergantungan cuaca hujan',
    structDetail: 'Struktur lengkung pipa galvanis tahan korosi uap garam berkadar NaCl tinggi dengan alas terpal geomembran HDPE tebal 0.5–1.0 mm food grade dan atap plastik UV 200 micron anti-radiasi.',
    sopMandor: [
      '**Pilih Baut dan Sambungan Rangka Berlapis Anti-Karat Kualitas Maritim:** Uap air laut jenuh garam (brine water) bersifat korosif ekstrem. Sambungan wajib menggunakan mur-baut stainless steel SUS 304 atau pipa galvanis hot-dip kelas marine coating.',
      '**Pengelasan Sambungan Terpal Geomembran Wajib Uji Vakum:** Penyatuan lembaran terpal geomembran HDPE di dasar meja kristalisasi wajib menggunakan mesin pemanas otomatis double-wedge welder untuk menjamin tidak ada air asin yang bocor merembes ke tanah.'
    ],
    tableHeaders: ['Material Konstruksi Tunnel', 'Spesifikasi Rekomendasi', 'Manfaat Nyata di Lapangan'],
    tableRows: [
      ['Rangka Lengkung Tunnel', 'Pipa Galvanis Hot-Dip 1 – 1.25 Inch Tebal 1.8 mm', 'Tahan korosi air garam bertahun-tahun'],
      ['Alas Kristalisasi / Lantai', 'Geomembran HDPE Hitam Tebal 0.5 – 0.8 mm', 'Menghasilkan garam putih bersih kualitas K1'],
      ['Atap Penutup Dome', 'Plastik UV 200 Micron Transmisi Termal Tinggi', 'Menciptakan efek rumah kaca suhu 50°C–60°C'],
      ['Sirkulasi Pembuangan Uap', 'Exhaust Fan Tenaga Surya (Solar Cell Powered)', 'Membuang kelembapan uap jenuh air cepat'],
      ['Efisiensi Waktu Pengeringan', '3 Kali Lebih Cepat Dibanding Jemur Terbuka', 'Bebas kotoran burung, debu, dan hujan mendadak']
    ]
  },
  {
    slugSuffix: 'greenhouse-bambu-petung-awet-10-tahun-treatment-organik',
    serviceTitle: 'Konstruksi Greenhouse Rangka Bambu Petung Treatment Awet 10 Tahun',
    seoKeyword: 'greenhouse bambu petung awet',
    category: 'perlengkapan-greenhouse',
    tags: ['greenhouse bambu petung', 'pengawetan bambu boraks', 'greenhouse hemat biaya', 'greenhouse cabai rakyat', 'konstruksi ramah lingkungan'],
    heroImage: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80',
    coreNeed: 'solusi greenhouse produksi biaya rendah untuk kelompok tani dan perkebunan rakyat dengan memanfaatkan potensi material alami lokal yang diawetkan secara ilmiah bebas bubuk kayu',
    structDetail: 'Tiang utama menggunakan batang bambu petung (Dendrocalamus asper) tua diameter > 14 cm yang direndam formula garam boraks-asam borat sistem diffusi vertikal beratap plastik UV 200 micron.',
    sopMandor: [
      '**Gunakan Umpak Cor Pipa PVC untuk Alas Tiang Bambu:** Pantangan terbesar konstruksi bambu adalah menanam ujung bambu langsung menyentuh tanah basah. Masukkan pangkal bambu ke dalam selongsong pipa PVC cor beton setinggi 40 cm agar terisolasi dari rayap dan air tanah.',
      '**Beri Bantalan Karet Talang pada Setiap Titik Kontak Plastik:** Permukaan sambungan bambu yang memiliki mata buku atau serat tajam wajib dibalut karet ban bekas sebelum plastik UV dibentangkan agar lembaran plastik tidak tersobek saat tertiup angin kencang.'
    ],
    tableHeaders: ['Tahap Konstruksi Bambu', 'Metode Standar Rekayasa', 'Kunci Keberhasilan Awet'],
    tableRows: [
      ['Pemilihan Batang Bambu', 'Bambu Petung / Tali Umur Minimal 3–4 Tahun', 'Kadar pati rendah, penebangan saat musim kemarau'],
      ['Proses Pengawetan Kimiawi', 'Perendaman Larutan Garam Boraks 5% Selama 14 Hari', 'Mensterilkan serat dari kumbang bubuk Dinoderus minutus'],
      ['Konstruksi Sambungan Rangka', 'Baut Tembus Baja (Bukan Sekadar Tali Ijuk)', 'Kekakuan struktur kokoh menahan beban angin'],
      ['Daya Tahan Struktur Rangka', 'Masa Pakai 8 hingga 12 Tahun Terbukti di Kebun', 'Biaya investasi hanya 35% dibanding pipa galvanis']
    ]
  },
  {
    slugSuffix: 'sistem-fertigasi-tetes-dutch-bucket-greenhouse-paprika-melon',
    serviceTitle: 'Instalasi Sistem Fertigasi Tetes Dutch Bucket Paprika & Melon Golden',
    seoKeyword: 'sistem dutch bucket fertigasi tetes',
    category: 'perlengkapan-greenhouse',
    tags: ['dutch bucket hidroponik', 'fertigasi tetes paprika', 'hidroponik melon golden', 'drip emitter kompensasi tekanan', 'media hidroton cocopeat'],
    heroImage: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=1200&q=80',
    coreNeed: 'pemberian nutrisi air dan hara mikro tanaman secara presisi per individu tanaman tanpa pemborosan pupuk serta mencegah penularan penyakit busuk akar phytophthora antar tanaman',
    structDetail: 'Rangkaian ember tanam Dutch Bucket polipropilena food grade dengan pipa siphon drain pelindung akar, dripper stick pressure-compensating 2–4 LPH, dan tandon nutrisi terisolasi panas.',
    sopMandor: [
      '**Pilih Dripper Tipe Pressure Compensating (PC Dripper):** Di dalam greenhouse panjang > 30 meter, gunakan dripper bertipe PC agar debit tetesan air di ember pertama sama persis dengan ember paling ujung di barisan bedengan.',
      '**Lakukan Kalibrasi Debit Tetes Setiap Awal Tanam:** Masukkan jarum suntik dripper stick ke dalam gelas ukur selama 10 menit saat pompa menyala. Debit antar tanaman tidak boleh memiliki deviasi lebih dari 5% untuk menjamin keseragaman ukuran buah saat panen.'
    ],
    tableHeaders: ['Komponen Dutch Bucket', 'Spesifikasi Standar Teknis', 'Manfaat untuk Tanaman'],
    tableRows: [
      ['Ember Tanam (Bucket Unit)', 'Plastik PP Tebal 2.0 mm Kapasitas 12 Liter UV-Protected', 'Akar leluasa berkembang tanpa tercekik panas'],
      ['Pipa Pembuangan (Siphon)', 'Pipa Elbow Drain 1 Inch dengan Filter Kisi', 'Menyisakan cadangan nutrisi 2 cm di dasar ember'],
      ['Media Tanam Bebas Tanah', 'Campuran Hidroton Tanah Liat Bakar & Cocopeat Cuci', 'Porositas oksigen tinggi dan aerasi akar sempurna'],
      ['Jarum Suntik Nutrisi (Stick)', 'Dripper Stick Panah Sudut 45° Anti-Lumut', 'Nutrisi menetes terarah tepat di leher perakaran'],
      ['Hasil Kualitas Buah Panen', 'Keseragaman Bobot Buah 1.5 – 2.5 kg Brix > 13%', 'Produksi bersih higienis standar supermarket']
    ]
  }
];

function generateProceduralArticle(hub, archetype) {
  const slug = `${archetype.slugSuffix}-${hub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const title = `${archetype.serviceTitle} di ${hub.name}: Desain Kokoh & Efisiensi Panen Maksimal`;
  const description = `Jasa ${archetype.seoKeyword} profesional di ${hub.name}, ${hub.province} (${hub.elevation}). Spesialis budidaya ${hub.crops} dengan rangka presisi tahan angin dan garansi struktur.`;

  const intro = `Sektor hortikultura modern di wilayah **${hub.name}, ${hub.province}**—khususnya pada kawasan agribisnis **${hub.region}**—menghadapi dinamika iklim berupa **${hub.weather}**. Dengan elevasi geografis **${hub.elevation}**, petani dan investor kebun di kawasan ini fokus mengembangkan komoditas bernilai ekonomi tinggi seperti **${hub.crops}**.

Kegagalan konstruksi greenhouse akibat tiupan angin kencang lereng gunung, karat dini pada rangka, maupun salah perhitungan ventilasi udara atap sering kali menyebabkan kerugian investasi yang sangat besar. **Agro Prima Greenhouse** hadir sebagai kontraktor greenhouse berpengalaman yang melayani perancangan rekayasa, fabrikasi modul rangka, hingga serah terima kunci untuk proyek **${archetype.serviceTitle.toLowerCase()}** di wilayah **${hub.name}**.`;

  const section1 = `Pembangunan greenhouse di wilayah **${hub.name}** wajib dirancang adaptif terhadap kondisi **${hub.weather}**. Untuk menopang budidaya **${hub.crops}**, struktur bangunan tidak boleh sekadar berfungsi sebagai pelindung hujan, melainkan harus mampu merekayasa iklim mikro internal yang optimal bagi fotosintesis tanaman.

Dalam mengatasi ${archetype.coreNeed}, kami menerapkan standar rekayasa material tingkat tinggi. ${archetype.structDetail} Seluruh modul rangka dikerjakan secara presisi melalui sistem perakitan baut (*knock-down bolt system*) tanpa las lapangan yang merusak lapisan galvanis, sehingga ketahanan struktur terhadap karat terjamin hingga lebih dari 10–15 tahun di kawasan ${hub.name}.`;

  const mandorNotesStr = archetype.sopMandor.map((note, idx) => `> ${idx + 1}. ${note}`).join('\n>\n');
  const tableHeaderStr = `| ${archetype.tableHeaders.join(' | ')} |\n| ${archetype.tableHeaders.map(() => '---').join(' | ')} |`;
  const tableRowsStr = archetype.tableRows.map(row => `| ${row.join(' | ')} |`).join('\n');

  const steps = [
    {
      title: `Survei Topografi & Analisis Arah Angin di ${hub.name}`,
      desc: `Pengukuran elevasi kemiringan tanah, pengujian daya dukung pondasi tanah, dan penentuan orientasi atap menghadap timur-barat untuk pencahayaan surya merata.`
    },
    {
      title: `Kalkulasi Beban Struktur (RAB & Desain 3D Engineering)`,
      desc: `Simulasi pembebanan angin lokal (*wind load*) dan beban gantung tanaman rambat melon/paprika menggunakan software struktur sebelum fabrikasi dimulai.`
    },
    {
      title: `Fabrikasi Modul Rangka & Pengiriman Material ke Tapak`,
      desc: `Pengerjaan pemotongan pipa presisi, pengerolan busur kubah, dan pelubangan baut di workshop, kemudian dimobilisasi langsung ke lokasi proyek ${hub.name}.`
    },
    {
      title: `Ereksi Rangka, Pemasangan Plastik UV & Commissioning`,
      desc: `Pengecoran pondasi angkur beton, perakitan rangka tiang kolom, pemasangan lembaran plastik UV menggunakan profil lock, serta uji kebocoran air hujan.`
    }
  ];
  const stepsStr = steps.map((st, idx) => `${idx + 1}. **${st.title}:** ${st.desc}`).join('\n');

  const faqs = [
    {
      q: `Berapa estimasi biaya pembuatan greenhouse per meter persegi di wilayah ${hub.name}?`,
      a: `Biaya konstruksi berkisar antara Rp 180.000 – Rp 350.000/m² untuk tipe baja ringan ekonomis, Rp 380.000 – Rp 650.000/m² untuk tipe pipa galvanis komersial multi-span, dan Rp 850.000+/m² untuk tipe polikarbonat/kaca agrowisata, disesuaikan dengan bentang lebar dan otomasi yang dipilih.`
    },
    {
      q: `Apakah Agro Prima Greenhouse memberikan garansi struktur dan kebocoran di ${hub.name}?`,
      a: `Ya, kami memberikan garansi pemeliharaan kebocoran atap dan garansi ketahanan struktur rangka utama selama 1 hingga 3 tahun kalender yang dituangkan secara resmi dalam kontrak kerja B2B.`
    },
    {
      q: `Apakah tim Agro Prima Greenhouse bersedia melakukan survei langsung ke lahan kami di ${hub.name}?`,
      a: `Tentu, tim engineer lapangan kami siap menjadwalkan survei tapak proyek ke seluruh area ${hub.name} untuk pengukuran kontur tanah dan konsultasi desain layout kebun.`
    }
  ];

  const faqsMarkdown = faqs.map(f => `### ${f.q}\n${f.a}`).join('\n\n');
  const schemaFaqs = faqs.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a.replace(/\n/g, ' ').replace(/"/g, '\\"')
    }
  }));

  const content = `---
title: '${title.replace(/'/g, "''")}'
description: '${description.replace(/'/g, "''")}'
publishDate: '${getIndonesianDate()}'
author: 'Tim Ahli Agro Prima Greenhouse'
category: '${archetype.category}'
tags: [${[
  `greenhouse ${hub.name.toLowerCase()}`,
  archetype.seoKeyword,
  ...archetype.tags
].map(t => `'${t}'`).join(', ')}]
heroImage: '${archetype.heroImage}'
featured: false
---

# ${title}

${intro}

---

## 1. Analisis Rekayasa Iklim Mikro & Struktur di Kawasan ${hub.name}

${section1}

---

> ### Catatan Mandor & Poin Kritis Lapangan
${mandorNotesStr}

---

## 2. Tabel Spesifikasi Material & Analisis Teknis Struktur

${tableHeaderStr}
${tableRowsStr}

---

## 3. SOP Pelaksanaan Konstruksi Proyek di Lapangan

${stepsStr}

---

${NATIONWIDE_TABLE}

---

## Tanya Jawab Teknis Greenhouse (FAQ)

${faqsMarkdown}

---

## Wujudkan Greenhouse Modern & Produktif Bersama Agro Prima Greenhouse

Percayakan rancang bangun greenhouse pertanian modern Anda di wilayah **${hub.name}** kepada kontraktor ahli terpercaya:

- **Katalog Material & Part**: [Lihat Perlengkapan Greenhouse](/produk/)
- **Portofolio Proyek Nyata**: [Dokumentasi Proyek Greenhouse Se-Indonesia](/proyek/)
- **Konsultasi WhatsApp**: [Hubungi Tim Konstruksi (0857-4188-3391)](https://wa.me/6285741883391?text=${encodeURIComponent(`Halo Agro Prima Greenhouse, saya ingin konsultasi kebutuhan ${archetype.serviceTitle} untuk lokasi di ${hub.name}`)})

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": ${JSON.stringify(schemaFaqs, null, 2)}
}
\`\`\`
`;

  return {
    slug,
    title,
    content
  };
}

export function generateDailyArticles(count = 1) {
  console.log(`[ARTICLE-GENERATOR] Checking existing articles in ${artikelDir}...`);
  if (!fs.existsSync(artikelDir)) {
    fs.mkdirSync(artikelDir, { recursive: true });
  }

  const existingFiles = fs.readdirSync(artikelDir).filter((f) => f.endsWith('.md'));
  const existingSlugs = new Set(existingFiles.map((f) => f.replace(/\.md$/, '')));

  console.log(`[ARTICLE-GENERATOR] Found ${existingSlugs.size} existing articles.`);

  // Build programmatic matrix: 30 hubs x 7 archetypes = 210 targeted articles
  const candidateTopics = [];
  for (const hub of GREENHOUSE_HUBS) {
    for (const archetype of GREENHOUSE_ARCHETYPES) {
      candidateTopics.push(generateProceduralArticle(hub, archetype));
    }
  }

  const availableTopics = candidateTopics.filter((art) => !existingSlugs.has(art.slug));

  if (availableTopics.length === 0) {
    console.log('[ARTICLE-GENERATOR] All 210+ programmatic topics already published!');
    return [];
  }

  const toPublish = availableTopics.slice(0, count);
  const generatedFiles = [];

  for (const item of toPublish) {
    const filePath = path.join(artikelDir, `${item.slug}.md`);
    fs.writeFileSync(filePath, item.content, 'utf8');
    console.log(`[ARTICLE-GENERATOR] Published new article: ${filePath}`);
    generatedFiles.push(filePath);
  }

  console.log(`[ARTICLE-GENERATOR] Successfully created ${generatedFiles.length} new article(s)!`);
  return generatedFiles;
}

// CLI execution support
const args = process.argv.slice(2);
let count = 1;
const countIdx = args.indexOf('--count');
if (countIdx !== -1 && args[countIdx + 1]) {
  count = parseInt(args[countIdx + 1], 10);
}

generateDailyArticles(count);

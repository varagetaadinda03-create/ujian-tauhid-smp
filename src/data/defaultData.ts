import { Question, ExamConfig, StudentSession, SecurityViolation } from '../types';

export const DEFAULT_EXAM_CONFIG: ExamConfig = {
  schoolName: 'SMP PARA SAHABAT',
  appName: 'CBT SMP PARA SAHABAT',
  subject: 'Tauhid',
  material: 'Kitab Tauhid (Syaikh Muhammad bin Abdul Wahhab)',
  chapters: 'Bab 1 sampai Bab 5',
  durationMinutes: 60,
  activeToken: 'TAUHID2025',
  tokenExpiryDate: '2026-12-31 23:59',
  maxViolationsAllowed: 3,
  cameraPolicy: 'REQUIRED',
  allowScorePreviewToStudent: false,
  shuffleQuestions: false,
  autoSaveIntervalSeconds: 3,
  enableStrictAntiCheat: true,
};

export const INITIAL_QUESTIONS: Question[] = [
  // BAB 1 (Soal 1 & 2 PG)
  {
    id: 1,
    number: 1,
    type: 'pg',
    chapter: 'Bab 1',
    titleTopic: 'Kewajiban Bertauhid & Tujuan Penciptaan',
    arabicText: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
    translation: '"Dan Aku tidak menciptakan jin dan manusia melainkan supaya mereka beribadah kepada-Ku." (QS. Adz-Dzariyat: 56)',
    questionText: 'Berdasarkan firman Allah dalam QS. Adz-Dzariyat ayat 56 di atas, apakah hikmah dan tujuan utama Allah Subhanahu wa Ta\'ala menciptakan jin dan manusia?',
    options: [
      { key: 'A', text: 'Untuk mencari kekayaan dan membangun peradaban duniawi semata' },
      { key: 'B', text: 'Mentauhidkan dan mengikhlaskan seluruh ibadah hanya kepada Allah tanpa menyekutukan-Nya' },
      { key: 'C', text: 'Agar manusia saling bersaing dalam urusan jabatan dan kekuasaan' },
      { key: 'D', text: 'Untuk menikmati segala kenikmatan bumi tanpa adanya hisab dan tanggung jawab' },
    ],
    correctAnswer: 'B',
    scoreWeight: 5,
    explanation: 'Ayat ini menegaskan bahwa \'illat (sebab/tujuan) penciptaan jin dan manusia adalah semata-mata untuk mentauhidkan dan beribadah hanya kepada Allah.'
  },
  {
    id: 2,
    number: 2,
    type: 'pg',
    chapter: 'Bab 1',
    titleTopic: 'Hak Allah atas Hamba dan Hak Hamba atas Allah',
    arabicText: 'حَقُّ اللَّهِ عَلَى الْعِبَادِ أَنْ يَعْبُدُوهُ وَلَا يُشْرِكُوا بِهِ شَيْئًا ، وَحَقُّ الْعِبَادِ عَلَى اللَّهِ أَنْ لَا يُعَذِّبَ مَنْ لَا يُشْرِكُ بِهِ شَيْئًا',
    translation: 'Hadits Mu\'adz bin Jabal radhiyallahu \'anhu tentang hak Allah dan hak hamba.',
    questionText: 'Dalam hadits Mu\'adz bin Jabal radhiyallahu \'anhu ketika berboncengan bersama Rasulullah ﷺ di atas keledai bernama \'Ufair, apakah yang dimaksud dengan "Hak Allah atas seluruh hamba-Nya"?',
    options: [
      { key: 'A', text: 'Hamba beribadah kepada-Nya dan tidak mempersekutukan-Nya dengan sesuatu apapun' },
      { key: 'B', text: 'Allah memberikan rezeki melimpah tanpa syarat kepada setiap manusia' },
      { key: 'C', text: 'Hamba diberi kebebasan mutlak menentukan tata cara ibadah sesuai logika' },
      { key: 'D', text: 'Hamba tidak akan diuji dengan musibah selama hidup di dunia' },
    ],
    correctAnswer: 'A',
    scoreWeight: 5,
    explanation: 'Hak Allah yang wajib ditunaikan oleh hamba adalah beribadah kepada-Nya secara ikhlas dan tidak berbuat syirik sedikit pun.'
  },

  // BAB 2 (Soal 3 & 4 PG)
  {
    id: 3,
    number: 3,
    type: 'pg',
    chapter: 'Bab 2',
    titleTopic: 'Keutamaan Tauhid & Pelebur Dosa',
    arabicText: 'مَنْ شَهِدَ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، وَأَنَّ عِيسَى عَبْدُ اللَّهِ وَرَسُولُهُ...',
    translation: 'Hadits \'Ubadah bin Shamit radhiyallahu \'anhu tentang keutamaan syahadat tauhid.',
    questionText: 'Berdasarkan hadits \'Ubadah bin Shamit radhiyallahu \'anhu pada Bab 2 Kitab Tauhid, bagaimanakah status kedudukan Nabi \'Isa \'alaihissalam dalam aqidah tauhid Ahlus Sunnah wal Jama\'ah yang membedakannya dari kaum Nashrani dan Yahudi?',
    options: [
      { key: 'A', text: 'Nabi \'Isa adalah anak Tuhan dan salah satu dari trinitas' },
      { key: 'B', text: 'Nabi \'Isa adalah hamba Allah, utusan-Nya, kalimat-Nya yang disampaikan kepada Maryam, serta ruh dari-Nya' },
      { key: 'C', text: 'Nabi \'Isa adalah manusia biasa yang lahir dari hasil perbuatan dusta' },
      { key: 'D', text: 'Nabi \'Isa memiliki sifat ketuhanan yang berhak disembah bersama Allah' },
    ],
    correctAnswer: 'B',
    scoreWeight: 5,
    explanation: 'Dalam aqidah tauhid yang benar, Nabi Isa adalah hamba Allah dan Rasul-Nya, bukan tuhan dan bukan anak zina sebagaimana tuduhan Yahudi.'
  },
  {
    id: 4,
    number: 4,
    type: 'pg',
    chapter: 'Bab 2',
    titleTopic: 'Keluasan Ampunan bagi Ahli Tauhid',
    arabicText: 'يَا ابْنَ آدَمَ لَوْ أَتَيْتَنِي بِقُرَابِ الْأَرْضِ خَطَايَا ثُمَّ لَقِيتَنِي لَا تُشْرِكُ بِي شَيْئًا لَأَتَيْتُكَ بِقُرَابِهَا مَغْفِرَةً',
    translation: '"Wahai anak Adam, seandainya engkau mendatangi-Ku dengan membawa dosa sepenuh bumi lalu engkau menemui-Ku tanpa menyekutukan-Ku dengan sesuatu pun, niscaya Aku akan mendatangimu dengan ampunan sepenuh bumi pula." (Hadits Qudsi riwayat At-Tirmidzi)',
    questionText: 'Pelajaran aqidah terpenting yang dipetik dari Hadits Qudsi Anas bin Malik di atas adalah...',
    options: [
      { key: 'A', text: 'Boleh meremehkan perbuatan maksiat selama lisan berdzikir' },
      { key: 'B', text: 'Tauhid yang murni adalah sebab terbesar terhapusnya dosa-dosa dan turunnya rahmat ampunan Allah' },
      { key: 'C', text: 'Dosa syirik akan diampuni secara otomatis di akhirat meskipun meninggal tanpa bertaubat' },
      { key: 'D', text: 'Amalan kebajikan orang musyrik tetap diterima di timbangan mizan' },
    ],
    correctAnswer: 'B',
    scoreWeight: 5,
    explanation: 'Tauhid adalah syarat mutlak diterimanya amalan dan faktor terbesar pengampunan dosa-dosa besar selain syirik.'
  },

  // BAB 3 (Soal 5 & 6 PG)
  {
    id: 5,
    number: 5,
    type: 'pg',
    chapter: 'Bab 3',
    titleTopic: 'Merealisasikan Tauhid (Tahqiqut Tauhid)',
    arabicText: 'إِنَّ إِبْرَاهِيمَ كَانَ أُمَّةً قَانِتًا لِّلَّهِ حَنِيفًا وَلَمْ يَكُ مِنَ الْمُشْرِكِينَ',
    translation: '"Sesungguhnya Ibrahim adalah seorang imam yang dapat dijadikan teladan lagi patuh kepada Allah dan hanif (lurus). Dan sekali-kali bukanlah dia termasuk orang-orang yang mempersekutukan (Tuhan)." (QS. An-Nahl: 120)',
    questionText: 'Apa makna sifat "Hanifan" (حَنِيفًا) yang disematkan Allah kepada Nabi Ibrahim \'alaihissalam pada ayat di atas?',
    options: [
      { key: 'A', text: 'Berpaling dari segala bentuk kemusyrikan dan condong menghadapkan diri hanya kepada tauhid yang lurus' },
      { key: 'B', text: 'Memiliki banyak harta dan keturunan bangsawan di kaumnya' },
      { key: 'C', text: 'Mengikuti tradisi nenek moyang tanpa memilah kebenaran' },
      { key: 'D', text: 'Mengisolasi diri dari interaksi dakwah kepada masyarakat' },
    ],
    correctAnswer: 'A',
    scoreWeight: 5,
    explanation: 'Al-Hanif maknanya adalah muqbilan \'alallah ma\'ridhan \'an kulli ma siwahu (menghadap kepada Allah dan berpaling dari kesyirikan).'
  },
  {
    id: 6,
    number: 6,
    type: 'pg',
    chapter: 'Bab 3',
    titleTopic: '70.000 Golongan Masuk Surga Tanpa Hisab & Tanpa Azab',
    arabicText: 'هُمُ الَّذِينَ لَا يَسْتَرِقُونَ، وَلَا يَتَطَيَّرُونَ، وَلَا يَكْتَوُونَ، وَعَلَى رَبِّهِمْ يَتَوَكَّلُونَ',
    translation: 'Hadits Ibnu Abbas tentang 70.000 orang yang masuk surga tanpa hisab dan azab.',
    questionText: 'Dalam riwayat shahih Bukhari & Muslim tentang 70.000 orang umat Nabi Muhammad ﷺ yang masuk surga tanpa hisab dan azab, manakah di antara pilihan berikut yang BUKAN merupakan sifat mereka?',
    options: [
      { key: 'A', text: 'Tidak meminta orang lain untuk meruqyah dirinya (لا يسترقون)' },
      { key: 'B', text: 'Tidak menganggap sial terhadap burung atau tanda kesialan / tathayyur (لا يتطيرون)' },
      { key: 'C', text: 'Tidak melakukan pengobatan dengan kay / besi panas (لا يكتوون)' },
      { key: 'D', text: 'Menggantungkan jimat atau tamimah untuk perlindungan diri dari \'ain' },
    ],
    correctAnswer: 'D',
    scoreWeight: 5,
    explanation: 'Ciri mereka adalah kesempurnaan tawakkal (وعلى ربهم يتوكلون) sehingga tidak meminta ruqyah, tidak tathayyur, dan tidak kay. Menggantungkan jimat adalah bentuk syirik yang bertolak belakang dengan tauhid.'
  },

  // BAB 4 (Soal 7 & 8 PG)
  {
    id: 7,
    number: 7,
    type: 'pg',
    chapter: 'Bab 4',
    titleTopic: 'Rasa Takut Terhadap Bahaya Syirik',
    arabicText: 'إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ',
    translation: '"Sesungguhnya Allah tidak akan mengampuni dosa syirik, dan Dia mengampuni segala dosa yang selain dari (syirik) itu bagi siapa yang dikehendaki-Nya." (QS. An-Nisa: 48)',
    questionText: 'Berdasarkan QS. An-Nisa ayat 48 di atas, jika seseorang meninggal dunia dalam keadaan belum bertaubat dari dosa Syirik Akbar (syirik besar), maka hukumnya di akhirat adalah...',
    options: [
      { key: 'A', text: 'Dosanya tidak akan diampuni Allah dan ia kekal di dalam neraka selama-lamanya' },
      { key: 'B', text: 'Pasti diampuni setelah disiksa beberapa hari di dalam neraka' },
      { key: 'C', text: 'Tergantung pada syafa\'at kerabatnya yang shalih' },
      { key: 'D', text: 'Diampuni asalkan amalan shalat sunnahnya banyak' },
    ],
    correctAnswer: 'A',
    scoreWeight: 5,
    explanation: 'Dosa Syirik Akbar tidak diampuni bila pelakunya meninggal tanpa bertaubat, membatalkan seluruh amal, dan mengekalkan pelakunya di neraka.'
  },
  {
    id: 8,
    number: 8,
    type: 'pg',
    chapter: 'Bab 4',
    titleTopic: 'Syirik Asghar (Syirik Kecil) & Bahaya Riya\'',
    arabicText: 'أَخْوَفُ مَا أَخَافُ عَلَيْكُمُ الشِّرْكُ الْأَصْغَرُ، فَسُئِلَ عَنْهُ فَقَالَ: الرِّيَاءُ',
    translation: '"Hal yang paling aku takuti menimpa kalian adalah syirik kecil." Ketika ditanya, beliau menjawab: "Riya\'." (HR. Ahmad)',
    questionText: 'Mengapa Rasulullah ﷺ sangat mengkhawatirkan syirik kecil (seperti Riya\' dan Sum\'ah) menimpa para sahabat dan umatnya?',
    options: [
      { key: 'A', text: 'Karena riya\' sangat samar, menyusup ke dalam hati orang yang gemar beramal shalih, dan dapat menggugurkan pahala amal' },
      { key: 'B', text: 'Karena syirik kecil tidak memiliki dalil pencegah di dalam Al-Qur\'an' },
      { key: 'C', text: 'Karena pelakunya langsung keluar dari agama Islam secara seketika' },
      { key: 'D', text: 'Karena riya\' hanya terjadi pada orang-orang kafir Quraisy' },
    ],
    correctAnswer: 'A',
    scoreWeight: 5,
    explanation: 'Riya\' adalah syirik khafiy (samar) yang sangat halus menyelinap dalam niat beramal untuk dipuji manusia sehingga menggugurkan pahala amalan tersebut.'
  },

  // BAB 5 (Soal 9 & 10 PG)
  {
    id: 9,
    number: 9,
    type: 'pg',
    chapter: 'Bab 5',
    titleTopic: 'Berdakwah Kepada Syahadat Laa Ilaha Illallah',
    arabicText: 'قُلْ هَٰذِهِ سَبِيلِي أَدْعُو إِلَى اللَّهِ ۚ عَلَىٰ بَصِيرَةٍ أَنَا وَمَنِ اتَّبَعَنِي',
    translation: '"Katakanlah: Inilah jalan (agama)ku, aku dan orang-orang yang mengikutiku mengajak (kamu) kepada Allah di atas bashirah (ilmu dan keyakinan)..." (QS. Yusuf: 108)',
    questionText: 'Apakah makna kata "Bashirah" (بَصِيرَةٍ) yang menjadi syarat mutlak dalam dakwah tauhid pada QS. Yusuf ayat 108?',
    options: [
      { key: 'A', text: 'Kekayaan materi dan jabatan kepemimpinan yang tinggi' },
      { key: 'B', text: 'Ilmu syar\'i yang mantap, hujjah yang nyata, serta keyakinan yang terang berlandaskan Al-Qur\'an dan Sunnah' },
      { key: 'C', text: 'Kepandaian merangkai kata-kata humor agar disukai audiens' },
      { key: 'D', text: 'Mengandalkan perasaan batin tanpa perlu merujuk pada dalil naqli' },
    ],
    correctAnswer: 'B',
    scoreWeight: 5,
    explanation: 'Al-Bashirah adalah ilmu dan keyakinan yang kokoh mengenai apa yang didakwahkan, metode berdakwah, dan keadaan mad\'u (objek dakwah).'
  },
  {
    id: 10,
    number: 10,
    type: 'pg',
    chapter: 'Bab 5',
    titleTopic: 'Prioritas Dakwah Mengajak kepada Tauhid',
    arabicText: 'فَلْيَكُنْ أَوَّلَ مَا تَدْعُوهُمْ إِلَيْهِ عِبَادَةُ اللَّهِ (شَهَادَةُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ)',
    translation: 'Wasiat Rasulullah ﷺ kepada Mu\'adz bin Jabal ketika diutus berdakwah ke negeri Yaman.',
    questionText: 'Ketika Rasulullah ﷺ mengutus sahabat Mu\'adz bin Jabal radhiyallahu \'anhu ke negeri Yaman yang berpenduduk Ahli Kitab, perkara apakah yang diperintahkan untuk menjadi PRIORITAS PERTAMA dakwah?',
    options: [
      { key: 'A', text: 'Mengumpulkan zakat harta dan sedekah' },
      { key: 'B', text: 'Mengajak mereka bersaksi bahwa tidak ada sesembahan yang berhak diibadahi selain Allah (Syahadat Tauhid)' },
      { key: 'C', text: 'Membangun baitul maal dan mengatur administrasi kenegaraan' },
      { key: 'D', text: 'Mewajibkan puasa Ramadhan selama satu bulan penuh' },
    ],
    correctAnswer: 'B',
    scoreWeight: 5,
    explanation: 'Tauhid adalah asas dan pondasi utama seluruh ajaran Islam, sehingga harus menjadi perkara pertama yang didakwahkan sebelum kewajiban shalat dan syariat lainnya.'
  },

  // SOAL ESAI (11 - 15)
  {
    id: 11,
    number: 11,
    type: 'essay',
    chapter: 'Bab 1',
    titleTopic: 'Esai Bab 1: Urgensi Tauhid & Makna Ibadah',
    questionText: 'Jelaskan pengertian "Tauhid Ibadah" (Tauhid Uluhiyyah) secara bahasa dan istilah syar\'i, serta sebutkan minimal 2 (dua) contoh amalan hati dan amalan lisan yang wajib dimurnikan hanya untuk Allah Ta\'ala!',
    scoreWeight: 10,
    rubricGuide: 'Kriteria Penilaian:\n1. Definisi bahasa dan istilah tepat (Mengesakan Allah dalam segala perbuatan hamba / ibadah): bobot 4 poin\n2. Menyebutkan 2 contoh amalan hati (misal: rasa takut/khauf, harap/raja\', tawakkal, mahabbah): bobot 3 poin\n3. Menyebutkan 2 contoh amalan lisan (misal: doa, istighotsah, dzikir, nazar lisan): bobot 3 poin'
  },
  {
    id: 12,
    number: 12,
    type: 'essay',
    chapter: 'Bab 2',
    titleTopic: 'Esai Bab 2: Keutamaan Kalimat Tauhid & Rukun Syahadat',
    questionText: 'Sebutkan 2 (dua) rukun utama dari kalimat syahadat "Laa Ilaha Illallah", dan jelaskan konsekuensi dari masing-masing rukun tersebut dalam kehidupan seorang muslim!',
    scoreWeight: 10,
    rubricGuide: 'Kriteria Penilaian:\n1. Menyebutkan Rukun 1: An-Nafyu (Penolakan/Peniadaan - "Laa Ilaha" menolak sesembahan selain Allah): bobot 5 poin\n2. Menyebutkan Rukun 2: Al-Itsbat (Penetapan - "Illallah" menetapkan ibadah hanya untuk Allah semata): bobot 5 poin'
  },
  {
    id: 13,
    number: 13,
    type: 'essay',
    chapter: 'Bab 3',
    titleTopic: 'Esai Bab 3: Merealisasikan Tauhid (Tahqiqut Tauhid)',
    questionText: 'Apa yang dimaksud dengan "Tahqiqut Tauhid" (Merealisasikan Tauhid dengan Sempurna)? Jelaskan mengapa orang yang merealisasikan tauhid dijamin masuk surga tanpa hisab dan tanpa azab berdasarkan hadits 70.000 golongan!',
    scoreWeight: 10,
    rubricGuide: 'Kriteria Penilaian:\n1. Definisi Tahqiqut Tauhid (Membersihkan tauhid dari noda syirik besar, syirik kecil, bid\'ah, dan maksiat): bobot 5 poin\n2. Hubungan dengan hadits 70.000 golongan (karena kesempurnaan tawakkal kepada Allah): bobot 5 poin'
  },
  {
    id: 14,
    number: 14,
    type: 'essay',
    chapter: 'Bab 4',
    titleTopic: 'Esai Bab 4: Perbedaan Syirik Akbar dan Syirik Ashghar',
    questionText: 'Tuliskan dan jelaskan 3 (tiga) perbedaan mendasar antara Syirik Akbar (Syirik Besar) dan Syirik Ashghar (Syirik Kecil) ditinjau dari sisi: status keislaman pelaku, akibat terhadap seluruh amal kebajikan, dan nasibnya di akhirat!',
    scoreWeight: 10,
    rubricGuide: 'Kriteria Penilaian:\n1. Status keislaman (Syirik Akbar mengeluarkan dari Islam/murtad; Syirik Ashghar tidak mengeluarkan): bobot 3.5 poin\n2. Akibat amal (Syirik Akbar menghapus seluruh amal; Syirik Ashghar menghapus amal yang dicampurinya saja): bobot 3.5 poin\n3. Di akhirat (Syirik Akbar kekal di neraka tanpa ampunan; Syirik Ashghar di bawah kehendak Allah/tidak kekal): bobot 3 poin'
  },
  {
    id: 15,
    number: 15,
    type: 'essay',
    chapter: 'Bab 5',
    titleTopic: 'Esai Bab 5: Hikmah & Metode Dakwah Tauhid',
    questionText: 'Berdasarkan hadits wasiat Rasulullah ﷺ kepada Sayyidina Ali bin Abi Thalib radhiyallahu \'anhu pada perang Khaibar ("Demi Allah, sungguh Allah memberi petunjuk kepada satu orang melalui perantaraanmu itu lebih baik bagimu daripada unta merah"): Jelaskan 2 (dua) hikmah agung dari berdakwah mengajak manusia kepada tauhid!',
    scoreWeight: 10,
    rubricGuide: 'Kriteria Penilaian:\n1. Nilai agung hidayah tauhid dibanding seluruh kekayaan dunia (unta merah): bobot 5 poin\n2. Pahala jariyah dan kasih sayang terhadap sesama agar selamat dari neraka: bobot 5 poin'
  }
];

export const INITIAL_STUDENT_SESSIONS: StudentSession[] = [
  {
    nis: '2025001',
    nisn: '0089271821',
    name: 'Ahmad Fauzan Al-Ghifari',
    className: 'Kelas 9A',
    token: 'TAUHID2025',
    sessionId: 'SESS-9A-78129',
    deviceInfo: 'Chrome on Windows 11 / Desktop',
    ipAddress: '192.168.1.45',
    status: 'IN_PROGRESS',
    startedAt: '2026-08-25 08:00:12',
    violationsCount: 1,
    cameraActive: true,
    fullscreenActive: true,
    connectionStatus: 'ONLINE',
    answers: {
      1: { questionId: 1, type: 'pg', selectedOption: 'B', isFlagged: false, lastSavedAt: '08:02:10', isSynced: true },
      2: { questionId: 2, type: 'pg', selectedOption: 'A', isFlagged: false, lastSavedAt: '08:04:15', isSynced: true },
      3: { questionId: 3, type: 'pg', selectedOption: 'B', isFlagged: true, lastSavedAt: '08:07:30', isSynced: true },
      4: { questionId: 4, type: 'pg', selectedOption: 'B', isFlagged: false, lastSavedAt: '08:10:05', isSynced: true },
      5: { questionId: 5, type: 'pg', selectedOption: 'A', isFlagged: false, lastSavedAt: '08:12:44', isSynced: true },
      11: {
        questionId: 11,
        type: 'essay',
        essayText: 'Tauhid Uluhiyyah secara istilah adalah mengesakan Allah Ta\'ala dalam seluruh perbuatan hamba, seperti beribadah hanya kepada Allah. Contoh amalan hati: rasa takut (khauf) dan tawakkal. Contoh amalan lisan: berdoa hanya kepada Allah dan beristighotsah.',
        isFlagged: false,
        lastSavedAt: '08:18:22',
        isSynced: true,
      }
    }
  },
  {
    nis: '2025002',
    nisn: '0089271822',
    name: 'Fatimah Az-Zahra',
    className: 'Kelas 9B',
    token: 'TAUHID2025',
    sessionId: 'SESS-9B-66291',
    deviceInfo: 'Safari on iPadOS / Tablet',
    ipAddress: '192.168.1.62',
    status: 'SUBMITTED',
    startedAt: '2026-08-25 08:00:00',
    submittedAt: '2026-08-25 08:45:10',
    violationsCount: 0,
    cameraActive: true,
    fullscreenActive: true,
    connectionStatus: 'ONLINE',
    pgScore: 50,
    essayScore: 45,
    totalScore: 95,
    isGraded: true,
    answers: {
      1: { questionId: 1, type: 'pg', selectedOption: 'B', isFlagged: false, lastSavedAt: '08:02', isSynced: true },
      2: { questionId: 2, type: 'pg', selectedOption: 'A', isFlagged: false, lastSavedAt: '08:04', isSynced: true },
      3: { questionId: 3, type: 'pg', selectedOption: 'B', isFlagged: false, lastSavedAt: '08:07', isSynced: true },
      4: { questionId: 4, type: 'pg', selectedOption: 'B', isFlagged: false, lastSavedAt: '08:10', isSynced: true },
      5: { questionId: 5, type: 'pg', selectedOption: 'A', isFlagged: false, lastSavedAt: '08:12', isSynced: true },
      6: { questionId: 6, type: 'pg', selectedOption: 'D', isFlagged: false, lastSavedAt: '08:15', isSynced: true },
      7: { questionId: 7, type: 'pg', selectedOption: 'A', isFlagged: false, lastSavedAt: '08:18', isSynced: true },
      8: { questionId: 8, type: 'pg', selectedOption: 'A', isFlagged: false, lastSavedAt: '08:21', isSynced: true },
      9: { questionId: 9, type: 'pg', selectedOption: 'B', isFlagged: false, lastSavedAt: '08:24', isSynced: true },
      10: { questionId: 10, type: 'pg', selectedOption: 'B', isFlagged: false, lastSavedAt: '08:27', isSynced: true },
      11: { questionId: 11, type: 'essay', essayText: 'Tauhid uluhiyyah adalah mentauhidkan Allah dalam ibadah. Amalan hati: khauf dan raja\'. Amalan lisan: dzikir dan doa.', isFlagged: false, lastSavedAt: '08:32', isSynced: true, scoreAwarded: 10, teacherNotes: 'Jawaban lengkap dan tepat.' },
      12: { questionId: 12, type: 'essay', essayText: 'Dua rukun syahadat adalah: 1. An-Nafyu (menolak segala sesembahan selain Allah) pada kata La Ilaha. 2. Al-Itsbat (menetapkan sesembahan yang benar hanya Allah) pada kata Illallah.', isFlagged: false, lastSavedAt: '08:35', isSynced: true, scoreAwarded: 10, teacherNotes: 'Sangat baik.' },
      13: { questionId: 13, type: 'essay', essayText: 'Tahqiqut tauhid adalah membersihkan tauhid dari syirik besar, syirik kecil, dan bid\'ah. Orang yang merealisasikannya bertawakkal penuh sehingga masuk surga tanpa hisab dan azab.', isFlagged: false, lastSavedAt: '08:38', isSynced: true, scoreAwarded: 9, teacherNotes: 'Penjelasan baik.' },
      14: { questionId: 14, type: 'essay', essayText: '1. Syirik akbar membatalkan Islam, syirik asghar tidak. 2. Syirik akbar menghapus seluruh amal, asghar menghapus amal terkait. 3. Syirik akbar kekal di neraka, asghar di bawah masyi\'ah Allah.', isFlagged: false, lastSavedAt: '08:41', isSynced: true, scoreAwarded: 9, teacherNotes: 'Sistematika bagus.' },
      15: { questionId: 15, type: 'essay', essayText: 'Hikmah dakwah tauhid: 1. Menyelamatkan manusia dari azab api neraka. 2. Memperoleh pahala yang sangat besar melebihi unta merah (harta paling berharga).', isFlagged: false, lastSavedAt: '08:44', isSynced: true, scoreAwarded: 7, teacherNotes: 'Sudah tepat.' },
    }
  },
  {
    nis: '2025003',
    nisn: '0089271823',
    name: 'Muhammad Rayhan Abdullah',
    className: 'Kelas 9A',
    token: 'TAUHID2025',
    sessionId: 'SESS-9A-11048',
    deviceInfo: 'Android Chrome / Samsung Galaxy Tab',
    ipAddress: '192.168.1.79',
    status: 'IN_PROGRESS',
    startedAt: '2026-08-25 08:05:30',
    violationsCount: 2,
    cameraActive: true,
    fullscreenActive: false,
    connectionStatus: 'ONLINE',
    answers: {
      1: { questionId: 1, type: 'pg', selectedOption: 'B', isFlagged: false, lastSavedAt: '08:07', isSynced: true },
      2: { questionId: 2, type: 'pg', selectedOption: 'A', isFlagged: false, lastSavedAt: '08:09', isSynced: true },
      3: { questionId: 3, type: 'pg', selectedOption: 'C', isFlagged: false, lastSavedAt: '08:11', isSynced: true },
    }
  },
  {
    nis: '2025004',
    nisn: '0089271824',
    name: 'Aisyah Humaira',
    className: 'Kelas 9B',
    token: 'TAUHID2025',
    sessionId: 'SESS-9B-99321',
    deviceInfo: 'Chrome on macOS / MacBook Air',
    ipAddress: '192.168.1.91',
    status: 'NOT_STARTED',
    violationsCount: 0,
    cameraActive: false,
    fullscreenActive: false,
    connectionStatus: 'OFFLINE',
    answers: {}
  }
];

export const INITIAL_VIOLATIONS: SecurityViolation[] = [
  {
    id: 'VIO-001',
    studentNis: '2025001',
    studentNisn: '0089271821',
    studentName: 'Ahmad Fauzan Al-Ghifari',
    className: 'Kelas 9A',
    type: 'TAB_SWITCH',
    message: 'Peserta terdeteksi berpindah tab browser selama 4 detik.',
    timestamp: '08:14:22',
    severity: 'WARNING',
    penaltyApplied: 'Peringatan ke-1 ditampilkan kepada siswa'
  },
  {
    id: 'VIO-002',
    studentNis: '2025003',
    studentNisn: '0089271823',
    studentName: 'Muhammad Rayhan Abdullah',
    className: 'Kelas 9A',
    type: 'FULLSCREEN_EXIT',
    message: 'Peserta keluar dari mode fullscreen ujian.',
    timestamp: '08:16:05',
    severity: 'WARNING',
    penaltyApplied: 'Layar peringatan dipicu, siswa diwajibkan kembali fullscreen'
  },
  {
    id: 'VIO-003',
    studentNis: '2025003',
    studentNisn: '0089271823',
    studentName: 'Muhammad Rayhan Abdullah',
    className: 'Kelas 9A',
    type: 'COPY_ATTEMPT',
    message: 'Mencoba menekan shortcut Ctrl+C pada soal Bab 2.',
    timestamp: '08:19:40',
    severity: 'INFO',
    penaltyApplied: 'Aksi diblokir oleh pelindung clipboard CBT'
  }
];

export const PRESET_STUDENTS = [
  { nis: '2025001', nisn: '0089271821', name: 'Ahmad Fauzan Al-Ghifari', className: 'Kelas 9A' },
  { nis: '2025002', nisn: '0089271822', name: 'Fatimah Az-Zahra', className: 'Kelas 9B' },
  { nis: '2025003', nisn: '0089271823', name: 'Muhammad Rayhan Abdullah', className: 'Kelas 9A' },
  { nis: '2025004', nisn: '0089271824', name: 'Aisyah Humaira', className: 'Kelas 9B' },
  { nis: '2025005', nisn: '0089271825', name: 'Zaid bin Tsabit', className: 'Kelas 9A' },
  { nis: '2025006', nisn: '0089271826', name: 'Maryam binti Imran', className: 'Kelas 9B' },
];

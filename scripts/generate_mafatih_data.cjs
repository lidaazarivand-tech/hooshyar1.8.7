const fs = require('fs');
const path = require('path');

async function fetchPage(p) {
  const url = `https://lib.eshia.ir/10376/1/${p}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const html = await res.text();
  const marker = 'id="book-page-content"';
  const start = html.indexOf(marker);
  if (start === -1) throw new Error(`Marker not found on page ${p}`);
  const tagEnd = html.indexOf('>', start);
  const end = html.indexOf('</td>', tagEnd);
  return html.slice(tagEnd + 1, end).replace(/<div class="sticky-menue">[\s\S]*?<\/div>/i, '');
}

function cleanHtmlText(html) {
  return html
    .replace(/<span class="Aye">([\s\S]*?)<\/span>/gi, '$1')
    .replace(/<span class="hadith">([\s\S]*?)<\/span>/gi, '$1')
    .replace(/<span class="z">([\s\S]*?)<\/span>/gi, '$1')
    .replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&zwnj;/g, '\u200c')
    .replace(/&laquo;|&raquo;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

async function generate() {
  console.log('--- Fetching Kumayl (pages 62-67) ---');
  const p62 = cleanHtmlText(await fetchPage(62));
  const p63 = cleanHtmlText(await fetchPage(63));
  const p64 = cleanHtmlText(await fetchPage(64));
  const p65 = cleanHtmlText(await fetchPage(65));
  const p66 = cleanHtmlText(await fetchPage(66));
  const p67 = cleanHtmlText(await fetchPage(67));

  const kStartMarker = 'اَللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ';
  const kStartIdx = p62.indexOf(kStartMarker);
  const kumaylP62 = p62.slice(kStartIdx).trim();

  const kEndMarker = 'وَ سَلَّمَ تَسْلِيماً [كَثِيراً]';
  const kEndIdx = p67.indexOf(kEndMarker);
  const kumaylP67 = p67.slice(0, kEndIdx + kEndMarker.length).trim();

  const kumaylArabic = [kumaylP62, p63, p64, p65, p66, kumaylP67].join('\n\n');

  console.log('--- Fetching Tawassul (pages 108-110) ---');
  const p108 = cleanHtmlText(await fetchPage(108));
  const p109 = cleanHtmlText(await fetchPage(109));
  const p110 = cleanHtmlText(await fetchPage(110));

  const tStartMarker = 'اَللَّهُمَّ إِنِّي أَسْأَلُكَ وَ أَتَوَجَّهُ إِلَيْكَ بِنَبِيِّكَ';
  const tStartIdx = p108.indexOf(tStartMarker);
  const tawassulP108 = p108.slice(tStartIdx).trim();

  const tEndMarker = 'آمِينَ رَبَّ الْعَالَمِينَ';
  const tEndIdx = p110.indexOf(tEndMarker);
  let tawassulP110 = p110.slice(0, tEndIdx + tEndMarker.length).trim();
  // Strip footnote 99
  tawassulP110 = tawassulP110.replace(/\b99\s+پس حاجات/, 'پس حاجات');

  const tawassulArabic = [tawassulP108, p109, tawassulP110].join('\n\n');

  console.log('--- Fetching Ashura (pages 456-458) ---');
  const p456 = cleanHtmlText(await fetchPage(456));
  const p457 = cleanHtmlText(await fetchPage(457));
  const p458 = cleanHtmlText(await fetchPage(458));

  const aStartMarker = 'اَلسَّلاَمُ عَلَيْكَ يَا أَبَا عَبْدِ اَللَّهِ';
  const aStartIdx = p456.indexOf(aStartMarker);
  const ashuraP456 = p456.slice(aStartIdx).trim();

  const aEndMarker = 'دُونَ اَلْحُسَيْنِ عليه السلام';
  let aEndIdx = p458.indexOf(aEndMarker);
  if (aEndIdx === -1) {
    aEndIdx = p458.indexOf('دُونَ اَلْحُسَيْنِ عَلَيْهِ السَّلاَمُ');
  }
  const ashuraP458 = p458.slice(0, aEndIdx + aEndMarker.length).trim();

  const ashuraArabic = [ashuraP456, p457, ashuraP458].join('\n\n');

  console.log('--- Fetching Ahd (pages 539-540) ---');
  const p539 = cleanHtmlText(await fetchPage(539));
  const p540 = cleanHtmlText(await fetchPage(540));

  const ahdStartMarker = 'اَللَّهُمَّ رَبَّ اَلنُّورِ اَلْعَظِيمِ';
  const ahdStartIdx = p539.indexOf(ahdStartMarker);
  const ahdP539 = p539.slice(ahdStartIdx).trim();

  const ahdEndMarker = 'اَلْعَجَلَ اَلْعَجَلَ يَا مَوْلاَيَ يَا صَاحِبَ اَلزَّمَانِ';
  const ahdEndIdx = p540.indexOf(ahdEndMarker);
  const ahdP540 = p540.slice(0, ahdEndIdx + ahdEndMarker.length).trim();

  const ahdArabic = [ahdP539, ahdP540].join('\n\n');

  const items = [
    {
      id: 'mafatih_kumayl',
      num: 1,
      title: 'دعای کمیل بن زیاد',
      shortTitle: 'دعای کمیل',
      category: 'دعا',
      description: 'دعای شریف تعلیم داده شده توسط حضرت امیرالمؤمنین علی بن ابی‌طالب (علیه‌السلام) به جناب کمیل بن زیاد نخعی؛ دعای حضرت خضر (ع) با فضیلت فراوان برای شب‌های جمعه و نیمه شعبان.',
      arabicText: kumaylArabic,
      persianTranslation: '',
      virtueOrOccasion: 'مستحب در شب‌های جمعه و شب نیمه شعبان جهت کفایت از شر دشمنان، گشایش روزی و آمرزش گناهان.',
      sourceCitation: 'کلیات مفاتیح الجنان، تألیف حاج شیخ عباس قمی (ره)، چاپ اسوه (مدرسه فقاهت، جلد ۱، ص ۶۲ تا ۶۷).',
      sourceUrl: 'https://lib.eshia.ir/10376/1/62',
      licenseInfo: 'متن عربی ادعیه و زیارات: متون مأثوره دینی؛ ترجمه فارسی به دلیل ضرورت احراز دقیق حقوق مالکیت فکری تا تعیین تکلیف قطعی درج نگردیده است.'
    },
    {
      id: 'mafatih_ashura',
      num: 2,
      title: 'زیارت عاشورا',
      shortTitle: 'زیارت عاشورا',
      category: 'زیارت',
      description: 'زیارت بافضیلت و مأثور حضرت اباعبدالله الحسین (علیه‌السلام) به روایت امام محمد باقر (ع) و امام جعفر صادق (ع) با ثواب عظیم و برآورده شدن حاجات.',
      arabicText: ashuraArabic,
      persianTranslation: '',
      virtueOrOccasion: 'مستحب در روز عاشورا و تمام ایام سال از دور و نزدیک؛ همراه با صد لعن و صد سلام و سجده پایانی.',
      sourceCitation: 'کلیات مفاتیح الجنان، تألیف حاج شیخ عباس قمی (ره)، چاپ اسوه (مدرسه فقاهت، جلد ۱، ص ۴۵۶ تا ۴۵۸).',
      sourceUrl: 'https://lib.eshia.ir/10376/1/456',
      licenseInfo: 'متن عربی ادعیه و زیارات: متون مأثوره دینی؛ ترجمه فارسی به دلیل ضرورت احراز دقیق حقوق مالکیت فکری تا تعیین تکلیف قطعی درج نگردیده است.'
    },
    {
      id: 'mafatih_tawassul',
      num: 3,
      title: 'دعای توسل به چهارده معصوم (ع)',
      shortTitle: 'دعای توسل',
      category: 'دعا',
      description: 'شفیع قرار دادن رسول گرامی اسلام و اهل بیت طاهرین (علیهم‌السلام) در پیشگاه خداوند متعال؛ به نقل از کفعمی و شیخ صدوق.',
      arabicText: tawassulArabic,
      persianTranslation: '',
      virtueOrOccasion: 'مداومت بر خواندن آن در شب‌های چهارشنبه و هنگام حاجات و طلب شفاعت از پیشگاه الهی.',
      sourceCitation: 'کلیات مفاتیح الجنان، تألیف حاج شیخ عباس قمی (ره)، چاپ اسوه (مدرسه فقاهت، جلد ۱، ص ۱۰۸ تا ۱۱۰).',
      sourceUrl: 'https://lib.eshia.ir/10376/1/108',
      licenseInfo: 'متن عربی ادعیه و زیارات: متون مأثوره دینی؛ ترجمه فارسی به دلیل ضرورت احراز دقیق حقوق مالکیت فکری تا تعیین تکلیف قطعی درج نگردیده است.'
    },
    {
      id: 'mafatih_ahd',
      num: 4,
      title: 'دعای عهد',
      shortTitle: 'دعای عهد',
      category: 'دعا',
      description: 'تجدید بیعت با حضرت بقیة الله الاعظم امام مهدی (عجل الله تعالی فرجه الشریف)؛ منقول از امام جعفر صادق (علیه‌السلام).',
      arabicText: ahdArabic,
      persianTranslation: '',
      virtueOrOccasion: 'مستحب در چهل بامداد؛ در روایت است هر کس چهل صبح این عهد را بخواند از یاران قائم (عج) خواهد بود.',
      sourceCitation: 'کلیات مفاتیح الجنان، تألیف حاج شیخ عباس قمی (ره)، چاپ اسوه (مدرسه فقاهت، جلد ۱، ص ۵۳۹ تا ۵۴۰).',
      sourceUrl: 'https://lib.eshia.ir/10376/1/539',
      licenseInfo: 'متن عربی ادعیه و زیارات: متون مأثوره دینی؛ ترجمه فارسی به دلیل ضرورت احراز دقیق حقوق مالکیت فکری تا تعیین تکلیف قطعی درج نگردیده است.'
    }
  ];

  // Validation
  console.log('--- Validating Data ---');
  const jsonStr = JSON.stringify(items, null, 2);

  // 1. Valid JSON check
  const parsed = JSON.parse(jsonStr);
  if (!Array.isArray(parsed) || parsed.length !== 4) {
    throw new Error('Parsed data must be array of 4 items');
  }

  // 2. U+FFFD count
  const ufffdMatches = jsonStr.match(/\uFFFD/g) || [];
  if (ufffdMatches.length > 0) {
    throw new Error(`Found ${ufffdMatches.length} U+FFFD characters!`);
  }

  // 3. Literal "..." check
  const ellipsisMatches = jsonStr.match(/\.\.\./g) || [];
  if (ellipsisMatches.length > 0) {
    throw new Error(`Found ${ellipsisMatches.length} literal "..." strings!`);
  }

  // 4. No empty Arabic text
  for (const item of parsed) {
    if (!item.arabicText || item.arabicText.trim().length === 0) {
      throw new Error(`Item ${item.id} has empty Arabic text!`);
    }
    if (!item.sourceUrl || !item.sourceUrl.startsWith('https://lib.eshia.ir/10376/')) {
      throw new Error(`Item ${item.id} has invalid source URL: ${item.sourceUrl}`);
    }
    if (!item.sourceCitation) {
      throw new Error(`Item ${item.id} has missing source citation!`);
    }
    console.log(`✓ ${item.id}: Arabic length = ${item.arabicText.length} chars, sourceUrl = ${item.sourceUrl}`);
  }

  // 5. Unique IDs
  const idSet = new Set(parsed.map(it => it.id));
  if (idSet.size !== parsed.length) {
    throw new Error('Duplicate IDs found!');
  }

  const targetPath = path.join(__dirname, '../src/data/mafatihFullData.json');
  fs.writeFileSync(targetPath, jsonStr, 'utf-8');
  console.log(`Successfully wrote ${targetPath} (${jsonStr.length} bytes)`);
}

generate().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});

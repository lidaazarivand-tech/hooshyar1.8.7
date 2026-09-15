import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { SHIA_BOOKS_CONTENT } from '../data/shiaBooksData';
import { ShiaBookItem } from '../types/books';
import { removePersianDiacritics } from '../utils/persianNumber';

describe('Mafatih al-Jinan Phase 1 Verified Data Integrity', () => {
  const jsonPath = path.join(__dirname, '../data/mafatihFullData.json');

  it('mafatihFullData.json exists and is valid JSON with 4 entries', () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const items: ShiaBookItem[] = JSON.parse(raw);
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(4);
  });

  it('contains the four expected entries: kumayl, ashura, tawassul, and ahd', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    expect(items).toBeDefined();
    expect(items.length).toBe(4);

    const ids = items.map(it => it.id);
    expect(ids).toContain('mafatih_kumayl');
    expect(ids).toContain('mafatih_ashura');
    expect(ids).toContain('mafatih_tawassul');
    expect(ids).toContain('mafatih_ahd');
  });

  it('contains NO ellipsis (...) anywhere in texts or descriptions', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    for (const it of items) {
      expect(it.arabicText).not.toContain('...');
      if (it.persianTranslation) {
        expect(it.persianTranslation).not.toContain('...');
      }
      expect(it.description).not.toContain('...');
    }
  });

  it('contains NO Unicode replacement characters (\\uFFFD) anywhere', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    for (const it of items) {
      expect(it.arabicText).not.toContain('\uFFFD');
      if (it.persianTranslation) {
        expect(it.persianTranslation).not.toContain('\uFFFD');
      }
      expect(it.description).not.toContain('\uFFFD');
    }
  });

  it('Dua Kumayl is complete from opening to concluding salawat', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const kumayl = items.find(it => it.id === 'mafatih_kumayl');
    expect(kumayl).toBeDefined();
    const cleanAr = removePersianDiacritics(kumayl!.arabicText);
    expect(cleanAr).toContain('اللهم إني أسألك برحمتك التي وسعت كل شيء');
    expect(cleanAr).toContain('يا نور يا قدوس');
    expect(cleanAr).toContain('يا سريع الرضا');
    expect(cleanAr).toContain('افعل بي ما أنت أهله');
    expect(kumayl!.arabicText.length).toBeGreaterThan(9000);
    expect(kumayl!.sourceCitation).toContain('اسوه');
  });

  it('Ziyarat Ashura contains complete text, 100x curses/salutations, and concluding Sajdah', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const ashura = items.find(it => it.id === 'mafatih_ashura');
    expect(ashura).toBeDefined();
    const cleanAr = removePersianDiacritics(ashura!.arabicText);
    expect(cleanAr).toContain('السلام عليك يا أبا عبد الله');
    expect(cleanAr).toContain('اللهم العن أول ظالم ظلم حق محمد');
    expect(cleanAr).toContain('السلام عليك يا أبا عبد الله و على الأرواح التي حلت بفنائك');
    expect(cleanAr).toContain('اللهم لك الحمد حمد الشاكرين');
    expect(cleanAr).toContain('ثبت لي قدم صدق عندك مع الحسين');
    expect(ashura!.arabicText.length).toBeGreaterThan(6000);
    expect(ashura!.sourceCitation).toContain('اسوه');
  });

  it('Dua Tawassul contains all 14 Infallibles invocation', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const tawassul = items.find(it => it.id === 'mafatih_tawassul');
    expect(tawassul).toBeDefined();
    const cleanAr = removePersianDiacritics(tawassul!.arabicText);
    expect(cleanAr).toContain('يا رسول الله');
    expect(cleanAr).toContain('يا أبا الحسن يا أمير المؤمنين يا علي بن أبي طالب');
    expect(cleanAr).toContain('يا فاطمة الزهراء يا بنت محمد');
    expect(cleanAr).toContain('يا حجة الله على خلقه يا سيدنا و مولانا');
    expect(cleanAr).toContain('فاشفعوا لي عند الله و استنقذوني من ذنوبي');
    expect(tawassul!.arabicText.length).toBeGreaterThan(4500);
    expect(tawassul!.sourceCitation).toContain('اسوه');
  });

  it('Dua Ahd is complete from cosmic opening to threefold pledge', () => {
    const items = SHIA_BOOKS_CONTENT['mafatih'] as ShiaBookItem[];
    const ahd = items.find(it => it.id === 'mafatih_ahd');
    expect(ahd).toBeDefined();
    const cleanAr = removePersianDiacritics(ahd!.arabicText);
    expect(cleanAr).toContain('اللهم رب النور العظيم');
    expect(cleanAr).toContain('اللهم إني أجدد له في صبيحة يومي هذا');
    expect(cleanAr).toContain('مؤتزرا كفني');
    expect(cleanAr).toContain('العجل العجل يا مولاي يا صاحب الزمان');
    expect(ahd!.arabicText.length).toBeGreaterThan(3000);
    expect(ahd!.sourceCitation).toContain('اسوه');
  });
});

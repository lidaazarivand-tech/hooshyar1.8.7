import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { SHIA_BOOK_CATEGORIES, SHIA_BOOKS_CONTENT } from '../data/shiaBooksData';
import { ShiaBookItem } from '../types/books';
import { removePersianDiacritics } from '../utils/persianNumber';

describe('Nahj al-Balagha Full Data Integrity & Structure', () => {
  const jsonPath = path.join(__dirname, '../data/nahjFullData.json');

  it('nahjFullData.json exists and is valid JSON', () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const items: ShiaBookItem[] = JSON.parse(raw);
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(800);
  });

  it('contains exactly 241 sermons, 79 letters, and 480 wisdoms', () => {
    const items = SHIA_BOOKS_CONTENT['nahj'] as ShiaBookItem[];
    expect(items).toBeDefined();
    expect(items.length).toBe(800);

    const sermons = items.filter(it => it.type === 'sermon');
    const letters = items.filter(it => it.type === 'letter');
    const wisdoms = items.filter(it => it.type === 'wisdom');

    expect(sermons.length).toBe(241);
    expect(letters.length).toBe(79);
    expect(wisdoms.length).toBe(480);
  });

  it('every item has non-empty Arabic text and Persian translation from Seyed Jafar Shahidi', () => {
    const items = SHIA_BOOKS_CONTENT['nahj'] as ShiaBookItem[];
    for (const it of items) {
      expect(it.id).toBeTruthy();
      expect(it.title).toBeTruthy();
      expect(it.arabicText).toBeTruthy();
      expect(it.arabicText.trim().length).toBeGreaterThan(5);
      expect(it.persianTranslation).toBeTruthy();
      expect(it.persianTranslation.trim().length).toBeGreaterThan(5);
      expect(it.category).toMatch(/^(خطبه‌ها|نامه‌ها|حکمت‌ها)$/);
      expect(it.sourceCitation).toContain('شهیدی');
    }
  });

  it('validates famous reference texts are present and accurate', () => {
    const items = SHIA_BOOKS_CONTENT['nahj'] as ShiaBookItem[];

    // Sermon 1
    const sermon1 = items.find(it => it.type === 'sermon' && it.num === 1);
    expect(sermon1).toBeDefined();
    const sermon1Ar = removePersianDiacritics(sermon1?.arabicText || '');
    expect(sermon1Ar).toContain('الحمد لله الذي لا يبلغ مدحته القائلون');
    expect(sermon1?.persianTranslation).toContain('سخنوران در ستودن او بمانند');

    // Sermon 3 (Shaqshaqiyya)
    const sermon3 = items.find(it => it.type === 'sermon' && it.num === 3);
    expect(sermon3).toBeDefined();
    const sermon3Ar = removePersianDiacritics(sermon3?.arabicText || '');
    expect(sermon3Ar).toContain('أما و الله لقد تقمصها');
    expect(sermon3?.title).toContain('شقشقیه');

    // Letter 31 (To Imam Hassan)
    const letter31 = items.find(it => it.type === 'letter' && it.num === 31);
    expect(letter31).toBeDefined();
    const letter31Ar = removePersianDiacritics(letter31?.arabicText || '');
    expect(letter31Ar).toContain('من الوالد');
    expect(letter31?.arabicFarazes && letter31.arabicFarazes.length).toBeGreaterThan(10);

    // Letter 53 (Malik Ashtar)
    const letter53 = items.find(it => it.type === 'letter' && it.num === 53);
    expect(letter53).toBeDefined();
    const letter53Ar = removePersianDiacritics(letter53?.arabicText || '');
    expect(letter53Ar).toContain('مالك بن الحارث الأشتر');
    expect(letter53?.persianTranslation).toContain('مالك اشتر');

    // Wisdom 1
    const wisdom1 = items.find(it => it.type === 'wisdom' && it.num === 1);
    expect(wisdom1).toBeDefined();
    const wisdom1Ar = removePersianDiacritics(wisdom1?.arabicText || '');
    expect(wisdom1Ar).toContain('كن في الفتنة كابن اللبون');
    expect(wisdom1?.persianTranslation).toContain('شتر');
  });

  it('validates Nahj book category metadata in SHIA_BOOK_CATEGORIES', () => {
    const nahjCategory = SHIA_BOOK_CATEGORIES.find(c => c.id === 'nahj');
    expect(nahjCategory).toBeDefined();
    expect(nahjCategory?.title).toBe('نهج‌البلاغه');
    expect(nahjCategory?.status.type).toBe('full');
    expect(nahjCategory?.totalChaptersOrItems).toBe(800);
    expect(nahjCategory?.sourceProvenance).toContain('balaghah.net');
    expect(nahjCategory?.sourceProvenance).toContain('شهیدی');
  });
});

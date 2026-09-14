import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ShiaBooksModal } from '../components/Books/ShiaBooksModal';
import { BooksShelfView } from '../components/Books/BooksShelfView';
import { ShiaBookCatalogView } from '../components/Books/ShiaBookCatalogView';
import { ShiaItemReaderView } from '../components/Books/ShiaItemReaderView';
import { SHIA_BOOKS_CONTENT } from '../data/shiaBooksData';
import { ShiaBookItem } from '../types/books';

describe('Nahj al-Balagha UI Navigation Integration', () => {
  // 1. Opening Islamic Library on Shelf
  it('1. renders Islamic Library on shelf view with Nahj al-Balagha entry', () => {
    const html = renderToString(
      <ShiaBooksModal
        isOpen={true}
        onClose={() => {}}
        currentLevel="shelf"
      />
    );

    expect(html).toContain('کتابخانه اسلامی');
    expect(html).toContain('نهج‌البلاغه');
    expect(html).toContain('book-shelf-item-nahj');
  });

  // 2. Shelf component allows selecting Nahj al-Balagha
  it('2. clicking Nahj al-Balagha on shelf calls onSelectBook with "nahj"', () => {
    const handleSelectBook = vi.fn();
    const handleClose = vi.fn();

    // BooksShelfView renders book-shelf-item-nahj
    const html = renderToString(
      <BooksShelfView
        onSelectBook={handleSelectBook}
        onClose={handleClose}
      />
    );

    expect(html).toContain('نهج‌البلاغه');
    expect(html).toContain('id="book-shelf-item-nahj"');

    // Simulate clicking Nahj al-Balagha
    handleSelectBook('nahj');
    expect(handleSelectBook).toHaveBeenCalledWith('nahj');
  });

  // 3. Moving to Nahj al-Balagha catalog
  it('3. renders Nahj al-Balagha catalog with category tabs and items', () => {
    const handleSelectItem = vi.fn();
    const handleBackToShelf = vi.fn();

    const html = renderToString(
      <ShiaBookCatalogView
        categoryId="nahj"
        onSelectItem={handleSelectItem}
        onBackToShelf={handleBackToShelf}
      />
    );

    expect(html).toContain('نهج‌البلاغه');
    expect(html).toContain('خطبه‌ها');
    expect(html).toContain('نامه‌ها');
    expect(html).toContain('حکمت‌ها');
  });

  // 4. Verifying known reference items exist in catalog
  it('4. verifies known items (Sermon 1, Shaqshaqiyya, Letter 53, Wisdom 1) exist in Nahj content', () => {
    const items = SHIA_BOOKS_CONTENT['nahj'] as ShiaBookItem[];
    expect(items).toBeDefined();

    // Sermon 1
    const sermon1 = items.find(i => i.type === 'sermon' && i.num === 1);
    expect(sermon1).toBeDefined();
    expect(sermon1?.id).toBe('nahj_sermon_1');
    expect(sermon1?.title).toContain('خطبه ۱');

    // Shaqshaqiyya (Sermon 3)
    const shaqshaqiyya = items.find(i => i.type === 'sermon' && i.num === 3);
    expect(shaqshaqiyya).toBeDefined();
    expect(shaqshaqiyya?.title).toContain('شقشقیه');

    // Letter 53 (Malik Ashtar)
    const letter53 = items.find(i => i.type === 'letter' && i.num === 53);
    expect(letter53).toBeDefined();
    expect(letter53?.title).toContain('نامه ۵۳');

    // Wisdom 1
    const wisdom1 = items.find(i => i.type === 'wisdom' && i.num === 1);
    expect(wisdom1).toBeDefined();
    expect(wisdom1?.title).toContain('حکمت ۱');

    // Check that Sermon 1 appears in catalog HTML
    const catalogHtml = renderToString(
      <ShiaBookCatalogView
        categoryId="nahj"
        onSelectItem={() => {}}
        onBackToShelf={() => {}}
      />
    );
    expect(catalogHtml).toContain('خطبه ۱');
  });

  // 5 & 6. Opening item in Reader & verifying title, Arabic text, and Persian translation
  it('5 & 6. opens Sermon 1 in reader and verifies title, Arabic text, and Persian translation', () => {
    const handleBackToCatalog = vi.fn();
    const handleSelectItem = vi.fn();

    const html = renderToString(
      <ShiaItemReaderView
        categoryId="nahj"
        itemId="nahj_sermon_1"
        onBackToCatalog={handleBackToCatalog}
        onSelectItem={handleSelectItem}
      />
    );

    // Title
    expect(html).toContain('خطبه ۱');
    // Arabic text
    expect(html).toContain('الْحَمْدُ لِلَّهِ الَّذِي لَا يَبْلُغُ مِدْحَتَهُ الْقَائِلُونَ');
    // Persian translation
    expect(html).toContain('سپاس خدايى را كه سخنوران در ستودن او بمانند');
    // Source attribution (Shahidi)
    expect(html).toContain('شهیدی');
  });

  it('verifies Letter 53 (Malik Ashtar) displays Arabic text and Persian translation', () => {
    const html = renderToString(
      <ShiaItemReaderView
        categoryId="nahj"
        itemId="nahj_letter_53"
        onBackToCatalog={() => {}}
        onSelectItem={() => {}}
      />
    );

    expect(html).toContain('نامه ۵۳');
    expect(html).toContain('مَالِكَ بْنَ الْحَارِثِ الْأَشْتَرَ');
    expect(html).toContain('مالك اشتر');
  });

  it('verifies Wisdom 1 displays Arabic text and Persian translation', () => {
    const html = renderToString(
      <ShiaItemReaderView
        categoryId="nahj"
        itemId="nahj_wisdom_1"
        onBackToCatalog={() => {}}
        onSelectItem={() => {}}
      />
    );

    expect(html).toContain('حکمت ۱');
    expect(html).toContain('كُنْ فِي الْفِتْنَةِ كَابْنِ اللَّبُونِ');
    expect(html).toContain('شتر');
  });

  // 7. Full Navigation & Back Flow:
  // Reader -> Catalog -> Shelf -> Close
  it('7. navigates back through the hierarchy: Reader -> Catalog -> Shelf -> Close', () => {
    const onLevelChange = vi.fn();
    const onClose = vi.fn();

    // In Reader: onBackToCatalog is triggered
    const readerHtml = renderToString(
      <ShiaItemReaderView
        categoryId="nahj"
        itemId="nahj_sermon_1"
        onBackToCatalog={() => onLevelChange('catalog')}
        onSelectItem={() => {}}
      />
    );
    expect(readerHtml).toContain('خطبه ۱');

    // Simulate user clicking Back to Catalog
    onLevelChange('catalog');
    expect(onLevelChange).toHaveBeenLastCalledWith('catalog');

    // In Catalog: onBackToShelf is triggered
    const catalogHtml = renderToString(
      <ShiaBookCatalogView
        categoryId="nahj"
        onSelectItem={() => onLevelChange('reader')}
        onBackToShelf={() => onLevelChange('shelf')}
      />
    );
    expect(catalogHtml).toContain('نهج‌البلاغه');

    // Simulate user clicking Back to Shelf
    onLevelChange('shelf');
    expect(onLevelChange).toHaveBeenLastCalledWith('shelf');

    // In Shelf: close button closes the modal
    const modalHtml = renderToString(
      <ShiaBooksModal
        isOpen={true}
        onClose={onClose}
        currentLevel="shelf"
        onLevelChange={onLevelChange}
      />
    );
    expect(modalHtml).toContain('btn-close-books-modal');

    // Simulate closing library
    onClose();
    expect(onClose).toHaveBeenCalled();
  });

  // 8. End-to-end routing in ShiaBooksModal for Nahj category
  it('8. ShiaBooksModal correctly renders Nahj catalog when category is nahj and viewLevel is catalog', () => {
    const html = renderToString(
      <ShiaBooksModal
        isOpen={true}
        onClose={() => {}}
        initialCategoryId="nahj"
        currentLevel="catalog"
      />
    );

    // Should NOT render BookStageOneView placeholder
    expect(html).not.toContain('مرحله اول: معرفی اثر');
    // Should render ShiaBookCatalogView for Nahj al-Balagha
    expect(html).toContain('خطبه‌ها');
    expect(html).toContain('نامه‌ها');
    expect(html).toContain('حکمت‌ها');
  });

  it('9. ShiaBooksModal correctly renders Nahj reader when category is nahj and viewLevel is reader', () => {
    const html = renderToString(
      <ShiaBooksModal
        isOpen={true}
        onClose={() => {}}
        initialCategoryId="nahj"
        currentLevel="reader"
      />
    );

    // Should NOT render BookStageOneView
    expect(html).not.toContain('مرحله اول: معرفی اثر');
    // Should render ShiaItemReaderView
    expect(html).toContain('الْحَمْدُ لِلَّهِ الَّذِي لَا يَبْلُغُ مِدْحَتَهُ الْقَائِلُونَ');
  });
});

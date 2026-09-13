import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  ScrollText, 
  Compass, 
  HeartHandshake, 
  Layers,
  ShieldCheck,
  Flame,
  Scale,
  Award,
  BookMarked
} from 'lucide-react';
import { 
  SHIA_BOOK_CATEGORIES, 
  SHIA_BOOKS_CONTENT,
  SAHIFAH_CATALOG_DUAS,
  SahifahCatalogEntry
} from '../../data/shiaBooksData';
import { ShiaBookItem, BookCategoryId } from '../../types/books';

interface ShiaBookCatalogViewProps {
  categoryId: BookCategoryId;
  onSelectItem: (itemId: string) => void;
  onBackToShelf: () => void;
}

export const ShiaBookCatalogView: React.FC<ShiaBookCatalogViewProps> = ({
  categoryId,
  onSelectItem,
  onBackToShelf
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  const categoryMeta = SHIA_BOOK_CATEGORIES.find(c => c.id === categoryId);
  const items = SHIA_BOOKS_CONTENT[categoryId] || [];

  const subCategories = useMemo(() => {
    if (categoryId === 'sahifah') return [];
    const set = new Set<string>();
    items.forEach(it => set.add(it.category));
    return Array.from(set);
  }, [items, categoryId]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (categoryId === 'sahifah') {
      let list = SAHIFAH_CATALOG_DUAS;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        list = list.filter(
          d =>
            d.num.toString() === q ||
            d.title.toLowerCase().includes(q) ||
            d.desc.toLowerCase().includes(q)
        );
      }
      return list;
    }

    let list = items;
    if (selectedSubCategory !== 'all') {
      list = list.filter(it => it.category === selectedSubCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        it =>
          it.title.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q) ||
          it.persianTranslation.toLowerCase().includes(q)
      );
    }
    return list;
  }, [categoryId, items, selectedSubCategory, searchQuery]);

  const getCategoryIcon = () => {
    switch (categoryId) {
      case 'nahj':
        return <ScrollText className="w-8 h-8 text-amber-200" />;
      case 'sahifah':
        return <Compass className="w-8 h-8 text-blue-200" />;
      case 'mafatih':
        return <Layers className="w-8 h-8 text-rose-200" />;
      case 'kafi':
        return <ShieldCheck className="w-8 h-8 text-indigo-200" />;
      case 'fatimiyyah':
        return <Flame className="w-8 h-8 text-pink-200" />;
      case 'ghurar':
        return <Sparkles className="w-8 h-8 text-cyan-200" />;
      case 'ahkam':
        return <Scale className="w-8 h-8 text-emerald-200" />;
      case 'uyun':
        return <Award className="w-8 h-8 text-amber-300" />;
      case 'tuhaf':
        return <BookMarked className="w-8 h-8 text-violet-200" />;
      default:
        return <BookOpen className="w-8 h-8 text-emerald-200" />;
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Back Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onBackToShelf}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-xs transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به کتابخانه اسلامی</span>
        </button>

        <div className="flex items-center gap-2">
          {categoryMeta?.status && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${categoryMeta.status.badgeClass}`}>
              {categoryMeta.status.label}
            </span>
          )}
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700">
            {categoryMeta?.persianTitle}
          </span>
        </div>
      </div>

      {/* Book Hero Banner */}
      <div className={`p-6 rounded-3xl text-white shadow-lg relative overflow-hidden bg-gradient-to-br ${categoryMeta?.colorClass || 'from-slate-800 to-slate-950'}`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-200 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{categoryMeta?.authorOrSource}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              {categoryMeta?.persianTitle}
            </h2>
            <p className="text-slate-100/85 text-xs mt-1 max-w-xl leading-relaxed">
              {categoryMeta?.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-black/25 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs">
            {getCategoryIcon()}
            <div>
              <p className="font-bold text-white">
                {categoryId === 'sahifah' ? 'فهرست ۵۴ دعا (منتخب متنی)' : `${items.length} بخش منتخب معتبر`}
              </p>
              <p className="text-[10px] text-slate-200">
                {categoryId === 'sahifah' ? `${items.length} دعا با متن و ترجمه کامل` : 'با متن و ترجمه فارسی'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Provenance & Legal License Info Panel */}
      {(categoryMeta?.sourceProvenance || categoryMeta?.licenseInfo) && (
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">منبع و اصالت نسخه: </span>
              <span className="text-slate-600 dark:text-slate-400">{categoryMeta.sourceProvenance}</span>
            </div>
          </div>
          {categoryMeta.licenseInfo && (
            <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              <span>{categoryMeta.licenseInfo}</span>
            </div>
          )}
        </div>
      )}

      {/* Search and Sub-Category Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`جستجو در ${categoryMeta?.title || 'کتاب'} (عنوان، موضوع یا متن)...`}
            className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1.5 py-0.5 rounded-md"
            >
              پاک کردن
            </button>
          )}
        </div>

        {/* Sub Categories Tabs (if not Sahifah) */}
        {subCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedSubCategory === 'all'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              همه بخش‌ها
            </button>
            {subCategories.map(sub => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedSubCategory === sub
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Items List / Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {categoryId === 'sahifah'
          ? (filteredItems as SahifahCatalogEntry[]).map(dua => {
              const hasFullContent = items.some(it => it.id === dua.id);
              return (
                <div
                  key={dua.id}
                  id={`sahifah-card-${dua.num}`}
                  onClick={() => onSelectItem(dua.id)}
                  className={`group bg-white dark:bg-slate-800 p-4 rounded-2xl border ${
                    hasFullContent
                      ? 'border-blue-200/90 dark:border-blue-800/60 hover:border-blue-500 dark:hover:border-blue-400'
                      : 'border-slate-200/90 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-500 opacity-90'
                  } shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center transition-colors ${
                            hasFullContent
                              ? 'bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white'
                              : 'bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {dua.num}
                        </div>
                        <h3 className="text-base font-extrabold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {dua.title}
                        </h3>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          hasFullContent
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {hasFullContent ? 'متن کامل' : 'در فهرست'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mb-2 leading-relaxed">
                      {dua.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>دعای شماره {dua.num} صحیفه</span>
                    <span
                      className={`font-bold group-hover:translate-x-[-4px] transition-transform flex items-center gap-1 ${
                        hasFullContent
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {hasFullContent ? 'مطالعه متن دعا ←' : 'مشاهده وضعیت ←'}
                    </span>
                  </div>
                </div>
              );
            })
          : (filteredItems as ShiaBookItem[]).map((item: ShiaBookItem) => (
              <div
                key={item.id}
                id={`item-card-${item.id}`}
                onClick={() => onSelectItem(item.id)}
                className="group bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {item.category}
                    </span>
                    {item.virtueOrOccasion && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        فضیلت دار
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Short text preview */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] font-serif text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    «{item.arabicText}»
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>متن و ترجمه فارسی کامل</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                    مشاهده و مطالعه ←
                  </span>
                </div>
              </div>
            ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            موردی مطابق با جستجوی شما یافت نشد
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubCategory('all');
            }}
            className="mt-3 px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            نمایش همه موارد
          </button>
        </div>
      )}
    </div>
  );
};

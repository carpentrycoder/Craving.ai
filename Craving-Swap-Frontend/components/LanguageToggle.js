'use client';

export default function LanguageToggle({
  language,
  onChange,
}) {
  return (
    <div
      className="inline-flex border-4 border-black bg-white p-1 shadow-[4px_4px_0_#000]"
      role="group"
      aria-label="Instruction language"
    >
      <button
        type="button"
        onClick={() => onChange('en')}
        aria-pressed={language === 'en'}
        className={`px-4 py-2 font-bold transition-colors ${
          language === 'en'
            ? 'bg-black text-[#00ff41]'
            : 'bg-white text-black hover:bg-[#ffe600]'
        }`}
      >
        ENGLISH
      </button>

      <button
        type="button"
        onClick={() => onChange('hinglish')}
        aria-pressed={language === 'hinglish'}
        className={`px-4 py-2 font-bold transition-colors ${
          language === 'hinglish'
            ? 'bg-black text-[#00ff41]'
            : 'bg-white text-black hover:bg-[#ffe600]'
        }`}
      >
        HINGLISH
      </button>
    </div>
  );
}

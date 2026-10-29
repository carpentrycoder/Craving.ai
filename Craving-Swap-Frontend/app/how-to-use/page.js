'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Nav from '../../components/Nav';
import LanguageToggle from '../../components/LanguageToggle';


const content = {
  en: {
    badge: 'USER GUIDE // CRAVINGSWAP 101',

    title: 'HOW TO USE CRAVINGSWAP',

    subtitle:
      'A craving hits. You tell us what you want. CravingSwap gives you three practical ways to handle it.',

    exampleLabel: 'EXAMPLE CRAVING',

    example:
      '"I am craving a spicy cheese pizza right now."',


    step1Title: 'TELL US YOUR CRAVING',

    step1Text:
      'Type whatever food you are craving. You do not need to use special keywords or food categories.',

    step1Example:
      'Example: Spicy cheese pizza',


    step2Title: 'LET AI UNDERSTAND IT',

    step2Text:
      'CravingSwap analyzes the craving and identifies useful characteristics such as flavor and texture.',

    analysis: [
      'SPICY',
      'CHEESY',
      'CRISPY',
    ],


    step3Title: 'CHOOSE YOUR SWAP LEVEL',

    step3Text:
      'You receive three different levels of alternatives. Pick the one that is realistic for you right now.',


    quickBuyTitle: 'QUICK BUY',

    quickBuyText:
      'An easy-to-buy alternative. If you choose nearby search and allow location access, available nearby options may also appear.',

    quickBuyAction:
      'BEST WHEN: You want something quickly and do not want to cook.',


    fiveMinuteTitle: '5-MINUTE FIX',

    fiveMinuteText:
      'A fast kitchen option using simple ingredients and minimal preparation.',

    fiveMinuteAction:
      'BEST WHEN: You can spend a few minutes assembling something.',


    recipeTitle: 'RECIPE',

    recipeText:
      'A more complete homemade alternative with ingredients, steps, approximate cost, preparation time, and craving-match reasoning.',

    recipeAction:
      'BEST WHEN: You have more time and want to cook.',


    step4Title: 'TELL US WHAT YOU CHOSE',

    step4Text:
      'After seeing the alternatives, record what you actually did. This helps your history and analytics reflect your real choices.',

    outcomes: [
      'I chose this swap',
      'I made the quick fix',
      'I cooked the recipe',
      'I gave in',
      'I skipped it',
    ],

    relapseText:
      'Chose the original craving? No guilt. CravingSwap records the choice without judging it.',


    step5Title: 'TRACK YOUR PROGRESS',

    step5Text:
      'Use Dashboard and History to review the information recorded from your craving sessions and outcomes.',

    tracking: [
      'Money Saved',
      'Cravings Handled',
      'Craving Patterns',
      'Recent History',
    ],


    locationTitle: 'LOCATION IS OPTIONAL',

    locationText:
      'Location is only requested when you choose to include nearby options. If you deny location permission, you can still use the other craving alternatives.',


    importantTitle: 'GOOD TO KNOW',

    importantText:
      'CravingSwap provides general wellness suggestions, not medical advice. Costs and nearby availability are estimates or external search results and may vary.',


    readyTitle: 'READY TO TRY IT?',

    readyText:
      'You now know the flow. Enter a craving and choose the option that makes sense for you.',

    readyButton: 'SWAP MY FIRST CRAVING',
  },


  hinglish: {
    badge: 'USER GUIDE // CRAVINGSWAP 101',

    title: 'CRAVINGSWAP KAISE USE KARE?',

    subtitle:
      'Craving hui? Bas hume batao kya khane ka mann ho raha hai. CravingSwap tumhe us craving ko handle karne ke 3 practical options dega.',

    exampleLabel: 'EXAMPLE CRAVING',

    example:
      '"Abhi spicy cheese pizza khane ka mann ho raha hai."',


    step1Title: 'APNI CRAVING BATAO',

    step1Text:
      'Jo khane ka mann ho raha hai woh simply type karo. Special keywords ya categories yaad rakhne ki zarurat nahi hai.',

    step1Example:
      'Example: Spicy cheese pizza',


    step2Title: 'AI KO CRAVING SAMJHNE DO',

    step2Text:
      'CravingSwap craving ko analyze karke flavor aur texture jaise useful characteristics identify karta hai.',

    analysis: [
      'SPICY',
      'CHEESY',
      'CRISPY',
    ],


    step3Title: 'APNA SWAP LEVEL CHOOSE KARO',

    step3Text:
      'Tumhe 3 different alternatives milenge. Jo option uss time tumhare liye practical ho, woh choose karo.',


    quickBuyTitle: 'QUICK BUY',

    quickBuyText:
      'Jaldi kharidne wala practical alternative. Agar nearby search choose karke location allow karoge, available nearby options bhi show ho sakte hain.',

    quickBuyAction:
      'BEST WHEN: Jaldi kuch chahiye aur cook nahi karna.',


    fiveMinuteTitle: '5-MINUTE FIX',

    fiveMinuteText:
      'Simple ingredients se quickly assemble hone wala kitchen option.',

    fiveMinuteAction:
      'BEST WHEN: Tum kitchen mein kuch minutes spend kar sakte ho.',


    recipeTitle: 'RECIPE',

    recipeText:
      'Proper homemade alternative jisme ingredients, steps, approximate cost, preparation time aur craving-match reason milta hai.',

    recipeAction:
      'BEST WHEN: Thoda extra time hai aur cook karna hai.',


    step4Title: 'BAAD MEIN BATAO TUMNE KYA CHOOSE KIYA',

    step4Text:
      'Alternatives dekhne ke baad actual mein tumne kya kiya woh record karo. Isi se History aur Analytics tumhari real choices reflect karenge.',

    outcomes: [
      'Maine swap choose kiya',
      'Maine quick fix banaya',
      'Maine recipe cook ki',
      'Maine original craving choose ki',
      'Maine craving skip ki',
    ],

    relapseText:
      'Original craving choose kar li? Koi guilt nahi. CravingSwap choice ko simply record karta hai, judge nahi.',


    step5Title: 'APNI PROGRESS TRACK KARO',

    step5Text:
      'Dashboard aur History se craving sessions aur recorded outcomes ki information review kar sakte ho.',

    tracking: [
      'Money Saved',
      'Cravings Handled',
      'Craving Patterns',
      'Recent History',
    ],


    locationTitle: 'LOCATION OPTIONAL HAI',

    locationText:
      'Location tabhi request hoti hai jab tum nearby options include karte ho. Permission deny karne par bhi baaki craving alternatives use kar sakte ho.',


    importantTitle: 'IMPORTANT BAAT',

    importantText:
      'CravingSwap general wellness suggestions deta hai, medical advice nahi. Costs aur nearby availability estimates ya external search results par based ho sakte hain aur change ho sakte hain.',


    readyTitle: 'AB TRY KARNE KE LIYE READY?',

    readyText:
      'Flow samajh aa gaya. Ab craving enter karo aur jo option tumhare liye practical ho woh choose karo.',

    readyButton: 'MERI CRAVING SWAP KARO',
  },
};


export default function Page() {
  const [language, setLanguage] =
    useState('en');

  const [ready, setReady] =
    useState(false);


  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        'cravingswap_instruction_language'
      );

    if (
      savedLanguage === 'en' ||
      savedLanguage === 'hinglish'
    ) {
      setLanguage(savedLanguage);
    }

    setReady(true);
  }, []);


  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);

    localStorage.setItem(
      'cravingswap_instruction_language',
      nextLanguage
    );
  }


  const t = content[language];


  if (!ready) {
    return null;
  }


  return (
    <>
      <Nav />

      <main className="mx-auto max-w-7xl space-y-10 p-4 md:p-8">

        {/* HEADER */}

        <section className="brutal bg-white p-6 md:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">

            <div className="max-w-4xl">
              <div className="mb-4 inline-block border-2 border-black bg-[#ffe600] px-3 py-1 text-xs font-bold">
                {t.badge}
              </div>

              <h1 className="display text-5xl uppercase leading-none md:text-7xl">
                {t.title}
              </h1>

              <p className="mt-5 max-w-3xl border-l-8 border-[#00ff41] pl-4 font-bold">
                {t.subtitle}
              </p>
            </div>


            <LanguageToggle
              language={language}
              onChange={changeLanguage}
            />
          </div>
        </section>


        {/* FLOW */}

        <div className="scan brutal p-4 text-center font-bold md:text-lg">
          CRAVING
          <span className="mx-3 text-white">
            →
          </span>

          ANALYZE
          <span className="mx-3 text-white">
            →
          </span>

          SWAP
          <span className="mx-3 text-white">
            →
          </span>

          SAVE
          <span className="mx-3 text-white">
            →
          </span>

          TRACK
        </div>


        {/* EXAMPLE */}

        <section className="brutal bg-[#ffe600] p-6">
          <p className="mb-2 text-xs font-bold">
            {t.exampleLabel}
          </p>

          <p className="display text-3xl md:text-5xl">
            {t.example}
          </p>
        </section>


        {/* STEP 1 */}

        <Step
          number="01"
          title={t.step1Title}
          color="#00ff41"
        >
          <p>{t.step1Text}</p>

          <div className="mt-4 border-4 border-black bg-white p-4 font-bold">
            &gt; {t.step1Example}
          </div>
        </Step>


        {/* STEP 2 */}

        <Step
          number="02"
          title={t.step2Title}
          color="#0055ff"
          dark
        >
          <p>{t.step2Text}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {t.analysis.map((item) => (
              <span
                key={item}
                className="tag"
              >
                {item}
              </span>
            ))}
          </div>
        </Step>


        {/* STEP 3 */}

        <Step
          number="03"
          title={t.step3Title}
          color="#ff2a00"
        >
          <p className="mb-6">
            {t.step3Text}
          </p>

          <div className="grid gap-5 lg:grid-cols-3">

            <SwapCard
              number="01"
              title={t.quickBuyTitle}
              text={t.quickBuyText}
              action={t.quickBuyAction}
              color="#00ff41"
            />

            <SwapCard
              number="02"
              title={t.fiveMinuteTitle}
              text={t.fiveMinuteText}
              action={t.fiveMinuteAction}
              color="#ffe600"
            />

            <SwapCard
              number="03"
              title={t.recipeTitle}
              text={t.recipeText}
              action={t.recipeAction}
              color="#0055ff"
              whiteText
            />

          </div>
        </Step>


        {/* STEP 4 */}

        <Step
          number="04"
          title={t.step4Title}
          color="#ffe600"
        >
          <p>{t.step4Text}</p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {t.outcomes.map(
              (outcome, index) => (
                <div
                  key={outcome}
                  className="border-2 border-black bg-white p-3 font-bold"
                >
                  [
                  {String(index + 1).padStart(
                    2,
                    '0'
                  )}
                  ] {outcome}
                </div>
              )
            )}
          </div>

          <div className="mt-5 border-4 border-black bg-[#00ff41] p-4 font-bold">
            {t.relapseText}
          </div>
        </Step>


        {/* STEP 5 */}

        <Step
          number="05"
          title={t.step5Title}
          color="#00ff41"
        >
          <p>{t.step5Text}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.tracking.map((item) => (
              <div
                key={item}
                className="border-4 border-black bg-white p-4"
              >
                <div className="text-xs font-bold">
                  TRACK
                </div>

                <div className="display mt-2 text-2xl">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </Step>


        {/* LOCATION */}

        <section className="grid gap-5 md:grid-cols-2">

          <div className="card">
            <div className="mb-3 inline-block bg-[#0055ff] px-2 py-1 text-xs font-bold text-white">
              LOCATION
            </div>

            <h2 className="display text-3xl">
              {t.locationTitle}
            </h2>

            <p className="mt-3">
              {t.locationText}
            </p>
          </div>


          <div className="card">
            <div className="mb-3 inline-block bg-[#ff2a00] px-2 py-1 text-xs font-bold text-white">
              DISCLAIMER
            </div>

            <h2 className="display text-3xl">
              {t.importantTitle}
            </h2>

            <p className="mt-3">
              {t.importantText}
            </p>
          </div>

        </section>


        {/* FINAL CTA */}

        <section className="brutal bg-[#00ff41] p-8 text-center md:p-12">

          <div className="mb-3 inline-block border-2 border-black bg-black px-3 py-1 text-xs font-bold text-[#00ff41]">
            SYSTEM READY
          </div>

          <h2 className="display text-4xl uppercase md:text-6xl">
            {t.readyTitle}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl font-bold">
            {t.readyText}
          </p>

          <Link
            href="/"
            className="btn mt-7 inline-block bg-black px-8 py-4 text-lg text-[#00ff41]"
          >
            [ {t.readyButton} ]
          </Link>
        </section>

      </main>
    </>
  );
}


function Step({
  number,
  title,
  color,
  dark = false,
  children,
}) {
  return (
    <section
      className={`brutal p-6 md:p-8 ${
        dark
          ? 'bg-black text-white'
          : 'bg-white'
      }`}
    >
      <div
        className="mb-5 inline-block border-2 border-black px-3 py-1 text-xs font-bold text-black"
        style={{
          backgroundColor: color,
        }}
      >
        STEP {number}
      </div>

      <h2 className="display mb-4 text-4xl uppercase md:text-5xl">
        {title}
      </h2>

      <div className="max-w-5xl">
        {children}
      </div>
    </section>
  );
}


function SwapCard({
  number,
  title,
  text,
  action,
  color,
  whiteText = false,
}) {
  return (
    <article className="border-4 border-black bg-white shadow-[5px_5px_0_#000]">

      <div
        className={`border-b-4 border-black p-3 font-bold ${
          whiteText
            ? 'text-white'
            : 'text-black'
        }`}
        style={{
          backgroundColor: color,
        }}
      >
        LEVEL {number}
      </div>

      <div className="p-5 text-black">
        <h3 className="display text-3xl">
          {title}
        </h3>

        <p className="mt-3">
          {text}
        </p>

        <p className="mt-5 border-t-2 border-black pt-3 text-xs font-bold">
          {action}
        </p>
      </div>

    </article>
  );
}
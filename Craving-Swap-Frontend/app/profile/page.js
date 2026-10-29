'use client';

import { useEffect, useState } from 'react';

import Nav from '../../components/Nav';
import {
  getProfile,
  updateProfile,
} from '../../lib/api';


const EMPTY_PROFILE = {
  preferredLanguage: 'en',
  budgetPreference: '',
  dietaryPreferences: [],
  allergies: [],
  dislikedFoods: [],
  favoriteCuisines: [],
  cookingSkill: '',
  maxCookingTime: '',
};


function listToText(value) {
  return Array.isArray(value)
    ? value.join(', ')
    : '';
}


function textToList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}


export default function Page() {
  const [profile, setProfile] = useState(
    EMPTY_PROFILE
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');


  useEffect(() => {
    async function loadProfile() {
      try {
        setError('');

        const data = await getProfile();

        setProfile({
          preferredLanguage:
            data.preferredLanguage || 'en',

          budgetPreference:
            data.budgetPreference || '',

          dietaryPreferences:
            data.dietaryPreferences || [],

          allergies:
            data.allergies || [],

          dislikedFoods:
            data.dislikedFoods || [],

          favoriteCuisines:
            data.favoriteCuisines || [],

          cookingSkill:
            data.cookingSkill || '',

          maxCookingTime:
            data.maxCookingTime ?? '',
        });
      } catch (err) {
        setError(
          err.message ||
          'Unable to load profile.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);


  function updateField(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        preferredLanguage:
          profile.preferredLanguage,

        budgetPreference:
          profile.budgetPreference || null,

        dietaryPreferences:
          profile.dietaryPreferences,

        allergies:
          profile.allergies,

        dislikedFoods:
          profile.dislikedFoods,

        favoriteCuisines:
          profile.favoriteCuisines,

        cookingSkill:
          profile.cookingSkill || null,

        maxCookingTime:
          profile.maxCookingTime === ''
            ? null
            : Number(
                profile.maxCookingTime
              ),
      };

      const updated =
        await updateProfile(payload);

      setProfile({
        preferredLanguage:
          updated.preferredLanguage || 'en',

        budgetPreference:
          updated.budgetPreference || '',

        dietaryPreferences:
          updated.dietaryPreferences || [],

        allergies:
          updated.allergies || [],

        dislikedFoods:
          updated.dislikedFoods || [],

        favoriteCuisines:
          updated.favoriteCuisines || [],

        cookingSkill:
          updated.cookingSkill || '',

        maxCookingTime:
          updated.maxCookingTime ?? '',
      });

      setSuccess(
        'PROFILE PREFERENCES SAVED.'
      );
    } catch (err) {
      setError(
        err.message ||
        'Unable to save profile.'
      );
    } finally {
      setSaving(false);
    }
  }


  return (
    <>
      <Nav />

      <main className="mx-auto max-w-4xl p-5">
        <div className="my-6">
          <div className="mb-2 inline-block border-2 border-black bg-[#00ff41] px-2 py-1 text-xs font-bold">
            USER_CONFIGURATION
          </div>

          <h1 className="display text-6xl">
            PROFILE
          </h1>

          <p className="mt-2 text-sm">
            Configure preferences used when
            generating practical craving swaps.
          </p>
        </div>

        {loading ? (
          <section className="card">
            <p className="font-bold">
              LOADING PROFILE...
            </p>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="card space-y-6"
          >
            <div>
              <label
                htmlFor="language"
                className="mb-2 block font-bold"
              >
                PREFERRED LANGUAGE
              </label>

              <select
                id="language"
                className="field"
                value={
                  profile.preferredLanguage
                }
                onChange={(event) =>
                  updateField(
                    'preferredLanguage',
                    event.target.value
                  )
                }
              >
                <option value="en">
                  English
                </option>

                <option value="hi">
                  Hindi
                </option>

                <option value="mr">
                  Marathi
                </option>
              </select>
            </div>


            <div>
              <label
                htmlFor="budget"
                className="mb-2 block font-bold"
              >
                BUDGET PREFERENCE
              </label>

              <select
                id="budget"
                className="field"
                value={
                  profile.budgetPreference
                }
                onChange={(event) =>
                  updateField(
                    'budgetPreference',
                    event.target.value
                  )
                }
              >
                <option value="">
                  No preference
                </option>

                <option value="budget">
                  Budget
                </option>

                <option value="moderate">
                  Moderate
                </option>

                <option value="flexible">
                  Flexible
                </option>
              </select>
            </div>


            <PreferenceInput
              label="DIETARY PREFERENCES"
              value={
                profile.dietaryPreferences
              }
              placeholder="vegetarian, vegan"
              onChange={(value) =>
                updateField(
                  'dietaryPreferences',
                  value
                )
              }
            />


            <PreferenceInput
              label="ALLERGIES"
              value={profile.allergies}
              placeholder="peanuts, shellfish"
              onChange={(value) =>
                updateField(
                  'allergies',
                  value
                )
              }
            />


            <PreferenceInput
              label="DISLIKED FOODS"
              value={profile.dislikedFoods}
              placeholder="mushrooms, olives"
              onChange={(value) =>
                updateField(
                  'dislikedFoods',
                  value
                )
              }
            />


            <PreferenceInput
              label="FAVORITE CUISINES"
              value={profile.favoriteCuisines}
              placeholder="Indian, Mexican, Italian"
              onChange={(value) =>
                updateField(
                  'favoriteCuisines',
                  value
                )
              }
            />


            <div>
              <label
                htmlFor="skill"
                className="mb-2 block font-bold"
              >
                COOKING SKILL
              </label>

              <select
                id="skill"
                className="field"
                value={profile.cookingSkill}
                onChange={(event) =>
                  updateField(
                    'cookingSkill',
                    event.target.value
                  )
                }
              >
                <option value="">
                  Not specified
                </option>

                <option value="beginner">
                  Beginner
                </option>

                <option value="intermediate">
                  Intermediate
                </option>

                <option value="advanced">
                  Advanced
                </option>
              </select>
            </div>


            <div>
              <label
                htmlFor="maxCookingTime"
                className="mb-2 block font-bold"
              >
                MAX COOKING TIME
              </label>

              <input
                id="maxCookingTime"
                name="maxCookingTime"
                className="field"
                type="number"
                min="0"
                max="1440"
                placeholder="20"
                value={
                  profile.maxCookingTime
                }
                onChange={(event) =>
                  updateField(
                    'maxCookingTime',
                    event.target.value
                  )
                }
              />

              <p className="mt-1 text-xs">
                Time in minutes.
              </p>
            </div>


            {error && (
              <div
                role="alert"
                className="border-2 border-black bg-[#ff2a00] p-3 font-bold text-white"
              >
                {error}
              </div>
            )}


            {success && (
              <div
                role="status"
                className="border-2 border-black bg] p-3 font-bold"
              >
                {success}
              </div>
            )}


            <button
              type="submit"
              disabled={saving}
              className="btn w-full bg-[#00ff41] text-lg"
            >
              {saving
                ? 'SAVING...'
                : '[ SAVE PREFERENCES ]'}
            </button>


            <p className="border-t-2 border-black pt-4 text-xs">
              Preferences are used for general
              wellness suggestions. They are not
              medical advice.
            </p>
          </form>
        )}
      </main>
    </>
  );
}


function PreferenceInput({
  label,
  value,
  placeholder,
  onChange,
}) {
  const id = label
    .toLowerCase()
    .replaceAll(' ', '-');

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-bold"
      >
        {label}
      </label>

      <input
        id={id}
        className="field"
        type="text"
        value={listToText(value)}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            textToList(
              event.target.value
            )
          )
        }
      />

      <p className="mt-1 text-xs">
        Separate multiple values with commas.
      </p>
    </div>
  );
}
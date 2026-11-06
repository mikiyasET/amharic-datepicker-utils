# Amharic Date Picker Utils

Pure TypeScript utilities for Ethiopian (Amharic) calendar and time conversion. **Zero dependencies** — works on both backend and frontend, in any JavaScript runtime (Node.js, Deno, Bun, or modern browsers).

> This is the logic-only companion to [`amharic-datepicker`](https://www.npmjs.com/package/amharic-datepicker). If you need the React UI component, install `amharic-datepicker` instead (which depends on this package automatically).

[![npm version](https://img.shields.io/npm/v/amharic-datepicker-utils.svg)](https://www.npmjs.com/package/amharic-datepicker-utils)
[![license](https://img.shields.io/npm/l/amharic-datepicker-utils.svg)](https://github.com/mikiyasET/amharic-datepicker)
[![bundle size](https://img.shields.io/bundlephobia/minzip/amharic-datepicker-utils.svg)](https://bundlephobia.com/package/amharic-datepicker-utils)

---

## What's New in v1.1.0

- 🎯 **Fixed & Exact Astronomical Leap Year Algorithm**: Rewritten Julian Day Number (JDN) algorithms with 100% roundtrip consistency across all dates, eliminating edge-case shifts during Pagume 5 / 6 and Ethiopian New Year transitions.
- ⚡ **Overloaded Conversions**: `toEthiopian` now accepts standard JavaScript `Date` instances, ISO date strings, or year/month/day numbers.
- 📅 **Direct JS Date Generation**: New `toGregorianDate()` creates native JavaScript `Date` instances with optional time.
- 🎨 **Powerful Formatting Engine (`formatEthiopian`)**: Format dates with custom token patterns (`YYYY`, `MMMM`, `DD`, `dddd`, `GG`, `a`) or convenient presets (`'full'`, `'long'`, `'medium'`, `'short'`, `'iso'`, `'geez'`, `'datetime'`).
- 🔍 **Ethiopian Date String Parser (`parseEthiopianDate`)**: Parses ISO strings, DMY strings, textual Amharic month strings, English transliterations, and Ge'ez numerals.
- 🔢 **Ge'ez Numerals (`toGeez` & `fromGeez`)**: Convert between Arabic numbers and authentic Ethiopian Ge'ez numerals (e.g. `2017` ↔ `፳፻፲፯`).
- ⏳ **Date Math & Comparison**: `addDays`, `subDays`, `addMonths`, `subMonths`, `addYears`, `subYears`, `diffDays`, `compareEthDates`, `isBeforeEthDate`, `isAfterEthDate`, and `isSameEthDate`.
- 📆 **Day of the Week Helpers**: `getDayOfWeek(date)` and `getEthDayName(date, { locale: 'am' | 'en' })`.
- 🌐 **Multilingual Datasets**: Includes English transliterations (`ethMonthsEn`, `ethDaysEn`) and abbreviations (`ethMonthsShort`, `ethDaysShort`).
- ⚙️ **Configurable Time Periods**: Customize morning, afternoon, evening, and night thresholds in `getEthTimePeriod()`.

---

## Installation

```bash
# npm
npm install amharic-datepicker-utils

# yarn
yarn add amharic-datepicker-utils

# pnpm
pnpm add amharic-datepicker-utils

# bun
bun add amharic-datepicker-utils
```

---

## Quick Start

```typescript
import {
  toEthiopian,
  toGregorian,
  toGregorianDate,
  formatEthiopian,
  parseEthiopianDate,
  toGeez,
  addDays
} from 'amharic-datepicker-utils';

// 1. Convert current date
const eth = toEthiopian(new Date());
console.log(eth); // { year: 2017, month: 2, day: 27 }

// 2. Format with presets
console.log(formatEthiopian(eth, 'full'));
// "ረቡዕ፣ ጥቅምት 27 ቀን 2017 ዓ.ም"

console.log(formatEthiopian(eth, 'geez'));
// "ጥቅምት ፳፯ ቀን ፳፻፲፯ ዓ.ም"

// 3. Date Math
const nextWeek = addDays(eth, 7);
console.log(formatEthiopian(nextWeek, 'long'));
// "ኅዳር 4, 2017 ዓ.ም"

// 4. Convert back to JS Date
const jsDate = toGregorianDate(eth);
console.log(jsDate.toISOString());
```

---

## Date Conversion

### Gregorian → Ethiopian (`toEthiopian`)

Supports 3 numbers, a JavaScript `Date`, an ISO date string, or an object:

```typescript
import { toEthiopian } from 'amharic-datepicker-utils';

// From numbers (year, month, day)
const eth1 = toEthiopian(2023, 9, 12);
// { year: 2016, month: 1, day: 1 }

// From a Date object
const eth2 = toEthiopian(new Date());

// From an ISO string
const eth3 = toEthiopian('2023-09-12');

// From a GregDate object
const eth4 = toEthiopian({ year: 2023, month: 9, day: 12 });
```

### Ethiopian → Gregorian (`toGregorian` & `toGregorianDate`)

```typescript
import { toGregorian, toGregorianDate } from 'amharic-datepicker-utils';

// Returns { year, month, day }
const greg = toGregorian(2016, 1, 1);
// { year: 2023, month: 9, day: 12 }

const gregFromObj = toGregorian({ year: 2016, month: 1, day: 1 });

// Returns native JavaScript Date object with optional time
const dateObj = toGregorianDate(2016, 1, 1, 8, 30);
// Date: 2023-09-12T08:30:00
```

---

## Date Formatting (`formatEthiopian` / `formatEthDate`)

Format any Ethiopian date, Date object, or date string into human-readable text.

```typescript
import { formatEthiopian } from 'amharic-datepicker-utils';

const date = { year: 2017, month: 2, day: 27, hour: 3, minute: 30, ampm: 'ቀን' };

// Presets:
formatEthiopian(date, 'full');     // "ረቡዕ፣ ጥቅምት 27 ቀን 2017 ዓ.ም"
formatEthiopian(date, 'long');     // "ጥቅምት 27, 2017 ዓ.ም"
formatEthiopian(date, 'medium');   // "ጥቅምት 27, 2017"
formatEthiopian(date, 'short');    // "27/02/2017"
formatEthiopian(date, 'iso');      // "2017-02-27"
formatEthiopian(date, 'geez');     // "ጥቅምት ፳፯ ቀን ፳፻፲፯ ዓ.ም"
formatEthiopian(date, 'time');     // "ጠዋት 3:30"
formatEthiopian(date, 'datetime'); // "ጥቅምት 27, 2017 ዓ.ም (ጠዋት 3:30)"

// English transliteration:
formatEthiopian(date, 'full', { locale: 'en' });
// "Rebue, Tikimt 27, 2017 A.M."

// Custom Patterns (use [brackets] to escape raw text):
formatEthiopian(date, 'dddd [በ] MMMM D [ቀን] YYYY [ዓ.ም]');
// "ረቡዕ በ ጥቅምት 27 ቀን 2017 ዓ.ም"
```

### Supported Format Tokens

| Token | Meaning | Example |
|---|---|---|
| `YYYY` | 4-digit Ethiopian year | `2017` |
| `YY` | 2-digit Ethiopian year | `17` |
| `GG` | Ge'ez numeral year | `፳፻፲፯` |
| `G` | Ge'ez numeral day | `፳፯` |
| `MMMM` | Full month name | `ጥቅምት` (or `Tikimt`) |
| `MMM` | Short month name | `ጥቅም` (or `Tik`) |
| `MM` | 2-digit month | `02` |
| `M` | 1-digit month | `2` |
| `DD` | 2-digit day | `07` |
| `D` | 1-digit day | `7` |
| `dddd` | Full day of the week | `ረቡዕ` (or `Rebue`) |
| `ddd` | Short day of the week | `ረቡ` (or `Reb`) |
| `ERA` | Era label | `ዓ.ም` (or `A.M.`) |
| `hh` | 2-digit 12-hour clock | `03` |
| `h` | 1-digit 12-hour clock | `3` |
| `mm` | 2-digit minute | `30` |
| `ss` | 2-digit second | `00` |
| `a` | Ethiopian time period | `ጠዋት` / `ከሰዓት` / `ምሽት` / `ሌሊት` |
| `A` | Ethiopian AM/PM | `ቀን` / `ማታ` |
| `[...]` | Escaped literal text | `[ቀን]` |

---

## Date Parsing (`parseEthiopianDate`)

Parses Ethiopian date strings in multiple formats:

```typescript
import { parseEthiopianDate } from 'amharic-datepicker-utils';

parseEthiopianDate('2017-02-27');           // { year: 2017, month: 2, day: 27 }
parseEthiopianDate('27/02/2017');           // { year: 2017, month: 2, day: 27 }
parseEthiopianDate('ጥቅምት 27, 2017 ዓ.ም');    // { year: 2017, month: 2, day: 27 }
parseEthiopianDate('Tikimt 27 2017');       // { year: 2017, month: 2, day: 27 }
parseEthiopianDate('ጥቅምት ፳፯ ፳፻፲፯');        // { year: 2017, month: 2, day: 27 }
```

---

## Ge'ez Numeral Conversion (`toGeez` & `fromGeez`)

Convert Arabic numbers to traditional Ge'ez numbers and vice versa:

```typescript
import { toGeez, fromGeez } from 'amharic-datepicker-utils';

toGeez(1);       // "፩"
toGeez(7);       // "፯"
toGeez(10);      // "፲"
toGeez(27);      // "፳፯"
toGeez(100);     // "፻"
toGeez(2017);    // "፳፻፲፯"
toGeez(2026);    // "፳፻፳፮"

fromGeez('፳፻፲፯'); // 2017
fromGeez('፳፯');   // 27
fromGeez('፻');    // 100
```

---

## Date Arithmetic & Comparison

Perform fast, exact math on Ethiopian dates:

```typescript
import {
  addDays,
  subDays,
  addMonths,
  addYears,
  diffDays,
  compareEthDates,
  isBeforeEthDate,
  isAfterEthDate,
  isSameEthDate
} from 'amharic-datepicker-utils';

const start = { year: 2017, month: 2, day: 25 };

// Add/Subtract days (handles month & leap year boundaries seamlessly)
const plus10 = addDays(start, 10); // { year: 2017, month: 3, day: 5 }
const minus5 = subDays(start, 5);  // { year: 2017, month: 2, day: 20 }

// Add/Subtract months and years
const nextMonth = addMonths(start, 1); // { year: 2017, month: 3, day: 25 }
const nextYear = addYears(start, 1);   // { year: 2018, month: 2, day: 25 }

// Differences in days
const diff = diffDays(plus10, start); // 10

// Comparison
compareEthDates(start, plus10); // -1 (start < plus10)
isBeforeEthDate(start, plus10); // true
isAfterEthDate(plus10, start);  // true
isSameEthDate(start, start);    // true
```

---

## Time Conversion & Custom Periods

Convert between the Ethiopian 12-hour clock and the 24-hour standard clock:

```typescript
import {
  toEthiopianTime,
  toGregorianTime,
  getEthTimePeriod
} from 'amharic-datepicker-utils';

// Gregorian 7:30 AM → Ethiopian time
toEthiopianTime(7, 30);
// { hour: 1, minute: 30, ampm: 'ቀን' }

// Ethiopian 6:00 ማታ → Gregorian time
toGregorianTime(6, 0, 'ማታ');
// { hour: 0, minute: 0 } (Midnight)

// Ethiopian Time Period labels:
getEthTimePeriod(7);  // "ጠዋት"
getEthTimePeriod(14); // "ከሰዓት"
getEthTimePeriod(19); // "ምሽት"
getEthTimePeriod(2);  // "ሌሊት"

// Configurable period thresholds:
getEthTimePeriod(17, { eveningStart: 16 }); // "ምሽት"
```

---

## Day of the Week & Month Data

```typescript
import {
  getDayOfWeek,
  getEthDayName,
  getFirstDayOfMonth,
  getDaysInMonth,
  isEthiopianLeapYear,
  ethMonths,
  ethDays,
  ethMonthsEn,
  ethDaysEn
} from 'amharic-datepicker-utils';

// Day of week (0=Sunday / እሑድ, 6=Saturday / ቅዳሜ)
getDayOfWeek(2017, 2, 27); // 3 (Wednesday / ረቡዕ)
getEthDayName(2017, 2, 27); // "ረቡዕ"
getEthDayName(2017, 2, 27, { locale: 'en' }); // "Rebue"

// Month lengths & Leap Years:
getDaysInMonth(2017, 1);  // 30
getDaysInMonth(2015, 13); // 6 (leap year)
getDaysInMonth(2016, 13); // 5 (regular year)

isEthiopianLeapYear(2015); // true
isEthiopianLeapYear(2016); // false
```

---

## API Reference

### Core Conversions

| Function | Signature | Description |
|---|---|---|
| `toEthiopian` | `(Date \| string \| GregDate \| y, m, d) → EthDate` | Converts Gregorian date to Ethiopian date |
| `toGregorian` | `(EthDate \| y, m, d) → GregDate` | Converts Ethiopian date to Gregorian `{ year, month, day }` |
| `toGregorianDate` | `(EthDate \| y, m, d, h?, m?, s?) → Date` | Converts Ethiopian date to native JavaScript `Date` instance |

### Formatting & Parsing

| Function | Signature | Description |
|---|---|---|
| `formatEthiopian` | `(date, preset \| pattern?, options?) → string` | Formats Ethiopian dates with tokens or presets |
| `formatEthDate` | `(date, preset \| pattern?, options?) → string` | Convenient alias for `formatEthiopian` |
| `parseEthiopianDate` | `(dateString) → EthDate \| null` | Parses ISO, DMY, Amharic, or transliterated dates |
| `toGeez` | `(number) → string` | Converts number to Ge'ez numeral (e.g. `፳፻፲፯`) |
| `fromGeez` | `(geezString) → number` | Converts Ge'ez numeral back to number |

### Date Math & Logic

| Function | Signature | Description |
|---|---|---|
| `addDays` / `subDays` | `(ethDate, days) → EthDate` | Adds or subtracts days across months/years |
| `addMonths` / `subMonths` | `(ethDate, months) → EthDate` | Adds or subtracts months |
| `addYears` / `subYears` | `(ethDate, years) → EthDate` | Adds or subtracts years |
| `diffDays` | `(date1, date2) → number` | Day difference between two Ethiopian dates |
| `compareEthDates` | `(date1, date2) → -1 \| 0 \| 1` | Compares two dates |
| `isSameEthDate` | `(date1, date2) → boolean` | Returns `true` if year, month, and day match |
| `isBeforeEthDate` | `(date1, date2) → boolean` | Returns `true` if `date1` is before `date2` |
| `isAfterEthDate` | `(date1, date2) → boolean` | Returns `true` if `date1` is after `date2` |
| `isValidEthDate` | `(y, m, d \| EthDate) → boolean` | Validates month range and days in month |

### Time & Day Helpers

| Function / Constant | Description |
|---|---|
| `toEthiopianTime(h, m)` | Gregorian 24h to Ethiopian 12h clock |
| `toGregorianTime(h, m, ampm)` | Ethiopian 12h clock to Gregorian 24h |
| `getEthTimePeriod(hour, config?)` | Returns `'ጠዋት'` \| `'ከሰዓት'` \| `'ምሽት'` \| `'ሌሊት'` |
| `getDayOfWeek(date \| y, m, d)` | Day of week index (0 = Sunday, 6 = Saturday) |
| `getEthDayName(date, options?)` | Localized day name (Amharic or English) |
| `getFirstDayOfMonth(y, m)` | Day of week for the 1st of an Ethiopian month |
| `isEthiopianLeapYear(year)` | Whether the year is a leap year (Pagume has 6 days) |
| `getDaysInMonth(year, month)` | Days in an Ethiopian month (30, or 5/6 for Pagume) |

### Datasets Exported

| Constant | Description |
|---|---|
| `ethMonths` | `['መስከረም', 'ጥቅምት', ... 'ጳጉሜ']` (13 months) |
| `ethMonthsEn` | `['Meskerem', 'Tikimt', ... 'Pagume']` |
| `ethMonthsShort` | `['መስከ', 'ጥቅም', ... 'ጳጉ']` |
| `ethDays` | `['እሑድ', 'ሰኞ', ... 'ቅዳሜ']` (7 days) |
| `ethDaysEn` | `['Ehud', 'Segno', ... 'Kidame']` |
| `ethDaysShort` | `['እሑ', 'ሰኞ', ... 'ቅዳ']` |
| `ethAMPMs` | `['ቀን', 'ማታ']` |
| `gregMonths` | `['January', 'February', ... 'December']` |
| `gregDays` | `['Sunday', 'Monday', ... 'Saturday']` |
| `gregAMPMs` | `['AM', 'PM']` |

---

## Running the Example Locally

```bash
cd amharic-datepicker-utils
npm install
npm run build
npm test

cd example
npm install
npm start
```

---

## License

ISC

## Author & Credits

- **Developer:** [Mikiyas Lemlemu](https://t.me/mikiDev)
- **Powered by:** [Codeabay](https://codeabay.com) (A professional software development solutions provider)

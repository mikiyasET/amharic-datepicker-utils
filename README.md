# Amharic Date Picker Utils

Pure TypeScript utilities for Ethiopian (Amharic) calendar and time conversion. **Zero dependencies** — works on both backend and frontend, in any JavaScript runtime (Node.js, Deno, Bun, or browsers).

> This is the logic-only companion to [`amharic-datepicker`](https://www.npmjs.com/package/amharic-datepicker). If you need the React UI component, install `amharic-datepicker` instead (which depends on this package automatically).

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

## Quick Start

```javascript
import { toEthiopian, toGregorian, toEthiopianTime, getEthTimePeriod, ethMonths } from 'amharic-datepicker-utils';

// Convert today's date to Ethiopian
const now = new Date();
const ethDate = toEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());
console.log(`${ethMonths[ethDate.month - 1]} ${ethDate.day}, ${ethDate.year}`);
// e.g. "ግንቦት 26, 2018"

// Convert the current time to Ethiopian
const ethTime = toEthiopianTime(now.getHours(), now.getMinutes());
console.log(`${getEthTimePeriod(now.getHours())} ${ethTime.hour}:${String(ethTime.minute).padStart(2, '0')}`);
// e.g. "ከሰዓት 3:56"

// Convert Ethiopian date back to Gregorian
const greg = toGregorian(ethDate.year, ethDate.month, ethDate.day);
console.log(`${greg.year}-${greg.month}-${greg.day}`);
// e.g. "2026-6-2"
```

## Date Conversion

Convert between Gregorian and Ethiopian calendars:

```typescript
import { toEthiopian, toGregorian } from 'amharic-datepicker-utils';

// Gregorian → Ethiopian
const ethDate = toEthiopian(2023, 9, 12);
console.log(ethDate); // { year: 2016, month: 1, day: 1 }

// Ethiopian → Gregorian
const gregDate = toGregorian(2016, 1, 1);
console.log(gregDate); // { year: 2023, month: 9, day: 12 }
```

## Time Conversion

Convert between the Ethiopian 12-hour clock and the Gregorian (standard) clock:

```typescript
import {
  toEthiopianTime,
  toGregorianTime,
  getEthTimePeriod
} from 'amharic-datepicker-utils';

// Gregorian 7:30 AM → Ethiopian time
const ethTime = toEthiopianTime(7, 30);
console.log(ethTime); // { hour: 1, minute: 30, ampm: 'ቀን' }

// Ethiopian 6:00 ማታ → Gregorian time
const gregTime = toGregorianTime(6, 0, 'ማታ');
console.log(gregTime); // { hour: 0, minute: 0 } (12:00 AM Midnight Gregorian)

// Get Ethiopian time period label from a Gregorian hour
console.log(getEthTimePeriod(7));  // "ጠዋት"
console.log(getEthTimePeriod(14)); // "ከሰዓት"
console.log(getEthTimePeriod(19)); // "ምሽት"
console.log(getEthTimePeriod(2));  // "ሌሊት"
```

## Calendar Data

Access Ethiopian month names, day names, and helper functions:

```typescript
import {
  ethMonths,
  ethDays,
  ethAMPMs,
  getDaysInMonth,
  getFirstDayOfMonth,
  isEthiopianLeapYear
} from 'amharic-datepicker-utils';

console.log(ethMonths[0]);  // "መስከረም"
console.log(ethDays[0]);    // "እሑድ"
console.log(ethAMPMs);      // ['ቀን', 'ማታ']

// Check leap year
console.log(isEthiopianLeapYear(2015)); // true

// Days in month (months 1-12 = 30 days, month 13 = 5 or 6)
console.log(getDaysInMonth(2016, 1));  // 30
console.log(getDaysInMonth(2015, 13)); // 6 (leap year)
console.log(getDaysInMonth(2016, 13)); // 5

// Get the day of the week (0=Sunday) for the first day of an Ethiopian month
console.log(getFirstDayOfMonth(2016, 1)); // Day of week for Meskerem 1, 2016
```

## Gregorian Helpers

Gregorian-side utilities are also included:

```typescript
import {
  gregMonths,
  gregDays,
  gregAMPMs,
  getGregFirstDayOfMonth,
  getGregDaysInMonth,
  toGregorianTime12h,
  toGregorianTime24h
} from 'amharic-datepicker-utils';

console.log(gregMonths[0]); // "January"
console.log(gregDays[0]);   // "Sunday"

// 24h → 12h
const t12 = toGregorianTime12h(14);
console.log(t12); // { hour: 2, ampm: 'PM' }

// 12h → 24h
const t24 = toGregorianTime24h(2, 'PM');
console.log(t24); // 14
```

## API Reference

### Date Conversion

| Function | Signature | Description |
|----------|-----------|-------------|
| `toEthiopian` | `(gregYear, gregMonth, gregDay) → { year, month, day }` | Gregorian to Ethiopian |
| `toGregorian` | `(ethYear, ethMonth, ethDay) → { year, month, day }` | Ethiopian to Gregorian |

### Time Conversion

| Function | Signature | Description |
|----------|-----------|-------------|
| `toEthiopianTime` | `(gregHour, gregMinute) → { hour, minute, ampm }` | Gregorian hour/min to Ethiopian 12h clock |
| `toGregorianTime` | `(ethHour, ethMinute, ampm) → { hour, minute }` | Ethiopian 12h clock to Gregorian 24h |
| `getEthTimePeriod` | `(gregHour) → EthTimePeriod` | Returns `'ጠዋት'`\|`'ከሰዓት'`\|`'ምሽት'`\|`'ሌሊት'` |
| `toGregorianTime12h` | `(hour24) → { hour, ampm }` | 24h → 12h Gregorian |
| `toGregorianTime24h` | `(hour12, ampm) → number` | 12h → 24h Gregorian |

### Calendar Helpers

| Function / Constant | Description |
|---------------------|-------------|
| `ethMonths` | Array of 13 Ethiopian month names |
| `ethDays` | Array of 7 Ethiopian day names |
| `ethAMPMs` | `['ቀን', 'ማታ']` |
| `gregMonths` | Array of 12 Gregorian month names |
| `gregDays` | Array of 7 Gregorian day names |
| `gregAMPMs` | `['AM', 'PM']` |
| `getDaysInMonth(year, month)` | Days in an Ethiopian month (30 or 5/6 for Pagume) |
| `getFirstDayOfMonth(year, month)` | Day of week for the 1st of an Ethiopian month |
| `isEthiopianLeapYear(year)` | Whether the Ethiopian year is a leap year |
| `getGregDaysInMonth(year, month)` | Days in a Gregorian month |
| `getGregFirstDayOfMonth(year, month)` | Day of week for the 1st of a Gregorian month |

### Types

```typescript
type EthAMPM = 'ቀን' | 'ማታ';
type EthTimePeriod = 'ጠዋት' | 'ከሰዓት' | 'ምሽት' | 'ሌሊት';
type GregAMPM = 'AM' | 'PM';
```

### Low-Level JDN Functions

For advanced use cases, Julian Day Number converters are also exported:

```typescript
import { gregToJDN, jdnToGreg, ethToJDN, jdnToEth } from 'amharic-datepicker-utils';
```

## Use Cases

- **Backend date storage**: Store Ethiopian dates and convert on the fly
- **API development**: Accept/return dates in both calendar systems
- **CLI tools**: Build command-line tools that work with Ethiopian dates
- **Shared logic**: Use the same conversion logic across frontend and backend

## Running the Example Locally

An example Node.js script is included in the `example` folder that demonstrates all major features.

1. Clone this repository.
2. Run `npm install` in the `amharic-datepicker-utils` root directory.
3. Run `npm run build` to build the package.
4. Navigate to `cd example`.
5. Run `npm install`.
6. Run `npm start` to execute the example.

**Expected output:**

```
══════════════════════════════════════════════════
  Today's Date
══════════════════════════════════════════════════
  Gregorian : 2026-6-2
  Ethiopian : 2018-9-26
             ግንቦት 26, 2018

══════════════════════════════════════════════════
  Date Conversion
══════════════════════════════════════════════════
  Gregorian 2023-09-12  →  Ethiopian 2016-1-1
  Ethiopian 2016-01-01  →  Gregorian 2023-9-12
  Round-trip: 2023-09-12 → Eth → Greg = 2023-9-12 ✓

══════════════════════════════════════════════════
  Time Conversion
══════════════════════════════════════════════════
  Gregorian 7:30 AM               →  Ethiopian ጠዋት 1:30 ቀን
  Gregorian 2:00 PM               →  Ethiopian ከሰዓት 8:00 ቀን
  Gregorian 12:15 AM (midnight)   →  Ethiopian ሌሊት 6:15 ማታ
  Gregorian 6:45 PM               →  Ethiopian ምሽት 12:45 ማታ

✅ All examples completed successfully!
```

## License

ISC

---

## Author & Credits

- **Developer:** [Mikiyas Lemlemu](https://t.me/mikiDev)
- **Powered by:** [Codeabay](https://codeabay.com) (A professional software development solutions provider)

import {
  toEthiopian,
  toGregorian,
  toGregorianDate,
  toEthiopianTime,
  toGregorianTime,
  getEthTimePeriod,
  ethMonths,
  ethMonthsEn,
  ethDays,
  ethDaysEn,
  ethAMPMs,
  getDaysInMonth,
  isEthiopianLeapYear,
  getDayOfWeek,
  getEthDayName,
  formatEthiopian,
  parseEthiopianDate,
  toGeez,
  fromGeez,
  addDays,
  diffDays,
  toGregorianTime12h,
} from 'amharic-datepicker-utils';

// ─── Helper ──────────────────────────────────────────────────────
const divider = (title) => console.log(`\n${'═'.repeat(50)}\n  ${title}\n${'═'.repeat(50)}`);

// ─── 1. Today's Date ─────────────────────────────────────────────
divider("Today's Date");

const now = new Date();
const ethToday = toEthiopian(now);

console.log(`  Gregorian : ${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`);
console.log(`  Ethiopian : ${ethToday.year}-${ethToday.month}-${ethToday.day}`);
console.log(`  Full Format: ${formatEthiopian(now, 'full')}`);
console.log(`  Ge'ez Style: ${formatEthiopian(now, 'geez')}`);

// ─── 2. Date Conversion (Overloaded Support) ──────────────────────
divider('Date Conversion');

// Passing numbers
const eth = toEthiopian(2023, 9, 12);
console.log(`  Gregorian 2023-09-12 (numbers)   →  Ethiopian ${eth.year}-${eth.month}-${eth.day}`);

// Passing Date instance
const ethFromDate = toEthiopian(new Date(2023, 8, 12));
console.log(`  Gregorian Date instance          →  Ethiopian ${ethFromDate.year}-${ethFromDate.month}-${ethFromDate.day}`);

// Passing ISO string
const ethFromISO = toEthiopian('2023-09-12');
console.log(`  Gregorian ISO string             →  Ethiopian ${ethFromISO.year}-${ethFromISO.month}-${ethFromISO.day}`);

// Ethiopian to Gregorian
const greg = toGregorian(2016, 1, 1);
console.log(`  Ethiopian 2016-01-01             →  Gregorian ${greg.year}-${greg.month}-${greg.day}`);

// Direct conversion to JavaScript Date object
const jsDate = toGregorianDate(2016, 1, 1, 8, 30);
console.log(`  toGregorianDate(2016, 1, 1, 8:30) →  JS Date: ${jsDate.toISOString()}`);

// Round-trip check
const roundTrip = toGregorian(eth);
console.log(`  Round-trip: 2023-09-12 → Eth → Greg = ${roundTrip.year}-${roundTrip.month}-${roundTrip.day} ✓`);

// ─── 3. Time Conversion ─────────────────────────────────────────
divider('Time Conversion');

const times = [
  { h: 7, m: 30, label: '7:30 AM' },
  { h: 14, m: 0, label: '2:00 PM' },
  { h: 0, m: 15, label: '12:15 AM (midnight)' },
  { h: 18, m: 45, label: '6:45 PM' },
];

for (const t of times) {
  const ethTime = toEthiopianTime(t.h, t.m);
  const period = getEthTimePeriod(t.h);
  console.log(`  Gregorian ${t.label.padEnd(22)} →  Ethiopian ${period} ${ethTime.hour}:${String(ethTime.minute).padStart(2, '0')} ${ethTime.ampm}`);
}

console.log();

// Ethiopian → Gregorian time
const ethTimes = [
  { h: 1, m: 30, ampm: 'ቀን' },
  { h: 6, m: 0, ampm: 'ማታ' },
  { h: 12, m: 0, ampm: 'ቀን' },
];

for (const t of ethTimes) {
  const gregTime = toGregorianTime(t.h, t.m, t.ampm);
  const g12 = toGregorianTime12h(gregTime.hour);
  console.log(`  Ethiopian ${t.ampm} ${t.h}:${String(t.m).padStart(2, '0')}  →  Gregorian ${g12.hour}:${String(gregTime.minute).padStart(2, '0')} ${g12.ampm} (${gregTime.hour}:${String(gregTime.minute).padStart(2, '0')} 24h)`);
}

// ─── 4. Ge'ez Numeral Conversions ────────────────────────────────
divider("Ge'ez Numeral Conversions");

console.log(`  Number 1    →  ${toGeez(1)}`);
console.log(`  Number 27   →  ${toGeez(27)}`);
console.log(`  Number 100  →  ${toGeez(100)}`);
console.log(`  Number 2017 →  ${toGeez(2017)}`);
console.log(`  Number 2026 →  ${toGeez(2026)}`);
console.log(`  Parse ፳፻፲፯   →  ${fromGeez('፳፻፲፯')} (number)`);

// ─── 5. Date Parsing & Formatting ────────────────────────────────
divider('Date Parsing & Formatting');

const parsed = parseEthiopianDate('ጥቅምት 27, 2017 ዓ.ም');
console.log(`  Parsed 'ጥቅምት 27, 2017 ዓ.ም'   →`, parsed);

console.log(`  Preset 'full'     : ${formatEthiopian(parsed, 'full')}`);
console.log(`  Preset 'long'     : ${formatEthiopian(parsed, 'long')}`);
console.log(`  Preset 'short'    : ${formatEthiopian(parsed, 'short')}`);
console.log(`  Preset 'geez'     : ${formatEthiopian(parsed, 'geez')}`);
console.log(`  Locale 'en'       : ${formatEthiopian(parsed, 'full', { locale: 'en' })}`);
console.log(`  Custom Pattern    : ${formatEthiopian(parsed, 'dddd [በ] MMMM D [ቀን]')}`);

// ─── 6. Date Arithmetic & Day of the Week ────────────────────────
divider('Date Arithmetic & Day of the Week');

const baseDate = { year: 2017, month: 2, day: 25 };
const plus10 = addDays(baseDate, 10);
console.log(`  Base Date      : ${formatEthiopian(baseDate, 'long')}`);
console.log(`  +10 Days       : ${formatEthiopian(plus10, 'long')} (Crossed month boundary)`);
console.log(`  Diff in Days   : ${diffDays(plus10, baseDate)} days`);
console.log(`  Day of Week    : ${getEthDayName(plus10)} (${getEthDayName(plus10, { locale: 'en' })})`);

// ─── 7. Calendar Data & Leap Years ───────────────────────────────
divider('Leap Year Check');
for (let y = 2015; y <= 2027; y++) {
  const leap = isEthiopianLeapYear(y);
  const pagumeDays = getDaysInMonth(y, 13);
  console.log(`  ${y} : ${leap ? '✓ Leap Year' : '  Regular  '} (Pagume has ${pagumeDays} days)`);
}

console.log('\n✅ All examples completed successfully!\n');

import {
  toEthiopian,
  toGregorian,
  toEthiopianTime,
  toGregorianTime,
  getEthTimePeriod,
  ethMonths,
  ethDays,
  ethAMPMs,
  getDaysInMonth,
  isEthiopianLeapYear,
  toGregorianTime12h,
  toGregorianTime24h,
} from 'amharic-datepicker-utils';

// ─── Helper ──────────────────────────────────────────────────────
const divider = (title) => console.log(`\n${'═'.repeat(50)}\n  ${title}\n${'═'.repeat(50)}`);

// ─── 1. Today's Date ─────────────────────────────────────────────
divider("Today's Date");

const now = new Date();
const gregToday = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
const ethToday = toEthiopian(gregToday.year, gregToday.month, gregToday.day);

console.log(`  Gregorian : ${gregToday.year}-${gregToday.month}-${gregToday.day}`);
console.log(`  Ethiopian : ${ethToday.year}-${ethToday.month}-${ethToday.day}`);
console.log(`             ${ethMonths[ethToday.month - 1]} ${ethToday.day}, ${ethToday.year}`);

// ─── 2. Date Conversion ─────────────────────────────────────────
divider('Date Conversion');

const eth = toEthiopian(2023, 9, 12);
console.log(`  Gregorian 2023-09-12  →  Ethiopian ${eth.year}-${eth.month}-${eth.day}`);

const greg = toGregorian(2016, 1, 1);
console.log(`  Ethiopian 2016-01-01  →  Gregorian ${greg.year}-${greg.month}-${greg.day}`);

// Round-trip check
const roundTrip = toGregorian(eth.year, eth.month, eth.day);
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

// ─── 4. Ethiopian Calendar Data ──────────────────────────────────
divider('Ethiopian Months');
ethMonths.forEach((name, i) => {
  const monthNum = i + 1;
  const days = getDaysInMonth(ethToday.year, monthNum);
  console.log(`  ${String(monthNum).padStart(2)} ${name.padEnd(6)}  (${days} days)`);
});

divider('Ethiopian Days of the Week');
ethDays.forEach((name, i) => console.log(`  ${i} = ${name}`));

divider('Ethiopian AM/PM');
console.log(`  ${ethAMPMs.join(' / ')}`);

// ─── 5. Leap Year Check ─────────────────────────────────────────
divider('Leap Year Check');
for (let y = 2015; y <= 2027; y++) {
  const leap = isEthiopianLeapYear(y);
  const pagumeDays = getDaysInMonth(y, 13);
  console.log(`  ${y} : ${leap ? '✓ Leap Year' : '  Regular  '} (Pagume has ${pagumeDays} days)`);
}

// ─── 6. Backend Use Case: Date Range ────────────────────────────
divider('Backend Use Case: Generate Ethiopian Date Range');

function ethAddDays(year, month, day, daysToAdd) {
  const greg = toGregorian(year, month, day);
  const d = new Date(greg.year, greg.month - 1, greg.day);
  d.setDate(d.getDate() + daysToAdd);
  return toEthiopian(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

console.log(`  Next 7 days starting from ${ethMonths[ethToday.month - 1]} ${ethToday.day}, ${ethToday.year}:`);
for (let i = 0; i < 7; i++) {
  const d = ethAddDays(ethToday.year, ethToday.month, ethToday.day, i);
  const gd = toGregorian(d.year, d.month, d.day);
  const dayName = ethDays[new Date(gd.year, gd.month - 1, gd.day).getDay()];
  console.log(`    ${dayName.padEnd(5)}  ${ethMonths[d.month - 1]} ${d.day}, ${d.year}  (${gd.year}-${gd.month}-${gd.day})`);
}

console.log('\n✅ All examples completed successfully!\n');

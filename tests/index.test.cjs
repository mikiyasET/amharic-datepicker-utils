const assert = require('node:assert');
const test = require('node:test');

const u = require('../dist/index.js');

test('Core Date Conversions - 3-argument & Overloaded calls', () => {
  // 1. Numbers
  const eth1 = u.toEthiopian(2023, 9, 12);
  assert.deepStrictEqual(eth1, { year: 2016, month: 1, day: 1 });

  // 2. Date object
  const d = new Date(2023, 8, 12); // September is month 8 (0-indexed)
  const eth2 = u.toEthiopian(d);
  assert.deepStrictEqual(eth2, { year: 2016, month: 1, day: 1 });

  // 3. ISO string
  const eth3 = u.toEthiopian('2023-09-12');
  assert.deepStrictEqual(eth3, { year: 2016, month: 1, day: 1 });

  // 4. Object
  const eth4 = u.toEthiopian({ year: 2023, month: 9, day: 12 });
  assert.deepStrictEqual(eth4, { year: 2016, month: 1, day: 1 });

  // 5. toGregorian from object
  const greg1 = u.toGregorian({ year: 2016, month: 1, day: 1 });
  assert.deepStrictEqual(greg1, { year: 2023, month: 9, day: 12 });

  // 6. toGregorian from numbers
  const greg2 = u.toGregorian(2016, 1, 1);
  assert.deepStrictEqual(greg2, { year: 2023, month: 9, day: 12 });
});

test('toGregorianDate returns actual JS Date', () => {
  const jsDate = u.toGregorianDate(2017, 2, 27, 8, 30);
  assert.ok(jsDate instanceof Date);
  assert.strictEqual(jsDate.getFullYear(), 2024);
  assert.strictEqual(jsDate.getMonth() + 1, 11);
  assert.strictEqual(jsDate.getDate(), 6);
  assert.strictEqual(jsDate.getHours(), 8);
  assert.strictEqual(jsDate.getMinutes(), 30);

  // With Ethiopian 12-hour AM/PM
  const jsDateEthTime = u.toGregorianDate({
    year: 2017,
    month: 2,
    day: 27,
    hour: 2,
    minute: 30,
    ampm: 'ቀን',
  });
  assert.strictEqual(jsDateEthTime.getHours(), 8);
  assert.strictEqual(jsDateEthTime.getMinutes(), 30);
});

test('Leap Year & Pagume Transitions', () => {
  // 2015 ዓ.ም is leap (6 days of Pagume)
  assert.strictEqual(u.isEthiopianLeapYear(2015), true);
  assert.strictEqual(u.getDaysInMonth(2015, 13), 6);

  // 2016 ዓ.ም is regular (5 days)
  assert.strictEqual(u.isEthiopianLeapYear(2016), false);
  assert.strictEqual(u.getDaysInMonth(2016, 13), 5);

  // Pagume 6 in 2015 = Sep 11, 2023
  const p6 = u.toEthiopian(2023, 9, 11);
  assert.deepStrictEqual(p6, { year: 2015, month: 13, day: 6 });
  const backP6 = u.toGregorian(2015, 13, 6);
  assert.deepStrictEqual(backP6, { year: 2023, month: 9, day: 11 });

  // Meskerem 1, 2016 = Sep 12, 2023
  const m1 = u.toEthiopian(2023, 9, 12);
  assert.deepStrictEqual(m1, { year: 2016, month: 1, day: 1 });

  // Pagume 5 in 2016 = Sep 10, 2024
  const p5 = u.toEthiopian(2024, 9, 10);
  assert.deepStrictEqual(p5, { year: 2016, month: 13, day: 5 });

  // Meskerem 1, 2017 = Sep 11, 2024
  const m1_2017 = u.toEthiopian(2024, 9, 11);
  assert.deepStrictEqual(m1_2017, { year: 2017, month: 1, day: 1 });
});

test('Continuous 10,000-Day Roundtrip Consistency', () => {
  const start = new Date(1990, 0, 1);
  const current = new Date(start);
  for (let i = 0; i < 10000; i++) {
    const gy = current.getFullYear();
    const gm = current.getMonth() + 1;
    const gd = current.getDate();

    const eth = u.toEthiopian(gy, gm, gd);
    const back = u.toGregorian(eth.year, eth.month, eth.day);

    assert.strictEqual(back.year, gy);
    assert.strictEqual(back.month, gm);
    assert.strictEqual(back.day, gd);

    current.setDate(current.getDate() + 1);
  }
});

test('Day of Week & Day Names', () => {
  // 2016 Meskerem 1 (Sep 12, 2023) was Tuesday (ማክሰኞ = 2)
  const dow = u.getDayOfWeek(2016, 1, 1);
  assert.strictEqual(dow, 2);
  assert.strictEqual(u.getFirstDayOfMonth(2016, 1), 2);
  assert.strictEqual(u.getEthDayName(2016, 1, 1), 'ማክሰኞ');
  assert.strictEqual(u.getEthDayName(2016, 1, 1, { locale: 'en' }), 'Maksegno');
  assert.strictEqual(u.getEthDayName({ year: 2016, month: 1, day: 1 }, { locale: 'en', short: true }), 'Mak');
});

test('Ge\'ez Numeral Conversions', () => {
  assert.strictEqual(u.toGeez(1), '፩');
  assert.strictEqual(u.toGeez(7), '፯');
  assert.strictEqual(u.toGeez(10), '፲');
  assert.strictEqual(u.toGeez(15), '፲፭');
  assert.strictEqual(u.toGeez(27), '፳፯');
  assert.strictEqual(u.toGeez(100), '፻');
  assert.strictEqual(u.toGeez(2017), '፳፻፲፯');
  assert.strictEqual(u.toGeez(2026), '፳፻፳፮');

  assert.strictEqual(u.fromGeez('፩'), 1);
  assert.strictEqual(u.fromGeez('፳፯'), 27);
  assert.strictEqual(u.fromGeez('፻'), 100);
  assert.strictEqual(u.fromGeez('፳፻፲፯'), 2017);
});

test('Date Arithmetic & Comparisons', () => {
  const d = { year: 2017, month: 2, day: 25 };

  // addDays & subDays
  const plus5 = u.addDays(d, 5); // 25 + 5 = 30
  assert.deepStrictEqual(plus5, { year: 2017, month: 2, day: 30 });

  const plus6 = u.addDays(d, 6); // Crosses to month 3, day 1
  assert.deepStrictEqual(plus6, { year: 2017, month: 3, day: 1 });

  const minus5 = u.subDays(plus5, 5);
  assert.deepStrictEqual(minus5, d);

  // diffDays
  assert.strictEqual(u.diffDays(plus6, d), 6);
  assert.strictEqual(u.diffDays(d, plus6), -6);

  // Comparisons
  assert.strictEqual(u.compareEthDates(d, plus5), -1);
  assert.strictEqual(u.compareEthDates(plus5, d), 1);
  assert.strictEqual(u.compareEthDates(d, d), 0);
  assert.strictEqual(u.isBeforeEthDate(d, plus5), true);
  assert.strictEqual(u.isAfterEthDate(plus5, d), true);
  assert.strictEqual(u.isSameEthDate(d, { year: 2017, month: 2, day: 25 }), true);

  // addMonths & addYears
  const plus2Months = u.addMonths(d, 2);
  assert.deepStrictEqual(plus2Months, { year: 2017, month: 4, day: 25 });

  const plus1Year = u.addYears(d, 1);
  assert.deepStrictEqual(plus1Year, { year: 2018, month: 2, day: 25 });
});

test('Date Validation', () => {
  assert.strictEqual(u.isValidEthDate(2017, 1, 1), true);
  assert.strictEqual(u.isValidEthDate(2017, 1, 30), true);
  assert.strictEqual(u.isValidEthDate(2017, 1, 31), false); // max 30
  assert.strictEqual(u.isValidEthDate(2017, 14, 1), false); // max 13 months
  assert.strictEqual(u.isValidEthDate(2016, 13, 5), true);  // Pagume 5
  assert.strictEqual(u.isValidEthDate(2016, 13, 6), false); // Pagume 6 in non-leap
  assert.strictEqual(u.isValidEthDate(2015, 13, 6), true);  // Pagume 6 in leap
});

test('parseEthiopianDate', () => {
  assert.deepStrictEqual(u.parseEthiopianDate('2017-02-27'), { year: 2017, month: 2, day: 27 });
  assert.deepStrictEqual(u.parseEthiopianDate('27/02/2017'), { year: 2017, month: 2, day: 27 });
  assert.deepStrictEqual(u.parseEthiopianDate('2017/02/27'), { year: 2017, month: 2, day: 27 });
  assert.deepStrictEqual(u.parseEthiopianDate('ጥቅምት 27, 2017 ዓ.ም'), { year: 2017, month: 2, day: 27 });
  assert.deepStrictEqual(u.parseEthiopianDate('Tikimt 27 2017'), { year: 2017, month: 2, day: 27 });
  assert.deepStrictEqual(u.parseEthiopianDate('ጥቅምት ፳፯ ፳፻፲፯'), { year: 2017, month: 2, day: 27 });
  assert.strictEqual(u.parseEthiopianDate('not a date'), null);
});

test('formatEthiopian / formatEthDate', () => {
  const d = { year: 2017, month: 2, day: 27, hour: 3, minute: 30, period: 'ጠዋት', ampm: 'ቀን' };

  // Presets
  assert.strictEqual(u.formatEthiopian(d, 'iso'), '2017-02-27');
  assert.strictEqual(u.formatEthiopian(d, 'short'), '27/02/2017');
  assert.strictEqual(u.formatEthiopian(d, 'medium'), 'ጥቅምት 27, 2017');
  assert.strictEqual(u.formatEthiopian(d, 'long'), 'ጥቅምት 27, 2017 ዓ.ም');
  assert.strictEqual(u.formatEthiopian(d, 'full'), 'ረቡዕ፣ ጥቅምት 27 ቀን 2017 ዓ.ም');
  assert.strictEqual(u.formatEthiopian(d, 'geez'), 'ጥቅምት ፳፯ ቀን ፳፻፲፯ ዓ.ም');

  // English locale
  assert.strictEqual(u.formatEthiopian(d, 'long', { locale: 'en' }), 'Tikimt 27, 2017 A.M.');
  assert.strictEqual(u.formatEthiopian(d, 'full', { locale: 'en' }), 'Rebue, Tikimt 27, 2017 A.M.');

  // Custom pattern
  const custom = u.formatEthiopian(d, 'dddd [date:] MMMM D (a h:mm)');
  assert.strictEqual(custom, 'ረቡዕ date: ጥቅምት 27 (ጠዋት 3:30)');

  // Alias
  assert.strictEqual(u.formatEthDate(d, 'iso'), '2017-02-27');
});

test('Configurable getEthTimePeriod', () => {
  // Default thresholds
  assert.strictEqual(u.getEthTimePeriod(8), 'ጠዋት');
  assert.strictEqual(u.getEthTimePeriod(14), 'ከሰዓት');
  assert.strictEqual(u.getEthTimePeriod(19), 'ምሽት');
  assert.strictEqual(u.getEthTimePeriod(3), 'ሌሊት');

  // Custom thresholds (e.g. morning starts at 5, afternoon at 11, evening at 17, night at 21)
  const customConfig = { morningStart: 5, afternoonStart: 11, eveningStart: 17, nightStart: 21 };
  assert.strictEqual(u.getEthTimePeriod(5, customConfig), 'ጠዋት');
  assert.strictEqual(u.getEthTimePeriod(11, customConfig), 'ከሰዓት');
  assert.strictEqual(u.getEthTimePeriod(17, customConfig), 'ምሽት');
  assert.strictEqual(u.getEthTimePeriod(22, customConfig), 'ሌሊት');
});

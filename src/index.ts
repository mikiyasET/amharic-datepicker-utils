/**
 * amharic-datepicker-utils
 * Pure TypeScript utilities for Ethiopian (Amharic) calendar and time conversion.
 * Zero dependencies — works in Node.js, Deno, Bun, and all modern browsers.
 *
 * @author Mikiyas Lemlemu <Mikiyaslemlemu@gmail.com>
 * @license ISC
 */

// ─── Constants & Epochs ──────────────────────────────────────────
export const JD_EPOCH_OFFSET_AMETE_MIHRET = 1724220;

// ─── Interfaces & Types ──────────────────────────────────────────
export interface EthDate {
  year: number;
  month: number;
  day: number;
}

export interface EthDateTime extends EthDate {
  hour?: number;
  minute?: number;
  second?: number;
  ampm?: EthAMPM;
}

export interface GregDate {
  year: number;
  month: number;
  day: number;
}

export interface GregDateTime extends GregDate {
  hour?: number;
  minute?: number;
  second?: number;
  ampm?: GregAMPM;
}

export type EthAMPM = 'ቀን' | 'ማታ';
export type EthTimePeriod = 'ጠዋት' | 'ከሰዓት' | 'ምሽት' | 'ሌሊት';
export type GregAMPM = 'AM' | 'PM';

export interface EthTimePeriodConfig {
  morningStart?: number;   // default: 6
  afternoonStart?: number; // default: 12
  eveningStart?: number;   // default: 18
  nightStart?: number;     // default: 24 (or 0)
}

export interface FormatOptions {
  locale?: 'am' | 'en';
  format?: 'full' | 'long' | 'medium' | 'short' | 'iso' | 'geez' | 'time' | 'datetime' | string;
  era?: boolean;
  time?: boolean;
  useGeez?: boolean;
  periodConfig?: EthTimePeriodConfig;
}

// ─── Arrays & Localization Data ──────────────────────────────────
export const ethMonths: readonly string[] = [
  "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት",
  "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
];

export const ethMonthsEn: readonly string[] = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
  "Megabit", "Miyazya", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
];

export const ethMonthsShort: readonly string[] = [
  "መስከ", "ጥቅም", "ኅዳር", "ታኅሣ", "ጥር", "የካ",
  "መጋ", "ሚያ", "ግን", "ሰኔ", "ሐም", "ነሐ", "ጳጉ"
];

export const ethDays: readonly string[] = [
  "እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"
];

export const ethDaysEn: readonly string[] = [
  "Ehud", "Segno", "Maksegno", "Rebue", "Hamus", "Arb", "Kidame"
];

export const ethDaysShort: readonly string[] = [
  "እሑ", "ሰኞ", "ማክ", "ረቡ", "ሐሙ", "ዓር", "ቅዳ"
];

export const ethAMPMs: readonly EthAMPM[] = ['ቀን', 'ማታ'];

export const gregMonths: readonly string[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const gregDays: readonly string[] = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export const gregAMPMs: readonly GregAMPM[] = ['AM', 'PM'];

// ─── Low-Level Julian Day Number (JDN) Algorithms ────────────────

export function gregToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function jdnToGreg(jdn: number): GregDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

export function ethToJDN(year: number, month: number, day: number): number {
  return (
    JD_EPOCH_OFFSET_AMETE_MIHRET +
    365 * (year - 1) +
    Math.floor(year / 4) +
    30 * (month - 1) +
    day
  );
}

export function jdnToEth(jdn: number): EthDate {
  const daysSinceEpoch = jdn - JD_EPOCH_OFFSET_AMETE_MIHRET;
  let year = Math.floor((4 * daysSinceEpoch + 1463) / 1461);
  let priorDays = daysSinceEpoch - (365 * (year - 1) + Math.floor(year / 4));

  if (priorDays <= 0) {
    year -= 1;
    priorDays = daysSinceEpoch - (365 * (year - 1) + Math.floor(year / 4));
  }

  const month = Math.floor((priorDays - 1) / 30) + 1;
  const day = ((priorDays - 1) % 30) + 1;

  return { year, month, day };
}

// ─── Leap Year & Month Length ─────────────────────────────────────

export function isEthiopianLeapYear(year: number): boolean {
  return ((year % 4) + 4) % 4 === 3;
}

export function getDaysInMonth(year: number, month: number): number {
  if (month === 13) {
    return isEthiopianLeapYear(year) ? 6 : 5;
  }
  if (month >= 1 && month <= 12) {
    return 30;
  }
  return 0;
}

export function isValidEthDate(year: number, month: number, day: number): boolean;
export function isValidEthDate(date: EthDate): boolean;
export function isValidEthDate(arg1: number | EthDate, arg2?: number, arg3?: number): boolean {
  let y: number;
  let m: number;
  let d: number;
  if (typeof arg1 === 'object' && arg1 !== null) {
    y = arg1.year;
    m = arg1.month;
    d = arg1.day;
  } else {
    y = arg1;
    m = arg2 ?? 0;
    d = arg3 ?? 0;
  }
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return false;
  if (m < 1 || m > 13) return false;
  if (d < 1 || d > getDaysInMonth(y, m)) return false;
  return true;
}

// ─── Core Calendar Conversions ────────────────────────────────────

export function toEthiopian(date: Date): EthDate;
export function toEthiopian(isoString: string): EthDate;
export function toEthiopian(gregDate: GregDate): EthDate;
export function toEthiopian(gregYear: number, gregMonth: number, gregDay: number): EthDate;
export function toEthiopian(
  arg1: Date | string | GregDate | number,
  arg2?: number,
  arg3?: number
): EthDate {
  let year: number;
  let month: number;
  let day: number;

  if (arg1 instanceof Date) {
    year = arg1.getFullYear();
    month = arg1.getMonth() + 1;
    day = arg1.getDate();
  } else if (typeof arg1 === 'string') {
    const d = new Date(arg1);
    if (!isNaN(d.getTime())) {
      year = d.getFullYear();
      month = d.getMonth() + 1;
      day = d.getDate();
    } else {
      const parts = arg1.split(/[-/.]/).map((n) => parseInt(n, 10));
      if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        year = parts[0];
        month = parts[1];
        day = parts[2];
      } else {
        throw new Error(`Invalid date string passed to toEthiopian: "${arg1}"`);
      }
    }
  } else if (typeof arg1 === 'object' && arg1 !== null) {
    year = arg1.year;
    month = arg1.month;
    day = arg1.day;
  } else if (typeof arg1 === 'number') {
    year = arg1;
    month = arg2 ?? 1;
    day = arg3 ?? 1;
  } else {
    throw new Error('Invalid arguments passed to toEthiopian');
  }

  const jdn = gregToJDN(year, month, day);
  return jdnToEth(jdn);
}

export function toGregorian(ethDate: EthDate): GregDate;
export function toGregorian(ethYear: number, ethMonth: number, ethDay: number): GregDate;
export function toGregorian(
  arg1: EthDate | number,
  arg2?: number,
  arg3?: number
): GregDate {
  let year: number;
  let month: number;
  let day: number;

  if (typeof arg1 === 'object' && arg1 !== null) {
    year = arg1.year;
    month = arg1.month;
    day = arg1.day;
  } else if (typeof arg1 === 'number') {
    year = arg1;
    month = arg2 ?? 1;
    day = arg3 ?? 1;
  } else {
    throw new Error('Invalid arguments passed to toGregorian');
  }

  const jdn = ethToJDN(year, month, day);
  return jdnToGreg(jdn);
}

export function toGregorianDate(ethDate: EthDate | EthDateTime): Date;
export function toGregorianDate(
  ethYear: number,
  ethMonth: number,
  ethDay: number,
  hour?: number,
  minute?: number,
  second?: number
): Date;
export function toGregorianDate(
  arg1: EthDate | EthDateTime | number,
  arg2?: number,
  arg3?: number,
  arg4?: number,
  arg5?: number,
  arg6?: number
): Date {
  let ethYear: number;
  let ethMonth: number;
  let ethDay: number;
  let ethHour = 0;
  let ethMin = 0;
  let ethSec = 0;
  let ethAmpm: EthAMPM | undefined;

  if (typeof arg1 === 'object' && arg1 !== null) {
    ethYear = arg1.year;
    ethMonth = arg1.month;
    ethDay = arg1.day;
    const dt = arg1 as EthDateTime;
    if (dt.hour !== undefined) ethHour = dt.hour;
    if (dt.minute !== undefined) ethMin = dt.minute;
    if (dt.second !== undefined) ethSec = dt.second;
    ethAmpm = dt.ampm;
  } else {
    ethYear = arg1;
    ethMonth = arg2 ?? 1;
    ethDay = arg3 ?? 1;
    ethHour = arg4 ?? 0;
    ethMin = arg5 ?? 0;
    ethSec = arg6 ?? 0;
  }

  const greg = toGregorian(ethYear, ethMonth, ethDay);
  let gregHour = ethHour;
  let gregMin = ethMin;

  if (ethAmpm !== undefined) {
    const conv = toGregorianTime(ethHour, ethMin, ethAmpm);
    gregHour = conv.hour;
    gregMin = conv.minute;
  }

  return new Date(greg.year, greg.month - 1, greg.day, gregHour, gregMin, ethSec);
}

// ─── Day of the Week ──────────────────────────────────────────────

export function getDayOfWeek(ethYear: number, ethMonth: number, ethDay: number): number;
export function getDayOfWeek(date: EthDate): number;
export function getDayOfWeek(arg1: EthDate | number, arg2?: number, arg3?: number): number {
  let y: number;
  let m: number;
  let d: number;
  if (typeof arg1 === 'object' && arg1 !== null) {
    y = arg1.year;
    m = arg1.month;
    d = arg1.day;
  } else {
    y = arg1;
    m = arg2 ?? 1;
    d = arg3 ?? 1;
  }
  const jdn = ethToJDN(y, m, d);
  return ((jdn + 1) % 7 + 7) % 7;
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return getDayOfWeek(year, month, 1);
}

export function getEthDayName(
  arg1: EthDate | number,
  arg2?: number | { locale?: 'am' | 'en'; short?: boolean },
  arg3?: number,
  options?: { locale?: 'am' | 'en'; short?: boolean }
): string {
  let dow: number;
  let opts = options;
  if (typeof arg1 === 'object' && arg1 !== null) {
    dow = getDayOfWeek(arg1);
    if (typeof arg2 === 'object') opts = arg2;
  } else {
    dow = getDayOfWeek(arg1, (arg2 as number) ?? 1, arg3 ?? 1);
  }
  const isEn = opts?.locale === 'en';
  const isShort = opts?.short === true;

  if (isEn) {
    return isShort ? ethDaysEn[dow].slice(0, 3) : ethDaysEn[dow];
  }
  return isShort ? ethDaysShort[dow] : ethDays[dow];
}

// ─── Ge'ez Numeral Conversion ─────────────────────────────────────

export function toGeez(num: number): string {
  if (num <= 0 || !Number.isInteger(num)) return String(num);

  const ones = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
  const tens = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];

  function convertGroup(n: number): string {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return tens[t] + ones[o];
  }

  if (num < 100) return convertGroup(num);

  let result = '';
  const myriads = Math.floor(num / 10000);
  let rem = num % 10000;

  if (myriads > 0) {
    result += myriads === 1 ? '፼' : toGeez(myriads) + '፼';
  }

  const hundreds = Math.floor(rem / 100);
  rem = rem % 100;

  if (hundreds > 0) {
    if (hundreds === 1 && result === '') {
      result += '፻';
    } else {
      result += convertGroup(hundreds) + '፻';
    }
  }

  if (rem > 0) {
    result += convertGroup(rem);
  }

  return result;
}

export function fromGeez(geez: string): number {
  if (!geez || typeof geez !== 'string') return 0;
  const map: Record<string, number> = {
    '፩': 1, '፪': 2, '፫': 3, '፬': 4, '፭': 5, '፮': 6, '፯': 7, '፰': 8, '፱': 9,
    '፲': 10, '፳': 20, '፴': 30, '፵': 40, '፶': 50, '፷': 60, '፸': 70, '፹': 80, '፺': 90,
  };

  const s = geez.trim();
  let total = 0;
  let currentGroup = 0;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '፼') {
      const multiplier = currentGroup === 0 ? 1 : currentGroup;
      total += multiplier * 10000;
      currentGroup = 0;
    } else if (ch === '፻') {
      const multiplier = currentGroup === 0 ? 1 : currentGroup;
      total += multiplier * 100;
      currentGroup = 0;
    } else if (map[ch]) {
      currentGroup += map[ch];
    }
  }
  total += currentGroup;
  return total;
}

// ─── Date Arithmetic & Comparison ─────────────────────────────────

export function addDays(ethDate: EthDate, days: number): EthDate {
  const jdn = ethToJDN(ethDate.year, ethDate.month, ethDate.day) + days;
  return jdnToEth(jdn);
}

export function subDays(ethDate: EthDate, days: number): EthDate {
  return addDays(ethDate, -days);
}

export function addMonths(ethDate: EthDate, months: number): EthDate {
  const totalMonths = (ethDate.year - 1) * 13 + (ethDate.month - 1) + months;
  const year = Math.floor(totalMonths / 13) + 1;
  const month = ((totalMonths % 13) + 13) % 13 + 1;
  const maxDay = getDaysInMonth(year, month);
  const day = Math.min(ethDate.day, maxDay);
  return { year, month, day };
}

export function subMonths(ethDate: EthDate, months: number): EthDate {
  return addMonths(ethDate, -months);
}

export function addYears(ethDate: EthDate, years: number): EthDate {
  const year = ethDate.year + years;
  const maxDay = getDaysInMonth(year, ethDate.month);
  const day = Math.min(ethDate.day, maxDay);
  return { year, month: ethDate.month, day };
}

export function subYears(ethDate: EthDate, years: number): EthDate {
  return addYears(ethDate, -years);
}

export function diffDays(d1: EthDate, d2: EthDate): number {
  return ethToJDN(d1.year, d1.month, d1.day) - ethToJDN(d2.year, d2.month, d2.day);
}

export function compareEthDates(d1: EthDate, d2: EthDate): -1 | 0 | 1 {
  const j1 = ethToJDN(d1.year, d1.month, d1.day);
  const j2 = ethToJDN(d2.year, d2.month, d2.day);
  if (j1 < j2) return -1;
  if (j1 > j2) return 1;
  return 0;
}

export function isSameEthDate(d1: EthDate, d2: EthDate): boolean {
  return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
}

export function isBeforeEthDate(d1: EthDate, d2: EthDate): boolean {
  return compareEthDates(d1, d2) === -1;
}

export function isAfterEthDate(d1: EthDate, d2: EthDate): boolean {
  return compareEthDates(d1, d2) === 1;
}

// ─── Date Parsing ─────────────────────────────────────────────────

export function parseEthiopianDate(str: string): EthDate | null {
  if (!str || typeof str !== 'string') return null;
  const clean = str.trim().replace(/፣|፡|,/g, ' ').replace(/\s+/g, ' ');

  // 1. ISO-like: YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = clean.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    if (isValidEthDate(year, month, day)) return { year, month, day };
  }

  // 2. DMY: DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    if (isValidEthDate(year, month, day)) return { year, month, day };
  }

  // 3. Ge'ez formatted: e.g. "ጥቅምት ፳፯ ፳፻፲፯"
  const geezTokens = clean.match(/[፩-፼]+/g);
  if (geezTokens && geezTokens.length >= 2) {
    const d = fromGeez(geezTokens[0]);
    const y = fromGeez(geezTokens[1]);
    for (let m = 0; m < 13; m++) {
      if (clean.includes(ethMonths[m])) {
        if (isValidEthDate(y, m + 1, d)) return { year: y, month: m + 1, day: d };
      }
    }
  }

  // 4. Textual month names: e.g. "ጥቅምት 27, 2017" or "Tikimt 27, 2017"
  for (let m = 0; m < 13; m++) {
    const amName = ethMonths[m];
    const enName = ethMonthsEn[m].toLowerCase();
    const lower = clean.toLowerCase();

    if (clean.includes(amName) || lower.includes(enName)) {
      const nums = clean.match(/\d+/g);
      if (nums && nums.length >= 2) {
        let day: number, year: number;
        const n1 = parseInt(nums[0], 10);
        const n2 = parseInt(nums[1], 10);
        if (n1 > 31) {
          year = n1;
          day = n2;
        } else {
          day = n1;
          year = n2;
        }
        if (isValidEthDate(year, m + 1, day)) {
          return { year, month: m + 1, day };
        }
      }
    }
  }

  return null;
}

// ─── Date Formatting ──────────────────────────────────────────────

export function formatEthiopian(
  dateInput: Date | EthDate | EthDateTime | string,
  patternOrOptions?: string | FormatOptions,
  options?: FormatOptions
): string {
  let opts: FormatOptions = {};
  let pattern = 'long';

  if (typeof patternOrOptions === 'string') {
    pattern = patternOrOptions;
    if (options) opts = options;
  } else if (typeof patternOrOptions === 'object' && patternOrOptions !== null) {
    opts = patternOrOptions;
    pattern = opts.format || 'long';
  }

  const locale = opts.locale || 'am';
  const isAm = locale === 'am';

  // Extract / convert to Ethiopian date & time components
  let eth: EthDateTime;
  if (dateInput instanceof Date) {
    const ethD = toEthiopian(dateInput);
    const ethT = toEthiopianTime(dateInput.getHours(), dateInput.getMinutes());
    const period = getEthTimePeriod(dateInput.getHours(), opts.periodConfig);
    eth = {
      ...ethD,
      hour: ethT.hour,
      minute: ethT.minute,
      second: dateInput.getSeconds(),
      ampm: ethT.ampm,
    };
  } else if (typeof dateInput === 'string') {
    const parsed = parseEthiopianDate(dateInput);
    if (parsed) {
      eth = parsed;
    } else {
      const gd = new Date(dateInput);
      if (!isNaN(gd.getTime())) {
        const ethD = toEthiopian(gd);
        const ethT = toEthiopianTime(gd.getHours(), gd.getMinutes());
        eth = {
          ...ethD,
          hour: ethT.hour,
          minute: ethT.minute,
          second: gd.getSeconds(),
          ampm: ethT.ampm,
        };
      } else {
        return String(dateInput);
      }
    }
  } else if (typeof dateInput === 'object' && dateInput !== null) {
    eth = { ...dateInput };
  } else {
    return String(dateInput);
  }

  // Preset expansions
  const presets: Record<string, string> = {
    full: isAm ? 'dddd፣ MMMM D [ቀን] YYYY ERA' : 'dddd, MMMM D, YYYY ERA',
    long: isAm ? 'MMMM D, YYYY ERA' : 'MMMM D, YYYY ERA',
    medium: 'MMMM D, YYYY',
    short: 'DD/MM/YYYY',
    iso: 'YYYY-MM-DD',
    geez: isAm ? 'MMMM G [ቀን] GG ERA' : 'MMMM G, GG ERA',
    time: 'a h:mm',
    datetime: isAm ? 'MMMM D, YYYY ERA (a h:mm)' : 'MMMM D, YYYY ERA (h:mm a)',
  };

  const actualPattern = presets[pattern] || pattern;

  const pad = (n: number) => String(n).padStart(2, '0');
  const dow = getDayOfWeek(eth.year, eth.month, eth.day);

  const monthName = isAm ? ethMonths[eth.month - 1] : ethMonthsEn[eth.month - 1];
  const shortMonth = isAm ? ethMonthsShort[eth.month - 1] : ethMonthsEn[eth.month - 1].slice(0, 3);
  const dayName = isAm ? ethDays[dow] : ethDaysEn[dow];
  const shortDay = isAm ? ethDaysShort[dow] : ethDaysEn[dow].slice(0, 3);
  const eraStr = isAm ? 'ዓ.ም' : 'A.M.';

  const ethHour = eth.hour ?? 12;
  const ethMinute = eth.minute ?? 0;
  const ethSecond = eth.second ?? 0;
  const period = eth.ampm ? (eth.ampm === 'ቀን' ? 'ጠዋት' : 'ምሽት') : 'ጠዋት';
  const ampmStr = eth.ampm || 'ቀን';

  const tokens: Record<string, string> = {
    YYYY: opts.useGeez ? toGeez(eth.year) : String(eth.year),
    YY: String(eth.year).slice(-2),
    GG: toGeez(eth.year),
    G: toGeez(eth.day),
    MMMM: monthName,
    MMM: shortMonth,
    MM: pad(eth.month),
    M: String(eth.month),
    DD: opts.useGeez ? toGeez(eth.day) : pad(eth.day),
    D: opts.useGeez ? toGeez(eth.day) : String(eth.day),
    dddd: dayName,
    ddd: shortDay,
    ERA: eraStr,
    hh: pad(ethHour),
    h: String(ethHour),
    HH: pad(ethHour),
    H: String(ethHour),
    mm: pad(ethMinute),
    m: String(ethMinute),
    ss: pad(ethSecond),
    s: String(ethSecond),
    a: period,
    A: ampmStr,
  };

  const regex = /\[([^\]]+)\]|YYYY|YY|GG|G|MMMM|MMM|MM|M|DD|D|dddd|ddd|ERA|hh|h|HH|H|mm|m|ss|s|a|A/g;
  return actualPattern.replace(regex, (match, escaped) => {
    if (escaped) return escaped;
    return tokens[match] !== undefined ? tokens[match] : match;
  });
}

export const formatEthDate = formatEthiopian;

// ─── Time Conversion ──────────────────────────────────────────────

export function getEthTimePeriod(
  gregHour: number,
  config?: EthTimePeriodConfig
): EthTimePeriod {
  const morningStart = config?.morningStart ?? 6;
  const afternoonStart = config?.afternoonStart ?? 12;
  const eveningStart = config?.eveningStart ?? 18;
  const nightStart = config?.nightStart ?? 24;

  if (gregHour >= morningStart && gregHour < afternoonStart) return 'ጠዋት';
  if (gregHour >= afternoonStart && gregHour < eveningStart) return 'ከሰዓት';
  if (gregHour >= eveningStart && gregHour < nightStart) return 'ምሽት';
  return 'ሌሊት';
}

export function toEthiopianTime(
  gregHour: number,
  gregMinute: number
): { hour: number; minute: number; ampm: EthAMPM } {
  const ampm: EthAMPM = gregHour >= 6 && gregHour < 18 ? 'ቀን' : 'ማታ';

  let ethHour = (gregHour + 6) % 12;
  if (ethHour === 0) ethHour = 12;

  return { hour: ethHour, minute: gregMinute, ampm };
}

export function toGregorianTime(
  ethHour: number,
  ethMinute: number,
  ampm: EthAMPM
): { hour: number; minute: number } {
  let gregHour = ethHour + 6;
  if (ethHour === 12) {
    gregHour = 6;
  }

  if (ampm === 'ማታ') {
    gregHour += 12;
  }

  gregHour = gregHour % 24;
  return { hour: gregHour, minute: ethMinute };
}

// ─── Gregorian Helpers ────────────────────────────────────────────

export function getGregFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export function getGregDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function toGregorianTime12h(hour24: number): { hour: number; ampm: GregAMPM } {
  const ampm: GregAMPM = hour24 >= 12 ? 'PM' : 'AM';
  let hour = hour24 % 12;
  if (hour === 0) hour = 12;
  return { hour, ampm };
}

export function toGregorianTime24h(hour12: number, ampm: GregAMPM): number {
  let hour24 = hour12;
  if (ampm === 'PM' && hour12 < 12) hour24 += 12;
  if (ampm === 'AM' && hour12 === 12) hour24 = 0;
  return hour24;
}

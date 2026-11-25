import type { ToolMeta } from "../types";

/**
 * Programmatic unit converter pages.
 * One definition table -> one page per ordered pair of units in a family.
 * Every conversion runs client-side. Factors are exact or standard values.
 */
export interface UnitDef {
  id: string; // slug word, e.g. "centimeters"
  name: string; // plural display name
  singular: string;
  symbol: string;
  factor?: number; // multiply by this to get base unit
  toBase?: (x: number) => number;
  fromBase?: (x: number) => number;
}

export interface FamilyDef {
  key: string;
  label: string;
  base: string;
  blurb: string;
  units: UnitDef[];
}

const u = (id: string, name: string, singular: string, symbol: string, factor: number): UnitDef => ({ id, name, singular, symbol, factor });

export const FAMILIES: FamilyDef[] = [
  {
    key: "length", label: "length", base: "meter",
    blurb: "Length conversions come up in construction, travel, sewing, engineering drawings and school work. The metric system (meters, centimeters, kilometers) is used almost everywhere, while the United States and a few other places still use inches, feet, yards and miles.",
    units: [
      u("millimeters", "millimeters", "millimeter", "mm", 0.001), u("centimeters", "centimeters", "centimeter", "cm", 0.01),
      u("meters", "meters", "meter", "m", 1), u("kilometers", "kilometers", "kilometer", "km", 1000),
      u("inches", "inches", "inch", "in", 0.0254), u("feet", "feet", "foot", "ft", 0.3048), u("yards", "yards", "yard", "yd", 0.9144),
      u("miles", "miles", "mile", "mi", 1609.344), u("nautical-miles", "nautical miles", "nautical mile", "nmi", 1852),
      u("micrometers", "micrometers", "micrometer", "µm", 1e-6), u("nanometers", "nanometers", "nanometer", "nm", 1e-9),
      u("mils", "mils", "mil", "mil", 2.54e-5), u("furlongs", "furlongs", "furlong", "fur", 201.168), u("leagues", "leagues", "league", "lea", 4828.032),
    ],
  },
  {
    key: "weight", label: "weight and mass", base: "kilogram",
    blurb: "Weight and mass units matter for cooking, shipping, fitness tracking and lab work. Kilograms and grams are the standard in most countries, while pounds and ounces are common in the US and UK.",
    units: [
      u("milligrams", "milligrams", "milligram", "mg", 1e-6), u("grams", "grams", "gram", "g", 0.001), u("kilograms", "kilograms", "kilogram", "kg", 1),
      u("metric-tons", "metric tons", "metric ton", "t", 1000), u("pounds", "pounds", "pound", "lb", 0.45359237), u("ounces", "ounces", "ounce", "oz", 0.028349523125),
      u("stone", "stone", "stone", "st", 6.35029318), u("us-tons", "US tons", "US ton", "tn", 907.18474), u("uk-tons", "UK tons", "UK ton", "LT", 1016.0469088),
      u("carats", "carats", "carat", "ct", 0.0002), u("grains", "grains", "grain", "gr", 6.479891e-5), u("micrograms", "micrograms", "microgram", "µg", 1e-9),
    ],
  },
  {
    key: "volume", label: "volume", base: "liter",
    blurb: "Volume units are used for recipes, fuel, drinks, paint and storage. US and UK gallons and fluid ounces are not the same size, so always check which one you need.",
    units: [
      u("milliliters", "milliliters", "milliliter", "ml", 0.001), u("liters", "liters", "liter", "L", 1), u("cubic-meters", "cubic meters", "cubic meter", "m³", 1000),
      u("us-gallons", "US gallons", "US gallon", "gal", 3.785411784), u("us-quarts", "US quarts", "US quart", "qt", 0.946352946),
      u("us-pints", "US pints", "US pint", "pt", 0.473176473), u("us-cups", "US cups", "US cup", "cup", 0.2365882365),
      u("us-fluid-ounces", "US fluid ounces", "US fluid ounce", "fl oz", 0.0295735295625), u("tablespoons", "tablespoons", "tablespoon", "tbsp", 0.01478676478125),
      u("teaspoons", "teaspoons", "teaspoon", "tsp", 0.00492892159375), u("uk-gallons", "UK gallons", "UK gallon", "imp gal", 4.54609),
      u("uk-fluid-ounces", "UK fluid ounces", "UK fluid ounce", "imp fl oz", 0.0284130625), u("oil-barrels", "oil barrels", "oil barrel", "bbl", 158.987294928),
    ],
  },
  {
    key: "area", label: "area", base: "square meter",
    blurb: "Area units are used for land, flooring, farming and real estate. The feddan is still the standard farmland unit in Egypt, while acres are used in the US and UK, and hectares in most other places.",
    units: [
      u("square-millimeters", "square millimeters", "square millimeter", "mm²", 1e-6), u("square-centimeters", "square centimeters", "square centimeter", "cm²", 1e-4),
      u("square-meters", "square meters", "square meter", "m²", 1), u("square-kilometers", "square kilometers", "square kilometer", "km²", 1e6),
      u("hectares", "hectares", "hectare", "ha", 1e4), u("acres", "acres", "acre", "ac", 4046.8564224), u("square-feet", "square feet", "square foot", "ft²", 0.09290304),
      u("square-inches", "square inches", "square inch", "in²", 6.4516e-4), u("square-yards", "square yards", "square yard", "yd²", 0.83612736),
      u("square-miles", "square miles", "square mile", "mi²", 2589988.110336), u("feddans", "feddans", "feddan", "fed", 4200.833),
    ],
  },
  {
    key: "speed", label: "speed", base: "meter per second",
    blurb: "Speed units appear on road signs, in aviation and sailing, in sports and in physics. Kilometers per hour is the road standard in most countries, miles per hour in the US and UK, and knots at sea and in the air.",
    units: [
      u("meters-per-second", "meters per second", "meter per second", "m/s", 1), u("kilometers-per-hour", "kilometers per hour", "kilometer per hour", "km/h", 1 / 3.6),
      u("miles-per-hour", "miles per hour", "mile per hour", "mph", 0.44704), u("knots", "knots", "knot", "kn", 1852 / 3600),
      u("feet-per-second", "feet per second", "foot per second", "ft/s", 0.3048), u("centimeters-per-second", "centimeters per second", "centimeter per second", "cm/s", 0.01),
    ],
  },
  {
    key: "data", label: "digital storage", base: "byte",
    blurb: "Storage sizes are quoted two ways. Decimal units (KB, MB, GB) use powers of 1000 and are what drive makers and mobile plans print on the box. Binary units (KiB, MiB, GiB) use powers of 1024 and are what many operating systems report.",
    units: [
      u("bits", "bits", "bit", "bit", 0.125), u("bytes", "bytes", "byte", "B", 1), u("kilobytes", "kilobytes", "kilobyte", "KB", 1e3), u("megabytes", "megabytes", "megabyte", "MB", 1e6),
      u("gigabytes", "gigabytes", "gigabyte", "GB", 1e9), u("terabytes", "terabytes", "terabyte", "TB", 1e12), u("petabytes", "petabytes", "petabyte", "PB", 1e15),
      u("kibibytes", "kibibytes", "kibibyte", "KiB", 1024), u("mebibytes", "mebibytes", "mebibyte", "MiB", 1048576), u("gibibytes", "gibibytes", "gibibyte", "GiB", 1073741824),
    ],
  },
  {
    key: "data-rate", label: "data transfer rate", base: "bit per second",
    blurb: "Internet providers sell speed in bits per second (Mbps), while download managers and browsers show bytes per second (MB/s). One byte is eight bits, so a 100 Mbps line downloads at about 12.5 MB/s at best.",
    units: [
      u("bits-per-second", "bits per second", "bit per second", "bps", 1), u("kilobits-per-second", "kilobits per second", "kilobit per second", "kbps", 1e3),
      u("megabits-per-second", "megabits per second", "megabit per second", "Mbps", 1e6), u("gigabits-per-second", "gigabits per second", "gigabit per second", "Gbps", 1e9),
      u("bytes-per-second", "bytes per second", "byte per second", "B/s", 8), u("kilobytes-per-second", "kilobytes per second", "kilobyte per second", "KB/s", 8e3),
      u("megabytes-per-second", "megabytes per second", "megabyte per second", "MB/s", 8e6), u("gigabytes-per-second", "gigabytes per second", "gigabyte per second", "GB/s", 8e9),
    ],
  },
  {
    key: "time", label: "time", base: "second",
    blurb: "Time conversions help with project planning, payroll, video editing, science and programming. Months and years here use average lengths (a month is 30.44 days and a year is 365.2425 days).",
    units: [
      u("microseconds", "microseconds", "microsecond", "µs", 1e-6), u("milliseconds", "milliseconds", "millisecond", "ms", 0.001), u("seconds", "seconds", "second", "s", 1),
      u("minutes", "minutes", "minute", "min", 60), u("hours", "hours", "hour", "h", 3600), u("days", "days", "day", "d", 86400), u("weeks", "weeks", "week", "wk", 604800),
      u("months", "months", "month", "mo", 2629746), u("years", "years", "year", "yr", 31556952),
    ],
  },
  {
    key: "pressure", label: "pressure", base: "pascal",
    blurb: "Pressure units are used for tyres, weather, diving, HVAC and engineering. Pascals are the SI unit, bar and atmospheres are common in industry, psi is used for tyres in the US and mmHg for blood pressure.",
    units: [
      u("pascals", "pascals", "pascal", "Pa", 1), u("kilopascals", "kilopascals", "kilopascal", "kPa", 1e3), u("bar", "bar", "bar", "bar", 1e5), u("millibars", "millibars", "millibar", "mbar", 100),
      u("atmospheres", "atmospheres", "atmosphere", "atm", 101325), u("psi", "psi", "psi", "psi", 6894.757293168), u("mmhg", "mmHg", "mmHg", "mmHg", 133.322387415), u("torr", "torr", "torr", "Torr", 133.32236842),
    ],
  },
  {
    key: "energy", label: "energy", base: "joule",
    blurb: "Energy units show up on food labels (kilocalories), electricity bills (kilowatt-hours), heating (BTU) and physics (joules).",
    units: [
      u("joules", "joules", "joule", "J", 1), u("kilojoules", "kilojoules", "kilojoule", "kJ", 1e3), u("calories", "calories", "calorie", "cal", 4.184), u("kilocalories", "kilocalories", "kilocalorie", "kcal", 4184),
      u("watt-hours", "watt-hours", "watt-hour", "Wh", 3600), u("kilowatt-hours", "kilowatt-hours", "kilowatt-hour", "kWh", 3.6e6), u("btu", "BTU", "BTU", "BTU", 1055.05585262), u("foot-pounds", "foot-pounds", "foot-pound", "ft·lbf", 1.3558179483314),
    ],
  },
  {
    key: "power", label: "power", base: "watt",
    blurb: "Power ratings describe engines, appliances, solar panels and air conditioners. Horsepower comes in several versions; this converter uses mechanical horsepower (745.7 W) and metric horsepower PS (735.5 W).",
    units: [
      u("watts", "watts", "watt", "W", 1), u("kilowatts", "kilowatts", "kilowatt", "kW", 1e3), u("megawatts", "megawatts", "megawatt", "MW", 1e6),
      u("horsepower", "horsepower", "horsepower", "hp", 745.69987158227), u("metric-horsepower", "metric horsepower", "metric horsepower", "PS", 735.49875), u("btu-per-hour", "BTU per hour", "BTU per hour", "BTU/h", 0.29307107017),
    ],
  },
  {
    key: "frequency", label: "frequency", base: "hertz",
    blurb: "Frequency is used for radio, electronics, audio, processors and engines. One hertz is one cycle per second; engine speed is often given in revolutions per minute (rpm).",
    units: [
      u("hertz", "hertz", "hertz", "Hz", 1), u("kilohertz", "kilohertz", "kilohertz", "kHz", 1e3), u("megahertz", "megahertz", "megahertz", "MHz", 1e6), u("gigahertz", "gigahertz", "gigahertz", "GHz", 1e9), u("rpm", "rpm", "rpm", "rpm", 1 / 60),
    ],
  },
  {
    key: "angle", label: "angle", base: "degree",
    blurb: "Angles are measured in degrees in everyday work and surveying, in radians in maths and programming, and in gradians in some surveying systems.",
    units: [
      u("degrees", "degrees", "degree", "°", 1), u("radians", "radians", "radian", "rad", 180 / Math.PI), u("gradians", "gradians", "gradian", "grad", 0.9), u("turns", "turns", "turn", "turn", 360),
    ],
  },
  {
    key: "temperature", label: "temperature", base: "kelvin",
    blurb: "Celsius is used in most of the world, Fahrenheit in the United States, and Kelvin in science. Unlike other units, temperature scales have different zero points, so conversion needs a formula with an offset, not just a multiplier.",
    units: [
      { id: "celsius", name: "degrees Celsius", singular: "degree Celsius", symbol: "°C", toBase: (x) => x + 273.15, fromBase: (x) => x - 273.15 },
      { id: "fahrenheit", name: "degrees Fahrenheit", singular: "degree Fahrenheit", symbol: "°F", toBase: (x) => ((x - 32) * 5) / 9 + 273.15, fromBase: (x) => ((x - 273.15) * 9) / 5 + 32 },
      { id: "kelvin", name: "kelvin", singular: "kelvin", symbol: "K", toBase: (x) => x, fromBase: (x) => x },
    ],
  },
  {
    key: "fuel", label: "fuel economy", base: "liters per 100 km",
    blurb: "Fuel economy is measured as distance per volume (km/L, miles per gallon) in some countries and as volume per distance (L/100 km) in others. MPG in the US and UK uses different gallons, so the numbers differ.",
    units: [
      { id: "liters-per-100-km", name: "liters per 100 km", singular: "liter per 100 km", symbol: "L/100km", toBase: (x) => x, fromBase: (x) => x },
      { id: "km-per-liter", name: "kilometers per liter", singular: "kilometer per liter", symbol: "km/L", toBase: (x) => (x === 0 ? Infinity : 100 / x), fromBase: (x) => (x === 0 ? Infinity : 100 / x) },
      { id: "mpg-us", name: "miles per gallon (US)", singular: "mile per gallon (US)", symbol: "mpg US", toBase: (x) => (x === 0 ? Infinity : 235.214583333 / x), fromBase: (x) => (x === 0 ? Infinity : 235.214583333 / x) },
      { id: "mpg-uk", name: "miles per gallon (UK)", singular: "mile per gallon (UK)", symbol: "mpg UK", toBase: (x) => (x === 0 ? Infinity : 282.480936332 / x), fromBase: (x) => (x === 0 ? Infinity : 282.480936332 / x) },
    ],
  },
];

export function convert(fam: FamilyDef, from: UnitDef, to: UnitDef, value: number): number {
  const base = from.toBase ? from.toBase(value) : value * (from.factor as number);
  return to.fromBase ? to.fromBase(base) : base / (to.factor as number);
}

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return "n/a";
  if (n === 0) return "0";
  const a = Math.abs(n);
  if (a >= 1e12 || a < 1e-6) return n.toExponential(4).replace(/\.?0+e/, "e");
  const s = a >= 1000 ? n.toLocaleString("en-US", { maximumFractionDigits: 4 }) : String(Number(n.toPrecision(7)));
  return s;
}

export const UNIT_CATEGORY = "unit-converters" as const;
const SAMPLES = [1, 2, 5, 10, 25, 50, 100, 1000];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function pairKey(fam: string, from: string, to: string) {
  return `Unit:${fam}:${from}:${to}`;
}

function buildTool(fam: FamilyDef, from: UnitDef, to: UnitDef): ToolMeta {
  const slug = `${from.id}-to-${to.id}`;
  const one = convert(fam, from, to, 1);
  const rev = convert(fam, to, from, 1);
  const linear = from.factor !== undefined && to.factor !== undefined;
  const title = `${cap(from.name)} to ${cap(to.name)} Converter (${from.symbol} to ${to.symbol})`;
  const samples = SAMPLES.map((v) => `${fmt(v)} ${from.symbol} = ${fmt(convert(fam, from, to, v))} ${to.symbol}`);
  const formula = linear
    ? `To convert ${from.name} to ${to.name}, multiply the value by ${fmt((from.factor as number) / (to.factor as number))}. In other words, 1 ${from.singular} equals ${fmt(one)} ${to.name}. To go back, divide by the same number, or multiply ${to.name} by ${fmt(rev)}.`
    : `This conversion is not a single multiplication, because the two scales do not share the same zero point or are inverses of each other. The converter first turns your value into ${fam.base}s and then into ${to.name}. For reference, 1 ${from.singular} equals ${fmt(one)} ${to.name}.`;
  const article = [
    `${cap(from.name)} to ${to.name} is one of the ${fam.label} conversions people look up most. Type a number in the box above and the result in ${to.name} (${to.symbol}) appears instantly. Everything runs in your browser, so nothing you type is uploaded or stored, and there is no limit on how many conversions you can make.`,
    formula,
    `Quick reference: ${samples.join("; ")}.`,
    fam.blurb,
    `Results are shown with up to seven significant digits, which is enough for everyday and most professional use. If you need the opposite direction, use the ${to.name} to ${from.name} converter linked in the related tools below. You can also swap the two units with the swap button without leaving this page.`,
  ].join("\n\n");
  const faqs = [
    { q: `How many ${to.name} are in 1 ${from.singular}?`, a: `1 ${from.singular} equals ${fmt(one)} ${to.name} (${to.symbol}).` },
    { q: `How do I convert ${from.name} to ${to.name}?`, a: linear ? `Multiply the number of ${from.name} by ${fmt((from.factor as number) / (to.factor as number))} to get ${to.name}.` : `Use the converter above. It converts through ${fam.base}s and applies the correct formula for you.` },
    { q: `How many ${from.name} are in 1 ${to.singular}?`, a: `1 ${to.singular} equals ${fmt(rev)} ${from.name} (${from.symbol}).` },
    { q: "Is this converter accurate?", a: "It uses the exact or internationally defined conversion factors where they exist. Results are rounded to seven significant digits for display." },
    { q: "Is my data sent to a server?", a: "No. The calculation happens in your browser and nothing is uploaded." },
  ];
  const related = [
    `${to.id}-to-${from.id}`,
    ...fam.units.filter((x) => x.id !== from.id && x.id !== to.id).slice(0, 3).map((x) => `${from.id}-to-${x.id}`),
    ...fam.units.filter((x) => x.id !== from.id && x.id !== to.id).slice(0, 2).map((x) => `${x.id}-to-${to.id}`),
  ];
  return {
    slug,
    title,
    shortDescription: `Convert ${from.name} (${from.symbol}) to ${to.name} (${to.symbol}) instantly. 1 ${from.symbol} = ${fmt(one)} ${to.symbol}.`,
    metaDescription: `Convert ${from.name} to ${to.name} online. 1 ${from.symbol} = ${fmt(one)} ${to.symbol}. Free, instant, works in your browser.`.slice(0, 160),
    category: UNIT_CATEGORY,
    keywords: [`${from.name} to ${to.name}`, `${from.symbol} to ${to.symbol}`, `convert ${from.name} to ${to.name}`, `${from.name} to ${to.name} converter`, `${from.name} to ${to.name} calculator`],
    componentKey: pairKey(fam.key, from.id, to.id),
    article,
    faqs,
    related,
  };
}

export const unitTools: ToolMeta[] = FAMILIES.flatMap((fam) =>
  fam.units.flatMap((from) => fam.units.filter((to) => to.id !== from.id).map((to) => buildTool(fam, from, to)))
);

export function resolvePair(key: string): { fam: FamilyDef; from: UnitDef; to: UnitDef } | null {
  const [, famKey, fromId, toId] = key.split(":");
  const fam = FAMILIES.find((f) => f.key === famKey);
  if (!fam) return null;
  const from = fam.units.find((x) => x.id === fromId);
  const to = fam.units.find((x) => x.id === toId);
  return from && to ? { fam, from, to } : null;
}

// Pure electrical engineering calculation utilities for ProtoPath Calculators

export const E24_BASE = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
  3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
];

export interface ResistorColorBand {
  label: string;
  hex: string;
}

export interface LedResistorResult {
  valid: boolean;
  error?: string;
  exactResistanceOhm: number;
  nearestE24Ohm: number;
  actualCurrentMa: number;
  powerMw: number;
  recommendedWattage: string;
  colorBands: ResistorColorBand[];
}

export function findNearestE24(ohms: number): number {
  if (!Number.isFinite(ohms) || ohms <= 0) return 0;
  let best = ohms;
  let minDiff = Infinity;
  for (let exp = 0; exp <= 7; exp++) {
    const scale = Math.pow(10, exp);
    for (const base of E24_BASE) {
      const candidate = Number((base * scale).toPrecision(4));
      if (candidate >= ohms) {
        const diff = candidate - ohms;
        if (diff < minDiff) {
          minDiff = diff;
          best = candidate;
        }
      }
    }
  }
  // If ohms is very large, fallback
  if (minDiff === Infinity) {
    return Math.round(ohms);
  }
  return best;
}

const DIGIT_COLORS: ResistorColorBand[] = [
  { label: 'Black (0)', hex: '#1e293b' },
  { label: 'Brown (1)', hex: '#78350f' },
  { label: 'Red (2)', hex: '#dc2626' },
  { label: 'Orange (3)', hex: '#ea580c' },
  { label: 'Yellow (4)', hex: '#eab308' },
  { label: 'Green (5)', hex: '#16a34a' },
  { label: 'Blue (6)', hex: '#2563eb' },
  { label: 'Violet (7)', hex: '#7c3aed' },
  { label: 'Gray (8)', hex: '#64748b' },
  { label: 'White (9)', hex: '#f8fafc' },
];

const MULTIPLIER_COLORS: Record<number, ResistorColorBand> = {
  [-1]: { label: 'Gold (×0.1)', hex: '#ca8a04' },
  0: { label: 'Black (×1)', hex: '#1e293b' },
  1: { label: 'Brown (×10)', hex: '#78350f' },
  2: { label: 'Red (×100)', hex: '#dc2626' },
  3: { label: 'Orange (×1k)', hex: '#ea580c' },
  4: { label: 'Yellow (×10k)', hex: '#eab308' },
  5: { label: 'Green (×100k)', hex: '#16a34a' },
  6: { label: 'Blue (×1M)', hex: '#2563eb' },
};

export function get4BandResistorColors(ohms: number): ResistorColorBand[] {
  if (!Number.isFinite(ohms) || ohms < 1) {
    return [DIGIT_COLORS[1], DIGIT_COLORS[0], MULTIPLIER_COLORS[0], { label: 'Gold (±5%)', hex: '#ca8a04' }];
  }
  let val = ohms;
  let exp = 0;
  while (val >= 100) {
    val /= 10;
    exp++;
  }
  while (val < 10) {
    val *= 10;
    exp--;
  }
  const rounded = Math.round(val);
  const d1 = Math.min(9, Math.max(0, Math.floor(rounded / 10)));
  const d2 = Math.min(9, Math.max(0, rounded % 10));
  const mult = MULTIPLIER_COLORS[exp] ?? MULTIPLIER_COLORS[0];
  return [
    DIGIT_COLORS[d1],
    DIGIT_COLORS[d2],
    mult,
    { label: 'Gold (±5%)', hex: '#ca8a04' },
  ];
}

export function calculateLedResistor(
  supplyV: number,
  forwardV: number,
  forwardCurrentMa: number,
  seriesCount: number = 1
): LedResistorResult {
  const totalVf = forwardV * Math.max(1, Math.floor(seriesCount));
  if (supplyV <= 0 || forwardCurrentMa <= 0 || forwardV < 0) {
    return {
      valid: false,
      error: 'INVALID_INPUT',
      exactResistanceOhm: 0,
      nearestE24Ohm: 0,
      actualCurrentMa: 0,
      powerMw: 0,
      recommendedWattage: '1/4 W',
      colorBands: get4BandResistorColors(100),
    };
  }
  if (supplyV <= totalVf) {
    return {
      valid: false,
      error: 'SUPPLY_TOO_LOW',
      exactResistanceOhm: 0,
      nearestE24Ohm: 0,
      actualCurrentMa: 0,
      powerMw: 0,
      recommendedWattage: '1/4 W',
      colorBands: get4BandResistorColors(100),
    };
  }

  const vDrop = supplyV - totalVf;
  const currentA = forwardCurrentMa / 1000;
  const exactResistanceOhm = vDrop / currentA;
  const nearestE24Ohm = findNearestE24(exactResistanceOhm);
  const actualCurrentA = nearestE24Ohm > 0 ? vDrop / nearestE24Ohm : 0;
  const actualCurrentMa = actualCurrentA * 1000;
  const powerW = vDrop * actualCurrentA;
  const powerMw = powerW * 1000;

  // Apply 2x thermal derating safety margin
  const deratedW = powerW * 2;
  let recommendedWattage = '1/8 W (0.125W)';
  if (deratedW > 0.5) recommendedWattage = '1 W';
  else if (deratedW > 0.25) recommendedWattage = '1/2 W (0.5W)';
  else if (deratedW > 0.125) recommendedWattage = '1/4 W (0.25W)';

  return {
    valid: true,
    exactResistanceOhm,
    nearestE24Ohm,
    actualCurrentMa,
    powerMw,
    recommendedWattage,
    colorBands: get4BandResistorColors(nearestE24Ohm),
  };
}

export interface VoltageDividerResult {
  valid: boolean;
  vOut: number;
  ratio: number;
  dividerCurrentMa: number;
  powerTotalMw: number;
  esp32Adc12Bit: number;
  safeFor3v3Gpio: boolean;
  suggestedR2For3v3?: number;
}

export function calculateVoltageDivider(
  vIn: number,
  r1Ohm: number,
  r2Ohm: number
): VoltageDividerResult {
  if (vIn < 0 || r1Ohm < 0 || r2Ohm <= 0 || r1Ohm + r2Ohm <= 0) {
    return {
      valid: false,
      vOut: 0,
      ratio: 0,
      dividerCurrentMa: 0,
      powerTotalMw: 0,
      esp32Adc12Bit: 0,
      safeFor3v3Gpio: true,
    };
  }
  const ratio = r2Ohm / (r1Ohm + r2Ohm);
  const vOut = vIn * ratio;
  const currentA = vIn / (r1Ohm + r2Ohm);
  const dividerCurrentMa = currentA * 1000;
  const powerTotalMw = vIn * currentA * 1000;
  const esp32Adc12Bit = Math.min(4095, Math.max(0, Math.round((vOut / 3.3) * 4095)));
  const safeFor3v3Gpio = vOut <= 3.305;

  // Suggest max R2 for <= 3.3V given R1 and Vin
  let suggestedR2For3v3: number | undefined;
  if (vIn > 3.3 && r1Ohm > 0) {
    const exactR2 = (3.3 * r1Ohm) / (vIn - 3.3);
    suggestedR2For3v3 = Math.round(exactR2);
  }

  return {
    valid: true,
    vOut,
    ratio,
    dividerCurrentMa,
    powerTotalMw,
    esp32Adc12Bit,
    safeFor3v3Gpio,
    suggestedR2For3v3,
  };
}

export interface RcFilterResult {
  valid: boolean;
  cutoffHz: number;
  timeConstantMs: number;
  riseTimeMs: number;
  bodePoints: Array<{ freqHz: number; db: number; phaseDeg: number }>;
}

export function calculateRcFilter(rOhm: number, cMicroFarad: number): RcFilterResult {
  if (rOhm <= 0 || cMicroFarad <= 0) {
    return {
      valid: false,
      cutoffHz: 0,
      timeConstantMs: 0,
      riseTimeMs: 0,
      bodePoints: [],
    };
  }
  const cFarad = cMicroFarad * 1e-6;
  const tauSec = rOhm * cFarad;
  const cutoffHz = 1 / (2 * Math.PI * tauSec);
  const timeConstantMs = tauSec * 1000;
  const riseTimeMs = 2.2 * timeConstantMs;

  // Generate 25 log-spaced Bode points around cutoffHz (from fc/100 to fc*100)
  const bodePoints: Array<{ freqHz: number; db: number; phaseDeg: number }> = [];
  const startExp = Math.log10(cutoffHz) - 2;
  const endExp = Math.log10(cutoffHz) + 2;
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const f = Math.pow(10, startExp + ((endExp - startExp) * i) / steps);
    const ratio = f / cutoffHz;
    const mag = 1 / Math.sqrt(1 + ratio * ratio);
    const db = 20 * Math.log10(mag);
    const phaseDeg = (-Math.atan(ratio) * 180) / Math.PI;
    bodePoints.push({ freqHz: f, db, phaseDeg });
  }

  return {
    valid: true,
    cutoffHz,
    timeConstantMs,
    riseTimeMs,
    bodePoints,
  };
}

export interface BatteryLifeResult {
  valid: boolean;
  dutyCyclePercent: number;
  averageCurrentMa: number;
  effectiveCapacityMah: number;
  runtimeHours: number;
  runtimeDays: number;
  activeSharePercent: number;
}

export function calculateBatteryLife(
  capacityMah: number,
  activeCurrentMa: number,
  sleepCurrentUa: number,
  activeDurationSec: number,
  cyclePeriodSec: number,
  efficiencyPercent: number = 85
): BatteryLifeResult {
  if (
    capacityMah <= 0 ||
    activeCurrentMa < 0 ||
    sleepCurrentUa < 0 ||
    cyclePeriodSec <= 0 ||
    activeDurationSec < 0 ||
    efficiencyPercent <= 0
  ) {
    return {
      valid: false,
      dutyCyclePercent: 0,
      averageCurrentMa: 0,
      effectiveCapacityMah: 0,
      runtimeHours: 0,
      runtimeDays: 0,
      activeSharePercent: 0,
    };
  }

  const clampedActiveSec = Math.min(activeDurationSec, cyclePeriodSec);
  const dutyCycle = clampedActiveSec / cyclePeriodSec;
  const sleepCurrentMa = sleepCurrentUa / 1000;
  const averageCurrentMa = activeCurrentMa * dutyCycle + sleepCurrentMa * (1 - dutyCycle);
  const effectiveCapacityMah = capacityMah * (Math.min(100, efficiencyPercent) / 100);
  const runtimeHours = averageCurrentMa > 0 ? effectiveCapacityMah / averageCurrentMa : 0;
  const runtimeDays = runtimeHours / 24;
  const activeSharePercent =
    averageCurrentMa > 0 ? ((activeCurrentMa * dutyCycle) / averageCurrentMa) * 100 : 0;

  return {
    valid: true,
    dutyCyclePercent: dutyCycle * 100,
    averageCurrentMa,
    effectiveCapacityMah,
    runtimeHours,
    runtimeDays,
    activeSharePercent,
  };
}

export interface TraceWidthResult {
  valid: boolean;
  areaMil2: number;
  widthMil: number;
  widthMm: number;
  resistanceMilliohmPerCm: number;
  voltageDropMvPerCm: number;
}

// IPC-2221 standard trace width formula
export function calculateTraceWidth(
  currentAmps: number,
  copperOz: number,
  tempRiseC: number,
  isExternal: boolean = true
): TraceWidthResult {
  if (currentAmps <= 0 || copperOz <= 0 || tempRiseC <= 0) {
    return {
      valid: false,
      areaMil2: 0,
      widthMil: 0,
      widthMm: 0,
      resistanceMilliohmPerCm: 0,
      voltageDropMvPerCm: 0,
    };
  }
  const k = isExternal ? 0.048 : 0.024;
  const b = 0.44;
  const c = 0.725;
  const areaMil2 = Math.pow(currentAmps / (k * Math.pow(tempRiseC, b)), 1 / c);
  const thicknessMil = copperOz * 1.378;
  const widthMil = areaMil2 / thicknessMil;
  const widthMm = widthMil * 0.0254;

  // Copper resistivity ~ 1.72e-6 ohm*cm; 1 mil^2 = 6.4516e-6 cm^2
  const areaCm2 = areaMil2 * 6.4516e-6;
  const resistanceOhmPerCm = 1.72e-6 / areaCm2;
  const resistanceMilliohmPerCm = resistanceOhmPerCm * 1000;
  const voltageDropMvPerCm = currentAmps * resistanceMilliohmPerCm;

  return {
    valid: true,
    areaMil2,
    widthMil,
    widthMm,
    resistanceMilliohmPerCm,
    voltageDropMvPerCm,
  };
}

export function formatResistance(ohms: number): string {
  if (ohms >= 1_000_000) return `${(ohms / 1_000_000).toFixed(2)} MΩ`;
  if (ohms >= 1_000) return `${(ohms / 1_000).toFixed(2)} kΩ`;
  return `${ohms.toFixed(1)} Ω`;
}

export function formatFrequency(hz: number): string {
  if (hz >= 1_000_000) return `${(hz / 1_000_000).toFixed(2)} MHz`;
  if (hz >= 1_000) return `${(hz / 1_000).toFixed(2)} kHz`;
  return `${hz.toFixed(2)} Hz`;
}

import type {
  ErcDiagnostic,
  Esp32PinSpec,
  PeripheralFilter,
  PinAssignment,
  PinFunctionType,
} from '../types/hardware';

// Standard 38-pin ESP32-WROOM-32 DevKitC / DevKit V1 physical pinout
export const ESP32_DEVKIT_PINS: Esp32PinSpec[] = [
  // Left header (pins 1..19 top to bottom)
  {
    physicalPin: 1,
    side: 'left',
    positionIndex: 0,
    label: '3V3',
    gpio: null,
    defaultRole: '3.3V Regulated Power',
    isPower: true,
    supportsPwm: false,
    maxCurrentMa: 600,
  },
  {
    physicalPin: 2,
    side: 'left',
    positionIndex: 1,
    label: 'EN',
    gpio: null,
    defaultRole: 'Chip Enable / Reset (Active Low)',
    isControl: true,
    supportsPwm: false,
    maxCurrentMa: 5,
  },
  {
    physicalPin: 3,
    side: 'left',
    positionIndex: 2,
    label: 'GPIO36 (VP)',
    gpio: 36,
    defaultRole: 'ADC1_CH0 / Input Only',
    inputOnly: true,
    adcChannel: 'ADC1_CH0',
    adcUnit: 1,
    supportsPwm: false,
    maxCurrentMa: 0,
  },
  {
    physicalPin: 4,
    side: 'left',
    positionIndex: 3,
    label: 'GPIO39 (VN)',
    gpio: 39,
    defaultRole: 'ADC1_CH3 / Input Only',
    inputOnly: true,
    adcChannel: 'ADC1_CH3',
    adcUnit: 1,
    supportsPwm: false,
    maxCurrentMa: 0,
  },
  {
    physicalPin: 5,
    side: 'left',
    positionIndex: 4,
    label: 'GPIO34',
    gpio: 34,
    defaultRole: 'ADC1_CH6 / Input Only',
    inputOnly: true,
    adcChannel: 'ADC1_CH6',
    adcUnit: 1,
    supportsPwm: false,
    maxCurrentMa: 0,
  },
  {
    physicalPin: 6,
    side: 'left',
    positionIndex: 5,
    label: 'GPIO35',
    gpio: 35,
    defaultRole: 'ADC1_CH7 / Input Only',
    inputOnly: true,
    adcChannel: 'ADC1_CH7',
    adcUnit: 1,
    supportsPwm: false,
    maxCurrentMa: 0,
  },
  {
    physicalPin: 7,
    side: 'left',
    positionIndex: 6,
    label: 'GPIO32',
    gpio: 32,
    defaultRole: 'ADC1_CH4 / TOUCH9 / PWM',
    adcChannel: 'ADC1_CH4',
    adcUnit: 1,
    touchChannel: 'TOUCH9',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 8,
    side: 'left',
    positionIndex: 7,
    label: 'GPIO33',
    gpio: 33,
    defaultRole: 'ADC1_CH5 / TOUCH8 / PWM',
    adcChannel: 'ADC1_CH5',
    adcUnit: 1,
    touchChannel: 'TOUCH8',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 9,
    side: 'left',
    positionIndex: 8,
    label: 'GPIO25',
    gpio: 25,
    defaultRole: 'DAC1 / ADC2_CH8 / PWM',
    adcChannel: 'ADC2_CH8',
    adcUnit: 2,
    dacChannel: 'DAC_1',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 10,
    side: 'left',
    positionIndex: 9,
    label: 'GPIO26',
    gpio: 26,
    defaultRole: 'DAC2 / ADC2_CH9 / PWM',
    adcChannel: 'ADC2_CH9',
    adcUnit: 2,
    dacChannel: 'DAC_2',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 11,
    side: 'left',
    positionIndex: 10,
    label: 'GPIO27',
    gpio: 27,
    defaultRole: 'ADC2_CH7 / TOUCH7 / PWM',
    adcChannel: 'ADC2_CH7',
    adcUnit: 2,
    touchChannel: 'TOUCH7',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 12,
    side: 'left',
    positionIndex: 11,
    label: 'GPIO14',
    gpio: 14,
    defaultRole: 'HSPI_CLK / ADC2_CH6 / TOUCH6',
    adcChannel: 'ADC2_CH6',
    adcUnit: 2,
    touchChannel: 'TOUCH6',
    spiRole: 'HSPI_SCK',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 13,
    side: 'left',
    positionIndex: 12,
    label: 'GPIO12',
    gpio: 12,
    defaultRole: 'HSPI_MISO / Strapping (MTDI)',
    strappingPin: true,
    strappingNoteAr: 'منفذ تهيئة الإقلاع: ارتفاع الجهد عند الإقلاع يضبط فولتية الفلاش إلى 1.8V وقد يمنع الإقلاع.',
    strappingNoteEn: 'Strapping pin: HIGH at boot selects 1.8V flash voltage and can prevent booting.',
    adcChannel: 'ADC2_CH5',
    adcUnit: 2,
    touchChannel: 'TOUCH5',
    spiRole: 'HSPI_MISO',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 14,
    side: 'left',
    positionIndex: 13,
    label: 'GND',
    gpio: null,
    defaultRole: 'Ground Reference (0V)',
    isGround: true,
    supportsPwm: false,
    maxCurrentMa: 0,
  },
  {
    physicalPin: 15,
    side: 'left',
    positionIndex: 14,
    label: 'GPIO13',
    gpio: 13,
    defaultRole: 'HSPI_MOSI / ADC2_CH4 / TOUCH4',
    adcChannel: 'ADC2_CH4',
    adcUnit: 2,
    touchChannel: 'TOUCH4',
    spiRole: 'HSPI_MOSI',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 16,
    side: 'left',
    positionIndex: 15,
    label: 'GPIO9 (SD2)',
    gpio: 9,
    defaultRole: 'SPI Flash D2 (Reserved)',
    flashReserved: true,
    supportsPwm: false,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 17,
    side: 'left',
    positionIndex: 16,
    label: 'GPIO10 (SD3)',
    gpio: 10,
    defaultRole: 'SPI Flash D3 (Reserved)',
    flashReserved: true,
    supportsPwm: false,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 18,
    side: 'left',
    positionIndex: 17,
    label: 'GPIO11 (CMD)',
    gpio: 11,
    defaultRole: 'SPI Flash CMD (Reserved)',
    flashReserved: true,
    supportsPwm: false,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 19,
    side: 'left',
    positionIndex: 18,
    label: 'VIN (5V)',
    gpio: null,
    defaultRole: '5V External Supply Input',
    isPower: true,
    supportsPwm: false,
    maxCurrentMa: 1000,
  },

  // Right header (pins 20..38 top to bottom)
  {
    physicalPin: 20,
    side: 'right',
    positionIndex: 0,
    label: 'GND',
    gpio: null,
    defaultRole: 'Ground Reference (0V)',
    isGround: true,
    supportsPwm: false,
    maxCurrentMa: 0,
  },
  {
    physicalPin: 21,
    side: 'right',
    positionIndex: 1,
    label: 'GPIO23',
    gpio: 23,
    defaultRole: 'VSPI_MOSI / PWM',
    spiRole: 'VSPI_MOSI',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 22,
    side: 'right',
    positionIndex: 2,
    label: 'GPIO22',
    gpio: 22,
    defaultRole: 'I2C_SCL Default / PWM',
    i2cDefault: 'SCL',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 23,
    side: 'right',
    positionIndex: 3,
    label: 'GPIO1 (TX0)',
    gpio: 1,
    defaultRole: 'UART0_TX / USB Serial Debug',
    uartRole: 'UART0_TX',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 24,
    side: 'right',
    positionIndex: 4,
    label: 'GPIO3 (RX0)',
    gpio: 3,
    defaultRole: 'UART0_RX / USB Serial Debug',
    uartRole: 'UART0_RX',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 25,
    side: 'right',
    positionIndex: 5,
    label: 'GPIO21',
    gpio: 21,
    defaultRole: 'I2C_SDA Default / PWM',
    i2cDefault: 'SDA',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 26,
    side: 'right',
    positionIndex: 6,
    label: 'GND',
    gpio: null,
    defaultRole: 'Ground Reference (0V)',
    isGround: true,
    supportsPwm: false,
    maxCurrentMa: 0,
  },
  {
    physicalPin: 27,
    side: 'right',
    positionIndex: 7,
    label: 'GPIO19',
    gpio: 19,
    defaultRole: 'VSPI_MISO / PWM',
    spiRole: 'VSPI_MISO',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 28,
    side: 'right',
    positionIndex: 8,
    label: 'GPIO18',
    gpio: 18,
    defaultRole: 'VSPI_SCK / PWM',
    spiRole: 'VSPI_SCK',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 29,
    side: 'right',
    positionIndex: 9,
    label: 'GPIO5',
    gpio: 5,
    defaultRole: 'VSPI_CS / Strapping / PWM',
    strappingPin: true,
    strappingNoteAr: 'منفذ تهيئة الإقلاع: يرسل نبضة PWM قصيرة عند الإقلاع لضبط توقيت SDIO.',
    strappingNoteEn: 'Strapping pin: outputs brief PWM at boot for SDIO timing.',
    spiRole: 'VSPI_CS',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 30,
    side: 'right',
    positionIndex: 10,
    label: 'GPIO17',
    gpio: 17,
    defaultRole: 'UART2_TX / PWM',
    uartRole: 'UART2_TX',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 31,
    side: 'right',
    positionIndex: 11,
    label: 'GPIO16',
    gpio: 16,
    defaultRole: 'UART2_RX / PWM',
    uartRole: 'UART2_RX',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 32,
    side: 'right',
    positionIndex: 12,
    label: 'GPIO4',
    gpio: 4,
    defaultRole: 'ADC2_CH0 / TOUCH0 / PWM',
    adcChannel: 'ADC2_CH0',
    adcUnit: 2,
    touchChannel: 'TOUCH0',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 33,
    side: 'right',
    positionIndex: 13,
    label: 'GPIO0',
    gpio: 0,
    defaultRole: 'BOOT Mode / ADC2_CH1 / TOUCH1',
    strappingPin: true,
    strappingNoteAr: 'منفذ BOOT: سحبه للأسفل أثناء التشغيل يدخل الشريحة في وضع البرمجة.',
    strappingNoteEn: 'BOOT strapping pin: pulling LOW at reset enters serial bootloader.',
    adcChannel: 'ADC2_CH1',
    adcUnit: 2,
    touchChannel: 'TOUCH1',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 34,
    side: 'right',
    positionIndex: 14,
    label: 'GPIO2',
    gpio: 2,
    defaultRole: 'Onboard LED / ADC2_CH2 / Strapping',
    strappingPin: true,
    strappingNoteAr: 'متصل بمؤشر LED الداخلي ومنفذ تهيئة الإقلاع؛ يجب أن يكون منخفضاً أو عائماً للبرمجة.',
    strappingNoteEn: 'Connected to onboard LED & boot strapping; must be floating or LOW during flashing.',
    adcChannel: 'ADC2_CH2',
    adcUnit: 2,
    touchChannel: 'TOUCH2',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 35,
    side: 'right',
    positionIndex: 15,
    label: 'GPIO15',
    gpio: 15,
    defaultRole: 'HSPI_CS / ADC2_CH3 / Strapping',
    strappingPin: true,
    strappingNoteAr: 'منفذ تهيئة: سحبه للأسفل يكتم رسائل الإقلاع على منفذ UART0.',
    strappingNoteEn: 'Strapping pin: pulling LOW silences boot log messages on UART0.',
    adcChannel: 'ADC2_CH3',
    adcUnit: 2,
    touchChannel: 'TOUCH3',
    spiRole: 'HSPI_CS',
    supportsPwm: true,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 36,
    side: 'right',
    positionIndex: 16,
    label: 'GPIO8 (SD1)',
    gpio: 8,
    defaultRole: 'SPI Flash D1 (Reserved)',
    flashReserved: true,
    supportsPwm: false,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 37,
    side: 'right',
    positionIndex: 17,
    label: 'GPIO7 (SD0)',
    gpio: 7,
    defaultRole: 'SPI Flash D0 (Reserved)',
    flashReserved: true,
    supportsPwm: false,
    maxCurrentMa: 40,
  },
  {
    physicalPin: 38,
    side: 'right',
    positionIndex: 18,
    label: 'GPIO6 (CLK)',
    gpio: 6,
    defaultRole: 'SPI Flash CLK (Reserved)',
    flashReserved: true,
    supportsPwm: false,
    maxCurrentMa: 40,
  },
];

export function matchesPeripheralFilter(pin: Esp32PinSpec, filter: PeripheralFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'power') return Boolean(pin.isPower || pin.isGround || pin.isControl);
  if (filter === 'i2c') return Boolean(pin.i2cDefault || (pin.gpio !== null && !pin.inputOnly && !pin.flashReserved));
  if (filter === 'spi') return Boolean(pin.spiRole);
  if (filter === 'uart') return Boolean(pin.uartRole);
  if (filter === 'adc') return Boolean(pin.adcChannel);
  if (filter === 'pwm') return pin.supportsPwm;
  if (filter === 'dac') return Boolean(pin.dacChannel);
  return true;
}

export function getAllowedFunctionsForPin(pin: Esp32PinSpec): PinFunctionType[] {
  if (pin.isPower) return ['power'];
  if (pin.isGround) return ['gnd'];
  if (pin.isControl) return ['control'];
  if (pin.flashReserved) return ['unassigned', 'gpio_out', 'gpio_in']; // Allow selecting to demonstrate ERC error if someone forces it
  if (pin.inputOnly) return ['unassigned', 'gpio_in', 'adc'];

  const funcs: PinFunctionType[] = ['unassigned', 'gpio_out', 'gpio_in', 'pwm', 'i2c', 'spi', 'uart'];
  if (pin.adcChannel) funcs.push('adc');
  if (pin.dacChannel) funcs.push('dac');
  if (pin.touchChannel) funcs.push('touch');
  return funcs;
}

export function runElectricalRuleCheck(
  assignments: Record<number, PinAssignment>,
  wifiEnabled: boolean
): ErcDiagnostic[] {
  const diagnostics: ErcDiagnostic[] = [];
  const signalNameMap = new Map<string, Esp32PinSpec[]>();
  let totalGpioCurrentMa = 0;

  for (const pin of ESP32_DEVKIT_PINS) {
    const assigned = assignments[pin.physicalPin];
    if (!assigned || assigned.functionType === 'unassigned') continue;

    // Track duplicate signal names (excluding shared bus lines like I2C SDA/SCL or GND/3V3)
    const normalizedSig = assigned.signalName.trim().toUpperCase();
    if (normalizedSig && !pin.isPower && !pin.isGround) {
      const existing = signalNameMap.get(normalizedSig) ?? [];
      existing.push(pin);
      signalNameMap.set(normalizedSig, existing);
    }

    // 1. Flash reserved pins GPIO 6-11
    if (pin.flashReserved) {
      diagnostics.push({
        id: `erc-flash-${pin.physicalPin}`,
        severity: 'error',
        physicalPin: pin.physicalPin,
        pinLabel: pin.label,
        titleAr: 'تعارض ذاكرة الفلاش الداخلية (SPI Flash)',
        titleEn: 'Internal SPI Flash Pin Conflict',
        detailAr: `المنفذ ${pin.label} متصل بذاكرة الفلاش الداخلية؛ استخدامه لـ "${assigned.signalName}" سيؤدي إلى انهيار المعالج.`,
        detailEn: `${pin.label} is wired to internal SPI flash; assigning "${assigned.signalName}" will crash the MCU.`,
      });
    }

    // 2. Input-only pins (GPIO 34, 35, 36, 39) configured as output/PWM/I2C/SPI/DAC
    if (
      pin.inputOnly &&
      ['gpio_out', 'pwm', 'i2c', 'spi', 'dac'].includes(assigned.functionType)
    ) {
      diagnostics.push({
        id: `erc-input-only-${pin.physicalPin}`,
        severity: 'error',
        physicalPin: pin.physicalPin,
        pinLabel: pin.label,
        titleAr: 'منفذ إدخال فقط مُعدّ كمخرج',
        titleEn: 'Output Assigned to Input-Only Pin',
        detailAr: `المنفذ ${pin.label} يدعم الإدخال فقط (بدون مقاومات سحب داخلية) ولا يمكن استخدامه لوظيفة ${assigned.functionType.toUpperCase()}.`,
        detailEn: `${pin.label} is strictly input-only (no internal pull-up/down) and cannot drive ${assigned.functionType.toUpperCase()}.`,
      });
    }

    // 3. ADC2 + Wi-Fi conflict
    if (wifiEnabled && pin.adcUnit === 2 && assigned.functionType === 'adc') {
      diagnostics.push({
        id: `erc-adc2-wifi-${pin.physicalPin}`,
        severity: 'error',
        physicalPin: pin.physicalPin,
        pinLabel: pin.label,
        titleAr: 'تعارض ADC2 مع شبكة Wi-Fi',
        titleEn: 'ADC2 Blocked While Wi-Fi Active',
        detailAr: `قناة ${pin.adcChannel} على ${pin.label} تتوقف عن القراءة عند تفعيل Wi-Fi. انقل الإشارة التناظرية إلى ADC1 (GPIO32–39).`,
        detailEn: `${pin.adcChannel} on ${pin.label} cannot read analog voltages while Wi-Fi is active. Move to ADC1 (GPIO32–39).`,
      });
    }

    // 4. Per-pin over-current (> 40mA on GPIO)
    if (pin.gpio !== null && !pin.inputOnly && assigned.currentMa > pin.maxCurrentMa) {
      diagnostics.push({
        id: `erc-overcurrent-${pin.physicalPin}`,
        severity: 'error',
        physicalPin: pin.physicalPin,
        pinLabel: pin.label,
        titleAr: 'تجاوز الحد الأقصى لتيار المنفذ',
        titleEn: 'Pin Current Limit Exceeded',
        detailAr: `التيار المسجل (${assigned.currentMa}mA) يتجاوز حد الأمان للمنفذ ${pin.label} (${pin.maxCurrentMa}mA). استخدم ترانزستور أو MOSFET.`,
        detailEn: `Assigned load (${assigned.currentMa}mA) exceeds ${pin.label} max sink/source rating (${pin.maxCurrentMa}mA). Add a driver stage.`,
      });
    }

    // 5. UART0 debug console warning (GPIO1/GPIO3)
    if ((pin.gpio === 1 || pin.gpio === 3) && assigned.functionType !== 'uart') {
      diagnostics.push({
        id: `erc-uart0-${pin.physicalPin}`,
        severity: 'warning',
        physicalPin: pin.physicalPin,
        pinLabel: pin.label,
        titleAr: 'استخدام منفذ تصحيح USB Serial',
        titleEn: 'Shared with USB Serial Debug (UART0)',
        detailAr: `استخدام ${pin.label} لوظيفة "${assigned.signalName}" قد يعطّل منفذ المراقبة التسلسلي أثناء البرمجة والتشغيل.`,
        detailEn: `Using ${pin.label} for "${assigned.signalName}" interferes with USB serial console logging and flashing.`,
      });
    }

    // 6. Strapping pin warning
    if (pin.strappingPin) {
      diagnostics.push({
        id: `erc-strapping-${pin.physicalPin}`,
        severity: 'warning',
        physicalPin: pin.physicalPin,
        pinLabel: pin.label,
        titleAr: 'تنبيه منفذ تهيئة الإقلاع (Strapping)',
        titleEn: 'Boot Strapping Pin Caution',
        detailAr: pin.strappingNoteAr ?? '',
        detailEn: pin.strappingNoteEn ?? '',
      });
    }

    if (pin.gpio !== null && !pin.isPower && !pin.isGround) {
      totalGpioCurrentMa += assigned.currentMa;
    }
  }

  // 7. Duplicate signal names
  for (const [sig, pins] of signalNameMap.entries()) {
    if (pins.length > 1) {
      diagnostics.push({
        id: `erc-dup-sig-${sig}`,
        severity: 'warning',
        physicalPin: pins[0].physicalPin,
        pinLabel: pins.map((p) => p.label).join(', '),
        titleAr: `تكرار اسم الإشارة "${sig}"`,
        titleEn: `Duplicate Signal Name "${sig}"`,
        detailAr: `الإشارة "${sig}" معينة على أكثر من منفذ (${pins.map((p) => p.label).join('، ')}).`,
        detailEn: `Signal "${sig}" is assigned to multiple GPIOs (${pins.map((p) => p.label).join(', ')}).`,
      });
    }
  }

  // 8. Total chip GPIO budget check (ESP32 package absolute max ~ 1200mA, recommended <= 250mA continuous GPIO)
  if (totalGpioCurrentMa > 250) {
    diagnostics.push({
      id: 'erc-total-gpio-current',
      severity: 'warning',
      physicalPin: 1,
      pinLabel: '3V3 / GPIO',
      titleAr: 'إجمالي تيار المنافذ مرتفع',
      titleEn: 'High Cumulative GPIO Current',
      detailAr: `مجموع تيار منافذ GPIO بلغ ${totalGpioCurrentMa}mA (ينصح بأقل من 250mA لتجنب سخونة الشريحة).`,
      detailEn: `Cumulative GPIO current is ${totalGpioCurrentMa}mA (recommended < 250mA continuous).`,
    });
  }

  return diagnostics;
}

export function calculatePinPlannerSummary(assignments: Record<number, PinAssignment>) {
  const usablePins = ESP32_DEVKIT_PINS.filter(
    (p) => p.gpio !== null && !p.flashReserved
  );
  let assignedCount = 0;
  let totalGpioCurrentMa = 0;
  let i2cCount = 0;
  let spiCount = 0;
  let uartCount = 0;
  let pwmCount = 0;
  let adcCount = 0;

  for (const pin of usablePins) {
    const a = assignments[pin.physicalPin];
    if (a && a.functionType !== 'unassigned') {
      assignedCount++;
      totalGpioCurrentMa += a.currentMa;
      if (a.functionType === 'i2c') i2cCount++;
      if (a.functionType === 'spi') spiCount++;
      if (a.functionType === 'uart') uartCount++;
      if (a.functionType === 'pwm') pwmCount++;
      if (a.functionType === 'adc') adcCount++;
    }
  }

  return {
    totalUsableGpio: usablePins.length,
    assignedCount,
    utilizationPercent: Math.round((assignedCount / usablePins.length) * 100),
    totalGpioCurrentMa,
    busCounts: { i2c: i2cCount, spi: spiCount, uart: uartCount, pwm: pwmCount, adc: adcCount },
  };
}

export function generateFirmwarePinHeader(
  projectName: string,
  assignments: Record<number, PinAssignment>,
  format: 'cpp' | 'micropython' = 'cpp'
): string {
  const entries = ESP32_DEVKIT_PINS.filter((p) => {
    const a = assignments[p.physicalPin];
    return p.gpio !== null && a && a.functionType !== 'unassigned';
  }).map((p) => ({
    pin: p,
    assignment: assignments[p.physicalPin],
  }));

  if (format === 'micropython') {
    const lines = [
      `# Auto-generated by ProtoPath Pin Planner`,
      `# Project: ${projectName}`,
      `from machine import Pin`,
      ``,
    ];
    for (const { pin, assignment } of entries) {
      const safeName = assignment.signalName
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || `PIN_${pin.gpio}`;
      lines.push(`${safeName}_GPIO = ${pin.gpio}  # ${assignment.functionType.toUpperCase()} (${assignment.currentMa}mA)`);
    }
    if (entries.length === 0) {
      lines.push(`# No GPIOs assigned yet.`);
    }
    return lines.join('\n');
  }

  const lines = [
    `// Auto-generated by ProtoPath Pin Planner`,
    `// Project: ${projectName}`,
    `#pragma once`,
    `#include <stdint.h>`,
    ``,
  ];
  for (const { pin, assignment } of entries) {
    const safeName = assignment.signalName
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || `PIN_${pin.gpio}`;
    lines.push(
      `constexpr uint8_t PIN_${safeName} = ${pin.gpio}; // ${assignment.functionType.toUpperCase()} · ${assignment.currentMa}mA`
    );
  }
  if (entries.length === 0) {
    lines.push(`// No GPIOs assigned yet.`);
  }
  return lines.join('\n');
}

import type { BomItem, BomStatus, CatalogComponent, ComponentCategory } from '../types/hardware';

export const COMPONENT_CATALOG: CatalogComponent[] = [
  {
    id: 'comp-esp32-devkit',
    name: 'ESP32-WROOM-32 DevKit V1',
    nameAr: 'لوحة تطوير ESP32-WROOM-32',
    partNumber: 'ESP32-DEVKITC-32D',
    category: 'comms',
    packageType: 'DIP-38 Module',
    voltageRail: '5V',
    protocol: 'Wi-Fi / BLE / GPIO',
    typicalCurrentMa: 80,
    peakCurrentMa: 240,
    unitPriceUsd: 6.5,
    pinsRequired: 0,
    summaryAr: 'متحكم ثنائي النواة 240MHz مع Wi-Fi و Bluetooth ومنظم جهد 3.3V مدمج.',
    summaryEn: 'Dual-core 240MHz MCU with integrated Wi-Fi/BLE and onboard 3.3V LDO regulator.',
  },
  {
    id: 'comp-bme280',
    name: 'BME280 Env Sensor',
    nameAr: 'مستشعر الحرارة والرطوبة والضغط BME280',
    partNumber: 'GY-BME280-3.3',
    category: 'sensors',
    packageType: 'Breakout 4-Pin',
    voltageRail: '3.3V',
    protocol: 'I2C / SPI',
    i2cAddress: '0x76',
    typicalCurrentMa: 0.4,
    peakCurrentMa: 1.0,
    unitPriceUsd: 4.2,
    pinsRequired: 2,
    summaryAr: 'قياس دقيق للحرارة والرطوبة النسبية والضغط الجوي باستهلاك منخفض جداً.',
    summaryEn: 'High-accuracy temperature, humidity, and barometric pressure sensor.',
  },
  {
    id: 'comp-ssd1306',
    name: 'OLED Display 0.96" 128×64',
    nameAr: 'شاشة OLED قياس 0.96 بوصة',
    partNumber: 'SSD1306-I2C-12864',
    category: 'displays',
    packageType: 'Module 4-Pin',
    voltageRail: '3.3V',
    protocol: 'I2C',
    i2cAddress: '0x3C',
    typicalCurrentMa: 15,
    peakCurrentMa: 25,
    unitPriceUsd: 3.8,
    pinsRequired: 2,
    summaryAr: 'شاشة عالية التباين لعرض القراءات الفورية عبر ناقل I2C.',
    summaryEn: 'High-contrast monochrome OLED screen driven over 2-wire I2C.',
  },
  {
    id: 'comp-ina219',
    name: 'INA219 Current/Power Monitor',
    nameAr: 'مراقب التيار والجهد INA219',
    partNumber: 'CJMCU-219',
    category: 'sensors',
    packageType: 'SOT23-8 Breakout',
    voltageRail: '3.3V',
    protocol: 'I2C',
    i2cAddress: '0x40',
    typicalCurrentMa: 1.0,
    peakCurrentMa: 1.5,
    unitPriceUsd: 2.9,
    pinsRequired: 2,
    summaryAr: 'قياس التيار والجهد المستمر عبر مقاومة Shunt بدقة 12-bit.',
    summaryEn: 'High-side bidirectional DC current and power monitor via I2C.',
  },
  {
    id: 'comp-vl53l0x',
    name: 'VL53L0X ToF Laser Range',
    nameAr: 'مستشعر مسافة ليزري VL53L0X',
    partNumber: 'GY-530-VL53L0X',
    category: 'sensors',
    packageType: 'Breakout 6-Pin',
    voltageRail: '3.3V',
    protocol: 'I2C',
    i2cAddress: '0x29',
    typicalCurrentMa: 19,
    peakCurrentMa: 40,
    unitPriceUsd: 4.9,
    pinsRequired: 2,
    summaryAr: 'قياس المسافة بالليزر Time-of-Flight حتى مدى 2 متر.',
    summaryEn: 'Time-of-Flight laser-ranging sensor up to 2m via I2C.',
  },
  {
    id: 'comp-mpu6050',
    name: 'MPU6050 6-Axis IMU',
    nameAr: 'مستشعر الحركة والجيروسكوب MPU6050',
    partNumber: 'GY-521',
    category: 'sensors',
    packageType: 'Breakout 8-Pin',
    voltageRail: '3.3V',
    protocol: 'I2C',
    i2cAddress: '0x68',
    typicalCurrentMa: 3.9,
    peakCurrentMa: 5.0,
    unitPriceUsd: 2.4,
    pinsRequired: 2,
    summaryAr: 'مقياس تسارع ثلاثي المحاور + جيروسكوب مع معالج حركة مدمج DMP.',
    summaryEn: '3-axis accelerometer and 3-axis gyroscope with onboard DMP.',
  },
  {
    id: 'comp-tb6612',
    name: 'TB6612FNG Dual Motor Driver',
    nameAr: 'مشغل محركات مزدوج TB6612FNG',
    partNumber: 'POLOLU-713',
    category: 'actuators',
    packageType: 'DIP-24 Breakout',
    voltageRail: '3.3V / 5V',
    protocol: 'PWM + GPIO',
    typicalCurrentMa: 12,
    peakCurrentMa: 25,
    unitPriceUsd: 4.5,
    pinsRequired: 6,
    summaryAr: 'جسر H مزدوج عالي الكفاءة بقدرة 1.2A مستمر لكل قناة مع تحكم PWM.',
    summaryEn: 'Dual H-bridge MOSFET motor driver rated at 1.2A continuous per channel.',
  },
  {
    id: 'comp-sg90',
    name: 'SG90 Micro Servo Motor',
    nameAr: 'محرك سيرفو صغير SG90',
    partNumber: 'TOWERPRO-SG90',
    category: 'actuators',
    packageType: '3-Pin JR',
    voltageRail: '5V',
    protocol: 'PWM 50Hz',
    typicalCurrentMa: 120,
    peakCurrentMa: 350,
    unitPriceUsd: 2.6,
    pinsRequired: 1,
    summaryAr: 'محرك سيرفو زاوية 180° يعمل بإشارة PWM تردد 50Hz.',
    summaryEn: '180-degree micro servo driven by 50Hz PWM control pulse.',
  },
  {
    id: 'comp-ws2812b',
    name: 'WS2812B RGB LED Strip (8px)',
    nameAr: 'شريط إضاءة ذكي WS2812B',
    partNumber: 'NEOPIXEL-8-STICK',
    category: 'displays',
    packageType: 'Stick 8-LED',
    voltageRail: '5V',
    protocol: '1-Wire NZR',
    typicalCurrentMa: 120,
    peakCurrentMa: 480,
    unitPriceUsd: 3.1,
    pinsRequired: 1,
    summaryAr: '8 مصابيح RGB قابلة للعنونة عبر خط بيانات واحد.',
    summaryEn: '8 addressable RGB LEDs controlled from a single GPIO data pin.',
  },
  {
    id: 'comp-lora-sx1278',
    name: 'LoRa SX1278 433MHz Module',
    nameAr: 'وحدة اتصال لاسلكي بعيد المدى LoRa',
    partNumber: 'RA-02-SX1278',
    category: 'comms',
    packageType: 'SMD/Breakout',
    voltageRail: '3.3V',
    protocol: 'SPI',
    typicalCurrentMa: 12,
    peakCurrentMa: 120,
    unitPriceUsd: 5.8,
    pinsRequired: 5,
    summaryAr: 'وحدة إرسال واستقبال بعيدة المدى بتقنية LoRa عبر واجهة SPI.',
    summaryEn: 'Long-range 433MHz LoRa transceiver communicating over SPI.',
  },
  {
    id: 'comp-microsd',
    name: 'MicroSD Card SPI Adapter',
    nameAr: 'قارئ بطاقة ذاكرة MicroSD',
    partNumber: 'SD-SPI-3V3',
    category: 'comms',
    packageType: 'Breakout 6-Pin',
    voltageRail: '3.3V',
    protocol: 'SPI',
    typicalCurrentMa: 25,
    peakCurrentMa: 80,
    unitPriceUsd: 1.9,
    pinsRequired: 4,
    summaryAr: 'لتسجيل بيانات القياس والـ Telemetry محلياً بصيغة CSV.',
    summaryEn: 'SPI MicroSD card breakout for local telemetry and CSV logging.',
  },
  {
    id: 'comp-tp4056',
    name: 'TP4056 Li-Ion Charger + Protection',
    nameAr: 'وحدة شحن بطارية ليثيوم TP4056',
    partNumber: 'TP4056-TYPEC-DW01',
    category: 'power',
    packageType: 'USB-C Module',
    voltageRail: '5V',
    protocol: 'Power / Charge',
    typicalCurrentMa: 1,
    peakCurrentMa: 5,
    unitPriceUsd: 1.2,
    pinsRequired: 0,
    summaryAr: 'شاحن بطاريات 18650 Li-Ion مع حماية التفريغ الزائد عبر DW01A.',
    summaryEn: '1A Li-Ion battery charger with dual-MOSFET over-discharge protection.',
  },
  {
    id: 'comp-ams1117',
    name: 'AMS1117-3.3 LDO Regulator',
    nameAr: 'منظم جهد خطي 3.3V AMS1117',
    partNumber: 'AMS1117-3.3-MOD',
    category: 'power',
    packageType: 'SOT-223',
    voltageRail: '5V',
    protocol: 'Power Rail',
    typicalCurrentMa: 5,
    peakCurrentMa: 10,
    unitPriceUsd: 0.75,
    pinsRequired: 0,
    summaryAr: 'منظم جهد 3.3V بتيار أقصى 800mA لتغذية الحساسات المستقلة.',
    summaryEn: '3.3V low-dropout linear voltage regulator up to 800mA.',
  },
  {
    id: 'comp-soil-adc',
    name: 'Capacitive Soil Moisture Sensor',
    nameAr: 'مستشعر رطوبة التربة السعوي',
    partNumber: 'SEN0193-V1.2',
    category: 'sensors',
    packageType: '3-Pin Analog',
    voltageRail: '3.3V',
    protocol: 'Analog ADC',
    typicalCurrentMa: 5,
    peakCurrentMa: 8,
    unitPriceUsd: 2.1,
    pinsRequired: 1,
    summaryAr: 'مستشعر مقاوم للتآكل يخرج جهداً تناظرياً مناسباً لمداخل ADC1.',
    summaryEn: 'Corrosion-resistant capacitive soil sensor with analog output for ADC1.',
  },
  {
    id: 'comp-resistor-kit',
    name: '4.7kΩ I2C Pull-up Resistors (×2)',
    nameAr: 'مقاومات رفع I2C بقيمة 4.7kΩ',
    partNumber: 'RES-0805-4K7',
    category: 'passives',
    packageType: '0805 / Axial',
    voltageRail: 'Passive',
    protocol: 'I2C Pull-Up',
    typicalCurrentMa: 0.7,
    peakCurrentMa: 1.4,
    unitPriceUsd: 0.15,
    pinsRequired: 0,
    summaryAr: 'مقاومات رفع لخطوط SDA و SCL لضمان حواف إشارة حادة.',
    summaryEn: 'Pull-up resistors for SDA/SCL lines ensuring clean rising edges.',
  },
  {
    id: 'comp-cap-decoupling',
    name: '100nF + 10µF Decoupling Caps',
    nameAr: 'مكثفات تنعيم وتثبيت الجهد',
    partNumber: 'CAP-MLCC-KIT',
    category: 'passives',
    packageType: '0805 MLCC',
    voltageRail: 'Passive',
    protocol: 'Bypass / Filter',
    typicalCurrentMa: 0,
    peakCurrentMa: 0,
    unitPriceUsd: 0.25,
    pinsRequired: 0,
    summaryAr: 'مكثفات ترشيح الضجيج عالي التردد بجانب دبابيس التغذية.',
    summaryEn: 'Bypass capacitors for suppressing high-frequency rail ripple.',
  },
];

export interface BomSummary {
  totalUniqueParts: number;
  totalUnitCount: number;
  totalCostUsd: number;
  rail3v3CurrentMa: number;
  rail5vCurrentMa: number;
  totalCurrentMa: number;
  inStockCount: number;
  neededCount: number;
  i2cAddresses: Array<{ address: string; name: string; conflict: boolean }>;
}

export function summarizeBom(bom: BomItem[]): BomSummary {
  let totalUnitCount = 0;
  let totalCostUsd = 0;
  let rail3v3CurrentMa = 0;
  let rail5vCurrentMa = 0;
  let inStockCount = 0;
  let neededCount = 0;

  const addrMap = new Map<string, string[]>();

  for (const item of bom) {
    const qty = Math.max(0, item.quantity);
    totalUnitCount += qty;
    totalCostUsd += item.unitPriceUsd * qty;

    const itemCurrent = item.typicalCurrentMa * qty;
    if (item.voltageRail === '3.3V') {
      rail3v3CurrentMa += itemCurrent;
    } else if (item.voltageRail === '5V') {
      rail5vCurrentMa += itemCurrent;
    } else if (item.voltageRail === '3.3V / 5V') {
      rail3v3CurrentMa += itemCurrent;
    }

    if (item.status === 'in_stock') inStockCount++;
    if (item.status === 'needed') neededCount++;

    if (item.i2cAddress && qty > 0) {
      const hexPart = item.i2cAddress.trim().replace(/^0x/i, '').toUpperCase();
      const addr = `0x${hexPart}`;
      const list = addrMap.get(addr) ?? [];
      list.push(item.name);
      addrMap.set(addr, list);
    }
  }

  const i2cAddresses: Array<{ address: string; name: string; conflict: boolean }> = [];
  for (const [address, names] of addrMap.entries()) {
    i2cAddresses.push({
      address,
      name: names.join(' + '),
      conflict: names.length > 1,
    });
  }

  return {
    totalUniqueParts: bom.length,
    totalUnitCount,
    totalCostUsd,
    rail3v3CurrentMa,
    rail5vCurrentMa,
    totalCurrentMa: rail3v3CurrentMa + rail5vCurrentMa,
    inStockCount,
    neededCount,
    i2cAddresses,
  };
}

export function filterCatalog(
  catalog: CatalogComponent[],
  query: string,
  category: ComponentCategory
): CatalogComponent[] {
  const q = query.trim().toLowerCase();
  return catalog.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.nameAr.toLowerCase().includes(q) ||
      item.partNumber.toLowerCase().includes(q) ||
      item.protocol.toLowerCase().includes(q)
    );
  });
}

function escapeCsvField(val: string | number): string {
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportBomToCsv(bom: BomItem[]): string {
  const header = [
    'Part Number',
    'Component Name',
    'Category',
    'Voltage Rail',
    'Protocol',
    'I2C Addr',
    'Qty',
    'Unit Price (USD)',
    'Line Total (USD)',
    'Typ Current (mA)',
    'Status',
  ].join(',');

  const rows = bom.map((item) =>
    [
      escapeCsvField(item.partNumber),
      escapeCsvField(item.name),
      escapeCsvField(item.category),
      escapeCsvField(item.voltageRail),
      escapeCsvField(item.protocol),
      escapeCsvField(item.i2cAddress ?? '-'),
      item.quantity,
      item.unitPriceUsd.toFixed(2),
      (item.unitPriceUsd * item.quantity).toFixed(2),
      (item.typicalCurrentMa * item.quantity).toFixed(1),
      escapeCsvField(item.status),
    ].join(',')
  );

  return [header, ...rows].join('\n');
}

export function createBomItemFromCatalog(
  comp: CatalogComponent,
  status: BomStatus = 'needed'
): BomItem {
  return {
    id: `bom-${comp.id}`,
    componentId: comp.id,
    name: comp.name,
    nameAr: comp.nameAr,
    partNumber: comp.partNumber,
    category: comp.category,
    voltageRail: comp.voltageRail,
    protocol: comp.protocol,
    i2cAddress: comp.i2cAddress,
    typicalCurrentMa: comp.typicalCurrentMa,
    peakCurrentMa: comp.peakCurrentMa,
    unitPriceUsd: comp.unitPriceUsd,
    quantity: 1,
    status,
  };
}

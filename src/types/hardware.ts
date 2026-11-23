export type ScreenId = 'dashboard' | 'pin-planner' | 'calculators' | 'components';

export type Language = 'ar' | 'en';

export type PinFunctionType =
  | 'unassigned'
  | 'power'
  | 'gnd'
  | 'control'
  | 'gpio_out'
  | 'gpio_in'
  | 'i2c'
  | 'spi'
  | 'uart'
  | 'adc'
  | 'dac'
  | 'pwm'
  | 'touch';

export type PeripheralFilter = 'all' | 'i2c' | 'spi' | 'uart' | 'adc' | 'pwm' | 'dac' | 'power';

export interface Esp32PinSpec {
  physicalPin: number;
  side: 'left' | 'right';
  positionIndex: number; // 0..18 top to bottom
  label: string;
  gpio: number | null; // null for 3V3, EN, GND, VIN
  defaultRole: string;
  isPower?: boolean;
  isGround?: boolean;
  isControl?: boolean;
  inputOnly?: boolean;
  flashReserved?: boolean; // GPIO6-11
  strappingPin?: boolean; // GPIO0, 2, 5, 12, 15
  strappingNoteAr?: string;
  strappingNoteEn?: string;
  adcChannel?: string; // e.g. "ADC1_CH0" or "ADC2_CH4"
  adcUnit?: 1 | 2;
  dacChannel?: string;
  touchChannel?: string;
  uartRole?: string;
  spiRole?: string;
  i2cDefault?: string;
  supportsPwm: boolean;
  maxCurrentMa: number;
}

export interface PinAssignment {
  physicalPin: number;
  signalName: string;
  functionType: PinFunctionType;
  componentRef?: string;
  currentMa: number;
  notes?: string;
}

export interface ErcDiagnostic {
  id: string;
  severity: 'error' | 'warning';
  physicalPin: number;
  pinLabel: string;
  titleAr: string;
  titleEn: string;
  detailAr: string;
  detailEn: string;
}

export type ComponentCategory = 'all' | 'sensors' | 'displays' | 'actuators' | 'power' | 'comms' | 'passives';

export type BomStatus = 'in_stock' | 'ordered' | 'needed';

export interface CatalogComponent {
  id: string;
  name: string;
  nameAr: string;
  partNumber: string;
  category: Exclude<ComponentCategory, 'all'>;
  packageType: string;
  voltageRail: '3.3V' | '5V' | '3.3V / 5V' | 'Passive';
  protocol: string;
  i2cAddress?: string;
  typicalCurrentMa: number;
  peakCurrentMa: number;
  unitPriceUsd: number;
  pinsRequired: number;
  summaryAr: string;
  summaryEn: string;
}

export interface BomItem {
  id: string;
  componentId: string;
  name: string;
  nameAr: string;
  partNumber: string;
  category: Exclude<ComponentCategory, 'all'>;
  voltageRail: '3.3V' | '5V' | '3.3V / 5V' | 'Passive';
  protocol: string;
  i2cAddress?: string;
  typicalCurrentMa: number;
  peakCurrentMa: number;
  unitPriceUsd: number;
  quantity: number;
  status: BomStatus;
}

export interface HardwareProject {
  id: string;
  nameAr: string;
  nameEn: string;
  boardName: string;
  descriptionAr: string;
  descriptionEn: string;
  wifiEnabled: boolean;
  supplyVoltageV: number;
  regulatorLimitMa: number;
  assignments: Record<number, PinAssignment>;
  bom: BomItem[];
}

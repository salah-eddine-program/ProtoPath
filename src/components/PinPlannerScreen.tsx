import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Eraser,
  Search,
  ShieldAlert,
  Wifi,
} from 'lucide-react';
import type {
  HardwareProject,
  Language,
  PeripheralFilter,
  PinAssignment,
  PinFunctionType,
} from '../types/hardware';
import { UI_COPY } from '../i18n/translations';
import {
  ESP32_DEVKIT_PINS,
  generateFirmwarePinHeader,
  getAllowedFunctionsForPin,
  matchesPeripheralFilter,
  runElectricalRuleCheck,
} from '../utils/pinPlanner';

interface PinPlannerScreenProps {
  project: HardwareProject;
  language: Language;
  selectedPhysicalPin: number;
  prefilledComponentName?: string;
  onSelectPhysicalPin: (physicalPin: number) => void;
  onAssignPin: (assignment: PinAssignment) => void;
  onClearPin: (physicalPin: number) => void;
  onToggleWifi: (enabled: boolean) => void;
}

const FILTER_TABS: Array<{ id: PeripheralFilter; labelAr: string; labelEn: string }> = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
  { id: 'i2c', labelAr: 'I2C', labelEn: 'I2C' },
  { id: 'spi', labelAr: 'SPI', labelEn: 'SPI' },
  { id: 'uart', labelAr: 'UART', labelEn: 'UART' },
  { id: 'adc', labelAr: 'ADC', labelEn: 'ADC' },
  { id: 'pwm', labelAr: 'PWM', labelEn: 'PWM' },
  { id: 'dac', labelAr: 'DAC', labelEn: 'DAC' },
  { id: 'power', labelAr: 'تغذية', labelEn: 'Power' },
];

const FUNCTION_LABELS: Record<PinFunctionType, string> = {
  unassigned: 'Unassigned',
  power: 'Power Rail',
  gnd: 'Ground (0V)',
  control: 'Reset / EN',
  gpio_out: 'GPIO Output',
  gpio_in: 'GPIO Input',
  i2c: 'I2C Bus (SDA/SCL)',
  spi: 'SPI Bus',
  uart: 'UART Serial',
  adc: 'Analog Input (ADC)',
  dac: 'Analog Output (DAC)',
  pwm: 'PWM Output (LEDC)',
  touch: 'Capacitive Touch',
};

function getFunctionAccent(fn: PinFunctionType | undefined, hasError: boolean, hasWarning: boolean): string {
  if (hasError) return 'border-[#f43f5e] bg-[#f43f5e]/15 text-[#ffb4ab]';
  if (hasWarning) return 'border-[#ffb95f]/70 bg-[#ffb95f]/15 text-[#ffb95f]';
  switch (fn) {
    case 'i2c':
    case 'spi':
    case 'uart':
      return 'border-[#4cd7f6]/60 bg-[#4cd7f6]/12 text-[#4cd7f6]';
    case 'pwm':
    case 'gpio_out':
    case 'dac':
      return 'border-[#4edea3]/60 bg-[#4edea3]/12 text-[#4edea3]';
    case 'adc':
    case 'gpio_in':
    case 'touch':
      return 'border-[#38bdf8]/50 bg-[#38bdf8]/12 text-[#acedff]';
    default:
      return 'border-slate-400/18 bg-[#131b2e] text-[#94a3b8]';
  }
}

export function PinPlannerScreen({
  project,
  language,
  selectedPhysicalPin,
  prefilledComponentName,
  onSelectPhysicalPin,
  onAssignPin,
  onClearPin,
  onToggleWifi,
}: PinPlannerScreenProps) {
  const t = UI_COPY[language];
  const [filter, setFilter] = useState<PeripheralFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [codeFormat, setCodeFormat] = useState<'cpp' | 'micropython'>('cpp');
  const [copied, setCopied] = useState(false);

  const selectedPinSpec =
    ESP32_DEVKIT_PINS.find((p) => p.physicalPin === selectedPhysicalPin) ??
    ESP32_DEVKIT_PINS[24]; // default GPIO21

  const existingAssignment = project.assignments[selectedPinSpec.physicalPin];

  const [signalName, setSignalName] = useState(existingAssignment?.signalName ?? '');
  const [functionType, setFunctionType] = useState<PinFunctionType>(
    existingAssignment?.functionType ?? 'gpio_out'
  );
  const [componentRef, setComponentRef] = useState(
    existingAssignment?.componentRef ?? prefilledComponentName ?? ''
  );
  const [currentMa, setCurrentMa] = useState<string>(
    String(existingAssignment?.currentMa ?? 5)
  );
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const current = project.assignments[selectedPinSpec.physicalPin];
    setSignalName(current?.signalName ?? '');
    if (current) {
      setFunctionType(current.functionType);
    } else if (selectedPinSpec.inputOnly) {
      setFunctionType('adc');
    } else if (selectedPinSpec.i2cDefault) {
      setFunctionType('i2c');
    } else {
      setFunctionType('gpio_out');
    }
    setComponentRef(current?.componentRef ?? prefilledComponentName ?? '');
    setCurrentMa(String(current?.currentMa ?? (selectedPinSpec.inputOnly ? 1 : 5)));
    setFormError(null);
  }, [selectedPinSpec.physicalPin, project.assignments, prefilledComponentName]);

  const diagnostics = runElectricalRuleCheck(project.assignments, project.wifiEnabled);
  const leftPins = ESP32_DEVKIT_PINS.filter((p) => p.side === 'left').sort(
    (a, b) => a.positionIndex - b.positionIndex
  );
  const rightPins = ESP32_DEVKIT_PINS.filter((p) => p.side === 'right').sort(
    (a, b) => a.positionIndex - b.positionIndex
  );

  const query = searchQuery.trim().toLowerCase();
  const isPinHighlighted = (pinNum: number) => {
    const pin = ESP32_DEVKIT_PINS.find((p) => p.physicalPin === pinNum);
    if (!pin) return false;
    if (!matchesPeripheralFilter(pin, filter)) return false;
    if (!query) return true;
    const assigned = project.assignments[pinNum];
    return (
      pin.label.toLowerCase().includes(query) ||
      pin.defaultRole.toLowerCase().includes(query) ||
      (assigned?.signalName.toLowerCase().includes(query) ?? false)
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signalName.trim()) {
      setFormError(
        language === 'ar'
          ? 'يرجى إدخال اسم الإشارة (مثال: SENSOR_SDA).'
          : 'Please enter a signal / net name (e.g. SENSOR_SDA).'
      );
      return;
    }
    const parsedCurrent = Number(currentMa);
    if (!Number.isFinite(parsedCurrent) || parsedCurrent < 0) {
      setFormError(
        language === 'ar'
          ? 'يرجى إدخال قيمة تيار صحيحة بالملي أمبير.'
          : 'Enter a valid non-negative current value in mA.'
      );
      return;
    }
    setFormError(null);
    onAssignPin({
      physicalPin: selectedPinSpec.physicalPin,
      signalName: signalName.trim(),
      functionType,
      componentRef: componentRef.trim() || undefined,
      currentMa: parsedCurrent,
    });
  };

  const firmwareCode = generateFirmwarePinHeader(
    project.nameEn,
    project.assignments,
    codeFormat
  );

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(firmwareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const isFixedHardwarePin = Boolean(
    selectedPinSpec.isPower || selectedPinSpec.isGround || selectedPinSpec.isControl
  );
  const allowedFunctions = getAllowedFunctionsForPin(selectedPinSpec).filter(
    (f) => f !== 'unassigned'
  );

  const bomComponentNames = Array.from(new Set(project.bom.map((b) => b.name)));

  return (
    <div className="space-y-5">
      {/* Toolbar: Peripheral Filter + Search + Wi-Fi ADC2 Toggle */}
      <div className="flex flex-col gap-3 rounded-lg border border-slate-400/14 bg-[#171f33] p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Peripheral Filter">
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#06b6d4] text-[#0b111e] font-semibold'
                    : 'bg-[#131b2e] text-[#bcc9cd] hover:bg-[#222a3d] hover:text-[#f8fafc]'
                }`}
              >
                {language === 'ar' ? tab.labelAr : tab.labelEn}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] sm:w-56">
            <Search
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-2.5 h-3.5 w-3.5 text-[#94a3b8]"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPinsPlaceholder}
              aria-label={t.searchPinsPlaceholder}
              className="w-full rounded border border-slate-400/20 bg-[#0b111e] py-1.5 ps-8 pe-3 text-xs text-[#f8fafc] placeholder:text-[#64748b] focus:border-[#4cd7f6] focus:outline-none"
            />
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={project.wifiEnabled}
            onClick={() => onToggleWifi(!project.wifiEnabled)}
            className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              project.wifiEnabled
                ? 'border-[#4cd7f6]/40 bg-[#4cd7f6]/12 text-[#4cd7f6]'
                : 'border-slate-400/20 bg-[#131b2e] text-[#94a3b8]'
            }`}
          >
            <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.wifiToggleLabel}</span>
          </button>
        </div>
      </div>

      {/* Main Split: ESP32 Physical Board (7 cols) | Inspector & Firmware (5 cols) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Interactive ESP32 DevKit Board Diagram */}
        <section className="xl:col-span-7 rounded-lg border border-slate-400/14 bg-[#171f33] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="tabular-ltr text-xs font-semibold text-[#dae2fd]">
              ESP32-WROOM-32 DevKit V1 (38-Pin)
            </span>
            <div className="flex items-center gap-4 text-[11px] text-[#94a3b8]">
              <span className="text-[#4cd7f6]">Bus (I2C/SPI/UART)</span>
              <span className="text-[#4edea3]">Out/PWM</span>
              <span className="text-[#ffb95f]">Strapping</span>
              <span className="text-[#ffb4ab]">Error</span>
            </div>
          </div>

          {/* Physical Hardware Layout always LTR so Left=1..19, Right=20..38 */}
          <div dir="ltr" className="overflow-x-auto pb-2">
            <div className="mx-auto min-w-[560px] max-w-[680px] rounded-lg border border-slate-400/20 bg-[#0b111e] p-4">
              {/* Top RF Antenna + Shield */}
              <div className="mx-auto mb-3 flex w-56 flex-col items-center">
                <div className="h-7 w-36 rounded-t border border-b-0 border-slate-500/40 bg-[#131b2e] flex items-center justify-center">
                  <span className="font-mono text-[10px] tracking-widest text-[#94a3b8]">
                    PCB ANTENNA 2.4GHz
                  </span>
                </div>
                <div className="w-44 rounded border border-slate-400/30 bg-[#1e293b] py-2 text-center">
                  <div className="font-mono text-xs font-semibold text-[#f8fafc]">
                    ESP-WROOM-32
                  </div>
                  <div className="font-mono text-[10px] text-[#94a3b8]">
                    Dual-Core 240MHz
                  </div>
                </div>
              </div>

              {/* Dual Pin Headers */}
              <div className="grid grid-cols-[1fr_72px_1fr] gap-2 items-stretch">
                {/* Left Header (1..19) */}
                <div className="space-y-1.5">
                  {leftPins.map((pin) => {
                    const assigned = project.assignments[pin.physicalPin];
                    const pinDiags = diagnostics.filter(
                      (d) => d.physicalPin === pin.physicalPin
                    );
                    const hasError = pinDiags.some((d) => d.severity === 'error');
                    const hasWarning = pinDiags.some((d) => d.severity === 'warning');
                    const isSelected = selectedPinSpec.physicalPin === pin.physicalPin;
                    const highlighted = isPinHighlighted(pin.physicalPin);

                    const badgeStyle = pin.isPower
                      ? 'border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#ffb4ab]'
                      : pin.isGround
                      ? 'border-slate-500/30 bg-[#0f172a] text-[#94a3b8]'
                      : pin.isControl
                      ? 'border-[#ffb95f]/40 bg-[#ffb95f]/10 text-[#ffb95f]'
                      : getFunctionAccent(assigned?.functionType, hasError, hasWarning);

                    return (
                      <button
                        key={pin.physicalPin}
                        type="button"
                        onClick={() => onSelectPhysicalPin(pin.physicalPin)}
                        aria-label={`Pin ${pin.physicalPin} ${pin.label}${
                          assigned ? ` assigned to ${assigned.signalName}` : ''
                        }`}
                        className={`group flex w-full items-center justify-between gap-2 rounded border px-2 py-1 text-left transition-all duration-150 cursor-pointer ${badgeStyle} ${
                          isSelected
                            ? 'ring-2 ring-[#4cd7f6] shadow-[0_0_12px_rgba(76,215,246,0.28)]'
                            : ''
                        } ${highlighted ? 'opacity-100' : 'opacity-30'}`}
                      >
                        <div className="min-w-0 flex-1 truncate font-mono text-[11px]">
                          {assigned && assigned.functionType !== 'unassigned' ? (
                            <span className="font-semibold text-[#f8fafc]">
                              {assigned.signalName}
                            </span>
                          ) : (
                            <span className="text-[#64748b]">{pin.defaultRole.split('/')[0]}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {hasError && (
                            <ShieldAlert className="h-3 w-3 text-[#f43f5e]" aria-hidden="true" />
                          )}
                          {!hasError && hasWarning && (
                            <AlertTriangle className="h-3 w-3 text-[#ffb95f]" aria-hidden="true" />
                          )}
                          <span className="font-mono text-[11px] font-semibold">
                            {pin.label}
                          </span>
                          <span className="w-5 text-right font-mono text-[10px] text-[#64748b]">
                            {pin.physicalPin}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Center PCB Substrate Spine */}
                <div className="flex flex-col items-center justify-between rounded border border-slate-500/20 bg-[#0f172a] py-4 px-1">
                  <span className="font-mono text-[9px] text-[#64748b]">3.3V LDO</span>
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-3 w-3 rounded-full border border-[#4edea3]/50 bg-[#4edea3]/20" title="PWR LED" />
                    <span className="font-mono text-[8px] text-[#64748b]">PWR</span>
                  </div>
                  <div className="space-y-1 text-center font-mono text-[9px] text-[#64748b]">
                    <div className="rounded border border-slate-500/30 px-1.5 py-0.5">EN</div>
                    <div className="rounded border border-slate-500/30 px-1.5 py-0.5">BOOT</div>
                  </div>
                  <div className="rounded border border-slate-400/30 bg-[#1e293b] px-1.5 py-1 font-mono text-[9px] text-[#dae2fd]">
                    USB-C
                  </div>
                </div>

                {/* Right Header (20..38) */}
                <div className="space-y-1.5">
                  {rightPins.map((pin) => {
                    const assigned = project.assignments[pin.physicalPin];
                    const pinDiags = diagnostics.filter(
                      (d) => d.physicalPin === pin.physicalPin
                    );
                    const hasError = pinDiags.some((d) => d.severity === 'error');
                    const hasWarning = pinDiags.some((d) => d.severity === 'warning');
                    const isSelected = selectedPinSpec.physicalPin === pin.physicalPin;
                    const highlighted = isPinHighlighted(pin.physicalPin);

                    const badgeStyle = pin.isPower
                      ? 'border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#ffb4ab]'
                      : pin.isGround
                      ? 'border-slate-500/30 bg-[#0f172a] text-[#94a3b8]'
                      : pin.isControl
                      ? 'border-[#ffb95f]/40 bg-[#ffb95f]/10 text-[#ffb95f]'
                      : getFunctionAccent(assigned?.functionType, hasError, hasWarning);

                    return (
                      <button
                        key={pin.physicalPin}
                        type="button"
                        onClick={() => onSelectPhysicalPin(pin.physicalPin)}
                        aria-label={`Pin ${pin.physicalPin} ${pin.label}${
                          assigned ? ` assigned to ${assigned.signalName}` : ''
                        }`}
                        className={`group flex w-full items-center justify-between gap-2 rounded border px-2 py-1 text-left transition-all duration-150 cursor-pointer ${badgeStyle} ${
                          isSelected
                            ? 'ring-2 ring-[#4cd7f6] shadow-[0_0_12px_rgba(76,215,246,0.28)]'
                            : ''
                        } ${highlighted ? 'opacity-100' : 'opacity-30'}`}
                      >
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="w-5 font-mono text-[10px] text-[#64748b]">
                            {pin.physicalPin}
                          </span>
                          <span className="font-mono text-[11px] font-semibold">
                            {pin.label}
                          </span>
                          {hasError && (
                            <ShieldAlert className="h-3 w-3 text-[#f43f5e]" aria-hidden="true" />
                          )}
                          {!hasError && hasWarning && (
                            <AlertTriangle className="h-3 w-3 text-[#ffb95f]" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 truncate text-right font-mono text-[11px]">
                          {assigned && assigned.functionType !== 'unassigned' ? (
                            <span className="font-semibold text-[#f8fafc]">
                              {assigned.signalName}
                            </span>
                          ) : (
                            <span className="text-[#64748b]">{pin.defaultRole.split('/')[0]}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Pin Inspector Form + ERC Alerts + Firmware Code */}
        <div className="space-y-5 xl:col-span-5">
          {/* Inspector Panel */}
          <section className="rounded-lg border border-slate-400/14 bg-[#171f33]">
            <div className="flex items-center justify-between border-b border-slate-400/10 px-4 py-3">
              <h3 className="text-sm font-semibold text-[#f8fafc]">{t.pinInspector}</h3>
              <span className="tabular-ltr text-xs font-semibold text-[#4cd7f6]">
                PIN #{selectedPinSpec.physicalPin} · {selectedPinSpec.label}
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Electrical Spec Summary */}
              <div className="rounded border border-slate-400/12 bg-[#131b2e] p-3 text-xs space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-[#dae2fd]">
                  <span className="tabular-ltr font-medium">{selectedPinSpec.defaultRole}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#94a3b8] tabular-ltr">
                  <span>Max: {selectedPinSpec.maxCurrentMa} mA</span>
                  {selectedPinSpec.adcChannel && (
                    <>
                      <span>·</span>
                      <span>{selectedPinSpec.adcChannel}</span>
                    </>
                  )}
                  {selectedPinSpec.dacChannel && (
                    <>
                      <span>·</span>
                      <span>{selectedPinSpec.dacChannel}</span>
                    </>
                  )}
                  {selectedPinSpec.touchChannel && (
                    <>
                      <span>·</span>
                      <span>{selectedPinSpec.touchChannel}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{selectedPinSpec.supportsPwm ? 'PWM Ready' : 'No PWM'}</span>
                </div>
                {selectedPinSpec.inputOnly && (
                  <div className="text-[11px] text-[#ffb95f]">
                    {language === 'ar'
                      ? 'ملاحظة: منفذ إدخال فقط (Input Only) بدون مقاومات Pull-Up/Down داخلية.'
                      : 'Note: Strictly input-only GPIO (no internal pull-up/down resistors).'}
                  </div>
                )}
                {selectedPinSpec.flashReserved && (
                  <div className="text-[11px] text-[#ffb4ab]">
                    {language === 'ar'
                      ? 'تحذير حرج: متصل بذاكرة SPI Flash الداخلية — تجنب استخدامه.'
                      : 'Critical: Wired to internal SPI flash memory — avoid assigning.'}
                  </div>
                )}
                {selectedPinSpec.strappingPin && (
                  <div className="text-[11px] text-[#ffb95f]">
                    {language === 'ar'
                      ? selectedPinSpec.strappingNoteAr
                      : selectedPinSpec.strappingNoteEn}
                  </div>
                )}
              </div>

              {isFixedHardwarePin ? (
                <p className="rounded border border-slate-400/12 bg-[#131b2e] p-3 text-xs text-[#94a3b8]">
                  {t.powerPinsNote}
                </p>
              ) : (
                <form onSubmit={handleSave} className="space-y-3">
                  <div>
                    <label
                      htmlFor="pin-signal-input"
                      className="mb-1 block text-xs font-medium text-[#bcc9cd]"
                    >
                      {t.signalName}
                    </label>
                    <input
                      id="pin-signal-input"
                      type="text"
                      dir="ltr"
                      value={signalName}
                      onChange={(e) => setSignalName(e.target.value)}
                      placeholder="e.g. BME280_SDA or MOTOR_PWM"
                      className="w-full rounded border border-slate-400/20 bg-[#0b111e] px-3 py-2 font-mono text-xs text-[#f8fafc] placeholder:text-[#64748b] focus:border-[#4cd7f6] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="pin-function-select"
                        className="mb-1 block text-xs font-medium text-[#bcc9cd]"
                      >
                        {t.functionType}
                      </label>
                      <select
                        id="pin-function-select"
                        value={functionType}
                        onChange={(e) => setFunctionType(e.target.value as PinFunctionType)}
                        className="w-full rounded border border-slate-400/20 bg-[#0b111e] px-3 py-2 text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
                      >
                        {allowedFunctions.map((fn) => (
                          <option key={fn} value={fn}>
                            {FUNCTION_LABELS[fn]}
                          </option>
                        ))}
                        {/* Allow selecting PWM even on inputOnly if user wants to see ERC validation */}
                        {selectedPinSpec.inputOnly && (
                          <option value="pwm">PWM Output (Unsupported)</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="pin-current-input"
                        className="mb-1 block text-xs font-medium text-[#bcc9cd]"
                      >
                        {t.estimatedCurrent}
                      </label>
                      <div dir="ltr" className="relative">
                        <input
                          id="pin-current-input"
                          type="number"
                          min="0"
                          step="0.5"
                          value={currentMa}
                          onChange={(e) => setCurrentMa(e.target.value)}
                          className="w-full rounded border border-slate-400/20 bg-[#0b111e] py-2 pl-3 pr-10 font-mono text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
                        />
                        <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-3 font-mono text-[11px] text-[#64748b]">
                          mA
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="pin-component-input"
                      className="mb-1 block text-xs font-medium text-[#bcc9cd]"
                    >
                      {t.linkedComponent}
                    </label>
                    <input
                      id="pin-component-input"
                      list="bom-components-list"
                      type="text"
                      dir="ltr"
                      value={componentRef}
                      onChange={(e) => setComponentRef(e.target.value)}
                      placeholder="BME280 / SSD1306 / SG90..."
                      className="w-full rounded border border-slate-400/20 bg-[#0b111e] px-3 py-2 text-xs text-[#f8fafc] placeholder:text-[#64748b] focus:border-[#4cd7f6] focus:outline-none"
                    />
                    <datalist id="bom-components-list">
                      {bomComponentNames.map((name) => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </div>

                  {formError && (
                    <p role="alert" className="text-xs font-medium text-[#ffb4ab]">
                      {formError}
                    </p>
                  )}

                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      type="submit"
                      className="flex-1 rounded bg-[#06b6d4] border border-[#22d3ee] px-4 py-2 text-xs font-semibold text-[#0b111e] transition-colors hover:bg-[#4cd7f6] cursor-pointer"
                    >
                      {t.savePin}
                    </button>
                    {existingAssignment && (
                      <button
                        type="button"
                        onClick={() => onClearPin(selectedPinSpec.physicalPin)}
                        className="inline-flex items-center gap-1.5 rounded border border-slate-400/20 bg-[#162032] px-3 py-2 text-xs font-medium text-[#ffb4ab] hover:border-[#f43f5e] hover:bg-[#f43f5e]/10 cursor-pointer"
                      >
                        <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t.clearPin}</span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* Pin-level & Project ERC Alerts */}
          {diagnostics.length > 0 && (
            <section className="rounded-lg border border-slate-400/14 bg-[#171f33]">
              <div className="flex items-center justify-between border-b border-slate-400/10 px-4 py-2.5">
                <h3 className="text-xs font-semibold text-[#f8fafc]">{t.ercDiagnosticsTitle}</h3>
                <span className="tabular-ltr text-xs text-[#ffb95f]">
                  {diagnostics.length}
                </span>
              </div>
              <div className="p-3 space-y-2 max-h-44 overflow-y-auto">
                {diagnostics.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onSelectPhysicalPin(d.physicalPin)}
                    className={`w-full text-start rounded border p-2.5 text-xs transition-colors cursor-pointer ${
                      d.severity === 'error'
                        ? 'border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#ffb4ab]'
                        : 'border-[#ffb95f]/35 bg-[#ffb95f]/10 text-[#ffb95f]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>{language === 'ar' ? d.titleAr : d.titleEn}</span>
                      <span className="tabular-ltr text-[11px]">{d.pinLabel}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#dae2fd]/90">
                      {language === 'ar' ? d.detailAr : d.detailEn}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Auto-generated Firmware Pin Header */}
          <section className="rounded-lg border border-slate-400/14 bg-[#171f33]">
            <div className="flex items-center justify-between border-b border-slate-400/10 px-4 py-2.5">
              <h3 className="text-xs font-semibold text-[#f8fafc]">{t.firmwareExport}</h3>
              <div className="flex items-center gap-2">
                <div className="flex rounded border border-slate-400/20 bg-[#0b111e] p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setCodeFormat('cpp')}
                    className={`rounded px-2 py-0.5 font-mono cursor-pointer ${
                      codeFormat === 'cpp'
                        ? 'bg-[#222a3d] text-[#4cd7f6]'
                        : 'text-[#94a3b8]'
                    }`}
                  >
                    pins.h
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeFormat('micropython')}
                    className={`rounded px-2 py-0.5 font-mono cursor-pointer ${
                      codeFormat === 'micropython'
                        ? 'bg-[#222a3d] text-[#4cd7f6]'
                        : 'text-[#94a3b8]'
                    }`}
                  >
                    pins.py
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 rounded border border-slate-400/20 bg-[#162032] px-2.5 py-1 text-[11px] font-medium text-[#dae2fd] hover:border-[#4cd7f6] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-[#4edea3]" aria-hidden="true" />
                      <span className="text-[#4edea3]">{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" aria-hidden="true" />
                      <span>{t.copyCode}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre
              dir="ltr"
              className="max-h-48 overflow-auto bg-[#060e20] p-3 font-mono text-[11px] leading-relaxed text-[#acedff]"
            >
              <code>{firmwareCode}</code>
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}

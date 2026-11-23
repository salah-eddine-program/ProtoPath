import { useState } from 'react';
import { CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import type { HardwareProject, Language } from '../types/hardware';
import { UI_COPY } from '../i18n/translations';
import {
  calculateBatteryLife,
  calculateLedResistor,
  calculateRcFilter,
  calculateTraceWidth,
  calculateVoltageDivider,
  formatFrequency,
  formatResistance,
} from '../utils/calculators';
import { summarizeBom } from '../utils/bom';
import { calculatePinPlannerSummary } from '../utils/pinPlanner';

interface CalculatorsScreenProps {
  project: HardwareProject;
  language: Language;
}

type CalcTab = 'led' | 'divider' | 'rc' | 'battery' | 'trace';

export function CalculatorsScreen({ project, language }: CalculatorsScreenProps) {
  const t = UI_COPY[language];
  const [activeTab, setActiveTab] = useState<CalcTab>('led');

  // 1. LED Resistor state
  const [ledSupplyV, setLedSupplyV] = useState('5.0');
  const [ledForwardV, setLedForwardV] = useState('2.0');
  const [ledCurrentMa, setLedCurrentMa] = useState('20');
  const [ledSeriesCount, setLedSeriesCount] = useState('1');

  // 2. Voltage Divider state
  const [divVin, setDivVin] = useState('5.0');
  const [divR1, setDivR1] = useState('10000');
  const [divR2, setDivR2] = useState('10000');

  // 3. RC Filter state
  const [rcR, setRcR] = useState('10000');
  const [rcCuF, setRcCuF] = useState('0.1');

  // 4. Battery Life state
  const [batCapMah, setBatCapMah] = useState('2500');
  const [batActiveMa, setBatActiveMa] = useState('95');
  const [batSleepUa, setBatSleepUa] = useState('150');
  const [batActiveSec, setBatActiveSec] = useState('4');
  const [batPeriodSec, setBatPeriodSec] = useState('60');
  const [batEff, setBatEff] = useState('85');

  // 5. PCB Trace Width state
  const [traceCurrentA, setTraceCurrentA] = useState('2.0');
  const [traceCopperOz, setTraceCopperOz] = useState('1');
  const [traceTempRiseC, setTraceTempRiseC] = useState('10');
  const [traceExternal, setTraceExternal] = useState(true);

  const ledResult = calculateLedResistor(
    Number(ledSupplyV),
    Number(ledForwardV),
    Number(ledCurrentMa),
    Number(ledSeriesCount)
  );
  const divResult = calculateVoltageDivider(Number(divVin), Number(divR1), Number(divR2));
  const rcResult = calculateRcFilter(Number(rcR), Number(rcCuF));
  const batResult = calculateBatteryLife(
    Number(batCapMah),
    Number(batActiveMa),
    Number(batSleepUa),
    Number(batActiveSec),
    Number(batPeriodSec),
    Number(batEff)
  );
  const traceResult = calculateTraceWidth(
    Number(traceCurrentA),
    Number(traceCopperOz),
    Number(traceTempRiseC),
    traceExternal
  );

  const handleImportProjectCurrent = () => {
    const bomSummary = summarizeBom(project.bom);
    const pinSummary = calculatePinPlannerSummary(project.assignments);
    const totalMa = Math.max(
      10,
      Math.round(bomSummary.totalCurrentMa + pinSummary.totalGpioCurrentMa)
    );
    setBatActiveMa(String(totalMa));
  };

  const tabs: Array<{ id: CalcTab; label: string }> = [
    { id: 'led', label: t.calcLed },
    { id: 'divider', label: t.calcDivider },
    { id: 'rc', label: t.calcRc },
    { id: 'battery', label: t.calcBattery },
    { id: 'trace', label: t.calcTrace },
  ];

  // Build SVG path for RC Bode plot
  const renderBodePlot = () => {
    const width = 460;
    const height = 180;
    const padL = 44;
    const padR = 16;
    const padT = 16;
    const padB = 28;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    if (!rcResult.valid || rcResult.bodePoints.length === 0) return null;

    const minDb = -40;
    const maxDb = 4;
    const pts = rcResult.bodePoints;
    const pathD = pts
      .map((p, idx) => {
        const x = padL + (idx / (pts.length - 1)) * plotW;
        const clampedDb = Math.max(minDb, Math.min(maxDb, p.db));
        const y = padT + ((maxDb - clampedDb) / (maxDb - minDb)) * plotH;
        return `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    // -3dB cutoff marker at center index
    const midX = padL + plotW * 0.5;
    const minus3Y = padT + ((maxDb - -3.01) / (maxDb - minDb)) * plotH;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto rounded border border-slate-400/12 bg-[#060e20]"
        role="img"
        aria-label="RC Filter Bode Magnitude Plot"
      >
        {/* Horizontal dB gridlines */}
        {[0, -3, -20, -40].map((db) => {
          const y = padT + ((maxDb - db) / (maxDb - minDb)) * plotH;
          return (
            <g key={db}>
              <line
                x1={padL}
                y1={y}
                x2={width - padR}
                y2={y}
                stroke={db === -3 ? '#ffb95f' : '#1e293b'}
                strokeDasharray={db === -3 ? '4 3' : undefined}
                strokeWidth="1"
              />
              <text
                x={padL - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-[#94a3b8] font-mono text-[9px]"
              >
                {db}dB
              </text>
            </g>
          );
        })}

        {/* Vertical cutoff guide */}
        <line
          x1={midX}
          y1={padT}
          x2={midX}
          y2={height - padB}
          stroke="#4cd7f6"
          strokeOpacity="0.45"
          strokeDasharray="3 3"
        />

        {/* Frequency response curve */}
        <path d={pathD} fill="none" stroke="#4cd7f6" strokeWidth="2.2" />

        {/* -3dB point */}
        <circle cx={midX} cy={minus3Y} r="4" fill="#ffb95f" stroke="#060e20" strokeWidth="1.5" />
        <text
          x={midX + 6}
          y={minus3Y - 6}
          className="fill-[#ffb95f] font-mono text-[10px]"
        >
          fc = {formatFrequency(rcResult.cutoffHz)} (-3dB)
        </text>
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calculator Segmented Switcher */}
      <div
        role="tablist"
        aria-label={language === 'ar' ? 'اختيار الحاسبة الهندسية' : 'Engineering Calculator Selector'}
        className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-400/14 bg-[#171f33] p-2"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#06b6d4] text-[#0b111e] font-semibold'
                  : 'bg-[#131b2e] text-[#bcc9cd] hover:bg-[#222a3d] hover:text-[#f8fafc]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* LED Resistor Calculator */}
      {activeTab === 'led' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5 rounded-lg border border-slate-400/14 bg-[#171f33] p-5 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-[#f8fafc]">{t.calcLed}</h2>
              <p className="mt-1 text-xs text-[#94a3b8]">
                {language === 'ar'
                  ? 'حساب قيمة المقاومة الدقيقة وأقرب قيمة قياسية من سلسلة E24 مع قدرة التحمل.'
                  : 'Compute exact resistance, nearest E24 standard value, and power derating.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <FieldWithUnit
                id="led-vs"
                label={language === 'ar' ? 'جهد المصدر (Vs)' : 'Supply Voltage (Vs)'}
                value={ledSupplyV}
                onChange={setLedSupplyV}
                unit="V"
                step="0.1"
              />
              <FieldWithUnit
                id="led-vf"
                label={language === 'ar' ? 'الجهد الأمامي (Vf)' : 'LED Forward Voltage (Vf)'}
                value={ledForwardV}
                onChange={setLedForwardV}
                unit="V"
                step="0.1"
              />
              <FieldWithUnit
                id="led-if"
                label={language === 'ar' ? 'التيار المطلوب (If)' : 'Target Current (If)'}
                value={ledCurrentMa}
                onChange={setLedCurrentMa}
                unit="mA"
                step="1"
              />
              <FieldWithUnit
                id="led-qty"
                label={language === 'ar' ? 'عدد LED على التوالي' : 'Series LEDs'}
                value={ledSeriesCount}
                onChange={setLedSeriesCount}
                unit="pcs"
                step="1"
              />
            </div>

            {/* Quick diode presets */}
            <div className="border-t border-slate-400/10 pt-3">
              <span className="mb-2 block text-[11px] text-[#94a3b8]">
                {language === 'ar' ? 'قيم Vf القياسية:' : 'Typical Vf presets:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Red (1.9V)', vf: '1.9' },
                  { label: 'Amber (2.0V)', vf: '2.0' },
                  { label: 'Green (2.2V)', vf: '2.2' },
                  { label: 'Blue/White (3.1V)', vf: '3.1' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setLedForwardV(preset.vf)}
                    className="rounded border border-slate-400/20 bg-[#131b2e] px-2.5 py-1 font-mono text-[11px] text-[#dae2fd] hover:border-[#4cd7f6] cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="lg:col-span-7 rounded-lg border border-slate-400/14 bg-[#171f33] p-5 space-y-5">
            {!ledResult.valid ? (
              <div className="flex items-center gap-2.5 rounded border border-[#f43f5e]/40 bg-[#f43f5e]/10 p-4 text-xs text-[#ffb4ab]">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {ledResult.error === 'SUPPLY_TOO_LOW'
                    ? language === 'ar'
                      ? 'جهد المصدر أقل من أو يساوي مجموع الجهد الأمامي للثنائيات (Vs ≤ Vf).'
                      : 'Supply voltage must exceed total LED forward voltage (Vs > Vf).'
                    : language === 'ar'
                    ? 'يرجى إدخال قيم موجبة صالحة.'
                    : 'Please enter valid positive parameters.'}
                </span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <ReadoutTile
                    label={language === 'ar' ? 'القيمة القياسية E24' : 'Nearest E24'}
                    value={formatResistance(ledResult.nearestE24Ohm)}
                    accent="cyan"
                  />
                  <ReadoutTile
                    label={language === 'ar' ? 'الحساب الدقيق' : 'Exact Value'}
                    value={formatResistance(ledResult.exactResistanceOhm)}
                  />
                  <ReadoutTile
                    label={language === 'ar' ? 'التيار الفعلي' : 'Actual Current'}
                    value={`${ledResult.actualCurrentMa.toFixed(1)} mA`}
                    accent="emerald"
                  />
                  <ReadoutTile
                    label={language === 'ar' ? 'القدرة المبددة' : 'Resistor Power'}
                    value={`${ledResult.powerMw.toFixed(1)} mW`}
                    sub={ledResult.recommendedWattage}
                  />
                </div>

                {/* 4-Band Resistor Visual SVG */}
                <div dir="ltr" className="rounded border border-slate-400/12 bg-[#060e20] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#94a3b8] font-mono">
                    <span>4-Band IEC Color Code (±5%)</span>
                    <span className="text-[#4cd7f6]">{formatResistance(ledResult.nearestE24Ohm)}</span>
                  </div>
                  <svg viewBox="0 0 420 90" className="w-full max-w-md mx-auto h-auto" role="img" aria-label="4-band resistor color code">
                    {/* Leads */}
                    <line x1="20" y1="45" x2="100" y2="45" stroke="#94a3b8" strokeWidth="4" />
                    <line x1="320" y1="45" x2="400" y2="45" stroke="#94a3b8" strokeWidth="4" />
                    {/* Ceramic Body */}
                    <rect x="100" y="20" width="220" height="50" rx="14" fill="#d6c5a3" stroke="#94a3b8" strokeWidth="1.5" />
                    {/* 4 Bands */}
                    <rect x="132" y="20" width="16" height="50" fill={ledResult.colorBands[0].hex} />
                    <rect x="166" y="20" width="16" height="50" fill={ledResult.colorBands[1].hex} />
                    <rect x="200" y="20" width="16" height="50" fill={ledResult.colorBands[2].hex} />
                    <rect x="268" y="20" width="16" height="50" fill={ledResult.colorBands[3].hex} />
                  </svg>
                  <div className="flex flex-wrap justify-center gap-4 text-[11px] font-mono text-[#bcc9cd]">
                    {ledResult.colorBands.map((b, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-sm border border-white/20"
                          style={{ backgroundColor: b.hex }}
                        />
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {/* Voltage Divider Calculator */}
      {activeTab === 'divider' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5 rounded-lg border border-slate-400/14 bg-[#171f33] p-5 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-[#f8fafc]">{t.calcDivider}</h2>
              <p className="mt-1 text-xs text-[#94a3b8]">
                {language === 'ar'
                  ? 'حساب جهد الخرج Vout وقراءة محول ADC ذو 12 بت مع التحقق من أمان منفذ 3.3V.'
                  : 'Compute Vout, 12-bit ESP32 ADC value, and 3.3V GPIO input safety.'}
              </p>
            </div>
            <div className="space-y-3.5">
              <FieldWithUnit
                id="div-vin"
                label={language === 'ar' ? 'جهد الدخل (Vin)' : 'Input Voltage (Vin)'}
                value={divVin}
                onChange={setDivVin}
                unit="V"
                step="0.1"
              />
              <FieldWithUnit
                id="div-r1"
                label={language === 'ar' ? 'المقاومة العلوية (R1)' : 'Top Resistor (R1)'}
                value={divR1}
                onChange={setDivR1}
                unit="Ω"
                step="100"
              />
              <FieldWithUnit
                id="div-r2"
                label={language === 'ar' ? 'المقاومة السفلية (R2)' : 'Bottom Resistor (R2)'}
                value={divR2}
                onChange={setDivR2}
                unit="Ω"
                step="100"
              />
            </div>
          </section>

          <section className="lg:col-span-7 rounded-lg border border-slate-400/14 bg-[#171f33] p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <ReadoutTile
                label={language === 'ar' ? 'جهد الخرج (Vout)' : 'Output (Vout)'}
                value={`${divResult.vOut.toFixed(3)} V`}
                accent={divResult.safeFor3v3Gpio ? 'cyan' : 'error'}
              />
              <ReadoutTile
                label="ESP32 ADC (12-bit)"
                value={String(divResult.esp32Adc12Bit)}
                sub="/ 4095"
              />
              <ReadoutTile
                label={language === 'ar' ? 'تيار المقسم' : 'Bleed Current'}
                value={`${divResult.dividerCurrentMa.toFixed(2)} mA`}
              />
              <ReadoutTile
                label={language === 'ar' ? 'نسبة القسمة' : 'Ratio'}
                value={`${(divResult.ratio * 100).toFixed(1)}%`}
              />
            </div>

            {/* 3.3V Safety Banner */}
            <div
              className={`flex items-center justify-between gap-3 rounded border p-3.5 text-xs ${
                divResult.safeFor3v3Gpio
                  ? 'border-[#4edea3]/35 bg-[#4edea3]/10 text-[#4edea3]'
                  : 'border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#ffb4ab]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {divResult.safeFor3v3Gpio ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                )}
                <span>
                  {divResult.safeFor3v3Gpio
                    ? language === 'ar'
                      ? 'آمن لمداخل ESP32 (الجهد ≤ 3.3V).'
                      : 'Safe for 3.3V ESP32 GPIO & ADC pins (Vout ≤ 3.3V).'
                    : language === 'ar'
                    ? `خطر! الجهد (${divResult.vOut.toFixed(2)}V) يتجاوز 3.3V وقد يتلف المعالج.`
                    : `Unsafe! Output (${divResult.vOut.toFixed(2)}V) exceeds 3.3V ESP32 rating.`}
                </span>
              </div>
              {!divResult.safeFor3v3Gpio && divResult.suggestedR2For3v3 && (
                <button
                  type="button"
                  onClick={() => setDivR2(String(divResult.suggestedR2For3v3))}
                  className="rounded border border-[#ffb4ab]/40 bg-[#0b111e] px-2.5 py-1 font-mono text-[11px] text-[#f8fafc] hover:border-[#4cd7f6] shrink-0 cursor-pointer"
                >
                  {language === 'ar' ? 'ضبط R2 إلى' : 'Clamp R2 →'} {divResult.suggestedR2For3v3}Ω
                </button>
              )}
            </div>

            {/* Schematic SVG */}
            <div dir="ltr" className="rounded border border-slate-400/12 bg-[#060e20] p-4">
              <svg viewBox="0 0 380 170" className="w-full max-w-sm mx-auto h-auto" role="img" aria-label="Voltage Divider Schematic">
                <text x="24" y="34" className="fill-[#4cd7f6] font-mono text-[11px]">Vin = {Number(divVin).toFixed(1)}V</text>
                <line x1="95" y1="30" x2="170" y2="30" stroke="#94a3b8" strokeWidth="2" />
                <rect x="158" y="42" width="24" height="36" fill="#131b2e" stroke="#4cd7f6" strokeWidth="1.5" />
                <line x1="170" y1="30" x2="170" y2="42" stroke="#94a3b8" strokeWidth="2" />
                <text x="190" y="64" className="fill-[#dae2fd] font-mono text-[11px]">R1: {formatResistance(Number(divR1))}</text>

                {/* Vout tap */}
                <line x1="170" y1="78" x2="170" y2="96" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="170" cy="88" r="3.5" fill="#4edea3" />
                <line x1="170" y1="88" x2="275" y2="88" stroke="#4edea3" strokeWidth="2" />
                <text x="282" y="92" className="fill-[#4edea3] font-mono text-[11px]">
                  Vout = {divResult.vOut.toFixed(2)}V
                </text>

                <rect x="158" y="96" width="24" height="36" fill="#131b2e" stroke="#4cd7f6" strokeWidth="1.5" />
                <text x="190" y="118" className="fill-[#dae2fd] font-mono text-[11px]">R2: {formatResistance(Number(divR2))}</text>
                <line x1="170" y1="132" x2="170" y2="150" stroke="#94a3b8" strokeWidth="2" />
                <line x1="154" y1="150" x2="186" y2="150" stroke="#94a3b8" strokeWidth="2" />
                <line x1="160" y1="155" x2="180" y2="155" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="194" y="155" className="fill-[#64748b] font-mono text-[10px]">GND</text>
              </svg>
            </div>
          </section>
        </div>
      )}

      {/* RC Low-Pass Filter Calculator */}
      {activeTab === 'rc' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5 rounded-lg border border-slate-400/14 bg-[#171f33] p-5 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-[#f8fafc]">{t.calcRc}</h2>
              <p className="mt-1 text-xs text-[#94a3b8]">
                {language === 'ar'
                  ? 'حساب تردد القطع (-3dB) وثابت الزمن τ ورسم منحنى الاستجابة الترددية.'
                  : 'Compute -3dB cutoff frequency fc, time constant τ, and Bode magnitude response.'}
              </p>
            </div>
            <div className="space-y-3.5">
              <FieldWithUnit
                id="rc-r"
                label={language === 'ar' ? 'المقاومة (R)' : 'Resistance (R)'}
                value={rcR}
                onChange={setRcR}
                unit="Ω"
                step="100"
              />
              <FieldWithUnit
                id="rc-c"
                label={language === 'ar' ? 'السعة (C)' : 'Capacitance (C)'}
                value={rcCuF}
                onChange={setRcCuF}
                unit="µF"
                step="0.01"
              />
            </div>
          </section>

          <section className="lg:col-span-7 rounded-lg border border-slate-400/14 bg-[#171f33] p-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ReadoutTile
                label={language === 'ar' ? 'تردد القطع (fc)' : 'Cutoff Freq (fc)'}
                value={formatFrequency(rcResult.cutoffHz)}
                accent="cyan"
              />
              <ReadoutTile
                label={language === 'ar' ? 'ثابت الزمن (τ = RC)' : 'Time Constant (τ)'}
                value={`${rcResult.timeConstantMs.toFixed(3)} ms`}
              />
              <ReadoutTile
                label={language === 'ar' ? 'زمن الصعود (10–90%)' : 'Rise Time (2.2τ)'}
                value={`${rcResult.riseTimeMs.toFixed(3)} ms`}
                accent="emerald"
              />
            </div>
            {renderBodePlot()}
          </section>
        </div>
      )}

      {/* Battery Life Calculator */}
      {activeTab === 'battery' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5 rounded-lg border border-slate-400/14 bg-[#171f33] p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-[#f8fafc]">{t.calcBattery}</h2>
                <p className="mt-1 text-xs text-[#94a3b8]">
                  {language === 'ar'
                    ? 'تقدير عمر البطارية وفق دورة العمل (Active vs Deep-Sleep).'
                    : 'Estimate battery runtime from active/sleep duty-cycle and converter efficiency.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleImportProjectCurrent}
                className="inline-flex items-center gap-1.5 rounded border border-[#4cd7f6]/40 bg-[#4cd7f6]/10 px-2.5 py-1.5 text-[11px] font-medium text-[#4cd7f6] hover:bg-[#4cd7f6]/20 shrink-0 cursor-pointer"
              >
                <Download className="h-3 w-3" aria-hidden="true" />
                <span>{t.importProjectCurrent}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <FieldWithUnit
                id="bat-cap"
                label={language === 'ar' ? 'سعة البطارية' : 'Battery Capacity'}
                value={batCapMah}
                onChange={setBatCapMah}
                unit="mAh"
              />
              <FieldWithUnit
                id="bat-act-ma"
                label={language === 'ar' ? 'تيار التشغيل النشط' : 'Active Current'}
                value={batActiveMa}
                onChange={setBatActiveMa}
                unit="mA"
              />
              <FieldWithUnit
                id="bat-slp-ua"
                label={language === 'ar' ? 'تيار السكون (Deep Sleep)' : 'Deep Sleep Current'}
                value={batSleepUa}
                onChange={setBatSleepUa}
                unit="µA"
              />
              <FieldWithUnit
                id="bat-eff"
                label={language === 'ar' ? 'كفاءة المنظم' : 'Regulator Efficiency'}
                value={batEff}
                onChange={setBatEff}
                unit="%"
              />
              <FieldWithUnit
                id="bat-act-s"
                label={language === 'ar' ? 'مدة الاستيقاظ' : 'Active Window'}
                value={batActiveSec}
                onChange={setBatActiveSec}
                unit="s"
              />
              <FieldWithUnit
                id="bat-per-s"
                label={language === 'ar' ? 'فترة الدورة الكاملة' : 'Cycle Period'}
                value={batPeriodSec}
                onChange={setBatPeriodSec}
                unit="s"
              />
            </div>
          </section>

          <section className="lg:col-span-7 rounded-lg border border-slate-400/14 bg-[#171f33] p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <ReadoutTile
                label={language === 'ar' ? 'العمر التقديري' : 'Estimated Runtime'}
                value={`${batResult.runtimeDays.toFixed(1)} d`}
                sub={`${batResult.runtimeHours.toFixed(0)} hrs`}
                accent="emerald"
              />
              <ReadoutTile
                label={language === 'ar' ? 'متوسط التيار' : 'Average Current'}
                value={`${batResult.averageCurrentMa.toFixed(2)} mA`}
                accent="cyan"
              />
              <ReadoutTile
                label={language === 'ar' ? 'نسبة التشغيل' : 'Duty Cycle'}
                value={`${batResult.dutyCyclePercent.toFixed(1)}%`}
              />
              <ReadoutTile
                label={language === 'ar' ? 'السعة الفعالة' : 'Usable Capacity'}
                value={`${batResult.effectiveCapacityMah.toFixed(0)} mAh`}
              />
            </div>

            <div className="rounded border border-slate-400/12 bg-[#060e20] p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#bcc9cd]">
                <span>
                  {language === 'ar'
                    ? 'حصة الاستهلاك خلال الوضع النشط مقابل السكون'
                    : 'Energy share: Active burst vs. Deep Sleep'}
                </span>
                <span className="tabular-ltr text-[#4cd7f6]">
                  {batResult.activeSharePercent.toFixed(1)}% Active
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded bg-[#131b2e] flex">
                <div
                  className="bg-[#4cd7f6] h-full transition-all duration-200"
                  style={{ width: `${Math.min(100, batResult.activeSharePercent)}%` }}
                />
                <div className="bg-[#4edea3] h-full flex-1" />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* PCB Trace Width Calculator (IPC-2221) */}
      {activeTab === 'trace' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5 rounded-lg border border-slate-400/14 bg-[#171f33] p-5 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-[#f8fafc]">{t.calcTrace}</h2>
              <p className="mt-1 text-xs text-[#94a3b8]">
                {language === 'ar'
                  ? 'حساب أقل عرض لمسار النحاس في لوحة PCB وفق معيار IPC-2221.'
                  : 'IPC-2221 minimum PCB copper trace width for current and thermal rise.'}
              </p>
            </div>
            <div className="space-y-3.5">
              <FieldWithUnit
                id="trace-amps"
                label={language === 'ar' ? 'التيار المستمر (I)' : 'Continuous Current (I)'}
                value={traceCurrentA}
                onChange={setTraceCurrentA}
                unit="A"
                step="0.2"
              />
              <FieldWithUnit
                id="trace-oz"
                label={language === 'ar' ? 'سماكة النحاس' : 'Copper Weight'}
                value={traceCopperOz}
                onChange={setTraceCopperOz}
                unit="oz/ft²"
                step="0.5"
              />
              <FieldWithUnit
                id="trace-temp"
                label={language === 'ar' ? 'الارتفاع الحراري المسموح (ΔT)' : 'Max Temp Rise (ΔT)'}
                value={traceTempRiseC}
                onChange={setTraceTempRiseC}
                unit="°C"
                step="1"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTraceExternal(true)}
                  className={`flex-1 rounded border py-2 text-xs font-medium cursor-pointer ${
                    traceExternal
                      ? 'border-[#4cd7f6] bg-[#4cd7f6]/15 text-[#4cd7f6]'
                      : 'border-slate-400/20 bg-[#131b2e] text-[#94a3b8]'
                  }`}
                >
                  {language === 'ar' ? 'طبقة خارجية (External)' : 'External Layer'}
                </button>
                <button
                  type="button"
                  onClick={() => setTraceExternal(false)}
                  className={`flex-1 rounded border py-2 text-xs font-medium cursor-pointer ${
                    !traceExternal
                      ? 'border-[#4cd7f6] bg-[#4cd7f6]/15 text-[#4cd7f6]'
                      : 'border-slate-400/20 bg-[#131b2e] text-[#94a3b8]'
                  }`}
                >
                  {language === 'ar' ? 'طبقة داخلية (Internal)' : 'Internal Layer'}
                </button>
              </div>
            </div>
          </section>

          <section className="lg:col-span-7 rounded-lg border border-slate-400/14 bg-[#171f33] p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <ReadoutTile
                label={language === 'ar' ? 'العرض الأدنى (mm)' : 'Min Width (mm)'}
                value={`${traceResult.widthMm.toFixed(3)} mm`}
                accent="cyan"
              />
              <ReadoutTile
                label={language === 'ar' ? 'العرض الأدنى (mil)' : 'Min Width (mil)'}
                value={`${traceResult.widthMil.toFixed(1)} mil`}
              />
              <ReadoutTile
                label={language === 'ar' ? 'المقاومة / سم' : 'Resistance / cm'}
                value={`${traceResult.resistanceMilliohmPerCm.toFixed(2)} mΩ`}
              />
              <ReadoutTile
                label={language === 'ar' ? 'هبوط الجهد / سم' : 'Drop / cm'}
                value={`${traceResult.voltageDropMvPerCm.toFixed(2)} mV`}
                accent="emerald"
              />
            </div>

            <div dir="ltr" className="rounded border border-slate-400/12 bg-[#060e20] p-4 space-y-2">
              <div className="text-xs font-mono text-[#94a3b8]">
                Cross-Section Profile ({traceExternal ? 'Top/Bottom Cu' : 'Inner FR4 Plane'})
              </div>
              <div className="h-14 flex flex-col items-center justify-center">
                <div
                  className="h-3 rounded-sm bg-[#ffb95f] border border-[#ffddb8]/50 transition-all duration-200"
                  style={{
                    width: `${Math.min(320, Math.max(24, traceResult.widthMm * 80))}px`,
                  }}
                />
                <div className="mt-1 h-4 w-72 rounded-sm bg-[#162032] border border-slate-500/30 flex items-center justify-center font-mono text-[9px] text-[#94a3b8]">
                  FR4 Dielectric Substrate
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function FieldWithUnit({
  id,
  label,
  value,
  onChange,
  unit,
  step = 'any',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  unit: string;
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-[#bcc9cd]">
        {label}
      </label>
      <div dir="ltr" className="relative">
        <input
          id={id}
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border border-slate-400/20 bg-[#0b111e] py-2 pl-3 pr-16 font-mono text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
        />
        <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-3 font-mono text-[11px] text-[#64748b]">
          {unit}
        </span>
      </div>
    </div>
  );
}

function ReadoutTile({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: 'cyan' | 'emerald' | 'error';
}) {
  const colorClass =
    accent === 'cyan'
      ? 'text-[#4cd7f6]'
      : accent === 'emerald'
      ? 'text-[#4edea3]'
      : accent === 'error'
      ? 'text-[#ffb4ab]'
      : 'text-[#f8fafc]';

  return (
    <div className="rounded border border-slate-400/12 bg-[#131b2e] p-3">
      <div className="text-[11px] font-medium text-[#94a3b8]">{label}</div>
      <div className={`mt-1 tabular-ltr text-lg font-semibold ${colorClass}`}>{value}</div>
      {sub && <div className="mt-0.5 tabular-ltr text-[11px] text-[#64748b]">{sub}</div>}
    </div>
  );
}

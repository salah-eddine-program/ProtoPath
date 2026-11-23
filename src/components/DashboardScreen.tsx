import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import type {
  ErcDiagnostic,
  HardwareProject,
  Language,
  ScreenId,
} from '../types/hardware';
import { UI_COPY } from '../i18n/translations';
import {
  calculatePinPlannerSummary,
  runElectricalRuleCheck,
} from '../utils/pinPlanner';
import { summarizeBom } from '../utils/bom';

interface DashboardScreenProps {
  project: HardwareProject;
  language: Language;
  onNavigate: (screen: ScreenId) => void;
  onInspectPin: (physicalPin: number) => void;
}

export function DashboardScreen({
  project,
  language,
  onNavigate,
  onInspectPin,
}: DashboardScreenProps) {
  const t = UI_COPY[language];
  const pinSummary = calculatePinPlannerSummary(project.assignments);
  const bomSummary = summarizeBom(project.bom);
  const diagnostics: ErcDiagnostic[] = runElectricalRuleCheck(
    project.assignments,
    project.wifiEnabled
  );

  const errorCount = diagnostics.filter((d) => d.severity === 'error').length;
  const warningCount = diagnostics.filter((d) => d.severity === 'warning').length;

  const total3v3LoadMa = Number(
    (bomSummary.rail3v3CurrentMa + pinSummary.totalGpioCurrentMa + (project.wifiEnabled ? 80 : 25)).toFixed(1)
  );
  const railLoadPercent = Math.min(
    100,
    Math.round((total3v3LoadMa / project.regulatorLimitMa) * 100)
  );

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6">
      {/* Minimal Project Header */}
      <section className="flex flex-col gap-4 border-b border-slate-400/12 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[#f8fafc] sm:text-2xl">
            {language === 'ar' ? project.nameAr : project.nameEn}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#94a3b8] tabular-ltr">
            <span>{project.boardName}</span>
            <span aria-hidden="true">·</span>
            <span>{project.wifiEnabled ? 'Wi-Fi ON' : 'Wi-Fi OFF'}</span>
            <span aria-hidden="true">·</span>
            <span>{project.supplyVoltageV.toFixed(1)}V</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('pin-planner')}
          className="inline-flex items-center gap-2 rounded bg-[#06b6d4] border border-[#22d3ee] px-5 py-2.5 text-xs font-semibold text-[#0b111e] transition-colors hover:bg-[#4cd7f6] whitespace-nowrap shrink-0 self-start sm:self-center cursor-pointer"
        >
          <Cpu className="h-4 w-4" aria-hidden="true" />
          <span>{t.openPinPlanner}</span>
        </button>
      </section>

      {/* Unified 3-Metric Strip */}
      <section
        aria-label={language === 'ar' ? 'المؤشرات الرئيسية' : 'Key Metrics'}
        className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-slate-400/14 bg-slate-400/14 sm:grid-cols-3"
      >
        <div className="bg-[#171f33] px-6 py-5 space-y-1.5">
          <div className="text-xs text-[#94a3b8]">{t.rail3v3Load}</div>
          <div dir="ltr" className="inline-flex items-baseline gap-1.5 tabular-ltr">
            <span
              className={`text-2xl font-semibold ${
                railLoadPercent > 85
                  ? 'text-[#ffb4ab]'
                  : railLoadPercent > 65
                  ? 'text-[#ffb95f]'
                  : 'text-[#f8fafc]'
              }`}
            >
              {total3v3LoadMa}
            </span>
            <span className="text-xs text-[#94a3b8]">
              / {project.regulatorLimitMa} mA
            </span>
          </div>
        </div>

        <div className="bg-[#171f33] px-6 py-5 space-y-1.5">
          <div className="text-xs text-[#94a3b8]">{t.gpioUtilization}</div>
          <div dir="ltr" className="inline-flex items-baseline gap-1.5 tabular-ltr">
            <span className="text-2xl font-semibold text-[#f8fafc]">
              {pinSummary.assignedCount}
            </span>
            <span className="text-xs text-[#94a3b8]">
              / {pinSummary.totalUsableGpio} GPIO
            </span>
          </div>
        </div>

        <div className="bg-[#171f33] px-6 py-5 space-y-1.5">
          <div className="text-xs text-[#94a3b8]">{t.bomTotalCost}</div>
          <div className="flex items-baseline gap-2">
            <span dir="ltr" className="tabular-ltr text-2xl font-semibold text-[#f8fafc]">
              ${bomSummary.totalCostUsd.toFixed(2)}
            </span>
            <span className="text-xs text-[#94a3b8]">
              <span aria-hidden="true">· </span>
              <span className="tabular-ltr">{bomSummary.totalUnitCount}</span>{' '}
              {language === 'ar' ? 'قطعة' : 'pcs'}
            </span>
          </div>
        </div>
      </section>

      {/* 3 Simple Tool Shortcuts */}
      <section
        aria-label={t.quickLaunch}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <button
          type="button"
          onClick={() => onNavigate('pin-planner')}
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-400/14 bg-[#171f33] px-5 py-4 text-start transition-colors hover:border-[#4cd7f6]/40 hover:bg-[#1e293b] cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Cpu className="h-5 w-5 text-[#4cd7f6] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[#f8fafc] truncate">
                {t.navPinPlanner}
              </div>
              <div className="text-xs text-[#94a3b8] truncate">
                {language === 'ar' ? 'توزيع 38 منفذاً' : '38-pin ESP32 layout'}
              </div>
            </div>
          </div>
          <ArrowIcon className="h-4 w-4 text-[#94a3b8] shrink-0" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('calculators')}
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-400/14 bg-[#171f33] px-5 py-4 text-start transition-colors hover:border-[#4edea3]/40 hover:bg-[#1e293b] cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Calculator className="h-5 w-5 text-[#4edea3] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[#f8fafc] truncate">
                {t.navCalculators}
              </div>
              <div className="text-xs text-[#94a3b8] truncate">
                {language === 'ar' ? 'LED · RC · البطارية' : 'LED · RC · Battery'}
              </div>
            </div>
          </div>
          <ArrowIcon className="h-4 w-4 text-[#94a3b8] shrink-0" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('components')}
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-400/14 bg-[#171f33] px-5 py-4 text-start transition-colors hover:border-[#ffb95f]/40 hover:bg-[#1e293b] cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Layers className="h-5 w-5 text-[#ffb95f] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[#f8fafc] truncate">
                {t.navComponents}
              </div>
              <div className="text-xs text-[#94a3b8] truncate">
                {language === 'ar' ? 'المكونات والأسعار' : 'Catalog & BOM'}
              </div>
            </div>
          </div>
          <ArrowIcon className="h-4 w-4 text-[#94a3b8] shrink-0" aria-hidden="true" />
        </button>
      </section>

      {/* Quiet ERC Status Line / Compact List */}
      <section
        aria-label={t.ercHealth}
        className="rounded-lg border border-slate-400/14 bg-[#171f33] overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-xs font-medium text-[#94a3b8]">{t.ercHealth}</span>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {errorCount > 0 ? (
              <>
                <ShieldAlert className="h-4 w-4 text-[#f43f5e]" aria-hidden="true" />
                <span className="text-[#ffb4ab]">
                  {t.statusErrors} ({errorCount})
                </span>
              </>
            ) : warningCount > 0 ? (
              <>
                <AlertTriangle className="h-4 w-4 text-[#ffb95f]" aria-hidden="true" />
                <span className="text-[#ffb95f]">
                  {t.statusWarnings} ({warningCount})
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-[#4edea3]" aria-hidden="true" />
                <span className="text-[#4edea3]">{t.statusNominal}</span>
              </>
            )}
          </div>
        </div>

        {diagnostics.length > 0 && (
          <div className="divide-y divide-slate-400/10 border-t border-slate-400/10">
            {diagnostics.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onInspectPin(item.physicalPin)}
                className="flex w-full items-center justify-between gap-4 px-5 py-3 text-start text-xs transition-colors hover:bg-[#1e293b] cursor-pointer"
              >
                <span
                  className={`font-medium truncate ${
                    item.severity === 'error' ? 'text-[#ffb4ab]' : 'text-[#ffb95f]'
                  }`}
                >
                  {language === 'ar' ? item.titleAr : item.titleEn}
                </span>
                <span className="tabular-ltr text-[#94a3b8] shrink-0">
                  {item.pinLabel}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


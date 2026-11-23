import { useState } from 'react';
import {
  AlertTriangle,
  Cpu,
  Download,
  Minus,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import type {
  BomItem,
  BomStatus,
  CatalogComponent,
  ComponentCategory,
  HardwareProject,
  Language,
} from '../types/hardware';
import { UI_COPY } from '../i18n/translations';
import {
  COMPONENT_CATALOG,
  exportBomToCsv,
  filterCatalog,
  summarizeBom,
} from '../utils/bom';

interface ComponentsScreenProps {
  project: HardwareProject;
  language: Language;
  onAddToBom: (component: CatalogComponent) => void;
  onUpdateBomQuantity: (bomId: string, delta: number) => void;
  onUpdateBomStatus: (bomId: string, status: BomStatus) => void;
  onRemoveBomItem: (bomId: string) => void;
  onAssignComponentPin: (componentName: string) => void;
}

const CATEGORIES: Array<{ id: ComponentCategory; ar: string; en: string }> = [
  { id: 'all', ar: 'الكل', en: 'All' },
  { id: 'sensors', ar: 'حساسات', en: 'Sensors' },
  { id: 'displays', ar: 'شاشات و LED', en: 'Displays' },
  { id: 'actuators', ar: 'مشغلات', en: 'Actuators' },
  { id: 'comms', ar: 'اتصال ومعالجة', en: 'MCU & Comms' },
  { id: 'power', ar: 'طاقة وتنظيم', en: 'Power' },
  { id: 'passives', ar: 'عناصر سلبية', en: 'Passives' },
];

export function ComponentsScreen({
  project,
  language,
  onAddToBom,
  onUpdateBomQuantity,
  onUpdateBomStatus,
  onRemoveBomItem,
  onAssignComponentPin,
}: ComponentsScreenProps) {
  const t = UI_COPY[language];
  const [category, setCategory] = useState<ComponentCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customModalOpen, setCustomModalOpen] = useState(false);

  // Custom part modal state
  const [customName, setCustomName] = useState('');
  const [customPartNo, setCustomPartNo] = useState('');
  const [customCategory, setCustomCategory] = useState<Exclude<ComponentCategory, 'all'>>('sensors');
  const [customRail, setCustomRail] = useState<'3.3V' | '5V'>('3.3V');
  const [customProtocol, setCustomProtocol] = useState('I2C');
  const [customI2cAddr, setCustomI2cAddr] = useState('');
  const [customCurrentMa, setCustomCurrentMa] = useState('10');
  const [customPriceUsd, setCustomPriceUsd] = useState('3.50');
  const [customError, setCustomError] = useState<string | null>(null);

  const filteredCatalog = filterCatalog(COMPONENT_CATALOG, searchQuery, category);
  const bomSummary = summarizeBom(project.bom);

  const handleExportCsv = () => {
    const csv = exportBomToCsv(project.bom);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.id}-bom.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCreateCustomPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customPartNo.trim()) {
      setCustomError(
        language === 'ar'
          ? 'يرجى إدخال اسم المكون والرقم التسلسلي.'
          : 'Please enter both component name and part number.'
      );
      return;
    }
    const parsedCurrent = Number(customCurrentMa);
    const parsedPrice = Number(customPriceUsd);
    if (!Number.isFinite(parsedCurrent) || parsedCurrent < 0 || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setCustomError(
        language === 'ar'
          ? 'يرجى إدخال قيم صالحة للتيار والسعر.'
          : 'Please enter valid non-negative values for current and price.'
      );
      return;
    }

    const customComp: CatalogComponent = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      nameAr: customName.trim(),
      partNumber: customPartNo.trim().toUpperCase(),
      category: customCategory,
      packageType: 'Custom Module',
      voltageRail: customRail,
      protocol: customProtocol.trim() || 'GPIO',
      i2cAddress: customI2cAddr.trim() || undefined,
      typicalCurrentMa: parsedCurrent,
      peakCurrentMa: parsedCurrent * 1.5,
      unitPriceUsd: parsedPrice,
      pinsRequired: 1,
      summaryAr: 'مكون مخصص مضاف للمشروع.',
      summaryEn: 'User-defined custom hardware component.',
    };

    onAddToBom(customComp);
    setCustomName('');
    setCustomPartNo('');
    setCustomI2cAddr('');
    setCustomError(null);
    setCustomModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Aggregated BOM Telemetry Bar */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div className="rounded-lg border border-slate-400/14 bg-[#171f33] p-4">
          <div className="text-xs text-[#94a3b8]">
            {language === 'ar' ? 'عدد الأصناف' : 'Unique SKUs'}
          </div>
          <div className="mt-1 tabular-ltr text-xl font-semibold text-[#f8fafc]">
            {bomSummary.totalUniqueParts}
          </div>
        </div>
        <div className="rounded-lg border border-slate-400/14 bg-[#171f33] p-4">
          <div className="text-xs text-[#94a3b8]">
            {language === 'ar' ? 'إجمالي القطع' : 'Total Units'}
          </div>
          <div className="mt-1 tabular-ltr text-xl font-semibold text-[#f8fafc]">
            {bomSummary.totalUnitCount}
          </div>
        </div>
        <div className="rounded-lg border border-slate-400/14 bg-[#171f33] p-4">
          <div className="text-xs text-[#94a3b8]">{t.bomTotalCost}</div>
          <div className="mt-1 tabular-ltr text-xl font-semibold text-[#4cd7f6]">
            ${bomSummary.totalCostUsd.toFixed(2)}
          </div>
        </div>
        <div className="rounded-lg border border-slate-400/14 bg-[#171f33] p-4">
          <div className="text-xs text-[#94a3b8]">
            {language === 'ar' ? 'استهلاك 3.3V' : '3.3V Rail Draw'}
          </div>
          <div className="mt-1 tabular-ltr text-xl font-semibold text-[#4edea3]">
            {bomSummary.rail3v3CurrentMa.toFixed(1)} mA
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1 rounded-lg border border-slate-400/14 bg-[#171f33] p-4">
          <div className="text-xs text-[#94a3b8]">
            {language === 'ar' ? 'استهلاك 5V' : '5V Rail Draw'}
          </div>
          <div className="mt-1 tabular-ltr text-xl font-semibold text-[#ffb95f]">
            {bomSummary.rail5vCurrentMa.toFixed(1)} mA
          </div>
        </div>
      </section>

      {/* Component Catalog Section (Single-elevation cards on canvas) */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 rounded-lg border border-slate-400/14 bg-[#171f33] p-3.5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-semibold text-[#f8fafc] whitespace-nowrap">
              {t.catalogTitle}
            </h2>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Component Category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    category === cat.id
                      ? 'bg-[#06b6d4] text-[#0b111e] font-semibold'
                      : 'bg-[#131b2e] text-[#bcc9cd] hover:bg-[#222a3d] hover:text-[#f8fafc]'
                  }`}
                >
                  {language === 'ar' ? cat.ar : cat.en}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[240px] sm:w-72">
              <Search
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-2.5 h-3.5 w-3.5 text-[#94a3b8]"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchComponentsPlaceholder}
                aria-label={t.searchComponentsPlaceholder}
                className="w-full rounded border border-slate-400/20 bg-[#0b111e] py-1.5 ps-8 pe-3 text-xs text-[#f8fafc] placeholder:text-[#64748b] focus:border-[#4cd7f6] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setCustomModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded border border-slate-400/20 bg-[#162032] px-3 py-1.5 text-xs font-medium text-[#f8fafc] hover:border-[#4cd7f6] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-[#4cd7f6]" aria-hidden="true" />
              <span>{t.addCustomPart}</span>
            </button>
          </div>
        </div>

        <div>
          {filteredCatalog.length === 0 ? (
            <div className="rounded-lg border border-slate-400/14 bg-[#171f33] p-6 text-center text-xs text-[#94a3b8]">
              {language === 'ar'
                ? 'لا توجد مكونات مطابقة لنتيجة البحث.'
                : 'No components match your search criteria.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCatalog.map((comp) => {
                const existingInBom = project.bom.find((b) => b.componentId === comp.id);
                return (
                  <article
                    key={comp.id}
                    className="flex flex-col justify-between gap-3 rounded-lg border border-slate-400/14 bg-[#171f33] p-4 transition-colors hover:border-[#4cd7f6]/40"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#f8fafc]">
                          {language === 'ar' ? comp.nameAr : comp.name}
                        </h3>
                        <span className="tabular-ltr text-xs font-semibold text-[#4cd7f6] shrink-0">
                          ${comp.unitPriceUsd.toFixed(2)}
                        </span>
                      </div>

                      {/* Zero-Pill unboxed technical metadata line */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#94a3b8] tabular-ltr">
                        <span>{comp.partNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{comp.voltageRail}</span>
                        <span aria-hidden="true">·</span>
                        <span>{comp.protocol}</span>
                        {comp.i2cAddress && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#4edea3]">{comp.i2cAddress}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{comp.typicalCurrentMa} mA</span>
                      </div>

                      <p className="text-xs text-[#bcc9cd] line-clamp-2">
                        {language === 'ar' ? comp.summaryAr : comp.summaryEn}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-slate-400/10 pt-3">
                      <button
                        type="button"
                        onClick={() => onAddToBom(comp)}
                        className="inline-flex items-center gap-1.5 rounded bg-[#06b6d4] border border-[#22d3ee] px-3 py-1.5 text-xs font-semibold text-[#0b111e] hover:bg-[#4cd7f6] whitespace-nowrap cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {t.addToBom}
                          {existingInBom ? ` (${existingInBom.quantity})` : ''}
                        </span>
                      </button>

                      {comp.pinsRequired > 0 && (
                        <button
                          type="button"
                          onClick={() => onAssignComponentPin(comp.name)}
                          className="inline-flex items-center gap-1.5 rounded border border-slate-400/20 bg-[#131b2e] px-2.5 py-1.5 text-xs font-medium text-[#dae2fd] hover:border-[#4cd7f6] whitespace-nowrap cursor-pointer"
                        >
                          <Cpu className="h-3.5 w-3.5 text-[#4cd7f6]" aria-hidden="true" />
                          <span>{t.assignPin}</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Active Project BOM Table */}
      <section className="rounded-lg border border-slate-400/14 bg-[#171f33]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-400/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-[#f8fafc]">{t.activeBomTitle}</h2>
            {bomSummary.i2cAddresses.some((a) => a.conflict) && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#ffb4ab]">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                {t.i2cConflictLabel}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={project.bom.length === 0}
            className="inline-flex items-center gap-1.5 rounded border border-slate-400/20 bg-[#162032] px-3 py-1.5 text-xs font-medium text-[#f8fafc] hover:border-[#4cd7f6] disabled:opacity-40 whitespace-nowrap cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#4edea3]" aria-hidden="true" />
            <span>{t.exportCsv}</span>
          </button>
        </div>

        {project.bom.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#94a3b8]">{t.emptyBom}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="border-b border-slate-400/10 bg-[#131b2e] text-[#94a3b8]">
                <tr>
                  <th className="px-4 py-2.5 font-medium text-start">{t.componentCol}</th>
                  <th className="px-3 py-2.5 font-medium text-start">Rail / Bus</th>
                  <th className="px-3 py-2.5 font-medium text-center">{t.qtyCol}</th>
                  <th className="px-3 py-2.5 font-medium text-end">{t.currentCol}</th>
                  <th className="px-3 py-2.5 font-medium text-end">{t.priceCol}</th>
                  <th className="px-3 py-2.5 font-medium text-end">{t.totalCol}</th>
                  <th className="px-3 py-2.5 font-medium text-start">{t.statusCol}</th>
                  <th className="px-4 py-2.5 font-medium text-end">{t.actionsCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-400/10">
                {project.bom.map((item: BomItem) => (
                  <tr key={item.id} className="hover:bg-[#222a3d]/60 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-[#f8fafc]">
                        {language === 'ar' ? item.nameAr : item.name}
                      </div>
                      <div className="tabular-ltr text-[11px] text-[#94a3b8]">
                        {item.partNumber}
                        {item.i2cAddress ? ` · I2C ${item.i2cAddress}` : ''}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 tabular-ltr text-[#bcc9cd]">
                      {item.voltageRail} · {item.protocol}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateBomQuantity(item.id, -1)}
                          aria-label={`Decrease quantity for ${item.name}`}
                          className="rounded border border-slate-400/20 bg-[#0b111e] p-1 text-[#dae2fd] hover:border-[#4cd7f6] cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center tabular-ltr font-semibold text-[#f8fafc]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateBomQuantity(item.id, 1)}
                          aria-label={`Increase quantity for ${item.name}`}
                          className="rounded border border-slate-400/20 bg-[#0b111e] p-1 text-[#dae2fd] hover:border-[#4cd7f6] cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 tabular-ltr text-end text-[#dae2fd]">
                      {(item.typicalCurrentMa * item.quantity).toFixed(1)} mA
                    </td>
                    <td className="px-3 py-2.5 tabular-ltr text-end text-[#94a3b8]">
                      ${item.unitPriceUsd.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 tabular-ltr text-end font-semibold text-[#4cd7f6]">
                      ${(item.unitPriceUsd * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          onUpdateBomStatus(item.id, e.target.value as BomStatus)
                        }
                        aria-label={`Status for ${item.name}`}
                        className="rounded border border-slate-400/20 bg-[#0b111e] px-2 py-1 text-[11px] text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
                      >
                        <option value="in_stock">{t.inStock}</option>
                        <option value="ordered">{t.ordered}</option>
                        <option value="needed">{t.needed}</option>
                      </select>
                    </td>
                    <td className="px-4 py-2.5 text-end">
                      <button
                        type="button"
                        onClick={() => onRemoveBomItem(item.id)}
                        aria-label={`Remove ${item.name} from BOM`}
                        className="rounded p-1.5 text-[#94a3b8] hover:bg-[#f43f5e]/15 hover:text-[#ffb4ab] cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add Custom Component Modal */}
      {customModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-part-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
        >
          <div className="w-full max-w-md rounded-lg border border-[#4cd7f6]/30 bg-[#1e293b] shadow-[0_16px_32px_-8px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-slate-400/14 px-4 py-3">
              <h3 id="custom-part-modal-title" className="text-sm font-semibold text-[#f8fafc]">
                {t.addCustomPart}
              </h3>
              <button
                type="button"
                onClick={() => setCustomModalOpen(false)}
                aria-label={t.cancel}
                className="rounded p-1 text-[#94a3b8] hover:text-[#f8fafc] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomPart} className="p-4 space-y-3">
              <div>
                <label htmlFor="custom-name" className="mb-1 block text-xs text-[#bcc9cd]">
                  {language === 'ar' ? 'اسم المكون' : 'Component Name'}
                </label>
                <input
                  id="custom-name"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. SHT40 Temp/Humidity"
                  className="w-full rounded border border-slate-400/20 bg-[#0b111e] px-3 py-2 text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="custom-partno" className="mb-1 block text-xs text-[#bcc9cd]">
                    {language === 'ar' ? 'الرقم التسلسلي' : 'Part Number'}
                  </label>
                  <input
                    id="custom-partno"
                    type="text"
                    value={customPartNo}
                    onChange={(e) => setCustomPartNo(e.target.value)}
                    placeholder="SHT40-AD1B"
                    className="w-full rounded border border-slate-400/20 bg-[#0b111e] px-3 py-2 font-mono text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="custom-category" className="mb-1 block text-xs text-[#bcc9cd]">
                    {language === 'ar' ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    id="custom-category"
                    value={customCategory}
                    onChange={(e) =>
                      setCustomCategory(e.target.value as Exclude<ComponentCategory, 'all'>)
                    }
                    className="w-full rounded border border-slate-400/20 bg-[#0b111e] px-3 py-2 text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {language === 'ar' ? cat.ar : cat.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="custom-rail" className="mb-1 block text-xs text-[#bcc9cd]">
                    Rail
                  </label>
                  <select
                    id="custom-rail"
                    value={customRail}
                    onChange={(e) => setCustomRail(e.target.value as '3.3V' | '5V')}
                    className="w-full rounded border border-slate-400/20 bg-[#0b111e] px-3 py-2 font-mono text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
                  >
                    <option value="3.3V">3.3V</option>
                    <option value="5V">5V</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="custom-protocol" className="mb-1 block text-xs text-[#bcc9cd]">
                    Protocol
                  </label>
                  <input
                    id="custom-protocol"
                    type="text"
                    value={customProtocol}
                    onChange={(e) => setCustomProtocol(e.target.value)}
                    className="w-full rounded border border-slate-400/20 bg-[#0b111e] px-3 py-2 font-mono text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="custom-i2c" className="mb-1 block text-xs text-[#bcc9cd]">
                    I2C Addr
                  </label>
                  <input
                    id="custom-i2c"
                    type="text"
                    value={customI2cAddr}
                    onChange={(e) => setCustomI2cAddr(e.target.value)}
                    placeholder="0x44"
                    className="w-full rounded border border-slate-400/20 bg-[#0b111e] px-3 py-2 font-mono text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="custom-ma" className="mb-1 block text-xs text-[#bcc9cd]">
                    {language === 'ar' ? 'التيار (mA)' : 'Current (mA)'}
                  </label>
                  <input
                    id="custom-ma"
                    type="number"
                    min="0"
                    step="0.1"
                    value={customCurrentMa}
                    onChange={(e) => setCustomCurrentMa(e.target.value)}
                    className="w-full rounded border border-slate-400/20 bg-[#0b111e] px-3 py-2 font-mono text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="custom-price" className="mb-1 block text-xs text-[#bcc9cd]">
                    {language === 'ar' ? 'السعر (USD)' : 'Unit Price (USD)'}
                  </label>
                  <input
                    id="custom-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={customPriceUsd}
                    onChange={(e) => setCustomPriceUsd(e.target.value)}
                    className="w-full rounded border border-slate-400/20 bg-[#0b111e] px-3 py-2 font-mono text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
                  />
                </div>
              </div>

              {customError && (
                <p role="alert" className="text-xs text-[#ffb4ab]">
                  {customError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  className="rounded border border-slate-400/20 bg-[#162032] px-3.5 py-2 text-xs text-[#dae2fd] hover:border-[#4cd7f6] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded bg-[#06b6d4] border border-[#22d3ee] px-4 py-2 text-xs font-semibold text-[#0b111e] hover:bg-[#4cd7f6] cursor-pointer"
                >
                  {t.createPart}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

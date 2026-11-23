import { useState } from 'react';
import { Download, Menu, X } from 'lucide-react';
import type { Language, ScreenId } from '../types/hardware';
import { UI_COPY } from '../i18n/translations';

interface TopBarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  language: Language;
  onExportProject: () => void;
}

const NAV_ITEMS: Array<{ id: ScreenId; labelKey: string }> = [
  { id: 'dashboard', labelKey: 'navDashboard' },
  { id: 'pin-planner', labelKey: 'navPinPlanner' },
  { id: 'calculators', labelKey: 'navCalculators' },
  { id: 'components', labelKey: 'navComponents' },
];

export function TopBar({
  activeScreen,
  onNavigate,
  language,
  onExportProject,
}: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_COPY[language];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-400/12 bg-[#0f172a]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-4 py-3 sm:px-6">
        {/* Zone 1: Single text wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="text-lg font-bold tracking-tight text-[#f8fafc] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#4cd7f6] rounded cursor-pointer"
        >
          ProtoPath
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav
          aria-label={language === 'ar' ? 'التنقل الرئيسي' : 'Primary Navigation'}
          className="hidden md:flex items-center gap-6"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4cd7f6] rounded ${
                  isActive
                    ? 'text-[#4cd7f6]'
                    : 'text-[#bcc9cd] hover:text-[#f8fafc]'
                }`}
              >
                {t[item.labelKey]}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[13px] h-[2px] bg-[#4cd7f6]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + mobile drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onExportProject}
            className="inline-flex items-center gap-2 rounded bg-[#06b6d4] border border-[#22d3ee] px-3.5 py-1.5 text-xs font-semibold text-[#0b111e] transition-all duration-150 hover:bg-[#4cd7f6] hover:shadow-[0_0_12px_rgba(76,215,246,0.3)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#f8fafc]"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.exportProject}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={language === 'ar' ? 'فتح قائمة التنقل' : 'Toggle navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex md:hidden items-center justify-center rounded border border-slate-400/20 bg-[#162032] p-2 text-[#dae2fd] hover:border-[#4cd7f6] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label={language === 'ar' ? 'قائمة الجوال' : 'Mobile Navigation'}
          className="md:hidden border-t border-slate-400/12 bg-[#131b2e] px-4 py-3 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-start px-3 py-2.5 rounded text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#222a3d] text-[#4cd7f6]'
                    : 'text-[#bcc9cd] hover:bg-[#171f33] hover:text-[#f8fafc]'
                }`}
              >
                {t[item.labelKey]}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}

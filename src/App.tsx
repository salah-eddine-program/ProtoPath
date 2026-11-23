import { useEffect, useState } from 'react';
import { Download, ExternalLink, Globe, RotateCcw } from 'lucide-react';
import type {
  BomStatus,
  CatalogComponent,
  HardwareProject,
  Language,
  PinAssignment,
  ScreenId,
} from './types/hardware';
import { PROJECT_PRESETS } from './data/presets';
import { SCREEN_TITLES, UI_COPY } from './i18n/translations';
import { createBomItemFromCatalog } from './utils/bom';
import { TopBar } from './components/TopBar';
import { DashboardScreen } from './components/DashboardScreen';
import { PinPlannerScreen } from './components/PinPlannerScreen';
import { CalculatorsScreen } from './components/CalculatorsScreen';
import { ComponentsScreen } from './components/ComponentsScreen';

const STORAGE_KEY_PROJECT = 'protopath_active_project_v1';
const STORAGE_KEY_LANG = 'protopath_language_v1';

function loadInitialProject(): HardwareProject {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECT);
    if (raw) {
      const parsed = JSON.parse(raw) as HardwareProject;
      if (parsed && parsed.id && parsed.assignments && Array.isArray(parsed.bom)) {
        return parsed;
      }
    }
  } catch {
    // Fallback to default preset
  }
  return structuredClone(PROJECT_PRESETS[0]);
}

function loadInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    // Default Arabic + bilingual spec
  }
  return 'ar';
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [language, setLanguage] = useState<Language>(loadInitialLanguage);
  const [project, setProject] = useState<HardwareProject>(loadInitialProject);
  const [selectedPhysicalPin, setSelectedPhysicalPin] = useState<number>(25); // GPIO21 default
  const [prefilledComponentName, setPrefilledComponentName] = useState<string | undefined>(
    undefined
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem(STORAGE_KEY_LANG, language);
    } catch {
      // Ignore storage errors
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECT, JSON.stringify(project));
    } catch {
      // Ignore storage errors
    }
  }, [project]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  const t = UI_COPY[language];
  const screenInfo = SCREEN_TITLES[activeScreen];

  const handleSelectPreset = (presetId: string) => {
    const found = PROJECT_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setProject(structuredClone(found));
      setPrefilledComponentName(undefined);
    }
  };

  const handleResetProject = () => {
    const base =
      PROJECT_PRESETS.find((p) => p.id === project.id) ?? PROJECT_PRESETS[0];
    setProject(structuredClone(base));
    setPrefilledComponentName(undefined);
  };

  const handleExportProject = () => {
    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.id}-protopath.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(t.exportedToast);
  };

  const handleAssignPin = (assignment: PinAssignment) => {
    setProject((prev) => ({
      ...prev,
      assignments: {
        ...prev.assignments,
        [assignment.physicalPin]: assignment,
      },
    }));
  };

  const handleClearPin = (physicalPin: number) => {
    setProject((prev) => {
      const next = { ...prev.assignments };
      delete next[physicalPin];
      return { ...prev, assignments: next };
    });
  };

  const handleToggleWifi = (enabled: boolean) => {
    setProject((prev) => ({ ...prev, wifiEnabled: enabled }));
  };

  const handleAddToBom = (component: CatalogComponent) => {
    setProject((prev) => {
      const existing = prev.bom.find((item) => item.componentId === component.id);
      if (existing) {
        return {
          ...prev,
          bom: prev.bom.map((item) =>
            item.componentId === component.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...prev,
        bom: [...prev.bom, createBomItemFromCatalog(component, 'needed')],
      };
    });
  };

  const handleUpdateBomQuantity = (bomId: string, delta: number) => {
    setProject((prev) => ({
      ...prev,
      bom: prev.bom
        .map((item) =>
          item.id === bomId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0),
    }));
  };

  const handleUpdateBomStatus = (bomId: string, status: BomStatus) => {
    setProject((prev) => ({
      ...prev,
      bom: prev.bom.map((item) =>
        item.id === bomId ? { ...item, status } : item
      ),
    }));
  };

  const handleRemoveBomItem = (bomId: string) => {
    setProject((prev) => ({
      ...prev,
      bom: prev.bom.filter((item) => item.id !== bomId),
    }));
  };

  const handleInspectPinFromDashboard = (physicalPin: number) => {
    setSelectedPhysicalPin(physicalPin);
    setPrefilledComponentName(undefined);
    setActiveScreen('pin-planner');
  };

  const handleAssignComponentPin = (componentName: string) => {
    setPrefilledComponentName(componentName);
    setActiveScreen('pin-planner');
  };

  return (
    <div className="min-h-screen schematic-grid text-[#dae2fd] flex flex-col">
      <TopBar
        activeScreen={activeScreen}
        onNavigate={(screen) => {
          setActiveScreen(screen);
          if (screen !== 'pin-planner') setPrefilledComponentName(undefined);
        }}
        language={language}
        onExportProject={handleExportProject}
      />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6">
        {/* Workspace Control Bar (Screen Title + Preset Switcher + AR/EN Toggle) */}
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-400/12 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#f8fafc] sm:text-2xl">
              {screenInfo.specTitle}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2">
              <label
                htmlFor="project-preset-select"
                className="text-xs font-medium text-[#94a3b8] whitespace-nowrap"
              >
                {t.projectPresetLabel}:
              </label>
              <select
                id="project-preset-select"
                value={project.id}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="rounded border border-slate-400/20 bg-[#131b2e] px-2.5 py-1.5 text-xs text-[#f8fafc] focus:border-[#4cd7f6] focus:outline-none"
              >
                {PROJECT_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {language === 'ar' ? preset.nameAr : preset.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleResetProject}
              title={t.resetProject}
              className="inline-flex items-center gap-1.5 rounded border border-slate-400/20 bg-[#131b2e] px-2.5 py-1.5 text-xs font-medium text-[#bcc9cd] hover:border-[#4cd7f6] hover:text-[#f8fafc] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.resetProject}</span>
            </button>

            <div
              role="group"
              aria-label="Language switcher"
              className="flex rounded border border-slate-400/20 bg-[#131b2e] p-0.5 text-xs"
            >
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`rounded px-2 py-1 font-medium cursor-pointer ${
                  language === 'ar'
                    ? 'bg-[#222a3d] text-[#4cd7f6]'
                    : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                AR
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`rounded px-2 py-1 font-medium cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#222a3d] text-[#4cd7f6]'
                    : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                EN
              </button>
            </div>

            <a
              href="https://salah-eddine-program.github.io/bt-salahdine.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="bt-salahdine.com"
              aria-label={
                language === 'ar'
                  ? 'زيارة موقعي bt-salahdine.com'
                  : 'Visit my website bt-salahdine.com'
              }
              className="inline-flex items-center justify-center rounded border border-slate-400/20 bg-[#131b2e] p-2 text-[#4cd7f6] transition-colors hover:border-[#4cd7f6] hover:bg-[#222a3d] hover:text-[#acedff] focus-visible:outline-2 focus-visible:outline-[#4cd7f6]"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Active Screen Viewport */}
        {activeScreen === 'dashboard' && (
          <DashboardScreen
            project={project}
            language={language}
            onNavigate={setActiveScreen}
            onInspectPin={handleInspectPinFromDashboard}
          />
        )}

        {activeScreen === 'pin-planner' && (
          <PinPlannerScreen
            project={project}
            language={language}
            selectedPhysicalPin={selectedPhysicalPin}
            prefilledComponentName={prefilledComponentName}
            onSelectPhysicalPin={setSelectedPhysicalPin}
            onAssignPin={handleAssignPin}
            onClearPin={handleClearPin}
            onToggleWifi={handleToggleWifi}
          />
        )}

        {activeScreen === 'calculators' && (
          <CalculatorsScreen project={project} language={language} />
        )}

        {activeScreen === 'components' && (
          <ComponentsScreen
            project={project}
            language={language}
            onAddToBom={handleAddToBom}
            onUpdateBomQuantity={handleUpdateBomQuantity}
            onUpdateBomStatus={handleUpdateBomStatus}
            onRemoveBomItem={handleRemoveBomItem}
            onAssignComponentPin={handleAssignComponentPin}
          />
        )}
      </main>

      <footer className="border-t border-slate-400/12 bg-[#0f172a]/80">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-3 text-xs text-[#94a3b8] sm:px-6">
          <span>ProtoPath</span>
          <div className="flex flex-wrap items-center gap-5">
            {(typeof window !== 'undefined' &&
              (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1' ||
                window.location.hostname.endsWith('.run.app'))) && (
              <a
                href="/protopath-github.zip"
                download="protopath-github.zip"
                className="inline-flex items-center gap-1.5 text-[#bcc9cd] transition-colors hover:text-[#4cd7f6] focus-visible:outline-2 focus-visible:outline-[#4cd7f6] rounded"
              >
                <Download className="h-3.5 w-3.5 text-[#4cd7f6]" aria-hidden="true" />
                <span>{t.downloadSourceZip}</span>
              </a>
            )}
            <a
              href="https://salah-eddine-program.github.io/bt-salahdine.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#bcc9cd] transition-colors hover:text-[#4cd7f6] focus-visible:outline-2 focus-visible:outline-[#4cd7f6] rounded"
            >
              <Globe className="h-3.5 w-3.5 text-[#4cd7f6]" aria-hidden="true" />
              <span className="tabular-ltr">bt-salahdine.com</span>
              <ExternalLink className="h-3 w-3 opacity-75" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>

      {/* Transient Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 end-5 z-50 rounded border border-[#4cd7f6]/40 bg-[#1e293b] px-4 py-2.5 text-xs font-medium text-[#f8fafc] shadow-[0_16px_32px_-8px_rgba(0,0,0,0.6)]"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

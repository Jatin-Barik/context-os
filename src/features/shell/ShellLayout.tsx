import { motion } from 'framer-motion';
import { Activity, ArrowRight, ChevronLeft, ChevronRight, History, LayoutGrid, Mail, MemoryStick, PanelRight, Settings, Sparkles, SquareStack, BookOpen, Cpu, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SidebarItem } from '@/components/ui/SidebarItem';
import { useShellStore } from '@/store/shellStore';
import { HomePage } from '@/pages/HomePage';
import { HistoryPage } from '@/pages/HistoryPage';
import { MemoryPage } from '@/pages/MemoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ModelManagerPage } from '@/pages/ModelManagerPage';
import { ExtensionsPage } from '@/pages/ExtensionsPage';
import { AboutPage } from '@/pages/AboutPage';
import { TopBar } from '@/components/layout/TopBar';
import { ContextInspector } from './ContextInspector';
import { useApplicationContext } from '@/integrations/core/useApplicationContext';

const navItems = [
  { id: 'home', label: 'Home', icon: Sparkles },
  { id: 'history', label: 'History', icon: History },
  { id: 'memory', label: 'Memory', icon: MemoryStick },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'models', label: 'Model Manager', icon: SquareStack },
  { id: 'extensions', label: 'Extensions', icon: LayoutGrid },
  { id: 'about', label: 'About', icon: BookOpen }
] as const;

const pageMap = {
  home: HomePage,
  history: HistoryPage,
  memory: MemoryPage,
  settings: SettingsPage,
  models: ModelManagerPage,
  extensions: ExtensionsPage,
  about: AboutPage
} as const;

export function ShellLayout() {
  const activePage = useShellStore((state) => state.activePage);
  const setActivePage = useShellStore((state) => state.setActivePage);
  const openPalette = useShellStore((state) => state.openPalette);
  const latestAction = useShellStore((state) => state.generatedActions[0] ?? null);
  const latestContext = useShellStore((state) => state.recentContexts[0] ?? null);
  const appInfo = useShellStore((state) => state.appInfo);
  const [collapsed, setCollapsed] = useState(false);
  const { applicationContext } = useApplicationContext({ context: latestContext, appInfo });

  const ActivePage = pageMap[activePage];
  const statusSummary = useMemo(() => {
    if (applicationContext) {
      return {
        title: applicationContext.applicationName || 'Context captured',
        detail: applicationContext.health.detail || applicationContext.summary || 'Screen context was captured successfully.'
      };
    }

    return { title: 'Ready', detail: 'No local capture yet. The shell is waiting for context.' };
  }, [applicationContext]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1680px] gap-6 px-4 py-4 lg:px-6">
      <aside className={`hidden shrink-0 lg:flex lg:flex-col ${collapsed ? 'w-24' : 'w-72'}`}>
        <GlassCard className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden p-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">ContextOS</p>
              {!collapsed ? <h1 className="mt-2 text-lg font-semibold text-white">AI operating layer</h1> : null}
            </div>
            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:text-white"
              onClick={() => setCollapsed((previous) => !previous)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <nav className="mt-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <SidebarItem
                  key={item.id}
                  label={item.label}
                  icon={Icon}
                  active={active}
                  collapsed={collapsed}
                  onClick={() => setActivePage(item.id)}
                />
              );
            })}
          </nav>

          <div className="mt-auto space-y-3 border-t border-white/10 pt-4">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              onClick={openPalette}
            >
              <Activity className="h-4 w-4" />
              {!collapsed ? 'Open palette' : null}
            </button>
            {!collapsed ? <p className="text-xs leading-5 text-slate-500">Shortcut: Ctrl + Space</p> : null}
          </div>
        </GlassCard>
      </aside>

      <main className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <TopBar />

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <ActivePage />
            <ContextInspector input={latestContext} appInfo={appInfo} />
          </motion.div>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300/70">Context snapshot</p>
              <PanelRight className="h-4 w-4 text-slate-500" />
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Current app</div>
                <div className="mt-2 text-base font-medium text-white">{applicationContext?.applicationName ?? latestContext?.appName ?? 'No active capture yet'}</div>
                <div className="mt-1 text-slate-400">{applicationContext?.adapterName ?? latestContext?.windowTitle ?? 'Capture screen data to populate this panel.'}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Selected text</div>
                <div className="mt-2 text-slate-300">{applicationContext?.selectedText || latestContext?.selectedText || 'Nothing selected yet.'}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Clipboard</div>
                <div className="mt-2 text-slate-300">{applicationContext?.clipboardText || latestContext?.clipboardText || 'Clipboard not captured.'}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Active adapter</div>
                <div className="mt-2 text-slate-300">{applicationContext?.adapterName || 'Resolving adapter...'}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{applicationContext?.health.detail || 'Pending'}</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300/70">Recent action</p>
              <Mail className="h-4 w-4 text-slate-500" />
            </div>
            {latestAction ? (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium text-white">{latestAction.title}</div>
                <p className="text-sm leading-6 text-slate-400">{latestAction.detail}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {latestAction.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-400">Run a command from the palette to see the generated action here.</p>
            )}
          </GlassCard>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-3">
        <GlassCard className="flex w-full max-w-5xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/25 px-4 py-3 shadow-[0_16px_70px_rgba(2,6,23,0.45)] backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Status</div>
              <div className="text-sm font-medium text-white">{statusSummary.title}</div>
            </div>
          </div>
          <div className="hidden items-center gap-4 text-sm text-slate-400 md:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Cpu className="h-3.5 w-3.5" />
              Local inference ready
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <ArrowRight className="h-3.5 w-3.5" />
              {statusSummary.detail}
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

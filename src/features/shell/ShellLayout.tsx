import { motion } from 'framer-motion';
import { Activity, History, LayoutGrid, Mail, MemoryStick, Settings, Sparkles, SquareStack, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useShellStore } from '@/store/shellStore';
import { HomePage } from '@/pages/HomePage';
import { HistoryPage } from '@/pages/HistoryPage';
import { MemoryPage } from '@/pages/MemoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ModelManagerPage } from '@/pages/ModelManagerPage';
import { ExtensionsPage } from '@/pages/ExtensionsPage';
import { AboutPage } from '@/pages/AboutPage';
import { TopBar } from '@/components/layout/TopBar';

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

  const ActivePage = pageMap[activePage];

  return (
    <div className="mx-auto flex min-h-screen max-w-[1680px] gap-6 px-5 py-5 lg:px-8">
      <aside className="hidden w-72 shrink-0 lg:flex lg:flex-col">
        <GlassCard className="sticky top-5 flex h-[calc(100vh-2.5rem)] flex-col overflow-hidden p-4">
          <div className="border-b border-white/10 pb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">ContextOS</p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-white">The AI operating layer</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">Understands what is on screen and keeps sensitive processing local.</p>
          </div>

          <nav className="mt-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                    active ? 'bg-cyan-400/12 text-white' : 'text-slate-300 hover:bg-white/5'
                  }`}
                  onClick={() => setActivePage(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3 border-t border-white/10 pt-4">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              onClick={openPalette}
            >
              <Activity className="h-4 w-4" />
              Open palette
            </button>
            <p className="text-xs leading-5 text-slate-500">Shortcut: Ctrl + Space</p>
          </div>
        </GlassCard>
      </aside>

      <main className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <TopBar />

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <ActivePage />
          </motion.div>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">Context snapshot</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Current app</div>
                <div className="mt-2 text-base font-medium text-white">{latestContext?.appName ?? 'No active capture yet'}</div>
                <div className="mt-1 text-slate-400">{latestContext?.windowTitle ?? 'Capture screen data to populate this panel.'}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Selected text</div>
                <div className="mt-2 text-slate-300">{latestContext?.selectedText || 'Nothing selected yet.'}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Clipboard</div>
                <div className="mt-2 text-slate-300">{latestContext?.clipboardText || 'Clipboard not captured.'}</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">Recent action</p>
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
    </div>
  );
}

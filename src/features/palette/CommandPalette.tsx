import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { getCommandById, searchCommands } from './commandRegistry';
import { useShellStore } from '@/store/shellStore';
import { cn } from '@/lib/cn';

interface CommandPaletteProps {
  onClose: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const appInfo = useShellStore((state) => state.appInfo);
  const latestContext = useShellStore((state) => state.recentContexts[0] ?? null);
  const recordPrompt = useShellStore((state) => state.recordPrompt);
  const recordGeneratedAction = useShellStore((state) => state.recordGeneratedAction);
  const setActivePage = useShellStore((state) => state.setActivePage);
  const closePalette = useShellStore((state) => state.closePalette);

  const commands = useMemo(() => searchCommands(query), [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeCommand = useCallback(
    (commandId: string): void => {
      const command = getCommandById(commandId as Parameters<typeof getCommandById>[0]);
      const result = command.run({ appInfo, latestContext });
      const timestamp = new Date().toISOString();

      recordPrompt({
        id: crypto.randomUUID(),
        commandId: command.id,
        title: command.title,
        summary: result.summary,
        createdAt: timestamp
      });

      recordGeneratedAction({
        id: crypto.randomUUID(),
        title: result.title,
        detail: result.detail,
        tags: result.tags,
        createdAt: timestamp
      });

      if (command.id === 'generate-tests') {
        setActivePage('history');
      }

      closePalette();
      onClose();
    },
    [appInfo, closePalette, latestContext, onClose, recordGeneratedAction, recordPrompt, setActivePage]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePalette();
        onClose();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((current) => Math.min(current + 1, commands.length - 1));
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === 'Enter' && commands[selectedIndex]) {
        event.preventDefault();
        executeCommand(commands[selectedIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePalette, commands, executeCommand, onClose, selectedIndex]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 px-4 pt-[14vh] backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
    >
      <motion.div
        className="w-full max-w-3xl"
        initial={{ y: 18, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 12, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <GlassCard className="overflow-hidden border-white/15 bg-slate-950/80">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">ContextOS</p>
              <p className="text-sm text-slate-300">{appInfo ? `${appInfo.name} · ${appInfo.platform}` : 'Ready to analyze the current screen locally'}</p>
            </div>
          </div>

          <label className="flex items-center gap-3 border-b border-white/10 px-5 py-4 text-slate-300">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Explain this, summarize, rewrite, extract..."
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </label>

          <div className="max-h-[460px] overflow-y-auto p-2">
            {commands.map((command, index) => {
              const active = index === selectedIndex;
              return (
                <button
                  key={command.id}
                  className={cn(
                    'flex w-full items-start gap-4 rounded-2xl px-4 py-3 text-left transition',
                    active ? 'bg-cyan-400/12 text-white' : 'text-slate-200 hover:bg-white/5'
                  )}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => executeCommand(command.id)}
                >
                  <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(103,232,249,0.55)]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium">{command.title}</span>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-400">
                        {command.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{command.description}</p>
                  </div>
                </button>
              );
            })}
            {commands.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-slate-400">No commands match the current query.</div>
            ) : null}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

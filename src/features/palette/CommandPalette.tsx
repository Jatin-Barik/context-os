import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Sparkles, Clock3, Command, ScanLine, Camera } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { searchCommands } from './commandRegistry';
import { useShellStore } from '@/store/shellStore';
import { useCommandPaletteStore } from './commandPaletteStore';
import { createCommandService } from './commandService';
import { cn } from '@/lib/cn';
import type { CaptureResult, DisplaySource, OcrResult } from '@shared/bridge';
import { buildContext } from '@/services/context/contextBuilder';

interface CommandPaletteProps {
  onClose: () => void;
}

function highlightMatch(text: string, query: string): string {
  if (!query.trim()) {
    return text;
  }

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(${escaped})`, 'ig');
  return text.replace(pattern, '<mark>$1</mark>');
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const appInfo = useShellStore((state) => state.appInfo);
  const closePalette = useShellStore((state) => state.closePalette);
  const query = useCommandPaletteStore((state) => state.query);
  const selectedIndex = useCommandPaletteStore((state) => state.selectedIndex);
  const recentCommands = useCommandPaletteStore((state) => state.recentCommands);
  const setQuery = useCommandPaletteStore((state) => state.setQuery);
  const setSelectedIndex = useCommandPaletteStore((state) => state.setSelectedIndex);
  const resetSelection = useCommandPaletteStore((state) => state.resetSelection);
  const paletteService = useMemo(() => createCommandService(), []);
  const recordContext = useShellStore((state) => state.recordContext);
  const [captureSources, setCaptureSources] = useState<DisplaySource[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [captureResult, setCaptureResult] = useState<CaptureResult | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [captureStatus, setCaptureStatus] = useState<'idle' | 'capturing' | 'ready' | 'error'>('idle');
  const [captureError, setCaptureError] = useState<string | null>(null);

  const commands = useMemo(() => searchCommands(query), [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    resetSelection();
  }, [query, resetSelection]);

  useEffect(() => {
    const loadSources = async () => {
      if (!window.contextos?.getDisplays) {
        return;
      }

      try {
        const sources = await window.contextos.getDisplays();
        setCaptureSources(sources);
        if (sources[0]) {
          setSelectedSourceId(sources[0].id);
        }
      } catch (error) {
        console.error('Unable to load capture sources', error);
      }
    };

    void loadSources();
  }, []);

  const runCapture = async (): Promise<void> => {
    if (!window.contextos?.captureScreen || !window.contextos?.captureOcr) {
      setCaptureStatus('error');
      setCaptureError('Capture bridge is not available in this runtime.');
      return;
    }

    setCaptureStatus('capturing');
    setCaptureError(null);

    try {
      const nextCapture = await window.contextos.captureScreen({ sourceId: selectedSourceId || undefined });
      setCaptureResult(nextCapture);
      const clipboardText = await window.contextos.readClipboard();
      const nextOcr = await window.contextos.captureOcr(nextCapture.dataUrl);
      setOcrResult(nextOcr);

      const selectedSource = captureSources.find((source) => source.id === selectedSourceId);
      const sourceLabel = selectedSource?.name ?? appInfo?.name ?? 'Current desktop';
      const context = buildContext({
        windowTitle: sourceLabel,
        windowProcess: selectedSource?.isWindow ? sourceLabel : (appInfo?.name ?? 'desktop'),
        ocrText: nextOcr.text,
        ocrResult: nextOcr,
        clipboardText,
        selectedText: nextOcr.text,
        displayName: selectedSource?.name ?? 'Primary Display',
        resolution: `${nextCapture.width}x${nextCapture.height}`,
        timestamp: nextCapture.capturedAt,
        metadata: {
          platform: appInfo?.platform ?? window.navigator.platform,
          userAgent: window.navigator.userAgent,
          captureSource: sourceLabel
        }
      });

      recordContext({
        id: crypto.randomUUID(),
        appName: context.application.name,
        windowTitle: context.windowTitle,
        selectedText: context.selectedText.selection || nextOcr.text || '',
        clipboardText: context.clipboard.text,
        currentUrl: context.browser.available ? context.browser.url ?? '' : '',
        currentFileName: context.windowProcess,
        currentLanguage: context.ocr.language,
        currentErrorMessage: context.ocr.containsError ? nextOcr.text : '',
        currentTableSummary: context.ocr.containsTable ? 'Table detected' : '',
        currentImageSummary: context.summary ?? nextOcr.text,
        capturedAt: context.timestamp
      });

      setCaptureStatus('ready');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Capture failed unexpectedly.';
      setCaptureStatus('error');
      setCaptureError(message);
    }
  };

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
        setSelectedIndex(Math.min(selectedIndex + 1, Math.max(commands.length - 1, 0)));
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, 0));
      }

      if (event.key === 'Enter' && commands[selectedIndex]) {
        event.preventDefault();
        paletteService.executeCommand(commands[selectedIndex].id);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePalette, commands, onClose, paletteService, selectedIndex, setSelectedIndex]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/70 px-4 pt-[12vh] backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
    >
      <motion.div
        className="w-full max-w-3xl"
        initial={{ y: 18, opacity: 0, scale: 0.985 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 12, opacity: 0, scale: 0.985 }}
        transition={{ type: 'spring', damping: 28, stiffness: 290 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <GlassCard className="overflow-hidden border-white/15 bg-slate-950/85 shadow-[0_20px_70px_rgba(2,6,23,0.45)]">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-200/70">ContextOS</p>
              <p className="text-sm text-slate-300">{appInfo ? `${appInfo.name} · ${appInfo.platform}` : 'Ready to analyze the current screen locally'}</p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-400">
              Local only
            </div>
          </div>

          <label className="flex items-center gap-3 border-b border-white/10 px-5 py-4 text-slate-300">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try: explain screen, summarize, rewrite, settings..."
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-500"
              aria-label="Search commands"
            />
          </label>

          <div className="grid max-h-[480px] gap-4 overflow-y-auto p-3 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              {commands.length > 0 ? (
                <div className="space-y-1.5">
                  {commands.map((command, index) => {
                    const active = index === selectedIndex;
                    return (
                      <button
                        key={command.id}
                        type="button"
                        className={cn(
                          'flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40',
                          active ? 'border-cyan-400/20 bg-cyan-400/12 text-white' : 'border-transparent text-slate-200 hover:border-white/10 hover:bg-white/5'
                        )}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => {
                          paletteService.executeCommand(command.id);
                          onClose();
                        }}
                      >
                        <div className={cn('mt-1 rounded-2xl border p-2', active ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200' : 'border-white/10 bg-white/5 text-slate-400')}>
                          <Command className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium" dangerouslySetInnerHTML={{ __html: highlightMatch(command.title, query) }} />
                            <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-400">
                              {command.category}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-400">{command.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">
                  No commands match the current query.
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" />
                  Recent commands
                </div>
                <div className="mt-3 space-y-2">
                  {recentCommands.length > 0 ? (
                    recentCommands.map((entry) => (
                      <div key={`${entry.id}-${entry.timestamp}`} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                        <div className="font-medium text-white">{entry.title}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{entry.category}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-3 py-5 text-sm text-slate-400">
                      Your last runs will appear here.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <ScanLine className="h-3.5 w-3.5" />
                    Capture & OCR
                  </span>
                  <span>{captureStatus === 'capturing' ? 'Working' : captureStatus === 'ready' ? 'Ready' : 'Idle'}</span>
                </div>
                <div className="mt-3 space-y-2">
                  <select
                    value={selectedSourceId}
                    onChange={(event) => setSelectedSourceId(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 outline-none"
                  >
                    {captureSources.length > 0 ? (
                      captureSources.map((source) => (
                        <option key={source.id} value={source.id}>
                          {source.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No capture sources available</option>
                    )}
                  </select>
                  <button
                    type="button"
                    onClick={() => void runCapture()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
                  >
                    <Camera className="h-4 w-4" />
                    Capture screen
                  </button>
                  {captureError ? <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{captureError}</div> : null}
                  {captureResult ? (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                      <img src={captureResult.dataUrl} alt="Captured screen preview" className="h-32 w-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 px-3 py-4 text-sm text-slate-400">
                      Capture a screen surface to preview the latest image and OCR output.
                    </div>
                  )}
                  {ocrResult ? (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-300">
                      <div className="font-medium text-white">OCR text</div>
                      <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">{ocrResult.text}</div>
                      <div className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                        Confidence {Math.round(ocrResult.confidence * 100)}% · {ocrResult.language}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-cyan-400/8 p-3">
                <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">
                  <span>Keyboard</span>
                  <span>↑ ↓ Enter Esc</span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                    <span>Jump to result</span>
                    <span className="text-slate-500">Enter</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                    <span>Close palette</span>
                    <span className="text-slate-500">Esc</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-sm text-slate-400">
            <span>Everything runs locally</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              No AI responses yet
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

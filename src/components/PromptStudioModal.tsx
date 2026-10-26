import React, { useState } from 'react';
import { 
  Wand2, 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Sliders, 
  Code, 
  Cpu, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { AIToolType } from '../types';
import { AI_TOOLS_LIST } from '../data/blogData';

interface PromptStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePrompt?: (promptText: string, tool: AIToolType) => void;
}

export const PromptStudioModal: React.FC<PromptStudioModalProps> = ({
  isOpen,
  onClose,
  onSavePrompt
}) => {
  const [selectedTool, setSelectedTool] = useState<AIToolType>('Claude');
  const [goal, setGoal] = useState('');
  const [tone, setTone] = useState('Professional & Modular');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [thinkingTokens, setThinkingTokens] = useState('4096');
  const [version, setVersion] = useState('v6.1');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!goal.trim()) return;

    setIsEnhancing(true);
    setErrorMsg('');

    try {
      // Call server API route `/api/enhance-prompt`
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: goal,
          tool: selectedTool,
          tone,
        }),
      });

      const data = await res.json();

      if (data.enhancedPrompt) {
        setGeneratedPrompt(data.enhancedPrompt);
      } else {
        // Fallback local rules generation if Gemini API key missing or error
        generateLocalFallback();
      }
    } catch (err) {
      console.warn('Using client-side template fallback:', err);
      generateLocalFallback();
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateLocalFallback = () => {
    let result = '';
    if (selectedTool === 'Claude') {
      result = `[SYSTEM PROMPT: CLAUDE 3.7 SONNET]
Role: Senior Staff Software Architect.
Task: ${goal}
Tone: ${tone}

Instructions:
1. Conduct architectural reasoning with budget: ${thinkingTokens} thinking tokens.
2. Provide strict TypeScript modular signatures.
3. Highlight security and race conditions before emitting final code block.`;
    } else if (selectedTool === 'Midjourney') {
      result = `Photorealistic architectural visualization of ${goal}, photorealistic lighting, Hasselblad H6D-100c, 35mm lens, f/8, interior ambient tungsten glow, soft misty dusk shadows --ar ${aspectRatio} --v ${version} --s 250 --style raw`;
    } else if (selectedTool === 'ChatGPT') {
      result = `Act as an expert Systems Engineer.
Objective: ${goal}
Style: ${tone}

Requirements:
- Enforce SOLID design principles.
- Avoid unhandled async rejections.
- Provide step-by-step technical breakdown and full code output.`;
    } else if (selectedTool === 'Suno') {
      result = `[Genre: Electronic Synthwave]
[Tempo: 124 BPM]
[Instruments: Moog Bass, Arpeggiated Prophet-6]

[Intro - Low Pulsing Synth]
(${goal})

[Verse 1]
Electric signals pulsing bright
Through the neon glowing night

[Chorus]
Breaking through the system line!`;
    } else if (selectedTool === 'Cursor') {
      result = `# .cursorrules
Project Rule:
Target Objective: ${goal}

Constraints:
- TypeScript strict mode
- Modular components under src/components/
- Clean Tailwind CSS v4 styling`;
    } else {
      result = `[SYSTEM PROMPT: ${selectedTool.toUpperCase()}]
Role: Domain Expert in ${selectedTool}
Goal: ${goal}
Parameters: Tone: ${tone}

Execute step-by-step with maximum technical depth.`;
    }

    setGeneratedPrompt(result);
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Wand2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Interactive Prompt Studio</h3>
              <p className="text-[11px] text-slate-400">Build, refine, and tune prompts for AI models</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* AI Tool Picker */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Select Target AI Model
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AI_TOOLS_LIST.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTool(t.name)}
                  className={`flex items-center justify-between rounded-lg border p-2.5 text-left text-xs font-medium transition-all ${
                    selectedTool === t.name
                      ? `${t.badgeColor} border-violet-500 font-bold shadow-sm`
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{t.name}</span>
                  {selectedTool === t.name && <Check className="h-3.5 w-3.5 text-violet-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              What do you want to create or accomplish?
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Refactor async queue in TypeScript, generate a photorealistic brutalist villa render, or write a cyber-synthwave track..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Parameters according to tool */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
            {selectedTool === 'Midjourney' || selectedTool === 'Stable Diffusion' ? (
              <>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Aspect Ratio (--ar)</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  >
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="4:3">4:3 (Standard)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="9:16">9:16 (Story/Mobile)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Model Version (--v)</label>
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  >
                    <option value="v6.1">v6.1 (Latest Photorealism)</option>
                    <option value="v6.0">v6.0</option>
                    <option value="v5.2">v5.2</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Desired Tone & Style</label>
                  <input
                    type="text"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  />
                </div>
                {selectedTool === 'Claude' && (
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Thinking Budget Tokens</label>
                    <select
                      value={thinkingTokens}
                      onChange={(e) => setThinkingTokens(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                    >
                      <option value="2048">2,048 Tokens</option>
                      <option value="4096">4,096 Tokens (Recommended)</option>
                      <option value="8192">8,192 Tokens</option>
                      <option value="16384">16,384 Tokens (Heavy Proofs)</option>
                    </select>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Generate Button */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!goal.trim() || isEnhancing}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50"
            >
              {isEnhancing ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Generating Prompt...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  <span>Generate Prompt Set</span>
                </>
              )}
            </button>
          </div>

          {/* Result Block */}
          {generatedPrompt && (
            <div className="mt-4 rounded-xl border border-violet-500/30 bg-slate-900 p-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-xs font-mono font-bold text-violet-300">Generated {selectedTool} Prompt:</span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1 text-xs font-bold text-white hover:bg-violet-500"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied! ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Output</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                <code>{generatedPrompt}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

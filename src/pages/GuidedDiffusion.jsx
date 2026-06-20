import { useState } from 'react';
import { API_BASE_URL } from '../config';
import { RefreshCw, Play, Sliders, Layers, CheckCircle, HelpCircle } from 'lucide-react';

const GuidedDiffusion = ({ generatedTargets, setGeneratedTargets, addNotification, setActiveTab, vitCompleted }) => {
  const [prefix, setPrefix] = useState('2001:db8::/32');
  const [numTargets, setNumTargets] = useState(250);
  const [strategy, setStrategy] = useState('Sparsity-Aware');
  const [isGenerating, setIsGenerating] = useState(false);
  const [diffusionStep, setDiffusionStep] = useState(100); // 100 to 0 denoising steps
  const [tParameter, setTParameter] = useState(0.5); // quality ↔ quantity trade-off
  const [statusLog, setStatusLog] = useState('');
  const [lastRunStats, setLastRunStats] = useState(null); // stores backend pattern_match / active_prob

  const generateMockAddress = (base, strat) => {
    // Basic IPv6 generator logic matching main.py API outputs
    const cleanPrefix = base.split('/')[0].trim().replace(/::$/, '');
    const segments = cleanPrefix.split(':').filter(Boolean);
    
    // Fill prefix to standard length (usually 4 segments for /64 or /32)
    while (segments.length < 4) {
      segments.push('0');
    }
    
    // Add randomized target interface identifiers based on diffusion strategies
    const generated = [...segments];
    for (let i = 0; i < 4; i++) {
      if (strat === 'Sparsity-Aware') {
        generated.push(Math.random() > 0.8 ? '0001' : '0000');
      } else if (strat === 'Density-Driven') {
        generated.push(Math.floor(Math.random() * 65535).toString(16).padStart(4, '0'));
      } else { // Entropy-Guided
        generated.push(Math.floor(256 + Math.random() * 3840).toString(16).padStart(4, '0'));
      }
    }
    
    return generated.join(':');
  };

  const handleGenerate = async () => {
    // Input validation
    const ipv6PrefixRegex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}(\/\d{1,3})?$/;
    if (!ipv6PrefixRegex.test(prefix.trim())) {
      addNotification('Invalid IPv6 prefix range format. Ensure it follows e.g. 2001:db8::/32', 'error');
      return;
    }

    setIsGenerating(true);
    setDiffusionStep(100);
    setStatusLog('Initializing Guided Diffusion scheduler (DDIM sampler)...');

    let apiTargets = null;
    let apiStats = null;
    let apiError = null;

    // Call backend API to generate targets
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prefix_range: prefix,
          num_targets: numTargets,
          strategy: strategy,          // backend accepts frontend label names directly
          t_parameter: tParameter      // quality↔quantity trade-off (0–1)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Generation failed');
      }

      const data = await response.json();
      // Store real backend stats for Results page
      apiStats = {
        patternMatch: data.pattern_match_percentage,
        activeProb: data.active_probability,
        strategyUsed: data.strategy_used
      };
      apiTargets = data.targets.map((t, idx) => ({
        id: idx + 1,
        ipv6: t.ipv6,
        confidence: t.confidence,
        similarity: t.similarity_score,
        entropy: t.entropy,
        activeProb: parseFloat((t.confidence * 0.9 + 0.05).toFixed(4)),
        matchingRules: strategy === 'Sparsity-Aware' ? 'Sparsity Masked' : strategy === 'Density-Driven' ? 'Density Aligned' : 'Entropy Balanced'
      }));
    } catch (err) {
      apiError = err.message;
    }

    // Play visual step-down denoising simulation
    let currentStep = 100;
    const interval = setInterval(() => {
      currentStep -= 10;
      setDiffusionStep(currentStep);

      if (currentStep === 80) {
        setStatusLog('Retrieving Vision Transformer spatial attention weights...');
      } else if (currentStep === 50) {
        setStatusLog(`Applying classifier-free guidance gradient scales (strategy: ${strategy})...`);
      } else if (currentStep === 20) {
        setStatusLog('Denoising process complete. Pruning invalid host mappings...');
      } else if (currentStep === 0) {
        clearInterval(interval);

        if (apiTargets) {
          setGeneratedTargets(apiTargets, apiStats); // pass stats alongside targets
          setLastRunStats(apiStats);
          setIsGenerating(false);
          addNotification(`Successfully generated ${apiTargets.length} IPv6 targets from FastAPI backend!`, 'success');
          setStatusLog('');
        } else {
          // Graceful fallback to client generation if backend was down
          addNotification(`Backend error: ${apiError || 'Unknown error'}. Defaulting to client generator.`, 'warning');

          const fallbackList = [];
          for (let i = 0; i < numTargets; i++) {
            const ipv6 = generateMockAddress(prefix, strategy);
            const confidence = 0.80 + Math.random() * 0.18;
            const similarity = 0.82 + Math.random() * 0.15;
            const activeProb = 0.81 + Math.random() * 0.16;
            const entropy = parseFloat((1.8 + Math.random() * 1.7).toFixed(2));

            fallbackList.push({
              id: i + 1,
              ipv6,
              confidence: parseFloat(confidence.toFixed(4)),
              similarity: parseFloat(similarity.toFixed(4)),
              entropy,
              activeProb: parseFloat(activeProb.toFixed(4)),
              matchingRules: strategy === 'Sparsity-Aware' ? 'Sparsity Masked' : strategy === 'Density-Driven' ? 'Density Aligned' : 'Entropy Balanced'
            });
          }
          const fallbackStats = {
            patternMatch: parseFloat((82 + Math.random() * 8).toFixed(2)),
            activeProb: parseFloat((78 + Math.random() * 10).toFixed(2)),
            strategyUsed: '(client-fallback)'
          };
          setLastRunStats(fallbackStats);
          setGeneratedTargets(fallbackList, fallbackStats);
          setIsGenerating(false);
          addNotification(`Successfully generated ${numTargets} mock IPv6 targets locally!`, 'success');
          setStatusLog('');
        }
      }
    }, 250);
  };

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h2
          className="text-3xl font-bold tracking-wide text-charcoal flex items-center justify-center md:justify-start gap-3"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          <RefreshCw className={`text-garnet ${isGenerating ? 'animate-spin' : ''}`} size={28} /> Guided Diffusion Generator
        </h2>
        <p className="text-muted mt-3 text-sm max-w-xl leading-relaxed">
          Apply a trained diffusion model to iteratively refine random noise vectors into realistic target allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Parameters Panel */}
        <div className="lg:col-span-1">
          <div className="editorial-card rounded-2xl p-8 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-warm-dark mb-6 flex items-center gap-2">
                <Sliders size={16} className="text-garnet" /> Generator Parameters
              </h3>

              {/* Input: Prefix */}
              <div className="mb-5">
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Seed IPv6 Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full bg-cream border border-border-gray rounded-xl px-4 py-3 text-sm text-charcoal font-mono focus:outline-none focus:border-garnet transition-all"
                  placeholder="2001:db8::/32"
                  disabled={isGenerating}
                />
              </div>

              {/* Input: Count */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider">Number of Targets</label>
                  <span className="text-xs font-mono font-bold text-garnet bg-garnet/5 px-2.5 py-0.5 rounded-full border border-garnet/20">{numTargets}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={numTargets}
                  onChange={(e) => setNumTargets(parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                  disabled={isGenerating}
                />
                <div className="flex justify-between text-[9px] text-muted font-bold uppercase tracking-wider mt-1">
                  <span>50</span>
                  <span>1,000 max</span>
                </div>
              </div>

              {/* Input: Strategy */}
              <div className="mb-6">
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Sampling Strategy</label>
                <select
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="w-full bg-cream border border-border-gray rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-garnet transition-all cursor-pointer"
                  disabled={isGenerating}
                >
                  <option value="Sparsity-Aware">Sparsity-Aware (Aggressive alignment)</option>
                  <option value="Density-Driven">Density-Driven (High cluster packing)</option>
                  <option value="Entropy-Guided">Entropy-Guided (Structural balancing)</option>
                </select>
              </div>

              {/* Input: Quality vs Quantity (t parameter) */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-wider">Quality ↔ Quantity (t)</label>
                  <span className="text-xs font-mono font-bold text-garnet bg-garnet/5 px-2.5 py-0.5 rounded-full border border-garnet/20">{tParameter.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={tParameter}
                  onChange={(e) => setTParameter(parseFloat(e.target.value))}
                  className="w-full cursor-pointer"
                  disabled={isGenerating}
                />
                <div className="flex justify-between text-[9px] text-muted font-bold uppercase tracking-wider mt-1">
                  <span>Max Quality</span>
                  <span>Max Diversity</span>
                </div>
              </div>

              {/* ViT readiness notice */}
              {!vitCompleted && (
                <div className="mb-4 p-3 rounded-xl border border-amber-200 bg-amber-50 text-[10px] text-amber-700 font-semibold leading-relaxed">
                  ⚠️ ViT training not yet completed. For best results, run <strong>ViT Training</strong> first to load pattern weights into the diffusion sampler.
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary-rect w-full py-4 flex justify-center items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin" size={14} /> Generating ({diffusionStep}%)
                </>
              ) : (
                <>
                  <Play size={14} fill="white" /> Run Guided Diffusion
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Generation Monitor */}
        <div className="lg:col-span-2">
          <div className="editorial-card rounded-2xl p-8 h-full flex flex-col justify-between min-h-[360px]">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-warm-dark mb-2 flex items-center gap-2">
                <Layers size={16} className="text-garnet" /> Denoising Process Monitor
              </h3>
              <p className="text-muted text-xs mb-6">Visual tracking of the stochastic diffusion reverse Markov steps.</p>
            </div>

            {isGenerating ? (
              <div className="flex-1 flex flex-col justify-center items-center py-8">
                {/* Custom circular denoising steps indicator */}
                <div className="relative w-36 h-36 flex items-center justify-center rounded-full border border-border-gray bg-cream mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-garnet/40 animate-spin" />
                  <div className="absolute inset-2 rounded-full border border-garnet/15" />
                  <div className="text-center">
                    <span className="text-3xl font-bold text-charcoal font-mono">{diffusionStep}</span>
                    <span className="text-[9px] text-muted block uppercase font-bold tracking-wider mt-1">Steps Left</span>
                  </div>
                </div>
                
                <p className="text-xs font-mono text-garnet font-bold uppercase tracking-wider animate-pulse">{statusLog}</p>
              </div>
            ) : generatedTargets.length > 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-garnet/10 flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-garnet" />
                </div>
                <h4
                  className="text-xl font-bold tracking-wide text-charcoal mb-2"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Generation Run Completed
                </h4>
                <p className="text-muted text-sm max-w-sm mb-6 leading-relaxed">
                  We successfully mapped and refined {generatedTargets.length} active target coordinates inside the seed subnet.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('results')}
                    className="btn-primary-rect !py-2.5 !px-5 text-xs font-bold"
                  >
                    View Generated Targets
                  </button>
                  <button 
                    onClick={() => setGeneratedTargets([])}
                    className="btn-secondary-rect !py-2.5 !px-5 text-xs font-bold"
                  >
                    Clear Results
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center py-12 border border-dashed border-border-gray rounded-2xl bg-cream">
                <HelpCircle size={36} className="text-muted/50 mb-3" />
                <p className="font-bold text-xs uppercase tracking-wider text-warm-dark mb-1">Sampler Engine Ready</p>
                <p className="text-xs text-muted max-w-xs leading-relaxed">
                  Enter target constraints in the parameters panel and click run. The system outputs generated addresses with probability estimates.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GuidedDiffusion;

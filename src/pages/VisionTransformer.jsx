import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cpu, Play, Pause, RotateCcw, Terminal } from 'lucide-react';

const VisionTransformer = ({ addNotification }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [speed, setSpeed] = useState(1); // multiplier
  const [trainingData, setTrainingData] = useState([]);
  const [terminalLogs, setTerminalLogs] = useState([
    'Initializing Vision Transformer (ViT) PyTorch engine...',
    'Loading structural patch dimension encoders (patch_size=8)...',
    'Self-attention multihead heads count: 12, Latent projection: 512.',
    'System ready. Set parameters and click "Start Training" to begin optimization.'
  ]);

  const maxEpochs = 30;
  const timerRef = useRef(null);
  const logEndRef = useRef(null);
  const backendMetricsRef = useRef(null);

  // Scroll to bottom of terminal
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const round = (num, decimals) => {
    return parseFloat(num.toFixed(decimals));
  };

  useEffect(() => {
    if (isPlaying && epoch < maxEpochs) {
      const intervalTime = 1500 / speed;
      timerRef.current = setInterval(() => {
        setEpoch((prevEpoch) => {
          const nextEpoch = prevEpoch + 1;
          
          let trainLoss, valLoss, trainAcc, valAcc;
          
          // Use backend data if available, otherwise fall back to local math simulation
          if (backendMetricsRef.current && backendMetricsRef.current[nextEpoch - 1]) {
            const metrics = backendMetricsRef.current[nextEpoch - 1];
            trainLoss = metrics.train_loss;
            valLoss = metrics.val_loss;
            trainAcc = metrics.train_accuracy;
            valAcc = metrics.val_accuracy;
          } else {
            trainLoss = Math.max(0.04, 0.95 * Math.pow(0.88, nextEpoch) + (Math.random() * 0.015 - 0.0075));
            valLoss = Math.max(0.08, 0.98 * Math.pow(0.89, nextEpoch) + (Math.random() * 0.02 - 0.01));
            trainAcc = Math.min(0.985, 0.35 + (0.64 * (1 - Math.pow(0.88, nextEpoch))) + (Math.random() * 0.01 - 0.005));
            valAcc = Math.min(0.942, 0.32 + (0.62 * (1 - Math.pow(0.89, nextEpoch))) + (Math.random() * 0.015 - 0.0075));
          }

          const newLog = `[ViT Engine] Epoch ${nextEpoch}/${maxEpochs} | loss: ${trainLoss.toFixed(4)} - val_loss: ${valLoss.toFixed(4)} - acc: ${trainAcc.toFixed(4)} - val_acc: ${valAcc.toFixed(4)}`;
          
          setTerminalLogs(prev => [...prev, newLog]);
          setTrainingData(prev => [...prev, {
            epoch: nextEpoch,
            trainLoss: round(trainLoss, 4),
            valLoss: round(valLoss, 4),
            trainAcc: round(trainAcc, 4),
            valAcc: round(valAcc, 4)
          }]);

          if (nextEpoch === maxEpochs) {
            setIsPlaying(false);
            setTerminalLogs(prev => [...prev, 'Training complete! Vision Transformer structural weights loaded into cache. Ready for guided diffusion generation.']);
            addNotification('Vision Transformer model training completed successfully!', 'success');
            clearInterval(timerRef.current);
          }

          return nextEpoch;
        });
      }, intervalTime);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, epoch, speed, addNotification]);

  const startTrainingLoop = async () => {
    setIsPlaying(true);
    setTerminalLogs(prev => [...prev, 'Starting ViT optimizers (AdamW, lr=3e-4, weight_decay=1e-2)...']);

    if (epoch === 0) {
      try {
        setTerminalLogs(prev => [...prev, 'Fetching training metrics from FastAPI backend...']);
        const res = await fetch(`${API_BASE_URL}/api/training/stream?epochs=${maxEpochs}`);
        if (!res.ok) {
          throw new Error('API server returned error status');
        }
        const data = await res.json();
        backendMetricsRef.current = data;
        setTerminalLogs(prev => [...prev, 'Backend training metrics loaded successfully. Playing simulation...']);
      } catch (err) {
        setTerminalLogs(prev => [
          ...prev,
          `[Warning] FastAPI server unreachable (${err.message}). Defaulting to client-side PyTorch ViT emulator...`
        ]);
        backendMetricsRef.current = null;
      }
    }
  };

  const handleStart = () => {
    if (epoch >= maxEpochs) {
      handleReset();
      setTimeout(() => startTrainingLoop(), 200);
    } else {
      startTrainingLoop();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    setTerminalLogs(prev => [...prev, 'Training execution suspended. Logs preserved.']);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setEpoch(0);
    setTrainingData([]);
    backendMetricsRef.current = null;
    setTerminalLogs([
      'Rescinding model weights cache...',
      'Vision Transformer modules re-initialized successfully.',
      'System ready. Set parameters and click "Start Training" to begin optimization.'
    ]);
  };

  // Get current metrics
  const currentMetrics = trainingData[trainingData.length - 1] || {
    trainLoss: 0.95,
    valLoss: 0.98,
    trainAcc: 0.35,
    valAcc: 0.32
  };

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-wide text-charcoal flex items-center justify-center md:justify-start gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
            <Cpu className="text-garnet" size={26} /> Vision Transformer Module (ViT)
          </h2>
          <p className="text-muted mt-2 text-sm max-w-xl">
            Simulate training accuracy and optimization paths. The ViT models the spatial relationships between bytes to learn prefix distributions.
          </p>
        </div>

        {/* Model Status Card */}
        <div className="editorial-card rounded-2xl px-5 py-3 flex items-center gap-3 w-fit mx-auto md:mx-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal">
            Engine Status: {isPlaying ? 'OPTIMIZING' : epoch >= maxEpochs ? 'COMPLETED' : 'IDLE'}
          </span>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        
        <div className="editorial-card rounded-2xl p-5">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Epoch Process</span>
          <span className="text-2xl font-bold text-charcoal mt-1 block">{epoch} / {maxEpochs}</span>
          <div className="w-full bg-cream h-1.5 mt-3 overflow-hidden rounded-full">
            <div 
              className="bg-garnet h-full transition-all duration-300 rounded-full"
              style={{ width: `${(epoch / maxEpochs) * 100}%` }}
            />
          </div>
        </div>

        <div className="editorial-card rounded-2xl p-5">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Training Loss</span>
          <span className="text-2xl font-bold text-garnet mt-1 block">
            {epoch > 0 ? currentMetrics.trainLoss.toFixed(4) : 'N/A'}
          </span>
          <span className="text-[9px] text-muted mt-2 block font-bold uppercase tracking-wider">Target: &lt; 0.05</span>
        </div>

        <div className="editorial-card rounded-2xl p-5">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Validation Accuracy</span>
          <span className="text-2xl font-bold text-charcoal mt-1 block">
            {epoch > 0 ? `${(currentMetrics.valAcc * 100).toFixed(1)}%` : 'N/A'}
          </span>
          <span className="text-[9px] text-muted mt-2 block font-bold uppercase tracking-wider">Learned distributions</span>
        </div>

        <div className="editorial-card rounded-2xl p-5">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Model Latency</span>
          <span className="text-2xl font-bold text-charcoal mt-1 block">
            {epoch > 0 ? `${(12 + (epoch % 5) * 0.3).toFixed(1)} ms` : 'N/A'}
          </span>
          <span className="text-[9px] text-muted mt-2 block font-bold uppercase tracking-wider">Batch size: 128</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Controls and Graphs */}
        <div className="lg:col-span-2 editorial-card rounded-2xl p-6 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
                <div className="p-2 bg-[#B23B48]/8 rounded-xl text-garnet">
                  <Play size={14} />
                </div>
                Loss & Accuracy Curves
              </h3>
              
              {/* Simulation buttons */}
              <div className="flex gap-2">
                {isPlaying ? (
                  <button 
                    onClick={handlePause}
                    className="p-2 border border-border-gray rounded-xl bg-white text-charcoal hover:bg-cream transition-colors cursor-pointer"
                    title="Pause"
                  >
                    <Pause size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={handleStart}
                    className="p-2 bg-charcoal rounded-xl text-white hover:bg-garnet transition-colors cursor-pointer shadow-lg"
                    title="Start"
                  >
                    <Play size={14} fill="white" />
                  </button>
                )}
                
                <button 
                  onClick={handleReset}
                  className="p-2 border border-border-gray rounded-xl bg-white text-charcoal hover:bg-cream transition-colors cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw size={14} />
                </button>
                
                {/* Speed Controls */}
                <div className="flex border border-border-gray rounded-xl overflow-hidden ml-2 text-[10px] font-bold text-charcoal">
                  <button 
                    onClick={() => setSpeed(1)} 
                    className={`px-3 py-1.5 transition-colors ${speed === 1 ? 'bg-charcoal text-white' : 'bg-white hover:bg-cream'}`}
                  >
                    1x
                  </button>
                  <button 
                    onClick={() => setSpeed(3)} 
                    className={`px-3 py-1.5 transition-colors ${speed === 3 ? 'bg-charcoal text-white border-l border-r border-border-gray' : 'bg-white hover:bg-cream border-l border-r border-border-gray'}`}
                  >
                    3x
                  </button>
                  <button 
                    onClick={() => setSpeed(5)} 
                    className={`px-3 py-1.5 transition-colors ${speed === 5 ? 'bg-charcoal text-white' : 'bg-white hover:bg-cream'}`}
                  >
                    5x
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="epoch" stroke="#9A9189" fontSize={10} tickLine={false} axisLine={{ stroke: '#E5DFD3' }} />
                <YAxis stroke="#9A9189" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5DFD3', borderRadius: '12px', padding: '12px' }} labelClassName="text-charcoal font-mono text-xs font-bold" />
                <Legend wrapperStyle={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em', color: '#9A9189' }} />
                <Line type="monotone" dataKey="trainLoss" name="Training Loss" stroke="#B23B48" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="trainAcc" name="Train Acc" stroke="#1C1B19" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="valAcc" name="Val Acc" stroke="#9A9189" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Terminal Logs */}
        <div className="lg:col-span-1 rounded-2xl border border-border-gray overflow-hidden flex flex-col justify-between min-h-[420px]">
          <div className="px-5 py-4 border-b border-[#2D2E31] bg-[#1C1B19] flex justify-between items-center text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
              <Terminal size={14} className="text-garnet" /> PyTorch Console
            </span>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#524945]" />
            </div>
          </div>
          
          <div className="flex-grow p-5 font-mono text-[10px] leading-relaxed text-[#D2CDC4] bg-[#1C1B19] overflow-y-auto max-h-[300px] h-[300px]">
            {terminalLogs.map((log, index) => (
              <div 
                key={index} 
                className={`mb-2.5 border-l-2 pl-2.5 py-0.5 ${
                  log.includes('complete') 
                    ? 'border-emerald-500 text-emerald-400' 
                    : log.includes('error') 
                    ? 'border-red-500 text-red-400' 
                    : log.includes('Suspended') 
                    ? 'border-amber-500 text-amber-400'
                    : 'border-[#524945] text-[#D2CDC4]'
                }`}
              >
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>

          <div className="px-5 py-3 border-t border-[#2D2E31] bg-[#1C1B19] flex justify-between items-center text-[9px] text-[#9A9189] font-mono uppercase tracking-wider font-bold">
            <span>ViT-IPv6-Generator v1.2</span>
            <span>Batch size: 128</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VisionTransformer;

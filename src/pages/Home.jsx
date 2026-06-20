import { useEffect, useRef } from 'react';
import { Shield, Cpu, Activity, AlertTriangle, CheckCircle, Network } from 'lucide-react';

const Home = ({ setActiveTab }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Node configuration
    const nodes = [];
    const nodeCount = Math.min(Math.floor(width / 25), 45);
    const connectionDistance = 120;

    const ipv6Samples = [
      '2001:db8::1', 'fe80::8c3f:2', '2001:0db8:85a3::8a2e:0370',
      '3ffe:1900:4545:3::f', '2001:4860:4860::8888', '2404:6800:4003:c02::64',
      '2001:db8:a::123', 'fe80::1', '2001:db8:85a3::1', '2001:db8:3c4d::2'
    ];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1.2,
        label: Math.random() > 0.85 ? ipv6Samples[Math.floor(Math.random() * ipv6Samples.length)] : null
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.08;
            ctx.strokeStyle = `rgba(82, 73, 69, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.label ? '#B23B48' : 'rgba(28, 27, 25, 0.12)';
        ctx.fill();

        if (node.label) {
          // Draw pulsing outer circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4 * Math.sin(Date.now() / 400), 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(178, 59, 72, 0.15)';
          ctx.stroke();

          // Text label
          ctx.font = '8px monospace';
          ctx.fillStyle = 'rgba(82, 73, 69, 0.45)';
          ctx.fillText(node.label, node.x + 8, node.y + 3);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-cream">
      {/* Background canvas */}
      <div className="absolute inset-0 z-0 h-[400px] w-full overflow-hidden border-b border-border-gray">
        <canvas ref={canvasRef} className="h-full w-full opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center pt-8 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-garnet/20 bg-[#B23B48]/8 text-garnet text-xs font-bold uppercase tracking-wider mb-6">
            <Shield size={12} /> AI-Powered Cybersecurity Research
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-charcoal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Pattern-Based <span className="text-garnet">IPv6 Prefix Target</span> Generation
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-warm-dark/70 mb-8 leading-relaxed">
            Enhancing IPv6 scanning efficiency through advanced deep learning. We model high-dimensional structural patterns of real-world prefixes using Vision Transformers and generate active targets via Guided Diffusion.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('diffusion')}
              className="btn-primary-rect"
            >
              Generate IPv6 Targets
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('details');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-secondary-rect"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* About Sections Container */}
        <div id="details" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          
          {/* Card: About Project */}
          <div className="editorial-card rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-[#B23B48]/8 rounded-xl text-garnet w-fit mb-6">
                <Network size={20} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-charcoal">About the Project (6PTG)</h3>
              <p className="text-warm-dark/70 leading-relaxed text-sm">
                This project implements the <strong>6PTG</strong> prefix target generation algorithm. Unlike traditional whole-network-level methods that cause invalid probing outside target prefixes, 6PTG separates pattern inference from active distribution learning. It uses bitwise suffix augmentation to construct a 2D spatial representation of 64-bit suffixes, extracts addressing patterns unsupervised via a Vision Transformer Autoencoder (ViT-AE), and employs a Guided-Diffusion Prior model to generate highly localized target lists under the designated organization's prefix.
              </p>
            </div>
            <div className="mt-6 border-t border-border-gray pt-4 flex gap-4 text-xs font-bold uppercase text-muted">
              <span>Primary Stack: React + FastAPI</span>
              <span>•</span>
              <span>Frameworks: PyTorch + TensorFlow</span>
            </div>
          </div>

          {/* Card: Problem Statement */}
          <div className="editorial-card rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-[#B23B48]/8 rounded-xl text-garnet w-fit mb-6">
                <Cpu size={20} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-charcoal">Problem Statement</h3>
              <p className="text-warm-dark/70 leading-relaxed text-sm">
                As network operators and security systems transition to IPv6, detecting active hosts is crucial for diagnostic modeling, service listing, vulnerability testing, and threat maps. However, allocations of IPv6 subnets are heavily clustered but sparsely scattered. Scanning random addresses is highly inefficient, yielding sub-percent discovery ratios. We require intelligent algorithms capable of matching subnet structures and learning multi-level pattern structures.
              </p>
            </div>
            <div className="mt-6 border-t border-border-gray pt-4 flex gap-4 text-xs font-bold uppercase text-muted">
              <span>Space Bounds: $3.4 \times 10^{38}$ Addresses</span>
            </div>
          </div>

          {/* Card: Existing System Limitations */}
          <div className="editorial-card rounded-2xl p-8">
            <div className="p-3 bg-[#B23B48]/8 rounded-xl text-garnet w-fit mb-6">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-charcoal">Limitations of Existing Systems</h3>
            <ul className="space-y-3.5 text-sm text-warm-dark/70">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-garnet mt-2 shrink-0" />
                <span><strong>Pure Random Scanning:</strong> Incredibly slow, yielding close to zero target hits.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-garnet mt-2 shrink-0" />
                <span><strong>Heuristic Targets:</strong> Rely on manual assumptions (e.g. low-byte addresses like `::1`, `::5`) missing randomized interface identifiers (IIDs).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-garnet mt-2 shrink-0" />
                <span><strong>Markov-Model Limits:</strong> Traditional statistical tools evaluate subnets sequentially, missing long-range structure dependencies.</span>
              </li>
            </ul>
          </div>

          {/* Card: Proposed System */}
          <div className="editorial-card rounded-2xl p-8">
            <div className="p-3 bg-[#B23B48]/8 rounded-xl text-garnet w-fit mb-6">
              <Activity size={20} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-charcoal">Proposed 6PTG System</h3>
            <ul className="space-y-3.5 text-sm text-warm-dark/70">
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-garnet mt-2 shrink-0" />
                <span><strong>Expansion Scanning (EX-Scan):</strong> Enriches the seed set by utilizing fine-grained or coarse-grained bitwise wildcard expansions to uncover hidden active address pools.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-garnet mt-2 shrink-0" />
                <span><strong>ViT-AE Pattern Inference:</strong> Infers complex addressing configurations (like EUI-64, Low-Byte, and Embedded IPv4) by reconstructing bitwise augmented suffix images.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-garnet mt-2 shrink-0" />
                <span><strong>Guided Diffusion Prior:</strong> Captures the mapping between organization prefixes and active suffix distributions, optimized via the quality-quantity trade-off parameter $t$.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mt-16 text-center">
          <h2
            className="text-2xl font-bold uppercase tracking-wider mb-12 text-charcoal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Project Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="editorial-card rounded-2xl p-6 text-left">
              <CheckCircle className="text-garnet mb-4" size={24} />
              <h4 className="font-bold uppercase tracking-wider text-charcoal mb-2">52% Average Hit Rate</h4>
              <p className="text-warm-dark/70 text-xs leading-relaxed">
                Achieves an average hit rate of 52% under natural network prefixes of varying active scales.
              </p>
            </div>

            <div className="editorial-card rounded-2xl p-6 text-left">
              <CheckCircle className="text-garnet mb-4" size={24} />
              <h4 className="font-bold uppercase tracking-wider text-charcoal mb-2">24% Generation Rate</h4>
              <p className="text-warm-dark/70 text-xs leading-relaxed">
                Maintains a 24% target generation rate to discover fresh active endpoints not present in the seed sets.
              </p>
            </div>

            <div className="editorial-card rounded-2xl p-6 text-left">
              <CheckCircle className="text-garnet mb-4" size={24} />
              <h4 className="font-bold uppercase tracking-wider text-charcoal mb-2">Up to 7.6x Improvement</h4>
              <p className="text-warm-dark/70 text-xs leading-relaxed">
                Outperforms transition-adapted whole-network algorithms (6Tree, 6Forest) with 2.1x hit rate and 7.6x generation rate gains.
              </p>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;

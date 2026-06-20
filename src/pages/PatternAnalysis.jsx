import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { AreaChart, Area } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-gray)', padding: '10px 14px', fontSize: '11px', fontFamily: 'monospace', borderRadius: '12px' }}>
        <p style={{ fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '4px' }}>{payload[0].name || payload[0].payload.prefix}</p>
        <p style={{ color: 'var(--color-garnet)' }}>Hits: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const PatternAnalysis = () => {
  const prefixFrequencyData = [
    { prefix: '2001:db8::', count: 1450, color: '#1C1B19' },
    { prefix: '2001:4860::', count: 1200, color: '#524945' },
    { prefix: '2404:6800::', count: 980, color: '#9A9189' },
    { prefix: '2607:f8b0::', count: 720, color: '#B23B48' },
    { prefix: '2001:da8::', count: 480, color: '#D2CDC4' },
    { prefix: 'fe80::/10', count: 320, color: '#E5DFD3' },
  ];

  const latentClusters = [
    { x: 1.2, y: 3.5, value: 120, fill: '#1C1B19' },
    { x: 1.5, y: 3.8, value: 90, fill: '#1C1B19' },
    { x: -2.3, y: -1.2, value: 75, fill: '#B23B48' },
    { x: -2.1, y: -1.5, value: 110, fill: '#B23B48' },
    { x: 3.1, y: -2.2, value: 140, fill: '#524945' },
    { x: 2.8, y: -2.0, value: 160, fill: '#524945' },
    { x: -0.5, y: 0.8, value: 200, fill: '#9A9189' },
    { x: -0.7, y: 1.1, value: 180, fill: '#9A9189' },
  ];

  const entropyTrend = [
    { block: '0–1', entropy: 4.8 },
    { block: '2–3', entropy: 4.5 },
    { block: '4–5', entropy: 3.2 },
    { block: '6–7', entropy: 2.1 },
    { block: '8–9', entropy: 0.9 },
    { block: '10–11', entropy: 0.4 },
    { block: '12–13', entropy: 1.5 },
    { block: '14–15', entropy: 2.8 },
  ];

  const chartAxisStyle = { stroke: '#9A9189', fontSize: 10, fontFamily: 'ui-monospace, monospace' };

  return (
    <div className="page-container">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <p className="page-label">ANALYTICS</p>
          <h1 className="page-title" style={{ fontFamily: "'Instrument Serif', serif" }}>Pattern Analysis</h1>
          <p className="page-subtitle">
            Distribution, entropy curves, and cluster groupings of target subnets in high-dimensional vector embeddings.
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>

        {/* Chart 1: Prefix Frequency */}
        <div className="editorial-card rounded-2xl" style={{ padding: '1.75rem' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Prefix Frequency</p>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.4rem' }}>Distribution Count</p>
          <p style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>Prefix hierarchies present in dataset.</p>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prefixFrequencyData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="prefix" {...chartAxisStyle} tickLine={false} axisLine={{ stroke: 'var(--color-border-gray)' }} />
                <YAxis {...chartAxisStyle} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-cream-dark)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {prefixFrequencyData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Latent Space Cluster */}
        <div className="editorial-card rounded-2xl" style={{ padding: '1.75rem' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Cluster Map</p>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.4rem' }}>Latent Space Embeddings</p>
          <p style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>ViT self-attention coordinates by semantic category.</p>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -25 }}>
                <XAxis type="number" dataKey="x" name="Dim 1" {...chartAxisStyle} tickLine={false} axisLine={{ stroke: 'var(--color-border-gray)' }} />
                <YAxis type="number" dataKey="y" name="Dim 2" {...chartAxisStyle} tickLine={false} axisLine={false} />
                <ZAxis type="number" dataKey="value" range={[40, 200]} />
                <Tooltip cursor={{ strokeDasharray: '3 3', stroke: 'var(--color-border-gray)' }} content={<CustomTooltip />} />
                <Scatter data={latentClusters}>
                  {latentClusters.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Shannon Entropy */}
        <div className="editorial-card rounded-2xl" style={{ padding: '1.75rem' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Entropy Analysis</p>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.4rem' }}>Shannon Entropy by Segment</p>
          <p style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>Information density across IPv6 byte positions.</p>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={entropyTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="block" {...chartAxisStyle} tickLine={false} axisLine={{ stroke: 'var(--color-border-gray)' }} />
                <YAxis {...chartAxisStyle} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ border: '1px solid var(--color-border-gray)', borderRadius: '12px', fontSize: 11, fontFamily: 'monospace' }} />
                <defs>
                  <linearGradient id="entropyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B23B48" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#B23B48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="entropy" stroke="#B23B48" fill="url(#entropyGrad)" strokeWidth={2} dot={{ fill: '#B23B48', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Allocation Density Heatmap */}
        <div className="editorial-card rounded-2xl" style={{ padding: '1.75rem' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>Allocation Density</p>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '0.4rem' }}>Heatmap — /36 Blocks</p>
          <p style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>Matrix mapping network address block allocation ratios.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px', borderRadius: '12px', overflow: 'hidden' }}>
            {Array.from({ length: 32 }).map((_, idx) => {
              const density = Math.sin((idx / 31) * Math.PI) * ((idx % 5 + 2) / 6);
              const opacity = Math.max(0.08, density);
              const isHigh = density > 0.7;
              return (
                <div
                  key={idx}
                  title={`Block ${idx + 1}: ${(density * 100).toFixed(1)}%`}
                  style={{
                    aspectRatio: '1',
                    background: isHigh ? 'var(--color-garnet)' : `rgba(82, 73, 69, ${opacity})`,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                    borderRadius: '4px'
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '10px', color: 'var(--color-muted)', fontFamily: 'monospace' }}>
            <span>2001::0 — 2001::ff</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', background: 'var(--color-cream-dark)', borderRadius: '2px', display: 'inline-block' }} />
                Low
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', background: 'var(--color-garnet)', borderRadius: '2px', display: 'inline-block' }} />
                Dense
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatternAnalysis;

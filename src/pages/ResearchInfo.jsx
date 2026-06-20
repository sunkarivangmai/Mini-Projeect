import { BookOpen, Target, Settings, Users, Building } from 'lucide-react';

const ResearchInfo = () => {
  const teamMembers = [
    { name: 'S. Vangmai', roll: '1608-23-733-166' },
    { name: 'N. Harshitha', roll: '1608-23-733-194' },
    { name: 'N. Shivani', roll: '1608-23-733-172' },
  ];

  const objectives = [
    {
      title: 'Addressing Pattern Inference',
      body: 'Develop a ViT-AE-based prefix addressing pattern mining system using bitwise suffix augmentation (Shifted, Neg-Shifted, XOR matrices) to capture local and global relationships.'
    },
    {
      title: 'Active Distribution Mapping',
      body: 'Implement a conditional Guided-Diffusion model to map prefixes to active distributions, avoiding separate models per subnet.'
    },
    {
      title: 'EX-Scan Seed Expansion',
      body: 'Mitigate dataset bias by executing coarse-grained and fine-grained expansion scanning to discover hidden active address pools.'
    },
    {
      title: 'Diversified Address Discovery',
      body: 'Employ a Quality-Quantity trade-off slider parameter t to scale sampling bounds and generate realistic candidates.'
    },
  ];

  return (
    <div className="page-container">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <p className="page-label">DOCUMENTATION</p>
          <h1 className="page-title" style={{ fontFamily: "'Instrument Serif', serif" }}>Research Information</h1>
          <p className="page-subtitle">
            Academic project specification, objectives, requirement benchmarks, and team structure details.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Abstract */}
          <div className="editorial-card rounded-2xl" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border-gray)' }}>
              <div className="p-2 bg-[#B23B48]/8 rounded-xl text-garnet">
                <BookOpen size={16} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-charcoal)' }}>Research Abstract — 6PTG</span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.8', color: 'var(--color-charcoal)', marginBottom: '1rem', opacity: 0.85 }}>
              IPv6 network scanning is an essential active technology for network management. Existing target generation algorithms enable the usability of IPv6 scanning across the whole network. Under prefix target generation, however, they are affected by non-target prefix data, resulting in severe performance degradation.
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.8', color: 'var(--color-charcoal)', opacity: 0.85 }}>
              We propose the <strong>6PTG</strong> algorithm to address these challenges. 6PTG mines the knowledge of addressing patterns in massive unlabeled addresses based on an unsupervised Vision Transformer Autoencoder (ViT-AE) and introduces it into the generation stage. Guided by the prefix conditions, 6PTG captures the mapping between prefixes and active address distributions in a unified Guided-Diffusion Prior model, avoiding the need to train a model separately for each prefix. In natural network environments, 6PTG achieves an average hit rate of <strong>52%</strong> and a generation rate of <strong>24%</strong> under prefixes of varying active scales.
            </p>
          </div>

          {/* Objectives */}
          <div className="editorial-card rounded-2xl" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border-gray)' }}>
              <div className="p-2 bg-[#B23B48]/8 rounded-xl text-garnet">
                <Target size={16} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-charcoal)' }}>Key Research Objectives</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {objectives.map((obj, i) => (
                <div key={i} style={{ padding: '1.25rem 0', borderBottom: i < objectives.length - 1 ? '1px solid var(--color-border-gray)' : 'none', display: 'flex', gap: '1.25rem' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-garnet)', minWidth: '20px', fontFamily: 'monospace', paddingTop: '2px' }}>0{i + 1}</span>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '0.35rem' }}>{obj.title}</p>
                    <p style={{ fontSize: '12px', lineHeight: '1.7', color: 'var(--color-muted)' }}>{obj.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* System Requirements */}
          <div className="editorial-card rounded-2xl" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border-gray)' }}>
              <Settings size={15} color="var(--color-garnet)" />
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-charcoal)' }}>System Requirements</span>
            </div>

            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>Software</p>
            <ul style={{ listStyle: 'none', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border-gray)' }}>
              {['Python 3.10+', 'PyTorch / TensorFlow', 'NumPy, Pandas, Scikit-learn', 'Windows / Linux OS'].map((item, i) => (
                <li key={i} style={{ fontSize: '12px', color: 'var(--color-charcoal)', fontFamily: 'monospace', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '4px', height: '4px', background: 'var(--color-garnet)', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>

            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>Hardware</p>
            <ul style={{ listStyle: 'none' }}>
              {['Intel Core i5 or above', 'Minimum 8 GB RAM', '256 GB SSD or above', 'CUDA-enabled GPU (recommended)'].map((item, i) => (
                <li key={i} style={{ fontSize: '12px', color: 'var(--color-charcoal)', fontFamily: 'monospace', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '4px', height: '4px', background: 'var(--color-charcoal)', borderRadius: '50%', display: 'inline-block', flexShrink: 0, opacity: 0.4 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Team Members */}
          <div className="editorial-card rounded-2xl" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border-gray)' }}>
              <Users size={15} color="var(--color-garnet)" />
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-charcoal)' }}>Batch C8 Members</span>
            </div>

            {teamMembers.map((member, i) => (
              <div key={i} style={{ padding: '0.85rem 0', borderBottom: i < teamMembers.length - 1 ? '1px solid var(--color-border-gray)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '2px' }}>{member.name}</p>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--color-muted)' }}>{member.roll}</p>
                </div>
                <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid var(--color-border-gray)', padding: '2px 8px', borderRadius: '9999px', color: 'var(--color-muted)' }}>Student</span>
              </div>
            ))}

            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-gray)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Building size={15} color="var(--color-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '2px' }}>Matrusri Engineering College</p>
                <p style={{ fontSize: '11px', color: 'var(--color-muted)', lineHeight: '1.5' }}>Department of Computer Science & Engineering</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResearchInfo;

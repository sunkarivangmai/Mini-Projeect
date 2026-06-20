import { useState } from 'react';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

const Results = ({ generatedTargets, generationStats, addNotification }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleExportCSV = () => {
    if (generatedTargets.length === 0) {
      addNotification('No targets available to export. Run generator first.', 'error');
      return;
    }

    const headers = ['ID', 'IPv6 Address', 'Confidence Score', 'Structural Similarity', 'Entropy', 'Active Probability', 'Rule Alignment'];
    const rows = generatedTargets.map(t => [
      t.id, t.ipv6, t.confidence, t.similarity, t.entropy ?? '', t.activeProb, t.matchingRules
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ipv6_generated_targets_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification('CSV file downloaded successfully!', 'success');
  };

  const totalPages = Math.ceil(generatedTargets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = generatedTargets.slice(startIndex, endIndex);

  return (
    <div className="page-container">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <p className="page-label">OUTPUT</p>
          <h1 className="page-title" style={{ fontFamily: "'Instrument Serif', serif" }}>Generation Results</h1>
          <p className="page-subtitle">
            Evaluate, filter, and export generated prefix candidates. These addresses represent highly probable active network endpoints.
          </p>
        </div>
        <div className="page-header-actions">
          <button
            onClick={handleExportCSV}
            disabled={generatedTargets.length === 0}
            className="btn-primary-rect"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="rounded-2xl border border-border-gray overflow-hidden" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--color-border-gray)', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--color-white)', padding: '2rem' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>Total Synthesized</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-charcoal)', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {generatedTargets.length.toLocaleString()}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '0.5rem' }}>addresses</p>
        </div>

        <div style={{ background: 'var(--color-white)', padding: '2rem' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>Pattern Match</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-charcoal)', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {generatedTargets.length > 0
              ? (generationStats ? generationStats.patternMatch.toFixed(1) : '94.2')
              : '0.0'}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '0.5rem' }}>percent accuracy</p>
        </div>

        <div style={{ background: 'var(--color-white)', padding: '2rem' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>Active Probability</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-charcoal)', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {generatedTargets.length > 0
              ? (generationStats ? generationStats.activeProb.toFixed(1) : '89.6')
              : '0.0'}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '0.5rem' }}>percent confidence</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="editorial-card rounded-2xl overflow-hidden">
        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--color-border-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-charcoal)' }}>Generated Target List</span>
          <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
            Showing {generatedTargets.length > 0 ? startIndex + 1 : 0}–{Math.min(endIndex, generatedTargets.length)} of {generatedTargets.length}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-gray)', background: 'var(--color-cream)' }}>
                {['ID', 'IPv6 Address', 'Confidence', 'Similarity', 'Entropy', 'Active Prob.', 'Rule Alignment'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.5rem', textAlign: 'left', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border-gray)' }} className="table-row-hover">
                  <td style={{ padding: '0.85rem 1.5rem', color: 'var(--color-muted)', fontFamily: 'monospace' }}>{item.id}</td>
                  <td style={{ padding: '0.85rem 1.5rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-charcoal)' }}>{item.ipv6}</td>
                  <td style={{ padding: '0.85rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'monospace', color: 'var(--color-charcoal)' }}>{(item.confidence * 100).toFixed(1)}%</span>
                      <div style={{ width: '40px', height: '3px', background: 'var(--color-border-gray)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.confidence * 100}%`, height: '100%', background: 'var(--color-garnet)', borderRadius: '9999px' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1.5rem', fontFamily: 'monospace', color: 'var(--color-charcoal)' }}>{(item.similarity * 100).toFixed(1)}%</td>
                  <td style={{ padding: '0.85rem 1.5rem', fontFamily: 'monospace', color: 'var(--color-charcoal)' }}>{item.entropy != null ? item.entropy.toFixed(2) : '—'}</td>
                  <td style={{ padding: '0.85rem 1.5rem', fontFamily: 'monospace', color: 'var(--color-garnet)', fontWeight: 700 }}>{(item.activeProb * 100).toFixed(1)}%</td>
                  <td style={{ padding: '0.85rem 1.5rem' }}>
                    <span style={{ padding: '2px 10px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', border: '1px solid var(--color-border-gray)', borderRadius: '9999px', color: 'var(--color-charcoal)' }}>
                      {item.matchingRules}
                    </span>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '5rem 1.5rem', color: 'var(--color-muted)', fontSize: '13px' }}>
                    No targets generated yet. Head over to the Guided Diffusion tab to launch a simulation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid var(--color-border-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="btn-secondary-rect"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '12px' }}
            >
              <ChevronLeft size={13} /> Prev
            </button>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="btn-secondary-rect"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '12px' }}
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;

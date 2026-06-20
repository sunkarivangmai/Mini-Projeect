import { useState } from 'react';
import { Send, Mail, User, MessageSquare, CheckCircle, MapPin, Clock } from 'lucide-react';

const Contact = ({ addNotification }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addNotification('Please fill in all form fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      addNotification('Message sent successfully! Our research team will contact you.', 'success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 6000);
    }, 1500);
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--color-cream)',
    border: '1px solid var(--color-border-gray)',
    borderRadius: '12px',
    padding: '12px 14px',
    fontSize: '13px',
    color: 'var(--color-charcoal)',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  return (
    <div className="page-container">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <p className="page-label">CONTACT</p>
          <h1 className="page-title" style={{ fontFamily: "'Instrument Serif', serif" }}>Research Team</h1>
          <p className="page-subtitle">
            Have questions or suggestions about our Vision Transformer + Guided Diffusion implementation? Send us a message.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Left: Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--color-border-gray)', border: '1px solid var(--color-border-gray)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ background: 'var(--color-white)', padding: '1.75rem' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-garnet)', marginBottom: '0.75rem' }}>Laboratory Node</p>
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>Department of CSE</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', alignItems: 'flex-start' }}>
              <MapPin size={13} color="var(--color-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: '1.7' }}>
                Matrusri Engineering College<br />
                Saidabad, Hyderabad — 500059<br />
                India
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--color-white)', padding: '1.75rem' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>Server Status</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} className="pulse-dot" />
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-charcoal)' }}>mec-cse-node1</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={12} color="var(--color-muted)" />
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--color-muted)' }}>Uptime: 99.98%</span>
            </div>
          </div>

          <div style={{ background: 'var(--color-charcoal)', padding: '1.75rem' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>Project</p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: '0.4rem' }}>6PTG Algorithm</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6' }}>IPv6 Prefix Target Generation via ViT + Guided Diffusion</p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="editorial-card rounded-2xl" style={{ padding: '2rem' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(178, 59, 72, 0.08)', borderRadius: '16px', marginBottom: '1.5rem' }}>
                <CheckCircle size={32} color="var(--color-garnet)" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>Message Transmitted</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-muted)', maxWidth: '280px', margin: '0 auto', lineHeight: '1.7' }}>
                Your inquiry was sent to the mini project batch C8 coordination queue.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: '0.6rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '36px' }}
                    placeholder="John Doe"
                    onFocus={e => e.target.style.borderColor = 'var(--color-charcoal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border-gray)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: '0.6rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '36px' }}
                    placeholder="johndoe@example.com"
                    onFocus={e => e.target.style.borderColor = 'var(--color-charcoal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border-gray)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-charcoal)', marginBottom: '0.6rem' }}>
                  Message
                </label>
                <div style={{ position: 'relative' }}>
                  <MessageSquare size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-muted)' }} />
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '36px', resize: 'none' }}
                    placeholder="Your feedback or question..."
                    onFocus={e => e.target.style.borderColor = 'var(--color-charcoal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border-gray)'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary-rect"
                style={{ width: '100%', padding: '14px' }}
              >
                {isSubmitting ? (
                  <>
                    <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    Sending...
                  </>
                ) : (
                  <><Send size={14} /> Send Message</>
                )}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;

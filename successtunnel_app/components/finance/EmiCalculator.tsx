import { useState } from 'react'

export default function EmiCalculator() {
  const [amount, setAmount] = useState(1000000)
  const [rate, setRate] = useState(10.5)
  const [years, setYears] = useState(5)

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  // r = rate per month = rate / 12 / 100
  // n = years * 12
  const r = rate / 12 / 100
  const n = years * 12
  const emi = amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  const totalPayment = emi * n
  const totalInterest = totalPayment - amount

  return (
    <div className="panel-card" style={{ padding: '24px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: '0 0 20px', fontSize: '1.25rem' }}>Loan EMI Estimator</h3>
      
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Loan Amount (₹)</span>
            <strong style={{ color: 'var(--primary)' }}>₹{amount.toLocaleString('en-IN')}</strong>
          </div>
          <input 
            type="range" 
            min="100000" 
            max="20000000" 
            step="100000" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }} 
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Interest Rate (% p.a.)</span>
            <strong style={{ color: 'var(--primary)' }}>{rate}%</strong>
          </div>
          <input 
            type="range" 
            min="5" 
            max="20" 
            step="0.5" 
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }} 
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Loan Tenure (Years)</span>
            <strong style={{ color: 'var(--primary)' }}>{years} Yr</strong>
          </div>
          <input 
            type="range" 
            min="1" 
            max="30" 
            step="1" 
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }} 
          />
        </div>
      </div>

      <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Monthly EMI</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>₹{Math.round(emi).toLocaleString('en-IN')}</div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Principal</span>
            <strong style={{ fontSize: '0.9rem' }}>₹{amount.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Total Interest</span>
            <strong style={{ fontSize: '0.9rem' }}>₹{Math.round(totalInterest).toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

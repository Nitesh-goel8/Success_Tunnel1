import { useState } from 'react'

export default function LeaseAffordabilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(100000)
  const [targetPercentage, setTargetPercentage] = useState(30)

  const affordableRent = monthlyIncome * (targetPercentage / 100)
  const annualRent = affordableRent * 12

  return (
    <div className="panel-card" style={{ padding: '24px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: '0 0 20px', fontSize: '1.25rem' }}>Lease Affordability Estimator</h3>
      
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Monthly Budget/Revenue (₹)</span>
            <strong style={{ color: 'var(--primary)' }}>₹{monthlyIncome.toLocaleString('en-IN')}</strong>
          </div>
          <input 
            type="range" 
            min="20000" 
            max="10000000" 
            step="10000" 
            value={monthlyIncome} 
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }} 
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Target Rent Allocation (%)</span>
            <strong style={{ color: 'var(--primary)' }}>{targetPercentage}%</strong>
          </div>
          <input 
            type="range" 
            min="10" 
            max="50" 
            step="5" 
            value={targetPercentage} 
            onChange={(e) => setTargetPercentage(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }} 
          />
          <small style={{ color: 'var(--muted)', display: 'block', marginTop: '4px', fontSize: '0.75rem' }}>
            Industry standard is ~30% for comfortable leasing.
          </small>
        </div>
      </div>

      <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Affordable Monthly Rent</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>₹{Math.round(affordableRent).toLocaleString('en-IN')}</div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Annual Commitment</span>
            <strong style={{ fontSize: '0.9rem' }}>₹{annualRent.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Recommendation</span>
            <strong style={{ fontSize: '0.9rem', color: targetPercentage <= 30 ? 'var(--success, #16a34a)' : 'var(--accent)' }}>
              {targetPercentage <= 30 ? 'Safe' : 'Aggressive'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}

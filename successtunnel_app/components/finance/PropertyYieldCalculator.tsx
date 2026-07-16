import { useState } from 'react'

export default function PropertyYieldCalculator() {
  const [propertyValue, setPropertyValue] = useState(5000000)
  const [monthlyRent, setMonthlyRent] = useState(30000)

  const annualRent = monthlyRent * 12
  const grossYield = (annualRent / propertyValue) * 100

  return (
    <div className="panel-card" style={{ padding: '24px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: '0 0 20px', fontSize: '1.25rem' }}>Property Yield Estimator</h3>
      
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Property Value (₹)</span>
            <strong style={{ color: 'var(--primary)' }}>₹{propertyValue.toLocaleString('en-IN')}</strong>
          </div>
          <input 
            type="range" 
            min="1000000" 
            max="100000000" 
            step="1000000" 
            value={propertyValue} 
            onChange={(e) => setPropertyValue(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }} 
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Expected Monthly Rent (₹)</span>
            <strong style={{ color: 'var(--primary)' }}>₹{monthlyRent.toLocaleString('en-IN')}</strong>
          </div>
          <input 
            type="range" 
            min="5000" 
            max="500000" 
            step="5000" 
            value={monthlyRent} 
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }} 
          />
        </div>
      </div>

      <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--line)' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Gross Rental Yield</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: grossYield >= 5 ? 'var(--success, #16a34a)' : 'var(--accent)' }}>
            {grossYield.toFixed(2)}%
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Annual Rent</span>
            <strong style={{ fontSize: '0.9rem' }}>₹{annualRent.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Industry Avg.</span>
            <strong style={{ fontSize: '0.9rem' }}>~3.5 - 6%</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

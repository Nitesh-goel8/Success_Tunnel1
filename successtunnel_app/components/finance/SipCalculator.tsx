import { useState } from 'react'

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000)
  const [expectedReturnRate, setExpectedReturnRate] = useState(12)
  const [years, setYears] = useState(10)

  // SIP Formula: M = P * ((1 + i)^n - 1) / i * (1 + i)
  // P = monthly investment
  // i = monthly return rate = rate / 12 / 100
  // n = number of months = years * 12
  const i = expectedReturnRate / 12 / 100
  const n = years * 12
  
  const expectedAmount = monthlyInvestment * (Math.pow(1 + i, n) - 1) / i * (1 + i)
  const totalInvestment = monthlyInvestment * n
  const wealthGained = expectedAmount - totalInvestment

  return (
    <div className="panel-card" style={{ padding: '24px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: '0 0 20px', fontSize: '1.25rem' }}>SIP Returns Estimator</h3>
      
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Monthly Investment (₹)</span>
            <strong style={{ color: 'var(--primary)' }}>₹{monthlyInvestment.toLocaleString('en-IN')}</strong>
          </div>
          <input 
            type="range" 
            min="1000" 
            max="100000" 
            step="1000" 
            value={monthlyInvestment} 
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }} 
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Expected Return Rate (% p.a.)</span>
            <strong style={{ color: 'var(--primary)' }}>{expectedReturnRate}%</strong>
          </div>
          <input 
            type="range" 
            min="5" 
            max="30" 
            step="1" 
            value={expectedReturnRate} 
            onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }} 
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Time Period (Years)</span>
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
          <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Expected Amount</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>₹{Math.round(expectedAmount).toLocaleString('en-IN')}</div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Invested Amount</span>
            <strong style={{ fontSize: '0.9rem' }}>₹{Math.round(totalInvestment).toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Wealth Gained</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--success, #16a34a)' }}>+₹{Math.round(wealthGained).toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

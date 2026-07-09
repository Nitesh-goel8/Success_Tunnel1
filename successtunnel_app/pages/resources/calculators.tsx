import { useState } from 'react'
import PageShell from '../../components/PageShell'

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<'emi' | 'tax' | 'property'>('emi')

  // EMI state
  const [emiPrincipal, setEmiPrincipal] = useState<number>(1500000)
  const [emiRate, setEmiRate] = useState<number>(8.5)
  const [emiTenure, setEmiTenure] = useState<number>(15)

  // Tax state
  const [taxIncome, setTaxIncome] = useState<number>(1200000)
  const [taxDeductions, setTaxDeductions] = useState<number>(150000)

  // Property state
  const [propIncome, setPropIncome] = useState<number>(100000)
  const [propSavings, setPropSavings] = useState<number>(500000)
  const [propDebt, setPropDebt] = useState<number>(10000)
  const [propRate, setPropRate] = useState<number>(8.5)
  const [propTenure, setPropTenure] = useState<number>(20)

  // --- EMI Calculations ---
  const r = emiRate / 12 / 100
  const n = emiTenure * 12
  const emiVal = r > 0 ? (emiPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : emiPrincipal / n
  const emiMonthly = Math.round(emiVal)
  const emiTotalPayable = emiMonthly * n
  const emiTotalInterest = emiTotalPayable - emiPrincipal
  const interestPercentage = Math.round((emiTotalInterest / emiTotalPayable) * 100) || 0

  // --- Tax Slabs (India FY 2024-25) ---
  const getNewRegimeTax = (income: number): number => {
    const stdDed = 75000
    const taxable = Math.max(0, income - stdDed)
    if (taxable <= 700000) return 0

    let tax = 0
    if (taxable > 1500000) {
      tax += (taxable - 1500000) * 0.3
      tax += 300000 * 0.2
      tax += 200000 * 0.15
      tax += 300000 * 0.1
      tax += 400000 * 0.05
    } else if (taxable > 1200000) {
      tax += (taxable - 1200000) * 0.2
      tax += 200000 * 0.15
      tax += 300000 * 0.1
      tax += 400000 * 0.05
    } else if (taxable > 1000000) {
      tax += (taxable - 1000000) * 0.15
      tax += 300000 * 0.1
      tax += 400000 * 0.05
    } else if (taxable > 700000) {
      tax += (taxable - 700000) * 0.1
      tax += 400000 * 0.05
    } else if (taxable > 300000) {
      tax += (taxable - 300000) * 0.05
    }
    return Math.round(tax)
  }

  const getOldRegimeTax = (income: number, deductions: number): number => {
    const stdDed = 50000
    const taxable = Math.max(0, income - stdDed - deductions)
    if (taxable <= 500000) return 0

    let tax = 0
    if (taxable > 1000000) {
      tax += (taxable - 1000000) * 0.3
      tax += 500000 * 0.2
      tax += 250000 * 0.05
    } else if (taxable > 500000) {
      tax += (taxable - 500000) * 0.2
      tax += 250000 * 0.05
    } else if (taxable > 250000) {
      tax += (taxable - 250000) * 0.05
    }
    return Math.round(tax)
  }

  const newRegimeTax = getNewRegimeTax(taxIncome)
  const oldRegimeTax = getOldRegimeTax(taxIncome, taxDeductions)

  // --- Property Affordability Calculations ---
  const maxAffordableEMI = Math.max(0, propIncome * 0.36 - propDebt)
  const propR = propRate / 12 / 100
  const propN = propTenure * 12
  const maxLoan = propR > 0 
    ? (maxAffordableEMI * (Math.pow(1 + propR, propN) - 1)) / (propR * Math.pow(1 + propR, propN)) 
    : maxAffordableEMI * propN
  const maxPropertyPrice = Math.round(maxLoan + propSavings)

  return (
    <PageShell
      eyebrow="Calculators"
      title="Financial Planning Tools"
      description="Calculate loan repayments, estimate your taxes, and evaluate property affordability dynamically."
      aside={
        <div className="hero-board" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="service-card-kicker">Interactive Modules</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Empowering your financial decisions.</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '12px 0 24px' }}>
            Toggle tabs to use customized simulators with live feedback.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('emi')}
              style={{
                background: activeTab === 'emi' ? 'linear-gradient(135deg, #0b3a86, #165df5)' : 'var(--surface)',
                color: activeTab === 'emi' ? '#fff' : 'var(--primary)',
                border: '1px solid var(--line)',
                padding: '14px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'emi' ? '0 8px 20px rgba(22, 93, 245, 0.2)' : 'none',
              }}
            >
              📊 Loan EMI Calculator
            </button>
            <button
              onClick={() => setActiveTab('tax')}
              style={{
                background: activeTab === 'tax' ? 'linear-gradient(135deg, #0b3a86, #165df5)' : 'var(--surface)',
                color: activeTab === 'tax' ? '#fff' : 'var(--primary)',
                border: '1px solid var(--line)',
                padding: '14px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'tax' ? '0 8px 20px rgba(22, 93, 245, 0.2)' : 'none',
              }}
            >
              💰 Indian Tax Slab Estimator
            </button>
            <button
              onClick={() => setActiveTab('property')}
              style={{
                background: activeTab === 'property' ? 'linear-gradient(135deg, #0b3a86, #165df5)' : 'var(--surface)',
                color: activeTab === 'property' ? '#fff' : 'var(--primary)',
                border: '1px solid var(--line)',
                padding: '14px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'property' ? '0 8px 20px rgba(22, 93, 245, 0.2)' : 'none',
              }}
            >
              🏢 Property Affordability
            </button>
          </div>
        </div>
      }
    >
      <section className="section-surface" style={{ borderRadius: '24px', padding: '36px', minHeight: '520px' }}>
        
        {/* --- EMI TAB --- */}
        {activeTab === 'emi' && (
          <div>
            <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 28px' }}>
              <span className="eyebrow">REPAYMENT ESTIMATOR</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Loan EMI Calculator</h2>
              <p style={{ color: 'var(--muted)' }}>Calculate monthly installments and interest overhead on commercial or home loans.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
              {/* Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                    <label>Loan Amount (Principal)</label>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{emiPrincipal.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="50000"
                    value={emiPrincipal}
                    onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <input
                    type="number"
                    value={emiPrincipal}
                    onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                    style={{ marginTop: '6px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                    <label>Interest Rate (% P.A.)</label>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{emiRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.1"
                    value={emiRate}
                    onChange={(e) => setEmiRate(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                    <label>Loan Tenure</label>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{emiTenure} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={emiTenure}
                    onChange={(e) => setEmiTenure(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                </div>
              </div>

              {/* Display & Breakdown Chart */}
              <div style={{ background: '#f8fafc', padding: '28px', borderRadius: '20px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Monthly Installment</span>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', margin: '8px 0', fontFamily: "'Sora', sans-serif" }}>
                    ₹{emiMonthly.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ margin: '24px 0', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  {/* SVG Donut Chart */}
                  <svg width="150" height="150" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ddd" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="3.2"
                      strokeDasharray={`${interestPercentage} ${100 - interestPercentage}`}
                      strokeDashoffset="25"
                      style={{ transition: 'stroke-dasharray 0.3s ease' }}
                    />
                    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" style={{ fontSize: '5px', fontWeight: 800, fill: 'var(--primary)', fontFamily: 'sans-serif' }}>
                      {interestPercentage}% Int
                    </text>
                  </svg>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Principal Amount:</span>
                    <strong style={{ color: 'var(--primary)' }}>₹{emiPrincipal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Total Interest:</span>
                    <strong style={{ color: 'var(--accent)' }}>₹{emiTotalInterest.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '4px' }}>
                    <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Total Payable:</span>
                    <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>₹{emiTotalPayable.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAX TAB --- */}
        {activeTab === 'tax' && (
          <div>
            <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 28px' }}>
              <span className="eyebrow">REGIME COMPARATOR</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Indian Tax Slab Estimator</h2>
              <p style={{ color: 'var(--muted)' }}>Compare tax outflow side-by-side under the Old vs New Tax regimes for FY 2024-25.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
              {/* Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                    <label>Annual Income</label>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{taxIncome.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="300000"
                    max="5000000"
                    step="50000"
                    value={taxIncome}
                    onChange={(e) => setTaxIncome(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <input
                    type="number"
                    value={taxIncome}
                    onChange={(e) => setTaxIncome(Number(e.target.value))}
                    style={{ marginTop: '6px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                    <label>Old Regime Deductions (80C, 80D, HRA etc.)</label>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{taxDeductions.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={taxDeductions}
                    onChange={(e) => setTaxDeductions(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <input
                    type="number"
                    value={taxDeductions}
                    onChange={(e) => setTaxDeductions(Number(e.target.value))}
                    style={{ marginTop: '6px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}
                  />
                </div>
              </div>

              {/* Comparison Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#eff6ff', border: '1px solid rgba(22,93,245,0.15)', padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>New Regime Tax</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Includes Std. Deduction ₹75,000</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)' }}>₹{newRegimeTax.toLocaleString('en-IN')}</div>
                    {newRegimeTax === 0 && <span style={{ fontSize: '0.78rem', color: 'green', fontWeight: 700 }}>Tax Free (u/s 87A)</span>}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid var(--line)', padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Old Regime Tax</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Includes Std. Deduction ₹50,000</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)' }}>₹{oldRegimeTax.toLocaleString('en-IN')}</div>
                    {oldRegimeTax === 0 && <span style={{ fontSize: '0.78rem', color: 'green', fontWeight: 700 }}>Tax Free (u/s 87A)</span>}
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(22,93,245,0.06)', border: '1px solid rgba(22,93,245,0.1)', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                  {oldRegimeTax === newRegimeTax ? (
                    <span style={{ color: 'var(--primary)' }}>Both regimes result in the same tax liability.</span>
                  ) : oldRegimeTax > newRegimeTax ? (
                    <span style={{ color: 'green' }}>✓ New Regime saves you ₹{(oldRegimeTax - newRegimeTax).toLocaleString('en-IN')}!</span>
                  ) : (
                    <span style={{ color: 'green' }}>✓ Old Regime saves you ₹{(newRegimeTax - oldRegimeTax).toLocaleString('en-IN')}!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PROPERTY TAB --- */}
        {activeTab === 'property' && (
          <div>
            <div className="section-heading" style={{ textAlign: 'left', margin: '0 0 28px' }}>
              <span className="eyebrow">BUDGET &amp; LOAN PLANNING</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Property Affordability Calculator</h2>
              <p style={{ color: 'var(--muted)' }}>Verify your maximum buying power based on income, savings, and monthly debt overhead.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
              {/* Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Monthly Income</label>
                    <input
                      type="number"
                      value={propIncome}
                      onChange={(e) => setPropIncome(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Down Payment Savings</label>
                    <input
                      type="number"
                      value={propSavings}
                      onChange={(e) => setPropSavings(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Existing Monthly Debts</label>
                    <input
                      type="number"
                      value={propDebt}
                      onChange={(e) => setPropDebt(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Loan Rate (% P.A.)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={propRate}
                      onChange={(e) => setPropRate(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Tenure (Years)</label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={propTenure}
                    onChange={(e) => setPropTenure(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block', marginTop: '4px' }}>{propTenure} Years selected</span>
                </div>
              </div>

              {/* Display panel */}
              <div style={{ background: '#f8fafc', padding: '28px', borderRadius: '20px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Recommended Buying Power</span>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)', margin: '8px 0', fontFamily: "'Sora', sans-serif" }}>
                    ₹{maxPropertyPrice.toLocaleString('en-IN')}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>This is the estimate of the maximum property price you can afford.</p>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Max Affordable EMI:</span>
                    <strong style={{ color: 'var(--primary)' }}>₹{Math.round(maxAffordableEMI).toLocaleString('en-IN')} / mo</strong>
                  </div>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Estimated Loan Amount:</span>
                    <strong style={{ color: 'var(--primary)' }}>₹{Math.round(maxLoan).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Down Payment Contribution:</span>
                    <strong style={{ color: 'var(--primary)' }}>₹{propSavings.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>
    </PageShell>
  )
}

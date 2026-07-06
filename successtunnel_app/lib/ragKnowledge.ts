export type KnowledgeDoc = {
  id: string
  category: string
  keywords: string[]
  question: string
  answer: string
}

export const RAG_KNOWLEDGE: KnowledgeDoc[] = [
  {
    id: "gst-threshold",
    category: "GST",
    keywords: ["gst registration limit", "gst threshold", "gst required", "turnover limit for gst"],
    question: "When is GST registration mandatory?",
    answer: "GST registration is mandatory if your annual aggregate turnover exceeds ₹40 Lakhs for businesses supplying goods, or ₹20 Lakhs for service providers. For special category states (mainly in Northeast India), the thresholds are lower (₹20 Lakhs for goods and ₹10 Lakhs for services). Registration is also compulsory for e-commerce operators, casual taxable persons, and businesses making inter-state supplies, regardless of their turnover."
  },
  {
    id: "gst-documents",
    category: "GST",
    keywords: ["gst registration documents", "gst papers", "documents for gst"],
    question: "What documents are required for GST registration?",
    answer: "For GST registration, you generally need: (1) PAN card of the business/owner, (2) Aadhaar card of the owner/partners/directors, (3) Proof of business address (like a electricity bill, rent agreement, or NOC), (4) Bank account statement or cancelled cheque, and (5) Proof of business incorporation (for LLPs or Private Limited companies)."
  },
  {
    id: "income-tax-slabs",
    category: "Income Tax",
    keywords: ["tax slabs", "income tax rate", "tax rates 2024", "new tax regime slabs"],
    question: "What are the latest Income Tax slabs under the New Tax Regime?",
    answer: "Under the New Tax Regime (FY 2024-25 / AY 2025-26): (1) Up to ₹3 Lakhs: Nil tax, (2) ₹3 Lakhs to ₹6 Lakhs: 5%, (3) ₹6 Lakhs to ₹9 Lakhs: 10%, (4) ₹9 Lakhs to ₹12 Lakhs: 15%, (5) ₹12 Lakhs to ₹15 Lakhs: 20%, and (6) Above ₹15 Lakhs: 30%. A standard deduction of ₹75,000 is also available under the new regime, and individuals with a net taxable income up to ₹7 Lakhs receive a tax rebate (paying zero tax)."
  },
  {
    id: "tax-saving-80c",
    category: "Income Tax",
    keywords: ["save tax", "80c deductions", "tax saving investments", "how to save income tax"],
    question: "How can I save income tax under Section 80C?",
    answer: "Under the Old Tax Regime, you can claim deductions up to ₹1.5 Lakhs per year under Section 80C by investing in: (1) Public Provident Fund (PPF), (2) Employee Provident Fund (EPF), (3) National Savings Certificates (NSC), (4) Equity Linked Savings Schemes (ELSS Mutual Funds), (5) Life Insurance Premiums, (6) Principal repayment of a home loan, and (7) Tuition fees for children. Note that these deductions are not applicable under the New Tax Regime."
  },
  {
    id: "company-incorporation",
    category: "Company Registration",
    keywords: ["register company", "start private limited", "pvt ltd incorporation", "company setup docs"],
    question: "What are the steps to incorporate a Private Limited Company?",
    answer: "To incorporate a Private Limited Company in India: (1) Apply for Digital Signature Certificates (DSC) for directors, (2) Apply for Name Approval via the RUN service, (3) Submit the SPICe+ (INC-32) form on the MCA portal for incorporation, including PAN, TAN, and EPFO registration, and (4) Obtain the Certificate of Incorporation (COI) along with the company PAN and TAN. The process typically takes 5 to 10 business days."
  },
  {
    id: "llp-vs-pvt-ltd",
    category: "Company Registration",
    keywords: ["llp vs private limited", "difference between llp and pvt ltd", "llp or company"],
    question: "What is the difference between an LLP and a Private Limited Company?",
    answer: "An LLP (Limited Liability Partnership) has fewer compliance requirements, lower setup costs, and no audit requirement unless turnover exceeds ₹40 Lakhs or capital contribution exceeds ₹25 Lakhs. A Private Limited Company is preferred by startups looking to raise venture capital, issue ESOPs, or transfer shares easily, but it comes with stricter compliance rules and mandatory annual audits."
  },
  {
    id: "msme-benefits",
    category: "MSME",
    keywords: ["msme benefits", "udyam registration benefits", "why register msme", "small business subsidies"],
    question: "What are the benefits of MSME (Udyam) Registration?",
    answer: "MSME registration offers significant benefits: (1) Collateral-free bank loans with lower interest rates, (2) Subsidies on patent and trademark registration fees (up to 50%), (3) Protection against delayed payments (buyers must pay within 45 days), (4) Concession on electricity bills, and (5) Preference in government tenders and exclusive market lists."
  },
  {
    id: "trademark-validity",
    category: "Trademark",
    keywords: ["trademark validity", "how long trademark lasts", "trademark renewal"],
    question: "How long is a registered trademark valid in India?",
    answer: "A registered trademark in India is valid for 10 years from the date of application. It can be renewed indefinitely for successive periods of 10 years by paying the renewal fee before expiry. Failure to renew may result in the trademark being removed from the registry."
  },
  {
    id: "pan-tan-difference",
    category: "Tax compliance",
    keywords: ["pan vs tan", "difference between pan and tan", "what is tan number"],
    question: "What is the difference between PAN and TAN?",
    answer: "PAN (Permanent Account Number) is a 10-digit alphanumeric number issued by the Income Tax Department to track financial transactions and file tax returns. TAN (Tax Deduction and Collection Account Number) is a separate 10-digit number required for anyone who is responsible for deducting tax at source (TDS) or collecting tax at source (TCS)."
  },
  {
    id: "tds-returns",
    category: "Tax compliance",
    keywords: ["tds return due dates", "when to file tds", "tds payment due date"],
    question: "What are the due dates for TDS returns and payments?",
    answer: "TDS payments must be deposited monthly, generally by the 7th of the following month (e.g., TDS deducted in June must be paid by July 7th). TDS returns must be filed quarterly: Quarter 1 (April-June) by July 31, Quarter 2 (July-Sept) by Oct 31, Quarter 3 (Oct-Dec) by Jan 31, and Quarter 4 (Jan-March) by May 31."
  }
];

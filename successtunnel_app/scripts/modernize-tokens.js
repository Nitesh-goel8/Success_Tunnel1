const fs = require('fs')
const path = require('path')

const filePath = 'C:/Users/nites/Downloads/Success_Tunnel1/successtunnel_app/styles/globals.css'
let content = fs.readFileSync(filePath, 'utf8')

// Replace the legacy :root block
const legacyRoot = /:root\s*\{[\s\S]*?--shadow:[^\}]*\}/
const newRoot = `:root {
  --bg: #090e17;
  --bg-secondary: #0d1527;
  --surface: #0f1c3f;
  --surface-card: rgba(13, 21, 39, 0.75);
  --surface-soft: rgba(30, 58, 138, 0.2);
  --primary: #f8fafc;
  --primary-strong: #ffffff;
  --accent: #38bdf8;
  --accent-sapphire: #2563eb;
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --text-subtle: #64748b;
  --line: rgba(255, 255, 255, 0.08);
  --line-highlight: rgba(56, 189, 248, 0.25);
  --shadow-card: 0 16px 36px rgba(0, 0, 0, 0.35);
}`

content = content.replace(legacyRoot, newRoot)

// Update body background
const legacyBody = /body\s*\{[\s\S]*?overflow-x:\s*hidden;\s*\}/
const newBody = `body {
  margin: 0;
  min-height: 100vh;
  background: #090e17;
  color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.65;
  overflow-x: hidden;
}`

content = content.replace(legacyBody, newBody)

fs.writeFileSync(filePath, content, 'utf8')
console.log('Successfully modernized globals.css design system tokens!')

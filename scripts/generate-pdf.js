import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Edge or Chrome binary
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browserExe = fs.existsSync(edgePath) ? edgePath : chromePath;

function generateHtml(title, subtitle, contentMarkdown) {
  // Simple markdown to HTML parser for documentation
  let html = contentMarkdown;

  // Code blocks
  html = html.replace(/```mermaid[\s\S]*?```/g, (match) => {
    return `<div class="diagram-box"><em>[Workflow Architecture Diagram - see online manual for interactive view]</em></div>`;
  });
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Blockquotes / Alerts
  html = html.replace(/^> \[!NOTE\] (.*$)/gim, '<div class="alert alert-note"><strong>NOTE:</strong> $1</div>');
  html = html.replace(/^> \[!TIP\] (.*$)/gim, '<div class="alert alert-tip"><strong>TIP:</strong> $1</div>');
  html = html.replace(/^> \[!IMPORTANT\] (.*$)/gim, '<div class="alert alert-important"><strong>IMPORTANT:</strong> $1</div>');

  // Bold and Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Tables
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        // separator row, skip
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHtml = '<table class="doc-table"><thead><tr>';
        cells.forEach(c => { tableHtml += `<th>${c}</th>`; });
        tableHtml += '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr>';
        cells.forEach(c => { tableHtml += `<td>${c}</td>`; });
        tableHtml += '</tr>';
      }
    } else {
      if (inTable) {
        tableHtml += '</tbody></table>';
        newLines.push(tableHtml);
        inTable = false;
      }
      newLines.push(lines[i]);
    }
  }
  if (inTable) {
    tableHtml += '</tbody></table>';
    newLines.push(tableHtml);
  }
  html = newLines.join('\n');

  // Unordered lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ol-item">$1</li>');
  html = html.replace(/((?:<li class="ol-item">.*<\/li>\s*)+)/g, '<ol>$1</ol>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }
    *, *:before, *:after {
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #18181b;
      line-height: 1.6;
      font-size: 11pt;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    .header-banner {
      background: #09090b;
      color: #ffffff;
      padding: 24px 28px;
      border-radius: 12px;
      border-left: 8px solid #dc2626;
      margin-bottom: 25px;
    }
    .header-banner h1 {
      color: #ffffff;
      margin: 0 0 6px 0;
      font-size: 22pt;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header-banner .subtitle {
      color: #a1a1aa;
      font-size: 11pt;
      font-weight: 500;
      margin: 0 0 14px 0;
    }
    .header-meta {
      display: flex;
      gap: 18px;
      font-size: 9.5pt;
      color: #d4d4d8;
      border-top: 1px solid #27272a;
      padding-top: 12px;
    }
    .header-meta span strong {
      color: #ef4444;
    }
    h1, h2, h3, h4 {
      color: #09090b;
      font-weight: 700;
      margin-top: 24px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }
    h2 {
      font-size: 14pt;
      border-bottom: 2px solid #fee2e2;
      padding-bottom: 6px;
      color: #991b1b;
    }
    h3 {
      font-size: 12pt;
      color: #18181b;
      margin-top: 16px;
    }
    p {
      margin: 0 0 10px 0;
    }
    ul, ol {
      margin: 0 0 14px 0;
      padding-left: 22px;
    }
    li {
      margin-bottom: 4px;
    }
    .doc-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 20px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    .doc-table th {
      background: #18181b;
      color: #ffffff;
      padding: 9px 12px;
      text-align: left;
      font-weight: 600;
    }
    .doc-table td {
      padding: 8px 12px;
      border-bottom: 1px solid #e4e4e7;
    }
    .doc-table tr:nth-child(even) td {
      background: #fafafa;
    }
    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin: 14px 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    .alert-tip {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
      color: #065f46;
    }
    .alert-note {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      color: #1e40af;
    }
    .alert-important {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      color: #991b1b;
    }
    .diagram-box {
      background: #f4f4f5;
      border: 1px dashed #d4d4d8;
      border-radius: 8px;
      padding: 14px;
      text-align: center;
      margin: 14px 0;
      color: #71717a;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    pre {
      background: #09090b;
      color: #f4f4f5;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 9pt;
      overflow-x: auto;
      page-break-inside: avoid;
    }
    code {
      font-family: Consolas, 'Courier New', monospace;
      font-size: 9pt;
      background: #f4f4f5;
      color: #dc2626;
      padding: 2px 4px;
      border-radius: 4px;
    }
    pre code {
      background: transparent;
      color: #f4f4f5;
      padding: 0;
    }
    .footer-note {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #e4e4e7;
      font-size: 8.5pt;
      color: #71717a;
      text-align: center;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <h1>INDEX MOTORS</h1>
    <div class="subtitle">${subtitle}</div>
    <div class="header-meta">
      <span>📍 <strong>Location:</strong> Pallipadi, Gudallur</span>
      <span>📞 <strong>Support:</strong> +91 8848555675</span>
      <span>🚛 <strong>Hub:</strong> Swaraj Mazda & Tata Commercial</span>
      <span>📄 <strong>Version:</strong> 3.0.0</span>
    </div>
  </div>

  ${html}

  <div class="footer-note">
    Index Motors Dealership & Heavy Workshop System • Official Operational Manual • Confidential & Proprietary
  </div>
</body>
</html>`;
}

async function convertDocToPdf(mdPath, pdfPath, title, subtitle) {
  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const htmlContent = generateHtml(title, subtitle, mdContent);
  const tempHtmlPath = path.join(projectRoot, `temp-${path.basename(pdfPath, '.pdf')}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

  console.log(`Generating PDF from ${path.basename(mdPath)} via headless browser...`);
  const cmd = `"${browserExe}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${tempHtmlPath}"`;
  execSync(cmd, { stdio: 'inherit' });

  // Cleanup temp HTML
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  console.log(`✓ Successfully generated: ${pdfPath} (${(fs.statSync(pdfPath).size / 1024).toFixed(1)} KB)`);
}

async function main() {
  try {
    const userManualMd = path.join(projectRoot, 'USER_MANUAL.md');
    const userManualPdf = path.join(projectRoot, 'Index-Motors-User-Manual.pdf');
    await convertDocToPdf(
      userManualMd,
      userManualPdf,
      'Index Motors - End-User Operating Manual',
      'Commercial Dealership & Heavy Workshop Operating Guide (SOP)'
    );

    const docMd = path.join(projectRoot, 'DOCUMENTATION.md');
    const docPdf = path.join(projectRoot, 'Index-Motors-Technical-Documentation.pdf');
    await convertDocToPdf(
      docMd,
      docPdf,
      'Index Motors - System Documentation',
      'Enterprise System Architecture & Technical Specifications Manual'
    );

    // Also copy to brain artifacts directory so user can open directly from chat
    const brainDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\7428e246-7ce1-400b-bdbf-e2d53c4e1c74';
    if (fs.existsSync(brainDir)) {
      fs.copyFileSync(userManualPdf, path.join(brainDir, 'Index-Motors-User-Manual.pdf'));
      fs.copyFileSync(docPdf, path.join(brainDir, 'Index-Motors-Technical-Documentation.pdf'));
      console.log('✓ Copied PDFs to artifacts brain directory');
    }
  } catch (err) {
    console.error('PDF Generation failed:', err);
    process.exit(1);
  }
}

main();

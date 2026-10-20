import { Capacitor, registerPlugin } from '@capacitor/core';
import { formatCurrency, formatDate } from './formatters';

// Register native plugin for Android (implemented in WhatsAppLauncherPlugin.java)
const WhatsAppLauncher = registerPlugin('WhatsAppLauncher');

/**
 * Clean and format phone number for WhatsApp international format (E.164).
 * Defaults to India (+91) if 10 digits provided.
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '91' + cleaned.substring(1);
  } else if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
};

/**
 * Generate formatted WhatsApp message for an Invoice.
 */
export const generateInvoiceWhatsAppMessage = (invoice, profile) => {
  const currency = profile?.currency || '₹';
  const companyName = profile?.name || 'INDEX MOTORS';
  const companyPhone = profile?.phone || '+91 8848555675';
  const companyAddress = profile?.address ? `${profile.address}, ${profile.city || ''}` : 'Pallipadi, Gudallur';

  const itemsList = (invoice.items || [])
    .map((item, idx) => `  ${idx + 1}. ${item.description || 'Item'} (${item.quantity || 1}x) - ${formatCurrency((item.quantity || 1) * (item.unitPrice || 0), currency)}`)
    .join('\n');

  const message = 
`*${companyName.toUpperCase()} - COMMERCIAL VEHICLE INVOICE*
📍 ${companyAddress} | 📞 ${companyPhone}
━━━━━━━━━━━━━━━━━━━━━━

Dear *${invoice.customerName || 'Valued Customer'}*,

Here are the billing details for your commercial vehicle service/purchase:

📄 *Invoice No:* #${invoice.invoiceNumber || 'INV'}
📅 *Date Issued:* ${formatDate(invoice.issueDate)}
⏰ *Due Date:* ${formatDate(invoice.dueDate)}
🚛 *Vehicle / Fleet:* ${invoice.truckDetails || 'Commercial Vehicle'}
${invoice.jobCardId ? `🔧 *Job Card Ref:* #${invoice.jobCardId}\n` : ''}⚙️ *Invoice Type:* ${invoice.type || 'Commercial Billing'}

━━━━━━━━━━━━━━━━━━━━━━
*BILLING BREAKDOWN:*
${itemsList || '  • Standard Service & Parts'}
━━━━━━━━━━━━━━━━━━━━━━
💰 *Total Amount:* *${formatCurrency(invoice.totalAmount || 0, currency)}*
✅ *Paid Amount:* ${formatCurrency(invoice.paidAmount || 0, currency)}
⚠️ *Balance Due:* *${formatCurrency(invoice.balanceDue || 0, currency)}*
📊 *Status:* *${invoice.status ? invoice.status.toUpperCase() : 'PENDING'}*

${profile?.bankDetails ? `💳 *Payment / Bank Transfer:*
${profile.bankDetails}
` : `💳 *Payment Modes:* Cash, GPay, PhonePe, NEFT/RTGS to ${companyPhone}`}

Thank you for your business with *${companyName}*!
For any queries, please reply directly to this WhatsApp message or call ${companyPhone}.`;

  return message;
};

/**
 * Generate formatted WhatsApp message for a Job Card (Workshop Task).
 */
export const generateJobCardWhatsAppMessage = (task, profile) => {
  const companyName = profile?.name || 'INDEX MOTORS';
  const companyPhone = profile?.phone || '+91 8848555675';
  const companyAddress = profile?.address ? `${profile.address}, ${profile.city || ''}` : 'Pallipadi, Gudallur';

  const completedChecks = task.checklist ? task.checklist.filter(c => c.completed).length : 0;
  const totalChecks = task.checklist ? task.checklist.length : 0;
  const progressPercent = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

  const partsList = (task.parts && task.parts.length > 0)
    ? task.parts.map(p => `  • ${p.description || 'Part'} (Qty: ${p.qty || 1})`).join('\n')
    : '  • Inspection & labor in progress';

  const message =
`*${companyName.toUpperCase()} - WORKSHOP JOB CARD UPDATE*
📍 ${companyAddress} | 📞 ${companyPhone}
━━━━━━━━━━━━━━━━━━━━━━

Dear *${task.customerName || 'Fleet Manager / Owner'}*,

Here is the latest service status update for your commercial vehicle:

🔧 *Job Card ID:* *#${task.id}*
🚛 *Vehicle:* *${task.truckModel || 'Commercial Vehicle'}*
🔢 *Plate / Reg:* *${task.plate || 'Unregistered'}*
${task.vin ? `🆔 *VIN/Chassis:* ${task.vin}\n` : ''}📅 *Logged Date:* ${formatDate(task.dateReceived)}
🎯 *Target Delivery:* ${formatDate(task.targetDate)}
📍 *Bay Assigned:* ${task.bay || 'General Workshop Bay'}
👨‍🔧 *Lead Technician:* ${task.assignedTech || 'Senior Mechanic'}

━━━━━━━━━━━━━━━━━━━━━━
*WORK DETAILS & DIAGNOSIS:*
📋 *Title:* *${task.title}*
⚙️ *Category:* ${task.category || 'General Repair'}
🚦 *Live Status:* *${task.status ? task.status.toUpperCase() : 'IN PROGRESS'}*
⚠️ *Priority:* ${task.priority || 'Normal'}
${totalChecks > 0 ? `\n🔍 *Inspection Progress:* ${completedChecks}/${totalChecks} Steps Completed (${progressPercent}%)` : ''}

${task.description ? `📝 *Work Scope:*
${task.description}
` : ''}
📦 *Allocated Parts & Spares:*
${partsList}
━━━━━━━━━━━━━━━━━━━━━━
We will keep you updated on the repair progress and road-test readiness.

*${companyName} Heavy Workshop Support*
📞 ${companyPhone}`;

  return message;
};

/**
 * Trigger WhatsApp opening across all environments:
 * 1. Android Native App (via WhatsAppLauncher Capacitor Plugin + Intent)
 * 2. Windows PC (.exe Desktop App via Electron shell.openExternal)
 * 3. Web Browser (Direct web / WhatsApp Web link)
 */
export const openWhatsApp = async (phone, text) => {
  const cleanPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(text || '');

  // 1. Android Native App via Capacitor
  if (Capacitor.isNativePlatform()) {
    try {
      const res = await WhatsAppLauncher.openWhatsApp({
        phone: cleanPhone,
        text: text || ''
      });
      if (res && res.success) {
        return { success: true, platform: 'android-native' };
      }
    } catch (nativeErr) {
      console.warn('Native WhatsAppLauncher plugin failed, trying scheme fallback:', nativeErr);
    }

    // Direct scheme navigation fallback for Android WebView
    try {
      const schemeUrl = cleanPhone
        ? `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`
        : `whatsapp://send?text=${encodedText}`;
      window.location.href = schemeUrl;
      return { success: true, platform: 'android-scheme-fallback' };
    } catch (e) {
      console.warn('Android scheme navigation failed:', e);
    }
  }

  // 2. Windows PC Desktop (.exe via Electron)
  if (window.electronAPI && typeof window.electronAPI.openExternal === 'function') {
    try {
      // api.whatsapp.com prompts Windows to open WhatsApp Desktop if installed, or WhatsApp Web in default browser
      const desktopUrl = cleanPhone
        ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
        : `https://api.whatsapp.com/send?text=${encodedText}`;

      const res = await window.electronAPI.openExternal(desktopUrl);
      if (res && res.success !== false) {
        return { success: true, platform: 'electron-desktop' };
      }
    } catch (electronErr) {
      console.warn('Electron openExternal failed:', electronErr);
    }
  }

  // 3. Universal Web Browser (Chrome, Edge, Safari, Firefox)
  const webUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  try {
    const anchor = document.createElement('a');
    anchor.href = webUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      if (anchor.parentNode) {
        anchor.parentNode.removeChild(anchor);
      }
    }, 500);
    return { success: true, platform: 'web-browser' };
  } catch (webErr) {
    window.open(webUrl, '_blank', 'noopener,noreferrer');
    return { success: true, platform: 'window-open' };
  }
};

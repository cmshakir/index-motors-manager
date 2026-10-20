import { formatCurrency, formatDate } from './formatters';

/**
 * Clean and format phone number for WhatsApp international format (E.164).
 * Defaults to India (+91) if 10 digits provided.
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
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
 * Trigger WhatsApp opening via WhatsApp Web (Desktop) or WhatsApp App (Mobile/Android).
 */
export const openWhatsApp = (phone, text) => {
  const cleanPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);

  let url = '';
  if (cleanPhone) {
    url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  } else {
    url = `https://api.whatsapp.com/send?text=${encodedText}`;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
};

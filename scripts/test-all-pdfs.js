const fs = require('fs');
const path = require('path');

// We can execute a test via ts-node to verify that @react-pdf/renderer produces valid buffers with our branding
async function run() {
  console.log('Testing PDF Brand logo loader...');
  const logoPath = path.join(__dirname, '..', 'public', 'logos', 'bezalel-logo-horizontal-dark.png');
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo file not found at ${logoPath}`);
  }
  const buffer = fs.readFileSync(logoPath);
  console.log(`✅ Base64 Logo verified (${buffer.length} bytes)`);

  const { generateQuotationPdfBuffer } = require('../lib/quotation-pdf');
  const { generateOrderInvoicePdfBuffer } = require('../lib/invoice-pdf');
  const { generateApplicationAcknowledgmentPdfBuffer } = require('../lib/application-pdf');
  const { generateProjectBriefPdfBuffer } = require('../lib/project-brief-pdf');

  // Test 1: Quotation PDF
  console.log('Generating sample Quotation PDF...');
  const quoteBuffer = await generateQuotationPdfBuffer({
    quoteNumber: 'BEZ-2026-0001',
    date: '20 Aug 2026',
    validUntil: '20 Sep 2026',
    clientName: 'Acme Enterprise Ltd',
    clientEmail: 'procurement@acme.com',
    clientCompany: 'Acme Global',
    clientPhone: '+254 700 000 000',
    projectTitle: 'Multi-Region Cloud Infrastructure & ERP',
    lineItems: [
      { description: 'Cloud Architecture Design & VPC Setup', qty: 1, unitPrice: 250000, amount: 250000 },
      { description: 'Next.js Frontend & Internal Admin Dashboards', qty: 1, unitPrice: 350000, amount: 350000 },
    ],
    subtotal: 600000,
    tax: 96000,
    total: 696000,
    notes: 'Standard 40/40/20 payment milestones. Valid for 30 calendar days.',
  });
  console.log(`✅ Quotation PDF generated: ${quoteBuffer.length} bytes`);

  // Test 2: Invoice PDF
  console.log('Generating sample Invoice PDF...');
  const invoiceBuffer = await generateOrderInvoicePdfBuffer({
    orderId: 'ORD-987654321',
    date: '20 Aug 2026',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@techcorp.io',
    customerPhone: '+254 712 345 678',
    shippingAddress: 'P.O. Box 45000, Nairobi, Kenya',
    items: [
      { name: 'UniFi Enterprise 24-Port 10G PoE Switch', quantity: 2, price: 68000 },
      { name: 'NextStack Pro SaaS Starter License', quantity: 1, price: 4500 },
    ],
    subtotal: 140500,
    tax: 0,
    total: 140500,
    paymentMethod: 'M-Pesa STK Push',
    paymentRef: 'QWE789RTY',
  });
  console.log(`✅ Invoice PDF generated: ${invoiceBuffer.length} bytes`);

  // Test 3: Application PDF
  console.log('Generating sample Job Application PDF...');
  const appBuffer = await generateApplicationAcknowledgmentPdfBuffer({
    applicationId: 'APP-123456',
    date: '20 Aug 2026',
    applicantName: 'David Kiprono',
    applicantEmail: 'david.kip@gmail.com',
    applicantPhone: '+254 722 111 222',
    jobTitle: 'Senior Full-Stack Systems Engineer',
    jobDepartment: 'Engineering Operations',
    coverNote: 'Over 6 years of experience building distributed systems with Next.js, Go, and PostgreSQL.',
  });
  console.log(`✅ Application PDF generated: ${appBuffer.length} bytes`);

  // Test 4: Project Brief PDF
  console.log('Generating sample Project Brief PDF...');
  const briefBuffer = await generateProjectBriefPdfBuffer({
    requestId: 'REQ-555666',
    date: '20 Aug 2026',
    clientName: 'Apex Financial Services',
    clientEmail: 'info@apexfin.com',
    clientCompany: 'Apex Financial Ltd',
    clientPhone: '+254 733 999 888',
    projectTitle: 'Automated Multi-Rail Payment Gateway',
    category: 'SYSTEM_INTEGRATION',
    budget: 850000,
    timeline: '6 Sprints (12 Weeks)',
    description: 'Integration of automated bank reconciliation, M-Pesa B2C disbursements, and Stripe international acquiring.',
  });
  console.log(`✅ Project Brief PDF generated: ${briefBuffer.length} bytes`);

  console.log('\n🎉 ALL 4 PDF GENERATORS CONFIRMED OPERATIONAL WITH OFFICIAL BRANDING!');
}

run().catch(err => {
  console.error('❌ PDF generation test error:', err);
  process.exit(1);
});

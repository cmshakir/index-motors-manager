export const initialCompanyProfile = {
  name: "INDEX MOTORS",
  subTitle: "Swaraj Mazda Sales & Service - Buses & Lorries",
  tagline: "Authorized Swaraj Mazda Dealership, Commercial Buses & Heavy Lorries Workshop",
  address: "Pallipadi, Gudallur",
  city: "The Nilgiris, Tamil Nadu - 643211",
  country: "India",
  phone: "+91 8848555675",
  email: "info@indexmotors.online",
  salesEmail: "sales@indexmotors.online",
  website: "www.indexmotors.online",
  taxId: "GSTIN: 33AAECI9812M1Z8",
  vatNumber: "ARN-33-091823901",
  bankName: "State Bank of India",
  accountName: "INDEX MOTORS SML SALES & SERVICE",
  accountNumber: "389201948102",
  ifscCode: "SBIN0001048",
  branch: "Gudallur Main Branch",
  routingNumber: "643002005",
  hourlyLaborRate: 650,
  defaultTaxRate: 18.0, // 18% GST (9% CGST + 9% SGST)
  currency: "₹",
  businessHours: "Mon-Sat: 9:00 AM - 7:00 PM",
  workshopBays: [
    "Bay 1 - Heavy Lorry Bay",
    "Bay 2 - Passenger Bus Bay",
    "Bay 3 - Swaraj Mazda Engine Overhaul",
    "Bay 4 - Air Brake & Suspension",
    "Bay 5 - Electrical & Diagnostics",
    "Bay 6 - PDI & Dealership Delivery"
  ],
  termsAndConditions: "1. All genuine Swaraj Mazda parts carry manufacturer warranty.\n2. Invoices are payable within agreed credit period.\n3. Vehicles must be collected within 3 days after completion of service.\n4. GST @ 18% applicable on commercial spare parts and workshop labor."
};

export const initialTechnicians = [
  { id: "TECH-1", name: "Ramesh Chandran", role: "Chief Diesel Mechanic", specialty: "Swaraj Mazda SLT3 & ISUZU Engine Overhaul", phone: "+91 88485 55675", status: "Active" },
  { id: "TECH-2", name: "Suresh Kumar", role: "Commercial Auto Electrician", specialty: "Bus/Lorry Wiring, Starters, Alternators & ECU", phone: "+91 94471 28910", status: "Active" },
  { id: "TECH-3", name: "Manoj Varghese", role: "Brake & Suspension Specialist", specialty: "Full Air S-Cam Brakes & Leaf Spring Assemblies", phone: "+91 98462 33410", status: "Active" },
  { id: "TECH-4", name: "Anoop Gudalur", role: "PDI & Vehicle Inspector", specialty: "Pre-Delivery Inspection & Bus Body Certification", phone: "+91 97450 11928", status: "Active" },
  { id: "TECH-5", name: "Pradeep Nair", role: "Transmission Mechanic", specialty: "5-Speed / 6-Speed Synchromesh Gearboxes & Clutches", phone: "+91 85930 77123", status: "Active" },
];

export const initialUsers = [
  {
    id: "USR-ADMIN",
    username: "admin",
    name: "Index Motor",
    email: "admin@indexmotors.online",
    password: "Sha@2026",
    role: "Dealership Owner & Managing Director",
    permissions: ["all"],
    avatar: "IM",
    phone: "+91 88485 55675"
  }
];

// Clean fresh arrays ready for production user entry
export const initialCustomers = [];
export const initialTrucks = [];
export const initialTasks = [];
export const initialInvoices = [];
export const initialSalesDeals = [];
export const initialExpenses = [];

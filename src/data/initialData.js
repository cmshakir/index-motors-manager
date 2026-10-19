// ============================================================================
// INDEX MOTORS - OFFICIAL SWARAJ MAZDA DEALERSHIP & COMMERCIAL VEHICLE REPAIR
// Comprehensive Commercial Vehicle Catalog (Swaraj Mazda Sales & Tata/SML Service)
// ============================================================================

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
  termsAndConditions: "1. All genuine Swaraj Mazda & Tata parts carry manufacturer warranty.\n2. Invoices are payable within agreed credit period.\n3. Vehicles must be collected within 3 days after completion of service.\n4. GST @ 18% applicable on commercial spare parts and workshop labor."
};

// ============================================================================
// COMPLETE SWARAJ MAZDA (SML ISUZU) VEHICLES CATALOG FOR SALES
// ============================================================================
export const SWARAJ_MAZDA_CATALOG = [
  {
    id: "SML-CAT-01",
    model: "SML Isuzu Sartaj 5252 XM Lorry",
    category: "Light Commercial Lorry (4-Wheeler)",
    type: "Lorry",
    gvw: "5,200 kg",
    payload: "2,750 kg",
    engine: "3455 cc SLT4 Turbocharged Intercooled Diesel, 100 HP @ 2800 RPM",
    transmission: "5-Speed Manual Synchromesh",
    deckLength: "10.2 ft Cargo Deck (DSD / High Deck)",
    basePrice: 1340000,
    rtoEstimate: 115000,
    highlights: "Best-in-class mileage for hilly terrain distribution, power steering, rugged leaf springs"
  },
  {
    id: "SML-CAT-02",
    model: "SML Isuzu Sartaj GS HG 72 Cargo Lorry",
    category: "Intermediate Commercial Lorry (4-Wheeler)",
    type: "Lorry",
    gvw: "5,990 kg",
    payload: "3,450 kg",
    engine: "3455 cc SLT4 Common Rail BS6, 110 HP @ 2800 RPM",
    transmission: "5-Speed Heavy Duty Synchromesh",
    deckLength: "12.3 ft High Deck Cargo Body",
    basePrice: 1420000,
    rtoEstimate: 125000,
    highlights: "High ground clearance, heavy-duty front I-beam axle, ideal for plantation & produce haulage"
  },
  {
    id: "SML-CAT-03",
    model: "SML Isuzu Sartaj GS CNG Cargo",
    category: "Eco Clean City Delivery Truck (4-Wheeler)",
    type: "Lorry",
    gvw: "5,800 kg",
    payload: "3,100 kg",
    engine: "3455 cc CNG Turbo BS6, 85 HP @ 2800 RPM",
    transmission: "5-Speed Manual",
    deckLength: "11.5 ft City Freight Body",
    basePrice: 1480000,
    rtoEstimate: 120000,
    highlights: "Clean fuel green transport, lower running cost per km, approved for Nilgiris eco-zones"
  },
  {
    id: "SML-CAT-04",
    model: "SML Isuzu Sartaj 5252 Tipper",
    category: "Compact Construction Dump Tipper (4-Wheeler)",
    type: "Tipper",
    gvw: "5,200 kg",
    payload: "2,600 kg (2.5 CuM Scoop Body)",
    engine: "3455 cc SLT4 Turbocharged Diesel, 100 HP",
    transmission: "5-Speed with PTO Hydraulic Pump",
    deckLength: "2.5 CuM Heavy Gauge Steel Scoop Dump",
    basePrice: 1560000,
    rtoEstimate: 135000,
    highlights: "Under-body hydraulic hoist, high tipping angle, maneuverable in narrow hill roads"
  },
  {
    id: "SML-CAT-05",
    model: "SML Isuzu Prestige GS 6-Wheeler Lorry",
    category: "Intermediate Cargo Lorry (6-Wheeler)",
    type: "Lorry",
    gvw: "7,200 kg",
    payload: "4,450 kg",
    engine: "3455 cc SLT4 Turbo Diesel, 100 HP, 315 Nm Torque",
    transmission: "5-Speed Synchromesh",
    deckLength: "14.3 ft Cargo High Deck / Drop Side",
    basePrice: 1610000,
    rtoEstimate: 140000,
    highlights: "Dual circuit air brakes, semi-elliptical leaf springs with shock absorbers, high reliability"
  },
  {
    id: "SML-CAT-06",
    model: "SML Isuzu Supreme GS 14ft/17ft Lorry",
    category: "Commercial Freight Carrier (6-Wheeler)",
    type: "Lorry",
    gvw: "8,500 kg",
    payload: "5,400 kg",
    engine: "3455 cc SLT4 Intercooled Turbo, 102 HP, 315 Nm",
    transmission: "5-Speed Heavy Duty Synchromesh",
    deckLength: "17.2 ft Extended Deck Body",
    basePrice: 1730000,
    rtoEstimate: 155000,
    highlights: "Full Air S-Cam brakes, heavy front axle, built for inter-district commercial cargo"
  },
  {
    id: "SML-CAT-07",
    model: "SML Isuzu Super GS Commercial Lorry",
    category: "Long Haul Cargo & Container Lorry (6-Wheeler)",
    type: "Lorry",
    gvw: "8,720 kg",
    payload: "5,600 kg",
    engine: "3455 cc SLT4 BS6 Intercooled Diesel, 102 HP",
    transmission: "5-Speed Manual Synchromesh",
    deckLength: "19.0 ft High Deck Freight Body",
    basePrice: 1790000,
    rtoEstimate: 160000,
    highlights: "Long wheelbase, high volumetric load carrying capacity, standard driver sleeper cabin"
  },
  {
    id: "SML-CAT-08",
    model: "SML Isuzu Samrat GS 10.7T Commercial Lorry",
    category: "Heavy Commercial Hauler (6-Wheeler)",
    type: "Lorry",
    gvw: "10,700 kg",
    payload: "7,200 kg",
    engine: "3455 cc SLT4 Turbo BS6, 115 HP @ 2600 RPM, 400 Nm",
    transmission: "6-Speed Overdrive Synchromesh",
    deckLength: "21.6 ft High Cargo Deck / Container",
    basePrice: 1980000,
    rtoEstimate: 175000,
    highlights: "High power-to-weight ratio, 6-speed transmission, exceptional climb on mountain ghats"
  },
  {
    id: "SML-CAT-09",
    model: "SML Isuzu Samrat GS 21ft Container Logistics",
    category: "Closed Corrugated Container Lorry (6-Wheeler)",
    type: "Lorry",
    gvw: "11,100 kg",
    payload: "7,400 kg",
    engine: "3455 cc SLT4 Turbocharged BS6 Common Rail, 115 HP",
    transmission: "6-Speed Manual",
    deckLength: "21.6 ft Corrugated Aluminum Waterproof Container",
    basePrice: 2120000,
    rtoEstimate: 185000,
    highlights: "FMCG, parcel and electronics logistics, weatherproof insulated locking doors"
  },
  {
    id: "SML-CAT-10",
    model: "SML Isuzu Samrat GS Heavy Tipper",
    category: "Heavy Mining & Quarry Tipper (6-Wheeler)",
    type: "Tipper",
    gvw: "10,250 kg",
    payload: "6,500 kg (4.5 CuM Rock Body)",
    engine: "3455 cc SLT4 Heavy Duty Diesel, 115 HP, 400 Nm",
    transmission: "6-Speed Manual with PTO Heavy Pump",
    deckLength: "4.5 CuM Heavy Gauge Rock Body",
    basePrice: 2050000,
    rtoEstimate: 180000,
    highlights: "Heavy-duty hub reduction rear axle, box-type chassis reinforcement, high-lift ram"
  },
  {
    id: "SML-CAT-11",
    model: "SML Isuzu S7 Staff Bus (32+D Seater)",
    category: "Commercial Passenger Staff Bus",
    type: "Bus",
    gvw: "7,490 kg",
    payload: "32 Passengers + Driver + Conductor",
    engine: "3455 cc SLT4 Turbo Diesel, 100 HP",
    transmission: "5-Speed Manual Synchromesh",
    deckLength: "Overall Length 7,995 mm • High Roof AC",
    basePrice: 2350000,
    rtoEstimate: 170000,
    highlights: "Dual AC compressor, high-back cushioned seats, air suspension option, wide gangway"
  },
  {
    id: "SML-CAT-12",
    model: "SML Isuzu S7 Safe School Bus (40+D Seater)",
    category: "School & Institutional Passenger Bus",
    type: "Bus",
    gvw: "7,490 kg",
    payload: "40 Students + Driver + Attendant",
    engine: "3455 cc SLT4 BS6 Diesel, 100 HP",
    transmission: "5-Speed Synchromesh",
    deckLength: "Overall Length 8,820 mm • Low Entry Step",
    basePrice: 2280000,
    rtoEstimate: 165000,
    highlights: "Fully AIS-063 compliant, 40 km/h speed governor, CCTV wiring, stop arm, emergency exit door"
  },
  {
    id: "SML-CAT-13",
    model: "SML Isuzu S7 High Deck Passenger Bus (52-Seater)",
    category: "Intercity Route & Passenger Bus",
    type: "Bus",
    gvw: "9,600 kg",
    payload: "52 High-Back Passenger Seats",
    engine: "3455 cc SLT4 Intercooled Turbo, 115 HP",
    transmission: "6-Speed Synchromesh Gearbox",
    deckLength: "Overall Length 10,200 mm • Luggage Dickey",
    basePrice: 2740000,
    rtoEstimate: 195000,
    highlights: "Full Air S-Cam brakes with ABS, large underfloor luggage space, high panoramic tinted windows"
  },
  {
    id: "SML-CAT-14",
    model: "SML Isuzu Hiroi Luxury Executive Coach (28-Seater)",
    category: "Executive Tourist & Luxury Coach",
    type: "Bus",
    gvw: "7,500 kg",
    payload: "28 Reclining Pushback Seats",
    engine: "Isuzu 4JJ1 Common Rail Intercooled Turbo, 130 HP, 400 Nm",
    transmission: "6-Speed Manual Overdrive",
    deckLength: "Luxury Coach Body with Pneumatic Door",
    basePrice: 2890000,
    rtoEstimate: 210000,
    highlights: "Genuine Isuzu 4JJ1 Japanese powertrain, individual AC vents & USB charging, rear air suspension"
  },
  {
    id: "SML-CAT-15",
    model: "SML Isuzu EcoMax Mini Bus (19+D Seater)",
    category: "Compact Commercial Passenger Feeder Bus",
    type: "Bus",
    gvw: "4,600 kg",
    payload: "19 Passenger Seats",
    engine: "2600 cc SLT3 Turbo Diesel, 85 HP @ 2800 RPM",
    transmission: "5-Speed Synchromesh",
    deckLength: "Compact 5,200 mm City Bus Body",
    basePrice: 1850000,
    rtoEstimate: 130000,
    highlights: "Ultra maneuverable in tight mountain turns, low maintenance cost, outstanding fuel efficiency"
  },
  {
    id: "SML-CAT-16",
    model: "SML Isuzu Sartaj Mobile Healthcare Ambulance",
    category: "Special Application Life Support Unit",
    type: "Special",
    gvw: "5,200 kg",
    payload: "ICU Patient Transport Bed + Medical Team",
    engine: "3455 cc SLT4 BS6 Diesel, 100 HP",
    transmission: "5-Speed Synchromesh",
    deckLength: "Air-Conditioned Mobile Clinic Body",
    basePrice: 1690000,
    rtoEstimate: 120000,
    highlights: "Oxygen manifold, defibrillator mounts, inverter backup power, siren and LED emergency bar"
  }
];

// ============================================================================
// FRESH OPERATIONAL DATA COLLECTIONS (CLEARED FOR PRODUCTION USE)
// ============================================================================
export const initialTrucks = [];
export const initialCustomers = [];
export const initialTasks = [];
export const initialSalesDeals = [];
export const initialInvoices = [];
export const initialExpenses = [];
export const initialTechnicians = [];

// ============================================================================
// AUTHORIZED SINGLE USER LOGIN
// ============================================================================
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

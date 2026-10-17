# Index Motors — Commercial Trucks Dealer & Workshop Management System

A specialized, high-performance web application designed for commercial truck dealerships and heavy-duty vehicle repair workshops.

---

## 🚚 Key Features & Modules

### 🔐 1. Staff Authentication & Role-Based Login
- **Dedicated Staff Portal**: Secure login system with remember-me session persistence.
- **Role-Based Profiles**:
  - 👤 **Rajesh K.** — Dealership Director & General Manager (Full Access)
  - 🚚 **Arun Menon** — Commercial Sales Manager (Vehicle Sales & CRM, Invoices)
  - 🔧 **Ramesh Chandran** — Workshop Foreman (Job Cards, Bay Management, Mechanics)
  - 💼 **Deepa Nair** — Accounts & Billing Executive (Billing, GST Invoices, Payments)
- **1-Click Fast Demo Login**: Quick-switch buttons to instantly test and operate across different staff roles without typing.

### 📈 2. Commercial Vehicle Sales & CRM Module
- **Swaraj Mazda Sales Pipeline**: Track deals across 5 pipeline stages:
  - `New Enquiry / Lead`
  - `Quotation & Proposal Sent`
  - `Financing / Loan Sanction`
  - `Booking Confirmed (Advance Token Paid)`
  - `Delivered / Handover (Closed Won)`
- **Swaraj Mazda Product Lineup Catalog**:
  - *Swaraj Mazda BH Series 32-Seater Passenger Bus* (₹22,80,000)
  - *Swaraj Mazda Super GS Commercial Lorry* (₹16,50,000)
  - *Swaraj Mazda Mini Bus 20-Seater School Bus* (₹18,20,000)
  - *Swaraj Mazda Samrat HD Tipper Lorry* (₹17,80,000)
  - *Swaraj Mazda Sartaj 5252 XM Cargo Truck* (₹13,50,000)
- **Built-in Commercial Vehicle Loan EMI Calculator**: Computes monthly installments across tenure (36, 48, 60 months) with finance partners like Sundaram Finance, SBI, Cholamandalam, and HDFC.
- **1-Click "Convert Deal to Invoice"**: Automatically generates a formal Dealership Truck/Bus Sale Invoice from any confirmed booking or quotation!

### 3. Operations Dashboard & Workshop Bays Monitor

### 2. Workshop Job Cards & Task Manager
- **Dual Visual Modes**: Toggle between an interactive **Kanban Board** (Pending → In Progress → Awaiting Parts → Ready for Pickup) and a **Searchable Data Table**.
- **Commercial Truck Specifications**: Track VIN / Chassis number, license plate, odometer reading, and customer fleet accounts.
- **Safety & Inspection Checklists**: Multi-point interactive inspection checklists with real-time completion progress tracking.
- **Spare Parts & Materials Tracking**: Allocate OEM and aftermarket parts with part numbers, quantities, and pricing.
- **Direct Invoice Generation**: 1-click conversion from completed or active Job Cards into an itemized commercial invoice (transfers parts and labor automatically).

### 3. Commercial Invoices & Billing
- **Multiple Invoice Types**:
  - Workshop Service & Repairs
  - Commercial Truck Sales (Dealership Showroom)
  - Parts Counter Sales
- **Automatic Accounting Engine**: Dynamic line-item calculation (Labor, Parts, Vehicles, Surcharges), fleet discounts, sales tax / VAT, and balance due tracking.
- **Printable & PDF-Ready Layout**: Official dealership invoice format complete with Index Motors header, vehicle specifications banner, payment remittance bank details, warranty clauses, and signature/stamp boxes.
- **Payment Settlements**: Record partial or full payments with wire transfer, cheque, credit card, and cash tracking.

### 4. Trucks & Fleet Inventory
- **Dual Registry**: Track both **Dealership Sales Stock** (For Sale, Reserved, Sold) and **Customer Fleet Vehicles** (Active in Workshop).
- Complete technical specifications: Engine horsepower, transmission, axle configurations (6x4, 6x2, 8x4), VIN, and mileage.

### 5. Fleet Customers & Accounts
- Track corporate logistics fleets, freight carriers, and bulk haulers.
- View credit limits, total spent, registered fleet sizes, and live receivable balances.

### 6. Workshop Technicians & Mechanics
- Lead diesel mechanics, electrical specialists, and PDI foremen with contact details and active bay assignments.

### 7. Settings, Configuration & Data Portability
- Customize dealership profile, hourly labor rate ($110/hr default), tax rate, currency symbol, and remittance bank details.
- **1-Click JSON Backup & Restore**: Export complete database or restore anytime.
- **Reset Demo Data**: Restore initial authentic dataset anytime.

---

## 🚀 How to Run

1. Open PowerShell or Terminal in the project directory:
   ```bash
   cd C:\Users\user\.gemini\antigravity\scratch\index-motors-manager
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   Or double-click `start.bat` on Windows.
3. Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🛠 Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: LocalStorage with automatic fallback and schema migration

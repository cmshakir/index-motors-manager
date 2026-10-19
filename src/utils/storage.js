import {
  initialCompanyProfile,
  initialTechnicians,
  initialCustomers,
  initialTrucks,
  initialTasks,
  initialInvoices,
  initialUsers,
  initialSalesDeals,
  initialExpenses
} from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'index_motors_online_v3_profile',
  TECHNICIANS: 'index_motors_online_v3_technicians',
  CUSTOMERS: 'index_motors_online_v3_customers',
  TRUCKS: 'index_motors_online_v3_trucks',
  TASKS: 'index_motors_online_v3_tasks',
  INVOICES: 'index_motors_online_v3_invoices',
  SALES: 'index_motors_online_v3_sales',
  EXPENSES: 'index_motors_online_v3_expenses',
  USERS: 'index_motors_online_v3_users',
  CURRENT_USER: 'index_motors_online_v3_current_user',
};

export const loadFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
};

export const getInitialAppState = () => {
  return {
    profile: loadFromStorage(STORAGE_KEYS.PROFILE, initialCompanyProfile),
    technicians: loadFromStorage(STORAGE_KEYS.TECHNICIANS, initialTechnicians),
    customers: loadFromStorage(STORAGE_KEYS.CUSTOMERS, initialCustomers),
    trucks: loadFromStorage(STORAGE_KEYS.TRUCKS, initialTrucks),
    tasks: loadFromStorage(STORAGE_KEYS.TASKS, initialTasks),
    invoices: loadFromStorage(STORAGE_KEYS.INVOICES, initialInvoices),
    sales: loadFromStorage(STORAGE_KEYS.SALES, initialSalesDeals),
    expenses: loadFromStorage(STORAGE_KEYS.EXPENSES, initialExpenses),
    users: loadFromStorage(STORAGE_KEYS.USERS, initialUsers),
    currentUser: null, // Always show login window when opening link
  };
};

export const resetToDefaults = () => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialCompanyProfile));
  localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(initialTechnicians));
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(initialCustomers));
  localStorage.setItem(STORAGE_KEYS.TRUCKS, JSON.stringify(initialTrucks));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(initialInvoices));
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(initialSalesDeals));
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(initialExpenses));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  return getInitialAppState();
};

export const exportAllDataJSON = () => {
  const data = getInitialAppState();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `index-motors-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importAllDataJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.profile) saveToStorage(STORAGE_KEYS.PROFILE, parsed.profile);
    if (parsed.technicians) saveToStorage(STORAGE_KEYS.TECHNICIANS, parsed.technicians);
    if (parsed.customers) saveToStorage(STORAGE_KEYS.CUSTOMERS, parsed.customers);
    if (parsed.trucks) saveToStorage(STORAGE_KEYS.TRUCKS, parsed.trucks);
    if (parsed.tasks) saveToStorage(STORAGE_KEYS.TASKS, parsed.tasks);
    if (parsed.invoices) saveToStorage(STORAGE_KEYS.INVOICES, parsed.invoices);
    if (parsed.sales) saveToStorage(STORAGE_KEYS.SALES, parsed.sales);
    if (parsed.expenses) saveToStorage(STORAGE_KEYS.EXPENSES, parsed.expenses);
    if (parsed.users) saveToStorage(STORAGE_KEYS.USERS, parsed.users);
    return { success: true, state: getInitialAppState() };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export { STORAGE_KEYS };

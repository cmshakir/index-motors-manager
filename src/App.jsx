import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard/Dashboard';
import TaskManager from './components/Tasks/TaskManager';
import TaskModal from './components/Tasks/TaskModal';
import TaskDetailsModal from './components/Tasks/TaskDetailsModal';
import InvoiceManager from './components/Invoices/InvoiceManager';
import InvoiceModal from './components/Invoices/InvoiceModal';
import InvoicePrintModal from './components/Invoices/InvoicePrintModal';
import RecordPaymentModal from './components/Invoices/RecordPaymentModal';
import TruckManager from './components/Trucks/TruckManager';
import TruckModal from './components/Trucks/TruckModal';
import CustomerManager from './components/Customers/CustomerManager';
import TechniciansView from './components/Dashboard/TechniciansView';
import SettingsModal from './components/Settings/SettingsModal';
import SalesManager from './components/Sales/SalesManager';
import DealModal from './components/Sales/DealModal';
import ExpenseManager from './components/Expenses/ExpenseManager';
import ExpenseModal from './components/Expenses/ExpenseModal';
import LoginScreen from './components/Auth/LoginScreen';
import CloudConnectModal from './components/Cloud/CloudConnectModal';

import { 
  getInitialAppState, 
  saveToStorage, 
  STORAGE_KEYS 
} from './utils/storage';
import { 
  isSupabaseConfigured, 
  fetchCloudTable, 
  upsertCloudRecord, 
  deleteCloudRecord,
  subscribeToCloudChanges,
  seedCloudIfEmpty
} from './utils/supabaseClient';
import { 
  LayoutDashboard, 
  Wrench, 
  FileText, 
  Truck, 
  Users, 
  UserCheck,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Database,
  X
} from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState(() => getInitialAppState());
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('index_motors_session_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Shakir CM' || !parsed.name) {
          parsed.name = 'Index Motor';
          parsed.avatar = 'IM';
          sessionStorage.setItem('index_motors_session_user', JSON.stringify(parsed));
        }
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const [prefilledTaskForInvoice, setPrefilledTaskForInvoice] = useState(null);

  const [isInvoicePrintOpen, setIsInvoicePrintOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [invoiceForPayment, setInvoiceForPayment] = useState(null);

  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
  const [truckToEdit, setTruckToEdit] = useState(null);

  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseModalType, setExpenseModalType] = useState('expense');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [cloudNotice, setCloudNotice] = useState(null);

  useEffect(() => {
    if (!cloudNotice) return;
    const timer = setTimeout(() => setCloudNotice(null), 4500);
    return () => clearTimeout(timer);
  }, [cloudNotice]);

  const syncRecordToCloud = async (tableName, id, data) => {
    if (!isSupabaseConfigured()) {
      setCloudNotice({
        type: 'local',
        title: 'Saved Locally on this Device',
        desc: 'Database is not connected on this device. Click here to connect Supabase and sync.'
      });
      return;
    }

    const res = await upsertCloudRecord(tableName, id, data);
    if (res?.success) {
      setCloudNotice({
        type: 'success',
        title: 'Saved to Supabase Cloud Database',
        desc: `${tableName.toUpperCase()} record synced across all devices.`
      });
    } else {
      setCloudNotice({
        type: 'error',
        title: `Cloud Database Save Error (${tableName})`,
        desc: res?.error || 'Database rejected the record. Click to check SQL tables.'
      });
    }
  };

  // Sync to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TASKS, appState.tasks);
  }, [appState.tasks]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INVOICES, appState.invoices);
  }, [appState.invoices]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TRUCKS, appState.trucks);
  }, [appState.trucks]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CUSTOMERS, appState.customers);
  }, [appState.customers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TECHNICIANS, appState.technicians);
  }, [appState.technicians]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SALES, appState.sales);
  }, [appState.sales]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EXPENSES, appState.expenses);
  }, [appState.expenses]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USERS, appState.users);
  }, [appState.users]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROFILE, appState.profile);
  }, [appState.profile]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
  }, [currentUser]);

  // Manual & automatic cloud sync function
  const refreshFromCloud = async () => {
    if (!isSupabaseConfigured()) return;
    setIsSyncing(true);
    try {
      // Auto-seed cloud database if tables are empty
      await seedCloudIfEmpty(appState);

      const [cloudTasks, cloudInvoices, cloudSales, cloudExpenses, cloudTrucks, cloudCustomers, cloudTechs, cloudUsers] = await Promise.all([
        fetchCloudTable('tasks'),
        fetchCloudTable('invoices'),
        fetchCloudTable('sales'),
        fetchCloudTable('expenses'),
        fetchCloudTable('trucks'),
        fetchCloudTable('customers'),
        fetchCloudTable('technicians'),
        fetchCloudTable('users')
      ]);

      setAppState(prev => ({
        ...prev,
        tasks: Array.isArray(cloudTasks) ? cloudTasks : prev.tasks,
        invoices: Array.isArray(cloudInvoices) ? cloudInvoices : prev.invoices,
        sales: Array.isArray(cloudSales) ? cloudSales : prev.sales,
        expenses: Array.isArray(cloudExpenses) ? cloudExpenses : prev.expenses,
        trucks: Array.isArray(cloudTrucks) ? cloudTrucks : prev.trucks,
        customers: Array.isArray(cloudCustomers) ? cloudCustomers : prev.customers,
        technicians: Array.isArray(cloudTechs) ? cloudTechs : prev.technicians,
        users: Array.isArray(cloudUsers) ? cloudUsers : prev.users,
      }));

      if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
        setCurrentUser(prevUser => {
          if (!prevUser) return null;
          const matched = cloudUsers.find(u => u.id === prevUser.id || u.username === prevUser.username);
          if (matched) {
            sessionStorage.setItem('index_motors_session_user', JSON.stringify(matched));
            return matched;
          }
          return prevUser;
        });
      }
    } catch (e) {
      console.warn('Cloud sync error:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Background Cloud Database Synchronization + Realtime WebSocket listener
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Initial fetch from cloud
    refreshFromCloud();

    // Subscribe to realtime changes from any other device
    const unsubscribe = subscribeToCloudChanges((payload) => {
      const { table, eventType, new: newRecord, old: oldRecord } = payload;
      const unwrapData = (r) => (r?.data ? { ...r.data, id: r.id } : r);

      setAppState(prev => {
        const tableKey = table;
        if (!prev[tableKey] || !Array.isArray(prev[tableKey])) return prev;

        const currentList = prev[tableKey];
        if (eventType === 'INSERT') {
          const item = unwrapData(newRecord);
          if (currentList.some(i => i.id === item.id)) {
            return {
              ...prev,
              [tableKey]: currentList.map(i => i.id === item.id ? item : i)
            };
          }
          return {
            ...prev,
            [tableKey]: [item, ...currentList]
          };
        } else if (eventType === 'UPDATE') {
          const item = unwrapData(newRecord);
          return {
            ...prev,
            [tableKey]: currentList.map(i => i.id === item.id ? item : i)
          };
        } else if (eventType === 'DELETE') {
          return {
            ...prev,
            [tableKey]: currentList.filter(i => i.id !== oldRecord?.id)
          };
        }
        return prev;
      });
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Auth Handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      sessionStorage.setItem('index_motors_session_user', JSON.stringify(user));
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem('index_motors_session_user');
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (e) {
      // ignore
    }
  };

  // Task Handlers
  const handleSaveTask = (taskData) => {
    setAppState(prev => {
      const exists = prev.tasks.some(t => t.id === taskData.id);
      const updatedTasks = exists
        ? prev.tasks.map(t => t.id === taskData.id ? taskData : t)
        : [taskData, ...prev.tasks];
      return { ...prev, tasks: updatedTasks };
    });
    syncRecordToCloud('tasks', taskData.id, taskData);
    if (selectedTask && selectedTask.id === taskData.id) {
      setSelectedTask(taskData);
    }
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this workshop job card?')) {
      setAppState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId)
      }));
      deleteCloudRecord('tasks', taskId);
      if (selectedTask?.id === taskId) {
        setIsTaskDetailsOpen(false);
      }
    }
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    let updated = null;
    setAppState(prev => {
      const updatedTasks = prev.tasks.map(t => {
        if (t.id === taskId) {
          updated = { ...t, status: newStatus };
          return updated;
        }
        return t;
      });
      return { ...prev, tasks: updatedTasks };
    });
    if (updated) {
      syncRecordToCloud('tasks', taskId, updated);
    }
  };

  const handleToggleChecklistItem = (taskId, itemIdx) => {
    let updatedTask = null;
    setAppState(prev => {
      const updatedTasks = prev.tasks.map(task => {
        if (task.id !== taskId || !task.checklist) return task;
        const newChecklist = [...task.checklist];
        if (newChecklist[itemIdx]) {
          newChecklist[itemIdx] = {
            ...newChecklist[itemIdx],
            completed: !newChecklist[itemIdx].completed
          };
        }
        updatedTask = { ...task, checklist: newChecklist };
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(updatedTask);
        }
        return updatedTask;
      });
      return { ...prev, tasks: updatedTasks };
    });
    if (updatedTask) {
      syncRecordToCloud('tasks', taskId, updatedTask);
    }
  };

  // Convert Job Card to Invoice
  const handleGenerateInvoiceFromTask = (task) => {
    setInvoiceToEdit(null);
    setPrefilledTaskForInvoice(task);
    setIsInvoiceModalOpen(true);
  };

  // Sales Deal Handlers
  const handleSaveDeal = (dealData) => {
    setAppState(prev => {
      const exists = prev.sales.some(d => d.id === dealData.id);
      const updated = exists
        ? prev.sales.map(d => d.id === dealData.id ? dealData : d)
        : [dealData, ...prev.sales];
      return { ...prev, sales: updated };
    });
    syncRecordToCloud('sales', dealData.id, dealData);
  };

  const handleDeleteDeal = (dealId) => {
    if (window.confirm('Are you sure you want to delete this sales opportunity?')) {
      setAppState(prev => ({
        ...prev,
        sales: prev.sales.filter(d => d.id !== dealId)
      }));
      deleteCloudRecord('sales', dealId);
    }
  };

  // Expenditure Handlers
  const handleSaveExpense = (expenseData) => {
    setAppState(prev => {
      const exists = prev.expenses?.some(e => e.id === expenseData.id);
      const updatedExpenses = exists
        ? prev.expenses.map(e => e.id === expenseData.id ? expenseData : e)
        : [expenseData, ...(prev.expenses || [])];
      return { ...prev, expenses: updatedExpenses };
    });
    syncRecordToCloud('expenses', expenseData.id, expenseData);
  };

  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this income/expense record?')) {
      setAppState(prev => ({
        ...prev,
        expenses: (prev.expenses || []).filter(e => e.id !== expenseId)
      }));
      deleteCloudRecord('expenses', expenseId);
    }
  };

  const handleOpenNewIncome = () => {
    setExpenseToEdit(null);
    setExpenseModalType('income');
    setIsExpenseModalOpen(true);
  };

  const handleOpenNewExpense = () => {
    setExpenseToEdit(null);
    setExpenseModalType('expense');
    setIsExpenseModalOpen(true);
  };

  const handleUpdateDealStage = (dealId, newStage) => {
    let updatedDeal = null;
    setAppState(prev => {
      const updatedSales = prev.sales.map(d => {
        if (d.id === dealId) {
          updatedDeal = { ...d, stage: newStage };
          return updatedDeal;
        }
        return d;
      });
      return { ...prev, sales: updatedSales };
    });
    if (updatedDeal) {
      syncRecordToCloud('sales', dealId, updatedDeal);
    }
  };

  // Convert Sales Deal to Dealership Truck Sale Invoice!
  const handleConvertDealToInvoice = (deal) => {
    const saleInvoiceData = {
      id: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Truck Sale (Dealership)',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      paymentTerms: 'Advance Deposit & Handover Balance',
      status: deal.downpaymentReceived > 0 ? 'Partially Paid' : 'Pending',
      customerId: deal.customerId || '',
      customerName: deal.customerName,
      customerEmail: deal.email || '',
      customerPhone: deal.phone || '',
      billingAddress: deal.address || 'Pallipadi, Gudallur',
      taxId: '',
      truckId: '',
      truckDetails: `${deal.vehicleModel} (${deal.unitCount} Unit${deal.unitCount > 1 ? 's' : ''})`,
      mileage: 45,
      jobCardId: deal.id,
      items: [
        {
          id: `item-v-${Date.now()}`,
          type: 'Vehicle',
          description: `Commercial Vehicle: ${deal.unitCount}x ${deal.vehicleModel}`,
          qty: deal.unitCount,
          unitPrice: deal.unitPrice,
          taxPercent: 18.0,
          total: deal.unitCount * deal.unitPrice
        },
        {
          id: `item-rto-${Date.now()}`,
          type: 'Service',
          description: `RTO Road Tax, Commercial Vehicle Insurance & State Transport Registration`,
          qty: 1,
          unitPrice: deal.rtoAndInsurance,
          taxPercent: 18.0,
          total: deal.rtoAndInsurance
        }
      ],
      discountPercent: 0,
      discountAmount: 0,
      paidAmount: Number(deal.downpaymentReceived) || 0,
      paymentMethod: 'Bank Transfer (NEFT/RTGS)',
      notes: `Dealership Commercial Vehicle Contract #${deal.id}. Financed through ${deal.financePartner}.`,
      paymentHistory: deal.downpaymentReceived > 0 ? [
        {
          id: `pay-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          amount: Number(deal.downpaymentReceived),
          method: 'Advance Booking Token Deposit',
          reference: 'BOOKING-DEP',
          note: 'Advance Token for Commercial Vehicle Order'
        }
      ] : []
    };

    setInvoiceToEdit(saleInvoiceData);
    setPrefilledTaskForInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  // Invoice Handlers
  const handleSaveInvoice = (invoiceData) => {
    setAppState(prev => {
      const exists = prev.invoices.some(i => i.id === invoiceData.id);
      const updatedInvoices = exists
        ? prev.invoices.map(i => i.id === invoiceData.id ? invoiceData : i)
        : [invoiceData, ...prev.invoices];

      // If invoice was generated from a job card, link it to the task!
      let updatedTasks = prev.tasks;
      if (invoiceData.jobCardId && invoiceData.jobCardId.startsWith('JOB')) {
        updatedTasks = prev.tasks.map(t => 
          t.id === invoiceData.jobCardId ? { ...t, invoiceId: invoiceData.invoiceNumber } : t
        );
      }

      // If invoice was generated from a sales deal, mark deal as Delivered / Handover!
      let updatedSales = prev.sales;
      if (invoiceData.jobCardId && invoiceData.jobCardId.startsWith('DEAL')) {
        updatedSales = prev.sales.map(d => 
          d.id === invoiceData.jobCardId ? { ...d, stage: 'Delivered / Handover' } : d
        );
      }

      return {
        ...prev,
        invoices: updatedInvoices,
        tasks: updatedTasks,
        sales: updatedSales
      };
    });
    syncRecordToCloud('invoices', invoiceData.id, invoiceData);
    setPrefilledTaskForInvoice(null);
    if (selectedInvoice && selectedInvoice.id === invoiceData.id) {
      setSelectedInvoice(invoiceData);
    }
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setAppState(prev => ({
        ...prev,
        invoices: prev.invoices.filter(i => i.id !== invoiceId)
      }));
      deleteCloudRecord('invoices', invoiceId);
      if (selectedInvoice?.id === invoiceId) {
        setIsInvoicePrintOpen(false);
      }
    }
  };

  const handleRecordPayment = (invoiceId, paymentRecord) => {
    let updatedInv = null;
    setAppState(prev => {
      const updatedInvoices = prev.invoices.map(inv => {
        if (inv.id !== invoiceId) return inv;
        const newPaidAmount = (Number(inv.paidAmount) || 0) + paymentRecord.amount;
        const newBalance = Math.max(0, inv.totalAmount - newPaidAmount);
        let newStatus = inv.status;
        if (newBalance <= 0) {
          newStatus = 'Paid';
        } else if (newPaidAmount > 0) {
          newStatus = 'Partially Paid';
        }

        const history = inv.paymentHistory ? [...inv.paymentHistory, paymentRecord] : [paymentRecord];

        updatedInv = {
          ...inv,
          paidAmount: newPaidAmount,
          balanceDue: newBalance,
          status: newStatus,
          paymentHistory: history
        };
        return updatedInv;
      });

      return { ...prev, invoices: updatedInvoices };
    });
    if (updatedInv) {
      syncRecordToCloud('invoices', invoiceId, updatedInv);
    }
  };

  // Truck Handlers
  const handleSaveTruck = (truckData) => {
    setAppState(prev => {
      const exists = prev.trucks.some(t => t.id === truckData.id);
      const updatedTrucks = exists
        ? prev.trucks.map(t => t.id === truckData.id ? truckData : t)
        : [truckData, ...prev.trucks];
      return { ...prev, trucks: updatedTrucks };
    });
    syncRecordToCloud('trucks', truckData.id, truckData);
  };

  const handleDeleteTruck = (truckId) => {
    if (window.confirm('Are you sure you want to remove this truck from inventory?')) {
      setAppState(prev => ({
        ...prev,
        trucks: prev.trucks.filter(t => t.id !== truckId)
      }));
      deleteCloudRecord('trucks', truckId);
    }
  };

  const handleCreateJobForTruck = (truck) => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleCreateInvoiceForTruck = (truck) => {
    setInvoiceToEdit(null);
    setPrefilledTaskForInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  // Customer Handlers
  const handleSaveCustomer = (customerData) => {
    setAppState(prev => {
      const exists = prev.customers.some(c => c.id === customerData.id);
      const updated = exists
        ? prev.customers.map(c => c.id === customerData.id ? customerData : c)
        : [customerData, ...prev.customers];
      return { ...prev, customers: updated };
    });
    syncRecordToCloud('customers', customerData.id, customerData);
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer account?')) {
      setAppState(prev => ({
        ...prev,
        customers: prev.customers.filter(c => c.id !== customerId)
      }));
      deleteCloudRecord('customers', customerId);
    }
  };

  const handleCreateJobForCustomer = (customer) => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleCreateInvoiceForCustomer = (customer) => {
    setInvoiceToEdit(null);
    setPrefilledTaskForInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  // Technician Handlers
  const handleSaveTechnician = (techData) => {
    setAppState(prev => {
      const exists = prev.technicians.some(t => t.id === techData.id);
      const updated = exists
        ? prev.technicians.map(t => t.id === techData.id ? techData : t)
        : [techData, ...prev.technicians];
      return { ...prev, technicians: updated };
    });
    syncRecordToCloud('technicians', techData.id, techData);
  };

  const handleDeleteTechnician = (techId) => {
    if (window.confirm('Remove technician record?')) {
      setAppState(prev => ({
        ...prev,
        technicians: prev.technicians.filter(t => t.id !== techId)
      }));
      deleteCloudRecord('technicians', techId);
    }
  };

  // Check Authentication State
  if (!currentUser) {
    return (
      <LoginScreen
        users={appState.users}
        profile={appState.profile}
        onLogin={handleLogin}
      />
    );
  }

  // Stats for Header
  const activeTasksCount = appState.tasks.filter(t => t.status !== 'Completed' && t.status !== 'Ready for Pickup').length;
  const pendingInvoicesAmount = appState.invoices
    .filter(i => i.status === 'Pending' || i.status === 'Partially Paid' || i.status === 'Overdue')
    .reduce((sum, i) => sum + (Number(i.balanceDue) || 0), 0);
  const totalRevenueCollected = appState.invoices
    .reduce((sum, i) => sum + (Number(i.paidAmount) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Main Navigation Header */}
      <Header
        profile={appState.profile}
        currentUser={currentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        isSyncing={isSyncing}
        onRefreshCloud={refreshFromCloud}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        stats={{
          activeTasksCount,
          pendingInvoicesAmount,
          isCloudConnected: isSupabaseConfigured()
        }}
        onNewSale={() => {
          setDealToEdit(null);
          setIsDealModalOpen(true);
        }}
        onNewTask={() => {
          setTaskToEdit(null);
          setIsTaskModalOpen(true);
        }}
        onNewInvoice={() => {
          setInvoiceToEdit(null);
          setPrefilledTaskForInvoice(null);
          setIsInvoiceModalOpen(true);
        }}
        onNewTruck={() => {
          setTruckToEdit(null);
          setIsTruckModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Body Layout with Sidebar + View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          salesCount={appState.sales?.length || 0}
          tasksCount={appState.tasks?.length || 0}
          invoicesCount={appState.invoices?.length || 0}
          expensesCount={appState.expenses?.length || 0}
          trucksCount={appState.trucks?.length || 0}
          customersCount={appState.customers?.length || 0}
          currency={appState.profile.currency}
          totalRevenue={totalRevenueCollected}
        />

        {/* Dynamic Main Workspace Tab */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard
                profile={appState.profile}
                tasks={appState.tasks}
                invoices={appState.invoices}
                expenses={appState.expenses || []}
                trucks={appState.trucks}
                customers={appState.customers}
                technicians={appState.technicians}
                onSelectTask={(task) => {
                  setSelectedTask(task);
                  setIsTaskDetailsOpen(true);
                }}
                onSelectInvoice={(inv) => {
                  setSelectedInvoice(inv);
                  setIsInvoicePrintOpen(true);
                }}
                onNewTask={() => {
                  setTaskToEdit(null);
                  setIsTaskModalOpen(true);
                }}
                onNewInvoice={() => {
                  setInvoiceToEdit(null);
                  setPrefilledTaskForInvoice(null);
                  setIsInvoiceModalOpen(true);
                }}
                onNewIncome={handleOpenNewIncome}
                onNewExpense={handleOpenNewExpense}
                onNavigateTab={setActiveTab}
                onGenerateInvoiceFromTask={handleGenerateInvoiceFromTask}
              />
            )}

            {activeTab === 'sales' && (
              <SalesManager
                profile={appState.profile}
                sales={appState.sales}
                customers={appState.customers}
                trucks={appState.trucks}
                onSaveDeal={handleSaveDeal}
                onDeleteDeal={handleDeleteDeal}
                onUpdateDealStage={handleUpdateDealStage}
                onConvertDealToInvoice={handleConvertDealToInvoice}
                onNewTask={handleOpenNewTask}
              />
            )}

            {activeTab === 'tasks' && (
              <TaskManager
                profile={appState.profile}
                tasks={appState.tasks}
                onNewTask={() => {
                  setTaskToEdit(null);
                  setIsTaskModalOpen(true);
                }}
                onEditTask={(task) => {
                  setTaskToEdit(task);
                  setIsTaskModalOpen(true);
                }}
                onViewTask={(task) => {
                  setSelectedTask(task);
                  setIsTaskDetailsOpen(true);
                }}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onGenerateInvoiceFromTask={handleGenerateInvoiceFromTask}
              />
            )}

            {activeTab === 'invoices' && (
              <InvoiceManager
                profile={appState.profile}
                invoices={appState.invoices}
                onNewInvoice={() => {
                  setInvoiceToEdit(null);
                  setPrefilledTaskForInvoice(null);
                  setIsInvoiceModalOpen(true);
                }}
                onEditInvoice={(inv) => {
                  setInvoiceToEdit(inv);
                  setIsInvoiceModalOpen(true);
                }}
                onViewInvoice={(inv) => {
                  setSelectedInvoice(inv);
                  setIsInvoicePrintOpen(true);
                }}
                onDeleteInvoice={handleDeleteInvoice}
                onRecordPayment={(inv) => {
                  setInvoiceForPayment(inv);
                  setIsRecordPaymentOpen(true);
                }}
              />
            )}

            {activeTab === 'expenses' && (
              <ExpenseManager
                expenses={appState.expenses || []}
                invoices={appState.invoices || []}
                currency={appState.profile.currency}
                onNewExpense={handleOpenNewExpense}
                onNewIncome={handleOpenNewIncome}
                onEditExpense={(exp) => {
                  setExpenseToEdit(exp);
                  setExpenseModalType(exp.type || 'expense');
                  setIsExpenseModalOpen(true);
                }}
                onDeleteExpense={handleDeleteExpense}
              />
            )}

            {activeTab === 'trucks' && (
              <TruckManager
                profile={appState.profile}
                trucks={appState.trucks}
                onNewTruck={() => {
                  setTruckToEdit(null);
                  setIsTruckModalOpen(true);
                }}
                onEditTruck={(trk) => {
                  setTruckToEdit(trk);
                  setIsTruckModalOpen(true);
                }}
                onDeleteTruck={handleDeleteTruck}
                onCreateJobForTruck={handleCreateJobForTruck}
                onCreateInvoiceForTruck={handleCreateInvoiceForTruck}
              />
            )}

            {activeTab === 'customers' && (
              <CustomerManager
                profile={appState.profile}
                customers={appState.customers}
                trucks={appState.trucks}
                invoices={appState.invoices}
                onSaveCustomer={handleSaveCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                onCreateJobForCustomer={handleCreateJobForCustomer}
                onCreateInvoiceForCustomer={handleCreateInvoiceForCustomer}
              />
            )}

            {activeTab === 'technicians' && (
              <TechniciansView
                technicians={appState.technicians}
                tasks={appState.tasks}
                onSaveTechnician={handleSaveTechnician}
                onDeleteTechnician={handleDeleteTechnician}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="no-print md:hidden bg-slate-900 border-t border-slate-800 sticky bottom-0 z-40 px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-bold ${
            activeTab === 'dashboard' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="h-5 w-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('sales')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-bold ${
            activeTab === 'sales' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <TrendingUp className="h-5 w-5 mb-0.5" />
          <span>Sales</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-bold ${
            activeTab === 'tasks' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Wrench className="h-5 w-5 mb-0.5" />
          <span>Jobs</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-bold ${
            activeTab === 'invoices' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <FileText className="h-5 w-5 mb-0.5" />
          <span>Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab('trucks')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-bold ${
            activeTab === 'trucks' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Truck className="h-5 w-5 mb-0.5" />
          <span>Trucks</span>
        </button>
      </nav>

      {/* MODALS */}
      {/* 1. Sales Deal Modal */}
      <DealModal
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
        onSave={handleSaveDeal}
        dealToEdit={dealToEdit}
        customers={appState.customers}
        profile={appState.profile}
      />

      {/* 2. Create / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        trucks={appState.trucks}
        customers={appState.customers}
        technicians={appState.technicians}
        profile={appState.profile}
      />

      {/* 3. Detailed Job Card Modal */}
      <TaskDetailsModal
        isOpen={isTaskDetailsOpen}
        onClose={() => setIsTaskDetailsOpen(false)}
        task={selectedTask}
        profile={appState.profile}
        onEdit={(task) => {
          setTaskToEdit(task);
          setIsTaskModalOpen(true);
        }}
        onToggleChecklistItem={handleToggleChecklistItem}
        onGenerateInvoice={handleGenerateInvoiceFromTask}
      />

      {/* 4. Create / Edit Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
        invoiceToEdit={invoiceToEdit}
        prefilledTask={prefilledTaskForInvoice}
        trucks={appState.trucks}
        customers={appState.customers}
        profile={appState.profile}
      />

      {/* 5. Official Printable & PDF Invoice Modal */}
      <InvoicePrintModal
        isOpen={isInvoicePrintOpen}
        onClose={() => setIsInvoicePrintOpen(false)}
        invoice={selectedInvoice}
        profile={appState.profile}
        onRecordPayment={(inv) => {
          setInvoiceForPayment(inv);
          setIsRecordPaymentOpen(true);
        }}
      />

      {/* 6. Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        invoice={invoiceForPayment}
        profile={appState.profile}
        onSavePayment={handleRecordPayment}
      />

      {/* 7. Register / Edit Truck Modal */}
      <TruckModal
        isOpen={isTruckModalOpen}
        onClose={() => setIsTruckModalOpen(false)}
        onSave={handleSaveTruck}
        truckToEdit={truckToEdit}
        customers={appState.customers}
      />

      {/* 8. Settings & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={appState.profile}
        isCloudConnected={isSupabaseConfigured()}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        onSaveProfile={(updatedProfile) => {
          setAppState(prev => ({ ...prev, profile: updatedProfile }));
          syncRecordToCloud('profile', 'main', updatedProfile);
        }}
        onResetData={(resetState) => {
          setAppState(resetState);
        }}
      />

      {/* 9. Mobile Bottom Navigation Bar & Drawer */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        salesCount={appState.sales?.length || 0}
        tasksCount={appState.tasks?.length || 0}
        invoicesCount={appState.invoices?.length || 0}
        expensesCount={appState.expenses?.length || 0}
        trucksCount={appState.trucks?.length || 0}
        customersCount={appState.customers?.length || 0}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        onLogout={handleLogout}
        currentUser={currentUser}
        isCloudConnected={isSupabaseConfigured()}
        isSyncing={isSyncing}
        onRefreshCloud={refreshFromCloud}
      />

      {/* 10. Multi-Device Cloud Database Setup Modal */}
      <CloudConnectModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        isCloudConnected={isSupabaseConfigured()}
        onConnected={refreshFromCloud}
      />

      {/* 11. Record / Edit Expenditure Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        expenseToEdit={expenseToEdit}
        defaultType={expenseModalType}
        currency={appState.profile.currency}
        currentUser={currentUser}
        tasks={appState.tasks}
      />

      {/* Floating Cloud Sync Notification Toast */}
      {cloudNotice && (
        <div 
          onClick={() => {
            if (cloudNotice.type !== 'success') {
              setIsCloudModalOpen(true);
            }
          }}
          className={`fixed top-20 right-4 z-50 max-w-sm p-3.5 rounded-xl border shadow-2xl transition-all transform animate-fade-in flex items-start space-x-3 cursor-pointer ${
            cloudNotice.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200'
              : cloudNotice.type === 'error'
              ? 'bg-rose-950/95 border-rose-500/50 text-rose-200'
              : 'bg-amber-950/95 border-amber-500/40 text-amber-200'
          }`}
          title={cloudNotice.type !== 'success' ? 'Click to open Database Setup' : ''}
        >
          <div className="mt-0.5 flex-shrink-0">
            {cloudNotice.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : cloudNotice.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-rose-400" />
            ) : (
              <Database className="h-4 w-4 text-amber-400" />
            )}
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold">{cloudNotice.title}</p>
            <p className="opacity-90 mt-0.5 text-[11px] leading-snug">{cloudNotice.desc}</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setCloudNotice(null);
            }} 
            className="text-slate-400 hover:text-white ml-1 flex-shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}

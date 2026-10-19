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
import LoginScreen from './components/Auth/LoginScreen';

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
  TrendingUp 
} from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState(() => getInitialAppState());
  const [currentUser, setCurrentUser] = useState(() => appState.currentUser || appState.users[0]);
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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

      const [cloudTasks, cloudInvoices, cloudSales, cloudTrucks, cloudCustomers, cloudTechs, cloudUsers] = await Promise.all([
        fetchCloudTable('tasks'),
        fetchCloudTable('invoices'),
        fetchCloudTable('sales'),
        fetchCloudTable('trucks'),
        fetchCloudTable('customers'),
        fetchCloudTable('technicians'),
        fetchCloudTable('users')
      ]);

      setAppState(prev => ({
        ...prev,
        tasks: (cloudTasks && cloudTasks.length > 0) ? cloudTasks : prev.tasks,
        invoices: (cloudInvoices && cloudInvoices.length > 0) ? cloudInvoices : prev.invoices,
        sales: (cloudSales && cloudSales.length > 0) ? cloudSales : prev.sales,
        trucks: (cloudTrucks && cloudTrucks.length > 0) ? cloudTrucks : prev.trucks,
        customers: (cloudCustomers && cloudCustomers.length > 0) ? cloudCustomers : prev.customers,
        technicians: (cloudTechs && cloudTechs.length > 0) ? cloudTechs : prev.technicians,
        users: (cloudUsers && cloudUsers.length > 0) ? cloudUsers : prev.users,
      }));
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
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, null);
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
    upsertCloudRecord('tasks', taskData.id, taskData);
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
      upsertCloudRecord('tasks', taskId, updated);
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
      upsertCloudRecord('tasks', taskId, updatedTask);
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
    upsertCloudRecord('sales', dealData.id, dealData);
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
      upsertCloudRecord('sales', dealId, updatedDeal);
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
    upsertCloudRecord('invoices', invoiceData.id, invoiceData);
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
      upsertCloudRecord('invoices', invoiceId, updatedInv);
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
    upsertCloudRecord('trucks', truckData.id, truckData);
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
    upsertCloudRecord('customers', customerData.id, customerData);
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
    upsertCloudRecord('technicians', techData.id, techData);
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
                onNavigateTab={setActiveTab}
                onGenerateInvoiceFromTask={handleGenerateInvoiceFromTask}
              />
            )}

            {activeTab === 'sales' && (
              <SalesManager
                profile={appState.profile}
                sales={appState.sales}
                customers={appState.customers}
                onSaveDeal={handleSaveDeal}
                onDeleteDeal={handleDeleteDeal}
                onUpdateDealStage={handleUpdateDealStage}
                onConvertDealToInvoice={handleConvertDealToInvoice}
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
        onSaveProfile={(updatedProfile) => {
          setAppState(prev => ({ ...prev, profile: updatedProfile }));
          upsertCloudRecord('profile', 'main', updatedProfile);
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
        trucksCount={appState.trucks?.length || 0}
        customersCount={appState.customers?.length || 0}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        currentUser={currentUser}
        isCloudConnected={isSupabaseConfigured()}
        isSyncing={isSyncing}
        onRefreshCloud={refreshFromCloud}
      />

    </div>
  );
}

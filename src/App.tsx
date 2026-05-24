import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { api } from './services/api';
import type { User } from './services/api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import UserList from './pages/UserList';
import UserDetails from './pages/UserDetails';
import UserFormModal from './components/UserFormModal';
import ConfirmDialog from './components/ConfirmDialog';

type ViewState = 'overview' | 'users' | 'details';

const DashboardShell: React.FC = () => {
  const { showToast } = useToast();
  
  // Dashboard Navigation State
  const [currentView, setView] = useState<ViewState>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global Users State
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View Details State
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // Add/Edit Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  // 1. Initial Data Load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getUsers();
        setUsers(data);
      } catch (err: any) {
        console.error(err);
        setError('Network Error: Failed to fetch the user database. Please try reloading.');
        showToast(
          'Connection Failed',
          'We were unable to load the staff records. Please check your internet.',
          'error'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [showToast]);

  // 2. Fetch Detailed User Profile
  useEffect(() => {
    if (selectedUserId === null) {
      setSelectedUser(null);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        setIsDetailsLoading(true);
        
        // Optimize: Check if the user is a locally added user (ID > 208)
        // Locally created users do not exist on the server database, so load directly from state cache.
        const cachedUser = users.find(u => u.id === selectedUserId);
        if (selectedUserId > 208 && cachedUser) {
          setSelectedUser(cachedUser);
          return;
        }

        // Fetch from API to simulate loading and network correctness
        const data = await api.getUserById(selectedUserId);
        setSelectedUser(data);
      } catch (err: any) {
        console.error(err);
        // Fallback to local cache if API fails
        const cached = users.find((u) => u.id === selectedUserId);
        if (cached) {
          setSelectedUser(cached);
          showToast(
            'Offline Mode',
            'Loaded profile from cached workspace memory.',
            'info'
          );
        } else {
          showToast(
            'Failed to load details',
            'Unable to fetch details for this profile from server.',
            'error'
          );
        }
      } finally {
        setIsDetailsLoading(false);
      }
    };

    fetchUserDetails();
  }, [selectedUserId, users, showToast]);

  // 3. Navigation Helpers
  const handleViewDetails = (id: number) => {
    setSelectedUserId(id);
    setView('details');
  };

  const handleBackToDirectory = () => {
    setSelectedUserId(null);
    setSelectedUser(null);
    setView('users');
  };

  // 4. Create / Edit Submission Callback
  const handleFormSubmit = async (userData: Omit<User, 'id'>) => {
    try {
      setIsFormSubmitting(true);
      if (editingUser) {
        // Mode: EDIT
        const updated = await api.updateUser(editingUser.id, userData);
        
        // Update local state list
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...updated } : u))
        );
        
        // If we are editing the currently viewed details profile, refresh it in state
        if (selectedUserId === editingUser.id) {
          setSelectedUser({ ...editingUser, ...updated } as User);
        }

        showToast(
          'Employee Record Updated',
          `Successfully saved changes for ${userData.firstName} ${userData.lastName}.`,
          'success'
        );
      } else {
        // Mode: CREATE
        const created = await api.createUser(userData);
        
        // DummyJSON returns id: 209 (or similar). We want to guarantee unique incrementing IDs in state
        const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 208;
        const newUserId = maxId + 1;
        const newUserWithUniqueId: User = {
          ...created,
          id: newUserId,
        };

        // Insert at index 0 so it immediately appears first in directory
        setUsers((prev) => [newUserWithUniqueId, ...prev]);

        showToast(
          'Employee Added',
          `${userData.firstName} ${userData.lastName} was added to the staff directory.`,
          'success'
        );
      }
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      console.error(err);
      showToast(
        'Submission Failed',
        'Could not write modifications. Please check form validation fields.',
        'error'
      );
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // 5. Delete Action Callback
  const handleDeleteConfirm = async () => {
    if (deletingUserId === null) return;
    try {
      setIsDeleteSubmitting(true);
      await api.deleteUser(deletingUserId);

      // Remove from state list
      const targetUser = users.find((u) => u.id === deletingUserId);
      const nameString = targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'Employee';

      setUsers((prev) => prev.filter((u) => u.id !== deletingUserId));

      // Auto redirect back to list if we deleted the user whose details we are viewing
      if (selectedUserId === deletingUserId) {
        handleBackToDirectory();
      }

      showToast(
        'Employee Deleted',
        `${nameString} was successfully removed from database records.`,
        'success'
      );
      setIsDeleteOpen(false);
      setDeletingUserId(null);
    } catch (err: any) {
      console.error(err);
      showToast(
        'Deletion Failed',
        'We were unable to remove this employee from records.',
        'error'
      );
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingUserId(id);
    setIsDeleteOpen(true);
  };

  const handleAddClick = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      <div className="main-content">
        {/* Sticky Header */}
        <Header 
          currentView={currentView} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Dynamic View Body Routing */}
        <main className="view-body">
          {error && (
            <div className="empty-state glass animate-slide-up" style={{ borderColor: 'var(--danger)', marginBottom: 24 }}>
              <h3 className="empty-state-title" style={{ color: 'var(--danger)' }}>Database Offline</h3>
              <p className="empty-state-description">{error}</p>
            </div>
          )}

          {currentView === 'overview' && (
            <Overview 
              users={users} 
              isLoading={isLoading} 
              onViewUser={handleViewDetails} 
            />
          )}

          {currentView === 'users' && (
            <UserList
              users={users}
              isLoading={isLoading}
              onView={handleViewDetails}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onAddClick={handleAddClick}
            />
          )}

          {currentView === 'details' && (
            <UserDetails
              user={selectedUser}
              isLoading={isDetailsLoading}
              onBack={handleBackToDirectory}
            />
          )}
        </main>
      </div>

      {/* Form Modal Dialog */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleFormSubmit}
        user={editingUser}
        isLoading={isFormSubmitting}
      />

      {/* Delete Confirmation Alert */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingUserId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee Record"
        message="Are you sure you want to remove this employee record? This action will immediately retract them from active directory rosters and is irreversible."
        isLoading={isDeleteSubmitting}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DashboardShell />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

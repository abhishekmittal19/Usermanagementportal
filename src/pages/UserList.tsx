import React, { useState, useMemo } from 'react';
import { 
  Search, LayoutGrid, List, Plus, Eye, Edit2, Trash2, 
  ChevronLeft, ChevronRight, UserMinus, ArrowUpDown
} from 'lucide-react';
import type { User } from '../services/api';
import { TableSkeleton, CardSkeleton } from '../components/Skeleton';

interface UserListProps {
  users: User[];
  isLoading: boolean;
  onView: (id: number) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onAddClick: () => void;
}

type ViewMode = 'table' | 'cards';
type SortField = 'name' | 'age';
type SortOrder = 'asc' | 'desc' | null;

const UserList: React.FC<UserListProps> = ({
  users,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  // Local state
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('dashboard-view-mode') as ViewMode) || 'table';
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Toggle layout structure
  const handleViewModeToggle = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('dashboard-view-mode', mode);
  };

  // Get unique list of roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const rolesSet = new Set(users.map((u) => u.role).filter(Boolean));
    return ['all', ...Array.from(rolesSet)];
  }, [users]);

  // Combined Search, Filter and Sort
  const processedUsers = useMemo(() => {
    let result = [...users];

    // 1. Text Search (First Name, Last Name, Email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.firstName.toLowerCase().includes(query) ||
          u.lastName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    // 2. Gender Filtering
    if (selectedGender !== 'all') {
      result = result.filter((u) => u.gender === selectedGender);
    }

    // 3. Role Filtering
    if (selectedRole !== 'all') {
      result = result.filter((u) => u.role === selectedRole);
    }

    // 4. Sorting (Name A-Z/Z-A or Age Low-High/High-Low)
    if (sortField && sortOrder) {
      result.sort((a, b) => {
        if (sortField === 'name') {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        } else {
          // age sorting
          return sortOrder === 'asc' ? a.age - b.age : b.age - a.age;
        }
      });
    }

    return result;
  }, [users, searchQuery, selectedGender, selectedRole, sortField, sortOrder]);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGender, selectedRole]);

  // Pagination Logic
  const totalItems = processedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [processedUsers, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        end = 5;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    
    return pages;
  };

  // Rendering loading state
  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="controls-panel glass" style={{ height: 120 }}>
          <div className="shimmer" style={{ width: '100%', height: '100%', borderRadius: 10 }} />
        </div>
        {viewMode === 'table' ? <TableSkeleton /> : <CardSkeleton />}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Controls Panel (Search, Filters, Sort & Toggle View) */}
      <div className="controls-panel glass">
        <div className="search-filter-row">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by first name, last name, or email..."
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="form-group">
            <select
              className="form-control"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              aria-label="Filter by Gender"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <select
              className="form-control"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              aria-label="Filter by Corporate Role"
              style={{ textTransform: 'capitalize' }}
            >
              <option value="all">All Roles</option>
              {uniqueRoles.filter(r => r !== 'all').map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sorting & Main Layout Buttons */}
        <div className="sorting-row">
          <div className="sorting-group">
            <span className="sort-label">Sort By:</span>
            <button
              className={`btn btn-secondary btn-sm ${sortField === 'name' ? 'active' : ''}`}
              style={{
                backgroundColor: sortField === 'name' ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: sortField === 'name' ? 'white' : 'var(--text-secondary)',
                borderColor: sortField === 'name' ? 'var(--primary)' : 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
              onClick={() => {
                setSortField('name');
                setSortOrder(sortField === 'name' && sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Name {sortField === 'name' && (sortOrder === 'asc' ? 'A-Z' : 'Z-A')}
              <ArrowUpDown size={12} />
            </button>

            <button
              className={`btn btn-secondary btn-sm ${sortField === 'age' ? 'active' : ''}`}
              style={{
                backgroundColor: sortField === 'age' ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: sortField === 'age' ? 'white' : 'var(--text-secondary)',
                borderColor: sortField === 'age' ? 'var(--primary)' : 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
              onClick={() => {
                setSortField('age');
                setSortOrder(sortField === 'age' && sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              Age {sortField === 'age' && (sortOrder === 'asc' ? 'Low-High' : 'High-Low')}
              <ArrowUpDown size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* View Mode Toggle */}
            <div 
              style={{ 
                display: 'flex', 
                backgroundColor: 'var(--bg-tertiary)', 
                padding: 4, 
                borderRadius: 'var(--radius-sm)', 
                border: '1px solid var(--border-color)' 
              }}
            >
              <button
                className="icon-btn"
                style={{ 
                  padding: 6, 
                  border: 'none', 
                  backgroundColor: viewMode === 'table' ? 'var(--bg-secondary)' : 'transparent',
                  color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-xs)'
                }}
                onClick={() => handleViewModeToggle('table')}
                title="Table Layout"
              >
                <List size={16} />
              </button>
              <button
                className="icon-btn"
                style={{ 
                  padding: 6, 
                  border: 'none', 
                  backgroundColor: viewMode === 'cards' ? 'var(--bg-secondary)' : 'transparent',
                  color: viewMode === 'cards' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-xs)'
                }}
                onClick={() => handleViewModeToggle('cards')}
                title="Grid Cards Layout"
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            {/* Add User Action Button */}
            <button className="btn btn-primary" onClick={onAddClick}>
              <Plus size={16} />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Empty State Check */}
      {processedUsers.length === 0 ? (
        <div className="empty-state glass">
          <UserMinus size={48} className="empty-state-icon" />
          <h3 className="empty-state-title">No employees found</h3>
          <p className="empty-state-description">
            We couldn't find any records matching your search queries or filter selections. Try adjusting your inputs!
          </p>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedGender('all');
              setSelectedRole('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Layout Renderers */}
          {viewMode === 'table' ? (
            /* Table View Layout */
            <div className="table-container glass">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: 64 }}>Avatar</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Company Name</th>
                    <th>Role</th>
                    <th style={{ width: 120, textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <img
                          src={user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.firstName}`}
                          alt={user.firstName}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`;
                          }}
                        />
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.company.name}</td>
                      <td>
                        <span className={`badge badge-role-${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button
                            className="icon-btn"
                            style={{ padding: 6 }}
                            onClick={() => onView(user.id)}
                            title="View Detailed Profile"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="icon-btn"
                            style={{ padding: 6 }}
                            onClick={() => onEdit(user)}
                            title="Edit Record"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="icon-btn"
                            style={{ padding: 6, color: 'var(--danger)' }}
                            onClick={() => onDelete(user.id)}
                            title="Delete Employee"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Card Grid View Layout */
            <div className="user-cards-grid">
              {paginatedUsers.map((user) => (
                <div key={user.id} className="user-card glass">
                  {/* Decorative Gender Accent Top Line */}
                  <div className={`user-card-gender-accent ${user.gender}`} />
                  
                  <img
                    src={user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.firstName}`}
                    alt={user.firstName}
                    className="user-card-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`;
                    }}
                  />
                  <h3 className="user-card-name">
                    {user.firstName} {user.lastName}
                  </h3>
                  
                  <span className={`badge badge-role-${user.role.toLowerCase()}`} style={{ marginBottom: 12 }}>
                    {user.role}
                  </span>

                  <div className="user-card-details">
                    <div className="user-card-detail-item">
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginRight: 4 }}>Email:</span>
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.email}</span>
                    </div>
                    <div className="user-card-detail-item">
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginRight: 4 }}>Phone:</span>
                      <span>{user.phone}</span>
                    </div>
                    <div className="user-card-detail-item">
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', marginRight: 4 }}>Company:</span>
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.company.name}</span>
                    </div>
                  </div>

                  <div className="user-card-actions">
                    <button
                      className="icon-btn user-card-action-btn"
                      onClick={() => onView(user.id)}
                      title="View detailed record"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="icon-btn user-card-action-btn"
                      onClick={() => onEdit(user)}
                      title="Edit record"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="icon-btn user-card-action-btn"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => onDelete(user.id)}
                      title="Delete record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table Pagination row */}
          <div className="pagination">
            <div className="pagination-info">
              Showing <strong>{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
              <strong>{Math.min(totalItems, currentPage * itemsPerPage)}</strong> of{' '}
              <strong>{totalItems}</strong> entries
            </div>

            <div className="pagination-controls">
              {/* Prev Button */}
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Button */}
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;

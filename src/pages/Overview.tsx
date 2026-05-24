import React from 'react';
import { Users, UserCheck, Shield, Briefcase, ArrowRight } from 'lucide-react';
import type { User } from '../services/api';
import { StatsSkeleton } from '../components/Skeleton';

interface OverviewProps {
  users: User[];
  isLoading: boolean;
  onViewUser: (id: number) => void;
}

const Overview: React.FC<OverviewProps> = ({ users, isLoading, onViewUser }) => {
  if (isLoading) {
    return <StatsSkeleton />;
  }

  const totalUsers = users.length;
  
  // Male vs Female counts
  const maleCount = users.filter((u) => u.gender === 'male').length;
  const femaleCount = users.filter((u) => u.gender === 'female').length;
  const malePercentage = totalUsers > 0 ? Math.round((maleCount / totalUsers) * 100) : 0;
  const femalePercentage = totalUsers > 0 ? Math.round((femaleCount / totalUsers) * 100) : 0;

  // Departments count
  const departments = new Set(users.map((u) => u.company.department).filter(Boolean));
  const totalDepartments = departments.size;

  // Roles count
  const roles = new Set(users.map((u) => u.role).filter(Boolean));
  const totalRoles = roles.size;

  // Get top 5 recent users (e.g. by descending ID or first 5)
  const recentUsers = [...users].slice(0, 5);

  // Group by department for visual list
  const deptCounts: Record<string, number> = {};
  users.forEach((u) => {
    const dept = u.company.department || 'Other';
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });

  const sortedDepts = Object.entries(deptCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stats-card glass">
          <div className="stats-icon-wrapper primary">
            <Users size={24} />
          </div>
          <div className="stats-info">
            <span className="stats-label">Total Staff</span>
            <span className="stats-value">{totalUsers}</span>
          </div>
        </div>

        <div className="stats-card glass">
          <div className="stats-icon-wrapper success">
            <UserCheck size={24} />
          </div>
          <div className="stats-info">
            <span className="stats-label">Active Roles</span>
            <span className="stats-value">{totalRoles}</span>
          </div>
        </div>

        <div className="stats-card glass">
          <div className="stats-icon-wrapper warning">
            <Briefcase size={24} />
          </div>
          <div className="stats-info">
            <span className="stats-label">Departments</span>
            <span className="stats-value">{totalDepartments}</span>
          </div>
        </div>

        <div className="stats-card glass">
          <div className="stats-icon-wrapper accent">
            <Shield size={24} />
          </div>
          <div className="stats-info">
            <span className="stats-label">Ratios (M/F)</span>
            <span className="stats-value">{maleCount} / {femaleCount}</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualization Row */}
      <div className="overview-charts-row">
        {/* Gender Distribution Card */}
        <div className="analytics-card glass">
          <h2 className="analytics-title">
            <Users size={20} /> Gender Distribution
          </h2>
          <div className="gender-bar-container">
            <div className="gender-progress-item">
              <div className="gender-label-row">
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Male Employees</span>
                <span>{maleCount} ({malePercentage}%)</span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-bar primary" 
                  style={{ width: `${malePercentage}%` }} 
                />
              </div>
            </div>

            <div className="gender-progress-item">
              <div className="gender-label-row">
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Female Employees</span>
                <span>{femaleCount} ({femalePercentage}%)</span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-bar accent" 
                  style={{ width: `${femalePercentage}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Department Breakdown list */}
          <h2 className="analytics-title" style={{ marginTop: 32 }}>
            <Briefcase size={20} /> Top Departments
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sortedDepts.map(([dept, count]) => {
              const percentage = Math.round((count / totalUsers) * 100);
              return (
                <div key={dept} className="gender-progress-item">
                  <div className="gender-label-row">
                    <span style={{ fontSize: '0.85rem' }}>{dept}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{count} ({percentage}%)</span>
                  </div>
                  <div className="progress-track" style={{ height: 8 }}>
                    <div 
                      className="progress-bar" 
                      style={{ width: `${percentage}%`, backgroundColor: 'var(--text-tertiary)' }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recently Added Users Card */}
        <div className="analytics-card glass">
          <h2 className="analytics-title">
            <UserCheck size={20} /> Recent Additions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentUsers.map((user) => (
              <div 
                key={user.id} 
                className="stats-card" 
                style={{ 
                  padding: 12, 
                  backgroundColor: 'var(--bg-tertiary)', 
                  border: 'none', 
                  gap: 12, 
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)'
                }}
                onClick={() => onViewUser(user.id)}
              >
                <img 
                  src={user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.firstName}`} 
                  alt={`${user.firstName} ${user.lastName}`} 
                  style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--border-color)' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`;
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.firstName} {user.lastName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {user.role} • {user.company.name}
                  </span>
                </div>
                <ArrowRight size={16} style={{ color: 'var(--text-tertiary)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

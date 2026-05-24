import React, { useState } from 'react';
import { ArrowLeft, Briefcase, MapPin, GraduationCap, Calendar, Phone, Mail } from 'lucide-react';
import type { User } from '../services/api';
import { DetailsSkeleton } from '../components/Skeleton';

interface UserDetailsProps {
  user: User | null;
  isLoading: boolean;
  onBack: () => void;
}

type TabType = 'basic' | 'address' | 'company' | 'additional';

const UserDetails: React.FC<UserDetailsProps> = ({ user, isLoading, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('basic');

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (!user) {
    return (
      <div className="empty-state glass">
        <ArrowLeft 
          size={20} 
          onClick={onBack} 
          style={{ cursor: 'pointer', position: 'absolute', top: 24, left: 24 }} 
        />
        <h3 className="empty-state-title">User not found</h3>
        <p className="empty-state-description">We couldn't retrieve the details for this employee record.</p>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Back Link */}
      <div>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <ArrowLeft size={16} />
          Back to Directory
        </button>
      </div>

      <div className="profile-container">
        {/* Profile Identity Sidebar */}
        <div className="profile-sidebar glass">
          <img 
            src={user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.firstName}`} 
            alt={`${user.firstName} ${user.lastName}`} 
            className="profile-avatar-large"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`;
            }}
          />
          <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
          <span className="profile-role">{user.company.title || 'Specialist'}</span>
          
          <p className="profile-tagline">
            Professional employee assigned to the {user.company.department || 'General'} department at {user.company.name || 'Pulse Systems'}.
          </p>

          <div className="profile-quick-stats">
            <div className="profile-stat-box">
              <span className="profile-stat-label">Age</span>
              <span className="profile-stat-val">{user.age}</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-label">Gender</span>
              <span className="profile-stat-val" style={{ textTransform: 'capitalize' }}>
                {user.gender}
              </span>
            </div>
          </div>
        </div>

        {/* Tabbed Interactive Information Workspace */}
        <div className="profile-main-tabs glass">
          <div className="profile-tabs-header">
            <button 
              className={`profile-tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Info
            </button>
            <button 
              className={`profile-tab-btn ${activeTab === 'company' ? 'active' : ''}`}
              onClick={() => setActiveTab('company')}
            >
              Company Info
            </button>
            <button 
              className={`profile-tab-btn ${activeTab === 'address' ? 'active' : ''}`}
              onClick={() => setActiveTab('address')}
            >
              Address Location
            </button>
            <button 
              className={`profile-tab-btn ${activeTab === 'additional' ? 'active' : ''}`}
              onClick={() => setActiveTab('additional')}
            >
              Additional Details
            </button>
          </div>

          <div className="profile-tab-body">
            {activeTab === 'basic' && (
              <div className="info-cards-grid animate-fade-in">
                <div className="info-field-group">
                  <span className="info-field-label">First Name</span>
                  <span className="info-field-value">{user.firstName}</span>
                </div>
                <div className="info-field-group">
                  <span className="info-field-label">Last Name</span>
                  <span className="info-field-value">{user.lastName}</span>
                </div>
                <div className="info-field-group" style={{ gridColumn: 'span 2' }}>
                  <span className="info-field-label">Email Address</span>
                  <span className="info-field-value" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={16} style={{ color: 'var(--text-tertiary)' }} />
                    {user.email}
                  </span>
                </div>
                <div className="info-field-group">
                  <span className="info-field-label">Phone Number</span>
                  <span className="info-field-value" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={16} style={{ color: 'var(--text-tertiary)' }} />
                    {user.phone}
                  </span>
                </div>
                <div className="info-field-group">
                  <span className="info-field-label">Corporate Role</span>
                  <span className="info-field-value" style={{ textTransform: 'capitalize' }}>
                    <span className={`badge badge-role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="info-cards-grid animate-fade-in">
                <div className="info-field-group" style={{ gridColumn: 'span 2' }}>
                  <span className="info-field-label">Company Name</span>
                  <span className="info-field-value" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Briefcase size={16} style={{ color: 'var(--text-tertiary)' }} />
                    {user.company.name}
                  </span>
                </div>
                <div className="info-field-group">
                  <span className="info-field-label">Department</span>
                  <span className="info-field-value">{user.company.department}</span>
                </div>
                <div className="info-field-group">
                  <span className="info-field-label">Job Title</span>
                  <span className="info-field-value">{user.company.title}</span>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="info-cards-grid animate-fade-in">
                <div className="info-field-group" style={{ gridColumn: 'span 2' }}>
                  <span className="info-field-label">Street Address Line</span>
                  <span className="info-field-value" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={16} style={{ color: 'var(--text-tertiary)' }} />
                    {user.address.address}
                  </span>
                </div>
                <div className="info-field-group">
                  <span className="info-field-label">City</span>
                  <span className="info-field-value">{user.address.city}</span>
                </div>
                <div className="info-field-group">
                  <span className="info-field-label">State / Province</span>
                  <span className="info-field-value">{user.address.state}</span>
                </div>
                <div className="info-field-group" style={{ gridColumn: 'span 2' }}>
                  <span className="info-field-label">Country</span>
                  <span className="info-field-value">{user.address.country}</span>
                </div>
              </div>
            )}

            {activeTab === 'additional' && (
              <div className="info-cards-grid animate-fade-in">
                <div className="info-field-group">
                  <span className="info-field-label">Birth Date</span>
                  <span className="info-field-value" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={16} style={{ color: 'var(--text-tertiary)' }} />
                    {user.birthDate || 'N/A'}
                  </span>
                </div>
                <div className="info-field-group" style={{ gridColumn: 'span 2' }}>
                  <span className="info-field-label">University / College</span>
                  <span className="info-field-value" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <GraduationCap size={16} style={{ color: 'var(--text-tertiary)' }} />
                    {user.university || 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

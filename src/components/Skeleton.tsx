import React from 'react';

export const StatsSkeleton: React.FC = () => {
  return (
    <div className="stats-grid">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="stats-card glass">
          <div className="stats-icon-wrapper shimmer" style={{ width: 52, height: 52 }} />
          <div className="stats-info" style={{ flex: 1 }}>
            <div className="skeleton-text shimmer" style={{ width: '40%', height: 12 }} />
            <div className="skeleton-text shimmer" style={{ width: '60%', height: 24, marginTop: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="table-container glass">
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: 12 }}>
        <div className="shimmer" style={{ width: 120, height: 32, borderRadius: 6 }} />
        <div className="shimmer" style={{ width: 180, height: 32, borderRadius: 6 }} />
      </div>
      <table className="custom-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ width: 60 }}><div className="skeleton-text shimmer" style={{ width: 24 }} /></th>
            <th><div className="skeleton-text shimmer" style={{ width: 80 }} /></th>
            <th><div className="skeleton-text shimmer" style={{ width: 120 }} /></th>
            <th><div className="skeleton-text shimmer" style={{ width: 100 }} /></th>
            <th><div className="skeleton-text shimmer" style={{ width: 120 }} /></th>
            <th><div className="skeleton-text shimmer" style={{ width: 80 }} /></th>
            <th style={{ width: 150 }}><div className="skeleton-text shimmer" style={{ width: 60 }} /></th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              <td><div className="skeleton-circle shimmer" style={{ width: 32, height: 32 }} /></td>
              <td><div className="skeleton-text shimmer" style={{ width: '70%' }} /></td>
              <td><div className="skeleton-text shimmer" style={{ width: '90%' }} /></td>
              <td><div className="skeleton-text shimmer" style={{ width: '80%' }} /></td>
              <td><div className="skeleton-text shimmer" style={{ width: '75%' }} /></td>
              <td><div className="skeleton-text shimmer" style={{ width: '60%' }} /></td>
              <td><div className="skeleton-text shimmer" style={{ width: '50%' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="user-cards-grid">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="user-card glass">
          <div className="skeleton-circle shimmer" style={{ width: 80, height: 80, marginBottom: 16 }} />
          <div className="skeleton-text shimmer" style={{ width: '60%', height: 16, marginBottom: 8 }} />
          <div className="skeleton-text shimmer" style={{ width: '40%', height: 12, marginBottom: 16 }} />
          <div className="user-card-details" style={{ width: '100%' }}>
            <div className="skeleton-text shimmer" style={{ width: '80%' }} />
            <div className="skeleton-text shimmer" style={{ width: '70%' }} />
            <div className="skeleton-text shimmer" style={{ width: '75%' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 16 }}>
            <div className="shimmer" style={{ flex: 1, height: 32, borderRadius: 6 }} />
            <div className="shimmer" style={{ flex: 1, height: 32, borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const DetailsSkeleton: React.FC = () => {
  return (
    <div className="profile-container">
      <div className="profile-sidebar glass">
        <div className="skeleton-circle shimmer" style={{ width: 140, height: 140, marginBottom: 20 }} />
        <div className="skeleton-text shimmer" style={{ width: '60%', height: 20, marginBottom: 8 }} />
        <div className="skeleton-text shimmer" style={{ width: '40%', height: 12, marginBottom: 24 }} />
        <div className="profile-quick-stats">
          <div className="profile-stat-box"><div className="skeleton-text shimmer" style={{ width: '80%' }} /></div>
          <div className="profile-stat-box"><div className="skeleton-text shimmer" style={{ width: '80%' }} /></div>
        </div>
      </div>
      <div className="profile-main-tabs glass">
        <div className="profile-tabs-header shimmer" style={{ height: 50 }} />
        <div className="profile-tab-body">
          <div className="info-cards-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="info-field-group">
                <div className="skeleton-text shimmer" style={{ width: '30%', height: 10 }} />
                <div className="skeleton-text shimmer" style={{ width: '70%', height: 14 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

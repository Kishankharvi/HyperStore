import React, { useState } from 'react';
import AddItem from './AddItem';
import UserList from './UserList';
import "../styles/Admin.css"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('addItem');

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'addItem' ? 'active' : ''}`}
          onClick={() => setActiveTab('addItem')}
        >
          Add Item
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'userManagement' ? 'active' : ''}`}
          onClick={() => setActiveTab('userManagement')}
        >
          User Management
        </button>
      </div>

      <div className="admin-tab-content">
        {activeTab === 'addItem' && <AddItem />}
        {activeTab === 'userManagement' && (
          <div className="admin-section">
            <h2 className="admin-section-title">User Management</h2>
            <UserList />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
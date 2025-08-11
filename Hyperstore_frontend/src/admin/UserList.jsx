import React, { useState, useEffect, useContext, useCallback } from 'react';
import apiService from '../utils/api';
import { AuthContext } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import UserRow from './UserRow';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState({});

  const fetchUsersAndOrders = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUsers = await apiService.getUsers();
      setUsers(fetchedUsers);
      const ordersData = {};
      for (const u of fetchedUsers) {
        try {
          const userOrders = await apiService.getUserOrdersById(u._id);
          ordersData[u._id] = userOrders;
        } catch (err) {
          console.error(`Failed to load orders for user ${u._id}`, err);
          ordersData[u._id] = [];
        }
      }
      setOrders(ordersData);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsersAndOrders();
    } else {
      navigate('/login');
    }
  }, [user, navigate, fetchUsersAndOrders]);

  const handleUpdateStatus = useCallback(async (orderId, status) => {
    try {
      await apiService.updateOrderStatus(orderId, { status });
      toast.success(`Order ${status}!`);
      fetchUsersAndOrders(); // Refresh data
    } catch (err) {
      toast.error('Failed to update order status.');
      console.error(err);
    }
  }, [fetchUsersAndOrders]);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
   
      <div className="admin-table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Order ID</th>
            <th>Time of Order</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.flatMap(u =>
            (orders[u._id] || []).map(order => (
              <UserRow
                key={order._id}
                user={u}
                order={order}
                handleUpdateStatus={handleUpdateStatus}
              />
            ))
          )}
        </tbody>
      </table></div>
   
  );
};

export default UserList;
import React from 'react';

const UserRow = ({ user, order, handleUpdateStatus }) => {
  return (
    <tr key={order._id}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{order._id.substring(0, 8)}...</td>
      <td>{new Date(order.createdAt).toLocaleString()}</td>
      <td>${order.total.toFixed(2)}</td>
      <td>
        <span className={`status-badge ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </td>
      <td>
        {order.status === 'pending' && (
          <>
            <button
              className="admin-button accept"
              onClick={() => handleUpdateStatus(order._id, 'confirmed')}
            >
              Accept
            </button>
            <button
              className="admin-button delete"
              onClick={() => handleUpdateStatus(order._id, 'cancelled')}
            >
              Cancel
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default React.memo(UserRow);
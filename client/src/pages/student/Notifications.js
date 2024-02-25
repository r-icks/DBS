import React, { useState } from 'react';
import { BsFillPersonFill, BsTrash } from 'react-icons/bs';
import { MdAdminPanelSettings } from 'react-icons/md';
import classnames from 'classnames';
import { useAppContext } from '../../context/appContext';
import Loading from '../Loading';

const Notification = ({ notification }) => {
  const iconClass = classnames('text-2xl mr-2', {
    'text-primary': notification.role === 'admin',
    'text-secondary': notification.role !== 'admin',
  });

  const messageClass = classnames('p-2 rounded-lg flex-grow', {
    'bg-blue-100': notification.status === 'informational',
    'bg-yellow-100': notification.status === 'warning',
    'bg-red-100': notification.status === 'critical',
  });

  const { deleteNotification } = useAppContext();

  const deleteIconClass = classnames('text-lg text-red-600 cursor-pointer hover:text-red-800');

  const handleDelete = () => {
    deleteNotification({
      notificationRole: notification.role,
      notification_id: notification.notif_id,
    });
  };

  return (
    <div className="flex items-center mb-4">
      <div className="flex items-center flex-grow">
        {notification.role === 'admin' ? (
          <MdAdminPanelSettings className={iconClass} />
        ) : (
          <BsFillPersonFill className={iconClass} />
        )}
        <div className={messageClass}>
          <p className="text-lg font-semibold">{notification.name}</p>
          <p className="text-lg mb-2">{notification.message}</p>
        </div>
      </div>
      <button className={`ml-2 ${deleteIconClass}`} onClick={handleDelete}>
        <BsTrash />
      </button>
    </div>
  );
};

const Notifications = () => {
  const { notifications, notificationsLoading, getNotifications } = useAppContext();

  if (!notifications) {
    if (!notificationsLoading) {
      getNotifications();
    }
    return <Loading />;
  }

  console.log(notifications);

  return (
    <div className="w-full mt-8 p-4 bg-background border border-primary rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-lg text-center">No notifications available</p>
      ) : (
        notifications.map((notification) => (
          <Notification key={notification.notif_id} notification={notification} />
        ))
      )}
    </div>
  );
};

export default Notifications;
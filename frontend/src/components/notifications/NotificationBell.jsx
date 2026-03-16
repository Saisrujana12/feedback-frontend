import React, { useState } from "react";
import { mockNotifications } from "../../data/mockData";
import { toast } from "react-hot-toast";
import "./NotificationBell.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read.");
  };

  return (
    <div className="notification-bell">
      <div className="bell-icon" onClick={() => setIsOpen(!isOpen)}>
        <span className="material-icons">notifications</span>
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <span>Notifications</span>
            <button onClick={markAllAsRead}>Mark all as read</button>
          </div>

          <div className="dropdown-body">
            {notifications.length === 0 ? (
              <div className="empty-state">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${n.isRead ? "read" : "unread"}`}
                >
                  <span className="notification-icon material-icons">
                    {n.type === "upvote" && "thumb_up"}
                    {n.type === "comment" && "comment"}
                    {n.type === "status_change" && "update"}
                  </span>
                  <div className="notification-content">
                    <p>{n.message}</p>
                    <span className="time-ago">{new Date(n.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
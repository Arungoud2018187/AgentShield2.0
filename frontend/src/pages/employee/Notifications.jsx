import {
  Bell,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../api/notificationApi";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getNotifications()
      .then((data) => {
        setNotifications(data.notifications ?? []);
        setUnreadCount(data.unread_count ?? 0);
      })
      .catch((requestError) => {
        setError(requestError?.response?.data?.detail || "Unable to load notifications.");
      })
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (notification) => {
    if (notification.is_read) return;
    await markNotificationRead(notification.id);
    setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, is_read: true } : item));
    setUnreadCount((count) => Math.max(0, count - 1));
  };

  const markAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((items) => items.map((item) => ({ ...item, is_read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type) => {
    if (type === "success") return <CheckCircle className="text-green-400" />;
    if (type === "warning") return <AlertTriangle className="text-yellow-400" />;
    return <Shield className="text-cyan-400" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#111a2b] p-5">
        <div className="flex items-center gap-4">
          <Bell className="text-cyan-400" size={36} />
          <div>
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            <p className="mt-2 text-slate-300">Enterprise alerts and security updates.</p>
          </div>
        </div>
        <button onClick={markAllRead} disabled={!unreadCount} className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-40">
          Mark all read
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</div>}
      {loading ? <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-400">Loading notifications...</div> : (
        <div className="space-y-5">
          {notifications.length === 0 && <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-400">You are all caught up.</div>}
          {notifications.map((item) => (
            <button key={item.id} onClick={() => markRead(item)} className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-6 text-left transition hover:border-cyan-500 ${item.is_read ? "border-slate-800 bg-slate-900" : "border-cyan-500/40 bg-cyan-500/5"}`}>
              <span className="flex gap-4">
                <span className="mt-1">{getIcon(item.notification_type)}</span>
                <span>
                  <span className="block text-lg font-semibold text-white">{item.title}</span>
                  <span className="mt-2 block text-slate-400">{item.description}</span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-sm text-slate-500">
                <Clock size={16} />
                {item.created_at ? new Date(item.created_at).toLocaleString() : "Recently"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

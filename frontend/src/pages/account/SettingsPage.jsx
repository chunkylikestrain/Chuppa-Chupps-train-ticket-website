/* eslint-disable no-unused-vars */
// Path: src/pages/account/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Mail,
  MessageSquare,
  Tag,
  Save,
  Loader2,
} from "lucide-react";
import accountService from "../../services/accountService";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    promotions: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await accountService.getProfile();
        if (res.data.notifications) setSettings(res.data.notifications);
      } catch (error) {
        console.error("Failed to fetch settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await accountService.updateNotifications(settings);
      alert("Settings updated successfully!");
    } catch (error) {
      alert("Failed to update settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const Toggle = ({ label, description, icon, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors mb-3">
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-full ${checked ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{label}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors relative ${checked ? "bg-indigo-600" : "bg-slate-300"}`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${checked ? "left-7" : "left-1"}`}
        ></div>
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="text-indigo-600" /> Account Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your notification preferences.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <Bell size={20} className="text-slate-400" /> Notifications
        </h2>

        {isLoading ? (
          <div className="py-8 text-center text-slate-400">
            Loading settings...
          </div>
        ) : (
          <div>
            <Toggle
              label="Email Notifications"
              description="Receive booking confirmations and electronic tickets via email."
              icon={<Mail size={20} />}
              checked={settings.email}
              onChange={() =>
                setSettings({ ...settings, email: !settings.email })
              }
            />
            <Toggle
              label="SMS Notifications"
              description="Get text alerts for train delays and platform changes."
              icon={<MessageSquare size={20} />}
              checked={settings.sms}
              onChange={() => setSettings({ ...settings, sms: !settings.sms })}
            />
            <Toggle
              label="Promotions & Offers"
              description="Receive discount codes and special offers."
              icon={<Tag size={20} />}
              checked={settings.promotions}
              onChange={() =>
                setSettings({ ...settings, promotions: !settings.promotions })
              }
            />

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

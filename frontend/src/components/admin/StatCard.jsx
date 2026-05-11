// src/components/admin/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, icon, colorClass, subtitle }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-lg ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-800">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;

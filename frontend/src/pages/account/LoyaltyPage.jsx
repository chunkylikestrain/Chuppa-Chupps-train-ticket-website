/* eslint-disable no-unused-vars */
// Path: src/pages/account/LoyaltyPage.jsx
import React, { useState, useEffect } from "react";
import { Star, Gift, TrendingUp, Info } from "lucide-react";
import accountService from "../../services/accountService";

const LoyaltyPage = () => {
  const [loyaltyData, setLoyaltyData] = useState({ points: 0, history: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        const res = await accountService.getLoyaltyInfo();
        setLoyaltyData(res.data);
      } catch (error) {
        console.error("Failed to fetch loyalty info");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoyalty();
  }, []);

  const calculateTier = (points) => {
    if (points >= 5000)
      return { name: "Platinum", color: "bg-slate-800", next: null };
    if (points >= 2000)
      return { name: "Gold", color: "bg-yellow-500", next: 5000 };
    if (points >= 500)
      return { name: "Silver", color: "bg-slate-400", next: 2000 };
    return { name: "Bronze", color: "bg-amber-700", next: 500 };
  };

  const tier = calculateTier(loyaltyData.points);
  const progress = tier.next ? (loyaltyData.points / tier.next) * 100 : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Star className="text-indigo-600" /> Loyalty Program
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Earn points on every trip and redeem them for discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CURRENT POINTS */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Star size={100} />
          </div>
          <p className="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-2 relative z-10">
            Available Points
          </p>
          <h2 className="text-6xl font-black relative z-10">
            {loyaltyData.points}
          </h2>
          <p className="text-indigo-200 mt-2 text-sm relative z-10">
            ≈ {(loyaltyData.points / 10).toFixed(2)} PLN Value
          </p>
        </div>

        {/* TIER PROGRESS */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-1">
                Current Tier
              </p>
              <h3
                className={`text-2xl font-black ${tier.color.replace("bg-", "text-")}`}
              >
                {tier.name} Member
              </h3>
            </div>
            {tier.next && (
              <div className="text-right text-sm text-slate-500 font-medium">
                <span className="font-bold text-slate-800">
                  {tier.next - loyaltyData.points} pts
                </span>{" "}
                to next tier
              </div>
            )}
          </div>

          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full ${tier.color} transition-all duration-1000`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>0</span>
            <span>500</span>
            <span>2000</span>
            <span>5000+</span>
          </div>
        </div>
      </div>

      {/* HOW TO EARN */}
      <div className="bg-indigo-50 rounded-xl p-4 flex items-start gap-3 border border-indigo-100 text-indigo-800 text-sm">
        <Info className="shrink-0 mt-0.5" size={18} />
        <div>
          <strong>How it works:</strong> You earn 1 point for every 1 PLN spent
          on train tickets. You can redeem points on the checkout page (100
          points = 10 PLN discount).
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;

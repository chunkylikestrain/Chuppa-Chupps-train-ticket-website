// Path: src/pages/account/TransactionsPage.jsx
import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import accountService from "../../services/accountService";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await accountService.getTransactions();
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatType = (type) => {
    const types = {
      payment: "Ticket Purchase",
      refund: "Ticket Refund",
      loyalty_earn: "Points Earned",
      loyalty_redeem: "Points Redeemed",
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <CreditCard className="text-indigo-600" /> Transaction History
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Track your payments, refunds, and loyalty points usage.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <Filter size={16} /> Filter by type:
            <select className="ml-2 bg-white border border-slate-200 rounded outline-none p-1 text-sm font-medium">
              <option value="all">All Transactions</option>
              <option value="payment">Payments</option>
              <option value="refund">Refunds</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 className="animate-spin mx-auto mb-4" /> Loading
            transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => {
                  const isPositive =
                    t.type === "refund" || t.type === "loyalty_earn";
                  const isPoints = t.type.includes("loyalty");
                  return (
                    <tr
                      key={t._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {t.transactionCode}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(t.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">
                          {formatType(t.type)}
                        </p>
                        <p className="text-xs text-slate-500">{t.note}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            t.status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black flex items-center justify-end gap-1">
                        {isPositive ? (
                          <ArrowUpRight size={16} className="text-green-500" />
                        ) : (
                          <ArrowDownRight
                            size={16}
                            className="text-slate-800"
                          />
                        )}
                        <span
                          className={
                            isPositive ? "text-green-600" : "text-slate-800"
                          }
                        >
                          {isPositive ? "+" : "-"}
                          {t.amount} {isPoints ? "pts" : "PLN"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;

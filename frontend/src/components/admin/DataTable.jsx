// src/components/admin/DataTable.jsx
import React from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";

const DataTable = ({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  emptyMessage = "No data available.",
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white border border-slate-200 rounded-xl">
        <Loader2 size={32} className="animate-spin mb-4 text-chuppaGreen" />
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              {columns.map((col, index) => (
                <th key={index} className="p-4 font-bold">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="p-4 font-bold text-center w-24">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="p-8 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="p-4">
                      {/* Nếu col.render được truyền vào, dùng nó để format dữ liệu, ngược lại in thẳng data ra */}
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}

                  {(onEdit || onDelete) && (
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;

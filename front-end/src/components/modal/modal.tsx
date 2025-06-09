import { CATEGORIES } from "@/types/budget";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

// Mock data for development (replace with actual API calls)
// export const mockBudgets = [
//   { _id: '1', category: 'Food', limit: 500, month: '2025-06' },
//   { _id: '2', category: 'Transportation', limit: 200, month: '2025-06' },
//   { _id: '3', category: 'Shopping', limit: 300, month: '2025-06' },
//   { _id: '4', category: 'Entertainment', limit: 150, month: '2025-06' }
// ];

// Mock data for development (replace with actual API calls)
export const mockBudgets = [
  { _id: '1', limit: 500, month: '2025-06' }
];

export const mockExpenses = [
  { id: '1', amount: 25.50, category: 'Food', date: '2025-06-05', description: 'Lunch' },
  { id: '2', amount: 15.00, category: 'Transportation', date: '2025-06-05', description: 'Bus fare' },
  { id: '3', amount: 45.00, category: 'Food', date: '2025-06-10', description: 'Groceries' },
  { id: '4', amount: 30.00, category: 'Entertainment', date: '2025-06-12', description: 'Movie tickets' },
  { id: '5', amount: 80.00, category: 'Shopping', date: '2025-06-15', description: 'Clothes' }
];

// Budget Setup Modal
export const BudgetSetupModal = ({ isOpen, onClose, currentMonth, budget, onSave }) => {
  const [budgetLimit, setBudgetLimit] = useState('');

  useEffect(() => {
    if (isOpen) {
      setBudgetLimit(budget ? budget.limit.toString() : '0');
    }
  }, [isOpen, budget]);

  const handleSave = () => {
    const limit = parseFloat(budgetLimit) || 0;
    onSave({
      limit,
      month: currentMonth
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Set Monthly Budget</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Monthly Budget Limit</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">$</span>
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ backgroundColor: '#34eb7d' }}
            className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90"
          >
            Save Budget
          </button>
        </div>
      </div>
    </div>
  );
};

// Expense Modal
export const ExpenseModal = ({ isOpen, onClose, selectedDate, onSave }) => {
  const [expenseData, setExpenseData] = useState({
    amount: '',
    category: 'Food',
    description: ''
  });

  const handleSave = () => {
    if (expenseData.amount && parseFloat(expenseData.amount) > 0) {
      onSave({
        ...expenseData,
        amount: parseFloat(expenseData.amount),
        date: selectedDate,
        id: Date.now().toString()
      });
      setExpenseData({ amount: '', category: 'Food', description: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Expense</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">$</span>
              <input
                type="number"
                step="0.01"
                value={expenseData.amount}
                onChange={(e) => setExpenseData(prev => ({ ...prev, amount: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={expenseData.category}
              onChange={(e) => setExpenseData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={expenseData.description}
              onChange={(e) => setExpenseData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="What did you spend on?"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ backgroundColor: '#34eb7d' }}
            className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
};
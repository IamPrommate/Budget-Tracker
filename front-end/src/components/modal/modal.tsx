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

// Budget Setup Modal
interface BudgetSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: string;
  budget: { limit?: number };
  onSave: (budgetData: { limit: number; month: string }) => Promise<void>;
}

export const BudgetSetupModal: React.FC<BudgetSetupModalProps> = ({
  isOpen,
  onClose,
  currentMonth,
  budget,
  onSave
}) => {
  const [budgetAmount, setBudgetAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Set current budget amount if exists
      setBudgetAmount(budget?.limit ? budget.limit.toString() : '');
    }
  }, [isOpen, budget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    setLoading(true);
    try {
      // Create ISO date string for the first day of the month
      const monthDate = new Date(currentMonth + '-01');
      const isoString = monthDate.toISOString();

      await onSave({
        limit: amount,
        month: isoString
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setBudgetAmount('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentMonthName = new Date(currentMonth + '-01').toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Set Budget for {currentMonthName}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Budget limit
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (budget?.limit ? 'Update Budget' : 'Set Budget')}
            </button>
          </div>
        </form>
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
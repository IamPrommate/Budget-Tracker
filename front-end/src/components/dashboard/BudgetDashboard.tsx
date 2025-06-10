import { DollarSign, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { BudgetSetupModal, ExpenseModal } from "../modal/modal";
import { CalendarView } from "./Calendar";
import { CATEGORIES } from "@/types/budget";
import { useAuth } from "@/context/AuthContext";

// Mock data (can be replaced by API later)
const mockExpenses = [
  { id: '1', amount: 25.5, category: 'Food', date: '2025-06-05', description: 'Lunch' },
  { id: '2', amount: 15.0, category: 'Transportation', date: '2025-06-05', description: 'Bus fare' },
  { id: '3', amount: 45.0, category: 'Food', date: '2025-06-10', description: 'Groceries' },
  { id: '4', amount: 30.0, category: 'Entertainment', date: '2025-06-12', description: 'Movie tickets' },
  { id: '5', amount: 80.0, category: 'Shopping', date: '2025-06-15', description: 'Clothes' },
];

export interface IBudget {
  id?: string;
  userId: string;
  limit: number;
  month: string; // ISO format
}

export interface BudgetRequest {
  limit: number;
  month: string;
}

export interface BudgetUpdateRequest {
  limit: number;
  month: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export const BudgetDashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useAuth();
  const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

  const currentMonthBudget = budgets.find((b) => {
    const budgetMonth = new Date(b.month).toISOString().slice(0, 7);

    return budgetMonth === currentMonthStr;
  }) || { limit: 0 };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const fetchBudgets = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/budget", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch budgets");
      const data = await res.json();

      console.log("fetching...", {data})
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching budgets:", err);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date.toISOString().split("T")[0]);
    setShowExpenseModal(true);
  };

  const createBudget = async (budgetData: BudgetRequest) => {
    if (!user?.token) return;
    try {
      const res = await fetch("http://localhost:3000/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(budgetData),
      });

      console.log({budgetData})

      if (!res.ok) throw new Error("Failed to create budget");
      await fetchBudgets();
    } catch (err) {
      console.error("Error creating budget:", err);
    }
  };

  const updateBudget = async (budgetId: string, budgetData: BudgetUpdateRequest) => {
    if (!user?.token) return;
    try {
      const res = await fetch(`http://localhost:3000/budget/${budgetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(budgetData),
      });

      if (!res.ok) throw new Error("Failed to update budget");
      await fetchBudgets();
    } catch (err) {
      console.error("Error updating budget:", err);
    }
  };

  const handleSaveBudget = async (data: { limit: number; month: string }) => {
  if (!data?.month) {
    console.error("Invalid or missing month");
    return;
  }

  const budgetData: BudgetRequest = {
    limit: data.limit,
    month: data.month,
  };

  const existingBudget = budgets.find((b) => {
    const budgetMonthStr = new Date(b.month).toISOString().slice(0, 7)
    const targetMonthStr = new Date(budgetData.month).toISOString().slice(0, 7);
    return budgetMonthStr === targetMonthStr;
  });

  if (existingBudget?.id) {
    await updateBudget(existingBudget.id, budgetData);
  } else {
    await createBudget(budgetData);
  }
};


  const handleSaveExpense = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const getTotalSpending = () =>
    expenses
      .filter((e) => e.date.startsWith(currentMonthStr))
      .reduce((sum, e) => sum + e.amount, 0);

  const getCategorySpending = (categoryName: string) =>
    expenses
      .filter((e) => e.category === categoryName && e.date.startsWith(currentMonthStr))
      .reduce((sum, e) => sum + e.amount, 0);

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) return "#ef4444";
    if (percentage >= 75) return "#f59e0b";
    return "#10b981";
  };

  const currentBudgetLimit = currentMonthBudget?.limit ?? 0;
  const totalSpent = getTotalSpending();
  const remaining = currentBudgetLimit - totalSpent;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-8 h-8 text-green-500" />
            <span className="text-xl font-semibold">Budget Tracker</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.username || "User"}!</span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h1>
            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setShowBudgetModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: "#34eb7d" }}
          >
            <Settings className="w-4 h-4" />
            <span>Set Budget</span>
          </button>
        </div>

        {/* Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Monthly Budget</h2>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Adjust Budget
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Budget limit</div>
              <div className="text-2xl font-bold">${currentBudgetLimit.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Spent</div>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Remaining</div>
              <div className={`text-2xl font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${remaining.toFixed(2)}
              </div>
            </div>
          </div>
          {currentBudgetLimit > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min((totalSpent / currentBudgetLimit) * 100, 100)}%`,
                    backgroundColor: getProgressColor(totalSpent, currentBudgetLimit),
                  }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {((totalSpent / currentBudgetLimit) * 100).toFixed(1)}% of budget used
              </div>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {CATEGORIES.map((category) => {
            const spent = getCategorySpending(category.name);
            return (
              <div key={category.name} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="text-xl font-bold">${spent.toFixed(2)}</div>
              </div>
            );
          })}
        </div>

        {/* Calendar */}
        <CalendarView currentDate={currentDate} expenses={expenses} onDateClick={handleDateClick} />
      </div>

      {/* Modals */}
      <BudgetSetupModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        currentMonth={currentMonthStr}
        budget={currentMonthBudget}
        onSave={handleSaveBudget}
      />
      <ExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        selectedDate={selectedDate}
        onSave={handleSaveExpense}
      />
    </div>
  );
};

export default BudgetDashboard;

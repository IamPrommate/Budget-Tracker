import { DollarSign, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useState } from "react";
import { mockBudgets, mockExpenses, BudgetSetupModal, ExpenseModal } from "../modal/modal";
import { CalendarView } from "./Calendar";
import { CATEGORIES } from "@/types/budget";
import { useAuth } from "@/context/AuthContext";

// // Main Budget Dashboard Component
// export const BudgetDashboard: React.FC = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [budgets, setBudgets] = useState(mockBudgets);
//   const [expenses, setExpenses] = useState(mockExpenses);
//   const [showBudgetModal, setShowBudgetModal] = useState(false);
//   const [showExpenseModal, setShowExpenseModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const { user, logout } = useAuth();

//   const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
//   const currentMonthBudgets = budgets.filter(b => b.month === currentMonthStr);

//   const navigateMonth = (direction) => {
//     const newDate = new Date(currentDate);
//     newDate.setMonth(newDate.getMonth() + direction);
//     setCurrentDate(newDate);
//   };

//   const handleDateClick = (date) => {
//     setSelectedDate(date.toISOString().split('T')[0]);
//     setShowExpenseModal(true);
//   };

//   const handleSaveBudget = (budgetArray) => {
//     // In real app, this would make API calls
//     const updatedBudgets = [...budgets.filter(b => b.month !== currentMonthStr)];
//     budgetArray.forEach(budget => {
//       updatedBudgets.push({ ...budget, _id: Date.now().toString() });
//     });
//     setBudgets(updatedBudgets);
//   };

//   const handleSaveExpense = (expense) => {
//     setExpenses(prev => [...prev, expense]);
//   };

//   const getCategorySpending = (categoryName) => {
//     return expenses
//       .filter(exp => exp.category === categoryName && exp.date.startsWith(currentMonthStr))
//       .reduce((sum, exp) => sum + exp.amount, 0);
//   };

//   const getProgressColor = (spent, budget) => {
//     const percentage = (spent / budget) * 100;
//     if (percentage >= 90) return '#ef4444';
//     if (percentage >= 75) return '#f59e0b';
//     return '#10b981';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation */}
//       <nav className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <DollarSign className="w-8 h-8" style={{ color: '#34eb7d' }} />
//               <span className="text-xl font-semibold text-gray-900">Budget Tracker</span>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-700">Welcome, {user?.username}!</span>
//               <button
//                 onClick={logout}
//                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => navigateMonth(-1)}
//               className="p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>
//             <h1 className="text-2xl font-bold text-gray-900">
//               {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//             </h1>
//             <button
//               onClick={() => navigateMonth(1)}
//               className="p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//           <button
//             onClick={() => setShowBudgetModal(true)}
//             style={{ backgroundColor: '#34eb7d' }}
//             className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
//           >
//             <Settings className="w-4 h-4" />
//             <span>Set Budget</span>
//           </button>
//         </div>

//         {/* Budget Overview */}
//         {currentMonthBudgets.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             {CATEGORIES.map(category => {
//               const budget = currentMonthBudgets.find(b => b.category === category.name);
//               const spent = getCategorySpending(category.name);
//               const percentage = budget ? (spent / budget.limit) * 100 : 0;
              
//               return (
//                 <div key={category.name} className="bg-white p-4 rounded-lg shadow-sm border">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center space-x-2">
//                       <div 
//                         className="w-3 h-3 rounded-full"
//                         style={{ backgroundColor: category.color }}
//                       />
//                       <span className="font-medium text-gray-900">{category.name}</span>
//                     </div>
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900">
//                     ${spent.toFixed(2)}
//                   </div>
//                   <div className="text-sm text-gray-500 mb-2">
//                     of ${budget ? budget.limit.toFixed(2) : '0.00'}
//                   </div>
//                   {budget && (
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="h-2 rounded-full transition-all"
//                         style={{
//                           width: `${Math.min(percentage, 100)}%`,
//                           backgroundColor: getProgressColor(spent, budget.limit)
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Calendar */}
//         <CalendarView
//           currentDate={currentDate}
//           expenses={expenses}
//           onDateClick={handleDateClick}
//         />

//         {/* Legend */}
//         <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border">
//           <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
//           <div className="flex flex-wrap gap-4">
//             {CATEGORIES.map(category => (
//               <div key={category.name} className="flex items-center space-x-2">
//                 <div 
//                   className="w-3 h-3 rounded-full"
//                   style={{ backgroundColor: category.color }}
//                 />
//                 <span className="text-sm text-gray-700">{category.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       <BudgetSetupModal
//         isOpen={showBudgetModal}
//         onClose={() => setShowBudgetModal(false)}
//         currentMonth={currentMonthStr}
//         budgets={currentMonthBudgets}
//         onSave={handleSaveBudget}
//       />

//       <ExpenseModal
//         isOpen={showExpenseModal}
//         onClose={() => setShowExpenseModal(false)}
//         selectedDate={selectedDate}
//         onSave={handleSaveExpense}
//       />
//     </div>
//   );
// };

// export default BudgetDashboard;

// Main Budget Dashboard Component
export const BudgetDashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [budgets, setBudgets] = useState(mockBudgets);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { user, logout } = useAuth();

  const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthBudget = budgets.find(b => b.month === currentMonthStr) || { limit: 0 };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setShowExpenseModal(true);
  };

  const handleSaveBudget = (budgetData) => {
    // In real app, this would make API calls
    const updatedBudgets = budgets.filter(b => b.month !== currentMonthStr);
    updatedBudgets.push({ ...budgetData, _id: Date.now().toString() });
    setBudgets(updatedBudgets);
  };

  const handleSaveExpense = (expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  const getTotalSpending = () => {
    return expenses
      .filter(exp => exp.date.startsWith(currentMonthStr))
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getCategorySpending = (categoryName) => {
    return expenses
      .filter(exp => exp.category === categoryName && exp.date.startsWith(currentMonthStr))
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getProgressColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 75) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8" style={{ color: '#34eb7d' }} />
              <span className="text-xl font-semibold text-gray-900">Budget Tracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username || 'User'}!</span>
              <button
                onClick={logout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h1>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setShowBudgetModal(true)}
            style={{ backgroundColor: '#34eb7d' }}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
          >
            <Settings className="w-4 h-4" />
            <span>Set Budget</span>
          </button>
        </div>

        {/* Budget Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Budget</h2>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Adjust Budget
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Budget Limit</div>
              <div className="text-2xl font-bold text-gray-900">
                ${currentMonthBudget.limit.toFixed(2)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Spent</div>
              <div className="text-2xl font-bold text-gray-900">
                ${getTotalSpending().toFixed(2)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Remaining</div>
              <div className={`text-2xl font-bold ${
                currentMonthBudget.limit - getTotalSpending() >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${(currentMonthBudget.limit - getTotalSpending()).toFixed(2)}
              </div>
            </div>
          </div>
          
          {currentMonthBudget.limit > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min((getTotalSpending() / currentMonthBudget.limit) * 100, 100)}%`,
                    backgroundColor: getProgressColor(getTotalSpending(), currentMonthBudget.limit)
                  }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {((getTotalSpending() / currentMonthBudget.limit) * 100).toFixed(1)}% of budget used
              </div>
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {CATEGORIES.map(category => {
            const spent = getCategorySpending(category.name);
            
            return (
              <div key={category.name} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  ${spent.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar */}
        <CalendarView
          currentDate={currentDate}
          expenses={expenses}
          onDateClick={handleDateClick}
        />

        {/* Legend */}
        {/* <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-4">
            {CATEGORIES.map(category => (
              <div key={category.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
        </div> */}
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
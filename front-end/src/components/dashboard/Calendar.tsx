import { CATEGORIES } from "@/types/budget";

// Calendar Component
export const CalendarView = ({ currentDate, expenses, onDateClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getDayExpenses = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return expenses.filter(exp => exp.date === dateStr);
  };

  const getTotalForDate = (date) => {
    return getDayExpenses(date).reduce((sum, exp) => sum + exp.amount, 0);
  };

  const getCategoryColor = (categoryName) => {
    const category = CATEGORIES.find(cat => cat.name === categoryName);
    return category ? category.color : '#6b7280';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="grid grid-cols-7 gap-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-b">
            {day}
          </div>
        ))}
        
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month;
          const dayExpenses = getDayExpenses(date);
          const total = getTotalForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              onClick={() => isCurrentMonth && onDateClick(date)}
              className={`
                min-h-24 p-2 border-b border-r cursor-pointer transition-colors
                ${isCurrentMonth ? 'hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                ${isToday ? 'bg-blue-50 border-blue-200' : ''}
              `}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                {date.getDate()}
              </div>
              
              {isCurrentMonth && dayExpenses.length > 0 && (
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-1">
                    {dayExpenses.slice(0, 2).map((expense, idx) => (
                      <div
                        key={idx}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getCategoryColor(expense.category) }}
                      />
                    ))}
                    {dayExpenses.length > 2 && (
                      <div className="text-xs text-gray-400">+{dayExpenses.length - 2}</div>
                    )}
                  </div>
                  <div className="text-xs font-medium text-gray-700">
                    ${total.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
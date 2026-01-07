import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ActivityService from '../../../utils/api/activityService';

/**
 * ActivityHeatmap Component
 * Beautiful GitHub-style contribution graph showing daily user activity
 * High UX with smooth animations, tooltips, and responsive design
 */
const ActivityHeatmap = ({ userId = null }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [heatmapData, setHeatmapData] = useState({});
  const [stats, setStats] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const loadActivityData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ActivityService.getActivityDashboard(selectedYear, userId);
      
      if (response.success) {
        setHeatmapData(response.data.heatmap || {});
        setStats(response.data.stats || null);
        setAvailableYears(response.data.availableYears || [selectedYear]);
      }
    } catch (err) {
      console.error('Failed to load activity data:', err);
      setError('Unable to load activity data');
    } finally {
      setLoading(false);
    }
  }, [selectedYear, userId]);

  useEffect(() => {
    loadActivityData();
  }, [loadActivityData]);

  /**
   * Generate calendar grid grouped by months
   * Returns array of months, each containing weeks
   */
  const generateYearGrid = () => {
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(selectedYear, month, 1);
      const monthEnd = new Date(selectedYear, month + 1, 0);
      
      // Start from the first Sunday before or on the 1st of the month
      const gridStart = new Date(monthStart);
      gridStart.setDate(monthStart.getDate() - monthStart.getDay());
      
      const weeks = [];
      let currentWeek = [];
      const currentDate = new Date(gridStart);
      
      // Generate weeks for this month
      while (currentDate <= monthEnd || (currentWeek.length > 0 && currentWeek.length < 7)) {
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
        
        const dateStr = currentDate.toISOString().split('T')[0];
        const isInMonth = currentDate.getMonth() === month && currentDate.getFullYear() === selectedYear;
        const activity = heatmapData[dateStr];
        const isToday = dateStr === new Date().toISOString().split('T')[0];
        
        currentWeek.push({
          date: new Date(currentDate),
          dateStr,
          isInMonth,
          activity: activity || null,
          isToday,
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Add the last week if it has days
      if (currentWeek.length > 0) {
        // Fill remaining days with empty cells
        while (currentWeek.length < 7) {
          currentWeek.push({ isEmpty: true });
        }
        weeks.push(currentWeek);
      }
      
      months.push({
        month,
        name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month],
        weeks,
      });
    }
    
    return months;
  };

  /**
   * Get color intensity based on activity count
   */
  const getActivityColor = (activity) => {
    if (!activity || !activity.active) return 'bg-gray-100 hover:bg-gray-200';
    
    const count = activity.count || 0;
    
    if (count >= 20) return 'bg-green-600 hover:bg-green-700';
    if (count >= 10) return 'bg-green-500 hover:bg-green-600';
    if (count >= 5) return 'bg-green-400 hover:bg-green-500';
    if (count >= 1) return 'bg-green-300 hover:bg-green-400';
    
    return 'bg-gray-100 hover:bg-gray-200';
  };

  /**
   * Format date for tooltip
   */
  const formatTooltipDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  /**
   * Handle mouse enter on day cell
   */
  const handleDayHover = (day, event) => {
    setHoveredDay(day);
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const months = generateYearGrid();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="text-center py-8">
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      {/* Header with Stats and Year Selector */}
      <div className="flex items-start justify-between mb-6 gap-6">
        <div className="flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Activity Calendar</h3>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Stats */}
          {stats && (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{stats.currentStreak}</p>
                <p className="text-[10px] text-gray-600">Current Streak</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{stats.longestStreak}</p>
                <p className="text-[10px] text-gray-600">Best Streak</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{stats.totalActiveDays}</p>
                <p className="text-[10px] text-gray-600">Total Days</p>
              </div>
            </div>
          )}
          
          {/* Year Selector */}
          {availableYears.length > 1 && (
            <>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const currentIndex = availableYears.indexOf(selectedYear);
                    if (currentIndex < availableYears.length - 1) {
                      setSelectedYear(availableYears[currentIndex + 1]);
                    }
                  }}
                  disabled={availableYears.indexOf(selectedYear) === availableYears.length - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="text-sm font-semibold text-gray-700 min-w-[60px] text-center">
                  {selectedYear}
                </span>
                
                <button
                  onClick={() => {
                    const currentIndex = availableYears.indexOf(selectedYear);
                    if (currentIndex > 0) {
                      setSelectedYear(availableYears[currentIndex - 1]);
                    }
                  }}
                  disabled={availableYears.indexOf(selectedYear) === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full">
          {/* Month Labels Row */}
          <div className="flex mb-3">
            {/* Spacer for day labels */}
            <div className="w-[38px] flex-shrink-0"></div>
            
            {/* Month labels */}
            {months.map((monthData) => (
              <div 
                key={monthData.month}
                className="text-sm font-semibold text-gray-700 mr-1"
                style={{ width: `${monthData.weeks.length * 13}px` }}
              >
                {monthData.name}
              </div>
            ))}
          </div>
          
          {/* Grid */}
          <div className="flex gap-0">
            {/* Day labels - Show only once */}
            <div className="flex flex-col gap-[2px] mr-2 flex-shrink-0">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div 
                  key={day}
                  className="h-[11px] w-[32px] text-[9px] text-gray-500 font-medium flex items-center justify-start"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* All months in horizontal row */}
            {months.map((monthData) => (
              <div key={monthData.month} className="flex gap-[2px] mr-1">
                {monthData.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[2px]">
                    {week.map((day, dayIndex) => (
                      day.isEmpty ? (
                        <div key={dayIndex} className="w-[11px] h-[11px]" />
                      ) : (
                        <div
                          key={dayIndex}
                          onMouseEnter={(e) => day.isInMonth && handleDayHover(day, e)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`
                            w-[11px] h-[11px] rounded-[2px] transition-all duration-150
                            ${day.isInMonth ? getActivityColor(day.activity) : 'bg-transparent'}
                            ${day.isInMonth ? 'cursor-pointer hover:ring-1 hover:ring-gray-400' : ''}
                          `}
                          title={day.isInMonth ? formatTooltipDate(day.date) : ''}
                        />
                      )
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
            <span className="text-[10px] text-gray-500">Less</span>
            <div className="flex gap-[3px]">
              <div className="w-[11px] h-[11px] rounded-[2px] bg-gray-100 border border-gray-200"></div>
              <div className="w-[11px] h-[11px] rounded-[2px] bg-green-300"></div>
              <div className="w-[11px] h-[11px] rounded-[2px] bg-green-400"></div>
              <div className="w-[11px] h-[11px] rounded-[2px] bg-green-500"></div>
              <div className="w-[11px] h-[11px] rounded-[2px] bg-green-600"></div>
            </div>
            <span className="text-[10px] text-gray-500">More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && hoveredDay.isInMonth && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <div className="font-semibold">{formatTooltipDate(hoveredDay.date)}</div>
            <div className="text-gray-300 mt-1">
              {hoveredDay.activity?.active 
                ? `${hoveredDay.activity.count} ${hoveredDay.activity.count === 1 ? 'activity' : 'activities'}`
                : 'No activity'}
            </div>
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHeatmap;

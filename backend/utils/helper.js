export const fillMissingDates = (data, type) => {
  const filled = [...data];
  const today = new Date();

  switch (type) {
    case "daily": {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      for (
        let d = new Date(thirtyDaysAgo);
        d <= today;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];
        if (!filled.find((item) => item.date === dateStr)) {
          filled.push({
            date: dateStr,
            total_revenue: 0,
          });
        }
      }
      return filled.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    case "monthly": {
      const twelveMonthsAgo = new Date(today);
      twelveMonthsAgo.setMonth(today.getMonth() - 12);

      const months = [];
      let currentDate = new Date(twelveMonthsAgo);

      while (currentDate <= today) {
        const monthStr = currentDate.toISOString().slice(0, 7);
        const monthStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        )
          .toISOString()
          .split("T")[0];

        const existingData = filled.find((item) => item.month === monthStr);

        if (existingData) {
          months.push(existingData);
        } else {
          months.push({
            month: monthStr,
            month_start: monthStart,
            total_revenue: 0,
          });
        }

        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      return months.sort((a, b) => a.month.localeCompare(b.month));
      return filled;
    }

    default:
      return filled;
  }
};

export const fillWeeklyData = (data) => {
  const today = new Date();
  const twelveWeeksAgo = new Date(today);
  twelveWeeksAgo.setDate(today.getDate() - (12 * 7));

  const dataMap = new Map(
    data.map(item => [
      String(item.week),
      {
        week: String(item.week),
        week_start: formatDateToYYYYMMDD(item.week_start),
        total_revenue: Number(item.total_revenue)
      }
    ])
  );

  const result = [];
  let currentDate = new Date(twelveWeeksAgo);

  while (currentDate <= today) {
    const yearWeek = getYearWeek(currentDate);
    const weekStart = formatDateToYYYYMMDD(getWeekStart(currentDate));

    const existingData = dataMap.get(yearWeek);
    if (existingData) {
      result.push({
        ...existingData,
        week_start: existingData.week_start || weekStart
      });
    } else {
      result.push({
        week: yearWeek,
        week_start: weekStart,
        total_revenue: 0
      });
    }

    currentDate.setDate(currentDate.getDate() + 7);
  }

  return result;
};

const formatDateToYYYYMMDD = (date) => {
  if (!date) return null;
  
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return date;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    return null;
  }

  return dateObj.toISOString().split('T')[0];
};

const getYearWeek = (date) => {
  const year = date.getFullYear();
  const oneJan = new Date(year, 0, 1);
  const week = Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  return `${year}${week.toString().padStart(2, '0')}`;
};

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};
import React, { useState } from "react";

const useCalendar = () => {
  const [newDate, setNewDate] = useState<Date>(new Date());

  const Month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const Week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const days = (date: Date) => {
    const Calendar: Date[] = [];

    const nowYear = date.getFullYear();
    const nowMonth = date.getMonth();

    const startMonthDay = new Date(nowYear, nowMonth, 1).getDay();
    const endMonthDay = new Date(nowYear, nowMonth + 1, 0).getDay();

    const prevMonthEndDate = new Date(nowYear, nowMonth, 0).getDate();
    const nowMonthEndDate = new Date(nowYear, nowMonth + 1, 0).getDate();

    for (let i = startMonthDay - 1; i >= 0; i--) {
      Calendar.push(new Date(nowYear, nowMonth - 1, prevMonthEndDate - i));
    }

    for (let i = 1; i <= nowMonthEndDate; i++) {
      Calendar.push(new Date(nowYear, nowMonth, i));
    }

    for (let i = 1; i < 7 - endMonthDay; i++) {
      Calendar.push(new Date(nowYear, nowMonth + 1, i));
    }

    return Calendar;
  };

  const allDay: Date[] = days(newDate);

  return { newDate, setNewDate, Week, Month, allDay };
};

export default useCalendar;

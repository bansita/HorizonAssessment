import React, { useState } from "react";
import dayjs from "dayjs";
import "../style/calender.css";
import "./EventModal.jsx";
import EventModal from "./EventModal.jsx";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs()); // current visible month
  const [selectedDate, setSelectedDate] = useState(null); // selected date for event creation
  const [events, setEvents] = useState([]); // array to hold events
  const [showEventModal, setShowEventModal] = useState(false); // modal visibility state

  const today = dayjs();

  // to geet thee first day of the month (0 = Sunday, 6 = Saturday)
  const startDay = currentMonth.startOf("month").day();

  const daysInMonth = currentMonth.daysInMonth();

  const daysArray = [];

  // this is to fill empty cells before the first day
  for (let i = 0; i < startDay; i++) {
    daysArray.push(<div key={`empty-${i}`} className="day-cell empty"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = currentMonth.date(d);
    const isToday = dayDate.isSame(today, "day");

    const dayKey = dayDate.format("YYYY-MM-DD");
    const dayEvents = events[dayKey] || []; // Get events for the day, default to empty array

    daysArray.push(
      <div
        key={d}
        className={`day-cell ${isToday ? "today" : ""}`}
        onClick={() => {
          setSelectedDate(dayDate);
          setShowEventModal(true);
        }}
      >
        <div className="day-number">{d}</div>

        {/* here to display events for the day */}
        {dayEvents.slice(0, 2).map((event, index) => (
          <div key={index} className="event-title">
            {event.title}
          </div>
        ))}

        {/*show more if the events>2 ...*/}
        {dayEvents.length > 2 && (
          <div className="more-events">+{dayEvents.length - 2} more</div>
        )}
      </div>
    );
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-button" onClick={goToPreviousMonth}>
          &lt;
        </button>

        <span className="month-label">{currentMonth.format("MMMM YYYY")}</span>

        <button className="nav-button" onClick={goToNextMonth}>
          &gt;
        </button>
      </div>

      <div className="weekday-row">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday-cell">
            {day}
          </div>
        ))}
      </div>

      <div className="days-grid">{daysArray}</div>

      {showEventModal && selectedDate && (
        <EventModal
          selectedDate={selectedDate}
          events={events[selectedDate.format("YYYY-MM-DD")] || []}
          onClose={() => {
            setShowEventModal(false);
            setSelectedDate(null);
          }}
          onSave={(event, editIndex = null) => {
            const key = selectedDate.format("YYYY-MM-DD");
            const updated = { ...events };

            // If editing, replace event at index
            if (editIndex !== null) {
              updated[key][editIndex] = event;
            } else {
              if (!updated[key]) updated[key] = [];
              updated[key].push(event);
            }

            setEvents(updated);
          }}
          onDelete={(index) => {
            const key = selectedDate.format("YYYY-MM-DD");
            const updated = { ...events };
            updated[key].splice(index, 1); // this will remove 1 item at position `index`

            // if no events areee left for that day, delete the keyy
            if (updated[key].length === 0) {
              delete updated[key];
            }

            setEvents(updated);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;

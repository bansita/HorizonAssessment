import React, { useState } from "react";
import "../style/eventmodel.css";

const EventModal = ({ selectedDate, onClose, onSave, onDelete, events }) => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [time, setTime] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const handleEdit = (index) => {
    const event = events[index];
    setEventTitle(event.title);
    setEventDescription(event.description);
    setTime(event.time);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    onDelete(index);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEvent = {
      date: selectedDate,
      title: eventTitle,
      description: eventDescription,
      time,
    };

    if (editingIndex !== null) {
      onSave(newEvent, editingIndex);
    } else {
      onSave(newEvent);
    }

    setEventTitle("");
    setEventDescription("");
    setTime("");
    setEditingIndex(null);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>
          {editingIndex !== null ? "Edit Event" : "Add Event"} -{" "}
          {selectedDate.format("DD MM YYYY")}
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title<span style={{ color: "red" }}> *</span>
          </label>
          <input
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />

          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="10:00 AM - 11:00 AM"
          />

          <div className="modal-actions">
            <button type="submit">
              {editingIndex !== null ? "Update" : "Add"}
            </button>
            <button type="button" onClick={onClose} className="cancel">
              Cancel
            </button>
          </div>
        </form>
        {/* existing events of the day ..... */}
        {events.length > 0 && (
          <div className="event-list">
            <h3>Events for this day:</h3>
            {events.map((event, index) => (
              <div key={index} className="event-item">
                <div>
                  <strong>{event.title}</strong>{" "}
                  {event.time && `(${event.time})`}
                  {event.description && <div>{event.description}</div>}
                </div>
                <div className="event-buttons">
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;

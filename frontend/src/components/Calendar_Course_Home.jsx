import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root'); // Set the root element for accessibility

// Generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const MyCalendar = () => {
  const [events, setEvents] = useState([
    {
      id: generateId(),
      title: 'Meeting',
      start: new Date(2025, 2, 20, 10, 0), // March 20, 2025, 10:00 AM
      end: new Date(2025, 2, 20, 12, 0),   // March 20, 2025, 12:00 PM
      description: 'Discuss project updates',
    },
    {
      id: generateId(),
      title: 'Lunch',
      start: new Date(2025, 2, 21, 12, 0), // March 21, 2025, 12:00 PM
      end: new Date(2025, 2, 21, 13, 0),   // March 21, 2025, 1:00 PM
      description: 'Lunch with team',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '' });
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [scrollToTime, setScrollToTime] = useState(new Date());
  // Add a counter state to force re-renders
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    if (events.length > 0) {
      const firstEventStart = events.reduce((earliest, event) => {
        return event.start < earliest ? event.start : earliest;
      }, events[0].start);
      setScrollToTime(firstEventStart);
    }
  }, [events]);

  const handleAddEvent = () => {
    const start = new Date(newEvent.start);
    const end = new Date(newEvent.end);

    if (end <= start) {
      alert('End time must be greater than start time');
      return;
    }

    const eventWithId = {
      ...newEvent,
      id: generateId(),
      start,
      end
    };
    
    const updatedEvents = [...events, eventWithId];
    setEvents(updatedEvents);

    // Update scrollToTime to the start time of the first event
    if (updatedEvents.length > 0) {
      const firstEventStart = updatedEvents.reduce((earliest, event) => {
        return event.start < earliest ? event.start : earliest;
      }, updatedEvents[0].start);
      setScrollToTime(firstEventStart);
    }

    setShowForm(false);
    // Force a re-render
    setRefreshCounter(prev => prev + 1);
  };

  const handleSelectSlot = (slotInfo) => {
    setDate(slotInfo.start);
    setView(Views.DAY);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // const handleRemoveEvent = () => {
  //   // Filter by ID instead of object reference
  //   const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
  //   setEvents(updatedEvents);

  //   // Update scrollToTime to the start time of the first event
  //   if (updatedEvents.length > 0) {
  //     const firstEventStart = updatedEvents.reduce((earliest, event) => {
  //       return event.start < earliest ? event.start : earliest;
  //     }, updatedEvents[0].start);
  //     setScrollToTime(firstEventStart);
  //   } else {
  //     setScrollToTime(new Date());
  //   }

  //   setShowEventModal(false);
    
  //   // Force a re-render by changing the view slightly and then back
  //   const currentView = view;
  //   if (currentView === Views.DAY || currentView === Views.WEEK) {
  //     setView(Views.MONTH);
  //     setTimeout(() => {
  //       setView(currentView);
  //       // Force another re-render by incrementing the counter
  //       setRefreshCounter(prev => prev + 1);
  //     }, 10);
  //   } else {
  //     // Force a re-render
  //     setRefreshCounter(prev => prev + 1);
  //   }
  // };

  const formats = {
    agendaDateFormat: (date, culture, localizer) =>
      localizer.format(date, 'DD/MM/YYYY', culture),
    dateRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'DD/MM/YYYY', culture)} – ${localizer.format(end, 'DD/MM/YYYY', culture)}`,
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'DD/MM/YYYY', culture)} – ${localizer.format(end, 'DD/MM/YYYY', culture)}`,
  };

  const messages = {
    today: view === Views.MONTH ? 'This Month' : view === Views.WEEK ? 'This Week' : view === Views.DAY ? 'This Day' : 'Today',
    previous: view === Views.MONTH ? 'Last Month' : view === Views.WEEK ? 'Last Week' : 'Last Day',
    next: view === Views.MONTH ? 'Next Month' : view === Views.WEEK ? 'Next Week' : 'Next Day',
  };

  return (
    <div className="calendar-container">
      <Calendar
        key={`calendar-${refreshCounter}`} // Add a key that changes to force re-render
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width: '100%' }}
        view={view}
        date={date}
        onView={(newView) => setView(newView)}
        onNavigate={(newDate) => setDate(newDate)}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        formats={formats}
        messages={messages}
        views={['month', 'week', 'day']}
        scrollToTime={scrollToTime}
        // Ensure day view shows all events
        min={new Date(0, 0, 0, 6, 0)} // Start at 6 AM
        max={new Date(0, 0, 0, 22, 0)} // End at 10 PM
      />
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Add Event
      </button>
      <Modal
        isOpen={showForm}
        onRequestClose={() => setShowForm(false)}
        contentLabel="Add Event"
        className="modal"
        overlayClassName="overlay"
      >
        <h3>Add New Event</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleAddEvent(); }}>
          <input
            type="text"
            placeholder="Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="block w-full p-2 mb-2 border rounded"
          />
          <input
            type="datetime-local"
            placeholder="Start"
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
            className="block w-full p-2 mb-2 border rounded"
          />
          <input
            type="datetime-local"
            placeholder="End"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            className="block w-full p-2 mb-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="block w-full p-2 mb-2 border rounded"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add Event
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-red-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        </form>
      </Modal>
      <Modal
        isOpen={showEventModal}
        onRequestClose={() => setShowEventModal(false)}
        contentLabel="Event Details"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedEvent && (
          <div>
            <h3>{selectedEvent.title}</h3>
            <p><strong>Start:</strong> {selectedEvent.start.toLocaleString()}</p>
            <p><strong>End:</strong> {selectedEvent.end.toLocaleString()}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            {/* <button
              onClick={handleRemoveEvent}
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
              Remove Event
            </button> */}
            <button
              onClick={() => setShowEventModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-2"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
      <style jsx>{`
        .calendar-container {
          height: 100%; /* Adjust height to fit in the "New Events" section */
          width: 100%;
          overflow: hidden;
        }

        .modal {
          position: absolute;
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          margin-right: -50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
        }
          
      `}</style>
    </div>
  );
};

export default MyCalendar;
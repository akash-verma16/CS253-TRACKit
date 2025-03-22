import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import { useEvents } from '../contexts/EventContext';
import { useNotification } from '../contexts/NotificationContext';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');

const MyCalendar = () => {
  const { allEvents, loading, refreshEvents } = useEvents();
  const { showNotification } = useNotification();

  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [scrollToTime, setScrollToTime] = useState(new Date());
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Update scrollToTime based on first event
  useEffect(() => {
    if (allEvents.length > 0) {
      try {
        const firstEventStart = allEvents.reduce((earliest, event) => {
          return event.start < earliest ? event.start : earliest;
        }, allEvents[0].start);
        setScrollToTime(firstEventStart);
      } catch (err) {
        console.warn("Error setting scroll time:", err);
      }
    }
  }, [allEvents]);

  const handleSelectSlot = (slotInfo) => {
    setDate(slotInfo.start);
    setView(Views.DAY);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleManualRefresh = () => {
    refreshEvents();
    showNotification('Refreshing calendar events...', 'info');
    setRefreshCounter(prev => prev + 1);
  };

  // Custom event styling with course colors
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.color || '#3174ad',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  // Custom event component to show course code
  const EventComponent = ({ event }) => (
    <div>
      <strong>{event.title}</strong>
      {event.courseCode && (
        <div className="text-xs text-white opacity-90">{event.courseCode}</div>
      )}
    </div>
  );

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
      {loading && (
        <div className="text-center py-2 text-blue-500 bg-white rounded shadow mb-2">
          Loading calendar events...
        </div>
      )}
      
      <div className="flex justify-end mb-2">
        <button 
          onClick={handleManualRefresh}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs"
        >
          Refresh Calendar
        </button>
      </div>
      
      <Calendar
        key={`calendar-${refreshCounter}`}
        localizer={localizer}
        events={allEvents}
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
        min={new Date(0, 0, 0, 6, 0)}
        max={new Date(0, 0, 0, 22, 0)}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent
        }}
      />
      
      <Modal
        isOpen={showEventModal}
        onRequestClose={() => setShowEventModal(false)}
        contentLabel="Event Details"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedEvent && (
          <div>
            <h3 className="text-xl font-bold mb-3">{selectedEvent.title}</h3>
            
            {/* Course information */}
            {selectedEvent.courseName && (
              <div 
                className="mb-3 p-2 rounded" 
                style={{ 
                  backgroundColor: selectedEvent.color || '#3174ad',
                  color: 'white'
                }}
              >
                <p className="font-bold">{selectedEvent.courseCode}</p>
                <p>{selectedEvent.courseName}</p>
              </div>
            )}
            
            <p className="mb-2"><strong>Start:</strong> {selectedEvent.start.toLocaleString()}</p>
            <p className="mb-2"><strong>End:</strong> {selectedEvent.end.toLocaleString()}</p>
            <p className="mb-4"><strong>Description:</strong> {selectedEvent.description || 'No description provided'}</p>
            
            <button
              onClick={() => setShowEventModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
      <style jsx>{`
        .calendar-container {
          height: 100%;
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
          z-index: 101;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          z-index: 100;
        }

        /* Fix for toolbar buttons spacing */
        :global(.rbc-toolbar) {
          flex-wrap: nowrap !important;
          font-size: 0.9rem;
        }
        
        :global(.rbc-toolbar button) {
          padding: 5px 8px !important;
          margin: 0 1px !important;
        }
        
        :global(.rbc-btn-group) {
          white-space: nowrap;
          margin: 0 2px !important;
        }
        
        /* Fix for potential z-index issues */
        :global(.rbc-calendar) {
          z-index: 1;
        }
        
        /* Improve event display */
        :global(.rbc-event) {
          padding: 2px 3px !important;
        }
      `}</style>
    </div>
  );
};

export default MyCalendar;
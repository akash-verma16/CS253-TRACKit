import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import { useEvents } from '../contexts/EventContext';
import { useCourse } from '../contexts/CourseContext';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');

const MyCalendar = () => {
  const { courseDetails } = useCourse();
  const { eventsByCourse, loading, refreshEvents } = useEvents();
  
  const [courseEvents, setCourseEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [scrollToTime, setScrollToTime] = useState(new Date());
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Get events for this course from the context
  useEffect(() => {
    if (courseDetails?.id && eventsByCourse[courseDetails.id]) {
      setCourseEvents(eventsByCourse[courseDetails.id]);
    } else {
      setCourseEvents([]);
    }
  }, [courseDetails, eventsByCourse]);

  // Update scrollToTime based on first event
  useEffect(() => {
    if (courseEvents.length > 0) {
      try {
        const firstEventStart = courseEvents.reduce((earliest, event) => {
          return event.start < earliest ? event.start : earliest;
        }, courseEvents[0].start);
        setScrollToTime(firstEventStart);
      } catch (err) {
        console.warn("Error setting scroll time:", err);
      }
    }
  }, [courseEvents]);

  const handleSelectSlot = (slotInfo) => {
    setDate(slotInfo.start);
    setView(Views.DAY);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Custom toolbar to fit all buttons in one line
  const CustomToolbar = (toolbar) => {
    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={() => toolbar.onNavigate('PREV')}>
            {view === Views.MONTH ? 'Last Month' : view === Views.WEEK ? 'Last Week' : 'Last Day'}
          </button>
          <button type="button" onClick={() => toolbar.onNavigate('TODAY')}>
            {view === Views.MONTH ? 'This Month' : view === Views.WEEK ? 'This Week' : 'This Day'}
          </button>
          <button type="button" onClick={() => toolbar.onNavigate('NEXT')}>
            {view === Views.MONTH ? 'Next Month' : view === Views.WEEK ? 'Next Week' : 'Next Day'}
          </button>
        </span>
        <span className="rbc-toolbar-label">{toolbar.label}</span>
        <span className="rbc-btn-group">
          {toolbar.views.map(view => (
            <button 
              key={view}
              type="button"
              onClick={() => toolbar.onView(view)}
              className={toolbar.view === view ? 'rbc-active' : ''}
            >
              {view === 'month' ? 'Month' : view === 'week' ? 'Week' : 'Day'}
            </button>
          ))}
        </span>
      </div>
    );
  };

  const formats = {
    agendaDateFormat: (date, culture, localizer) =>
      localizer.format(date, 'DD/MM/YYYY', culture),
    dateRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'DD/MM/YYYY', culture)} – ${localizer.format(end, 'DD/MM/YYYY', culture)}`,
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, 'DD/MM/YYYY', culture)} – ${localizer.format(end, 'DD/MM/YYYY', culture)}`,
  };

  return (
    <div className="calendar-container">
      {loading && (
        <div className="text-center py-2 text-blue-500">
          Loading calendar events...
        </div>
      )}
      
      <Calendar
        key={`calendar-${refreshCounter}`}
        localizer={localizer}
        events={courseEvents}
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
        views={['month', 'week', 'day']}
        scrollToTime={scrollToTime}
        min={new Date(0, 0, 0, 6, 0)}
        max={new Date(0, 0, 0, 22, 0)}
        components={{
          toolbar: CustomToolbar
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
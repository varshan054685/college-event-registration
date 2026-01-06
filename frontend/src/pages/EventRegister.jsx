import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';

const EventRegister = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await eventAPI.getEvent(id);
      setEvent(response.data);
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await eventAPI.registerForEvent(id);
      setSuccess('Successfully registered for the event!');
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <div className="alert alert-error">Event not found</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1rem' }}>{event.title}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="event-card">
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Date:</strong> {formatDate(event.date)}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Category:</strong> {event.category}</p>
          <p>
            <strong>Participants:</strong> {event.currentParticipants} / {event.maxParticipants}
          </p>
          <p><strong>Status:</strong> {event.status}</p>
          
          {event.currentParticipants < event.maxParticipants ? (
            <button onClick={handleRegister} className="btn btn-success" style={{ marginTop: '1rem' }}>
              Register for this Event
            </button>
          ) : (
            <p style={{ color: 'red', marginTop: '1rem' }}>Event is full</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegister;






import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#2c3e50' }}>
          Welcome to College Event Registration
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
          Discover and register for exciting college events
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/events">
            <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 30px' }}>
              Browse Events
            </button>
          </Link>
          <Link to="/register">
            <button className="btn btn-success" style={{ fontSize: '1.1rem', padding: '12px 30px' }}>
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;






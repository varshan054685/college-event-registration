import React from "react";

const EventCard = ({ event }) => {
  if (!event) return null;

  return (
    <div style={{ border: "1px solid #ccc", padding: "12px", margin: "10px" }}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      {event.date && <p><b>Date:</b> {event.date}</p>}
      {event.venue && <p><b>Venue:</b> {event.venue}</p>}
    </div>
  );
};

export default EventCard;

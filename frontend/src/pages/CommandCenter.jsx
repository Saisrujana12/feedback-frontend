import React from "react";
import NotificationBell from "../components/notifications/NotificationBell";
import FeedbackCard from "../components/feedback/FeedbackCard";
import { mockFeedbacks } from "../data/mockData";
import "./CommandCenter.css";

const CommandCenter = () => {
  return (
    <div className="command-center">
      <header>
        <h1>Command Center</h1>
        <NotificationBell />
      </header>

      <section className="feedback-section">
        <h2>Feedbacks</h2>
        <div className="feedback-list">
          {mockFeedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CommandCenter;
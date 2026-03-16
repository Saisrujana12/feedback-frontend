import React from "react";
import "./FeedbackCard.css";

const FeedbackCard = ({ feedback }) => {
  const getSentimentClass = (sentiment) => {
    switch (sentiment) {
      case "POSITIVE":
        return "sentiment-positive";
      case "NEUTRAL":
        return "sentiment-neutral";
      case "NEGATIVE":
        return "sentiment-negative";
      default:
        return "";
    }
  };

  return (
    <div className="feedback-card">
      <div className="card-header">
        <img src={feedback.user.avatar} alt="avatar" className="avatar" />
        <div>
          <h4>{feedback.user.name}</h4>
          <span className="time-ago">
            {new Date(feedback.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="card-body">
        <p>{feedback.message}</p>
        {feedback.attachment && (
          <img
            src={feedback.attachment}
            alt="attachment"
            className="attachment-thumbnail"
          />
        )}
      </div>

      <div className="card-footer">
        <span className={`sentiment-badge ${getSentimentClass(feedback.sentiment)}`}>
          {feedback.sentiment}
        </span>
        <div className="tags">
          {feedback.tags.map((tag, index) => (
            <span key={index} className="tag-chip">
              {tag.replace("_", " ")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
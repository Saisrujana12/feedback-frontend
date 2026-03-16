// Mock data for Echo Feedback Management Platform

export const mockFeedbacks = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    category: "Bug",
    sentiment: "POSITIVE",
    tags: ["BUG", "FEATURE_REQUEST"],
    message: "The app crashes when I try to upload a file.",
    attachment: "https://via.placeholder.com/150",
    upvotes: 12,
    comments: 5,
    createdAt: "2026-03-10T10:00:00Z",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    category: "Feature Request",
    sentiment: "NEUTRAL",
    tags: ["FEATURE_REQUEST"],
    message: "It would be great to have a dark mode.",
    attachment: null,
    upvotes: 8,
    comments: 2,
    createdAt: "2026-03-12T14:30:00Z",
  },
  {
    id: 3,
    user: {
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    category: "Complaint",
    sentiment: "NEGATIVE",
    tags: ["COMPLAINT"],
    message: "The app is very slow on my device.",
    attachment: "https://via.placeholder.com/150",
    upvotes: 3,
    comments: 1,
    createdAt: "2026-03-15T09:00:00Z",
  },
];

export const mockNotifications = [
  {
    id: 1,
    type: "upvote",
    message: "John Doe upvoted your feedback.",
    createdAt: "2026-03-16T08:00:00Z",
    isRead: false,
  },
  {
    id: 2,
    type: "comment",
    message: "Jane Smith commented on your feedback.",
    createdAt: "2026-03-16T07:45:00Z",
    isRead: false,
  },
  {
    id: 3,
    type: "status_change",
    message: "Your feedback status changed to 'In Progress'.",
    createdAt: "2026-03-15T18:30:00Z",
    isRead: true,
  },
];

export const mockLeaderboard = [
  {
    rank: 1,
    name: "Srujana",
    avatar: "https://i.pravatar.cc/150?img=4",
    points: 1200,
    badges: ["Bug Hunter", "Top Contributor"],
  },
  {
    rank: 2,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    points: 1100,
    badges: ["First Echo"],
  },
  {
    rank: 3,
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    points: 950,
    badges: ["Veteran"],
  },
];
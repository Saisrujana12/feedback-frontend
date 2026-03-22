export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required.";
  if (!re.test(email)) return "Please enter a valid email format (e.g., user@domain.com).";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters long.";
  // For production complexity you could add regex for numbers/symbols here, 
  // but keeping it simple for UX currently.
  return null;
};

export const validateName = (name) => {
  if (!name || name.trim().length === 0) return "Name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters long.";
  return null;
};

export const validateFeedback = (title, description) => {
  if (!title || title.trim().length < 3) return "Title requires at least 3 characters.";
  if (!description || description.trim().length < 10) return "Please provide at least 10 characters in your description to be helpful.";
  return null;
};

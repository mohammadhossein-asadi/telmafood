/**
 * @param {Number} minute Cooking time
 * @returns {String}
 */

// Function to convert cooking time from minutes to a formatted string
export const getTime = (minute) => {
  // Calculate cooking time in hours and days
  const hour = Math.floor(minute / 60);
  const day = Math.floor(hour / 24);

  // Determine the most appropriate time unit (day, hour, or minute)
  const time = day || hour || minute;
  const unitIndex = [day, hour, minute].lastIndexOf(time);
  const timeUnit = ["day", "hour", "minute"][unitIndex];

  return { time, timeUnit };
};

// This function provides a convenient way to represent cooking times in a more human-friendly manner on a user interface, especially when dealing with various time scales (minutes, hours, days).

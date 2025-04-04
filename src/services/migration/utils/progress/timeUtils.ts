
import { FormattedTimeSpan } from "./types";

/**
 * Format a time span in seconds to a readable string and structured object
 */
export const formatTimeSpan = (seconds: number): FormattedTimeSpan => {
  if (seconds < 60) {
    return {
      seconds,
      formatted: `${seconds} seconds`
    };
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    const remainingSec = seconds % 60;
    return {
      seconds,
      minutes,
      formatted: `${minutes} min${minutes !== 1 ? 's' : ''} ${remainingSec > 0 ? `${remainingSec} sec` : ''}`
    };
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMin = minutes % 60;
  
  if (hours < 24) {
    return {
      seconds,
      minutes,
      hours,
      formatted: `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMin > 0 ? `${remainingMin} min` : ''}`
    };
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return {
    seconds,
    minutes,
    hours,
    days,
    formatted: `${days} day${days !== 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours} hrs` : ''}`
  };
};

  // Moved getMoodColor to a separate file, to make it more generic and reusable
  // Function to get the color of the mood based on the mood
  export const getMoodColor = mood => {
    const moodLower = mood.toLowerCase();
    // If the mood is sad, depressed, or unhappy, return the blue color
    if (moodLower.includes("sad") || moodLower.includes("depressed") || moodLower.includes("unhappy") || moodLower.includes("bad")) {
      return "bg-blue-400";
    } else if (
      moodLower.includes("happy") ||
      moodLower.includes("good") ||
      moodLower.includes("great") ||
      moodLower.includes("joyful") ||
      moodLower.includes("perfect")
    ) {
      // If the mood is happy, good, great, or joyful, return the green color
      return "bg-green-400";
    } else if (moodLower.includes("angry") || moodLower.includes("mad") || moodLower.includes("furious")) {
      // If the mood is angry, mad, or furious, return the red color
      return "bg-red-400";
    } else if (moodLower.includes("anxious") || moodLower.includes("nervous") || moodLower.includes("worried")) {
      // If the mood is anxious, nervous, or worried, return the yellow color
      return "bg-yellow-400";
    } else {
      // If the mood is not recognized, return the gray color
      return "bg-gray-200";
    }
  };
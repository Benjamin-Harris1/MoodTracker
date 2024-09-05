import React from "react";
import { View, Text, Button, TextInput, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useEffect } from "react";

export default function Mood() {
  const [mood, setMood] = React.useState("");
  const [moods, setMoods] = React.useState([]);
  const [timeUntilNextDay, setTimeUntilNextDay] = React.useState("");
  // Check if the user has already recorded their mood for today
  const hasMoodForToday = moods.some(m => m.date === new Date().toDateString());

  // Effect hook for countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow - now;

      // Calculate hours, minutes, and seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilNextDay(`${hours}:${minutes}:${seconds}`);
    };

    // Update the countdown every second
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

    
  // Function to add a moo
  const addMood = () => {
    if (mood.trim()) {
      const currentDate = new Date().toDateString();
      const todayMood = moods.find(m => m.date === currentDate);
      // If the user has not recorded their mood for today, allow them to record it (unable to input empty string with .trim() function)
      if (!todayMood) {
        setMoods([...moods, { mood: mood.trim(), date: currentDate }]);
        setMood("");
      // If the user has already recorded their mood for today, do not allow them to record again
      } else {
        alert("You've already recorded your mood for today. Come back tomorrow!");
      }
    }
  }

  // Function to get the color of the mood based on the mood
  const getMoodColor = (mood) => {
    const moodLower = mood.toLowerCase();
    // If the mood is sad, depressed, or unhappy, return the blue color
    if (moodLower.includes("sad") || moodLower.includes("depressed") || moodLower.includes("unhappy")) {
      return "bg-blue-400";
    } else if (moodLower.includes("happy") || moodLower.includes("good") || moodLower.includes("great") || moodLower.includes("joyful")) {
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

  return (
    <View className="flex-1 bg-gray-100 p-4 justify-start items-center pt-12 mt-6">
      <Text className="text-2xl mb-4 text-center font-bold">Mood Tracker</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded-md w-full max-w-md"
        placeholder="How are you feeling?"
        value={mood}
        onChangeText={setMood}
        editable={!hasMoodForToday}
      />
      <View className="w-full max-w-md">
      <Button title={hasMoodForToday ? "Already Added" : "Add Mood"} onPress={addMood} disabled={hasMoodForToday}/>
      </View>
      <Text className="mt-2 mb-2 text-sm text-gray-500 text-center">
        {hasMoodForToday
          ? `You've already recorded your mood for today. Try again in: ${timeUntilNextDay}`
          : "How are you feeling today?"}
      </Text>
      <ScrollView className="mt-4 w-full max-w-md" style={{maxHeight: 300}}>
        {moods.map(({ mood, date }, index) => (
          <View key={index} className={`p-2 mb-2 ${getMoodColor(mood)} rounded-md`}>
            <Text>{mood}</Text>
            <Text className="text-xs text-gray-500">{date}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
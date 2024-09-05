import React from "react";
import { View, Text, Button, TextInput, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useEffect } from "react";

export default function Mood() {
  const [mood, setMood] = React.useState("");
  const [moods, setMoods] = React.useState([]);
  const [timeUntilNextDay, setTimeUntilNextDay] = React.useState("");
  const hasMoodForToday = moods.some(m => m.date === new Date().toDateString());

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilNextDay(`${hours}:${minutes}:${seconds}`);
    };

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

    

  const addMood = () => {
    if (mood.trim()) {
      const currentDate = new Date().toDateString();
      const todayMood = moods.find(m => m.date === currentDate);
      if (!todayMood) {
        setMoods([...moods, { mood: mood.trim(), date: currentDate }]);
        setMood("");
      } else {
        alert("You've already recorded your mood for today. Come back tomorrow!");
      }
    }
  }

  const getMoodColor = (mood) => {
    const moodLower = mood.toLowerCase();
    if (moodLower.includes("sad") || moodLower.includes("depressed") || moodLower.includes("unhappy")) {
      return "bg-blue-400";
    } else if (moodLower.includes("happy") || moodLower.includes("good") || moodLower.includes("great") || moodLower.includes("joyful")) {
      return "bg-green-400";
    } else if (moodLower.includes("angry") || moodLower.includes("mad") || moodLower.includes("furious")) {
      return "bg-red-400";
    } else if (moodLower.includes("anxious") || moodLower.includes("nervous") || moodLower.includes("worried")) {
      return "bg-yellow-400";
    } else {
      return "bg-gray-200"; // Default color
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-4 justify-center items-center">
      <Text className="text-2xl mb-4">Mood Tracker</Text>
      <View className="w-full max-w-md">
        <TextInput
          className="border p-2 mb-4"
          placeholder="How are you feeling?"
          value={mood}
          onChangeText={setMood}
          editable={!hasMoodForToday}
        />
        <Button title="Add" onPress={addMood} disabled={hasMoodForToday}/>
        <Text className="mt-2 mb-2 text-sm text-gray-500">
          {hasMoodForToday
            ? `You've already recorded your mood for today. Try again in: ${timeUntilNextDay}`
            : "How are you feeling today?"}
        </Text>
        <ScrollView className="mt-4 w-full">
          {moods.map(({ mood, date }, index) => (
            <View key={index} className={`p-2 mb-2 ${getMoodColor(mood)}`}>
              <Text>{mood}</Text>
              <Text className="text-xs text-gray-500">{date}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
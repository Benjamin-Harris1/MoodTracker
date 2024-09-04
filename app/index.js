import React from "react";
import { View, Text, Button, TextInput, ScrollView } from "react-native";
import { Link } from "expo-router";

export default function Mood() {
  const [mood, setMood] = React.useState("");
  const [moods, setMoods] = React.useState([]);

  const addMood = () => {
    if (mood.trim()) {
      setMoods([...moods, mood]);
      setMood("");
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
        />
        <Button title="Add" onPress={addMood} />
        <ScrollView className="mt-4 w-full">
          {moods.map((mood, index) => (
            <View key={index} className={`p-2 mb-2 ${getMoodColor(mood)}`}>
              <Text>{mood}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
import React from "react";
import { View, Text, Button, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useEffect } from "react";
// Import AsyncStorage for storing data
import AsyncStorage from "@react-native-async-storage/async-storage";
import MoodDescription from "./MoodDescription";

export default function Mood() {
  const [mood, setMood] = React.useState("");
  const [moods, setMoods] = React.useState([]);
  const [selectedMood, setSelectedMood] = React.useState(null);

  // Load saved moods when the component mounts
  useEffect(() => {
    loadMoods();
  }, []);

  // Function to load moods from AsyncStorage (which is a library for storing data in the phone's memory -> sort ofl ike using localStorage)
  const loadMoods = async () => {
    try {
      const storedMoods = await AsyncStorage.getItem("moods");
      if (storedMoods) {
        setMoods(JSON.parse(storedMoods));
      }
    } catch (error) {
      console.error("Error loading moods:", error);
    }
  };

  // Function to save moods to AsyncStorage
  const saveMoods = async (moods) => {
    try {
      await AsyncStorage.setItem("moods", JSON.stringify(moods));
    } catch (error) {
      console.error("Error saving moods:", error);
    }
  };

  // Function to add a moo
  const addMood = () => {
    if (mood.trim()) {
      const now = new Date();
      const newMood = {
        mood: mood.trim(),
        description: "Click to further describe your mood...",
        date: now.toDateString(),
        time: now.toLocaleTimeString(),
      };
      // Use spread operator to add the new mood to the existing moods array
      const updatedMoods = [...moods, newMood];
      // Update the state with the new mood
      setMoods(updatedMoods);
      // Save the new mood to AsyncStorage
      saveMoods(updatedMoods);
      // Clear the input field
      setMood("");
    }
  }

  const openDescription = (index) => {
    setSelectedMood(index);
  }

  // Function to get the color of the mood based on the mood
  const getMoodColor = (mood) => {
    const moodLower = mood.toLowerCase();
    // If the mood is sad, depressed, or unhappy, return the blue color
    if (moodLower.includes("sad") || moodLower.includes("depressed") || moodLower.includes("unhappy") || moodLower.includes("bad")) {
      return "bg-blue-400";
    } else if (moodLower.includes("happy") || moodLower.includes("good") || moodLower.includes("great") || moodLower.includes("joyful") || moodLower.includes("perfect")) {
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

  if (selectedMood !== null) {
    return (
      <MoodDescription
        mood={moods[selectedMood]}
        onSave={(description) => {
          const updatedMoods = moods.map((m, i) => 
            i === selectedMood ? { ...m, description } : m
          );
          setMoods(updatedMoods);
          saveMoods(updatedMoods);
          setSelectedMood(null);
        }}
        onClose={() => setSelectedMood(null)}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4 justify-start items-center pt-12 mt-6">
      <Text className="text-2xl mb-4 text-center font-bold">Mood Tracker</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded-md w-full max-w-md"
        placeholder="How are you feeling?"
        value={mood}
        onChangeText={setMood}
      />
      <View className="w-full max-w-md">
      <Button title={"Add mood"} onPress={addMood}/>
      </View>
      <ScrollView 
        className="mt-4 w-full max-w-md" 
        style={{maxHeight: 300}}
        ref={(ref) => { this.scrollView = ref; }}
        onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
        >
        {/* Map over the moods and display each in a scroll view (using index as key) */}
        {moods.map(({ mood, description, date, time }, index) => (
          <TouchableOpacity key={index} onPress={() => openDescription(index)}>
          <View key={index} className={`p-2 mb-2 ${getMoodColor(mood)} rounded-md`}>
            <Text className>{mood}</Text>
            <Text className="text-sm mt-1 text-gray-500">{description}</Text>
            <Text className="text-xs mt-1 text-gray-800">{date} {time}</Text>
          </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
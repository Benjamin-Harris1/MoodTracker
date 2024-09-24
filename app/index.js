import React from "react";
import { View, Text, Button, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import MoodDescription from "./MoodDescription";
import { getMoodColor } from "./utils/getMoodColor";
// Import Ionicons to get vector-icons
import { Ionicons } from "@expo/vector-icons";
// Import firebase 
import { app, database } from "../firebase.js"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";


export default function Mood() {
  const [mood, setMood] = React.useState("");
  const [moods, setMoods] = React.useState([]);
  const [selectedMood, setSelectedMood] = React.useState(null);

  // Load saved moods when the component mounts
  useEffect(() => {
    loadMoods();
  }, []);

  // Function to load moods from Firestore database
  const loadMoods = async () => {
    try {
      const snapshot = await getDocs(collection(database, "moods"));
      const loadedMoods = [];
      snapshot.forEach((doc) => {
        loadedMoods.push({ id: doc.id, ...doc.data() });
      });
      // Sort the moods by date and time
      loadedMoods.sort((a, b) => {
        const dateA = `${a.date} ${a.time}`;
        const dateB = `${b.date} ${b.time}`;
        return dateA.localeCompare(dateB);
      });
      setMoods(loadedMoods);
    } catch (error) {
      console.error("Error loading moods:", error);
    }
  };

  // Function to add a mood to the Firestore database
  const addMood = async () => {
    if (mood.trim()) {
      const now = new Date();
      const newMood = {
        mood: mood.trim(),
        description: "",
        date: now.toDateString(),
        time: now.toLocaleTimeString(),
      };
      try {
        await addDoc(collection(database, "moods"), newMood);
        // Reload moods after adding a new mood
        loadMoods();
        // Clear the input field
        setMood("");
      } catch (error) {
        console.error("Error adding mood:", error);
      }
    }
  };

  // Function to delete a mood from the Firestore database
  const deleteMood = async (id) => {
    try {
      await deleteDoc(doc(database, "moods", id));
      loadMoods();
    } catch (error) {
      console.error("Error deleting mood:", error);
    }
  };

  // Function to open the MoodDescription component
  const openDescription = (index) => {
    setSelectedMood(index);
  };

  // If there is a selected mood, show the MoodDescription component
  if (selectedMood !== null) {
    return (
      // Pass the mood, onSave, and onClose props to the MoodDescription component
      <MoodDescription
        mood={moods[selectedMood]}
        onSave={(description) => {
          const updatedMoods = moods.map((m, i) => (i === selectedMood ? { ...m, description } : m));
          setMoods(updatedMoods);
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
        <Button title={"Add mood"} onPress={addMood} />
      </View>
      <ScrollView
        className="mt-4 w-full max-w-md"
        style={{ maxHeight: 500 }}
        ref={(ref) => {
          this.scrollView = ref;
        }}
        onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
      >
        {/* Map over the moods and display each in a scroll view (using index as the key) */}
        {moods.map(({ id, mood, description, date, time }, index) => (
          <View key={id} className={`p-2 mb-2 ${getMoodColor(mood)} rounded-md flex-row justify-between items-start`}>
            <TouchableOpacity onPress={() => openDescription(index)} className="flex-1">
              <Text className="font-bold">{mood}</Text>
              <Text className="text-sm mt-1 italic text-gray-600">
                {/* If there is a description, display it. If it's longer than 50 characters, truncate it to 50 characters and add "..." */}
                {/* If there is no description, display "Click to add more details about your mood..." */}
                {/* Used 50 characters instead of 25, as we felt 25 was too short */}
                {description
                  ? description.length > 50
                    ? description.slice(0, 50) + "..."
                    : description
                  : "Click to add more details about your mood..."}
              </Text>
              <Text className="text-xs mt-1 text-gray-500">
                {date} {time}
              </Text>
            </TouchableOpacity>
            {/* Delete button */}
            <TouchableOpacity onPress={() => deleteMood(id)} className="ml-2">
              {/* Ionicons is a library that provides vector icons for React Native - here we've used the trash-outline icon for a delete button */}
              <Ionicons name="trash-outline" size={16} color="gray" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

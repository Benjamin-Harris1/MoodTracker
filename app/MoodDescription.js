import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMoodColor } from './utils/getMoodColor';

export default function MoodDescription({ mood, onSave, onClose }) {
  const [description, setDescription] = React.useState(mood.description);

  // Function to handle saving the updated mood description
  const handleSave = () => {
    onSave(description);
    onClose();
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View className="flex-1 p-4 pt-20">
        {/* Header with mood as title, and a close button */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold">How are you feeling?</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        
        {/* Display the mood and date/time */}
        <View className={`p-4 rounded-lg mb-6 ${getMoodColor(mood.mood)}`}>
          <Text className="text-lg mb-2">{mood.mood}</Text>
          <Text className="text-sm text-gray-700">{mood.date} at {mood.time}</Text>
        </View>
        
        {/* Text input for the mood description */}
        <TextInput
          className="border border-gray-300 p-3 rounded-lg mb-6"
          multiline
          numberOfLines={8}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your mood in more detail..."
          textAlignVertical="top"
        />
        
        {/* Save button */}
        <TouchableOpacity 
          onPress={handleSave}
          className="bg-blue-500 p-4 rounded-lg"
        >
          <Text className="text-white text-center font-bold text-lg">Save Description</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
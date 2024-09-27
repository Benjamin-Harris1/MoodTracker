import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMoodColor } from './utils/getMoodColor';
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { database } from '../firebase'; // Import Firebase database
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

export default function MoodDescription({ mood, onSave, onClose }) {
  const [description, setDescription] = useState(mood.description);
  const [imageUri, setImageUri] = useState(mood.imageUri || null);

  // Function to handle saving the updated mood description
  const handleSave = async () => {
    try {
      const moodDoc = doc(database, 'moods', mood.id);
      await updateDoc(moodDoc, { description, imageUri });
      onSave(description, imageUri);
      onClose();
    } catch (error) {
      console.error('Error updating mood description:', error);
    }
  };

  // Function to handle picking an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const downloadUrl = await uploadImage(localUri);
      setImageUri(downloadUrl);
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `moodImages/${mood.id}`);
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    setImageUri(downloadUrl);
    return downloadUrl;
  }

  // Delete image from Firebase Storage
  const deleteImage = async () => {
    if (imageUri) {
      const storageRef = ref(storage, imageUri);
      await deleteObject(storageRef);
      setImageUri(null);
      const moodDoc = doc(database, 'moods', mood.id);
      await updateDoc(moodDoc, { imageUri: null });
    }
  }
 
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
        <View className={`p-4 rounded-lg mb-2 ${getMoodColor(mood.mood)}`}>
          <Text className="text-lg mb-2">{mood.mood}</Text>
          <Text className="text-sm text-gray-700">{mood.date} at {mood.time}</Text>
        </View>
        
        {/* Text input for the mood description */}
        <TextInput
          className="border border-gray-300 p-3 rounded-lg mb-2"
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your mood in more detail..."
          textAlignVertical="top"
        />
        {/* Display the image */}
        {imageUri && (
          <View style={{ position: 'relative', marginBottom: 24 }}>
            <Image source={{ uri: imageUri }} className="w-full h-60 rounded-lg" />
            <TouchableOpacity onPress={deleteImage} className="absolute top-2 right-2">
              <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Image picker */}
        <TouchableOpacity onPress={pickImage} className="bg-blue-500 p-4 rounded-lg mb-2">
          <Text className=" text-white text-center text-base font-bold">Add an image</Text>
        </TouchableOpacity>
        
        {/* Save button */}
        <TouchableOpacity 
          onPress={handleSave}
          className="bg-blue-500 p-4 rounded-lg"
        >
          <Text className="text-white text-center text-base font-bold">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
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
    // Use the ImagePicker library to pick an image from the device's gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
      allowsEditing: true, // Allow editing of the image
      aspect: [4, 3], // Set the aspect ratio to 4:3
      quality: 1,
    });

    // If an image was selected
    if (!result.canceled) {
      // Get the local URI of the image
      const localUri = result.assets[0].uri;
      // Call the uploadImage function to upload the image to Firebase Storage and get the download URL
      const downloadUrl = await uploadImage(localUri);
      // Set the download URL as the image URI state
      setImageUri(downloadUrl);
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (uri) => {
    // Fetch the image from the local URI
    const response = await fetch(uri);
    // Convert the image to a blob
    const blob = await response.blob();
    // Create a reference to the mood's image in Firebase Storage
    const storageRef = ref(storage, `moodImages/${mood.id}`);
    // Upload the image to Firebase Storage
    await uploadBytes(storageRef, blob);
    // Get the download URL of the image
    const downloadUrl = await getDownloadURL(storageRef);
    // Return the download URL
    return downloadUrl;
  }

  // Delete image from Firebase Storage
  const deleteImage = async () => {
    // Check if the image URI is set
    if (imageUri) {
      // Create a reference to the image in Firebase Storage
      const storageRef = ref(storage, imageUri);
      // Delete the image from Firebase Storage
      await deleteObject(storageRef);
      // Set the image URI state to null
      setImageUri(null);
      // Update the mood document in Firestore to remove the image URI
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
          <View className="relative mb-2">
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
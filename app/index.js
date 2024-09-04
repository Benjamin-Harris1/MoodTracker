import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Mood() {
  return (
    // All styling is made with Tailwind CSS, where I just have to add "classeName" followed by the desired styling.
    <View className="flex-1 items-center justify-evenly bg-gray-100 p-4">
      <Text className="text-2xl font-bold">Mood</Text>
    </View>
  );
}

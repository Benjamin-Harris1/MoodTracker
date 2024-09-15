import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function MoodDescription({ mood, onSave, onClose }) {
  const [description, setDescription] = React.useState(mood.description);

  const handleSave = () => {
    onSave(description);
    onClose();
  };

  return (
    <View className="flex-1 bg-white p-4 justify-center">
      <Text className="text-2xl mb-4">{mood.text}</Text>
      <TextInput
        className="border p-2 mb-4"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your mood..."
      />
      <Button title="Save" onPress={handleSave} />
      <Button title="Close" onPress={onClose} />
    </View>
  );
}
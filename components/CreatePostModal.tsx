import React, { useState } from "react";
import { Modal, View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useCreatePostMutation } from "@/server/api";

const DEFAULT_COMMUNITY_ID = "118af618-b3ef-403e-8bbd-92af080b973a"

export default function CreatePostModal({
  visible,
  onClose,
  onPostCreated,
}: {
  visible: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleSubmit = async () => {
    try {
      await createPost({
        community_id: DEFAULT_COMMUNITY_ID,
        title,
        content,
        content_type: "text",
      }).unwrap();

      setTitle("");
      setContent("");
      onClose();
      onPostCreated(); 
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.heading}>Create Post</Text>

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          style={[styles.input, { height: 100 }]}
          multiline
        />

        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={{ marginTop: 20, textAlign: "center", color: "#999" }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#6b21a8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

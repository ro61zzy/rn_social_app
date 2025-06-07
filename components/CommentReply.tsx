import React, { useState } from "react";
import { Modal, View, TextInput, Button, StyleSheet, Text } from "react-native";

type ReplyInputModalProps = {
  visible: boolean;
  onClose: () => void;
  postId: string;
  parentId?: string;
  onSubmit: (content: string) => void;
};

const ReplyInputModal = ({ visible, onClose, postId, parentId, onSubmit }: ReplyInputModalProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Write a reply</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Type your reply..."
            multiline
            style={styles.textInput}
          />
          <View style={styles.buttons}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Reply" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
  },
  textInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    marginVertical: 12,
    borderRadius: 4,
    padding: 10,
    textAlignVertical: "top",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
  },
});

export default ReplyInputModal;

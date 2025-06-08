import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type ReplyInputModalProps = {
  visible: boolean;
  onClose: () => void;
  postId: string;
  parentId?: string;
  onSubmit: (content: string) => void;
};

const ReplyInputModal = ({
  visible,
  onClose,
  postId,
  parentId,
  onSubmit,
}: ReplyInputModalProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalBackdrop}
      >
        <View style={styles.modalContainer}>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Type your reply..."
            placeholderTextColor="#a78bfa" 
            multiline
            style={styles.textInput}
          />
          <View style={styles.buttons}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.submitButton]}>
              <Text style={styles.submitText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#6b21a8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontWeight: "700",
    fontSize: 20,
    color: "#6b21a8",
    marginBottom: 4,
  },
  titleUnderline: {
    height: 3,
    width: 50,
    backgroundColor: "#6b21a8",
    borderRadius: 2,
    marginBottom: 12,
  },
  textInput: {
    height: 100,
    borderColor: "#6b21a8",
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    color: "#1f2937",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#e0d7f5",
  },
  cancelText: {
    color: "#6b21a8",
    fontWeight: "600",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#6b21a8",
  },
  submitText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default ReplyInputModal;

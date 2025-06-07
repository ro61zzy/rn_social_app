import { View, Text, Modal, KeyboardAvoidingView, TextInput, Button, StyleSheet } from 'react-native'
import React from 'react'

const CommentReply = () => {
  return (
       <Modal

       
           animationType="slide"
           transparent={true}

           
         >
         
         
            
         </Modal>
  )
}

export default CommentReply


 const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  textInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    minHeight: 60,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
 })
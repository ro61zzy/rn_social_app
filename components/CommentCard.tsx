// src/components/CommentCard.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Comment } from "@/types/types";



type Props = {
  comment: Comment;
  depth?: number; // for nesting level styling
  onReply: (comment: Comment) => void;
};

export default function CommentCard({ comment, depth = 1, onReply }: Props) {
  return (
    <View style={[styles.container, { marginLeft: (depth - 1) * 12 }]}>
      <View style={styles.header}>
        {comment.user_details.avatar ? (
          <Image
            source={{ uri: comment.user_details.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarFallbackText}>
              {comment.user_details.display_name?.[0]?.toUpperCase() ?? "U"}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.displayName}>{comment.user_details.display_name}</Text>
          <Text style={styles.userHandle}>@{comment.user_details.user_handle}</Text>
        </View>
      </View>

      <Text style={styles.content}>{comment.content}</Text>

      <View style={styles.footer}>
        <Text style={styles.time}>
          {new Date(comment.created_at).toLocaleString()}
        </Text>
        <TouchableOpacity
          onPress={() => onReply(comment)}
          style={styles.replyButton}
        >
          <FontAwesome6 name="reply" size={18} color="#6b21a8" />
          <Text style={styles.replyText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  avatarFallback: {
    backgroundColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallbackText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  userInfo: {
    flexDirection: "column",
  },
  displayName: {
    fontWeight: "600",
    fontSize: 14,
  },
  userHandle: {
    color: "gray",
    fontSize: 12,
  },
  content: {
    fontSize: 15,
    marginBottom: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    color: "gray",
    fontSize: 12,
  },
  replyButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  replyText: {
    color: "#6b21a8",
    marginLeft: 4,
    fontWeight: "600",
  },
});

import React, { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { CommentNode } from "@/types/types";


type CommentListItemProps = {
  comment: CommentNode;
  depth: number;
  onLoadMoreReplies: (commentId: string, currentDepth: number) => void;
};

const CommentListItem = ({ comment, depth, onLoadMoreReplies }: CommentListItemProps) => {
  const [showReplies, setShowReplies] = useState(false);

  // Show nested replies inline only if depth < 4
  const canShowRepliesInline = depth < 4;

  return (
    <View
      style={{
        backgroundColor: "white",
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 10,
        borderLeftColor: "#E5E7EB",
        borderLeftWidth: 2,
        marginLeft: depth * 15, // indent based on depth
      }}
    >
      {/* User Info */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
        {comment.user_details.avatar ? (
          <Image source={{ uri: comment.user_details.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: "#888" }]}>
            <Text style={styles.avatarFallbackText}>
              {comment.user_details.display_name?.[0]?.toUpperCase() ?? "U"}
            </Text>
          </View>
        )}
        <Text style={{ fontWeight: "600", color: "#737373", fontSize: 13 }}>
          {comment.user_details.display_name}
        </Text>
        <Text style={{ color: "#737373", fontSize: 13 }}>&#x2022;</Text>
      </View>

      <Text>{comment.content}</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Octicons
          name="reply"
          size={16}
          color="#737373"
          onPress={() => console.log("Reply button pressed")}
        />

        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <MaterialCommunityIcons name="arrow-up-bold-outline" size={18} color="#737373" />
          {/* <Text style={{ fontWeight: "500", color: "#737373" }}>{comment.score}</Text> */}
          <MaterialCommunityIcons name="arrow-down-bold-outline" size={18} color="#737373" />
        </View>
      </View>

      {/* Show inline replies only if depth < 4 */}
      {canShowRepliesInline && comment.replies.length > 0 && showReplies && (
        <FlatList
          data={comment.replies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommentListItem comment={item} depth={depth + 1} onLoadMoreReplies={onLoadMoreReplies} />
          )}
          style={{ marginTop: 10 }}
        />
      )}

      {/* Show "Show Replies" button if replies exist but not shown */}
      {canShowRepliesInline && comment.replies.length > 0 && !showReplies && (
        <Pressable
          onPress={() => setShowReplies(true)}
          style={{
            backgroundColor: "#EDEDED",
            borderRadius: 3,
            paddingVertical: 3,
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <Text style={{ fontSize: 12, letterSpacing: 0.5, fontWeight: "500", color: "#545454" }}>
            Show Replies ({comment.replies.length})
          </Text>
        </Pressable>
      )}

   
    {!canShowRepliesInline && comment.child_count && comment.child_count > 0 && (
  <Pressable
    onPress={() => onLoadMoreReplies(comment.id, depth)}
    style={{
      backgroundColor: "#D1EAFE",
      borderRadius: 3,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginTop: 6,
      alignSelf: "flex-start",
    }}
  >
    <Text style={{ fontWeight: "600", color: "#0B76FF" }}>
      View More Replies
    </Text>
  </Pressable>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  avatarFallbackText: { color: "white", fontWeight: "bold", fontSize: 18 },
});

export default CommentListItem;

import { useCreateCommentMutation } from "@/server/api";
import { CommentNode } from "@/types/types";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ReplyInputModal from "./CommentReply";

type CommentListItemProps = {
  comment: CommentNode;
  depth: number;
  onLoadMoreReplies: (commentId: string, currentDepth: number) => void;
};

const CommentListItem = ({
  comment,
  depth,
  onLoadMoreReplies,
}: CommentListItemProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const router = useRouter();

  const INLINE_REPLIES_LIMIT = 3;
  const canShowRepliesInline = depth < 4;
  const repliesToShow = showReplies
    ? comment.replies
    : comment.replies.slice(0, INLINE_REPLIES_LIMIT);
  const hasMoreInlineReplies = comment.replies.length > INLINE_REPLIES_LIMIT;

  const handleReplySubmit = async (content: string) => {
    try {
      await createComment({
        post_id: comment.post_id,
        content,
        reply_to: comment.id,
      }).unwrap();
    } catch (error) {
      console.error("Failed to create reply", error);
    }
  };

  const goToRepliesPage = () => {
    onLoadMoreReplies(comment.id, depth);
  };

  return (
    <View style={[styles.commentContainer, { marginLeft: depth * 10 }]}>
      <View style={styles.userInfo}>
        {comment.user_details.avatar ? (
          <Image
            source={{ uri: comment.user_details.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, { backgroundColor: "#888" }]}>
            <Text style={styles.avatarFallbackText}>
              {comment.user_details.display_name?.[0]?.toUpperCase() ?? "U"}
            </Text>
          </View>
        )}
        <Text style={styles.username}>{comment.user_details.display_name}</Text>
        <Text style={styles.dot}>&#x2022;</Text>
      </View>

      <Text style={{ marginBottom: 0 }}>{comment.content}</Text>


      <View style={styles.actions}>
        <Octicons
          name="reply"
          size={16}
          color="#737373"
          onPress={() => setReplyModalVisible(true)}
        />
        <View style={styles.voteButtons}>
          <MaterialCommunityIcons
            name="arrow-up-bold-outline"
            size={18}
            color="#737373"
          />
          <MaterialCommunityIcons
            name="arrow-down-bold-outline"
            size={18}
            color="#737373"
          />
        </View>
      </View>

      <ReplyInputModal
        visible={replyModalVisible}
        onClose={() => setReplyModalVisible(false)}
        postId={comment.post_id}
        parentId={comment.id}
        onSubmit={handleReplySubmit}
      />
      {canShowRepliesInline && comment.replies.length > 0 && (
        <>
          <FlatList
            data={repliesToShow}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CommentListItem
                comment={item}
                depth={depth + 1}
                onLoadMoreReplies={onLoadMoreReplies}
              />
            )}
            style={{ marginTop: 10 }}
          />
          {hasMoreInlineReplies && !showReplies && (
            <Pressable
              onPress={() => setShowReplies(true)}
              style={styles.showReplies}
            >
              <Text style={styles.showRepliesText}>
                Show Replies ({comment.replies.length - INLINE_REPLIES_LIMIT}{" "}
                more)
              </Text>
            </Pressable>
          )}
        </>
      )}

      {!canShowRepliesInline && comment.child_count && (
        <Pressable onPress={goToRepliesPage} style={styles.viewMoreReplies}>
          <Text style={styles.viewMoreText}>View More Replies</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  avatarFallbackText: { color: "white", fontWeight: "bold", fontSize: 18 },

  commentContainer: {
    backgroundColor: "white",
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // gap: 2,
    borderLeftColor: "#E5E7EB",
    borderLeftWidth: 1,
  },

  userInfo: { flexDirection: "row", alignItems: "center", gap: 3 },
  username: { fontWeight: "600", color: "#737373", fontSize: 13 },
  dot: { color: "#737373", fontSize: 13 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 18,
  },
  voteButtons: { flexDirection: "row", gap: 5, alignItems: "center" },
  showReplies: {
    backgroundColor: "#EDEDED",
    borderRadius: 3,
    paddingVertical: 3,
    alignItems: "center",
    marginTop: 2,
  },
  showRepliesText: {
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: "500",
    color: "#545454",
  },
  viewMoreReplies: {
    backgroundColor: "#D1EAFE",
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  viewMoreText: {
    fontWeight: "600",
    color: "#0B76FF",
  },
});

export default CommentListItem;

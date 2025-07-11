import { useCreateCommentMutation } from "@/server/api";
import { CommentNode } from "@/types/types";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReplyInputModal from "./CommentReply";

dayjs.extend(relativeTime);

type CommentListItemProps = {
  comment: CommentNode;
  depth: number;
  onLoadMoreReplies: (commentId: string, currentDepth: number) => void;
  maxInlineDepth?: number;
};

const CommentListItem = ({
  comment,
  depth,
  onLoadMoreReplies,
  maxInlineDepth,
}: CommentListItemProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const router = useRouter();

  const INLINE_REPLIES_LIMIT = 3;
  const inlineDepthLimit = maxInlineDepth ?? 3;
  const canShowRepliesInline = depth < inlineDepthLimit;

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
    router.push({
      pathname: "/(tabs)/home/replies/[id]",
      params: { id: comment.id },
    });
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
        <Text style={styles.userMeta}>
              {dayjs(comment.created_at).fromNow()}
            </Text>
      </View>

      <Text style={{ marginBottom: 0 }}>{comment.content}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => setReplyModalVisible(true)}
          style={{ padding: 6, borderRadius: 4 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Octicons name="reply" size={16} color="#6b21a8" />
        </TouchableOpacity>
        <View style={styles.voteButtons}>
          <MaterialCommunityIcons
            name="arrow-up-bold-outline"
            size={18}
            color="#6b21a8"
          />
          <MaterialCommunityIcons
            name="arrow-down-bold-outline"
            size={18}
            color="#6b21a8"
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

      {!canShowRepliesInline && (comment.child_count ?? 0) > 0 && (
        <Pressable onPress={goToRepliesPage} style={styles.viewMoreReplies}>
          <Text style={styles.viewMoreText}>More Replies ⌄</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    flexDirection: "row",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarFallbackText: {
    flexDirection: "row",
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

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
  dot: { color: "#6b21a8", fontSize: 13 },
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
    // backgroundColor: "#D1EAFE", “⌄” U+2304 Down Arrowhead Unicode Character

    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  viewMoreText: {
    fontWeight: "600",
    color: "#0B76FF",
    fontSize: 12,
  },
  userMeta: { color: "gray", fontSize: 10 },
});

export default CommentListItem;

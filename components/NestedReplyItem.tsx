//for level 5-8, will figure out how to re use code later 🥲

import { CommentNode } from "@/types/types";
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList,  Image, TouchableOpacity, } from "react-native";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCreateCommentMutation } from "@/server/api";
import ReplyInputModal from "./CommentReply";
import { useRouter } from "expo-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Props = {
  comment: CommentNode;
  depth: number;
   onReplyCreated: () => void;
};

const INLINE_REPLIES_LIMIT = 3;
const MAX_INLINE_DEPTH = 7;

const NestedReplyItem = ({ comment, depth, onReplyCreated }: Props) => {
    const router = useRouter();
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [createComment, { isLoading }] = useCreateCommentMutation();
    const [replyModalVisible, setReplyModalVisible] = useState(false);

  const repliesToShow = showAllReplies
    ? comment.replies
    : comment.replies.slice(0, INLINE_REPLIES_LIMIT);

  const hasMoreReplies = comment.replies.length > INLINE_REPLIES_LIMIT;

  const showRepliesInline = depth <= MAX_INLINE_DEPTH;

    const handleReplySubmit = async (content: string) => {
    try {
      await createComment({
        post_id: comment.post_id,
        content,
        reply_to: comment.id,
      }).unwrap();
          onReplyCreated();
    } catch (error) {
      console.error("Failed to create reply", error);
    }
  };

   const goToRepliesPage = () => {
  router.push({
  pathname: "/(tabs)/home/deeper_replies/[id]",
  params: { id: comment.id },
});
};

  return (
    <View style={[styles.commentContainer, { marginLeft: depth * 2 }]}>
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
      <Text style={styles.content}>{comment.content}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
  onPress={() => setReplyModalVisible(true)}
  style={{ padding: 6, borderRadius: 4 }} 
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} 
>
  <Octicons name="reply" size={16}  color="#6b21a8" />
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

      {showRepliesInline && repliesToShow.length > 0 && (
        <>
          <FlatList
            data={repliesToShow}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NestedReplyItem comment={item} depth={depth + 1} onReplyCreated={onReplyCreated}  />
            )}
            style={{ marginTop: 6 }}
          />
          {hasMoreReplies && !showAllReplies && (
            <Pressable
              onPress={() => setShowAllReplies(true)}
              style={styles.showReplies}
            >
              <Text style={styles.showRepliesText}>
                Show Replies ({comment.replies.length - INLINE_REPLIES_LIMIT} more)
              </Text>
            </Pressable>
          )}
        </>
      )}

      {!showRepliesInline && (comment.child_count ?? 0) > 0 && (
        <Pressable onPress={goToRepliesPage} style={styles.viewMoreReplies}>
           <Text style={styles.viewMoreText}>More Replies ⌄</Text>
         </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: "white",
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderLeftColor: "#E5E7EB",
    borderLeftWidth: 1,
  },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  avatarFallbackText: { color: "white", fontWeight: "bold", fontSize: 18 },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 3 },
  username: { fontWeight: "600", color: "#737373", fontSize: 13 },
  dot: { color:  "#6b21a8", fontSize: 13 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 18,
  },
  voteButtons: { flexDirection: "row", gap: 5, alignItems: "center" },
  content: {
    fontSize: 14,
    marginBottom: 4,
  },
  showReplies: {
    backgroundColor: "#EDEDED",
    borderRadius: 3,
    paddingVertical: 4,
    alignItems: "center",
    marginTop: 4,
  },
  showRepliesText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#545454",
  },
  viewMoreReplies: {
  
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

export default NestedReplyItem;

// src/screens/PostDetailsScreen.tsx
import { buildNestedComments } from "@/components/buildNestedComments";
import CommentListItem from "@/components/CommentListItem";
import ReplyInputModal from "@/components/CommentReply";
import {
  useCreateCommentMutation,
  useGetCommentsByPostIdQuery,
  useGetPostsByCommunityIdQuery,
} from "@/server/api";
import { CommentNode } from "@/types/types";
import { Octicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

dayjs.extend(relativeTime);

export const options = {
  title: "Post Details",
  headerShown: true,
};

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Post Details",
      headerShown: true,
    });
  }, [navigation, id]);


  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [createComment, { isLoading: isCreatingComment }] =
    useCreateCommentMutation();

  const communityId = "118af618-b3ef-403e-8bbd-92af080b973a";

  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useGetPostsByCommunityIdQuery(communityId);

  if (postsLoading) {
    return <Text>Loading posts...</Text>;
  }

  if (postsError) {
    return <Text>Error loading posts.</Text>;
  }

  // compare to fetched posts data by community, no api for post by id
  const post = postsData?.items?.find((p: { id: string }) => p.id === id);

  if (!post) {
    return <Text>Post not found</Text>;
  }

  // const post = postsData?.items?.find((p: { id: string }) => p.id === id);

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
   refetch
  } = useGetCommentsByPostIdQuery(id);

  const nestedComments: CommentNode[] = React.useMemo(() => {
    if (!comments) return [];
    return buildNestedComments(comments);
  }, [comments]);

  if (postsLoading || commentsLoading) return <Text>Loading...</Text>;
  if (postsError) return <Text>Error loading post.</Text>;
  if (commentsError) return <Text>Error loading comments.</Text>;

  const handlePostReplySubmit = async (content: string) => {
    try {
      await createComment({
        post_id: post.id,
        content,
        reply_to: "",
      }).unwrap();

      setReplyModalVisible(false);
    } catch (error) {
      console.error("Failed to create reply to post", error);
    }
  };

  return (
    <>
      <FlatList
        data={nestedComments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CommentListItem
            comment={item}
            depth={0}
            onLoadMoreReplies={(commentId, currentDepth) => {
              console.log("Load more replies for", commentId, currentDepth);
            }}
          />
        )}
        ListHeaderComponent={
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.userInfo}>
                {post.user_details.avatar ? (
                  <Image
                    source={{ uri: post.user_details.avatar }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: "#888" }]}>
                    <Text style={styles.avatarFallbackText}>
                      {post.user_details.display_name?.[0]?.toUpperCase() ??
                        "U"}
                    </Text>
                  </View>
                )}
                <View>
                  <Text style={styles.communityName}>
                    {post.community_details.name}
                  </Text>
                  <Text style={styles.userMeta}>
                    @{post.user_details.user_handle} ·{" "}
                    {dayjs(post.created_at).fromNow()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.body}>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.content}>{post.content}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionItem}>
                <FontAwesome
                  name="thumbs-o-up"
                  size={20}
                  marginRight={4}
                  color="#6b21a8"
                />
                <Text style={styles.actionText}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem}>
                <FontAwesome
                  name="thumbs-o-down"
                  size={20}
                  marginRight={4}
                  color="#6b21a8"
                />
                <Text style={styles.actionText}>0</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.actionItem}>
                <FontAwesome6
                  name="comment"
                  size={20}
                  marginRight={4}
                  color="#6b21a8"
                />
                <Text style={styles.actionText}>{post.comments_count}</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => setReplyModalVisible(true)}
               style={styles.actionItem}
              >
                <Octicons name="reply" size={20} color="#6b21a8" />
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <Text style={{ color: "#888", fontStyle: "italic" }}>
              No comments yet. Be the first to comment! 👆
            </Text>
          </View>
        }
      />
      <ReplyInputModal
        visible={replyModalVisible}
        onClose={() => setReplyModalVisible(false)}
        postId={post.id}
        // parentId={null} // top-level comment reply to post
        onSubmit={handlePostReplySubmit}
        // isLoading={isCreatingComment}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    // marginBottom: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: { flexDirection: "row", marginBottom: 12 },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  avatarFallbackText: { color: "white", fontWeight: "bold", fontSize: 18 },
  communityName: { fontWeight: "bold", fontSize: 14 },
  userMeta: { color: "gray", fontSize: 12 },
  body: {},
  title: { fontSize: 20, fontWeight: "bold" },
  content: { fontSize: 16, marginTop: 8 },
  actions: { flexDirection: "row", marginTop: 12 },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: { marginLeft: 4, color: "#6b21a8" },
  commentsHeader: { fontSize: 18, marginVertical: 12, fontWeight: "600" },
  viewMore: { color: "#FF4500", marginLeft: 20, marginTop: 8 },
});

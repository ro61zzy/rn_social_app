import { useGetCommentsByPostIdQuery, useGetPostsQuery } from "@/server/api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { RouteProp, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

dayjs.extend(relativeTime);

type PostDetailsRouteParams = {
  post_details: { id: string };
};

export default function PostDetails() {
  const route = useRoute<RouteProp<PostDetailsRouteParams, "post_details">>();
  const { id } = route.params;


  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useGetPostsQuery();

 
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useGetCommentsByPostIdQuery(id);

  if (postsLoading || commentsLoading) return <Text>Loading...</Text>;
  if (postsError) return <Text>Error loading post.</Text>;
  if (commentsError) return <Text>Error loading comments.</Text>;

  const post = postsData?.items?.find((p) => p.id === id);
  if (!post) return <Text>Post not found.</Text>;

  console.log("Sample comment:", comments?.[0]);


function buildCommentTree(flatComments: any[]) {
  const map = new Map();
  const roots: any[] = [];

  const clonedComments = flatComments.map((comment) => ({
    ...comment,
    children: [],
  }));

  clonedComments.forEach((comment) => {
    map.set(comment.id, comment);
  });

  clonedComments.forEach((comment) => {
    if (comment.reply_to && map.has(comment.reply_to)) {
      map.get(comment.reply_to).children.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
}


  function CommentThread({
    comment,
    level = 1,
  }: {
    comment: any;
    level?: number;
  }) {
    const user = comment.user_details;
    const avatarUri = user.avatar;
    const replies = comment.children || [];
    const showRepliesInline = level < 4;

    return (
        <View style={{ flexDirection: "row", marginBottom: 1 }}>
 
  {level > 0 && (
    <View
      style={{
        width: 12,
        alignItems: "center",
      }}
    >
      <View
        style={{
         flex: 1,
           width: 1,
          backgroundColor: "#ccc",
         // marginTop: 4,
        }}
      />
    </View>
  )}
      <View style={{ flex: 1, marginLeft: level > 0 ? 0 : 12 * level }}>

        <View style={styles.commentContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.commentAvatar} />
          ) : (
            <View style={styles.commentAvatar}>
              <Text style={styles.avatarFallbackText}>
                {user.display_name?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <View style={styles.commentContent}>
            <Text style={styles.userName}>
              {user.display_name}{" "}
              <Text style={styles.userHandle}>@{user.user_handle}</Text>
            </Text>
            <Text style={styles.contentText}>
              {comment.content.replace(/<[^>]+>/g, "")}
            </Text>
            <Text style={styles.timestamp}>
              {dayjs(comment.created_at).fromNow()}
            </Text>
          </View>
        </View>

        {showRepliesInline &&
          replies
            .slice(0, 3)
            .map((child: any) => (
              <CommentThread key={child.id} comment={child} level={level + 1} />
            ))}

        {showRepliesInline && replies.length > 3 && (
          <Text style={{ marginLeft: 12, color: "#6b21a8" }}>
            View more replies ({replies.length - 3})
          </Text>
        )}

        {!showRepliesInline && replies.length > 0 && (
          <TouchableOpacity>
            <Text style={{ marginLeft: 12, color: "#6b21a8" }}>
              View {replies.length} reply(ies)
            </Text>
          </TouchableOpacity>
        )}
      </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
                  {post.user_details.display_name?.[0]?.toUpperCase() ?? "U"}
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
              marginRight="4"
              color="#6b21a8"
            />
            <Text style={styles.actionText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <FontAwesome
              name="thumbs-o-down"
              size={20}
              marginRight="4"
              color="#6b21a8"
            />
            <Text style={styles.actionText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <FontAwesome6
              name="comment"
              size={20}
              marginRight="4"
              color="#6b21a8"
            />
            <Text style={styles.actionText}>{post.comments_count}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.commentsHeader}>Comments</Text>
      {comments?.length === 0 && <Text>No comments yet.</Text>}
     {comments && buildCommentTree(comments).map((comment) => (

        <CommentThread key={comment.id} comment={comment} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    // Android
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarFallbackText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  communityName: {
    fontWeight: "600",
    fontSize: 12,
  },
  userMeta: {
    fontSize: 10,
    color: "#666",
  },
  body: {
    marginTop: 12,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: "#333",
  },
  commentsHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  commentContent: {
    flex: 1,
  },
  userName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#222",
  },
  userHandle: {
    fontWeight: "400",
    color: "#666",
    fontSize: 12,
  },
  contentText: {
    marginTop: 4,
    fontSize: 14,
    color: "#333",
  },
  timestamp: {
    marginTop: 6,
    fontSize: 12,
    color: "#999",
  },
  actions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 24,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#555",
  },
});

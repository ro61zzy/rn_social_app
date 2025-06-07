// src/screens/PostDetailsScreen.tsx
import { buildNestedComments } from "@/components/buildNestedComments";
import CommentListItem from "@/components/CommentListItem";
import { useGetCommentsByPostIdQuery, useGetPostsQuery } from "@/server/api";
import { Comment, CommentNode  } from "@/types/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

dayjs.extend(relativeTime);

type RootStackParamList = {
  PostDetailsScreen: { id: string };
  NestedCommentsScreen: { parentComment: Comment };
};

type Props = NativeStackScreenProps<RootStackParamList, "PostDetailsScreen">;

export default function PostDetailsScreen({ navigation }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, "PostDetailsScreen">>();
  const { id } = route.params;


  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useGetPostsQuery();

  const post = postsData?.items?.find((p: { id: string }) => p.id === id);

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useGetCommentsByPostIdQuery(id);

    const nestedComments: CommentNode[] = React.useMemo(() => {
  if (!comments) return [];
  return buildNestedComments(comments);
}, [comments]);

  if (postsLoading || commentsLoading) return <Text>Loading...</Text>;
  if (postsError) return <Text>Error loading post.</Text>;
  if (commentsError) return <Text>Error loading comments.</Text>;

  if (!post) return <Text>Post not found</Text>;

  return (

<FlatList
  data={nestedComments}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <CommentListItem
      comment={item}
      depth={0}
      onLoadMoreReplies={(commentId, currentDepth) => {
        console.log('Load more replies for', commentId, currentDepth);
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

        <TouchableOpacity style={styles.actionItem}>
          <FontAwesome6
            name="comment"
            size={20}
            marginRight={4}
            color="#6b21a8"
          />
          <Text style={styles.actionText}>{post.comments_count}</Text>
        </TouchableOpacity>
      </View>
    </View>
  }
/>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 7,
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

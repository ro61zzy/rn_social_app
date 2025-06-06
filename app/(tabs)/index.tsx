import { useGetPostsQuery } from "@/server/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

dayjs.extend(relativeTime);

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: number;
  community_details: {
    id: string;
    name: string;
  };
  user_details: {
    display_name: string;
    user_handle: string;
    avatar: string;
  };
};

export default function PostsPage() {
  const { data, error, isLoading } = useGetPostsQuery();

  if (isLoading) return <Text>Loading posts...</Text>;
  if (error) return <Text>Error loading posts</Text>;

  const posts = data?.items ?? [];

  const renderPost = ({ item: post }: { item: Post }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
        <Image
  source={{ uri: post.user_details.avatar }}
  style={styles.avatar}
/>

          <View>
            <Text style={styles.communityName}>
              {post.community_details.name}
            </Text>
            <Text style={styles.userMeta}>
              @{post.user_details.user_handle}{" "}
              · {dayjs(post.created_at).fromNow()}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.content}>{post.content}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>👍</Text>
          <Text style={styles.actionText}>2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>👎</Text>
          <Text style={styles.actionText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>1</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data?.items ?? []}
      keyExtractor={(post) => post.id}
      renderItem={renderPost}
      contentContainerStyle={styles.container}
    />
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
    marginBottom: 8,
    // Shadows for iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    // Elevation for Android
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
    marginRight: 3,
  },
  communityName: {
    fontWeight: "600",
    fontSize: 12,
  },
  userMeta: {
    fontSize: 10,
    color: "#666",
  },
  joinButton: {
    backgroundColor: "#6b21a8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
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

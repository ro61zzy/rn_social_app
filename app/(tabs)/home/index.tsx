import { useGetPostsQuery } from "@/server/api";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter,  Link } from "expo-router";
import React from "react";
import { useLayoutEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Tabs } from "expo-router";

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
  comments_count: number;
};

export default function PostsPage() {
  const router = useRouter();
    const navigation = useNavigation();
  const { data, error, isLoading } = useGetPostsQuery();

  useLayoutEffect(() => {
      navigation.setOptions({
        title: "Home", // You can use `id` too if you want dynamic title
        headerShown: true,
      });
    }, [navigation]);
  

  if (isLoading) return <Text>Loading posts...</Text>;
  if (error) return <Text>Error loading posts</Text>;

  const posts = data?.items ?? [];
  

  const renderPost = ({ item: post }: { item: Post }) => (
    <TouchableOpacity 
  onPress={() =>
  router.push({
    pathname: "./home/post_details/[id]",
    params: { id: post.id },
  })
}

      activeOpacity={0.9}
      style={styles.card}
    >
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
              @{post.user_details.user_handle} ·{" "}
              {dayjs(post.created_at).fromNow()}
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

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
             router.push({
    pathname: "./home/post_details/[id]",
    params: { id: post.id },
  })
          }}
          
          style={styles.actionItem}
        >
          <FontAwesome6
            name="comment"
            size={20}
            marginRight="4"
            color="#6b21a8"
          />
          <Text style={styles.actionText}>{post.comments_count}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data?.items ?? []}
      keyExtractor={(post) => post.id}
      renderItem={renderPost}
      contentContainerStyle={styles.container}
    >
      <Tabs.Screen
                options={{
                    title: 'Post Details',
  headerShown: true,
                    //   headerLeft: () => <DrawerToggleButton />,
                }}
            />

    </FlatList>
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
    // iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    //Android
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

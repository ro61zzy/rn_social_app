import { useRoute, RouteProp } from "@react-navigation/native";
import { ScrollView, Text, View, Image, StyleSheet } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGetCommentsByPostIdQuery } from "@/server/api";

dayjs.extend(relativeTime);

type PostDetailsRouteParams = {
  post_details: { id: string };
};

export default function PostDetails() {
  const route = useRoute<RouteProp<PostDetailsRouteParams, "post_details">>();
  const { id } = route.params;

  const { data: comments, isLoading, error } = useGetCommentsByPostIdQuery(id);

  if (isLoading) return <Text>Loading post...</Text>;
  if (error) return <Text>Error loading comments.</Text>;
  if (!comments) return <Text>No comments found.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Comments:</Text>
      {comments.map((comment) => {
        const user = comment.user_details;
        const avatarUri = comment.user_details.avatar;

        return (
          <View key={comment.id} style={styles.commentContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View
                style={[styles.avatar]}
              >
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

              {/* Content contains HTML span for mentions, to keep it simple just show raw text */}
              <Text style={styles.contentText}>
                {comment.content.replace(/<[^>]+>/g, "")}
              </Text>

              <Text style={styles.timestamp}>
                {dayjs(comment.created_at).fromNow()}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 12,
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallbackText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
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
});

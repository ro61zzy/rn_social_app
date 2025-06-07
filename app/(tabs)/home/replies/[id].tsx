import CommentListItem from "@/components/CommentListItem";
import { useGetRepliesByCommentIdQuery } from "@/server/api"; // your fetch function
import type { Comment, CommentNode } from "@/types/types";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList } from "react-native";
import { useRouter,  Link } from "expo-router";

type RootStackParamList = {
  RepliesPage: { id: string };
  NestedCommentsScreen: { parentComment: Comment };
};

const RepliesPage = () => {
  const route = useRoute<RouteProp<RootStackParamList, "RepliesPage">>();
  const router = useRouter();

  const { id } = route.params;

  const {
    data: replies,
    isLoading: repliesLoading,
    error: repliesError,
  } = useGetRepliesByCommentIdQuery(id);

const handleLoadMoreReplies = (commentId: string, currentDepth: number) => {
    if (currentDepth === 4) {
      router.push(`./replies/${commentId}`);
    } else if (currentDepth === 8) {
      router.push(`./deep-replies/${commentId}`);
    }
  };

  if (repliesLoading) {
    return null; 
  }

  if (repliesError) {
    return null; 
  }

  return (
   <FlatList
  data={replies}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => {
    const commentNode: CommentNode = {
      ...item,
      replies: [], 
    };

    return (
      <CommentListItem
        comment={commentNode}
        depth={5}
        onLoadMoreReplies={() => handleLoadMoreReplies(item.id, 5)}
      />
    );
  }}
/>

  );
};

export default RepliesPage;

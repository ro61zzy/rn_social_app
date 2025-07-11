import React, { useLayoutEffect, useMemo } from "react";
import { FlatList, Text } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useGetDeepRepliesByCommentIdQuery } from "@/server/api";
import { buildNestedComments } from "@/components/buildNestedComments";
import NestedReplyItem from "@/components/NestedReplyItem";

const DeeperRepliesScreen = () => {
  const { id } = useLocalSearchParams();
  const commentId = id as string;
  const navigation = useNavigation();

const { data: replies, isLoading, refetch } = useGetDeepRepliesByCommentIdQuery(commentId);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "More Replies",
      headerShown: true,
    });
  }, [navigation, id]);

  const nestedReplies = useMemo(() => {
    if (!replies) return [];
    return buildNestedComments(replies);
  }, [replies]);

  if (isLoading) return <Text>Loading replies...</Text>;
  if (!replies || replies.length === 0) return <Text>No replies found.</Text>;

  return (
    <FlatList
      data={nestedReplies}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NestedReplyItem comment={item} depth={5} onReplyCreated={refetch} />}
    />
  );
};

export default DeeperRepliesScreen;

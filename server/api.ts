// server/api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Post = {
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

export type Comment = {
  id: string;
  post_id: string;
  user_details: {
    display_name: string;
    avatar: string;
    user_handle: string;
  };
  content: string;
  created_at: number;
};

const BaseUrlML = process.env.EXPO_PUBLIC_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BaseUrlML,
  prepareHeaders: async (headers) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    headers.set("X-Data-Source", "staging");
    return headers;
  },
});

export const rnSocialApi = createApi({
  reducerPath: "rnSocialApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<
      { authToken: string },
      { user_handle: string; password: string }
    >({
      query: (credentials) => ({
        url: "/api:A43o366j:staging/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    getPosts: builder.query<
      {
        items: Post[];
        curPage: number;
        nextPage: number | null;
        prevPage: number | null;
        offset: number;
        perPage: number;
        itemsTotal: number;
      },
      void
    >({
      query: () => "/api:Coq7oZJp:staging/posts",
    }),

    getCommentsByPostId: builder.query<Comment[], string>({
      query: (postId) => `/api:HPNnGSlw:staging/comments?post_id=${postId}`,
    }),

    getRepliesByCommentId: builder.query<Comment[], string>({
      query: (commentId) =>
        `/api:HPNnGSlw:staging/comments/${commentId}/replies`,
    }),

    getDeepRepliesByCommentId: builder.query<Comment[], string>({
      query: (commentId) =>
        `/api:HPNnGSlw:staging/comments/${commentId}/deep-replies`,
    }),
  }),
});

export const {
  useLoginMutation,
  useGetPostsQuery,
  useGetCommentsByPostIdQuery,
  useGetRepliesByCommentIdQuery,
  useGetDeepRepliesByCommentIdQuery,
} = rnSocialApi;

// server/api.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Post, Comment, CreateCommentPayload, CreatePostPayload } from "@/types/types";

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
  tagTypes: ["Post", "Comment"],
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

    getUserProfile: builder.query<any, string>({
      query: (userHandle) =>
        `/api:zQykoo4c:staging/user/profile?user_handle=${userHandle}`,
    }),

    getPosts: builder.query<any, void>({
      query: () => "/api:Coq7oZJp:staging/posts",
      providesTags: ["Post"],
    }),

    getPostsByCommunityId: builder.query<any, string>({
      query: (communityId) =>
        `/api:AAD3_pHV:staging/communities/posts?community_id=${communityId}`,
    }),

    createPost: builder.mutation<any, CreatePostPayload>({
      query: (data) => ({
        url: "/api:Coq7oZJp:staging/posts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),

    deletePost: builder.mutation<any, string>({
      query: (postId) => ({
        url: `/api:Coq7oZJp:staging/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),

    getCommentsByPostId: builder.query<Comment[], string>({
      query: (postId) => `/api:HPNnGSlw:staging/comments?post_id=${postId}`,
      providesTags: ["Comment"],
    }),

    getRepliesByCommentId: builder.query<Comment[], string>({
      query: (commentId) =>
        `/api:HPNnGSlw:staging/comments/${commentId}/replies`,
    }),

    getDeepRepliesByCommentId: builder.query<Comment[], string>({
      query: (commentId) =>
        `/api:HPNnGSlw:staging/comments/${commentId}/deep-replies`,
    }),

    createComment: builder.mutation<any, CreateCommentPayload>({
      query: (data) => ({
        url: "/api:HPNnGSlw:staging/comments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Comment"],
    }),

    deleteComment: builder.mutation<any, string>({
      query: (commentId) => ({
        url: `/api:HPNnGSlw:staging/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),

    
  }),
});
export const {
 useLoginMutation,
  useGetUserProfileQuery,
  useGetPostsQuery,
  useGetPostsByCommunityIdQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useGetCommentsByPostIdQuery,
  useGetRepliesByCommentIdQuery,
  useGetDeepRepliesByCommentIdQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = rnSocialApi;

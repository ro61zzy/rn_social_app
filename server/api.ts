// server/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    login: builder.mutation<{ authToken: string }, { user_handle: string; password: string }>({
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


  }),
});

export const { 
    useLoginMutation,
    useGetPostsQuery
 } = rnSocialApi;

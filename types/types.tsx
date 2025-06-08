// src/types.ts
export type Comment = {
  id: string;
  post_id: string;
  user_details: {
    display_name: string;
    avatar: string | null;
    user_handle: string;
  };
  content: string;
  created_at: number;
  reply_to?: string | null; 
  child_count?: number; 
};


export type CommentNode = Comment & {
  replies: CommentNode[];
};


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

export type CreateCommentPayload = {
  post_id: string;
  content: string;
  reply_to:string;
};

export type CreatePostPayload = {
  community_id: string;
  title: string;
  content?: string;
  content_type?: "text" | "image" | "video" | "link" | "gif" | "poll" | "video_file";
  link?: string;
  mentioned_users?: string[];
  poll_options?: string[];
  date_poll_end?: number;
  reposted_posts_id?: string;
  video_metadata?: object;
  gifs?: object[];
  images?: object[];
  video_file_url?: object;
};


export interface CommunityDetails {
  id: string;
  name: string;
  description: string;
  logo: {
    url: string;
    preview_url: string;
  };
  banner: {
    url: string;
    preview_url: string;
  };
}

export interface UserCommunity {
  aura: number;
  community_details: CommunityDetails;
}

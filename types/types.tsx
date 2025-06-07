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
  parent_id?: string; 
};

export type CreatePostPayload = {
  title: string;
  content: string;
  community_id: string;
};

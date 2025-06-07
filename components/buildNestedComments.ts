import type { Comment, CommentNode } from "@/types/types";

export function buildNestedComments(comments: Comment[]): CommentNode[] {
  const commentMap: Record<string, CommentNode> = {};
  const roots: CommentNode[] = [];

  // Initialize map with empty replies
  comments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  // Link replies to parents
  comments.forEach(comment => {
    if (comment.reply_to && commentMap[comment.reply_to]) {
      commentMap[comment.reply_to].replies.push(commentMap[comment.id]);
    } else {
      roots.push(commentMap[comment.id]);
    }
  });

  return roots;
}

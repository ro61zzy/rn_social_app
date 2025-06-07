import type { Comment, CommentNode } from "@/types/types";

export function buildNestedComments(comments: Comment[]): CommentNode[] {
  const commentMap: Record<string, CommentNode> = {};
  const roots: CommentNode[] = [];

  comments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  comments.forEach(comment => {
    if (comment.reply_to && commentMap[comment.reply_to]) {
      commentMap[comment.reply_to].replies.push(commentMap[comment.id]);
    } else {
      roots.push(commentMap[comment.id]);
    }
  });

  return roots;
}

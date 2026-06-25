"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  MessageCircle,
  Send,
  Trash2,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
  User,
  AlertCircle,
} from "lucide-react";

interface Reply {
  id: string;
  text: string;
  authorName: string;
  authorEmail: string;
  authorPercentile?: number;
  authorIsAdmin?: boolean;
  createdAt: string;
}

interface Comment {
  id: string;
  text: string;
  authorName: string;
  authorEmail: string;
  authorPercentile?: number;
  authorIsAdmin?: boolean;
  createdAt: Timestamp | null;
  likes: number;
  replies?: Reply[];
}

interface CommunityCommentsProps {
  pageId: string; // unique identifier for each page's comment section
  title?: string;
}

export const CommunityComments: React.FC<CommunityCommentsProps> = ({
  pageId,
  title = "Community Discussion",
}) => {
  const { user } = useApp();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // States for Reply feature
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const collectionPath = `comments_${pageId}`;

  useEffect(() => {
    const q = query(collection(db, collectionPath), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Comment[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Comment, "id">),
      }));
      setComments(fetched);
    });
    return () => unsubscribe();
  }, [collectionPath]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      setError("Please log in to post a comment.");
      return;
    }
    if (newComment.trim().length < 5) {
      setError("Comment is too short. Please write at least 5 characters.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, collectionPath), {
        text: newComment.trim(),
        authorName: user.name || "Student",
        authorEmail: user.email || "",
        authorPercentile: user.percentile || null,
        authorIsAdmin: user.isAdmin || false,
        createdAt: serverTimestamp(),
        likes: 0,
      });
      setNewComment("");
    } catch (e) {
      console.error("Failed to post comment:", e);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    if (!user) {
      setError("Please log in to post a reply.");
      return;
    }
    
    setIsSubmittingReply(true);
    try {
      const replyObj: Reply = {
        id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text: replyText.trim(),
        authorName: user.name || "Student",
        authorEmail: user.email || "",
        authorPercentile: user.percentile || undefined,
        authorIsAdmin: user.isAdmin || false,
        createdAt: new Date().toISOString(),
      };
      
      const commentDocRef = doc(db, collectionPath, commentId);
      await updateDoc(commentDocRef, {
        replies: arrayUnion(replyObj)
      });
      
      setReplyText("");
      setActiveReplyId(null);
    } catch (e) {
      console.error("Failed to post reply:", e);
      setError("Failed to post reply. Please try again.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDelete = async (commentId: string, authorEmail: string) => {
    if (!user) return;
    const isOwner = user.email === authorEmail;
    const isAdmin = user.isAdmin;
    if (!isOwner && !isAdmin) return;
    try {
      await deleteDoc(doc(db, collectionPath, commentId));
    } catch (e) {
      console.error("Failed to delete comment:", e);
    }
  };

  const formatTime = (ts: Timestamp | null) => {
    if (!ts) return "Just now";
    const date = ts.toDate();
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const formatReplyTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
      return "Just now";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-indigo-500 to-violet-600",
      "from-cyan-500 to-blue-600",
      "from-violet-500 to-fuchsia-600",
      "from-emerald-500 to-teal-600",
      "from-rose-500 to-pink-600",
      "from-amber-500 to-orange-600",
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <section className="w-full mt-8 mb-4">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 dark:from-indigo-900/30 dark:to-cyan-900/20 border border-indigo-200/50 dark:border-indigo-700/30 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all duration-300 cursor-pointer group mb-3"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
              {title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {comments.length} comment{comments.length !== 1 ? "s" : ""} · Ask questions, share tips, help others!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700">
            {comments.length}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Comment Input Box */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900/70 shadow-sm overflow-hidden">
            <div className="p-4">
              {user ? (
                <div className="flex gap-3">
                  {/* User Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(user.name || "U")} text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-md`}
                  >
                    {getInitials(user.name || "U")}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2 flex-wrap text-left">
                      <span>{user.name}</span>
                      {user.isAdmin && (
                        <span className="text-[9px] font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-2 py-0.5 rounded-full border border-purple-550 shadow-sm flex items-center gap-1 scale-95 origin-left">
                          <Sparkles className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300 animate-pulse" />
                          Admin
                        </span>
                      )}
                      {user.percentile && !user.isAdmin && (
                        <span className="text-[10px] text-indigo-505 dark:text-cyan-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-850">
                          {user.percentile}%ile
                        </span>
                      )}
                    </p>
                    <textarea
                      ref={textareaRef}
                      value={newComment}
                      onChange={(e) => {
                        setNewComment(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
                      }}
                      placeholder="Share your experience, ask a question, or help a fellow student... (Ctrl+Enter to post)"
                      rows={3}
                      className="w-full text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 dark:focus:border-cyan-500 resize-none transition-all duration-200 placeholder:text-slate-400 text-left"
                    />
                    {error && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs text-left">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {error}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[10px] text-slate-400">
                        {newComment.length}/500 chars
                      </span>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !newComment.trim()}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs font-bold shadow-md hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        {isSubmitting ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-1 text-left">
                  <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-indigo-500 dark:text-cyan-400">Sign in</span> to join the conversation and help other students!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30">
              <Sparkles className="w-8 h-8 text-indigo-300 dark:text-indigo-700 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No comments yet.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Be the first to start the discussion!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => {
                const isOwner = user?.email === comment.authorEmail;
                const isAdmin = user?.isAdmin;
                return (
                  <div
                    key={comment.id}
                    className="group flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-100 dark:border-slate-700/40 hover:border-indigo-200/60 dark:hover:border-indigo-700/40 shadow-sm hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(comment.authorName)} text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-md`}
                      >
                        {getInitials(comment.authorName)}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Author info */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-sm font-bold text-slate-800 dark:text-white">
                            {comment.authorName}
                          </span>
                          {comment.authorIsAdmin && (
                            <span className="text-[9px] font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-2 py-0.5 rounded-full border border-purple-550 shadow-sm flex items-center gap-1 scale-95 origin-left">
                              <Sparkles className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" />
                              Admin
                            </span>
                          )}
                          {comment.authorPercentile && !comment.authorIsAdmin && (
                            <span className="text-[10px] font-bold text-indigo-500 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800">
                              {comment.authorPercentile}%ile
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
                            {formatTime(comment.createdAt)}
                          </span>
                        </div>

                        {/* Comment text */}
                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed break-words">
                          {comment.text}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-2.5">
                          <button className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{comment.likes > 0 ? comment.likes : "Like"}</span>
                          </button>

                          {user && (
                            <button
                              onClick={() => {
                                setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                                setReplyText("");
                              }}
                              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </button>
                          )}

                          {(isOwner || isAdmin) && (
                            <button
                              onClick={() => handleDelete(comment.id, comment.authorEmail)}
                              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-500 transition-colors ml-auto opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          )}
                        </div>

                        {/* Inline Reply Form */}
                        {activeReplyId === comment.id && (
                          <div className="mt-3.5 pl-3 border-l-2 border-indigo-500/30 dark:border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                              rows={2}
                              className="w-full text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-85 border border-slate-250 dark:border-slate-750 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setActiveReplyId(null)}
                                className="px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-250 dark:border-slate-750 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handlePostReply(comment.id)}
                                disabled={!replyText.trim() || isSubmittingReply}
                                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[10px] font-extrabold shadow-sm hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                              >
                                {isSubmittingReply ? "Posting..." : "Reply"}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Nested Replies List */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 pl-3.5 border-l-2 border-indigo-500/25 dark:border-slate-800 space-y-2.5">
                            {comment.replies.map((reply) => {
                              return (
                                <div
                                  key={reply.id}
                                  className="flex gap-2.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-900/30"
                                >
                                  {/* Reply Avatar */}
                                  <div
                                    className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarColor(reply.authorName)} text-white flex items-center justify-center shrink-0 text-[10px] font-bold shadow-sm`}
                                  >
                                    {getInitials(reply.authorName)}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                      <span className="text-xs font-bold text-slate-850 dark:text-white">
                                        {reply.authorName}
                                      </span>
                                      {reply.authorIsAdmin && (
                                        <span className="text-[8px] font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-1.5 py-0.5 rounded-full border border-purple-550 shadow-sm flex items-center gap-0.5 scale-95 origin-left">
                                          <Sparkles className="w-2 h-2 text-yellow-300 fill-yellow-300 animate-pulse" />
                                          Admin
                                        </span>
                                      )}
                                      {reply.authorPercentile && !reply.authorIsAdmin && (
                                        <span className="text-[8px] font-bold text-indigo-550 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-850 scale-95 origin-left">
                                          {reply.authorPercentile}%ile
                                        </span>
                                      )}
                                      <span className="text-[9px] text-slate-400 dark:text-slate-500 ml-auto">
                                        {formatReplyTime(reply.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                                      {reply.text}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CommunityComments;

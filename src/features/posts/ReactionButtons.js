import React from "react"
import { useDispatch } from "react-redux"
import { reactionAdded } from "./postsSlice"

const reactionEmoji = {
  thumbsUp: "👍",
  hooray: "🎉",
  heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
}

export const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch()

  const handleClick = (name) => {
    dispatch(reactionAdded({ postId: post.id, reaction: name }))
  }

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        onClick={() => handleClick(name)}
        key={name}
        type="button"
        className="muted-button reaction-button"
      >
        {emoji} {post.reactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}

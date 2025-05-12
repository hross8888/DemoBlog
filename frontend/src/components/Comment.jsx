import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Box, Typography, Collapse, TextField, Button } from "@mui/material";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate } from "../utils";
import commentStore from "../store/commentStore.js";

const CommentsBlock = observer(({ postId, isExpanded }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (isExpanded && !commentStore.has(postId)) {
      commentStore.loadComments(postId);
    }
  }, [isExpanded, postId]);

  const comments = commentStore.getComments(postId);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const success = await commentStore.addComment(postId, text);
    if (success) {
      setInput("");
    }
  };

  return (
    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Comments:
        </Typography>

        {comments.map((comment) => (
          <Box key={comment.id} mb={1} p={1} sx={{backgroundColor: "#f7f7f7" }}>
            <Typography variant="body2">{comment.author}</Typography>
            <Typography variant="body2">{comment.text}</Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              {formatDate(comment.created_at)}
            </Typography>
              {comment.is_mine && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => commentStore.deleteComment(postId, comment.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

        ))}

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </Box>
      </Box>
    </Collapse>
  );
});

export default CommentsBlock;

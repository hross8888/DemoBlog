import {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {formatDate, isTokenValid} from "../utils.js";
import commentStore from "../store/commentStore.js";
import postStore from "../store/postStore.js";
import CommentsBlock from "./Comment.jsx";
import LoginForm from "./LoginForm.jsx";

const BlogPage = observer(() => {
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [newPostText, setNewPostText] = useState("");
  const isAuthenticated = (() => {
    const token = localStorage.getItem("access_token");
    return token && isTokenValid(token);
  })();

  useEffect(() => {
    postStore.loadPosts().then(() => {
    });
  }, []);

  const handleCreatePost = async () => {
    const text = newPostText.trim();
    if (!text) return;

    const success = await postStore.createPost(text);
    if (success) {
      setNewPostText("");
    }
  };

  const handleToggleComments = async (postId) => {
    const isExpanded = expandedPostId === postId;
    if (!isExpanded && !commentStore.has(postId)) {
      await commentStore.loadComments(postId);
    }
    setExpandedPostId(isExpanded ? null : postId);
  };
  if (!isAuthenticated) {
    return <LoginForm/>;
  }
  return (
    <>
      <Box sx={{display: "flex", justifyContent: "flex-end", mt: 2}}>
        <Button
          size="small"
          onClick={() => {
            localStorage.removeItem("access_token");
            window.location.reload();
          }}
        >
          Выйти
        </Button>
      </Box>
      <Container maxWidth="md">

        <Typography variant="h4" gutterBottom>
          Demo Blog
        </Typography>

        {postStore?.posts?.map((post) => {
          const isExpanded = expandedPostId === post.id;

          const iconButtonTextSX = {
            ml: 0.5,
            display: "flex",
            alignItems: "center",
            height: 24,
          };

          return (
            <Card key={post.id} sx={{mb: 2}}>
              <CardContent>

                <Typography variant="body1">{post.text}</Typography>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <Typography variant="caption" color="text.secondary">
                    {post.author} • {formatDate(post.created_at)}
                  </Typography>
                  {post.is_mine && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => postStore.deletePost(post.id)}
                    >
                      Delete
                    </Button>
                  )}
                </Box>


                <Box sx={{mt: 1, display: "flex", gap: 1, alignItems: "center"}}>
                  <Box sx={{display: "flex", alignItems: "center"}}>
                    <IconButton size="small" onClick={() => postStore.toggleLike(post.id)}>
                      <FavoriteBorderIcon
                        fontSize="small"
                        sx={{color: post.liked_by_me ? "#ff6666" : "#bdbdbd"}}
                      />
                    </IconButton>
                    <Typography variant="body2" sx={iconButtonTextSX}>
                      {post.likes_count}
                    </Typography>
                  </Box>

                  <Box sx={{display: "flex", alignItems: "center"}}>
                    <IconButton size="small" onClick={() => handleToggleComments(post.id)}>
                      <ChatBubbleOutlineIcon fontSize="small"/>
                    </IconButton>
                    <Typography variant="body2" sx={iconButtonTextSX}>
                      {post.comment_count}
                    </Typography>
                  </Box>
                </Box>
                <CommentsBlock postId={post.id} isExpanded={isExpanded}/>

              </CardContent>
            </Card>
          );
        })}

        <Box mb={3}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="New post"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{mt: 1}}
            onClick={handleCreatePost}
            disabled={!newPostText.trim()}
          >
            Post
          </Button>
        </Box>
      </Container>
    </>
  );
});

export default BlogPage;

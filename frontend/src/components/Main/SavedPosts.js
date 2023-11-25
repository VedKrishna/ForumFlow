import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

const SavedPosts = () => {
  const [comment,setcomment] = useState('')
  const [postts, setposts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const handleaddcomment = (postt) => {
    try{
      console.log(comment)
      axios
        .post("/api/subgreddit/comments", { post: postt, comment: comment})
        .catch((err) => console.log(err));
    }
    catch(error){
      console.log(error)
    }
  }
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("/api/savedpost");
      //console.log(response.data)
      // const filtered = []
      // let i =0
      // for(i = 0;i<response.data.length;i++)
      // {
      //   if((response.data)[i].user === localStorage.getItem("token"))
      //   {
      //     filtered.push((response.data)[i])
      //   }
      // }
      console.log(response.data)
      const filtered = response.data.filter(postts => postts.savedby.includes(localStorage.getItem("token")));
      //console.log(filtered)
      setposts(filtered);
    };

    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    const response = await axios.get("/api/savedpost");
    const filtered = response.data.filter(postts => postts.savedby.includes(localStorage.getItem("token")));
    //console.log(filtered)
    setposts(filtered);
  };
  const handleupvote = async(id) => {
    axios
      .post("/api/subgreddit/upvote", { post: id, name: localStorage.getItem("token")})
      .catch((err) => console.log(err));
  }
  const handledownvote = async(id) => {
    axios
      .post("/api/subgreddit/downvote", { post: id, name: localStorage.getItem("token")})
      .catch((err) => console.log(err));
  }
  const handleunsave = async(postid) => {
    try{
      const data = {
        email: localStorage.getItem("token")
      }
      console.log(postid)
      let c = "/api/savedpost/"
      let d = postid
      let p = c.concat(d)
      console.log(p)
    await axios.delete(p, {params: data})
    fetchPosts()
    }
    catch(error)
    {
      console.log(error)
    }
  }
  //console.log(filteredSubreddits[0])
  return (
    <div>
        <Navbar />
      <h1>Saved Posts</h1>
      <ul>
        {postts.map(post => (
          <li key={post._id}>
              <p>Title: {post.title}</p>
              <p>Content: {post.textSubmission}</p>
              <p>Created by: {post.author}</p>
              {post.image == "" || post.image == null? "" : <img width={200} height={200} src={post.image} style={{marginRight: '100%'}}/>}
              <p>Subgreddiit: {post.subreddit}</p>
              <p>Upvote count: {post.upvotecount}</p>
              <p>Downvote count: {post.downvotecount}</p>
              <button onClick={(event) => handleunsave(post._id)}>Unsave</button>
              <button onClick={(event) => handleupvote(post._id)}>Upvote</button>
              <button onClick={(event) => handledownvote(post._id)}>Downvote</button>
              <br />
              <form onSubmit={(event) => handleaddcomment(post._id)}>
  <div>
    <label for="comment">Add Comment:</label>
    <input id="comment" value={comment} onChange={(event) => setcomment(event.target.value)} required/>
  </div>
  <button type="submit">Submit</button>
</form>
<h3>Comments:</h3>
<h3>{post.comments.length}</h3>
<ul>
{post.comments.map(comment => (
  <li>{comment}</li>
))}
</ul>
          </li>
        ))}
      </ul>
    </div>
  );
}; 
export default SavedPosts;

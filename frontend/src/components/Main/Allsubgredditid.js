import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import { useParams } from 'react-router-dom';
import styles from "./styles.module.css";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from '../Navbar/NavbarElements';

const SubredditDetails = () => {
  const [ismember,setismember] = useState(false)
  const [reporting,setreport] = useState(false)
  const [concern, setconcern] = useState('')
  const [comment,setcomment] = useState('')
  const [postts, setposts] = useState([]);
  const [nameform, setnameform] = useState({ title: "", content: "", image: "", author: localStorage.getItem("token"), subreddit: useParams().id});
  const [showForm, setShowForm] = useState(false);
  const [subreddit, setSubreddit] = useState(null);
  const idd = useParams()
//   console.log(idd)
let abc = ""
  useEffect(() => {
    const fetchSubreddit = async () => {
    try{
        let c = "/api/subgreddit/"
        let d = idd.id
        console.log(d)
        let p = c.concat(d)
        //console.log(p)
      const response = await axios.get(p);
      setSubreddit(response.data);
    }
    catch(error)
    {
        console.log(error)
    }
    };

    fetchSubreddit();
  }, [idd]);
  const handleSavePost = async(id) => {
    axios
      .post("/api/savedpost", { post: id, name: localStorage.getItem("token")})
      .catch((err) => console.log(err));
  }
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
  const handleClick = (admin,members) => {
    setShowForm(false)
    console.log(members)
    console.log(localStorage.getItem("token"))
    if(admin === localStorage.getItem("token") || members.includes(localStorage.getItem("token")))
    {
    setShowForm(!showForm)
    }
  }
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
  const handleFollow = async(email) => {
    try{
      const data = {
        email: email,
        email2: localStorage.getItem("token")
      }
    axios.post("/api/users/followers", data)
    }
    catch(error){
      console.log(error)
    }
  }
  const handleChangetitle = (event) => {
    setnameform({ ...nameform, title: event.target.value})
  }
  const handleChangecontent = (event) => {
    setnameform({ ...nameform, content: event.target.value})
  }
  const handleChangefile = (e) => {
    
    console.log(e)
    var reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
      console.log(reader.result);
      setnameform({ ...nameform, image: reader.result})
    };
    reader.onerror = error => {
      console.log("Error: ", error)
    }
  }
  const handleaddreport = async(id) => {
    setreport(false)
    const data = {
      id: id,
      reporter: localStorage.getItem("token"),
      concern: concern,
      subreddit: nameform.subreddit,
    }
    const response = axios.post("/api/reportedpost", {params: data})

  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let c = "/api/subgreddit/"
			let d = idd.id
      let p = c.concat(d)
      let q = "/posts"
      let r = p.concat(q)
      //console.log(r)
			const res = await axios.post(r, nameform);
      if(res.data.makealert)
      {
        alert("The post contains the banned key word")
      }
		} catch (error) {
			console.log(error)
		}
  }
  useEffect(() => {
    const fetchposts = async () => {
      let c = "/api/subgreddit/"
			let d = idd.id
      let p = c.concat(d)
      let q = "/posts"
      let r = p.concat(q)
      const response = await axios.get(r);
      //console.log(response.data.subredditName)
      setposts(response.data);
    };

    fetchposts();
  }, []);
  const handlereportbutton = () => {
    setreport(true)
  }
  if (!subreddit) {
    return <div>Loading...</div>;
  }
  //console.log(subreddit)
  //console.log(subreddit.bannedkeywords)
  let commasep = subreddit.bannedkeywords.join(",")
  let url = "/allsubgreddiit/"
  url = url.concat(subreddit._id)
  url = url.concat("/users")
  let url1 = "/allsubgreddiit/"
  url1 = url1.concat(subreddit._id)
  url1 = url1.concat("/reports")
  let url2 = "/allsubgreddiit/"
  url2 = url2.concat(subreddit._id)
  url2 = url2.concat("/joiningreqs")
  
  return (
    <div>
      <Navbar />
      <Nav>
        <Bars />
  
        <NavMenu>
        <NavLink to={url} activeStyle>
            Users
          </NavLink>
          <NavLink to={url2} activeStyle>
            Joining Requests
          </NavLink>
          <NavLink to={url1} activeStyle>
            Reports
          </NavLink>
          <NavLink to='/stats' activeStyle>
            Stats
          </NavLink>
        </NavMenu>
      </Nav>
      <img src="https://source.unsplash.com/random" alt="Random Image" width="200" height="200"></img>
      <h1>Name: {subreddit.subredditName}</h1>
      <p>Description: {subreddit.description}</p>
      <p>Created by: {subreddit.admin}</p>
      <p>Banned key words:</p>
      <p>{commasep}</p>
      <p>Number of posts: {subreddit.posts.length}</p>
      <p>Number of users: {subreddit.members.length}</p>
      <button onClick={(event) => handleClick(subreddit.admin,subreddit.members)}>Add new post</button>
      {showForm && (
        <div style={{paddingBottom: "100px"}}>
          <form onSubmit={handleSubmit}>
          <h1>ADD DETAILS</h1>
          <input
              type="Title"
              placeholder="Title"
              name="title"
              onChange={handleChangetitle}
              value={nameform.title}
          />
          <input
              type="Content"
              placeholder="Content"
              name="content"
              onChange={handleChangecontent}
              value={nameform.content}
          />
          <input
            accept='image/*'
            type="file"
            name="file"
            onChange={handleChangefile}
          />
          {nameform.image == "" || nameform.image == null? "" : <img width={100} height={100} src={nameform.image}/>}
          <button type="submit">
              SUBMIT
          </button>
      </form>
    </div>
      )}
      <h2>Posts</h2>
      <ul>
        {postts.map(postt => (
          <li key={postt._id}>
            <h3>Title: {postt.title}</h3>
            <p>Content: {postt.textSubmission}</p>
            <p>Author: {postt.author}</p>
            {postt.image == "" || postt.image == null? "" : <img width={200} height={200} src={postt.image} style={{marginRight: '100%'}}/>}
            <p>Upvote count: {postt.upvotecount}</p>
            <p>Downvote count: {postt.downvotecount}</p>
            <button onClick={(event) => handleFollow(postt.author)}> Follow </button>
            {(((subreddit.admin === localStorage.getItem("token")) || subreddit.members.includes(localStorage.getItem("token"))) && postt.isSaved) ? (
        <p>Post saved!</p>
      ) : ((((subreddit.admin === localStorage.getItem("token")) || subreddit.members.includes(localStorage.getItem("token"))))?(
        <button onClick={(event) => handleSavePost(postt._id)}>Save post</button>
      ):(
        <div>

        </div>
      )

      )}
      {((subreddit.admin === localStorage.getItem("token")) || subreddit.members.includes(localStorage.getItem("token"))) && (
        <div>
      <button onClick={(event) => handleupvote(postt._id)}>Upvote</button>
      <button onClick={(event) => handledownvote(postt._id)}>Downvote</button>
      <button onClick={(event) => handlereportbutton()}>Report</button>
      </div>
      )}
      {((subreddit.admin === localStorage.getItem("token")) || subreddit.members.includes(localStorage.getItem("token"))) && reporting && (
        <form onSubmit={(event) => handleaddreport(postt._id)}>
          <div>
            <label htmlFor="report">Add concern:</label>
            <input id="report" value={concern} onChange={(event) => setconcern(event.target.value)} required/>
          </div>
          <button type="submit">Submit Report</button>
        </form>
      )}
      {((subreddit.admin === localStorage.getItem("token")) || subreddit.members.includes(localStorage.getItem("token"))) && (
        <div>
      <br />
      <form onSubmit={(event) => handleaddcomment(postt._id)}>
  <div>
    <label htmlFor="comment">Add Comment:</label>
    <input id="comment" value={comment} onChange={(event) => setcomment(event.target.value)} required/>
  </div>
  <button type="submit">Submit</button>
</form>
</div>
      )}
<h3>Comments:</h3>
<h3>{postt.comments.length}</h3>
<ul>
{postt.comments.map(comment => (
  <li>{comment}</li>
))}
</ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubredditDetails;
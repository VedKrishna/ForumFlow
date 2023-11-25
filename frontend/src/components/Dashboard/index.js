import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import Navbar from '../Navbar';
import axios from 'axios';

function Dashboard()
{

    const [posts, setPosts] = useState([]);
    const [reporting,setreport] = useState(false)
    const [concern, setconcern] = useState('')
    const [comment,setcomment] = useState('')
    const [nameform, setnameform] = useState({subreddit: useParams().id});

    useEffect(() => {
        const fetchPosts = async() => {
            try{
                const response = await axios.get("/api/dashboard", {
                    params: { email: localStorage.getItem("token") },
                })
                console.log(typeof response.data[0].updatedAt)
                response.data.sort((a,b) => (a.updatedAt < b.updatedAt)? 1:-1)
                setPosts(response.data)
            }
            catch(error){
                console.log(error)
            }
        };

        fetchPosts();
    }, [])

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

    const handlereportbutton = () => {
        setreport(!reporting)
    }

    const test = () => {
        console.log(posts)
    }

    test();

    return(
        <div>
            <Navbar />

            <h2>Latest updates from the forums you follow:</h2>
            <ul>
                {posts.map(post => (
                    <li key = {post.id}>
                        <h3>Subgreddiit: {post.subreddit}</h3>
                        <h3>Title: {post.title}</h3>
                        <p>Content: {post.textSubmission}</p>
                        <p>Author: {post.author}</p>
                        {post.image == "" || post.image == null? "" : <img width={200} height={200} src={post.image} style={{marginRight: '100%'}}/>}
                        <p>Upvote count: {post.upvotecount}</p>
                        <p>Downvote count: {post.downvotecount}</p>
                        <button onClick={(event) => handleFollow(post.author)}> Follow </button>
                        {(post.isSaved)?
                            (<p>Post saved!</p>):
                            (<button onClick={(event) => handleSavePost(post._id)}>Save post</button>)
                        }
                        <div>
                            <button onClick={(event) => handleupvote(post._id)}>Upvote</button>
                            <button onClick={(event) => handledownvote(post._id)}>Downvote</button>
                            <button onClick={(event) => handlereportbutton()}>Report</button>
                        </div>
                        {(reporting)?
                            (
                                <form onSubmit={(event) => handleaddreport(post._id)}>
                                    <div>
                                        <label htmlFor="report">Add concern:</label>
                                        <input id="report" value={concern} onChange={(event) => setconcern(event.target.value)} required/>
                                    </div>
                                    <button type="submit">Submit Report</button>
                                </form>
                            ):
                            ''
                        }
                        <div>
                            <br/>
                            <form onSubmit={(event) => handleaddcomment(post._id)}>
                                <div>
                                    <label htmlFor="comment">Add Comment:</label>
                                    <input id="comment" value={comment} onChange={(event) => setcomment(event.target.value)} required/>
                                </div>
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                        <h3>Comments: </h3>
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
    )

}

export default Dashboard
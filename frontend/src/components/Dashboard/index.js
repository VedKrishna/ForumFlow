import React, {useState, useEffect} from 'react'
import 'react-router-dom'
import Navbar from '../Navbar';
import axios from 'axios';

function Dashboard()
{

    const [posts, setPosts] = useState([]);

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

    const test = () => {
        console.log(posts)
    }

    test();

    return(
        <div>
            <Navbar />

            
        </div>
    )

}

export default Dashboard
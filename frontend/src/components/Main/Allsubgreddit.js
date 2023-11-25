import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

const SubredditsList = () => {
  const [subreddits, setSubreddits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagfilter,settagfilter] = useState('')
  const [sortBy, setSortBy] = useState('none');

  useEffect(() => {
    const fetchSubreddits = async () => {
      const response = await axios.get("/api/subgreddit");
      console.log(response.data.subredditName)
      setSubreddits(response.data);
    };

    fetchSubreddits();
  }, []);
  let filteredSubreddits = subreddits.filter(subreddit => subreddit.subredditName.toLowerCase().includes(searchQuery.toLowerCase()));
  if(tagfilter)
  {
  filteredSubreddits = filteredSubreddits.filter(subreddit => subreddit.tags.includes(tagfilter))
  }
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };
  const handlejoin = async(id) => {
    try{
    const data = {
      id: id,
      email: localStorage.getItem("token")
    }
    const response = await axios.post("/api/subgreddit/join",{params: data}) ;
    if(response.data.makealert === true)
    {
      alert("You have left this subgreddiit once. You can't join again")
    }
  }
  catch(error){
    console.log(error)
  }
  }
  const handleleave = async(id) => {
    try{
    const data = {
      id: id,
      email: localStorage.getItem("token")
    }
    const response = axios.post("/api/subgreddit/leave",{params: data}) ;
  }
  catch(error){
    console.log(error)
  }
  }
  if (sortBy === 'name') {
    filteredSubreddits.sort((a, b) => a.subredditName.localeCompare(b.subredditName));
  } else if (sortBy === 'followers') {
    filteredSubreddits.sort((a, b) => b.members.length- a.members.length);
  } else if (sortBy === 'created_at') {
    filteredSubreddits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  else if(sortBy === 'none') {
    filteredSubreddits.sort((a, b) => (b.admin === localStorage.getItem("token") || b.members.includes(localStorage.getItem("token"))) - (a.admin === localStorage.getItem("token") || a.members.includes(localStorage.getItem("token"))))
  }
  // else if(sortBy === 'none') {
  //   let d = []
  //   for(let i = 0;i<filteredSubreddits.length;i++)
  //   {
  //     if(filteredSubreddits[i].admin === localStorage.getItem("token") || filteredSubreddits[i].members.includes(localStorage.getItem("token")))
  //     {
  //       d.push(filteredSubreddits[i])
  //     }

  //   }
  //   for(let i = 0;i<filteredSubreddits.length;i++)
  //   {
  //     if(!(filteredSubreddits[i].admin === localStorage.getItem("token") || filteredSubreddits[i].members.includes(localStorage.getItem("token"))))
  //     {
  //       d.push(filteredSubreddits[i])
  //     }

  //   }
  //   filteredSubreddits = d

  // }
  //console.log(filteredSubreddits[0])
  return (
    <div>
        <Navbar />
      <h1>All subgreddiits</h1>
      <select value={sortBy} onChange={handleSortByChange}>
        <option value="none">No filter</option>
        <option value="name">Sort by name</option>
        <option value="followers">Sort by followers</option>
        <option value="created_at">Sort by creation date</option>
      </select>
      <input type="text" placeholder="Search Tags" value={tagfilter} onChange={e => settagfilter(e.target.value)} />
      <input type="text" placeholder="Search subreddits" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      <ul>
        {filteredSubreddits.map(subreddit => (
          <li key={subreddit._id}>
            <a href={`/allsubgreddiit/${subreddit._id}`}>{subreddit.subredditName}</a>
            {!(subreddit.admin === localStorage.getItem("token")) && !(subreddit.members.includes(localStorage.getItem("token"))) && (
              <button onClick={(event) => handlejoin(subreddit._id)}>Join</button>
            )}
            {(subreddit.members.includes(localStorage.getItem("token"))) && !(subreddit.admin === localStorage.getItem("token")) && (
              <button onClick={(event) => handleleave(subreddit._id)}>Leave</button>
            )}
            {(subreddit.admin === localStorage.getItem("token")) && (
              <button>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}; 
export default SubredditsList;

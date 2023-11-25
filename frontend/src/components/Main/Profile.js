


import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Navbar from "../Navbar";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);
// const connectionParams = {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// };
// mongoose.connect("mongodb+srv://Mourya07:Mourya07@cluster0.yjrbwzd.mongodb.net/?retryWrites=true&w=majority", connectionParams);
const Main = () => {
	const [showfollowing,setshowfollowing] = useState(false)
	const [showfollowers,setshowfollowers] = useState(false)
	const [datalogin, setDatalogin] = useState({ email: "", password: "" });
	const handleLogout = () => {
		localStorage.removeItem("token");
		// const url = "/api/auth";
		// axios.get(url).then(resp => { console.log(resp.data)})
		window.location.reload();
	};
	const [userdetails, setuserdetails] = useState([])
	const [followingg,setfollowing] = useState([])
	const [followerss,setfollowers] = useState([])

	const data = {
		email: localStorage.getItem("token")
	}
	let c = ""
	let d = ""
	useEffect(() => {
		const fetchdetails = async () => {
			try {
				const response = await axios.get("/api/users", { params: data });
				console.log(response.data.following)
				console.log("data", response.data)
				setuserdetails(response.data);
				setfollowers(response.data.followers)
				setfollowing(response.data.following)
			}
			catch (error) {
				console.log(error)
			}
		};

		fetchdetails();
	}, []);
	const handleunfollow = (email) => {
		const data = {
			email: email,
			email2: localStorage.getItem("token")
		}
		try{
			const response = axios.delete("/api/users/followers", {params: data})
		}
		catch(error)
		{
			console.log(error)
		}
	}
	const handleremovefollow = (email) => {
		const data = {
			email: email,
			email2: localStorage.getItem("token")
		}
		try{
			const response = axios.delete("/api/users/following", {params: data})
		}
		catch(error)
		{
			console.log(error)
		}
	}
	return (
		<div>
			<Navbar />
			<div className={styles.main_container}>
				<h3>First Name: </h3>
				<p> {userdetails.firstName}</p>
				<h3>Last Name: </h3>
				<p> {userdetails.lastName}</p>
				<h3>Email: </h3>
				<p> {userdetails.email}</p>
				<h3>Username: </h3>
				<p> {userdetails.username}</p>
				<br />
				<h3>Following: <button onClick={(event) => setshowfollowing(true)}>{followingg.length}</button></h3>
				{showfollowing && (
					<div>
				 <ul>
        {followingg.map(user => (
          <li>
            <p>{user}</p>
			<button onClick={(event) => handleunfollow(user)}>Unfollow</button>
          </li>
        ))}
      </ul> 
	  <button onClick={(event) => setshowfollowing(false)}>Hide</button>
	  </div>
)}

				<h3>Followers: <button onClick={(event) => setshowfollowers(true)}>{followerss.length}</button></h3>
				{ showfollowers && 
				(
				<div><ul>
        {followerss.map(user => (
          <li>
            <p>{user}</p>
			<button onClick={(event) => handleremovefollow(user)}>Remove</button>
          </li>
        ))}
      </ul>
	  <button onClick={(event) => setshowfollowers(false)}>Hide</button>
	  </div>
	  ) }
			</div>
		</div>
	);
};

export default Main;

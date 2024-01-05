import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	async function handleSubmit() {
		try {
			const res = await fetch("http://localhost:3000/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, password }),
			});

			const data = await res.json();
			console.log(data);
			setName("");
			setPassword("");

			if (data.success) {
				alert(`user ${data.user.name} registerd successfully`);
				navigate("/login");
			} else {
				alert("something bad happend");
			}
		} catch (error) {
			alert("something bad happend");
		}
	}

	return (
		<div>
			<h1>Register</h1>
			<input
				onChange={(e) => setName(e.target.value)}
				type="text"
				name="name"
				value={name}
				placeholder="name"
			/>
			<br />
			<input
				onChange={(e) => setPassword(e.target.value)}
				type="password"
				name="password"
				value={password}
				placeholder="password"
			/>
			<br />
			<button onClick={(e) => handleSubmit(e)}>Register</button>
			<br />
			<Link to="/login">
				<a>Login Page</a>
			</Link>
		</div>
	);
}

export default Register;

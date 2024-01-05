import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");

	async function handleSubmit() {
		try {
			const res = await fetch("http://localhost:3000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, password }),
			});

			if (res.ok) {
				const data = await res.json();
				console.log(data);

				// Assuming the server returns a token in the response
				const token = data.token;

				// Now, fetch the user profile using the obtained token
				const profileRes = await fetch("http://localhost:3000/profile", {
					method: "GET",
					headers: {
						Authorization: token,
					},
				});

				if (profileRes.ok) {
					const profileData = await profileRes.json();
					console.log("Profile Data:", profileData);
					alert("logged in successfuly");
				} else {
					alert("failed in log in");
					console.error("Error fetching profile:", profileRes.statusText);
				}

				setName("");
				setPassword("");
			} else {
				alert("failed in log in");
				alert("failed in log in");
			}
		} catch (error) {
			console.error("Login failed:", res.statusText);
			console.error("Error during login:", error);
		}
	}

	return (
		<div>
			<h1>Login</h1>
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
			<button onClick={(e) => handleSubmit(e)}>Login</button>
			<br />
			<Link to="/">
				<a>Register Page</a>
			</Link>
		</div>
	);
}

export default Login;

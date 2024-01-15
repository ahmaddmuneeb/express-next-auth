import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const { data: session } = useSession();

  const [signupOn, setSignupOn] = useState(false);
  const [loginOn, setLoginOn] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   register
  const handleRegistration = async (e) => {
    // e.preventDefault();

    if (name === "" || username === "" || email === "" || password === "") {
      alert("All fieldsa are required");
    }
    let payload = {
      name: name,
      username: username,
      email: email,
      password: password,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/register",
        payload
      );
      if (response.data.success) {
        alert("User registered successfully");
        console.log("User registered successfully:", response.data);
        setSignupOn(false);
        setEmail("");
        setUsername("");
        setName("");
        setPassword("");
      } else {
        alert("Cannot register user, pleasee check and try again");
      }
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };
  // login
  const handleLogin = async (e) => {
    if (username === "" || password === "") {
      alert("All fieldsa are required");
    }
    let payload = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/login",
        payload
      );
      if (response.data.success) {
        alert("User logged in successfully");
        console.log("User logged in successfully:", response.data);
        setLoginOn(false);
        setUsername("");
        setPassword("");
      } else {
        alert("Cannot login user, pleasee check and try again");
      }
    } catch (error) {
      console.error("Error in login the user:", error.message);
    }
  };

  return (
    <main>
      <h1>Express Next Auth</h1>
      <div className="text-white text-xl">
        {session ? (
          <>
            <Image
              className="rounded-full block mx-auto my-3"
              src={session.user?.image}
              width={160}
              height={160}
              alt="avatar"
            />
            <h3 className="font-bold">Signed in as {session.user?.name}</h3>
            <button className="block mx-auto" onClick={() => signOut()}>
              LogOut
            </button>
          </>
        ) : (
          <>
            <button className="w-full" onClick={() => signIn("github")}>
              Sign In with GitHub
            </button>
            <button className="w-full" onClick={() => signIn("google")}>
              Sign In with Google
            </button>
            <button className="w-full" onClick={() => setSignupOn(true)}>
              Signup with email
            </button>
            {signupOn && (
              <div className="flex flex-col">
                <input
                  className="m-2 p-2 text-black rounded"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="m-2 p-2 text-black rounded"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  className="m-2 p-2 text-black rounded"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="m-2 p-2 text-black rounded"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="w-full bg-red-400"
                  onClick={handleRegistration}
                >
                  Register
                </button>
              </div>
            )}
            <div>
              <p className="mx-4 flex items-center justify-center">OR</p>
            </div>
            <button
              className="w-full bg-purple-500"
              onClick={() => setLoginOn(true)}
            >
              Login
            </button>
            {loginOn && (
              <div className="flex flex-col">
                <input
                  className="m-2 p-2 text-black rounded"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  className="m-2 p-2 text-black rounded"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-red-400" onClick={handleLogin}>
                  Register
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

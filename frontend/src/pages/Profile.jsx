import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Btn from "../components/common/Btn";
import axios from "axios";

const Profile = () => {

    const user = JSON.parse(localStorage.getItem("user"));
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const clickHandler = async (e) => {
        e.preventDefault();
        const data = {
            name: name,
            email: email,
            _id: user._id
        }

        try {

            if (!name || !email || !user._id) {
                alert("Please fill all the fields!");
                return;
            }
            console.log("data---->>", data);
            const response = await axios.post("http://localhost:3000/api/auth/update-profile", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            console.log("response---->>", response);

            if (response.data.success == true) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                alert("Profile updated successfully")
                navigate("/profile")
            }



        } catch (error) {
            console.log("Error:", error);
        }

    }

    const cancelHandler = (e) => {
        e.preventDefault();
        setName("");
        setEmail("");
        return
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center ">
            {/* Navbar */}
            <div className="bg-black text-white w-full mt-6 max-w-4xl p-4 rounded-xl flex justify-between items-center">
                <h1 className="text-lg font-bold text-white">AI-Powered Legal Documentation Assistant</h1>
                <div className="space-x-2">
                    <Link to={'/dashboard'} className="bg-red-500 px-4 py-2 rounded text-white">Dashboard</Link>
                    <Btn />
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-gray-700 text-white w-full max-w-2xl mt-8 p-6 rounded-md shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

                <div
                    className="space-y-2 bg-gray-600 max-w-4xl w-full px-8 py-4 mt-4 text-gray-300 rounded-md"
                >
                    <p className="text-2xl font-semibold text-black">Welcome, {user.name}!</p>
                    <p>Email: {user.email}</p>

                </div>

                {/* Name Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-400 bg-gray-200 text-black rounded-md focus:outline-none"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Email Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-400 bg-gray-200 text-black rounded-md focus:outline-none"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                    <button onClick={clickHandler} className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded">
                        Save Changes
                    </button>
                    <button onClick={cancelHandler} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;

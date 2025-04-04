import React from 'react'
import { useNavigate } from 'react-router-dom';


function Btn() {
    const navigate = useNavigate();

    const clickHandler = (e) => {
        e.preventDefault();

        localStorage.removeItem("user");
        navigate("/login")
    }
    return (
        <button onClick={clickHandler} className="bg-red-500 px-2 py-1 rounded text-white">Logout</button>

    )
}

export default Btn
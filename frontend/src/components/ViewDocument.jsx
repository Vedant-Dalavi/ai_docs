import React from 'react'
import Translation from './Translation'
import { Link, useLocation } from "react-router-dom";
import Btn from './common/Btn';


function ViewDocument() {
    const location = useLocation();

    const { response } = location.state || {};  // Get 'result' from state

    return (
        <div className="bg-gray-700 min-h-screen flex flex-col items-center p-6">
            <div className="bg-black text-white w-full max-w-4xl p-4 rounded-xl flex justify-between items-center">
                <h1 className="text-lg font-bold text-white">AI-Powered Legal Documentation Assistant</h1>
                <div className="space-x-2">
                    <Link to={'/'} className="bg-red-500 px-4 py-2 rounded text-white">Dashboard</Link>

                    <Link to={'/profile'} className="bg-red-500 px-4 py-2 rounded text-white">Profile</Link>
                    <Btn />
                </div>
            </div>
            <Translation translation={response} />
        </div>
    )
}

export default ViewDocument
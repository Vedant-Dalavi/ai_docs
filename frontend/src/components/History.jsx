import axios from 'axios';
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

function History() {

    const user = JSON.parse(localStorage.getItem("user"));
    const [history, setHistory] = React.useState([]);

    useEffect(() => {

        const fetchHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/history/${user._id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                // const data = await response.json();
                setHistory(response.data.history);
                // console.log(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();

    }, [])




    return (
        <div className="bg-gray-600 text-white w-full max-w-4xl p-6 mt-6 rounded-xl ">
            <h2 className="text-lg font-semibold">History</h2>
            <div className="bg-white text-black p-6 rounded mt-4 min-h-[100px] max-h-[500px] overflow-scroll">
                {
                    history.length > 0 ? (history.map((item, index) => (
                        <div key={index} className='border-1 bg-gray-200 border-gray-300 p-4 mb-4 rounded-md'>
                            <div className='flex items-center  justify-between border-b-2 border-gray-300 py-2'>
                                <p>{item.name}</p>
                                <p className='capitalize'>{item.type}</p>
                            </div>
                            <div className='flex items-center gap-x-5'>
                                <p>{item.createdAt.split("T")[0]}</p>
                                <p>{item.createdAt.split("T")[1].split(".")[0]}</p>
                            </div>
                            <div>

                                <div dangerouslySetInnerHTML={{ __html: item.result.split(/\s+/).slice(0, 100).join(" ").replace(/```html/g, '') }} />
                                {item.type !== "legal" && < Link
                                    to={`/history/${item._id}`}
                                    state={{ response: item.result }}
                                    className="text-blue-500 hover:underline"
                                >
                                    See more
                                </Link>}
                            </div>

                        </div>
                    ))) : (
                        <div>
                            <p className='text-center text-gray-500'>No history found</p>
                        </div>
                    )
                }

            </div>
        </div >
    )
}

export default History
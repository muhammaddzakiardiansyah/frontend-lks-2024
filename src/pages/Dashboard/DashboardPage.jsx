import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/forms', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((result) => setData(result.data.forms))
        .catch((error) => alert(error.response.data.message))
    }, [])
    
    return (
        <>
            <Navbar />
            <div className="flex w-[100%]">
                <div className="w-[60%] bg-pink-400 ml-20 mr-5 mt-16 flex flex-col p-5 rounded-xl">
                    <h1 className="text-3xl font-semibold">Your own form</h1>
                    {data?.map((item, index) => {
                        return (
                            <div className="mt-5 flex justify-between items-center font-semibold border border-black px-2 py-3 rounded-md mx-5" key={index}>
                                <div className="flex items-center">
                                    <p className="px-8">{index + 1}</p>
                                    <p className="px-8">{item.name}</p>
                                </div>
                                <p className="pr-8">
                                    <Link to={`/forms/${item.slug}`}>
                                        <button className="px-4 py-1 bg-violet-500 rounded-md text-white">Detail from</button>
                                    </Link>
                                </p>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-16 h-40 w-[40%] mr-20 p-5 bg-violet-500 flex flex-col rounded-xl">
                    <h1 className="pb-5 text-2xl font-semibold">Create new form</h1>
                    <Link to={'/create-form'} className="mx-auto">
                        <button className="mx-5 px-10 py-5 bg-pink-400 rounded-lg text-xl font-bold text-white">Create form</button>
                    </Link>
                </div>
            </div>
            <div className="mb-20"></div>
        </>
    )
}

export default DashboardPage;
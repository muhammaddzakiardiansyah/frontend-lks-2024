import axios from "axios";
import { useState } from "react";

const LoginPage = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/v1/auth/login', data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then((result) => {
            localStorage.setItem('token', result.data.user.accessToken)
            localStorage.setItem('user', result.data.user.name)
            localStorage.setItem('id', result.data.user.id)
            alert(result.data.message)
            location.href = '/dashboard'
        })
        .catch((error) => alert(error.response.data.message))
    }
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-[35%] bg-violet-700 p-10 box-border rounded-2xl">
                <h1 className="text-3xl font-bold text-center mb-8 text-white">Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="my-2">
                        <label htmlFor="email" className="block mb-2 text-xl font-medium text-white">Email</label>
                        <input type="email" id="email" className="w-full py-2 px-5 box-border rounded-md ring-2" onChange={(e) => setData({ ...data, email: e.target.value })} />
                    </div>
                    <div className="my-2">
                        <label htmlFor="password" className="block mb-2 text-xl font-medium text-white">Password</label>
                        <input type="password" id="password" className="w-full py-2 px-5 box-border rounded-md" onChange={(e) => setData({ ...data, password: e.target.value })} />
                    </div>
                    <button className="w-full py-2 bg-pink-400 mt-10 rounded-md font-bold text-lg text-white">Login</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;
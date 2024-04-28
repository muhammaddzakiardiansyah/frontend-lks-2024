import axios from "axios";

const Navbar = () => {
    const handleClickLogout = () => {
        axios.post('http://localhost:8000/api/v1/auth/logout', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then((result) => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('id')
            alert(result.data.message)
            location.href = '/login'
        })
        .catch((error) => alert(error.response.data.message))
    }

    return (
        <nav className="w-[100%] h-14 bg-violet-700 flex justify-between items-center px-32 text-white">
            <h1 className="text-2xl font-bold">Formify</h1>
            <ul className="flex items-center font-semibold">
                <li className="px-2">{localStorage?.getItem('user')}</li>
                <li className="px-5">
                    <button className="bg-pink-400 px-3 py-1 rounded-md" onClick={() => confirm('Are you sure you want to log out?') ? handleClickLogout() : alert('Not logout')}>Logout</button>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;
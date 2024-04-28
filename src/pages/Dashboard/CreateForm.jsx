import { useState } from "react"
import Navbar from "../../components/Navbar"
import axios from "axios";

const CreateForm = () => {
    const [data, setData] = useState({
        name: "",
        slug: "",
        allowed_domains: "",
        description: "",
        limit_one_response: "",
    })
    const slug = data.name.split(' ').join('-');
    const allowedDomains = data.allowed_domains.split(',');
    const limitOneResponse = data.limit_one_response == 'on' ? true : false;
    const handleCreateForm = (e) => {
        e.preventDefault()
        const createForm = {
            name: data.name,
            slug: data.slug ?? slug,
            allowed_domains: allowedDomains,
            description: data.description,
            limit_one_response: limitOneResponse,
        }
        axios.post('http://localhost:8000/api/v1/forms', createForm, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((result) => {
            alert(result.data.message)
            location.href = '/dashboard'
        })
        .catch((error) => {
            const msgError = error.response.data.errors
            let newMsgError = ''
            for(const field in msgError) {
                newMsgError += `${field} :\n${msgError[field].join('\n')}\n`
            }
            alert(error.response.data.message + '\n' + newMsgError)
        })
    }
    return (
        <>
            <Navbar />
            <div className="bg-pink-400 mx-20 mt-16 p-5">
                <h1 className="text-center text-2xl font-bold text-white">Create Form</h1>
                <form onSubmit={handleCreateForm}>
                    <div className="my-2">
                        <label htmlFor="name" className="block mb-2 text-xl font-medium text-white">Name</label>
                        <input type="text" id="name" placeholder="Input name" className="w-full py-2 px-5 box-border rounded-md ring-2" onChange={(e) => setData({ ...data, name: e.target.value })} />
                    </div>
                    <div className="my-2">
                        <label htmlFor="slug" className="block mb-2 text-xl font-medium text-white">Slug</label>
                        <input type="text" id="slug" placeholder="Input slug" className="w-full py-2 px-5 box-border rounded-md" defaultValue={slug} onChange={(e) => setData({ ...data, slug: e.target.value })} />
                    </div>
                    <div className="my-2">
                        <label htmlFor="allowed_domains" className="block mb-2 text-xl font-medium text-white">Allowed Domains</label>
                        <input type="text" id="allowed_domains" placeholder="Input allowed domains multiple input, separate with commas" className="w-full py-2 px-5 box-border rounded-md" onChange={(e) => setData({ ...data, allowed_domains: e.target.value })} />
                    </div>
                    <div className="my-2">
                        <label htmlFor="description" className="block mb-2 text-xl font-medium text-white">Description</label>
                        <input type="text" id="description" placeholder="Input description" className="w-full py-2 px-5 box-border rounded-md" onChange={(e) => setData({ ...data, description: e.target.value })} />
                    </div>
                    <div className="my-2">
                        <label htmlFor="limit_one_response" className="block mb-2 text-xl font-medium text-white">Limit One Response</label>
                        <input type="checkbox" id="limit_one_response" className="w-7 h-7" onChange={(e) => setData({ ...data, limit_one_response: e.target.value })} />
                    </div>
                    <button className="w-full py-2 bg-violet-700 mt-10 rounded-md font-bold text-lg text-white">Submit</button>
                </form>
            </div>
        </>
    )
}

export default CreateForm;
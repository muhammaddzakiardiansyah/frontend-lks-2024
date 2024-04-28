import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const CreateQuestionPage = () => {
    const [questionElement, setQuestionElement] = useState(false)
    const [layoutPage, setLayoutPage] = useState('form')
    const [dataForm, setDataForm] = useState({})
    const [dataResponse, setDataResponse] = useState([])
    const [createQuestion, setCreateQuestion] = useState({
        name: "",
        choice_type: "",
        choices: "",
        is_required: "",
    })
    const [createResponse, setCreateResponse] = useState([])
    const param = useParams()
    const locationPath = useLocation()
    
    // get detail form
    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/forms/${param.slug}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((result) => setDataForm(result.data.form))
            .catch((error) => alert(error.response.data.message))
    }, [])

    // get all responses
    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/forms/${param.slug}/response`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((result) => setDataResponse(result.data.responses))
            .catch((error) => alert(error.response.data.message))
    }, [])

    const handleCreateQuestion = (e) => {
        e.preventDefault()
        const question = {
            name: createQuestion.name,
            choice_type: createQuestion.choice_type,
            choices: createQuestion.choices.split(','),
            is_required: createQuestion.is_required == 'on' ? true : false
        }
        axios.post(`http://localhost:8000/api/v1/forms/${dataForm.slug}/questions`, question, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((result) => {
            alert(result.data.message)
            location.reload(true)
        })
        .catch((error) => {
            let newErrMsg = ''
            const msgErr = error.response.data.errors
            for(const field in msgErr) {
                newErrMsg += `${field} :\n${msgErr[field].join('\n')}\n`
            }
            alert(newErrMsg)
        })
    }
    const handleDeleteQuestion = (id) => {
        axios.delete(`http://localhost:8000/api/v1/forms/${dataForm.slug}/questions/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((result) => {
            alert(result.data.message)
            location.reload(true)
        })
        .catch((error) => alert(error.response.data.message))
    }
    const handleClickQuestion = () => {
        setQuestionElement(true)
    }
    const handleClickForm = () => {
        setLayoutPage('form')
    }
    const handleClickResponses = () => {
        setLayoutPage('responses')
    }
    const handleClickSendForm = () => {
        setLayoutPage('send-form')
    }

    const handleCreateResponse = (e) => {
        e.preventDefault()
        const crtRpns = createResponse.map((item, index) => {
            return {
                question_id: item.question_id,
                value: item.value.toString(),
            }
        })
        axios.post(`http://localhost:8000/api/v1/forms/${dataForm.slug}/response`, {
            answer: crtRpns,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((result) => {
            alert(result.data.message)
            location.reload(true)
        })
        .catch((error) => {
            let newMsgError = ''
            const msgError = error.response.data.errors
            for(const field in msgError) {
                newMsgError += `${field} :\n${msgError[field].join('\n')}\n`
            }
            alert(`${error.response.data.message}\n${newMsgError}`)
            if(error.response.status) {
                location.href = '/dashboard'
            }
        })
    }
    const handleCreateAnswer = (answer) => {
        const i = createResponse.findIndex(result => result.question_id === answer.question_id)

        if(i >= 0) {
            if (answer.type === 'checkboxes') {
                const c = createResponse[i].value.findIndex(result => result === answer.value)
                
                if (c >= 0) {
                    if (!answer.checked) {
                        createResponse[i].value = createResponse[i].value.filter(result => result !== answer.value)
                    }
                } else {
                    createResponse[i].value.push(answer.value)
                }

                console.log(createResponse[i].value);
            } else {
                createResponse[i].value = answer.value
            }
        } else {
            if (answer.type === 'checkboxes') {
                answer.value = [answer.value]
            }
            createResponse.push(answer)
        }
        setCreateResponse(createResponse);
    }

    return (
        <>
            <Navbar />
            {layoutPage === 'form' ? (
                <>
                 {localStorage.getItem('id') == dataForm.creator_id  ? (
                     <ul className="flex justify-center items-center mt-16">
                         <li className={`px-5 font-bold text-xl hover:text-violet-700 cursor-pointer ${layoutPage === 'form' ? 'text-violet-700' : " "}`} onClick={handleClickForm}>Form</li>
                         <li className={`px-5 font-bold text-xl hover:text-violet-700 cursor-pointer ${layoutPage === 'responses' ? 'text-violet-700' : " "}`} onClick={handleClickResponses}>Responses</li>
                         <li className={`px-5 font-bold text-xl hover:text-violet-700 cursor-pointer ${layoutPage === 'send-form' ? 'text-violet-700' : " "}`} onClick={handleClickSendForm}>Send Form</li>
                     </ul>
                 ) : null}
                    <div className="bg-violet-700 mx-20 mt-10 px-5 py-10 rounded-xl text-white">
                        <h1 className="text-4xl font-semibold">{dataForm.name}</h1>
                        <p className="font-medium mt-3">{dataForm.description}</p>
                    </div>
                    {localStorage.getItem('id') == dataForm.creator_id ? (
                        <button className="mx-20 px-5 py-2 font-bold bg-pink-400 text-white rounded-lg mt-5" onClick={handleClickQuestion}>Create Question</button>
                    ) : null}
                    {questionElement ? (
                        <div className="bg-pink-400 mx-20 mt-5 p-5 rounded-xl">
                            <h1 className="text-center text-2xl font-bold text-white">Create Question Form</h1>
                            <form className="mt-10" onSubmit={handleCreateQuestion}>
                                <div className="flex justify-between">
                                    <div className="my-2 w-[40%]">
                                        <label htmlFor="name" className="block mb-2 text-xl font-medium text-white">Question Name</label>
                                        <input type="text" id="name" placeholder="Input question name" className="w-full py-2 px-5 box-border rounded-md ring-2" onChange={(e) => setCreateQuestion({ ...createQuestion, name: e.target.value })} />
                                    </div>
                                    <div className="my-2">
                                        <label htmlFor="slug" className="block mb-2 text-xl font-medium text-white">Choice Type</label>
                                        <select name="choice_type" className="w-full py-2 px-5 box-border rounded-md ring-2" id="choice_type" onChange={(e) => setCreateQuestion({ ...createQuestion, choice_type: e.target.value })}>
                                            <option>Choise type</option>
                                            <option value="short answer">Short Answer</option>
                                            <option value="paragraph">Paragraph</option>
                                            <option value="date">Date</option>
                                            <option value="multiple choice">Multiple Choice</option>
                                            <option value="dropdown">Dropdown</option>
                                            <option value="checkboxes">Checkboxes</option>
                                        </select>
                                    </div>
                                </div>
                                {createQuestion.choice_type == 'multiple choice' || createQuestion.choice_type == 'dropdown' || createQuestion.choice_type == 'checkboxes' ? (
                                    <div className="my-2 w-[40%]">
                                        <label htmlFor="choices" className="block mb-2 text-xl font-medium text-white">Choices</label>
                                        <input type="text" id="choices" placeholder="Input choices multiple input, separate with commas" className="w-full py-2 px-5 box-border rounded-md" onChange={(e) => setCreateQuestion({ ...createQuestion, choices: e.target.value })} />
                                    </div>
                                ) : (' ')}
                                <div className="my-2 w-[40%]">
                                    <label htmlFor="is_required" className="block mb-2 text-xl font-medium text-white">Is Required</label>
                                    <input type="checkbox" id="is_required" className="w-7 h-7" onChange={(e) => setCreateQuestion({ ...createQuestion, is_required: e.target.value })} />
                                </div>
                                <button className="w-full py-2 bg-violet-700 mt-10 rounded-md font-bold text-lg text-white">Submit</button>
                            </form>
                        </div>
                    ) : (" ")}
                    <form onSubmit={handleCreateResponse}>
                        {dataForm?.questions?.map((item, index) => {
                            return (
                                <div className="bg-pink-400 mx-20 mt-5 p-5 rounded-xl" key={index}>
                                    <div className="my-2">
                                        <label htmlFor={`question-${index}`} className="block mb-2 text-xl font-medium text-white">{item.name}</label>
                                        {item.choice_type === 'short answer' ? (
                                            <input type="text" placeholder="Input question name" className="w-full py-2 px-5 box-border rounded-md ring-2" onChange={(e) => handleCreateAnswer({
                                                question_id: item.id, 
                                                type: item.choice_type,
                                                value: e.target.value
                                            })} />
                                        ) : item.choice_type === 'paragraph' ? (
                                            <textarea placeholder="Input question name" className="w-full py-2 px-5 box-border rounded-md ring-2" onChange={(e) => handleCreateAnswer({question_id: item.id, value: e.target.value})}></textarea>
                                        ) : item.choice_type === 'date' ? (
                                            <input type="date" placeholder="Input question name" className="w-full py-2 px-5 box-border rounded-md ring-2" onChange={(e) => handleCreateAnswer({question_id: item.id, value: e.target.value})} />
                                        ) : item.choice_type === 'dropdown' ? (
                                            <select name={`question-${index}`} className="w-full py-2 px-5 box-border rounded-md ring-2" onChange={(e) => handleCreateAnswer({question_id: item.id, value: e.target.value})}>
                                                        <option>Choice</option>
                                                {item?.choices?.map((item, index) => {
                                                    return (
                                                        <option value={item} key={index}>{item}</option>
                                                    )
                                                })}
                                            </select>
                                        ) : item.choice_type === 'multiple choice' ? (
                                            item?.choices?.map((itemV, index) => {
                                                return (
                                                    <div className="flex items-center" key={index}>
                                                        <input type="radio" className="h-5 w-5  mb-1 mr-3" name={'radio'} id={item} onChange={() => handleCreateAnswer({question_id: item.id, value: itemV})} />
                                                        <label htmlFor={itemV} className="block mb-2 font-semibold" key={index}>{itemV}</label>
                                                    </div>
                                                )
                                            })
                                        ) : item.choice_type === 'checkboxes' ? (
                                            item?.choices?.map((itemV, index) => {
                                                return (
                                                    <div className="flex items-center" key={index}>
                                                        <input type="checkbox" className="h-5 w-5  mb-1 mr-3" name="radio" id={itemV} onChange={(e) => handleCreateAnswer({
                                                            question_id: item.id,
                                                            type: item.choice_type,
                                                            value: itemV,
                                                            checked: e.target.checked
                                                        })} />
                                                        <label htmlFor={itemV} className="block mb-2 font-semibold" key={index}>{itemV}
                                                        </label>
                                                    </div>
                                                )
                                            })
                                        ) : null}
                                    </div>
                                    {localStorage.getItem('id') == dataForm.creator_id ? (
                                        <p className="px-4 w-20 py-1 bg-red-600 rounded-lg text-white font-semibold" onClick={() => confirm('Are you sure you want to delete this question?') == true ? handleDeleteQuestion(item.id) : alert('Your question not deleted')}>Delete</p>
                                    ) : null}
                                </div>
                            );
                        })}
                        <div className="mx-20 flex justify-end">
                            <button className="py-2 px-10 bg-violet-700 mt-10 rounded-md font-bold text-lg text-white">Submit</button>
                        </div>
                    </form>
                </>
            ) : layoutPage === 'responses' ? (
                <>
                    <ul className="flex justify-center items-center mt-16">
                        <li className={`px-5 font-bold text-xl hover:text-violet-700 cursor-pointer ${layoutPage === 'form' ? 'text-violet-700' : " "}`} onClick={handleClickForm}>Form</li>
                        <li className={`px-5 font-bold text-xl hover:text-violet-700 cursor-pointer ${layoutPage === 'responses' ? 'text-violet-700' : " "}`} onClick={handleClickResponses}>Responses</li>
                        <li className={`px-5 font-bold text-xl hover:text-violet-700 cursor-pointer ${layoutPage === 'send-form' ? 'text-violet-700' : " "}`} onClick={handleClickSendForm}>Send Form</li>
                    </ul>
                    <div className="bg-violet-700 mx-20 mt-10 px-5 py-10 rounded-xl text-white">
                        <h1 className="text-4xl font-semibold">{dataForm.name}</h1>
                        <p className="font-medium mt-3">{dataForm.description}</p>
                        <p className="text-xl font-semibold mt-5">Total Response {dataResponse.length}</p>
                    </div>
                    <div className="">
                        {dataResponse.length > 0 ? (
                            <>
                                {dataResponse?.map((item, index) => {
                                    return (
                                        <div className="bg-pink-400 mx-20 mt-5 p-5 rounded-xl" key={index}>
                                            <div className="mb-4 text-xl font-semibold">
                                                <p>Username : {item.user.name}</p>
                                                <p>Date : {item.date}</p>
                                            </div>
                                            <h2 className="font-bold">Response :</h2>
                                            {Object.entries(item.answers).map(([key, value]) => {
                                                return (
                                                    <ul className="mt-3" key={key}>
                                                        <li>● {key} : {value}</li>
                                                    </ul>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </>) : (
                            <div className="bg-pink-400 mx-20 mt-5 p-5 rounded-xl">
                                <h1 className="text-center text-xl font-semibold text-white">No answer yet</h1>
                            </div>
                        )}
                    </div>
                </>
            ) : layoutPage === 'send-form' ? (
                <>
                    <ul className="flex justify-center items-center mt-16">
                        <li className={`px-5 font-bold text-xl hover:text-violet-700 cursor-pointer ${layoutPage === 'form' ? 'text-violet-700' : " "}`} onClick={handleClickForm}>Form</li>
                        <li className={`px-5 font-bold text-xl hover:text-violet-700 cursor-pointer ${layoutPage === 'responses' ? 'text-violet-700' : " "}`} onClick={handleClickResponses}>Responses</li>
                        <li className={`px-5 font-bold text-xl hover:text-violet-700 cursor-pointer ${layoutPage === 'send-form' ? 'text-violet-700' : " "}`} onClick={handleClickSendForm}>Send Form</li>
                    </ul>
                    <div className="bg-violet-700 mx-20 mt-10 px-5 py-10 rounded-xl text-white">
                        <h1 className="text-4xl font-semibold">{dataForm.name}</h1>
                        <p className="font-medium mt-3">{dataForm.description}</p>
                    </div>
                    <div className="bg-pink-400 mx-20 mt-5 p-5 rounded-xl">
                        <input type="text" className="px-3 py-2 box-border w-full rounded-md my-2" value={`http://localhost:3000${locationPath.pathname}`} readOnly />
                    </div>
                </>
            ) : null}
            <div className="mb-20"></div>
        </>
    )
}

export default CreateQuestionPage;


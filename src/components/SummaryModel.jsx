import React, { useState } from 'react'
import { api } from '../api/api';
import uuid from 'react-uuid'


const SummaryModel = ({visible , closesummarymodel}) => {

  
    const [summary, setSummary] = useState({
        "id": uuid(),
        "name": "",
        "create_on": "12/13/23",
        "create_by": "e1045750@u.nus.edu",
        "status": 1
    })

    const handleSubmit = async (e) => {
        const res = await api.post('summarylist', summary)
        closesummarymodel(false)

    }

    if(!visible) return null;


    return (
        <div className='bg-zinc-200 bg-opacity-80 fixed inset-0'>
            <div className='flex justify-center' style={{ paddingTop: "200px" }}>
                <div className='w-2/4 flex-col justify-center bg-white py-12 px-24 border-4 border-blue-200 rounded-xl'>
                    <form className='pt-5' onSubmit={handleSubmit}>
                        <div className='relative'>
                        <input type='text' onChange={(e) => setSummary({ ...summary, name: e.target.value })} id='summaryName' className='w-full border-b-2 border-blue-200 focus:border-b-3 focus:border-blue-300 px-5 py-1 transition-colors focus:outline-none peer' autoComplete="off" required/>
                        <label htmlFor='summaryName' className='absolute left-0 top-1 cursor-text peer-focus:text-xl peer-focus:-top-7 peer-focus:text-blue-500 transition-all duration-300'>Submission </label>
                        </div>
                      

                        <div className='flex justify-around pt-8'>
                            <button className='bg-blue-300 hover:bg-blue-500 px-10 py-3 text-center rounded-lg' type='submit'>Create</button>
                            <button className='bg-blue-300 hover:bg-blue-500 px-10 py-3 text-center rounded-lg' onClick={() => closesummarymodel(false)}>Cancel</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default SummaryModel
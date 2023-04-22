import React, { useEffect, useState } from 'react'
import { api } from '../api/api'
import SummaryModel from './SummaryModel'


const Summary = () => {

const statusList = ["Pending File Upload", "Pending Analysis", "During Analysis", "Complete"]

const [summaries , setSummary] = useState([])

const [showsummarymodel , setSummarymodel] = useState(false)

const [query , setQuery] = useState("")

const closesummarymodel = () => setSummarymodel(false)

const columns = ["name", "create_by"]


const fetchSummary = async() => {
  const res = await api.get('summarylist/')
 
  setSummary(res.data)
}

useEffect(()=>{
  fetchSummary()
},[])

const searchResult = summaries.filter((summary) => columns.some((column) => summary[column].toLowerCase().includes(query)));

console.log(searchResult.length)

  return (
    <div className='w-full h-screen flex felx-col justify-center'>

      <SummaryModel closesummarymodel={closesummarymodel} visible={showsummarymodel}/>
     
      <div className='w-3/4 borderpt-5'>


        <div className='flex justify-between items-center py-5 border-y-2 border-blue-200'>
          <div className='relative'>
            {/* <form>
              <input type='text' placeholder='Search' className='border border-blue-300 rounded-lg px-10 py-2' onChange={e => setQuery(e.target.value)}/>
            </form> */}
              <input type='text' onChange={(e) => setQuery(e.target.value)} id='search' className='w-full border-b-2 border-blue-200 focus:border-b-3 focus:border-blue-300 px-5 py-1 transition-colors focus:outline-none peer' autoComplete="off" required/>
              <label htmlFor='search' className='absolute left-0 top-1 cursor-text peer-focus:text-sm peer-focus:-top-4 peer-focus:text-blue-500 transition-all duration-300'>Search </label>

          </div>
          <div className='px-5'>
            <a href='' className='hover:text-blue-700 px-4'>feedback</a>
            <a href='' className='hover:text-blue-700 '>help</a>
          </div>
        </div>


        <div className='flex justify-between items-center py-5 border-y-2 border-blue-200'>
          <div className='px-5'>
            <p className='text-4xl'>Submission Summary</p>
          </div>
          <div className='px-5'>
            <button className='bg-blue-200 px-3 py-2 rounded-lg hover:bg-blue-300' onClick={() => setSummarymodel(true)}>Create New Submission + </button>
          </div>
        </div>


        <div className='flex justify-between items-center py-5 border-y-2 border-blue-200'>
          <table className='w-full h-full'>
            <thead className='bg-white-400 border-b-2'>
              <tr className='text-center'>
                <td> <input type="checkbox" /> </td>
                <td className='p-3 text-blue-500'>Create On</td>
                <td className='p-3 text-blue-500'>Name</td>
                <td className='p-3 text-blue-500'>Created By</td>
                <td className='p-3 text-blue-500'>Submission Status</td>

              </tr>
            </thead>
            <tbody className='bg-white-600'>

             {
               searchResult <= 0 ?

               summaries.map((summary, index) => (
                <tr key={index} className='border-b-2 text-center'>
                <td> <input type="checkbox" /> </td>
                  <td className='p-3'>{summary.create_on}</td>
                  <td className='p-3'> <a href="#" className='text-blue-500 hover:text-blue-700 underline'>{summary.name}</a> </td>
                  <td className='p-3'>{summary.create_by}</td>
                  <td className='p-3'>{statusList[summary.status]}</td>
                </tr>
               
               )) :
               searchResult.map((summary, index) => (
                <tr key={index} className='border-b-2 text-center'>
                <td> <input type="checkbox" /> </td>
                  <td className='p-3'>{summary.create_on}</td>
                  <td className='p-3'> <a href="#" className='text-blue-500 hover:text-blue-700 underline'>{summary.name}</a> </td>
                  <td className='p-3'>{summary.create_by}</td>
                  <td className='p-3'>{statusList[summary.status]}</td>
                </tr>
               ))
             }

          



            </tbody>
          </table>
        </div>


      </div>
    </div>
  )
}

export default Summary
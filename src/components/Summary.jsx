import React, { useEffect, useState } from 'react'
import { api } from '../api/api'
import SummaryModel from './SummaryModel'


const Summary = () => {

  const statusList = ["Pending File Upload", "Pending Analysis", "During Analysis", "Complete"]

  const [summaries, setSummary] = useState([])

  const [currentPage, setPage] = useState(1)

  const [summaryToDelete, setSummaryToDelete] = useState([])

  const summariesPerPage = 12

  const lastIndex = currentPage * summariesPerPage

  const firstIndex = lastIndex - summariesPerPage

  const [showsummarymodel, setSummarymodel] = useState(false)

  const [query, setQuery] = useState("")

  const closesummarymodel = () => setSummarymodel(false)

  const columns = ["name", "create_by"]


  const fetchSummary = async () => {
    const res = await api.get('summarylist/')

    setSummary(res.data)
  }

  useEffect(() => {
    fetchSummary()
  }, [])


  const summariesSlice = summaries.concat().reverse().slice(firstIndex, lastIndex)



  const noOfPage = Math.ceil(summaries.length / summariesPerPage)

  const numbers = [...Array(noOfPage + 1).keys()].slice(1);



  const changePage = (e, number) => {
    e.preventDefault();
    //setSummaryToDelete([])
    setPage(number)
  }

  const handleSelect = (summary) => {

    if (summaryToDelete.includes(summary)) {
      setSummaryToDelete(summaryToDelete.filter(item => item !== summary));
      return
    }

    setSummaryToDelete((previousSummary) => previousSummary.concat(summary))
  }

  const handleAllSelect = (e) => {
    if(e.target.checked){
      let summaryList = summaries.map((summary) => summary)

      console.log(summaryList.length)
      for(let j = 0 ; j < summaryList.length ; j ++ ){
  
        if (summaryToDelete.includes(summaryList[j])) {
          setSummaryToDelete(summaryToDelete.filter(item => item !== summaryList[j]));
          return
        }
    
        setSummaryToDelete((previousSummary) => previousSummary.concat(summaryList[j]))
  
      }
    }else{
      setSummaryToDelete([])
    }
   
  }



  const searchResult = summaries.filter((summary) => columns.some((column) => summary[column].toLowerCase().includes(query)));

  const previousPage = (e) => {
    e.preventDefault();
    //setSummaryToDelete([])
    if (currentPage !== firstIndex) {
      setPage(currentPage - 1)
    }
  }

  const nextPage = (e) => {
    e.preventDefault();
    //setSummaryToDelete([])
    if (currentPage !== firstIndex) {
      setPage(currentPage + 1)
    }
  }
  
  const handleDelete = () => {
    let deleteList = summaryToDelete.map((summary) => summary.id)
    for(var i = 0; i < deleteList.length ; i++){
      deleteSummary(deleteList[i])
    }

    setSummaryToDelete([])
    window.location.reload(true);
  }

  const deleteSummary = async (id) => {

      const res = await api.delete(`/summarylist/${id}`)

      if(res.statusText == "OK"){
           setSummary(summaries.filter(summary => summary.id !== id))
         }
    };



  return (
    <div className='w-full h-screen flex felx-col justify-center'>

      <SummaryModel closesummarymodel={closesummarymodel} visible={showsummarymodel} />

      <div className='w-3/4 h-screen pt-5'>


        <div className='flex justify-between items-center py-5 border-y-2 border-blue-200'>
          <div className=''>

            <input type='text' onChange={e => setQuery(e.target.value)} placeholder='Search' id='search' className='w-full border-b-2 border-blue-200 focus:border-b-3 focus:border-blue-300 px-5 py-1 transition-colors focus:outline-none peer' autoComplete="off" />


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
            <button className={summaryToDelete.length != 0 ? 'bg-red-700 px-3 py-2 rounded-lg hover:bg-red-500' : "invisible"}
              onClick={() => handleDelete()}>Delete ({summaryToDelete.length})</button>
              <span className='px-3'></span>
            <button className='bg-blue-200 px-3 py-2 rounded-lg hover:bg-blue-300' onClick={() => setSummarymodel(true)}>Create New Submission + </button>
          </div>
        </div>


        <div className='flex justify-between items-center py-5 border-y-2 border-blue-200'>
          <table className='w-full h-full'>
            <thead className='bg-white-400 border-b-2'>
              <tr className='text-center'>
                <td> <input type="checkbox" onChange={handleAllSelect}/> </td>
                <td className='p-3 text-blue-500'>Create On</td>
                <td className='p-3 text-blue-500'>Name</td>
                <td className='p-3 text-blue-500'>Created By</td>
                <td className='p-3 text-blue-500'>Submission Status</td>

              </tr>
            </thead>
            <tbody className='bg-white-600'>

              {
                searchResult.length == summaries.length ?

                  summariesSlice.map((summary, index) => (
                    <tr key={index} className='border-b-2 text-center'>


                      <td>
                        {summaryToDelete.includes(summary) ? <input type="checkbox" onChange={() => handleSelect(summary)} checked /> :
                          <input type="checkbox" onChange={() => handleSelect(summary)} />}  </td>



                      <td className='p-3'>{summary.create_on}</td>
                      <td className='p-3'> <a href="#" className='text-blue-500 hover:text-blue-700 underline'>{summary.name}</a> </td>
                      <td className='p-3'>{summary.create_by}</td>
                      <td className='p-3'>{statusList[summary.status]}</td>
                    </tr>

                  )) :
                  searchResult.map((summary, index) => (
                    <tr key={index} className='border-b-2 text-center'>
                      <td>
                        {summaryToDelete.includes(summary) ? <input type="checkbox" onChange={() => handleSelect(summary)} checked /> :
                          <input type="checkbox" onChange={() => handleSelect(summary)} />}  </td>

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


        {
          searchResult.length == summaries.length ?
            <div className='flex justify-center items-center py-5 '>

              <ul className="inline-flex -space-x-px">
                <li>
                  <a href="" onClick={(e) => previousPage(e)} className={currentPage == Math.min(...numbers) || summaries.length == 0 ? "invisible" : "px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"}>Previous</a>
                </li>
                {
                  numbers.map((number, index) => (
                    <li key={index}>
                      <a href="" onClick={(e) => changePage(e, number)} className={currentPage == number ? "px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white" : "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"} >
                        {number}
                      </a>
                    </li>
                  ))
                }
                <li>
                  <a href="" onClick={(e) => nextPage(e)} className={currentPage == Math.max(...numbers) || summaries.length == 0 ? "invisible" : "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"}>Next</a>
                </li>
              </ul>

            </div>
            :
            <div></div>
        }



      </div>


    </div>
  )
}

export default Summary
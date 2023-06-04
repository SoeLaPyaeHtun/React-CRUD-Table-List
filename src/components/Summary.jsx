import React, { useEffect, useState } from 'react'
import { api } from '../api/api'
import SummaryModel from './SummaryModel'
import { Dropdown } from 'flowbite-react';



const Summary = () => {

  const statusList = ["Inactive", "Active"]

  const [summaries, setSummary] = useState([])

  const [currentPage, setPage] = useState(1)

  const [summaryToDelete, setSummaryToDelete] = useState([])
  const [summaryToUpdate, setSummaryToUpdate] = useState([])

  const [updateBtn, setUpdateBtn] = useState(false)

  const summariesPerPage = 12

  const lastIndex = currentPage * summariesPerPage

  const firstIndex = lastIndex - summariesPerPage

  const [showsummarymodel, setSummarymodel] = useState(false)

  const [query, setQuery] = useState("")

  const closesummarymodel = () => setSummarymodel(false)

  const columns = ["name", "create_by"]

  const [filter_status, setFilter_status] = useState(-1)

  const [date_sort , setDate_sort] = useState(0)

  const fetchSummary = async () => {
    const res = await api.get('summarylist/')

    setSummary(res.data)
  }

  useEffect(() => {
    fetchSummary()
  }, [])


  const summariesSlice = (date_sort == 0)? summaries.sort(function(a,b){return new Date(b.create_on) - new Date(a.create_on)}).concat().reverse().slice(firstIndex, lastIndex) : 
                         summaries.sort(function(a,b){return new Date(a.create_on) - new Date(b.create_on)}).concat().reverse().slice(firstIndex, lastIndex);
                          


  const noOfPage = Math.ceil(summaries.length / summariesPerPage)

  const numbers = [...Array(noOfPage + 1).keys()].slice(1);



  const changePage = (e, number) => {
    e.preventDefault();
    //setSummaryToDelete([])
    setPage(number)
  }

  const handleSelectToDelete = (summary) => {

    if (summaryToDelete.includes(summary)) {
      setSummaryToDelete(summaryToDelete.filter(item => item !== summary));
      return
    }

    setSummaryToDelete((previousSummary) => previousSummary.concat(summary))
  }



  const handleSelectToUpdate = (summary, e) => {

    summary['status'] = e.target.value;
    if (summaryToUpdate.map(summary => summary.id).includes(summary.id)) {
      setSummaryToUpdate(summaryToUpdate.filter(item => item !== summary));
      setSummaryToUpdate((previousSummary) => previousSummary.concat(summary));
      return
    }

    setSummaryToUpdate((previousSummary) => previousSummary.concat(summary))

  }

  console.log(summaryToUpdate)


  const handleAllSelect = (e) => {
    if (e.target.checked) {
      let summaryList = summaries.map((summary) => summary)

      console.log(summaryList.length)
      for (let j = 0; j < summaryList.length; j++) {

        if (summaryToDelete.includes(summaryList[j])) {
          setSummaryToDelete(summaryToDelete.filter(item => item !== summaryList[j]));
          return
        }

        setSummaryToDelete((previousSummary) => previousSummary.concat(summaryList[j]))

      }
    } else {
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
    for (var i = 0; i < deleteList.length; i++) {
      deleteSummary(deleteList[i])
    }

    setSummaryToDelete([])
    window.location.reload(true);
  }

  const handleUpdate = () => {
    let updateList_id = summaryToUpdate.map((summary) => summary.id)
    let updateList = summaryToUpdate.map((summary) => summary)
    for (var i = 0; i < updateList_id.length; i++) {
      updateSummary(updateList_id[i], updateList[i])
    }

    setSummaryToUpdate([])
    console.log(updateList_id)
    console.log(updateList)
    setUpdateBtn(false)

  }

  const deleteSummary = async (id) => {

    const res = await api.delete(`/summarylist/${id}`)

    if (res.statusText == "OK") {
      setSummary(summaries.filter(summary => summary.id !== id))
    }
  };

  const updateSummary = async (id, summary) => {
    const res = await api.put(`/summarylist/${id}`, summary)
  }

  const filterByStatus = (e) => {
    setFilter_status(e.target.value);
  }

  console.log(filter_status)

  const filter_result = summaries.filter(summary => filter_status == summary.status);

  console.log("hehe")
  console.log(filter_result);




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
            <span className='px-3'></span>
            {
              updateBtn ?
                <button className='bg-green-200 px-3 py-2 rounded-lg hover:bg-green-300' onClick={handleUpdate}> Save Status </button>
                :
                <button className='bg-green-200 px-3 py-2 rounded-lg hover:bg-green-300' onClick={() => setUpdateBtn(true)}> Update Status </button>

            }
            {/* <button className='bg-green-200 px-3 py-2 rounded-lg hover:bg-green-300' onClick={() => updateBtn ? setUpdateBtn(false) : setUpdateBtn(true)}> 
            {
              updateBtn ? "Save Status" : "Update Status"
            }
            </button> */}
          </div>
        </div>


        <div className='flex justify-between items-center py-5 border-y-2 border-blue-200'>
          <table className='w-full h-full'>
            <thead className='bg-white-400 border-b-2'>
              <tr className='text-center'>
                <td> <input type="checkbox" onChange={handleAllSelect} /> </td>
                <td className='p-3 text-blue-500'>Create On
                
                <span className='px-2'></span>
                  <select onChange={(e) => setDate_sort(e.target.value)} >
                 
                  
                        <option key="0" value="0">ASC</option>
                        <option key="1" value="1">DES</option>
                    


                  </select>

                </td>
                <td className='p-3 text-blue-500'>Name</td>
                <td className='p-3 text-blue-500'>Created By</td>
                <td className='p-3 text-blue-500'>Submission Status



                  <span className='px-2'></span>
                  <select onChange={(e) => filterByStatus(e)} >
                    <option key="-1" value="-1">all</option>
                    {
                      statusList.map((status, index) => (
                        <option key={index} value={index}>{status}</option>
                      ))
                    }


                  </select>





                </td>

              </tr>
            </thead>
            <tbody className='bg-white-600'>

              {
                filter_result.length != 0 ?
                  filter_result.map((summary, index) => (
                    <tr key={index} className='border-b-2 text-center'>
                      <td>
                        {summaryToDelete.includes(summary) ? <input type="checkbox" onChange={() => handleSelectToDelete(summary)} checked /> :
                          <input type="checkbox" onChange={() => handleSelectToDelete(summary)} />}  </td>

                      <td className='p-3'>{summary.create_on}</td>
                      <td className='p-3'> <a href="#" className='text-blue-500 hover:text-blue-700 underline'>{summary.name}</a> </td>
                      <td className='p-3'>{summary.create_by}</td>
                      <td className='p-3'>{statusList[summary.status]}</td>
                    </tr>
                  )) :
                  searchResult.length == summaries.length ?

                    summariesSlice.map((summary, index) => (
                      <tr key={index} className='border-b-2 text-center'>


                        <td>
                          {summaryToDelete.includes(summary) ? <input type="checkbox" onChange={() => handleSelectToDelete(summary)} checked /> :
                            <input type="checkbox" onChange={() => handleSelectToDelete(summary)} />}  </td>



                        <td className='p-3'>{summary.create_on}</td>
                        <td className='p-3'> <a href="#" className='text-blue-500 hover:text-blue-700 underline'>{summary.name}</a> </td>
                        <td className='p-3'>{summary.create_by}</td>

                        {
                          updateBtn ?

                            <td className='p-3'>

                              {
                                summary.status == "1" ?

                                  <input id={index} name={summary.id} type='radio' value='1' onChange={(e) => handleSelectToUpdate(summary, e)} checked />


                                  :

                                  <input id={index} name={summary.id} type='radio' value='1' onChange={(e) => handleSelectToUpdate(summary, e)} />

                              }

                              <label htmlFor={index} >Active</label>


                              {
                                summary.status == "0" ?
                                  <input id={index + 99} name={summary.id} type='radio' value='0' onChange={(e) => handleSelectToUpdate(summary, e)} checked />
                                  :
                                  <input id={index + 99} name={summary.id} type='radio' value='0' onChange={(e) => handleSelectToUpdate(summary, e)} />
                              }
                              <label htmlFor={index + 99}>Inactive</label>

                            </td>

                            :
                            <td className='p-3'>{statusList[summary.status]}</td>



                        }


                      </tr>

                    )) :
                    searchResult.map((summary, index) => (
                      <tr key={index} className='border-b-2 text-center'>
                        <td>
                          {summaryToDelete.includes(summary) ? <input type="checkbox" onChange={() => handleSelectToDelete(summary)} checked /> :
                            <input type="checkbox" onChange={() => handleSelectToDelete(summary)} />}  </td>

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
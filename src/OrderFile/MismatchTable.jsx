import React,{useEffect, useRef} from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { getCustomervalueMismatchdata } from '../store/customerOrder/customerOrderSlice';
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
function MismatchTable() {
    const {data:MismatchData,loading,error}=useSelector((state)=>state.customerExcel.getCustomervalueMismatchdata)
    const dispatch=useDispatch();
    useEffect(()=>{
        dispatch(getCustomervalueMismatchdata())
    },[dispatch])
    const misMatchValueTable=useRef(null);
    useEffect(()=>{
        if(MismatchData &&misMatchValueTable.current){
            const headers=MismatchData.length>0?Object.keys(MismatchData[0]).filter(header=> header !=='_id'&& header !=='_v'):[];
            const columns=headers.map((header)=>({
                data:header,
                title:header,
                readOnly:true,
            }))
            misMatchValueTable.current.hotInstance.updateSettings({
                data:MismatchData.map(order=>{
                    const {_id,_v,...filtermismatchValue}=order;
                    return filtermismatchValue;
                }),
                colHeaders:headers,
                columns:columns,
                colWidths:100,
                rowHeights:30,
                dropdownMenu:true,
                contextMenu:true,
                filters:true,
                columnSorting:true,
            })
        }
    },[MismatchData])
    if (loading)
        return (
          <div className="w-full gap-x-2 flex justify-center items-center h-screen my-auto justify-center">
            <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
            <div className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
            <div className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"></div>
          </div>
        );
    
      if (error) return <p>Error: {error.message}</p>;
  return (
    <>
    <h1 className="text-indigo-500 font-extrabold text-3xl text-center">
   Mismatch value
  </h1>
  <HotTable
    className="custom-table"
    ref={misMatchValueTable}
    settings={{
      data: MismatchData.map(order => {
        const { _id, __v, ...filteredOrder } = order;
        return filteredOrder;
      }),
      colHeaders: true,
      rowHeaders: true,
      dropdownMenu: true,
      contextMenu: true,
      filters: true,
      columnSorting: true,
      stretchH: "all",
      width: "100%",
      height: "60vh",
      licenseKey: "non-commercial-and-evaluation",
    }}
    style={{ width: "100%" }}
  />
</>
  )
}

export default MismatchTable
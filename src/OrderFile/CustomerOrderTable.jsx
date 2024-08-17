import React, { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import CustomerArticleExcelUpload from "./CustomerOrderUpload";
import { useSelector, useDispatch } from "react-redux";
import { DeleteOrderFile, getCustomerExcelData } from "../store/customerOrder/customerOrderSlice";

const CustomerArticleTable = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const dispatch = useDispatch();
  const {
    data: customerArticle,
    loading,
    error,
  } = useSelector((state) => state.customerExcel.getCustomerExcelData);
  const [isEditable, setIsEditable] = useState(false);
  const CustomerArticleTable = useRef(null);
  const [customerData, setCustomerData] = useState([]);
  const [buttonLabel, setButtonLabel] = useState("Enable Edit");

  useEffect(() => {
    dispatch(getCustomerExcelData());
  }, [dispatch]);

  useEffect(() => {
    if (customerArticle) {
      const filteredData = customerArticle.map((row) => {
        const { _id, __v, ...rest } = row;
        return rest;
      });
      setCustomerData(filteredData);
    }
  }, [customerArticle]);

  useEffect(() => {
    if (customerData.length && CustomerArticleTable.current) {
      const headers = Object.keys(customerData[0]);
      const columns = headers.map((header) => ({
        data: header,
        title: header,
        readOnly: !isEditable,
      }));

      CustomerArticleTable.current.hotInstance.updateSettings({
        data: customerData,
        colHeaders: headers,
        columns: columns,
        colWidths: 100,
        rowHeights: 30,
        dropdownMenu: true,
        contextMenu: true,
        filters: true,
        columnSorting: true,
      });
    }
  }, [customerData, isEditable]);

  const enableEdit = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to enable editing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, enable it!",
      cancelButtonText: "No, keep it read-only",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditable(true);
        setButtonLabel("Save Edit");
        Swal.fire("Editing Enabled!", "You can now edit the table.", "success");
      }
    });
  };

  const saveEdits = async () => {
    // Implement save logic here
    Swal.fire("Saved!", "Changes have been saved.", "success");
    setIsEditable(false);
    setButtonLabel("Enable Edit");
  };

  const exportData = () => {
    const hotInstance = CustomerArticleTable.current.hotInstance;
    const data = hotInstance.getData();
    const headers = hotInstance.getColHeader();

    const filteredHeaders = headers.filter(
      (header) => header !== "_id" && header !== "__v"
    );
    const filteredData = data.map((row) =>
      row.filter(
        (_, index) => headers[index] !== "_id" && headers[index] !== "__v"
      )
    );

    const dataWithHeaders = [filteredHeaders, ...filteredData];
    const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "successorder.xlsx");
  };

  if (loading)
    return (
      <div className="w-full gap-x-2 flex justify-center items-center h-screen my-auto justify-center">
        <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
        <div className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
        <div className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"></div>
      </div>
    );
    const handleDelete = () => {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete the All order file?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await dispatch(DeleteOrderFile()).unwrap();
            dispatch(getCustomerExcelData());
            Swal.fire("Deleted!", "All order file has been deleted.", "success");
          } catch (error) {
            console.error("Error deleting order file", error);
            Swal.fire("Error!", "Failed to delete order file.", "error");
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your order file is safe :)", "error");
        }
      });
    };
  return (
    <div>
      <div className="flex justify-between py-6">
        <button
          type="button"
          onClick={openModal}
          className="px-4 mt-10 py-2 rounded-lg text-white text-sm border-none outline-none tracking-wide bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
        >
          Upload Article
        </button>
        <CustomerArticleExcelUpload isOpen={isOpen} closeModal={closeModal} />
        <div className="flex gap-4 py-7">
          <button
            onClick={enableEdit}
            className="focus:outline-none text-white bg-lime-400 hover:bg-lime-500 focus:ring-4 focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
          >
            UPDATE
          </button>
          <button
            onClick={enableEdit}
            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
          >
            Enable Edit
          </button>
          <button
            onClick={exportData}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Export
          </button>
          <button 
          onClick={handleDelete}
           className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
            Delete
          </button>
        </div>
      </div>
      <h1 className="text-indigo-500 font-extrabold text-3xl text-center pb-2">
        Success Order
      </h1>
      <HotTable
        className="custom-table"
        ref={CustomerArticleTable}
        settings={{
          data: customerData,
          colHeaders: true,
          rowHeaders: true,
          dropdownMenu: true,
          stretchH: "all",
          contextMenu: true,
          filters: true,
          columnSorting: true,
          width: "100%",
          // height: "80vh",
          licenseKey: "non-commercial-and-evaluation",
        }}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default CustomerArticleTable;

import React, { useState, useRef, useEffect } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import CustomerArticleExcelUpload from "./CustomerOrderUpload";
import { useSelector, useDispatch } from "react-redux";
import {
  DeleteOrderFile,
  getCustomerExcelData,
} from "../store/customerOrder/customerOrderSlice";
import ExportModal from "./ExportModel"; // Import the modal component
import OrderPendingTable from "./pendingTable";

const CustomerArticleTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false); // State for export modal

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const closeExportModal = () => setIsExportModalOpen(false); // Close export modal
  const openExportModal = () => setIsExportModalOpen(true); // Open export modal

  const dispatch = useDispatch();
  const { data: customerArticle, loading } = useSelector(
    (state) => state.customerExcel.getCustomerExcelData
  );
  const { data: pendingorder } = useSelector(
    (state) => state.customerExcel.getCustomerPendingData
  ); // Select pending order data

  const {data:outOfStockData} = useSelector(
    (state) => state.customerExcel.getCustomerOutOfstocksOrder 
  )
  const {data:mismatchValueData} = useSelector(
    (state) => state.customerExcel.getCustomervalueMismatchdata 
  )
  
  const [isEditable, setIsEditable] = useState(false);
  const CustomerArticleTable = useRef(null);
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    dispatch(getCustomerExcelData());
  }, [dispatch]);

  useEffect(() => {
    if (customerArticle) {
      const filteredData = customerArticle.map(({ _id, __v, ...rest }) => rest);
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
        Swal.fire("Editing Enabled!", "You can now edit the table.", "success");
      }
    });
  };

  const saveEdits = () => {
    // Implement save logic here
    Swal.fire("Saved!", "Changes have been saved.", "success");
    setIsEditable(false);
  };

  const exportData = async (fileName, selectedType, poNumber, poDate) => {
    // Function to filter out _id and __v from an array of objects
    const filterData = (data) => {
      return data.map(({ _id, __v, ...filteredRow }) => filteredRow);
    };
  
    // Filter customerData
    const filteredCustomerData = filterData(customerData);
    const headersCustomer = Object.keys(filteredCustomerData[0]);
  
    // Create a new workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet([]);
  
    // Add the Purchase Order details at the top of the worksheet
    XLSX.utils.sheet_add_aoa(ws, [
      ["Customer Order Data"], // Title for Customer Order
      [`PO Number: ${poNumber}`], // PO Number
      [`PO Date: ${poDate}`], // PO Date
      [], // Empty row to add some spacing
      headersCustomer, // Add headers for customer order
    ], { origin: 0 });
  
    // Add customer data rows to the worksheet
    XLSX.utils.sheet_add_aoa(ws, filteredCustomerData.map(Object.values), { origin: -1 });
  
    // Add a section for Pending Orders
    XLSX.utils.sheet_add_aoa(ws, [
      [], // Empty row
      ["Pending Order Data"], // Title for Pending Orders
      [], // Empty row to add some spacing
    ], { origin: -1 });
  
    // Filter pending order data
    const filteredPendingOrder = filterData(pendingorder);
    if (filteredPendingOrder.length > 0) {
      const headersPending = Object.keys(filteredPendingOrder[0]);
      XLSX.utils.sheet_add_aoa(ws, [headersPending], { origin: -1 });
      XLSX.utils.sheet_add_aoa(ws, filteredPendingOrder.map(Object.values), { origin: -1 }); // Add pending order data
    }
  
    // Add Out of Stock Data
    XLSX.utils.sheet_add_aoa(ws, [
      [],
      ["Out of Stock Data"],
      [],
    ], { origin: -1 });
  
    // Filter out of stock data
    const filteredOutOfStockData = filterData(outOfStockData);
    if (filteredOutOfStockData.length > 0) {
      const headersOutOfStock = Object.keys(filteredOutOfStockData[0]);
      XLSX.utils.sheet_add_aoa(ws, [headersOutOfStock], { origin: -1 });
      XLSX.utils.sheet_add_aoa(ws, filteredOutOfStockData.map(Object.values), { origin: -1 });
    }
  
    // Add a section for Mismatch Value Data
    XLSX.utils.sheet_add_aoa(ws, [
      [],
      ["Mismatch Value Data"],
      [],
    ], { origin: -1 });
  
    // Filter mismatch value data
    const filteredMismatchValueData = filterData(mismatchValueData);
    if (filteredMismatchValueData.length > 0) {
      const headersMismatch = Object.keys(filteredMismatchValueData[0]);
      XLSX.utils.sheet_add_aoa(ws, [headersMismatch], { origin: -1 });
      XLSX.utils.sheet_add_aoa(ws, filteredMismatchValueData.map(Object.values), { origin: -1 });
    }
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  
    const time = new Date();
    const day = time.getDate();
    const month = time.getMonth() + 1;
    const year = time.getFullYear();
  
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
  
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12';
  
    const formattedTime = `${hours}:${minutes} ${amPm}`;
    const formattedDate = `${day}-${month}-${year} ${formattedTime}`;
  
    XLSX.writeFile(wb, `${fileName}_${selectedType}__${formattedDate}.xlsx`);
  };
  
  
  

  if (loading)
    return (
      <div className="w-full gap-x-2 flex justify-center items-center h-screen my-auto justify-center">
        <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
        <div className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
        <div className="w-5 h-5 animate-pulse bg-[#58c5c4] rounded-full animate-bounce"></div>
      </div>
    );

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete all orders?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DeleteOrderFile());
        Swal.fire("Deleted!", "All order files have been deleted.", "success");
      }
    });
  };

  return (
    <div className="-mt-12 sticky top-5">
      <h1 className="text-indigo-600 font-extrabold text-3xl text-center pb-4">
        Success Order
      </h1>
      <div className="flex justify-between items-center py-4 -mt-16">
        <button
          type="button"
          onClick={openModal}
          className="px-5 py-2.5 mt-2 rounded-full bg-blue-600 text-white text-sm font-semibold tracking-wide hover:bg-blue-700"
        >
          Upload Article
        </button>
        <CustomerArticleExcelUpload isOpen={isOpen} closeModal={closeModal} />
        <div className="flex gap-4 items-center">
          <button
            onClick={enableEdit}
            className="px-5 py-2.5 bg-lime-500 text-white rounded-full text-sm font-medium hover:bg-lime-600"
          >
            Update
          </button>
          <button
            onClick={openExportModal} // Open the export modal
            className="px-5 py-2.5 bg-yellow-500 text-white rounded-full text-sm font-medium hover:bg-yellow-600"
          >
            Export
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
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
          height: "60vh",
          licenseKey: "non-commercial-and-evaluation",
        }}
        style={{ width: "100%" }}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
        onExport={exportData} // Pass the export function
      />
    </div>
  );
};

export default CustomerArticleTable;

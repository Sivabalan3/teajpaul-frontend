import React, { useState, useRef } from "react";
import QutationUploadfile from '../Quotation/QuotationUploadfile';
import QutationTable from './QuotationTable';
import { useDispatch } from "react-redux";
import { fetchQutationsByType } from "../store/Qutationfile/QutationSlice";

function QuotationIndex() {
  const [isOpen, setIsOpen] = useState(false);
  const [QutationType, setQutationType] = useState("D-martqutation"); // Default value should match backend
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const articleChange = (e) => {
   
    setQutationType(e.target.value);
    dispatch(fetchQutationsByType({QutationType:e.target.value}));
  };
   

  const handleEnableEdit = () => {
    if (tableRef.current) {
      tableRef.current.handleEnableEdit();
    }
  };

  const handleExportData = () => {
    if (tableRef.current) {
      tableRef.current.handleExportData();
    }
  };

  const handleExportDelete = () => {
    if (tableRef.current) {
      tableRef.current.handleDeleteAllData();
    }
  };
  return (
    <>
      <div className="flex justify-around">
        <button
          type="button"
          onClick={openModal}
          className="px-4 mt-10 py-2 rounded-lg text-white text-sm border-none outline-none tracking-wide bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
        >
          Upload Article
        </button>
        <div className="flex py-2">
          <button
            onClick={handleEnableEdit}
            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
          >
            Enable Edit
          </button>
          <button
            onClick={handleExportData}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Export
            <svg xmlns="http://www.w3.org/2000/svg" width="16px" fill="currentColor" class="ml-2 inline" viewBox="0 0 24 24">
          <path
            d="M12 16a.749.749 0 0 1-.542-.232l-5.25-5.5A.75.75 0 0 1 6.75 9H9.5V3.25c0-.689.561-1.25 1.25-1.25h2.5c.689 0 1.25.561 1.25 1.25V9h2.75a.75.75 0 0 1 .542 1.268l-5.25 5.5A.749.749 0 0 1 12 16zm10.25 6H1.75C.785 22 0 21.215 0 20.25v-.5C0 18.785.785 18 1.75 18h20.5c.965 0 1.75.785 1.75 1.75v.5c0 .965-.785 1.75-1.75 1.75z"
            data-original="#000000" />
        </svg>
          </button>
          <button type="button"
          onClick={handleExportDelete}
        className="px-5 flex items-center justify-center rounded text-white text-sm tracking-wider font-medium border-none outline-none bg-red-600 hover:bg-red-700 active:bg-red-600">
        <span className="border-r border-white pr-3">Delete</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="11px" fill="currentColor" class="ml-3 inline" viewBox="0 0 320.591 320.591">
          <path
            d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
            data-original="#000000" />
          <path
            d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
            data-original="#000000" />
        </svg>
      </button>
        </div>
        <select
          id="QutationType"
          value={QutationType}
          defaultValue={QutationType}
          onChange={articleChange}
          className="bg-gray-50 mt-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="D-martqutation">D-mart</option>
          <option value="SPAR-qutation">Spaar</option>
          <option value="OptionC">Option C</option>
          <option value="OptionD">Option D</option>
        </select>
      </div>

      <QutationUploadfile isOpen={isOpen} closeModal={closeModal} />
      <QutationTable ref={tableRef} QutationType={QutationType} />
    </>
  );
}

export default QuotationIndex;

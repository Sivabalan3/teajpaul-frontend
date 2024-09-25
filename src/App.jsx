import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./MasterExcel/ItemMasterHome";
import BatchExcelTable from "./BatchExcel/BatchExcelTable";
import CustomerArticleTable from "./OrderFile/CustomerOrderTable";
import Navabr from "./header/Navabr";
import OutOfStocksCustomerorder from "./OrderFile/OutOfStocksCustomerorder";
import OrderPendingTable from "./OrderFile/pendingTable";
import Layout from "./Layout";
import ArticleMasterIndex from "./Articlemastercomponent/ArticleMasterIndex";
import MismatchTable from "./OrderFile/MismatchTable";
import QuotationIndex from "./Quotation/QuotationIndex";
import { Login } from "./Auth/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> 
        
        <Route path="/" element={<><Navabr /><ArticleMasterIndex /></>} />
        <Route path="/item-master" element={<><Navabr /><Home /></>} />
        <Route path="/batch" element={<><Navabr /><BatchExcelTable /></>} />
        <Route path="/qutation" element={<><Navabr /><QuotationIndex /></>} />
        <Route path="/customer-order" element={<><Navabr /><Layout /></>}>
          <Route path="" index="1" element={<CustomerArticleTable />} />
          <Route path="out-of-stocks" element={<OutOfStocksCustomerorder />} />
          <Route path="pending-order" element={<OrderPendingTable />} />
          <Route path="mis-match" element={<MismatchTable />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

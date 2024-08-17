import { configureStore} from "@reduxjs/toolkit";
import {masterExcelReducer} from './masterexcelfile/masterExcelFileSlice'
import { batchExcelReducer } from "./batchexcelfile/batchExcelFileSlice";
import { CustomerOrderReducer } from "./customerOrder/customerOrderSlice";
import {articleMasterReducer} from './Articlemaster/ArticlemasterSlice'

export const store=configureStore({
    reducer:{
        masterExcel:masterExcelReducer,
        batchExcel:batchExcelReducer,
        customerExcel:CustomerOrderReducer,
        articlemaster:articleMasterReducer
    }
})
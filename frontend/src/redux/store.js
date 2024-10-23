import { configureStore, combineReducers } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { thunk } from "redux-thunk";
import invoiceReducer from "./invoices/Reducer";
import addInvoiceReducer from "./addInvoices/Reducer";

const rootreducer = combineReducers({
  invoice: invoiceReducer,
  addInvoice: addInvoiceReducer,
});
const Store = configureStore({
  reducer: rootreducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
export default Store;

import axios from "axios";
import {
  ADD_INVOICE_REQUEST,
  ADD_INVOICE_SUCCESS,
  ADD_INVOICE_FAILURE,
} from "./ActionTypes";

export const addInvoice = (invoiceData) => {
  return async (dispatch) => {
    dispatch({type: ADD_INVOICE_REQUEST})
    try {
        const response = await axios.post('http://localhost:8800/api/invoice', invoiceData);
        dispatch({
            type: ADD_INVOICE_SUCCESS,
            payload: response.data
        });
        return { success: true };
    } catch (error) {
        dispatch({
            type: ADD_INVOICE_FAILURE,
            payload: error.response?.data?.error || 'Failed to add invoice'
        });
        return { success: false, error: error.response?.data?.error || 'Failed to add invoice' };
    }
  };
};

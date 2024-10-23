import {
  GET_INVOICES
} from "./ActionTypes";
import axios from "axios";

export const getInvoices = (page=1, limit=3) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_INVOICES_REQUEST' });
    try {
        const response = await axios.get(`http://localhost:8800/api/invoice?page=${page}&limit=${limit}`)
        dispatch({
            type: GET_INVOICES,
            payload: {
              invoices: response.data.data,
              totalPages: response.data.pagination.total_pages,
              page: page,
              limit: limit
            }
        })
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };
};

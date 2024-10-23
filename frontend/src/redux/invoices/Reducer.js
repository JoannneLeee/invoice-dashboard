import {
  GET_INVOICES,
  INVOICE_REQUEST,
} from "./ActionTypes";

const initialState = {
  invoices: [],
  invoiceDetail: null,
  page: 1,
  limit: 3,
  totalPages: 0,
  isLoading: false,
};

const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {

    case INVOICE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case GET_INVOICES:
      return {
        ...state,
        invoices: action.payload.invoices,
        page: action.payload.page,
        limit: action.payload.limit,
        totalPages: action.payload.totalPages,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default invoiceReducer;
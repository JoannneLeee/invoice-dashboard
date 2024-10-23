import {
  ADD_INVOICE_REQUEST,
  ADD_INVOICE_SUCCESS,
  ADD_INVOICE_FAILURE,
} from "./ActionTypes";

const initialState = {
  isLoading: false,
  error: null,
  successMessage: null,
  invoice: null,
  products: [],
};

const addInvoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_INVOICE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        successMessage: null,
        invoice: null,
        products: [],
      };

    case ADD_INVOICE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        successMessage: "Invoice added successfully!",
        invoice: action.payload.invoice,
        products: action.payload.products,
      };

    case ADD_INVOICE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        successMessage: null,
        addedInvoice: null,
        addedProducts: [],
      };

    default:
      return state;
  }
};

export default addInvoiceReducer;

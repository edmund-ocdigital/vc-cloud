import { NotificationManager } from "react-notifications";
import * as types from "./CarTypes";

const INIT_STATE = {
  loading: false,
  category: [],
  products: [],
  carList: {
    nowShowing: "All Cars",
    options: ["All Cars", "Open Car", "Closed Car", "Won Car"],
    action: false,
    loading: false,
    tableData: [
      {
        id: "abcdefghijklm",
        name: "name",
        category: "category",
        coverPhoto: "coverPhoto",
        gradeInfo: "grade info",
        description: "description",
        360: "Yes"
      }
    ]
  },
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    /**
     * CRM Summary
     */
    case types.GET_ALL_CAR:
      return { ...state, carList: { ...state.carList, loading: true } };
    case types.GET_ALL_CAR_SUCCESS:
      return {
        ...state,
        carList: {
          ...state.carList,
          loading: false,
          tableData: action.payload
        }
      };
    case types.GET_ALL_CAR_FAILURE:
      return { ...state, carList: { ...state.carList, loading: false } };

    case types.GET_CATEGORY:
      return { ...state, loading: true };
    case types.GET_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        category: action.payload
      };
    case types.GET_CATEGORY_FAILURE:
      NotificationManager.warning("failed to get category");
      return { ...state, loading: false };

    case types.GET_PRODUCTS:
      return { ...state, loading: true };
    case types.GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload
      };
    case types.GET_PRODUCTS_FAILURE:
      NotificationManager.warning("failed to get products");
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};

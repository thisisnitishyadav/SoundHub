import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import {
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector
  } from 'react-redux';

export const store = configureStore({
    reducer:rootReducer
});
export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();
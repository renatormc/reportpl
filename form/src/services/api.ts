import { AxiosError } from 'axios';
import { WidgetMatrixType, ErrorsType } from './../types/custom_types';
import axios from './axios'
import { getCookie } from './cookies';


export const getFormLayout = async (model_name: string): Promise<WidgetMatrixType> => {
    const resp = await axios.get<WidgetMatrixType>("/api/form-layout/" + model_name);
    return resp.data;
}


export const getFormDefaultData = async (model_name: string): Promise<{ [key: string]: any }> => {
    const resp = await axios.get<WidgetMatrixType>("/api/form-default-data/" + model_name);
    return resp.data;
}

export const renderDoc = async (model_name: string, data: any): Promise<ErrorsType> => {
    try {
        const csrftoken = getCookie('csrftoken') || "";
        const resp = await axios.post<ErrorsType>("/api/render-doc/" + model_name,
            data,
            {
                headers: {
                    'X-CSRFToken': csrftoken
                }
            });
        return resp.data;
    } catch (error) {
        const err = error as AxiosError
        if (err.response && err.response.status === 422) {
            return err.response.data as ErrorsType;
        }
        throw error;
    }
}


export const getListItemsAjax = async (model_name: string, list_name: string, query: string) => {
    
}
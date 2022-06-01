import { AxiosError } from 'axios';
import { WidgetMatrixType, ErrorsType, TypeAheadItem, ModelInstructionsResponse } from './../types/custom_types';
import axios from './axios'
import { getCookie } from './cookies';

const rootEl = document.getElementById('root') as HTMLElement;
const urlPrefix = rootEl.getAttribute("url_prefix") || "";

export const getFormLayout = async (model_name: string): Promise<WidgetMatrixType> => {
    const resp = await axios.get<WidgetMatrixType>("/form-layout/" + model_name);
    return resp.data;
}


export const getFormDefaultData = async (random_id: string, model_name: string): Promise<{ [key: string]: any }> => {
    const resp = await axios.get<WidgetMatrixType>(`/form-default-data/${random_id}/${model_name}`);
    return resp.data;
}

export const renderDoc = async (model_name: string, data: any, randomID: string): Promise<ErrorsType> => {
    try {
        const csrftoken = getCookie('csrftoken') || "";
        const resp = await axios.post<ErrorsType>(`/render-doc/${model_name}/${randomID}`,
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


export const getListItemsAjax = async (model_name: string, list_name: string, query: string): Promise<Array<TypeAheadItem>> => {
    const resp = await axios.get<Array<TypeAheadItem>>(`/list-items/${model_name}/${list_name}?query=${query}`);
    return resp.data;
}

export const getModelInstructions = async (model_name: string): Promise<ModelInstructionsResponse> => {
    const resp = await axios.get<ModelInstructionsResponse>("/model-instructions/" + model_name);
    return resp.data;
}

export const uploadWidgetAsset = async (
    random_id: string,
    widget_type: string,
    field_name: string,
    formData: FormData): Promise<any> => {
    const resp = await axios.post<any>(`/upload-widget-assets/${random_id}/${widget_type}/${field_name}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    return resp.data;
}

export const urlFor = (path: string): string => {
    return urlPrefix + "/" + path;
}

export const urlForWidgetAsset = (randomID:string, fieldName: string, path: string): string => {
    return `${urlPrefix}/widget-asset/${randomID}/${fieldName}/${path}`
}
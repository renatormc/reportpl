import { AxiosError } from 'axios';
import { WidgetMatrixType, TypeAheadItem, ModelInstructionsResponse, DataType, RenderResponse } from './../types/custom_types';
import axios from './axios'
import { getCookie } from './cookies';


const rootEl = document.getElementById('root') as HTMLElement;
const urlPrefix = rootEl.getAttribute("url_prefix") || "";

export const getFormLayout = async (model_name: string): Promise<WidgetMatrixType> => {
    const resp = await axios.get<WidgetMatrixType>("/form-layout/" + model_name);
    return resp.data;
}


export const getFormDefaultData = async (random_id: string, model_name: string): Promise<DataType> => {
    const resp = await axios.get<DataType>(`/form-default-data/${random_id}/${model_name}`);
    return resp.data;
}

export const getUpdateData = async (random_id: string, model_name: string, field_name: string, payload: object): Promise<DataType> => {
    const resp = await axios.post<DataType>(`/update-data/${model_name}/${random_id}/${field_name}`, payload);
    return resp.data;
}

export const renderDoc = async (model_name: string, data: any, randomID: string): Promise<RenderResponse> => {
    try {
        const csrftoken = getCookie('csrftoken') || "";
        const resp = await axios.post<any>(`/render-doc/${model_name}/${randomID}#${Math.random}`,
            data,
            {
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                responseType: 'arraybuffer'
            });
        try {
            const enc = new TextDecoder("utf-8");
            const message = JSON.parse(enc.decode(resp.data)).message
            
            return {
                type: "message",
                data: message,
                errors: null
            }
        } catch (err) {
            return {
                type: "file",
                data: resp.data,
                errors: null
            }
        }


    } catch (error) {
        const err = error as AxiosError
        if (err.response && err.response.status === 422) {
            const aux = err.response.data as ArrayBuffer
            console.log(aux)
            const enc = new TextDecoder("utf-8")
            return {
                type: "errors",
                errors: JSON.parse(enc.decode(aux)),
                data: null
            }
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

export const deleteAsset = async (randomID: string, fieldName: string, relPath: string): Promise<any> => {
    const resp = await axios.delete<any>(`/widget-asset/${randomID}/${fieldName}/${relPath}`);
    return resp.data;
}

export const urlFor = (path: string): string => {
    return urlPrefix + "/" + path;
}

export const urlForWidgetAsset = (randomID: string, fieldName: string, path: string): string => {
    return `${urlPrefix}/widget-asset/${randomID}/${fieldName}/${path}`
}

export const readWorkdir = async (modelName: string): Promise<any> => {
    const resp = await axios.get<any>(`/read-workdir/${modelName}`);
    return resp.data;
}
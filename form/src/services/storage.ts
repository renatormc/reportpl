import { WidgetsMapType } from "../types/custom_types";

export const saveFormData = (modelName: string, data: any, widgetsMap: WidgetsMapType) => {
    const key = `saved_data_${modelName}`;
    const saveData:{[key: string]: any} = {}
    const keys = Object.keys(data)
    for (let index = 0; index < keys.length; index++) {
        const k = keys[index];
        if(widgetsMap[k].widget_type != "objects_pics_widget"){
             saveData[k] = data[k]
        }
    }
    
    localStorage.setItem(key, JSON.stringify(saveData));
}

export const getSavedFormData = (modelName: string): any => {
    const key = `saved_data_${modelName}`;
    const data  = localStorage.getItem(key);
    if (data !== null){
        return JSON.parse(data);
    }
    return data;
}


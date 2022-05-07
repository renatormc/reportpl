export const saveFormData = (modelName: string, data: any) => {
    const key = `saved_data_${modelName}`;
    localStorage.setItem(key, JSON.stringify(data));
}

export const getSavedFormData = (modelName: string): any => {
    const key = `saved_data_${modelName}`;
    const data  = localStorage.getItem(key);
    if (data !== null){
        return JSON.parse(data);
    }
    return data;
}
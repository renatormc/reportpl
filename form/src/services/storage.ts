export const saveFormData = (modelName: string, data: any) => {
    const key = `saved_data_${modelName}`;
    const saveData = {}
    const keys = Object.keys(data)
    keys.forEach((key, index) => {
        // if(data[key].widget_data){

        // }
    });
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
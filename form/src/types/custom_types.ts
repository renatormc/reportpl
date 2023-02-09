export type WidgetAttributesType = {
    widget_props: any,
    field_name: string,
    widget_type: string,
    label: string,
    col: number
}

export type WidgetMatrixType = Array<Array<WidgetAttributesType>>

export type WidgetsMapType = {
    [key: string]: WidgetAttributesType
}


export type ErrorsType = { [key: string]: any }

export type RenderResponse = {
    errors: ErrorsType | null,
    type: "errors" | "message" | "file"
    data: any
}

export type DataType = { [key: string]: any }

export interface TypeAheadItem {
    key: string,
    value: any
}

export interface DictType {
    [key: string]: number;
}

export interface ModelInstructionsResponse {
    html: string
}
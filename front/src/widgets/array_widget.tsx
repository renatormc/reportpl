import React, { useState } from 'react';
import { DataType, ErrorsType, WidgetMatrixType } from '../types/custom_types';
import CompositeWidget from './composite_widget';

type Props = {
  widget_props: any,
  data: string,
  field_name: string,
  errors: Array<ErrorsType>,
  label: string,
  updateFormValue: (field: string, value: any) => void
}

function TextWidget(props: Props) {

  const [data, setData] = useState<Array<DataType>>([]);

  const [qtdItems, setQtdItems] = useState<number>(1);

  const errors: Array<ErrorsType> = props.errors || [];

  const widgetMatrix: WidgetMatrixType = props.widget_props.widgets;

  const updateFormValue = (index: number, field: string, value: any) => {
    const newData = data;
    newData[index][field] = value;
    props.updateFormValue(props.field_name, newData);
  }

  const addItems = () => {
    for (let i = 0; i < qtdItems; i++) {
      const d = { ...props.widget_props.defaultItemData };
      setData(data => [...data, d]);
    }
  }

  const removeAll = () => {
    setData([]);
  }

  const removeAt = (index: number) => {
    const newData = [
      ...data.slice(0, index),
      ...data.slice(index + 1, data.length)
    ];
    props.updateFormValue(props.field_name, newData);
    // setData([
    //   ...data.slice(0, index),
    //   ...data.slice(index + 1, data.length)
    // ]);
  }

  return (
    <div>
      <label className="form-label">{props.label}</label>
      <div className="container-fluid">
        <div className="row">
          <div className="col-1">
            <input
              type="number"
              min="1"
              className="form-control"
              value={qtdItems}
              onChange={(e) => { setQtdItems(parseInt(e.target.value)) }}
              id={props.field_name}
            />


          </div>
          <div className="col-11">
            <button className="btn btn-secondary" onClick={addItems}>Adicionar</button>
            <button className="btn btn-danger ml-3" onClick={removeAll}>Remover Todos</button>
          </div>

        </div>
        {data.map((item, index) => {
          return (
            <div className='array-widget-item'>
              <div className='d-flex flex-row justify-content-end'>
                <button className="btn btn-danger btn-sm" onClick={() => {removeAt(index)}}><i className="fas fa-trash-alt"></i></button>
              </div>
              <CompositeWidget
                widgetMatrix={widgetMatrix}
                errors={errors[index]}
                data={item}
                updateFormValue={(field: string, value: any) => {
                  updateFormValue(index, field, value);
                }} />
            </div>

          );
        })}
      </div>
    </div >
  );
}

export default TextWidget;
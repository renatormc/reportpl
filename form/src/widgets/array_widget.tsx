import React, { useState } from 'react';
import { DataType, ErrorsType, WidgetMatrixType } from '../types/custom_types';
import CompositeWidget from './composite_widget';

type Props = {
  widget_props: any,
  data: Array<DataType>,
  field_name: string,
  errors: Array<ErrorsType>,
  label: string,
  updateFormValue: (field: string, value: any) => void
}

function ArrayWidget(props: Props) {

  const [qtdItems, setQtdItems] = useState<number>(1);

  const errors: Array<ErrorsType> = props.errors || [];

  const widgetMatrix: WidgetMatrixType = props.widget_props.widgets;

  const updateFormValue = (index: number, field: string, value: any) => {
    const newData = props.data;
    newData[index][field] = value;
    props.updateFormValue(props.field_name, newData);
  }

  const addItems = () => {
    const newData = [...props.data];
    for (let i = 0; i < qtdItems; i++) {
      const d = { ...props.widget_props.default_item_data };
      newData.push(d);
    }
    props.updateFormValue(props.field_name, newData);
  }

  const removeAll = () => {
    props.updateFormValue(props.field_name, []);
  }

  const removeAt = (index: number) => {
    const newData = [
      ...props.data.slice(0, index),
      ...props.data.slice(index + 1, props.data.length)
    ];
    props.updateFormValue(props.field_name, newData);

  }

  const clone = (index: number) => {

    const newData = [...props.data];
    const newItem = { ...props.data[index] }
    newData.push(newItem);
    props.updateFormValue(props.field_name, newData);
  }


  return (
    <div>
      <label className="form-label">{props.label}</label>
      <div className="container-fluid array-container">
        <div className="row">
          <div className="col">
            <div className="d-inline-flex justify-content-start align-items-start gap-1">
              <input
                type="number"
                min="1"
                className="form-control"
                value={qtdItems}
                onChange={(e) => { setQtdItems(parseInt(e.target.value)) }}
                id={props.field_name}
              />
              <button className="btn btn-primary"
                data-bs-toggle="tooltip" data-bs-placement="top" title="Adicionar"
                onClick={addItems}><i className="fas fa-plus"></i></button>
              <button className="btn btn-danger "
                data-bs-toggle="tooltip" data-bs-placement="top" title="Deletar todos"
                onClick={removeAll}><i className="fas fa-trash-alt"></i></button>
            </div>
          </div>
        </div>

        {props.data.map((item, index) => {
          return (
            <div className='array-widget-item'>
              <div className='d-flex flex-row justify-content-end gap-1'>
                <button className="btn btn-secondary btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" title="Clonar"
                  onClick={() => { clone(index) }}><i className="far fa-clone"></i></button>
                <button className="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" title="Deletar"
                  onClick={() => { removeAt(index) }}><i className="fas fa-trash-alt"></i></button>

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

export default ArrayWidget;
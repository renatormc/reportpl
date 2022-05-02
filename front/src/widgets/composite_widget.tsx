import React, { useState } from 'react';
import { DataType, ErrorsType, WidgetMatrixType } from '../types/custom_types';
import SwitchWidget from './switch_widget';

type Props = {
  widgetMatrix: WidgetMatrixType,
  errors: ErrorsType,
  data: DataType,
  field_name?: string,
  updateFormValue: (field: string, value: any) => void
}

function CompositeWidget(props: Props) {

  const [data, setData] = useState<DataType>({});

  const errors = props.errors || {}

  const updateFormValue = (field: string, value: any) => {
    if(props.field_name){
      setData(data => ({ ...data, [field]: value }));
      props.updateFormValue(props.field_name, data);
    }else {
      props.updateFormValue(field, value);
    }
  }

  return (
    <div>
    {props.widgetMatrix.map((row, index) => {
      return (
        <div key={index} className="row">
          {row.map(w => {
            return (
              <div key={w.field_name} className={w.col > 0 ? 'col-' + w.col : 'col'}>
                <SwitchWidget
                  widget_props={w.widget_props}
                  data={props.field_name ? data[w.field_name] : props.data[w.field_name]}
                  field_name={w.field_name}
                  widget_type={w.widget_type}
                  updateFormValue={updateFormValue} 
                  errors={errors[w.field_name]}
                  label={w.label}/>
              </div>
            );
          })}
        </div>
      );
    })}
    </div>
  );
}

export default CompositeWidget;
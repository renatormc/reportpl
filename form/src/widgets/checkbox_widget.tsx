import React from 'react';
import { Form } from 'react-bootstrap';

type Props = {
  model_name: string,
  widget_props: any,
  data: boolean,
  errors: any,
  field_name: string,
  label: string,
  updateFormValue: (field: string, value: any) => void
  formService: (action: string, field: string, payload: any) => void
}

function CheckboxWidget(props: Props) {

  return (
    <div className="CheckboxWidget">
      <Form.Check
        type="checkbox"
        label={props.label}
        id={props.field_name}
        checked={props.data}
        onChange={(e) => {props.updateFormValue(props.field_name, e.target.checked) }}
      />
    
      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default CheckboxWidget;
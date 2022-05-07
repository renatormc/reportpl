import React from 'react';
import { Form } from 'react-bootstrap';

type Props = {
  model_name: string,
  widget_props: any,
  data: string,
  errors: any,
  field_name: string,
  label: string,
  updateFormValue: (field: string, value: any) => void
}

function TextWidget(props: Props) {

  return (
    <div>
      <strong><Form.Label>{props.label}</Form.Label></strong>
      
      <Form.Control
        type="text"
        placeholder={props.widget_props.placeholder}
        value={props.data}
        onChange={(e) => { props.updateFormValue(props.field_name, e.target.value) }}
        id={props.field_name}
      />
      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default TextWidget;
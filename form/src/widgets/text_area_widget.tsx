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

function TextAreaWidget(props: Props) {

  return (
    <div>
      <Form.Label>{props.label}</Form.Label>
      <Form.Control as="textarea"
        rows={props.widget_props.rows}
        value={props.data}
        placeholder={props.widget_props.placeholder}
        onChange={(e) => { props.updateFormValue(props.field_name, e.target.value) }}
      />

      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default TextAreaWidget;
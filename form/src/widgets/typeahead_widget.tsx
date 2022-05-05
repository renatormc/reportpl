import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

type Props = {
  widget_props: any,
  data: string,
  errors: any,
  field_name: string,
  label: string,
  updateFormValue: (field: string, value: any) => void
}

function TypeAheadWidget(props: Props) {


  return (
    <div>
      <Form.Label>{props.label}</Form.Label>
      <Typeahead
        id={props.field_name}
        onChange={(selected) => {
          props.updateFormValue(props.field_name, selected)
        }}
        options={["Goiânia", "Brasília"]}
        // defaultSelected={[props.data]}
      />
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

export default TypeAheadWidget;
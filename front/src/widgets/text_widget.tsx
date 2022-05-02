import React from 'react';

type Props = {
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
      <label className="form-label">{props.label}</label>
      <input
        type="text"
        className="form-control"
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
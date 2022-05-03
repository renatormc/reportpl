import React from 'react';

type Props = {
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
      <label className="form-label">{props.label}</label>
      <textarea
        className="form-control"
        placeholder={props.widget_props.placeholder}
        rows={props.widget_props.rows}
        onChange={(e) => { props.updateFormValue(props.field_name, e.target.value) }}>
        {props.data}
      </textarea>
      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default TextAreaWidget;
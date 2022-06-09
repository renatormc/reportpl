import React from 'react';
import { Form } from 'react-bootstrap';
import { uploadWidgetAsset } from '../services/api';

type Props = {
  model_name: string,
  widget_props: any,
  data: string,
  errors: any,
  field_name: string,
  label: string,
  randomID: string,
  updateFormValue: (field: string, value: any) => void
  formService: (action: string, field: string, payload: any) => void
}

function FileWidget(props: Props) {


  const uploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    let formData = new FormData()
    const files = event.currentTarget.files
    if (files !== null) {
      for (var i = 0; i < files.length; i++) {
        formData.append("file[]", files[i])
      }

      uploadWidgetAsset(props.randomID, 'file_widget', props.field_name, formData).then(data => {
        props.formService("updateForm", props.field_name, { relpath: data })
        // props.updateFormValue(props.field_name, data);
      })
    }
  }

  return (
    <div>
      <strong><Form.Label>{props.label}</Form.Label></strong>
      <Form.Control
        className={props.errors ? 'field-with-errors' : ''}
        type="file"
        onChange={uploadHandler}
        accept={props.widget_props.accept} />
      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default FileWidget;
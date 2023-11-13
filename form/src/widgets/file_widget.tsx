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


  const uploadHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let formData = new FormData()
    const files = event.currentTarget.files
    if (files !== null) {
      for (var i = 0; i < files.length; i++) {
        formData.append("file[]", files[i])
      }

      try {
        props.formService("setLoading", props.field_name, true)
        const data  =  await uploadWidgetAsset(props.randomID, 'file_widget', props.field_name, formData)
        props.formService("updateForm", props.field_name, { relpath: data })
      } finally {
        props.formService("setLoading", props.field_name, false)
      }
     
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
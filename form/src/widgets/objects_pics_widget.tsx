import React from 'react';
import { Form, Image } from 'react-bootstrap';
import { uploadWidgetAsset, urlForWidgetAsset } from '../services/api';

type Props = {
  model_name: string,
  widget_props: any,
  data: string,
  errors: any,
  field_name: string,
  label: string,
  randomID: string,
  updateFormValue: (field: string, value: any) => void
}

function ObjectsPicsWidget(props: Props) {
  // const [selectedFiles, setSelectedFiles] = useState([])

  const uploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    let formData = new FormData()
    const files = event.currentTarget.files
    if (files !== null) {
      for (var i = 0; i < files.length; i++) {
        formData.append("file[]", files[i])
      }
      
      uploadWidgetAsset(props.randomID, 'objects_pics_widget', props.field_name, formData)
    }
  }

  return (
    <div>
      <strong><Form.Label>{props.label}</Form.Label></strong>
      <Form.Control
        type="file"
        multiple
        onChange={uploadHandler} />
        <Image
        src={ urlForWidgetAsset(props.randomID, props.field_name, "not_classified/celular1.jfif")}
        />
      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default ObjectsPicsWidget;
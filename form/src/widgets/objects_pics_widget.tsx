import React, { useRef } from 'react';
import { Form, Image } from 'react-bootstrap';
import { deleteAsset, uploadWidgetAsset, urlForWidgetAsset } from '../services/api';

type ObjectData = {
  name: string,
  pics: Array<string>
}

type Props = {
  model_name: string,
  widget_props: any,
  data: Array<ObjectData>,
  errors: any,
  field_name: string,
  label: string,
  randomID: string,
  updateFormValue: (field: string, value: any) => void
}

type DragItem = {
  picIndex: number,
  objIndex: number
}



function ObjectsPicsWidget(props: Props) {

  const dragItem = useRef<DragItem>({ picIndex: -1, objIndex: -1 });
  const dragOverItem = useRef<DragItem>({ picIndex: -1, objIndex: -1 });

  const uploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    let formData = new FormData()
    const files = event.currentTarget.files
    if (files !== null) {
      for (var i = 0; i < files.length; i++) {
        formData.append("file[]", files[i])
      }

      uploadWidgetAsset(props.randomID, 'objects_pics_widget', props.field_name, formData).then(data => {
        console.log(data)
        props.updateFormValue(props.field_name, data);
      })
    }
  }

  const dragStart = (e: React.DragEvent<HTMLDivElement>, picIndex: number, objIndex: number) => {
    dragItem.current = {
      picIndex: picIndex,
      objIndex: objIndex
    };
  };

  const dragEnter = (e: React.DragEvent<HTMLDivElement>, picIndex: number, objIndex: number) => {
    dragOverItem.current = {
      picIndex: picIndex,
      objIndex: objIndex
    };
  };

  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    if (dragItem.current.objIndex !== dragOverItem.current.objIndex) {
      return
    }
    const copyListItems = [...props.data[dragItem.current.objIndex].pics];
    const dragItemContent = copyListItems[dragItem.current.picIndex];
    copyListItems.splice(dragItem.current.picIndex, 1);
    copyListItems.splice(dragOverItem.current.picIndex, 0, dragItemContent);
    const objects = [...props.data]
    objects[dragItem.current.objIndex].pics = copyListItems
    props.updateFormValue(props.field_name, objects)
    dragItem.current = { picIndex: -1, objIndex: -1 };
    dragOverItem.current = { picIndex: -1, objIndex: -1 };
  };

  const deletePic = (picIndex: number, objIndex: number, relPath: string) => {
    deleteAsset(props.randomID, props.field_name, relPath).then(data => {
      const objects = [...props.data]
      objects[objIndex].pics.splice(picIndex, 1)
      props.updateFormValue(props.field_name, objects)
    })
  }

  return (
    <div>
      <strong><Form.Label>{props.label}</Form.Label></strong>
      <Form.Control
        type="file"
        multiple
        onChange={uploadHandler} />
      <div className='ObjectsPicsImagesContainer'>

        {props.data.map((object: ObjectData, objIndex: number) => {
          return (
            <div
              className='ObjectsPicsImagesContainer'
              key={objIndex}
            >

              {object.pics.map((item: string, picIndex: number) => {
                return (
                  <div
                    className='ObjectsPicsImageContainer ObjectsPicsImageContainerSelected'
                    onDragStart={(e) => dragStart(e, picIndex, objIndex)}
                    onDragEnter={(e) => dragEnter(e, picIndex, objIndex)}
                    onDragEnd={drop}
                    key={picIndex}
                    draggable>
                    <i
                      className="fas fa-trash-alt ObjectsPicsImageTrash"
                      onClick={() => { deletePic(picIndex, objIndex, item) }}
                    ></i>
                    <Image
                      className='ObjectsPicsImage'
                      src={urlForWidgetAsset(props.randomID, props.field_name, item)} />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default ObjectsPicsWidget;
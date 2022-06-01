import React, { useRef } from 'react';
import { Form, Image } from 'react-bootstrap';
import { uploadWidgetAsset, urlForWidgetAsset } from '../services/api';


type Props = {
  model_name: string,
  widget_props: any,
  data: any,
  errors: any,
  field_name: string,
  label: string,
  randomID: string,
  updateFormValue: (field: string, value: any) => void
}

type DragItem = {
  index: number,
  container: number
}


function ObjectsPicsWidget(props: Props) {

  const dragItem = useRef<DragItem>({ index: -1, container: -1 });
  const dragOverItem = useRef<DragItem>({ index: -1, container: -1 });

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

  const dragStart = (e: React.DragEvent<HTMLDivElement>, position: number, container: number) => {
    dragItem.current = {
      index: position,
      container: container
    };
  };

  const dragEnter = (e: React.DragEvent<HTMLDivElement>, position: number, container: number) => {
    dragOverItem.current = {
      index: position,
      container: container
    };
  };

  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    if (dragItem.current.container !== dragOverItem.current.container) {
      return
    }
    const copyListItems = [...props.data.not_classified];
    const objects = [...props.data.objects]
    const items = dragItem.current.container === -1 ? copyListItems : objects[dragOverItem.current.container].pics
    const dragItemContent = items[dragItem.current.index];
    items.splice(dragItem.current.index, 1);
    items.splice(dragOverItem.current.index, 0, dragItemContent);
    dragItem.current = { index: -1, container: -1 };
    dragOverItem.current = { index: -1, container: -1 };
    props.updateFormValue(props.field_name, { not_classified: copyListItems, objects: objects })
  };

  const deletePic = (content: number, index: number) => {
    if(content === -1){
      console.log(props.data.not_classified[index])
    }
  }

  return (
    <div>
      <p>{JSON.stringify(props.data)}</p>
      <strong><Form.Label>{props.label}</Form.Label></strong>
      <Form.Control
        type="file"
        multiple
        onChange={uploadHandler} />
      <div className='ObjectsPicsImagesContainer'>

        {props.data.not_classified.map((item: string, index: number) => {
          return (
            <div
              className='ObjectsPicsImageContainer ObjectsPicsImageContainerSelected'
              onDragStart={(e) => dragStart(e, index, -1)}
              onDragEnter={(e) => dragEnter(e, index, -1)}
              onDragEnd={drop}
              key={index}
              draggable>
              <i className="fas fa-trash-alt ObjectsPicsImageTrash" onClick={() => {deletePic(-1, index)}}></i>

              <Image
                className='ObjectsPicsImage'
                src={urlForWidgetAsset(props.randomID, props.field_name, item)} />
            </div>
          )
        })}
      </div>

      {props.data.objects.map((object: any, objIndex: number) => {
        return (
          <div
            className='ObjectsPicsImagesContainer'
            key={objIndex}
          >

            {object.pics.map((item: string, index: number) => {
              return (
                <div
                  className='ObjectsPicsImageContainer ObjectsPicsImageContainerSelected'
                  onDragStart={(e) => dragStart(e, index, objIndex)}
                  onDragEnter={(e) => dragEnter(e, index, objIndex)}
                  onDragEnd={drop}
                  key={index}
                  draggable>
                  <i className="fas fa-trash-alt ObjectsPicsImageTrash"></i>
                  <Image
                    className='ObjectsPicsImage'
                    src={urlForWidgetAsset(props.randomID, props.field_name, item)} />
                </div>
              )
            })}
          </div>
        )
      })}
      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default ObjectsPicsWidget;
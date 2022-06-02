import React, { useRef } from 'react';
import { Form, Image, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { deleteAsset, uploadWidgetAsset, urlForWidgetAsset } from '../services/api';

type PicData = {
  path: string,
  selected: boolean
}

type ObjectData = {
  name: string,
  pics: Array<PicData>
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

  const moveToNewObjects = () => {
    const objects = [...props.data]
    const newObj: ObjectData = { name: props.widget_props.new_object_name, pics: [] }
    for (let objIndex = 0; objIndex < objects.length; objIndex++) {
      let selPics = objects[objIndex].pics.filter((pic) => {
        return pic.selected
      })
      newObj.pics = [...newObj.pics, ...selPics]
      objects[objIndex].pics = objects[objIndex].pics.filter((pic) => {
        return !pic.selected
      })
    }
    objects.push(newObj)
    props.updateFormValue(props.field_name, objects)
  }

  const movePicToObject = (toIndex: number) => {
    const objects = [...props.data]
    for (let objIndex = 0; objIndex < objects.length; objIndex++) {
      let selPics = objects[objIndex].pics.filter((pic) => {
        return pic.selected
      })
      objects[objIndex].pics = objects[objIndex].pics.filter((pic) => {
        return !pic.selected
      })
      objects[toIndex].pics = [...objects[toIndex].pics, ...selPics]
    }
    props.updateFormValue(props.field_name, objects)
  }

  const selectUnselectAll = (value: boolean) => {
    const objects = [...props.data]
    for (let objIndex = 0; objIndex < objects.length; objIndex++) {
      for (let picIndex = 0; picIndex < objects[objIndex].pics.length; picIndex++) {
        objects[objIndex].pics[picIndex].selected = value;
      }
    }
    props.updateFormValue(props.field_name, objects)
  }

  const removeObject = (objIndex: number) => {
    const objects = [...props.data]
    objects[0].pics = [...objects[0].pics, ...objects[objIndex].pics]
    objects.splice(objects.length - 1, 1);
    props.updateFormValue(props.field_name, objects)
  }


  const toggleSelected = (objIndex: number, picIndex: number) => {
    const objects = [...props.data]
    objects[objIndex].pics[picIndex].selected = !objects[objIndex].pics[picIndex].selected
    props.updateFormValue(props.field_name, objects)
  }

  const renameObject = (objIndex: number, newName: string) => {
    const objects = [...props.data]
    objects[objIndex].name = newName
    props.updateFormValue(props.field_name, objects)
  }

  return (
    <div>
      <strong><Form.Label>{props.label}</Form.Label></strong>
      <Container fluid>
        <Row >
          <Col xs={10}>
            <Form.Control
              type="file"
              multiple
              onChange={uploadHandler} />
          </Col>
          <Col className="text-end" xs={2}>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Ações
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as="button">
                  <div onClick={() => { selectUnselectAll(true) }}>Selecionar todas</div>
                </Dropdown.Item>
                <Dropdown.Item as="button">
                  <div onClick={() => { selectUnselectAll(false) }}>Remover seleção de todas</div>
                </Dropdown.Item>
                {props.widget_props.multiple &&  <div>
                  <Dropdown.Item as="button">
                    <div onClick={moveToNewObjects}>Mover selecionadas para novo objeto</div>
                  </Dropdown.Item>
                  <Dropdown.Item as="button">
                    <div onClick={() => { movePicToObject(0) }}>Remover selecionadas dos objetos</div>
                  </Dropdown.Item>
                </div>}

              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>

      {props.data.map((object: ObjectData, objIndex: number) => {
        return (
          <div
            className='ObjectsPicsImagesContainer'
            key={objIndex}
          >
            {objIndex > 0 && <i
              className="fas fa-trash-alt ObjectsPicsTrash"
              onClick={() => { removeObject(objIndex) }}
            ></i>}
            {objIndex > 0 && <Form.Control
              type="text"
              value={object.name}
              onChange={(e) => { renameObject(objIndex, e.target.value) }}
            />}
            {object.pics.map((item: PicData, picIndex: number) => {
              return (
                <div
                  className={`ObjectsPicsImageContainer ${item.selected ? "ObjectsPicsImageContainerSelected" : ""}`}
                  onDragStart={(e) => dragStart(e, picIndex, objIndex)}
                  onDragEnter={(e) => dragEnter(e, picIndex, objIndex)}
                  onDragEnd={drop}
                  key={picIndex}
                  draggable>
                  <i
                    className="fas fa-trash-alt ObjectsPicsImageTrash"
                    onClick={() => { deletePic(picIndex, objIndex, item.path) }}
                  ></i>
                  <Image
                    onClick={() => { toggleSelected(objIndex, picIndex) }}
                    className='ObjectsPicsImage'
                    src={urlForWidgetAsset(props.randomID, props.field_name, item.path)} />
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
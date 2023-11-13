import React, { useState } from 'react';
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
  formService: (action: string, field: string, payload: any) => void
}


function ObjectsPicsWidget(props: Props) {

  const [picSize, setPicSize] = useState(100)

  const uploadHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    let formData = new FormData()
    const files = event.currentTarget.files
    if (files !== null) {
      for (var i = 0; i < files.length; i++) {
        formData.append("file[]", files[i])
      }

      uploadWidgetAsset(props.randomID, 'objects_pics_widget', props.field_name, formData).then(data => {
        props.updateFormValue(props.field_name, data);
      })
    }
  }

  const dragStart = (e: React.DragEvent<HTMLDivElement>, picIndex: number, objIndex: number) => {
    e.stopPropagation()
    const data = {
      picIndex: picIndex,
      objIndex: objIndex
    }
    e.dataTransfer.setData("Text", JSON.stringify(data));
  };


  const onDropInObject = (e: React.DragEvent<HTMLDivElement>, objIndex: number) => {
    e.preventDefault()
    const dataStr = e.dataTransfer.getData("Text")
    const data = JSON.parse(dataStr)

    const objects = [...props.data]
    const dragItemContent = objects[data.objIndex].pics[data.picIndex]
    objects[data.objIndex].pics.splice(data.picIndex, 1)
    objects[objIndex].pics.push(dragItemContent)
    props.updateFormValue(props.field_name, objects)
  }

  const onDropInPic = (e: React.DragEvent<HTMLDivElement>, objIndex: number, picIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    const dataStr = e.dataTransfer.getData("Text")
    const data = JSON.parse(dataStr)

    const objects = [...props.data]
    const dragItemContent = objects[data.objIndex].pics[data.picIndex]
    objects[data.objIndex].pics.splice(data.picIndex, 1);
    objects[objIndex].pics.splice(picIndex, 0, dragItemContent);
    props.updateFormValue(props.field_name, objects)
  }


  const deletePic = (picIndex: number, objIndex: number, relPath: string) => {
    deleteAsset(props.randomID, props.field_name, relPath).then(data => {
      const objects = [...props.data]
      objects[objIndex].pics.splice(picIndex, 1)
      props.updateFormValue(props.field_name, objects)
    })
  }

  const moveToNewObjects = () => {
    const objects = [...props.data]
    const newObj: ObjectData = { name: `${props.widget_props.new_object_name} ${objects.length}`, pics: [] }
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
    for (let objIndex = 0; objIndex < objects.length; objIndex++) {
      for (let picIndex = 0; picIndex < objects[objIndex].pics.length; picIndex++) {
        objects[objIndex].pics[picIndex].selected = false;
      }
    }
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

  const deleteSelected = async () => {
    const objects = [...props.data]
    for (let objIndex = 0; objIndex < objects.length; objIndex++) {
      for (let picIndex = objects[objIndex].pics.length - 1; picIndex >= 0; picIndex--) {
        const pic = objects[objIndex].pics[picIndex]
        if (pic.selected) {
          await deleteAsset(props.randomID, props.field_name, pic.path)
          objects[objIndex].pics.splice(picIndex, 1)
        }
      }
    }
    props.updateFormValue(props.field_name, objects)
  }

  return (
    <div>
      <strong><Form.Label>{props.label}</Form.Label></strong>
      <Container fluid className="p-0">
        <Row >
          <Col xs={8}>
            <div className="d-flex justify-content-between" >
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
                  {props.widget_props.multiple && <div>
                    <Dropdown.Item as="button">
                      <div onClick={moveToNewObjects}>Mover selecionadas para novo objeto</div>
                    </Dropdown.Item>
                    <Dropdown.Item as="button">
                      <div onClick={() => { movePicToObject(0) }}>Remover selecionadas dos objetos</div>
                    </Dropdown.Item>
                    <Dropdown.Item as="button">
                      <div onClick={deleteSelected}>Deletar selecionadas</div>
                    </Dropdown.Item>
                  </div>}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control
                type="file"
                multiple
                onChange={uploadHandler} 
                style={{ marginLeft: "10px" }}/>

            </div>
          </Col>
          <Col xs={4} >

            <Form.Range
              min={50}
              max={300}
              value={picSize}
              onChange={(e) => { setPicSize(parseInt(e.target.value)) }}
            />

          </Col>
        </Row>
      </Container>

      {props.data.map((object: ObjectData, objIndex: number) => {
        return (
          <div
            className='ObjectsPicsImagesContainer'
            key={objIndex}
            onDrop={(e) => { onDropInObject(e, objIndex) }}
            onDragOver={(e) => { e.preventDefault() }}
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
                  className={`text-center ObjectsPicsImageContainer ${item.selected ? "ObjectsPicsImageContainerSelected" : ""}`}
                  onDragStart={(e) => dragStart(e, picIndex, objIndex)}
                  onDrop={(e) => { onDropInPic(e, objIndex, picIndex) }}
                  onDragOver={(e) => { e.preventDefault() }}
                  key={picIndex}
                  draggable>
                  <i
                    className="fas fa-trash-alt ObjectsPicsImageTrash"
                    onClick={() => { deletePic(picIndex, objIndex, item.path) }}
                  ></i>
                  <Image
                    onClick={() => { toggleSelected(objIndex, picIndex) }}
                    style={{ height: picSize + 'px' }}
                    className='ObjectsPicsImage'
                    src={urlForWidgetAsset(props.randomID, props.field_name, item.path)} />
                  <div className="d-flex justify-content-center" >
                    <p className='ObjectsPicsImageCaption'>{item.path}</p>
                  </div>

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
import React from 'react';
import { Form, Image } from 'react-bootstrap';
import { uploadWidgetAsset, urlForWidgetAsset } from '../services/api';
import { SortableContainer , SortableElement } from "react-sortable-hoc";

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


// const SortablePhoto = SortableElement(item => <Image
//   key={index}
//   className='ObjectsPicsImage'
//   src={urlForWidgetAsset(props.randomID, props.field_name, item)} />);

// const SortableGallery = SortableContainer(({ items }) => (
//   <Gallery photos={items} renderImage={props => <SortablePhoto {...props} />} />
// ));

const SortableItem = SortableElement(({ value }: {value: string}) => <li>{value}</li>);

const SortableList = SortableContainer(({children}: {children: Array<string>}) => {
  return <ul>{children}</ul>;
});

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

  const onSortEnd = ({ oldIndex, newIndex }: {oldIndex: number, newIndex: number}) => {
    console.log(oldIndex, newIndex);
    // setItems(arrayMove(items, oldIndex, newIndex));
  };


  return (
    <div>
      <strong><Form.Label>{props.label}</Form.Label></strong>
      <Form.Control
        type="file"
        multiple
        onChange={uploadHandler} />

      {/* <SortableList items={props.data.not_classified} onSortEnd={onSortEnd} /> */}
      <SortableList onSortEnd={onSortEnd}>
        {props.data.not_classified.map((value: string, index: number) => (
          <SortableItem key={index} index={index} value={urlForWidgetAsset(props.randomID, props.field_name, value)} />
        ))}
      </SortableList>

      {/* {SortableContainer(({ items }) => {
        return (
          props.data.not_classified.map((item: string, index: number) => {
            return (
              <SortableItem key={index} index={index} value={urlForWidgetAsset(props.randomID, props.field_name, item)} />
              // <Image
              //   key={index}
              //   className='ObjectsPicsImage'
              //   src={urlForWidgetAsset(props.randomID, props.field_name, item)} />
            )
          })
        )
      })} */}



      {/* <SortableGallery items={props.data.not_classified} onSortEnd={onSortEnd} axis={"xy"} /> */}



      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default ObjectsPicsWidget;
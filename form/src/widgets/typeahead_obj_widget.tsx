import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

type Props = {
  model_name: string,
  widget_props: any,
  data: object,
  errors: any,
  field_name: string,
  label: string,
  updateFormValue: (field: string, value: any) => void
}

function TypeAheadObjWidget(props: Props) {

  const [options, setOptions] = useState<Array<object>>(props.widget_props.options);

  const loadAjaxOptions = (text: string) => {
    setOptions([{key: 'teste', value: 'teste value'}]);
  }

  return (
    <div>
      <Form.Label>{props.label}</Form.Label>
      <Typeahead
        id={props.field_name}
        labelKey="key"
        placeholder={props.widget_props.placeholder}
        onChange={(selected) => {
          if(selected.length === 0){
            props.updateFormValue(props.field_name, null)
          }else{
            props.updateFormValue(props.field_name, selected[0])
          }
        }}
        filterBy={props.widget_props.ajax ? (option, props)=>{
          return true;
        }: ['key']}
        onInputChange={(text: string)=> {
          if(props.widget_props.ajax){
            loadAjaxOptions(text);
          }
         
        }}
        options={options}
        selected={props.data? [props.data]: []}
      />
      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default TypeAheadObjWidget;
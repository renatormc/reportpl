import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { getListItemsAjax } from '../services/api';

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
    getListItemsAjax(props.model_name, props.widget_props.list_name, text).then(items => {
      setOptions(items);
    });

  }

  return (
    <div>
      <Form.Group>
      <strong><Form.Label>{props.label}</Form.Label></strong>
        <Typeahead
          id={props.field_name}
          labelKey="key"
          placeholder={props.widget_props.placeholder}
          onChange={(selected) => {
            if (selected.length === 0) {
              props.updateFormValue(props.field_name, null)
            } else {
              props.updateFormValue(props.field_name, selected[0])
            }
          }}
          filterBy={props.widget_props.ajax ? (option, props) => {
            return true;
          } : ['key']}
          onInputChange={(text: string) => {
            if (props.widget_props.ajax) {
              loadAjaxOptions(text);
            }

          }}
          options={options}
          selected={props.data ? [props.data] : []}
        />
      </Form.Group>
      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default TypeAheadObjWidget;
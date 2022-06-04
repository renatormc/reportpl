import React from 'react';
import { Form } from 'react-bootstrap';
import Typeahead from '../components/typeahead'
import { getListItemsAjax } from '../services/api';
import { TypeAheadItem } from '../types/custom_types'

type Props = {
  model_name: string,
  widget_props: any,
  data: string,
  errors: any,
  field_name: string,
  label: string,
  updateFormValue: (field: string, value: any) => void
  formService: (action: string, field: string, payload: any) => void
}

function TypeAheadWidget(props: Props) {

  const getOptions = async (query: string): Promise<Array<string>> => {
    const options = props.widget_props.ajax ? await getListItemsAjax(props.model_name, props.widget_props.list_name, query) : props.widget_props.options
    const ops = options.filter((item: TypeAheadItem) => {
      return item.key.includes(query)
    })
    return ops.map((item: TypeAheadItem) => {
      return item.key
    })
  }

  return (
    <div>
      <Form.Group>
        <strong><Form.Label>{props.label}</Form.Label></strong>
        <Typeahead
          value={props.data}
          onChange={(value) => { props.updateFormValue(props.field_name, value) }}
          getOptions={getOptions}
        />
      </Form.Group>
      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default TypeAheadWidget;
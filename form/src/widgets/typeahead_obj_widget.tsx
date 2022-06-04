import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { getListItemsAjax } from '../services/api';
import Typeahead from '../components/typeahead'
import { TypeAheadItem } from '../types/custom_types'

type Props = {
  model_name: string,
  widget_props: any,
  data: TypeAheadItem|null,
  errors: any,
  field_name: string,
  label: string,
  updateFormValue: (field: string, value: any) => void
  formService: (action: string, field: string, payload: any) => void
}

type OptionsMapType = {
  [key: string]: TypeAheadItem
}

function TypeAheadObjWidget(props: Props) {

  const [optionsMap, setOptionsMap] = useState<OptionsMapType>({})
  const [tempValue, setTempValue] = useState("")

  const getOptions = async (query: string): Promise<Array<string>> => {
    const options = props.widget_props.ajax ? await getListItemsAjax(props.model_name, props.widget_props.list_name, query) : props.widget_props.options
    const ops = options.filter((item: TypeAheadItem) => {
      return item.key.includes(query)
    })
    const opmap: OptionsMapType = {}
    for (let index = 0; index < ops.length; index++) {
      opmap[ops[index].key] = ops[index]
    }
    setOptionsMap(opmap)
    return ops.map((item: TypeAheadItem) => {
      return item.key
    })
  }

  const onChange = (value: string) => {
    setTempValue(value)
    props.updateFormValue(props.field_name, optionsMap[value] ?? null)
  }

  return (
    <div>
      <Form.Group>
        <strong><Form.Label>{props.label}</Form.Label></strong>
        <Typeahead
          value={props.data ? props.data.key : tempValue}
          onChange={(value) => { onChange(value) }}
          getOptions={getOptions}
        />
      </Form.Group>
      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default TypeAheadObjWidget;
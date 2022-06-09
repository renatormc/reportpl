import React, { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import {TypeAheadItem, DictType} from '../types/custom_types'

type Props = {
  model_name: string,
  widget_props: any,
  data: TypeAheadItem,
  errors: any,
  field_name: string,
  label: string,
  updateFormValue: (field: string, value: any) => void
  formService: (action: string, field: string, payload: any) => void
}

function SelectWidget(props: Props) {

  const optionsMap = useMemo(() => {
    let m: DictType = {};
    for (let index = 0; index < props.widget_props.options.length; index++) {
      m[props.widget_props.options[index].key] = props.widget_props.options[index];
    }
    return m;
  }, [props.widget_props.options])

  const updateFormValue = (value: string) => {
    props.updateFormValue(props.field_name, optionsMap[value]);
  }

  return (
    <div>
      <strong><Form.Label>{props.label}</Form.Label></strong>
      <Form.Select aria-label={props.label}
        placeholder={props.widget_props.placeholder}
        value={props.data.key}
        onChange={(e) => { updateFormValue(e.target.value) }}
        id={props.field_name}
        className={props.errors ? 'field-with-errors': ''}
      >
        {props.widget_props.options.map((data: TypeAheadItem, index: number) => {
          return (<option value={data.key} key={index}>{data.key}</option>)
        })}
      </Form.Select>

      {props.errors && <div className="error-message">{props.errors}</div>}
    </div >
  );
}

export default SelectWidget;
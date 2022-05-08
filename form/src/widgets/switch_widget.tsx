import React from 'react';
import TextWidget from './text_widget';
import ArrayWidget from './array_widget';
import TextAreaWidget from './text_area_widget';
import TypeAheadObjWidget from './typeahead_obj_widget';
import SelectWidget from './select_widget';
import CheckboxWidget from './checkbox_widget';

type Props = {
  model_name: string,
  widget_props: any,
  data: any,
  errors: any,
  field_name: string,
  widget_type: string,
  label: string,
  updateFormValue: (field: string, value: any) => void
}

function SwitchWidget(props: Props) {
  switch (props.widget_type) {
    case "text_widget":
      return <TextWidget
        model_name={props.model_name}
        updateFormValue={props.updateFormValue}
        widget_props={props.widget_props}
        data={props.data}
        field_name={props.field_name}
        errors={props.errors}
        label={props.label} />
    case "array_widget":
      return <ArrayWidget
        model_name={props.model_name}
        widget_props={props.widget_props}
        data={props.data}
        field_name={props.field_name}
        errors={props.errors}
        updateFormValue={props.updateFormValue}
        label={props.label} />
    case "text_area_widget":
      return <TextAreaWidget
        model_name={props.model_name}
        updateFormValue={props.updateFormValue}
        widget_props={props.widget_props}
        data={props.data}
        field_name={props.field_name}
        errors={props.errors}
        label={props.label} />
    case "typeahead_obj_widget":
      return <TypeAheadObjWidget
        model_name={props.model_name}
        updateFormValue={props.updateFormValue}
        widget_props={props.widget_props}
        data={props.data}
        field_name={props.field_name}
        errors={props.errors}
        label={props.label} />
    case "select_widget":
      return <SelectWidget
        model_name={props.model_name}
        updateFormValue={props.updateFormValue}
        widget_props={props.widget_props}
        data={props.data}
        field_name={props.field_name}
        errors={props.errors}
        label={props.label} />
    case "checkbox_widget":
      return <CheckboxWidget
        model_name={props.model_name}
        updateFormValue={props.updateFormValue}
        widget_props={props.widget_props}
        data={props.data}
        field_name={props.field_name}
        errors={props.errors}
        label={props.label} />
    default:
      return <p>Widget of type "{props.widget_type}" doesn't exist.</p>;
  }

}

export default SwitchWidget;
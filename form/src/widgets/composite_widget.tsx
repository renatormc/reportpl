import React from 'react';
import { DataType, ErrorsType, WidgetMatrixType } from '../types/custom_types';
import SwitchWidget from './switch_widget';
import { Row, Col } from 'react-bootstrap';

type Props = {
  model_name: string,
  widgetMatrix: WidgetMatrixType,
  errors: ErrorsType,
  data: DataType,
  randomID: string,
  field_name?: string,
  updateFormValue: (field: string, value: any) => void
  formService: (action: string, field: string, payload: any) => void
}

function CompositeWidget(props: Props) {

  // const [data, setData] = useState<DataType>({});

  const errors = props.errors || {}

  const updateFormValue = (field: string, value: any) => {
    if (props.field_name) {
      // setData(data => ({ ...data, [field]: value }));
      props.updateFormValue(props.field_name, { ...props.data, [field]: value });
    } else {
      props.updateFormValue(field, value);
    }
  }

  return (
    <div>
      {props.widgetMatrix.map((row, index) => {
        return (
          <Row key={index} className="gx-5">
            {row.map((w, index2) => {
              return (
                <Col sm={w.col > 0 ? w.col : undefined} key={index2}>
                  <div className='mb-2'>
                    <SwitchWidget
                      model_name={props.model_name}
                      widget_props={w.widget_props}
                      randomID={props.randomID}
                      data={props.data[w.field_name]}
                      field_name={w.field_name}
                      widget_type={w.widget_type}
                      updateFormValue={updateFormValue}
                      errors={errors[w.field_name]}
                      label={w.label}
                      formService={props.formService} />
                  </div>

                </Col>
              );
            })}
          </Row>
        );
      })}
    </div>
  );
}

export default CompositeWidget;
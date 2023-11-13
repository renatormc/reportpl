import React, { useState } from 'react';
import { DataType, ErrorsType, WidgetMatrixType } from '../types/custom_types';
import CompositeWidget from './composite_widget';
import { Row, Col, Button, Form, Container } from 'react-bootstrap';

type Props = {
  model_name: string,
  widget_props: any,
  data: Array<DataType>,
  field_name: string,
  errors: Array<ErrorsType>,
  label: string,
  randomID: string,
  updateFormValue: (field: string, value: any) => void
  formService: (action: string, field: string, payload: any) => void
}

function ArrayWidget(props: Props) {

  const [qtdItems, setQtdItems] = useState<number>(1);

  const errors: Array<ErrorsType> = props.errors || [];

  const widgetMatrix: WidgetMatrixType = props.widget_props.widgets;

  const updateFormValue = (index: number, field: string, value: any) => {
    const newData = props.data;
    newData[index][field] = value;
    props.updateFormValue(props.field_name, newData);
  }

  const addItems = () => {
    const newData = [...props.data];
    for (let i = 0; i < qtdItems; i++) {
      const d = { ...props.widget_props.default_item_data };
      newData.push(d);
    }
    props.updateFormValue(props.field_name, newData);
  }

  const removeAll = () => {
    props.updateFormValue(props.field_name, []);
  }

  const removeAt = (index: number) => {
    const newData = [
      ...props.data.slice(0, index),
      ...props.data.slice(index + 1, props.data.length)
    ];
    props.updateFormValue(props.field_name, newData);

  }

  const clone = (index: number) => {

    const newData = [...props.data];
    const newItem = { ...props.data[index] }
    newData.push(newItem);
    props.updateFormValue(props.field_name, newData);
  }


  return (
    <div>
      <strong><Form.Label>{props.label}</Form.Label></strong>
      <Container fluid className="array-container">
        <Row>
          <Col>
            <div className="d-inline-flex justify-content-start align-items-start gap-2">
              <Form.Control
                type="number"
                min={1}
                value={qtdItems}
                onChange={(e) => { setQtdItems(parseInt(e.target.value)) }}
                id={props.field_name} />

              <Button variant="primary"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Adicionar"
                onClick={addItems}>
                <i className="fas fa-plus"></i>
              </Button>
              <Button variant="danger"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Deletar todos"
                onClick={removeAll}
                disabled={props.data.length === 0 ? true : false}>
                <i className="fas fa-trash-alt"></i>
              </Button>
            </div>
          </Col>
        </Row>

        {props.data.map((item, index) => {
          return (
            <div className='array-widget-item' key={index}>
              <div className='d-flex flex-row justify-content-end gap-1'>
                <Button variant="secondary"
                  size="sm"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Clonar"
                  onClick={() => { clone(index) }}>
                  <i className="far fa-clone"></i>
                </Button>
                <Button variant="danger"
                  size="sm"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Deletar"
                  onClick={() => { removeAt(index) }}>
                  <i className="fas fa-trash-alt"></i>
                </Button>
              </div>
              <CompositeWidget
                model_name={props.model_name}
                widgetMatrix={widgetMatrix}
                errors={errors[index]}
                data={item}
                randomID={props.randomID}
                updateFormValue={(field: string, value: any) => {
                  updateFormValue(index, field, value);
                }}
                formService={props.formService} />
            </div>

          );
        })}
      </Container>
    </div >
  );
}

export default ArrayWidget;
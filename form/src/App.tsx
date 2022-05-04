import React, { useEffect, useState } from 'react';
import './App.css';
import MsgBox from './components/msgbox';
import { getFormDefaultData, getFormLayout, renderDoc } from './services/api';
import { DataType, ErrorsType, WidgetMatrixType } from './types/custom_types';
import CompositeWidget from './widgets/composite_widget';
import { Button, Row, Col, Container, Form } from 'react-bootstrap';


type Props = {
  model_name: string
}

function App(props: Props) {
  const [widgetMatrix, setWidgetMatrix] = useState<WidgetMatrixType>([[]]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  const [data, setData] = useState<DataType>({});

  const [errors, setErrors] = useState<ErrorsType>({});

  const updateFormValue = (field: string, value: any) => {
    setData(data => ({ ...data, [field]: value }));
  }

  const submitForm = async () => {
    const errors = await renderDoc(props.model_name, data);
    console.log(errors);
    setErrors(errors);
    if (errors === null) {
      showModal("Renderização", "Arquivo renderizado com sucesso");
    }
  }

  const clearForm = () => {
    getFormDefaultData(props.model_name).then((data) => {
      setData(data);
    })
  }

  const showModal = (title: string, text: string) => {
    console.log("Mostrar modal");
    setModalTitle(title);
    setModalText(text);
    setModalVisible(true);
  }

  useEffect(() => {
    getFormLayout(props.model_name).then((data) => {
      setWidgetMatrix(data);
    }).catch(error => {
      console.log(error.response.data);
    });
    getFormDefaultData(props.model_name).then((data) => {
      setData(data);
    })
  }, [])

  return (
    <div className="App">

      <Container fluid>
        <Row>
          <Col>
            <Form onSubmit={e => e.preventDefault()}>
             
                <CompositeWidget
                  widgetMatrix={widgetMatrix}
                  errors={errors}
                  data={data}
                  updateFormValue={updateFormValue} />
                <Row className="mt-3">
                  <Col className="text-center">

                    <div className="d-inline-flex p-2 bd-highlight gap-3">
                      <Button variant="secondary" onClick={clearForm}><i className="fa fa-broom"></i> Limpar</Button>
                      <Button variant="primary" onClick={submitForm}><i className="fa fa-file-word"></i> Gerar docx</Button>
                    </div>

                  </Col>
                </Row>
                {/* <p className='text-center'>{JSON.stringify(data)}</p>
              <p className='text-center'>{JSON.stringify(errors)}</p> */}

            </Form>
          </Col>
        </Row>
      </Container>
      <MsgBox show={modalVisible} setShow={setModalVisible} title={modalTitle} text={modalText} />
    </div>
  );
}

export default App;

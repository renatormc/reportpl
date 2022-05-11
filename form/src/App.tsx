import React, { useEffect, useState } from 'react';
import './App.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import MsgBox from './components/msgbox';
import { getFormDefaultData, getFormLayout, renderDoc } from './services/api';
import { DataType, ErrorsType, WidgetMatrixType } from './types/custom_types';
import CompositeWidget from './widgets/composite_widget';
import { Button, Row, Col, Container, Form } from 'react-bootstrap';
import { getSavedFormData, saveFormData } from './services/storage';


type Props = {
  model_name: string,
  randomID: string
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
    saveFormData(props.model_name, data);
    const errors = await renderDoc(props.model_name, data, props.randomID);
    setErrors(errors);
    if (errors === null) {
      showModal("Renderização", "Arquivo renderizado com sucesso");
    }
  }

  const loadSavedForm = async () => {
    const data = getSavedFormData(props.model_name);
    if(data !== null){
      setData(data);
    }
  }

  const clearForm = () => {
    saveFormData(props.model_name, data);
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
    getFormDefaultData(props.model_name).then((data) => {
      setData(data);
    })
    getFormLayout(props.model_name).then((data) => {
      setWidgetMatrix(data);
    }).catch(error => {
      console.log(error.response.data);
    });
   
  }, [])

  return (
    <div className="App">

      <Container fluid>
        <Row>
          <Col>
            <Form onSubmit={e => e.preventDefault()}>

              <CompositeWidget
                model_name={props.model_name}
                widgetMatrix={widgetMatrix}
                errors={errors}
                data={data}
                updateFormValue={updateFormValue} />
              <Row className="mt-3">
                <Col className="text-center">

                  <div className="d-inline-flex p-2 bd-highlight gap-3">
                    <Button variant="secondary" onClick={clearForm}><i className="fa fa-broom"></i> Limpar</Button>
                    <Button variant="primary" onClick={submitForm}><i className="fa fa-file-word"></i> Gerar docx</Button>
                    <Button variant="warning" onClick={loadSavedForm}><i className="fas fa-archive"></i> Carregar último preenchimento</Button>
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

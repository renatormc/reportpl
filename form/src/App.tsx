import React, { useEffect, useState } from 'react';
import './App.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import MsgBox from './components/msgbox';
import { getFormDefaultData, getFormLayout, getModelInstructions, getUpdateData, renderDoc, readWorkdir } from './services/api';
import { DataType, ErrorsType, WidgetMatrixType, WidgetsMapType } from './types/custom_types';
import CompositeWidget from './widgets/composite_widget';
import { Button, Row, Col, Container, Form, Accordion, Spinner } from 'react-bootstrap';
import { getSavedFormData, saveFormData } from './services/storage';
import fileDownload from 'js-file-download';

type Props = {
  model_name: string,
  randomID: string,
  local: boolean
}


function App(props: Props) {
  const [widgetMatrix, setWidgetMatrix] = useState<WidgetMatrixType>([[]]);
  const [widgetsMap, setWidgetsMap] = useState<WidgetsMapType>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  const [data, setData] = useState<DataType>({});

  const [modelInstructions, setModelInstructions] = useState("");

  const [errors, setErrors] = useState<ErrorsType>({});
  const [loading, setLoading] = useState(false);

  const mapWidgets = () => {
    const m: WidgetsMapType = {}
    for (let rowIndex = 0; rowIndex < widgetMatrix.length; rowIndex++) {
      for (let wIndex = 0; wIndex < widgetMatrix[rowIndex].length; wIndex++) {
        const w = widgetMatrix[rowIndex][wIndex]
        m[w.field_name] = w
      }
    }
    setWidgetsMap(m)
  }

  const updateFormValue = (field: string, value: any) => {
    setData(data => ({ ...data, [field]: value }));
  }

  const submitForm = async () => {
    saveFormData(props.model_name, data, widgetsMap);
    try {
      setLoading(true)
      const resp = await renderDoc(props.model_name, data, props.randomID);
      switch (resp.type) {
        case 'errors':
          
          if (!(errors instanceof ArrayBuffer)) {
            setErrors(resp.errors as ErrorsType);
            showModal("Erros", "Há erros no seu formulário. Corrija-os e clique em \"Gerar docx\" novamente.");
          }
          break;
        case 'file':
          fileDownload(resp.data, props.randomID + ".docx");
          break;
        case 'message':
          showModal("Mensagem", resp.data);
          break;
      }     

    } finally {
      setLoading(false)
    }

  }

  const formService = async (action: string, field: string, payload: any) => {
    switch (action) {
      case "updateForm":
        const d = await getUpdateData(props.randomID, props.model_name, field, payload)
        await updateData(d)
        break;
      case "setLoading":
        setLoading(payload)
        break;
      default:
        break;
    }
  }

  const updateData = async (updateData: DataType) => {
    if (updateData !== null) {
      const copyData = { ...data }
      const keys = Object.keys(updateData)
      for (let index = 0; index < keys.length; index++) {
        const k = keys[index];
        if (k in copyData) {
          copyData[k] = updateData[k]
        }
      }
      setData(copyData)
    }
  }

  const loadSavedForm = async () => {
    const savedData = getSavedFormData(props.model_name);
    await updateData(savedData)
  }

  const clearForm = () => {
    saveFormData(props.model_name, data, widgetsMap);
    getFormDefaultData(props.randomID, props.model_name).then((data) => {
      setData(data);
    })
  }

  const readWorkDirWrap = async () => {
     const data = await readWorkdir(props.model_name)
     await updateData(data)
  }

  const showModal = (title: string, text: string) => {
    setModalTitle(title);
    setModalText(text);
    setModalVisible(true);
  }

  useEffect(() => {
    getFormDefaultData(props.randomID, props.model_name).then((data) => {
      setData(data);
      getFormLayout(props.model_name).then((data) => {
        setWidgetMatrix(data);
      }).catch(error => {
        console.log(error.response.data);
      });
    })

    getModelInstructions(props.model_name).then(data => {
      setModelInstructions(data.html);
    });

  }, [])

  useEffect(() => {
    mapWidgets()
  }, [widgetMatrix])

  return (
    <div className="App">
      {loading && <div className='main-spinner-container d-flex d-flex-column justify-content-center align-items-center'>
        <Spinner animation="border" variant="primary" style={{ position: 'absolute' }} />
      </div>}
      <Container fluid>
        {modelInstructions !== "" && <Row>
          <Col>
            <Accordion >
              <Accordion.Item eventKey="0">
                <Accordion.Header className="bg-primary">Instruções</Accordion.Header>
                <Accordion.Body>
                  <div dangerouslySetInnerHTML={{ __html: modelInstructions }} />
                </Accordion.Body>
              </Accordion.Item>

            </Accordion>
          </Col>
        </Row>}
        <Row>
          <Col>
            <Form onSubmit={e => e.preventDefault()}>
              <CompositeWidget
                model_name={props.model_name}
                widgetMatrix={widgetMatrix}
                errors={errors}
                data={data}
                randomID={props.randomID}
                updateFormValue={updateFormValue}
                formService={formService} />
              <Row className="mt-3">
                <Col className="text-center">

                  <div className="d-inline-flex p-2 bd-highlight gap-3">

                    <Button variant="secondary" onClick={clearForm}><i className="fa fa-broom"></i> Limpar</Button>
                    <Button variant="primary" onClick={submitForm}><i className="fa fa-file-word"></i> Gerar docx</Button>
                    <Button variant="warning" onClick={loadSavedForm}><i className="fas fa-archive"></i> Carregar último preenchimento</Button>
                    {props.local && <Button variant="secondary" onClick={readWorkDirWrap}><i className="fas fa-archive"></i> Ler diretório de trabalho</Button>}
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

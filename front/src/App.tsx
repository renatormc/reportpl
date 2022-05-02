import React, { useEffect, useState } from 'react';
import './App.css';
import { getFormDefaultData, getFormLayout, renderDoc } from './services/api';
import { DataType, ErrorsType, WidgetMatrixType } from './types/custom_types';
import CompositeWidget from './widgets/composite_widget';


function App() {
  const [widgetMatrix, setWidgetMatrix] = useState<WidgetMatrixType>([[]]);

  const [data, setData] = useState<DataType>({});

  const [errors, setErrors] = useState<ErrorsType>({});

  const updateFormValue = (field: string, value: any) => {
    setData(data => ({ ...data, [field]: value }));
  }

  const submitForm = async () => {
    const errors = await renderDoc("example", data);
    setErrors(errors);
  }

  useEffect(() => {
    getFormLayout("example").then((data) => {
      setWidgetMatrix(data);
    }).catch(error => {
      console.log(error.response.data);
    });
    getFormDefaultData("example").then((data) => {
      setData(data);
    })
  }, [])

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <form onSubmit={e => e.preventDefault()}>
              <CompositeWidget
                widgetMatrix={widgetMatrix}
                errors={errors}
                data={data}
                updateFormValue={updateFormValue} />
              <div className="row mt-3">
                <div className="col text-center">
                  <button className="btn btn-primary" onClick={submitForm}>Gerar docx</button>
                </div>
              </div>

              <p className='text-center'>{JSON.stringify(data)}</p>
              <p className='text-center'>{JSON.stringify(errors)}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

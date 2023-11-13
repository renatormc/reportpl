import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import styles from './typeahead.module.css'

type Props = {
  value: string
  hasError: boolean
  onChange: (value: string) => void
  getOptions:  (query: string) => Promise<Array<string>>
}

function Typeahead(props: Props) {

  const [visible, setVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [options, setOptions] = useState<Array<string>>([])

  const test = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        if (selectedIndex === options.length - 1) {
          setSelectedIndex(0)
        } else if (selectedIndex < options.length - 1) {
          setSelectedIndex(selectedIndex + 1)
        }
        break;
      case "ArrowUp":
        e.preventDefault()
        if (selectedIndex <= 0) {
          setSelectedIndex(options.length - 1)
        } else if (selectedIndex < options.length) {
          setSelectedIndex(selectedIndex - 1)
        }
        break;
      case "Escape":
        e.preventDefault()
        hideOptions()
        break;
      case "Enter":
        if (visible && selectedIndex > -1) {
          props.onChange(options[selectedIndex])
        } 
        hideOptions()
        break;
      case "Tab":
        hideOptions()
        break
      default:
        break;
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value)
    props.getOptions(e.target.value).then(value => {
      setOptions(value)
      setSelectedIndex(-1)
      setVisible(true)
    })
   
  }

  const onClickOption = (index: number) => {
    hideOptions()
    props.onChange(options[index])
  }

  const hideOptions = () => {
    setVisible(false)
    setSelectedIndex(-1)
  }

  useEffect(() => {
    window.addEventListener("click", hideOptions);
    return () => {
      window.removeEventListener("click", hideOptions)
    };
  }, []);

  return (
    <div className={styles.container}>
      <Form.Control
        className={props.hasError ? 'field-with-errors': ''}
        type="text"
        value={props.value}
        onChange={onChange}
        onKeyDown={test}
      />
      {visible && <div className={styles.optionsContainer}>
        {options.map((op: string, index: number) => {
          return (
            <div
              className={`${styles.option} ${index === selectedIndex ? styles.optionSelected : ""}`}
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                onClickOption(index)
              }}>{op}
            </div>
          )

        })}

      </div>}

    </div>
  );
}

export default Typeahead;
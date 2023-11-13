import React from 'react';
import { Modal, Button } from 'react-bootstrap';

type Props = {
  title: string,
  text: string,
  show: boolean,
  setShow: (value: boolean) => void
}

function MsgBox(props: Props) {
 
  return (
    <>
      <Modal show={props.show} onHide={()=>{props.setShow(false)}}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{props.text}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>{props.setShow(false)}}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MsgBox;
import React from 'react'
import { Button, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactChipInput from "react-chip-input";

function ModalComponent(props) {
  return (
    <div>
      <Modal scrollable isOpen={props.modal} toggle={props.toggle} className="modal-lg">
        <ModalHeader toggle={props.toggle}>Add New Entry</ModalHeader>
        <ModalBody>
          <Label className="date">{props.date}</Label><br/>
          <Label>Title</Label>
          <Input type="text" name="title" value={props.title} onChange={props.handleTitleChange} />
          <Label>Tag</Label>
          <ReactChipInput
            classes="class1 class2"
            chips={props.tags}
            onSubmit={value => props.handleTag(value)}
            onRemove={index => props.handleRemoveTag(index)}
          />
          <Label>Text</Label>
          <Input type="textarea" name="text" value={props.text} onChange={props.handleTextChange} />
          <Label>Add Image</Label>
          <br />
          <input type="file" accept="image/*" onChange={props.onDrop} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={props.handleSave}>Save</Button>{' '}
          <Button color="secondary" onClick={props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ModalComponent;

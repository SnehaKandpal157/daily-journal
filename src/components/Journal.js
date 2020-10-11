import React, { useState, useEffect } from 'react';
import { Button, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import localForage from "localforage";
import 'bootstrap/dist/css/bootstrap.min.css';
import _isEmpty from "lodash/isEmpty";
import ImageUploader from 'react-images-upload';
import SearchField from "react-search-field";
import ListJournal from "../components/ListJournals";
import ReactChipInput from "react-chip-input";

function Journal(props) {
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const toggle = () => setModal(!modal);

  useEffect(() => {
    if (searchTerm) {
      if(!_isEmpty(searchResult)){
        setDataList(searchResult)
      }
    }
    else {
      localForage.getItem("data", (_error, data) => {
        setDataList(data)
      })
    }
  }, [dataList, searchResult, searchTerm])
  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  const onDrop = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onloadend = () => {
      setImage(reader.result);
    }
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  const handleSave = (index) => {
    const newEntry = { title: title, tags: tags, text: text, imageUrl: image }
    setModal(!modal);
    localForage.getItem("data", (_error, data) => {
      if (data) {
        const updatedDataArray = data;
        if (selectedIndex !== "") {
          updatedDataArray.splice(selectedIndex, 1, newEntry)
        } else {
          updatedDataArray.push(newEntry);
        }
        localForage.setItem("data", updatedDataArray);
        setDataList(updatedDataArray);
      }
      else {
        localForage.setItem("data", [newEntry])
        setDataList([newEntry]);
      }
    })
    setTitle("");
    setText("");
    setTags([]);
    setImage([]);
    setSelectedIndex("");
  }

  const handleTag = (value) => {
    const chips = tags.slice();
    chips.push(value);
    setTags(chips);
  }

  const handleRemoveTag = (index) => {
    const chips = tags.slice();
    chips.splice(index, 1);
    setTags(chips);

  }

  const handleDelete = (index) => {
    const dataArray = dataList;
    dataArray.splice(index, 1);
    setDataList(dataArray);
    localForage.setItem("data", dataArray);
  }

  const handleEdit = (index) => {
    const selectedEntry = dataList[index];
    const { title, text, tags, imageUrl } = selectedEntry;
    setModal(true);
    setTitle(title);
    setText(text);
    setTags(tags);
    setImage(imageUrl);
    setSelectedIndex(index);
  }

  const handleSearch = (value, event) => {
    setSearchTerm(value)
    const searchResult = dataList.filter((data) => data.tags.some((tag) => tag === value))
    setSearchResult([...searchResult])
  }

  return (
    <div>
      <div className="img-wrap">
        <img style={{ height: "200px", width: "450px" }} src="https://momonthegoinholytoledo.files.wordpress.com/2016/11/dear-diary.png" alt="logo" />
        <Button color="danger" onClick={toggle}>ADD</Button>
        <Label>Search</Label>
        <SearchField
          placeholder="Search by tag name..."
          onChange={handleSearch}
          searchText={searchTerm}
          onEnter={handleSearch}
          classNames="test-class"
        />
      </div>
      <Modal scrollable isOpen={modal} toggle={toggle} className="modal-lg">
        <ModalHeader toggle={toggle}>Add New Entry</ModalHeader>
        <ModalBody>
          <Label>Title</Label>
          <Input type="text" name="title" value={title} onChange={handleTitleChange} />
          <Label>Tag</Label>
          <ReactChipInput
            classes="class1 class2"
            chips={tags}
            onSubmit={value => handleTag(value)}
            onRemove={index => handleRemoveTag(index)}
          />
          <Label>Title</Label>
          <Input type="textarea" name="text" value={text} onChange={handleTextChange} />
          <Label>Add Image</Label>
          {/* <ImageUploader
            withIcon={true}
            buttonText='Choose images'
            onChange={onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
            withPreview={true}
          /> */}
          <input type="file" accept="image/*" onChange={onDrop} />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>Save</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
      {!_isEmpty(dataList) ? (
        dataList.map((data, index) => {
          return (
            <ListJournal key={index} data={data} index={index} handleDelete={handleDelete} handleEdit={handleEdit} />
          )
        })
      ) : <div className="add-text-wrap"><p className="add-text">Add your first entry...</p> </div>}
    </div>
  )
}

export default Journal;

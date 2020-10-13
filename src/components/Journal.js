import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import localForage from "localforage";
import 'bootstrap/dist/css/bootstrap.min.css';
import _isEmpty from "lodash/isEmpty";
import SearchField from "react-search-field";
import DatePicker from 'react-date-picker';
import ListJournal from "../components/ListJournals";
import ModalComponent from "../components/Modal";

function Journal() {
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState([]);
  const [date, setDate] = useState(new Date().toDateString());
  const [dataList, setDataList] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const toggle = () => {
    setModal(!modal);
    setTitle("");
    setText("");
    setTags([]);
    setImage([]);
  }

  useEffect(() => {
    if (searchTerm ) {
      if (!_isEmpty(searchResult)) {
        setDataList(searchResult)
      }
    }
    else if(selectedDate){
      if (!_isEmpty(searchResult)) {
        setDataList(searchResult)
      }
    }
    else {
      localForage.getItem("data", (_error, data) => {
        setDataList(data)
      })
    }
  }, [dataList, searchResult, searchTerm, selectedDate])
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const handleTextChange = (e) => {
    setText(e.target.value);
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
  const handleSave = () => {
    const newEntry = { title: title, tags: tags, text: text, imageUrl: image, date: date }
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
    const { title, text, tags, imageUrl, date } = selectedEntry;
    setModal(true);
    setTitle(title);
    setText(text);
    setDate(date);
    setTags(tags);
    setImage(imageUrl);
    setSelectedIndex(index);
  }

  const handleSearch = (value, event) => {
    setSearchTerm(value)
    const searchResult = dataList.filter((data) => data.tags.some((tag) => tag === value))
    setSearchResult([...searchResult])
  }

  const onDateSelect = (selectedDate) => {
    setSelectedDate(selectedDate)
    const dateSearchResult = dataList.filter((data) => data.date === selectedDate.toDateString())
    setSearchResult([...dateSearchResult])
  }

  return (
    <div>
      <div className="img-wrap">
        <img className="logo-image" src="https://www.whoneedsnewspapers.org/images/ms/msnems_masthead.png" alt="logo" />
      </div>
      <ModalComponent modal={modal} title={title} date={date} text={text} toggle={toggle} image={image} tags={tags} handleTextChange={handleTextChange}
        handleTitleChange={handleTitleChange} handleTag={handleTag} handleRemoveTag={handleRemoveTag} onDrop={onDrop} handleSave={handleSave} />
      {!_isEmpty(dataList) ? (
        <div className="list-content-wrap">
          <div className="header-wrap">
            <div className="left-wrap">
              <i className="fa fa-plus-circle fa-2x" title="Add" onClick={toggle} aria-hidden="true"></i>
              <DatePicker
                onChange={onDateSelect}
                value={selectedDate}
                clearIcon={null}
              />
            </div>
            <div className="right-wrap">
            <SearchField
              placeholder="Search by tag name..."
              onChange={handleSearch}
              searchText={searchTerm}
              onEnter={handleSearch}
              onSearchClick={handleSearch}
              classNames="test-class"
            />
            </div>
          </div>
          <div className="list-outer-wrap">
            {dataList.map((data, index) => {
              return (
                <ListJournal key={index} data={data} date={date} index={index} handleDelete={handleDelete} handleEdit={handleEdit} />
              )
            })}
          </div>
        </div>
      ) : (
          <div className="add-text-wrap"><p className="add-text">Add your first entry...</p>
            <Button className="add-button" color="danger" onClick={toggle}>ADD</Button>
          </div>)
      }
    </div >
  )
}

export default Journal;

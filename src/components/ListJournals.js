import React from 'react';
import ReadMoreAndLess from 'react-read-more-less';
import _isEmpty from "lodash/isEmpty";

function ListJournals({ data, date, index, handleDelete, handleEdit }) {
  return (
    <div className="list-wrap">
      <div className="entry-wrap">
        <div className="top-wrap">
          <div className="date-wrap">
            <span className="date-display">{date}</span>
            <h3>{data.title}</h3>
          </div>
          <div className="button-wrap">
            <i className="fa fa-trash-o trash-icon fa-lg" title="Delete" onClick={() => handleDelete(index)}></i>
            <i className="fa fa-pencil fa-lg" title="Edit" aria-hidden="true" onClick={() => handleEdit(index)}></i>
          </div>
        </div>
        <div className="tags-wrap"> {data.tags.map((tag, index) => <li className="tag" key={index}>{tag}</li>)}</div>
        <div className="entry-content">
          {!_isEmpty(data.imageUrl) ? <img className="entry-image" src={data.imageUrl} alt="pic" /> : ""}
          <ReadMoreAndLess
            className="read-more-content"
            charLimit={250}
            readMoreText="Read more"
            readLessText="Read less"
          >
            {data.text}
          </ReadMoreAndLess>
        </div>
      </div>
    </div>
  )
}

export default ListJournals;

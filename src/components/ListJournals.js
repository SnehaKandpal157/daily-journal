import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import ReadMoreAndLess from 'react-read-more-less';

function ListJournals({ data, index, handleDelete, handleEdit }) {
  return (
    <div className="list-wrap">
      <div className="entry-wrap">
        <div className="top-wrap">
          <h3>{data.title}</h3>
          <div className="button-wrap">
            <Tooltip className="tooltip" title="Delete">
              <i className="fa fa-trash-o trash-icon fa-lg" onClick={() => handleDelete(index)}></i>
            </Tooltip>
            <Tooltip className="tooltip" title="Edit">
              <i className="fa fa-pencil fa-lg" aria-hidden="true" onClick={() => handleEdit(index)}></i>
            </Tooltip>

          </div>
        </div>
        <div className="tags-wrap"> {data.tags.map((tag, index) => <li className="tag" key={index}>{tag}</li>)}</div>
        <div className="entry-content">
          <img className="entry-image" src={data.imageUrl} alt="pic" />
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

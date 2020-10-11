import React from 'react'

function ListJournals({ data, index, handleDelete, handleEdit }) {
  return (
    <div className="list-wrap">
      <div className="entry-wrap">
        <div className="top-wrap">
          <h3>{data.title}</h3>
          <img className="entry-image" src={data.imageUrl} alt="pic" />
          <div className="button-wrap">
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </div>
        </div>
        <div className="tags-wrap"> {data.tags.map((tag, index) => <p key={index}>{tag}</p>)}</div>
        <p>{data.text}</p>
      </div>
    </div>
  )
}

export default ListJournals;

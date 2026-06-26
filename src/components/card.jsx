import React from 'react';

function Card(props) {
  return (
    <div className="card" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h3 className="card-header" style={{ backgroundColor: '#f4f6f9', padding: '15px', margin: 0, borderBottom: '1px solid #ddd' }}>
        {props.title}
      </h3>
      <div className="card-body" style={{ padding: '20px' }}>
        {props.children}
      </div>
    </div>
  );
}

export default Card;
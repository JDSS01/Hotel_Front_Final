import React from 'react';

function FormGroup(props) {
  return (
    <div className="form-group" style={{ marginBottom: '15px' }}>
      <label htmlFor={props.htmlFor} style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
        {props.label}
      </label>
      {props.children}
    </div>
  );
}

export default FormGroup;
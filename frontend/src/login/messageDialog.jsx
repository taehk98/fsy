// import React from 'react';

// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';

// export function MessageDialog(props) {
//   return (
//     <Modal {...props} show={props.message} centered>
//       <Modal.Body>{props.message}</Modal.Body>
//       <Modal.Footer>
//         <Button onClick={props.onHide}>Close</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

import React from 'react';

export function MessageDialog(props) {
  const { message, onHide } = props;

  return (
    <div className="modal" style={{ display: message ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-body">{message}</div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onHide}>Close</button>
        </div>
      </div>
    </div>
  );
}
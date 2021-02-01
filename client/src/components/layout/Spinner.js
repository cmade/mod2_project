import React, { Fragment } from 'react';
//Bring in spinner
import spinner from './spinner.gif';

const Spinner = () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: '500px', margin: 'auto', display: 'block' }}
      alt='Loading...'
    />
  </Fragment>
);

export default Spinner;

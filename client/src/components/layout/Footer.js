import React from 'react';
//Bring in link fromm the react router dom to link components
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='footer'>
      <p>
        {' '}
        Made with <i class='fas fa-heart'></i> by Clive
      </p>{' '}
    </footer>
  );
};

export default Footer;

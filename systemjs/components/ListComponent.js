import React, { PropTypes } from 'react';

const ListComponent = ({ children }) => (<div> <ul>{ children.map(child => <li>{child}</li>) } </ul> </div>);

ListComponent.propTypes = {
  children: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
};

export default ListComponent;

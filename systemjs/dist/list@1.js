System.register('components/ListComponent.js', ['react'], function (_export, _context) {
  "use strict";

  var React, PropTypes;
  return {
    setters: [function (_react) {
      React = _react.default;
      PropTypes = _react.PropTypes;
    }],
    execute: function () {

      const ListComponent = ({ children }) => React.createElement('div', null, ' ', React.createElement('ul', null, children.map(child => React.createElement('li', null, child)), ' '), ' ');

      ListComponent.propTypes = {
        children: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
      };

      _export('default', ListComponent);
    }
  };
});
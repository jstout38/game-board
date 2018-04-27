import React from 'react';

class CategorySquare extends React.Component {
    render() {
      return (
        <button className="cat-square" onClick={() => this.props.onClick()}>
          {this.props.value}
        </button>
      );
    }
}

export default CategorySquare;
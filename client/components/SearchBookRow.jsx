import React, { useState } from 'react';

class SearchBookRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
    };
    this.requestBook = this.requestBook.bind(this);
    this.handleClosePopup = this.handleClosePopup.bind(this);
  }

  requestBook = (e) => {
    // TODO: Implement your logic for requesting the book here    
  };

  handleClosePopup = (e) => {
    e.stopPropagation();
    this.setState({ showPopup: false }); // Close the popup
  };

  showBookDetails = (e) => {
    this.setState({ showPopup: true }); // Open the popup
  }

  render() {
    const { showPopup } = this.state;
    const { cover, title, author, isbn, genre, condition, availability, location, username, lend_or_borrow } = this.props;
    let isDisabled = this.props.user_id === this.props.userId;
    let buttonClass = isDisabled ? 'req-button-disabled' : 'req-button';

    return (
      <tr onClick={this.showBookDetails} style={{ cursor: 'pointer' }}>
        <td><img src={cover} height={58} width={38} /></td>
        <td>{title}</td>
        <td>{genre}</td>
        <td>{condition}</td>
        <td>{availability}</td>
        <td>{location}</td>
        <td>{lend_or_borrow}</td>
        <td>
          <center>
            <button type="button" className={buttonClass} onClick={this.requestBook} disabled={isDisabled}>Request</button>
          </center>
        </td>
        {showPopup && ( // Conditionally render the popup
          <Popup
            bookDetails={{ cover, title, author, isbn, genre, condition, availability, location, username, lend_or_borrow }}
            onClose={this.handleClosePopup}
          />
        )}
      </tr>
    );
  }
}

// Create a separate Popup component
function Popup({ bookDetails, onClose }) {
  const { cover, title, author, isbn, genre, condition, availability, location, username, lend_or_borrow } = bookDetails;

  return (
    <div className="popup">
      <div className="popup-content">
        <img src={cover} alt={title} />
        <div className="details">
          <h2>{title}</h2>
          <p>Author: {author}</p>
          <p>ISBN: {isbn}</p>
          <p>Genre: {genre}</p>
          <p>Condition: {condition}</p>
          <p>Availability: {availability}</p>
          <p>Location: {location}</p>
          <p>Lend or Borrow: {lend_or_borrow}</p>
          <p>Owner: {username}</p>
          <button className='req-button' onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default SearchBookRow;
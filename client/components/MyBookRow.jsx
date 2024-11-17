const React = require("react");

class MyBookRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canEdit: false,
      saveOrEdit: 'edit'
    };
  }
  deleteOldBook = () => {
    fetch(`/api/users/${this.props.userId}/books/${this.props.users_books_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + this.props.token
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return this.props.rerender();
      });
  };

  modifyOldBook = () => {
    fetch(`/api/users/${this.props.userId}/books/${this.props.users_books_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.props.token
      },
      body: JSON.stringify({ 
        condition: document.getElementById(`condition-${this.props.users_books_id}`).value,
        availability: document.getElementById(`availability-${this.props.users_books_id}`).value,
        lendOrBorrow: document.getElementById(`lend-or-borrow-${this.props.users_books_id}`).value,
      })
    })
      .then(response => {response.json()}) 
      .then((data) => {
        return this.props.rerender();
      });
  }

  editOrSaveBook = () => {
    if(this.state.canEdit) { //its save operation,  save and toggle  to edit mode
      this.setState({'saveOrEdit': 'edit', 'canEdit': false});
      this.modifyOldBook()
    } 
    else {//enable editing and saving option
      this.setState({'saveOrEdit': 'save', 'canEdit': true});
    }

  };

   render() {
    return (
      <div className="book-card">
        <img  src={this.props.cover} width={180} height={275} className="book-cover" />
        <div className="book-info">
          <h4 className="book-title">{this.props.title}</h4>
          <p>Author: {this.props.author}</p>
          <p>ISBN: {this.props.isbn}</p>
          <p className="book-genre">Genre: {this.props.genre}</p>
          <div>Lend or Borrow:
            <select className="add-book-form-dropdown" id={`lend-or-borrow-${this.props.users_books_id}`} name={`lend-or-borrow-${this.props.users_books_id}`} defaultValue={this.props.lend_or_borrow} disabled={!this.state.canEdit}>
              <option value="Lend">Lend</option>
              <option value="Borrow">Borrow</option>
            </select>
          </div>
          <div>Condition:
            <select className="add-book-form-dropdown" id={`condition-${this.props.users_books_id}`} name={`condition-${this.props.users_books_id}`} defaultValue={this.props.condition} disabled={!this.state.canEdit}>
              <option value="Like New">Like New</option>
              <option value="Fine">Fine</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div>Availability:
           <select className="add-book-form-dropdown" id={`availability-${this.props.users_books_id}`} name={`availability-${this.props.users_books_id}`} defaultValue={this.props.availability} disabled={!this.state.canEdit}>
             <option value="Available">Available</option>
             <option value="Not Available">Not Available</option>
           </select>
          </div>
        </div>
        <div className="book-actions">
          <div>
            <button type="button" className="req-button" onClick={this.editOrSaveBook}>{this.state.saveOrEdit}</button>
          </div>
          <div>
            <button type="button" className="req-button" onClick={this.deleteOldBook}>delete</button>
          </div>
        </div>
      </div>
    );
  }
}

export default MyBookRow;

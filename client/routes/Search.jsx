const React = require('react');
import SearchBookRow from '../components/SearchBookRow';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availiableBooks: [],
      limit: 5,
      offset: 0,
      totalBooks: 0,
      searchString: '',
      location: '',
      genre: '',
      availability: 'All'
    }
    this.searchBooks = this.searchBooks.bind(this);
    this.searchBooks();
  }

  searchBooks = () => {
    fetch(`/api/users_books?searchString=${this.state.searchString}&limit=${this.state.limit}&offset=${this.state.offset}&location=${this.state.location}&genre=${this.state.genre}&availability=${this.state.availability}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ availiableBooks: data.booksData, searchType: this.state.searchType, totalBooks: data.totalBooks})
    });
  }

  search = (e) => {
    if(e)
      e.preventDefault();
    this.changePage(0);
  }

  getPageNumber = () => {
    return Math.floor(this.state.offset / this.state.limit) + 1;
  }

  getPrevPageResults = (e) => {
    e.preventDefault();
    if(this.state.offset > 0)
      this.changePage(this.state.offset - this.state.limit);
  }

  getNextPageResults = (e) => {
    e.preventDefault();
    if((this.state.offset + this.state.limit) < this.state.totalBooks)
      this.changePage(this.state.offset + this.state.limit);
  }

  changePage = (offset) => {
    this.setState({ offset: offset }, () => {
      this.searchBooks();
    });
  }

  render() {
    let table;
    const rows = [];
    let header;
    if (this.state.totalBooks!=0> 0) {
      header = (
        <tr>
          <th key={0}>Cover</th>
          <th key={1}>Title</th>
          {/* <th key={2}>Author</th> */}
          {/* <th key={3}>ISBN</th> */}
          <th key={4}>Genre</th>
          <th key={5}>Condition</th>
          <th key={6}>Availability</th>
          <th key={7}>Location</th>
          <th key={8}>Lend or Borrow</th>
          {/* <th key={8}>Owner</th> */}
          <th key={9}></th>
        </tr>)
      for (let i = 0; i < this.state.availiableBooks.length; i++) {
        if (this.state.availiableBooks[i].username !== 'max') {
          rows.push(<SearchBookRow
            {...this.state.availiableBooks[i]}
            key={i}
            userId = {this.props.userId}
          />)
        }
      }
      table = <table className="result-table"><thead>{header}</thead><tbody>{rows}</tbody></table>
    }
    return (
      <div className="search-box">
        <form className="search-form">
          <div className="search-bar">
            <input type="text" className="search-bar-text" placeholder="search book by Title or Author" name="title" id="searchString" required onChange={(e) => this.setState({ searchString: e.target.value })}/>
            <input type="submit" value="search" onClick={this.search} />
          </div>
          <div className="search-filters">
            <div>Advanced Filters: </div>
            <select className="search-select" id="availability" name="availability" value={this.state.availability} onChange={(e) => this.setState({ availability: e.target.value })}>
              <option value="All">All</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
            <input className="search-filter-text" type="text" placeholder="filter by Genre" name="genre" id="genre" required onChange={(e) => this.setState({ genre: e.target.value })}/>
            <input className="search-filter-text" type="text" placeholder="filter by Location" name="location" id="location" required onChange={(e) => this.setState({ location: e.target.value })}/>
          </div>
        </form>
        <div className="result-box">
          {table}
          {this.state.totalBooks!=0 && <div className="pagination">
            {(this.state.offset > 0) && <button className="pagination-arrow left" onClick={this.getPrevPageResults}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>}
            <span className="page-number">{this.getPageNumber()}</span>
            {((this.state.offset + this.state.limit) < this.state.totalBooks) && <button className="pagination-arrow right" onClick={this.getNextPageResults}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>}
          </div>}
        </div>
      </div>
    )
  }
}

export default Search;
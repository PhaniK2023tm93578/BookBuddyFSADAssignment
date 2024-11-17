const React = require('react');
class Root extends React.Component {
  render() {
    return (
      <div className="landing-container">
      <div className="drawing">
        <img src="/bookshelf.png" alt="Image description" height="500px"/>
      </div>
      <div className="drawing-description">
        Discover new books, connect with fellow readers.
      </div>
    </div>
    )
  }
}

export default Root;
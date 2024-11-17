import React, { useState, useEffect } from 'react';
import MyBookRow from '../components/MyBookRow';

const MyPage = ({ userId, token, username }) => {
  const [myOldBooks, setMyOldBooks] = useState([]);
  const [isbn, setIsbn] = useState('');
  const [condition, setCondition] = useState('Like New');
  const [availability, setAvailability] = useState('Available');
  const [lendOrBorrow, setLendOrBorrow] = useState('Lend');
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/books`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch books. Please try again later.');
      }

      const data = await response.json();
      setMyOldBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books. Please try again later.');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [userId, token]);

  const handleAddBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/users/${userId}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isbn,
          condition,
          availability,
          lendOrBorrow,
          userId
        })
      });

      const data = await response.json();
      fetchBooks();
      setIsbn('');
      setCondition('Like New');
      setAvailability('Available');
      setLendOrBorrow('Lend');
      setError('');
    } catch (error) {
      console.error('Error adding book:', error);
      setError('Failed to add book. Please try again.');
    }
  };

  // return (
  //   <div className="my-page">
  //     <h2>My Books</h2>
  //     <div className="search-box">
  //       {error && <p style={{ color: 'red' }}>{error}</p>}
  //       <form className="add-book-form" onSubmit={handleAddBook}>
  //         <input type="text" placeholder="Add book by ISBN" name="isbn" id="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
  //         <select className="search-form-dropdown" id="condition" name="condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
  //           <option value="Like New">Like New</option>
  //           <option value="Fine">Fine</option>
  //           <option value="Very Good">Very Good</option>
  //           <option value="Good">Good</option>
  //           <option value="Fair">Fair</option>
  //           <option value="Poor">Poor</option>
  //         </select>
  //         <select className="search-form-dropdown" id="availability" name="availability" value={availability} onChange={(e) => setAvailability(e.target.value)}>
  //           <option value="Available">Available</option>
  //           <option value="Not Available">Not Available</option>
  //         </select>
  //         <select className="search-form-dropdown" id="lend-or-borrow" name="lend-or-borrow" value={lendOrBorrow} onChange={(e) => setLendOrBorrow(e.target.value)}>
  //           <option value="Lend">Lend</option>
  //           <option value="Borrow">Borrow</option>
  //         </select>
  //         <input type="submit" value="Add" />
  //       </form>
  //       <div className="result-box">
  //         <table class="result-table">
  //         <thead>
  //             <tr>
  //               <th>Cover</th>
  //               <th>Title</th>
  //               <th>Author</th>
  //               <th>ISBN</th>
  //               <th>Genre</th>
  //               <th>Condition</th>
  //               <th>Availability</th>
  //               <th>Lend Or Borrow</th>
  //               <th></th>
  //             </tr>
  //           </thead>
  //           <div className="book-list">
  //             <tbody>
  //               {myOldBooks.map((book, index) => (
  //                 <MyBookRow key={index} {...book} userId={userId} token={token} rerender={fetchBooks} />
  //               ))}
  //             </tbody>
  //           </div>
  //         </table>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="my-page">
      <h3>My Books: </h3>
      <div className="add-book-box">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="add-book-form" onSubmit={handleAddBook}>
          <input type="text" placeholder="Add book all the book details with just it's ISBN" name="isbn" id="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
          <select className="search-form-dropdown" id="condition" name="condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="Like New">Like New</option>
            <option value="Fine">Fine</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
          <select className="search-form-dropdown" id="availability" name="availability" value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
          <select className="search-form-dropdown" id="lend-or-borrow" name="lend-or-borrow" value={lendOrBorrow} onChange={(e) => setLendOrBorrow(e.target.value)}>
            <option value="Lend">Lend</option>
            <option value="Borrow">Borrow</option>
          </select>
          <input type="submit" className="req-button" value="Add" />
        </form>
        <div class="book-list">
          {myOldBooks.map((book, index) => (
            <MyBookRow key={index} {...book} userId={userId} token={token} rerender={fetchBooks} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
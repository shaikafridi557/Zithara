import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [currentPage, setCurrentPage] = useState(1);
  const recordPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/customers?page=${currentPage}&limit=${recordPerPage}&search=${searchTerm}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        setCustomers(response.data);
        setTotalPages(Math.ceil(response.headers['x-total-count'] / recordPerPage));
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
  
    fetchCustomers();
  }, [currentPage, searchTerm, sortBy, sortOrder, recordPerPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      try {
        const response = await axios.get(`http://localhost:5000/api/customers?page=${currentPage + 1}&limit=${recordPerPage}&search=${searchTerm}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    }
  };
  
  const handlePreviousPage = async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      try {
        const response = await axios.get(`http://localhost:5000/api/customers?page=${currentPage - 1}&limit=${recordPerPage}&search=${searchTerm}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    }
  };
  

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button key={i} className={currentPage === i ? 'active' : ''} onClick={() => goToPage(i)}>
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="App">
      <input type="text" placeholder="Search by name or location" value={searchTerm} onChange={handleSearch} style={{ marginBottom: '10px' }} />
      <div>
        <select value={sortBy} onChange={handleSortChange} style={{ marginRight: '10px' }}>
          <option value="created_at">Date</option>
          <option value="time">Time</option>
        </select>
        <select value={sortOrder} onChange={handleSortOrderChange}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', border: '1px solid #dddddd' }}>S.No</th>
            <th style={{ padding: '8px', border: '1px solid #dddddd' }}>Customer Name</th>
            <th style={{ padding: '8px', border: '1px solid #dddddd' }}>Age</th>
            <th style={{ padding: '8px', border: '1px solid #dddddd' }}>Phone</th>
            <th style={{ padding: '8px', border: '1px solid #dddddd' }}>Location</th>
            <th style={{ padding: '8px', border: '1px solid #dddddd' }}>Date</th>
            <th style={{ padding: '8px', border: '1px solid #dddddd' }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer.sno}>
              <td style={{ padding: '8px', border: '1px solid #dddddd' }}>{(currentPage - 1) * recordPerPage + index + 1}</td>
              <td style={{ padding: '8px', border: '1px solid #dddddd' }}>{customer.customer_name}</td>
              <td style={{ padding: '8px', border: '1px solid #dddddd' }}>{customer.age}</td>
              <td style={{ padding: '8px', border: '1px solid #dddddd' }}>{customer.phone}</td>
              <td style={{ padding: '8px', border: '1px solid #dddddd' }}>{customer.location}</td>
              <td style={{ padding: '8px', border: '1px solid #dddddd' }}>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td style={{ padding: '8px', border: '1px solid #dddddd' }}>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        {renderPageNumbers()}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewRules = () => {
  const [rules, setRules] = useState([]);     // All rules fetched from the server
  const [visibleRules, setVisibleRules] = useState([]); // Rules to display based on pagination
  const [entriesPerPage, setEntriesPerPage] = useState(5); // Number of rules per page
  const [currentPage, setCurrentPage] = useState(1); // Current page number

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:3000/rules');
        setRules(response.data);  // Set all rules
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };

    fetchRules();
  }, []);

  useEffect(() => {
    // Calculate which rules to display based on current page and entries per page
    const indexOfLastRule = currentPage * entriesPerPage;
    const indexOfFirstRule = indexOfLastRule - entriesPerPage;
    setVisibleRules(rules.slice(indexOfFirstRule, indexOfLastRule));
  }, [rules, currentPage, entriesPerPage]);

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));  // Update number of entries per page
    setCurrentPage(1);  // Reset to the first page whenever the number of entries changes
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(rules.length / entriesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h2>Saved Rules</h2>
      
      {/* Dropdown to select number of entries per page */}
      <label>Show Entries:</label>
      <select onChange={handleEntriesPerPageChange} value={entriesPerPage}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>

      <ul>
        {visibleRules.map(rule => (
          <li key={rule._id}>
            <p><strong>Rule String:</strong> {rule.ruleString}</p>
            <p><strong>AST:</strong> {JSON.stringify(rule.ast, null, 2)}</p>
            <p><strong>Created At (IST):</strong> {new Date(rule.createdAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}</p>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1} style={{marginRight : '10px'}}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(rules.length / entriesPerPage)} style={{marginLeft : '10px'}}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewRules;

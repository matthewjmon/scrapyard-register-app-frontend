import { useEffect, useState } from "react";
import { getRecords, deleteRecord, deleteAllRecords } from "../api";
import { Link } from "react-router-dom";
import "../Dashboard.css"; 

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // asc = oldest first, desc = newest first

  useEffect(() => {
    getRecords().then(setRecords);
  }, []);

  const normalizedSearch = search.toLowerCase().trim();

  const filtered = records
    .filter((r) => {
      const fullNames = (r.fullNames || "").toLowerCase();
      const identityNumber = (r.identityNumber || "").toString();
      const code = (r.code || "").toLowerCase();
      return (
        fullNames.includes(normalizedSearch) ||
        identityNumber.includes(normalizedSearch) ||
        code.includes(normalizedSearch)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteRecord(id);
      setRecords(records.filter((r) => r._id !== id));
    }
  };

  const handleDeleteAll = async () => {
    if (!records.length) return;

    if (window.confirm("Are you sure you want to delete all records?")) {
      try {
        await deleteAllRecords();
        setRecords([]); // clear table after successful deletion
        alert("All records deleted successfully.");
      } catch (err) {
        console.error("Failed to delete all records:", err);
        alert("Failed to delete all records. See console.");
      }
    }
  };



  return (
    <div className="container-fluid dashboard-container mt-5 mb-5 print-area dashboard-print">

      {/* SCREEN TITLE */}
      <h1 className="mb-4 no-print">Acquisition Register</h1>

      {/* SEARCH + ACTIONS ROW */}
      <div className="d-flex flex-wrap align-items-center mb-3 no-print justify-content-between gap-2">

        {/* Left side: search input */}
        <div className="flex-grow-1 min-w-search">
          <input
            type="text"
            placeholder="Search by name, ID or code"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            title="Type to search records" // tooltip for search input
            data-bs-toggle="tooltip"
          />
        </div>

        {/* Right side: action buttons */}
        <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0 align-items-center justify-content-end dashboard-actions">

          <Link
            to="/new"
            className="btn btn-dark d-flex align-items-center gap-1"
            title="Register a new record"
            data-bs-toggle="tooltip"
          >
            <i className="bi bi-plus-lg"></i> <span className="action-btn-text">New</span>
          </Link>

          <button
            className="btn btn-dark d-flex align-items-center gap-1"
            onClick={() => window.print()}
            title="Print the acquisition register"
            data-bs-toggle="tooltip"
          >
            <i className="bi bi-printer"></i> <span className="action-btn-text">Print</span>
          </button>
        </div>
      </div>

      <div className="d-flex align-items-center mb-2 no-print sort-wrapper mt-lg-5 mt-md-4 mt-sm-4">
        {/* Left: sort controls */}
        <div className="d-flex align-items-center sort-container">
          <label className="me-2 fw-semibold mb-0 sort-label" htmlFor="sortOrder">
            Sort by Date:
          </label>
          <select
            id="sortOrder"
            className="form-select w-auto sort-options"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            title="Select sorting order"
            data-bs-toggle="tooltip"
          >
            <option value="asc">Oldest First</option>
            <option value="desc">Newest First</option>
          </select>
        </div>

        {/* Delete All Button */}
        <div className="ms-auto delete-all-wrapper">
          <button
            className="btn btn-danger btn-sm delete-all-btn d-flex align-items-center gap-1"
            onClick={handleDeleteAll}
            title="Delete all records"
            data-bs-toggle="tooltip"
          >
            <i className="bi bi-trash3 me-1"></i>
            <span className="action-btn-text delete-all-text">Delete All</span>
          </button>
        </div>
      </div>


      {/* PRINT HEADER */}
      <div className="print-title">
        <h1>Acquisition Register</h1>
        <p>
          Official Record &nbsp;|&nbsp; Generated on{" "}
          {new Date().toLocaleDateString("en-ZA")}
        </p>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-sm register-table text-center">
          <thead className="table-light">
            <tr>
              <th className="col-code">Code</th>
              <th className="col-fullNames">Full Names</th>
              <th className="col-idNumber">ID Number</th>
              <th className="col-phone">Telephone</th>
              <th className="col-vehicle">Vehicle Reg</th>
              <th className="col-date">Date Created</th>
              <th className="col-actions no-print">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr className="no-print">
                <td colSpan="7" className="text-center">
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id} className="align-middle">
                  <td>{r.code}</td>
                  <td>{r.fullNames}</td>
                  <td>{r.identityNumber}</td>
                  <td>
                    {r.telephoneNumbers?.map((phone, index) => (
                      <div key={index}>
                        {r.telephoneNumbers.length > 1 && (
                          <span className="text-muted me-1">({index + 1})</span>
                        )}
                        {phone}
                      </div>
                    ))}
                  </td>
                  <td>{r.vehicleRegistration}</td>
                  <td>
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString("en-GB")
                      : ""}
                  </td>
                  <td className="no-print align-middle col-actions">
                    <div className="d-flex flex-wrap gap-1 gap-xl-2 justify-content-center">
                      <Link
                        to={`/records/${r._id}`}
                        className="btn btn-sm btn-outline-dark mb-1"
                        title="View record details"
                        data-bs-toggle="tooltip"
                      >
                        <i className="bi bi-eye me-lg-1"></i>
                        <span className="action-btn-text">View</span>
                      </Link>

                      <button
                        className="btn btn-sm btn-outline-dark mb-1"
                        onClick={() => handleDelete(r._id)}
                        title="Delete this record"
                        data-bs-toggle="tooltip"
                      >
                        <i className="bi bi-trash me-lg-1"></i>
                        <span className="action-btn-text">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

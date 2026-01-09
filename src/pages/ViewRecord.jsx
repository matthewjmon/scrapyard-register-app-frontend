import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecord, deleteRecord } from "../api";
import "../ViewRecord.css";

export default function ViewRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    getRecord(id).then(setRecord);
  }, [id]);

  if (!record) return <div className="container mt-5">Loading...</div>;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteRecord(id);
      navigate("/dashboard");
    }
  };

  const createdAtDate = new Date(record.createdAt);
  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(createdAtDate);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(createdAtDate);
  const formattedCreatedAt = `${datePart} at ${timePart}`;

  return (
    <div className="container mt-5 pb-5 print-area">
      {/* Screen Title */}
      <h2 className="mb-4 text-center no-print">View Registration Record</h2>

      <div className="record-wrapper mx-auto">
        {/* Back Button */}
        <div className="mb-2 no-print">
          <button
            className="btn btn-secondary d-flex align-items-center gap-2"
            onClick={() => navigate("/dashboard")}
            title="Return to dashboard"
            data-bs-toggle="tooltip"
          >
            <i className="bi bi-arrow-left"></i>
            Back to Dashboard
          </button>
        </div>

        {/* Card wrapper */}
        <div className="card shadow-sm p-4 no-print" style={{ maxWidth: "50rem", margin: "0 auto" }}>
          <div className="card-header bg-transparent border-0 pb-0"></div>

          {/* Screen view fields */}
          <div className="mb-3 border-bottom py-3">
            <p className="text-muted mb-1">Registration Code</p>
            <div>{record.code}</div>
          </div>

          <div className="mb-3 border-bottom py-3">
            <p className="text-muted mb-1">Full Names</p>
            <div>{record.fullNames}</div>
          </div>

          <div className="mb-3 border-bottom py-3">
            <p className="text-muted mb-1">Identification Number</p>
            <div>{record.identityNumber}</div>
          </div>

          <div className="mb-3 border-bottom py-3">
            <p className="text-muted">Verification Method</p>
            <div>{record.verificationMethod}</div>
          </div>

          {record.verificationMethod === "Other Official Document" && record.otherVerification && (
            <div className="mb-3 border-bottom py-3">
              <p className="text-muted mb-1">Other Verification</p>
              <div>{record.otherVerification}</div>
            </div>
          )}

          <div className="mb-3 border-bottom py-3">
            <p className="text-muted mb-1">Phone Number(s)</p>
            <div>{record.telephoneNumbers.join(", ")}</div>
          </div>

          <div className="mb-3 border-bottom py-3">
            <p className="text-muted mb-1">Vehicle Registration</p>
            <div>{record.vehicleRegistration}</div>
          </div>

          <div className="mb-3 border-bottom py-3">
            <p className="text-muted mb-1">Contact Address</p>
            <div>{record.contactAddress}</div>
          </div>

          {/* Other non-print fields */}
          <div className="mb-3 no-print border-bottom py-3">
            <p className="text-muted mb-1">Goods Description</p>
            <div>{record.goodsDescription || "N/A"}</div>
          </div>

          <div className="mb-3 no-print border-bottom py-3">
            <p className="text-muted mb-1">Additional Notes</p>
            <div>{record.additionalNotes || "N/A"}</div>
          </div>

          <div className="mb-4 border-bottom py-4 no-print">
            <p className="text-muted mb-1 d-flex align-items-center gap-2">
              <i className="bi bi-calendar"></i>
              Date of Registration
            </p>
            <div className="text-muted">{formattedCreatedAt}</div>
          </div>

          {/* Screen action buttons */}
          <div className="d-flex justify-content-between align-items-center no-print">
            <div className="d-flex gap-2">
              <button
                className="btn btn-dark"
                onClick={() => window.print()}
                title="Print this registration record"
                data-bs-toggle="tooltip"
              >
                <i className="bi bi-printer me-2"></i>
                Print Record
              </button>

              <button
                className="btn btn-outline-dark"
                onClick={() => navigate(`/edit/${id}`)}
                title="Edit this record"
                data-bs-toggle="tooltip"
              >
                <i className="bi bi-pencil me-2"></i>
                Edit
              </button>
            </div>

            <button
              className="btn btn-outline-danger"
              onClick={handleDelete}
              title="Delete this record"
              data-bs-toggle="tooltip"
            >
              <i className="bi bi-trash me-2"></i>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ===== Print-only View ===== */}
      <div className="view-print">
        <div className="print-title text-muted">Seller Registration Record</div>

        {/* Row 1: Code + Date */}
        <div className="row-2col">
          <div className="print-field left-field">
            <p className="text-muted">Registration Code</p>
            <div>{record.code}</div>
          </div>
          <div className="print-field">
            <p className="text-muted">Date of Registration</p>
            <div>{formattedCreatedAt}</div>
          </div>
        </div>

        {/* Full Names */}
        <div className="row-1col">
          <div className="print-field">
            <p className="text-muted">Full Names</p>
            <div>{record.fullNames}</div>
          </div>
        </div>

        {/* ID + Verification */}
        <div className="row-2col">
          <div className="print-field left-field">
            <p className="text-muted">Identification Number</p>
            <div>{record.identityNumber}</div>
          </div>
          <div className="print-field">
            <p className="text-muted">Verification Method</p>
            <div>{record.verificationMethod}</div>
          </div>
        </div>

        {/* Telephone + Vehicle */}
        <div className="row-2col">
          <div className="print-field left-field">
            <p className="text-muted">Phone Number(s)</p>
            <div>{record.telephoneNumbers.join(", ")}</div>
          </div>
          <div className="print-field">
            <p className="text-muted">Vehicle Registration</p>
            <div>{record.vehicleRegistration}</div>
          </div>
        </div>

        {/* Contact Address */}
        <div className="row-1col">
          <div className="print-field">
            <p className="text-muted">Contact Address</p>
            <div>{record.contactAddress}</div>
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="print-footer-row">
          <div className="print-footer-field">
            <div className="print-footer-line"></div>
            <div className="print-footer-label text-muted">Authorized Signature</div>
          </div>

          <div className="print-footer-field">
            <div className="print-footer-line"></div>
            <div className="print-footer-label text-muted">Date</div>
          </div>
        </div>

        <div className="system-info">
          This document was generated from the Acquisition Register System.<br />
          Printed on: {new Date().toLocaleString("en-GB")}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecord, updateRecord } from "../api";

export default function EditRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    getRecord(id).then(setRecord);
  }, [id]);

  if (!record) return <div className="container mt-5">Loading...</div>;

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "telephoneNumbers") {
      const phones = [...record.telephoneNumbers];
      phones[index] = value;
      setRecord({ ...record, telephoneNumbers: phones });
    } else {
      setRecord({ ...record, [name]: value });
    }
  };

  const addPhone = () => {
    setRecord({ ...record, telephoneNumbers: [...record.telephoneNumbers, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateRecord(id, record);
    navigate(`/records/${id}`);
  };

  const formattedCreatedAt = new Date(record.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  });

  return (
    <div className="container mt-5 pb-5">
      <h2 className="mb-4 text-center">Edit Registration</h2>

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm p-4" style={{ maxWidth: "50rem", margin: "0 auto" }}>
          {/* Code (disabled) */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Code (Auto-generated)</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                name="code"
                value={record.code}
                disabled
                title="This code is auto-generated"
                data-bs-toggle="tooltip"
              />
              <span className="input-group-text" title="Code cannot be edited" data-bs-toggle="tooltip">
                  <i className="bi bi-lock-fill"></i>
              </span>
            </div>
          </div>

          {/* Full Names */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Names</label>
            <input
              type="text"
              className="form-control"
              name="fullNames"
              value={record.fullNames}
              onChange={handleChange}
              required
              title="Enter the full name of the person"
              data-bs-toggle="tooltip"
            />
          </div>

          {/* ID Number */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Identification Number</label>
            <input
              type="text"
              className="form-control"
              name="identityNumber"
              value={record.identityNumber}
              onChange={handleChange}
              required
              title="Enter the ID number"
              data-bs-toggle="tooltip"
            />
          </div>

          {/* Verification Method */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Manner of Verification</label>
            <select
              className="form-select"
              name="verificationMethod"
              value={record.verificationMethod}
              onChange={handleChange}
              title="Select the verification method"
              data-bs-toggle="tooltip"
            >
              <option value="" disabled>Select method</option>
              <option value="ID Document">ID Document</option>
              <option value="Driver's License">Driver's License</option>
              <option value="Passport">Passport</option>
              <option value="Other Official Document">Other Official Document</option>
            </select>
          </div>

          {/* Conditional Other Verification */}
          {record.verificationMethod === "Other Official Document" && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Other Verification</label>
              <input
                type="text"
                className="form-control"
                name="otherVerification"
                value={record.otherVerification}
                onChange={handleChange}
                title="Specify the other verification method"
                data-bs-toggle="tooltip"
              />
            </div>
          )}

          {/* Telephone Numbers */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Telephone Number(s)</label>
            {record.telephoneNumbers.map((phone, i) => (
              <input
                type="text"
                className="form-control mb-2"
                key={i}
                name="telephoneNumbers"
                value={phone}
                onChange={(e) => handleChange(e, i)}
                title={`Telephone number #${i + 1}`}
                data-bs-toggle="tooltip"
              />
            ))}
            <button
              type="button"
              className="btn btn-secondary text-white btn-sm"
              onClick={addPhone}
              title="Add a new telephone number"
              data-bs-toggle="tooltip"
            >
              <i className="bi bi-plus me-1"></i>
              Add Phone
            </button>
          </div>

          {/* Vehicle Registration */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Vehicle Registration</label>
            <input
              type="text"
              className="form-control"
              name="vehicleRegistration"
              value={record.vehicleRegistration}
              onChange={handleChange}
              title="Enter the vehicle registration number"
              data-bs-toggle="tooltip"
            />
          </div>

          {/* Contact Address */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Contact Address</label>
            <textarea
              className="form-control"
              name="contactAddress"
              value={record.contactAddress}
              onChange={handleChange}
              title="Enter the contact address"
              data-bs-toggle="tooltip"
            />
          </div>

          {/* Goods Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Goods Description (Optional)</label>
            <textarea
              className="form-control"
              name="goodsDescription"
              value={record.goodsDescription}
              onChange={handleChange}
              title="Describe the goods"
              data-bs-toggle="tooltip"
            />
          </div>

          {/* Additional Notes */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Additional Notes (Optional)</label>
            <textarea
              className="form-control"
              name="additionalNotes"
              value={record.additionalNotes}
              onChange={handleChange}
              title="Any extra notes"
              data-bs-toggle="tooltip"
            />
          </div>

          {/* Record Created (disabled) */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Record Created</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={formattedCreatedAt}
                disabled
                title="Date when this record was created"
                data-bs-toggle="tooltip"
              />
              <span className="input-group-text" title="Cannot be edited" data-bs-toggle="tooltip">
                    <i className="bi bi-lock-fill"></i>
                </span>
            </div>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="d-flex">
            <button
              type="submit"
              className="btn btn-dark me-2"
              title="Save all changes made to this record"
              data-bs-toggle="tooltip"
            >
              <i className="bi bi-save me-2"></i>
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/records/${id}`)}
              title="Cancel editing and return"
              data-bs-toggle="tooltip"
            >
              <i className="bi bi-x-lg me-2"></i>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

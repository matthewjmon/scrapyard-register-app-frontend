import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRecord, getNextCode } from "../api";

export default function NewRecord() {
  const navigate = useNavigate();

  const [record, setRecord] = useState({
    code: "",
    fullNames: "",
    identityNumber: "",
    verificationMethod: "",
    otherVerification: "",
    telephoneNumbers: [""],
    vehicleRegistration: "",
    contactAddress: "",
    goodsDescription: "",
    additionalNotes: ""
  });

  const [loadingCode, setLoadingCode] = useState(true);

  // Fetch next sequential code from backend
  useEffect(() => {
    getNextCode()
      .then((data) => setRecord((prev) => ({ ...prev, code: data.code })))
      .finally(() => setLoadingCode(false));
  }, []);

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
    const saved = await createRecord(record);
    navigate(`/records/${saved._id}`);
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">New Registration</h2>

      <div className="card shadow-sm p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          {/* Auto-generated Code */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Code (Auto-generated)</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                name="code"
                value={record.code}
                disabled
                placeholder="Generating code..."
              />
              <span className="input-group-text">
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
              placeholder="Enter full names"
              required
            />
          </div>

          {/* ID Number */}
          <div className="mb-3">
            <label className="form-label fw-semibold">ID Number</label>
            <input
              type="text"
              className="form-control"
              name="identityNumber"
              value={record.identityNumber}
              onChange={handleChange}
              placeholder="Enter ID number"
              required
            />
          </div>

          {/* Verification Method */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Manner of Identity Verification</label>
            <select
              className="form-select"
              name="verificationMethod"
              value={record.verificationMethod}
              onChange={handleChange}
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
              <label className="form-label fw-semibold">Specify Other Document</label>
              <input
                type="text"
                className="form-control"
                name="otherVerification"
                value={record.otherVerification}
                onChange={handleChange}
                placeholder="Specify the document"
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
                placeholder="Enter phone number"
              />
            ))}
            <button
              type="button"
              className="btn btn-secondary text-white btn-sm"
              onClick={addPhone}
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
              placeholder="Enter vehicle registration"
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
              placeholder="Enter contact address"
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
              placeholder="Describe the goods"
            />
          </div>

          {/* Additional Notes */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Additional Notes (Optional)</label>
            <textarea
              className="form-control"
              name="additionalNotes"
              value={record.additionalNotes}
              onChange={handleChange}
              placeholder="Any additional notes"
            />
          </div>

          {/* Buttons: Save and Cancel */}
          <div className="d-flex">
            <button
              type="submit"
              className="btn btn-success me-2"
              disabled={loadingCode}
            >
              <i class="bi bi-save me-2"></i>
              {loadingCode ? "Generating Code..." : "Save Registration"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              <i class="bi bi-x-lg me-2"></i>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

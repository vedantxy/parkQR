import React, { useState } from 'react';

const VisitorForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    flatNumber: '',
    isPriority: false
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    if (!formData.flatNumber) newErrors.flatNumber = 'Flat number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="ai-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Full Name</label>
        <input 
          type="text" 
          name="name" 
          className="form-input"
          placeholder="e.g. Rahul Sharma"
          value={formData.name} 
          onChange={handleChange} 
        />
        {errors.name && <span className="error-msg">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label>Phone Number</label>
        <input 
          type="text" 
          name="phone" 
          className="form-input"
          placeholder="10-digit mobile"
          value={formData.phone} 
          onChange={handleChange} 
        />
        {errors.phone && <span className="error-msg">{errors.phone}</span>}
      </div>

      <div className="form-field">
        <label>Vehicle Number</label>
        <input 
          type="text" 
          name="vehicle" 
          className="form-input"
          placeholder="MH 12 AB 1234"
          value={formData.vehicle} 
          onChange={handleChange} 
        />
      </div>

      <div className="form-field">
        <label>Flat Number</label>
        <input 
          type="text" 
          name="flatNumber" 
          className="form-input"
          placeholder="e.g. A-402"
          value={formData.flatNumber} 
          onChange={handleChange} 
        />
        {errors.flatNumber && <span className="error-msg">{errors.flatNumber}</span>}
      </div>

      <div className="form-field">
        <label className="checkbox-group">
          <input 
            type="checkbox" 
            name="isPriority" 
            checked={formData.isPriority} 
            onChange={handleChange} 
          />
          Priority Access (Fast Track)
        </label>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Processing...' : 'Generate AI Pass'}
      </button>
    </form>
  );

};

export default VisitorForm;

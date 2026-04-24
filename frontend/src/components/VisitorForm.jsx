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
    <form className="visitor-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Visitor Name</label>
        <input 
          type="text" 
          name="name" 
          placeholder="e.g. Rahul Sharma"
          value={formData.name} 
          onChange={handleChange} 
        />
        {errors.name && <span className="error-msg">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input 
          type="text" 
          name="phone" 
          placeholder="10-digit mobile"
          value={formData.phone} 
          onChange={handleChange} 
        />
        {errors.phone && <span className="error-msg">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label>Vehicle Number (Optional)</label>
        <input 
          type="text" 
          name="vehicle" 
          placeholder="e.g. MH 12 AB 1234"
          value={formData.vehicle} 
          onChange={handleChange} 
        />
      </div>

      <div className="form-group">
        <label>Flat Number</label>
        <input 
          type="text" 
          name="flatNumber" 
          placeholder="e.g. A-402"
          value={formData.flatNumber} 
          onChange={handleChange} 
        />
        {errors.flatNumber && <span className="error-msg">{errors.flatNumber}</span>}
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input 
            type="checkbox" 
            name="isPriority" 
            checked={formData.isPriority} 
            onChange={handleChange} 
          />
          Priority Visitor (Elderly/Delivery)
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Generating Pass...' : 'Generate Entry Pass'}
      </button>
    </form>
  );
};

export default VisitorForm;

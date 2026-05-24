import React, { useState, useEffect } from 'react';
import type { User, UserAddress, UserCompany } from '../services/api';
import Modal from './Modal';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Omit<User, 'id'>) => void;
  user: User | null;
  isLoading: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
}) => {
  // Fields state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [role, setRole] = useState('user');
  const [image, setImage] = useState('');
  
  // Address info
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  // Company info
  const [companyName, setCompanyName] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Reset or pre-fill form
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAge(user.age || '');
      setGender(user.gender || 'male');
      setRole(user.role || 'user');
      setImage(user.image || '');
      setAddressLine(user.address?.address || '');
      setCity(user.address?.city || '');
      setState(user.address?.state || '');
      setCountry(user.address?.country || '');
      setCompanyName(user.company?.name || '');
      setDepartment(user.company?.department || '');
      setTitle(user.company?.title || '');
      setErrors({});
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAge('');
      setGender('male');
      setRole('user');
      setImage('');
      setAddressLine('');
      setCity('');
      setState('');
      setCountry('');
      setCompanyName('');
      setDepartment('');
      setTitle('');
      setErrors({});
    }
  }, [user, isOpen]);

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    
    if (!firstName.trim()) tempErrors.firstName = 'First name is required';
    if (!lastName.trim()) tempErrors.lastName = 'Last name is required';
    
    // Email checking
    if (!email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please provide a valid email format';
    }
    
    if (!phone.trim()) tempErrors.phone = 'Phone number is required';
    
    if (age === '') {
      tempErrors.age = 'Age is required';
    } else if (isNaN(Number(age)) || Number(age) <= 0) {
      tempErrors.age = 'Age must be a valid positive number';
    }

    if (!addressLine.trim()) tempErrors.addressLine = 'Address line is required';
    if (!city.trim()) tempErrors.city = 'City is required';
    if (!state.trim()) tempErrors.state = 'State is required';
    if (!country.trim()) tempErrors.country = 'Country is required';

    if (!companyName.trim()) tempErrors.companyName = 'Company name is required';
    if (!department.trim()) tempErrors.department = 'Department is required';
    if (!title.trim()) tempErrors.title = 'Title is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const addressObj: UserAddress = {
        address: addressLine,
        city,
        state,
        country,
      };

      const companyObj: UserCompany = {
        name: companyName,
        department,
        title,
      };

      const userPayload: Omit<User, 'id'> = {
        firstName,
        lastName,
        email,
        phone,
        age: Number(age),
        gender,
        role,
        image: image.trim() || undefined,
        address: addressObj,
        company: companyObj,
        birthDate: user?.birthDate || new Date().toISOString().split('T')[0],
        university: user?.university || 'University of Life',
      };

      onSubmit(userPayload);
    }
  };

  const footer = (
    <>
      <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
        Cancel
      </button>
      <button className="btn btn-primary" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Saving...' : user ? 'Save Changes' : 'Create User'}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit Employee Record' : 'Add New Employee'}
      footer={footer}
      size="lg"
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Basic Information Section */}
        <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 8, marginBottom: 16, fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase' }}>
          1. Basic Information
        </h4>
        <div className="form-grid" style={{ marginBottom: 24 }}>
          <div className="form-group">
            <label className="form-label required">First Name</label>
            <input
              type="text"
              className={`form-control ${errors.firstName ? 'error' : ''}`}
              placeholder="e.g. John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
            />
            {errors.firstName && <span className="form-error-msg">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Last Name</label>
            <input
              type="text"
              className={`form-control ${errors.lastName ? 'error' : ''}`}
              placeholder="e.g. Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
            />
            {errors.lastName && <span className="form-error-msg">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Email Address</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              placeholder="e.g. johndoe@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {errors.email && <span className="form-error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Phone Number</label>
            <input
              type="tel"
              className={`form-control ${errors.phone ? 'error' : ''}`}
              placeholder="e.g. +1 (555) 019-2834"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
            {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Age</label>
            <input
              type="number"
              className={`form-control ${errors.age ? 'error' : ''}`}
              placeholder="e.g. 28"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={isLoading}
            />
            {errors.age && <span className="form-error-msg">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Gender</label>
            <select
              className="form-control"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              disabled={isLoading}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">Corporate Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
            >
              <option value="user">User</option>
              <option value="admin">Administrator</option>
              <option value="moderator">Moderator</option>
              <option value="manager">Manager</option>
              <option value="analyst">Analyst</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Profile Image URL (Optional)</label>
            <input
              type="url"
              className="form-control"
              placeholder="e.g. https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Address Information Section */}
        <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 8, marginBottom: 16, fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase' }}>
          2. Address Location
        </h4>
        <div className="form-grid" style={{ marginBottom: 24 }}>
          <div className="form-group full-width">
            <label className="form-label required">Street Address Line</label>
            <input
              type="text"
              className={`form-control ${errors.addressLine ? 'error' : ''}`}
              placeholder="e.g. 128 Corporate Parkway Suite B"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              disabled={isLoading}
            />
            {errors.addressLine && <span className="form-error-msg">{errors.addressLine}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">City</label>
            <input
              type="text"
              className={`form-control ${errors.city ? 'error' : ''}`}
              placeholder="e.g. San Francisco"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isLoading}
            />
            {errors.city && <span className="form-error-msg">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">State / Province</label>
            <input
              type="text"
              className={`form-control ${errors.state ? 'error' : ''}`}
              placeholder="e.g. California"
              value={state}
              onChange={(e) => setState(e.target.value)}
              disabled={isLoading}
            />
            {errors.state && <span className="form-error-msg">{errors.state}</span>}
          </div>

          <div className="form-group full-width">
            <label className="form-label required">Country</label>
            <input
              type="text"
              className={`form-control ${errors.country ? 'error' : ''}`}
              placeholder="e.g. United States"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={isLoading}
            />
            {errors.country && <span className="form-error-msg">{errors.country}</span>}
          </div>
        </div>

        {/* Company Placement Section */}
        <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 8, marginBottom: 16, fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase' }}>
          3. Corporate Information
        </h4>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label required">Company Name</label>
            <input
              type="text"
              className={`form-control ${errors.companyName ? 'error' : ''}`}
              placeholder="e.g. TechCorp Solutions"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isLoading}
            />
            {errors.companyName && <span className="form-error-msg">{errors.companyName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label required">Department</label>
            <input
              type="text"
              className={`form-control ${errors.department ? 'error' : ''}`}
              placeholder="e.g. Engineering"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={isLoading}
            />
            {errors.department && <span className="form-error-msg">{errors.department}</span>}
          </div>

          <div className="form-group full-width">
            <label className="form-label required">Job Title</label>
            <input
              type="text"
              className={`form-control ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Senior Frontend Software Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
            {errors.title && <span className="form-error-msg">{errors.title}</span>}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const mockFetchCustomer = async (id) => {
  // Simulate fetching customer data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
      });
    }, 500);
  });
};

const mockCreateCustomer = async (data) => {
  // Simulate creating a customer
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: Math.floor(Math.random() * 1000), ...data });
    }, 500);
  });
};

export default function CustomerProfile() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (customerId) {
      setLoading(true);
      mockFetchCustomer(customerId)
        .then((data) => setCustomer(data))
        .catch(() => setError('Failed to load customer'))
        .finally(() => setLoading(false));
    }
  }, [customerId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const newCustomer = await mockCreateCustomer(form);
      navigate(`/profile/${newCustomer.id}`);
    } catch {
      setError('Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (customerId && customer) {
    return (
      <div>
        <h2>Customer Profile</h2>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <button onClick={() => alert('Visit registered!')}>Register Visit</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Create Customer Profile</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label>Name: <input name="name" value={form.name} onChange={handleChange} required /></label>
        </div>
        <div>
          <label>Email: <input name="email" value={form.email} onChange={handleChange} required type="email" /></label>
        </div>
        <div>
          <label>Phone: <input name="phone" value={form.phone} onChange={handleChange} required /></label>
        </div>
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}

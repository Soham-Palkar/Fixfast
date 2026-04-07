const test = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullName: "Test User 5",
        email: "testuser5@example.com",
        phone: "1234567890",
        city: "Test City",
        pincode: "123456",
        address: "Test Address",
        password: "password123"
      })
    });
    
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Data:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

test();

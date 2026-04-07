const test = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "testuser5@example.com",
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

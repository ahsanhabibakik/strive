// Test script to verify the contact API is working
async function testContactAPI() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message to verify the contact form is working properly.',
    projectType: 'website',
    budget: '$500 - $1,000',
    timeline: '2-4 weeks'
  };

  try {
    console.log('Testing Contact API...');
    console.log('Sending test data:', testData);
    
    const response = await fetch('http://localhost:3003/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    
    const result = await response.json();
    console.log('Response data:', result);

    if (response.ok) {
      console.log('✅ SUCCESS: Contact API is working!');
      console.log('Service used:', result.service);
      console.log('Message:', result.message);
    } else {
      console.log('❌ ERROR: API returned error');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
  }
}

// Test simple form (without project details)
async function testSimpleContactAPI() {
  const testData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hi! I have a quick question about your services. Can you help me understand your pricing structure?'
  };

  try {
    console.log('\nTesting Simple Contact API...');
    console.log('Sending simple form data:', testData);
    
    const response = await fetch('http://localhost:3003/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    
    const result = await response.json();
    console.log('Response data:', result);

    if (response.ok) {
      console.log('✅ SUCCESS: Simple Contact API is working!');
      console.log('Service used:', result.service);
      console.log('Message:', result.message);
    } else {
      console.log('❌ ERROR: API returned error');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
  }
}

// Run both tests
testContactAPI();
testSimpleContactAPI();

// Simple test script to verify the API endpoint
const https = require('https');
const http = require('http');

const testData = {
  departureIata: "JFK",
  arrivalIata: "LAX",
  departureTimestamp: Date.now()
};

function testAPI() {
  const postData = JSON.stringify(testData);
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/recommendation',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        const result = JSON.parse(data);
        console.log('✅ API Test Successful!');
        console.log('Recommendation:', result.recommendation);
        console.log('Reason:', result.reason);
        console.log('Flight Path Points:', result.flightPath.length);
      } else {
        console.log('❌ API Test Failed:', res.statusCode);
        console.log('Error:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ API Test Failed:', error.message);
  });

  req.write(postData);
  req.end();
}

// Wait a bit for the server to start, then test
setTimeout(testAPI, 3000); 
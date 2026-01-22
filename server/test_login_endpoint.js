const fetch = require('node-fetch'); // Needs node-fetch or use built-in fetch in Node 18+

const testLogin = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@shoply.com', password: 'admin' })
        });

        const status = response.status;
        const data = await response.json();

        console.log('Status:', status);
        console.log('Body:', JSON.stringify(data, null, 2));

        if (status === 200 && data.token) {
            console.log('SUCCESS: Login worked and returned token.');
        } else {
            console.log('FAILURE: Login failed.');
        }
    } catch (error) {
        console.error('ERROR: Could not connect to server.', error);
    }
};

testLogin();

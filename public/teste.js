const data = {
  gender : 'Male',
  weight: 80,
  height: 180,
  neck: 40,
  waist: 90,
  // hip: 90,
};

fetch('http://localhost:3000/body-fat-percentage', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
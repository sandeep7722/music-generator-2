function generateMusic() {
    const modelVersion = document.getElementById('modelVersion').value;
    const prompt = document.getElementById('prompt').value;
    const inputAudio = document.getElementById('inputAudio').files[0];

    const formData = new FormData();
    formData.append('model_version', modelVersion);
    formData.append('prompt', prompt);
    formData.append('input_audio', inputAudio);

    fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': 'Token r8_Vdzl2SE8fN2qJuOczQjXZZUq5jm4cMx4LM4lO'
        }
    })
    .then(response => response.json())
    .then(data => {
        const statusDiv = document.getElementById('status');
        const outputDiv = document.getElementById('output');
        
        statusDiv.innerHTML = `Status: ${data.status}`;
        
        if (data.status === 'succeeded') {
            outputDiv.innerHTML = `Output: ${data.output}`;
        } else {
            // Start polling to check status
            pollStatus(data.id);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function pollStatus(predictionId) {
    fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Token r8_Vdzl2SE8fN2qJuOczQjXZZUq5jm4cMx4LM4lO'
        }
    })
    .then(response => response.json())
    .then(data => {
        const statusDiv = document.getElementById('status');
        const outputDiv = document.getElementById('output');
        
        statusDiv.innerHTML = `Status: ${data.status}`;
        
        if (data.status === 'succeeded') {
            outputDiv.innerHTML = `Output: ${data.output}`;
        } else if (data.status === 'failed') {
            statusDiv.innerHTML = 'Status: Prediction failed';
        } else {
            // If not succeeded or failed, continue polling
            setTimeout(() => pollStatus(predictionId), 2000); // Poll every 2 seconds (adjust as needed)
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

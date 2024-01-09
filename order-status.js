document.addEventListener('DOMContentLoaded', function () {
    const apiBaseURL = 'https://goldcenturion.com/api/v2';
    const apiKey = 'hDBqDFR3V0VutQQpHJES8F3drjVXpjiNvtazGAAFWyu1WByhwUcIA95ww745';
    const statusBtn = document.getElementById('check-status-btn');
    const orderNumberInput = document.getElementById('order-number-input');
    const statusResultDiv = document.getElementById('order-status-result');

    statusBtn.addEventListener('click', function() {
        const orderId = orderNumberInput.value;
        if (orderId) {
            checkOrderStatus(orderId);
        } else {
            alert('Please enter an order number.');
        }
    });

    function checkOrderStatus(orderId) {
        fetch(`${apiBaseURL}?action=status&order=${orderId}&key=${apiKey}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                updateStatusDisplay(data);
            } else {
                throw new Error('Failed to retrieve order status');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while checking the order status.');
        });
    }

    function updateStatusDisplay(data) {
        // Display the status and progress bar
        statusResultDiv.innerHTML = `
            <p>Status: ${data.status}</p>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${calculateProgress(data)}%;"></div>
            </div>
        `;
    }

    function calculateProgress(data) {
        // Calculate progress based on the data. This is a placeholder logic.
        if (data.status === 'Completed') {
            return 100;
        } else if (data.status === 'In progress') {
            return (data.start_count / data.max) * 100;
        } else {
            return 0;
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const followerSlider = document.getElementById('follower-range');
    const followerAmountDisplay = document.getElementById('follower-amount');
    const totalCostDisplay = document.getElementById('total-cost');
    const orderNumberDisplay = document.getElementById('order-number');
    const progressCircle = document.getElementById('progress-circle');

    const apiBaseURL = 'https://goldcenturion.com/api/v2';
    const apiKey = 'hDBqDFR3V0VutQQpHJES8F3drjVXpjiNvtazGAAFWyu1WByhwUcIA95ww745';
    const serviceId = 14; // Updated service ID
    const pricePerThousand = 3; // Price per thousand followers

    function updateCost() {
        let followers = parseInt(followerSlider.value, 10);
        let totalCost = (followers / 1000) * pricePerThousand;
        followerAmountDisplay.textContent = followers;
        totalCostDisplay.textContent = totalCost.toFixed(2);
    }

    followerSlider.addEventListener('input', updateCost);

    document.getElementById('orderForm').addEventListener('submit', function(event) {
        event.preventDefault();
        let link = document.getElementById('link').value;
        let quantity = parseInt(followerSlider.value, 10);
        let totalPrice = (quantity / 1000) * pricePerThousand;

        if (confirm(`Confirm order of ${quantity} followers for $${totalPrice.toFixed(2)}?`)) {
            createOrder(serviceId, link, quantity);
        }
    });

    function createOrder(service, link, quantity) {
        fetch(`${apiBaseURL}?action=add&service=${service}&link=${link}&quantity=${quantity}&key=${apiKey}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.order) {
                orderNumberDisplay.textContent = `Order Number: ${data.order}`;
                checkOrderStatus(data.order);
            } else {
                throw new Error('Order creation failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while creating the order. Please check the console for details.');
        });
    }

    function checkOrderStatus(orderId) {
        fetch(`${apiBaseURL}?action=status&order=${orderId}&key=${apiKey}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                updateProgressCircle(data);
            } else {
                throw new Error('Failed to retrieve order status');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while checking the order status.');
        });
    }

    function updateProgressCircle(data) {
        const progressPercentage = calculateProgressPercentage(data);
        progressCircle.style.background = `conic-gradient(green ${progressPercentage}%, lightgray ${progressPercentage}% 100%)`;
        progressCircle.textContent = `${data.status} (${progressPercentage}%)`;
    }

    function calculateProgressPercentage(data) {
        if (data.status === 'Completed') {
            return 100;
        } else if (data.status === 'In progress') {
            return (data.start_count / data.max) * 100; // Adjust this logic based on your data structure
        } else {
            return 0; // Default for other statuses
        }
    }

    updateCost(); // Initial cost update
});

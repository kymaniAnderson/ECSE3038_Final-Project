var ctx = document.getElementById('chart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Patient Temperature',
            data: [55, 57, 55, 56, 60, 61, 65, 66, 67, 67, 67, 64, 62, 59],
            fill: true,
            borderColor: '#6048CC',
            backgroundColor: '#6048CC1A',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return value + '°';
                    }
                }
            }
        }
    }
});

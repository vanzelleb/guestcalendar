document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('temperatureChart').getContext('2d');
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Air Temperature (°C)',
        data: [12, 13, 15, 17, 20, 24, 27, 27, 25, 21, 16, 13],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Water Temperature (°C)',
        data: [14, 14, 15, 16, 18, 21, 24, 25, 24, 22, 19, 16],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
  };

  new Chart(ctx, {
    type: 'line',
    data: data,
    options: options,
  });
});

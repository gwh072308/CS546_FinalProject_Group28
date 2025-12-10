// public/js/stats.js

$(document).ready(function() {
    const boroughCanvas = document.getElementById('boroughBarChart');
    const monthlyCanvas = document.getElementById('monthlyLineChart');

    // only run on the stats page
    if (!boroughCanvas && !monthlyCanvas) return;

    // we can later fetch live data with AJAX
    // for now, we use the same sample structure from stats.js
    const boroughLabels = ['BROOKLYN', 'MANHATTAN', 'BRONX', 'QUEENS', 'STATEN ISLAND'];
    const boroughCounts = [18540, 14210, 11875, 9250, 2355];

    if (boroughCanvas) {
        new Chart(boroughCanvas.getContext('2d'), {
          type: 'bar',
          data: {
            labels: boroughLabels,
            datasets: [
              {
                label: 'Arrests',
                data: boroughCounts,
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Arrests by Borough (Sample)'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    
      if (monthlyCanvas) {
        new Chart(monthlyCanvas.getContext('2d'), {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Arrests',
                data: [3200, 2950, 4100, 3800, 3650, 3900],
                fill: false,
                tension: 0.3,
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Monthly Arrest Trend (Sample)'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
});
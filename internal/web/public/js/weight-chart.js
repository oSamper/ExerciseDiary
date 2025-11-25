var wChart = null;

function splitWeight(weight, show) {
  var dates = [];
  var ws = [];

  weight = weight.slice(show)
  let arrayLength = weight.length;
  for (let i = 0; i < arrayLength; i++) {
    dates.push(weight[i].Date);
    ws.push(weight[i].Weight);
  }
  // console.log('LDATA =', dates, ws);
  return { dates, ws };
};

function weightChart(id, dates, ws, wcolor, xticks, rates) {

  const ctx = document.getElementById(id);

  if (wChart) {
    wChart.clear();
    wChart.destroy();
  };

  let datasets = [{
    label: 'Weight',
    data: ws,
    borderColor: wcolor,
    borderWidth: 1,
    yAxisID: 'y'
  }];

  if (rates && rates.length > 0) {
    datasets.push({
      label: 'Rate',
      type: 'line',
      data: rates,
      borderColor: '#ffce56',
      backgroundColor: '#ffce56',
      borderWidth: 2,
      pointStyle: 'star',
      pointRadius: 10,
      pointHoverRadius: 12,
      fill: false,
      yAxisID: 'y1'
    });
  }

  const scales = {
    x: {
      ticks: {
        display: xticks
      },
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      beginAtZero: false,
      title: {
        display: true,
        text: 'Weight'
      }
    }
  };

  // Only add y1 axis if rates are provided
  if (rates && rates.length > 0) {
    scales.y1 = {
      type: 'linear',
      display: true,
      position: 'right',
      beginAtZero: true,
      title: {
        display: true,
        text: 'Rate'
      },
      grid: {
        drawOnChartArea: false,
      },
      min: 0,
      max: 5,
      ticks: {
        stepSize: 1,
        callback: function (value) {
          const rateIcons = {
            1: '✗',
            2: '○',
            3: '✓',
            4: '✓✓'
          };
          return rateIcons[value] || '';
        }
      }
    };
  }

  wChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: datasets
    },
    options: {
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: scales,
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
};

function generateWeightChart(weight, wcolor, show) {
  if (weight) {
    let { dates, ws } = splitWeight(weight, show);

    weightChart('weight-chart', dates, ws, wcolor, false);
  };
};
var sChart = null;
var sOffset = 0;

function addSet(i, date, reps, weight, series) {

    html_code = '<tr><td style="opacity: 45%;">'+i+'.</td><td>'+date+'</td><td>'+reps+'</td><td>'+weight+'</td><td>'+series+'</td></tr>';

    document.getElementById('stats-table').insertAdjacentHTML('beforeend', html_code);
};


function setStatsPage(sets, hcolor, off, step) {
    let start = 0, end = 0;
    let dates = [], ws = [], reps = [], series = [], exs = []; 

    let ex = document.getElementById("ex-value").value;
    for (let i = 0; i < sets.length; i++) {
        if (sets[i].Name === ex) {
            exs.push(sets[i]);
        }
    };

    sOffset = sOffset + off;
    if (sOffset<0) {
        sOffset = 0;
    };

    let arrayLength = exs.length;
    let move = step + sOffset*step;

    if (arrayLength > move) {
        start = arrayLength - move;
        end = start + step;
    } else {
        sOffset = sOffset - 1;
        if (arrayLength > step) {
            end = step;
        } else {
            end = arrayLength;
        }
    };

    document.getElementById('stats-table').innerHTML = "";


    for (let i = start ; i < end; i++) {
        addSet(i+1, exs[i].Date, exs[i].Reps, exs[i].Weight, exs[i].Series);

        dates.push(exs[i].Date);
        reps.push(exs[i].Reps);
        ws.push(exs[i].Weight);
        series.push(exs[i].Series);
    };

    statsChart('stats-reps', dates, reps, series, hcolor, true);
    weightChart('stats-weight', dates, ws, hcolor, true);
};

function statsChart(id, dates, ws, series, wcolor, xticks) {
    
    const ctx = document.getElementById(id);

    if (sChart){
      sChart.clear();
      sChart.destroy();
    };

    sChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: 'Reps',
          data: ws,
          borderColor: wcolor,
          backgroundColor: wcolor + '80',
          borderWidth: 1,
          yAxisID: 'y'
        }, {
          label: 'Series',
          type: 'line',
          data: series,
          borderColor: '#ff6b6b',
          backgroundColor: '#ff6b6b',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          yAxisID: 'y1'
        }]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
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
              text: 'Reps'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Series'
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        },
        plugins:{
            legend: {
             display: true,
             position: 'top'
            }
        }
      }
    });
};
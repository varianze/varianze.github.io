export const sparlineOptions = {
    chart: {
        sparkline: {
            enabled: true
        }
    },
    tooltip: {
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    },
    dataLabels: {
        enabled: true,
        style: {
            colors: ['#333']
        },
    },
}

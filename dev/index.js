let dom = document.getElementById('chart-container');
let myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});

let option;

option = {
  title: {
    text: 'Weather Statistics',
    top: '5%',
    left: 'center'
  },
  tooltip: {},
  legend: {
    bottom: '5%',
    left: 'center'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 0
      },
      label: {
        show: false,
        position: 'center'
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
};


if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);

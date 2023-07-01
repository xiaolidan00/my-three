import mapJson from './mapJson.js';

function getData(item) {
  let data = [];
  data.push({
    adcode: item.adcode,
    name: item.name,
    center: item.center,
    level: item.level
  });
  if (item.districts?.length) {
    item.districts.forEach((el) => {
      let a = getData(el);
      data = data.concat(a);
    });
  }
  return data;
}
let data = getData(mapJson);
console.log(data);
export default {
  //文本提示样式
  tooltip: {
    show: true, //是否显示提示框
    //字体颜色
    color: 'rgb(255,255,255)',
    //字体大小
    fontSize: 10,
    //
    formatter: '{name}:{value}',
    //背景颜色
    bg: 'rgba(30, 144 ,255,0.5)'
  },

  regionStyle: {
    //厚度
    depth: 5,
    //热力颜色
    colorList: ['rgb(241, 238, 246)', 'rgb(4, 90, 141)'],
    //默认颜色
    color: 'rgb(241, 238, 246)',
    //激活颜色
    emphasisColor: 'rgb(37, 52, 148)',
    //边框样式
    borderColor: 'rgb(255,255,255)',
    borderWidth: 1
  },
  //视角控制
  viewControl: {
    autoCamera: true,
    height: 10,
    width: 0.5,
    depth: 2,
    cameraPosX: 10,
    cameraPosY: 181,
    cameraPosZ: 116,
    autoRotate: false,
    rotateSpeed: 2000
  },
  //是否下钻
  isDown: false,
  //地址名称
  address: mapJson.name,
  //地址编码
  adcode: mapJson.adcode,
  //区块数据
  data: data.map((item) => ({
    name: item.name,
    code: item.code,
    value: parseInt(Math.random() * 180)
  })),
  series: [
    {
      name: 'bar3D',
      type: 'bar3D',
      formatter: '{name}:{value}',
      data: data.map((item) => ({
        name: item.name,
        code: item.code,
        lat: item.center[1],
        lng: item.center[0],
        value: parseInt(Math.random() * 180)
      })),
      itemStyle: {
        //
        maxHeight: 30, //柱体最大高度
        minHeight: 1, //柱体最小高度
        barWidth: 1, //柱体宽度
        topColor: 'rgb(255, 255, 204)', //上方颜色
        bottomColor: 'rgb(0, 104, 55)' //下方颜色
      }
    },
    {
      name: 'lines3D',
      type: 'lines3D',
      formatter: '{name}:{value}',
      data: mapJson.districts.map((item) => ({
        fromlat: item.center[1],
        fromlng: item.center[0],
        tolat: mapJson.center[1],
        tolng: mapJson.center[0]
      })),
      itemStyle: {
        lineHeight: 20, //飞线中间点高度
        color: '#00FFFF', //原始颜色
        runColor: '#1E90FF', //变化颜色
        lineWidth: 0.3 //线宽
      }
    },
    {
      name: 'scatter3D',
      type: 'scatter3D',
      //数据
      data: mapJson.districts.map((item) => ({
        name: item.name,
        lat: item.center[1],
        lng: item.center[0],
        value: parseInt(Math.random() * 100)
      })),
      formatter: '{name}:{value}',
      itemStyle: {
        isCircle: true, //是否开启波纹圈
        opacity: 0.8, //透明度
        maxRadius: 5, //最大半径
        minRadius: 1, //最小半径
        //热力颜色
        colorList: ['rgb(255, 255, 178)', 'rgb(189, 0, 38)']
      }
    }
  ]
};

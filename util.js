import colorname from './colorname.js';

//转化为10进制
export function get16(value) {
  if (value.match(/[0-9ABCDEF]{2}/g)) {
    let letter = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    let shi = value[0];
    let ge = value[1];
    shi = 16 * letter.findIndex((el) => el == shi);
    ge = letter.findIndex((el) => el == ge);
    return shi + ge;
  } else {
    return 0;
  }
}
//转化为16位进制
export function to16(value) {
  if (value >= 0 && value <= 255) {
    let letter = ['A', 'B', 'C', 'D', 'E', 'F'];
    if (value <= 9) {
      return '0' + value;
    } else if (value > 9 && value < 16) {
      return '0' + letter[value - 10];
    } else if (value >= 16) {
      let shi = parseInt(value / 16);
      let ge = value % 16;

      if (shi > 9 && shi < 16) {
        shi = letter[shi - 10];
      }
      if (ge <= 9) {
        return shi + '' + ge;
      } else if (ge > 9 && ge < 16) {
        return shi + '' + letter[ge - 10];
      }
    }
  } else {
    return '00';
  }
}
//解析#XXXXXX颜色
export function parseResultColor(val) {
  let color = val.toUpperCase();
  let value = '';
  if (color.length == 7) {
    value = color.slice(1);
  } else if (color.length == 4) {
    value =
      color.slice(1, 2) +
      color.slice(1, 2) +
      color.slice(2, 3) +
      color.slice(2, 3) +
      color.slice(3) +
      color.slice(3);
  } else if (color.length == 3) {
    value =
      color.slice(1, 2) +
      color.slice(1, 2) +
      color.slice(1, 2) +
      color.slice(2, 3) +
      color.slice(2, 3) +
      color.slice(2, 3);
  }
  if (value.length == 6) {
    let red = get16(value.slice(0, 2));
    let green = get16(value.slice(2, 4));
    let blue = get16(value.slice(4, 6));
    return { red, green, blue, result: '#' + value };
  } else {
    return { red: 255, green: 255, blue: 255, result: '#FFFFFF' };
  }
}
function trimStr(str) {
  if (str) {
    return str.replace(/\s/g, '');
  }
  return str;
}

//解析颜色
export function getColor(color) {
  let red = 255,
    green = 255,
    blue = 255,
    result = '#FFFFFF',
    alpha = 100;
  if (color && typeof color == 'string') {
    if (color.indexOf('rgba(') == 0 && color.match(/(,)/g).length == 3) {
      let value = color.slice(5, color.length - 1).split(',');
      red = parseInt(trimStr(value[0]));
      green = parseInt(trimStr(value[1]));
      blue = parseInt(trimStr(value[2]));
      alpha = parseFloat(trimStr(value[3])) * 100;
      result = '#' + to16(red) + to16(green) + to16(blue);
    } else if (color.indexOf('rgb(') == 0 && color.match(/(,)/g).length == 2) {
      let value = color.slice(4, color.length - 1).split(',');
      red = parseInt(trimStr(value[0]));
      green = parseInt(trimStr(value[1]));
      blue = parseInt(trimStr(value[2]));
      result = '#' + to16(red) + to16(green) + to16(blue);
    } else if (color.indexOf('(') >= 0 && color.indexOf(')') >= 0) {
      let v = color.substring(color.indexOf('(') + 1, color.indexOf(')'));
      let a = v.split(',');
      if (a.length == 3) {
        red = parseInt(trimStr(a[0]));
        green = parseInt(trimStr(a[1]));
        blue = parseInt(trimStr(a[2]));
        result = '#' + to16(red) + to16(green) + to16(blue);
      } else if (a.length == 4) {
        red = parseInt(trimStr(a[0]));
        green = parseInt(trimStr(a[1]));
        blue = parseInt(trimStr(a[2]));
        alpha = parseFloat(trimStr(a[3])) * 100;
        result = '#' + to16(red) + to16(green) + to16(blue);
      }
    } else if (color.indexOf('#') == 0) {
      let r = parseResultColor(color);
      red = r.red;
      green = r.green;
      blue = r.blue;
      result = r.result;
    } else if (color.match(/^[a-zA-Z]+$/)) {
      let c = colorname.find((item) => item.name == color);
      if (c) {
        let r = parseResultColor(c.value);
        red = r.red;
        green = r.green;
        blue = r.blue;
        result = r.result;
      }
    }
  }

  return { red, green, blue, result, alpha: alpha >= 0 && alpha <= 100 ? alpha : 100 };
}
/**
 * 获取亮色向渐变颜色
 * @param {string} color 基础颜色
 * @param {number} step  数量
 * @returns {array} list 颜色数组
 */
export function getLightColor() {
  let c = getColor(color);
  let { red, blue, green } = c;
  console.log('%ccolor', `background:${color}`);

  const l = 0.2;
  const r = red + parseInt((255 - red) * l),
    g = green + parseInt((255 - green) * l),
    b = blue + parseInt((255 - blue) * l);
  console.log('%clight', `background:rgb(${r},${g}, ${b})`);

  const rr = (r - red) / step,
    gg = (g - green) / step,
    bb = (b - blue) / step;

  let list = [];
  for (let i = 0; i < step; i++) {
    list.push(
      `rgb(${parseInt(red + i * rr)},${parseInt(green + i * gg)},${parseInt(blue + i * bb)})`
    );
  }
  return list;
}

/**
 * 获取暗色向渐变颜色
 * @param {string} color 基础颜色
 * @param {number} step  数量
 * @returns {array} list 颜色数组
 */
export function getShadowColor(color, step) {
  let c = getColor(color);
  let { red, blue, green } = c;
  console.log('%ccolor', `background:${color}`);
  const s = 0.8;
  const r = parseInt(red * s),
    g = parseInt(green * s),
    b = parseInt(blue * s);
  console.log('%cshadow', `background:rgb(${r},${g}, ${b})`);
  const rr = (r - red) / step,
    gg = (g - green) / step,
    bb = (b - blue) / step;

  let list = [];
  for (let i = 0; i < step; i++) {
    list.push(
      `rgb(${parseInt(red + i * rr)},${parseInt(green + i * gg)},${parseInt(blue + i * bb)})`
    );
  }
  return list;
}

export function getDrawColors(cs, cLen) {
  let list = [];
  for (let i = 0; i < cs.length; i++) {
    list.push(getShadowColor(cs[i], cLen));
  }
  return list;
}

export function getBasicMaterial(THREE, color) {
  let c = getColor(color);
  return new THREE.MeshBasicMaterial({
    color: c.result,
    transparent: true,
    opacity: 0.01 * c.alpha,
    side: THREE.DoubleSide
  });
}
/**
 * 生成文本canvas
 * @param {array} textList [{text:文本,color:文本颜色}]
 * @param {number} fontSize 字体大小
 * @returns
 */
export function getCanvasTextArray(textList, fontSize) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = fontSize + 'px Arial';
  let textLen = 0;
  textList.forEach((item) => {
    let w = ctx.measureText(item.text + '').width;
    if (w > textLen) {
      textLen = w;
    }
  });
  canvas.width = textLen;
  canvas.height = fontSize * 1.2 * textList.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSize + 'px Arial';
  textList.forEach((item, idx) => {
    ctx.fillStyle = item.color;
    ctx.fillText(item.text, 0, fontSize * 1.2 * idx + fontSize);
  });

  return canvas;
}

/**
 *canvas文本
 * @param {String} text
 * @param {Number} fontSize
 * @param {String} color
 * @returns
 */
export function getCanvasText(text, fontSize, color, bg) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = fontSize + 'px Arial';
  ctx.fillStyle = color;
  let padding = 5;
  canvas.width = ctx.measureText(text + '').width + padding * 2;
  canvas.height = fontSize * 1.2 + padding * 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = bg;

  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();

  ctx.font = fontSize + 'px Arial';
  ctx.fillStyle = color;
  ctx.fillText(text, padding, fontSize + padding * 0.5);
  return canvas;
}
/***
 * 文本网格
 * @param {String} text
 * @param {Number} fontSize
 * @param {String} color
 */
export function getTextMesh(THREE, text, fontSize, color) {
  //canvas贴图一定要放大倍数，否则近看会模糊
  const canvas = getCanvasText(text, fontSize * 10, color, 'rgba(0,0,0,0)');

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  //透明贴图
  const canvasAlpha = getCanvasText(text, fontSize * 10, '#FFFFFF', 'rgba(0,0,0,0)');
  const mapAlpha = new THREE.CanvasTexture(canvasAlpha);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  const material = new THREE.MeshBasicMaterial({
    map: map,
    transparent: true,
    side: THREE.DoubleSide,
    //设置透明贴图避免字体重叠
    alphaTest: 0.5,
    alphaMap: mapAlpha
  });
  //创建二维平面板时对应缩小比例
  const geometry = new THREE.PlaneGeometry(canvas.width * 0.1, canvas.height * 0.1);
  const mesh = new THREE.Mesh(geometry, material);
  return { material, geometry, canvas, mesh };
}

function getCanvaMat(THREE, canvas, scale = 0.1) {
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const material = new THREE.SpriteMaterial({
    map: map,

    side: THREE.DoubleSide
  });
  const mesh = new THREE.Sprite(material);
  //缩小等比缩小canvas精灵贴图
  mesh.scale.set(canvas.width * scale, canvas.height * scale);
  return { material, mesh, map };
}

/**
 *生成多行文本精灵材质
 * @param {THREE.js} THREE
 * @param {array} textlist 文本颜色数组
 * @param {number} fontSize 字体大小
 * @returns
 */
export function getTextArraySprite(THREE, textlist, fontSize) {
  //生成五倍大小的canvas贴图，避免大小问题出现显示模糊
  const canvas = getCanvasTextArray(textlist, fontSize * 5);

  return { ...getCanvaMat(THREE, canvas, 0.1), canvas };
}

/**
 *生成单文本精灵材质
 * @param {THREE.js} THREE
 * @param {array} textlist 文本颜色数组
 * @param {number} fontSize 字体大小
 * @returns
 */
export function getTextSprite(THREE, text, fontSize, color, bg) {
  //生成五倍大小的canvas贴图，避免大小问题出现显示模糊
  const canvas = getCanvasText(text, fontSize * 50, color, bg);
  console.log(canvas.width, canvas.height);
  return { ...getCanvaMat(THREE, canvas, 0.02), canvas };
}
/***
 * 获取渐变色数组
 * @param {string} startColor 开始颜色
 * @param {string} endColor  结束颜色
 * @param {number} step 颜色数量
 */
export function getGadientArray(startColor, endColor, step) {
  let { red: startR, green: startG, blue: startB } = getColor(startColor);
  let { red: endR, green: endG, blue: endB } = getColor(endColor);

  let sR = (endR - startR) / step; //总差值
  let sG = (endG - startG) / step;
  let sB = (endB - startB) / step;
  let colorArr = [];
  for (let i = 0; i < step; i++) {
    //计算每一步的hex值

    let c =
      'rgb(' +
      parseInt(sR * i + startR) +
      ',' +
      parseInt(sG * i + startG) +
      ',' +
      parseInt(sB * i + startB) +
      ')';
    // console.log('%c' + c, 'background:' + c);

    colorArr.push(c);
  }
  return colorArr;
}

export function getRgbColor(color) {
  let res = getColor(color);
  return `rgb(${res.red},${res.green},${res.blue})`;
}

import d3geo from './d3-geo.js';
let geoFun = d3geo.geoMercator().scale(180);
export const latlng2px = (pos) => {
  if (pos[0] >= -180 && pos[0] <= 180 && pos[1] >= -90 && pos[1] <= 90) {
    return geoFun(pos);
  }
  return pos;
};

export function getGeoInfo(geojson) {
  let bounding = {
    minlat: Number.MAX_VALUE,
    minlng: Number.MAX_VALUE,
    maxlng: 0,
    maxlat: 0
  };
  let centerM = {
    lat: 0,
    lng: 0
  };
  let len = 0;

  geojson.features.forEach((a) => {
    if (a.geometry.type == 'MultiPolygon') {
      a.geometry.coordinates.forEach((b) => {
        b.forEach((c) => {
          c.forEach((item) => {
            let pos = latlng2px(item);

            if (Number.isNaN(pos[0]) || Number.isNaN(pos[1])) {
              console.log(item, pos);
              return;
            }
            centerM.lng += pos[0];
            centerM.lat += pos[1];
            if (pos[0] < bounding.minlng) {
              bounding.minlng = pos[0];
            }
            if (pos[0] > bounding.maxlng) {
              bounding.maxlng = pos[0];
            }
            if (pos[1] < bounding.minlat) {
              bounding.minlat = pos[1];
            }
            if (pos[1] > bounding.maxlat) {
              bounding.maxlat = pos[1];
            }

            len++;
          });
        });
      });
    } else {
      a.geometry.coordinates.forEach((c) => {
        c.forEach((item) => {
          let pos = latlng2px(item);

          if (Number.isNaN(pos[0]) || Number.isNaN(pos[1])) {
            console.log(item, pos);
            return;
          }
          centerM.lng += pos[0];
          centerM.lat += pos[1];
          if (pos[0] < bounding.minlng) {
            bounding.minlng = pos[0];
          }
          if (pos[0] > bounding.maxlng) {
            bounding.maxlng = pos[0];
          }
          if (pos[1] < bounding.minlat) {
            bounding.minlat = pos[1];
          }
          if (pos[1] > bounding.maxlat) {
            bounding.maxlat = pos[1];
          }

          len++;
        });
      });
    }
  });
  centerM.lat = centerM.lat / len;
  centerM.lng = centerM.lng / len;
  let scale = (bounding.maxlng - bounding.minlng) / 180;
  return { bounding, centerM, scale };
}

export function queryGeojson(adcode, isFull = true) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${adcode + (isFull ? '_full' : '')}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resolve(data);
      })
      .catch(async (err) => {
        if (isFull) {
          let res = await queryGeojson(adcode, false);
          resolve(res);
        } else {
          reject();
        }
      });
    // fetch(`/440100${isFull ? '_full' : ''}.json`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //     resolve(data);
    //   })
    //   .catch(async (err) => {
    //     if (isFull) {
    //       let res = await queryGeojson(adcode, false);
    //       resolve(res);
    //     } else {
    //       reject();
    //     }
    //   });
  });
}

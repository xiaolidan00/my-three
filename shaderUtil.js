import { getRgbColor } from './util.js';
export const vertexShader = ` 
varying vec3 vNormal;   
varying vec2 vUv;   
void main() 
{ 
  vNormal = normal;  
  vUv=uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
}`;

//渐变柱体shader
export const barShader = `
  uniform vec3 topColor; 
  uniform vec3 bottomColor;
      varying vec2 vUv;  
      varying vec3 vNormal;  
		 void main() { 
        if(vNormal.y==1.0){
          gl_FragColor = vec4(topColor, 1.0 );
        }else if(vNormal.y==-1.0){
          gl_FragColor = vec4(bottomColor, 1.0 );
        }else{
          gl_FragColor = vec4(mix(bottomColor,topColor,vUv.y), 1.0 );
        } 
	}`;

export function getGradientShaderMaterial(THREE, topColor, bottomColor) {
  const uniforms = {
    topColor: { value: new THREE.Color(getRgbColor(topColor)) },
    bottomColor: { value: new THREE.Color(getRgbColor(bottomColor)) }
  };

  return new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: barShader,
    side: THREE.DoubleSide
  });
}

//飞线shader
export const lineFShader = ` 
            uniform float time;
            uniform vec3 colorA; 
            uniform vec3 colorB;   
            varying vec2 vUv;   
                  void main() {  
                    vec3 color =vUv.x<time?colorB:colorA; 
                    gl_FragColor = vec4(color,1.0);
                  }`;
export function getLineShaderMaterial(THREE, color, color1) {
  const uniforms = {
    time: { value: 0.0 },
    colorA: { value: new THREE.Color(getRgbColor(color)) },
    colorB: { value: new THREE.Color(getRgbColor(color1)) }
  };

  return new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: lineFShader,
    side: THREE.DoubleSide,
    transparent: true
  });
}

/* Maroom Studio engine: karakter 2D + dunia 3D (WebGL2 murni) + API. Dibuat otomatis dari kode demo. */
window.Engine=null;
try{(()=>{
/* ---------- characters ---------- */
function ln(x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function drawChar(o,t){
  const f=Math.floor(t*12)/12; // stop-motion feel
  const s=o.s||1,walk=o.walk,run=o.run;
  const sp=run?16:10, bob=Math.sin(f*sp)*(walk||run?9:3.5);
  const sw=(walk||run)?Math.sin(f*sp):0;
  ctx.save();ctx.translate(o.x,o.y);
  // shadow
  if(!o.noShadow){ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(0,6,70*s,16*s,0,0,7);ctx.fill();}
  ctx.scale((o.flip?-1:1)*s,s);
  ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#14110f';ctx.lineWidth=6;
  const hip=-135;
  // legs
  [-1,1].forEach(sd=>{
    const ph=sw*sd, fx=sd*20+ph*34, fy=-Math.max(0,ph)*24;
    ctx.lineWidth=7;ln(sd*18,hip+bob*.3,fx,fy);
    ctx.fillStyle='#14110f';ctx.beginPath();ctx.ellipse(fx+sd*6,fy-2,20,10,0,0,7);ctx.fill();
  });
  ctx.save();ctx.translate(0,bob*.6);
  // arms
  const up=o.emo==='shock'||o.emo==='cheer';
  [-1,1].forEach(sd=>{
    const ph=-sw*sd;let hx=sd*(78+ph*8),hy_=-165+Math.abs(ph)*10;
    if(up){hx=sd*(88);hy_=-300+Math.sin(f*14+sd)*10}
    ctx.lineWidth=6;ln(sd*48,-225,hx,hy_);
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(hx,hy_,10,0,7);ctx.fill();ctx.stroke();
  });
  // torso
  ctx.lineWidth=6;ctx.fillStyle=o.color;
  ctx.beginPath();ctx.roundRect(-52,-250,104,122,[30,30,18,18]);ctx.fill();ctx.stroke();
  if(o.vest){ctx.lineWidth=4;ln(0,-250,0,-128);ctx.fillStyle='#14110f';[-205,-175,-145].forEach(y=>{ctx.beginPath();ctx.arc(14,y,4,0,7);ctx.fill()})}
  else{ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.35)';ln(-52,-190,52,-190);ctx.strokeStyle='#14110f'}
  // head
  ctx.lineWidth=6;ctx.fillStyle='#fffdf8';ctx.beginPath();ctx.ellipse(0,-308,62,58,0,0,7);ctx.fill();ctx.stroke();
  // face
  const blink=fract(t/3.1+o.id*.37)<.04, big=o.emo==='shock'?1.25:1;
  const look=Math.sin(t*.8+o.id)*4;
  [-1,1].forEach(sd=>{
    const ex=sd*23,ey=-312;
    if(blink){ctx.lineWidth=5;ln(ex-11,ey,ex+11,ey);return}
    ctx.lineWidth=4;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex,ey,13*big,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#14110f';ctx.beginPath();ctx.arc(ex+look,ey+1,(o.emo==='shock'?3.5:5.5),0,7);ctx.fill();
    if(o.emo==='smug'||o.emo==='sad'){ctx.fillStyle='#fffdf8';ctx.fillRect(ex-15,ey-15,30,15);ctx.lineWidth=5;ln(ex-14,ey-1,ex+14,ey-1)}
    ctx.lineWidth=5;
    const e=o.emo;
    if(e==='angry')ln(ex-sd*12,ey-16,ex+sd*12,ey-28);
    else if(e==='sad')ln(ex-sd*12,ey-28,ex+sd*12,ey-16);
    else if(e==='shock')ln(ex-12,ey-30,ex+12,ey-30);
    else if(e==='smug')ln(ex-12,ey-20+(sd>0?-6:0),ex+12,ey-20+(sd>0?0:-6));
    else{ctx.beginPath();ctx.arc(ex,ey-24,12,Math.PI*1.15,Math.PI*1.85);ctx.stroke()}
  });
  // mouth
  const talk=o.talk?(Math.sin(f*22)*.5+.5):0;ctx.lineWidth=5;ctx.fillStyle='#8a2b2b';
  const my=-276;
  if(o.talk){ctx.beginPath();ctx.ellipse(0,my,13+talk*3,4+talk*13,0,0,7);ctx.fill();ctx.stroke()}
  else if(o.emo==='shock'){ctx.beginPath();ctx.ellipse(0,my+2,11,16,0,0,7);ctx.fill();ctx.stroke()}
  else if(o.emo==='sad'||o.emo==='angry'){ctx.beginPath();ctx.arc(0,my+14,16,Math.PI*1.15,Math.PI*1.85);ctx.stroke()}
  else if(o.emo==='smug'){ln(-14,my+2,14,my-4)}
  else{ctx.beginPath();ctx.arc(0,my-6,18,Math.PI*.15,Math.PI*.85);ctx.stroke()}
  // hat
  ctx.lineWidth=6;ctx.fillStyle=o.hatColor||'#2b2b33';
  if(o.hat==='cap'){ctx.beginPath();ctx.ellipse(0,-352,62,44,0,Math.PI,0);ctx.fill();ctx.stroke();
    ctx.fillStyle=o.hatColor2||'#ffffff';for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*16,-352);ctx.quadraticCurveTo(i*14,-380,i*8,-394);ctx.lineWidth=5;ctx.stroke()}
    ctx.fillStyle=o.hatColor||'#2b2b33';ctx.beginPath();ctx.ellipse(18,-352,56,10,0,0,7);ctx.fill();ctx.lineWidth=6;ctx.stroke()}
  if(o.hat==='bowler'){ctx.beginPath();ctx.ellipse(0,-358,50,48,0,Math.PI,0);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(0,-358,84,13,0,0,7);ctx.fill();ctx.stroke()}
  if(o.hat==='tophat'){ctx.beginPath();ctx.roundRect(-40,-440,80,86,6);ctx.fill();ctx.stroke();
    ctx.fillStyle='#b8323a';ctx.fillRect(-38,-376,76,16);ctx.beginPath();ctx.ellipse(0,-356,76,12,0,0,7);ctx.fillStyle=o.hatColor||'#2b2b33';ctx.fill();ctx.stroke()}
  ctx.restore();ctx.restore();
  // exclamation
  if(o.emo==='shock'){
    const pop=clamp((t-(o.emoStart||0))/.25);const k=1+Math.sin(pop*Math.PI)*.35;
    ctx.save();ctx.translate(o.x+60*s*(o.flip?-1:1),o.y-440*s-10);ctx.scale(k*pop,k*pop);
    ctx.font='900 110px Montserrat,Poppins,sans-serif';ctx.textAlign='center';ctx.lineWidth=14;ctx.strokeStyle='#14110f';ctx.fillStyle='#ffd400';
    ctx.strokeText('!',0,0);ctx.fillText('!',0,0);ctx.restore();
  }
}

/* ---------- captions ---------- */
function drawCaption(sh,lt){
  const ch=sh.chunks.find(k=>lt>=k.a&&lt<k.b+(k===sh.chunks[sh.chunks.length-1]?.25:0));
  if(!ch)return;
  const age=lt-ch.a, pop=clamp(age/.14), sc=lerp(.7,1,easeOut(pop))+Math.sin(pop*Math.PI)*.08;
  ctx.save();ctx.translate(W/2,H*0.77);ctx.scale(sc,sc);
  ctx.font='800 78px Montserrat,Poppins,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineJoin='round';ctx.lineWidth=16;ctx.strokeStyle='#000';ctx.strokeText(ch.text,0,0);
  ctx.fillStyle='#fff';ctx.fillText(ch.text,0,0);ctx.restore();
}


const W=720,H=1280,FPS=30;
const lerp=(a,b,t)=>a+(b-a)*t, clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const easeOut=t=>1-Math.pow(1-t,3), easeIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const rnd=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const fract=x=>x-Math.floor(x);
const c=document.createElement('canvas');c.width=720;c.height=1280;let ctx=c.getContext('2d');const ctx2d=ctx;

/* ---------- timeline ---------- */
let STORY={shots:[]},TOTAL=1;
function loadStory(s){STORY=s;let t0=0;s.shots.forEach(x=>{x.start=t0;t0+=x.dur;x.chunks=makeChunks(x)});TOTAL=Math.max(1,Math.round(t0*FPS));return t0}
function makeChunks(s){
  const words=s.text.split(/\s+/),groups=[];
  for(let i=0;i<words.length;){const a=words[i],b=words[i+1];
    if(b&&(a.length+b.length)<=11){groups.push(a+' '+b);i+=2}else{groups.push(a);i++}}
  const w=groups.map(g=>g.length+3),sum=w.reduce((x,y)=>x+y,0);
  const lead=0.2,span=s.dur-lead-0.25;let acc=lead;
  return groups.map((g,i)=>{const d=span*w[i]/sum;const o={text:g,a:acc,b:acc+d};acc+=d;return o});
}

/* ---------- mini 3D engine (raw WebGL2) ---------- */
const glc=document.createElement('canvas');glc.width=W;glc.height=H;
const gl=glc.getContext('webgl2',{antialias:true,preserveDrawingBuffer:true,alpha:false});
const VS=`#version 300 es
layout(location=0) in vec3 aPos;layout(location=1) in vec3 aNrm;layout(location=2) in vec2 aUv;
uniform mat4 uVP,uM;out vec3 vW;out vec3 vN;out vec2 vUv;
void main(){vec4 w=uM*vec4(aPos,1.);vW=w.xyz;vN=mat3(uM)*aNrm;vUv=aUv;gl_Position=uVP*w;}`;
const FS=`#version 300 es
precision highp float;
in vec3 vW;in vec3 vN;in vec2 vUv;
uniform sampler2D uTex;uniform int uMode,uUseTex;
uniform vec4 uTint;uniform vec2 uScale,uOff;uniform float uEmit,uFlip,uFog;
uniform vec3 uCam,uSun,uSunCol,uAmb,uFogCol,uSkyTop,uSkyHor;
out vec4 o;
void main(){
  vec3 n=normalize(vN);vec4 base=uTint;vec3 c;
  if(uMode==3){vec3 d=normalize(vW-uCam);float h=clamp(d.y,0.,1.);c=mix(uSkyHor,uSkyTop,pow(h,.55));
    float g=max(dot(d,normalize(uSun)),0.);c+=uSunCol*(pow(g,48.)*.7+pow(g,6.)*.15);o=vec4(c,1.);return;}
  if(uMode==2){vec2 uv=vUv;if(uFlip>.5)uv.x=1.-uv.x;base*=texture(uTex,uv);if(base.a<.01)discard;c=base.rgb;}
  else{
    if(uUseTex==1){vec3 an=abs(n);vec2 uv;
      if(an.y>.6)uv=vW.xz;else if(an.x>an.z)uv=vec2(vW.z,vW.y);else uv=vec2(vW.x,vW.y);
      base*=texture(uTex,uv*uScale+uOff);}
    float l=max(dot(n,normalize(uSun)),0.);c=base.rgb*(uAmb+uSunCol*l);
    if(uEmit>0.){float w=smoothstep(.62,.82,base.r)*uEmit;c=mix(c,base.rgb*1.1,w);}
    if(uMode==4)c=base.rgb;
  }
  float dist=length(vW-uCam);float f=1.-exp(-uFog*uFog*dist*dist);c=mix(c,uFogCol,clamp(f,0.,1.));
  o=vec4(c,base.a);
}`;
function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
const prog=gl.createProgram();gl.attachShader(prog,sh(gl.VERTEX_SHADER,VS));gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);
if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));
gl.useProgram(prog);
const U={};['uVP','uM','uTex','uMode','uUseTex','uTint','uScale','uOff','uEmit','uFlip','uFog','uCam','uSun','uSunCol','uAmb','uFogCol','uSkyTop','uSkyHor'].forEach(n=>U[n]=gl.getUniformLocation(prog,n));

/* matrices (column-major) */
const M={
  mul(a,b){const o=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s}return o},
  persp(fov,a,n,f){const t=1/Math.tan(fov/2),nf=1/(n-f);return new Float32Array([t/a,0,0,0,0,t,0,0,0,0,(f+n)*nf,-1,0,0,2*f*n*nf,0])},
  look(e,c,up){const n=v=>{const l=Math.hypot(...v);return v.map(x=>x/l)},cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dt=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const z=n([e[0]-c[0],e[1]-c[1],e[2]-c[2]]),x=n(cr(up,z)),y=cr(z,x);
    return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dt(x,e),-dt(y,e),-dt(z,e),1])},
  trs(p,s,ry=0,rx=0){
    const S=new Float32Array([s[0],0,0,0,0,s[1],0,0,0,0,s[2],0,0,0,0,1]);
    const cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry);
    const Rx=new Float32Array([1,0,0,0,0,cx,sx,0,0,-sx,cx,0,0,0,0,1]);
    const Ry=new Float32Array([cy,0,-sy,0,0,1,0,0,sy,0,cy,0,0,0,0,1]);
    const T=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,p[0],p[1],p[2],1]);
    return M.mul(T,M.mul(Ry,M.mul(Rx,S)));
  }
};
function mkMesh(v,idx){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,32,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,32,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,2,gl.FLOAT,false,32,24);
  const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx),gl.STATIC_DRAW);return{vao,n:idx.length}}
const CUBE=(()=>{const F=[[1,0,0,0,0,-1,0,1,0],[-1,0,0,0,0,1,0,1,0],[0,1,0,1,0,0,0,0,-1],[0,-1,0,1,0,0,0,0,1],[0,0,1,1,0,0,0,1,0],[0,0,-1,-1,0,0,0,1,0]];
  const v=[],idx=[];F.forEach((f,i)=>{const n=f.slice(0,3),u=f.slice(3,6),w=f.slice(6,9);
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([a,b],k)=>{v.push(n[0]*.5+u[0]*a*.5+w[0]*b*.5,n[1]*.5+u[1]*a*.5+w[1]*b*.5,n[2]*.5+u[2]*a*.5+w[2]*b*.5,...n,(a+1)/2,1-(b+1)/2)});
    idx.push(i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3)});return mkMesh(v,idx)})();
const QUAD=mkMesh([-.5,0,0,0,0,1,0,1, .5,0,0,0,0,1,1,1, .5,1,0,0,0,1,1,0, -.5,1,0,0,0,1,0,0],[0,1,2,0,2,3]);

function texFrom(cv,{repeat=true,mip=true}={}){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,cv);
  if(mip){gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR)}else gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  const w=repeat?gl.REPEAT:gl.CLAMP_TO_EDGE;gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,w);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,w);
  const an=gl.getExtension('EXT_texture_filter_anisotropic');if(an)gl.texParameterf(gl.TEXTURE_2D,an.TEXTURE_MAX_ANISOTROPY_EXT,8);return t}
function mkCanvas(w,h,fn){const cv=document.createElement('canvas');cv.width=w;cv.height=h;fn(cv.getContext('2d'),w,h);return cv}

/* ---------- procedural textures ---------- */
const ROCK=['#c9501f','#e0702a','#a83d1c','#f08a3c','#8e3018','#d95f25','#b94a20','#f39a52','#e9a06a','#7b2a17'];
const T={};
T.rock=texFrom(mkCanvas(256,512,(g,w,h)=>{let y=0,i=0;while(y<h){const bh=Math.min(h-y,8+rnd(i*3.3)*34);g.fillStyle=ROCK[Math.floor(rnd(i*1.7)*ROCK.length)];g.fillRect(0,y,w,bh);
  g.fillStyle='rgba(60,10,0,.28)';g.fillRect(0,y,w,2);y+=bh;i++}
  for(let k=0;k<900;k++){g.fillStyle=`rgba(${rnd(k)>.5?'255,220,170':'50,10,0'},${.04+rnd(k+5)*.08})`;g.fillRect(rnd(k*2)*w,rnd(k*3)*h,2+rnd(k*7)*14,1+rnd(k*9)*3)}
  for(let k=0;k<60;k++){const x=rnd(k*11)*w,y0=rnd(k*13)*h;g.strokeStyle='rgba(40,8,0,.14)';g.lineWidth=1+rnd(k)*2;g.beginPath();g.moveTo(x,y0);g.lineTo(x+rnd(k+2)*8-4,y0+20+rnd(k+4)*60);g.stroke()}}));
T.ballast=texFrom(mkCanvas(256,256,(g,w,h)=>{g.fillStyle='#b99468';g.fillRect(0,0,w,h);
  for(let k=0;k<1400;k++){const x=rnd(k)*w,y=rnd(k+3)*h,r=1.5+rnd(k+7)*4.5;g.fillStyle=['#d9bd96','#6b4a33','#8a6a4a','#e8d2b0','#a07a54'][Math.floor(rnd(k+9)*5)];
    [[0,0],[-w,0],[w,0],[0,-h],[0,h]].forEach(([dx,dy])=>{g.beginPath();g.ellipse(x+dx,y+dy,r*1.3,r,rnd(k)*3,0,7);g.fill()})}}));
T.track=texFrom(mkCanvas(256,256,(g,w,h)=>{g.fillStyle='#8f6e4c';g.fillRect(0,0,w,h);
  for(let k=0;k<700;k++){g.fillStyle=['#c9a97c','#5e4430','#7a5a3c'][Math.floor(rnd(k)*3)];g.beginPath();g.ellipse(rnd(k+1)*w,rnd(k+2)*h,2+rnd(k+3)*4,1.5+rnd(k+4)*3,0,0,7);g.fill()}
  g.fillStyle='#4a3020';g.fillRect(w*.08,h*.32,w*.84,h*.38);g.fillStyle='#6a4630';g.fillRect(w*.08,h*.32,w*.84,6);
  g.strokeStyle='rgba(20,10,5,.5)';g.lineWidth=1.5;for(let k=0;k<9;k++){const y=h*.34+k*h*.04;g.beginPath();g.moveTo(w*.08,y);g.bezierCurveTo(w*.3,y+rnd(k)*5,w*.6,y-rnd(k+2)*5,w*.92,y);g.stroke()}}));
T.cobble=texFrom(mkCanvas(256,256,(g,w,h)=>{g.fillStyle='#2c2030';g.fillRect(0,0,w,h);
  for(let r=0;r<8;r++)for(let q=0;q<5;q++){const x=q*52+(r%2?26:0),y=r*32;g.fillStyle=['#7a6272','#6a5566','#8a7080','#5f4a5c'][Math.floor(rnd(r*9+q)*4)];
    [-w,0,w].forEach(dx=>{g.beginPath();g.roundRect(x+3+dx,y+3,46,26,8);g.fill()})}}));
T.facade=texFrom(mkCanvas(256,256,(g,w,h)=>{g.fillStyle='#4b3560';g.fillRect(0,0,w,h);
  for(let r=0;r<4;r++)for(let q=0;q<4;q++){const lit=rnd(r*4+q+1)>.42;g.fillStyle='#2a1c3a';g.fillRect(q*64+10,r*64+9,44,48);
    g.fillStyle=lit?(rnd(q+r)>.5?'#ffd27a':'#ffbf5c'):'#34234a';g.fillRect(q*64+13,r*64+12,38,42);
    g.fillStyle='rgba(20,10,30,.6)';g.fillRect(q*64+31,r*64+12,3,42);g.fillRect(q*64+13,r*64+31,38,3);
    g.fillStyle='#3a2850';g.fillRect(q*64+8,r*64+56,48,5)}}));
const radial=(s,stops)=>mkCanvas(s,s,(g)=>{const r=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);stops.forEach(([o,c])=>r.addColorStop(o,c));g.fillStyle=r;g.fillRect(0,0,s,s)});
T.shadow=texFrom(radial(128,[[0,'rgba(0,0,0,.55)'],[.6,'rgba(0,0,0,.3)'],[1,'rgba(0,0,0,0)']]),{repeat:false,mip:false});
T.glow=texFrom(radial(128,[[0,'rgba(255,230,150,.95)'],[.25,'rgba(255,200,100,.45)'],[1,'rgba(255,180,80,0)']]),{repeat:false,mip:false});
T.cloud=texFrom(mkCanvas(512,256,(g,w,h)=>{for(let k=0;k<16;k++){const x=90+rnd(k)*330,y=110+rnd(k+4)*50-Math.abs(x-256)*.15,r=40+rnd(k+8)*55;
  const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.6,'rgba(255,255,255,.3)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
  const gr=g.createLinearGradient(0,100,0,220);gr.addColorStop(0,'rgba(120,150,200,0)');gr.addColorStop(1,'rgba(120,150,200,.25)');g.fillStyle=gr;g.globalCompositeOperation='source-atop';g.fillRect(0,0,w,h)}),{repeat:false,mip:true});

/* ---------- worlds ---------- */
const ENV={
  canyon:{skyTop:[.14,.38,.84],skyHor:[.80,.88,.97],fog:[.74,.83,.95],fogD:.0125,sun:[.55,.7,.4],sunCol:[1.05,.9,.68],amb:[.52,.56,.68],spr:[1,1,1]},
  dawn:{skyTop:[.28,.3,.62],skyHor:[1,.72,.5],fog:[.95,.72,.62],fogD:.012,sun:[.6,.25,.4],sunCol:[1.1,.78,.5],amb:[.55,.5,.62],spr:[1,.94,.92]},
  town:{skyTop:[.22,.16,.48],skyHor:[1,.62,.42],fog:[.88,.57,.52],fogD:.014,sun:[-.4,.32,.6],sunCol:[1,.68,.42],amb:[.5,.42,.62],spr:[1,.92,.94]}
};
const box=(L,p,s,tex,tint,sc,mode=1,emit=0,off=[0,0])=>L.push({p,s,tex,tint,sc,mode,emit,off});
function buildCanyon(brk){
  const L=[],zN=40,zF=brk!=null?brk:-420,len=zN-zF,zc=(zN+zF)/2;
  box(L,[0,-.5,zc],[16,1,len],T.ballast,[1,.95,.9,1],[.6,.6]);
  box(L,[0,.02,zc],[3.2,.05,len],T.track,[1,1,1,1],[1/3.2,1/.8],1,0,[.5,0]);
  [-.72,.72].forEach(x=>box(L,[x,.13,zc],[.09,.16,len],null,[.55,.57,.63,1],[1,1],0));
  for(const side of[-1,1])for(let i=0;;i++){
    const z=zN-i*13;if(z<-320)break;const r=k=>rnd(i*7+side*3+k);
    const w=7+r(1)*5,h=20+r(2)*26,x=side*(8.2+r(3)*2.5+w/2),tint=side<0?[1,1,1,1]:[.85,.8,.9,1];
    box(L,[x,(h-70)/2,z],[w,h+70,14.2],T.rock,tint,[.03,.03],1,0,[r(4),r(5)]);
    const w2=6+r(6)*6,h2=8+r(7)*14;
    box(L,[x+side*(w/2+w2/2-1),(h2-70)/2,z-3],[w2,h2+70,12],T.rock,tint,[.03,.03],1,0,[r(8),r(9)]);
  }
  box(L,[0,-72,-150],[240,2,520],T.rock,[.5,.42,.5,1],[.02,.02]);
  if(brk!=null){
    box(L,[0,-10,-120],[90,160,10],T.rock,[.9,.85,.95,1],[.03,.03]);
    for(let i=0;i<7;i++){const x=(i%2?1:-1)*(3.8+rnd(i)*3),h=6+rnd(i+3)*24,z=-28-i*12;box(L,[x,(h-70)/2,z],[3.5+rnd(i+5)*2.5,h+70,4+rnd(i+6)*3],T.rock,[.95,.9,1,1],[.04,.04],1,0,[rnd(i),rnd(i+1)])}
    const bz=-70;box(L,[0,15,bz],[24,.8,4],null,[.22,.2,.22,1],[1,1],0);box(L,[0,17.6,bz],[24,.3,.3],null,[.22,.2,.22,1],[1,1],0);
    for(let k=-5;k<=5;k++)box(L,[k*2.2,16.3,bz],[.2,2.4,.2],null,[.22,.2,.22,1],[1,1],0);
    [-9,9].forEach(x=>box(L,[x,-20,bz],[1,70,1.2],null,[.25,.2,.2,1],[1,1],0));
    box(L,[1.8,.7,brk+2.6],[.12,1.4,.12],null,[.3,.2,.12,1],[1,1],0);
    box(L,[1.8,1.35,brk+2.6],[1.1,.6,.08],null,[.85,.15,.12,1],[1,1],0);
    box(L,[1.8,1.35,brk+2.55],[.8,.14,.05],null,[1,.95,.9,1],[1,1],0);
  }
  return{L,glow:[],clouds:[[-120,95,-300,200],[60,130,-340,260],[190,85,-280,170],[-210,150,-360,280],[10,70,-250,150]]};
}
function buildTown(){
  const L=[],glow=[];
  box(L,[0,-.5,-100],[16,1,300],T.cobble,[1.05,.95,1,1],[.3,.3]);
  for(const side of[-1,1]){
    box(L,[side*5.3,.1,-100],[2.4,.2,300],T.cobble,[1.25,1.15,1.2,1],[.3,.3]);
    for(let i=0,z=30;z>-250;i++){
      const r=k=>rnd(i*5+side*17+k),w=7+r(1)*5,h=10+r(2)*17,tint=[.85+r(3)*.35,.8+r(4)*.3,.9+r(5)*.3,1];
      box(L,[side*(6.5+4.6),h/2,z-w/2],[9,h,w],T.facade,tint,[.14,.14],1,1,[r(6),r(7)]);
      box(L,[side*(6.5+4.6),h+.35,z-w/2],[9.6,.7,w+.4],null,[.28,.2,.3,1],[1,1],0);
      if(r(8)>.5)box(L,[side*(6.5+4.6),h+1.4,z-w/2],[1.2,1.6,1.2],null,[.3,.22,.3,1],[1,1],0);
      z-=w+.3;
    }
    for(let k=0;k<22;k++){const z=14-k*11,x=side*4.2;
      box(L,[x,2.1,z],[.14,4.2,.14],null,[.1,.07,.13,1],[1,1],0);box(L,[x,4.35,z],[.55,.5,.55],null,[1,.85,.5,1],[1,1],4);glow.push([x,4.35,z,3.4])}
  }
  box(L,[0,22,-150],[16,52,12],T.facade,[1,.9,1,1],[.12,.12],1,1);box(L,[0,50,-150],[18,6,14],null,[.28,.2,.3,1],[1,1],0);
  return{L,glow,clouds:[[-120,95,-300,220],[90,120,-320,260],[200,80,-280,170]]};
}
const WORLD={};const getWorld=s=>{const k=s.world+(s.breakZ??'');return WORLD[k]||(WORLD[k]=s.world==='town'?buildTown():buildCanyon(s.breakZ??null))};

/* ---------- drawing ---------- */
let CUR=null;
function draw(mesh,o){
  gl.bindVertexArray(mesh.vao);
  gl.uniformMatrix4fv(U.uM,false,M.trs(o.p,o.s,o.ry||0,o.rx||0));
  gl.uniform1i(U.uMode,o.mode??1);gl.uniform4fv(U.uTint,o.tint||[1,1,1,1]);
  gl.uniform2fv(U.uScale,o.sc||[1,1]);gl.uniform2fv(U.uOff,o.off||[0,0]);gl.uniform1f(U.uEmit,o.emit||0);gl.uniform1f(U.uFlip,o.flip?1:0);
  if(o.tex){gl.bindTexture(gl.TEXTURE_2D,o.tex);gl.uniform1i(U.uUseTex,1)}else gl.uniform1i(U.uUseTex,0);
  gl.drawElements(gl.TRIANGLES,mesh.n,gl.UNSIGNED_SHORT,0);
}
const cc=mkCanvas(400,640,()=>{}),cctx=cc.getContext('2d');const charTex={};
function charTexture(o,t){
  const keep=ctx;ctx=cctx;cctx.setTransform(1,0,0,1,0,0);cctx.clearRect(0,0,400,640);
  drawChar(Object.assign({},o,{x:200,y:612,s:1,noShadow:true}),t);ctx=keep;
  let tx=charTex[o.id];gl.activeTexture(gl.TEXTURE0);
  if(!tx){tx=charTex[o.id]=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)}
  gl.bindTexture(gl.TEXTURE_2D,tx);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,cc);return tx;
}
const PPM=251; // piksel per meter untuk sprite karakter (tinggi 1.75 m)

window.renderFrame=function(fi){
  const t=fi/FPS;let si=STORY.shots.findIndex(s=>t>=s.start&&t<s.start+s.dur);if(si<0)si=STORY.shots.length-1;
  const S=STORY.shots[si],lt=t-S.start,p=clamp(lt/S.dur),e=easeIO(p),C=S.cam,env=ENV[S.env||S.world],wd=getWorld(S);
  const mix3=(a,b)=>a.map((v,i)=>lerp(v,b[i],e));
  const sk=(S.shake??1)*.012;
  const pos=mix3(C.p0,C.p1).map((v,i)=>v+Math.sin(t*(2.3+i*.9)+i*2)*sk*(i==1?.7:1)),tgt=mix3(C.t0,C.t1);
  let fov=lerp(C.f0,C.f1,e)*(1-Math.max(0,.12-lt*.6));
  const roll=(lerp(C.r0||0,C.r1||0,e)+Math.sin(t*1.7)*.35*(S.shake??1))*Math.PI/180;
  const view=M.look(pos,tgt,[Math.sin(roll),Math.cos(roll),0]),VP=M.mul(M.persp(fov*Math.PI/180,W/H,.1,1600),view);

  gl.viewport(0,0,W,H);gl.clearColor(...env.fog,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.useProgram(prog);gl.activeTexture(gl.TEXTURE0);gl.uniform1i(U.uTex,0);
  gl.uniformMatrix4fv(U.uVP,false,VP);gl.uniform3fv(U.uCam,pos);gl.uniform3fv(U.uSun,env.sun);gl.uniform3fv(U.uSunCol,env.sunCol);gl.uniform3fv(U.uAmb,env.amb);
  gl.uniform3fv(U.uFogCol,env.fog);gl.uniform3fv(U.uSkyTop,env.skyTop);gl.uniform3fv(U.uSkyHor,env.skyHor);gl.uniform1f(U.uFog,env.fogD);
  // sky + clouds
  gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);draw(CUBE,{p:pos,s:[1200,1200,1200],mode:3});
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  wd.clouds.forEach(([x,y,z,w],i)=>{const dx=pos[0]-x,dz=pos[2]-z;draw(QUAD,{p:[x+Math.sin(t*.05+i)*6,y,z],s:[w,w*.5,1],ry:Math.atan2(dx,dz),tex:T.cloud,mode:2,tint:[...env.spr,.9]})});
  gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);
  wd.L.forEach(o=>draw(CUBE,o));
  // shadows + character sprites
  gl.enable(gl.BLEND);gl.depthMask(false);
  const chars=(S.chars||[]).map(ch=>{const q=ch.move?easeIO(p):0;
    const wp=[ch.pos[0]+(ch.move?ch.move[0]*q:0),ch.pos[1],ch.pos[2]+(ch.move?ch.move[2]*q:0)];
    return{ch,wp,d:Math.hypot(wp[0]-pos[0],wp[2]-pos[2])}}).sort((a,b)=>b.d-a.d);
  chars.forEach(({ch,wp})=>{const sc=ch.s||1;draw(QUAD,{p:[wp[0],.07,wp[2]+.4*sc],s:[1.5*sc,.8*sc,1],rx:-Math.PI/2,tex:T.shadow,mode:2})});
  wd.glow.forEach(([x,y,z,r])=>draw(QUAD,{p:[x,y-r/2,z],s:[r,r,1],ry:Math.atan2(pos[0]-x,pos[2]-z),tex:T.glow,mode:2}));
  chars.forEach(({ch,wp})=>{
    const o=Object.assign({},ch);o.talk=ch.talk&&S.chunks.some(k=>lt>=k.a&&lt<k.b);o.emoStart=ch.emoAt??0;
    const tx=charTexture(o,t),sc=ch.s||1;
    draw(QUAD,{p:[wp[0],-28/PPM*sc,wp[2]],s:[400/PPM*sc,640/PPM*sc,1],ry:Math.atan2(pos[0]-wp[0],pos[2]-wp[2]),tex:tx,mode:2,tint:[...env.spr,1]});
  });
  gl.depthMask(true);gl.disable(gl.BLEND);

  // komposit 2D: vignette, flash saat cut, teks
  ctx=ctx2d;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,W,H);ctx.drawImage(glc,0,0);
  const v=ctx.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.78);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(10,0,20,.42)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
  if(lt<.12){ctx.fillStyle=`rgba(255,255,255,${(.12-lt)/.12*.3})`;ctx.fillRect(0,0,W,H)}
  drawCaption(S,lt);
};

const Engine=(()=>{let raf=0,run=0,ac=null,srcs=[];
const AC=()=>ac||(ac=new(window.AudioContext||window.webkitAudioContext)());
const stopAudio=()=>{srcs.forEach(n=>{try{n.stop()}catch{}});srcs=[]};
const startAudio=(story,dest)=>{stopAudio();const a=AC();a.resume();const t0=a.currentTime+.05;story.shots.forEach(x=>{if(!x.audio)return;const n=a.createBufferSource();n.buffer=x.audio;n.connect(dest||a.destination);n.start(t0+x.start+.2);srcs.push(n)})};const at=fi=>renderFrame(Math.min(fi,TOTAL-1));
return{canvas:c,
 load(s){return loadStory(s)},
 stop(){cancelAnimationFrame(raf);run++;stopAudio()},
 decode(ab){return AC().decodeAudioData(ab.slice(0))},
 play(story,{loop=true,onEnd}={}){this.stop();const dur=this.load(story),my=run;let st=performance.now();startAudio(story);
  const tick=now=>{if(my!==run)return;let t=(now-st)/1000;if(t>=dur){if(loop){st=now;t=0;startAudio(story)}else{at(TOTAL-1);onEnd&&onEnd();return}}at(Math.floor(t*FPS));raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)},
 record(story,onProgress){return new Promise((res,rej)=>{this.stop();const dur=this.load(story),my=run;
  const mime=['video/webm;codecs=vp9,opus','video/webm;codecs=vp9','video/webm'].find(m=>window.MediaRecorder&&MediaRecorder.isTypeSupported(m));
  if(!mime)return rej(new Error('Browser ini tidak mendukung perekaman video'));
  const vs=c.captureStream(FPS);let dest=null;
  if(story.shots.some(x=>x.audio)){dest=AC().createMediaStreamDestination();dest.stream.getAudioTracks().forEach(t=>vs.addTrack(t))}
  const rec=new MediaRecorder(vs,{mimeType:mime,videoBitsPerSecond:6e6}),parts=[],st=performance.now();
  rec.ondataavailable=e=>e.data.size&&parts.push(e.data);rec.onstop=()=>res(new Blob(parts,{type:'video/webm'}));rec.start();dest&&startAudio(story,dest);
  const tick=now=>{if(my!==run){rec.stop();return rej(new Error('Dibatalkan'))}const t=(now-st)/1000;onProgress&&onProgress(Math.min(1,t/dur));
   if(t>=dur){at(TOTAL-1);setTimeout(()=>rec.stop(),200);return}at(Math.floor(t*FPS));raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)})},
 still(story,t,w=216,h=384){this.stop();this.load(story);at(Math.floor(t*FPS));const o=document.createElement('canvas');o.width=w;o.height=h;o.getContext('2d').drawImage(c,0,0,w,h);return o.toDataURL('image/jpeg',.7)},
 sprite(o){const cv=document.createElement('canvas');cv.width=400;cv.height=640;const k=ctx;ctx=cv.getContext('2d');drawChar(Object.assign({s:1,id:9,x:200,y:612,noShadow:true},o),.5);ctx=k;return cv.toDataURL('image/png')}};})();
window.Engine=Engine;

})()}catch(e){console.warn('Engine tidak aktif:',e)}

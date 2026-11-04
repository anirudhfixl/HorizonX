import React, { useEffect, useRef } from "react";

interface TokenShaderHeroProps {
  onScrollToWizard: () => void;
  onExploreSetup: () => void;
}

/**
 * Animated WebGL2 Shader Hero background for Token Creation.
 * Modularized for clean architecture with responsive layout, zero navbar collision,
 * and graceful fallback for browsers without WebGL2.
 */
export function TokenShaderHero({ onScrollToWizard, onExploreSetup }: TokenShaderHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      return;
    }

    const vertexSource = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

    const fragmentSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}
void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  O=vec4(col,1);
}`;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "resolution");
    const timeLocation = gl.getUniformLocation(program, "time");
    let animationFrame = 0;
    let startTime = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = (now: number) => {
      if (!startTime) startTime = now;
      resize();
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (now - startTime) * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrame = window.requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <section className="relative isolate -mt-24 sm:-mt-28 left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#080503] min-h-[520px] h-[min(680px,calc(100svh+20px))] pt-24 sm:pt-32">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ background: "#080503" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,5,3,.34) 0%, rgba(8,5,3,.12) 28%, rgba(8,5,3,.14) 72%, rgba(8,5,3,.38) 100%), linear-gradient(180deg, rgba(8,5,3,.08) 0%, rgba(8,5,3,.10) 68%, #0b0704 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-5 pb-12 pt-6 text-center sm:px-8">
        <div className="max-w-4xl space-y-5">
          <h1 className="text-4xl font-bold leading-[1.06] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block bg-gradient-to-r from-orange-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Discover the tokens
            </span>
            <span className="mt-1 block bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
              powering the ecosystem.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm font-light leading-relaxed text-orange-50/80 sm:text-base md:text-lg">
            Explore the HorizonX token directory, compare projects across networks, and review token details and transparent market snapshots in one place.
          </p>

          <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={onScrollToWizard}
              className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-3 text-xs font-semibold text-[#160b04] shadow-lg shadow-orange-500/20 transition duration-300 hover:scale-[1.02] hover:from-orange-400 hover:to-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 sm:text-sm"
            >
              Create a token
            </button>
            <button
              type="button"
              onClick={onExploreSetup}
              className="rounded-full border border-orange-200/30 bg-orange-500/10 px-6 py-3 text-xs font-semibold text-orange-50 backdrop-blur-sm transition duration-300 hover:scale-[1.02] hover:border-orange-200/55 hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 sm:text-sm"
            >
              Explore token directory
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

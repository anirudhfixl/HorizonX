import * as React from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

type SatelliteConfig = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  detail: string;
  symbol: string;
  color: string;
  path: string;
  orbit: number;
  speed: number;
  phase: number;
  tilt: [number, number, number];
};

const SATELLITES: SatelliteConfig[] = [
  { id: "tokens", name: "Tokens", eyebrow: "DIGITAL ASSETS", description: "Discover and manage digital assets across the HorizonX ecosystem.", detail: "Explore token profiles, market information and asset details.", symbol: "T", color: "#F6B84A", path: "/tokens", orbit: 2.05, speed: 0.23, phase: 0.2, tilt: [0.35, 0.12, 0.18] },
  { id: "projects", name: "Projects", eyebrow: "WEB3 DISCOVERY", description: "Explore emerging projects and the teams building across Web3.", detail: "Browse project profiles, ecosystems and their related tokens.", symbol: "P", color: "#A99AFF", path: "/projects", orbit: 2.45, speed: -0.17, phase: 2.0, tilt: [0.68, 0.18, -0.38] },
  { id: "launchpad", name: "Launchpad", eyebrow: "TOKEN LAUNCHES", description: "Find presales and fair launches from projects in the ecosystem.", detail: "Review launch information and discover upcoming opportunities.", symbol: "↗", color: "#F58B37", path: "/launchpad", orbit: 2.95, speed: 0.13, phase: 3.4, tilt: [0.18, 0.55, 0.22] },
  { id: "airdrops", name: "Airdrops", eyebrow: "TOKEN DISTRIBUTIONS", description: "Discover airdrop campaigns and token distribution opportunities.", detail: "Explore campaign details, eligibility information and project links.", symbol: "✦", color: "#55D5E8", path: "/airdrops", orbit: 3.35, speed: -0.105, phase: 4.6, tilt: [0.82, -0.28, 0.42] },
  { id: "staking", name: "Staking", eyebrow: "ON-CHAIN REWARDS", description: "Explore staking pools and ways to participate in supported networks.", detail: "Compare pool information and review staking terms before participating.", symbol: "◇", color: "#6DDBA5", path: "/staking", orbit: 2.72, speed: 0.16, phase: 5.4, tilt: [0.48, -0.5, -0.24] },
  { id: "markets", name: "Markets", eyebrow: "MARKET INTELLIGENCE", description: "Follow token markets, prices and ecosystem activity.", detail: "Explore market views, asset performance and token analytics.", symbol: "M", color: "#6CA8FF", path: "/markets", orbit: 3.72, speed: -0.082, phase: 1.1, tilt: [0.25, 0.72, 0.5] },
  { id: "partners", name: "Partners", eyebrow: "ECOSYSTEM NETWORK", description: "Meet the organizations and integrations connected to HorizonX.", detail: "Discover ecosystem partners and their areas of collaboration.", symbol: "∞", color: "#D78BEF", path: "/partners", orbit: 4.08, speed: 0.068, phase: 2.8, tilt: [0.95, 0.22, -0.55] },
];

type SatelliteRuntime = {
  config: SatelliteConfig;
  group: THREE.Group;
  hitTarget: THREE.Mesh;
  orbit: THREE.Euler;
};

function makeSymbolTexture(symbol: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();
  ctx.clearRect(0, 0, 256, 256);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 116px Arial, sans-serif";
  ctx.shadowColor = color;
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(symbol, 128, 130);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeRoundedPetal() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.28, -0.34);
  shape.lineTo(0.12, -0.34);
  shape.quadraticCurveTo(0.34, -0.34, 0.34, -0.12);
  shape.lineTo(0.34, 0.27);
  shape.quadraticCurveTo(0.34, 0.34, 0.27, 0.34);
  shape.lineTo(-0.12, 0.34);
  shape.quadraticCurveTo(-0.34, 0.34, -0.34, 0.12);
  shape.lineTo(-0.34, -0.28);
  shape.quadraticCurveTo(-0.34, -0.34, -0.28, -0.34);
  return shape;
}

export function HorizonXEcosystemOrbit({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();
  const navigateRef = React.useRef(navigate);
  navigateRef.current = navigate;
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [webglFailed, setWebglFailed] = React.useState(false);
  const [isTouch, setIsTouch] = React.useState(false);
  const selected = SATELLITES.find((item) => item.id === selectedId) ?? null;
  const selectedRef = React.useRef<string | null>(null);
  selectedRef.current = selectedId;

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "default", failIfMajorPerformanceCaveat: false });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.setClearColor(0x000000, 0);
    } catch (error) {
      // Some browsers/devices block WebGL context creation. Keep the ecosystem
      // interactive with the CSS orbital renderer instead of showing an empty glow.
      root.dataset.webglFallback = "true";
      setWebglFailed(true);
      console.warn("[HorizonX orbit] WebGL initialization failed; using interactive fallback.", error);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 15);
    const raycaster = new THREE.Raycaster();
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reduceMotionQuery.matches;
    const pointer = new THREE.Vector2();
    const hitTargets: THREE.Object3D[] = [];
    const runtimes: SatelliteRuntime[] = [];
    const disposables: Array<{ dispose: () => void }> = [];
    const ambient = new THREE.AmbientLight(0x9aa8c9, 1.15);
    scene.add(ambient);
    const keyLight = new THREE.PointLight(0xffc58a, 95, 22, 2);
    keyLight.position.set(2.5, 4.5, 5);
    scene.add(keyLight);
    const coolLight = new THREE.PointLight(0x6d82ff, 42, 18, 2);
    coolLight.position.set(-4, -2, 2);
    scene.add(coolLight);

    const coreX = window.innerWidth < 768 ? 0 : 3.15;
    const coreY = window.innerWidth < 768 ? -1.15 : -0.05;
    const core = new THREE.Group();
    core.position.set(coreX, coreY, 0);
    scene.add(core);

    const coreSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.83, 64, 48),
      new THREE.MeshPhysicalMaterial({ color: 0x161a22, metalness: 0.72, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.12, emissive: 0x211b38, emissiveIntensity: 0.5 })
    );
    core.add(coreSphere);
    disposables.push(coreSphere.geometry, coreSphere.material as THREE.Material);

    const coreHalo = new THREE.Mesh(
      new THREE.SphereGeometry(1.03, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0xa99aff, transparent: true, opacity: 0.075, side: THREE.BackSide })
    );
    core.add(coreHalo);
    disposables.push(coreHalo.geometry, coreHalo.material as THREE.Material);

    const logoMaterial = new THREE.MeshStandardMaterial({ color: 0xf8f7f4, metalness: 0.18, roughness: 0.28, emissive: 0x33313b, emissiveIntensity: 0.12 });
    const petalShape = makeRoundedPetal();
    const petalGeometry = new THREE.ShapeGeometry(petalShape, 12);
    for (let i = 0; i < 4; i++) {
      const petal = new THREE.Mesh(petalGeometry, logoMaterial);
      const angle = (Math.PI / 2) * i + Math.PI / 4;
      petal.position.set(Math.cos(angle) * 0.25, Math.sin(angle) * 0.25, 0.78);
      petal.rotation.z = angle + Math.PI / 2;
      petal.scale.setScalar(0.58);
      core.add(petal);
    }
    disposables.push(petalGeometry, logoMaterial);

    const coreRingMaterial = new THREE.MeshBasicMaterial({ color: 0xa99aff, transparent: true, opacity: 0.38 });
    const coreRing = new THREE.Mesh(new THREE.TorusGeometry(1.16, 0.009, 8, 180), coreRingMaterial);
    coreRing.rotation.x = 1.12;
    coreRing.rotation.y = 0.24;
    core.add(coreRing);
    disposables.push(coreRing.geometry, coreRingMaterial);

    // Background star field: deterministic positions keep the composition stable between visits.
    const starPositions = new Float32Array(420 * 3);
    let seed = 24681357;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < 420; i++) {
      starPositions[i * 3] = (random() - 0.5) * 24;
      starPositions[i * 3 + 1] = (random() - 0.5) * 13;
      starPositions[i * 3 + 2] = -2 - random() * 13;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xc5c9d5, size: 0.018, transparent: true, opacity: 0.72, sizeAttenuation: true }));
    scene.add(stars);
    disposables.push(starGeometry, stars.material as THREE.Material);

    SATELLITES.forEach((config) => {
      const group = new THREE.Group();
      const color = new THREE.Color(config.color);
      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(0.19, 32, 24),
        new THREE.MeshPhysicalMaterial({ color, metalness: 0.48, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.12, emissive: color, emissiveIntensity: 0.12 })
      );
      group.add(planet);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.28, 0.012, 8, 64),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 })
      );
      ring.rotation.x = Math.PI / 2.6;
      group.add(ring);
      const texture = makeSymbolTexture(config.symbol, config.color);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, color: 0xffffff }));
      sprite.position.set(0, 0.31, 0.08);
      sprite.scale.set(0.34, 0.34, 1);
      group.add(sprite);
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.31, 24, 16),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.085, side: THREE.BackSide })
      );
      group.add(glow);
      scene.add(group);

      const hitTarget = new THREE.Mesh(new THREE.SphereGeometry(0.43, 16, 12), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
      group.add(hitTarget);
      hitTargets.push(hitTarget);
      const orbitEuler = new THREE.Euler(config.tilt[0], config.tilt[1], config.tilt[2], "XYZ");
      const curvePoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 180; i++) {
        const angle = (i / 180) * Math.PI * 2;
        curvePoints.push(new THREE.Vector3(Math.cos(angle) * config.orbit, Math.sin(angle) * config.orbit * 0.56, 0).applyEuler(orbitEuler));
      }
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints.map((point) => point.add(new THREE.Vector3(coreX, coreY, 0))));
      const orbitLine = new THREE.Line(orbitGeometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.16 }));
      scene.add(orbitLine);

      disposables.push(planet.geometry, planet.material as THREE.Material, ring.geometry, ring.material as THREE.Material,
        texture, sprite.material as THREE.Material, glow.geometry, glow.material as THREE.Material,
        hitTarget.geometry, hitTarget.material as THREE.Material, orbitGeometry, orbitLine.material as THREE.Material);
      runtimes.push({ config, group, hitTarget, orbit: orbitEuler });
    });

    const pointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(hitTargets, false)[0]?.object;
      const runtime = hit ? runtimes.find((item) => item.hitTarget === hit) : undefined;
      const next = runtime?.config.id ?? null;
      if (selectedRef.current !== next) {
        selectedRef.current = next;
        setSelectedId(next);
      }
    };

    const pointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(hitTargets, false)[0]?.object;
      const runtime = hit ? runtimes.find((item) => item.hitTarget === hit) : undefined;
      if (runtime) {
        setIsTouch(true);
        if (selectedRef.current === runtime.config.id) {
          navigateRef.current(runtime.config.path);
        } else {
          selectedRef.current = runtime.config.id;
          setSelectedId(runtime.config.id);
        }
      } else {
        selectedRef.current = null;
        setSelectedId(null);
      }
    };

    renderer.domElement.addEventListener("pointermove", pointerMove);
    renderer.domElement.addEventListener("pointerdown", pointerDown);

    let visible = true;
    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    }, { threshold: 0 });
    visibilityObserver.observe(root);

    const resize = () => {
      const width = Math.max(1, root.clientWidth);
      const height = Math.max(1, root.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    const onMotionPreferenceChange = (event: MediaQueryListEvent) => { reducedMotion = event.matches; };
    reduceMotionQuery.addEventListener("change", onMotionPreferenceChange);
    resize();

    let frame = 0;
    let elapsed = 0;
    let previous = 0;
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      const delta = previous ? Math.min((now - previous) / 1000, 0.04) : 0;
      previous = now;
      if (visible && !document.hidden && selectedRef.current === null && !reducedMotion) elapsed += delta;
      if (!visible || document.hidden) return;
      core.rotation.y = Math.sin(elapsed * 0.18) * 0.08;
      core.rotation.z = Math.sin(elapsed * 0.12) * 0.035;
      coreRing.rotation.z = elapsed * 0.12;
      runtimes.forEach((runtime, index) => {
        const { config, group, orbit } = runtime;
        const angle = config.phase + elapsed * config.speed;
        const position = new THREE.Vector3(Math.cos(angle) * config.orbit, Math.sin(angle) * config.orbit * 0.56, Math.sin(angle * 1.7 + index) * 0.2);
        position.applyEuler(orbit);
        group.position.set(coreX + position.x, coreY + position.y, position.z);
        group.rotation.y = Math.sin(elapsed * 0.5 + index) * 0.22;
        group.scale.setScalar(selectedRef.current === config.id ? 1.22 : 1);
      });
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibilityObserver.disconnect();
      reduceMotionQuery.removeEventListener("change", onMotionPreferenceChange);
      renderer.domElement.removeEventListener("pointermove", pointerMove);
      renderer.domElement.removeEventListener("pointerdown", pointerDown);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry?.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material?.dispose();
        }
      });
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <div ref={rootRef} data-selected={selectedId ? "true" : "false"} className={`hxe-orbit-root ${className}`} onPointerLeave={() => { if (!isTouch) setSelectedId(null); }}>
      <canvas ref={canvasRef} className="hxe-orbit-canvas" aria-label="Interactive 3D HorizonX ecosystem orbit" />
      {webglFailed && (
        <div className="hxe-orbit-fallback" aria-label="Interactive HorizonX ecosystem orbit">
          <div className="hxe-fallback-system">
            <div className="hxe-fallback-core">
              <span className="hxe-fallback-petal p1" />
              <span className="hxe-fallback-petal p2" />
              <span className="hxe-fallback-petal p3" />
              <span className="hxe-fallback-petal p4" />
            </div>
            {SATELLITES.map((item) => (
              <div
                className="hxe-fallback-track"
                key={item.id}
                style={{
                  "--orbit": `${item.orbit * 72}px`,
                  "--duration": `${Math.max(22, 46 - item.speed * 55)}s`,
                  "--delay": `${-item.phase * 2.4}s`,
                  "--satellite-color": item.color,
                } as React.CSSProperties}
              >
                <button
                  type="button"
                  className={`hxe-fallback-satellite${selectedId === item.id ? " is-selected" : ""}`}
                  aria-label={`Explore ${item.name}`}
                  onPointerEnter={() => {
                    selectedRef.current = item.id;
                    setSelectedId(item.id);
                  }}
                  onFocus={() => {
                    selectedRef.current = item.id;
                    setSelectedId(item.id);
                  }}
                  onClick={() => {
                    if (selectedId === item.id) navigateRef.current(item.path);
                    else {
                      selectedRef.current = item.id;
                      setSelectedId(item.id);
                    }
                  }}
                >
                  <span>{item.symbol}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="hxe-orbit-vignette" aria-hidden="true" />
      {children}
      {selected && (
        <aside className="hxe-orbit-panel" aria-live="polite">
          <div className="hxe-orbit-panel-top">
            <span className="hxe-orbit-panel-dot" style={{ background: selected.color, boxShadow: `0 0 14px ${selected.color}` }} />
            <span>{selected.eyebrow}</span>
            <button type="button" aria-label="Close information panel" onClick={() => setSelectedId(null)}>×</button>
          </div>
          <h2>{selected.name}</h2>
          <p>{selected.description}</p>
          <div className="hxe-orbit-panel-detail">{selected.detail}</div>
          <button type="button" className="hxe-orbit-panel-link" onClick={() => navigate(selected.path)}>
            Explore {selected.name}<span aria-hidden="true">↗</span>
          </button>
        </aside>
      )}
      <div className="hxe-orbit-live" aria-live="polite">
        {selected ? `${selected.name}. ${selected.description}` : "HorizonX ecosystem orbit. Hover over an orbiting object to explore a functionality."}
      </div>
      <div className="hxe-orbit-accessible-controls" aria-label="Explore HorizonX functionalities">
        {SATELLITES.map((item) => (
          <button
            key={item.id}
            type="button"
            onFocus={() => { selectedRef.current = item.id; setSelectedId(item.id); }}
            onBlur={() => { selectedRef.current = null; setSelectedId(null); }}
            onClick={() => navigate(item.path)}
          >
            Explore {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

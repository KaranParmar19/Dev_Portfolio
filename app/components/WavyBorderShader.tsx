'use client';

import React, { useEffect, useRef, useState } from 'react';

export type WavyPreset = 'Gentle' | 'Calm' | 'Energetic' | 'Chaotic' | 'Pulse' | 'Ripple' | 'Custom';
export type WavyTrigger = 'In View' | 'On Hover' | 'On Scroll';
export type WavyEdgeMode = 'All' | 'Top/Bottom' | 'Left/Right' | 'Custom';

export interface WavyBorderShaderProps {
    borderColor?: string;
    backgroundColor?: string;
    preset?: WavyPreset;
    waveAmplitude?: number;
    waveFrequency?: number;
    waveSpeed?: number;
    borderThickness?: number;
    blur?: number;
    noiseIntensity?: number;
    trigger?: WavyTrigger;
    loop?: boolean;
    responsiveCorrection?: boolean;
    edgeMode?: WavyEdgeMode;
    topEdge?: boolean;
    bottomEdge?: boolean;
    leftEdge?: boolean;
    rightEdge?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const PRESETS: Record<WavyPreset, { amplitude: number; frequency: number; speed: number }> = {
    Gentle:    { amplitude: 0.01,  frequency: 5,  speed: 1.0 },
    Calm:      { amplitude: 0.015, frequency: 8,  speed: 1.5 },
    Energetic: { amplitude: 0.03,  frequency: 15, speed: 3.0 },
    Chaotic:   { amplitude: 0.05,  frequency: 25, speed: 5.0 },
    Pulse:     { amplitude: 0.025, frequency: 3,  speed: 2.0 },
    Ripple:    { amplitude: 0.02,  frequency: 20, speed: 2.5 },
    Custom:    { amplitude: 0.015, frequency: 8,  speed: 1.5 },
};

function parseColorToVec4(color: string): [number, number, number, number] {
    if (!color || color === 'transparent') {
        return [0, 0, 0, 0];
    }
    if (color.startsWith('#')) {
        let hex = color.slice(1);
        if (hex.length === 3) {
            hex = hex.split('').map((c) => c + c).join('');
        }
        if (hex.length === 6) {
            const num = parseInt(hex, 16);
            return [
                ((num >> 16) & 255) / 255,
                ((num >> 8) & 255) / 255,
                (num & 255) / 255,
                1.0,
            ];
        }
        if (hex.length === 8) {
            const num = parseInt(hex, 16);
            return [
                ((num >> 24) & 255) / 255,
                ((num >> 16) & 255) / 255,
                ((num >> 8) & 255) / 255,
                (num & 255) / 255,
            ];
        }
    }
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (match) {
        return [
            parseInt(match[1], 10) / 255,
            parseInt(match[2], 10) / 255,
            parseInt(match[3], 10) / 255,
            match[4] !== undefined ? parseFloat(match[4]) : 1.0,
        ];
    }
    return [0.067, 0.067, 0.067, 1.0]; // fallback #111111
}

export default function WavyBorderShader({
    borderColor = '#111111',
    backgroundColor = 'transparent',
    preset = 'Calm',
    waveAmplitude,
    waveFrequency,
    waveSpeed,
    borderThickness = 0.024,
    blur = 0.003,
    noiseIntensity = 0.2,
    trigger = 'In View',
    loop = true,
    responsiveCorrection = true,
    edgeMode = 'All',
    topEdge = true,
    bottomEdge = true,
    leftEdge = true,
    rightEdge = true,
    className = '',
    style = {},
    children,
}: WavyBorderShaderProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const timeRef = useRef(0);
    const requestRef = useRef(0);
    const [isInView, setIsInView] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    // Compute active wave values from preset or custom overrides
    const presetValues = PRESETS[preset] || PRESETS.Calm;
    const activeAmp = waveAmplitude !== undefined ? waveAmplitude : presetValues.amplitude;
    const activeFreq = waveFrequency !== undefined ? waveFrequency : presetValues.frequency;
    const activeSpeed = waveSpeed !== undefined ? waveSpeed : presetValues.speed;

    const propsRef = useRef({
        borderColor,
        backgroundColor,
        activeAmp,
        activeFreq,
        activeSpeed,
        borderThickness,
        blur,
        noiseIntensity,
        responsiveCorrection,
        edgeMode,
        topEdge,
        bottomEdge,
        leftEdge,
        rightEdge,
        trigger,
        loop,
        isInView,
        isHovered,
    });

    propsRef.current = {
        borderColor,
        backgroundColor,
        activeAmp,
        activeFreq,
        activeSpeed,
        borderThickness,
        blur,
        noiseIntensity,
        responsiveCorrection,
        edgeMode,
        topEdge,
        bottomEdge,
        leftEdge,
        rightEdge,
        trigger,
        loop,
        isInView,
        isHovered,
    };

    // IntersectionObserver for efficient performance when off-screen
    useEffect(() => {
        const target = containerRef.current || canvasRef.current;
        if (!target || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.05 }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    // WebGL setup and animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', {
            premultipliedAlpha: false,
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: false,
        });

        if (!gl) return;

        let cancelled = false;

        // Vertex Shader
        const vert = `
            attribute vec2 aPos;
            attribute vec2 aUV;
            varying vec2 vUv;
            void main() {
                vUv = aUV;
                gl_Position = vec4(aPos, 0.0, 1.0);
            }
        `;

        // Fragment Shader (faithful to Framer WavyBorderShader-1-dsPi with RGBA transparency support)
        const frag = `
            precision mediump float;
            varying vec2 vUv;
            uniform vec4 uBorder;
            uniform vec4 uBg;
            uniform float uTime;
            uniform float uAmp;
            uniform float uFreq;
            uniform float uSpeed;
            uniform float uThickness;
            uniform float uSoft;
            uniform float uNoise;
            uniform vec2 uMouse;
            uniform vec2 uRes;
            uniform float uResp;
            uniform int uEdgeTop;
            uniform int uEdgeBottom;
            uniform int uEdgeLeft;
            uniform int uEdgeRight;

            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }

            void main() {
                vec2 uv = vUv;
                float aspect = uRes.x / uRes.y;

                float fx = uFreq;
                float fy = uFreq;

                if (uResp > 0.5) {
                    if (aspect > 1.0) fx *= aspect;
                    else fy /= aspect;
                }

                // Distance to each edge
                float dTop = 1.0 - uv.y;
                float dBottom = uv.y;
                float dLeft = uv.x;
                float dRight = 1.0 - uv.x;

                // Sine wave displacement for each edge
                float wTop = sin(uv.x * fx * 1.3 + uTime * uSpeed * 1.1);
                float wBottom = sin(uv.x * fx * 1.3 + uTime * uSpeed * 1.1);
                float wLeft = sin(uv.y * fy + uTime * uSpeed);
                float wRight = sin(uv.y * fy + uTime * uSpeed);

                // Add procedural noise
                float n = (noise(uv * 8.0 + uTime * 0.2) - 0.5) * uNoise;
                wTop += n;
                wBottom += n;
                wLeft += n;
                wRight += n;

                // Scale by wave amplitude
                wTop *= uAmp;
                wBottom *= uAmp;
                wLeft *= uAmp;
                wRight *= uAmp;

                // Edge mask toggles
                if (uEdgeTop == 0) wTop = 0.0;
                if (uEdgeBottom == 0) wBottom = 0.0;
                if (uEdgeLeft == 0) wLeft = 0.0;
                if (uEdgeRight == 0) wRight = 0.0;

                // Thickness + wave contour
                float thTop = uThickness + wTop;
                float thBottom = uThickness + wBottom;
                float thLeft = uThickness + wLeft;
                float thRight = uThickness + wRight;

                // Smooth edge step
                float edgeTop = smoothstep(thTop, thTop - uSoft, dTop);
                float edgeBottom = smoothstep(thBottom, thBottom - uSoft, dBottom);
                float edgeLeft = smoothstep(thLeft, thLeft - uSoft, dLeft);
                float edgeRight = smoothstep(thRight, thRight - uSoft, dRight);

                // Combine edges
                float edge = max(max(edgeTop, edgeBottom), max(edgeLeft, edgeRight));

                // Smooth blend between background and border with alpha support
                vec4 col = mix(uBg, uBorder, edge);
                gl_FragColor = col;
            }
        `;

        const compile = (type: number, src: string) => {
            const s = gl.createShader(type);
            if (!s) return null;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(s));
            }
            return s;
        };

        const vs = compile(gl.VERTEX_SHADER, vert);
        const fs = compile(gl.FRAGMENT_SHADER, frag);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Quad covering clip space [-1, 1] with UV [0, 1]
        const quad = new Float32Array([
            -1.0, -1.0, 0.0, 0.0, // bottom-left
             1.0, -1.0, 1.0, 0.0, // bottom-right
            -1.0,  1.0, 0.0, 1.0, // top-left
             1.0,  1.0, 1.0, 1.0, // top-right
        ]);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

        const aPos = gl.getAttribLocation(program, 'aPos');
        const aUV = gl.getAttribLocation(program, 'aUV');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(aUV);
        gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 16, 8);

        // Uniform locations
        const u = {
            border: gl.getUniformLocation(program, 'uBorder'),
            bg: gl.getUniformLocation(program, 'uBg'),
            time: gl.getUniformLocation(program, 'uTime'),
            amp: gl.getUniformLocation(program, 'uAmp'),
            freq: gl.getUniformLocation(program, 'uFreq'),
            speed: gl.getUniformLocation(program, 'uSpeed'),
            thick: gl.getUniformLocation(program, 'uThickness'),
            soft: gl.getUniformLocation(program, 'uSoft'),
            noise: gl.getUniformLocation(program, 'uNoise'),
            mouse: gl.getUniformLocation(program, 'uMouse'),
            res: gl.getUniformLocation(program, 'uRes'),
            resp: gl.getUniformLocation(program, 'uResp'),
            edgeTop: gl.getUniformLocation(program, 'uEdgeTop'),
            edgeBottom: gl.getUniformLocation(program, 'uEdgeBottom'),
            edgeLeft: gl.getUniformLocation(program, 'uEdgeLeft'),
            edgeRight: gl.getUniformLocation(program, 'uEdgeRight'),
        };

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        let lastTime = performance.now();

        const render = (now: number) => {
            if (cancelled || !canvas) return;

            const delta = (now - lastTime) / 1000;
            lastTime = now;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = Math.floor(canvas.clientWidth * dpr);
            const h = Math.floor(canvas.clientHeight * dpr);

            if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
            }

            const p = propsRef.current;
            const shouldAnimate =
                p.trigger === 'In View' ? p.isInView :
                p.trigger === 'On Hover' ? p.isHovered :
                true;

            if (p.loop && shouldAnimate) {
                timeRef.current += delta;
            }

            let enableTop = true;
            let enableBottom = true;
            let enableLeft = true;
            let enableRight = true;

            if (p.edgeMode === 'Top/Bottom') {
                enableLeft = false;
                enableRight = false;
            } else if (p.edgeMode === 'Left/Right') {
                enableTop = false;
                enableBottom = false;
            } else if (p.edgeMode === 'Custom') {
                enableTop = p.topEdge;
                enableBottom = p.bottomEdge;
                enableLeft = p.leftEdge;
                enableRight = p.rightEdge;
            }

            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.uniform4fv(u.border, parseColorToVec4(p.borderColor));
            gl.uniform4fv(u.bg, parseColorToVec4(p.backgroundColor));
            gl.uniform1f(u.time, timeRef.current);
            gl.uniform1f(u.amp, p.activeAmp);
            gl.uniform1f(u.freq, p.activeFreq);
            gl.uniform1f(u.speed, p.activeSpeed);
            gl.uniform1f(u.thick, p.borderThickness);
            gl.uniform1f(u.soft, Math.max(0.0001, p.blur));
            gl.uniform1f(u.noise, p.noiseIntensity);
            gl.uniform2f(u.mouse, mouseRef.current.x, mouseRef.current.y);
            gl.uniform2f(u.res, Math.max(1, w), Math.max(1, h));
            gl.uniform1f(u.resp, p.responsiveCorrection ? 1.0 : 0.0);
            gl.uniform1i(u.edgeTop, enableTop ? 1 : 0);
            gl.uniform1i(u.edgeBottom, enableBottom ? 1 : 0);
            gl.uniform1i(u.edgeLeft, enableLeft ? 1 : 0);
            gl.uniform1i(u.edgeRight, enableRight ? 1 : 0);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            requestRef.current = requestAnimationFrame(render);
        };

        requestRef.current = requestAnimationFrame(render);

        return () => {
            cancelled = true;
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (gl && !gl.isContextLost()) {
                gl.deleteProgram(program);
                gl.deleteShader(vs);
                gl.deleteShader(fs);
                gl.deleteBuffer(buf);
            }
        };
    }, []);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
            mouseRef.current.x = (e.clientX - r.left) / r.width;
            mouseRef.current.y = 1 - (e.clientY - r.top) / r.height;
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
            style={style}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
        >
            <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 w-full h-full block"
                style={{ zIndex: 15 }}
            />
            {children && <div className="relative z-10 w-full h-full">{children}</div>}
        </div>
    );
}

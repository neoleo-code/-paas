import React, { useEffect, useRef } from 'react';

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5 + 0.5; // slight gravity
    this.maxLife = Math.random() * 40 + 40; // shorter life
    this.life = this.maxLife;
    this.size = Math.random() * 2.5 + 0.5;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const color = useRef('#00C6FF');
  const isMoving = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      isMoving.current = true;
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        isMoving.current = false;
      }, 100);

      const target = e.target as HTMLElement;
      const targetColor = target.closest('[data-particle-color]')?.getAttribute('data-particle-color');
      color.current = targetColor || '#00C6FF';

      // Add particles
      for (let i = 0; i < 2; i++) {
        particles.current.push(new Particle(mouse.current.x, mouse.current.y, color.current));
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          particles.current.splice(i, 1);
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}

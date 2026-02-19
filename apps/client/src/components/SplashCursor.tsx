import React, { useEffect, useRef } from 'react';

class Pointer {
    x: number;
    y: number;
    radius: number;
    color: string;
    dx: number;
    dy: number;
    life: number;
    decay: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 8 + 2;
        // Colorful splash colors
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * 2 * Math.PI;
        const velocity = Math.random() * 2 + 1;
        this.dx = Math.cos(angle) * velocity;
        this.dy = Math.sin(angle) * velocity;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.radius -= 0.05;
        this.life -= this.decay;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.closePath();
    }
}

const SplashCursor: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointers = useRef<Pointer[]>([]);
    const animationFrameId = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const handleMouseMove = (e: MouseEvent) => {
            for (let i = 0; i < 4; i++) {
                pointers.current.push(new Pointer(e.clientX, e.clientY));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < pointers.current.length; i++) {
                const p = pointers.current[i];
                p.update();
                p.draw(ctx);
                if (p.life <= 0 || p.radius <= 0) {
                    pointers.current.splice(i, 1);
                    i--;
                }
            }

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default SplashCursor;

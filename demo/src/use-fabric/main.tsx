import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'

export type Hook = {
    Canvas: JSX.Element,
    canvas: fabric.Canvas | "loading" | "error"
}

export type Config = Omit<fabric.ICanvasOptions, "width" | "height">;

/**
 * FabricJS Canvas + Canvas Element
 * - Canvas size automatically fits its parent
 * - Listens for window resizes
 */
export function useFabric(options: Config = {}): Hook {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const frameRef = useRef<HTMLElement | null>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas|"loading"|"error">("loading");
    const loaded = useRef(false);

    const resizeCanvas = useCallback(() => {
        if (canvas instanceof fabric.Canvas && frameRef.current) {
            const width = frameRef.current.offsetWidth;
            const height = frameRef.current.offsetHeight;
            canvas.setWidth(width);
            canvas.setHeight(height);
            canvas.renderAll();
        }
    }, [canvas]);

    useEffect(() => {
        if (canvas === "loading" && canvasRef.current && frameRef.current && !loaded.current) {
            loaded.current = true;
            const width = frameRef.current.offsetWidth;
            const height = frameRef.current.offsetHeight;
            const canvas = new fabric.Canvas(canvasRef.current, {
                ...options, width, height
            });
            setCanvas(canvas);
        }
        else if(canvas === "loading" && !loaded.current)
            setCanvas("error")

        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [canvas, options, resizeCanvas]);

    const Canvas = (
        <section ref={frameRef} style={{width: "100%", height: "100%"}}>
            <canvas ref={canvasRef} />
        </section>
    )
    return { Canvas, canvas };
}

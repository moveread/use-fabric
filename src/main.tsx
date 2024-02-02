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

            const resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    if (canvas instanceof fabric.Canvas) {
                        canvas.setWidth(width);
                        canvas.setHeight(height);
                        canvas.renderAll();
                    }
                }
            })
            if (frameRef.current) {
                resizeObserver.observe(frameRef.current);
            }
    
            // Cleanup function to stop observing
            return () => {
                if (frameRef.current)
                    resizeObserver.unobserve(frameRef.current);
            };
    }, [canvas, options]);

    const Canvas = (
        <section ref={frameRef} style={{width: "100%", height: "100%"}}>
            <canvas ref={canvasRef} />
        </section>
    )
    return { Canvas, canvas };
}

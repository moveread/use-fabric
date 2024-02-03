import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'

export type Hook = {
    Canvas: JSX.Element,
    canvas: fabric.Canvas | "loading" | "error"
    reset(): void
}

export type Config = Omit<fabric.ICanvasOptions, "width" | "height"> & {
    forceReload?: boolean
    listenResize?: boolean
};
const defaultCfg: Config = { forceReload: true, listenResize: false }

/**
 * FabricJS Canvas + Canvas Element
 * - Canvas size automatically fits its parent
 */
export function useFabric(config: Config = {}): Hook {
    const options = {...defaultCfg, ...config}
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const frameRef = useRef<HTMLElement | null>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas|"loading"|"error">("loading");
    const loaded = useRef(false);

    function init() {
        if (!frameRef.current)
            return
        loaded.current = true;
        const width = frameRef.current.offsetWidth;
        const height = frameRef.current.offsetHeight;
        console.debug(`[use-fabric]: New canvas with size [${width}, ${height}]`)
        const canvas = new fabric.Canvas(canvasRef.current, {
            ...options, width, height
        });
        setCanvas(canvas);
    }

    useEffect(() => {
        if (canvas === "loading" && canvasRef.current && frameRef.current && !loaded.current) {
            init()
        }
        else if(canvas === "loading" && !loaded.current)
            setCanvas("error")

        if (!config.listenResize)
            return
        
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

    const key = config.forceReload ? `${Date.now()}` : undefined

    const Canvas = (
        <section ref={frameRef} style={{width: "100%", height: "100%"}}>
            <canvas ref={canvasRef} key={key} />
        </section>
    )
    return { Canvas, canvas, reset: init };
}

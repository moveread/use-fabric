import React, { HTMLProps, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'

export type Hook = {
	Canvas: JSX.Element,
	canvas: fabric.Canvas | null
	reset(): void
}

/**
 * FabricJS Canvas + Canvas Element
 */
export function useFabric(
	config?: fabric.ICanvasOptions,
	canvasProps?: HTMLProps<HTMLCanvasElement>,
	canvasRef?:  MutableRefObject<HTMLCanvasElement> | ((node: HTMLCanvasElement) => void)
): Hook {
	const internalRef = useRef<HTMLCanvasElement|null>(null)
	const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
	const loaded = useRef(false)

	const setRef = useCallback((node: HTMLCanvasElement) => {
		internalRef.current = node;
		if (typeof canvasRef === 'function') {
				canvasRef(node);
		} else if (canvasRef) {
				canvasRef.current = node;
		}
}, [canvasRef]);

	const init = useCallback(() => {
		const parent = internalRef.current?.parentElement
		const canvas = new fabric.Canvas(internalRef.current, {
			width: parent?.clientWidth, height: parent?.clientHeight,
			...config
		})
		setCanvas(canvas)
	}, [config])
	
	const reset = useCallback(() => {
		if (canvas) {
			canvas.dispose()
			setCanvas(null)
		}
		setTimeout(init, 0);
	}, [canvas, init])

	useEffect(() => {
		if (!loaded.current) {
			loaded.current = true
			init()
		}
	}, [config, init])

	const Canvas = <canvas ref={setRef} {...canvasProps} />

	return { canvas, Canvas, reset }
}

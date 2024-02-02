# Use Canvas

> React Hooks API for FabricJS canvas

## Installation

```bash
npm i use-canvas
```

```bash
yarn add use-canvas
```

## Usage

```jsx
import { fabric } from 'fabric'
import { useFabric } from 'use-fabric'

function MyComponent() {

  const { canvas, Canvas } = useFabric({ backgroundColor: 'lightgray' }) // usual fabric.Canvas params

  function drawCircle() {
    if (canvas === 'error' || canvas === 'loading')
      return

    const circle = new fabric.Circle({...})
    canvas.add(circle)
  }

  return (
    <div>
      ...
      {Canvas}
    </div>
  )
}
```

## Fabric dependency

Fabric depends on `canvas`, which is huge (>150 MB). We only depend on `fabric` as a peer dependency so that you're not forced to package it (and can use a CDN instead)
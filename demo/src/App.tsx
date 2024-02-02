import styled from "styled-components"
import { useFabric } from "./use-fabric/main"
import { useEffect, useState } from "react"
import { fabric } from "fabric"

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
  & > * { margin: 0 auto; }
`
const Btns = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`
const Frame = styled.div`
  aspect-ratio: 2;
`

function App() {
  const { canvas, Canvas } = useFabric({ backgroundColor: 'lightgray' })
  const [width, setWidthRaw] = useState(0.5)
  const setWidth = (w: number) => setWidthRaw(Math.max(0, Math.min(w, 1)))
  useEffect(() => {
    if (canvas === 'loading' || canvas === 'error')
      return
    const square = new fabric.Rect({ width: 128, height: 64, fill: 'darkred' })
    canvas.add(square)
  }, [canvas])
  return (
    <Layout>
      <Btns>
        <button onClick={() => setWidth(width + 0.1)}>Enlarge</button>
        <button onClick={() => setWidth(width - 0.1)}>Shrink</button>
      </Btns>
      <Frame style={{ width: `${width * 100}%` }}>
        {Canvas}
      </Frame>
    </Layout>
  )
}

export default App

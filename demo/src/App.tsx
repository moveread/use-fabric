import styled from "styled-components"
import { useFabric } from "./use-fabric/main"
import { useEffect } from "react"
import { fabric } from "fabric"

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Frame = styled.div`
  width: 60%;
  height: 80%;
`

function App() {
  const { canvas, Canvas } = useFabric({ backgroundColor: 'lightgray' })
  useEffect(() => {
    if (canvas === 'loading' || canvas === 'error')
      return
    const square = new fabric.Rect({ width: 128, height: 64, fill: 'darkred' })
    canvas.add(square)
  }, [canvas])
  return (
    <Layout>
      <Frame>
        {Canvas}
      </Frame>
    </Layout>
  )
}

export default App

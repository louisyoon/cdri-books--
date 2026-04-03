import Header from "@/components/Header"
import { useEffect, useState } from "react"
import Section1 from "./components/Main/Section1";
import Section2 from "./components/Main/Section2";

function App() {
  const [tab, setTab] = useState<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tab])

  const TabSection = tab === 0 ? <Section1 /> : <Section2 />

  return (
    <>
      <Header
        tab={tab}
        setTab={setTab}
      />
      <main className="min-h-dvh">
        {TabSection}
      </main>
    </>
  )
}

export default App

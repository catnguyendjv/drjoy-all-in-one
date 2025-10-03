import { useState } from "react"

import "./style.css"

/**
 * The new tab page component.
 * This component displays a welcome message and an input field on the new tab page.
 * @returns {JSX.Element} The rendered new tab page.
 */
function IndexNewtab() {
  /**
   * State for the input field's value.
   * `useState` is a React Hook that lets you add a state variable to your component.
   */
  const [data, setData] = useState("")

  return (
    <div
      className="new-tab"
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column"
      }}>
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h1>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <footer>Crafted by @PlasmoHQ</footer>
    </div>
  )
}

export default IndexNewtab

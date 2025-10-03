import { useState } from "react"

/**
 * The main popup component for the extension.
 * This component features a basic UI with a text input field.
 * @returns {JSX.Element} The rendered popup component.
 */
function IndexPopup() {
  /**
   * State for the input field's value.
   * `useState` is a React Hook that lets you add a state variable to your component.
   */
  const [data, setData] = useState("")

  return (
    <div>
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h1>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <footer>Crafted by @PlasmoHQ</footer>
    </div>
  )
}

export default IndexPopup

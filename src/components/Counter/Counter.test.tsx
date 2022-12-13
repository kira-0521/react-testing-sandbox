import { fireEvent, render, screen } from "@testing-library/react"

import { Counter } from "./Counter"

// スナップショットテストは「変更検知」のために利用する
describe("Counter", () => {
  test("render", () => {
    // const { asFragment } = render(<Counter />)
    // expect(asFragment()).toMatchSnapshot()
    const { getByText } = render(<Counter />)
    getByText("Count: 0")

    screen.debug(screen.getByText("Count: 0"))
  })

  test("click:count", () => {
    render(<Counter />)
    const button = screen.getByText("Increment")
    screen.debug(button)
    fireEvent.click(button)
    fireEvent.click(button)
    screen.getByText("Count: 2")
  })
})

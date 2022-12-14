import { fireEvent, render, screen } from "@testing-library/react"
import { act } from "react-dom/test-utils"

import { AsyncCounter } from "./AsyncCounter"

const BUTTON_TEXT = "AsyncIncrement"

describe("AsyncCounter", () => {
  test("render", () => {
    const { asFragment } = render(<AsyncCounter />)
    expect(asFragment()).toMatchSnapshot()
  })

  describe("click:count:カウントアップ", () => {
    test("ボタン押下1秒後は1カウントアップ", () => {
      jest.useFakeTimers()
      render(<AsyncCounter />)
      const button = screen.getByText(BUTTON_TEXT)
      fireEvent.click(button)
      // NOTE: Should wrapped react state update event & react rendered.
      // https://ja.reactjs.org/docs/testing-recipes.html#act
      act(() => {
        jest.runAllTimers()
      })
      screen.getByText("AsyncCount: 1")
      jest.useRealTimers()
    })
  })

  describe("click:count:ボタン活性・非活性", () => {
    test("ボタン押下直後はボタンが非活性", () => {
      render(<AsyncCounter />)
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      expect(button).toBeDisabled()
    })
    test("ボタン押下 1 秒後はボタンが活性", () => {
      jest.useFakeTimers() /** 時間詐称 */
      render(<AsyncCounter />)
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      act(() => {
        jest.runAllTimers()
      })
      expect(button).not.toBeDisabled()
      jest.useRealTimers() /** 時を戻そう */
    })
  })

  describe("click:count:ローディング UI", () => {
    test("ボタン押下直後はローディングが表示", () => {
      render(<AsyncCounter />)
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      expect(screen.queryByText("...Loading")).toBeInTheDocument()
    })
    test("ボタン押下直後はローディングが非表示", () => {
      jest.useFakeTimers() /** 時間詐称 */
      render(<AsyncCounter />)
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      act(() => {
        jest.runAllTimers()
      })
      expect(screen.queryByText("...Loading")).not.toBeInTheDocument()
      jest.useRealTimers() /** 時を戻そう */
    })
  })
})

import { fireEvent, render, screen } from "@testing-library/react"
import { act } from "react-dom/test-utils"

import { AsyncCounter } from "./AsyncCounter"

const BUTTON_TEXT = "AsyncIncrement"
const LOADING_TEXT = "...Loading"

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
      const button = screen.getByText(BUTTON_TEXT)
      fireEvent.click(button)
      expect(button).toBeDisabled()
    })

    test("ボタン押下1秒後はボタンが活性化", () => {
      jest.useFakeTimers()
      render(<AsyncCounter />)
      const button = screen.getByText(BUTTON_TEXT)
      fireEvent.click(button)
      act(() => {
        // 全てのマクロタスクとマイクロタスクを処理 => 要するに全ての非同期処理を処理
        jest.runAllTimers()
      })
      expect(button).toBeEnabled()
      jest.useRealTimers()
    })
  })

  describe("click:count:ローディング UI", () => {
    test("ボタン押下直後はローディングUIが表示される", () => {
      render(<AsyncCounter />)
      const button = screen.getByText(BUTTON_TEXT)
      fireEvent.click(button)
      const loading = screen.getByText(LOADING_TEXT)
      expect(loading).toBeInTheDocument()
    })

    test("ボタン押下1秒後はローディングUIが非表示になる", () => {
      jest.useFakeTimers()
      render(<AsyncCounter />)
      const button = screen.getByText(BUTTON_TEXT)
      fireEvent.click(button)
      act(() => {
        jest.runAllTimers()
      })
      expect(screen.queryByText(LOADING_TEXT)).not.toBeInTheDocument()
      jest.useRealTimers()
    })
  })
})

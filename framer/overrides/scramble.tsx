import type { ComponentType, CSSProperties } from "react"
import { useRef, useEffect, forwardRef, useCallback } from "react"

export function scramble(Component): ComponentType {
    return (props) => {
        const ref = useRef(null)

        useEffect(() => {
            if (
                location.host.endsWith("framercanvas.com") &&
                !location.search.startsWith("?target=preview-web")
            ) {
                return
            }

            const el = ref?.current?.querySelector(".framer-text")

            if (!el) return

            const fn = new TextScramble(el)

            fn.setText(el.innerText)
        }, [])

        return <Component {...props} ref={ref} />
    }
}

class TextScramble {
    private el: HTMLElement
    private chars = "!-$x____+*0"

    constructor(el: HTMLElement) {
        this.el = el
    }

    setText = (newText: string): Promise<void> => {
        const oldText = this.el.innerText
        const length = Math.max(oldText.length, newText.length)
        const promise = new Promise<void>((resolve) => (this.resolve = resolve))
        this.queue = []

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || ""
            const to = newText[i] || ""
            const start = Math.floor(Math.random() * 40)
            const end = start + Math.floor(Math.random() * 40)
            this.queue.push({ from, to, start, end })
        }

        cancelAnimationFrame(this.frameRequest)
        this.frame = 0
        this.update()

        return promise
    }

    update = (): void => {
        let output = ""
        let complete = 0

        for (let i = 0, n = this.queue.length; i < n; i++) {
            const { from, to, start, end, char } = this.queue[i]

            if (this.frame >= end) {
                complete++
                output += to
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    this.queue[i].char = this.randomChar()
                }

                output += `<span>${this.queue[i].char}</span>`
            } else {
                output += from
            }
        }

        this.el.innerHTML = output

        if (complete === this.queue.length) {
            this.resolve()
        } else {
            this.frameRequest = requestAnimationFrame(this.update)
            this.frame++
        }
    }

    randomChar = (): string => {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
    }

    private frame = 0
    private queue: {
        from: string
        to: string
        start: number
        end: number
        char?: string
    }[] = []
    private resolve!: () => void
    private frameRequest!: number
}

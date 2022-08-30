import { inputToValidMath } from './functionManipulations.js'

let stop = false
function f(x, y) {
    try {
        return eval(inputToValidMath(input.value))
    } catch (e) {
        stop = true
    }
}

const input = document.querySelector('input')
input.oninput = debounce(run, 1000)

const size = 12

const results = {}

const steps = 0.5

const maxHeight = 90

const floorContainer = document.createElement('div')
floorContainer.className = 'container floor'

const container = document.createElement('div')
container.className = 'container'
document.body.appendChild(container)
container.appendChild(floorContainer)
function render() {
    container.innerHTML = ''
    container.appendChild(floorContainer)

    let maxValue = result(-size, -size)
    let minValue = result(-size, -size)
    for (let x = -size; x <= size; x += steps) {
        for (let y = -size; y <= size; y += steps) {
            const value = result(x, y)
            if (isNaN(value)) continue
            if (isNaN(maxValue)) maxValue = value
            if (isNaN(minValue)) minValue = value
            if (value > maxValue) maxValue = value
            if (value < minValue) minValue = value
        }
    }

    for (let y = size; y >= -size; y -= steps) {
        const lineDiv = document.createElement('div')
        lineDiv.className = 'line'
        for (let x = -size; x <= size; x += steps) {
            const resultDiv = cube()

            const current = result(y, x)
            if (!isNaN(current)) {
                const mapped = map(minValue, maxValue, current)
                resultDiv.style.setProperty('--bg', `hsl(${mapped * 360} 100% 50%)`)
                resultDiv.style.transform = `translateZ(${current}px)`
                //resultDiv.style.transform = `translateZ(${mapped * maxHeight}px)`
            }
            lineDiv.appendChild(resultDiv)
        }
        container.appendChild(lineDiv)
    }
}
function map(min, max, value) {
    return (value - min) / (max - min)
}

function result(x, y) {
    return results[`x${x}y${y}`]
}
function setResult(x, y, z) {
    results[`x${x}y${y}`] = z
}

function cube() {
    const div = document.createElement('div')
    div.className = 'result cube'

    /*
    const front = document.createElement('div')
    front.className = 'face front'

    const right = document.createElement('div')
    right.className = 'face right'

    const back = document.createElement('div')
    back.className = 'face back'

    const left = document.createElement('div')
    left.className = 'face left'

    const top = document.createElement('div')
    top.className = 'face top'

    const bottom = document.createElement('div')
    bottom.className = 'face bottom'

    div.appendChild(front)
    div.appendChild(right)
    div.appendChild(back)
    div.appendChild(left)
    div.appendChild(top)
    div.appendChild(bottom)
    */

    return div
}

function run() {
    stop = false
    for (let y = size; y >= -size; y -= steps) {
        if (stop) break
        for (let x = -size; x <= size; x += steps) {
            if (stop) break
            const z = f(x, y)
            setResult(x, y, z)
        }
    }

    render()
}

function debounce(cb, delay = 200, ignoredCb) {
    let timeout

    return (...args) => {
        if (ignoredCb) ignoredCb(...args)
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

document.body.onwheel = ({ deltaY }) => {
    let curAngle = +getComputedStyle(container).getPropertyValue('--angle').replace('deg', '')
    const newAngle = (curAngle += 5 * (deltaY > 0 ? 1 : -1))
    container.style.setProperty('--angle', `${clamp(0, 85, newAngle)}deg`)
}
function clamp(min, max, value) {
    return Math.max(min, Math.min(max, value))
}

run()

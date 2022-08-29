let stop = false
function f(x, y) {
    try {
        const value = eval(input.value)
        return value
    } catch (e) {
        stop = true
    }
}

const input = document.querySelector('input')
input.oninput = debounce(run, 1000)

const size = 25

const results = {}

const steps = 1

const container = document.createElement('div')
container.className = 'container'
document.body.appendChild(container)
function render() {
    container.innerHTML = ''

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
            const resultDiv = document.createElement('div')
            resultDiv.className = 'result'

            if (!isNaN(result(y, x))) {
                const mapped = map(minValue, maxValue, result(y, x))
                resultDiv.style.backgroundColor = `hsl(${mapped * 360} 100% 50%)`
                resultDiv.style.transform = `translateZ(${mapped * 70}px)`
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
run()

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

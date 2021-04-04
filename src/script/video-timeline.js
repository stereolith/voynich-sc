const DOT_SIZE = 15
let video

function init() {
    const chapterWrapper = document.querySelector('.chapter-timeline')
    if (chapterWrapper) {
        const markers = JSON.parse(chapterWrapper.getAttribute('data-markers'))
        const markersArr = Object.entries(markers).map(k => ({
            time: parseInt(k[0]),
            label: k[1]
        }))

        video = document.querySelector('.video-wrapper video')
        buildTimeline(markersArr, video.duration)

        // updateTimeline(3000, video.duration)
        setInterval(() => {
            updateTimeline(video.currentTime, video.duration)
        }, 1000);
    }

    
}

function buildTimeline(markers, duration) {
    let svgRoot = document.querySelector('.timeline-inner > svg')
    let svgMaskG = document.querySelector('.timeline-inner > svg .mask-g')
    let timeLinks = document.querySelector('.time-links')

    const timelineSize = svgRoot.getBoundingClientRect().width
    
    const labelPositions = []
    for (const {time, label} of markers) {
        let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('class', 'circle')
        circle.setAttribute('width', '10px')
        circle.setAttribute('height', '10px')
        circle.setAttribute('cy', '22.5')
        circle.setAttribute('r', '7px')

        const cx = (time/duration * timelineSize) + DOT_SIZE/2
        circle.setAttribute('cx', cx)

        let cloneFill = circle.cloneNode(true)
        cloneFill.setAttribute('class', 'circle-fill')
        svgRoot.prepend(circle)
        svgMaskG.appendChild(cloneFill)

        let linkTemplate = document.querySelector('#time-link')
        let timecode = linkTemplate.content.querySelector('.timecode')
        let title = linkTemplate.content.querySelector('.title')
        timecode.textContent = timecodeString(time)
        title.textContent = label
        const position = (time/duration * timelineSize)
        labelPositions.push(position)
        let clone = document.importNode(linkTemplate.content, true)
        timeLinks.appendChild(clone)
    }

    let positionWidths = [labelPositions[0]]
    for (let i = 1; i < labelPositions.length; i++) {
        positionWidths.push(labelPositions[i] - labelPositions[i-1])
    }
    if (timelineSize - labelPositions[labelPositions.length - 1] < 120) {
        positionWidths[positionWidths.length - 1] = (timelineSize - labelPositions[labelPositions.length - 1]) / 2
        timeLinks.setAttribute('data-last-overflow', 'true')
    }
    console.log(positionWidths)
    timeLinks.setAttribute('style', `grid-template-columns: ${positionWidths.map(p => p + 'px').join(" ")} repeat(auto-fit, minmax(50px, 1fr))`)

}

function updateTimeline(position, duration) {
    var maskRect = document.querySelector('#mask > rect')
    maskRect.setAttribute('x', `-${(1-position/duration)*100}%`)
}

function timecodeString(seconds) {
    const minutes = Math.round(seconds / 60)
    const s = Math.round(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

window.addEventListener('load', init)

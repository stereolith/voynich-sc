const DOT_SIZE = 15
let video

function init() {
    const chapterWrapper = document.querySelector('.chapter-timeline')
    if (chapterWrapper && markers.length) {
        video = document.querySelector('.video-wrapper video')
        buildTimeline(markers, video.duration)
        setupTimeLinkClickHandlers(video)

        // updateTimeline(3000, video.duration)
        setInterval(() => {
            updateTimeline(video.currentTime, video.duration)
            updateActiveTimeLink(video.currentTime)
        }, 1000);

        window.addEventListener("resize", () => {
            buildTimeline(markersArr, video.duration)
            setupTimeLinkClickHandlers(video)
        })
    } else {
        document.querySelector('.chapter-timeline').remove()
    }
}

function buildTimeline(markers, duration) {
    const mobile = window.innerWidth < 600
    let svgRoot = document.querySelector('.timeline-inner .timeline-svg-desktop')
    let svgMaskG = document.querySelector('.timeline-inner .timeline-svg-desktop .mask-g')
    let timeLinks = document.querySelector('.time-links')

    const timelineSize = svgRoot.getBoundingClientRect().width

    // reset DOM manipulation
    document.querySelectorAll(".circle, .circle-fill").forEach(e => e.parentNode.removeChild(e));
    document.querySelectorAll(".time-links .time-link").forEach(e => e.parentNode.removeChild(e));

    const labelPositions = []
    for (const {time, title} of markers) {
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
        let titleEl = linkTemplate.content.querySelector('.title')
        timecode.textContent = timecodeString(time)
        titleEl.textContent = title
        linkTemplate.content.querySelector('.time-link').setAttribute('data-time', time)
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
        positionWidths[positionWidths.length - 1] = (timelineSize - labelPositions[labelPositions.length - 1])
        timeLinks.setAttribute('data-last-overflow', 'true')
    }
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

function updateActiveTimeLink(position) {
    let timeLinks = document.querySelectorAll('.time-link')
    let activeIndex = 0
    timeLinks.forEach((link, index) => {
        if (position >= link.getAttribute('data-time')) activeIndex = index
    })

    const activeLinkEl = document.querySelector('.time-link.active')
    if (activeLinkEl) activeLinkEl.setAttribute('class', 'time-link')
    timeLinks[activeIndex].setAttribute('class', 'time-link active')
}

function setupTimeLinkClickHandlers(video) {
    let timeLinks = document.querySelectorAll('.time-link')
    timeLinks.forEach(e => {
        e.addEventListener("click", () => {
            video.currentTime = e.getAttribute('data-time')
            video.play()
            updateTimeline(video.currentTime, video.duration)
            updateActiveTimeLink(video.currentTime)
        })
    })
}

window.addEventListener('load', init)

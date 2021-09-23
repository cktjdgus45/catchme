'use strict'

const start = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
            mediaSource: "screen",
        }
    })
}

start();
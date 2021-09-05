function readImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader()
        console.dir(reader);
        reader.onload = e => {
            console.dir(e.target);
            const previewImage = document.getElementById("preview-image")
            previewImage.src = e.target.result
        }
        reader.readAsDataURL(input.files[0])
    }
}
const inputImage = document.querySelector(".input-image")
inputImage.addEventListener("change", e => {
    readImage(e.target)
})




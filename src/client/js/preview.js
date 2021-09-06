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
(function (document, url) {
    const script = document.createElement("script");
    script.src = url;
    script.id = "canva-api"
    script.onload = () => {
        // API initialization
        (async () => {
            if (!window.Canva || !window.Canva.DesignButton) {
                return;
            }
            const api = await window.Canva.DesignButton.initialize({
                apiKey: "vTdFELO2OQBirLxwqyreI0EfqZcsBKnRtThGqFDAmWM=",
            });
            const button = document.querySelector("button");

            button.onclick = () => {
                api.createDesign({
                    design: {
                        type: "Poster",
                    },
                    onDesignOpen: (opts) => {
                        console.log(opts);
                    },
                });
            };
        })();
    };
    document.body.appendChild(script);
})(document, "https://sdk.canva.com/designbutton/v2/api.js");


const inputImage = document.querySelector(".input-image")
inputImage.addEventListener("change", e => {
    readImage(e.target)
})





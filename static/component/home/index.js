export class HomePage {
    constructor() {
        this.divElement = document.createElement("div");
        this.playButton = document.createElement("button");
        this.onPlayClickListener = null;
        // Container
        this.divElement.classList.add("home-container");
        this.divElement.style.display = "flex";
        this.divElement.style.flexDirection = "column";
        this.divElement.style.alignItems = "center";
        this.divElement.style.justifyContent = "center";
        this.divElement.style.height = "100vh";
        this.divElement.style.textAlign = "center";
        this.divElement.style.gap = "2rem";
        // Title
        const title = document.createElement("h1");
        title.innerText = "LightJoy - Cloud Gaming Platform";
        title.style.fontSize = "3rem";
        title.style.margin = "0";
        title.style.color = "#fff";
        this.divElement.appendChild(title);
        // Subtitle
        const subtitle = document.createElement("p");
        subtitle.innerText = "Play your favorite games anywhere, anytime";
        subtitle.style.fontSize = "1.2rem";
        subtitle.style.margin = "0";
        subtitle.style.color = "#aaa";
        this.divElement.appendChild(subtitle);
        // Play Button
        this.playButton.innerText = "Play";
        this.playButton.classList.add("play-button");
        this.playButton.style.padding = "1rem 3rem";
        this.playButton.style.fontSize = "1.2rem";
        this.playButton.style.cursor = "pointer";
        this.playButton.style.backgroundColor = "#007bff";
        this.playButton.style.color = "white";
        this.playButton.style.border = "none";
        this.playButton.style.borderRadius = "8px";
        this.playButton.style.transition = "background-color 0.3s";
        this.playButton.onmouseenter = () => {
            this.playButton.style.backgroundColor = "#0056b3";
        };
        this.playButton.onmouseleave = () => {
            this.playButton.style.backgroundColor = "#007bff";
        };
        this.playButton.addEventListener("click", () => {
            if (this.onPlayClickListener) {
                this.onPlayClickListener();
            }
        });
        this.divElement.appendChild(this.playButton);
    }
    addPlayClickListener(listener) {
        this.onPlayClickListener = listener;
    }
    mount(parent) {
        parent.appendChild(this.divElement);
    }
    unmount(parent) {
        parent.removeChild(this.divElement);
    }
    handleEvent(event) {
        // No events to handle for now
    }
}

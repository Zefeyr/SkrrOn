var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class CanvasRenderer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext("2d");
        this.videoTrack = null;
        this.trackProcessor = null;
        this.readableStream = null;
        this.frameReader = null;
        this.pendingFrame = null;
        this.onFrame = this.onFrame.bind(this);
    }
    setVideoTrack(track) {
        if (this.videoTrack === track) {
            return;
        }
        this.stopRendering(); // Stop any existing rendering
        this.videoTrack = track;
        if (this.videoTrack) {
            if (!("MediaStreamTrackProcessor" in window)) {
                console.error("MediaStreamTrackProcessor not supported in this browser.");
                // Fallback or error handling if API is not available
                return;
            }
            try {
                this.trackProcessor = new MediaStreamTrackProcessor({ track: this.videoTrack });
                this.readableStream = this.trackProcessor.readable;
                this.frameReader = this.readableStream.getReader();
                this.startRendering();
            }
            catch (e) {
                console.error("Error creating MediaStreamTrackProcessor:", e);
            }
        }
    }
    startRendering() {
        if (this.frameReader && !this.pendingFrame) {
            this.readAndDrawFrame();
        }
    }
    stopRendering() {
        if (this.frameReader) {
            this.frameReader.cancel();
            this.frameReader = null;
        }
        if (this.trackProcessor) {
            this.trackProcessor.readable.cancel();
            this.trackProcessor = null;
        }
        if (this.pendingFrame) {
            this.pendingFrame.close();
            this.pendingFrame = null;
        }
        this.videoTrack = null;
    }
    readAndDrawFrame() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.frameReader) {
                return;
            }
            try {
                const { value, done } = yield this.frameReader.read();
                if (done) {
                    this.stopRendering();
                    return;
                }
                this.pendingFrame = value;
                requestAnimationFrame(this.onFrame);
            }
            catch (e) {
                console.error("Error reading video frame:", e);
                this.stopRendering();
            }
        });
    }
    onFrame() {
        if (!this.ctx || !this.pendingFrame || !this.canvas) {
            this.readAndDrawFrame(); // Try to read next frame if current is null
            return;
        }
        const frame = this.pendingFrame;
        this.pendingFrame = null; // Clear pending frame
        // Calculate aspect ratios
        const canvasAspect = this.canvas.clientWidth / this.canvas.clientHeight;
        const frameAspect = frame.displayWidth / frame.displayHeight;
        let drawWidth;
        let drawHeight;
        let offsetX = 0;
        let offsetY = 0;
        // Adjust canvas rendering resolution to match the video frame's intrinsic resolution
        // This ensures that the image data drawn onto the canvas has the correct pixel density
        // and avoids blurriness that can occur if the canvas's internal resolution
        // is different from the source video frame's resolution.
        this.canvas.width = frame.displayWidth;
        this.canvas.height = frame.displayHeight;
        if (canvasAspect > frameAspect) {
            // Canvas is wider than the video frame, so the video will be pillarboxed.
            drawHeight = this.canvas.height;
            drawWidth = drawHeight * frameAspect;
            offsetX = (this.canvas.width - drawWidth) / 2;
        }
        else {
            // Canvas is taller than the video frame, so the video will be letterboxed.
            drawWidth = this.canvas.width;
            drawHeight = drawWidth / frameAspect;
            offsetY = (this.canvas.height - drawHeight) / 2;
        }
        // Clear the canvas before drawing the new frame to prevent artifacts
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight);
        frame.close(); // Close the VideoFrame to release resources
        this.readAndDrawFrame(); // Read the next frame
    }
    destroy() {
        this.stopRendering();
        this.canvas = null;
        this.ctx = null;
    }
}

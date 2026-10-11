export class VideoAnalyzer {
  constructor(canvasElement) {
    this.canvas = canvasElement || document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }
  
  async extractFrames(file, fps = 3) {
    if (file.type.startsWith('image/')) {
       return [await this.loadImage(file)];
    }
    return this.extractVideoFrames(file, fps);
  }
  
  loadImage(file) {
    return new Promise((resolve) => {
       const img = new Image();
       img.onload = () => {
         this.canvas.width = img.width;
         this.canvas.height = img.height;
         this.ctx.drawImage(img, 0, 0);
         resolve(this.ctx.getImageData(0, 0, img.width, img.height));
       };
       img.src = URL.createObjectURL(file);
    });
  }
  
  extractVideoFrames(file, fps) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.play().catch(() => {});
      
      const frames = [];
      video.addEventListener('loadeddata', () => {
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;
        const duration = Math.min(video.duration, 5); // Max 5 seconds
        const interval = 1 / fps;
        let currentTime = 0;
        
        const captureFrame = () => {
          if (currentTime <= duration) {
            video.currentTime = currentTime;
            currentTime += interval;
          } else {
            resolve(frames);
          }
        };
        
        video.addEventListener('seeked', () => {
          this.ctx.drawImage(video, 0, 0);
          frames.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
          captureFrame();
        });
        
        captureFrame();
      });
    });
  }
}

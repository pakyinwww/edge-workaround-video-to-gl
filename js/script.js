const f1 = () => {
    let canvas = document.getElementById('a');
    let ctx = canvas.getContext('2d');
    let video = document.getElementById('vid');

    video.addEventListener('play', function() {
        let $this = this; //cache
        (function loop() {
            if (!$this.paused && !$this.ended) {
                ctx.drawImage($this, 0, 0);
                setTimeout(loop, 1000 / 30); // drawing at 30fps
            }
        })();
    }, 0);
}

const f2 = () => {
    let canvas = document.getElementById('b');
    let ctx = canvas.getContext('webgl');
    console.log(ctx)
    let video = document.getElementById('vid');
    let copyVideo = false;
    let playing = false;
    let timeupdate = false;

    video.addEventListener('playing', function() {
        playing = true;
        checkReady();
     }, true);
   
     video.addEventListener('timeupdate', function() {
        timeupdate = true;
        checkReady();
     }, true);
   
     function checkReady() {
       if (playing && timeupdate) {
         copyVideo = true;
       }
     }

    function initTexture(gl) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Because video has to be download over the internet
        // they might take a moment until it's ready so
        // put a single pixel in the texture so we can
        // use it immediately.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);

        // Turn off mips and set  wrapping to clamp to edge so it
        // will work regardless of the dimensions of the video.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        return texture;
    }

    function updateTexture(gl, texture, video) {
        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, video);
    }

    const texture = initTexture(ctx);
    var then = 0;

    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001; // convert to seconds
        const deltaTime = now - then;
        then = now;

        if (copyVideo) {
            updateTexture(ctx, texture, video);
            console.log(now)
        }

        //drawScene(gl, programInfo, buffers, texture, deltaTime)
        ;


        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}





f1();
f2();
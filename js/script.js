// original to canvas
const f1 = () => {
    const canvas = document.getElementById('a');
    const ctx = canvas.getContext('2d');
    const video = document.getElementById('vid');

    video.addEventListener('play', function() {
        const $this = this; //cache
        (function loop() {
            if (!$this.paused && !$this.ended) {
                ctx.drawImage($this, 0, 0);
                setTimeout(loop, 1000 / 30); // drawing at 30fps
            }
        })();
    }, 0);
}

// original to webgl
const f2 = () => {
    const canvas = document.getElementById('b');
    const gl = canvas.getContext('webgl');
    const video = document.getElementById('vid');
    var samplerUniform = null;
    let texture;
    let glProgram;

    function initShaders() {
        //get shader source
        var vs_source = document.getElementById('shader-vs').innerHTML,
            fs_source = document.getElementById('shader-fs').innerHTML;
        // compile shaders	
        vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
        fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

        // create program
        glProgram = gl.createProgram();
        // attach and link shaders to the program
        gl.attachShader(glProgram, vertexShader);
        gl.attachShader(glProgram, fragmentShader);
        gl.linkProgram(glProgram);

        if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }
        // use program
        gl.useProgram(glProgram);
    }

    function makeShader(src, type) {
        //compile the vertex shader
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    var vertex = [-0.5, -0.3, 0.0,
        0.5, -0.3, 0.0,
        0.5, 0.3, 0.0, -0.5, 0.3, 0.0
    ];
    var vertexIndice = [
        0, 1, 2,
        0, 2, 3
    ];
    var triangleTexCoords = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];


    function createTexture(source) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    function draw() {
        requestId = requestAnimationFrame(draw);
        // vertex data
        vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

        // indice data
        vertexIndiceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndiceBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndice), gl.STATIC_DRAW);

        // set position attribute
        var aVertexPosition = gl.getAttribLocation(glProgram, 'aPos');
        gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexPosition);

        // texture coordinate data
        var trianglesTexCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglesTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleTexCoords), gl.STATIC_DRAW);

        // set texture coordinate attribute
        var vertexTexCoordAttribute = gl.getAttribLocation(glProgram, "aVertexTextureCoord");
        gl.enableVertexAttribArray(vertexTexCoordAttribute);
        gl.vertexAttribPointer(vertexTexCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        // bind texture and set the sampler
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
        gl.uniform1i(samplerUniform, 0);

        gl.clearColor(74 / 255, 115 / 255, 94 / 255, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    video.addEventListener('play', function() {
        texture = createTexture(video);
        draw();
    });

    video.onended = function() {
        cancelAnimationRequest(requestId);
    }

    function render() {
        initShaders();
        samplerUniform = gl.getUniformLocation(glProgram, 'uSampler');
    }

    window.onload = function() {
        render();
    }
}

// original to canvas
const f3 = () => {
    const glCanvas = document.getElementById('b');
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    video.addEventListener('play', function() {
        (function loop() {
            ctx.drawImage(glCanvas, 0, 0);
            setTimeout(loop, 1000 / 30); // drawing at 30fps
        })();
    }, 0);
}




f1();
f2();
f3();
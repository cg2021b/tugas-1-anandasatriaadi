function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

let canvas = document.getElementById('myCanvas');
let mode = 0;
let gl = canvas.getContext('experimental-webgl');

let vertices = [...c2_belakang, ...c2_alas, ...c2_badan, ...c1_lingkaran, ...c1_badan];

let vertexShaderCode = `
attribute vec2 a_position;
attribute vec4 a_color;
varying vec4 v_color;
uniform mat4 u_matrix;

void main() {
    gl_Position = u_matrix * vec4(a_position, 0, 1.65);
    v_color = a_color;
}
`;
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);


let fragmentShaderCode = `
precision mediump float;
varying vec4 v_color;

void main() {
    gl_FragColor = v_color;
}
`;
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);

let shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

let coords = gl.getAttribLocation(shaderProgram, "a_position");
var colorLocation = gl.getAttribLocation(shaderProgram, "a_color");

var color = [];

function changeMode() {
	color = []
	if (mode) {
		// Generate warna untuk setiap segitiga
		mode = 0;
		for (let i = 0; i < vertices.length/2; i++) {
			let r = Math.random()/2 + 0.45;
			let g = Math.random()/2 + 0.45;
			let b = Math.random()/2 + 0.45;
				for (let j = 0; j < 3; j++) {
					color.push(r);
					color.push(g);
					color.push(b);
					color.push(1);
				}
		}
		document.getElementById('toggleTriangles').innerHTML = "Hide Triangles";
	} else {
		mode = 1;
		for (let i = 0; i < c2_belakang.length/2; i++) {
				let r = 0.60;
				let g = 0.60;
				let b = 0.60;
				color.push(r);
				color.push(g);
				color.push(b);
				color.push(1);
		}
		for (let i = 0; i < c2_alas.length/2; i++) {
				let r = 0.50;
				let g = 0.50;
				let b = 0.50;
				color.push(r);
				color.push(g);
				color.push(b);
				color.push(1);
		}
		for (let i = 0; i < c2_badan.length/2; i++) {
				let r = 0.65;
				let g = 0.65;
				let b = 0.65;
				color.push(r);
				color.push(g);
				color.push(b);
				color.push(1);
		}
		for (let i = 0; i < c1_lingkaran.length/2; i++) {
				let r = 0.60;
				let g = 0.60;
				let b = 0.60;
				color.push(r);
				color.push(g);
				color.push(b);
				color.push(1);
		}
		for (let i = 0; i < c1_badan.length/2; i++) {
				let r = 0.65;
				let g = 0.65;
				let b = 0.65;
				color.push(r);
				color.push(g);
				color.push(b);
				color.push(1);
		}
		document.getElementById('toggleTriangles').innerHTML = "Show Triangles"
	}


	let colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
	gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(colorLocation);
}

changeMode();

let vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coords);

let dy = 0;
let speed = 0.0113;
function drawScene() {
		dy >= 0.5 ? speed = -speed : speed = speed;
		dy <= -0.5 ? speed = -speed : speed = speed;
		dy += speed;
		gl.useProgram(shaderProgram);
		const leftObject = [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			-0.5, 0.0, 0.0, 1.0,
		]
		
		const rightObject = [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.5, dy, 0.0, 1.0,
		]
		
		gl.clearColor(0.15, 0.15, 0.15, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		const u_matrix = gl.getUniformLocation(shaderProgram, 'u_matrix');
		gl.uniformMatrix4fv(u_matrix, false, rightObject);
    
    gl.drawArrays(gl.TRIANGLES, 0, (c2_belakang.length + c2_badan.length + c2_alas.length)/2);
		
		gl.uniformMatrix4fv(u_matrix, false, leftObject);
    gl.drawArrays(gl.TRIANGLES, (c2_belakang.length + c2_badan.length + c2_alas.length)/2, (c1_lingkaran.length + c1_badan.length)/2);
		requestAnimationFrame(drawScene);
}

drawScene();
////////////////////////////////////////////////////////////
//The particle object
////////////////////////////////////////////////////////////
function Particle(radius_t, mass_t, damp_t)
{
	this.vertexPositionBuffer;
	this.vertexNormalBuffer;
	this.vertexTextureCoordBuffer;
	this.vertexIndexBuffer;
	
	this.particleRotationMatrix = mat4.create();
	mat4.identity(this.particleRotationMatrix);

	this.radius = radius_t;
	this.mass = mass_t;
	this.damping = damp_t;
	this.pos = [0, 0, 0];
	this.vel = [0, 0, 0];
	this.forceAccum = [0, 0, 0];
	this.acc = [0, -.001, 0];
}

Particle.prototype.kick = function(a,b)
{
	switch(b)
	{
	case "up":
		this.forceAccum[1] += a;
		break;
	case "down":
		this.forceAccum[1] -= a;
		break;
	case "left":
		this.forceAccum[0] -= a;
		break;
	case "right":
		this.forceAccum[0] += a;
		breakl
	}
}

Particle.prototype.animate = function(elapsed)
{    	
	if(this.mass <= 0)
		return;

	this.pos[0] += this.vel[0] * elapsed;
	this.pos[1] += this.vel[1] * elapsed;
	this.pos[2] += this.vel[2] * elapsed;
	
	var tmpX = this.acc[0];
	var tmpY = this.acc[1];
	var tmpZ = this.acc[2];
	tmpX += this.forceAccum[0] * 1/this.mass;
	tmpY += this.forceAccum[1] * 1/this.mass;
	tmpZ += this.forceAccum[2] * 1/this.mass;
	
	this.vel[0] += tmpX * elapsed;
	this.vel[1] += tmpY * elapsed;
	this.vel[2] += tmpZ * elapsed;
		
	this.vel[0] *= Math.pow(this.damping, elapsed);
	this.vel[1] *= Math.pow(this.damping, elapsed);
	this.vel[2] *= Math.pow(this.damping, elapsed);	
		
	this.forceAccum = [0, 0, 0];
	
	//The bounding box of the particles movement		
	if(this.pos[1] > 4)
		this.pos[1] = 4;
	else if(this.pos[1] < -3.5)
		this.pos[1] = -3.5;
}

Particle.prototype.draw = function()
{
	mat4.identity(mvMatrix);

	mat4.translate(mvMatrix, [this.pos[0],this.pos[1],this.pos[2]]);
	
	mat4.multiply(mvMatrix, this.particleRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, particleTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

////////////////////////////////////////////////////////////
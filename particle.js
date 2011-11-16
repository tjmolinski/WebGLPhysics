////////////////////////////////////////////////////////////
//The particle object
////////////////////////////////////////////////////////////
function Particle(radius, xPos, yPos, zPos, xVel, yVel, zVel)
{
	this.radius = radius;
	
	this.vertexPositionBuffer;
	this.vertexNormalBuffer;
	this.vertexTextureCoordBuffer;
	this.vertexIndexBuffer;
	
	this.particleRotationMatrix = mat4.create();
	mat4.identity(this.particleRotationMatrix);

	this.pos = [xPos, yPos, zPos];
	this.vel = [xVel, yVel, zVel];
}

Particle.prototype.kick = function(a,b)
{
	switch(b)
	{
	case "up":
		this.vel[1] += a;
		break;
	case "down":
		this.vel[1] -= a;
		break;
	case "left":
		this.vel[0] -= a;
		break;
	case "right":
		this.vel[0] += a;
		breakl
	}
}

Particle.prototype.animate = function(elapsed)
{    	
	this.pos[0] += this.vel[0] * effectiveFPMS * elapsed;
	this.pos[1] += this.vel[1] * effectiveFPMS * elapsed;
	this.pos[2] += this.vel[2] * effectiveFPMS * elapsed;
	
	//The bounding box of the particles movement
	if(this.pos[0] > 4)
		this.vel[0] = -this.vel[0], this.pos[0] = 4;
	else if(this.pos[0] < -4)
		this.vel[0] = -this.vel[0], this.pos[0] = -4;
		
	if(this.pos[1] > 4)
		this.vel[1] = -this.vel[1], this.pos[1] = 4;
	else if(this.pos[1] < -4)
		this.vel[1] = -this.vel[1], this.pos[1] = -4;
		
	if(this.pos[2] > -9)
		this.vel[2] = -this.vel[2], this.pos[2] = -9;
	else if(this.pos[2] < -24)
		this.vel[2] = -this.vel[2], this.pos[2] = -24;
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
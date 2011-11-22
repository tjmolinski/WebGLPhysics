////////////////////////////////////////////////////////////
//The stiff spring object
////////////////////////////////////////////////////////////
function StiffSpring(p1, a1, dp, sc)
{
	if(p1.mass <= 0.0)
	{
		this.anchor = p1;
		this.particle = a1;
	}
	else
	{
		this.anchor = a1;
		this.particle = p1;
	}
	
	this.damping = dp;
	this.springConst = sc;
}

StiffSpring.prototype.updateForce = function(elapsed)
{    	
	var forceX, forceY, forceZ;
	
	if(this.anchor.mass != 0.0)
		return;
	
	//Calculating the vector of the stiff spring/////////////////////
	forceX = (this.particle.pos[0] - this.anchor.pos[0]);
	forceY = (this.particle.pos[1] - this.anchor.pos[1]);
	forceZ = (this.particle.pos[2] - this.anchor.pos[2]);
	///////////////////////////////////////////////////////////
	
	var gamma = 0.5 * Math.sqrt(4 * this.springConst - this.damping*this.damping);
	if (gamma == 0.0)
		return;
		
	var c = [0,0,0];
	c[0] = forceX * (this.damping / (2.0 * gamma)) + this.particle.vel[0] * (1.0/gamma);
	c[1] = forceY * (this.damping / (2.0 * gamma)) + this.particle.vel[1] * (1.0/gamma);
	c[2] = forceZ * (this.damping / (2.0 * gamma)) + this.particle.vel[2] * (1.0/gamma);
	
	var t = [0,0,0];
	t[0] = forceX * Math.cos(gamma*elapsed) + c[0] * Math.sin(gamma*elapsed);
	t[1] = forceY * Math.cos(gamma*elapsed) + c[1] * Math.sin(gamma*elapsed);
	t[2] = forceZ * Math.cos(gamma*elapsed) + c[2] * Math.sin(gamma*elapsed);
	
	t[0] *= Math.exp(-0.5 * elapsed * this.damping);
	t[1] *= Math.exp(-0.5 * elapsed * this.damping);
	t[2] *= Math.exp(-0.5 * elapsed * this.damping);
	
	var a = [0,0,0];
	a[0] = (t[0] - forceX) * (1.0/(elapsed*elapsed)) - this.particle.vel[0] * elapsed;
	a[1] = (t[1] - forceY) * (1.0/(elapsed*elapsed)) - this.particle.vel[1] * elapsed;
	a[2] = (t[2] - forceZ) * (1.0/(elapsed*elapsed)) - this.particle.vel[2] * elapsed;
	
	//Now applying the force to the particle///////////////////
	this.particle.forceAccum[0] += a[0] * this.particle.mass;
	this.particle.forceAccum[1] += a[1] * this.particle.mass;
	this.particle.forceAccum[2] += a[2] * this.particle.mass;
	///////////////////////////////////////////////////////////
}

////////////////////////////////////////////////////////////
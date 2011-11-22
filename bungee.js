////////////////////////////////////////////////////////////
//The bungee object
////////////////////////////////////////////////////////////
function Bungee(p1, p2, rl, sc)
{
	this.particle1 = p1;
	this.particle2 = p2;
	
	this.restL = rl;
	this.springConst = sc;
}

Bungee.prototype.updateForce = function(elapsed)
{    	
	var forceX, forceY, forceZ;
	var magnitude;
	
	if(this.particle1.mass <= 0.0)
		return;
	
	//Calculating the vector of the bungee/////////////////////
	forceX = (this.particle1.pos[0] - this.particle2.pos[0]);
	forceY = (this.particle1.pos[1] - this.particle2.pos[1]);
	forceZ = (this.particle1.pos[2] - this.particle2.pos[2]);
	///////////////////////////////////////////////////////////
	
	//Calculating the magnitude of the force vector////////////
	magnitude = (forceX * forceX) + (forceY * forceY) + (forceZ * forceZ);
	magnitude = Math.sqrt(magnitude);
	
	if(magnitude <= this.restL) 
		return;
	
	magnitude = this.springConst * (magnitude - this.restL);
	///////////////////////////////////////////////////////////
	
	//Normalizing the force vector/////////////////////////////
	var n = (forceX * forceX) + (forceY * forceY) + (forceZ * forceZ);
	if(n > 0.00001)
	{
		forceX *= 1 / n;
		forceY *= 1 / n;
		forceZ *= 1 / n;
	}
	else
	{
		forceX = 0;
		forceY = 0;
		forceZ = 0;
	}
	forceX *= -magnitude;
	forceY *= -magnitude;
	forceZ *= -magnitude;
	///////////////////////////////////////////////////////////
	
	//Now applying the force to the particle///////////////////
	this.particle1.forceAccum[0] += forceX * elapsed;
	this.particle1.forceAccum[1] += forceY * elapsed;
	this.particle1.forceAccum[2] += forceZ * elapsed;
	///////////////////////////////////////////////////////////
}

////////////////////////////////////////////////////////////
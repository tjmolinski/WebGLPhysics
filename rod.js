////////////////////////////////////////////////////////////
//The rod object
////////////////////////////////////////////////////////////
function Rod(p1, p2, l)
{
	this.particle1 = p1;
	this.particle2 = p2;
	
	this.len = l;
	
	this.cNormal = [0,0,0];
}

Rod.prototype.getDistance = function()
{    	
	distX = this.particle1.pos[0] - this.particle2.pos[0];
	distY = this.particle1.pos[1] - this.particle2.pos[1];
	distZ = this.particle1.pos[2] - this.particle2.pos[2];
	
	distance = Math.sqrt(distX*distX+distY*distY+distZ*distZ);

	if(distance > this.len)
	{
		this.cNormal[0] = -distX/distance;
		this.cNormal[1] = -distY/distance;
		this.cNormal[2] = -distZ/distance;
	}
	else
	{
		this.cNormal[0] = distX/distance;
		this.cNormal[1] = distY/distance;
		this.cNormal[2] = distZ/distance;
	}
	
	return distance;
}

Rod.prototype.updateForce = function(elapsed)
{
	dist = this.getDistance();
	
	if (dist == this.len)
		return;
		
	pen = Math.abs(dist-this.len);
	
	tmp = new CollisionGenerator(this.particle1, this.particle2, pen, this.cNormal, 0.0);
	tmp.resolve(elapsed);
	delete tmp;
}
////////////////////////////////////////////////////////////
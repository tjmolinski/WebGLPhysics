////////////////////////////////////////////////////////////
//The cable object
////////////////////////////////////////////////////////////
function Cable(p1, p2, ml, r)
{
	this.particle1 = p1;
	this.particle2 = p2;
	
	this.maxL = ml;
	this.restituion = r;
	
	this.cNormal = [0,0,0];
}

Cable.prototype.getDistance = function()
{    	
	distX = this.particle1.pos[0] - this.particle2.pos[0];
	distY = this.particle1.pos[1] - this.particle2.pos[1];
	distZ = this.particle1.pos[2] - this.particle2.pos[2];
	
	distance = Math.sqrt(distX*distX+distY*distY+distZ*distZ);

	this.cNormal[0] = -distX/distance;
	this.cNormal[1] = -distY/distance;
	this.cNormal[2] = -distZ/distance;
	
	return distance;
}

Cable.prototype.updateForce = function(elapsed)
{
	dist = this.getDistance();
	
	if (dist < this.maxL)
		return;
		
	tmp = new CollisionGenerator(this.particle1, this.particle2, dist, this.cNormal, this.restituion);
	tmp.resolve(elapsed);
	delete tmp;
}
////////////////////////////////////////////////////////////
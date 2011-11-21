////////////////////////////////////////////////////////////
//The collision handler
////////////////////////////////////////////////////////////
function CollisionHandler(p1, p2, rest_t)
{
	this.particle1 = p1;
	this.particle2 = p2;
	this.restitution = rest_t;
	this.cNormal = [this.particle1.pos[0] - this.particle2.pos[0],
				    this.particle1.pos[1] - this.particle2.pos[1],
					this.particle1.pos[2] - this.particle2.pos[2]];
					
	tmp = this.cNormal[0]*this.cNormal[0]+this.cNormal[1]*this.cNormal[1]+this.cNormal[2]*this.cNormal[2];
	this.cNormal[0] /= tmp;
	this.cNormal[1] /= tmp;
	this.cNormal[2] /= tmp;
	
	this.distX = this.particle1.pos[0] - this.particle2.pos[0];
	this.distY = this.particle1.pos[1] - this.particle2.pos[1];
	this.distZ = this.particle1.pos[2] - this.particle2.pos[2];
	this.distance = Math.sqrt(this.distX*this.distX+this.distY*this.distY+this.distZ*this.distZ);
	
	this.penetration = this.particle1.radius+this.particle2.radius-this.distance;
}

CollisionHandler.prototype.resolve = function(elapsed)
{    	
	this.resolveVelocity(elapsed);
	this.resolveInterpenetration(elapsed);
}
	
CollisionHandler.prototype.resolveInterpenetration = function()
{    	
	if(this.penetration <= 0)
		return;
		
	totalIMass = 1.0/this.particle1.mass + 1.0/this.particle2.mass;
	
	if(totalIMass <= 0)
		return;
		
	movePerIMass = [this.cNormal[0] * (this.penetration/totalIMass),
					this.cNormal[1] * (this.penetration/totalIMass),
					this.cNormal[2] * (this.penetration/totalIMass)];
					
	moveP1 = [movePerIMass[0] * 1.0/this.particle1.mass,
			  movePerIMass[1] * 1.0/this.particle1.mass,
			  movePerIMass[2] * 1.0/this.particle1.mass];
	moveP2 = [movePerIMass[0] * -1.0/this.particle2.mass,
			  movePerIMass[1] * -1.0/this.particle2.mass,
			  movePerIMass[2] * -1.0/this.particle2.mass];
	
	this.particle1.pos[0] += moveP1[0];
	this.particle1.pos[1] += moveP1[1];
	this.particle1.pos[2] += moveP1[2];
	
	this.particle2.pos[0] += moveP2[0];
	this.particle2.pos[1] += moveP2[1];
	this.particle2.pos[2] += moveP2[2];
}

CollisionHandler.prototype.getSeparatingVelocity = function()
{    	
	sepVel = [this.particle1.vel[0], this.particle1.vel[1], this.particle1.vel[2]];

	sepVel[0] -= this.particle2.vel[0];
	sepVel[1] -= this.particle2.vel[1];
	sepVel[2] -= this.particle2.vel[2];
	
	sepVel[0] *= this.cNormal[0];
	sepVel[1] *= this.cNormal[1];
	sepVel[2] *= this.cNormal[2];
	
	return sepVel[0] + sepVel[1] + sepVel[2];
}

CollisionHandler.prototype.resolveVelocity = function(elapsed)
{    	
	separatingVelocity = this.getSeparatingVelocity();
	
	if(separatingVelocity > 0)
		return;	
		
	newSepVel = -separatingVelocity * this.restitution;
	
	accCausedVelocity = [this.particle1.acc[0]-this.particle2.acc[0],
						   this.particle1.acc[1]-this.particle2.acc[1],
						   this.particle1.acc[2]-this.particle2.acc[2]];
	
	accCausedSepVelocity = accCausedVelocity[0]*this.cNormal[0]*elapsed + 
						   accCausedVelocity[1]*this.cNormal[1]*elapsed + 
						   accCausedVelocity[2]*this.cNormal[2]*elapsed;
	
	if(accCausedSepVelocity < 0)
	{
		newSepVel += this.restitution * accCausedSepVelocity;
		
		if(newSepVel < 0)
			newSepVel = 0;
	}
	
	deltaVel = newSepVel - separatingVelocity;
	totalIMass = 1.0/this.particle1.mass + 1.0/this.particle2.mass;
	
	if(totalIMass <= 0)
		return;
		
	impulse = deltaVel / totalIMass;
	
	impulsePerIMass = [this.cNormal[0] * impulse, 
					   this.cNormal[1] * impulse, 
					   this.cNormal[2] * impulse];

	this.particle1.vel[0] += impulsePerIMass[0] * 1.0/this.particle1.mass;
	this.particle1.vel[1] += impulsePerIMass[1] * 1.0/this.particle1.mass;
	this.particle1.vel[2] += impulsePerIMass[2] * 1.0/this.particle1.mass;
	
	this.particle2.vel[0] += impulsePerIMass[0] * -1.0/this.particle2.mass;
	this.particle2.vel[1] += impulsePerIMass[1] * -1.0/this.particle2.mass;
	this.particle2.vel[2] += impulsePerIMass[2] * -1.0/this.particle2.mass;

}
////////////////////////////////////////////////////////////
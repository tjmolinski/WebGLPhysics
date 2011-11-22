////////////////////////////////////////////////////////////
//The plane object
////////////////////////////////////////////////////////////
function Plane(pos, n, r)
{
	this.position = pos;
	this.normal = n;
	this.particle;
	this.restitution = r;
}

Plane.prototype.checkForHits = function(elapsed, p)
{
	this.particle = p;
	
	if(this.particle.mass <= 0.0)
		return;

	var tmp = [this.position[0]-this.particle.pos[0]-this.particle.radius,
			this.position[1]-this.particle.pos[1]-this.particle.radius,
			this.position[2]-this.particle.pos[2]-this.particle.radius];
			
	this.penetration = tmp;
			
	var mag = Math.sqrt(tmp[0]*tmp[0]+tmp[1]*tmp[1]+tmp[2]*tmp[2]);
	
	if(mag > 0.0)
	{
		tmp[0] /= mag;
		tmp[1] /= mag;
		tmp[2] /= mag;
	}
	else
	{
		tmp = [0,0,0];
	}
	
	var dot = this.normal[0] * tmp[0] + this.normal[1]*tmp[1] + this.normal[2]*tmp[2];
	
	if(dot > 0.0)
	{
		if(this.penetration <= 0)
			return;
		
		if(this.particle.mass > 0.0)
		{
			this.particle.pos[0] += this.penetration * this.normal[0] * elapsed;
			this.particle.pos[1] += this.penetration * this.normal[1] * elapsed;
			this.particle.pos[2] += this.penetration * this.normal[2] * elapsed;
			
			this.particle.vel[0] = -this.particle.vel[0] * this.normal[0] * this.restitution;
			this.particle.vel[1] = -this.particle.vel[1] * this.normal[1] * this.restitution;
			this.particle.vel[2] = -this.particle.vel[2] * this.normal[2] * this.restitution;
		}
	}
}
////////////////////////////////////////////////////////////
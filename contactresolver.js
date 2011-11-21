////////////////////////////////////////////////////////////
//The collision resolver
////////////////////////////////////////////////////////////
function CollisionResolver(i, cArray, numContacts, duration)
{
	this.iteration = i;
	this.iterationUsed;
	this.list = cArray;
	this.cNum = numContacts;
	this.time = duration;
}

CollisionResolver.prototype.resolveCollisions = function()
{    	
	this.iterationUsed = 0;
	while(this.iterationUsed < this.iteration)
	{
		var max = 999999;
		var maxIndex = this.cNum;
		
		for(var i = 0; i < this.cNum; i++)
		{
			var sepVel = this.list[i].getSeparatingVelocity();
			if(sepVel < max && (sepVel < 0 || this.list[i].penetration > 0))
			{
				max = sepVel;
				maxIndex = i;
			}
		}
		
		if(maxIndex == this.cNum)
			break;
			
		this.list[maxIndex].resolve(this.time);
		
		this.iterationUsed++;
	}
}
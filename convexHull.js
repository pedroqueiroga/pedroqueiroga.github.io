var convexHull = {
	line_point_distance: function (l1, l2, p) {	
		return (l2.x - l1.x) * (p.y - l1.y) - (l2.y - l1.y) * (p.x - l1.x);
	},
	
	insert: function(hull, newpoint) {
		debugger;
		if (hull.length < 2) { //trivial
			hull.push(newpoint);
		} else if (hull.length === 2) {	//special case
			var lpd = this.line_point_distance(hull[0], hull[1], newpoint);
			if (lpd > 0)
			{
				hull.push(newpoint);
			} else if (lpd < 0) {
				hull.splice(1,0,newpoint);
			}
		} else {
			/*
			//checking if the point is inside or outside the present hull
			//finding a subhull which must contain the point if the main hull contains it
			var within = true;
			var subhull = hull.slice();
			while (subhull.length > 3) {
				var i = Math.floor(subhull.length/2);
				var lpd = this.line_point_distance(subhull[0], subhull[Math.floor(subhull.length/2)], newpoint);
				if (this.line_point_distance(subhull[0], subhull[Math.floor(subhull.length/2)], newpoint) > 0) {
					subhull.splice(Math.floor(subhull.length/2) + 1,subhull.length);
				} else {
					subhull.splice(1,Math.floor(subhull.length/2) - 1);
				}
			}
			//checking if the subhull does contain the point
			within = within && (this.line_point_distance(subhull[0], subhull[1], newpoint) > 0);
			within = within && (this.line_point_distance(subhull[1], subhull[2], newpoint) > 0);
			within = within && (this.line_point_distance(subhull[2], subhull[0], newpoint) > 0);
			
			//within the hull? nice, bye
			if (within) return;*/
			
			//calculating tangent points
			var counter = 0;
			var left_tan = 0;
			var lpd_prior = this.line_point_distance(newpoint, hull[0], hull[hull.length - 1]);
			var lpd_next  = this.line_point_distance(newpoint, hull[0], hull[1]);
			var stepsize = 1;//Math.max(Math.floor(hull.length/2), 1);
			
			while (Math.max(lpd_prior, lpd_next) > 0 && counter <= hull.length) {
				//in case we find the other tangent
				//if(lpd_prior < 0 && lpd_next < 0) {
				//	counter = 0;
				//}
				
				//if (lpd_prior > 0) {
					left_tan = (left_tan + hull.length - stepsize)%hull.length;
				//} else {
				//	left_tan = (left_tan               + stepsize)%hull.length;
				//}
				lpd_prior = this.line_point_distance(newpoint, hull[left_tan], hull[(left_tan + hull.length - 1)%hull.length]);
				lpd_next  = this.line_point_distance(newpoint, hull[left_tan], hull[(left_tan               + 1)%hull.length]);
				counter += stepsize;
				stepsize = Math.max(Math.floor(stepsize/2), 1);
			}
			
			//within the hull? nice, bye
			if (counter > hull.length) return;
			
			var right_tan = 0;
			lpd_prior = this.line_point_distance(newpoint, hull[0], hull[hull.length - 1]);
			lpd_next  = this.line_point_distance(newpoint, hull[0], hull[1]);
			stepsize = 1;//Math.max(Math.floor(hull.length/2), 1);
			
			while (Math.min(lpd_prior, lpd_next) < 0) {
				//if(lpd_prior > 0 && lpd_next > 0) {
				//	counter = 0;
				//}
				
				//if (lpd_prior < 0) {
					right_tan = (right_tan + hull.length - stepsize)%hull.length;
				//} else {
				//	right_tan = (right_tan               + stepsize)%hull.length;
				//}
				lpd_prior = this.line_point_distance(newpoint, hull[right_tan], hull[(right_tan + hull.length - 1)%hull.length]);
				lpd_next  = this.line_point_distance(newpoint, hull[right_tan], hull[(right_tan               + 1)%hull.length]);
				stepsize = Math.max(Math.floor(stepsize/2), 1);
			}
			
			//this.inserting our point and removing those which are now within the hull
			if (left_tan < right_tan) {
				hull.splice(left_tan + 1, right_tan - left_tan - 1, newpoint);
			} else {
				hull.splice(left_tan + 1, hull.length, newpoint);
				hull.splice(0,right_tan);
			}
		}
	},
	
	remove: function(hull, poinsettia, reimove) {
		//finding the point's index in our hull
		var index = -1;
		for (var i = 0; i < hull.length; ++i) {
			if (hull[i].x === reimove.x && hull[i].y === reimove.y) {
				index = i;
				break;
			}
		}
		//not a vertex? nice, bye
		if (index === -1) return;
		
		//finding some useful vertices before splicing
		var prev, next;
		if (index === hull.length-1) {
			prev = hull.length-2;
			next = 0;
		} else if (index === 0) {
			prev = hull.length-1;
			next = 1;
		} else {
			prev = index-1;
			next = index+1;
		}
		p1 = hull[prev];
		p2 = hull[next];
		hull.splice(index,1);
		
		//categorizing the control points
		var hi_p = -1;
		var high = 0.0;
		var p2i = [];
		for (var i = 0; i < poinsettia.length; ++i) {
			var point = poinsettia[i];
			var lpd = this.line_point_distance(p2, p1, point);
			if (lpd > high) {
				high = lpd;
				if (hi_p != -1) p2i.push(hi_p);
				hi_p = point;
			} else if (lpd > 0) {
				p2i.push(point)
			}
		}
		
		//none outside? nice, bye
		if(hi_p === -1) return;
		
		//this is somewhat dangerous
		var subhull = [p1,hi_p,p2];
		for (var i = 0; i < p2i.length; ++i) {
			var point = p2i[i];
			this.insert(subhull, point);
		}
		//this too
		for (var c = subhull.length-2; c > 0; c--) {
			hull.splice(index, 0, subhull[c]);
		}
	}
}
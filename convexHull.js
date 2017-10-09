var convexHull = {
	line_point_distance: function (l1, l2, p) {
		return (l2.x - l1.x) * (p.y - l1.y) - (l2.y - l1.y) * (p.x - l1.x);
	},
	
	/*
	minimum_absolute_angle: function (p1, p2, p) {
		var a1 = Math.atan2(p1.y - p.y, p1.x - p.x);
		var a2 = Math.atan2(p2.y - p.y, p2.x - p.x);
		return Math.min(Math.abs(a1-a2), Math.PI - Math.abs(a1-a2));
	},*/
	
	insert: function(hull, newpoint) {
		if (hull.length < 2) { //trivial
			hull.push(newpoint);
		} else {
			
			//checking if the point is inside or outside the present hull
			//finding a subhull which contains the point if the main hull contains it
			var within = true;
			var proceed= true;
			var subhull = hull.slice();
			while (proceed && subhull.length > 3) {
				if (line_point_distance(subhull[0], subhull[subhull.length/2], newpoint) < 0) {
					subhull.splice(subhull.length/2 + 1,subhull.length);
				} else {
					subhull.splice(1,subhull.length/2 - 1);
				}
			}
			//checking if the subhull does contain the point
			within = within && (line_point_distance(subhull[0], subhull[1], newpoint) > 0);
			within = within && (line_point_distance(subhull[1], subhull[2], newpoint) > 0);
			within = within && (line_point_distance(subhull[2], subhull[0], newpoint) > 0);
			
			/*
			** OLD O(N) VERSION
			**
			//checking if the point is inside the hull
			var within = true;
			for (var i = 0; i < hull.length-1; i++) {
				if (line_point_distance(hull[i], hull[i+1], newpoint) < 0) {
					within = false;
					break;
				}
			}
			//special case for wraparound
			if (within && line_point_distance(hull[hull.length-1], hull[0], newpoint) < 0) {
				within = false;
			}
			*/
			
			//within the hull? nice, bye
			if (within) return;
			
			//calculating tangent points
			var left_tan = 0;
			var lpd_prior = line_point_distance(newpoint, hull[0], hull[hull.length - 1]);
			var lpd_next  = line_point_distance(newpoint, hull[0], hull[1]);
			var stepsize = Math.max(hull.length/2, 1);
			
			while (Math.max(lpd_prior, lpd_next) > 0) {
				if (lpd_prior > 0) {
					left_tan = (left_tan + hull.length - stepsize)%hull.length;
				} else {
					left_tan = (left_tan               + stepsize)%hull.length;
				}
				lpd_prior = line_point_distance(newpoint, hull[left_tan], hull[(left_tan + hull.length - 1)%hull.length]);
				lpd_next  = line_point_distance(newpoint, hull[left_tan], hull[(left_tan               + 1)%hull.length]);
				stepsize = Math.max(Math.floor(stepsize/2), 1);
			}
			
			var right_tan = 0;
			lpd_prior = line_point_distance(newpoint, hull[0], hull[hull.length - 1]);
			lpd_next  = line_point_distance(newpoint, hull[0], hull[1]);
			stepsize = Math.max(hull.length/2, 1);
			
			var stepsize = hull.length/2;
			while (Math.min(lpd_prior, lpd_next) < 0) {
				if (lpd_prior < 0) {
					right_tan = (right_tan + hull.length - stepsize)%hull.length;
				} else {
					right_tan = (right_tan               + stepsize)%hull.length;
				}
				lpd_prior = line_point_distance(newpoint, hull[right_tan], hull[(right_tan + hull.length - 1)%hull.length]);
				lpd_next  = line_point_distance(newpoint, hull[right_tan], hull[(right_tan               + 1)%hull.length]);
				stepsize = Math.max(Math.floor(stepsize/2), 1);
			}
			
			/*
			**OLD O(n) VERSION
			//calculating tangent points
			var high = 0.0;
			var p1 = 0;
			var p2 = 0;
			for (var i = 0; i < hull.length; i++) {
				var maa1 = minimum_absolute_angle (hull[i], p1, newpoint);
				var maa2 = minimum_absolute_angle (hull[i], p2, newpoint);
				
				if (high < Math.max(maa1,maa2)) {
					high = Math.max(maa1,maa2);
					if (maa1 < maa2) {
						p2 = i;
					} else {
						p1 = i;
					}
				}
			}
			*/
			
			//inserting our point and removing those which are now within the hull
			if (left_tan < right_tan) {
				hull.splice(left_tan + 1, right_tan - left_tan - 1, newpoint);
			} else {
				hull.splice(left + 1, hull.length, newpoint);
				hull.splice(0,right_tan);
			}
			
			/*
			var p1 = Math.min(left_tan, right_tan);
			var p2 = Math.max(left_tan, right_tan);
			if (line_point_distance(hull[p1],hull[p2],newpoint) < 0) {
				hull.splice(p2+1, hull.length, newpoint);
				hull.splice(0,p1);
			} else {
				hull.splice(p1+1, p2-p1-1, newpoint);
			}*/
		}
	},
	
	remove: function(hull, poinsettia, reimove) {
		//finding the point's index in our hull
		var index = -1;
		for (var i = 0; i < hull.length; ++i) {
			if (hull[i].x === reimove.x && hull[i].y === reimove.y) {
				index = i;
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
			prev = i-1;
			next = i+1;
		}
		hull.splice(i,1);
		
		//categorizing the control points
		var p1 = (i + hull.length - 1)%hull.length;
		var p2 = i%hull.length;
		var hi_p = -1;
		var high = 0.0;
		var p2r = [];
		for (point in poinsettia) {
			var lpd = line_point_distance(p2, p1, point);
			if (lpd > high) {
				high = lpd;
				if (hi_p != -1) p2r.push(hi_p);
				hi_p = point;
			} else if (lpd > 0) {
				p2r.push(point)
			}
		}
		
		//none outside? nice, bye
		if(hi_p === -1) return;
		
		//this is somewhat dangerous
		var subhull = [p1,hi_p,p2];
		for (point in p2r) {
			insert(subhull, point);
		}
		//this too
		for (var c = subhull.length-2; c > 0; c00) {
			hull.splice(i, 0, subhull[c]);
		}
	},
},
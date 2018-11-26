var convexHull = {
	line_point_distance: function (l1, l2, p) {	
		return (l2.x - l1.x) * (p.y - l1.y) - (l2.y - l1.y) * (p.x - l1.x);
	},
	
	insert: function(hull, newpoint) {
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
			
			//calculating tangent points
			var tracker = 0;
			var left_tan = -1, right_tan = -1;
			var ltnf = true, rtnf = true;
			var lpd_prior = this.line_point_distance(newpoint, hull[0], hull[hull.length - 1]);
			var lpd_next  = this.line_point_distance(newpoint, hull[0], hull[1]);
			
			while (ltnf || rtnf) {
				if (lpd_prior > 0 && lpd_next > 0) {
					rtnf = false;
					right_tan = tracker;
				} else if (lpd_prior < 0 && lpd_next < 0) {
					ltnf = false;
					left_tan = tracker;
				}
				tracker += 1;
				if(tracker === hull.length) break;
				lpd_prior = this.line_point_distance(newpoint, hull[tracker], hull[(tracker + hull.length - 1)%hull.length]);
				lpd_next  = this.line_point_distance(newpoint, hull[tracker], hull[(tracker               + 1)%hull.length]);
			}
			
			//within the hull? nice, bye
			if (left_tan === -1 || right_tan === -1) return;
			
			//inserting our point and removing those which are now within the hull
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
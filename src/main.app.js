(function(G) {

// var console = { log: function() {} }
var console = { 
	logs: [],
	_logRaw: function(msg) { var thi$ = this
			//# TODO better check
			var isScrollAtBottom = G.log.scrollHeight < G.log.scrollTop + 200
			G.log && G.log.insertAdjacentText("beforeend", msg)
			if(isScrollAtBottom) G.log.scrollTop = G.log.scrollHeight
	},
	log: function() { var thi$ = this
		var msg = "" + new Date() + " :: " + JSON.stringify([].slice.call(arguments))+ "\n"
		if(G.log == null) {
			this.logs.push(msg);
			return
		}
		
		if(0 < this.logs.length) {
			G.console.log("log rest");
			var logs = this.logs; this.logs = []
			logs.forEach(function(v) {
				thi$._logRaw(v);
			});
		};
		thi$._logRaw(msg);
	} 
}

var Object_create = Object.create || function(proto) {
	var F = function() {}
	F.prototype = proto
	return new F();
}

if(0) {
	var A = Class({
		construct: function(b) {
			this.a = b
		},
		inc_a: function() {
			this.a += 1
			return this.a
		}
	})


	var a = A(6)
	console.log(a.inc_a(), a instanceof A, new A() instanceof A)
};
var Class = function(proto) {
	var C = function() {
		var p = this
		if(!(p instanceof C)) p = Object_create(C.prototype);
		typeof(proto.construct) == "function" && proto.construct.apply(p, arguments);
		return p
	}
	C.prototype = proto
	C.prototype.constructor = C
	return C
}


var fireEvent = function(f, args) {
	if(f == null) return
	f.apply(null, args);
}

var Dom_byId = function(name) {
	return G.document.getElementById(name);
}

var mouseEventPrefix = ("PointerEvent" in G) ? "pointer" : "mouse"
console.log("mouseEventPrefix = ", mouseEventPrefix)

var Dom_attachOnClick = function(domEl, f) {
	var isPressed = false
	domEl.addEventListener(mouseEventPrefix + "down", function(ev) {
		isPressed = true
	}, false);
	domEl.addEventListener(mouseEventPrefix + "move", function(ev) {
		if(!isPressed) return
		f(ev);
	}, false);
	domEl.addEventListener(mouseEventPrefix + "up", function(ev) {
		isPressed = false
	}, false);
}
var Dom_attachOnClick = function(domEl, f) {
	var isPressed = false
	var lastTarget = null
	var fire = function(ev) {
		if(ev.target == lastTarget) return
		lastTarget = ev.target
		f(ev);
	}
	var onMouseOver = function(ev) {
		fire(ev);
	}
	domEl.addEventListener(mouseEventPrefix + "down", function(ev) {
		fire(ev);
		domEl.addEventListener(mouseEventPrefix + "over", onMouseOver, false);
	}, false);
	domEl.addEventListener(mouseEventPrefix + "up", function(ev) {
		domEl.removeEventListener(mouseEventPrefix + "over", onMouseOver, false);
		fire(ev);
		lastTarget = null
	}, false);
}

if(0) {
var Dom_attachOnClick_isMousePressed = false
G.document.addEventListener(mouseEventPrefix + "down", function(ev) {
 if (ev.target.hasPointerCapture(ev.pointerId)) {
      ev.target.releasePointerCapture(ev.pointerId);
  };
	// G.document.releasePointerCapture && G.document.releasePointerCapture();
	console.log("gmousedown");
	Dom_attachOnClick_isMousePressed = true
}, false);
G.document.addEventListener(mouseEventPrefix + "up", function(ev) {
	console.log("gmouseup");
	Dom_attachOnClick_isMousePressed = false
}, false);

var Dom_attachOnClick = function(domEl, f) {
	if(domEl.Bga_Dom_attachOnClick_f == f) return;
	domEl.Bga_Dom_attachOnClick_f = f
	domEl.addEventListener(mouseEventPrefix + "down", function(ev) {
		// domEl.releasePointerCapture && domEl.releasePointerCapture();
		console.log("mousedown");
		f(ev);
	}, false);
	domEl.addEventListener(mouseEventPrefix + "over", function(ev) {
		console.log("mouseover");
		if(!Dom_attachOnClick_isMousePressed) return
		console.log("mouseover press");
		// console.log(ev.buttons, ev.button);
		// if(!(ev.buttons & 1)) return
		f(ev);
	}, false);
}
};

var Dom_attachOnClick_isMousePressed = false
G.document.addEventListener(mouseEventPrefix + "up", function(ev) {
	console.log("gmouseup");
	Dom_attachOnClick_isMousePressed = false
	Dom_attachOnClick.detachEventMoveEvent(ev);
}, false);

var Dom_attachOnClick = function(domEl, f) {
	if(domEl.Bga_Dom_attachOnClick_f == f) return;
	domEl.Bga_Dom_attachOnClick_f = f
	
	var lastTarget = null
	var fire = function(ev) {
		var target = ev.target
		if(target == domEl) {
			target = document.elementFromPoint(ev.clientX, ev.clientY)
		};
		G.console.log(target);
		if(target == lastTarget) return
		lastTarget = target
		
		f({target: target, __proto__: ev});
	}
	
	domEl.addEventListener(mouseEventPrefix + "down", function(ev) {
	 if(domEl.hasPointerCapture && !domEl.hasPointerCapture(ev.pointerId)) {
			domEl.setPointerCapture(ev.pointerId);
		};
		Dom_attachOnClick_isMousePressed = true
		attachEventMoveEvent();
		console.log("mousedown");
		ev.preventDefault();
		fire(ev);
	}, false);
	var lastPointerMoveF = function(ev) {
		console.log("mouseover");
		if(!Dom_attachOnClick_isMousePressed) return
		console.log("mouseover press");
		// console.log(ev.buttons, ev.button);
		// if(!(ev.buttons & 1)) return
		ev.preventDefault();
		fire(ev);
	};
	var xtachEventMoveEvent = function(action) {
		mouseEventPrefix == "mouse" && domEl[action + "EventListener"]("mouseover", lastPointerMoveF, false);
		mouseEventPrefix == "pointer" && domEl[action + "EventListener"]("pointermove", lastPointerMoveF, false);
	}
	var attachEventMoveEvent = function() {
		xtachEventMoveEvent("add");
	}
	Dom_attachOnClick.detachEventMoveEvent = function(ev) {
		if(domEl.hasPointerCapture && domEl.hasPointerCapture(ev.pointerId)) {
			domEl.releasePointerCapture(ev.pointerId);
		};
		xtachEventMoveEvent("remove");
		lastTarget = null;
	}
}

var Color_disabled = { pixel: "disabled" }
var Color_erased = { pixel: "erased" }


var DataApi = Class({
	construct: function(m_data) {
		this.m_data = m_data
	},
	getRawData: function() { return this.m_data },
	_getPixelIndex: function(x, y) {
		if(!(0 <= x && x < this.m_data.width && 0 <= y && y < this.m_data.height)) return null
		return x + y * this.m_data.width
	},
	_getPixelRef: function(x, y) {
		var index = this._getPixelIndex(x, y);
		if(index == null) return null
		if(!( "c" in this.m_data.pixels[index])) return null
		return this.m_data.pixels[index]
	},
	_setPixelRef: function(x, y, ref) {
		var index = this._getPixelIndex(x, y);
		if(index == null) return null
		if(!( "c" in this.m_data.pixels[index])) return null
		this.m_data.pixels[index] = ref
		return ref
	},
	getPixelId: function(x, y) {
		var pixelRef = this._getPixelRef(x, y);
		if(pixelRef == null) return null
		return pixelRef.id
	},
	getPixelColor: function(x, y) {
		var pixelRef = this._getPixelRef(x, y);
		if(pixelRef == null) return null
		var color = pixelRef.c
		if(color == "disabled") return Color_disabled
		if(color == "erased") return Color_erased
		return color
	},
	setPixelColor: function(x, y, color) {
		var pixelRef = this._getPixelRef(x, y);
		if(pixelRef == null) return null
		if(pixelRef.c == "disabled") return false
		var oldColor = pixelRef.c
		if(color == Color_erased) color = "erased"
		if(oldColor == color) return false 
		pixelRef.c = color
		return true
	},
	get_width: function() { return this.m_data.width },
	get_height: function() { return this.m_data.height },
})


var Event_throttle = function(timeout, f) {
	var threadId = null
	
	var fire = function() {
		if(threadId != null) {
			clearTimeout(threadId);
			threadId = null
		};
		var args = [].slice.call(arguments)
		threadId = setTimeout(function() { 
			threadId = null
			// debugger;
			f.apply(null, args);
			args = null
		}, fire.timeout);
	}
	
	fire.timeout = timeout
	
	return fire
}

/*
EventThrottler = Class({
	construct: function(timeout) {
		this.timeout = timeout
		
		this._lastTheradId = null
	},
	_fire: function() {
		this.f.apply(null, arguments);
	},
	call: function() {
		this._lastTheradId = setTimeout();
	}
	
});
*/
var canvas = Class({

	Tool_pen: "pen",
	Tool_erase: "erase",
	Tool_floodFill: "floodFill",
	Tool_propsEdit: "propsEdit",


	construct: function() {
		this.m_domEl = null

		this.m_tool = this.Tool_pen
		
		this.m_color = "#000"

		this.m_data = DataApi({
			width: 1,
			height: 1,
			pixels: [{ id: "foo", c: "#000"}]
		})
		
		this.fire_onDataChange = Event_throttle(1000, this.fire_onDataChange.bind(this)); 
		this.out_onDataChange = null
		
		this._propsEdit_xy = null
		
		this.out_onPropsChange = null
	},

	fire_onDataChange: function() {
		console.log("fire_onDataChange");
		fireEvent(this.out_onDataChange, [].slice.call(arguments));
	},

	_getTbl: function() {
		return this.m_domEl.firstElementChild
	},
	render: function() {
		console.log(this.m_data);
		var w = this.m_data.get_width();
		var h = this.m_data.get_height();
		
		t = ""
		t += "<table style=touch-action:none class=canvasTbl>"
		for(var y = 0; y < h; y += 1) {
			t += "<tr>"
			for(var x = 0; x < w; x += 1) {
				var color = this.m_data.getPixelColor(x, y);
				
				t += "<td"
				t += " data-x=" + x + " data-y=" + y
				if(0) {}
				else if(color == Color_erased) t += " class=erased"
				else if(color == Color_disabled) t += " class=disabled"
				else t += " style=background-color:" + color + " data-color=" + color 
				// t += (color == Color_disabled) ? " data-disabled=true " : " style=background-color:" + color + " data-color=" + color
				// if(color == Color_disabled) t += "data-disabled=true "
				t += "></td>"
			}
		}
		
		console.log(t);
		this.m_domEl.innerHTML = t
		this.attachEvents(this._getTbl());
	},
	update: function() {
		console.log(this.m_data);
		var w = this.m_data.get_width();
		var h = this.m_data.get_height();
		
		var tbl = this._getTbl()
		for(var y = 0; y < h; y += 1) {
			for(var x = 0; x < w; x += 1) {
				var color = this.m_data.getPixelColor(x, y);
				var cellEl = tbl.rows[y].cells[x]
				
				if(color == Color_erased) cellEl.classList.add("erased"); else cellEl.classList.remove("erased")
				if(color == Color_disabled) cellEl.classList.add("disabled"); else cellEl.classList.remove("disabled")
				if(color == Color_erased || color == Color_disabled) cellEl.style.backgroundColor = ""; else cellEl.style.backgroundColor = color 
			}
		}
	},
	
	domNodeToXY: function(domEl) {
		if(domEl.getAttribute("data-x") == null) return null
		return [
			+domEl.getAttribute("data-x"),
			+domEl.getAttribute("data-y"),
		]
	},
	attachEvents: function(domEl) {
		Dom_attachOnClick(domEl, this._onClick.bind(this))
	}, 
	_onClick: function(ev) {
		var xy = this.domNodeToXY(ev.target);
		if(xy == null) return
		var x = xy[0], y = xy[1]
		console.log(xy);
		if(0) {}
		else if(this.m_tool == this.Tool_pen || this.m_tool == this.Tool_erase) {
			var color = this.m_data.getPixelColor(x, y);
			
			if(color == Color_disabled) return
			
			var newColor = this.m_color
			if(this.m_tool == this.Tool_erase) newColor = Color_erased
			
			if(color == newColor) return
			
			if(newColor == Color_erased) {
				ev.target.classList.add("erased")
				ev.target.style.backgroundColor = ""
			}
			else {
				ev.target.classList.remove("erased")
				ev.target.style.backgroundColor = this.m_color
			}
			
			this.m_data.setPixelColor(x, y, newColor);
			
			this.fire_onDataChange(this.m_data.getRawData());
		} 
		else if(this.m_tool == this.Tool_floodFill) {
			var thi$ = this
			var isChanged = false
			
			var pixels = thi$.m_data.m_data.pixels
			var width = thi$.m_data.m_data.width
			var height = thi$.m_data.m_data.height
			
			var fill = function(x, y) {
				if(!(0 <= x && x < width && 0 <= y && y < height)) return
				var index = x + y * width
				if(!(pixels[index] && pixels[index].c == "erased")) return
				pixels[index].c = thi$.m_color
				isChanged = true
				fill(x + 1, y + 0);
				fill(x - 1, y + 0);
				fill(x + 0, y + 1);
				fill(x + 0, y - 1);
			}
			
			fill(x, y);
			
			if(!isChanged) return
			
			thi$.update();
			thi$.fire_onDataChange(thi$.m_data.getRawData());
		}
		else if(this.m_tool == this.Tool_propsEdit) {
			var tbl = this._getTbl()
			if(this._propsEdit_xy != null) {
				tbl.rows[this._propsEdit_xy[1]].cells[this._propsEdit_xy[0]].classList.remove("propsEdit_active");
				this._propsEdit_xy = null
			};
			var pixelRef = this.m_data._getPixelRef(x, y);
			if(pixelRef == null) return
			this._propsEdit_xy = xy
			tbl.rows[this._propsEdit_xy[1]].cells[this._propsEdit_xy[0]].classList.add("propsEdit_active");
			fireEvent(this.out_onPropsChange, [pixelRef]);
		}
	},

	in_onColorChoose: function(color) {
		this.m_color = color
	},
	in_onToolChoose: function(tool) {
		this.m_tool = tool
	},
	in_onDataChange: function(data) {
		var oldData = this.m_data
		this.m_data = DataApi(data)
		if(oldData.get_width() == this.m_data.get_width() && oldData.get_height() == this.m_data.get_height()) this.update(); else this.render();
	},
	in_onPropsChange: function(data) {
		if(this._propsEdit_xy == null) return
		var x = this._propsEdit_xy[0]
		var y = this._propsEdit_xy[1]
		this.m_data._setPixelRef(x, y, data);
		this.update();
		this.fire_onDataChange(this.m_data.getRawData());
	},
})()

var canvas_colorChoose = Class({
	construct: function() {
		this.m_domEl = null
		
		this.colorsInRow = 2
		
		this.out_onColorChange = null
		
	},
	render: function() {
		var colors = "#000,#F00,#0F0,#00F,#FF0,#0FF".split(",");
		
		var t = ""
		t += "<style> .canvas_colorChooseTbl td { width: 2em; height: 2em; }</style>"
		t += "<table class=canvas_colorChooseTbl>"
		for(var i = 0; i < 6; i += 1) {
			if(i % this.colorsInRow == 0) {
				t += "<tr>"
			};
			t += "<td style=background-color:" + colors[i] + " data-color=" + colors[i] + "></td>"
		}
		t += "</table>"
	
		this.m_domEl.innerHTML = t
		this.attachEvents();
	},
	
	
	onColorChoose: function(ev) {
		var color = ev.target.getAttribute("data-color");
		console.log(color);
		if(color == null) return
		fireEvent(this.out_onColorChange, [color]);
	},
	
	attachEvents: function() {
		this.m_domEl.addEventListener("click", this.onColorChoose.bind(this), false);
	},
})()

var main = function() {
	canvas_colorChoose.m_domEl = G.canvas_colorChoose
	canvas_colorChoose.render();
	canvas_colorChoose.out_onColorChange = function(color) {
		G.canvas_activeColor.style.backgroundColor = color;
		fireEvent(canvas.in_onColorChoose.bind(canvas), [color]);
	}
	
	G.canvas_ctl.addEventListener("change", function(ev) {
		var tool = G.canvas_ctl.elements["toolSelect"].value
		fireEvent(canvas.in_onToolChoose.bind(canvas), [tool]);
	}, false);
	
	canvas.m_domEl = G.canvas
	var loadDataJson = function(jsonText, f) {
		var json = null; 
		try { json = JSON.parse(jsonText) } catch(err) { console.error(err) };
		if(json != null) f(json); 
	}
	loadDataJson(G.canvas_dataInspect.value, function(json) {
		fireEvent(canvas.in_onDataChange.bind(canvas), [json]);
	});
	G.canvas_dataInspect.addEventListener("keydown", function(ev) {
		if(!(!ev.ctrlKey && ev.shiftKey && !ev.altKey && (ev.keyCode == 13))) return true
		loadDataJson(G.canvas_dataInspect.value, function(json) {
			fireEvent(canvas.in_onDataChange.bind(canvas), [json]);
		});
		ev.preventDefault(); 
	}, false);
	G.canvas_dataInspect_submit.onclick = function(ev) {
		loadDataJson(G.canvas_dataInspect.value, function(json) {
			fireEvent(canvas.in_onDataChange.bind(canvas), [json]);
		});
	}
	
	canvas.out_onDataChange = function(data) {
		// G.canvas_dataInspect.value = JSON.stringify(data, null, "\t");
		G.canvas_dataInspect.value = JSON.stringify(data);
	}


	G.canvas_propsEdit.addEventListener("keydown", function(ev) {
		if(!(!ev.ctrlKey && ev.shiftKey && !ev.altKey && (ev.keyCode == 13))) return true
		loadDataJson(G.canvas_propsEdit.value, function(json) {
			fireEvent(canvas.in_onPropsChange.bind(canvas), [json]);
		});
		ev.preventDefault(); 
	}, false);
	G.canvas_propsEdit_submit.onclick = function(ev) {
		loadDataJson(G.canvas_propsEdit.value, function(json) {
			fireEvent(canvas.in_onPropsChange.bind(canvas), [json]);
		});
	}
	
	canvas.out_onPropsChange = function(data) {
		// G.canvas_propsEdit.value = JSON.stringify(data, null, "\t");
		G.canvas_propsEdit.value = JSON.stringify(data);
	}
}

G.window.onload = main 
	
})(this)

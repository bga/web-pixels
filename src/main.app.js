(function(G) {

//# можешь этот логер удалить оставив пустой
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



var fireEvent = function(f, args) {
	if(f == null) return
	f.apply(null, args);
}

var Dom_byId = function(name) {
	return G.document.getElementById(name);
}

//# это универсальная логика тач + мышка. Проще не сделать
var mouseEventPrefix = ("PointerEvent" in G) ? "pointer" : "mouse"
console.log("mouseEventPrefix = ", mouseEventPrefix)

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
		console.log(target);
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

var canvas = {
	Tool_pen: "Tool_pen",
	Tool_floodFill: "Tool_floodFill",

	construct: function() {
		this.m_domEl = null
		
		this.m_color = "#000"

		this.m_tool = this.Tool_pen 

		this.out_onDataChange = null
	},

	fire_onDataChange: function() {
		console.log("fire_onDataChange");
		fireEvent(this.out_onDataChange, [this._getJson.bind(this)]);
	},


	domNodeToXY: function(domEl) {
		if(domEl == null || domEl.tagName != "TD") return null
		return [
			+domEl.cellIndex,
			+domEl.parentNode.rowIndex,
		]
	},
	attachEvents: function() {
		Dom_attachOnClick(this.m_domEl, this._onClick.bind(this))
	},
	_getTbl: function() { return this.m_domEl.tBodies[0] },
	_get_width: function() { return this._getTbl().rows[0].cells.length },
	_get_height: function() { return this._getTbl().rows.length },
	_convertColor: function(c) {
		var m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
		if(m == null) return c
		var toHex = function(s) { return ("0" + s.toString(16)).slice(-2).toUpperCase() }
		return "#" + toHex(+m[1]) + toHex(+m[2]) + toHex(+m[3])
	},
	_getColor: function(domEl) {
		if(domEl == null) return null
		return this._convertColor(domEl.style.backgroundColor); 
	},
	_setColor: function(domEl, c) {
		domEl.style.backgroundColor = c; 
	},
	getColorByXY: function(x, y) {
		return this._getColor(this._getTbl().rows[y].cells[x])
	},
	setColorByXY: function(x, y, c) {
		this._setColor(this._getTbl().rows[y].cells[x], c)
	},
	_onClick: function(ev) {
		var xy = this.domNodeToXY(ev.target);
		if(xy == null) return
		var x = xy[0], y = xy[1]
		console.log(xy);
		if(0) {}
		else if(this.m_tool == this.Tool_pen) {
			var color = this._getColor(ev.target);
			
			var newColor = this.m_color
			
			if(color == newColor) return
			
			this._setColor(ev.target, newColor)
			
			this.fire_onDataChange();
		}

		//# удалять не буду оставлю как заготовку
		else if(this.m_tool == this.Tool_floodFill) {
			var thi$ = this
			var isChanged = false
			
			var w = thi$._get_width()
			var h = thi$._get_height()
			
			var fill = function(x, y) {
				if(!(0 <= x && x < w && 0 <= y && y < h)) return
				var c = thi$.getColorByXY(x, y)
				if(c == thi$.m_color) return
				thi$.setColorByXY(x, y, thi$.m_color)
				isChanged = true
				fill(x + 1, y + 0);
				fill(x - 1, y + 0);
				fill(x + 0, y + 1);
				fill(x + 0, y - 1);
			}
			
			fill(x, y);
			
			if(!isChanged) return
			
			thi$.fire_onDataChange();
		}

	},
	_getJson: function() {
		var w = this._get_width()
		var h = this._get_height()
		var data = {"width": w, "height": h, "pixels": []}
		for(var y = 0; y < h; y += 1) {
			for(var x = 0; x < w; x += 1) {
				data.pixels[x + y * w] = this.getColorByXY(x, y)
			}
		}

		return data
	},

	in_onColorChoose: function(color) {
		this.m_color = color
	},
}


var main = function() {
	canvas.construct()
	canvas.m_domEl = Dom_byId("canvas")
	canvas.attachEvents(canvas.m_domEl)
	fireEvent(canvas.in_onColorChoose.bind(canvas), ["#FFFF00"]);
	
	canvas.out_onDataChange = function(getJson) {
		G.canvas_dataInspect.value = JSON.stringify(getJson());
	}
}

G.window.onload = main 
	
})(this)

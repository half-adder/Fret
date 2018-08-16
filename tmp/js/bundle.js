"use strict";var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a;}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r);},p,p.exports,r,e,n,t);}return n[i].exports;}for(var u="function"==typeof require&&require,i=0;i<t.length;i++){o(t[i]);}return o;}return r;})()({1:[function(require,module,exports){(function(root,factory){//UMD
if(typeof define==="function"&&define.amd){define(function(){return factory();});}else if((typeof module==="undefined"?"undefined":_typeof(module))==="object"){module.exports=factory();}else{root.Tone=factory();}})(this,function(){"use strict";var Tone;//constructs the main Tone object
function Main(func){Tone=func();}//invokes each of the modules with the main Tone object as the argument
function Module(func){func(Tone);}/**
	 *  Tone.js
	 *  @author Yotam Mann
	 *  @license http://opensource.org/licenses/MIT MIT License
	 *  @copyright 2014-2018 Yotam Mann
	 */Main(function(){///////////////////////////////////////////////////////////////////////////
//	TONE
///////////////////////////////////////////////////////////////////////////
/**
		 *  @class  Tone is the base class of all other classes.
		 *  @constructor
		 */var Tone=function Tone(){if(!(this instanceof Tone)){throw new Error('constructor needs to be called with the \'new\' keyword');}};/**
		 *  @memberOf Tone#
		 *  @returns {String} returns the name of the class as a string
		 */Tone.prototype.toString=function(){for(var className in Tone){var isLetter=className[0].match(/^[A-Z]$/);var sameConstructor=Tone[className]===this.constructor;if(Tone.isFunction(Tone[className])&&isLetter&&sameConstructor){return className;}}return'Tone';};/**
		 *  @memberOf Tone#
		 *  disconnect and dispose
		 *  @returns {Tone} this
		 */Tone.prototype.dispose=function(){return this;};///////////////////////////////////////////////////////////////////////////
//	GET/SET
///////////////////////////////////////////////////////////////////////////
/**
		 *  Set the parameters at once. Either pass in an
		 *  object mapping parameters to values, or to set a
		 *  single parameter, by passing in a string and value.
		 *  The last argument is an optional ramp time which
		 *  will ramp any signal values to their destination value
		 *  over the duration of the rampTime.
		 *  @param {Object|String} params
		 *  @param {Number=} value
		 *  @param {Time=} rampTime
		 *  @returns {Tone} this
		 *  @memberOf Tone#
		 *  @example
		 * //set values using an object
		 * filter.set({
		 * 	"frequency" : 300,
		 * 	"type" : highpass
		 * });
		 *  @example
		 * filter.set("type", "highpass");
		 *  @example
		 * //ramp to the value 220 over 3 seconds.
		 * oscillator.set({
		 * 	"frequency" : 220
		 * }, 3);
		 */Tone.prototype.set=function(params,value,rampTime){if(Tone.isObject(params)){rampTime=value;}else if(Tone.isString(params)){var tmpObj={};tmpObj[params]=value;params=tmpObj;}paramLoop:for(var attr in params){value=params[attr];var parent=this;if(attr.indexOf('.')!==-1){var attrSplit=attr.split('.');for(var i=0;i<attrSplit.length-1;i++){parent=parent[attrSplit[i]];if(parent instanceof Tone){attrSplit.splice(0,i+1);var innerParam=attrSplit.join('.');parent.set(innerParam,value);continue paramLoop;}}attr=attrSplit[attrSplit.length-1];}var param=parent[attr];if(Tone.isUndef(param)){continue;}if(Tone.Signal&&param instanceof Tone.Signal||Tone.Param&&param instanceof Tone.Param){if(param.value!==value){if(Tone.isUndef(rampTime)){param.value=value;}else{param.rampTo(value,rampTime);}}}else if(param instanceof AudioParam){if(param.value!==value){param.value=value;}}else if(Tone.TimeBase&&param instanceof Tone.TimeBase){parent[attr]=value;}else if(param instanceof Tone){param.set(value);}else if(param!==value){parent[attr]=value;}}return this;};/**
		 *  Get the object's attributes. Given no arguments get
		 *  will return all available object properties and their corresponding
		 *  values. Pass in a single attribute to retrieve or an array
		 *  of attributes. The attribute strings can also include a "."
		 *  to access deeper properties.
		 *  @memberOf Tone#
		 *  @example
		 * osc.get();
		 * //returns {"type" : "sine", "frequency" : 440, ...etc}
		 *  @example
		 * osc.get("type");
		 * //returns { "type" : "sine"}
		 * @example
		 * //use dot notation to access deep properties
		 * synth.get(["envelope.attack", "envelope.release"]);
		 * //returns {"envelope" : {"attack" : 0.2, "release" : 0.4}}
		 *  @param {Array=|string|undefined} params the parameters to get, otherwise will return
		 *  					                  all available.
		 *  @returns {Object}
		 */Tone.prototype.get=function(params){if(Tone.isUndef(params)){params=this._collectDefaults(this.constructor);}else if(Tone.isString(params)){params=[params];}var ret={};for(var i=0;i<params.length;i++){var attr=params[i];var parent=this;var subRet=ret;if(attr.indexOf('.')!==-1){var attrSplit=attr.split('.');for(var j=0;j<attrSplit.length-1;j++){var subAttr=attrSplit[j];subRet[subAttr]=subRet[subAttr]||{};subRet=subRet[subAttr];parent=parent[subAttr];}attr=attrSplit[attrSplit.length-1];}var param=parent[attr];if(Tone.isObject(params[attr])){subRet[attr]=param.get();}else if(Tone.Signal&&param instanceof Tone.Signal){subRet[attr]=param.value;}else if(Tone.Param&&param instanceof Tone.Param){subRet[attr]=param.value;}else if(param instanceof AudioParam){subRet[attr]=param.value;}else if(param instanceof Tone){subRet[attr]=param.get();}else if(!Tone.isFunction(param)&&Tone.isDefined(param)){subRet[attr]=param;}}return ret;};/**
		 *  collect all of the default attributes in one
		 *  @private
		 *  @param {Function} constr the constructor to find the defaults from
		 *  @return {Array} all of the attributes which belong to the class
		 */Tone.prototype._collectDefaults=function(constr){var ret=[];if(Tone.isDefined(constr.defaults)){ret=Object.keys(constr.defaults);}if(Tone.isDefined(constr._super)){var superDefs=this._collectDefaults(constr._super);//filter out repeats
for(var i=0;i<superDefs.length;i++){if(ret.indexOf(superDefs[i])===-1){ret.push(superDefs[i]);}}}return ret;};///////////////////////////////////////////////////////////////////////////
//	DEFAULTS
///////////////////////////////////////////////////////////////////////////
/**
		 *  @memberOf Tone
		 *  @param  {Array}  values  The arguments array
		 *  @param  {Array}  keys    The names of the arguments
		 *  @param {Function|Object} constr The class constructor
		 *  @return  {Object}  An object composed of the  defaults between the class' defaults
		 *                        and the passed in arguments.
		 */Tone.defaults=function(values,keys,constr){var options={};if(values.length===1&&Tone.isObject(values[0])){options=values[0];}else{for(var i=0;i<keys.length;i++){options[keys[i]]=values[i];}}if(Tone.isDefined(constr.defaults)){return Tone.defaultArg(options,constr.defaults);}else if(Tone.isObject(constr)){return Tone.defaultArg(options,constr);}else{return options;}};/**
		 *  If the `given` parameter is undefined, use the `fallback`.
		 *  If both `given` and `fallback` are object literals, it will
		 *  return a deep copy which includes all of the parameters from both
		 *  objects. If a parameter is undefined in given, it will return
		 *  the fallback property.
		 *  <br><br>
		 *  WARNING: if object is self referential, it will go into an an
		 *  infinite recursive loop.
		 *  @memberOf Tone
		 *  @param  {*} given
		 *  @param  {*} fallback
		 *  @return {*}
		 */Tone.defaultArg=function(given,fallback){if(Tone.isObject(given)&&Tone.isObject(fallback)){var ret={};//make a deep copy of the given object
for(var givenProp in given){ret[givenProp]=Tone.defaultArg(fallback[givenProp],given[givenProp]);}for(var fallbackProp in fallback){ret[fallbackProp]=Tone.defaultArg(given[fallbackProp],fallback[fallbackProp]);}return ret;}else{return Tone.isUndef(given)?fallback:given;}};///////////////////////////////////////////////////////////////////////////
//	CONNECTIONS
///////////////////////////////////////////////////////////////////////////
/**
		 *  connect together all of the arguments in series
		 *  @param {...AudioParam|Tone|AudioNode} nodes
		 *  @returns {Tone}
		 *  @memberOf Tone
		 *  @static
		 */Tone.connectSeries=function(){var currentUnit=arguments[0];for(var i=1;i<arguments.length;i++){var toUnit=arguments[i];currentUnit.connect(toUnit);currentUnit=toUnit;}return Tone;};///////////////////////////////////////////////////////////////////////////
// TYPE CHECKING
///////////////////////////////////////////////////////////////////////////
/**
		 *  Test if the arg is undefined
		 *  @param {*} arg the argument to test
		 *  @returns {Boolean} true if the arg is undefined
		 *  @static
		 *  @memberOf Tone
		 */Tone.isUndef=function(val){return typeof val==='undefined';};/**
		 *  Test if the arg is not undefined
		 *  @param {*} arg the argument to test
		 *  @returns {Boolean} true if the arg is undefined
		 *  @static
		 *  @memberOf Tone
		 */Tone.isDefined=function(val){return!Tone.isUndef(val);};/**
		 *  Test if the arg is a function
		 *  @param {*} arg the argument to test
		 *  @returns {Boolean} true if the arg is a function
		 *  @static
		 *  @memberOf Tone
		 */Tone.isFunction=function(val){return typeof val==='function';};/**
		 *  Test if the argument is a number.
		 *  @param {*} arg the argument to test
		 *  @returns {Boolean} true if the arg is a number
		 *  @static
		 *  @memberOf Tone
		 */Tone.isNumber=function(arg){return typeof arg==='number';};/**
		 *  Test if the given argument is an object literal (i.e. `{}`);
		 *  @param {*} arg the argument to test
		 *  @returns {Boolean} true if the arg is an object literal.
		 *  @static
		 *  @memberOf Tone
		 */Tone.isObject=function(arg){return Object.prototype.toString.call(arg)==='[object Object]'&&arg.constructor===Object;};/**
		 *  Test if the argument is a boolean.
		 *  @param {*} arg the argument to test
		 *  @returns {Boolean} true if the arg is a boolean
		 *  @static
		 *  @memberOf Tone
		 */Tone.isBoolean=function(arg){return typeof arg==='boolean';};/**
		 *  Test if the argument is an Array
		 *  @param {*} arg the argument to test
		 *  @returns {Boolean} true if the arg is an array
		 *  @static
		 *  @memberOf Tone
		 */Tone.isArray=function(arg){return Array.isArray(arg);};/**
		 *  Test if the argument is a string.
		 *  @param {*} arg the argument to test
		 *  @returns {Boolean} true if the arg is a string
		 *  @static
		 *  @memberOf Tone
		 */Tone.isString=function(arg){return typeof arg==='string';};/**
		 *  Test if the argument is in the form of a note in scientific pitch notation.
		 *  e.g. "C4"
		 *  @param {*} arg the argument to test
		 *  @returns {Boolean} true if the arg is a string
		 *  @static
		 *  @memberOf Tone
		 */Tone.isNote=function(arg){return Tone.isString(arg)&&/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i.test(arg);};/**
		 *  An empty function.
		 *  @static
		 */Tone.noOp=function(){};/**
		 *  Make the property not writable. Internal use only.
		 *  @private
		 *  @param  {String}  property  the property to make not writable
		 */Tone.prototype._readOnly=function(property){if(Array.isArray(property)){for(var i=0;i<property.length;i++){this._readOnly(property[i]);}}else{Object.defineProperty(this,property,{writable:false,enumerable:true});}};/**
		 *  Make an attribute writeable. Interal use only.
		 *  @private
		 *  @param  {String}  property  the property to make writable
		 */Tone.prototype._writable=function(property){if(Array.isArray(property)){for(var i=0;i<property.length;i++){this._writable(property[i]);}}else{Object.defineProperty(this,property,{writable:true});}};/**
		 * Possible play states.
		 * @enum {String}
		 */Tone.State={Started:'started',Stopped:'stopped',Paused:'paused'};///////////////////////////////////////////////////////////////////////////
// CONVERSIONS
///////////////////////////////////////////////////////////////////////////
/**
		 *  Equal power gain scale. Good for cross-fading.
		 *  @param  {NormalRange} percent (0-1)
		 *  @return {Number}         output gain (0-1)
		 *  @static
		 *  @memberOf Tone
		 */Tone.equalPowerScale=function(percent){var piFactor=0.5*Math.PI;return Math.sin(percent*piFactor);};/**
		 *  Convert decibels into gain.
		 *  @param  {Decibels} db
		 *  @return {Number}
		 *  @static
		 *  @memberOf Tone
		 */Tone.dbToGain=function(db){return Math.pow(10,db/20);};/**
		 *  Convert gain to decibels.
		 *  @param  {Number} gain (0-1)
		 *  @return {Decibels}
		 *  @static
		 *  @memberOf Tone
		 */Tone.gainToDb=function(gain){return 20*(Math.log(gain)/Math.LN10);};/**
		 *  Convert an interval (in semitones) to a frequency ratio.
		 *  @param  {Interval} interval the number of semitones above the base note
		 *  @return {Number}          the frequency ratio
		 *  @static
		 *  @memberOf Tone
		 *  @example
		 * tone.intervalToFrequencyRatio(0); // 1
		 * tone.intervalToFrequencyRatio(12); // 2
		 * tone.intervalToFrequencyRatio(-12); // 0.5
		 */Tone.intervalToFrequencyRatio=function(interval){return Math.pow(2,interval/12);};///////////////////////////////////////////////////////////////////////////
//	TIMING
///////////////////////////////////////////////////////////////////////////
/**
		 *  Return the current time of the AudioContext clock.
		 *  @return {Number} the currentTime from the AudioContext
		 *  @memberOf Tone#
		 */Tone.prototype.now=function(){return Tone.context.now();};/**
		 *  Return the current time of the AudioContext clock.
		 *  @return {Number} the currentTime from the AudioContext
		 *  @static
		 *  @memberOf Tone
		 */Tone.now=function(){return Tone.context.now();};///////////////////////////////////////////////////////////////////////////
//	INHERITANCE
///////////////////////////////////////////////////////////////////////////
/**
		 *  have a child inherit all of Tone's (or a parent's) prototype
		 *  to inherit the parent's properties, make sure to call
		 *  Parent.call(this) in the child's constructor
		 *
		 *  based on closure library's inherit function
		 *
		 *  @memberOf Tone
		 *  @static
		 *  @param  {Function} 	child
		 *  @param  {Function=} parent (optional) parent to inherit from
		 *                             if no parent is supplied, the child
		 *                             will inherit from Tone
		 */Tone.extend=function(child,parent){if(Tone.isUndef(parent)){parent=Tone;}function TempConstructor(){}TempConstructor.prototype=parent.prototype;child.prototype=new TempConstructor();/** @override */child.prototype.constructor=child;child._super=parent;};///////////////////////////////////////////////////////////////////////////
//	CONTEXT
///////////////////////////////////////////////////////////////////////////
/**
		 *  Private reference to the global AudioContext
		 *  @type {AudioContext}
		 *  @private
		 */var audioContext=null;/**
		 *  A static pointer to the audio context accessible as Tone.context.
		 *  @type {Tone.Context}
		 *  @name context
		 *  @memberOf Tone
		 */Object.defineProperty(Tone,'context',{get:function get(){return audioContext;},set:function set(context){if(Tone.Context&&context instanceof Tone.Context){audioContext=context;}else{audioContext=new Tone.Context(context);}//initialize the new audio context
Tone.Context.emit('init',audioContext);}});/**
		 *  The AudioContext
		 *  @type {Tone.Context}
		 *  @name context
		 *  @memberOf Tone#
		 *  @readOnly
		 */Object.defineProperty(Tone.prototype,'context',{get:function get(){return Tone.context;}});/**
		 *  Tone automatically creates a context on init, but if you are working
		 *  with other libraries which also create an AudioContext, it can be
		 *  useful to set your own. If you are going to set your own context,
		 *  be sure to do it at the start of your code, before creating any objects.
		 *  @static
		 *  @param {AudioContext} ctx The new audio context to set
		 */Tone.setContext=function(ctx){Tone.context=ctx;};///////////////////////////////////////////////////////////////////////////
//	ATTRIBUTES
///////////////////////////////////////////////////////////////////////////
/**
		 *  The number of seconds of 1 processing block (128 samples)
		 *  @type {Number}
		 *  @name blockTime
		 *  @memberOf Tone
		 *  @static
		 *  @readOnly
		 */Object.defineProperty(Tone.prototype,'blockTime',{get:function get(){return 128/this.context.sampleRate;}});/**
		 *  The duration in seconds of one sample.
		 *  @type {Number}
		 *  @name sampleTime
		 *  @memberOf Tone
		 *  @static
		 *  @readOnly
		 */Object.defineProperty(Tone.prototype,'sampleTime',{get:function get(){return 1/this.context.sampleRate;}});/**
		 *  Whether or not all the technologies that Tone.js relies on are supported by the current browser.
		 *  @type {Boolean}
		 *  @name supported
		 *  @memberOf Tone
		 *  @readOnly
		 *  @static
		 */Object.defineProperty(Tone,'supported',{get:function get(){var hasAudioContext=window.hasOwnProperty('AudioContext')||window.hasOwnProperty('webkitAudioContext');var hasPromises=window.hasOwnProperty('Promise');var hasWorkers=window.hasOwnProperty('Worker');return hasAudioContext&&hasPromises&&hasWorkers;}});/**
		 *  Boolean value if the audio context has been initialized.
		 *  @type {Boolean}
		 *  @memberOf Tone
		 *  @static
		 *  @name initialized
		 */Object.defineProperty(Tone,'initialized',{get:function get(){return audioContext!==null;}});/**
		 *  Get the context when it becomes available
		 *  @param  {Function}  resolve  Callback when the context is initialized
		 *  @return  {Tone}
		 */Tone.getContext=function(resolve){if(Tone.initialized){resolve(Tone.context);}else{var resCallback=function resCallback(){resolve(Tone.context);Tone.Context.off('init',resCallback);};Tone.Context.on('init',resCallback);}return Tone;};/**
		 * The version number
		 * @type {String}
		 * @static
		 */Tone.version='r12';return Tone;});Module(function(Tone){/**
		 *  @class Tone.Emitter gives classes which extend it
		 *         the ability to listen for and emit events.
		 *         Inspiration and reference from Jerome Etienne's [MicroEvent](https://github.com/jeromeetienne/microevent.js).
		 *         MIT (c) 2011 Jerome Etienne.
		 *
		 *  @extends {Tone}
		 */Tone.Emitter=function(){Tone.call(this);/**
			 *  Contains all of the events.
			 *  @private
			 *  @type  {Object}
			 */this._events={};};Tone.extend(Tone.Emitter);/**
		 *  Bind a callback to a specific event.
		 *  @param  {String}    event     The name of the event to listen for.
		 *  @param  {Function}  callback  The callback to invoke when the
		 *                                event is emitted
		 *  @return  {Tone.Emitter}    this
		 */Tone.Emitter.prototype.on=function(event,callback){//split the event
var events=event.split(/\W+/);for(var i=0;i<events.length;i++){var eventName=events[i];if(!this._events.hasOwnProperty(eventName)){this._events[eventName]=[];}this._events[eventName].push(callback);}return this;};/**
		 *  Bind a callback which is only invoked once
		 *  @param  {String}    event     The name of the event to listen for.
		 *  @param  {Function}  callback  The callback to invoke when the
		 *                                event is emitted
		 *  @return  {Tone.Emitter}    this
		 */Tone.Emitter.prototype.once=function(event,callback){var boundCallback=function(){//invoke the callback
callback.apply(this,arguments);this.off(event,boundCallback);}.bind(this);this.on(event,boundCallback);return this;};/**
		 *  Remove the event listener.
		 *  @param  {String}    event     The event to stop listening to.
		 *  @param  {Function=}  callback  The callback which was bound to
		 *                                the event with Tone.Emitter.on.
		 *                                If no callback is given, all callbacks
		 *                                events are removed.
		 *  @return  {Tone.Emitter}    this
		 */Tone.Emitter.prototype.off=function(event,callback){var events=event.split(/\W+/);for(var ev=0;ev<events.length;ev++){event=events[ev];if(this._events.hasOwnProperty(event)){if(Tone.isUndef(callback)){this._events[event]=[];}else{var eventList=this._events[event];for(var i=0;i<eventList.length;i++){if(eventList[i]===callback){eventList.splice(i,1);}}}}}return this;};/**
		 *  Invoke all of the callbacks bound to the event
		 *  with any arguments passed in.
		 *  @param  {String}  event  The name of the event.
		 *  @param {*} args... The arguments to pass to the functions listening.
		 *  @return  {Tone.Emitter}  this
		 */Tone.Emitter.prototype.emit=function(event){if(this._events){var args=Array.apply(null,arguments).slice(1);if(this._events.hasOwnProperty(event)){var eventList=this._events[event].slice(0);for(var i=0,len=eventList.length;i<len;i++){eventList[i].apply(this,args);}}}return this;};/**
		 *  Add Emitter functions (on/off/emit) to the object
		 *  @param  {Object|Function}  object  The object or class to extend.
		 *  @returns {Tone.Emitter}
		 */Tone.Emitter.mixin=function(object){var functions=['on','once','off','emit'];object._events={};for(var i=0;i<functions.length;i++){var func=functions[i];var emitterFunc=Tone.Emitter.prototype[func];object[func]=emitterFunc;}return Tone.Emitter;};/**
		 *  Clean up
		 *  @return  {Tone.Emitter}  this
		 */Tone.Emitter.prototype.dispose=function(){Tone.prototype.dispose.call(this);this._events=null;return this;};return Tone.Emitter;});Module(function(Tone){/**
		 *  @class A Timeline class for scheduling and maintaining state
		 *         along a timeline. All events must have a "time" property.
		 *         Internally, events are stored in time order for fast
		 *         retrieval.
		 *  @extends {Tone}
		 *  @param {Positive} [memory=Infinity] The number of previous events that are retained.
		 */Tone.Timeline=function(){var options=Tone.defaults(arguments,['memory'],Tone.Timeline);Tone.call(this);/**
			 *  The array of scheduled timeline events
			 *  @type  {Array}
			 *  @private
			 */this._timeline=[];/**
			 *  The memory of the timeline, i.e.
			 *  how many events in the past it will retain
			 *  @type {Positive}
			 */this.memory=options.memory;};Tone.extend(Tone.Timeline);/**
		 *  the default parameters
		 *  @static
		 *  @const
		 */Tone.Timeline.defaults={'memory':Infinity};/**
		 *  The number of items in the timeline.
		 *  @type {Number}
		 *  @memberOf Tone.Timeline#
		 *  @name length
		 *  @readOnly
		 */Object.defineProperty(Tone.Timeline.prototype,'length',{get:function get(){return this._timeline.length;}});/**
		 *  Insert an event object onto the timeline. Events must have a "time" attribute.
		 *  @param  {Object}  event  The event object to insert into the
		 *                           timeline.
		 *  @returns {Tone.Timeline} this
		 */Tone.Timeline.prototype.add=function(event){//the event needs to have a time attribute
if(Tone.isUndef(event.time)){throw new Error('Tone.Timeline: events must have a time attribute');}event.time=event.time.valueOf();var index=this._search(event.time);this._timeline.splice(index+1,0,event);//if the length is more than the memory, remove the previous ones
if(this.length>this.memory){var diff=this.length-this.memory;this._timeline.splice(0,diff);}return this;};/**
		 *  Remove an event from the timeline.
		 *  @param  {Object}  event  The event object to remove from the list.
		 *  @returns {Tone.Timeline} this
		 */Tone.Timeline.prototype.remove=function(event){var index=this._timeline.indexOf(event);if(index!==-1){this._timeline.splice(index,1);}return this;};/**
		 *  Get the nearest event whose time is less than or equal to the given time.
		 *  @param  {Number}  time  The time to query.
		 *  @param  {String}  comparator Which value in the object to compare
		 *  @returns {Object} The event object set after that time.
		 */Tone.Timeline.prototype.get=function(time,comparator){comparator=Tone.defaultArg(comparator,'time');var index=this._search(time,comparator);if(index!==-1){return this._timeline[index];}else{return null;}};/**
		 *  Return the first event in the timeline without removing it
		 *  @returns {Object} The first event object
		 */Tone.Timeline.prototype.peek=function(){return this._timeline[0];};/**
		 *  Return the first event in the timeline and remove it
		 *  @returns {Object} The first event object
		 */Tone.Timeline.prototype.shift=function(){return this._timeline.shift();};/**
		 *  Get the event which is scheduled after the given time.
		 *  @param  {Number}  time  The time to query.
		 *  @param  {String}  comparator Which value in the object to compare
		 *  @returns {Object} The event object after the given time
		 */Tone.Timeline.prototype.getAfter=function(time,comparator){comparator=Tone.defaultArg(comparator,'time');var index=this._search(time,comparator);if(index+1<this._timeline.length){return this._timeline[index+1];}else{return null;}};/**
		 *  Get the event before the event at the given time.
		 *  @param  {Number}  time  The time to query.
		 *  @param  {String}  comparator Which value in the object to compare
		 *  @returns {Object} The event object before the given time
		 */Tone.Timeline.prototype.getBefore=function(time,comparator){comparator=Tone.defaultArg(comparator,'time');var len=this._timeline.length;//if it's after the last item, return the last item
if(len>0&&this._timeline[len-1][comparator]<time){return this._timeline[len-1];}var index=this._search(time,comparator);if(index-1>=0){return this._timeline[index-1];}else{return null;}};/**
		 *  Cancel events after the given time
		 *  @param  {Number}  time  The time to query.
		 *  @returns {Tone.Timeline} this
		 */Tone.Timeline.prototype.cancel=function(after){if(this._timeline.length>1){var index=this._search(after);if(index>=0){if(this._timeline[index].time===after){//get the first item with that time
for(var i=index;i>=0;i--){if(this._timeline[i].time===after){index=i;}else{break;}}this._timeline=this._timeline.slice(0,index);}else{this._timeline=this._timeline.slice(0,index+1);}}else{this._timeline=[];}}else if(this._timeline.length===1){//the first item's time
if(this._timeline[0].time>=after){this._timeline=[];}}return this;};/**
		 *  Cancel events before or equal to the given time.
		 *  @param  {Number}  time  The time to cancel before.
		 *  @returns {Tone.Timeline} this
		 */Tone.Timeline.prototype.cancelBefore=function(time){var index=this._search(time);if(index>=0){this._timeline=this._timeline.slice(index+1);}return this;};/**
		 * Returns the previous event if there is one. null otherwise
		 * @param  {Object} event The event to find the previous one of
		 * @return {Object}       The event right before the given event
		 */Tone.Timeline.prototype.previousEvent=function(event){var index=this._timeline.indexOf(event);if(index>0){return this._timeline[index-1];}else{return null;}};/**
		 *  Does a binary search on the timeline array and returns the
		 *  nearest event index whose time is after or equal to the given time.
		 *  If a time is searched before the first index in the timeline, -1 is returned.
		 *  If the time is after the end, the index of the last item is returned.
		 *  @param  {Number}  time
		 *  @param  {String}  comparator Which value in the object to compare
		 *  @return  {Number} the index in the timeline array
		 *  @private
		 */Tone.Timeline.prototype._search=function(time,comparator){if(this._timeline.length===0){return-1;}comparator=Tone.defaultArg(comparator,'time');var beginning=0;var len=this._timeline.length;var end=len;if(len>0&&this._timeline[len-1][comparator]<=time){return len-1;}while(beginning<end){// calculate the midpoint for roughly equal partition
var midPoint=Math.floor(beginning+(end-beginning)/2);var event=this._timeline[midPoint];var nextEvent=this._timeline[midPoint+1];if(event[comparator]===time){//choose the last one that has the same time
for(var i=midPoint;i<this._timeline.length;i++){var testEvent=this._timeline[i];if(testEvent[comparator]===time){midPoint=i;}}return midPoint;}else if(event[comparator]<time&&nextEvent[comparator]>time){return midPoint;}else if(event[comparator]>time){//search lower
end=midPoint;}else{//search upper
beginning=midPoint+1;}}return-1;};/**
		 *  Internal iterator. Applies extra safety checks for
		 *  removing items from the array.
		 *  @param  {Function}  callback
		 *  @param  {Number=}    lowerBound
		 *  @param  {Number=}    upperBound
		 *  @private
		 */Tone.Timeline.prototype._iterate=function(callback,lowerBound,upperBound){lowerBound=Tone.defaultArg(lowerBound,0);upperBound=Tone.defaultArg(upperBound,this._timeline.length-1);this._timeline.slice(lowerBound,upperBound+1).forEach(function(event){callback.call(this,event);}.bind(this));};/**
		 *  Iterate over everything in the array
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.Timeline} this
		 */Tone.Timeline.prototype.forEach=function(callback){this._iterate(callback);return this;};/**
		 *  Iterate over everything in the array at or before the given time.
		 *  @param  {Number}  time The time to check if items are before
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.Timeline} this
		 */Tone.Timeline.prototype.forEachBefore=function(time,callback){//iterate over the items in reverse so that removing an item doesn't break things
var upperBound=this._search(time);if(upperBound!==-1){this._iterate(callback,0,upperBound);}return this;};/**
		 *  Iterate over everything in the array after the given time.
		 *  @param  {Number}  time The time to check if items are before
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.Timeline} this
		 */Tone.Timeline.prototype.forEachAfter=function(time,callback){//iterate over the items in reverse so that removing an item doesn't break things
var lowerBound=this._search(time);this._iterate(callback,lowerBound+1);return this;};/**
		 *  Iterate over everything in the array between the startTime and endTime. 
		 *  The timerange is inclusive of the startTime, but exclusive of the endTime. 
		 *  range = [startTime, endTime). 
		 *  @param  {Number}  startTime The time to check if items are before
		 *  @param  {Number}  endTime The end of the test interval. 
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.Timeline} this
		 */Tone.Timeline.prototype.forEachBetween=function(startTime,endTime,callback){var lowerBound=this._search(startTime);var upperBound=this._search(endTime);if(lowerBound!==-1&&upperBound!==-1){if(this._timeline[lowerBound].time!==startTime){lowerBound+=1;}//exclusive of the end time
if(this._timeline[upperBound].time===endTime){upperBound-=1;}this._iterate(callback,lowerBound,upperBound);}else if(lowerBound===-1){this._iterate(callback,0,upperBound);}return this;};/**
		 *  Iterate over everything in the array at or after the given time. Similar to
		 *  forEachAfter, but includes the item(s) at the given time.
		 *  @param  {Number}  time The time to check if items are before
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.Timeline} this
		 */Tone.Timeline.prototype.forEachFrom=function(time,callback){//iterate over the items in reverse so that removing an item doesn't break things
var lowerBound=this._search(time);//work backwards until the event time is less than time
while(lowerBound>=0&&this._timeline[lowerBound].time>=time){lowerBound--;}this._iterate(callback,lowerBound+1);return this;};/**
		 *  Iterate over everything in the array at the given time
		 *  @param  {Number}  time The time to check if items are before
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.Timeline} this
		 */Tone.Timeline.prototype.forEachAtTime=function(time,callback){//iterate over the items in reverse so that removing an item doesn't break things
var upperBound=this._search(time);if(upperBound!==-1){this._iterate(function(event){if(event.time===time){callback.call(this,event);}},0,upperBound);}return this;};/**
		 *  Clean up.
		 *  @return  {Tone.Timeline}  this
		 */Tone.Timeline.prototype.dispose=function(){Tone.prototype.dispose.call(this);this._timeline=null;return this;};return Tone.Timeline;});Module(function(Tone){if(Tone.supported){if(!window.hasOwnProperty('OfflineAudioContext')&&window.hasOwnProperty('webkitOfflineAudioContext')){window.OfflineAudioContext=window.webkitOfflineAudioContext;}//returns promise?
var context=new OfflineAudioContext(1,1,44100);var ret=context.startRendering();if(!(ret instanceof Promise)){OfflineAudioContext.prototype._native_startRendering=OfflineAudioContext.prototype.startRendering;OfflineAudioContext.prototype.startRendering=function(){return new Promise(function(done){this.oncomplete=function(e){done(e.renderedBuffer);};this._native_startRendering();}.bind(this));};}}});Module(function(Tone){if(Tone.supported){if(!window.hasOwnProperty('AudioContext')&&window.hasOwnProperty('webkitAudioContext')){window.AudioContext=window.webkitAudioContext;}//not functionally equivalent, but only an API placeholder
if(!AudioContext.prototype.close){AudioContext.prototype.close=function(){if(Tone.isFunction(this.suspend)){this.suspend();}return Promise.resolve();};}//not functionally equivalent
if(!AudioContext.prototype.resume){AudioContext.prototype.resume=function(){return Promise.resolve();};}//createGain
if(!AudioContext.prototype.createGain&&AudioContext.prototype.createGainNode){AudioContext.prototype.createGain=AudioContext.prototype.createGainNode;}//createDelay
if(!AudioContext.prototype.createDelay&&AudioContext.prototype.createDelayNode){AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode;}//test decodeAudioData returns a promise
// https://github.com/mohayonao/web-audio-api-shim/blob/master/src/AudioContext.js
// MIT License (c) 2015 @mohayonao
var decodeAudioDataPromise=false;var offlineContext=new OfflineAudioContext(1,1,44100);var audioData=new Uint32Array([1179011410,48,1163280727,544501094,16,131073,44100,176400,1048580,1635017060,8,0,0,0,0]).buffer;try{var ret=offlineContext.decodeAudioData(audioData);if(ret instanceof Promise){decodeAudioDataPromise=true;}}catch(e){decodeAudioDataPromise=false;}if(!decodeAudioDataPromise){AudioContext.prototype._native_decodeAudioData=AudioContext.prototype.decodeAudioData;AudioContext.prototype.decodeAudioData=function(audioData){return new Promise(function(success,error){this._native_decodeAudioData(audioData,success,error);}.bind(this));};}}});Module(function(Tone){/**
		 *  @class Wrapper around the native AudioContext.
		 *  @extends {Tone.Emitter}
		 *  @param {AudioContext=} context optionally pass in a context
		 */Tone.Context=function(){Tone.Emitter.call(this);var options=Tone.defaults(arguments,['context'],Tone.Context);if(!options.context){options.context=new window.AudioContext();if(!options.context){throw new Error('could not create AudioContext. Possibly too many AudioContexts running already.');}}this._context=options.context;// extend all of the methods
for(var prop in this._context){this._defineProperty(this._context,prop);}/**
			 *  The default latency hint
			 *  @type  {String}
			 *  @private
			 */this._latencyHint=options.latencyHint;/**
			 *  An object containing all of the constants AudioBufferSourceNodes
			 *  @type  {Object}
			 *  @private
			 */this._constants={};///////////////////////////////////////////////////////////////////////
// WORKER
///////////////////////////////////////////////////////////////////////
/**
			 *  The amount of time events are scheduled
			 *  into the future
			 *  @type  {Number}
			 */this.lookAhead=options.lookAhead;/**
			 *  A reference to the actual computed update interval
			 *  @type  {Number}
			 *  @private
			 */this._computedUpdateInterval=0;/**
			 *  A reliable callback method
			 *  @private
			 *  @type  {Ticker}
			 */this._ticker=new Ticker(this.emit.bind(this,'tick'),options.clockSource,options.updateInterval);///////////////////////////////////////////////////////////////////////
// TIMEOUTS
///////////////////////////////////////////////////////////////////////
/**
			 *  All of the setTimeout events.
			 *  @type  {Tone.Timeline}
			 *  @private
			 */this._timeouts=new Tone.Timeline();/**
			 *  The timeout id counter
			 *  @private
			 *  @type {Number}
			 */this._timeoutIds=0;this.on('tick',this._timeoutLoop.bind(this));};Tone.extend(Tone.Context,Tone.Emitter);Tone.Emitter.mixin(Tone.Context);/**
		 * defaults
		 * @static
		 * @type {Object}
		 */Tone.Context.defaults={'clockSource':'worker','latencyHint':'interactive','lookAhead':0.1,'updateInterval':0.03};/**
		 *  Define a property on this Tone.Context.
		 *  This is used to extend the native AudioContext
		 *  @param  {AudioContext}  context
		 *  @param  {String}  prop
		 *  @private
		 */Tone.Context.prototype._defineProperty=function(context,prop){if(Tone.isUndef(this[prop])){Object.defineProperty(this,prop,{get:function get(){if(typeof context[prop]==='function'){return context[prop].bind(context);}else{return context[prop];}},set:function set(val){context[prop]=val;}});}};/**
		 *  The current audio context time
		 *  @return  {Number}
		 */Tone.Context.prototype.now=function(){return this._context.currentTime+this.lookAhead;};/**
		 *  Promise which is invoked when the context is running.
		 *  Tries to resume the context if it's not started.
		 *  @return  {Promise}
		 */Tone.Context.prototype.ready=function(){return new Promise(function(done){if(this._context.state==='running'){done();}else{this._context.resume().then(function(){done();});}}.bind(this));};/**
		 *  Promise which is invoked when the context is running.
		 *  Tries to resume the context if it's not started.
		 *  @return  {Promise}
		 */Tone.Context.prototype.close=function(){return this._context.close().then(function(){Tone.Context.emit('close',this);}.bind(this));};/**
		 *  Generate a looped buffer at some constant value.
		 *  @param  {Number}  val
		 *  @return  {BufferSourceNode}
		 */Tone.Context.prototype.getConstant=function(val){if(this._constants[val]){return this._constants[val];}else{var buffer=this._context.createBuffer(1,128,this._context.sampleRate);var arr=buffer.getChannelData(0);for(var i=0;i<arr.length;i++){arr[i]=val;}var constant=this._context.createBufferSource();constant.channelCount=1;constant.channelCountMode='explicit';constant.buffer=buffer;constant.loop=true;constant.start(0);this._constants[val]=constant;return constant;}};/**
		 *  The private loop which keeps track of the context scheduled timeouts
		 *  Is invoked from the clock source
		 *  @private
		 */Tone.Context.prototype._timeoutLoop=function(){var now=this.now();while(this._timeouts&&this._timeouts.length&&this._timeouts.peek().time<=now){this._timeouts.shift().callback();}};/**
		 *  A setTimeout which is gaurenteed by the clock source.
		 *  Also runs in the offline context.
		 *  @param  {Function}  fn       The callback to invoke
		 *  @param  {Seconds}    timeout  The timeout in seconds
		 *  @returns {Number} ID to use when invoking Tone.Context.clearTimeout
		 */Tone.Context.prototype.setTimeout=function(fn,timeout){this._timeoutIds++;var now=this.now();this._timeouts.add({callback:fn,time:now+timeout,id:this._timeoutIds});return this._timeoutIds;};/**
		 *  Clears a previously scheduled timeout with Tone.context.setTimeout
		 *  @param  {Number}  id  The ID returned from setTimeout
		 *  @return  {Tone.Context}  this
		 */Tone.Context.prototype.clearTimeout=function(id){this._timeouts.forEach(function(event){if(event.id===id){this.remove(event);}});return this;};/**
		 *  How often the Web Worker callback is invoked.
		 *  This number corresponds to how responsive the scheduling
		 *  can be. Context.updateInterval + Context.lookAhead gives you the
		 *  total latency between scheduling an event and hearing it.
		 *  @type {Number}
		 *  @memberOf Tone.Context#
		 *  @name updateInterval
		 */Object.defineProperty(Tone.Context.prototype,'updateInterval',{get:function get(){return this._ticker.updateInterval;},set:function set(interval){this._ticker.updateInterval=interval;}});/**
		 *  What the source of the clock is, either "worker" (Web Worker [default]),
		 *  "timeout" (setTimeout), or "offline" (none).
		 *  @type {String}
		 *  @memberOf Tone.Context#
		 *  @name clockSource
		 */Object.defineProperty(Tone.Context.prototype,'clockSource',{get:function get(){return this._ticker.type;},set:function set(type){this._ticker.type=type;}});/**
		 *  The type of playback, which affects tradeoffs between audio
		 *  output latency and responsiveness.
		 *
		 *  In addition to setting the value in seconds, the latencyHint also
		 *  accepts the strings "interactive" (prioritizes low latency),
		 *  "playback" (prioritizes sustained playback), "balanced" (balances
		 *  latency and performance), and "fastest" (lowest latency, might glitch more often).
		 *  @type {String|Seconds}
		 *  @memberOf Tone.Context#
		 *  @name latencyHint
		 *  @example
		 * //set the lookAhead to 0.3 seconds
		 * Tone.context.latencyHint = 0.3;
		 */Object.defineProperty(Tone.Context.prototype,'latencyHint',{get:function get(){return this._latencyHint;},set:function set(hint){var lookAhead=hint;this._latencyHint=hint;if(Tone.isString(hint)){switch(hint){case'interactive':lookAhead=0.1;this._context.latencyHint=hint;break;case'playback':lookAhead=0.8;this._context.latencyHint=hint;break;case'balanced':lookAhead=0.25;this._context.latencyHint=hint;break;case'fastest':this._context.latencyHint='interactive';lookAhead=0.01;break;}}this.lookAhead=lookAhead;this.updateInterval=lookAhead/3;}});/**
		 *  Unlike other dispose methods, this returns a Promise
		 *  which executes when the context is closed and disposed
		 *  @returns {Promise} this
		 */Tone.Context.prototype.dispose=function(){return this.close().then(function(){Tone.Emitter.prototype.dispose.call(this);this._ticker.dispose();this._ticker=null;this._timeouts.dispose();this._timeouts=null;for(var con in this._constants){this._constants[con].disconnect();}this._constants=null;}.bind(this));};/**
		 * @class A class which provides a reliable callback using either
		 *        a Web Worker, or if that isn't supported, falls back to setTimeout.
		 * @private
		 */var Ticker=function Ticker(callback,type,updateInterval){/**
			 * Either "worker" or "timeout"
			 * @type {String}
			 * @private
			 */this._type=type;/**
			 * The update interval of the worker
			 * @private
			 * @type {Number}
			 */this._updateInterval=updateInterval;/**
			 * The callback to invoke at regular intervals
			 * @type {Function}
			 * @private
			 */this._callback=Tone.defaultArg(callback,Tone.noOp);//create the clock source for the first time
this._createClock();};/**
		 * The possible ticker types
		 * @private
		 * @type {Object}
		 */Ticker.Type={Worker:'worker',Timeout:'timeout',Offline:'offline'};/**
		 *  Generate a web worker
		 *  @return  {WebWorker}
		 *  @private
		 */Ticker.prototype._createWorker=function(){//URL Shim
window.URL=window.URL||window.webkitURL;var blob=new Blob([//the initial timeout time
'var timeoutTime = '+(this._updateInterval*1000).toFixed(1)+';'+//onmessage callback
'self.onmessage = function(msg){'+'\ttimeoutTime = parseInt(msg.data);'+'};'+//the tick function which posts a message
//and schedules a new tick
'function tick(){'+'\tsetTimeout(tick, timeoutTime);'+'\tself.postMessage(\'tick\');'+'}'+//call tick initially
'tick();']);var blobUrl=URL.createObjectURL(blob);var worker=new Worker(blobUrl);worker.onmessage=this._callback.bind(this);this._worker=worker;};/**
		 * Create a timeout loop
		 * @private
		 */Ticker.prototype._createTimeout=function(){this._timeout=setTimeout(function(){this._createTimeout();this._callback();}.bind(this),this._updateInterval*1000);};/**
		 * Create the clock source.
		 * @private
		 */Ticker.prototype._createClock=function(){if(this._type===Ticker.Type.Worker){try{this._createWorker();}catch(e){// workers not supported, fallback to timeout
this._type=Ticker.Type.Timeout;this._createClock();}}else if(this._type===Ticker.Type.Timeout){this._createTimeout();}};/**
		 * @memberOf Ticker#
		 * @type {Number}
		 * @name updateInterval
		 * @private
		 */Object.defineProperty(Ticker.prototype,'updateInterval',{get:function get(){return this._updateInterval;},set:function set(interval){this._updateInterval=Math.max(interval,128/44100);if(this._type===Ticker.Type.Worker){this._worker.postMessage(Math.max(interval*1000,1));}}});/**
		 * The type of the ticker, either a worker or a timeout
		 * @memberOf Ticker#
		 * @type {Number}
		 * @name type
		 * @private
		 */Object.defineProperty(Ticker.prototype,'type',{get:function get(){return this._type;},set:function set(type){this._disposeClock();this._type=type;this._createClock();}});/**
		 * Clean up the current clock source
		 * @private
		 */Ticker.prototype._disposeClock=function(){if(this._timeout){clearTimeout(this._timeout);this._timeout=null;}if(this._worker){this._worker.terminate();this._worker.onmessage=null;this._worker=null;}};/**
		 * Clean up
		 * @private
		 */Ticker.prototype.dispose=function(){this._disposeClock();this._callback=null;};/**
		 *  Shim all connect/disconnect and some deprecated methods which are still in
		 *  some older implementations.
		 *  @private
		 */Tone.getContext(function(){var nativeConnect=AudioNode.prototype.connect;var nativeDisconnect=AudioNode.prototype.disconnect;//replace the old connect method
function toneConnect(B,outNum,inNum){if(B.input){inNum=Tone.defaultArg(inNum,0);if(Tone.isArray(B.input)){return this.connect(B.input[inNum]);}else{return this.connect(B.input,outNum,inNum);}}else{try{if(B instanceof AudioNode){nativeConnect.call(this,B,outNum,inNum);return B;}else{nativeConnect.call(this,B,outNum);return B;}}catch(e){throw new Error('error connecting to node: '+B+'\n'+e);}}}//replace the old disconnect method
function toneDisconnect(B,outNum,inNum){if(B&&B.input&&Tone.isArray(B.input)){inNum=Tone.defaultArg(inNum,0);this.disconnect(B.input[inNum],outNum,0);}else if(B&&B.input){this.disconnect(B.input,outNum,inNum);}else{try{nativeDisconnect.apply(this,arguments);}catch(e){throw new Error('error disconnecting node: '+B+'\n'+e);}}}if(AudioNode.prototype.connect!==toneConnect){AudioNode.prototype.connect=toneConnect;AudioNode.prototype.disconnect=toneDisconnect;}});// set the audio context initially, and if one is not already created
if(Tone.supported&&!Tone.initialized){Tone.context=new Tone.Context();// log on first initialization
// allow optional silencing of this log
if(!window.TONE_SILENCE_VERSION_LOGGING){// eslint-disable-next-line no-console
console.log('%c * Tone.js '+Tone.version+' * ','background: #000; color: #fff');}}else if(!Tone.supported){// eslint-disable-next-line no-console
console.warn('This browser does not support Tone.js');}return Tone.Context;});Module(function(Tone){/**
		 *  @class Tone.AudioNode is the base class for classes which process audio.
		 *         AudioNodes have inputs and outputs.
		 *  @param	{AudioContext=} context	The audio context to use with the class
		 *  @extends {Tone}
		 */Tone.AudioNode=function(){Tone.call(this);//use the default context if one is not passed in
var options=Tone.defaults(arguments,['context'],{'context':Tone.context});/**
			 * The AudioContext of this instance
			 * @private
			 * @type {AudioContext}
			 */this._context=options.context;};Tone.extend(Tone.AudioNode);/**
		 * Get the audio context belonging to this instance.
		 * @type {Tone.Context}
		 * @memberOf Tone.AudioNode#
		 * @name context
		 * @readOnly
		 */Object.defineProperty(Tone.AudioNode.prototype,'context',{get:function get(){return this._context;}});/**
		 *  Create input and outputs for this object.
		 *  @param  {Number}  [input=0]   The number of inputs
		 *  @param  {Number}  [outputs=0]  The number of outputs
		 *  @return  {Tone.AudioNode}  this
		 *  @private
		 */Tone.AudioNode.prototype.createInsOuts=function(inputs,outputs){if(inputs===1){this.input=this.context.createGain();}else if(inputs>1){this.input=new Array(inputs);}if(outputs===1){this.output=this.context.createGain();}else if(outputs>1){this.output=new Array(outputs);}};/**
		 *  channelCount is the number of channels used when up-mixing and down-mixing
		 *  connections to any inputs to the node. The default value is 2 except for
		 *  specific nodes where its value is specially determined.
		 *
		 *  @memberof Tone.AudioNode#
		 *  @type {Number}
		 *  @name channelCount
		 *  @readOnly
		 */Object.defineProperty(Tone.AudioNode.prototype,'channelCount',{get:function get(){return this.output.channelCount;},set:function set(c){return this.output.channelCount=c;}});/**
		 *  channelCountMode determines how channels will be counted when up-mixing and
		 *  down-mixing connections to any inputs to the node.
		 *  The default value is "max". This attribute has no effect for nodes with no inputs.
		 *  @memberof Tone.AudioNode#
		 *  @type {String}
		 *  @name channelCountMode
		 *  @readOnly
		 */Object.defineProperty(Tone.AudioNode.prototype,'channelCountMode',{get:function get(){return this.output.channelCountMode;},set:function set(m){return this.output.channelCountMode=m;}});/**
		 *  channelInterpretation determines how individual channels will be treated
		 *  when up-mixing and down-mixing connections to any inputs to the node.
		 *  The default value is "speakers".
		 *  @memberof Tone.AudioNode#
		 *  @type {String}
		 *  @name channelInterpretation
		 *  @readOnly
		 */Object.defineProperty(Tone.AudioNode.prototype,'channelInterpretation',{get:function get(){return this.output.channelInterpretation;},set:function set(i){return this.output.channelInterpretation=i;}});/**
		 *  The number of inputs feeding into the AudioNode.
		 *  For source nodes, this will be 0.
		 *  @type {Number}
		 *  @name numberOfInputs
		 *  @memberof Tone.AudioNode#
		 *  @readOnly
		 */Object.defineProperty(Tone.AudioNode.prototype,'numberOfInputs',{get:function get(){if(this.input){if(Tone.isArray(this.input)){return this.input.length;}else{return 1;}}else{return 0;}}});/**
		 *  The number of outputs coming out of the AudioNode.
		 *  @type {Number}
		 *  @name numberOfOutputs
		 *  @memberof Tone.AudioNode#
		 *  @readOnly
		 */Object.defineProperty(Tone.AudioNode.prototype,'numberOfOutputs',{get:function get(){if(this.output){if(Tone.isArray(this.output)){return this.output.length;}else{return 1;}}else{return 0;}}});/**
		 * Called when an audio param connects to this node
		 * @private
		 */Tone.AudioNode.prototype._onConnect=function(){};/**
		 *  connect the output of a ToneNode to an AudioParam, AudioNode, or ToneNode
		 *  @param  {Tone | AudioParam | AudioNode} unit
		 *  @param {number} [outputNum=0] optionally which output to connect from
		 *  @param {number} [inputNum=0] optionally which input to connect to
		 *  @returns {Tone.AudioNode} this
		 */Tone.AudioNode.prototype.connect=function(unit,outputNum,inputNum){if(unit._onConnect){unit._onConnect(this);}if(Tone.isArray(this.output)){outputNum=Tone.defaultArg(outputNum,0);this.output[outputNum].connect(unit,0,inputNum);}else{this.output.connect(unit,outputNum,inputNum);}return this;};/**
		 *  disconnect the output
		 *  @param {Number|AudioNode} output Either the output index to disconnect
		 *                                   if the output is an array, or the
		 *                                   node to disconnect from.
		 *  @returns {Tone.AudioNode} this
		 */Tone.AudioNode.prototype.disconnect=function(destination,outputNum,inputNum){if(Tone.isArray(this.output)){if(Tone.isNumber(destination)){this.output[destination].disconnect();}else{outputNum=Tone.defaultArg(outputNum,0);this.output[outputNum].disconnect(destination,0,inputNum);}}else{this.output.disconnect.apply(this.output,arguments);}};/**
		 *  Connect the output of this node to the rest of the nodes in series.
		 *  @example
		 *  //connect a node to an effect, panVol and then to the master output
		 *  node.chain(effect, panVol, Tone.Master);
		 *  @param {...AudioParam|Tone|AudioNode} nodes
		 *  @returns {Tone.AudioNode} this
		 *  @private
		 */Tone.AudioNode.prototype.chain=function(){var currentUnit=this;for(var i=0;i<arguments.length;i++){var toUnit=arguments[i];currentUnit.connect(toUnit);currentUnit=toUnit;}return this;};/**
		 *  connect the output of this node to the rest of the nodes in parallel.
		 *  @param {...AudioParam|Tone|AudioNode} nodes
		 *  @returns {Tone.AudioNode} this
		 *  @private
		 */Tone.AudioNode.prototype.fan=function(){for(var i=0;i<arguments.length;i++){this.connect(arguments[i]);}return this;};if(window.AudioNode){//give native nodes chain and fan methods
AudioNode.prototype.chain=Tone.AudioNode.prototype.chain;AudioNode.prototype.fan=Tone.AudioNode.prototype.fan;}/**
		 * Dispose and disconnect
		 * @return {Tone.AudioNode} this
		 */Tone.AudioNode.prototype.dispose=function(){if(Tone.isDefined(this.input)){if(this.input instanceof AudioNode){this.input.disconnect();}this.input=null;}if(Tone.isDefined(this.output)){if(this.output instanceof AudioNode){this.output.disconnect();}this.output=null;}this._context=null;return this;};return Tone.AudioNode;});Module(function(Tone){/**
		 *  @class  Base class for all Signals. Used Internally.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 */Tone.SignalBase=function(){Tone.AudioNode.call(this);};Tone.extend(Tone.SignalBase,Tone.AudioNode);/**
		 *  When signals connect to other signals or AudioParams,
		 *  they take over the output value of that signal or AudioParam.
		 *  For all other nodes, the behavior is the same as a default <code>connect</code>.
		 *
		 *  @override
		 *  @param {AudioParam|AudioNode|Tone.Signal|Tone} node
		 *  @param {number} [outputNumber=0] The output number to connect from.
		 *  @param {number} [inputNumber=0] The input number to connect to.
		 *  @returns {Tone.SignalBase} this
		 */Tone.SignalBase.prototype.connect=function(node,outputNumber,inputNumber){//zero it out so that the signal can have full control
if(Tone.Signal&&Tone.Signal===node.constructor||Tone.Param&&Tone.Param===node.constructor){//cancel changes
node._param.cancelScheduledValues(0);//reset the value
node._param.value=0;//mark the value as overridden
node.overridden=true;}else if(node instanceof AudioParam){node.cancelScheduledValues(0);node.value=0;}Tone.AudioNode.prototype.connect.call(this,node,outputNumber,inputNumber);return this;};return Tone.SignalBase;});Module(function(Tone){if(Tone.supported){//fixes safari only bug which is still present in 11
var ua=navigator.userAgent.toLowerCase();var isSafari=ua.includes('safari')&&!ua.includes('chrome');if(isSafari){var WaveShaperNode=function WaveShaperNode(context){this._internalNode=this.input=this.output=context._native_createWaveShaper();this._curve=null;for(var prop in this._internalNode){this._defineProperty(this._internalNode,prop);}};Object.defineProperty(WaveShaperNode.prototype,'curve',{get:function get(){return this._curve;},set:function set(curve){this._curve=curve;var array=new Float32Array(curve.length+1);array.set(curve,1);array[0]=curve[0];this._internalNode.curve=array;}});WaveShaperNode.prototype._defineProperty=function(context,prop){if(Tone.isUndef(this[prop])){Object.defineProperty(this,prop,{get:function get(){if(typeof context[prop]==='function'){return context[prop].bind(context);}else{return context[prop];}},set:function set(val){context[prop]=val;}});}};AudioContext.prototype._native_createWaveShaper=AudioContext.prototype.createWaveShaper;AudioContext.prototype.createWaveShaper=function(){return new WaveShaperNode(this);};}}});Module(function(Tone){/**
		 *  @class Wraps the native Web Audio API
		 *         [WaveShaperNode](http://webaudio.github.io/web-audio-api/#the-waveshapernode-interface).
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {function|Array|Number} mapping The function used to define the values.
		 *                                    The mapping function should take two arguments:
		 *                                    the first is the value at the current position
		 *                                    and the second is the array position.
		 *                                    If the argument is an array, that array will be
		 *                                    set as the wave shaping function. The input
		 *                                    signal is an AudioRange [-1, 1] value and the output
		 *                                    signal can take on any numerical values.
		 *
		 *  @param {Number} [bufferLen=1024] The length of the WaveShaperNode buffer.
		 *  @example
		 * var timesTwo = new Tone.WaveShaper(function(val){
		 * 	return val * 2;
		 * }, 2048);
		 *  @example
		 * //a waveshaper can also be constructed with an array of values
		 * var invert = new Tone.WaveShaper([1, -1]);
		 */Tone.WaveShaper=function(mapping,bufferLen){Tone.SignalBase.call(this);/**
			 *  the waveshaper
			 *  @type {WaveShaperNode}
			 *  @private
			 */this._shaper=this.input=this.output=this.context.createWaveShaper();/**
			 *  the waveshapers curve
			 *  @type {Float32Array}
			 *  @private
			 */this._curve=null;if(Array.isArray(mapping)){this.curve=mapping;}else if(isFinite(mapping)||Tone.isUndef(mapping)){this._curve=new Float32Array(Tone.defaultArg(mapping,1024));}else if(Tone.isFunction(mapping)){this._curve=new Float32Array(Tone.defaultArg(bufferLen,1024));this.setMap(mapping);}};Tone.extend(Tone.WaveShaper,Tone.SignalBase);/**
		 *  Uses a mapping function to set the value of the curve.
		 *  @param {function} mapping The function used to define the values.
		 *                            The mapping function take two arguments:
		 *                            the first is the value at the current position
		 *                            which goes from -1 to 1 over the number of elements
		 *                            in the curve array. The second argument is the array position.
		 *  @returns {Tone.WaveShaper} this
		 *  @example
		 * //map the input signal from [-1, 1] to [0, 10]
		 * shaper.setMap(function(val, index){
		 * 	return (val + 1) * 5;
		 * })
		 */Tone.WaveShaper.prototype.setMap=function(mapping){var array=new Array(this._curve.length);for(var i=0,len=this._curve.length;i<len;i++){var normalized=i/(len-1)*2-1;array[i]=mapping(normalized,i);}this.curve=array;return this;};/**
		 * The array to set as the waveshaper curve. For linear curves
		 * array length does not make much difference, but for complex curves
		 * longer arrays will provide smoother interpolation.
		 * @memberOf Tone.WaveShaper#
		 * @type {Array}
		 * @name curve
		 */Object.defineProperty(Tone.WaveShaper.prototype,'curve',{get:function get(){return this._shaper.curve;},set:function set(mapping){this._curve=new Float32Array(mapping);this._shaper.curve=this._curve;}});/**
		 * Specifies what type of oversampling (if any) should be used when
		 * applying the shaping curve. Can either be "none", "2x" or "4x".
		 * @memberOf Tone.WaveShaper#
		 * @type {string}
		 * @name oversample
		 */Object.defineProperty(Tone.WaveShaper.prototype,'oversample',{get:function get(){return this._shaper.oversample;},set:function set(oversampling){if(['none','2x','4x'].includes(oversampling)){this._shaper.oversample=oversampling;}else{throw new RangeError('Tone.WaveShaper: oversampling must be either \'none\', \'2x\', or \'4x\'');}}});/**
		 *  Clean up.
		 *  @returns {Tone.WaveShaper} this
		 */Tone.WaveShaper.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._shaper.disconnect();this._shaper=null;this._curve=null;return this;};return Tone.WaveShaper;});Module(function(Tone){/**
		 *  @class Tone.TimeBase is a flexible encoding of time
		 *         which can be evaluated to and from a string.
		 *  @extends {Tone}
		 *  @param  {Time}  val    The time value as a number or string
		 *  @param  {String=}  units  Unit values
		 *  @example
		 * Tone.TimeBase(4, "n")
		 * Tone.TimeBase(2, "t")
		 * Tone.TimeBase("2t")
		 * Tone.TimeBase("2t") + Tone.TimeBase("4n");
		 */Tone.TimeBase=function(val,units){//allows it to be constructed with or without 'new'
if(this instanceof Tone.TimeBase){/**
				 *  The value
				 *  @type  {Number|String|Tone.TimeBase}
				 *  @private
				 */this._val=val;/**
				 * The units
				 * @type {String?}
				 * @private
				 */this._units=units;//test if the value is a string representation of a number
if(Tone.isUndef(this._units)&&Tone.isString(this._val)&&// eslint-disable-next-line eqeqeq
parseFloat(this._val)==this._val&&this._val.charAt(0)!=='+'){this._val=parseFloat(this._val);this._units=this._defaultUnits;}else if(val&&val.constructor===this.constructor){//if they're the same type, just copy values over
this._val=val._val;this._units=val._units;}else if(val instanceof Tone.TimeBase){switch(this._defaultUnits){case's':this._val=val.toSeconds();break;case'i':this._val=val.toTicks();break;case'hz':this._val=val.toFrequency();break;case'midi':this._val=val.toMidi();break;default:throw new Error('Unrecognized default units '+this._defaultUnits);}}}else{return new Tone.TimeBase(val,units);}};Tone.extend(Tone.TimeBase);///////////////////////////////////////////////////////////////////////////
//	ABSTRACT SYNTAX TREE PARSER
///////////////////////////////////////////////////////////////////////////
/**
		 *  All the primary expressions.
		 *  @private
		 *  @type  {Object}
		 */Tone.TimeBase.prototype._expressions={'n':{regexp:/^(\d+)n(\.?)$/i,method:function method(value,dot){value=parseInt(value);var scalar=dot==='.'?1.5:1;if(value===1){return this._beatsToUnits(this._getTimeSignature())*scalar;}else{return this._beatsToUnits(4/value)*scalar;}}},'t':{regexp:/^(\d+)t$/i,method:function method(value){value=parseInt(value);return this._beatsToUnits(8/(parseInt(value)*3));}},'m':{regexp:/^(\d+)m$/i,method:function method(value){return this._beatsToUnits(parseInt(value)*this._getTimeSignature());}},'i':{regexp:/^(\d+)i$/i,method:function method(value){return this._ticksToUnits(parseInt(value));}},'hz':{regexp:/^(\d+(?:\.\d+)?)hz$/i,method:function method(value){return this._frequencyToUnits(parseFloat(value));}},'tr':{regexp:/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?$/,method:function method(m,q,s){var total=0;if(m&&m!=='0'){total+=this._beatsToUnits(this._getTimeSignature()*parseFloat(m));}if(q&&q!=='0'){total+=this._beatsToUnits(parseFloat(q));}if(s&&s!=='0'){total+=this._beatsToUnits(parseFloat(s)/4);}return total;}},'s':{regexp:/^(\d+(?:\.\d+)?)s$/,method:function method(value){return this._secondsToUnits(parseFloat(value));}},'samples':{regexp:/^(\d+)samples$/,method:function method(value){return parseInt(value)/this.context.sampleRate;}},'default':{regexp:/^(\d+(?:\.\d+)?)$/,method:function method(value){return this._expressions[this._defaultUnits].method.call(this,value);}}};/**
		 *  The default units if none are given.
		 *  @type {String}
		 *  @private
		 */Tone.TimeBase.prototype._defaultUnits='s';///////////////////////////////////////////////////////////////////////////
//	TRANSPORT FALLBACKS
///////////////////////////////////////////////////////////////////////////
/**
		 * Return the bpm, or 120 if Transport is not available
		 * @type {Number}
		 * @private
		 */Tone.TimeBase.prototype._getBpm=function(){if(Tone.Transport){return Tone.Transport.bpm.value;}else{return 120;}};/**
		 * Return the timeSignature or 4 if Transport is not available
		 * @type {Number}
		 * @private
		 */Tone.TimeBase.prototype._getTimeSignature=function(){if(Tone.Transport){return Tone.Transport.timeSignature;}else{return 4;}};/**
		 * Return the PPQ or 192 if Transport is not available
		 * @type {Number}
		 * @private
		 */Tone.TimeBase.prototype._getPPQ=function(){if(Tone.Transport){return Tone.Transport.PPQ;}else{return 192;}};/**
		 * Return the current time in whichever context is relevant
		 * @type {Number}
		 * @private
		 */Tone.TimeBase.prototype._now=function(){return this.now();};///////////////////////////////////////////////////////////////////////////
//	UNIT CONVERSIONS
///////////////////////////////////////////////////////////////////////////
/**
		 *  Returns the value of a frequency in the current units
		 *  @param {Frequency} freq
		 *  @return  {Number}
		 *  @private
		 */Tone.TimeBase.prototype._frequencyToUnits=function(freq){return 1/freq;};/**
		 *  Return the value of the beats in the current units
		 *  @param {Number} beats
		 *  @return  {Number}
		 *  @private
		 */Tone.TimeBase.prototype._beatsToUnits=function(beats){return 60/this._getBpm()*beats;};/**
		 *  Returns the value of a second in the current units
		 *  @param {Seconds} seconds
		 *  @return  {Number}
		 *  @private
		 */Tone.TimeBase.prototype._secondsToUnits=function(seconds){return seconds;};/**
		 *  Returns the value of a tick in the current time units
		 *  @param {Ticks} ticks
		 *  @return  {Number}
		 *  @private
		 */Tone.TimeBase.prototype._ticksToUnits=function(ticks){return ticks*(this._beatsToUnits(1)/this._getPPQ());};/**
		 * With no arguments, return 'now'
		 *  @return  {Number}
		 *  @private
		 */Tone.TimeBase.prototype._noArg=function(){return this._now();};///////////////////////////////////////////////////////////////////////////
//	EXPRESSIONS
///////////////////////////////////////////////////////////////////////////
/**
		 *  Evaluate the time value. Returns the time
		 *  in seconds.
		 *  @return  {Seconds}
		 */Tone.TimeBase.prototype.valueOf=function(){if(Tone.isUndef(this._val)){return this._noArg();}else if(Tone.isString(this._val)&&Tone.isUndef(this._units)){for(var units in this._expressions){if(this._expressions[units].regexp.test(this._val.trim())){this._units=units;break;}}}if(Tone.isDefined(this._units)){var expr=this._expressions[this._units];var matching=this._val.toString().trim().match(expr.regexp);if(matching){return expr.method.apply(this,matching.slice(1));}else{return expr.method.call(this,parseFloat(this._val));}}else{return this._val;}};/**
		 *  Return the value in seconds
		 *  @return {Seconds}
		 */Tone.TimeBase.prototype.toSeconds=function(){return this.valueOf();};/**
		 *  Return the value in hertz
		 *  @return {Frequency}
		 */Tone.TimeBase.prototype.toFrequency=function(){return 1/this.toSeconds();};/**
		 *  Return the time in samples
		 *  @return  {Samples}
		 */Tone.TimeBase.prototype.toSamples=function(){return this.toSeconds()*this.context.sampleRate;};/**
		 *  Return the time in milliseconds.
		 *  @return  {Milliseconds}
		 */Tone.TimeBase.prototype.toMilliseconds=function(){return this.toSeconds()*1000;};/**
		 *  Clean up
		 *  @return {Tone.TimeBase} this
		 */Tone.TimeBase.prototype.dispose=function(){this._val=null;this._units=null;};return Tone.TimeBase;});Module(function(Tone){/**
		 *  @class Tone.Frequency is a primitive type for encoding Frequency values.
		 *         Eventually all time values are evaluated to hertz
		 *         using the `eval` method.
		 *  @constructor
		 *  @extends {Tone.TimeBase}
		 *  @param  {String|Number}  val    The time value.
		 *  @param  {String=}  units  The units of the value.
		 *  @example
		 * Tone.Frequency("C3") // 261
		 * Tone.Frequency(38, "midi") //
		 * Tone.Frequency("C3").transpose(4);
		 */Tone.Frequency=function(val,units){if(this instanceof Tone.Frequency){Tone.TimeBase.call(this,val,units);}else{return new Tone.Frequency(val,units);}};Tone.extend(Tone.Frequency,Tone.TimeBase);///////////////////////////////////////////////////////////////////////////
//	AUGMENT BASE EXPRESSIONS
///////////////////////////////////////////////////////////////////////////
Tone.Frequency.prototype._expressions=Object.assign({},Tone.TimeBase.prototype._expressions,{'midi':{regexp:/^(\d+(?:\.\d+)?midi)/,method:function method(value){if(this._defaultUnits==='midi'){return value;}else{return Tone.Frequency.mtof(value);}}},'note':{regexp:/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,method:function method(pitch,octave){var index=noteToScaleIndex[pitch.toLowerCase()];var noteNumber=index+(parseInt(octave)+1)*12;if(this._defaultUnits==='midi'){return noteNumber;}else{return Tone.Frequency.mtof(noteNumber);}}},'tr':{regexp:/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,method:function method(m,q,s){var total=1;if(m&&m!=='0'){total*=this._beatsToUnits(this._getTimeSignature()*parseFloat(m));}if(q&&q!=='0'){total*=this._beatsToUnits(parseFloat(q));}if(s&&s!=='0'){total*=this._beatsToUnits(parseFloat(s)/4);}return total;}}});///////////////////////////////////////////////////////////////////////////
//	EXPRESSIONS
///////////////////////////////////////////////////////////////////////////
/**
		 *  Transposes the frequency by the given number of semitones.
		 *  @param  {Interval}  interval
		 *  @return  {Tone.Frequency} A new transposed frequency
		 *  @example
		 * Tone.Frequency("A4").transpose(3); //"C5"
		 */Tone.Frequency.prototype.transpose=function(interval){return new this.constructor(this.valueOf()*Tone.intervalToFrequencyRatio(interval));};/**
		 *  Takes an array of semitone intervals and returns
		 *  an array of frequencies transposed by those intervals.
		 *  @param  {Array}  intervals
		 *  @return  {Array<Tone.Frequency>} Returns an array of Frequencies
		 *  @example
		 * Tone.Frequency("A4").harmonize([0, 3, 7]); //["A4", "C5", "E5"]
		 */Tone.Frequency.prototype.harmonize=function(intervals){return intervals.map(function(interval){return this.transpose(interval);}.bind(this));};///////////////////////////////////////////////////////////////////////////
//	UNIT CONVERSIONS
///////////////////////////////////////////////////////////////////////////
/**
		 *  Return the value of the frequency as a MIDI note
		 *  @return  {MIDI}
		 *  @example
		 * Tone.Frequency("C4").toMidi(); //60
		 */Tone.Frequency.prototype.toMidi=function(){return Tone.Frequency.ftom(this.valueOf());};/**
		 *  Return the value of the frequency in Scientific Pitch Notation
		 *  @return  {Note}
		 *  @example
		 * Tone.Frequency(69, "midi").toNote(); //"A4"
		 */Tone.Frequency.prototype.toNote=function(){var freq=this.toFrequency();var log=Math.log2(freq/Tone.Frequency.A4);var noteNumber=Math.round(12*log)+57;var octave=Math.floor(noteNumber/12);if(octave<0){noteNumber+=-12*octave;}var noteName=scaleIndexToNote[noteNumber%12];return noteName+octave.toString();};/**
		 *  Return the duration of one cycle in seconds.
		 *  @return  {Seconds}
		 */Tone.Frequency.prototype.toSeconds=function(){return 1/Tone.TimeBase.prototype.toSeconds.call(this);};/**
		 *  Return the value in Hertz
		 *  @return  {Frequency}
		 */Tone.Frequency.prototype.toFrequency=function(){return Tone.TimeBase.prototype.toFrequency.call(this);};/**
		 *  Return the duration of one cycle in ticks
		 *  @return  {Ticks}
		 */Tone.Frequency.prototype.toTicks=function(){var quarterTime=this._beatsToUnits(1);var quarters=this.valueOf()/quarterTime;return Math.floor(quarters*Tone.Transport.PPQ);};///////////////////////////////////////////////////////////////////////////
//	UNIT CONVERSIONS HELPERS
///////////////////////////////////////////////////////////////////////////
/**
		 *  With no arguments, return 0
		 *  @return  {Number}
		 *  @private
		 */Tone.Frequency.prototype._noArg=function(){return 0;};/**
		 *  Returns the value of a frequency in the current units
		 *  @param {Frequency} freq
		 *  @return  {Number}
		 *  @private
		 */Tone.Frequency.prototype._frequencyToUnits=function(freq){return freq;};/**
		 *  Returns the value of a tick in the current time units
		 *  @param {Ticks} ticks
		 *  @return  {Number}
		 *  @private
		 */Tone.Frequency.prototype._ticksToUnits=function(ticks){return 1/(ticks*60/(Tone.Transport.bpm.value*Tone.Transport.PPQ));};/**
		 *  Return the value of the beats in the current units
		 *  @param {Number} beats
		 *  @return  {Number}
		 *  @private
		 */Tone.Frequency.prototype._beatsToUnits=function(beats){return 1/Tone.TimeBase.prototype._beatsToUnits.call(this,beats);};/**
		 *  Returns the value of a second in the current units
		 *  @param {Seconds} seconds
		 *  @return  {Number}
		 *  @private
		 */Tone.Frequency.prototype._secondsToUnits=function(seconds){return 1/seconds;};/**
		 *  The default units if none are given.
		 *  @private
		 */Tone.Frequency.prototype._defaultUnits='hz';///////////////////////////////////////////////////////////////////////////
//	FREQUENCY CONVERSIONS
///////////////////////////////////////////////////////////////////////////
/**
		 *  Note to scale index
		 *  @type  {Object}
		 */var noteToScaleIndex={'cbb':-2,'cb':-1,'c':0,'c#':1,'cx':2,'dbb':0,'db':1,'d':2,'d#':3,'dx':4,'ebb':2,'eb':3,'e':4,'e#':5,'ex':6,'fbb':3,'fb':4,'f':5,'f#':6,'fx':7,'gbb':5,'gb':6,'g':7,'g#':8,'gx':9,'abb':7,'ab':8,'a':9,'a#':10,'ax':11,'bbb':9,'bb':10,'b':11,'b#':12,'bx':13};/**
		 *  scale index to note (sharps)
		 *  @type  {Array}
		 */var scaleIndexToNote=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];/**
		 *  The [concert pitch](https://en.wikipedia.org/wiki/Concert_pitch)
		 *  A4's values in Hertz.
		 *  @type {Frequency}
		 *  @static
		 */Tone.Frequency.A4=440;/**
		 *  Convert a MIDI note to frequency value.
		 *  @param  {MIDI} midi The midi number to convert.
		 *  @return {Frequency} the corresponding frequency value
		 *  @static
		 *  @example
		 * Tone.Frequency.mtof(69); // returns 440
		 */Tone.Frequency.mtof=function(midi){return Tone.Frequency.A4*Math.pow(2,(midi-69)/12);};/**
		 *  Convert a frequency value to a MIDI note.
		 *  @param {Frequency} frequency The value to frequency value to convert.
		 *  @returns  {MIDI}
		 *  @static
		 *  @example
		 * Tone.Frequency.ftom(440); // returns 69
		 */Tone.Frequency.ftom=function(frequency){return 69+Math.round(12*Math.log2(frequency/Tone.Frequency.A4));};return Tone.Frequency;});Module(function(Tone){/**
		 *  @class Tone.Time is a primitive type for encoding Time values.
		 *         Tone.Time can be constructed with or without the `new` keyword. Tone.Time can be passed
		 *         into the parameter of any method which takes time as an argument.
		 *  @constructor
		 *  @extends {Tone.TimeBase}
		 *  @param  {String|Number}  val    The time value.
		 *  @param  {String=}  units  The units of the value.
		 *  @example
		 * var t = Tone.Time("4n");//a quarter note
		 */Tone.Time=function(val,units){if(this instanceof Tone.Time){Tone.TimeBase.call(this,val,units);}else{return new Tone.Time(val,units);}};Tone.extend(Tone.Time,Tone.TimeBase);/**
		 * Extend the base expressions
		 */Tone.Time.prototype._expressions=Object.assign({},Tone.TimeBase.prototype._expressions,{'quantize':{regexp:/^@(.+)/,method:function method(capture){if(Tone.Transport){var quantTo=new this.constructor(capture);return Tone.Transport.nextSubdivision(quantTo);}else{return 0;}}},'now':{regexp:/^\+(.+)/,method:function method(capture){return this._now()+new this.constructor(capture);}}});/**
		 *  Quantize the time by the given subdivision. Optionally add a
		 *  percentage which will move the time value towards the ideal
		 *  quantized value by that percentage.
		 *  @param  {Number|Time}  val    The subdivision to quantize to
		 *  @param  {NormalRange}  [percent=1]  Move the time value
		 *                                   towards the quantized value by
		 *                                   a percentage.
		 *  @return  {Number}  this
		 *  @example
		 * Tone.Time(21).quantize(2) //returns 22
		 * Tone.Time(0.6).quantize("4n", 0.5) //returns 0.55
		 */Tone.Time.prototype.quantize=function(subdiv,percent){percent=Tone.defaultArg(percent,1);var subdivision=new this.constructor(subdiv);var value=this.valueOf();var multiple=Math.round(value/subdivision);var ideal=multiple*subdivision;var diff=ideal-value;return value+diff*percent;};///////////////////////////////////////////////////////////////////////////
// CONVERSIONS
///////////////////////////////////////////////////////////////////////////
/**
		 *  Convert a Time to Notation. The notation values are will be the
		 *  closest representation between 1m to 128th note.
		 *  @return {Notation}
		 *  @example
		 * //if the Transport is at 120bpm:
		 * Tone.Time(2).toNotation();//returns "1m"
		 */Tone.Time.prototype.toNotation=function(){var time=this.toSeconds();var testNotations=['1m'];for(var power=1;power<8;power++){var subdiv=Math.pow(2,power);testNotations.push(subdiv+'n.');testNotations.push(subdiv+'n');testNotations.push(subdiv+'t');}testNotations.push('0');//find the closets notation representation
var closest=testNotations[0];var closestSeconds=Tone.Time(testNotations[0]).toSeconds();testNotations.forEach(function(notation){var notationSeconds=Tone.Time(notation).toSeconds();if(Math.abs(notationSeconds-time)<Math.abs(closestSeconds-time)){closest=notation;closestSeconds=notationSeconds;}});return closest;};/**
		 *  Return the time encoded as Bars:Beats:Sixteenths.
		 *  @return  {BarsBeatsSixteenths}
		 */Tone.Time.prototype.toBarsBeatsSixteenths=function(){var quarterTime=this._beatsToUnits(1);var quarters=this.valueOf()/quarterTime;var measures=Math.floor(quarters/this._getTimeSignature());var sixteenths=quarters%1*4;quarters=Math.floor(quarters)%this._getTimeSignature();sixteenths=sixteenths.toString();if(sixteenths.length>3){// the additional parseFloat removes insignificant trailing zeroes
sixteenths=parseFloat(parseFloat(sixteenths).toFixed(3));}var progress=[measures,quarters,sixteenths];return progress.join(':');};/**
		 *  Return the time in ticks.
		 *  @return  {Ticks}
		 */Tone.Time.prototype.toTicks=function(){var quarterTime=this._beatsToUnits(1);var quarters=this.valueOf()/quarterTime;return Math.round(quarters*this._getPPQ());};/**
		 *  Return the time in seconds.
		 *  @return  {Seconds}
		 */Tone.Time.prototype.toSeconds=function(){return this.valueOf();};/**
		 *  Return the value as a midi note.
		 *  @return  {Midi}
		 */Tone.Time.prototype.toMidi=function(){return Tone.Frequency.ftom(this.toFrequency());};return Tone.Time;});Module(function(Tone){/**
		 *  @class Tone.TransportTime is a the time along the Transport's
		 *         timeline. It is similar to Tone.Time, but instead of evaluating
		 *         against the AudioContext's clock, it is evaluated against
		 *         the Transport's position. See [TransportTime wiki](https://github.com/Tonejs/Tone.js/wiki/TransportTime).
		 *  @constructor
		 *  @param  {Time}  val    The time value as a number or string
		 *  @param  {String=}  units  Unit values
		 *  @extends {Tone.Time}
		 */Tone.TransportTime=function(val,units){if(this instanceof Tone.TransportTime){Tone.Time.call(this,val,units);}else{return new Tone.TransportTime(val,units);}};Tone.extend(Tone.TransportTime,Tone.Time);/**
		 * Return the current time in whichever context is relevant
		 * @type {Number}
		 * @private
		 */Tone.TransportTime.prototype._now=function(){return Tone.Transport.seconds;};return Tone.TransportTime;});Module(function(Tone){///////////////////////////////////////////////////////////////////////////
//	TYPES
///////////////////////////////////////////////////////////////////////////
/**
		 * Units which a value can take on.
		 * @enum {String}
		 */Tone.Type={/**
			 *  Default units
			 *  @typedef {Default}
			 */Default:'number',/**
			 *  Time can be described in a number of ways. Read more [Time](https://github.com/Tonejs/Tone.js/wiki/Time).
			 *
			 *  * Numbers, which will be taken literally as the time (in seconds).
			 *  * Notation, ("4n", "8t") describes time in BPM and time signature relative values.
			 *  * TransportTime, ("4:3:2") will also provide tempo and time signature relative times
			 *  in the form BARS:QUARTERS:SIXTEENTHS.
			 *  * Frequency, ("8hz") is converted to the length of the cycle in seconds.
			 *  * Now-Relative, ("+1") prefix any of the above with "+" and it will be interpreted as
			 *  "the current time plus whatever expression follows".
			 *  * Expressions, ("3:0 + 2 - (1m / 7)") any of the above can also be combined
			 *  into a mathematical expression which will be evaluated to compute the desired time.
			 *  * No Argument, for methods which accept time, no argument will be interpreted as
			 *  "now" (i.e. the currentTime).
			 *
			 *  @typedef {Time}
			 */Time:'time',/**
			 *  Frequency can be described similar to time, except ultimately the
			 *  values are converted to frequency instead of seconds. A number
			 *  is taken literally as the value in hertz. Additionally any of the
			 *  Time encodings can be used. Note names in the form
			 *  of NOTE OCTAVE (i.e. C4) are also accepted and converted to their
			 *  frequency value.
			 *  @typedef {Frequency}
			 */Frequency:'frequency',/**
			 *  TransportTime describes a position along the Transport's timeline. It is
			 *  similar to Time in that it uses all the same encodings, but TransportTime specifically
			 *  pertains to the Transport's timeline, which is startable, stoppable, loopable, and seekable.
			 *  [Read more](https://github.com/Tonejs/Tone.js/wiki/TransportTime)
			 *  @typedef {TransportTime}
			 */TransportTime:'transportTime',/**
			 *  Ticks are the basic subunit of the Transport. They are
			 *  the smallest unit of time that the Transport supports.
			 *  @typedef {Ticks}
			 */Ticks:'ticks',/**
			 *  Normal values are within the range [0, 1].
			 *  @typedef {NormalRange}
			 */NormalRange:'normalRange',/**
			 *  AudioRange values are between [-1, 1].
			 *  @typedef {AudioRange}
			 */AudioRange:'audioRange',/**
			 *  Decibels are a logarithmic unit of measurement which is useful for volume
			 *  because of the logarithmic way that we perceive loudness. 0 decibels
			 *  means no change in volume. -10db is approximately half as loud and 10db
			 *  is twice is loud.
			 *  @typedef {Decibels}
			 */Decibels:'db',/**
			 *  Half-step note increments, i.e. 12 is an octave above the root. and 1 is a half-step up.
			 *  @typedef {Interval}
			 */Interval:'interval',/**
			 *  Beats per minute.
			 *  @typedef {BPM}
			 */BPM:'bpm',/**
			 *  The value must be greater than or equal to 0.
			 *  @typedef {Positive}
			 */Positive:'positive',/**
			 *  Gain is the ratio between input and output of a signal.
			 *  A gain of 0 is the same as silencing the signal. A gain of
			 *  1, causes no change to the incoming signal.
			 *  @typedef {Gain}
			 */Gain:'gain',/**
			 *  A cent is a hundredth of a semitone.
			 *  @typedef {Cents}
			 */Cents:'cents',/**
			 *  Angle between 0 and 360.
			 *  @typedef {Degrees}
			 */Degrees:'degrees',/**
			 *  A number representing a midi note.
			 *  @typedef {MIDI}
			 */MIDI:'midi',/**
			 *  A colon-separated representation of time in the form of
			 *  Bars:Beats:Sixteenths.
			 *  @typedef {BarsBeatsSixteenths}
			 */BarsBeatsSixteenths:'barsBeatsSixteenths',/**
			 *  Sampling is the reduction of a continuous signal to a discrete signal.
			 *  Audio is typically sampled 44100 times per second.
			 *  @typedef {Samples}
			 */Samples:'samples',/**
			 *  Hertz are a frequency representation defined as one cycle per second.
			 *  @typedef {Hertz}
			 */Hertz:'hertz',/**
			 *  A frequency represented by a letter name,
			 *  accidental and octave. This system is known as
			 *  [Scientific Pitch Notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation).
			 *  @typedef {Note}
			 */Note:'note',/**
			 *  One millisecond is a thousandth of a second.
			 *  @typedef {Milliseconds}
			 */Milliseconds:'milliseconds',/**
			 *  Seconds are the time unit of the AudioContext. In the end,
			 *  all values need to be evaluated to seconds.
			 *  @typedef {Seconds}
			 */Seconds:'seconds',/**
			 *  A string representing a duration relative to a measure.
			 *  * "4n" = quarter note
			 *  * "2m" = two measures
			 *  * "8t" = eighth-note triplet
			 *  @typedef {Notation}
			 */Notation:'notation'};///////////////////////////////////////////////////////////////////////////
// AUGMENT TONE's PROTOTYPE
///////////////////////////////////////////////////////////////////////////
/**
		 *  Convert Time into seconds.
		 *
		 *  Unlike the method which it overrides, this takes into account
		 *  transporttime and musical notation.
		 *
		 *  Time : 1.40
		 *  Notation: 4n or 1m or 2t
		 *  Now Relative: +3n
		 *  Math: 3n+16n or even complicated expressions ((3n*2)/6 + 1)
		 *
		 *  @param  {Time} time
		 *  @return {Seconds}
		 */Tone.prototype.toSeconds=function(time){if(Tone.isNumber(time)){return time;}else if(Tone.isUndef(time)){return this.now();}else if(Tone.isString(time)){return new Tone.Time(time).toSeconds();}else if(time instanceof Tone.TimeBase){return time.toSeconds();}};/**
		 *  Convert a frequency representation into a number.
		 *  @param  {Frequency} freq
		 *  @return {Hertz}      the frequency in hertz
		 */Tone.prototype.toFrequency=function(freq){if(Tone.isNumber(freq)){return freq;}else if(Tone.isString(freq)||Tone.isUndef(freq)){return new Tone.Frequency(freq).valueOf();}else if(freq instanceof Tone.TimeBase){return freq.toFrequency();}};/**
		 *  Convert a time representation into ticks.
		 *  @param  {Time} time
		 *  @return {Ticks}  the time in ticks
		 */Tone.prototype.toTicks=function(time){if(Tone.isNumber(time)||Tone.isString(time)){return new Tone.TransportTime(time).toTicks();}else if(Tone.isUndef(time)){return Tone.Transport.ticks;}else if(time instanceof Tone.TimeBase){return time.toTicks();}};return Tone;});Module(function(Tone){/**
		 *  @class Tone.Param wraps the native Web Audio's AudioParam to provide
		 *         additional unit conversion functionality. It also
		 *         serves as a base-class for classes which have a single,
		 *         automatable parameter.
		 *  @extends {Tone.AudioNode}
		 *  @param  {AudioParam}  param  The parameter to wrap.
		 *  @param  {Tone.Type} units The units of the audio param.
		 *  @param  {Boolean} convert If the param should be converted.
		 */Tone.Param=function(){var options=Tone.defaults(arguments,['param','units','convert'],Tone.Param);Tone.AudioNode.call(this);/**
			 *  The native parameter to control
			 *  @type  {AudioParam}
			 *  @private
			 */this._param=this.input=options.param;/**
			 *  The units of the parameter
			 *  @type {Tone.Type}
			 */this.units=options.units;/**
			 *  If the value should be converted or not
			 *  @type {Boolean}
			 */this.convert=options.convert;/**
			 *  True if the signal value is being overridden by
			 *  a connected signal.
			 *  @readOnly
			 *  @type  {boolean}
			 *  @private
			 */this.overridden=false;/**
			 * The timeline which tracks all of the automations.
			 * @type {Tone.Timeline}
			 * @private
			 */this._events=new Tone.Timeline(1000);if(Tone.isDefined(options.value)&&this._param){this.value=options.value;}};Tone.extend(Tone.Param,Tone.AudioNode);/**
		 *  Defaults
		 *  @type  {Object}
		 *  @const
		 */Tone.Param.defaults={'units':Tone.Type.Default,'convert':true,'param':undefined};/**
		 * The current value of the parameter.
		 * @memberOf Tone.Param#
		 * @type {Number}
		 * @name value
		 */Object.defineProperty(Tone.Param.prototype,'value',{get:function get(){var now=this.now();return this._toUnits(this.getValueAtTime(now));},set:function set(value){this._initialValue=this._fromUnits(value);this.cancelScheduledValues(this.context.currentTime);this.setValueAtTime(value,this.context.currentTime);}});/**
		 * The minimum output value of the parameter
		 * @memberOf Tone.Param#
		 * @type {Number}
		 * @name value
		 */Object.defineProperty(Tone.Param.prototype,'minValue',{get:function get(){if(this.units===Tone.Type.Time||this.units===Tone.Type.Frequency||this.units===Tone.Type.NormalRange||this.units===Tone.Type.Positive||this.units===Tone.Type.BPM){return 0;}else if(this.units===Tone.Type.AudioRange){return-1;}else if(this.units===Tone.Type.Decibels){return-Infinity;}else{return this._param.minValue;}}});/**
		 * The maximum output value of the parameter
		 * @memberOf Tone.Param#
		 * @type {Number}
		 * @name value
		 */Object.defineProperty(Tone.Param.prototype,'maxValue',{get:function get(){if(this.units===Tone.Type.NormalRange||this.units===Tone.Type.AudioRange){return 1;}else{return this._param.maxValue;}}});/**
		 *  Convert the given value from the type specified by Tone.Param.units
		 *  into the destination value (such as Gain or Frequency).
		 *  @private
		 *  @param  {*} val the value to convert
		 *  @return {number}     the number which the value should be set to
		 */Tone.Param.prototype._fromUnits=function(val){if((this.convert||Tone.isUndef(this.convert))&&!this.overridden){switch(this.units){case Tone.Type.Time:return this.toSeconds(val);case Tone.Type.Frequency:return this.toFrequency(val);case Tone.Type.Decibels:return Tone.dbToGain(val);case Tone.Type.NormalRange:return Math.min(Math.max(val,0),1);case Tone.Type.AudioRange:return Math.min(Math.max(val,-1),1);case Tone.Type.Positive:return Math.max(val,0);default:return val;}}else{return val;}};/**
		 * Convert the parameters value into the units specified by Tone.Param.units.
		 * @private
		 * @param  {number} val the value to convert
		 * @return {number}
		 */Tone.Param.prototype._toUnits=function(val){if(this.convert||Tone.isUndef(this.convert)){switch(this.units){case Tone.Type.Decibels:return Tone.gainToDb(val);default:return val;}}else{return val;}};/**
		 *  the minimum output value
		 *  @type {Number}
		 *  @private
		 */Tone.Param.prototype._minOutput=0.00001;/**
		 *  The event types
		 *  @enum {String}
		 *  @private
		 */Tone.Param.AutomationType={Linear:'linearRampToValueAtTime',Exponential:'exponentialRampToValueAtTime',Target:'setTargetAtTime',SetValue:'setValueAtTime'};/**
		 *  Schedules a parameter value change at the given time.
		 *  @param {*}	value The value to set the signal.
		 *  @param {Time}  time The time when the change should occur.
		 *  @returns {Tone.Param} this
		 *  @example
		 * //set the frequency to "G4" in exactly 1 second from now.
		 * freq.setValueAtTime("G4", "+1");
		 */Tone.Param.prototype.setValueAtTime=function(value,time){time=this.toSeconds(time);value=this._fromUnits(value);this._events.add({'type':Tone.Param.AutomationType.SetValue,'value':value,'time':time});this._param.setValueAtTime(value,time);return this;};/**
		 *  Get the signals value at the given time. Subsequent scheduling
		 *  may invalidate the returned value.
		 *  @param {Time} time When to get the value
		 *  @returns {Number} The value at the given time
		 */Tone.Param.prototype.getValueAtTime=function(time){time=this.toSeconds(time);var after=this._events.getAfter(time);var before=this._events.get(time);var initialValue=Tone.defaultArg(this._initialValue,this._param.defaultValue);var value=initialValue;//if it was set by
if(before===null){value=initialValue;}else if(before.type===Tone.Param.AutomationType.Target){var previous=this._events.getBefore(before.time);var previousVal;if(previous===null){previousVal=initialValue;}else{previousVal=previous.value;}value=this._exponentialApproach(before.time,previousVal,before.value,before.constant,time);}else if(after===null){value=before.value;}else if(after.type===Tone.Param.AutomationType.Linear){value=this._linearInterpolate(before.time,before.value,after.time,after.value,time);}else if(after.type===Tone.Param.AutomationType.Exponential){value=this._exponentialInterpolate(before.time,before.value,after.time,after.value,time);}else{value=before.value;}return value;};/**
		 *  Creates a schedule point with the current value at the current time.
		 *  This is useful for creating an automation anchor point in order to
		 *  schedule changes from the current value.
		 *
		 *  @param {number=} now (Optionally) pass the now value in.
		 *  @returns {Tone.Param} this
		 */Tone.Param.prototype.setRampPoint=function(time){time=this.toSeconds(time);var currentVal=this.getValueAtTime(time);this.cancelAndHoldAtTime(time);if(currentVal===0){currentVal=this._minOutput;}this.setValueAtTime(this._toUnits(currentVal),time);return this;};/**
		 *  Schedules a linear continuous change in parameter value from the
		 *  previous scheduled parameter value to the given value.
		 *
		 *  @param  {number} value
		 *  @param  {Time} endTime
		 *  @returns {Tone.Param} this
		 */Tone.Param.prototype.linearRampToValueAtTime=function(value,endTime){value=this._fromUnits(value);endTime=this.toSeconds(endTime);this._events.add({'type':Tone.Param.AutomationType.Linear,'value':value,'time':endTime});this._param.linearRampToValueAtTime(value,endTime);return this;};/**
		 *  Schedules an exponential continuous change in parameter value from
		 *  the previous scheduled parameter value to the given value.
		 *
		 *  @param  {number} value
		 *  @param  {Time} endTime
		 *  @returns {Tone.Param} this
		 */Tone.Param.prototype.exponentialRampToValueAtTime=function(value,endTime){value=this._fromUnits(value);value=Math.max(this._minOutput,value);endTime=this.toSeconds(endTime);//store the event
this._events.add({'type':Tone.Param.AutomationType.Exponential,'time':endTime,'value':value});this._param.exponentialRampToValueAtTime(value,endTime);return this;};/**
		 *  Schedules an exponential continuous change in parameter value from
		 *  the current time and current value to the given value over the
		 *  duration of the rampTime.
		 *
		 *  @param  {number} value   The value to ramp to.
		 *  @param  {Time} rampTime the time that it takes the
		 *                               value to ramp from it's current value
		 *  @param {Time}	[startTime=now] 	When the ramp should start.
		 *  @returns {Tone.Param} this
		 *  @example
		 * //exponentially ramp to the value 2 over 4 seconds.
		 * signal.exponentialRampTo(2, 4);
		 */Tone.Param.prototype.exponentialRampTo=function(value,rampTime,startTime){startTime=this.toSeconds(startTime);this.setRampPoint(startTime);this.exponentialRampToValueAtTime(value,startTime+this.toSeconds(rampTime));return this;};/**
		 *  Schedules an linear continuous change in parameter value from
		 *  the current time and current value to the given value over the
		 *  duration of the rampTime.
		 *
		 *  @param  {number} value   The value to ramp to.
		 *  @param  {Time} rampTime the time that it takes the
		 *                               value to ramp from it's current value
		 *  @param {Time}	[startTime=now] 	When the ramp should start.
		 *  @returns {Tone.Param} this
		 *  @example
		 * //linearly ramp to the value 4 over 3 seconds.
		 * signal.linearRampTo(4, 3);
		 */Tone.Param.prototype.linearRampTo=function(value,rampTime,startTime){startTime=this.toSeconds(startTime);this.setRampPoint(startTime);this.linearRampToValueAtTime(value,startTime+this.toSeconds(rampTime));return this;};/**
		 *  Start exponentially approaching the target value at the given time. Since it
		 *  is an exponential approach it will continue approaching after the ramp duration. The
		 *  rampTime is the time that it takes to reach over 99% of the way towards the value.
		 *  @param  {number} value   The value to ramp to.
		 *  @param  {Time} rampTime the time that it takes the
		 *                               value to ramp from it's current value
		 *  @param {Time}	[startTime=now] 	When the ramp should start.
		 *  @returns {Tone.Param} this
		 *  @example
		 * //exponentially ramp to the value 2 over 4 seconds.
		 * signal.exponentialRampTo(2, 4);
		 */Tone.Param.prototype.targetRampTo=function(value,rampTime,startTime){startTime=this.toSeconds(startTime);this.setRampPoint(startTime);this.exponentialApproachValueAtTime(value,startTime,rampTime);return this;};/**
		 *  Start exponentially approaching the target value at the given time. Since it
		 *  is an exponential approach it will continue approaching after the ramp duration. The
		 *  rampTime is the time that it takes to reach over 99% of the way towards the value. This methods
		 *  is similar to setTargetAtTime except the third argument is a time instead of a 'timeConstant'
		 *  @param  {number} value   The value to ramp to.
		 *  @param {Time}	time 	When the ramp should start.
		 *  @param  {Time} rampTime the time that it takes the
		 *                               value to ramp from it's current value
		 *  @returns {Tone.Param} this
		 *  @example
		 * //exponentially ramp to the value 2 over 4 seconds.
		 * signal.exponentialRampTo(2, 4);
		 */Tone.Param.prototype.exponentialApproachValueAtTime=function(value,time,rampTime){var timeConstant=Math.log(this.toSeconds(rampTime)+1)/Math.log(200);time=this.toSeconds(time);return this.setTargetAtTime(value,time,timeConstant);};/**
		 *  Start exponentially approaching the target value at the given time with
		 *  a rate having the given time constant.
		 *  @param {number} value
		 *  @param {Time} startTime
		 *  @param {number} timeConstant
		 *  @returns {Tone.Param} this
		 */Tone.Param.prototype.setTargetAtTime=function(value,startTime,timeConstant){value=this._fromUnits(value);// The value will never be able to approach without timeConstant > 0.
if(timeConstant<=0){throw new Error('timeConstant must be greater than 0');}startTime=this.toSeconds(startTime);this._events.add({'type':Tone.Param.AutomationType.Target,'value':value,'time':startTime,'constant':timeConstant});this._param.setTargetAtTime(value,startTime,timeConstant);return this;};/**
		 *  Sets an array of arbitrary parameter values starting at the given time
		 *  for the given duration.
		 *
		 *  @param {Array} values
		 *  @param {Time} startTime
		 *  @param {Time} duration
		 *  @param {NormalRange} [scaling=1] If the values in the curve should be scaled by some value
		 *  @returns {Tone.Param} this
		 */Tone.Param.prototype.setValueCurveAtTime=function(values,startTime,duration,scaling){scaling=Tone.defaultArg(scaling,1);duration=this.toSeconds(duration);startTime=this.toSeconds(startTime);this.setValueAtTime(values[0]*scaling,startTime);var segTime=duration/(values.length-1);for(var i=1;i<values.length;i++){this.linearRampToValueAtTime(values[i]*scaling,startTime+i*segTime);}return this;};/**
		 *  Cancels all scheduled parameter changes with times greater than or
		 *  equal to startTime.
		 *
		 *  @param  {Time} time
		 *  @returns {Tone.Param} this
		 */Tone.Param.prototype.cancelScheduledValues=function(time){time=this.toSeconds(time);this._events.cancel(time);this._param.cancelScheduledValues(time);return this;};/**
		 *  This is similar to [cancelScheduledValues](#cancelScheduledValues) except
		 *  it holds the automated value at time until the next automated event.
		 *  @param  {Time} time
		 *  @returns {Tone.Param} this
		 */Tone.Param.prototype.cancelAndHoldAtTime=function(time){var valueAtTime=this.getValueAtTime(time);//if there is an event at the given time
//and that even is not a "set"
var before=this._events.get(time);var after=this._events.getAfter(time);if(before&&before.time===time){//remove everything after
if(after){this._events.cancel(after.time);}else{this._events.cancel(time+0.000001);}}else if(after){//cancel the next event(s)
this._events.cancel(after.time);if(!this._param.cancelAndHoldAtTime){this._param.cancelScheduledValues(time);}if(after.type===Tone.Param.AutomationType.Linear){if(!this._param.cancelAndHoldAtTime){this.linearRampToValueAtTime(valueAtTime,time);}else{this._events.add({'type':Tone.Param.AutomationType.Linear,'value':valueAtTime,'time':time});}}else if(after.type===Tone.Param.AutomationType.Exponential){if(!this._param.cancelAndHoldAtTime){this.exponentialRampToValueAtTime(valueAtTime,time);}else{this._events.add({'type':Tone.Param.AutomationType.Exponential,'value':valueAtTime,'time':time});}}}//set the value at the given time
this._events.add({'type':Tone.Param.AutomationType.SetValue,'value':valueAtTime,'time':time});if(this._param.cancelAndHoldAtTime){this._param.cancelAndHoldAtTime(time);}else{this._param.setValueAtTime(valueAtTime,time);}return this;};/**
		 *  Ramps to the given value over the duration of the rampTime.
		 *  Automatically selects the best ramp type (exponential or linear)
		 *  depending on the `units` of the signal
		 *
		 *  @param  {number} value
		 *  @param  {Time} rampTime 	The time that it takes the
		 *                              value to ramp from it's current value
		 *  @param {Time}	[startTime=now] 	When the ramp should start.
		 *  @returns {Tone.Param} this
		 *  @example
		 * //ramp to the value either linearly or exponentially
		 * //depending on the "units" value of the signal
		 * signal.rampTo(0, 10);
		 *  @example
		 * //schedule it to ramp starting at a specific time
		 * signal.rampTo(0, 10, 5)
		 */Tone.Param.prototype.rampTo=function(value,rampTime,startTime){rampTime=Tone.defaultArg(rampTime,0.1);if(this.units===Tone.Type.Frequency||this.units===Tone.Type.BPM||this.units===Tone.Type.Decibels){this.exponentialRampTo(value,rampTime,startTime);}else{this.linearRampTo(value,rampTime,startTime);}return this;};///////////////////////////////////////////////////////////////////////////
//	AUTOMATION CURVE CALCULATIONS
//	MIT License, copyright (c) 2014 Jordan Santell
///////////////////////////////////////////////////////////////////////////
// Calculates the the value along the curve produced by setTargetAtTime
Tone.Param.prototype._exponentialApproach=function(t0,v0,v1,timeConstant,t){return v1+(v0-v1)*Math.exp(-(t-t0)/timeConstant);};// Calculates the the value along the curve produced by linearRampToValueAtTime
Tone.Param.prototype._linearInterpolate=function(t0,v0,t1,v1,t){return v0+(v1-v0)*((t-t0)/(t1-t0));};// Calculates the the value along the curve produced by exponentialRampToValueAtTime
Tone.Param.prototype._exponentialInterpolate=function(t0,v0,t1,v1,t){return v0*Math.pow(v1/v0,(t-t0)/(t1-t0));};/**
		 *  Clean up
		 *  @returns {Tone.Param} this
		 */Tone.Param.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._param=null;this._events=null;return this;};return Tone.Param;});Module(function(Tone){/**
		 *  @class Wrapper around the OfflineAudioContext
		 *  @extends {Tone.Context}
		 *  @param  {Number}  channels  The number of channels to render
		 *  @param  {Number}  duration  The duration to render in samples
		 *  @param {Number} sampleRate the sample rate to render at
		 */Tone.OfflineContext=function(channels,duration,sampleRate){/**
			 *  The offline context
			 *  @private
			 *  @type  {OfflineAudioContext}
			 */var offlineContext=new OfflineAudioContext(channels,duration*sampleRate,sampleRate);//wrap the methods/members
Tone.Context.call(this,{'context':offlineContext,'clockSource':'offline','lookAhead':0,'updateInterval':128/sampleRate});/**
			 *  A private reference to the duration
			 *  @private
			 *  @type  {Number}
			 */this._duration=duration;/**
			 *  An artificial clock source
			 *  @type  {Number}
			 *  @private
			 */this._currentTime=0;};Tone.extend(Tone.OfflineContext,Tone.Context);/**
		 *  Override the now method to point to the internal clock time
		 *  @return  {Number}
		 */Tone.OfflineContext.prototype.now=function(){return this._currentTime;};/**
		 *  Render the output of the OfflineContext
		 *  @return  {Promise}
		 */Tone.OfflineContext.prototype.render=function(){while(this._duration-this._currentTime>=0){//invoke all the callbacks on that time
this.emit('tick');//increment the clock
this._currentTime+=this.blockTime;}return this._context.startRendering();};/**
		 *  Close the context
		 *  @return  {Promise}
		 */Tone.OfflineContext.prototype.close=function(){this._context=null;return Promise.resolve();};return Tone.OfflineContext;});Module(function(Tone){if(Tone.supported){var ua=navigator.userAgent.toLowerCase();var isMobileSafari=ua.includes('safari')&&!ua.includes('chrome')&&ua.includes('mobile');if(isMobileSafari){//mobile safari has a bizarre bug with the offline context
//when a BufferSourceNode is started, it starts the offline context
//
//deferring all BufferSource starts till the last possible moment
//reduces the likelihood of this happening
Tone.OfflineContext.prototype.createBufferSource=function(){var bufferSource=this._context.createBufferSource();var _native_start=bufferSource.start;bufferSource.start=function(time){this.setTimeout(function(){_native_start.call(bufferSource,time);}.bind(this),0);}.bind(this);return bufferSource;};}}});Module(function(Tone){/**
		 *  @class A thin wrapper around the Native Web Audio GainNode.
		 *         The GainNode is a basic building block of the Web Audio
		 *         API and is useful for routing audio and adjusting gains.
		 *  @extends {Tone}
		 *  @param  {Number=}  gain  The initial gain of the GainNode
		 *  @param {Tone.Type=} units The units of the gain parameter.
		 */Tone.Gain=function(){var options=Tone.defaults(arguments,['gain','units'],Tone.Gain);Tone.AudioNode.call(this);/**
			 *  The GainNode
			 *  @type  {GainNode}
			 *  @private
			 */this.input=this.output=this._gainNode=this.context.createGain();/**
			 *  The gain parameter of the gain node.
			 *  @type {Gain}
			 *  @signal
			 */this.gain=new Tone.Param({'param':this._gainNode.gain,'units':options.units,'value':options.gain,'convert':options.convert});this._readOnly('gain');};Tone.extend(Tone.Gain,Tone.AudioNode);/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */Tone.Gain.defaults={'gain':1,'convert':true};/**
		 *  Clean up.
		 *  @return  {Tone.Gain}  this
		 */Tone.Gain.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._gainNode.disconnect();this._gainNode=null;this._writable('gain');this.gain.dispose();this.gain=null;};return Tone.Gain;});Module(function(Tone){if(Tone.supported&&!AudioContext.prototype.createConstantSource){var ConstantSourceNode=function ConstantSourceNode(context){this.context=context;var buffer=context.createBuffer(1,128,context.sampleRate);var arr=buffer.getChannelData(0);for(var i=0;i<arr.length;i++){arr[i]=1;}this._bufferSource=context.createBufferSource();this._bufferSource.channelCount=1;this._bufferSource.channelCountMode='explicit';this._bufferSource.buffer=buffer;this._bufferSource.loop=true;var gainNode=this._output=context.createGain();this.offset=gainNode.gain;this._bufferSource.connect(gainNode);};ConstantSourceNode.prototype.start=function(time){this._bufferSource.start(time);return this;};ConstantSourceNode.prototype.stop=function(time){this._bufferSource.stop(time);return this;};ConstantSourceNode.prototype.connect=function(){this._output.connect.apply(this._output,arguments);return this;};ConstantSourceNode.prototype.disconnect=function(){this._output.disconnect.apply(this._output,arguments);return this;};AudioContext.prototype.createConstantSource=function(){return new ConstantSourceNode(this);};Tone.Context.prototype.createConstantSource=function(){return new ConstantSourceNode(this);};}});Module(function(Tone){/**
		 *  @class  A signal is an audio-rate value. Tone.Signal is a core component of the library.
		 *          Unlike a number, Signals can be scheduled with sample-level accuracy. Tone.Signal
		 *          has all of the methods available to native Web Audio
		 *          [AudioParam](http://webaudio.github.io/web-audio-api/#the-audioparam-interface)
		 *          as well as additional conveniences. Read more about working with signals
		 *          [here](https://github.com/Tonejs/Tone.js/wiki/Signals).
		 *
		 *  @constructor
		 *  @extends {Tone.Param}
		 *  @param {Number|AudioParam} [value] Initial value of the signal. If an AudioParam
		 *                                     is passed in, that parameter will be wrapped
		 *                                     and controlled by the Signal.
		 *  @param {string} [units=Number] unit The units the signal is in.
		 *  @example
		 * var signal = new Tone.Signal(10);
		 */Tone.Signal=function(){var options=Tone.defaults(arguments,['value','units'],Tone.Signal);Tone.Param.call(this,options);/**
			* When a signal is connected to another signal or audio param,
			* this signal becomes a proxy for it
			* @type {Array}
			* @private
			*/this._proxies=[];/**
			* Indicates if the constant source was started or not
			* @private
			* @type {Boolean}
			*/this._sourceStarted=false;/**
			 * The constant source node which generates the signal
			 * @type {ConstantSourceNode}
			 * @private
			 */this._constantSource=this.context.createConstantSource();this._param=this._constantSource.offset;this.value=options.value;/**
			 * The node where the constant signal value is scaled.
			 * @type {GainNode}
			 * @private
			 */this.output=this._constantSource;/**
			 * The node where the value is set.
			 * @type {Tone.Param}
			 * @private
			 */this.input=this._param=this.output.offset;};Tone.extend(Tone.Signal,Tone.Param);/**
		 *  The default values
		 *  @type  {Object}
		 *  @static
		 *  @const
		 */Tone.Signal.defaults={'value':0,'units':Tone.Type.Default,'convert':true};/**
		 *  When signals connect to other signals or AudioParams,
		 *  they take over the output value of that signal or AudioParam.
		 *  For all other nodes, the behavior is the same as a default <code>connect</code>.
		 *
		 *  @override
		 *  @param {AudioParam|AudioNode|Tone.Signal|Tone} node
		 *  @param {number} [outputNumber=0] The output number to connect from.
		 *  @param {number} [inputNumber=0] The input number to connect to.
		 *  @returns {Tone.Signal} this
		 *  @method
		 */Tone.Signal.prototype.connect=function(node){//this is an optimization where this node will forward automations
//to connected nodes without any signal if possible.
if(this._isParam(node)&&!this._sourceStarted){this._proxies.push(node);node.overridden=true;this._applyAutomations(node);}else{Tone.SignalBase.prototype.connect.apply(this,arguments);if(!this._sourceStarted){this._sourceStarted=true;this._constantSource.start(0);}}return this;};/**
		 * Takes a node as an argument and returns if it is a Param or AudioParam
		 * @param  {*} node The node to test
		 * @return {Boolean}
		 * @private
		 */Tone.Signal.prototype._isParam=function(node){return Tone.Param&&Tone.Param===node.constructor||node instanceof AudioParam;};/**
		 * Discard the optimization and connect all of the proxies
		 * @private
		 */Tone.Signal.prototype._connectProxies=function(){if(!this._sourceStarted){this._sourceStarted=true;this._constantSource.start(0);}this._proxies.forEach(function(proxy){Tone.SignalBase.prototype.connect.call(this,proxy);if(proxy._proxies){proxy._connectProxies();}}.bind(this));};/**
		 * Invoked when a node is connected to this
		 * @param  {AudioNode} from
		 * @private
		 */Tone.Signal.prototype._onConnect=function(from){if(!this._isParam(from)){//connect all the proxies
this._connectProxies();}};/**
		 * Apply all the current automations to the given parameter
		 * @param  {AudioParam} param
		 * @private
		 */Tone.Signal.prototype._applyAutomations=function(param){var now=this.context.currentTime;param.cancelScheduledValues(now);var currentVal=this.getValueAtTime(now);param.setValueAtTime(currentVal,now);this._events.forEachFrom(now,function(event){param[event.type](event.value,event.time,event.constant);});};/**
		 * Disconnect from the given node or all nodes if no param is given.
		 * @param  {AudioNode|AudioParam} node
		 * @return {Tone.Signal}      this
		 */Tone.Signal.prototype.disconnect=function(node){if(this._proxies.includes(node)){var index=this._proxies.indexOf(node);this._proxies.splice(index,1);}else if(!node){//no argument, disconnect everything
this._proxies=[];}return Tone.SignalBase.prototype.disconnect.apply(this,arguments);};/**
		 * Return the current signal value at the given time.
		 * @param  {Time} time When to get the signal value
		 * @return {Number}
		 */Tone.Signal.prototype.getValueAtTime=function(time){if(this._param.getValueAtTime){return this._param.getValueAtTime(time);}else{return Tone.Param.prototype.getValueAtTime.call(this,time);}};//wrap all of the automation methods
['setValueAtTime','linearRampToValueAtTime','exponentialRampToValueAtTime','setTargetAtTime'].forEach(function(method){var previousMethod=Tone.Signal.prototype[method];Tone.Signal.prototype[method]=function(){var args=arguments;previousMethod.apply(this,arguments);args[0]=this._fromUnits(args[0]);args[1]=this.toSeconds(args[1]);//apply it to the proxies
this._proxies.forEach(function(signal){signal[method].apply(signal,args);});};});['cancelScheduledValues','cancelAndHoldAtTime'].forEach(function(method){var previousMethod=Tone.Signal.prototype[method];Tone.Signal.prototype[method]=function(){var args=arguments;previousMethod.apply(this,arguments);args[0]=this.toSeconds(args[0]);//apply it to the proxies
this._proxies.forEach(function(signal){signal[method].apply(signal,args);});};});/**
		 *  dispose and disconnect
		 *  @returns {Tone.Signal} this
		 */Tone.Signal.prototype.dispose=function(){Tone.Param.prototype.dispose.call(this);this._constantSource.disconnect();this._constantSource=null;this._proxies=null;return this;};return Tone.Signal;});Module(function(Tone){/**
		 *  @class Pow applies an exponent to the incoming signal. The incoming signal
		 *         must be AudioRange.
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {Positive} exp The exponent to apply to the incoming signal, must be at least 2. 
		 *  @example
		 * var pow = new Tone.Pow(2);
		 * var sig = new Tone.Signal(0.5).connect(pow);
		 * //output of pow is 0.25. 
		 */Tone.Pow=function(exp){Tone.SignalBase.call(this);/**
			 * the exponent
			 * @private
			 * @type {number}
			 */this._exp=Tone.defaultArg(exp,1);/**
			 *  @type {WaveShaperNode}
			 *  @private
			 */this._expScaler=this.input=this.output=new Tone.WaveShaper(this._expFunc(this._exp),8192);};Tone.extend(Tone.Pow,Tone.SignalBase);/**
		 * The value of the exponent.
		 * @memberOf Tone.Pow#
		 * @type {number}
		 * @name value
		 */Object.defineProperty(Tone.Pow.prototype,'value',{get:function get(){return this._exp;},set:function set(exp){this._exp=exp;this._expScaler.setMap(this._expFunc(this._exp));}});/**
		 *  the function which maps the waveshaper
		 *  @param   {number} exp
		 *  @return {function}
		 *  @private
		 */Tone.Pow.prototype._expFunc=function(exp){return function(val){return Math.pow(Math.abs(val),exp);};};/**
		 *  Clean up.
		 *  @returns {Tone.Pow} this
		 */Tone.Pow.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._expScaler.dispose();this._expScaler=null;return this;};return Tone.Pow;});Module(function(Tone){/**
		 *  @class  Tone.Envelope is an [ADSR](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope)
		 *          envelope generator. Tone.Envelope outputs a signal which
		 *          can be connected to an AudioParam or Tone.Signal.
		 *          <img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/ADSR_parameter.svg">
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @param {Time} [attack] The amount of time it takes for the envelope to go from
		 *                         0 to it's maximum value.
		 *  @param {Time} [decay]	The period of time after the attack that it takes for the envelope
		 *                       	to fall to the sustain value.
		 *  @param {NormalRange} [sustain]	The percent of the maximum value that the envelope rests at until
		 *                                	the release is triggered.
		 *  @param {Time} [release]	The amount of time after the release is triggered it takes to reach 0.
		 *  @example
		 * //an amplitude envelope
		 * var gainNode = Tone.context.createGain();
		 * var env = new Tone.Envelope({
		 * 	"attack" : 0.1,
		 * 	"decay" : 0.2,
		 * 	"sustain" : 1,
		 * 	"release" : 0.8,
		 * });
		 * env.connect(gainNode.gain);
		 */Tone.Envelope=function(){//get all of the defaults
var options=Tone.defaults(arguments,['attack','decay','sustain','release'],Tone.Envelope);Tone.AudioNode.call(this);/**
			 *  When triggerAttack is called, the attack time is the amount of
			 *  time it takes for the envelope to reach it's maximum value.
			 *  @type {Time}
			 */this.attack=options.attack;/**
			 *  After the attack portion of the envelope, the value will fall
			 *  over the duration of the decay time to it's sustain value.
			 *  @type {Time}
			 */this.decay=options.decay;/**
			 * 	The sustain value is the value
			 * 	which the envelope rests at after triggerAttack is
			 * 	called, but before triggerRelease is invoked.
			 *  @type {NormalRange}
			 */this.sustain=options.sustain;/**
			 *  After triggerRelease is called, the envelope's
			 *  value will fall to it's miminum value over the
			 *  duration of the release time.
			 *  @type {Time}
			 */this.release=options.release;/**
			 *  the next time the envelope is at standby
			 *  @type {number}
			 *  @private
			 */this._attackCurve='linear';/**
			 *  the next time the envelope is at standby
			 *  @type {number}
			 *  @private
			 */this._releaseCurve='exponential';/**
			 *  the signal
			 *  @type {Tone.Signal}
			 *  @private
			 */this._sig=this.output=new Tone.Signal(0);//set the attackCurve initially
this.attackCurve=options.attackCurve;this.releaseCurve=options.releaseCurve;};Tone.extend(Tone.Envelope,Tone.AudioNode);/**
		 *  the default parameters
		 *  @static
		 *  @const
		 */Tone.Envelope.defaults={'attack':0.01,'decay':0.1,'sustain':0.5,'release':1,'attackCurve':'linear','releaseCurve':'exponential'};/**
		 * Read the current value of the envelope. Useful for
		 * syncronizing visual output to the envelope.
		 * @memberOf Tone.Envelope#
		 * @type {Number}
		 * @name value
		 * @readOnly
		 */Object.defineProperty(Tone.Envelope.prototype,'value',{get:function get(){return this.getValueAtTime(this.now());}});/**
		 * The shape of the attack.
		 * Can be any of these strings:
		 * <ul>
		 *   <li>linear</li>
		 *   <li>exponential</li>
		 *   <li>sine</li>
		 *   <li>cosine</li>
		 *   <li>bounce</li>
		 *   <li>ripple</li>
		 *   <li>step</li>
		 * </ul>
		 * Can also be an array which describes the curve. Values
		 * in the array are evenly subdivided and linearly
		 * interpolated over the duration of the attack.
		 * @memberOf Tone.Envelope#
		 * @type {String|Array}
		 * @name attackCurve
		 * @example
		 * env.attackCurve = "linear";
		 * @example
		 * //can also be an array
		 * env.attackCurve = [0, 0.2, 0.3, 0.4, 1]
		 */Object.defineProperty(Tone.Envelope.prototype,'attackCurve',{get:function get(){if(Tone.isString(this._attackCurve)){return this._attackCurve;}else if(Tone.isArray(this._attackCurve)){//look up the name in the curves array
for(var type in Tone.Envelope.Type){if(Tone.Envelope.Type[type].In===this._attackCurve){return type;}}//otherwise just return the array
return this._attackCurve;}},set:function set(curve){//check if it's a valid type
if(Tone.Envelope.Type.hasOwnProperty(curve)){var curveDef=Tone.Envelope.Type[curve];if(Tone.isObject(curveDef)){this._attackCurve=curveDef.In;}else{this._attackCurve=curveDef;}}else if(Tone.isArray(curve)){this._attackCurve=curve;}else{throw new Error('Tone.Envelope: invalid curve: '+curve);}}});/**
		 * The shape of the release. See the attack curve types.
		 * @memberOf Tone.Envelope#
		 * @type {String|Array}
		 * @name releaseCurve
		 * @example
		 * env.releaseCurve = "linear";
		 */Object.defineProperty(Tone.Envelope.prototype,'releaseCurve',{get:function get(){if(Tone.isString(this._releaseCurve)){return this._releaseCurve;}else if(Tone.isArray(this._releaseCurve)){//look up the name in the curves array
for(var type in Tone.Envelope.Type){if(Tone.Envelope.Type[type].Out===this._releaseCurve){return type;}}//otherwise just return the array
return this._releaseCurve;}},set:function set(curve){//check if it's a valid type
if(Tone.Envelope.Type.hasOwnProperty(curve)){var curveDef=Tone.Envelope.Type[curve];if(Tone.isObject(curveDef)){this._releaseCurve=curveDef.Out;}else{this._releaseCurve=curveDef;}}else if(Tone.isArray(curve)){this._releaseCurve=curve;}else{throw new Error('Tone.Envelope: invalid curve: '+curve);}}});/**
		 *  Trigger the attack/decay portion of the ADSR envelope.
		 *  @param  {Time} [time=now] When the attack should start.
		 *  @param {NormalRange} [velocity=1] The velocity of the envelope scales the vales.
		 *                               number between 0-1
		 *  @returns {Tone.Envelope} this
		 *  @example
		 *  //trigger the attack 0.5 seconds from now with a velocity of 0.2
		 *  env.triggerAttack("+0.5", 0.2);
		 */Tone.Envelope.prototype.triggerAttack=function(time,velocity){time=this.toSeconds(time);var originalAttack=this.toSeconds(this.attack);var attack=originalAttack;var decay=this.toSeconds(this.decay);velocity=Tone.defaultArg(velocity,1);//check if it's not a complete attack
var currentValue=this.getValueAtTime(time);if(currentValue>0){//subtract the current value from the attack time
var attackRate=1/attack;var remainingDistance=1-currentValue;//the attack is now the remaining time
attack=remainingDistance/attackRate;}//attack
if(this._attackCurve==='linear'){this._sig.linearRampTo(velocity,attack,time);}else if(this._attackCurve==='exponential'){this._sig.targetRampTo(velocity,attack,time);}else if(attack>0){this._sig.cancelAndHoldAtTime(time);var curve=this._attackCurve;//take only a portion of the curve
if(attack<originalAttack){var percentComplete=1-attack/originalAttack;var sliceIndex=Math.floor(percentComplete*this._attackCurve.length);curve=this._attackCurve.slice(sliceIndex);//the first index is the current value
curve[0]=currentValue;}this._sig.setValueCurveAtTime(curve,time,attack,velocity);}//decay
if(decay){this._sig.targetRampTo(velocity*this.sustain,decay,attack+time);}return this;};/**
		 *  Triggers the release of the envelope.
		 *  @param  {Time} [time=now] When the release portion of the envelope should start.
		 *  @returns {Tone.Envelope} this
		 *  @example
		 *  //trigger release immediately
		 *  env.triggerRelease();
		 */Tone.Envelope.prototype.triggerRelease=function(time){time=this.toSeconds(time);var currentValue=this.getValueAtTime(time);if(currentValue>0){var release=this.toSeconds(this.release);if(this._releaseCurve==='linear'){this._sig.linearRampTo(0,release,time);}else if(this._releaseCurve==='exponential'){this._sig.targetRampTo(0,release,time);}else{var curve=this._releaseCurve;if(Tone.isArray(curve)){this._sig.cancelAndHoldAtTime(time);this._sig.setValueCurveAtTime(curve,time,release,currentValue);}}}return this;};/**
		 *  Get the scheduled value at the given time. This will
		 *  return the unconverted (raw) value.
		 *  @param  {Number}  time  The time in seconds.
		 *  @return  {Number}  The scheduled value at the given time.
		 */Tone.Envelope.prototype.getValueAtTime=function(time){return this._sig.getValueAtTime(time);};/**
		 *  triggerAttackRelease is shorthand for triggerAttack, then waiting
		 *  some duration, then triggerRelease.
		 *  @param {Time} duration The duration of the sustain.
		 *  @param {Time} [time=now] When the attack should be triggered.
		 *  @param {number} [velocity=1] The velocity of the envelope.
		 *  @returns {Tone.Envelope} this
		 *  @example
		 * //trigger the attack and then the release after 0.6 seconds.
		 * env.triggerAttackRelease(0.6);
		 */Tone.Envelope.prototype.triggerAttackRelease=function(duration,time,velocity){time=this.toSeconds(time);this.triggerAttack(time,velocity);this.triggerRelease(time+this.toSeconds(duration));return this;};/**
		 *  Cancels all scheduled envelope changes after the given time.
		 *  @param  {Time} after
		 *  @returns {Tone.Envelope} this
		 */Tone.Envelope.prototype.cancel=function(after){this._sig.cancelScheduledValues(after);return this;};/**
		 *  Borrows the connect method from Tone.Signal.
		 *  @function
		 *  @private
		 */Tone.Envelope.prototype.connect=Tone.SignalBase.prototype.connect;/**
	 	 *  Generate some complex envelope curves.
	 	 */(function _createCurves(){var curveLen=128;var i,k;//cosine curve
var cosineCurve=[];for(i=0;i<curveLen;i++){cosineCurve[i]=Math.sin(i/(curveLen-1)*(Math.PI/2));}//ripple curve
var rippleCurve=[];var rippleCurveFreq=6.4;for(i=0;i<curveLen-1;i++){k=i/(curveLen-1);var sineWave=Math.sin(k*(Math.PI*2)*rippleCurveFreq-Math.PI/2)+1;rippleCurve[i]=sineWave/10+k*0.83;}rippleCurve[curveLen-1]=1;//stairs curve
var stairsCurve=[];var steps=5;for(i=0;i<curveLen;i++){stairsCurve[i]=Math.ceil(i/(curveLen-1)*steps)/steps;}//in-out easing curve
var sineCurve=[];for(i=0;i<curveLen;i++){k=i/(curveLen-1);sineCurve[i]=0.5*(1-Math.cos(Math.PI*k));}//a bounce curve
var bounceCurve=[];for(i=0;i<curveLen;i++){k=i/(curveLen-1);var freq=Math.pow(k,3)*4+0.2;var val=Math.cos(freq*Math.PI*2*k);bounceCurve[i]=Math.abs(val*(1-k));}/**
			 *  Invert a value curve to make it work for the release
			 *  @private
			 */function invertCurve(curve){var out=new Array(curve.length);for(var j=0;j<curve.length;j++){out[j]=1-curve[j];}return out;}/**
			 *  reverse the curve
			 *  @private
			 */function reverseCurve(curve){return curve.slice(0).reverse();}/**
			 *  attack and release curve arrays
			 *  @type  {Object}
			 *  @private
			 */Tone.Envelope.Type={'linear':'linear','exponential':'exponential','bounce':{In:invertCurve(bounceCurve),Out:bounceCurve},'cosine':{In:cosineCurve,Out:reverseCurve(cosineCurve)},'step':{In:stairsCurve,Out:invertCurve(stairsCurve)},'ripple':{In:rippleCurve,Out:invertCurve(rippleCurve)},'sine':{In:sineCurve,Out:invertCurve(sineCurve)}};})();/**
		 *  Disconnect and dispose.
		 *  @returns {Tone.Envelope} this
		 */Tone.Envelope.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._sig.dispose();this._sig=null;this._attackCurve=null;this._releaseCurve=null;return this;};return Tone.Envelope;});Module(function(Tone){/**
		 *  @class  Tone.AmplitudeEnvelope is a Tone.Envelope connected to a gain node.
		 *          Unlike Tone.Envelope, which outputs the envelope's value, Tone.AmplitudeEnvelope accepts
		 *          an audio signal as the input and will apply the envelope to the amplitude
		 *          of the signal. Read more about ADSR Envelopes on [Wikipedia](https://en.wikipedia.org/wiki/Synthesizer#ADSR_envelope).
		 *
		 *  @constructor
		 *  @extends {Tone.Envelope}
		 *  @param {Time|Object} [attack] The amount of time it takes for the envelope to go from
		 *                               0 to it's maximum value.
		 *  @param {Time} [decay]	The period of time after the attack that it takes for the envelope
		 *                       	to fall to the sustain value.
		 *  @param {NormalRange} [sustain]	The percent of the maximum value that the envelope rests at until
		 *                                	the release is triggered.
		 *  @param {Time} [release]	The amount of time after the release is triggered it takes to reach 0.
		 *  @example
		 * var ampEnv = new Tone.AmplitudeEnvelope({
		 * 	"attack": 0.1,
		 * 	"decay": 0.2,
		 * 	"sustain": 1.0,
		 * 	"release": 0.8
		 * }).toMaster();
		 * //create an oscillator and connect it
		 * var osc = new Tone.Oscillator().connect(ampEnv).start();
		 * //trigger the envelopes attack and release "8t" apart
		 * ampEnv.triggerAttackRelease("8t");
		 */Tone.AmplitudeEnvelope=function(){Tone.Envelope.apply(this,arguments);/**
			 *  the input node
			 *  @type {GainNode}
			 *  @private
			 */this.input=this.output=new Tone.Gain();this._sig.connect(this.output.gain);};Tone.extend(Tone.AmplitudeEnvelope,Tone.Envelope);/**
		 *  Clean up
		 *  @return  {Tone.AmplitudeEnvelope}  this
		 */Tone.AmplitudeEnvelope.prototype.dispose=function(){Tone.Envelope.prototype.dispose.call(this);return this;};return Tone.AmplitudeEnvelope;});Module(function(Tone){/**
		 *  AnalyserNode.getFloatTimeDomainData polyfill
		 *  @private
		 */if(Tone.supported){if(!AnalyserNode.prototype.getFloatTimeDomainData){//referenced https://github.com/mohayonao/get-float-time-domain-data
AnalyserNode.prototype.getFloatTimeDomainData=function(array){var uint8=new Uint8Array(array.length);this.getByteTimeDomainData(uint8);for(var i=0;i<uint8.length;i++){array[i]=(uint8[i]-128)/128;}};}}});Module(function(Tone){/**
		 *  @class  Wrapper around the native Web Audio's
		 *          [AnalyserNode](http://webaudio.github.io/web-audio-api/#idl-def-AnalyserNode).
		 *          Extracts FFT or Waveform data from the incoming signal.
		 *  @extends {Tone.AudioNode}
		 *  @param {String=} type The return type of the analysis, either "fft", or "waveform".
		 *  @param {Number=} size The size of the FFT. Value must be a power of
		 *                       two in the range 32 to 32768.
		 */Tone.Analyser=function(){var options=Tone.defaults(arguments,['type','size'],Tone.Analyser);Tone.AudioNode.call(this);/**
			 *  The analyser node.
			 *  @private
			 *  @type {AnalyserNode}
			 */this._analyser=this.input=this.output=this.context.createAnalyser();/**
			 *  The analysis type
			 *  @type {String}
			 *  @private
			 */this._type=options.type;/**
			 *  The buffer that the FFT data is written to
			 *  @type {TypedArray}
			 *  @private
			 */this._buffer=null;//set the values initially
this.size=options.size;this.type=options.type;};Tone.extend(Tone.Analyser,Tone.AudioNode);/**
		 *  The default values.
		 *  @type {Object}
		 *  @const
		 */Tone.Analyser.defaults={'size':1024,'type':'fft','smoothing':0.8};/**
		 *  Possible return types of analyser.getValue()
		 *  @enum {String}
		 */Tone.Analyser.Type={Waveform:'waveform',FFT:'fft'};/**
		 *  Run the analysis given the current settings and return the
		 *  result as a TypedArray.
		 *  @returns {TypedArray}
		 */Tone.Analyser.prototype.getValue=function(){if(this._type===Tone.Analyser.Type.FFT){this._analyser.getFloatFrequencyData(this._buffer);}else if(this._type===Tone.Analyser.Type.Waveform){this._analyser.getFloatTimeDomainData(this._buffer);}return this._buffer;};/**
		 *  The size of analysis. This must be a power of two in the range 32 to 32768.
		 *  @memberOf Tone.Analyser#
		 *  @type {Number}
		 *  @name size
		 */Object.defineProperty(Tone.Analyser.prototype,'size',{get:function get(){return this._analyser.frequencyBinCount;},set:function set(size){this._analyser.fftSize=size*2;this._buffer=new Float32Array(size);}});/**
		 *  The analysis function returned by analyser.getValue(), either "fft" or "waveform".
		 *  @memberOf Tone.Analyser#
		 *  @type {String}
		 *  @name type
		 */Object.defineProperty(Tone.Analyser.prototype,'type',{get:function get(){return this._type;},set:function set(type){if(type!==Tone.Analyser.Type.Waveform&&type!==Tone.Analyser.Type.FFT){throw new TypeError('Tone.Analyser: invalid type: '+type);}this._type=type;}});/**
		 *  0 represents no time averaging with the last analysis frame.
		 *  @memberOf Tone.Analyser#
		 *  @type {NormalRange}
		 *  @name smoothing
		 */Object.defineProperty(Tone.Analyser.prototype,'smoothing',{get:function get(){return this._analyser.smoothingTimeConstant;},set:function set(val){this._analyser.smoothingTimeConstant=val;}});/**
		 *  Clean up.
		 *  @return  {Tone.Analyser}  this
		 */Tone.Analyser.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._analyser.disconnect();this._analyser=null;this._buffer=null;};return Tone.Analyser;});Module(function(Tone){/**
		 *  @class Tone.Compressor is a thin wrapper around the Web Audio
		 *         [DynamicsCompressorNode](http://webaudio.github.io/web-audio-api/#the-dynamicscompressornode-interface).
		 *         Compression reduces the volume of loud sounds or amplifies quiet sounds
		 *         by narrowing or "compressing" an audio signal's dynamic range.
		 *         Read more on [Wikipedia](https://en.wikipedia.org/wiki/Dynamic_range_compression).
		 *
		 *  @extends {Tone.AudioNode}
		 *  @constructor
		 *  @param {Decibels|Object} [threshold] The value above which the compression starts to be applied.
		 *  @param {Positive} [ratio] The gain reduction ratio.
		 *  @example
		 * var comp = new Tone.Compressor(-30, 3);
		 */Tone.Compressor=function(){var options=Tone.defaults(arguments,['threshold','ratio'],Tone.Compressor);Tone.AudioNode.call(this);/**
			 *  the compressor node
			 *  @type {DynamicsCompressorNode}
			 *  @private
			 */this._compressor=this.input=this.output=this.context.createDynamicsCompressor();/**
			 *  the threshold vaue
			 *  @type {Decibels}
			 *  @signal
			 */this.threshold=new Tone.Param({'param':this._compressor.threshold,'units':Tone.Type.Decibels,'convert':false});/**
			 *  The attack parameter
			 *  @type {Time}
			 *  @signal
			 */this.attack=new Tone.Param(this._compressor.attack,Tone.Type.Time);/**
			 *  The release parameter
			 *  @type {Time}
			 *  @signal
			 */this.release=new Tone.Param(this._compressor.release,Tone.Type.Time);/**
			 *  The knee parameter
			 *  @type {Decibels}
			 *  @signal
			 */this.knee=new Tone.Param({'param':this._compressor.knee,'units':Tone.Type.Decibels,'convert':false});/**
			 *  The ratio value
			 *  @type {Number}
			 *  @signal
			 */this.ratio=new Tone.Param({'param':this._compressor.ratio,'convert':false});//set the defaults
this._readOnly(['knee','release','attack','ratio','threshold']);this.set(options);};Tone.extend(Tone.Compressor,Tone.AudioNode);/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.Compressor.defaults={'ratio':12,'threshold':-24,'release':0.25,'attack':0.003,'knee':30};/**
		 *  clean up
		 *  @returns {Tone.Compressor} this
		 */Tone.Compressor.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._writable(['knee','release','attack','ratio','threshold']);this._compressor.disconnect();this._compressor=null;this.attack.dispose();this.attack=null;this.release.dispose();this.release=null;this.threshold.dispose();this.threshold=null;this.ratio.dispose();this.ratio=null;this.knee.dispose();this.knee=null;return this;};return Tone.Compressor;});Module(function(Tone){/**
		 *  @class Add a signal and a number or two signals. When no value is
		 *         passed into the constructor, Tone.Add will sum <code>input[0]</code>
		 *         and <code>input[1]</code>. If a value is passed into the constructor, 
		 *         the it will be added to the input.
		 *  
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number=} value If no value is provided, Tone.Add will sum the first
		 *                         and second inputs. 
		 *  @example
		 * var signal = new Tone.Signal(2);
		 * var add = new Tone.Add(2);
		 * signal.connect(add);
		 * //the output of add equals 4
		 *  @example
		 * //if constructed with no arguments
		 * //it will add the first and second inputs
		 * var add = new Tone.Add();
		 * var sig0 = new Tone.Signal(3).connect(add, 0, 0);
		 * var sig1 = new Tone.Signal(4).connect(add, 0, 1);
		 * //the output of add equals 7. 
		 */Tone.Add=function(value){Tone.Signal.call(this);this.createInsOuts(2,0);/**
			 *  the summing node
			 *  @type {GainNode}
			 *  @private
			 */this._sum=this.input[0]=this.input[1]=this.output=new Tone.Gain();/**
			 *  @private
			 *  @type {Tone.Signal}
			 */this._param=this.input[1]=new Tone.Signal(value);this._param.connect(this._sum);};Tone.extend(Tone.Add,Tone.Signal);/**
		 *  Clean up.
		 *  @returns {Tone.Add} this
		 */Tone.Add.prototype.dispose=function(){Tone.Signal.prototype.dispose.call(this);this._sum.dispose();this._sum=null;return this;};return Tone.Add;});Module(function(Tone){/**
		 *  @class  Multiply two incoming signals. Or, if a number is given in the constructor,
		 *          multiplies the incoming signal by that value.
		 *
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number=} value Constant value to multiple. If no value is provided,
		 *                         it will return the product of the first and second inputs
		 *  @example
		 * var mult = new Tone.Multiply();
		 * var sigA = new Tone.Signal(3);
		 * var sigB = new Tone.Signal(4);
		 * sigA.connect(mult, 0, 0);
		 * sigB.connect(mult, 0, 1);
		 * //output of mult is 12.
		 *  @example
		 * var mult = new Tone.Multiply(10);
		 * var sig = new Tone.Signal(2).connect(mult);
		 * //the output of mult is 20.
		 */Tone.Multiply=function(value){Tone.Signal.call(this);this.createInsOuts(2,0);/**
			 *  the input node is the same as the output node
			 *  it is also the GainNode which handles the scaling of incoming signal
			 *
			 *  @type {GainNode}
			 *  @private
			 */this._mult=this.input[0]=this.output=new Tone.Gain();/**
			 *  the scaling parameter
			 *  @type {AudioParam}
			 *  @private
			 */this._param=this.input[1]=this.output.gain;this.value=Tone.defaultArg(value,0);};Tone.extend(Tone.Multiply,Tone.Signal);/**
		 *  clean up
		 *  @returns {Tone.Multiply} this
		 */Tone.Multiply.prototype.dispose=function(){Tone.Signal.prototype.dispose.call(this);this._mult.dispose();this._mult=null;this._param=null;return this;};return Tone.Multiply;});Module(function(Tone){/**
		 *  @class Negate the incoming signal. i.e. an input signal of 10 will output -10
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 * var neg = new Tone.Negate();
		 * var sig = new Tone.Signal(-2).connect(neg);
		 * //output of neg is positive 2. 
		 */Tone.Negate=function(){Tone.SignalBase.call(this);/**
			 *  negation is done by multiplying by -1
			 *  @type {Tone.Multiply}
			 *  @private
			 */this._multiply=this.input=this.output=new Tone.Multiply(-1);};Tone.extend(Tone.Negate,Tone.SignalBase);/**
		 *  clean up
		 *  @returns {Tone.Negate} this
		 */Tone.Negate.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._multiply.dispose();this._multiply=null;return this;};return Tone.Negate;});Module(function(Tone){/**
		 *  @class Subtract the signal connected to <code>input[1]</code> from the signal connected 
		 *         to <code>input[0]</code>. If an argument is provided in the constructor, the 
		 *         signals <code>.value</code> will be subtracted from the incoming signal.
		 *
		 *  @extends {Tone.Signal}
		 *  @constructor
		 *  @param {number=} value The value to subtract from the incoming signal. If the value
		 *                         is omitted, it will subtract the second signal from the first.
		 *  @example
		 * var sub = new Tone.Subtract(1);
		 * var sig = new Tone.Signal(4).connect(sub);
		 * //the output of sub is 3. 
		 *  @example
		 * var sub = new Tone.Subtract();
		 * var sigA = new Tone.Signal(10);
		 * var sigB = new Tone.Signal(2.5);
		 * sigA.connect(sub, 0, 0);
		 * sigB.connect(sub, 0, 1);
		 * //output of sub is 7.5
		 */Tone.Subtract=function(value){Tone.Signal.call(this);this.createInsOuts(2,0);/**
			 *  the summing node
			 *  @type {GainNode}
			 *  @private
			 */this._sum=this.input[0]=this.output=new Tone.Gain();/**
			 *  negate the input of the second input before connecting it
			 *  to the summing node.
			 *  @type {Tone.Negate}
			 *  @private
			 */this._neg=new Tone.Negate();/**
			 *  the node where the value is set
			 *  @private
			 *  @type {Tone.Signal}
			 */this._param=this.input[1]=new Tone.Signal(value);this._param.chain(this._neg,this._sum);};Tone.extend(Tone.Subtract,Tone.Signal);/**
		 *  Clean up.
		 *  @returns {Tone.SignalBase} this
		 */Tone.Subtract.prototype.dispose=function(){Tone.Signal.prototype.dispose.call(this);this._neg.dispose();this._neg=null;this._sum.disconnect();this._sum=null;return this;};return Tone.Subtract;});Module(function(Tone){/**
		 *  @class Convert an incoming signal between 0, 1 to an equal power gain scale.
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 * var eqPowGain = new Tone.EqualPowerGain();
		 */Tone.EqualPowerGain=function(){Tone.SignalBase.call(this);/**
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */this._eqPower=this.input=this.output=new Tone.WaveShaper(function(val){if(Math.abs(val)<0.001){//should output 0 when input is 0
return 0;}else{return Tone.equalPowerScale(val);}}.bind(this),4096);};Tone.extend(Tone.EqualPowerGain,Tone.SignalBase);/**
		 *  clean up
		 *  @returns {Tone.EqualPowerGain} this
		 */Tone.EqualPowerGain.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._eqPower.dispose();this._eqPower=null;return this;};return Tone.EqualPowerGain;});Module(function(Tone){/**
		 * @class  Tone.Crossfade provides equal power fading between two inputs.
		 *         More on crossfading technique [here](https://en.wikipedia.org/wiki/Fade_(audio_engineering)#Crossfading).
		 *
		 * @constructor
		 * @extends {Tone.AudioNode}
		 * @param {NormalRange} [initialFade=0.5]
		 * @example
		 * var crossFade = new Tone.CrossFade(0.5);
		 * //connect effect A to crossfade from
		 * //effect output 0 to crossfade input 0
		 * effectA.connect(crossFade, 0, 0);
		 * //connect effect B to crossfade from
		 * //effect output 0 to crossfade input 1
		 * effectB.connect(crossFade, 0, 1);
		 * crossFade.fade.value = 0;
		 * // ^ only effectA is output
		 * crossFade.fade.value = 1;
		 * // ^ only effectB is output
		 * crossFade.fade.value = 0.5;
		 * // ^ the two signals are mixed equally.
		 */Tone.CrossFade=function(initialFade){Tone.AudioNode.call(this);this.createInsOuts(2,1);/**
			 *  Alias for <code>input[0]</code>.
			 *  @type {Tone.Gain}
			 */this.a=this.input[0]=new Tone.Gain();/**
			 *  Alias for <code>input[1]</code>.
			 *  @type {Tone.Gain}
			 */this.b=this.input[1]=new Tone.Gain();/**
			 * 	The mix between the two inputs. A fade value of 0
			 * 	will output 100% <code>input[0]</code> and
			 * 	a value of 1 will output 100% <code>input[1]</code>.
			 *  @type {NormalRange}
			 *  @signal
			 */this.fade=new Tone.Signal(Tone.defaultArg(initialFade,0.5),Tone.Type.NormalRange);/**
			 *  equal power gain cross fade
			 *  @private
			 *  @type {Tone.EqualPowerGain}
			 */this._equalPowerA=new Tone.EqualPowerGain();/**
			 *  equal power gain cross fade
			 *  @private
			 *  @type {Tone.EqualPowerGain}
			 */this._equalPowerB=new Tone.EqualPowerGain();/**
			 *  invert the incoming signal
			 *  @private
			 *  @type {Tone}
			 */this._one=this.context.getConstant(1);/**
			 *  invert the incoming signal
			 *  @private
			 *  @type {Tone.Subtract}
			 */this._invert=new Tone.Subtract();//connections
this.a.connect(this.output);this.b.connect(this.output);this.fade.chain(this._equalPowerB,this.b.gain);this._one.connect(this._invert,0,0);this.fade.connect(this._invert,0,1);this._invert.chain(this._equalPowerA,this.a.gain);this._readOnly('fade');};Tone.extend(Tone.CrossFade,Tone.AudioNode);/**
		 *  clean up
		 *  @returns {Tone.CrossFade} this
		 */Tone.CrossFade.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._writable('fade');this._equalPowerA.dispose();this._equalPowerA=null;this._equalPowerB.dispose();this._equalPowerB=null;this.fade.dispose();this.fade=null;this._invert.dispose();this._invert=null;this._one=null;this.a.dispose();this.a=null;this.b.dispose();this.b=null;return this;};return Tone.CrossFade;});Module(function(Tone){/**
		 *  @class  Tone.Filter is a filter which allows for all of the same native methods
		 *          as the [BiquadFilterNode](http://webaudio.github.io/web-audio-api/#the-biquadfilternode-interface).
		 *          Tone.Filter has the added ability to set the filter rolloff at -12
		 *          (default), -24 and -48.
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @param {Frequency|Object} [frequency] The cutoff frequency of the filter.
		 *  @param {string=} type The type of filter.
		 *  @param {number=} rolloff The drop in decibels per octave after the cutoff frequency.
		 *                            3 choices: -12, -24, and -48
		 *  @example
		 *  var filter = new Tone.Filter(200, "highpass");
		 */Tone.Filter=function(){var options=Tone.defaults(arguments,['frequency','type','rolloff'],Tone.Filter);Tone.AudioNode.call(this);this.createInsOuts(1,1);/**
			 *  the filter(s)
			 *  @type {Array}
			 *  @private
			 */this._filters=[];/**
			 *  The cutoff frequency of the filter.
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=new Tone.Signal(options.frequency,Tone.Type.Frequency);/**
			 *  The detune parameter
			 *  @type {Cents}
			 *  @signal
			 */this.detune=new Tone.Signal(0,Tone.Type.Cents);/**
			 *  The gain of the filter, only used in certain filter types
			 *  @type {Number}
			 *  @signal
			 */this.gain=new Tone.Signal({'value':options.gain,'convert':false});/**
			 *  The Q or Quality of the filter
			 *  @type {Positive}
			 *  @signal
			 */this.Q=new Tone.Signal(options.Q);/**
			 *  the type of the filter
			 *  @type {string}
			 *  @private
			 */this._type=options.type;/**
			 *  the rolloff value of the filter
			 *  @type {number}
			 *  @private
			 */this._rolloff=options.rolloff;//set the rolloff;
this.rolloff=options.rolloff;this._readOnly(['detune','frequency','gain','Q']);};Tone.extend(Tone.Filter,Tone.AudioNode);/**
		 *  the default parameters
		 *
		 *  @static
		 *  @type {Object}
		 */Tone.Filter.defaults={'type':'lowpass','frequency':350,'rolloff':-12,'Q':1,'gain':0};/**
		 * The type of the filter. Types: "lowpass", "highpass",
		 * "bandpass", "lowshelf", "highshelf", "notch", "allpass", or "peaking".
		 * @memberOf Tone.Filter#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.Filter.prototype,'type',{get:function get(){return this._type;},set:function set(type){var types=['lowpass','highpass','bandpass','lowshelf','highshelf','notch','allpass','peaking'];if(types.indexOf(type)===-1){throw new TypeError('Tone.Filter: invalid type '+type);}this._type=type;for(var i=0;i<this._filters.length;i++){this._filters[i].type=type;}}});/**
		 * The rolloff of the filter which is the drop in db
		 * per octave. Implemented internally by cascading filters.
		 * Only accepts the values -12, -24, -48 and -96.
		 * @memberOf Tone.Filter#
		 * @type {number}
		 * @name rolloff
		 */Object.defineProperty(Tone.Filter.prototype,'rolloff',{get:function get(){return this._rolloff;},set:function set(rolloff){rolloff=parseInt(rolloff,10);var possibilities=[-12,-24,-48,-96];var cascadingCount=possibilities.indexOf(rolloff);//check the rolloff is valid
if(cascadingCount===-1){throw new RangeError('Tone.Filter: rolloff can only be -12, -24, -48 or -96');}cascadingCount+=1;this._rolloff=rolloff;//first disconnect the filters and throw them away
this.input.disconnect();for(var i=0;i<this._filters.length;i++){this._filters[i].disconnect();this._filters[i]=null;}this._filters=new Array(cascadingCount);for(var count=0;count<cascadingCount;count++){var filter=this.context.createBiquadFilter();filter.type=this._type;this.frequency.connect(filter.frequency);this.detune.connect(filter.detune);this.Q.connect(filter.Q);this.gain.connect(filter.gain);this._filters[count]=filter;}//connect them up
var connectionChain=[this.input].concat(this._filters).concat([this.output]);Tone.connectSeries.apply(Tone,connectionChain);}});/**
		 *  Clean up.
		 *  @return {Tone.Filter} this
		 */Tone.Filter.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);for(var i=0;i<this._filters.length;i++){this._filters[i].disconnect();this._filters[i]=null;}this._filters=null;this._writable(['detune','frequency','gain','Q']);this.frequency.dispose();this.Q.dispose();this.frequency=null;this.Q=null;this.detune.dispose();this.detune=null;this.gain.dispose();this.gain=null;return this;};return Tone.Filter;});Module(function(Tone){/**
		 *  @class Split the incoming signal into three bands (low, mid, high)
		 *         with two crossover frequency controls.
		 *
		 *  @extends {Tone.AudioNode}
		 *  @constructor
		 *  @param {Frequency|Object} [lowFrequency] the low/mid crossover frequency
		 *  @param {Frequency} [highFrequency] the mid/high crossover frequency
		 */Tone.MultibandSplit=function(){var options=Tone.defaults(arguments,['lowFrequency','highFrequency'],Tone.MultibandSplit);Tone.AudioNode.call(this);/**
			 *  the input
			 *  @type {Tone.Gain}
			 *  @private
			 */this.input=new Tone.Gain();/**
			 *  the outputs
			 *  @type {Array}
			 *  @private
			 */this.output=new Array(3);/**
			 *  The low band. Alias for <code>output[0]</code>
			 *  @type {Tone.Filter}
			 */this.low=this.output[0]=new Tone.Filter(0,'lowpass');/**
			 *  the lower filter of the mid band
			 *  @type {Tone.Filter}
			 *  @private
			 */this._lowMidFilter=new Tone.Filter(0,'highpass');/**
			 *  The mid band output. Alias for <code>output[1]</code>
			 *  @type {Tone.Filter}
			 */this.mid=this.output[1]=new Tone.Filter(0,'lowpass');/**
			 *  The high band output. Alias for <code>output[2]</code>
			 *  @type {Tone.Filter}
			 */this.high=this.output[2]=new Tone.Filter(0,'highpass');/**
			 *  The low/mid crossover frequency.
			 *  @type {Frequency}
			 *  @signal
			 */this.lowFrequency=new Tone.Signal(options.lowFrequency,Tone.Type.Frequency);/**
			 *  The mid/high crossover frequency.
			 *  @type {Frequency}
			 *  @signal
			 */this.highFrequency=new Tone.Signal(options.highFrequency,Tone.Type.Frequency);/**
			 *  The quality of all the filters
			 *  @type {Number}
			 *  @signal
			 */this.Q=new Tone.Signal(options.Q);this.input.fan(this.low,this.high);this.input.chain(this._lowMidFilter,this.mid);//the frequency control signal
this.lowFrequency.connect(this.low.frequency);this.lowFrequency.connect(this._lowMidFilter.frequency);this.highFrequency.connect(this.mid.frequency);this.highFrequency.connect(this.high.frequency);//the Q value
this.Q.connect(this.low.Q);this.Q.connect(this._lowMidFilter.Q);this.Q.connect(this.mid.Q);this.Q.connect(this.high.Q);this._readOnly(['high','mid','low','highFrequency','lowFrequency']);};Tone.extend(Tone.MultibandSplit,Tone.AudioNode);/**
		 *  @private
		 *  @static
		 *  @type {Object}
		 */Tone.MultibandSplit.defaults={'lowFrequency':400,'highFrequency':2500,'Q':1};/**
		 *  Clean up.
		 *  @returns {Tone.MultibandSplit} this
		 */Tone.MultibandSplit.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._writable(['high','mid','low','highFrequency','lowFrequency']);this.low.dispose();this.low=null;this._lowMidFilter.dispose();this._lowMidFilter=null;this.mid.dispose();this.mid=null;this.high.dispose();this.high=null;this.lowFrequency.dispose();this.lowFrequency=null;this.highFrequency.dispose();this.highFrequency=null;this.Q.dispose();this.Q=null;return this;};return Tone.MultibandSplit;});Module(function(Tone){/**
		 *  @class Tone.EQ3 is a three band EQ with control over low, mid, and high gain as
		 *         well as the low and high crossover frequencies.
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *
		 *  @param {Decibels|Object} [lowLevel] The gain applied to the lows.
		 *  @param {Decibels} [midLevel] The gain applied to the mid.
		 *  @param {Decibels} [highLevel] The gain applied to the high.
		 *  @example
		 * var eq = new Tone.EQ3(-10, 3, -20);
		 */Tone.EQ3=function(){var options=Tone.defaults(arguments,['low','mid','high'],Tone.EQ3);Tone.AudioNode.call(this);/**
			 *  the output node
			 *  @type {GainNode}
			 *  @private
			 */this.output=new Tone.Gain();/**
			 *  the multiband split
			 *  @type {Tone.MultibandSplit}
			 *  @private
			 */this._multibandSplit=this.input=new Tone.MultibandSplit({'lowFrequency':options.lowFrequency,'highFrequency':options.highFrequency});/**
			 *  The gain for the lower signals
			 *  @type  {Tone.Gain}
			 *  @private
			 */this._lowGain=new Tone.Gain(options.low,Tone.Type.Decibels);/**
			 *  The gain for the mid signals
			 *  @type  {Tone.Gain}
			 *  @private
			 */this._midGain=new Tone.Gain(options.mid,Tone.Type.Decibels);/**
			 * The gain in decibels of the high part
			 * @type {Tone.Gain}
			 * @private
			 */this._highGain=new Tone.Gain(options.high,Tone.Type.Decibels);/**
			 * The gain in decibels of the low part
			 * @type {Decibels}
			 * @signal
			 */this.low=this._lowGain.gain;/**
			 * The gain in decibels of the mid part
			 * @type {Decibels}
			 * @signal
			 */this.mid=this._midGain.gain;/**
			 * The gain in decibels of the high part
			 * @type {Decibels}
			 * @signal
			 */this.high=this._highGain.gain;/**
			 *  The Q value for all of the filters.
			 *  @type {Positive}
			 *  @signal
			 */this.Q=this._multibandSplit.Q;/**
			 *  The low/mid crossover frequency.
			 *  @type {Frequency}
			 *  @signal
			 */this.lowFrequency=this._multibandSplit.lowFrequency;/**
			 *  The mid/high crossover frequency.
			 *  @type {Frequency}
			 *  @signal
			 */this.highFrequency=this._multibandSplit.highFrequency;//the frequency bands
this._multibandSplit.low.chain(this._lowGain,this.output);this._multibandSplit.mid.chain(this._midGain,this.output);this._multibandSplit.high.chain(this._highGain,this.output);this._readOnly(['low','mid','high','lowFrequency','highFrequency']);};Tone.extend(Tone.EQ3,Tone.AudioNode);/**
		 *  the default values
		 */Tone.EQ3.defaults={'low':0,'mid':0,'high':0,'lowFrequency':400,'highFrequency':2500};/**
		 *  clean up
		 *  @returns {Tone.EQ3} this
		 */Tone.EQ3.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._writable(['low','mid','high','lowFrequency','highFrequency']);this._multibandSplit.dispose();this._multibandSplit=null;this.lowFrequency=null;this.highFrequency=null;this._lowGain.dispose();this._lowGain=null;this._midGain.dispose();this._midGain=null;this._highGain.dispose();this._highGain=null;this.low=null;this.mid=null;this.high=null;this.Q=null;return this;};return Tone.EQ3;});Module(function(Tone){/**
		 *  @class  Performs a linear scaling on an input signal.
		 *          Scales a NormalRange input to between
		 *          outputMin and outputMax.
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} [outputMin=0] The output value when the input is 0. 
		 *  @param {number} [outputMax=1]	The output value when the input is 1. 
		 *  @example
		 * var scale = new Tone.Scale(50, 100);
		 * var signal = new Tone.Signal(0.5).connect(scale);
		 * //the output of scale equals 75
		 */Tone.Scale=function(outputMin,outputMax){Tone.SignalBase.call(this);/** 
			 *  @private
			 *  @type {number}
			 */this._outputMin=Tone.defaultArg(outputMin,0);/** 
			 *  @private
			 *  @type {number}
			 */this._outputMax=Tone.defaultArg(outputMax,1);/** 
			 *  @private
			 *  @type {Tone.Multiply}
			 *  @private
			 */this._scale=this.input=new Tone.Multiply(1);/** 
			 *  @private
			 *  @type {Tone.Add}
			 *  @private
			 */this._add=this.output=new Tone.Add(0);this._scale.connect(this._add);this._setRange();};Tone.extend(Tone.Scale,Tone.SignalBase);/**
		 * The minimum output value. This number is output when 
		 * the value input value is 0. 
		 * @memberOf Tone.Scale#
		 * @type {number}
		 * @name min
		 */Object.defineProperty(Tone.Scale.prototype,'min',{get:function get(){return this._outputMin;},set:function set(min){this._outputMin=min;this._setRange();}});/**
		 * The maximum output value. This number is output when 
		 * the value input value is 1. 
		 * @memberOf Tone.Scale#
		 * @type {number}
		 * @name max
		 */Object.defineProperty(Tone.Scale.prototype,'max',{get:function get(){return this._outputMax;},set:function set(max){this._outputMax=max;this._setRange();}});/**
		 *  set the values
		 *  @private
		 */Tone.Scale.prototype._setRange=function(){this._add.value=this._outputMin;this._scale.value=this._outputMax-this._outputMin;};/**
		 *  Clean up.
		 *  @returns {Tone.Scale} this
		 */Tone.Scale.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._add.dispose();this._add=null;this._scale.dispose();this._scale=null;return this;};return Tone.Scale;});Module(function(Tone){/**
		 *  @class  Performs an exponential scaling on an input signal.
		 *          Scales a NormalRange value [0,1] exponentially
		 *          to the output range of outputMin to outputMax.
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {number} [outputMin=0] The output value when the input is 0.
		 *  @param {number} [outputMax=1]	The output value when the input is 1.
		 *  @param {number} [exponent=2] The exponent which scales the incoming signal.
		 *  @example
		 * var scaleExp = new Tone.ScaleExp(0, 100, 2);
		 * var signal = new Tone.Signal(0.5).connect(scaleExp);
		 */Tone.ScaleExp=function(outputMin,outputMax,exponent){Tone.SignalBase.call(this);/**
			 *  scale the input to the output range
			 *  @type {Tone.Scale}
			 *  @private
			 */this._scale=this.output=new Tone.Scale(outputMin,outputMax);/**
			 *  @private
			 *  @type {Tone.Pow}
			 *  @private
			 */this._exp=this.input=new Tone.Pow(Tone.defaultArg(exponent,2));this._exp.connect(this._scale);};Tone.extend(Tone.ScaleExp,Tone.SignalBase);/**
		 * Instead of interpolating linearly between the <code>min</code> and
		 * <code>max</code> values, setting the exponent will interpolate between
		 * the two values with an exponential curve.
		 * @memberOf Tone.ScaleExp#
		 * @type {number}
		 * @name exponent
		 */Object.defineProperty(Tone.ScaleExp.prototype,'exponent',{get:function get(){return this._exp.value;},set:function set(exp){this._exp.value=exp;}});/**
		 * The minimum output value. This number is output when
		 * the value input value is 0.
		 * @memberOf Tone.ScaleExp#
		 * @type {number}
		 * @name min
		 */Object.defineProperty(Tone.ScaleExp.prototype,'min',{get:function get(){return this._scale.min;},set:function set(min){this._scale.min=min;}});/**
		 * The maximum output value. This number is output when
		 * the value input value is 1.
		 * @memberOf Tone.ScaleExp#
		 * @type {number}
		 * @name max
		 */Object.defineProperty(Tone.ScaleExp.prototype,'max',{get:function get(){return this._scale.max;},set:function set(max){this._scale.max=max;}});/**
		 *  Clean up.
		 *  @returns {Tone.ScaleExp} this
		 */Tone.ScaleExp.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._scale.dispose();this._scale=null;this._exp.dispose();this._exp=null;return this;};return Tone.ScaleExp;});Module(function(Tone){/**
		 *  @class Wrapper around Web Audio's native [DelayNode](http://webaudio.github.io/web-audio-api/#the-delaynode-interface).
		 *  @extends {Tone}
		 *  @param {Time=} delayTime The delay applied to the incoming signal.
		 *  @param {Time=} maxDelay The maximum delay time.
		 */Tone.Delay=function(){var options=Tone.defaults(arguments,['delayTime','maxDelay'],Tone.Delay);Tone.AudioNode.call(this);/**
			 * The maximum delay time initialized with the node
			 * @type {Number}
			 * @private
			 */this._maxDelay=Math.max(this.toSeconds(options.maxDelay),this.toSeconds(options.delayTime));/**
			 *  The native delay node
			 *  @type {DelayNode}
			 *  @private
			 */this._delayNode=this.input=this.output=this.context.createDelay(this._maxDelay);/**
			 *  The amount of time the incoming signal is
			 *  delayed.
			 *  @type {Time}
			 *  @signal
			 */this.delayTime=new Tone.Param({'param':this._delayNode.delayTime,'units':Tone.Type.Time,'value':options.delayTime});this._readOnly('delayTime');};Tone.extend(Tone.Delay,Tone.AudioNode);/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */Tone.Delay.defaults={'maxDelay':1,'delayTime':0};/**
		 * The maximum delay time. This cannot be changed. The value is passed into the constructor.
		 * @memberof Tone.Delay#
		 * @type {Time}
		 * @name maxDelay
		 * @readOnly
		 */Object.defineProperty(Tone.Delay.prototype,'maxDelay',{get:function get(){return this._maxDelay;}});/**
		 *  Clean up.
		 *  @return  {Tone.Delay}  this
		 */Tone.Delay.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._delayNode.disconnect();this._delayNode=null;this._writable('delayTime');this.delayTime=null;return this;};return Tone.Delay;});Module(function(Tone){/**
		 *  @class Comb filters are basic building blocks for physical modeling. Read more
		 *         about comb filters on [CCRMA's website](https://ccrma.stanford.edu/~jos/pasp/Feedback_Comb_Filters.html).
		 *
		 *  @extends {Tone.AudioNode}
		 *  @constructor
		 *  @param {Time|Object} [delayTime] The delay time of the filter.
		 *  @param {NormalRange=} resonance The amount of feedback the filter has.
		 */Tone.FeedbackCombFilter=function(){var options=Tone.defaults(arguments,['delayTime','resonance'],Tone.FeedbackCombFilter);Tone.AudioNode.call(this);/**
			 *  the delay node
			 *  @type {DelayNode}
			 *  @private
			 */this._delay=this.input=this.output=new Tone.Delay(options.delayTime);/**
			 *  The amount of delay of the comb filter.
			 *  @type {Time}
			 *  @signal
			 */this.delayTime=this._delay.delayTime;/**
			 *  the feedback node
			 *  @type {GainNode}
			 *  @private
			 */this._feedback=new Tone.Gain(options.resonance,Tone.Type.NormalRange);/**
			 *  The amount of feedback of the delayed signal.
			 *  @type {NormalRange}
			 *  @signal
			 */this.resonance=this._feedback.gain;this._delay.chain(this._feedback,this._delay);this._readOnly(['resonance','delayTime']);};Tone.extend(Tone.FeedbackCombFilter,Tone.AudioNode);/**
		 *  the default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.FeedbackCombFilter.defaults={'delayTime':0.1,'resonance':0.5};/**
		 *  clean up
		 *  @returns {Tone.FeedbackCombFilter} this
		 */Tone.FeedbackCombFilter.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._writable(['resonance','delayTime']);this._delay.dispose();this._delay=null;this.delayTime=null;this._feedback.dispose();this._feedback=null;this.resonance=null;return this;};return Tone.FeedbackCombFilter;});Module(function(Tone){/**
		 *  @class  Get the current waveform data of the connected audio source.
		 *  @extends {Tone.AudioNode}
		 *  @param {Number=} size The size of the FFT. Value must be a power of
		 *                       two in the range 32 to 32768.
		 */Tone.FFT=function(){var options=Tone.defaults(arguments,['size'],Tone.FFT);options.type=Tone.Analyser.Type.FFT;Tone.AudioNode.call(this);/**
			 *  The analyser node.
			 *  @private
			 *  @type {Tone.Analyser}
			 */this._analyser=this.input=this.output=new Tone.Analyser(options);};Tone.extend(Tone.FFT,Tone.AudioNode);/**
		 *  The default values.
		 *  @type {Object}
		 *  @const
		 */Tone.FFT.defaults={'size':1024};/**
		 *  Gets the waveform of the audio source. Returns the waveform data
		 *  of length [size](#size) as a Float32Array with values between -1 and 1.
		 *  @returns {TypedArray}
		 */Tone.FFT.prototype.getValue=function(){return this._analyser.getValue();};/**
		 *  The size of analysis. This must be a power of two in the range 32 to 32768.
		 *  @memberOf Tone.FFT#
		 *  @type {Number}
		 *  @name size
		 */Object.defineProperty(Tone.FFT.prototype,'size',{get:function get(){return this._analyser.size;},set:function set(size){this._analyser.size=size;}});/**
		 *  Clean up.
		 *  @return  {Tone.FFT}  this
		 */Tone.FFT.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._analyser.dispose();this._analyser=null;};return Tone.FFT;});Module(function(Tone){/**
		 *  @class Return the absolute value of an incoming signal.
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 * var signal = new Tone.Signal(-1);
		 * var abs = new Tone.Abs();
		 * signal.connect(abs);
		 * //the output of abs is 1.
		 */Tone.Abs=function(){Tone.SignalBase.call(this);/**
			 *  @type {Tone.LessThan}
			 *  @private
			 */this._abs=this.input=this.output=new Tone.WaveShaper(function(val){if(Math.abs(val)<0.001){return 0;}else{return Math.abs(val);}},1024);};Tone.extend(Tone.Abs,Tone.SignalBase);/**
		 *  dispose method
		 *  @returns {Tone.Abs} this
		 */Tone.Abs.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._abs.dispose();this._abs=null;return this;};return Tone.Abs;});Module(function(Tone){/**
		 *  @class  Tone.Follower is a  crude envelope follower which will follow
		 *          the amplitude of an incoming signal.
		 *          Take care with small (< 0.02) attack or decay values
		 *          as follower has some ripple which is exaggerated
		 *          at these values. Read more about envelope followers (also known
		 *          as envelope detectors) on [Wikipedia](https://en.wikipedia.org/wiki/Envelope_detector).
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @param {Time|Object} [attack] The rate at which the follower rises.
		 *  @param {Time=} release The rate at which the folower falls.
		 *  @example
		 * var follower = new Tone.Follower(0.2, 0.4);
		 */Tone.Follower=function(){var options=Tone.defaults(arguments,['attack','release'],Tone.Follower);Tone.AudioNode.call(this);this.createInsOuts(1,1);/**
			 *  @type {Tone.Abs}
			 *  @private
			 */this._abs=new Tone.Abs();/**
			 *  the lowpass filter which smooths the input
			 *  @type {BiquadFilterNode}
			 *  @private
			 */this._filter=this.context.createBiquadFilter();this._filter.type='lowpass';this._filter.frequency.value=0;this._filter.Q.value=-100;/**
			 *  @type {WaveShaperNode}
			 *  @private
			 */this._frequencyValues=new Tone.WaveShaper();/**
			 *  @type {Tone.Subtract}
			 *  @private
			 */this._sub=new Tone.Subtract();/**
			 *  @type {Tone.Delay}
			 *  @private
			 */this._delay=new Tone.Delay(this.blockTime);/**
			 *  this keeps it far from 0, even for very small differences
			 *  @type {Tone.Multiply}
			 *  @private
			 */this._mult=new Tone.Multiply(10000);/**
			 *  @private
			 *  @type {number}
			 */this._attack=options.attack;/**
			 *  @private
			 *  @type {number}
			 */this._release=options.release;//the smoothed signal to get the values
this.input.chain(this._abs,this._filter,this.output);//the difference path
this._abs.connect(this._sub,0,1);this._filter.chain(this._delay,this._sub);//threshold the difference and use the thresh to set the frequency
this._sub.chain(this._mult,this._frequencyValues,this._filter.frequency);//set the attack and release values in the table
this._setAttackRelease(this._attack,this._release);};Tone.extend(Tone.Follower,Tone.AudioNode);/**
		 *  @static
		 *  @type {Object}
		 */Tone.Follower.defaults={'attack':0.05,'release':0.5};/**
		 *  sets the attack and release times in the wave shaper
		 *  @param   {Time} attack
		 *  @param   {Time} release
		 *  @private
		 */Tone.Follower.prototype._setAttackRelease=function(attack,release){var minTime=this.blockTime;attack=Tone.Time(attack).toFrequency();release=Tone.Time(release).toFrequency();attack=Math.max(attack,minTime);release=Math.max(release,minTime);this._frequencyValues.setMap(function(val){if(val<=0){return attack;}else{return release;}});};/**
		 * The attack time.
		 * @memberOf Tone.Follower#
		 * @type {Time}
		 * @name attack
		 */Object.defineProperty(Tone.Follower.prototype,'attack',{get:function get(){return this._attack;},set:function set(attack){this._attack=attack;this._setAttackRelease(this._attack,this._release);}});/**
		 * The release time.
		 * @memberOf Tone.Follower#
		 * @type {Time}
		 * @name release
		 */Object.defineProperty(Tone.Follower.prototype,'release',{get:function get(){return this._release;},set:function set(release){this._release=release;this._setAttackRelease(this._attack,this._release);}});/**
		 *  Borrows the connect method from Signal so that the output can be used
		 *  as a Tone.Signal control signal.
		 *  @function
		 */Tone.Follower.prototype.connect=Tone.SignalBase.prototype.connect;/**
		 *  dispose
		 *  @returns {Tone.Follower} this
		 */Tone.Follower.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._filter.disconnect();this._filter=null;this._frequencyValues.disconnect();this._frequencyValues=null;this._delay.dispose();this._delay=null;this._sub.disconnect();this._sub=null;this._abs.dispose();this._abs=null;this._mult.dispose();this._mult=null;this._curve=null;return this;};return Tone.Follower;});Module(function(Tone){/**
		 *  @class Tone.ScaledEnvelop is an envelope which can be scaled
		 *         to any range. It's useful for applying an envelope
		 *         to a frequency or any other non-NormalRange signal
		 *         parameter.
		 *
		 *  @extends {Tone.Envelope}
		 *  @constructor
		 *  @param {Time|Object} [attack]	the attack time in seconds
		 *  @param {Time} [decay]	the decay time in seconds
		 *  @param {number} [sustain] 	a percentage (0-1) of the full amplitude
		 *  @param {Time} [release]	the release time in seconds
		 *  @example
		 *  var scaledEnv = new Tone.ScaledEnvelope({
		 *  	"attack" : 0.2,
		 *  	"min" : 200,
		 *  	"max" : 2000
		 *  });
		 *  scaledEnv.connect(oscillator.frequency);
		 */Tone.ScaledEnvelope=function(){//get all of the defaults
var options=Tone.defaults(arguments,['attack','decay','sustain','release'],Tone.Envelope);Tone.Envelope.call(this,options);options=Tone.defaultArg(options,Tone.ScaledEnvelope.defaults);/**
			 *  scale the incoming signal by an exponent
			 *  @type {Tone.Pow}
			 *  @private
			 */this._exp=this.output=new Tone.Pow(options.exponent);/**
			 *  scale the signal to the desired range
			 *  @type {Tone.Multiply}
			 *  @private
			 */this._scale=this.output=new Tone.Scale(options.min,options.max);this._sig.chain(this._exp,this._scale);};Tone.extend(Tone.ScaledEnvelope,Tone.Envelope);/**
		 *  the default parameters
		 *  @static
		 */Tone.ScaledEnvelope.defaults={'min':0,'max':1,'exponent':1};/**
		 * The envelope's min output value. This is the value which it
		 * starts at.
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name min
		 */Object.defineProperty(Tone.ScaledEnvelope.prototype,'min',{get:function get(){return this._scale.min;},set:function set(min){this._scale.min=min;}});/**
		 * The envelope's max output value. In other words, the value
		 * at the peak of the attack portion of the envelope.
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name max
		 */Object.defineProperty(Tone.ScaledEnvelope.prototype,'max',{get:function get(){return this._scale.max;},set:function set(max){this._scale.max=max;}});/**
		 * The envelope's exponent value.
		 * @memberOf Tone.ScaledEnvelope#
		 * @type {number}
		 * @name exponent
		 */Object.defineProperty(Tone.ScaledEnvelope.prototype,'exponent',{get:function get(){return this._exp.value;},set:function set(exp){this._exp.value=exp;}});/**
		 *  clean up
		 *  @returns {Tone.ScaledEnvelope} this
		 */Tone.ScaledEnvelope.prototype.dispose=function(){Tone.Envelope.prototype.dispose.call(this);this._scale.dispose();this._scale=null;this._exp.dispose();this._exp=null;return this;};return Tone.ScaledEnvelope;});Module(function(Tone){/**
		 *  @class Tone.FrequencyEnvelope is a Tone.ScaledEnvelope, but instead of `min` and `max`
		 *         it's got a `baseFrequency` and `octaves` parameter.
		 *
		 *  @extends {Tone.Envelope}
		 *  @constructor
		 *  @param {Time|Object} [attack]	the attack time in seconds
		 *  @param {Time} [decay]	the decay time in seconds
		 *  @param {number} [sustain] 	a percentage (0-1) of the full amplitude
		 *  @param {Time} [release]	the release time in seconds
		 *  @example
		 *  var freqEnv = new Tone.FrequencyEnvelope({
		 *  	"attack" : 0.2,
		 *  	"baseFrequency" : "C2",
		 *  	"octaves" : 4
		 *  });
		 *  freqEnv.connect(oscillator.frequency);
		 */Tone.FrequencyEnvelope=function(){var options=Tone.defaults(arguments,['attack','decay','sustain','release'],Tone.Envelope);Tone.ScaledEnvelope.call(this,options);//merge it with the frequency envelope defaults
options=Tone.defaultArg(options,Tone.FrequencyEnvelope.defaults);/**
			 *  Stores the octave value
			 *  @type {Positive}
			 *  @private
			 */this._octaves=options.octaves;//setup
this.baseFrequency=options.baseFrequency;this.octaves=options.octaves;};Tone.extend(Tone.FrequencyEnvelope,Tone.Envelope);/**
		 *  the default parameters
		 *  @static
		 */Tone.FrequencyEnvelope.defaults={'baseFrequency':200,'octaves':4,'exponent':2};/**
		 * The envelope's mininum output value. This is the value which it
		 * starts at.
		 * @memberOf Tone.FrequencyEnvelope#
		 * @type {Frequency}
		 * @name baseFrequency
		 */Object.defineProperty(Tone.FrequencyEnvelope.prototype,'baseFrequency',{get:function get(){return this._scale.min;},set:function set(min){this._scale.min=this.toFrequency(min);//also update the octaves
this.octaves=this._octaves;}});/**
		 * The number of octaves above the baseFrequency that the
		 * envelope will scale to.
		 * @memberOf Tone.FrequencyEnvelope#
		 * @type {Positive}
		 * @name octaves
		 */Object.defineProperty(Tone.FrequencyEnvelope.prototype,'octaves',{get:function get(){return this._octaves;},set:function set(octaves){this._octaves=octaves;this._scale.max=this.baseFrequency*Math.pow(2,octaves);}});/**
		 * The envelope's exponent value.
		 * @memberOf Tone.FrequencyEnvelope#
		 * @type {number}
		 * @name exponent
		 */Object.defineProperty(Tone.FrequencyEnvelope.prototype,'exponent',{get:function get(){return this._exp.value;},set:function set(exp){this._exp.value=exp;}});/**
		 *  clean up
		 *  @returns {Tone.FrequencyEnvelope} this
		 */Tone.FrequencyEnvelope.prototype.dispose=function(){Tone.ScaledEnvelope.prototype.dispose.call(this);return this;};return Tone.FrequencyEnvelope;});Module(function(Tone){/**
		 *  @class  GreaterThanZero outputs 1 when the input is strictly greater than zero
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @example
		 * var gt0 = new Tone.GreaterThanZero();
		 * var sig = new Tone.Signal(0.01).connect(gt0);
		 * //the output of gt0 is 1.
		 * sig.value = 0;
		 * //the output of gt0 is 0.
		 */Tone.GreaterThanZero=function(){Tone.SignalBase.call(this);/**
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */this._thresh=this.output=new Tone.WaveShaper(function(val){if(val<=0){return 0;}else{return 1;}},127);/**
			 *  scale the first thresholded signal by a large value.
			 *  this will help with values which are very close to 0
			 *  @type {Tone.Multiply}
			 *  @private
			 */this._scale=this.input=new Tone.Multiply(10000);//connections
this._scale.connect(this._thresh);};Tone.extend(Tone.GreaterThanZero,Tone.SignalBase);/**
		 *  dispose method
		 *  @returns {Tone.GreaterThanZero} this
		 */Tone.GreaterThanZero.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._scale.dispose();this._scale=null;this._thresh.dispose();this._thresh=null;return this;};return Tone.GreaterThanZero;});Module(function(Tone){/**
		 *  @class  Output 1 if the signal is greater than the value, otherwise outputs 0.
		 *          can compare two signals or a signal and a number.
		 *
		 *  @constructor
		 *  @extends {Tone.Signal}
		 *  @param {number} [value=0] the value to compare to the incoming signal
		 *  @example
		 * var gt = new Tone.GreaterThan(2);
		 * var sig = new Tone.Signal(4).connect(gt);
		 * //output of gt is equal 1.
		 */Tone.GreaterThan=function(value){Tone.Signal.call(this);this.createInsOuts(2,0);/**
			 *  subtract the amount from the incoming signal
			 *  @type {Tone.Subtract}
			 *  @private
			 */this._param=this.input[0]=new Tone.Subtract(value);this.input[1]=this._param.input[1];/**
			 *  compare that amount to zero
			 *  @type {Tone.GreaterThanZero}
			 *  @private
			 */this._gtz=this.output=new Tone.GreaterThanZero();//connect
this._param.connect(this._gtz);};Tone.extend(Tone.GreaterThan,Tone.Signal);/**
		 *  dispose method
		 *  @returns {Tone.GreaterThan} this
		 */Tone.GreaterThan.prototype.dispose=function(){Tone.Signal.prototype.dispose.call(this);this._gtz.dispose();this._gtz=null;return this;};return Tone.GreaterThan;});Module(function(Tone){/**
		 *  @class  Tone.Gate only passes a signal through when the incoming
		 *          signal exceeds a specified threshold. To do this, Gate uses
		 *          a Tone.Follower to follow the amplitude of the incoming signal.
		 *          A common implementation of this class is a [Noise Gate](https://en.wikipedia.org/wiki/Noise_gate).
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @param {Decibels|Object} [threshold] The threshold above which the gate will open.
		 *  @param {Time=} attack The follower's attack time
		 *  @param {Time=} release The follower's release time
		 *  @example
		 * var gate = new Tone.Gate(-30, 0.2, 0.3).toMaster();
		 * var mic = new Tone.UserMedia().connect(gate);
		 * //the gate will only pass through the incoming
		 * //signal when it's louder than -30db
		 */Tone.Gate=function(){var options=Tone.defaults(arguments,['threshold','attack','release'],Tone.Gate);Tone.AudioNode.call(this);this.createInsOuts(1,1);/**
			 *  @type {Tone.Follower}
			 *  @private
			 */this._follower=new Tone.Follower(options.attack,options.release);/**
			 *  @type {Tone.GreaterThan}
			 *  @private
			 */this._gt=new Tone.GreaterThan(Tone.dbToGain(options.threshold));//the connections
this.input.connect(this.output);//the control signal
this.input.chain(this._gt,this._follower,this.output.gain);};Tone.extend(Tone.Gate,Tone.AudioNode);/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */Tone.Gate.defaults={'attack':0.1,'release':0.1,'threshold':-40};/**
		 * The threshold of the gate in decibels
		 * @memberOf Tone.Gate#
		 * @type {Decibels}
		 * @name threshold
		 */Object.defineProperty(Tone.Gate.prototype,'threshold',{get:function get(){return Tone.gainToDb(this._gt.value);},set:function set(thresh){this._gt.value=Tone.dbToGain(thresh);}});/**
		 * The attack speed of the gate
		 * @memberOf Tone.Gate#
		 * @type {Time}
		 * @name attack
		 */Object.defineProperty(Tone.Gate.prototype,'attack',{get:function get(){return this._follower.attack;},set:function set(attackTime){this._follower.attack=attackTime;}});/**
		 * The release speed of the gate
		 * @memberOf Tone.Gate#
		 * @type {Time}
		 * @name release
		 */Object.defineProperty(Tone.Gate.prototype,'release',{get:function get(){return this._follower.release;},set:function set(releaseTime){this._follower.release=releaseTime;}});/**
		 *  Clean up.
		 *  @returns {Tone.Gate} this
		 */Tone.Gate.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._follower.dispose();this._gt.dispose();this._follower=null;this._gt=null;return this;};return Tone.Gate;});Module(function(Tone){/**
		 * @class Tone.TickSignal extends Tone.Signal, but adds the capability
		 *        to calculate the number of elapsed ticks. exponential and target curves
		 *        are approximated with multiple linear ramps.
		 *
		 *        Thank you Bruno Dias, H. Sofia Pinto, and David M. Matos, for your [WAC paper](https://smartech.gatech.edu/bitstream/handle/1853/54588/WAC2016-49.pdf)
		 *        describing integrating timing functions for tempo calculations.
		 *
		 * @param {Number} value The initial value of the signal
		 * @extends {Tone.Signal}
		 */Tone.TickSignal=function(value){value=Tone.defaultArg(value,1);Tone.Signal.call(this,{'units':Tone.Type.Ticks,'value':value});//extend the memory
this._events.memory=Infinity;//clear the clock from the beginning
this.cancelScheduledValues(0);//set an initial event
this._events.add({'type':Tone.Param.AutomationType.SetValue,'time':0,'value':value});};Tone.extend(Tone.TickSignal,Tone.Signal);/**
		 * Wraps Tone.Signal methods so that they also
		 * record the ticks.
		 * @param  {Function} method
		 * @return {Function}
		 * @private
		 */function _wrapScheduleMethods(method){return function(value,time){time=this.toSeconds(time);method.apply(this,arguments);var event=this._events.get(time);var previousEvent=this._events.previousEvent(event);var ticksUntilTime=this._getTicksUntilEvent(previousEvent,time);event.ticks=Math.max(ticksUntilTime,0);return this;};}Tone.TickSignal.prototype.setValueAtTime=_wrapScheduleMethods(Tone.Signal.prototype.setValueAtTime);Tone.TickSignal.prototype.linearRampToValueAtTime=_wrapScheduleMethods(Tone.Signal.prototype.linearRampToValueAtTime);/**
		 *  Start exponentially approaching the target value at the given time with
		 *  a rate having the given time constant.
		 *  @param {number} value
		 *  @param {Time} startTime
		 *  @param {number} timeConstant
		 *  @returns {Tone.TickSignal} this
		 */Tone.TickSignal.prototype.setTargetAtTime=function(value,time,constant){//aproximate it with multiple linear ramps
time=this.toSeconds(time);this.setRampPoint(time);value=this._fromUnits(value);//start from previously scheduled value
var prevEvent=this._events.get(time);var segments=Math.round(Math.max(1/constant,1));for(var i=0;i<=segments;i++){var segTime=constant*i+time;var rampVal=this._exponentialApproach(prevEvent.time,prevEvent.value,value,constant,segTime);this.linearRampToValueAtTime(this._toUnits(rampVal),segTime);}return this;};/**
		 *  Schedules an exponential continuous change in parameter value from
		 *  the previous scheduled parameter value to the given value.
		 *  @param  {number} value
		 *  @param  {Time} endTime
		 *  @returns {Tone.TickSignal} this
		 */Tone.TickSignal.prototype.exponentialRampToValueAtTime=function(value,time){//aproximate it with multiple linear ramps
time=this.toSeconds(time);value=this._fromUnits(value);//start from previously scheduled value
var prevEvent=this._events.get(time);if(prevEvent===null){prevEvent={'value':this._initialValue,'time':0};}//approx 10 segments per second
var segments=Math.round(Math.max((time-prevEvent.time)*10,1));var segmentDur=(time-prevEvent.time)/segments;for(var i=0;i<=segments;i++){var segTime=segmentDur*i+prevEvent.time;var rampVal=this._exponentialInterpolate(prevEvent.time,prevEvent.value,time,value,segTime);this.linearRampToValueAtTime(this._toUnits(rampVal),segTime);}return this;};/**
		 * Returns the tick value at the time. Takes into account
		 * any automation curves scheduled on the signal.
		 * @private
		 * @param  {Time} time The time to get the tick count at
		 * @return {Ticks}      The number of ticks which have elapsed at the time
		 *                          given any automations.
		 */Tone.TickSignal.prototype._getTicksUntilEvent=function(event,time){if(event===null){event={'ticks':0,'time':0};}else if(Tone.isUndef(event.ticks)){var previousEvent=this._events.previousEvent(event);event.ticks=this._getTicksUntilEvent(previousEvent,event.time);}var val0=this.getValueAtTime(event.time);var val1=this.getValueAtTime(time);//if it's right on the line, take the previous value
if(this._events.get(time).time===time&&this._events.get(time).type===Tone.Param.AutomationType.SetValue){val1=this.getValueAtTime(time-this.sampleTime);}return 0.5*(time-event.time)*(val0+val1)+event.ticks;};/**
		 * Returns the tick value at the time. Takes into account
		 * any automation curves scheduled on the signal.
		 * @param  {Time} time The time to get the tick count at
		 * @return {Ticks}      The number of ticks which have elapsed at the time
		 *                          given any automations.
		 */Tone.TickSignal.prototype.getTicksAtTime=function(time){time=this.toSeconds(time);var event=this._events.get(time);return Math.max(this._getTicksUntilEvent(event,time),0);};/**
		 * Return the elapsed time of the number of ticks from the given time
		 * @param {Ticks} ticks The number of ticks to calculate
		 * @param  {Time} time The time to get the next tick from
		 * @return {Seconds} The duration of the number of ticks from the given time in seconds
		 */Tone.TickSignal.prototype.getDurationOfTicks=function(ticks,time){time=this.toSeconds(time);var currentTick=this.getTicksAtTime(time);return this.getTimeOfTick(currentTick+ticks)-time;};/**
		 * Given a tick, returns the time that tick occurs at.
		 * @param  {Ticks} tick
		 * @return {Time}      The time that the tick occurs.
		 */Tone.TickSignal.prototype.getTimeOfTick=function(tick){var before=this._events.get(tick,'ticks');var after=this._events.getAfter(tick,'ticks');if(before&&before.ticks===tick){return before.time;}else if(before&&after&&after.type===Tone.Param.AutomationType.Linear&&before.value!==after.value){var val0=this.getValueAtTime(before.time);var val1=this.getValueAtTime(after.time);var delta=(val1-val0)/(after.time-before.time);var k=Math.sqrt(Math.pow(val0,2)-2*delta*(before.ticks-tick));var sol1=(-val0+k)/delta;var sol2=(-val0-k)/delta;return(sol1>0?sol1:sol2)+before.time;}else if(before){if(before.value===0){return Infinity;}else{return before.time+(tick-before.ticks)/before.value;}}else{return tick/this._initialValue;}};/**
		 * Convert some number of ticks their the duration in seconds accounting
		 * for any automation curves starting at the given time.
		 * @param  {Ticks} ticks The number of ticks to convert to seconds.
		 * @param  {Time} [when=now]  When along the automation timeline to convert the ticks.
		 * @return {Tone.Time}       The duration in seconds of the ticks.
		 */Tone.TickSignal.prototype.ticksToTime=function(ticks,when){when=this.toSeconds(when);return new Tone.Time(this.getDurationOfTicks(ticks,when));};/**
		 * The inverse of [ticksToTime](#tickstotime). Convert a duration in
		 * seconds to the corresponding number of ticks accounting for any
		 * automation curves starting at the given time.
		 * @param  {Time} duration The time interval to convert to ticks.
		 * @param  {Time} [when=now]     When along the automation timeline to convert the ticks.
		 * @return {Tone.Ticks}          The duration in ticks.
		 */Tone.TickSignal.prototype.timeToTicks=function(duration,when){when=this.toSeconds(when);duration=this.toSeconds(duration);var startTicks=this.getTicksAtTime(when);var endTicks=this.getTicksAtTime(when+duration);return new Tone.Ticks(endTicks-startTicks);};return Tone.TickSignal;});Module(function(Tone){/**
		 *  @class  A Timeline State. Provides the methods: <code>setStateAtTime("state", time)</code>
		 *          and <code>getValueAtTime(time)</code>.
		 *
		 *  @extends {Tone.Timeline}
		 *  @param {String} initial The initial state of the TimelineState. 
		 *                          Defaults to <code>undefined</code>
		 */Tone.TimelineState=function(initial){Tone.Timeline.call(this);/**
			 *  The initial state
			 *  @private
			 *  @type {String}
			 */this._initial=initial;};Tone.extend(Tone.TimelineState,Tone.Timeline);/**
		 *  Returns the scheduled state scheduled before or at
		 *  the given time.
		 *  @param  {Number}  time  The time to query.
		 *  @return  {String}  The name of the state input in setStateAtTime.
		 */Tone.TimelineState.prototype.getValueAtTime=function(time){var event=this.get(time);if(event!==null){return event.state;}else{return this._initial;}};/**
		 *  Add a state to the timeline.
		 *  @param  {String}  state The name of the state to set.
		 *  @param  {Number}  time  The time to query.
		 *  @returns {Tone.TimelineState} this
		 */Tone.TimelineState.prototype.setStateAtTime=function(state,time){//all state changes need to be >= the previous state time
//TODO throw error if time < the previous event time
this.add({'state':state,'time':time});return this;};/**
		 *  Return the event before the time with the given state
		 *  @param {Tone.State} state The state to look for
		 *  @param  {Time}  time  When to check before			
		 *  @return  {Object}  The event with the given state before the time
		 */Tone.TimelineState.prototype.getLastState=function(state,time){time=this.toSeconds(time);var index=this._search(time);for(var i=index;i>=0;i--){var event=this._timeline[i];if(event.state===state){return event;}}};/**
		 *  Return the event after the time with the given state
		 *  @param {Tone.State} state The state to look for
		 *  @param  {Time}  time  When to check from
		 *  @return  {Object}  The event with the given state after the time
		 */Tone.TimelineState.prototype.getNextState=function(state,time){time=this.toSeconds(time);var index=this._search(time);if(index!==-1){for(var i=index;i<this._timeline.length;i++){var event=this._timeline[i];if(event.state===state){return event;}}}};return Tone.TimelineState;});Module(function(Tone){/**
		 *  @class  Uses [Tone.TickSignal](TickSignal) to track elapsed ticks with
		 *  		complex automation curves.
		 *
		 * 	@constructor
	     *  @param {Frequency} frequency The initial frequency that the signal ticks at
		 *  @extends {Tone}
		 */Tone.TickSource=function(){var options=Tone.defaults(arguments,['frequency'],Tone.TickSource);/**
			 *  The frequency the callback function should be invoked.
			 *  @type  {Frequency}
			 *  @signal
			 */this.frequency=new Tone.TickSignal(options.frequency,Tone.Type.Frequency);this._readOnly('frequency');/**
			 *  The state timeline
			 *  @type {Tone.TimelineState}
			 *  @private
			 */this._state=new Tone.TimelineState(Tone.State.Stopped);this._state.setStateAtTime(Tone.State.Stopped,0);/**
			 * The offset values of the ticks
			 * @type {Tone.Timeline}
			 * @private
			 */this._tickOffset=new Tone.Timeline();//add the first event
this.setTicksAtTime(0,0);};Tone.extend(Tone.TickSource);/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */Tone.TickSource.defaults={'frequency':1};/**
		 *  Returns the playback state of the source, either "started", "stopped" or "paused".
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.TickSource#
		 *  @name state
		 */Object.defineProperty(Tone.TickSource.prototype,'state',{get:function get(){return this._state.getValueAtTime(this.now());}});/**
		 *  Start the clock at the given time. Optionally pass in an offset
		 *  of where to start the tick counter from.
		 *  @param  {Time=}  time    The time the clock should start
		 *  @param {Ticks=0} offset The number of ticks to start the source at
		 *  @return  {Tone.TickSource}  this
		 */Tone.TickSource.prototype.start=function(time,offset){time=this.toSeconds(time);if(this._state.getValueAtTime(time)!==Tone.State.Started){this._state.setStateAtTime(Tone.State.Started,time);if(Tone.isDefined(offset)){this.setTicksAtTime(offset,time);}}return this;};/**
		 *  Stop the clock. Stopping the clock resets the tick counter to 0.
		 *  @param {Time} [time=now] The time when the clock should stop.
		 *  @returns {Tone.TickSource} this
		 *  @example
		 * clock.stop();
		 */Tone.TickSource.prototype.stop=function(time){time=this.toSeconds(time);//cancel the previous stop
if(this._state.getValueAtTime(time)===Tone.State.Stopped){var event=this._state.get(time);if(event.time>0){this._tickOffset.cancel(event.time);this._state.cancel(event.time);}}this._state.cancel(time);this._state.setStateAtTime(Tone.State.Stopped,time);this.setTicksAtTime(0,time);return this;};/**
		 *  Pause the clock. Pausing does not reset the tick counter.
		 *  @param {Time} [time=now] The time when the clock should stop.
		 *  @returns {Tone.TickSource} this
		 */Tone.TickSource.prototype.pause=function(time){time=this.toSeconds(time);if(this._state.getValueAtTime(time)===Tone.State.Started){this._state.setStateAtTime(Tone.State.Paused,time);}return this;};/**
		 *  Cancel start/stop/pause and setTickAtTime events scheduled after the given time.
		 *  @param {Time} [time=now] When to clear the events after
		 *  @returns {Tone.TickSource} this
		 */Tone.TickSource.prototype.cancel=function(time){time=this.toSeconds(time);this._state.cancel(time);this._tickOffset.cancel(time);return this;};/**
		 * Get the elapsed ticks at the given time
		 * @param  {Time} time  When to get the tick value
		 * @return {Ticks}     The number of ticks
		 */Tone.TickSource.prototype.getTicksAtTime=function(time){time=this.toSeconds(time);var stopEvent=this._state.getLastState(Tone.State.Stopped,time);//this event allows forEachBetween to iterate until the current time
var tmpEvent={state:Tone.State.Paused,time:time};this._state.add(tmpEvent);//keep track of the previous offset event
var lastState=stopEvent;var elapsedTicks=0;//iterate through all the events since the last stop
this._state.forEachBetween(stopEvent.time,time+this.sampleTime,function(e){var periodStartTime=lastState.time;//if there is an offset event in this period use that
var offsetEvent=this._tickOffset.get(e.time);if(offsetEvent.time>=lastState.time){elapsedTicks=offsetEvent.ticks;periodStartTime=offsetEvent.time;}if(lastState.state===Tone.State.Started&&e.state!==Tone.State.Started){elapsedTicks+=this.frequency.getTicksAtTime(e.time)-this.frequency.getTicksAtTime(periodStartTime);}lastState=e;}.bind(this));//remove the temporary event
this._state.remove(tmpEvent);//return the ticks
return elapsedTicks;};/**
		 *  The number of times the callback was invoked. Starts counting at 0
		 *  and increments after the callback was invoked. Returns -1 when stopped.
		 *  @memberOf Tone.TickSource#
		 *  @name ticks
		 *  @type {Ticks}
		 */Object.defineProperty(Tone.TickSource.prototype,'ticks',{get:function get(){return this.getTicksAtTime(this.now());},set:function set(t){this.setTicksAtTime(t,this.now());}});/**
		 *  The time since ticks=0 that the TickSource has been running. Accounts
		 *  for tempo curves
		 *  @memberOf Tone.TickSource#
		 *  @name seconds
		 *  @type {Seconds}
		 */Object.defineProperty(Tone.TickSource.prototype,'seconds',{get:function get(){return this.getSecondsAtTime(this.now());},set:function set(s){var now=this.now();var ticks=this.frequency.timeToTicks(s,now);this.setTicksAtTime(ticks,now);}});/**
		 *  Return the elapsed seconds at the given time.
		 *  @param  {Time}  time  When to get the elapsed seconds
		 *  @return  {Seconds}  The number of elapsed seconds
		 */Tone.TickSource.prototype.getSecondsAtTime=function(time){time=this.toSeconds(time);var stopEvent=this._state.getLastState(Tone.State.Stopped,time);//this event allows forEachBetween to iterate until the current time
var tmpEvent={state:Tone.State.Paused,time:time};this._state.add(tmpEvent);//keep track of the previous offset event
var lastState=stopEvent;var elapsedSeconds=0;//iterate through all the events since the last stop
this._state.forEachBetween(stopEvent.time,time+this.sampleTime,function(e){var periodStartTime=lastState.time;//if there is an offset event in this period use that
var offsetEvent=this._tickOffset.get(e.time);if(offsetEvent.time>=lastState.time){elapsedSeconds=offsetEvent.seconds;periodStartTime=offsetEvent.time;}if(lastState.state===Tone.State.Started&&e.state!==Tone.State.Started){elapsedSeconds+=e.time-periodStartTime;}lastState=e;}.bind(this));//remove the temporary event
this._state.remove(tmpEvent);//return the ticks
return elapsedSeconds;};/**
		 * Set the clock's ticks at the given time.
		 * @param  {Ticks} ticks The tick value to set
		 * @param  {Time} time  When to set the tick value
		 * @return {Tone.TickSource}       this
		 */Tone.TickSource.prototype.setTicksAtTime=function(ticks,time){time=this.toSeconds(time);this._tickOffset.cancel(time);this._tickOffset.add({'time':time,'ticks':ticks,'seconds':this.frequency.getDurationOfTicks(ticks,time)});return this;};/**
		 *  Returns the scheduled state at the given time.
		 *  @param  {Time}  time  The time to query.
		 *  @return  {String}  The name of the state input in setStateAtTime.
		 *  @example
		 * source.start("+0.1");
		 * source.getStateAtTime("+0.1"); //returns "started"
		 */Tone.TickSource.prototype.getStateAtTime=function(time){time=this.toSeconds(time);return this._state.getValueAtTime(time);};/**
		 * Get the time of the given tick. The second argument
		 * is when to test before. Since ticks can be set (with setTicksAtTime)
		 * there may be multiple times for a given tick value. 
		 * @param  {Ticks} ticks The tick number.
		 * @param  {Time=} before When to measure the tick value from. 
		 * @return {Time}       The time of the tick
		 */Tone.TickSource.prototype.getTimeOfTick=function(tick,before){before=Tone.defaultArg(before,this.now());var offset=this._tickOffset.get(before);var event=this._state.get(before);var startTime=Math.max(offset.time,event.time);var absoluteTicks=this.frequency.getTicksAtTime(startTime)+tick-offset.ticks;return this.frequency.getTimeOfTick(absoluteTicks);};/**
		 *  Invoke the callback event at all scheduled ticks between the 
		 *  start time and the end time
		 *  @param  {Time}    startTime  The beginning of the search range
		 *  @param  {Time}    endTime    The end of the search range
		 *  @param  {Function<Time,Ticks>}  callback   The callback to invoke with each tick
		 *  @return  {Tone.TickSource}    this
		 */Tone.TickSource.prototype.forEachTickBetween=function(startTime,endTime,callback){//only iterate through the sections where it is "started"
var lastStateEvent=this._state.get(startTime);this._state.forEachBetween(startTime,endTime,function(event){if(lastStateEvent.state===Tone.State.Started&&event.state!==Tone.State.Started){this.forEachTickBetween(Math.max(lastStateEvent.time,startTime),event.time-this.sampleTime,callback);}lastStateEvent=event;}.bind(this));startTime=Math.max(lastStateEvent.time,startTime);if(lastStateEvent.state===Tone.State.Started&&this._state){//figure out the difference between the frequency ticks and the 
var startTicks=this.frequency.getTicksAtTime(startTime);var ticksAtStart=this.frequency.getTicksAtTime(lastStateEvent.time);var diff=startTicks-ticksAtStart;var offset=diff%1;if(offset!==0){offset=1-offset;}var nextTickTime=this.frequency.getTimeOfTick(startTicks+offset);var error=null;while(nextTickTime<endTime&&this._state){try{callback(nextTickTime,Math.round(this.getTicksAtTime(nextTickTime)));}catch(e){error=e;break;}if(this._state){nextTickTime+=this.frequency.getDurationOfTicks(1,nextTickTime);}}}if(error){throw error;}return this;};/**
		 *  Clean up
		 *  @returns {Tone.TickSource} this
		 */Tone.TickSource.prototype.dispose=function(){Tone.Param.prototype.dispose.call(this);this._state.dispose();this._state=null;this._tickOffset.dispose();this._tickOffset=null;this._writable('frequency');this.frequency.dispose();this.frequency=null;return this;};return Tone.TickSource;});Module(function(Tone){/**
		 *  @class  A sample accurate clock which provides a callback at the given rate.
		 *          While the callback is not sample-accurate (it is still susceptible to
		 *          loose JS timing), the time passed in as the argument to the callback
		 *          is precise. For most applications, it is better to use Tone.Transport
		 *          instead of the Clock by itself since you can synchronize multiple callbacks.
		 *
		 * 	@constructor
		 *  @extends {Tone.Emitter}
		 * 	@param {function} callback The callback to be invoked with the time of the audio event
		 * 	@param {Frequency} frequency The rate of the callback
		 * 	@example
		 * //the callback will be invoked approximately once a second
		 * //and will print the time exactly once a second apart.
		 * var clock = new Tone.Clock(function(time){
		 * 	console.log(time);
		 * }, 1);
		 */Tone.Clock=function(){var options=Tone.defaults(arguments,['callback','frequency'],Tone.Clock);Tone.Emitter.call(this);/**
			 *  The callback function to invoke at the scheduled tick.
			 *  @type  {Function}
			 */this.callback=options.callback;/**
			 *  The next time the callback is scheduled.
			 *  @type {Number}
			 *  @private
			 */this._nextTick=0;/**
			 *  The tick counter
			 *  @type  {Tone.TickSource}
			 *  @private
			 */this._tickSource=new Tone.TickSource(options.frequency);/**
			 *  The last time the loop callback was invoked
			 *  @private
			 *  @type {Number}
			 */this._lastUpdate=0;/**
			 *  The rate the callback function should be invoked.
			 *  @type  {BPM}
			 *  @signal
			 */this.frequency=this._tickSource.frequency;this._readOnly('frequency');/**
			 *  The state timeline
			 *  @type {Tone.TimelineState}
			 *  @private
			 */this._state=new Tone.TimelineState(Tone.State.Stopped);//add an initial state
this._state.setStateAtTime(Tone.State.Stopped,0);/**
			 *  The loop function bound to its context.
			 *  This is necessary to remove the event in the end.
			 *  @type {Function}
			 *  @private
			 */this._boundLoop=this._loop.bind(this);//bind a callback to the worker thread
this.context.on('tick',this._boundLoop);};Tone.extend(Tone.Clock,Tone.Emitter);/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */Tone.Clock.defaults={'callback':Tone.noOp,'frequency':1};/**
		 *  Returns the playback state of the source, either "started", "stopped" or "paused".
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.Clock#
		 *  @name state
		 */Object.defineProperty(Tone.Clock.prototype,'state',{get:function get(){return this._state.getValueAtTime(this.now());}});/**
		 *  Start the clock at the given time. Optionally pass in an offset
		 *  of where to start the tick counter from.
		 *  @param  {Time=}  time    The time the clock should start
		 *  @param  {Ticks=}  offset  Where the tick counter starts counting from.
		 *  @return  {Tone.Clock}  this
		 */Tone.Clock.prototype.start=function(time,offset){time=this.toSeconds(time);if(this._state.getValueAtTime(time)!==Tone.State.Started){this._state.setStateAtTime(Tone.State.Started,time);this._tickSource.start(time,offset);if(time<this._lastUpdate){this.emit('start',time,offset);}}return this;};/**
		 *  Stop the clock. Stopping the clock resets the tick counter to 0.
		 *  @param {Time} [time=now] The time when the clock should stop.
		 *  @returns {Tone.Clock} this
		 *  @example
		 * clock.stop();
		 */Tone.Clock.prototype.stop=function(time){time=this.toSeconds(time);this._state.cancel(time);this._state.setStateAtTime(Tone.State.Stopped,time);this._tickSource.stop(time);if(time<this._lastUpdate){this.emit('stop',time);}return this;};/**
		 *  Pause the clock. Pausing does not reset the tick counter.
		 *  @param {Time} [time=now] The time when the clock should stop.
		 *  @returns {Tone.Clock} this
		 */Tone.Clock.prototype.pause=function(time){time=this.toSeconds(time);if(this._state.getValueAtTime(time)===Tone.State.Started){this._state.setStateAtTime(Tone.State.Paused,time);this._tickSource.pause(time);if(time<this._lastUpdate){this.emit('pause',time);}}return this;};/**
		 *  The number of times the callback was invoked. Starts counting at 0
		 *  and increments after the callback was invoked.
		 *  @type {Ticks}
		 */Object.defineProperty(Tone.Clock.prototype,'ticks',{get:function get(){return Math.ceil(this.getTicksAtTime(this.now()));},set:function set(t){this._tickSource.ticks=t;}});/**
		 *  The time since ticks=0 that the Clock has been running. Accounts
		 *  for tempo curves
		 *  @type {Seconds}
		 */Object.defineProperty(Tone.Clock.prototype,'seconds',{get:function get(){return this._tickSource.seconds;},set:function set(s){this._tickSource.seconds=s;}});/**
		 *  Return the elapsed seconds at the given time.
		 *  @param  {Time}  time  When to get the elapsed seconds
		 *  @return  {Seconds}  The number of elapsed seconds
		 */Tone.Clock.prototype.getSecondsAtTime=function(time){return this._tickSource.getSecondsAtTime(time);};/**
		 * Set the clock's ticks at the given time.
		 * @param  {Ticks} ticks The tick value to set
		 * @param  {Time} time  When to set the tick value
		 * @return {Tone.Clock}       this
		 */Tone.Clock.prototype.setTicksAtTime=function(ticks,time){this._tickSource.setTicksAtTime(ticks,time);return this;};/**
		 * Get the clock's ticks at the given time.
		 * @param  {Time} time  When to get the tick value
		 * @return {Ticks}       The tick value at the given time.
		 */Tone.Clock.prototype.getTicksAtTime=function(time){return this._tickSource.getTicksAtTime(time);};/**
		 * Get the time of the next tick
		 * @param  {Ticks} ticks The tick number.
		 * @param  {Time} before 
		 * @return {Tone.Clock}       this
		 */Tone.Clock.prototype.nextTickTime=function(offset,when){when=this.toSeconds(when);var currentTick=this.getTicksAtTime(when);return this._tickSource.getTimeOfTick(currentTick+offset,when);};/**
		 *  The scheduling loop.
		 *  @private
		 */Tone.Clock.prototype._loop=function(){var startTime=this._lastUpdate;var endTime=this.now();this._lastUpdate=endTime;if(startTime!==endTime){//the state change events
this._state.forEachBetween(startTime,endTime,function(e){switch(e.state){case Tone.State.Started:var offset=this._tickSource.getTicksAtTime(e.time);this.emit('start',e.time,offset);break;case Tone.State.Stopped:if(e.time!==0){this.emit('stop',e.time);}break;case Tone.State.Paused:this.emit('pause',e.time);break;}}.bind(this));//the tick callbacks
this._tickSource.forEachTickBetween(startTime,endTime,function(time,ticks){this.callback(time,ticks);}.bind(this));}};/**
		 *  Returns the scheduled state at the given time.
		 *  @param  {Time}  time  The time to query.
		 *  @return  {String}  The name of the state input in setStateAtTime.
		 *  @example
		 * clock.start("+0.1");
		 * clock.getStateAtTime("+0.1"); //returns "started"
		 */Tone.Clock.prototype.getStateAtTime=function(time){time=this.toSeconds(time);return this._state.getValueAtTime(time);};/**
		 *  Clean up
		 *  @returns {Tone.Clock} this
		 */Tone.Clock.prototype.dispose=function(){Tone.Emitter.prototype.dispose.call(this);this.context.off('tick',this._boundLoop);this._writable('frequency');this._tickSource.dispose();this._tickSource=null;this.frequency=null;this._boundLoop=null;this._nextTick=Infinity;this.callback=null;this._state.dispose();this._state=null;};return Tone.Clock;});Module(function(Tone){/**
		 *  @class Similar to Tone.Timeline, but all events represent
		 *         intervals with both "time" and "duration" times. The
		 *         events are placed in a tree structure optimized
		 *         for querying an intersection point with the timeline
		 *         events. Internally uses an [Interval Tree](https://en.wikipedia.org/wiki/Interval_tree)
		 *         to represent the data.
		 *  @extends {Tone}
		 */Tone.IntervalTimeline=function(){Tone.call(this);/**
			 *  The root node of the inteval tree
			 *  @type  {IntervalNode}
			 *  @private
			 */this._root=null;/**
			 *  Keep track of the length of the timeline.
			 *  @type  {Number}
			 *  @private
			 */this._length=0;};Tone.extend(Tone.IntervalTimeline);/**
		 *  The event to add to the timeline. All events must
		 *  have a time and duration value
		 *  @param  {Object}  event  The event to add to the timeline
		 *  @return  {Tone.IntervalTimeline}  this
		 */Tone.IntervalTimeline.prototype.add=function(event){if(Tone.isUndef(event.time)||Tone.isUndef(event.duration)){throw new Error('Tone.IntervalTimeline: events must have time and duration parameters');}event.time=event.time.valueOf();var node=new IntervalNode(event.time,event.time+event.duration,event);if(this._root===null){this._root=node;}else{this._root.insert(node);}this._length++;// Restructure tree to be balanced
while(node!==null){node.updateHeight();node.updateMax();this._rebalance(node);node=node.parent;}return this;};/**
		 *  Remove an event from the timeline.
		 *  @param  {Object}  event  The event to remove from the timeline
		 *  @return  {Tone.IntervalTimeline}  this
		 */Tone.IntervalTimeline.prototype.remove=function(event){if(this._root!==null){var results=[];this._root.search(event.time,results);for(var i=0;i<results.length;i++){var node=results[i];if(node.event===event){this._removeNode(node);this._length--;break;}}}return this;};/**
		 *  The number of items in the timeline.
		 *  @type {Number}
		 *  @memberOf Tone.IntervalTimeline#
		 *  @name length
		 *  @readOnly
		 */Object.defineProperty(Tone.IntervalTimeline.prototype,'length',{get:function get(){return this._length;}});/**
		 *  Remove events whose time time is after the given time
		 *  @param  {Number}  time  The time to query.
		 *  @returns {Tone.IntervalTimeline} this
		 */Tone.IntervalTimeline.prototype.cancel=function(after){this.forEachFrom(after,function(event){this.remove(event);}.bind(this));return this;};/**
		 *  Set the root node as the given node
		 *  @param {IntervalNode} node
		 *  @private
		 */Tone.IntervalTimeline.prototype._setRoot=function(node){this._root=node;if(this._root!==null){this._root.parent=null;}};/**
		 *  Replace the references to the node in the node's parent
		 *  with the replacement node.
		 *  @param  {IntervalNode}  node
		 *  @param  {IntervalNode}  replacement
		 *  @private
		 */Tone.IntervalTimeline.prototype._replaceNodeInParent=function(node,replacement){if(node.parent!==null){if(node.isLeftChild()){node.parent.left=replacement;}else{node.parent.right=replacement;}this._rebalance(node.parent);}else{this._setRoot(replacement);}};/**
		 *  Remove the node from the tree and replace it with
		 *  a successor which follows the schema.
		 *  @param  {IntervalNode}  node
		 *  @private
		 */Tone.IntervalTimeline.prototype._removeNode=function(node){if(node.left===null&&node.right===null){this._replaceNodeInParent(node,null);}else if(node.right===null){this._replaceNodeInParent(node,node.left);}else if(node.left===null){this._replaceNodeInParent(node,node.right);}else{var balance=node.getBalance();var replacement,temp;if(balance>0){if(node.left.right===null){replacement=node.left;replacement.right=node.right;temp=replacement;}else{replacement=node.left.right;while(replacement.right!==null){replacement=replacement.right;}replacement.parent.right=replacement.left;temp=replacement.parent;replacement.left=node.left;replacement.right=node.right;}}else if(node.right.left===null){replacement=node.right;replacement.left=node.left;temp=replacement;}else{replacement=node.right.left;while(replacement.left!==null){replacement=replacement.left;}replacement.parent=replacement.parent;replacement.parent.left=replacement.right;temp=replacement.parent;replacement.left=node.left;replacement.right=node.right;}if(node.parent!==null){if(node.isLeftChild()){node.parent.left=replacement;}else{node.parent.right=replacement;}}else{this._setRoot(replacement);}// this._replaceNodeInParent(node, replacement);
this._rebalance(temp);}node.dispose();};/**
		 *  Rotate the tree to the left
		 *  @param  {IntervalNode}  node
		 *  @private
		 */Tone.IntervalTimeline.prototype._rotateLeft=function(node){var parent=node.parent;var isLeftChild=node.isLeftChild();// Make node.right the new root of this sub tree (instead of node)
var pivotNode=node.right;node.right=pivotNode.left;pivotNode.left=node;if(parent!==null){if(isLeftChild){parent.left=pivotNode;}else{parent.right=pivotNode;}}else{this._setRoot(pivotNode);}};/**
		 *  Rotate the tree to the right
		 *  @param  {IntervalNode}  node
		 *  @private
		 */Tone.IntervalTimeline.prototype._rotateRight=function(node){var parent=node.parent;var isLeftChild=node.isLeftChild();// Make node.left the new root of this sub tree (instead of node)
var pivotNode=node.left;node.left=pivotNode.right;pivotNode.right=node;if(parent!==null){if(isLeftChild){parent.left=pivotNode;}else{parent.right=pivotNode;}}else{this._setRoot(pivotNode);}};/**
		 *  Balance the BST
		 *  @param  {IntervalNode}  node
		 *  @private
		 */Tone.IntervalTimeline.prototype._rebalance=function(node){var balance=node.getBalance();if(balance>1){if(node.left.getBalance()<0){this._rotateLeft(node.left);}else{this._rotateRight(node);}}else if(balance<-1){if(node.right.getBalance()>0){this._rotateRight(node.right);}else{this._rotateLeft(node);}}};/**
		 *  Get an event whose time and duration span the give time. Will
		 *  return the match whose "time" value is closest to the given time.
		 *  @param  {Object}  event  The event to add to the timeline
		 *  @return  {Object}  The event which spans the desired time
		 */Tone.IntervalTimeline.prototype.get=function(time){if(this._root!==null){var results=[];this._root.search(time,results);if(results.length>0){var max=results[0];for(var i=1;i<results.length;i++){if(results[i].low>max.low){max=results[i];}}return max.event;}}return null;};/**
		 *  Iterate over everything in the timeline.
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.IntervalTimeline} this
		 */Tone.IntervalTimeline.prototype.forEach=function(callback){if(this._root!==null){var allNodes=[];this._root.traverse(function(node){allNodes.push(node);});for(var i=0;i<allNodes.length;i++){var ev=allNodes[i].event;if(ev){callback(ev);}}}return this;};/**
		 *  Iterate over everything in the array in which the given time
		 *  overlaps with the time and duration time of the event.
		 *  @param  {Number}  time The time to check if items are overlapping
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.IntervalTimeline} this
		 */Tone.IntervalTimeline.prototype.forEachAtTime=function(time,callback){if(this._root!==null){var results=[];this._root.search(time,results);for(var i=results.length-1;i>=0;i--){var ev=results[i].event;if(ev){callback(ev);}}}return this;};/**
		 *  Iterate over everything in the array in which the time is greater
		 *  than or equal to the given time.
		 *  @param  {Number}  time The time to check if items are before
		 *  @param  {Function}  callback The callback to invoke with every item
		 *  @returns {Tone.IntervalTimeline} this
		 */Tone.IntervalTimeline.prototype.forEachFrom=function(time,callback){if(this._root!==null){var results=[];this._root.searchAfter(time,results);for(var i=results.length-1;i>=0;i--){var ev=results[i].event;callback(ev);}}return this;};/**
		 *  Clean up
		 *  @return  {Tone.IntervalTimeline}  this
		 */Tone.IntervalTimeline.prototype.dispose=function(){var allNodes=[];if(this._root!==null){this._root.traverse(function(node){allNodes.push(node);});}for(var i=0;i<allNodes.length;i++){allNodes[i].dispose();}allNodes=null;this._root=null;return this;};///////////////////////////////////////////////////////////////////////////
//	INTERVAL NODE HELPER
///////////////////////////////////////////////////////////////////////////
/**
		 *  Represents a node in the binary search tree, with the addition
		 *  of a "high" value which keeps track of the highest value of
		 *  its children.
		 *  References:
		 *  https://brooknovak.wordpress.com/2013/12/07/augmented-interval-tree-in-c/
		 *  http://www.mif.vu.lt/~valdas/ALGORITMAI/LITERATURA/Cormen/Cormen.pdf
		 *  @param {Number} low
		 *  @param {Number} high
		 *  @private
		 */var IntervalNode=function IntervalNode(low,high,event){//the event container
this.event=event;//the low value
this.low=low;//the high value
this.high=high;//the high value for this and all child nodes
this.max=this.high;//the nodes to the left
this._left=null;//the nodes to the right
this._right=null;//the parent node
this.parent=null;//the number of child nodes
this.height=0;};/**
		 *  Insert a node into the correct spot in the tree
		 *  @param  {IntervalNode}  node
		 */IntervalNode.prototype.insert=function(node){if(node.low<=this.low){if(this.left===null){this.left=node;}else{this.left.insert(node);}}else if(this.right===null){this.right=node;}else{this.right.insert(node);}};/**
		 *  Search the tree for nodes which overlap
		 *  with the given point
		 *  @param  {Number}  point  The point to query
		 *  @param  {Array}  results  The array to put the results
		 */IntervalNode.prototype.search=function(point,results){// If p is to the right of the rightmost point of any interval
// in this node and all children, there won't be any matches.
if(point>this.max){return;}// Search left children
if(this.left!==null){this.left.search(point,results);}// Check this node
if(this.low<=point&&this.high>point){results.push(this);}// If p is to the left of the time of this interval,
// then it can't be in any child to the right.
if(this.low>point){return;}// Search right children
if(this.right!==null){this.right.search(point,results);}};/**
		 *  Search the tree for nodes which are less
		 *  than the given point
		 *  @param  {Number}  point  The point to query
		 *  @param  {Array}  results  The array to put the results
		 */IntervalNode.prototype.searchAfter=function(point,results){// Check this node
if(this.low>=point){results.push(this);if(this.left!==null){this.left.searchAfter(point,results);}}// search the right side
if(this.right!==null){this.right.searchAfter(point,results);}};/**
		 *  Invoke the callback on this element and both it's branches
		 *  @param  {Function}  callback
		 */IntervalNode.prototype.traverse=function(callback){callback(this);if(this.left!==null){this.left.traverse(callback);}if(this.right!==null){this.right.traverse(callback);}};/**
		 *  Update the height of the node
		 */IntervalNode.prototype.updateHeight=function(){if(this.left!==null&&this.right!==null){this.height=Math.max(this.left.height,this.right.height)+1;}else if(this.right!==null){this.height=this.right.height+1;}else if(this.left!==null){this.height=this.left.height+1;}else{this.height=0;}};/**
		 *  Update the height of the node
		 */IntervalNode.prototype.updateMax=function(){this.max=this.high;if(this.left!==null){this.max=Math.max(this.max,this.left.max);}if(this.right!==null){this.max=Math.max(this.max,this.right.max);}};/**
		 *  The balance is how the leafs are distributed on the node
		 *  @return  {Number}  Negative numbers are balanced to the right
		 */IntervalNode.prototype.getBalance=function(){var balance=0;if(this.left!==null&&this.right!==null){balance=this.left.height-this.right.height;}else if(this.left!==null){balance=this.left.height+1;}else if(this.right!==null){balance=-(this.right.height+1);}return balance;};/**
		 *  @returns {Boolean} true if this node is the left child
		 *  of its parent
		 */IntervalNode.prototype.isLeftChild=function(){return this.parent!==null&&this.parent.left===this;};/**
		 *  get/set the left node
		 *  @type {IntervalNode}
		 */Object.defineProperty(IntervalNode.prototype,'left',{get:function get(){return this._left;},set:function set(node){this._left=node;if(node!==null){node.parent=this;}this.updateHeight();this.updateMax();}});/**
		 *  get/set the right node
		 *  @type {IntervalNode}
		 */Object.defineProperty(IntervalNode.prototype,'right',{get:function get(){return this._right;},set:function set(node){this._right=node;if(node!==null){node.parent=this;}this.updateHeight();this.updateMax();}});/**
		 *  null out references.
		 */IntervalNode.prototype.dispose=function(){this.parent=null;this._left=null;this._right=null;this.event=null;};///////////////////////////////////////////////////////////////////////////
//	END INTERVAL NODE HELPER
///////////////////////////////////////////////////////////////////////////
return Tone.IntervalTimeline;});Module(function(Tone){/**
		 *  @class Tone.Ticks is a primitive type for encoding Time values.
		 *         Tone.Ticks can be constructed with or without the `new` keyword. Tone.Ticks can be passed
		 *         into the parameter of any method which takes time as an argument.
		 *  @constructor
		 *  @extends {Tone.TransportTime}
		 *  @param  {String|Number}  val    The time value.
		 *  @param  {String=}  units  The units of the value.
		 *  @example
		 * var t = Tone.Ticks("4n");//a quarter note
		 */Tone.Ticks=function(val,units){if(this instanceof Tone.Ticks){Tone.TransportTime.call(this,val,units);}else{return new Tone.Ticks(val,units);}};Tone.extend(Tone.Ticks,Tone.TransportTime);/**
		 *  The default units if none are given.
		 *  @type {String}
		 *  @private
		 */Tone.Ticks.prototype._defaultUnits='i';/**
		 * Get the current time in the given units
		 * @return {Ticks}
		 * @private
		 */Tone.Ticks.prototype._now=function(){return Tone.Transport.ticks;};/**
		 *  Return the value of the beats in the current units
		 *  @param {Number} beats
		 *  @return  {Number}
		 *  @private
		 */Tone.Ticks.prototype._beatsToUnits=function(beats){return this._getPPQ()*beats;};/**
		 *  Returns the value of a second in the current units
		 *  @param {Seconds} seconds
		 *  @return  {Number}
		 *  @private
		 */Tone.Ticks.prototype._secondsToUnits=function(seconds){return seconds/(60/this._getBpm())*this._getPPQ();};/**
		 *  Returns the value of a tick in the current time units
		 *  @param {Ticks} ticks
		 *  @return  {Number}
		 *  @private
		 */Tone.Ticks.prototype._ticksToUnits=function(ticks){return ticks;};/**
		 *  Return the time in ticks
		 *  @return  {Ticks}
		 */Tone.Ticks.prototype.toTicks=function(){return this.valueOf();};/**
		 *  Return the time in ticks
		 *  @return  {Ticks}
		 */Tone.Ticks.prototype.toSeconds=function(){return this.valueOf()/this._getPPQ()*(60/this._getBpm());};return Tone.Ticks;});Module(function(Tone){/**
		 *  @class Tone.TransportEvent is an internal class used by (Tone.Transport)[Transport]
		 *         to schedule events. Do no invoke this class directly, it is
		 *         handled from within Tone.Transport.
		 *  @extends {Tone}
		 *  @param {Object} options
		 */Tone.TransportEvent=function(Transport,options){options=Tone.defaultArg(options,Tone.TransportEvent.defaults);Tone.call(this);/**
			 * Reference to the Transport that created it
			 * @type {Tone.Transport}
			 */this.Transport=Transport;/**
			 * The unique id of the event
			 * @type {Number}
			 */this.id=Tone.TransportEvent._eventId++;/**
			 * The time the event starts
			 * @type {Ticks}
			 */this.time=Tone.Ticks(options.time);/**
			 * The callback to invoke
			 * @type {Function}
			 */this.callback=options.callback;/**
			 * If the event should be removed after being created.
			 * @type {Boolean}
			 * @private
			 */this._once=options.once;};Tone.extend(Tone.TransportEvent);/**
		 * The defaults
		 * @static
		 * @type {Object}
		 */Tone.TransportEvent.defaults={'once':false,'callback':Tone.noOp};/**
		 * Current ID counter
		 * @private
		 * @static
		 * @type {Number}
		 */Tone.TransportEvent._eventId=0;/**
		 * Invoke the event callback.
		 * @param  {Time} time  The AudioContext time in seconds of the event
		 */Tone.TransportEvent.prototype.invoke=function(time){if(this.callback){this.callback(time);if(this._once&&this.Transport){this.Transport.clear(this.id);}}};/**
		 * Clean up
		 * @return {Tone.TransportEvent} this
		 */Tone.TransportEvent.prototype.dispose=function(){Tone.prototype.dispose.call(this);this.Transport=null;this.callback=null;this.time=null;return this;};return Tone.TransportEvent;});Module(function(Tone){/**
		 *  @class Tone.TransportRepeatEvent is an internal class used by Tone.Transport
		 *         to schedule repeat events. This class should not be instantiated directly.
		 *  @extends {Tone.TransportEvent}
		 *  @param {Object} options
		 */Tone.TransportRepeatEvent=function(Transport,options){Tone.TransportEvent.call(this,Transport,options);options=Tone.defaultArg(options,Tone.TransportRepeatEvent.defaults);/**
			 * When the event should stop repeating
			 * @type {Ticks}
			 * @private
			 */this.duration=Tone.Ticks(options.duration);/**
			 * The interval of the repeated event
			 * @type {Ticks}
			 * @private
			 */this._interval=Tone.Ticks(options.interval);/**
			 * The ID of the current timeline event
			 * @type {Number}
			 * @private
			 */this._currentId=-1;/**
			 * The ID of the next timeline event
			 * @type {Number}
			 * @private
			 */this._nextId=-1;/**
			  * The time of the next event
			  * @type {Ticks}
			  * @private
			  */this._nextTick=this.time;/**
			 * a reference to the bound start method
			 * @type {Function}
			 * @private
			 */this._boundRestart=this._restart.bind(this);this.Transport.on('start loopStart',this._boundRestart);this._restart();};Tone.extend(Tone.TransportRepeatEvent,Tone.TransportEvent);/**
		 * The defaults
		 * @static
		 * @type {Object}
		 */Tone.TransportRepeatEvent.defaults={'duration':Infinity,'interval':1};/**
		 * Invoke the callback. Returns the tick time which
		 * the next event should be scheduled at.
		 * @param  {Number} time  The AudioContext time in seconds of the event
		 */Tone.TransportRepeatEvent.prototype.invoke=function(time){//create more events if necessary
this._createEvents(time);//call the super class
Tone.TransportEvent.prototype.invoke.call(this,time);};/**
		 * Push more events onto the timeline to keep up with the position of the timeline
		 * @private
		 */Tone.TransportRepeatEvent.prototype._createEvents=function(time){// schedule the next event
var ticks=this.Transport.getTicksAtTime(time);if(ticks>=this.time&&ticks>=this._nextTick&&this._nextTick+this._interval<this.time+this.duration){this._nextTick+=this._interval;this._currentId=this._nextId;this._nextId=this.Transport.scheduleOnce(this.invoke.bind(this),Tone.Ticks(this._nextTick));}};/**
		 * Push more events onto the timeline to keep up with the position of the timeline
		 * @private
		 */Tone.TransportRepeatEvent.prototype._restart=function(time){this.Transport.clear(this._currentId);this.Transport.clear(this._nextId);this._nextTick=this.time;var ticks=this.Transport.getTicksAtTime(time);if(ticks>this.time){this._nextTick=this.time+Math.ceil((ticks-this.time)/this._interval)*this._interval;}this._currentId=this.Transport.scheduleOnce(this.invoke.bind(this),Tone.Ticks(this._nextTick));this._nextTick+=this._interval;this._nextId=this.Transport.scheduleOnce(this.invoke.bind(this),Tone.Ticks(this._nextTick));};/**
		 * Clean up
		 * @return {Tone.TransportRepeatEvent} this
		 */Tone.TransportRepeatEvent.prototype.dispose=function(){this.Transport.clear(this._currentId);this.Transport.clear(this._nextId);this.Transport.off('start loopStart',this._boundRestart);this._boundCreateEvents=null;Tone.TransportEvent.prototype.dispose.call(this);this.duration=null;this._interval=null;return this;};return Tone.TransportRepeatEvent;});Module(function(Tone){/**
		 *  @class  Transport for timing musical events.
		 *          Supports tempo curves and time changes. Unlike browser-based timing (setInterval, requestAnimationFrame)
		 *          Tone.Transport timing events pass in the exact time of the scheduled event
		 *          in the argument of the callback function. Pass that time value to the object
		 *          you're scheduling. <br><br>
		 *          A single transport is created for you when the library is initialized.
		 *          <br><br>
		 *          The transport emits the events: "start", "stop", "pause", and "loop" which are
		 *          called with the time of that event as the argument.
		 *
		 *  @extends {Tone.Emitter}
		 *  @singleton
		 *  @example
		 * //repeated event every 8th note
		 * Tone.Transport.scheduleRepeat(function(time){
		 * 	//do something with the time
		 * }, "8n");
		 *  @example
		 * //schedule an event on the 16th measure
		 * Tone.Transport.schedule(function(time){
		 * 	//do something with the time
		 * }, "16:0:0");
		 */Tone.Transport=function(){Tone.Emitter.call(this);Tone.getContext(function(){///////////////////////////////////////////////////////////////////////
//	LOOPING
//////////////////////////////////////////////////////////////////////
/**
				 * 	If the transport loops or not.
				 *  @type {boolean}
				 */this.loop=false;/**
				 * 	The loop start position in ticks
				 *  @type {Ticks}
				 *  @private
				 */this._loopStart=0;/**
				 * 	The loop end position in ticks
				 *  @type {Ticks}
				 *  @private
				 */this._loopEnd=0;///////////////////////////////////////////////////////////////////////
//	CLOCK/TEMPO
//////////////////////////////////////////////////////////////////////
/**
				 *  Pulses per quarter is the number of ticks per quarter note.
				 *  @private
				 *  @type  {Number}
				 */this._ppq=TransportConstructor.defaults.PPQ;/**
				 *  watches the main oscillator for timing ticks
				 *  initially starts at 120bpm
				 *  @private
				 *  @type {Tone.Clock}
				 */this._clock=new Tone.Clock({'callback':this._processTick.bind(this),'frequency':0});this._bindClockEvents();/**
				 *  The Beats Per Minute of the Transport.
				 *  @type {BPM}
				 *  @signal
				 *  @example
				 * Tone.Transport.bpm.value = 80;
				 * //ramp the bpm to 120 over 10 seconds
				 * Tone.Transport.bpm.rampTo(120, 10);
				 */this.bpm=this._clock.frequency;this.bpm._toUnits=this._toUnits.bind(this);this.bpm._fromUnits=this._fromUnits.bind(this);this.bpm.units=Tone.Type.BPM;this.bpm.value=TransportConstructor.defaults.bpm;this._readOnly('bpm');/**
				 *  The time signature, or more accurately the numerator
				 *  of the time signature over a denominator of 4.
				 *  @type {Number}
				 *  @private
				 */this._timeSignature=TransportConstructor.defaults.timeSignature;///////////////////////////////////////////////////////////////////////
//	TIMELINE EVENTS
//////////////////////////////////////////////////////////////////////
/**
				 *  All the events in an object to keep track by ID
				 *  @type {Object}
				 *  @private
				 */this._scheduledEvents={};/**
				 * 	The scheduled events.
				 *  @type {Tone.Timeline}
				 *  @private
				 */this._timeline=new Tone.Timeline();/**
				 *  Repeated events
				 *  @type {Array}
				 *  @private
				 */this._repeatedEvents=new Tone.IntervalTimeline();/**
				 *  All of the synced Signals
				 *  @private
				 *  @type {Array}
				 */this._syncedSignals=[];///////////////////////////////////////////////////////////////////////
//	SWING
//////////////////////////////////////////////////////////////////////
/**
				 *  The subdivision of the swing
				 *  @type  {Ticks}
				 *  @private
				 */this._swingTicks=TransportConstructor.defaults.PPQ/2;//8n
/**
				 *  The swing amount
				 *  @type {NormalRange}
				 *  @private
				 */this._swingAmount=0;}.bind(this));};Tone.extend(Tone.Transport,Tone.Emitter);/**
		 *  the defaults
		 *  @type {Object}
		 *  @const
		 *  @static
		 */Tone.Transport.defaults={'bpm':120,'swing':0,'swingSubdivision':'8n','timeSignature':4,'loopStart':0,'loopEnd':'4m','PPQ':192};///////////////////////////////////////////////////////////////////////////////
//	TICKS
///////////////////////////////////////////////////////////////////////////////
/**
		 *  called on every tick
		 *  @param   {number} tickTime clock relative tick time
		 *  @private
		 */Tone.Transport.prototype._processTick=function(tickTime,ticks){//handle swing
if(this._swingAmount>0&&ticks%this._ppq!==0&&//not on a downbeat
ticks%(this._swingTicks*2)!==0){//add some swing
var progress=ticks%(this._swingTicks*2)/(this._swingTicks*2);var amount=Math.sin(progress*Math.PI)*this._swingAmount;tickTime+=Tone.Ticks(this._swingTicks*2/3).toSeconds()*amount;}//do the loop test
if(this.loop){if(ticks>=this._loopEnd){this.emit('loopEnd',tickTime);this._clock.setTicksAtTime(this._loopStart,tickTime);ticks=this._loopStart;this.emit('loopStart',tickTime,this._clock.getSecondsAtTime(tickTime));this.emit('loop',tickTime);}}//invoke the timeline events scheduled on this tick
this._timeline.forEachAtTime(ticks,function(event){event.invoke(tickTime);});};///////////////////////////////////////////////////////////////////////////////
//	SCHEDULABLE EVENTS
///////////////////////////////////////////////////////////////////////////////
/**
		 *  Schedule an event along the timeline.
		 *  @param {Function} callback The callback to be invoked at the time.
		 *  @param {TransportTime}  time The time to invoke the callback at.
		 *  @return {Number} The id of the event which can be used for canceling the event.
		 *  @example
		 * //trigger the callback when the Transport reaches the desired time
		 * Tone.Transport.schedule(function(time){
		 * 	envelope.triggerAttack(time);
		 * }, "128i");
		 */Tone.Transport.prototype.schedule=function(callback,time){var event=new Tone.TransportEvent(this,{'time':Tone.TransportTime(time),'callback':callback});return this._addEvent(event,this._timeline);};/**
		 *  Schedule a repeated event along the timeline. The event will fire
		 *  at the `interval` starting at the `startTime` and for the specified
		 *  `duration`.
		 *  @param  {Function}  callback   The callback to invoke.
		 *  @param  {Time}    interval   The duration between successive
		 *                               callbacks. Must be a positive number.
		 *  @param  {TransportTime=}    startTime  When along the timeline the events should
		 *                               start being invoked.
		 *  @param {Time} [duration=Infinity] How long the event should repeat.
		 *  @return  {Number}    The ID of the scheduled event. Use this to cancel
		 *                           the event.
		 *  @example
		 * //a callback invoked every eighth note after the first measure
		 * Tone.Transport.scheduleRepeat(callback, "8n", "1m");
		 */Tone.Transport.prototype.scheduleRepeat=function(callback,interval,startTime,duration){var event=new Tone.TransportRepeatEvent(this,{'callback':callback,'interval':Tone.Time(interval),'time':Tone.TransportTime(startTime),'duration':Tone.Time(Tone.defaultArg(duration,Infinity))});//kick it off if the Transport is started
return this._addEvent(event,this._repeatedEvents);};/**
		 *  Schedule an event that will be removed after it is invoked.
		 *  Note that if the given time is less than the current transport time,
		 *  the event will be invoked immediately.
		 *  @param {Function} callback The callback to invoke once.
		 *  @param {TransportTime} time The time the callback should be invoked.
		 *  @returns {Number} The ID of the scheduled event.
		 */Tone.Transport.prototype.scheduleOnce=function(callback,time){var event=new Tone.TransportEvent(this,{'time':Tone.TransportTime(time),'callback':callback,'once':true});return this._addEvent(event,this._timeline);};/**
		 *  Clear the passed in event id from the timeline
		 *  @param {Number} eventId The id of the event.
		 *  @returns {Tone.Transport} this
		 */Tone.Transport.prototype.clear=function(eventId){if(this._scheduledEvents.hasOwnProperty(eventId)){var item=this._scheduledEvents[eventId.toString()];item.timeline.remove(item.event);item.event.dispose();delete this._scheduledEvents[eventId.toString()];}return this;};/**
		 * Add an event to the correct timeline. Keep track of the
		 * timeline it was added to.
		 * @param {Tone.TransportEvent}	event
		 * @param {Tone.Timeline} timeline
		 * @returns {Number} the event id which was just added
		 * @private
		 */Tone.Transport.prototype._addEvent=function(event,timeline){this._scheduledEvents[event.id.toString()]={'event':event,'timeline':timeline};timeline.add(event);return event.id;};/**
		 *  Remove scheduled events from the timeline after
		 *  the given time. Repeated events will be removed
		 *  if their startTime is after the given time
		 *  @param {TransportTime} [after=0] Clear all events after
		 *                          this time.
		 *  @returns {Tone.Transport} this
		 */Tone.Transport.prototype.cancel=function(after){after=Tone.defaultArg(after,0);after=this.toTicks(after);this._timeline.forEachFrom(after,function(event){this.clear(event.id);}.bind(this));this._repeatedEvents.forEachFrom(after,function(event){this.clear(event.id);}.bind(this));return this;};///////////////////////////////////////////////////////////////////////////////
//	START/STOP/PAUSE
///////////////////////////////////////////////////////////////////////////////
/**
		 *  Bind start/stop/pause events from the clock and emit them.
		 *  @private
		 */Tone.Transport.prototype._bindClockEvents=function(){this._clock.on('start',function(time,offset){offset=Tone.Ticks(offset).toSeconds();this.emit('start',time,offset);}.bind(this));this._clock.on('stop',function(time){this.emit('stop',time);}.bind(this));this._clock.on('pause',function(time){this.emit('pause',time);}.bind(this));};/**
		 *  Returns the playback state of the source, either "started", "stopped", or "paused"
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.Transport#
		 *  @name state
		 */Object.defineProperty(Tone.Transport.prototype,'state',{get:function get(){return this._clock.getStateAtTime(this.now());}});/**
		 *  Start the transport and all sources synced to the transport.
		 *  @param  {Time} [time=now] The time when the transport should start.
		 *  @param  {TransportTime=} offset The timeline offset to start the transport.
		 *  @returns {Tone.Transport} this
		 *  @example
		 * //start the transport in one second starting at beginning of the 5th measure.
		 * Tone.Transport.start("+1", "4:0:0");
		 */Tone.Transport.prototype.start=function(time,offset){//start the clock
if(Tone.isDefined(offset)){offset=this.toTicks(offset);}this._clock.start(time,offset);return this;};/**
		 *  Stop the transport and all sources synced to the transport.
		 *  @param  {Time} [time=now] The time when the transport should stop.
		 *  @returns {Tone.Transport} this
		 *  @example
		 * Tone.Transport.stop();
		 */Tone.Transport.prototype.stop=function(time){this._clock.stop(time);return this;};/**
		 *  Pause the transport and all sources synced to the transport.
		 *  @param  {Time} [time=now]
		 *  @returns {Tone.Transport} this
		 */Tone.Transport.prototype.pause=function(time){this._clock.pause(time);return this;};/**
		 * Toggle the current state of the transport. If it is
		 * started, it will stop it, otherwise it will start the Transport.
		 * @param  {Time=} time The time of the event
		 * @return {Tone.Transport}      this
		 */Tone.Transport.prototype.toggle=function(time){time=this.toSeconds(time);if(this._clock.getStateAtTime(time)!==Tone.State.Started){this.start(time);}else{this.stop(time);}return this;};///////////////////////////////////////////////////////////////////////////////
//	SETTERS/GETTERS
///////////////////////////////////////////////////////////////////////////////
/**
		 *  The time signature as just the numerator over 4.
		 *  For example 4/4 would be just 4 and 6/8 would be 3.
		 *  @memberOf Tone.Transport#
		 *  @type {Number|Array}
		 *  @name timeSignature
		 *  @example
		 * //common time
		 * Tone.Transport.timeSignature = 4;
		 * // 7/8
		 * Tone.Transport.timeSignature = [7, 8];
		 * //this will be reduced to a single number
		 * Tone.Transport.timeSignature; //returns 3.5
		 */Object.defineProperty(Tone.Transport.prototype,'timeSignature',{get:function get(){return this._timeSignature;},set:function set(timeSig){if(Tone.isArray(timeSig)){timeSig=timeSig[0]/timeSig[1]*4;}this._timeSignature=timeSig;}});/**
		 * When the Tone.Transport.loop = true, this is the starting position of the loop.
		 * @memberOf Tone.Transport#
		 * @type {Time}
		 * @name loopStart
		 */Object.defineProperty(Tone.Transport.prototype,'loopStart',{get:function get(){return Tone.Ticks(this._loopStart).toSeconds();},set:function set(startPosition){this._loopStart=this.toTicks(startPosition);}});/**
		 * When the Tone.Transport.loop = true, this is the ending position of the loop.
		 * @memberOf Tone.Transport#
		 * @type {Time}
		 * @name loopEnd
		 */Object.defineProperty(Tone.Transport.prototype,'loopEnd',{get:function get(){return Tone.Ticks(this._loopEnd).toSeconds();},set:function set(endPosition){this._loopEnd=this.toTicks(endPosition);}});/**
		 *  Set the loop start and stop at the same time.
		 *  @param {TransportTime} startPosition
		 *  @param {TransportTime} endPosition
		 *  @returns {Tone.Transport} this
		 *  @example
		 * //loop over the first measure
		 * Tone.Transport.setLoopPoints(0, "1m");
		 * Tone.Transport.loop = true;
		 */Tone.Transport.prototype.setLoopPoints=function(startPosition,endPosition){this.loopStart=startPosition;this.loopEnd=endPosition;return this;};/**
		 *  The swing value. Between 0-1 where 1 equal to
		 *  the note + half the subdivision.
		 *  @memberOf Tone.Transport#
		 *  @type {NormalRange}
		 *  @name swing
		 */Object.defineProperty(Tone.Transport.prototype,'swing',{get:function get(){return this._swingAmount;},set:function set(amount){//scale the values to a normal range
this._swingAmount=amount;}});/**
		 *  Set the subdivision which the swing will be applied to.
		 *  The default value is an 8th note. Value must be less
		 *  than a quarter note.
		 *
		 *  @memberOf Tone.Transport#
		 *  @type {Time}
		 *  @name swingSubdivision
		 */Object.defineProperty(Tone.Transport.prototype,'swingSubdivision',{get:function get(){return Tone.Ticks(this._swingTicks).toNotation();},set:function set(subdivision){this._swingTicks=this.toTicks(subdivision);}});/**
		 *  The Transport's position in Bars:Beats:Sixteenths.
		 *  Setting the value will jump to that position right away.
		 *  @memberOf Tone.Transport#
		 *  @type {BarsBeatsSixteenths}
		 *  @name position
		 */Object.defineProperty(Tone.Transport.prototype,'position',{get:function get(){var now=this.now();var ticks=this._clock.getTicksAtTime(now);return Tone.Ticks(ticks).toBarsBeatsSixteenths();},set:function set(progress){var ticks=this.toTicks(progress);this.ticks=ticks;}});/**
		 *  The Transport's position in seconds
		 *  Setting the value will jump to that position right away.
		 *  @memberOf Tone.Transport#
		 *  @type {Seconds}
		 *  @name seconds
		 */Object.defineProperty(Tone.Transport.prototype,'seconds',{get:function get(){return this._clock.seconds;},set:function set(s){var now=this.now();var ticks=this.bpm.timeToTicks(s,now);this.ticks=ticks;}});/**
		 *  The Transport's loop position as a normalized value. Always
		 *  returns 0 if the transport if loop is not true.
		 *  @memberOf Tone.Transport#
		 *  @name progress
		 *  @type {NormalRange}
		 */Object.defineProperty(Tone.Transport.prototype,'progress',{get:function get(){if(this.loop){var now=this.now();var ticks=this._clock.getTicksAtTime(now);return(ticks-this._loopStart)/(this._loopEnd-this._loopStart);}else{return 0;}}});/**
		 *  The transports current tick position.
		 *
		 *  @memberOf Tone.Transport#
		 *  @type {Ticks}
		 *  @name ticks
		 */Object.defineProperty(Tone.Transport.prototype,'ticks',{get:function get(){return this._clock.ticks;},set:function set(t){if(this._clock.ticks!==t){var now=this.now();//stop everything synced to the transport
if(this.state===Tone.State.Started){this.emit('stop',now);this._clock.setTicksAtTime(t,now);//restart it with the new time
this.emit('start',now,this.seconds);}else{this._clock.setTicksAtTime(t,now);}}}});/**
		 * Get the clock's ticks at the given time.
		 * @param  {Time} time  When to get the tick value
		 * @return {Ticks}       The tick value at the given time.
		 */Tone.Transport.prototype.getTicksAtTime=function(time){return Math.round(this._clock.getTicksAtTime(time));};/**
		 *  Return the elapsed seconds at the given time.
		 *  @param  {Time}  time  When to get the elapsed seconds
		 *  @return  {Seconds}  The number of elapsed seconds
		 */Tone.Transport.prototype.getSecondsAtTime=function(time){return this._clock.getSecondsAtTime(time);};/**
		 *  Pulses Per Quarter note. This is the smallest resolution
		 *  the Transport timing supports. This should be set once
		 *  on initialization and not set again. Changing this value
		 *  after other objects have been created can cause problems.
		 *
		 *  @memberOf Tone.Transport#
		 *  @type {Number}
		 *  @name PPQ
		 */Object.defineProperty(Tone.Transport.prototype,'PPQ',{get:function get(){return this._ppq;},set:function set(ppq){var bpm=this.bpm.value;this._ppq=ppq;this.bpm.value=bpm;}});/**
		 *  Convert from BPM to frequency (factoring in PPQ)
		 *  @param  {BPM}  bpm The BPM value to convert to frequency
		 *  @return  {Frequency}  The BPM as a frequency with PPQ factored in.
		 *  @private
		 */Tone.Transport.prototype._fromUnits=function(bpm){return 1/(60/bpm/this.PPQ);};/**
		 *  Convert from frequency (with PPQ) into BPM
		 *  @param  {Frequency}  freq The clocks frequency to convert to BPM
		 *  @return  {BPM}  The frequency value as BPM.
		 *  @private
		 */Tone.Transport.prototype._toUnits=function(freq){return freq/this.PPQ*60;};///////////////////////////////////////////////////////////////////////////////
//	SYNCING
///////////////////////////////////////////////////////////////////////////////
/**
		 *  Returns the time aligned to the next subdivision
		 *  of the Transport. If the Transport is not started,
		 *  it will return 0.
		 *  Note: this will not work precisely during tempo ramps.
		 *  @param  {Time}  subdivision  The subdivision to quantize to
		 *  @return  {Number}  The context time of the next subdivision.
		 *  @example
		 * Tone.Transport.start(); //the transport must be started
		 * Tone.Transport.nextSubdivision("4n");
		 */Tone.Transport.prototype.nextSubdivision=function(subdivision){subdivision=this.toTicks(subdivision);if(this.state!==Tone.State.Started){//if the transport's not started, return 0
return 0;}else{var now=this.now();//the remainder of the current ticks and the subdivision
var transportPos=this.getTicksAtTime(now);var remainingTicks=subdivision-transportPos%subdivision;return this._clock.nextTickTime(remainingTicks,now);}};/**
		 *  Attaches the signal to the tempo control signal so that
		 *  any changes in the tempo will change the signal in the same
		 *  ratio.
		 *
		 *  @param  {Tone.Signal} signal
		 *  @param {number=} ratio Optionally pass in the ratio between
		 *                         the two signals. Otherwise it will be computed
		 *                         based on their current values.
		 *  @returns {Tone.Transport} this
		 */Tone.Transport.prototype.syncSignal=function(signal,ratio){if(!ratio){//get the sync ratio
var now=this.now();if(signal.getValueAtTime(now)!==0){ratio=signal.getValueAtTime(now)/this.bpm.getValueAtTime(now);}else{ratio=0;}}var ratioSignal=new Tone.Gain(ratio);this.bpm.chain(ratioSignal,signal._param);this._syncedSignals.push({'ratio':ratioSignal,'signal':signal,'initial':signal.value});signal.value=0;return this;};/**
		 *  Unsyncs a previously synced signal from the transport's control.
		 *  See Tone.Transport.syncSignal.
		 *  @param  {Tone.Signal} signal
		 *  @returns {Tone.Transport} this
		 */Tone.Transport.prototype.unsyncSignal=function(signal){for(var i=this._syncedSignals.length-1;i>=0;i--){var syncedSignal=this._syncedSignals[i];if(syncedSignal.signal===signal){syncedSignal.ratio.dispose();syncedSignal.signal.value=syncedSignal.initial;this._syncedSignals.splice(i,1);}}return this;};/**
		 *  Clean up.
		 *  @returns {Tone.Transport} this
		 *  @private
		 */Tone.Transport.prototype.dispose=function(){Tone.Emitter.prototype.dispose.call(this);this._clock.dispose();this._clock=null;this._writable('bpm');this.bpm=null;this._timeline.dispose();this._timeline=null;this._repeatedEvents.dispose();this._repeatedEvents=null;return this;};///////////////////////////////////////////////////////////////////////////////
//	INITIALIZATION
///////////////////////////////////////////////////////////////////////////////
var TransportConstructor=Tone.Transport;Tone.Transport=new TransportConstructor();Tone.Context.on('init',function(context){if(context.Transport instanceof TransportConstructor){Tone.Transport=context.Transport;}else{Tone.Transport=new TransportConstructor();}//store the Transport on the context so it can be retrieved later
context.Transport=Tone.Transport;});Tone.Context.on('close',function(context){if(context.Transport instanceof TransportConstructor){context.Transport.dispose();}});return Tone.Transport;});Module(function(Tone){/**
		 *  @class Tone.Volume is a simple volume node, useful for creating a volume fader.
		 *
		 *  @extends {Tone.AudioNode}
		 *  @constructor
		 *  @param {Decibels} [volume=0] the initial volume
		 *  @example
		 * var vol = new Tone.Volume(-12);
		 * instrument.chain(vol, Tone.Master);
		 */Tone.Volume=function(){var options=Tone.defaults(arguments,['volume'],Tone.Volume);Tone.AudioNode.call(this);/**
			 * the output node
			 * @type {GainNode}
			 * @private
			 */this.output=this.input=new Tone.Gain(options.volume,Tone.Type.Decibels);/**
			 * The unmuted volume
			 * @type {Decibels}
			 * @private
			 */this._unmutedVolume=options.volume;/**
			 *  The volume control in decibels.
			 *  @type {Decibels}
			 *  @signal
			 */this.volume=this.output.gain;this._readOnly('volume');//set the mute initially
this.mute=options.mute;};Tone.extend(Tone.Volume,Tone.AudioNode);/**
		 *  Defaults
		 *  @type  {Object}
		 *  @const
		 *  @static
		 */Tone.Volume.defaults={'volume':0,'mute':false};/**
		 * Mute the output.
		 * @memberOf Tone.Volume#
		 * @type {boolean}
		 * @name mute
		 * @example
		 * //mute the output
		 * volume.mute = true;
		 */Object.defineProperty(Tone.Volume.prototype,'mute',{get:function get(){return this.volume.value===-Infinity;},set:function set(mute){if(!this.mute&&mute){this._unmutedVolume=this.volume.value;//maybe it should ramp here?
this.volume.value=-Infinity;}else if(this.mute&&!mute){this.volume.value=this._unmutedVolume;}}});/**
		 *  clean up
		 *  @returns {Tone.Volume} this
		 */Tone.Volume.prototype.dispose=function(){this.input.dispose();Tone.AudioNode.prototype.dispose.call(this);this._writable('volume');this.volume.dispose();this.volume=null;return this;};return Tone.Volume;});Module(function(Tone){/**
		 *  @class  A single master output which is connected to the
		 *          AudioDestinationNode (aka your speakers).
		 *          It provides useful conveniences such as the ability
		 *          to set the volume and mute the entire application.
		 *          It also gives you the ability to apply master effects to your application.
		 *          <br><br>
		 *          Like Tone.Transport, A single Tone.Master is created
		 *          on initialization and you do not need to explicitly construct one.
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @singleton
		 *  @example
		 * //the audio will go from the oscillator to the speakers
		 * oscillator.connect(Tone.Master);
		 * //a convenience for connecting to the master output is also provided:
		 * oscillator.toMaster();
		 * //the above two examples are equivalent.
		 */Tone.Master=function(){Tone.AudioNode.call(this);Tone.getContext(function(){this.createInsOuts(1,0);/**
				 *  The private volume node
				 *  @type  {Tone.Volume}
				 *  @private
				 */this._volume=this.output=new Tone.Volume();/**
				 * The volume of the master output.
				 * @type {Decibels}
				 * @signal
				 */this.volume=this._volume.volume;this._readOnly('volume');//connections
this.input.chain(this.output,this.context.destination);}.bind(this));};Tone.extend(Tone.Master,Tone.AudioNode);/**
		 *  @type {Object}
		 *  @const
		 */Tone.Master.defaults={'volume':0,'mute':false};/**
		 * Mute the output.
		 * @memberOf Tone.Master#
		 * @type {boolean}
		 * @name mute
		 * @example
		 * //mute the output
		 * Tone.Master.mute = true;
		 */Object.defineProperty(Tone.Master.prototype,'mute',{get:function get(){return this._volume.mute;},set:function set(mute){this._volume.mute=mute;}});/**
		 *  Add a master effects chain. NOTE: this will disconnect any nodes which were previously
		 *  chained in the master effects chain.
		 *  @param {AudioNode|Tone} args... All arguments will be connected in a row
		 *                                  and the Master will be routed through it.
		 *  @return  {Tone.Master}  this
		 *  @example
		 * //some overall compression to keep the levels in check
		 * var masterCompressor = new Tone.Compressor({
		 * 	"threshold" : -6,
		 * 	"ratio" : 3,
		 * 	"attack" : 0.5,
		 * 	"release" : 0.1
		 * });
		 * //give a little boost to the lows
		 * var lowBump = new Tone.Filter(200, "lowshelf");
		 * //route everything through the filter
		 * //and compressor before going to the speakers
		 * Tone.Master.chain(lowBump, masterCompressor);
		 */Tone.Master.prototype.chain=function(){this.input.disconnect();this.input.chain.apply(this.input,arguments);arguments[arguments.length-1].connect(this.output);};/**
		 *  Clean up
		 *  @return  {Tone.Master}  this
		 */Tone.Master.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._writable('volume');this._volume.dispose();this._volume=null;this.volume=null;};///////////////////////////////////////////////////////////////////////////
//	AUGMENT TONE's PROTOTYPE
///////////////////////////////////////////////////////////////////////////
/**
		 *  Connect 'this' to the master output. Shorthand for this.connect(Tone.Master)
		 *  @returns {Tone.AudioNode} this
		 *  @example
		 * //connect an oscillator to the master output
		 * var osc = new Tone.Oscillator().toMaster();
		 */Tone.AudioNode.prototype.toMaster=function(){this.connect(Tone.Master);return this;};if(window.AudioNode){// Also augment AudioNode's prototype to include toMaster as a convenience
AudioNode.prototype.toMaster=function(){this.connect(Tone.Master);return this;};}/**
		 *  initialize the module and listen for new audio contexts
		 */var MasterConstructor=Tone.Master;Tone.Master=new MasterConstructor();Tone.Context.on('init',function(context){// if it already exists, just restore it
if(context.Master instanceof MasterConstructor){Tone.Master=context.Master;}else{Tone.Master=new MasterConstructor();}context.Master=Tone.Master;});Tone.Context.on('close',function(context){if(context.Master instanceof MasterConstructor){context.Master.dispose();}});return Tone.Master;});Module(function(Tone){/**
		 *  @class  Base class for sources. Sources have start/stop methods
		 *          and the ability to be synced to the
		 *          start/stop of Tone.Transport.
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @example
		 * //Multiple state change events can be chained together,
		 * //but must be set in the correct order and with ascending times
		 *
		 * // OK
		 * state.start().stop("+0.2");
		 * // AND
		 * state.start().stop("+0.2").start("+0.4").stop("+0.7")
		 *
		 * // BAD
		 * state.stop("+0.2").start();
		 * // OR
		 * state.start("+0.3").stop("+0.2");
		 *
		 */Tone.Source=function(options){options=Tone.defaultArg(options,Tone.Source.defaults);Tone.AudioNode.call(this);/**
			 *  The output volume node
			 *  @type  {Tone.Volume}
			 *  @private
			 */this._volume=this.output=new Tone.Volume(options.volume);/**
			 * The volume of the output in decibels.
			 * @type {Decibels}
			 * @signal
			 * @example
			 * source.volume.value = -6;
			 */this.volume=this._volume.volume;this._readOnly('volume');/**
			 * 	Keep track of the scheduled state.
			 *  @type {Tone.TimelineState}
			 *  @private
			 */this._state=new Tone.TimelineState(Tone.State.Stopped);this._state.memory=100;/**
			 *  The synced `start` callback function from the transport
			 *  @type {Function}
			 *  @private
			 */this._synced=false;/**
			 *  Keep track of all of the scheduled event ids
			 *  @type  {Array}
			 *  @private
			 */this._scheduled=[];//make the output explicitly stereo
this._volume.output.output.channelCount=2;this._volume.output.output.channelCountMode='explicit';//mute initially
this.mute=options.mute;};Tone.extend(Tone.Source,Tone.AudioNode);/**
		 *  The default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.Source.defaults={'volume':0,'mute':false};/**
		 *  Returns the playback state of the source, either "started" or "stopped".
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.Source#
		 *  @name state
		 */Object.defineProperty(Tone.Source.prototype,'state',{get:function get(){if(this._synced){if(Tone.Transport.state===Tone.State.Started){return this._state.getValueAtTime(Tone.Transport.seconds);}else{return Tone.State.Stopped;}}else{return this._state.getValueAtTime(this.now());}}});/**
		 * Mute the output.
		 * @memberOf Tone.Source#
		 * @type {boolean}
		 * @name mute
		 * @example
		 * //mute the output
		 * source.mute = true;
		 */Object.defineProperty(Tone.Source.prototype,'mute',{get:function get(){return this._volume.mute;},set:function set(mute){this._volume.mute=mute;}});//overwrite these functions
Tone.Source.prototype._start=Tone.noOp;Tone.Source.prototype.restart=Tone.noOp;Tone.Source.prototype._stop=Tone.noOp;/**
		 *  Start the source at the specified time. If no time is given,
		 *  start the source now.
		 *  @param  {Time} [time=now] When the source should be started.
		 *  @returns {Tone.Source} this
		 *  @example
		 * source.start("+0.5"); //starts the source 0.5 seconds from now
		 */Tone.Source.prototype.start=function(time,offset,duration){if(Tone.isUndef(time)&&this._synced){time=Tone.Transport.seconds;}else{time=this.toSeconds(time);}//if it's started, stop it and restart it
if(this._state.getValueAtTime(time)===Tone.State.Started){this._state.cancel(time);this._state.setStateAtTime(Tone.State.Started,time);this.restart(time,offset,duration);}else{this._state.setStateAtTime(Tone.State.Started,time);if(this._synced){// add the offset time to the event
var event=this._state.get(time);event.offset=Tone.defaultArg(offset,0);event.duration=duration;var sched=Tone.Transport.schedule(function(t){this._start(t,offset,duration);}.bind(this),time);this._scheduled.push(sched);//if it's already started
if(Tone.Transport.state===Tone.State.Started){this._syncedStart(this.now(),Tone.Transport.seconds);}}else{this._start.apply(this,arguments);}}return this;};/**
		 *  Stop the source at the specified time. If no time is given,
		 *  stop the source now.
		 *  @param  {Time} [time=now] When the source should be stopped.
		 *  @returns {Tone.Source} this
		 *  @example
		 * source.stop(); // stops the source immediately
		 */Tone.Source.prototype.stop=function(time){if(Tone.isUndef(time)&&this._synced){time=Tone.Transport.seconds;}else{time=this.toSeconds(time);}if(!this._synced){this._stop.apply(this,arguments);}else{var sched=Tone.Transport.schedule(this._stop.bind(this),time);this._scheduled.push(sched);}this._state.cancel(time);this._state.setStateAtTime(Tone.State.Stopped,time);return this;};/**
		 *  Sync the source to the Transport so that all subsequent
		 *  calls to `start` and `stop` are synced to the TransportTime
		 *  instead of the AudioContext time.
		 *
		 *  @returns {Tone.Source} this
		 *  @example
		 * //sync the source so that it plays between 0 and 0.3 on the Transport's timeline
		 * source.sync().start(0).stop(0.3);
		 * //start the transport.
		 * Tone.Transport.start();
		 *
		 *  @example
		 * //start the transport with an offset and the sync'ed sources
		 * //will start in the correct position
		 * source.sync().start(0.1);
		 * //the source will be invoked with an offset of 0.4
		 * Tone.Transport.start("+0.5", 0.5);
		 */Tone.Source.prototype.sync=function(){this._synced=true;this._syncedStart=function(time,offset){if(offset>0){// get the playback state at that time
var stateEvent=this._state.get(offset);// listen for start events which may occur in the middle of the sync'ed time
if(stateEvent&&stateEvent.state===Tone.State.Started&&stateEvent.time!==offset){// get the offset
var startOffset=offset-this.toSeconds(stateEvent.time);var duration;if(stateEvent.duration){duration=this.toSeconds(stateEvent.duration)-startOffset;}this._start(time,this.toSeconds(stateEvent.offset)+startOffset,duration);}}}.bind(this);this._syncedStop=function(time){var seconds=Tone.Transport.getSecondsAtTime(Math.max(time-this.sampleTime,0));if(this._state.getValueAtTime(seconds)===Tone.State.Started){this._stop(time);}}.bind(this);Tone.Transport.on('start loopStart',this._syncedStart);Tone.Transport.on('stop pause loopEnd',this._syncedStop);return this;};/**
		 *  Unsync the source to the Transport. See Tone.Source.sync
		 *  @returns {Tone.Source} this
		 */Tone.Source.prototype.unsync=function(){if(this._synced){Tone.Transport.off('stop pause loopEnd',this._syncedStop);Tone.Transport.off('start loopStart',this._syncedStart);}this._synced=false;// clear all of the scheduled ids
for(var i=0;i<this._scheduled.length;i++){var id=this._scheduled[i];Tone.Transport.clear(id);}this._scheduled=[];this._state.cancel(0);return this;};/**
		 *	Clean up.
		 *  @return {Tone.Source} this
		 */Tone.Source.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this.unsync();this._scheduled=null;this._writable('volume');this._volume.dispose();this._volume=null;this.volume=null;this._state.dispose();this._state=null;};return Tone.Source;});Module(function(Tone){/**
		 *  AudioBuffer.copyTo/FromChannel polyfill
		 *  @private
		 */if(Tone.supported){if(!AudioBuffer.prototype.copyToChannel){AudioBuffer.prototype.copyToChannel=function(src,chanNum,start){var channel=this.getChannelData(chanNum);start=start||0;for(var i=0;i<channel.length;i++){channel[i+start]=src[i];}};AudioBuffer.prototype.copyFromChannel=function(dest,chanNum,start){var channel=this.getChannelData(chanNum);start=start||0;for(var i=0;i<dest.length;i++){dest[i]=channel[i+start];}};}}});Module(function(Tone){/**
		 *  @class  Buffer loading and storage. Tone.Buffer is used internally by all
		 *          classes that make requests for audio files such as Tone.Player,
		 *          Tone.Sampler and Tone.Convolver.
		 *
		 *          Aside from load callbacks from individual buffers, Tone.Buffer
		 *  		provides events which keep track of the loading progress
		 *  		of _all_ of the buffers. These are Tone.Buffer.on("load" / "progress" / "error")
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @param {AudioBuffer|String} url The url to load, or the audio buffer to set.
		 *  @param {Function=} onload A callback which is invoked after the buffer is loaded.
		 *                            It's recommended to use `Tone.Buffer.on('load', callback)` instead
		 *                            since it will give you a callback when _all_ buffers are loaded.
		 *  @param {Function=} onerror The callback to invoke if there is an error
		 *  @example
		 * var buffer = new Tone.Buffer("path/to/sound.mp3", function(){
		 * 	//the buffer is now available.
		 * 	var buff = buffer.get();
		 * });
		 *  @example
		 * //can load provide fallback extension types if the first type is not supported.
		 * var buffer = new Tone.Buffer("path/to/sound.[mp3|ogg|wav]");
		 */Tone.Buffer=function(){var options=Tone.defaults(arguments,['url','onload','onerror'],Tone.Buffer);Tone.call(this);/**
			 *  stores the loaded AudioBuffer
			 *  @type {AudioBuffer}
			 *  @private
			 */this._buffer=null;/**
			 *  indicates if the buffer should be reversed or not
			 *  @type {Boolean}
			 *  @private
			 */this._reversed=options.reverse;/**
			 *  The XHR
			 *  @type  {XMLHttpRequest}
			 *  @private
			 */this._xhr=null;/**
			 * Private callback when the buffer is loaded.
			 * @type {Function}
			 * @private
			 */this._onload=Tone.noOp;if(options.url instanceof AudioBuffer||options.url instanceof Tone.Buffer){this.set(options.url);// invoke the onload callback
if(options.onload){if(this.loaded){options.onload(this);}else{this._onload=options.onload;}}}else if(Tone.isString(options.url)){this.load(options.url).then(options.onload).catch(options.onerror);}};Tone.extend(Tone.Buffer);/**
		 *  the default parameters
		 *  @type {Object}
		 */Tone.Buffer.defaults={'url':undefined,'reverse':false,'onload':Tone.noOp,'onerror':Tone.noOp};/**
		 *  Pass in an AudioBuffer or Tone.Buffer to set the value
		 *  of this buffer.
		 *  @param {AudioBuffer|Tone.Buffer} buffer the buffer
		 *  @returns {Tone.Buffer} this
		 */Tone.Buffer.prototype.set=function(buffer){if(buffer instanceof Tone.Buffer){if(buffer.loaded){this._buffer=buffer.get();}else{buffer._onload=function(){this.set(buffer);this._onload(this);}.bind(this);}}else{this._buffer=buffer;}return this;};/**
		 *  @return {AudioBuffer} The audio buffer stored in the object.
		 */Tone.Buffer.prototype.get=function(){return this._buffer;};/**
		 *  Makes an xhr reqest for the selected url then decodes
		 *  the file as an audio buffer. Invokes
		 *  the callback once the audio buffer loads.
		 *  @param {String} url The url of the buffer to load.
		 *                      filetype support depends on the
		 *                      browser.
		 *  @returns {Promise} returns a Promise which resolves with the Tone.Buffer
		 */Tone.Buffer.prototype.load=function(url,onload,onerror){var promise=new Promise(function(load,error){this._xhr=Tone.Buffer.load(url,//success
function(buff){this._xhr=null;this.set(buff);load(this);this._onload(this);if(onload){onload(this);}}.bind(this),//error
function(err){this._xhr=null;error(err);if(onerror){onerror(err);}}.bind(this));}.bind(this));return promise;};/**
		 *  dispose and disconnect
		 *  @returns {Tone.Buffer} this
		 */Tone.Buffer.prototype.dispose=function(){Tone.prototype.dispose.call(this);this._buffer=null;if(this._xhr){Tone.Buffer._removeFromDownloadQueue(this._xhr);this._xhr.abort();this._xhr=null;}return this;};/**
		 * If the buffer is loaded or not
		 * @memberOf Tone.Buffer#
		 * @type {Boolean}
		 * @name loaded
		 * @readOnly
		 */Object.defineProperty(Tone.Buffer.prototype,'loaded',{get:function get(){return this.length>0;}});/**
		 * The duration of the buffer.
		 * @memberOf Tone.Buffer#
		 * @type {Number}
		 * @name duration
		 * @readOnly
		 */Object.defineProperty(Tone.Buffer.prototype,'duration',{get:function get(){if(this._buffer){return this._buffer.duration;}else{return 0;}}});/**
		 * The length of the buffer in samples
		 * @memberOf Tone.Buffer#
		 * @type {Number}
		 * @name length
		 * @readOnly
		 */Object.defineProperty(Tone.Buffer.prototype,'length',{get:function get(){if(this._buffer){return this._buffer.length;}else{return 0;}}});/**
		 * The number of discrete audio channels. Returns 0 if no buffer
		 * is loaded.
		 * @memberOf Tone.Buffer#
		 * @type {Number}
		 * @name numberOfChannels
		 * @readOnly
		 */Object.defineProperty(Tone.Buffer.prototype,'numberOfChannels',{get:function get(){if(this._buffer){return this._buffer.numberOfChannels;}else{return 0;}}});/**
		 *  Set the audio buffer from the array. To create a multichannel AudioBuffer,
		 *  pass in a multidimensional array.
		 *  @param {Float32Array} array The array to fill the audio buffer
		 *  @return {Tone.Buffer} this
		 */Tone.Buffer.prototype.fromArray=function(array){var isMultidimensional=array[0].length>0;var channels=isMultidimensional?array.length:1;var len=isMultidimensional?array[0].length:array.length;var buffer=this.context.createBuffer(channels,len,this.context.sampleRate);if(!isMultidimensional&&channels===1){array=[array];}for(var c=0;c<channels;c++){buffer.copyToChannel(array[c],c);}this._buffer=buffer;return this;};/**
		 * 	Sums muliple channels into 1 channel
		 *  @param {Number=} channel Optionally only copy a single channel from the array.
		 *  @return {Array}
		 */Tone.Buffer.prototype.toMono=function(chanNum){if(Tone.isNumber(chanNum)){this.fromArray(this.toArray(chanNum));}else{var outputArray=new Float32Array(this.length);var numChannels=this.numberOfChannels;for(var channel=0;channel<numChannels;channel++){var channelArray=this.toArray(channel);for(var i=0;i<channelArray.length;i++){outputArray[i]+=channelArray[i];}}//divide by the number of channels
outputArray=outputArray.map(function(sample){return sample/numChannels;});this.fromArray(outputArray);}return this;};/**
		 * 	Get the buffer as an array. Single channel buffers will return a 1-dimensional
		 * 	Float32Array, and multichannel buffers will return multidimensional arrays.
		 *  @param {Number=} channel Optionally only copy a single channel from the array.
		 *  @return {Array}
		 */Tone.Buffer.prototype.toArray=function(channel){if(Tone.isNumber(channel)){return this.getChannelData(channel);}else if(this.numberOfChannels===1){return this.toArray(0);}else{var ret=[];for(var c=0;c<this.numberOfChannels;c++){ret[c]=this.getChannelData(c);}return ret;}};/**
		 *  Returns the Float32Array representing the PCM audio data for the specific channel.
		 *  @param  {Number}  channel  The channel number to return
		 *  @return  {Float32Array}  The audio as a TypedArray
		 */Tone.Buffer.prototype.getChannelData=function(channel){return this._buffer.getChannelData(channel);};/**
		 *  Cut a subsection of the array and return a buffer of the
		 *  subsection. Does not modify the original buffer
		 *  @param {Time} start The time to start the slice
		 *  @param {Time=} end The end time to slice. If none is given
		 *                     will default to the end of the buffer
		 *  @return {Tone.Buffer} this
		 */Tone.Buffer.prototype.slice=function(start,end){end=Tone.defaultArg(end,this.duration);var startSamples=Math.floor(this.context.sampleRate*this.toSeconds(start));var endSamples=Math.floor(this.context.sampleRate*this.toSeconds(end));var replacement=[];for(var i=0;i<this.numberOfChannels;i++){replacement[i]=this.toArray(i).slice(startSamples,endSamples);}var retBuffer=new Tone.Buffer().fromArray(replacement);return retBuffer;};/**
		 *  Reverse the buffer.
		 *  @private
		 *  @return {Tone.Buffer} this
		 */Tone.Buffer.prototype._reverse=function(){if(this.loaded){for(var i=0;i<this.numberOfChannels;i++){Array.prototype.reverse.call(this.getChannelData(i));}}return this;};/**
		 * Reverse the buffer.
		 * @memberOf Tone.Buffer#
		 * @type {Boolean}
		 * @name reverse
		 */Object.defineProperty(Tone.Buffer.prototype,'reverse',{get:function get(){return this._reversed;},set:function set(rev){if(this._reversed!==rev){this._reversed=rev;this._reverse();}}});///////////////////////////////////////////////////////////////////////////
// STATIC METHODS
///////////////////////////////////////////////////////////////////////////
//statically inherits Emitter methods
Tone.Emitter.mixin(Tone.Buffer);/**
		 *  the static queue for all of the xhr requests
		 *  @type {Array}
		 *  @private
		 */Tone.Buffer._downloadQueue=[];/**
		 *  A path which is prefixed before every url.
		 *  @type  {String}
		 *  @static
		 */Tone.Buffer.baseUrl='';/**
		 *  Create a Tone.Buffer from the array. To create a multichannel AudioBuffer,
		 *  pass in a multidimensional array.
		 *  @param {Float32Array} array The array to fill the audio buffer
		 *  @return {Tone.Buffer} A Tone.Buffer created from the array
		 */Tone.Buffer.fromArray=function(array){return new Tone.Buffer().fromArray(array);};/**
		 * Creates a Tone.Buffer from a URL, returns a promise
		 * which resolves to a Tone.Buffer
		 * @param  {String} url The url to load.
		 * @return {Promise<Tone.Buffer>}     A promise which resolves to a Tone.Buffer
		 */Tone.Buffer.fromUrl=function(url){var buffer=new Tone.Buffer();return buffer.load(url).then(function(){return buffer;});};/**
		 * Remove an xhr request from the download queue
		 * @private
		 */Tone.Buffer._removeFromDownloadQueue=function(request){var index=Tone.Buffer._downloadQueue.indexOf(request);if(index!==-1){Tone.Buffer._downloadQueue.splice(index,1);}};/**
		 *  Loads a url using XMLHttpRequest.
		 *  @param {String} url
		 *  @param {Function} onload
		 *  @param {Function} onerror
		 *  @param {Function} onprogress
		 *  @return {XMLHttpRequest}
		 */Tone.Buffer.load=function(url,onload,onerror){//default
onload=Tone.defaultArg(onload,Tone.noOp);// test if the url contains multiple extensions
var matches=url.match(/\[(.+\|?)+\]$/);if(matches){var extensions=matches[1].split('|');var extension=extensions[0];for(var i=0;i<extensions.length;i++){if(Tone.Buffer.supportsType(extensions[i])){extension=extensions[i];break;}}url=url.replace(matches[0],extension);}function onError(e){Tone.Buffer._removeFromDownloadQueue(request);Tone.Buffer.emit('error',e);if(onerror){onerror(e);}else{throw e;}}function onProgress(){//calculate the progress
var totalProgress=0;for(var i=0;i<Tone.Buffer._downloadQueue.length;i++){totalProgress+=Tone.Buffer._downloadQueue[i].progress;}Tone.Buffer.emit('progress',totalProgress/Tone.Buffer._downloadQueue.length);}var request=new XMLHttpRequest();request.open('GET',Tone.Buffer.baseUrl+url,true);request.responseType='arraybuffer';//start out as 0
request.progress=0;Tone.Buffer._downloadQueue.push(request);request.addEventListener('load',function(){if(request.status===200){Tone.context.decodeAudioData(request.response).then(function(buff){request.progress=1;onProgress();onload(buff);Tone.Buffer._removeFromDownloadQueue(request);if(Tone.Buffer._downloadQueue.length===0){//emit the event at the end
Tone.Buffer.emit('load');}}).catch(function(){Tone.Buffer._removeFromDownloadQueue(request);onError('Tone.Buffer: could not decode audio data: '+url);});}else{onError('Tone.Buffer: could not locate file: '+url);}});request.addEventListener('error',onError);request.addEventListener('progress',function(event){if(event.lengthComputable){//only go to 95%, the last 5% is when the audio is decoded
request.progress=event.loaded/event.total*0.95;onProgress();}});request.send();return request;};/**
		 *  Stop all of the downloads in progress
		 *  @return {Tone.Buffer}
		 *  @static
		 */Tone.Buffer.cancelDownloads=function(){Tone.Buffer._downloadQueue.slice().forEach(function(request){Tone.Buffer._removeFromDownloadQueue(request);request.abort();});return Tone.Buffer;};/**
		 *  Checks a url's extension to see if the current browser can play that file type.
		 *  @param {String} url The url/extension to test
		 *  @return {Boolean} If the file extension can be played
		 *  @static
		 *  @example
		 * Tone.Buffer.supportsType("wav"); //returns true
		 * Tone.Buffer.supportsType("path/to/file.wav"); //returns true
		 */Tone.Buffer.supportsType=function(url){var extension=url.split('.');extension=extension[extension.length-1];var response=document.createElement('audio').canPlayType('audio/'+extension);return response!=='';};/**
		 *  Returns a Promise which resolves when all of the buffers have loaded
		 *  @return {Promise}
		 */Tone.loaded=function(){var onload,onerror;function removeEvents(){//remove the events when it's resolved
Tone.Buffer.off('load',onload);Tone.Buffer.off('error',onerror);}return new Promise(function(success,fail){onload=function onload(){success();};onerror=function onerror(){fail();};//add the event listeners
Tone.Buffer.on('load',onload);Tone.Buffer.on('error',onerror);}).then(removeEvents).catch(function(e){removeEvents();throw new Error(e);});};return Tone.Buffer;});Module(function(Tone){/**
		 *  @class Wrapper around the native fire-and-forget OscillatorNode. Adds the
		 *     ability to reschedule the stop method.
		 *  @extends {Tone.AudioNode}
		 *  @param  {AudioBuffer|Tone.Buffer}  buffer   The buffer to play
		 *  @param  {Function}  onload  The callback to invoke when the
		 *                               buffer is done playing.
		 */Tone.OscillatorNode=function(){var options=Tone.defaults(arguments,['frequency','type'],Tone.OscillatorNode);Tone.AudioNode.call(this,options);/**
			 *  The callback to invoke after the
			 *  buffer source is done playing.
			 *  @type  {Function}
			 */this.onended=options.onended;/**
			 *  The oscillator start time
			 *  @type  {Number}
			 *  @private
			 */this._startTime=-1;/**
			 *  The oscillator stop time
			 *  @type  {Number}
			 *  @private
			 */this._stopTime=-1;/**
			 *  The gain node which envelopes the OscillatorNode
			 *  @type  {Tone.Gain}
			 *  @private
			 */this._gainNode=this.output=new Tone.Gain();this._gainNode.gain.setValueAtTime(0,this.context.currentTime);/**
			 *  The oscillator
			 *  @type  {OscillatorNode}
			 *  @private
			 */this._oscillator=this.context.createOscillator();this._oscillator.connect(this._gainNode);this.type=options.type;/**
			 *  The frequency of the oscillator
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=new Tone.Param(this._oscillator.frequency,Tone.Type.Frequency);this.frequency.value=options.frequency;/**
			 *  The detune of the oscillator
			 *  @type {Frequency}
			 *  @signal
			 */this.detune=new Tone.Param(this._oscillator.detune,Tone.Type.Cents);this.detune.value=options.detune;/**
			 *  The value that the buffer ramps to
			 *  @type {Gain}
			 *  @private
			 */this._gain=1;};Tone.extend(Tone.OscillatorNode,Tone.AudioNode);/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */Tone.OscillatorNode.defaults={'frequency':440,'detune':0,'type':'sine','onended':Tone.noOp};/**
		 *  Returns the playback state of the oscillator, either "started" or "stopped".
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.OscillatorNode#
		 *  @name state
		 */Object.defineProperty(Tone.OscillatorNode.prototype,'state',{get:function get(){return this.getStateAtTime(this.now());}});/**
		 *  Get the playback state at the given time
		 *  @param  {Time}  time  The time to test the state at
		 *  @return  {Tone.State}  The playback state. 
		 */Tone.OscillatorNode.prototype.getStateAtTime=function(time){time=this.toSeconds(time);if(this._startTime!==-1&&time>=this._startTime&&(this._stopTime===-1||time<=this._stopTime)){return Tone.State.Started;}else{return Tone.State.Stopped;}};/**
	     * Start the oscillator node at the given time
	     * @param  {Time=} time When to start the oscillator
	     * @return {OscillatorNode}      this
	     */Tone.OscillatorNode.prototype.start=function(time){if(this._startTime===-1){this._startTime=this.toSeconds(time);this._oscillator.start(this._startTime);var now=this.context.currentTime;this._gainNode.gain.cancelScheduledValues(now);this._gainNode.gain.setValueAtTime(0,now);this._gainNode.gain.setValueAtTime(1,this._startTime);}else{throw new Error('cannot call OscillatorNode.start more than once');}return this;};/**
	     * Sets an arbitrary custom periodic waveform given a PeriodicWave.
	     * @param  {PeriodicWave} periodicWave PeriodicWave should be created with context.createPeriodicWave
	     * @return {OscillatorNode} this
	     */Tone.OscillatorNode.prototype.setPeriodicWave=function(periodicWave){this._oscillator.setPeriodicWave(periodicWave);return this;};/**
	     * Stop the oscillator node at the given time
	     * @param  {Time=} time When to stop the oscillator
	     * @return {OscillatorNode}      this
	     */Tone.OscillatorNode.prototype.stop=function(time){//cancel the previous stop
this.cancelStop();//reschedule it
this._stopTime=this.toSeconds(time);this._gainNode.gain.setValueAtTime(0,this._stopTime);this.context.clearTimeout(this._timeout);this._timeout=this.context.setTimeout(function(){this._oscillator.stop(this.now());this.onended();}.bind(this),this._stopTime-this.now());return this;};/**
		 *  Cancel a scheduled stop event
		 *  @return  {Tone.OscillatorNode}  this
		 */Tone.OscillatorNode.prototype.cancelStop=function(){if(this._startTime!==-1){//cancel the stop envelope
this._gainNode.gain.cancelScheduledValues(this._startTime+this.sampleTime);this._gainNode.gain.setValueAtTime(1,Math.max(this.now(),this._startTime));this.context.clearTimeout(this._timeout);this._stopTime=-1;}return this;};/**
		 * The oscillator type. Either 'sine', 'sawtooth', 'square', or 'triangle'
		 * @memberOf Tone.OscillatorNode#
		 * @type {Time}
		 * @name type
		 */Object.defineProperty(Tone.OscillatorNode.prototype,'type',{get:function get(){return this._oscillator.type;},set:function set(type){this._oscillator.type=type;}});/**
		 *  Clean up.
		 *  @return  {Tone.OscillatorNode}  this
		 */Tone.OscillatorNode.prototype.dispose=function(){this.context.clearTimeout(this._timeout);Tone.AudioNode.prototype.dispose.call(this);this.onended=null;this._oscillator.disconnect();this._oscillator=null;this._gainNode.dispose();this._gainNode=null;this.frequency.dispose();this.frequency=null;this.detune.dispose();this.detune=null;return this;};return Tone.OscillatorNode;});Module(function(Tone){/**
		 *  @class Tone.Oscillator supports a number of features including
		 *         phase rotation, multiple oscillator types (see Tone.Oscillator.type),
		 *         and Transport syncing (see Tone.Oscillator.syncFrequency).
		 *
		 *  @constructor
		 *  @extends {Tone.Source}
		 *  @param {Frequency} [frequency] Starting frequency
		 *  @param {string} [type] The oscillator type. Read more about type below.
		 *  @example
		 * //make and start a 440hz sine tone
		 * var osc = new Tone.Oscillator(440, "sine").toMaster().start();
		 */Tone.Oscillator=function(){var options=Tone.defaults(arguments,['frequency','type'],Tone.Oscillator);Tone.Source.call(this,options);/**
			 *  the main oscillator
			 *  @type {OscillatorNode}
			 *  @private
			 */this._oscillator=null;/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=new Tone.Signal(options.frequency,Tone.Type.Frequency);/**
			 *  The detune control signal.
			 *  @type {Cents}
			 *  @signal
			 */this.detune=new Tone.Signal(options.detune,Tone.Type.Cents);/**
			 *  the periodic wave
			 *  @type {PeriodicWave}
			 *  @private
			 */this._wave=null;/**
			 *  The partials of the oscillator
			 *  @type {Array}
			 *  @private
			 */this._partials=Tone.defaultArg(options.partials,[1]);/**
			 *  the phase of the oscillator
			 *  between 0 - 360
			 *  @type {number}
			 *  @private
			 */this._phase=options.phase;/**
			 *  the type of the oscillator
			 *  @type {string}
			 *  @private
			 */this._type=null;//setup
this.type=options.type;this.phase=this._phase;this._readOnly(['frequency','detune']);};Tone.extend(Tone.Oscillator,Tone.Source);/**
		 *  the default parameters
		 *  @type {Object}
		 */Tone.Oscillator.defaults={'type':'sine','frequency':440,'detune':0,'phase':0,'partials':[]};/**
		 *  The Oscillator types
		 *  @enum {String}
		 */Tone.Oscillator.Type={Sine:'sine',Triangle:'triangle',Sawtooth:'sawtooth',Square:'square',Custom:'custom'};/**
		 *  start the oscillator
		 *  @param  {Time} [time=now]
		 *  @private
		 */Tone.Oscillator.prototype._start=function(time){//new oscillator with previous values
this._oscillator=new Tone.OscillatorNode();if(this._wave){this._oscillator.setPeriodicWave(this._wave);}else{this._oscillator.type=this._type;}//connect the control signal to the oscillator frequency & detune
this._oscillator.connect(this.output);this.frequency.connect(this._oscillator.frequency);this.detune.connect(this._oscillator.detune);//start the oscillator
time=this.toSeconds(time);this._oscillator.start(time);};/**
		 *  stop the oscillator
		 *  @private
		 *  @param  {Time} [time=now] (optional) timing parameter
		 *  @returns {Tone.Oscillator} this
		 */Tone.Oscillator.prototype._stop=function(time){if(this._oscillator){time=this.toSeconds(time);this._oscillator.stop(time);}return this;};/**
		 * Restart the oscillator. Does not stop the oscillator, but instead
		 * just cancels any scheduled 'stop' from being invoked.
		 * @param  {Time=} time
		 * @return {Tone.Oscillator}      this
		 */Tone.Oscillator.prototype.restart=function(time){this._oscillator.cancelStop();this._state.cancel(this.toSeconds(time));return this;};/**
		 *  Sync the signal to the Transport's bpm. Any changes to the transports bpm,
		 *  will also affect the oscillators frequency.
		 *  @returns {Tone.Oscillator} this
		 *  @example
		 * Tone.Transport.bpm.value = 120;
		 * osc.frequency.value = 440;
		 * //the ration between the bpm and the frequency will be maintained
		 * osc.syncFrequency();
		 * Tone.Transport.bpm.value = 240;
		 * // the frequency of the oscillator is doubled to 880
		 */Tone.Oscillator.prototype.syncFrequency=function(){Tone.Transport.syncSignal(this.frequency);return this;};/**
		 *  Unsync the oscillator's frequency from the Transport.
		 *  See Tone.Oscillator.syncFrequency
		 *  @returns {Tone.Oscillator} this
		 */Tone.Oscillator.prototype.unsyncFrequency=function(){Tone.Transport.unsyncSignal(this.frequency);return this;};/**
		 * The type of the oscillator: either sine, square, triangle, or sawtooth. Also capable of
		 * setting the first x number of partials of the oscillator. For example: "sine4" would
		 * set be the first 4 partials of the sine wave and "triangle8" would set the first
		 * 8 partials of the triangle wave.
		 * <br><br>
		 * Uses PeriodicWave internally even for native types so that it can set the phase.
		 * PeriodicWave equations are from the
		 * [Webkit Web Audio implementation](https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/modules/webaudio/PeriodicWave.cpp&sq=package:chromium).
		 *
		 * @memberOf Tone.Oscillator#
		 * @type {string}
		 * @name type
		 * @example
		 * //set it to a square wave
		 * osc.type = "square";
		 * @example
		 * //set the first 6 partials of a sawtooth wave
		 * osc.type = "sawtooth6";
		 */Object.defineProperty(Tone.Oscillator.prototype,'type',{get:function get(){return this._type;},set:function set(type){var isBasicType=[Tone.Oscillator.Type.Sine,Tone.Oscillator.Type.Square,Tone.Oscillator.Type.Triangle,Tone.Oscillator.Type.Sawtooth].includes(type);if(this._phase===0&&isBasicType){this._wave=null;//just go with the basic approach
if(this._oscillator!==null){this._oscillator.type===type;}}else{var coefs=this._getRealImaginary(type,this._phase);var periodicWave=this.context.createPeriodicWave(coefs[0],coefs[1]);this._wave=periodicWave;if(this._oscillator!==null){this._oscillator.setPeriodicWave(this._wave);}}this._type=type;}});/**
		 *  Returns the real and imaginary components based
		 *  on the oscillator type.
		 *  @returns {Array} [real, imaginary]
		 *  @private
		 */Tone.Oscillator.prototype._getRealImaginary=function(type,phase){var fftSize=4096;var periodicWaveSize=fftSize/2;var real=new Float32Array(periodicWaveSize);var imag=new Float32Array(periodicWaveSize);var partialCount=1;if(type===Tone.Oscillator.Type.Custom){partialCount=this._partials.length+1;periodicWaveSize=partialCount;}else{var partial=/^(sine|triangle|square|sawtooth)(\d+)$/.exec(type);if(partial){partialCount=parseInt(partial[2])+1;type=partial[1];partialCount=Math.max(partialCount,2);periodicWaveSize=partialCount;}}for(var n=1;n<periodicWaveSize;++n){var piFactor=2/(n*Math.PI);var b;switch(type){case Tone.Oscillator.Type.Sine:b=n<=partialCount?1:0;break;case Tone.Oscillator.Type.Square:b=n&1?2*piFactor:0;break;case Tone.Oscillator.Type.Sawtooth:b=piFactor*(n&1?1:-1);break;case Tone.Oscillator.Type.Triangle:if(n&1){b=2*(piFactor*piFactor)*(n-1>>1&1?-1:1);}else{b=0;}break;case Tone.Oscillator.Type.Custom:b=this._partials[n-1];break;default:throw new TypeError('Tone.Oscillator: invalid type: '+type);}if(b!==0){real[n]=-b*Math.sin(phase*n);imag[n]=b*Math.cos(phase*n);}else{real[n]=0;imag[n]=0;}}return[real,imag];};/**
		 *  Compute the inverse FFT for a given phase.
		 *  @param  {Float32Array}  real
		 *  @param  {Float32Array}  imag
		 *  @param  {NormalRange}  phase
		 *  @return  {AudioRange}
		 *  @private
		 */Tone.Oscillator.prototype._inverseFFT=function(real,imag,phase){var sum=0;var len=real.length;for(var i=0;i<len;i++){sum+=real[i]*Math.cos(i*phase)+imag[i]*Math.sin(i*phase);}return sum;};/**
		 *  Returns the initial value of the oscillator.
		 *  @return  {AudioRange}
		 *  @private
		 */Tone.Oscillator.prototype._getInitialValue=function(){var coefs=this._getRealImaginary(this._type,0);var real=coefs[0];var imag=coefs[1];var maxValue=0;var twoPi=Math.PI*2;//check for peaks in 8 places
for(var i=0;i<8;i++){maxValue=Math.max(this._inverseFFT(real,imag,i/8*twoPi),maxValue);}return-this._inverseFFT(real,imag,this._phase)/maxValue;};/**
		 * The partials of the waveform. A partial represents
		 * the amplitude at a harmonic. The first harmonic is the
		 * fundamental frequency, the second is the octave and so on
		 * following the harmonic series.
		 * Setting this value will automatically set the type to "custom".
		 * The value is an empty array when the type is not "custom".
		 * @memberOf Tone.Oscillator#
		 * @type {Array}
		 * @name partials
		 * @example
		 * osc.partials = [1, 0.2, 0.01];
		 */Object.defineProperty(Tone.Oscillator.prototype,'partials',{get:function get(){if(this._type!==Tone.Oscillator.Type.Custom){return[];}else{return this._partials;}},set:function set(partials){this._partials=partials;this.type=Tone.Oscillator.Type.Custom;}});/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.Oscillator#
		 * @type {Degrees}
		 * @name phase
		 * @example
		 * osc.phase = 180; //flips the phase of the oscillator
		 */Object.defineProperty(Tone.Oscillator.prototype,'phase',{get:function get(){return this._phase*(180/Math.PI);},set:function set(phase){this._phase=phase*Math.PI/180;//reset the type
this.type=this._type;}});/**
		 *  Dispose and disconnect.
		 *  @return {Tone.Oscillator} this
		 */Tone.Oscillator.prototype.dispose=function(){Tone.Source.prototype.dispose.call(this);if(this._oscillator!==null){this._oscillator.dispose();this._oscillator=null;}this._wave=null;this._writable(['frequency','detune']);this.frequency.dispose();this.frequency=null;this.detune.dispose();this.detune=null;this._partials=null;return this;};return Tone.Oscillator;});Module(function(Tone){/**
		 *  @class AudioToGain converts an input in AudioRange [-1,1] to NormalRange [0,1]. 
		 *         See Tone.GainToAudio.
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 *  var a2g = new Tone.AudioToGain();
		 */Tone.AudioToGain=function(){Tone.SignalBase.call(this);/**
			 *  @type {WaveShaperNode}
			 *  @private
			 */this._norm=this.input=this.output=new Tone.WaveShaper(function(x){return(x+1)/2;});};Tone.extend(Tone.AudioToGain,Tone.SignalBase);/**
		 *  clean up
		 *  @returns {Tone.AudioToGain} this
		 */Tone.AudioToGain.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._norm.dispose();this._norm=null;return this;};return Tone.AudioToGain;});Module(function(Tone){/**
		 *  @class Tone.Zero outputs 0's at audio-rate. The reason this has to be
		 *         it's own class is that many browsers optimize out Tone.Signal
		 *         with a value of 0 and will not process nodes further down the graph.
		 *  @extends {Tone.SignalBase}
		 */Tone.Zero=function(){Tone.SignalBase.call(this);/**
			 *  The gain node
			 *  @type  {Tone.Gain}
			 *  @private
			 */this._gain=this.input=this.output=new Tone.Gain();this.context.getConstant(0).connect(this._gain);};Tone.extend(Tone.Zero,Tone.SignalBase);/**
		 *  clean up
		 *  @return  {Tone.Zero}  this
		 */Tone.Zero.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._gain.dispose();this._gain=null;return this;};return Tone.Zero;});Module(function(Tone){/**
		 *  @class  LFO stands for low frequency oscillator. Tone.LFO produces an output signal
		 *          which can be attached to an AudioParam or Tone.Signal
		 *          in order to modulate that parameter with an oscillator. The LFO can
		 *          also be synced to the transport to start/stop and change when the tempo changes.
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @param {Frequency|Object} [frequency] The frequency of the oscillation. Typically, LFOs will be
		 *                               in the frequency range of 0.1 to 10 hertz.
		 *  @param {number=} min The minimum output value of the LFO.
		 *  @param {number=} max The maximum value of the LFO.
		 *  @example
		 * var lfo = new Tone.LFO("4n", 400, 4000);
		 * lfo.connect(filter.frequency);
		 */Tone.LFO=function(){var options=Tone.defaults(arguments,['frequency','min','max'],Tone.LFO);Tone.AudioNode.call(this);/**
			 *  The oscillator.
			 *  @type {Tone.Oscillator}
			 *  @private
			 */this._oscillator=new Tone.Oscillator({'frequency':options.frequency,'type':options.type});/**
			 *  the lfo's frequency
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=this._oscillator.frequency;/**
			 * The amplitude of the LFO, which controls the output range between
			 * the min and max output. For example if the min is -10 and the max
			 * is 10, setting the amplitude to 0.5 would make the LFO modulate
			 * between -5 and 5.
			 * @type {Number}
			 * @signal
			 */this.amplitude=this._oscillator.volume;this.amplitude.units=Tone.Type.NormalRange;this.amplitude.value=options.amplitude;/**
			 *  The signal which is output when the LFO is stopped
			 *  @type  {Tone.Signal}
			 *  @private
			 */this._stoppedSignal=new Tone.Signal(0,Tone.Type.AudioRange);/**
			 *  Just outputs zeros.
			 *  @type {Tone.Zero}
			 *  @private
			 */this._zeros=new Tone.Zero();/**
			 *  The value that the LFO outputs when it's stopped
			 *  @type {AudioRange}
			 *  @private
			 */this._stoppedValue=0;/**
			 *  @type {Tone.AudioToGain}
			 *  @private
			 */this._a2g=new Tone.AudioToGain();/**
			 *  @type {Tone.Scale}
			 *  @private
			 */this._scaler=this.output=new Tone.Scale(options.min,options.max);/**
			 *  the units of the LFO (used for converting)
			 *  @type {Tone.Type}
			 *  @private
			 */this._units=Tone.Type.Default;this.units=options.units;//connect it up
this._oscillator.chain(this._a2g,this._scaler);this._zeros.connect(this._a2g);this._stoppedSignal.connect(this._a2g);this._readOnly(['amplitude','frequency']);this.phase=options.phase;};Tone.extend(Tone.LFO,Tone.AudioNode);/**
		 *  the default parameters
		 *
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.LFO.defaults={'type':'sine','min':0,'max':1,'phase':0,'frequency':'4n','amplitude':1,'units':Tone.Type.Default};/**
		 *  Start the LFO.
		 *  @param  {Time} [time=now] the time the LFO will start
		 *  @returns {Tone.LFO} this
		 */Tone.LFO.prototype.start=function(time){time=this.toSeconds(time);this._stoppedSignal.setValueAtTime(0,time);this._oscillator.start(time);return this;};/**
		 *  Stop the LFO.
		 *  @param  {Time} [time=now] the time the LFO will stop
		 *  @returns {Tone.LFO} this
		 */Tone.LFO.prototype.stop=function(time){time=this.toSeconds(time);this._stoppedSignal.setValueAtTime(this._stoppedValue,time);this._oscillator.stop(time);return this;};/**
		 *  Sync the start/stop/pause to the transport
		 *  and the frequency to the bpm of the transport
		 *  @returns {Tone.LFO} this
		 *  @example
		 *  lfo.frequency.value = "8n";
		 *  lfo.sync().start(0)
		 *  //the rate of the LFO will always be an eighth note,
		 *  //even as the tempo changes
		 */Tone.LFO.prototype.sync=function(){this._oscillator.sync();this._oscillator.syncFrequency();return this;};/**
		 *  unsync the LFO from transport control
		 *  @returns {Tone.LFO} this
		 */Tone.LFO.prototype.unsync=function(){this._oscillator.unsync();this._oscillator.unsyncFrequency();return this;};/**
		 * The miniumum output of the LFO.
		 * @memberOf Tone.LFO#
		 * @type {number}
		 * @name min
		 */Object.defineProperty(Tone.LFO.prototype,'min',{get:function get(){return this._toUnits(this._scaler.min);},set:function set(min){min=this._fromUnits(min);this._scaler.min=min;}});/**
		 * The maximum output of the LFO.
		 * @memberOf Tone.LFO#
		 * @type {number}
		 * @name max
		 */Object.defineProperty(Tone.LFO.prototype,'max',{get:function get(){return this._toUnits(this._scaler.max);},set:function set(max){max=this._fromUnits(max);this._scaler.max=max;}});/**
		 * The type of the oscillator: sine, square, sawtooth, triangle.
		 * @memberOf Tone.LFO#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.LFO.prototype,'type',{get:function get(){return this._oscillator.type;},set:function set(type){this._oscillator.type=type;this._stoppedValue=this._oscillator._getInitialValue();this._stoppedSignal.value=this._stoppedValue;}});/**
		 * The phase of the LFO.
		 * @memberOf Tone.LFO#
		 * @type {number}
		 * @name phase
		 */Object.defineProperty(Tone.LFO.prototype,'phase',{get:function get(){return this._oscillator.phase;},set:function set(phase){this._oscillator.phase=phase;this._stoppedValue=this._oscillator._getInitialValue();this._stoppedSignal.value=this._stoppedValue;}});/**
		 * The output units of the LFO.
		 * @memberOf Tone.LFO#
		 * @type {Tone.Type}
		 * @name units
		 */Object.defineProperty(Tone.LFO.prototype,'units',{get:function get(){return this._units;},set:function set(val){var currentMin=this.min;var currentMax=this.max;//convert the min and the max
this._units=val;this.min=currentMin;this.max=currentMax;}});/**
		 * Mute the output.
		 * @memberOf Tone.LFO#
		 * @type {Boolean}
		 * @name mute
		 */Object.defineProperty(Tone.LFO.prototype,'mute',{get:function get(){return this._oscillator.mute;},set:function set(mute){this._oscillator.mute=mute;}});/**
		 *  Returns the playback state of the source, either "started" or "stopped".
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.LFO#
		 *  @name state
		 */Object.defineProperty(Tone.LFO.prototype,'state',{get:function get(){return this._oscillator.state;}});/**
		 *  Connect the output of the LFO to an AudioParam, AudioNode, or Tone Node.
		 *  Tone.LFO will automatically convert to the destination units of the
		 *  will get the units from the connected node.
		 *  @param  {Tone | AudioParam | AudioNode} node
		 *  @param {number} [outputNum=0] optionally which output to connect from
		 *  @param {number} [inputNum=0] optionally which input to connect to
		 *  @returns {Tone.LFO} this
		 *  @private
		 */Tone.LFO.prototype.connect=function(node){if(node.constructor===Tone.Signal||node.constructor===Tone.Param){this.convert=node.convert;this.units=node.units;}Tone.SignalBase.prototype.connect.apply(this,arguments);return this;};/**
		 *  private method borrowed from Param converts
		 *  units from their destination value
		 *  @function
		 *  @private
		 */Tone.LFO.prototype._fromUnits=Tone.Param.prototype._fromUnits;/**
		 *  private method borrowed from Param converts
		 *  units to their destination value
		 *  @function
		 *  @private
		 */Tone.LFO.prototype._toUnits=Tone.Param.prototype._toUnits;/**
		 *  disconnect and dispose
		 *  @returns {Tone.LFO} this
		 */Tone.LFO.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._writable(['amplitude','frequency']);this._oscillator.dispose();this._oscillator=null;this._stoppedSignal.dispose();this._stoppedSignal=null;this._zeros.dispose();this._zeros=null;this._scaler.dispose();this._scaler=null;this._a2g.dispose();this._a2g=null;this.frequency=null;this.amplitude=null;return this;};return Tone.LFO;});Module(function(Tone){/**
		 *  @class Tone.Limiter will limit the loudness of an incoming signal.
		 *         It is composed of a Tone.Compressor with a fast attack
		 *         and release. Limiters are commonly used to safeguard against
		 *         signal clipping. Unlike a compressor, limiters do not provide
		 *         smooth gain reduction and almost completely prevent
		 *         additional gain above the threshold.
		 *
		 *  @extends {Tone.AudioNode}
		 *  @constructor
		 *  @param {number} threshold The theshold above which the limiting is applied.
		 *  @example
		 *  var limiter = new Tone.Limiter(-6);
		 */Tone.Limiter=function(){var options=Tone.defaults(arguments,['threshold'],Tone.Limiter);Tone.AudioNode.call(this);/**
			 *  the compressor
			 *  @private
			 *  @type {Tone.Compressor}
			 */this._compressor=this.input=this.output=new Tone.Compressor({'attack':0.001,'decay':0.001,'threshold':options.threshold});/**
			 * The threshold of of the limiter
			 * @type {Decibel}
			 * @signal
			 */this.threshold=this._compressor.threshold;this._readOnly('threshold');};Tone.extend(Tone.Limiter,Tone.AudioNode);/**
		 *  The default value
		 *  @type {Object}
		 *  @const
		 *  @static
		 */Tone.Limiter.defaults={'threshold':-12};/**
		 *  Clean up.
		 *  @returns {Tone.Limiter} this
		 */Tone.Limiter.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._compressor.dispose();this._compressor=null;this._writable('threshold');this.threshold=null;return this;};return Tone.Limiter;});Module(function(Tone){/**
		 *  @class Tone.Lowpass is a lowpass feedback comb filter. It is similar to
		 *         Tone.FeedbackCombFilter, but includes a lowpass filter.
		 *
		 *  @extends {Tone.AudioNode}
		 *  @constructor
		 *  @param {Time|Object} [delayTime] The delay time of the comb filter
		 *  @param {NormalRange=} resonance The resonance (feedback) of the comb filter
		 *  @param {Frequency=} dampening The cutoff of the lowpass filter dampens the
		 *                                signal as it is fedback.
		 */Tone.LowpassCombFilter=function(){var options=Tone.defaults(arguments,['delayTime','resonance','dampening'],Tone.LowpassCombFilter);Tone.AudioNode.call(this);this.createInsOuts(1,1);/**
			 *  the delay node
			 *  @type {DelayNode}
			 *  @private
			 */this._delay=this.input=new Tone.Delay(options.delayTime);/**
			 *  The delayTime of the comb filter.
			 *  @type {Time}
			 *  @signal
			 */this.delayTime=this._delay.delayTime;/**
			 *  the lowpass filter
			 *  @type  {BiquadFilterNode}
			 *  @private
			 */this._lowpass=this.output=this.context.createBiquadFilter();this._lowpass.Q.value=-3.0102999566398125;this._lowpass.type='lowpass';/**
			 *  The dampening control of the feedback
			 *  @type {Frequency}
			 *  @signal
			 */this.dampening=new Tone.Param({'param':this._lowpass.frequency,'units':Tone.Type.Frequency,'value':options.dampening});/**
			 *  the feedback gain
			 *  @type {Tone.Gain}
			 *  @private
			 */this._feedback=new Tone.Gain(options.resonance,Tone.Type.NormalRange);/**
			 *  The amount of feedback of the delayed signal.
			 *  @type {NormalRange}
			 *  @signal
			 */this.resonance=this._feedback.gain;//connections
this._delay.chain(this._lowpass,this._feedback,this._delay);this._readOnly(['dampening','resonance','delayTime']);};Tone.extend(Tone.LowpassCombFilter,Tone.AudioNode);/**
		 *  the default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.LowpassCombFilter.defaults={'delayTime':0.1,'resonance':0.5,'dampening':3000};/**
		 *  Clean up.
		 *  @returns {Tone.LowpassCombFilter} this
		 */Tone.LowpassCombFilter.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._writable(['dampening','resonance','delayTime']);this.dampening.dispose();this.dampening=null;this.resonance.dispose();this.resonance=null;this._delay.dispose();this._delay=null;this.delayTime=null;this._lowpass.disconnect();this._lowpass=null;this._feedback.disconnect();this._feedback=null;return this;};return Tone.LowpassCombFilter;});Module(function(Tone){/**
		 *  @class  Tone.Merge brings two signals into the left and right
		 *          channels of a single stereo channel.
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @example
		 * var merge = new Tone.Merge().toMaster();
		 * //routing a sine tone in the left channel
		 * //and noise in the right channel
		 * var osc = new Tone.Oscillator().connect(merge.left);
		 * var noise = new Tone.Noise().connect(merge.right);
		 * //starting our oscillators
		 * noise.start();
		 * osc.start();
		 */Tone.Merge=function(){Tone.AudioNode.call(this);this.createInsOuts(2,0);/**
			 *  The left input channel.
			 *  Alias for <code>input[0]</code>
			 *  @type {GainNode}
			 */this.left=this.input[0]=new Tone.Gain();/**
			 *  The right input channel.
			 *  Alias for <code>input[1]</code>.
			 *  @type {GainNode}
			 */this.right=this.input[1]=new Tone.Gain();/**
			 *  the merger node for the two channels
			 *  @type {ChannelMergerNode}
			 *  @private
			 */this._merger=this.output=this.context.createChannelMerger(2);//connections
this.left.connect(this._merger,0,0);this.right.connect(this._merger,0,1);this.left.channelCount=1;this.right.channelCount=1;this.left.channelCountMode='explicit';this.right.channelCountMode='explicit';};Tone.extend(Tone.Merge,Tone.AudioNode);/**
		 *  Clean up.
		 *  @returns {Tone.Merge} this
		 */Tone.Merge.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this.left.dispose();this.left=null;this.right.dispose();this.right=null;this._merger.disconnect();this._merger=null;return this;};return Tone.Merge;});Module(function(Tone){/**
		 *  @class  Tone.Meter gets the [RMS](https://en.wikipedia.org/wiki/Root_mean_square)
		 *          of an input signal with some averaging applied. It can also get the raw
		 *          value of the input signal.
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @param {Number} smoothing The amount of smoothing applied between frames.
		 *  @example
		 * var meter = new Tone.Meter();
		 * var mic = new Tone.UserMedia().open();
		 * //connect mic to the meter
		 * mic.connect(meter);
		 * //the current level of the mic input in decibels
		 * var level = meter.getValue();
		 */Tone.Meter=function(){var options=Tone.defaults(arguments,['smoothing'],Tone.Meter);Tone.AudioNode.call(this);/**
			 *  The analyser node which computes the levels.
			 *  @private
			 *  @type  {Tone.Analyser}
			 */this.input=this.output=this._analyser=new Tone.Analyser('waveform',1024);/**
			 *  The amount of carryover between the current and last frame.
			 *  Only applied meter for "level" type.
			 *  @type  {Number}
			 */this.smoothing=options.smoothing;};Tone.extend(Tone.Meter,Tone.AudioNode);/**
		 *  The defaults
		 *  @type {Object}
		 *  @static
		 *  @const
		 */Tone.Meter.defaults={'smoothing':0.8};/**
		 *  Get the current decibel value of the incoming signal
		 *  @returns {Decibels}
		 */Tone.Meter.prototype.getLevel=function(){this._analyser.type='fft';var values=this._analyser.getValue();var offset=28;// normalizes most signal levels
// TODO: compute loudness from FFT
return Math.max.apply(this,values)+offset;};/**
		 *  Get the signal value of the incoming signal
		 *  @returns {Number}
		 */Tone.Meter.prototype.getValue=function(){this._analyser.type='waveform';var value=this._analyser.getValue();return value[0];};/**
		 * A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame.
		 * @memberOf Tone.Meter#
		 * @type {Number}
		 * @name smoothing
		 * @readOnly
		 */Object.defineProperty(Tone.Meter.prototype,'smoothing',{get:function get(){return this._analyser.smoothing;},set:function set(val){this._analyser.smoothing=val;}});/**
		 *  Clean up.
		 *  @returns {Tone.Meter} this
		 */Tone.Meter.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._analyser.dispose();this._analyser=null;return this;};return Tone.Meter;});Module(function(Tone){/**
		 *	@class  Tone.Split splits an incoming signal into left and right channels.
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @example
		 * var split = new Tone.Split();
		 * stereoSignal.connect(split);
		 */Tone.Split=function(){Tone.AudioNode.call(this);this.createInsOuts(0,2);/**
			 *  @type {ChannelSplitterNode}
			 *  @private
			 */this._splitter=this.input=this.context.createChannelSplitter(2);this._splitter.channelCount=2;this._splitter.channelCountMode='explicit';/**
			 *  Left channel output.
			 *  Alias for <code>output[0]</code>
			 *  @type {Tone.Gain}
			 */this.left=this.output[0]=new Tone.Gain();/**
			 *  Right channel output.
			 *  Alias for <code>output[1]</code>
			 *  @type {Tone.Gain}
			 */this.right=this.output[1]=new Tone.Gain();//connections
this._splitter.connect(this.left,0,0);this._splitter.connect(this.right,1,0);};Tone.extend(Tone.Split,Tone.AudioNode);/**
		 *  Clean up.
		 *  @returns {Tone.Split} this
		 */Tone.Split.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._splitter.disconnect();this.left.dispose();this.left=null;this.right.dispose();this.right=null;this._splitter=null;return this;};return Tone.Split;});Module(function(Tone){/**
		 *  @class Mid/Side processing separates the the 'mid' signal
		 *         (which comes out of both the left and the right channel)
		 *         and the 'side' (which only comes out of the the side channels). <br><br>
		 *         <code>
		 *         Mid = (Left+Right)/sqrt(2);   // obtain mid-signal from left and right<br>
		 *         Side = (Left-Right)/sqrt(2);   // obtain side-signal from left and righ<br>
		 *         </code>
		 *
		 *  @extends {Tone.AudioNode}
		 *  @constructor
		 */Tone.MidSideSplit=function(){Tone.AudioNode.call(this);this.createInsOuts(0,2);/**
			 *  split the incoming signal into left and right channels
			 *  @type  {Tone.Split}
			 *  @private
			 */this._split=this.input=new Tone.Split();/**
			 *  The mid send. Connect to mid processing. Alias for
			 *  <code>output[0]</code>
			 *  @type {Tone.Add}
			 */this._midAdd=new Tone.Add();/**
			 * Multiply the _midAdd by sqrt(1/2)
			 * @type {Tone.Multiply}
			 */this.mid=this.output[0]=new Tone.Multiply(Math.SQRT1_2);/**
			 *  The side output. Connect to side processing. Also Output 1
			 *  @type {Tone.Subtract}
			 */this._sideSubtract=new Tone.Subtract();/**
			 * Multiply the _midAdd by sqrt(1/2)
			 * @type {Tone.Multiply}
			 */this.side=this.output[1]=new Tone.Multiply(Math.SQRT1_2);this._split.connect(this._midAdd,0,0);this._split.connect(this._midAdd,1,1);this._split.connect(this._sideSubtract,0,0);this._split.connect(this._sideSubtract,1,1);this._midAdd.connect(this.mid);this._sideSubtract.connect(this.side);};Tone.extend(Tone.MidSideSplit,Tone.AudioNode);/**
		 *  clean up
		 *  @returns {Tone.MidSideSplit} this
		 */Tone.MidSideSplit.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this.mid.dispose();this.mid=null;this.side.dispose();this.side=null;this._midAdd.dispose();this._midAdd=null;this._sideSubtract.dispose();this._sideSubtract=null;this._split.dispose();this._split=null;return this;};return Tone.MidSideSplit;});Module(function(Tone){/**
		 *  @class Mid/Side processing separates the the 'mid' signal
		 *         (which comes out of both the left and the right channel)
		 *         and the 'side' (which only comes out of the the side channels).
		 *         MidSideMerge merges the mid and side signal after they've been seperated
		 *         by Tone.MidSideSplit.<br><br>
		 *         <code>
		 *         Left = (Mid+Side)/sqrt(2);   // obtain left signal from mid and side<br>
		 *         Right = (Mid-Side)/sqrt(2);   // obtain right signal from mid and side<br>
		 *         </code>
		 *
		 *  @extends {Tone.AudioNode}
		 *  @constructor
		 */Tone.MidSideMerge=function(){Tone.AudioNode.call(this);this.createInsOuts(2,0);/**
			 *  The mid signal input. Alias for
			 *  <code>input[0]</code>
			 *  @type  {Tone.Gain}
			 */this.mid=this.input[0]=new Tone.Gain();/**
			 *  recombine the mid/side into Left
			 *  @type {Tone.Add}
			 *  @private
			 */this._left=new Tone.Add();/**
			 * Multiply the left by sqrt(1/2)
			 * @type {Tone.Multiply}
			 */this._timesTwoLeft=new Tone.Multiply(Math.SQRT1_2);/**
			 *  The side signal input. Alias for
			 *  <code>input[1]</code>
			 *  @type  {Tone.Gain}
			 */this.side=this.input[1]=new Tone.Gain();/**
			 *  recombine the mid/side into Right
			 *  @type {Tone.Subtract}
			 *  @private
			 */this._right=new Tone.Subtract();/**
			 * Multiply the right by sqrt(1/2)
			 * @type {Tone.Multiply}
			 */this._timesTwoRight=new Tone.Multiply(Math.SQRT1_2);/**
			 *  Merge the left/right signal back into a stereo signal.
			 *  @type {Tone.Merge}
			 *  @private
			 */this._merge=this.output=new Tone.Merge();this.mid.connect(this._left,0,0);this.side.connect(this._left,0,1);this.mid.connect(this._right,0,0);this.side.connect(this._right,0,1);this._left.connect(this._timesTwoLeft);this._right.connect(this._timesTwoRight);this._timesTwoLeft.connect(this._merge,0,0);this._timesTwoRight.connect(this._merge,0,1);};Tone.extend(Tone.MidSideMerge,Tone.AudioNode);/**
		 *  clean up
		 *  @returns {Tone.MidSideMerge} this
		 */Tone.MidSideMerge.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this.mid.dispose();this.mid=null;this.side.dispose();this.side=null;this._left.dispose();this._left=null;this._timesTwoLeft.dispose();this._timesTwoLeft=null;this._right.dispose();this._right=null;this._timesTwoRight.dispose();this._timesTwoRight=null;this._merge.dispose();this._merge=null;return this;};return Tone.MidSideMerge;});Module(function(Tone){/**
		 *  @class Tone.MidSideCompressor applies two different compressors to the mid
		 *         and side signal components. See Tone.MidSideSplit.
		 *
		 *  @extends {Tone.AudioNode}
		 *  @param {Object} options The options that are passed to the mid and side
		 *                          compressors.
		 *  @constructor
		 */Tone.MidSideCompressor=function(options){Tone.AudioNode.call(this);options=Tone.defaultArg(options,Tone.MidSideCompressor.defaults);/**
			 *  the mid/side split
			 *  @type  {Tone.MidSideSplit}
			 *  @private
			 */this._midSideSplit=this.input=new Tone.MidSideSplit();/**
			 *  the mid/side recombination
			 *  @type  {Tone.MidSideMerge}
			 *  @private
			 */this._midSideMerge=this.output=new Tone.MidSideMerge();/**
			 *  The compressor applied to the mid signal
			 *  @type  {Tone.Compressor}
			 */this.mid=new Tone.Compressor(options.mid);/**
			 *  The compressor applied to the side signal
			 *  @type  {Tone.Compressor}
			 */this.side=new Tone.Compressor(options.side);this._midSideSplit.mid.chain(this.mid,this._midSideMerge.mid);this._midSideSplit.side.chain(this.side,this._midSideMerge.side);this._readOnly(['mid','side']);};Tone.extend(Tone.MidSideCompressor,Tone.AudioNode);/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */Tone.MidSideCompressor.defaults={'mid':{'ratio':3,'threshold':-24,'release':0.03,'attack':0.02,'knee':16},'side':{'ratio':6,'threshold':-30,'release':0.25,'attack':0.03,'knee':10}};/**
		 *  Clean up.
		 *  @returns {Tone.MidSideCompressor} this
		 */Tone.MidSideCompressor.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._writable(['mid','side']);this.mid.dispose();this.mid=null;this.side.dispose();this.side=null;this._midSideSplit.dispose();this._midSideSplit=null;this._midSideMerge.dispose();this._midSideMerge=null;return this;};return Tone.MidSideCompressor;});Module(function(Tone){/**
		 *  @class Tone.Mono coerces the incoming mono or stereo signal into a mono signal
		 *         where both left and right channels have the same value. This can be useful
		 *         for [stereo imaging](https://en.wikipedia.org/wiki/Stereo_imaging).
		 *
		 *  @extends {Tone.AudioNode}
		 *  @constructor
		 */Tone.Mono=function(){Tone.AudioNode.call(this);this.createInsOuts(1,0);/**
			 *  merge the signal
			 *  @type {Tone.Merge}
			 *  @private
			 */this._merge=this.output=new Tone.Merge();this.input.connect(this._merge,0,0);this.input.connect(this._merge,0,1);};Tone.extend(Tone.Mono,Tone.AudioNode);/**
		 *  clean up
		 *  @returns {Tone.Mono} this
		 */Tone.Mono.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._merge.dispose();this._merge=null;return this;};return Tone.Mono;});Module(function(Tone){/**
		 *  @class A compressor with seperate controls over low/mid/high dynamics
		 *
		 *  @extends {Tone.AudioNode}
		 *  @constructor
		 *  @param {Object} options The low/mid/high compressor settings.
		 *  @example
		 *  var multiband = new Tone.MultibandCompressor({
		 *  	"lowFrequency" : 200,
		 *  	"highFrequency" : 1300
		 *  	"low" : {
		 *  		"threshold" : -12
		 *  	}
		 *  })
		 */Tone.MultibandCompressor=function(options){Tone.AudioNode.call(this);options=Tone.defaultArg(arguments,Tone.MultibandCompressor.defaults);/**
			 *  split the incoming signal into high/mid/low
			 *  @type {Tone.MultibandSplit}
			 *  @private
			 */this._splitter=this.input=new Tone.MultibandSplit({'lowFrequency':options.lowFrequency,'highFrequency':options.highFrequency});/**
			 *  low/mid crossover frequency.
			 *  @type {Frequency}
			 *  @signal
			 */this.lowFrequency=this._splitter.lowFrequency;/**
			 *  mid/high crossover frequency.
			 *  @type {Frequency}
			 *  @signal
			 */this.highFrequency=this._splitter.highFrequency;/**
			 *  the output
			 *  @type {Tone.Gain}
			 *  @private
			 */this.output=new Tone.Gain();/**
			 *  The compressor applied to the low frequencies.
			 *  @type {Tone.Compressor}
			 */this.low=new Tone.Compressor(options.low);/**
			 *  The compressor applied to the mid frequencies.
			 *  @type {Tone.Compressor}
			 */this.mid=new Tone.Compressor(options.mid);/**
			 *  The compressor applied to the high frequencies.
			 *  @type {Tone.Compressor}
			 */this.high=new Tone.Compressor(options.high);//connect the compressor
this._splitter.low.chain(this.low,this.output);this._splitter.mid.chain(this.mid,this.output);this._splitter.high.chain(this.high,this.output);this._readOnly(['high','mid','low','highFrequency','lowFrequency']);};Tone.extend(Tone.MultibandCompressor,Tone.AudioNode);/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */Tone.MultibandCompressor.defaults={'low':Tone.Compressor.defaults,'mid':Tone.Compressor.defaults,'high':Tone.Compressor.defaults,'lowFrequency':250,'highFrequency':2000};/**
		 *  clean up
		 *  @returns {Tone.MultibandCompressor} this
		 */Tone.MultibandCompressor.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._splitter.dispose();this._writable(['high','mid','low','highFrequency','lowFrequency']);this.low.dispose();this.mid.dispose();this.high.dispose();this._splitter=null;this.low=null;this.mid=null;this.high=null;this.lowFrequency=null;this.highFrequency=null;return this;};return Tone.MultibandCompressor;});Module(function(Tone){if(Tone.supported&&!window.StereoPannerNode){/**
			 * @class Shimmed StereoPannerNode
			 * @param  {AudioContext} context
			 * @private
			 */var StereoPannerNode=function StereoPannerNode(context){/**
				 * The audio context
				 * @type {AudioContext}
				 */this.context=context;/**
				 * The left/right panning. [-1, 1]
				 * @type {AudioRange}
				 * @signal
				 */this.pan=new Tone.Signal(0,Tone.Type.AudioRange);/**
				 * Equal power scaling of the right gain
				 * @type {Tone.WaveShaper}
				 */var rightWaveShaper=new Tone.WaveShaper(function(val){return Tone.equalPowerScale((val+1)/2);},4096);/**
				 * Equal power scaling of the left gain
				 * @type {Tone.WaveShaper}
				 * @private
				 */var leftWaveShaper=new Tone.WaveShaper(function(val){return Tone.equalPowerScale(1-(val+1)/2);},4096);/**
				 * The left gain value
				 * @type {Tone.Gain}
				 * @private
				 */var leftGain=new Tone.Gain();/**
				 * The right gain value
				 * @type {Tone.Gain}
				 * @private
				 */var rightGain=new Tone.Gain();/**
				 * Split the incoming signal
				 * @type {Tone.Split}
				 * @private
				 */var split=this.input=new Tone.Split();/**
				 * Keeps the waveshapers from optimizing 0s
				 * @type {Tone.Zero}
				 * @private
				 */var zero=new Tone.Zero();zero.fan(rightWaveShaper,leftWaveShaper);/**
				 * Merge the outgoing signal
				 * @type {Tone.Merge}
				 * @private
				 */var merge=this.output=new Tone.Merge();//connections
split.left.chain(leftGain,merge.left);split.right.chain(rightGain,merge.right);this.pan.chain(leftWaveShaper,leftGain.gain);this.pan.chain(rightWaveShaper,rightGain.gain);};StereoPannerNode.prototype.disconnect=function(){this.output.disconnect.apply(this.output,arguments);};StereoPannerNode.prototype.connect=function(){this.output.connect.apply(this.output,arguments);};//add it to the AudioContext
AudioContext.prototype.createStereoPanner=function(){return new StereoPannerNode(this);};Tone.Context.prototype.createStereoPanner=function(){return new StereoPannerNode(this);};}});Module(function(Tone){/**
		 *  @class  Tone.Panner is an equal power Left/Right Panner and does not
		 *          support 3D. Panner uses the StereoPannerNode when available.
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @param {NormalRange} [initialPan=0] The initail panner value (center).
		 *  @example
		 *  //pan the input signal hard right.
		 *  var panner = new Tone.Panner(1);
		 */Tone.Panner=function(initialPan){Tone.AudioNode.call(this);/**
			*  the panner node
			*  @type {StereoPannerNode}
			*  @private
			*/this._panner=this.input=this.output=this.context.createStereoPanner();/**
			*  The pan control. -1 = hard left, 1 = hard right.
			*  @type {AudioRange}
			*  @signal
			*/this.pan=this._panner.pan;//initial value
this.pan.value=Tone.defaultArg(initialPan,0);this._readOnly('pan');};Tone.extend(Tone.Panner,Tone.AudioNode);/**
		 *  Clean up.
		 *  @returns {Tone.Panner} this
		 */Tone.Panner.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._writable('pan');this._panner.disconnect();this._panner=null;this.pan=null;return this;};return Tone.Panner;});Module(function(Tone){/**
		 *  @class  A spatialized panner node which supports equalpower or HRTF panning.
		 *          Tries to normalize the API across various browsers. See Tone.Listener
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @param {Number} positionX The initial x position.
		 *  @param {Number} positionY The initial y position.
		 *  @param {Number} positionZ The initial z position.
		 */Tone.Panner3D=function(){var options=Tone.defaults(arguments,['positionX','positionY','positionZ'],Tone.Panner3D);Tone.AudioNode.call(this);/**
			 *  The panner node
			 *  @type {PannerNode}
			 *  @private
			 */this._panner=this.input=this.output=this.context.createPanner();//set some values
this._panner.panningModel=options.panningModel;this._panner.maxDistance=options.maxDistance;this._panner.distanceModel=options.distanceModel;this._panner.coneOuterGain=options.coneOuterGain;this._panner.coneOuterAngle=options.coneOuterAngle;this._panner.coneInnerAngle=options.coneInnerAngle;this._panner.refDistance=options.refDistance;this._panner.rolloffFactor=options.rolloffFactor;/**
			 *  Holds the current orientation
			 *  @type  {Array}
			 *  @private
			 */this._orientation=[options.orientationX,options.orientationY,options.orientationZ];/**
			 *  Holds the current position
			 *  @type  {Array}
			 *  @private
			 */this._position=[options.positionX,options.positionY,options.positionZ];// set the default position/orientation
this.orientationX=options.orientationX;this.orientationY=options.orientationY;this.orientationZ=options.orientationZ;this.positionX=options.positionX;this.positionY=options.positionY;this.positionZ=options.positionZ;};Tone.extend(Tone.Panner3D,Tone.AudioNode);/**
		 *  Defaults according to the specification
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.Panner3D.defaults={'positionX':0,'positionY':0,'positionZ':0,'orientationX':0,'orientationY':0,'orientationZ':0,'panningModel':'equalpower','maxDistance':10000,'distanceModel':'inverse','coneOuterGain':0,'coneOuterAngle':360,'coneInnerAngle':360,'refDistance':1,'rolloffFactor':1};/**
		 * The ramp time which is applied to the setTargetAtTime
		 * @type {Number}
		 * @private
		 */Tone.Panner3D.prototype._rampTimeConstant=0.01;/**
		 *  Sets the position of the source in 3d space.
		 *  @param  {Number}  x
		 *  @param  {Number}  y
		 *  @param  {Number}  z
		 *  @return {Tone.Panner3D} this
		 */Tone.Panner3D.prototype.setPosition=function(x,y,z){if(this._panner.positionX){var now=this.now();this._panner.positionX.setTargetAtTime(x,now,this._rampTimeConstant);this._panner.positionY.setTargetAtTime(y,now,this._rampTimeConstant);this._panner.positionZ.setTargetAtTime(z,now,this._rampTimeConstant);}else{this._panner.setPosition(x,y,z);}this._position=Array.prototype.slice.call(arguments);return this;};/**
		 *  Sets the orientation of the source in 3d space.
		 *  @param  {Number}  x
		 *  @param  {Number}  y
		 *  @param  {Number}  z
		 *  @return {Tone.Panner3D} this
		 */Tone.Panner3D.prototype.setOrientation=function(x,y,z){if(this._panner.orientationX){var now=this.now();this._panner.orientationX.setTargetAtTime(x,now,this._rampTimeConstant);this._panner.orientationY.setTargetAtTime(y,now,this._rampTimeConstant);this._panner.orientationZ.setTargetAtTime(z,now,this._rampTimeConstant);}else{this._panner.setOrientation(x,y,z);}this._orientation=Array.prototype.slice.call(arguments);return this;};/**
		 *  The x position of the panner object.
		 *  @type {Number}
		 *  @memberOf Tone.Panner3D#
		 *  @name positionX
		 */Object.defineProperty(Tone.Panner3D.prototype,'positionX',{set:function set(pos){this._position[0]=pos;this.setPosition.apply(this,this._position);},get:function get(){return this._position[0];}});/**
		 *  The y position of the panner object.
		 *  @type {Number}
		 *  @memberOf Tone.Panner3D#
		 *  @name positionY
		 */Object.defineProperty(Tone.Panner3D.prototype,'positionY',{set:function set(pos){this._position[1]=pos;this.setPosition.apply(this,this._position);},get:function get(){return this._position[1];}});/**
		 *  The z position of the panner object.
		 *  @type {Number}
		 *  @memberOf Tone.Panner3D#
		 *  @name positionZ
		 */Object.defineProperty(Tone.Panner3D.prototype,'positionZ',{set:function set(pos){this._position[2]=pos;this.setPosition.apply(this,this._position);},get:function get(){return this._position[2];}});/**
		 *  The x orientation of the panner object.
		 *  @type {Number}
		 *  @memberOf Tone.Panner3D#
		 *  @name orientationX
		 */Object.defineProperty(Tone.Panner3D.prototype,'orientationX',{set:function set(pos){this._orientation[0]=pos;this.setOrientation.apply(this,this._orientation);},get:function get(){return this._orientation[0];}});/**
		 *  The y orientation of the panner object.
		 *  @type {Number}
		 *  @memberOf Tone.Panner3D#
		 *  @name orientationY
		 */Object.defineProperty(Tone.Panner3D.prototype,'orientationY',{set:function set(pos){this._orientation[1]=pos;this.setOrientation.apply(this,this._orientation);},get:function get(){return this._orientation[1];}});/**
		 *  The z orientation of the panner object.
		 *  @type {Number}
		 *  @memberOf Tone.Panner3D#
		 *  @name orientationZ
		 */Object.defineProperty(Tone.Panner3D.prototype,'orientationZ',{set:function set(pos){this._orientation[2]=pos;this.setOrientation.apply(this,this._orientation);},get:function get(){return this._orientation[2];}});/**
		 *  Proxy a property on the panner to an exposed public propery
		 *  @param  {String}  prop
		 *  @private
		 */Tone.Panner3D._aliasProperty=function(prop){Object.defineProperty(Tone.Panner3D.prototype,prop,{set:function set(val){this._panner[prop]=val;},get:function get(){return this._panner[prop];}});};/**
		 *  The panning model. Either "equalpower" or "HRTF".
		 *  @type {String}
		 *  @memberOf Tone.Panner3D#
		 *  @name panningModel
		 */Tone.Panner3D._aliasProperty('panningModel');/**
		 *  A reference distance for reducing volume as source move further from the listener
		 *  @type {Number}
		 *  @memberOf Tone.Panner3D#
		 *  @name refDistance
		 */Tone.Panner3D._aliasProperty('refDistance');/**
		 *  Describes how quickly the volume is reduced as source moves away from listener.
		 *  @type {Number}
		 *  @memberOf Tone.Panner3D#
		 *  @name rolloffFactor
		 */Tone.Panner3D._aliasProperty('rolloffFactor');/**
		 *  The distance model used by,  "linear", "inverse", or "exponential".
		 *  @type {String}
		 *  @memberOf Tone.Panner3D#
		 *  @name distanceModel
		 */Tone.Panner3D._aliasProperty('distanceModel');/**
		 *  The angle, in degrees, inside of which there will be no volume reduction
		 *  @type {Degrees}
		 *  @memberOf Tone.Panner3D#
		 *  @name coneInnerAngle
		 */Tone.Panner3D._aliasProperty('coneInnerAngle');/**
		 *  The angle, in degrees, outside of which the volume will be reduced
		 *  to a constant value of coneOuterGain
		 *  @type {Degrees}
		 *  @memberOf Tone.Panner3D#
		 *  @name coneOuterAngle
		 */Tone.Panner3D._aliasProperty('coneOuterAngle');/**
		 *  The gain outside of the coneOuterAngle
		 *  @type {Gain}
		 *  @memberOf Tone.Panner3D#
		 *  @name coneOuterGain
		 */Tone.Panner3D._aliasProperty('coneOuterGain');/**
		 *  The maximum distance between source and listener,
		 *  after which the volume will not be reduced any further.
		 *  @type {Positive}
		 *  @memberOf Tone.Panner3D#
		 *  @name maxDistance
		 */Tone.Panner3D._aliasProperty('maxDistance');/**
		 *  Clean up.
		 *  @returns {Tone.Panner3D} this
		 */Tone.Panner3D.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._panner.disconnect();this._panner=null;this._orientation=null;this._position=null;return this;};return Tone.Panner3D;});Module(function(Tone){/**
		 *  @class Tone.PanVol is a Tone.Panner and Tone.Volume in one.
		 *
		 *  @extends {Tone.AudioNode}
		 *  @constructor
		 *  @param {AudioRange} pan the initial pan
		 *  @param {number} volume The output volume.
		 *  @example
		 * //pan the incoming signal left and drop the volume
		 * var panVol = new Tone.PanVol(-0.25, -12);
		 */Tone.PanVol=function(){var options=Tone.defaults(arguments,['pan','volume'],Tone.PanVol);Tone.AudioNode.call(this);/**
			 *  The panning node
			 *  @type {Tone.Panner}
			 *  @private
			 */this._panner=this.input=new Tone.Panner(options.pan);/**
			 *  The L/R panning control.
			 *  @type {AudioRange}
			 *  @signal
			 */this.pan=this._panner.pan;/**
			 *  The volume node
			 *  @type {Tone.Volume}
			 *  @private
			 */this._volume=this.output=new Tone.Volume(options.volume);/**
			 *  The volume control in decibels.
			 *  @type {Decibels}
			 *  @signal
			 */this.volume=this._volume.volume;//connections
this._panner.connect(this._volume);this.mute=options.mute;this._readOnly(['pan','volume']);};Tone.extend(Tone.PanVol,Tone.AudioNode);/**
		 *  The defaults
		 *  @type  {Object}
		 *  @const
		 *  @static
		 */Tone.PanVol.defaults={'pan':0,'volume':0,'mute':false};/**
		 * Mute/unmute the volume
		 * @memberOf Tone.PanVol#
		 * @name mute
		 * @type {Boolean}
		 */Object.defineProperty(Tone.PanVol.prototype,'mute',{get:function get(){return this._volume.mute;},set:function set(mute){this._volume.mute=mute;}});/**
		 *  clean up
		 *  @returns {Tone.PanVol} this
		 */Tone.PanVol.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._writable(['pan','volume']);this._panner.dispose();this._panner=null;this.pan=null;this._volume.dispose();this._volume=null;this.volume=null;return this;};return Tone.PanVol;});Module(function(Tone){/**
		 *  @class Tone.Solo lets you isolate a specific audio stream. When
		 *         an instance is set to `solo=true`, it will mute all other instances.
		 *  @extends {Tone.AudioNode}
		 *  @example
		 * var soloA = new Tone.Solo()
		 * var soloB = new Tone.Solo()
		 * soloA.solo = true
		 * //no audio will pass through soloB
		 */Tone.Solo=function(){var options=Tone.defaults(arguments,['solo'],Tone.Solo);Tone.AudioNode.call(this);/**
			 *  The input and output node
			 *  @type  {Tone.Gain}
			 */this.input=this.output=new Tone.Gain();/**
			 *  A bound _soloed method
			 *  @type  {Function}
			 *  @private
			 */this._soloBind=this._soloed.bind(this);//listen for solo events class-wide.
this.context.on('solo',this._soloBind);//set initially
this.solo=options.solo;};Tone.extend(Tone.Solo,Tone.AudioNode);/**
		 *  The defaults
		 *  @type  {Object}
		 *  @static
		 */Tone.Solo.defaults={solo:false};/**
		 *  Isolates this instance and mutes all other instances of Tone.Solo.
		 *  Only one instance can be soloed at a time. A soloed
		 *  instance will report `solo=false` when another instance is soloed.
		 *  @memberOf Tone.Solo#
		 *  @type {Boolean}
		 *  @name solo
		 */Object.defineProperty(Tone.Solo.prototype,'solo',{get:function get(){return this._isSoloed();},set:function set(solo){if(solo){this._addSolo();}else{this._removeSolo();}this.context.emit('solo',this);}});/**
		 *  If the current instance is muted, i.e. another instance is soloed
		 *  @memberOf Tone.Solo#
		 *  @type {Boolean}
		 *  @name muted
		 *  @readOnly
		 */Object.defineProperty(Tone.Solo.prototype,'muted',{get:function get(){return this.input.gain.value===0;}});/**
		 * Add this to the soloed array
		 * @private
		 */Tone.Solo.prototype._addSolo=function(){if(!Tone.isArray(this.context._currentSolo)){this.context._currentSolo=[];}if(!this._isSoloed()){this.context._currentSolo.push(this);}};/**
		 * Remove this from the soloed array
		 * @private
		 */Tone.Solo.prototype._removeSolo=function(){if(this._isSoloed()){var index=this.context._currentSolo.indexOf(this);this.context._currentSolo.splice(index,1);}};/**
		 * @return {Boolean} Is this on the soloed array
		 * @private
		 */Tone.Solo.prototype._isSoloed=function(){if(Tone.isArray(this.context._currentSolo)){return this.context._currentSolo.length!==0&&this.context._currentSolo.indexOf(this)!==-1;}else{return false;}};/**
		 * @return {Boolean} Returns true if no one is soloed
		 * @private
		 */Tone.Solo.prototype._noSolos=function(){return!Tone.isArray(this.context._currentSolo)||this.context._currentSolo.length===0;};/**
		 *  Solo the current instance and unsolo all other instances.
		 *  @param  {Tone.Solo}  instance  The instance which is being soloed/unsoloed.
		 *  @private
		 */Tone.Solo.prototype._soloed=function(){if(this._isSoloed()){this.input.gain.value=1;}else if(this._noSolos()){//no one is soloed
this.input.gain.value=1;}else{this.input.gain.value=0;}};/**
		 *  Clean up
		 *  @return  {Tone.Solo}  this
		 */Tone.Solo.prototype.dispose=function(){this.context.off('solo',this._soloBind);this._removeSolo();this._soloBind=null;Tone.AudioNode.prototype.dispose.call(this);return this;};return Tone.Solo;});Module(function(Tone){/**
		 *  @class  Get the current waveform data of the connected audio source.
		 *  @extends {Tone.AudioNode}
		 *  @param {Number=} size The size of the FFT. Value must be a power of
		 *                       two in the range 32 to 32768.
		 */Tone.Waveform=function(){var options=Tone.defaults(arguments,['size'],Tone.Waveform);options.type=Tone.Analyser.Type.Waveform;Tone.AudioNode.call(this);/**
			 *  The analyser node.
			 *  @private
			 *  @type {Tone.Analyser}
			 */this._analyser=this.input=this.output=new Tone.Analyser(options);};Tone.extend(Tone.Waveform,Tone.AudioNode);/**
		 *  The default values.
		 *  @type {Object}
		 *  @const
		 */Tone.Waveform.defaults={'size':1024};/**
		 *  Gets the waveform of the audio source. Returns the waveform data
		 *  of length [size](#size) as a Float32Array with values between -1 and 1.
		 *  @returns {TypedArray}
		 */Tone.Waveform.prototype.getValue=function(){return this._analyser.getValue();};/**
		 *  The size of analysis. This must be a power of two in the range 32 to 32768.
		 *  @memberOf Tone.Waveform#
		 *  @type {Number}
		 *  @name size
		 */Object.defineProperty(Tone.Waveform.prototype,'size',{get:function get(){return this._analyser.size;},set:function set(size){this._analyser.size=size;}});/**
		 *  Clean up.
		 *  @return  {Tone.Waveform}  this
		 */Tone.Waveform.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._analyser.dispose();this._analyser=null;};return Tone.Waveform;});Module(function(Tone){/**
		 *  @class Tone.CtrlInterpolate will interpolate between given values based
		 *         on the "index" property. Passing in an array or object literal
		 *         will interpolate each of the parameters. Note (i.e. "C3")
		 *         and Time (i.e. "4n + 2") can be interpolated. All other values are
		 *         assumed to be numbers. 
		 *  @example
		 * var interp = new Tone.CtrlInterpolate([0, 2, 9, 4]);
		 * interp.index = 0.75;
		 * interp.value; //returns 1.5
		 *
		 *  @example
		 * var interp = new Tone.CtrlInterpolate([
		 * 	[2, 4, 5],
		 * 	[9, 3, 2],
		 * ]);
		 * @param {Array} values The array of values to interpolate over
		 * @param {Positive} index The initial interpolation index.
		 * @extends {Tone}
		 */Tone.CtrlInterpolate=function(){var options=Tone.defaults(arguments,['values','index'],Tone.CtrlInterpolate);Tone.call(this);/**
			 *  The values to interpolate between
			 *  @type  {Array}
			 */this.values=options.values;/**
			 *  The interpolated index between values. For example: a value of 1.5
			 *  would interpolate equally between the value at index 1
			 *  and the value at index 2. 
			 *  @example
			 * interp.index = 0; 
			 * interp.value; //returns the value at 0
			 * interp.index = 0.5;
			 * interp.value; //returns the value between indices 0 and 1. 
			 *  @type  {Positive}
			 */this.index=options.index;};Tone.extend(Tone.CtrlInterpolate);/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */Tone.CtrlInterpolate.defaults={'index':0,'values':[]};/**
		 *  The current interpolated value based on the index
		 *  @readOnly
		 *  @memberOf Tone.CtrlInterpolate#
		 *  @type {*}
		 *  @name value
		 */Object.defineProperty(Tone.CtrlInterpolate.prototype,'value',{get:function get(){var index=this.index;index=Math.min(index,this.values.length-1);var lowerPosition=Math.floor(index);var lower=this.values[lowerPosition];var upper=this.values[Math.ceil(index)];return this._interpolate(index-lowerPosition,lower,upper);}});/**
		 *  Internal interpolation routine
		 *  @param  {NormalRange}  index  The index between the lower and upper
		 *  @param  {*}  lower 
		 *  @param  {*}  upper 
		 *  @return  {*}  The interpolated value
		 *  @private
		 */Tone.CtrlInterpolate.prototype._interpolate=function(index,lower,upper){if(Tone.isArray(lower)){var retArray=[];for(var i=0;i<lower.length;i++){retArray[i]=this._interpolate(index,lower[i],upper[i]);}return retArray;}else if(Tone.isObject(lower)){var retObj={};for(var attr in lower){retObj[attr]=this._interpolate(index,lower[attr],upper[attr]);}return retObj;}else{lower=this._toNumber(lower);upper=this._toNumber(upper);return(1-index)*lower+index*upper;}};/**
		 *  Convert from the given type into a number
		 *  @param  {Number|String}  value
		 *  @return  {Number}
		 *  @private
		 */Tone.CtrlInterpolate.prototype._toNumber=function(val){if(Tone.isNumber(val)){return val;}else{//otherwise assume that it's Time...
return this.toSeconds(val);}};/**
		 *  Clean up
		 *  @return  {Tone.CtrlInterpolate}  this
		 */Tone.CtrlInterpolate.prototype.dispose=function(){this.values=null;};return Tone.CtrlInterpolate;});Module(function(Tone){/**
		 *  @class Tone.CtrlMarkov represents a Markov Chain where each call
		 *         to Tone.CtrlMarkov.next will move to the next state. If the next
		 *         state choice is an array, the next state is chosen randomly with
		 *         even probability for all of the choices. For a weighted probability
		 *         of the next choices, pass in an object with "state" and "probability" attributes. 
		 *         The probabilities will be normalized and then chosen. If no next options
		 *         are given for the current state, the state will stay there. 
		 *  @extends {Tone}
		 *  @example
		 * var chain = new Tone.CtrlMarkov({
		 * 	"beginning" : ["end", "middle"],
		 * 	"middle" : "end"
		 * });
		 * chain.value = "beginning";
		 * chain.next(); //returns "end" or "middle" with 50% probability
		 *
		 *  @example
		 * var chain = new Tone.CtrlMarkov({
		 * 	"beginning" : [{"value" : "end", "probability" : 0.8}, 
		 * 					{"value" : "middle", "probability" : 0.2}],
		 * 	"middle" : "end"
		 * });
		 * chain.value = "beginning";
		 * chain.next(); //returns "end" with 80% probability or "middle" with 20%.
		 *  @param {Object} values An object with the state names as the keys
		 *                         and the next state(s) as the values. 
		 */Tone.CtrlMarkov=function(values,initial){Tone.call(this);/**
			 *  The Markov values with states as the keys
			 *  and next state(s) as the values. 
			 *  @type {Object}
			 */this.values=Tone.defaultArg(values,{});/**
			 *  The current state of the Markov values. The next
			 *  state will be evaluated and returned when Tone.CtrlMarkov.next
			 *  is invoked.
			 *  @type {String}
			 */this.value=Tone.defaultArg(initial,Object.keys(this.values)[0]);};Tone.extend(Tone.CtrlMarkov);/**
		 *  Returns the next state of the Markov values. 
		 *  @return  {String}
		 */Tone.CtrlMarkov.prototype.next=function(){if(this.values.hasOwnProperty(this.value)){var next=this.values[this.value];if(Tone.isArray(next)){var distribution=this._getProbDistribution(next);var rand=Math.random();var total=0;for(var i=0;i<distribution.length;i++){var dist=distribution[i];if(rand>total&&rand<total+dist){var chosen=next[i];if(Tone.isObject(chosen)){this.value=chosen.value;}else{this.value=chosen;}}total+=dist;}}else{this.value=next;}}return this.value;};/**
		 *  Choose randomly from an array weighted options in the form 
		 *  {"state" : string, "probability" : number} or an array of values
		 *  @param  {Array}  options 
		 *  @return  {Array}  The randomly selected choice
		 *  @private
		 */Tone.CtrlMarkov.prototype._getProbDistribution=function(options){var distribution=[];var total=0;var needsNormalizing=false;for(var i=0;i<options.length;i++){var option=options[i];if(Tone.isObject(option)){needsNormalizing=true;distribution[i]=option.probability;}else{distribution[i]=1/options.length;}total+=distribution[i];}if(needsNormalizing){//normalize the values
for(var j=0;j<distribution.length;j++){distribution[j]=distribution[j]/total;}}return distribution;};/**
		 *  Clean up
		 *  @return  {Tone.CtrlMarkov}  this
		 */Tone.CtrlMarkov.prototype.dispose=function(){this.values=null;};return Tone.CtrlMarkov;});Module(function(Tone){/**
		 *  @class Generate patterns from an array of values.
		 *         Has a number of arpeggiation and randomized
		 *         selection patterns. 
		 *           <ul>
		 *  	        <li>"up" - cycles upward</li>
		 *  			<li>"down" - cycles downward</li>
		 *  			<li>"upDown" - up then and down</li>
		 *  			<li>"downUp" - cycles down then and up</li>
		 *  			<li>"alternateUp" - jump up two and down one</li>
		 *  			<li>"alternateDown" - jump down two and up one</li>
		 *  			<li>"random" - randomly select an index</li>
		 *  			<li>"randomWalk" - randomly moves one index away from the current position</li>
		 *  			<li>"randomOnce" - randomly select an index without repeating until all values have been chosen.</li>
		 *     		</ul>
		 *  @param  {Array}  values   An array of options to choose from.
		 *  @param  {Tone.CtrlPattern.Type=}  type  The name of the pattern.
		 *  @extends {Tone}
		 */Tone.CtrlPattern=function(){var options=Tone.defaults(arguments,['values','type'],Tone.CtrlPattern);Tone.call(this);/**
			 *  The array of values to arpeggiate over
			 *  @type {Array}
			 */this.values=options.values;/**
			 *  The current position in the values array
			 *  @type  {Number}
			 */this.index=0;/**
			 *  The type placeholder
			 *  @type {Tone.CtrlPattern.Type}
			 *  @private
			 */this._type=null;/**
			 *  Shuffled values for the RandomOnce type
			 *  @type {Array}
			 *  @private
			 */this._shuffled=null;/**
			 *  The direction of the movement
			 *  @type {String}
			 *  @private
			 */this._direction=null;this.type=options.type;};Tone.extend(Tone.CtrlPattern);/**
		 *  The Control Patterns
		 *  @type  {Object}
		 *  @static
		 */Tone.CtrlPattern.Type={Up:'up',Down:'down',UpDown:'upDown',DownUp:'downUp',AlternateUp:'alternateUp',AlternateDown:'alternateDown',Random:'random',RandomWalk:'randomWalk',RandomOnce:'randomOnce'};/**
		 *  The default values. 
		 *  @type  {Object}
		 */Tone.CtrlPattern.defaults={'type':Tone.CtrlPattern.Type.Up,'values':[]};/**
		 *  The value at the current index of the pattern.
		 *  @readOnly
		 *  @memberOf Tone.CtrlPattern#
		 *  @type {*}
		 *  @name value
		 */Object.defineProperty(Tone.CtrlPattern.prototype,'value',{get:function get(){//some safeguards
if(this.values.length===0){return;}else if(this.values.length===1){return this.values[0];}this.index=Math.min(this.index,this.values.length-1);var val=this.values[this.index];if(this.type===Tone.CtrlPattern.Type.RandomOnce){if(this.values.length!==this._shuffled.length){this._shuffleValues();}val=this.values[this._shuffled[this.index]];}return val;}});/**
		 *  The pattern used to select the next
		 *  item from the values array
		 *  @memberOf Tone.CtrlPattern#
		 *  @type {Tone.CtrlPattern.Type}
		 *  @name type
		 */Object.defineProperty(Tone.CtrlPattern.prototype,'type',{get:function get(){return this._type;},set:function set(type){this._type=type;this._shuffled=null;//the first index
if(this._type===Tone.CtrlPattern.Type.Up||this._type===Tone.CtrlPattern.Type.UpDown||this._type===Tone.CtrlPattern.Type.RandomOnce||this._type===Tone.CtrlPattern.Type.AlternateUp){this.index=0;}else if(this._type===Tone.CtrlPattern.Type.Down||this._type===Tone.CtrlPattern.Type.DownUp||this._type===Tone.CtrlPattern.Type.AlternateDown){this.index=this.values.length-1;}//the direction
if(this._type===Tone.CtrlPattern.Type.UpDown||this._type===Tone.CtrlPattern.Type.AlternateUp){this._direction=Tone.CtrlPattern.Type.Up;}else if(this._type===Tone.CtrlPattern.Type.DownUp||this._type===Tone.CtrlPattern.Type.AlternateDown){this._direction=Tone.CtrlPattern.Type.Down;}//randoms
if(this._type===Tone.CtrlPattern.Type.RandomOnce){this._shuffleValues();}else if(this._type===Tone.CtrlPattern.Random){this.index=Math.floor(Math.random()*this.values.length);}}});/**
		 *  Return the next value given the current position
		 *  and pattern.
		 *  @return {*} The next value
		 */Tone.CtrlPattern.prototype.next=function(){var type=this.type;//choose the next index
if(type===Tone.CtrlPattern.Type.Up){this.index++;if(this.index>=this.values.length){this.index=0;}}else if(type===Tone.CtrlPattern.Type.Down){this.index--;if(this.index<0){this.index=this.values.length-1;}}else if(type===Tone.CtrlPattern.Type.UpDown||type===Tone.CtrlPattern.Type.DownUp){if(this._direction===Tone.CtrlPattern.Type.Up){this.index++;}else{this.index--;}if(this.index<0){this.index=1;this._direction=Tone.CtrlPattern.Type.Up;}else if(this.index>=this.values.length){this.index=this.values.length-2;this._direction=Tone.CtrlPattern.Type.Down;}}else if(type===Tone.CtrlPattern.Type.Random){this.index=Math.floor(Math.random()*this.values.length);}else if(type===Tone.CtrlPattern.Type.RandomWalk){if(Math.random()<0.5){this.index--;this.index=Math.max(this.index,0);}else{this.index++;this.index=Math.min(this.index,this.values.length-1);}}else if(type===Tone.CtrlPattern.Type.RandomOnce){this.index++;if(this.index>=this.values.length){this.index=0;//reshuffle the values for next time
this._shuffleValues();}}else if(type===Tone.CtrlPattern.Type.AlternateUp){if(this._direction===Tone.CtrlPattern.Type.Up){this.index+=2;this._direction=Tone.CtrlPattern.Type.Down;}else{this.index-=1;this._direction=Tone.CtrlPattern.Type.Up;}if(this.index>=this.values.length){this.index=0;this._direction=Tone.CtrlPattern.Type.Up;}}else if(type===Tone.CtrlPattern.Type.AlternateDown){if(this._direction===Tone.CtrlPattern.Type.Up){this.index+=1;this._direction=Tone.CtrlPattern.Type.Down;}else{this.index-=2;this._direction=Tone.CtrlPattern.Type.Up;}if(this.index<0){this.index=this.values.length-1;this._direction=Tone.CtrlPattern.Type.Down;}}return this.value;};/**
		 *  Shuffles the values and places the results into the _shuffled
		 *  @private
		 */Tone.CtrlPattern.prototype._shuffleValues=function(){var copy=[];this._shuffled=[];for(var i=0;i<this.values.length;i++){copy[i]=i;}while(copy.length>0){var randVal=copy.splice(Math.floor(copy.length*Math.random()),1);this._shuffled.push(randVal[0]);}};/**
		 *  Clean up
		 *  @returns {Tone.CtrlPattern} this
		 */Tone.CtrlPattern.prototype.dispose=function(){this._shuffled=null;this.values=null;};return Tone.CtrlPattern;});Module(function(Tone){/**
		 *  @class  Choose a random value.
		 *  @extends {Tone}
		 *  @example
		 * var randomWalk = new Tone.CtrlRandom({
		 * 	"min" : 0,
		 * 	"max" : 10,
		 * 	"integer" : true
		 * });
		 * randomWalk.eval();
		 *
		 *  @param {Number|Time=} min The minimum return value.
		 *  @param {Number|Time=} max The maximum return value.
		 */Tone.CtrlRandom=function(){var options=Tone.defaults(arguments,['min','max'],Tone.CtrlRandom);Tone.call(this);/**
			 *  The minimum return value
			 *  @type  {Number|Time}
			 */this.min=options.min;/**
			 *  The maximum return value
			 *  @type  {Number|Time}
			 */this.max=options.max;/**
			 *  If the return value should be an integer
			 *  @type  {Boolean}
			 */this.integer=options.integer;};Tone.extend(Tone.CtrlRandom);/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */Tone.CtrlRandom.defaults={'min':0,'max':1,'integer':false};/**
		 *  Return a random value between min and max. 
		 *  @readOnly
		 *  @memberOf Tone.CtrlRandom#
		 *  @type {*}
		 *  @name value
		 */Object.defineProperty(Tone.CtrlRandom.prototype,'value',{get:function get(){var min=this.toSeconds(this.min);var max=this.toSeconds(this.max);var rand=Math.random();var val=rand*min+(1-rand)*max;if(this.integer){val=Math.floor(val);}return val;}});return Tone.CtrlRandom;});Module(function(Tone){/**
		 *  @class A data structure for holding multiple buffers.
		 *  
		 *  @param  {Object|Array}    urls      An object literal or array
		 *                                      of urls to load.
		 *  @param  {Function=}  callback  The callback to invoke when
		 *                                 the buffers are loaded. 
		 *  @extends {Tone}
		 *  @example
		 * //load a whole bank of piano samples
		 * var pianoSamples = new Tone.Buffers({
		 * 	"C4" : "path/to/C4.mp3"
		 * 	"C#4" : "path/to/C#4.mp3"
		 * 	"D4" : "path/to/D4.mp3"
		 * 	"D#4" : "path/to/D#4.mp3"
		 * 	...
		 * }, function(){
		 * 	//play one of the samples when they all load
		 * 	player.buffer = pianoSamples.get("C4");
		 * 	player.start();
		 * });
		 * 	@example
		 * //To pass in additional parameters in the second parameter
		 * var buffers = new Tone.Buffers(urls, {
		 * 	"onload" : callback,
		 * 	"baseUrl" : "../path/to/audio/"
		 * })
		 */Tone.Buffers=function(urls){//remove the urls from the options
var args=Array.prototype.slice.call(arguments);args.shift();var options=Tone.defaults(args,['onload','baseUrl'],Tone.Buffers);Tone.call(this);/**
			 *  All of the buffers
			 *  @type  {Object}
			 *  @private
			 */this._buffers={};/**
			 *  A path which is prefixed before every url.
			 *  @type  {String}
			 */this.baseUrl=options.baseUrl;this._loadingCount=0;//add each one
for(var key in urls){this._loadingCount++;this.add(key,urls[key],this._bufferLoaded.bind(this,options.onload));}};Tone.extend(Tone.Buffers);/**
		 *  Defaults
		 *  @type  {Object}
		 */Tone.Buffers.defaults={'onload':Tone.noOp,'baseUrl':''};/**
		 *  True if the buffers object has a buffer by that name.
		 *  @param  {String|Number}  name  The key or index of the 
		 *                                 buffer.
		 *  @return  {Boolean}
		 */Tone.Buffers.prototype.has=function(name){return this._buffers.hasOwnProperty(name);};/**
		 *  Get a buffer by name. If an array was loaded, 
		 *  then use the array index.
		 *  @param  {String|Number}  name  The key or index of the 
		 *                                 buffer.
		 *  @return  {Tone.Buffer}
		 */Tone.Buffers.prototype.get=function(name){if(this.has(name)){return this._buffers[name];}else{throw new Error('Tone.Buffers: no buffer named '+name);}};/**
		 *  A buffer was loaded. decrement the counter.
		 *  @param  {Function}  callback 
		 *  @private
		 */Tone.Buffers.prototype._bufferLoaded=function(callback){this._loadingCount--;if(this._loadingCount===0&&callback){callback(this);}};/**
		 * If the buffers are loaded or not
		 * @memberOf Tone.Buffers#
		 * @type {Boolean}
		 * @name loaded
		 * @readOnly
		 */Object.defineProperty(Tone.Buffers.prototype,'loaded',{get:function get(){var isLoaded=true;for(var buffName in this._buffers){var buff=this.get(buffName);isLoaded=isLoaded&&buff.loaded;}return isLoaded;}});/**
		 *  Add a buffer by name and url to the Buffers
		 *  @param  {String}    name      A unique name to give
		 *                                the buffer
		 *  @param  {String|Tone.Buffer|Audiobuffer}  url  Either the url of the bufer, 
		 *                                                 or a buffer which will be added
		 *                                                 with the given name.
		 *  @param  {Function=}  callback  The callback to invoke 
		 *                                 when the url is loaded.
		 */Tone.Buffers.prototype.add=function(name,url,callback){callback=Tone.defaultArg(callback,Tone.noOp);if(url instanceof Tone.Buffer){this._buffers[name]=url;callback(this);}else if(url instanceof AudioBuffer){this._buffers[name]=new Tone.Buffer(url);callback(this);}else if(Tone.isString(url)){this._buffers[name]=new Tone.Buffer(this.baseUrl+url,callback);}return this;};/**
		 *  Clean up.
		 *  @return  {Tone.Buffers} this
		 */Tone.Buffers.prototype.dispose=function(){Tone.prototype.dispose.call(this);for(var name in this._buffers){this._buffers[name].dispose();}this._buffers=null;return this;};return Tone.Buffers;});Module(function(Tone){/**
		 *  buses are another way of routing audio
		 *
		 *  augments Tone.prototype to include send and recieve
		 *//**
		 *  All of the routes
		 *
		 *  @type {Object}
		 *  @static
		 *  @private
		 */var Buses={};/**
		 *  Send this signal to the channel name.
		 *  @param  {String} channelName A named channel to send the signal to.
		 *  @param  {Decibels} amount The amount of the source to send to the bus.
		 *  @return {GainNode} The gain node which connects this node to the desired channel.
		 *                     Can be used to adjust the levels of the send.
		 *  @example
		 * source.send("reverb", -12);
		 */Tone.prototype.send=function(channelName,amount){if(!Buses.hasOwnProperty(channelName)){Buses[channelName]=this.context.createGain();}amount=Tone.defaultArg(amount,0);var sendKnob=new Tone.Gain(amount,Tone.Type.Decibels);this.connect(sendKnob);sendKnob.connect(Buses[channelName]);return sendKnob;};/**
		 *  Recieve the input from the desired channelName to the input
		 *
		 *  @param  {String} channelName A named channel to send the signal to.
		 *  @param  {Number=} channelNumber The channel to connect to
		 *  @returns {Tone} this
		 *  @example
		 * reverbEffect.receive("reverb");
		 */Tone.prototype.receive=function(channelName,inputNum){if(!Buses.hasOwnProperty(channelName)){Buses[channelName]=this.context.createGain();}Buses[channelName].connect(this,0,inputNum);return this;};//remove all the send/receives when a new audio context is passed in
Tone.Context.on('init',function(context){if(context.Buses){Buses=context.Buses;}else{Buses={};context.Buses=Buses;}});return Tone;});Module(function(Tone){/**
		 *  @class Tone.Draw is useful for synchronizing visuals and audio events.
		 *         Callbacks from Tone.Transport or any of the Tone.Event classes
		 *         always happen _before_ the scheduled time and are not synchronized
		 *         to the animation frame so they are not good for triggering tightly
		 *         synchronized visuals and sound. Tone.Draw makes it easy to schedule
		 *         callbacks using the AudioContext time and uses requestAnimationFrame.
		 *         
		 *  @singleton
		 *  @extends {Tone}
		 *  @example
		 * Tone.Transport.schedule(function(time){
		 * 	//use the time argument to schedule a callback with Tone.Draw
		 * 	Tone.Draw.schedule(function(){
		 * 		//do drawing or DOM manipulation here
		 * 	}, time)
		 * }, "+0.5")
		 */Tone.Draw=function(){Tone.call(this);/**
			 *  All of the events.
			 *  @type  {Tone.Timeline}
			 *  @private
			 */this._events=new Tone.Timeline();/**
			 *  The duration after which events are not invoked.
			 *  @type  {Number}
			 *  @default 0.25
			 */this.expiration=0.25;/**
			 *  The amount of time before the scheduled time 
			 *  that the callback can be invoked. Default is
			 *  half the time of an animation frame (0.008 seconds).
			 *  @type  {Number}
			 *  @default 0.008
			 */this.anticipation=0.008;/**
			 *  The draw loop
			 *  @type  {Function}
			 *  @private
			 */this._boundDrawLoop=this._drawLoop.bind(this);};Tone.extend(Tone.Draw);/**
		 *  Schedule a function at the given time to be invoked
		 *  on the nearest animation frame.
		 *  @param  {Function}  callback  Callback is invoked at the given time.
		 *  @param  {Time}    time      The time relative to the AudioContext time
		 *                              to invoke the callback.
		 *  @return  {Tone.Draw}    this
		 */Tone.Draw.prototype.schedule=function(callback,time){this._events.add({callback:callback,time:this.toSeconds(time)});//start the draw loop on the first event
if(this._events.length===1){requestAnimationFrame(this._boundDrawLoop);}return this;};/**
		 *  Cancel events scheduled after the given time
		 *  @param  {Time=}  after  Time after which scheduled events will 
		 *                          be removed from the scheduling timeline.
		 *  @return  {Tone.Draw}  this
		 */Tone.Draw.prototype.cancel=function(after){this._events.cancel(this.toSeconds(after));return this;};/**
		 *  The draw loop
		 *  @private
		 */Tone.Draw.prototype._drawLoop=function(){var now=Tone.now();while(this._events.length&&this._events.peek().time-this.anticipation<=now){var event=this._events.shift();if(now-event.time<=this.expiration){event.callback();}}if(this._events.length>0){requestAnimationFrame(this._boundDrawLoop);}};//make a singleton
Tone.Draw=new Tone.Draw();return Tone.Draw;});Module(function(Tone){/**
		 *  @class  Both Tone.Panner3D and Tone.Listener have a position in 3D space
		 *          using a right-handed cartesian coordinate system.
		 *          The units used in the coordinate system are not defined;
		 *          these coordinates are independent/invariant of any particular
		 *          units such as meters or feet. Tone.Panner3D objects have an forward
		 *          vector representing the direction the sound is projecting. Additionally,
		 *          they have a sound cone representing how directional the sound is.
		 *          For example, the sound could be omnidirectional, in which case it would
		 *          be heard anywhere regardless of its forward, or it can be more directional
		 *          and heard only if it is facing the listener. Tone.Listener objects
		 *          (representing a person's ears) have an forward and up vector
		 *          representing in which direction the person is facing. Because both the
		 *          source stream and the listener can be moving, they both have a velocity
		 *          vector representing both the speed and direction of movement. Taken together,
		 *          these two velocities can be used to generate a doppler shift effect which changes the pitch.
		 *          <br><br>
		 *          Note: the position of the Listener will have no effect on nodes not connected to a Tone.Panner3D
		 *
		 *  @constructor
		 *  @extends {Tone}
		 *  @singleton
		 */Tone.Listener=function(){Tone.call(this);/**
			 *  Holds the current forward orientation
			 *  @type  {Array}
			 *  @private
			 */this._orientation=[0,0,0,0,0,0];/**
			 *  Holds the current position
			 *  @type  {Array}
			 *  @private
			 */this._position=[0,0,0];Tone.getContext(function(){// set the default position/forward
this.set(ListenerConstructor.defaults);}.bind(this));};Tone.extend(Tone.Listener);/**
		 *  Defaults according to the specification
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.Listener.defaults={'positionX':0,'positionY':0,'positionZ':0,'forwardX':0,'forwardY':0,'forwardZ':1,'upX':0,'upY':1,'upZ':0};/**
		 * The ramp time which is applied to the setTargetAtTime
		 * @type {Number}
		 * @private
		 */Tone.Listener.prototype._rampTimeConstant=0.01;/**
		 *  Sets the position of the listener in 3d space.
		 *  @param  {Number}  x
		 *  @param  {Number}  y
		 *  @param  {Number}  z
		 *  @return {Tone.Listener} this
		 */Tone.Listener.prototype.setPosition=function(x,y,z){if(this.context.listener.positionX){var now=this.now();this.context.listener.positionX.setTargetAtTime(x,now,this._rampTimeConstant);this.context.listener.positionY.setTargetAtTime(y,now,this._rampTimeConstant);this.context.listener.positionZ.setTargetAtTime(z,now,this._rampTimeConstant);}else{this.context.listener.setPosition(x,y,z);}this._position=Array.prototype.slice.call(arguments);return this;};/**
		 *  Sets the orientation of the listener using two vectors, the forward
		 *  vector (which direction the listener is facing) and the up vector
		 *  (which the up direction of the listener). An up vector
		 *  of 0, 0, 1 is equivalent to the listener standing up in the Z direction.
		 *  @param  {Number}  x
		 *  @param  {Number}  y
		 *  @param  {Number}  z
		 *  @param  {Number}  upX
		 *  @param  {Number}  upY
		 *  @param  {Number}  upZ
		 *  @return {Tone.Listener} this
		 */Tone.Listener.prototype.setOrientation=function(x,y,z,upX,upY,upZ){if(this.context.listener.forwardX){var now=this.now();this.context.listener.forwardX.setTargetAtTime(x,now,this._rampTimeConstant);this.context.listener.forwardY.setTargetAtTime(y,now,this._rampTimeConstant);this.context.listener.forwardZ.setTargetAtTime(z,now,this._rampTimeConstant);this.context.listener.upX.setTargetAtTime(upX,now,this._rampTimeConstant);this.context.listener.upY.setTargetAtTime(upY,now,this._rampTimeConstant);this.context.listener.upZ.setTargetAtTime(upZ,now,this._rampTimeConstant);}else{this.context.listener.setOrientation(x,y,z,upX,upY,upZ);}this._orientation=Array.prototype.slice.call(arguments);return this;};/**
		 *  The x position of the panner object.
		 *  @type {Number}
		 *  @memberOf Tone.Listener#
		 *  @name positionX
		 */Object.defineProperty(Tone.Listener.prototype,'positionX',{set:function set(pos){this._position[0]=pos;this.setPosition.apply(this,this._position);},get:function get(){return this._position[0];}});/**
		 *  The y position of the panner object.
		 *  @type {Number}
		 *  @memberOf Tone.Listener#
		 *  @name positionY
		 */Object.defineProperty(Tone.Listener.prototype,'positionY',{set:function set(pos){this._position[1]=pos;this.setPosition.apply(this,this._position);},get:function get(){return this._position[1];}});/**
		 *  The z position of the panner object.
		 *  @type {Number}
		 *  @memberOf Tone.Listener#
		 *  @name positionZ
		 */Object.defineProperty(Tone.Listener.prototype,'positionZ',{set:function set(pos){this._position[2]=pos;this.setPosition.apply(this,this._position);},get:function get(){return this._position[2];}});/**
		 *  The x coordinate of the listeners front direction. i.e.
		 *  which way they are facing.
		 *  @type {Number}
		 *  @memberOf Tone.Listener#
		 *  @name forwardX
		 */Object.defineProperty(Tone.Listener.prototype,'forwardX',{set:function set(pos){this._orientation[0]=pos;this.setOrientation.apply(this,this._orientation);},get:function get(){return this._orientation[0];}});/**
		 *  The y coordinate of the listeners front direction. i.e.
		 *  which way they are facing.
		 *  @type {Number}
		 *  @memberOf Tone.Listener#
		 *  @name forwardY
		 */Object.defineProperty(Tone.Listener.prototype,'forwardY',{set:function set(pos){this._orientation[1]=pos;this.setOrientation.apply(this,this._orientation);},get:function get(){return this._orientation[1];}});/**
		 *  The z coordinate of the listeners front direction. i.e.
		 *  which way they are facing.
		 *  @type {Number}
		 *  @memberOf Tone.Listener#
		 *  @name forwardZ
		 */Object.defineProperty(Tone.Listener.prototype,'forwardZ',{set:function set(pos){this._orientation[2]=pos;this.setOrientation.apply(this,this._orientation);},get:function get(){return this._orientation[2];}});/**
		 *  The x coordinate of the listener's up direction. i.e.
		 *  the direction the listener is standing in.
		 *  @type {Number}
		 *  @memberOf Tone.Listener#
		 *  @name upX
		 */Object.defineProperty(Tone.Listener.prototype,'upX',{set:function set(pos){this._orientation[3]=pos;this.setOrientation.apply(this,this._orientation);},get:function get(){return this._orientation[3];}});/**
		 *  The y coordinate of the listener's up direction. i.e.
		 *  the direction the listener is standing in.
		 *  @type {Number}
		 *  @memberOf Tone.Listener#
		 *  @name upY
		 */Object.defineProperty(Tone.Listener.prototype,'upY',{set:function set(pos){this._orientation[4]=pos;this.setOrientation.apply(this,this._orientation);},get:function get(){return this._orientation[4];}});/**
		 *  The z coordinate of the listener's up direction. i.e.
		 *  the direction the listener is standing in.
		 *  @type {Number}
		 *  @memberOf Tone.Listener#
		 *  @name upZ
		 */Object.defineProperty(Tone.Listener.prototype,'upZ',{set:function set(pos){this._orientation[5]=pos;this.setOrientation.apply(this,this._orientation);},get:function get(){return this._orientation[5];}});/**
		 *  Clean up.
		 *  @returns {Tone.Listener} this
		 */Tone.Listener.prototype.dispose=function(){this._orientation=null;this._position=null;return this;};//SINGLETON SETUP
var ListenerConstructor=Tone.Listener;Tone.Listener=new ListenerConstructor();Tone.Context.on('init',function(context){if(context.Listener instanceof ListenerConstructor){//a single listener object
Tone.Listener=context.Listener;}else{//make new Listener insides
Tone.Listener=new ListenerConstructor();}context.Listener=Tone.Listener;});//END SINGLETON SETUP
return Tone.Listener;});Module(function(Tone){/**
		 * Because of a bug in iOS causing the currentTime to increment
		 * before the rendering is started, sometimes it takes multiple
		 * attempts to render the audio correctly.
		 * @private
		 */function attemptRender(callback,duration,sampleRate,tries){tries=Tone.defaultArg(tries,0);var context=new Tone.OfflineContext(2,duration,sampleRate);Tone.context=context;//invoke the callback/scheduling
var response=callback(Tone.Transport);if(context.currentTime>0&&tries<1000){return attemptRender(callback,duration,sampleRate,++tries);}else{return{'response':response,'context':context};}}/**
		 *  Generate a buffer by rendering all of the Tone.js code within the callback using the OfflineAudioContext.
		 *  The OfflineAudioContext is capable of rendering much faster than real time in many cases.
		 *  The callback function also passes in an offline instance of Tone.Transport which can be used
		 *  to schedule events along the Transport. **NOTE** OfflineAudioContext has the same restrictions
		 *  as the AudioContext in that on certain platforms (like iOS) it must be invoked by an explicit
		 *  user action like a click or tap. 
		 *  @param  {Function}  callback  All Tone.js nodes which are created and scheduled within this callback are recorded into the output Buffer.
		 *  @param  {Time}  duration     the amount of time to record for.
		 *  @return  {Promise}  The promise which is invoked with the Tone.Buffer of the recorded output.
		 *  @example
		 * //render 2 seconds of the oscillator
		 * Tone.Offline(function(){
		 * 	//only nodes created in this callback will be recorded
		 * 	var oscillator = new Tone.Oscillator().toMaster().start(0)
		 * 	//schedule their events
		 * }, 2).then(function(buffer){
		 * 	//do something with the output buffer
		 * })
		 * @example
		 * //can also schedule events along the Transport
		 * //using the passed in Offline Transport
		 * Tone.Offline(function(Transport){
		 * 	var osc = new Tone.Oscillator().toMaster()
		 * 	Transport.schedule(function(time){
		 * 		osc.start(time).stop(time + 0.1)
		 * 	}, 1)
		 * 	Transport.start(0.2)
		 * }, 4).then(function(buffer){
		 * 	//do something with the output buffer
		 * })
		 */Tone.Offline=function(callback,duration){//set the OfflineAudioContext
var sampleRate=Tone.context.sampleRate;var originalContext=Tone.context;var renderRet=attemptRender(callback,duration,sampleRate);var response=renderRet.response;var context=renderRet.context;var ret;if(response instanceof Promise){//wait for the promise to resolve
ret=response.then(function(){//then render the audio
return context.render();});}else{//process the audio
ret=context.render();}//return the original AudioContext
Tone.context=originalContext;//return the audio
return ret.then(function(buffer){//wrap it in a Tone.Buffer
return new Tone.Buffer(buffer);});};return Tone.Offline;});Module(function(Tone){/**
		 * 	@class  Tone.Effect is the base class for effects. Connect the effect between
		 * 	        the effectSend and effectReturn GainNodes, then control the amount of
		 * 	        effect which goes to the output using the wet control.
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @param {NormalRange|Object} [wet] The starting wet value.
		 */Tone.Effect=function(){var options=Tone.defaults(arguments,['wet'],Tone.Effect);Tone.AudioNode.call(this);this.createInsOuts(1,1);/**
			 *  the drywet knob to control the amount of effect
			 *  @type {Tone.CrossFade}
			 *  @private
			 */this._dryWet=new Tone.CrossFade(options.wet);/**
			 *  The wet control is how much of the effected
			 *  will pass through to the output. 1 = 100% effected
			 *  signal, 0 = 100% dry signal.
			 *  @type {NormalRange}
			 *  @signal
			 */this.wet=this._dryWet.fade;/**
			 *  connect the effectSend to the input of hte effect
			 *  @type {Tone.Gain}
			 *  @private
			 */this.effectSend=new Tone.Gain();/**
			 *  connect the output of the effect to the effectReturn
			 *  @type {Tone.Gain}
			 *  @private
			 */this.effectReturn=new Tone.Gain();//connections
this.input.connect(this._dryWet.a);this.input.connect(this.effectSend);this.effectReturn.connect(this._dryWet.b);this._dryWet.connect(this.output);this._readOnly(['wet']);};Tone.extend(Tone.Effect,Tone.AudioNode);/**
		 *  @static
		 *  @type {Object}
		 */Tone.Effect.defaults={'wet':1};/**
		 *  chains the effect in between the effectSend and effectReturn
		 *  @param  {Tone} effect
		 *  @private
		 *  @returns {Tone.Effect} this
		 */Tone.Effect.prototype.connectEffect=function(effect){this.effectSend.chain(effect,this.effectReturn);return this;};/**
		 *  Clean up.
		 *  @returns {Tone.Effect} this
		 */Tone.Effect.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._dryWet.dispose();this._dryWet=null;this.effectSend.dispose();this.effectSend=null;this.effectReturn.dispose();this.effectReturn=null;this._writable(['wet']);this.wet=null;return this;};return Tone.Effect;});Module(function(Tone){/**
		 *  @class Tone.AutoFilter is a Tone.Filter with a Tone.LFO connected to the filter cutoff frequency.
		 *         Setting the LFO rate and depth allows for control over the filter modulation rate 
		 *         and depth.
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {Time|Object} [frequency] The rate of the LFO.
		 *  @param {Frequency=} baseFrequency The lower value of the LFOs oscillation
	 	 *  @param {Frequency=} octaves The number of octaves above the baseFrequency
		 *  @example
		 * //create an autofilter and start it's LFO
		 * var autoFilter = new Tone.AutoFilter("4n").toMaster().start();
		 * //route an oscillator through the filter and start it
		 * var oscillator = new Tone.Oscillator().connect(autoFilter).start();
		 */Tone.AutoFilter=function(){var options=Tone.defaults(arguments,['frequency','baseFrequency','octaves'],Tone.AutoFilter);Tone.Effect.call(this,options);/**
			 *  the lfo which drives the filter cutoff
			 *  @type {Tone.LFO}
			 *  @private
			 */this._lfo=new Tone.LFO({'frequency':options.frequency,'amplitude':options.depth});/**
			 * The range of the filter modulating between the min and max frequency. 
			 * 0 = no modulation. 1 = full modulation.
			 * @type {NormalRange}
			 * @signal
			 */this.depth=this._lfo.amplitude;/**
			 * How fast the filter modulates between min and max. 
			 * @type {Frequency}
			 * @signal
			 */this.frequency=this._lfo.frequency;/**
			 *  The filter node
			 *  @type {Tone.Filter}
			 */this.filter=new Tone.Filter(options.filter);/**
			 *  The octaves placeholder
			 *  @type {Positive}
			 *  @private
			 */this._octaves=0;//connections
this.connectEffect(this.filter);this._lfo.connect(this.filter.frequency);this.type=options.type;this._readOnly(['frequency','depth']);this.octaves=options.octaves;this.baseFrequency=options.baseFrequency;};//extend Effect
Tone.extend(Tone.AutoFilter,Tone.Effect);/**
		 *  defaults
		 *  @static
		 *  @type {Object}
		 */Tone.AutoFilter.defaults={'frequency':1,'type':'sine','depth':1,'baseFrequency':200,'octaves':2.6,'filter':{'type':'lowpass','rolloff':-12,'Q':1}};/**
		 * Start the effect.
		 * @param {Time} [time=now] When the LFO will start. 
		 * @returns {Tone.AutoFilter} this
		 */Tone.AutoFilter.prototype.start=function(time){this._lfo.start(time);return this;};/**
		 * Stop the effect.
		 * @param {Time} [time=now] When the LFO will stop. 
		 * @returns {Tone.AutoFilter} this
		 */Tone.AutoFilter.prototype.stop=function(time){this._lfo.stop(time);return this;};/**
		 * Sync the filter to the transport.
		 * @param {Time} [delay=0] Delay time before starting the effect after the
		 *                               Transport has started. 
		 * @returns {Tone.AutoFilter} this
		 */Tone.AutoFilter.prototype.sync=function(delay){this._lfo.sync(delay);return this;};/**
		 * Unsync the filter from the transport.
		 * @returns {Tone.AutoFilter} this
		 */Tone.AutoFilter.prototype.unsync=function(){this._lfo.unsync();return this;};/**
		 * Type of oscillator attached to the AutoFilter. 
		 * Possible values: "sine", "square", "triangle", "sawtooth".
		 * @memberOf Tone.AutoFilter#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.AutoFilter.prototype,'type',{get:function get(){return this._lfo.type;},set:function set(type){this._lfo.type=type;}});/**
		 * The minimum value of the filter's cutoff frequency.
		 * @memberOf Tone.AutoFilter#
		 * @type {Frequency}
		 * @name min
		 */Object.defineProperty(Tone.AutoFilter.prototype,'baseFrequency',{get:function get(){return this._lfo.min;},set:function set(freq){this._lfo.min=this.toFrequency(freq);//and set the max
this.octaves=this._octaves;}});/**
		 * The maximum value of the filter's cutoff frequency. 
		 * @memberOf Tone.AutoFilter#
		 * @type {Positive}
		 * @name octaves
		 */Object.defineProperty(Tone.AutoFilter.prototype,'octaves',{get:function get(){return this._octaves;},set:function set(oct){this._octaves=oct;this._lfo.max=this.baseFrequency*Math.pow(2,oct);}});/**
		 *  Clean up. 
		 *  @returns {Tone.AutoFilter} this
		 */Tone.AutoFilter.prototype.dispose=function(){Tone.Effect.prototype.dispose.call(this);this._lfo.dispose();this._lfo=null;this.filter.dispose();this.filter=null;this._writable(['frequency','depth']);this.frequency=null;this.depth=null;return this;};return Tone.AutoFilter;});Module(function(Tone){/**
		 *  @class Tone.AutoPanner is a Tone.Panner with an LFO connected to the pan amount. 
		 *         More on using autopanners [here](https://www.ableton.com/en/blog/autopan-chopper-effect-and-more-liveschool/).
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {Frequency|Object} [frequency] Rate of left-right oscillation. 
		 *  @example
		 * //create an autopanner and start it's LFO
		 * var autoPanner = new Tone.AutoPanner("4n").toMaster().start();
		 * //route an oscillator through the panner and start it
		 * var oscillator = new Tone.Oscillator().connect(autoPanner).start();
		 */Tone.AutoPanner=function(){var options=Tone.defaults(arguments,['frequency'],Tone.AutoPanner);Tone.Effect.call(this,options);/**
			 *  the lfo which drives the panning
			 *  @type {Tone.LFO}
			 *  @private
			 */this._lfo=new Tone.LFO({'frequency':options.frequency,'amplitude':options.depth,'min':-1,'max':1});/**
			 * The amount of panning between left and right. 
			 * 0 = always center. 1 = full range between left and right. 
			 * @type {NormalRange}
			 * @signal
			 */this.depth=this._lfo.amplitude;/**
			 *  the panner node which does the panning
			 *  @type {Tone.Panner}
			 *  @private
			 */this._panner=new Tone.Panner();/**
			 * How fast the panner modulates between left and right. 
			 * @type {Frequency}
			 * @signal
			 */this.frequency=this._lfo.frequency;//connections
this.connectEffect(this._panner);this._lfo.connect(this._panner.pan);this.type=options.type;this._readOnly(['depth','frequency']);};//extend Effect
Tone.extend(Tone.AutoPanner,Tone.Effect);/**
		 *  defaults
		 *  @static
		 *  @type {Object}
		 */Tone.AutoPanner.defaults={'frequency':1,'type':'sine','depth':1};/**
		 * Start the effect.
		 * @param {Time} [time=now] When the LFO will start. 
		 * @returns {Tone.AutoPanner} this
		 */Tone.AutoPanner.prototype.start=function(time){this._lfo.start(time);return this;};/**
		 * Stop the effect.
		 * @param {Time} [time=now] When the LFO will stop. 
		 * @returns {Tone.AutoPanner} this
		 */Tone.AutoPanner.prototype.stop=function(time){this._lfo.stop(time);return this;};/**
		 * Sync the panner to the transport.
		 * @param {Time} [delay=0] Delay time before starting the effect after the
		 *                               Transport has started. 
		 * @returns {Tone.AutoPanner} this
		 */Tone.AutoPanner.prototype.sync=function(delay){this._lfo.sync(delay);return this;};/**
		 * Unsync the panner from the transport
		 * @returns {Tone.AutoPanner} this
		 */Tone.AutoPanner.prototype.unsync=function(){this._lfo.unsync();return this;};/**
		 * Type of oscillator attached to the AutoFilter. 
		 * Possible values: "sine", "square", "triangle", "sawtooth".
		 * @memberOf Tone.AutoFilter#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.AutoPanner.prototype,'type',{get:function get(){return this._lfo.type;},set:function set(type){this._lfo.type=type;}});/**
		 *  clean up
		 *  @returns {Tone.AutoPanner} this
		 */Tone.AutoPanner.prototype.dispose=function(){Tone.Effect.prototype.dispose.call(this);this._lfo.dispose();this._lfo=null;this._panner.dispose();this._panner=null;this._writable(['depth','frequency']);this.frequency=null;this.depth=null;return this;};return Tone.AutoPanner;});Module(function(Tone){/**
		 *  @class  Tone.AutoWah connects a Tone.Follower to a bandpass filter (Tone.Filter).
		 *          The frequency of the filter is adjusted proportionally to the
		 *          incoming signal's amplitude. Inspiration from [Tuna.js](https://github.com/Dinahmoe/tuna).
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {Frequency|Object} [baseFrequency] The frequency the filter is set
		 *                                            to at the low point of the wah
		 *  @param {Positive} [octaves] The number of octaves above the baseFrequency
		 *                                the filter will sweep to when fully open
		 *  @param {Decibels} [sensitivity] The decibel threshold sensitivity for
		 *                                   the incoming signal. Normal range of -40 to 0.
		 *  @example
		 * var autoWah = new Tone.AutoWah(50, 6, -30).toMaster();
		 * //initialize the synth and connect to autowah
		 * var synth = new Synth.connect(autoWah);
		 * //Q value influences the effect of the wah - default is 2
		 * autoWah.Q.value = 6;
		 * //more audible on higher notes
		 * synth.triggerAttackRelease("C4", "8n")
		 */Tone.AutoWah=function(){var options=Tone.defaults(arguments,['baseFrequency','octaves','sensitivity'],Tone.AutoWah);Tone.Effect.call(this,options);/**
			 *  The envelope follower. Set the attack/release
			 *  timing to adjust how the envelope is followed.
			 *  @type {Tone.Follower}
			 *  @private
			 */this.follower=new Tone.Follower(options.follower);/**
			 *  scales the follower value to the frequency domain
			 *  @type {Tone}
			 *  @private
			 */this._sweepRange=new Tone.ScaleExp(0,1,0.5);/**
			 *  @type {number}
			 *  @private
			 */this._baseFrequency=options.baseFrequency;/**
			 *  @type {number}
			 *  @private
			 */this._octaves=options.octaves;/**
			 *  the input gain to adjust the sensitivity
			 *  @type {Tone.Gain}
			 *  @private
			 */this._inputBoost=new Tone.Gain();/**
			 *  @type {BiquadFilterNode}
			 *  @private
			 */this._bandpass=new Tone.Filter({'rolloff':-48,'frequency':0,'Q':options.Q});/**
			 *  @type {Tone.Filter}
			 *  @private
			 */this._peaking=new Tone.Filter(0,'peaking');this._peaking.gain.value=options.gain;/**
			 * The gain of the filter.
			 * @type {Number}
			 * @signal
			 */this.gain=this._peaking.gain;/**
			 * The quality of the filter.
			 * @type {Positive}
			 * @signal
			 */this.Q=this._bandpass.Q;//the control signal path
this.effectSend.chain(this._inputBoost,this.follower,this._sweepRange);this._sweepRange.connect(this._bandpass.frequency);this._sweepRange.connect(this._peaking.frequency);//the filtered path
this.effectSend.chain(this._bandpass,this._peaking,this.effectReturn);//set the initial value
this._setSweepRange();this.sensitivity=options.sensitivity;this._readOnly(['gain','Q']);};Tone.extend(Tone.AutoWah,Tone.Effect);/**
		 *  @static
		 *  @type {Object}
		 */Tone.AutoWah.defaults={'baseFrequency':100,'octaves':6,'sensitivity':0,'Q':2,'gain':2,'follower':{'attack':0.3,'release':0.5}};/**
		 * The number of octaves that the filter will sweep above the
		 * baseFrequency.
		 * @memberOf Tone.AutoWah#
		 * @type {Number}
		 * @name octaves
		 */Object.defineProperty(Tone.AutoWah.prototype,'octaves',{get:function get(){return this._octaves;},set:function set(octaves){this._octaves=octaves;this._setSweepRange();}});/**
		 * The base frequency from which the sweep will start from.
		 * @memberOf Tone.AutoWah#
		 * @type {Frequency}
		 * @name baseFrequency
		 */Object.defineProperty(Tone.AutoWah.prototype,'baseFrequency',{get:function get(){return this._baseFrequency;},set:function set(baseFreq){this._baseFrequency=baseFreq;this._setSweepRange();}});/**
		 * The sensitivity to control how responsive to the input signal the filter is.
		 * @memberOf Tone.AutoWah#
		 * @type {Decibels}
		 * @name sensitivity
		 */Object.defineProperty(Tone.AutoWah.prototype,'sensitivity',{get:function get(){return Tone.gainToDb(1/this._inputBoost.gain.value);},set:function set(sensitivy){this._inputBoost.gain.value=1/Tone.dbToGain(sensitivy);}});/**
		 *  sets the sweep range of the scaler
		 *  @private
		 */Tone.AutoWah.prototype._setSweepRange=function(){this._sweepRange.min=this._baseFrequency;this._sweepRange.max=Math.min(this._baseFrequency*Math.pow(2,this._octaves),this.context.sampleRate/2);};/**
		 *  Clean up.
		 *  @returns {Tone.AutoWah} this
		 */Tone.AutoWah.prototype.dispose=function(){Tone.Effect.prototype.dispose.call(this);this.follower.dispose();this.follower=null;this._sweepRange.dispose();this._sweepRange=null;this._bandpass.dispose();this._bandpass=null;this._peaking.dispose();this._peaking=null;this._inputBoost.dispose();this._inputBoost=null;this._writable(['gain','Q']);this.gain=null;this.Q=null;return this;};return Tone.AutoWah;});Module(function(Tone){/**
		 *  @class Signal-rate modulo operator. Only works in AudioRange [-1, 1] and for modulus
		 *         values in the NormalRange.
		 *
		 *  @constructor
		 *  @extends {Tone.SignalBase}
		 *  @param {NormalRange} modulus The modulus to apply.
		 *  @example
		 * var mod = new Tone.Modulo(0.2)
		 * var sig = new Tone.Signal(0.5).connect(mod);
		 * //mod outputs 0.1
		 */Tone.Modulo=function(modulus){Tone.SignalBase.call(this);this.createInsOuts(1,0);/**
			 *  A waveshaper gets the integer multiple of
			 *  the input signal and the modulus.
			 *  @private
			 *  @type {Tone.WaveShaper}
			 */this._shaper=new Tone.WaveShaper(Math.pow(2,16));/**
			 *  the integer multiple is multiplied by the modulus
			 *  @type  {Tone.Multiply}
			 *  @private
			 */this._multiply=new Tone.Multiply();/**
			 *  and subtracted from the input signal
			 *  @type  {Tone.Subtract}
			 *  @private
			 */this._subtract=this.output=new Tone.Subtract();/**
			 *  the modulus signal
			 *  @type  {Tone.Signal}
			 *  @private
			 */this._modSignal=new Tone.Signal(modulus);//connections
this.input.fan(this._shaper,this._subtract);this._modSignal.connect(this._multiply,0,0);this._shaper.connect(this._multiply,0,1);this._multiply.connect(this._subtract,0,1);this._setWaveShaper(modulus);};Tone.extend(Tone.Modulo,Tone.SignalBase);/**
		 *  @param  {number}  mod  the modulus to apply
		 *  @private
		 */Tone.Modulo.prototype._setWaveShaper=function(mod){this._shaper.setMap(function(val){var multiple=Math.floor((val+0.0001)/mod);return multiple;});};/**
		 * The modulus value.
		 * @memberOf Tone.Modulo#
		 * @type {NormalRange}
		 * @name value
		 */Object.defineProperty(Tone.Modulo.prototype,'value',{get:function get(){return this._modSignal.value;},set:function set(mod){this._modSignal.value=mod;this._setWaveShaper(mod);}});/**
		 * clean up
		 *  @returns {Tone.Modulo} this
		 */Tone.Modulo.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._shaper.dispose();this._shaper=null;this._multiply.dispose();this._multiply=null;this._subtract.dispose();this._subtract=null;this._modSignal.dispose();this._modSignal=null;return this;};return Tone.Modulo;});Module(function(Tone){/**
		 *  @class Tone.Bitcrusher downsamples the incoming signal to a different bitdepth.
		 *         Lowering the bitdepth of the signal creates distortion. Read more about Bitcrushing
		 *         on [Wikipedia](https://en.wikipedia.org/wiki/Bitcrusher).
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {Number} bits The number of bits to downsample the signal. Nominal range
		 *                       of 1 to 8.
		 *  @example
		 * //initialize crusher and route a synth through it
		 * var crusher = new Tone.BitCrusher(4).toMaster();
		 * var synth = new Tone.MonoSynth().connect(crusher);
		 */Tone.BitCrusher=function(){var options=Tone.defaults(arguments,['bits'],Tone.BitCrusher);Tone.Effect.call(this,options);var invStepSize=1/Math.pow(2,options.bits-1);/**
			 *  Subtract the input signal and the modulus of the input signal
			 *  @type {Tone.Subtract}
			 *  @private
			 */this._subtract=new Tone.Subtract();/**
			 *  The mod function
			 *  @type  {Tone.Modulo}
			 *  @private
			 */this._modulo=new Tone.Modulo(invStepSize);/**
			 *  keeps track of the bits
			 *  @type {number}
			 *  @private
			 */this._bits=options.bits;//connect it up
this.effectSend.fan(this._subtract,this._modulo);this._modulo.connect(this._subtract,0,1);this._subtract.connect(this.effectReturn);};Tone.extend(Tone.BitCrusher,Tone.Effect);/**
		 *  the default values
		 *  @static
		 *  @type {Object}
		 */Tone.BitCrusher.defaults={'bits':4};/**
		 * The bit depth of the effect. Nominal range of 1-8.
		 * @memberOf Tone.BitCrusher#
		 * @type {number}
		 * @name bits
		 */Object.defineProperty(Tone.BitCrusher.prototype,'bits',{get:function get(){return this._bits;},set:function set(bits){this._bits=bits;var invStepSize=1/Math.pow(2,bits-1);this._modulo.value=invStepSize;}});/**
		 *  Clean up.
		 *  @returns {Tone.BitCrusher} this
		 */Tone.BitCrusher.prototype.dispose=function(){Tone.Effect.prototype.dispose.call(this);this._subtract.dispose();this._subtract=null;this._modulo.dispose();this._modulo=null;return this;};return Tone.BitCrusher;});Module(function(Tone){/**
		 *  @class Tone.ChebyShev is a Chebyshev waveshaper, an effect which is good 
		 *         for making different types of distortion sounds.
		 *         Note that odd orders sound very different from even ones, 
		 *         and order = 1 is no change. 
		 *         Read more at [music.columbia.edu](http://music.columbia.edu/cmc/musicandcomputers/chapter4/04_06.php).
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {Positive|Object} [order] The order of the chebyshev polynomial. Normal range between 1-100. 
		 *  @example
		 * //create a new cheby
		 * var cheby = new Tone.Chebyshev(50);
		 * //create a monosynth connected to our cheby
		 * synth = new Tone.MonoSynth().connect(cheby);
		 */Tone.Chebyshev=function(){var options=Tone.defaults(arguments,['order'],Tone.Chebyshev);Tone.Effect.call(this,options);/**
			 *  @type {WaveShaperNode}
			 *  @private
			 */this._shaper=new Tone.WaveShaper(4096);/**
			 * holds onto the order of the filter
			 * @type {number}
			 * @private
			 */this._order=options.order;this.connectEffect(this._shaper);this.order=options.order;this.oversample=options.oversample;};Tone.extend(Tone.Chebyshev,Tone.Effect);/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.Chebyshev.defaults={'order':1,'oversample':'none'};/**
		 *  get the coefficient for that degree
		 *  @param {number} x the x value
		 *  @param   {number} degree 
		 *  @param {Object} memo memoize the computed value. 
		 *                       this speeds up computation greatly. 
		 *  @return  {number}       the coefficient 
		 *  @private
		 */Tone.Chebyshev.prototype._getCoefficient=function(x,degree,memo){if(memo.hasOwnProperty(degree)){return memo[degree];}else if(degree===0){memo[degree]=0;}else if(degree===1){memo[degree]=x;}else{memo[degree]=2*x*this._getCoefficient(x,degree-1,memo)-this._getCoefficient(x,degree-2,memo);}return memo[degree];};/**
		 * The order of the Chebyshev polynomial which creates
		 * the equation which is applied to the incoming 
		 * signal through a Tone.WaveShaper. The equations
		 * are in the form:<br>
		 * order 2: 2x^2 + 1<br>
		 * order 3: 4x^3 + 3x <br>
		 * @memberOf Tone.Chebyshev#
		 * @type {Positive}
		 * @name order
		 */Object.defineProperty(Tone.Chebyshev.prototype,'order',{get:function get(){return this._order;},set:function set(order){this._order=order;var curve=new Array(4096);var len=curve.length;for(var i=0;i<len;++i){var x=i*2/len-1;if(x===0){//should output 0 when input is 0
curve[i]=0;}else{curve[i]=this._getCoefficient(x,order,{});}}this._shaper.curve=curve;}});/**
		 * The oversampling of the effect. Can either be "none", "2x" or "4x".
		 * @memberOf Tone.Chebyshev#
		 * @type {string}
		 * @name oversample
		 */Object.defineProperty(Tone.Chebyshev.prototype,'oversample',{get:function get(){return this._shaper.oversample;},set:function set(oversampling){this._shaper.oversample=oversampling;}});/**
		 *  Clean up. 
		 *  @returns {Tone.Chebyshev} this
		 */Tone.Chebyshev.prototype.dispose=function(){Tone.Effect.prototype.dispose.call(this);this._shaper.dispose();this._shaper=null;return this;};return Tone.Chebyshev;});Module(function(Tone){/**
		 *  @class Base class for Stereo effects. Provides effectSendL/R and effectReturnL/R.
		 *
		 *	@constructor
		 *	@extends {Tone.Effect}
		 */Tone.StereoEffect=function(){//get the defaults
Tone.AudioNode.call(this);var options=Tone.defaults(arguments,['wet'],Tone.Effect);this.createInsOuts(1,1);/**
			 *  the drywet knob to control the amount of effect
			 *  @type {Tone.CrossFade}
			 *  @private
			 */this._dryWet=new Tone.CrossFade(options.wet);/**
			 *  The wet control, i.e. how much of the effected
			 *  will pass through to the output.
			 *  @type {NormalRange}
			 *  @signal
			 */this.wet=this._dryWet.fade;/**
			 *  then split it
			 *  @type {Tone.Split}
			 *  @private
			 */this._split=new Tone.Split();/**
			 *  the effects send LEFT
			 *  @type {GainNode}
			 *  @private
			 */this.effectSendL=this._split.left;/**
			 *  the effects send RIGHT
			 *  @type {GainNode}
			 *  @private
			 */this.effectSendR=this._split.right;/**
			 *  the stereo effect merger
			 *  @type {Tone.Merge}
			 *  @private
			 */this._merge=new Tone.Merge();/**
			 *  the effect return LEFT
			 *  @type {GainNode}
			 *  @private
			 */this.effectReturnL=this._merge.left;/**
			 *  the effect return RIGHT
			 *  @type {GainNode}
			 *  @private
			 */this.effectReturnR=this._merge.right;//connections
this.input.connect(this._split);//dry wet connections
this.input.connect(this._dryWet,0,0);this._merge.connect(this._dryWet,0,1);this._dryWet.connect(this.output);this._readOnly(['wet']);};Tone.extend(Tone.StereoEffect,Tone.Effect);/**
		 *  Clean up.
		 *  @returns {Tone.StereoEffect} this
		 */Tone.StereoEffect.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._dryWet.dispose();this._dryWet=null;this._split.dispose();this._split=null;this._merge.dispose();this._merge=null;this.effectSendL=null;this.effectSendR=null;this.effectReturnL=null;this.effectReturnR=null;this._writable(['wet']);this.wet=null;return this;};return Tone.StereoEffect;});Module(function(Tone){/**
		 *  @class Tone.Chorus is a stereo chorus effect composed of
		 *         a left and right delay with a Tone.LFO applied to the delayTime of each channel.
		 *         Inspiration from [Tuna.js](https://github.com/Dinahmoe/tuna/blob/master/tuna.js).
		 *         Read more on the chorus effect on [SoundOnSound](http://www.soundonsound.com/sos/jun04/articles/synthsecrets.htm).
		 *
		 *	@constructor
		 *	@extends {Tone.StereoEffect}
		 *	@param {Frequency|Object} [frequency] The frequency of the LFO.
		 *	@param {Milliseconds} [delayTime] The delay of the chorus effect in ms.
		 *	@param {NormalRange} [depth] The depth of the chorus.
		 *	@example
		 * var chorus = new Tone.Chorus(4, 2.5, 0.5);
		 * var synth = new Tone.PolySynth(4, Tone.MonoSynth).connect(chorus);
		 * synth.triggerAttackRelease(["C3","E3","G3"], "8n");
		 */Tone.Chorus=function(){var options=Tone.defaults(arguments,['frequency','delayTime','depth'],Tone.Chorus);Tone.StereoEffect.call(this,options);/**
			 *  the depth of the chorus
			 *  @type {number}
			 *  @private
			 */this._depth=options.depth;/**
			 *  the delayTime
			 *  @type {number}
			 *  @private
			 */this._delayTime=options.delayTime/1000;/**
			 *  the lfo which controls the delayTime
			 *  @type {Tone.LFO}
			 *  @private
			 */this._lfoL=new Tone.LFO({'frequency':options.frequency,'min':0,'max':1});/**
			 *  another LFO for the right side with a 180 degree phase diff
			 *  @type {Tone.LFO}
			 *  @private
			 */this._lfoR=new Tone.LFO({'frequency':options.frequency,'min':0,'max':1,'phase':180});/**
			 *  delay for left
			 *  @type {Tone.Delay}
			 *  @private
			 */this._delayNodeL=new Tone.Delay();/**
			 *  delay for right
			 *  @type {Tone.Delay}
			 *  @private
			 */this._delayNodeR=new Tone.Delay();/**
			 * The frequency of the LFO which modulates the delayTime.
			 * @type {Frequency}
			 * @signal
			 */this.frequency=this._lfoL.frequency;//connections
this.effectSendL.chain(this._delayNodeL,this.effectReturnL);this.effectSendR.chain(this._delayNodeR,this.effectReturnR);//and pass through to make the detune apparent
this.effectSendL.connect(this.effectReturnL);this.effectSendR.connect(this.effectReturnR);//lfo setup
this._lfoL.connect(this._delayNodeL.delayTime);this._lfoR.connect(this._delayNodeR.delayTime);//start the lfo
this._lfoL.start();this._lfoR.start();//have one LFO frequency control the other
this._lfoL.frequency.connect(this._lfoR.frequency);//set the initial values
this.depth=this._depth;this.frequency.value=options.frequency;this.type=options.type;this._readOnly(['frequency']);this.spread=options.spread;};Tone.extend(Tone.Chorus,Tone.StereoEffect);/**
		 *  @static
		 *  @type {Object}
		 */Tone.Chorus.defaults={'frequency':1.5,'delayTime':3.5,'depth':0.7,'type':'sine','spread':180};/**
		 * The depth of the effect. A depth of 1 makes the delayTime
		 * modulate between 0 and 2*delayTime (centered around the delayTime).
		 * @memberOf Tone.Chorus#
		 * @type {NormalRange}
		 * @name depth
		 */Object.defineProperty(Tone.Chorus.prototype,'depth',{get:function get(){return this._depth;},set:function set(depth){this._depth=depth;var deviation=this._delayTime*depth;this._lfoL.min=Math.max(this._delayTime-deviation,0);this._lfoL.max=this._delayTime+deviation;this._lfoR.min=Math.max(this._delayTime-deviation,0);this._lfoR.max=this._delayTime+deviation;}});/**
		 * The delayTime in milliseconds of the chorus. A larger delayTime
		 * will give a more pronounced effect. Nominal range a delayTime
		 * is between 2 and 20ms.
		 * @memberOf Tone.Chorus#
		 * @type {Milliseconds}
		 * @name delayTime
		 */Object.defineProperty(Tone.Chorus.prototype,'delayTime',{get:function get(){return this._delayTime*1000;},set:function set(delayTime){this._delayTime=delayTime/1000;this.depth=this._depth;}});/**
		 * The oscillator type of the LFO.
		 * @memberOf Tone.Chorus#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.Chorus.prototype,'type',{get:function get(){return this._lfoL.type;},set:function set(type){this._lfoL.type=type;this._lfoR.type=type;}});/**
		 * Amount of stereo spread. When set to 0, both LFO's will be panned centrally.
		 * When set to 180, LFO's will be panned hard left and right respectively.
		 * @memberOf Tone.Chorus#
		 * @type {Degrees}
		 * @name spread
		 */Object.defineProperty(Tone.Chorus.prototype,'spread',{get:function get(){return this._lfoR.phase-this._lfoL.phase;},set:function set(spread){this._lfoL.phase=90-spread/2;this._lfoR.phase=spread/2+90;}});/**
		 *  Clean up.
		 *  @returns {Tone.Chorus} this
		 */Tone.Chorus.prototype.dispose=function(){Tone.StereoEffect.prototype.dispose.call(this);this._lfoL.dispose();this._lfoL=null;this._lfoR.dispose();this._lfoR=null;this._delayNodeL.dispose();this._delayNodeL=null;this._delayNodeR.dispose();this._delayNodeR=null;this._writable('frequency');this.frequency=null;return this;};return Tone.Chorus;});Module(function(Tone){/**
		 *  @class  Tone.Convolver is a wrapper around the Native Web Audio
		 *          [ConvolverNode](http://webaudio.github.io/web-audio-api/#the-convolvernode-interface).
		 *          Convolution is useful for reverb and filter emulation. Read more about convolution reverb on
		 *          [Wikipedia](https://en.wikipedia.org/wiki/Convolution_reverb).
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {string|Tone.Buffer|Object} [url] The URL of the impulse response or the Tone.Buffer
		 *                                           contianing the impulse response.
		 *  @param {Function=} onload The callback to invoke when the url is loaded.
		 *  @example
		 * //initializing the convolver with an impulse response
		 * var convolver = new Tone.Convolver("./path/to/ir.wav").toMaster();
		 */Tone.Convolver=function(){var options=Tone.defaults(arguments,['url','onload'],Tone.Convolver);Tone.Effect.call(this,options);/**
			 *  convolver node
			 *  @type {ConvolverNode}
			 *  @private
			 */this._convolver=this.context.createConvolver();/**
			 *  the convolution buffer
			 *  @type {Tone.Buffer}
			 *  @private
			 */this._buffer=new Tone.Buffer(options.url,function(buffer){this._convolver.buffer=buffer.get();options.onload();}.bind(this));this.connectEffect(this._convolver);};Tone.extend(Tone.Convolver,Tone.Effect);/**
		 *  @static
		 *  @const
		 *  @type  {Object}
		 */Tone.Convolver.defaults={'onload':Tone.noOp};/**
		 *  The convolver's buffer
		 *  @memberOf Tone.Convolver#
		 *  @type {AudioBuffer}
		 *  @name buffer
		 */Object.defineProperty(Tone.Convolver.prototype,'buffer',{get:function get(){return this._buffer.get();},set:function set(buffer){this._buffer.set(buffer);this._convolver.buffer=this._buffer.get();}});/**
		 *  Load an impulse response url as an audio buffer.
		 *  Decodes the audio asynchronously and invokes
		 *  the callback once the audio buffer loads.
		 *  @param {string} url The url of the buffer to load.
		 *                      filetype support depends on the
		 *                      browser.
		 *  @param  {function=} callback
		 *  @returns {Promise}
		 */Tone.Convolver.prototype.load=function(url,callback){return this._buffer.load(url,function(buff){this.buffer=buff;if(callback){callback();}}.bind(this));};/**
		 *  Clean up.
		 *  @returns {Tone.Convolver} this
		 */Tone.Convolver.prototype.dispose=function(){Tone.Effect.prototype.dispose.call(this);this._convolver.disconnect();this._convolver=null;this._buffer.dispose();this._buffer=null;return this;};return Tone.Convolver;});Module(function(Tone){/**
		 *  @class Tone.Distortion is a simple distortion effect using Tone.WaveShaper.
		 *         Algorithm from [a stackoverflow answer](http://stackoverflow.com/a/22313408).
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {Number|Object} [distortion] The amount of distortion (nominal range of 0-1)
		 *  @example
		 * var dist = new Tone.Distortion(0.8).toMaster();
		 * var fm = new Tone.SimpleFM().connect(dist);
		 * //this sounds good on bass notes
		 * fm.triggerAttackRelease("A1", "8n");
		 */Tone.Distortion=function(){var options=Tone.defaults(arguments,['distortion'],Tone.Distortion);Tone.Effect.call(this,options);/**
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */this._shaper=new Tone.WaveShaper(4096);/**
			 * holds the distortion amount
			 * @type {number}
			 * @private
			 */this._distortion=options.distortion;this.connectEffect(this._shaper);this.distortion=options.distortion;this.oversample=options.oversample;};Tone.extend(Tone.Distortion,Tone.Effect);/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.Distortion.defaults={'distortion':0.4,'oversample':'none'};/**
		 * The amount of distortion.
		 * @memberOf Tone.Distortion#
		 * @type {NormalRange}
		 * @name distortion
		 */Object.defineProperty(Tone.Distortion.prototype,'distortion',{get:function get(){return this._distortion;},set:function set(amount){this._distortion=amount;var k=amount*100;var deg=Math.PI/180;this._shaper.setMap(function(x){if(Math.abs(x)<0.001){//should output 0 when input is 0
return 0;}else{return(3+k)*x*20*deg/(Math.PI+k*Math.abs(x));}});}});/**
		 * The oversampling of the effect. Can either be "none", "2x" or "4x".
		 * @memberOf Tone.Distortion#
		 * @type {string}
		 * @name oversample
		 */Object.defineProperty(Tone.Distortion.prototype,'oversample',{get:function get(){return this._shaper.oversample;},set:function set(oversampling){this._shaper.oversample=oversampling;}});/**
		 *  Clean up. 
		 *  @returns {Tone.Distortion} this
		 */Tone.Distortion.prototype.dispose=function(){Tone.Effect.prototype.dispose.call(this);this._shaper.dispose();this._shaper=null;return this;};return Tone.Distortion;});Module(function(Tone){/**
		 * 	@class  Tone.FeedbackEffect provides a loop between an 
		 * 	        audio source and its own output. This is a base-class
		 * 	        for feedback effects. 
		 *
		 *  @constructor
		 *  @extends {Tone.Effect}
		 *  @param {NormalRange|Object} [feedback] The initial feedback value.
		 */Tone.FeedbackEffect=function(){var options=Tone.defaults(arguments,['feedback'],Tone.FeedbackEffect);Tone.Effect.call(this,options);/**
			 *  the gain which controls the feedback
			 *  @type {Tone.Gain}
			 *  @private
			 */this._feedbackGain=new Tone.Gain(options.feedback,Tone.Type.NormalRange);/**
			 *  The amount of signal which is fed back into the effect input. 
			 *  @type {NormalRange}
			 *  @signal
			 */this.feedback=this._feedbackGain.gain;//the feedback loop
this.effectReturn.chain(this._feedbackGain,this.effectSend);this._readOnly(['feedback']);};Tone.extend(Tone.FeedbackEffect,Tone.Effect);/**
		 *  @static
		 *  @type {Object}
		 */Tone.FeedbackEffect.defaults={'feedback':0.125};/**
		 *  Clean up. 
		 *  @returns {Tone.FeedbackEffect} this
		 */Tone.FeedbackEffect.prototype.dispose=function(){Tone.Effect.prototype.dispose.call(this);this._writable(['feedback']);this._feedbackGain.dispose();this._feedbackGain=null;this.feedback=null;return this;};return Tone.FeedbackEffect;});Module(function(Tone){/**
		 *  @class  Tone.FeedbackDelay is a DelayNode in which part of output
		 *          signal is fed back into the delay.
		 *
		 *  @constructor
		 *  @extends {Tone.FeedbackEffect}
		 *  @param {Time|Object} [delayTime] The delay applied to the incoming signal.
		 *  @param {NormalRange=} feedback The amount of the effected signal which
		 *                            is fed back through the delay.
		 *  @example
		 * var feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toMaster();
		 * var tom = new Tone.DrumSynth({
		 * 	"octaves" : 4,
		 * 	"pitchDecay" : 0.1
		 * }).connect(feedbackDelay);
		 * tom.triggerAttackRelease("A2","32n");
		 */Tone.FeedbackDelay=function(){var options=Tone.defaults(arguments,['delayTime','feedback'],Tone.FeedbackDelay);Tone.FeedbackEffect.call(this,options);/**
			 *  the delay node
			 *  @type {Tone.Delay}
			 *  @private
			 */this._delayNode=new Tone.Delay(options.delayTime,options.maxDelay);/**
			 *  The delayTime of the DelayNode.
			 *  @type {Time}
			 *  @signal
			 */this.delayTime=this._delayNode.delayTime;// connect it up
this.connectEffect(this._delayNode);this._readOnly(['delayTime']);};Tone.extend(Tone.FeedbackDelay,Tone.FeedbackEffect);/**
		 *  The default values.
		 *  @const
		 *  @static
		 *  @type {Object}
		 */Tone.FeedbackDelay.defaults={'delayTime':0.25,'maxDelay':1};/**
		 *  clean up
		 *  @returns {Tone.FeedbackDelay} this
		 */Tone.FeedbackDelay.prototype.dispose=function(){Tone.FeedbackEffect.prototype.dispose.call(this);this._delayNode.dispose();this._delayNode=null;this._writable(['delayTime']);this.delayTime=null;return this;};return Tone.FeedbackDelay;});Module(function(Tone){/**
		 *  an array of comb filter delay values from Freeverb implementation
		 *  @static
		 *  @private
		 *  @type {Array}
		 */var combFilterTunings=[1557/44100,1617/44100,1491/44100,1422/44100,1277/44100,1356/44100,1188/44100,1116/44100];/**
		 *  an array of allpass filter frequency values from Freeverb implementation
		 *  @private
		 *  @static
		 *  @type {Array}
		 */var allpassFilterFrequencies=[225,556,441,341];/**
		 *  @class Tone.Freeverb is a reverb based on [Freeverb](https://ccrma.stanford.edu/~jos/pasp/Freeverb.html).
		 *         Read more on reverb on [Sound On Sound](https://web.archive.org/web/20160404083902/http://www.soundonsound.com:80/sos/feb01/articles/synthsecrets.asp).
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {NormalRange|Object} [roomSize] Correlated to the decay time.
		 *  @param {Frequency} [dampening] The cutoff frequency of a lowpass filter as part
		 *                                 of the reverb.
		 *  @example
		 * var freeverb = new Tone.Freeverb().toMaster();
		 * freeverb.dampening.value = 1000;
		 * //routing synth through the reverb
		 * var synth = new Tone.AMSynth().connect(freeverb);
		 */Tone.Freeverb=function(){var options=Tone.defaults(arguments,['roomSize','dampening'],Tone.Freeverb);Tone.StereoEffect.call(this,options);/**
			 *  The roomSize value between. A larger roomSize
			 *  will result in a longer decay.
			 *  @type {NormalRange}
			 *  @signal
			 */this.roomSize=new Tone.Signal(options.roomSize,Tone.Type.NormalRange);/**
			 *  The amount of dampening of the reverberant signal.
			 *  @type {Frequency}
			 *  @signal
			 */this.dampening=new Tone.Signal(options.dampening,Tone.Type.Frequency);/**
			 *  the comb filters
			 *  @type {Array}
			 *  @private
			 */this._combFilters=[];/**
			 *  the allpass filters on the left
			 *  @type {Array}
			 *  @private
			 */this._allpassFiltersL=[];/**
			 *  the allpass filters on the right
			 *  @type {Array}
			 *  @private
			 */this._allpassFiltersR=[];//make the allpass filters on the right
for(var l=0;l<allpassFilterFrequencies.length;l++){var allpassL=this.context.createBiquadFilter();allpassL.type='allpass';allpassL.frequency.value=allpassFilterFrequencies[l];this._allpassFiltersL.push(allpassL);}//make the allpass filters on the left
for(var r=0;r<allpassFilterFrequencies.length;r++){var allpassR=this.context.createBiquadFilter();allpassR.type='allpass';allpassR.frequency.value=allpassFilterFrequencies[r];this._allpassFiltersR.push(allpassR);}//make the comb filters
for(var c=0;c<combFilterTunings.length;c++){var lfpf=new Tone.LowpassCombFilter(combFilterTunings[c]);if(c<combFilterTunings.length/2){this.effectSendL.chain(lfpf,this._allpassFiltersL[0]);}else{this.effectSendR.chain(lfpf,this._allpassFiltersR[0]);}this.roomSize.connect(lfpf.resonance);this.dampening.connect(lfpf.dampening);this._combFilters.push(lfpf);}//chain the allpass filters togetehr
Tone.connectSeries.apply(Tone,this._allpassFiltersL);Tone.connectSeries.apply(Tone,this._allpassFiltersR);this._allpassFiltersL[this._allpassFiltersL.length-1].connect(this.effectReturnL);this._allpassFiltersR[this._allpassFiltersR.length-1].connect(this.effectReturnR);this._readOnly(['roomSize','dampening']);};Tone.extend(Tone.Freeverb,Tone.StereoEffect);/**
		 *  @static
		 *  @type {Object}
		 */Tone.Freeverb.defaults={'roomSize':0.7,'dampening':3000};/**
		 *  Clean up.
		 *  @returns {Tone.Freeverb} this
		 */Tone.Freeverb.prototype.dispose=function(){Tone.StereoEffect.prototype.dispose.call(this);for(var al=0;al<this._allpassFiltersL.length;al++){this._allpassFiltersL[al].disconnect();this._allpassFiltersL[al]=null;}this._allpassFiltersL=null;for(var ar=0;ar<this._allpassFiltersR.length;ar++){this._allpassFiltersR[ar].disconnect();this._allpassFiltersR[ar]=null;}this._allpassFiltersR=null;for(var cf=0;cf<this._combFilters.length;cf++){this._combFilters[cf].dispose();this._combFilters[cf]=null;}this._combFilters=null;this._writable(['roomSize','dampening']);this.roomSize.dispose();this.roomSize=null;this.dampening.dispose();this.dampening=null;return this;};return Tone.Freeverb;});Module(function(Tone){/**
		 *  an array of the comb filter delay time values
		 *  @private
		 *  @static
		 *  @type {Array}
		 */var combFilterDelayTimes=[1687/25000,1601/25000,2053/25000,2251/25000];/**
		 *  the resonances of each of the comb filters
		 *  @private
		 *  @static
		 *  @type {Array}
		 */var combFilterResonances=[0.773,0.802,0.753,0.733];/**
		 *  the allpass filter frequencies
		 *  @private
		 *  @static
		 *  @type {Array}
		 */var allpassFilterFreqs=[347,113,37];/**
		 *  @class Tone.JCReverb is a simple [Schroeder Reverberator](https://ccrma.stanford.edu/~jos/pasp/Schroeder_Reverberators.html)
		 *         tuned by John Chowning in 1970.
		 *         It is made up of three allpass filters and four Tone.FeedbackCombFilter.
		 *
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 *  @param {NormalRange|Object} [roomSize] Coorelates to the decay time.
		 *  @example
		 * var reverb = new Tone.JCReverb(0.4).connect(Tone.Master);
		 * var delay = new Tone.FeedbackDelay(0.5);
		 * //connecting the synth to reverb through delay
		 * var synth = new Tone.DuoSynth().chain(delay, reverb);
		 * synth.triggerAttackRelease("A4","8n");
		 */Tone.JCReverb=function(){var options=Tone.defaults(arguments,['roomSize'],Tone.JCReverb);Tone.StereoEffect.call(this,options);/**
			 *  room size control values between [0,1]
			 *  @type {NormalRange}
			 *  @signal
			 */this.roomSize=new Tone.Signal(options.roomSize,Tone.Type.NormalRange);/**
			 *  scale the room size
			 *  @type {Tone.Scale}
			 *  @private
			 */this._scaleRoomSize=new Tone.Scale(-0.733,0.197);/**
			 *  a series of allpass filters
			 *  @type {Array}
			 *  @private
			 */this._allpassFilters=[];/**
			 *  parallel feedback comb filters
			 *  @type {Array}
			 *  @private
			 */this._feedbackCombFilters=[];//make the allpass filters
for(var af=0;af<allpassFilterFreqs.length;af++){var allpass=this.context.createBiquadFilter();allpass.type='allpass';allpass.frequency.value=allpassFilterFreqs[af];this._allpassFilters.push(allpass);}//and the comb filters
for(var cf=0;cf<combFilterDelayTimes.length;cf++){var fbcf=new Tone.FeedbackCombFilter(combFilterDelayTimes[cf],0.1);this._scaleRoomSize.connect(fbcf.resonance);fbcf.resonance.value=combFilterResonances[cf];this._allpassFilters[this._allpassFilters.length-1].connect(fbcf);if(cf<combFilterDelayTimes.length/2){fbcf.connect(this.effectReturnL);}else{fbcf.connect(this.effectReturnR);}this._feedbackCombFilters.push(fbcf);}//chain the allpass filters together
this.roomSize.connect(this._scaleRoomSize);Tone.connectSeries.apply(Tone,this._allpassFilters);this.effectSendL.connect(this._allpassFilters[0]);this.effectSendR.connect(this._allpassFilters[0]);this._readOnly(['roomSize']);};Tone.extend(Tone.JCReverb,Tone.StereoEffect);/**
		 *  the default values
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.JCReverb.defaults={'roomSize':0.5};/**
		 *  Clean up.
		 *  @returns {Tone.JCReverb} this
		 */Tone.JCReverb.prototype.dispose=function(){Tone.StereoEffect.prototype.dispose.call(this);for(var apf=0;apf<this._allpassFilters.length;apf++){this._allpassFilters[apf].disconnect();this._allpassFilters[apf]=null;}this._allpassFilters=null;for(var fbcf=0;fbcf<this._feedbackCombFilters.length;fbcf++){this._feedbackCombFilters[fbcf].dispose();this._feedbackCombFilters[fbcf]=null;}this._feedbackCombFilters=null;this._writable(['roomSize']);this.roomSize.dispose();this.roomSize=null;this._scaleRoomSize.dispose();this._scaleRoomSize=null;return this;};return Tone.JCReverb;});Module(function(Tone){/**
		 *  @class Mid/Side processing separates the the 'mid' signal
		 *         (which comes out of both the left and the right channel)
		 *         and the 'side' (which only comes out of the the side channels)
		 *         and effects them separately before being recombined.
		 *         Applies a Mid/Side seperation and recombination.
		 *         Algorithm found in [kvraudio forums](http://www.kvraudio.com/forum/viewtopic.php?t=212587).
		 *         <br><br>
		 *         This is a base-class for Mid/Side Effects.
		 *
		 *  @extends {Tone.Effect}
		 *  @constructor
		 */Tone.MidSideEffect=function(){Tone.Effect.apply(this,arguments);/**
			 *  The mid/side split
			 *  @type  {Tone.MidSideSplit}
			 *  @private
			 */this._midSideSplit=new Tone.MidSideSplit();/**
			 *  The mid/side merge
			 *  @type  {Tone.MidSideMerge}
			 *  @private
			 */this._midSideMerge=new Tone.MidSideMerge();/**
			 *  The mid send. Connect to mid processing
			 *  @type {Tone}
			 *  @private
			 */this.midSend=this._midSideSplit.mid;/**
			 *  The side send. Connect to side processing
			 *  @type {Tone}
			 *  @private
			 */this.sideSend=this._midSideSplit.side;/**
			 *  The mid return connection
			 *  @type {GainNode}
			 *  @private
			 */this.midReturn=this._midSideMerge.mid;/**
			 *  The side return connection
			 *  @type {GainNode}
			 *  @private
			 */this.sideReturn=this._midSideMerge.side;//the connections
this.effectSend.connect(this._midSideSplit);this._midSideMerge.connect(this.effectReturn);};Tone.extend(Tone.MidSideEffect,Tone.Effect);/**
		 *  Clean up.
		 *  @returns {Tone.MidSideEffect} this
		 */Tone.MidSideEffect.prototype.dispose=function(){Tone.Effect.prototype.dispose.call(this);this._midSideSplit.dispose();this._midSideSplit=null;this._midSideMerge.dispose();this._midSideMerge=null;this.midSend=null;this.sideSend=null;this.midReturn=null;this.sideReturn=null;return this;};return Tone.MidSideEffect;});Module(function(Tone){/**
		 *  @class Tone.Phaser is a phaser effect. Phasers work by changing the phase
		 *         of different frequency components of an incoming signal. Read more on
		 *         [Wikipedia](https://en.wikipedia.org/wiki/Phaser_(effect)).
		 *         Inspiration for this phaser comes from [Tuna.js](https://github.com/Dinahmoe/tuna/).
		 *
		 *	@extends {Tone.StereoEffect}
		 *	@constructor
		 *	@param {Frequency|Object} [frequency] The speed of the phasing.
		 *	@param {number} [octaves] The octaves of the effect.
		 *	@param {Frequency} [baseFrequency] The base frequency of the filters.
		 *	@example
		 * var phaser = new Tone.Phaser({
		 * 	"frequency" : 15,
		 * 	"octaves" : 5,
		 * 	"baseFrequency" : 1000
		 * }).toMaster();
		 * var synth = new Tone.FMSynth().connect(phaser);
		 * synth.triggerAttackRelease("E3", "2n");
		 */Tone.Phaser=function(){//set the defaults
var options=Tone.defaults(arguments,['frequency','octaves','baseFrequency'],Tone.Phaser);Tone.StereoEffect.call(this,options);/**
			 *  the lfo which controls the frequency on the left side
			 *  @type {Tone.LFO}
			 *  @private
			 */this._lfoL=new Tone.LFO(options.frequency,0,1);/**
			 *  the lfo which controls the frequency on the right side
			 *  @type {Tone.LFO}
			 *  @private
			 */this._lfoR=new Tone.LFO(options.frequency,0,1);this._lfoR.phase=180;/**
			 *  the base modulation frequency
			 *  @type {number}
			 *  @private
			 */this._baseFrequency=options.baseFrequency;/**
			 *  the octaves of the phasing
			 *  @type {number}
			 *  @private
			 */this._octaves=options.octaves;/**
			 *  The quality factor of the filters
			 *  @type {Positive}
			 *  @signal
			 */this.Q=new Tone.Signal(options.Q,Tone.Type.Positive);/**
			 *  the array of filters for the left side
			 *  @type {Array}
			 *  @private
			 */this._filtersL=this._makeFilters(options.stages,this._lfoL,this.Q);/**
			 *  the array of filters for the left side
			 *  @type {Array}
			 *  @private
			 */this._filtersR=this._makeFilters(options.stages,this._lfoR,this.Q);/**
			 * the frequency of the effect
			 * @type {Tone.Signal}
			 */this.frequency=this._lfoL.frequency;this.frequency.value=options.frequency;//connect them up
this.effectSendL.connect(this._filtersL[0]);this.effectSendR.connect(this._filtersR[0]);this._filtersL[options.stages-1].connect(this.effectReturnL);this._filtersR[options.stages-1].connect(this.effectReturnR);//control the frequency with one LFO
this._lfoL.frequency.connect(this._lfoR.frequency);//set the options
this.baseFrequency=options.baseFrequency;this.octaves=options.octaves;//start the lfo
this._lfoL.start();this._lfoR.start();this._readOnly(['frequency','Q']);};Tone.extend(Tone.Phaser,Tone.StereoEffect);/**
		 *  defaults
		 *  @static
		 *  @type {object}
		 */Tone.Phaser.defaults={'frequency':0.5,'octaves':3,'stages':10,'Q':10,'baseFrequency':350};/**
		 *  @param {number} stages
		 *  @returns {Array} the number of filters all connected together
		 *  @private
		 */Tone.Phaser.prototype._makeFilters=function(stages,connectToFreq,Q){var filters=new Array(stages);//make all the filters
for(var i=0;i<stages;i++){var filter=this.context.createBiquadFilter();filter.type='allpass';Q.connect(filter.Q);connectToFreq.connect(filter.frequency);filters[i]=filter;}Tone.connectSeries.apply(Tone,filters);return filters;};/**
		 * The number of octaves the phase goes above
		 * the baseFrequency
		 * @memberOf Tone.Phaser#
		 * @type {Positive}
		 * @name octaves
		 */Object.defineProperty(Tone.Phaser.prototype,'octaves',{get:function get(){return this._octaves;},set:function set(octaves){this._octaves=octaves;var max=this._baseFrequency*Math.pow(2,octaves);this._lfoL.max=max;this._lfoR.max=max;}});/**
		 * The the base frequency of the filters.
		 * @memberOf Tone.Phaser#
		 * @type {number}
		 * @name baseFrequency
		 */Object.defineProperty(Tone.Phaser.prototype,'baseFrequency',{get:function get(){return this._baseFrequency;},set:function set(freq){this._baseFrequency=freq;this._lfoL.min=freq;this._lfoR.min=freq;this.octaves=this._octaves;}});/**
		 *  clean up
		 *  @returns {Tone.Phaser} this
		 */Tone.Phaser.prototype.dispose=function(){Tone.StereoEffect.prototype.dispose.call(this);this._writable(['frequency','Q']);this.Q.dispose();this.Q=null;this._lfoL.dispose();this._lfoL=null;this._lfoR.dispose();this._lfoR=null;for(var i=0;i<this._filtersL.length;i++){this._filtersL[i].disconnect();this._filtersL[i]=null;}this._filtersL=null;for(var j=0;j<this._filtersR.length;j++){this._filtersR[j].disconnect();this._filtersR[j]=null;}this._filtersR=null;this.frequency=null;return this;};return Tone.Phaser;});Module(function(Tone){/**
		 *  @class Just like a stereo feedback effect, but the feedback is routed from left to right
		 *         and right to left instead of on the same channel.
		 *
		 *	@constructor
		 *	@extends {Tone.StereoEffect}
		 */Tone.StereoXFeedbackEffect=function(){var options=Tone.defaults(arguments,['feedback'],Tone.FeedbackEffect);Tone.StereoEffect.call(this,options);/**
			 *  The amount of feedback from the output
			 *  back into the input of the effect (routed
			 *  across left and right channels).
			 *  @type {NormalRange}
			 *  @signal
			 */this.feedback=new Tone.Signal(options.feedback,Tone.Type.NormalRange);/**
			 *  the left side feeback
			 *  @type {Tone.Gain}
			 *  @private
			 */this._feedbackLR=new Tone.Gain();/**
			 *  the right side feeback
			 *  @type {Tone.Gain}
			 *  @private
			 */this._feedbackRL=new Tone.Gain();//connect it up
this.effectReturnL.chain(this._feedbackLR,this.effectSendR);this.effectReturnR.chain(this._feedbackRL,this.effectSendL);this.feedback.fan(this._feedbackLR.gain,this._feedbackRL.gain);this._readOnly(['feedback']);};Tone.extend(Tone.StereoXFeedbackEffect,Tone.StereoEffect);/**
		 *  clean up
		 *  @returns {Tone.StereoXFeedbackEffect} this
		 */Tone.StereoXFeedbackEffect.prototype.dispose=function(){Tone.StereoEffect.prototype.dispose.call(this);this._writable(['feedback']);this.feedback.dispose();this.feedback=null;this._feedbackLR.dispose();this._feedbackLR=null;this._feedbackRL.dispose();this._feedbackRL=null;return this;};return Tone.StereoXFeedbackEffect;});Module(function(Tone){/**
		 *  @class  Tone.PingPongDelay is a feedback delay effect where the echo is heard
		 *          first in one channel and next in the opposite channel. In a stereo
		 *          system these are the right and left channels.
		 *          PingPongDelay in more simplified terms is two Tone.FeedbackDelays
		 *          with independent delay values. Each delay is routed to one channel
		 *          (left or right), and the channel triggered second will always
		 *          trigger at the same interval after the first.
		 *
		 * 	@constructor
		 * 	@extends {Tone.StereoXFeedbackEffect}
		 *  @param {Time|Object} [delayTime] The delayTime between consecutive echos.
		 *  @param {NormalRange=} feedback The amount of the effected signal which
		 *                                 is fed back through the delay.
		 *  @example
		 * var pingPong = new Tone.PingPongDelay("4n", 0.2).toMaster();
		 * var drum = new Tone.DrumSynth().connect(pingPong);
		 * drum.triggerAttackRelease("C4", "32n");
		 */Tone.PingPongDelay=function(){var options=Tone.defaults(arguments,['delayTime','feedback'],Tone.PingPongDelay);Tone.StereoXFeedbackEffect.call(this,options);/**
			 *  the delay node on the left side
			 *  @type {Tone.Delay}
			 *  @private
			 */this._leftDelay=new Tone.Delay(0,options.maxDelayTime);/**
			 *  the delay node on the right side
			 *  @type {Tone.Delay}
			 *  @private
			 */this._rightDelay=new Tone.Delay(0,options.maxDelayTime);/**
			 *  the predelay on the right side
			 *  @type {Tone.Delay}
			 *  @private
			 */this._rightPreDelay=new Tone.Delay(0,options.maxDelayTime);/**
			 *  the delay time signal
			 *  @type {Time}
			 *  @signal
			 */this.delayTime=new Tone.Signal(options.delayTime,Tone.Type.Time);//connect it up
this.effectSendL.chain(this._leftDelay,this.effectReturnL);this.effectSendR.chain(this._rightPreDelay,this._rightDelay,this.effectReturnR);this.delayTime.fan(this._leftDelay.delayTime,this._rightDelay.delayTime,this._rightPreDelay.delayTime);//rearranged the feedback to be after the rightPreDelay
this._feedbackLR.disconnect();this._feedbackLR.connect(this._rightDelay);this._readOnly(['delayTime']);};Tone.extend(Tone.PingPongDelay,Tone.StereoXFeedbackEffect);/**
		 *  @static
		 *  @type {Object}
		 */Tone.PingPongDelay.defaults={'delayTime':0.25,'maxDelayTime':1};/**
		 *  Clean up.
		 *  @returns {Tone.PingPongDelay} this
		 */Tone.PingPongDelay.prototype.dispose=function(){Tone.StereoXFeedbackEffect.prototype.dispose.call(this);this._leftDelay.dispose();this._leftDelay=null;this._rightDelay.dispose();this._rightDelay=null;this._rightPreDelay.dispose();this._rightPreDelay=null;this._writable(['delayTime']);this.delayTime.dispose();this.delayTime=null;return this;};return Tone.PingPongDelay;});Module(function(Tone){/**
		 *  @class Tone.PitchShift does near-realtime pitch shifting to the incoming signal.
		 *         The effect is achieved by speeding up or slowing down the delayTime
		 *         of a DelayNode using a sawtooth wave.
		 *         Algorithm found in [this pdf](http://dsp-book.narod.ru/soundproc.pdf).
		 *         Additional reference by [Miller Pucket](http://msp.ucsd.edu/techniques/v0.11/book-html/node115.html).
		 *
		 *  @extends {Tone.FeedbackEffect}
		 *  @param {Interval=} pitch The interval to transpose the incoming signal by.
		 */Tone.PitchShift=function(){var options=Tone.defaults(arguments,['pitch'],Tone.PitchShift);Tone.FeedbackEffect.call(this,options);/**
			 *  The pitch signal
			 *  @type  {Tone.Signal}
			 *  @private
			 */this._frequency=new Tone.Signal(0);/**
			 *  Uses two DelayNodes to cover up the jump in
			 *  the sawtooth wave.
			 *  @type  {DelayNode}
			 *  @private
			 */this._delayA=new Tone.Delay(0,1);/**
			 *  The first LFO.
			 *  @type  {Tone.LFO}
			 *  @private
			 */this._lfoA=new Tone.LFO({'min':0,'max':0.1,'type':'sawtooth'}).connect(this._delayA.delayTime);/**
			 *  The second DelayNode
			 *  @type  {DelayNode}
			 *  @private
			 */this._delayB=new Tone.Delay(0,1);/**
			 *  The first LFO.
			 *  @type  {Tone.LFO}
			 *  @private
			 */this._lfoB=new Tone.LFO({'min':0,'max':0.1,'type':'sawtooth','phase':180}).connect(this._delayB.delayTime);/**
			 *  Crossfade quickly between the two delay lines
			 *  to cover up the jump in the sawtooth wave
			 *  @type  {Tone.CrossFade}
			 *  @private
			 */this._crossFade=new Tone.CrossFade();/**
			 *  LFO which alternates between the two
			 *  delay lines to cover up the disparity in the
			 *  sawtooth wave.
			 *  @type  {Tone.LFO}
			 *  @private
			 */this._crossFadeLFO=new Tone.LFO({'min':0,'max':1,'type':'triangle','phase':90}).connect(this._crossFade.fade);/**
			 *  The delay node
			 *  @type {Tone.Delay}
			 *  @private
			 */this._feedbackDelay=new Tone.Delay(options.delayTime);/**
			 *  The amount of delay on the input signal
			 *  @type {Time}
			 *  @signal
			 */this.delayTime=this._feedbackDelay.delayTime;this._readOnly('delayTime');/**
			 *  Hold the current pitch
			 *  @type {Number}
			 *  @private
			 */this._pitch=options.pitch;/**
			 *  Hold the current windowSize
			 *  @type {Number}
			 *  @private
			 */this._windowSize=options.windowSize;//connect the two delay lines up
this._delayA.connect(this._crossFade.a);this._delayB.connect(this._crossFade.b);//connect the frequency
this._frequency.fan(this._lfoA.frequency,this._lfoB.frequency,this._crossFadeLFO.frequency);//route the input
this.effectSend.fan(this._delayA,this._delayB);this._crossFade.chain(this._feedbackDelay,this.effectReturn);//start the LFOs at the same time
var now=this.now();this._lfoA.start(now);this._lfoB.start(now);this._crossFadeLFO.start(now);//set the initial value
this.windowSize=this._windowSize;};Tone.extend(Tone.PitchShift,Tone.FeedbackEffect);/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */Tone.PitchShift.defaults={'pitch':0,'windowSize':0.1,'delayTime':0,'feedback':0};/**
		 * Repitch the incoming signal by some interval (measured
		 * in semi-tones).
		 * @memberOf Tone.PitchShift#
		 * @type {Interval}
		 * @name pitch
		 * @example
		 * pitchShift.pitch = -12; //down one octave
		 * pitchShift.pitch = 7; //up a fifth
		 */Object.defineProperty(Tone.PitchShift.prototype,'pitch',{get:function get(){return this._pitch;},set:function set(interval){this._pitch=interval;var factor=0;if(interval<0){this._lfoA.min=0;this._lfoA.max=this._windowSize;this._lfoB.min=0;this._lfoB.max=this._windowSize;factor=Tone.intervalToFrequencyRatio(interval-1)+1;}else{this._lfoA.min=this._windowSize;this._lfoA.max=0;this._lfoB.min=this._windowSize;this._lfoB.max=0;factor=Tone.intervalToFrequencyRatio(interval)-1;}this._frequency.value=factor*(1.2/this._windowSize);}});/**
		 * The window size corresponds roughly to the sample length in a looping sampler.
		 * Smaller values are desirable for a less noticeable delay time of the pitch shifted
		 * signal, but larger values will result in smoother pitch shifting for larger intervals.
		 * A nominal range of 0.03 to 0.1 is recommended.
		 * @memberOf Tone.PitchShift#
		 * @type {Time}
		 * @name windowSize
		 * @example
		 * pitchShift.windowSize = 0.1;
		 */Object.defineProperty(Tone.PitchShift.prototype,'windowSize',{get:function get(){return this._windowSize;},set:function set(size){this._windowSize=this.toSeconds(size);this.pitch=this._pitch;}});/**
		 *  Clean up.
		 *  @return  {Tone.PitchShift}  this
		 */Tone.PitchShift.prototype.dispose=function(){Tone.FeedbackEffect.prototype.dispose.call(this);this._frequency.dispose();this._frequency=null;this._delayA.disconnect();this._delayA=null;this._delayB.disconnect();this._delayB=null;this._lfoA.dispose();this._lfoA=null;this._lfoB.dispose();this._lfoB=null;this._crossFade.dispose();this._crossFade=null;this._crossFadeLFO.dispose();this._crossFadeLFO=null;this._writable('delayTime');this._feedbackDelay.dispose();this._feedbackDelay=null;this.delayTime=null;return this;};return Tone.PitchShift;});Module(function(Tone){/**
		 *  @class Wrapper around the native BufferSourceNode.
		 *  @extends {Tone.AudioNode}
		 *  @param  {AudioBuffer|Tone.Buffer}  buffer   The buffer to play
		 *  @param  {Function}  onload  The callback to invoke when the
		 *                               buffer is done playing.
		 */Tone.BufferSource=function(){var options=Tone.defaults(arguments,['buffer','onload'],Tone.BufferSource);Tone.AudioNode.call(this,options);/**
			 *  The callback to invoke after the
			 *  buffer source is done playing.
			 *  @type  {Function}
			 */this.onended=options.onended;/**
			 *  The time that the buffer was started.
			 *  @type  {Number}
			 *  @private
			 */this._startTime=-1;/**
			 *  An additional flag if the actual BufferSourceNode
			 *  has been started. b/c stopping an unstarted buffer
			 *  will throw it into an invalid state
			 *  @type  {Boolean}
			 *  @private
			 */this._sourceStarted=false;/**
			 *  Flag if the source has already been stopped
			 *  @type  {Boolean}
			 *  @private
			 */this._sourceStopped=false;/**
			 *  The time that the buffer is scheduled to stop.
			 *  @type  {Number}
			 *  @private
			 */this._stopTime=-1;/**
			 *  The gain node which envelopes the BufferSource
			 *  @type  {Tone.Gain}
			 *  @private
			 */this._gainNode=this.output=new Tone.Gain();/**
			 *  The buffer source
			 *  @type  {AudioBufferSourceNode}
			 *  @private
			 */this._source=this.context.createBufferSource();this._source.connect(this._gainNode);this._source.onended=this._onended.bind(this);/**
			 * The private buffer instance
			 * @type {Tone.Buffer}
			 * @private
			 */this._buffer=new Tone.Buffer(options.buffer,options.onload);/**
			 *  The playbackRate of the buffer
			 *  @type {Positive}
			 *  @signal
			 */this.playbackRate=new Tone.Param(this._source.playbackRate,Tone.Type.Positive);/**
			 *  The fadeIn time of the amplitude envelope.
			 *  @type {Time}
			 */this.fadeIn=options.fadeIn;/**
			 *  The fadeOut time of the amplitude envelope.
			 *  @type {Time}
			 */this.fadeOut=options.fadeOut;/**
			 * The curve applied to the fades, either "linear" or "exponential"
			 * @type {String}
			 */this.curve=options.curve;/**
			 *  The value that the buffer ramps to
			 *  @type {Gain}
			 *  @private
			 */this._gain=1;/**
			 * The onended timeout
			 * @type {Number}
			 * @private
			 */this._onendedTimeout=-1;//set some values initially
this.loop=options.loop;this.loopStart=options.loopStart;this.loopEnd=options.loopEnd;this.playbackRate.value=options.playbackRate;};Tone.extend(Tone.BufferSource,Tone.AudioNode);/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */Tone.BufferSource.defaults={'onended':Tone.noOp,'onload':Tone.noOp,'loop':false,'loopStart':0,'loopEnd':0,'fadeIn':0,'fadeOut':0,'curve':'linear','playbackRate':1};/**
		 *  Returns the playback state of the source, either "started" or "stopped".
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.BufferSource#
		 *  @name state
		 */Object.defineProperty(Tone.BufferSource.prototype,'state',{get:function get(){return this.getStateAtTime(this.now());}});/**
		 *  Get the playback state at the given time
		 *  @param  {Time}  time  The time to test the state at
		 *  @return  {Tone.State}  The playback state. 
		 */Tone.BufferSource.prototype.getStateAtTime=function(time){time=this.toSeconds(time);if(this._startTime!==-1&&time>=this._startTime&&!this._sourceStopped){return Tone.State.Started;}else{return Tone.State.Stopped;}};/**
		 *  Start the buffer
		 *  @param  {Time} [startTime=now] When the player should start.
		 *  @param  {Time} [offset=0] The offset from the beginning of the sample
		 *                                 to start at.
		 *  @param  {Time=} duration How long the sample should play. If no duration
		 *                                is given, it will default to the full length
		 *                                of the sample (minus any offset)
		 *  @param  {Gain}  [gain=1]  The gain to play the buffer back at.
		 *  @param  {Time=}  fadeInTime  The optional fadeIn ramp time.
		 *  @return  {Tone.BufferSource}  this
		 */Tone.BufferSource.prototype.start=function(time,offset,duration,gain,fadeInTime){if(this._startTime!==-1){throw new Error('Tone.BufferSource can only be started once.');}if(!this.buffer.loaded){throw new Error('Tone.BufferSource: buffer is either not set or not loaded.');}time=this.toSeconds(time);//if it's a loop the default offset is the loopstart point
if(this.loop){offset=Tone.defaultArg(offset,this.loopStart);}else{//otherwise the default offset is 0
offset=Tone.defaultArg(offset,0);}offset=this.toSeconds(offset);gain=Tone.defaultArg(gain,1);this._gain=gain;fadeInTime=this.toSeconds(Tone.defaultArg(fadeInTime,this.fadeIn));this.fadeIn=fadeInTime;if(fadeInTime>0){this._gainNode.gain.setValueAtTime(0,time);if(this.curve==='linear'){this._gainNode.gain.linearRampToValueAtTime(this._gain,time+fadeInTime);}else{this._gainNode.gain.exponentialApproachValueAtTime(this._gain,time,fadeInTime);}}else{this._gainNode.gain.setValueAtTime(gain,time);}this._startTime=time;var computedDur=this.toSeconds(Tone.defaultArg(duration,this.buffer.duration-offset%this.buffer.duration));computedDur=Math.max(computedDur,0);if(Tone.isDefined(duration)){//clip the duration when not looping
if(!this.loop){computedDur=Math.min(computedDur,this.buffer.duration-offset%this.buffer.duration);}this.stop(time+computedDur,this.fadeOut);}//start the buffer source
if(this.loop){//modify the offset if it's greater than the loop time
var loopEnd=this.loopEnd||this.buffer.duration;var loopStart=this.loopStart;var loopDuration=loopEnd-loopStart;//move the offset back
if(offset>=loopEnd){offset=(offset-loopStart)%loopDuration+loopStart;}}this._source.buffer=this.buffer.get();this._source.loopEnd=this.loopEnd||this.buffer.duration;if(offset<this.buffer.duration){this._sourceStarted=true;this._source.start(time,offset);}return this;};/**
		 *  Stop the buffer. Optionally add a ramp time to fade the
		 *  buffer out.
		 *  @param  {Time=}  time         The time the buffer should stop.
		 *  @param  {Time=}  fadeOutTime  How long the gain should fade out for
		 *  @return  {Tone.BufferSource}  this
		 */Tone.BufferSource.prototype.stop=function(time,fadeOutTime){if(!this.buffer.loaded){throw new Error('Tone.BufferSource: buffer is either not set or not loaded.');}if(this._sourceStopped){return;}time=this.toSeconds(time);//if the event has already been scheduled, clear it
if(this._stopTime!==-1){this.cancelStop();}//stop if it's schedule before the start time
if(time<=this._startTime){this._gainNode.gain.cancelScheduledValues(time);this._gainNode.gain.value=0;return this;}time=Math.max(this._startTime+this.fadeIn+this.sampleTime,time);//cancel the previous curve
this._gainNode.gain.cancelScheduledValues(time);this._stopTime=time;//the fadeOut time
fadeOutTime=this.toSeconds(Tone.defaultArg(fadeOutTime,this.fadeOut));var heldDuration=time-this._startTime-this.fadeIn-this.sampleTime;if(!this.loop){//make sure the fade does not go beyond the length of the buffer
heldDuration=Math.min(heldDuration,this.buffer.duration);}fadeOutTime=Math.min(heldDuration,fadeOutTime);var startFade=time-fadeOutTime;if(fadeOutTime>this.sampleTime){this._gainNode.gain.setValueAtTime(this._gain,startFade);if(this.curve==='linear'){this._gainNode.gain.linearRampToValueAtTime(0,time);}else{this._gainNode.gain.exponentialApproachValueAtTime(0,startFade,fadeOutTime);}}else{this._gainNode.gain.setValueAtTime(0,time);}Tone.context.clearTimeout(this._onendedTimeout);this._onendedTimeout=Tone.context.setTimeout(this._onended.bind(this),this._stopTime-this.now());return this;};/**
		 *  Cancel a scheduled stop event
		 *  @return  {Tone.BufferSource}  this
		 */Tone.BufferSource.prototype.cancelStop=function(){if(this._startTime!==-1&&!this._sourceStopped){//cancel the stop envelope
var fadeInTime=this.toSeconds(this.fadeIn);this._gainNode.gain.cancelScheduledValues(this._startTime+fadeInTime+this.sampleTime);this._gainNode.gain.setValueAtTime(1,Math.max(this.now(),this._startTime+fadeInTime+this.sampleTime));this.context.clearTimeout(this._onendedTimeout);this._stopTime=-1;}return this;};/**
		 *  Internal callback when the buffer is ended.
		 *  Invokes `onended` and disposes the node.
		 *  @private
		 */Tone.BufferSource.prototype._onended=function(){if(!this._sourceStopped){this._sourceStopped=true;//allow additional time for the exponential curve to fully decay
var additionalTail=this.curve==='exponential'?this.fadeOut*2:0;if(this._sourceStarted&&this._stopTime!==-1){this._source.stop(this._stopTime+additionalTail);}this.onended(this);}};/**
		 * If loop is true, the loop will start at this position.
		 * @memberOf Tone.BufferSource#
		 * @type {Time}
		 * @name loopStart
		 */Object.defineProperty(Tone.BufferSource.prototype,'loopStart',{get:function get(){return this._source.loopStart;},set:function set(loopStart){this._source.loopStart=this.toSeconds(loopStart);}});/**
		 * If loop is true, the loop will end at this position.
		 * @memberOf Tone.BufferSource#
		 * @type {Time}
		 * @name loopEnd
		 */Object.defineProperty(Tone.BufferSource.prototype,'loopEnd',{get:function get(){return this._source.loopEnd;},set:function set(loopEnd){this._source.loopEnd=this.toSeconds(loopEnd);}});/**
		 * The audio buffer belonging to the player.
		 * @memberOf Tone.BufferSource#
		 * @type {Tone.Buffer}
		 * @name buffer
		 */Object.defineProperty(Tone.BufferSource.prototype,'buffer',{get:function get(){return this._buffer;},set:function set(buffer){this._buffer.set(buffer);}});/**
		 * If the buffer should loop once it's over.
		 * @memberOf Tone.BufferSource#
		 * @type {Boolean}
		 * @name loop
		 */Object.defineProperty(Tone.BufferSource.prototype,'loop',{get:function get(){return this._source.loop;},set:function set(loop){this._source.loop=loop;this.cancelStop();}});/**
		 *  Clean up.
		 *  @return  {Tone.BufferSource}  this
		 */Tone.BufferSource.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this.onended=null;this._source.onended=null;this._source.disconnect();this._source=null;this._gainNode.dispose();this._gainNode=null;this._buffer.dispose();this._buffer=null;this._startTime=-1;this.playbackRate=null;Tone.context.clearTimeout(this._onendedTimeout);return this;};return Tone.BufferSource;});Module(function(Tone){/**
		 *  @class  Tone.Noise is a noise generator. It uses looped noise buffers to save on performance.
		 *          Tone.Noise supports the noise types: "pink", "white", and "brown". Read more about
		 *          colors of noise on [Wikipedia](https://en.wikipedia.org/wiki/Colors_of_noise).
		 *
		 *  @constructor
		 *  @extends {Tone.Source}
		 *  @param {string} type the noise type (white|pink|brown)
		 *  @example
		 * //initialize the noise and start
		 * var noise = new Tone.Noise("pink").start();
		 *
		 * //make an autofilter to shape the noise
		 * var autoFilter = new Tone.AutoFilter({
		 * 	"frequency" : "8m",
		 * 	"min" : 800,
		 * 	"max" : 15000
		 * }).connect(Tone.Master);
		 *
		 * //connect the noise
		 * noise.connect(autoFilter);
		 * //start the autofilter LFO
		 * autoFilter.start()
		 */Tone.Noise=function(){var options=Tone.defaults(arguments,['type'],Tone.Noise);Tone.Source.call(this,options);/**
			 *  @private
			 *  @type {AudioBufferSourceNode}
			 */this._source=null;/**
			 *  the buffer
			 *  @private
			 *  @type {AudioBuffer}
			 */this._type=options.type;/**
			 *  The playback rate of the noise. Affects
			 *  the "frequency" of the noise.
			 *  @type {Positive}
			 *  @signal
			 */this._playbackRate=options.playbackRate;};Tone.extend(Tone.Noise,Tone.Source);/**
		 *  the default parameters
		 *
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.Noise.defaults={'type':'white','playbackRate':1};/**
		 * The type of the noise. Can be "white", "brown", or "pink".
		 * @memberOf Tone.Noise#
		 * @type {string}
		 * @name type
		 * @example
		 * noise.type = "white";
		 */Object.defineProperty(Tone.Noise.prototype,'type',{get:function get(){return this._type;},set:function set(type){if(this._type!==type){if(type in _noiseBuffers){this._type=type;//if it's playing, stop and restart it
if(this.state===Tone.State.Started){var now=this.now();this._stop(now);this._start(now);}}else{throw new TypeError('Tone.Noise: invalid type: '+type);}}}});/**
		 *  The playback rate of the noise. Affects
		 *  the "frequency" of the noise.
		 *  @type {Positive}
		 *  @signal
		 */Object.defineProperty(Tone.Noise.prototype,'playbackRate',{get:function get(){return this._playbackRate;},set:function set(rate){this._playbackRate=rate;if(this._source){this._source.playbackRate.value=rate;}}});/**
		 *  internal start method
		 *
		 *  @param {Time} time
		 *  @private
		 */Tone.Noise.prototype._start=function(time){var buffer=_noiseBuffers[this._type];this._source=new Tone.BufferSource(buffer).connect(this.output);this._source.loop=true;this._source.playbackRate.value=this._playbackRate;this._source.start(this.toSeconds(time),Math.random()*(buffer.duration-0.001));};/**
		 *  internal stop method
		 *
		 *  @param {Time} time
		 *  @private
		 */Tone.Noise.prototype._stop=function(time){if(this._source){this._source.stop(this.toSeconds(time));this._source=null;}};/**
		 * Restarts the noise.
		 * @param  {[type]} time [description]
		 * @return {[type]}      [description]
		 */Tone.Noise.prototype.restart=function(time){//TODO could be optimized by cancelling the buffer source 'stop'
//stop and restart
this._stop(time);this._start(time);};/**
		 *  Clean up.
		 *  @returns {Tone.Noise} this
		 */Tone.Noise.prototype.dispose=function(){Tone.Source.prototype.dispose.call(this);if(this._source!==null){this._source.disconnect();this._source=null;}this._buffer=null;return this;};///////////////////////////////////////////////////////////////////////////
// THE BUFFERS
///////////////////////////////////////////////////////////////////////////
//Noise buffer stats
var bufferLength=44100*5;var channels=2;/**
		 *	The noise arrays. Generated on initialization.
		 *  borrowed heavily from https://github.com/zacharydenton/noise.js
		 *  (c) 2013 Zach Denton (MIT)
		 *  @static
		 *  @private
		 *  @type {Array}
		 */var _noiseArrays={'pink':function(){var buffer=[];for(var channelNum=0;channelNum<channels;channelNum++){var channel=new Float32Array(bufferLength);buffer[channelNum]=channel;var b0,b1,b2,b3,b4,b5,b6;b0=b1=b2=b3=b4=b5=b6=0;for(var i=0;i<bufferLength;i++){var white=Math.random()*2-1;b0=0.99886*b0+white*0.0555179;b1=0.99332*b1+white*0.0750759;b2=0.969*b2+white*0.153852;b3=0.8665*b3+white*0.3104856;b4=0.55*b4+white*0.5329522;b5=-0.7616*b5-white*0.016898;channel[i]=b0+b1+b2+b3+b4+b5+b6+white*0.5362;channel[i]*=0.11;// (roughly) compensate for gain
b6=white*0.115926;}}return buffer;}(),'brown':function(){var buffer=[];for(var channelNum=0;channelNum<channels;channelNum++){var channel=new Float32Array(bufferLength);buffer[channelNum]=channel;var lastOut=0;for(var i=0;i<bufferLength;i++){var white=Math.random()*2-1;channel[i]=(lastOut+0.02*white)/1.02;lastOut=channel[i];channel[i]*=3.5;// (roughly) compensate for gain
}}return buffer;}(),'white':function(){var buffer=[];for(var channelNum=0;channelNum<channels;channelNum++){var channel=new Float32Array(bufferLength);buffer[channelNum]=channel;for(var i=0;i<bufferLength;i++){channel[i]=Math.random()*2-1;}}return buffer;}()};/**
		 *	static noise buffers
		 *  @static
		 *  @private
		 *  @type {Tone.Buffer}
		 */var _noiseBuffers={};//create the Tone.Buffers
function createBuffers(){for(var type in _noiseArrays){_noiseBuffers[type]=new Tone.Buffer().fromArray(_noiseArrays[type]);}}//create the noise buffers
Tone.getContext(createBuffers);Tone.Context.on('init',createBuffers);return Tone.Noise;});Module(function(Tone){/**
		 *  @class Simple convolution created with decaying noise.
		 *  		Generates an Impulse Response Buffer
		 * 			with Tone.Offline then feeds the IR into ConvolverNode.
		 * 			Note: the Reverb will not make any sound until [generate](#generate)
		 * 			has been invoked and resolved.
		 *
		 * 			Inspiration from [ReverbGen](https://github.com/adelespinasse/reverbGen).
		 * 			Copyright (c) 2014 Alan deLespinasse Apache 2.0 License.
		 *
		 *  @extends {Tone.Convolver}
		 *  @param {Time=} decay The amount of time it will reverberate for.
		 */Tone.Reverb=function(){var options=Tone.defaults(arguments,['decay'],Tone.Reverb);Tone.Effect.call(this,options);/**
			 *  Convolver node
			 *  @type {ConvolverNode}
			 *  @private
			 */this._convolver=this.context.createConvolver();/**
			 * The duration of the reverb
			 * @type {Time}
			 */this.decay=options.decay;/**
			 * The amount of time before the reverb is fully
			 * ramped in.
			 * @type {Time}
			 */this.preDelay=options.preDelay;this.connectEffect(this._convolver);};Tone.extend(Tone.Reverb,Tone.Effect);/**
		 * The defaults
		 * @type {Object}
		 * @static
		 */Tone.Reverb.defaults={'decay':1.5,'preDelay':0.01};/**
		 * Generate the Impulse Response. Returns a promise while the IR is being
		 * generated.
		 * @return {Promise<Tone.Reverb>} Promise which returns this object.
		 */Tone.Reverb.prototype.generate=function(){return Tone.Offline(function(){//create a noise burst which decays over the duration
var noiseL=new Tone.Noise();var noiseR=new Tone.Noise();var merge=new Tone.Merge();noiseL.connect(merge.left);noiseR.connect(merge.right);var gainNode=new Tone.Gain().toMaster();merge.connect(gainNode);noiseL.start(0);noiseR.start(0);//short fade in
gainNode.gain.setValueAtTime(0,0);gainNode.gain.linearRampToValueAtTime(1,this.preDelay);//decay
gainNode.gain.exponentialApproachValueAtTime(0,this.preDelay,this.decay-this.preDelay);}.bind(this),this.decay).then(function(buffer){this._convolver.buffer=buffer.get();return this;}.bind(this));};/**
		 *  Clean up.
		 *  @return  {Tone.Reverb}  this
		 */Tone.Reverb.prototype.dispose=function(){Tone.Effect.prototype.dispose.call(this);this._convolver.disconnect();this._convolver=null;return this;};return Tone.Reverb;});Module(function(Tone){/**
		 *  @class Base class for stereo feedback effects where the effectReturn
		 *         is fed back into the same channel.
		 *
		 *	@constructor
		 *	@extends {Tone.StereoEffect}
		 */Tone.StereoFeedbackEffect=function(){var options=Tone.defaults(arguments,['feedback'],Tone.FeedbackEffect);Tone.StereoEffect.call(this,options);/**
			 *  controls the amount of feedback
			 *  @type {NormalRange}
			 *  @signal
			 */this.feedback=new Tone.Signal(options.feedback,Tone.Type.NormalRange);/**
			 *  the left side feeback
			 *  @type {Tone.Gain}
			 *  @private
			 */this._feedbackL=new Tone.Gain();/**
			 *  the right side feeback
			 *  @type {Tone.Gain}
			 *  @private
			 */this._feedbackR=new Tone.Gain();//connect it up
this.effectReturnL.chain(this._feedbackL,this.effectSendL);this.effectReturnR.chain(this._feedbackR,this.effectSendR);this.feedback.fan(this._feedbackL.gain,this._feedbackR.gain);this._readOnly(['feedback']);};Tone.extend(Tone.StereoFeedbackEffect,Tone.StereoEffect);/**
		 *  clean up
		 *  @returns {Tone.StereoFeedbackEffect} this
		 */Tone.StereoFeedbackEffect.prototype.dispose=function(){Tone.StereoEffect.prototype.dispose.call(this);this._writable(['feedback']);this.feedback.dispose();this.feedback=null;this._feedbackL.dispose();this._feedbackL=null;this._feedbackR.dispose();this._feedbackR=null;return this;};return Tone.StereoFeedbackEffect;});Module(function(Tone){/**
		 *  @class Applies a width factor to the mid/side seperation.
		 *         0 is all mid and 1 is all side.
		 *         Algorithm found in [kvraudio forums](http://www.kvraudio.com/forum/viewtopic.php?t=212587).
		 *         <br><br>
		 *         <code>
		 *         Mid *= 2*(1-width)<br>
		 *         Side *= 2*width
		 *         </code>
		 *
		 *  @extends {Tone.MidSideEffect}
		 *  @constructor
		 *  @param {NormalRange|Object} [width] The stereo width. A width of 0 is mono and 1 is stereo. 0.5 is no change.
		 */Tone.StereoWidener=function(){var options=Tone.defaults(arguments,['width'],Tone.StereoWidener);Tone.MidSideEffect.call(this,options);/**
			 *  The width control. 0 = 100% mid. 1 = 100% side. 0.5 = no change.
			 *  @type {NormalRange}
			 *  @signal
			 */this.width=new Tone.Signal(options.width,Tone.Type.NormalRange);this._readOnly(['width']);/**
			 * Two times the (1-width) for the mid channel
			 * @type {Tone.Multiply}
			 * @private
			 */this._twoTimesWidthMid=new Tone.Multiply(2);/**
			 * Two times the width for the side channel
			 * @type {Tone.Multiply}
			 * @private
			 */this._twoTimesWidthSide=new Tone.Multiply(2);/**
			 *  Mid multiplier
			 *  @type {Tone.Multiply}
			 *  @private
			 */this._midMult=new Tone.Multiply();this._twoTimesWidthMid.connect(this._midMult,0,1);this.midSend.chain(this._midMult,this.midReturn);/**
			 * 1 - width
			 * @type {Tone}
			 */this._oneMinusWidth=new Tone.Subtract();this._oneMinusWidth.connect(this._twoTimesWidthMid);this.context.getConstant(1).connect(this._oneMinusWidth,0,0);this.width.connect(this._oneMinusWidth,0,1);/**
			 *  Side multiplier
			 *  @type {Tone.Multiply}
			 *  @private
			 */this._sideMult=new Tone.Multiply();this.width.connect(this._twoTimesWidthSide);this._twoTimesWidthSide.connect(this._sideMult,0,1);this.sideSend.chain(this._sideMult,this.sideReturn);};Tone.extend(Tone.StereoWidener,Tone.MidSideEffect);/**
		 *  the default values
		 *  @static
		 *  @type {Object}
		 */Tone.StereoWidener.defaults={'width':0.5};/**
		 *  Clean up.
		 *  @returns {Tone.StereoWidener} this
		 */Tone.StereoWidener.prototype.dispose=function(){Tone.MidSideEffect.prototype.dispose.call(this);this._writable(['width']);this.width.dispose();this.width=null;this._midMult.dispose();this._midMult=null;this._sideMult.dispose();this._sideMult=null;this._twoTimesWidthMid.dispose();this._twoTimesWidthMid=null;this._twoTimesWidthSide.dispose();this._twoTimesWidthSide=null;this._oneMinusWidth.dispose();this._oneMinusWidth=null;return this;};return Tone.StereoWidener;});Module(function(Tone){/**
		 *  @class Tone.Tremolo modulates the amplitude of an incoming signal using a Tone.LFO.
		 *         The type, frequency, and depth of the LFO is controllable.
		 *
		 *  @extends {Tone.StereoEffect}
		 *  @constructor
		 *  @param {Frequency} [frequency] The rate of the effect.
		 *  @param {NormalRange} [depth] The depth of the effect.
		 *  @example
		 * //create a tremolo and start it's LFO
		 * var tremolo = new Tone.Tremolo(9, 0.75).toMaster().start();
		 * //route an oscillator through the tremolo and start it
		 * var oscillator = new Tone.Oscillator().connect(tremolo).start();
		 */Tone.Tremolo=function(){var options=Tone.defaults(arguments,['frequency','depth'],Tone.Tremolo);Tone.StereoEffect.call(this,options);/**
			 *  The tremelo LFO in the left channel
			 *  @type  {Tone.LFO}
			 *  @private
			 */this._lfoL=new Tone.LFO({'phase':options.spread,'min':1,'max':0});/**
			 *  The tremelo LFO in the left channel
			 *  @type  {Tone.LFO}
			 *  @private
			 */this._lfoR=new Tone.LFO({'phase':options.spread,'min':1,'max':0});/**
			 *  Where the gain is multiplied
			 *  @type  {Tone.Gain}
			 *  @private
			 */this._amplitudeL=new Tone.Gain();/**
			 *  Where the gain is multiplied
			 *  @type  {Tone.Gain}
			 *  @private
			 */this._amplitudeR=new Tone.Gain();/**
			 *  The frequency of the tremolo.
			 *  @type  {Frequency}
			 *  @signal
			 */this.frequency=new Tone.Signal(options.frequency,Tone.Type.Frequency);/**
			 *  The depth of the effect. A depth of 0, has no effect
			 *  on the amplitude, and a depth of 1 makes the amplitude
			 *  modulate fully between 0 and 1.
			 *  @type  {NormalRange}
			 *  @signal
			 */this.depth=new Tone.Signal(options.depth,Tone.Type.NormalRange);this._readOnly(['frequency','depth']);this.effectSendL.chain(this._amplitudeL,this.effectReturnL);this.effectSendR.chain(this._amplitudeR,this.effectReturnR);this._lfoL.connect(this._amplitudeL.gain);this._lfoR.connect(this._amplitudeR.gain);this.frequency.fan(this._lfoL.frequency,this._lfoR.frequency);this.depth.fan(this._lfoR.amplitude,this._lfoL.amplitude);this.type=options.type;this.spread=options.spread;};Tone.extend(Tone.Tremolo,Tone.StereoEffect);/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.Tremolo.defaults={'frequency':10,'type':'sine','depth':0.5,'spread':180};/**
		 * Start the tremolo.
		 * @param {Time} [time=now] When the tremolo begins.
		 * @returns {Tone.Tremolo} this
		 */Tone.Tremolo.prototype.start=function(time){this._lfoL.start(time);this._lfoR.start(time);return this;};/**
		 * Stop the tremolo.
		 * @param {Time} [time=now] When the tremolo stops.
		 * @returns {Tone.Tremolo} this
		 */Tone.Tremolo.prototype.stop=function(time){this._lfoL.stop(time);this._lfoR.stop(time);return this;};/**
		 * Sync the effect to the transport.
		 * @param {Time} [delay=0] Delay time before starting the effect after the
		 *                              Transport has started.
		 * @returns {Tone.AutoFilter} this
		 */Tone.Tremolo.prototype.sync=function(delay){this._lfoL.sync(delay);this._lfoR.sync(delay);Tone.Transport.syncSignal(this.frequency);return this;};/**
		 * Unsync the filter from the transport
		 * @returns {Tone.Tremolo} this
		 */Tone.Tremolo.prototype.unsync=function(){this._lfoL.unsync();this._lfoR.unsync();Tone.Transport.unsyncSignal(this.frequency);return this;};/**
		 * The Tremolo's oscillator type.
		 * @memberOf Tone.Tremolo#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.Tremolo.prototype,'type',{get:function get(){return this._lfoL.type;},set:function set(type){this._lfoL.type=type;this._lfoR.type=type;}});/**
		 * Amount of stereo spread. When set to 0, both LFO's will be panned centrally.
		 * When set to 180, LFO's will be panned hard left and right respectively.
		 * @memberOf Tone.Tremolo#
		 * @type {Degrees}
		 * @name spread
		 */Object.defineProperty(Tone.Tremolo.prototype,'spread',{get:function get(){return this._lfoR.phase-this._lfoL.phase;//180
},set:function set(spread){this._lfoL.phase=90-spread/2;this._lfoR.phase=spread/2+90;}});/**
		 *  clean up
		 *  @returns {Tone.Tremolo} this
		 */Tone.Tremolo.prototype.dispose=function(){Tone.StereoEffect.prototype.dispose.call(this);this._writable(['frequency','depth']);this._lfoL.dispose();this._lfoL=null;this._lfoR.dispose();this._lfoR=null;this._amplitudeL.dispose();this._amplitudeL=null;this._amplitudeR.dispose();this._amplitudeR=null;this.frequency=null;this.depth=null;return this;};return Tone.Tremolo;});Module(function(Tone){/**
		 *  @class A Vibrato effect composed of a Tone.Delay and a Tone.LFO. The LFO
		 *         modulates the delayTime of the delay, causing the pitch to rise
		 *         and fall. 
		 *  @extends {Tone.Effect}
		 *  @param {Frequency} frequency The frequency of the vibrato.
		 *  @param {NormalRange} depth The amount the pitch is modulated.
		 */Tone.Vibrato=function(){var options=Tone.defaults(arguments,['frequency','depth'],Tone.Vibrato);Tone.Effect.call(this,options);/**
			 *  The delay node used for the vibrato effect
			 *  @type {Tone.Delay}
			 *  @private
			 */this._delayNode=new Tone.Delay(0,options.maxDelay);/**
			 *  The LFO used to control the vibrato
			 *  @type {Tone.LFO}
			 *  @private
			 */this._lfo=new Tone.LFO({'type':options.type,'min':0,'max':options.maxDelay,'frequency':options.frequency,'phase':-90//offse the phase so the resting position is in the center
}).start().connect(this._delayNode.delayTime);/**
			 *  The frequency of the vibrato
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=this._lfo.frequency;/**
			 *  The depth of the vibrato. 
			 *  @type {NormalRange}
			 *  @signal
			 */this.depth=this._lfo.amplitude;this.depth.value=options.depth;this._readOnly(['frequency','depth']);this.effectSend.chain(this._delayNode,this.effectReturn);};Tone.extend(Tone.Vibrato,Tone.Effect);/**
		 *  The defaults
		 *  @type  {Object}
		 *  @const
		 */Tone.Vibrato.defaults={'maxDelay':0.005,'frequency':5,'depth':0.1,'type':'sine'};/**
		 * Type of oscillator attached to the Vibrato.
		 * @memberOf Tone.Vibrato#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.Vibrato.prototype,'type',{get:function get(){return this._lfo.type;},set:function set(type){this._lfo.type=type;}});/**
		 *  Clean up.
		 *  @returns {Tone.Vibrato} this
		 */Tone.Vibrato.prototype.dispose=function(){Tone.Effect.prototype.dispose.call(this);this._delayNode.dispose();this._delayNode=null;this._lfo.dispose();this._lfo=null;this._writable(['frequency','depth']);this.frequency=null;this.depth=null;};return Tone.Vibrato;});Module(function(Tone){/**
		 *  @class  Tone.Event abstracts away Tone.Transport.schedule and provides a schedulable
		 *          callback for a single or repeatable events along the timeline.
		 *
		 *  @extends {Tone}
		 *  @param {function} callback The callback to invoke at the time.
		 *  @param {*} value The value or values which should be passed to
		 *                      the callback function on invocation.
		 *  @example
		 * var chord = new Tone.Event(function(time, chord){
		 * 	//the chord as well as the exact time of the event
		 * 	//are passed in as arguments to the callback function
		 * }, ["D4", "E4", "F4"]);
		 * //start the chord at the beginning of the transport timeline
		 * chord.start();
		 * //loop it every measure for 8 measures
		 * chord.loop = 8;
		 * chord.loopEnd = "1m";
		 */Tone.Event=function(){var options=Tone.defaults(arguments,['callback','value'],Tone.Event);Tone.call(this);/**
			 *  Loop value
			 *  @type  {Boolean|Positive}
			 *  @private
			 */this._loop=options.loop;/**
			 *  The callback to invoke.
			 *  @type  {Function}
			 */this.callback=options.callback;/**
			 *  The value which is passed to the
			 *  callback function.
			 *  @type  {*}
			 *  @private
			 */this.value=options.value;/**
			 *  When the note is scheduled to start.
			 *  @type  {Number}
			 *  @private
			 */this._loopStart=this.toTicks(options.loopStart);/**
			 *  When the note is scheduled to start.
			 *  @type  {Number}
			 *  @private
			 */this._loopEnd=this.toTicks(options.loopEnd);/**
			 *  Tracks the scheduled events
			 *  @type {Tone.TimelineState}
			 *  @private
			 */this._state=new Tone.TimelineState(Tone.State.Stopped);/**
			 *  The playback speed of the note. A speed of 1
			 *  is no change.
			 *  @private
			 *  @type {Positive}
			 */this._playbackRate=1;/**
			 *  A delay time from when the event is scheduled to start
			 *  @type {Ticks}
			 *  @private
			 */this._startOffset=0;/**
			 *  private holder of probability value
			 *  @type {NormalRange}
			 *  @private
			 */this._probability=options.probability;/**
			 *  the amount of variation from the
			 *  given time.
			 *  @type {Boolean|Time}
			 *  @private
			 */this._humanize=options.humanize;/**
			 *  If mute is true, the callback won't be
			 *  invoked.
			 *  @type {Boolean}
			 */this.mute=options.mute;//set the initial values
this.playbackRate=options.playbackRate;};Tone.extend(Tone.Event);/**
		 *  The default values
		 *  @type  {Object}
		 *  @const
		 */Tone.Event.defaults={'callback':Tone.noOp,'loop':false,'loopEnd':'1m','loopStart':0,'playbackRate':1,'value':null,'probability':1,'mute':false,'humanize':false};/**
		 *  Reschedule all of the events along the timeline
		 *  with the updated values.
		 *  @param {Time} after Only reschedules events after the given time.
		 *  @return  {Tone.Event}  this
		 *  @private
		 */Tone.Event.prototype._rescheduleEvents=function(after){//if no argument is given, schedules all of the events
after=Tone.defaultArg(after,-1);this._state.forEachFrom(after,function(event){var duration;if(event.state===Tone.State.Started){if(Tone.isDefined(event.id)){Tone.Transport.clear(event.id);}var startTick=event.time+Math.round(this.startOffset/this._playbackRate);if(this._loop){duration=Infinity;if(Tone.isNumber(this._loop)){duration=this._loop*this._getLoopDuration();}var nextEvent=this._state.getAfter(startTick);if(nextEvent!==null){duration=Math.min(duration,nextEvent.time-startTick);}if(duration!==Infinity){//schedule a stop since it's finite duration
this._state.setStateAtTime(Tone.State.Stopped,startTick+duration+1);duration=Tone.Ticks(duration);}var interval=Tone.Ticks(this._getLoopDuration());event.id=Tone.Transport.scheduleRepeat(this._tick.bind(this),interval,Tone.Ticks(startTick),duration);}else{event.id=Tone.Transport.schedule(this._tick.bind(this),Tone.Ticks(startTick));}}}.bind(this));return this;};/**
		 *  Returns the playback state of the note, either "started" or "stopped".
		 *  @type {String}
		 *  @readOnly
		 *  @memberOf Tone.Event#
		 *  @name state
		 */Object.defineProperty(Tone.Event.prototype,'state',{get:function get(){return this._state.getValueAtTime(Tone.Transport.ticks);}});/**
		 *  The start from the scheduled start time
		 *  @type {Ticks}
		 *  @memberOf Tone.Event#
		 *  @name startOffset
		 *  @private
		 */Object.defineProperty(Tone.Event.prototype,'startOffset',{get:function get(){return this._startOffset;},set:function set(offset){this._startOffset=offset;}});/**
		 *  The probability of the notes being triggered.
		 *  @memberOf Tone.Event#
		 *  @type {NormalRange}
		 *  @name probability
		 */Object.defineProperty(Tone.Event.prototype,'probability',{get:function get(){return this._probability;},set:function set(prob){this._probability=prob;}});/**
		 *  If set to true, will apply small random variation
		 *  to the callback time. If the value is given as a time, it will randomize
		 *  by that amount.
		 *  @example
		 * event.humanize = true;
		 *  @type {Boolean|Time}
		 *  @name humanize
		 */Object.defineProperty(Tone.Event.prototype,'humanize',{get:function get(){return this._humanize;},set:function set(variation){this._humanize=variation;}});/**
		 *  Start the note at the given time.
		 *  @param  {TimelinePosition}  time  When the note should start.
		 *  @return  {Tone.Event}  this
		 */Tone.Event.prototype.start=function(time){time=this.toTicks(time);if(this._state.getValueAtTime(time)===Tone.State.Stopped){this._state.add({'state':Tone.State.Started,'time':time,'id':undefined});this._rescheduleEvents(time);}return this;};/**
		 *  Stop the Event at the given time.
		 *  @param  {TimelinePosition}  time  When the note should stop.
		 *  @return  {Tone.Event}  this
		 */Tone.Event.prototype.stop=function(time){this.cancel(time);time=this.toTicks(time);if(this._state.getValueAtTime(time)===Tone.State.Started){this._state.setStateAtTime(Tone.State.Stopped,time);var previousEvent=this._state.getBefore(time);var reschedulTime=time;if(previousEvent!==null){reschedulTime=previousEvent.time;}this._rescheduleEvents(reschedulTime);}return this;};/**
		 *  Cancel all scheduled events greater than or equal to the given time
		 *  @param  {TimelinePosition}  [time=0]  The time after which events will be cancel.
		 *  @return  {Tone.Event}  this
		 */Tone.Event.prototype.cancel=function(time){time=Tone.defaultArg(time,-Infinity);time=this.toTicks(time);this._state.forEachFrom(time,function(event){Tone.Transport.clear(event.id);});this._state.cancel(time);return this;};/**
		 *  The callback function invoker. Also
		 *  checks if the Event is done playing
		 *  @param  {Number}  time  The time of the event in seconds
		 *  @private
		 */Tone.Event.prototype._tick=function(time){var ticks=Tone.Transport.getTicksAtTime(time);if(!this.mute&&this._state.getValueAtTime(ticks)===Tone.State.Started){if(this.probability<1&&Math.random()>this.probability){return;}if(this.humanize){var variation=0.02;if(!Tone.isBoolean(this.humanize)){variation=this.toSeconds(this.humanize);}time+=(Math.random()*2-1)*variation;}this.callback(time,this.value);}};/**
		 *  Get the duration of the loop.
		 *  @return  {Ticks}
		 *  @private
		 */Tone.Event.prototype._getLoopDuration=function(){return Math.round((this._loopEnd-this._loopStart)/this._playbackRate);};/**
		 *  If the note should loop or not
		 *  between Tone.Event.loopStart and
		 *  Tone.Event.loopEnd. An integer
		 *  value corresponds to the number of
		 *  loops the Event does after it starts.
		 *  @memberOf Tone.Event#
		 *  @type {Boolean|Positive}
		 *  @name loop
		 */Object.defineProperty(Tone.Event.prototype,'loop',{get:function get(){return this._loop;},set:function set(loop){this._loop=loop;this._rescheduleEvents();}});/**
		 * 	The playback rate of the note. Defaults to 1.
		 *  @memberOf Tone.Event#
		 *  @type {Positive}
		 *  @name playbackRate
		 *  @example
		 * note.loop = true;
		 * //repeat the note twice as fast
		 * note.playbackRate = 2;
		 */Object.defineProperty(Tone.Event.prototype,'playbackRate',{get:function get(){return this._playbackRate;},set:function set(rate){this._playbackRate=rate;this._rescheduleEvents();}});/**
		 *  The loopEnd point is the time the event will loop
		 *  if Tone.Event.loop is true.
		 *  @memberOf Tone.Event#
		 *  @type {Time}
		 *  @name loopEnd
		 */Object.defineProperty(Tone.Event.prototype,'loopEnd',{get:function get(){return Tone.Ticks(this._loopEnd).toSeconds();},set:function set(loopEnd){this._loopEnd=this.toTicks(loopEnd);if(this._loop){this._rescheduleEvents();}}});/**
		 *  The time when the loop should start.
		 *  @memberOf Tone.Event#
		 *  @type {Time}
		 *  @name loopStart
		 */Object.defineProperty(Tone.Event.prototype,'loopStart',{get:function get(){return Tone.Ticks(this._loopStart).toSeconds();},set:function set(loopStart){this._loopStart=this.toTicks(loopStart);if(this._loop){this._rescheduleEvents();}}});/**
		 *  The current progress of the loop interval.
		 *  Returns 0 if the event is not started yet or
		 *  it is not set to loop.
		 *  @memberOf Tone.Event#
		 *  @type {NormalRange}
		 *  @name progress
		 *  @readOnly
		 */Object.defineProperty(Tone.Event.prototype,'progress',{get:function get(){if(this._loop){var ticks=Tone.Transport.ticks;var lastEvent=this._state.get(ticks);if(lastEvent!==null&&lastEvent.state===Tone.State.Started){var loopDuration=this._getLoopDuration();var progress=(ticks-lastEvent.time)%loopDuration;return progress/loopDuration;}else{return 0;}}else{return 0;}}});/**
		 *  Clean up
		 *  @return  {Tone.Event}  this
		 */Tone.Event.prototype.dispose=function(){this.cancel();this._state.dispose();this._state=null;this.callback=null;this.value=null;};return Tone.Event;});Module(function(Tone){/**
		 *  @class Tone.Loop creates a looped callback at the 
		 *         specified interval. The callback can be 
		 *         started, stopped and scheduled along
		 *         the Transport's timeline. 
		 *  @example
		 * var loop = new Tone.Loop(function(time){
		 * 	//triggered every eighth note. 
		 * 	console.log(time);
		 * }, "8n").start(0);
		 * Tone.Transport.start();
		 *  @extends {Tone}
		 *  @param {Function} callback The callback to invoke with the event.
		 *  @param {Time} interval The time between successive callback calls. 
		 */Tone.Loop=function(){var options=Tone.defaults(arguments,['callback','interval'],Tone.Loop);Tone.call(this);/**
			 *  The event which produces the callbacks
			 */this._event=new Tone.Event({'callback':this._tick.bind(this),'loop':true,'loopEnd':options.interval,'playbackRate':options.playbackRate,'probability':options.probability});/**
			 *  The callback to invoke with the next event in the pattern
			 *  @type {Function}
			 */this.callback=options.callback;//set the iterations
this.iterations=options.iterations;};Tone.extend(Tone.Loop);/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */Tone.Loop.defaults={'interval':'4n','callback':Tone.noOp,'playbackRate':1,'iterations':Infinity,'probability':true,'mute':false};/**
		 *  Start the loop at the specified time along the Transport's
		 *  timeline.
		 *  @param  {TimelinePosition=}  time  When to start the Loop.
		 *  @return  {Tone.Loop}  this
		 */Tone.Loop.prototype.start=function(time){this._event.start(time);return this;};/**
		 *  Stop the loop at the given time.
		 *  @param  {TimelinePosition=}  time  When to stop the Arpeggio
		 *  @return  {Tone.Loop}  this
		 */Tone.Loop.prototype.stop=function(time){this._event.stop(time);return this;};/**
		 *  Cancel all scheduled events greater than or equal to the given time
		 *  @param  {TimelinePosition}  [time=0]  The time after which events will be cancel.
		 *  @return  {Tone.Loop}  this
		 */Tone.Loop.prototype.cancel=function(time){this._event.cancel(time);return this;};/**
		 *  Internal function called when the notes should be called
		 *  @param  {Number}  time  The time the event occurs
		 *  @private
		 */Tone.Loop.prototype._tick=function(time){this.callback(time);};/**
		 *  The state of the Loop, either started or stopped.
		 *  @memberOf Tone.Loop#
		 *  @type {String}
		 *  @name state
		 *  @readOnly
		 */Object.defineProperty(Tone.Loop.prototype,'state',{get:function get(){return this._event.state;}});/**
		 *  The progress of the loop as a value between 0-1. 0, when
		 *  the loop is stopped or done iterating. 
		 *  @memberOf Tone.Loop#
		 *  @type {NormalRange}
		 *  @name progress
		 *  @readOnly
		 */Object.defineProperty(Tone.Loop.prototype,'progress',{get:function get(){return this._event.progress;}});/**
		 *  The time between successive callbacks. 
		 *  @example
		 * loop.interval = "8n"; //loop every 8n
		 *  @memberOf Tone.Loop#
		 *  @type {Time}
		 *  @name interval
		 */Object.defineProperty(Tone.Loop.prototype,'interval',{get:function get(){return this._event.loopEnd;},set:function set(interval){this._event.loopEnd=interval;}});/**
		 *  The playback rate of the loop. The normal playback rate is 1 (no change). 
		 *  A `playbackRate` of 2 would be twice as fast. 
		 *  @memberOf Tone.Loop#
		 *  @type {Time}
		 *  @name playbackRate
		 */Object.defineProperty(Tone.Loop.prototype,'playbackRate',{get:function get(){return this._event.playbackRate;},set:function set(rate){this._event.playbackRate=rate;}});/**
		 *  Random variation +/-0.01s to the scheduled time. 
		 *  Or give it a time value which it will randomize by.
		 *  @type {Boolean|Time}
		 *  @memberOf Tone.Loop#
		 *  @name humanize
		 */Object.defineProperty(Tone.Loop.prototype,'humanize',{get:function get(){return this._event.humanize;},set:function set(variation){this._event.humanize=variation;}});/**
		 *  The probably of the callback being invoked.
		 *  @memberOf Tone.Loop#
		 *  @type {NormalRange}
		 *  @name probability
		 */Object.defineProperty(Tone.Loop.prototype,'probability',{get:function get(){return this._event.probability;},set:function set(prob){this._event.probability=prob;}});/**
		 *  Muting the Loop means that no callbacks are invoked.
		 *  @memberOf Tone.Loop#
		 *  @type {Boolean}
		 *  @name mute
		 */Object.defineProperty(Tone.Loop.prototype,'mute',{get:function get(){return this._event.mute;},set:function set(mute){this._event.mute=mute;}});/**
		 *  The number of iterations of the loop. The default
		 *  value is Infinity (loop forever).
		 *  @memberOf Tone.Loop#
		 *  @type {Positive}
		 *  @name iterations
		 */Object.defineProperty(Tone.Loop.prototype,'iterations',{get:function get(){if(this._event.loop===true){return Infinity;}else{return this._event.loop;}},set:function set(iters){if(iters===Infinity){this._event.loop=true;}else{this._event.loop=iters;}}});/**
		 *  Clean up
		 *  @return  {Tone.Loop}  this
		 */Tone.Loop.prototype.dispose=function(){this._event.dispose();this._event=null;this.callback=null;};return Tone.Loop;});Module(function(Tone){/**
		 *  @class Tone.Part is a collection Tone.Events which can be
		 *         started/stopped and looped as a single unit.
		 *
		 *  @extends {Tone.Event}
		 *  @param {Function} callback The callback to invoke on each event
		 *  @param {Array} events the array of events
		 *  @example
		 * var part = new Tone.Part(function(time, note){
		 * 	//the notes given as the second element in the array
		 * 	//will be passed in as the second argument
		 * 	synth.triggerAttackRelease(note, "8n", time);
		 * }, [[0, "C2"], ["0:2", "C3"], ["0:3:2", "G2"]]);
		 *  @example
		 * //use an array of objects as long as the object has a "time" attribute
		 * var part = new Tone.Part(function(time, value){
		 * 	//the value is an object which contains both the note and the velocity
		 * 	synth.triggerAttackRelease(value.note, "8n", time, value.velocity);
		 * }, [{"time" : 0, "note" : "C3", "velocity": 0.9},
		 * 	   {"time" : "0:2", "note" : "C4", "velocity": 0.5}
		 * ]).start(0);
		 */Tone.Part=function(){var options=Tone.defaults(arguments,['callback','events'],Tone.Part);Tone.Event.call(this,options);/**
			 *  An array of Objects.
			 *  @type  {Array}
			 *  @private
			 */this._events=[];//add the events
for(var i=0;i<options.events.length;i++){if(Array.isArray(options.events[i])){this.add(options.events[i][0],options.events[i][1]);}else{this.add(options.events[i]);}}};Tone.extend(Tone.Part,Tone.Event);/**
		 *  The default values
		 *  @type  {Object}
		 *  @const
		 */Tone.Part.defaults={'callback':Tone.noOp,'loop':false,'loopEnd':'1m','loopStart':0,'playbackRate':1,'probability':1,'humanize':false,'mute':false,'events':[]};/**
		 *  Start the part at the given time.
		 *  @param  {TransportTime}  time    When to start the part.
		 *  @param  {Time=}  offset  The offset from the start of the part
		 *                           to begin playing at.
		 *  @return  {Tone.Part}  this
		 */Tone.Part.prototype.start=function(time,offset){var ticks=this.toTicks(time);if(this._state.getValueAtTime(ticks)!==Tone.State.Started){if(this._loop){offset=Tone.defaultArg(offset,this._loopStart);}else{offset=Tone.defaultArg(offset,0);}offset=this.toTicks(offset);this._state.add({'state':Tone.State.Started,'time':ticks,'offset':offset});this._forEach(function(event){this._startNote(event,ticks,offset);});}return this;};/**
		 *  Start the event in the given event at the correct time given
		 *  the ticks and offset and looping.
		 *  @param  {Tone.Event}  event
		 *  @param  {Ticks}  ticks
		 *  @param  {Ticks}  offset
		 *  @private
		 */Tone.Part.prototype._startNote=function(event,ticks,offset){ticks-=offset;if(this._loop){if(event.startOffset>=this._loopStart&&event.startOffset<this._loopEnd){if(event.startOffset<offset){//start it on the next loop
ticks+=this._getLoopDuration();}event.start(Tone.Ticks(ticks));}else if(event.startOffset<this._loopStart&&event.startOffset>=offset){event.loop=false;event.start(Tone.Ticks(ticks));}}else if(event.startOffset>=offset){event.start(Tone.Ticks(ticks));}};/**
		 *  The start from the scheduled start time
		 *  @type {Ticks}
		 *  @memberOf Tone.Part#
		 *  @name startOffset
		 *  @private
		 */Object.defineProperty(Tone.Part.prototype,'startOffset',{get:function get(){return this._startOffset;},set:function set(offset){this._startOffset=offset;this._forEach(function(event){event.startOffset+=this._startOffset;});}});/**
		 *  Stop the part at the given time.
		 *  @param  {TimelinePosition}  time  When to stop the part.
		 *  @return  {Tone.Part}  this
		 */Tone.Part.prototype.stop=function(time){var ticks=this.toTicks(time);this._state.cancel(ticks);this._state.setStateAtTime(Tone.State.Stopped,ticks);this._forEach(function(event){event.stop(time);});return this;};/**
		 *  Get/Set an Event's value at the given time.
		 *  If a value is passed in and no event exists at
		 *  the given time, one will be created with that value.
		 *  If two events are at the same time, the first one will
		 *  be returned.
		 *  @example
		 * part.at("1m"); //returns the part at the first measure
		 *
		 * part.at("2m", "C2"); //set the value at "2m" to C2.
		 * //if an event didn't exist at that time, it will be created.
		 *  @param {TransportTime} time The time of the event to get or set.
		 *  @param {*=} value If a value is passed in, the value of the
		 *                    event at the given time will be set to it.
		 *  @return {Tone.Event} the event at the time
		 */Tone.Part.prototype.at=function(time,value){time=Tone.TransportTime(time);var tickTime=Tone.Ticks(1).toSeconds();for(var i=0;i<this._events.length;i++){var event=this._events[i];if(Math.abs(time.toTicks()-event.startOffset)<tickTime){if(Tone.isDefined(value)){event.value=value;}return event;}}//if there was no event at that time, create one
if(Tone.isDefined(value)){this.add(time,value);//return the new event
return this._events[this._events.length-1];}else{return null;}};/**
		 *  Add a an event to the part.
		 *  @param {Time} time The time the note should start.
		 *                            If an object is passed in, it should
		 *                            have a 'time' attribute and the rest
		 *                            of the object will be used as the 'value'.
		 *  @param  {Tone.Event|*}  value
		 *  @returns {Tone.Part} this
		 *  @example
		 * part.add("1m", "C#+11");
		 */Tone.Part.prototype.add=function(time,value){//extract the parameters
if(time.hasOwnProperty('time')){value=time;time=value.time;}time=this.toTicks(time);var event;if(value instanceof Tone.Event){event=value;event.callback=this._tick.bind(this);}else{event=new Tone.Event({'callback':this._tick.bind(this),'value':value});}//the start offset
event.startOffset=time;//initialize the values
event.set({'loopEnd':this.loopEnd,'loopStart':this.loopStart,'loop':this.loop,'humanize':this.humanize,'playbackRate':this.playbackRate,'probability':this.probability});this._events.push(event);//start the note if it should be played right now
this._restartEvent(event);return this;};/**
		 *  Restart the given event
		 *  @param  {Tone.Event}  event
		 *  @private
		 */Tone.Part.prototype._restartEvent=function(event){this._state.forEach(function(stateEvent){if(stateEvent.state===Tone.State.Started){this._startNote(event,stateEvent.time,stateEvent.offset);}else{//stop the note
event.stop(Tone.Ticks(stateEvent.time));}}.bind(this));};/**
		 *  Remove an event from the part. Will recursively iterate
		 *  into nested parts to find the event.
		 *  @param {Time} time The time of the event
		 *  @param {*} value Optionally select only a specific event value
		 *  @return  {Tone.Part}  this
		 */Tone.Part.prototype.remove=function(time,value){//extract the parameters
if(time.hasOwnProperty('time')){value=time;time=value.time;}time=this.toTicks(time);for(var i=this._events.length-1;i>=0;i--){var event=this._events[i];if(event instanceof Tone.Part){event.remove(time,value);}else if(event.startOffset===time){if(Tone.isUndef(value)||Tone.isDefined(value)&&event.value===value){this._events.splice(i,1);event.dispose();}}}return this;};/**
		 *  Remove all of the notes from the group.
		 *  @return  {Tone.Part}  this
		 */Tone.Part.prototype.removeAll=function(){this._forEach(function(event){event.dispose();});this._events=[];return this;};/**
		 *  Cancel scheduled state change events: i.e. "start" and "stop".
		 *  @param {TimelinePosition} after The time after which to cancel the scheduled events.
		 *  @return  {Tone.Part}  this
		 */Tone.Part.prototype.cancel=function(after){this._forEach(function(event){event.cancel(after);});this._state.cancel(this.toTicks(after));return this;};/**
		 *  Iterate over all of the events
		 *  @param {Function} callback
		 *  @param {Object} ctx The context
		 *  @private
		 */Tone.Part.prototype._forEach=function(callback,ctx){if(this._events){ctx=Tone.defaultArg(ctx,this);for(var i=this._events.length-1;i>=0;i--){var e=this._events[i];if(e instanceof Tone.Part){e._forEach(callback,ctx);}else{callback.call(ctx,e);}}}return this;};/**
		 *  Set the attribute of all of the events
		 *  @param  {String}  attr  the attribute to set
		 *  @param  {*}  value      The value to set it to
		 *  @private
		 */Tone.Part.prototype._setAll=function(attr,value){this._forEach(function(event){event[attr]=value;});};/**
		 *  Internal tick method
		 *  @param  {Number}  time  The time of the event in seconds
		 *  @private
		 */Tone.Part.prototype._tick=function(time,value){if(!this.mute){this.callback(time,value);}};/**
		 *  Determine if the event should be currently looping
		 *  given the loop boundries of this Part.
		 *  @param  {Tone.Event}  event  The event to test
		 *  @private
		 */Tone.Part.prototype._testLoopBoundries=function(event){if(event.startOffset<this._loopStart||event.startOffset>=this._loopEnd){event.cancel(0);}else if(event.state===Tone.State.Stopped){//reschedule it if it's stopped
this._restartEvent(event);}};/**
		 *  The probability of the notes being triggered.
		 *  @memberOf Tone.Part#
		 *  @type {NormalRange}
		 *  @name probability
		 */Object.defineProperty(Tone.Part.prototype,'probability',{get:function get(){return this._probability;},set:function set(prob){this._probability=prob;this._setAll('probability',prob);}});/**
		 *  If set to true, will apply small random variation
		 *  to the callback time. If the value is given as a time, it will randomize
		 *  by that amount.
		 *  @example
		 * event.humanize = true;
		 *  @type {Boolean|Time}
		 *  @name humanize
		 */Object.defineProperty(Tone.Part.prototype,'humanize',{get:function get(){return this._humanize;},set:function set(variation){this._humanize=variation;this._setAll('humanize',variation);}});/**
		 *  If the part should loop or not
		 *  between Tone.Part.loopStart and
		 *  Tone.Part.loopEnd. An integer
		 *  value corresponds to the number of
		 *  loops the Part does after it starts.
		 *  @memberOf Tone.Part#
		 *  @type {Boolean|Positive}
		 *  @name loop
		 *  @example
		 * //loop the part 8 times
		 * part.loop = 8;
		 */Object.defineProperty(Tone.Part.prototype,'loop',{get:function get(){return this._loop;},set:function set(loop){this._loop=loop;this._forEach(function(event){event._loopStart=this._loopStart;event._loopEnd=this._loopEnd;event.loop=loop;this._testLoopBoundries(event);});}});/**
		 *  The loopEnd point determines when it will
		 *  loop if Tone.Part.loop is true.
		 *  @memberOf Tone.Part#
		 *  @type {Time}
		 *  @name loopEnd
		 */Object.defineProperty(Tone.Part.prototype,'loopEnd',{get:function get(){return Tone.Ticks(this._loopEnd).toSeconds();},set:function set(loopEnd){this._loopEnd=this.toTicks(loopEnd);if(this._loop){this._forEach(function(event){event.loopEnd=loopEnd;this._testLoopBoundries(event);});}}});/**
		 *  The loopStart point determines when it will
		 *  loop if Tone.Part.loop is true.
		 *  @memberOf Tone.Part#
		 *  @type {Time}
		 *  @name loopStart
		 */Object.defineProperty(Tone.Part.prototype,'loopStart',{get:function get(){return Tone.Ticks(this._loopStart).toSeconds();},set:function set(loopStart){this._loopStart=this.toTicks(loopStart);if(this._loop){this._forEach(function(event){event.loopStart=this.loopStart;this._testLoopBoundries(event);});}}});/**
		 * 	The playback rate of the part
		 *  @memberOf Tone.Part#
		 *  @type {Positive}
		 *  @name playbackRate
		 */Object.defineProperty(Tone.Part.prototype,'playbackRate',{get:function get(){return this._playbackRate;},set:function set(rate){this._playbackRate=rate;this._setAll('playbackRate',rate);}});/**
		 * 	The number of scheduled notes in the part.
		 *  @memberOf Tone.Part#
		 *  @type {Positive}
		 *  @name length
		 *  @readOnly
		 */Object.defineProperty(Tone.Part.prototype,'length',{get:function get(){return this._events.length;}});/**
		 *  Clean up
		 *  @return  {Tone.Part}  this
		 */Tone.Part.prototype.dispose=function(){this.removeAll();this._state.dispose();this._state=null;this.callback=null;this._events=null;return this;};return Tone.Part;});Module(function(Tone){/**
		 *  @class Tone.Pattern arpeggiates between the given notes
		 *         in a number of patterns. See Tone.CtrlPattern for
		 *         a full list of patterns.
		 *  @example
		 * var pattern = new Tone.Pattern(function(time, note){
		 *   //the order of the notes passed in depends on the pattern
		 * }, ["C2", "D4", "E5", "A6"], "upDown");
		 *  @extends {Tone.Loop}
		 *  @param {Function} callback The callback to invoke with the
		 *                             event.
		 *  @param {Array} values The values to arpeggiate over.
		 */Tone.Pattern=function(){var options=Tone.defaults(arguments,['callback','values','pattern'],Tone.Pattern);Tone.Loop.call(this,options);/**
			 *  The pattern manager
			 *  @type {Tone.CtrlPattern}
			 *  @private
			 */this._pattern=new Tone.CtrlPattern({'values':options.values,'type':options.pattern,'index':options.index});};Tone.extend(Tone.Pattern,Tone.Loop);/**
		 *  The defaults
		 *  @const
		 *  @type  {Object}
		 */Tone.Pattern.defaults={'pattern':Tone.CtrlPattern.Type.Up,'callback':Tone.noOp,'values':[]};/**
		 *  Internal function called when the notes should be called
		 *  @param  {Number}  time  The time the event occurs
		 *  @private
		 */Tone.Pattern.prototype._tick=function(time){this.callback(time,this._pattern.value);this._pattern.next();};/**
		 *  The current index in the values array.
		 *  @memberOf Tone.Pattern#
		 *  @type {Positive}
		 *  @name index
		 */Object.defineProperty(Tone.Pattern.prototype,'index',{get:function get(){return this._pattern.index;},set:function set(i){this._pattern.index=i;}});/**
		 *  The array of events.
		 *  @memberOf Tone.Pattern#
		 *  @type {Array}
		 *  @name values
		 */Object.defineProperty(Tone.Pattern.prototype,'values',{get:function get(){return this._pattern.values;},set:function set(vals){this._pattern.values=vals;}});/**
		 *  The current value of the pattern.
		 *  @memberOf Tone.Pattern#
		 *  @type {*}
		 *  @name value
		 *  @readOnly
		 */Object.defineProperty(Tone.Pattern.prototype,'value',{get:function get(){return this._pattern.value;}});/**
		 *  The pattern type. See Tone.CtrlPattern for the full list of patterns.
		 *  @memberOf Tone.Pattern#
		 *  @type {String}
		 *  @name pattern
		 */Object.defineProperty(Tone.Pattern.prototype,'pattern',{get:function get(){return this._pattern.type;},set:function set(pattern){this._pattern.type=pattern;}});/**
		 *  Clean up
		 *  @return  {Tone.Pattern}  this
		 */Tone.Pattern.prototype.dispose=function(){Tone.Loop.prototype.dispose.call(this);this._pattern.dispose();this._pattern=null;};return Tone.Pattern;});Module(function(Tone){/**
		 *  @class A sequence is an alternate notation of a part. Instead
		 *         of passing in an array of [time, event] pairs, pass
		 *         in an array of events which will be spaced at the
		 *         given subdivision. Sub-arrays will subdivide that beat
		 *         by the number of items are in the array.
		 *         Sequence notation inspiration from [Tidal](http://yaxu.org/tidal/)
		 *  @param  {Function}  callback  The callback to invoke with every note
		 *  @param  {Array}    events  The sequence
		 *  @param  {Time} subdivision  The subdivision between which events are placed.
		 *  @extends {Tone.Part}
		 *  @example
		 * var seq = new Tone.Sequence(function(time, note){
		 * 	console.log(note);
		 * //straight quater notes
		 * }, ["C4", "E4", "G4", "A4"], "4n");
		 *  @example
		 * var seq = new Tone.Sequence(function(time, note){
		 * 	console.log(note);
		 * //subdivisions are given as subarrays
		 * }, ["C4", ["E4", "D4", "E4"], "G4", ["A4", "G4"]]);
		 */Tone.Sequence=function(){var options=Tone.defaults(arguments,['callback','events','subdivision'],Tone.Sequence);//remove the events
var events=options.events;delete options.events;Tone.Part.call(this,options);/**
			 *  The subdivison of each note
			 *  @type  {Ticks}
			 *  @private
			 */this._subdivision=this.toTicks(options.subdivision);//if no time was passed in, the loop end is the end of the cycle
if(Tone.isUndef(options.loopEnd)&&Tone.isDefined(events)){this._loopEnd=events.length*this._subdivision;}//defaults to looping
this._loop=true;//add all of the events
if(Tone.isDefined(events)){for(var i=0;i<events.length;i++){this.add(i,events[i]);}}};Tone.extend(Tone.Sequence,Tone.Part);/**
		 *  The default values.
		 *  @type  {Object}
		 */Tone.Sequence.defaults={'subdivision':'4n'};/**
		 *  The subdivision of the sequence. This can only be
		 *  set in the constructor. The subdivision is the
		 *  interval between successive steps.
		 *  @type {Time}
		 *  @memberOf Tone.Sequence#
		 *  @name subdivision
		 *  @readOnly
		 */Object.defineProperty(Tone.Sequence.prototype,'subdivision',{get:function get(){return Tone.Ticks(this._subdivision).toSeconds();}});/**
		 *  Get/Set an index of the sequence. If the index contains a subarray,
		 *  a Tone.Sequence representing that sub-array will be returned.
		 *  @example
		 * var sequence = new Tone.Sequence(playNote, ["E4", "C4", "F#4", ["A4", "Bb3"]])
		 * sequence.at(0)// => returns "E4"
		 * //set a value
		 * sequence.at(0, "G3");
		 * //get a nested sequence
		 * sequence.at(3).at(1)// => returns "Bb3"
		 * @param {Positive} index The index to get or set
		 * @param {*} value Optionally pass in the value to set at the given index.
		 */Tone.Sequence.prototype.at=function(index,value){//if the value is an array,
if(Tone.isArray(value)){//remove the current event at that index
this.remove(index);}//call the parent's method
return Tone.Part.prototype.at.call(this,this._indexTime(index),value);};/**
		 *  Add an event at an index, if there's already something
		 *  at that index, overwrite it. If `value` is an array,
		 *  it will be parsed as a subsequence.
		 *  @param {Number} index The index to add the event to
		 *  @param {*} value The value to add at that index
		 *  @returns {Tone.Sequence} this
		 */Tone.Sequence.prototype.add=function(index,value){if(value===null){return this;}if(Tone.isArray(value)){//make a subsequence and add that to the sequence
var subSubdivision=Math.round(this._subdivision/value.length);value=new Tone.Sequence(this._tick.bind(this),value,Tone.Ticks(subSubdivision));}Tone.Part.prototype.add.call(this,this._indexTime(index),value);return this;};/**
		 *  Remove a value from the sequence by index
		 *  @param {Number} index The index of the event to remove
		 *  @returns {Tone.Sequence} this
		 */Tone.Sequence.prototype.remove=function(index,value){Tone.Part.prototype.remove.call(this,this._indexTime(index),value);return this;};/**
		 *  Get the time of the index given the Sequence's subdivision
		 *  @param  {Number}  index
		 *  @return  {Time}  The time of that index
		 *  @private
		 */Tone.Sequence.prototype._indexTime=function(index){if(index instanceof Tone.TransportTime){return index;}else{return Tone.Ticks(index*this._subdivision+this.startOffset).toSeconds();}};/**
		 *  Clean up.
		 *  @return {Tone.Sequence} this
		 */Tone.Sequence.prototype.dispose=function(){Tone.Part.prototype.dispose.call(this);return this;};return Tone.Sequence;});Module(function(Tone){/**
		 *  @class Tone.PulseOscillator is a pulse oscillator with control over pulse width,
		 *         also known as the duty cycle. At 50% duty cycle (width = 0.5) the wave is
		 *         a square and only odd-numbered harmonics are present. At all other widths
		 *         even-numbered harmonics are present. Read more
		 *         [here](https://wigglewave.wordpress.com/2014/08/16/pulse-waveforms-and-harmonics/).
		 *
		 *  @constructor
		 *  @extends {Tone.Source}
		 *  @param {Frequency} [frequency] The frequency of the oscillator
		 *  @param {NormalRange} [width] The width of the pulse
		 *  @example
		 * var pulse = new Tone.PulseOscillator("E5", 0.4).toMaster().start();
		 */Tone.PulseOscillator=function(){var options=Tone.defaults(arguments,['frequency','width'],Tone.Oscillator);Tone.Source.call(this,options);/**
			 *  The width of the pulse.
			 *  @type {NormalRange}
			 *  @signal
			 */this.width=new Tone.Signal(options.width,Tone.Type.NormalRange);/**
			 *  gate the width amount
			 *  @type {Tone.Gain}
			 *  @private
			 */this._widthGate=new Tone.Gain();/**
			 *  the sawtooth oscillator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */this._sawtooth=new Tone.Oscillator({frequency:options.frequency,detune:options.detune,type:'sawtooth',phase:options.phase});/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=this._sawtooth.frequency;/**
			 *  The detune in cents.
			 *  @type {Cents}
			 *  @signal
			 */this.detune=this._sawtooth.detune;/**
			 *  Threshold the signal to turn it into a square
			 *  @type {Tone.WaveShaper}
			 *  @private
			 */this._thresh=new Tone.WaveShaper(function(val){if(val<0){return-1;}else{return 1;}});//connections
this._sawtooth.chain(this._thresh,this.output);this.width.chain(this._widthGate,this._thresh);this._readOnly(['width','frequency','detune']);};Tone.extend(Tone.PulseOscillator,Tone.Source);/**
		 *  The default parameters.
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.PulseOscillator.defaults={'frequency':440,'detune':0,'phase':0,'width':0.2};/**
		 *  start the oscillator
		 *  @param  {Time} time
		 *  @private
		 */Tone.PulseOscillator.prototype._start=function(time){time=this.toSeconds(time);this._sawtooth.start(time);this._widthGate.gain.setValueAtTime(1,time);};/**
		 *  stop the oscillator
		 *  @param  {Time} time
		 *  @private
		 */Tone.PulseOscillator.prototype._stop=function(time){time=this.toSeconds(time);this._sawtooth.stop(time);//the width is still connected to the output.
//that needs to be stopped also
this._widthGate.gain.setValueAtTime(0,time);};/**
		 *  restart the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */Tone.PulseOscillator.prototype.restart=function(time){this._sawtooth.restart(time);};/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.PulseOscillator#
		 * @type {Degrees}
		 * @name phase
		 */Object.defineProperty(Tone.PulseOscillator.prototype,'phase',{get:function get(){return this._sawtooth.phase;},set:function set(phase){this._sawtooth.phase=phase;}});/**
		 * The type of the oscillator. Always returns "pulse".
		 * @readOnly
		 * @memberOf Tone.PulseOscillator#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.PulseOscillator.prototype,'type',{get:function get(){return'pulse';}});/**
		 * The partials of the waveform. Cannot set partials for this waveform type
		 * @memberOf Tone.PulseOscillator#
		 * @type {Array}
		 * @name partials
		 * @private
		 */Object.defineProperty(Tone.PulseOscillator.prototype,'partials',{get:function get(){return[];}});/**
		 *  Clean up method.
		 *  @return {Tone.PulseOscillator} this
		 */Tone.PulseOscillator.prototype.dispose=function(){Tone.Source.prototype.dispose.call(this);this._sawtooth.dispose();this._sawtooth=null;this._writable(['width','frequency','detune']);this.width.dispose();this.width=null;this._widthGate.dispose();this._widthGate=null;this._thresh.dispose();this._thresh=null;this.frequency=null;this.detune=null;return this;};return Tone.PulseOscillator;});Module(function(Tone){/**
		 *  @class Tone.PWMOscillator modulates the width of a Tone.PulseOscillator
		 *         at the modulationFrequency. This has the effect of continuously
		 *         changing the timbre of the oscillator by altering the harmonics
		 *         generated.
		 *
		 *  @extends {Tone.Source}
		 *  @constructor
		 *  @param {Frequency} frequency The starting frequency of the oscillator.
		 *  @param {Frequency} modulationFrequency The modulation frequency of the width of the pulse.
		 *  @example
		 *  var pwm = new Tone.PWMOscillator("Ab3", 0.3).toMaster().start();
		 */Tone.PWMOscillator=function(){var options=Tone.defaults(arguments,['frequency','modulationFrequency'],Tone.PWMOscillator);Tone.Source.call(this,options);/**
			 *  the pulse oscillator
			 *  @type {Tone.PulseOscillator}
			 *  @private
			 */this._pulse=new Tone.PulseOscillator(options.modulationFrequency);//change the pulse oscillator type
this._pulse._sawtooth.type='sine';/**
			 *  the modulator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */this._modulator=new Tone.Oscillator({'frequency':options.frequency,'detune':options.detune,'phase':options.phase});/**
			 *  Scale the oscillator so it doesn't go silent
			 *  at the extreme values.
			 *  @type {Tone.Multiply}
			 *  @private
			 */this._scale=new Tone.Multiply(2);/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=this._modulator.frequency;/**
			 *  The detune of the oscillator.
			 *  @type {Cents}
			 *  @signal
			 */this.detune=this._modulator.detune;/**
			 *  The modulation rate of the oscillator.
			 *  @type {Frequency}
			 *  @signal
			 */this.modulationFrequency=this._pulse.frequency;//connections
this._modulator.chain(this._scale,this._pulse.width);this._pulse.connect(this.output);this._readOnly(['modulationFrequency','frequency','detune']);};Tone.extend(Tone.PWMOscillator,Tone.Source);/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */Tone.PWMOscillator.defaults={'frequency':440,'detune':0,'phase':0,'modulationFrequency':0.4};/**
		 *  start the oscillator
		 *  @param  {Time} [time=now]
		 *  @private
		 */Tone.PWMOscillator.prototype._start=function(time){time=this.toSeconds(time);this._modulator.start(time);this._pulse.start(time);};/**
		 *  stop the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */Tone.PWMOscillator.prototype._stop=function(time){time=this.toSeconds(time);this._modulator.stop(time);this._pulse.stop(time);};/**
		 *  restart the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */Tone.PWMOscillator.prototype.restart=function(time){this._modulator.restart(time);this._pulse.restart(time);};/**
		 * The type of the oscillator. Always returns "pwm".
		 * @readOnly
		 * @memberOf Tone.PWMOscillator#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.PWMOscillator.prototype,'type',{get:function get(){return'pwm';}});/**
		 * The partials of the waveform. Cannot set partials for this waveform type
		 * @memberOf Tone.PWMOscillator#
		 * @type {Array}
		 * @name partials
		 * @private
		 */Object.defineProperty(Tone.PWMOscillator.prototype,'partials',{get:function get(){return[];}});/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.PWMOscillator#
		 * @type {number}
		 * @name phase
		 */Object.defineProperty(Tone.PWMOscillator.prototype,'phase',{get:function get(){return this._modulator.phase;},set:function set(phase){this._modulator.phase=phase;}});/**
		 *  Clean up.
		 *  @return {Tone.PWMOscillator} this
		 */Tone.PWMOscillator.prototype.dispose=function(){Tone.Source.prototype.dispose.call(this);this._pulse.dispose();this._pulse=null;this._scale.dispose();this._scale=null;this._modulator.dispose();this._modulator=null;this._writable(['modulationFrequency','frequency','detune']);this.frequency=null;this.detune=null;this.modulationFrequency=null;return this;};return Tone.PWMOscillator;});Module(function(Tone){/**
		 *  @class Tone.FMOscillator
		 *
		 *  @extends {Tone.Source}
		 *  @constructor
		 *  @param {Frequency} frequency The starting frequency of the oscillator.
		 *  @param {String} type The type of the carrier oscillator.
		 *  @param {String} modulationType The type of the modulator oscillator.
		 *  @example
		 * //a sine oscillator frequency-modulated by a square wave
		 * var fmOsc = new Tone.FMOscillator("Ab3", "sine", "square").toMaster().start();
		 */Tone.FMOscillator=function(){var options=Tone.defaults(arguments,['frequency','type','modulationType'],Tone.FMOscillator);Tone.Source.call(this,options);/**
			 *  The carrier oscillator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */this._carrier=new Tone.Oscillator(options.frequency,options.type);/**
			 *  The oscillator's frequency
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=new Tone.Signal(options.frequency,Tone.Type.Frequency);/**
			 *  The detune control signal.
			 *  @type {Cents}
			 *  @signal
			 */this.detune=this._carrier.detune;this.detune.value=options.detune;/**
			 *  The modulation index which is in essence the depth or amount of the modulation. In other terms it is the
			 *  ratio of the frequency of the modulating signal (mf) to the amplitude of the
			 *  modulating signal (ma) -- as in ma/mf.
			 *	@type {Positive}
			 *	@signal
			 */this.modulationIndex=new Tone.Multiply(options.modulationIndex);this.modulationIndex.units=Tone.Type.Positive;/**
			 *  The modulating oscillator
			 *  @type  {Tone.Oscillator}
			 *  @private
			 */this._modulator=new Tone.Oscillator(options.frequency,options.modulationType);/**
			 *  Harmonicity is the frequency ratio between the carrier and the modulator oscillators.
			 *  A harmonicity of 1 gives both oscillators the same frequency.
			 *  Harmonicity = 2 means a change of an octave.
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //pitch the modulator an octave below carrier
			 * synth.harmonicity.value = 0.5;
			 */this.harmonicity=new Tone.Multiply(options.harmonicity);this.harmonicity.units=Tone.Type.Positive;/**
			 *  the node where the modulation happens
			 *  @type {Tone.Gain}
			 *  @private
			 */this._modulationNode=new Tone.Gain(0);//connections
this.frequency.connect(this._carrier.frequency);this.frequency.chain(this.harmonicity,this._modulator.frequency);this.frequency.chain(this.modulationIndex,this._modulationNode);this._modulator.connect(this._modulationNode.gain);this._modulationNode.connect(this._carrier.frequency);this._carrier.connect(this.output);this.detune.connect(this._modulator.detune);this.phase=options.phase;this._readOnly(['modulationIndex','frequency','detune','harmonicity']);};Tone.extend(Tone.FMOscillator,Tone.Source);/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */Tone.FMOscillator.defaults={'frequency':440,'detune':0,'phase':0,'modulationIndex':2,'modulationType':'square','harmonicity':1};/**
		 *  start the oscillator
		 *  @param  {Time} [time=now]
		 *  @private
		 */Tone.FMOscillator.prototype._start=function(time){this._modulator.start(time);this._carrier.start(time);};/**
		 *  stop the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */Tone.FMOscillator.prototype._stop=function(time){this._modulator.stop(time);this._carrier.stop(time);};/**
		 *  stop the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */Tone.FMOscillator.prototype.restart=function(time){this._modulator.restart(time);this._carrier.restart(time);};/**
		 * The type of the carrier oscillator
		 * @memberOf Tone.FMOscillator#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.FMOscillator.prototype,'type',{get:function get(){return this._carrier.type;},set:function set(type){this._carrier.type=type;}});/**
		 * The type of the modulator oscillator
		 * @memberOf Tone.FMOscillator#
		 * @type {String}
		 * @name modulationType
		 */Object.defineProperty(Tone.FMOscillator.prototype,'modulationType',{get:function get(){return this._modulator.type;},set:function set(type){this._modulator.type=type;}});/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.FMOscillator#
		 * @type {number}
		 * @name phase
		 */Object.defineProperty(Tone.FMOscillator.prototype,'phase',{get:function get(){return this._carrier.phase;},set:function set(phase){this._carrier.phase=phase;this._modulator.phase=phase;}});/**
		 * The partials of the carrier waveform. A partial represents
		 * the amplitude at a harmonic. The first harmonic is the
		 * fundamental frequency, the second is the octave and so on
		 * following the harmonic series.
		 * Setting this value will automatically set the type to "custom".
		 * The value is an empty array when the type is not "custom".
		 * @memberOf Tone.FMOscillator#
		 * @type {Array}
		 * @name partials
		 * @example
		 * osc.partials = [1, 0.2, 0.01];
		 */Object.defineProperty(Tone.FMOscillator.prototype,'partials',{get:function get(){return this._carrier.partials;},set:function set(partials){this._carrier.partials=partials;}});/**
		 *  Clean up.
		 *  @return {Tone.FMOscillator} this
		 */Tone.FMOscillator.prototype.dispose=function(){Tone.Source.prototype.dispose.call(this);this._writable(['modulationIndex','frequency','detune','harmonicity']);this.frequency.dispose();this.frequency=null;this.detune=null;this.harmonicity.dispose();this.harmonicity=null;this._carrier.dispose();this._carrier=null;this._modulator.dispose();this._modulator=null;this._modulationNode.dispose();this._modulationNode=null;this.modulationIndex.dispose();this.modulationIndex=null;return this;};return Tone.FMOscillator;});Module(function(Tone){/**
		 *  @class Tone.AMOscillator
		 *
		 *  @extends {Tone.Oscillator}
		 *  @constructor
		 *  @param {Frequency} frequency The starting frequency of the oscillator.
		 *  @param {String} type The type of the carrier oscillator.
		 *  @param {String} modulationType The type of the modulator oscillator.
		 *  @example
		 * //a sine oscillator frequency-modulated by a square wave
		 * var fmOsc = new Tone.AMOscillator("Ab3", "sine", "square").toMaster().start();
		 */Tone.AMOscillator=function(){var options=Tone.defaults(arguments,['frequency','type','modulationType'],Tone.AMOscillator);Tone.Source.call(this,options);/**
			 *  The carrier oscillator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */this._carrier=new Tone.Oscillator(options.frequency,options.type);/**
			 *  The oscillator's frequency
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=this._carrier.frequency;/**
			 *  The detune control signal.
			 *  @type {Cents}
			 *  @signal
			 */this.detune=this._carrier.detune;this.detune.value=options.detune;/**
			 *  The modulating oscillator
			 *  @type  {Tone.Oscillator}
			 *  @private
			 */this._modulator=new Tone.Oscillator(options.frequency,options.modulationType);/**
			 *  convert the -1,1 output to 0,1
			 *  @type {Tone.AudioToGain}
			 *  @private
			 */this._modulationScale=new Tone.AudioToGain();/**
			 *  Harmonicity is the frequency ratio between the carrier and the modulator oscillators.
			 *  A harmonicity of 1 gives both oscillators the same frequency.
			 *  Harmonicity = 2 means a change of an octave.
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //pitch the modulator an octave below carrier
			 * synth.harmonicity.value = 0.5;
			 */this.harmonicity=new Tone.Multiply(options.harmonicity);this.harmonicity.units=Tone.Type.Positive;/**
			 *  the node where the modulation happens
			 *  @type {Tone.Gain}
			 *  @private
			 */this._modulationNode=new Tone.Gain(0);//connections
this.frequency.chain(this.harmonicity,this._modulator.frequency);this.detune.connect(this._modulator.detune);this._modulator.chain(this._modulationScale,this._modulationNode.gain);this._carrier.chain(this._modulationNode,this.output);this.phase=options.phase;this._readOnly(['frequency','detune','harmonicity']);};Tone.extend(Tone.AMOscillator,Tone.Oscillator);/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */Tone.AMOscillator.defaults={'frequency':440,'detune':0,'phase':0,'modulationType':'square','harmonicity':1};/**
		 *  start the oscillator
		 *  @param  {Time} [time=now]
		 *  @private
		 */Tone.AMOscillator.prototype._start=function(time){this._modulator.start(time);this._carrier.start(time);};/**
		 *  stop the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */Tone.AMOscillator.prototype._stop=function(time){this._modulator.stop(time);this._carrier.stop(time);};/**
		 *  restart the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */Tone.AMOscillator.prototype.restart=function(time){this._modulator.restart(time);this._carrier.restart(time);};/**
		 * The type of the carrier oscillator
		 * @memberOf Tone.AMOscillator#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.AMOscillator.prototype,'type',{get:function get(){return this._carrier.type;},set:function set(type){this._carrier.type=type;}});/**
		 * The type of the modulator oscillator
		 * @memberOf Tone.AMOscillator#
		 * @type {string}
		 * @name modulationType
		 */Object.defineProperty(Tone.AMOscillator.prototype,'modulationType',{get:function get(){return this._modulator.type;},set:function set(type){this._modulator.type=type;}});/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.AMOscillator#
		 * @type {number}
		 * @name phase
		 */Object.defineProperty(Tone.AMOscillator.prototype,'phase',{get:function get(){return this._carrier.phase;},set:function set(phase){this._carrier.phase=phase;this._modulator.phase=phase;}});/**
		 * The partials of the carrier waveform. A partial represents
		 * the amplitude at a harmonic. The first harmonic is the
		 * fundamental frequency, the second is the octave and so on
		 * following the harmonic series.
		 * Setting this value will automatically set the type to "custom".
		 * The value is an empty array when the type is not "custom".
		 * @memberOf Tone.AMOscillator#
		 * @type {Array}
		 * @name partials
		 * @example
		 * osc.partials = [1, 0.2, 0.01];
		 */Object.defineProperty(Tone.AMOscillator.prototype,'partials',{get:function get(){return this._carrier.partials;},set:function set(partials){this._carrier.partials=partials;}});/**
		 *  Clean up.
		 *  @return {Tone.AMOscillator} this
		 */Tone.AMOscillator.prototype.dispose=function(){Tone.Source.prototype.dispose.call(this);this._writable(['frequency','detune','harmonicity']);this.frequency=null;this.detune=null;this.harmonicity.dispose();this.harmonicity=null;this._carrier.dispose();this._carrier=null;this._modulator.dispose();this._modulator=null;this._modulationNode.dispose();this._modulationNode=null;this._modulationScale.dispose();this._modulationScale=null;return this;};return Tone.AMOscillator;});Module(function(Tone){/**
		 *  @class Tone.FatOscillator
		 *
		 *  @extends {Tone.Source}
		 *  @constructor
		 *  @param {Frequency} frequency The starting frequency of the oscillator.
		 *  @param {String} type The type of the carrier oscillator.
		 *  @param {String} modulationType The type of the modulator oscillator.
		 *  @example
		 * //a sine oscillator frequency-modulated by a square wave
		 * var fmOsc = new Tone.FatOscillator("Ab3", "sine", "square").toMaster().start();
		 */Tone.FatOscillator=function(){var options=Tone.defaults(arguments,['frequency','type','spread'],Tone.FatOscillator);Tone.Source.call(this,options);/**
			 *  The oscillator's frequency
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=new Tone.Signal(options.frequency,Tone.Type.Frequency);/**
			 *  The detune control signal.
			 *  @type {Cents}
			 *  @signal
			 */this.detune=new Tone.Signal(options.detune,Tone.Type.Cents);/**
			 *  The array of oscillators
			 *  @type {Array}
			 *  @private
			 */this._oscillators=[];/**
			 *  The total spread of the oscillators
			 *  @type  {Cents}
			 *  @private
			 */this._spread=options.spread;/**
			 *  The type of the oscillator
			 *  @type {String}
			 *  @private
			 */this._type=options.type;/**
			 *  The phase of the oscillators
			 *  @type {Degrees}
			 *  @private
			 */this._phase=options.phase;/**
			 *  The partials array
			 *  @type {Array}
			 *  @private
			 */this._partials=Tone.defaultArg(options.partials,[]);//set the count initially
this.count=options.count;this._readOnly(['frequency','detune']);};Tone.extend(Tone.FatOscillator,Tone.Source);/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */Tone.FatOscillator.defaults={'frequency':440,'detune':0,'phase':0,'spread':20,'count':3,'type':'sawtooth'};/**
		 *  start the oscillator
		 *  @param  {Time} [time=now]
		 *  @private
		 */Tone.FatOscillator.prototype._start=function(time){time=this.toSeconds(time);this._forEach(function(osc){osc.start(time);});};/**
		 *  stop the oscillator
		 *  @param  {Time} [time=now]
		 *  @private
		 */Tone.FatOscillator.prototype._stop=function(time){time=this.toSeconds(time);this._forEach(function(osc){osc.stop(time);});};/**
		 *  restart the oscillator
		 *  @param  {Time} time (optional) timing parameter
		 *  @private
		 */Tone.FatOscillator.prototype.restart=function(time){time=this.toSeconds(time);this._forEach(function(osc){osc.restart(time);});};/**
		 *  Iterate over all of the oscillators
		 *  @param  {Function}  iterator  The iterator function
		 *  @private
		 */Tone.FatOscillator.prototype._forEach=function(iterator){for(var i=0;i<this._oscillators.length;i++){iterator.call(this,this._oscillators[i],i);}};/**
		 * The type of the carrier oscillator
		 * @memberOf Tone.FatOscillator#
		 * @type {string}
		 * @name type
		 */Object.defineProperty(Tone.FatOscillator.prototype,'type',{get:function get(){return this._type;},set:function set(type){this._type=type;this._forEach(function(osc){osc.type=type;});}});/**
		 * The detune spread between the oscillators. If "count" is
		 * set to 3 oscillators and the "spread" is set to 40,
		 * the three oscillators would be detuned like this: [-20, 0, 20]
		 * for a total detune spread of 40 cents.
		 * @memberOf Tone.FatOscillator#
		 * @type {Cents}
		 * @name spread
		 */Object.defineProperty(Tone.FatOscillator.prototype,'spread',{get:function get(){return this._spread;},set:function set(spread){this._spread=spread;if(this._oscillators.length>1){var start=-spread/2;var step=spread/(this._oscillators.length-1);this._forEach(function(osc,i){osc.detune.value=start+step*i;});}}});/**
		 * The number of detuned oscillators
		 * @memberOf Tone.FatOscillator#
		 * @type {Number}
		 * @name count
		 */Object.defineProperty(Tone.FatOscillator.prototype,'count',{get:function get(){return this._oscillators.length;},set:function set(count){count=Math.max(count,1);if(this._oscillators.length!==count){// var partials = this.partials;
// var type = this.type;
//dispose the previous oscillators
this._forEach(function(osc){osc.dispose();});this._oscillators=[];for(var i=0;i<count;i++){var osc=new Tone.Oscillator();if(this.type===Tone.Oscillator.Type.Custom){osc.partials=this._partials;}else{osc.type=this._type;}osc.phase=this._phase;osc.volume.value=-6-count*1.1;this.frequency.connect(osc.frequency);this.detune.connect(osc.detune);osc.connect(this.output);this._oscillators[i]=osc;}//set the spread
this.spread=this._spread;if(this.state===Tone.State.Started){this._forEach(function(osc){osc.start();});}}}});/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.FatOscillator#
		 * @type {Number}
		 * @name phase
		 */Object.defineProperty(Tone.FatOscillator.prototype,'phase',{get:function get(){return this._phase;},set:function set(phase){this._phase=phase;this._forEach(function(osc){osc.phase=phase;});}});/**
		 * The partials of the carrier waveform. A partial represents
		 * the amplitude at a harmonic. The first harmonic is the
		 * fundamental frequency, the second is the octave and so on
		 * following the harmonic series.
		 * Setting this value will automatically set the type to "custom".
		 * The value is an empty array when the type is not "custom".
		 * @memberOf Tone.FatOscillator#
		 * @type {Array}
		 * @name partials
		 * @example
		 * osc.partials = [1, 0.2, 0.01];
		 */Object.defineProperty(Tone.FatOscillator.prototype,'partials',{get:function get(){return this._partials;},set:function set(partials){this._partials=partials;this._type=Tone.Oscillator.Type.Custom;this._forEach(function(osc){osc.partials=partials;});}});/**
		 *  Clean up.
		 *  @return {Tone.FatOscillator} this
		 */Tone.FatOscillator.prototype.dispose=function(){Tone.Source.prototype.dispose.call(this);this._writable(['frequency','detune']);this.frequency.dispose();this.frequency=null;this.detune.dispose();this.detune=null;this._forEach(function(osc){osc.dispose();});this._oscillators=null;this._partials=null;return this;};return Tone.FatOscillator;});Module(function(Tone){/**
		 *  @class Tone.OmniOscillator aggregates Tone.Oscillator, Tone.PulseOscillator,
		 *         Tone.PWMOscillator, Tone.FMOscillator, Tone.AMOscillator, and Tone.FatOscillator
		 *         into one class. The oscillator class can be changed by setting the `type`.
		 *         `omniOsc.type = "pwm"` will set it to the Tone.PWMOscillator. Prefixing
		 *         any of the basic types ("sine", "square4", etc.) with "fm", "am", or "fat"
		 *         will use the FMOscillator, AMOscillator or FatOscillator respectively.
		 *         For example: `omniOsc.type = "fatsawtooth"` will create set the oscillator
		 *         to a FatOscillator of type "sawtooth".
		 *
		 *  @extends {Tone.Source}
		 *  @constructor
		 *  @param {Frequency} frequency The initial frequency of the oscillator.
		 *  @param {String} type The type of the oscillator.
		 *  @example
		 *  var omniOsc = new Tone.OmniOscillator("C#4", "pwm");
		 */Tone.OmniOscillator=function(){var options=Tone.defaults(arguments,['frequency','type'],Tone.OmniOscillator);Tone.Source.call(this,options);/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=new Tone.Signal(options.frequency,Tone.Type.Frequency);/**
			 *  The detune control
			 *  @type {Cents}
			 *  @signal
			 */this.detune=new Tone.Signal(options.detune,Tone.Type.Cents);/**
			 *  the type of the oscillator source
			 *  @type {String}
			 *  @private
			 */this._sourceType=undefined;/**
			 *  the oscillator
			 *  @type {Tone.Oscillator}
			 *  @private
			 */this._oscillator=null;//set the oscillator
this.type=options.type;this._readOnly(['frequency','detune']);//set the options
this.set(options);};Tone.extend(Tone.OmniOscillator,Tone.Source);/**
		 *  default values
		 *  @static
		 *  @type {Object}
		 *  @const
		 */Tone.OmniOscillator.defaults={'frequency':440,'detune':0,'type':'sine','phase':0};/**
		 *  @enum {String}
		 *  @private
		 */var OmniOscType={Pulse:'PulseOscillator',PWM:'PWMOscillator',Osc:'Oscillator',FM:'FMOscillator',AM:'AMOscillator',Fat:'FatOscillator'};/**
		 *  start the oscillator
		 *  @param {Time} [time=now] the time to start the oscillator
		 *  @private
		 */Tone.OmniOscillator.prototype._start=function(time){this._oscillator.start(time);};/**
		 *  start the oscillator
		 *  @param {Time} [time=now] the time to start the oscillator
		 *  @private
		 */Tone.OmniOscillator.prototype._stop=function(time){this._oscillator.stop(time);};Tone.OmniOscillator.prototype.restart=function(time){this._oscillator.restart(time);};/**
		 * The type of the oscillator. Can be any of the basic types: sine, square, triangle, sawtooth. Or
		 * prefix the basic types with "fm", "am", or "fat" to use the FMOscillator, AMOscillator or FatOscillator
		 * types. The oscillator could also be set to "pwm" or "pulse". All of the parameters of the
		 * oscillator's class are accessible when the oscillator is set to that type, but throws an error
		 * when it's not.
		 *
		 * @memberOf Tone.OmniOscillator#
		 * @type {String}
		 * @name type
		 * @example
		 * omniOsc.type = "pwm";
		 * //modulationFrequency is parameter which is available
		 * //only when the type is "pwm".
		 * omniOsc.modulationFrequency.value = 0.5;
		 * @example
		 * //an square wave frequency modulated by a sawtooth
		 * omniOsc.type = "fmsquare";
		 * omniOsc.modulationType = "sawtooth";
		 */Object.defineProperty(Tone.OmniOscillator.prototype,'type',{get:function get(){var prefix='';if(this._sourceType===OmniOscType.FM){prefix='fm';}else if(this._sourceType===OmniOscType.AM){prefix='am';}else if(this._sourceType===OmniOscType.Fat){prefix='fat';}return prefix+this._oscillator.type;},set:function set(type){if(type.substr(0,2)==='fm'){this._createNewOscillator(OmniOscType.FM);this._oscillator.type=type.substr(2);}else if(type.substr(0,2)==='am'){this._createNewOscillator(OmniOscType.AM);this._oscillator.type=type.substr(2);}else if(type.substr(0,3)==='fat'){this._createNewOscillator(OmniOscType.Fat);this._oscillator.type=type.substr(3);}else if(type==='pwm'){this._createNewOscillator(OmniOscType.PWM);}else if(type==='pulse'){this._createNewOscillator(OmniOscType.Pulse);}else{this._createNewOscillator(OmniOscType.Osc);this._oscillator.type=type;}}});/**
		 * The partials of the waveform. A partial represents
		 * the amplitude at a harmonic. The first harmonic is the
		 * fundamental frequency, the second is the octave and so on
		 * following the harmonic series.
		 * Setting this value will automatically set the type to "custom".
		 * The value is an empty array when the type is not "custom".
		 * This is not available on "pwm" and "pulse" oscillator types.
		 * @memberOf Tone.OmniOscillator#
		 * @type {Array}
		 * @name partials
		 * @example
		 * osc.partials = [1, 0.2, 0.01];
		 */Object.defineProperty(Tone.OmniOscillator.prototype,'partials',{get:function get(){return this._oscillator.partials;},set:function set(partials){this._oscillator.partials=partials;}});/**
		 *  Set a member/attribute of the oscillator.
		 *  @param {Object|String} params
		 *  @param {number=} value
		 *  @param {Time=} rampTime
		 *  @returns {Tone.OmniOscillator} this
		 */Tone.OmniOscillator.prototype.set=function(params,value){//make sure the type is set first
if(params==='type'){this.type=value;}else if(Tone.isObject(params)&&params.hasOwnProperty('type')){this.type=params.type;}//then set the rest
Tone.prototype.set.apply(this,arguments);return this;};/**
		 *  connect the oscillator to the frequency and detune signals
		 *  @private
		 */Tone.OmniOscillator.prototype._createNewOscillator=function(oscType){if(oscType!==this._sourceType){this._sourceType=oscType;var OscillatorConstructor=Tone[oscType];//short delay to avoid clicks on the change
var now=this.now();if(this._oscillator!==null){var oldOsc=this._oscillator;oldOsc.stop(now);//dispose the old one
this.context.setTimeout(function(){oldOsc.dispose();oldOsc=null;},this.blockTime);}this._oscillator=new OscillatorConstructor();this.frequency.connect(this._oscillator.frequency);this.detune.connect(this._oscillator.detune);this._oscillator.connect(this.output);if(this.state===Tone.State.Started){this._oscillator.start(now);}}};/**
		 * The phase of the oscillator in degrees.
		 * @memberOf Tone.OmniOscillator#
		 * @type {Degrees}
		 * @name phase
		 */Object.defineProperty(Tone.OmniOscillator.prototype,'phase',{get:function get(){return this._oscillator.phase;},set:function set(phase){this._oscillator.phase=phase;}});/**
		 * The width of the oscillator (only if the oscillator is set to "pulse")
		 * @memberOf Tone.OmniOscillator#
		 * @type {NormalRange}
		 * @signal
		 * @name width
		 * @example
		 * var omniOsc = new Tone.OmniOscillator(440, "pulse");
		 * //can access the width attribute only if type === "pulse"
		 * omniOsc.width.value = 0.2;
		 */Object.defineProperty(Tone.OmniOscillator.prototype,'width',{get:function get(){if(this._sourceType===OmniOscType.Pulse){return this._oscillator.width;}}});/**
		 * The number of detuned oscillators
		 * @memberOf Tone.OmniOscillator#
		 * @type {Number}
		 * @name count
		 */Object.defineProperty(Tone.OmniOscillator.prototype,'count',{get:function get(){if(this._sourceType===OmniOscType.Fat){return this._oscillator.count;}},set:function set(count){if(this._sourceType===OmniOscType.Fat){this._oscillator.count=count;}}});/**
		 * The detune spread between the oscillators. If "count" is
		 * set to 3 oscillators and the "spread" is set to 40,
		 * the three oscillators would be detuned like this: [-20, 0, 20]
		 * for a total detune spread of 40 cents. See Tone.FatOscillator
		 * for more info.
		 * @memberOf Tone.OmniOscillator#
		 * @type {Cents}
		 * @name spread
		 */Object.defineProperty(Tone.OmniOscillator.prototype,'spread',{get:function get(){if(this._sourceType===OmniOscType.Fat){return this._oscillator.spread;}},set:function set(spread){if(this._sourceType===OmniOscType.Fat){this._oscillator.spread=spread;}}});/**
		 * The type of the modulator oscillator. Only if the oscillator
		 * is set to "am" or "fm" types. see. Tone.AMOscillator or Tone.FMOscillator
		 * for more info.
		 * @memberOf Tone.OmniOscillator#
		 * @type {String}
		 * @name modulationType
		 */Object.defineProperty(Tone.OmniOscillator.prototype,'modulationType',{get:function get(){if(this._sourceType===OmniOscType.FM||this._sourceType===OmniOscType.AM){return this._oscillator.modulationType;}},set:function set(mType){if(this._sourceType===OmniOscType.FM||this._sourceType===OmniOscType.AM){this._oscillator.modulationType=mType;}}});/**
		 * The modulation index which is in essence the depth or amount of the modulation. In other terms it is the
		 * ratio of the frequency of the modulating signal (mf) to the amplitude of the
		 * modulating signal (ma) -- as in ma/mf.
		 * See Tone.FMOscillator for more info.
		 * @type {Positive}
		 * @signal
		 * @name modulationIndex
		 */Object.defineProperty(Tone.OmniOscillator.prototype,'modulationIndex',{get:function get(){if(this._sourceType===OmniOscType.FM){return this._oscillator.modulationIndex;}}});/**
		 *  Harmonicity is the frequency ratio between the carrier and the modulator oscillators.
		 *  A harmonicity of 1 gives both oscillators the same frequency.
		 *  Harmonicity = 2 means a change of an octave. See Tone.AMOscillator or Tone.FMOscillator
		 *  for more info.
		 *  @memberOf Tone.OmniOscillator#
		 *  @signal
		 *  @type {Positive}
		 *  @name harmonicity
		 */Object.defineProperty(Tone.OmniOscillator.prototype,'harmonicity',{get:function get(){if(this._sourceType===OmniOscType.FM||this._sourceType===OmniOscType.AM){return this._oscillator.harmonicity;}}});/**
		 * The modulationFrequency Signal of the oscillator
		 * (only if the oscillator type is set to pwm). See
		 * Tone.PWMOscillator for more info.
		 * @memberOf Tone.OmniOscillator#
		 * @type {Frequency}
		 * @signal
		 * @name modulationFrequency
		 * @example
		 * var omniOsc = new Tone.OmniOscillator(440, "pwm");
		 * //can access the modulationFrequency attribute only if type === "pwm"
		 * omniOsc.modulationFrequency.value = 0.2;
		 */Object.defineProperty(Tone.OmniOscillator.prototype,'modulationFrequency',{get:function get(){if(this._sourceType===OmniOscType.PWM){return this._oscillator.modulationFrequency;}}});/**
		 *  Clean up.
		 *  @return {Tone.OmniOscillator} this
		 */Tone.OmniOscillator.prototype.dispose=function(){Tone.Source.prototype.dispose.call(this);this._writable(['frequency','detune']);this.detune.dispose();this.detune=null;this.frequency.dispose();this.frequency=null;this._oscillator.dispose();this._oscillator=null;this._sourceType=null;return this;};return Tone.OmniOscillator;});Module(function(Tone){/**
		 *  @class  Base-class for all instruments
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 */Tone.Instrument=function(options){//get the defaults
options=Tone.defaultArg(options,Tone.Instrument.defaults);Tone.AudioNode.call(this);/**
			 *  The output and volume triming node
			 *  @type  {Tone.Volume}
			 *  @private
			 */this._volume=this.output=new Tone.Volume(options.volume);/**
			 * The volume of the output in decibels.
			 * @type {Decibels}
			 * @signal
			 * @example
			 * source.volume.value = -6;
			 */this.volume=this._volume.volume;this._readOnly('volume');/**
			 * Keep track of all events scheduled to the transport
			 * when the instrument is 'synced'
			 * @type {Array<Number>}
			 * @private
			 */this._scheduledEvents=[];};Tone.extend(Tone.Instrument,Tone.AudioNode);/**
		 *  the default attributes
		 *  @type {object}
		 */Tone.Instrument.defaults={/** the volume of the output in decibels */'volume':0};/**
		 *  @abstract
		 *  @param {string|number} note the note to trigger
		 *  @param {Time} [time=now] the time to trigger the ntoe
		 *  @param {number} [velocity=1] the velocity to trigger the note
		 */Tone.Instrument.prototype.triggerAttack=Tone.noOp;/**
		 *  @abstract
		 *  @param {Time} [time=now] when to trigger the release
		 */Tone.Instrument.prototype.triggerRelease=Tone.noOp;/**
		 * Sync the instrument to the Transport. All subsequent calls of
		 * [triggerAttack](#triggerattack) and [triggerRelease](#triggerrelease)
		 * will be scheduled along the transport.
		 * @example
		 * instrument.sync()
		 * //schedule 3 notes when the transport first starts
		 * instrument.triggerAttackRelease('C4', '8n', 0)
		 * instrument.triggerAttackRelease('E4', '8n', '8n')
		 * instrument.triggerAttackRelease('G4', '8n', '4n')
		 * //start the transport to hear the notes
		 * Transport.start()
		 * @returns {Tone.Instrument} this
		 */Tone.Instrument.prototype.sync=function(){this._syncMethod('triggerAttack',1);this._syncMethod('triggerRelease',0);return this;};/**
		 * Wrap the given method so that it can be synchronized
		 * @param {String} method Which method to wrap and sync
		 * @param  {Number} timePosition What position the time argument appears in
		 * @private
		 */Tone.Instrument.prototype._syncMethod=function(method,timePosition){var originalMethod=this['_original_'+method]=this[method];this[method]=function(){var args=Array.prototype.slice.call(arguments);var time=args[timePosition];var id=Tone.Transport.schedule(function(t){args[timePosition]=t;originalMethod.apply(this,args);}.bind(this),time);this._scheduledEvents.push(id);}.bind(this);};/**
		 * Unsync the instrument from the Transport
		 * @returns {Tone.Instrument} this
		 */Tone.Instrument.prototype.unsync=function(){this._scheduledEvents.forEach(function(id){Tone.Transport.clear(id);});this._scheduledEvents=[];if(this._original_triggerAttack){this.triggerAttack=this._original_triggerAttack;this.triggerRelease=this._original_triggerRelease;}return this;};/**
		 *  Trigger the attack and then the release after the duration.
		 *  @param  {Frequency} note     The note to trigger.
		 *  @param  {Time} duration How long the note should be held for before
		 *                          triggering the release. This value must be greater than 0.
		 *  @param {Time} [time=now]  When the note should be triggered.
		 *  @param  {NormalRange} [velocity=1] The velocity the note should be triggered at.
		 *  @returns {Tone.Instrument} this
		 *  @example
		 * //trigger "C4" for the duration of an 8th note
		 * synth.triggerAttackRelease("C4", "8n");
		 */Tone.Instrument.prototype.triggerAttackRelease=function(note,duration,time,velocity){time=this.toSeconds(time);duration=this.toSeconds(duration);this.triggerAttack(note,time,velocity);this.triggerRelease(time+duration);return this;};/**
		 *  clean up
		 *  @returns {Tone.Instrument} this
		 */Tone.Instrument.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._volume.dispose();this._volume=null;this._writable(['volume']);this.volume=null;this.unsync();this._scheduledEvents=null;return this;};return Tone.Instrument;});Module(function(Tone){/**
		 *  @class  This is an abstract base class for other monophonic instruments to 
		 *          extend. IMPORTANT: It does not make any sound on its own and
		 *          shouldn't be directly instantiated.
		 *
		 *  @constructor
		 *  @abstract
		 *  @extends {Tone.Instrument}
		 */Tone.Monophonic=function(options){//get the defaults
options=Tone.defaultArg(options,Tone.Monophonic.defaults);Tone.Instrument.call(this,options);/**
			 *  The glide time between notes. 
			 *  @type {Time}
			 */this.portamento=options.portamento;};Tone.extend(Tone.Monophonic,Tone.Instrument);/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.Monophonic.defaults={'portamento':0};/**
		 *  Trigger the attack of the note optionally with a given velocity. 
		 *  
		 *  
		 *  @param  {Frequency} note     The note to trigger.
		 *  @param  {Time} [time=now]     When the note should start.
		 *  @param  {number} [velocity=1] velocity The velocity scaler 
		 *                                determines how "loud" the note 
		 *                                will be triggered.
		 *  @returns {Tone.Monophonic} this
		 *  @example
		 * synth.triggerAttack("C4");
		 *  @example
		 * //trigger the note a half second from now at half velocity
		 * synth.triggerAttack("C4", "+0.5", 0.5);
		 */Tone.Monophonic.prototype.triggerAttack=function(note,time,velocity){time=this.toSeconds(time);this._triggerEnvelopeAttack(time,velocity);this.setNote(note,time);return this;};/**
		 *  Trigger the release portion of the envelope
		 *  @param  {Time} [time=now] If no time is given, the release happens immediatly
		 *  @returns {Tone.Monophonic} this
		 *  @example
		 * synth.triggerRelease();
		 */Tone.Monophonic.prototype.triggerRelease=function(time){time=this.toSeconds(time);this._triggerEnvelopeRelease(time);return this;};/**
		 *  override this method with the actual method
		 *  @abstract
		 *  @private
		 */Tone.Monophonic.prototype._triggerEnvelopeAttack=function(){};/**
		 *  override this method with the actual method
		 *  @abstract
		 *  @private
		 */Tone.Monophonic.prototype._triggerEnvelopeRelease=function(){};/**
		 *  Get the level of the output at the given time. Measures
		 *  the envelope(s) value at the time. 
		 *  @param {Time} time The time to query the envelope value
		 *  @return {NormalRange} The output level between 0-1
		 */Tone.Monophonic.prototype.getLevelAtTime=function(time){time=this.toSeconds(time);return this.envelope.getValueAtTime(time);};/**
		 *  Set the note at the given time. If no time is given, the note
		 *  will set immediately. 
		 *  @param {Frequency} note The note to change to.
		 *  @param  {Time} [time=now] The time when the note should be set. 
		 *  @returns {Tone.Monophonic} this
		 * @example
		 * //change to F#6 in one quarter note from now.
		 * synth.setNote("F#6", "+4n");
		 * @example
		 * //change to Bb4 right now
		 * synth.setNote("Bb4");
		 */Tone.Monophonic.prototype.setNote=function(note,time){time=this.toSeconds(time);if(this.portamento>0&&this.getLevelAtTime(time)>0.05){var portTime=this.toSeconds(this.portamento);this.frequency.exponentialRampTo(note,portTime,time);}else{this.frequency.setValueAtTime(note,time);}return this;};return Tone.Monophonic;});Module(function(Tone){/**
		 *  @class  Tone.Synth is composed simply of a Tone.OmniOscillator
		 *          routed through a Tone.AmplitudeEnvelope.
		 *          <img src="https://docs.google.com/drawings/d/1-1_0YW2Z1J2EPI36P8fNCMcZG7N1w1GZluPs4og4evo/pub?w=1163&h=231">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth
		 *                          see defaults below
		 *  @example
		 * var synth = new Tone.Synth().toMaster();
		 * synth.triggerAttackRelease("C4", "8n");
		 */Tone.Synth=function(options){//get the defaults
options=Tone.defaultArg(options,Tone.Synth.defaults);Tone.Monophonic.call(this,options);/**
			 *  The oscillator.
			 *  @type {Tone.OmniOscillator}
			 */this.oscillator=new Tone.OmniOscillator(options.oscillator);/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=this.oscillator.frequency;/**
			 *  The detune control.
			 *  @type {Cents}
			 *  @signal
			 */this.detune=this.oscillator.detune;/**
			 *  The amplitude envelope.
			 *  @type {Tone.AmplitudeEnvelope}
			 */this.envelope=new Tone.AmplitudeEnvelope(options.envelope);//connect the oscillators to the output
this.oscillator.chain(this.envelope,this.output);this._readOnly(['oscillator','frequency','detune','envelope']);};Tone.extend(Tone.Synth,Tone.Monophonic);/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */Tone.Synth.defaults={'oscillator':{'type':'triangle'},'envelope':{'attack':0.005,'decay':0.1,'sustain':0.3,'release':1}};/**
		 *  start the attack portion of the envelope
		 *  @param {Time} [time=now] the time the attack should start
		 *  @param {number} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.Synth} this
		 *  @private
		 */Tone.Synth.prototype._triggerEnvelopeAttack=function(time,velocity){//the envelopes
this.envelope.triggerAttack(time,velocity);this.oscillator.start(time);//if there is no release portion, stop the oscillator
if(this.envelope.sustain===0){this.oscillator.stop(time+this.envelope.attack+this.envelope.decay);}return this;};/**
		 *  start the release portion of the envelope
		 *  @param {Time} [time=now] the time the release should start
		 *  @returns {Tone.Synth} this
		 *  @private
		 */Tone.Synth.prototype._triggerEnvelopeRelease=function(time){time=this.toSeconds(time);this.envelope.triggerRelease(time);this.oscillator.stop(time+this.envelope.release);return this;};/**
		 *  clean up
		 *  @returns {Tone.Synth} this
		 */Tone.Synth.prototype.dispose=function(){Tone.Monophonic.prototype.dispose.call(this);this._writable(['oscillator','frequency','detune','envelope']);this.oscillator.dispose();this.oscillator=null;this.envelope.dispose();this.envelope=null;this.frequency=null;this.detune=null;return this;};return Tone.Synth;});Module(function(Tone){/**
		 *  @class  AMSynth uses the output of one Tone.Synth to modulate the
		 *          amplitude of another Tone.Synth. The harmonicity (the ratio between
		 *          the two signals) affects the timbre of the output signal greatly.
		 *          Read more about Amplitude Modulation Synthesis on
		 *          [SoundOnSound](https://web.archive.org/web/20160404103653/http://www.soundonsound.com:80/sos/mar00/articles/synthsecrets.htm).
		 *          <img src="https://docs.google.com/drawings/d/1TQu8Ed4iFr1YTLKpB3U1_hur-UwBrh5gdBXc8BxfGKw/pub?w=1009&h=457">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth
		 *                            see defaults below
		 *  @example
		 * var synth = new Tone.AMSynth().toMaster();
		 * synth.triggerAttackRelease("C4", "4n");
		 */Tone.AMSynth=function(options){options=Tone.defaultArg(options,Tone.AMSynth.defaults);Tone.Monophonic.call(this,options);/**
			 *  The carrier voice.
			 *  @type {Tone.Synth}
			 *  @private
			 */this._carrier=new Tone.Synth();this._carrier.volume.value=-10;/**
			 *  The carrier's oscillator
			 *  @type {Tone.Oscillator}
			 */this.oscillator=this._carrier.oscillator;/**
			 *  The carrier's envelope
			 *  @type {Tone.AmplitudeEnvelope}
			 */this.envelope=this._carrier.envelope.set(options.envelope);/**
			 *  The modulator voice.
			 *  @type {Tone.Synth}
			 *  @private
			 */this._modulator=new Tone.Synth();this._modulator.volume.value=-10;/**
			 *  The modulator's oscillator which is applied
			 *  to the amplitude of the oscillator
			 *  @type {Tone.Oscillator}
			 */this.modulation=this._modulator.oscillator.set(options.modulation);/**
			 *  The modulator's envelope
			 *  @type {Tone.AmplitudeEnvelope}
			 */this.modulationEnvelope=this._modulator.envelope.set(options.modulationEnvelope);/**
			 *  The frequency.
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=new Tone.Signal(440,Tone.Type.Frequency);/**
			 *  The detune in cents
			 *  @type {Cents}
			 *  @signal
			 */this.detune=new Tone.Signal(options.detune,Tone.Type.Cents);/**
			 *  Harmonicity is the ratio between the two voices. A harmonicity of
			 *  1 is no change. Harmonicity = 2 means a change of an octave.
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //pitch voice1 an octave below voice0
			 * synth.harmonicity.value = 0.5;
			 */this.harmonicity=new Tone.Multiply(options.harmonicity);this.harmonicity.units=Tone.Type.Positive;/**
			 *  convert the -1,1 output to 0,1
			 *  @type {Tone.AudioToGain}
			 *  @private
			 */this._modulationScale=new Tone.AudioToGain();/**
			 *  the node where the modulation happens
			 *  @type {Tone.Gain}
			 *  @private
			 */this._modulationNode=new Tone.Gain();//control the two voices frequency
this.frequency.connect(this._carrier.frequency);this.frequency.chain(this.harmonicity,this._modulator.frequency);this.detune.fan(this._carrier.detune,this._modulator.detune);this._modulator.chain(this._modulationScale,this._modulationNode.gain);this._carrier.chain(this._modulationNode,this.output);this._readOnly(['frequency','harmonicity','oscillator','envelope','modulation','modulationEnvelope','detune']);};Tone.extend(Tone.AMSynth,Tone.Monophonic);/**
		 *  @static
		 *  @type {Object}
		 */Tone.AMSynth.defaults={'harmonicity':3,'detune':0,'oscillator':{'type':'sine'},'envelope':{'attack':0.01,'decay':0.01,'sustain':1,'release':0.5},'modulation':{'type':'square'},'modulationEnvelope':{'attack':0.5,'decay':0,'sustain':1,'release':0.5}};/**
		 *  trigger the attack portion of the note
		 *
		 *  @param  {Time} [time=now] the time the note will occur
		 *  @param {NormalRange} [velocity=1] the velocity of the note
		 *  @private
		 *  @returns {Tone.AMSynth} this
		 */Tone.AMSynth.prototype._triggerEnvelopeAttack=function(time,velocity){//the port glide
time=this.toSeconds(time);//the envelopes
this._carrier._triggerEnvelopeAttack(time,velocity);this._modulator._triggerEnvelopeAttack(time);return this;};/**
		 *  trigger the release portion of the note
		 *
		 *  @param  {Time} [time=now] the time the note will release
		 *  @private
		 *  @returns {Tone.AMSynth} this
		 */Tone.AMSynth.prototype._triggerEnvelopeRelease=function(time){this._carrier._triggerEnvelopeRelease(time);this._modulator._triggerEnvelopeRelease(time);return this;};/**
		 *  clean up
		 *  @returns {Tone.AMSynth} this
		 */Tone.AMSynth.prototype.dispose=function(){Tone.Monophonic.prototype.dispose.call(this);this._writable(['frequency','harmonicity','oscillator','envelope','modulation','modulationEnvelope','detune']);this._carrier.dispose();this._carrier=null;this._modulator.dispose();this._modulator=null;this.frequency.dispose();this.frequency=null;this.detune.dispose();this.detune=null;this.harmonicity.dispose();this.harmonicity=null;this._modulationScale.dispose();this._modulationScale=null;this._modulationNode.dispose();this._modulationNode=null;this.oscillator=null;this.envelope=null;this.modulationEnvelope=null;this.modulation=null;return this;};return Tone.AMSynth;});Module(function(Tone){/**
		 *  @class  Tone.MonoSynth is composed of one oscillator, one filter, and two envelopes.
		 *          The amplitude of the Tone.Oscillator and the cutoff frequency of the
		 *          Tone.Filter are controlled by Tone.Envelopes.
		 *          <img src="https://docs.google.com/drawings/d/1gaY1DF9_Hzkodqf8JI1Cg2VZfwSElpFQfI94IQwad38/pub?w=924&h=240">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth
		 *                          see defaults below
		 *  @example
		 * var synth = new Tone.MonoSynth({
		 * 	"oscillator" : {
		 * 		"type" : "square"
		 *  },
		 *  "envelope" : {
		 *  	"attack" : 0.1
		 *  }
		 * }).toMaster();
		 * synth.triggerAttackRelease("C4", "8n");
		 */Tone.MonoSynth=function(options){//get the defaults
options=Tone.defaultArg(options,Tone.MonoSynth.defaults);Tone.Monophonic.call(this,options);/**
			 *  The oscillator.
			 *  @type {Tone.OmniOscillator}
			 */this.oscillator=new Tone.OmniOscillator(options.oscillator);/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=this.oscillator.frequency;/**
			 *  The detune control.
			 *  @type {Cents}
			 *  @signal
			 */this.detune=this.oscillator.detune;/**
			 *  The filter.
			 *  @type {Tone.Filter}
			 */this.filter=new Tone.Filter(options.filter);/**
			 *  The filter envelope.
			 *  @type {Tone.FrequencyEnvelope}
			 */this.filterEnvelope=new Tone.FrequencyEnvelope(options.filterEnvelope);/**
			 *  The amplitude envelope.
			 *  @type {Tone.AmplitudeEnvelope}
			 */this.envelope=new Tone.AmplitudeEnvelope(options.envelope);//connect the oscillators to the output
this.oscillator.chain(this.filter,this.envelope,this.output);//connect the filter envelope
this.filterEnvelope.connect(this.filter.frequency);this._readOnly(['oscillator','frequency','detune','filter','filterEnvelope','envelope']);};Tone.extend(Tone.MonoSynth,Tone.Monophonic);/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */Tone.MonoSynth.defaults={'frequency':'C4','detune':0,'oscillator':{'type':'square'},'filter':{'Q':6,'type':'lowpass','rolloff':-24},'envelope':{'attack':0.005,'decay':0.1,'sustain':0.9,'release':1},'filterEnvelope':{'attack':0.06,'decay':0.2,'sustain':0.5,'release':2,'baseFrequency':200,'octaves':7,'exponent':2}};/**
		 *  start the attack portion of the envelope
		 *  @param {Time} [time=now] the time the attack should start
		 *  @param {NormalRange} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.MonoSynth} this
		 *  @private
		 */Tone.MonoSynth.prototype._triggerEnvelopeAttack=function(time,velocity){time=this.toSeconds(time);//the envelopes
this.envelope.triggerAttack(time,velocity);this.filterEnvelope.triggerAttack(time);this.oscillator.start(time);if(this.envelope.sustain===0){this.oscillator.stop(time+this.envelope.attack+this.envelope.decay);}return this;};/**
		 *  start the release portion of the envelope
		 *  @param {Time} [time=now] the time the release should start
		 *  @returns {Tone.MonoSynth} this
		 *  @private
		 */Tone.MonoSynth.prototype._triggerEnvelopeRelease=function(time){this.envelope.triggerRelease(time);this.filterEnvelope.triggerRelease(time);this.oscillator.stop(time+this.envelope.release);return this;};/**
		 *  clean up
		 *  @returns {Tone.MonoSynth} this
		 */Tone.MonoSynth.prototype.dispose=function(){Tone.Monophonic.prototype.dispose.call(this);this._writable(['oscillator','frequency','detune','filter','filterEnvelope','envelope']);this.oscillator.dispose();this.oscillator=null;this.envelope.dispose();this.envelope=null;this.filterEnvelope.dispose();this.filterEnvelope=null;this.filter.dispose();this.filter=null;this.frequency=null;this.detune=null;return this;};return Tone.MonoSynth;});Module(function(Tone){/**
		 *  @class  Tone.DuoSynth is a monophonic synth composed of two
		 *          MonoSynths run in parallel with control over the
		 *          frequency ratio between the two voices and vibrato effect.
		 *          <img src="https://docs.google.com/drawings/d/1bL4GXvfRMMlqS7XyBm9CjL9KJPSUKbcdBNpqOlkFLxk/pub?w=1012&h=448">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth
		 *                          see defaults below
		 *  @example
		 * var duoSynth = new Tone.DuoSynth().toMaster();
		 * duoSynth.triggerAttackRelease("C4", "2n");
		 */Tone.DuoSynth=function(options){options=Tone.defaultArg(options,Tone.DuoSynth.defaults);Tone.Monophonic.call(this,options);/**
			 *  the first voice
			 *  @type {Tone.MonoSynth}
			 */this.voice0=new Tone.MonoSynth(options.voice0);this.voice0.volume.value=-10;/**
			 *  the second voice
			 *  @type {Tone.MonoSynth}
			 */this.voice1=new Tone.MonoSynth(options.voice1);this.voice1.volume.value=-10;/**
			 *  The vibrato LFO.
			 *  @type {Tone.LFO}
			 *  @private
			 */this._vibrato=new Tone.LFO(options.vibratoRate,-50,50);this._vibrato.start();/**
			 * the vibrato frequency
			 * @type {Frequency}
			 * @signal
			 */this.vibratoRate=this._vibrato.frequency;/**
			 *  the vibrato gain
			 *  @type {Tone.Gain}
			 *  @private
			 */this._vibratoGain=new Tone.Gain(options.vibratoAmount,Tone.Type.Positive);/**
			 * The amount of vibrato
			 * @type {Positive}
			 * @signal
			 */this.vibratoAmount=this._vibratoGain.gain;/**
			 *  the frequency control
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=new Tone.Signal(440,Tone.Type.Frequency);/**
			 *  Harmonicity is the ratio between the two voices. A harmonicity of
			 *  1 is no change. Harmonicity = 2 means a change of an octave.
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //pitch voice1 an octave below voice0
			 * duoSynth.harmonicity.value = 0.5;
			 */this.harmonicity=new Tone.Multiply(options.harmonicity);this.harmonicity.units=Tone.Type.Positive;//control the two voices frequency
this.frequency.connect(this.voice0.frequency);this.frequency.chain(this.harmonicity,this.voice1.frequency);this._vibrato.connect(this._vibratoGain);this._vibratoGain.fan(this.voice0.detune,this.voice1.detune);this.voice0.connect(this.output);this.voice1.connect(this.output);this._readOnly(['voice0','voice1','frequency','vibratoAmount','vibratoRate']);};Tone.extend(Tone.DuoSynth,Tone.Monophonic);/**
		 *  @static
		 *  @type {Object}
		 */Tone.DuoSynth.defaults={'vibratoAmount':0.5,'vibratoRate':5,'harmonicity':1.5,'voice0':{'volume':-10,'portamento':0,'oscillator':{'type':'sine'},'filterEnvelope':{'attack':0.01,'decay':0,'sustain':1,'release':0.5},'envelope':{'attack':0.01,'decay':0,'sustain':1,'release':0.5}},'voice1':{'volume':-10,'portamento':0,'oscillator':{'type':'sine'},'filterEnvelope':{'attack':0.01,'decay':0,'sustain':1,'release':0.5},'envelope':{'attack':0.01,'decay':0,'sustain':1,'release':0.5}}};/**
		 *  start the attack portion of the envelopes
		 *
		 *  @param {Time} [time=now] the time the attack should start
		 *  @param {NormalRange} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.DuoSynth} this
		 *  @private
		 */Tone.DuoSynth.prototype._triggerEnvelopeAttack=function(time,velocity){time=this.toSeconds(time);this.voice0._triggerEnvelopeAttack(time,velocity);this.voice1._triggerEnvelopeAttack(time,velocity);return this;};/**
		 *  start the release portion of the envelopes
		 *
		 *  @param {Time} [time=now] the time the release should start
		 *  @returns {Tone.DuoSynth} this
		 *  @private
		 */Tone.DuoSynth.prototype._triggerEnvelopeRelease=function(time){this.voice0._triggerEnvelopeRelease(time);this.voice1._triggerEnvelopeRelease(time);return this;};/**
		 *  Get the level of the output at the given time. Measures
		 *  the envelope(s) value at the time. 
		 *  @param {Time} time The time to query the envelope value
		 *  @return {NormalRange} The output level between 0-1
		 */Tone.DuoSynth.prototype.getLevelAtTime=function(time){return(this.voice0.getLevelAtTime(time)+this.voice1.getLevelAtTime(time))/2;};/**
		 *  clean up
		 *  @returns {Tone.DuoSynth} this
		 */Tone.DuoSynth.prototype.dispose=function(){Tone.Monophonic.prototype.dispose.call(this);this._writable(['voice0','voice1','frequency','vibratoAmount','vibratoRate']);this.voice0.dispose();this.voice0=null;this.voice1.dispose();this.voice1=null;this.frequency.dispose();this.frequency=null;this._vibratoGain.dispose();this._vibratoGain=null;this._vibrato=null;this.harmonicity.dispose();this.harmonicity=null;this.vibratoAmount.dispose();this.vibratoAmount=null;this.vibratoRate=null;return this;};return Tone.DuoSynth;});Module(function(Tone){/**
		 *  @class  FMSynth is composed of two Tone.Synths where one Tone.Synth modulates
		 *          the frequency of a second Tone.Synth. A lot of spectral content
		 *          can be explored using the modulationIndex parameter. Read more about
		 *          frequency modulation synthesis on Sound On Sound: [Part 1](https://web.archive.org/web/20160403123704/http://www.soundonsound.com/sos/apr00/articles/synthsecrets.htm), [Part 2](https://web.archive.org/web/20160403115835/http://www.soundonsound.com/sos/may00/articles/synth.htm).
		 *          <img src="https://docs.google.com/drawings/d/1h0PUDZXPgi4Ikx6bVT6oncrYPLluFKy7lj53puxj-DM/pub?w=902&h=462">
		 *
		 *  @constructor
		 *  @extends {Tone.Monophonic}
		 *  @param {Object} [options] the options available for the synth
		 *                          see defaults below
		 *  @example
		 * var fmSynth = new Tone.FMSynth().toMaster();
		 * fmSynth.triggerAttackRelease("C5", "4n");
		 */Tone.FMSynth=function(options){options=Tone.defaultArg(options,Tone.FMSynth.defaults);Tone.Monophonic.call(this,options);/**
			 *  The carrier voice.
			 *  @type {Tone.Synth}
			 *  @private
			 */this._carrier=new Tone.Synth(options.carrier);this._carrier.volume.value=-10;/**
			 *  The carrier's oscillator
			 *  @type {Tone.Oscillator}
			 */this.oscillator=this._carrier.oscillator;/**
			 *  The carrier's envelope
			 *  @type {Tone.Oscillator}
			 */this.envelope=this._carrier.envelope.set(options.envelope);/**
			 *  The modulator voice.
			 *  @type {Tone.Synth}
			 *  @private
			 */this._modulator=new Tone.Synth(options.modulator);this._modulator.volume.value=-10;/**
			 *  The modulator's oscillator which is applied
			 *  to the amplitude of the oscillator
			 *  @type {Tone.Oscillator}
			 */this.modulation=this._modulator.oscillator.set(options.modulation);/**
			 *  The modulator's envelope
			 *  @type {Tone.Oscillator}
			 */this.modulationEnvelope=this._modulator.envelope.set(options.modulationEnvelope);/**
			 *  The frequency control.
			 *  @type {Frequency}
			 *  @signal
			 */this.frequency=new Tone.Signal(440,Tone.Type.Frequency);/**
			 *  The detune in cents
			 *  @type {Cents}
			 *  @signal
			 */this.detune=new Tone.Signal(options.detune,Tone.Type.Cents);/**
			 *  Harmonicity is the ratio between the two voices. A harmonicity of
			 *  1 is no change. Harmonicity = 2 means a change of an octave.
			 *  @type {Positive}
			 *  @signal
			 *  @example
			 * //pitch voice1 an octave below voice0
			 * synth.harmonicity.value = 0.5;
			 */this.harmonicity=new Tone.Multiply(options.harmonicity);this.harmonicity.units=Tone.Type.Positive;/**
			 *  The modulation index which essentially the depth or amount of the modulation. It is the
			 *  ratio of the frequency of the modulating signal (mf) to the amplitude of the
			 *  modulating signal (ma) -- as in ma/mf.
			 *	@type {Positive}
			 *	@signal
			 */this.modulationIndex=new Tone.Multiply(options.modulationIndex);this.modulationIndex.units=Tone.Type.Positive;/**
			 *  the node where the modulation happens
			 *  @type {GainNode}
			 *  @private
			 */this._modulationNode=new Tone.Gain(0);//control the two voices frequency
this.frequency.connect(this._carrier.frequency);this.frequency.chain(this.harmonicity,this._modulator.frequency);this.frequency.chain(this.modulationIndex,this._modulationNode);this.detune.fan(this._carrier.detune,this._modulator.detune);this._modulator.connect(this._modulationNode.gain);this._modulationNode.connect(this._carrier.frequency);this._carrier.connect(this.output);this._readOnly(['frequency','harmonicity','modulationIndex','oscillator','envelope','modulation','modulationEnvelope','detune']);};Tone.extend(Tone.FMSynth,Tone.Monophonic);/**
		 *  @static
		 *  @type {Object}
		 */Tone.FMSynth.defaults={'harmonicity':3,'modulationIndex':10,'detune':0,'oscillator':{'type':'sine'},'envelope':{'attack':0.01,'decay':0.01,'sustain':1,'release':0.5},'modulation':{'type':'square'},'modulationEnvelope':{'attack':0.5,'decay':0,'sustain':1,'release':0.5}};/**
		 * 	trigger the attack portion of the note
		 *
		 *  @param  {Time} [time=now] the time the note will occur
		 *  @param {number} [velocity=1] the velocity of the note
		 *  @returns {Tone.FMSynth} this
		 *  @private
		 */Tone.FMSynth.prototype._triggerEnvelopeAttack=function(time,velocity){time=this.toSeconds(time);//the envelopes
this._carrier._triggerEnvelopeAttack(time,velocity);this._modulator._triggerEnvelopeAttack(time);return this;};/**
		 *  trigger the release portion of the note
		 *
		 *  @param  {Time} [time=now] the time the note will release
		 *  @returns {Tone.FMSynth} this
		 *  @private
		 */Tone.FMSynth.prototype._triggerEnvelopeRelease=function(time){time=this.toSeconds(time);this._carrier._triggerEnvelopeRelease(time);this._modulator._triggerEnvelopeRelease(time);return this;};/**
		 *  clean up
		 *  @returns {Tone.FMSynth} this
		 */Tone.FMSynth.prototype.dispose=function(){Tone.Monophonic.prototype.dispose.call(this);this._writable(['frequency','harmonicity','modulationIndex','oscillator','envelope','modulation','modulationEnvelope','detune']);this._carrier.dispose();this._carrier=null;this._modulator.dispose();this._modulator=null;this.frequency.dispose();this.frequency=null;this.detune.dispose();this.detune=null;this.modulationIndex.dispose();this.modulationIndex=null;this.harmonicity.dispose();this.harmonicity=null;this._modulationNode.dispose();this._modulationNode=null;this.oscillator=null;this.envelope=null;this.modulationEnvelope=null;this.modulation=null;return this;};return Tone.FMSynth;});Module(function(Tone){/**
		 *  @class  Tone.MembraneSynth makes kick and tom sounds using a single oscillator
		 *          with an amplitude envelope and frequency ramp. A Tone.OmniOscillator
		 *          is routed through a Tone.AmplitudeEnvelope to the output. The drum
		 *          quality of the sound comes from the frequency envelope applied
		 *          during Tone.MembraneSynth.triggerAttack(note). The frequency envelope
		 *          starts at <code>note * .octaves</code> and ramps to <code>note</code>
		 *          over the duration of <code>.pitchDecay</code>.
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {Object} [options] the options available for the synth
		 *                          see defaults below
		 *  @example
		 * var synth = new Tone.MembraneSynth().toMaster();
		 * synth.triggerAttackRelease("C2", "8n");
		 */Tone.MembraneSynth=function(options){options=Tone.defaultArg(options,Tone.MembraneSynth.defaults);Tone.Instrument.call(this,options);/**
			 *  The oscillator.
			 *  @type {Tone.OmniOscillator}
			 */this.oscillator=new Tone.OmniOscillator(options.oscillator);/**
			 *  The amplitude envelope.
			 *  @type {Tone.AmplitudeEnvelope}
			 */this.envelope=new Tone.AmplitudeEnvelope(options.envelope);/**
			 *  The number of octaves the pitch envelope ramps.
			 *  @type {Positive}
			 */this.octaves=options.octaves;/**
			 *  The amount of time the frequency envelope takes.
			 *  @type {Time}
			 */this.pitchDecay=options.pitchDecay;this.oscillator.chain(this.envelope,this.output);this._readOnly(['oscillator','envelope']);};Tone.extend(Tone.MembraneSynth,Tone.Instrument);/**
		 *  @static
		 *  @type {Object}
		 */Tone.MembraneSynth.defaults={'pitchDecay':0.05,'octaves':10,'oscillator':{'type':'sine'},'envelope':{'attack':0.001,'decay':0.4,'sustain':0.01,'release':1.4,'attackCurve':'exponential'}};/**
		 *  Trigger the note at the given time with the given velocity.
		 *
		 *  @param  {Frequency} note     the note
		 *  @param  {Time} [time=now]     the time, if not given is now
		 *  @param  {number} [velocity=1] velocity defaults to 1
		 *  @returns {Tone.MembraneSynth} this
		 *  @example
		 *  kick.triggerAttack(60);
		 */Tone.MembraneSynth.prototype.triggerAttack=function(note,time,velocity){time=this.toSeconds(time);note=this.toFrequency(note);var maxNote=note*this.octaves;this.oscillator.frequency.setValueAtTime(maxNote,time);this.oscillator.frequency.exponentialRampToValueAtTime(note,time+this.toSeconds(this.pitchDecay));this.envelope.triggerAttack(time,velocity);this.oscillator.start(time);return this;};/**
		 *  Trigger the release portion of the note.
		 *
		 *  @param  {Time} [time=now] the time the note will release
		 *  @returns {Tone.MembraneSynth} this
		 */Tone.MembraneSynth.prototype.triggerRelease=function(time){time=this.toSeconds(time);this.envelope.triggerRelease(time);this.oscillator.stop(time+this.envelope.release);return this;};/**
		 *  Clean up.
		 *  @returns {Tone.MembraneSynth} this
		 */Tone.MembraneSynth.prototype.dispose=function(){Tone.Instrument.prototype.dispose.call(this);this._writable(['oscillator','envelope']);this.oscillator.dispose();this.oscillator=null;this.envelope.dispose();this.envelope=null;return this;};return Tone.MembraneSynth;});Module(function(Tone){/**
		 *  Inharmonic ratio of frequencies based on the Roland TR-808
		 *  Taken from https://ccrma.stanford.edu/papers/tr-808-cymbal-physically-informed-circuit-bendable-digital-model
		 *  @private
		 *  @static
		 *  @type {Array}
		 */var inharmRatios=[1,1.483,1.932,2.546,2.63,3.897];/**
		 *  @class  A highly inharmonic and spectrally complex source with a highpass filter
		 *          and amplitude envelope which is good for making metalophone sounds. Based
		 *          on CymbalSynth by [@polyrhythmatic](https://github.com/polyrhythmatic).
		 *          Inspiration from [Sound on Sound](https://web.archive.org/web/20160610143924/https://www.soundonsound.com/sos/jul02/articles/synthsecrets0702.asp).
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {Object} [options] The options availble for the synth
		 *                             see defaults below
		 */Tone.MetalSynth=function(options){options=Tone.defaultArg(options,Tone.MetalSynth.defaults);Tone.Instrument.call(this,options);/**
			 *  The frequency of the cymbal
			 *  @type  {Frequency}
			 *  @signal
			 */this.frequency=new Tone.Signal(options.frequency,Tone.Type.Frequency);/**
			 *  The array of FMOscillators
			 *  @type  {Array}
			 *  @private
			 */this._oscillators=[];/**
			 *  The frequency multipliers
			 *  @type {Array}
			 *  @private
			 */this._freqMultipliers=[];/**
			 *  The amplitude for the body
			 *  @type {Tone.Gain}
			 *  @private
			 */this._amplitue=new Tone.Gain(0).connect(this.output);/**
			 *  highpass the output
			 *  @type {Tone.Filter}
			 *  @private
			 */this._highpass=new Tone.Filter({'type':'highpass','Q':-3.0102999566398125}).connect(this._amplitue);/**
			 *  The number of octaves the highpass
			 *  filter frequency ramps
			 *  @type {Number}
			 *  @private
			 */this._octaves=options.octaves;/**
			 *  Scale the body envelope
			 *  for the bandpass
			 *  @type {Tone.Scale}
			 *  @private
			 */this._filterFreqScaler=new Tone.Scale(options.resonance,7000);/**
			 *  The envelope which is connected both to the
			 *  amplitude and highpass filter's cutoff frequency
			 *  @type  {Tone.Envelope}
			 */this.envelope=new Tone.Envelope({'attack':options.envelope.attack,'attackCurve':'linear','decay':options.envelope.decay,'sustain':0,'release':options.envelope.release}).chain(this._filterFreqScaler,this._highpass.frequency);this.envelope.connect(this._amplitue.gain);for(var i=0;i<inharmRatios.length;i++){var osc=new Tone.FMOscillator({'type':'square','modulationType':'square','harmonicity':options.harmonicity,'modulationIndex':options.modulationIndex});osc.connect(this._highpass);this._oscillators[i]=osc;var mult=new Tone.Multiply(inharmRatios[i]);this._freqMultipliers[i]=mult;this.frequency.chain(mult,osc.frequency);}//set the octaves
this.octaves=options.octaves;};Tone.extend(Tone.MetalSynth,Tone.Instrument);/**
		 *  default values
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.MetalSynth.defaults={'frequency':200,'envelope':{'attack':0.001,'decay':1.4,'release':0.2},'harmonicity':5.1,'modulationIndex':32,'resonance':4000,'octaves':1.5};/**
		 *  Trigger the attack.
		 *  @param  {Time}  time      When the attack should be triggered.
		 *  @param  {NormalRange}  [velocity=1]  The velocity that the envelope should be triggered at.
		 *  @return  {Tone.MetalSynth}  this
		 */Tone.MetalSynth.prototype.triggerAttack=function(time,vel){time=this.toSeconds(time);vel=Tone.defaultArg(vel,1);this.envelope.triggerAttack(time,vel);this._oscillators.forEach(function(osc){osc.start(time);});//if the sustain is 0, stop the oscillator as well
if(this.envelope.sustain===0){this._oscillators.forEach(function(osc){osc.stop(time+this.envelope.attack+this.envelope.decay);}.bind(this));}return this;};/**
		 *  Trigger the release of the envelope.
		 *  @param  {Time}  time      When the release should be triggered.
		 *  @return  {Tone.MetalSynth}  this
		 */Tone.MetalSynth.prototype.triggerRelease=function(time){time=this.toSeconds(time);this.envelope.triggerRelease(time);this._oscillators.forEach(function(osc){osc.stop(time+this.envelope.release);}.bind(this));return this;};/**
		 * Sync the instrument to the Transport. All subsequent calls of
		 * [triggerAttack](#triggerattack) and [triggerRelease](#triggerrelease)
		 * will be scheduled along the transport.
		 * @example
		 * synth.sync()
		 * //schedule 3 notes when the transport first starts
		 * synth.triggerAttackRelease('8n', 0)
		 * synth.triggerAttackRelease('8n', '8n')
		 * synth.triggerAttackRelease('8n', '4n')
		 * //start the transport to hear the notes
		 * Transport.start()
		 * @returns {Tone.Instrument} this
		 */Tone.MetalSynth.prototype.sync=function(){this._syncMethod('triggerAttack',0);this._syncMethod('triggerRelease',0);return this;};/**
		 *  Trigger the attack and release of the envelope after the given
		 *  duration.
		 *  @param  {Time}  duration  The duration before triggering the release
		 *  @param  {Time}  time      When the attack should be triggered.
		 *  @param  {NormalRange}  [velocity=1]  The velocity that the envelope should be triggered at.
		 *  @return  {Tone.MetalSynth}  this
		 */Tone.MetalSynth.prototype.triggerAttackRelease=function(duration,time,velocity){time=this.toSeconds(time);duration=this.toSeconds(duration);this.triggerAttack(time,velocity);this.triggerRelease(time+duration);return this;};/**
		 *  The modulationIndex of the oscillators which make up the source.
		 *  see Tone.FMOscillator.modulationIndex
		 *  @memberOf Tone.MetalSynth#
		 *  @type {Positive}
		 *  @name  modulationIndex
		 */Object.defineProperty(Tone.MetalSynth.prototype,'modulationIndex',{get:function get(){return this._oscillators[0].modulationIndex.value;},set:function set(val){for(var i=0;i<this._oscillators.length;i++){this._oscillators[i].modulationIndex.value=val;}}});/**
		 *  The harmonicity of the oscillators which make up the source.
		 *  see Tone.FMOscillator.harmonicity
		 *  @memberOf Tone.MetalSynth#
		 *  @type {Positive}
		 *  @name  harmonicity
		 */Object.defineProperty(Tone.MetalSynth.prototype,'harmonicity',{get:function get(){return this._oscillators[0].harmonicity.value;},set:function set(val){for(var i=0;i<this._oscillators.length;i++){this._oscillators[i].harmonicity.value=val;}}});/**
		 *  The frequency of the highpass filter attached to the envelope
		 *  @memberOf Tone.MetalSynth#
		 *  @type {Frequency}
		 *  @name  resonance
		 */Object.defineProperty(Tone.MetalSynth.prototype,'resonance',{get:function get(){return this._filterFreqScaler.min;},set:function set(val){this._filterFreqScaler.min=val;this.octaves=this._octaves;}});/**
		 *  The number of octaves above the "resonance" frequency
		 *  that the filter ramps during the attack/decay envelope
		 *  @memberOf Tone.MetalSynth#
		 *  @type {Number}
		 *  @name  octaves
		 */Object.defineProperty(Tone.MetalSynth.prototype,'octaves',{get:function get(){return this._octaves;},set:function set(octs){this._octaves=octs;this._filterFreqScaler.max=this._filterFreqScaler.min*Math.pow(2,octs);}});/**
		 *  Clean up
		 *  @returns {Tone.MetalSynth} this
		 */Tone.MetalSynth.prototype.dispose=function(){Tone.Instrument.prototype.dispose.call(this);for(var i=0;i<this._oscillators.length;i++){this._oscillators[i].dispose();this._freqMultipliers[i].dispose();}this._oscillators=null;this._freqMultipliers=null;this.frequency.dispose();this.frequency=null;this._filterFreqScaler.dispose();this._filterFreqScaler=null;this._amplitue.dispose();this._amplitue=null;this.envelope.dispose();this.envelope=null;this._highpass.dispose();this._highpass=null;};return Tone.MetalSynth;});Module(function(Tone){/**
		 *  @class  Tone.NoiseSynth is composed of a noise generator (Tone.Noise), one filter (Tone.Filter),
		 *          and two envelopes (Tone.Envelop). One envelope controls the amplitude
		 *          of the noise and the other is controls the cutoff frequency of the filter.
		 *          <img src="https://docs.google.com/drawings/d/1rqzuX9rBlhT50MRvD2TKml9bnZhcZmzXF1rf_o7vdnE/pub?w=918&h=242">
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {Object} [options] the options available for the synth
		 *                          see defaults below
		 * @example
		 * var noiseSynth = new Tone.NoiseSynth().toMaster();
		 * noiseSynth.triggerAttackRelease("8n");
		 */Tone.NoiseSynth=function(options){//get the defaults
options=Tone.defaultArg(options,Tone.NoiseSynth.defaults);Tone.Instrument.call(this,options);/**
			 *  The noise source.
			 *  @type {Tone.Noise}
			 *  @example
			 * noiseSynth.set("noise.type", "brown");
			 */this.noise=new Tone.Noise();/**
			 *  The amplitude envelope.
			 *  @type {Tone.AmplitudeEnvelope}
			 */this.envelope=new Tone.AmplitudeEnvelope(options.envelope);//connect the noise to the output
this.noise.chain(this.envelope,this.output);this._readOnly(['noise','envelope']);};Tone.extend(Tone.NoiseSynth,Tone.Instrument);/**
		 *  @const
		 *  @static
		 *  @type {Object}
		 */Tone.NoiseSynth.defaults={'noise':{'type':'white'},'envelope':{'attack':0.005,'decay':0.1,'sustain':0}};/**
		 *  Start the attack portion of the envelopes. Unlike other
		 *  instruments, Tone.NoiseSynth doesn't have a note.
		 *  @param {Time} [time=now] the time the attack should start
		 *  @param {number} [velocity=1] the velocity of the note (0-1)
		 *  @returns {Tone.NoiseSynth} this
		 *  @example
		 * noiseSynth.triggerAttack();
		 */Tone.NoiseSynth.prototype.triggerAttack=function(time,velocity){//the envelopes
this.envelope.triggerAttack(time,velocity);//start the noise
this.noise.start(time);if(this.envelope.sustain===0){this.noise.stop(time=this.envelope.attack+this.envelope.decay);}return this;};/**
		 *  Start the release portion of the envelopes.
		 *  @param {Time} [time=now] the time the release should start
		 *  @returns {Tone.NoiseSynth} this
		 */Tone.NoiseSynth.prototype.triggerRelease=function(time){this.envelope.triggerRelease(time);this.noise.stop(time+this.envelope.release);return this;};/**
		 * Sync the instrument to the Transport. All subsequent calls of
		 * [triggerAttack](#triggerattack) and [triggerRelease](#triggerrelease)
		 * will be scheduled along the transport.
		 * @example
		 * synth.sync()
		 * //schedule 3 notes when the transport first starts
		 * synth.triggerAttackRelease('8n', 0)
		 * synth.triggerAttackRelease('8n', '8n')
		 * synth.triggerAttackRelease('8n', '4n')
		 * //start the transport to hear the notes
		 * Transport.start()
		 * @returns {Tone.Instrument} this
		 */Tone.NoiseSynth.prototype.sync=function(){this._syncMethod('triggerAttack',0);this._syncMethod('triggerRelease',0);return this;};/**
		 *  Trigger the attack and then the release.
		 *  @param  {Time} duration the duration of the note
		 *  @param  {Time} [time=now]     the time of the attack
		 *  @param  {number} [velocity=1] the velocity
		 *  @returns {Tone.NoiseSynth} this
		 */Tone.NoiseSynth.prototype.triggerAttackRelease=function(duration,time,velocity){time=this.toSeconds(time);duration=this.toSeconds(duration);this.triggerAttack(time,velocity);this.triggerRelease(time+duration);return this;};/**
		 *  Clean up.
		 *  @returns {Tone.NoiseSynth} this
		 */Tone.NoiseSynth.prototype.dispose=function(){Tone.Instrument.prototype.dispose.call(this);this._writable(['noise','envelope']);this.noise.dispose();this.noise=null;this.envelope.dispose();this.envelope=null;return this;};return Tone.NoiseSynth;});Module(function(Tone){/**
		 *  @class Karplus-String string synthesis. Often out of tune.
		 *         Will change when the AudioWorkerNode is available across
		 *         browsers.
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {Object} [options] see the defaults
		 *  @example
		 * var plucky = new Tone.PluckSynth().toMaster();
		 * plucky.triggerAttack("C4");
		 */Tone.PluckSynth=function(options){options=Tone.defaultArg(options,Tone.PluckSynth.defaults);Tone.Instrument.call(this,options);/**
			 *  @type {Tone.Noise}
			 *  @private
			 */this._noise=new Tone.Noise('pink');/**
			 *  The amount of noise at the attack.
			 *  Nominal range of [0.1, 20]
			 *  @type {number}
			 */this.attackNoise=options.attackNoise;/**
			 *  the LFCF
			 *  @type {Tone.LowpassCombFilter}
			 *  @private
			 */this._lfcf=new Tone.LowpassCombFilter({'resonance':options.resonance,'dampening':options.dampening});/**
			 *  The resonance control.
			 *  @type {NormalRange}
			 *  @signal
			 */this.resonance=this._lfcf.resonance;/**
			 *  The dampening control. i.e. the lowpass filter frequency of the comb filter
			 *  @type {Frequency}
			 *  @signal
			 */this.dampening=this._lfcf.dampening;//connections
this._noise.connect(this._lfcf);this._lfcf.connect(this.output);this._readOnly(['resonance','dampening']);};Tone.extend(Tone.PluckSynth,Tone.Instrument);/**
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.PluckSynth.defaults={'attackNoise':1,'dampening':4000,'resonance':0.7};/**
		 *  Trigger the note.
		 *  @param {Frequency} note The note to trigger.
		 *  @param {Time} [time=now] When the note should be triggered.
		 *  @returns {Tone.PluckSynth} this
		 */Tone.PluckSynth.prototype.triggerAttack=function(note,time){note=this.toFrequency(note);time=this.toSeconds(time);var delayAmount=1/note;this._lfcf.delayTime.setValueAtTime(delayAmount,time);this._noise.start(time);this._noise.stop(time+delayAmount*this.attackNoise);return this;};/**
		 *  Clean up.
		 *  @returns {Tone.PluckSynth} this
		 */Tone.PluckSynth.prototype.dispose=function(){Tone.Instrument.prototype.dispose.call(this);this._noise.dispose();this._lfcf.dispose();this._noise=null;this._lfcf=null;this._writable(['resonance','dampening']);this.dampening=null;this.resonance=null;return this;};return Tone.PluckSynth;});Module(function(Tone){/**
		 *  @class  Tone.PolySynth handles voice creation and allocation for any
		 *          instruments passed in as the second paramter. PolySynth is
		 *          not a synthesizer by itself, it merely manages voices of
		 *          one of the other types of synths, allowing any of the
		 *          monophonic synthesizers to be polyphonic.
		 *
		 *  @constructor
		 *  @extends {Tone.Instrument}
		 *  @param {number|Object} [polyphony=4] The number of voices to create
		 *  @param {function} [voice=Tone.Synth] The constructor of the voices
		 *                                            uses Tone.Synth by default.
		 *  @example
		 * //a polysynth composed of 6 Voices of Synth
		 * var synth = new Tone.PolySynth(6, Tone.Synth).toMaster();
		 * //set the attributes using the set interface
		 * synth.set("detune", -1200);
		 * //play a chord
		 * synth.triggerAttackRelease(["C4", "E4", "A4"], "4n");
		 */Tone.PolySynth=function(){var options=Tone.defaults(arguments,['polyphony','voice'],Tone.PolySynth);Tone.Instrument.call(this,options);options=Tone.defaultArg(options,Tone.Instrument.defaults);//max polyphony
options.polyphony=Math.min(Tone.PolySynth.MAX_POLYPHONY,options.polyphony);/**
			 *  the array of voices
			 *  @type {Array}
			 */this.voices=new Array(options.polyphony);/**
			 *  The queue of voices with data about last trigger
			 *  and the triggered note
			 *  @private
			 *  @type {Array}
			 */this._triggers=new Array(options.polyphony);/**
			 *  The detune in cents
			 *  @type {Cents}
			 *  @signal
			 */this.detune=new Tone.Signal(options.detune,Tone.Type.Cents);this._readOnly('detune');//create the voices
for(var i=0;i<options.polyphony;i++){var v=new options.voice(arguments[2],arguments[3]);if(!(v instanceof Tone.Monophonic)){throw new Error('Synth constructor must be instance of Tone.Monophonic');}this.voices[i]=v;v.connect(this.output);if(v.hasOwnProperty('detune')){this.detune.connect(v.detune);}this._triggers[i]={release:-1,note:null,voice:v};}};Tone.extend(Tone.PolySynth,Tone.Instrument);/**
		 *  the defaults
		 *  @const
		 *  @static
		 *  @type {Object}
		 */Tone.PolySynth.defaults={'polyphony':4,'volume':0,'detune':0,'voice':Tone.Synth};/**
		 *  Trigger the attack portion of the note
		 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
		 *                                  Frequency or an array of frequencies.
		 *  @param  {Time} [time=now]  The start time of the note.
		 *  @param {number} [velocity=1] The velocity of the note.
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * //trigger a chord immediately with a velocity of 0.2
		 * poly.triggerAttack(["Ab3", "C4", "F5"], undefined, 0.2);
		 */Tone.PolySynth.prototype.triggerAttack=function(notes,time,velocity){if(!Array.isArray(notes)){notes=[notes];}time=this.toSeconds(time);for(var i=0;i<notes.length;i++){var val=notes[i];//trigger the oldest voice
var oldest=this._triggers[0];for(var j=1;j<this._triggers.length;j++){if(this._triggers[j].release<oldest.release){oldest=this._triggers[j];}}oldest.release=Infinity;oldest.note=JSON.stringify(val);oldest.voice.triggerAttack(val,time,velocity);}return this;};/**
		 *  Trigger the attack and release after the specified duration
		 *
		 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
		 *                                  Frequency or an array of frequencies.
		 *  @param  {Time} duration the duration of the note
		 *  @param  {Time} [time=now]     if no time is given, defaults to now
		 *  @param  {number} [velocity=1] the velocity of the attack (0-1)
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * //trigger a chord for a duration of a half note
		 * poly.triggerAttackRelease(["Eb3", "G4", "C5"], "2n");
		 *  @example
		 * //can pass in an array of durations as well
		 * poly.triggerAttackRelease(["Eb3", "G4", "C5"], ["2n", "4n", "4n"]);
		 */Tone.PolySynth.prototype.triggerAttackRelease=function(notes,duration,time,velocity){time=this.toSeconds(time);this.triggerAttack(notes,time,velocity);if(Tone.isArray(duration)&&Tone.isArray(notes)){for(var i=0;i<notes.length;i++){var d=duration[Math.min(i,duration.length-1)];this.triggerRelease(notes[i],time+this.toSeconds(d));}}else{this.triggerRelease(notes,time+this.toSeconds(duration));}return this;};/**
		 *  Trigger the release of the note. Unlike monophonic instruments,
		 *  a note (or array of notes) needs to be passed in as the first argument.
		 *  @param  {Frequency|Array} notes The notes to play. Accepts a single
		 *                                  Frequency or an array of frequencies.
		 *  @param  {Time} [time=now]  When the release will be triggered.
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * poly.triggerRelease(["Ab3", "C4", "F5"], "+2n");
		 */Tone.PolySynth.prototype.triggerRelease=function(notes,time){if(!Array.isArray(notes)){notes=[notes];}time=this.toSeconds(time);for(var i=0;i<notes.length;i++){//get the voice
var stringified=JSON.stringify(notes[i]);for(var v=0;v<this._triggers.length;v++){var desc=this._triggers[v];if(desc.note===stringified&&desc.release>time){desc.voice.triggerRelease(time);desc.release=time;}}}return this;};/**
		 * Sync the instrument to the Transport. All subsequent calls of
		 * [triggerAttack](#triggerattack) and [triggerRelease](#triggerrelease)
		 * will be scheduled along the transport.
		 * @example
		 * synth.sync()
		 * //schedule 3 notes when the transport first starts
		 * synth.triggerAttackRelease('8n', 0)
		 * synth.triggerAttackRelease('8n', '8n')
		 * synth.triggerAttackRelease('8n', '4n')
		 * //start the transport to hear the notes
		 * Transport.start()
		 * @returns {Tone.Instrument} this
		 */Tone.PolySynth.prototype.sync=function(){this._syncMethod('triggerAttack',1);this._syncMethod('triggerRelease',1);return this;};/**
		 *  Set a member/attribute of the voices.
		 *  @param {Object|string} params
		 *  @param {number=} value
		 *  @param {Time=} rampTime
		 *  @returns {Tone.PolySynth} this
		 *  @example
		 * poly.set({
		 * 	"filter" : {
		 * 		"type" : "highpass"
		 * 	},
		 * 	"envelope" : {
		 * 		"attack" : 0.25
		 * 	}
		 * });
		 */Tone.PolySynth.prototype.set=function(params,value,rampTime){for(var i=0;i<this.voices.length;i++){this.voices[i].set(params,value,rampTime);}return this;};/**
		 *  Get the synth's attributes. Given no arguments get
		 *  will return all available object properties and their corresponding
		 *  values. Pass in a single attribute to retrieve or an array
		 *  of attributes. The attribute strings can also include a "."
		 *  to access deeper properties.
		 *  @param {Array=} params the parameters to get, otherwise will return
		 *  					   all available.
		 */Tone.PolySynth.prototype.get=function(params){return this.voices[0].get(params);};/**
		 *  Trigger the release portion of all the currently active voices.
		 *  @param {Time} [time=now] When the notes should be released.
		 *  @return {Tone.PolySynth} this
		 */Tone.PolySynth.prototype.releaseAll=function(time){time=this.toSeconds(time);for(var i=0;i<this._triggers.length;i++){var desc=this._triggers[i];if(desc.release>time){desc.release=time;desc.voice.triggerRelease(time);}}return this;};/**
		 *  Clean up.
		 *  @returns {Tone.PolySynth} this
		 */Tone.PolySynth.prototype.dispose=function(){Tone.Instrument.prototype.dispose.call(this);for(var i=0;i<this.voices.length;i++){this.voices[i].dispose();this.voices[i]=null;}this._writable('detune');this.detune.dispose();this.detune=null;this.voices=null;this._triggers=null;return this;};/**
		 *  The maximum number of notes that can be allocated
		 *  to a polysynth.
		 *  @type  {Number}
		 *  @static
		 */Tone.PolySynth.MAX_POLYPHONY=20;return Tone.PolySynth;});Module(function(Tone){/**
		 * @class Automatically interpolates between a set of pitched samples. Pass in an object which maps the note's pitch or midi value to the url, then you can trigger the attack and release of that note like other instruments. By automatically repitching the samples, it is possible to play pitches which were not explicitly included which can save loading time.
		 *        For sample or buffer playback where repitching is not necessary, use [Tone.Player](https://tonejs.github.io/docs/Player).
		 * @param {Object} samples An object of samples mapping either Midi
		 *                         Note Numbers or Scientific Pitch Notation
		 *                         to the url of that sample.
		 * @param {Function=} onload The callback to invoke when all of the samples are loaded.
		 * @param {String=} baseUrl The root URL of all of the samples, which is prepended to all the URLs.
		 * @example
		 * var sampler = new Tone.Sampler({
		 * 	"C3" : "path/to/C3.mp3",
		 * 	"D#3" : "path/to/Dsharp3.mp3",
		 * 	"F#3" : "path/to/Fsharp3.mp3",
		 * 	"A3" : "path/to/A3.mp3",
		 * }, function(){
		 * 	//sampler will repitch the closest sample
		 * 	sampler.triggerAttack("D3")
		 * })
		 * @extends {Tone.Instrument}
		 */Tone.Sampler=function(urls){// shift arguments over one. Those are the remainder of the options
var args=Array.prototype.slice.call(arguments);args.shift();var options=Tone.defaults(args,['onload','baseUrl'],Tone.Sampler);Tone.Instrument.call(this,options);var urlMap={};for(var note in urls){if(Tone.isNote(note)){//convert the note name to MIDI
var mid=Tone.Frequency(note).toMidi();urlMap[mid]=urls[note];}else if(!isNaN(parseFloat(note))){//otherwise if it's numbers assume it's midi
urlMap[note]=urls[note];}else{throw new Error('Tone.Sampler: url keys must be the note\'s pitch');}}/**
			 * The stored and loaded buffers
			 * @type {Tone.Buffers}
			 * @private
			 */this._buffers=new Tone.Buffers(urlMap,options.onload,options.baseUrl);/**
			 * The object of all currently playing BufferSources
			 * @type {Object}
			 * @private
			 */this._activeSources={};/**
			 * The envelope applied to the beginning of the sample.
			 * @type {Time}
			 */this.attack=options.attack;/**
			 * The envelope applied to the end of the envelope.
			 * @type {Time}
			 */this.release=options.release;};Tone.extend(Tone.Sampler,Tone.Instrument);/**
		 * The defaults
		 * @const
		 * @type {Object}
		 */Tone.Sampler.defaults={attack:0,release:0.1,onload:Tone.noOp,baseUrl:''};/**
		 * Returns the difference in steps between the given midi note at the closets sample.
		 * @param  {Midi} midi
		 * @return {Interval}
		 * @private
		 */Tone.Sampler.prototype._findClosest=function(midi){//searches within 8 octaves of the given midi note
var MAX_INTERVAL=96;var interval=0;while(interval<MAX_INTERVAL){// check above and below
if(this._buffers.has(midi+interval)){return-interval;}else if(this._buffers.has(midi-interval)){return interval;}interval++;}return null;};/**
		 * @param  {Frequency} note     The note to play
		 * @param  {Time=} time     When to play the note
		 * @param  {NormalRange=} velocity The velocity to play the sample back.
		 * @return {Tone.Sampler}          this
		 */Tone.Sampler.prototype.triggerAttack=function(note,time,velocity){var midi=Tone.Frequency(note).toMidi();// find the closest note pitch
var difference=this._findClosest(midi);if(difference!==null){var closestNote=midi-difference;var buffer=this._buffers.get(closestNote);// play that note
var source=new Tone.BufferSource({'buffer':buffer,'playbackRate':Tone.intervalToFrequencyRatio(difference),'fadeIn':this.attack,'fadeOut':this.release,'curve':'exponential'}).connect(this.output);source.start(time,0,buffer.duration,velocity);// add it to the active sources
if(!Tone.isArray(this._activeSources[midi])){this._activeSources[midi]=[];}this._activeSources[midi].push({note:midi,source:source});}return this;};/**
		 * @param  {Frequency} note     The note to release.
		 * @param  {Time=} time     	When to release the note.
		 * @return {Tone.Sampler}	this
		 */Tone.Sampler.prototype.triggerRelease=function(note,time){var midi=Tone.Frequency(note).toMidi();// find the note
if(this._activeSources[midi]&&this._activeSources[midi].length){var source=this._activeSources[midi].shift().source;time=this.toSeconds(time);source.stop(time+this.release,this.release);}return this;};/**
		 * Release all currently active notes.
		 * @param  {Time=} time     	When to release the notes.
		 * @return {Tone.Sampler}	this
		 */Tone.Sampler.prototype.releaseAll=function(time){time=this.toSeconds(time);for(var note in this._activeSources){var sources=this._activeSources[note];while(sources.length){var source=sources.shift().source;source.stop(time+this.release,this.release);}}return this;};/**
		 * Sync the instrument to the Transport. All subsequent calls of
		 * [triggerAttack](#triggerattack) and [triggerRelease](#triggerrelease)
		 * will be scheduled along the transport.
		 * @example
		 * synth.sync()
		 * //schedule 3 notes when the transport first starts
		 * synth.triggerAttackRelease('8n', 0)
		 * synth.triggerAttackRelease('8n', '8n')
		 * synth.triggerAttackRelease('8n', '4n')
		 * //start the transport to hear the notes
		 * Transport.start()
		 * @returns {Tone.Instrument} this
		 */Tone.Sampler.prototype.sync=function(){this._syncMethod('triggerAttack',1);this._syncMethod('triggerRelease',1);return this;};/**
		 * Invoke the attack phase, then after the duration, invoke the release.
		 * @param  {Frequency} note     The note to play
		 * @param  {Time} duration The time the note should be held
		 * @param  {Time=} time     When to start the attack
		 * @param  {NormalRange} [velocity=1] The velocity of the attack
		 * @return {Tone.Sampler}          this
		 */Tone.Sampler.prototype.triggerAttackRelease=function(note,duration,time,velocity){time=this.toSeconds(time);duration=this.toSeconds(duration);this.triggerAttack(note,time,velocity);this.triggerRelease(note,time+duration);return this;};/**
		 *  Add a note to the sampler.
		 *  @param  {Note|Midi}   note      The buffer's pitch.
		 *  @param  {String|Tone.Buffer|Audiobuffer}  url  Either the url of the bufer,
		 *                                                 or a buffer which will be added
		 *                                                 with the given name.
		 *  @param  {Function=}  callback  The callback to invoke
		 *                                 when the url is loaded.
		 */Tone.Sampler.prototype.add=function(note,url,callback){if(Tone.isNote(note)){//convert the note name to MIDI
var mid=Tone.Frequency(note).toMidi();this._buffers.add(mid,url,callback);}else if(!isNaN(parseFloat(note))){//otherwise if it's numbers assume it's midi
this._buffers.add(note,url,callback);}else{throw new Error('Tone.Sampler: note must be the note\'s pitch. Instead got '+note);}};/**
		 * If the buffers are loaded or not
		 * @memberOf Tone.Sampler#
		 * @type {Boolean}
		 * @name loaded
		 * @readOnly
		 */Object.defineProperty(Tone.Sampler.prototype,'loaded',{get:function get(){return this._buffers.loaded;}});/**
		 * Clean up
		 * @return {Tone.Sampler} this
		 */Tone.Sampler.prototype.dispose=function(){Tone.Instrument.prototype.dispose.call(this);this._buffers.dispose();this._buffers=null;for(var midi in this._activeSources){this._activeSources[midi].forEach(function(event){event.source.dispose();});}this._activeSources=null;return this;};return Tone.Sampler;});Module(function(Tone){if(Tone.supported){if(!OscillatorNode.prototype.setPeriodicWave){OscillatorNode.prototype.setPeriodicWave=OscillatorNode.prototype.setWaveTable;}if(!AudioContext.prototype.createPeriodicWave){AudioContext.prototype.createPeriodicWave=AudioContext.prototype.createWaveTable;}}});Module(function(Tone){/**
		 *  @class Maps a NormalRange [0, 1] to an AudioRange [-1, 1]. 
		 *         See also Tone.AudioToGain. 
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @example
		 * var g2a = new Tone.GainToAudio();
		 */Tone.GainToAudio=function(){Tone.SignalBase.call(this);/**
			 *  @type {WaveShaperNode}
			 *  @private
			 */this._norm=this.input=this.output=new Tone.WaveShaper(function(x){return Math.abs(x)*2-1;});};Tone.extend(Tone.GainToAudio,Tone.SignalBase);/**
		 *  clean up
		 *  @returns {Tone.GainToAudio} this
		 */Tone.GainToAudio.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._norm.dispose();this._norm=null;return this;};return Tone.GainToAudio;});Module(function(Tone){/**
		 *  @class Normalize takes an input min and max and maps it linearly to NormalRange [0,1]
		 *
		 *  @extends {Tone.SignalBase}
		 *  @constructor
		 *  @param {number} inputMin the min input value
		 *  @param {number} inputMax the max input value
		 *  @example
		 * var norm = new Tone.Normalize(2, 4);
		 * var sig = new Tone.Signal(3).connect(norm);
		 * //output of norm is 0.5. 
		 */Tone.Normalize=function(inputMin,inputMax){Tone.SignalBase.call(this);/**
			 *  the min input value
			 *  @type {number}
			 *  @private
			 */this._inputMin=Tone.defaultArg(inputMin,0);/**
			 *  the max input value
			 *  @type {number}
			 *  @private
			 */this._inputMax=Tone.defaultArg(inputMax,1);/**
			 *  subtract the min from the input
			 *  @type {Tone.Add}
			 *  @private
			 */this._sub=this.input=new Tone.Add(0);/**
			 *  divide by the difference between the input and output
			 *  @type {Tone.Multiply}
			 *  @private
			 */this._div=this.output=new Tone.Multiply(1);this._sub.connect(this._div);this._setRange();};Tone.extend(Tone.Normalize,Tone.SignalBase);/**
		 * The minimum value the input signal will reach.
		 * @memberOf Tone.Normalize#
		 * @type {number}
		 * @name min
		 */Object.defineProperty(Tone.Normalize.prototype,'min',{get:function get(){return this._inputMin;},set:function set(min){this._inputMin=min;this._setRange();}});/**
		 * The maximum value the input signal will reach.
		 * @memberOf Tone.Normalize#
		 * @type {number}
		 * @name max
		 */Object.defineProperty(Tone.Normalize.prototype,'max',{get:function get(){return this._inputMax;},set:function set(max){this._inputMax=max;this._setRange();}});/**
		 *  set the values
		 *  @private
		 */Tone.Normalize.prototype._setRange=function(){this._sub.value=-this._inputMin;this._div.value=1/(this._inputMax-this._inputMin);};/**
		 *  clean up
		 *  @returns {Tone.Normalize} this
		 */Tone.Normalize.prototype.dispose=function(){Tone.SignalBase.prototype.dispose.call(this);this._sub.dispose();this._sub=null;this._div.dispose();this._div=null;return this;};return Tone.Normalize;});Module(function(Tone){/**
		 * @class Tone.TransportTimelineSignal extends Tone.Signal, but adds the ability to synchronize the signal to the signal to the Tone.Transport
		 * @extends {Tone.Signal}
		 */Tone.TransportTimelineSignal=function(){Tone.Signal.apply(this,arguments);/**
			 * The real signal output
			 * @type {Tone.Signal}
			 * @private
			 */this.output=this._outputSig=new Tone.Signal(this._initialValue);/**
			 * Keep track of the last value. (small optimization)
			 * @private
			 * @type {Number}
			 */this._lastVal=this.value;/**
			 * The event id of the tick update loop
			 * @private
			 * @type {Number}
			 */this._synced=Tone.Transport.scheduleRepeat(this._onTick.bind(this),'1i');/**
			 * A bound version of the anchor value methods
			 * @type {Function}
			 * @private
			 */this._bindAnchorValue=this._anchorValue.bind(this);Tone.Transport.on('start stop pause',this._bindAnchorValue);this._events.memory=Infinity;};Tone.extend(Tone.TransportTimelineSignal,Tone.Signal);/**
		 * Callback which is invoked every tick.
		 * @private
		 * @param  {Number} time
		 * @return {Tone.TransportTimelineSignal}      this
		 */Tone.TransportTimelineSignal.prototype._onTick=function(time){var val=this.getValueAtTime(Tone.Transport.seconds);if(this._lastVal!==val){this._lastVal=val;//approximate ramp curves with linear ramps
this._outputSig.linearRampToValueAtTime(val,time);}};/**
		 * Anchor the value at the start and stop of the Transport
		 * @param  {Number} time The time of the event
		 * @return {Tone.TransportTimelineSignal}      this
		 * @private
		 */Tone.TransportTimelineSignal.prototype._anchorValue=function(time){var val=this.getValueAtTime(Tone.Transport.seconds);this._lastVal=val;this._outputSig.cancelScheduledValues(time);this._outputSig.setValueAtTime(val,time);return this;};/**
		 *  Get the scheduled value at the given time. This will
		 *  return the unconverted (raw) value.
		 *  @param  {TransportTime}  time  The time in seconds.
		 *  @return  {Number}  The scheduled value at the given time.
		 */Tone.TransportTimelineSignal.prototype.getValueAtTime=function(time){time=Tone.TransportTime(time);return Tone.Signal.prototype.getValueAtTime.call(this,time);};/**
		 * Set the output of the signal at the given time
		 * @param  {Number} value The value to change to at the given time
		 * @param  {TransportTime} time  The time to change the signal
		 * @return {Tone.TransportTimelineSignal}       this
		 */Tone.TransportTimelineSignal.prototype.setValueAtTime=function(value,time){time=Tone.TransportTime(time);Tone.Signal.prototype.setValueAtTime.call(this,value,time);return this;};/**
		 * Linear ramp to the given value from the previous scheduled point to the given value
		 * @param  {Number} value The value to change to at the given time
		 * @param  {TransportTime} time  The time to change the signal
		 * @return {Tone.TransportTimelineSignal}       this
		 */Tone.TransportTimelineSignal.prototype.linearRampToValueAtTime=function(value,time){time=Tone.TransportTime(time);Tone.Signal.prototype.linearRampToValueAtTime.call(this,value,time);return this;};/**
		 * Exponential ramp to the given value from the previous scheduled point to the given value
		 * @param  {Number} value The value to change to at the given time
		 * @param  {TransportTime} time  The time to change the signal
		 * @return {Tone.TransportTimelineSignal}       this
		 */Tone.TransportTimelineSignal.prototype.exponentialRampToValueAtTime=function(value,time){time=Tone.TransportTime(time);Tone.Signal.prototype.exponentialRampToValueAtTime.call(this,value,time);return this;};/**
		 *  Start exponentially approaching the target value at the given time with
		 *  a rate having the given time constant.
		 *  @param {number} value
		 *  @param {TransportTime} startTime
		 *  @param {number} timeConstant
		 * @return {Tone.TransportTimelineSignal}       this
		 */Tone.TransportTimelineSignal.prototype.setTargetAtTime=function(value,startTime,timeConstant){startTime=Tone.TransportTime(startTime);Tone.Signal.prototype.setTargetAtTime.call(this,value,startTime,timeConstant);return this;};/**
		 *  Cancels all scheduled parameter changes with times greater than or
		 *  equal to startTime.
		 *  @param  {TransportTime} startTime
		 *  @returns {Tone.Param} this
		 */Tone.TransportTimelineSignal.prototype.cancelScheduledValues=function(startTime){startTime=Tone.TransportTime(startTime);Tone.Signal.prototype.cancelScheduledValues.call(this,startTime);return this;};/**
		 *  Set an array of arbitrary values starting at the given time for the given duration.
		 *  @param {Float32Array} values
		 *  @param {Time} startTime
		 *  @param {Time} duration
		 *  @param {NormalRange} [scaling=1] If the values in the curve should be scaled by some value
		 *  @returns {Tone.Signal} this
		 */Tone.TransportTimelineSignal.prototype.setValueCurveAtTime=function(values,startTime,duration,scaling){startTime=Tone.TransportTime(startTime);duration=Tone.TransportTime(duration);Tone.Signal.prototype.setValueCurveAtTime.call(this,values,startTime,duration,scaling);return this;};/**
		 *  This is similar to [cancelScheduledValues](#cancelScheduledValues) except
		 *  it holds the automated value at time until the next automated event.
		 *  @param  {Time} time
		 *  @returns {Tone.TransportTimelineSignal} this
		 */Tone.TransportTimelineSignal.prototype.cancelAndHoldAtTime=function(time){return Tone.Signal.prototype.cancelAndHoldAtTime.call(this,Tone.TransportTime(time));};/**
		 * Dispose and disconnect
		 * @return {Tone.TransportTimelineSignal} this
		 */Tone.TransportTimelineSignal.prototype.dispose=function(){Tone.Transport.clear(this._synced);Tone.Transport.off('start stop pause',this._syncedCallback);this._events.cancel(0);Tone.Signal.prototype.dispose.call(this);this._outputSig.dispose();this._outputSig=null;};return Tone.TransportTimelineSignal;});Module(function(Tone){/**
		 * @class Tone.GrainPlayer implements [granular synthesis](https://en.wikipedia.org/wiki/Granular_synthesis).
		 *        Granular Synthesis enables you to adjust pitch and playback rate independently. The grainSize is the
		 *        amount of time each small chunk of audio is played for and the overlap is the
		 *        amount of crossfading transition time between successive grains.
		 * @extends {Tone.Source}
		 * @param {String|Tone.Buffer} url	The url to load, or the Tone.Buffer to play.
		 * @param {Function=} callback The callback to invoke after the url is loaded.
		 */Tone.GrainPlayer=function(){var options=Tone.defaults(arguments,['url','onload'],Tone.GrainPlayer);Tone.Source.call(this,options);/**
			 *  The audio buffer belonging to the player.
			 *  @type  {Tone.Buffer}
			 */this.buffer=new Tone.Buffer(options.url,options.onload);/**
			 *  Create a repeating tick to schedule
			 *  the grains.
			 *  @type  {Tone.Clock}
			 *  @private
			 */this._clock=new Tone.Clock(this._tick.bind(this),options.grainSize);/**
			 *  @type  {Number}
			 *  @private
			 */this._loopStart=0;/**
			 *  @type  {Number}
			 *  @private
			 */this._loopEnd=0;/**
			 * All of the currently playing BufferSources
			 * @type {Array}
			 * @private
			 */this._activeSources=[];/**
			 *  @type  {Number}
			 *  @private
			 */this._playbackRate=options.playbackRate;/**
			 *  @type  {Number}
			 *  @private
			 */this._grainSize=options.grainSize;/**
			 *  @private
			 *  @type {Number}
			 */this._overlap=options.overlap;/**
			 *  Adjust the pitch independently of the playbackRate.
			 *  @type  {Cents}
			 */this.detune=options.detune;//setup
this.overlap=options.overlap;this.loop=options.loop;this.playbackRate=options.playbackRate;this.grainSize=options.grainSize;this.loopStart=options.loopStart;this.loopEnd=options.loopEnd;this.reverse=options.reverse;this._clock.on('stop',this._onstop.bind(this));};Tone.extend(Tone.GrainPlayer,Tone.Source);/**
		 *  the default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.GrainPlayer.defaults={'onload':Tone.noOp,'overlap':0.1,'grainSize':0.2,'playbackRate':1,'detune':0,'loop':false,'loopStart':0,'loopEnd':0,'reverse':false};/**
		 *  Play the buffer at the given startTime. Optionally add an offset
		 *  and/or duration which will play the buffer from a position
		 *  within the buffer for the given duration.
		 *
		 *  @param  {Time} [startTime=now] When the player should start.
		 *  @param  {Time} [offset=0] The offset from the beginning of the sample
		 *                                 to start at.
		 *  @param  {Time=} duration How long the sample should play. If no duration
		 *                                is given, it will default to the full length
		 *                                of the sample (minus any offset)
		 *  @returns {Tone.GrainPlayer} this
		 *  @memberOf Tone.GrainPlayer#
		 *  @method start
		 *  @name start
		 *//**
		 *  Internal start method
		 *  @param {Time} time
		 *  @param {Time} offset
		 *  @private
		 */Tone.GrainPlayer.prototype._start=function(time,offset,duration){offset=Tone.defaultArg(offset,0);offset=this.toSeconds(offset);time=this.toSeconds(time);this._offset=offset;this._clock.start(time);if(duration){this.stop(time+this.toSeconds(duration));}};/**
		 *  Internal start method
		 *  @param {Time} time
		 *  @private
		 */Tone.GrainPlayer.prototype._stop=function(time){this._clock.stop(time);};/**
		 * Invoked when the clock is stopped
		 * @param  {Number} time
		 * @private
		 */Tone.GrainPlayer.prototype._onstop=function(time){//stop the players
this._activeSources.forEach(function(source){source.stop(time,0);});};/**
		 *  Invoked on each clock tick. scheduled a new
		 *  grain at this time.
		 *  @param  {Time}  time
		 *  @private
		 */Tone.GrainPlayer.prototype._tick=function(time){var fadeIn=this._offset<this._overlap?0:this._overlap;var source=new Tone.BufferSource({'buffer':this.buffer,'fadeIn':fadeIn,'fadeOut':this._overlap,'loop':this.loop,'loopStart':this._loopStart,'loopEnd':this._loopEnd,'playbackRate':Tone.intervalToFrequencyRatio(this.detune/100)}).connect(this.output);source.start(time,this._offset);this._offset+=this.grainSize;source.stop(time+this.grainSize);//add it to the active sources
this._activeSources.push(source);//remove it when it's done
source.onended=function(){var index=this._activeSources.indexOf(source);if(index!==-1){this._activeSources.splice(index,1);}}.bind(this);};/**
		 *  Jump to a specific time and play it.
		 *  @param  {Time}  offset  The offset to jump to.
		 *  @param {Time=} time When to make the jump.
		 *  @return  {Tone.GrainPlayer}  this
		 */Tone.GrainPlayer.prototype.seek=function(offset,time){this._offset=this.toSeconds(offset);this._tick(this.toSeconds(time));return this;};/**
		 * The playback rate of the sample
		 * @memberOf Tone.GrainPlayer#
		 * @type {Positive}
		 * @name playbackRate
		 */Object.defineProperty(Tone.GrainPlayer.prototype,'playbackRate',{get:function get(){return this._playbackRate;},set:function set(rate){this._playbackRate=rate;this.grainSize=this._grainSize;}});/**
		 * The loop start time.
		 * @memberOf Tone.GrainPlayer#
		 * @type {Time}
		 * @name loopStart
		 */Object.defineProperty(Tone.GrainPlayer.prototype,'loopStart',{get:function get(){return this._loopStart;},set:function set(time){this._loopStart=this.toSeconds(time);}});/**
		 * The loop end time.
		 * @memberOf Tone.GrainPlayer#
		 * @type {Time}
		 * @name loopEnd
		 */Object.defineProperty(Tone.GrainPlayer.prototype,'loopEnd',{get:function get(){return this._loopEnd;},set:function set(time){this._loopEnd=this.toSeconds(time);}});/**
		 * The direction the buffer should play in
		 * @memberOf Tone.GrainPlayer#
		 * @type {boolean}
		 * @name reverse
		 */Object.defineProperty(Tone.GrainPlayer.prototype,'reverse',{get:function get(){return this.buffer.reverse;},set:function set(rev){this.buffer.reverse=rev;}});/**
		 * The size of each chunk of audio that the
		 * buffer is chopped into and played back at.
		 * @memberOf Tone.GrainPlayer#
		 * @type {Time}
		 * @name grainSize
		 */Object.defineProperty(Tone.GrainPlayer.prototype,'grainSize',{get:function get(){return this._grainSize;},set:function set(size){this._grainSize=this.toSeconds(size);this._clock.frequency.value=this._playbackRate/this._grainSize;}});/**
		 * This is the duration of the cross-fade between
		 * sucessive grains.
		 * @memberOf Tone.GrainPlayer#
		 * @type {Time}
		 * @name overlap
		 */Object.defineProperty(Tone.GrainPlayer.prototype,'overlap',{get:function get(){return this._overlap;},set:function set(time){this._overlap=this.toSeconds(time);}});/**
		 * Clean up
		 * @return {Tone.GrainPlayer} this
		 */Tone.GrainPlayer.prototype.dispose=function(){Tone.Source.prototype.dispose.call(this);this.buffer.dispose();this.buffer=null;this._clock.dispose();this._clock=null;this._activeSources.forEach(function(source){source.dispose();});this._activeSources=null;return this;};return Tone.GrainPlayer;});Module(function(Tone){/**
		 *  @class  Tone.Player is an audio file player with start, loop, and stop functions.
		 *
		 *  @constructor
		 *  @extends {Tone.Source}
		 *  @param {string|AudioBuffer} url Either the AudioBuffer or the url from
		 *                                  which to load the AudioBuffer
		 *  @param {Function=} onload The function to invoke when the buffer is loaded.
		 *                            Recommended to use Tone.Buffer.on('load') instead.
		 *  @example
		 * var player = new Tone.Player("./path/to/sample.mp3").toMaster();
		 * //play as soon as the buffer is loaded
		 * player.autostart = true;
		 */Tone.Player=function(url){var options;if(url instanceof Tone.Buffer&&url.loaded){url=url.get();options=Tone.Player.defaults;}else{options=Tone.defaults(arguments,['url','onload'],Tone.Player);}Tone.Source.call(this,options);/**
			 *  If the file should play as soon
			 *  as the buffer is loaded.
			 *  @type {Boolean}
			 *  @example
			 * //will play as soon as it's loaded
			 * var player = new Tone.Player({
			 * 	"url" : "./path/to/sample.mp3",
			 * 	"autostart" : true,
			 * }).toMaster();
			 */this.autostart=options.autostart;/**
			 *  the buffer
			 *  @private
			 *  @type {Tone.Buffer}
			 */this._buffer=new Tone.Buffer({'url':options.url,'onload':this._onload.bind(this,options.onload),'reverse':options.reverse});if(url instanceof AudioBuffer){this._buffer.set(url);}/**
			 *  if the buffer should loop once it's over
			 *  @type {Boolean}
			 *  @private
			 */this._loop=options.loop;/**
			 *  if 'loop' is true, the loop will start at this position
			 *  @type {Time}
			 *  @private
			 */this._loopStart=options.loopStart;/**
			 *  if 'loop' is true, the loop will end at this position
			 *  @type {Time}
			 *  @private
			 */this._loopEnd=options.loopEnd;/**
			 *  the playback rate
			 *  @private
			 *  @type {Number}
			 */this._playbackRate=options.playbackRate;/**
			 *  All of the active buffer source nodes
			 *  @type {Array<Tone.BufferSource>}
			 *  @private
			 */this._activeSources=[];/**
			 *  The elapsed time counter.
			 *  @type {Tone.TickSource}
			 *  @private
			 */this._elapsedTime=new Tone.TickSource(options.playbackRate);/**
			 *  The fadeIn time of the amplitude envelope.
			 *  @type {Time}
			 */this.fadeIn=options.fadeIn;/**
			 *  The fadeOut time of the amplitude envelope.
			 *  @type {Time}
			 */this.fadeOut=options.fadeOut;};Tone.extend(Tone.Player,Tone.Source);/**
		 *  the default parameters
		 *  @static
		 *  @const
		 *  @type {Object}
		 */Tone.Player.defaults={'onload':Tone.noOp,'playbackRate':1,'loop':false,'autostart':false,'loopStart':0,'loopEnd':0,'retrigger':false,'reverse':false,'fadeIn':0,'fadeOut':0};/**
		 *  Load the audio file as an audio buffer.
		 *  Decodes the audio asynchronously and invokes
		 *  the callback once the audio buffer loads.
		 *  Note: this does not need to be called if a url
		 *  was passed in to the constructor. Only use this
		 *  if you want to manually load a new url.
		 * @param {string} url The url of the buffer to load.
		 *                     Filetype support depends on the
		 *                     browser.
		 *  @param  {Function=} callback The function to invoke once
		 *                               the sample is loaded.
		 *  @returns {Promise}
		 */Tone.Player.prototype.load=function(url,callback){return this._buffer.load(url,this._onload.bind(this,callback));};/**
		 * Internal callback when the buffer is loaded.
		 * @private
		 */Tone.Player.prototype._onload=function(callback){callback=Tone.defaultArg(callback,Tone.noOp);callback(this);if(this.autostart){this.start();}};/**
		 * Internal callback when the buffer is done playing.
		 * @private
		 */Tone.Player.prototype._onSourceEnd=function(source){var index=this._activeSources.indexOf(source);this._activeSources.splice(index,1);};/**
		 *  Play the buffer at the given startTime. Optionally add an offset
		 *  and/or duration which will play the buffer from a position
		 *  within the buffer for the given duration.
		 *
		 *  @param  {Time} [startTime=now] When the player should start.
		 *  @param  {Time} [offset=0] The offset from the beginning of the sample
		 *                                 to start at.
		 *  @param  {Time=} duration How long the sample should play. If no duration
		 *                                is given, it will default to the full length
		 *                                of the sample (minus any offset)
		 *  @returns {Tone.Player} this
		 *  @memberOf Tone.Player#
		 *  @method start
		 *  @name start
		 *//**
		 *  Internal start method
		 *  @private
		 */Tone.Player.prototype._start=function(startTime,offset,duration){//if it's a loop the default offset is the loopstart point
if(this._loop){offset=Tone.defaultArg(offset,this._loopStart);}else{//otherwise the default offset is 0
offset=Tone.defaultArg(offset,0);}//compute the values in seconds
offset=this.toSeconds(offset);var computedDuration=Tone.defaultArg(duration,Math.max(this._buffer.duration-offset,0));computedDuration=this.toSeconds(computedDuration);startTime=this.toSeconds(startTime);//start the elapsed time counter
this._elapsedTime.start(startTime,offset);//make the source
var source=new Tone.BufferSource({'buffer':this._buffer,'loop':this._loop,'loopStart':this._loopStart,'loopEnd':this._loopEnd,'onended':this._onSourceEnd.bind(this),'playbackRate':this._playbackRate,'fadeIn':this.fadeIn,'fadeOut':this.fadeOut}).connect(this.output);//set the looping properties
if(!this._loop&&!this._synced){//if it's not looping, set the state change at the end of the sample
this._state.setStateAtTime(Tone.State.Stopped,startTime+computedDuration/this._playbackRate);}//add it to the array of active sources
this._activeSources.push(source);//start it
if(this._loop&&Tone.isUndef(duration)){source.start(startTime,offset);}else{source.start(startTime,offset,computedDuration);}return this;};/**
		 *  Stop playback.
		 *  @private
		 *  @param  {Time} [time=now]
		 *  @returns {Tone.Player} this
		 */Tone.Player.prototype._stop=function(time){time=this.toSeconds(time);this._elapsedTime.stop(time);this._activeSources.forEach(function(source){source.stop(time);});return this;};/**
		 * Stop and then restart the player from the beginning (or offset)
		 *  @param  {Time} [startTime=now] When the player should start.
		 *  @param  {Time} [offset=0] The offset from the beginning of the sample
		 *                                 to start at.
		 *  @param  {Time=} duration How long the sample should play. If no duration
		 *                                is given, it will default to the full length
		 *                                of the sample (minus any offset)
		 *  @returns {Tone.Player} this
		 */Tone.Player.prototype.restart=function(time,offset,duration){this._stop(time);this._start(time,offset,duration);return this;};/**
		 *  Seek to a specific time in the player's buffer. If the
		 *  source is no longer playing at that time, it will stop.
		 *  If you seek to a time that
		 *  @param {Time} offset The time to seek to.
		 *  @param {Time=} time The time for the seek event to occur.
		 *  @return {Tone.Player} this
		 *  @example
		 * source.start(0.2);
		 * source.stop(0.4);
		 */Tone.Player.prototype.seek=function(offset,time){time=this.toSeconds(time);if(this._state.getValueAtTime(time)===Tone.State.Started){offset=this.toSeconds(offset);// if it's currently playing, stop it
this._stop(time);//restart it at the given time
this._start(time,offset);}return this;};/**
		 *  Set the loop start and end. Will only loop if loop is
		 *  set to true.
		 *  @param {Time} loopStart The loop end time
		 *  @param {Time} loopEnd The loop end time
		 *  @returns {Tone.Player} this
		 *  @example
		 * //loop 0.1 seconds of the file.
		 * player.setLoopPoints(0.2, 0.3);
		 * player.loop = true;
		 */Tone.Player.prototype.setLoopPoints=function(loopStart,loopEnd){this.loopStart=loopStart;this.loopEnd=loopEnd;return this;};/**
		 * If loop is true, the loop will start at this position.
		 * @memberOf Tone.Player#
		 * @type {Time}
		 * @name loopStart
		 */Object.defineProperty(Tone.Player.prototype,'loopStart',{get:function get(){return this._loopStart;},set:function set(loopStart){this._loopStart=loopStart;//get the current source
this._activeSources.forEach(function(source){source.loopStart=loopStart;});}});/**
		 * If loop is true, the loop will end at this position.
		 * @memberOf Tone.Player#
		 * @type {Time}
		 * @name loopEnd
		 */Object.defineProperty(Tone.Player.prototype,'loopEnd',{get:function get(){return this._loopEnd;},set:function set(loopEnd){this._loopEnd=loopEnd;//get the current source
this._activeSources.forEach(function(source){source.loopEnd=loopEnd;});}});/**
		 * The audio buffer belonging to the player.
		 * @memberOf Tone.Player#
		 * @type {Tone.Buffer}
		 * @name buffer
		 */Object.defineProperty(Tone.Player.prototype,'buffer',{get:function get(){return this._buffer;},set:function set(buffer){this._buffer.set(buffer);}});/**
		 * If the buffer should loop once it's over.
		 * @memberOf Tone.Player#
		 * @type {Boolean}
		 * @name loop
		 */Object.defineProperty(Tone.Player.prototype,'loop',{get:function get(){return this._loop;},set:function set(loop){//if no change, do nothing
if(this._loop===loop){return;}this._loop=loop;var now=this.now();if(!loop){//stop the playback on the next cycle
this._stopAtNextIteration(now);}else{//remove the next stopEvent
var stopEvent=this._state.getNextState(Tone.State.Stopped,now);if(stopEvent){this._activeSources.forEach(function(source){source.loop=loop;});this._state.cancel(stopEvent.time);this._elapsedTime.cancel(stopEvent.time);}}}});/**
		 *  Schedules a stop event at the next full iteration. Used
		 *  for scheduling stop when the loop state or playbackRate changes
		 *  @param  {Number}  now  The current time
		 *  @private
		 */Tone.Player.prototype._stopAtNextIteration=function(now){if(this._state.getValueAtTime(now)===Tone.State.Started){var nextStop=this._state.getNextState(Tone.State.Stopped,now);var position=this._elapsedTime.getTicksAtTime(now);var iterations=Math.max(Math.ceil(position/this.buffer.duration),1);var stopTime=this._elapsedTime.getTimeOfTick(iterations*this.buffer.duration,nextStop?nextStop.time-this.sampleTime:Infinity);this.stop(stopTime);}};/**
		 * The playback speed. 1 is normal speed. This is not a signal because
		 * Safari and iOS currently don't support playbackRate as a signal.
		 * @memberOf Tone.Player#
		 * @type {Number}
		 * @name playbackRate
		 */Object.defineProperty(Tone.Player.prototype,'playbackRate',{get:function get(){return this._playbackRate;},set:function set(rate){this._playbackRate=rate;var now=this.now();this._elapsedTime.frequency.setValueAtTime(rate,now);//if it's not looping
if(!this._loop){this._stopAtNextIteration(now);}//set all the sources
this._activeSources.forEach(function(source){source.playbackRate.setValueAtTime(rate,now);});}});/**
		 * The current playback position of the buffer. 
		 * @memberOf Tone.Player#
		 * @type {Number}
		 * @name position
		 */Object.defineProperty(Tone.Player.prototype,'position',{get:function get(){var now=this.now();if(this._state.getValueAtTime(now)===Tone.State.Started&&this.loaded){var duration=this.buffer.duration;var position=this._elapsedTime.getTicksAtTime(now);return position%duration;}else{return 0;}}});/**
		 * The direction the buffer should play in
		 * @memberOf Tone.Player#
		 * @type {Boolean}
		 * @name reverse
		 */Object.defineProperty(Tone.Player.prototype,'reverse',{get:function get(){return this._buffer.reverse;},set:function set(rev){this._buffer.reverse=rev;}});/**
		 * If all the buffer is loaded
		 * @memberOf Tone.Player#
		 * @type {Boolean}
		 * @name loaded
		 * @readOnly
		 */Object.defineProperty(Tone.Player.prototype,'loaded',{get:function get(){return this._buffer.loaded;}});/**
		 *  Dispose and disconnect.
		 *  @return {Tone.Player} this
		 */Tone.Player.prototype.dispose=function(){//disconnect all of the players
this._activeSources.forEach(function(source){source.dispose();});this._activeSources=null;Tone.Source.prototype.dispose.call(this);this._buffer.dispose();this._buffer=null;this._elapsedTime.dispose();this._elapsedTime=null;return this;};return Tone.Player;});Module(function(Tone){/**
		 *  @class  Tone.Players combines multiple [Tone.Player](Player) objects.
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @param {Object} urls An object mapping a name to a url.
		 *  @param {function=} onload The function to invoke when all buffers are loaded.
		 */Tone.Players=function(urls){var args=Array.prototype.slice.call(arguments);args.shift();var options=Tone.defaults(args,['onload'],Tone.Players);Tone.call(this);/**
			 *  The output volume node
			 *  @type  {Tone.Volume}
			 *  @private
			 */this._volume=this.output=new Tone.Volume(options.volume);/**
			 * The volume of the output in decibels.
			 * @type {Decibels}
			 * @signal
			 * @example
			 * source.volume.value = -6;
			 */this.volume=this._volume.volume;this._readOnly('volume');//make the output explicitly stereo
this._volume.output.output.channelCount=2;this._volume.output.output.channelCountMode='explicit';//mute initially
this.mute=options.mute;/**
			 * The container of all of the players
			 * @type {Object}
			 * @private
			 */this._players={};/**
			 * The loading count
			 * @type {Number}
			 * @private
			 */this._loadingCount=0;/**
			 * private holder of the fadeIn time
			 * @type {Time}
			 * @private
			 */this._fadeIn=options.fadeIn;/**
			 * private holder of the fadeOut time
			 * @type {Time}
			 * @private
			 */this._fadeOut=options.fadeOut;//add all of the players
for(var name in urls){this._loadingCount++;this.add(name,urls[name],this._bufferLoaded.bind(this,options.onload));}};Tone.extend(Tone.Players,Tone.AudioNode);/**
		 * The default values
		 * @type {Object}
		 */Tone.Players.defaults={'volume':0,'mute':false,'onload':Tone.noOp,'fadeIn':0,'fadeOut':0};/**
		 *  A buffer was loaded. decrement the counter.
		 *  @param  {Function}  callback
		 *  @private
		 */Tone.Players.prototype._bufferLoaded=function(callback){this._loadingCount--;if(this._loadingCount===0&&callback){callback(this);}};/**
		 * Mute the output.
		 * @memberOf Tone.Source#
		 * @type {boolean}
		 * @name mute
		 * @example
		 * //mute the output
		 * source.mute = true;
		 */Object.defineProperty(Tone.Players.prototype,'mute',{get:function get(){return this._volume.mute;},set:function set(mute){this._volume.mute=mute;}});/**
		 * The fadeIn time of the amplitude envelope.
		 * @memberOf Tone.Source#
		 * @type {Time}
		 * @name fadeIn
		 */Object.defineProperty(Tone.Players.prototype,'fadeIn',{get:function get(){return this._fadeIn;},set:function set(fadeIn){this._fadeIn=fadeIn;this._forEach(function(player){player.fadeIn=fadeIn;});}});/**
		 * The fadeOut time of the amplitude envelope.
		 * @memberOf Tone.Source#
		 * @type {Time}
		 * @name fadeOut
		 */Object.defineProperty(Tone.Players.prototype,'fadeOut',{get:function get(){return this._fadeOut;},set:function set(fadeOut){this._fadeOut=fadeOut;this._forEach(function(player){player.fadeOut=fadeOut;});}});/**
		 * The state of the players object. Returns "started" if any of the players are playing.
		 * @memberOf Tone.Players#
		 * @type {String}
		 * @name state
		 * @readOnly
		 */Object.defineProperty(Tone.Players.prototype,'state',{get:function get(){var playing=false;this._forEach(function(player){playing=playing||player.state===Tone.State.Started;});return playing?Tone.State.Started:Tone.State.Stopped;}});/**
		 *  True if the buffers object has a buffer by that name.
		 *  @param  {String|Number}  name  The key or index of the
		 *                                 buffer.
		 *  @return  {Boolean}
		 */Tone.Players.prototype.has=function(name){return this._players.hasOwnProperty(name);};/**
		 *  Get a player by name.
		 *  @param  {String}  name  The players name as defined in
		 *                          the constructor object or `add` method.
		 *  @return  {Tone.Player}
		 */Tone.Players.prototype.get=function(name){if(this.has(name)){return this._players[name];}else{throw new Error('Tone.Players: no player named '+name);}};/**
		 * Iterate over all of the players
		 * @param  {Function} callback
		 * @return {Tone.Players}            this
		 * @private
		 */Tone.Players.prototype._forEach=function(callback){for(var playerName in this._players){callback(this._players[playerName],playerName);}return this;};/**
		 * If all the buffers are loaded or not
		 * @memberOf Tone.Players#
		 * @type {Boolean}
		 * @name loaded
		 * @readOnly
		 */Object.defineProperty(Tone.Players.prototype,'loaded',{get:function get(){var isLoaded=true;this._forEach(function(player){isLoaded=isLoaded&&player.loaded;});return isLoaded;}});/**
		 *  Add a player by name and url to the Players
		 *  @param  {String}    name      A unique name to give the player
		 *  @param  {String|Tone.Buffer|Audiobuffer}  url  Either the url of the bufer,
		 *                                                 or a buffer which will be added
		 *                                                 with the given name.
		 *  @param  {Function=}  callback  The callback to invoke
		 *                                 when the url is loaded.
		 */Tone.Players.prototype.add=function(name,url,callback){this._players[name]=new Tone.Player(url,callback).connect(this.output);this._players[name].fadeIn=this._fadeIn;this._players[name].fadeOut=this._fadeOut;return this;};/**
		 * Stop all of the players at the given time
		 * @param {Time} time The time to stop all of the players.
		 * @return {Tone.Players} this
		 */Tone.Players.prototype.stopAll=function(time){this._forEach(function(player){player.stop(time);});};/**
		 *  Dispose and disconnect.
		 *  @return {Tone.Players} this
		 */Tone.Players.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this._volume.dispose();this._volume=null;this._writable('volume');this.volume=null;this.output=null;this._forEach(function(player){player.dispose();});this._players=null;return this;};return Tone.Players;});Module(function(Tone){/**
		 *  @class  Tone.UserMedia uses MediaDevices.getUserMedia to open up
		 *          and external microphone or audio input. Check
		 *          [MediaDevices API Support](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
		 *          to see which browsers are supported. Access to an external input
		 *          is limited to secure (HTTPS) connections.
		 *
		 *  @constructor
		 *  @extends {Tone.AudioNode}
		 *  @param {Decibels=} volume The level of the input
		 *  @example
		 * //list the inputs and open the third one
		 * var motu = new Tone.UserMedia();
		 *
		 * //opening the input asks the user to activate their mic
		 * motu.open().then(function(){
		 * 	//promise resolves when input is available
		 * });
		 */Tone.UserMedia=function(){var options=Tone.defaults(arguments,['volume'],Tone.UserMedia);Tone.AudioNode.call(this);/**
			 *  The MediaStreamNode
			 *  @type {MediaStreamAudioSourceNode}
			 *  @private
			 */this._mediaStream=null;/**
			 *  The media stream created by getUserMedia.
			 *  @type {LocalMediaStream}
			 *  @private
			 */this._stream=null;/**
			 *  The open device
			 *  @type  {MediaDeviceInfo}
			 *  @private
			 */this._device=null;/**
			 *  The output volume node
			 *  @type  {Tone.Volume}
			 *  @private
			 */this._volume=this.output=new Tone.Volume(options.volume);/**
			 * The volume of the output in decibels.
			 * @type {Decibels}
			 * @signal
			 * @example
			 * input.volume.value = -6;
			 */this.volume=this._volume.volume;this._readOnly('volume');this.mute=options.mute;};Tone.extend(Tone.UserMedia,Tone.AudioNode);/**
		 * the default parameters
		 * @type {Object}
		 */Tone.UserMedia.defaults={'volume':0,'mute':false};/**
		 *  Open the media stream. If a string is passed in, it is assumed
		 *  to be the label or id of the stream, if a number is passed in,
		 *  it is the input number of the stream.
		 *  @param  {String|Number} [labelOrId="default"] The label or id of the audio input media device.
		 *                                                With no argument, the default stream is opened.
		 *  @return {Promise} The promise is resolved when the stream is open.
		 */Tone.UserMedia.prototype.open=function(labelOrId){return Tone.UserMedia.enumerateDevices().then(function(devices){var device;if(Tone.isNumber(labelOrId)){device=devices[labelOrId];}else{device=devices.find(function(device){return device.label===labelOrId||device.deviceId===labelOrId;});//didn't find a matching device
if(!device&&devices.length>0){device=devices[0];}else if(!device&&Tone.isDefined(labelOrId)){throw new Error('Tone.UserMedia: no matching device: '+labelOrId);}}this._device=device;//do getUserMedia
var constraints={audio:{'echoCancellation':false,'sampleRate':this.context.sampleRate}};if(device){constraints.audio.deviceId=device.deviceId;}return navigator.mediaDevices.getUserMedia(constraints).then(function(stream){//start a new source only if the previous one is closed
if(!this._stream){this._stream=stream;//Wrap a MediaStreamSourceNode around the live input stream.
this._mediaStream=this.context.createMediaStreamSource(stream);//Connect the MediaStreamSourceNode to a gate gain node
this._mediaStream.connect(this.output);}return this;}.bind(this));}.bind(this));};/**
		 *  Close the media stream
		 *  @return {Tone.UserMedia} this
		 */Tone.UserMedia.prototype.close=function(){if(this._stream){this._stream.getAudioTracks().forEach(function(track){track.stop();});this._stream=null;//remove the old media stream
this._mediaStream.disconnect();this._mediaStream=null;}this._device=null;return this;};/**
		 *  Returns a promise which resolves with the list of audio input devices available.
		 *  @return {Promise} The promise that is resolved with the devices
		 *  @static
		 *  @example
		 * Tone.UserMedia.enumerateDevices().then(function(devices){
		 * 	console.log(devices)
		 * })
		 */Tone.UserMedia.enumerateDevices=function(){return navigator.mediaDevices.enumerateDevices().then(function(devices){return devices.filter(function(device){return device.kind==='audioinput';});});};/**
		 *  Returns the playback state of the source, "started" when the microphone is open
		 *  and "stopped" when the mic is closed.
		 *  @type {Tone.State}
		 *  @readOnly
		 *  @memberOf Tone.UserMedia#
		 *  @name state
		 */Object.defineProperty(Tone.UserMedia.prototype,'state',{get:function get(){return this._stream&&this._stream.active?Tone.State.Started:Tone.State.Stopped;}});/**
		 * 	Returns an identifier for the represented device that is
		 * 	persisted across sessions. It is un-guessable by other applications and
		 * 	unique to the origin of the calling application. It is reset when the
		 * 	user clears cookies (for Private Browsing, a different identifier is
		 * 	used that is not persisted across sessions). Returns undefined when the
		 * 	device is not open.
		 *  @type {String}
		 *  @readOnly
		 *  @memberOf Tone.UserMedia#
		 *  @name deviceId
		 */Object.defineProperty(Tone.UserMedia.prototype,'deviceId',{get:function get(){if(this._device){return this._device.deviceId;}}});/**
		 * 	Returns a group identifier. Two devices have the
		 * 	same group identifier if they belong to the same physical device.
		 * 	Returns undefined when the device is not open.
		 *  @type {String}
		 *  @readOnly
		 *  @memberOf Tone.UserMedia#
		 *  @name groupId
		 */Object.defineProperty(Tone.UserMedia.prototype,'groupId',{get:function get(){if(this._device){return this._device.groupId;}}});/**
		 * 	Returns a label describing this device (for example "Built-in Microphone").
		 * 	Returns undefined when the device is not open or label is not available
		 * 	because of permissions.
		 *  @type {String}
		 *  @readOnly
		 *  @memberOf Tone.UserMedia#
		 *  @name groupId
		 */Object.defineProperty(Tone.UserMedia.prototype,'label',{get:function get(){if(this._device){return this._device.label;}}});/**
		 * Mute the output.
		 * @memberOf Tone.UserMedia#
		 * @type {boolean}
		 * @name mute
		 * @example
		 * //mute the output
		 * userMedia.mute = true;
		 */Object.defineProperty(Tone.UserMedia.prototype,'mute',{get:function get(){return this._volume.mute;},set:function set(mute){this._volume.mute=mute;}});/**
		 * Clean up.
		 * @return {Tone.UserMedia} this
		 */Tone.UserMedia.prototype.dispose=function(){Tone.AudioNode.prototype.dispose.call(this);this.close();this._writable('volume');this._volume.dispose();this._volume=null;this.volume=null;return this;};/**
		 *  If getUserMedia is supported by the browser.
		 *  @type  {Boolean}
		 *  @memberOf Tone.UserMedia#
		 *  @name supported
		 *  @static
		 *  @readOnly
		 */Object.defineProperty(Tone.UserMedia,'supported',{get:function get(){return Tone.isDefined(navigator.mediaDevices)&&Tone.isFunction(navigator.mediaDevices.getUserMedia);}});return Tone.UserMedia;});Module(function(Tone){/**
		 *  @class Tone.Midi is a primitive type for encoding Time values.
		 *         Tone.Midi can be constructed with or without the `new` keyword. Tone.Midi can be passed
		 *         into the parameter of any method which takes time as an argument.
		 *  @constructor
		 *  @extends {Tone.Frequency}
		 *  @param  {String|Number}  val    The time value.
		 *  @param  {String=}  units  The units of the value.
		 *  @example
		 * var t = Tone.Midi("4n");//a quarter note
		 */Tone.Midi=function(val,units){if(this instanceof Tone.Midi){Tone.Frequency.call(this,val,units);}else{return new Tone.Midi(val,units);}};Tone.extend(Tone.Midi,Tone.Frequency);/**
		 *  The default units if none are given.
		 *  @type {String}
		 *  @private
		 */Tone.Midi.prototype._defaultUnits='midi';/**
		 *  Returns the value of a frequency in the current units
		 *  @param {Frequency} freq
		 *  @return  {Number}
		 *  @private
		 */Tone.Midi.prototype._frequencyToUnits=function(freq){return Tone.Frequency.ftom(Tone.Frequency.prototype._frequencyToUnits.call(this,freq));};/**
		 *  Returns the value of a tick in the current time units
		 *  @param {Ticks} ticks
		 *  @return  {Number}
		 *  @private
		 */Tone.Midi.prototype._ticksToUnits=function(ticks){return Tone.Frequency.ftom(Tone.Frequency.prototype._ticksToUnits.call(this,ticks));};/**
		 *  Return the value of the beats in the current units
		 *  @param {Number} beats
		 *  @return  {Number}
		 *  @private
		 */Tone.Midi.prototype._beatsToUnits=function(beats){return Tone.Frequency.ftom(Tone.Frequency.prototype._beatsToUnits.call(this,beats));};/**
		 *  Returns the value of a second in the current units
		 *  @param {Seconds} seconds
		 *  @return  {Number}
		 *  @private
		 */Tone.Midi.prototype._secondsToUnits=function(seconds){return Tone.Frequency.ftom(Tone.Frequency.prototype._secondsToUnits.call(this,seconds));};/**
		 *  Return the value of the frequency as a MIDI note
		 *  @return  {MIDI}
		 *  @example
		 * Tone.Midi(60).toMidi(); //60
		 */Tone.Midi.prototype.toMidi=function(){return this.valueOf();};/**
		 *  Return the value of the frequency as a MIDI note
		 *  @return  {MIDI}
		 *  @example
		 * Tone.Midi(60).toMidi(); //60
		 */Tone.Midi.prototype.toFrequency=function(){return Tone.Frequency.mtof(this.toMidi());};/**
		 *  Transposes the frequency by the given number of semitones.
		 *  @param  {Interval}  interval
		 *  @return  {Tone.Frequency} A new transposed frequency
		 *  @example
		 * Tone.Frequency("A4").transpose(3); //"C5"
		 */Tone.Midi.prototype.transpose=function(interval){return new this.constructor(this.toMidi()+interval);};return Tone.Midi;});return Tone;});},{}],2:[function(require,module,exports){/*!
 * jQuery JavaScript Library v3.3.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2018-01-20T17:24Z
 */(function(global,factory){"use strict";if((typeof module==="undefined"?"undefined":_typeof(module))==="object"&&_typeof(module.exports)==="object"){// For CommonJS and CommonJS-like environments where a proper `window`
// is present, execute the factory and get jQuery.
// For environments that do not have a `window` with a `document`
// (such as Node.js), expose a factory as module.exports.
// This accentuates the need for the creation of a real `window`.
// e.g. var jQuery = require("jquery")(window);
// See ticket #14549 for more info.
module.exports=global.document?factory(global,true):function(w){if(!w.document){throw new Error("jQuery requires a window with a document");}return factory(w);};}else{factory(global);}// Pass this if window is not defined yet
})(typeof window!=="undefined"?window:this,function(window,noGlobal){// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";var arr=[];var document=window.document;var getProto=Object.getPrototypeOf;var _slice=arr.slice;var concat=arr.concat;var push=arr.push;var indexOf=arr.indexOf;var class2type={};var toString=class2type.toString;var hasOwn=class2type.hasOwnProperty;var fnToString=hasOwn.toString;var ObjectFunctionString=fnToString.call(Object);var support={};var isFunction=function isFunction(obj){// Support: Chrome <=57, Firefox <=52
// In some browsers, typeof returns "function" for HTML <object> elements
// (i.e., `typeof document.createElement( "object" ) === "function"`).
// We don't want to classify *any* DOM node as a function.
return typeof obj==="function"&&typeof obj.nodeType!=="number";};var isWindow=function isWindow(obj){return obj!=null&&obj===obj.window;};var preservedScriptAttributes={type:true,src:true,noModule:true};function DOMEval(code,doc,node){doc=doc||document;var i,script=doc.createElement("script");script.text=code;if(node){for(i in preservedScriptAttributes){if(node[i]){script[i]=node[i];}}}doc.head.appendChild(script).parentNode.removeChild(script);}function toType(obj){if(obj==null){return obj+"";}// Support: Android <=2.3 only (functionish RegExp)
return(typeof obj==="undefined"?"undefined":_typeof(obj))==="object"||typeof obj==="function"?class2type[toString.call(obj)]||"object":typeof obj==="undefined"?"undefined":_typeof(obj);}/* global Symbol */// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module
var version="3.3.1",// Define a local copy of jQuery
jQuery=function jQuery(selector,context){// The jQuery object is actually just the init constructor 'enhanced'
// Need init if jQuery is called (just allow error to be thrown if not included)
return new jQuery.fn.init(selector,context);},// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
rtrim=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;jQuery.fn=jQuery.prototype={// The current version of jQuery being used
jquery:version,constructor:jQuery,// The default length of a jQuery object is 0
length:0,toArray:function toArray(){return _slice.call(this);},// Get the Nth element in the matched element set OR
// Get the whole matched element set as a clean array
get:function get(num){// Return all the elements in a clean array
if(num==null){return _slice.call(this);}// Return just the one element from the set
return num<0?this[num+this.length]:this[num];},// Take an array of elements and push it onto the stack
// (returning the new matched element set)
pushStack:function pushStack(elems){// Build a new jQuery matched element set
var ret=jQuery.merge(this.constructor(),elems);// Add the old object onto the stack (as a reference)
ret.prevObject=this;// Return the newly-formed element set
return ret;},// Execute a callback for every element in the matched set.
each:function each(callback){return jQuery.each(this,callback);},map:function map(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem);}));},slice:function slice(){return this.pushStack(_slice.apply(this,arguments));},first:function first(){return this.eq(0);},last:function last(){return this.eq(-1);},eq:function eq(i){var len=this.length,j=+i+(i<0?len:0);return this.pushStack(j>=0&&j<len?[this[j]]:[]);},end:function end(){return this.prevObject||this.constructor();},// For internal use only.
// Behaves like an Array's method, not like a jQuery method.
push:push,sort:arr.sort,splice:arr.splice};jQuery.extend=jQuery.fn.extend=function(){var options,name,src,copy,copyIsArray,clone,target=arguments[0]||{},i=1,length=arguments.length,deep=false;// Handle a deep copy situation
if(typeof target==="boolean"){deep=target;// Skip the boolean and the target
target=arguments[i]||{};i++;}// Handle case when target is a string or something (possible in deep copy)
if((typeof target==="undefined"?"undefined":_typeof(target))!=="object"&&!isFunction(target)){target={};}// Extend jQuery itself if only one argument is passed
if(i===length){target=this;i--;}for(;i<length;i++){// Only deal with non-null/undefined values
if((options=arguments[i])!=null){// Extend the base object
for(name in options){src=target[name];copy=options[name];// Prevent never-ending loop
if(target===copy){continue;}// Recurse if we're merging plain objects or arrays
if(deep&&copy&&(jQuery.isPlainObject(copy)||(copyIsArray=Array.isArray(copy)))){if(copyIsArray){copyIsArray=false;clone=src&&Array.isArray(src)?src:[];}else{clone=src&&jQuery.isPlainObject(src)?src:{};}// Never move original objects, clone them
target[name]=jQuery.extend(deep,clone,copy);// Don't bring in undefined values
}else if(copy!==undefined){target[name]=copy;}}}}// Return the modified object
return target;};jQuery.extend({// Unique for each copy of jQuery on the page
expando:"jQuery"+(version+Math.random()).replace(/\D/g,""),// Assume jQuery is ready without the ready module
isReady:true,error:function error(msg){throw new Error(msg);},noop:function noop(){},isPlainObject:function isPlainObject(obj){var proto,Ctor;// Detect obvious negatives
// Use toString instead of jQuery.type to catch host objects
if(!obj||toString.call(obj)!=="[object Object]"){return false;}proto=getProto(obj);// Objects with no prototype (e.g., `Object.create( null )`) are plain
if(!proto){return true;}// Objects with prototype are plain iff they were constructed by a global Object function
Ctor=hasOwn.call(proto,"constructor")&&proto.constructor;return typeof Ctor==="function"&&fnToString.call(Ctor)===ObjectFunctionString;},isEmptyObject:function isEmptyObject(obj){/* eslint-disable no-unused-vars */// See https://github.com/eslint/eslint/issues/6125
var name;for(name in obj){return false;}return true;},// Evaluates a script in a global context
globalEval:function globalEval(code){DOMEval(code);},each:function each(obj,callback){var length,i=0;if(isArrayLike(obj)){length=obj.length;for(;i<length;i++){if(callback.call(obj[i],i,obj[i])===false){break;}}}else{for(i in obj){if(callback.call(obj[i],i,obj[i])===false){break;}}}return obj;},// Support: Android <=4.0 only
trim:function trim(text){return text==null?"":(text+"").replace(rtrim,"");},// results is for internal usage only
makeArray:function makeArray(arr,results){var ret=results||[];if(arr!=null){if(isArrayLike(Object(arr))){jQuery.merge(ret,typeof arr==="string"?[arr]:arr);}else{push.call(ret,arr);}}return ret;},inArray:function inArray(elem,arr,i){return arr==null?-1:indexOf.call(arr,elem,i);},// Support: Android <=4.0 only, PhantomJS 1 only
// push.apply(_, arraylike) throws on ancient WebKit
merge:function merge(first,second){var len=+second.length,j=0,i=first.length;for(;j<len;j++){first[i++]=second[j];}first.length=i;return first;},grep:function grep(elems,callback,invert){var callbackInverse,matches=[],i=0,length=elems.length,callbackExpect=!invert;// Go through the array, only saving the items
// that pass the validator function
for(;i<length;i++){callbackInverse=!callback(elems[i],i);if(callbackInverse!==callbackExpect){matches.push(elems[i]);}}return matches;},// arg is for internal usage only
map:function map(elems,callback,arg){var length,value,i=0,ret=[];// Go through the array, translating each of the items to their new values
if(isArrayLike(elems)){length=elems.length;for(;i<length;i++){value=callback(elems[i],i,arg);if(value!=null){ret.push(value);}}// Go through every key on the object,
}else{for(i in elems){value=callback(elems[i],i,arg);if(value!=null){ret.push(value);}}}// Flatten any nested arrays
return concat.apply([],ret);},// A global GUID counter for objects
guid:1,// jQuery.support is not used in Core but other projects attach their
// properties to it so it needs to exist.
support:support});if(typeof Symbol==="function"){jQuery.fn[Symbol.iterator]=arr[Symbol.iterator];}// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(i,name){class2type["[object "+name+"]"]=name.toLowerCase();});function isArrayLike(obj){// Support: real iOS 8.2 only (not reproducible in simulator)
// `in` check used to prevent JIT error (gh-2145)
// hasOwn isn't used here due to false negatives
// regarding Nodelist length in IE
var length=!!obj&&"length"in obj&&obj.length,type=toType(obj);if(isFunction(obj)||isWindow(obj)){return false;}return type==="array"||length===0||typeof length==="number"&&length>0&&length-1 in obj;}var Sizzle=/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */function(window){var i,support,Expr,getText,isXML,tokenize,compile,select,outermostContext,sortInput,hasDuplicate,// Local document vars
setDocument,document,docElem,documentIsHTML,rbuggyQSA,rbuggyMatches,matches,contains,// Instance-specific data
expando="sizzle"+1*new Date(),preferredDoc=window.document,dirruns=0,done=0,classCache=createCache(),tokenCache=createCache(),compilerCache=createCache(),sortOrder=function sortOrder(a,b){if(a===b){hasDuplicate=true;}return 0;},// Instance methods
hasOwn={}.hasOwnProperty,arr=[],pop=arr.pop,push_native=arr.push,push=arr.push,slice=arr.slice,// Use a stripped-down indexOf as it's faster than native
// https://jsperf.com/thor-indexof-vs-for/5
indexOf=function indexOf(list,elem){var i=0,len=list.length;for(;i<len;i++){if(list[i]===elem){return i;}}return-1;},booleans="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",// Regular expressions
// http://www.w3.org/TR/css3-selectors/#whitespace
whitespace="[\\x20\\t\\r\\n\\f]",// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
identifier="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
attributes="\\["+whitespace+"*("+identifier+")(?:"+whitespace+// Operator (capture 2)
"*([*^$|!~]?=)"+whitespace+// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+identifier+"))|)"+whitespace+"*\\]",pseudos=":("+identifier+")(?:\\(("+// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
// 1. quoted (capture 3; capture 4 or capture 5)
"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|"+// 2. simple (capture 6)
"((?:\\\\.|[^\\\\()[\\]]|"+attributes+")*)|"+// 3. anything else (capture 2)
".*"+")\\)|)",// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
rwhitespace=new RegExp(whitespace+"+","g"),rtrim=new RegExp("^"+whitespace+"+|((?:^|[^\\\\])(?:\\\\.)*)"+whitespace+"+$","g"),rcomma=new RegExp("^"+whitespace+"*,"+whitespace+"*"),rcombinators=new RegExp("^"+whitespace+"*([>+~]|"+whitespace+")"+whitespace+"*"),rattributeQuotes=new RegExp("="+whitespace+"*([^\\]'\"]*?)"+whitespace+"*\\]","g"),rpseudo=new RegExp(pseudos),ridentifier=new RegExp("^"+identifier+"$"),matchExpr={"ID":new RegExp("^#("+identifier+")"),"CLASS":new RegExp("^\\.("+identifier+")"),"TAG":new RegExp("^("+identifier+"|[*])"),"ATTR":new RegExp("^"+attributes),"PSEUDO":new RegExp("^"+pseudos),"CHILD":new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+whitespace+"*(even|odd|(([+-]|)(\\d*)n|)"+whitespace+"*(?:([+-]|)"+whitespace+"*(\\d+)|))"+whitespace+"*\\)|)","i"),"bool":new RegExp("^(?:"+booleans+")$","i"),// For use in libraries implementing .is()
// We use this for POS matching in `select`
"needsContext":new RegExp("^"+whitespace+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+whitespace+"*((?:-\\d)?\\d*)"+whitespace+"*\\)|)(?=[^-]|$)","i")},rinputs=/^(?:input|select|textarea|button)$/i,rheader=/^h\d$/i,rnative=/^[^{]+\{\s*\[native \w/,// Easily-parseable/retrievable ID or TAG or CLASS selectors
rquickExpr=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,rsibling=/[+~]/,// CSS escapes
// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
runescape=new RegExp("\\\\([\\da-f]{1,6}"+whitespace+"?|("+whitespace+")|.)","ig"),funescape=function funescape(_,escaped,escapedWhitespace){var high="0x"+escaped-0x10000;// NaN means non-codepoint
// Support: Firefox<24
// Workaround erroneous numeric interpretation of +"0x"
return high!==high||escapedWhitespace?escaped:high<0?// BMP codepoint
String.fromCharCode(high+0x10000):// Supplemental Plane codepoint (surrogate pair)
String.fromCharCode(high>>10|0xD800,high&0x3FF|0xDC00);},// CSS string/identifier serialization
// https://drafts.csswg.org/cssom/#common-serializing-idioms
rcssescape=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,fcssescape=function fcssescape(ch,asCodePoint){if(asCodePoint){// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
if(ch==="\0"){return"\uFFFD";}// Control characters and (dependent upon position) numbers get escaped as code points
return ch.slice(0,-1)+"\\"+ch.charCodeAt(ch.length-1).toString(16)+" ";}// Other potentially-special ASCII characters get backslash-escaped
return"\\"+ch;},// Used for iframes
// See setDocument()
// Removing the function wrapper causes a "Permission Denied"
// error in IE
unloadHandler=function unloadHandler(){setDocument();},disabledAncestor=addCombinator(function(elem){return elem.disabled===true&&("form"in elem||"label"in elem);},{dir:"parentNode",next:"legend"});// Optimize for push.apply( _, NodeList )
try{push.apply(arr=slice.call(preferredDoc.childNodes),preferredDoc.childNodes);// Support: Android<4.0
// Detect silently failing push.apply
arr[preferredDoc.childNodes.length].nodeType;}catch(e){push={apply:arr.length?// Leverage slice if possible
function(target,els){push_native.apply(target,slice.call(els));}:// Support: IE<9
// Otherwise append directly
function(target,els){var j=target.length,i=0;// Can't trust NodeList.length
while(target[j++]=els[i++]){}target.length=j-1;}};}function Sizzle(selector,context,results,seed){var m,i,elem,nid,match,groups,newSelector,newContext=context&&context.ownerDocument,// nodeType defaults to 9, since context defaults to document
nodeType=context?context.nodeType:9;results=results||[];// Return early from calls with invalid selector or context
if(typeof selector!=="string"||!selector||nodeType!==1&&nodeType!==9&&nodeType!==11){return results;}// Try to shortcut find operations (as opposed to filters) in HTML documents
if(!seed){if((context?context.ownerDocument||context:preferredDoc)!==document){setDocument(context);}context=context||document;if(documentIsHTML){// If the selector is sufficiently simple, try using a "get*By*" DOM method
// (excepting DocumentFragment context, where the methods don't exist)
if(nodeType!==11&&(match=rquickExpr.exec(selector))){// ID selector
if(m=match[1]){// Document context
if(nodeType===9){if(elem=context.getElementById(m)){// Support: IE, Opera, Webkit
// TODO: identify versions
// getElementById can match elements by name instead of ID
if(elem.id===m){results.push(elem);return results;}}else{return results;}// Element context
}else{// Support: IE, Opera, Webkit
// TODO: identify versions
// getElementById can match elements by name instead of ID
if(newContext&&(elem=newContext.getElementById(m))&&contains(context,elem)&&elem.id===m){results.push(elem);return results;}}// Type selector
}else if(match[2]){push.apply(results,context.getElementsByTagName(selector));return results;// Class selector
}else if((m=match[3])&&support.getElementsByClassName&&context.getElementsByClassName){push.apply(results,context.getElementsByClassName(m));return results;}}// Take advantage of querySelectorAll
if(support.qsa&&!compilerCache[selector+" "]&&(!rbuggyQSA||!rbuggyQSA.test(selector))){if(nodeType!==1){newContext=context;newSelector=selector;// qSA looks outside Element context, which is not what we want
// Thanks to Andrew Dupont for this workaround technique
// Support: IE <=8
// Exclude object elements
}else if(context.nodeName.toLowerCase()!=="object"){// Capture the context ID, setting it first if necessary
if(nid=context.getAttribute("id")){nid=nid.replace(rcssescape,fcssescape);}else{context.setAttribute("id",nid=expando);}// Prefix every selector in the list
groups=tokenize(selector);i=groups.length;while(i--){groups[i]="#"+nid+" "+toSelector(groups[i]);}newSelector=groups.join(",");// Expand context for sibling selectors
newContext=rsibling.test(selector)&&testContext(context.parentNode)||context;}if(newSelector){try{push.apply(results,newContext.querySelectorAll(newSelector));return results;}catch(qsaError){}finally{if(nid===expando){context.removeAttribute("id");}}}}}}// All others
return select(selector.replace(rtrim,"$1"),context,results,seed);}/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */function createCache(){var keys=[];function cache(key,value){// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
if(keys.push(key+" ")>Expr.cacheLength){// Only keep the most recent entries
delete cache[keys.shift()];}return cache[key+" "]=value;}return cache;}/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */function markFunction(fn){fn[expando]=true;return fn;}/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */function assert(fn){var el=document.createElement("fieldset");try{return!!fn(el);}catch(e){return false;}finally{// Remove from its parent by default
if(el.parentNode){el.parentNode.removeChild(el);}// release memory in IE
el=null;}}/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */function addHandle(attrs,handler){var arr=attrs.split("|"),i=arr.length;while(i--){Expr.attrHandle[arr[i]]=handler;}}/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */function siblingCheck(a,b){var cur=b&&a,diff=cur&&a.nodeType===1&&b.nodeType===1&&a.sourceIndex-b.sourceIndex;// Use IE sourceIndex if available on both nodes
if(diff){return diff;}// Check if b follows a
if(cur){while(cur=cur.nextSibling){if(cur===b){return-1;}}}return a?1:-1;}/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */function createInputPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type===type;};}/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */function createButtonPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return(name==="input"||name==="button")&&elem.type===type;};}/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */function createDisabledPseudo(disabled){// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
return function(elem){// Only certain elements can match :enabled or :disabled
// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
if("form"in elem){// Check for inherited disabledness on relevant non-disabled elements:
// * listed form-associated elements in a disabled fieldset
//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
// * option elements in a disabled optgroup
//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
// All such elements have a "form" property.
if(elem.parentNode&&elem.disabled===false){// Option elements defer to a parent optgroup if present
if("label"in elem){if("label"in elem.parentNode){return elem.parentNode.disabled===disabled;}else{return elem.disabled===disabled;}}// Support: IE 6 - 11
// Use the isDisabled shortcut property to check for disabled fieldset ancestors
return elem.isDisabled===disabled||// Where there is no isDisabled, check manually
/* jshint -W018 */elem.isDisabled!==!disabled&&disabledAncestor(elem)===disabled;}return elem.disabled===disabled;// Try to winnow out elements that can't be disabled before trusting the disabled property.
// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
// even exist on them, let alone have a boolean value.
}else if("label"in elem){return elem.disabled===disabled;}// Remaining elements are neither :enabled nor :disabled
return false;};}/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */function createPositionalPseudo(fn){return markFunction(function(argument){argument=+argument;return markFunction(function(seed,matches){var j,matchIndexes=fn([],seed.length,argument),i=matchIndexes.length;// Match elements found at the specified indexes
while(i--){if(seed[j=matchIndexes[i]]){seed[j]=!(matches[j]=seed[j]);}}});});}/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */function testContext(context){return context&&typeof context.getElementsByTagName!=="undefined"&&context;}// Expose support vars for convenience
support=Sizzle.support={};/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */isXML=Sizzle.isXML=function(elem){// documentElement is verified for cases where it doesn't yet exist
// (such as loading iframes in IE - #4833)
var documentElement=elem&&(elem.ownerDocument||elem).documentElement;return documentElement?documentElement.nodeName!=="HTML":false;};/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */setDocument=Sizzle.setDocument=function(node){var hasCompare,subWindow,doc=node?node.ownerDocument||node:preferredDoc;// Return early if doc is invalid or already selected
if(doc===document||doc.nodeType!==9||!doc.documentElement){return document;}// Update global variables
document=doc;docElem=document.documentElement;documentIsHTML=!isXML(document);// Support: IE 9-11, Edge
// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
if(preferredDoc!==document&&(subWindow=document.defaultView)&&subWindow.top!==subWindow){// Support: IE 11, Edge
if(subWindow.addEventListener){subWindow.addEventListener("unload",unloadHandler,false);// Support: IE 9 - 10 only
}else if(subWindow.attachEvent){subWindow.attachEvent("onunload",unloadHandler);}}/* Attributes
	---------------------------------------------------------------------- */// Support: IE<8
// Verify that getAttribute really returns attributes and not properties
// (excepting IE8 booleans)
support.attributes=assert(function(el){el.className="i";return!el.getAttribute("className");});/* getElement(s)By*
	---------------------------------------------------------------------- */// Check if getElementsByTagName("*") returns only elements
support.getElementsByTagName=assert(function(el){el.appendChild(document.createComment(""));return!el.getElementsByTagName("*").length;});// Support: IE<9
support.getElementsByClassName=rnative.test(document.getElementsByClassName);// Support: IE<10
// Check if getElementById returns elements by name
// The broken getElementById methods don't pick up programmatically-set names,
// so use a roundabout getElementsByName test
support.getById=assert(function(el){docElem.appendChild(el).id=expando;return!document.getElementsByName||!document.getElementsByName(expando).length;});// ID filter and find
if(support.getById){Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){return elem.getAttribute("id")===attrId;};};Expr.find["ID"]=function(id,context){if(typeof context.getElementById!=="undefined"&&documentIsHTML){var elem=context.getElementById(id);return elem?[elem]:[];}};}else{Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");return node&&node.value===attrId;};};// Support: IE 6 - 7 only
// getElementById is not reliable as a find shortcut
Expr.find["ID"]=function(id,context){if(typeof context.getElementById!=="undefined"&&documentIsHTML){var node,i,elems,elem=context.getElementById(id);if(elem){// Verify the id attribute
node=elem.getAttributeNode("id");if(node&&node.value===id){return[elem];}// Fall back on getElementsByName
elems=context.getElementsByName(id);i=0;while(elem=elems[i++]){node=elem.getAttributeNode("id");if(node&&node.value===id){return[elem];}}}return[];}};}// Tag
Expr.find["TAG"]=support.getElementsByTagName?function(tag,context){if(typeof context.getElementsByTagName!=="undefined"){return context.getElementsByTagName(tag);// DocumentFragment nodes don't have gEBTN
}else if(support.qsa){return context.querySelectorAll(tag);}}:function(tag,context){var elem,tmp=[],i=0,// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
results=context.getElementsByTagName(tag);// Filter out possible comments
if(tag==="*"){while(elem=results[i++]){if(elem.nodeType===1){tmp.push(elem);}}return tmp;}return results;};// Class
Expr.find["CLASS"]=support.getElementsByClassName&&function(className,context){if(typeof context.getElementsByClassName!=="undefined"&&documentIsHTML){return context.getElementsByClassName(className);}};/* QSA/matchesSelector
	---------------------------------------------------------------------- */// QSA and matchesSelector support
// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
rbuggyMatches=[];// qSa(:focus) reports false when true (Chrome 21)
// We allow this because of a bug in IE8/9 that throws an error
// whenever `document.activeElement` is accessed on an iframe
// So, we allow :focus to pass through QSA all the time to avoid the IE error
// See https://bugs.jquery.com/ticket/13378
rbuggyQSA=[];if(support.qsa=rnative.test(document.querySelectorAll)){// Build QSA regex
// Regex strategy adopted from Diego Perini
assert(function(el){// Select is set to empty string on purpose
// This is to test IE's treatment of not explicitly
// setting a boolean content attribute,
// since its presence should be enough
// https://bugs.jquery.com/ticket/12359
docElem.appendChild(el).innerHTML="<a id='"+expando+"'></a>"+"<select id='"+expando+"-\r\\' msallowcapture=''>"+"<option selected=''></option></select>";// Support: IE8, Opera 11-12.16
// Nothing should be selected when empty strings follow ^= or $= or *=
// The test attribute must be unknown in Opera but "safe" for WinRT
// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
if(el.querySelectorAll("[msallowcapture^='']").length){rbuggyQSA.push("[*^$]="+whitespace+"*(?:''|\"\")");}// Support: IE8
// Boolean attributes and "value" are not treated correctly
if(!el.querySelectorAll("[selected]").length){rbuggyQSA.push("\\["+whitespace+"*(?:value|"+booleans+")");}// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
if(!el.querySelectorAll("[id~="+expando+"-]").length){rbuggyQSA.push("~=");}// Webkit/Opera - :checked should return selected option elements
// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
// IE8 throws error here and will not see later tests
if(!el.querySelectorAll(":checked").length){rbuggyQSA.push(":checked");}// Support: Safari 8+, iOS 8+
// https://bugs.webkit.org/show_bug.cgi?id=136851
// In-page `selector#id sibling-combinator selector` fails
if(!el.querySelectorAll("a#"+expando+"+*").length){rbuggyQSA.push(".#.+[+~]");}});assert(function(el){el.innerHTML="<a href='' disabled='disabled'></a>"+"<select disabled='disabled'><option/></select>";// Support: Windows 8 Native Apps
// The type and name attributes are restricted during .innerHTML assignment
var input=document.createElement("input");input.setAttribute("type","hidden");el.appendChild(input).setAttribute("name","D");// Support: IE8
// Enforce case-sensitivity of name attribute
if(el.querySelectorAll("[name=d]").length){rbuggyQSA.push("name"+whitespace+"*[*^$|!~]?=");}// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
// IE8 throws error here and will not see later tests
if(el.querySelectorAll(":enabled").length!==2){rbuggyQSA.push(":enabled",":disabled");}// Support: IE9-11+
// IE's :disabled selector does not pick up the children of disabled fieldsets
docElem.appendChild(el).disabled=true;if(el.querySelectorAll(":disabled").length!==2){rbuggyQSA.push(":enabled",":disabled");}// Opera 10-11 does not throw on post-comma invalid pseudos
el.querySelectorAll("*,:x");rbuggyQSA.push(",.*:");});}if(support.matchesSelector=rnative.test(matches=docElem.matches||docElem.webkitMatchesSelector||docElem.mozMatchesSelector||docElem.oMatchesSelector||docElem.msMatchesSelector)){assert(function(el){// Check to see if it's possible to do matchesSelector
// on a disconnected node (IE 9)
support.disconnectedMatch=matches.call(el,"*");// This should fail with an exception
// Gecko does not error, returns false instead
matches.call(el,"[s!='']:x");rbuggyMatches.push("!=",pseudos);});}rbuggyQSA=rbuggyQSA.length&&new RegExp(rbuggyQSA.join("|"));rbuggyMatches=rbuggyMatches.length&&new RegExp(rbuggyMatches.join("|"));/* Contains
	---------------------------------------------------------------------- */hasCompare=rnative.test(docElem.compareDocumentPosition);// Element contains another
// Purposefully self-exclusive
// As in, an element does not contain itself
contains=hasCompare||rnative.test(docElem.contains)?function(a,b){var adown=a.nodeType===9?a.documentElement:a,bup=b&&b.parentNode;return a===bup||!!(bup&&bup.nodeType===1&&(adown.contains?adown.contains(bup):a.compareDocumentPosition&&a.compareDocumentPosition(bup)&16));}:function(a,b){if(b){while(b=b.parentNode){if(b===a){return true;}}}return false;};/* Sorting
	---------------------------------------------------------------------- */// Document order sorting
sortOrder=hasCompare?function(a,b){// Flag for duplicate removal
if(a===b){hasDuplicate=true;return 0;}// Sort on method existence if only one input has compareDocumentPosition
var compare=!a.compareDocumentPosition-!b.compareDocumentPosition;if(compare){return compare;}// Calculate position if both inputs belong to the same document
compare=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):// Otherwise we know they are disconnected
1;// Disconnected nodes
if(compare&1||!support.sortDetached&&b.compareDocumentPosition(a)===compare){// Choose the first element that is related to our preferred document
if(a===document||a.ownerDocument===preferredDoc&&contains(preferredDoc,a)){return-1;}if(b===document||b.ownerDocument===preferredDoc&&contains(preferredDoc,b)){return 1;}// Maintain original order
return sortInput?indexOf(sortInput,a)-indexOf(sortInput,b):0;}return compare&4?-1:1;}:function(a,b){// Exit early if the nodes are identical
if(a===b){hasDuplicate=true;return 0;}var cur,i=0,aup=a.parentNode,bup=b.parentNode,ap=[a],bp=[b];// Parentless nodes are either documents or disconnected
if(!aup||!bup){return a===document?-1:b===document?1:aup?-1:bup?1:sortInput?indexOf(sortInput,a)-indexOf(sortInput,b):0;// If the nodes are siblings, we can do a quick check
}else if(aup===bup){return siblingCheck(a,b);}// Otherwise we need full lists of their ancestors for comparison
cur=a;while(cur=cur.parentNode){ap.unshift(cur);}cur=b;while(cur=cur.parentNode){bp.unshift(cur);}// Walk down the tree looking for a discrepancy
while(ap[i]===bp[i]){i++;}return i?// Do a sibling check if the nodes have a common ancestor
siblingCheck(ap[i],bp[i]):// Otherwise nodes in our document sort first
ap[i]===preferredDoc?-1:bp[i]===preferredDoc?1:0;};return document;};Sizzle.matches=function(expr,elements){return Sizzle(expr,null,null,elements);};Sizzle.matchesSelector=function(elem,expr){// Set document vars if needed
if((elem.ownerDocument||elem)!==document){setDocument(elem);}// Make sure that attribute selectors are quoted
expr=expr.replace(rattributeQuotes,"='$1']");if(support.matchesSelector&&documentIsHTML&&!compilerCache[expr+" "]&&(!rbuggyMatches||!rbuggyMatches.test(expr))&&(!rbuggyQSA||!rbuggyQSA.test(expr))){try{var ret=matches.call(elem,expr);// IE 9's matchesSelector returns false on disconnected nodes
if(ret||support.disconnectedMatch||// As well, disconnected nodes are said to be in a document
// fragment in IE 9
elem.document&&elem.document.nodeType!==11){return ret;}}catch(e){}}return Sizzle(expr,document,null,[elem]).length>0;};Sizzle.contains=function(context,elem){// Set document vars if needed
if((context.ownerDocument||context)!==document){setDocument(context);}return contains(context,elem);};Sizzle.attr=function(elem,name){// Set document vars if needed
if((elem.ownerDocument||elem)!==document){setDocument(elem);}var fn=Expr.attrHandle[name.toLowerCase()],// Don't get fooled by Object.prototype properties (jQuery #13807)
val=fn&&hasOwn.call(Expr.attrHandle,name.toLowerCase())?fn(elem,name,!documentIsHTML):undefined;return val!==undefined?val:support.attributes||!documentIsHTML?elem.getAttribute(name):(val=elem.getAttributeNode(name))&&val.specified?val.value:null;};Sizzle.escape=function(sel){return(sel+"").replace(rcssescape,fcssescape);};Sizzle.error=function(msg){throw new Error("Syntax error, unrecognized expression: "+msg);};/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */Sizzle.uniqueSort=function(results){var elem,duplicates=[],j=0,i=0;// Unless we *know* we can detect duplicates, assume their presence
hasDuplicate=!support.detectDuplicates;sortInput=!support.sortStable&&results.slice(0);results.sort(sortOrder);if(hasDuplicate){while(elem=results[i++]){if(elem===results[i]){j=duplicates.push(i);}}while(j--){results.splice(duplicates[j],1);}}// Clear input after sorting to release objects
// See https://github.com/jquery/sizzle/pull/225
sortInput=null;return results;};/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */getText=Sizzle.getText=function(elem){var node,ret="",i=0,nodeType=elem.nodeType;if(!nodeType){// If no nodeType, this is expected to be an array
while(node=elem[i++]){// Do not traverse comment nodes
ret+=getText(node);}}else if(nodeType===1||nodeType===9||nodeType===11){// Use textContent for elements
// innerText usage removed for consistency of new lines (jQuery #11153)
if(typeof elem.textContent==="string"){return elem.textContent;}else{// Traverse its children
for(elem=elem.firstChild;elem;elem=elem.nextSibling){ret+=getText(elem);}}}else if(nodeType===3||nodeType===4){return elem.nodeValue;}// Do not include comment or processing instruction nodes
return ret;};Expr=Sizzle.selectors={// Can be adjusted by the user
cacheLength:50,createPseudo:markFunction,match:matchExpr,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:true}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:true},"~":{dir:"previousSibling"}},preFilter:{"ATTR":function ATTR(match){match[1]=match[1].replace(runescape,funescape);// Move the given value to match[3] whether quoted or unquoted
match[3]=(match[3]||match[4]||match[5]||"").replace(runescape,funescape);if(match[2]==="~="){match[3]=" "+match[3]+" ";}return match.slice(0,4);},"CHILD":function CHILD(match){/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/match[1]=match[1].toLowerCase();if(match[1].slice(0,3)==="nth"){// nth-* requires argument
if(!match[3]){Sizzle.error(match[0]);}// numeric x and y parameters for Expr.filter.CHILD
// remember that false/true cast respectively to 0/1
match[4]=+(match[4]?match[5]+(match[6]||1):2*(match[3]==="even"||match[3]==="odd"));match[5]=+(match[7]+match[8]||match[3]==="odd");// other types prohibit arguments
}else if(match[3]){Sizzle.error(match[0]);}return match;},"PSEUDO":function PSEUDO(match){var excess,unquoted=!match[6]&&match[2];if(matchExpr["CHILD"].test(match[0])){return null;}// Accept quoted arguments as-is
if(match[3]){match[2]=match[4]||match[5]||"";// Strip excess characters from unquoted arguments
}else if(unquoted&&rpseudo.test(unquoted)&&(// Get excess from tokenize (recursively)
excess=tokenize(unquoted,true))&&(// advance to the next closing parenthesis
excess=unquoted.indexOf(")",unquoted.length-excess)-unquoted.length)){// excess is a negative index
match[0]=match[0].slice(0,excess);match[2]=unquoted.slice(0,excess);}// Return only captures needed by the pseudo filter method (type and argument)
return match.slice(0,3);}},filter:{"TAG":function TAG(nodeNameSelector){var nodeName=nodeNameSelector.replace(runescape,funescape).toLowerCase();return nodeNameSelector==="*"?function(){return true;}:function(elem){return elem.nodeName&&elem.nodeName.toLowerCase()===nodeName;};},"CLASS":function CLASS(className){var pattern=classCache[className+" "];return pattern||(pattern=new RegExp("(^|"+whitespace+")"+className+"("+whitespace+"|$)"))&&classCache(className,function(elem){return pattern.test(typeof elem.className==="string"&&elem.className||typeof elem.getAttribute!=="undefined"&&elem.getAttribute("class")||"");});},"ATTR":function ATTR(name,operator,check){return function(elem){var result=Sizzle.attr(elem,name);if(result==null){return operator==="!=";}if(!operator){return true;}result+="";return operator==="="?result===check:operator==="!="?result!==check:operator==="^="?check&&result.indexOf(check)===0:operator==="*="?check&&result.indexOf(check)>-1:operator==="$="?check&&result.slice(-check.length)===check:operator==="~="?(" "+result.replace(rwhitespace," ")+" ").indexOf(check)>-1:operator==="|="?result===check||result.slice(0,check.length+1)===check+"-":false;};},"CHILD":function CHILD(type,what,argument,first,last){var simple=type.slice(0,3)!=="nth",forward=type.slice(-4)!=="last",ofType=what==="of-type";return first===1&&last===0?// Shortcut for :nth-*(n)
function(elem){return!!elem.parentNode;}:function(elem,context,xml){var cache,uniqueCache,outerCache,node,nodeIndex,start,dir=simple!==forward?"nextSibling":"previousSibling",parent=elem.parentNode,name=ofType&&elem.nodeName.toLowerCase(),useCache=!xml&&!ofType,diff=false;if(parent){// :(first|last|only)-(child|of-type)
if(simple){while(dir){node=elem;while(node=node[dir]){if(ofType?node.nodeName.toLowerCase()===name:node.nodeType===1){return false;}}// Reverse direction for :only-* (if we haven't yet done so)
start=dir=type==="only"&&!start&&"nextSibling";}return true;}start=[forward?parent.firstChild:parent.lastChild];// non-xml :nth-child(...) stores cache data on `parent`
if(forward&&useCache){// Seek `elem` from a previously-cached index
// ...in a gzip-friendly way
node=parent;outerCache=node[expando]||(node[expando]={});// Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});cache=uniqueCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=nodeIndex&&cache[2];node=nodeIndex&&parent.childNodes[nodeIndex];while(node=++nodeIndex&&node&&node[dir]||(// Fallback to seeking `elem` from the start
diff=nodeIndex=0)||start.pop()){// When found, cache indexes on `parent` and break
if(node.nodeType===1&&++diff&&node===elem){uniqueCache[type]=[dirruns,nodeIndex,diff];break;}}}else{// Use previously-cached element index if available
if(useCache){// ...in a gzip-friendly way
node=elem;outerCache=node[expando]||(node[expando]={});// Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});cache=uniqueCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=nodeIndex;}// xml :nth-child(...)
// or :nth-last-child(...) or :nth(-last)?-of-type(...)
if(diff===false){// Use the same loop as above to seek `elem` from the start
while(node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop()){if((ofType?node.nodeName.toLowerCase()===name:node.nodeType===1)&&++diff){// Cache the index of each encountered element
if(useCache){outerCache=node[expando]||(node[expando]={});// Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
uniqueCache=outerCache[node.uniqueID]||(outerCache[node.uniqueID]={});uniqueCache[type]=[dirruns,diff];}if(node===elem){break;}}}}}// Incorporate the offset, then check against cycle size
diff-=last;return diff===first||diff%first===0&&diff/first>=0;}};},"PSEUDO":function PSEUDO(pseudo,argument){// pseudo-class names are case-insensitive
// http://www.w3.org/TR/selectors/#pseudo-classes
// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
// Remember that setFilters inherits from pseudos
var args,fn=Expr.pseudos[pseudo]||Expr.setFilters[pseudo.toLowerCase()]||Sizzle.error("unsupported pseudo: "+pseudo);// The user may use createPseudo to indicate that
// arguments are needed to create the filter function
// just as Sizzle does
if(fn[expando]){return fn(argument);}// But maintain support for old signatures
if(fn.length>1){args=[pseudo,pseudo,"",argument];return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())?markFunction(function(seed,matches){var idx,matched=fn(seed,argument),i=matched.length;while(i--){idx=indexOf(seed,matched[i]);seed[idx]=!(matches[idx]=matched[i]);}}):function(elem){return fn(elem,0,args);};}return fn;}},pseudos:{// Potentially complex pseudos
"not":markFunction(function(selector){// Trim the selector passed to compile
// to avoid treating leading and trailing
// spaces as combinators
var input=[],results=[],matcher=compile(selector.replace(rtrim,"$1"));return matcher[expando]?markFunction(function(seed,matches,context,xml){var elem,unmatched=matcher(seed,null,xml,[]),i=seed.length;// Match elements unmatched by `matcher`
while(i--){if(elem=unmatched[i]){seed[i]=!(matches[i]=elem);}}}):function(elem,context,xml){input[0]=elem;matcher(input,null,xml,results);// Don't keep the element (issue #299)
input[0]=null;return!results.pop();};}),"has":markFunction(function(selector){return function(elem){return Sizzle(selector,elem).length>0;};}),"contains":markFunction(function(text){text=text.replace(runescape,funescape);return function(elem){return(elem.textContent||elem.innerText||getText(elem)).indexOf(text)>-1;};}),// "Whether an element is represented by a :lang() selector
// is based solely on the element's language value
// being equal to the identifier C,
// or beginning with the identifier C immediately followed by "-".
// The matching of C against the element's language value is performed case-insensitively.
// The identifier C does not have to be a valid language name."
// http://www.w3.org/TR/selectors/#lang-pseudo
"lang":markFunction(function(lang){// lang value must be a valid identifier
if(!ridentifier.test(lang||"")){Sizzle.error("unsupported lang: "+lang);}lang=lang.replace(runescape,funescape).toLowerCase();return function(elem){var elemLang;do{if(elemLang=documentIsHTML?elem.lang:elem.getAttribute("xml:lang")||elem.getAttribute("lang")){elemLang=elemLang.toLowerCase();return elemLang===lang||elemLang.indexOf(lang+"-")===0;}}while((elem=elem.parentNode)&&elem.nodeType===1);return false;};}),// Miscellaneous
"target":function target(elem){var hash=window.location&&window.location.hash;return hash&&hash.slice(1)===elem.id;},"root":function root(elem){return elem===docElem;},"focus":function focus(elem){return elem===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(elem.type||elem.href||~elem.tabIndex);},// Boolean properties
"enabled":createDisabledPseudo(false),"disabled":createDisabledPseudo(true),"checked":function checked(elem){// In CSS3, :checked should return both checked and selected elements
// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
var nodeName=elem.nodeName.toLowerCase();return nodeName==="input"&&!!elem.checked||nodeName==="option"&&!!elem.selected;},"selected":function selected(elem){// Accessing this property makes selected-by-default
// options in Safari work properly
if(elem.parentNode){elem.parentNode.selectedIndex;}return elem.selected===true;},// Contents
"empty":function empty(elem){// http://www.w3.org/TR/selectors/#empty-pseudo
// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
//   but not by others (comment: 8; processing instruction: 7; etc.)
// nodeType < 6 works because attributes (2) do not appear as children
for(elem=elem.firstChild;elem;elem=elem.nextSibling){if(elem.nodeType<6){return false;}}return true;},"parent":function parent(elem){return!Expr.pseudos["empty"](elem);},// Element/input types
"header":function header(elem){return rheader.test(elem.nodeName);},"input":function input(elem){return rinputs.test(elem.nodeName);},"button":function button(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type==="button"||name==="button";},"text":function text(elem){var attr;return elem.nodeName.toLowerCase()==="input"&&elem.type==="text"&&(// Support: IE<8
// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
(attr=elem.getAttribute("type"))==null||attr.toLowerCase()==="text");},// Position-in-collection
"first":createPositionalPseudo(function(){return[0];}),"last":createPositionalPseudo(function(matchIndexes,length){return[length-1];}),"eq":createPositionalPseudo(function(matchIndexes,length,argument){return[argument<0?argument+length:argument];}),"even":createPositionalPseudo(function(matchIndexes,length){var i=0;for(;i<length;i+=2){matchIndexes.push(i);}return matchIndexes;}),"odd":createPositionalPseudo(function(matchIndexes,length){var i=1;for(;i<length;i+=2){matchIndexes.push(i);}return matchIndexes;}),"lt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;--i>=0;){matchIndexes.push(i);}return matchIndexes;}),"gt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;++i<length;){matchIndexes.push(i);}return matchIndexes;})}};Expr.pseudos["nth"]=Expr.pseudos["eq"];// Add button/input type pseudos
for(i in{radio:true,checkbox:true,file:true,password:true,image:true}){Expr.pseudos[i]=createInputPseudo(i);}for(i in{submit:true,reset:true}){Expr.pseudos[i]=createButtonPseudo(i);}// Easy API for creating new setFilters
function setFilters(){}setFilters.prototype=Expr.filters=Expr.pseudos;Expr.setFilters=new setFilters();tokenize=Sizzle.tokenize=function(selector,parseOnly){var matched,match,tokens,type,soFar,groups,preFilters,cached=tokenCache[selector+" "];if(cached){return parseOnly?0:cached.slice(0);}soFar=selector;groups=[];preFilters=Expr.preFilter;while(soFar){// Comma and first run
if(!matched||(match=rcomma.exec(soFar))){if(match){// Don't consume trailing commas as valid
soFar=soFar.slice(match[0].length)||soFar;}groups.push(tokens=[]);}matched=false;// Combinators
if(match=rcombinators.exec(soFar)){matched=match.shift();tokens.push({value:matched,// Cast descendant combinators to space
type:match[0].replace(rtrim," ")});soFar=soFar.slice(matched.length);}// Filters
for(type in Expr.filter){if((match=matchExpr[type].exec(soFar))&&(!preFilters[type]||(match=preFilters[type](match)))){matched=match.shift();tokens.push({value:matched,type:type,matches:match});soFar=soFar.slice(matched.length);}}if(!matched){break;}}// Return the length of the invalid excess
// if we're just parsing
// Otherwise, throw an error or return tokens
return parseOnly?soFar.length:soFar?Sizzle.error(selector):// Cache the tokens
tokenCache(selector,groups).slice(0);};function toSelector(tokens){var i=0,len=tokens.length,selector="";for(;i<len;i++){selector+=tokens[i].value;}return selector;}function addCombinator(matcher,combinator,base){var dir=combinator.dir,skip=combinator.next,key=skip||dir,checkNonElements=base&&key==="parentNode",doneName=done++;return combinator.first?// Check against closest ancestor/preceding element
function(elem,context,xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){return matcher(elem,context,xml);}}return false;}:// Check against all ancestor/preceding elements
function(elem,context,xml){var oldCache,uniqueCache,outerCache,newCache=[dirruns,doneName];// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
if(xml){while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){if(matcher(elem,context,xml)){return true;}}}}else{while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements){outerCache=elem[expando]||(elem[expando]={});// Support: IE <9 only
// Defend against cloned attroperties (jQuery gh-1709)
uniqueCache=outerCache[elem.uniqueID]||(outerCache[elem.uniqueID]={});if(skip&&skip===elem.nodeName.toLowerCase()){elem=elem[dir]||elem;}else if((oldCache=uniqueCache[key])&&oldCache[0]===dirruns&&oldCache[1]===doneName){// Assign to newCache so results back-propagate to previous elements
return newCache[2]=oldCache[2];}else{// Reuse newcache so results back-propagate to previous elements
uniqueCache[key]=newCache;// A match means we're done; a fail means we have to keep checking
if(newCache[2]=matcher(elem,context,xml)){return true;}}}}}return false;};}function elementMatcher(matchers){return matchers.length>1?function(elem,context,xml){var i=matchers.length;while(i--){if(!matchers[i](elem,context,xml)){return false;}}return true;}:matchers[0];}function multipleContexts(selector,contexts,results){var i=0,len=contexts.length;for(;i<len;i++){Sizzle(selector,contexts[i],results);}return results;}function condense(unmatched,map,filter,context,xml){var elem,newUnmatched=[],i=0,len=unmatched.length,mapped=map!=null;for(;i<len;i++){if(elem=unmatched[i]){if(!filter||filter(elem,context,xml)){newUnmatched.push(elem);if(mapped){map.push(i);}}}}return newUnmatched;}function setMatcher(preFilter,selector,matcher,postFilter,postFinder,postSelector){if(postFilter&&!postFilter[expando]){postFilter=setMatcher(postFilter);}if(postFinder&&!postFinder[expando]){postFinder=setMatcher(postFinder,postSelector);}return markFunction(function(seed,results,context,xml){var temp,i,elem,preMap=[],postMap=[],preexisting=results.length,// Get initial elements from seed or context
elems=seed||multipleContexts(selector||"*",context.nodeType?[context]:context,[]),// Prefilter to get matcher input, preserving a map for seed-results synchronization
matcherIn=preFilter&&(seed||!selector)?condense(elems,preMap,preFilter,context,xml):elems,matcherOut=matcher?// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
postFinder||(seed?preFilter:preexisting||postFilter)?// ...intermediate processing is necessary
[]:// ...otherwise use results directly
results:matcherIn;// Find primary matches
if(matcher){matcher(matcherIn,matcherOut,context,xml);}// Apply postFilter
if(postFilter){temp=condense(matcherOut,postMap);postFilter(temp,[],context,xml);// Un-match failing elements by moving them back to matcherIn
i=temp.length;while(i--){if(elem=temp[i]){matcherOut[postMap[i]]=!(matcherIn[postMap[i]]=elem);}}}if(seed){if(postFinder||preFilter){if(postFinder){// Get the final matcherOut by condensing this intermediate into postFinder contexts
temp=[];i=matcherOut.length;while(i--){if(elem=matcherOut[i]){// Restore matcherIn since elem is not yet a final match
temp.push(matcherIn[i]=elem);}}postFinder(null,matcherOut=[],temp,xml);}// Move matched elements from seed to results to keep them synchronized
i=matcherOut.length;while(i--){if((elem=matcherOut[i])&&(temp=postFinder?indexOf(seed,elem):preMap[i])>-1){seed[temp]=!(results[temp]=elem);}}}// Add elements to results, through postFinder if defined
}else{matcherOut=condense(matcherOut===results?matcherOut.splice(preexisting,matcherOut.length):matcherOut);if(postFinder){postFinder(null,results,matcherOut,xml);}else{push.apply(results,matcherOut);}}});}function matcherFromTokens(tokens){var checkContext,matcher,j,len=tokens.length,leadingRelative=Expr.relative[tokens[0].type],implicitRelative=leadingRelative||Expr.relative[" "],i=leadingRelative?1:0,// The foundational matcher ensures that elements are reachable from top-level context(s)
matchContext=addCombinator(function(elem){return elem===checkContext;},implicitRelative,true),matchAnyContext=addCombinator(function(elem){return indexOf(checkContext,elem)>-1;},implicitRelative,true),matchers=[function(elem,context,xml){var ret=!leadingRelative&&(xml||context!==outermostContext)||((checkContext=context).nodeType?matchContext(elem,context,xml):matchAnyContext(elem,context,xml));// Avoid hanging onto element (issue #299)
checkContext=null;return ret;}];for(;i<len;i++){if(matcher=Expr.relative[tokens[i].type]){matchers=[addCombinator(elementMatcher(matchers),matcher)];}else{matcher=Expr.filter[tokens[i].type].apply(null,tokens[i].matches);// Return special upon seeing a positional matcher
if(matcher[expando]){// Find the next relative operator (if any) for proper handling
j=++i;for(;j<len;j++){if(Expr.relative[tokens[j].type]){break;}}return setMatcher(i>1&&elementMatcher(matchers),i>1&&toSelector(// If the preceding token was a descendant combinator, insert an implicit any-element `*`
tokens.slice(0,i-1).concat({value:tokens[i-2].type===" "?"*":""})).replace(rtrim,"$1"),matcher,i<j&&matcherFromTokens(tokens.slice(i,j)),j<len&&matcherFromTokens(tokens=tokens.slice(j)),j<len&&toSelector(tokens));}matchers.push(matcher);}}return elementMatcher(matchers);}function matcherFromGroupMatchers(elementMatchers,setMatchers){var bySet=setMatchers.length>0,byElement=elementMatchers.length>0,superMatcher=function superMatcher(seed,context,xml,results,outermost){var elem,j,matcher,matchedCount=0,i="0",unmatched=seed&&[],setMatched=[],contextBackup=outermostContext,// We must always have either seed elements or outermost context
elems=seed||byElement&&Expr.find["TAG"]("*",outermost),// Use integer dirruns iff this is the outermost matcher
dirrunsUnique=dirruns+=contextBackup==null?1:Math.random()||0.1,len=elems.length;if(outermost){outermostContext=context===document||context||outermost;}// Add elements passing elementMatchers directly to results
// Support: IE<9, Safari
// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
for(;i!==len&&(elem=elems[i])!=null;i++){if(byElement&&elem){j=0;if(!context&&elem.ownerDocument!==document){setDocument(elem);xml=!documentIsHTML;}while(matcher=elementMatchers[j++]){if(matcher(elem,context||document,xml)){results.push(elem);break;}}if(outermost){dirruns=dirrunsUnique;}}// Track unmatched elements for set filters
if(bySet){// They will have gone through all possible matchers
if(elem=!matcher&&elem){matchedCount--;}// Lengthen the array for every element, matched or not
if(seed){unmatched.push(elem);}}}// `i` is now the count of elements visited above, and adding it to `matchedCount`
// makes the latter nonnegative.
matchedCount+=i;// Apply set filters to unmatched elements
// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
// no element matchers and no seed.
// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
// case, which will result in a "00" `matchedCount` that differs from `i` but is also
// numerically zero.
if(bySet&&i!==matchedCount){j=0;while(matcher=setMatchers[j++]){matcher(unmatched,setMatched,context,xml);}if(seed){// Reintegrate element matches to eliminate the need for sorting
if(matchedCount>0){while(i--){if(!(unmatched[i]||setMatched[i])){setMatched[i]=pop.call(results);}}}// Discard index placeholder values to get only actual matches
setMatched=condense(setMatched);}// Add matches to results
push.apply(results,setMatched);// Seedless set matches succeeding multiple successful matchers stipulate sorting
if(outermost&&!seed&&setMatched.length>0&&matchedCount+setMatchers.length>1){Sizzle.uniqueSort(results);}}// Override manipulation of globals by nested matchers
if(outermost){dirruns=dirrunsUnique;outermostContext=contextBackup;}return unmatched;};return bySet?markFunction(superMatcher):superMatcher;}compile=Sizzle.compile=function(selector,match/* Internal Use Only */){var i,setMatchers=[],elementMatchers=[],cached=compilerCache[selector+" "];if(!cached){// Generate a function of recursive functions that can be used to check each element
if(!match){match=tokenize(selector);}i=match.length;while(i--){cached=matcherFromTokens(match[i]);if(cached[expando]){setMatchers.push(cached);}else{elementMatchers.push(cached);}}// Cache the compiled function
cached=compilerCache(selector,matcherFromGroupMatchers(elementMatchers,setMatchers));// Save selector and tokenization
cached.selector=selector;}return cached;};/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */select=Sizzle.select=function(selector,context,results,seed){var i,tokens,token,type,find,compiled=typeof selector==="function"&&selector,match=!seed&&tokenize(selector=compiled.selector||selector);results=results||[];// Try to minimize operations if there is only one selector in the list and no seed
// (the latter of which guarantees us context)
if(match.length===1){// Reduce context if the leading compound selector is an ID
tokens=match[0]=match[0].slice(0);if(tokens.length>2&&(token=tokens[0]).type==="ID"&&context.nodeType===9&&documentIsHTML&&Expr.relative[tokens[1].type]){context=(Expr.find["ID"](token.matches[0].replace(runescape,funescape),context)||[])[0];if(!context){return results;// Precompiled matchers will still verify ancestry, so step up a level
}else if(compiled){context=context.parentNode;}selector=selector.slice(tokens.shift().value.length);}// Fetch a seed set for right-to-left matching
i=matchExpr["needsContext"].test(selector)?0:tokens.length;while(i--){token=tokens[i];// Abort if we hit a combinator
if(Expr.relative[type=token.type]){break;}if(find=Expr.find[type]){// Search, expanding context for leading sibling combinators
if(seed=find(token.matches[0].replace(runescape,funescape),rsibling.test(tokens[0].type)&&testContext(context.parentNode)||context)){// If seed is empty or no tokens remain, we can return early
tokens.splice(i,1);selector=seed.length&&toSelector(tokens);if(!selector){push.apply(results,seed);return results;}break;}}}}// Compile and execute a filtering function if one is not provided
// Provide `match` to avoid retokenization if we modified the selector above
(compiled||compile(selector,match))(seed,context,!documentIsHTML,results,!context||rsibling.test(selector)&&testContext(context.parentNode)||context);return results;};// One-time assignments
// Sort stability
support.sortStable=expando.split("").sort(sortOrder).join("")===expando;// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates=!!hasDuplicate;// Initialize against the default document
setDocument();// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached=assert(function(el){// Should return 1, but returns 4 (following)
return el.compareDocumentPosition(document.createElement("fieldset"))&1;});// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if(!assert(function(el){el.innerHTML="<a href='#'></a>";return el.firstChild.getAttribute("href")==="#";})){addHandle("type|href|height|width",function(elem,name,isXML){if(!isXML){return elem.getAttribute(name,name.toLowerCase()==="type"?1:2);}});}// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if(!support.attributes||!assert(function(el){el.innerHTML="<input/>";el.firstChild.setAttribute("value","");return el.firstChild.getAttribute("value")==="";})){addHandle("value",function(elem,name,isXML){if(!isXML&&elem.nodeName.toLowerCase()==="input"){return elem.defaultValue;}});}// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if(!assert(function(el){return el.getAttribute("disabled")==null;})){addHandle(booleans,function(elem,name,isXML){var val;if(!isXML){return elem[name]===true?name.toLowerCase():(val=elem.getAttributeNode(name))&&val.specified?val.value:null;}});}return Sizzle;}(window);jQuery.find=Sizzle;jQuery.expr=Sizzle.selectors;// Deprecated
jQuery.expr[":"]=jQuery.expr.pseudos;jQuery.uniqueSort=jQuery.unique=Sizzle.uniqueSort;jQuery.text=Sizzle.getText;jQuery.isXMLDoc=Sizzle.isXML;jQuery.contains=Sizzle.contains;jQuery.escapeSelector=Sizzle.escape;var dir=function dir(elem,_dir,until){var matched=[],truncate=until!==undefined;while((elem=elem[_dir])&&elem.nodeType!==9){if(elem.nodeType===1){if(truncate&&jQuery(elem).is(until)){break;}matched.push(elem);}}return matched;};var _siblings=function _siblings(n,elem){var matched=[];for(;n;n=n.nextSibling){if(n.nodeType===1&&n!==elem){matched.push(n);}}return matched;};var rneedsContext=jQuery.expr.match.needsContext;function nodeName(elem,name){return elem.nodeName&&elem.nodeName.toLowerCase()===name.toLowerCase();};var rsingleTag=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;// Implement the identical functionality for filter and not
function winnow(elements,qualifier,not){if(isFunction(qualifier)){return jQuery.grep(elements,function(elem,i){return!!qualifier.call(elem,i,elem)!==not;});}// Single element
if(qualifier.nodeType){return jQuery.grep(elements,function(elem){return elem===qualifier!==not;});}// Arraylike of elements (jQuery, arguments, Array)
if(typeof qualifier!=="string"){return jQuery.grep(elements,function(elem){return indexOf.call(qualifier,elem)>-1!==not;});}// Filtered directly for both simple and complex selectors
return jQuery.filter(qualifier,elements,not);}jQuery.filter=function(expr,elems,not){var elem=elems[0];if(not){expr=":not("+expr+")";}if(elems.length===1&&elem.nodeType===1){return jQuery.find.matchesSelector(elem,expr)?[elem]:[];}return jQuery.find.matches(expr,jQuery.grep(elems,function(elem){return elem.nodeType===1;}));};jQuery.fn.extend({find:function find(selector){var i,ret,len=this.length,self=this;if(typeof selector!=="string"){return this.pushStack(jQuery(selector).filter(function(){for(i=0;i<len;i++){if(jQuery.contains(self[i],this)){return true;}}}));}ret=this.pushStack([]);for(i=0;i<len;i++){jQuery.find(selector,self[i],ret);}return len>1?jQuery.uniqueSort(ret):ret;},filter:function filter(selector){return this.pushStack(winnow(this,selector||[],false));},not:function not(selector){return this.pushStack(winnow(this,selector||[],true));},is:function is(selector){return!!winnow(this,// If this is a positional/relative selector, check membership in the returned set
// so $("p:first").is("p:last") won't return true for a doc with two "p".
typeof selector==="string"&&rneedsContext.test(selector)?jQuery(selector):selector||[],false).length;}});// Initialize a jQuery object
// A central reference to the root jQuery(document)
var rootjQuery,// A simple way to check for HTML strings
// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
// Strict HTML recognition (#11290: must start with <)
// Shortcut simple #id case for speed
rquickExpr=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,init=jQuery.fn.init=function(selector,context,root){var match,elem;// HANDLE: $(""), $(null), $(undefined), $(false)
if(!selector){return this;}// Method init() accepts an alternate rootjQuery
// so migrate can support jQuery.sub (gh-2101)
root=root||rootjQuery;// Handle HTML strings
if(typeof selector==="string"){if(selector[0]==="<"&&selector[selector.length-1]===">"&&selector.length>=3){// Assume that strings that start and end with <> are HTML and skip the regex check
match=[null,selector,null];}else{match=rquickExpr.exec(selector);}// Match html or make sure no context is specified for #id
if(match&&(match[1]||!context)){// HANDLE: $(html) -> $(array)
if(match[1]){context=context instanceof jQuery?context[0]:context;// Option to run scripts is true for back-compat
// Intentionally let the error be thrown if parseHTML is not present
jQuery.merge(this,jQuery.parseHTML(match[1],context&&context.nodeType?context.ownerDocument||context:document,true));// HANDLE: $(html, props)
if(rsingleTag.test(match[1])&&jQuery.isPlainObject(context)){for(match in context){// Properties of context are called as methods if possible
if(isFunction(this[match])){this[match](context[match]);// ...and otherwise set as attributes
}else{this.attr(match,context[match]);}}}return this;// HANDLE: $(#id)
}else{elem=document.getElementById(match[2]);if(elem){// Inject the element directly into the jQuery object
this[0]=elem;this.length=1;}return this;}// HANDLE: $(expr, $(...))
}else if(!context||context.jquery){return(context||root).find(selector);// HANDLE: $(expr, context)
// (which is just equivalent to: $(context).find(expr)
}else{return this.constructor(context).find(selector);}// HANDLE: $(DOMElement)
}else if(selector.nodeType){this[0]=selector;this.length=1;return this;// HANDLE: $(function)
// Shortcut for document ready
}else if(isFunction(selector)){return root.ready!==undefined?root.ready(selector):// Execute immediately if ready is not present
selector(jQuery);}return jQuery.makeArray(selector,this);};// Give the init function the jQuery prototype for later instantiation
init.prototype=jQuery.fn;// Initialize central reference
rootjQuery=jQuery(document);var rparentsprev=/^(?:parents|prev(?:Until|All))/,// Methods guaranteed to produce a unique set when starting from a unique set
guaranteedUnique={children:true,contents:true,next:true,prev:true};jQuery.fn.extend({has:function has(target){var targets=jQuery(target,this),l=targets.length;return this.filter(function(){var i=0;for(;i<l;i++){if(jQuery.contains(this,targets[i])){return true;}}});},closest:function closest(selectors,context){var cur,i=0,l=this.length,matched=[],targets=typeof selectors!=="string"&&jQuery(selectors);// Positional selectors never match, since there's no _selection_ context
if(!rneedsContext.test(selectors)){for(;i<l;i++){for(cur=this[i];cur&&cur!==context;cur=cur.parentNode){// Always skip document fragments
if(cur.nodeType<11&&(targets?targets.index(cur)>-1:// Don't pass non-elements to Sizzle
cur.nodeType===1&&jQuery.find.matchesSelector(cur,selectors))){matched.push(cur);break;}}}}return this.pushStack(matched.length>1?jQuery.uniqueSort(matched):matched);},// Determine the position of an element within the set
index:function index(elem){// No argument, return index in parent
if(!elem){return this[0]&&this[0].parentNode?this.first().prevAll().length:-1;}// Index in selector
if(typeof elem==="string"){return indexOf.call(jQuery(elem),this[0]);}// Locate the position of the desired element
return indexOf.call(this,// If it receives a jQuery object, the first element is used
elem.jquery?elem[0]:elem);},add:function add(selector,context){return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(),jQuery(selector,context))));},addBack:function addBack(selector){return this.add(selector==null?this.prevObject:this.prevObject.filter(selector));}});function sibling(cur,dir){while((cur=cur[dir])&&cur.nodeType!==1){}return cur;}jQuery.each({parent:function parent(elem){var parent=elem.parentNode;return parent&&parent.nodeType!==11?parent:null;},parents:function parents(elem){return dir(elem,"parentNode");},parentsUntil:function parentsUntil(elem,i,until){return dir(elem,"parentNode",until);},next:function next(elem){return sibling(elem,"nextSibling");},prev:function prev(elem){return sibling(elem,"previousSibling");},nextAll:function nextAll(elem){return dir(elem,"nextSibling");},prevAll:function prevAll(elem){return dir(elem,"previousSibling");},nextUntil:function nextUntil(elem,i,until){return dir(elem,"nextSibling",until);},prevUntil:function prevUntil(elem,i,until){return dir(elem,"previousSibling",until);},siblings:function siblings(elem){return _siblings((elem.parentNode||{}).firstChild,elem);},children:function children(elem){return _siblings(elem.firstChild);},contents:function contents(elem){if(nodeName(elem,"iframe")){return elem.contentDocument;}// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
// Treat the template element as a regular one in browsers that
// don't support it.
if(nodeName(elem,"template")){elem=elem.content||elem;}return jQuery.merge([],elem.childNodes);}},function(name,fn){jQuery.fn[name]=function(until,selector){var matched=jQuery.map(this,fn,until);if(name.slice(-5)!=="Until"){selector=until;}if(selector&&typeof selector==="string"){matched=jQuery.filter(selector,matched);}if(this.length>1){// Remove duplicates
if(!guaranteedUnique[name]){jQuery.uniqueSort(matched);}// Reverse order for parents* and prev-derivatives
if(rparentsprev.test(name)){matched.reverse();}}return this.pushStack(matched);};});var rnothtmlwhite=/[^\x20\t\r\n\f]+/g;// Convert String-formatted options into Object-formatted ones
function createOptions(options){var object={};jQuery.each(options.match(rnothtmlwhite)||[],function(_,flag){object[flag]=true;});return object;}/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */jQuery.Callbacks=function(options){// Convert options from String-formatted to Object-formatted if needed
// (we check in cache first)
options=typeof options==="string"?createOptions(options):jQuery.extend({},options);var// Flag to know if list is currently firing
firing,// Last fire value for non-forgettable lists
memory,// Flag to know if list was already fired
_fired,// Flag to prevent firing
_locked,// Actual callback list
list=[],// Queue of execution data for repeatable lists
queue=[],// Index of currently firing callback (modified by add/remove as needed)
firingIndex=-1,// Fire callbacks
fire=function fire(){// Enforce single-firing
_locked=_locked||options.once;// Execute callbacks for all pending executions,
// respecting firingIndex overrides and runtime changes
_fired=firing=true;for(;queue.length;firingIndex=-1){memory=queue.shift();while(++firingIndex<list.length){// Run callback and check for early termination
if(list[firingIndex].apply(memory[0],memory[1])===false&&options.stopOnFalse){// Jump to end and forget the data so .add doesn't re-fire
firingIndex=list.length;memory=false;}}}// Forget the data if we're done with it
if(!options.memory){memory=false;}firing=false;// Clean up if we're done firing for good
if(_locked){// Keep an empty list if we have data for future add calls
if(memory){list=[];// Otherwise, this object is spent
}else{list="";}}},// Actual Callbacks object
self={// Add a callback or a collection of callbacks to the list
add:function add(){if(list){// If we have memory from a past run, we should fire after adding
if(memory&&!firing){firingIndex=list.length-1;queue.push(memory);}(function add(args){jQuery.each(args,function(_,arg){if(isFunction(arg)){if(!options.unique||!self.has(arg)){list.push(arg);}}else if(arg&&arg.length&&toType(arg)!=="string"){// Inspect recursively
add(arg);}});})(arguments);if(memory&&!firing){fire();}}return this;},// Remove a callback from the list
remove:function remove(){jQuery.each(arguments,function(_,arg){var index;while((index=jQuery.inArray(arg,list,index))>-1){list.splice(index,1);// Handle firing indexes
if(index<=firingIndex){firingIndex--;}}});return this;},// Check if a given callback is in the list.
// If no argument is given, return whether or not list has callbacks attached.
has:function has(fn){return fn?jQuery.inArray(fn,list)>-1:list.length>0;},// Remove all callbacks from the list
empty:function empty(){if(list){list=[];}return this;},// Disable .fire and .add
// Abort any current/pending executions
// Clear all callbacks and values
disable:function disable(){_locked=queue=[];list=memory="";return this;},disabled:function disabled(){return!list;},// Disable .fire
// Also disable .add unless we have memory (since it would have no effect)
// Abort any pending executions
lock:function lock(){_locked=queue=[];if(!memory&&!firing){list=memory="";}return this;},locked:function locked(){return!!_locked;},// Call all callbacks with the given context and arguments
fireWith:function fireWith(context,args){if(!_locked){args=args||[];args=[context,args.slice?args.slice():args];queue.push(args);if(!firing){fire();}}return this;},// Call all the callbacks with the given arguments
fire:function fire(){self.fireWith(this,arguments);return this;},// To know if the callbacks have already been called at least once
fired:function fired(){return!!_fired;}};return self;};function Identity(v){return v;}function Thrower(ex){throw ex;}function adoptValue(value,resolve,reject,noValue){var method;try{// Check for promise aspect first to privilege synchronous behavior
if(value&&isFunction(method=value.promise)){method.call(value).done(resolve).fail(reject);// Other thenables
}else if(value&&isFunction(method=value.then)){method.call(value,resolve,reject);// Other non-thenables
}else{// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
// * false: [ value ].slice( 0 ) => resolve( value )
// * true: [ value ].slice( 1 ) => resolve()
resolve.apply(undefined,[value].slice(noValue));}// For Promises/A+, convert exceptions into rejections
// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
// Deferred#then to conditionally suppress rejection.
}catch(value){// Support: Android 4.0 only
// Strict mode functions invoked without .call/.apply get global-object context
reject.apply(undefined,[value]);}}jQuery.extend({Deferred:function Deferred(func){var tuples=[// action, add listener, callbacks,
// ... .then handlers, argument index, [final state]
["notify","progress",jQuery.Callbacks("memory"),jQuery.Callbacks("memory"),2],["resolve","done",jQuery.Callbacks("once memory"),jQuery.Callbacks("once memory"),0,"resolved"],["reject","fail",jQuery.Callbacks("once memory"),jQuery.Callbacks("once memory"),1,"rejected"]],_state="pending",_promise={state:function state(){return _state;},always:function always(){deferred.done(arguments).fail(arguments);return this;},"catch":function _catch(fn){return _promise.then(null,fn);},// Keep pipe for back-compat
pipe:function pipe()/* fnDone, fnFail, fnProgress */{var fns=arguments;return jQuery.Deferred(function(newDefer){jQuery.each(tuples,function(i,tuple){// Map tuples (progress, done, fail) to arguments (done, fail, progress)
var fn=isFunction(fns[tuple[4]])&&fns[tuple[4]];// deferred.progress(function() { bind to newDefer or newDefer.notify })
// deferred.done(function() { bind to newDefer or newDefer.resolve })
// deferred.fail(function() { bind to newDefer or newDefer.reject })
deferred[tuple[1]](function(){var returned=fn&&fn.apply(this,arguments);if(returned&&isFunction(returned.promise)){returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);}else{newDefer[tuple[0]+"With"](this,fn?[returned]:arguments);}});});fns=null;}).promise();},then:function then(onFulfilled,onRejected,onProgress){var maxDepth=0;function resolve(depth,deferred,handler,special){return function(){var that=this,args=arguments,mightThrow=function mightThrow(){var returned,then;// Support: Promises/A+ section 2.3.3.3.3
// https://promisesaplus.com/#point-59
// Ignore double-resolution attempts
if(depth<maxDepth){return;}returned=handler.apply(that,args);// Support: Promises/A+ section 2.3.1
// https://promisesaplus.com/#point-48
if(returned===deferred.promise()){throw new TypeError("Thenable self-resolution");}// Support: Promises/A+ sections 2.3.3.1, 3.5
// https://promisesaplus.com/#point-54
// https://promisesaplus.com/#point-75
// Retrieve `then` only once
then=returned&&(// Support: Promises/A+ section 2.3.4
// https://promisesaplus.com/#point-64
// Only check objects and functions for thenability
(typeof returned==="undefined"?"undefined":_typeof(returned))==="object"||typeof returned==="function")&&returned.then;// Handle a returned thenable
if(isFunction(then)){// Special processors (notify) just wait for resolution
if(special){then.call(returned,resolve(maxDepth,deferred,Identity,special),resolve(maxDepth,deferred,Thrower,special));// Normal processors (resolve) also hook into progress
}else{// ...and disregard older resolution values
maxDepth++;then.call(returned,resolve(maxDepth,deferred,Identity,special),resolve(maxDepth,deferred,Thrower,special),resolve(maxDepth,deferred,Identity,deferred.notifyWith));}// Handle all other returned values
}else{// Only substitute handlers pass on context
// and multiple values (non-spec behavior)
if(handler!==Identity){that=undefined;args=[returned];}// Process the value(s)
// Default process is resolve
(special||deferred.resolveWith)(that,args);}},// Only normal processors (resolve) catch and reject exceptions
process=special?mightThrow:function(){try{mightThrow();}catch(e){if(jQuery.Deferred.exceptionHook){jQuery.Deferred.exceptionHook(e,process.stackTrace);}// Support: Promises/A+ section 2.3.3.3.4.1
// https://promisesaplus.com/#point-61
// Ignore post-resolution exceptions
if(depth+1>=maxDepth){// Only substitute handlers pass on context
// and multiple values (non-spec behavior)
if(handler!==Thrower){that=undefined;args=[e];}deferred.rejectWith(that,args);}}};// Support: Promises/A+ section 2.3.3.3.1
// https://promisesaplus.com/#point-57
// Re-resolve promises immediately to dodge false rejection from
// subsequent errors
if(depth){process();}else{// Call an optional hook to record the stack, in case of exception
// since it's otherwise lost when execution goes async
if(jQuery.Deferred.getStackHook){process.stackTrace=jQuery.Deferred.getStackHook();}window.setTimeout(process);}};}return jQuery.Deferred(function(newDefer){// progress_handlers.add( ... )
tuples[0][3].add(resolve(0,newDefer,isFunction(onProgress)?onProgress:Identity,newDefer.notifyWith));// fulfilled_handlers.add( ... )
tuples[1][3].add(resolve(0,newDefer,isFunction(onFulfilled)?onFulfilled:Identity));// rejected_handlers.add( ... )
tuples[2][3].add(resolve(0,newDefer,isFunction(onRejected)?onRejected:Thrower));}).promise();},// Get a promise for this deferred
// If obj is provided, the promise aspect is added to the object
promise:function promise(obj){return obj!=null?jQuery.extend(obj,_promise):_promise;}},deferred={};// Add list-specific methods
jQuery.each(tuples,function(i,tuple){var list=tuple[2],stateString=tuple[5];// promise.progress = list.add
// promise.done = list.add
// promise.fail = list.add
_promise[tuple[1]]=list.add;// Handle state
if(stateString){list.add(function(){// state = "resolved" (i.e., fulfilled)
// state = "rejected"
_state=stateString;},// rejected_callbacks.disable
// fulfilled_callbacks.disable
tuples[3-i][2].disable,// rejected_handlers.disable
// fulfilled_handlers.disable
tuples[3-i][3].disable,// progress_callbacks.lock
tuples[0][2].lock,// progress_handlers.lock
tuples[0][3].lock);}// progress_handlers.fire
// fulfilled_handlers.fire
// rejected_handlers.fire
list.add(tuple[3].fire);// deferred.notify = function() { deferred.notifyWith(...) }
// deferred.resolve = function() { deferred.resolveWith(...) }
// deferred.reject = function() { deferred.rejectWith(...) }
deferred[tuple[0]]=function(){deferred[tuple[0]+"With"](this===deferred?undefined:this,arguments);return this;};// deferred.notifyWith = list.fireWith
// deferred.resolveWith = list.fireWith
// deferred.rejectWith = list.fireWith
deferred[tuple[0]+"With"]=list.fireWith;});// Make the deferred a promise
_promise.promise(deferred);// Call given func if any
if(func){func.call(deferred,deferred);}// All done!
return deferred;},// Deferred helper
when:function when(singleValue){var// count of uncompleted subordinates
remaining=arguments.length,// count of unprocessed arguments
i=remaining,// subordinate fulfillment data
resolveContexts=Array(i),resolveValues=_slice.call(arguments),// the master Deferred
master=jQuery.Deferred(),// subordinate callback factory
updateFunc=function updateFunc(i){return function(value){resolveContexts[i]=this;resolveValues[i]=arguments.length>1?_slice.call(arguments):value;if(! --remaining){master.resolveWith(resolveContexts,resolveValues);}};};// Single- and empty arguments are adopted like Promise.resolve
if(remaining<=1){adoptValue(singleValue,master.done(updateFunc(i)).resolve,master.reject,!remaining);// Use .then() to unwrap secondary thenables (cf. gh-3000)
if(master.state()==="pending"||isFunction(resolveValues[i]&&resolveValues[i].then)){return master.then();}}// Multiple arguments are aggregated like Promise.all array elements
while(i--){adoptValue(resolveValues[i],updateFunc(i),master.reject);}return master.promise();}});// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;jQuery.Deferred.exceptionHook=function(error,stack){// Support: IE 8 - 9 only
// Console exists when dev tools are open, which can happen at any time
if(window.console&&window.console.warn&&error&&rerrorNames.test(error.name)){window.console.warn("jQuery.Deferred exception: "+error.message,error.stack,stack);}};jQuery.readyException=function(error){window.setTimeout(function(){throw error;});};// The deferred used on DOM ready
var readyList=jQuery.Deferred();jQuery.fn.ready=function(fn){readyList.then(fn)// Wrap jQuery.readyException in a function so that the lookup
// happens at the time of error handling instead of callback
// registration.
.catch(function(error){jQuery.readyException(error);});return this;};jQuery.extend({// Is the DOM ready to be used? Set to true once it occurs.
isReady:false,// A counter to track how many items to wait for before
// the ready event fires. See #6781
readyWait:1,// Handle when the DOM is ready
ready:function ready(wait){// Abort if there are pending holds or we're already ready
if(wait===true?--jQuery.readyWait:jQuery.isReady){return;}// Remember that the DOM is ready
jQuery.isReady=true;// If a normal DOM Ready event fired, decrement, and wait if need be
if(wait!==true&&--jQuery.readyWait>0){return;}// If there are functions bound, to execute
readyList.resolveWith(document,[jQuery]);}});jQuery.ready.then=readyList.then;// The ready event handler and self cleanup method
function completed(){document.removeEventListener("DOMContentLoaded",completed);window.removeEventListener("load",completed);jQuery.ready();}// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if(document.readyState==="complete"||document.readyState!=="loading"&&!document.documentElement.doScroll){// Handle it asynchronously to allow scripts the opportunity to delay ready
window.setTimeout(jQuery.ready);}else{// Use the handy event callback
document.addEventListener("DOMContentLoaded",completed);// A fallback to window.onload, that will always work
window.addEventListener("load",completed);}// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access=function access(elems,fn,key,value,chainable,emptyGet,raw){var i=0,len=elems.length,bulk=key==null;// Sets many values
if(toType(key)==="object"){chainable=true;for(i in key){access(elems,fn,i,key[i],true,emptyGet,raw);}// Sets one value
}else if(value!==undefined){chainable=true;if(!isFunction(value)){raw=true;}if(bulk){// Bulk operations run against the entire set
if(raw){fn.call(elems,value);fn=null;// ...except when executing function values
}else{bulk=fn;fn=function fn(elem,key,value){return bulk.call(jQuery(elem),value);};}}if(fn){for(;i<len;i++){fn(elems[i],key,raw?value:value.call(elems[i],i,fn(elems[i],key)));}}}if(chainable){return elems;}// Gets
if(bulk){return fn.call(elems);}return len?fn(elems[0],key):emptyGet;};// Matches dashed string for camelizing
var rmsPrefix=/^-ms-/,rdashAlpha=/-([a-z])/g;// Used by camelCase as callback to replace()
function fcamelCase(all,letter){return letter.toUpperCase();}// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase(string){return string.replace(rmsPrefix,"ms-").replace(rdashAlpha,fcamelCase);}var acceptData=function acceptData(owner){// Accepts only:
//  - Node
//    - Node.ELEMENT_NODE
//    - Node.DOCUMENT_NODE
//  - Object
//    - Any
return owner.nodeType===1||owner.nodeType===9||!+owner.nodeType;};function Data(){this.expando=jQuery.expando+Data.uid++;}Data.uid=1;Data.prototype={cache:function cache(owner){// Check if the owner object already has a cache
var value=owner[this.expando];// If not, create one
if(!value){value={};// We can accept data for non-element nodes in modern browsers,
// but we should not, see #8335.
// Always return an empty object.
if(acceptData(owner)){// If it is a node unlikely to be stringify-ed or looped over
// use plain assignment
if(owner.nodeType){owner[this.expando]=value;// Otherwise secure it in a non-enumerable property
// configurable must be true to allow the property to be
// deleted when data is removed
}else{Object.defineProperty(owner,this.expando,{value:value,configurable:true});}}}return value;},set:function set(owner,data,value){var prop,cache=this.cache(owner);// Handle: [ owner, key, value ] args
// Always use camelCase key (gh-2257)
if(typeof data==="string"){cache[camelCase(data)]=value;// Handle: [ owner, { properties } ] args
}else{// Copy the properties one-by-one to the cache object
for(prop in data){cache[camelCase(prop)]=data[prop];}}return cache;},get:function get(owner,key){return key===undefined?this.cache(owner):// Always use camelCase key (gh-2257)
owner[this.expando]&&owner[this.expando][camelCase(key)];},access:function access(owner,key,value){// In cases where either:
//
//   1. No key was specified
//   2. A string key was specified, but no value provided
//
// Take the "read" path and allow the get method to determine
// which value to return, respectively either:
//
//   1. The entire cache object
//   2. The data stored at the key
//
if(key===undefined||key&&typeof key==="string"&&value===undefined){return this.get(owner,key);}// When the key is not a string, or both a key and value
// are specified, set or extend (existing objects) with either:
//
//   1. An object of properties
//   2. A key and value
//
this.set(owner,key,value);// Since the "set" path can have two possible entry points
// return the expected data based on which path was taken[*]
return value!==undefined?value:key;},remove:function remove(owner,key){var i,cache=owner[this.expando];if(cache===undefined){return;}if(key!==undefined){// Support array or space separated string of keys
if(Array.isArray(key)){// If key is an array of keys...
// We always set camelCase keys, so remove that.
key=key.map(camelCase);}else{key=camelCase(key);// If a key with the spaces exists, use it.
// Otherwise, create an array by matching non-whitespace
key=key in cache?[key]:key.match(rnothtmlwhite)||[];}i=key.length;while(i--){delete cache[key[i]];}}// Remove the expando if there's no more data
if(key===undefined||jQuery.isEmptyObject(cache)){// Support: Chrome <=35 - 45
// Webkit & Blink performance suffers when deleting properties
// from DOM nodes, so set to undefined instead
// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
if(owner.nodeType){owner[this.expando]=undefined;}else{delete owner[this.expando];}}},hasData:function hasData(owner){var cache=owner[this.expando];return cache!==undefined&&!jQuery.isEmptyObject(cache);}};var dataPriv=new Data();var dataUser=new Data();//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014
var rbrace=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,rmultiDash=/[A-Z]/g;function getData(data){if(data==="true"){return true;}if(data==="false"){return false;}if(data==="null"){return null;}// Only convert to a number if it doesn't change the string
if(data===+data+""){return+data;}if(rbrace.test(data)){return JSON.parse(data);}return data;}function dataAttr(elem,key,data){var name;// If nothing was found internally, try to fetch any
// data from the HTML5 data-* attribute
if(data===undefined&&elem.nodeType===1){name="data-"+key.replace(rmultiDash,"-$&").toLowerCase();data=elem.getAttribute(name);if(typeof data==="string"){try{data=getData(data);}catch(e){}// Make sure we set the data so it isn't changed later
dataUser.set(elem,key,data);}else{data=undefined;}}return data;}jQuery.extend({hasData:function hasData(elem){return dataUser.hasData(elem)||dataPriv.hasData(elem);},data:function data(elem,name,_data){return dataUser.access(elem,name,_data);},removeData:function removeData(elem,name){dataUser.remove(elem,name);},// TODO: Now that all calls to _data and _removeData have been replaced
// with direct calls to dataPriv methods, these can be deprecated.
_data:function _data(elem,name,data){return dataPriv.access(elem,name,data);},_removeData:function _removeData(elem,name){dataPriv.remove(elem,name);}});jQuery.fn.extend({data:function data(key,value){var i,name,data,elem=this[0],attrs=elem&&elem.attributes;// Gets all values
if(key===undefined){if(this.length){data=dataUser.get(elem);if(elem.nodeType===1&&!dataPriv.get(elem,"hasDataAttrs")){i=attrs.length;while(i--){// Support: IE 11 only
// The attrs elements can be null (#14894)
if(attrs[i]){name=attrs[i].name;if(name.indexOf("data-")===0){name=camelCase(name.slice(5));dataAttr(elem,name,data[name]);}}}dataPriv.set(elem,"hasDataAttrs",true);}}return data;}// Sets multiple values
if((typeof key==="undefined"?"undefined":_typeof(key))==="object"){return this.each(function(){dataUser.set(this,key);});}return access(this,function(value){var data;// The calling jQuery object (element matches) is not empty
// (and therefore has an element appears at this[ 0 ]) and the
// `value` parameter was not undefined. An empty jQuery object
// will result in `undefined` for elem = this[ 0 ] which will
// throw an exception if an attempt to read a data cache is made.
if(elem&&value===undefined){// Attempt to get data from the cache
// The key will always be camelCased in Data
data=dataUser.get(elem,key);if(data!==undefined){return data;}// Attempt to "discover" the data in
// HTML5 custom data-* attrs
data=dataAttr(elem,key);if(data!==undefined){return data;}// We tried really hard, but the data doesn't exist.
return;}// Set the data...
this.each(function(){// We always store the camelCased key
dataUser.set(this,key,value);});},null,value,arguments.length>1,null,true);},removeData:function removeData(key){return this.each(function(){dataUser.remove(this,key);});}});jQuery.extend({queue:function queue(elem,type,data){var queue;if(elem){type=(type||"fx")+"queue";queue=dataPriv.get(elem,type);// Speed up dequeue by getting out quickly if this is just a lookup
if(data){if(!queue||Array.isArray(data)){queue=dataPriv.access(elem,type,jQuery.makeArray(data));}else{queue.push(data);}}return queue||[];}},dequeue:function dequeue(elem,type){type=type||"fx";var queue=jQuery.queue(elem,type),startLength=queue.length,fn=queue.shift(),hooks=jQuery._queueHooks(elem,type),next=function next(){jQuery.dequeue(elem,type);};// If the fx queue is dequeued, always remove the progress sentinel
if(fn==="inprogress"){fn=queue.shift();startLength--;}if(fn){// Add a progress sentinel to prevent the fx queue from being
// automatically dequeued
if(type==="fx"){queue.unshift("inprogress");}// Clear up the last queue stop function
delete hooks.stop;fn.call(elem,next,hooks);}if(!startLength&&hooks){hooks.empty.fire();}},// Not public - generate a queueHooks object, or return the current one
_queueHooks:function _queueHooks(elem,type){var key=type+"queueHooks";return dataPriv.get(elem,key)||dataPriv.access(elem,key,{empty:jQuery.Callbacks("once memory").add(function(){dataPriv.remove(elem,[type+"queue",key]);})});}});jQuery.fn.extend({queue:function queue(type,data){var setter=2;if(typeof type!=="string"){data=type;type="fx";setter--;}if(arguments.length<setter){return jQuery.queue(this[0],type);}return data===undefined?this:this.each(function(){var queue=jQuery.queue(this,type,data);// Ensure a hooks for this queue
jQuery._queueHooks(this,type);if(type==="fx"&&queue[0]!=="inprogress"){jQuery.dequeue(this,type);}});},dequeue:function dequeue(type){return this.each(function(){jQuery.dequeue(this,type);});},clearQueue:function clearQueue(type){return this.queue(type||"fx",[]);},// Get a promise resolved when queues of a certain type
// are emptied (fx is the type by default)
promise:function promise(type,obj){var tmp,count=1,defer=jQuery.Deferred(),elements=this,i=this.length,resolve=function resolve(){if(! --count){defer.resolveWith(elements,[elements]);}};if(typeof type!=="string"){obj=type;type=undefined;}type=type||"fx";while(i--){tmp=dataPriv.get(elements[i],type+"queueHooks");if(tmp&&tmp.empty){count++;tmp.empty.add(resolve);}}resolve();return defer.promise(obj);}});var pnum=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;var rcssNum=new RegExp("^(?:([+-])=|)("+pnum+")([a-z%]*)$","i");var cssExpand=["Top","Right","Bottom","Left"];var isHiddenWithinTree=function isHiddenWithinTree(elem,el){// isHiddenWithinTree might be called from jQuery#filter function;
// in that case, element will be second argument
elem=el||elem;// Inline style trumps all
return elem.style.display==="none"||elem.style.display===""&&// Otherwise, check computed style
// Support: Firefox <=43 - 45
// Disconnected elements can have computed display: none, so first confirm that elem is
// in the document.
jQuery.contains(elem.ownerDocument,elem)&&jQuery.css(elem,"display")==="none";};var swap=function swap(elem,options,callback,args){var ret,name,old={};// Remember the old values, and insert the new ones
for(name in options){old[name]=elem.style[name];elem.style[name]=options[name];}ret=callback.apply(elem,args||[]);// Revert the old values
for(name in options){elem.style[name]=old[name];}return ret;};function adjustCSS(elem,prop,valueParts,tween){var adjusted,scale,maxIterations=20,currentValue=tween?function(){return tween.cur();}:function(){return jQuery.css(elem,prop,"");},initial=currentValue(),unit=valueParts&&valueParts[3]||(jQuery.cssNumber[prop]?"":"px"),// Starting value computation is required for potential unit mismatches
initialInUnit=(jQuery.cssNumber[prop]||unit!=="px"&&+initial)&&rcssNum.exec(jQuery.css(elem,prop));if(initialInUnit&&initialInUnit[3]!==unit){// Support: Firefox <=54
// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
initial=initial/2;// Trust units reported by jQuery.css
unit=unit||initialInUnit[3];// Iteratively approximate from a nonzero starting point
initialInUnit=+initial||1;while(maxIterations--){// Evaluate and update our best guess (doubling guesses that zero out).
// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
jQuery.style(elem,prop,initialInUnit+unit);if((1-scale)*(1-(scale=currentValue()/initial||0.5))<=0){maxIterations=0;}initialInUnit=initialInUnit/scale;}initialInUnit=initialInUnit*2;jQuery.style(elem,prop,initialInUnit+unit);// Make sure we update the tween properties later on
valueParts=valueParts||[];}if(valueParts){initialInUnit=+initialInUnit||+initial||0;// Apply relative offset (+=/-=) if specified
adjusted=valueParts[1]?initialInUnit+(valueParts[1]+1)*valueParts[2]:+valueParts[2];if(tween){tween.unit=unit;tween.start=initialInUnit;tween.end=adjusted;}}return adjusted;}var defaultDisplayMap={};function getDefaultDisplay(elem){var temp,doc=elem.ownerDocument,nodeName=elem.nodeName,display=defaultDisplayMap[nodeName];if(display){return display;}temp=doc.body.appendChild(doc.createElement(nodeName));display=jQuery.css(temp,"display");temp.parentNode.removeChild(temp);if(display==="none"){display="block";}defaultDisplayMap[nodeName]=display;return display;}function showHide(elements,show){var display,elem,values=[],index=0,length=elements.length;// Determine new display value for elements that need to change
for(;index<length;index++){elem=elements[index];if(!elem.style){continue;}display=elem.style.display;if(show){// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
// check is required in this first loop unless we have a nonempty display value (either
// inline or about-to-be-restored)
if(display==="none"){values[index]=dataPriv.get(elem,"display")||null;if(!values[index]){elem.style.display="";}}if(elem.style.display===""&&isHiddenWithinTree(elem)){values[index]=getDefaultDisplay(elem);}}else{if(display!=="none"){values[index]="none";// Remember what we're overwriting
dataPriv.set(elem,"display",display);}}}// Set the display of the elements in a second loop to avoid constant reflow
for(index=0;index<length;index++){if(values[index]!=null){elements[index].style.display=values[index];}}return elements;}jQuery.fn.extend({show:function show(){return showHide(this,true);},hide:function hide(){return showHide(this);},toggle:function toggle(state){if(typeof state==="boolean"){return state?this.show():this.hide();}return this.each(function(){if(isHiddenWithinTree(this)){jQuery(this).show();}else{jQuery(this).hide();}});}});var rcheckableType=/^(?:checkbox|radio)$/i;var rtagName=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i;var rscriptType=/^$|^module$|\/(?:java|ecma)script/i;// We have to close these tags to support XHTML (#13200)
var wrapMap={// Support: IE <=9 only
option:[1,"<select multiple='multiple'>","</select>"],// XHTML parsers do not magically insert elements in the
// same way that tag soup parsers do. So we cannot shorten
// this by omitting <tbody> or other required elements.
thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};// Support: IE <=9 only
wrapMap.optgroup=wrapMap.option;wrapMap.tbody=wrapMap.tfoot=wrapMap.colgroup=wrapMap.caption=wrapMap.thead;wrapMap.th=wrapMap.td;function getAll(context,tag){// Support: IE <=9 - 11 only
// Use typeof to avoid zero-argument method invocation on host objects (#15151)
var ret;if(typeof context.getElementsByTagName!=="undefined"){ret=context.getElementsByTagName(tag||"*");}else if(typeof context.querySelectorAll!=="undefined"){ret=context.querySelectorAll(tag||"*");}else{ret=[];}if(tag===undefined||tag&&nodeName(context,tag)){return jQuery.merge([context],ret);}return ret;}// Mark scripts as having already been evaluated
function setGlobalEval(elems,refElements){var i=0,l=elems.length;for(;i<l;i++){dataPriv.set(elems[i],"globalEval",!refElements||dataPriv.get(refElements[i],"globalEval"));}}var rhtml=/<|&#?\w+;/;function buildFragment(elems,context,scripts,selection,ignored){var elem,tmp,tag,wrap,contains,j,fragment=context.createDocumentFragment(),nodes=[],i=0,l=elems.length;for(;i<l;i++){elem=elems[i];if(elem||elem===0){// Add nodes directly
if(toType(elem)==="object"){// Support: Android <=4.0 only, PhantomJS 1 only
// push.apply(_, arraylike) throws on ancient WebKit
jQuery.merge(nodes,elem.nodeType?[elem]:elem);// Convert non-html into a text node
}else if(!rhtml.test(elem)){nodes.push(context.createTextNode(elem));// Convert html into DOM nodes
}else{tmp=tmp||fragment.appendChild(context.createElement("div"));// Deserialize a standard representation
tag=(rtagName.exec(elem)||["",""])[1].toLowerCase();wrap=wrapMap[tag]||wrapMap._default;tmp.innerHTML=wrap[1]+jQuery.htmlPrefilter(elem)+wrap[2];// Descend through wrappers to the right content
j=wrap[0];while(j--){tmp=tmp.lastChild;}// Support: Android <=4.0 only, PhantomJS 1 only
// push.apply(_, arraylike) throws on ancient WebKit
jQuery.merge(nodes,tmp.childNodes);// Remember the top-level container
tmp=fragment.firstChild;// Ensure the created nodes are orphaned (#12392)
tmp.textContent="";}}}// Remove wrapper from fragment
fragment.textContent="";i=0;while(elem=nodes[i++]){// Skip elements already in the context collection (trac-4087)
if(selection&&jQuery.inArray(elem,selection)>-1){if(ignored){ignored.push(elem);}continue;}contains=jQuery.contains(elem.ownerDocument,elem);// Append to fragment
tmp=getAll(fragment.appendChild(elem),"script");// Preserve script evaluation history
if(contains){setGlobalEval(tmp);}// Capture executables
if(scripts){j=0;while(elem=tmp[j++]){if(rscriptType.test(elem.type||"")){scripts.push(elem);}}}}return fragment;}(function(){var fragment=document.createDocumentFragment(),div=fragment.appendChild(document.createElement("div")),input=document.createElement("input");// Support: Android 4.0 - 4.3 only
// Check state lost if the name is set (#11217)
// Support: Windows Web Apps (WWA)
// `name` and `type` must use .setAttribute for WWA (#14901)
input.setAttribute("type","radio");input.setAttribute("checked","checked");input.setAttribute("name","t");div.appendChild(input);// Support: Android <=4.1 only
// Older WebKit doesn't clone checked state correctly in fragments
support.checkClone=div.cloneNode(true).cloneNode(true).lastChild.checked;// Support: IE <=11 only
// Make sure textarea (and checkbox) defaultValue is properly cloned
div.innerHTML="<textarea>x</textarea>";support.noCloneChecked=!!div.cloneNode(true).lastChild.defaultValue;})();var documentElement=document.documentElement;var rkeyEvent=/^key/,rmouseEvent=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,rtypenamespace=/^([^.]*)(?:\.(.+)|)/;function returnTrue(){return true;}function returnFalse(){return false;}// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement(){try{return document.activeElement;}catch(err){}}function _on(elem,types,selector,data,fn,one){var origFn,type;// Types can be a map of types/handlers
if((typeof types==="undefined"?"undefined":_typeof(types))==="object"){// ( types-Object, selector, data )
if(typeof selector!=="string"){// ( types-Object, data )
data=data||selector;selector=undefined;}for(type in types){_on(elem,type,selector,data,types[type],one);}return elem;}if(data==null&&fn==null){// ( types, fn )
fn=selector;data=selector=undefined;}else if(fn==null){if(typeof selector==="string"){// ( types, selector, fn )
fn=data;data=undefined;}else{// ( types, data, fn )
fn=data;data=selector;selector=undefined;}}if(fn===false){fn=returnFalse;}else if(!fn){return elem;}if(one===1){origFn=fn;fn=function fn(event){// Can use an empty set, since event contains the info
jQuery().off(event);return origFn.apply(this,arguments);};// Use same guid so caller can remove using origFn
fn.guid=origFn.guid||(origFn.guid=jQuery.guid++);}return elem.each(function(){jQuery.event.add(this,types,fn,data,selector);});}/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */jQuery.event={global:{},add:function add(elem,types,handler,data,selector){var handleObjIn,eventHandle,tmp,events,t,handleObj,special,handlers,type,namespaces,origType,elemData=dataPriv.get(elem);// Don't attach events to noData or text/comment nodes (but allow plain objects)
if(!elemData){return;}// Caller can pass in an object of custom data in lieu of the handler
if(handler.handler){handleObjIn=handler;handler=handleObjIn.handler;selector=handleObjIn.selector;}// Ensure that invalid selectors throw exceptions at attach time
// Evaluate against documentElement in case elem is a non-element node (e.g., document)
if(selector){jQuery.find.matchesSelector(documentElement,selector);}// Make sure that the handler has a unique ID, used to find/remove it later
if(!handler.guid){handler.guid=jQuery.guid++;}// Init the element's event structure and main handler, if this is the first
if(!(events=elemData.events)){events=elemData.events={};}if(!(eventHandle=elemData.handle)){eventHandle=elemData.handle=function(e){// Discard the second event of a jQuery.event.trigger() and
// when an event is called after a page has unloaded
return typeof jQuery!=="undefined"&&jQuery.event.triggered!==e.type?jQuery.event.dispatch.apply(elem,arguments):undefined;};}// Handle multiple events separated by a space
types=(types||"").match(rnothtmlwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort();// There *must* be a type, no attaching namespace-only handlers
if(!type){continue;}// If event changes its type, use the special event handlers for the changed type
special=jQuery.event.special[type]||{};// If selector defined, determine special event api type, otherwise given type
type=(selector?special.delegateType:special.bindType)||type;// Update special based on newly reset type
special=jQuery.event.special[type]||{};// handleObj is passed to all event handlers
handleObj=jQuery.extend({type:type,origType:origType,data:data,handler:handler,guid:handler.guid,selector:selector,needsContext:selector&&jQuery.expr.match.needsContext.test(selector),namespace:namespaces.join(".")},handleObjIn);// Init the event handler queue if we're the first
if(!(handlers=events[type])){handlers=events[type]=[];handlers.delegateCount=0;// Only use addEventListener if the special events handler returns false
if(!special.setup||special.setup.call(elem,data,namespaces,eventHandle)===false){if(elem.addEventListener){elem.addEventListener(type,eventHandle);}}}if(special.add){special.add.call(elem,handleObj);if(!handleObj.handler.guid){handleObj.handler.guid=handler.guid;}}// Add to the element's handler list, delegates in front
if(selector){handlers.splice(handlers.delegateCount++,0,handleObj);}else{handlers.push(handleObj);}// Keep track of which events have ever been used, for event optimization
jQuery.event.global[type]=true;}},// Detach an event or set of events from an element
remove:function remove(elem,types,handler,selector,mappedTypes){var j,origCount,tmp,events,t,handleObj,special,handlers,type,namespaces,origType,elemData=dataPriv.hasData(elem)&&dataPriv.get(elem);if(!elemData||!(events=elemData.events)){return;}// Once for each type.namespace in types; type may be omitted
types=(types||"").match(rnothtmlwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort();// Unbind all events (on this namespace, if provided) for the element
if(!type){for(type in events){jQuery.event.remove(elem,type+types[t],handler,selector,true);}continue;}special=jQuery.event.special[type]||{};type=(selector?special.delegateType:special.bindType)||type;handlers=events[type]||[];tmp=tmp[2]&&new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)");// Remove matching events
origCount=j=handlers.length;while(j--){handleObj=handlers[j];if((mappedTypes||origType===handleObj.origType)&&(!handler||handler.guid===handleObj.guid)&&(!tmp||tmp.test(handleObj.namespace))&&(!selector||selector===handleObj.selector||selector==="**"&&handleObj.selector)){handlers.splice(j,1);if(handleObj.selector){handlers.delegateCount--;}if(special.remove){special.remove.call(elem,handleObj);}}}// Remove generic event handler if we removed something and no more handlers exist
// (avoids potential for endless recursion during removal of special event handlers)
if(origCount&&!handlers.length){if(!special.teardown||special.teardown.call(elem,namespaces,elemData.handle)===false){jQuery.removeEvent(elem,type,elemData.handle);}delete events[type];}}// Remove data and the expando if it's no longer used
if(jQuery.isEmptyObject(events)){dataPriv.remove(elem,"handle events");}},dispatch:function dispatch(nativeEvent){// Make a writable jQuery.Event from the native event object
var event=jQuery.event.fix(nativeEvent);var i,j,ret,matched,handleObj,handlerQueue,args=new Array(arguments.length),handlers=(dataPriv.get(this,"events")||{})[event.type]||[],special=jQuery.event.special[event.type]||{};// Use the fix-ed jQuery.Event rather than the (read-only) native event
args[0]=event;for(i=1;i<arguments.length;i++){args[i]=arguments[i];}event.delegateTarget=this;// Call the preDispatch hook for the mapped type, and let it bail if desired
if(special.preDispatch&&special.preDispatch.call(this,event)===false){return;}// Determine handlers
handlerQueue=jQuery.event.handlers.call(this,event,handlers);// Run delegates first; they may want to stop propagation beneath us
i=0;while((matched=handlerQueue[i++])&&!event.isPropagationStopped()){event.currentTarget=matched.elem;j=0;while((handleObj=matched.handlers[j++])&&!event.isImmediatePropagationStopped()){// Triggered event must either 1) have no namespace, or 2) have namespace(s)
// a subset or equal to those in the bound event (both can have no namespace).
if(!event.rnamespace||event.rnamespace.test(handleObj.namespace)){event.handleObj=handleObj;event.data=handleObj.data;ret=((jQuery.event.special[handleObj.origType]||{}).handle||handleObj.handler).apply(matched.elem,args);if(ret!==undefined){if((event.result=ret)===false){event.preventDefault();event.stopPropagation();}}}}}// Call the postDispatch hook for the mapped type
if(special.postDispatch){special.postDispatch.call(this,event);}return event.result;},handlers:function handlers(event,_handlers){var i,handleObj,sel,matchedHandlers,matchedSelectors,handlerQueue=[],delegateCount=_handlers.delegateCount,cur=event.target;// Find delegate handlers
if(delegateCount&&// Support: IE <=9
// Black-hole SVG <use> instance trees (trac-13180)
cur.nodeType&&// Support: Firefox <=42
// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
// Support: IE 11 only
// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
!(event.type==="click"&&event.button>=1)){for(;cur!==this;cur=cur.parentNode||this){// Don't check non-elements (#13208)
// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
if(cur.nodeType===1&&!(event.type==="click"&&cur.disabled===true)){matchedHandlers=[];matchedSelectors={};for(i=0;i<delegateCount;i++){handleObj=_handlers[i];// Don't conflict with Object.prototype properties (#13203)
sel=handleObj.selector+" ";if(matchedSelectors[sel]===undefined){matchedSelectors[sel]=handleObj.needsContext?jQuery(sel,this).index(cur)>-1:jQuery.find(sel,this,null,[cur]).length;}if(matchedSelectors[sel]){matchedHandlers.push(handleObj);}}if(matchedHandlers.length){handlerQueue.push({elem:cur,handlers:matchedHandlers});}}}}// Add the remaining (directly-bound) handlers
cur=this;if(delegateCount<_handlers.length){handlerQueue.push({elem:cur,handlers:_handlers.slice(delegateCount)});}return handlerQueue;},addProp:function addProp(name,hook){Object.defineProperty(jQuery.Event.prototype,name,{enumerable:true,configurable:true,get:isFunction(hook)?function(){if(this.originalEvent){return hook(this.originalEvent);}}:function(){if(this.originalEvent){return this.originalEvent[name];}},set:function set(value){Object.defineProperty(this,name,{enumerable:true,configurable:true,writable:true,value:value});}});},fix:function fix(originalEvent){return originalEvent[jQuery.expando]?originalEvent:new jQuery.Event(originalEvent);},special:{load:{// Prevent triggered image.load events from bubbling to window.load
noBubble:true},focus:{// Fire native event if possible so blur/focus sequence is correct
trigger:function trigger(){if(this!==safeActiveElement()&&this.focus){this.focus();return false;}},delegateType:"focusin"},blur:{trigger:function trigger(){if(this===safeActiveElement()&&this.blur){this.blur();return false;}},delegateType:"focusout"},click:{// For checkbox, fire native event so checked state will be right
trigger:function trigger(){if(this.type==="checkbox"&&this.click&&nodeName(this,"input")){this.click();return false;}},// For cross-browser consistency, don't fire native .click() on links
_default:function _default(event){return nodeName(event.target,"a");}},beforeunload:{postDispatch:function postDispatch(event){// Support: Firefox 20+
// Firefox doesn't alert if the returnValue field is not set.
if(event.result!==undefined&&event.originalEvent){event.originalEvent.returnValue=event.result;}}}}};jQuery.removeEvent=function(elem,type,handle){// This "if" is needed for plain objects
if(elem.removeEventListener){elem.removeEventListener(type,handle);}};jQuery.Event=function(src,props){// Allow instantiation without the 'new' keyword
if(!(this instanceof jQuery.Event)){return new jQuery.Event(src,props);}// Event object
if(src&&src.type){this.originalEvent=src;this.type=src.type;// Events bubbling up the document may have been marked as prevented
// by a handler lower down the tree; reflect the correct value.
this.isDefaultPrevented=src.defaultPrevented||src.defaultPrevented===undefined&&// Support: Android <=2.3 only
src.returnValue===false?returnTrue:returnFalse;// Create target properties
// Support: Safari <=6 - 7 only
// Target should not be a text node (#504, #13143)
this.target=src.target&&src.target.nodeType===3?src.target.parentNode:src.target;this.currentTarget=src.currentTarget;this.relatedTarget=src.relatedTarget;// Event type
}else{this.type=src;}// Put explicitly provided properties onto the event object
if(props){jQuery.extend(this,props);}// Create a timestamp if incoming event doesn't have one
this.timeStamp=src&&src.timeStamp||Date.now();// Mark it as fixed
this[jQuery.expando]=true;};// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype={constructor:jQuery.Event,isDefaultPrevented:returnFalse,isPropagationStopped:returnFalse,isImmediatePropagationStopped:returnFalse,isSimulated:false,preventDefault:function preventDefault(){var e=this.originalEvent;this.isDefaultPrevented=returnTrue;if(e&&!this.isSimulated){e.preventDefault();}},stopPropagation:function stopPropagation(){var e=this.originalEvent;this.isPropagationStopped=returnTrue;if(e&&!this.isSimulated){e.stopPropagation();}},stopImmediatePropagation:function stopImmediatePropagation(){var e=this.originalEvent;this.isImmediatePropagationStopped=returnTrue;if(e&&!this.isSimulated){e.stopImmediatePropagation();}this.stopPropagation();}};// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each({altKey:true,bubbles:true,cancelable:true,changedTouches:true,ctrlKey:true,detail:true,eventPhase:true,metaKey:true,pageX:true,pageY:true,shiftKey:true,view:true,"char":true,charCode:true,key:true,keyCode:true,button:true,buttons:true,clientX:true,clientY:true,offsetX:true,offsetY:true,pointerId:true,pointerType:true,screenX:true,screenY:true,targetTouches:true,toElement:true,touches:true,which:function which(event){var button=event.button;// Add which for key events
if(event.which==null&&rkeyEvent.test(event.type)){return event.charCode!=null?event.charCode:event.keyCode;}// Add which for click: 1 === left; 2 === middle; 3 === right
if(!event.which&&button!==undefined&&rmouseEvent.test(event.type)){if(button&1){return 1;}if(button&2){return 3;}if(button&4){return 2;}return 0;}return event.which;}},jQuery.event.addProp);// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(orig,fix){jQuery.event.special[orig]={delegateType:fix,bindType:fix,handle:function handle(event){var ret,target=this,related=event.relatedTarget,handleObj=event.handleObj;// For mouseenter/leave call the handler if related is outside the target.
// NB: No relatedTarget if the mouse left/entered the browser window
if(!related||related!==target&&!jQuery.contains(target,related)){event.type=handleObj.origType;ret=handleObj.handler.apply(this,arguments);event.type=fix;}return ret;}};});jQuery.fn.extend({on:function on(types,selector,data,fn){return _on(this,types,selector,data,fn);},one:function one(types,selector,data,fn){return _on(this,types,selector,data,fn,1);},off:function off(types,selector,fn){var handleObj,type;if(types&&types.preventDefault&&types.handleObj){// ( event )  dispatched jQuery.Event
handleObj=types.handleObj;jQuery(types.delegateTarget).off(handleObj.namespace?handleObj.origType+"."+handleObj.namespace:handleObj.origType,handleObj.selector,handleObj.handler);return this;}if((typeof types==="undefined"?"undefined":_typeof(types))==="object"){// ( types-object [, selector] )
for(type in types){this.off(type,selector,types[type]);}return this;}if(selector===false||typeof selector==="function"){// ( types [, fn] )
fn=selector;selector=undefined;}if(fn===false){fn=returnFalse;}return this.each(function(){jQuery.event.remove(this,types,fn,selector);});}});var/* eslint-disable max-len */// See https://github.com/eslint/eslint/issues/3229
rxhtmlTag=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,/* eslint-enable */// Support: IE <=10 - 11, Edge 12 - 13 only
// In IE/Edge using regex groups here causes severe slowdowns.
// See https://connect.microsoft.com/IE/feedback/details/1736512/
rnoInnerhtml=/<script|<style|<link/i,// checked="checked" or checked
rchecked=/checked\s*(?:[^=]|=\s*.checked.)/i,rcleanScript=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;// Prefer a tbody over its parent table for containing new rows
function manipulationTarget(elem,content){if(nodeName(elem,"table")&&nodeName(content.nodeType!==11?content:content.firstChild,"tr")){return jQuery(elem).children("tbody")[0]||elem;}return elem;}// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript(elem){elem.type=(elem.getAttribute("type")!==null)+"/"+elem.type;return elem;}function restoreScript(elem){if((elem.type||"").slice(0,5)==="true/"){elem.type=elem.type.slice(5);}else{elem.removeAttribute("type");}return elem;}function cloneCopyEvent(src,dest){var i,l,type,pdataOld,pdataCur,udataOld,udataCur,events;if(dest.nodeType!==1){return;}// 1. Copy private data: events, handlers, etc.
if(dataPriv.hasData(src)){pdataOld=dataPriv.access(src);pdataCur=dataPriv.set(dest,pdataOld);events=pdataOld.events;if(events){delete pdataCur.handle;pdataCur.events={};for(type in events){for(i=0,l=events[type].length;i<l;i++){jQuery.event.add(dest,type,events[type][i]);}}}}// 2. Copy user data
if(dataUser.hasData(src)){udataOld=dataUser.access(src);udataCur=jQuery.extend({},udataOld);dataUser.set(dest,udataCur);}}// Fix IE bugs, see support tests
function fixInput(src,dest){var nodeName=dest.nodeName.toLowerCase();// Fails to persist the checked state of a cloned checkbox or radio button.
if(nodeName==="input"&&rcheckableType.test(src.type)){dest.checked=src.checked;// Fails to return the selected option to the default selected state when cloning options
}else if(nodeName==="input"||nodeName==="textarea"){dest.defaultValue=src.defaultValue;}}function domManip(collection,args,callback,ignored){// Flatten any nested arrays
args=concat.apply([],args);var fragment,first,scripts,hasScripts,node,doc,i=0,l=collection.length,iNoClone=l-1,value=args[0],valueIsFunction=isFunction(value);// We can't cloneNode fragments that contain checked, in WebKit
if(valueIsFunction||l>1&&typeof value==="string"&&!support.checkClone&&rchecked.test(value)){return collection.each(function(index){var self=collection.eq(index);if(valueIsFunction){args[0]=value.call(this,index,self.html());}domManip(self,args,callback,ignored);});}if(l){fragment=buildFragment(args,collection[0].ownerDocument,false,collection,ignored);first=fragment.firstChild;if(fragment.childNodes.length===1){fragment=first;}// Require either new content or an interest in ignored elements to invoke the callback
if(first||ignored){scripts=jQuery.map(getAll(fragment,"script"),disableScript);hasScripts=scripts.length;// Use the original fragment for the last item
// instead of the first because it can end up
// being emptied incorrectly in certain situations (#8070).
for(;i<l;i++){node=fragment;if(i!==iNoClone){node=jQuery.clone(node,true,true);// Keep references to cloned scripts for later restoration
if(hasScripts){// Support: Android <=4.0 only, PhantomJS 1 only
// push.apply(_, arraylike) throws on ancient WebKit
jQuery.merge(scripts,getAll(node,"script"));}}callback.call(collection[i],node,i);}if(hasScripts){doc=scripts[scripts.length-1].ownerDocument;// Reenable scripts
jQuery.map(scripts,restoreScript);// Evaluate executable scripts on first document insertion
for(i=0;i<hasScripts;i++){node=scripts[i];if(rscriptType.test(node.type||"")&&!dataPriv.access(node,"globalEval")&&jQuery.contains(doc,node)){if(node.src&&(node.type||"").toLowerCase()!=="module"){// Optional AJAX dependency, but won't run scripts if not present
if(jQuery._evalUrl){jQuery._evalUrl(node.src);}}else{DOMEval(node.textContent.replace(rcleanScript,""),doc,node);}}}}}}return collection;}function _remove(elem,selector,keepData){var node,nodes=selector?jQuery.filter(selector,elem):elem,i=0;for(;(node=nodes[i])!=null;i++){if(!keepData&&node.nodeType===1){jQuery.cleanData(getAll(node));}if(node.parentNode){if(keepData&&jQuery.contains(node.ownerDocument,node)){setGlobalEval(getAll(node,"script"));}node.parentNode.removeChild(node);}}return elem;}jQuery.extend({htmlPrefilter:function htmlPrefilter(html){return html.replace(rxhtmlTag,"<$1></$2>");},clone:function clone(elem,dataAndEvents,deepDataAndEvents){var i,l,srcElements,destElements,clone=elem.cloneNode(true),inPage=jQuery.contains(elem.ownerDocument,elem);// Fix IE cloning issues
if(!support.noCloneChecked&&(elem.nodeType===1||elem.nodeType===11)&&!jQuery.isXMLDoc(elem)){// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
destElements=getAll(clone);srcElements=getAll(elem);for(i=0,l=srcElements.length;i<l;i++){fixInput(srcElements[i],destElements[i]);}}// Copy the events from the original to the clone
if(dataAndEvents){if(deepDataAndEvents){srcElements=srcElements||getAll(elem);destElements=destElements||getAll(clone);for(i=0,l=srcElements.length;i<l;i++){cloneCopyEvent(srcElements[i],destElements[i]);}}else{cloneCopyEvent(elem,clone);}}// Preserve script evaluation history
destElements=getAll(clone,"script");if(destElements.length>0){setGlobalEval(destElements,!inPage&&getAll(elem,"script"));}// Return the cloned set
return clone;},cleanData:function cleanData(elems){var data,elem,type,special=jQuery.event.special,i=0;for(;(elem=elems[i])!==undefined;i++){if(acceptData(elem)){if(data=elem[dataPriv.expando]){if(data.events){for(type in data.events){if(special[type]){jQuery.event.remove(elem,type);// This is a shortcut to avoid jQuery.event.remove's overhead
}else{jQuery.removeEvent(elem,type,data.handle);}}}// Support: Chrome <=35 - 45+
// Assign undefined instead of using delete, see Data#remove
elem[dataPriv.expando]=undefined;}if(elem[dataUser.expando]){// Support: Chrome <=35 - 45+
// Assign undefined instead of using delete, see Data#remove
elem[dataUser.expando]=undefined;}}}}});jQuery.fn.extend({detach:function detach(selector){return _remove(this,selector,true);},remove:function remove(selector){return _remove(this,selector);},text:function text(value){return access(this,function(value){return value===undefined?jQuery.text(this):this.empty().each(function(){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){this.textContent=value;}});},null,value,arguments.length);},append:function append(){return domManip(this,arguments,function(elem){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var target=manipulationTarget(this,elem);target.appendChild(elem);}});},prepend:function prepend(){return domManip(this,arguments,function(elem){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var target=manipulationTarget(this,elem);target.insertBefore(elem,target.firstChild);}});},before:function before(){return domManip(this,arguments,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this);}});},after:function after(){return domManip(this,arguments,function(elem){if(this.parentNode){this.parentNode.insertBefore(elem,this.nextSibling);}});},empty:function empty(){var elem,i=0;for(;(elem=this[i])!=null;i++){if(elem.nodeType===1){// Prevent memory leaks
jQuery.cleanData(getAll(elem,false));// Remove any remaining nodes
elem.textContent="";}}return this;},clone:function clone(dataAndEvents,deepDataAndEvents){dataAndEvents=dataAndEvents==null?false:dataAndEvents;deepDataAndEvents=deepDataAndEvents==null?dataAndEvents:deepDataAndEvents;return this.map(function(){return jQuery.clone(this,dataAndEvents,deepDataAndEvents);});},html:function html(value){return access(this,function(value){var elem=this[0]||{},i=0,l=this.length;if(value===undefined&&elem.nodeType===1){return elem.innerHTML;}// See if we can take a shortcut and just use innerHTML
if(typeof value==="string"&&!rnoInnerhtml.test(value)&&!wrapMap[(rtagName.exec(value)||["",""])[1].toLowerCase()]){value=jQuery.htmlPrefilter(value);try{for(;i<l;i++){elem=this[i]||{};// Remove element nodes and prevent memory leaks
if(elem.nodeType===1){jQuery.cleanData(getAll(elem,false));elem.innerHTML=value;}}elem=0;// If using innerHTML throws an exception, use the fallback method
}catch(e){}}if(elem){this.empty().append(value);}},null,value,arguments.length);},replaceWith:function replaceWith(){var ignored=[];// Make the changes, replacing each non-ignored context element with the new content
return domManip(this,arguments,function(elem){var parent=this.parentNode;if(jQuery.inArray(this,ignored)<0){jQuery.cleanData(getAll(this));if(parent){parent.replaceChild(elem,this);}}// Force callback invocation
},ignored);}});jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(selector){var elems,ret=[],insert=jQuery(selector),last=insert.length-1,i=0;for(;i<=last;i++){elems=i===last?this:this.clone(true);jQuery(insert[i])[original](elems);// Support: Android <=4.0 only, PhantomJS 1 only
// .get() because push.apply(_, arraylike) throws on ancient WebKit
push.apply(ret,elems.get());}return this.pushStack(ret);};});var rnumnonpx=new RegExp("^("+pnum+")(?!px)[a-z%]+$","i");var getStyles=function getStyles(elem){// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
// IE throws on elements created in popups
// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
var view=elem.ownerDocument.defaultView;if(!view||!view.opener){view=window;}return view.getComputedStyle(elem);};var rboxStyle=new RegExp(cssExpand.join("|"),"i");(function(){// Executing both pixelPosition & boxSizingReliable tests require only one layout
// so they're executed at the same time to save the second computation.
function computeStyleTests(){// This is a singleton, we need to execute it only once
if(!div){return;}container.style.cssText="position:absolute;left:-11111px;width:60px;"+"margin-top:1px;padding:0;border:0";div.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;"+"margin:auto;border:1px;padding:1px;"+"width:60%;top:1%";documentElement.appendChild(container).appendChild(div);var divStyle=window.getComputedStyle(div);pixelPositionVal=divStyle.top!=="1%";// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
reliableMarginLeftVal=roundPixelMeasures(divStyle.marginLeft)===12;// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
// Some styles come back with percentage values, even though they shouldn't
div.style.right="60%";pixelBoxStylesVal=roundPixelMeasures(divStyle.right)===36;// Support: IE 9 - 11 only
// Detect misreporting of content dimensions for box-sizing:border-box elements
boxSizingReliableVal=roundPixelMeasures(divStyle.width)===36;// Support: IE 9 only
// Detect overflow:scroll screwiness (gh-3699)
div.style.position="absolute";scrollboxSizeVal=div.offsetWidth===36||"absolute";documentElement.removeChild(container);// Nullify the div so it wouldn't be stored in the memory and
// it will also be a sign that checks already performed
div=null;}function roundPixelMeasures(measure){return Math.round(parseFloat(measure));}var pixelPositionVal,boxSizingReliableVal,scrollboxSizeVal,pixelBoxStylesVal,reliableMarginLeftVal,container=document.createElement("div"),div=document.createElement("div");// Finish early in limited (non-browser) environments
if(!div.style){return;}// Support: IE <=9 - 11 only
// Style of cloned element affects source element cloned (#8908)
div.style.backgroundClip="content-box";div.cloneNode(true).style.backgroundClip="";support.clearCloneStyle=div.style.backgroundClip==="content-box";jQuery.extend(support,{boxSizingReliable:function boxSizingReliable(){computeStyleTests();return boxSizingReliableVal;},pixelBoxStyles:function pixelBoxStyles(){computeStyleTests();return pixelBoxStylesVal;},pixelPosition:function pixelPosition(){computeStyleTests();return pixelPositionVal;},reliableMarginLeft:function reliableMarginLeft(){computeStyleTests();return reliableMarginLeftVal;},scrollboxSize:function scrollboxSize(){computeStyleTests();return scrollboxSizeVal;}});})();function curCSS(elem,name,computed){var width,minWidth,maxWidth,ret,// Support: Firefox 51+
// Retrieving style before computed somehow
// fixes an issue with getting wrong values
// on detached elements
style=elem.style;computed=computed||getStyles(elem);// getPropertyValue is needed for:
//   .css('filter') (IE 9 only, #12537)
//   .css('--customProperty) (#3144)
if(computed){ret=computed.getPropertyValue(name)||computed[name];if(ret===""&&!jQuery.contains(elem.ownerDocument,elem)){ret=jQuery.style(elem,name);}// A tribute to the "awesome hack by Dean Edwards"
// Android Browser returns percentage for some values,
// but width seems to be reliably pixels.
// This is against the CSSOM draft spec:
// https://drafts.csswg.org/cssom/#resolved-values
if(!support.pixelBoxStyles()&&rnumnonpx.test(ret)&&rboxStyle.test(name)){// Remember the original values
width=style.width;minWidth=style.minWidth;maxWidth=style.maxWidth;// Put in the new values to get a computed value out
style.minWidth=style.maxWidth=style.width=ret;ret=computed.width;// Revert the changed values
style.width=width;style.minWidth=minWidth;style.maxWidth=maxWidth;}}return ret!==undefined?// Support: IE <=9 - 11 only
// IE returns zIndex value as an integer.
ret+"":ret;}function addGetHookIf(conditionFn,hookFn){// Define the hook, we'll check on the first run if it's really needed.
return{get:function get(){if(conditionFn()){// Hook not needed (or it's not possible to use it due
// to missing dependency), remove it.
delete this.get;return;}// Hook needed; redefine it so that the support test is not executed again.
return(this.get=hookFn).apply(this,arguments);}};}var// Swappable if display is none or starts with table
// except "table", "table-cell", or "table-caption"
// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
rdisplayswap=/^(none|table(?!-c[ea]).+)/,rcustomProp=/^--/,cssShow={position:"absolute",visibility:"hidden",display:"block"},cssNormalTransform={letterSpacing:"0",fontWeight:"400"},cssPrefixes=["Webkit","Moz","ms"],emptyStyle=document.createElement("div").style;// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName(name){// Shortcut for names that are not vendor prefixed
if(name in emptyStyle){return name;}// Check for vendor prefixed names
var capName=name[0].toUpperCase()+name.slice(1),i=cssPrefixes.length;while(i--){name=cssPrefixes[i]+capName;if(name in emptyStyle){return name;}}}// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName(name){var ret=jQuery.cssProps[name];if(!ret){ret=jQuery.cssProps[name]=vendorPropName(name)||name;}return ret;}function setPositiveNumber(elem,value,subtract){// Any relative (+/-) values have already been
// normalized at this point
var matches=rcssNum.exec(value);return matches?// Guard against undefined "subtract", e.g., when used as in cssHooks
Math.max(0,matches[2]-(subtract||0))+(matches[3]||"px"):value;}function boxModelAdjustment(elem,dimension,box,isBorderBox,styles,computedVal){var i=dimension==="width"?1:0,extra=0,delta=0;// Adjustment may not be necessary
if(box===(isBorderBox?"border":"content")){return 0;}for(;i<4;i+=2){// Both box models exclude margin
if(box==="margin"){delta+=jQuery.css(elem,box+cssExpand[i],true,styles);}// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
if(!isBorderBox){// Add padding
delta+=jQuery.css(elem,"padding"+cssExpand[i],true,styles);// For "border" or "margin", add border
if(box!=="padding"){delta+=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles);// But still keep track of it otherwise
}else{extra+=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles);}// If we get here with a border-box (content + padding + border), we're seeking "content" or
// "padding" or "margin"
}else{// For "content", subtract padding
if(box==="content"){delta-=jQuery.css(elem,"padding"+cssExpand[i],true,styles);}// For "content" or "padding", subtract border
if(box!=="margin"){delta-=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles);}}}// Account for positive content-box scroll gutter when requested by providing computedVal
if(!isBorderBox&&computedVal>=0){// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
// Assuming integer scroll gutter, subtract the rest and round down
delta+=Math.max(0,Math.ceil(elem["offset"+dimension[0].toUpperCase()+dimension.slice(1)]-computedVal-delta-extra-0.5));}return delta;}function getWidthOrHeight(elem,dimension,extra){// Start with computed style
var styles=getStyles(elem),val=curCSS(elem,dimension,styles),isBorderBox=jQuery.css(elem,"boxSizing",false,styles)==="border-box",valueIsBorderBox=isBorderBox;// Support: Firefox <=54
// Return a confounding non-pixel value or feign ignorance, as appropriate.
if(rnumnonpx.test(val)){if(!extra){return val;}val="auto";}// Check for style in case a browser which returns unreliable values
// for getComputedStyle silently falls back to the reliable elem.style
valueIsBorderBox=valueIsBorderBox&&(support.boxSizingReliable()||val===elem.style[dimension]);// Fall back to offsetWidth/offsetHeight when value is "auto"
// This happens for inline elements with no explicit setting (gh-3571)
// Support: Android <=4.1 - 4.3 only
// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
if(val==="auto"||!parseFloat(val)&&jQuery.css(elem,"display",false,styles)==="inline"){val=elem["offset"+dimension[0].toUpperCase()+dimension.slice(1)];// offsetWidth/offsetHeight provide border-box values
valueIsBorderBox=true;}// Normalize "" and auto
val=parseFloat(val)||0;// Adjust for the element's box model
return val+boxModelAdjustment(elem,dimension,extra||(isBorderBox?"border":"content"),valueIsBorderBox,styles,// Provide the current computed size to request scroll gutter calculation (gh-3589)
val)+"px";}jQuery.extend({// Add in style property hooks for overriding the default
// behavior of getting and setting a style property
cssHooks:{opacity:{get:function get(elem,computed){if(computed){// We should always get a number back from opacity
var ret=curCSS(elem,"opacity");return ret===""?"1":ret;}}}},// Don't automatically add "px" to these possibly-unitless properties
cssNumber:{"animationIterationCount":true,"columnCount":true,"fillOpacity":true,"flexGrow":true,"flexShrink":true,"fontWeight":true,"lineHeight":true,"opacity":true,"order":true,"orphans":true,"widows":true,"zIndex":true,"zoom":true},// Add in properties whose names you wish to fix before
// setting or getting the value
cssProps:{},// Get and set the style property on a DOM Node
style:function style(elem,name,value,extra){// Don't set styles on text and comment nodes
if(!elem||elem.nodeType===3||elem.nodeType===8||!elem.style){return;}// Make sure that we're working with the right name
var ret,type,hooks,origName=camelCase(name),isCustomProp=rcustomProp.test(name),style=elem.style;// Make sure that we're working with the right name. We don't
// want to query the value if it is a CSS custom property
// since they are user-defined.
if(!isCustomProp){name=finalPropName(origName);}// Gets hook for the prefixed version, then unprefixed version
hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName];// Check if we're setting a value
if(value!==undefined){type=typeof value==="undefined"?"undefined":_typeof(value);// Convert "+=" or "-=" to relative numbers (#7345)
if(type==="string"&&(ret=rcssNum.exec(value))&&ret[1]){value=adjustCSS(elem,name,ret);// Fixes bug #9237
type="number";}// Make sure that null and NaN values aren't set (#7116)
if(value==null||value!==value){return;}// If a number was passed in, add the unit (except for certain CSS properties)
if(type==="number"){value+=ret&&ret[3]||(jQuery.cssNumber[origName]?"":"px");}// background-* props affect original clone's values
if(!support.clearCloneStyle&&value===""&&name.indexOf("background")===0){style[name]="inherit";}// If a hook was provided, use that value, otherwise just set the specified value
if(!hooks||!("set"in hooks)||(value=hooks.set(elem,value,extra))!==undefined){if(isCustomProp){style.setProperty(name,value);}else{style[name]=value;}}}else{// If a hook was provided get the non-computed value from there
if(hooks&&"get"in hooks&&(ret=hooks.get(elem,false,extra))!==undefined){return ret;}// Otherwise just get the value from the style object
return style[name];}},css:function css(elem,name,extra,styles){var val,num,hooks,origName=camelCase(name),isCustomProp=rcustomProp.test(name);// Make sure that we're working with the right name. We don't
// want to modify the value if it is a CSS custom property
// since they are user-defined.
if(!isCustomProp){name=finalPropName(origName);}// Try prefixed name followed by the unprefixed name
hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName];// If a hook was provided get the computed value from there
if(hooks&&"get"in hooks){val=hooks.get(elem,true,extra);}// Otherwise, if a way to get the computed value exists, use that
if(val===undefined){val=curCSS(elem,name,styles);}// Convert "normal" to computed value
if(val==="normal"&&name in cssNormalTransform){val=cssNormalTransform[name];}// Make numeric if forced or a qualifier was provided and val looks numeric
if(extra===""||extra){num=parseFloat(val);return extra===true||isFinite(num)?num||0:val;}return val;}});jQuery.each(["height","width"],function(i,dimension){jQuery.cssHooks[dimension]={get:function get(elem,computed,extra){if(computed){// Certain elements can have dimension info if we invisibly show them
// but it must have a current display style that would benefit
return rdisplayswap.test(jQuery.css(elem,"display"))&&(// Support: Safari 8+
// Table columns in Safari have non-zero offsetWidth & zero
// getBoundingClientRect().width unless display is changed.
// Support: IE <=11 only
// Running getBoundingClientRect on a disconnected node
// in IE throws an error.
!elem.getClientRects().length||!elem.getBoundingClientRect().width)?swap(elem,cssShow,function(){return getWidthOrHeight(elem,dimension,extra);}):getWidthOrHeight(elem,dimension,extra);}},set:function set(elem,value,extra){var matches,styles=getStyles(elem),isBorderBox=jQuery.css(elem,"boxSizing",false,styles)==="border-box",subtract=extra&&boxModelAdjustment(elem,dimension,extra,isBorderBox,styles);// Account for unreliable border-box dimensions by comparing offset* to computed and
// faking a content-box to get border and padding (gh-3699)
if(isBorderBox&&support.scrollboxSize()===styles.position){subtract-=Math.ceil(elem["offset"+dimension[0].toUpperCase()+dimension.slice(1)]-parseFloat(styles[dimension])-boxModelAdjustment(elem,dimension,"border",false,styles)-0.5);}// Convert to pixels if value adjustment is needed
if(subtract&&(matches=rcssNum.exec(value))&&(matches[3]||"px")!=="px"){elem.style[dimension]=value;value=jQuery.css(elem,dimension);}return setPositiveNumber(elem,value,subtract);}};});jQuery.cssHooks.marginLeft=addGetHookIf(support.reliableMarginLeft,function(elem,computed){if(computed){return(parseFloat(curCSS(elem,"marginLeft"))||elem.getBoundingClientRect().left-swap(elem,{marginLeft:0},function(){return elem.getBoundingClientRect().left;}))+"px";}});// These hooks are used by animate to expand properties
jQuery.each({margin:"",padding:"",border:"Width"},function(prefix,suffix){jQuery.cssHooks[prefix+suffix]={expand:function expand(value){var i=0,expanded={},// Assumes a single number if not a string
parts=typeof value==="string"?value.split(" "):[value];for(;i<4;i++){expanded[prefix+cssExpand[i]+suffix]=parts[i]||parts[i-2]||parts[0];}return expanded;}};if(prefix!=="margin"){jQuery.cssHooks[prefix+suffix].set=setPositiveNumber;}});jQuery.fn.extend({css:function css(name,value){return access(this,function(elem,name,value){var styles,len,map={},i=0;if(Array.isArray(name)){styles=getStyles(elem);len=name.length;for(;i<len;i++){map[name[i]]=jQuery.css(elem,name[i],false,styles);}return map;}return value!==undefined?jQuery.style(elem,name,value):jQuery.css(elem,name);},name,value,arguments.length>1);}});function Tween(elem,options,prop,end,easing){return new Tween.prototype.init(elem,options,prop,end,easing);}jQuery.Tween=Tween;Tween.prototype={constructor:Tween,init:function init(elem,options,prop,end,easing,unit){this.elem=elem;this.prop=prop;this.easing=easing||jQuery.easing._default;this.options=options;this.start=this.now=this.cur();this.end=end;this.unit=unit||(jQuery.cssNumber[prop]?"":"px");},cur:function cur(){var hooks=Tween.propHooks[this.prop];return hooks&&hooks.get?hooks.get(this):Tween.propHooks._default.get(this);},run:function run(percent){var eased,hooks=Tween.propHooks[this.prop];if(this.options.duration){this.pos=eased=jQuery.easing[this.easing](percent,this.options.duration*percent,0,1,this.options.duration);}else{this.pos=eased=percent;}this.now=(this.end-this.start)*eased+this.start;if(this.options.step){this.options.step.call(this.elem,this.now,this);}if(hooks&&hooks.set){hooks.set(this);}else{Tween.propHooks._default.set(this);}return this;}};Tween.prototype.init.prototype=Tween.prototype;Tween.propHooks={_default:{get:function get(tween){var result;// Use a property on the element directly when it is not a DOM element,
// or when there is no matching style property that exists.
if(tween.elem.nodeType!==1||tween.elem[tween.prop]!=null&&tween.elem.style[tween.prop]==null){return tween.elem[tween.prop];}// Passing an empty string as a 3rd parameter to .css will automatically
// attempt a parseFloat and fallback to a string if the parse fails.
// Simple values such as "10px" are parsed to Float;
// complex values such as "rotate(1rad)" are returned as-is.
result=jQuery.css(tween.elem,tween.prop,"");// Empty strings, null, undefined and "auto" are converted to 0.
return!result||result==="auto"?0:result;},set:function set(tween){// Use step hook for back compat.
// Use cssHook if its there.
// Use .style if available and use plain properties where available.
if(jQuery.fx.step[tween.prop]){jQuery.fx.step[tween.prop](tween);}else if(tween.elem.nodeType===1&&(tween.elem.style[jQuery.cssProps[tween.prop]]!=null||jQuery.cssHooks[tween.prop])){jQuery.style(tween.elem,tween.prop,tween.now+tween.unit);}else{tween.elem[tween.prop]=tween.now;}}}};// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop=Tween.propHooks.scrollLeft={set:function set(tween){if(tween.elem.nodeType&&tween.elem.parentNode){tween.elem[tween.prop]=tween.now;}}};jQuery.easing={linear:function linear(p){return p;},swing:function swing(p){return 0.5-Math.cos(p*Math.PI)/2;},_default:"swing"};jQuery.fx=Tween.prototype.init;// Back compat <1.8 extension point
jQuery.fx.step={};var fxNow,inProgress,rfxtypes=/^(?:toggle|show|hide)$/,rrun=/queueHooks$/;function schedule(){if(inProgress){if(document.hidden===false&&window.requestAnimationFrame){window.requestAnimationFrame(schedule);}else{window.setTimeout(schedule,jQuery.fx.interval);}jQuery.fx.tick();}}// Animations created synchronously will run synchronously
function createFxNow(){window.setTimeout(function(){fxNow=undefined;});return fxNow=Date.now();}// Generate parameters to create a standard animation
function genFx(type,includeWidth){var which,i=0,attrs={height:type};// If we include width, step value is 1 to do all cssExpand values,
// otherwise step value is 2 to skip over Left and Right
includeWidth=includeWidth?1:0;for(;i<4;i+=2-includeWidth){which=cssExpand[i];attrs["margin"+which]=attrs["padding"+which]=type;}if(includeWidth){attrs.opacity=attrs.width=type;}return attrs;}function createTween(value,prop,animation){var tween,collection=(Animation.tweeners[prop]||[]).concat(Animation.tweeners["*"]),index=0,length=collection.length;for(;index<length;index++){if(tween=collection[index].call(animation,prop,value)){// We're done with this property
return tween;}}}function defaultPrefilter(elem,props,opts){var prop,value,toggle,hooks,oldfire,propTween,restoreDisplay,display,isBox="width"in props||"height"in props,anim=this,orig={},style=elem.style,hidden=elem.nodeType&&isHiddenWithinTree(elem),dataShow=dataPriv.get(elem,"fxshow");// Queue-skipping animations hijack the fx hooks
if(!opts.queue){hooks=jQuery._queueHooks(elem,"fx");if(hooks.unqueued==null){hooks.unqueued=0;oldfire=hooks.empty.fire;hooks.empty.fire=function(){if(!hooks.unqueued){oldfire();}};}hooks.unqueued++;anim.always(function(){// Ensure the complete handler is called before this completes
anim.always(function(){hooks.unqueued--;if(!jQuery.queue(elem,"fx").length){hooks.empty.fire();}});});}// Detect show/hide animations
for(prop in props){value=props[prop];if(rfxtypes.test(value)){delete props[prop];toggle=toggle||value==="toggle";if(value===(hidden?"hide":"show")){// Pretend to be hidden if this is a "show" and
// there is still data from a stopped show/hide
if(value==="show"&&dataShow&&dataShow[prop]!==undefined){hidden=true;// Ignore all other no-op show/hide data
}else{continue;}}orig[prop]=dataShow&&dataShow[prop]||jQuery.style(elem,prop);}}// Bail out if this is a no-op like .hide().hide()
propTween=!jQuery.isEmptyObject(props);if(!propTween&&jQuery.isEmptyObject(orig)){return;}// Restrict "overflow" and "display" styles during box animations
if(isBox&&elem.nodeType===1){// Support: IE <=9 - 11, Edge 12 - 15
// Record all 3 overflow attributes because IE does not infer the shorthand
// from identically-valued overflowX and overflowY and Edge just mirrors
// the overflowX value there.
opts.overflow=[style.overflow,style.overflowX,style.overflowY];// Identify a display type, preferring old show/hide data over the CSS cascade
restoreDisplay=dataShow&&dataShow.display;if(restoreDisplay==null){restoreDisplay=dataPriv.get(elem,"display");}display=jQuery.css(elem,"display");if(display==="none"){if(restoreDisplay){display=restoreDisplay;}else{// Get nonempty value(s) by temporarily forcing visibility
showHide([elem],true);restoreDisplay=elem.style.display||restoreDisplay;display=jQuery.css(elem,"display");showHide([elem]);}}// Animate inline elements as inline-block
if(display==="inline"||display==="inline-block"&&restoreDisplay!=null){if(jQuery.css(elem,"float")==="none"){// Restore the original display value at the end of pure show/hide animations
if(!propTween){anim.done(function(){style.display=restoreDisplay;});if(restoreDisplay==null){display=style.display;restoreDisplay=display==="none"?"":display;}}style.display="inline-block";}}}if(opts.overflow){style.overflow="hidden";anim.always(function(){style.overflow=opts.overflow[0];style.overflowX=opts.overflow[1];style.overflowY=opts.overflow[2];});}// Implement show/hide animations
propTween=false;for(prop in orig){// General show/hide setup for this element animation
if(!propTween){if(dataShow){if("hidden"in dataShow){hidden=dataShow.hidden;}}else{dataShow=dataPriv.access(elem,"fxshow",{display:restoreDisplay});}// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
if(toggle){dataShow.hidden=!hidden;}// Show elements before animating them
if(hidden){showHide([elem],true);}/* eslint-disable no-loop-func */anim.done(function(){/* eslint-enable no-loop-func */// The final step of a "hide" animation is actually hiding the element
if(!hidden){showHide([elem]);}dataPriv.remove(elem,"fxshow");for(prop in orig){jQuery.style(elem,prop,orig[prop]);}});}// Per-property setup
propTween=createTween(hidden?dataShow[prop]:0,prop,anim);if(!(prop in dataShow)){dataShow[prop]=propTween.start;if(hidden){propTween.end=propTween.start;propTween.start=0;}}}}function propFilter(props,specialEasing){var index,name,easing,value,hooks;// camelCase, specialEasing and expand cssHook pass
for(index in props){name=camelCase(index);easing=specialEasing[name];value=props[index];if(Array.isArray(value)){easing=value[1];value=props[index]=value[0];}if(index!==name){props[name]=value;delete props[index];}hooks=jQuery.cssHooks[name];if(hooks&&"expand"in hooks){value=hooks.expand(value);delete props[name];// Not quite $.extend, this won't overwrite existing keys.
// Reusing 'index' because we have the correct "name"
for(index in value){if(!(index in props)){props[index]=value[index];specialEasing[index]=easing;}}}else{specialEasing[name]=easing;}}}function Animation(elem,properties,options){var result,stopped,index=0,length=Animation.prefilters.length,deferred=jQuery.Deferred().always(function(){// Don't match elem in the :animated selector
delete tick.elem;}),tick=function tick(){if(stopped){return false;}var currentTime=fxNow||createFxNow(),remaining=Math.max(0,animation.startTime+animation.duration-currentTime),// Support: Android 2.3 only
// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
temp=remaining/animation.duration||0,percent=1-temp,index=0,length=animation.tweens.length;for(;index<length;index++){animation.tweens[index].run(percent);}deferred.notifyWith(elem,[animation,percent,remaining]);// If there's more to do, yield
if(percent<1&&length){return remaining;}// If this was an empty animation, synthesize a final progress notification
if(!length){deferred.notifyWith(elem,[animation,1,0]);}// Resolve the animation and report its conclusion
deferred.resolveWith(elem,[animation]);return false;},animation=deferred.promise({elem:elem,props:jQuery.extend({},properties),opts:jQuery.extend(true,{specialEasing:{},easing:jQuery.easing._default},options),originalProperties:properties,originalOptions:options,startTime:fxNow||createFxNow(),duration:options.duration,tweens:[],createTween:function createTween(prop,end){var tween=jQuery.Tween(elem,animation.opts,prop,end,animation.opts.specialEasing[prop]||animation.opts.easing);animation.tweens.push(tween);return tween;},stop:function stop(gotoEnd){var index=0,// If we are going to the end, we want to run all the tweens
// otherwise we skip this part
length=gotoEnd?animation.tweens.length:0;if(stopped){return this;}stopped=true;for(;index<length;index++){animation.tweens[index].run(1);}// Resolve when we played the last frame; otherwise, reject
if(gotoEnd){deferred.notifyWith(elem,[animation,1,0]);deferred.resolveWith(elem,[animation,gotoEnd]);}else{deferred.rejectWith(elem,[animation,gotoEnd]);}return this;}}),props=animation.props;propFilter(props,animation.opts.specialEasing);for(;index<length;index++){result=Animation.prefilters[index].call(animation,elem,props,animation.opts);if(result){if(isFunction(result.stop)){jQuery._queueHooks(animation.elem,animation.opts.queue).stop=result.stop.bind(result);}return result;}}jQuery.map(props,createTween,animation);if(isFunction(animation.opts.start)){animation.opts.start.call(elem,animation);}// Attach callbacks from options
animation.progress(animation.opts.progress).done(animation.opts.done,animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);jQuery.fx.timer(jQuery.extend(tick,{elem:elem,anim:animation,queue:animation.opts.queue}));return animation;}jQuery.Animation=jQuery.extend(Animation,{tweeners:{"*":[function(prop,value){var tween=this.createTween(prop,value);adjustCSS(tween.elem,prop,rcssNum.exec(value),tween);return tween;}]},tweener:function tweener(props,callback){if(isFunction(props)){callback=props;props=["*"];}else{props=props.match(rnothtmlwhite);}var prop,index=0,length=props.length;for(;index<length;index++){prop=props[index];Animation.tweeners[prop]=Animation.tweeners[prop]||[];Animation.tweeners[prop].unshift(callback);}},prefilters:[defaultPrefilter],prefilter:function prefilter(callback,prepend){if(prepend){Animation.prefilters.unshift(callback);}else{Animation.prefilters.push(callback);}}});jQuery.speed=function(speed,easing,fn){var opt=speed&&(typeof speed==="undefined"?"undefined":_typeof(speed))==="object"?jQuery.extend({},speed):{complete:fn||!fn&&easing||isFunction(speed)&&speed,duration:speed,easing:fn&&easing||easing&&!isFunction(easing)&&easing};// Go to the end state if fx are off
if(jQuery.fx.off){opt.duration=0;}else{if(typeof opt.duration!=="number"){if(opt.duration in jQuery.fx.speeds){opt.duration=jQuery.fx.speeds[opt.duration];}else{opt.duration=jQuery.fx.speeds._default;}}}// Normalize opt.queue - true/undefined/null -> "fx"
if(opt.queue==null||opt.queue===true){opt.queue="fx";}// Queueing
opt.old=opt.complete;opt.complete=function(){if(isFunction(opt.old)){opt.old.call(this);}if(opt.queue){jQuery.dequeue(this,opt.queue);}};return opt;};jQuery.fn.extend({fadeTo:function fadeTo(speed,to,easing,callback){// Show any hidden elements after setting opacity to 0
return this.filter(isHiddenWithinTree).css("opacity",0).show()// Animate to the value specified
.end().animate({opacity:to},speed,easing,callback);},animate:function animate(prop,speed,easing,callback){var empty=jQuery.isEmptyObject(prop),optall=jQuery.speed(speed,easing,callback),doAnimation=function doAnimation(){// Operate on a copy of prop so per-property easing won't be lost
var anim=Animation(this,jQuery.extend({},prop),optall);// Empty animations, or finishing resolves immediately
if(empty||dataPriv.get(this,"finish")){anim.stop(true);}};doAnimation.finish=doAnimation;return empty||optall.queue===false?this.each(doAnimation):this.queue(optall.queue,doAnimation);},stop:function stop(type,clearQueue,gotoEnd){var stopQueue=function stopQueue(hooks){var stop=hooks.stop;delete hooks.stop;stop(gotoEnd);};if(typeof type!=="string"){gotoEnd=clearQueue;clearQueue=type;type=undefined;}if(clearQueue&&type!==false){this.queue(type||"fx",[]);}return this.each(function(){var dequeue=true,index=type!=null&&type+"queueHooks",timers=jQuery.timers,data=dataPriv.get(this);if(index){if(data[index]&&data[index].stop){stopQueue(data[index]);}}else{for(index in data){if(data[index]&&data[index].stop&&rrun.test(index)){stopQueue(data[index]);}}}for(index=timers.length;index--;){if(timers[index].elem===this&&(type==null||timers[index].queue===type)){timers[index].anim.stop(gotoEnd);dequeue=false;timers.splice(index,1);}}// Start the next in the queue if the last step wasn't forced.
// Timers currently will call their complete callbacks, which
// will dequeue but only if they were gotoEnd.
if(dequeue||!gotoEnd){jQuery.dequeue(this,type);}});},finish:function finish(type){if(type!==false){type=type||"fx";}return this.each(function(){var index,data=dataPriv.get(this),queue=data[type+"queue"],hooks=data[type+"queueHooks"],timers=jQuery.timers,length=queue?queue.length:0;// Enable finishing flag on private data
data.finish=true;// Empty the queue first
jQuery.queue(this,type,[]);if(hooks&&hooks.stop){hooks.stop.call(this,true);}// Look for any active animations, and finish them
for(index=timers.length;index--;){if(timers[index].elem===this&&timers[index].queue===type){timers[index].anim.stop(true);timers.splice(index,1);}}// Look for any animations in the old queue and finish them
for(index=0;index<length;index++){if(queue[index]&&queue[index].finish){queue[index].finish.call(this);}}// Turn off finishing flag
delete data.finish;});}});jQuery.each(["toggle","show","hide"],function(i,name){var cssFn=jQuery.fn[name];jQuery.fn[name]=function(speed,easing,callback){return speed==null||typeof speed==="boolean"?cssFn.apply(this,arguments):this.animate(genFx(name,true),speed,easing,callback);};});// Generate shortcuts for custom animations
jQuery.each({slideDown:genFx("show"),slideUp:genFx("hide"),slideToggle:genFx("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(name,props){jQuery.fn[name]=function(speed,easing,callback){return this.animate(props,speed,easing,callback);};});jQuery.timers=[];jQuery.fx.tick=function(){var timer,i=0,timers=jQuery.timers;fxNow=Date.now();for(;i<timers.length;i++){timer=timers[i];// Run the timer and safely remove it when done (allowing for external removal)
if(!timer()&&timers[i]===timer){timers.splice(i--,1);}}if(!timers.length){jQuery.fx.stop();}fxNow=undefined;};jQuery.fx.timer=function(timer){jQuery.timers.push(timer);jQuery.fx.start();};jQuery.fx.interval=13;jQuery.fx.start=function(){if(inProgress){return;}inProgress=true;schedule();};jQuery.fx.stop=function(){inProgress=null;};jQuery.fx.speeds={slow:600,fast:200,// Default speed
_default:400};// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay=function(time,type){time=jQuery.fx?jQuery.fx.speeds[time]||time:time;type=type||"fx";return this.queue(type,function(next,hooks){var timeout=window.setTimeout(next,time);hooks.stop=function(){window.clearTimeout(timeout);};});};(function(){var input=document.createElement("input"),select=document.createElement("select"),opt=select.appendChild(document.createElement("option"));input.type="checkbox";// Support: Android <=4.3 only
// Default value for a checkbox should be "on"
support.checkOn=input.value!=="";// Support: IE <=11 only
// Must access selectedIndex to make default options select
support.optSelected=opt.selected;// Support: IE <=11 only
// An input loses its value after becoming a radio
input=document.createElement("input");input.value="t";input.type="radio";support.radioValue=input.value==="t";})();var boolHook,attrHandle=jQuery.expr.attrHandle;jQuery.fn.extend({attr:function attr(name,value){return access(this,jQuery.attr,name,value,arguments.length>1);},removeAttr:function removeAttr(name){return this.each(function(){jQuery.removeAttr(this,name);});}});jQuery.extend({attr:function attr(elem,name,value){var ret,hooks,nType=elem.nodeType;// Don't get/set attributes on text, comment and attribute nodes
if(nType===3||nType===8||nType===2){return;}// Fallback to prop when attributes are not supported
if(typeof elem.getAttribute==="undefined"){return jQuery.prop(elem,name,value);}// Attribute hooks are determined by the lowercase version
// Grab necessary hook if one is defined
if(nType!==1||!jQuery.isXMLDoc(elem)){hooks=jQuery.attrHooks[name.toLowerCase()]||(jQuery.expr.match.bool.test(name)?boolHook:undefined);}if(value!==undefined){if(value===null){jQuery.removeAttr(elem,name);return;}if(hooks&&"set"in hooks&&(ret=hooks.set(elem,value,name))!==undefined){return ret;}elem.setAttribute(name,value+"");return value;}if(hooks&&"get"in hooks&&(ret=hooks.get(elem,name))!==null){return ret;}ret=jQuery.find.attr(elem,name);// Non-existent attributes return null, we normalize to undefined
return ret==null?undefined:ret;},attrHooks:{type:{set:function set(elem,value){if(!support.radioValue&&value==="radio"&&nodeName(elem,"input")){var val=elem.value;elem.setAttribute("type",value);if(val){elem.value=val;}return value;}}}},removeAttr:function removeAttr(elem,value){var name,i=0,// Attribute names can contain non-HTML whitespace characters
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
attrNames=value&&value.match(rnothtmlwhite);if(attrNames&&elem.nodeType===1){while(name=attrNames[i++]){elem.removeAttribute(name);}}}});// Hooks for boolean attributes
boolHook={set:function set(elem,value,name){if(value===false){// Remove boolean attributes when set to false
jQuery.removeAttr(elem,name);}else{elem.setAttribute(name,name);}return name;}};jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g),function(i,name){var getter=attrHandle[name]||jQuery.find.attr;attrHandle[name]=function(elem,name,isXML){var ret,handle,lowercaseName=name.toLowerCase();if(!isXML){// Avoid an infinite loop by temporarily removing this function from the getter
handle=attrHandle[lowercaseName];attrHandle[lowercaseName]=ret;ret=getter(elem,name,isXML)!=null?lowercaseName:null;attrHandle[lowercaseName]=handle;}return ret;};});var rfocusable=/^(?:input|select|textarea|button)$/i,rclickable=/^(?:a|area)$/i;jQuery.fn.extend({prop:function prop(name,value){return access(this,jQuery.prop,name,value,arguments.length>1);},removeProp:function removeProp(name){return this.each(function(){delete this[jQuery.propFix[name]||name];});}});jQuery.extend({prop:function prop(elem,name,value){var ret,hooks,nType=elem.nodeType;// Don't get/set properties on text, comment and attribute nodes
if(nType===3||nType===8||nType===2){return;}if(nType!==1||!jQuery.isXMLDoc(elem)){// Fix name and attach hooks
name=jQuery.propFix[name]||name;hooks=jQuery.propHooks[name];}if(value!==undefined){if(hooks&&"set"in hooks&&(ret=hooks.set(elem,value,name))!==undefined){return ret;}return elem[name]=value;}if(hooks&&"get"in hooks&&(ret=hooks.get(elem,name))!==null){return ret;}return elem[name];},propHooks:{tabIndex:{get:function get(elem){// Support: IE <=9 - 11 only
// elem.tabIndex doesn't always return the
// correct value when it hasn't been explicitly set
// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
// Use proper attribute retrieval(#12072)
var tabindex=jQuery.find.attr(elem,"tabindex");if(tabindex){return parseInt(tabindex,10);}if(rfocusable.test(elem.nodeName)||rclickable.test(elem.nodeName)&&elem.href){return 0;}return-1;}}},propFix:{"for":"htmlFor","class":"className"}});// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if(!support.optSelected){jQuery.propHooks.selected={get:function get(elem){/* eslint no-unused-expressions: "off" */var parent=elem.parentNode;if(parent&&parent.parentNode){parent.parentNode.selectedIndex;}return null;},set:function set(elem){/* eslint no-unused-expressions: "off" */var parent=elem.parentNode;if(parent){parent.selectedIndex;if(parent.parentNode){parent.parentNode.selectedIndex;}}}};}jQuery.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){jQuery.propFix[this.toLowerCase()]=this;});// Strip and collapse whitespace according to HTML spec
// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
function stripAndCollapse(value){var tokens=value.match(rnothtmlwhite)||[];return tokens.join(" ");}function getClass(elem){return elem.getAttribute&&elem.getAttribute("class")||"";}function classesToArray(value){if(Array.isArray(value)){return value;}if(typeof value==="string"){return value.match(rnothtmlwhite)||[];}return[];}jQuery.fn.extend({addClass:function addClass(value){var classes,elem,cur,curValue,clazz,j,finalValue,i=0;if(isFunction(value)){return this.each(function(j){jQuery(this).addClass(value.call(this,j,getClass(this)));});}classes=classesToArray(value);if(classes.length){while(elem=this[i++]){curValue=getClass(elem);cur=elem.nodeType===1&&" "+stripAndCollapse(curValue)+" ";if(cur){j=0;while(clazz=classes[j++]){if(cur.indexOf(" "+clazz+" ")<0){cur+=clazz+" ";}}// Only assign if different to avoid unneeded rendering.
finalValue=stripAndCollapse(cur);if(curValue!==finalValue){elem.setAttribute("class",finalValue);}}}}return this;},removeClass:function removeClass(value){var classes,elem,cur,curValue,clazz,j,finalValue,i=0;if(isFunction(value)){return this.each(function(j){jQuery(this).removeClass(value.call(this,j,getClass(this)));});}if(!arguments.length){return this.attr("class","");}classes=classesToArray(value);if(classes.length){while(elem=this[i++]){curValue=getClass(elem);// This expression is here for better compressibility (see addClass)
cur=elem.nodeType===1&&" "+stripAndCollapse(curValue)+" ";if(cur){j=0;while(clazz=classes[j++]){// Remove *all* instances
while(cur.indexOf(" "+clazz+" ")>-1){cur=cur.replace(" "+clazz+" "," ");}}// Only assign if different to avoid unneeded rendering.
finalValue=stripAndCollapse(cur);if(curValue!==finalValue){elem.setAttribute("class",finalValue);}}}}return this;},toggleClass:function toggleClass(value,stateVal){var type=typeof value==="undefined"?"undefined":_typeof(value),isValidValue=type==="string"||Array.isArray(value);if(typeof stateVal==="boolean"&&isValidValue){return stateVal?this.addClass(value):this.removeClass(value);}if(isFunction(value)){return this.each(function(i){jQuery(this).toggleClass(value.call(this,i,getClass(this),stateVal),stateVal);});}return this.each(function(){var className,i,self,classNames;if(isValidValue){// Toggle individual class names
i=0;self=jQuery(this);classNames=classesToArray(value);while(className=classNames[i++]){// Check each className given, space separated list
if(self.hasClass(className)){self.removeClass(className);}else{self.addClass(className);}}// Toggle whole class name
}else if(value===undefined||type==="boolean"){className=getClass(this);if(className){// Store className if set
dataPriv.set(this,"__className__",className);}// If the element has a class name or if we're passed `false`,
// then remove the whole classname (if there was one, the above saved it).
// Otherwise bring back whatever was previously saved (if anything),
// falling back to the empty string if nothing was stored.
if(this.setAttribute){this.setAttribute("class",className||value===false?"":dataPriv.get(this,"__className__")||"");}}});},hasClass:function hasClass(selector){var className,elem,i=0;className=" "+selector+" ";while(elem=this[i++]){if(elem.nodeType===1&&(" "+stripAndCollapse(getClass(elem))+" ").indexOf(className)>-1){return true;}}return false;}});var rreturn=/\r/g;jQuery.fn.extend({val:function val(value){var hooks,ret,valueIsFunction,elem=this[0];if(!arguments.length){if(elem){hooks=jQuery.valHooks[elem.type]||jQuery.valHooks[elem.nodeName.toLowerCase()];if(hooks&&"get"in hooks&&(ret=hooks.get(elem,"value"))!==undefined){return ret;}ret=elem.value;// Handle most common string cases
if(typeof ret==="string"){return ret.replace(rreturn,"");}// Handle cases where value is null/undef or number
return ret==null?"":ret;}return;}valueIsFunction=isFunction(value);return this.each(function(i){var val;if(this.nodeType!==1){return;}if(valueIsFunction){val=value.call(this,i,jQuery(this).val());}else{val=value;}// Treat null/undefined as ""; convert numbers to string
if(val==null){val="";}else if(typeof val==="number"){val+="";}else if(Array.isArray(val)){val=jQuery.map(val,function(value){return value==null?"":value+"";});}hooks=jQuery.valHooks[this.type]||jQuery.valHooks[this.nodeName.toLowerCase()];// If set returns undefined, fall back to normal setting
if(!hooks||!("set"in hooks)||hooks.set(this,val,"value")===undefined){this.value=val;}});}});jQuery.extend({valHooks:{option:{get:function get(elem){var val=jQuery.find.attr(elem,"value");return val!=null?val:// Support: IE <=10 - 11 only
// option.text throws exceptions (#14686, #14858)
// Strip and collapse whitespace
// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
stripAndCollapse(jQuery.text(elem));}},select:{get:function get(elem){var value,option,i,options=elem.options,index=elem.selectedIndex,one=elem.type==="select-one",values=one?null:[],max=one?index+1:options.length;if(index<0){i=max;}else{i=one?index:0;}// Loop through all the selected options
for(;i<max;i++){option=options[i];// Support: IE <=9 only
// IE8-9 doesn't update selected after form reset (#2551)
if((option.selected||i===index)&&// Don't return options that are disabled or in a disabled optgroup
!option.disabled&&(!option.parentNode.disabled||!nodeName(option.parentNode,"optgroup"))){// Get the specific value for the option
value=jQuery(option).val();// We don't need an array for one selects
if(one){return value;}// Multi-Selects return an array
values.push(value);}}return values;},set:function set(elem,value){var optionSet,option,options=elem.options,values=jQuery.makeArray(value),i=options.length;while(i--){option=options[i];/* eslint-disable no-cond-assign */if(option.selected=jQuery.inArray(jQuery.valHooks.option.get(option),values)>-1){optionSet=true;}/* eslint-enable no-cond-assign */}// Force browsers to behave consistently when non-matching value is set
if(!optionSet){elem.selectedIndex=-1;}return values;}}}});// Radios and checkboxes getter/setter
jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]={set:function set(elem,value){if(Array.isArray(value)){return elem.checked=jQuery.inArray(jQuery(elem).val(),value)>-1;}}};if(!support.checkOn){jQuery.valHooks[this].get=function(elem){return elem.getAttribute("value")===null?"on":elem.value;};}});// Return jQuery for attributes-only inclusion
support.focusin="onfocusin"in window;var rfocusMorph=/^(?:focusinfocus|focusoutblur)$/,stopPropagationCallback=function stopPropagationCallback(e){e.stopPropagation();};jQuery.extend(jQuery.event,{trigger:function trigger(event,data,elem,onlyHandlers){var i,cur,tmp,bubbleType,ontype,handle,special,lastElement,eventPath=[elem||document],type=hasOwn.call(event,"type")?event.type:event,namespaces=hasOwn.call(event,"namespace")?event.namespace.split("."):[];cur=lastElement=tmp=elem=elem||document;// Don't do events on text and comment nodes
if(elem.nodeType===3||elem.nodeType===8){return;}// focus/blur morphs to focusin/out; ensure we're not firing them right now
if(rfocusMorph.test(type+jQuery.event.triggered)){return;}if(type.indexOf(".")>-1){// Namespaced trigger; create a regexp to match event type in handle()
namespaces=type.split(".");type=namespaces.shift();namespaces.sort();}ontype=type.indexOf(":")<0&&"on"+type;// Caller can pass in a jQuery.Event object, Object, or just an event type string
event=event[jQuery.expando]?event:new jQuery.Event(type,(typeof event==="undefined"?"undefined":_typeof(event))==="object"&&event);// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
event.isTrigger=onlyHandlers?2:3;event.namespace=namespaces.join(".");event.rnamespace=event.namespace?new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)"):null;// Clean up the event in case it is being reused
event.result=undefined;if(!event.target){event.target=elem;}// Clone any incoming data and prepend the event, creating the handler arg list
data=data==null?[event]:jQuery.makeArray(data,[event]);// Allow special events to draw outside the lines
special=jQuery.event.special[type]||{};if(!onlyHandlers&&special.trigger&&special.trigger.apply(elem,data)===false){return;}// Determine event propagation path in advance, per W3C events spec (#9951)
// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
if(!onlyHandlers&&!special.noBubble&&!isWindow(elem)){bubbleType=special.delegateType||type;if(!rfocusMorph.test(bubbleType+type)){cur=cur.parentNode;}for(;cur;cur=cur.parentNode){eventPath.push(cur);tmp=cur;}// Only add window if we got to document (e.g., not plain obj or detached DOM)
if(tmp===(elem.ownerDocument||document)){eventPath.push(tmp.defaultView||tmp.parentWindow||window);}}// Fire handlers on the event path
i=0;while((cur=eventPath[i++])&&!event.isPropagationStopped()){lastElement=cur;event.type=i>1?bubbleType:special.bindType||type;// jQuery handler
handle=(dataPriv.get(cur,"events")||{})[event.type]&&dataPriv.get(cur,"handle");if(handle){handle.apply(cur,data);}// Native handler
handle=ontype&&cur[ontype];if(handle&&handle.apply&&acceptData(cur)){event.result=handle.apply(cur,data);if(event.result===false){event.preventDefault();}}}event.type=type;// If nobody prevented the default action, do it now
if(!onlyHandlers&&!event.isDefaultPrevented()){if((!special._default||special._default.apply(eventPath.pop(),data)===false)&&acceptData(elem)){// Call a native DOM method on the target with the same name as the event.
// Don't do default actions on window, that's where global variables be (#6170)
if(ontype&&isFunction(elem[type])&&!isWindow(elem)){// Don't re-trigger an onFOO event when we call its FOO() method
tmp=elem[ontype];if(tmp){elem[ontype]=null;}// Prevent re-triggering of the same event, since we already bubbled it above
jQuery.event.triggered=type;if(event.isPropagationStopped()){lastElement.addEventListener(type,stopPropagationCallback);}elem[type]();if(event.isPropagationStopped()){lastElement.removeEventListener(type,stopPropagationCallback);}jQuery.event.triggered=undefined;if(tmp){elem[ontype]=tmp;}}}}return event.result;},// Piggyback on a donor event to simulate a different one
// Used only for `focus(in | out)` events
simulate:function simulate(type,elem,event){var e=jQuery.extend(new jQuery.Event(),event,{type:type,isSimulated:true});jQuery.event.trigger(e,null,elem);}});jQuery.fn.extend({trigger:function trigger(type,data){return this.each(function(){jQuery.event.trigger(type,data,this);});},triggerHandler:function triggerHandler(type,data){var elem=this[0];if(elem){return jQuery.event.trigger(type,data,elem,true);}}});// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if(!support.focusin){jQuery.each({focus:"focusin",blur:"focusout"},function(orig,fix){// Attach a single capturing handler on the document while someone wants focusin/focusout
var handler=function handler(event){jQuery.event.simulate(fix,event.target,jQuery.event.fix(event));};jQuery.event.special[fix]={setup:function setup(){var doc=this.ownerDocument||this,attaches=dataPriv.access(doc,fix);if(!attaches){doc.addEventListener(orig,handler,true);}dataPriv.access(doc,fix,(attaches||0)+1);},teardown:function teardown(){var doc=this.ownerDocument||this,attaches=dataPriv.access(doc,fix)-1;if(!attaches){doc.removeEventListener(orig,handler,true);dataPriv.remove(doc,fix);}else{dataPriv.access(doc,fix,attaches);}}};});}var location=window.location;var nonce=Date.now();var rquery=/\?/;// Cross-browser xml parsing
jQuery.parseXML=function(data){var xml;if(!data||typeof data!=="string"){return null;}// Support: IE 9 - 11 only
// IE throws on parseFromString with invalid input.
try{xml=new window.DOMParser().parseFromString(data,"text/xml");}catch(e){xml=undefined;}if(!xml||xml.getElementsByTagName("parsererror").length){jQuery.error("Invalid XML: "+data);}return xml;};var rbracket=/\[\]$/,rCRLF=/\r?\n/g,rsubmitterTypes=/^(?:submit|button|image|reset|file)$/i,rsubmittable=/^(?:input|select|textarea|keygen)/i;function buildParams(prefix,obj,traditional,add){var name;if(Array.isArray(obj)){// Serialize array item.
jQuery.each(obj,function(i,v){if(traditional||rbracket.test(prefix)){// Treat each array item as a scalar.
add(prefix,v);}else{// Item is non-scalar (array or object), encode its numeric index.
buildParams(prefix+"["+((typeof v==="undefined"?"undefined":_typeof(v))==="object"&&v!=null?i:"")+"]",v,traditional,add);}});}else if(!traditional&&toType(obj)==="object"){// Serialize object item.
for(name in obj){buildParams(prefix+"["+name+"]",obj[name],traditional,add);}}else{// Serialize scalar item.
add(prefix,obj);}}// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param=function(a,traditional){var prefix,s=[],add=function add(key,valueOrFunction){// If value is a function, invoke it and use its return value
var value=isFunction(valueOrFunction)?valueOrFunction():valueOrFunction;s[s.length]=encodeURIComponent(key)+"="+encodeURIComponent(value==null?"":value);};// If an array was passed in, assume that it is an array of form elements.
if(Array.isArray(a)||a.jquery&&!jQuery.isPlainObject(a)){// Serialize the form elements
jQuery.each(a,function(){add(this.name,this.value);});}else{// If traditional, encode the "old" way (the way 1.3.2 or older
// did it), otherwise encode params recursively.
for(prefix in a){buildParams(prefix,a[prefix],traditional,add);}}// Return the resulting serialization
return s.join("&");};jQuery.fn.extend({serialize:function serialize(){return jQuery.param(this.serializeArray());},serializeArray:function serializeArray(){return this.map(function(){// Can add propHook for "elements" to filter or add form elements
var elements=jQuery.prop(this,"elements");return elements?jQuery.makeArray(elements):this;}).filter(function(){var type=this.type;// Use .is( ":disabled" ) so that fieldset[disabled] works
return this.name&&!jQuery(this).is(":disabled")&&rsubmittable.test(this.nodeName)&&!rsubmitterTypes.test(type)&&(this.checked||!rcheckableType.test(type));}).map(function(i,elem){var val=jQuery(this).val();if(val==null){return null;}if(Array.isArray(val)){return jQuery.map(val,function(val){return{name:elem.name,value:val.replace(rCRLF,"\r\n")};});}return{name:elem.name,value:val.replace(rCRLF,"\r\n")};}).get();}});var r20=/%20/g,rhash=/#.*$/,rantiCache=/([?&])_=[^&]*/,rheaders=/^(.*?):[ \t]*([^\r\n]*)$/mg,// #7653, #8125, #8152: local protocol detection
rlocalProtocol=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,rnoContent=/^(?:GET|HEAD)$/,rprotocol=/^\/\//,/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */prefilters={},/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */transports={},// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
allTypes="*/".concat("*"),// Anchor tag for parsing the document origin
originAnchor=document.createElement("a");originAnchor.href=location.href;// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports(structure){// dataTypeExpression is optional and defaults to "*"
return function(dataTypeExpression,func){if(typeof dataTypeExpression!=="string"){func=dataTypeExpression;dataTypeExpression="*";}var dataType,i=0,dataTypes=dataTypeExpression.toLowerCase().match(rnothtmlwhite)||[];if(isFunction(func)){// For each dataType in the dataTypeExpression
while(dataType=dataTypes[i++]){// Prepend if requested
if(dataType[0]==="+"){dataType=dataType.slice(1)||"*";(structure[dataType]=structure[dataType]||[]).unshift(func);// Otherwise append
}else{(structure[dataType]=structure[dataType]||[]).push(func);}}}};}// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR){var inspected={},seekingTransport=structure===transports;function inspect(dataType){var selected;inspected[dataType]=true;jQuery.each(structure[dataType]||[],function(_,prefilterOrFactory){var dataTypeOrTransport=prefilterOrFactory(options,originalOptions,jqXHR);if(typeof dataTypeOrTransport==="string"&&!seekingTransport&&!inspected[dataTypeOrTransport]){options.dataTypes.unshift(dataTypeOrTransport);inspect(dataTypeOrTransport);return false;}else if(seekingTransport){return!(selected=dataTypeOrTransport);}});return selected;}return inspect(options.dataTypes[0])||!inspected["*"]&&inspect("*");}// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend(target,src){var key,deep,flatOptions=jQuery.ajaxSettings.flatOptions||{};for(key in src){if(src[key]!==undefined){(flatOptions[key]?target:deep||(deep={}))[key]=src[key];}}if(deep){jQuery.extend(true,target,deep);}return target;}/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */function ajaxHandleResponses(s,jqXHR,responses){var ct,type,finalDataType,firstDataType,contents=s.contents,dataTypes=s.dataTypes;// Remove auto dataType and get content-type in the process
while(dataTypes[0]==="*"){dataTypes.shift();if(ct===undefined){ct=s.mimeType||jqXHR.getResponseHeader("Content-Type");}}// Check if we're dealing with a known content-type
if(ct){for(type in contents){if(contents[type]&&contents[type].test(ct)){dataTypes.unshift(type);break;}}}// Check to see if we have a response for the expected dataType
if(dataTypes[0]in responses){finalDataType=dataTypes[0];}else{// Try convertible dataTypes
for(type in responses){if(!dataTypes[0]||s.converters[type+" "+dataTypes[0]]){finalDataType=type;break;}if(!firstDataType){firstDataType=type;}}// Or just use first one
finalDataType=finalDataType||firstDataType;}// If we found a dataType
// We add the dataType to the list if needed
// and return the corresponding response
if(finalDataType){if(finalDataType!==dataTypes[0]){dataTypes.unshift(finalDataType);}return responses[finalDataType];}}/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */function ajaxConvert(s,response,jqXHR,isSuccess){var conv2,current,conv,tmp,prev,converters={},// Work with a copy of dataTypes in case we need to modify it for conversion
dataTypes=s.dataTypes.slice();// Create converters map with lowercased keys
if(dataTypes[1]){for(conv in s.converters){converters[conv.toLowerCase()]=s.converters[conv];}}current=dataTypes.shift();// Convert to each sequential dataType
while(current){if(s.responseFields[current]){jqXHR[s.responseFields[current]]=response;}// Apply the dataFilter if provided
if(!prev&&isSuccess&&s.dataFilter){response=s.dataFilter(response,s.dataType);}prev=current;current=dataTypes.shift();if(current){// There's only work to do if current dataType is non-auto
if(current==="*"){current=prev;// Convert response if prev dataType is non-auto and differs from current
}else if(prev!=="*"&&prev!==current){// Seek a direct converter
conv=converters[prev+" "+current]||converters["* "+current];// If none found, seek a pair
if(!conv){for(conv2 in converters){// If conv2 outputs current
tmp=conv2.split(" ");if(tmp[1]===current){// If prev can be converted to accepted input
conv=converters[prev+" "+tmp[0]]||converters["* "+tmp[0]];if(conv){// Condense equivalence converters
if(conv===true){conv=converters[conv2];// Otherwise, insert the intermediate dataType
}else if(converters[conv2]!==true){current=tmp[0];dataTypes.unshift(tmp[1]);}break;}}}}// Apply converter (if not an equivalence)
if(conv!==true){// Unless errors are allowed to bubble, catch and return them
if(conv&&s.throws){response=conv(response);}else{try{response=conv(response);}catch(e){return{state:"parsererror",error:conv?e:"No conversion from "+prev+" to "+current};}}}}}}return{state:"success",data:response};}jQuery.extend({// Counter for holding the number of active queries
active:0,// Last-Modified header cache for next request
lastModified:{},etag:{},ajaxSettings:{url:location.href,type:"GET",isLocal:rlocalProtocol.test(location.protocol),global:true,processData:true,async:true,contentType:"application/x-www-form-urlencoded; charset=UTF-8",/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/accepts:{"*":allTypes,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},// Data converters
// Keys separate source (or catchall "*") and destination types with a single space
converters:{// Convert anything to text
"* text":String,// Text to html (true = no transformation)
"text html":true,// Evaluate text as a json expression
"text json":JSON.parse,// Parse text as xml
"text xml":jQuery.parseXML},// For options that shouldn't be deep extended:
// you can add your own custom options here if
// and when you create one that shouldn't be
// deep extended (see ajaxExtend)
flatOptions:{url:true,context:true}},// Creates a full fledged settings object into target
// with both ajaxSettings and settings fields.
// If target is omitted, writes into ajaxSettings.
ajaxSetup:function ajaxSetup(target,settings){return settings?// Building a settings object
ajaxExtend(ajaxExtend(target,jQuery.ajaxSettings),settings):// Extending ajaxSettings
ajaxExtend(jQuery.ajaxSettings,target);},ajaxPrefilter:addToPrefiltersOrTransports(prefilters),ajaxTransport:addToPrefiltersOrTransports(transports),// Main method
ajax:function ajax(url,options){// If url is an object, simulate pre-1.5 signature
if((typeof url==="undefined"?"undefined":_typeof(url))==="object"){options=url;url=undefined;}// Force options to be an object
options=options||{};var transport,// URL without anti-cache param
cacheURL,// Response headers
responseHeadersString,responseHeaders,// timeout handle
timeoutTimer,// Url cleanup var
urlAnchor,// Request state (becomes false upon send and true upon completion)
completed,// To know if global events are to be dispatched
fireGlobals,// Loop variable
i,// uncached part of the url
uncached,// Create the final options object
s=jQuery.ajaxSetup({},options),// Callbacks context
callbackContext=s.context||s,// Context for global events is callbackContext if it is a DOM node or jQuery collection
globalEventContext=s.context&&(callbackContext.nodeType||callbackContext.jquery)?jQuery(callbackContext):jQuery.event,// Deferreds
deferred=jQuery.Deferred(),completeDeferred=jQuery.Callbacks("once memory"),// Status-dependent callbacks
_statusCode=s.statusCode||{},// Headers (they are sent all at once)
requestHeaders={},requestHeadersNames={},// Default abort message
strAbort="canceled",// Fake xhr
jqXHR={readyState:0,// Builds headers hashtable if needed
getResponseHeader:function getResponseHeader(key){var match;if(completed){if(!responseHeaders){responseHeaders={};while(match=rheaders.exec(responseHeadersString)){responseHeaders[match[1].toLowerCase()]=match[2];}}match=responseHeaders[key.toLowerCase()];}return match==null?null:match;},// Raw string
getAllResponseHeaders:function getAllResponseHeaders(){return completed?responseHeadersString:null;},// Caches the header
setRequestHeader:function setRequestHeader(name,value){if(completed==null){name=requestHeadersNames[name.toLowerCase()]=requestHeadersNames[name.toLowerCase()]||name;requestHeaders[name]=value;}return this;},// Overrides response content-type header
overrideMimeType:function overrideMimeType(type){if(completed==null){s.mimeType=type;}return this;},// Status-dependent callbacks
statusCode:function statusCode(map){var code;if(map){if(completed){// Execute the appropriate callbacks
jqXHR.always(map[jqXHR.status]);}else{// Lazy-add the new callbacks in a way that preserves old ones
for(code in map){_statusCode[code]=[_statusCode[code],map[code]];}}}return this;},// Cancel the request
abort:function abort(statusText){var finalText=statusText||strAbort;if(transport){transport.abort(finalText);}done(0,finalText);return this;}};// Attach deferreds
deferred.promise(jqXHR);// Add protocol if not provided (prefilters might expect it)
// Handle falsy url in the settings object (#10093: consistency with old signature)
// We also use the url parameter if available
s.url=((url||s.url||location.href)+"").replace(rprotocol,location.protocol+"//");// Alias method option to type as per ticket #12004
s.type=options.method||options.type||s.method||s.type;// Extract dataTypes list
s.dataTypes=(s.dataType||"*").toLowerCase().match(rnothtmlwhite)||[""];// A cross-domain request is in order when the origin doesn't match the current origin.
if(s.crossDomain==null){urlAnchor=document.createElement("a");// Support: IE <=8 - 11, Edge 12 - 15
// IE throws exception on accessing the href property if url is malformed,
// e.g. http://example.com:80x/
try{urlAnchor.href=s.url;// Support: IE <=8 - 11 only
// Anchor's host property isn't correctly set when s.url is relative
urlAnchor.href=urlAnchor.href;s.crossDomain=originAnchor.protocol+"//"+originAnchor.host!==urlAnchor.protocol+"//"+urlAnchor.host;}catch(e){// If there is an error parsing the URL, assume it is crossDomain,
// it can be rejected by the transport if it is invalid
s.crossDomain=true;}}// Convert data if not already a string
if(s.data&&s.processData&&typeof s.data!=="string"){s.data=jQuery.param(s.data,s.traditional);}// Apply prefilters
inspectPrefiltersOrTransports(prefilters,s,options,jqXHR);// If request was aborted inside a prefilter, stop there
if(completed){return jqXHR;}// We can fire global events as of now if asked to
// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
fireGlobals=jQuery.event&&s.global;// Watch for a new set of requests
if(fireGlobals&&jQuery.active++===0){jQuery.event.trigger("ajaxStart");}// Uppercase the type
s.type=s.type.toUpperCase();// Determine if request has content
s.hasContent=!rnoContent.test(s.type);// Save the URL in case we're toying with the If-Modified-Since
// and/or If-None-Match header later on
// Remove hash to simplify url manipulation
cacheURL=s.url.replace(rhash,"");// More options handling for requests with no content
if(!s.hasContent){// Remember the hash so we can put it back
uncached=s.url.slice(cacheURL.length);// If data is available and should be processed, append data to url
if(s.data&&(s.processData||typeof s.data==="string")){cacheURL+=(rquery.test(cacheURL)?"&":"?")+s.data;// #9682: remove data so that it's not used in an eventual retry
delete s.data;}// Add or update anti-cache param if needed
if(s.cache===false){cacheURL=cacheURL.replace(rantiCache,"$1");uncached=(rquery.test(cacheURL)?"&":"?")+"_="+nonce++ +uncached;}// Put hash and anti-cache on the URL that will be requested (gh-1732)
s.url=cacheURL+uncached;// Change '%20' to '+' if this is encoded form body content (gh-2658)
}else if(s.data&&s.processData&&(s.contentType||"").indexOf("application/x-www-form-urlencoded")===0){s.data=s.data.replace(r20,"+");}// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
if(s.ifModified){if(jQuery.lastModified[cacheURL]){jqXHR.setRequestHeader("If-Modified-Since",jQuery.lastModified[cacheURL]);}if(jQuery.etag[cacheURL]){jqXHR.setRequestHeader("If-None-Match",jQuery.etag[cacheURL]);}}// Set the correct header, if data is being sent
if(s.data&&s.hasContent&&s.contentType!==false||options.contentType){jqXHR.setRequestHeader("Content-Type",s.contentType);}// Set the Accepts header for the server, depending on the dataType
jqXHR.setRequestHeader("Accept",s.dataTypes[0]&&s.accepts[s.dataTypes[0]]?s.accepts[s.dataTypes[0]]+(s.dataTypes[0]!=="*"?", "+allTypes+"; q=0.01":""):s.accepts["*"]);// Check for headers option
for(i in s.headers){jqXHR.setRequestHeader(i,s.headers[i]);}// Allow custom headers/mimetypes and early abort
if(s.beforeSend&&(s.beforeSend.call(callbackContext,jqXHR,s)===false||completed)){// Abort if not done already and return
return jqXHR.abort();}// Aborting is no longer a cancellation
strAbort="abort";// Install callbacks on deferreds
completeDeferred.add(s.complete);jqXHR.done(s.success);jqXHR.fail(s.error);// Get transport
transport=inspectPrefiltersOrTransports(transports,s,options,jqXHR);// If no transport, we auto-abort
if(!transport){done(-1,"No Transport");}else{jqXHR.readyState=1;// Send global event
if(fireGlobals){globalEventContext.trigger("ajaxSend",[jqXHR,s]);}// If request was aborted inside ajaxSend, stop there
if(completed){return jqXHR;}// Timeout
if(s.async&&s.timeout>0){timeoutTimer=window.setTimeout(function(){jqXHR.abort("timeout");},s.timeout);}try{completed=false;transport.send(requestHeaders,done);}catch(e){// Rethrow post-completion exceptions
if(completed){throw e;}// Propagate others as results
done(-1,e);}}// Callback for when everything is done
function done(status,nativeStatusText,responses,headers){var isSuccess,success,error,response,modified,statusText=nativeStatusText;// Ignore repeat invocations
if(completed){return;}completed=true;// Clear timeout if it exists
if(timeoutTimer){window.clearTimeout(timeoutTimer);}// Dereference transport for early garbage collection
// (no matter how long the jqXHR object will be used)
transport=undefined;// Cache response headers
responseHeadersString=headers||"";// Set readyState
jqXHR.readyState=status>0?4:0;// Determine if successful
isSuccess=status>=200&&status<300||status===304;// Get response data
if(responses){response=ajaxHandleResponses(s,jqXHR,responses);}// Convert no matter what (that way responseXXX fields are always set)
response=ajaxConvert(s,response,jqXHR,isSuccess);// If successful, handle type chaining
if(isSuccess){// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
if(s.ifModified){modified=jqXHR.getResponseHeader("Last-Modified");if(modified){jQuery.lastModified[cacheURL]=modified;}modified=jqXHR.getResponseHeader("etag");if(modified){jQuery.etag[cacheURL]=modified;}}// if no content
if(status===204||s.type==="HEAD"){statusText="nocontent";// if not modified
}else if(status===304){statusText="notmodified";// If we have data, let's convert it
}else{statusText=response.state;success=response.data;error=response.error;isSuccess=!error;}}else{// Extract error from statusText and normalize for non-aborts
error=statusText;if(status||!statusText){statusText="error";if(status<0){status=0;}}}// Set data for the fake xhr object
jqXHR.status=status;jqXHR.statusText=(nativeStatusText||statusText)+"";// Success/Error
if(isSuccess){deferred.resolveWith(callbackContext,[success,statusText,jqXHR]);}else{deferred.rejectWith(callbackContext,[jqXHR,statusText,error]);}// Status-dependent callbacks
jqXHR.statusCode(_statusCode);_statusCode=undefined;if(fireGlobals){globalEventContext.trigger(isSuccess?"ajaxSuccess":"ajaxError",[jqXHR,s,isSuccess?success:error]);}// Complete
completeDeferred.fireWith(callbackContext,[jqXHR,statusText]);if(fireGlobals){globalEventContext.trigger("ajaxComplete",[jqXHR,s]);// Handle the global AJAX counter
if(! --jQuery.active){jQuery.event.trigger("ajaxStop");}}}return jqXHR;},getJSON:function getJSON(url,data,callback){return jQuery.get(url,data,callback,"json");},getScript:function getScript(url,callback){return jQuery.get(url,undefined,callback,"script");}});jQuery.each(["get","post"],function(i,method){jQuery[method]=function(url,data,callback,type){// Shift arguments if data argument was omitted
if(isFunction(data)){type=type||callback;callback=data;data=undefined;}// The url can be an options object (which then must have .url)
return jQuery.ajax(jQuery.extend({url:url,type:method,dataType:type,data:data,success:callback},jQuery.isPlainObject(url)&&url));};});jQuery._evalUrl=function(url){return jQuery.ajax({url:url,// Make this explicit, since user can override this through ajaxSetup (#11264)
type:"GET",dataType:"script",cache:true,async:false,global:false,"throws":true});};jQuery.fn.extend({wrapAll:function wrapAll(html){var wrap;if(this[0]){if(isFunction(html)){html=html.call(this[0]);}// The elements to wrap the target around
wrap=jQuery(html,this[0].ownerDocument).eq(0).clone(true);if(this[0].parentNode){wrap.insertBefore(this[0]);}wrap.map(function(){var elem=this;while(elem.firstElementChild){elem=elem.firstElementChild;}return elem;}).append(this);}return this;},wrapInner:function wrapInner(html){if(isFunction(html)){return this.each(function(i){jQuery(this).wrapInner(html.call(this,i));});}return this.each(function(){var self=jQuery(this),contents=self.contents();if(contents.length){contents.wrapAll(html);}else{self.append(html);}});},wrap:function wrap(html){var htmlIsFunction=isFunction(html);return this.each(function(i){jQuery(this).wrapAll(htmlIsFunction?html.call(this,i):html);});},unwrap:function unwrap(selector){this.parent(selector).not("body").each(function(){jQuery(this).replaceWith(this.childNodes);});return this;}});jQuery.expr.pseudos.hidden=function(elem){return!jQuery.expr.pseudos.visible(elem);};jQuery.expr.pseudos.visible=function(elem){return!!(elem.offsetWidth||elem.offsetHeight||elem.getClientRects().length);};jQuery.ajaxSettings.xhr=function(){try{return new window.XMLHttpRequest();}catch(e){}};var xhrSuccessStatus={// File protocol always yields status code 0, assume 200
0:200,// Support: IE <=9 only
// #1450: sometimes IE returns 1223 when it should be 204
1223:204},xhrSupported=jQuery.ajaxSettings.xhr();support.cors=!!xhrSupported&&"withCredentials"in xhrSupported;support.ajax=xhrSupported=!!xhrSupported;jQuery.ajaxTransport(function(options){var _callback,errorCallback;// Cross domain only allowed if supported through XMLHttpRequest
if(support.cors||xhrSupported&&!options.crossDomain){return{send:function send(headers,complete){var i,xhr=options.xhr();xhr.open(options.type,options.url,options.async,options.username,options.password);// Apply custom fields if provided
if(options.xhrFields){for(i in options.xhrFields){xhr[i]=options.xhrFields[i];}}// Override mime type if needed
if(options.mimeType&&xhr.overrideMimeType){xhr.overrideMimeType(options.mimeType);}// X-Requested-With header
// For cross-domain requests, seeing as conditions for a preflight are
// akin to a jigsaw puzzle, we simply never set it to be sure.
// (it can always be set on a per-request basis or even using ajaxSetup)
// For same-domain requests, won't change header if already provided.
if(!options.crossDomain&&!headers["X-Requested-With"]){headers["X-Requested-With"]="XMLHttpRequest";}// Set headers
for(i in headers){xhr.setRequestHeader(i,headers[i]);}// Callback
_callback=function callback(type){return function(){if(_callback){_callback=errorCallback=xhr.onload=xhr.onerror=xhr.onabort=xhr.ontimeout=xhr.onreadystatechange=null;if(type==="abort"){xhr.abort();}else if(type==="error"){// Support: IE <=9 only
// On a manual native abort, IE9 throws
// errors on any property access that is not readyState
if(typeof xhr.status!=="number"){complete(0,"error");}else{complete(// File: protocol always yields status 0; see #8605, #14207
xhr.status,xhr.statusText);}}else{complete(xhrSuccessStatus[xhr.status]||xhr.status,xhr.statusText,// Support: IE <=9 only
// IE9 has no XHR2 but throws on binary (trac-11426)
// For XHR2 non-text, let the caller handle it (gh-2498)
(xhr.responseType||"text")!=="text"||typeof xhr.responseText!=="string"?{binary:xhr.response}:{text:xhr.responseText},xhr.getAllResponseHeaders());}}};};// Listen to events
xhr.onload=_callback();errorCallback=xhr.onerror=xhr.ontimeout=_callback("error");// Support: IE 9 only
// Use onreadystatechange to replace onabort
// to handle uncaught aborts
if(xhr.onabort!==undefined){xhr.onabort=errorCallback;}else{xhr.onreadystatechange=function(){// Check readyState before timeout as it changes
if(xhr.readyState===4){// Allow onerror to be called first,
// but that will not handle a native abort
// Also, save errorCallback to a variable
// as xhr.onerror cannot be accessed
window.setTimeout(function(){if(_callback){errorCallback();}});}};}// Create the abort callback
_callback=_callback("abort");try{// Do send the request (this may raise an exception)
xhr.send(options.hasContent&&options.data||null);}catch(e){// #14683: Only rethrow if this hasn't been notified as an error yet
if(_callback){throw e;}}},abort:function abort(){if(_callback){_callback();}}};}});// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter(function(s){if(s.crossDomain){s.contents.script=false;}});// Install script dataType
jQuery.ajaxSetup({accepts:{script:"text/javascript, application/javascript, "+"application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function textScript(text){jQuery.globalEval(text);return text;}}});// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter("script",function(s){if(s.cache===undefined){s.cache=false;}if(s.crossDomain){s.type="GET";}});// Bind script tag hack transport
jQuery.ajaxTransport("script",function(s){// This transport only deals with cross domain requests
if(s.crossDomain){var script,_callback2;return{send:function send(_,complete){script=jQuery("<script>").prop({charset:s.scriptCharset,src:s.url}).on("load error",_callback2=function callback(evt){script.remove();_callback2=null;if(evt){complete(evt.type==="error"?404:200,evt.type);}});// Use native DOM manipulation to avoid our domManip AJAX trickery
document.head.appendChild(script[0]);},abort:function abort(){if(_callback2){_callback2();}}};}});var oldCallbacks=[],rjsonp=/(=)\?(?=&|$)|\?\?/;// Default jsonp settings
jQuery.ajaxSetup({jsonp:"callback",jsonpCallback:function jsonpCallback(){var callback=oldCallbacks.pop()||jQuery.expando+"_"+nonce++;this[callback]=true;return callback;}});// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter("json jsonp",function(s,originalSettings,jqXHR){var callbackName,overwritten,responseContainer,jsonProp=s.jsonp!==false&&(rjsonp.test(s.url)?"url":typeof s.data==="string"&&(s.contentType||"").indexOf("application/x-www-form-urlencoded")===0&&rjsonp.test(s.data)&&"data");// Handle iff the expected data type is "jsonp" or we have a parameter to set
if(jsonProp||s.dataTypes[0]==="jsonp"){// Get callback name, remembering preexisting value associated with it
callbackName=s.jsonpCallback=isFunction(s.jsonpCallback)?s.jsonpCallback():s.jsonpCallback;// Insert callback into url or form data
if(jsonProp){s[jsonProp]=s[jsonProp].replace(rjsonp,"$1"+callbackName);}else if(s.jsonp!==false){s.url+=(rquery.test(s.url)?"&":"?")+s.jsonp+"="+callbackName;}// Use data converter to retrieve json after script execution
s.converters["script json"]=function(){if(!responseContainer){jQuery.error(callbackName+" was not called");}return responseContainer[0];};// Force json dataType
s.dataTypes[0]="json";// Install callback
overwritten=window[callbackName];window[callbackName]=function(){responseContainer=arguments;};// Clean-up function (fires after converters)
jqXHR.always(function(){// If previous value didn't exist - remove it
if(overwritten===undefined){jQuery(window).removeProp(callbackName);// Otherwise restore preexisting value
}else{window[callbackName]=overwritten;}// Save back as free
if(s[callbackName]){// Make sure that re-using the options doesn't screw things around
s.jsonpCallback=originalSettings.jsonpCallback;// Save the callback name for future use
oldCallbacks.push(callbackName);}// Call if it was a function and we have a response
if(responseContainer&&isFunction(overwritten)){overwritten(responseContainer[0]);}responseContainer=overwritten=undefined;});// Delegate to script
return"script";}});// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument=function(){var body=document.implementation.createHTMLDocument("").body;body.innerHTML="<form></form><form></form>";return body.childNodes.length===2;}();// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML=function(data,context,keepScripts){if(typeof data!=="string"){return[];}if(typeof context==="boolean"){keepScripts=context;context=false;}var base,parsed,scripts;if(!context){// Stop scripts or inline event handlers from being executed immediately
// by using document.implementation
if(support.createHTMLDocument){context=document.implementation.createHTMLDocument("");// Set the base href for the created document
// so any parsed elements with URLs
// are based on the document's URL (gh-2965)
base=context.createElement("base");base.href=document.location.href;context.head.appendChild(base);}else{context=document;}}parsed=rsingleTag.exec(data);scripts=!keepScripts&&[];// Single tag
if(parsed){return[context.createElement(parsed[1])];}parsed=buildFragment([data],context,scripts);if(scripts&&scripts.length){jQuery(scripts).remove();}return jQuery.merge([],parsed.childNodes);};/**
 * Load a url into a page
 */jQuery.fn.load=function(url,params,callback){var selector,type,response,self=this,off=url.indexOf(" ");if(off>-1){selector=stripAndCollapse(url.slice(off));url=url.slice(0,off);}// If it's a function
if(isFunction(params)){// We assume that it's the callback
callback=params;params=undefined;// Otherwise, build a param string
}else if(params&&(typeof params==="undefined"?"undefined":_typeof(params))==="object"){type="POST";}// If we have elements to modify, make the request
if(self.length>0){jQuery.ajax({url:url,// If "type" variable is undefined, then "GET" method will be used.
// Make value of this field explicit since
// user can override it through ajaxSetup method
type:type||"GET",dataType:"html",data:params}).done(function(responseText){// Save response for use in complete callback
response=arguments;self.html(selector?// If a selector was specified, locate the right elements in a dummy div
// Exclude scripts to avoid IE 'Permission Denied' errors
jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector):// Otherwise use the full result
responseText);// If the request succeeds, this function gets "data", "status", "jqXHR"
// but they are ignored because response was set above.
// If it fails, this function gets "jqXHR", "status", "error"
}).always(callback&&function(jqXHR,status){self.each(function(){callback.apply(this,response||[jqXHR.responseText,status,jqXHR]);});});}return this;};// Attach a bunch of functions for handling common AJAX events
jQuery.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(i,type){jQuery.fn[type]=function(fn){return this.on(type,fn);};});jQuery.expr.pseudos.animated=function(elem){return jQuery.grep(jQuery.timers,function(fn){return elem===fn.elem;}).length;};jQuery.offset={setOffset:function setOffset(elem,options,i){var curPosition,curLeft,curCSSTop,curTop,curOffset,curCSSLeft,calculatePosition,position=jQuery.css(elem,"position"),curElem=jQuery(elem),props={};// Set position first, in-case top/left are set even on static elem
if(position==="static"){elem.style.position="relative";}curOffset=curElem.offset();curCSSTop=jQuery.css(elem,"top");curCSSLeft=jQuery.css(elem,"left");calculatePosition=(position==="absolute"||position==="fixed")&&(curCSSTop+curCSSLeft).indexOf("auto")>-1;// Need to be able to calculate position if either
// top or left is auto and position is either absolute or fixed
if(calculatePosition){curPosition=curElem.position();curTop=curPosition.top;curLeft=curPosition.left;}else{curTop=parseFloat(curCSSTop)||0;curLeft=parseFloat(curCSSLeft)||0;}if(isFunction(options)){// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
options=options.call(elem,i,jQuery.extend({},curOffset));}if(options.top!=null){props.top=options.top-curOffset.top+curTop;}if(options.left!=null){props.left=options.left-curOffset.left+curLeft;}if("using"in options){options.using.call(elem,props);}else{curElem.css(props);}}};jQuery.fn.extend({// offset() relates an element's border box to the document origin
offset:function offset(options){// Preserve chaining for setter
if(arguments.length){return options===undefined?this:this.each(function(i){jQuery.offset.setOffset(this,options,i);});}var rect,win,elem=this[0];if(!elem){return;}// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
// Support: IE <=11 only
// Running getBoundingClientRect on a
// disconnected node in IE throws an error
if(!elem.getClientRects().length){return{top:0,left:0};}// Get document-relative position by adding viewport scroll to viewport-relative gBCR
rect=elem.getBoundingClientRect();win=elem.ownerDocument.defaultView;return{top:rect.top+win.pageYOffset,left:rect.left+win.pageXOffset};},// position() relates an element's margin box to its offset parent's padding box
// This corresponds to the behavior of CSS absolute positioning
position:function position(){if(!this[0]){return;}var offsetParent,offset,doc,elem=this[0],parentOffset={top:0,left:0};// position:fixed elements are offset from the viewport, which itself always has zero offset
if(jQuery.css(elem,"position")==="fixed"){// Assume position:fixed implies availability of getBoundingClientRect
offset=elem.getBoundingClientRect();}else{offset=this.offset();// Account for the *real* offset parent, which can be the document or its root element
// when a statically positioned element is identified
doc=elem.ownerDocument;offsetParent=elem.offsetParent||doc.documentElement;while(offsetParent&&(offsetParent===doc.body||offsetParent===doc.documentElement)&&jQuery.css(offsetParent,"position")==="static"){offsetParent=offsetParent.parentNode;}if(offsetParent&&offsetParent!==elem&&offsetParent.nodeType===1){// Incorporate borders into its offset, since they are outside its content origin
parentOffset=jQuery(offsetParent).offset();parentOffset.top+=jQuery.css(offsetParent,"borderTopWidth",true);parentOffset.left+=jQuery.css(offsetParent,"borderLeftWidth",true);}}// Subtract parent offsets and element margins
return{top:offset.top-parentOffset.top-jQuery.css(elem,"marginTop",true),left:offset.left-parentOffset.left-jQuery.css(elem,"marginLeft",true)};},// This method will return documentElement in the following cases:
// 1) For the element inside the iframe without offsetParent, this method will return
//    documentElement of the parent window
// 2) For the hidden or detached element
// 3) For body or html element, i.e. in case of the html node - it will return itself
//
// but those exceptions were never presented as a real life use-cases
// and might be considered as more preferable results.
//
// This logic, however, is not guaranteed and can change at any point in the future
offsetParent:function offsetParent(){return this.map(function(){var offsetParent=this.offsetParent;while(offsetParent&&jQuery.css(offsetParent,"position")==="static"){offsetParent=offsetParent.offsetParent;}return offsetParent||documentElement;});}});// Create scrollLeft and scrollTop methods
jQuery.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(method,prop){var top="pageYOffset"===prop;jQuery.fn[method]=function(val){return access(this,function(elem,method,val){// Coalesce documents and windows
var win;if(isWindow(elem)){win=elem;}else if(elem.nodeType===9){win=elem.defaultView;}if(val===undefined){return win?win[prop]:elem[method];}if(win){win.scrollTo(!top?val:win.pageXOffset,top?val:win.pageYOffset);}else{elem[method]=val;}},method,val,arguments.length);};});// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each(["top","left"],function(i,prop){jQuery.cssHooks[prop]=addGetHookIf(support.pixelPosition,function(elem,computed){if(computed){computed=curCSS(elem,prop);// If curCSS returns percentage, fallback to offset
return rnumnonpx.test(computed)?jQuery(elem).position()[prop]+"px":computed;}});});// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each({Height:"height",Width:"width"},function(name,type){jQuery.each({padding:"inner"+name,content:type,"":"outer"+name},function(defaultExtra,funcName){// Margin is only for outerHeight, outerWidth
jQuery.fn[funcName]=function(margin,value){var chainable=arguments.length&&(defaultExtra||typeof margin!=="boolean"),extra=defaultExtra||(margin===true||value===true?"margin":"border");return access(this,function(elem,type,value){var doc;if(isWindow(elem)){// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
return funcName.indexOf("outer")===0?elem["inner"+name]:elem.document.documentElement["client"+name];}// Get document width or height
if(elem.nodeType===9){doc=elem.documentElement;// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
// whichever is greatest
return Math.max(elem.body["scroll"+name],doc["scroll"+name],elem.body["offset"+name],doc["offset"+name],doc["client"+name]);}return value===undefined?// Get width or height on the element, requesting but not forcing parseFloat
jQuery.css(elem,type,extra):// Set width or height on the element
jQuery.style(elem,type,value,extra);},type,chainable?margin:undefined,chainable);};});});jQuery.each(("blur focus focusin focusout resize scroll click dblclick "+"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave "+"change select submit keydown keypress keyup contextmenu").split(" "),function(i,name){// Handle event binding
jQuery.fn[name]=function(data,fn){return arguments.length>0?this.on(name,null,data,fn):this.trigger(name);};});jQuery.fn.extend({hover:function hover(fnOver,fnOut){return this.mouseenter(fnOver).mouseleave(fnOut||fnOver);}});jQuery.fn.extend({bind:function bind(types,data,fn){return this.on(types,null,data,fn);},unbind:function unbind(types,fn){return this.off(types,null,fn);},delegate:function delegate(selector,types,data,fn){return this.on(types,selector,data,fn);},undelegate:function undelegate(selector,types,fn){// ( namespace ) or ( selector, types [, fn] )
return arguments.length===1?this.off(selector,"**"):this.off(types,selector||"**",fn);}});// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy=function(fn,context){var tmp,args,proxy;if(typeof context==="string"){tmp=fn[context];context=fn;fn=tmp;}// Quick check to determine if target is callable, in the spec
// this throws a TypeError, but we will just return undefined.
if(!isFunction(fn)){return undefined;}// Simulated bind
args=_slice.call(arguments,2);proxy=function proxy(){return fn.apply(context||this,args.concat(_slice.call(arguments)));};// Set the guid of unique handler to the same of original handler, so it can be removed
proxy.guid=fn.guid=fn.guid||jQuery.guid++;return proxy;};jQuery.holdReady=function(hold){if(hold){jQuery.readyWait++;}else{jQuery.ready(true);}};jQuery.isArray=Array.isArray;jQuery.parseJSON=JSON.parse;jQuery.nodeName=nodeName;jQuery.isFunction=isFunction;jQuery.isWindow=isWindow;jQuery.camelCase=camelCase;jQuery.type=toType;jQuery.now=Date.now;jQuery.isNumeric=function(obj){// As of jQuery 3.0, isNumeric is limited to
// strings and numbers (primitives or objects)
// that can be coerced to finite numbers (gh-2662)
var type=jQuery.type(obj);return(type==="number"||type==="string")&&// parseFloat NaNs numeric-cast false positives ("")
// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
// subtraction forces infinities to NaN
!isNaN(obj-parseFloat(obj));};// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.
// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
if(typeof define==="function"&&define.amd){define("jquery",[],function(){return jQuery;});}var// Map over jQuery in case of overwrite
_jQuery=window.jQuery,// Map over the $ in case of overwrite
_$=window.$;jQuery.noConflict=function(deep){if(window.$===jQuery){window.$=_$;}if(deep&&window.jQuery===jQuery){window.jQuery=_jQuery;}return jQuery;};// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if(!noGlobal){window.jQuery=window.$=jQuery;}return jQuery;});},{}],3:[function(require,module,exports){var Tone=require("Tone");var $=require('jquery');var noteMap={"E":"F2,FS2,G2,GS2,A2,AS2,B2,C3,CS3,D3,DS3,E3".split(','),"A":"AS2,B2,C3,CS3,D3,DS3,E3,F3,FS3,G3,GS3,A3".split(','),"D":"DS3,E3,F3,FS3,G3,GS3,A3,AS3,B3,C4,CS4,D4".split(','),"G":"GS3,A3,AS3,B3,C4,CS4,D4,DS4,E4,F4,FS4,G4".split(','),"B":"C4,CS4,D4,DS4,E4,F4,FS4,G4,GS4,A4,AS4,B4".split(','),"EHi":"F4,FS4,G4,GS4,A4,AS4,B4,C5,CS5,D5,DS5,E5".split(',')};var SELECTED_STRING="E";var IS_RUNNING=false;var NOTE_INDEX=0;//create a synth and connect it to the master output (your speakers)
var SYNTH=new Tone.Synth().toMaster();$('document').ready(function(){makeNoteGrid(noteMap[SELECTED_STRING]);selectString(SELECTED_STRING);$(".string").on('click',function(){selectString($(this).text());});$("#bpm-input").val(60);changeBPM(60);Tone.Transport.scheduleRepeat(function(time){playNote(NOTE_INDEX);},"4n");$("#start-button").mouseup(toggleExercise);$("#shuffle-button").mouseup(function(){shuffleNotes();});$("#bpm-input").change(function(){changeBPM(parseInt($("#bpm-input").val()));});footerAlign();});$(window).resize(function(){footerAlign();});function selectString(S){stopExcercise();SELECTED_STRING=S;$(".string").removeClass('selected');$("#"+jq("str-"+S)).addClass('selected');makeNoteGrid(noteMap[SELECTED_STRING]);shuffleNotes();}function changeBPM(newValue){var minBPM=1;var maxBPM=500;newValue=Math.max(newValue,minBPM);newValue=Math.min(newValue,maxBPM);$("#bpm-input").val(newValue);Tone.Transport.bpm.rampTo(newValue,2);}function shuffleNotes(){for(var i=0;i<Object.keys(noteMap).length;i++){var S=Object.keys(noteMap)[i];noteMap[S]=shuffle(noteMap[S]);}stopExcercise();makeNoteGrid(noteMap[SELECTED_STRING]);}function playNote(noteIndex){var noteName=noteMap[SELECTED_STRING][NOTE_INDEX%noteMap[SELECTED_STRING].length];var prevNoteName=noteMap[SELECTED_STRING][wrapIndex(NOTE_INDEX-1,noteMap[SELECTED_STRING].length)];$("#note-"+noteName).addClass("note-name-selected");$("#note-"+prevNoteName).removeClass("note-name-selected");SYNTH.triggerAttackRelease(getFixedNoteName(noteName),"8n");NOTE_INDEX++;}function getDisplayNoteName(noteName){return getFixedNoteName(noteName).substring(0,noteName.length-1);}function getFixedNoteName(noteName){return noteName.replace("S","#");}function toggleExercise(){if(!IS_RUNNING){startExercise();}else{stopExcercise();}}function startExercise(){Tone.Transport.start();$("#start-button").text("Stop");NOTE_INDEX=0;IS_RUNNING=true;}function stopExcercise(){Tone.Transport.stop();$("#start-button").text("Start");NOTE_INDEX=0;for(var i=0;i<noteMap[SELECTED_STRING].length;i++){var noteName=noteMap[SELECTED_STRING][i];$("#note-"+noteName).removeClass("note-name-selected");}IS_RUNNING=false;}function makeNote(noteName){var parent=$("<div>",{id:"note-"+noteName,"class":"note-name noselect"});parent.append("<p>"+getDisplayNoteName(noteName)+"</p>");return parent;}function makeNoteGrid(noteStrings){var noteGridElement=$("#note-grid");noteGridElement.empty();for(var i=0;i<noteStrings.length;i++){noteGridElement.append(makeNote(noteStrings[i]));}// for (let col = 0; col < 3; col++) {
//     var rowElement = $("<div>", { "class": "row" });
//     for (let row = 0; row < 4; row++) {
//         rowElement.append(makeNote(noteStrings[col * 4 + row]))
//     }
//     noteGridElement.append(rowElement);
// }
}function wrapIndex(i,i_max){return(i%i_max+i_max)%i_max;}function shuffle(array){var currentIndex=array.length,temporaryValue,randomIndex;// While there remain elements to shuffle...
while(0!==currentIndex){// Pick a remaining element...
randomIndex=Math.floor(Math.random()*currentIndex);currentIndex-=1;// And swap it with the current element.
temporaryValue=array[currentIndex];array[currentIndex]=array[randomIndex];array[randomIndex]=temporaryValue;}return array;}function jq(myid){return myid.replace(/(:|\.|\[|\]|,|=|@)/g,"\\$1");}},{"Tone":1,"jquery":2}]},{},[3]);
var Ky=Object.defineProperty;var Zy=(t,e,n)=>e in t?Ky(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Co=(t,e,n)=>Zy(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function Qy(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var mv={exports:{}},Xu={},gv={exports:{}},Ye={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ba=Symbol.for("react.element"),Jy=Symbol.for("react.portal"),ex=Symbol.for("react.fragment"),tx=Symbol.for("react.strict_mode"),nx=Symbol.for("react.profiler"),ix=Symbol.for("react.provider"),rx=Symbol.for("react.context"),sx=Symbol.for("react.forward_ref"),ox=Symbol.for("react.suspense"),ax=Symbol.for("react.memo"),lx=Symbol.for("react.lazy"),bp=Symbol.iterator;function ux(t){return t===null||typeof t!="object"?null:(t=bp&&t[bp]||t["@@iterator"],typeof t=="function"?t:null)}var vv={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_v=Object.assign,yv={};function So(t,e,n){this.props=t,this.context=e,this.refs=yv,this.updater=n||vv}So.prototype.isReactComponent={};So.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};So.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function xv(){}xv.prototype=So.prototype;function Zf(t,e,n){this.props=t,this.context=e,this.refs=yv,this.updater=n||vv}var Qf=Zf.prototype=new xv;Qf.constructor=Zf;_v(Qf,So.prototype);Qf.isPureReactComponent=!0;var Lp=Array.isArray,Sv=Object.prototype.hasOwnProperty,Jf={current:null},Mv={key:!0,ref:!0,__self:!0,__source:!0};function Ev(t,e,n){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Sv.call(e,i)&&!Mv.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var l=Array(a),u=0;u<a;u++)l[u]=arguments[u+2];r.children=l}if(t&&t.defaultProps)for(i in a=t.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:Ba,type:t,key:s,ref:o,props:r,_owner:Jf.current}}function cx(t,e){return{$$typeof:Ba,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function eh(t){return typeof t=="object"&&t!==null&&t.$$typeof===Ba}function dx(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Pp=/\/+/g;function Ac(t,e){return typeof t=="object"&&t!==null&&t.key!=null?dx(""+t.key):e.toString(36)}function Hl(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case Ba:case Jy:o=!0}}if(o)return o=t,r=r(o),t=i===""?"."+Ac(o,0):i,Lp(r)?(n="",t!=null&&(n=t.replace(Pp,"$&/")+"/"),Hl(r,e,n,"",function(u){return u})):r!=null&&(eh(r)&&(r=cx(r,n+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(Pp,"$&/")+"/")+t)),e.push(r)),1;if(o=0,i=i===""?".":i+":",Lp(t))for(var a=0;a<t.length;a++){s=t[a];var l=i+Ac(s,a);o+=Hl(s,e,n,l,r)}else if(l=ux(t),typeof l=="function")for(t=l.call(t),a=0;!(s=t.next()).done;)s=s.value,l=i+Ac(s,a++),o+=Hl(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function el(t,e,n){if(t==null)return t;var i=[],r=0;return Hl(t,i,"","",function(s){return e.call(n,s,r++)}),i}function fx(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var ln={current:null},Vl={transition:null},hx={ReactCurrentDispatcher:ln,ReactCurrentBatchConfig:Vl,ReactCurrentOwner:Jf};function wv(){throw Error("act(...) is not supported in production builds of React.")}Ye.Children={map:el,forEach:function(t,e,n){el(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return el(t,function(){e++}),e},toArray:function(t){return el(t,function(e){return e})||[]},only:function(t){if(!eh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Ye.Component=So;Ye.Fragment=ex;Ye.Profiler=nx;Ye.PureComponent=Zf;Ye.StrictMode=tx;Ye.Suspense=ox;Ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=hx;Ye.act=wv;Ye.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=_v({},t.props),r=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Jf.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(l in e)Sv.call(e,l)&&!Mv.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){a=Array(l);for(var u=0;u<l;u++)a[u]=arguments[u+2];i.children=a}return{$$typeof:Ba,type:t.type,key:r,ref:s,props:i,_owner:o}};Ye.createContext=function(t){return t={$$typeof:rx,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:ix,_context:t},t.Consumer=t};Ye.createElement=Ev;Ye.createFactory=function(t){var e=Ev.bind(null,t);return e.type=t,e};Ye.createRef=function(){return{current:null}};Ye.forwardRef=function(t){return{$$typeof:sx,render:t}};Ye.isValidElement=eh;Ye.lazy=function(t){return{$$typeof:lx,_payload:{_status:-1,_result:t},_init:fx}};Ye.memo=function(t,e){return{$$typeof:ax,type:t,compare:e===void 0?null:e}};Ye.startTransition=function(t){var e=Vl.transition;Vl.transition={};try{t()}finally{Vl.transition=e}};Ye.unstable_act=wv;Ye.useCallback=function(t,e){return ln.current.useCallback(t,e)};Ye.useContext=function(t){return ln.current.useContext(t)};Ye.useDebugValue=function(){};Ye.useDeferredValue=function(t){return ln.current.useDeferredValue(t)};Ye.useEffect=function(t,e){return ln.current.useEffect(t,e)};Ye.useId=function(){return ln.current.useId()};Ye.useImperativeHandle=function(t,e,n){return ln.current.useImperativeHandle(t,e,n)};Ye.useInsertionEffect=function(t,e){return ln.current.useInsertionEffect(t,e)};Ye.useLayoutEffect=function(t,e){return ln.current.useLayoutEffect(t,e)};Ye.useMemo=function(t,e){return ln.current.useMemo(t,e)};Ye.useReducer=function(t,e,n){return ln.current.useReducer(t,e,n)};Ye.useRef=function(t){return ln.current.useRef(t)};Ye.useState=function(t){return ln.current.useState(t)};Ye.useSyncExternalStore=function(t,e,n){return ln.current.useSyncExternalStore(t,e,n)};Ye.useTransition=function(){return ln.current.useTransition()};Ye.version="18.3.1";gv.exports=Ye;var tt=gv.exports;const px=Qy(tt);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var mx=tt,gx=Symbol.for("react.element"),vx=Symbol.for("react.fragment"),_x=Object.prototype.hasOwnProperty,yx=mx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,xx={key:!0,ref:!0,__self:!0,__source:!0};function Tv(t,e,n){var i,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)_x.call(e,i)&&!xx.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:gx,type:t,key:s,ref:o,props:r,_owner:yx.current}}Xu.Fragment=vx;Xu.jsx=Tv;Xu.jsxs=Tv;mv.exports=Xu;var $=mv.exports,Pd={},Av={exports:{}},bn={},Cv={exports:{}},Rv={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(F,z){var W=F.length;F.push(z);e:for(;0<W;){var U=W-1>>>1,G=F[U];if(0<r(G,z))F[U]=z,F[W]=G,W=U;else break e}}function n(F){return F.length===0?null:F[0]}function i(F){if(F.length===0)return null;var z=F[0],W=F.pop();if(W!==z){F[0]=W;e:for(var U=0,G=F.length,ie=G>>>1;U<ie;){var ee=2*(U+1)-1,J=F[ee],de=ee+1,ge=F[de];if(0>r(J,W))de<G&&0>r(ge,J)?(F[U]=ge,F[de]=W,U=de):(F[U]=J,F[ee]=W,U=ee);else if(de<G&&0>r(ge,W))F[U]=ge,F[de]=W,U=de;else break e}}return z}function r(F,z){var W=F.sortIndex-z.sortIndex;return W!==0?W:F.id-z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();t.unstable_now=function(){return o.now()-a}}var l=[],u=[],c=1,h=null,f=3,m=!1,_=!1,x=!1,p=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,v=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function g(F){for(var z=n(u);z!==null;){if(z.callback===null)i(u);else if(z.startTime<=F)i(u),z.sortIndex=z.expirationTime,e(l,z);else break;z=n(u)}}function S(F){if(x=!1,g(F),!_)if(n(l)!==null)_=!0,X(A);else{var z=n(u);z!==null&&k(S,z.startTime-F)}}function A(F,z){_=!1,x&&(x=!1,d(b),b=-1),m=!0;var W=f;try{for(g(z),h=n(l);h!==null&&(!(h.expirationTime>z)||F&&!N());){var U=h.callback;if(typeof U=="function"){h.callback=null,f=h.priorityLevel;var G=U(h.expirationTime<=z);z=t.unstable_now(),typeof G=="function"?h.callback=G:h===n(l)&&i(l),g(z)}else i(l);h=n(l)}if(h!==null)var ie=!0;else{var ee=n(u);ee!==null&&k(S,ee.startTime-z),ie=!1}return ie}finally{h=null,f=W,m=!1}}var E=!1,M=null,b=-1,y=5,w=-1;function N(){return!(t.unstable_now()-w<y)}function O(){if(M!==null){var F=t.unstable_now();w=F;var z=!0;try{z=M(!0,F)}finally{z?V():(E=!1,M=null)}}else E=!1}var V;if(typeof v=="function")V=function(){v(O)};else if(typeof MessageChannel<"u"){var P=new MessageChannel,D=P.port2;P.port1.onmessage=O,V=function(){D.postMessage(null)}}else V=function(){p(O,0)};function X(F){M=F,E||(E=!0,V())}function k(F,z){b=p(function(){F(t.unstable_now())},z)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(F){F.callback=null},t.unstable_continueExecution=function(){_||m||(_=!0,X(A))},t.unstable_forceFrameRate=function(F){0>F||125<F?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):y=0<F?Math.floor(1e3/F):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(F){switch(f){case 1:case 2:case 3:var z=3;break;default:z=f}var W=f;f=z;try{return F()}finally{f=W}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(F,z){switch(F){case 1:case 2:case 3:case 4:case 5:break;default:F=3}var W=f;f=F;try{return z()}finally{f=W}},t.unstable_scheduleCallback=function(F,z,W){var U=t.unstable_now();switch(typeof W=="object"&&W!==null?(W=W.delay,W=typeof W=="number"&&0<W?U+W:U):W=U,F){case 1:var G=-1;break;case 2:G=250;break;case 5:G=1073741823;break;case 4:G=1e4;break;default:G=5e3}return G=W+G,F={id:c++,callback:z,priorityLevel:F,startTime:W,expirationTime:G,sortIndex:-1},W>U?(F.sortIndex=W,e(u,F),n(l)===null&&F===n(u)&&(x?(d(b),b=-1):x=!0,k(S,W-U))):(F.sortIndex=G,e(l,F),_||m||(_=!0,X(A))),F},t.unstable_shouldYield=N,t.unstable_wrapCallback=function(F){var z=f;return function(){var W=f;f=z;try{return F.apply(this,arguments)}finally{f=W}}}})(Rv);Cv.exports=Rv;var Sx=Cv.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Mx=tt,Rn=Sx;function te(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var bv=new Set,ha={};function is(t,e){so(t,e),so(t+"Capture",e)}function so(t,e){for(ha[t]=e,t=0;t<e.length;t++)bv.add(e[t])}var Pi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ud=Object.prototype.hasOwnProperty,Ex=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Up={},Np={};function wx(t){return Ud.call(Np,t)?!0:Ud.call(Up,t)?!1:Ex.test(t)?Np[t]=!0:(Up[t]=!0,!1)}function Tx(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function Ax(t,e,n,i){if(e===null||typeof e>"u"||Tx(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function un(t,e,n,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Wt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Wt[t]=new un(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Wt[e]=new un(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Wt[t]=new un(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Wt[t]=new un(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Wt[t]=new un(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Wt[t]=new un(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Wt[t]=new un(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Wt[t]=new un(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Wt[t]=new un(t,5,!1,t.toLowerCase(),null,!1,!1)});var th=/[\-:]([a-z])/g;function nh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(th,nh);Wt[e]=new un(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(th,nh);Wt[e]=new un(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(th,nh);Wt[e]=new un(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Wt[t]=new un(t,1,!1,t.toLowerCase(),null,!1,!1)});Wt.xlinkHref=new un("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Wt[t]=new un(t,1,!1,t.toLowerCase(),null,!0,!0)});function ih(t,e,n,i){var r=Wt.hasOwnProperty(e)?Wt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(Ax(e,n,r,i)&&(n=null),i||r===null?wx(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Oi=Mx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,tl=Symbol.for("react.element"),As=Symbol.for("react.portal"),Cs=Symbol.for("react.fragment"),rh=Symbol.for("react.strict_mode"),Nd=Symbol.for("react.profiler"),Lv=Symbol.for("react.provider"),Pv=Symbol.for("react.context"),sh=Symbol.for("react.forward_ref"),Dd=Symbol.for("react.suspense"),Id=Symbol.for("react.suspense_list"),oh=Symbol.for("react.memo"),qi=Symbol.for("react.lazy"),Uv=Symbol.for("react.offscreen"),Dp=Symbol.iterator;function Ro(t){return t===null||typeof t!="object"?null:(t=Dp&&t[Dp]||t["@@iterator"],typeof t=="function"?t:null)}var vt=Object.assign,Cc;function Ho(t){if(Cc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Cc=e&&e[1]||""}return`
`+Cc+t}var Rc=!1;function bc(t,e){if(!t||Rc)return"";Rc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var i=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){i=u}t.call(e.prototype)}else{try{throw Error()}catch(u){i=u}t()}}catch(u){if(u&&i&&typeof u.stack=="string"){for(var r=u.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=o&&0<=a);break}}}finally{Rc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?Ho(t):""}function Cx(t){switch(t.tag){case 5:return Ho(t.type);case 16:return Ho("Lazy");case 13:return Ho("Suspense");case 19:return Ho("SuspenseList");case 0:case 2:case 15:return t=bc(t.type,!1),t;case 11:return t=bc(t.type.render,!1),t;case 1:return t=bc(t.type,!0),t;default:return""}}function Od(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Cs:return"Fragment";case As:return"Portal";case Nd:return"Profiler";case rh:return"StrictMode";case Dd:return"Suspense";case Id:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Pv:return(t.displayName||"Context")+".Consumer";case Lv:return(t._context.displayName||"Context")+".Provider";case sh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case oh:return e=t.displayName||null,e!==null?e:Od(t.type)||"Memo";case qi:e=t._payload,t=t._init;try{return Od(t(e))}catch{}}return null}function Rx(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Od(e);case 8:return e===rh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function mr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Nv(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function bx(t){var e=Nv(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function nl(t){t._valueTracker||(t._valueTracker=bx(t))}function Dv(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=Nv(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function au(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Fd(t,e){var n=e.checked;return vt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Ip(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=mr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Iv(t,e){e=e.checked,e!=null&&ih(t,"checked",e,!1)}function kd(t,e){Iv(t,e);var n=mr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?zd(t,e.type,n):e.hasOwnProperty("defaultValue")&&zd(t,e.type,mr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Op(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function zd(t,e,n){(e!=="number"||au(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Vo=Array.isArray;function Gs(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+mr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Bd(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(te(91));return vt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Fp(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(te(92));if(Vo(n)){if(1<n.length)throw Error(te(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:mr(n)}}function Ov(t,e){var n=mr(e.value),i=mr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function kp(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Fv(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Hd(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Fv(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var il,kv=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(il=il||document.createElement("div"),il.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=il.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function pa(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ko={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Lx=["Webkit","ms","Moz","O"];Object.keys(Ko).forEach(function(t){Lx.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ko[e]=Ko[t]})});function zv(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ko.hasOwnProperty(t)&&Ko[t]?(""+e).trim():e+"px"}function Bv(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=zv(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var Px=vt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Vd(t,e){if(e){if(Px[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(te(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(te(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(te(61))}if(e.style!=null&&typeof e.style!="object")throw Error(te(62))}}function Gd(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Wd=null;function ah(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var jd=null,Ws=null,js=null;function zp(t){if(t=Ga(t)){if(typeof jd!="function")throw Error(te(280));var e=t.stateNode;e&&(e=Zu(e),jd(t.stateNode,t.type,e))}}function Hv(t){Ws?js?js.push(t):js=[t]:Ws=t}function Vv(){if(Ws){var t=Ws,e=js;if(js=Ws=null,zp(t),e)for(t=0;t<e.length;t++)zp(e[t])}}function Gv(t,e){return t(e)}function Wv(){}var Lc=!1;function jv(t,e,n){if(Lc)return t(e,n);Lc=!0;try{return Gv(t,e,n)}finally{Lc=!1,(Ws!==null||js!==null)&&(Wv(),Vv())}}function ma(t,e){var n=t.stateNode;if(n===null)return null;var i=Zu(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(te(231,e,typeof n));return n}var Xd=!1;if(Pi)try{var bo={};Object.defineProperty(bo,"passive",{get:function(){Xd=!0}}),window.addEventListener("test",bo,bo),window.removeEventListener("test",bo,bo)}catch{Xd=!1}function Ux(t,e,n,i,r,s,o,a,l){var u=Array.prototype.slice.call(arguments,3);try{e.apply(n,u)}catch(c){this.onError(c)}}var Zo=!1,lu=null,uu=!1,Yd=null,Nx={onError:function(t){Zo=!0,lu=t}};function Dx(t,e,n,i,r,s,o,a,l){Zo=!1,lu=null,Ux.apply(Nx,arguments)}function Ix(t,e,n,i,r,s,o,a,l){if(Dx.apply(this,arguments),Zo){if(Zo){var u=lu;Zo=!1,lu=null}else throw Error(te(198));uu||(uu=!0,Yd=u)}}function rs(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Xv(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Bp(t){if(rs(t)!==t)throw Error(te(188))}function Ox(t){var e=t.alternate;if(!e){if(e=rs(t),e===null)throw Error(te(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Bp(r),t;if(s===i)return Bp(r),e;s=s.sibling}throw Error(te(188))}if(n.return!==i.return)n=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===n){o=!0,n=r,i=s;break}if(a===i){o=!0,i=r,n=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===n){o=!0,n=s,i=r;break}if(a===i){o=!0,i=s,n=r;break}a=a.sibling}if(!o)throw Error(te(189))}}if(n.alternate!==i)throw Error(te(190))}if(n.tag!==3)throw Error(te(188));return n.stateNode.current===n?t:e}function Yv(t){return t=Ox(t),t!==null?qv(t):null}function qv(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=qv(t);if(e!==null)return e;t=t.sibling}return null}var $v=Rn.unstable_scheduleCallback,Hp=Rn.unstable_cancelCallback,Fx=Rn.unstable_shouldYield,kx=Rn.unstable_requestPaint,wt=Rn.unstable_now,zx=Rn.unstable_getCurrentPriorityLevel,lh=Rn.unstable_ImmediatePriority,Kv=Rn.unstable_UserBlockingPriority,cu=Rn.unstable_NormalPriority,Bx=Rn.unstable_LowPriority,Zv=Rn.unstable_IdlePriority,Yu=null,di=null;function Hx(t){if(di&&typeof di.onCommitFiberRoot=="function")try{di.onCommitFiberRoot(Yu,t,void 0,(t.current.flags&128)===128)}catch{}}var Zn=Math.clz32?Math.clz32:Wx,Vx=Math.log,Gx=Math.LN2;function Wx(t){return t>>>=0,t===0?32:31-(Vx(t)/Gx|0)|0}var rl=64,sl=4194304;function Go(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function du(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var a=o&~r;a!==0?i=Go(a):(s&=o,s!==0&&(i=Go(s)))}else o=n&~r,o!==0?i=Go(o):s!==0&&(i=Go(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Zn(e),r=1<<n,i|=t[n],e&=~r;return i}function jx(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Xx(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-Zn(s),a=1<<o,l=r[o];l===-1?(!(a&n)||a&i)&&(r[o]=jx(a,e)):l<=e&&(t.expiredLanes|=a),s&=~a}}function qd(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Qv(){var t=rl;return rl<<=1,!(rl&4194240)&&(rl=64),t}function Pc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ha(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Zn(e),t[e]=n}function Yx(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Zn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function uh(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Zn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var it=0;function Jv(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var e_,ch,t_,n_,i_,$d=!1,ol=[],nr=null,ir=null,rr=null,ga=new Map,va=new Map,Ki=[],qx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Vp(t,e){switch(t){case"focusin":case"focusout":nr=null;break;case"dragenter":case"dragleave":ir=null;break;case"mouseover":case"mouseout":rr=null;break;case"pointerover":case"pointerout":ga.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":va.delete(e.pointerId)}}function Lo(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Ga(e),e!==null&&ch(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function $x(t,e,n,i,r){switch(e){case"focusin":return nr=Lo(nr,t,e,n,i,r),!0;case"dragenter":return ir=Lo(ir,t,e,n,i,r),!0;case"mouseover":return rr=Lo(rr,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return ga.set(s,Lo(ga.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,va.set(s,Lo(va.get(s)||null,t,e,n,i,r)),!0}return!1}function r_(t){var e=zr(t.target);if(e!==null){var n=rs(e);if(n!==null){if(e=n.tag,e===13){if(e=Xv(n),e!==null){t.blockedOn=e,i_(t.priority,function(){t_(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Gl(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Kd(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Wd=i,n.target.dispatchEvent(i),Wd=null}else return e=Ga(n),e!==null&&ch(e),t.blockedOn=n,!1;e.shift()}return!0}function Gp(t,e,n){Gl(t)&&n.delete(e)}function Kx(){$d=!1,nr!==null&&Gl(nr)&&(nr=null),ir!==null&&Gl(ir)&&(ir=null),rr!==null&&Gl(rr)&&(rr=null),ga.forEach(Gp),va.forEach(Gp)}function Po(t,e){t.blockedOn===e&&(t.blockedOn=null,$d||($d=!0,Rn.unstable_scheduleCallback(Rn.unstable_NormalPriority,Kx)))}function _a(t){function e(r){return Po(r,t)}if(0<ol.length){Po(ol[0],t);for(var n=1;n<ol.length;n++){var i=ol[n];i.blockedOn===t&&(i.blockedOn=null)}}for(nr!==null&&Po(nr,t),ir!==null&&Po(ir,t),rr!==null&&Po(rr,t),ga.forEach(e),va.forEach(e),n=0;n<Ki.length;n++)i=Ki[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Ki.length&&(n=Ki[0],n.blockedOn===null);)r_(n),n.blockedOn===null&&Ki.shift()}var Xs=Oi.ReactCurrentBatchConfig,fu=!0;function Zx(t,e,n,i){var r=it,s=Xs.transition;Xs.transition=null;try{it=1,dh(t,e,n,i)}finally{it=r,Xs.transition=s}}function Qx(t,e,n,i){var r=it,s=Xs.transition;Xs.transition=null;try{it=4,dh(t,e,n,i)}finally{it=r,Xs.transition=s}}function dh(t,e,n,i){if(fu){var r=Kd(t,e,n,i);if(r===null)Hc(t,e,i,hu,n),Vp(t,i);else if($x(r,t,e,n,i))i.stopPropagation();else if(Vp(t,i),e&4&&-1<qx.indexOf(t)){for(;r!==null;){var s=Ga(r);if(s!==null&&e_(s),s=Kd(t,e,n,i),s===null&&Hc(t,e,i,hu,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Hc(t,e,i,null,n)}}var hu=null;function Kd(t,e,n,i){if(hu=null,t=ah(i),t=zr(t),t!==null)if(e=rs(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Xv(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return hu=t,null}function s_(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(zx()){case lh:return 1;case Kv:return 4;case cu:case Bx:return 16;case Zv:return 536870912;default:return 16}default:return 16}}var Qi=null,fh=null,Wl=null;function o_(){if(Wl)return Wl;var t,e=fh,n=e.length,i,r="value"in Qi?Qi.value:Qi.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===r[s-i];i++);return Wl=r.slice(t,1<i?1-i:void 0)}function jl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function al(){return!0}function Wp(){return!1}function Ln(t){function e(n,i,r,s,o){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(n=t[a],this[a]=n?n(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?al:Wp,this.isPropagationStopped=Wp,this}return vt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=al)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=al)},persist:function(){},isPersistent:al}),e}var Mo={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},hh=Ln(Mo),Va=vt({},Mo,{view:0,detail:0}),Jx=Ln(Va),Uc,Nc,Uo,qu=vt({},Va,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:ph,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Uo&&(Uo&&t.type==="mousemove"?(Uc=t.screenX-Uo.screenX,Nc=t.screenY-Uo.screenY):Nc=Uc=0,Uo=t),Uc)},movementY:function(t){return"movementY"in t?t.movementY:Nc}}),jp=Ln(qu),eS=vt({},qu,{dataTransfer:0}),tS=Ln(eS),nS=vt({},Va,{relatedTarget:0}),Dc=Ln(nS),iS=vt({},Mo,{animationName:0,elapsedTime:0,pseudoElement:0}),rS=Ln(iS),sS=vt({},Mo,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),oS=Ln(sS),aS=vt({},Mo,{data:0}),Xp=Ln(aS),lS={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},uS={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},cS={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function dS(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=cS[t])?!!e[t]:!1}function ph(){return dS}var fS=vt({},Va,{key:function(t){if(t.key){var e=lS[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=jl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?uS[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:ph,charCode:function(t){return t.type==="keypress"?jl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?jl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),hS=Ln(fS),pS=vt({},qu,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Yp=Ln(pS),mS=vt({},Va,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:ph}),gS=Ln(mS),vS=vt({},Mo,{propertyName:0,elapsedTime:0,pseudoElement:0}),_S=Ln(vS),yS=vt({},qu,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),xS=Ln(yS),SS=[9,13,27,32],mh=Pi&&"CompositionEvent"in window,Qo=null;Pi&&"documentMode"in document&&(Qo=document.documentMode);var MS=Pi&&"TextEvent"in window&&!Qo,a_=Pi&&(!mh||Qo&&8<Qo&&11>=Qo),qp=" ",$p=!1;function l_(t,e){switch(t){case"keyup":return SS.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function u_(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Rs=!1;function ES(t,e){switch(t){case"compositionend":return u_(e);case"keypress":return e.which!==32?null:($p=!0,qp);case"textInput":return t=e.data,t===qp&&$p?null:t;default:return null}}function wS(t,e){if(Rs)return t==="compositionend"||!mh&&l_(t,e)?(t=o_(),Wl=fh=Qi=null,Rs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return a_&&e.locale!=="ko"?null:e.data;default:return null}}var TS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Kp(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!TS[t.type]:e==="textarea"}function c_(t,e,n,i){Hv(i),e=pu(e,"onChange"),0<e.length&&(n=new hh("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Jo=null,ya=null;function AS(t){S_(t,0)}function $u(t){var e=Ps(t);if(Dv(e))return t}function CS(t,e){if(t==="change")return e}var d_=!1;if(Pi){var Ic;if(Pi){var Oc="oninput"in document;if(!Oc){var Zp=document.createElement("div");Zp.setAttribute("oninput","return;"),Oc=typeof Zp.oninput=="function"}Ic=Oc}else Ic=!1;d_=Ic&&(!document.documentMode||9<document.documentMode)}function Qp(){Jo&&(Jo.detachEvent("onpropertychange",f_),ya=Jo=null)}function f_(t){if(t.propertyName==="value"&&$u(ya)){var e=[];c_(e,ya,t,ah(t)),jv(AS,e)}}function RS(t,e,n){t==="focusin"?(Qp(),Jo=e,ya=n,Jo.attachEvent("onpropertychange",f_)):t==="focusout"&&Qp()}function bS(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return $u(ya)}function LS(t,e){if(t==="click")return $u(e)}function PS(t,e){if(t==="input"||t==="change")return $u(e)}function US(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var ei=typeof Object.is=="function"?Object.is:US;function xa(t,e){if(ei(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Ud.call(e,r)||!ei(t[r],e[r]))return!1}return!0}function Jp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function em(t,e){var n=Jp(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Jp(n)}}function h_(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?h_(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function p_(){for(var t=window,e=au();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=au(t.document)}return e}function gh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function NS(t){var e=p_(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&h_(n.ownerDocument.documentElement,n)){if(i!==null&&gh(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=em(n,s);var o=em(n,i);r&&o&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var DS=Pi&&"documentMode"in document&&11>=document.documentMode,bs=null,Zd=null,ea=null,Qd=!1;function tm(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Qd||bs==null||bs!==au(i)||(i=bs,"selectionStart"in i&&gh(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ea&&xa(ea,i)||(ea=i,i=pu(Zd,"onSelect"),0<i.length&&(e=new hh("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=bs)))}function ll(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Ls={animationend:ll("Animation","AnimationEnd"),animationiteration:ll("Animation","AnimationIteration"),animationstart:ll("Animation","AnimationStart"),transitionend:ll("Transition","TransitionEnd")},Fc={},m_={};Pi&&(m_=document.createElement("div").style,"AnimationEvent"in window||(delete Ls.animationend.animation,delete Ls.animationiteration.animation,delete Ls.animationstart.animation),"TransitionEvent"in window||delete Ls.transitionend.transition);function Ku(t){if(Fc[t])return Fc[t];if(!Ls[t])return t;var e=Ls[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in m_)return Fc[t]=e[n];return t}var g_=Ku("animationend"),v_=Ku("animationiteration"),__=Ku("animationstart"),y_=Ku("transitionend"),x_=new Map,nm="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function yr(t,e){x_.set(t,e),is(e,[t])}for(var kc=0;kc<nm.length;kc++){var zc=nm[kc],IS=zc.toLowerCase(),OS=zc[0].toUpperCase()+zc.slice(1);yr(IS,"on"+OS)}yr(g_,"onAnimationEnd");yr(v_,"onAnimationIteration");yr(__,"onAnimationStart");yr("dblclick","onDoubleClick");yr("focusin","onFocus");yr("focusout","onBlur");yr(y_,"onTransitionEnd");so("onMouseEnter",["mouseout","mouseover"]);so("onMouseLeave",["mouseout","mouseover"]);so("onPointerEnter",["pointerout","pointerover"]);so("onPointerLeave",["pointerout","pointerover"]);is("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));is("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));is("onBeforeInput",["compositionend","keypress","textInput","paste"]);is("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));is("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));is("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Wo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),FS=new Set("cancel close invalid load scroll toggle".split(" ").concat(Wo));function im(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,Ix(i,e,void 0,t),t.currentTarget=null}function S_(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,u=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;im(r,a,u),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,u=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;im(r,a,u),s=l}}}if(uu)throw t=Yd,uu=!1,Yd=null,t}function ct(t,e){var n=e[rf];n===void 0&&(n=e[rf]=new Set);var i=t+"__bubble";n.has(i)||(M_(e,t,2,!1),n.add(i))}function Bc(t,e,n){var i=0;e&&(i|=4),M_(n,t,i,e)}var ul="_reactListening"+Math.random().toString(36).slice(2);function Sa(t){if(!t[ul]){t[ul]=!0,bv.forEach(function(n){n!=="selectionchange"&&(FS.has(n)||Bc(n,!1,t),Bc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[ul]||(e[ul]=!0,Bc("selectionchange",!1,e))}}function M_(t,e,n,i){switch(s_(e)){case 1:var r=Zx;break;case 4:r=Qx;break;default:r=dh}n=r.bind(null,e,n,t),r=void 0,!Xd||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Hc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=zr(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}jv(function(){var u=s,c=ah(n),h=[];e:{var f=x_.get(t);if(f!==void 0){var m=hh,_=t;switch(t){case"keypress":if(jl(n)===0)break e;case"keydown":case"keyup":m=hS;break;case"focusin":_="focus",m=Dc;break;case"focusout":_="blur",m=Dc;break;case"beforeblur":case"afterblur":m=Dc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=jp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=tS;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=gS;break;case g_:case v_:case __:m=rS;break;case y_:m=_S;break;case"scroll":m=Jx;break;case"wheel":m=xS;break;case"copy":case"cut":case"paste":m=oS;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=Yp}var x=(e&4)!==0,p=!x&&t==="scroll",d=x?f!==null?f+"Capture":null:f;x=[];for(var v=u,g;v!==null;){g=v;var S=g.stateNode;if(g.tag===5&&S!==null&&(g=S,d!==null&&(S=ma(v,d),S!=null&&x.push(Ma(v,S,g)))),p)break;v=v.return}0<x.length&&(f=new m(f,_,null,n,c),h.push({event:f,listeners:x}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",m=t==="mouseout"||t==="pointerout",f&&n!==Wd&&(_=n.relatedTarget||n.fromElement)&&(zr(_)||_[Ui]))break e;if((m||f)&&(f=c.window===c?c:(f=c.ownerDocument)?f.defaultView||f.parentWindow:window,m?(_=n.relatedTarget||n.toElement,m=u,_=_?zr(_):null,_!==null&&(p=rs(_),_!==p||_.tag!==5&&_.tag!==6)&&(_=null)):(m=null,_=u),m!==_)){if(x=jp,S="onMouseLeave",d="onMouseEnter",v="mouse",(t==="pointerout"||t==="pointerover")&&(x=Yp,S="onPointerLeave",d="onPointerEnter",v="pointer"),p=m==null?f:Ps(m),g=_==null?f:Ps(_),f=new x(S,v+"leave",m,n,c),f.target=p,f.relatedTarget=g,S=null,zr(c)===u&&(x=new x(d,v+"enter",_,n,c),x.target=g,x.relatedTarget=p,S=x),p=S,m&&_)t:{for(x=m,d=_,v=0,g=x;g;g=ss(g))v++;for(g=0,S=d;S;S=ss(S))g++;for(;0<v-g;)x=ss(x),v--;for(;0<g-v;)d=ss(d),g--;for(;v--;){if(x===d||d!==null&&x===d.alternate)break t;x=ss(x),d=ss(d)}x=null}else x=null;m!==null&&rm(h,f,m,x,!1),_!==null&&p!==null&&rm(h,p,_,x,!0)}}e:{if(f=u?Ps(u):window,m=f.nodeName&&f.nodeName.toLowerCase(),m==="select"||m==="input"&&f.type==="file")var A=CS;else if(Kp(f))if(d_)A=PS;else{A=bS;var E=RS}else(m=f.nodeName)&&m.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(A=LS);if(A&&(A=A(t,u))){c_(h,A,n,c);break e}E&&E(t,f,u),t==="focusout"&&(E=f._wrapperState)&&E.controlled&&f.type==="number"&&zd(f,"number",f.value)}switch(E=u?Ps(u):window,t){case"focusin":(Kp(E)||E.contentEditable==="true")&&(bs=E,Zd=u,ea=null);break;case"focusout":ea=Zd=bs=null;break;case"mousedown":Qd=!0;break;case"contextmenu":case"mouseup":case"dragend":Qd=!1,tm(h,n,c);break;case"selectionchange":if(DS)break;case"keydown":case"keyup":tm(h,n,c)}var M;if(mh)e:{switch(t){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else Rs?l_(t,n)&&(b="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(b="onCompositionStart");b&&(a_&&n.locale!=="ko"&&(Rs||b!=="onCompositionStart"?b==="onCompositionEnd"&&Rs&&(M=o_()):(Qi=c,fh="value"in Qi?Qi.value:Qi.textContent,Rs=!0)),E=pu(u,b),0<E.length&&(b=new Xp(b,t,null,n,c),h.push({event:b,listeners:E}),M?b.data=M:(M=u_(n),M!==null&&(b.data=M)))),(M=MS?ES(t,n):wS(t,n))&&(u=pu(u,"onBeforeInput"),0<u.length&&(c=new Xp("onBeforeInput","beforeinput",null,n,c),h.push({event:c,listeners:u}),c.data=M))}S_(h,e)})}function Ma(t,e,n){return{instance:t,listener:e,currentTarget:n}}function pu(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=ma(t,n),s!=null&&i.unshift(Ma(t,s,r)),s=ma(t,e),s!=null&&i.push(Ma(t,s,r))),t=t.return}return i}function ss(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function rm(t,e,n,i,r){for(var s=e._reactName,o=[];n!==null&&n!==i;){var a=n,l=a.alternate,u=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&u!==null&&(a=u,r?(l=ma(n,s),l!=null&&o.unshift(Ma(n,l,a))):r||(l=ma(n,s),l!=null&&o.push(Ma(n,l,a)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var kS=/\r\n?/g,zS=/\u0000|\uFFFD/g;function sm(t){return(typeof t=="string"?t:""+t).replace(kS,`
`).replace(zS,"")}function cl(t,e,n){if(e=sm(e),sm(t)!==e&&n)throw Error(te(425))}function mu(){}var Jd=null,ef=null;function tf(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var nf=typeof setTimeout=="function"?setTimeout:void 0,BS=typeof clearTimeout=="function"?clearTimeout:void 0,om=typeof Promise=="function"?Promise:void 0,HS=typeof queueMicrotask=="function"?queueMicrotask:typeof om<"u"?function(t){return om.resolve(null).then(t).catch(VS)}:nf;function VS(t){setTimeout(function(){throw t})}function Vc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),_a(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);_a(e)}function sr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function am(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Eo=Math.random().toString(36).slice(2),ui="__reactFiber$"+Eo,Ea="__reactProps$"+Eo,Ui="__reactContainer$"+Eo,rf="__reactEvents$"+Eo,GS="__reactListeners$"+Eo,WS="__reactHandles$"+Eo;function zr(t){var e=t[ui];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Ui]||n[ui]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=am(t);t!==null;){if(n=t[ui])return n;t=am(t)}return e}t=n,n=t.parentNode}return null}function Ga(t){return t=t[ui]||t[Ui],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Ps(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(te(33))}function Zu(t){return t[Ea]||null}var sf=[],Us=-1;function xr(t){return{current:t}}function ht(t){0>Us||(t.current=sf[Us],sf[Us]=null,Us--)}function ut(t,e){Us++,sf[Us]=t.current,t.current=e}var gr={},Jt=xr(gr),mn=xr(!1),Kr=gr;function oo(t,e){var n=t.type.contextTypes;if(!n)return gr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function gn(t){return t=t.childContextTypes,t!=null}function gu(){ht(mn),ht(Jt)}function lm(t,e,n){if(Jt.current!==gr)throw Error(te(168));ut(Jt,e),ut(mn,n)}function E_(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(te(108,Rx(t)||"Unknown",r));return vt({},n,i)}function vu(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||gr,Kr=Jt.current,ut(Jt,t),ut(mn,mn.current),!0}function um(t,e,n){var i=t.stateNode;if(!i)throw Error(te(169));n?(t=E_(t,e,Kr),i.__reactInternalMemoizedMergedChildContext=t,ht(mn),ht(Jt),ut(Jt,t)):ht(mn),ut(mn,n)}var Mi=null,Qu=!1,Gc=!1;function w_(t){Mi===null?Mi=[t]:Mi.push(t)}function jS(t){Qu=!0,w_(t)}function Sr(){if(!Gc&&Mi!==null){Gc=!0;var t=0,e=it;try{var n=Mi;for(it=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}Mi=null,Qu=!1}catch(r){throw Mi!==null&&(Mi=Mi.slice(t+1)),$v(lh,Sr),r}finally{it=e,Gc=!1}}return null}var Ns=[],Ds=0,_u=null,yu=0,Nn=[],Dn=0,Zr=null,Ti=1,Ai="";function Rr(t,e){Ns[Ds++]=yu,Ns[Ds++]=_u,_u=t,yu=e}function T_(t,e,n){Nn[Dn++]=Ti,Nn[Dn++]=Ai,Nn[Dn++]=Zr,Zr=t;var i=Ti;t=Ai;var r=32-Zn(i)-1;i&=~(1<<r),n+=1;var s=32-Zn(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,Ti=1<<32-Zn(e)+r|n<<r|i,Ai=s+t}else Ti=1<<s|n<<r|i,Ai=t}function vh(t){t.return!==null&&(Rr(t,1),T_(t,1,0))}function _h(t){for(;t===_u;)_u=Ns[--Ds],Ns[Ds]=null,yu=Ns[--Ds],Ns[Ds]=null;for(;t===Zr;)Zr=Nn[--Dn],Nn[Dn]=null,Ai=Nn[--Dn],Nn[Dn]=null,Ti=Nn[--Dn],Nn[Dn]=null}var An=null,Tn=null,pt=!1,qn=null;function A_(t,e){var n=Fn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function cm(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,An=t,Tn=sr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,An=t,Tn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Zr!==null?{id:Ti,overflow:Ai}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Fn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,An=t,Tn=null,!0):!1;default:return!1}}function of(t){return(t.mode&1)!==0&&(t.flags&128)===0}function af(t){if(pt){var e=Tn;if(e){var n=e;if(!cm(t,e)){if(of(t))throw Error(te(418));e=sr(n.nextSibling);var i=An;e&&cm(t,e)?A_(i,n):(t.flags=t.flags&-4097|2,pt=!1,An=t)}}else{if(of(t))throw Error(te(418));t.flags=t.flags&-4097|2,pt=!1,An=t}}}function dm(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;An=t}function dl(t){if(t!==An)return!1;if(!pt)return dm(t),pt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!tf(t.type,t.memoizedProps)),e&&(e=Tn)){if(of(t))throw C_(),Error(te(418));for(;e;)A_(t,e),e=sr(e.nextSibling)}if(dm(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(te(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Tn=sr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Tn=null}}else Tn=An?sr(t.stateNode.nextSibling):null;return!0}function C_(){for(var t=Tn;t;)t=sr(t.nextSibling)}function ao(){Tn=An=null,pt=!1}function yh(t){qn===null?qn=[t]:qn.push(t)}var XS=Oi.ReactCurrentBatchConfig;function No(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(te(309));var i=n.stateNode}if(!i)throw Error(te(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(te(284));if(!n._owner)throw Error(te(290,t))}return t}function fl(t,e){throw t=Object.prototype.toString.call(e),Error(te(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function fm(t){var e=t._init;return e(t._payload)}function R_(t){function e(d,v){if(t){var g=d.deletions;g===null?(d.deletions=[v],d.flags|=16):g.push(v)}}function n(d,v){if(!t)return null;for(;v!==null;)e(d,v),v=v.sibling;return null}function i(d,v){for(d=new Map;v!==null;)v.key!==null?d.set(v.key,v):d.set(v.index,v),v=v.sibling;return d}function r(d,v){return d=ur(d,v),d.index=0,d.sibling=null,d}function s(d,v,g){return d.index=g,t?(g=d.alternate,g!==null?(g=g.index,g<v?(d.flags|=2,v):g):(d.flags|=2,v)):(d.flags|=1048576,v)}function o(d){return t&&d.alternate===null&&(d.flags|=2),d}function a(d,v,g,S){return v===null||v.tag!==6?(v=Kc(g,d.mode,S),v.return=d,v):(v=r(v,g),v.return=d,v)}function l(d,v,g,S){var A=g.type;return A===Cs?c(d,v,g.props.children,S,g.key):v!==null&&(v.elementType===A||typeof A=="object"&&A!==null&&A.$$typeof===qi&&fm(A)===v.type)?(S=r(v,g.props),S.ref=No(d,v,g),S.return=d,S):(S=Ql(g.type,g.key,g.props,null,d.mode,S),S.ref=No(d,v,g),S.return=d,S)}function u(d,v,g,S){return v===null||v.tag!==4||v.stateNode.containerInfo!==g.containerInfo||v.stateNode.implementation!==g.implementation?(v=Zc(g,d.mode,S),v.return=d,v):(v=r(v,g.children||[]),v.return=d,v)}function c(d,v,g,S,A){return v===null||v.tag!==7?(v=Gr(g,d.mode,S,A),v.return=d,v):(v=r(v,g),v.return=d,v)}function h(d,v,g){if(typeof v=="string"&&v!==""||typeof v=="number")return v=Kc(""+v,d.mode,g),v.return=d,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case tl:return g=Ql(v.type,v.key,v.props,null,d.mode,g),g.ref=No(d,null,v),g.return=d,g;case As:return v=Zc(v,d.mode,g),v.return=d,v;case qi:var S=v._init;return h(d,S(v._payload),g)}if(Vo(v)||Ro(v))return v=Gr(v,d.mode,g,null),v.return=d,v;fl(d,v)}return null}function f(d,v,g,S){var A=v!==null?v.key:null;if(typeof g=="string"&&g!==""||typeof g=="number")return A!==null?null:a(d,v,""+g,S);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case tl:return g.key===A?l(d,v,g,S):null;case As:return g.key===A?u(d,v,g,S):null;case qi:return A=g._init,f(d,v,A(g._payload),S)}if(Vo(g)||Ro(g))return A!==null?null:c(d,v,g,S,null);fl(d,g)}return null}function m(d,v,g,S,A){if(typeof S=="string"&&S!==""||typeof S=="number")return d=d.get(g)||null,a(v,d,""+S,A);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case tl:return d=d.get(S.key===null?g:S.key)||null,l(v,d,S,A);case As:return d=d.get(S.key===null?g:S.key)||null,u(v,d,S,A);case qi:var E=S._init;return m(d,v,g,E(S._payload),A)}if(Vo(S)||Ro(S))return d=d.get(g)||null,c(v,d,S,A,null);fl(v,S)}return null}function _(d,v,g,S){for(var A=null,E=null,M=v,b=v=0,y=null;M!==null&&b<g.length;b++){M.index>b?(y=M,M=null):y=M.sibling;var w=f(d,M,g[b],S);if(w===null){M===null&&(M=y);break}t&&M&&w.alternate===null&&e(d,M),v=s(w,v,b),E===null?A=w:E.sibling=w,E=w,M=y}if(b===g.length)return n(d,M),pt&&Rr(d,b),A;if(M===null){for(;b<g.length;b++)M=h(d,g[b],S),M!==null&&(v=s(M,v,b),E===null?A=M:E.sibling=M,E=M);return pt&&Rr(d,b),A}for(M=i(d,M);b<g.length;b++)y=m(M,d,b,g[b],S),y!==null&&(t&&y.alternate!==null&&M.delete(y.key===null?b:y.key),v=s(y,v,b),E===null?A=y:E.sibling=y,E=y);return t&&M.forEach(function(N){return e(d,N)}),pt&&Rr(d,b),A}function x(d,v,g,S){var A=Ro(g);if(typeof A!="function")throw Error(te(150));if(g=A.call(g),g==null)throw Error(te(151));for(var E=A=null,M=v,b=v=0,y=null,w=g.next();M!==null&&!w.done;b++,w=g.next()){M.index>b?(y=M,M=null):y=M.sibling;var N=f(d,M,w.value,S);if(N===null){M===null&&(M=y);break}t&&M&&N.alternate===null&&e(d,M),v=s(N,v,b),E===null?A=N:E.sibling=N,E=N,M=y}if(w.done)return n(d,M),pt&&Rr(d,b),A;if(M===null){for(;!w.done;b++,w=g.next())w=h(d,w.value,S),w!==null&&(v=s(w,v,b),E===null?A=w:E.sibling=w,E=w);return pt&&Rr(d,b),A}for(M=i(d,M);!w.done;b++,w=g.next())w=m(M,d,b,w.value,S),w!==null&&(t&&w.alternate!==null&&M.delete(w.key===null?b:w.key),v=s(w,v,b),E===null?A=w:E.sibling=w,E=w);return t&&M.forEach(function(O){return e(d,O)}),pt&&Rr(d,b),A}function p(d,v,g,S){if(typeof g=="object"&&g!==null&&g.type===Cs&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case tl:e:{for(var A=g.key,E=v;E!==null;){if(E.key===A){if(A=g.type,A===Cs){if(E.tag===7){n(d,E.sibling),v=r(E,g.props.children),v.return=d,d=v;break e}}else if(E.elementType===A||typeof A=="object"&&A!==null&&A.$$typeof===qi&&fm(A)===E.type){n(d,E.sibling),v=r(E,g.props),v.ref=No(d,E,g),v.return=d,d=v;break e}n(d,E);break}else e(d,E);E=E.sibling}g.type===Cs?(v=Gr(g.props.children,d.mode,S,g.key),v.return=d,d=v):(S=Ql(g.type,g.key,g.props,null,d.mode,S),S.ref=No(d,v,g),S.return=d,d=S)}return o(d);case As:e:{for(E=g.key;v!==null;){if(v.key===E)if(v.tag===4&&v.stateNode.containerInfo===g.containerInfo&&v.stateNode.implementation===g.implementation){n(d,v.sibling),v=r(v,g.children||[]),v.return=d,d=v;break e}else{n(d,v);break}else e(d,v);v=v.sibling}v=Zc(g,d.mode,S),v.return=d,d=v}return o(d);case qi:return E=g._init,p(d,v,E(g._payload),S)}if(Vo(g))return _(d,v,g,S);if(Ro(g))return x(d,v,g,S);fl(d,g)}return typeof g=="string"&&g!==""||typeof g=="number"?(g=""+g,v!==null&&v.tag===6?(n(d,v.sibling),v=r(v,g),v.return=d,d=v):(n(d,v),v=Kc(g,d.mode,S),v.return=d,d=v),o(d)):n(d,v)}return p}var lo=R_(!0),b_=R_(!1),xu=xr(null),Su=null,Is=null,xh=null;function Sh(){xh=Is=Su=null}function Mh(t){var e=xu.current;ht(xu),t._currentValue=e}function lf(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Ys(t,e){Su=t,xh=Is=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(hn=!0),t.firstContext=null)}function Bn(t){var e=t._currentValue;if(xh!==t)if(t={context:t,memoizedValue:e,next:null},Is===null){if(Su===null)throw Error(te(308));Is=t,Su.dependencies={lanes:0,firstContext:t}}else Is=Is.next=t;return e}var Br=null;function Eh(t){Br===null?Br=[t]:Br.push(t)}function L_(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,Eh(e)):(n.next=r.next,r.next=n),e.interleaved=n,Ni(t,i)}function Ni(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var $i=!1;function wh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function P_(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Ri(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function or(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Ke&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ni(t,n)}return r=i.interleaved,r===null?(e.next=e,Eh(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ni(t,n)}function Xl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,uh(t,n)}}function hm(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Mu(t,e,n,i){var r=t.updateQueue;$i=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,u=l.next;l.next=null,o===null?s=u:o.next=u,o=l;var c=t.alternate;c!==null&&(c=c.updateQueue,a=c.lastBaseUpdate,a!==o&&(a===null?c.firstBaseUpdate=u:a.next=u,c.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;o=0,c=u=l=null,a=s;do{var f=a.lane,m=a.eventTime;if((i&f)===f){c!==null&&(c=c.next={eventTime:m,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var _=t,x=a;switch(f=e,m=n,x.tag){case 1:if(_=x.payload,typeof _=="function"){h=_.call(m,h,f);break e}h=_;break e;case 3:_.flags=_.flags&-65537|128;case 0:if(_=x.payload,f=typeof _=="function"?_.call(m,h,f):_,f==null)break e;h=vt({},h,f);break e;case 2:$i=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,f=r.effects,f===null?r.effects=[a]:f.push(a))}else m={eventTime:m,lane:f,tag:a.tag,payload:a.payload,callback:a.callback,next:null},c===null?(u=c=m,l=h):c=c.next=m,o|=f;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;f=a,a=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(c===null&&(l=h),r.baseState=l,r.firstBaseUpdate=u,r.lastBaseUpdate=c,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Jr|=o,t.lanes=o,t.memoizedState=h}}function pm(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(te(191,r));r.call(i)}}}var Wa={},fi=xr(Wa),wa=xr(Wa),Ta=xr(Wa);function Hr(t){if(t===Wa)throw Error(te(174));return t}function Th(t,e){switch(ut(Ta,e),ut(wa,t),ut(fi,Wa),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Hd(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Hd(e,t)}ht(fi),ut(fi,e)}function uo(){ht(fi),ht(wa),ht(Ta)}function U_(t){Hr(Ta.current);var e=Hr(fi.current),n=Hd(e,t.type);e!==n&&(ut(wa,t),ut(fi,n))}function Ah(t){wa.current===t&&(ht(fi),ht(wa))}var mt=xr(0);function Eu(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Wc=[];function Ch(){for(var t=0;t<Wc.length;t++)Wc[t]._workInProgressVersionPrimary=null;Wc.length=0}var Yl=Oi.ReactCurrentDispatcher,jc=Oi.ReactCurrentBatchConfig,Qr=0,gt=null,bt=null,Ft=null,wu=!1,ta=!1,Aa=0,YS=0;function Yt(){throw Error(te(321))}function Rh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!ei(t[n],e[n]))return!1;return!0}function bh(t,e,n,i,r,s){if(Qr=s,gt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Yl.current=t===null||t.memoizedState===null?ZS:QS,t=n(i,r),ta){s=0;do{if(ta=!1,Aa=0,25<=s)throw Error(te(301));s+=1,Ft=bt=null,e.updateQueue=null,Yl.current=JS,t=n(i,r)}while(ta)}if(Yl.current=Tu,e=bt!==null&&bt.next!==null,Qr=0,Ft=bt=gt=null,wu=!1,e)throw Error(te(300));return t}function Lh(){var t=Aa!==0;return Aa=0,t}function oi(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ft===null?gt.memoizedState=Ft=t:Ft=Ft.next=t,Ft}function Hn(){if(bt===null){var t=gt.alternate;t=t!==null?t.memoizedState:null}else t=bt.next;var e=Ft===null?gt.memoizedState:Ft.next;if(e!==null)Ft=e,bt=t;else{if(t===null)throw Error(te(310));bt=t,t={memoizedState:bt.memoizedState,baseState:bt.baseState,baseQueue:bt.baseQueue,queue:bt.queue,next:null},Ft===null?gt.memoizedState=Ft=t:Ft=Ft.next=t}return Ft}function Ca(t,e){return typeof e=="function"?e(t):e}function Xc(t){var e=Hn(),n=e.queue;if(n===null)throw Error(te(311));n.lastRenderedReducer=t;var i=bt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,u=s;do{var c=u.lane;if((Qr&c)===c)l!==null&&(l=l.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:t(i,u.action);else{var h={lane:c,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};l===null?(a=l=h,o=i):l=l.next=h,gt.lanes|=c,Jr|=c}u=u.next}while(u!==null&&u!==s);l===null?o=i:l.next=a,ei(i,e.memoizedState)||(hn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,gt.lanes|=s,Jr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Yc(t){var e=Hn(),n=e.queue;if(n===null)throw Error(te(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var o=r=r.next;do s=t(s,o.action),o=o.next;while(o!==r);ei(s,e.memoizedState)||(hn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function N_(){}function D_(t,e){var n=gt,i=Hn(),r=e(),s=!ei(i.memoizedState,r);if(s&&(i.memoizedState=r,hn=!0),i=i.queue,Ph(F_.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Ft!==null&&Ft.memoizedState.tag&1){if(n.flags|=2048,Ra(9,O_.bind(null,n,i,r,e),void 0,null),zt===null)throw Error(te(349));Qr&30||I_(n,e,r)}return r}function I_(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=gt.updateQueue,e===null?(e={lastEffect:null,stores:null},gt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function O_(t,e,n,i){e.value=n,e.getSnapshot=i,k_(e)&&z_(t)}function F_(t,e,n){return n(function(){k_(e)&&z_(t)})}function k_(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!ei(t,n)}catch{return!0}}function z_(t){var e=Ni(t,1);e!==null&&Qn(e,t,1,-1)}function mm(t){var e=oi();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ca,lastRenderedState:t},e.queue=t,t=t.dispatch=KS.bind(null,gt,t),[e.memoizedState,t]}function Ra(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=gt.updateQueue,e===null?(e={lastEffect:null,stores:null},gt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function B_(){return Hn().memoizedState}function ql(t,e,n,i){var r=oi();gt.flags|=t,r.memoizedState=Ra(1|e,n,void 0,i===void 0?null:i)}function Ju(t,e,n,i){var r=Hn();i=i===void 0?null:i;var s=void 0;if(bt!==null){var o=bt.memoizedState;if(s=o.destroy,i!==null&&Rh(i,o.deps)){r.memoizedState=Ra(e,n,s,i);return}}gt.flags|=t,r.memoizedState=Ra(1|e,n,s,i)}function gm(t,e){return ql(8390656,8,t,e)}function Ph(t,e){return Ju(2048,8,t,e)}function H_(t,e){return Ju(4,2,t,e)}function V_(t,e){return Ju(4,4,t,e)}function G_(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function W_(t,e,n){return n=n!=null?n.concat([t]):null,Ju(4,4,G_.bind(null,e,t),n)}function Uh(){}function j_(t,e){var n=Hn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Rh(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function X_(t,e){var n=Hn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Rh(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function Y_(t,e,n){return Qr&21?(ei(n,e)||(n=Qv(),gt.lanes|=n,Jr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,hn=!0),t.memoizedState=n)}function qS(t,e){var n=it;it=n!==0&&4>n?n:4,t(!0);var i=jc.transition;jc.transition={};try{t(!1),e()}finally{it=n,jc.transition=i}}function q_(){return Hn().memoizedState}function $S(t,e,n){var i=lr(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},$_(t))K_(e,n);else if(n=L_(t,e,n,i),n!==null){var r=an();Qn(n,t,i,r),Z_(n,e,i)}}function KS(t,e,n){var i=lr(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if($_(t))K_(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,n);if(r.hasEagerState=!0,r.eagerState=a,ei(a,o)){var l=e.interleaved;l===null?(r.next=r,Eh(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=L_(t,e,r,i),n!==null&&(r=an(),Qn(n,t,i,r),Z_(n,e,i))}}function $_(t){var e=t.alternate;return t===gt||e!==null&&e===gt}function K_(t,e){ta=wu=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Z_(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,uh(t,n)}}var Tu={readContext:Bn,useCallback:Yt,useContext:Yt,useEffect:Yt,useImperativeHandle:Yt,useInsertionEffect:Yt,useLayoutEffect:Yt,useMemo:Yt,useReducer:Yt,useRef:Yt,useState:Yt,useDebugValue:Yt,useDeferredValue:Yt,useTransition:Yt,useMutableSource:Yt,useSyncExternalStore:Yt,useId:Yt,unstable_isNewReconciler:!1},ZS={readContext:Bn,useCallback:function(t,e){return oi().memoizedState=[t,e===void 0?null:e],t},useContext:Bn,useEffect:gm,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,ql(4194308,4,G_.bind(null,e,t),n)},useLayoutEffect:function(t,e){return ql(4194308,4,t,e)},useInsertionEffect:function(t,e){return ql(4,2,t,e)},useMemo:function(t,e){var n=oi();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=oi();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=$S.bind(null,gt,t),[i.memoizedState,t]},useRef:function(t){var e=oi();return t={current:t},e.memoizedState=t},useState:mm,useDebugValue:Uh,useDeferredValue:function(t){return oi().memoizedState=t},useTransition:function(){var t=mm(!1),e=t[0];return t=qS.bind(null,t[1]),oi().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=gt,r=oi();if(pt){if(n===void 0)throw Error(te(407));n=n()}else{if(n=e(),zt===null)throw Error(te(349));Qr&30||I_(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,gm(F_.bind(null,i,s,t),[t]),i.flags|=2048,Ra(9,O_.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=oi(),e=zt.identifierPrefix;if(pt){var n=Ai,i=Ti;n=(i&~(1<<32-Zn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Aa++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=YS++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},QS={readContext:Bn,useCallback:j_,useContext:Bn,useEffect:Ph,useImperativeHandle:W_,useInsertionEffect:H_,useLayoutEffect:V_,useMemo:X_,useReducer:Xc,useRef:B_,useState:function(){return Xc(Ca)},useDebugValue:Uh,useDeferredValue:function(t){var e=Hn();return Y_(e,bt.memoizedState,t)},useTransition:function(){var t=Xc(Ca)[0],e=Hn().memoizedState;return[t,e]},useMutableSource:N_,useSyncExternalStore:D_,useId:q_,unstable_isNewReconciler:!1},JS={readContext:Bn,useCallback:j_,useContext:Bn,useEffect:Ph,useImperativeHandle:W_,useInsertionEffect:H_,useLayoutEffect:V_,useMemo:X_,useReducer:Yc,useRef:B_,useState:function(){return Yc(Ca)},useDebugValue:Uh,useDeferredValue:function(t){var e=Hn();return bt===null?e.memoizedState=t:Y_(e,bt.memoizedState,t)},useTransition:function(){var t=Yc(Ca)[0],e=Hn().memoizedState;return[t,e]},useMutableSource:N_,useSyncExternalStore:D_,useId:q_,unstable_isNewReconciler:!1};function Xn(t,e){if(t&&t.defaultProps){e=vt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function uf(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:vt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var ec={isMounted:function(t){return(t=t._reactInternals)?rs(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=an(),r=lr(t),s=Ri(i,r);s.payload=e,n!=null&&(s.callback=n),e=or(t,s,r),e!==null&&(Qn(e,t,r,i),Xl(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=an(),r=lr(t),s=Ri(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=or(t,s,r),e!==null&&(Qn(e,t,r,i),Xl(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=an(),i=lr(t),r=Ri(n,i);r.tag=2,e!=null&&(r.callback=e),e=or(t,r,i),e!==null&&(Qn(e,t,i,n),Xl(e,t,i))}};function vm(t,e,n,i,r,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!xa(n,i)||!xa(r,s):!0}function Q_(t,e,n){var i=!1,r=gr,s=e.contextType;return typeof s=="object"&&s!==null?s=Bn(s):(r=gn(e)?Kr:Jt.current,i=e.contextTypes,s=(i=i!=null)?oo(t,r):gr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=ec,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function _m(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&ec.enqueueReplaceState(e,e.state,null)}function cf(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},wh(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Bn(s):(s=gn(e)?Kr:Jt.current,r.context=oo(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(uf(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&ec.enqueueReplaceState(r,r.state,null),Mu(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function co(t,e){try{var n="",i=e;do n+=Cx(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function qc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function df(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var eM=typeof WeakMap=="function"?WeakMap:Map;function J_(t,e,n){n=Ri(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Cu||(Cu=!0,Sf=i),df(t,e)},n}function e0(t,e,n){n=Ri(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){df(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){df(t,e),typeof i!="function"&&(ar===null?ar=new Set([this]):ar.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function ym(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new eM;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=pM.bind(null,t,e,n),e.then(t,t))}function xm(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Sm(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Ri(-1,1),e.tag=2,or(n,e,1))),n.lanes|=1),t)}var tM=Oi.ReactCurrentOwner,hn=!1;function rn(t,e,n,i){e.child=t===null?b_(e,null,n,i):lo(e,t.child,n,i)}function Mm(t,e,n,i,r){n=n.render;var s=e.ref;return Ys(e,r),i=bh(t,e,n,i,s,r),n=Lh(),t!==null&&!hn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Di(t,e,r)):(pt&&n&&vh(e),e.flags|=1,rn(t,e,i,r),e.child)}function Em(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Bh(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,t0(t,e,s,i,r)):(t=Ql(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:xa,n(o,i)&&t.ref===e.ref)return Di(t,e,r)}return e.flags|=1,t=ur(s,i),t.ref=e.ref,t.return=e,e.child=t}function t0(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(xa(s,i)&&t.ref===e.ref)if(hn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(hn=!0);else return e.lanes=t.lanes,Di(t,e,r)}return ff(t,e,n,i,r)}function n0(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ut(Fs,En),En|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ut(Fs,En),En|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,ut(Fs,En),En|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,ut(Fs,En),En|=i;return rn(t,e,r,n),e.child}function i0(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function ff(t,e,n,i,r){var s=gn(n)?Kr:Jt.current;return s=oo(e,s),Ys(e,r),n=bh(t,e,n,i,s,r),i=Lh(),t!==null&&!hn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Di(t,e,r)):(pt&&i&&vh(e),e.flags|=1,rn(t,e,n,r),e.child)}function wm(t,e,n,i,r){if(gn(n)){var s=!0;vu(e)}else s=!1;if(Ys(e,r),e.stateNode===null)$l(t,e),Q_(e,n,i),cf(e,n,i,r),i=!0;else if(t===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,u=n.contextType;typeof u=="object"&&u!==null?u=Bn(u):(u=gn(n)?Kr:Jt.current,u=oo(e,u));var c=n.getDerivedStateFromProps,h=typeof c=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==u)&&_m(e,o,i,u),$i=!1;var f=e.memoizedState;o.state=f,Mu(e,i,o,r),l=e.memoizedState,a!==i||f!==l||mn.current||$i?(typeof c=="function"&&(uf(e,n,c,i),l=e.memoizedState),(a=$i||vm(e,n,a,i,f,l,u))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=u,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,P_(t,e),a=e.memoizedProps,u=e.type===e.elementType?a:Xn(e.type,a),o.props=u,h=e.pendingProps,f=o.context,l=n.contextType,typeof l=="object"&&l!==null?l=Bn(l):(l=gn(n)?Kr:Jt.current,l=oo(e,l));var m=n.getDerivedStateFromProps;(c=typeof m=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==h||f!==l)&&_m(e,o,i,l),$i=!1,f=e.memoizedState,o.state=f,Mu(e,i,o,r);var _=e.memoizedState;a!==h||f!==_||mn.current||$i?(typeof m=="function"&&(uf(e,n,m,i),_=e.memoizedState),(u=$i||vm(e,n,u,i,f,_,l)||!1)?(c||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,_,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,_,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=_),o.props=i,o.state=_,o.context=l,i=u):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),i=!1)}return hf(t,e,n,i,s,r)}function hf(t,e,n,i,r,s){i0(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&um(e,n,!1),Di(t,e,s);i=e.stateNode,tM.current=e;var a=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=lo(e,t.child,null,s),e.child=lo(e,null,a,s)):rn(t,e,a,s),e.memoizedState=i.state,r&&um(e,n,!0),e.child}function r0(t){var e=t.stateNode;e.pendingContext?lm(t,e.pendingContext,e.pendingContext!==e.context):e.context&&lm(t,e.context,!1),Th(t,e.containerInfo)}function Tm(t,e,n,i,r){return ao(),yh(r),e.flags|=256,rn(t,e,n,i),e.child}var pf={dehydrated:null,treeContext:null,retryLane:0};function mf(t){return{baseLanes:t,cachePool:null,transitions:null}}function s0(t,e,n){var i=e.pendingProps,r=mt.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=t!==null&&t.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),ut(mt,r&1),t===null)return af(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=ic(o,i,0,null),t=Gr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=mf(n),e.memoizedState=pf,t):Nh(e,o));if(r=t.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return nM(t,e,o,i,a,r,n);if(s){s=i.fallback,o=e.mode,r=t.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=ur(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=ur(a,s):(s=Gr(s,o,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=t.child.memoizedState,o=o===null?mf(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=pf,i}return s=t.child,t=s.sibling,i=ur(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Nh(t,e){return e=ic({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function hl(t,e,n,i){return i!==null&&yh(i),lo(e,t.child,null,n),t=Nh(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function nM(t,e,n,i,r,s,o){if(n)return e.flags&256?(e.flags&=-257,i=qc(Error(te(422))),hl(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=ic({mode:"visible",children:i.children},r,0,null),s=Gr(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&lo(e,t.child,null,o),e.child.memoizedState=mf(o),e.memoizedState=pf,s);if(!(e.mode&1))return hl(t,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(te(419)),i=qc(s,i,void 0),hl(t,e,o,i)}if(a=(o&t.childLanes)!==0,hn||a){if(i=zt,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ni(t,r),Qn(i,t,r,-1))}return zh(),i=qc(Error(te(421))),hl(t,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=mM.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,Tn=sr(r.nextSibling),An=e,pt=!0,qn=null,t!==null&&(Nn[Dn++]=Ti,Nn[Dn++]=Ai,Nn[Dn++]=Zr,Ti=t.id,Ai=t.overflow,Zr=e),e=Nh(e,i.children),e.flags|=4096,e)}function Am(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),lf(t.return,e,n)}function $c(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function o0(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(rn(t,e,i.children,n),i=mt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Am(t,n,e);else if(t.tag===19)Am(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(ut(mt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Eu(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),$c(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Eu(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}$c(e,!0,n,null,s);break;case"together":$c(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function $l(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Di(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Jr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(te(153));if(e.child!==null){for(t=e.child,n=ur(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=ur(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function iM(t,e,n){switch(e.tag){case 3:r0(e),ao();break;case 5:U_(e);break;case 1:gn(e.type)&&vu(e);break;case 4:Th(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ut(xu,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ut(mt,mt.current&1),e.flags|=128,null):n&e.child.childLanes?s0(t,e,n):(ut(mt,mt.current&1),t=Di(t,e,n),t!==null?t.sibling:null);ut(mt,mt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return o0(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ut(mt,mt.current),i)break;return null;case 22:case 23:return e.lanes=0,n0(t,e,n)}return Di(t,e,n)}var a0,gf,l0,u0;a0=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};gf=function(){};l0=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Hr(fi.current);var s=null;switch(n){case"input":r=Fd(t,r),i=Fd(t,i),s=[];break;case"select":r=vt({},r,{value:void 0}),i=vt({},i,{value:void 0}),s=[];break;case"textarea":r=Bd(t,r),i=Bd(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=mu)}Vd(n,i);var o;n=null;for(u in r)if(!i.hasOwnProperty(u)&&r.hasOwnProperty(u)&&r[u]!=null)if(u==="style"){var a=r[u];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(ha.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in i){var l=i[u];if(a=r!=null?r[u]:void 0,i.hasOwnProperty(u)&&l!==a&&(l!=null||a!=null))if(u==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(n||(n={}),n[o]=l[o])}else n||(s||(s=[]),s.push(u,n)),n=l;else u==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(u,l)):u==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(u,""+l):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(ha.hasOwnProperty(u)?(l!=null&&u==="onScroll"&&ct("scroll",t),s||a===l||(s=[])):(s=s||[]).push(u,l))}n&&(s=s||[]).push("style",n);var u=s;(e.updateQueue=u)&&(e.flags|=4)}};u0=function(t,e,n,i){n!==i&&(e.flags|=4)};function Do(t,e){if(!pt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function qt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function rM(t,e,n){var i=e.pendingProps;switch(_h(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return qt(e),null;case 1:return gn(e.type)&&gu(),qt(e),null;case 3:return i=e.stateNode,uo(),ht(mn),ht(Jt),Ch(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(dl(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,qn!==null&&(wf(qn),qn=null))),gf(t,e),qt(e),null;case 5:Ah(e);var r=Hr(Ta.current);if(n=e.type,t!==null&&e.stateNode!=null)l0(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(te(166));return qt(e),null}if(t=Hr(fi.current),dl(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[ui]=e,i[Ea]=s,t=(e.mode&1)!==0,n){case"dialog":ct("cancel",i),ct("close",i);break;case"iframe":case"object":case"embed":ct("load",i);break;case"video":case"audio":for(r=0;r<Wo.length;r++)ct(Wo[r],i);break;case"source":ct("error",i);break;case"img":case"image":case"link":ct("error",i),ct("load",i);break;case"details":ct("toggle",i);break;case"input":Ip(i,s),ct("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},ct("invalid",i);break;case"textarea":Fp(i,s),ct("invalid",i)}Vd(n,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&cl(i.textContent,a,t),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&cl(i.textContent,a,t),r=["children",""+a]):ha.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&ct("scroll",i)}switch(n){case"input":nl(i),Op(i,s,!0);break;case"textarea":nl(i),kp(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=mu)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Fv(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[ui]=e,t[Ea]=i,a0(t,e,!1,!1),e.stateNode=t;e:{switch(o=Gd(n,i),n){case"dialog":ct("cancel",t),ct("close",t),r=i;break;case"iframe":case"object":case"embed":ct("load",t),r=i;break;case"video":case"audio":for(r=0;r<Wo.length;r++)ct(Wo[r],t);r=i;break;case"source":ct("error",t),r=i;break;case"img":case"image":case"link":ct("error",t),ct("load",t),r=i;break;case"details":ct("toggle",t),r=i;break;case"input":Ip(t,i),r=Fd(t,i),ct("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=vt({},i,{value:void 0}),ct("invalid",t);break;case"textarea":Fp(t,i),r=Bd(t,i),ct("invalid",t);break;default:r=i}Vd(n,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?Bv(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&kv(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&pa(t,l):typeof l=="number"&&pa(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(ha.hasOwnProperty(s)?l!=null&&s==="onScroll"&&ct("scroll",t):l!=null&&ih(t,s,l,o))}switch(n){case"input":nl(t),Op(t,i,!1);break;case"textarea":nl(t),kp(t);break;case"option":i.value!=null&&t.setAttribute("value",""+mr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?Gs(t,!!i.multiple,s,!1):i.defaultValue!=null&&Gs(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=mu)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return qt(e),null;case 6:if(t&&e.stateNode!=null)u0(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(te(166));if(n=Hr(Ta.current),Hr(fi.current),dl(e)){if(i=e.stateNode,n=e.memoizedProps,i[ui]=e,(s=i.nodeValue!==n)&&(t=An,t!==null))switch(t.tag){case 3:cl(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&cl(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[ui]=e,e.stateNode=i}return qt(e),null;case 13:if(ht(mt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(pt&&Tn!==null&&e.mode&1&&!(e.flags&128))C_(),ao(),e.flags|=98560,s=!1;else if(s=dl(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(te(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(te(317));s[ui]=e}else ao(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;qt(e),s=!1}else qn!==null&&(wf(qn),qn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||mt.current&1?Lt===0&&(Lt=3):zh())),e.updateQueue!==null&&(e.flags|=4),qt(e),null);case 4:return uo(),gf(t,e),t===null&&Sa(e.stateNode.containerInfo),qt(e),null;case 10:return Mh(e.type._context),qt(e),null;case 17:return gn(e.type)&&gu(),qt(e),null;case 19:if(ht(mt),s=e.memoizedState,s===null)return qt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)Do(s,!1);else{if(Lt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=Eu(t),o!==null){for(e.flags|=128,Do(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ut(mt,mt.current&1|2),e.child}t=t.sibling}s.tail!==null&&wt()>fo&&(e.flags|=128,i=!0,Do(s,!1),e.lanes=4194304)}else{if(!i)if(t=Eu(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Do(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!pt)return qt(e),null}else 2*wt()-s.renderingStartTime>fo&&n!==1073741824&&(e.flags|=128,i=!0,Do(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=wt(),e.sibling=null,n=mt.current,ut(mt,i?n&1|2:n&1),e):(qt(e),null);case 22:case 23:return kh(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?En&1073741824&&(qt(e),e.subtreeFlags&6&&(e.flags|=8192)):qt(e),null;case 24:return null;case 25:return null}throw Error(te(156,e.tag))}function sM(t,e){switch(_h(e),e.tag){case 1:return gn(e.type)&&gu(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return uo(),ht(mn),ht(Jt),Ch(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Ah(e),null;case 13:if(ht(mt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(te(340));ao()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return ht(mt),null;case 4:return uo(),null;case 10:return Mh(e.type._context),null;case 22:case 23:return kh(),null;case 24:return null;default:return null}}var pl=!1,Zt=!1,oM=typeof WeakSet=="function"?WeakSet:Set,ye=null;function Os(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){xt(t,e,i)}else n.current=null}function vf(t,e,n){try{n()}catch(i){xt(t,e,i)}}var Cm=!1;function aM(t,e){if(Jd=fu,t=p_(),gh(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,a=-1,l=-1,u=0,c=0,h=t,f=null;t:for(;;){for(var m;h!==n||r!==0&&h.nodeType!==3||(a=o+r),h!==s||i!==0&&h.nodeType!==3||(l=o+i),h.nodeType===3&&(o+=h.nodeValue.length),(m=h.firstChild)!==null;)f=h,h=m;for(;;){if(h===t)break t;if(f===n&&++u===r&&(a=o),f===s&&++c===i&&(l=o),(m=h.nextSibling)!==null)break;h=f,f=h.parentNode}h=m}n=a===-1||l===-1?null:{start:a,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(ef={focusedElem:t,selectionRange:n},fu=!1,ye=e;ye!==null;)if(e=ye,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,ye=t;else for(;ye!==null;){e=ye;try{var _=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(_!==null){var x=_.memoizedProps,p=_.memoizedState,d=e.stateNode,v=d.getSnapshotBeforeUpdate(e.elementType===e.type?x:Xn(e.type,x),p);d.__reactInternalSnapshotBeforeUpdate=v}break;case 3:var g=e.stateNode.containerInfo;g.nodeType===1?g.textContent="":g.nodeType===9&&g.documentElement&&g.removeChild(g.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(te(163))}}catch(S){xt(e,e.return,S)}if(t=e.sibling,t!==null){t.return=e.return,ye=t;break}ye=e.return}return _=Cm,Cm=!1,_}function na(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&vf(e,n,s)}r=r.next}while(r!==i)}}function tc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function _f(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function c0(t){var e=t.alternate;e!==null&&(t.alternate=null,c0(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[ui],delete e[Ea],delete e[rf],delete e[GS],delete e[WS])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function d0(t){return t.tag===5||t.tag===3||t.tag===4}function Rm(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||d0(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function yf(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=mu));else if(i!==4&&(t=t.child,t!==null))for(yf(t,e,n),t=t.sibling;t!==null;)yf(t,e,n),t=t.sibling}function xf(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(xf(t,e,n),t=t.sibling;t!==null;)xf(t,e,n),t=t.sibling}var Bt=null,Yn=!1;function ki(t,e,n){for(n=n.child;n!==null;)f0(t,e,n),n=n.sibling}function f0(t,e,n){if(di&&typeof di.onCommitFiberUnmount=="function")try{di.onCommitFiberUnmount(Yu,n)}catch{}switch(n.tag){case 5:Zt||Os(n,e);case 6:var i=Bt,r=Yn;Bt=null,ki(t,e,n),Bt=i,Yn=r,Bt!==null&&(Yn?(t=Bt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Bt.removeChild(n.stateNode));break;case 18:Bt!==null&&(Yn?(t=Bt,n=n.stateNode,t.nodeType===8?Vc(t.parentNode,n):t.nodeType===1&&Vc(t,n),_a(t)):Vc(Bt,n.stateNode));break;case 4:i=Bt,r=Yn,Bt=n.stateNode.containerInfo,Yn=!0,ki(t,e,n),Bt=i,Yn=r;break;case 0:case 11:case 14:case 15:if(!Zt&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&vf(n,e,o),r=r.next}while(r!==i)}ki(t,e,n);break;case 1:if(!Zt&&(Os(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(a){xt(n,e,a)}ki(t,e,n);break;case 21:ki(t,e,n);break;case 22:n.mode&1?(Zt=(i=Zt)||n.memoizedState!==null,ki(t,e,n),Zt=i):ki(t,e,n);break;default:ki(t,e,n)}}function bm(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new oM),e.forEach(function(i){var r=gM.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Vn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Bt=a.stateNode,Yn=!1;break e;case 3:Bt=a.stateNode.containerInfo,Yn=!0;break e;case 4:Bt=a.stateNode.containerInfo,Yn=!0;break e}a=a.return}if(Bt===null)throw Error(te(160));f0(s,o,r),Bt=null,Yn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(u){xt(r,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)h0(e,t),e=e.sibling}function h0(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Vn(e,t),ni(t),i&4){try{na(3,t,t.return),tc(3,t)}catch(x){xt(t,t.return,x)}try{na(5,t,t.return)}catch(x){xt(t,t.return,x)}}break;case 1:Vn(e,t),ni(t),i&512&&n!==null&&Os(n,n.return);break;case 5:if(Vn(e,t),ni(t),i&512&&n!==null&&Os(n,n.return),t.flags&32){var r=t.stateNode;try{pa(r,"")}catch(x){xt(t,t.return,x)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,a=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&Iv(r,s),Gd(a,o);var u=Gd(a,s);for(o=0;o<l.length;o+=2){var c=l[o],h=l[o+1];c==="style"?Bv(r,h):c==="dangerouslySetInnerHTML"?kv(r,h):c==="children"?pa(r,h):ih(r,c,h,u)}switch(a){case"input":kd(r,s);break;case"textarea":Ov(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var m=s.value;m!=null?Gs(r,!!s.multiple,m,!1):f!==!!s.multiple&&(s.defaultValue!=null?Gs(r,!!s.multiple,s.defaultValue,!0):Gs(r,!!s.multiple,s.multiple?[]:"",!1))}r[Ea]=s}catch(x){xt(t,t.return,x)}}break;case 6:if(Vn(e,t),ni(t),i&4){if(t.stateNode===null)throw Error(te(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(x){xt(t,t.return,x)}}break;case 3:if(Vn(e,t),ni(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{_a(e.containerInfo)}catch(x){xt(t,t.return,x)}break;case 4:Vn(e,t),ni(t);break;case 13:Vn(e,t),ni(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Oh=wt())),i&4&&bm(t);break;case 22:if(c=n!==null&&n.memoizedState!==null,t.mode&1?(Zt=(u=Zt)||c,Vn(e,t),Zt=u):Vn(e,t),ni(t),i&8192){if(u=t.memoizedState!==null,(t.stateNode.isHidden=u)&&!c&&t.mode&1)for(ye=t,c=t.child;c!==null;){for(h=ye=c;ye!==null;){switch(f=ye,m=f.child,f.tag){case 0:case 11:case 14:case 15:na(4,f,f.return);break;case 1:Os(f,f.return);var _=f.stateNode;if(typeof _.componentWillUnmount=="function"){i=f,n=f.return;try{e=i,_.props=e.memoizedProps,_.state=e.memoizedState,_.componentWillUnmount()}catch(x){xt(i,n,x)}}break;case 5:Os(f,f.return);break;case 22:if(f.memoizedState!==null){Pm(h);continue}}m!==null?(m.return=f,ye=m):Pm(h)}c=c.sibling}e:for(c=null,h=t;;){if(h.tag===5){if(c===null){c=h;try{r=h.stateNode,u?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=h.stateNode,l=h.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=zv("display",o))}catch(x){xt(t,t.return,x)}}}else if(h.tag===6){if(c===null)try{h.stateNode.nodeValue=u?"":h.memoizedProps}catch(x){xt(t,t.return,x)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;c===h&&(c=null),h=h.return}c===h&&(c=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Vn(e,t),ni(t),i&4&&bm(t);break;case 21:break;default:Vn(e,t),ni(t)}}function ni(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(d0(n)){var i=n;break e}n=n.return}throw Error(te(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(pa(r,""),i.flags&=-33);var s=Rm(t);xf(t,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=Rm(t);yf(t,a,o);break;default:throw Error(te(161))}}catch(l){xt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function lM(t,e,n){ye=t,p0(t)}function p0(t,e,n){for(var i=(t.mode&1)!==0;ye!==null;){var r=ye,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||pl;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||Zt;a=pl;var u=Zt;if(pl=o,(Zt=l)&&!u)for(ye=r;ye!==null;)o=ye,l=o.child,o.tag===22&&o.memoizedState!==null?Um(r):l!==null?(l.return=o,ye=l):Um(r);for(;s!==null;)ye=s,p0(s),s=s.sibling;ye=r,pl=a,Zt=u}Lm(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,ye=s):Lm(t)}}function Lm(t){for(;ye!==null;){var e=ye;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Zt||tc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Zt)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Xn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&pm(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}pm(e,o,n)}break;case 5:var a=e.stateNode;if(n===null&&e.flags&4){n=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var c=u.memoizedState;if(c!==null){var h=c.dehydrated;h!==null&&_a(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(te(163))}Zt||e.flags&512&&_f(e)}catch(f){xt(e,e.return,f)}}if(e===t){ye=null;break}if(n=e.sibling,n!==null){n.return=e.return,ye=n;break}ye=e.return}}function Pm(t){for(;ye!==null;){var e=ye;if(e===t){ye=null;break}var n=e.sibling;if(n!==null){n.return=e.return,ye=n;break}ye=e.return}}function Um(t){for(;ye!==null;){var e=ye;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{tc(4,e)}catch(l){xt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){xt(e,r,l)}}var s=e.return;try{_f(e)}catch(l){xt(e,s,l)}break;case 5:var o=e.return;try{_f(e)}catch(l){xt(e,o,l)}}}catch(l){xt(e,e.return,l)}if(e===t){ye=null;break}var a=e.sibling;if(a!==null){a.return=e.return,ye=a;break}ye=e.return}}var uM=Math.ceil,Au=Oi.ReactCurrentDispatcher,Dh=Oi.ReactCurrentOwner,zn=Oi.ReactCurrentBatchConfig,Ke=0,zt=null,Rt=null,Vt=0,En=0,Fs=xr(0),Lt=0,ba=null,Jr=0,nc=0,Ih=0,ia=null,dn=null,Oh=0,fo=1/0,xi=null,Cu=!1,Sf=null,ar=null,ml=!1,Ji=null,Ru=0,ra=0,Mf=null,Kl=-1,Zl=0;function an(){return Ke&6?wt():Kl!==-1?Kl:Kl=wt()}function lr(t){return t.mode&1?Ke&2&&Vt!==0?Vt&-Vt:XS.transition!==null?(Zl===0&&(Zl=Qv()),Zl):(t=it,t!==0||(t=window.event,t=t===void 0?16:s_(t.type)),t):1}function Qn(t,e,n,i){if(50<ra)throw ra=0,Mf=null,Error(te(185));Ha(t,n,i),(!(Ke&2)||t!==zt)&&(t===zt&&(!(Ke&2)&&(nc|=n),Lt===4&&Zi(t,Vt)),vn(t,i),n===1&&Ke===0&&!(e.mode&1)&&(fo=wt()+500,Qu&&Sr()))}function vn(t,e){var n=t.callbackNode;Xx(t,e);var i=du(t,t===zt?Vt:0);if(i===0)n!==null&&Hp(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Hp(n),e===1)t.tag===0?jS(Nm.bind(null,t)):w_(Nm.bind(null,t)),HS(function(){!(Ke&6)&&Sr()}),n=null;else{switch(Jv(i)){case 1:n=lh;break;case 4:n=Kv;break;case 16:n=cu;break;case 536870912:n=Zv;break;default:n=cu}n=M0(n,m0.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function m0(t,e){if(Kl=-1,Zl=0,Ke&6)throw Error(te(327));var n=t.callbackNode;if(qs()&&t.callbackNode!==n)return null;var i=du(t,t===zt?Vt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=bu(t,i);else{e=i;var r=Ke;Ke|=2;var s=v0();(zt!==t||Vt!==e)&&(xi=null,fo=wt()+500,Vr(t,e));do try{fM();break}catch(a){g0(t,a)}while(!0);Sh(),Au.current=s,Ke=r,Rt!==null?e=0:(zt=null,Vt=0,e=Lt)}if(e!==0){if(e===2&&(r=qd(t),r!==0&&(i=r,e=Ef(t,r))),e===1)throw n=ba,Vr(t,0),Zi(t,i),vn(t,wt()),n;if(e===6)Zi(t,i);else{if(r=t.current.alternate,!(i&30)&&!cM(r)&&(e=bu(t,i),e===2&&(s=qd(t),s!==0&&(i=s,e=Ef(t,s))),e===1))throw n=ba,Vr(t,0),Zi(t,i),vn(t,wt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(te(345));case 2:br(t,dn,xi);break;case 3:if(Zi(t,i),(i&130023424)===i&&(e=Oh+500-wt(),10<e)){if(du(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){an(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=nf(br.bind(null,t,dn,xi),e);break}br(t,dn,xi);break;case 4:if(Zi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var o=31-Zn(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=wt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*uM(i/1960))-i,10<i){t.timeoutHandle=nf(br.bind(null,t,dn,xi),i);break}br(t,dn,xi);break;case 5:br(t,dn,xi);break;default:throw Error(te(329))}}}return vn(t,wt()),t.callbackNode===n?m0.bind(null,t):null}function Ef(t,e){var n=ia;return t.current.memoizedState.isDehydrated&&(Vr(t,e).flags|=256),t=bu(t,e),t!==2&&(e=dn,dn=n,e!==null&&wf(e)),t}function wf(t){dn===null?dn=t:dn.push.apply(dn,t)}function cM(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!ei(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Zi(t,e){for(e&=~Ih,e&=~nc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Zn(e),i=1<<n;t[n]=-1,e&=~i}}function Nm(t){if(Ke&6)throw Error(te(327));qs();var e=du(t,0);if(!(e&1))return vn(t,wt()),null;var n=bu(t,e);if(t.tag!==0&&n===2){var i=qd(t);i!==0&&(e=i,n=Ef(t,i))}if(n===1)throw n=ba,Vr(t,0),Zi(t,e),vn(t,wt()),n;if(n===6)throw Error(te(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,br(t,dn,xi),vn(t,wt()),null}function Fh(t,e){var n=Ke;Ke|=1;try{return t(e)}finally{Ke=n,Ke===0&&(fo=wt()+500,Qu&&Sr())}}function es(t){Ji!==null&&Ji.tag===0&&!(Ke&6)&&qs();var e=Ke;Ke|=1;var n=zn.transition,i=it;try{if(zn.transition=null,it=1,t)return t()}finally{it=i,zn.transition=n,Ke=e,!(Ke&6)&&Sr()}}function kh(){En=Fs.current,ht(Fs)}function Vr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,BS(n)),Rt!==null)for(n=Rt.return;n!==null;){var i=n;switch(_h(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&gu();break;case 3:uo(),ht(mn),ht(Jt),Ch();break;case 5:Ah(i);break;case 4:uo();break;case 13:ht(mt);break;case 19:ht(mt);break;case 10:Mh(i.type._context);break;case 22:case 23:kh()}n=n.return}if(zt=t,Rt=t=ur(t.current,null),Vt=En=e,Lt=0,ba=null,Ih=nc=Jr=0,dn=ia=null,Br!==null){for(e=0;e<Br.length;e++)if(n=Br[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}n.pending=i}Br=null}return t}function g0(t,e){do{var n=Rt;try{if(Sh(),Yl.current=Tu,wu){for(var i=gt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}wu=!1}if(Qr=0,Ft=bt=gt=null,ta=!1,Aa=0,Dh.current=null,n===null||n.return===null){Lt=1,ba=e,Rt=null;break}e:{var s=t,o=n.return,a=n,l=e;if(e=Vt,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=l,c=a,h=c.tag;if(!(c.mode&1)&&(h===0||h===11||h===15)){var f=c.alternate;f?(c.updateQueue=f.updateQueue,c.memoizedState=f.memoizedState,c.lanes=f.lanes):(c.updateQueue=null,c.memoizedState=null)}var m=xm(o);if(m!==null){m.flags&=-257,Sm(m,o,a,s,e),m.mode&1&&ym(s,u,e),e=m,l=u;var _=e.updateQueue;if(_===null){var x=new Set;x.add(l),e.updateQueue=x}else _.add(l);break e}else{if(!(e&1)){ym(s,u,e),zh();break e}l=Error(te(426))}}else if(pt&&a.mode&1){var p=xm(o);if(p!==null){!(p.flags&65536)&&(p.flags|=256),Sm(p,o,a,s,e),yh(co(l,a));break e}}s=l=co(l,a),Lt!==4&&(Lt=2),ia===null?ia=[s]:ia.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var d=J_(s,l,e);hm(s,d);break e;case 1:a=l;var v=s.type,g=s.stateNode;if(!(s.flags&128)&&(typeof v.getDerivedStateFromError=="function"||g!==null&&typeof g.componentDidCatch=="function"&&(ar===null||!ar.has(g)))){s.flags|=65536,e&=-e,s.lanes|=e;var S=e0(s,a,e);hm(s,S);break e}}s=s.return}while(s!==null)}y0(n)}catch(A){e=A,Rt===n&&n!==null&&(Rt=n=n.return);continue}break}while(!0)}function v0(){var t=Au.current;return Au.current=Tu,t===null?Tu:t}function zh(){(Lt===0||Lt===3||Lt===2)&&(Lt=4),zt===null||!(Jr&268435455)&&!(nc&268435455)||Zi(zt,Vt)}function bu(t,e){var n=Ke;Ke|=2;var i=v0();(zt!==t||Vt!==e)&&(xi=null,Vr(t,e));do try{dM();break}catch(r){g0(t,r)}while(!0);if(Sh(),Ke=n,Au.current=i,Rt!==null)throw Error(te(261));return zt=null,Vt=0,Lt}function dM(){for(;Rt!==null;)_0(Rt)}function fM(){for(;Rt!==null&&!Fx();)_0(Rt)}function _0(t){var e=S0(t.alternate,t,En);t.memoizedProps=t.pendingProps,e===null?y0(t):Rt=e,Dh.current=null}function y0(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=sM(n,e),n!==null){n.flags&=32767,Rt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Lt=6,Rt=null;return}}else if(n=rM(n,e,En),n!==null){Rt=n;return}if(e=e.sibling,e!==null){Rt=e;return}Rt=e=t}while(e!==null);Lt===0&&(Lt=5)}function br(t,e,n){var i=it,r=zn.transition;try{zn.transition=null,it=1,hM(t,e,n,i)}finally{zn.transition=r,it=i}return null}function hM(t,e,n,i){do qs();while(Ji!==null);if(Ke&6)throw Error(te(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(te(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(Yx(t,s),t===zt&&(Rt=zt=null,Vt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||ml||(ml=!0,M0(cu,function(){return qs(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=zn.transition,zn.transition=null;var o=it;it=1;var a=Ke;Ke|=4,Dh.current=null,aM(t,n),h0(n,t),NS(ef),fu=!!Jd,ef=Jd=null,t.current=n,lM(n),kx(),Ke=a,it=o,zn.transition=s}else t.current=n;if(ml&&(ml=!1,Ji=t,Ru=r),s=t.pendingLanes,s===0&&(ar=null),Hx(n.stateNode),vn(t,wt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Cu)throw Cu=!1,t=Sf,Sf=null,t;return Ru&1&&t.tag!==0&&qs(),s=t.pendingLanes,s&1?t===Mf?ra++:(ra=0,Mf=t):ra=0,Sr(),null}function qs(){if(Ji!==null){var t=Jv(Ru),e=zn.transition,n=it;try{if(zn.transition=null,it=16>t?16:t,Ji===null)var i=!1;else{if(t=Ji,Ji=null,Ru=0,Ke&6)throw Error(te(331));var r=Ke;for(Ke|=4,ye=t.current;ye!==null;){var s=ye,o=s.child;if(ye.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var u=a[l];for(ye=u;ye!==null;){var c=ye;switch(c.tag){case 0:case 11:case 15:na(8,c,s)}var h=c.child;if(h!==null)h.return=c,ye=h;else for(;ye!==null;){c=ye;var f=c.sibling,m=c.return;if(c0(c),c===u){ye=null;break}if(f!==null){f.return=m,ye=f;break}ye=m}}}var _=s.alternate;if(_!==null){var x=_.child;if(x!==null){_.child=null;do{var p=x.sibling;x.sibling=null,x=p}while(x!==null)}}ye=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,ye=o;else e:for(;ye!==null;){if(s=ye,s.flags&2048)switch(s.tag){case 0:case 11:case 15:na(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,ye=d;break e}ye=s.return}}var v=t.current;for(ye=v;ye!==null;){o=ye;var g=o.child;if(o.subtreeFlags&2064&&g!==null)g.return=o,ye=g;else e:for(o=v;ye!==null;){if(a=ye,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:tc(9,a)}}catch(A){xt(a,a.return,A)}if(a===o){ye=null;break e}var S=a.sibling;if(S!==null){S.return=a.return,ye=S;break e}ye=a.return}}if(Ke=r,Sr(),di&&typeof di.onPostCommitFiberRoot=="function")try{di.onPostCommitFiberRoot(Yu,t)}catch{}i=!0}return i}finally{it=n,zn.transition=e}}return!1}function Dm(t,e,n){e=co(n,e),e=J_(t,e,1),t=or(t,e,1),e=an(),t!==null&&(Ha(t,1,e),vn(t,e))}function xt(t,e,n){if(t.tag===3)Dm(t,t,n);else for(;e!==null;){if(e.tag===3){Dm(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(ar===null||!ar.has(i))){t=co(n,t),t=e0(e,t,1),e=or(e,t,1),t=an(),e!==null&&(Ha(e,1,t),vn(e,t));break}}e=e.return}}function pM(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=an(),t.pingedLanes|=t.suspendedLanes&n,zt===t&&(Vt&n)===n&&(Lt===4||Lt===3&&(Vt&130023424)===Vt&&500>wt()-Oh?Vr(t,0):Ih|=n),vn(t,e)}function x0(t,e){e===0&&(t.mode&1?(e=sl,sl<<=1,!(sl&130023424)&&(sl=4194304)):e=1);var n=an();t=Ni(t,e),t!==null&&(Ha(t,e,n),vn(t,n))}function mM(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),x0(t,n)}function gM(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(te(314))}i!==null&&i.delete(e),x0(t,n)}var S0;S0=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||mn.current)hn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return hn=!1,iM(t,e,n);hn=!!(t.flags&131072)}else hn=!1,pt&&e.flags&1048576&&T_(e,yu,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;$l(t,e),t=e.pendingProps;var r=oo(e,Jt.current);Ys(e,n),r=bh(null,e,i,t,r,n);var s=Lh();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,gn(i)?(s=!0,vu(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,wh(e),r.updater=ec,e.stateNode=r,r._reactInternals=e,cf(e,i,t,n),e=hf(null,e,i,!0,s,n)):(e.tag=0,pt&&s&&vh(e),rn(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch($l(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=_M(i),t=Xn(i,t),r){case 0:e=ff(null,e,i,t,n);break e;case 1:e=wm(null,e,i,t,n);break e;case 11:e=Mm(null,e,i,t,n);break e;case 14:e=Em(null,e,i,Xn(i.type,t),n);break e}throw Error(te(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Xn(i,r),ff(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Xn(i,r),wm(t,e,i,r,n);case 3:e:{if(r0(e),t===null)throw Error(te(387));i=e.pendingProps,s=e.memoizedState,r=s.element,P_(t,e),Mu(e,i,null,n);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=co(Error(te(423)),e),e=Tm(t,e,i,n,r);break e}else if(i!==r){r=co(Error(te(424)),e),e=Tm(t,e,i,n,r);break e}else for(Tn=sr(e.stateNode.containerInfo.firstChild),An=e,pt=!0,qn=null,n=b_(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(ao(),i===r){e=Di(t,e,n);break e}rn(t,e,i,n)}e=e.child}return e;case 5:return U_(e),t===null&&af(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,o=r.children,tf(i,r)?o=null:s!==null&&tf(i,s)&&(e.flags|=32),i0(t,e),rn(t,e,o,n),e.child;case 6:return t===null&&af(e),null;case 13:return s0(t,e,n);case 4:return Th(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=lo(e,null,i,n):rn(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Xn(i,r),Mm(t,e,i,r,n);case 7:return rn(t,e,e.pendingProps,n),e.child;case 8:return rn(t,e,e.pendingProps.children,n),e.child;case 12:return rn(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,ut(xu,i._currentValue),i._currentValue=o,s!==null)if(ei(s.value,o)){if(s.children===r.children&&!mn.current){e=Di(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Ri(-1,n&-n),l.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var c=u.pending;c===null?l.next=l:(l.next=c.next,c.next=l),u.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),lf(s.return,n,e),a.lanes|=n;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(te(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),lf(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}rn(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Ys(e,n),r=Bn(r),i=i(r),e.flags|=1,rn(t,e,i,n),e.child;case 14:return i=e.type,r=Xn(i,e.pendingProps),r=Xn(i.type,r),Em(t,e,i,r,n);case 15:return t0(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Xn(i,r),$l(t,e),e.tag=1,gn(i)?(t=!0,vu(e)):t=!1,Ys(e,n),Q_(e,i,r),cf(e,i,r,n),hf(null,e,i,!0,t,n);case 19:return o0(t,e,n);case 22:return n0(t,e,n)}throw Error(te(156,e.tag))};function M0(t,e){return $v(t,e)}function vM(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Fn(t,e,n,i){return new vM(t,e,n,i)}function Bh(t){return t=t.prototype,!(!t||!t.isReactComponent)}function _M(t){if(typeof t=="function")return Bh(t)?1:0;if(t!=null){if(t=t.$$typeof,t===sh)return 11;if(t===oh)return 14}return 2}function ur(t,e){var n=t.alternate;return n===null?(n=Fn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Ql(t,e,n,i,r,s){var o=2;if(i=t,typeof t=="function")Bh(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case Cs:return Gr(n.children,r,s,e);case rh:o=8,r|=8;break;case Nd:return t=Fn(12,n,e,r|2),t.elementType=Nd,t.lanes=s,t;case Dd:return t=Fn(13,n,e,r),t.elementType=Dd,t.lanes=s,t;case Id:return t=Fn(19,n,e,r),t.elementType=Id,t.lanes=s,t;case Uv:return ic(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Lv:o=10;break e;case Pv:o=9;break e;case sh:o=11;break e;case oh:o=14;break e;case qi:o=16,i=null;break e}throw Error(te(130,t==null?t:typeof t,""))}return e=Fn(o,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Gr(t,e,n,i){return t=Fn(7,t,i,e),t.lanes=n,t}function ic(t,e,n,i){return t=Fn(22,t,i,e),t.elementType=Uv,t.lanes=n,t.stateNode={isHidden:!1},t}function Kc(t,e,n){return t=Fn(6,t,null,e),t.lanes=n,t}function Zc(t,e,n){return e=Fn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function yM(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Pc(0),this.expirationTimes=Pc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Pc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Hh(t,e,n,i,r,s,o,a,l){return t=new yM(t,e,n,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Fn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},wh(s),t}function xM(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:As,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function E0(t){if(!t)return gr;t=t._reactInternals;e:{if(rs(t)!==t||t.tag!==1)throw Error(te(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(gn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(te(171))}if(t.tag===1){var n=t.type;if(gn(n))return E_(t,n,e)}return e}function w0(t,e,n,i,r,s,o,a,l){return t=Hh(n,i,!0,t,r,s,o,a,l),t.context=E0(null),n=t.current,i=an(),r=lr(n),s=Ri(i,r),s.callback=e??null,or(n,s,r),t.current.lanes=r,Ha(t,r,i),vn(t,i),t}function rc(t,e,n,i){var r=e.current,s=an(),o=lr(r);return n=E0(n),e.context===null?e.context=n:e.pendingContext=n,e=Ri(s,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=or(r,e,o),t!==null&&(Qn(t,r,o,s),Xl(t,r,o)),o}function Lu(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Im(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Vh(t,e){Im(t,e),(t=t.alternate)&&Im(t,e)}function SM(){return null}var T0=typeof reportError=="function"?reportError:function(t){console.error(t)};function Gh(t){this._internalRoot=t}sc.prototype.render=Gh.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(te(409));rc(t,e,null,null)};sc.prototype.unmount=Gh.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;es(function(){rc(null,t,null,null)}),e[Ui]=null}};function sc(t){this._internalRoot=t}sc.prototype.unstable_scheduleHydration=function(t){if(t){var e=n_();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Ki.length&&e!==0&&e<Ki[n].priority;n++);Ki.splice(n,0,t),n===0&&r_(t)}};function Wh(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function oc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Om(){}function MM(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var u=Lu(o);s.call(u)}}var o=w0(e,i,t,0,null,!1,!1,"",Om);return t._reactRootContainer=o,t[Ui]=o.current,Sa(t.nodeType===8?t.parentNode:t),es(),o}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var u=Lu(l);a.call(u)}}var l=Hh(t,0,!1,null,null,!1,!1,"",Om);return t._reactRootContainer=l,t[Ui]=l.current,Sa(t.nodeType===8?t.parentNode:t),es(function(){rc(e,l,n,i)}),l}function ac(t,e,n,i,r){var s=n._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=Lu(o);a.call(l)}}rc(e,o,t,r)}else o=MM(n,e,t,r,i);return Lu(o)}e_=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Go(e.pendingLanes);n!==0&&(uh(e,n|1),vn(e,wt()),!(Ke&6)&&(fo=wt()+500,Sr()))}break;case 13:es(function(){var i=Ni(t,1);if(i!==null){var r=an();Qn(i,t,1,r)}}),Vh(t,1)}};ch=function(t){if(t.tag===13){var e=Ni(t,134217728);if(e!==null){var n=an();Qn(e,t,134217728,n)}Vh(t,134217728)}};t_=function(t){if(t.tag===13){var e=lr(t),n=Ni(t,e);if(n!==null){var i=an();Qn(n,t,e,i)}Vh(t,e)}};n_=function(){return it};i_=function(t,e){var n=it;try{return it=t,e()}finally{it=n}};jd=function(t,e,n){switch(e){case"input":if(kd(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=Zu(i);if(!r)throw Error(te(90));Dv(i),kd(i,r)}}}break;case"textarea":Ov(t,n);break;case"select":e=n.value,e!=null&&Gs(t,!!n.multiple,e,!1)}};Gv=Fh;Wv=es;var EM={usingClientEntryPoint:!1,Events:[Ga,Ps,Zu,Hv,Vv,Fh]},Io={findFiberByHostInstance:zr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},wM={bundleType:Io.bundleType,version:Io.version,rendererPackageName:Io.rendererPackageName,rendererConfig:Io.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Oi.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Yv(t),t===null?null:t.stateNode},findFiberByHostInstance:Io.findFiberByHostInstance||SM,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var gl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!gl.isDisabled&&gl.supportsFiber)try{Yu=gl.inject(wM),di=gl}catch{}}bn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=EM;bn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Wh(e))throw Error(te(200));return xM(t,e,null,n)};bn.createRoot=function(t,e){if(!Wh(t))throw Error(te(299));var n=!1,i="",r=T0;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Hh(t,1,!1,null,null,n,!1,i,r),t[Ui]=e.current,Sa(t.nodeType===8?t.parentNode:t),new Gh(e)};bn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(te(188)):(t=Object.keys(t).join(","),Error(te(268,t)));return t=Yv(e),t=t===null?null:t.stateNode,t};bn.flushSync=function(t){return es(t)};bn.hydrate=function(t,e,n){if(!oc(e))throw Error(te(200));return ac(null,t,e,!0,n)};bn.hydrateRoot=function(t,e,n){if(!Wh(t))throw Error(te(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",o=T0;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=w0(e,null,t,1,n??null,r,!1,s,o),t[Ui]=e.current,Sa(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new sc(e)};bn.render=function(t,e,n){if(!oc(e))throw Error(te(200));return ac(null,t,e,!1,n)};bn.unmountComponentAtNode=function(t){if(!oc(t))throw Error(te(40));return t._reactRootContainer?(es(function(){ac(null,null,t,!1,function(){t._reactRootContainer=null,t[Ui]=null})}),!0):!1};bn.unstable_batchedUpdates=Fh;bn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!oc(n))throw Error(te(200));if(t==null||t._reactInternals===void 0)throw Error(te(38));return ac(t,e,n,!1,i)};bn.version="18.3.1-next-f1338f8080-20240426";function A0(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(A0)}catch(t){console.error(t)}}A0(),Av.exports=bn;var TM=Av.exports,Fm=TM;Pd.createRoot=Fm.createRoot,Pd.hydrateRoot=Fm.hydrateRoot;const C0=tt.createContext(null),AM=()=>{const t=tt.useContext(C0);if(!t)throw new Error("useTelegram must be used within a TelegramProvider");return t},CM=({children:t})=>{const[e,n]=tt.useState(!1),[i,r]=tt.useState(null),[s,o]=tt.useState(""),[a,l]=tt.useState(null);tt.useEffect(()=>{const h=()=>{var m;if((m=window.Telegram)!=null&&m.WebApp){const _=window.Telegram.WebApp;n(!0),l(_),o(_.initData),r(_.initDataUnsafe.user||null),_.ready(),_.expand(),document.documentElement.style.setProperty("--tg-theme-bg-color",_.themeParams.bg_color||"#ffffff"),document.documentElement.style.setProperty("--tg-theme-text-color",_.themeParams.text_color||"#000000")}else n(!1)};h();const f=setTimeout(h,100);return()=>clearTimeout(f)},[!1]);const c={isInTelegram:e,user:i,initData:s,webApp:a};return $.jsx(C0.Provider,{value:c,children:t})},RM=()=>$.jsx("div",{className:"min-h-screen bg-gradient-to-br from-ios-gray-50 to-ios-gray-100 flex items-center justify-center p-4",children:$.jsxs("div",{className:"card max-w-md w-full p-8 text-center",children:[$.jsxs("div",{className:"mb-6",children:[$.jsx("div",{className:"w-20 h-20 mx-auto bg-gradient-to-br from-ios-blue to-blue-600 rounded-full flex items-center justify-center mb-4",children:$.jsx("svg",{className:"w-10 h-10 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:$.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"})})}),$.jsx("h1",{className:"text-2xl font-bold text-ios-gray-900 mb-2",children:"Access Restricted"}),$.jsx("p",{className:"text-ios-gray-600 mb-6",children:"Coinmoji is only available inside Telegram. This app allows you to create custom emoji from 3D coin designs."})]}),$.jsxs("div",{className:"space-y-4",children:[$.jsxs("div",{className:"p-4 bg-ios-gray-50 rounded-ios",children:[$.jsx("h3",{className:"font-semibold text-ios-gray-900 mb-2",children:"How to access:"}),$.jsxs("ol",{className:"text-sm text-ios-gray-700 text-left space-y-1",children:[$.jsx("li",{children:"1. Open Telegram"}),$.jsx("li",{children:"2. Search for @CoinmojiBot"}),$.jsx("li",{children:'3. Start the bot and tap "Open App"'})]})]}),$.jsx("a",{href:"https://t.me/CoinmojiBot",className:"btn-primary w-full inline-block",target:"_blank",rel:"noopener noreferrer",children:"Open in Telegram"})]}),$.jsx("div",{className:"mt-6 pt-6 border-t border-ios-gray-200",children:$.jsx("p",{className:"text-xs text-ios-gray-500",children:"Create stunning 3D animated emoji for your Telegram chats"})})]})});/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const jh="158",bM=0,km=1,LM=2,R0=1,PM=2,yi=3,vr=0,_n=1,wi=2,cr=0,$s=1,zm=2,Bm=3,Hm=4,UM=5,Dr=100,NM=101,DM=102,Vm=103,Gm=104,IM=200,OM=201,FM=202,kM=203,Tf=204,Af=205,zM=206,BM=207,HM=208,VM=209,GM=210,WM=211,jM=212,XM=213,YM=214,qM=0,$M=1,KM=2,Pu=3,ZM=4,QM=5,JM=6,eE=7,b0=0,tE=1,nE=2,dr=0,iE=1,rE=2,sE=3,oE=4,aE=5,L0=300,ho=301,po=302,Cf=303,Rf=304,lc=306,Uu=1e3,Kn=1001,bf=1002,sn=1003,Wm=1004,Qc=1005,St=1006,lE=1007,La=1008,fr=1009,uE=1010,cE=1011,Xh=1012,P0=1013,er=1014,tr=1015,Pa=1016,U0=1017,N0=1018,Wr=1020,dE=1021,on=1023,fE=1024,hE=1025,jr=1026,mo=1027,pE=1028,D0=1029,mE=1030,I0=1031,O0=1033,Jc=33776,ed=33777,td=33778,nd=33779,jm=35840,Xm=35841,Ym=35842,qm=35843,gE=36196,$m=37492,Km=37496,Zm=37808,Qm=37809,Jm=37810,eg=37811,tg=37812,ng=37813,ig=37814,rg=37815,sg=37816,og=37817,ag=37818,lg=37819,ug=37820,cg=37821,id=36492,dg=36494,fg=36495,vE=36283,hg=36284,pg=36285,mg=36286,F0=3e3,Xr=3001,_E=3200,yE=3201,k0=0,xE=1,On="",at="srgb",Ii="srgb-linear",Yh="display-p3",uc="display-p3-linear",Nu="linear",dt="srgb",Du="rec709",Iu="p3",os=7680,gg=519,SE=512,ME=513,EE=514,wE=515,TE=516,AE=517,CE=518,RE=519,vg=35044,_g="300 es",Lf=1035,Ci=2e3,Ou=2001;class wo{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const $t=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],rd=Math.PI/180,Pf=180/Math.PI;function ja(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return($t[t&255]+$t[t>>8&255]+$t[t>>16&255]+$t[t>>24&255]+"-"+$t[e&255]+$t[e>>8&255]+"-"+$t[e>>16&15|64]+$t[e>>24&255]+"-"+$t[n&63|128]+$t[n>>8&255]+"-"+$t[n>>16&255]+$t[n>>24&255]+$t[i&255]+$t[i>>8&255]+$t[i>>16&255]+$t[i>>24&255]).toLowerCase()}function fn(t,e,n){return Math.max(e,Math.min(n,t))}function bE(t,e){return(t%e+e)%e}function sd(t,e,n){return(1-n)*t+n*e}function yg(t){return(t&t-1)===0&&t!==0}function Uf(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function Oo(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function cn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}class nt{constructor(e=0,n=0){nt.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(fn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Xe{constructor(e,n,i,r,s,o,a,l,u){Xe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,u)}set(e,n,i,r,s,o,a,l,u){const c=this.elements;return c[0]=e,c[1]=r,c[2]=a,c[3]=n,c[4]=s,c[5]=l,c[6]=i,c[7]=o,c[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],u=i[1],c=i[4],h=i[7],f=i[2],m=i[5],_=i[8],x=r[0],p=r[3],d=r[6],v=r[1],g=r[4],S=r[7],A=r[2],E=r[5],M=r[8];return s[0]=o*x+a*v+l*A,s[3]=o*p+a*g+l*E,s[6]=o*d+a*S+l*M,s[1]=u*x+c*v+h*A,s[4]=u*p+c*g+h*E,s[7]=u*d+c*S+h*M,s[2]=f*x+m*v+_*A,s[5]=f*p+m*g+_*E,s[8]=f*d+m*S+_*M,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],u=e[7],c=e[8];return n*o*c-n*a*u-i*s*c+i*a*l+r*s*u-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],u=e[7],c=e[8],h=c*o-a*u,f=a*l-c*s,m=u*s-o*l,_=n*h+i*f+r*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/_;return e[0]=h*x,e[1]=(r*u-c*i)*x,e[2]=(a*i-r*o)*x,e[3]=f*x,e[4]=(c*n-r*l)*x,e[5]=(r*s-a*n)*x,e[6]=m*x,e[7]=(i*l-u*n)*x,e[8]=(o*n-i*s)*x,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),u=Math.sin(s);return this.set(i*l,i*u,-i*(l*o+u*a)+o+e,-r*u,r*l,-r*(-u*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(od.makeScale(e,n)),this}rotate(e){return this.premultiply(od.makeRotation(-e)),this}translate(e,n){return this.premultiply(od.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const od=new Xe;function z0(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Ua(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function LE(){const t=Ua("canvas");return t.style.display="block",t}const xg={};function sa(t){t in xg||(xg[t]=!0,console.warn(t))}const Sg=new Xe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Mg=new Xe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),vl={[Ii]:{transfer:Nu,primaries:Du,toReference:t=>t,fromReference:t=>t},[at]:{transfer:dt,primaries:Du,toReference:t=>t.convertSRGBToLinear(),fromReference:t=>t.convertLinearToSRGB()},[uc]:{transfer:Nu,primaries:Iu,toReference:t=>t.applyMatrix3(Mg),fromReference:t=>t.applyMatrix3(Sg)},[Yh]:{transfer:dt,primaries:Iu,toReference:t=>t.convertSRGBToLinear().applyMatrix3(Mg),fromReference:t=>t.applyMatrix3(Sg).convertLinearToSRGB()}},PE=new Set([Ii,uc]),st={enabled:!0,_workingColorSpace:Ii,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(t){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!t},get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(t){if(!PE.has(t))throw new Error(`Unsupported working color space, "${t}".`);this._workingColorSpace=t},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=vl[e].toReference,r=vl[n].fromReference;return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this._workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this._workingColorSpace)},getPrimaries:function(t){return vl[t].primaries},getTransfer:function(t){return t===On?Nu:vl[t].transfer}};function Ks(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function ad(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let as;class B0{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{as===void 0&&(as=Ua("canvas")),as.width=e.width,as.height=e.height;const i=as.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=as}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Ua("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ks(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Ks(n[i]/255)*255):n[i]=Ks(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let UE=0;class H0{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:UE++}),this.uuid=ja(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(ld(r[o].image)):s.push(ld(r[o]))}else s=ld(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function ld(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?B0.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let NE=0;class Qt extends wo{constructor(e=Qt.DEFAULT_IMAGE,n=Qt.DEFAULT_MAPPING,i=Kn,r=Kn,s=St,o=La,a=on,l=fr,u=Qt.DEFAULT_ANISOTROPY,c=On){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:NE++}),this.uuid=ja(),this.name="",this.source=new H0(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=u,this.format=a,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof c=="string"?this.colorSpace=c:(sa("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=c===Xr?at:On),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==L0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Uu:e.x=e.x-Math.floor(e.x);break;case Kn:e.x=e.x<0?0:1;break;case bf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Uu:e.y=e.y-Math.floor(e.y);break;case Kn:e.y=e.y<0?0:1;break;case bf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return sa("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===at?Xr:F0}set encoding(e){sa("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Xr?at:On}}Qt.DEFAULT_IMAGE=null;Qt.DEFAULT_MAPPING=L0;Qt.DEFAULT_ANISOTROPY=1;class kt{constructor(e=0,n=0,i=0,r=1){kt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,u=l[0],c=l[4],h=l[8],f=l[1],m=l[5],_=l[9],x=l[2],p=l[6],d=l[10];if(Math.abs(c-f)<.01&&Math.abs(h-x)<.01&&Math.abs(_-p)<.01){if(Math.abs(c+f)<.1&&Math.abs(h+x)<.1&&Math.abs(_+p)<.1&&Math.abs(u+m+d-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const g=(u+1)/2,S=(m+1)/2,A=(d+1)/2,E=(c+f)/4,M=(h+x)/4,b=(_+p)/4;return g>S&&g>A?g<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(g),r=E/i,s=M/i):S>A?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=E/r,s=b/r):A<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(A),i=M/s,r=b/s),this.set(i,r,s,n),this}let v=Math.sqrt((p-_)*(p-_)+(h-x)*(h-x)+(f-c)*(f-c));return Math.abs(v)<.001&&(v=1),this.x=(p-_)/v,this.y=(h-x)/v,this.z=(f-c)/v,this.w=Math.acos((u+m+d-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class DE extends wo{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new kt(0,0,e,n),this.scissorTest=!1,this.viewport=new kt(0,0,e,n);const r={width:e,height:n,depth:1};i.encoding!==void 0&&(sa("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Xr?at:On),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:St,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new Qt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(e,n,i=1){(this.width!==e||this.height!==n||this.depth!==i)&&(this.width=e,this.height=n,this.depth=i,this.texture.image.width=e,this.texture.image.height=n,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new H0(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ts extends DE{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class V0 extends Qt{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=sn,this.minFilter=sn,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class IE extends Qt{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=sn,this.minFilter=sn,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xa{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],u=i[r+1],c=i[r+2],h=i[r+3];const f=s[o+0],m=s[o+1],_=s[o+2],x=s[o+3];if(a===0){e[n+0]=l,e[n+1]=u,e[n+2]=c,e[n+3]=h;return}if(a===1){e[n+0]=f,e[n+1]=m,e[n+2]=_,e[n+3]=x;return}if(h!==x||l!==f||u!==m||c!==_){let p=1-a;const d=l*f+u*m+c*_+h*x,v=d>=0?1:-1,g=1-d*d;if(g>Number.EPSILON){const A=Math.sqrt(g),E=Math.atan2(A,d*v);p=Math.sin(p*E)/A,a=Math.sin(a*E)/A}const S=a*v;if(l=l*p+f*S,u=u*p+m*S,c=c*p+_*S,h=h*p+x*S,p===1-a){const A=1/Math.sqrt(l*l+u*u+c*c+h*h);l*=A,u*=A,c*=A,h*=A}}e[n]=l,e[n+1]=u,e[n+2]=c,e[n+3]=h}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],u=i[r+2],c=i[r+3],h=s[o],f=s[o+1],m=s[o+2],_=s[o+3];return e[n]=a*_+c*h+l*m-u*f,e[n+1]=l*_+c*f+u*h-a*m,e[n+2]=u*_+c*m+a*f-l*h,e[n+3]=c*_-a*h-l*f-u*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,u=a(i/2),c=a(r/2),h=a(s/2),f=l(i/2),m=l(r/2),_=l(s/2);switch(o){case"XYZ":this._x=f*c*h+u*m*_,this._y=u*m*h-f*c*_,this._z=u*c*_+f*m*h,this._w=u*c*h-f*m*_;break;case"YXZ":this._x=f*c*h+u*m*_,this._y=u*m*h-f*c*_,this._z=u*c*_-f*m*h,this._w=u*c*h+f*m*_;break;case"ZXY":this._x=f*c*h-u*m*_,this._y=u*m*h+f*c*_,this._z=u*c*_+f*m*h,this._w=u*c*h-f*m*_;break;case"ZYX":this._x=f*c*h-u*m*_,this._y=u*m*h+f*c*_,this._z=u*c*_-f*m*h,this._w=u*c*h+f*m*_;break;case"YZX":this._x=f*c*h+u*m*_,this._y=u*m*h+f*c*_,this._z=u*c*_-f*m*h,this._w=u*c*h-f*m*_;break;case"XZY":this._x=f*c*h-u*m*_,this._y=u*m*h-f*c*_,this._z=u*c*_+f*m*h,this._w=u*c*h+f*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],u=n[2],c=n[6],h=n[10],f=i+a+h;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(c-l)*m,this._y=(s-u)*m,this._z=(o-r)*m}else if(i>a&&i>h){const m=2*Math.sqrt(1+i-a-h);this._w=(c-l)/m,this._x=.25*m,this._y=(r+o)/m,this._z=(s+u)/m}else if(a>h){const m=2*Math.sqrt(1+a-i-h);this._w=(s-u)/m,this._x=(r+o)/m,this._y=.25*m,this._z=(l+c)/m}else{const m=2*Math.sqrt(1+h-i-a);this._w=(o-r)/m,this._x=(s+u)/m,this._y=(l+c)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(fn(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,u=n._z,c=n._w;return this._x=i*c+o*a+r*u-s*l,this._y=r*c+o*l+s*a-i*u,this._z=s*c+o*u+i*l-r*a,this._w=o*c-i*a-r*l-s*u,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const m=1-n;return this._w=m*o+n*this._w,this._x=m*i+n*this._x,this._y=m*r+n*this._y,this._z=m*s+n*this._z,this.normalize(),this._onChangeCallback(),this}const u=Math.sqrt(l),c=Math.atan2(u,a),h=Math.sin((1-n)*c)/u,f=Math.sin(n*c)/u;return this._w=o*h+this._w*f,this._x=i*h+this._x*f,this._y=r*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=Math.random(),n=Math.sqrt(1-e),i=Math.sqrt(e),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(n*Math.cos(r),i*Math.sin(s),i*Math.cos(s),n*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class j{constructor(e=0,n=0,i=0){j.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Eg.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Eg.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,u=2*(o*r-a*i),c=2*(a*n-s*r),h=2*(s*i-o*n);return this.x=n+l*u+o*h-a*c,this.y=i+l*c+a*u-s*h,this.z=r+l*h+s*c-o*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ud.copy(this).projectOnVector(e),this.sub(ud)}reflect(e){return this.sub(ud.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(fn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,n=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(n),this.y=i*Math.sin(n),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ud=new j,Eg=new Xa;class Ya{constructor(e=new j(1/0,1/0,1/0),n=new j(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Gn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Gn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Gn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Gn):Gn.fromBufferAttribute(s,o),Gn.applyMatrix4(e.matrixWorld),this.expandByPoint(Gn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),_l.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),_l.copy(i.boundingBox)),_l.applyMatrix4(e.matrixWorld),this.union(_l)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Gn),Gn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Fo),yl.subVectors(this.max,Fo),ls.subVectors(e.a,Fo),us.subVectors(e.b,Fo),cs.subVectors(e.c,Fo),zi.subVectors(us,ls),Bi.subVectors(cs,us),wr.subVectors(ls,cs);let n=[0,-zi.z,zi.y,0,-Bi.z,Bi.y,0,-wr.z,wr.y,zi.z,0,-zi.x,Bi.z,0,-Bi.x,wr.z,0,-wr.x,-zi.y,zi.x,0,-Bi.y,Bi.x,0,-wr.y,wr.x,0];return!cd(n,ls,us,cs,yl)||(n=[1,0,0,0,1,0,0,0,1],!cd(n,ls,us,cs,yl))?!1:(xl.crossVectors(zi,Bi),n=[xl.x,xl.y,xl.z],cd(n,ls,us,cs,yl))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Gn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Gn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(pi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const pi=[new j,new j,new j,new j,new j,new j,new j,new j],Gn=new j,_l=new Ya,ls=new j,us=new j,cs=new j,zi=new j,Bi=new j,wr=new j,Fo=new j,yl=new j,xl=new j,Tr=new j;function cd(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){Tr.fromArray(t,s);const a=r.x*Math.abs(Tr.x)+r.y*Math.abs(Tr.y)+r.z*Math.abs(Tr.z),l=e.dot(Tr),u=n.dot(Tr),c=i.dot(Tr);if(Math.max(-Math.max(l,u,c),Math.min(l,u,c))>a)return!1}return!0}const OE=new Ya,ko=new j,dd=new j;class qh{constructor(e=new j,n=-1){this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):OE.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ko.subVectors(e,this.center);const n=ko.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ko,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(dd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ko.copy(e.center).add(dd)),this.expandByPoint(ko.copy(e.center).sub(dd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const mi=new j,fd=new j,Sl=new j,Hi=new j,hd=new j,Ml=new j,pd=new j;class FE{constructor(e=new j,n=new j(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=mi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(mi.copy(this.origin).addScaledVector(this.direction,n),mi.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){fd.copy(e).add(n).multiplyScalar(.5),Sl.copy(n).sub(e).normalize(),Hi.copy(this.origin).sub(fd);const s=e.distanceTo(n)*.5,o=-this.direction.dot(Sl),a=Hi.dot(this.direction),l=-Hi.dot(Sl),u=Hi.lengthSq(),c=Math.abs(1-o*o);let h,f,m,_;if(c>0)if(h=o*l-a,f=o*a-l,_=s*c,h>=0)if(f>=-_)if(f<=_){const x=1/c;h*=x,f*=x,m=h*(h+o*f+2*a)+f*(o*h+f+2*l)+u}else f=s,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+u;else f=-s,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+u;else f<=-_?(h=Math.max(0,-(-o*s+a)),f=h>0?-s:Math.min(Math.max(-s,-l),s),m=-h*h+f*(f+2*l)+u):f<=_?(h=0,f=Math.min(Math.max(-s,-l),s),m=f*(f+2*l)+u):(h=Math.max(0,-(o*s+a)),f=h>0?s:Math.min(Math.max(-s,-l),s),m=-h*h+f*(f+2*l)+u);else f=o>0?-s:s,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+u;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(fd).addScaledVector(Sl,f),m}intersectSphere(e,n){mi.subVectors(e.center,this.origin);const i=mi.dot(this.direction),r=mi.dot(mi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const u=1/this.direction.x,c=1/this.direction.y,h=1/this.direction.z,f=this.origin;return u>=0?(i=(e.min.x-f.x)*u,r=(e.max.x-f.x)*u):(i=(e.max.x-f.x)*u,r=(e.min.x-f.x)*u),c>=0?(s=(e.min.y-f.y)*c,o=(e.max.y-f.y)*c):(s=(e.max.y-f.y)*c,o=(e.min.y-f.y)*c),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,mi)!==null}intersectTriangle(e,n,i,r,s){hd.subVectors(n,e),Ml.subVectors(i,e),pd.crossVectors(hd,Ml);let o=this.direction.dot(pd),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Hi.subVectors(this.origin,e);const l=a*this.direction.dot(Ml.crossVectors(Hi,Ml));if(l<0)return null;const u=a*this.direction.dot(hd.cross(Hi));if(u<0||l+u>o)return null;const c=-a*Hi.dot(pd);return c<0?null:this.at(c/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Pt{constructor(e,n,i,r,s,o,a,l,u,c,h,f,m,_,x,p){Pt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,u,c,h,f,m,_,x,p)}set(e,n,i,r,s,o,a,l,u,c,h,f,m,_,x,p){const d=this.elements;return d[0]=e,d[4]=n,d[8]=i,d[12]=r,d[1]=s,d[5]=o,d[9]=a,d[13]=l,d[2]=u,d[6]=c,d[10]=h,d[14]=f,d[3]=m,d[7]=_,d[11]=x,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Pt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/ds.setFromMatrixColumn(e,0).length(),s=1/ds.setFromMatrixColumn(e,1).length(),o=1/ds.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),u=Math.sin(r),c=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=o*c,m=o*h,_=a*c,x=a*h;n[0]=l*c,n[4]=-l*h,n[8]=u,n[1]=m+_*u,n[5]=f-x*u,n[9]=-a*l,n[2]=x-f*u,n[6]=_+m*u,n[10]=o*l}else if(e.order==="YXZ"){const f=l*c,m=l*h,_=u*c,x=u*h;n[0]=f+x*a,n[4]=_*a-m,n[8]=o*u,n[1]=o*h,n[5]=o*c,n[9]=-a,n[2]=m*a-_,n[6]=x+f*a,n[10]=o*l}else if(e.order==="ZXY"){const f=l*c,m=l*h,_=u*c,x=u*h;n[0]=f-x*a,n[4]=-o*h,n[8]=_+m*a,n[1]=m+_*a,n[5]=o*c,n[9]=x-f*a,n[2]=-o*u,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const f=o*c,m=o*h,_=a*c,x=a*h;n[0]=l*c,n[4]=_*u-m,n[8]=f*u+x,n[1]=l*h,n[5]=x*u+f,n[9]=m*u-_,n[2]=-u,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const f=o*l,m=o*u,_=a*l,x=a*u;n[0]=l*c,n[4]=x-f*h,n[8]=_*h+m,n[1]=h,n[5]=o*c,n[9]=-a*c,n[2]=-u*c,n[6]=m*h+_,n[10]=f-x*h}else if(e.order==="XZY"){const f=o*l,m=o*u,_=a*l,x=a*u;n[0]=l*c,n[4]=-h,n[8]=u*c,n[1]=f*h+x,n[5]=o*c,n[9]=m*h-_,n[2]=_*h-m,n[6]=a*c,n[10]=x*h+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(kE,e,zE)}lookAt(e,n,i){const r=this.elements;return Sn.subVectors(e,n),Sn.lengthSq()===0&&(Sn.z=1),Sn.normalize(),Vi.crossVectors(i,Sn),Vi.lengthSq()===0&&(Math.abs(i.z)===1?Sn.x+=1e-4:Sn.z+=1e-4,Sn.normalize(),Vi.crossVectors(i,Sn)),Vi.normalize(),El.crossVectors(Sn,Vi),r[0]=Vi.x,r[4]=El.x,r[8]=Sn.x,r[1]=Vi.y,r[5]=El.y,r[9]=Sn.y,r[2]=Vi.z,r[6]=El.z,r[10]=Sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],u=i[12],c=i[1],h=i[5],f=i[9],m=i[13],_=i[2],x=i[6],p=i[10],d=i[14],v=i[3],g=i[7],S=i[11],A=i[15],E=r[0],M=r[4],b=r[8],y=r[12],w=r[1],N=r[5],O=r[9],V=r[13],P=r[2],D=r[6],X=r[10],k=r[14],F=r[3],z=r[7],W=r[11],U=r[15];return s[0]=o*E+a*w+l*P+u*F,s[4]=o*M+a*N+l*D+u*z,s[8]=o*b+a*O+l*X+u*W,s[12]=o*y+a*V+l*k+u*U,s[1]=c*E+h*w+f*P+m*F,s[5]=c*M+h*N+f*D+m*z,s[9]=c*b+h*O+f*X+m*W,s[13]=c*y+h*V+f*k+m*U,s[2]=_*E+x*w+p*P+d*F,s[6]=_*M+x*N+p*D+d*z,s[10]=_*b+x*O+p*X+d*W,s[14]=_*y+x*V+p*k+d*U,s[3]=v*E+g*w+S*P+A*F,s[7]=v*M+g*N+S*D+A*z,s[11]=v*b+g*O+S*X+A*W,s[15]=v*y+g*V+S*k+A*U,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],u=e[13],c=e[2],h=e[6],f=e[10],m=e[14],_=e[3],x=e[7],p=e[11],d=e[15];return _*(+s*l*h-r*u*h-s*a*f+i*u*f+r*a*m-i*l*m)+x*(+n*l*m-n*u*f+s*o*f-r*o*m+r*u*c-s*l*c)+p*(+n*u*h-n*a*m-s*o*h+i*o*m+s*a*c-i*u*c)+d*(-r*a*c-n*l*h+n*a*f+r*o*h-i*o*f+i*l*c)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],u=e[7],c=e[8],h=e[9],f=e[10],m=e[11],_=e[12],x=e[13],p=e[14],d=e[15],v=h*p*u-x*f*u+x*l*m-a*p*m-h*l*d+a*f*d,g=_*f*u-c*p*u-_*l*m+o*p*m+c*l*d-o*f*d,S=c*x*u-_*h*u+_*a*m-o*x*m-c*a*d+o*h*d,A=_*h*l-c*x*l-_*a*f+o*x*f+c*a*p-o*h*p,E=n*v+i*g+r*S+s*A;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const M=1/E;return e[0]=v*M,e[1]=(x*f*s-h*p*s-x*r*m+i*p*m+h*r*d-i*f*d)*M,e[2]=(a*p*s-x*l*s+x*r*u-i*p*u-a*r*d+i*l*d)*M,e[3]=(h*l*s-a*f*s-h*r*u+i*f*u+a*r*m-i*l*m)*M,e[4]=g*M,e[5]=(c*p*s-_*f*s+_*r*m-n*p*m-c*r*d+n*f*d)*M,e[6]=(_*l*s-o*p*s-_*r*u+n*p*u+o*r*d-n*l*d)*M,e[7]=(o*f*s-c*l*s+c*r*u-n*f*u-o*r*m+n*l*m)*M,e[8]=S*M,e[9]=(_*h*s-c*x*s-_*i*m+n*x*m+c*i*d-n*h*d)*M,e[10]=(o*x*s-_*a*s+_*i*u-n*x*u-o*i*d+n*a*d)*M,e[11]=(c*a*s-o*h*s-c*i*u+n*h*u+o*i*m-n*a*m)*M,e[12]=A*M,e[13]=(c*x*r-_*h*r+_*i*f-n*x*f-c*i*p+n*h*p)*M,e[14]=(_*a*r-o*x*r-_*i*l+n*x*l+o*i*p-n*a*p)*M,e[15]=(o*h*r-c*a*r+c*i*l-n*h*l-o*i*f+n*a*f)*M,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,u=s*o,c=s*a;return this.set(u*o+i,u*a-r*l,u*l+r*a,0,u*a+r*l,c*a+i,c*l-r*o,0,u*l-r*a,c*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,u=s+s,c=o+o,h=a+a,f=s*u,m=s*c,_=s*h,x=o*c,p=o*h,d=a*h,v=l*u,g=l*c,S=l*h,A=i.x,E=i.y,M=i.z;return r[0]=(1-(x+d))*A,r[1]=(m+S)*A,r[2]=(_-g)*A,r[3]=0,r[4]=(m-S)*E,r[5]=(1-(f+d))*E,r[6]=(p+v)*E,r[7]=0,r[8]=(_+g)*M,r[9]=(p-v)*M,r[10]=(1-(f+x))*M,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=ds.set(r[0],r[1],r[2]).length();const o=ds.set(r[4],r[5],r[6]).length(),a=ds.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Wn.copy(this);const u=1/s,c=1/o,h=1/a;return Wn.elements[0]*=u,Wn.elements[1]*=u,Wn.elements[2]*=u,Wn.elements[4]*=c,Wn.elements[5]*=c,Wn.elements[6]*=c,Wn.elements[8]*=h,Wn.elements[9]*=h,Wn.elements[10]*=h,n.setFromRotationMatrix(Wn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,n,i,r,s,o,a=Ci){const l=this.elements,u=2*s/(n-e),c=2*s/(i-r),h=(n+e)/(n-e),f=(i+r)/(i-r);let m,_;if(a===Ci)m=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Ou)m=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=c,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=Ci){const l=this.elements,u=1/(n-e),c=1/(i-r),h=1/(o-s),f=(n+e)*u,m=(i+r)*c;let _,x;if(a===Ci)_=(o+s)*h,x=-2*h;else if(a===Ou)_=s*h,x=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*u,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*c,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=x,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const ds=new j,Wn=new Pt,kE=new j(0,0,0),zE=new j(1,1,1),Vi=new j,El=new j,Sn=new j,wg=new Pt,Tg=new Xa;class cc{constructor(e=0,n=0,i=0,r=cc.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],u=r[5],c=r[9],h=r[2],f=r[6],m=r[10];switch(n){case"XYZ":this._y=Math.asin(fn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-c,m),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,u),this._z=0);break;case"YXZ":this._x=Math.asin(-fn(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,u)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(fn(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-o,u)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-fn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,u));break;case"YZX":this._z=Math.asin(fn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-c,u),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-fn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,u),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-c,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return wg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(wg,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Tg.setFromEuler(this),this.setFromQuaternion(Tg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}cc.DEFAULT_ORDER="XYZ";class G0{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let BE=0;const Ag=new j,fs=new Xa,gi=new Pt,wl=new j,zo=new j,HE=new j,VE=new Xa,Cg=new j(1,0,0),Rg=new j(0,1,0),bg=new j(0,0,1),GE={type:"added"},WE={type:"removed"};class Gt extends wo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:BE++}),this.uuid=ja(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Gt.DEFAULT_UP.clone();const e=new j,n=new cc,i=new Xa,r=new j(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Pt},normalMatrix:{value:new Xe}}),this.matrix=new Pt,this.matrixWorld=new Pt,this.matrixAutoUpdate=Gt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=Gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new G0,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return fs.setFromAxisAngle(e,n),this.quaternion.multiply(fs),this}rotateOnWorldAxis(e,n){return fs.setFromAxisAngle(e,n),this.quaternion.premultiply(fs),this}rotateX(e){return this.rotateOnAxis(Cg,e)}rotateY(e){return this.rotateOnAxis(Rg,e)}rotateZ(e){return this.rotateOnAxis(bg,e)}translateOnAxis(e,n){return Ag.copy(e).applyQuaternion(this.quaternion),this.position.add(Ag.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Cg,e)}translateY(e){return this.translateOnAxis(Rg,e)}translateZ(e){return this.translateOnAxis(bg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(gi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?wl.copy(e):wl.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),zo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gi.lookAt(zo,wl,this.up):gi.lookAt(wl,zo,this.up),this.quaternion.setFromRotationMatrix(gi),r&&(gi.extractRotation(r.matrixWorld),fs.setFromRotationMatrix(gi),this.quaternion.premultiply(fs.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(GE)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(WE)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),gi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),gi.multiply(e.parent.matrixWorld)),e.applyMatrix4(gi),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n){let i=[];this[e]===n&&i.push(this);for(let r=0,s=this.children.length;r<s;r++){const o=this.children[r].getObjectsByProperty(e,n);o.length>0&&(i=i.concat(o))}return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zo,e,HE),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zo,VE,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++){const s=n[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++){const a=r[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let u=0,c=l.length;u<c;u++){const h=l[u];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,u=this.material.length;l<u;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),u=o(e.textures),c=o(e.images),h=o(e.shapes),f=o(e.skeletons),m=o(e.animations),_=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),u.length>0&&(i.textures=u),c.length>0&&(i.images=c),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=r,i;function o(a){const l=[];for(const u in a){const c=a[u];delete c.metadata,l.push(c)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Gt.DEFAULT_UP=new j(0,1,0);Gt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const jn=new j,vi=new j,md=new j,_i=new j,hs=new j,ps=new j,Lg=new j,gd=new j,vd=new j,_d=new j;let Tl=!1;class $n{constructor(e=new j,n=new j,i=new j){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),jn.subVectors(e,n),r.cross(jn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){jn.subVectors(r,n),vi.subVectors(i,n),md.subVectors(e,n);const o=jn.dot(jn),a=jn.dot(vi),l=jn.dot(md),u=vi.dot(vi),c=vi.dot(md),h=o*u-a*a;if(h===0)return s.set(-2,-1,-1);const f=1/h,m=(u*l-a*c)*f,_=(o*c-a*l)*f;return s.set(1-m-_,_,m)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,_i),_i.x>=0&&_i.y>=0&&_i.x+_i.y<=1}static getUV(e,n,i,r,s,o,a,l){return Tl===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Tl=!0),this.getInterpolation(e,n,i,r,s,o,a,l)}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,_i),l.setScalar(0),l.addScaledVector(s,_i.x),l.addScaledVector(o,_i.y),l.addScaledVector(a,_i.z),l}static isFrontFacing(e,n,i,r){return jn.subVectors(i,n),vi.subVectors(e,n),jn.cross(vi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return jn.subVectors(this.c,this.b),vi.subVectors(this.a,this.b),jn.cross(vi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return $n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return $n.getBarycoord(e,this.a,this.b,this.c,n)}getUV(e,n,i,r,s){return Tl===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Tl=!0),$n.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}getInterpolation(e,n,i,r,s){return $n.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return $n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return $n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;hs.subVectors(r,i),ps.subVectors(s,i),gd.subVectors(e,i);const l=hs.dot(gd),u=ps.dot(gd);if(l<=0&&u<=0)return n.copy(i);vd.subVectors(e,r);const c=hs.dot(vd),h=ps.dot(vd);if(c>=0&&h<=c)return n.copy(r);const f=l*h-c*u;if(f<=0&&l>=0&&c<=0)return o=l/(l-c),n.copy(i).addScaledVector(hs,o);_d.subVectors(e,s);const m=hs.dot(_d),_=ps.dot(_d);if(_>=0&&m<=_)return n.copy(s);const x=m*u-l*_;if(x<=0&&u>=0&&_<=0)return a=u/(u-_),n.copy(i).addScaledVector(ps,a);const p=c*_-m*h;if(p<=0&&h-c>=0&&m-_>=0)return Lg.subVectors(s,r),a=(h-c)/(h-c+(m-_)),n.copy(r).addScaledVector(Lg,a);const d=1/(p+x+f);return o=x*d,a=f*d,n.copy(i).addScaledVector(hs,o).addScaledVector(ps,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const W0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gi={h:0,s:0,l:0},Al={h:0,s:0,l:0};function yd(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Qe{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=at){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,st.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=st.workingColorSpace){return this.r=e,this.g=n,this.b=i,st.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=st.workingColorSpace){if(e=bE(e,1),n=fn(n,0,1),i=fn(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=yd(o,s,e+1/3),this.g=yd(o,s,e),this.b=yd(o,s,e-1/3)}return st.toWorkingColorSpace(this,r),this}setStyle(e,n=at){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=at){const i=W0[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ks(e.r),this.g=Ks(e.g),this.b=Ks(e.b),this}copyLinearToSRGB(e){return this.r=ad(e.r),this.g=ad(e.g),this.b=ad(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=at){return st.fromWorkingColorSpace(Kt.copy(this),e),Math.round(fn(Kt.r*255,0,255))*65536+Math.round(fn(Kt.g*255,0,255))*256+Math.round(fn(Kt.b*255,0,255))}getHexString(e=at){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=st.workingColorSpace){st.fromWorkingColorSpace(Kt.copy(this),n);const i=Kt.r,r=Kt.g,s=Kt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,u;const c=(a+o)/2;if(a===o)l=0,u=0;else{const h=o-a;switch(u=c<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=u,e.l=c,e}getRGB(e,n=st.workingColorSpace){return st.fromWorkingColorSpace(Kt.copy(this),n),e.r=Kt.r,e.g=Kt.g,e.b=Kt.b,e}getStyle(e=at){st.fromWorkingColorSpace(Kt.copy(this),e);const n=Kt.r,i=Kt.g,r=Kt.b;return e!==at?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Gi),this.setHSL(Gi.h+e,Gi.s+n,Gi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Gi),e.getHSL(Al);const i=sd(Gi.h,Al.h,n),r=sd(Gi.s,Al.s,n),s=sd(Gi.l,Al.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Kt=new Qe;Qe.NAMES=W0;let jE=0;class qa extends wo{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jE++}),this.uuid=ja(),this.name="",this.type="Material",this.blending=$s,this.side=vr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Tf,this.blendDst=Af,this.blendEquation=Dr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qe(0,0,0),this.blendAlpha=0,this.depthFunc=Pu,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gg,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=os,this.stencilZFail=os,this.stencilZPass=os,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==$s&&(i.blending=this.blending),this.side!==vr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Tf&&(i.blendSrc=this.blendSrc),this.blendDst!==Af&&(i.blendDst=this.blendDst),this.blendEquation!==Dr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Pu&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==gg&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==os&&(i.stencilFail=this.stencilFail),this.stencilZFail!==os&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==os&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class j0 extends qa{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=b0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new j,Cl=new nt;class Jn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=vg,this.updateRange={offset:0,count:-1},this.gpuType=tr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Cl.fromBufferAttribute(this,n),Cl.applyMatrix3(e),this.setXY(n,Cl.x,Cl.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyMatrix3(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyMatrix4(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyNormalMatrix(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.transformDirection(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Oo(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=cn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Oo(n,this.array)),n}setX(e,n){return this.normalized&&(n=cn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Oo(n,this.array)),n}setY(e,n){return this.normalized&&(n=cn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Oo(n,this.array)),n}setZ(e,n){return this.normalized&&(n=cn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Oo(n,this.array)),n}setW(e,n){return this.normalized&&(n=cn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=cn(n,this.array),i=cn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=cn(n,this.array),i=cn(i,this.array),r=cn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=cn(n,this.array),i=cn(i,this.array),r=cn(r,this.array),s=cn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vg&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}}class X0 extends Jn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Y0 extends Jn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Cn extends Jn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let XE=0;const Un=new Pt,xd=new Gt,ms=new j,Mn=new Ya,Bo=new Ya,Ot=new j;class Fi extends wo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:XE++}),this.uuid=ja(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(z0(e)?Y0:X0)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Xe().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Un.makeRotationFromQuaternion(e),this.applyMatrix4(Un),this}rotateX(e){return Un.makeRotationX(e),this.applyMatrix4(Un),this}rotateY(e){return Un.makeRotationY(e),this.applyMatrix4(Un),this}rotateZ(e){return Un.makeRotationZ(e),this.applyMatrix4(Un),this}translate(e,n,i){return Un.makeTranslation(e,n,i),this.applyMatrix4(Un),this}scale(e,n,i){return Un.makeScale(e,n,i),this.applyMatrix4(Un),this}lookAt(e){return xd.lookAt(e),xd.updateMatrix(),this.applyMatrix4(xd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ms).negate(),this.translate(ms.x,ms.y,ms.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Cn(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ya);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new j(-1/0,-1/0,-1/0),new j(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];Mn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ot.addVectors(this.boundingBox.min,Mn.min),this.boundingBox.expandByPoint(Ot),Ot.addVectors(this.boundingBox.max,Mn.max),this.boundingBox.expandByPoint(Ot)):(this.boundingBox.expandByPoint(Mn.min),this.boundingBox.expandByPoint(Mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qh);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new j,1/0);return}if(e){const i=this.boundingSphere.center;if(Mn.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];Bo.setFromBufferAttribute(a),this.morphTargetsRelative?(Ot.addVectors(Mn.min,Bo.min),Mn.expandByPoint(Ot),Ot.addVectors(Mn.max,Bo.max),Mn.expandByPoint(Ot)):(Mn.expandByPoint(Bo.min),Mn.expandByPoint(Bo.max))}Mn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Ot.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ot));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let u=0,c=a.count;u<c;u++)Ot.fromBufferAttribute(a,u),l&&(ms.fromBufferAttribute(e,u),Ot.add(ms)),r=Math.max(r,i.distanceToSquared(Ot))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,r=n.position.array,s=n.normal.array,o=n.uv.array,a=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Jn(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,u=[],c=[];for(let w=0;w<a;w++)u[w]=new j,c[w]=new j;const h=new j,f=new j,m=new j,_=new nt,x=new nt,p=new nt,d=new j,v=new j;function g(w,N,O){h.fromArray(r,w*3),f.fromArray(r,N*3),m.fromArray(r,O*3),_.fromArray(o,w*2),x.fromArray(o,N*2),p.fromArray(o,O*2),f.sub(h),m.sub(h),x.sub(_),p.sub(_);const V=1/(x.x*p.y-p.x*x.y);isFinite(V)&&(d.copy(f).multiplyScalar(p.y).addScaledVector(m,-x.y).multiplyScalar(V),v.copy(m).multiplyScalar(x.x).addScaledVector(f,-p.x).multiplyScalar(V),u[w].add(d),u[N].add(d),u[O].add(d),c[w].add(v),c[N].add(v),c[O].add(v))}let S=this.groups;S.length===0&&(S=[{start:0,count:i.length}]);for(let w=0,N=S.length;w<N;++w){const O=S[w],V=O.start,P=O.count;for(let D=V,X=V+P;D<X;D+=3)g(i[D+0],i[D+1],i[D+2])}const A=new j,E=new j,M=new j,b=new j;function y(w){M.fromArray(s,w*3),b.copy(M);const N=u[w];A.copy(N),A.sub(M.multiplyScalar(M.dot(N))).normalize(),E.crossVectors(b,N);const V=E.dot(c[w])<0?-1:1;l[w*4]=A.x,l[w*4+1]=A.y,l[w*4+2]=A.z,l[w*4+3]=V}for(let w=0,N=S.length;w<N;++w){const O=S[w],V=O.start,P=O.count;for(let D=V,X=V+P;D<X;D+=3)y(i[D+0]),y(i[D+1]),y(i[D+2])}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Jn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,m=i.count;f<m;f++)i.setXYZ(f,0,0,0);const r=new j,s=new j,o=new j,a=new j,l=new j,u=new j,c=new j,h=new j;if(e)for(let f=0,m=e.count;f<m;f+=3){const _=e.getX(f+0),x=e.getX(f+1),p=e.getX(f+2);r.fromBufferAttribute(n,_),s.fromBufferAttribute(n,x),o.fromBufferAttribute(n,p),c.subVectors(o,s),h.subVectors(r,s),c.cross(h),a.fromBufferAttribute(i,_),l.fromBufferAttribute(i,x),u.fromBufferAttribute(i,p),a.add(c),l.add(c),u.add(c),i.setXYZ(_,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(p,u.x,u.y,u.z)}else for(let f=0,m=n.count;f<m;f+=3)r.fromBufferAttribute(n,f+0),s.fromBufferAttribute(n,f+1),o.fromBufferAttribute(n,f+2),c.subVectors(o,s),h.subVectors(r,s),c.cross(h),i.setXYZ(f+0,c.x,c.y,c.z),i.setXYZ(f+1,c.x,c.y,c.z),i.setXYZ(f+2,c.x,c.y,c.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Ot.fromBufferAttribute(e,n),Ot.normalize(),e.setXYZ(n,Ot.x,Ot.y,Ot.z)}toNonIndexed(){function e(a,l){const u=a.array,c=a.itemSize,h=a.normalized,f=new u.constructor(l.length*c);let m=0,_=0;for(let x=0,p=l.length;x<p;x++){a.isInterleavedBufferAttribute?m=l[x]*a.data.stride+a.offset:m=l[x]*c;for(let d=0;d<c;d++)f[_++]=u[m++]}return new Jn(f,c,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Fi,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],u=e(l,i);n.setAttribute(a,u)}const s=this.morphAttributes;for(const a in s){const l=[],u=s[a];for(let c=0,h=u.length;c<h;c++){const f=u[c],m=e(f,i);l.push(m)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const u=o[a];n.addGroup(u.start,u.count,u.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const u in l)l[u]!==void 0&&(e[u]=l[u]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const u=i[l];e.data.attributes[l]=u.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const u=this.morphAttributes[l],c=[];for(let h=0,f=u.length;h<f;h++){const m=u[h];c.push(m.toJSON(e.data))}c.length>0&&(r[l]=c,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const u in r){const c=r[u];this.setAttribute(u,c.clone(n))}const s=e.morphAttributes;for(const u in s){const c=[],h=s[u];for(let f=0,m=h.length;f<m;f++)c.push(h[f].clone(n));this.morphAttributes[u]=c}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let u=0,c=o.length;u<c;u++){const h=o[u];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Pg=new Pt,Ar=new FE,Rl=new qh,Ug=new j,gs=new j,vs=new j,_s=new j,Sd=new j,bl=new j,Ll=new nt,Pl=new nt,Ul=new nt,Ng=new j,Dg=new j,Ig=new j,Nl=new j,Dl=new j;class kn extends Gt{constructor(e=new Fi,n=new j0){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){bl.set(0,0,0);for(let l=0,u=s.length;l<u;l++){const c=a[l],h=s[l];c!==0&&(Sd.fromBufferAttribute(h,e),o?bl.addScaledVector(Sd,c):bl.addScaledVector(Sd.sub(n),c))}n.add(bl)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Rl.copy(i.boundingSphere),Rl.applyMatrix4(s),Ar.copy(e.ray).recast(e.near),!(Rl.containsPoint(Ar.origin)===!1&&(Ar.intersectSphere(Rl,Ug)===null||Ar.origin.distanceToSquared(Ug)>(e.far-e.near)**2))&&(Pg.copy(s).invert(),Ar.copy(e.ray).applyMatrix4(Pg),!(i.boundingBox!==null&&Ar.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Ar)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,u=s.attributes.uv,c=s.attributes.uv1,h=s.attributes.normal,f=s.groups,m=s.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,x=f.length;_<x;_++){const p=f[_],d=o[p.materialIndex],v=Math.max(p.start,m.start),g=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let S=v,A=g;S<A;S+=3){const E=a.getX(S),M=a.getX(S+1),b=a.getX(S+2);r=Il(this,d,e,i,u,c,h,E,M,b),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=p.materialIndex,n.push(r))}}else{const _=Math.max(0,m.start),x=Math.min(a.count,m.start+m.count);for(let p=_,d=x;p<d;p+=3){const v=a.getX(p),g=a.getX(p+1),S=a.getX(p+2);r=Il(this,o,e,i,u,c,h,v,g,S),r&&(r.faceIndex=Math.floor(p/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,x=f.length;_<x;_++){const p=f[_],d=o[p.materialIndex],v=Math.max(p.start,m.start),g=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let S=v,A=g;S<A;S+=3){const E=S,M=S+1,b=S+2;r=Il(this,d,e,i,u,c,h,E,M,b),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=p.materialIndex,n.push(r))}}else{const _=Math.max(0,m.start),x=Math.min(l.count,m.start+m.count);for(let p=_,d=x;p<d;p+=3){const v=p,g=p+1,S=p+2;r=Il(this,o,e,i,u,c,h,v,g,S),r&&(r.faceIndex=Math.floor(p/3),n.push(r))}}}}function YE(t,e,n,i,r,s,o,a){let l;if(e.side===_n?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===vr,a),l===null)return null;Dl.copy(a),Dl.applyMatrix4(t.matrixWorld);const u=n.ray.origin.distanceTo(Dl);return u<n.near||u>n.far?null:{distance:u,point:Dl.clone(),object:t}}function Il(t,e,n,i,r,s,o,a,l,u){t.getVertexPosition(a,gs),t.getVertexPosition(l,vs),t.getVertexPosition(u,_s);const c=YE(t,e,n,i,gs,vs,_s,Nl);if(c){r&&(Ll.fromBufferAttribute(r,a),Pl.fromBufferAttribute(r,l),Ul.fromBufferAttribute(r,u),c.uv=$n.getInterpolation(Nl,gs,vs,_s,Ll,Pl,Ul,new nt)),s&&(Ll.fromBufferAttribute(s,a),Pl.fromBufferAttribute(s,l),Ul.fromBufferAttribute(s,u),c.uv1=$n.getInterpolation(Nl,gs,vs,_s,Ll,Pl,Ul,new nt),c.uv2=c.uv1),o&&(Ng.fromBufferAttribute(o,a),Dg.fromBufferAttribute(o,l),Ig.fromBufferAttribute(o,u),c.normal=$n.getInterpolation(Nl,gs,vs,_s,Ng,Dg,Ig,new j),c.normal.dot(i.direction)>0&&c.normal.multiplyScalar(-1));const h={a,b:l,c:u,normal:new j,materialIndex:0};$n.getNormal(gs,vs,_s,h.normal),c.face=h}return c}class $a extends Fi{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],u=[],c=[],h=[];let f=0,m=0;_("z","y","x",-1,-1,i,n,e,o,s,0),_("z","y","x",1,-1,i,n,-e,o,s,1),_("x","z","y",1,1,e,i,n,r,o,2),_("x","z","y",1,-1,e,i,-n,r,o,3),_("x","y","z",1,-1,e,n,i,r,s,4),_("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Cn(u,3)),this.setAttribute("normal",new Cn(c,3)),this.setAttribute("uv",new Cn(h,2));function _(x,p,d,v,g,S,A,E,M,b,y){const w=S/M,N=A/b,O=S/2,V=A/2,P=E/2,D=M+1,X=b+1;let k=0,F=0;const z=new j;for(let W=0;W<X;W++){const U=W*N-V;for(let G=0;G<D;G++){const ie=G*w-O;z[x]=ie*v,z[p]=U*g,z[d]=P,u.push(z.x,z.y,z.z),z[x]=0,z[p]=0,z[d]=E>0?1:-1,c.push(z.x,z.y,z.z),h.push(G/M),h.push(1-W/b),k+=1}}for(let W=0;W<b;W++)for(let U=0;U<M;U++){const G=f+U+D*W,ie=f+U+D*(W+1),ee=f+(U+1)+D*(W+1),J=f+(U+1)+D*W;l.push(G,ie,J),l.push(ie,ee,J),F+=6}a.addGroup(m,F,y),m+=F,f+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $a(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function go(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function nn(t){const e={};for(let n=0;n<t.length;n++){const i=go(t[n]);for(const r in i)e[r]=i[r]}return e}function qE(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function q0(t){return t.getRenderTarget()===null?t.outputColorSpace:st.workingColorSpace}const $E={clone:go,merge:nn};var KE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ZE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ns extends qa{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=KE,this.fragmentShader=ZE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=go(e.uniforms),this.uniformsGroups=qE(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class $0 extends Gt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Pt,this.projectionMatrix=new Pt,this.projectionMatrixInverse=new Pt,this.coordinateSystem=Ci}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class In extends $0{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Pf*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(rd*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Pf*2*Math.atan(Math.tan(rd*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(rd*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,u=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/u,r*=o.width/l,i*=o.height/u}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const ys=-90,xs=1;class QE extends Gt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new In(ys,xs,e,n);r.layers=this.layers,this.add(r);const s=new In(ys,xs,e,n);s.layers=this.layers,this.add(s);const o=new In(ys,xs,e,n);o.layers=this.layers,this.add(o);const a=new In(ys,xs,e,n);a.layers=this.layers,this.add(a);const l=new In(ys,xs,e,n);l.layers=this.layers,this.add(l);const u=new In(ys,xs,e,n);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const u of n)this.remove(u);if(e===Ci)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ou)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const u of n)this.add(u),u.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,u,c]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,o),e.setRenderTarget(i,2,r),e.render(n,a),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,u),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(n,c),e.setRenderTarget(h,f,m),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class $h extends Qt{constructor(e,n,i,r,s,o,a,l,u,c){e=e!==void 0?e:[],n=n!==void 0?n:ho,super(e,n,i,r,s,o,a,l,u,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class JE extends ts{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];n.encoding!==void 0&&(sa("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Xr?at:On),this.texture=new $h(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:St}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new $a(5,5,5),s=new ns({name:"CubemapFromEquirect",uniforms:go(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:_n,blending:cr});s.uniforms.tEquirect.value=n;const o=new kn(r,s),a=n.minFilter;return n.minFilter===La&&(n.minFilter=St),new QE(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}const Md=new j,ew=new j,tw=new Xe;class Lr{constructor(e=new j(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Md.subVectors(i,n).cross(ew.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(Md),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||tw.getNormalMatrix(e),r=this.coplanarPoint(Md).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Cr=new qh,Ol=new j;class Kh{constructor(e=new Lr,n=new Lr,i=new Lr,r=new Lr,s=new Lr,o=new Lr){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Ci){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],u=r[4],c=r[5],h=r[6],f=r[7],m=r[8],_=r[9],x=r[10],p=r[11],d=r[12],v=r[13],g=r[14],S=r[15];if(i[0].setComponents(l-s,f-u,p-m,S-d).normalize(),i[1].setComponents(l+s,f+u,p+m,S+d).normalize(),i[2].setComponents(l+o,f+c,p+_,S+v).normalize(),i[3].setComponents(l-o,f-c,p-_,S-v).normalize(),i[4].setComponents(l-a,f-h,p-x,S-g).normalize(),n===Ci)i[5].setComponents(l+a,f+h,p+x,S+g).normalize();else if(n===Ou)i[5].setComponents(a,h,x,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Cr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Cr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Cr)}intersectsSprite(e){return Cr.center.set(0,0,0),Cr.radius=.7071067811865476,Cr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Cr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(Ol.x=r.normal.x>0?e.max.x:e.min.x,Ol.y=r.normal.y>0?e.max.y:e.min.y,Ol.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ol)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function K0(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function nw(t,e){const n=e.isWebGL2,i=new WeakMap;function r(u,c){const h=u.array,f=u.usage,m=t.createBuffer();t.bindBuffer(c,m),t.bufferData(c,h,f),u.onUploadCallback();let _;if(h instanceof Float32Array)_=t.FLOAT;else if(h instanceof Uint16Array)if(u.isFloat16BufferAttribute)if(n)_=t.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=t.UNSIGNED_SHORT;else if(h instanceof Int16Array)_=t.SHORT;else if(h instanceof Uint32Array)_=t.UNSIGNED_INT;else if(h instanceof Int32Array)_=t.INT;else if(h instanceof Int8Array)_=t.BYTE;else if(h instanceof Uint8Array)_=t.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)_=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:m,type:_,bytesPerElement:h.BYTES_PER_ELEMENT,version:u.version}}function s(u,c,h){const f=c.array,m=c.updateRange;t.bindBuffer(h,u),m.count===-1?t.bufferSubData(h,0,f):(n?t.bufferSubData(h,m.offset*f.BYTES_PER_ELEMENT,f,m.offset,m.count):t.bufferSubData(h,m.offset*f.BYTES_PER_ELEMENT,f.subarray(m.offset,m.offset+m.count)),m.count=-1),c.onUploadCallback()}function o(u){return u.isInterleavedBufferAttribute&&(u=u.data),i.get(u)}function a(u){u.isInterleavedBufferAttribute&&(u=u.data);const c=i.get(u);c&&(t.deleteBuffer(c.buffer),i.delete(u))}function l(u,c){if(u.isGLBufferAttribute){const f=i.get(u);(!f||f.version<u.version)&&i.set(u,{buffer:u.buffer,type:u.type,bytesPerElement:u.elementSize,version:u.version});return}u.isInterleavedBufferAttribute&&(u=u.data);const h=i.get(u);h===void 0?i.set(u,r(u,c)):h.version<u.version&&(s(h.buffer,u,c),h.version=u.version)}return{get:o,remove:a,update:l}}class Zh extends Fi{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),u=a+1,c=l+1,h=e/a,f=n/l,m=[],_=[],x=[],p=[];for(let d=0;d<c;d++){const v=d*f-o;for(let g=0;g<u;g++){const S=g*h-s;_.push(S,-v,0),x.push(0,0,1),p.push(g/a),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let v=0;v<a;v++){const g=v+u*d,S=v+u*(d+1),A=v+1+u*(d+1),E=v+1+u*d;m.push(g,S,E),m.push(S,A,E)}this.setIndex(m),this.setAttribute("position",new Cn(_,3)),this.setAttribute("normal",new Cn(x,3)),this.setAttribute("uv",new Cn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zh(e.width,e.height,e.widthSegments,e.heightSegments)}}var iw=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,rw=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,sw=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ow=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,aw=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,lw=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,uw=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,cw=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,dw=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fw=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hw=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,pw=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,mw=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,gw=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,vw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_w=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yw=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xw=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Sw=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Mw=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Ew=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,ww=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Tw=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_v0 0.339
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_v1 0.276
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_v4 0.046
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_v5 0.016
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_v6 0.0038
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Aw=`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Cw=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Rw=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,bw=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Lw=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Pw="gl_FragColor = linearToOutputTexel( gl_FragColor );",Uw=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Nw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Dw=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Iw=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ow=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fw=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,kw=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,zw=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Bw=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Hw=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vw=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Gw=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Ww=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jw=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Xw=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Yw=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,qw=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,$w=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Kw=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Zw=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Qw=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Jw=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	anisotropyV /= material.anisotropy;
	material.anisotropy = saturate( material.anisotropy );
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x - tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x + tbn[ 0 ] * anisotropyV.y;
#endif`,e1=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,t1=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,n1=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,i1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,r1=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,s1=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,o1=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,a1=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,l1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,u1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,c1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,d1=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,f1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,h1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,p1=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,m1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,g1=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,v1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,_1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,y1=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,x1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,S1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,M1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,E1=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,w1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,T1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,A1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,C1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,R1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,b1=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,L1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,P1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,U1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,N1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,D1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,I1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,O1=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,F1=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,k1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,z1=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,B1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,H1=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	uniform int boneTextureSize;
	mat4 getBoneMatrix( const in float i ) {
		float j = i * 4.0;
		float x = mod( j, float( boneTextureSize ) );
		float y = floor( j / float( boneTextureSize ) );
		float dx = 1.0 / float( boneTextureSize );
		float dy = 1.0 / float( boneTextureSize );
		y = dy * ( y + 0.5 );
		vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
		vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
		vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
		vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
		mat4 bone = mat4( v1, v2, v3, v4 );
		return bone;
	}
#endif`,V1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,G1=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,W1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,j1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,X1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Y1=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,q1=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,$1=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,K1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Z1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Q1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,J1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const eT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tT=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,iT=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,oT=`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,aT=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,lT=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,uT=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,cT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,dT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fT=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hT=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pT=`#include <common>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,mT=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gT=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vT=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_T=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,yT=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xT=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ST=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,MT=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ET=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wT=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,TT=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,AT=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,CT=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,RT=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,bT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,LT=`#include <common>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,PT=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,UT=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,NT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,He={alphahash_fragment:iw,alphahash_pars_fragment:rw,alphamap_fragment:sw,alphamap_pars_fragment:ow,alphatest_fragment:aw,alphatest_pars_fragment:lw,aomap_fragment:uw,aomap_pars_fragment:cw,begin_vertex:dw,beginnormal_vertex:fw,bsdfs:hw,iridescence_fragment:pw,bumpmap_pars_fragment:mw,clipping_planes_fragment:gw,clipping_planes_pars_fragment:vw,clipping_planes_pars_vertex:_w,clipping_planes_vertex:yw,color_fragment:xw,color_pars_fragment:Sw,color_pars_vertex:Mw,color_vertex:Ew,common:ww,cube_uv_reflection_fragment:Tw,defaultnormal_vertex:Aw,displacementmap_pars_vertex:Cw,displacementmap_vertex:Rw,emissivemap_fragment:bw,emissivemap_pars_fragment:Lw,colorspace_fragment:Pw,colorspace_pars_fragment:Uw,envmap_fragment:Nw,envmap_common_pars_fragment:Dw,envmap_pars_fragment:Iw,envmap_pars_vertex:Ow,envmap_physical_pars_fragment:qw,envmap_vertex:Fw,fog_vertex:kw,fog_pars_vertex:zw,fog_fragment:Bw,fog_pars_fragment:Hw,gradientmap_pars_fragment:Vw,lightmap_fragment:Gw,lightmap_pars_fragment:Ww,lights_lambert_fragment:jw,lights_lambert_pars_fragment:Xw,lights_pars_begin:Yw,lights_toon_fragment:$w,lights_toon_pars_fragment:Kw,lights_phong_fragment:Zw,lights_phong_pars_fragment:Qw,lights_physical_fragment:Jw,lights_physical_pars_fragment:e1,lights_fragment_begin:t1,lights_fragment_maps:n1,lights_fragment_end:i1,logdepthbuf_fragment:r1,logdepthbuf_pars_fragment:s1,logdepthbuf_pars_vertex:o1,logdepthbuf_vertex:a1,map_fragment:l1,map_pars_fragment:u1,map_particle_fragment:c1,map_particle_pars_fragment:d1,metalnessmap_fragment:f1,metalnessmap_pars_fragment:h1,morphcolor_vertex:p1,morphnormal_vertex:m1,morphtarget_pars_vertex:g1,morphtarget_vertex:v1,normal_fragment_begin:_1,normal_fragment_maps:y1,normal_pars_fragment:x1,normal_pars_vertex:S1,normal_vertex:M1,normalmap_pars_fragment:E1,clearcoat_normal_fragment_begin:w1,clearcoat_normal_fragment_maps:T1,clearcoat_pars_fragment:A1,iridescence_pars_fragment:C1,opaque_fragment:R1,packing:b1,premultiplied_alpha_fragment:L1,project_vertex:P1,dithering_fragment:U1,dithering_pars_fragment:N1,roughnessmap_fragment:D1,roughnessmap_pars_fragment:I1,shadowmap_pars_fragment:O1,shadowmap_pars_vertex:F1,shadowmap_vertex:k1,shadowmask_pars_fragment:z1,skinbase_vertex:B1,skinning_pars_vertex:H1,skinning_vertex:V1,skinnormal_vertex:G1,specularmap_fragment:W1,specularmap_pars_fragment:j1,tonemapping_fragment:X1,tonemapping_pars_fragment:Y1,transmission_fragment:q1,transmission_pars_fragment:$1,uv_pars_fragment:K1,uv_pars_vertex:Z1,uv_vertex:Q1,worldpos_vertex:J1,background_vert:eT,background_frag:tT,backgroundCube_vert:nT,backgroundCube_frag:iT,cube_vert:rT,cube_frag:sT,depth_vert:oT,depth_frag:aT,distanceRGBA_vert:lT,distanceRGBA_frag:uT,equirect_vert:cT,equirect_frag:dT,linedashed_vert:fT,linedashed_frag:hT,meshbasic_vert:pT,meshbasic_frag:mT,meshlambert_vert:gT,meshlambert_frag:vT,meshmatcap_vert:_T,meshmatcap_frag:yT,meshnormal_vert:xT,meshnormal_frag:ST,meshphong_vert:MT,meshphong_frag:ET,meshphysical_vert:wT,meshphysical_frag:TT,meshtoon_vert:AT,meshtoon_frag:CT,points_vert:RT,points_frag:bT,shadow_vert:LT,shadow_frag:PT,sprite_vert:UT,sprite_frag:NT},he={common:{diffuse:{value:new Qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xe}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xe},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0},uvTransform:{value:new Xe}},sprite:{diffuse:{value:new Qe(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}}},li={basic:{uniforms:nn([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:nn([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Qe(0)}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:nn([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Qe(0)},specular:{value:new Qe(1118481)},shininess:{value:30}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:nn([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:nn([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Qe(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:nn([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:nn([he.points,he.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:nn([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:nn([he.common,he.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:nn([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:nn([he.sprite,he.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distanceRGBA:{uniforms:nn([he.common,he.displacementmap,{referencePosition:{value:new j},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distanceRGBA_vert,fragmentShader:He.distanceRGBA_frag},shadow:{uniforms:nn([he.lights,he.fog,{color:{value:new Qe(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};li.physical={uniforms:nn([li.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xe},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xe},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xe},sheen:{value:0},sheenColor:{value:new Qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xe},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xe},attenuationDistance:{value:0},attenuationColor:{value:new Qe(0)},specularColor:{value:new Qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xe},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xe}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const Fl={r:0,b:0,g:0};function DT(t,e,n,i,r,s,o){const a=new Qe(0);let l=s===!0?0:1,u,c,h=null,f=0,m=null;function _(p,d){let v=!1,g=d.isScene===!0?d.background:null;g&&g.isTexture&&(g=(d.backgroundBlurriness>0?n:e).get(g)),g===null?x(a,l):g&&g.isColor&&(x(g,1),v=!0);const S=t.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(t.autoClear||v)&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),g&&(g.isCubeTexture||g.mapping===lc)?(c===void 0&&(c=new kn(new $a(1,1,1),new ns({name:"BackgroundCubeMaterial",uniforms:go(li.backgroundCube.uniforms),vertexShader:li.backgroundCube.vertexShader,fragmentShader:li.backgroundCube.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,E,M){this.matrixWorld.copyPosition(M.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(c)),c.material.uniforms.envMap.value=g,c.material.uniforms.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,c.material.toneMapped=st.getTransfer(g.colorSpace)!==dt,(h!==g||f!==g.version||m!==t.toneMapping)&&(c.material.needsUpdate=!0,h=g,f=g.version,m=t.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null)):g&&g.isTexture&&(u===void 0&&(u=new kn(new Zh(2,2),new ns({name:"BackgroundMaterial",uniforms:go(li.background.uniforms),vertexShader:li.background.vertexShader,fragmentShader:li.background.fragmentShader,side:vr,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),Object.defineProperty(u.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(u)),u.material.uniforms.t2D.value=g,u.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,u.material.toneMapped=st.getTransfer(g.colorSpace)!==dt,g.matrixAutoUpdate===!0&&g.updateMatrix(),u.material.uniforms.uvTransform.value.copy(g.matrix),(h!==g||f!==g.version||m!==t.toneMapping)&&(u.material.needsUpdate=!0,h=g,f=g.version,m=t.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null))}function x(p,d){p.getRGB(Fl,q0(t)),i.buffers.color.setClear(Fl.r,Fl.g,Fl.b,d,o)}return{getClearColor:function(){return a},setClearColor:function(p,d=1){a.set(p),l=d,x(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,x(a,l)},render:_}}function IT(t,e,n,i){const r=t.getParameter(t.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),o=i.isWebGL2||s!==null,a={},l=p(null);let u=l,c=!1;function h(P,D,X,k,F){let z=!1;if(o){const W=x(k,X,D);u!==W&&(u=W,m(u.object)),z=d(P,k,X,F),z&&v(P,k,X,F)}else{const W=D.wireframe===!0;(u.geometry!==k.id||u.program!==X.id||u.wireframe!==W)&&(u.geometry=k.id,u.program=X.id,u.wireframe=W,z=!0)}F!==null&&n.update(F,t.ELEMENT_ARRAY_BUFFER),(z||c)&&(c=!1,b(P,D,X,k),F!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,n.get(F).buffer))}function f(){return i.isWebGL2?t.createVertexArray():s.createVertexArrayOES()}function m(P){return i.isWebGL2?t.bindVertexArray(P):s.bindVertexArrayOES(P)}function _(P){return i.isWebGL2?t.deleteVertexArray(P):s.deleteVertexArrayOES(P)}function x(P,D,X){const k=X.wireframe===!0;let F=a[P.id];F===void 0&&(F={},a[P.id]=F);let z=F[D.id];z===void 0&&(z={},F[D.id]=z);let W=z[k];return W===void 0&&(W=p(f()),z[k]=W),W}function p(P){const D=[],X=[],k=[];for(let F=0;F<r;F++)D[F]=0,X[F]=0,k[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:X,attributeDivisors:k,object:P,attributes:{},index:null}}function d(P,D,X,k){const F=u.attributes,z=D.attributes;let W=0;const U=X.getAttributes();for(const G in U)if(U[G].location>=0){const ee=F[G];let J=z[G];if(J===void 0&&(G==="instanceMatrix"&&P.instanceMatrix&&(J=P.instanceMatrix),G==="instanceColor"&&P.instanceColor&&(J=P.instanceColor)),ee===void 0||ee.attribute!==J||J&&ee.data!==J.data)return!0;W++}return u.attributesNum!==W||u.index!==k}function v(P,D,X,k){const F={},z=D.attributes;let W=0;const U=X.getAttributes();for(const G in U)if(U[G].location>=0){let ee=z[G];ee===void 0&&(G==="instanceMatrix"&&P.instanceMatrix&&(ee=P.instanceMatrix),G==="instanceColor"&&P.instanceColor&&(ee=P.instanceColor));const J={};J.attribute=ee,ee&&ee.data&&(J.data=ee.data),F[G]=J,W++}u.attributes=F,u.attributesNum=W,u.index=k}function g(){const P=u.newAttributes;for(let D=0,X=P.length;D<X;D++)P[D]=0}function S(P){A(P,0)}function A(P,D){const X=u.newAttributes,k=u.enabledAttributes,F=u.attributeDivisors;X[P]=1,k[P]===0&&(t.enableVertexAttribArray(P),k[P]=1),F[P]!==D&&((i.isWebGL2?t:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](P,D),F[P]=D)}function E(){const P=u.newAttributes,D=u.enabledAttributes;for(let X=0,k=D.length;X<k;X++)D[X]!==P[X]&&(t.disableVertexAttribArray(X),D[X]=0)}function M(P,D,X,k,F,z,W){W===!0?t.vertexAttribIPointer(P,D,X,F,z):t.vertexAttribPointer(P,D,X,k,F,z)}function b(P,D,X,k){if(i.isWebGL2===!1&&(P.isInstancedMesh||k.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;g();const F=k.attributes,z=X.getAttributes(),W=D.defaultAttributeValues;for(const U in z){const G=z[U];if(G.location>=0){let ie=F[U];if(ie===void 0&&(U==="instanceMatrix"&&P.instanceMatrix&&(ie=P.instanceMatrix),U==="instanceColor"&&P.instanceColor&&(ie=P.instanceColor)),ie!==void 0){const ee=ie.normalized,J=ie.itemSize,de=n.get(ie);if(de===void 0)continue;const ge=de.buffer,fe=de.type,Se=de.bytesPerElement,Ge=i.isWebGL2===!0&&(fe===t.INT||fe===t.UNSIGNED_INT||ie.gpuType===P0);if(ie.isInterleavedBufferAttribute){const Te=ie.data,H=Te.stride,Fe=ie.offset;if(Te.isInstancedInterleavedBuffer){for(let ce=0;ce<G.locationSize;ce++)A(G.location+ce,Te.meshPerAttribute);P.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=Te.meshPerAttribute*Te.count)}else for(let ce=0;ce<G.locationSize;ce++)S(G.location+ce);t.bindBuffer(t.ARRAY_BUFFER,ge);for(let ce=0;ce<G.locationSize;ce++)M(G.location+ce,J/G.locationSize,fe,ee,H*Se,(Fe+J/G.locationSize*ce)*Se,Ge)}else{if(ie.isInstancedBufferAttribute){for(let Te=0;Te<G.locationSize;Te++)A(G.location+Te,ie.meshPerAttribute);P.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Te=0;Te<G.locationSize;Te++)S(G.location+Te);t.bindBuffer(t.ARRAY_BUFFER,ge);for(let Te=0;Te<G.locationSize;Te++)M(G.location+Te,J/G.locationSize,fe,ee,J*Se,J/G.locationSize*Te*Se,Ge)}}else if(W!==void 0){const ee=W[U];if(ee!==void 0)switch(ee.length){case 2:t.vertexAttrib2fv(G.location,ee);break;case 3:t.vertexAttrib3fv(G.location,ee);break;case 4:t.vertexAttrib4fv(G.location,ee);break;default:t.vertexAttrib1fv(G.location,ee)}}}}E()}function y(){O();for(const P in a){const D=a[P];for(const X in D){const k=D[X];for(const F in k)_(k[F].object),delete k[F];delete D[X]}delete a[P]}}function w(P){if(a[P.id]===void 0)return;const D=a[P.id];for(const X in D){const k=D[X];for(const F in k)_(k[F].object),delete k[F];delete D[X]}delete a[P.id]}function N(P){for(const D in a){const X=a[D];if(X[P.id]===void 0)continue;const k=X[P.id];for(const F in k)_(k[F].object),delete k[F];delete X[P.id]}}function O(){V(),c=!0,u!==l&&(u=l,m(u.object))}function V(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:O,resetDefaultState:V,dispose:y,releaseStatesOfGeometry:w,releaseStatesOfProgram:N,initAttributes:g,enableAttribute:S,disableUnusedAttributes:E}}function OT(t,e,n,i){const r=i.isWebGL2;let s;function o(u){s=u}function a(u,c){t.drawArrays(s,u,c),n.update(c,s,1)}function l(u,c,h){if(h===0)return;let f,m;if(r)f=t,m="drawArraysInstanced";else if(f=e.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[m](s,u,c,h),n.update(c,s,h)}this.setMode=o,this.render=a,this.renderInstances=l}function FT(t,e,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const M=e.get("EXT_texture_filter_anisotropic");i=t.getParameter(M.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(M){if(M==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";M="mediump"}return M==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&t.constructor.name==="WebGL2RenderingContext";let a=n.precision!==void 0?n.precision:"highp";const l=s(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const u=o||e.has("WEBGL_draw_buffers"),c=n.logarithmicDepthBuffer===!0,h=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),f=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=t.getParameter(t.MAX_TEXTURE_SIZE),_=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),x=t.getParameter(t.MAX_VERTEX_ATTRIBS),p=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),d=t.getParameter(t.MAX_VARYING_VECTORS),v=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),g=f>0,S=o||e.has("OES_texture_float"),A=g&&S,E=o?t.getParameter(t.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:u,getMaxAnisotropy:r,getMaxPrecision:s,precision:a,logarithmicDepthBuffer:c,maxTextures:h,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:_,maxAttributes:x,maxVertexUniforms:p,maxVaryings:d,maxFragmentUniforms:v,vertexTextures:g,floatFragmentTextures:S,floatVertexTextures:A,maxSamples:E}}function kT(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new Lr,a=new Xe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const m=h.length!==0||f||i!==0||r;return r=f,i=h.length,m},this.beginShadows=function(){s=!0,c(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){n=c(h,f,0)},this.setState=function(h,f,m){const _=h.clippingPlanes,x=h.clipIntersection,p=h.clipShadows,d=t.get(h);if(!r||_===null||_.length===0||s&&!p)s?c(null):u();else{const v=s?0:i,g=v*4;let S=d.clippingState||null;l.value=S,S=c(_,f,g,m);for(let A=0;A!==g;++A)S[A]=n[A];d.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function u(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function c(h,f,m,_){const x=h!==null?h.length:0;let p=null;if(x!==0){if(p=l.value,_!==!0||p===null){const d=m+x*4,v=f.matrixWorldInverse;a.getNormalMatrix(v),(p===null||p.length<d)&&(p=new Float32Array(d));for(let g=0,S=m;g!==x;++g,S+=4)o.copy(h[g]).applyMatrix4(v,a),o.normal.toArray(p,S),p[S+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}function zT(t){let e=new WeakMap;function n(o,a){return a===Cf?o.mapping=ho:a===Rf&&(o.mapping=po),o}function i(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){const a=o.mapping;if(a===Cf||a===Rf)if(e.has(o)){const l=e.get(o).texture;return n(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const u=new JE(l.height/2);return u.fromEquirectangularTexture(t,o),e.set(o,u),o.addEventListener("dispose",r),n(u.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Z0 extends $0{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const u=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=u*this.view.offsetX,o=s+u*this.view.width,a-=c*this.view.offsetY,l=a-c*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const ks=4,Og=[.125,.215,.35,.446,.526,.582],Ir=20,Ed=new Z0,Fg=new Qe;let wd=null,Td=0,Ad=0;const Pr=(1+Math.sqrt(5))/2,Ss=1/Pr,kg=[new j(1,1,1),new j(-1,1,1),new j(1,1,-1),new j(-1,1,-1),new j(0,Pr,Ss),new j(0,Pr,-Ss),new j(Ss,0,Pr),new j(-Ss,0,Pr),new j(Pr,Ss,0),new j(-Pr,Ss,0)];class zg{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){wd=this._renderer.getRenderTarget(),Td=this._renderer.getActiveCubeFace(),Ad=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hg(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(wd,Td,Ad),e.scissorTest=!1,kl(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===ho||e.mapping===po?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),wd=this._renderer.getRenderTarget(),Td=this._renderer.getActiveCubeFace(),Ad=this._renderer.getActiveMipmapLevel();const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:St,minFilter:St,generateMipmaps:!1,type:Pa,format:on,colorSpace:Ii,depthBuffer:!1},r=Bg(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bg(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=BT(s)),this._blurMaterial=HT(s,e,n)}return r}_compileMaterial(e){const n=new kn(this._lodPlanes[0],e);this._renderer.compile(n,Ed)}_sceneToCubeUV(e,n,i,r){const a=new In(90,1,n,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],c=this._renderer,h=c.autoClear,f=c.toneMapping;c.getClearColor(Fg),c.toneMapping=dr,c.autoClear=!1;const m=new j0({name:"PMREM.Background",side:_n,depthWrite:!1,depthTest:!1}),_=new kn(new $a,m);let x=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,x=!0):(m.color.copy(Fg),x=!0);for(let d=0;d<6;d++){const v=d%3;v===0?(a.up.set(0,l[d],0),a.lookAt(u[d],0,0)):v===1?(a.up.set(0,0,l[d]),a.lookAt(0,u[d],0)):(a.up.set(0,l[d],0),a.lookAt(0,0,u[d]));const g=this._cubeSize;kl(r,v*g,d>2?g:0,g,g),c.setRenderTarget(r),x&&c.render(_,a),c.render(e,a)}_.geometry.dispose(),_.material.dispose(),c.toneMapping=f,c.autoClear=h,e.background=p}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===ho||e.mapping===po;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vg()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hg());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new kn(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;kl(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,Ed)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=kg[(r-1)%kg.length];this._blur(e,r-1,r,s,o)}n.autoClear=i}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,u=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const c=3,h=new kn(this._lodPlanes[r],u),f=u.uniforms,m=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Ir-1),x=s/_,p=isFinite(s)?1+Math.floor(c*x):Ir;p>Ir&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Ir}`);const d=[];let v=0;for(let M=0;M<Ir;++M){const b=M/x,y=Math.exp(-b*b/2);d.push(y),M===0?v+=y:M<p&&(v+=2*y)}for(let M=0;M<d.length;M++)d[M]=d[M]/v;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:g}=this;f.dTheta.value=_,f.mipInt.value=g-i;const S=this._sizeLods[r],A=3*S*(r>g-ks?r-g+ks:0),E=4*(this._cubeSize-S);kl(n,A,E,3*S,2*S),l.setRenderTarget(n),l.render(h,Ed)}}function BT(t){const e=[],n=[],i=[];let r=t;const s=t-ks+1+Og.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);n.push(a);let l=1/a;o>t-ks?l=Og[o-t+ks-1]:o===0&&(l=0),i.push(l);const u=1/(a-2),c=-u,h=1+u,f=[c,c,h,c,h,h,c,c,h,h,c,h],m=6,_=6,x=3,p=2,d=1,v=new Float32Array(x*_*m),g=new Float32Array(p*_*m),S=new Float32Array(d*_*m);for(let E=0;E<m;E++){const M=E%3*2/3-1,b=E>2?0:-1,y=[M,b,0,M+2/3,b,0,M+2/3,b+1,0,M,b,0,M+2/3,b+1,0,M,b+1,0];v.set(y,x*_*E),g.set(f,p*_*E);const w=[E,E,E,E,E,E];S.set(w,d*_*E)}const A=new Fi;A.setAttribute("position",new Jn(v,x)),A.setAttribute("uv",new Jn(g,p)),A.setAttribute("faceIndex",new Jn(S,d)),e.push(A),r>ks&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Bg(t,e,n){const i=new ts(t,e,n);return i.texture.mapping=lc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function kl(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function HT(t,e,n){const i=new Float32Array(Ir),r=new j(0,1,0);return new ns({name:"SphericalGaussianBlur",defines:{n:Ir,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Qh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:cr,depthTest:!1,depthWrite:!1})}function Hg(){return new ns({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:cr,depthTest:!1,depthWrite:!1})}function Vg(){return new ns({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:cr,depthTest:!1,depthWrite:!1})}function Qh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function VT(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){const l=a.mapping,u=l===Cf||l===Rf,c=l===ho||l===po;if(u||c)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let h=e.get(a);return n===null&&(n=new zg(t)),h=u?n.fromEquirectangular(a,h):n.fromCubemap(a,h),e.set(a,h),h.texture}else{if(e.has(a))return e.get(a).texture;{const h=a.image;if(u&&h&&h.height>0||c&&h&&r(h)){n===null&&(n=new zg(t));const f=u?n.fromEquirectangular(a):n.fromCubemap(a);return e.set(a,f),a.addEventListener("dispose",s),f.texture}else return null}}}return a}function r(a){let l=0;const u=6;for(let c=0;c<u;c++)a[c]!==void 0&&l++;return l===u}function s(a){const l=a.target;l.removeEventListener("dispose",s);const u=e.get(l);u!==void 0&&(e.delete(l),u.dispose())}function o(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:o}}function GT(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(i){i.isWebGL2?n("EXT_color_buffer_float"):(n("WEBGL_depth_texture"),n("OES_texture_float"),n("OES_texture_half_float"),n("OES_texture_half_float_linear"),n("OES_standard_derivatives"),n("OES_element_index_uint"),n("OES_vertex_array_object"),n("ANGLE_instanced_arrays")),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture")},get:function(i){const r=n(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function WT(t,e,n,i){const r={},s=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);for(const _ in f.morphAttributes){const x=f.morphAttributes[_];for(let p=0,d=x.length;p<d;p++)e.remove(x[p])}f.removeEventListener("dispose",o),delete r[f.id];const m=s.get(f);m&&(e.remove(m),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function a(h,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,n.memory.geometries++),f}function l(h){const f=h.attributes;for(const _ in f)e.update(f[_],t.ARRAY_BUFFER);const m=h.morphAttributes;for(const _ in m){const x=m[_];for(let p=0,d=x.length;p<d;p++)e.update(x[p],t.ARRAY_BUFFER)}}function u(h){const f=[],m=h.index,_=h.attributes.position;let x=0;if(m!==null){const v=m.array;x=m.version;for(let g=0,S=v.length;g<S;g+=3){const A=v[g+0],E=v[g+1],M=v[g+2];f.push(A,E,E,M,M,A)}}else if(_!==void 0){const v=_.array;x=_.version;for(let g=0,S=v.length/3-1;g<S;g+=3){const A=g+0,E=g+1,M=g+2;f.push(A,E,E,M,M,A)}}else return;const p=new(z0(f)?Y0:X0)(f,1);p.version=x;const d=s.get(h);d&&e.remove(d),s.set(h,p)}function c(h){const f=s.get(h);if(f){const m=h.index;m!==null&&f.version<m.version&&u(h)}else u(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:c}}function jT(t,e,n,i){const r=i.isWebGL2;let s;function o(f){s=f}let a,l;function u(f){a=f.type,l=f.bytesPerElement}function c(f,m){t.drawElements(s,m,a,f*l),n.update(m,s,1)}function h(f,m,_){if(_===0)return;let x,p;if(r)x=t,p="drawElementsInstanced";else if(x=e.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",x===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}x[p](s,m,a,f*l,_),n.update(m,s,_)}this.setMode=o,this.setIndex=u,this.render=c,this.renderInstances=h}function XT(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function YT(t,e){return t[0]-e[0]}function qT(t,e){return Math.abs(e[1])-Math.abs(t[1])}function $T(t,e,n){const i={},r=new Float32Array(8),s=new WeakMap,o=new kt,a=[];for(let u=0;u<8;u++)a[u]=[u,0];function l(u,c,h){const f=u.morphTargetInfluences;if(e.isWebGL2===!0){const m=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,_=m!==void 0?m.length:0;let x=s.get(c);if(x===void 0||x.count!==_){let v=function(){V.dispose(),s.delete(c),c.removeEventListener("dispose",v)};x!==void 0&&x.texture.dispose();const g=c.morphAttributes.position!==void 0,S=c.morphAttributes.normal!==void 0,A=c.morphAttributes.color!==void 0,E=c.morphAttributes.position||[],M=c.morphAttributes.normal||[],b=c.morphAttributes.color||[];let y=0;g===!0&&(y=1),S===!0&&(y=2),A===!0&&(y=3);let w=c.attributes.position.count*y,N=1;w>e.maxTextureSize&&(N=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const O=new Float32Array(w*N*4*_),V=new V0(O,w,N,_);V.type=tr,V.needsUpdate=!0;const P=y*4;for(let D=0;D<_;D++){const X=E[D],k=M[D],F=b[D],z=w*N*4*D;for(let W=0;W<X.count;W++){const U=W*P;g===!0&&(o.fromBufferAttribute(X,W),O[z+U+0]=o.x,O[z+U+1]=o.y,O[z+U+2]=o.z,O[z+U+3]=0),S===!0&&(o.fromBufferAttribute(k,W),O[z+U+4]=o.x,O[z+U+5]=o.y,O[z+U+6]=o.z,O[z+U+7]=0),A===!0&&(o.fromBufferAttribute(F,W),O[z+U+8]=o.x,O[z+U+9]=o.y,O[z+U+10]=o.z,O[z+U+11]=F.itemSize===4?o.w:1)}}x={count:_,texture:V,size:new nt(w,N)},s.set(c,x),c.addEventListener("dispose",v)}let p=0;for(let v=0;v<f.length;v++)p+=f[v];const d=c.morphTargetsRelative?1:1-p;h.getUniforms().setValue(t,"morphTargetBaseInfluence",d),h.getUniforms().setValue(t,"morphTargetInfluences",f),h.getUniforms().setValue(t,"morphTargetsTexture",x.texture,n),h.getUniforms().setValue(t,"morphTargetsTextureSize",x.size)}else{const m=f===void 0?0:f.length;let _=i[c.id];if(_===void 0||_.length!==m){_=[];for(let g=0;g<m;g++)_[g]=[g,0];i[c.id]=_}for(let g=0;g<m;g++){const S=_[g];S[0]=g,S[1]=f[g]}_.sort(qT);for(let g=0;g<8;g++)g<m&&_[g][1]?(a[g][0]=_[g][0],a[g][1]=_[g][1]):(a[g][0]=Number.MAX_SAFE_INTEGER,a[g][1]=0);a.sort(YT);const x=c.morphAttributes.position,p=c.morphAttributes.normal;let d=0;for(let g=0;g<8;g++){const S=a[g],A=S[0],E=S[1];A!==Number.MAX_SAFE_INTEGER&&E?(x&&c.getAttribute("morphTarget"+g)!==x[A]&&c.setAttribute("morphTarget"+g,x[A]),p&&c.getAttribute("morphNormal"+g)!==p[A]&&c.setAttribute("morphNormal"+g,p[A]),r[g]=E,d+=E):(x&&c.hasAttribute("morphTarget"+g)===!0&&c.deleteAttribute("morphTarget"+g),p&&c.hasAttribute("morphNormal"+g)===!0&&c.deleteAttribute("morphNormal"+g),r[g]=0)}const v=c.morphTargetsRelative?1:1-d;h.getUniforms().setValue(t,"morphTargetBaseInfluence",v),h.getUniforms().setValue(t,"morphTargetInfluences",r)}}return{update:l}}function KT(t,e,n,i){let r=new WeakMap;function s(l){const u=i.render.frame,c=l.geometry,h=e.get(l,c);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==u&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function o(){r=new WeakMap}function a(l){const u=l.target;u.removeEventListener("dispose",a),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:s,dispose:o}}const Q0=new Qt,J0=new V0,ey=new IE,ty=new $h,Gg=[],Wg=[],jg=new Float32Array(16),Xg=new Float32Array(9),Yg=new Float32Array(4);function To(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Gg[r];if(s===void 0&&(s=new Float32Array(r),Gg[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function Ut(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Nt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function dc(t,e){let n=Wg[e];n===void 0&&(n=new Int32Array(e),Wg[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function ZT(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function QT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2fv(this.addr,e),Nt(n,e)}}function JT(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Ut(n,e))return;t.uniform3fv(this.addr,e),Nt(n,e)}}function eA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4fv(this.addr,e),Nt(n,e)}}function tA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Nt(n,e)}else{if(Ut(n,i))return;Yg.set(i),t.uniformMatrix2fv(this.addr,!1,Yg),Nt(n,i)}}function nA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Nt(n,e)}else{if(Ut(n,i))return;Xg.set(i),t.uniformMatrix3fv(this.addr,!1,Xg),Nt(n,i)}}function iA(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Nt(n,e)}else{if(Ut(n,i))return;jg.set(i),t.uniformMatrix4fv(this.addr,!1,jg),Nt(n,i)}}function rA(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function sA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2iv(this.addr,e),Nt(n,e)}}function oA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ut(n,e))return;t.uniform3iv(this.addr,e),Nt(n,e)}}function aA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4iv(this.addr,e),Nt(n,e)}}function lA(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function uA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2uiv(this.addr,e),Nt(n,e)}}function cA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ut(n,e))return;t.uniform3uiv(this.addr,e),Nt(n,e)}}function dA(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4uiv(this.addr,e),Nt(n,e)}}function fA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2D(e||Q0,r)}function hA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||ey,r)}function pA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||ty,r)}function mA(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||J0,r)}function gA(t){switch(t){case 5126:return ZT;case 35664:return QT;case 35665:return JT;case 35666:return eA;case 35674:return tA;case 35675:return nA;case 35676:return iA;case 5124:case 35670:return rA;case 35667:case 35671:return sA;case 35668:case 35672:return oA;case 35669:case 35673:return aA;case 5125:return lA;case 36294:return uA;case 36295:return cA;case 36296:return dA;case 35678:case 36198:case 36298:case 36306:case 35682:return fA;case 35679:case 36299:case 36307:return hA;case 35680:case 36300:case 36308:case 36293:return pA;case 36289:case 36303:case 36311:case 36292:return mA}}function vA(t,e){t.uniform1fv(this.addr,e)}function _A(t,e){const n=To(e,this.size,2);t.uniform2fv(this.addr,n)}function yA(t,e){const n=To(e,this.size,3);t.uniform3fv(this.addr,n)}function xA(t,e){const n=To(e,this.size,4);t.uniform4fv(this.addr,n)}function SA(t,e){const n=To(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function MA(t,e){const n=To(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function EA(t,e){const n=To(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function wA(t,e){t.uniform1iv(this.addr,e)}function TA(t,e){t.uniform2iv(this.addr,e)}function AA(t,e){t.uniform3iv(this.addr,e)}function CA(t,e){t.uniform4iv(this.addr,e)}function RA(t,e){t.uniform1uiv(this.addr,e)}function bA(t,e){t.uniform2uiv(this.addr,e)}function LA(t,e){t.uniform3uiv(this.addr,e)}function PA(t,e){t.uniform4uiv(this.addr,e)}function UA(t,e,n){const i=this.cache,r=e.length,s=dc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)n.setTexture2D(e[o]||Q0,s[o])}function NA(t,e,n){const i=this.cache,r=e.length,s=dc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||ey,s[o])}function DA(t,e,n){const i=this.cache,r=e.length,s=dc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||ty,s[o])}function IA(t,e,n){const i=this.cache,r=e.length,s=dc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Nt(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||J0,s[o])}function OA(t){switch(t){case 5126:return vA;case 35664:return _A;case 35665:return yA;case 35666:return xA;case 35674:return SA;case 35675:return MA;case 35676:return EA;case 5124:case 35670:return wA;case 35667:case 35671:return TA;case 35668:case 35672:return AA;case 35669:case 35673:return CA;case 5125:return RA;case 36294:return bA;case 36295:return LA;case 36296:return PA;case 35678:case 36198:case 36298:case 36306:case 35682:return UA;case 35679:case 36299:case 36307:return NA;case 35680:case 36300:case 36308:case 36293:return DA;case 36289:case 36303:case 36311:case 36292:return IA}}class FA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.setValue=gA(n.type)}}class kA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.size=n.size,this.setValue=OA(n.type)}}class zA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const Cd=/(\w+)(\])?(\[|\.)?/g;function qg(t,e){t.seq.push(e),t.map[e.id]=e}function BA(t,e,n){const i=t.name,r=i.length;for(Cd.lastIndex=0;;){const s=Cd.exec(i),o=Cd.lastIndex;let a=s[1];const l=s[2]==="]",u=s[3];if(l&&(a=a|0),u===void 0||u==="["&&o+2===r){qg(n,u===void 0?new FA(a,t,e):new kA(a,t,e));break}else{let h=n.map[a];h===void 0&&(h=new zA(a),qg(n,h)),n=h}}}class Jl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),o=e.getUniformLocation(n,s.name);BA(s,o,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function $g(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const HA=37297;let VA=0;function GA(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}function WA(t){const e=st.getPrimaries(st.workingColorSpace),n=st.getPrimaries(t);let i;switch(e===n?i="":e===Iu&&n===Du?i="LinearDisplayP3ToLinearSRGB":e===Du&&n===Iu&&(i="LinearSRGBToLinearDisplayP3"),t){case Ii:case uc:return[i,"LinearTransferOETF"];case at:case Yh:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),[i,"LinearTransferOETF"]}}function Kg(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+GA(t.getShaderSource(e),o)}else return r}function jA(t,e){const n=WA(e);return`vec4 ${t}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function XA(t,e){let n;switch(e){case iE:n="Linear";break;case rE:n="Reinhard";break;case sE:n="OptimizedCineon";break;case oE:n="ACESFilmic";break;case aE:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}function YA(t){return[t.extensionDerivatives||t.envMapCubeUVHeight||t.bumpMap||t.normalMapTangentSpace||t.clearcoatNormalMap||t.flatShading||t.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(t.extensionFragDepth||t.logarithmicDepthBuffer)&&t.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",t.extensionDrawBuffers&&t.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(t.extensionShaderTextureLOD||t.envMap||t.transmission)&&t.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(jo).join(`
`)}function qA(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function $A(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function jo(t){return t!==""}function Zg(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Qg(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const KA=/^[ \t]*#include +<([\w\d./]+)>/gm;function Nf(t){return t.replace(KA,QA)}const ZA=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function QA(t,e){let n=He[e];if(n===void 0){const i=ZA.get(e);if(i!==void 0)n=He[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Nf(n)}const JA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jg(t){return t.replace(JA,e2)}function e2(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function ev(t){let e="precision "+t.precision+` float;
precision `+t.precision+" int;";return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function t2(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===R0?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===PM?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===yi&&(e="SHADOWMAP_TYPE_VSM"),e}function n2(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case ho:case po:e="ENVMAP_TYPE_CUBE";break;case lc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function i2(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case po:e="ENVMAP_MODE_REFRACTION";break}return e}function r2(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case b0:e="ENVMAP_BLENDING_MULTIPLY";break;case tE:e="ENVMAP_BLENDING_MIX";break;case nE:e="ENVMAP_BLENDING_ADD";break}return e}function s2(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function o2(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=t2(n),u=n2(n),c=i2(n),h=r2(n),f=s2(n),m=n.isWebGL2?"":YA(n),_=qA(s),x=r.createProgram();let p,d,v=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(jo).join(`
`),p.length>0&&(p+=`
`),d=[m,"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(jo).join(`
`),d.length>0&&(d+=`
`)):(p=[ev(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors&&n.isWebGL2?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0&&n.isWebGL2?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(jo).join(`
`),d=[m,ev(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.envMap?"#define "+c:"",n.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.useLegacyLights?"#define LEGACY_LIGHTS":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.logarithmicDepthBuffer&&n.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==dr?"#define TONE_MAPPING":"",n.toneMapping!==dr?He.tonemapping_pars_fragment:"",n.toneMapping!==dr?XA("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,jA("linearToOutputTexel",n.outputColorSpace),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(jo).join(`
`)),o=Nf(o),o=Zg(o,n),o=Qg(o,n),a=Nf(a),a=Zg(a,n),a=Qg(a,n),o=Jg(o),a=Jg(a),n.isWebGL2&&n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["precision mediump sampler2DArray;","#define varying in",n.glslVersion===_g?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===_g?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const g=v+p+o,S=v+d+a,A=$g(r,r.VERTEX_SHADER,g),E=$g(r,r.FRAGMENT_SHADER,S);r.attachShader(x,A),r.attachShader(x,E),n.index0AttributeName!==void 0?r.bindAttribLocation(x,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function M(N){if(t.debug.checkShaderErrors){const O=r.getProgramInfoLog(x).trim(),V=r.getShaderInfoLog(A).trim(),P=r.getShaderInfoLog(E).trim();let D=!0,X=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(D=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,x,A,E);else{const k=Kg(r,A,"vertex"),F=Kg(r,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Program Info Log: `+O+`
`+k+`
`+F)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(V===""||P==="")&&(X=!1);X&&(N.diagnostics={runnable:D,programLog:O,vertexShader:{log:V,prefix:p},fragmentShader:{log:P,prefix:d}})}r.deleteShader(A),r.deleteShader(E),b=new Jl(r,x),y=$A(r,x)}let b;this.getUniforms=function(){return b===void 0&&M(this),b};let y;this.getAttributes=function(){return y===void 0&&M(this),y};let w=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=r.getProgramParameter(x,HA)),w},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=VA++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=A,this.fragmentShader=E,this}let a2=0;class l2{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new u2(e),n.set(e,i)),i}}class u2{constructor(e){this.id=a2++,this.code=e,this.usedTimes=0}}function c2(t,e,n,i,r,s,o){const a=new G0,l=new l2,u=[],c=r.isWebGL2,h=r.logarithmicDepthBuffer,f=r.vertexTextures;let m=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return y===0?"uv":`uv${y}`}function p(y,w,N,O,V){const P=O.fog,D=V.geometry,X=y.isMeshStandardMaterial?O.environment:null,k=(y.isMeshStandardMaterial?n:e).get(y.envMap||X),F=k&&k.mapping===lc?k.image.height:null,z=_[y.type];y.precision!==null&&(m=r.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));const W=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,U=W!==void 0?W.length:0;let G=0;D.morphAttributes.position!==void 0&&(G=1),D.morphAttributes.normal!==void 0&&(G=2),D.morphAttributes.color!==void 0&&(G=3);let ie,ee,J,de;if(z){const Tt=li[z];ie=Tt.vertexShader,ee=Tt.fragmentShader}else ie=y.vertexShader,ee=y.fragmentShader,l.update(y),J=l.getVertexShaderID(y),de=l.getFragmentShaderID(y);const ge=t.getRenderTarget(),fe=V.isInstancedMesh===!0,Se=!!y.map,Ge=!!y.matcap,Te=!!k,H=!!y.aoMap,Fe=!!y.lightMap,ce=!!y.bumpMap,we=!!y.normalMap,Re=!!y.displacementMap,_t=!!y.emissiveMap,We=!!y.metalnessMap,je=!!y.roughnessMap,ot=y.anisotropy>0,Dt=y.clearcoat>0,Xt=y.iridescence>0,L=y.sheen>0,T=y.transmission>0,Y=ot&&!!y.anisotropyMap,se=Dt&&!!y.clearcoatMap,ne=Dt&&!!y.clearcoatNormalMap,oe=Dt&&!!y.clearcoatRoughnessMap,Ae=Xt&&!!y.iridescenceMap,ue=Xt&&!!y.iridescenceThicknessMap,ve=L&&!!y.sheenColorMap,Ne=L&&!!y.sheenRoughnessMap,Je=!!y.specularMap,re=!!y.specularColorMap,rt=!!y.specularIntensityMap,ke=T&&!!y.transmissionMap,De=T&&!!y.thicknessMap,be=!!y.gradientMap,xe=!!y.alphaMap,$e=y.alphaTest>0,I=!!y.alphaHash,me=!!y.extensions,ae=!!D.attributes.uv1,Q=!!D.attributes.uv2,le=!!D.attributes.uv3;let Pe=dr;return y.toneMapped&&(ge===null||ge.isXRRenderTarget===!0)&&(Pe=t.toneMapping),{isWebGL2:c,shaderID:z,shaderType:y.type,shaderName:y.name,vertexShader:ie,fragmentShader:ee,defines:y.defines,customVertexShaderID:J,customFragmentShaderID:de,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,instancing:fe,instancingColor:fe&&V.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:ge===null?t.outputColorSpace:ge.isXRRenderTarget===!0?ge.texture.colorSpace:Ii,map:Se,matcap:Ge,envMap:Te,envMapMode:Te&&k.mapping,envMapCubeUVHeight:F,aoMap:H,lightMap:Fe,bumpMap:ce,normalMap:we,displacementMap:f&&Re,emissiveMap:_t,normalMapObjectSpace:we&&y.normalMapType===xE,normalMapTangentSpace:we&&y.normalMapType===k0,metalnessMap:We,roughnessMap:je,anisotropy:ot,anisotropyMap:Y,clearcoat:Dt,clearcoatMap:se,clearcoatNormalMap:ne,clearcoatRoughnessMap:oe,iridescence:Xt,iridescenceMap:Ae,iridescenceThicknessMap:ue,sheen:L,sheenColorMap:ve,sheenRoughnessMap:Ne,specularMap:Je,specularColorMap:re,specularIntensityMap:rt,transmission:T,transmissionMap:ke,thicknessMap:De,gradientMap:be,opaque:y.transparent===!1&&y.blending===$s,alphaMap:xe,alphaTest:$e,alphaHash:I,combine:y.combine,mapUv:Se&&x(y.map.channel),aoMapUv:H&&x(y.aoMap.channel),lightMapUv:Fe&&x(y.lightMap.channel),bumpMapUv:ce&&x(y.bumpMap.channel),normalMapUv:we&&x(y.normalMap.channel),displacementMapUv:Re&&x(y.displacementMap.channel),emissiveMapUv:_t&&x(y.emissiveMap.channel),metalnessMapUv:We&&x(y.metalnessMap.channel),roughnessMapUv:je&&x(y.roughnessMap.channel),anisotropyMapUv:Y&&x(y.anisotropyMap.channel),clearcoatMapUv:se&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:ne&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:oe&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:ue&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:Ne&&x(y.sheenRoughnessMap.channel),specularMapUv:Je&&x(y.specularMap.channel),specularColorMapUv:re&&x(y.specularColorMap.channel),specularIntensityMapUv:rt&&x(y.specularIntensityMap.channel),transmissionMapUv:ke&&x(y.transmissionMap.channel),thicknessMapUv:De&&x(y.thicknessMap.channel),alphaMapUv:xe&&x(y.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(we||ot),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,vertexUv1s:ae,vertexUv2s:Q,vertexUv3s:le,pointsUvs:V.isPoints===!0&&!!D.attributes.uv&&(Se||xe),fog:!!P,useFog:y.fog===!0,fogExp2:P&&P.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:V.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:U,morphTextureStride:G,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:t.shadowMap.enabled&&N.length>0,shadowMapType:t.shadowMap.type,toneMapping:Pe,useLegacyLights:t._useLegacyLights,decodeVideoTexture:Se&&y.map.isVideoTexture===!0&&st.getTransfer(y.map.colorSpace)===dt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===wi,flipSided:y.side===_n,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:me&&y.extensions.derivatives===!0,extensionFragDepth:me&&y.extensions.fragDepth===!0,extensionDrawBuffers:me&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:me&&y.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:c||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:c||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:c||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function d(y){const w=[];if(y.shaderID?w.push(y.shaderID):(w.push(y.customVertexShaderID),w.push(y.customFragmentShaderID)),y.defines!==void 0)for(const N in y.defines)w.push(N),w.push(y.defines[N]);return y.isRawShaderMaterial===!1&&(v(w,y),g(w,y),w.push(t.outputColorSpace)),w.push(y.customProgramCacheKey),w.join()}function v(y,w){y.push(w.precision),y.push(w.outputColorSpace),y.push(w.envMapMode),y.push(w.envMapCubeUVHeight),y.push(w.mapUv),y.push(w.alphaMapUv),y.push(w.lightMapUv),y.push(w.aoMapUv),y.push(w.bumpMapUv),y.push(w.normalMapUv),y.push(w.displacementMapUv),y.push(w.emissiveMapUv),y.push(w.metalnessMapUv),y.push(w.roughnessMapUv),y.push(w.anisotropyMapUv),y.push(w.clearcoatMapUv),y.push(w.clearcoatNormalMapUv),y.push(w.clearcoatRoughnessMapUv),y.push(w.iridescenceMapUv),y.push(w.iridescenceThicknessMapUv),y.push(w.sheenColorMapUv),y.push(w.sheenRoughnessMapUv),y.push(w.specularMapUv),y.push(w.specularColorMapUv),y.push(w.specularIntensityMapUv),y.push(w.transmissionMapUv),y.push(w.thicknessMapUv),y.push(w.combine),y.push(w.fogExp2),y.push(w.sizeAttenuation),y.push(w.morphTargetsCount),y.push(w.morphAttributeCount),y.push(w.numDirLights),y.push(w.numPointLights),y.push(w.numSpotLights),y.push(w.numSpotLightMaps),y.push(w.numHemiLights),y.push(w.numRectAreaLights),y.push(w.numDirLightShadows),y.push(w.numPointLightShadows),y.push(w.numSpotLightShadows),y.push(w.numSpotLightShadowsWithMaps),y.push(w.numLightProbes),y.push(w.shadowMapType),y.push(w.toneMapping),y.push(w.numClippingPlanes),y.push(w.numClipIntersection),y.push(w.depthPacking)}function g(y,w){a.disableAll(),w.isWebGL2&&a.enable(0),w.supportsVertexTextures&&a.enable(1),w.instancing&&a.enable(2),w.instancingColor&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),y.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.skinning&&a.enable(4),w.morphTargets&&a.enable(5),w.morphNormals&&a.enable(6),w.morphColors&&a.enable(7),w.premultipliedAlpha&&a.enable(8),w.shadowMapEnabled&&a.enable(9),w.useLegacyLights&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),y.push(a.mask)}function S(y){const w=_[y.type];let N;if(w){const O=li[w];N=$E.clone(O.uniforms)}else N=y.uniforms;return N}function A(y,w){let N;for(let O=0,V=u.length;O<V;O++){const P=u[O];if(P.cacheKey===w){N=P,++N.usedTimes;break}}return N===void 0&&(N=new o2(t,w,y,s),u.push(N)),N}function E(y){if(--y.usedTimes===0){const w=u.indexOf(y);u[w]=u[u.length-1],u.pop(),y.destroy()}}function M(y){l.remove(y)}function b(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:S,acquireProgram:A,releaseProgram:E,releaseShaderCache:M,programs:u,dispose:b}}function d2(){let t=new WeakMap;function e(s){let o=t.get(s);return o===void 0&&(o={},t.set(s,o)),o}function n(s){t.delete(s)}function i(s,o,a){t.get(s)[o]=a}function r(){t=new WeakMap}return{get:e,remove:n,update:i,dispose:r}}function f2(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function tv(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function nv(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(h,f,m,_,x,p){let d=t[e];return d===void 0?(d={id:h.id,object:h,geometry:f,material:m,groupOrder:_,renderOrder:h.renderOrder,z:x,group:p},t[e]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=m,d.groupOrder=_,d.renderOrder=h.renderOrder,d.z=x,d.group=p),e++,d}function a(h,f,m,_,x,p){const d=o(h,f,m,_,x,p);m.transmission>0?i.push(d):m.transparent===!0?r.push(d):n.push(d)}function l(h,f,m,_,x,p){const d=o(h,f,m,_,x,p);m.transmission>0?i.unshift(d):m.transparent===!0?r.unshift(d):n.unshift(d)}function u(h,f){n.length>1&&n.sort(h||f2),i.length>1&&i.sort(f||tv),r.length>1&&r.sort(f||tv)}function c(){for(let h=e,f=t.length;h<f;h++){const m=t[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:c,sort:u}}function h2(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new nv,t.set(i,[o])):r>=s.length?(o=new nv,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function p2(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new j,color:new Qe};break;case"SpotLight":n={position:new j,direction:new j,color:new Qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new j,color:new Qe,distance:0,decay:0};break;case"HemisphereLight":n={direction:new j,skyColor:new Qe,groundColor:new Qe};break;case"RectAreaLight":n={color:new Qe,position:new j,halfWidth:new j,halfHeight:new j};break}return t[e.id]=n,n}}}function m2(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":n={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let g2=0;function v2(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function _2(t,e){const n=new p2,i=m2(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)r.probe.push(new j);const s=new j,o=new Pt,a=new Pt;function l(c,h){let f=0,m=0,_=0;for(let O=0;O<9;O++)r.probe[O].set(0,0,0);let x=0,p=0,d=0,v=0,g=0,S=0,A=0,E=0,M=0,b=0,y=0;c.sort(v2);const w=h===!0?Math.PI:1;for(let O=0,V=c.length;O<V;O++){const P=c[O],D=P.color,X=P.intensity,k=P.distance,F=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)f+=D.r*X*w,m+=D.g*X*w,_+=D.b*X*w;else if(P.isLightProbe){for(let z=0;z<9;z++)r.probe[z].addScaledVector(P.sh.coefficients[z],X);y++}else if(P.isDirectionalLight){const z=n.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity*w),P.castShadow){const W=P.shadow,U=i.get(P);U.shadowBias=W.bias,U.shadowNormalBias=W.normalBias,U.shadowRadius=W.radius,U.shadowMapSize=W.mapSize,r.directionalShadow[x]=U,r.directionalShadowMap[x]=F,r.directionalShadowMatrix[x]=P.shadow.matrix,S++}r.directional[x]=z,x++}else if(P.isSpotLight){const z=n.get(P);z.position.setFromMatrixPosition(P.matrixWorld),z.color.copy(D).multiplyScalar(X*w),z.distance=k,z.coneCos=Math.cos(P.angle),z.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),z.decay=P.decay,r.spot[d]=z;const W=P.shadow;if(P.map&&(r.spotLightMap[M]=P.map,M++,W.updateMatrices(P),P.castShadow&&b++),r.spotLightMatrix[d]=W.matrix,P.castShadow){const U=i.get(P);U.shadowBias=W.bias,U.shadowNormalBias=W.normalBias,U.shadowRadius=W.radius,U.shadowMapSize=W.mapSize,r.spotShadow[d]=U,r.spotShadowMap[d]=F,E++}d++}else if(P.isRectAreaLight){const z=n.get(P);z.color.copy(D).multiplyScalar(X),z.halfWidth.set(P.width*.5,0,0),z.halfHeight.set(0,P.height*.5,0),r.rectArea[v]=z,v++}else if(P.isPointLight){const z=n.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity*w),z.distance=P.distance,z.decay=P.decay,P.castShadow){const W=P.shadow,U=i.get(P);U.shadowBias=W.bias,U.shadowNormalBias=W.normalBias,U.shadowRadius=W.radius,U.shadowMapSize=W.mapSize,U.shadowCameraNear=W.camera.near,U.shadowCameraFar=W.camera.far,r.pointShadow[p]=U,r.pointShadowMap[p]=F,r.pointShadowMatrix[p]=P.shadow.matrix,A++}r.point[p]=z,p++}else if(P.isHemisphereLight){const z=n.get(P);z.skyColor.copy(P.color).multiplyScalar(X*w),z.groundColor.copy(P.groundColor).multiplyScalar(X*w),r.hemi[g]=z,g++}}v>0&&(e.isWebGL2||t.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=he.LTC_FLOAT_1,r.rectAreaLTC2=he.LTC_FLOAT_2):t.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=he.LTC_HALF_1,r.rectAreaLTC2=he.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=f,r.ambient[1]=m,r.ambient[2]=_;const N=r.hash;(N.directionalLength!==x||N.pointLength!==p||N.spotLength!==d||N.rectAreaLength!==v||N.hemiLength!==g||N.numDirectionalShadows!==S||N.numPointShadows!==A||N.numSpotShadows!==E||N.numSpotMaps!==M||N.numLightProbes!==y)&&(r.directional.length=x,r.spot.length=d,r.rectArea.length=v,r.point.length=p,r.hemi.length=g,r.directionalShadow.length=S,r.directionalShadowMap.length=S,r.pointShadow.length=A,r.pointShadowMap.length=A,r.spotShadow.length=E,r.spotShadowMap.length=E,r.directionalShadowMatrix.length=S,r.pointShadowMatrix.length=A,r.spotLightMatrix.length=E+M-b,r.spotLightMap.length=M,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=y,N.directionalLength=x,N.pointLength=p,N.spotLength=d,N.rectAreaLength=v,N.hemiLength=g,N.numDirectionalShadows=S,N.numPointShadows=A,N.numSpotShadows=E,N.numSpotMaps=M,N.numLightProbes=y,r.version=g2++)}function u(c,h){let f=0,m=0,_=0,x=0,p=0;const d=h.matrixWorldInverse;for(let v=0,g=c.length;v<g;v++){const S=c[v];if(S.isDirectionalLight){const A=r.directional[f];A.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(d),f++}else if(S.isSpotLight){const A=r.spot[_];A.position.setFromMatrixPosition(S.matrixWorld),A.position.applyMatrix4(d),A.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(d),_++}else if(S.isRectAreaLight){const A=r.rectArea[x];A.position.setFromMatrixPosition(S.matrixWorld),A.position.applyMatrix4(d),a.identity(),o.copy(S.matrixWorld),o.premultiply(d),a.extractRotation(o),A.halfWidth.set(S.width*.5,0,0),A.halfHeight.set(0,S.height*.5,0),A.halfWidth.applyMatrix4(a),A.halfHeight.applyMatrix4(a),x++}else if(S.isPointLight){const A=r.point[m];A.position.setFromMatrixPosition(S.matrixWorld),A.position.applyMatrix4(d),m++}else if(S.isHemisphereLight){const A=r.hemi[p];A.direction.setFromMatrixPosition(S.matrixWorld),A.direction.transformDirection(d),p++}}}return{setup:l,setupView:u,state:r}}function iv(t,e){const n=new _2(t,e),i=[],r=[];function s(){i.length=0,r.length=0}function o(h){i.push(h)}function a(h){r.push(h)}function l(h){n.setup(i,h)}function u(h){n.setupView(i,h)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:n},setupLights:l,setupLightsView:u,pushLight:o,pushShadow:a}}function y2(t,e){let n=new WeakMap;function i(s,o=0){const a=n.get(s);let l;return a===void 0?(l=new iv(t,e),n.set(s,[l])):o>=a.length?(l=new iv(t,e),a.push(l)):l=a[o],l}function r(){n=new WeakMap}return{get:i,dispose:r}}class x2 extends qa{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_E,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class S2 extends qa{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const M2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,E2=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function w2(t,e,n){let i=new Kh;const r=new nt,s=new nt,o=new kt,a=new x2({depthPacking:yE}),l=new S2,u={},c=n.maxTextureSize,h={[vr]:_n,[_n]:vr,[wi]:wi},f=new ns({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:M2,fragmentShader:E2}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const _=new Fi;_.setAttribute("position",new Jn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new kn(_,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=R0;let d=this.type;this.render=function(A,E,M){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||A.length===0)return;const b=t.getRenderTarget(),y=t.getActiveCubeFace(),w=t.getActiveMipmapLevel(),N=t.state;N.setBlending(cr),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const O=d!==yi&&this.type===yi,V=d===yi&&this.type!==yi;for(let P=0,D=A.length;P<D;P++){const X=A[P],k=X.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;r.copy(k.mapSize);const F=k.getFrameExtents();if(r.multiply(F),s.copy(k.mapSize),(r.x>c||r.y>c)&&(r.x>c&&(s.x=Math.floor(c/F.x),r.x=s.x*F.x,k.mapSize.x=s.x),r.y>c&&(s.y=Math.floor(c/F.y),r.y=s.y*F.y,k.mapSize.y=s.y)),k.map===null||O===!0||V===!0){const W=this.type!==yi?{minFilter:sn,magFilter:sn}:{};k.map!==null&&k.map.dispose(),k.map=new ts(r.x,r.y,W),k.map.texture.name=X.name+".shadowMap",k.camera.updateProjectionMatrix()}t.setRenderTarget(k.map),t.clear();const z=k.getViewportCount();for(let W=0;W<z;W++){const U=k.getViewport(W);o.set(s.x*U.x,s.y*U.y,s.x*U.z,s.y*U.w),N.viewport(o),k.updateMatrices(X,W),i=k.getFrustum(),S(E,M,k.camera,X,this.type)}k.isPointLightShadow!==!0&&this.type===yi&&v(k,M),k.needsUpdate=!1}d=this.type,p.needsUpdate=!1,t.setRenderTarget(b,y,w)};function v(A,E){const M=e.update(x);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ts(r.x,r.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,t.setRenderTarget(A.mapPass),t.clear(),t.renderBufferDirect(E,null,M,f,x,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,t.setRenderTarget(A.map),t.clear(),t.renderBufferDirect(E,null,M,m,x,null)}function g(A,E,M,b){let y=null;const w=M.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(w!==void 0)y=w;else if(y=M.isPointLight===!0?l:a,t.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const N=y.uuid,O=E.uuid;let V=u[N];V===void 0&&(V={},u[N]=V);let P=V[O];P===void 0&&(P=y.clone(),V[O]=P),y=P}if(y.visible=E.visible,y.wireframe=E.wireframe,b===yi?y.side=E.shadowSide!==null?E.shadowSide:E.side:y.side=E.shadowSide!==null?E.shadowSide:h[E.side],y.alphaMap=E.alphaMap,y.alphaTest=E.alphaTest,y.map=E.map,y.clipShadows=E.clipShadows,y.clippingPlanes=E.clippingPlanes,y.clipIntersection=E.clipIntersection,y.displacementMap=E.displacementMap,y.displacementScale=E.displacementScale,y.displacementBias=E.displacementBias,y.wireframeLinewidth=E.wireframeLinewidth,y.linewidth=E.linewidth,M.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const N=t.properties.get(y);N.light=M}return y}function S(A,E,M,b,y){if(A.visible===!1)return;if(A.layers.test(E.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&y===yi)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,A.matrixWorld);const O=e.update(A),V=A.material;if(Array.isArray(V)){const P=O.groups;for(let D=0,X=P.length;D<X;D++){const k=P[D],F=V[k.materialIndex];if(F&&F.visible){const z=g(A,F,b,y);t.renderBufferDirect(M,null,O,z,A,k)}}}else if(V.visible){const P=g(A,V,b,y);t.renderBufferDirect(M,null,O,P,A,null)}}const N=A.children;for(let O=0,V=N.length;O<V;O++)S(N[O],E,M,b,y)}}function T2(t,e,n){const i=n.isWebGL2;function r(){let I=!1;const me=new kt;let ae=null;const Q=new kt(0,0,0,0);return{setMask:function(le){ae!==le&&!I&&(t.colorMask(le,le,le,le),ae=le)},setLocked:function(le){I=le},setClear:function(le,Pe,et,Tt,Pn){Pn===!0&&(le*=Tt,Pe*=Tt,et*=Tt),me.set(le,Pe,et,Tt),Q.equals(me)===!1&&(t.clearColor(le,Pe,et,Tt),Q.copy(me))},reset:function(){I=!1,ae=null,Q.set(-1,0,0,0)}}}function s(){let I=!1,me=null,ae=null,Q=null;return{setTest:function(le){le?Se(t.DEPTH_TEST):Ge(t.DEPTH_TEST)},setMask:function(le){me!==le&&!I&&(t.depthMask(le),me=le)},setFunc:function(le){if(ae!==le){switch(le){case qM:t.depthFunc(t.NEVER);break;case $M:t.depthFunc(t.ALWAYS);break;case KM:t.depthFunc(t.LESS);break;case Pu:t.depthFunc(t.LEQUAL);break;case ZM:t.depthFunc(t.EQUAL);break;case QM:t.depthFunc(t.GEQUAL);break;case JM:t.depthFunc(t.GREATER);break;case eE:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}ae=le}},setLocked:function(le){I=le},setClear:function(le){Q!==le&&(t.clearDepth(le),Q=le)},reset:function(){I=!1,me=null,ae=null,Q=null}}}function o(){let I=!1,me=null,ae=null,Q=null,le=null,Pe=null,et=null,Tt=null,Pn=null;return{setTest:function(lt){I||(lt?Se(t.STENCIL_TEST):Ge(t.STENCIL_TEST))},setMask:function(lt){me!==lt&&!I&&(t.stencilMask(lt),me=lt)},setFunc:function(lt,en,ti){(ae!==lt||Q!==en||le!==ti)&&(t.stencilFunc(lt,en,ti),ae=lt,Q=en,le=ti)},setOp:function(lt,en,ti){(Pe!==lt||et!==en||Tt!==ti)&&(t.stencilOp(lt,en,ti),Pe=lt,et=en,Tt=ti)},setLocked:function(lt){I=lt},setClear:function(lt){Pn!==lt&&(t.clearStencil(lt),Pn=lt)},reset:function(){I=!1,me=null,ae=null,Q=null,le=null,Pe=null,et=null,Tt=null,Pn=null}}}const a=new r,l=new s,u=new o,c=new WeakMap,h=new WeakMap;let f={},m={},_=new WeakMap,x=[],p=null,d=!1,v=null,g=null,S=null,A=null,E=null,M=null,b=null,y=new Qe(0,0,0),w=0,N=!1,O=null,V=null,P=null,D=null,X=null;const k=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let F=!1,z=0;const W=t.getParameter(t.VERSION);W.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(W)[1]),F=z>=1):W.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),F=z>=2);let U=null,G={};const ie=t.getParameter(t.SCISSOR_BOX),ee=t.getParameter(t.VIEWPORT),J=new kt().fromArray(ie),de=new kt().fromArray(ee);function ge(I,me,ae,Q){const le=new Uint8Array(4),Pe=t.createTexture();t.bindTexture(I,Pe),t.texParameteri(I,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(I,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let et=0;et<ae;et++)i&&(I===t.TEXTURE_3D||I===t.TEXTURE_2D_ARRAY)?t.texImage3D(me,0,t.RGBA,1,1,Q,0,t.RGBA,t.UNSIGNED_BYTE,le):t.texImage2D(me+et,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,le);return Pe}const fe={};fe[t.TEXTURE_2D]=ge(t.TEXTURE_2D,t.TEXTURE_2D,1),fe[t.TEXTURE_CUBE_MAP]=ge(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(fe[t.TEXTURE_2D_ARRAY]=ge(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),fe[t.TEXTURE_3D]=ge(t.TEXTURE_3D,t.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),u.setClear(0),Se(t.DEPTH_TEST),l.setFunc(Pu),We(!1),je(km),Se(t.CULL_FACE),Re(cr);function Se(I){f[I]!==!0&&(t.enable(I),f[I]=!0)}function Ge(I){f[I]!==!1&&(t.disable(I),f[I]=!1)}function Te(I,me){return m[I]!==me?(t.bindFramebuffer(I,me),m[I]=me,i&&(I===t.DRAW_FRAMEBUFFER&&(m[t.FRAMEBUFFER]=me),I===t.FRAMEBUFFER&&(m[t.DRAW_FRAMEBUFFER]=me)),!0):!1}function H(I,me){let ae=x,Q=!1;if(I)if(ae=_.get(me),ae===void 0&&(ae=[],_.set(me,ae)),I.isWebGLMultipleRenderTargets){const le=I.texture;if(ae.length!==le.length||ae[0]!==t.COLOR_ATTACHMENT0){for(let Pe=0,et=le.length;Pe<et;Pe++)ae[Pe]=t.COLOR_ATTACHMENT0+Pe;ae.length=le.length,Q=!0}}else ae[0]!==t.COLOR_ATTACHMENT0&&(ae[0]=t.COLOR_ATTACHMENT0,Q=!0);else ae[0]!==t.BACK&&(ae[0]=t.BACK,Q=!0);Q&&(n.isWebGL2?t.drawBuffers(ae):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(ae))}function Fe(I){return p!==I?(t.useProgram(I),p=I,!0):!1}const ce={[Dr]:t.FUNC_ADD,[NM]:t.FUNC_SUBTRACT,[DM]:t.FUNC_REVERSE_SUBTRACT};if(i)ce[Vm]=t.MIN,ce[Gm]=t.MAX;else{const I=e.get("EXT_blend_minmax");I!==null&&(ce[Vm]=I.MIN_EXT,ce[Gm]=I.MAX_EXT)}const we={[IM]:t.ZERO,[OM]:t.ONE,[FM]:t.SRC_COLOR,[Tf]:t.SRC_ALPHA,[GM]:t.SRC_ALPHA_SATURATE,[HM]:t.DST_COLOR,[zM]:t.DST_ALPHA,[kM]:t.ONE_MINUS_SRC_COLOR,[Af]:t.ONE_MINUS_SRC_ALPHA,[VM]:t.ONE_MINUS_DST_COLOR,[BM]:t.ONE_MINUS_DST_ALPHA,[WM]:t.CONSTANT_COLOR,[jM]:t.ONE_MINUS_CONSTANT_COLOR,[XM]:t.CONSTANT_ALPHA,[YM]:t.ONE_MINUS_CONSTANT_ALPHA};function Re(I,me,ae,Q,le,Pe,et,Tt,Pn,lt){if(I===cr){d===!0&&(Ge(t.BLEND),d=!1);return}if(d===!1&&(Se(t.BLEND),d=!0),I!==UM){if(I!==v||lt!==N){if((g!==Dr||E!==Dr)&&(t.blendEquation(t.FUNC_ADD),g=Dr,E=Dr),lt)switch(I){case $s:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case zm:t.blendFunc(t.ONE,t.ONE);break;case Bm:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Hm:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case $s:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case zm:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case Bm:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Hm:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}S=null,A=null,M=null,b=null,y.set(0,0,0),w=0,v=I,N=lt}return}le=le||me,Pe=Pe||ae,et=et||Q,(me!==g||le!==E)&&(t.blendEquationSeparate(ce[me],ce[le]),g=me,E=le),(ae!==S||Q!==A||Pe!==M||et!==b)&&(t.blendFuncSeparate(we[ae],we[Q],we[Pe],we[et]),S=ae,A=Q,M=Pe,b=et),(Tt.equals(y)===!1||Pn!==w)&&(t.blendColor(Tt.r,Tt.g,Tt.b,Pn),y.copy(Tt),w=Pn),v=I,N=!1}function _t(I,me){I.side===wi?Ge(t.CULL_FACE):Se(t.CULL_FACE);let ae=I.side===_n;me&&(ae=!ae),We(ae),I.blending===$s&&I.transparent===!1?Re(cr):Re(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),l.setFunc(I.depthFunc),l.setTest(I.depthTest),l.setMask(I.depthWrite),a.setMask(I.colorWrite);const Q=I.stencilWrite;u.setTest(Q),Q&&(u.setMask(I.stencilWriteMask),u.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),u.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),Dt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?Se(t.SAMPLE_ALPHA_TO_COVERAGE):Ge(t.SAMPLE_ALPHA_TO_COVERAGE)}function We(I){O!==I&&(I?t.frontFace(t.CW):t.frontFace(t.CCW),O=I)}function je(I){I!==bM?(Se(t.CULL_FACE),I!==V&&(I===km?t.cullFace(t.BACK):I===LM?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ge(t.CULL_FACE),V=I}function ot(I){I!==P&&(F&&t.lineWidth(I),P=I)}function Dt(I,me,ae){I?(Se(t.POLYGON_OFFSET_FILL),(D!==me||X!==ae)&&(t.polygonOffset(me,ae),D=me,X=ae)):Ge(t.POLYGON_OFFSET_FILL)}function Xt(I){I?Se(t.SCISSOR_TEST):Ge(t.SCISSOR_TEST)}function L(I){I===void 0&&(I=t.TEXTURE0+k-1),U!==I&&(t.activeTexture(I),U=I)}function T(I,me,ae){ae===void 0&&(U===null?ae=t.TEXTURE0+k-1:ae=U);let Q=G[ae];Q===void 0&&(Q={type:void 0,texture:void 0},G[ae]=Q),(Q.type!==I||Q.texture!==me)&&(U!==ae&&(t.activeTexture(ae),U=ae),t.bindTexture(I,me||fe[I]),Q.type=I,Q.texture=me)}function Y(){const I=G[U];I!==void 0&&I.type!==void 0&&(t.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function se(){try{t.compressedTexImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ne(){try{t.compressedTexImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function oe(){try{t.texSubImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ae(){try{t.texSubImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ue(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ve(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ne(){try{t.texStorage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Je(){try{t.texStorage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function re(){try{t.texImage2D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function rt(){try{t.texImage3D.apply(t,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ke(I){J.equals(I)===!1&&(t.scissor(I.x,I.y,I.z,I.w),J.copy(I))}function De(I){de.equals(I)===!1&&(t.viewport(I.x,I.y,I.z,I.w),de.copy(I))}function be(I,me){let ae=h.get(me);ae===void 0&&(ae=new WeakMap,h.set(me,ae));let Q=ae.get(I);Q===void 0&&(Q=t.getUniformBlockIndex(me,I.name),ae.set(I,Q))}function xe(I,me){const Q=h.get(me).get(I);c.get(me)!==Q&&(t.uniformBlockBinding(me,Q,I.__bindingPointIndex),c.set(me,Q))}function $e(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),i===!0&&(t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null)),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),f={},U=null,G={},m={},_=new WeakMap,x=[],p=null,d=!1,v=null,g=null,S=null,A=null,E=null,M=null,b=null,y=new Qe(0,0,0),w=0,N=!1,O=null,V=null,P=null,D=null,X=null,J.set(0,0,t.canvas.width,t.canvas.height),de.set(0,0,t.canvas.width,t.canvas.height),a.reset(),l.reset(),u.reset()}return{buffers:{color:a,depth:l,stencil:u},enable:Se,disable:Ge,bindFramebuffer:Te,drawBuffers:H,useProgram:Fe,setBlending:Re,setMaterial:_t,setFlipSided:We,setCullFace:je,setLineWidth:ot,setPolygonOffset:Dt,setScissorTest:Xt,activeTexture:L,bindTexture:T,unbindTexture:Y,compressedTexImage2D:se,compressedTexImage3D:ne,texImage2D:re,texImage3D:rt,updateUBOMapping:be,uniformBlockBinding:xe,texStorage2D:Ne,texStorage3D:Je,texSubImage2D:oe,texSubImage3D:Ae,compressedTexSubImage2D:ue,compressedTexSubImage3D:ve,scissor:ke,viewport:De,reset:$e}}function A2(t,e,n,i,r,s,o){const a=r.isWebGL2,l=r.maxTextures,u=r.maxCubemapSize,c=r.maxTextureSize,h=r.maxSamples,f=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),_=new WeakMap;let x;const p=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(L,T){return d?new OffscreenCanvas(L,T):Ua("canvas")}function g(L,T,Y,se){let ne=1;if((L.width>se||L.height>se)&&(ne=se/Math.max(L.width,L.height)),ne<1||T===!0)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap){const oe=T?Uf:Math.floor,Ae=oe(ne*L.width),ue=oe(ne*L.height);x===void 0&&(x=v(Ae,ue));const ve=Y?v(Ae,ue):x;return ve.width=Ae,ve.height=ue,ve.getContext("2d").drawImage(L,0,0,Ae,ue),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+L.width+"x"+L.height+") to ("+Ae+"x"+ue+")."),ve}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+L.width+"x"+L.height+")."),L;return L}function S(L){return yg(L.width)&&yg(L.height)}function A(L){return a?!1:L.wrapS!==Kn||L.wrapT!==Kn||L.minFilter!==sn&&L.minFilter!==St}function E(L,T){return L.generateMipmaps&&T&&L.minFilter!==sn&&L.minFilter!==St}function M(L){t.generateMipmap(L)}function b(L,T,Y,se,ne=!1){if(a===!1)return T;if(L!==null){if(t[L]!==void 0)return t[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let oe=T;if(T===t.RED&&(Y===t.FLOAT&&(oe=t.R32F),Y===t.HALF_FLOAT&&(oe=t.R16F),Y===t.UNSIGNED_BYTE&&(oe=t.R8)),T===t.RED_INTEGER&&(Y===t.UNSIGNED_BYTE&&(oe=t.R8UI),Y===t.UNSIGNED_SHORT&&(oe=t.R16UI),Y===t.UNSIGNED_INT&&(oe=t.R32UI),Y===t.BYTE&&(oe=t.R8I),Y===t.SHORT&&(oe=t.R16I),Y===t.INT&&(oe=t.R32I)),T===t.RG&&(Y===t.FLOAT&&(oe=t.RG32F),Y===t.HALF_FLOAT&&(oe=t.RG16F),Y===t.UNSIGNED_BYTE&&(oe=t.RG8)),T===t.RGBA){const Ae=ne?Nu:st.getTransfer(se);Y===t.FLOAT&&(oe=t.RGBA32F),Y===t.HALF_FLOAT&&(oe=t.RGBA16F),Y===t.UNSIGNED_BYTE&&(oe=Ae===dt?t.SRGB8_ALPHA8:t.RGBA8),Y===t.UNSIGNED_SHORT_4_4_4_4&&(oe=t.RGBA4),Y===t.UNSIGNED_SHORT_5_5_5_1&&(oe=t.RGB5_A1)}return(oe===t.R16F||oe===t.R32F||oe===t.RG16F||oe===t.RG32F||oe===t.RGBA16F||oe===t.RGBA32F)&&e.get("EXT_color_buffer_float"),oe}function y(L,T,Y){return E(L,Y)===!0||L.isFramebufferTexture&&L.minFilter!==sn&&L.minFilter!==St?Math.log2(Math.max(T.width,T.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?T.mipmaps.length:1}function w(L){return L===sn||L===Wm||L===Qc?t.NEAREST:t.LINEAR}function N(L){const T=L.target;T.removeEventListener("dispose",N),V(T),T.isVideoTexture&&_.delete(T)}function O(L){const T=L.target;T.removeEventListener("dispose",O),D(T)}function V(L){const T=i.get(L);if(T.__webglInit===void 0)return;const Y=L.source,se=p.get(Y);if(se){const ne=se[T.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&P(L),Object.keys(se).length===0&&p.delete(Y)}i.remove(L)}function P(L){const T=i.get(L);t.deleteTexture(T.__webglTexture);const Y=L.source,se=p.get(Y);delete se[T.__cacheKey],o.memory.textures--}function D(L){const T=L.texture,Y=i.get(L),se=i.get(T);if(se.__webglTexture!==void 0&&(t.deleteTexture(se.__webglTexture),o.memory.textures--),L.depthTexture&&L.depthTexture.dispose(),L.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(Y.__webglFramebuffer[ne]))for(let oe=0;oe<Y.__webglFramebuffer[ne].length;oe++)t.deleteFramebuffer(Y.__webglFramebuffer[ne][oe]);else t.deleteFramebuffer(Y.__webglFramebuffer[ne]);Y.__webglDepthbuffer&&t.deleteRenderbuffer(Y.__webglDepthbuffer[ne])}else{if(Array.isArray(Y.__webglFramebuffer))for(let ne=0;ne<Y.__webglFramebuffer.length;ne++)t.deleteFramebuffer(Y.__webglFramebuffer[ne]);else t.deleteFramebuffer(Y.__webglFramebuffer);if(Y.__webglDepthbuffer&&t.deleteRenderbuffer(Y.__webglDepthbuffer),Y.__webglMultisampledFramebuffer&&t.deleteFramebuffer(Y.__webglMultisampledFramebuffer),Y.__webglColorRenderbuffer)for(let ne=0;ne<Y.__webglColorRenderbuffer.length;ne++)Y.__webglColorRenderbuffer[ne]&&t.deleteRenderbuffer(Y.__webglColorRenderbuffer[ne]);Y.__webglDepthRenderbuffer&&t.deleteRenderbuffer(Y.__webglDepthRenderbuffer)}if(L.isWebGLMultipleRenderTargets)for(let ne=0,oe=T.length;ne<oe;ne++){const Ae=i.get(T[ne]);Ae.__webglTexture&&(t.deleteTexture(Ae.__webglTexture),o.memory.textures--),i.remove(T[ne])}i.remove(T),i.remove(L)}let X=0;function k(){X=0}function F(){const L=X;return L>=l&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+l),X+=1,L}function z(L){const T=[];return T.push(L.wrapS),T.push(L.wrapT),T.push(L.wrapR||0),T.push(L.magFilter),T.push(L.minFilter),T.push(L.anisotropy),T.push(L.internalFormat),T.push(L.format),T.push(L.type),T.push(L.generateMipmaps),T.push(L.premultiplyAlpha),T.push(L.flipY),T.push(L.unpackAlignment),T.push(L.colorSpace),T.join()}function W(L,T){const Y=i.get(L);if(L.isVideoTexture&&Dt(L),L.isRenderTargetTexture===!1&&L.version>0&&Y.__version!==L.version){const se=L.image;if(se===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(se.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Se(Y,L,T);return}}n.bindTexture(t.TEXTURE_2D,Y.__webglTexture,t.TEXTURE0+T)}function U(L,T){const Y=i.get(L);if(L.version>0&&Y.__version!==L.version){Se(Y,L,T);return}n.bindTexture(t.TEXTURE_2D_ARRAY,Y.__webglTexture,t.TEXTURE0+T)}function G(L,T){const Y=i.get(L);if(L.version>0&&Y.__version!==L.version){Se(Y,L,T);return}n.bindTexture(t.TEXTURE_3D,Y.__webglTexture,t.TEXTURE0+T)}function ie(L,T){const Y=i.get(L);if(L.version>0&&Y.__version!==L.version){Ge(Y,L,T);return}n.bindTexture(t.TEXTURE_CUBE_MAP,Y.__webglTexture,t.TEXTURE0+T)}const ee={[Uu]:t.REPEAT,[Kn]:t.CLAMP_TO_EDGE,[bf]:t.MIRRORED_REPEAT},J={[sn]:t.NEAREST,[Wm]:t.NEAREST_MIPMAP_NEAREST,[Qc]:t.NEAREST_MIPMAP_LINEAR,[St]:t.LINEAR,[lE]:t.LINEAR_MIPMAP_NEAREST,[La]:t.LINEAR_MIPMAP_LINEAR},de={[SE]:t.NEVER,[RE]:t.ALWAYS,[ME]:t.LESS,[wE]:t.LEQUAL,[EE]:t.EQUAL,[CE]:t.GEQUAL,[TE]:t.GREATER,[AE]:t.NOTEQUAL};function ge(L,T,Y){if(Y?(t.texParameteri(L,t.TEXTURE_WRAP_S,ee[T.wrapS]),t.texParameteri(L,t.TEXTURE_WRAP_T,ee[T.wrapT]),(L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY)&&t.texParameteri(L,t.TEXTURE_WRAP_R,ee[T.wrapR]),t.texParameteri(L,t.TEXTURE_MAG_FILTER,J[T.magFilter]),t.texParameteri(L,t.TEXTURE_MIN_FILTER,J[T.minFilter])):(t.texParameteri(L,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(L,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),(L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY)&&t.texParameteri(L,t.TEXTURE_WRAP_R,t.CLAMP_TO_EDGE),(T.wrapS!==Kn||T.wrapT!==Kn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),t.texParameteri(L,t.TEXTURE_MAG_FILTER,w(T.magFilter)),t.texParameteri(L,t.TEXTURE_MIN_FILTER,w(T.minFilter)),T.minFilter!==sn&&T.minFilter!==St&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),T.compareFunction&&(t.texParameteri(L,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(L,t.TEXTURE_COMPARE_FUNC,de[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const se=e.get("EXT_texture_filter_anisotropic");if(T.magFilter===sn||T.minFilter!==Qc&&T.minFilter!==La||T.type===tr&&e.has("OES_texture_float_linear")===!1||a===!1&&T.type===Pa&&e.has("OES_texture_half_float_linear")===!1)return;(T.anisotropy>1||i.get(T).__currentAnisotropy)&&(t.texParameterf(L,se.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,r.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy)}}function fe(L,T){let Y=!1;L.__webglInit===void 0&&(L.__webglInit=!0,T.addEventListener("dispose",N));const se=T.source;let ne=p.get(se);ne===void 0&&(ne={},p.set(se,ne));const oe=z(T);if(oe!==L.__cacheKey){ne[oe]===void 0&&(ne[oe]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,Y=!0),ne[oe].usedTimes++;const Ae=ne[L.__cacheKey];Ae!==void 0&&(ne[L.__cacheKey].usedTimes--,Ae.usedTimes===0&&P(T)),L.__cacheKey=oe,L.__webglTexture=ne[oe].texture}return Y}function Se(L,T,Y){let se=t.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(se=t.TEXTURE_2D_ARRAY),T.isData3DTexture&&(se=t.TEXTURE_3D);const ne=fe(L,T),oe=T.source;n.bindTexture(se,L.__webglTexture,t.TEXTURE0+Y);const Ae=i.get(oe);if(oe.version!==Ae.__version||ne===!0){n.activeTexture(t.TEXTURE0+Y);const ue=st.getPrimaries(st.workingColorSpace),ve=T.colorSpace===On?null:st.getPrimaries(T.colorSpace),Ne=T.colorSpace===On||ue===ve?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,T.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,T.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);const Je=A(T)&&S(T.image)===!1;let re=g(T.image,Je,!1,c);re=Xt(T,re);const rt=S(re)||a,ke=s.convert(T.format,T.colorSpace);let De=s.convert(T.type),be=b(T.internalFormat,ke,De,T.colorSpace,T.isVideoTexture);ge(se,T,rt);let xe;const $e=T.mipmaps,I=a&&T.isVideoTexture!==!0,me=Ae.__version===void 0||ne===!0,ae=y(T,re,rt);if(T.isDepthTexture)be=t.DEPTH_COMPONENT,a?T.type===tr?be=t.DEPTH_COMPONENT32F:T.type===er?be=t.DEPTH_COMPONENT24:T.type===Wr?be=t.DEPTH24_STENCIL8:be=t.DEPTH_COMPONENT16:T.type===tr&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),T.format===jr&&be===t.DEPTH_COMPONENT&&T.type!==Xh&&T.type!==er&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),T.type=er,De=s.convert(T.type)),T.format===mo&&be===t.DEPTH_COMPONENT&&(be=t.DEPTH_STENCIL,T.type!==Wr&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),T.type=Wr,De=s.convert(T.type))),me&&(I?n.texStorage2D(t.TEXTURE_2D,1,be,re.width,re.height):n.texImage2D(t.TEXTURE_2D,0,be,re.width,re.height,0,ke,De,null));else if(T.isDataTexture)if($e.length>0&&rt){I&&me&&n.texStorage2D(t.TEXTURE_2D,ae,be,$e[0].width,$e[0].height);for(let Q=0,le=$e.length;Q<le;Q++)xe=$e[Q],I?n.texSubImage2D(t.TEXTURE_2D,Q,0,0,xe.width,xe.height,ke,De,xe.data):n.texImage2D(t.TEXTURE_2D,Q,be,xe.width,xe.height,0,ke,De,xe.data);T.generateMipmaps=!1}else I?(me&&n.texStorage2D(t.TEXTURE_2D,ae,be,re.width,re.height),n.texSubImage2D(t.TEXTURE_2D,0,0,0,re.width,re.height,ke,De,re.data)):n.texImage2D(t.TEXTURE_2D,0,be,re.width,re.height,0,ke,De,re.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){I&&me&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ae,be,$e[0].width,$e[0].height,re.depth);for(let Q=0,le=$e.length;Q<le;Q++)xe=$e[Q],T.format!==on?ke!==null?I?n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,Q,0,0,0,xe.width,xe.height,re.depth,ke,xe.data,0,0):n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,Q,be,xe.width,xe.height,re.depth,0,xe.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?n.texSubImage3D(t.TEXTURE_2D_ARRAY,Q,0,0,0,xe.width,xe.height,re.depth,ke,De,xe.data):n.texImage3D(t.TEXTURE_2D_ARRAY,Q,be,xe.width,xe.height,re.depth,0,ke,De,xe.data)}else{I&&me&&n.texStorage2D(t.TEXTURE_2D,ae,be,$e[0].width,$e[0].height);for(let Q=0,le=$e.length;Q<le;Q++)xe=$e[Q],T.format!==on?ke!==null?I?n.compressedTexSubImage2D(t.TEXTURE_2D,Q,0,0,xe.width,xe.height,ke,xe.data):n.compressedTexImage2D(t.TEXTURE_2D,Q,be,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?n.texSubImage2D(t.TEXTURE_2D,Q,0,0,xe.width,xe.height,ke,De,xe.data):n.texImage2D(t.TEXTURE_2D,Q,be,xe.width,xe.height,0,ke,De,xe.data)}else if(T.isDataArrayTexture)I?(me&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ae,be,re.width,re.height,re.depth),n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,ke,De,re.data)):n.texImage3D(t.TEXTURE_2D_ARRAY,0,be,re.width,re.height,re.depth,0,ke,De,re.data);else if(T.isData3DTexture)I?(me&&n.texStorage3D(t.TEXTURE_3D,ae,be,re.width,re.height,re.depth),n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,ke,De,re.data)):n.texImage3D(t.TEXTURE_3D,0,be,re.width,re.height,re.depth,0,ke,De,re.data);else if(T.isFramebufferTexture){if(me)if(I)n.texStorage2D(t.TEXTURE_2D,ae,be,re.width,re.height);else{let Q=re.width,le=re.height;for(let Pe=0;Pe<ae;Pe++)n.texImage2D(t.TEXTURE_2D,Pe,be,Q,le,0,ke,De,null),Q>>=1,le>>=1}}else if($e.length>0&&rt){I&&me&&n.texStorage2D(t.TEXTURE_2D,ae,be,$e[0].width,$e[0].height);for(let Q=0,le=$e.length;Q<le;Q++)xe=$e[Q],I?n.texSubImage2D(t.TEXTURE_2D,Q,0,0,ke,De,xe):n.texImage2D(t.TEXTURE_2D,Q,be,ke,De,xe);T.generateMipmaps=!1}else I?(me&&n.texStorage2D(t.TEXTURE_2D,ae,be,re.width,re.height),n.texSubImage2D(t.TEXTURE_2D,0,0,0,ke,De,re)):n.texImage2D(t.TEXTURE_2D,0,be,ke,De,re);E(T,rt)&&M(se),Ae.__version=oe.version,T.onUpdate&&T.onUpdate(T)}L.__version=T.version}function Ge(L,T,Y){if(T.image.length!==6)return;const se=fe(L,T),ne=T.source;n.bindTexture(t.TEXTURE_CUBE_MAP,L.__webglTexture,t.TEXTURE0+Y);const oe=i.get(ne);if(ne.version!==oe.__version||se===!0){n.activeTexture(t.TEXTURE0+Y);const Ae=st.getPrimaries(st.workingColorSpace),ue=T.colorSpace===On?null:st.getPrimaries(T.colorSpace),ve=T.colorSpace===On||Ae===ue?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,T.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,T.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const Ne=T.isCompressedTexture||T.image[0].isCompressedTexture,Je=T.image[0]&&T.image[0].isDataTexture,re=[];for(let Q=0;Q<6;Q++)!Ne&&!Je?re[Q]=g(T.image[Q],!1,!0,u):re[Q]=Je?T.image[Q].image:T.image[Q],re[Q]=Xt(T,re[Q]);const rt=re[0],ke=S(rt)||a,De=s.convert(T.format,T.colorSpace),be=s.convert(T.type),xe=b(T.internalFormat,De,be,T.colorSpace),$e=a&&T.isVideoTexture!==!0,I=oe.__version===void 0||se===!0;let me=y(T,rt,ke);ge(t.TEXTURE_CUBE_MAP,T,ke);let ae;if(Ne){$e&&I&&n.texStorage2D(t.TEXTURE_CUBE_MAP,me,xe,rt.width,rt.height);for(let Q=0;Q<6;Q++){ae=re[Q].mipmaps;for(let le=0;le<ae.length;le++){const Pe=ae[le];T.format!==on?De!==null?$e?n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,le,0,0,Pe.width,Pe.height,De,Pe.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,le,xe,Pe.width,Pe.height,0,Pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):$e?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,le,0,0,Pe.width,Pe.height,De,be,Pe.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,le,xe,Pe.width,Pe.height,0,De,be,Pe.data)}}}else{ae=T.mipmaps,$e&&I&&(ae.length>0&&me++,n.texStorage2D(t.TEXTURE_CUBE_MAP,me,xe,re[0].width,re[0].height));for(let Q=0;Q<6;Q++)if(Je){$e?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,re[Q].width,re[Q].height,De,be,re[Q].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,xe,re[Q].width,re[Q].height,0,De,be,re[Q].data);for(let le=0;le<ae.length;le++){const et=ae[le].image[Q].image;$e?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,le+1,0,0,et.width,et.height,De,be,et.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,le+1,xe,et.width,et.height,0,De,be,et.data)}}else{$e?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,De,be,re[Q]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,xe,De,be,re[Q]);for(let le=0;le<ae.length;le++){const Pe=ae[le];$e?n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,le+1,0,0,De,be,Pe.image[Q]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Q,le+1,xe,De,be,Pe.image[Q])}}}E(T,ke)&&M(t.TEXTURE_CUBE_MAP),oe.__version=ne.version,T.onUpdate&&T.onUpdate(T)}L.__version=T.version}function Te(L,T,Y,se,ne,oe){const Ae=s.convert(Y.format,Y.colorSpace),ue=s.convert(Y.type),ve=b(Y.internalFormat,Ae,ue,Y.colorSpace);if(!i.get(T).__hasExternalTextures){const Je=Math.max(1,T.width>>oe),re=Math.max(1,T.height>>oe);ne===t.TEXTURE_3D||ne===t.TEXTURE_2D_ARRAY?n.texImage3D(ne,oe,ve,Je,re,T.depth,0,Ae,ue,null):n.texImage2D(ne,oe,ve,Je,re,0,Ae,ue,null)}n.bindFramebuffer(t.FRAMEBUFFER,L),ot(T)?f.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,se,ne,i.get(Y).__webglTexture,0,je(T)):(ne===t.TEXTURE_2D||ne>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,se,ne,i.get(Y).__webglTexture,oe),n.bindFramebuffer(t.FRAMEBUFFER,null)}function H(L,T,Y){if(t.bindRenderbuffer(t.RENDERBUFFER,L),T.depthBuffer&&!T.stencilBuffer){let se=a===!0?t.DEPTH_COMPONENT24:t.DEPTH_COMPONENT16;if(Y||ot(T)){const ne=T.depthTexture;ne&&ne.isDepthTexture&&(ne.type===tr?se=t.DEPTH_COMPONENT32F:ne.type===er&&(se=t.DEPTH_COMPONENT24));const oe=je(T);ot(T)?f.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,oe,se,T.width,T.height):t.renderbufferStorageMultisample(t.RENDERBUFFER,oe,se,T.width,T.height)}else t.renderbufferStorage(t.RENDERBUFFER,se,T.width,T.height);t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.RENDERBUFFER,L)}else if(T.depthBuffer&&T.stencilBuffer){const se=je(T);Y&&ot(T)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,se,t.DEPTH24_STENCIL8,T.width,T.height):ot(T)?f.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,se,t.DEPTH24_STENCIL8,T.width,T.height):t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_STENCIL,T.width,T.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.RENDERBUFFER,L)}else{const se=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let ne=0;ne<se.length;ne++){const oe=se[ne],Ae=s.convert(oe.format,oe.colorSpace),ue=s.convert(oe.type),ve=b(oe.internalFormat,Ae,ue,oe.colorSpace),Ne=je(T);Y&&ot(T)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ne,ve,T.width,T.height):ot(T)?f.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ne,ve,T.width,T.height):t.renderbufferStorage(t.RENDERBUFFER,ve,T.width,T.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Fe(L,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,L),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(T.depthTexture).__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),W(T.depthTexture,0);const se=i.get(T.depthTexture).__webglTexture,ne=je(T);if(T.depthTexture.format===jr)ot(T)?f.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,se,0,ne):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,se,0);else if(T.depthTexture.format===mo)ot(T)?f.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,se,0,ne):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,se,0);else throw new Error("Unknown depthTexture format")}function ce(L){const T=i.get(L),Y=L.isWebGLCubeRenderTarget===!0;if(L.depthTexture&&!T.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");Fe(T.__webglFramebuffer,L)}else if(Y){T.__webglDepthbuffer=[];for(let se=0;se<6;se++)n.bindFramebuffer(t.FRAMEBUFFER,T.__webglFramebuffer[se]),T.__webglDepthbuffer[se]=t.createRenderbuffer(),H(T.__webglDepthbuffer[se],L,!1)}else n.bindFramebuffer(t.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer=t.createRenderbuffer(),H(T.__webglDepthbuffer,L,!1);n.bindFramebuffer(t.FRAMEBUFFER,null)}function we(L,T,Y){const se=i.get(L);T!==void 0&&Te(se.__webglFramebuffer,L,L.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),Y!==void 0&&ce(L)}function Re(L){const T=L.texture,Y=i.get(L),se=i.get(T);L.addEventListener("dispose",O),L.isWebGLMultipleRenderTargets!==!0&&(se.__webglTexture===void 0&&(se.__webglTexture=t.createTexture()),se.__version=T.version,o.memory.textures++);const ne=L.isWebGLCubeRenderTarget===!0,oe=L.isWebGLMultipleRenderTargets===!0,Ae=S(L)||a;if(ne){Y.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(a&&T.mipmaps&&T.mipmaps.length>0){Y.__webglFramebuffer[ue]=[];for(let ve=0;ve<T.mipmaps.length;ve++)Y.__webglFramebuffer[ue][ve]=t.createFramebuffer()}else Y.__webglFramebuffer[ue]=t.createFramebuffer()}else{if(a&&T.mipmaps&&T.mipmaps.length>0){Y.__webglFramebuffer=[];for(let ue=0;ue<T.mipmaps.length;ue++)Y.__webglFramebuffer[ue]=t.createFramebuffer()}else Y.__webglFramebuffer=t.createFramebuffer();if(oe)if(r.drawBuffers){const ue=L.texture;for(let ve=0,Ne=ue.length;ve<Ne;ve++){const Je=i.get(ue[ve]);Je.__webglTexture===void 0&&(Je.__webglTexture=t.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&L.samples>0&&ot(L)===!1){const ue=oe?T:[T];Y.__webglMultisampledFramebuffer=t.createFramebuffer(),Y.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let ve=0;ve<ue.length;ve++){const Ne=ue[ve];Y.__webglColorRenderbuffer[ve]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,Y.__webglColorRenderbuffer[ve]);const Je=s.convert(Ne.format,Ne.colorSpace),re=s.convert(Ne.type),rt=b(Ne.internalFormat,Je,re,Ne.colorSpace,L.isXRRenderTarget===!0),ke=je(L);t.renderbufferStorageMultisample(t.RENDERBUFFER,ke,rt,L.width,L.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,Y.__webglColorRenderbuffer[ve])}t.bindRenderbuffer(t.RENDERBUFFER,null),L.depthBuffer&&(Y.__webglDepthRenderbuffer=t.createRenderbuffer(),H(Y.__webglDepthRenderbuffer,L,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(ne){n.bindTexture(t.TEXTURE_CUBE_MAP,se.__webglTexture),ge(t.TEXTURE_CUBE_MAP,T,Ae);for(let ue=0;ue<6;ue++)if(a&&T.mipmaps&&T.mipmaps.length>0)for(let ve=0;ve<T.mipmaps.length;ve++)Te(Y.__webglFramebuffer[ue][ve],L,T,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ve);else Te(Y.__webglFramebuffer[ue],L,T,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);E(T,Ae)&&M(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(oe){const ue=L.texture;for(let ve=0,Ne=ue.length;ve<Ne;ve++){const Je=ue[ve],re=i.get(Je);n.bindTexture(t.TEXTURE_2D,re.__webglTexture),ge(t.TEXTURE_2D,Je,Ae),Te(Y.__webglFramebuffer,L,Je,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,0),E(Je,Ae)&&M(t.TEXTURE_2D)}n.unbindTexture()}else{let ue=t.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(a?ue=L.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),n.bindTexture(ue,se.__webglTexture),ge(ue,T,Ae),a&&T.mipmaps&&T.mipmaps.length>0)for(let ve=0;ve<T.mipmaps.length;ve++)Te(Y.__webglFramebuffer[ve],L,T,t.COLOR_ATTACHMENT0,ue,ve);else Te(Y.__webglFramebuffer,L,T,t.COLOR_ATTACHMENT0,ue,0);E(T,Ae)&&M(ue),n.unbindTexture()}L.depthBuffer&&ce(L)}function _t(L){const T=S(L)||a,Y=L.isWebGLMultipleRenderTargets===!0?L.texture:[L.texture];for(let se=0,ne=Y.length;se<ne;se++){const oe=Y[se];if(E(oe,T)){const Ae=L.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,ue=i.get(oe).__webglTexture;n.bindTexture(Ae,ue),M(Ae),n.unbindTexture()}}}function We(L){if(a&&L.samples>0&&ot(L)===!1){const T=L.isWebGLMultipleRenderTargets?L.texture:[L.texture],Y=L.width,se=L.height;let ne=t.COLOR_BUFFER_BIT;const oe=[],Ae=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ue=i.get(L),ve=L.isWebGLMultipleRenderTargets===!0;if(ve)for(let Ne=0;Ne<T.length;Ne++)n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ne,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ne,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let Ne=0;Ne<T.length;Ne++){oe.push(t.COLOR_ATTACHMENT0+Ne),L.depthBuffer&&oe.push(Ae);const Je=ue.__ignoreDepthValues!==void 0?ue.__ignoreDepthValues:!1;if(Je===!1&&(L.depthBuffer&&(ne|=t.DEPTH_BUFFER_BIT),L.stencilBuffer&&(ne|=t.STENCIL_BUFFER_BIT)),ve&&t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,ue.__webglColorRenderbuffer[Ne]),Je===!0&&(t.invalidateFramebuffer(t.READ_FRAMEBUFFER,[Ae]),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[Ae])),ve){const re=i.get(T[Ne]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,re,0)}t.blitFramebuffer(0,0,Y,se,0,0,Y,se,ne,t.NEAREST),m&&t.invalidateFramebuffer(t.READ_FRAMEBUFFER,oe)}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ve)for(let Ne=0;Ne<T.length;Ne++){n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ne,t.RENDERBUFFER,ue.__webglColorRenderbuffer[Ne]);const Je=i.get(T[Ne]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Ne,t.TEXTURE_2D,Je,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}}function je(L){return Math.min(h,L.samples)}function ot(L){const T=i.get(L);return a&&L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Dt(L){const T=o.render.frame;_.get(L)!==T&&(_.set(L,T),L.update())}function Xt(L,T){const Y=L.colorSpace,se=L.format,ne=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||L.format===Lf||Y!==Ii&&Y!==On&&(st.getTransfer(Y)===dt?a===!1?e.has("EXT_sRGB")===!0&&se===on?(L.format=Lf,L.minFilter=St,L.generateMipmaps=!1):T=B0.sRGBToLinear(T):(se!==on||ne!==fr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),T}this.allocateTextureUnit=F,this.resetTextureUnits=k,this.setTexture2D=W,this.setTexture2DArray=U,this.setTexture3D=G,this.setTextureCube=ie,this.rebindTextures=we,this.setupRenderTarget=Re,this.updateRenderTargetMipmap=_t,this.updateMultisampleRenderTarget=We,this.setupDepthRenderbuffer=ce,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=ot}function C2(t,e,n){const i=n.isWebGL2;function r(s,o=On){let a;const l=st.getTransfer(o);if(s===fr)return t.UNSIGNED_BYTE;if(s===U0)return t.UNSIGNED_SHORT_4_4_4_4;if(s===N0)return t.UNSIGNED_SHORT_5_5_5_1;if(s===uE)return t.BYTE;if(s===cE)return t.SHORT;if(s===Xh)return t.UNSIGNED_SHORT;if(s===P0)return t.INT;if(s===er)return t.UNSIGNED_INT;if(s===tr)return t.FLOAT;if(s===Pa)return i?t.HALF_FLOAT:(a=e.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===dE)return t.ALPHA;if(s===on)return t.RGBA;if(s===fE)return t.LUMINANCE;if(s===hE)return t.LUMINANCE_ALPHA;if(s===jr)return t.DEPTH_COMPONENT;if(s===mo)return t.DEPTH_STENCIL;if(s===Lf)return a=e.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(s===pE)return t.RED;if(s===D0)return t.RED_INTEGER;if(s===mE)return t.RG;if(s===I0)return t.RG_INTEGER;if(s===O0)return t.RGBA_INTEGER;if(s===Jc||s===ed||s===td||s===nd)if(l===dt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(s===Jc)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===ed)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===td)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===nd)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===Jc)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===ed)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===td)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===nd)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===jm||s===Xm||s===Ym||s===qm)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===jm)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Xm)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Ym)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===qm)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===gE)return a=e.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===$m||s===Km)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(s===$m)return l===dt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(s===Km)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===Zm||s===Qm||s===Jm||s===eg||s===tg||s===ng||s===ig||s===rg||s===sg||s===og||s===ag||s===lg||s===ug||s===cg)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(s===Zm)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===Qm)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===Jm)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===eg)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===tg)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===ng)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===ig)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===rg)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===sg)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===og)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===ag)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===lg)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===ug)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===cg)return l===dt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===id||s===dg||s===fg)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(s===id)return l===dt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===dg)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===fg)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===vE||s===hg||s===pg||s===mg)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(s===id)return a.COMPRESSED_RED_RGTC1_EXT;if(s===hg)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===pg)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===mg)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===Wr?i?t.UNSIGNED_INT_24_8:(a=e.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):t[s]!==void 0?t[s]:null}return{convert:r}}class R2 extends In{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class zs extends Gt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const b2={type:"move"};class Rd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new j,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new j),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new j,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new j),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,u=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(u&&e.hand){o=!0;for(const x of e.hand.values()){const p=n.getJointPose(x,i),d=this._getHandJoint(u,x);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const c=u.joints["index-finger-tip"],h=u.joints["thumb-tip"],f=c.position.distanceTo(h.position),m=.02,_=.005;u.inputState.pinching&&f>m+_?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&f<=m-_&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(b2)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),u!==null&&(u.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new zs;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}class L2 extends Qt{constructor(e,n,i,r,s,o,a,l,u,c){if(c=c!==void 0?c:jr,c!==jr&&c!==mo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&c===jr&&(i=er),i===void 0&&c===mo&&(i=Wr),super(null,r,s,o,a,l,c,i,u),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=a!==void 0?a:sn,this.minFilter=l!==void 0?l:sn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class P2 extends wo{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,u=null,c=null,h=null,f=null,m=null,_=null;const x=n.getContextAttributes();let p=null,d=null;const v=[],g=[],S=new In;S.layers.enable(1),S.viewport=new kt;const A=new In;A.layers.enable(2),A.viewport=new kt;const E=[S,A],M=new R2;M.layers.enable(1),M.layers.enable(2);let b=null,y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let G=v[U];return G===void 0&&(G=new Rd,v[U]=G),G.getTargetRaySpace()},this.getControllerGrip=function(U){let G=v[U];return G===void 0&&(G=new Rd,v[U]=G),G.getGripSpace()},this.getHand=function(U){let G=v[U];return G===void 0&&(G=new Rd,v[U]=G),G.getHandSpace()};function w(U){const G=g.indexOf(U.inputSource);if(G===-1)return;const ie=v[G];ie!==void 0&&(ie.update(U.inputSource,U.frame,u||o),ie.dispatchEvent({type:U.type,data:U.inputSource}))}function N(){r.removeEventListener("select",w),r.removeEventListener("selectstart",w),r.removeEventListener("selectend",w),r.removeEventListener("squeeze",w),r.removeEventListener("squeezestart",w),r.removeEventListener("squeezeend",w),r.removeEventListener("end",N),r.removeEventListener("inputsourceschange",O);for(let U=0;U<v.length;U++){const G=g[U];G!==null&&(g[U]=null,v[U].disconnect(G))}b=null,y=null,e.setRenderTarget(p),m=null,f=null,h=null,r=null,d=null,W.stop(),i.isPresenting=!1,i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){s=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){a=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||o},this.setReferenceSpace=function(U){u=U},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return h},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(U){if(r=U,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",w),r.addEventListener("selectstart",w),r.addEventListener("selectend",w),r.addEventListener("squeeze",w),r.addEventListener("squeezestart",w),r.addEventListener("squeezeend",w),r.addEventListener("end",N),r.addEventListener("inputsourceschange",O),x.xrCompatible!==!0&&await n.makeXRCompatible(),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const G={antialias:r.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,n,G),r.updateRenderState({baseLayer:m}),d=new ts(m.framebufferWidth,m.framebufferHeight,{format:on,type:fr,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil})}else{let G=null,ie=null,ee=null;x.depth&&(ee=x.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,G=x.stencil?mo:jr,ie=x.stencil?Wr:er);const J={colorFormat:n.RGBA8,depthFormat:ee,scaleFactor:s};h=new XRWebGLBinding(r,n),f=h.createProjectionLayer(J),r.updateRenderState({layers:[f]}),d=new ts(f.textureWidth,f.textureHeight,{format:on,type:fr,depthTexture:new L2(f.textureWidth,f.textureHeight,ie,void 0,void 0,void 0,void 0,void 0,void 0,G),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0});const de=e.properties.get(d);de.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(l),u=null,o=await r.requestReferenceSpace(a),W.setContext(r),W.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function O(U){for(let G=0;G<U.removed.length;G++){const ie=U.removed[G],ee=g.indexOf(ie);ee>=0&&(g[ee]=null,v[ee].disconnect(ie))}for(let G=0;G<U.added.length;G++){const ie=U.added[G];let ee=g.indexOf(ie);if(ee===-1){for(let de=0;de<v.length;de++)if(de>=g.length){g.push(ie),ee=de;break}else if(g[de]===null){g[de]=ie,ee=de;break}if(ee===-1)break}const J=v[ee];J&&J.connect(ie)}}const V=new j,P=new j;function D(U,G,ie){V.setFromMatrixPosition(G.matrixWorld),P.setFromMatrixPosition(ie.matrixWorld);const ee=V.distanceTo(P),J=G.projectionMatrix.elements,de=ie.projectionMatrix.elements,ge=J[14]/(J[10]-1),fe=J[14]/(J[10]+1),Se=(J[9]+1)/J[5],Ge=(J[9]-1)/J[5],Te=(J[8]-1)/J[0],H=(de[8]+1)/de[0],Fe=ge*Te,ce=ge*H,we=ee/(-Te+H),Re=we*-Te;G.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(Re),U.translateZ(we),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert();const _t=ge+we,We=fe+we,je=Fe-Re,ot=ce+(ee-Re),Dt=Se*fe/We*_t,Xt=Ge*fe/We*_t;U.projectionMatrix.makePerspective(je,ot,Dt,Xt,_t,We),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}function X(U,G){G===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(G.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(r===null)return;M.near=A.near=S.near=U.near,M.far=A.far=S.far=U.far,(b!==M.near||y!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),b=M.near,y=M.far);const G=U.parent,ie=M.cameras;X(M,G);for(let ee=0;ee<ie.length;ee++)X(ie[ee],G);ie.length===2?D(M,S,A):M.projectionMatrix.copy(S.projectionMatrix),k(U,M,G)};function k(U,G,ie){ie===null?U.matrix.copy(G.matrixWorld):(U.matrix.copy(ie.matrixWorld),U.matrix.invert(),U.matrix.multiply(G.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(G.projectionMatrix),U.projectionMatrixInverse.copy(G.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=Pf*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(U){l=U,f!==null&&(f.fixedFoveation=U),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=U)};let F=null;function z(U,G){if(c=G.getViewerPose(u||o),_=G,c!==null){const ie=c.views;m!==null&&(e.setRenderTargetFramebuffer(d,m.framebuffer),e.setRenderTarget(d));let ee=!1;ie.length!==M.cameras.length&&(M.cameras.length=0,ee=!0);for(let J=0;J<ie.length;J++){const de=ie[J];let ge=null;if(m!==null)ge=m.getViewport(de);else{const Se=h.getViewSubImage(f,de);ge=Se.viewport,J===0&&(e.setRenderTargetTextures(d,Se.colorTexture,f.ignoreDepthValues?void 0:Se.depthStencilTexture),e.setRenderTarget(d))}let fe=E[J];fe===void 0&&(fe=new In,fe.layers.enable(J),fe.viewport=new kt,E[J]=fe),fe.matrix.fromArray(de.transform.matrix),fe.matrix.decompose(fe.position,fe.quaternion,fe.scale),fe.projectionMatrix.fromArray(de.projectionMatrix),fe.projectionMatrixInverse.copy(fe.projectionMatrix).invert(),fe.viewport.set(ge.x,ge.y,ge.width,ge.height),J===0&&(M.matrix.copy(fe.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ee===!0&&M.cameras.push(fe)}}for(let ie=0;ie<v.length;ie++){const ee=g[ie],J=v[ie];ee!==null&&J!==void 0&&J.update(ee,G,u||o)}F&&F(U,G),G.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:G}),_=null}const W=new K0;W.setAnimationLoop(z),this.setAnimationLoop=function(U){F=U},this.dispose=function(){}}}function U2(t,e){function n(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function i(p,d){d.color.getRGB(p.fogColor.value,q0(t)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function r(p,d,v,g,S){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(p,d):d.isMeshToonMaterial?(s(p,d),h(p,d)):d.isMeshPhongMaterial?(s(p,d),c(p,d)):d.isMeshStandardMaterial?(s(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,S)):d.isMeshMatcapMaterial?(s(p,d),_(p,d)):d.isMeshDepthMaterial?s(p,d):d.isMeshDistanceMaterial?(s(p,d),x(p,d)):d.isMeshNormalMaterial?s(p,d):d.isLineBasicMaterial?(o(p,d),d.isLineDashedMaterial&&a(p,d)):d.isPointsMaterial?l(p,d,v,g):d.isSpriteMaterial?u(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,n(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,n(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,n(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===_n&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,n(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===_n&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,n(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,n(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const v=e.get(d).envMap;if(v&&(p.envMap.value=v,p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap){p.lightMap.value=d.lightMap;const g=t._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=d.lightMapIntensity*g,n(d.lightMap,p.lightMapTransform)}d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,p.aoMapTransform))}function o(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,n(d.map,p.mapTransform))}function a(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,v,g){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*v,p.scale.value=g*.5,d.map&&(p.map.value=d.map,n(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,n(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function u(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,n(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,n(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function h(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,p.roughnessMapTransform)),e.get(d).envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,v){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===_n&&p.clearcoatNormalScale.value.negate())),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,d){d.matcap&&(p.matcap.value=d.matcap)}function x(p,d){const v=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function N2(t,e,n,i){let r={},s={},o=[];const a=n.isWebGL2?t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(v,g){const S=g.program;i.uniformBlockBinding(v,S)}function u(v,g){let S=r[v.id];S===void 0&&(_(v),S=c(v),r[v.id]=S,v.addEventListener("dispose",p));const A=g.program;i.updateUBOMapping(v,A);const E=e.render.frame;s[v.id]!==E&&(f(v),s[v.id]=E)}function c(v){const g=h();v.__bindingPointIndex=g;const S=t.createBuffer(),A=v.__size,E=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,S),t.bufferData(t.UNIFORM_BUFFER,A,E),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,g,S),S}function h(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const g=r[v.id],S=v.uniforms,A=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,g);for(let E=0,M=S.length;E<M;E++){const b=S[E];if(m(b,E,A)===!0){const y=b.__offset,w=Array.isArray(b.value)?b.value:[b.value];let N=0;for(let O=0;O<w.length;O++){const V=w[O],P=x(V);typeof V=="number"?(b.__data[0]=V,t.bufferSubData(t.UNIFORM_BUFFER,y+N,b.__data)):V.isMatrix3?(b.__data[0]=V.elements[0],b.__data[1]=V.elements[1],b.__data[2]=V.elements[2],b.__data[3]=V.elements[0],b.__data[4]=V.elements[3],b.__data[5]=V.elements[4],b.__data[6]=V.elements[5],b.__data[7]=V.elements[0],b.__data[8]=V.elements[6],b.__data[9]=V.elements[7],b.__data[10]=V.elements[8],b.__data[11]=V.elements[0]):(V.toArray(b.__data,N),N+=P.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,y,b.__data)}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function m(v,g,S){const A=v.value;if(S[g]===void 0){if(typeof A=="number")S[g]=A;else{const E=Array.isArray(A)?A:[A],M=[];for(let b=0;b<E.length;b++)M.push(E[b].clone());S[g]=M}return!0}else if(typeof A=="number"){if(S[g]!==A)return S[g]=A,!0}else{const E=Array.isArray(S[g])?S[g]:[S[g]],M=Array.isArray(A)?A:[A];for(let b=0;b<E.length;b++){const y=E[b];if(y.equals(M[b])===!1)return y.copy(M[b]),!0}}return!1}function _(v){const g=v.uniforms;let S=0;const A=16;let E=0;for(let M=0,b=g.length;M<b;M++){const y=g[M],w={boundary:0,storage:0},N=Array.isArray(y.value)?y.value:[y.value];for(let O=0,V=N.length;O<V;O++){const P=N[O],D=x(P);w.boundary+=D.boundary,w.storage+=D.storage}if(y.__data=new Float32Array(w.storage/Float32Array.BYTES_PER_ELEMENT),y.__offset=S,M>0){E=S%A;const O=A-E;E!==0&&O-w.boundary<0&&(S+=A-E,y.__offset=S)}S+=w.storage}return E=S%A,E>0&&(S+=A-E),v.__size=S,v.__cache={},this}function x(v){const g={boundary:0,storage:0};return typeof v=="number"?(g.boundary=4,g.storage=4):v.isVector2?(g.boundary=8,g.storage=8):v.isVector3||v.isColor?(g.boundary=16,g.storage=12):v.isVector4?(g.boundary=16,g.storage=16):v.isMatrix3?(g.boundary=48,g.storage=48):v.isMatrix4?(g.boundary=64,g.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),g}function p(v){const g=v.target;g.removeEventListener("dispose",p);const S=o.indexOf(g.__bindingPointIndex);o.splice(S,1),t.deleteBuffer(r[g.id]),delete r[g.id],delete s[g.id]}function d(){for(const v in r)t.deleteBuffer(r[v]);o=[],r={},s={}}return{bind:l,update:u,dispose:d}}class ny{constructor(e={}){const{canvas:n=LE(),context:i=null,depth:r=!0,stencil:s=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:u=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let f;i!==null?f=i.getContextAttributes().alpha:f=o;const m=new Uint32Array(4),_=new Int32Array(4);let x=null,p=null;const d=[],v=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=at,this._useLegacyLights=!1,this.toneMapping=dr,this.toneMappingExposure=1;const g=this;let S=!1,A=0,E=0,M=null,b=-1,y=null;const w=new kt,N=new kt;let O=null;const V=new Qe(0);let P=0,D=n.width,X=n.height,k=1,F=null,z=null;const W=new kt(0,0,D,X),U=new kt(0,0,D,X);let G=!1;const ie=new Kh;let ee=!1,J=!1,de=null;const ge=new Pt,fe=new nt,Se=new j,Ge={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Te(){return M===null?k:1}let H=i;function Fe(C,B){for(let q=0;q<C.length;q++){const K=C[q],Z=n.getContext(K,B);if(Z!==null)return Z}return null}try{const C={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:u,powerPreference:c,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${jh}`),n.addEventListener("webglcontextlost",$e,!1),n.addEventListener("webglcontextrestored",I,!1),n.addEventListener("webglcontextcreationerror",me,!1),H===null){const B=["webgl2","webgl","experimental-webgl"];if(g.isWebGL1Renderer===!0&&B.shift(),H=Fe(B,C),H===null)throw Fe(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&H instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),H.getShaderPrecisionFormat===void 0&&(H.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let ce,we,Re,_t,We,je,ot,Dt,Xt,L,T,Y,se,ne,oe,Ae,ue,ve,Ne,Je,re,rt,ke,De;function be(){ce=new GT(H),we=new FT(H,ce,e),ce.init(we),rt=new C2(H,ce,we),Re=new T2(H,ce,we),_t=new XT(H),We=new d2,je=new A2(H,ce,Re,We,we,rt,_t),ot=new zT(g),Dt=new VT(g),Xt=new nw(H,we),ke=new IT(H,ce,Xt,we),L=new WT(H,Xt,_t,ke),T=new KT(H,L,Xt,_t),Ne=new $T(H,we,je),Ae=new kT(We),Y=new c2(g,ot,Dt,ce,we,ke,Ae),se=new U2(g,We),ne=new h2,oe=new y2(ce,we),ve=new DT(g,ot,Dt,Re,T,f,l),ue=new w2(g,T,we),De=new N2(H,_t,we,Re),Je=new OT(H,ce,_t,we),re=new jT(H,ce,_t,we),_t.programs=Y.programs,g.capabilities=we,g.extensions=ce,g.properties=We,g.renderLists=ne,g.shadowMap=ue,g.state=Re,g.info=_t}be();const xe=new P2(g,H);this.xr=xe,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const C=ce.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=ce.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(C){C!==void 0&&(k=C,this.setSize(D,X,!1))},this.getSize=function(C){return C.set(D,X)},this.setSize=function(C,B,q=!0){if(xe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=C,X=B,n.width=Math.floor(C*k),n.height=Math.floor(B*k),q===!0&&(n.style.width=C+"px",n.style.height=B+"px"),this.setViewport(0,0,C,B)},this.getDrawingBufferSize=function(C){return C.set(D*k,X*k).floor()},this.setDrawingBufferSize=function(C,B,q){D=C,X=B,k=q,n.width=Math.floor(C*q),n.height=Math.floor(B*q),this.setViewport(0,0,C,B)},this.getCurrentViewport=function(C){return C.copy(w)},this.getViewport=function(C){return C.copy(W)},this.setViewport=function(C,B,q,K){C.isVector4?W.set(C.x,C.y,C.z,C.w):W.set(C,B,q,K),Re.viewport(w.copy(W).multiplyScalar(k).floor())},this.getScissor=function(C){return C.copy(U)},this.setScissor=function(C,B,q,K){C.isVector4?U.set(C.x,C.y,C.z,C.w):U.set(C,B,q,K),Re.scissor(N.copy(U).multiplyScalar(k).floor())},this.getScissorTest=function(){return G},this.setScissorTest=function(C){Re.setScissorTest(G=C)},this.setOpaqueSort=function(C){F=C},this.setTransparentSort=function(C){z=C},this.getClearColor=function(C){return C.copy(ve.getClearColor())},this.setClearColor=function(){ve.setClearColor.apply(ve,arguments)},this.getClearAlpha=function(){return ve.getClearAlpha()},this.setClearAlpha=function(){ve.setClearAlpha.apply(ve,arguments)},this.clear=function(C=!0,B=!0,q=!0){let K=0;if(C){let Z=!1;if(M!==null){const _e=M.texture.format;Z=_e===O0||_e===I0||_e===D0}if(Z){const _e=M.texture.type,Ce=_e===fr||_e===er||_e===Xh||_e===Wr||_e===U0||_e===N0,Ue=ve.getClearColor(),Ie=ve.getClearAlpha(),Ve=Ue.r,ze=Ue.g,Be=Ue.b;Ce?(m[0]=Ve,m[1]=ze,m[2]=Be,m[3]=Ie,H.clearBufferuiv(H.COLOR,0,m)):(_[0]=Ve,_[1]=ze,_[2]=Be,_[3]=Ie,H.clearBufferiv(H.COLOR,0,_))}else K|=H.COLOR_BUFFER_BIT}B&&(K|=H.DEPTH_BUFFER_BIT),q&&(K|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",$e,!1),n.removeEventListener("webglcontextrestored",I,!1),n.removeEventListener("webglcontextcreationerror",me,!1),ne.dispose(),oe.dispose(),We.dispose(),ot.dispose(),Dt.dispose(),T.dispose(),ke.dispose(),De.dispose(),Y.dispose(),xe.dispose(),xe.removeEventListener("sessionstart",Pn),xe.removeEventListener("sessionend",lt),de&&(de.dispose(),de=null),en.stop()};function $e(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function I(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const C=_t.autoReset,B=ue.enabled,q=ue.autoUpdate,K=ue.needsUpdate,Z=ue.type;be(),_t.autoReset=C,ue.enabled=B,ue.autoUpdate=q,ue.needsUpdate=K,ue.type=Z}function me(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function ae(C){const B=C.target;B.removeEventListener("dispose",ae),Q(B)}function Q(C){le(C),We.remove(C)}function le(C){const B=We.get(C).programs;B!==void 0&&(B.forEach(function(q){Y.releaseProgram(q)}),C.isShaderMaterial&&Y.releaseShaderCache(C))}this.renderBufferDirect=function(C,B,q,K,Z,_e){B===null&&(B=Ge);const Ce=Z.isMesh&&Z.matrixWorld.determinant()<0,Ue=Xy(C,B,q,K,Z);Re.setMaterial(K,Ce);let Ie=q.index,Ve=1;if(K.wireframe===!0){if(Ie=L.getWireframeAttribute(q),Ie===void 0)return;Ve=2}const ze=q.drawRange,Be=q.attributes.position;let Mt=ze.start*Ve,yn=(ze.start+ze.count)*Ve;_e!==null&&(Mt=Math.max(Mt,_e.start*Ve),yn=Math.min(yn,(_e.start+_e.count)*Ve)),Ie!==null?(Mt=Math.max(Mt,0),yn=Math.min(yn,Ie.count)):Be!=null&&(Mt=Math.max(Mt,0),yn=Math.min(yn,Be.count));const It=yn-Mt;if(It<0||It===1/0)return;ke.setup(Z,K,Ue,q,Ie);let hi,yt=Je;if(Ie!==null&&(hi=Xt.get(Ie),yt=re,yt.setIndex(hi)),Z.isMesh)K.wireframe===!0?(Re.setLineWidth(K.wireframeLinewidth*Te()),yt.setMode(H.LINES)):yt.setMode(H.TRIANGLES);else if(Z.isLine){let qe=K.linewidth;qe===void 0&&(qe=1),Re.setLineWidth(qe*Te()),Z.isLineSegments?yt.setMode(H.LINES):Z.isLineLoop?yt.setMode(H.LINE_LOOP):yt.setMode(H.LINE_STRIP)}else Z.isPoints?yt.setMode(H.POINTS):Z.isSprite&&yt.setMode(H.TRIANGLES);if(Z.isInstancedMesh)yt.renderInstances(Mt,It,Z.count);else if(q.isInstancedBufferGeometry){const qe=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Mc=Math.min(q.instanceCount,qe);yt.renderInstances(Mt,It,Mc)}else yt.render(Mt,It)};function Pe(C,B,q){C.transparent===!0&&C.side===wi&&C.forceSinglePass===!1?(C.side=_n,C.needsUpdate=!0,Ja(C,B,q),C.side=vr,C.needsUpdate=!0,Ja(C,B,q),C.side=wi):Ja(C,B,q)}this.compile=function(C,B,q=null){q===null&&(q=C),p=oe.get(q),p.init(),v.push(p),q.traverseVisible(function(Z){Z.isLight&&Z.layers.test(B.layers)&&(p.pushLight(Z),Z.castShadow&&p.pushShadow(Z))}),C!==q&&C.traverseVisible(function(Z){Z.isLight&&Z.layers.test(B.layers)&&(p.pushLight(Z),Z.castShadow&&p.pushShadow(Z))}),p.setupLights(g._useLegacyLights);const K=new Set;return C.traverse(function(Z){const _e=Z.material;if(_e)if(Array.isArray(_e))for(let Ce=0;Ce<_e.length;Ce++){const Ue=_e[Ce];Pe(Ue,q,Z),K.add(Ue)}else Pe(_e,q,Z),K.add(_e)}),v.pop(),p=null,K},this.compileAsync=function(C,B,q=null){const K=this.compile(C,B,q);return new Promise(Z=>{function _e(){if(K.forEach(function(Ce){We.get(Ce).currentProgram.isReady()&&K.delete(Ce)}),K.size===0){Z(C);return}setTimeout(_e,10)}ce.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let et=null;function Tt(C){et&&et(C)}function Pn(){en.stop()}function lt(){en.start()}const en=new K0;en.setAnimationLoop(Tt),typeof self<"u"&&en.setContext(self),this.setAnimationLoop=function(C){et=C,xe.setAnimationLoop(C),C===null?en.stop():en.start()},xe.addEventListener("sessionstart",Pn),xe.addEventListener("sessionend",lt),this.render=function(C,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),xe.enabled===!0&&xe.isPresenting===!0&&(xe.cameraAutoUpdate===!0&&xe.updateCamera(B),B=xe.getCamera()),C.isScene===!0&&C.onBeforeRender(g,C,B,M),p=oe.get(C,v.length),p.init(),v.push(p),ge.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),ie.setFromProjectionMatrix(ge),J=this.localClippingEnabled,ee=Ae.init(this.clippingPlanes,J),x=ne.get(C,d.length),x.init(),d.push(x),ti(C,B,0,g.sortObjects),x.finish(),g.sortObjects===!0&&x.sort(F,z),this.info.render.frame++,ee===!0&&Ae.beginShadows();const q=p.state.shadowsArray;if(ue.render(q,C,B),ee===!0&&Ae.endShadows(),this.info.autoReset===!0&&this.info.reset(),ve.render(x,C),p.setupLights(g._useLegacyLights),B.isArrayCamera){const K=B.cameras;for(let Z=0,_e=K.length;Z<_e;Z++){const Ce=K[Z];Ep(x,C,Ce,Ce.viewport)}}else Ep(x,C,B);M!==null&&(je.updateMultisampleRenderTarget(M),je.updateRenderTargetMipmap(M)),C.isScene===!0&&C.onAfterRender(g,C,B),ke.resetDefaultState(),b=-1,y=null,v.pop(),v.length>0?p=v[v.length-1]:p=null,d.pop(),d.length>0?x=d[d.length-1]:x=null};function ti(C,B,q,K){if(C.visible===!1)return;if(C.layers.test(B.layers)){if(C.isGroup)q=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(B);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||ie.intersectsSprite(C)){K&&Se.setFromMatrixPosition(C.matrixWorld).applyMatrix4(ge);const Ce=T.update(C),Ue=C.material;Ue.visible&&x.push(C,Ce,Ue,q,Se.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||ie.intersectsObject(C))){const Ce=T.update(C),Ue=C.material;if(K&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Se.copy(C.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),Se.copy(Ce.boundingSphere.center)),Se.applyMatrix4(C.matrixWorld).applyMatrix4(ge)),Array.isArray(Ue)){const Ie=Ce.groups;for(let Ve=0,ze=Ie.length;Ve<ze;Ve++){const Be=Ie[Ve],Mt=Ue[Be.materialIndex];Mt&&Mt.visible&&x.push(C,Ce,Mt,q,Se.z,Be)}}else Ue.visible&&x.push(C,Ce,Ue,q,Se.z,null)}}const _e=C.children;for(let Ce=0,Ue=_e.length;Ce<Ue;Ce++)ti(_e[Ce],B,q,K)}function Ep(C,B,q,K){const Z=C.opaque,_e=C.transmissive,Ce=C.transparent;p.setupLightsView(q),ee===!0&&Ae.setGlobalState(g.clippingPlanes,q),_e.length>0&&jy(Z,_e,B,q),K&&Re.viewport(w.copy(K)),Z.length>0&&Qa(Z,B,q),_e.length>0&&Qa(_e,B,q),Ce.length>0&&Qa(Ce,B,q),Re.buffers.depth.setTest(!0),Re.buffers.depth.setMask(!0),Re.buffers.color.setMask(!0),Re.setPolygonOffset(!1)}function jy(C,B,q,K){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;const _e=we.isWebGL2;de===null&&(de=new ts(1,1,{generateMipmaps:!0,type:ce.has("EXT_color_buffer_half_float")?Pa:fr,minFilter:La,samples:_e?4:0})),g.getDrawingBufferSize(fe),_e?de.setSize(fe.x,fe.y):de.setSize(Uf(fe.x),Uf(fe.y));const Ce=g.getRenderTarget();g.setRenderTarget(de),g.getClearColor(V),P=g.getClearAlpha(),P<1&&g.setClearColor(16777215,.5),g.clear();const Ue=g.toneMapping;g.toneMapping=dr,Qa(C,q,K),je.updateMultisampleRenderTarget(de),je.updateRenderTargetMipmap(de);let Ie=!1;for(let Ve=0,ze=B.length;Ve<ze;Ve++){const Be=B[Ve],Mt=Be.object,yn=Be.geometry,It=Be.material,hi=Be.group;if(It.side===wi&&Mt.layers.test(K.layers)){const yt=It.side;It.side=_n,It.needsUpdate=!0,wp(Mt,q,K,yn,It,hi),It.side=yt,It.needsUpdate=!0,Ie=!0}}Ie===!0&&(je.updateMultisampleRenderTarget(de),je.updateRenderTargetMipmap(de)),g.setRenderTarget(Ce),g.setClearColor(V,P),g.toneMapping=Ue}function Qa(C,B,q){const K=B.isScene===!0?B.overrideMaterial:null;for(let Z=0,_e=C.length;Z<_e;Z++){const Ce=C[Z],Ue=Ce.object,Ie=Ce.geometry,Ve=K===null?Ce.material:K,ze=Ce.group;Ue.layers.test(q.layers)&&wp(Ue,B,q,Ie,Ve,ze)}}function wp(C,B,q,K,Z,_e){C.onBeforeRender(g,B,q,K,Z,_e),C.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),Z.onBeforeRender(g,B,q,K,C,_e),Z.transparent===!0&&Z.side===wi&&Z.forceSinglePass===!1?(Z.side=_n,Z.needsUpdate=!0,g.renderBufferDirect(q,B,K,Z,C,_e),Z.side=vr,Z.needsUpdate=!0,g.renderBufferDirect(q,B,K,Z,C,_e),Z.side=wi):g.renderBufferDirect(q,B,K,Z,C,_e),C.onAfterRender(g,B,q,K,Z,_e)}function Ja(C,B,q){B.isScene!==!0&&(B=Ge);const K=We.get(C),Z=p.state.lights,_e=p.state.shadowsArray,Ce=Z.state.version,Ue=Y.getParameters(C,Z.state,_e,B,q),Ie=Y.getProgramCacheKey(Ue);let Ve=K.programs;K.environment=C.isMeshStandardMaterial?B.environment:null,K.fog=B.fog,K.envMap=(C.isMeshStandardMaterial?Dt:ot).get(C.envMap||K.environment),Ve===void 0&&(C.addEventListener("dispose",ae),Ve=new Map,K.programs=Ve);let ze=Ve.get(Ie);if(ze!==void 0){if(K.currentProgram===ze&&K.lightsStateVersion===Ce)return Ap(C,Ue),ze}else Ue.uniforms=Y.getUniforms(C),C.onBuild(q,Ue,g),C.onBeforeCompile(Ue,g),ze=Y.acquireProgram(Ue,Ie),Ve.set(Ie,ze),K.uniforms=Ue.uniforms;const Be=K.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Be.clippingPlanes=Ae.uniform),Ap(C,Ue),K.needsLights=qy(C),K.lightsStateVersion=Ce,K.needsLights&&(Be.ambientLightColor.value=Z.state.ambient,Be.lightProbe.value=Z.state.probe,Be.directionalLights.value=Z.state.directional,Be.directionalLightShadows.value=Z.state.directionalShadow,Be.spotLights.value=Z.state.spot,Be.spotLightShadows.value=Z.state.spotShadow,Be.rectAreaLights.value=Z.state.rectArea,Be.ltc_1.value=Z.state.rectAreaLTC1,Be.ltc_2.value=Z.state.rectAreaLTC2,Be.pointLights.value=Z.state.point,Be.pointLightShadows.value=Z.state.pointShadow,Be.hemisphereLights.value=Z.state.hemi,Be.directionalShadowMap.value=Z.state.directionalShadowMap,Be.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,Be.spotShadowMap.value=Z.state.spotShadowMap,Be.spotLightMatrix.value=Z.state.spotLightMatrix,Be.spotLightMap.value=Z.state.spotLightMap,Be.pointShadowMap.value=Z.state.pointShadowMap,Be.pointShadowMatrix.value=Z.state.pointShadowMatrix),K.currentProgram=ze,K.uniformsList=null,ze}function Tp(C){if(C.uniformsList===null){const B=C.currentProgram.getUniforms();C.uniformsList=Jl.seqWithValue(B.seq,C.uniforms)}return C.uniformsList}function Ap(C,B){const q=We.get(C);q.outputColorSpace=B.outputColorSpace,q.instancing=B.instancing,q.instancingColor=B.instancingColor,q.skinning=B.skinning,q.morphTargets=B.morphTargets,q.morphNormals=B.morphNormals,q.morphColors=B.morphColors,q.morphTargetsCount=B.morphTargetsCount,q.numClippingPlanes=B.numClippingPlanes,q.numIntersection=B.numClipIntersection,q.vertexAlphas=B.vertexAlphas,q.vertexTangents=B.vertexTangents,q.toneMapping=B.toneMapping}function Xy(C,B,q,K,Z){B.isScene!==!0&&(B=Ge),je.resetTextureUnits();const _e=B.fog,Ce=K.isMeshStandardMaterial?B.environment:null,Ue=M===null?g.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:Ii,Ie=(K.isMeshStandardMaterial?Dt:ot).get(K.envMap||Ce),Ve=K.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,ze=!!q.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Be=!!q.morphAttributes.position,Mt=!!q.morphAttributes.normal,yn=!!q.morphAttributes.color;let It=dr;K.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(It=g.toneMapping);const hi=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,yt=hi!==void 0?hi.length:0,qe=We.get(K),Mc=p.state.lights;if(ee===!0&&(J===!0||C!==y)){const xn=C===y&&K.id===b;Ae.setState(K,C,xn)}let At=!1;K.version===qe.__version?(qe.needsLights&&qe.lightsStateVersion!==Mc.state.version||qe.outputColorSpace!==Ue||Z.isInstancedMesh&&qe.instancing===!1||!Z.isInstancedMesh&&qe.instancing===!0||Z.isSkinnedMesh&&qe.skinning===!1||!Z.isSkinnedMesh&&qe.skinning===!0||Z.isInstancedMesh&&qe.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&qe.instancingColor===!1&&Z.instanceColor!==null||qe.envMap!==Ie||K.fog===!0&&qe.fog!==_e||qe.numClippingPlanes!==void 0&&(qe.numClippingPlanes!==Ae.numPlanes||qe.numIntersection!==Ae.numIntersection)||qe.vertexAlphas!==Ve||qe.vertexTangents!==ze||qe.morphTargets!==Be||qe.morphNormals!==Mt||qe.morphColors!==yn||qe.toneMapping!==It||we.isWebGL2===!0&&qe.morphTargetsCount!==yt)&&(At=!0):(At=!0,qe.__version=K.version);let Mr=qe.currentProgram;At===!0&&(Mr=Ja(K,B,Z));let Cp=!1,Ao=!1,Ec=!1;const tn=Mr.getUniforms(),Er=qe.uniforms;if(Re.useProgram(Mr.program)&&(Cp=!0,Ao=!0,Ec=!0),K.id!==b&&(b=K.id,Ao=!0),Cp||y!==C){tn.setValue(H,"projectionMatrix",C.projectionMatrix),tn.setValue(H,"viewMatrix",C.matrixWorldInverse);const xn=tn.map.cameraPosition;xn!==void 0&&xn.setValue(H,Se.setFromMatrixPosition(C.matrixWorld)),we.logarithmicDepthBuffer&&tn.setValue(H,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&tn.setValue(H,"isOrthographic",C.isOrthographicCamera===!0),y!==C&&(y=C,Ao=!0,Ec=!0)}if(Z.isSkinnedMesh){tn.setOptional(H,Z,"bindMatrix"),tn.setOptional(H,Z,"bindMatrixInverse");const xn=Z.skeleton;xn&&(we.floatVertexTextures?(xn.boneTexture===null&&xn.computeBoneTexture(),tn.setValue(H,"boneTexture",xn.boneTexture,je),tn.setValue(H,"boneTextureSize",xn.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}const wc=q.morphAttributes;if((wc.position!==void 0||wc.normal!==void 0||wc.color!==void 0&&we.isWebGL2===!0)&&Ne.update(Z,q,Mr),(Ao||qe.receiveShadow!==Z.receiveShadow)&&(qe.receiveShadow=Z.receiveShadow,tn.setValue(H,"receiveShadow",Z.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(Er.envMap.value=Ie,Er.flipEnvMap.value=Ie.isCubeTexture&&Ie.isRenderTargetTexture===!1?-1:1),Ao&&(tn.setValue(H,"toneMappingExposure",g.toneMappingExposure),qe.needsLights&&Yy(Er,Ec),_e&&K.fog===!0&&se.refreshFogUniforms(Er,_e),se.refreshMaterialUniforms(Er,K,k,X,de),Jl.upload(H,Tp(qe),Er,je)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(Jl.upload(H,Tp(qe),Er,je),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&tn.setValue(H,"center",Z.center),tn.setValue(H,"modelViewMatrix",Z.modelViewMatrix),tn.setValue(H,"normalMatrix",Z.normalMatrix),tn.setValue(H,"modelMatrix",Z.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){const xn=K.uniformsGroups;for(let Tc=0,$y=xn.length;Tc<$y;Tc++)if(we.isWebGL2){const Rp=xn[Tc];De.update(Rp,Mr),De.bind(Rp,Mr)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Mr}function Yy(C,B){C.ambientLightColor.needsUpdate=B,C.lightProbe.needsUpdate=B,C.directionalLights.needsUpdate=B,C.directionalLightShadows.needsUpdate=B,C.pointLights.needsUpdate=B,C.pointLightShadows.needsUpdate=B,C.spotLights.needsUpdate=B,C.spotLightShadows.needsUpdate=B,C.rectAreaLights.needsUpdate=B,C.hemisphereLights.needsUpdate=B}function qy(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(C,B,q){We.get(C.texture).__webglTexture=B,We.get(C.depthTexture).__webglTexture=q;const K=We.get(C);K.__hasExternalTextures=!0,K.__hasExternalTextures&&(K.__autoAllocateDepthBuffer=q===void 0,K.__autoAllocateDepthBuffer||ce.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),K.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(C,B){const q=We.get(C);q.__webglFramebuffer=B,q.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(C,B=0,q=0){M=C,A=B,E=q;let K=!0,Z=null,_e=!1,Ce=!1;if(C){const Ie=We.get(C);Ie.__useDefaultFramebuffer!==void 0?(Re.bindFramebuffer(H.FRAMEBUFFER,null),K=!1):Ie.__webglFramebuffer===void 0?je.setupRenderTarget(C):Ie.__hasExternalTextures&&je.rebindTextures(C,We.get(C.texture).__webglTexture,We.get(C.depthTexture).__webglTexture);const Ve=C.texture;(Ve.isData3DTexture||Ve.isDataArrayTexture||Ve.isCompressedArrayTexture)&&(Ce=!0);const ze=We.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(ze[B])?Z=ze[B][q]:Z=ze[B],_e=!0):we.isWebGL2&&C.samples>0&&je.useMultisampledRTT(C)===!1?Z=We.get(C).__webglMultisampledFramebuffer:Array.isArray(ze)?Z=ze[q]:Z=ze,w.copy(C.viewport),N.copy(C.scissor),O=C.scissorTest}else w.copy(W).multiplyScalar(k).floor(),N.copy(U).multiplyScalar(k).floor(),O=G;if(Re.bindFramebuffer(H.FRAMEBUFFER,Z)&&we.drawBuffers&&K&&Re.drawBuffers(C,Z),Re.viewport(w),Re.scissor(N),Re.setScissorTest(O),_e){const Ie=We.get(C.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+B,Ie.__webglTexture,q)}else if(Ce){const Ie=We.get(C.texture),Ve=B||0;H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,Ie.__webglTexture,q||0,Ve)}b=-1},this.readRenderTargetPixels=function(C,B,q,K,Z,_e,Ce){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ue=We.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ue=Ue[Ce]),Ue){Re.bindFramebuffer(H.FRAMEBUFFER,Ue);try{const Ie=C.texture,Ve=Ie.format,ze=Ie.type;if(Ve!==on&&rt.convert(Ve)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Be=ze===Pa&&(ce.has("EXT_color_buffer_half_float")||we.isWebGL2&&ce.has("EXT_color_buffer_float"));if(ze!==fr&&rt.convert(ze)!==H.getParameter(H.IMPLEMENTATION_COLOR_READ_TYPE)&&!(ze===tr&&(we.isWebGL2||ce.has("OES_texture_float")||ce.has("WEBGL_color_buffer_float")))&&!Be){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=C.width-K&&q>=0&&q<=C.height-Z&&H.readPixels(B,q,K,Z,rt.convert(Ve),rt.convert(ze),_e)}finally{const Ie=M!==null?We.get(M).__webglFramebuffer:null;Re.bindFramebuffer(H.FRAMEBUFFER,Ie)}}},this.copyFramebufferToTexture=function(C,B,q=0){const K=Math.pow(2,-q),Z=Math.floor(B.image.width*K),_e=Math.floor(B.image.height*K);je.setTexture2D(B,0),H.copyTexSubImage2D(H.TEXTURE_2D,q,0,0,C.x,C.y,Z,_e),Re.unbindTexture()},this.copyTextureToTexture=function(C,B,q,K=0){const Z=B.image.width,_e=B.image.height,Ce=rt.convert(q.format),Ue=rt.convert(q.type);je.setTexture2D(q,0),H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,q.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,q.unpackAlignment),B.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,K,C.x,C.y,Z,_e,Ce,Ue,B.image.data):B.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,K,C.x,C.y,B.mipmaps[0].width,B.mipmaps[0].height,Ce,B.mipmaps[0].data):H.texSubImage2D(H.TEXTURE_2D,K,C.x,C.y,Ce,Ue,B.image),K===0&&q.generateMipmaps&&H.generateMipmap(H.TEXTURE_2D),Re.unbindTexture()},this.copyTextureToTexture3D=function(C,B,q,K,Z=0){if(g.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const _e=C.max.x-C.min.x+1,Ce=C.max.y-C.min.y+1,Ue=C.max.z-C.min.z+1,Ie=rt.convert(K.format),Ve=rt.convert(K.type);let ze;if(K.isData3DTexture)je.setTexture3D(K,0),ze=H.TEXTURE_3D;else if(K.isDataArrayTexture)je.setTexture2DArray(K,0),ze=H.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}H.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,K.flipY),H.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),H.pixelStorei(H.UNPACK_ALIGNMENT,K.unpackAlignment);const Be=H.getParameter(H.UNPACK_ROW_LENGTH),Mt=H.getParameter(H.UNPACK_IMAGE_HEIGHT),yn=H.getParameter(H.UNPACK_SKIP_PIXELS),It=H.getParameter(H.UNPACK_SKIP_ROWS),hi=H.getParameter(H.UNPACK_SKIP_IMAGES),yt=q.isCompressedTexture?q.mipmaps[0]:q.image;H.pixelStorei(H.UNPACK_ROW_LENGTH,yt.width),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,yt.height),H.pixelStorei(H.UNPACK_SKIP_PIXELS,C.min.x),H.pixelStorei(H.UNPACK_SKIP_ROWS,C.min.y),H.pixelStorei(H.UNPACK_SKIP_IMAGES,C.min.z),q.isDataTexture||q.isData3DTexture?H.texSubImage3D(ze,Z,B.x,B.y,B.z,_e,Ce,Ue,Ie,Ve,yt.data):q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),H.compressedTexSubImage3D(ze,Z,B.x,B.y,B.z,_e,Ce,Ue,Ie,yt.data)):H.texSubImage3D(ze,Z,B.x,B.y,B.z,_e,Ce,Ue,Ie,Ve,yt),H.pixelStorei(H.UNPACK_ROW_LENGTH,Be),H.pixelStorei(H.UNPACK_IMAGE_HEIGHT,Mt),H.pixelStorei(H.UNPACK_SKIP_PIXELS,yn),H.pixelStorei(H.UNPACK_SKIP_ROWS,It),H.pixelStorei(H.UNPACK_SKIP_IMAGES,hi),Z===0&&K.generateMipmaps&&H.generateMipmap(ze),Re.unbindTexture()},this.initTexture=function(C){C.isCubeTexture?je.setTextureCube(C,0):C.isData3DTexture?je.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?je.setTexture2DArray(C,0):je.setTexture2D(C,0),Re.unbindTexture()},this.resetState=function(){A=0,E=0,M=null,Re.reset(),ke.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ci}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===Yh?"display-p3":"srgb",n.unpackColorSpace=st.workingColorSpace===uc?"display-p3":"srgb"}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(e){console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!e}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===at?Xr:F0}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Xr?at:Ii}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class D2 extends ny{}D2.prototype.isWebGL1Renderer=!0;class I2 extends Gt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n}}class Wi extends Qt{constructor(e,n,i,r,s,o,a,l,u){super(e,n,i,r,s,o,a,l,u),this.isVideoTexture=!0,this.minFilter=o!==void 0?o:St,this.magFilter=s!==void 0?s:St,this.generateMipmaps=!1;const c=this;function h(){c.needsUpdate=!0,e.requestVideoFrameCallback(h)}"requestVideoFrameCallback"in e&&e.requestVideoFrameCallback(h)}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}class zl extends Qt{constructor(e,n,i,r,s,o,a,l,u){super(e,n,i,r,s,o,a,l,u),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Jh extends Fi{constructor(e=1,n=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const u=this;r=Math.floor(r),s=Math.floor(s);const c=[],h=[],f=[],m=[];let _=0;const x=[],p=i/2;let d=0;v(),o===!1&&(e>0&&g(!0),n>0&&g(!1)),this.setIndex(c),this.setAttribute("position",new Cn(h,3)),this.setAttribute("normal",new Cn(f,3)),this.setAttribute("uv",new Cn(m,2));function v(){const S=new j,A=new j;let E=0;const M=(n-e)/i;for(let b=0;b<=s;b++){const y=[],w=b/s,N=w*(n-e)+e;for(let O=0;O<=r;O++){const V=O/r,P=V*l+a,D=Math.sin(P),X=Math.cos(P);A.x=N*D,A.y=-w*i+p,A.z=N*X,h.push(A.x,A.y,A.z),S.set(D,M,X).normalize(),f.push(S.x,S.y,S.z),m.push(V,1-w),y.push(_++)}x.push(y)}for(let b=0;b<r;b++)for(let y=0;y<s;y++){const w=x[y][b],N=x[y+1][b],O=x[y+1][b+1],V=x[y][b+1];c.push(w,N,V),c.push(N,O,V),E+=6}u.addGroup(d,E,0),d+=E}function g(S){const A=_,E=new nt,M=new j;let b=0;const y=S===!0?e:n,w=S===!0?1:-1;for(let O=1;O<=r;O++)h.push(0,p*w,0),f.push(0,w,0),m.push(.5,.5),_++;const N=_;for(let O=0;O<=r;O++){const P=O/r*l+a,D=Math.cos(P),X=Math.sin(P);M.x=y*X,M.y=p*w,M.z=y*D,h.push(M.x,M.y,M.z),f.push(0,w,0),E.x=D*.5+.5,E.y=X*.5*w+.5,m.push(E.x,E.y),_++}for(let O=0;O<r;O++){const V=A+O,P=N+O;S===!0?c.push(P,P+1,V):c.push(P+1,P,V),b+=3}u.addGroup(d,b,S===!0?1:2),d+=b}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jh(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ep extends Fi{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let u=0;const c=[],h=new j,f=new j,m=[],_=[],x=[],p=[];for(let d=0;d<=i;d++){const v=[],g=d/i;let S=0;d===0&&o===0?S=.5/n:d===i&&l===Math.PI&&(S=-.5/n);for(let A=0;A<=n;A++){const E=A/n;h.x=-e*Math.cos(r+E*s)*Math.sin(o+g*a),h.y=e*Math.cos(o+g*a),h.z=e*Math.sin(r+E*s)*Math.sin(o+g*a),_.push(h.x,h.y,h.z),f.copy(h).normalize(),x.push(f.x,f.y,f.z),p.push(E+S,1-g),v.push(u++)}c.push(v)}for(let d=0;d<i;d++)for(let v=0;v<n;v++){const g=c[d][v+1],S=c[d][v],A=c[d+1][v],E=c[d+1][v+1];(d!==0||o>0)&&m.push(g,S,E),(d!==i-1||l<Math.PI)&&m.push(S,A,E)}this.setIndex(m),this.setAttribute("position",new Cn(_,3)),this.setAttribute("normal",new Cn(x,3)),this.setAttribute("uv",new Cn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ep(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class bd extends qa{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=k0,this.normalScale=new nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const rv={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(this.files[t]=e)},get:function(t){if(this.enabled!==!1)return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};class O2{constructor(e,n,i){const r=this;let s=!1,o=0,a=0,l;const u=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this.itemStart=function(c){a++,s===!1&&r.onStart!==void 0&&r.onStart(c,o,a),s=!0},this.itemEnd=function(c){o++,r.onProgress!==void 0&&r.onProgress(c,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(c){r.onError!==void 0&&r.onError(c)},this.resolveURL=function(c){return l?l(c):c},this.setURLModifier=function(c){return l=c,this},this.addHandler=function(c,h){return u.push(c,h),this},this.removeHandler=function(c){const h=u.indexOf(c);return h!==-1&&u.splice(h,2),this},this.getHandler=function(c){for(let h=0,f=u.length;h<f;h+=2){const m=u[h],_=u[h+1];if(m.global&&(m.lastIndex=0),m.test(c))return _}return null}}}const F2=new O2;class fc{constructor(e){this.manager=e!==void 0?e:F2,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,n){const i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}fc.DEFAULT_MATERIAL_NAME="__DEFAULT";class iy extends fc{constructor(e){super(e)}load(e,n,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=rv.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){n&&n(o),s.manager.itemEnd(e)},0),o;const a=Ua("img");function l(){c(),rv.add(e,this),n&&n(this),s.manager.itemEnd(e)}function u(h){c(),r&&r(h),s.manager.itemError(e),s.manager.itemEnd(e)}function c(){a.removeEventListener("load",l,!1),a.removeEventListener("error",u,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",u,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}}class k2 extends fc{constructor(e){super(e)}load(e,n,i,r){const s=new $h;s.colorSpace=at;const o=new iy(this.manager);o.setCrossOrigin(this.crossOrigin),o.setPath(this.path);let a=0;function l(u){o.load(e[u],function(c){s.images[u]=c,a++,a===6&&(s.needsUpdate=!0,n&&n(s))},void 0,r)}for(let u=0;u<e.length;++u)l(u);return s}}class sv extends fc{constructor(e){super(e)}load(e,n,i,r){const s=new Qt,o=new iy(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,n!==void 0&&n(s)},i,r),s}}class ry extends Gt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Qe(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),n}}class z2 extends ry{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Gt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Qe(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}}const Ld=new Pt,ov=new j,av=new j;class B2{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new nt(512,512),this.map=null,this.mapPass=null,this.matrix=new Pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Kh,this._frameExtents=new nt(1,1),this._viewportCount=1,this._viewports=[new kt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;ov.setFromMatrixPosition(e.matrixWorld),n.position.copy(ov),av.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(av),n.updateMatrixWorld(),Ld.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ld),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ld)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class H2 extends B2{constructor(){super(new Z0(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class V2 extends ry{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Gt.DEFAULT_UP),this.updateMatrix(),this.target=new Gt,this.shadow=new H2}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:jh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=jh);var Yr={},sy={},bi={};Object.defineProperty(bi,"__esModule",{value:!0});bi.loop=bi.conditional=bi.parse=void 0;var G2=function t(e,n){var i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},r=arguments.length>3&&arguments[3]!==void 0?arguments[3]:i;if(Array.isArray(n))n.forEach(function(o){return t(e,o,i,r)});else if(typeof n=="function")n(e,i,r,t);else{var s=Object.keys(n)[0];Array.isArray(n[s])?(r[s]={},t(e,n[s],i,r[s])):r[s]=n[s](e,i,r,t)}return i};bi.parse=G2;var W2=function(e,n){return function(i,r,s,o){n(i,r,s)&&o(i,e,r,s)}};bi.conditional=W2;var j2=function(e,n){return function(i,r,s,o){for(var a=[],l=i.pos;n(i,r,s);){var u={};if(o(i,e,r,u),i.pos===l)break;l=i.pos,a.push(u)}return a}};bi.loop=j2;var Et={};Object.defineProperty(Et,"__esModule",{value:!0});Et.readBits=Et.readArray=Et.readUnsigned=Et.readString=Et.peekBytes=Et.readBytes=Et.peekByte=Et.readByte=Et.buildStream=void 0;var X2=function(e){return{data:e,pos:0}};Et.buildStream=X2;var oy=function(){return function(e){return e.data[e.pos++]}};Et.readByte=oy;var Y2=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;return function(n){return n.data[n.pos+e]}};Et.peekByte=Y2;var hc=function(e){return function(n){return n.data.subarray(n.pos,n.pos+=e)}};Et.readBytes=hc;var q2=function(e){return function(n){return n.data.subarray(n.pos,n.pos+e)}};Et.peekBytes=q2;var $2=function(e){return function(n){return Array.from(hc(e)(n)).map(function(i){return String.fromCharCode(i)}).join("")}};Et.readString=$2;var K2=function(e){return function(n){var i=hc(2)(n);return e?(i[1]<<8)+i[0]:(i[0]<<8)+i[1]}};Et.readUnsigned=K2;var Z2=function(e,n){return function(i,r,s){for(var o=typeof n=="function"?n(i,r,s):n,a=hc(e),l=new Array(o),u=0;u<o;u++)l[u]=a(i);return l}};Et.readArray=Z2;var Q2=function(e,n,i){for(var r=0,s=0;s<i;s++)r+=e[n+s]&&Math.pow(2,i-s-1);return r},J2=function(e){return function(n){for(var i=oy()(n),r=new Array(8),s=0;s<8;s++)r[7-s]=!!(i&1<<s);return Object.keys(e).reduce(function(o,a){var l=e[a];return l.length?o[a]=Q2(r,l.index,l.length):o[a]=r[l.index],o},{})}};Et.readBits=J2;(function(t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var e=bi,n=Et,i={blocks:function(f){for(var m=0,_=[],x=f.data.length,p=0,d=(0,n.readByte)()(f);d!==m&&d;d=(0,n.readByte)()(f)){if(f.pos+d>=x){var v=x-f.pos;_.push((0,n.readBytes)(v)(f)),p+=v;break}_.push((0,n.readBytes)(d)(f)),p+=d}for(var g=new Uint8Array(p),S=0,A=0;A<_.length;A++)g.set(_[A],S),S+=_[A].length;return g}},r=(0,e.conditional)({gce:[{codes:(0,n.readBytes)(2)},{byteSize:(0,n.readByte)()},{extras:(0,n.readBits)({future:{index:0,length:3},disposal:{index:3,length:3},userInput:{index:6},transparentColorGiven:{index:7}})},{delay:(0,n.readUnsigned)(!0)},{transparentColorIndex:(0,n.readByte)()},{terminator:(0,n.readByte)()}]},function(h){var f=(0,n.peekBytes)(2)(h);return f[0]===33&&f[1]===249}),s=(0,e.conditional)({image:[{code:(0,n.readByte)()},{descriptor:[{left:(0,n.readUnsigned)(!0)},{top:(0,n.readUnsigned)(!0)},{width:(0,n.readUnsigned)(!0)},{height:(0,n.readUnsigned)(!0)},{lct:(0,n.readBits)({exists:{index:0},interlaced:{index:1},sort:{index:2},future:{index:3,length:2},size:{index:5,length:3}})}]},(0,e.conditional)({lct:(0,n.readArray)(3,function(h,f,m){return Math.pow(2,m.descriptor.lct.size+1)})},function(h,f,m){return m.descriptor.lct.exists}),{data:[{minCodeSize:(0,n.readByte)()},i]}]},function(h){return(0,n.peekByte)()(h)===44}),o=(0,e.conditional)({text:[{codes:(0,n.readBytes)(2)},{blockSize:(0,n.readByte)()},{preData:function(f,m,_){return(0,n.readBytes)(_.text.blockSize)(f)}},i]},function(h){var f=(0,n.peekBytes)(2)(h);return f[0]===33&&f[1]===1}),a=(0,e.conditional)({application:[{codes:(0,n.readBytes)(2)},{blockSize:(0,n.readByte)()},{id:function(f,m,_){return(0,n.readString)(_.blockSize)(f)}},i]},function(h){var f=(0,n.peekBytes)(2)(h);return f[0]===33&&f[1]===255}),l=(0,e.conditional)({comment:[{codes:(0,n.readBytes)(2)},i]},function(h){var f=(0,n.peekBytes)(2)(h);return f[0]===33&&f[1]===254}),u=[{header:[{signature:(0,n.readString)(3)},{version:(0,n.readString)(3)}]},{lsd:[{width:(0,n.readUnsigned)(!0)},{height:(0,n.readUnsigned)(!0)},{gct:(0,n.readBits)({exists:{index:0},resolution:{index:1,length:3},sort:{index:4},size:{index:5,length:3}})},{backgroundColorIndex:(0,n.readByte)()},{pixelAspectRatio:(0,n.readByte)()}]},(0,e.conditional)({gct:(0,n.readArray)(3,function(h,f){return Math.pow(2,f.lsd.gct.size+1)})},function(h,f){return f.lsd.gct.exists}),{frames:(0,e.loop)([r,a,l,s,o],function(h){var f=(0,n.peekByte)()(h);return f===33||f===44})}],c=u;t.default=c})(sy);var pc={};Object.defineProperty(pc,"__esModule",{value:!0});pc.deinterlace=void 0;var eC=function(e,n){for(var i=new Array(e.length),r=e.length/n,s=function(f,m){var _=e.slice(m*n,(m+1)*n);i.splice.apply(i,[f*n,n].concat(_))},o=[0,4,2,1],a=[8,8,4,2],l=0,u=0;u<4;u++)for(var c=o[u];c<r;c+=a[u])s(c,l),l++;return i};pc.deinterlace=eC;var mc={};Object.defineProperty(mc,"__esModule",{value:!0});mc.lzw=void 0;var tC=function(e,n,i){var r=4096,s=-1,o=i,a,l,u,c,h,f,m,E,_,x,A,p,M,b,w,y,d=new Array(i),v=new Array(r),g=new Array(r),S=new Array(r+1);for(p=e,l=1<<p,h=l+1,a=l+2,m=s,c=p+1,u=(1<<c)-1,_=0;_<l;_++)v[_]=0,g[_]=_;var A,E,M,b,y,w;for(A=E=M=b=y=w=0,x=0;x<o;){if(b===0){if(E<c){A+=n[w]<<E,E+=8,w++;continue}if(_=A&u,A>>=c,E-=c,_>a||_==h)break;if(_==l){c=p+1,u=(1<<c)-1,a=l+2,m=s;continue}if(m==s){S[b++]=g[_],m=_,M=_;continue}for(f=_,_==a&&(S[b++]=M,_=m);_>l;)S[b++]=g[_],_=v[_];M=g[_]&255,S[b++]=M,a<r&&(v[a]=m,g[a]=M,a++,!(a&u)&&a<r&&(c++,u+=a)),m=f}b--,d[y++]=S[b],x++}for(x=y;x<o;x++)d[x]=0;return d};mc.lzw=tC;Object.defineProperty(Yr,"__esModule",{value:!0});var ay=Yr.decompressFrames=Yr.decompressFrame=ly=Yr.parseGIF=void 0,nC=aC(sy),iC=bi,rC=Et,sC=pc,oC=mc;function aC(t){return t&&t.__esModule?t:{default:t}}var lC=function(e){var n=new Uint8Array(e);return(0,iC.parse)((0,rC.buildStream)(n),nC.default)},ly=Yr.parseGIF=lC,uC=function(e){for(var n=e.pixels.length,i=new Uint8ClampedArray(n*4),r=0;r<n;r++){var s=r*4,o=e.pixels[r],a=e.colorTable[o]||[0,0,0];i[s]=a[0],i[s+1]=a[1],i[s+2]=a[2],i[s+3]=o!==e.transparentIndex?255:0}return i},uy=function(e,n,i){if(!e.image){console.warn("gif frame does not have associated image.");return}var r=e.image,s=r.descriptor.width*r.descriptor.height,o=(0,oC.lzw)(r.data.minCodeSize,r.data.blocks,s);r.descriptor.lct.interlaced&&(o=(0,sC.deinterlace)(o,r.descriptor.width));var a={pixels:o,dims:{top:e.image.descriptor.top,left:e.image.descriptor.left,width:e.image.descriptor.width,height:e.image.descriptor.height}};return r.descriptor.lct&&r.descriptor.lct.exists?a.colorTable=r.lct:a.colorTable=n,e.gce&&(a.delay=(e.gce.delay||10)*10,a.disposalType=e.gce.extras.disposal,e.gce.extras.transparentColorGiven&&(a.transparentIndex=e.gce.transparentColorIndex)),i&&(a.patch=uC(a)),a};Yr.decompressFrame=uy;var cC=function(e,n){return e.frames.filter(function(i){return i.image}).map(function(i){return uy(i,e.gct,n)})};ay=Yr.decompressFrames=cC;var tp=(t,e,n)=>{if(!e.has(t))throw TypeError("Cannot "+n)},R=(t,e,n)=>(tp(t,e,"read from private field"),n?n.call(t):e.get(t)),pe=(t,e,n)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,n)},Oe=(t,e,n,i)=>(tp(t,e,"write to private field"),e.set(t,n),n),Me=(t,e,n)=>(tp(t,e,"access private method"),n),cy=class{constructor(t){this.value=t}},np=class{constructor(t){this.value=t}},dy=t=>t<256?1:t<65536?2:t<1<<24?3:t<2**32?4:t<2**40?5:6,dC=t=>{if(t<127)return 1;if(t<16383)return 2;if(t<(1<<21)-1)return 3;if(t<(1<<28)-1)return 4;if(t<2**35-1)return 5;if(t<2**42-1)return 6;throw new Error("EBML VINT size not supported "+t)},Ms=(t,e,n)=>{let i=0;for(let r=e;r<n;r++){let s=Math.floor(r/8),o=t[s],a=7-(r&7),l=(o&1<<a)>>a;i<<=1,i|=l}return i},fC=(t,e,n,i)=>{for(let r=e;r<n;r++){let s=Math.floor(r/8),o=t[s],a=7-(r&7);o&=~(1<<a),o|=(i&1<<n-r-1)>>n-r-1<<a,t[s]=o}},gc=class{},fy=class extends gc{constructor(){super(...arguments),this.buffer=null}},hy=class extends gc{constructor(t){if(super(),this.options=t,typeof t!="object")throw new TypeError("StreamTarget requires an options object to be passed to its constructor.");if(t.onData){if(typeof t.onData!="function")throw new TypeError("options.onData, when provided, must be a function.");if(t.onData.length<2)throw new TypeError("options.onData, when provided, must be a function that takes in at least two arguments (data and position). Ignoring the position argument, which specifies the byte offset at which the data is to be written, can lead to broken outputs.")}if(t.onHeader&&typeof t.onHeader!="function")throw new TypeError("options.onHeader, when provided, must be a function.");if(t.onCluster&&typeof t.onCluster!="function")throw new TypeError("options.onCluster, when provided, must be a function.");if(t.chunked!==void 0&&typeof t.chunked!="boolean")throw new TypeError("options.chunked, when provided, must be a boolean.");if(t.chunkSize!==void 0&&(!Number.isInteger(t.chunkSize)||t.chunkSize<1024))throw new TypeError("options.chunkSize, when provided, must be an integer and not smaller than 1024.")}},hC=class extends gc{constructor(t,e){if(super(),this.stream=t,this.options=e,!(t instanceof FileSystemWritableFileStream))throw new TypeError("FileSystemWritableFileStreamTarget requires a FileSystemWritableFileStream instance.");if(e!==void 0&&typeof e!="object")throw new TypeError("FileSystemWritableFileStreamTarget's options, when provided, must be an object.");if(e&&e.chunkSize!==void 0&&(!Number.isInteger(e.chunkSize)||e.chunkSize<=0))throw new TypeError("options.chunkSize, when provided, must be a positive integer")}},hr,Ze,Df,py,If,my,Of,gy,eu,Ff,kf,vy,_y=class{constructor(){pe(this,Df),pe(this,If),pe(this,Of),pe(this,eu),pe(this,kf),this.pos=0,pe(this,hr,new Uint8Array(8)),pe(this,Ze,new DataView(R(this,hr).buffer)),this.offsets=new WeakMap,this.dataOffsets=new WeakMap}seek(t){this.pos=t}writeEBMLVarInt(t,e=dC(t)){let n=0;switch(e){case 1:R(this,Ze).setUint8(n++,128|t);break;case 2:R(this,Ze).setUint8(n++,64|t>>8),R(this,Ze).setUint8(n++,t);break;case 3:R(this,Ze).setUint8(n++,32|t>>16),R(this,Ze).setUint8(n++,t>>8),R(this,Ze).setUint8(n++,t);break;case 4:R(this,Ze).setUint8(n++,16|t>>24),R(this,Ze).setUint8(n++,t>>16),R(this,Ze).setUint8(n++,t>>8),R(this,Ze).setUint8(n++,t);break;case 5:R(this,Ze).setUint8(n++,8|t/2**32&7),R(this,Ze).setUint8(n++,t>>24),R(this,Ze).setUint8(n++,t>>16),R(this,Ze).setUint8(n++,t>>8),R(this,Ze).setUint8(n++,t);break;case 6:R(this,Ze).setUint8(n++,4|t/2**40&3),R(this,Ze).setUint8(n++,t/2**32|0),R(this,Ze).setUint8(n++,t>>24),R(this,Ze).setUint8(n++,t>>16),R(this,Ze).setUint8(n++,t>>8),R(this,Ze).setUint8(n++,t);break;default:throw new Error("Bad EBML VINT size "+e)}this.write(R(this,hr).subarray(0,n))}writeEBML(t){if(t!==null)if(t instanceof Uint8Array)this.write(t);else if(Array.isArray(t))for(let e of t)this.writeEBML(e);else if(this.offsets.set(t,this.pos),Me(this,eu,Ff).call(this,t.id),Array.isArray(t.data)){let e=this.pos,n=t.size===-1?1:t.size??4;t.size===-1?Me(this,Df,py).call(this,255):this.seek(this.pos+n);let i=this.pos;if(this.dataOffsets.set(t,i),this.writeEBML(t.data),t.size!==-1){let r=this.pos-i,s=this.pos;this.seek(e),this.writeEBMLVarInt(r,n),this.seek(s)}}else if(typeof t.data=="number"){let e=t.size??dy(t.data);this.writeEBMLVarInt(e),Me(this,eu,Ff).call(this,t.data,e)}else typeof t.data=="string"?(this.writeEBMLVarInt(t.data.length),Me(this,kf,vy).call(this,t.data)):t.data instanceof Uint8Array?(this.writeEBMLVarInt(t.data.byteLength,t.size),this.write(t.data)):t.data instanceof cy?(this.writeEBMLVarInt(4),Me(this,If,my).call(this,t.data.value)):t.data instanceof np&&(this.writeEBMLVarInt(8),Me(this,Of,gy).call(this,t.data.value))}};hr=new WeakMap;Ze=new WeakMap;Df=new WeakSet;py=function(t){R(this,Ze).setUint8(0,t),this.write(R(this,hr).subarray(0,1))};If=new WeakSet;my=function(t){R(this,Ze).setFloat32(0,t,!1),this.write(R(this,hr).subarray(0,4))};Of=new WeakSet;gy=function(t){R(this,Ze).setFloat64(0,t,!1),this.write(R(this,hr))};eu=new WeakSet;Ff=function(t,e=dy(t)){let n=0;switch(e){case 6:R(this,Ze).setUint8(n++,t/2**40|0);case 5:R(this,Ze).setUint8(n++,t/2**32|0);case 4:R(this,Ze).setUint8(n++,t>>24);case 3:R(this,Ze).setUint8(n++,t>>16);case 2:R(this,Ze).setUint8(n++,t>>8);case 1:R(this,Ze).setUint8(n++,t);break;default:throw new Error("Bad UINT size "+e)}this.write(R(this,hr).subarray(0,n))};kf=new WeakSet;vy=function(t){this.write(new Uint8Array(t.split("").map(e=>e.charCodeAt(0))))};var tu,qr,Na,nu,zf,pC=class extends _y{constructor(t){super(),pe(this,nu),pe(this,tu,void 0),pe(this,qr,new ArrayBuffer(2**16)),pe(this,Na,new Uint8Array(R(this,qr))),Oe(this,tu,t)}write(t){Me(this,nu,zf).call(this,this.pos+t.byteLength),R(this,Na).set(t,this.pos),this.pos+=t.byteLength}finalize(){Me(this,nu,zf).call(this,this.pos),R(this,tu).buffer=R(this,qr).slice(0,this.pos)}};tu=new WeakMap;qr=new WeakMap;Na=new WeakMap;nu=new WeakSet;zf=function(t){let e=R(this,qr).byteLength;for(;e<t;)e*=2;if(e===R(this,qr).byteLength)return;let n=new ArrayBuffer(e),i=new Uint8Array(n);i.set(R(this,Na),0),Oe(this,qr,n),Oe(this,Na,i)};var Es,ii,ri,Ur,Ka=class extends _y{constructor(t){super(),this.target=t,pe(this,Es,!1),pe(this,ii,void 0),pe(this,ri,void 0),pe(this,Ur,void 0)}write(t){if(!R(this,Es))return;let e=this.pos;if(e<R(this,ri)){if(e+t.byteLength<=R(this,ri))return;t=t.subarray(R(this,ri)-e),e=0}let n=e+t.byteLength-R(this,ri),i=R(this,ii).byteLength;for(;i<n;)i*=2;if(i!==R(this,ii).byteLength){let r=new Uint8Array(i);r.set(R(this,ii),0),Oe(this,ii,r)}R(this,ii).set(t,e-R(this,ri)),Oe(this,Ur,Math.max(R(this,Ur),e+t.byteLength))}startTrackingWrites(){Oe(this,Es,!0),Oe(this,ii,new Uint8Array(2**10)),Oe(this,ri,this.pos),Oe(this,Ur,this.pos)}getTrackedWrites(){if(!R(this,Es))throw new Error("Can't get tracked writes since nothing was tracked.");let e={data:R(this,ii).subarray(0,R(this,Ur)-R(this,ri)),start:R(this,ri),end:R(this,Ur)};return Oe(this,ii,void 0),Oe(this,Es,!1),e}};Es=new WeakMap;ii=new WeakMap;ri=new WeakMap;Ur=new WeakMap;var mC=2**24,gC=2,Nr,Zs,oa,Xo,Li,wn,Fu,Bf,ip,yy,rp,xy,aa,ku,sp=class extends Ka{constructor(t,e){var n,i;super(t),pe(this,Fu),pe(this,ip),pe(this,rp),pe(this,aa),pe(this,Nr,[]),pe(this,Zs,0),pe(this,oa,void 0),pe(this,Xo,void 0),pe(this,Li,void 0),pe(this,wn,[]),Oe(this,oa,e),Oe(this,Xo,((n=t.options)==null?void 0:n.chunked)??!1),Oe(this,Li,((i=t.options)==null?void 0:i.chunkSize)??mC)}write(t){super.write(t),R(this,Nr).push({data:t.slice(),start:this.pos}),this.pos+=t.byteLength}flush(){var n,i;if(R(this,Nr).length===0)return;let t=[],e=[...R(this,Nr)].sort((r,s)=>r.start-s.start);t.push({start:e[0].start,size:e[0].data.byteLength});for(let r=1;r<e.length;r++){let s=t[t.length-1],o=e[r];o.start<=s.start+s.size?s.size=Math.max(s.size,o.start+o.data.byteLength-s.start):t.push({start:o.start,size:o.data.byteLength})}for(let r of t){r.data=new Uint8Array(r.size);for(let s of R(this,Nr))r.start<=s.start&&s.start<r.start+r.size&&r.data.set(s.data,s.start-r.start);if(R(this,Xo))Me(this,Fu,Bf).call(this,r.data,r.start),Me(this,aa,ku).call(this);else{if(R(this,oa)&&r.start<R(this,Zs))throw new Error("Internal error: Monotonicity violation.");(i=(n=this.target.options).onData)==null||i.call(n,r.data,r.start),Oe(this,Zs,r.start+r.data.byteLength)}}R(this,Nr).length=0}finalize(){R(this,Xo)&&Me(this,aa,ku).call(this,!0)}};Nr=new WeakMap;Zs=new WeakMap;oa=new WeakMap;Xo=new WeakMap;Li=new WeakMap;wn=new WeakMap;Fu=new WeakSet;Bf=function(t,e){let n=R(this,wn).findIndex(a=>a.start<=e&&e<a.start+R(this,Li));n===-1&&(n=Me(this,rp,xy).call(this,e));let i=R(this,wn)[n],r=e-i.start,s=t.subarray(0,Math.min(R(this,Li)-r,t.byteLength));i.data.set(s,r);let o={start:r,end:r+s.byteLength};if(Me(this,ip,yy).call(this,i,o),i.written[0].start===0&&i.written[0].end===R(this,Li)&&(i.shouldFlush=!0),R(this,wn).length>gC){for(let a=0;a<R(this,wn).length-1;a++)R(this,wn)[a].shouldFlush=!0;Me(this,aa,ku).call(this)}s.byteLength<t.byteLength&&Me(this,Fu,Bf).call(this,t.subarray(s.byteLength),e+s.byteLength)};ip=new WeakSet;yy=function(t,e){let n=0,i=t.written.length-1,r=-1;for(;n<=i;){let s=Math.floor(n+(i-n+1)/2);t.written[s].start<=e.start?(n=s+1,r=s):i=s-1}for(t.written.splice(r+1,0,e),(r===-1||t.written[r].end<e.start)&&r++;r<t.written.length-1&&t.written[r].end>=t.written[r+1].start;)t.written[r].end=Math.max(t.written[r].end,t.written[r+1].end),t.written.splice(r+1,1)};rp=new WeakSet;xy=function(t){let n={start:Math.floor(t/R(this,Li))*R(this,Li),data:new Uint8Array(R(this,Li)),written:[],shouldFlush:!1};return R(this,wn).push(n),R(this,wn).sort((i,r)=>i.start-r.start),R(this,wn).indexOf(n)};aa=new WeakSet;ku=function(t=!1){var e,n;for(let i=0;i<R(this,wn).length;i++){let r=R(this,wn)[i];if(!(!r.shouldFlush&&!t)){for(let s of r.written){if(R(this,oa)&&r.start+s.start<R(this,Zs))throw new Error("Internal error: Monotonicity violation.");(n=(e=this.target.options).onData)==null||n.call(e,r.data.subarray(s.start,s.end),r.start+s.start),Oe(this,Zs,r.start+s.end)}R(this,wn).splice(i--,1)}}};var vC=class extends sp{constructor(t,e){var n;super(new hy({onData:(i,r)=>t.stream.write({type:"write",data:i,position:r}),chunked:!0,chunkSize:(n=t.options)==null?void 0:n.chunkSize}),e)}},vo=1,Da=2,zu=3,_C=1,yC=2,xC=17,SC=2**15,la=2**13,lv="https://github.com/Vanilagy/webm-muxer",Sy=6,My=5,MC=["strict","offset","permissive"],Le,Ee,Ia,Oa,Ei,_o,Bs,$r,yo,pr,Qs,Js,ci,Za,eo,Xi,Yi,Or,ua,ca,to,no,Bu,Fa,da,Hf,Ey,Vf,wy,op,Ty,ap,Ay,lp,Cy,up,Ry,cp,by,vc,dp,_c,fp,hp,Ly,Fr,Hs,kr,Vs,Gf,Py,Wf,Uy,Yo,iu,qo,ru,pp,Ny,ai,Si,io,ka,fa,Hu,mp,Dy,Vu,gp,$o,su,EC=class{constructor(t){pe(this,Hf),pe(this,Vf),pe(this,op),pe(this,ap),pe(this,lp),pe(this,up),pe(this,cp),pe(this,vc),pe(this,_c),pe(this,hp),pe(this,Fr),pe(this,kr),pe(this,Gf),pe(this,Wf),pe(this,Yo),pe(this,qo),pe(this,pp),pe(this,ai),pe(this,io),pe(this,fa),pe(this,mp),pe(this,Vu),pe(this,$o),pe(this,Le,void 0),pe(this,Ee,void 0),pe(this,Ia,void 0),pe(this,Oa,void 0),pe(this,Ei,void 0),pe(this,_o,void 0),pe(this,Bs,void 0),pe(this,$r,void 0),pe(this,yo,void 0),pe(this,pr,void 0),pe(this,Qs,void 0),pe(this,Js,void 0),pe(this,ci,void 0),pe(this,Za,void 0),pe(this,eo,0),pe(this,Xi,[]),pe(this,Yi,[]),pe(this,Or,[]),pe(this,ua,void 0),pe(this,ca,void 0),pe(this,to,-1),pe(this,no,-1),pe(this,Bu,-1),pe(this,Fa,void 0),pe(this,da,!1),Me(this,Hf,Ey).call(this,t),Oe(this,Le,{type:"webm",firstTimestampBehavior:"strict",...t}),this.target=t.target;let e=!!R(this,Le).streaming;if(t.target instanceof fy)Oe(this,Ee,new pC(t.target));else if(t.target instanceof hy)Oe(this,Ee,new sp(t.target,e));else if(t.target instanceof hC)Oe(this,Ee,new vC(t.target,e));else throw new Error(`Invalid target: ${t.target}`);Me(this,Vf,wy).call(this)}addVideoChunk(t,e,n){if(!(t instanceof EncodedVideoChunk))throw new TypeError("addVideoChunk's first argument (chunk) must be of type EncodedVideoChunk.");if(e&&typeof e!="object")throw new TypeError("addVideoChunk's second argument (meta), when provided, must be an object.");if(n!==void 0&&(!Number.isFinite(n)||n<0))throw new TypeError("addVideoChunk's third argument (timestamp), when provided, must be a non-negative real number.");let i=new Uint8Array(t.byteLength);t.copyTo(i),this.addVideoChunkRaw(i,t.type,n??t.timestamp,e)}addVideoChunkRaw(t,e,n,i){if(!(t instanceof Uint8Array))throw new TypeError("addVideoChunkRaw's first argument (data) must be an instance of Uint8Array.");if(e!=="key"&&e!=="delta")throw new TypeError("addVideoChunkRaw's second argument (type) must be either 'key' or 'delta'.");if(!Number.isFinite(n)||n<0)throw new TypeError("addVideoChunkRaw's third argument (timestamp) must be a non-negative real number.");if(i&&typeof i!="object")throw new TypeError("addVideoChunkRaw's fourth argument (meta), when provided, must be an object.");if(Me(this,$o,su).call(this),!R(this,Le).video)throw new Error("No video track declared.");R(this,ua)===void 0&&Oe(this,ua,n),i&&Me(this,Gf,Py).call(this,i);let r=Me(this,qo,ru).call(this,t,e,n,vo);for(R(this,Le).video.codec==="V_VP9"&&Me(this,Wf,Uy).call(this,r),Oe(this,to,r.timestamp);R(this,Yi).length>0&&R(this,Yi)[0].timestamp<=r.timestamp;){let s=R(this,Yi).shift();Me(this,ai,Si).call(this,s,!1)}!R(this,Le).audio||r.timestamp<=R(this,no)?Me(this,ai,Si).call(this,r,!0):R(this,Xi).push(r),Me(this,Yo,iu).call(this),Me(this,Fr,Hs).call(this)}addAudioChunk(t,e,n){if(!(t instanceof EncodedAudioChunk))throw new TypeError("addAudioChunk's first argument (chunk) must be of type EncodedAudioChunk.");if(e&&typeof e!="object")throw new TypeError("addAudioChunk's second argument (meta), when provided, must be an object.");if(n!==void 0&&(!Number.isFinite(n)||n<0))throw new TypeError("addAudioChunk's third argument (timestamp), when provided, must be a non-negative real number.");let i=new Uint8Array(t.byteLength);t.copyTo(i),this.addAudioChunkRaw(i,t.type,n??t.timestamp,e)}addAudioChunkRaw(t,e,n,i){if(!(t instanceof Uint8Array))throw new TypeError("addAudioChunkRaw's first argument (data) must be an instance of Uint8Array.");if(e!=="key"&&e!=="delta")throw new TypeError("addAudioChunkRaw's second argument (type) must be either 'key' or 'delta'.");if(!Number.isFinite(n)||n<0)throw new TypeError("addAudioChunkRaw's third argument (timestamp) must be a non-negative real number.");if(i&&typeof i!="object")throw new TypeError("addAudioChunkRaw's fourth argument (meta), when provided, must be an object.");if(Me(this,$o,su).call(this),!R(this,Le).audio)throw new Error("No audio track declared.");R(this,ca)===void 0&&Oe(this,ca,n),i!=null&&i.decoderConfig&&(R(this,Le).streaming?Oe(this,pr,Me(this,io,ka).call(this,i.decoderConfig.description)):Me(this,fa,Hu).call(this,R(this,pr),i.decoderConfig.description));let r=Me(this,qo,ru).call(this,t,e,n,Da);for(Oe(this,no,r.timestamp);R(this,Xi).length>0&&R(this,Xi)[0].timestamp<=r.timestamp;){let s=R(this,Xi).shift();Me(this,ai,Si).call(this,s,!0)}!R(this,Le).video||r.timestamp<=R(this,to)?Me(this,ai,Si).call(this,r,!R(this,Le).video):R(this,Yi).push(r),Me(this,Yo,iu).call(this),Me(this,Fr,Hs).call(this)}addSubtitleChunk(t,e,n){if(typeof t!="object"||!t)throw new TypeError("addSubtitleChunk's first argument (chunk) must be an object.");if(!(t.body instanceof Uint8Array))throw new TypeError("body must be an instance of Uint8Array.");if(!Number.isFinite(t.timestamp)||t.timestamp<0)throw new TypeError("timestamp must be a non-negative real number.");if(!Number.isFinite(t.duration)||t.duration<0)throw new TypeError("duration must be a non-negative real number.");if(t.additions&&!(t.additions instanceof Uint8Array))throw new TypeError("additions, when present, must be an instance of Uint8Array.");if(typeof e!="object")throw new TypeError("addSubtitleChunk's second argument (meta) must be an object.");if(Me(this,$o,su).call(this),!R(this,Le).subtitles)throw new Error("No subtitle track declared.");e!=null&&e.decoderConfig&&(R(this,Le).streaming?Oe(this,Qs,Me(this,io,ka).call(this,e.decoderConfig.description)):Me(this,fa,Hu).call(this,R(this,Qs),e.decoderConfig.description));let i=Me(this,qo,ru).call(this,t.body,"key",n??t.timestamp,zu,t.duration,t.additions);Oe(this,Bu,i.timestamp),R(this,Or).push(i),Me(this,Yo,iu).call(this),Me(this,Fr,Hs).call(this)}finalize(){if(R(this,da))throw new Error("Cannot finalize a muxer more than once.");for(;R(this,Xi).length>0;)Me(this,ai,Si).call(this,R(this,Xi).shift(),!0);for(;R(this,Yi).length>0;)Me(this,ai,Si).call(this,R(this,Yi).shift(),!0);for(;R(this,Or).length>0&&R(this,Or)[0].timestamp<=R(this,eo);)Me(this,ai,Si).call(this,R(this,Or).shift(),!1);if(R(this,ci)&&Me(this,Vu,gp).call(this),R(this,Ee).writeEBML(R(this,Js)),!R(this,Le).streaming){let t=R(this,Ee).pos,e=R(this,Ee).pos-R(this,kr,Vs);R(this,Ee).seek(R(this,Ee).offsets.get(R(this,Ia))+4),R(this,Ee).writeEBMLVarInt(e,Sy),R(this,Bs).data=new np(R(this,eo)),R(this,Ee).seek(R(this,Ee).offsets.get(R(this,Bs))),R(this,Ee).writeEBML(R(this,Bs)),R(this,Ei).data[0].data[1].data=R(this,Ee).offsets.get(R(this,Js))-R(this,kr,Vs),R(this,Ei).data[1].data[1].data=R(this,Ee).offsets.get(R(this,Oa))-R(this,kr,Vs),R(this,Ei).data[2].data[1].data=R(this,Ee).offsets.get(R(this,_o))-R(this,kr,Vs),R(this,Ee).seek(R(this,Ee).offsets.get(R(this,Ei))),R(this,Ee).writeEBML(R(this,Ei)),R(this,Ee).seek(t)}Me(this,Fr,Hs).call(this),R(this,Ee).finalize(),Oe(this,da,!0)}};Le=new WeakMap;Ee=new WeakMap;Ia=new WeakMap;Oa=new WeakMap;Ei=new WeakMap;_o=new WeakMap;Bs=new WeakMap;$r=new WeakMap;yo=new WeakMap;pr=new WeakMap;Qs=new WeakMap;Js=new WeakMap;ci=new WeakMap;Za=new WeakMap;eo=new WeakMap;Xi=new WeakMap;Yi=new WeakMap;Or=new WeakMap;ua=new WeakMap;ca=new WeakMap;to=new WeakMap;no=new WeakMap;Bu=new WeakMap;Fa=new WeakMap;da=new WeakMap;Hf=new WeakSet;Ey=function(t){if(typeof t!="object")throw new TypeError("The muxer requires an options object to be passed to its constructor.");if(!(t.target instanceof gc))throw new TypeError("The target must be provided and an instance of Target.");if(t.video){if(typeof t.video.codec!="string")throw new TypeError(`Invalid video codec: ${t.video.codec}. Must be a string.`);if(!Number.isInteger(t.video.width)||t.video.width<=0)throw new TypeError(`Invalid video width: ${t.video.width}. Must be a positive integer.`);if(!Number.isInteger(t.video.height)||t.video.height<=0)throw new TypeError(`Invalid video height: ${t.video.height}. Must be a positive integer.`);if(t.video.frameRate!==void 0&&(!Number.isFinite(t.video.frameRate)||t.video.frameRate<=0))throw new TypeError(`Invalid video frame rate: ${t.video.frameRate}. Must be a positive number.`);if(t.video.alpha!==void 0&&typeof t.video.alpha!="boolean")throw new TypeError(`Invalid video alpha: ${t.video.alpha}. Must be a boolean.`)}if(t.audio){if(typeof t.audio.codec!="string")throw new TypeError(`Invalid audio codec: ${t.audio.codec}. Must be a string.`);if(!Number.isInteger(t.audio.numberOfChannels)||t.audio.numberOfChannels<=0)throw new TypeError(`Invalid number of audio channels: ${t.audio.numberOfChannels}. Must be a positive integer.`);if(!Number.isInteger(t.audio.sampleRate)||t.audio.sampleRate<=0)throw new TypeError(`Invalid audio sample rate: ${t.audio.sampleRate}. Must be a positive integer.`);if(t.audio.bitDepth!==void 0&&(!Number.isInteger(t.audio.bitDepth)||t.audio.bitDepth<=0))throw new TypeError(`Invalid audio bit depth: ${t.audio.bitDepth}. Must be a positive integer.`)}if(t.subtitles&&typeof t.subtitles.codec!="string")throw new TypeError(`Invalid subtitles codec: ${t.subtitles.codec}. Must be a string.`);if(t.type!==void 0&&!["webm","matroska"].includes(t.type))throw new TypeError(`Invalid type: ${t.type}. Must be 'webm' or 'matroska'.`);if(t.firstTimestampBehavior&&!MC.includes(t.firstTimestampBehavior))throw new TypeError(`Invalid first timestamp behavior: ${t.firstTimestampBehavior}`);if(t.streaming!==void 0&&typeof t.streaming!="boolean")throw new TypeError(`Invalid streaming option: ${t.streaming}. Must be a boolean.`)};Vf=new WeakSet;wy=function(){R(this,Ee)instanceof Ka&&R(this,Ee).target.options.onHeader&&R(this,Ee).startTrackingWrites(),Me(this,op,Ty).call(this),R(this,Le).streaming||Me(this,up,Ry).call(this),Me(this,cp,by).call(this),Me(this,ap,Ay).call(this),Me(this,lp,Cy).call(this),R(this,Le).streaming||(Me(this,vc,dp).call(this),Me(this,_c,fp).call(this)),Me(this,hp,Ly).call(this),Me(this,Fr,Hs).call(this)};op=new WeakSet;Ty=function(){let t={id:440786851,data:[{id:17030,data:1},{id:17143,data:1},{id:17138,data:4},{id:17139,data:8},{id:17026,data:R(this,Le).type??"webm"},{id:17031,data:2},{id:17029,data:2}]};R(this,Ee).writeEBML(t)};ap=new WeakSet;Ay=function(){Oe(this,yo,{id:236,size:4,data:new Uint8Array(la)}),Oe(this,pr,{id:236,size:4,data:new Uint8Array(la)}),Oe(this,Qs,{id:236,size:4,data:new Uint8Array(la)})};lp=new WeakSet;Cy=function(){Oe(this,$r,{id:21936,data:[{id:21937,data:2},{id:21946,data:2},{id:21947,data:2},{id:21945,data:0}]})};up=new WeakSet;Ry=function(){const t=new Uint8Array([28,83,187,107]),e=new Uint8Array([21,73,169,102]),n=new Uint8Array([22,84,174,107]);Oe(this,Ei,{id:290298740,data:[{id:19899,data:[{id:21419,data:t},{id:21420,size:5,data:0}]},{id:19899,data:[{id:21419,data:e},{id:21420,size:5,data:0}]},{id:19899,data:[{id:21419,data:n},{id:21420,size:5,data:0}]}]})};cp=new WeakSet;by=function(){let t={id:17545,data:new np(0)};Oe(this,Bs,t);let e={id:357149030,data:[{id:2807729,data:1e6},{id:19840,data:lv},{id:22337,data:lv},R(this,Le).streaming?null:t]};Oe(this,Oa,e)};vc=new WeakSet;dp=function(){let t={id:374648427,data:[]};Oe(this,_o,t),R(this,Le).video&&t.data.push({id:174,data:[{id:215,data:vo},{id:29637,data:vo},{id:131,data:_C},{id:134,data:R(this,Le).video.codec},R(this,yo),R(this,Le).video.frameRate?{id:2352003,data:1e9/R(this,Le).video.frameRate}:null,{id:224,data:[{id:176,data:R(this,Le).video.width},{id:186,data:R(this,Le).video.height},R(this,Le).video.alpha?{id:21440,data:1}:null,R(this,$r)]}]}),R(this,Le).audio&&(Oe(this,pr,R(this,Le).streaming?R(this,pr)||null:{id:236,size:4,data:new Uint8Array(la)}),t.data.push({id:174,data:[{id:215,data:Da},{id:29637,data:Da},{id:131,data:yC},{id:134,data:R(this,Le).audio.codec},R(this,pr),{id:225,data:[{id:181,data:new cy(R(this,Le).audio.sampleRate)},{id:159,data:R(this,Le).audio.numberOfChannels},R(this,Le).audio.bitDepth?{id:25188,data:R(this,Le).audio.bitDepth}:null]}]})),R(this,Le).subtitles&&t.data.push({id:174,data:[{id:215,data:zu},{id:29637,data:zu},{id:131,data:xC},{id:134,data:R(this,Le).subtitles.codec},R(this,Qs)]})};_c=new WeakSet;fp=function(){let t={id:408125543,size:R(this,Le).streaming?-1:Sy,data:[R(this,Le).streaming?null:R(this,Ei),R(this,Oa),R(this,_o)]};if(Oe(this,Ia,t),R(this,Ee).writeEBML(t),R(this,Ee)instanceof Ka&&R(this,Ee).target.options.onHeader){let{data:e,start:n}=R(this,Ee).getTrackedWrites();R(this,Ee).target.options.onHeader(e,n)}};hp=new WeakSet;Ly=function(){Oe(this,Js,{id:475249515,data:[]})};Fr=new WeakSet;Hs=function(){R(this,Ee)instanceof sp&&R(this,Ee).flush()};kr=new WeakSet;Vs=function(){return R(this,Ee).dataOffsets.get(R(this,Ia))};Gf=new WeakSet;Py=function(t){if(t.decoderConfig){if(t.decoderConfig.colorSpace){let e=t.decoderConfig.colorSpace;if(Oe(this,Fa,e),R(this,$r).data=[{id:21937,data:{rgb:1,bt709:1,bt470bg:5,smpte170m:6}[e.matrix]},{id:21946,data:{bt709:1,smpte170m:6,"iec61966-2-1":13}[e.transfer]},{id:21947,data:{bt709:1,bt470bg:5,smpte170m:6}[e.primaries]},{id:21945,data:[1,2][Number(e.fullRange)]}],!R(this,Le).streaming){let n=R(this,Ee).pos;R(this,Ee).seek(R(this,Ee).offsets.get(R(this,$r))),R(this,Ee).writeEBML(R(this,$r)),R(this,Ee).seek(n)}}t.decoderConfig.description&&(R(this,Le).streaming?Oe(this,yo,Me(this,io,ka).call(this,t.decoderConfig.description)):Me(this,fa,Hu).call(this,R(this,yo),t.decoderConfig.description))}};Wf=new WeakSet;Uy=function(t){if(t.type!=="key"||!R(this,Fa))return;let e=0;if(Ms(t.data,0,2)!==2)return;e+=2;let n=(Ms(t.data,e+1,e+2)<<1)+Ms(t.data,e+0,e+1);e+=2,n===3&&e++;let i=Ms(t.data,e+0,e+1);if(e++,i)return;let r=Ms(t.data,e+0,e+1);if(e++,r!==0)return;e+=2;let s=Ms(t.data,e+0,e+24);if(e+=24,s!==4817730)return;n>=2&&e++;let o={rgb:7,bt709:2,bt470bg:1,smpte170m:3}[R(this,Fa).matrix];fC(t.data,e+0,e+3,o)};Yo=new WeakSet;iu=function(){let t=Math.min(R(this,Le).video?R(this,to):1/0,R(this,Le).audio?R(this,no):1/0),e=R(this,Or);for(;e.length>0&&e[0].timestamp<=t;)Me(this,ai,Si).call(this,e.shift(),!R(this,Le).video&&!R(this,Le).audio)};qo=new WeakSet;ru=function(t,e,n,i,r,s){let o=Me(this,pp,Ny).call(this,n,i);return{data:t,additions:s,type:e,timestamp:o,duration:r,trackNumber:i}};pp=new WeakSet;Ny=function(t,e){let n=e===vo?R(this,to):e===Da?R(this,no):R(this,Bu);if(e!==zu){let i=e===vo?R(this,ua):R(this,ca);if(R(this,Le).firstTimestampBehavior==="strict"&&n===-1&&t!==0)throw new Error(`The first chunk for your media track must have a timestamp of 0 (received ${t}). Non-zero first timestamps are often caused by directly piping frames or audio data from a MediaStreamTrack into the encoder. Their timestamps are typically relative to the age of the document, which is probably what you want.

If you want to offset all timestamps of a track such that the first one is zero, set firstTimestampBehavior: 'offset' in the options.
If you want to allow non-zero first timestamps, set firstTimestampBehavior: 'permissive'.
`);R(this,Le).firstTimestampBehavior==="offset"&&(t-=i)}if(t<n)throw new Error(`Timestamps must be monotonically increasing (went from ${n} to ${t}).`);if(t<0)throw new Error(`Timestamps must be non-negative (received ${t}).`);return t};ai=new WeakSet;Si=function(t,e){R(this,Le).streaming&&!R(this,_o)&&(Me(this,vc,dp).call(this),Me(this,_c,fp).call(this));let n=Math.floor(t.timestamp/1e3),i=n-R(this,Za),r=e&&t.type==="key"&&i>=1e3,s=i>=SC;if((!R(this,ci)||r||s)&&(Me(this,mp,Dy).call(this,n),i=0),i<0)return;let o=new Uint8Array(4),a=new DataView(o.buffer);if(a.setUint8(0,128|t.trackNumber),a.setInt16(1,i,!1),t.duration===void 0&&!t.additions){a.setUint8(3,+(t.type==="key")<<7);let l={id:163,data:[o,t.data]};R(this,Ee).writeEBML(l)}else{let l=Math.floor(t.duration/1e3),u={id:160,data:[{id:161,data:[o,t.data]},t.duration!==void 0?{id:155,data:l}:null,t.additions?{id:30113,data:t.additions}:null]};R(this,Ee).writeEBML(u)}Oe(this,eo,Math.max(R(this,eo),n))};io=new WeakSet;ka=function(t){return{id:25506,size:4,data:new Uint8Array(t)}};fa=new WeakSet;Hu=function(t,e){let n=R(this,Ee).pos;R(this,Ee).seek(R(this,Ee).offsets.get(t));let i=6+e.byteLength,r=la-i;if(r<0){let s=e.byteLength+r;e instanceof ArrayBuffer?e=e.slice(0,s):e=e.buffer.slice(0,s),r=0}t=[Me(this,io,ka).call(this,e),{id:236,size:4,data:new Uint8Array(r)}],R(this,Ee).writeEBML(t),R(this,Ee).seek(n)};mp=new WeakSet;Dy=function(t){R(this,ci)&&Me(this,Vu,gp).call(this),R(this,Ee)instanceof Ka&&R(this,Ee).target.options.onCluster&&R(this,Ee).startTrackingWrites(),Oe(this,ci,{id:524531317,size:R(this,Le).streaming?-1:My,data:[{id:231,data:t}]}),R(this,Ee).writeEBML(R(this,ci)),Oe(this,Za,t);let e=R(this,Ee).offsets.get(R(this,ci))-R(this,kr,Vs);R(this,Js).data.push({id:187,data:[{id:179,data:t},R(this,Le).video?{id:183,data:[{id:247,data:vo},{id:241,data:e}]}:null,R(this,Le).audio?{id:183,data:[{id:247,data:Da},{id:241,data:e}]}:null]})};Vu=new WeakSet;gp=function(){if(!R(this,Le).streaming){let t=R(this,Ee).pos-R(this,Ee).dataOffsets.get(R(this,ci)),e=R(this,Ee).pos;R(this,Ee).seek(R(this,Ee).offsets.get(R(this,ci))+4),R(this,Ee).writeEBMLVarInt(t,My),R(this,Ee).seek(e)}if(R(this,Ee)instanceof Ka&&R(this,Ee).target.options.onCluster){let{data:t,start:e}=R(this,Ee).getTrackedWrites();R(this,Ee).target.options.onCluster(t,e,R(this,Za))}};$o=new WeakSet;su=function(){if(R(this,da))throw new Error("Cannot add new video or audio chunks after the file has been finalized.")};new TextEncoder;var uv={},wC=function(t,e,n,i,r){var s=new Worker(uv[e]||(uv[e]=URL.createObjectURL(new Blob([t+';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'],{type:"text/javascript"}))));return s.onmessage=function(o){var a=o.data,l=a.$e$;if(l){var u=new Error(l[0]);u.code=l[1],u.stack=l[2],r(u,null)}else r(null,a)},s.postMessage(n,i),s},jt=Uint8Array,pn=Uint16Array,yc=Int32Array,xc=new jt([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Sc=new jt([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),jf=new jt([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Iy=function(t,e){for(var n=new pn(31),i=0;i<31;++i)n[i]=e+=1<<t[i-1];for(var r=new yc(n[30]),i=1;i<30;++i)for(var s=n[i];s<n[i+1];++s)r[s]=s-n[i]<<5|i;return{b:n,r}},Oy=Iy(xc,2),TC=Oy.b,Gu=Oy.r;TC[28]=258,Gu[258]=28;var AC=Iy(Sc,0),Xf=AC.r,Wu=new pn(32768);for(var ft=0;ft<32768;++ft){var ji=(ft&43690)>>1|(ft&21845)<<1;ji=(ji&52428)>>2|(ji&13107)<<2,ji=(ji&61680)>>4|(ji&3855)<<4,Wu[ft]=((ji&65280)>>8|(ji&255)<<8)>>1}var ro=function(t,e,n){for(var i=t.length,r=0,s=new pn(e);r<i;++r)t[r]&&++s[t[r]-1];var o=new pn(e);for(r=1;r<e;++r)o[r]=o[r-1]+s[r-1]<<1;var a;if(n){a=new pn(1<<e);var l=15-e;for(r=0;r<i;++r)if(t[r])for(var u=r<<4|t[r],c=e-t[r],h=o[t[r]-1]++<<c,f=h|(1<<c)-1;h<=f;++h)a[Wu[h]>>l]=u}else for(a=new pn(i),r=0;r<i;++r)t[r]&&(a[r]=Wu[o[t[r]-1]++]>>15-t[r]);return a},_r=new jt(288);for(var ft=0;ft<144;++ft)_r[ft]=8;for(var ft=144;ft<256;++ft)_r[ft]=9;for(var ft=256;ft<280;++ft)_r[ft]=7;for(var ft=280;ft<288;++ft)_r[ft]=8;var za=new jt(32);for(var ft=0;ft<32;++ft)za[ft]=5;var Fy=ro(_r,9,0),ky=ro(za,5,0),vp=function(t){return(t+7)/8|0},_p=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new jt(t.subarray(e,n))},CC=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],xo=function(t,e,n){var i=new Error(e||CC[t]);if(i.code=t,Error.captureStackTrace&&Error.captureStackTrace(i,xo),!n)throw i;return i},si=function(t,e,n){n<<=e&7;var i=e/8|0;t[i]|=n,t[i+1]|=n>>8},ws=function(t,e,n){n<<=e&7;var i=e/8|0;t[i]|=n,t[i+1]|=n>>8,t[i+2]|=n>>16},ou=function(t,e){for(var n=[],i=0;i<t.length;++i)t[i]&&n.push({s:i,f:t[i]});var r=n.length,s=n.slice();if(!r)return{t:xp,l:0};if(r==1){var o=new jt(n[0].s+1);return o[n[0].s]=1,{t:o,l:1}}n.sort(function(A,E){return A.f-E.f}),n.push({s:-1,f:25001});var a=n[0],l=n[1],u=0,c=1,h=2;for(n[0]={s:-1,f:a.f+l.f,l:a,r:l};c!=r-1;)a=n[n[u].f<n[h].f?u++:h++],l=n[u!=c&&n[u].f<n[h].f?u++:h++],n[c++]={s:-1,f:a.f+l.f,l:a,r:l};for(var f=s[0].s,i=1;i<r;++i)s[i].s>f&&(f=s[i].s);var m=new pn(f+1),_=ju(n[c-1],m,0);if(_>e){var i=0,x=0,p=_-e,d=1<<p;for(s.sort(function(E,M){return m[M.s]-m[E.s]||E.f-M.f});i<r;++i){var v=s[i].s;if(m[v]>e)x+=d-(1<<_-m[v]),m[v]=e;else break}for(x>>=p;x>0;){var g=s[i].s;m[g]<e?x-=1<<e-m[g]++-1:++i}for(;i>=0&&x;--i){var S=s[i].s;m[S]==e&&(--m[S],++x)}_=e}return{t:new jt(m),l:_}},ju=function(t,e,n){return t.s==-1?Math.max(ju(t.l,e,n+1),ju(t.r,e,n+1)):e[t.s]=n},Yf=function(t){for(var e=t.length;e&&!t[--e];);for(var n=new pn(++e),i=0,r=t[0],s=1,o=function(l){n[i++]=l},a=1;a<=e;++a)if(t[a]==r&&a!=e)++s;else{if(!r&&s>2){for(;s>138;s-=138)o(32754);s>2&&(o(s>10?s-11<<5|28690:s-3<<5|12305),s=0)}else if(s>3){for(o(r),--s;s>6;s-=6)o(8304);s>2&&(o(s-3<<5|8208),s=0)}for(;s--;)o(r);s=1,r=t[a]}return{c:n.subarray(0,i),n:e}},Ts=function(t,e){for(var n=0,i=0;i<e.length;++i)n+=t[i]*e[i];return n},yp=function(t,e,n){var i=n.length,r=vp(e+2);t[r]=i&255,t[r+1]=i>>8,t[r+2]=t[r]^255,t[r+3]=t[r+1]^255;for(var s=0;s<i;++s)t[r+s+4]=n[s];return(r+4+i)*8},qf=function(t,e,n,i,r,s,o,a,l,u,c){si(e,c++,n),++r[256];for(var h=ou(r,15),f=h.t,m=h.l,_=ou(s,15),x=_.t,p=_.l,d=Yf(f),v=d.c,g=d.n,S=Yf(x),A=S.c,E=S.n,M=new pn(19),b=0;b<v.length;++b)++M[v[b]&31];for(var b=0;b<A.length;++b)++M[A[b]&31];for(var y=ou(M,7),w=y.t,N=y.l,O=19;O>4&&!w[jf[O-1]];--O);var V=u+5<<3,P=Ts(r,_r)+Ts(s,za)+o,D=Ts(r,f)+Ts(s,x)+o+14+3*O+Ts(M,w)+2*M[16]+3*M[17]+7*M[18];if(l>=0&&V<=P&&V<=D)return yp(e,c,t.subarray(l,l+u));var X,k,F,z;if(si(e,c,1+(D<P)),c+=2,D<P){X=ro(f,m,0),k=f,F=ro(x,p,0),z=x;var W=ro(w,N,0);si(e,c,g-257),si(e,c+5,E-1),si(e,c+10,O-4),c+=14;for(var b=0;b<O;++b)si(e,c+3*b,w[jf[b]]);c+=3*O;for(var U=[v,A],G=0;G<2;++G)for(var ie=U[G],b=0;b<ie.length;++b){var ee=ie[b]&31;si(e,c,W[ee]),c+=w[ee],ee>15&&(si(e,c,ie[b]>>5&127),c+=ie[b]>>12)}}else X=Fy,k=_r,F=ky,z=za;for(var b=0;b<a;++b){var J=i[b];if(J>255){var ee=J>>18&31;ws(e,c,X[ee+257]),c+=k[ee+257],ee>7&&(si(e,c,J>>23&31),c+=xc[ee]);var de=J&31;ws(e,c,F[de]),c+=z[de],de>3&&(ws(e,c,J>>5&8191),c+=Sc[de])}else ws(e,c,X[J]),c+=k[J]}return ws(e,c,X[256]),c+k[256]},zy=new yc([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),xp=new jt(0),By=function(t,e,n,i,r,s){var o=s.z||t.length,a=new jt(i+o+5*(1+Math.ceil(o/7e3))+r),l=a.subarray(i,a.length-r),u=s.l,c=(s.r||0)&7;if(e){c&&(l[0]=s.r>>3);for(var h=zy[e-1],f=h>>13,m=h&8191,_=(1<<n)-1,x=s.p||new pn(32768),p=s.h||new pn(_+1),d=Math.ceil(n/3),v=2*d,g=function(ce){return(t[ce]^t[ce+1]<<d^t[ce+2]<<v)&_},S=new yc(25e3),A=new pn(288),E=new pn(32),M=0,b=0,y=s.i||0,w=0,N=s.w||0,O=0;y+2<o;++y){var V=g(y),P=y&32767,D=p[V];if(x[P]=D,p[V]=P,N<=y){var X=o-y;if((M>7e3||w>24576)&&(X>423||!u)){c=qf(t,l,0,S,A,E,b,w,O,y-O,c),w=M=b=0,O=y;for(var k=0;k<286;++k)A[k]=0;for(var k=0;k<30;++k)E[k]=0}var F=2,z=0,W=m,U=P-D&32767;if(X>2&&V==g(y-U))for(var G=Math.min(f,X)-1,ie=Math.min(32767,y),ee=Math.min(258,X);U<=ie&&--W&&P!=D;){if(t[y+F]==t[y+F-U]){for(var J=0;J<ee&&t[y+J]==t[y+J-U];++J);if(J>F){if(F=J,z=U,J>G)break;for(var de=Math.min(U,J-2),ge=0,k=0;k<de;++k){var fe=y-U+k&32767,Se=x[fe],Ge=fe-Se&32767;Ge>ge&&(ge=Ge,D=fe)}}}P=D,D=x[P],U+=P-D&32767}if(z){S[w++]=268435456|Gu[F]<<18|Xf[z];var Te=Gu[F]&31,H=Xf[z]&31;b+=xc[Te]+Sc[H],++A[257+Te],++E[H],N=y+F,++M}else S[w++]=t[y],++A[t[y]]}}for(y=Math.max(y,N);y<o;++y)S[w++]=t[y],++A[t[y]];c=qf(t,l,u,S,A,E,b,w,O,y-O,c),u||(s.r=c&7|l[c/8|0]<<3,c-=7,s.h=p,s.p=x,s.i=y,s.w=N)}else{for(var y=s.w||0;y<o+u;y+=65535){var Fe=y+65535;Fe>=o&&(l[c/8|0]=u,Fe=o),c=yp(l,c+1,t.subarray(y,Fe))}s.i=o}return _p(a,0,i+vp(c)+r)},RC=function(){for(var t=new Int32Array(256),e=0;e<256;++e){for(var n=e,i=9;--i;)n=(n&1&&-306674912)^n>>>1;t[e]=n}return t}(),bC=function(){var t=-1;return{p:function(e){for(var n=t,i=0;i<e.length;++i)n=RC[n&255^e[i]]^n>>>8;t=n},d:function(){return~t}}},Hy=function(t,e,n,i,r){if(!r&&(r={l:1},e.dictionary)){var s=e.dictionary.subarray(-32768),o=new jt(s.length+t.length);o.set(s),o.set(t,s.length),t=o,r.w=s.length}return By(t,e.level==null?6:e.level,e.mem==null?r.l?Math.ceil(Math.max(8,Math.min(13,Math.log(t.length)))*1.5):20:12+e.mem,n,i,r)},Sp=function(t,e){var n={};for(var i in t)n[i]=t[i];for(var i in e)n[i]=e[i];return n},cv=function(t,e,n){for(var i=t(),r=t.toString(),s=r.slice(r.indexOf("[")+1,r.lastIndexOf("]")).replace(/\s+/g,"").split(","),o=0;o<i.length;++o){var a=i[o],l=s[o];if(typeof a=="function"){e+=";"+l+"=";var u=a.toString();if(a.prototype)if(u.indexOf("[native code]")!=-1){var c=u.indexOf(" ",8)+1;e+=u.slice(c,u.indexOf("(",c))}else{e+=u;for(var h in a.prototype)e+=";"+l+".prototype."+h+"="+a.prototype[h].toString()}else e+=u}else n[l]=a}return e},Bl=[],LC=function(t){var e=[];for(var n in t)t[n].buffer&&e.push((t[n]=new t[n].constructor(t[n])).buffer);return e},PC=function(t,e,n,i){if(!Bl[n]){for(var r="",s={},o=t.length-1,a=0;a<o;++a)r=cv(t[a],r,s);Bl[n]={c:cv(t[o],r,s),e:s}}var l=Sp({},Bl[n].e);return wC(Bl[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",n,l,LC(l),i)},UC=function(){return[jt,pn,yc,xc,Sc,jf,Gu,Xf,Fy,_r,ky,za,Wu,zy,xp,ro,si,ws,ou,ju,Yf,Ts,yp,qf,vp,_p,By,Hy,Mp,Vy]},Vy=function(t){return postMessage(t,[t.buffer])},NC=function(t,e,n,i,r,s){var o=PC(n,i,r,function(a,l){o.terminate(),s(a,l)});return o.postMessage([t,e],e.consume?[t.buffer]:[]),function(){o.terminate()}},Ht=function(t,e,n){for(;n;++e)t[e]=n,n>>>=8};function DC(t,e,n){return n||(n=e,e={}),typeof n!="function"&&xo(7),NC(t,e,[UC],function(i){return Vy(Mp(i.data[0],i.data[1]))},0,n)}function Mp(t,e){return Hy(t,e||{},0,0)}var Gy=function(t,e,n,i){for(var r in t){var s=t[r],o=e+r,a=i;Array.isArray(s)&&(a=Sp(i,s[1]),s=s[0]),s instanceof jt?n[o]=[s,a]:(n[o+="/"]=[new jt(0),a],Gy(s,o,n,i))}},dv=typeof TextEncoder<"u"&&new TextEncoder,IC=typeof TextDecoder<"u"&&new TextDecoder,OC=0;try{IC.decode(xp,{stream:!0}),OC=1}catch{}function fv(t,e){var n;if(dv)return dv.encode(t);for(var i=t.length,r=new jt(t.length+(t.length>>1)),s=0,o=function(u){r[s++]=u},n=0;n<i;++n){if(s+5>r.length){var a=new jt(s+8+(i-n<<1));a.set(r),r=a}var l=t.charCodeAt(n);l<128||e?o(l):l<2048?(o(192|l>>6),o(128|l&63)):l>55295&&l<57344?(l=65536+(l&1047552)|t.charCodeAt(++n)&1023,o(240|l>>18),o(128|l>>12&63),o(128|l>>6&63),o(128|l&63)):(o(224|l>>12),o(128|l>>6&63),o(128|l&63))}return _p(r,0,s)}var $f=function(t){var e=0;if(t)for(var n in t){var i=t[n].length;i>65535&&xo(9),e+=i+4}return e},hv=function(t,e,n,i,r,s,o,a){var l=i.length,u=n.extra,c=a&&a.length,h=$f(u);Ht(t,e,o!=null?33639248:67324752),e+=4,o!=null&&(t[e++]=20,t[e++]=n.os),t[e]=20,e+=2,t[e++]=n.flag<<1|(s<0&&8),t[e++]=r&&8,t[e++]=n.compression&255,t[e++]=n.compression>>8;var f=new Date(n.mtime==null?Date.now():n.mtime),m=f.getFullYear()-1980;if((m<0||m>119)&&xo(10),Ht(t,e,m<<25|f.getMonth()+1<<21|f.getDate()<<16|f.getHours()<<11|f.getMinutes()<<5|f.getSeconds()>>1),e+=4,s!=-1&&(Ht(t,e,n.crc),Ht(t,e+4,s<0?-s-2:s),Ht(t,e+8,n.size)),Ht(t,e+12,l),Ht(t,e+14,h),e+=16,o!=null&&(Ht(t,e,c),Ht(t,e+6,n.attrs),Ht(t,e+10,o),e+=14),t.set(i,e),e+=l,h)for(var _ in u){var x=u[_],p=x.length;Ht(t,e,+_),Ht(t,e+2,p),t.set(x,e+4),e+=4+p}return c&&(t.set(a,e),e+=c),e},FC=function(t,e,n,i,r){Ht(t,e,101010256),Ht(t,e+8,n),Ht(t,e+10,n),Ht(t,e+12,i),Ht(t,e+16,r)};function kC(t,e,n){n||(n=e,e={}),typeof n!="function"&&xo(7);var i={};Gy(t,"",i,e);var r=Object.keys(i),s=r.length,o=0,a=0,l=s,u=new Array(s),c=[],h=function(){for(var p=0;p<c.length;++p)c[p]()},f=function(p,d){pv(function(){n(p,d)})};pv(function(){f=n});var m=function(){var p=new jt(a+22),d=o,v=a-o;a=0;for(var g=0;g<l;++g){var S=u[g];try{var A=S.c.length;hv(p,a,S,S.f,S.u,A);var E=30+S.f.length+$f(S.extra),M=a+E;p.set(S.c,M),hv(p,o,S,S.f,S.u,A,a,S.m),o+=16+E+(S.m?S.m.length:0),a=M+A}catch(b){return f(b,null)}}FC(p,o,u.length,v,d),f(null,p)};s||m();for(var _=function(p){var d=r[p],v=i[d],g=v[0],S=v[1],A=bC(),E=g.length;A.p(g);var M=fv(d),b=M.length,y=S.comment,w=y&&fv(y),N=w&&w.length,O=$f(S.extra),V=S.level==0?0:8,P=function(D,X){if(D)h(),f(D,null);else{var k=X.length;u[p]=Sp(S,{size:E,crc:A.d(),c:X,f:M,m:w,u:b!=d.length||w&&y.length!=N,compression:V}),o+=30+b+O+k,a+=76+2*(b+O)+(N||0)+k,--s||m()}};if(b>65535&&P(xo(11,0,1),null),!V)P(null,g);else if(E<16e4)try{P(null,Mp(g,S))}catch(D){P(D,null)}else c.push(DC(g,S,P))},x=0;x<l;++x)_(x);return h}var pv=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(t){t()};class Kf{constructor(e,n,i,r){Co(this,"scene");Co(this,"camera");Co(this,"renderer");Co(this,"turntable");this.scene=e,this.camera=n,this.renderer=i,this.turntable=r}async exportFrames(e){const{fps:n,duration:i,size:r}=e,s=Math.floor(n*i),o=[],a={width:this.renderer.domElement.width,height:this.renderer.domElement.height},l=this.turntable.rotation.y;try{this.renderer.setSize(r,r),this.camera.aspect=1,this.camera.updateProjectionMatrix();for(let u=0;u<s;u++){const c=2*Math.PI*u/s;this.turntable.rotation.y=c,this.renderer.render(this.scene,this.camera);const h=await this.captureFrame();o.push(h)}return o}finally{this.renderer.setSize(a.width,a.height),this.camera.aspect=a.width/a.height,this.camera.updateProjectionMatrix(),this.turntable.rotation.y=l}}captureFrame(){return new Promise(e=>{this.renderer.domElement.toBlob(n=>{e(n)},"image/png")})}async exportAsZip(e){const n=await this.exportFrames(e),i={};for(let r=0;r<n.length;r++){const o=`frame_${String(r).padStart(4,"0")}.png`;i[o]=new Uint8Array(await n[r].arrayBuffer())}return new Promise((r,s)=>{kC(i,{level:6},(o,a)=>{o?s(o):r(new Blob([a],{type:"application/zip"}))})})}async exportAsWebM(e){const n=await this.exportFrames(e);if(!("VideoEncoder"in window))throw new Error("WebCodecs not supported in this browser");const{fps:i,size:r}=e,s=document.createElement("canvas");s.width=r,s.height=r;const o=s.getContext("2d"),a=[],l=new window.VideoEncoder({output:h=>a.push(h),error:h=>console.error("VideoEncoder error:",h)});l.configure({codec:"vp09.00.10.08",width:r,height:r,bitrate:1e6,framerate:i,latencyMode:"realtime"});for(let h=0;h<n.length;h++){const f=await createImageBitmap(n[h]);o.clearRect(0,0,r,r),o.drawImage(f,0,0);const m=new window.VideoFrame(s,{timestamp:h*1e6/i});l.encode(m,{keyFrame:h===0}),m.close(),f.close()}await l.flush(),l.close();const u=new Uint8Array(a.reduce((h,f)=>h+f.byteLength,0));let c=0;for(const h of a)u.set(new Uint8Array(h.data),c),c+=h.byteLength;return new Blob([u],{type:"video/webm"})}downloadBlob(e,n){const i=URL.createObjectURL(e),r=document.createElement("a");r.href=i,r.download=n,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i)}}const zC=async(t,e,n=["🪙"],i="Custom Coinmoji")=>{const r=await t.arrayBuffer(),s=btoa(String.fromCharCode(...new Uint8Array(r))),o={initData:e,user_id:BC(e),set_title:i,emoji_list:n,webm_base64:s};try{const a=await fetch("/api/create-emoji",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!a.ok)throw new Error("Failed to create custom emoji");return await a.json()}catch(a){throw console.error("Error creating custom emoji:",a),a}},BC=t=>{const e=new URLSearchParams(t);return JSON.parse(e.get("user")||"{}").id},Wy=tt.forwardRef(({className:t="",settings:e},n)=>{const i=tt.useRef(null),[r,s]=tt.useState(!0),[o,a]=tt.useState(0),l=tt.useRef("medium"),u=tt.useRef(0),c=tt.useRef(),[h]=tt.useState({fillMode:"solid",bodyColor:"#b87333",gradientStart:"#ffd700",gradientEnd:"#ff8c00",bodyTextureUrl:"",metallic:!0,rotationSpeed:"medium",overlayUrl:"",dualOverlay:!1,overlayUrl2:"",lightColor:"#ffffff",lightStrength:"medium",gifAnimationSpeed:"medium"}),f=e||h;tt.useImperativeHandle(n,()=>({exportFrames:async E=>c.current?await new Kf(c.current.scene,c.current.camera,c.current.renderer,c.current.turntable).exportFrames(E):[],getScene:()=>{var E;return((E=c.current)==null?void 0:E.scene)||null},getCamera:()=>{var E;return((E=c.current)==null?void 0:E.camera)||null},getRenderer:()=>{var E;return((E=c.current)==null?void 0:E.renderer)||null},getTurntable:()=>{var E;return((E=c.current)==null?void 0:E.turntable)||null}}),[]),tt.useEffect(()=>{l.current=f.rotationSpeed},[f.rotationSpeed]);const m={slow:.01,medium:.02,fast:.035},_={slow:1,medium:2.5,fast:5},x=typeof window<"u"&&"VideoEncoder"in window&&"VideoFrame"in window;tt.useEffect(()=>{if(!i.current)return;const E=new I2;E.background=null;const M=new In(45,window.innerWidth/window.innerHeight,.1,100);M.position.set(0,0,7),M.lookAt(0,0,0);const b=new ny({antialias:!0,alpha:!0,preserveDrawingBuffer:!0});b.setPixelRatio(Math.min(window.devicePixelRatio,2)),b.setSize(i.current.clientWidth,i.current.clientHeight),b.outputColorSpace=at,b.setClearColor(0,0),i.current.appendChild(b.domElement);const y=new z2(16777215,2236979,.45);E.add(y);const w=new V2(16777215,.8);w.position.set(3,5,2),E.add(w);const O=new k2().load(["https://threejs.org/examples/textures/cube/Bridge2/posx.jpg","https://threejs.org/examples/textures/cube/Bridge2/negx.jpg","https://threejs.org/examples/textures/cube/Bridge2/posy.jpg","https://threejs.org/examples/textures/cube/Bridge2/negy.jpg","https://threejs.org/examples/textures/cube/Bridge2/posz.jpg","https://threejs.org/examples/textures/cube/Bridge2/negz.jpg"],()=>{a(100),setTimeout(()=>s(!1),500)},Fe=>{a(Fe.loaded/Fe.total*100)},Fe=>{console.error("Error loading environment map:",Fe),s(!1)});E.environment=O;const V=1,P=.35,D=.1,X=128,k=32,F=new bd({color:12088115,metalness:1,roughness:.34,envMapIntensity:1}),z=F.clone(),W=new Jh(V,V,P,X,1,!0),U=new kn(W,F),G=Fe=>{const ce=new ep(V,X,k,0,Math.PI*2,Fe?0:Math.PI/2,Math.PI/2);return ce.scale(1,D/V,1),ce.translate(0,Fe?P/2:-P/2,0),new kn(ce,z)},ie=G(!0),ee=G(!1),J=new bd({transparent:!0,metalness:0,roughness:.5,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1,opacity:0}),de=Fe=>{const ce=G(Fe);return ce.material=J.clone(),p(ce.geometry),ce},ge=de(!0),fe=de(!1),Se=new zs;Se.add(U,ie,ee,ge,fe),Se.rotation.x=Math.PI/2;const Ge=new zs;Ge.add(Se),E.add(Ge),c.current={scene:E,camera:M,renderer:b,coinGroup:Se,turntable:Ge,rimMat:F,faceMat:z,overlayTop:ge,overlayBot:fe,hemiLight:y,dirLight:w};const Te=()=>{if(!c.current)return;c.current.animationId=requestAnimationFrame(Te),c.current.turntable.rotation.y+=m[l.current];const Fe=ce=>{var Re;const we=ce.map;we&&(we instanceof Wi?we.needsUpdate=!0:we instanceof zl&&typeof((Re=we.userData)==null?void 0:Re.update)=="function"&&we.userData.update())};c.current.overlayTop.material&&Fe(c.current.overlayTop.material),c.current.overlayBot.material&&Fe(c.current.overlayBot.material),c.current.coinGroup.children.forEach(ce=>{ce instanceof kn&&ce.material&&(Array.isArray(ce.material)?ce.material:[ce.material]).forEach(Re=>{Re instanceof bd&&Fe(Re)})}),c.current.renderer.render(c.current.scene,c.current.camera)};Te();const H=()=>{if(!i.current||!c.current)return;const Fe=i.current.clientWidth,ce=i.current.clientHeight;c.current.camera.aspect=Fe/ce,c.current.camera.updateProjectionMatrix(),c.current.renderer.setSize(Fe,ce)};return window.addEventListener("resize",H),()=>{var Fe;window.removeEventListener("resize",H),(Fe=c.current)!=null&&Fe.animationId&&cancelAnimationFrame(c.current.animationId),i.current&&b.domElement&&i.current.removeChild(b.domElement),b.dispose()}},[]);const p=E=>{E.computeBoundingBox();const M=E.boundingBox,b=Math.max(Math.abs(M.max.x),Math.abs(M.min.x),Math.abs(M.max.z),Math.abs(M.min.z)),y=E.attributes.position,w=new Float32Array(y.count*2);for(let N=0;N<y.count;N++){const O=y.getX(N),V=y.getZ(N),P=.5+O/b*.48,D=1-(.5+V/b*.48);w[N*2]=P,w[N*2+1]=D}E.setAttribute("uv",new Jn(w,2))},d=async(E,M=1.5)=>{const b=await fetch(E,{mode:"cors"});if(!b.ok)throw new Error(`GIF fetch failed: ${b.status}`);const y=await b.arrayBuffer(),w=ly(y),N=ay(w,!0),O=w.lsd.width,V=w.lsd.height,P=document.createElement("canvas");P.width=O,P.height=V;const D=P.getContext("2d",{willReadFrequently:!0});let X=null;const k=[],F=[];for(let ge=0;ge<N.length;ge++){const fe=N[ge];fe.disposalType===3&&(X=D.getImageData(0,0,O,V));const Se=new ImageData(new Uint8ClampedArray(fe.patch),fe.dims.width,fe.dims.height);D.putImageData(Se,fe.dims.left,fe.dims.top),k.push(D.getImageData(0,0,O,V));const Ge=typeof fe.delay=="number"?fe.delay:10;F.push(Math.max(2,Ge)*10/M),fe.disposalType===2?D.clearRect(fe.dims.left,fe.dims.top,fe.dims.width,fe.dims.height):fe.disposalType===3&&X&&D.putImageData(X,0,0)}const z=new fy,W=new EC({target:z,video:{codec:"V_VP9",width:O,height:V,frameRate:30}}),U=new window.VideoEncoder({output:(ge,fe)=>W.addVideoChunk(ge,fe),error:ge=>console.error("VideoEncoder error:",ge)});U.configure({codec:"vp09.00.10.08",width:O,height:V,bitrate:4e5,framerate:60,latencyMode:"realtime"});let G=0;for(let ge=0;ge<k.length;ge++){const fe=k[ge],Se=document.createElement("canvas");Se.width=O,Se.height=V,Se.getContext("2d").putImageData(fe,0,0);const Te=new window.VideoFrame(Se,{timestamp:G*1e3});U.encode(Te,{keyFrame:ge===0}),Te.close(),G+=F[ge]}await U.flush(),W.finalize();const ie=new Blob([z.buffer],{type:"video/webm"}),ee=URL.createObjectURL(ie),J=document.createElement("video");J.src=ee,J.loop=!0,J.muted=!0,J.playsInline=!0,await J.play().catch(()=>{});const de=new Wi(J);return de.colorSpace=at,de.minFilter=St,de.magFilter=St,de.format=on,de.flipY=!0,de.userData.dispose=()=>{try{URL.revokeObjectURL(ee)}catch{}J.pause()},de},v=E=>new Promise((M,b)=>{const y=/\.gif$/i.test(E),w=/\.webm$/i.test(E);if(y)(async()=>{if(x)try{const V=_[f.gifAnimationSpeed],P=await d(E,V);M(P);return}catch(V){console.warn("WebCodecs GIF->WebM failed, falling back to canvas driver:",V)}const N=new Image;N.crossOrigin="anonymous";const O=document.createElement("div");O.style.cssText="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;",O.appendChild(N),(i.current||document.body).appendChild(O),N.onload=()=>{const V=document.createElement("canvas"),P=V.getContext("2d");V.width=N.naturalWidth||N.width,V.height=N.naturalHeight||N.height,P.drawImage(N,0,0);const D=new zl(V);D.colorSpace=at,D.flipY=!0,c.current&&(D.anisotropy=c.current.renderer.capabilities.getMaxAnisotropy()),D.userData.update=()=>{P.clearRect(0,0,V.width,V.height),P.drawImage(N,0,0),D.needsUpdate=!0},D.userData.dispose=()=>{O.parentNode&&O.parentNode.removeChild(O)},M(D)},N.onerror=()=>b(new Error("Failed to load GIF")),N.src=E})();else if(w){const N=document.createElement("video");N.crossOrigin="anonymous",N.loop=!0,N.muted=!0,N.playsInline=!0,N.preload="auto",N.autoplay=!0;const O=()=>{try{const P=new Wi(N);P.colorSpace=at,P.minFilter=St,P.magFilter=St,P.format=on,P.flipY=!0,M(P)}catch(P){console.warn("VideoTexture creation failed, falling back to image:",P),V()}},V=()=>{const P=new sv;P.setCrossOrigin("anonymous"),P.load(E,D=>{D.colorSpace=at,D.flipY=!1,c.current&&(D.anisotropy=c.current.renderer.capabilities.getMaxAnisotropy()),M(D)},void 0,b)};N.addEventListener("canplay",()=>{N.play().then(O).catch(V)}),N.addEventListener("loadeddata",()=>{N.readyState>=2&&N.play().then(O).catch(V)}),N.addEventListener("error",V),N.src=E,setTimeout(()=>{N.readyState<2&&V()},3e3)}else{const N=new sv;N.setCrossOrigin("anonymous"),N.load(E,O=>{O.colorSpace=at,O.flipY=!1,c.current&&(O.anisotropy=c.current.renderer.capabilities.getMaxAnisotropy()),M(O)},void 0,b)}}),g=(E,M,b=!1)=>{const y=document.createElement("canvas"),w=y.getContext("2d");if(b){y.width=512,y.height=16;const O=w.createLinearGradient(0,0,y.width/2,0);O.addColorStop(0,E),O.addColorStop(1,M),w.fillStyle=O,w.fillRect(0,0,y.width/2,y.height);const V=w.createLinearGradient(y.width/2,0,y.width,0);V.addColorStop(0,M),V.addColorStop(1,E),w.fillStyle=V,w.fillRect(y.width/2,0,y.width/2,y.height)}else{y.width=256,y.height=256;const O=w.createLinearGradient(0,0,0,y.height);O.addColorStop(0,E),O.addColorStop(1,M),w.fillStyle=O,w.fillRect(0,0,y.width,y.height)}const N=new zl(y);return N.colorSpace=at,N};tt.useEffect(()=>{var b,y,w,N,O,V,P,D,X,k,F,z,W,U,G,ie;if(!c.current)return;const{rimMat:E,faceMat:M}=c.current;if(f.bodyTextureUrl&&f.bodyTextureUrl.trim()!=="")v(f.bodyTextureUrl).then(ee=>{var ge,fe,Se,Ge,Te,H,Fe,ce;(Se=(fe=(ge=E.map)==null?void 0:ge.userData)==null?void 0:fe.dispose)==null||Se.call(fe),(H=(Te=(Ge=M.map)==null?void 0:Ge.userData)==null?void 0:Te.dispose)==null||H.call(Te),(Fe=E.map)==null||Fe.dispose(),(ce=M.map)==null||ce.dispose();const{coinGroup:J}=c.current;J.children.filter(we=>we instanceof kn&&(we.material===M||we.material.uuid===M.uuid)).forEach(we=>{p(we.geometry)}),E.map=ee,M.map=ee,E.color.set("#ffffff"),M.color.set("#ffffff"),E.needsUpdate=!0,M.needsUpdate=!0}).catch(ee=>{var J,de,ge,fe,Se,Ge,Te,H;if(console.error("Failed to load body texture:",ee),(ge=(de=(J=E.map)==null?void 0:J.userData)==null?void 0:de.dispose)==null||ge.call(de),(Ge=(Se=(fe=M.map)==null?void 0:fe.userData)==null?void 0:Se.dispose)==null||Ge.call(Se),(Te=E.map)==null||Te.dispose(),(H=M.map)==null||H.dispose(),E.map=null,M.map=null,f.fillMode==="solid")E.color.set(f.bodyColor),M.color.set(f.bodyColor);else{const Fe=g(f.gradientStart,f.gradientEnd),ce=g(f.gradientStart,f.gradientEnd,!0);E.map=ce,M.map=Fe,E.color.set("#ffffff"),M.color.set("#ffffff")}E.needsUpdate=!0,M.needsUpdate=!0});else if(f.fillMode==="solid")(w=(y=(b=E.map)==null?void 0:b.userData)==null?void 0:y.dispose)==null||w.call(y),(V=(O=(N=M.map)==null?void 0:N.userData)==null?void 0:O.dispose)==null||V.call(O),(P=E.map)==null||P.dispose(),(D=M.map)==null||D.dispose(),E.map=null,M.map=null,E.color.set(f.bodyColor),M.color.set(f.bodyColor),E.needsUpdate=!0,M.needsUpdate=!0;else{(F=(k=(X=E.map)==null?void 0:X.userData)==null?void 0:k.dispose)==null||F.call(k),(U=(W=(z=M.map)==null?void 0:z.userData)==null?void 0:W.dispose)==null||U.call(W),(G=E.map)==null||G.dispose(),(ie=M.map)==null||ie.dispose(),E.map=null,M.map=null;const ee=g(f.gradientStart,f.gradientEnd),J=g(f.gradientStart,f.gradientEnd,!0);E.map=J,M.map=ee,E.color.set("#ffffff"),M.color.set("#ffffff"),E.needsUpdate=!0,M.needsUpdate=!0}E.metalness=M.metalness=f.metallic?1:0},[f.fillMode,f.bodyColor,f.gradientStart,f.gradientEnd,f.metallic,f.bodyTextureUrl]),tt.useEffect(()=>{if(!c.current)return;const{hemiLight:E,dirLight:M}=c.current,y={low:{hemi:.3,dir:.6},medium:{hemi:.8,dir:1.3},strong:{hemi:1.2,dir:3}}[f.lightStrength];E.intensity=y.hemi,M.intensity=y.dir,E.color.set(f.lightColor),M.color.set(f.lightColor)},[f.lightColor,f.lightStrength]);const S=(E,M=!1,b=u.current)=>{!c.current||!E||v(E).then(y=>{var w,N,O,V,P;if(b!==u.current){(N=(w=y.userData)==null?void 0:w.dispose)==null||N.call(w),(O=y.dispose)==null||O.call(y);return}if(y instanceof Wi||y instanceof zl,y.flipY=!0,f.dualOverlay&&M){const D=c.current.overlayBot.material;if(y instanceof Wi){const X=y.image,k=new Wi(X);k.colorSpace=at,k.minFilter=St,k.magFilter=St,k.format=on,k.flipY=!0,k.wrapS=Uu,k.repeat.x=-1,k.needsUpdate=!0,(V=y.userData)!=null&&V.dispose&&(k.userData.dispose=y.userData.dispose),D.map=k}else D.map=y;D.opacity=1,D.transparent=!0,D.needsUpdate=!0,c.current.overlayBot.visible=!0}else if(f.dualOverlay&&!M){const D=c.current.overlayTop.material;D.map=y,D.opacity=1,D.transparent=!0,D.needsUpdate=!0,c.current.overlayTop.visible=!0}else{const D=c.current.overlayTop.material,X=c.current.overlayBot.material;if(D.map=y,D.opacity=1,D.transparent=!0,D.needsUpdate=!0,c.current.overlayTop.visible=!0,y instanceof Wi){const k=y.image,F=new Wi(k);F.colorSpace=at,F.minFilter=St,F.magFilter=St,F.format=on,F.flipY=!1,F.needsUpdate=!0,(P=y.userData)!=null&&P.dispose&&(F.userData.dispose=y.userData.dispose),X.map=F}else{const k=y.clone();k.flipY=!0,k.needsUpdate=!0,X.map=k}X.opacity=1,X.transparent=!0,X.needsUpdate=!0,c.current.overlayBot.visible=!0}}).catch(y=>{console.error("Failed to load overlay texture:",y)})},A=(E=!0)=>{var y,w,N,O;if(!c.current)return;E&&u.current++;const M=c.current.overlayTop.material,b=c.current.overlayBot.material;M.map&&((w=(y=M.map.userData)==null?void 0:y.dispose)==null||w.call(y),M.map.dispose(),M.map=null),b.map&&((O=(N=b.map.userData)==null?void 0:N.dispose)==null||O.call(N),b.map.dispose(),b.map=null),M.opacity=0,M.transparent=!0,M.needsUpdate=!0,b.opacity=0,b.transparent=!0,b.needsUpdate=!0,c.current.overlayTop.visible=!1,c.current.overlayBot.visible=!1};return tt.useEffect(()=>{if(!c.current)return;if((!f.overlayUrl||f.overlayUrl.trim()==="")&&(!f.overlayUrl2||f.overlayUrl2.trim()==="")){A(!0);return}const M=++u.current;A(!1),f.overlayUrl&&f.overlayUrl.trim()!==""&&S(f.overlayUrl,!1,M),f.dualOverlay&&f.overlayUrl2&&f.overlayUrl2.trim()!==""&&S(f.overlayUrl2,!0,M)},[f.overlayUrl,f.overlayUrl2,f.dualOverlay]),$.jsxs("div",{className:`relative w-full h-full ${t}`,children:[r&&$.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10",children:$.jsxs("div",{className:"text-center",children:[$.jsx("div",{className:"w-16 h-16 mx-auto mb-4 relative",children:$.jsx("div",{className:"w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"})}),$.jsx("p",{className:"text-gray-700 font-medium mb-2",children:"Loading Editor"}),$.jsx("div",{className:"w-32 h-1 bg-gray-200 rounded-full overflow-hidden",children:$.jsx("div",{className:"h-full bg-blue-500 transition-all duration-300 rounded-full",style:{width:`${o}%`}})}),$.jsxs("p",{className:"text-gray-500 text-sm mt-2",children:[Math.round(o),"%"]})]})}),$.jsx("div",{ref:i,className:`w-full h-full transition-opacity duration-500 ${r?"opacity-30":"opacity-100"}`,style:{minHeight:"400px"}})]})});Wy.displayName="CoinEditor";const HC=({isOpen:t,onClose:e,settings:n,onSettingsChange:i})=>{const[r,s]=tt.useState(""),[o,a]=tt.useState(""),[l,u]=tt.useState(""),c=(p,d)=>{i({...n,[p]:d})},h=()=>{r.trim()&&c("overlayUrl",r.trim()),n.dualOverlay&&o.trim()&&c("overlayUrl2",o.trim())},f=()=>{l.trim()&&c("bodyTextureUrl",l.trim())},m=()=>{console.log("Clear button clicked - before clear:",{currentOverlayUrl:n.overlayUrl,currentOverlayUrl2:n.overlayUrl2,tempOverlayUrl:r,tempOverlayUrl2:o}),s(""),a("");const p={...n,overlayUrl:"",overlayUrl2:""};i(p)},_=()=>{c("bodyTextureUrl",""),u("")},x=({checked:p,onChange:d,disabled:v=!1})=>$.jsx("button",{onClick:()=>!v&&d(!p),disabled:v,className:`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors border
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${p?"bg-blue-500 border-blue-500":v?"bg-gray-200 border-gray-200 cursor-not-allowed":"bg-gray-200 border-gray-300"}
      `,children:$.jsx("span",{className:`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${p?"translate-x-5":"translate-x-0.5"}
        `})});return t?$.jsxs($.Fragment,{children:[$.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-30 z-40",onClick:e}),$.jsxs("div",{className:"fixed top-20 left-4 right-4 bg-white border-2 border-blue-500 rounded-lg shadow-xl z-50 max-h-[calc(100vh-6rem)] overflow-y-auto",children:[$.jsxs("div",{className:"flex items-center justify-between p-4 border-b border-gray-200",children:[$.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Editor"}),$.jsx("button",{onClick:e,className:"w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors border border-gray-300",children:$.jsx("svg",{className:"w-4 h-4 text-gray-600",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:$.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),$.jsxs("div",{className:"p-4 space-y-6",children:[$.jsxs("div",{className:"space-y-3",children:[$.jsx("h3",{className:"text-base font-medium text-gray-900",children:"Body Design"}),$.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[$.jsx("button",{onClick:()=>c("fillMode","solid"),className:`p-3 rounded-lg border-2 text-sm font-medium transition-all ${n.fillMode==="solid"?"border-blue-500 bg-blue-50 text-blue-500":"border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"}`,children:"Solid Color"}),$.jsx("button",{onClick:()=>c("fillMode","gradient"),className:`p-3 rounded-lg border-2 text-sm font-medium transition-all ${n.fillMode==="gradient"?"border-blue-500 bg-blue-50 text-blue-500":"border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:bg-gray-50"}`,children:"Gradient"})]})]}),n.fillMode==="solid"?$.jsxs("div",{className:"space-y-3",children:[$.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Body Color"}),$.jsx("input",{type:"color",value:n.bodyColor,onChange:p=>c("bodyColor",p.target.value),className:"w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"})]}):$.jsxs("div",{className:"space-y-3",children:[$.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Body Colors"}),$.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[$.jsx("div",{children:$.jsx("input",{type:"color",value:n.gradientStart,onChange:p=>c("gradientStart",p.target.value),className:"w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"})}),$.jsx("div",{children:$.jsx("input",{type:"color",value:n.gradientEnd,onChange:p=>c("gradientEnd",p.target.value),className:"w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"})})]})]}),$.jsxs("div",{className:"space-y-3",children:[$.jsx("label",{className:"block text-sm font-medium text-gray-700",children:"Body Texture (Optional)"}),$.jsxs("div",{className:"space-y-2",children:[$.jsx("input",{type:"url",value:l,onChange:p=>u(p.target.value),placeholder:"https://example.com/txtr.jpg/png/gif/webm",className:"w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"}),$.jsxs("div",{className:"flex space-x-2",children:[$.jsx("button",{onClick:f,className:"flex-1 bg-white border-2 border-blue-500 text-blue-500 font-medium py-2 px-3 rounded-lg transition-colors hover:bg-blue-50 text-sm",children:"Apply Texture"}),$.jsx("button",{onClick:_,className:"flex-1 bg-white border-2 border-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors hover:bg-gray-50 text-sm",children:"Clear"})]})]})]}),$.jsxs("div",{className:"flex items-center justify-between",children:[$.jsxs("div",{children:[$.jsx("span",{className:"text-gray-900 font-medium text-sm",children:"Metallic Finish"}),$.jsx("p",{className:"text-xs text-gray-500",children:"Adds reflective surface"})]}),$.jsx(x,{checked:n.metallic,onChange:p=>c("metallic",p)})]}),$.jsxs("div",{className:"space-y-3",children:[$.jsx("h3",{className:"text-base font-medium text-gray-900",children:"Coin Rotation Speed"}),$.jsx("div",{className:"grid grid-cols-3 gap-2",children:["slow","medium","fast"].map(p=>$.jsx("button",{onClick:()=>c("rotationSpeed",p),className:`p-2 rounded-lg text-sm font-medium transition-all capitalize border-2 ${n.rotationSpeed===p?"bg-blue-50 text-blue-500 border-blue-500":"bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`,children:p},p))})]}),$.jsxs("div",{className:"space-y-3",children:[$.jsx("h3",{className:"text-base font-medium text-gray-900",children:"Face Images"}),$.jsxs("div",{className:"flex items-center justify-between",children:[$.jsxs("div",{children:[$.jsx("span",{className:"text-gray-900 font-medium text-sm",children:"Different Images"}),$.jsx("p",{className:"text-xs text-gray-500",children:"Use different images for front/back"})]}),$.jsx(x,{checked:n.dualOverlay,onChange:p=>c("dualOverlay",p)})]}),$.jsxs("div",{className:"space-y-3",children:[$.jsxs("div",{children:[$.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:n.dualOverlay?"Front Image URL":"Image URL"}),$.jsx("input",{type:"url",value:r,onChange:p=>s(p.target.value),placeholder:"https://example.com/img.jpg/png/gif/webm",className:"w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"})]}),n.dualOverlay&&$.jsxs("div",{children:[$.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Back Image URL"}),$.jsx("input",{type:"url",value:o,onChange:p=>a(p.target.value),placeholder:"https://example.com/img2.jpg/png/gif/webm",className:"w-full px-3 py-2 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"})]})]}),$.jsxs("div",{className:"flex space-x-2",children:[$.jsx("button",{onClick:h,className:"flex-1 bg-white border-2 border-blue-500 text-blue-500 font-medium py-2 px-3 rounded-lg transition-colors hover:bg-blue-50 text-sm",children:"Apply Images"}),$.jsx("button",{onClick:m,className:"flex-1 bg-white border-2 border-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors hover:bg-gray-50 text-sm",children:"Clear"})]})]}),$.jsxs("div",{className:"space-y-3",children:[$.jsx("h3",{className:"text-base font-medium text-gray-900",children:"GIF Animation Speed"}),$.jsx("div",{className:"grid grid-cols-3 gap-2",children:["slow","medium","fast"].map(p=>$.jsx("button",{onClick:()=>c("gifAnimationSpeed",p),className:`p-2 rounded-lg text-sm font-medium transition-all capitalize border-2 ${n.gifAnimationSpeed===p?"bg-blue-50 text-blue-500 border-blue-500":"bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`,children:p},p))})]}),$.jsxs("div",{className:"space-y-3",children:[$.jsx("h3",{className:"text-base font-medium text-gray-900",children:"Lighting"}),$.jsxs("div",{className:"space-y-3",children:[$.jsxs("div",{children:[$.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Light Color"}),$.jsx("input",{type:"color",value:n.lightColor,onChange:p=>c("lightColor",p.target.value),className:"w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"})]}),$.jsxs("div",{children:[$.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Intensity"}),$.jsx("div",{className:"grid grid-cols-3 gap-2",children:["low","medium","strong"].map(p=>$.jsx("button",{onClick:()=>c("lightStrength",p),className:`p-2 rounded-lg text-sm font-medium transition-all capitalize border-2 ${n.lightStrength===p?"bg-blue-50 text-blue-500 border-blue-500":"bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`,children:p},p))})]})]})]})]})]})]}):null},VC=()=>{const{isInTelegram:t,initData:e}=AM(),[n,i]=tt.useState(!1),[r,s]=tt.useState(!1),o=tt.useRef(null),[a,l]=tt.useState({fillMode:"solid",bodyColor:"#cecece",gradientStart:"#00eaff",gradientEnd:"#ee00ff",bodyTextureUrl:"",metallic:!0,rotationSpeed:"medium",overlayUrl:"",dualOverlay:!1,overlayUrl2:"",gifAnimationSpeed:"medium",lightColor:"#cecece",lightStrength:"medium"});if(!t)return $.jsx(RM,{});const u=async()=>{if(o.current){s(!0);try{const h=o.current.getScene(),f=o.current.getCamera(),m=o.current.getRenderer(),_=o.current.getTurntable();if(!h||!f||!m||!_)throw new Error("Scene not ready");const x=new Kf(h,f,m,_),p=await x.exportAsWebM({fps:30,duration:2,size:100});x.downloadBlob(p,"coin_emoji.webm")}catch(h){console.error("Export failed:",h),alert("Export failed. Please try again.")}finally{s(!1)}}},c=async()=>{if(!(!o.current||!e)){s(!0);try{const h=o.current.getScene(),f=o.current.getCamera(),m=o.current.getRenderer(),_=o.current.getTurntable();if(!h||!f||!m||!_)throw new Error("Scene not ready");const p=await new Kf(h,f,m,_).exportAsWebM({fps:30,duration:2,size:100}),d=await zC(p,e,["🪙"],"My Coinmoji");if(d.success)alert("Emoji created successfully! Check your custom emojis in Telegram.");else throw new Error(d.error||"Failed to create emoji")}catch(h){console.error("Emoji creation failed:",h),alert("Failed to create emoji. Please try again.")}finally{s(!1)}}};return $.jsxs("div",{className:"min-h-screen bg-gray-100 flex flex-col",children:[$.jsx("div",{className:"p-4",children:$.jsxs("button",{onClick:()=>i(!0),className:"w-full bg-white border-2 text-gray-700 font-medium py-3 px-6 rounded-lg hover:border-blue-500 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm",children:[$.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:$.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"})}),$.jsx("span",{children:"Edit Coin"}),$.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:$.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]})}),$.jsxs("main",{className:"flex flex-col px-4",children:[$.jsx("div",{className:"flex-1 mb-4",children:$.jsx("div",{className:"bg-white border-2 rounded-lg h-full shadow-sm",children:$.jsx(Wy,{ref:o,className:"h-full",settings:a,onSettingsChange:l})})}),$.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[$.jsx("button",{onClick:u,disabled:r,className:"bg-blue-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-600 active:scale-95 transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm",children:r?$.jsxs($.Fragment,{children:[$.jsxs("svg",{className:"animate-spin w-5 h-5",fill:"none",viewBox:"0 0 24 24",children:[$.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),$.jsx("path",{className:"opacity-75",fill:"currentColor",d:"m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),$.jsx("span",{className:"text-sm",children:"Exporting..."})]}):$.jsxs($.Fragment,{children:[$.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:$.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"})}),$.jsx("span",{className:"text-sm font-medium",children:"Download"})]})}),$.jsxs("button",{onClick:c,className:"bg-white text-gray-700 font-medium py-3 px-4 rounded-lg border-2 hover:border-blue-500 active:scale-95 transition-all duration-150 flex items-center justify-center space-x-2 shadow-sm",children:[$.jsx("span",{className:"text-lg",children:"✨"}),$.jsx("span",{className:"text-sm font-medium",children:"Create Emoji"})]})]}),$.jsx("div",{className:"pb-4"})]}),$.jsx(HC,{isOpen:n,onClose:()=>i(!1),settings:a,onSettingsChange:l})]})},GC=()=>$.jsx(CM,{children:$.jsx(VC,{})});Pd.createRoot(document.getElementById("root")).render($.jsx(px.StrictMode,{children:$.jsx(GC,{})}));
//# sourceMappingURL=index-DOfqbsX1.js.map

module.exports=[193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},600814,e=>{"use strict";var t=e.i(747909),r=e.i(174017),n=e.i(996250),o=e.i(759756),a=e.i(561916),s=e.i(174677),i=e.i(869741),l=e.i(316795),u=e.i(487718),d=e.i(995169),p=e.i(47587),c=e.i(666012),h=e.i(570101),f=e.i(626937),m=e.i(10372),g=e.i(193695);e.i(52474);var y=e.i(600220),w=e.i(89171);e.i(889228);var v=e.i(91601);let b={"mock-101-listening-full":`
Section 1. You will hear a conversation between a student and a library assistant.
Student: Hi, I would like to register for a library membership.
Assistant: Certainly. Your membership number starts with letter L. Your surname?
Student: Rahman. That's R A H M A N.
Assistant: Address?
Student: Nineteen Station Road.
Assistant: You can borrow up to eight books for fourteen days. Late fee is one dollar per day.
Student: What time does the reading room open?
Assistant: It opens at nine a.m. On Saturdays we close at five p.m.
Student: Great. Any workshops this month?
Assistant: Yes, academic writing. Please bring your student ID card when you come.

Section 2. You will hear a guide giving information about a museum.
Guide: Welcome everyone. The temporary exhibition is on level one, opposite the main lift.
Printed maps are free at the entrance desk. Priority lane is for online ticket holders.
In an alarm, follow staff to the outdoor assembly point. Photography is allowed, but no flash.
The science zone is for children aged eight to twelve. The rooftop gallery closes earlier than other areas.
You can register for workshops at reception. The quiet study area is beside the city archive room.
Please arrive at least fifteen minutes before your scheduled slot.

Section 3. You will hear two students discussing a project with their tutor.
Tutor: Narrow your topic to food waste in campus canteens. It is easier to measure.
Student: Our questionnaire currently takes fourteen minutes.
Tutor: Too long. Keep it shorter and aim for around one hundred and fifty responses.
Student: What is the biggest risk?
Tutor: Low response in week two. Send reminders.
Student: Which software for charts?
Tutor: Use Excel first. Also, do a pilot test with ten students and collect both online and paper forms.
Both of you should meet canteen managers. Submit literature review by Friday noon.
Keep interviews to about ten minutes and use APA seventh edition.

Section 4. You will hear a lecture about urban heat islands.
Lecturer: Urban heat often peaks after sunset. Dark surfaces have low albedo and absorb heat.
Vehicle engines are a major heat source. Street trees improve pedestrian comfort.
Green roofs can lower building energy demand. Reflective coatings are most effective on rooftops.
Cooling centers are especially important for the elderly. Cities should publish neighborhood heat maps.
Pilot projects should be evaluated over at least two summers.
Finally, long term success depends on consistent local maintenance.
That is the end of the listening test.
`,"mock-101-listening-part1":`
Section 1. Library membership enquiry.
Assistant: Good morning, central city library. How can I help?
Student: I want to register for a membership.
Assistant: Sure. Your membership number starts with letter L. What is your surname?
Student: Rahman. R A H M A N.
Assistant: Address please?
Student: Nineteen Station Road, near the post office.
Assistant: You may borrow eight books for fourteen days. Late fee is one dollar per day.
Student: What time do you open on weekends?
Assistant: We open at nine and close at five.
Student: Any free workshop this month?
Assistant: Yes, academic writing. Bring your student ID card.
`,"mock-101-listening-part2":`
Section 2. Museum orientation.
Guide: The temporary exhibition is on level one opposite the lift.
Printed maps are free. Priority entry is for online ticket holders.
If you hear an alarm, follow staff to the outdoor assembly point.
Photography is allowed but no flash.
The science zone is best for children aged eight to twelve.
The rooftop gallery closes earlier than other sections.
Workshops can be booked at reception, and the quiet study area is beside the archive room.
Please arrive fifteen minutes before your slot.
`,"mock-101-listening-part3":`
Section 3. Tutor discussion.
Tutor: Narrow your project to food waste in campus canteens.
Student: Our survey takes fourteen minutes now.
Tutor: That is too long. Keep it shorter and target one hundred and fifty participants.
Student: Biggest risk?
Tutor: Low response in week two.
Student: Software?
Tutor: Start with Excel.
Also run a pilot with ten students and use online plus paper forms.
Both of you should meet canteen managers. Submit your literature review by Friday noon.
Keep interviews around ten minutes and use APA seventh edition.
`,"mock-101-listening-part4":`
Section 4. Urban heat lecture.
Lecturer: Urban heat often peaks after sunset.
Dark surfaces have low albedo and absorb heat.
Vehicle engines add waste heat.
Street trees improve pedestrian comfort.
Green roofs can reduce building energy demand.
Reflective coatings work best on rooftops.
Cooling centers are important for the elderly.
Cities should publish neighborhood heat maps.
Pilot projects should run for at least two summers.
Long term success depends on maintenance.
`};function x(e){return e&&b[e]||null}function R(){return w.NextResponse.json({error:"Audio generation requires OPENAI_API_KEY."},{status:400})}async function A(e,t){let r=new v.default({apiKey:process.env.OPENAI_API_KEY}),n=await r.audio.speech.create({model:"gpt-4o-mini-tts",voice:t,input:e});return new Response(Buffer.from(await n.arrayBuffer()),{status:200,headers:{"Content-Type":"audio/mpeg","Cache-Control":"public, max-age=3600"}})}async function S(e){if(!process.env.OPENAI_API_KEY||"sk-your-openai-api-key-here"===process.env.OPENAI_API_KEY)return R();let{searchParams:t}=new URL(e.url),r=t.get("preset"),n=t.get("voice")||"alloy",o=t.get("text"),a=o?.trim()||x(r);if(!a)return w.NextResponse.json({error:"Provide ?preset=... or ?text=..."},{status:400});try{return await A(a,n)}catch{return w.NextResponse.json({error:"Audio generation failed."},{status:500})}}async function E(e){if(!process.env.OPENAI_API_KEY||"sk-your-openai-api-key-here"===process.env.OPENAI_API_KEY)return R();try{let t=await e.json(),r="string"==typeof t?.preset?t.preset:null,n="string"==typeof t?.voice?t.voice:"alloy",o=("string"==typeof t?.text?t.text.trim():"")||x(r);if(!o)return w.NextResponse.json({error:"text or preset is required."},{status:400});return await A(o,n)}catch{return w.NextResponse.json({error:"Invalid request payload."},{status:400})}}e.s(["GET",0,S,"POST",0,E,"runtime",0,"nodejs"],612920);var k=e.i(612920);let P=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/audio/route",pathname:"/api/audio",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/audio/route.ts",nextConfigOutput:"",userland:k,...{}}),{workAsyncStorage:T,workUnitAsyncStorage:C,serverHooks:N}=P;async function I(e,t,n){n.requestMeta&&(0,o.setRequestMeta)(e,n.requestMeta),P.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let w="/api/audio/route";w=w.replace(/\/index$/,"")||"/";let v=await P.prepare(e,t,{srcPage:w,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:b,params:x,nextConfig:R,parsedUrl:A,isDraftMode:S,prerenderManifest:E,routerServerContext:k,isOnDemandRevalidate:T,revalidateOnlyGenerated:C,resolvedPathname:N,clientReferenceManifest:I,serverActionsManifest:_}=v,q=(0,i.normalizeAppPath)(w),O=!!(E.dynamicRoutes[q]||E.routes[N]),j=async()=>((null==k?void 0:k.render404)?await k.render404(e,t,A,!1):t.end("This page could not be found"),null);if(O&&!S){let e=!!E.routes[N],t=E.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(R.adapterPath)return await j();throw new g.NoFallbackError}}let H=null;!O||P.isDev||S||(H="/index"===(H=N)?"/":H);let U=!0===P.isDev||!O,K=O&&!U;_&&I&&(0,s.setManifestsSingleton)({page:w,clientReferenceManifest:I,serverActionsManifest:_});let M=e.method||"GET",Y=(0,a.getTracer)(),D=Y.getActiveScopeSpan(),L=!!(null==k?void 0:k.isWrappedByNextServer),B=!!(0,o.getRequestMeta)(e,"minimalMode"),F=(0,o.getRequestMeta)(e,"incrementalCache")||await P.getIncrementalCache(e,R,E,B);null==F||F.resetRequestCache(),globalThis.__incrementalCache=F;let W={params:x,previewProps:E.preview,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:U,incrementalCache:F,cacheLifeProfiles:R.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n,o)=>P.onRequestError(e,t,n,o,k)},sharedContext:{buildId:b}},G=new l.NodeNextRequest(e),$=new l.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(G,(0,u.signalFromNodeResponse)(t));try{let o,s=async e=>P.handle(V,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=Y.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${M} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),o&&o!==e&&(o.setAttribute("http.route",n),o.updateName(t))}else e.updateName(`${M} ${w}`)}),i=async o=>{var a,i;let l=async({previousCacheEntry:r})=>{try{if(!B&&T&&C&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(o);e.fetchMetrics=W.renderOpts.fetchMetrics;let i=W.renderOpts.pendingWaitUntil;i&&n.waitUntil&&(n.waitUntil(i),i=void 0);let l=W.renderOpts.collectedTags;if(!O)return await (0,c.sendResponse)(G,$,a,W.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(a.headers);l&&(t[m.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,n=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await P.onRequestError(e,t,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:K,isOnDemandRevalidate:T})},!1,k),t}},u=await P.handleResponse({req:e,nextConfig:R,cacheKey:H,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:E,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:C,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:B});if(!O)return null;if((null==u||null==(a=u.value)?void 0:a.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(i=u.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});B||t.setHeader("x-nextjs-cache",T?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,h.fromNodeOutgoingHttpHeaders)(u.value.headers);return B&&O||d.delete(m.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,f.getCacheControlHeader)(u.cacheControl)),await (0,c.sendResponse)(G,$,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};L&&D?await i(D):(o=Y.getActiveScopeSpan(),await Y.withPropagatedContext(e.headers,()=>Y.trace(d.BaseServerSpan.handleRequest,{spanName:`${M} ${w}`,kind:a.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},i),void 0,!L))}catch(t){if(t instanceof g.NoFallbackError||await P.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:K,isOnDemandRevalidate:T})},!1,k),O)throw t;return await (0,c.sendResponse)(G,$,new Response(null,{status:500})),null}}e.s(["handler",0,I,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:C})},"routeModule",0,P,"serverHooks",0,N,"workAsyncStorage",0,T,"workUnitAsyncStorage",0,C],600814)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0_npcp8._.js.map
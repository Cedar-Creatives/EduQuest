import{c as n}from"./index-BR-T537K.js";import{a as c}from"./api-BwjwlSn4.js";/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=n("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=n("Shield",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}]]),g=async()=>{var o,r;try{return(await c.get("/api/users/profile")).data}catch(s){throw new Error(((r=(o=s==null?void 0:s.response)==null?void 0:o.data)==null?void 0:r.message)||s.message)}},u=async o=>{var r,s,a,t;console.log("=== API UPDATE PROFILE CALL ==="),console.log("Data being sent to API:",o);try{console.log("Making PUT request to /api/users/profile");const e=await c.put("/api/users/profile",o);return console.log("API response received:",e),console.log("Response data:",e.data),e.data}catch(e){throw console.error("=== API UPDATE PROFILE ERROR ==="),console.error("Error in updateProfile API call:",e),console.error("Error response:",e.response),console.error("Error response data:",(r=e.response)==null?void 0:r.data),console.error("Error response status:",(s=e.response)==null?void 0:s.status),new Error(((t=(a=e==null?void 0:e.response)==null?void 0:a.data)==null?void 0:t.message)||e.message)}};export{i as C,d as S,g,u};

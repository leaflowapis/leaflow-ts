import test from 'node:test';
import assert from 'node:assert/strict';
import { getListPlansUrl, listPlans } from '../dist/swas/v1/generated/functions.js';
import { ListPlansQueryParams } from '../dist/swas/v1/generated/schemas.zod.js';
import { Plan, PriceOption, Error as ErrorResponse } from '../dist/swas/v1/response-schemas.js';

const option = { billing_plan_id: '10000000-0000-4000-8000-000000000001', billing_price_id: '20000000-0000-4000-8000-000000000001', currency: 'USD', amount: '10.01', period_months: 1 };
const plan = {provider_plan_id:'plan-1', region_id:'region-1', name:'Synthetic', catalog_revision:1, buyable:false, price:null, image_ids:['image-1'], cpu:2, memory_mb:1024, disk_gb:40};

test('multi-period native query defaults and serialization', async () => {
 for (const [params, expected] of [[{region_id:'region-1'},null], [{region_id:'region-1',include_prices:false},'false'], [{region_id:'region-1',include_prices:true},'true']]) {
  assert.equal(new URL(getListPlansUrl(params)).searchParams.get('include_prices'),expected);
  let calls=0;
  const response=await listPlans(params,undefined,async (url)=>{
   calls++;
   assert.equal(new URL(url).searchParams.get('include_prices'),expected);
   return new Response(JSON.stringify({items:[],source_observed_at:'2026-10-25T00:00:00Z',complete:true}),{status:200,headers:{'content-type':'application/json'}});
  });
  assert.equal(calls,1);assert.equal(response.status,200);
 }
 assert.equal(ListPlansQueryParams.parse({region_id:'region-1'}).include_prices,false);
 assert.equal(ListPlansQueryParams.parse({region_id:'region-1',include_prices:true}).include_prices,true);
 assert.equal(ListPlansQueryParams.safeParse({region_id:'region-1',include_prices:'true'}).success,false);
 assert.equal(ListPlansQueryParams.safeParse({region_id:'region-1',amount:'1'}).success,false);
});

test('multi-period native response schemas preserve absence and explicit empty',()=>{
 const old=Plan.parse(plan);
 assert.equal(Object.hasOwn(old,'prices'),false);
 assert.deepEqual(Plan.parse({...plan,prices:[]}).prices,[]);
 for (const period_months of [1,3,6,12,24,36]) {
  const parsed=PriceOption.parse({...option,period_months});
  assert.equal(parsed.amount,'10.01'); assert.equal(parsed.period_months,period_months);
 }
 assert.equal(Plan.parse({...plan,prices:[option]}).prices[0].billing_price_id,option.billing_price_id);
 for (const invalid of [{...option,period_months:2},{...option,period_months:null},{...option,currency:'CNY'},{...option,amount:10.01},{...option,unknown:true}]) {
  assert.equal(PriceOption.safeParse(invalid).success,false);
 }
 assert.equal(Plan.safeParse({...plan,prices:Array(7).fill(option)}).success,false);
});
test('multi-period retains the authoritative nested Error response',()=>{
 const canonical={error:{code:400,status:'INVALID_ARGUMENT',message:'Invalid synthetic request',reason:'INVALID_ARGUMENT'}};
 assert.equal(ErrorResponse.parse(canonical).error.code,400);
 assert.equal(ErrorResponse.safeParse({status:400,message:'stale flat shape'}).success,false);
});

test('Price option may omit historical amount; Billing owns quotes',()=>{
 const {amount,...selection}=option;
 const parsed=PriceOption.parse(selection);
 assert.equal(Object.hasOwn(parsed,'amount'),false);
 assert.equal(parsed.billing_price_id,option.billing_price_id);
});

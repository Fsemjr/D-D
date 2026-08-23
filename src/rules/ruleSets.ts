import type { RuleSet } from '../types';
export const standardRuleSet:RuleSet={id:'standard',name:'D&D 5e Standard',totalPoints:27,minimumAbility:8,maximumAbility:15,costTable:{8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9},levelLimit:20};
export const createCustomRuleSet=(totalPoints=27,min=8,max=15):RuleSet=>({id:'custom',name:'Custom',totalPoints,minimumAbility:min,maximumAbility:max,costTable:Object.fromEntries(Array.from({length:max-min+1},(_,i)=>[min+i,Math.max(0,min+i-min)])),levelLimit:20,custom:true});

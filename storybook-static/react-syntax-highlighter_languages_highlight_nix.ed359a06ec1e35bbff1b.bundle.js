(window.webpackJsonp=window.webpackJsonp||[]).push([[110],{1574:function(n,e){n.exports=function(n){var e={keyword:"rec with let in inherit assert if else then",literal:"true false or and null",built_in:"import abort baseNameOf dirOf isNull builtins map removeAttrs throw toString derivation"},i={className:"subst",begin:/\$\{/,end:/}/,keywords:e},s={className:"string",contains:[i],variants:[{begin:"''",end:"''"},{begin:'"',end:'"'}]},t=[n.NUMBER_MODE,n.HASH_COMMENT_MODE,n.C_BLOCK_COMMENT_MODE,s,{begin:/[a-zA-Z0-9-_]+(\s*=)/,returnBegin:!0,relevance:0,contains:[{className:"attr",begin:/\S+/}]}];return i.contains=t,{aliases:["nixos"],keywords:e,contains:t}}}}]);
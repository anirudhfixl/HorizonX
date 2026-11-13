/*! SES sources included by LavaMoat. Do not optimize or minify. */
;
// ses@2.2.0
(functors => options => {
  'use strict';

  const {
    Map,
    Object,
    ReferenceError,
    Reflect,
    TypeError,
  } = globalThis;
  const {
    create,
    defineProperties,
    defineProperty,
    freeze,
    fromEntries,
    getOwnPropertyDescriptors,
    getOwnPropertyNames,
    keys,
  } = Object;
  const { get, set } = Reflect;

  const {
  } = options || {};



  const cell = (name, value = undefined) => {
    const observers = [];
    return freeze({
      get: freeze(() => {
        return value;
      }),
      set: freeze((newValue) => {
        value = newValue;
        for (const observe of observers) {
          observe(value);
        }
      }),
      observe: freeze((observe) => {
        observers.push(observe);
        observe(value);
      }),
      enumerable: true,
    });
  };

  const cells = [
    {
      globalThis: cell("globalThis"),
      Array: cell("Array"),
      ArrayBuffer: cell("ArrayBuffer"),
      Date: cell("Date"),
      FinalizationRegistry: cell("FinalizationRegistry"),
      FERAL_FLOAT64_ARRAY: cell("FERAL_FLOAT64_ARRAY"),
      DataView: cell("DataView"),
      JSON: cell("JSON"),
      Map: cell("Map"),
      Math: cell("Math"),
      Number: cell("Number"),
      BigInt: cell("BigInt"),
      Object: cell("Object"),
      Promise: cell("Promise"),
      Proxy: cell("Proxy"),
      Reflect: cell("Reflect"),
      FERAL_REG_EXP: cell("FERAL_REG_EXP"),
      Set: cell("Set"),
      String: cell("String"),
      Symbol: cell("Symbol"),
      Uint8Array: cell("Uint8Array"),
      WeakMap: cell("WeakMap"),
      WeakSet: cell("WeakSet"),
      Temporal: cell("Temporal"),
      FERAL_ERROR: cell("FERAL_ERROR"),
      RangeError: cell("RangeError"),
      ReferenceError: cell("ReferenceError"),
      SyntaxError: cell("SyntaxError"),
      TypeError: cell("TypeError"),
      AggregateError: cell("AggregateError"),
      assign: cell("assign"),
      create: cell("create"),
      defineProperties: cell("defineProperties"),
      entries: cell("entries"),
      getOwnPropertyDescriptor: cell("getOwnPropertyDescriptor"),
      getOwnPropertyDescriptors: cell("getOwnPropertyDescriptors"),
      getOwnPropertyNames: cell("getOwnPropertyNames"),
      getPrototypeOf: cell("getPrototypeOf"),
      is: cell("is"),
      isFrozen: cell("isFrozen"),
      isSealed: cell("isSealed"),
      isExtensible: cell("isExtensible"),
      keys: cell("keys"),
      objectPrototype: cell("objectPrototype"),
      seal: cell("seal"),
      preventExtensions: cell("preventExtensions"),
      setPrototypeOf: cell("setPrototypeOf"),
      values: cell("values"),
      fromEntries: cell("fromEntries"),
      freeze: cell("freeze"),
      speciesSymbol: cell("speciesSymbol"),
      toStringTagSymbol: cell("toStringTagSymbol"),
      iteratorSymbol: cell("iteratorSymbol"),
      matchAllSymbol: cell("matchAllSymbol"),
      replaceSymbol: cell("replaceSymbol"),
      searchSymbol: cell("searchSymbol"),
      unscopablesSymbol: cell("unscopablesSymbol"),
      symbolKeyFor: cell("symbolKeyFor"),
      symbolFor: cell("symbolFor"),
      max: cell("max"),
      min: cell("min"),
      trunc: cell("trunc"),
      MAX_SAFE_INTEGER: cell("MAX_SAFE_INTEGER"),
      isInteger: cell("isInteger"),
      stringifyJson: cell("stringifyJson"),
      defineProperty: cell("defineProperty"),
      apply: cell("apply"),
      construct: cell("construct"),
      reflectGet: cell("reflectGet"),
      reflectGetOwnPropertyDescriptor: cell("reflectGetOwnPropertyDescriptor"),
      reflectHas: cell("reflectHas"),
      reflectIsExtensible: cell("reflectIsExtensible"),
      ownKeys: cell("ownKeys"),
      reflectPreventExtensions: cell("reflectPreventExtensions"),
      reflectSet: cell("reflectSet"),
      isArray: cell("isArray"),
      arrayPrototype: cell("arrayPrototype"),
      arrayBufferPrototype: cell("arrayBufferPrototype"),
      dataViewPrototype: cell("dataViewPrototype"),
      mapPrototype: cell("mapPrototype"),
      proxyRevocable: cell("proxyRevocable"),
      regexpPrototype: cell("regexpPrototype"),
      setPrototype: cell("setPrototype"),
      stringPrototype: cell("stringPrototype"),
      weakmapPrototype: cell("weakmapPrototype"),
      weaksetPrototype: cell("weaksetPrototype"),
      functionPrototype: cell("functionPrototype"),
      promisePrototype: cell("promisePrototype"),
      generatorPrototype: cell("generatorPrototype"),
      iteratorPrototype: cell("iteratorPrototype"),
      typedArrayPrototype: cell("typedArrayPrototype"),
      uncurryThis: cell("uncurryThis"),
      hasOwn: cell("hasOwn"),
      arrayFilter: cell("arrayFilter"),
      arrayForEach: cell("arrayForEach"),
      arrayIncludes: cell("arrayIncludes"),
      arrayJoin: cell("arrayJoin"),
      arrayMap: cell("arrayMap"),
      arrayFlatMap: cell("arrayFlatMap"),
      arrayPop: cell("arrayPop"),
      arrayPush: cell("arrayPush"),
      arraySlice: cell("arraySlice"),
      arraySome: cell("arraySome"),
      arraySort: cell("arraySort"),
      iterateArray: cell("iterateArray"),
      arrayBufferSlice: cell("arrayBufferSlice"),
      arrayBufferGetByteLength: cell("arrayBufferGetByteLength"),
      typedArraySet: cell("typedArraySet"),
      mapSet: cell("mapSet"),
      mapGet: cell("mapGet"),
      mapHas: cell("mapHas"),
      mapDelete: cell("mapDelete"),
      mapEntries: cell("mapEntries"),
      iterateMap: cell("iterateMap"),
      setAdd: cell("setAdd"),
      setDelete: cell("setDelete"),
      setForEach: cell("setForEach"),
      setHas: cell("setHas"),
      iterateSet: cell("iterateSet"),
      regexpExec: cell("regexpExec"),
      regexpReplace: cell("regexpReplace"),
      regexpSearch: cell("regexpSearch"),
      matchAllRegExp: cell("matchAllRegExp"),
      sealRegexp: cell("sealRegexp"),
      freezeRegexp: cell("freezeRegexp"),
      stringEndsWith: cell("stringEndsWith"),
      stringIncludes: cell("stringIncludes"),
      stringIndexOf: cell("stringIndexOf"),
      stringMatch: cell("stringMatch"),
      stringSearch: cell("stringSearch"),
      stringSlice: cell("stringSlice"),
      stringSplit: cell("stringSplit"),
      stringStartsWith: cell("stringStartsWith"),
      iterateString: cell("iterateString"),
      weakmapDelete: cell("weakmapDelete"),
      weakmapGet: cell("weakmapGet"),
      weakmapHas: cell("weakmapHas"),
      weakmapSet: cell("weakmapSet"),
      weaksetAdd: cell("weaksetAdd"),
      weaksetHas: cell("weaksetHas"),
      functionToString: cell("functionToString"),
      functionBind: cell("functionBind"),
      generatorNext: cell("generatorNext"),
      generatorThrow: cell("generatorThrow"),
      promiseAll: cell("promiseAll"),
      promiseCatch: cell("promiseCatch"),
      promiseThen: cell("promiseThen"),
      finalizationRegistryRegister: cell("finalizationRegistryRegister"),
      finalizationRegistryUnregister: cell("finalizationRegistryUnregister"),
      isPrimitive: cell("isPrimitive"),
      isError: cell("isError"),
      identity: cell("identity"),
      FERAL_EVAL: cell("FERAL_EVAL"),
      FERAL_FUNCTION: cell("FERAL_FUNCTION"),
      noEvalEvaluate: cell("noEvalEvaluate"),
      FERAL_STACK_GETTER: cell("FERAL_STACK_GETTER"),
      FERAL_STACK_SETTER: cell("FERAL_STACK_SETTER"),
      AsyncGeneratorFunctionInstance: cell("AsyncGeneratorFunctionInstance"),
    },
    {
    },
    {
      makeEnvironmentCaptor: cell("makeEnvironmentCaptor"),
      getEnvironmentOption: cell("getEnvironmentOption"),
      getEnvironmentOptionsList: cell("getEnvironmentOptionsList"),
      environmentOptionsListHas: cell("environmentOptionsListHas"),
    },
    {
    },
    {
      isBufferImmutable: cell("isBufferImmutable"),
      sliceBufferToImmutable: cell("sliceBufferToImmutable"),
      optTransferBufferToImmutable: cell("optTransferBufferToImmutable"),
    },
    {
    },
    {
    },
    {
      an: cell("an"),
      bestEffortStringify: cell("bestEffortStringify"),
      enJoin: cell("enJoin"),
    },
    {
    },
    {
    },
    {
      makeCacheMapKit: cell("makeCacheMapKit"),
    },
    {
      makeCacheMapKit: cell("makeCacheMapKit"),
    },
    {
      makeNoteLogArgsArrayKit: cell("makeNoteLogArgsArrayKit"),
    },
    {
      q: cell("q"),
      b: cell("b"),
      X: cell("X"),
      unredactedDetails: cell("unredactedDetails"),
      makeError: cell("makeError"),
      annotateError: cell("annotateError"),
      loggedErrorHandler: cell("loggedErrorHandler"),
      assert: cell("assert"),
      assertEqual: cell("assertEqual"),
      sanitizeError: cell("sanitizeError"),
      makeAssert: cell("makeAssert"),
    },
    {
      isTypedArray: cell("isTypedArray"),
      makeHardener: cell("makeHardener"),
    },
    {
      cauterizeProperty: cell("cauterizeProperty"),
    },
    {
      NativeErrors: cell("NativeErrors"),
      constantProperties: cell("constantProperties"),
      universalPropertyNames: cell("universalPropertyNames"),
      initialGlobalPropertyNames: cell("initialGlobalPropertyNames"),
      sharedGlobalPropertyNames: cell("sharedGlobalPropertyNames"),
      uniqueGlobalPropertyNames: cell("uniqueGlobalPropertyNames"),
      FunctionInstance: cell("FunctionInstance"),
      AsyncFunctionInstance: cell("AsyncFunctionInstance"),
      isAccessorPermit: cell("isAccessorPermit"),
      permitted: cell("permitted"),
    },
    {
      makeIntrinsicsCollector: cell("makeIntrinsicsCollector"),
      getGlobalIntrinsics: cell("getGlobalIntrinsics"),
    },
    {
      default: cell("default"),
    },
    {
      default: cell("default"),
    },
    {
      default: cell("default"),
    },
    {
      default: cell("default"),
    },
    {
      default: cell("default"),
    },
    {
      tameNaNSideChannel: cell("tameNaNSideChannel"),
    },
    {
      default: cell("default"),
    },
    {
      minEnablements: cell("minEnablements"),
      moderateEnablements: cell("moderateEnablements"),
      severeEnablements: cell("severeEnablements"),
    },
    {
      default: cell("default"),
    },
    {
      default: cell("default"),
    },
    {
      makeEvalFunction: cell("makeEvalFunction"),
    },
    {
      makeFunctionConstructor: cell("makeFunctionConstructor"),
    },
    {
      setGlobalObjectSymbolUnscopables: cell("setGlobalObjectSymbolUnscopables"),
      setGlobalObjectConstantProperties: cell("setGlobalObjectConstantProperties"),
      setGlobalObjectMutableProperties: cell("setGlobalObjectMutableProperties"),
      setGlobalObjectEvaluators: cell("setGlobalObjectEvaluators"),
    },
    {
      alwaysThrowHandler: cell("alwaysThrowHandler"),
      strictScopeTerminatorHandler: cell("strictScopeTerminatorHandler"),
      strictScopeTerminator: cell("strictScopeTerminator"),
    },
    {
      createSloppyGlobalsScopeTerminator: cell("createSloppyGlobalsScopeTerminator"),
    },
    {
      makeEvalScopeKit: cell("makeEvalScopeKit"),
    },
    {
      getSourceURL: cell("getSourceURL"),
    },
    {
      rejectHtmlComments: cell("rejectHtmlComments"),
      evadeHtmlCommentTest: cell("evadeHtmlCommentTest"),
      rejectImportExpressions: cell("rejectImportExpressions"),
      evadeImportExpressionTest: cell("evadeImportExpressionTest"),
      rejectSomeDirectEvalExpressions: cell("rejectSomeDirectEvalExpressions"),
      mandatoryTransforms: cell("mandatoryTransforms"),
      applyTransforms: cell("applyTransforms"),
      transforms: cell("transforms"),
    },
    {
      isValidIdentifierName: cell("isValidIdentifierName"),
      getScopeConstants: cell("getScopeConstants"),
    },
    {
      makeEvaluate: cell("makeEvaluate"),
    },
    {
      makeSafeEvaluator: cell("makeSafeEvaluator"),
    },
    {
      tameFunctionToString: cell("tameFunctionToString"),
    },
    {
      tameDomains: cell("tameDomains"),
    },
    {
      tameModuleSource: cell("tameModuleSource"),
    },
    {
      consoleLevelMethods: cell("consoleLevelMethods"),
      consoleOtherMethods: cell("consoleOtherMethods"),
      makeLoggingConsoleKit: cell("makeLoggingConsoleKit"),
      pumpLogToConsole: cell("pumpLogToConsole"),
      makeCausalConsole: cell("makeCausalConsole"),
      defineCausalConsoleFromLogger: cell("defineCausalConsoleFromLogger"),
      filterConsole: cell("filterConsole"),
    },
    {
      makeRejectionHandlers: cell("makeRejectionHandlers"),
    },
    {
      tameConsole: cell("tameConsole"),
    },
    {
      filterFileName: cell("filterFileName"),
      shortenCallSiteString: cell("shortenCallSiteString"),
      tameV8ErrorConstructor: cell("tameV8ErrorConstructor"),
    },
    {
      default: cell("default"),
    },
    {
      makeAlias: cell("makeAlias"),
      load: cell("load"),
      loadNow: cell("loadNow"),
    },
    {
      deferExports: cell("deferExports"),
      getDeferredExports: cell("getDeferredExports"),
    },
    {
      provideCompartmentEvaluator: cell("provideCompartmentEvaluator"),
      compartmentEvaluate: cell("compartmentEvaluate"),
    },
    {
      makeVirtualModuleInstance: cell("makeVirtualModuleInstance"),
      makeModuleInstance: cell("makeModuleInstance"),
    },
    {
      link: cell("link"),
      instantiate: cell("instantiate"),
    },
    {
      InertCompartment: cell("InertCompartment"),
      CompartmentPrototype: cell("CompartmentPrototype"),
      compartmentOptions: cell("compartmentOptions"),
      makeCompartmentConstructor: cell("makeCompartmentConstructor"),
    },
    {
      getAnonymousIntrinsics: cell("getAnonymousIntrinsics"),
    },
    {
      tameHarden: cell("tameHarden"),
    },
    {
      tameSymbolConstructor: cell("tameSymbolConstructor"),
    },
    {
      tameFauxDataProperty: cell("tameFauxDataProperty"),
      tameFauxDataProperties: cell("tameFauxDataProperties"),
    },
    {
      tameRegeneratorRuntime: cell("tameRegeneratorRuntime"),
    },
    {
      shimArrayBufferTransfer: cell("shimArrayBufferTransfer"),
    },
    {
      chooseReporter: cell("chooseReporter"),
      reportInGroup: cell("reportInGroup"),
    },
    {
      repairIntrinsics: cell("repairIntrinsics"),
    },
    {
    },
    {
    },
    {
    },
    {
    },
    {
    },
  ];

  defineProperties(cells[3], getOwnPropertyDescriptors(cells[2]));

  defineProperties(cells[11], {"makeCacheMapKit": { value: cells[10]["makeCacheMapKit"] } });

  const namespaces = cells.map(cells => freeze(create(null, {
    ...cells,
    // Make this appear like an ESM module namespace object.
    [Symbol.toStringTag]: {
      value: 'Module',
      writable: false,
      enumerable: false,
      configurable: false,
    },
  })));

  for (let index = 0; index < namespaces.length; index += 1) {
    cells[index]['*'] = cell('*', namespaces[index]);
  }

function observeImports(map, importName, importIndex) {
  for (const [name, observers] of map.get(importName)) {
    const cell = cells[importIndex][name];
    if (cell === undefined) {
      throw new ReferenceError(`Cannot import name ${name} (has ${Object.getOwnPropertyNames(cells[importIndex]).join(', ')})`);
    }
    for (const observer of observers) {
      cell.observe(observer);
    }
  }
}

  functors[0]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      universalThis: cells[0].globalThis.set,
      Array: cells[0].Array.set,
      ArrayBuffer: cells[0].ArrayBuffer.set,
      Date: cells[0].Date.set,
      FinalizationRegistry: cells[0].FinalizationRegistry.set,
      FERAL_FLOAT64_ARRAY: cells[0].FERAL_FLOAT64_ARRAY.set,
      DataView: cells[0].DataView.set,
      JSON: cells[0].JSON.set,
      Map: cells[0].Map.set,
      Math: cells[0].Math.set,
      Number: cells[0].Number.set,
      BigInt: cells[0].BigInt.set,
      Object: cells[0].Object.set,
      Promise: cells[0].Promise.set,
      Proxy: cells[0].Proxy.set,
      Reflect: cells[0].Reflect.set,
      FERAL_REG_EXP: cells[0].FERAL_REG_EXP.set,
      Set: cells[0].Set.set,
      String: cells[0].String.set,
      Symbol: cells[0].Symbol.set,
      Uint8Array: cells[0].Uint8Array.set,
      WeakMap: cells[0].WeakMap.set,
      WeakSet: cells[0].WeakSet.set,
      Temporal: cells[0].Temporal.set,
      FERAL_ERROR: cells[0].FERAL_ERROR.set,
      RangeError: cells[0].RangeError.set,
      ReferenceError: cells[0].ReferenceError.set,
      SyntaxError: cells[0].SyntaxError.set,
      TypeError: cells[0].TypeError.set,
      AggregateError: cells[0].AggregateError.set,
      assign: cells[0].assign.set,
      create: cells[0].create.set,
      defineProperties: cells[0].defineProperties.set,
      entries: cells[0].entries.set,
      getOwnPropertyDescriptor: cells[0].getOwnPropertyDescriptor.set,
      getOwnPropertyDescriptors: cells[0].getOwnPropertyDescriptors.set,
      getOwnPropertyNames: cells[0].getOwnPropertyNames.set,
      getPrototypeOf: cells[0].getPrototypeOf.set,
      is: cells[0].is.set,
      isFrozen: cells[0].isFrozen.set,
      isSealed: cells[0].isSealed.set,
      isExtensible: cells[0].isExtensible.set,
      keys: cells[0].keys.set,
      objectPrototype: cells[0].objectPrototype.set,
      seal: cells[0].seal.set,
      preventExtensions: cells[0].preventExtensions.set,
      setPrototypeOf: cells[0].setPrototypeOf.set,
      values: cells[0].values.set,
      fromEntries: cells[0].fromEntries.set,
      freeze: cells[0].freeze.set,
      speciesSymbol: cells[0].speciesSymbol.set,
      toStringTagSymbol: cells[0].toStringTagSymbol.set,
      iteratorSymbol: cells[0].iteratorSymbol.set,
      matchAllSymbol: cells[0].matchAllSymbol.set,
      replaceSymbol: cells[0].replaceSymbol.set,
      searchSymbol: cells[0].searchSymbol.set,
      unscopablesSymbol: cells[0].unscopablesSymbol.set,
      symbolKeyFor: cells[0].symbolKeyFor.set,
      symbolFor: cells[0].symbolFor.set,
      max: cells[0].max.set,
      min: cells[0].min.set,
      trunc: cells[0].trunc.set,
      MAX_SAFE_INTEGER: cells[0].MAX_SAFE_INTEGER.set,
      isInteger: cells[0].isInteger.set,
      stringifyJson: cells[0].stringifyJson.set,
      defineProperty: cells[0].defineProperty.set,
      apply: cells[0].apply.set,
      construct: cells[0].construct.set,
      reflectGet: cells[0].reflectGet.set,
      reflectGetOwnPropertyDescriptor: cells[0].reflectGetOwnPropertyDescriptor.set,
      reflectHas: cells[0].reflectHas.set,
      reflectIsExtensible: cells[0].reflectIsExtensible.set,
      ownKeys: cells[0].ownKeys.set,
      reflectPreventExtensions: cells[0].reflectPreventExtensions.set,
      reflectSet: cells[0].reflectSet.set,
      isArray: cells[0].isArray.set,
      arrayPrototype: cells[0].arrayPrototype.set,
      arrayBufferPrototype: cells[0].arrayBufferPrototype.set,
      dataViewPrototype: cells[0].dataViewPrototype.set,
      mapPrototype: cells[0].mapPrototype.set,
      proxyRevocable: cells[0].proxyRevocable.set,
      regexpPrototype: cells[0].regexpPrototype.set,
      setPrototype: cells[0].setPrototype.set,
      stringPrototype: cells[0].stringPrototype.set,
      weakmapPrototype: cells[0].weakmapPrototype.set,
      weaksetPrototype: cells[0].weaksetPrototype.set,
      functionPrototype: cells[0].functionPrototype.set,
      promisePrototype: cells[0].promisePrototype.set,
      generatorPrototype: cells[0].generatorPrototype.set,
      iteratorPrototype: cells[0].iteratorPrototype.set,
      typedArrayPrototype: cells[0].typedArrayPrototype.set,
      uncurryThis: cells[0].uncurryThis.set,
      hasOwn: cells[0].hasOwn.set,
      arrayFilter: cells[0].arrayFilter.set,
      arrayForEach: cells[0].arrayForEach.set,
      arrayIncludes: cells[0].arrayIncludes.set,
      arrayJoin: cells[0].arrayJoin.set,
      arrayMap: cells[0].arrayMap.set,
      arrayFlatMap: cells[0].arrayFlatMap.set,
      arrayPop: cells[0].arrayPop.set,
      arrayPush: cells[0].arrayPush.set,
      arraySlice: cells[0].arraySlice.set,
      arraySome: cells[0].arraySome.set,
      arraySort: cells[0].arraySort.set,
      iterateArray: cells[0].iterateArray.set,
      arrayBufferSlice: cells[0].arrayBufferSlice.set,
      arrayBufferGetByteLength: cells[0].arrayBufferGetByteLength.set,
      typedArraySet: cells[0].typedArraySet.set,
      mapSet: cells[0].mapSet.set,
      mapGet: cells[0].mapGet.set,
      mapHas: cells[0].mapHas.set,
      mapDelete: cells[0].mapDelete.set,
      mapEntries: cells[0].mapEntries.set,
      iterateMap: cells[0].iterateMap.set,
      setAdd: cells[0].setAdd.set,
      setDelete: cells[0].setDelete.set,
      setForEach: cells[0].setForEach.set,
      setHas: cells[0].setHas.set,
      iterateSet: cells[0].iterateSet.set,
      regexpExec: cells[0].regexpExec.set,
      regexpReplace: cells[0].regexpReplace.set,
      regexpSearch: cells[0].regexpSearch.set,
      matchAllRegExp: cells[0].matchAllRegExp.set,
      sealRegexp: cells[0].sealRegexp.set,
      freezeRegexp: cells[0].freezeRegexp.set,
      stringEndsWith: cells[0].stringEndsWith.set,
      stringIncludes: cells[0].stringIncludes.set,
      stringIndexOf: cells[0].stringIndexOf.set,
      stringMatch: cells[0].stringMatch.set,
      stringSearch: cells[0].stringSearch.set,
      stringSlice: cells[0].stringSlice.set,
      stringSplit: cells[0].stringSplit.set,
      stringStartsWith: cells[0].stringStartsWith.set,
      iterateString: cells[0].iterateString.set,
      weakmapDelete: cells[0].weakmapDelete.set,
      weakmapGet: cells[0].weakmapGet.set,
      weakmapHas: cells[0].weakmapHas.set,
      weakmapSet: cells[0].weakmapSet.set,
      weaksetAdd: cells[0].weaksetAdd.set,
      weaksetHas: cells[0].weaksetHas.set,
      functionToString: cells[0].functionToString.set,
      functionBind: cells[0].functionBind.set,
      generatorNext: cells[0].generatorNext.set,
      generatorThrow: cells[0].generatorThrow.set,
      promiseAll: cells[0].promiseAll.set,
      promiseCatch: cells[0].promiseCatch.set,
      promiseThen: cells[0].promiseThen.set,
      finalizationRegistryRegister: cells[0].finalizationRegistryRegister.set,
      finalizationRegistryUnregister: cells[0].finalizationRegistryUnregister.set,
      isPrimitive: cells[0].isPrimitive.set,
      isError: cells[0].isError.set,
      identity: cells[0].identity.set,
      FERAL_EVAL: cells[0].FERAL_EVAL.set,
      FERAL_FUNCTION: cells[0].FERAL_FUNCTION.set,
      noEvalEvaluate: cells[0].noEvalEvaluate.set,
      FERAL_STACK_GETTER: cells[0].FERAL_STACK_GETTER.set,
      FERAL_STACK_SETTER: cells[0].FERAL_STACK_SETTER.set,
      AsyncGeneratorFunctionInstance: cells[0].AsyncGeneratorFunctionInstance.set,
    },
    importMeta: {},
  });
  functors[1]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[2]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      makeEnvironmentCaptor: cells[2].makeEnvironmentCaptor.set,
      getEnvironmentOption: cells[2].getEnvironmentOption.set,
      getEnvironmentOptionsList: cells[2].getEnvironmentOptionsList.set,
      environmentOptionsListHas: cells[2].environmentOptionsListHas.set,
    },
    importMeta: {},
  });
  functors[3]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./src/env-options.js", 2);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[4]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      isBufferImmutable: cells[4].isBufferImmutable.set,
      sliceBufferToImmutable: cells[4].sliceBufferToImmutable.set,
      optTransferBufferToImmutable: cells[4].optTransferBufferToImmutable.set,
    },
    importMeta: {},
  });
  functors[5]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./immutable-arraybuffer-pony.js", 4);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[6]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./src/immutable-arraybuffer-shim.js", 5);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[7]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "../commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      an: cells[7].an.set,
      bestEffortStringify: cells[7].bestEffortStringify.set,
      enJoin: cells[7].enJoin.set,
    },
    importMeta: {},
  });
  functors[8]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[9]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[10]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      makeCacheMapKit: cells[10].makeCacheMapKit.set,
    },
    importMeta: {},
  });
  functors[11]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./src/cachemap.js", 10);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[12]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "@endo/cache-map", 11);
    },
    liveVar: {
    },
    onceVar: {
      makeNoteLogArgsArrayKit: cells[12].makeNoteLogArgsArrayKit.set,
    },
    importMeta: {},
  });
  functors[13]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "../commons.js", 0);
      observeImports(map, "./stringify-utils.js", 7);
      observeImports(map, "./types.js", 8);
      observeImports(map, "./internal-types.js", 9);
      observeImports(map, "./note-log-args.js", 12);
    },
    liveVar: {
    },
    onceVar: {
      quote: cells[13].q.set,
      bare: cells[13].b.set,
      redactedDetails: cells[13].X.set,
      unredactedDetails: cells[13].unredactedDetails.set,
      makeError: cells[13].makeError.set,
      note: cells[13].annotateError.set,
      loggedErrorHandler: cells[13].loggedErrorHandler.set,
      assert: cells[13].assert.set,
      assertEqual: cells[13].assertEqual.set,
      sanitizeError: cells[13].sanitizeError.set,
      makeAssert: cells[13].makeAssert.set,
    },
    importMeta: {},
  });
  functors[14]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./error/assert.js", 13);
    },
    liveVar: {
    },
    onceVar: {
      isTypedArray: cells[14].isTypedArray.set,
      makeHardener: cells[14].makeHardener.set,
    },
    importMeta: {},
  });
  functors[15]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      cauterizeProperty: cells[15].cauterizeProperty.set,
    },
    importMeta: {},
  });
  functors[16]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      NativeErrors: cells[16].NativeErrors.set,
      constantProperties: cells[16].constantProperties.set,
      universalPropertyNames: cells[16].universalPropertyNames.set,
      initialGlobalPropertyNames: cells[16].initialGlobalPropertyNames.set,
      sharedGlobalPropertyNames: cells[16].sharedGlobalPropertyNames.set,
      uniqueGlobalPropertyNames: cells[16].uniqueGlobalPropertyNames.set,
      FunctionInstance: cells[16].FunctionInstance.set,
      AsyncFunctionInstance: cells[16].AsyncFunctionInstance.set,
      isAccessorPermit: cells[16].isAccessorPermit.set,
      permitted: cells[16].permitted.set,
    },
    importMeta: {},
  });
  functors[17]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./cauterize-property.js", 15);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./permits.js", 16);
    },
    liveVar: {
    },
    onceVar: {
      makeIntrinsicsCollector: cells[17].makeIntrinsicsCollector.set,
      getGlobalIntrinsics: cells[17].getGlobalIntrinsics.set,
    },
    importMeta: {},
  });
  functors[18]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./permits.js", 16);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./cauterize-property.js", 15);
    },
    liveVar: {
    },
    onceVar: {
      default: cells[18].default.set,
    },
    importMeta: {},
  });
  functors[19]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      default: cells[19].default.set,
    },
    importMeta: {},
  });
  functors[20]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      default: cells[20].default.set,
    },
    importMeta: {},
  });
  functors[21]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      default: cells[21].default.set,
    },
    importMeta: {},
  });
  functors[22]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./permits.js", 16);
    },
    liveVar: {
    },
    onceVar: {
      default: cells[22].default.set,
    },
    importMeta: {},
  });
  functors[23]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      tameNaNSideChannel: cells[23].tameNaNSideChannel.set,
    },
    importMeta: {},
  });
  functors[24]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      default: cells[24].default.set,
    },
    importMeta: {},
  });
  functors[25]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      minEnablements: cells[25].minEnablements.set,
      moderateEnablements: cells[25].moderateEnablements.set,
      severeEnablements: cells[25].severeEnablements.set,
    },
    importMeta: {},
  });
  functors[26]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./enablements.js", 25);
    },
    liveVar: {
    },
    onceVar: {
      default: cells[26].default.set,
    },
    importMeta: {},
  });
  functors[27]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./error/assert.js", 13);
    },
    liveVar: {
    },
    onceVar: {
      default: cells[27].default.set,
    },
    importMeta: {},
  });
  functors[28]({
    imports(entries) {
      const map = new Map(entries);
    },
    liveVar: {
    },
    onceVar: {
      makeEvalFunction: cells[28].makeEvalFunction.set,
    },
    importMeta: {},
  });
  functors[29]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./error/assert.js", 13);
    },
    liveVar: {
    },
    onceVar: {
      makeFunctionConstructor: cells[29].makeFunctionConstructor.set,
    },
    importMeta: {},
  });
  functors[30]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./make-eval-function.js", 28);
      observeImports(map, "./make-function-constructor.js", 29);
      observeImports(map, "./permits.js", 16);
    },
    liveVar: {
    },
    onceVar: {
      setGlobalObjectSymbolUnscopables: cells[30].setGlobalObjectSymbolUnscopables.set,
      setGlobalObjectConstantProperties: cells[30].setGlobalObjectConstantProperties.set,
      setGlobalObjectMutableProperties: cells[30].setGlobalObjectMutableProperties.set,
      setGlobalObjectEvaluators: cells[30].setGlobalObjectEvaluators.set,
    },
    importMeta: {},
  });
  functors[31]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./error/assert.js", 13);
    },
    liveVar: {
    },
    onceVar: {
      alwaysThrowHandler: cells[31].alwaysThrowHandler.set,
      strictScopeTerminatorHandler: cells[31].strictScopeTerminatorHandler.set,
      strictScopeTerminator: cells[31].strictScopeTerminator.set,
    },
    importMeta: {},
  });
  functors[32]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./strict-scope-terminator.js", 31);
    },
    liveVar: {
    },
    onceVar: {
      createSloppyGlobalsScopeTerminator: cells[32].createSloppyGlobalsScopeTerminator.set,
    },
    importMeta: {},
  });
  functors[33]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./error/assert.js", 13);
    },
    liveVar: {
    },
    onceVar: {
      makeEvalScopeKit: cells[33].makeEvalScopeKit.set,
    },
    importMeta: {},
  });
  functors[34]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      getSourceURL: cells[34].getSourceURL.set,
    },
    importMeta: {},
  });
  functors[35]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./get-source-url.js", 34);
    },
    liveVar: {
    },
    onceVar: {
      rejectHtmlComments: cells[35].rejectHtmlComments.set,
      evadeHtmlCommentTest: cells[35].evadeHtmlCommentTest.set,
      rejectImportExpressions: cells[35].rejectImportExpressions.set,
      evadeImportExpressionTest: cells[35].evadeImportExpressionTest.set,
      rejectSomeDirectEvalExpressions: cells[35].rejectSomeDirectEvalExpressions.set,
      mandatoryTransforms: cells[35].mandatoryTransforms.set,
      applyTransforms: cells[35].applyTransforms.set,
      transforms: cells[35].transforms.set,
    },
    importMeta: {},
  });
  functors[36]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      isValidIdentifierName: cells[36].isValidIdentifierName.set,
      getScopeConstants: cells[36].getScopeConstants.set,
    },
    importMeta: {},
  });
  functors[37]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./scope-constants.js", 36);
    },
    liveVar: {
    },
    onceVar: {
      makeEvaluate: cells[37].makeEvaluate.set,
    },
    importMeta: {},
  });
  functors[38]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./strict-scope-terminator.js", 31);
      observeImports(map, "./sloppy-globals-scope-terminator.js", 32);
      observeImports(map, "./eval-scope.js", 33);
      observeImports(map, "./transforms.js", 35);
      observeImports(map, "./make-evaluate.js", 37);
      observeImports(map, "./error/assert.js", 13);
    },
    liveVar: {
    },
    onceVar: {
      makeSafeEvaluator: cells[38].makeSafeEvaluator.set,
    },
    importMeta: {},
  });
  functors[39]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      tameFunctionToString: cells[39].tameFunctionToString.set,
    },
    importMeta: {},
  });
  functors[40]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      tameDomains: cells[40].tameDomains.set,
    },
    importMeta: {},
  });
  functors[41]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      tameModuleSource: cells[41].tameModuleSource.set,
    },
    importMeta: {},
  });
  functors[42]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "../commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      consoleLevelMethods: cells[42].consoleLevelMethods.set,
      consoleOtherMethods: cells[42].consoleOtherMethods.set,
      makeLoggingConsoleKit: cells[42].makeLoggingConsoleKit.set,
      pumpLogToConsole: cells[42].pumpLogToConsole.set,
      makeCausalConsole: cells[42].makeCausalConsole.set,
      defineCausalConsoleFromLogger: cells[42].defineCausalConsoleFromLogger.set,
      filterConsole: cells[42].filterConsole.set,
    },
    importMeta: {},
  });
  functors[43]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "../commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      makeRejectionHandlers: cells[43].makeRejectionHandlers.set,
    },
    importMeta: {},
  });
  functors[44]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "../commons.js", 0);
      observeImports(map, "./assert.js", 13);
      observeImports(map, "./console.js", 42);
      observeImports(map, "./unhandled-rejection.js", 43);
    },
    liveVar: {
    },
    onceVar: {
      tameConsole: cells[44].tameConsole.set,
    },
    importMeta: {},
  });
  functors[45]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "../commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      filterFileName: cells[45].filterFileName.set,
      shortenCallSiteString: cells[45].shortenCallSiteString.set,
      tameV8ErrorConstructor: cells[45].tameV8ErrorConstructor.set,
    },
    importMeta: {},
  });
  functors[46]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "../commons.js", 0);
      observeImports(map, "../permits.js", 16);
      observeImports(map, "./tame-v8-error-constructor.js", 45);
    },
    liveVar: {
    },
    onceVar: {
      default: cells[46].default.set,
    },
    importMeta: {},
  });
  functors[47]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "@endo/env-options", 3);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./error/assert.js", 13);
    },
    liveVar: {
    },
    onceVar: {
      makeAlias: cells[47].makeAlias.set,
      load: cells[47].load.set,
      loadNow: cells[47].loadNow.set,
    },
    importMeta: {},
  });
  functors[48]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./module-load.js", 47);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./error/assert.js", 13);
    },
    liveVar: {
    },
    onceVar: {
      deferExports: cells[48].deferExports.set,
      getDeferredExports: cells[48].getDeferredExports.set,
    },
    importMeta: {},
  });
  functors[49]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./transforms.js", 35);
      observeImports(map, "./make-safe-evaluator.js", 38);
    },
    liveVar: {
    },
    onceVar: {
      provideCompartmentEvaluator: cells[49].provideCompartmentEvaluator.set,
      compartmentEvaluate: cells[49].compartmentEvaluate.set,
    },
    importMeta: {},
  });
  functors[50]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./error/assert.js", 13);
      observeImports(map, "./module-proxy.js", 48);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./compartment-evaluate.js", 49);
    },
    liveVar: {
    },
    onceVar: {
      makeVirtualModuleInstance: cells[50].makeVirtualModuleInstance.set,
      makeModuleInstance: cells[50].makeModuleInstance.set,
    },
    importMeta: {},
  });
  functors[51]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./error/assert.js", 13);
      observeImports(map, "./module-instance.js", 50);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      link: cells[51].link.set,
      instantiate: cells[51].instantiate.set,
    },
    importMeta: {},
  });
  functors[52]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./global-object.js", 30);
      observeImports(map, "./error/assert.js", 13);
      observeImports(map, "./permits.js", 16);
      observeImports(map, "./module-load.js", 47);
      observeImports(map, "./module-link.js", 51);
      observeImports(map, "./module-proxy.js", 48);
      observeImports(map, "./compartment-evaluate.js", 49);
      observeImports(map, "./make-safe-evaluator.js", 38);
    },
    liveVar: {
    },
    onceVar: {
      InertCompartment: cells[52].InertCompartment.set,
      CompartmentPrototype: cells[52].CompartmentPrototype.set,
      compartmentOptions: cells[52].compartmentOptions.set,
      makeCompartmentConstructor: cells[52].makeCompartmentConstructor.set,
    },
    importMeta: {},
  });
  functors[53]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./compartment.js", 52);
    },
    liveVar: {
    },
    onceVar: {
      getAnonymousIntrinsics: cells[53].getAnonymousIntrinsics.set,
    },
    importMeta: {},
  });
  functors[54]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      tameHarden: cells[54].tameHarden.set,
    },
    importMeta: {},
  });
  functors[55]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      tameSymbolConstructor: cells[55].tameSymbolConstructor.set,
    },
    importMeta: {},
  });
  functors[56]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      tameFauxDataProperty: cells[56].tameFauxDataProperty.set,
      tameFauxDataProperties: cells[56].tameFauxDataProperties.set,
    },
    importMeta: {},
  });
  functors[57]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      tameRegeneratorRuntime: cells[57].tameRegeneratorRuntime.set,
    },
    importMeta: {},
  });
  functors[58]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
    },
    liveVar: {
    },
    onceVar: {
      shimArrayBufferTransfer: cells[58].shimArrayBufferTransfer.set,
    },
    importMeta: {},
  });
  functors[59]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./error/assert.js", 13);
    },
    liveVar: {
    },
    onceVar: {
      chooseReporter: cells[59].chooseReporter.set,
      reportInGroup: cells[59].reportInGroup.set,
    },
    importMeta: {},
  });
  functors[60]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "@endo/env-options", 3);
      observeImports(map, "@endo/immutable-arraybuffer/shim.js", 6);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./make-hardener.js", 14);
      observeImports(map, "./intrinsics.js", 17);
      observeImports(map, "./permits-intrinsics.js", 18);
      observeImports(map, "./tame-function-constructors.js", 19);
      observeImports(map, "./tame-date-constructor.js", 20);
      observeImports(map, "./tame-math-object.js", 21);
      observeImports(map, "./tame-temporal-object.js", 22);
      observeImports(map, "./tame-nan-sidechannel.js", 23);
      observeImports(map, "./tame-regexp-constructor.js", 24);
      observeImports(map, "./enable-property-overrides.js", 26);
      observeImports(map, "./tame-locale-methods.js", 27);
      observeImports(map, "./global-object.js", 30);
      observeImports(map, "./make-safe-evaluator.js", 38);
      observeImports(map, "./permits.js", 16);
      observeImports(map, "./tame-function-tostring.js", 39);
      observeImports(map, "./tame-domains.js", 40);
      observeImports(map, "./tame-module-source.js", 41);
      observeImports(map, "./error/tame-console.js", 44);
      observeImports(map, "./error/tame-error-constructor.js", 46);
      observeImports(map, "./error/assert.js", 13);
      observeImports(map, "./get-anonymous-intrinsics.js", 53);
      observeImports(map, "./compartment.js", 52);
      observeImports(map, "./tame-harden.js", 54);
      observeImports(map, "./tame-symbol-constructor.js", 55);
      observeImports(map, "./tame-faux-data-properties.js", 56);
      observeImports(map, "./tame-regenerator-runtime.js", 57);
      observeImports(map, "./shim-arraybuffer-transfer.js", 58);
      observeImports(map, "./reporting.js", 59);
    },
    liveVar: {
    },
    onceVar: {
      repairIntrinsics: cells[60].repairIntrinsics.set,
    },
    importMeta: {},
  });
  functors[61]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./assert-sloppy-mode.js", 1);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./lockdown.js", 60);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[62]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./compartment.js", 52);
      observeImports(map, "./tame-function-tostring.js", 39);
      observeImports(map, "./intrinsics.js", 17);
      observeImports(map, "./reporting.js", 59);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[63]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./error/assert.js", 13);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[64]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./commons.js", 0);
      observeImports(map, "./error/console.js", 42);
      observeImports(map, "./error/assert.js", 13);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });
  functors[65]({
    imports(entries) {
      const map = new Map(entries);
      observeImports(map, "./src/lockdown-shim.js", 61);
      observeImports(map, "./src/compartment-shim.js", 62);
      observeImports(map, "./src/assert-shim.js", 63);
      observeImports(map, "./src/console-shim.js", 64);
    },
    liveVar: {
    },
    onceVar: {
    },
    importMeta: {},
  });

  return cells[cells.length - 1]['*'].get();
})([
// === 0. ses ./src/commons.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';$h͏_imports([]);/**
 * Captures native intrinsics during initialization, so vetted shims
 * (running between initialization of SES and calling lockdown) are free to
 * modify the environment without compromising the integrity of SES. For
 * example, a vetted shim can modify Object.assign because we capture and
 * export Object and assign here, then never again consult Object to get its
 * assign property.
 *
 * This pattern of use is enforced by eslint rules no-restricted-globals and
 * no-polymorphic-call.
 * We maintain the list of restricted globals in ../package.json.
 *
 * @module
 */

/* global globalThis */
/* eslint-disable no-restricted-globals */

// We cannot use globalThis as the local name since it would capture the
// lexical name.
const universalThis = globalThis;$h͏_once.universalThis(universalThis);


       const {
  Array,
  ArrayBuffer,
  Date,
  FinalizationRegistry,
  // Renamed to FERAL_* because it enables the NaN side-channel
  Float64Array: FERAL_FLOAT64_ARRAY,
  DataView,
  JSON,
  Map,
  Math,
  Number,
  BigInt,
  Object,
  Promise,
  Proxy,
  Reflect,
  RegExp: FERAL_REG_EXP,
  Set,
  String,
  Symbol,
  Uint8Array,
  WeakMap,
  WeakSet,
  Temporal  // may be undefined on old JS engines
} = globalThis;$h͏_once.Array(Array);$h͏_once.ArrayBuffer(ArrayBuffer);$h͏_once.Date(Date);$h͏_once.FinalizationRegistry(FinalizationRegistry);$h͏_once.FERAL_FLOAT64_ARRAY(FERAL_FLOAT64_ARRAY);$h͏_once.DataView(DataView);$h͏_once.JSON(JSON);$h͏_once.Map(Map);$h͏_once.Math(Math);$h͏_once.Number(Number);$h͏_once.BigInt(BigInt);$h͏_once.Object(Object);$h͏_once.Promise(Promise);$h͏_once.Proxy(Proxy);$h͏_once.Reflect(Reflect);$h͏_once.FERAL_REG_EXP(FERAL_REG_EXP);$h͏_once.Set(Set);$h͏_once.String(String);$h͏_once.Symbol(Symbol);$h͏_once.Uint8Array(Uint8Array);$h͏_once.WeakMap(WeakMap);$h͏_once.WeakSet(WeakSet);$h͏_once.Temporal(Temporal);

       const {
  // The feral Error constructor is safe for internal use, but must not be
  // revealed to post-lockdown code in any compartment including the start
  // compartment since in V8 at least it bears stack inspection capabilities.
  Error: FERAL_ERROR,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  AggregateError,
} = globalThis;$h͏_once.FERAL_ERROR(FERAL_ERROR);$h͏_once.RangeError(RangeError);$h͏_once.ReferenceError(ReferenceError);$h͏_once.SyntaxError(SyntaxError);$h͏_once.TypeError(TypeError);$h͏_once.AggregateError(AggregateError);

       const {
  assign,
  create,
  defineProperties,
  entries,
  getOwnPropertyDescriptor,
  getOwnPropertyDescriptors,
  getOwnPropertyNames,
  getPrototypeOf,
  is,
  isFrozen,
  isSealed,
  isExtensible,
  keys,
  prototype: objectPrototype,
  seal,
  preventExtensions,
  setPrototypeOf,
  values,
  fromEntries,
} = Object;

/**
 * For use with any value except a regular expression (@see {@link sealRegexp}
 * and {@link freezeRegexp}).
 *
 * @type { &
 *   ((obj: RegExp) => void) &
 *   typeof Object.freeze
 * }
 */$h͏_once.assign(assign);$h͏_once.create(create);$h͏_once.defineProperties(defineProperties);$h͏_once.entries(entries);$h͏_once.getOwnPropertyDescriptor(getOwnPropertyDescriptor);$h͏_once.getOwnPropertyDescriptors(getOwnPropertyDescriptors);$h͏_once.getOwnPropertyNames(getOwnPropertyNames);$h͏_once.getPrototypeOf(getPrototypeOf);$h͏_once.is(is);$h͏_once.isFrozen(isFrozen);$h͏_once.isSealed(isSealed);$h͏_once.isExtensible(isExtensible);$h͏_once.keys(keys);$h͏_once.objectPrototype(objectPrototype);$h͏_once.seal(seal);$h͏_once.preventExtensions(preventExtensions);$h͏_once.setPrototypeOf(setPrototypeOf);$h͏_once.values(values);$h͏_once.fromEntries(fromEntries);
       const freeze = /** @type {any} */ (Object.freeze);$h͏_once.freeze(freeze);

       const {
  species: speciesSymbol,
  toStringTag: toStringTagSymbol,
  iterator: iteratorSymbol,
  matchAll: matchAllSymbol,
  replace: replaceSymbol,
  search: searchSymbol,
  unscopables: unscopablesSymbol,
  keyFor: symbolKeyFor,
  for: symbolFor,
} = Symbol;$h͏_once.speciesSymbol(speciesSymbol);$h͏_once.toStringTagSymbol(toStringTagSymbol);$h͏_once.iteratorSymbol(iteratorSymbol);$h͏_once.matchAllSymbol(matchAllSymbol);$h͏_once.replaceSymbol(replaceSymbol);$h͏_once.searchSymbol(searchSymbol);$h͏_once.unscopablesSymbol(unscopablesSymbol);$h͏_once.symbolKeyFor(symbolKeyFor);$h͏_once.symbolFor(symbolFor);

       const { max, min, trunc } = Math;$h͏_once.max(max);$h͏_once.min(min);$h͏_once.trunc(trunc);

       const { MAX_SAFE_INTEGER, isInteger } = Number;$h͏_once.MAX_SAFE_INTEGER(MAX_SAFE_INTEGER);$h͏_once.isInteger(isInteger);

       const { stringify: stringifyJson } = JSON;

// Needed only for the Safari bug workaround below
$h͏_once.stringifyJson(stringifyJson);const{defineProperty:originalDefineProperty}=Object;

       const defineProperty = (object, prop, descriptor) => {
  // We used to do the following, until we had to reopen Safari bug
  // https://bugs.webkit.org/show_bug.cgi?id=222538#c17
  // Once this is fixed, we may restore it.
  // // Object.defineProperty is allowed to fail silently so we use
  // // Object.defineProperties instead.
  // return defineProperties(object, { [prop]: descriptor });

  // Instead, to workaround the Safari bug
  const result = originalDefineProperty(object, prop, descriptor);
  if (result !== object) {
    // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_DEFINE_PROPERTY_FAILED_SILENTLY.md
    throw TypeError(
      `Please report that the original defineProperty silently failed to set ${stringifyJson(
        String(prop),
      )}. (SES_DEFINE_PROPERTY_FAILED_SILENTLY)`,
    );
  }
  return result;
};$h͏_once.defineProperty(defineProperty);

       const {
  apply,
  construct,
  get: reflectGet,
  getOwnPropertyDescriptor: reflectGetOwnPropertyDescriptor,
  has: reflectHas,
  isExtensible: reflectIsExtensible,
  ownKeys,
  preventExtensions: reflectPreventExtensions,
  set: reflectSet,
} = Reflect;$h͏_once.apply(apply);$h͏_once.construct(construct);$h͏_once.reflectGet(reflectGet);$h͏_once.reflectGetOwnPropertyDescriptor(reflectGetOwnPropertyDescriptor);$h͏_once.reflectHas(reflectHas);$h͏_once.reflectIsExtensible(reflectIsExtensible);$h͏_once.ownKeys(ownKeys);$h͏_once.reflectPreventExtensions(reflectPreventExtensions);$h͏_once.reflectSet(reflectSet);

       const { isArray, prototype: arrayPrototype } = Array;$h͏_once.isArray(isArray);$h͏_once.arrayPrototype(arrayPrototype);
       const { prototype: arrayBufferPrototype } = ArrayBuffer;$h͏_once.arrayBufferPrototype(arrayBufferPrototype);
       const { prototype: dataViewPrototype } = DataView;$h͏_once.dataViewPrototype(dataViewPrototype);
       const { prototype: mapPrototype } = Map;$h͏_once.mapPrototype(mapPrototype);
       const { revocable: proxyRevocable } = Proxy;$h͏_once.proxyRevocable(proxyRevocable);
       const { prototype: regexpPrototype } = RegExp;$h͏_once.regexpPrototype(regexpPrototype);
       const { prototype: setPrototype } = Set;$h͏_once.setPrototype(setPrototype);
       const { prototype: stringPrototype } = String;$h͏_once.stringPrototype(stringPrototype);
       const { prototype: weakmapPrototype } = WeakMap;$h͏_once.weakmapPrototype(weakmapPrototype);
       const { prototype: weaksetPrototype } = WeakSet;$h͏_once.weaksetPrototype(weaksetPrototype);
       const { prototype: functionPrototype } = Function;$h͏_once.functionPrototype(functionPrototype);
       const { prototype: promisePrototype } = Promise;$h͏_once.promisePrototype(promisePrototype);
       const { prototype: generatorPrototype } = getPrototypeOf(
  // eslint-disable-next-line no-empty-function, func-names
  function* () {},
);$h͏_once.generatorPrototype(generatorPrototype);
       const iteratorPrototype = getPrototypeOf(
  // eslint-disable-next-line @endo/no-polymorphic-call
  getPrototypeOf(arrayPrototype.values()),
);$h͏_once.iteratorPrototype(iteratorPrototype);

       const typedArrayPrototype = getPrototypeOf(Uint8Array.prototype);$h͏_once.typedArrayPrototype(typedArrayPrototype);

const { bind } = functionPrototype;

/**
 * uncurryThis()
 * Equivalent of: fn => (thisArg, ...args) => apply(fn, thisArg, args)
 *
 * See those reference for a complete explanation:
 * http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
 * which only lives at
 * http://web.archive.org/web/20160805225710/http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
 *
 * @type {<F extends (this: any, ...args: any[]) => any>(fn: F) => ((thisArg: ThisParameterType<F>, ...args: Parameters<F>) => ReturnType<F>)}
 */
       const uncurryThis = bind.bind(bind.call); // eslint-disable-line @endo/no-polymorphic-call

// See https://github.com/endojs/endo/issues/2930
$h͏_once.uncurryThis(uncurryThis);if(!('hasOwn'in Object)){
  const ObjectPrototypeHasOwnProperty = objectPrototype.hasOwnProperty;
  const hasOwnShim = (obj, key) => {
    if (obj === undefined || obj === null) {
      // We need to add this extra test because of differences in
      // the order in which `hasOwn` vs `hasOwnProperty` validates
      // arguments.
      throw TypeError('Cannot convert undefined or null to object');
    }
    return apply(ObjectPrototypeHasOwnProperty, obj, [key]);
  };
  defineProperty(Object, 'hasOwn', {
    value: hasOwnShim,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

       const { hasOwn } = Object;
//
$h͏_once.hasOwn(hasOwn);const arrayFilter=uncurryThis(arrayPrototype.filter);$h͏_once.arrayFilter(arrayFilter);
       const arrayForEach = uncurryThis(arrayPrototype.forEach);$h͏_once.arrayForEach(arrayForEach);
       const arrayIncludes = uncurryThis(arrayPrototype.includes);$h͏_once.arrayIncludes(arrayIncludes);
       const arrayJoin = uncurryThis(arrayPrototype.join);
/** @type {<T, U>(thisArg: readonly T[], callbackfn: (value: T, index: number, array: T[]) => U, cbThisArg?: any) => U[]} */$h͏_once.arrayJoin(arrayJoin);
       const arrayMap = /** @type {any} */ (uncurryThis(arrayPrototype.map));$h͏_once.arrayMap(arrayMap);
       const arrayFlatMap = /** @type {any} */ (
  uncurryThis(arrayPrototype.flatMap)
);$h͏_once.arrayFlatMap(arrayFlatMap);
       const arrayPop = uncurryThis(arrayPrototype.pop);
/** @type {<T>(thisArg: T[], ...items: T[]) => number} */$h͏_once.arrayPop(arrayPop);
       const arrayPush = uncurryThis(arrayPrototype.push);$h͏_once.arrayPush(arrayPush);
       const arraySlice = uncurryThis(arrayPrototype.slice);$h͏_once.arraySlice(arraySlice);
       const arraySome = uncurryThis(arrayPrototype.some);$h͏_once.arraySome(arraySome);
       const arraySort = uncurryThis(arrayPrototype.sort);$h͏_once.arraySort(arraySort);
       const iterateArray = uncurryThis(arrayPrototype[iteratorSymbol]);
//
$h͏_once.iterateArray(iterateArray);const arrayBufferSlice=uncurryThis(arrayBufferPrototype.slice);
/** @type {(b: ArrayBuffer) => number} */$h͏_once.arrayBufferSlice(arrayBufferSlice);
       const arrayBufferGetByteLength = uncurryThis(
  // @ts-expect-error we know it is there on all conforming platforms
  getOwnPropertyDescriptor(arrayBufferPrototype, 'byteLength').get,
);
//
$h͏_once.arrayBufferGetByteLength(arrayBufferGetByteLength);const typedArraySet=uncurryThis(typedArrayPrototype.set);
//
$h͏_once.typedArraySet(typedArraySet);const mapSet=uncurryThis(mapPrototype.set);$h͏_once.mapSet(mapSet);
       const mapGet = uncurryThis(mapPrototype.get);$h͏_once.mapGet(mapGet);
       const mapHas = uncurryThis(mapPrototype.has);$h͏_once.mapHas(mapHas);
       const mapDelete = uncurryThis(mapPrototype.delete);$h͏_once.mapDelete(mapDelete);
       const mapEntries = uncurryThis(mapPrototype.entries);$h͏_once.mapEntries(mapEntries);
       const iterateMap = uncurryThis(mapPrototype[iteratorSymbol]);
//
$h͏_once.iterateMap(iterateMap);const setAdd=uncurryThis(setPrototype.add);$h͏_once.setAdd(setAdd);
       const setDelete = uncurryThis(setPrototype.delete);$h͏_once.setDelete(setDelete);
       const setForEach = uncurryThis(setPrototype.forEach);$h͏_once.setForEach(setForEach);
       const setHas = uncurryThis(setPrototype.has);$h͏_once.setHas(setHas);
       const iterateSet = uncurryThis(setPrototype[iteratorSymbol]);
//
/**
 * `regexpExec` is provided in exclusion of `regexpTest`, which would be
 * vulnerable to RegExp.prototype poisoning.
 */$h͏_once.iterateSet(iterateSet);
       const regexpExec = uncurryThis(regexpPrototype.exec);

/**
 * @type { &
 *   ((thisArg: RegExp, string: string, replaceValue: string) => string) &
 *   ((thisArg: RegExp, string: string, replacer: (substring: string, ...args: any[]) => string) => string)
 * }
 */$h͏_once.regexpExec(regexpExec);
       const regexpReplace = /** @type {any} */ (
  uncurryThis(regexpPrototype[replaceSymbol])
);

/**
 * `regexpSearch` can be used with a frozen non-global non-sticky RegExp.
 *
 * @type {(thisArg: RegExp, string: string) => number}
 */$h͏_once.regexpReplace(regexpReplace);
       const regexpSearch = uncurryThis(regexpPrototype[searchSymbol]);

/**
 * `matchAll` internally creates a new RegExp vulnerable to prototype poisoning,
 * but this function is still needed to reach %RegExpStringIteratorPrototype%.
 * @private
 */$h͏_once.regexpSearch(regexpSearch);
       const matchAllRegExp = uncurryThis(regexpPrototype[matchAllSymbol]);$h͏_once.matchAllRegExp(matchAllRegExp);

const regexpDescriptors = getOwnPropertyDescriptors(regexpPrototype);
arrayForEach(ownKeys(regexpDescriptors), key => {
  const desc = regexpDescriptors[/** @type {any} */ (key)];
  desc.configurable = false;
  if (desc.writable) desc.writable = false;
});
// Don't follow Symbol.species
// https://tc39.es/ecma262/multipage/abstract-operations.html#sec-speciesconstructor
defineProperty(regexpDescriptors, 'constructor', {
  value: undefined,
  enumerable: false,
  configurable: false,
  writable: false,
});

/**
 * Protect a RegExp instance against RegExp.prototype poisoning ("exec",
 * "flags", Symbol.replace, etc.) while still maintaining mutability of its
 * "lastIndex" property (which is necessary with flags "g" and/or "y" for some
 * operations, most notably {@link regexpReplace}).
 *
 * @type {<T extends RegExp>(regexp: T) => T}
 */
       const sealRegexp = regexp =>
  seal(defineProperties(regexp, regexpDescriptors));

/**
 * Protect a RegExp instance against RegExp.prototype poisoning ("exec",
 * "flags", Symbol.replace, etc.) and freeze its "lastIndex" property, rendering
 * it fully inert but (absent flags "g" and/or "y") still usable by
 * {@link regexpExec} and {@link regexpSearch}.
 *
 * @type {<T extends RegExp>(regexp: T) => T}
 */$h͏_once.sealRegexp(sealRegexp);
       const freezeRegexp = regexp =>
  freeze(/** @type {any} */ (defineProperties(regexp, regexpDescriptors)));
//
$h͏_once.freezeRegexp(freezeRegexp);const stringEndsWith=uncurryThis(stringPrototype.endsWith);$h͏_once.stringEndsWith(stringEndsWith);
       const stringIncludes = uncurryThis(stringPrototype.includes);$h͏_once.stringIncludes(stringIncludes);
       const stringIndexOf = uncurryThis(stringPrototype.indexOf);$h͏_once.stringIndexOf(stringIndexOf);
       const stringMatch = uncurryThis(stringPrototype.match);
// `stringReplace` is intentionally omitted because it would be vulnerable to
// RegExp.prototype poisoning; use `regexpReplace(re, str, replacer)` instead
// (and `sealRegexp` on its regular expressions).
$h͏_once.stringMatch(stringMatch);const stringSearch=uncurryThis(stringPrototype.search);$h͏_once.stringSearch(stringSearch);
       const stringSlice = uncurryThis(stringPrototype.slice);
/**
 * `stringSplit` should only be used with a string separator; regular
 * expressions are vulnerable to RegExp.prototype poisoning.
 * @type {(thisArg: string, separator: string, limit?: number) => string[]}
 */$h͏_once.stringSlice(stringSlice);
       const stringSplit = /** @type {any} */ (
  uncurryThis(stringPrototype.split)
);$h͏_once.stringSplit(stringSplit);
       const stringStartsWith = uncurryThis(stringPrototype.startsWith);$h͏_once.stringStartsWith(stringStartsWith);
       const iterateString = uncurryThis(stringPrototype[iteratorSymbol]);
//
$h͏_once.iterateString(iterateString);const weakmapDelete=uncurryThis(weakmapPrototype.delete);
/** @type {<K extends {}, V>(thisArg: WeakMap<K, V>, ...args: Parameters<WeakMap<K,V>['get']>) => ReturnType<WeakMap<K,V>['get']>} */$h͏_once.weakmapDelete(weakmapDelete);
       const weakmapGet = uncurryThis(weakmapPrototype.get);$h͏_once.weakmapGet(weakmapGet);
       const weakmapHas = uncurryThis(weakmapPrototype.has);$h͏_once.weakmapHas(weakmapHas);
       const weakmapSet = uncurryThis(weakmapPrototype.set);
//
$h͏_once.weakmapSet(weakmapSet);const weaksetAdd=uncurryThis(weaksetPrototype.add);$h͏_once.weaksetAdd(weaksetAdd);
       const weaksetHas = uncurryThis(weaksetPrototype.has);
//
$h͏_once.weaksetHas(weaksetHas);const functionToString=uncurryThis(functionPrototype.toString);$h͏_once.functionToString(functionToString);
       const functionBind = uncurryThis(bind);
//
$h͏_once.functionBind(functionBind);const generatorNext=uncurryThis(generatorPrototype.next);$h͏_once.generatorNext(generatorNext);
       const generatorThrow = uncurryThis(generatorPrototype.throw);
//
$h͏_once.generatorThrow(generatorThrow);const{all}=Promise;
       const promiseAll = promises => apply(all, Promise, [promises]);$h͏_once.promiseAll(promiseAll);
       const promiseCatch = uncurryThis(promisePrototype.catch);
/** @type {<T, TResult1 = T, TResult2 = never>(thisArg: T, onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null) => Promise<TResult1 | TResult2>} */$h͏_once.promiseCatch(promiseCatch);
       const promiseThen = /** @type {any} */ (
  uncurryThis(promisePrototype.then)
);
//
$h͏_once.promiseThen(promiseThen);const finalizationRegistryRegister=
  FinalizationRegistry && uncurryThis(FinalizationRegistry.prototype.register);$h͏_once.finalizationRegistryRegister(finalizationRegistryRegister);
       const finalizationRegistryUnregister =
  FinalizationRegistry &&
  uncurryThis(FinalizationRegistry.prototype.unregister);

/**
 * TODO Consolidate with `isPrimitive` that's currently in `@endo/pass-style`.
 * Layering constraints make this tricky, which is why we haven't yet figured
 * out how to do this.
 *
 * @type {(val: unknown) => val is (undefined
 * | null
 * | boolean
 * | number
 * | bigint
 * | string
 * | symbol)}
 */$h͏_once.finalizationRegistryUnregister(finalizationRegistryUnregister);
       const isPrimitive = val =>
  !val || (typeof val !== 'object' && typeof val !== 'function');

/**
 * isError tests whether an object inherits from the intrinsic
 * `Error.prototype`.
 * We capture the original error constructor as FERAL_ERROR to provide a clear
 * signal for reviewers that we are handling an object with excess authority,
 * like stack trace inspection, that we are carefully hiding from client code.
 * Checking instanceof happens to be safe, but to avoid uttering FERAL_ERROR
 * for such a trivial case outside commons.js, we provide a utility function.
 *
 * @param {any} value
 */$h͏_once.isPrimitive(isPrimitive);
       const isError = value => value instanceof FERAL_ERROR;

/**
 * @template T
 * @param {T} x
 */$h͏_once.isError(isError);
       const identity = x => x;

// The original unsafe untamed eval function, which must not escape.
// Sample at module initialization time, which is before lockdown can
// repair it.  Use it only to build powerless abstractions.
// eslint-disable-next-line no-eval
$h͏_once.identity(identity);const FERAL_EVAL=eval;

// The original unsafe untamed Function constructor, which must not escape.
// Sample at module initialization time, which is before lockdown can
// repair it.  Use it only to build powerless abstractions.
$h͏_once.FERAL_EVAL(FERAL_EVAL);const FERAL_FUNCTION=Function;$h͏_once.FERAL_FUNCTION(FERAL_FUNCTION);

       const noEvalEvaluate = () => {
  // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_NO_EVAL.md
  throw TypeError('Cannot eval with evalTaming set to "no-eval" (SES_NO_EVAL)');
};

// ////////////////// FERAL_STACK_GETTER FERAL_STACK_SETTER ////////////////////

// The error repair mechanism is very similar to code in
// pass-style/src/error.js and these implementations should be kept in sync.

/**
 * We gratuitiously construct a TypeError instance using syntax in order to
 * obviate the possibility that code that ran before SES (for which we are
 * irreducable vulnerable) may have replaced the global TypeError constructor.
 * We treat the nature of this error instance as the source of truth for the
 * nature of runtime constructed errors on the platform, particularly whether
 * such errors will have an own "stack" property with getters and setters.
 * At time of writing (2025) we know of no comparable mechanism for obtaining a
 * host-generated base Error instance, but we corroborate the nature of the
 * global Error constructor's instances and refuse to initialize SES in an
 * environment where the syntactic TypeError and global Error produce
 * inconsistent "stack" properties.
 * @returns {TypeError}
 */$h͏_once.noEvalEvaluate(noEvalEvaluate);
const makeTypeError = () => {
  try {
    // @ts-expect-error deliberate TypeError
    null.null;
    throw TypeError('obligatory'); // To convince the type flow inferrence.
  } catch (error) {
    return /** @type {TypeError} */ (error);
  }
};

const errorStackDesc = getOwnPropertyDescriptor(Error('obligatory'), 'stack');
const typeErrorStackDesc = getOwnPropertyDescriptor(makeTypeError(), 'stack');

let feralStackGetter;
let feralStackSetter;
if (typeErrorStackDesc && typeErrorStackDesc.get) {
  // We should only encounter this case on v8 because of its problematic
  // error own stack accessor behavior.
  // Note that FF/SpiderMonkey, Moddable/XS, and the error stack proposal
  // all inherit a stack accessor property from Error.prototype, which is
  // great. That case needs no heroics to secure.
  if (
    // In the v8 case as we understand it, all errors have an own stack
    // accessor property, but within the same realm, all these accessor
    // properties have the same getter and have the same setter.
    // This is therefore the case that we repair.
    errorStackDesc &&
    typeof typeErrorStackDesc.get === 'function' &&
    typeErrorStackDesc.get === errorStackDesc.get &&
    typeof typeErrorStackDesc.set === 'function' &&
    typeErrorStackDesc.set === errorStackDesc.set
  ) {
    // Otherwise, we have own stack accessor properties that are outside
    // our expectations, that therefore need to be understood better
    // before we know how to repair them.
    feralStackGetter = freeze(typeErrorStackDesc.get);
    feralStackSetter = freeze(typeErrorStackDesc.set);
  } else {
    // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_UNEXPECTED_ERROR_OWN_STACK_ACCESSOR.md
    throw TypeError(
      'Unexpected Error own stack accessor functions (SES_UNEXPECTED_ERROR_OWN_STACK_ACCESSOR)',
    );
  }
}

/**
 * If on a v8 with the problematic error own stack accessor behavior,
 * `FERAL_STACK_GETTER` will be the shared getter of all those accessors
 * and `FERAL_STACK_SETTER` will be the shared setter. On any platform
 * without this problem, `FERAL_STACK_GETTER` and `FERAL_STACK_SETTER` are
 * both `undefined`.
 *
 * @type {(() => any) | undefined}
 */
       const FERAL_STACK_GETTER = feralStackGetter;

/**
 * If on a v8 with the problematic error own stack accessor behavior,
 * `FERAL_STACK_GETTER` will be the shared getter of all those accessors
 * and `FERAL_STACK_SETTER` will be the shared setter. On any platform
 * without this problem, `FERAL_STACK_GETTER` and `FERAL_STACK_SETTER` are
 * both `undefined`.
 *
 * @type {((newValue: any) => void) | undefined}
 */$h͏_once.FERAL_STACK_GETTER(FERAL_STACK_GETTER);
       const FERAL_STACK_SETTER = feralStackSetter;$h͏_once.FERAL_STACK_SETTER(FERAL_STACK_SETTER);

const getAsyncGeneratorFunctionInstance = () => {
  // Test for async generator function syntax support.
  try {
    // Wrapping one in an new Function lets the `hermesc` binary file
    // parse the Metro js bundle without SyntaxError, to generate the
    // optimised Hermes bytecode bundle, when `gradlew` is called to
    // assemble the release build APK for React Native prod Android apps.
    // Delaying the error until runtime lets us customise lockdown behaviour.
    return new FERAL_FUNCTION(
      'return (async function* AsyncGeneratorFunctionInstance() {})',
    )();
  } catch (error) {
    const err = /** @type {Error} */ (error);
    // Note: `Error.prototype.jsEngine` is only set by React Native runtime, not Hermes:
    // https://github.com/facebook/react-native/blob/main/packages/react-native/ReactCommon/hermes/executor/HermesExecutorFactory.cpp#L224-L230
    if (err.name === 'SyntaxError') {
      // Swallows Hermes error `async generators are unsupported` at runtime.
      // Note: `console` is not a JS built-in, so Hermes engine throws:
      // Uncaught ReferenceError: Property 'console' doesn't exist
      // See: https://github.com/facebook/hermes/issues/675
      // However React Native provides a `console` implementation when setting up error handling:
      // https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Core/InitializeCore.js
      return undefined;
    } else if (err.name === 'EvalError') {
      // eslint-disable-next-line no-empty-function
      return async function* AsyncGeneratorFunctionInstance() {};
    } else {
      throw err;
    }
  }
};

/**
 * If the platform supports async generator functions, this will be an
 * async generator function instance. Otherwise, it will be `undefined`.
 *
 * @type {AsyncGeneratorFunction | undefined}
 */
       const AsyncGeneratorFunctionInstance =
  getAsyncGeneratorFunctionInstance();$h͏_once.AsyncGeneratorFunctionInstance(AsyncGeneratorFunctionInstance);
})()
,
// === 1. ses ./src/assert-sloppy-mode.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let TypeError;$h͏_imports([["./commons.js", [["TypeError",[$h͏_a => (TypeError = $h͏_a)]]]]]);

/** @this {unknown} */
// getThis returns globalThis in sloppy mode or undefined in strict mode.
function getThis() {
  return this;
}

if (getThis()) {
  // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_NO_SLOPPY.md
  throw TypeError(`SES failed to initialize, sloppy mode (SES_NO_SLOPPY)`);
}
})()
,
// === 2. env-options ./src/env-options.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';$h͏_imports([]);/* global globalThis */
// @ts-check

// `@endo/env-options` needs to be imported quite early, and so should
// avoid importing from ses or anything that depends on ses.

// /////////////////////////////////////////////////////////////////////////////
// Prelude of cheap good - enough imitations of things we'd use or
// do differently if we could depend on ses

// eslint-disable-next-line no-restricted-globals
const localThis = globalThis;

const { Object, Reflect, Array, String, JSON, Error } = localThis;
const { freeze } = Object;
const { apply } = Reflect;

// Should be equivalent to the one in ses' commons.js even though it
// uses the other technique.
const uncurryThis =
  fn =>
  (receiver, ...args) =>
    apply(fn, receiver, args);
const arrayPush = uncurryThis(Array.prototype.push);
const arrayIncludes = uncurryThis(Array.prototype.includes);
const stringSplit = uncurryThis(String.prototype.split);

const q = JSON.stringify;

const Fail = (literals, ...args) => {
  let msg = literals[0];
  for (let i = 0; i < args.length; i += 1) {
    msg = `${msg}${args[i]}${literals[i + 1]}`;
  }
  throw Error(msg);
};

// end prelude
// /////////////////////////////////////////////////////////////////////////////

/**
 * `makeEnvironmentCaptor` provides a mechanism for getting environment
 * variables, if they are needed, and a way to catalog the names of all
 * the environment variables that were captured.
 *
 * @param {object} aGlobal
 * @param {boolean} [dropNames] Defaults to false. If true, don't track
 * names used.
 */
       const makeEnvironmentCaptor = (aGlobal, dropNames = false) => {
  /** @type {string[]} */
  const capturedEnvironmentOptionNames = [];

  /**
   * Gets an environment option by name and returns the option value or the
   * given default.
   *
   * @param {string} optionName
   * @param {string} defaultSetting
   * @param {string[]} [optOtherValues]
   * If provided, the option value must be included or match `defaultSetting`.
   * @returns {string}
   */
  const getEnvironmentOption = (
    optionName,
    defaultSetting,
    optOtherValues = undefined,
  ) => {
    typeof optionName === 'string' ||
      Fail`Environment option name ${q(optionName)} must be a string.`;
    typeof defaultSetting === 'string' ||
      Fail`Environment option default setting ${q(
        defaultSetting,
      )} must be a string.`;

    /** @type {string} */
    let setting = defaultSetting;
    const globalProcess = aGlobal.process || undefined;
    const globalEnv =
      (typeof globalProcess === 'object' && globalProcess.env) || undefined;
    if (typeof globalEnv === 'object') {
      if (optionName in globalEnv) {
        if (!dropNames) {
          arrayPush(capturedEnvironmentOptionNames, optionName);
        }
        const optionValue = globalEnv[optionName];
        // eslint-disable-next-line @endo/no-polymorphic-call
        typeof optionValue === 'string' ||
          Fail`Environment option named ${q(
            optionName,
          )}, if present, must have a corresponding string value, got ${q(
            optionValue,
          )}`;
        setting = optionValue;
      }
    }
    optOtherValues === undefined ||
      setting === defaultSetting ||
      arrayIncludes(optOtherValues, setting) ||
      Fail`Unrecognized ${q(optionName)} value ${q(
        setting,
      )}. Expected one of ${q([defaultSetting, ...optOtherValues])}`;
    return setting;
  };
  freeze(getEnvironmentOption);

  /**
   * @template {string} [T=string]
   * @param {string} optionName
   * @returns {T[]}
   */
  const getEnvironmentOptionsList = optionName => {
    const option = getEnvironmentOption(optionName, '');
    return freeze(option === '' ? [] : stringSplit(option, ','));
  };
  freeze(getEnvironmentOptionsList);

  /**
   * @template {string} [T=string]
   * @param {string} optionName
   * @param {T} element
   * @returns {boolean}
   */
  const environmentOptionsListHas = (optionName, element) =>
    arrayIncludes(getEnvironmentOptionsList(optionName), element);

  const getCapturedEnvironmentOptionNames = () => {
    return freeze([...capturedEnvironmentOptionNames]);
  };
  freeze(getCapturedEnvironmentOptionNames);

  return freeze({
    getEnvironmentOption,
    getEnvironmentOptionsList,
    environmentOptionsListHas,
    getCapturedEnvironmentOptionNames,
  });
};$h͏_once.makeEnvironmentCaptor(makeEnvironmentCaptor);
freeze(makeEnvironmentCaptor);

/**
 * For the simple case, where the global in question is `globalThis` and no
 * reporting of option names is desired.
 */
       const {
  getEnvironmentOption,
  getEnvironmentOptionsList,
  environmentOptionsListHas,
} = makeEnvironmentCaptor(localThis, true);$h͏_once.getEnvironmentOption(getEnvironmentOption);$h͏_once.getEnvironmentOptionsList(getEnvironmentOptionsList);$h͏_once.environmentOptionsListHas(environmentOptionsListHas);
})()
,
// === 3. env-options ./index.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';$h͏_imports([["./src/env-options.js", []]]);
})()
,
// === 4. immutable-arraybuffer ./src/immutable-arraybuffer-pony.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';$h͏_imports([]);/* global globalThis */

const {
  ArrayBuffer,
  Object,
  Reflect,
  Symbol,
  TypeError,
  Uint8Array,
  WeakMap,
  // Capture structuredClone before it can be scuttled.
  structuredClone: optStructuredClone
  // eslint-disable-next-line no-restricted-globals
} = globalThis;

const { freeze, defineProperty, getPrototypeOf, getOwnPropertyDescriptor } =
  Object;
const { apply, ownKeys } = Reflect;
const { toStringTag } = Symbol;

const { prototype: arrayBufferPrototype } = ArrayBuffer;
const { slice, transfer: optTransfer } = arrayBufferPrototype;
// @ts-expect-error TS doesn't know it'll be there
const { get: arrayBufferByteLength } = getOwnPropertyDescriptor(
  arrayBufferPrototype,
  'byteLength',
);

const typedArrayPrototype = getPrototypeOf(Uint8Array.prototype);
const { set: uint8ArraySet } = typedArrayPrototype;
// @ts-expect-error TS doesn't know it'll be there
const { get: uint8ArrayBuffer } = getOwnPropertyDescriptor(
  typedArrayPrototype,
  'buffer',
);

/**
 * Copy a range of values from a genuine ArrayBuffer exotic object into a new
 * ArrayBuffer.
 *
 * @param {ArrayBuffer} realBuffer
 * @param {number} [start]
 * @param {number} [end]
 * @returns {ArrayBuffer}
 */
const arrayBufferSlice = (realBuffer, start = undefined, end = undefined) =>
  apply(slice, realBuffer, [start, end]);

/**
 * Move the contents of a genuine ArrayBuffer exotic object into a new fresh
 * ArrayBuffer and detach the original source.
 * We can only do this on platforms that support `structuredClone` or
 * `ArrayBuffer.prototype.transfer`.
 * On other platforms, we can still emulate
 * `ArrayBuffer.prototoype.sliceToImmutable`, but not
 * `ArrayBuffer.prototype.transferToImmutable`.
 * Currently, these known-deficient platforms are
 * - Hermes
 * - Node.js <= 16
 * - Apparently some versions of JavaScriptCore that are still of concern.
 *
 * @param {ArrayBuffer} arrayBuffer
 * @returns {ArrayBuffer}
 */
let optArrayBufferTransfer;

if (optTransfer) {
  optArrayBufferTransfer = arrayBuffer => apply(optTransfer, arrayBuffer, []);
} else if (optStructuredClone) {
  optArrayBufferTransfer = arrayBuffer => {
    // Hopefully, a zero-length slice is cheap, but still enforces that
    // `arrayBuffer` is a genuine `ArrayBuffer` exotic object.
    arrayBufferSlice(arrayBuffer, 0, 0);
    return optStructuredClone(arrayBuffer, {
      transfer: [arrayBuffer],
    });
  };
} else {
  // Assignment is redundant, but remains for clarity.
  optArrayBufferTransfer = undefined;
}

/**
 * If we could use classes with private fields everywhere, this would have
 * been a `this.#buffer` private field on an `ImmutableArrayBufferInternal`
 * class. But we cannot do so on Hermes. So, instead, we
 * emulate the `this.#buffer` private field, including its use as a brand check.
 * Maps from all and only emulated Immutable ArrayBuffers to real ArrayBuffers.
 *
 * @type {Pick<WeakMap<ArrayBuffer, ArrayBuffer>, 'get' | 'has' | 'set'>}
 */
const buffers = new WeakMap();
// Avoid post-hoc prototype lookups.
for (const methodName of ['get', 'has', 'set']) {
  defineProperty(buffers, methodName, { value: buffers[methodName] });
}
const getBuffer = immuAB => {
  // Safe because this WeakMap owns its get method.
  // eslint-disable-next-line @endo/no-polymorphic-call
  const result = buffers.get(immuAB);
  if (result) {
    return result;
  }
  throw TypeError('Not an emulated Immutable ArrayBuffer');
};

// Omits `constructor` so `Array.prototype.constructor` is inherited.
const ImmutableArrayBufferInternalPrototype = {
  __proto__: arrayBufferPrototype,
  get byteLength() {
    return apply(arrayBufferByteLength, getBuffer(this), []);
  },
  get detached() {
    getBuffer(this); // shim brand check
    return false;
  },
  get maxByteLength() {
    // Not underlying maxByteLength, which is irrelevant
    return apply(arrayBufferByteLength, getBuffer(this), []);
  },
  get resizable() {
    getBuffer(this); // shim brand check
    return false;
  },
  get immutable() {
    getBuffer(this); // shim brand check
    return true;
  },
  slice(start = undefined, end = undefined) {
    return arrayBufferSlice(getBuffer(this), start, end);
  },
  sliceToImmutable(start = undefined, end = undefined) {
    // eslint-disable-next-line no-use-before-define
    return sliceBufferToImmutable(getBuffer(this), start, end);
  },
  resize(_newByteLength = undefined) {
    getBuffer(this); // shim brand check
    throw TypeError('Cannot resize an immutable ArrayBuffer');
  },
  transfer(_newLength = undefined) {
    getBuffer(this); // shim brand check
    throw TypeError('Cannot detach an immutable ArrayBuffer');
  },
  transferToFixedLength(_newLength = undefined) {
    getBuffer(this); // shim brand check
    throw TypeError('Cannot detach an immutable ArrayBuffer');
  },
  transferToImmutable(_newLength = undefined) {
    getBuffer(this); // shim brand check
    throw TypeError('Cannot detach an immutable ArrayBuffer');
  },
  /**
   * See https://github.com/endojs/endo/tree/master/packages/immutable-arraybuffer#purposeful-violation
   */
  [toStringTag]: 'ImmutableArrayBuffer',
};

// Better fidelity emulation of a class prototype
for (const key of ownKeys(ImmutableArrayBufferInternalPrototype)) {
  defineProperty(ImmutableArrayBufferInternalPrototype, key, {
    enumerable: false,
  });
}

/**
 * Emulates what would have been the encapsulated `ImmutableArrayBufferInternal`
 * class constructor. This function takes the `realBuffer` which its
 * result encapsulates. Security demands that this result has exclusive access
 * to the `realBuffer` it is given, which its callers must ensure.
 *
 * @param {ArrayBuffer} realBuffer
 * @returns {ArrayBuffer}
 */
const makeImmutableArrayBufferInternal = realBuffer => {
  const result = /** @type {ArrayBuffer} */ (
    /** @type {unknown} */ ({
      __proto__: ImmutableArrayBufferInternalPrototype,
    })
  );
  // Safe because this WeakMap owns its set method.
  // eslint-disable-next-line @endo/no-polymorphic-call
  buffers.set(result, realBuffer);
  return result;
};
// Since `makeImmutableArrayBufferInternal` MUST not escape,
// this `freeze` is just belt-and-suspenders.
freeze(makeImmutableArrayBufferInternal);

/**
 * @param {ArrayBuffer} buffer
 * @returns {boolean}
 */
// eslint-disable-next-line @endo/no-polymorphic-call
       const isBufferImmutable = buffer => buffers.has(buffer);

/**
 * Creates an immutable slice of the given buffer.
 * @param {ArrayBuffer} buffer The original buffer.
 * @param {number} [start] The start index.
 * @param {number} [end] The end index.
 * @returns {ArrayBuffer} The sliced immutable ArrayBuffer.
 */$h͏_once.isBufferImmutable(isBufferImmutable);
       const sliceBufferToImmutable = (
  buffer,
  start = undefined,
  end = undefined,
) => {
  // Safe because this WeakMap owns its get method.
  // eslint-disable-next-line @endo/no-polymorphic-call
  let realBuffer = buffers.get(buffer);
  if (realBuffer === undefined) {
    realBuffer = buffer;
  }
  return makeImmutableArrayBufferInternal(
    arrayBufferSlice(realBuffer, start, end),
  );
};$h͏_once.sliceBufferToImmutable(sliceBufferToImmutable);

let transferBufferToImmutable;
if (optArrayBufferTransfer) {
  /**
   * Transfer the contents to a new Immutable ArrayBuffer
   *
   * @param {ArrayBuffer} buffer The original buffer.
   * @param {number} [newLength] The start index.
   * @returns {ArrayBuffer}
   */
  transferBufferToImmutable = (buffer, newLength = undefined) => {
    if (newLength === undefined) {
      buffer = optArrayBufferTransfer(buffer);
    } else if (optTransfer) {
      buffer = apply(optTransfer, buffer, [newLength]);
    } else {
      buffer = optArrayBufferTransfer(buffer);
      const oldLength = buffer.byteLength;
      // eslint-disable-next-line @endo/restrict-comparison-operands
      if (newLength <= oldLength) {
        buffer = arrayBufferSlice(buffer, 0, newLength);
      } else {
        const oldTA = new Uint8Array(buffer);
        const newTA = new Uint8Array(newLength);
        apply(uint8ArraySet, newTA, [oldTA]);
        buffer = apply(uint8ArrayBuffer, newTA, []);
      }
    }
    const result = makeImmutableArrayBufferInternal(buffer);
    return /** @type {ArrayBuffer} */ (/** @type {unknown} */ (result));
  };
} else {
  transferBufferToImmutable = undefined;
}

       const optTransferBufferToImmutable = transferBufferToImmutable;$h͏_once.optTransferBufferToImmutable(optTransferBufferToImmutable);
})()
,
// === 5. immutable-arraybuffer ./src/immutable-arraybuffer-shim.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let isBufferImmutable,sliceBufferToImmutable,optXferBuf2Immu;$h͏_imports([["./immutable-arraybuffer-pony.js", [["isBufferImmutable",[$h͏_a => (isBufferImmutable = $h͏_a)]],["sliceBufferToImmutable",[$h͏_a => (sliceBufferToImmutable = $h͏_a)]],["optTransferBufferToImmutable",[$h͏_a => (optXferBuf2Immu = $h͏_a)]]]]]);







const {
  ArrayBuffer,
  JSON,
  Object,
  Reflect
  // eslint-disable-next-line no-restricted-globals
} = globalThis;

// Even though the imported one is not exported by the pony as a live binding,
// TS doesn't know that,
// so it cannot do its normal flow-based inference. By making and using a local
// copy, no problem.
const optTransferBufferToImmutable = optXferBuf2Immu;

const { getOwnPropertyDescriptors, defineProperties, defineProperty } = Object;
const { ownKeys } = Reflect;
const { prototype: arrayBufferPrototype } = ArrayBuffer;
const { stringify } = JSON;

const arrayBufferMethods = {
  /**
   * Creates an immutable slice of the given buffer.
   *
   * @this {ArrayBuffer} buffer The original buffer.
   * @param {number} [start] The start index.
   * @param {number} [end] The end index.
   * @returns {ArrayBuffer} The sliced immutable ArrayBuffer.
   */
  sliceToImmutable(start = undefined, end = undefined) {
    return sliceBufferToImmutable(this, start, end);
  },

  /**
   * @this {ArrayBuffer}
   */
  get immutable() {
    return isBufferImmutable(this);
  },

  ...(optTransferBufferToImmutable
    ? {
        /**
         * Transfer the contents to a new immutable ArrayBuffer
         *
         * @this {ArrayBuffer} buffer The original buffer.
         * @param {number} [newLength] The start index.
         * @returns {ArrayBuffer} The new immutable ArrayBuffer.
         */
        transferToImmutable(newLength = undefined) {
          return optTransferBufferToImmutable(this, newLength);
        },
      }
    : {}),
};

// Better fidelity emulation of a class prototype
for (const key of ownKeys(arrayBufferMethods)) {
  defineProperty(arrayBufferMethods, key, {
    enumerable: false,
  });
}

// Modern shim practice frowns on conditional installation, at least for
// proposals prior to stage 3. This is so changes to the proposal since
// an old shim was distributed don't need to worry about the proposal
// breaking old code depending on the old shim. Thus, if we detect that
// we're about to overwrite a prior installation, we simply issue this
// warning and continue.
//
// TODO, if the primordials are frozen after the prior implementation, such as
// by `lockdown`, then this precludes overwriting as expected. However, for
// this case, the following warning text will be confusing.
//
// Allowing polymorphic calls because these occur during initialization.
// eslint-disable-next-line @endo/no-polymorphic-call
const overwrites = ownKeys(arrayBufferMethods).filter(
  key => key in arrayBufferPrototype,
);
if (overwrites.length > 0) {
  // eslint-disable-next-line @endo/no-polymorphic-call
  console.warn(
    `About to overwrite ArrayBuffer.prototype properties ${stringify(overwrites)}`,
  );
}

defineProperties(
  arrayBufferPrototype,
  getOwnPropertyDescriptors(arrayBufferMethods),
);
})()
,
// === 6. immutable-arraybuffer ./shim.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';$h͏_imports([["./src/immutable-arraybuffer-shim.js", []]]);
})()
,
// === 7. ses ./src/error/stringify-utils.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let Set,String,isArray,arrayJoin,arraySlice,arraySort,arrayMap,keys,fromEntries,freeze,is,isError,setAdd,setHas,stringIncludes,stringStartsWith,stringifyJson,toStringTagSymbol;$h͏_imports([["../commons.js", [["Set",[$h͏_a => (Set = $h͏_a)]],["String",[$h͏_a => (String = $h͏_a)]],["isArray",[$h͏_a => (isArray = $h͏_a)]],["arrayJoin",[$h͏_a => (arrayJoin = $h͏_a)]],["arraySlice",[$h͏_a => (arraySlice = $h͏_a)]],["arraySort",[$h͏_a => (arraySort = $h͏_a)]],["arrayMap",[$h͏_a => (arrayMap = $h͏_a)]],["keys",[$h͏_a => (keys = $h͏_a)]],["fromEntries",[$h͏_a => (fromEntries = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["is",[$h͏_a => (is = $h͏_a)]],["isError",[$h͏_a => (isError = $h͏_a)]],["setAdd",[$h͏_a => (setAdd = $h͏_a)]],["setHas",[$h͏_a => (setHas = $h͏_a)]],["stringIncludes",[$h͏_a => (stringIncludes = $h͏_a)]],["stringStartsWith",[$h͏_a => (stringStartsWith = $h͏_a)]],["stringifyJson",[$h͏_a => (stringifyJson = $h͏_a)]],["toStringTagSymbol",[$h͏_a => (toStringTagSymbol = $h͏_a)]]]]]);






















/** @import {Stringable} from '../../types.js' */

/**
 * Joins English terms with commas and an optional conjunction.
 *
 * @param {(string | Stringable)[]} terms
 * @param {"and" | "or"} conjunction
 */
       const enJoin = (terms, conjunction) => {
  if (terms.length === 0) {
    return '(none)';
  } else if (terms.length === 1) {
    return terms[0];
  } else if (terms.length === 2) {
    const [first, second] = terms;
    return `${first} ${conjunction} ${second}`;
  } else {
    return `${arrayJoin(arraySlice(terms, 0, -1), ', ')}, ${conjunction} ${
      terms[terms.length - 1]
    }`;
  }
};

/**
 * Prepend the correct indefinite article onto a noun, typically a typeof
 * result, e.g., "an object" vs. "a number"
 *
 * @param {string} str The noun to prepend
 * @returns {string} The noun prepended with a/an
 */$h͏_once.enJoin(enJoin);
const an = str => {
  str = `${str}`;
  if (str.length >= 1 && stringIncludes('aeiouAEIOU', str[0])) {
    return `an ${str}`;
  }
  return `a ${str}`;
};$h͏_once.an(an);
freeze(an);


/**
 * Like `JSON.stringify` but does not blow up if given a cycle or a bigint.
 * This is not
 * intended to be a serialization to support any useful unserialization,
 * or any programmatic use of the resulting string. The string is intended
 * *only* for showing a human under benign conditions, in order to be
 * informative enough for some
 * logging purposes. As such, this `bestEffortStringify` has an
 * imprecise specification and may change over time.
 *
 * The current `bestEffortStringify` possibly emits too many "seen"
 * markings: Not only for cycles, but also for repeated subtrees by
 * object identity.
 *
 * As a best effort only for diagnostic interpretation by humans,
 * `bestEffortStringify` also turns various cases that normal
 * `JSON.stringify` skips or errors on, like `undefined` or bigints,
 * into strings that convey their meaning. To distinguish this from
 * strings in the input, these synthesized strings always begin and
 * end with square brackets. To distinguish those strings from an
 * input string with square brackets, and input string that starts
 * with an open square bracket `[` is itself placed in square brackets.
 *
 * @param {any} payload
 * @param {(string|number)=} spaces
 * @returns {string}
 */
const bestEffortStringify = (payload, spaces = undefined) => {
  const seenSet = new Set();
  const replacer = (_, val) => {
    switch (typeof val) {
      case 'object': {
        if (val === null) {
          return null;
        }
        if (setHas(seenSet, val)) {
          return '[Seen]';
        }
        setAdd(seenSet, val);
        if (isError(val)) {
          return `[${val.name}: ${val.message}]`;
        }
        if (toStringTagSymbol in val) {
          // For the built-ins that have or inherit a `Symbol.toStringTag`-named
          // property, most of them inherit the default `toString` method,
          // which will print in a similar manner: `"[object Foo]"` vs
          // `"[Foo]"`. The exceptions are
          //    * `Symbol.prototype`, `BigInt.prototype`, `String.prototype`
          //      which don't matter to us since we handle primitives
          //      separately and we don't care about primitive wrapper objects.
          //    * TODO
          //      `Date.prototype`, `TypedArray.prototype`.
          //      Hmmm, we probably should make special cases for these. We're
          //      not using these yet, so it's not urgent. But others will run
          //      into these.
          //
          // Once #2018 is closed, the only objects in our code that have or
          // inherit a `Symbol.toStringTag`-named property are remotables
          // or their remote presences.
          // This printing will do a good job for these without
          // violating abstraction layering. This behavior makes sense
          // purely in terms of JavaScript concepts. That's some of the
          // motivation for choosing that representation of remotables
          // and their remote presences in the first place.
          return `[${val[toStringTagSymbol]}]`;
        }
        if (isArray(val)) {
          return val;
        }
        const names = keys(val);
        if (names.length < 2) {
          return val;
        }
        let sorted = true;
        for (let i = 1; i < names.length; i += 1) {
          if (names[i - 1] >= names[i]) {
            sorted = false;
            break;
          }
        }
        if (sorted) {
          return val;
        }
        arraySort(names);
        const entries = arrayMap(names, name => [name, val[name]]);
        return fromEntries(entries);
      }
      case 'function': {
        return `[Function ${val.name || '<anon>'}]`;
      }
      case 'string': {
        if (stringStartsWith(val, '[')) {
          return `[${val}]`;
        }
        return val;
      }
      case 'undefined':
      case 'symbol': {
        return `[${String(val)}]`;
      }
      case 'bigint': {
        return `[${val}n]`;
      }
      case 'number': {
        if (is(val, NaN)) {
          return '[NaN]';
        } else if (val === Infinity) {
          return '[Infinity]';
        } else if (val === -Infinity) {
          return '[-Infinity]';
        }
        return val;
      }
      default: {
        return val;
      }
    }
  };
  try {
    return stringifyJson(payload, replacer, spaces);
  } catch (_err) {
    // Don't do anything more fancy here if there is any
    // chance that might throw, unless you surround that
    // with another try-catch-recovery. For example,
    // the caught thing might be a proxy or other exotic
    // object rather than an error. The proxy might throw
    // whenever it is possible for it to.
    return '[Something that failed to stringify]';
  }
};$h͏_once.bestEffortStringify(bestEffortStringify);
freeze(bestEffortStringify);
})()
,
// === 8. ses ./src/error/types.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';$h͏_imports([]);// @ts-check

/** @import {GenericErrorConstructor, AssertMakeErrorOptions, DetailsToken, Stringable} from '../../types.js' */

/**
 * @typedef {object} VirtualConsole
 * @property {Console['debug']} debug
 * @property {Console['log']} log
 * @property {Console['info']} info
 * @property {Console['warn']} warn
 * @property {Console['error']} error
 *
 * @property {Console['trace']} trace
 * @property {Console['dirxml']} dirxml
 * @property {Console['group']} group
 * @property {Console['groupCollapsed']} groupCollapsed
 *
 * @property {Console['assert']} assert
 * @property {Console['timeLog']} timeLog
 *
 * @property {Console['clear']} clear
 * @property {Console['count']} count
 * @property {Console['countReset']} countReset
 * @property {Console['dir']} dir
 * @property {Console['groupEnd']} groupEnd
 *
 * @property {Console['table']} table
 * @property {Console['time']} time
 * @property {Console['timeEnd']} timeEnd
 * @property {Console['timeStamp']} timeStamp
 */

/* This is deliberately *not* JSDoc, it is a regular comment.
 *
 * TODO: We'd like to add the following properties to the above
 * VirtualConsole, but they currently cause conflicts where
 * some Typescript implementations don't have these properties
 * on the Console type.
 *
 * @property {Console['profile']} profile
 * @property {Console['profileEnd']} profileEnd
 */

/**
 * @typedef {'debug' | 'log' | 'info' | 'warn' | 'error'} LogSeverity
 */

/**
 * @typedef ConsoleFilter
 * @property {(severity: LogSeverity) => boolean} canLog
 */

/**
 * @callback FilterConsole
 * @param {VirtualConsole} baseConsole
 * @param {ConsoleFilter} filter
 * @param {string} [topic]
 * @returns {VirtualConsole}
 */
})()
,
// === 9. ses ./src/error/internal-types.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';$h͏_imports([]);// @ts-check

/**
 * @import {VirtualConsole} from './types.js'
 */

/**
 * @typedef {readonly any[]} LogArgs
 *
 * This is an array suitable to be used as arguments of a console
 * level message *after* the format string argument. It is the result of
 * a `details` template string and consists of alternating literal strings
 * and substitution values, starting with a literal string. At least that
 * first literal string is always present.
 */

/**
 * @callback NoteCallback
 *
 * @param {Error} error
 * @param {LogArgs} noteLogArgs
 * @returns {void}
 */

/**
 * @callback GetStackString
 * @param {Error} error
 * @returns {string=}
 */

/**
 * @typedef {object} LoggedErrorHandler
 *
 * Used to parameterize `makeCausalConsole` to give it access to potentially
 * hidden information to augment the logging of errors.
 *
 * @property {GetStackString} getStackString
 * @property {(error: Error) => string} tagError
 * @property {() => void} resetErrorTagNum for debugging purposes only
 * @property {(error: Error) => (LogArgs | undefined)} getMessageLogArgs
 * @property {(error: Error) => (LogArgs | undefined)} takeMessageLogArgs
 * @property {(error: Error, callback?: NoteCallback) => LogArgs[] } takeNoteLogArgsArray
 */

// /////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {readonly [string, ...any[]]} LogRecord
 */

/**
 * @typedef {object} LoggingConsoleKit
 * @property {VirtualConsole} loggingConsole
 * @property {() => readonly LogRecord[]} takeLog
 */

/**
 * @typedef {object} MakeLoggingConsoleKitOptions
 * @property {boolean=} shouldResetForDebugging
 */

/**
 * @callback MakeLoggingConsoleKit
 *
 * A logging console just accumulates the contents of all permitted calls,
 * making them available to callers of `takeLog()`. Calling `takeLog()`
 * consumes these, so later calls to `takeLog()` will only provide a log of
 * calls that have happened since then.
 *
 * @param {LoggedErrorHandler} loggedErrorHandler
 * @param {MakeLoggingConsoleKitOptions=} options
 * @returns {LoggingConsoleKit}
 */

/**
 * @typedef {{
 *   NOTE: 'ERROR_NOTE:',
 *   MESSAGE: 'ERROR_MESSAGE:',
 *   CAUSE: 'cause:',
 *   ERRORS: 'errors:',
 * }} ErrorInfo
 */

/**
 * @typedef {ErrorInfo[keyof ErrorInfo]} ErrorInfoKind
 */

/**
 * @callback MakeCausalConsole
 *
 * Makes a causal console wrapper of a `baseConsole`, where the causal console
 * calls methods of the `loggedErrorHandler` to customize how it handles logged
 * errors.
 *
 * @param {VirtualConsole | undefined} baseConsole
 * @param {LoggedErrorHandler} loggedErrorHandler
 * @returns {VirtualConsole | undefined}
 */
})()
,
// === 10. cache-map ./src/cachemap.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';$h͏_imports([]);// @ts-check
/* global globalThis */
/* eslint-disable @endo/no-polymorphic-call */

// eslint-disable-next-line no-restricted-globals
const { Error, TypeError, WeakMap } = globalThis;
// eslint-disable-next-line no-restricted-globals
const { parse, stringify } = JSON;
// eslint-disable-next-line no-restricted-globals
const { isSafeInteger } = Number;
// eslint-disable-next-line no-restricted-globals
const { freeze } = Object;
// eslint-disable-next-line no-restricted-globals
const { toStringTag: toStringTagSymbol } = Symbol;

// eslint-disable-next-line no-restricted-globals
const UNKNOWN_KEY = Symbol('UNKNOWN_KEY');

/**
 * @template T
 * @typedef {T extends object ? { -readonly [K in keyof T]: T[K] } : never} WritableDeep
 *   Intentionally limited to local needs; refer to
 *   https://github.com/sindresorhus/type-fest if insufficient.
 */

/**
 * @template T
 * @param {T} value
 * @param {<U,>(name: string, value: U) => U} [reviver]
 * @returns {WritableDeep<T>}
 */
const deepCopyJsonable = (value, reviver) => {
  const encoded = stringify(value);
  const decoded = parse(encoded, reviver);
  return decoded;
};

const freezingReviver = (_name, value) => freeze(value);

/** @type {<T,>(value: T) => T} */
const deepCopyAndFreezeJsonable = value =>
  deepCopyJsonable(value, freezingReviver);

/**
 * A cache of bounded size, implementing the WeakMap interface but holding keys
 * strongly if created with a non-weak `makeMap` option of
 * {@link makeCacheMapKit}.
 *
 * @template K
 * @template V
 * @typedef {Pick<Map<K, V>, Exclude<keyof WeakMap<WeakKey, *>, 'set'>> & {set: (key: K, value: V) => WeakMapAPI<K, V>}} WeakMapAPI
 */

/**
 * @template K
 * @template V
 * @typedef {WeakMapAPI<K, V> & ({clear?: undefined} | Pick<Map<K, V>, 'clear'>)} SingleEntryMap
 */

/**
 * A cell of a doubly-linked ring (circular list) for a cache map.
 * Instances are not frozen, and so should be closely encapsulated.
 *
 * @template K
 * @template V
 * @typedef {object} CacheMapCell
 * @property {number} id for debugging
 * @property {CacheMapCell<K, V>} next
 * @property {CacheMapCell<K, V>} prev
 * @property {SingleEntryMap<K, V>} data
 */

/**
 * @template K
 * @template V
 * @param {CacheMapCell<K, V>} prev
 * @param {number} id
 * @param {SingleEntryMap<K, V>} data
 * @returns {CacheMapCell<K, V>}
 */
const appendNewCell = (prev, id, data) => {
  const next = prev?.next;
  const cell = { id, next, prev, data };
  prev.next = cell;
  next.prev = cell;
  return cell;
};

/**
 * @template K
 * @template V
 * @param {CacheMapCell<K, V>} cell
 * @param {CacheMapCell<K, V>} prev
 * @param {CacheMapCell<K, V>} [next]
 */
const moveCellAfter = (cell, prev, next = prev.next) => {
  if (cell === prev || cell === next) return; // already in position

  // Splice out cell.
  const { prev: oldPrev, next: oldNext } = cell;
  oldPrev.next = oldNext;
  oldNext.prev = oldPrev;

  // Splice in cell after prev.
  cell.prev = prev;
  cell.next = next;
  prev.next = cell;
  next.prev = cell;
};

/**
 * Clear out a cell to prepare it for future use. Its map is preserved when
 * possible, but must instead be replaced if the associated key is not known.
 *
 * @template K
 * @template V
 * @param {CacheMapCell<K, V>} cell
 * @param {K | UNKNOWN_KEY} oldKey
 * @param {() => SingleEntryMap<K, V>} [makeMap] required when the key is unknown
 */
const resetCell = (cell, oldKey, makeMap) => {
  if (oldKey !== UNKNOWN_KEY) {
    cell.data.delete(oldKey);
    return;
  }
  if (cell.data.clear) {
    cell.data.clear();
    return;
  }
  // WeakMap instances must be replaced when the key is unknown.
  if (!makeMap) {
    throw Error('internal: makeMap is required with UNKNOWN_KEY');
  }
  cell.data = makeMap();
};

const zeroMetrics = freeze({
  totalQueryCount: 0,
  totalHitCount: 0
  // TODO?
  // * method-specific counts
  // * liveTouchStats/evictedTouchStats { count, sum, mean, min, max }
  //   * p50/p90/p95/p99 via Ben-Haim/Tom-Tov streaming histograms
});
/** @typedef {typeof zeroMetrics} CacheMapMetrics */

/**
 * @template {MapConstructor | WeakMapConstructor} [C=WeakMapConstructor]
 * @template {Parameters<InstanceType<C>['set']>[0]} [K=Parameters<InstanceType<C>['set']>[0]]
 * @template {unknown} [V=unknown]
 * @typedef {object} CacheMapKit
 * @property {WeakMapAPI<K, V>} cache
 * @property {() => CacheMapMetrics} getMetrics
 */

/**
 * Create a bounded-size cache having WeakMap-compatible
 * `has`/`get`/`set`/`delete` methods, capable of supporting SES (specifically
 * `assert` error notes).
 * Key validity, comparison, and referential strength are controlled by the
 * `makeMap` option, which defaults to `WeakMap` but can be set to any producer
 * of objects with those methods (e.g., using `Map` allows for arbitrary keys
 * which will be strongly held).
 * Cache eviction policy is not currently configurable, but strives for a hit
 * ratio at least as good as
 * [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU) (e.g., it
 * might be
 * [CLOCK](https://en.wikipedia.org/wiki/Page_replacement_algorithm#Clock)
 * or [SIEVE](https://sievecache.com/)).
 *
 * @template {MapConstructor | WeakMapConstructor} [C=WeakMapConstructor]
 * @template {Parameters<InstanceType<C>['set']>[0]} [K=Parameters<InstanceType<C>['set']>[0]]
 * @template {unknown} [V=unknown]
 * @param {number} capacity
 * @param {object} [options]
 * @param {C | (() => SingleEntryMap<K, V>)} [options.makeMap]
 * @returns {CacheMapKit<C, K, V>}
 */
       const makeCacheMapKit = (capacity, options = {}) => {
  if (!isSafeInteger(capacity) || capacity < 0) {
    throw TypeError(
      'capacity must be a non-negative safe integer number <= 2**53 - 1',
    );
  }

  /**
   * @template V
   * @type {<V,>() => SingleEntryMap<K, V>}
   */
  const makeMap = (MaybeCtor => {
    try {
      // @ts-expect-error
      MaybeCtor();
      return /** @type {any} */ (MaybeCtor);
    } catch (err) {
      // @ts-expect-error
      const constructNewMap = () => new MaybeCtor();
      return constructNewMap;
    }
  })(options.makeMap ?? WeakMap);
  const tag =
    /** @type {any} */ (makeMap()).clear === undefined
      ? 'WeakCacheMap'
      : 'CacheMap';

  /** @type {WeakMapAPI<K, CacheMapCell<K, V>>} */
  const keyToCell = makeMap();
  // @ts-expect-error this sentinel head is special
  const head = /** @type {CacheMapCell<K, V>} */ ({
    id: 0,
    // next and prev are established below as self-referential.
    next: undefined,
    prev: undefined,
    data: {
      has: () => {
        throw Error('internal: sentinel head cell has no data');
      },
    },
  });
  head.next = head;
  head.prev = head;
  let cellCount = 0;

  const metrics = deepCopyJsonable(zeroMetrics);
  const getMetrics = () => deepCopyAndFreezeJsonable(metrics);

  /**
   * Touching moves a cell to first position so LRU eviction can target the last
   * cell (`head.prev`).
   *
   * @type {(key: K) => (CacheMapCell<K, V> | undefined)}
   */
  const touchKey = key => {
    metrics.totalQueryCount += 1;
    const cell = keyToCell.get(key);
    if (!cell?.data.has(key)) return undefined;

    metrics.totalHitCount += 1;
    moveCellAfter(cell, head);
    return cell;
  };

  /** @type {WeakMapAPI<K, V>['has']} */
  const has = key => {
    const cell = touchKey(key);
    return cell !== undefined;
  };
  freeze(has);

  /** @type {WeakMapAPI<K, V>['get']} */
  const get = key => {
    const cell = touchKey(key);
    return cell?.data.get(key);
  };
  freeze(get);

  /** @type {WeakMapAPI<K, V>['set']} */
  const set = (key, value) => {
    let cell = touchKey(key);
    if (cell) {
      cell.data.set(key, value);
      // eslint-disable-next-line no-use-before-define
      return implementation;
    }

    if (cellCount < capacity) {
      // Add and use a new cell at first position.
      cell = appendNewCell(head, cellCount + 1, makeMap());
      cellCount += 1; // intentionally follows cell creation
      cell.data.set(key, value);
    } else if (capacity > 0) {
      // Reuse the current tail, moving it to first position.
      cell = head.prev;
      resetCell(/** @type {any} */ (cell), UNKNOWN_KEY, makeMap);
      cell.data.set(key, value);
      moveCellAfter(cell, head);
    }

    // Don't establish this entry until prior steps succeed.
    if (cell) keyToCell.set(key, cell);

    // eslint-disable-next-line no-use-before-define
    return implementation;
  };
  freeze(set);

  // "delete" is a keyword.
  const { delete: deleteEntry } = {
    /** @type {WeakMapAPI<K, V>['delete']} */
    delete: key => {
      const cell = keyToCell.get(key);
      if (!cell?.data.has(key)) {
        keyToCell.delete(key);
        return false;
      }
      moveCellAfter(cell, head.prev);
      resetCell(cell, key);
      keyToCell.delete(key);
      return true;
    },
  };
  freeze(deleteEntry);

  const implementation = /** @type {WeakMapAPI<K, V>} */ ({
    has,
    get,
    set,
    delete: deleteEntry,
    // eslint-disable-next-line jsdoc/check-types
    [/** @type {typeof Symbol.toStringTag} */ (toStringTagSymbol)]: tag,
  });
  freeze(implementation);

  const kit = { cache: implementation, getMetrics };
  return freeze(kit);
};$h͏_once.makeCacheMapKit(makeCacheMapKit);
freeze(makeCacheMapKit);
})()
,
// === 11. cache-map ./index.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';$h͏_imports([["./src/cachemap.js", []]]);
})()
,
// === 12. ses ./src/error/note-log-args.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let makeCacheMapKit;$h͏_imports([["@endo/cache-map", [["makeCacheMapKit",[$h͏_a => (makeCacheMapKit = $h͏_a)]]]]]);





/**
 * @import {CacheMapKit} from '@endo/cache-map';
 * @import {LogArgs} from './internal-types.js';
 */

const { freeze } = Object;
const { isSafeInteger } = Number;

const defaultLoggedErrorsBudget = 1000;
const defaultArgsPerErrorBudget = 100;

/**
 * @param {number} [errorsBudget]
 * @param {number} [argsPerErrorBudget]
 */
       const makeNoteLogArgsArrayKit = (
  errorsBudget = defaultLoggedErrorsBudget,
  argsPerErrorBudget = defaultArgsPerErrorBudget,
) => {
  if (!isSafeInteger(argsPerErrorBudget) || argsPerErrorBudget < 1) {
    throw TypeError(
      'argsPerErrorBudget must be a safe positive integer number',
    );
  }

  /**
   * Maps from an error to an array of log args, where each log args is
   * remembered as an annotation on that error. This can be used, for example,
   * to keep track of additional causes of the error. The elements of any
   * log args may include errors which are associated with further annotations.
   * An augmented console, like the causal console of `console.js`, could
   * then retrieve the graph of such annotations.
   *
   * @type {CacheMapKit<WeakMapConstructor, Error, LogArgs[]>}
   */
  const { cache: noteLogArgsArrayMap } = makeCacheMapKit(errorsBudget);

  /**
   * @param {Error} error
   * @param {LogArgs} logArgs
   */
  const addLogArgs = (error, logArgs) => {
    const logArgsArray = noteLogArgsArrayMap.get(error);
    if (logArgsArray !== undefined) {
      if (logArgsArray.length >= argsPerErrorBudget) {
        logArgsArray.shift();
      }
      logArgsArray.push(logArgs);
    } else {
      noteLogArgsArrayMap.set(error, [logArgs]);
    }
  };
  freeze(addLogArgs);

  /**
   * @param {Error} error
   * @returns {LogArgs[] | undefined}
   */
  const takeLogArgsArray = error => {
    const result = noteLogArgsArrayMap.get(error);
    noteLogArgsArrayMap.delete(error);
    return result;
  };
  freeze(takeLogArgsArray);

  return freeze({
    addLogArgs,
    takeLogArgsArray,
  });
};$h͏_once.makeNoteLogArgsArrayKit(makeNoteLogArgsArrayKit);
freeze(makeNoteLogArgsArrayKit);
})()
,
// === 13. ses ./src/error/assert.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let RangeError,TypeError,WeakMap,arrayJoin,arrayMap,arrayPop,arrayPush,assign,freeze,defineProperty,freezeRegexp,globalThis,is,isError,regexpSearch,stringEndsWith,stringIndexOf,stringSlice,stringStartsWith,weakmapDelete,weakmapGet,weakmapHas,weakmapSet,AggregateError,getOwnPropertyDescriptors,ownKeys,create,objectPrototype,hasOwn,an,bestEffortStringify,makeNoteLogArgsArrayKit;$h͏_imports([["../commons.js", [["RangeError",[$h͏_a => (RangeError = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["WeakMap",[$h͏_a => (WeakMap = $h͏_a)]],["arrayJoin",[$h͏_a => (arrayJoin = $h͏_a)]],["arrayMap",[$h͏_a => (arrayMap = $h͏_a)]],["arrayPop",[$h͏_a => (arrayPop = $h͏_a)]],["arrayPush",[$h͏_a => (arrayPush = $h͏_a)]],["assign",[$h͏_a => (assign = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["freezeRegexp",[$h͏_a => (freezeRegexp = $h͏_a)]],["globalThis",[$h͏_a => (globalThis = $h͏_a)]],["is",[$h͏_a => (is = $h͏_a)]],["isError",[$h͏_a => (isError = $h͏_a)]],["regexpSearch",[$h͏_a => (regexpSearch = $h͏_a)]],["stringEndsWith",[$h͏_a => (stringEndsWith = $h͏_a)]],["stringIndexOf",[$h͏_a => (stringIndexOf = $h͏_a)]],["stringSlice",[$h͏_a => (stringSlice = $h͏_a)]],["stringStartsWith",[$h͏_a => (stringStartsWith = $h͏_a)]],["weakmapDelete",[$h͏_a => (weakmapDelete = $h͏_a)]],["weakmapGet",[$h͏_a => (weakmapGet = $h͏_a)]],["weakmapHas",[$h͏_a => (weakmapHas = $h͏_a)]],["weakmapSet",[$h͏_a => (weakmapSet = $h͏_a)]],["AggregateError",[$h͏_a => (AggregateError = $h͏_a)]],["getOwnPropertyDescriptors",[$h͏_a => (getOwnPropertyDescriptors = $h͏_a)]],["ownKeys",[$h͏_a => (ownKeys = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["objectPrototype",[$h͏_a => (objectPrototype = $h͏_a)]],["hasOwn",[$h͏_a => (hasOwn = $h͏_a)]]]],["./stringify-utils.js", [["an",[$h͏_a => (an = $h͏_a)]],["bestEffortStringify",[$h͏_a => (bestEffortStringify = $h͏_a)]]]],["./types.js", []],["./internal-types.js", []],["./note-log-args.js", [["makeNoteLogArgsArrayKit",[$h͏_a => (makeNoteLogArgsArrayKit = $h͏_a)]]]]]);
















































/**
 * @import {BaseAssert, Assert, AssertionFunctions, AssertionUtilities, DeprecatedAssertionUtilities, Stringable, DetailsToken, MakeAssert} from '../../types.js';
 * @import {LogArgs, NoteCallback, LoggedErrorHandler} from './internal-types.js';
 */

// For internal debugging purposes, uncomment
// const internalDebugConsole = console;

// /////////////////////////////////////////////////////////////////////////////

/**
 * Maps the result of a `quote` or `bare` call back to its input value.
 *
 * @type {WeakMap<Stringable, any>}
 */
const declassifiers = new WeakMap();

/** @type {AssertionUtilities['quote']} */
const quote = (value, spaces = undefined) => {
  const result = freeze({
    toString: freeze(() => bestEffortStringify(value, spaces)),
  });
  weakmapSet(declassifiers, result, value);
  return result;
};$h͏_once.quote(quote);
freeze(quote);

const canBeBare = freezeRegexp(/^[\w:-]( ?[\w:-])*$/);

/**
 * @type {AssertionUtilities['bare']}
 */
const bare = (text, spaces = undefined) => {
  if (typeof text !== 'string' || regexpSearch(canBeBare, text) === -1) {
    return quote(text, spaces);
  }
  const result = freeze({
    toString: freeze(() => text),
  });
  weakmapSet(declassifiers, result, text);
  return result;
};$h͏_once.bare(bare);
freeze(bare);

// /////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {{ template: TemplateStringsArray | string[], args: any[] }} DetailsParts
 *
 * The contents of a `details` template literal tag: literal strings (always at
 * least one) and arbitrary substitution values from in between them.
 *
 * Unquoted substitution values are sensitive (and are redacted in error
 * `message` strings), so a DetailsPart must not leak outside of this file.
 */

/**
 * Maps the result of a `details` tagged template literal back to a record of
 * that template literal's contents.
 *
 * @type {WeakMap<DetailsToken, DetailsParts>}
 */
const hiddenDetailsMap = new WeakMap();

/**
 * Construct an error message string from `details` template literal contents,
 * replacing unquoted substitution values with redactions.
 *
 * @param {DetailsParts} hiddenDetails
 * @returns {string}
 */
const getMessageString = ({ template, args }) => {
  const parts = [template[0]];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    let argStr;
    if (weakmapHas(declassifiers, arg)) {
      argStr = `${arg}`;
    } else if (isError(arg)) {
      argStr = `(${an(arg.name)})`;
    } else {
      argStr = `(${an(typeof arg)})`;
    }
    arrayPush(parts, argStr, template[i + 1]);
  }
  return arrayJoin(parts, '');
};

/**
 * Define `toString` behavior for DetailsToken. To minimize the overhead of
 * creating new instances, we do this with an inherited `this`-sensitive method,
 * even though we normally avoid such sensitivity. To protect the method from
 * inappropriate application, it verifies that `this` is registered in
 * `redactedDetails` before doing interesting work.
 *
 * The behavior must not reveal anything redacted, so we use `getMessageString`
 * to return the same value as the message for a thrown assertion-failure error.
 */
const DetailsTokenProto = freeze({
  toString() {
    const hiddenDetails = weakmapGet(hiddenDetailsMap, this);
    if (hiddenDetails === undefined) {
      return '[Not a DetailsToken]';
    }
    return getMessageString(hiddenDetails);
  },
});
freeze(DetailsTokenProto.toString);

/**
 * Normally this is the function exported as `assert.details` and often
 * spelled `X`. However, if the `{errorTaming: 'unsafe'}` or
 * `{errorTaming: 'unsafe-debug'}` option is
 * given to `lockdown`, then `unredactedDetails` is used instead.
 *
 * There are some unconditional uses of `redactedDetails` in this module. All
 * of them should be uses where the template literal has no redacted (unquoted)
 * substitution values. In those cases, `redactedDetails` is equivalent to
 * `unredactedDetails`.
 *
 * @type {AssertionUtilities['details']}
 */
const redactedDetails = (template, ...args) => {
  // In case the result of this call is never used, perform as little processing
  // as possible here to keep things fast.
  const detailsToken = freeze({ __proto__: DetailsTokenProto });
  weakmapSet(hiddenDetailsMap, detailsToken, { template, args });
  return /** @type {DetailsToken} */ (/** @type {unknown} */ (detailsToken));
};$h͏_once.redactedDetails(redactedDetails);
freeze(redactedDetails);

/**
 * `unredactedDetails` is like `details` except that it does not redact
 * anything. It acts like `details` would act if all substitution values
 * were wrapped with the `quote` function above (the function normally
 * spelled `q`). If the `{errorTaming: 'unsafe'}`
 * or `{errorTaming: 'unsafe-debug'}` option is given to
 * `lockdown`, then the lockdown-shim arranges for the global `assert` to be
 * one whose `details` property is `unredactedDetails`.
 * This setting optimizes the debugging and testing experience at the price
 * of safety. `unredactedDetails` also sacrifices the speed of `details`,
 * which is usually fine in debugging and testing.
 *
 * @type {AssertionUtilities['details']}
 */
const unredactedDetails = (template, ...args) => {
  args = arrayMap(args, arg =>
    weakmapHas(declassifiers, arg) ? arg : quote(arg),
  );
  return redactedDetails(template, ...args);
};$h͏_once.unredactedDetails(unredactedDetails);
freeze(unredactedDetails);


/**
 * Get arguments suitable for a console logger function (e.g., `console.error`)
 * from `details` template literal contents, unquoting quoted substitution
 * values.
 *
 * @param {DetailsParts} hiddenDetails
 * @returns {LogArgs}
 */
const getLogArgs = ({ template, args }) => {
  const logArgs = [template[0]];
  for (let i = 0; i < args.length; i += 1) {
    let arg = args[i];
    if (weakmapHas(declassifiers, arg)) {
      arg = weakmapGet(declassifiers, arg);
    }
    // Remove substitution-adjacent spaces from template fixed-string parts
    // (since console logging inserts its own argument-separating spaces).
    const prevLiteralPart = arrayPop(logArgs) || '';
    const trimmedPrev = stringEndsWith(prevLiteralPart, ' ')
      ? stringSlice(prevLiteralPart, 0, -1)
      : prevLiteralPart;
    if (trimmedPrev !== '') {
      arrayPush(logArgs, trimmedPrev);
    }
    const nextLiteralPart = template[i + 1];
    const trimmedNext = stringStartsWith(nextLiteralPart, ' ')
      ? stringSlice(nextLiteralPart, 1)
      : nextLiteralPart;
    arrayPush(logArgs, arg, trimmedNext);
  }
  if (logArgs[logArgs.length - 1] === '') {
    arrayPop(logArgs);
  }
  return logArgs;
};

/**
 * Maps from an error object to arguments suitable for a privileged console
 * logger function such as `console.error`, including values that may be
 * redacted in the error's `message`.
 *
 * @type {WeakMap<Error, LogArgs>}
 */
const hiddenMessageLogArgs = new WeakMap();

// So each error tag will be unique.
let errorTagNum = 0;

/**
 * @type {WeakMap<Error, string>}
 */
const errorTags = new WeakMap();

/**
 * @param {Error} err
 * @param {string=} optErrorName
 * @returns {string}
 */
const tagError = (err, optErrorName = err.name) => {
  let errorTag = weakmapGet(errorTags, err);
  if (errorTag !== undefined) {
    return errorTag;
  }
  errorTagNum += 1;
  errorTag = `${optErrorName}#${errorTagNum}`;
  weakmapSet(errorTags, err, errorTag);
  return errorTag;
};

/**
 * Make reasonable best efforts to make a `Passable` error.
 *   - `sanitizeError` will remove any "extraneous" own properties already added
 *     by the host,
 *     such as `fileName`,`lineNumber` on FireFox or `line` on Safari.
 *   - If any such "extraneous" properties were removed, `sanitizeError` will
 *     annotate
 *     the error with them, so they still appear on the causal console
 *     log output for diagnostic purposes, but not be otherwise visible.
 *   - `sanitizeError` will ensure that any expected properties already
 *     added by the host are data
 *     properties, converting accessor properties to data properties as needed,
 *     such as `stack` on v8 (Chrome, Brave, Edge?)
 *   - `sanitizeError` will freeze the error, preventing any correct engine from
 *     adding or
 *     altering any of the error's own properties `sanitizeError` is done.
 *
 * However, `sanitizeError` will not, for example, `harden`
 * (i.e., deeply freeze)
 * or ensure that the `cause` or `errors` property satisfy the `Passable`
 * constraints. The purpose of `sanitizeError` is only to protect against
 * mischief the host may have already added to the error as created,
 * not to ensure that the error is actually Passable. For that,
 * see `toPassableError` in `@endo/pass-style`.
 *
 * @param {Error} error
 */
       const sanitizeError = error => {
  const descs = getOwnPropertyDescriptors(error);
  const {
    name: _nameDesc,
    message: _messageDesc,
    errors: _errorsDesc = undefined,
    cause: _causeDesc = undefined,
    stack: _stackDesc = undefined,
    ...restDescs
  } = descs;

  const restNames = ownKeys(restDescs);
  if (restNames.length >= 1) {
    for (const name of restNames) {
      delete error[name];
    }
    const dropped = create(objectPrototype, restDescs);
    const droppedDetails = redactedDetails`originally with properties ${quote(dropped)}`;
    // eslint-disable-next-line no-use-before-define
    note(error, droppedDetails);
  }
  for (const name of ownKeys(error)) {
    // @ts-expect-error TypeScript is still confused by symbols as property keys
    const desc = descs[name];
    if (desc && hasOwn(desc, 'get')) {
      const value = error[name]; // invokes the getter
      defineProperty(error, name, { value });
    }
  }
  freeze(error);
};

/**
 * @type {AssertionUtilities['makeError']}
 */$h͏_once.sanitizeError(sanitizeError);
const makeError = (
  optDetails = redactedDetails`Assert failed`,
  errConstructor = globalThis.Error,
  {
    errorName = undefined,
    cause = undefined,
    errors = undefined,
    sanitize = true,
  } = {},
) => {
  // Promote string-valued `optDetails` into a minimal DetailsParts
  // consisting of that string as the sole literal part with no substitutions.
  if (typeof optDetails === 'string') {
    optDetails = redactedDetails([optDetails]);
  }
  const hiddenDetails = weakmapGet(hiddenDetailsMap, optDetails);
  if (hiddenDetails === undefined) {
    throw TypeError(`unrecognized details ${quote(optDetails)}`);
  }
  const messageString = getMessageString(hiddenDetails);
  const opts = cause && { cause };
  let error;
  if (
    typeof AggregateError !== 'undefined' &&
    errConstructor === AggregateError
  ) {
    error = AggregateError(errors || [], messageString, opts);
  } else {
    const ErrorCtor = /** @type {ErrorConstructor} */ (errConstructor);
    error = ErrorCtor(messageString, opts);
    // Since we need to tolerate `errors` on an AggregateError, we may as well
    // tolerate it on all errors.
    if (errors !== undefined) {
      defineProperty(error, 'errors', {
        value: errors,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  }
  weakmapSet(hiddenMessageLogArgs, error, getLogArgs(hiddenDetails));
  if (errorName !== undefined) {
    tagError(error, errorName);
  }
  if (sanitize) {
    sanitizeError(error);
  }
  // The next line is a particularly fruitful place to put a breakpoint.
  return error;
};$h͏_once.makeError(makeError);
freeze(makeError);

// /////////////////////////////////////////////////////////////////////////////

const { addLogArgs: addNoteLogArgs, takeLogArgsArray: takeAllNoteLogArgs } =
  makeNoteLogArgsArrayKit();

/**
 * An augmented console will normally only take the hidden noteArgs array once,
 * when it logs the error being annotated. Once that happens, further
 * annotations of that error should go to the console immediately. We arrange
 * that by accepting a note-callback function from the console as an optional
 * part of that taking operation. Normally there will only be at most one
 * callback per error, but that depends on console behavior which we should not
 * assume. We make this an array of callbacks so multiple registrations
 * are independent.
 *
 * @type {WeakMap<Error, NoteCallback[]>}
 */
const hiddenNoteCallbacks = new WeakMap();

/** @type {AssertionUtilities['note']} */
const note = (error, detailsNote) => {
  // Promote string-valued `detailsNote` into a minimal DetailsParts consisting
  // of that string as the sole literal part with no substitutions.
  if (typeof detailsNote === 'string') {
    detailsNote = redactedDetails([detailsNote]);
  }
  const hiddenDetails = weakmapGet(hiddenDetailsMap, detailsNote);
  if (hiddenDetails === undefined) {
    throw TypeError(`unrecognized details ${quote(detailsNote)}`);
  }
  const logArgs = getLogArgs(hiddenDetails);
  const callbacks = weakmapGet(hiddenNoteCallbacks, error);
  if (callbacks !== undefined) {
    for (const callback of callbacks) {
      callback(error, logArgs);
    }
  } else {
    addNoteLogArgs(error, logArgs);
  }
};$h͏_once.note(note);
freeze(note);

/**
 * The unprivileged form that just uses the de facto `error.stack` property.
 * The start compartment normally has a privileged `globalThis.getStackString`
 * which should be preferred if present.
 *
 * @param {Error} error
 * @returns {string}
 */
const defaultGetStackString = error => {
  if (!('stack' in error)) {
    return '';
  }
  const stackString = `${error.stack}`;
  const pos = stringIndexOf(stackString, '\n');
  if (stringStartsWith(stackString, ' ') || pos === -1) {
    return stackString;
  }
  return stringSlice(stackString, pos + 1); // exclude the initial newline
};

/** @type {LoggedErrorHandler} */
const loggedErrorHandler = {
  getStackString: globalThis.getStackString || defaultGetStackString,
  tagError: error => tagError(error),
  resetErrorTagNum: () => {
    errorTagNum = 0;
  },
  getMessageLogArgs: error => weakmapGet(hiddenMessageLogArgs, error),
  takeMessageLogArgs: error => {
    const logArgs = weakmapGet(hiddenMessageLogArgs, error);
    weakmapDelete(hiddenMessageLogArgs, error);
    return logArgs;
  },
  takeNoteLogArgsArray: (error, callback) => {
    const logArgsArray = takeAllNoteLogArgs(error);
    if (callback !== undefined) {
      const callbacks = weakmapGet(hiddenNoteCallbacks, error);
      if (callbacks) {
        arrayPush(callbacks, callback);
      } else {
        weakmapSet(hiddenNoteCallbacks, error, [callback]);
      }
    }
    return logArgsArray || [];
  },
};$h͏_once.loggedErrorHandler(loggedErrorHandler);
freeze(loggedErrorHandler);


// /////////////////////////////////////////////////////////////////////////////

/**
 * @type {MakeAssert}
 */
       const makeAssert = (optRaise = undefined, unredacted = false) => {
  const details = unredacted ? unredactedDetails : redactedDetails;
  const assertFailedDetails = details`Check failed`;

  /** @type {AssertionFunctions['fail']} */
  const fail = (
    optDetails = assertFailedDetails,
    errConstructor = undefined,
    options = undefined,
  ) => {
    const reason = makeError(optDetails, errConstructor, options);
    if (optRaise !== undefined) {
      optRaise(reason);
    }
    throw reason;
  };
  freeze(fail);

  /** @type {AssertionUtilities['Fail']} */
  const Fail = (template, ...args) => fail(details(template, ...args));

  // Don't freeze or export `assert` until we add methods.
  /** @type {BaseAssert} */
  const assert = (
    condition,
    optDetails = undefined,
    errConstructor = undefined,
    options = undefined,
  ) => {
    condition || fail(optDetails, errConstructor, options);
  };

  /** @type {AssertionFunctions['equal']} */
  const equal = (
    actual,
    expected,
    optDetails = undefined,
    errConstructor = undefined,
    options = undefined,
  ) => {
    is(actual, expected) ||
      fail(
        optDetails || details`Expected ${actual} is same as ${expected}`,
        errConstructor || RangeError,
        options,
      );
  };
  freeze(equal);

  /** @type {AssertionFunctions['typeof']} */
  const assertTypeof = (specimen, typename, optDetails) => {
    // This will safely fall through if typename is not a string,
    // which is what we want.
    // eslint-disable-next-line valid-typeof
    if (typeof specimen === typename) {
      return;
    }
    typeof typename === 'string' || Fail`${quote(typename)} must be a string`;

    if (optDetails === undefined) {
      // Embed the type phrase without quotes.
      const typeWithDeterminer = an(typename);
      optDetails = details`${specimen} must be ${bare(typeWithDeterminer)}`;
    }
    fail(optDetails, TypeError);
  };
  freeze(assertTypeof);

  /** @type {AssertionFunctions['string']} */
  const assertString = (specimen, optDetails = undefined) =>
    assertTypeof(specimen, 'string', optDetails);

  /** @type {Pick<AssertionFunctions, keyof AssertionFunctions>} */
  const assertionFunctions = {
    equal,
    typeof: assertTypeof,
    string: assertString,
    fail,
  };

  /** @type {AssertionUtilities} */
  const assertionUtilities = {
    makeError,
    note,
    details,
    Fail,
    quote,
    bare,
  };

  /** @type {DeprecatedAssertionUtilities} */
  const deprecated = { error: makeError, makeAssert };

  /** @type {Assert} */
  const finishedAssert = assign(assert, {
    ...assertionFunctions,
    ...assertionUtilities,
    ...deprecated,
  });
  return freeze(finishedAssert);
};$h͏_once.makeAssert(makeAssert);
freeze(makeAssert);

/** @type {Assert} */
const assert = makeAssert();$h͏_once.assert(assert);


// Internal, to obviate polymorphic dispatch, but may become rigorously
// consistent with @endo/error:

/** @type {AssertionFunctions['equal']} */
const assertEqual = assert.equal;$h͏_once.assertEqual(assertEqual);
})()
,
// === 14. ses ./src/make-hardener.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let Set,String,TypeError,WeakSet,globalThis,apply,arrayForEach,defineProperty,freeze,getOwnPropertyDescriptor,getOwnPropertyDescriptors,getPrototypeOf,isInteger,isPrimitive,hasOwn,ownKeys,preventExtensions,setAdd,setForEach,setHas,toStringTagSymbol,typedArrayPrototype,weaksetAdd,weaksetHas,FERAL_STACK_GETTER,FERAL_STACK_SETTER,isError,assert;$h͏_imports([["./commons.js", [["Set",[$h͏_a => (Set = $h͏_a)]],["String",[$h͏_a => (String = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["WeakSet",[$h͏_a => (WeakSet = $h͏_a)]],["globalThis",[$h͏_a => (globalThis = $h͏_a)]],["apply",[$h͏_a => (apply = $h͏_a)]],["arrayForEach",[$h͏_a => (arrayForEach = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["getOwnPropertyDescriptor",[$h͏_a => (getOwnPropertyDescriptor = $h͏_a)]],["getOwnPropertyDescriptors",[$h͏_a => (getOwnPropertyDescriptors = $h͏_a)]],["getPrototypeOf",[$h͏_a => (getPrototypeOf = $h͏_a)]],["isInteger",[$h͏_a => (isInteger = $h͏_a)]],["isPrimitive",[$h͏_a => (isPrimitive = $h͏_a)]],["hasOwn",[$h͏_a => (hasOwn = $h͏_a)]],["ownKeys",[$h͏_a => (ownKeys = $h͏_a)]],["preventExtensions",[$h͏_a => (preventExtensions = $h͏_a)]],["setAdd",[$h͏_a => (setAdd = $h͏_a)]],["setForEach",[$h͏_a => (setForEach = $h͏_a)]],["setHas",[$h͏_a => (setHas = $h͏_a)]],["toStringTagSymbol",[$h͏_a => (toStringTagSymbol = $h͏_a)]],["typedArrayPrototype",[$h͏_a => (typedArrayPrototype = $h͏_a)]],["weaksetAdd",[$h͏_a => (weaksetAdd = $h͏_a)]],["weaksetHas",[$h͏_a => (weaksetHas = $h͏_a)]],["FERAL_STACK_GETTER",[$h͏_a => (FERAL_STACK_GETTER = $h͏_a)]],["FERAL_STACK_SETTER",[$h͏_a => (FERAL_STACK_SETTER = $h͏_a)]],["isError",[$h͏_a => (isError = $h͏_a)]]]],["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]]]]]);





















































/**
 * @import {Harden} from '../types.js'
 */

// Obtain the string tag accessor of of TypedArray so we can indirectly use the
// TypedArray brand check it employs.
const typedArrayToStringTag = getOwnPropertyDescriptor(
  typedArrayPrototype,
  toStringTagSymbol,
);
assert(typedArrayToStringTag);
const getTypedArrayToStringTag = typedArrayToStringTag.get;
assert(getTypedArrayToStringTag);

// Exported for tests.
/**
 * Duplicates packages/marshal/src/helpers/passStyle-helpers.js to avoid a dependency.
 *
 * @param {unknown} object
 */
       const isTypedArray = object => {
  // The object must pass a brand check or toStringTag will return undefined.
  const tag = apply(getTypedArrayToStringTag, object, []);
  return tag !== undefined;
};

/**
 * Tests if a property key is an integer-valued canonical numeric index.
 * https://tc39.es/ecma262/#sec-canonicalnumericindexstring
 *
 * @param {string | symbol} propertyKey
 */$h͏_once.isTypedArray(isTypedArray);
const isCanonicalIntegerIndexString = propertyKey => {
  const n = +String(propertyKey);
  return isInteger(n) && String(n) === propertyKey;
};

/**
 * @template T
 * @param {ArrayLike<T>} array
 */
const freezeTypedArray = array => {
  preventExtensions(array);

  // Downgrade writable expandos to readonly, even if non-configurable.
  // We get each descriptor individually rather than using
  // getOwnPropertyDescriptors in order to fail safe when encountering
  // an obscure GraalJS issue where getOwnPropertyDescriptor returns
  // undefined for a property that does exist.
  arrayForEach(ownKeys(array), (/** @type {string | symbol} */ name) => {
    const desc = getOwnPropertyDescriptor(array, name);
    assert(desc);
    // TypedArrays are integer-indexed exotic objects, which define special
    // treatment for property names in canonical numeric form:
    // integers in range are permanently writable and non-configurable.
    // https://tc39.es/ecma262/#sec-integer-indexed-exotic-objects
    //
    // This is analogous to the data of a hardened Map or Set,
    // so we carve out this exceptional behavior but make all other
    // properties non-configurable.
    if (!isCanonicalIntegerIndexString(name)) {
      defineProperty(array, name, {
        ...desc,
        writable: false,
        configurable: false,
      });
    }
  });
};

/**
 * Create a `harden` function.
 *
 * @returns {Harden}
 */
       const makeHardener = () => {
  // Use a native hardener if possible.
  if (typeof globalThis.harden === 'function') {
    const safeHarden = globalThis.harden;
    return safeHarden;
  }

  const hardened = new WeakSet();

  const { harden } = {
    /**
     * @template T
     * @param {T} root
     * @returns {T}
     */
    harden(root) {
      const toFreeze = new Set();

      // If val is something we should be freezing but aren't yet,
      // add it to toFreeze.
      /**
       * @param {any} val
       */
      function enqueue(val) {
        if (isPrimitive(val)) {
          // ignore primitives
          return;
        }
        const type = typeof val;
        if (type !== 'object' && type !== 'function') {
          // future proof: break until someone figures out what it should do
          throw TypeError(`Unexpected typeof: ${type}`);
        }
        if (weaksetHas(hardened, val) || setHas(toFreeze, val)) {
          // Ignore if this is an exit, or we've already visited it
          return;
        }
        // console.warn(`adding ${val} to toFreeze`, val);
        setAdd(toFreeze, val);
      }

      /**
       * @param {any} obj
       */
      const baseFreezeAndTraverse = obj => {
        // Now freeze the object to ensure reactive
        // objects such as proxies won't add properties
        // during traversal, before they get frozen.

        // Object are verified before being enqueued,
        // therefore this is a valid candidate.
        // Throws if this fails (strict mode).
        // Also throws if the object is an ArrayBuffer or any TypedArray.
        if (isTypedArray(obj)) {
          freezeTypedArray(obj);
        } else {
          freeze(obj);
        }

        // we rely upon certain commitments of Object.freeze and proxies here

        // get stable/immutable outbound links before a Proxy has a chance to do
        // something sneaky.
        const descs = getOwnPropertyDescriptors(obj);
        const proto = getPrototypeOf(obj);
        enqueue(proto);

        arrayForEach(ownKeys(descs), (/** @type {string | symbol} */ name) => {
          // The 'name' may be a symbol, and TypeScript doesn't like us to
          // index arbitrary symbols on objects, so we pretend they're just
          // strings.
          const desc = descs[/** @type {string} */ (name)];
          // getOwnPropertyDescriptors is guaranteed to return well-formed
          // descriptors, but they still inherit from Object.prototype. If
          // someone has poisoned Object.prototype to add 'value' or 'get'
          // properties, then a simple 'if ("value" in desc)' or 'desc.value'
          // test could be confused. We use hasOwnProperty to be sure about
          // whether 'value' is present or not, which tells us for sure that
          // this is a data property.
          if (hasOwn(desc, 'value')) {
            enqueue(desc.value);
          } else {
            enqueue(desc.get);
            enqueue(desc.set);
          }
        });
      };

      const freezeAndTraverse =
        FERAL_STACK_GETTER === undefined && FERAL_STACK_SETTER === undefined
          ? // On platforms without v8's error own stack accessor problem,
            // don't pay for any extra overhead.
            baseFreezeAndTraverse
          : obj => {
              if (isError(obj)) {
                // Only pay the overhead if it first passes this cheap isError
                // check. Otherwise, it will be unrepaired, but won't be judged
                // to be a passable error anyway, so will not be unsafe.
                const stackDesc = getOwnPropertyDescriptor(obj, 'stack');
                if (
                  stackDesc &&
                  stackDesc.get === FERAL_STACK_GETTER &&
                  stackDesc.configurable
                ) {
                  // Can only repair if it is configurable. Otherwise, leave
                  // unrepaired, in which case it will not be judged passable,
                  // avoiding a safety problem.
                  defineProperty(obj, 'stack', {
                    // NOTE: Calls getter during harden, which seems dangerous.
                    // But we're only calling the problematic getter whose
                    // hazards we think we understand.
                    // @ts-expect-error TS should know FERAL_STACK_GETTER
                    // cannot be `undefined` here.
                    // See https://github.com/endojs/endo/pull/2232#discussion_r1575179471
                    value: apply(FERAL_STACK_GETTER, obj, []),
                  });
                }
              }
              return baseFreezeAndTraverse(obj);
            };

      const dequeue = () => {
        // New values added before forEach() has finished will be visited.
        setForEach(toFreeze, freezeAndTraverse);
      };

      /** @param {any} value */
      const markHardened = value => {
        weaksetAdd(hardened, value);
      };

      const commit = () => {
        setForEach(toFreeze, markHardened);
      };

      enqueue(root);
      dequeue();
      // console.warn("toFreeze set:", toFreeze);
      commit();

      return root;
    },
  };

  return harden;
};$h͏_once.makeHardener(makeHardener);
})()
,
// === 15. ses ./src/cauterize-property.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let hasOwn;$h͏_imports([["./commons.js", [["hasOwn",[$h͏_a => (hasOwn = $h͏_a)]]]]]);

/**
 * @import {Reporter} from './reporting-types.js'
 */

/**
 * Delete `obj[prop]` or at least make it harmless.
 *
 * If the property was not expected, then emit a reporter-dependent warning
 * to bring attention to this case, so someone can determine what to do with it.
 *
 * If the property to be deleted is a function's `.prototype` property, this
 * will normally be because the function was supposed to be a
 * - builtin method or non-constructor function
 * - arrow function
 * - concise method
 *
 * all of whom are not supposed to have a `.prototype` property. Nevertheless,
 * on some platforms (like older versions of Hermes), or as a result of
 * some shim-based mods to the primordials (like core-js?), some of these
 * functions may accidentally be more like `function` functions with
 * an undeletable `.prototype` property. In these cases, if we can
 * set the value of that bogus `.prototype` property to `undefined`,
 * we do so, issuing a warning, rather than failing to initialize ses.
 *
 * @param {object} obj
 * @param {PropertyKey} prop
 * @param {boolean} known If deletion is expected, don't warn
 * @param {string} subPath Used for warning messages
 * @param {Reporter} reporter Where to issue warning or error.
 * @returns {void}
 */
       const cauterizeProperty = (
  obj,
  prop,
  known,
  subPath,
  { warn, error },
) => {
  // Either the object lacks a permit or the object doesn't match the
  // permit.
  // If the permit is specifically false, not merely undefined,
  // this is a property we expect to see because we know it exists in
  // some environments and we have expressly decided to exclude it.
  // Any other disallowed property is one we have not audited and we log
  // that we are removing it so we know to look into it, as happens when
  // the language evolves new features to existing intrinsics.
  if (!known) {
    warn(`Removing ${subPath}`);
  }
  try {
    delete obj[prop];
  } catch (err) {
    const reason = /** @type {string | object} */ (err);
    if (hasOwn(obj, prop)) {
      if (typeof obj === 'function' && prop === 'prototype') {
        obj.prototype = undefined;
        if (obj.prototype === undefined) {
          warn(`Tolerating undeletable ${subPath} === undefined`);
          return;
        }
      }
      error(`failed to delete ${subPath}`, reason);
    } else {
      error(`deleting ${subPath} threw`, reason);
    }
    throw err;
  }
};$h͏_once.cauterizeProperty(cauterizeProperty);
})()
,
// === 16. ses ./src/permits.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let arrayPush,arrayForEach;$h͏_imports([["./commons.js", [["arrayPush",[$h͏_a => (arrayPush = $h͏_a)]],["arrayForEach",[$h͏_a => (arrayForEach = $h͏_a)]]]]]);




/** @import {GenericErrorConstructor} from '../types.js' */

/**
 * Exports {@code permits}, a recursively defined
 * JSON record enumerating all intrinsics and their properties
 * according to ECMA specs.
 *
 * @author JF Paradis
 * @author Mark S. Miller
 *
 * @module
 */

/**
 * constantProperties
 * non-configurable, non-writable data properties of all global objects.
 * Must be powerless.
 * Maps from property name to the actual value
 */
       const constantProperties = {
  // *** Value Properties of the Global Object

  Infinity,
  NaN,
  undefined,
};

/**
 * universalPropertyNames
 * Properties of all global objects.
 * Must be powerless.
 * Maps from property name to the intrinsic name in the permits.
 */$h͏_once.constantProperties(constantProperties);
       const universalPropertyNames = {
  // *** Function Properties of the Global Object

  isFinite: 'isFinite',
  isNaN: 'isNaN',
  parseFloat: 'parseFloat',
  parseInt: 'parseInt',

  decodeURI: 'decodeURI',
  decodeURIComponent: 'decodeURIComponent',
  encodeURI: 'encodeURI',
  encodeURIComponent: 'encodeURIComponent',

  // *** Constructor Properties of the Global Object

  Array: 'Array',
  ArrayBuffer: 'ArrayBuffer',
  BigInt: 'BigInt',
  BigInt64Array: 'BigInt64Array',
  BigUint64Array: 'BigUint64Array',
  Boolean: 'Boolean',
  DataView: 'DataView',
  EvalError: 'EvalError',

  Int8Array: 'Int8Array',
  Int16Array: 'Int16Array',
  Int32Array: 'Int32Array',
  Map: 'Map',
  Number: 'Number',
  Object: 'Object',
  Promise: 'Promise',
  Proxy: 'Proxy',
  RangeError: 'RangeError',
  ReferenceError: 'ReferenceError',
  Set: 'Set',
  String: 'String',
  SyntaxError: 'SyntaxError',
  TypeError: 'TypeError',
  Uint8Array: 'Uint8Array',
  Uint8ClampedArray: 'Uint8ClampedArray',
  Uint16Array: 'Uint16Array',
  Uint32Array: 'Uint32Array',
  URIError: 'URIError',
  WeakMap: 'WeakMap',
  WeakSet: 'WeakSet',
  // https://github.com/tc39/proposal-iterator-helpers
  Iterator: 'Iterator',
  // https://github.com/tc39/proposal-async-iterator-helpers
  AsyncIterator: 'AsyncIterator',
  // https://github.com/endojs/endo/issues/550
  AggregateError: 'AggregateError',

  // https://github.com/tc39/proposal-explicit-resource-management
  // TODO DisposableStack, AsyncDisposableStack
  // DisposableStack: 'DisposableStack',
  // AsyncDisposableStack: 'AsyncDisposableStack',

  // https://tc39.es/proposal-shadowrealm/
  // TODO ShadowRealm
  // ShadowRealm: 'ShadowRealm',

  // *** Other Properties of the Global Object

  JSON: 'JSON',
  Reflect: 'Reflect',

  // *** Annex B

  escape: 'escape',
  unescape: 'unescape',

  // ESNext

  // https://github.com/tc39/proposal-source-phase-imports?tab=readme-ov-file#js-module-source
  ModuleSource: 'ModuleSource',

  lockdown: 'lockdown',
  harden: 'harden',

  HandledPromise: 'HandledPromise'  // TODO: Until Promise.delegate (see below).
};

/**
 * initialGlobalPropertyNames
 * Those found only on the initial global, i.e., the global of the
 * start compartment, as well as any compartments created before lockdown.
 * These may provide much of the power provided by the original.
 * Maps from property name to the intrinsic name in the permits.
 */$h͏_once.universalPropertyNames(universalPropertyNames);
       const initialGlobalPropertyNames = {
  // *** Constructor Properties of the Global Object

  Date: '%InitialDate%',
  Error: '%InitialError%',
  RegExp: '%InitialRegExp%',

  // Omit `Symbol`, because we want the original to appear on the
  // start compartment without passing through the permits mechanism, since
  // we want to preserve all its properties, even if we never heard of them.
  // Symbol: '%InitialSymbol%',

  // *** Other Properties of the Global Object

  Math: '%InitialMath%',
  Temporal: '%InitialTemporal%',

  // We move these from universalPropertyNames because the NaN side channel
  // means that they are not quite harmless.
  // We move them to initialGlobalPropertyNames so that they'll still be
  // included in the primordials, repaired, and hardened. Thus, they
  // can be endowed into compartments without hazard beyond the
  // NaN side channel.
  //
  // // https://github.com/tc39/proposal-float16array
  Float16Array: 'Float16Array',
  Float32Array: 'Float32Array',
  Float64Array: 'Float64Array',

  // ESNext

  // From Error-stack proposal
  // Only on initial global. No corresponding
  // powerless form for other globals.
  getStackString: '%InitialGetStackString%'

  // TODO https://github.com/Agoric/SES-shim/issues/551
  // Need initial WeakRef and FinalizationGroup in
  // start compartment only.

  // TODO Temporal
  // https://github.com/tc39/proposal-temporal
  // Temporal: '%InitialTemporal%' // with Temporal.Now
};

/**
 * sharedGlobalPropertyNames
 * Those found only on the globals of new compartments created after lockdown,
 * which must therefore be powerless.
 * Maps from property name to the intrinsic name in the permits.
 */$h͏_once.initialGlobalPropertyNames(initialGlobalPropertyNames);
       const sharedGlobalPropertyNames = {
  // *** Constructor Properties of the Global Object

  Date: '%SharedDate%',
  Error: '%SharedError%',
  RegExp: '%SharedRegExp%',
  Symbol: '%SharedSymbol%',

  // *** Other Properties of the Global Object

  Math: '%SharedMath%',
  Temporal: '%SharedTemporal%'

  // TODO Temporal
  // https://github.com/tc39/proposal-temporal
  // Temporal: '%SharedTemporal%' // without Temporal.Now
};

/**
 * uniqueGlobalPropertyNames
 * Those made separately for each global, including the initial global
 * of the start compartment.
 * Maps from property name to the intrinsic name in the permits
 * (which is currently always the same).
 */$h͏_once.sharedGlobalPropertyNames(sharedGlobalPropertyNames);
       const uniqueGlobalPropertyNames = {
  // *** Value Properties of the Global Object

  globalThis: '%UniqueGlobalThis%',

  // *** Function Properties of the Global Object

  eval: '%UniqueEval%',

  // *** Constructor Properties of the Global Object

  Function: '%UniqueFunction%',

  // *** Other Properties of the Global Object

  // ESNext

  Compartment: '%UniqueCompartment%'
  // According to current agreements, eventually the Realm constructor too.
  // 'Realm',
};

// All the "subclasses" of Error. These are collectively represented in the
// ECMAScript spec by the meta variable NativeError.
/** @type {GenericErrorConstructor[]} */$h͏_once.uniqueGlobalPropertyNames(uniqueGlobalPropertyNames);
const NativeErrors = [
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError
  // https://github.com/endojs/endo/issues/550
  // Commented out to accommodate platforms prior to AggregateError.
  // Instead, conditional push below.
  // AggregateError,
];$h͏_once.NativeErrors(NativeErrors);

if (typeof AggregateError !== 'undefined') {
  // Conditional, to accommodate platforms prior to AggregateError
  arrayPush(NativeErrors, AggregateError);
}



/**
 * <p>Each JSON record enumerates the disposition of the properties on
 *    some corresponding intrinsic object.
 *
 * <p>All records are made of key-value pairs where the key
 *    is the property to process, and the value is the associated
 *    dispositions a.k.a. the "permit". Those permits can be:
 * <ul>
 * <li>The boolean value "false", in which case this property is
 *     blacklisted and simply removed. Properties not mentioned
 *     are also considered blacklisted and are removed.
 * <li>A string value equal to a primitive ("number", "string", etc),
 *     in which case the property is permitted if its value property
 *     is typeof the given type. For example, {@code "Infinity"} leads to
 *     "number" and property values that fail {@code typeof "number"}.
 *     are removed.
 * <li>A string value equal to an intinsic name ("ObjectPrototype",
 *     "Array", etc), in which case the property permitted if its
 *     value property is equal to the value of the corresponfing
 *     intrinsics. For example, {@code Map.prototype} leads to
 *     "MapPrototype" and the property is removed if its value is
 *     not equal to %MapPrototype%
 * <li>Another record, in which case this property is simply
 *     permitted and that next record represents the disposition of
 *     the object which is its value. For example, {@code "Object"}
 *     leads to another record explaining what properties {@code
 *     "Object"} may have and how each such property should be treated.
 *
 * <p>Notes:
 * <li>"[[Proto]]" is used to refer to the "[[Prototype]]" internal
 *     slot, which says which object this object inherits from.
 * <li>"--proto--" is used to refer to the "__proto__" property name,
 *     which is the name of an accessor property on Object.prototype.
 *     In practice, it is used to access the [[Proto]] internal slot,
 *     but is distinct from the internal slot itself. We use
 *     "--proto--" rather than "__proto__" below because "__proto__"
 *     in an object literal is special syntax rather than a normal
 *     property definition.
 * <li>"ObjectPrototype" is the default "[[Proto]]" (when not specified).
 * <li>Constants "fn" and "getter" are used to keep the structure DRY.
 * <li>Symbol properties are listed as follow:
 *     <li>Well-known symbols use the "@@name" form.
 *     <li>Registered symbols use the "RegisteredSymbol(key)" form.
 *     <li>Unique symbols use the "UniqueSymbol(description)" form.
 */

// Function Instances
       const FunctionInstance = {
  '[[Proto]]': '%FunctionPrototype%',
  length: 'number',
  name: 'string'
  // Do not specify "prototype" here, since only Function instances that can
  // be used as a constructor have a prototype property. For constructors,
  // since prototype properties are instance-specific, we define it there.
};

// AsyncFunction Instances
$h͏_once.FunctionInstance(FunctionInstance);const AsyncFunctionInstance={
  // This property is not mentioned in ECMA 262, but is present in V8 and
  // necessary for lockdown to succeed.
  '[[Proto]]': '%AsyncFunctionPrototype%',
};

// Aliases
$h͏_once.AsyncFunctionInstance(AsyncFunctionInstance);const fn=FunctionInstance;
const asyncFn = AsyncFunctionInstance;

const getter = {
  get: fn,
  set: 'undefined',
};

// Possible but not encountered in the specs
// export const setter = {
//   get: 'undefined',
//   set: fn,
// };

const accessor = {
  get: fn,
  set: fn,
};

// eslint-disable-next-line func-names
const strict = function () {
  'use strict';
};

// TODO Remove this once we no longer support the Hermes that needed this.
arrayForEach(['caller', 'arguments'], prop => {
  try {
    strict[prop];
  } catch (e) {
    // https://github.com/facebook/hermes/blob/main/test/hermes/function-non-strict.js
    if (/** @type {Error} */ (e).message === 'Restricted in strict mode') {
      // Fixed in Static Hermes: https://github.com/facebook/hermes/issues/1582
      FunctionInstance[prop] = accessor;
    }
  }
});

       const isAccessorPermit = permit => {
  return permit === getter || permit === accessor;
};

// NativeError Object Structure
$h͏_once.isAccessorPermit(isAccessorPermit);function NativeError(prototype){
  return {
    // Properties of the NativeError Constructors
    '[[Proto]]': '%SharedError%',

    // NativeError.prototype
    prototype,
  };
}

function NativeErrorPrototype(constructor) {
  return {
    // Properties of the NativeError Prototype Objects
    '[[Proto]]': '%ErrorPrototype%',
    constructor,
    message: 'string',
    name: 'string',
    // Redundantly present only on v8. Safe to remove.
    toString: false,
    // Superfluously present in some versions of V8.
    // https://github.com/tc39/notes/blob/master/meetings/2021-10/oct-26.md#:~:text=However%2C%20Chrome%2093,and%20node%2016.11.
    cause: false,
  };
}

// The TypedArray Constructors
function TypedArray(prototype) {
  return {
    // Properties of the TypedArray Constructors
    '[[Proto]]': '%TypedArray%',
    BYTES_PER_ELEMENT: 'number',
    prototype,
  };
}

function TypedArrayPrototype(constructor) {
  return {
    // Properties of the TypedArray Prototype Objects
    '[[Proto]]': '%TypedArrayPrototype%',
    BYTES_PER_ELEMENT: 'number',
    constructor,
  };
}

// Without Math.random
const CommonMath = {
  E: 'number',
  LN10: 'number',
  LN2: 'number',
  LOG10E: 'number',
  LOG2E: 'number',
  PI: 'number',
  SQRT1_2: 'number',
  SQRT2: 'number',
  '@@toStringTag': 'string',
  abs: fn,
  acos: fn,
  acosh: fn,
  asin: fn,
  asinh: fn,
  atan: fn,
  atanh: fn,
  atan2: fn,
  cbrt: fn,
  ceil: fn,
  clz32: fn,
  cos: fn,
  cosh: fn,
  exp: fn,
  expm1: fn,
  floor: fn,
  fround: fn,
  hypot: fn,
  imul: fn,
  log: fn,
  log1p: fn,
  log10: fn,
  log2: fn,
  max: fn,
  min: fn,
  pow: fn,
  round: fn,
  sign: fn,
  sin: fn,
  sinh: fn,
  sqrt: fn,
  tan: fn,
  tanh: fn,
  trunc: fn,
  // https://github.com/tc39/proposal-float16array
  f16round: fn,
  // https://github.com/tc39/proposal-math-sum
  sumPrecise: fn,

  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  idiv: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  idivmod: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  imod: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  imuldiv: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  irem: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523
  mod: false,
  // See https://github.com/Moddable-OpenSource/moddable/issues/523#issuecomment-1942904505
  irandom: false,
};

       const permitted = {
  // ECMA https://tc39.es/ecma262

  // The intrinsics object has no prototype to avoid conflicts.
  '[[Proto]]': null,

  // %ThrowTypeError%
  '%ThrowTypeError%': fn,

  // *** The Global Object

  // *** Value Properties of the Global Object
  Infinity: 'number',
  NaN: 'number',
  undefined: 'undefined',

  // *** Function Properties of the Global Object

  // eval
  '%UniqueEval%': fn,
  isFinite: fn,
  isNaN: fn,
  parseFloat: fn,
  parseInt: fn,
  decodeURI: fn,
  decodeURIComponent: fn,
  encodeURI: fn,
  encodeURIComponent: fn,

  // *** Fundamental Objects

  Object: {
    // Properties of the Object Constructor
    '[[Proto]]': '%FunctionPrototype%',
    assign: fn,
    create: fn,
    defineProperties: fn,
    defineProperty: fn,
    entries: fn,
    freeze: fn,
    fromEntries: fn,
    getOwnPropertyDescriptor: fn,
    getOwnPropertyDescriptors: fn,
    getOwnPropertyNames: fn,
    getOwnPropertySymbols: fn,
    getPrototypeOf: fn,
    is: fn,
    isExtensible: fn,
    isFrozen: fn,
    isSealed: fn,
    keys: fn,
    preventExtensions: fn,
    prototype: '%ObjectPrototype%',
    seal: fn,
    setPrototypeOf: fn,
    values: fn,
    'RegisteredSymbol(harden)': {
      ...fn,
      // Installed with hardenTaming: 'unsafe'
      isFake: 'boolean',
    },
    // https://github.com/tc39/proposal-accessible-object-hasownproperty
    hasOwn: fn,
    // https://github.com/tc39/proposal-array-grouping
    groupBy: fn,
    // Seen on QuickJS
    __getClass: false,
  },

  '%ObjectPrototype%': {
    // Properties of the Object Prototype Object
    '[[Proto]]': null,
    constructor: 'Object',
    hasOwnProperty: fn,
    isPrototypeOf: fn,
    propertyIsEnumerable: fn,
    toLocaleString: fn,
    toString: fn,
    valueOf: fn,

    // Annex B: Additional Properties of the Object.prototype Object

    // See note in header about the difference between [[Proto]] and --proto--
    // special notations.
    '--proto--': accessor,
    __defineGetter__: fn,
    __defineSetter__: fn,
    __lookupGetter__: fn,
    __lookupSetter__: fn,
  },

  '%UniqueFunction%': {
    // Properties of the Function Constructor
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%FunctionPrototype%',
  },

  '%InertFunction%': {
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%FunctionPrototype%',
  },

  '%FunctionPrototype%': {
    apply: fn,
    bind: fn,
    call: fn,
    constructor: '%InertFunction%',
    toString: fn,
    '@@hasInstance': fn,
    // proposed but not yet std. To be removed if there
    caller: false,
    // proposed but not yet std. To be removed if there
    arguments: false,
    // Seen on QuickJS. TODO grab getter for use by console
    fileName: false,
    // Seen on QuickJS. TODO grab getter for use by console
    lineNumber: false,
  },

  Boolean: {
    // Properties of the Boolean Constructor
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%BooleanPrototype%',
  },

  '%BooleanPrototype%': {
    constructor: 'Boolean',
    toString: fn,
    valueOf: fn,
  },

  '%SharedSymbol%': {
    // Properties of the Symbol Constructor
    '[[Proto]]': '%FunctionPrototype%',
    asyncIterator: 'symbol',
    for: fn,
    hasInstance: 'symbol',
    isConcatSpreadable: 'symbol',
    iterator: 'symbol',
    keyFor: fn,
    match: 'symbol',
    matchAll: 'symbol',
    prototype: '%SymbolPrototype%',
    replace: 'symbol',
    search: 'symbol',
    species: 'symbol',
    split: 'symbol',
    toPrimitive: 'symbol',
    toStringTag: 'symbol',
    unscopables: 'symbol',
    // https://github.com/tc39/proposal-explicit-resource-management
    asyncDispose: 'symbol',
    // https://github.com/tc39/proposal-explicit-resource-management
    dispose: 'symbol',
    // Seen at core-js https://github.com/zloirock/core-js#ecmascript-symbol
    useSimple: false,
    // Seen at core-js https://github.com/zloirock/core-js#ecmascript-symbol
    useSetter: false,
    // Seen on QuickJS
    operatorSet: false,
  },

  '%SymbolPrototype%': {
    // Properties of the Symbol Prototype Object
    constructor: '%SharedSymbol%',
    description: getter,
    toString: fn,
    valueOf: fn,
    '@@toPrimitive': fn,
    '@@toStringTag': 'string',
  },

  '%InitialError%': {
    // Properties of the Error Constructor
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%ErrorPrototype%',
    // Non standard, v8 only, used by tap
    captureStackTrace: fn,
    // Non standard, v8 only, used by tap, tamed to accessor
    stackTraceLimit: accessor,
    // Non standard, v8 only, used by several, tamed to accessor
    prepareStackTrace: accessor,
    // https://github.com/tc39/proposal-is-error
    isError: fn,
  },

  '%SharedError%': {
    // Properties of the Error Constructor
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%ErrorPrototype%',
    // Non standard, v8 only, used by tap
    captureStackTrace: fn,
    // Non standard, v8 only, used by tap, tamed to accessor
    stackTraceLimit: accessor,
    // Non standard, v8 only, used by several, tamed to accessor
    prepareStackTrace: accessor,
    // https://github.com/tc39/proposal-is-error
    isError: fn,
  },

  '%ErrorPrototype%': {
    constructor: '%SharedError%',
    message: 'string',
    name: 'string',
    toString: fn,
    // proposed de-facto, assumed TODO
    // Seen on FF Nightly 88.0a1
    at: false,
    // Seen on FF and XS
    stack: accessor,
    // Superfluously present in some versions of V8.
    // https://github.com/tc39/notes/blob/master/meetings/2021-10/oct-26.md#:~:text=However%2C%20Chrome%2093,and%20node%2016.11.
    cause: false,
  },

  // NativeError

  EvalError: NativeError('%EvalErrorPrototype%'),
  RangeError: NativeError('%RangeErrorPrototype%'),
  ReferenceError: NativeError('%ReferenceErrorPrototype%'),
  SyntaxError: NativeError('%SyntaxErrorPrototype%'),
  TypeError: NativeError('%TypeErrorPrototype%'),
  URIError: NativeError('%URIErrorPrototype%'),
  // https://github.com/endojs/endo/issues/550
  AggregateError: NativeError('%AggregateErrorPrototype%'),

  // TODO SuppressedError
  // https://github.com/tc39/proposal-explicit-resource-management
  // SuppressedError: NativeError('%SuppressedErrorPrototype%'),

  '%EvalErrorPrototype%': NativeErrorPrototype('EvalError'),
  '%RangeErrorPrototype%': NativeErrorPrototype('RangeError'),
  '%ReferenceErrorPrototype%': NativeErrorPrototype('ReferenceError'),
  '%SyntaxErrorPrototype%': NativeErrorPrototype('SyntaxError'),
  '%TypeErrorPrototype%': NativeErrorPrototype('TypeError'),
  '%URIErrorPrototype%': NativeErrorPrototype('URIError'),
  // https://github.com/endojs/endo/issues/550
  '%AggregateErrorPrototype%': NativeErrorPrototype('AggregateError'),
  // TODO AggregateError .errors

  // TODO SuppressedError
  // https://github.com/tc39/proposal-explicit-resource-management
  // '%SuppressedErrorPrototype%': NativeErrorPrototype('SuppressedError'),
  // TODO SuppressedError .error
  // TODO SuppressedError .suppressed

  // *** Numbers and Dates

  Number: {
    // Properties of the Number Constructor
    '[[Proto]]': '%FunctionPrototype%',
    EPSILON: 'number',
    isFinite: fn,
    isInteger: fn,
    isNaN: fn,
    isSafeInteger: fn,
    MAX_SAFE_INTEGER: 'number',
    MAX_VALUE: 'number',
    MIN_SAFE_INTEGER: 'number',
    MIN_VALUE: 'number',
    NaN: 'number',
    NEGATIVE_INFINITY: 'number',
    parseFloat: fn,
    parseInt: fn,
    POSITIVE_INFINITY: 'number',
    prototype: '%NumberPrototype%',
  },

  '%NumberPrototype%': {
    // Properties of the Number Prototype Object
    constructor: 'Number',
    toExponential: fn,
    toFixed: fn,
    toLocaleString: fn,
    toPrecision: fn,
    toString: fn,
    valueOf: fn,
  },

  BigInt: {
    // Properties of the BigInt Constructor
    '[[Proto]]': '%FunctionPrototype%',
    asIntN: fn,
    asUintN: fn,
    prototype: '%BigIntPrototype%',
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    bitLength: false,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromArrayBuffer: false,
    // Seen on QuickJS
    tdiv: false,
    // Seen on QuickJS
    fdiv: false,
    // Seen on QuickJS
    cdiv: false,
    // Seen on QuickJS
    ediv: false,
    // Seen on QuickJS
    tdivrem: false,
    // Seen on QuickJS
    fdivrem: false,
    // Seen on QuickJS
    cdivrem: false,
    // Seen on QuickJS
    edivrem: false,
    // Seen on QuickJS
    sqrt: false,
    // Seen on QuickJS
    sqrtrem: false,
    // Seen on QuickJS
    floorLog2: false,
    // Seen on QuickJS
    ctz: false,
  },

  '%BigIntPrototype%': {
    constructor: 'BigInt',
    toLocaleString: fn,
    toString: fn,
    valueOf: fn,
    '@@toStringTag': 'string',
  },

  '%InitialMath%': {
    ...CommonMath,
    // `%InitialMath%.random()` has the standard unsafe behavior
    random: fn,
  },

  '%SharedMath%': {
    ...CommonMath,
    // `%SharedMath%.random()` is tamed to always throw
    random: fn,
  },

  '%InitialDate%': {
    // Properties of the Date Constructor
    '[[Proto]]': '%FunctionPrototype%',
    now: fn,
    parse: fn,
    prototype: '%DatePrototype%',
    UTC: fn,
  },

  '%SharedDate%': {
    // Properties of the Date Constructor
    '[[Proto]]': '%FunctionPrototype%',
    // `%SharedDate%.now()` is tamed to always throw
    now: fn,
    parse: fn,
    prototype: '%DatePrototype%',
    UTC: fn,
  },

  '%DatePrototype%': {
    constructor: '%SharedDate%',
    getDate: fn,
    getDay: fn,
    getFullYear: fn,
    getHours: fn,
    getMilliseconds: fn,
    getMinutes: fn,
    getMonth: fn,
    getSeconds: fn,
    getTime: fn,
    getTimezoneOffset: fn,
    getUTCDate: fn,
    getUTCDay: fn,
    getUTCFullYear: fn,
    getUTCHours: fn,
    getUTCMilliseconds: fn,
    getUTCMinutes: fn,
    getUTCMonth: fn,
    getUTCSeconds: fn,
    setDate: fn,
    setFullYear: fn,
    setHours: fn,
    setMilliseconds: fn,
    setMinutes: fn,
    setMonth: fn,
    setSeconds: fn,
    setTime: fn,
    setUTCDate: fn,
    setUTCFullYear: fn,
    setUTCHours: fn,
    setUTCMilliseconds: fn,
    setUTCMinutes: fn,
    setUTCMonth: fn,
    setUTCSeconds: fn,
    toDateString: fn,
    toISOString: fn,
    toJSON: fn,
    toLocaleDateString: fn,
    toLocaleString: fn,
    toLocaleTimeString: fn,
    toString: fn,
    toTimeString: fn,
    toUTCString: fn,
    valueOf: fn,
    '@@toPrimitive': fn,

    // Annex B: Additional Properties of the Date.prototype Object
    getYear: fn,
    setYear: fn,
    toGMTString: fn,

    toTemporalInstant: fn,
  },

  // Text Processing

  String: {
    // Properties of the String Constructor
    '[[Proto]]': '%FunctionPrototype%',
    fromCharCode: fn,
    fromCodePoint: fn,
    prototype: '%StringPrototype%',
    raw: fn,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromArrayBuffer: false,
  },

  '%StringPrototype%': {
    // Properties of the String Prototype Object
    length: 'number',
    charAt: fn,
    charCodeAt: fn,
    codePointAt: fn,
    concat: fn,
    constructor: 'String',
    endsWith: fn,
    includes: fn,
    indexOf: fn,
    lastIndexOf: fn,
    localeCompare: fn,
    match: fn,
    matchAll: fn,
    normalize: fn,
    padEnd: fn,
    padStart: fn,
    repeat: fn,
    replace: fn,
    replaceAll: fn, // ES2021
    search: fn,
    slice: fn,
    split: fn,
    startsWith: fn,
    substring: fn,
    toLocaleLowerCase: fn,
    toLocaleUpperCase: fn,
    toLowerCase: fn,
    toString: fn,
    toUpperCase: fn,
    trim: fn,
    trimEnd: fn,
    trimStart: fn,
    valueOf: fn,
    '@@iterator': fn,
    // Failed tc39 proposal
    // https://github.com/tc39/proposal-relative-indexing-method
    at: fn,
    // https://github.com/tc39/proposal-is-usv-string
    isWellFormed: fn,
    toWellFormed: fn,
    unicodeSets: fn,

    // Annex B: Additional Properties of the String.prototype Object
    substr: fn,
    anchor: fn,
    big: fn,
    blink: fn,
    bold: fn,
    fixed: fn,
    fontcolor: fn,
    fontsize: fn,
    italics: fn,
    link: fn,
    small: fn,
    strike: fn,
    sub: fn,
    sup: fn,
    trimLeft: fn,
    trimRight: fn,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    compare: false,
    // Seen on QuickJS
    __quote: false,
  },

  '%StringIteratorPrototype%': {
    '[[Proto]]': '%IteratorPrototype%',
    next: fn,
    '@@toStringTag': 'string',
  },

  '%InitialRegExp%': {
    // Properties of the RegExp Constructor
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%RegExpPrototype%',
    '@@species': getter,
    // https://github.com/tc39/proposal-regex-escaping
    escape: fn,

    // The https://github.com/tc39/proposal-regexp-legacy-features
    // are all optional, unsafe, and omitted
    input: false,
    $_: false,
    lastMatch: false,
    '$&': false,
    lastParen: false,
    '$+': false,
    leftContext: false,
    '$`': false,
    rightContext: false,
    "$'": false,
    $1: false,
    $2: false,
    $3: false,
    $4: false,
    $5: false,
    $6: false,
    $7: false,
    $8: false,
    $9: false,
  },

  '%SharedRegExp%': {
    // Properties of the RegExp Constructor
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%RegExpPrototype%',
    '@@species': getter,
    // https://github.com/tc39/proposal-regex-escaping
    escape: fn,
  },

  '%RegExpPrototype%': {
    // Properties of the RegExp Prototype Object
    constructor: '%SharedRegExp%',
    exec: fn,
    dotAll: getter,
    flags: getter,
    global: getter,
    hasIndices: getter,
    ignoreCase: getter,
    '@@match': fn,
    '@@matchAll': fn,
    multiline: getter,
    '@@replace': fn,
    '@@search': fn,
    source: getter,
    '@@split': fn,
    sticky: getter,
    test: fn,
    toString: fn,
    unicode: getter,
    unicodeSets: getter,

    // Annex B: Additional Properties of the RegExp.prototype Object
    compile: false  // UNSAFE and suppressed.
  },

  '%RegExpStringIteratorPrototype%': {
    // The %RegExpStringIteratorPrototype% Object
    '[[Proto]]': '%IteratorPrototype%',
    next: fn,
    '@@toStringTag': 'string',
  },

  // Indexed Collections

  Array: {
    // Properties of the Array Constructor
    '[[Proto]]': '%FunctionPrototype%',
    from: fn,
    isArray: fn,
    of: fn,
    prototype: '%ArrayPrototype%',
    '@@species': getter,

    // Failed tc39 proposal
    // https://tc39.es/proposal-relative-indexing-method/
    at: fn,
    // https://tc39.es/proposal-array-from-async/
    fromAsync: fn,
  },

  '%ArrayPrototype%': {
    // Properties of the Array Prototype Object
    length: 'number',
    concat: fn,
    constructor: 'Array',
    copyWithin: fn,
    entries: fn,
    every: fn,
    fill: fn,
    filter: fn,
    find: fn,
    findIndex: fn,
    flat: fn,
    flatMap: fn,
    forEach: fn,
    includes: fn,
    indexOf: fn,
    join: fn,
    keys: fn,
    lastIndexOf: fn,
    map: fn,
    pop: fn,
    push: fn,
    reduce: fn,
    reduceRight: fn,
    reverse: fn,
    shift: fn,
    slice: fn,
    some: fn,
    sort: fn,
    splice: fn,
    toLocaleString: fn,
    toString: fn,
    unshift: fn,
    values: fn,
    '@@iterator': fn,
    '@@unscopables': {
      '[[Proto]]': null,
      copyWithin: 'boolean',
      entries: 'boolean',
      fill: 'boolean',
      find: 'boolean',
      findIndex: 'boolean',
      flat: 'boolean',
      flatMap: 'boolean',
      includes: 'boolean',
      keys: 'boolean',
      values: 'boolean',
      // Failed tc39 proposal
      // https://tc39.es/proposal-relative-indexing-method/
      // Seen on FF Nightly 88.0a1
      at: 'boolean',
      // See https://github.com/tc39/proposal-array-find-from-last
      findLast: 'boolean',
      findLastIndex: 'boolean',
      // https://github.com/tc39/proposal-change-array-by-copy
      toReversed: 'boolean',
      toSorted: 'boolean',
      toSpliced: 'boolean',
      with: 'boolean',
      // https://github.com/tc39/proposal-array-grouping
      group: 'boolean',
      groupToMap: 'boolean',
      groupBy: 'boolean',
    },
    // See https://github.com/tc39/proposal-array-find-from-last
    findLast: fn,
    findLastIndex: fn,
    // https://github.com/tc39/proposal-change-array-by-copy
    toReversed: fn,
    toSorted: fn,
    toSpliced: fn,
    with: fn,
    // https://github.com/tc39/proposal-array-grouping
    group: fn, // Not in proposal? Where?
    groupToMap: fn, // Not in proposal? Where?
    groupBy: fn,
    // Failed tc39 proposal
    // https://tc39.es/proposal-relative-indexing-method/
    at: fn,
  },

  '%ArrayIteratorPrototype%': {
    // The %ArrayIteratorPrototype% Object
    '[[Proto]]': '%IteratorPrototype%',
    next: fn,
    '@@toStringTag': 'string',
  },

  // *** TypedArray Objects

  '%TypedArray%': {
    // Properties of the %TypedArray% Intrinsic Object
    '[[Proto]]': '%FunctionPrototype%',
    from: fn,
    of: fn,
    prototype: '%TypedArrayPrototype%',
    '@@species': getter,
  },

  '%TypedArrayPrototype%': {
    buffer: getter,
    byteLength: getter,
    byteOffset: getter,
    constructor: '%TypedArray%',
    copyWithin: fn,
    entries: fn,
    every: fn,
    fill: fn,
    filter: fn,
    find: fn,
    findIndex: fn,
    forEach: fn,
    includes: fn,
    indexOf: fn,
    join: fn,
    keys: fn,
    lastIndexOf: fn,
    length: getter,
    map: fn,
    reduce: fn,
    reduceRight: fn,
    reverse: fn,
    set: fn,
    slice: fn,
    some: fn,
    sort: fn,
    subarray: fn,
    toLocaleString: fn,
    toString: fn,
    values: fn,
    '@@iterator': fn,
    '@@toStringTag': getter,
    // Failed tc39 proposal
    // https://tc39.es/proposal-relative-indexing-method/
    at: fn,
    // See https://github.com/tc39/proposal-array-find-from-last
    findLast: fn,
    findLastIndex: fn,
    // https://github.com/tc39/proposal-change-array-by-copy
    toReversed: fn,
    toSorted: fn,
    with: fn,
  },

  // The TypedArray Constructors

  BigInt64Array: TypedArray('%BigInt64ArrayPrototype%'),
  BigUint64Array: TypedArray('%BigUint64ArrayPrototype%'),
  // https://github.com/tc39/proposal-float16array
  Float16Array: TypedArray('%Float16ArrayPrototype%'),
  Float32Array: TypedArray('%Float32ArrayPrototype%'),
  Float64Array: TypedArray('%Float64ArrayPrototype%'),
  Int16Array: TypedArray('%Int16ArrayPrototype%'),
  Int32Array: TypedArray('%Int32ArrayPrototype%'),
  Int8Array: TypedArray('%Int8ArrayPrototype%'),
  Uint16Array: TypedArray('%Uint16ArrayPrototype%'),
  Uint32Array: TypedArray('%Uint32ArrayPrototype%'),
  Uint8ClampedArray: TypedArray('%Uint8ClampedArrayPrototype%'),
  Uint8Array: {
    ...TypedArray('%Uint8ArrayPrototype%'),
    // https://github.com/tc39/proposal-arraybuffer-base64
    fromBase64: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    fromHex: fn,
  },

  '%BigInt64ArrayPrototype%': TypedArrayPrototype('BigInt64Array'),
  '%BigUint64ArrayPrototype%': TypedArrayPrototype('BigUint64Array'),
  // https://github.com/tc39/proposal-float16array
  '%Float16ArrayPrototype%': TypedArrayPrototype('Float16Array'),
  '%Float32ArrayPrototype%': TypedArrayPrototype('Float32Array'),
  '%Float64ArrayPrototype%': TypedArrayPrototype('Float64Array'),
  '%Int16ArrayPrototype%': TypedArrayPrototype('Int16Array'),
  '%Int32ArrayPrototype%': TypedArrayPrototype('Int32Array'),
  '%Int8ArrayPrototype%': TypedArrayPrototype('Int8Array'),
  '%Uint16ArrayPrototype%': TypedArrayPrototype('Uint16Array'),
  '%Uint32ArrayPrototype%': TypedArrayPrototype('Uint32Array'),
  '%Uint8ClampedArrayPrototype%': TypedArrayPrototype('Uint8ClampedArray'),
  '%Uint8ArrayPrototype%': {
    ...TypedArrayPrototype('Uint8Array'),
    // https://github.com/tc39/proposal-arraybuffer-base64
    setFromBase64: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    setFromHex: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    toBase64: fn,
    // https://github.com/tc39/proposal-arraybuffer-base64
    toHex: fn,
  },

  // *** Keyed Collections

  Map: {
    // Properties of the Map Constructor
    '[[Proto]]': '%FunctionPrototype%',
    '@@species': getter,
    prototype: '%MapPrototype%',
    // https://github.com/tc39/proposal-array-grouping
    groupBy: fn,
  },

  '%MapPrototype%': {
    clear: fn,
    constructor: 'Map',
    delete: fn,
    entries: fn,
    forEach: fn,
    get: fn,
    getOrInsert: fn,
    getOrInsertComputed: fn,
    has: fn,
    keys: fn,
    set: fn,
    size: getter,
    values: fn,
    '@@iterator': fn,
    '@@toStringTag': 'string',
  },

  '%MapIteratorPrototype%': {
    // The %MapIteratorPrototype% Object
    '[[Proto]]': '%IteratorPrototype%',
    next: fn,
    '@@toStringTag': 'string',
  },

  Set: {
    // Properties of the Set Constructor
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%SetPrototype%',
    '@@species': getter,
    // Seen on QuickJS
    groupBy: false,
  },

  '%SetPrototype%': {
    add: fn,
    clear: fn,
    constructor: 'Set',
    delete: fn,
    entries: fn,
    forEach: fn,
    has: fn,
    keys: fn,
    size: getter,
    values: fn,
    '@@iterator': fn,
    '@@toStringTag': 'string',
    // See https://github.com/tc39/proposal-set-methods
    intersection: fn,
    // See https://github.com/tc39/proposal-set-methods
    union: fn,
    // See https://github.com/tc39/proposal-set-methods
    difference: fn,
    // See https://github.com/tc39/proposal-set-methods
    symmetricDifference: fn,
    // See https://github.com/tc39/proposal-set-methods
    isSubsetOf: fn,
    // See https://github.com/tc39/proposal-set-methods
    isSupersetOf: fn,
    // See https://github.com/tc39/proposal-set-methods
    isDisjointFrom: fn,
  },

  '%SetIteratorPrototype%': {
    // The %SetIteratorPrototype% Object
    '[[Proto]]': '%IteratorPrototype%',
    next: fn,
    '@@toStringTag': 'string',
  },

  WeakMap: {
    // Properties of the WeakMap Constructor
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%WeakMapPrototype%',
  },

  '%WeakMapPrototype%': {
    constructor: 'WeakMap',
    delete: fn,
    get: fn,
    getOrInsert: fn,
    getOrInsertComputed: fn,
    has: fn,
    set: fn,
    '@@toStringTag': 'string',
  },

  WeakSet: {
    // Properties of the WeakSet Constructor
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%WeakSetPrototype%',
  },

  '%WeakSetPrototype%': {
    add: fn,
    constructor: 'WeakSet',
    delete: fn,
    has: fn,
    '@@toStringTag': 'string',
  },

  // *** Structured Data

  ArrayBuffer: {
    // Properties of the ArrayBuffer Constructor
    '[[Proto]]': '%FunctionPrototype%',
    isView: fn,
    prototype: '%ArrayBufferPrototype%',
    '@@species': getter,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromString: false,
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    fromBigInt: false,
  },

  '%ArrayBufferPrototype%': {
    byteLength: getter,
    constructor: 'ArrayBuffer',
    slice: fn,
    '@@toStringTag': 'string',
    // See https://github.com/Moddable-OpenSource/moddable/issues/523
    concat: false,
    // See https://github.com/tc39/proposal-resizablearraybuffer
    transfer: fn,
    resize: fn,
    resizable: getter,
    maxByteLength: getter,
    // https://github.com/tc39/proposal-arraybuffer-transfer
    transferToFixedLength: fn,
    detached: getter,
    // https://github.com/endojs/endo/pull/2309#issuecomment-2155513240
    // to be proposed
    transferToImmutable: fn,
    sliceToImmutable: fn,
    immutable: getter,
  },

  // If this exists, it is purely an artifact of how we currently shim
  // `transferToImmutable`. As natively implemented, there would be no
  // such extra prototype.
  '%ImmutableArrayBufferPrototype%': {
    '[[Proto]]': '%ArrayBufferPrototype%',
    byteLength: getter,
    slice: fn,
    // See https://github.com/endojs/endo/tree/master/packages/immutable-arraybuffer#purposeful-violation
    '@@toStringTag': 'string',
    // See https://github.com/tc39/proposal-resizablearraybuffer
    transfer: fn,
    resize: fn,
    resizable: getter,
    maxByteLength: getter,
    // https://github.com/tc39/proposal-arraybuffer-transfer
    transferToFixedLength: fn,
    detached: getter,
    // https://github.com/endojs/endo/pull/2309#issuecomment-2155513240
    // to be proposed
    transferToImmutable: fn,
    sliceToImmutable: fn,
    immutable: getter,
  },

  // SharedArrayBuffer Objects
  SharedArrayBuffer: false, // UNSAFE and purposely suppressed.
  '%SharedArrayBufferPrototype%': false, // UNSAFE and purposely suppressed.

  DataView: {
    // Properties of the DataView Constructor
    '[[Proto]]': '%FunctionPrototype%',
    BYTES_PER_ELEMENT: 'number', // Non std but undeletable on Safari.
    prototype: '%DataViewPrototype%',
  },

  '%DataViewPrototype%': {
    buffer: getter,
    byteLength: getter,
    byteOffset: getter,
    constructor: 'DataView',
    getBigInt64: fn,
    getBigUint64: fn,
    // https://github.com/tc39/proposal-float16array
    getFloat16: fn,
    getFloat32: fn,
    getFloat64: fn,
    getInt8: fn,
    getInt16: fn,
    getInt32: fn,
    getUint8: fn,
    getUint16: fn,
    getUint32: fn,
    setBigInt64: fn,
    setBigUint64: fn,
    // https://github.com/tc39/proposal-float16array
    setFloat16: fn,
    setFloat32: fn,
    setFloat64: fn,
    setInt8: fn,
    setInt16: fn,
    setInt32: fn,
    setUint8: fn,
    setUint16: fn,
    setUint32: fn,
    '@@toStringTag': 'string',
  },

  // Atomics
  Atomics: false, // UNSAFE and suppressed.

  JSON: {
    parse: fn,
    stringify: fn,
    '@@toStringTag': 'string',
    // https://github.com/tc39/proposal-json-parse-with-source/
    rawJSON: fn,
    isRawJSON: fn,
  },

  // *** Control Abstraction Objects

  // https://github.com/tc39/proposal-iterator-helpers
  Iterator: {
    // Properties of the Iterator Constructor
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%IteratorPrototype%',
    from: fn,
    // https://github.com/tc39/proposal-joint-iteration
    zip: fn,
    zipKeyed: fn,
    // https://github.com/tc39/proposal-iterator-sequencing
    concat: fn,
  },

  '%IteratorPrototype%': {
    // The %IteratorPrototype% Object
    '@@iterator': fn,
    // https://github.com/tc39/proposal-iterator-helpers
    constructor: 'Iterator',
    map: fn,
    filter: fn,
    take: fn,
    drop: fn,
    flatMap: fn,
    reduce: fn,
    toArray: fn,
    forEach: fn,
    some: fn,
    every: fn,
    find: fn,
    '@@toStringTag': 'string',
    // https://github.com/tc39/proposal-async-iterator-helpers
    toAsync: fn,
    // https://github.com/tc39/proposal-explicit-resource-management
    // See https://github.com/Moddable-OpenSource/moddable/issues/523#issuecomment-1942904505
    '@@dispose': false,
  },

  // https://github.com/tc39/proposal-iterator-helpers
  '%WrapForValidIteratorPrototype%': {
    '[[Proto]]': '%IteratorPrototype%',
    next: fn,
    return: fn,
  },

  // https://github.com/tc39/proposal-iterator-helpers
  '%IteratorHelperPrototype%': {
    '[[Proto]]': '%IteratorPrototype%',
    next: fn,
    return: fn,
    '@@toStringTag': 'string',
  },

  // https://github.com/tc39/proposal-async-iterator-helpers
  AsyncIterator: {
    // Properties of the Iterator Constructor
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%AsyncIteratorPrototype%',
    from: fn,
  },

  '%AsyncIteratorPrototype%': {
    // The %AsyncIteratorPrototype% Object
    '@@asyncIterator': fn,
    // https://github.com/tc39/proposal-async-iterator-helpers
    constructor: 'AsyncIterator',
    map: fn,
    filter: fn,
    take: fn,
    drop: fn,
    flatMap: fn,
    reduce: fn,
    toArray: fn,
    forEach: fn,
    some: fn,
    every: fn,
    find: fn,
    '@@toStringTag': 'string',
    // https://github.com/tc39/proposal-explicit-resource-management
    // See https://github.com/Moddable-OpenSource/moddable/issues/523#issuecomment-1942904505
    '@@asyncDispose': false,
  },

  // https://github.com/tc39/proposal-async-iterator-helpers
  '%WrapForValidAsyncIteratorPrototype%': {
    '[[Proto]]': '%AsyncIteratorPrototype%',
    next: fn,
    return: fn,
  },

  // https://github.com/tc39/proposal-async-iterator-helpers
  '%AsyncIteratorHelperPrototype%': {
    '[[Proto]]': '%AsyncIteratorPrototype%',
    next: fn,
    return: fn,
    '@@toStringTag': 'string',
  },

  '%InertGeneratorFunction%': {
    // Properties of the GeneratorFunction Constructor
    '[[Proto]]': '%InertFunction%',
    prototype: '%Generator%',
  },

  '%Generator%': {
    // Properties of the GeneratorFunction Prototype Object
    '[[Proto]]': '%FunctionPrototype%',
    constructor: '%InertGeneratorFunction%',
    prototype: '%GeneratorPrototype%',
    '@@toStringTag': 'string',
  },

  '%InertAsyncGeneratorFunction%': {
    // Properties of the AsyncGeneratorFunction Constructor
    '[[Proto]]': '%InertFunction%',
    prototype: '%AsyncGenerator%',
  },

  '%AsyncGenerator%': {
    // Properties of the AsyncGeneratorFunction Prototype Object
    '[[Proto]]': '%FunctionPrototype%',
    constructor: '%InertAsyncGeneratorFunction%',
    prototype: '%AsyncGeneratorPrototype%',
    // length prop added here for React Native jsc-android
    // https://github.com/endojs/endo/issues/660
    // https://github.com/react-native-community/jsc-android-buildscripts/issues/181
    length: 'number',
    '@@toStringTag': 'string',
  },

  '%GeneratorPrototype%': {
    // Properties of the Generator Prototype Object
    '[[Proto]]': '%IteratorPrototype%',
    constructor: '%Generator%',
    next: fn,
    return: fn,
    throw: fn,
    '@@toStringTag': 'string',
  },

  '%AsyncGeneratorPrototype%': {
    // Properties of the AsyncGenerator Prototype Object
    '[[Proto]]': '%AsyncIteratorPrototype%',
    constructor: '%AsyncGenerator%',
    next: fn,
    return: fn,
    throw: fn,
    '@@toStringTag': 'string',
  },

  // TODO: To be replaced with Promise.delegate
  //
  // The HandledPromise global variable shimmed by `@agoric/eventual-send/shim`
  // implements an initial version of the eventual send specification at:
  // https://github.com/tc39/proposal-eventual-send
  //
  // We will likely change this to add a property to Promise called
  // Promise.delegate and put static methods on it, which will necessitate
  // another permits change to update to the current proposed standard.
  HandledPromise: {
    '[[Proto]]': 'Promise',
    applyFunction: fn,
    applyFunctionSendOnly: fn,
    applyMethod: fn,
    applyMethodSendOnly: fn,
    get: fn,
    getSendOnly: fn,
    prototype: '%PromisePrototype%',
    resolve: fn,
  },

  // https://github.com/tc39/proposal-source-phase-imports?tab=readme-ov-file#js-module-source

  ModuleSource: {
    '[[Proto]]': '%AbstractModuleSource%',
    prototype: '%ModuleSourcePrototype%',
  },

  '%ModuleSourcePrototype%': {
    '[[Proto]]': '%AbstractModuleSourcePrototype%',
    constructor: 'ModuleSource',
    '@@toStringTag': 'string',
    // https://github.com/tc39/proposal-compartments
    bindings: getter,
    needsImport: getter,
    needsImportMeta: getter,
    // @endo/module-source provides a legacy interface
    imports: getter,
    exports: getter,
    reexports: getter,
  },

  '%AbstractModuleSource%': {
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%AbstractModuleSourcePrototype%',
  },

  '%AbstractModuleSourcePrototype%': {
    constructor: '%AbstractModuleSource%',
  },

  Promise: {
    // Properties of the Promise Constructor
    '[[Proto]]': '%FunctionPrototype%',
    all: fn,
    allSettled: fn,
    // https://github.com/Agoric/SES-shim/issues/550
    any: fn,
    prototype: '%PromisePrototype%',
    race: fn,
    reject: fn,
    resolve: fn,
    // https://github.com/tc39/proposal-promise-with-resolvers
    withResolvers: fn,
    '@@species': getter,
    // https://github.com/tc39/proposal-promise-try
    try: fn,
  },

  '%PromisePrototype%': {
    // Properties of the Promise Prototype Object
    catch: fn,
    constructor: 'Promise',
    finally: fn,
    then: fn,
    '@@toStringTag': 'string',
    // Non-standard, used in node to prevent async_hooks from breaking
    'UniqueSymbol(async_id_symbol)': accessor,
    'UniqueSymbol(trigger_async_id_symbol)': accessor,
    'UniqueSymbol(destroyed)': accessor,
  },

  '%InertAsyncFunction%': {
    // Properties of the AsyncFunction Constructor
    '[[Proto]]': '%InertFunction%',
    prototype: '%AsyncFunctionPrototype%',
  },

  '%AsyncFunctionPrototype%': {
    // Properties of the AsyncFunction Prototype Object
    '[[Proto]]': '%FunctionPrototype%',
    constructor: '%InertAsyncFunction%',
    // length prop added here for React Native jsc-android
    // https://github.com/endojs/endo/issues/660
    // https://github.com/react-native-community/jsc-android-buildscripts/issues/181
    length: 'number',
    '@@toStringTag': 'string',
  },

  // Reflection

  Reflect: {
    // The Reflect Object
    // Not a function object.
    apply: fn,
    construct: fn,
    defineProperty: fn,
    deleteProperty: fn,
    get: fn,
    getOwnPropertyDescriptor: fn,
    getPrototypeOf: fn,
    has: fn,
    isExtensible: fn,
    ownKeys: fn,
    preventExtensions: fn,
    set: fn,
    setPrototypeOf: fn,
    '@@toStringTag': 'string',
  },

  Proxy: {
    // Properties of the Proxy Constructor
    '[[Proto]]': '%FunctionPrototype%',
    revocable: fn,
  },

  '%Temporal.PlainDatePrototype%': {
    constructor: '%Temporal.PlainDate%',
    era: accessor,
    eraYear: accessor,
    calendarId: accessor,
    year: accessor,
    month: accessor,
    monthCode: accessor,
    day: accessor,
    dayOfWeek: accessor,
    dayOfYear: accessor,
    weekOfYear: accessor,
    yearOfWeek: accessor,
    daysInWeek: accessor,
    daysInMonth: accessor,
    daysInYear: accessor,
    monthsInYear: accessor,
    inLeapYear: accessor,
    toPlainYearMonth: fn,
    toPlainMonthDay: fn,
    add: fn,
    subtract: fn,
    with: fn,
    withCalendar: fn,
    until: fn,
    since: fn,
    equals: fn,
    toPlainDateTime: fn,
    toZonedDateTime: fn,
    toString: fn,
    toLocaleString: fn,
    toJSON: fn,
    valueOf: fn,
    '@@toStringTag': 'string',
  },
  '%Temporal.PlainDate%': {
    '[[Proto]]': '%FunctionPrototype%',
    length: 'number',
    name: 'string',
    prototype: '%Temporal.PlainDatePrototype%',
    from: fn,
    compare: fn,
  },

  '%Temporal.PlainTimePrototype%': {
    constructor: '%Temporal.PlainTime%',
    hour: accessor,
    minute: accessor,
    second: accessor,
    millisecond: accessor,
    microsecond: accessor,
    nanosecond: accessor,
    add: fn,
    subtract: fn,
    with: fn,
    until: fn,
    since: fn,
    round: fn,
    equals: fn,
    toLocaleString: fn,
    toString: fn,
    toJSON: fn,
    valueOf: fn,
    '@@toStringTag': 'string',
  },
  '%Temporal.PlainTime%': {
    '[[Proto]]': '%FunctionPrototype%',
    length: 'number',
    name: 'string',
    prototype: '%Temporal.PlainTimePrototype%',
    from: fn,
    compare: fn,
  },

  '%Temporal.PlainDateTimePrototype%': {
    constructor: '%Temporal.PlainDateTime%',
    calendarId: accessor,
    era: accessor,
    eraYear: accessor,
    year: accessor,
    month: accessor,
    monthCode: accessor,
    day: accessor,
    hour: accessor,
    minute: accessor,
    second: accessor,
    millisecond: accessor,
    microsecond: accessor,
    nanosecond: accessor,
    dayOfWeek: accessor,
    dayOfYear: accessor,
    weekOfYear: accessor,
    yearOfWeek: accessor,
    daysInWeek: accessor,
    daysInMonth: accessor,
    daysInYear: accessor,
    monthsInYear: accessor,
    inLeapYear: accessor,
    with: fn,
    withCalendar: fn,
    withPlainTime: fn,
    add: fn,
    subtract: fn,
    until: fn,
    since: fn,
    round: fn,
    equals: fn,
    toLocaleString: fn,
    toJSON: fn,
    toString: fn,
    valueOf: fn,
    toZonedDateTime: fn,
    toPlainDate: fn,
    toPlainTime: fn,
    '@@toStringTag': 'string',
  },
  '%Temporal.PlainDateTime%': {
    '[[Proto]]': '%FunctionPrototype%',
    length: 'number',
    name: 'string',
    prototype: '%Temporal.PlainDateTimePrototype%',
    from: fn,
    compare: fn,
  },

  '%Temporal.ZonedDateTimePrototype%': {
    constructor: '%Temporal.ZonedDateTime%',
    timeZoneId: accessor,
    calendarId: accessor,
    era: accessor,
    eraYear: accessor,
    year: accessor,
    month: accessor,
    monthCode: accessor,
    day: accessor,
    hour: accessor,
    minute: accessor,
    second: accessor,
    millisecond: accessor,
    microsecond: accessor,
    nanosecond: accessor,
    epochMilliseconds: accessor,
    epochNanoseconds: accessor,
    dayOfWeek: accessor,
    dayOfYear: accessor,
    weekOfYear: accessor,
    yearOfWeek: accessor,
    hoursInDay: accessor,
    daysInWeek: accessor,
    daysInMonth: accessor,
    daysInYear: accessor,
    monthsInYear: accessor,
    inLeapYear: accessor,
    offsetNanoseconds: accessor,
    offset: accessor,
    with: fn,
    withCalendar: fn,
    withPlainTime: fn,
    withTimeZone: fn,
    add: fn,
    subtract: fn,
    until: fn,
    since: fn,
    round: fn,
    equals: fn,
    toLocaleString: fn,
    toString: fn,
    toJSON: fn,
    valueOf: fn,
    startOfDay: fn,
    getTimeZoneTransition: fn,
    toInstant: fn,
    toPlainDate: fn,
    toPlainTime: fn,
    toPlainDateTime: fn,
    '@@toStringTag': 'string',
  },
  '%Temporal.ZonedDateTime%': {
    '[[Proto]]': '%FunctionPrototype%',
    length: 'number',
    name: 'string',
    prototype: '%Temporal.ZonedDateTimePrototype%',
    from: fn,
    compare: fn,
  },

  '%Temporal.DurationPrototype%': {
    constructor: '%Temporal.Duration%',
    years: accessor,
    months: accessor,
    weeks: accessor,
    days: accessor,
    hours: accessor,
    minutes: accessor,
    seconds: accessor,
    milliseconds: accessor,
    microseconds: accessor,
    nanoseconds: accessor,
    sign: accessor,
    blank: accessor,
    with: fn,
    negated: fn,
    abs: fn,
    add: fn,
    subtract: fn,
    round: fn,
    total: fn,
    toLocaleString: fn,
    toString: fn,
    toJSON: fn,
    valueOf: fn,
    '@@toStringTag': 'string',
  },
  '%Temporal.Duration%': {
    '[[Proto]]': '%FunctionPrototype%',
    length: 'number',
    name: 'string',
    prototype: '%Temporal.DurationPrototype%',
    from: fn,
    compare: fn,
  },

  '%Temporal.InstantPrototype%': {
    constructor: '%Temporal.Instant%',
    epochMilliseconds: accessor,
    epochNanoseconds: accessor,
    add: fn,
    subtract: fn,
    until: fn,
    since: fn,
    round: fn,
    equals: fn,
    toLocaleString: fn,
    toString: fn,
    toJSON: fn,
    valueOf: fn,
    toZonedDateTimeISO: fn,
    '@@toStringTag': 'string',
  },
  '%Temporal.Instant%': {
    '[[Proto]]': '%FunctionPrototype%',
    length: 'number',
    name: 'string',
    prototype: '%Temporal.InstantPrototype%',
    from: fn,
    fromEpochMilliseconds: fn,
    fromEpochNanoseconds: fn,
    compare: fn,
  },

  '%Temporal.PlainYearMonthPrototype%': {
    constructor: '%Temporal.PlainYearMonth%',
    calendarId: accessor,
    era: accessor,
    eraYear: accessor,
    year: accessor,
    month: accessor,
    monthCode: accessor,
    daysInYear: accessor,
    daysInMonth: accessor,
    monthsInYear: accessor,
    inLeapYear: accessor,
    with: fn,
    add: fn,
    subtract: fn,
    until: fn,
    since: fn,
    equals: fn,
    toLocaleString: fn,
    toString: fn,
    toJSON: fn,
    valueOf: fn,
    toPlainDate: fn,
    '@@toStringTag': 'string',
  },
  '%Temporal.PlainYearMonth%': {
    '[[Proto]]': '%FunctionPrototype%',
    length: 'number',
    name: 'string',
    prototype: '%Temporal.PlainYearMonthPrototype%',
    from: fn,
    compare: fn,
  },

  '%Temporal.PlainMonthDayPrototype%': {
    constructor: '%Temporal.PlainMonthDay%',
    calendarId: accessor,
    monthCode: accessor,
    day: accessor,
    with: fn,
    equals: fn,
    toLocaleString: fn,
    toString: fn,
    toJSON: fn,
    valueOf: fn,
    toPlainDate: fn,
    '@@toStringTag': 'string',
  },
  '%Temporal.PlainMonthDay%': {
    '[[Proto]]': '%FunctionPrototype%',
    length: 'number',
    name: 'string',
    prototype: '%Temporal.PlainMonthDayPrototype%',
    from: fn,
  },

  '%Temporal.Now%': {
    instant: fn,
    timeZoneId: fn,
    plainDateTimeISO: fn,
    zonedDateTimeISO: fn,
    plainDateISO: fn,
    plainTimeISO: fn,
    '@@toStringTag': 'string',
  },

  '%InitialTemporal%': {
    Now: '%Temporal.Now%',
    PlainDate: '%Temporal.PlainDate%',
    PlainTime: '%Temporal.PlainTime%',
    PlainDateTime: '%Temporal.PlainDateTime%',
    ZonedDateTime: '%Temporal.ZonedDateTime%',
    Duration: '%Temporal.Duration%',
    Instant: '%Temporal.Instant%',
    PlainYearMonth: '%Temporal.PlainYearMonth%',
    PlainMonthDay: '%Temporal.PlainMonthDay%',
    '@@toStringTag': 'string',
  },
  '%SharedTemporal%': {
    PlainDate: '%Temporal.PlainDate%',
    PlainTime: '%Temporal.PlainTime%',
    PlainDateTime: '%Temporal.PlainDateTime%',
    ZonedDateTime: '%Temporal.ZonedDateTime%',
    Duration: '%Temporal.Duration%',
    Instant: '%Temporal.Instant%',
    PlainYearMonth: '%Temporal.PlainYearMonth%',
    PlainMonthDay: '%Temporal.PlainMonthDay%',
    '@@toStringTag': 'string',
  },

  // Appendix B

  // Annex B: Additional Properties of the Global Object

  escape: fn,
  unescape: fn,

  // Proposed

  '%UniqueCompartment%': {
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%CompartmentPrototype%',
    toString: fn,
  },

  '%InertCompartment%': {
    '[[Proto]]': '%FunctionPrototype%',
    prototype: '%CompartmentPrototype%',
    toString: fn,
  },

  '%CompartmentPrototype%': {
    constructor: '%InertCompartment%',
    evaluate: fn,
    globalThis: getter,
    name: getter,
    import: asyncFn,
    load: asyncFn,
    importNow: fn,
    module: fn,
    '@@toStringTag': 'string',
  },

  lockdown: fn,
  harden: { ...fn, isFake: 'boolean' },

  '%InitialGetStackString%': fn,
};$h͏_once.permitted(permitted);
})()
,
// === 17. ses ./src/intrinsics.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let cauterizeProperty,TypeError,WeakSet,arrayFilter,create,defineProperty,entries,freeze,getOwnPropertyDescriptor,getOwnPropertyDescriptors,globalThis,is,isPrimitive,hasOwn,values,weaksetHas,constantProperties,sharedGlobalPropertyNames,universalPropertyNames,permitted;$h͏_imports([["./cauterize-property.js", [["cauterizeProperty",[$h͏_a => (cauterizeProperty = $h͏_a)]]]],["./commons.js", [["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["WeakSet",[$h͏_a => (WeakSet = $h͏_a)]],["arrayFilter",[$h͏_a => (arrayFilter = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["entries",[$h͏_a => (entries = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["getOwnPropertyDescriptor",[$h͏_a => (getOwnPropertyDescriptor = $h͏_a)]],["getOwnPropertyDescriptors",[$h͏_a => (getOwnPropertyDescriptors = $h͏_a)]],["globalThis",[$h͏_a => (globalThis = $h͏_a)]],["is",[$h͏_a => (is = $h͏_a)]],["isPrimitive",[$h͏_a => (isPrimitive = $h͏_a)]],["hasOwn",[$h͏_a => (hasOwn = $h͏_a)]],["values",[$h͏_a => (values = $h͏_a)]],["weaksetHas",[$h͏_a => (weaksetHas = $h͏_a)]]]],["./permits.js", [["constantProperties",[$h͏_a => (constantProperties = $h͏_a)]],["sharedGlobalPropertyNames",[$h͏_a => (sharedGlobalPropertyNames = $h͏_a)]],["universalPropertyNames",[$h͏_a => (universalPropertyNames = $h͏_a)]],["permitted",[$h͏_a => (permitted = $h͏_a)]]]]]);

























/**
 * @import {Reporter} from './reporting-types.js'
 */

const isFunction = obj => typeof obj === 'function';

// Like defineProperty, but throws if it would modify an existing property.
// We use this to ensure that two conflicting attempts to define the same
// property throws, causing SES initialization to fail. Otherwise, a
// conflict between, for example, two of SES's internal permits might
// get masked as one overwrites the other. Accordingly, the thrown error
// complains of a "Conflicting definition".
function initProperty(obj, name, desc) {
  if (hasOwn(obj, name)) {
    const preDesc = getOwnPropertyDescriptor(obj, name);
    if (
      !preDesc ||
      !is(preDesc.value, desc.value) ||
      preDesc.get !== desc.get ||
      preDesc.set !== desc.set ||
      preDesc.writable !== desc.writable ||
      preDesc.enumerable !== desc.enumerable ||
      preDesc.configurable !== desc.configurable
    ) {
      throw TypeError(`Conflicting definitions of ${name}`);
    }
  }
  defineProperty(obj, name, desc);
}

// Like defineProperties, but throws if it would modify an existing property.
// This ensures that the intrinsics added to the intrinsics collector object
// graph do not overlap.
function initProperties(obj, descs) {
  for (const [name, desc] of entries(descs)) {
    initProperty(obj, name, desc);
  }
}

// sampleGlobals creates an intrinsics object, suitable for
// interinsicsCollector.addIntrinsics, from the named properties of a global
// object.
function sampleGlobals(globalObject, newPropertyNames) {
  const newIntrinsics = { __proto__: null };
  for (const [globalName, intrinsicName] of entries(newPropertyNames)) {
    if (hasOwn(globalObject, globalName)) {
      newIntrinsics[intrinsicName] = globalObject[globalName];
    }
  }
  return newIntrinsics;
}

/**
 * @param {Reporter} reporter
 */
       const makeIntrinsicsCollector = reporter => {
  /** @type {Record<any, any>} */
  const intrinsics = create(null);
  let pseudoNatives;

  const addIntrinsics = newIntrinsics => {
    initProperties(intrinsics, getOwnPropertyDescriptors(newIntrinsics));
  };
  freeze(addIntrinsics);

  // For each intrinsic, if it has a `.prototype` property, use the
  // permits to find out the intrinsic name for that prototype and add it
  // to the intrinsics.
  const completePrototypes = () => {
    for (const [name, intrinsic] of entries(intrinsics)) {
      if (isPrimitive(intrinsic)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (!hasOwn(intrinsic, 'prototype')) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const permit = permitted[name];
      if (typeof permit !== 'object') {
        throw TypeError(`Expected permit object at permits.${name}`);
      }
      const namePrototype = permit.prototype;
      if (!namePrototype) {
        cauterizeProperty(
          intrinsic,
          'prototype',
          false,
          `${name}.prototype`,
          reporter,
        );
        // eslint-disable-next-line no-continue
        continue;
      }
      if (
        typeof namePrototype !== 'string' ||
        !hasOwn(permitted, namePrototype)
      ) {
        throw TypeError(`Unrecognized ${name}.prototype permits entry`);
      }
      const intrinsicPrototype = intrinsic.prototype;
      if (hasOwn(intrinsics, namePrototype)) {
        if (intrinsics[namePrototype] !== intrinsicPrototype) {
          throw TypeError(`Conflicting bindings of ${namePrototype}`);
        }
        // eslint-disable-next-line no-continue
        continue;
      }
      intrinsics[namePrototype] = intrinsicPrototype;
    }
  };
  freeze(completePrototypes);

  const finalIntrinsics = () => {
    freeze(intrinsics);
    pseudoNatives = new WeakSet(arrayFilter(values(intrinsics), isFunction));
    return intrinsics;
  };
  freeze(finalIntrinsics);

  const isPseudoNative = obj => {
    if (!pseudoNatives) {
      throw TypeError(
        'isPseudoNative can only be called after finalIntrinsics',
      );
    }
    return weaksetHas(pseudoNatives, obj);
  };
  freeze(isPseudoNative);

  const intrinsicsCollector = {
    addIntrinsics,
    completePrototypes,
    finalIntrinsics,
    isPseudoNative,
  };
  freeze(intrinsicsCollector);

  addIntrinsics(constantProperties);
  addIntrinsics(sampleGlobals(globalThis, universalPropertyNames));

  return intrinsicsCollector;
};

/**
 * getGlobalIntrinsics()
 * Doesn't tame, delete, or modify anything. Samples globalObject to create an
 * intrinsics record containing only the permitted global variables, listed
 * by the intrinsic names appropriate for new globals, i.e., the globals of
 * newly constructed compartments.
 *
 * WARNING:
 * If run before lockdown, the returned intrinsics record will carry the
 * *original* unsafe (feral, untamed) bindings of these global variables.
 *
 * @param {object} globalObject
 * @param {Reporter} reporter
 */$h͏_once.makeIntrinsicsCollector(makeIntrinsicsCollector);
       const getGlobalIntrinsics = (globalObject, reporter) => {
  // TODO pass a proper reporter to `makeIntrinsicsCollector`
  const { addIntrinsics, finalIntrinsics } = makeIntrinsicsCollector(reporter);

  addIntrinsics(sampleGlobals(globalObject, sharedGlobalPropertyNames));

  return finalIntrinsics();
};$h͏_once.getGlobalIntrinsics(getGlobalIntrinsics);
})()
,
// === 18. ses ./src/permits-intrinsics.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let permitted,FunctionInstance,isAccessorPermit,Map,String,Symbol,TypeError,arrayFilter,arrayIncludes,arrayMap,entries,getOwnPropertyDescriptor,getPrototypeOf,isPrimitive,mapGet,hasOwn,ownKeys,symbolKeyFor,cauterizeProperty;$h͏_imports([["./permits.js", [["permitted",[$h͏_a => (permitted = $h͏_a)]],["FunctionInstance",[$h͏_a => (FunctionInstance = $h͏_a)]],["isAccessorPermit",[$h͏_a => (isAccessorPermit = $h͏_a)]]]],["./commons.js", [["Map",[$h͏_a => (Map = $h͏_a)]],["String",[$h͏_a => (String = $h͏_a)]],["Symbol",[$h͏_a => (Symbol = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["arrayFilter",[$h͏_a => (arrayFilter = $h͏_a)]],["arrayIncludes",[$h͏_a => (arrayIncludes = $h͏_a)]],["arrayMap",[$h͏_a => (arrayMap = $h͏_a)]],["entries",[$h͏_a => (entries = $h͏_a)]],["getOwnPropertyDescriptor",[$h͏_a => (getOwnPropertyDescriptor = $h͏_a)]],["getPrototypeOf",[$h͏_a => (getPrototypeOf = $h͏_a)]],["isPrimitive",[$h͏_a => (isPrimitive = $h͏_a)]],["mapGet",[$h͏_a => (mapGet = $h͏_a)]],["hasOwn",[$h͏_a => (hasOwn = $h͏_a)]],["ownKeys",[$h͏_a => (ownKeys = $h͏_a)]],["symbolKeyFor",[$h͏_a => (symbolKeyFor = $h͏_a)]]]],["./cauterize-property.js", [["cauterizeProperty",[$h͏_a => (cauterizeProperty = $h͏_a)]]]]]);
































































/**
 * @import {Reporter} from './reporting-types.js'
 */

/**
 * Removes all non-allowed properties found by recursively and
 * reflectively walking own property chains.
 *
 * @param {object} intrinsics
 * @param {(virtualizedNativeFunction: object) => void} markVirtualizedNativeFunction
 * @param {Reporter} reporter
 */
               function removeUnpermittedIntrinsics(
  intrinsics,
  markVirtualizedNativeFunction,
  reporter,
) {
  // These primitives are allowed for permits.
  const primitives = ['undefined', 'boolean', 'number', 'string', 'symbol'];

  // These symbols are allowed as well-known symbols
  const wellKnownSymbolNames = new Map(
    Symbol
      ? arrayMap(
          arrayFilter(
            entries(permitted['%SharedSymbol%']),
            ([name, permit]) =>
              permit === 'symbol' && typeof Symbol[name] === 'symbol',
          ),
          ([name]) => [Symbol[name], `@@${name}`],
        )
      : [],
  );

  /**
   * asStringPropertyName()
   *
   * @param {string} path
   * @param {string | symbol} prop
   */
  function asStringPropertyName(path, prop) {
    if (typeof prop === 'string') {
      return prop;
    }

    const wellKnownSymbol = mapGet(wellKnownSymbolNames, prop);

    if (typeof prop === 'symbol') {
      if (wellKnownSymbol) {
        return wellKnownSymbol;
      } else {
        const registeredKey = symbolKeyFor(prop);
        if (registeredKey !== undefined) {
          return `RegisteredSymbol(${registeredKey})`;
        } else {
          return `Unique${String(prop)}`;
        }
      }
    }

    throw TypeError(`Unexpected property name type ${path} ${prop}`);
  }

  /*
   * visitPrototype()
   * Validate the object's [[prototype]] against a permit.
   */
  function visitPrototype(path, obj, protoName) {
    if (isPrimitive(obj)) {
      throw TypeError(`Object expected: ${path}, ${String(obj)}, ${protoName}`);
    }
    const proto = getPrototypeOf(obj);

    // Null prototype.
    if (proto === null && protoName === null) {
      return;
    }

    // Assert: protoName, if provided, is a string.
    if (protoName !== undefined && typeof protoName !== 'string') {
      throw TypeError(`Malformed permit ${path}.__proto__`);
    }

    // If permit not specified, default to Object.prototype.
    if (proto === intrinsics[protoName || '%ObjectPrototype%']) {
      return;
    }

    // We can't clean [[Prototype]], therefore abort.
    throw TypeError(
      `Unexpected [[Prototype]] at ${path}.__proto__ (expected ${protoName || '%ObjectPrototype%'})`,
    );
  }

  /*
   * isAllowedPropertyValue()
   * enforce permit for a single property value.
   */
  function isAllowedPropertyValue(path, value, prop, permit) {
    if (typeof permit === 'object') {
      // eslint-disable-next-line no-use-before-define
      visitProperties(path, value, permit);
      // The property is allowed.
      return true;
    }

    if (permit === false) {
      // A boolan 'false' permit specifies the removal of a property.
      // We require a more specific permit instead of allowing 'true'.
      return false;
    }

    if (typeof permit === 'string') {
      // A string permit can have one of two meanings:

      if (arrayIncludes(primitives, permit)) {
        // The permit is the name of a primitive.

        if (prop === 'prototype' || prop === 'constructor') {
          throw new TypeError(`At ${path} expected intrinsic, not ${permit}`);
        }
        // eslint wants to compare typeof only to string literals
        // eslint-disable-next-line valid-typeof
        if (typeof value !== permit) {
          throw TypeError(`At ${path} expected ${permit} not ${typeof value}`);
        }
        return true;
      }

      if (hasOwn(intrinsics, permit)) {
        // the permit is the name of an intrinsic.
        if (value !== intrinsics[permit]) {
          throw TypeError(`Does not match permit for ${path}`);
        }
        return true;
      }
    }

    throw TypeError(
      `Unexpected property ${prop} with permit ${permit} at ${path}`,
    );
  }

  /*
   * isAllowedProperty()
   * Check whether a single property is allowed.
   */
  function isAllowedProperty(path, obj, prop, permit) {
    const desc = getOwnPropertyDescriptor(obj, prop);
    if (!desc) {
      throw TypeError(`Property ${prop} not found at ${path}`);
    }

    // Is this a value property?
    if (hasOwn(desc, 'value')) {
      if (isAccessorPermit(permit)) {
        throw TypeError(`Accessor expected at ${path}`);
      }
      return isAllowedPropertyValue(path, desc.value, prop, permit);
    }
    if (!isAccessorPermit(permit)) {
      throw TypeError(`Accessor not expected at ${path}`);
    }
    return (
      isAllowedPropertyValue(`${path}<get>`, desc.get, prop, permit.get) &&
      isAllowedPropertyValue(`${path}<set>`, desc.set, prop, permit.set)
    );
  }

  /*
   * getSubPermit()
   */
  function getSubPermit(obj, permit, prop) {
    const permitProp = prop === '__proto__' ? '--proto--' : prop;
    if (hasOwn(permit, permitProp)) {
      return permit[permitProp];
    }

    if (typeof obj === 'function') {
      if (hasOwn(FunctionInstance, permitProp)) {
        return FunctionInstance[permitProp];
      }
    }

    return undefined;
  }

  /*
   * visitProperties()
   * Visit all properties for a permit.
   */
  function visitProperties(path, obj, permit) {
    if (obj === undefined || obj === null) {
      return;
    }

    const protoName = permit['[[Proto]]'];
    visitPrototype(path, obj, protoName);

    if (typeof obj === 'function') {
      markVirtualizedNativeFunction(obj);
    }

    for (const prop of ownKeys(obj)) {
      const propString = asStringPropertyName(path, prop);
      const subPath = `${path}.${propString}`;
      const subPermit = getSubPermit(obj, permit, propString);

      if (!subPermit || !isAllowedProperty(subPath, obj, prop, subPermit)) {
        cauterizeProperty(obj, prop, subPermit === false, subPath, reporter);
      }
    }
  }

  // Start path with 'intrinsics' to clarify that properties are not
  // removed from the global object by the permitting operation.
  visitProperties('intrinsics', intrinsics, permitted);
}$h͏_once.default(      removeUnpermittedIntrinsics);
})()
,
// === 19. ses ./src/tame-function-constructors.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let FERAL_FUNCTION,SyntaxError,TypeError,defineProperties,getPrototypeOf,setPrototypeOf,freeze,AsyncGeneratorFunctionInstance;$h͏_imports([["./commons.js", [["FERAL_FUNCTION",[$h͏_a => (FERAL_FUNCTION = $h͏_a)]],["SyntaxError",[$h͏_a => (SyntaxError = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["defineProperties",[$h͏_a => (defineProperties = $h͏_a)]],["getPrototypeOf",[$h͏_a => (getPrototypeOf = $h͏_a)]],["setPrototypeOf",[$h͏_a => (setPrototypeOf = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["AsyncGeneratorFunctionInstance",[$h͏_a => (AsyncGeneratorFunctionInstance = $h͏_a)]]]]]);










// This module replaces the original `Function` constructor, and the original
// `%GeneratorFunction%`, `%AsyncFunction%` and `%AsyncGeneratorFunction%`,
// with safe replacements that throw if invoked.
//
// These are all reachable via syntax, so it isn't sufficient to just
// replace global properties with safe versions. Our main goal is to prevent
// access to the `Function` constructor through these starting points.
//
// After modules block is done, the originals must no longer be reachable,
// unless a copy has been made, and functions can only be created by syntax
// (using eval) or by invoking a previously saved reference to the originals.
//
// Typically, this module will not be used directly, but via the
// [lockdown - shim] which handles all necessary repairs and taming in SES.
//
// Relation to ECMA specifications
//
// The taming of constructors really wants to be part of the standard, because
// new constructors may be added in the future, reachable from syntax, and this
// list must be updated to match.
//
// In addition, the standard needs to define four new intrinsics for the safe
// replacement functions. See [./permits-intrinsics.js].
//
// Adapted from SES/Caja
// Copyright (C) 2011 Google Inc.
// https://github.com/google/caja/blob/master/src/com/google/caja/ses/startSES.js
// https://github.com/google/caja/blob/master/src/com/google/caja/ses/repairES5.js

/**
 * tameFunctionConstructors()
 * This block replaces the original Function constructor, and the original
 * %GeneratorFunction% %AsyncFunction% and %AsyncGeneratorFunction%, with
 * safe replacements that throw if invoked.
 */
               function tameFunctionConstructors() {
  try {
    // Verify that the method is not callable.
    // eslint-disable-next-line @endo/no-polymorphic-call
    FERAL_FUNCTION.prototype.constructor('return 1');
  } catch (ignore) {
    // Throws, no need to patch.
    return freeze({});
  }

  const newIntrinsics = {};

  /*
   * The process to repair constructors:
   * 1. Create an instance of the function by evaluating syntax
   * 2. Obtain the prototype from the instance
   * 3. Create a substitute tamed constructor
   * 4. Replace the original constructor with the tamed constructor
   * 5. Replace tamed constructor prototype property with the original one
   * 6. Replace its [[Prototype]] slot with the tamed constructor of Function
   */
  function repairFunction(name, intrinsicName, declaration) {
    let FunctionInstance;
    try {
      // eslint-disable-next-line no-eval, no-restricted-globals
      FunctionInstance = (0, eval)(declaration);
    } catch (e) {
      if (e instanceof SyntaxError) {
        // Prevent failure on platforms where async and/or generators
        // are not supported.
        return;
      }
      // Re-throw
      throw e;
    }
    const FunctionPrototype = getPrototypeOf(FunctionInstance);

    // Prevents the evaluation of source when calling constructor on the
    // prototype of functions.
    // eslint-disable-next-line func-names
    const InertConstructor = function () {
      throw TypeError(
        'Function.prototype.constructor is not a valid constructor.',
      );
    };
    defineProperties(InertConstructor, {
      prototype: { value: FunctionPrototype },
      name: {
        value: name,
        writable: false,
        enumerable: false,
        configurable: true,
      },
    });

    defineProperties(FunctionPrototype, {
      constructor: { value: InertConstructor },
    });

    // Reconstructs the inheritance among the new tamed constructors
    // to mirror the original specified in normal JS.
    if (InertConstructor !== FERAL_FUNCTION.prototype.constructor) {
      setPrototypeOf(InertConstructor, FERAL_FUNCTION.prototype.constructor);
    }

    newIntrinsics[intrinsicName] = InertConstructor;
  }

  // Here, the order of operation is important: Function needs to be repaired
  // first since the other repaired constructors need to inherit from the
  // tamed Function function constructor.

  repairFunction('Function', '%InertFunction%', '(function(){})');
  repairFunction(
    'GeneratorFunction',
    '%InertGeneratorFunction%',
    '(function*(){})',
  );
  repairFunction(
    'AsyncFunction',
    '%InertAsyncFunction%',
    '(async function(){})',
  );

  if (AsyncGeneratorFunctionInstance !== undefined) {
    repairFunction(
      'AsyncGeneratorFunction',
      '%InertAsyncGeneratorFunction%',
      '(async function*(){})',
    );
  }

  return newIntrinsics;
}$h͏_once.default(      tameFunctionConstructors);
})()
,
// === 20. ses ./src/tame-date-constructor.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let Date,TypeError,apply,construct,defineProperties;$h͏_imports([["./commons.js", [["Date",[$h͏_a => (Date = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["apply",[$h͏_a => (apply = $h͏_a)]],["construct",[$h͏_a => (construct = $h͏_a)]],["defineProperties",[$h͏_a => (defineProperties = $h͏_a)]]]]]);









               function tameDateConstructor() {
  const OriginalDate = Date;
  const DatePrototype = OriginalDate.prototype;

  // Use concise methods to obtain named functions without constructors.
  const tamedMethods = {
    /**
     * `%SharedDate%.now()` throw a `TypeError` starting with "secure mode".
     * See https://github.com/endojs/endo/issues/910#issuecomment-1581855420
     */
    now() {
      throw TypeError('secure mode Calling %SharedDate%.now() throws');
    },
  };

  /**
   * Tame the Date constructor.
   * See https://github.com/endojs/endo/issues/910#issuecomment-1581855420
   *
   * Common behavior
   *   * `new Date(x)` coerces x into a number and then returns a Date
   *     for that number of millis since the epoch
   *   * `new Date(NaN)` returns a Date object which stringifies to
   *     'Invalid Date'
   *   * `new Date(undefined)` returns a Date object which stringifies to
   *     'Invalid Date'
   *
   * OriginalDate (normal standard) behavior preserved by
   * `%InitialDate%`.
   *   * `Date(anything)` gives a string with the current time
   *   * `new Date()` returns the current time, as a Date object
   *
   * `%SharedDate%` behavior
   *   * `Date(anything)` throws a TypeError starting with "secure mode"
   *   * `new Date()` throws a TypeError starting with "secure mode"
   *
   * @param {{powers?: string}} [opts]
   */
  const makeDateConstructor = ({ powers = 'none' } = {}) => {
    let ResultDate;
    if (powers === 'original') {
      // eslint-disable-next-line no-shadow
      ResultDate = function Date(...rest) {
        if (new.target === undefined) {
          return apply(OriginalDate, undefined, rest);
        }
        return construct(OriginalDate, rest, new.target);
      };
    } else {
      // eslint-disable-next-line no-shadow
      ResultDate = function Date(...rest) {
        if (new.target === undefined) {
          throw TypeError(
            'secure mode Calling %SharedDate% constructor as a function throws',
          );
        }
        if (rest.length === 0) {
          throw TypeError(
            'secure mode Calling new %SharedDate%() with no arguments throws',
          );
        }
        return construct(OriginalDate, rest, new.target);
      };
    }

    defineProperties(ResultDate, {
      length: { value: 7 },
      prototype: {
        value: DatePrototype,
        writable: false,
        enumerable: false,
        configurable: false,
      },
      parse: {
        value: OriginalDate.parse,
        writable: true,
        enumerable: false,
        configurable: true,
      },
      UTC: {
        value: OriginalDate.UTC,
        writable: true,
        enumerable: false,
        configurable: true,
      },
    });
    return ResultDate;
  };
  const InitialDate = makeDateConstructor({ powers: 'original' });
  const SharedDate = makeDateConstructor({ powers: 'none' });

  defineProperties(InitialDate, {
    now: {
      value: OriginalDate.now,
      writable: true,
      enumerable: false,
      configurable: true,
    },
  });
  defineProperties(SharedDate, {
    now: {
      value: tamedMethods.now,
      writable: true,
      enumerable: false,
      configurable: true,
    },
  });

  defineProperties(DatePrototype, {
    constructor: { value: SharedDate },
  });

  return {
    '%InitialDate%': InitialDate,
    '%SharedDate%': SharedDate,
  };
}$h͏_once.default(      tameDateConstructor);
})()
,
// === 21. ses ./src/tame-math-object.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let Math,TypeError,create,getOwnPropertyDescriptors,objectPrototype;$h͏_imports([["./commons.js", [["Math",[$h͏_a => (Math = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["getOwnPropertyDescriptors",[$h͏_a => (getOwnPropertyDescriptors = $h͏_a)]],["objectPrototype",[$h͏_a => (objectPrototype = $h͏_a)]]]]]);







               function tameMathObject() {
  const originalMath = Math;
  const initialMath = originalMath; // to follow the naming pattern

  const { random: _, ...otherDescriptors } =
    getOwnPropertyDescriptors(originalMath);

  // Use concise methods to obtain named functions without constructors.
  const tamedMethods = {
    /**
     * `%SharedMath%.random()` throws a TypeError starting with "secure mode".
     * See https://github.com/endojs/endo/issues/910#issuecomment-1581855420
     */
    random() {
      throw TypeError('secure mode %SharedMath%.random() throws');
    },
  };

  const sharedMath = create(objectPrototype, {
    ...otherDescriptors,
    random: {
      value: tamedMethods.random,
      writable: true,
      enumerable: false,
      configurable: true,
    },
  });

  return {
    '%InitialMath%': initialMath,
    '%SharedMath%': sharedMath,
  };
}$h͏_once.default(      tameMathObject);
})()
,
// === 22. ses ./src/tame-temporal-object.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let freeze,getOwnPropertyDescriptors,create,objectPrototype,getPrototypeOf,ownKeys,fromEntries,TypeError,arrayPush,Temporal,permitted;$h͏_imports([["./commons.js", [["freeze",[$h͏_a => (freeze = $h͏_a)]],["getOwnPropertyDescriptors",[$h͏_a => (getOwnPropertyDescriptors = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["objectPrototype",[$h͏_a => (objectPrototype = $h͏_a)]],["getPrototypeOf",[$h͏_a => (getPrototypeOf = $h͏_a)]],["ownKeys",[$h͏_a => (ownKeys = $h͏_a)]],["fromEntries",[$h͏_a => (fromEntries = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["arrayPush",[$h͏_a => (arrayPush = $h͏_a)]],["Temporal",[$h͏_a => (Temporal = $h͏_a)]]]],["./permits.js", [["permitted",[$h͏_a => (permitted = $h͏_a)]]]]]);














/**
 * Tame the `Temporal` namespace object.
 *
 * The `%InitialTemporal%` is indeed the original `Temporal` namespace
 * object, to remain present on the start compartment.
 *
 * The `%SharedTemporal%` is the safe shared `Temporal` namespace object,
 * to be endowed by default on the gloabl of all constructed compartments.
 * This differs only by the omission of `Temporal.Now`, which is the source of
 * the dynamic non-determinism of the ever-changing current time, and the
 * glacial dynamic non-determinism of current timezone and UTC offset (daylight
 * savings time).
 *
 * The remaining source of glacial dynamic non-determinism is locale
 * sensitivity, which `Temporal` provides only via `toLocaleString` methods.
 * This is handled by `tame-locale-methods.js` in the same way as all other
 * `*Locale*` methods.
 *
 * `tameTemporalObject` is modeletd on `tameMathObject` and `tameDateConstructor`
 */
const tameTemporalObject = () => {
  if (Temporal === undefined) {
    return {};
  }

  if (typeof Temporal !== 'object') {
    throw new TypeError(`unexpected typeof Temporal: ${typeof Temporal}`);
  }
  if (getPrototypeOf(Temporal) !== objectPrototype) {
    throw new TypeError(
      `unexpected Temporal __proto__: ${getPrototypeOf(Temporal)}`,
    );
  }

  const initialTemporal = Temporal;
  const { Now: _, ...otherDescriptors } =
    getOwnPropertyDescriptors(initialTemporal);
  const sharedTemporal = create(objectPrototype, otherDescriptors);

  const initialTemporalPermit = permitted['%InitialTemporal%'];
  const intrinsicEntries = [];
  for (const topName of ownKeys(Temporal)) {
    const topPermitName = initialTemporalPermit[topName];
    const topPermit = permitted[topPermitName];
    if (typeof topPermit === 'object') {
      const topVal = initialTemporal[topName];
      arrayPush(intrinsicEntries, [topPermitName, topVal]);
    }
  }

  const result = {
    ...fromEntries(intrinsicEntries),
    '%InitialTemporal%': initialTemporal,
    '%SharedTemporal%': sharedTemporal,
  };
  return result;
};
freeze(tameTemporalObject);

const{default:$c͏_default}={default:tameTemporalObject};$h͏_once.default($c͏_default);
})()
,
// === 23. ses ./src/tame-nan-sidechannel.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let RangeError,dataViewPrototype,MAX_SAFE_INTEGER,apply,defineProperty,entries,getOwnPropertyDescriptor,hasOwn,is,max,trunc,uncurryThis;$h͏_imports([["./commons.js", [["RangeError",[$h͏_a => (RangeError = $h͏_a)]],["dataViewPrototype",[$h͏_a => (dataViewPrototype = $h͏_a)]],["MAX_SAFE_INTEGER",[$h͏_a => (MAX_SAFE_INTEGER = $h͏_a)]],["apply",[$h͏_a => (apply = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["entries",[$h͏_a => (entries = $h͏_a)]],["getOwnPropertyDescriptor",[$h͏_a => (getOwnPropertyDescriptor = $h͏_a)]],["hasOwn",[$h͏_a => (hasOwn = $h͏_a)]],["is",[$h͏_a => (is = $h͏_a)]],["max",[$h͏_a => (max = $h͏_a)]],["trunc",[$h͏_a => (trunc = $h͏_a)]],["uncurryThis",[$h͏_a => (uncurryThis = $h͏_a)]]]]]);














/**
 * These `FERAL*` methods open up the NaN side-channel on some platforms,
 * like v8. Thus, we need to encapsulate them and replace them with wrappers
 * that canonicalize NaNs.
 */
const {
  setFloat16: FERAL_SET_FLOAT16,
  setFloat32: FERAL_SET_FLOAT32,
  setFloat64: FERAL_SET_FLOAT64,

  setUint16,
  setUint32,
  setBigUint64,
} = dataViewPrototype;

const dataViewGetBuffer = uncurryThis(
  // @ts-expect-error we know it is there on all conforming platforms
  getOwnPropertyDescriptor(dataViewPrototype, 'buffer').get,
);

/**
 * See https://webidl.spec.whatwg.org/#js-unrestricted-double which implies
 * that this is the canonical NaN for web standards.
 * Casual googling strongly suggests that this is also the cosmWasm
 * canonical NaN. But I have not yet found an authoritative page stating this.
 *
 * As noted there, WebIDL choses this value because
 * > The `NaN` value ... is chosen simply because it is the quiet NaN
 * > with the lowest value when its bit pattern is interpreted as an 64-bit
 * > unsigned integer.
 *
 * See https://github.com/endojs/endo/pull/3214#discussion_r3155852021
 */
const canonicalNaN64Encoding = 0x7ff8_0000_0000_0000n;

/**
 * As of this writing (April 29, 2026) all implementations agree that a
 * ***literal*** `NaN` seems to encode in 32 bits as `0x7fc00000`.
 * See https://github.com/endojs/endo/pull/3214#discussion_r3162974396
 *
 * Applying WebIDL's rationale for the 64 bit float
 * > The `NaN` value ... is chosen simply because it is the quiet NaN
 * > with the lowest value when its bit pattern is interpreted as an 64-bit
 * > unsigned integer.
 *
 * to the 32 bit case agrees with the choice the implementations make
 * for the 32 bit encoding of a ***literal*** `NaN`.
 *
 * See https://github.com/endojs/endo/pull/3214#discussion_r3155852021
 */
const canonicalNaN32Encoding = 0x7fc0_0000;

/**
 * As of this writing (April 29, 2026) all implementations that implement
 * float16 (with the almost surely unintentional exception of QuickJS),
 * agree that a ***literal*** `NaN` seems to encode in 16 bits as `0x7e00`.
 * See https://github.com/endojs/endo/pull/3214#discussion_r3162974396
 *
 * Applying WebIDL's rationale for the 64 bit float
 * > The `NaN` value ... is chosen simply because it is the quiet NaN
 * > with the lowest value when its bit pattern is interpreted as an 64-bit
 * > unsigned integer.
 *
 * to the 16 bit case agrees with the choice those implementations make
 * for the 16 bit encoding of a ***literal*** `NaN`.
 *
 * See https://github.com/endojs/endo/pull/3214#discussion_r3155852021
 */
const canonicalNaN16Encoding = 0x7e00;

/**
 * Perform `RequireInternalSlot(obj, [[DataView]])` as needed in
 * SetViewValue.
 * https://tc39.es/ecma262/multipage/structured-data.html#sec-setviewvalue
 * https://tc39.es/ecma262/#sec-get-dataview.prototype.buffer
 *
 * @param {unknown} obj
 * @returns {void}
 */
const requireDataView = obj => {
  dataViewGetBuffer(obj);
};

/**
 * Emulate the internal `ToIndex` from
 * https://tc39.es/ecma262/multipage/abstract-operations.html#sec-toindex
 *
 * @param {unknown} v
 * @returns {number}
 */
const toIndex = v => {
  // @ts-expect-error Math.trunc uses the internal `ToNumber` to coerce its
  // argument, whatever it is, to an integer number.
  const n = trunc(v);
  if (n === 0 || is(n, NaN)) {
    return 0;
  }
  if (n < 0 || n > MAX_SAFE_INTEGER) {
    throw RangeError('Invalid offset');
  }
  return n;
};

/**
 * Expose the internal `ToNumber` from
 * https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tonumber
 * We can't just use `Number(value)` because that is backed by `ToNumeric`,
 * which coerces bigint output from `ToPrimitive` rather than throwing a
 * TypeError as required of `ToNumber` (e.g., `Number({ valueOf: () => 42n })`
 * returns 42).
 *
 * @param {unknown} v
 * @returns {number}
 */
const toNumber = v =>
  // @ts-expect-error Math.max uses the internal `ToNumber` to coerce its
  // argument, whatever it is, to a number.
  max(v);

/**
 * Correctly guarding the `setFloat*` built-ins requires performing
 * `ToNumber(value)` ourselves, because a non-NaN value such as
 * `{ valueOf: () => {} }` gets coerced **to** NaN. But, according to
 * [SetViewValue](https://tc39.es/ecma262/multipage/structured-data.html#sec-setviewvalue),
 * we must first perform the observable
 * `RequireInternalSlot(view, [[DataView]])` and `ToIndex(requestIndex)` steps
 * (in that order). If those steps complete successfully, we have number-coerced
 * `byteOffset` and `value` values that will pass those same steps internal to
 * the implementation without incurring further observable interactions.
 *
 * We added these coercions to defend against an attack noticed by
 * https://github.com/deepview-autofix .
 * We were vulnerable to `value` being an
 * object with a `valueOf` method that returns a (bad) NaN, since it
 * would bypass the is NaN check. See where the
 * `tame-nan*-sidechannel.test.js test cases mention "coercion attack".
 *
 * Uses method shorthand syntax to be `this`-sensitive but not be constructable
 * nor have a `prototype` property.
 */
const methods = {
  /**
   * @param {number} byteOffset
   * @param {number} value
   * @param {boolean} [isLittleEndian]
   */
  setFloat16(byteOffset, value, isLittleEndian = undefined) {
    requireDataView(this);
    byteOffset = toIndex(byteOffset);
    value = toNumber(value);
    if (is(value, NaN)) {
      return apply(setUint16, this, [
        byteOffset,
        canonicalNaN16Encoding,
        isLittleEndian,
      ]);
    } else {
      return apply(FERAL_SET_FLOAT16, this, [
        byteOffset,
        value,
        isLittleEndian,
      ]);
    }
  },

  /**
   * @param {number} byteOffset
   * @param {number} value
   * @param {boolean} [isLittleEndian]
   */
  setFloat32(byteOffset, value, isLittleEndian = undefined) {
    requireDataView(this);
    byteOffset = toIndex(byteOffset);
    value = toNumber(value);
    if (is(value, NaN)) {
      return apply(setUint32, this, [
        byteOffset,
        canonicalNaN32Encoding,
        isLittleEndian,
      ]);
    } else {
      return apply(FERAL_SET_FLOAT32, this, [
        byteOffset,
        value,
        isLittleEndian,
      ]);
    }
  },

  /**
   * @param {number} byteOffset
   * @param {number} value
   * @param {boolean} [isLittleEndian]
   */
  setFloat64(byteOffset, value, isLittleEndian = undefined) {
    requireDataView(this);
    byteOffset = toIndex(byteOffset);
    value = toNumber(value);
    if (is(value, NaN)) {
      return apply(setBigUint64, this, [
        byteOffset,
        canonicalNaN64Encoding,
        isLittleEndian,
      ]);
    } else {
      return apply(FERAL_SET_FLOAT64, this, [
        byteOffset,
        value,
        isLittleEndian,
      ]);
    }
  },
};

/**
 * Replaces the dangerous `setFloat*` methods on `DataView.prototype`
 * with safe wrappers that first canonicalize NaNs before calling the
 * original hidden methods.
 * By itself, this does not make us safe against the NaN side channel.
 * Separately, we do not include the `Float*Array` constructors on the
 * list of universal safe globals. Thus, constructed compartments do not
 * get these by default.
 *
 * These replacement `setFloat*` methods canonicalize NaN, but they
 * do not canonicalize `-0` to `0`. If callers wish to do so, they should do
 * it themselves before calling these
 */
       const tameNaNSideChannel = () => {
  for (const [name, method] of entries(methods)) {
    if (hasOwn(dataViewPrototype, name)) {
      defineProperty(dataViewPrototype, name, {
        // Since we're redefining properties that already exist, by omitting the
        // other descriptor attributes here, they are unchanged.
        value: method,
      });
    }
  }
};$h͏_once.tameNaNSideChannel(tameNaNSideChannel);
})()
,
// === 24. ses ./src/tame-regexp-constructor.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let FERAL_REG_EXP,TypeError,construct,defineProperties,getOwnPropertyDescriptor,speciesSymbol;$h͏_imports([["./commons.js", [["FERAL_REG_EXP",[$h͏_a => (FERAL_REG_EXP = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["construct",[$h͏_a => (construct = $h͏_a)]],["defineProperties",[$h͏_a => (defineProperties = $h͏_a)]],["getOwnPropertyDescriptor",[$h͏_a => (getOwnPropertyDescriptor = $h͏_a)]],["speciesSymbol",[$h͏_a => (speciesSymbol = $h͏_a)]]]]]);








               function tameRegExpConstructor(regExpTaming = 'safe') {
  const RegExpPrototype = FERAL_REG_EXP.prototype;

  const makeRegExpConstructor = (_ = {}) => {
    // RegExp has non-writable static properties we need to omit.
    /**
     * @param  {Parameters<typeof FERAL_REG_EXP>} rest
     */
    const ResultRegExp = function RegExp(...rest) {
      if (new.target === undefined) {
        return FERAL_REG_EXP(...rest);
      }
      return construct(FERAL_REG_EXP, rest, new.target);
    };

    defineProperties(ResultRegExp, {
      length: { value: 2 },
      prototype: {
        value: RegExpPrototype,
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });
    // Hermes does not have `Symbol.species`. We should support such platforms.
    if (speciesSymbol) {
      const speciesDesc = getOwnPropertyDescriptor(
        FERAL_REG_EXP,
        speciesSymbol,
      );
      if (!speciesDesc) {
        throw TypeError('no RegExp[Symbol.species] descriptor');
      }
      defineProperties(ResultRegExp, {
        [speciesSymbol]: speciesDesc,
      });
    }
    return ResultRegExp;
  };

  const InitialRegExp = makeRegExpConstructor();
  const SharedRegExp = makeRegExpConstructor();

  if (regExpTaming !== 'unsafe') {
    // @ts-expect-error Deleted properties must be optional
    delete RegExpPrototype.compile;
  }
  defineProperties(RegExpPrototype, {
    constructor: { value: SharedRegExp },
  });

  return {
    '%InitialRegExp%': InitialRegExp,
    '%SharedRegExp%': SharedRegExp,
  };
}$h͏_once.default(      tameRegExpConstructor);
})()
,
// === 25. ses ./src/enablements.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let toStringTagSymbol,iteratorSymbol;$h͏_imports([["./commons.js", [["toStringTagSymbol",[$h͏_a => (toStringTagSymbol = $h͏_a)]],["iteratorSymbol",[$h͏_a => (iteratorSymbol = $h͏_a)]]]]]);

/**
 * Exports {@code enablements}, a recursively defined
 * JSON record defining the optimum set of intrinsics properties
 * that need to be "repaired" before hardening is applied on
 * enviromments subject to the override mistake.
 *
 * @author JF Paradis
 * @author Mark S. Miller
 *
 * @module
 */

/**
 * <p>Because "repairing" replaces data properties with accessors, every
 * time a repaired property is accessed, the associated getter is invoked,
 * which degrades the runtime performance of all code executing in the
 * repaired enviromment, compared to the non-repaired case. In order
 * to maintain performance, we only repair the properties of objects
 * for which hardening causes a breakage of their normal intended usage.
 *
 * There are three unwanted cases:
 * <ul>
 * <li>Overriding properties on objects typically used as records,
 *     namely {@code "Object"} and {@code "Array"}. In the case of arrays,
 *     the situation is unintentional, a given program might not be aware
 *     that non-numerical properties are stored on the underlying object
 *     instance, not on the array. When an object is typically used as a
 *     map, we repair all of its prototype properties.
 * <li>Overriding properties on objects that provide defaults on their
 *     prototype and that programs typically set using an assignment, such as
 *     {@code "Error.prototype.message"} and {@code "Function.prototype.name"}
 *     (both default to "").
 * <li>Setting-up a prototype chain, where a constructor is set to extend
 *     another one. This is typically set by assignment, for example
 *     {@code "Child.prototype.constructor = Child"}, instead of invoking
 *     Object.defineProperty();
 *
 * <p>Each JSON record enumerates the disposition of the properties on
 * some corresponding intrinsic object.
 *
 * <p>For each such record, the values associated with its property
 * names can be:
 * <ul>
 * <li>true, in which case this property is simply repaired. The
 *     value associated with that property is not traversed. For
 *     example, {@code "Function.prototype.name"} leads to true,
 *     meaning that the {@code "name"} property of {@code
 *     "Function.prototype"} should be repaired (which is needed
 *     when inheriting from @code{Function} and setting the subclass's
 *     {@code "prototype.name"} property). If the property is
 *     already an accessor property, it is not repaired (because
 *     accessors are not subject to the override mistake).
 * <li>"*", in which case this property is not repaired but the
 *     value associated with that property are traversed and repaired.
 * <li>Another record, in which case this property is not repaired
 *     and that next record represents the disposition of the object
 *     which is its value. For example,{@code "FunctionPrototype"}
 *     leads to another record explaining which properties {@code
 *     Function.prototype} need to be repaired.
 */

/**
 * Minimal enablements when all the code is modern and known not to
 * step into the override mistake, except for the following pervasive
 * cases.
 */
       const minEnablements = {
  '%ObjectPrototype%': {
    toString: true,
  },

  '%FunctionPrototype%': {
    toString: true  // set by "rollup"
  },

  '%ErrorPrototype%': {
    name: true  // set by "precond", "ava", "node-fetch"
  },

  '%IteratorPrototype%': {
    toString: true,
    // https://github.com/tc39/proposal-iterator-helpers
    constructor: true,
    // https://github.com/tc39/proposal-iterator-helpers
    [toStringTagSymbol]: true,
  },
};

/**
 * Moderate enablements are usually good enough for legacy compat.
 */$h͏_once.minEnablements(minEnablements);
       const moderateEnablements = {
  ...minEnablements,

  '%ObjectPrototype%': {
    ...minEnablements['%ObjectPrototype%'],
    valueOf: true,
  },

  // Function.prototype has no 'prototype' property to enable.
  // Function instances have their own 'name' and 'length' properties
  // which are configurable and non-writable. Thus, they are already
  // non-assignable anyway.
  '%FunctionPrototype%': {
    ...minEnablements['%FunctionPrototype%'],
    constructor: true, // set by "regenerator-runtime"
    bind: true  // set by "underscore", "express"
  },

  '%ErrorPrototype%': {
    ...minEnablements['%ErrorPrototype%'],
    constructor: true, // set by "fast-json-patch", "node-fetch"
    message: true,
    toString: true  // set by "bluebird"
  },

  '%IteratorPrototype%': {
    ...minEnablements['%IteratorPrototype%'],
    [iteratorSymbol]: true  // is sometimes used in custom iterators and generators implementations eg. @rive-app/canvas
  },

  '%ArrayPrototype%': {
    toString: true,
    push: true, // set by "Google Analytics"
    concat: true, // set by mobx generated code (old TS compiler?)
    [iteratorSymbol]: true  // set by mobx generated code (old TS compiler?)
  },

  '%TypeErrorPrototype%': {
    constructor: true, // set by "readable-stream"
    message: true, // set by "tape"
    name: true  // set by "readable-stream", "node 14"
  },

  '%SyntaxErrorPrototype%': {
    message: true, // to match TypeErrorPrototype.message
    name: true  // set by "node 14"
  },

  '%RangeErrorPrototype%': {
    message: true, // to match TypeErrorPrototype.message
    name: true  // set by "node 14"
  },

  '%URIErrorPrototype%': {
    message: true, // to match TypeErrorPrototype.message
    name: true  // set by "node 14"
  },

  '%EvalErrorPrototype%': {
    message: true, // to match TypeErrorPrototype.message
    name: true  // set by "node 14"
  },

  '%ReferenceErrorPrototype%': {
    message: true, // to match TypeErrorPrototype.message
    name: true  // set by "node 14"
  },

  // https://github.com/endojs/endo/issues/550
  '%AggregateErrorPrototype%': {
    message: true, // to match TypeErrorPrototype.message
    name: true  // set by "node 14"?
  },

  '%PromisePrototype%': {
    constructor: true  // set by "core-js"
  },

  '%TypedArrayPrototype%': '*', // set by https://github.com/feross/buffer

  '%Generator%': {
    constructor: true,
    name: true,
    toString: true,
  },
};

/**
 * The 'severe' enablement are needed because of issues tracked at
 * https://github.com/endojs/endo/issues/576
 *
 * They are like the `moderate` enablements except for the entries below.
 */$h͏_once.moderateEnablements(moderateEnablements);
       const severeEnablements = {
  ...moderateEnablements,

  /**
   * Rollup (as used at least by vega) and webpack
   * (as used at least by regenerator) both turn exports into assignments
   * to a big `exports` object that inherits directly from
   * `Object.prototype`. Some of the exported names we've seen include
   * `hasOwnProperty`, `constructor`, and `toString`. But the strategy used
   * by rollup and webpack potentionally turns any exported name
   * into an assignment rejected by the override mistake. That's why
   * the `severe` enablements takes the extreme step of enabling
   * everything on `Object.prototype`.
   *
   * In addition, code doing inheritance manually will often override
   * the `constructor` property on the new prototype by assignment. We've
   * seen this several times.
   *
   * The cost of enabling all these is that they create a miserable debugging
   * experience specifically on Node.
   * https://github.com/Agoric/agoric-sdk/issues/2324
   * explains how it confused the Node console.
   *
   * (TODO Reexamine the vscode situation. I think it may have improved
   * since the following paragraph was written.)
   *
   * The vscode debugger's object inspector shows the own data properties of
   * an object, which is typically what you want, but also shows both getter
   * and setter for every accessor property whether inherited or own.
   * With the `'*'` setting here, all the properties inherited from
   * `Object.prototype` are accessors, creating an unusable display as seen
   * at As explained at
   * https://github.com/endojs/endo/blob/master/packages/ses/docs/lockdown.md#overridetaming-options
   * Open the triangles at the bottom of that section.
   */
  '%ObjectPrototype%': '*',

  /**
   * The widely used Buffer defined at https://github.com/feross/buffer
   * on initialization, manually creates the equivalent of a subclass of
   * `TypedArray`, which it then initializes by assignment. These assignments
   * include enough of the `TypeArray` methods that here, the `severe`
   * enablements just enable them all.
   */
  '%TypedArrayPrototype%': '*',

  /**
   * Needed to work with Immer before https://github.com/immerjs/immer/pull/914
   * is accepted.
   */
  '%MapPrototype%': '*',

  /**
   * Needed to work with Immer before https://github.com/immerjs/immer/pull/914
   * is accepted.
   */
  '%SetPrototype%': '*',
};$h͏_once.severeEnablements(severeEnablements);
})()
,
// === 26. ses ./src/enable-property-overrides.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let Set,String,TypeError,arrayForEach,defineProperty,getOwnPropertyDescriptor,getOwnPropertyDescriptors,isPrimitive,hasOwn,ownKeys,setHas,minEnablements,moderateEnablements,severeEnablements;$h͏_imports([["./commons.js", [["Set",[$h͏_a => (Set = $h͏_a)]],["String",[$h͏_a => (String = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["arrayForEach",[$h͏_a => (arrayForEach = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["getOwnPropertyDescriptor",[$h͏_a => (getOwnPropertyDescriptor = $h͏_a)]],["getOwnPropertyDescriptors",[$h͏_a => (getOwnPropertyDescriptors = $h͏_a)]],["isPrimitive",[$h͏_a => (isPrimitive = $h͏_a)]],["hasOwn",[$h͏_a => (hasOwn = $h͏_a)]],["ownKeys",[$h͏_a => (ownKeys = $h͏_a)]],["setHas",[$h͏_a => (setHas = $h͏_a)]]]],["./enablements.js", [["minEnablements",[$h͏_a => (minEnablements = $h͏_a)]],["moderateEnablements",[$h͏_a => (moderateEnablements = $h͏_a)]],["severeEnablements",[$h͏_a => (severeEnablements = $h͏_a)]]]]]);
























/** @import {Reporter} from './reporting-types.js' */

/**
 * For a special set of properties defined in the `enablement` list,
 * `enablePropertyOverrides` ensures that the effect of freezing does not
 * suppress the ability to override these properties on derived objects by
 * simple assignment.
 *
 * Because of lack of sufficient foresight at the time, ES5 unfortunately
 * specified that a simple assignment to a non-existent property must fail if
 * it would override an non-writable data property of the same name in the
 * shadow of the prototype chain. In retrospect, this was a mistake, the
 * so-called "override mistake". But it is now too late and we must live with
 * the consequences.
 *
 * As a result, simply freezing an object to make it tamper proof has the
 * unfortunate side effect of breaking previously correct code that is
 * considered to have followed JS best practices, if this previous code used
 * assignment to override.
 *
 * For the enabled properties, `enablePropertyOverrides` effectively shims what
 * the assignment behavior would have been in the absence of the override
 * mistake. However, the shim produces an imperfect emulation. It shims the
 * behavior by turning these data properties into accessor properties, where
 * the accessor's getter and setter provide the desired behavior. For
 * non-reflective operations, the illusion is perfect. However, reflective
 * operations like `getOwnPropertyDescriptor` see the descriptor of an accessor
 * property rather than the descriptor of a data property. At the time of this
 * writing, this is the best we know how to do.
 *
 * To the getter of the accessor we add a property named
 * `'originalValue'` whose value is, as it says, the value that the
 * data property had before being converted to an accessor property. We add
 * this extra property to the getter for two reason:
 *
 * The harden algorithm walks the own properties reflectively, i.e., with
 * `getOwnPropertyDescriptor` semantics, rather than `[[Get]]` semantics. When
 * it sees an accessor property, it does not invoke the getter. Rather, it
 * proceeds to walk both the getter and setter as part of its transitive
 * traversal. Without this extra property, `enablePropertyOverrides` would have
 * hidden the original data property value from `harden`, which would be bad.
 * Instead, by exposing that value in an own data property on the getter,
 * `harden` finds and walks it anyway.
 *
 * We enable a form of cooperative emulation, giving reflective code an
 * opportunity to cooperate in upholding the illusion. When such cooperative
 * reflective code sees an accessor property, where the accessor's getter
 * has an `originalValue` property, it knows that the getter is
 * alleging that it is the result of the `enablePropertyOverrides` conversion
 * pattern, so it can decide to cooperatively "pretend" that it sees a data
 * property with that value.
 *
 * @param {Record<string, any>} intrinsics
 * @param {'min' | 'moderate' | 'severe'} overrideTaming
 * @param {Reporter} reporter
 * @param {Iterable<string | symbol>} [overrideDebug]
 */
               function enablePropertyOverrides(
  intrinsics,
  overrideTaming,
  { warn },
  overrideDebug = [],
) {
  const debugProperties = new Set(overrideDebug);
  function enable(path, obj, prop, desc) {
    if ('value' in desc && desc.configurable) {
      const { value } = desc;

      const isDebug = setHas(debugProperties, prop);

      // We use concise method syntax to be `this` sensitive, but still
      // omit a prototype property or [[Construct]] behavior.
      // @ts-expect-error We know there is an accessor descriptor there
      const { get: getter, set: setter } = getOwnPropertyDescriptor(
        {
          get [prop]() {
            return value;
          },
          set [prop](newValue) {
            if (obj === this) {
              throw TypeError(
                `Cannot assign to read only property '${String(
                  prop,
                )}' of '${path}'`,
              );
            }
            if (hasOwn(this, prop)) {
              this[prop] = newValue;
            } else {
              if (isDebug) {
                warn(TypeError(`Override property ${prop}`));
              }
              defineProperty(this, prop, {
                value: newValue,
                writable: true,
                enumerable: true,
                configurable: true,
              });
            }
          },
        },
        prop,
      );

      defineProperty(getter, 'originalValue', {
        value,
        writable: false,
        enumerable: false,
        configurable: false,
      });

      defineProperty(obj, prop, {
        get: getter,
        set: setter,
        enumerable: desc.enumerable,
        configurable: desc.configurable,
      });
    }
  }

  function enableProperty(path, obj, prop) {
    const desc = getOwnPropertyDescriptor(obj, prop);
    if (!desc) {
      return;
    }
    enable(path, obj, prop, desc);
  }

  function enableAllProperties(path, obj) {
    const descs = getOwnPropertyDescriptors(obj);
    if (!descs) {
      return;
    }
    // TypeScript does not allow symbols to be used as indexes because it
    // cannot recokon types of symbolized properties.
    arrayForEach(ownKeys(descs), prop => enable(path, obj, prop, descs[prop]));
  }

  function enableProperties(path, obj, plan) {
    for (const prop of ownKeys(plan)) {
      const desc = getOwnPropertyDescriptor(obj, prop);
      if (!desc || desc.get || desc.set) {
        // No not a value property, nothing to do.
        // eslint-disable-next-line no-continue
        continue;
      }

      // In case `prop` is a symbol, we first coerce it with `String`,
      // purely for diagnostic purposes.
      const subPath = `${path}.${String(prop)}`;
      const subPlan = plan[prop];

      if (subPlan === true) {
        enableProperty(subPath, obj, prop);
      } else if (subPlan === '*') {
        enableAllProperties(subPath, desc.value);
      } else if (!isPrimitive(subPlan)) {
        enableProperties(subPath, desc.value, subPlan);
      } else {
        throw TypeError(`Unexpected override enablement plan ${subPath}`);
      }
    }
  }

  let plan;
  switch (overrideTaming) {
    case 'min': {
      plan = minEnablements;
      break;
    }
    case 'moderate': {
      plan = moderateEnablements;
      break;
    }
    case 'severe': {
      plan = severeEnablements;
      break;
    }
    default: {
      throw TypeError(`unrecognized overrideTaming ${overrideTaming}`);
    }
  }

  // Do the repair.
  enableProperties('root', intrinsics, plan);
}$h͏_once.default(      enablePropertyOverrides);
})()
,
// === 27. ses ./src/tame-locale-methods.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let Number,String,TypeError,defineProperty,freezeRegexp,getOwnPropertyNames,isPrimitive,regexpExec,assert;$h͏_imports([["./commons.js", [["Number",[$h͏_a => (Number = $h͏_a)]],["String",[$h͏_a => (String = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["freezeRegexp",[$h͏_a => (freezeRegexp = $h͏_a)]],["getOwnPropertyNames",[$h͏_a => (getOwnPropertyNames = $h͏_a)]],["isPrimitive",[$h͏_a => (isPrimitive = $h͏_a)]],["regexpExec",[$h͏_a => (regexpExec = $h͏_a)]]]],["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]]]]]);











const { Fail, quote: q } = assert;

const localePattern = freezeRegexp(/^(\w*[a-z])Locale([A-Z]\w*)$/);

// Use concise methods to obtain named functions without constructor
// behavior or `.prototype` property.
const tamedMethods = {
  // See https://tc39.es/ecma262/#sec-string.prototype.localecompare
  localeCompare(arg) {
    if (this === null || this === undefined) {
      throw TypeError(
        'Cannot localeCompare with null or undefined "this" value',
      );
    }
    const s = `${this}`;
    const that = `${arg}`;
    if (s < that) {
      return -1;
    }
    if (s > that) {
      return 1;
    }
    s === that || Fail`expected ${q(s)} and ${q(that)} to compare`;
    return 0;
  },

  toString() {
    return `${this}`;
  },
};

const nonLocaleCompare = tamedMethods.localeCompare;
const numberToString = tamedMethods.toString;

               function tameLocaleMethods(intrinsics, localeTaming = 'safe') {
  if (localeTaming === 'unsafe') {
    return;
  }

  defineProperty(String.prototype, 'localeCompare', {
    value: nonLocaleCompare,
  });

  for (const intrinsicName of getOwnPropertyNames(intrinsics)) {
    const intrinsic = intrinsics[intrinsicName];
    if (!isPrimitive(intrinsic)) {
      for (const methodName of getOwnPropertyNames(intrinsic)) {
        const match = regexpExec(localePattern, methodName);
        if (match) {
          typeof intrinsic[methodName] === 'function' ||
            Fail`expected ${q(methodName)} to be a function`;
          const nonLocaleMethodName = `${match[1]}${match[2]}`;
          const method = intrinsic[nonLocaleMethodName];
          typeof method === 'function' ||
            Fail`function ${q(nonLocaleMethodName)} not found`;
          defineProperty(intrinsic, methodName, { value: method });
        }
      }
    }
  }

  // Numbers are special because toString accepts a radix instead of ignoring
  // all of the arguments that we would otherwise forward.
  defineProperty(Number.prototype, 'toLocaleString', {
    value: numberToString,
  });
}$h͏_once.default(      tameLocaleMethods);
})()
,
// === 28. ses ./src/make-eval-function.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';$h͏_imports([]);/**
 * makeEvalFunction()
 * A safe version of the native eval function which relies on
 * the safety of `safe-eval` for confinement, unless `no-eval`
 * is specified (then a TypeError is thrown on use).
 *
 * @param {Function} evaluator
 */
       const makeEvalFunction = evaluator => {
  // We use the concise method syntax to create an eval without a
  // [[Construct]] behavior (such that the invocation "new eval()" throws
  // TypeError: eval is not a constructor"), but which still accepts a
  // 'this' binding.
  const newEval = {
    eval(source) {
      if (typeof source !== 'string') {
        // As per the runtime semantic of PerformEval [ECMAScript 18.2.1.1]:
        // If Type(source) is not String, return source.
        // TODO Recent proposals from Mike Samuel may change this non-string
        // rule. Track.
        return source;
      }
      return evaluator(source);
    },
  }.eval;

  return newEval;
};$h͏_once.makeEvalFunction(makeEvalFunction);
})()
,
// === 29. ses ./src/make-function-constructor.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let FERAL_FUNCTION,arrayJoin,arrayPop,defineProperties,getPrototypeOf,assert;$h͏_imports([["./commons.js", [["FERAL_FUNCTION",[$h͏_a => (FERAL_FUNCTION = $h͏_a)]],["arrayJoin",[$h͏_a => (arrayJoin = $h͏_a)]],["arrayPop",[$h͏_a => (arrayPop = $h͏_a)]],["defineProperties",[$h͏_a => (defineProperties = $h͏_a)]],["getPrototypeOf",[$h͏_a => (getPrototypeOf = $h͏_a)]]]],["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]]]]]);








const { Fail } = assert;

/*
 * makeFunctionConstructor()
 * A safe version of the native Function which relies on
 * the safety of `safe-eval` for confinement, unless `no-eval`
 * is specified (then a TypeError is thrown on use).
 */
       const makeFunctionConstructor = evaluator => {
  // Define an unused parameter to ensure Function.length === 1
  const newFunction = function Function(_body) {
    // Sanitize all parameters at the entry point.
    // eslint-disable-next-line prefer-rest-params
    const bodyText = `${arrayPop(arguments) || ''}`;
    // eslint-disable-next-line prefer-rest-params
    const parameters = `${arrayJoin(arguments, ',')}`;

    // Are parameters and bodyText valid code, or is someone
    // attempting an injection attack? This will throw a SyntaxError if:
    // - parameters doesn't parse as parameters
    // - bodyText doesn't parse as a function body
    // - either contain a call to super() or references a super property.
    //
    // It seems that XS may still be vulnerable to the attack explained at
    // https://github.com/tc39/ecma262/pull/2374#issuecomment-813769710
    // where `new Function('/*', '*/ ) {')` would incorrectly validate.
    // Before we worried about this, we check the parameters and bodyText
    // together in one call
    // ```js
    // new FERAL_FUNCTION(parameters, bodyTest);
    // ```
    // However, this check is vulnerable to that bug. Aside from that case,
    // all engines do seem to validate the parameters, taken by themselves,
    // correctly. And all engines do seem to validate the bodyText, taken
    // by itself correctly. So with the following two checks, SES builds a
    // correct safe `Function` constructor by composing two calls to an
    // original unsafe `Function` constructor that may suffer from this bug
    // but is otherwise correctly validating.
    //
    // eslint-disable-next-line no-new
    new FERAL_FUNCTION(parameters, '');
    // eslint-disable-next-line no-new
    new FERAL_FUNCTION(bodyText);

    // Safe to be combined. Defeat potential trailing comments.
    // TODO: since we create an anonymous function, the 'this' value
    // isn't bound to the global object as per specs, but set as undefined.
    const src = `(function anonymous(${parameters}\n) {\n${bodyText}\n})`;
    return evaluator(src);
  };

  defineProperties(newFunction, {
    // Ensure that any function created in any evaluator in a realm is an
    // instance of Function in any evaluator of the same realm.
    prototype: {
      value: FERAL_FUNCTION.prototype,
      writable: false,
      enumerable: false,
      configurable: false,
    },
  });

  // Assert identity of Function.__proto__ accross all compartments
  getPrototypeOf(FERAL_FUNCTION) === FERAL_FUNCTION.prototype ||
    Fail`Function prototype is the same accross compartments`;
  getPrototypeOf(newFunction) === FERAL_FUNCTION.prototype ||
    Fail`Function constructor prototype is the same across compartments`;

  return newFunction;
};$h͏_once.makeFunctionConstructor(makeFunctionConstructor);
})()
,
// === 30. ses ./src/global-object.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let TypeError,assign,create,defineProperty,entries,freeze,hasOwn,unscopablesSymbol,makeEvalFunction,makeFunctionConstructor,constantProperties,universalPropertyNames;$h͏_imports([["./commons.js", [["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["assign",[$h͏_a => (assign = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["entries",[$h͏_a => (entries = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["hasOwn",[$h͏_a => (hasOwn = $h͏_a)]],["unscopablesSymbol",[$h͏_a => (unscopablesSymbol = $h͏_a)]]]],["./make-eval-function.js", [["makeEvalFunction",[$h͏_a => (makeEvalFunction = $h͏_a)]]]],["./make-function-constructor.js", [["makeFunctionConstructor",[$h͏_a => (makeFunctionConstructor = $h͏_a)]]]],["./permits.js", [["constantProperties",[$h͏_a => (constantProperties = $h͏_a)]],["universalPropertyNames",[$h͏_a => (universalPropertyNames = $h͏_a)]]]]]);













/**
 * The host's ordinary global object is not provided by a `with` block, so
 * assigning to Symbol.unscopables has no effect.
 * Since this shim uses `with` blocks to create a confined lexical scope for
 * guest programs, we cannot emulate the proper behavior.
 * With this shim, assigning Symbol.unscopables causes the given lexical
 * names to fall through to the terminal scope proxy.
 * But, we can install this setter to prevent a program from proceding on
 * this false assumption.
 *
 * @param {object} globalObject
 */
       const setGlobalObjectSymbolUnscopables = globalObject => {
  defineProperty(
    globalObject,
    unscopablesSymbol,
    freeze(
      assign(create(null), {
        set: freeze(() => {
          throw TypeError(
            `Cannot set Symbol.unscopables of a Compartment's globalThis`,
          );
        }),
        enumerable: false,
        configurable: false,
      }),
    ),
  );
};

/**
 * setGlobalObjectConstantProperties()
 * Initializes a new global object using a process similar to ECMA specifications
 * (SetDefaultGlobalBindings). This process is split between this function and
 * `setGlobalObjectMutableProperties`.
 *
 * @param {object} globalObject
 */$h͏_once.setGlobalObjectSymbolUnscopables(setGlobalObjectSymbolUnscopables);
       const setGlobalObjectConstantProperties = globalObject => {
  for (const [name, constant] of entries(constantProperties)) {
    defineProperty(globalObject, name, {
      value: constant,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }
};

/**
 * setGlobalObjectMutableProperties()
 * Create new global object using a process similar to ECMA specifications
 * (portions of SetRealmGlobalObject and SetDefaultGlobalBindings).
 * `newGlobalPropertyNames` should be either `initialGlobalPropertyNames` or
 * `sharedGlobalPropertyNames`.
 *
 * @param {object} globalObject
 * @param {object} args
 * @param {object} args.intrinsics
 * @param {object} args.newGlobalPropertyNames
 * @param {Function} args.makeCompartmentConstructor
 * @param {(object) => void} args.markVirtualizedNativeFunction
 * @param {Compartment} [args.parentCompartment]
 */$h͏_once.setGlobalObjectConstantProperties(setGlobalObjectConstantProperties);
       const setGlobalObjectMutableProperties = (
  globalObject,
  {
    intrinsics,
    newGlobalPropertyNames,
    makeCompartmentConstructor,
    markVirtualizedNativeFunction,
    parentCompartment,
  },
) => {
  for (const [name, intrinsicName] of entries(universalPropertyNames)) {
    if (hasOwn(intrinsics, intrinsicName)) {
      defineProperty(globalObject, name, {
        value: intrinsics[intrinsicName],
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  }

  for (const [name, intrinsicName] of entries(newGlobalPropertyNames)) {
    if (hasOwn(intrinsics, intrinsicName)) {
      defineProperty(globalObject, name, {
        value: intrinsics[intrinsicName],
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }
  }

  const perCompartmentGlobals = {
    globalThis: globalObject,
  };

  perCompartmentGlobals.Compartment = freeze(
    makeCompartmentConstructor(
      makeCompartmentConstructor,
      intrinsics,
      markVirtualizedNativeFunction,
      {
        parentCompartment,
        enforceNew: true,
      },
    ),
  );

  // TODO These should still be tamed according to the permits before
  // being made available.
  for (const [name, value] of entries(perCompartmentGlobals)) {
    defineProperty(globalObject, name, {
      value,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    if (typeof value === 'function') {
      markVirtualizedNativeFunction(value);
    }
  }
};

/**
 * setGlobalObjectEvaluators()
 * Set the eval and the Function evaluator on the global object with given evalTaming policy.
 *
 * @param {object} globalObject
 * @param {Function} evaluator
 * @param {(object) => void} markVirtualizedNativeFunction
 */$h͏_once.setGlobalObjectMutableProperties(setGlobalObjectMutableProperties);
       const setGlobalObjectEvaluators = (
  globalObject,
  evaluator,
  markVirtualizedNativeFunction,
) => {
  {
    const f = freeze(makeEvalFunction(evaluator));
    markVirtualizedNativeFunction(f);
    defineProperty(globalObject, 'eval', {
      value: f,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  {
    const f = freeze(makeFunctionConstructor(evaluator));
    markVirtualizedNativeFunction(f);
    defineProperty(globalObject, 'Function', {
      value: f,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
};$h͏_once.setGlobalObjectEvaluators(setGlobalObjectEvaluators);
})()
,
// === 31. ses ./src/strict-scope-terminator.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let Proxy,String,TypeError,ReferenceError,create,freeze,getOwnPropertyDescriptors,assert;$h͏_imports([["./commons.js", [["Proxy",[$h͏_a => (Proxy = $h͏_a)]],["String",[$h͏_a => (String = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["ReferenceError",[$h͏_a => (ReferenceError = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["getOwnPropertyDescriptors",[$h͏_a => (getOwnPropertyDescriptors = $h͏_a)]]]],["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]]]]]);










const { Fail, quote: q } = assert;

/**
 * `freeze` but not `harden` the proxy target so it remains trapping.
 * Thus, it should not be shared outside this module.
 *
 * @see https://github.com/endojs/endo/blob/master/packages/ses/docs/preparing-for-stabilize.md
 */
const objTarget = freeze({ __proto__: null });

/**
 * alwaysThrowHandler
 * This is an object that throws if any property is called. It's used as
 * a proxy handler which throws on any trap called.
 * It's made from a proxy with a get trap that throws. It's safe to
 * create one and share it between all Proxy handlers.
 */
       const alwaysThrowHandler = new Proxy(
  objTarget,
  freeze({
    get(_shadow, prop) {
      Fail`Please report unexpected scope handler trap: ${q(String(prop))}`;
    },
  }),
);

/*
 * scopeProxyHandlerProperties
 * scopeTerminatorHandler manages a strictScopeTerminator Proxy which serves as
 * the final scope boundary that will always return "undefined" in order
 * to prevent access to "start compartment globals".
 */$h͏_once.alwaysThrowHandler(alwaysThrowHandler);
const scopeProxyHandlerProperties = {
  get(_shadow, _prop) {
    return undefined;
  },

  set(_shadow, prop, _value) {
    // We should only hit this if the has() hook returned true matches the v8
    // ReferenceError message "Uncaught ReferenceError: xyz is not defined"
    throw ReferenceError(`${String(prop)} is not defined`);
  },

  has(_shadow, prop) {
    // we must at least return true for all properties on the realm globalThis
    return true;
  },

  // note: this is likely a bug of safari
  // https://bugs.webkit.org/show_bug.cgi?id=195534
  getPrototypeOf(_shadow) {
    return null;
  },

  // See https://github.com/endojs/endo/issues/1510
  // TODO: report as bug to v8 or Chrome, and record issue link here.
  getOwnPropertyDescriptor(_shadow, prop) {
    // Coerce with `String` in case prop is a symbol.
    const quotedProp = q(String(prop));
    // eslint-disable-next-line @endo/no-polymorphic-call
    console.warn(
      `getOwnPropertyDescriptor trap on scopeTerminatorHandler for ${quotedProp}`,
      TypeError().stack,
    );
    return undefined;
  },

  // See https://github.com/endojs/endo/issues/1490
  // TODO Report bug to JSC or Safari
  ownKeys(_shadow) {
    return [];
  },
};

// The scope handler's prototype is a proxy that throws if any trap other
// than get/set/has are run (like getOwnPropertyDescriptors, apply,
// getPrototypeOf).
       const strictScopeTerminatorHandler = freeze(
  create(
    alwaysThrowHandler,
    getOwnPropertyDescriptors(scopeProxyHandlerProperties),
  ),
);$h͏_once.strictScopeTerminatorHandler(strictScopeTerminatorHandler);

       const strictScopeTerminator = new Proxy(
  objTarget,
  strictScopeTerminatorHandler,
);$h͏_once.strictScopeTerminator(strictScopeTerminator);
})()
,
// === 32. ses ./src/sloppy-globals-scope-terminator.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let Proxy,create,freeze,getOwnPropertyDescriptors,reflectSet,strictScopeTerminatorHandler,alwaysThrowHandler;$h͏_imports([["./commons.js", [["Proxy",[$h͏_a => (Proxy = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["getOwnPropertyDescriptors",[$h͏_a => (getOwnPropertyDescriptors = $h͏_a)]],["reflectSet",[$h͏_a => (reflectSet = $h͏_a)]]]],["./strict-scope-terminator.js", [["strictScopeTerminatorHandler",[$h͏_a => (strictScopeTerminatorHandler = $h͏_a)]],["alwaysThrowHandler",[$h͏_a => (alwaysThrowHandler = $h͏_a)]]]]]);











/**
 * `freeze` but not `harden` the proxy target so it remains trapping.
 * Thus, it should not be shared outside this module.
 *
 * @see https://github.com/endojs/endo/blob/master/packages/ses/docs/preparing-for-stabilize.md
 */
const objTarget = freeze({ __proto__: null });

/*
 * createSloppyGlobalsScopeTerminator()
 * strictScopeTerminatorHandler manages a scopeTerminator Proxy which serves as
 * the final scope boundary that will always return "undefined" in order
 * to prevent access to "start compartment globals". When "sloppyGlobalsMode"
 * is true, the Proxy will perform sets on the "globalObject".
 */
       const createSloppyGlobalsScopeTerminator = globalObject => {
  const scopeProxyHandlerProperties = {
    // inherit scopeTerminator behavior
    ...strictScopeTerminatorHandler,

    // Redirect set properties to the globalObject.
    set(_shadow, prop, value) {
      return reflectSet(globalObject, prop, value);
    },

    // Always claim to have a potential property in order to be the recipient of a set
    has(_shadow, _prop) {
      return true;
    },
  };

  // The scope handler's prototype is a proxy that throws if any trap other
  // than get/set/has are run (like getOwnPropertyDescriptors, apply,
  // getPrototypeOf).
  const sloppyGlobalsScopeTerminatorHandler = freeze(
    create(
      alwaysThrowHandler,
      getOwnPropertyDescriptors(scopeProxyHandlerProperties),
    ),
  );

  const sloppyGlobalsScopeTerminator = new Proxy(
    objTarget,
    sloppyGlobalsScopeTerminatorHandler,
  );

  return sloppyGlobalsScopeTerminator;
};$h͏_once.createSloppyGlobalsScopeTerminator(createSloppyGlobalsScopeTerminator);
freeze(createSloppyGlobalsScopeTerminator);
})()
,
// === 33. ses ./src/eval-scope.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let FERAL_EVAL,create,defineProperties,freeze,assert;$h͏_imports([["./commons.js", [["FERAL_EVAL",[$h͏_a => (FERAL_EVAL = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["defineProperties",[$h͏_a => (defineProperties = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]]]],["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]]]]]);



const { Fail } = assert;

// We attempt to frustrate stack bumping attacks on the safe evaluator
// (`make-safe-evaluator.js`).
// A stack bumping attack forces an API call to throw a stack overflow
// `RangeError` at an inopportune time.
// The attacker arranges for the stack to be sufficiently deep that the API
// consumes exactly enough stack frames to throw an exception.
//
// For the safe evaluator, an exception thrown between adding and then deleting
// `eval` on `evalScope` could leak the real `eval` to an attacker's lexical
// scope.
// This would be sufficiently disastrous that we guard against it twice.
// First, we delete `eval` from `evalScope` immediately before rendering it to
// the guest program's lexical scope.
//
// If the attacker manages to arrange for `eval` to throw an exception after we
// call `allowNextEvalToBeUnsafe` but before the guest program accesses `eval`,
// it would be able to access `eval` once more in its own code.
// Although they could do no harm with a direct `eval`, they would be able to
// escape to the true global scope with an indirect `eval`.
//
//   prepareStack(depth, () => {
//     (eval)('');
//   });
//   const unsafeEval = (eval);
//   const safeEval = (eval);
//   const realGlobal = unsafeEval('globalThis');
//
// To protect against that case, we also delete `eval` from the `evalScope` in
// a `finally` block surrounding the call to the safe evaluator.
// The only way to reach this case is if `eval` remains on `evalScope` due to
// an attack, so we assume that attack would have have invalided our isolation
// and revoke all future access to the evaluator.
//
// To defeat a stack bumping attack, we must use fewer stack frames to recover
// in that `finally` block than we used in the `try` block.
// We have no reliable guarantees about how many stack frames a block of
// JavaScript will consume.
// Function inlining, tail-call optimization, variations in the size of a stack
// frame, and block scopes may affect the depth of the stack.
// The only number of acceptable stack frames to use in the finally block is
// zero.
// We only use property assignment and deletion in the safe evaluator's
// `finally` block.
// We use `delete evalScope.eval` to withhold the evaluator.
// We assign an envelope object over `evalScopeKit.revoked` to revoke the
// evaluator.
//
// This is why we supply a meaningfully named function for
// `allowNextEvalToBeUnsafe` but do not provide a corresponding
// `revokeAccessToUnsafeEval` or even simply `revoke`.
// These recovery routines are expressed inline in the safe evaluator.

       const makeEvalScopeKit = () => {
  const evalScope = create(null);
  const oneTimeEvalProperties = freeze({
    eval: {
      get() {
        delete evalScope.eval;
        return FERAL_EVAL;
      },
      enumerable: false,
      configurable: true,
    },
  });

  const evalScopeKit = {
    evalScope,
    allowNextEvalToBeUnsafe() {
      const { revoked } = evalScopeKit;
      if (revoked !== null) {
        Fail`a handler did not reset allowNextEvalToBeUnsafe ${revoked.err}`;
      }
      // Allow next reference to eval produce the unsafe FERAL_EVAL.
      // We avoid defineProperty because it consumes an extra stack frame taming
      // its return value.
      defineProperties(evalScope, oneTimeEvalProperties);
    },
    /** @type {null | { err: any }} */
    revoked: null,
  };

  return evalScopeKit;
};$h͏_once.makeEvalScopeKit(makeEvalScopeKit);
})()
,
// === 34. ses ./src/get-source-url.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let FERAL_REG_EXP,freezeRegexp,regexpExec,stringSlice;$h͏_imports([["./commons.js", [["FERAL_REG_EXP",[$h͏_a => (FERAL_REG_EXP = $h͏_a)]],["freezeRegexp",[$h͏_a => (freezeRegexp = $h͏_a)]],["regexpExec",[$h͏_a => (regexpExec = $h͏_a)]],["stringSlice",[$h͏_a => (stringSlice = $h͏_a)]]]]]);






// Captures a key and value of the form #key=value or @key=value
const sourceMetaEntryRegExp =
  '\\s*[@#]\\s*([a-zA-Z][a-zA-Z0-9]*)\\s*=\\s*([^\\s\\*]*)';
// Captures either a one-line or multi-line comment containing
// one #key=value or @key=value.
// Produces two pairs of capture groups, but the initial two may be undefined.
// On account of the mechanics of regular expressions, scanning from the end
// does not allow us to capture every pair, so getSourceURL must capture and
// trim until there are no matching comments.
const sourceMetaEntriesRegExp = freezeRegexp(
  new FERAL_REG_EXP(
    `(?:\\s*//${sourceMetaEntryRegExp}|/\\*${sourceMetaEntryRegExp}\\s*\\*/)\\s*$`,
  ),
);

/**
 * @param {string} src
 */
       const getSourceURL = src => {
  let sourceURL = '<unknown>';

  // Our regular expression matches the last one or two comments with key value
  // pairs at the end of the source, avoiding a scan over the entire length of
  // the string, but at the expense of being able to capture all the (key,
  // value) pair meta comments at the end of the source, which may include
  // sourceMapURL in addition to sourceURL.
  // So, we sublimate the comments out of the source until no source or no
  // comments remain.
  while (src.length > 0) {
    const match = regexpExec(sourceMetaEntriesRegExp, src);
    if (match === null) {
      break;
    }
    src = stringSlice(src, 0, -match[0].length);

    // We skip $0 since it contains the entire match.
    // The match contains four capture groups,
    // two (key, value) pairs, the first of which
    // may be undefined.
    // On the off-chance someone put two sourceURL comments in their code with
    // different commenting conventions, the latter has precedence.
    if (match[3] === 'sourceURL') {
      sourceURL = match[4];
    } else if (match[1] === 'sourceURL') {
      sourceURL = match[2];
    }
  }

  return sourceURL;
};$h͏_once.getSourceURL(getSourceURL);
})()
,
// === 35. ses ./src/transforms.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let FERAL_REG_EXP,SyntaxError,freezeRegexp,regexpReplace,regexpSearch,sealRegexp,stringSlice,stringSplit,freeze,getSourceURL;$h͏_imports([["./commons.js", [["FERAL_REG_EXP",[$h͏_a => (FERAL_REG_EXP = $h͏_a)]],["SyntaxError",[$h͏_a => (SyntaxError = $h͏_a)]],["freezeRegexp",[$h͏_a => (freezeRegexp = $h͏_a)]],["regexpReplace",[$h͏_a => (regexpReplace = $h͏_a)]],["regexpSearch",[$h͏_a => (regexpSearch = $h͏_a)]],["sealRegexp",[$h͏_a => (sealRegexp = $h͏_a)]],["stringSlice",[$h͏_a => (stringSlice = $h͏_a)]],["stringSplit",[$h͏_a => (stringSplit = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]]]],["./get-source-url.js", [["getSourceURL",[$h͏_a => (getSourceURL = $h͏_a)]]]]]);














/**
 * Find the first occurence of the given pattern and return
 * the location as the approximate line number.
 *
 * @param {string} src
 * @param {RegExp} pattern
 * @returns {number}
 */
function getLineNumber(src, pattern) {
  const index = regexpSearch(pattern, src);
  if (index < 0) {
    return -1;
  }

  // The importPattern incidentally captures an initial \n in
  // an attempt to reject a . prefix, so we need to offset
  // the line number in that case.
  const adjustment = src[index] === '\n' ? 1 : 0;

  return stringSplit(stringSlice(src, 0, index), '\n').length + adjustment;
}

// /////////////////////////////////////////////////////////////////////////////

const htmlCommentPattern = sealRegexp(
  new FERAL_REG_EXP(`(?:${'<'}!--|--${'>'})`, 'g'),
);

/**
 * Conservatively reject the source text if it may contain text that some
 * JavaScript parsers may treat as an html-like comment. To reject without
 * parsing, `rejectHtmlComments` will also reject some other text as well.
 *
 * https://www.ecma-international.org/ecma-262/9.0/index.html#sec-html-like-comments
 * explains that JavaScript parsers may or may not recognize html
 * comment tokens "<" immediately followed by "!--" and "--"
 * immediately followed by ">" in non-module source text, and treat
 * them as a kind of line comment. Since otherwise both of these can
 * appear in normal JavaScript source code as a sequence of operators,
 * we have the terrifying possibility of the same source code parsing
 * one way on one correct JavaScript implementation, and another way
 * on another.
 *
 * This shim takes the conservative strategy of just rejecting source
 * text that contains these strings anywhere. Note that this very
 * source file is written strangely to avoid mentioning these
 * character strings explicitly.
 *
 * We do not write the regexp in a straightforward way, so that an
 * apparennt html comment does not appear in this file. Thus, we avoid
 * rejection by the overly eager rejectDangerousSources.
 *
 * @param {string} src
 * @returns {string}
 */
       const rejectHtmlComments = src => {
  const lineNumber = getLineNumber(src, htmlCommentPattern);
  if (lineNumber < 0) {
    return src;
  }
  const name = getSourceURL(src);
  // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_HTML_COMMENT_REJECTED.md
  throw SyntaxError(
    `Possible HTML comment rejected at ${name}:${lineNumber}. (SES_HTML_COMMENT_REJECTED)`,
  );
};

/**
 * An optional transform to place ahead of `rejectHtmlComments` to evade *that*
 * rejection. However, it may change the meaning of the program.
 *
 * This evasion replaces each alleged html comment with the space-separated
 * JavaScript operator sequence that it may mean, assuming that it appears
 * outside of a comment or literal string, in source code where the JS
 * parser makes no special case for html comments (like module source code).
 * In that case, this evasion preserves the meaning of the program, though it
 * does change the souce column numbers on each effected line.
 *
 * If the html comment appeared in a literal (a string literal, regexp literal,
 * or a template literal), then this evasion will change the meaning of the
 * program by changing the text of that literal.
 *
 * If the html comment appeared in a JavaScript comment, then this evasion does
 * not change the meaning of the program because it only changes the contents of
 * those comments.
 *
 * @param {string} src
 * @returns {string}
 */$h͏_once.rejectHtmlComments(rejectHtmlComments);
       const evadeHtmlCommentTest = src => {
  const replaceFn = match => (match[0] === '<' ? '< ! --' : '-- >');
  return regexpReplace(htmlCommentPattern, src, replaceFn);
};

// /////////////////////////////////////////////////////////////////////////////
$h͏_once.evadeHtmlCommentTest(evadeHtmlCommentTest);
const importPattern = sealRegexp(
  new FERAL_REG_EXP('(^|[^.]|\\.\\.\\.)\\bimport(\\s*(?:\\(|/[/*]))', 'g'),
);

/**
 * Conservatively reject the source text if it may contain a dynamic
 * import expression. To reject without parsing, `rejectImportExpressions` will
 * also reject some other text as well.
 *
 * The proposed dynamic import expression is the only syntax currently
 * proposed, that can appear in non-module JavaScript code, that
 * enables direct access to the outside world that cannot be
 * suppressed or intercepted without parsing and rewriting. Instead,
 * this shim conservatively rejects any source text that seems to
 * contain such an expression. To do this safely without parsing, we
 * must also reject some valid programs, i.e., those containing
 * apparent import expressions in literal strings or comments.
 *
 * The current conservative rule looks for the identifier "import"
 * followed by either an open paren or something that looks like the
 * beginning of a comment. We assume that we do not need to worry
 * about html comment syntax because that was already rejected by
 * rejectHtmlComments.
 *
 * this \s *must* match all kinds of syntax-defined whitespace. If e.g.
 * U+2028 (LINE SEPARATOR) or U+2029 (PARAGRAPH SEPARATOR) is treated as
 * whitespace by the parser, but not matched by /\s/, then this would admit
 * an attack like: import\u2028('power.js') . We're trying to distinguish
 * something like that from something like importnotreally('power.js') which
 * is perfectly safe.
 *
 * @param {string} src
 * @returns {string}
 */
       const rejectImportExpressions = src => {
  const lineNumber = getLineNumber(src, importPattern);
  if (lineNumber < 0) {
    return src;
  }
  const name = getSourceURL(src);
  // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_IMPORT_REJECTED.md
  throw SyntaxError(
    `Possible import expression rejected at ${name}:${lineNumber}. (SES_IMPORT_REJECTED)`,
  );
};

/**
 * An optional transform to place ahead of `rejectImportExpressions` to evade
 * *that* rejection. However, it may change the meaning of the program.
 *
 * This evasion replaces each suspicious `import` identifier with `__import__`.
 * If the alleged import expression appears in a JavaScript comment, this
 * evasion will not change the meaning of the program. If it appears in a
 * literal (string literal, regexp literal, or a template literal), then this
 * evasion will change the contents of that literal. If it appears as code
 * where it would be parsed as an expression, then it might or might not change
 * the meaning of the program, depending on the binding, if any, of the lexical
 * variable `__import__`.
 *
 * @param {string} src
 * @returns {string}
 */$h͏_once.rejectImportExpressions(rejectImportExpressions);
       const evadeImportExpressionTest = src => {
  const replaceFn = (_, p1, p2) => `${p1}__import__${p2}`;
  return regexpReplace(importPattern, src, replaceFn);
};

// /////////////////////////////////////////////////////////////////////////////
$h͏_once.evadeImportExpressionTest(evadeImportExpressionTest);
const someDirectEvalPattern = freezeRegexp(
  new FERAL_REG_EXP('(^|[^.])\\beval(\\s*\\()'),
);

/**
 * Heuristically reject some text that seems to contain a direct eval
 * expression, with both false positives and false negavives. To reject without
 * parsing, `rejectSomeDirectEvalExpressions` may will also reject some other
 * text as well. It may also accept source text that contains a direct eval
 * written oddly, such as `(eval)(src)`. This false negative is not a security
 * vulnerability. Rather it is a compat hazard because it will execute as
 * an indirect eval under the SES-shim but as a direct eval on platforms that
 * support SES directly (like XS).
 *
 * The shim cannot correctly emulate a direct eval as explained at
 * https://github.com/Agoric/realms-shim/issues/12
 * If we did not reject direct eval syntax, we would
 * accidentally evaluate these with an emulation of indirect eval. To
 * prevent future compatibility problems, in shifting from use of the
 * shim to genuine platform support for the proposal, we should
 * instead statically reject code that seems to contain a direct eval
 * expression.
 *
 * As with the dynamic import expression, to avoid a full parse, we do
 * this approximately with a regexp, that will also reject strings
 * that appear safely in comments or strings. Unlike dynamic import,
 * if we miss some, this only creates future compat problems, not
 * security problems. Thus, we are only trying to catch innocent
 * occurrences, not malicious one. In particular, `(eval)(...)` is
 * direct eval syntax that would not be caught by the following regexp.
 *
 * Exported for unit tests.
 *
 * @param {string} src
 * @returns {string}
 */
       const rejectSomeDirectEvalExpressions = src => {
  const lineNumber = getLineNumber(src, someDirectEvalPattern);
  if (lineNumber < 0) {
    return src;
  }
  const name = getSourceURL(src);
  // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_EVAL_REJECTED.md
  throw SyntaxError(
    `Possible direct eval expression rejected at ${name}:${lineNumber}. (SES_EVAL_REJECTED)`,
  );
};

// /////////////////////////////////////////////////////////////////////////////

/**
 * A transform that bundles together the transforms that must unconditionally
 * happen last in order to ensure safe evaluation without parsing.
 *
 * @param {string} source
 * @returns {string}
 */$h͏_once.rejectSomeDirectEvalExpressions(rejectSomeDirectEvalExpressions);
       const mandatoryTransforms = source => {
  source = rejectHtmlComments(source);
  source = rejectImportExpressions(source);
  return source;
};

/**
 * Starting with `source`, apply each transform to the result of the
 * previous one, returning the result of the last transformation.
 *
 * @param {string} source
 * @param {((str: string) => string)[]} transforms
 * @returns {string}
 */$h͏_once.mandatoryTransforms(mandatoryTransforms);
       const applyTransforms = (source, transforms) => {
  for (let i = 0, l = transforms.length; i < l; i += 1) {
    const transform = transforms[i];
    source = transform(source);
  }
  return source;
};

// export all as a frozen object
$h͏_once.applyTransforms(applyTransforms);const transforms=freeze({
  rejectHtmlComments: freeze(rejectHtmlComments),
  evadeHtmlCommentTest: freeze(evadeHtmlCommentTest),
  rejectImportExpressions: freeze(rejectImportExpressions),
  evadeImportExpressionTest: freeze(evadeImportExpressionTest),
  rejectSomeDirectEvalExpressions: freeze(rejectSomeDirectEvalExpressions),
  mandatoryTransforms: freeze(mandatoryTransforms),
  applyTransforms: freeze(applyTransforms),
});$h͏_once.transforms(transforms);
})()
,
// === 36. ses ./src/scope-constants.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let arrayFilter,arrayIncludes,freezeRegexp,getOwnPropertyDescriptor,getOwnPropertyNames,hasOwn,regexpSearch,Set,setHas;$h͏_imports([["./commons.js", [["arrayFilter",[$h͏_a => (arrayFilter = $h͏_a)]],["arrayIncludes",[$h͏_a => (arrayIncludes = $h͏_a)]],["freezeRegexp",[$h͏_a => (freezeRegexp = $h͏_a)]],["getOwnPropertyDescriptor",[$h͏_a => (getOwnPropertyDescriptor = $h͏_a)]],["getOwnPropertyNames",[$h͏_a => (getOwnPropertyNames = $h͏_a)]],["hasOwn",[$h͏_a => (hasOwn = $h͏_a)]],["regexpSearch",[$h͏_a => (regexpSearch = $h͏_a)]],["Set",[$h͏_a => (Set = $h͏_a)]],["setHas",[$h͏_a => (setHas = $h͏_a)]]]]]);











/**
 * reservedNames
 * In JavaScript you cannot use reserved words as variable names (except for
 * "eval", which is specially reserved to prevent shadowing).
 * https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-identifier-names
 */
const reservedNames = new Set([
  // 11.6.2.1 Keywords
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',

  // Also reserved when parsing strict mode code
  'let',
  'static',

  // 11.6.2.2 Future Reserved Words
  'enum',

  // Also reserved when parsing strict mode code
  'implements',
  'package',
  'protected',
  'interface',
  'private',
  'public',

  // Reserved but not mentioned in specs
  'await',

  'null',
  'true',
  'false',

  'this',
  'arguments',

  // Reserved by us
  'eval',
]);

/**
 * identifierPattern
 * Simplified validation of identifier names: may only contain alphanumeric
 * characters (or "$" or "_"), and may not start with a digit. This is safe
 * and does not reduces the compatibility of the shim. The motivation for
 * this limitation was to decrease the complexity of the implementation,
 * and to maintain a resonable level of performance.
 * Note: \w is equivalent [a-zA-Z_0-9]
 * See 11.6.1 Identifier Names
 */
const identifierPattern = freezeRegexp(/^[a-zA-Z_$][\w$]*$/);

/**
 * isValidIdentifierName()
 * Is a value allowed as an arbitrary identifier name?
 *
 * @param {string} name
 */
       const isValidIdentifierName = name =>
  !setHas(reservedNames, name) && regexpSearch(identifierPattern, name) !== -1;

/*
 * isImmutableDataProperty
 */$h͏_once.isValidIdentifierName(isValidIdentifierName);

function isImmutableDataProperty(obj, name) {
  const desc = getOwnPropertyDescriptor(obj, name);
  return (
    desc &&
    //
    // The getters will not have .writable, don't let the falsyness of
    // 'undefined' trick us: test with === false, not ! . However descriptors
    // inherit from the (potentially poisoned) global object, so we might see
    // extra properties which weren't really there. Accessor properties have
    // 'get/set/enumerable/configurable', while data properties have
    // 'value/writable/enumerable/configurable'.
    desc.configurable === false &&
    desc.writable === false &&
    //
    // Checks for data properties because they're the only ones we can
    // optimize (accessors are most likely non-constant). Descriptors can't
    // can't have accessors and value properties at the same time, therefore
    // this check is sufficient. Using explicit own property deal with the
    // case where Object.prototype has been poisoned.
    hasOwn(desc, 'value')
  );
}

/**
 * getScopeConstants()
 * What variable names might be brought into scope? These include all
 * property names which can be variable names, including the names
 * of inherited properties. It excludes symbols and names which are
 * keywords. We drop symbols safely. Currently, this shim refuses
 * service if any of the names are keywords or keyword-like. This is
 * safe and only affects performance optimization.
 *
 * @param {object} globalObject
 * @param {object} moduleLexicals
 */
       const getScopeConstants = (globalObject, moduleLexicals = {}) => {
  // getOwnPropertyNames() does ignore Symbols so we don't need to
  // filter them out.
  const globalObjectNames = getOwnPropertyNames(globalObject);
  const moduleLexicalNames = getOwnPropertyNames(moduleLexicals);

  // Collect all valid & immutable identifiers from the endowments.
  const moduleLexicalConstants = arrayFilter(
    moduleLexicalNames,
    name =>
      isValidIdentifierName(name) &&
      isImmutableDataProperty(moduleLexicals, name),
  );

  // Collect all valid & immutable identifiers from the global that
  // are also not present in the endowments (immutable or not).
  const globalObjectConstants = arrayFilter(
    globalObjectNames,
    name =>
      // Can't define a constant: it would prevent a
      // lookup on the endowments.
      !arrayIncludes(moduleLexicalNames, name) &&
      isValidIdentifierName(name) &&
      isImmutableDataProperty(globalObject, name),
  );

  return {
    globalObjectConstants,
    moduleLexicalConstants,
  };
};$h͏_once.getScopeConstants(getScopeConstants);
})()
,
// === 37. ses ./src/make-evaluate.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let FERAL_FUNCTION,arrayJoin,apply,getScopeConstants;$h͏_imports([["./commons.js", [["FERAL_FUNCTION",[$h͏_a => (FERAL_FUNCTION = $h͏_a)]],["arrayJoin",[$h͏_a => (arrayJoin = $h͏_a)]],["apply",[$h͏_a => (apply = $h͏_a)]]]],["./scope-constants.js", [["getScopeConstants",[$h͏_a => (getScopeConstants = $h͏_a)]]]]]);




/**
 * buildOptimizer()
 * Given an array of identifiers, the optimizer returns a `const` declaration
 * destructuring `this.${name}`.
 *
 * @param {Array<string>} constants
 * @param {string} name
 */
function buildOptimizer(constants, name) {
  // No need to build an optimizer when there are no constants.
  if (constants.length === 0) return '';
  // Use 'this' to avoid going through the scope proxy, which is unnecessary
  // since the optimizer only needs references to the safe global.
  // Destructure the constants from the target scope object.
  return `const {${arrayJoin(constants, ',')}} = this.${name};`;
}

/**
 * makeEvaluate()
 * Create an 'evaluate' function with the correct optimizer inserted.
 *
 * @param {object} context
 * @param {object} context.evalScope
 * @param {object} context.moduleLexicals
 * @param {object} context.globalObject
 * @param {object} context.scopeTerminator
 */
       const makeEvaluate = context => {
  const { globalObjectConstants, moduleLexicalConstants } = getScopeConstants(
    context.globalObject,
    context.moduleLexicals,
  );
  const globalObjectOptimizer = buildOptimizer(
    globalObjectConstants,
    'globalObject',
  );
  const moduleLexicalOptimizer = buildOptimizer(
    moduleLexicalConstants,
    'moduleLexicals',
  );

  // Create a function in sloppy mode, so that we can use 'with'. It returns
  // a function in strict mode that evaluates the provided code using direct
  // eval, and thus in strict mode in the same scope. We must be very careful
  // to not create new names in this scope

  // 1: we use multiple nested 'with' to catch all free variable names. The
  // `this` value of the outer sloppy function holds the different scope
  // layers, from inner to outer:
  //    a) `evalScope` which must release the `FERAL_EVAL` as 'eval' once for
  //       every invocation of the inner `evaluate` function in order to
  //       trigger direct eval. The direct eval semantics is what allows the
  //       evaluated code to lookup free variable names on the other scope
  //       objects and not in global scope.
  //    b) `moduleLexicals` which provide a way to introduce free variables
  //       that are not available on the globalObject.
  //    c) `globalObject` is the global scope object of the evaluator, aka the
  //       Compartment's `globalThis`.
  //    d) `scopeTerminator` is a proxy object which prevents free variable
  //       lookups to escape to the start compartment's global object.
  // 2: `optimizer`s catch constant variable names for speed.
  // 3: The inner strict `evaluate` function should be passed two parameters:
  //    a) its arguments[0] is the source to be directly evaluated.
  //    b) its 'this' is the this binding seen by the code being
  //       directly evaluated (the globalObject).

  // Notes:
  // - The `optimizer` strings only lookup values on the `globalObject` and
  //   `moduleLexicals` objects by construct. Keywords like 'function' are
  //   reserved and cannot be used as a variable, so they are excluded from the
  //   optimizer. Furthermore to prevent shadowing 'eval', while a valid
  //   identifier, that name is also explicitly excluded.
  // - when 'eval' is looked up in the `evalScope`, the powerful unsafe eval
  //   intrinsic is returned after automatically removing it from the
  //   `evalScope`. Any further reference to 'eval' in the evaluate string will
  //   get the tamed evaluator from the `globalObject`, if any.

  // TODO https://github.com/endojs/endo/issues/816
  // The optimizer currently runs under sloppy mode, and although we doubt that
  // there is any vulnerability introduced just by running the optimizer
  // sloppy, we are much more confident in the semantics of strict mode.
  // The `evaluate` function can be and is reused across multiple evaluations.
  // Since the optimizer should not be re-evaluated every time, it cannot be
  // inside the `evaluate` closure. While we could potentially nest an
  // intermediate layer of `() => {'use strict'; ${optimizers}; ...`, it
  // doesn't seem worth the overhead and complexity.
  const evaluateFactory = FERAL_FUNCTION(`
    with (this.scopeTerminator) {
      with (this.globalObject) {
        with (this.moduleLexicals) {
          with (this.evalScope) {
            ${globalObjectOptimizer}
            ${moduleLexicalOptimizer}
            return function() {
              'use strict';
              return eval(arguments[0]);
            };
          }
        }
      }
    }
  `);

  return apply(evaluateFactory, context, []);
};$h͏_once.makeEvaluate(makeEvaluate);
})()
,
// === 38. ses ./src/make-safe-evaluator.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let apply,arrayFlatMap,freeze,identity,strictScopeTerminator,createSloppyGlobalsScopeTerminator,makeEvalScopeKit,applyTransforms,mandatoryTransforms,makeEvaluate,assert;$h͏_imports([["./commons.js", [["apply",[$h͏_a => (apply = $h͏_a)]],["arrayFlatMap",[$h͏_a => (arrayFlatMap = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["identity",[$h͏_a => (identity = $h͏_a)]]]],["./strict-scope-terminator.js", [["strictScopeTerminator",[$h͏_a => (strictScopeTerminator = $h͏_a)]]]],["./sloppy-globals-scope-terminator.js", [["createSloppyGlobalsScopeTerminator",[$h͏_a => (createSloppyGlobalsScopeTerminator = $h͏_a)]]]],["./eval-scope.js", [["makeEvalScopeKit",[$h͏_a => (makeEvalScopeKit = $h͏_a)]]]],["./transforms.js", [["applyTransforms",[$h͏_a => (applyTransforms = $h͏_a)]],["mandatoryTransforms",[$h͏_a => (mandatoryTransforms = $h͏_a)]]]],["./make-evaluate.js", [["makeEvaluate",[$h͏_a => (makeEvaluate = $h͏_a)]]]],["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]]]]]);










const { Fail } = assert;

/**
 * makeSafeEvaluator()
 * Build the low-level operation used by all evaluators:
 * eval(), Function(), Compartment.prototype.evaluate().
 *
 * @param {object} options
 * @param {object} options.globalObject
 * @param {object} [options.moduleLexicals]
 * @param {Array<import('./lockdown.js').Transform>} [options.globalTransforms]
 * @param {boolean} [options.sloppyGlobalsMode]
 */
       const makeSafeEvaluator = ({
  globalObject,
  moduleLexicals = {},
  globalTransforms = [],
  sloppyGlobalsMode = false,
}) => {
  const scopeTerminator = sloppyGlobalsMode
    ? createSloppyGlobalsScopeTerminator(globalObject)
    : strictScopeTerminator;
  const evalScopeKit = makeEvalScopeKit();
  const { evalScope } = evalScopeKit;

  const evaluateContext = freeze({
    evalScope,
    moduleLexicals,
    globalObject,
    scopeTerminator,
  });

  // Defer creating the actual evaluator to first use.
  // Creating a compartment should be possible in no-eval environments
  // It also allows more global constants to be captured by the optimizer
  let evaluate;
  const provideEvaluate = () => {
    if (!evaluate) {
      evaluate = makeEvaluate(evaluateContext);
    }
  };

  /**
   * @param {string} source
   * @param {object} [options]
   * @param {Array<import('./lockdown.js').Transform>} [options.localTransforms]
   */
  const safeEvaluate = (source, options) => {
    const { localTransforms = [] } = options || {};
    provideEvaluate();

    // Execute the mandatory transforms last to ensure that any rewritten code
    // meets those mandatory requirements.
    source = applyTransforms(
      source,
      arrayFlatMap(
        [localTransforms, globalTransforms, [mandatoryTransforms]],
        identity,
      ),
    );

    let err;
    try {
      // Allow next reference to eval produce the unsafe FERAL_EVAL.
      // eslint-disable-next-line @endo/no-polymorphic-call
      evalScopeKit.allowNextEvalToBeUnsafe();

      // Ensure that "this" resolves to the safe global.
      return apply(evaluate, globalObject, [source]);
    } catch (e) {
      // stash the child-code error in hopes of debugging the internal failure
      err = e;
      throw e;
    } finally {
      const unsafeEvalWasStillExposed = 'eval' in evalScope;
      delete evalScope.eval;
      if (unsafeEvalWasStillExposed) {
        // Barring a defect in the SES shim, the evalScope should allow the
        // powerful, unsafe  `eval` to be used by `evaluate` exactly once, as the
        // very first name that it attempts to access from the lexical scope.
        // A defect in the SES shim could throw an exception after we set
        // `evalScope.eval` and before `evaluate` calls `eval` internally.
        // If we get here, SES is very broken.
        // This condition is one where this vat is now hopelessly confused, and
        // the vat as a whole should be aborted.
        // No further code should run.
        // All immediately reachable state should be abandoned.
        // However, that is not yet possible, so we at least prevent further
        // variable resolution via the scopeHandler, and throw an error with
        // diagnostic info including the thrown error if any from evaluating the
        // source code.
        evalScopeKit.revoked = { err };
        // TODO A GOOD PLACE TO PANIC(), i.e., kill the vat incarnation.
        // See https://github.com/Agoric/SES-shim/issues/490
        Fail`handler did not reset allowNextEvalToBeUnsafe ${err}`;
      }
    }
  };

  return { safeEvaluate };
};$h͏_once.makeSafeEvaluator(makeSafeEvaluator);
})()
,
// === 39. ses ./src/tame-function-tostring.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let WeakSet,defineProperty,freeze,functionPrototype,functionToString,stringEndsWith,weaksetAdd,weaksetHas;$h͏_imports([["./commons.js", [["WeakSet",[$h͏_a => (WeakSet = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["functionPrototype",[$h͏_a => (functionPrototype = $h͏_a)]],["functionToString",[$h͏_a => (functionToString = $h͏_a)]],["stringEndsWith",[$h͏_a => (stringEndsWith = $h͏_a)]],["weaksetAdd",[$h͏_a => (weaksetAdd = $h͏_a)]],["weaksetHas",[$h͏_a => (weaksetHas = $h͏_a)]]]]]);










const nativeSuffix = ') { [native code] }';

// Note: Top level mutable state. Does not make anything worse, since the
// patching of `Function.prototype.toString` is also globally stateful. We
// use this top level state so that multiple calls to `tameFunctionToString` are
// idempotent, rather than creating redundant indirections.
let markVirtualizedNativeFunction;

/**
 * Replace `Function.prototype.toString` with one that recognizes
 * shimmed functions as honorary native functions.
 */
       const tameFunctionToString = () => {
  if (markVirtualizedNativeFunction === undefined) {
    const virtualizedNativeFunctions = new WeakSet();

    const tamingMethods = {
      toString() {
        const str = functionToString(this);
        if (
          stringEndsWith(str, nativeSuffix) ||
          !weaksetHas(virtualizedNativeFunctions, this)
        ) {
          return str;
        }
        return `function ${this.name}() { [native code] }`;
      },
    };

    defineProperty(functionPrototype, 'toString', {
      value: tamingMethods.toString,
    });

    markVirtualizedNativeFunction = freeze(func =>
      weaksetAdd(virtualizedNativeFunctions, func),
    );
  }
  return markVirtualizedNativeFunction;
};$h͏_once.tameFunctionToString(tameFunctionToString);
})()
,
// === 40. ses ./src/tame-domains.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let TypeError,globalThis,getOwnPropertyDescriptor,defineProperty;$h͏_imports([["./commons.js", [["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["globalThis",[$h͏_a => (globalThis = $h͏_a)]],["getOwnPropertyDescriptor",[$h͏_a => (getOwnPropertyDescriptor = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]]]]]);Object.defineProperty(tameDomains,'name',{value:"tameDomains"});$h͏_once.tameDomains(tameDomains);








       function tameDomains(domainTaming = 'safe') {
  if (domainTaming === 'unsafe') {
    return;
  }

  // Protect against the hazard presented by Node.js domains.
  const globalProcess = globalThis.process || undefined;
  if (typeof globalProcess === 'object') {
    // Check whether domains were initialized.
    const domainDescriptor = getOwnPropertyDescriptor(globalProcess, 'domain');
    if (domainDescriptor !== undefined && domainDescriptor.get !== undefined) {
      // The domain descriptor on Node.js initially has value: null, which
      // becomes a get, set pair after domains initialize.
      // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_NO_DOMAINS.md
      throw TypeError(
        `SES failed to lockdown, Node.js domains have been initialized (SES_NO_DOMAINS)`,
      );
    }
    // Prevent domains from initializing.
    // This is clunky because the exception thrown from the domains package does
    // not direct the user's gaze toward a knowledge base about the problem.
    // The domain module merely throws an exception when it attempts to define
    // the domain property of the process global during its initialization.
    // We have no better recourse because Node.js uses defineProperty too.
    defineProperty(globalProcess, 'domain', {
      value: null,
      configurable: false,
      writable: false,
      enumerable: false,
    });
  }
}
})()
,
// === 41. ses ./src/tame-module-source.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let functionPrototype,getPrototypeOf,globalThis,objectPrototype,setPrototypeOf;$h͏_imports([["./commons.js", [["functionPrototype",[$h͏_a => (functionPrototype = $h͏_a)]],["getPrototypeOf",[$h͏_a => (getPrototypeOf = $h͏_a)]],["globalThis",[$h͏_a => (globalThis = $h͏_a)]],["objectPrototype",[$h͏_a => (objectPrototype = $h͏_a)]],["setPrototypeOf",[$h͏_a => (setPrototypeOf = $h͏_a)]]]]]);







       const tameModuleSource = () => {
  const newIntrinsics = {};

  const ModuleSource = globalThis.ModuleSource;
  if (ModuleSource !== undefined) {
    newIntrinsics.ModuleSource = ModuleSource;

    // We introduce ModuleSource.[[Proto]] === AbstractModuleSource
    // and ModuleSource.prototype.[[Proto]] === AbstractModuleSource.prototype
    // if that layer is absent because the permitting system can more
    // gracefully tolerate the absence of an expected prototype than the
    // presence of an unexpected prototype,.
    function AbstractModuleSource() {
      // no-op safe to super()
    }

    const ModuleSourceProto = getPrototypeOf(ModuleSource);
    if (ModuleSourceProto === functionPrototype) {
      setPrototypeOf(ModuleSource, AbstractModuleSource);
      newIntrinsics['%AbstractModuleSource%'] = AbstractModuleSource;
      newIntrinsics['%AbstractModuleSourcePrototype%'] =
        AbstractModuleSource.prototype;
    } else {
      newIntrinsics['%AbstractModuleSource%'] = ModuleSourceProto;
      newIntrinsics['%AbstractModuleSourcePrototype%'] =
        ModuleSourceProto.prototype;
    }

    const ModuleSourcePrototype = ModuleSource.prototype;
    if (ModuleSourcePrototype !== undefined) {
      newIntrinsics['%ModuleSourcePrototype%'] = ModuleSourcePrototype;

      // ModuleSource.prototype.__proto__ should be the
      // AbstractModuleSource.prototype.
      const ModuleSourcePrototypeProto = getPrototypeOf(ModuleSourcePrototype);
      if (ModuleSourcePrototypeProto === objectPrototype) {
        setPrototypeOf(ModuleSource.prototype, AbstractModuleSource.prototype);
      }
    }
  }

  return newIntrinsics;
};$h͏_once.tameModuleSource(tameModuleSource);
})()
,
// === 42. ses ./src/error/console.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let WeakSet,arrayFilter,arrayFlatMap,arrayMap,arrayPop,arrayPush,defineProperty,freeze,fromEntries,isError,stringEndsWith,stringIncludes,stringSplit,weaksetAdd,weaksetHas;$h͏_imports([["../commons.js", [["WeakSet",[$h͏_a => (WeakSet = $h͏_a)]],["arrayFilter",[$h͏_a => (arrayFilter = $h͏_a)]],["arrayFlatMap",[$h͏_a => (arrayFlatMap = $h͏_a)]],["arrayMap",[$h͏_a => (arrayMap = $h͏_a)]],["arrayPop",[$h͏_a => (arrayPop = $h͏_a)]],["arrayPush",[$h͏_a => (arrayPush = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["fromEntries",[$h͏_a => (fromEntries = $h͏_a)]],["isError",[$h͏_a => (isError = $h͏_a)]],["stringEndsWith",[$h͏_a => (stringEndsWith = $h͏_a)]],["stringIncludes",[$h͏_a => (stringIncludes = $h͏_a)]],["stringSplit",[$h͏_a => (stringSplit = $h͏_a)]],["weaksetAdd",[$h͏_a => (weaksetAdd = $h͏_a)]],["weaksetHas",[$h͏_a => (weaksetHas = $h͏_a)]]]]]);
























/**
 * @import {FilterConsole, LogSeverity, VirtualConsole} from './types.js'
 * @import {ErrorInfo, ErrorInfoKind, LogRecord, NoteCallback, LoggedErrorHandler, MakeCausalConsole, MakeLoggingConsoleKit} from "./internal-types.js";
 */

/**
 * Explicitly set a function's name, supporting use of arrow functions for which
 * source text doesn't include a name and no initial name is set by
 * NamedEvaluation
 * https://tc39.es/ecma262/multipage/syntax-directed-operations.html#sec-runtime-semantics-namedevaluation
 * Instead, we hope that tooling uses only the explicit `name` property.
 *
 * @template {Function} F
 * @param {string} name
 * @param {F} fn
 * @returns {F}
 */
const defineName = (name, fn) => defineProperty(fn, 'name', { value: name });

// For our internal debugging purposes, uncomment
// const internalDebugConsole = console;

// The permitted console methods, from:
// Whatwg "living standard" https://console.spec.whatwg.org/
// Node https://nodejs.org/dist/latest-v14.x/docs/api/console.html
// MDN https://developer.mozilla.org/en-US/docs/Web/API/Console_API
// TypeScript https://openstapps.gitlab.io/projectmanagement/interfaces/_node_modules__types_node_globals_d_.console.html
// Chrome https://developers.google.com/web/tools/chrome-devtools/console/api

// All console level methods have parameters (fmt?, ...args)
// where the argument sequence `fmt?, ...args` formats args according to
// fmt if fmt is a format string. Otherwise, it just renders them all as values
// separated by spaces.
// https://console.spec.whatwg.org/#formatter
// https://nodejs.org/docs/latest/api/util.html#util_util_format_format_args

// For the causal console, all occurrences of `fmt, ...args` or `...args` by
// itself must check for the presence of an error to ask the
// `loggedErrorHandler` to handle.
// In theory we should do a deep inspection to detect for example an array
// containing an error. We currently do not detect these and may never.

/** @typedef {keyof VirtualConsole | 'profile' | 'profileEnd'} ConsoleProps */

/**
 * Those console methods whose actual parameters are `(fmt?, ...args)`
 * even if their TypeScript types claim otherwise.
 *
 * Each is paired with what we consider to be their log severity level.
 * This is the same as the log severity of these on other
 * platform console implementations when they all agree.
 *
 * @type {readonly [ConsoleProps, LogSeverity | undefined][]}
 */
       const consoleLevelMethods = freeze([
  ['debug', 'debug'], // (fmt?, ...args) verbose level on Chrome
  ['log', 'log'], // (fmt?, ...args) info level on Chrome
  ['info', 'info'], // (fmt?, ...args)
  ['warn', 'warn'], // (fmt?, ...args)
  ['error', 'error'], // (fmt?, ...args)

  ['trace', 'log'], // (fmt?, ...args)
  ['dirxml', 'log'], // (fmt?, ...args)          but TS typed (...data)
  ['group', 'log'], // (fmt?, ...args)           but TS typed (...label)
  ['groupCollapsed', 'log']  // (fmt?, ...args)  but TS typed (...label)
]);

/**
 * Those console methods other than those already enumerated by
 * `consoleLevelMethods`.
 *
 * Each is paired with what we consider to be their log severity level.
 * This is the same as the log severity of these on other
 * platform console implementations when they all agree.
 *
 * @type {readonly [ConsoleProps, LogSeverity | undefined][]}
 */$h͏_once.consoleLevelMethods(consoleLevelMethods);
       const consoleOtherMethods = freeze([
  ['assert', 'error'], // (value, fmt?, ...args)
  ['timeLog', 'log'], // (label?, ...args) no fmt string

  // Insensitive to whether any argument is an error. All arguments can pass
  // thru to baseConsole as is.
  ['clear', undefined], // ()
  ['count', 'info'], // (label?)
  ['countReset', undefined], // (label?)
  ['dir', 'log'], // (item, options?)
  ['groupEnd', 'log'], // ()
  // In theory tabular data may be or contain an error. However, we currently
  // do not detect these and may never.
  ['table', 'log'], // (tabularData, properties?)
  ['time', 'info'], // (label?)
  ['timeEnd', 'info'], // (label?)

  // Node Inspector only, MDN, and TypeScript, but not whatwg
  ['profile', undefined], // (label?)
  ['profileEnd', undefined], // (label?)
  ['timeStamp', undefined]  // (label?)
]);

/** @type {readonly [ConsoleProps, LogSeverity | undefined][]} */$h͏_once.consoleOtherMethods(consoleOtherMethods);
const consoleMethodPermits = freeze([
  ...consoleLevelMethods,
  ...consoleOtherMethods,
]);

/**
 * consoleOmittedProperties is currently unused. I record and maintain it here
 * with the intention that it be treated like the `false` entries in the main
 * SES permits: that seeing these on the original console is expected, but
 * seeing anything else that's outside the permits is surprising and should
 * provide a diagnostic.
 *
 * const consoleOmittedProperties = freeze([
 *   'memory', // Chrome
 *   'exception', // FF, MDN
 *   '_ignoreErrors', // Node
 *   '_stderr', // Node
 *   '_stderrErrorHandler', // Node
 *   '_stdout', // Node
 *   '_stdoutErrorHandler', // Node
 *   '_times', // Node
 *   'context', // Chrome, Node
 *   'record', // Safari
 *   'recordEnd', // Safari
 *
 *   'screenshot', // Safari
 *   // Symbols
 *   '@@toStringTag', // Chrome: "Object", Safari: "Console"
 *   // A variety of other symbols also seen on Node
 * ]);
 */

// //////////////////////////// Logging Console ////////////////////////////////

/** @type {MakeLoggingConsoleKit} */
       const makeLoggingConsoleKit = (
  loggedErrorHandler,
  { shouldResetForDebugging = false } = {},
) => {
  if (shouldResetForDebugging) {
    // eslint-disable-next-line @endo/no-polymorphic-call
    loggedErrorHandler.resetErrorTagNum();
  }

  // Not frozen!
  let logArray = [];

  const loggingConsole = fromEntries(
    arrayMap(consoleMethodPermits, ([name, _]) => {
      /**
       * @param {...any} args
       */
      const method = defineName(name, (...args) => {
        arrayPush(logArray, [name, ...args]);
      });
      return [name, freeze(method)];
    }),
  );
  freeze(loggingConsole);

  const takeLog = () => {
    const result = freeze(logArray);
    logArray = [];
    return result;
  };
  freeze(takeLog);

  const typedLoggingConsole = /** @type {VirtualConsole} */ (loggingConsole);

  return freeze({ loggingConsole: typedLoggingConsole, takeLog });
};$h͏_once.makeLoggingConsoleKit(makeLoggingConsoleKit);
freeze(makeLoggingConsoleKit);

/**
 * Makes the same calls on a `baseConsole` that were made on a
 * `loggingConsole` to produce this `log`. In this way, a logging console
 * can be used as a buffer to delay the application of these calls to a
 * `baseConsole`.
 *
 * @param {LogRecord[]} log
 * @param {VirtualConsole} baseConsole
 */
       const pumpLogToConsole = (log, baseConsole) => {
  for (const [name, ...args] of log) {
    // eslint-disable-next-line @endo/no-polymorphic-call
    baseConsole[name](...args);
  }
};
// //////////////////////////// Causal Console /////////////////////////////////

/** @type {ErrorInfo} */$h͏_once.pumpLogToConsole(pumpLogToConsole);
const ErrorInfo = {
  NOTE: 'ERROR_NOTE:',
  MESSAGE: 'ERROR_MESSAGE:',
  CAUSE: 'cause:',
  ERRORS: 'errors:',
};
freeze(ErrorInfo);

/** @type {MakeCausalConsole} */
       const makeCausalConsole = (baseConsole, loggedErrorHandler) => {
  if (!baseConsole) {
    return undefined;
  }

  const { getStackString, tagError, takeMessageLogArgs, takeNoteLogArgsArray } =
    loggedErrorHandler;

  /**
   * @param {ReadonlyArray<any>} logArgs
   * @param {Array<any>} subErrorsSink
   * @returns {any}
   */
  const extractErrorArgs = (logArgs, subErrorsSink) => {
    const argTags = arrayMap(logArgs, arg => {
      if (isError(arg)) {
        arrayPush(subErrorsSink, arg);
        return `(${tagError(arg)})`;
      }
      return arg;
    });
    return argTags;
  };

  /**
   * @param {LogSeverity} severity
   * @param {Error} error
   * @param {ErrorInfoKind} kind
   * @param {readonly any[]} logArgs
   * @param {Array<Error>} subErrorsSink
   */
  const logErrorInfo = (severity, error, kind, logArgs, subErrorsSink) => {
    const errorTag = tagError(error);
    const errorName =
      kind === ErrorInfo.MESSAGE ? `${errorTag}:` : `${errorTag} ${kind}`;
    const argTags = extractErrorArgs(logArgs, subErrorsSink);
    // eslint-disable-next-line @endo/no-polymorphic-call
    baseConsole[severity](errorName, ...argTags);
  };

  /**
   * Logs the `subErrors` within a group name mentioning `optTag`.
   *
   * @param {LogSeverity} severity
   * @param {Error[]} subErrors
   * @param {string | undefined} optTag
   * @returns {void}
   */
  const logSubErrors = (severity, subErrors, optTag = undefined) => {
    if (subErrors.length === 0) {
      return;
    }
    if (subErrors.length === 1 && optTag === undefined) {
      // eslint-disable-next-line no-use-before-define
      logError(severity, subErrors[0]);
      return;
    }
    let label;
    if (subErrors.length === 1) {
      label = `Nested error`;
    } else {
      label = `Nested ${subErrors.length} errors`;
    }
    if (optTag !== undefined) {
      label = `${label} under ${optTag}`;
    }
    // eslint-disable-next-line @endo/no-polymorphic-call
    baseConsole.group(label);
    try {
      for (const subError of subErrors) {
        // eslint-disable-next-line no-use-before-define
        logError(severity, subError);
      }
    } finally {
      if (baseConsole.groupEnd) {
        // eslint-disable-next-line @endo/no-polymorphic-call
        baseConsole.groupEnd();
      }
    }
  };

  const errorsLogged = new WeakSet();

  /** @type {(severity: LogSeverity) => NoteCallback} */
  const makeNoteCallback = severity => (error, noteLogArgs) => {
    const subErrors = [];
    // Annotation arrived after the error has already been logged,
    // so just log the annotation immediately, rather than remembering it.
    logErrorInfo(severity, error, ErrorInfo.NOTE, noteLogArgs, subErrors);
    logSubErrors(severity, subErrors, tagError(error));
  };

  /**
   * @param {LogSeverity} severity
   * @param {Error} error
   */
  const logError = (severity, error) => {
    if (weaksetHas(errorsLogged, error)) {
      return;
    }
    const errorTag = tagError(error);
    weaksetAdd(errorsLogged, error);
    const subErrors = [];
    const messageLogArgs = takeMessageLogArgs(error);
    const noteLogArgsArray = takeNoteLogArgsArray(
      error,
      makeNoteCallback(severity),
    );
    // Show the error's most informative error message
    if (messageLogArgs === undefined) {
      // If there is no message log args, then just show the message that
      // the error itself carries.
      // eslint-disable-next-line @endo/no-polymorphic-call
      baseConsole[severity](`${errorTag}:`, error.message);
    } else {
      // If there is one, we take it to be strictly more informative than the
      // message string carried by the error, so show it *instead*.
      logErrorInfo(
        severity,
        error,
        ErrorInfo.MESSAGE,
        messageLogArgs,
        subErrors,
      );
    }
    // After the message but before any other annotations, show the stack.
    let stackString = getStackString(error);
    if (
      typeof stackString === 'string' &&
      stackString.length >= 1 &&
      !stringEndsWith(stackString, '\n')
    ) {
      stackString += '\n';
    }
    // eslint-disable-next-line @endo/no-polymorphic-call
    baseConsole[severity](stackString);
    // Show the other annotations on error
    if (error.cause) {
      logErrorInfo(severity, error, ErrorInfo.CAUSE, [error.cause], subErrors);
    }
    // @ts-expect-error AggregateError has an `errors` property.
    if (error.errors) {
      // @ts-expect-error AggregateError has an `errors` property.
      logErrorInfo(severity, error, ErrorInfo.ERRORS, error.errors, subErrors);
    }
    for (const noteLogArgs of noteLogArgsArray) {
      logErrorInfo(severity, error, ErrorInfo.NOTE, noteLogArgs, subErrors);
    }
    // explain all the errors seen in the messages already emitted.
    logSubErrors(severity, subErrors, errorTag);
  };

  const levelMethods = arrayMap(consoleLevelMethods, ([level, _]) => {
    /**
     * @param {...any} logArgs
     */
    const levelMethod = defineName(level, (...logArgs) => {
      const subErrors = [];
      const argTags = extractErrorArgs(logArgs, subErrors);
      if (baseConsole[level]) {
        // eslint-disable-next-line @endo/no-polymorphic-call
        baseConsole[level](...argTags);
      }
      // @ts-expect-error ConsoleProp vs LogSeverity mismatch
      logSubErrors(level, subErrors);
    });
    return [level, freeze(levelMethod)];
  });
  const otherMethodNames = arrayFilter(
    consoleOtherMethods,
    ([name, _]) => name in baseConsole,
  );
  const otherMethods = arrayMap(otherMethodNames, ([name, _]) => {
    /**
     * @param {...any} args
     */
    const otherMethod = defineName(name, (...args) => {
      // @ts-ignore
      // eslint-disable-next-line @endo/no-polymorphic-call
      baseConsole[name](...args);
      return undefined;
    });
    return [name, freeze(otherMethod)];
  });

  const causalConsole = fromEntries([...levelMethods, ...otherMethods]);
  return /** @type {VirtualConsole} */ (freeze(causalConsole));
};$h͏_once.makeCausalConsole(makeCausalConsole);
freeze(makeCausalConsole);

/**
 * @typedef {(...args: unknown[]) => void} Logger
 */

/**
 * This is a rather horrible kludge to indent the output to a logger in
 * the case where some arguments are strings containing newlines. Part of
 * the problem is that console-like loggers, including the one in ava,
 * join the string arguments of the log message with a space.
 * Because of this, there's an extra space at the beginning of each of
 * the split lines. So this kludge compensated by putting an extra empty
 * string at the beginning, so that the logger will add the same extra
 * joiner.
 * TODO: Fix this horrible kludge, and indent in a sane manner.
 *
 * @param {string} str
 * @param {string} sep
 * @param {string[]} indents
 * @returns {string[]}
 */
const indentAfterAllSeps = (str, sep, indents) => {
  const [firstLine, ...restLines] = stringSplit(str, sep);
  const indentedRest = arrayFlatMap(restLines, line => [sep, ...indents, line]);
  return ['', firstLine, ...indentedRest];
};

/**
 * @param {LoggedErrorHandler} loggedErrorHandler
 */
       const defineCausalConsoleFromLogger = loggedErrorHandler => {
  /**
   * Implement the `VirtualConsole` API badly by turning all calls into
   * calls on `tlogger`. We need to do this to have `console` logging
   * turn into calls to Ava's `t.log`, so these console log messages
   * are output in the right place.
   *
   * @param {Logger} tlogger
   * @returns {VirtualConsole}
   */
  const makeCausalConsoleFromLogger = tlogger => {
    const indents = [];
    const logWithIndent = (...args) => {
      if (indents.length > 0) {
        args = arrayFlatMap(args, arg =>
          typeof arg === 'string' && stringIncludes(arg, '\n')
            ? indentAfterAllSeps(arg, '\n', indents)
            : [arg],
        );
        args = [...indents, ...args];
      }
      return tlogger(...args);
    };

    const baseConsole = fromEntries([
      ...arrayMap(consoleLevelMethods, ([name]) => [
        name,
        defineName(name, (...args) => logWithIndent(...args)),
      ]),
      ...arrayMap(consoleOtherMethods, ([name]) => [
        name,
        defineName(name, (...args) => logWithIndent(name, ...args)),
      ]),
    ]);
    // https://console.spec.whatwg.org/#grouping
    for (const name of ['group', 'groupCollapsed']) {
      if (baseConsole[name]) {
        baseConsole[name] = defineName(name, (...args) => {
          if (args.length >= 1) {
            // Prefix the logged data with "group" or "groupCollapsed".
            logWithIndent(...args);
          }
          // A single space is enough;
          // the host console will separate them with additional spaces.
          arrayPush(indents, ' ');
        });
      } else {
        baseConsole[name] = defineName(name, () => {});
      }
    }
    baseConsole.groupEnd = defineName(
      'groupEnd',
      baseConsole.groupEnd
        ? (...args) => {
            arrayPop(indents);
          }
        : () => {},
    );
    harden(baseConsole);
    const causalConsole = makeCausalConsole(
      /** @type {VirtualConsole} */ (baseConsole),
      loggedErrorHandler,
    );
    return /** @type {VirtualConsole} */ (causalConsole);
  };
  return freeze(makeCausalConsoleFromLogger);
};$h͏_once.defineCausalConsoleFromLogger(defineCausalConsoleFromLogger);
freeze(defineCausalConsoleFromLogger);

// ///////////////////////// Filter Console ////////////////////////////////////

/** @type {FilterConsole} */
       const filterConsole = (baseConsole, filter, _topic = undefined) => {
  // TODO do something with optional topic string
  const methodPermits = arrayFilter(
    consoleMethodPermits,
    ([name, _]) => name in baseConsole,
  );
  const methods = arrayMap(methodPermits, ([name, severity]) => {
    /**
     * @param {...any} args
     */
    const method = defineName(name, (...args) => {
      // eslint-disable-next-line @endo/no-polymorphic-call
      if (severity === undefined || filter.canLog(severity)) {
        // @ts-ignore
        // eslint-disable-next-line @endo/no-polymorphic-call
        baseConsole[name](...args);
      }
    });
    return [name, freeze(method)];
  });
  const filteringConsole = fromEntries(methods);
  return /** @type {VirtualConsole} */ (freeze(filteringConsole));
};$h͏_once.filterConsole(filterConsole);
freeze(filterConsole);
})()
,
// === 43. ses ./src/error/unhandled-rejection.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let FinalizationRegistry,Map,mapGet,mapDelete,WeakMap,mapSet,finalizationRegistryRegister,weakmapSet,weakmapGet,mapEntries,mapHas;$h͏_imports([["../commons.js", [["FinalizationRegistry",[$h͏_a => (FinalizationRegistry = $h͏_a)]],["Map",[$h͏_a => (Map = $h͏_a)]],["mapGet",[$h͏_a => (mapGet = $h͏_a)]],["mapDelete",[$h͏_a => (mapDelete = $h͏_a)]],["WeakMap",[$h͏_a => (WeakMap = $h͏_a)]],["mapSet",[$h͏_a => (mapSet = $h͏_a)]],["finalizationRegistryRegister",[$h͏_a => (finalizationRegistryRegister = $h͏_a)]],["weakmapSet",[$h͏_a => (weakmapSet = $h͏_a)]],["weakmapGet",[$h͏_a => (weakmapGet = $h͏_a)]],["mapEntries",[$h͏_a => (mapEntries = $h͏_a)]],["mapHas",[$h͏_a => (mapHas = $h͏_a)]]]]]);














/**
 * Create rejection-tracking machinery compatible with Node.js and browsers.
 *
 * Note that modern browsers *prevent* access to the 'unhandledrejection' and
 * 'rejectionhandled' events needed:
 * - in cross-origin mode, like when served from file://
 * - in the browser console (interactively typed-in code)
 * - in the debugger
 *
 * Then, they just look like: `Uncaught (in promise) Error: ...` and don't
 * implement the machinery.
 *
 * The solution is to serve your web page from an http:// or https:// web server
 * and execute actual code.
 *
 * @param {(reason: unknown) => void} reportReason report the reason for an
 * unhandled rejection.
 */
       const makeRejectionHandlers = reportReason => {
  if (FinalizationRegistry === undefined) {
    return undefined;
  }

  /** @typedef {number} ReasonId */
  let lastReasonId = 0;

  /** @type {Map<ReasonId, unknown>} */
  const idToReason = new Map();

  /** @type {(() => void) | undefined} */
  let cancelChecking;

  const removeReasonId = reasonId => {
    mapDelete(idToReason, reasonId);
    if (cancelChecking && idToReason.size === 0) {
      // No more unhandled rejections to check, just cancel the check.
      cancelChecking();
      cancelChecking = undefined;
    }
  };

  /** @type {WeakMap<Promise, ReasonId>} */
  const promiseToReasonId = new WeakMap();

  /**
   * Clean up and report the reason for a GCed unhandled rejection.
   *
   * @param {ReasonId} heldReasonId
   */
  const finalizeDroppedPromise = heldReasonId => {
    if (mapHas(idToReason, heldReasonId)) {
      const reason = mapGet(idToReason, heldReasonId);
      removeReasonId(heldReasonId);
      reportReason(reason);
    }
  };

  /** @type {FinalizationRegistry<ReasonId>} */
  const promiseToReason = new FinalizationRegistry(finalizeDroppedPromise);

  /**
   * Track a rejected promise and its corresponding reason if there is no
   * rejection handler synchronously attached.
   *
   * @param {unknown} reason
   * @param {Promise} pr
   */
  const unhandledRejectionHandler = (reason, pr) => {
    lastReasonId += 1;
    const reasonId = lastReasonId;

    // Update bookkeeping.
    mapSet(idToReason, reasonId, reason);
    weakmapSet(promiseToReasonId, pr, reasonId);
    finalizationRegistryRegister(promiseToReason, pr, reasonId, pr);
  };

  /**
   * Deal with the addition of a handler to a previously rejected promise.
   *
   * Just remove it from our list.  Let the FinalizationRegistry or
   * processTermination report any GCed unhandled rejected promises.
   *
   * @param {Promise} pr
   */
  const rejectionHandledHandler = pr => {
    const reasonId = weakmapGet(promiseToReasonId, pr);
    removeReasonId(reasonId);
  };

  /**
   * Report all the unhandled rejections, now that we are abruptly terminating
   * the agent cluster.
   */
  const processTerminationHandler = () => {
    for (const [reasonId, reason] of mapEntries(idToReason)) {
      removeReasonId(reasonId);
      reportReason(reason);
    }
  };

  return {
    rejectionHandledHandler,
    unhandledRejectionHandler,
    processTerminationHandler,
  };
};$h͏_once.makeRejectionHandlers(makeRejectionHandlers);
})()
,
// === 44. ses ./src/error/tame-console.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let TypeError,apply,defineProperty,freeze,globalThis,defaultHandler,makeCausalConsole,makeRejectionHandlers;$h͏_imports([["../commons.js", [["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["apply",[$h͏_a => (apply = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["globalThis",[$h͏_a => (globalThis = $h͏_a)]]]],["./assert.js", [["loggedErrorHandler",[$h͏_a => (defaultHandler = $h͏_a)]]]],["./console.js", [["makeCausalConsole",[$h͏_a => (makeCausalConsole = $h͏_a)]]]],["./unhandled-rejection.js", [["makeRejectionHandlers",[$h͏_a => (makeRejectionHandlers = $h͏_a)]]]]]);













/**
 * @import {VirtualConsole} from './types.js'
 * @import {GetStackString} from './internal-types.js';
 */

const failFast = message => {
  throw TypeError(message);
};

const wrapLogger = (logger, thisArg) =>
  freeze((...args) => apply(logger, thisArg, args));

/**
 * Wrap console unless suppressed.
 * At the moment, the console is considered a host power in the start
 * compartment, and not a primordial. Hence it is absent from the whilelist
 * and bypasses the intrinsicsCollector.
 *
 * @param {"safe" | "unsafe"} consoleTaming
 * @param {"platform" | "exit" | "abort" | "report" | "none"} [errorTrapping]
 * @param {"report" | "none"} [unhandledRejectionTrapping]
 * @param {GetStackString=} optGetStackString
 */
       const tameConsole = (
  consoleTaming = 'safe',
  errorTrapping = 'platform',
  unhandledRejectionTrapping = 'report',
  optGetStackString = undefined,
) => {
  let loggedErrorHandler;
  if (optGetStackString === undefined) {
    loggedErrorHandler = defaultHandler;
  } else {
    loggedErrorHandler = {
      ...defaultHandler,
      getStackString: optGetStackString,
    };
  }

  // eslint-disable-next-line no-restricted-globals
  const originalConsole = /** @type {VirtualConsole} */ (
    // eslint-disable-next-line no-nested-ternary
    typeof globalThis.console !== 'undefined'
      ? globalThis.console
      : typeof globalThis.print === 'function'
        ? // Make a good-enough console for eshost (including only functions that
          // log at a specific level with no special argument interpretation).
          // https://console.spec.whatwg.org/#logging
          (p => freeze({ debug: p, log: p, info: p, warn: p, error: p }))(
            // eslint-disable-next-line no-undef
            wrapLogger(globalThis.print),
          )
        : undefined
  );

  // Upgrade a log-only console (as in `eshost -h SpiderMonkey`).
  if (originalConsole && originalConsole.log) {
    for (const methodName of ['warn', 'error']) {
      if (!originalConsole[methodName]) {
        defineProperty(originalConsole, methodName, {
          value: wrapLogger(originalConsole.log, originalConsole),
        });
      }
    }
  }

  const ourConsole = /** @type {VirtualConsole} */ (
    consoleTaming === 'unsafe'
      ? originalConsole
      : makeCausalConsole(originalConsole, loggedErrorHandler)
  );

  // Attach platform-specific error traps such that any error that gets thrown
  // at top-of-turn (the bottom of stack) will get logged by our causal
  // console, revealing the diagnostic information associated with the error,
  // including the stack from when the error was created.

  // In the following Node.js and web browser cases, `process` and `window` are
  // spelled as `globalThis` properties to avoid the overweaning gaze of
  // Parcel, which dutifully installs an unnecessary `process` shim if we ever
  // utter that. That unnecessary shim forces the whole bundle into sloppy mode,
  // which in turn breaks SES's strict mode invariant.

  // Disable the polymorphic check for the rest of this file.  It's too noisy
  // when dealing with platform APIs.
  /* eslint-disable @endo/no-polymorphic-call */

  // Node.js
  const globalProcess = globalThis.process || undefined;
  if (
    errorTrapping !== 'none' &&
    typeof globalProcess === 'object' &&
    typeof globalProcess.on === 'function'
  ) {
    let terminate;
    if (errorTrapping === 'platform' || errorTrapping === 'exit') {
      const { exit } = globalProcess;
      // If there is a function-valued process.on but no function-valued process.exit,
      // fail early without caring whether errorTrapping is "platform" only by default.
      typeof exit === 'function' || failFast('missing process.exit');
      terminate = () => exit(globalProcess.exitCode || -1);
    } else if (errorTrapping === 'abort') {
      terminate = globalProcess.abort;
      typeof terminate === 'function' || failFast('missing process.abort');
    }

    globalProcess.on('uncaughtException', error => {
      // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_UNCAUGHT_EXCEPTION.md
      ourConsole.error('SES_UNCAUGHT_EXCEPTION:', error);
      if (terminate) {
        terminate();
      }
    });
  }
  if (
    unhandledRejectionTrapping !== 'none' &&
    typeof globalProcess === 'object' &&
    typeof globalProcess.on === 'function'
  ) {
    const handleRejection = reason => {
      // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_UNHANDLED_REJECTION.md
      ourConsole.error('SES_UNHANDLED_REJECTION:', reason);
      // 'platform' and 'report' just log the reason.
    };
    // Maybe track unhandled promise rejections.
    const h = makeRejectionHandlers(handleRejection);
    if (h) {
      // Rejection handlers are supported.
      globalProcess.on('unhandledRejection', h.unhandledRejectionHandler);
      globalProcess.on('rejectionHandled', h.rejectionHandledHandler);
      globalProcess.on('exit', h.processTerminationHandler);
    }
  }

  // Browser
  const globalWindow = globalThis.window || undefined;
  if (
    errorTrapping !== 'none' &&
    typeof globalWindow === 'object' &&
    typeof globalWindow.addEventListener === 'function'
  ) {
    globalWindow.addEventListener('error', event => {
      event.preventDefault();
      // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_UNCAUGHT_EXCEPTION.md
      ourConsole.error('SES_UNCAUGHT_EXCEPTION:', event.error);
      // 'platform' and 'report' just log the reason.
      if (errorTrapping === 'exit' || errorTrapping === 'abort') {
        globalWindow.location.href = `about:blank`;
      }
    });
  }
  if (
    unhandledRejectionTrapping !== 'none' &&
    typeof globalWindow === 'object' &&
    typeof globalWindow.addEventListener === 'function'
  ) {
    const handleRejection = reason => {
      // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_UNHANDLED_REJECTION.md
      ourConsole.error('SES_UNHANDLED_REJECTION:', reason);
    };

    const h = makeRejectionHandlers(handleRejection);
    if (h) {
      // Rejection handlers are supported.
      globalWindow.addEventListener('unhandledrejection', event => {
        event.preventDefault();
        h.unhandledRejectionHandler(event.reason, event.promise);
      });

      globalWindow.addEventListener('rejectionhandled', event => {
        event.preventDefault();
        h.rejectionHandledHandler(event.promise);
      });

      globalWindow.addEventListener('beforeunload', _event => {
        h.processTerminationHandler();
      });
    }
  }
  /* eslint-enable @endo/no-polymorphic-call */

  return { console: ourConsole };
};$h͏_once.tameConsole(tameConsole);
})()
,
// === 45. ses ./src/error/tame-v8-error-constructor.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let WeakMap,WeakSet,apply,arrayFilter,arrayJoin,arrayMap,arraySlice,create,defineProperties,freezeRegexp,fromEntries,reflectSet,regexpExec,regexpSearch,weakmapGet,weakmapSet,weaksetAdd,weaksetHas,TypeError;$h͏_imports([["../commons.js", [["WeakMap",[$h͏_a => (WeakMap = $h͏_a)]],["WeakSet",[$h͏_a => (WeakSet = $h͏_a)]],["apply",[$h͏_a => (apply = $h͏_a)]],["arrayFilter",[$h͏_a => (arrayFilter = $h͏_a)]],["arrayJoin",[$h͏_a => (arrayJoin = $h͏_a)]],["arrayMap",[$h͏_a => (arrayMap = $h͏_a)]],["arraySlice",[$h͏_a => (arraySlice = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["defineProperties",[$h͏_a => (defineProperties = $h͏_a)]],["freezeRegexp",[$h͏_a => (freezeRegexp = $h͏_a)]],["fromEntries",[$h͏_a => (fromEntries = $h͏_a)]],["reflectSet",[$h͏_a => (reflectSet = $h͏_a)]],["regexpExec",[$h͏_a => (regexpExec = $h͏_a)]],["regexpSearch",[$h͏_a => (regexpSearch = $h͏_a)]],["weakmapGet",[$h͏_a => (weakmapGet = $h͏_a)]],["weakmapSet",[$h͏_a => (weakmapSet = $h͏_a)]],["weaksetAdd",[$h͏_a => (weaksetAdd = $h͏_a)]],["weaksetHas",[$h͏_a => (weaksetHas = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]]]]]);





















// Permit names from https://v8.dev/docs/stack-trace-api
// Permiting only the names used by error-stack-shim/src/v8StackFrames
// callSiteToFrame to shim the error stack proposal.
const safeV8CallSiteMethodNames = [
  // suppress 'getThis' definitely
  'getTypeName',
  // suppress 'getFunction' definitely
  'getFunctionName',
  'getMethodName',
  'getFileName',
  'getLineNumber',
  'getColumnNumber',
  'getEvalOrigin',
  'isToplevel',
  'isEval',
  'isNative',
  'isConstructor',
  'isAsync',
  // suppress 'isPromiseAll' for now
  // suppress 'getPromiseIndex' for now

  // Additional names found by experiment, absent from
  // https://v8.dev/docs/stack-trace-api
  'getPosition',
  'getScriptNameOrSourceURL',

  'toString'  // TODO replace to use only permitted info
];

// TODO this is a ridiculously expensive way to attenuate callsites.
// Before that matters, we should switch to a reasonable representation.
const safeV8CallSiteFacet = callSite => {
  const methodEntry = name => {
    const method = callSite[name];
    return [name, () => apply(method, callSite, [])];
  };
  const o = fromEntries(arrayMap(safeV8CallSiteMethodNames, methodEntry));
  return create(o, {});
};

const safeV8SST = sst => arrayMap(sst, safeV8CallSiteFacet);

// If it has `/node_modules/` anywhere in it, on Node it is likely
// to be a dependent package of the current package, and so to
// be an infrastructure frame to be dropped from concise stack traces.
const FILENAME_NODE_DEPENDENTS_CENSOR = freezeRegexp(/\/node_modules\//);

// If it begins with `internal/` or `node:internal` then it is likely
// part of the node infrustructre itself, to be dropped from concise
// stack traces.
const FILENAME_NODE_INTERNALS_CENSOR = freezeRegexp(/^(?:node:)?internal\//);

// Frames within SES `assert.js` should be dropped from concise stack traces, as
// these are just steps towards creating the error object in question.
const FILENAME_ASSERT_CENSOR = freezeRegexp(
  /\/packages\/ses\/src\/error\/assert\.js$/,
);

// Frames within the `eventual-send` shim should be dropped so that concise
// deep stacks omit the internals of the eventual-sending mechanism causing
// asynchronous messages to be sent.
// Note that the eventual-send package will move from agoric-sdk to
// Endo, so this rule will be of general interest.
const FILENAME_EVENTUAL_SEND_CENSOR = freezeRegexp(
  /\/packages\/eventual-send\/src\//,
);

// Frames within the `ses-ava` package should be dropped from concise stack
// traces, as they just support exposing error details to AVA.
const FILENAME_SES_AVA_CENSOR = freezeRegexp(
  /\/packages\/ses-ava\/src\/ses-ava-test\.js$/,
);

// Any stack frame whose `fileName` matches any of these censor patterns
// will be omitted from concise stacks.
// TODO Enable users to configure FILENAME_CENSORS via `lockdown` options.
const FILENAME_CENSORS = [
  FILENAME_NODE_DEPENDENTS_CENSOR,
  FILENAME_NODE_INTERNALS_CENSOR,
  FILENAME_ASSERT_CENSOR,
  FILENAME_EVENTUAL_SEND_CENSOR,
  FILENAME_SES_AVA_CENSOR,
];

// Should a stack frame with this as its fileName be included in a concise
// stack trace?
// Exported only so it can be unit tested.
// TODO Move so that it applies not just to v8.
       const filterFileName = fileName => {
  if (fileName === null) {
    // Seems to suppress builtins like `Array.every (<anonymous>)`
    return false;
  }
  for (const filter of FILENAME_CENSORS) {
    if (regexpSearch(filter, fileName) !== -1) {
      return false;
    }
  }
  return true;
};

// The ad-hoc rule of the current pattern is that any likely-file-path or
// likely url-path prefix, ending in a `/.../` should get dropped.
// Anything to the left of the likely path text is kept.
// Everything to the right of `/.../` is kept. Thus
// `'Object.bar (/vat-v1/.../errors/test/deep-send.test.js:13:21)'`
// simplifies to
// `'Object.bar (errors/test/deep-send.test.js:13:21)'`.
//
// See thread starting at
// https://github.com/Agoric/agoric-sdk/issues/2326#issuecomment-773020389
$h͏_once.filterFileName(filterFileName);const CALLSITE_ELLIPSIS_PATTERN1=freezeRegexp(
  /^((?:.*[( ])?)[:/\w_-]*\/\.\.\.\/(.+)$/,
);

// The ad-hoc rule of the current pattern is that any likely-file-path or
// likely url-path prefix consisting of `.../` should get dropped.
// Anything to the left of the likely path text is kept.
// Everything to the right of `.../` is kept. Thus
// `'Object.bar (.../errors/test/deep-send.test.js:13:21)'`
// simplifies to
// `'Object.bar (errors/test/deep-send.test.js:13:21)'`.
//
// See thread starting at
// https://github.com/Agoric/agoric-sdk/issues/2326#issuecomment-773020389
const CALLSITE_ELLIPSIS_PATTERN2 = freezeRegexp(/^((?:.*[( ])?)\.\.\.\/(.+)$/);

// The ad-hoc rule of the current pattern is that any likely-file-path or
// likely url-path prefix, ending in a `/` and prior to `package/` should get
// dropped.
// Anything to the left of the likely path prefix text is kept. `package/` and
// everything to its right is kept. Thus
// `'Object.bar (/Users/markmiller/src/ongithub/agoric/agoric-sdk/packages/errors/test/deep-send.test.js:13:21)'`
// simplifies to
// `'Object.bar (packages/errors/test/deep-send.test.js:13:21)'`.
// Note that `/packages/` is a convention for monorepos encouraged by
// lerna.
const CALLSITE_PACKAGES_PATTERN = freezeRegexp(
  /^((?:.*[( ])?)[:/\w_-]*\/(packages\/.+)$/,
);

// The ad-hoc rule of the current pattern is that any likely-file-path or
// likely url-path prefix of the form `file://` but not `file:///` gets
// dropped.
// Anything to the left of the likely path prefix text is kept. Everything to
// the right of `file://` is kept. Thus
// `'Object.bar (file:///Users/markmiller/src/ongithub/endojs/endo/packages/errors/test/deep-send.test.js:13:21)'` is unchanged but
// `'Object.bar (file://test/deep-send.test.js:13:21)'`

// simplifies to
// `'Object.bar (test/deep-send.test.js:13:21)'`.
// The reason is that `file:///` usually precedes an absolute path which is
// clickable without removing the `file:///`, whereas `file://` usually precedes
// a relative path which, for whatever vscode reason, is not clickable until the
// `file://` is removed.
const CALLSITE_FILE_2SLASH_PATTERN = freezeRegexp(
  /^((?:.*[( ])?)file:\/\/([^/].*)$/,
);

// The use of these callSite patterns below assumes that any match will bind
// capture groups containing the parts of the original string we want
// to keep. The parts outside those capture groups will be dropped from concise
// stacks.
// TODO Enable users to configure CALLSITE_PATTERNS via `lockdown` options.
const CALLSITE_PATTERNS = [
  CALLSITE_ELLIPSIS_PATTERN1,
  CALLSITE_ELLIPSIS_PATTERN2,
  CALLSITE_PACKAGES_PATTERN,
  CALLSITE_FILE_2SLASH_PATTERN,
];

// For a stack frame that should be included in a concise stack trace, if
// `callSiteString` is the original stringified stack frame, return the
// possibly-shorter stringified stack frame that should be shown instead.
// Exported only so it can be unit tested.
// TODO Move so that it applies not just to v8.
/**
 * @param {string} callSiteString
 */
       const shortenCallSiteString = callSiteString => {
  for (const filter of CALLSITE_PATTERNS) {
    const match = regexpExec(filter, callSiteString);
    if (match) {
      return arrayJoin(arraySlice(match, 1), '');
    }
  }
  return callSiteString;
};$h͏_once.shortenCallSiteString(shortenCallSiteString);

       const tameV8ErrorConstructor = (
  OriginalError,
  InitialError,
  errorTaming,
  stackFiltering,
) => {
  if (errorTaming === 'unsafe-debug') {
    throw TypeError(
      'internal: v8+unsafe-debug special case should already be done',
    );
  }
  // TODO: Proper CallSite types
  /** @typedef {{}} CallSite */

  const originalCaptureStackTrace = OriginalError.captureStackTrace;

  const omitFrames =
    stackFiltering === 'concise' || stackFiltering === 'omit-frames';

  const shortenPaths =
    stackFiltering === 'concise' || stackFiltering === 'shorten-paths';

  // const callSiteFilter = _callSite => true;
  const callSiteFilter = callSite => {
    if (omitFrames) {
      // eslint-disable-next-line @endo/no-polymorphic-call
      if (callSite.getFunctionName()?.startsWith('__HIDE_')) {
        return false;
      }
      // eslint-disable-next-line @endo/no-polymorphic-call
      return filterFileName(callSite.getFileName());
    }
    return true;
  };

  const callSiteStringifier = callSite => {
    let callSiteString = `${callSite}`;
    if (shortenPaths) {
      callSiteString = shortenCallSiteString(callSiteString);
    }
    return `\n  at ${callSiteString}`;
  };

  const stackStringFromSST = (_error, sst) =>
    arrayJoin(
      arrayMap(arrayFilter(sst, callSiteFilter), callSiteStringifier),
      '',
    );

  /**
   * @typedef {object} StructuredStackInfo
   * @property {CallSite[]} callSites
   * @property {undefined} [stackString]
   */

  /**
   * @typedef {object} ParsedStackInfo
   * @property {undefined} [callSites]
   * @property {string} stackString
   */

  // Mapping from error instance to the stack for that instance.
  // The stack info is either the structured stack trace
  // or the generated tamed stack string
  /** @type {WeakMap<Error, ParsedStackInfo | StructuredStackInfo>} */
  const stackInfos = new WeakMap();

  // Use concise methods to obtain named functions without constructors.
  const tamedMethods = {
    // The optional `optFn` argument is for cutting off the bottom of
    // the stack --- for capturing the stack only above the topmost
    // call to that function. Since this isn't the "real" captureStackTrace
    // but instead calls the real one, if no other cutoff is provided,
    // we cut this one off.
    captureStackTrace(error, optFn = tamedMethods.captureStackTrace) {
      if (typeof originalCaptureStackTrace === 'function') {
        // OriginalError.captureStackTrace is only on v8
        apply(originalCaptureStackTrace, OriginalError, [error, optFn]);
        return;
      }
      reflectSet(error, 'stack', '');
    },
    // Shim of proposed special power, to reside by default only
    // in the start compartment, for getting the stack traceback
    // string associated with an error.
    // See https://tc39.es/proposal-error-stacks/
    getStackString(error) {
      let stackInfo = weakmapGet(stackInfos, error);

      if (stackInfo === undefined) {
        // The following will call `prepareStackTrace()` synchronously
        // which will populate stackInfos
        // eslint-disable-next-line no-void
        void error.stack;
        stackInfo = weakmapGet(stackInfos, error);
        if (!stackInfo) {
          stackInfo = { stackString: '' };
          weakmapSet(stackInfos, error, stackInfo);
        }
      }

      // prepareStackTrace() may generate the stackString
      // if errorTaming === 'unsafe'

      if (stackInfo.stackString !== undefined) {
        return stackInfo.stackString;
      }

      const stackString = stackStringFromSST(error, stackInfo.callSites);
      weakmapSet(stackInfos, error, { stackString });

      return stackString;
    },
    prepareStackTrace(error, sst) {
      if (errorTaming === 'unsafe') {
        const stackString = stackStringFromSST(error, sst);
        weakmapSet(stackInfos, error, { stackString });
        return `${error}${stackString}`;
      } else {
        weakmapSet(stackInfos, error, { callSites: sst });
        return '';
      }
    },
  };

  // A prepareFn is a prepareStackTrace function.
  // An sst is a `structuredStackTrace`, which is an array of
  // callsites.
  // A user prepareFn is a prepareFn defined by a client of this API,
  // and provided by assigning to `Error.prepareStackTrace`.
  // A user prepareFn should only receive an attenuated sst, which
  // is an array of attenuated callsites.
  // A system prepareFn is the prepareFn created by this module to
  // be installed on the real `Error` constructor, to receive
  // an original sst, i.e., an array of unattenuated callsites.
  // An input prepareFn is a function the user assigns to
  // `Error.prepareStackTrace`, which might be a user prepareFn or
  // a system prepareFn previously obtained by reading
  // `Error.prepareStackTrace`.

  const defaultPrepareFn = tamedMethods.prepareStackTrace;

  OriginalError.prepareStackTrace = defaultPrepareFn;

  // A weakset branding some functions as system prepareFns, all of which
  // must be defined by this module, since they can receive an
  // unattenuated sst.
  const systemPrepareFnSet = new WeakSet([defaultPrepareFn]);

  const systemPrepareFnFor = inputPrepareFn => {
    if (weaksetHas(systemPrepareFnSet, inputPrepareFn)) {
      return inputPrepareFn;
    }
    // Use concise methods to obtain named functions without constructors.
    const systemMethods = {
      prepareStackTrace(error, sst) {
        weakmapSet(stackInfos, error, { callSites: sst });
        return inputPrepareFn(error, safeV8SST(sst));
      },
    };
    weaksetAdd(systemPrepareFnSet, systemMethods.prepareStackTrace);
    return systemMethods.prepareStackTrace;
  };

  // Note `stackTraceLimit` accessor already defined by
  // tame-error-constructor.js
  defineProperties(InitialError, {
    captureStackTrace: {
      value: tamedMethods.captureStackTrace,
      writable: true,
      enumerable: false,
      configurable: true,
    },
    prepareStackTrace: {
      get() {
        return OriginalError.prepareStackTrace;
      },
      set(inputPrepareStackTraceFn) {
        if (typeof inputPrepareStackTraceFn === 'function') {
          const systemPrepareFn = systemPrepareFnFor(inputPrepareStackTraceFn);
          OriginalError.prepareStackTrace = systemPrepareFn;
        } else {
          OriginalError.prepareStackTrace = defaultPrepareFn;
        }
      },
      enumerable: false,
      configurable: true,
    },
  });

  return tamedMethods.getStackString;
};$h͏_once.tameV8ErrorConstructor(tameV8ErrorConstructor);
})()
,
// === 46. ses ./src/error/tame-error-constructor.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let FERAL_ERROR,apply,construct,defineProperties,setPrototypeOf,getOwnPropertyDescriptor,defineProperty,getOwnPropertyDescriptors,NativeErrors,tameV8ErrorConstructor;$h͏_imports([["../commons.js", [["FERAL_ERROR",[$h͏_a => (FERAL_ERROR = $h͏_a)]],["apply",[$h͏_a => (apply = $h͏_a)]],["construct",[$h͏_a => (construct = $h͏_a)]],["defineProperties",[$h͏_a => (defineProperties = $h͏_a)]],["setPrototypeOf",[$h͏_a => (setPrototypeOf = $h͏_a)]],["getOwnPropertyDescriptor",[$h͏_a => (getOwnPropertyDescriptor = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["getOwnPropertyDescriptors",[$h͏_a => (getOwnPropertyDescriptors = $h͏_a)]]]],["../permits.js", [["NativeErrors",[$h͏_a => (NativeErrors = $h͏_a)]]]],["./tame-v8-error-constructor.js", [["tameV8ErrorConstructor",[$h͏_a => (tameV8ErrorConstructor = $h͏_a)]]]]]);












// Present on at least FF and XS. Proposed by Error-proposal. The original
// is dangerous, so tameErrorConstructor replaces it with a safe one.
// We grab the original here before it gets replaced.
const stackDesc = getOwnPropertyDescriptor(FERAL_ERROR.prototype, 'stack');
const stackGetter = stackDesc && stackDesc.get;

// Use concise methods to obtain named functions without constructors.
const tamedMethods = {
  getStackString(error) {
    if (typeof stackGetter === 'function') {
      return apply(stackGetter, error, []);
    } else if ('stack' in error) {
      // The fallback is to just use the de facto `error.stack` if present
      return `${error.stack}`;
    }
    return '';
  },
};
let initialGetStackString = tamedMethods.getStackString;

               function tameErrorConstructor(
  errorTaming = 'safe',
  stackFiltering = 'concise',
) {
  const ErrorPrototype = FERAL_ERROR.prototype;

  const { captureStackTrace: originalCaptureStackTrace } = FERAL_ERROR;
  const platform =
    typeof originalCaptureStackTrace === 'function' ? 'v8' : 'unknown';

  const makeErrorConstructor = (_ = {}) => {
    /**
     * @this {ErrorConstructor}
     * @param {...any} rest
     */
    // eslint-disable-next-line no-shadow
    const ResultError = function Error(...rest) {
      let error;
      if (new.target === undefined) {
        // Forward caller's `this` to FERAL_ERROR to keep the shim transparent.
        // Error() as a function ignores `this` per spec, but do not narrow it.
        error = apply(FERAL_ERROR, this, rest);
      } else {
        error = construct(FERAL_ERROR, rest, new.target);
      }
      if (platform === 'v8') {
        // TODO Likely expensive!
        apply(originalCaptureStackTrace, FERAL_ERROR, [error, ResultError]);
      }
      return error;
    };
    defineProperties(ResultError, {
      length: { value: 1 },
      prototype: {
        value: ErrorPrototype,
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });
    return ResultError;
  };
  const InitialError = makeErrorConstructor({ powers: 'original' });
  const SharedError = makeErrorConstructor({ powers: 'none' });
  defineProperties(ErrorPrototype, {
    constructor: { value: SharedError },
  });

  for (const NativeError of NativeErrors) {
    setPrototypeOf(NativeError, SharedError);
  }

  // https://v8.dev/docs/stack-trace-api#compatibility advises that
  // programmers can "always" set `Error.stackTraceLimit`
  // even on non-v8 platforms. On non-v8
  // it will have no effect, but this advice only makes sense
  // if the assignment itself does not fail, which it would
  // if `Error` were naively frozen. Hence, we add setters that
  // accept but ignore the assignment on non-v8 platforms.
  defineProperties(InitialError, {
    stackTraceLimit: {
      get() {
        if (typeof FERAL_ERROR.stackTraceLimit === 'number') {
          // FERAL_ERROR.stackTraceLimit is only on v8
          return FERAL_ERROR.stackTraceLimit;
        }
        return undefined;
      },
      set(newLimit) {
        if (typeof newLimit !== 'number') {
          // silently do nothing. This behavior doesn't precisely
          // emulate v8 edge-case behavior. But given the purpose
          // of this emulation, having edge cases err towards
          // harmless seems the safer option.
          return;
        }
        if (typeof FERAL_ERROR.stackTraceLimit === 'number') {
          // FERAL_ERROR.stackTraceLimit is only on v8
          FERAL_ERROR.stackTraceLimit = newLimit;
          // We place the useless return on the next line to ensure
          // that anything we place after the if in the future only
          // happens if the then-case does not.
          // eslint-disable-next-line no-useless-return
          return;
        }
      },
      // WTF on v8 stackTraceLimit is enumerable
      enumerable: false,
      configurable: true,
    },
  });

  if (errorTaming === 'unsafe-debug' && platform === 'v8') {
    // This case is a kludge to work around
    // https://github.com/endojs/endo/issues/1798
    // https://github.com/endojs/endo/issues/2348
    // https://github.com/Agoric/agoric-sdk/issues/8662

    defineProperties(InitialError, {
      prepareStackTrace: {
        get() {
          return FERAL_ERROR.prepareStackTrace;
        },
        set(newPrepareStackTrace) {
          FERAL_ERROR.prepareStackTrace = newPrepareStackTrace;
        },
        enumerable: false,
        configurable: true,
      },
      captureStackTrace: {
        value: FERAL_ERROR.captureStackTrace,
        writable: true,
        enumerable: false,
        configurable: true,
      },
    });

    const descs = getOwnPropertyDescriptors(InitialError);
    defineProperties(SharedError, {
      stackTraceLimit: descs.stackTraceLimit,
      prepareStackTrace: descs.prepareStackTrace,
      captureStackTrace: descs.captureStackTrace,
    });

    return {
      '%InitialGetStackString%': initialGetStackString,
      '%InitialError%': InitialError,
      '%SharedError%': SharedError,
    };
  }

  // The default SharedError much be completely powerless even on v8,
  // so the lenient `stackTraceLimit` accessor does nothing on all
  // platforms.
  defineProperties(SharedError, {
    stackTraceLimit: {
      get() {
        return undefined;
      },
      set(_newLimit) {
        // do nothing
      },
      enumerable: false,
      configurable: true,
    },
  });

  if (platform === 'v8') {
    // `SharedError.prepareStackTrace`, if it exists, must also be
    // powerless. However, from what we've heard, depd expects to be able to
    // assign to it without the assignment throwing. It is normally a function
    // that returns a stack string to be magically added to error objects.
    // However, as long as we're adding a lenient standin, we may as well
    // accommodate any who expect to get a function they can call and get
    // a string back. This prepareStackTrace is a do-nothing function that
    // always returns the empty string.
    defineProperties(SharedError, {
      prepareStackTrace: {
        get() {
          return () => '';
        },
        set(_prepareFn) {
          // do nothing
        },
        enumerable: false,
        configurable: true,
      },
      captureStackTrace: {
        value: (errorish, _constructorOpt) => {
          defineProperty(errorish, 'stack', {
            value: '',
          });
        },
        writable: false,
        enumerable: false,
        configurable: true,
      },
    });
  }

  if (platform === 'v8') {
    initialGetStackString = tameV8ErrorConstructor(
      FERAL_ERROR,
      InitialError,
      errorTaming,
      stackFiltering,
    );
  } else if (errorTaming === 'unsafe' || errorTaming === 'unsafe-debug') {
    // v8 has too much magic around their 'stack' own property for it to
    // coexist cleanly with this accessor. So only install it on non-v8

    // Error.prototype.stack property as proposed at
    // https://tc39.es/proposal-error-stacks/
    // with the fix proposed at
    // https://github.com/tc39/proposal-error-stacks/issues/46
    // On others, this still protects from the override mistake,
    // essentially like enable-property-overrides.js would
    // once this accessor property itself is frozen, as will happen
    // later during lockdown.
    //
    // However, there is here a change from the intent in the current
    // state of the proposal. If experience tells us whether this change
    // is a good idea, we should modify the proposal accordingly. There is
    // much code in the world that assumes `error.stack` is a string. So
    // where the proposal accommodates secure operation by making the
    // property optional, we instead accommodate secure operation by
    // having the secure form always return only the stable part, the
    // stringified error instance, and omitting all the frame information
    // rather than omitting the property.
    defineProperties(ErrorPrototype, {
      stack: {
        get() {
          return initialGetStackString(this);
        },
        set(newValue) {
          defineProperties(this, {
            stack: {
              value: newValue,
              writable: true,
              enumerable: true,
              configurable: true,
            },
          });
        },
      },
    });
  } else {
    // v8 has too much magic around their 'stack' own property for it to
    // coexist cleanly with this accessor. So only install it on non-v8
    defineProperties(ErrorPrototype, {
      stack: {
        get() {
          // https://github.com/tc39/proposal-error-stacks/issues/46
          // allows this to not add an unpleasant newline. Otherwise
          // we should fix this.
          return `${this}`;
        },
        set(newValue) {
          defineProperties(this, {
            stack: {
              value: newValue,
              writable: true,
              enumerable: true,
              configurable: true,
            },
          });
        },
      },
    });
  }

  return {
    '%InitialGetStackString%': initialGetStackString,
    '%InitialError%': InitialError,
    '%SharedError%': SharedError,
  };
}$h͏_once.default(      tameErrorConstructor);
})()
,
// === 47. ses ./src/module-load.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let getenv,Map,Set,TypeError,arrayJoin,arrayMap,arrayPush,arraySome,create,freeze,generatorNext,generatorThrow,getOwnPropertyNames,isArray,isPrimitive,mapGet,mapHas,mapSet,promiseThen,setAdd,values,weakmapGet,weakmapHas,makeError,annotateError,q,b,X;$h͏_imports([["@endo/env-options", [["getEnvironmentOption",[$h͏_a => (getenv = $h͏_a)]]]],["./commons.js", [["Map",[$h͏_a => (Map = $h͏_a)]],["Set",[$h͏_a => (Set = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["arrayJoin",[$h͏_a => (arrayJoin = $h͏_a)]],["arrayMap",[$h͏_a => (arrayMap = $h͏_a)]],["arrayPush",[$h͏_a => (arrayPush = $h͏_a)]],["arraySome",[$h͏_a => (arraySome = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["generatorNext",[$h͏_a => (generatorNext = $h͏_a)]],["generatorThrow",[$h͏_a => (generatorThrow = $h͏_a)]],["getOwnPropertyNames",[$h͏_a => (getOwnPropertyNames = $h͏_a)]],["isArray",[$h͏_a => (isArray = $h͏_a)]],["isPrimitive",[$h͏_a => (isPrimitive = $h͏_a)]],["mapGet",[$h͏_a => (mapGet = $h͏_a)]],["mapHas",[$h͏_a => (mapHas = $h͏_a)]],["mapSet",[$h͏_a => (mapSet = $h͏_a)]],["promiseThen",[$h͏_a => (promiseThen = $h͏_a)]],["setAdd",[$h͏_a => (setAdd = $h͏_a)]],["values",[$h͏_a => (values = $h͏_a)]],["weakmapGet",[$h͏_a => (weakmapGet = $h͏_a)]],["weakmapHas",[$h͏_a => (weakmapHas = $h͏_a)]]]],["./error/assert.js", [["makeError",[$h͏_a => (makeError = $h͏_a)]],["annotateError",[$h͏_a => (annotateError = $h͏_a)]],["q",[$h͏_a => (q = $h͏_a)]],["b",[$h͏_a => (b = $h͏_a)]],["X",[$h͏_a => (X = $h͏_a)]]]]]);


























const noop = () => {};

const asyncTrampoline = async (generatorFunc, args, errorWrapper) => {
  await null;
  const iterator = generatorFunc(...args);
  let result = generatorNext(iterator);
  while (!result.done) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const val = await result.value;
      result = generatorNext(iterator, val);
    } catch (error) {
      result = generatorThrow(iterator, errorWrapper(error));
    }
  }
  return result.value;
};

const syncTrampoline = (generatorFunc, args) => {
  const iterator = generatorFunc(...args);
  let result = generatorNext(iterator);
  while (!result.done) {
    try {
      result = generatorNext(iterator, result.value);
    } catch (error) {
      result = generatorThrow(iterator, error);
    }
  }
  return result.value;
};

// `makeAlias` constructs compartment specifier tuples for the `aliases`
// private field of compartments.
// These aliases allow a compartment to alias an internal module specifier to a
// module specifier in an external compartment, and also to create internal
// aliases.
// Both are facilitated by the moduleMap Compartment constructor option.
       const makeAlias = (compartment, specifier) =>
  freeze({ compartment, specifier });

// `resolveAll` pre-computes resolutions of all imports within the compartment
// in which a module was loaded.
$h͏_once.makeAlias(makeAlias);const resolveAll=(imports,resolveHook,fullReferrerSpecifier)=>{
  const resolvedImports = create(null);
  for (const importSpecifier of imports) {
    const fullSpecifier = resolveHook(importSpecifier, fullReferrerSpecifier);
    resolvedImports[importSpecifier] = fullSpecifier;
  }
  return freeze(resolvedImports);
};

const loadModuleSource = (
  compartmentPrivateFields,
  moduleAliases,
  compartment,
  moduleSpecifier,
  moduleSource,
  enqueueJob,
  selectImplementation,
  moduleLoads,
  importMeta,
) => {
  const { resolveHook, name: compartmentName } = weakmapGet(
    compartmentPrivateFields,
    compartment,
  );

  const { imports } = moduleSource;
  if (
    !isArray(imports) ||
    arraySome(imports, specifier => typeof specifier !== 'string')
  ) {
    throw makeError(
      X`Invalid module source: 'imports' must be an array of strings, got ${imports} for module ${q(moduleSpecifier)} of compartment ${q(compartmentName)}`,
    );
  }

  // resolve all imports relative to this referrer module.
  const resolvedImports = resolveAll(imports, resolveHook, moduleSpecifier);
  const moduleRecord = freeze({
    compartment,
    moduleSource,
    moduleSpecifier,
    resolvedImports,
    importMeta,
  });

  // Enqueue jobs to load this module's shallow dependencies.
  for (const fullSpecifier of values(resolvedImports)) {
    // Behold: recursion.
    // eslint-disable-next-line no-use-before-define
    enqueueJob(memoizedLoadWithErrorAnnotation, [
      compartmentPrivateFields,
      moduleAliases,
      compartment,
      fullSpecifier,
      enqueueJob,
      selectImplementation,
      moduleLoads,
    ]);
  }

  return moduleRecord;
};

function* loadWithoutErrorAnnotation(
  compartmentPrivateFields,
  moduleAliases,
  compartment,
  moduleSpecifier,
  enqueueJob,
  selectImplementation,
  moduleLoads,
) {
  const {
    importHook,
    importNowHook,
    moduleMap,
    moduleMapHook,
    moduleRecords,
    parentCompartment,
  } = weakmapGet(compartmentPrivateFields, compartment);

  if (mapHas(moduleRecords, moduleSpecifier)) {
    return mapGet(moduleRecords, moduleSpecifier);
  }

  // Follow moduleMap, or moduleMapHook if present.
  let moduleDescriptor = moduleMap[moduleSpecifier];
  if (moduleDescriptor === undefined && moduleMapHook !== undefined) {
    moduleDescriptor = moduleMapHook(moduleSpecifier);
  }
  if (moduleDescriptor === undefined) {
    const moduleHook = selectImplementation(importHook, importNowHook);
    if (moduleHook === undefined) {
      const moduleHookName = selectImplementation(
        'importHook',
        'importNowHook',
      );
      throw makeError(
        X`${b(moduleHookName)} needed to load module ${q(
          moduleSpecifier,
        )} in compartment ${q(compartment.name)}`,
      );
    }
    moduleDescriptor = moduleHook(moduleSpecifier);
    // Uninitialized module namespaces throw if we attempt to coerce them into
    // promises.
    if (!weakmapHas(moduleAliases, moduleDescriptor)) {
      moduleDescriptor = yield moduleDescriptor;
    }
  }

  if (typeof moduleDescriptor === 'string') {
    // eslint-disable-next-line @endo/no-polymorphic-call
    throw makeError(
      X`Cannot map module ${q(moduleSpecifier)} to ${q(
        moduleDescriptor,
      )} in parent compartment, use {source} module descriptor`,
      TypeError,
    );
  } else if (!isPrimitive(moduleDescriptor)) {
    // In this shim (and not in XS, and not in the standard we imagine), we
    // allow a module namespace object to stand in for a module descriptor that
    // describes its original {compartment, specifier} so that it can be used
    // to create a link.
    let aliasDescriptor = weakmapGet(moduleAliases, moduleDescriptor);
    if (aliasDescriptor !== undefined) {
      moduleDescriptor = aliasDescriptor;
    }

    if (moduleDescriptor.namespace !== undefined) {
      // { namespace: string, compartment?: Compartment }
      // Namespace module descriptors link to a module instance.

      if (typeof moduleDescriptor.namespace === 'string') {
        // The default compartment is the *parent*, not this child compartment.
        // This is a difference from the legacy {specifier, compartment} module
        // descriptor.
        const {
          compartment: aliasCompartment = parentCompartment,
          namespace: aliasSpecifier,
        } = moduleDescriptor;
        if (
          isPrimitive(aliasCompartment) ||
          !weakmapHas(compartmentPrivateFields, aliasCompartment)
        ) {
          throw makeError(
            X`Invalid compartment in module descriptor for specifier ${q(moduleSpecifier)} in compartment ${q(compartment.name)}`,
          );
        }
        // Behold: recursion.
        // eslint-disable-next-line no-use-before-define
        const aliasRecord = yield memoizedLoadWithErrorAnnotation(
          compartmentPrivateFields,
          moduleAliases,
          aliasCompartment,
          aliasSpecifier,
          enqueueJob,
          selectImplementation,
          moduleLoads,
        );
        mapSet(moduleRecords, moduleSpecifier, aliasRecord);
        return aliasRecord;
      }

      // All remaining objects must either be a module namespace, or be
      // promoted into a module namespace with a virtual module source.
      if (!isPrimitive(moduleDescriptor.namespace)) {
        const { namespace } = moduleDescriptor;
        // Brand-check SES shim module exports namespaces:
        aliasDescriptor = weakmapGet(moduleAliases, namespace);
        if (aliasDescriptor !== undefined) {
          moduleDescriptor = aliasDescriptor;
          // Fall through to processing the resulting {compartment, specifier}
          // alias.
        } else {
          // Promote an arbitrary object to a module namespace with a virtual
          // module source.
          // { namespace: Object }
          const exports = getOwnPropertyNames(namespace);
          /** @type {import('../types.js').VirtualModuleSource} */
          const moduleSource = {
            imports: [],
            exports,
            execute(env) {
              for (const name of exports) {
                env[name] = namespace[name];
              }
            },
          };
          const importMeta = undefined;
          const moduleRecord = loadModuleSource(
            compartmentPrivateFields,
            moduleAliases,
            compartment,
            moduleSpecifier,
            moduleSource,
            enqueueJob,
            selectImplementation,
            moduleLoads,
            importMeta,
          );
          mapSet(moduleRecords, moduleSpecifier, moduleRecord);
          return moduleRecord;
        }
      } else {
        throw makeError(
          X`Invalid compartment in module descriptor for specifier ${q(moduleSpecifier)} in compartment ${q(compartment.name)}`,
        );
      }
    }

    if (moduleDescriptor.source !== undefined) {
      // Module source descriptors create an instance from a module source.
      // The descriptor may contain the module source, or refer to a source
      // loaded in a particular compartment.

      if (typeof moduleDescriptor.source === 'string') {
        // { source: string, importMeta?, specifier?: string, compartment? }
        // A string source is the specifier for a different module source.
        // That source may come from this compartment's parent (default), or
        // from a specified compartment, and the specified compartment may be
        // this compartment to make a duplicate.

        const {
          source: loaderSpecifier,
          specifier: instanceSpecifier = moduleSpecifier,
          compartment: loaderCompartment = parentCompartment,
          importMeta = undefined,
        } = moduleDescriptor;

        // Induce the compartment, possibly a different compartment
        // to load a module source.

        // Behold: recursion.
        // eslint-disable-next-line no-use-before-define
        const loaderRecord = yield memoizedLoadWithErrorAnnotation(
          compartmentPrivateFields,
          moduleAliases,
          loaderCompartment,
          loaderSpecifier,
          enqueueJob,
          selectImplementation,
          moduleLoads,
        );

        // Extract the source of the module from the loader compartment's
        // record.
        const { moduleSource } = loaderRecord;

        // Instantiate that source in our own compartment, possibly with a
        // different specifier for resolving its own imports.
        const moduleRecord = loadModuleSource(
          compartmentPrivateFields,
          moduleAliases,
          compartment,
          instanceSpecifier,
          moduleSource,
          enqueueJob,
          selectImplementation,
          moduleLoads,
          importMeta,
        );
        mapSet(moduleRecords, moduleSpecifier, moduleRecord);
        return moduleRecord;
      } else {
        // { source: ModuleSource, importMeta?, specifier?: string }
        // We assume all non-string module sources are any of the supported
        // kinds of module source: PrecompiledModuleSource,
        // VirtualModuleSource, or a native ModuleSource.

        const {
          source: moduleSource,
          specifier: aliasSpecifier = moduleSpecifier,
          importMeta,
        } = moduleDescriptor;

        const aliasRecord = loadModuleSource(
          compartmentPrivateFields,
          moduleAliases,
          compartment,
          aliasSpecifier,
          moduleSource,
          enqueueJob,
          selectImplementation,
          moduleLoads,
          importMeta,
        );
        mapSet(moduleRecords, moduleSpecifier, aliasRecord);
        return aliasRecord;
      }
    }

    if (moduleDescriptor.archive !== undefined) {
      // { archive: Archive, path: string }
      // We do not support this XS-native module descriptor.
      throw makeError(
        X`Unsupported archive module descriptor for specifier ${q(moduleSpecifier)} in compartment ${q(compartment.name)}`,
      );
    }

    // { record, specifier?, compartment?, importMeta? }
    // A (legacy) module descriptor for when we find the module source (record)
    // but at a different specifier than requested.
    // Providing this {specifier, record} descriptor serves as an ergonomic
    // short-hand for stashing the record, returning a {compartment, specifier}
    // reference, bouncing the module hook, then producing the source (record)
    // when module hook receives the response specifier.
    if (moduleDescriptor.record !== undefined) {
      const {
        compartment: aliasCompartment = compartment,
        specifier: aliasSpecifier = moduleSpecifier,
        record: moduleSource,
        importMeta,
      } = moduleDescriptor;

      const aliasRecord = loadModuleSource(
        compartmentPrivateFields,
        moduleAliases,
        aliasCompartment,
        aliasSpecifier,
        moduleSource,
        enqueueJob,
        selectImplementation,
        moduleLoads,
        importMeta,
      );
      mapSet(moduleRecords, moduleSpecifier, aliasRecord);
      mapSet(moduleRecords, aliasSpecifier, aliasRecord);
      return aliasRecord;
    }

    // { specifier: string, compartment: Compartment }
    // A (legacy) module descriptor that describes a link to a module instance
    // in a specified compartment.
    if (
      moduleDescriptor.compartment !== undefined &&
      moduleDescriptor.specifier !== undefined
    ) {
      if (
        isPrimitive(moduleDescriptor.compartment) ||
        !weakmapHas(compartmentPrivateFields, moduleDescriptor.compartment) ||
        typeof moduleDescriptor.specifier !== 'string'
      ) {
        throw makeError(
          X`Invalid compartment in module descriptor for specifier ${q(moduleSpecifier)} in compartment ${q(compartment.name)}`,
        );
      }
      // Behold: recursion.
      // eslint-disable-next-line no-use-before-define
      const aliasRecord = yield memoizedLoadWithErrorAnnotation(
        compartmentPrivateFields,
        moduleAliases,
        moduleDescriptor.compartment,
        moduleDescriptor.specifier,
        enqueueJob,
        selectImplementation,
        moduleLoads,
      );
      mapSet(moduleRecords, moduleSpecifier, aliasRecord);
      return aliasRecord;
    }

    // A (legacy) behavior: If we do not recognize the module descriptor as a
    // module descriptor, we assume that it is a module source (record):
    const moduleSource = moduleDescriptor;
    const moduleRecord = loadModuleSource(
      compartmentPrivateFields,
      moduleAliases,
      compartment,
      moduleSpecifier,
      moduleSource,
      enqueueJob,
      selectImplementation,
      moduleLoads,
    );
    // Memoize.
    mapSet(moduleRecords, moduleSpecifier, moduleRecord);
    return moduleRecord;
  } else {
    throw makeError(
      X`module descriptor must be a string or object for specifier ${q(
        moduleSpecifier,
      )} in compartment ${q(compartment.name)}`,
    );
  }
}

const memoizedLoadWithErrorAnnotation = (
  compartmentPrivateFields,
  moduleAliases,
  compartment,
  moduleSpecifier,
  enqueueJob,
  selectImplementation,
  moduleLoads,
) => {
  const { name: compartmentName } = weakmapGet(
    compartmentPrivateFields,
    compartment,
  );

  // Prevent data-lock from recursion into branches visited in dependent loads.
  let compartmentLoading = mapGet(moduleLoads, compartment);
  if (compartmentLoading === undefined) {
    compartmentLoading = new Map();
    mapSet(moduleLoads, compartment, compartmentLoading);
  }
  let moduleLoading = mapGet(compartmentLoading, moduleSpecifier);
  if (moduleLoading !== undefined) {
    return moduleLoading;
  }

  moduleLoading = selectImplementation(asyncTrampoline, syncTrampoline)(
    loadWithoutErrorAnnotation,
    [
      compartmentPrivateFields,
      moduleAliases,
      compartment,
      moduleSpecifier,
      enqueueJob,
      selectImplementation,
      moduleLoads,
    ],
    error => {
      // eslint-disable-next-line @endo/no-polymorphic-call
      annotateError(
        error,
        X`${error.message}, loading ${q(moduleSpecifier)} in compartment ${q(
          compartmentName,
        )}`,
      );
      throw error;
    },
  );

  mapSet(compartmentLoading, moduleSpecifier, moduleLoading);

  return moduleLoading;
};

/**
 * If `aggregateErrors` is `false`, the `errors` property of the fulfilled object
 * will always be empty.
 * @param {{errors?: Error[], noAggregateErrors?: boolean | undefined}} [options]
 */
const asyncJobQueue = ({ errors = [], noAggregateErrors = false } = {}) => {
  /** @type {Set<Promise<undefined>>} */
  const pendingJobs = new Set();

  /**
   * Enqueues a job that starts immediately but won't be awaited until drainQueue is called.
   *
   * @template {(...args: any[]) => Promise<void>} F
   * @param {F} func - An async function to execute
   * @param {Parameters<F>} args - Arguments to pass to the function
   * @returns {void}
   */
  const enqueueJob = (func, args) => {
    setAdd(
      pendingJobs,
      promiseThen(func(...args), noop, error => {
        if (noAggregateErrors) {
          throw error;
        } else {
          arrayPush(errors, error);
        }
      }),
    );
  };
  /**
   * Sequentially awaits pending jobs and returns an array of errors
   */
  const drainQueue = async () => {
    await null;
    for (const job of pendingJobs) {
      // eslint-disable-next-line no-await-in-loop
      await job;
    }
  };
  return { enqueueJob, drainQueue, errors };
};

/**
 * If `aggregateErrors` is `false`, the `errors` property of the returned object
 * will always be empty.
 * @param {{errors?: Error[], noAggregateErrors?: boolean | undefined}} [options]
 */
const syncJobQueue = ({ errors = [], noAggregateErrors = false } = {}) => {
  let current = [];
  let next = [];

  /**
   * Enqueues a job
   *
   * @template {(...args: any[]) => void} F
   * @param {F} func - An async function to execute
   * @param {Parameters<F>} args - Arguments to pass to the function
   * @returns {void}
   */
  const enqueueJob = (func, args) => {
    arrayPush(next, [func, args]);
  };
  const drainQueue = () => {
    // Attention: load bearing flow order. Calling another enqueued function in the
    // synchronous usecase must happen after the one that enqueued it has finished.
    // Jobs enqueued in one pass do not interleave with jobs resulting from them.
    // It's necessary for efficient memoization and to break cycles.
    for (const [func, args] of current) {
      try {
        func(...args);
      } catch (error) {
        if (noAggregateErrors) {
          throw error;
        } else {
          arrayPush(errors, error);
        }
      }
    }
    current = next;
    next = [];
    if (current.length > 0) drainQueue();
  };
  return { enqueueJob, drainQueue, errors };
};

/**
 * @param {object} options
 * @param {Array<Error>} options.errors
 * @param {string} options.errorPrefix
 */
const throwAggregateError = ({ errors, errorPrefix }) => {
  // Throw an aggregate error if there were any errors.
  if (errors.length > 0) {
    const verbose =
      /** @type {'' | 'verbose'} */
      (getenv('COMPARTMENT_LOAD_ERRORS', '', ['verbose'])) === 'verbose';
    throw TypeError(
      `${errorPrefix} (${errors.length} underlying failures: ${arrayJoin(
        arrayMap(errors, error => error.message + (verbose ? error.stack : '')),
        ', ',
      )}`,
    );
  }
};

const preferSync = (_asyncImpl, syncImpl) => syncImpl;
const preferAsync = (asyncImpl, _syncImpl) => asyncImpl;

/**
 * `load` asynchronously gathers the module records for a module and its
 * transitive dependencies.
 * The module records refer to each other by a reference to the dependency's
 * compartment and the specifier of the module within its own compartment.
 * This graph is then ready to be synchronously linked and executed.
 * @param {WeakMap<Compartment, any>} compartmentPrivateFields
 * @param {WeakMap<object, object>} moduleAliases
 * @param {Compartment} compartment
 * @param {string} moduleSpecifier - The module specifier to load.
 * @param {{ noAggregateErrors?: boolean | undefined}} options
 */
       const load = async (
  compartmentPrivateFields,
  moduleAliases,
  compartment,
  moduleSpecifier,
  { noAggregateErrors = false } = {},
) => {
  const { name: compartmentName } = weakmapGet(
    compartmentPrivateFields,
    compartment,
  );

  /** @type {Map<object, Map<string, Promise<Record<any, any>>>>} */
  const moduleLoads = new Map();

  const { enqueueJob, drainQueue, errors } = asyncJobQueue({
    noAggregateErrors,
  });

  enqueueJob(memoizedLoadWithErrorAnnotation, [
    compartmentPrivateFields,
    moduleAliases,
    compartment,
    moduleSpecifier,
    enqueueJob,
    preferAsync,
    moduleLoads,
  ]);

  await drainQueue();

  throwAggregateError({
    errors,
    errorPrefix: `Failed to load module ${q(moduleSpecifier)} in package ${q(
      compartmentName,
    )}`,
  });
};

/**
 * `loadNow` synchronously gathers the module records for a specified module
 * and its transitive dependencies.
 * The module records refer to each other by a reference to the dependency's
 * compartment and the specifier of the module within its own compartment.
 * This graph is then ready to be synchronously linked and executed.
 * @param {WeakMap<Compartment, any>} compartmentPrivateFields
 * @param {WeakMap<object, object>} moduleAliases
 * @param {Compartment} compartment
 * @param {string} moduleSpecifier - The module specifier to load.
 * @param {{ noAggregateErrors?: boolean | undefined}} options
 */$h͏_once.load(load);

       const loadNow = (
  compartmentPrivateFields,
  moduleAliases,
  compartment,
  moduleSpecifier,
  { noAggregateErrors = false } = {},
) => {
  const { name: compartmentName } = weakmapGet(
    compartmentPrivateFields,
    compartment,
  );

  /** @type {Map<object, Map<string, Promise<Record<any, any>>>>} */
  const moduleLoads = new Map();

  const { enqueueJob, drainQueue, errors } = syncJobQueue({
    noAggregateErrors,
  });

  enqueueJob(memoizedLoadWithErrorAnnotation, [
    compartmentPrivateFields,
    moduleAliases,
    compartment,
    moduleSpecifier,
    enqueueJob,
    preferSync,
    moduleLoads,
  ]);

  drainQueue();

  throwAggregateError({
    errors,
    errorPrefix: `Failed to load module ${q(moduleSpecifier)} in package ${q(
      compartmentName,
    )}`,
  });
};$h͏_once.loadNow(loadNow);
})()
,
// === 48. ses ./src/module-proxy.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let makeAlias,Proxy,TypeError,create,freeze,mapGet,mapHas,mapSet,ownKeys,reflectGet,reflectGetOwnPropertyDescriptor,reflectHas,reflectIsExtensible,reflectPreventExtensions,toStringTagSymbol,weakmapSet,assert;$h͏_imports([["./module-load.js", [["makeAlias",[$h͏_a => (makeAlias = $h͏_a)]]]],["./commons.js", [["Proxy",[$h͏_a => (Proxy = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["mapGet",[$h͏_a => (mapGet = $h͏_a)]],["mapHas",[$h͏_a => (mapHas = $h͏_a)]],["mapSet",[$h͏_a => (mapSet = $h͏_a)]],["ownKeys",[$h͏_a => (ownKeys = $h͏_a)]],["reflectGet",[$h͏_a => (reflectGet = $h͏_a)]],["reflectGetOwnPropertyDescriptor",[$h͏_a => (reflectGetOwnPropertyDescriptor = $h͏_a)]],["reflectHas",[$h͏_a => (reflectHas = $h͏_a)]],["reflectIsExtensible",[$h͏_a => (reflectIsExtensible = $h͏_a)]],["reflectPreventExtensions",[$h͏_a => (reflectPreventExtensions = $h͏_a)]],["toStringTagSymbol",[$h͏_a => (toStringTagSymbol = $h͏_a)]],["weakmapSet",[$h͏_a => (weakmapSet = $h͏_a)]]]],["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]]]]]);































const { quote: q } = assert;

// `deferExports` creates a module's exports proxy, proxied exports, and
// activator.
// A `Compartment` can create a module for any module specifier, regardless of
// whether it is loadable or executable, and use that object as a token that
// can be fed into another compartment's module map.
// Only after the specified module has been analyzed is it possible for the
// module namespace proxy to behave properly, so it throws exceptions until
// after the compartment has begun executing the module.
// The module instance must freeze the proxied exports and activate the exports
// proxy before executing the module.
//
// The module exports proxy's behavior differs from the ECMAScript 262
// specification for "module namespace exotic objects" only in that according
// to the specification value property descriptors have a non-writable "value"
// and this implementation models all properties with accessors.
//
// https://tc39.es/ecma262/#sec-module-namespace-exotic-objects
//
       const deferExports = () => {
  let active = false;
  const exportsTarget = create(null, {
    // Make this appear like an ESM module namespace object.
    [toStringTagSymbol]: {
      value: 'Module',
      writable: false,
      enumerable: false,
      configurable: false,
    },
  });
  return freeze({
    activate() {
      active = true;
    },
    exportsTarget,
    exportsProxy: new Proxy(exportsTarget, {
      get(_target, name, receiver) {
        if (!active) {
          throw TypeError(
            `Cannot get property ${q(
              name,
            )} of module exports namespace, the module has not yet begun to execute`,
          );
        }
        return reflectGet(exportsTarget, name, receiver);
      },
      set(_target, name, _value) {
        throw TypeError(
          `Cannot set property ${q(name)} of module exports namespace`,
        );
      },
      has(_target, name) {
        if (!active) {
          throw TypeError(
            `Cannot check property ${q(
              name,
            )}, the module has not yet begun to execute`,
          );
        }
        return reflectHas(exportsTarget, name);
      },
      deleteProperty(_target, name) {
        throw TypeError(
          `Cannot delete property ${q(name)}s of module exports namespace`,
        );
      },
      ownKeys(_target) {
        if (!active) {
          throw TypeError(
            'Cannot enumerate keys, the module has not yet begun to execute',
          );
        }
        return ownKeys(exportsTarget);
      },
      getOwnPropertyDescriptor(_target, name) {
        if (!active) {
          throw TypeError(
            `Cannot get own property descriptor ${q(
              name,
            )}, the module has not yet begun to execute`,
          );
        }
        return reflectGetOwnPropertyDescriptor(exportsTarget, name);
      },
      preventExtensions(_target) {
        if (!active) {
          throw TypeError(
            'Cannot prevent extensions of module exports namespace, the module has not yet begun to execute',
          );
        }
        return reflectPreventExtensions(exportsTarget);
      },
      isExtensible() {
        if (!active) {
          throw TypeError(
            'Cannot check extensibility of module exports namespace, the module has not yet begun to execute',
          );
        }
        return reflectIsExtensible(exportsTarget);
      },
      getPrototypeOf(_target) {
        return null;
      },
      setPrototypeOf(_target, _proto) {
        throw TypeError('Cannot set prototype of module exports namespace');
      },
      defineProperty(_target, name, _descriptor) {
        throw TypeError(
          `Cannot define property ${q(name)} of module exports namespace`,
        );
      },
      apply(_target, _thisArg, _args) {
        throw TypeError(
          'Cannot call module exports namespace, it is not a function',
        );
      },
      construct(_target, _args) {
        throw TypeError(
          'Cannot construct module exports namespace, it is not a constructor',
        );
      },
    }),
  });
};

/**
 * @typedef {object} DeferredExports
 * @property {Record<string, any>} exportsTarget - The object to which a
 * module's exports will be added.
 * @property {Record<string, any>} exportsProxy - A proxy over the `exportsTarget`,
 * used to expose its "exports" to other compartments.
 * @property {() => void} activate - Activate the `exportsProxy` such that it can
 * be used as a module namespace object.
 */

/**
 * Memoizes the creation of a deferred module exports namespace proxy for any
 * arbitrary full specifier in a compartment. It also records the compartment
 * and specifier affiliated with that module exports namespace proxy so it
 * can be used as an alias into another compartment when threaded through
 * a compartment's `moduleMap` argument.
 *
 * @param {*} compartment - The compartment to retrieve deferred exports from.
 * @param {*} compartmentPrivateFields - The private fields of the compartment.
 * @param {*} moduleAliases - The module aliases of the compartment.
 * @param {string} specifier - The module specifier to retrieve deferred exports for.
 * @returns {DeferredExports} - The deferred exports for the module specifier of
 * the compartment.
 */$h͏_once.deferExports(deferExports);
       const getDeferredExports = (
  compartment,
  compartmentPrivateFields,
  moduleAliases,
  specifier,
) => {
  const { deferredExports } = compartmentPrivateFields;
  if (!mapHas(deferredExports, specifier)) {
    const deferred = deferExports();
    weakmapSet(
      moduleAliases,
      deferred.exportsProxy,
      makeAlias(compartment, specifier),
    );
    mapSet(deferredExports, specifier, deferred);
  }
  return mapGet(deferredExports, specifier);
};$h͏_once.getDeferredExports(getDeferredExports);
})()
,
// === 49. ses ./src/compartment-evaluate.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let TypeError,arrayPush,create,getOwnPropertyDescriptors,evadeHtmlCommentTest,evadeImportExpressionTest,rejectSomeDirectEvalExpressions,makeSafeEvaluator;$h͏_imports([["./commons.js", [["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["arrayPush",[$h͏_a => (arrayPush = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["getOwnPropertyDescriptors",[$h͏_a => (getOwnPropertyDescriptors = $h͏_a)]]]],["./transforms.js", [["evadeHtmlCommentTest",[$h͏_a => (evadeHtmlCommentTest = $h͏_a)]],["evadeImportExpressionTest",[$h͏_a => (evadeImportExpressionTest = $h͏_a)]],["rejectSomeDirectEvalExpressions",[$h͏_a => (rejectSomeDirectEvalExpressions = $h͏_a)]]]],["./make-safe-evaluator.js", [["makeSafeEvaluator",[$h͏_a => (makeSafeEvaluator = $h͏_a)]]]]]);













       const provideCompartmentEvaluator = (compartmentFields, options) => {
  const { sloppyGlobalsMode = false, __moduleShimLexicals__ = undefined } =
    options;

  let safeEvaluate;

  if (__moduleShimLexicals__ === undefined && !sloppyGlobalsMode) {
    ({ safeEvaluate } = compartmentFields);
  } else {
    // The scope proxy or global lexicals are different from the
    // shared evaluator so we need to build a new one

    let { globalTransforms } = compartmentFields;
    const { globalObject } = compartmentFields;

    let moduleLexicals;
    if (__moduleShimLexicals__ !== undefined) {
      // When using `evaluate` for ESM modules, as should only occur from the
      // module-shim's module-instance.js, we do not reveal the SES-shim's
      // module-to-program translation, as this is not standardizable behavior.
      // However, the `localTransforms` will come from the `__shimTransforms__`
      // Compartment option in this case, which is a non-standardizable escape
      // hatch so programs designed specifically for the SES-shim
      // implementation may opt-in to use the same transforms for `evaluate`
      // and `import`, at the expense of being tightly coupled to SES-shim.
      globalTransforms = undefined;

      moduleLexicals = create(
        null,
        getOwnPropertyDescriptors(__moduleShimLexicals__),
      );
    }

    ({ safeEvaluate } = makeSafeEvaluator({
      globalObject,
      moduleLexicals,
      globalTransforms,
      sloppyGlobalsMode,
    }));
  }

  return { safeEvaluate };
};$h͏_once.provideCompartmentEvaluator(provideCompartmentEvaluator);

       const compartmentEvaluate = (compartmentFields, source, options) => {
  // Perform this check first to avoid unnecessary sanitizing.
  // TODO Maybe relax string check and coerce instead:
  // https://github.com/tc39/proposal-dynamic-code-brand-checks
  if (typeof source !== 'string') {
    throw TypeError('first argument of evaluate() must be a string');
  }

  // Extract options, and shallow-clone transforms.
  const {
    transforms = [],
    __evadeHtmlCommentTest__ = false,
    __evadeImportExpressionTest__ = false,
    __rejectSomeDirectEvalExpressions__ = true  // Note default on
  } = options;
  const localTransforms = [...transforms];
  if (__evadeHtmlCommentTest__ === true) {
    arrayPush(localTransforms, evadeHtmlCommentTest);
  }
  if (__evadeImportExpressionTest__ === true) {
    arrayPush(localTransforms, evadeImportExpressionTest);
  }
  if (__rejectSomeDirectEvalExpressions__ === true) {
    arrayPush(localTransforms, rejectSomeDirectEvalExpressions);
  }

  const { safeEvaluate } = provideCompartmentEvaluator(
    compartmentFields,
    options,
  );

  return safeEvaluate(source, {
    localTransforms,
  });
};$h͏_once.compartmentEvaluate(compartmentEvaluate);
})()
,
// === 50. ses ./src/module-instance.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let assert,getDeferredExports,ReferenceError,SyntaxError,TypeError,arrayForEach,arrayIncludes,arrayPush,arraySome,arraySort,create,defineProperty,entries,freeze,isArray,keys,mapGet,weakmapGet,reflectHas,assign,compartmentEvaluate;$h͏_imports([["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]]]],["./module-proxy.js", [["getDeferredExports",[$h͏_a => (getDeferredExports = $h͏_a)]]]],["./commons.js", [["ReferenceError",[$h͏_a => (ReferenceError = $h͏_a)]],["SyntaxError",[$h͏_a => (SyntaxError = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["arrayForEach",[$h͏_a => (arrayForEach = $h͏_a)]],["arrayIncludes",[$h͏_a => (arrayIncludes = $h͏_a)]],["arrayPush",[$h͏_a => (arrayPush = $h͏_a)]],["arraySome",[$h͏_a => (arraySome = $h͏_a)]],["arraySort",[$h͏_a => (arraySort = $h͏_a)]],["create",[$h͏_a => (create = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["entries",[$h͏_a => (entries = $h͏_a)]],["freeze",[$h͏_a => (freeze = $h͏_a)]],["isArray",[$h͏_a => (isArray = $h͏_a)]],["keys",[$h͏_a => (keys = $h͏_a)]],["mapGet",[$h͏_a => (mapGet = $h͏_a)]],["weakmapGet",[$h͏_a => (weakmapGet = $h͏_a)]],["reflectHas",[$h͏_a => (reflectHas = $h͏_a)]],["assign",[$h͏_a => (assign = $h͏_a)]]]],["./compartment-evaluate.js", [["compartmentEvaluate",[$h͏_a => (compartmentEvaluate = $h͏_a)]]]]]);

























const { quote: q } = assert;

       const makeVirtualModuleInstance = (
  compartmentPrivateFields,
  moduleSource,
  compartment,
  moduleAliases,
  moduleSpecifier,
  resolvedImports,
) => {
  const { exportsProxy, exportsTarget, activate } = getDeferredExports(
    compartment,
    weakmapGet(compartmentPrivateFields, compartment),
    moduleAliases,
    moduleSpecifier,
  );

  const notifiers = create(null);

  if (moduleSource.exports) {
    if (
      !isArray(moduleSource.exports) ||
      arraySome(moduleSource.exports, name => typeof name !== 'string')
    ) {
      throw TypeError(
        `SES virtual module source "exports" property must be an array of strings for module ${moduleSpecifier}`,
      );
    }
    arrayForEach(moduleSource.exports, name => {
      let value = exportsTarget[name];
      const updaters = [];

      const get = () => value;

      const set = newValue => {
        value = newValue;
        for (const updater of updaters) {
          updater(newValue);
        }
      };

      defineProperty(exportsTarget, name, {
        get,
        set,
        enumerable: true,
        configurable: false,
      });

      notifiers[name] = update => {
        arrayPush(updaters, update);
        update(value);
      };
    });
    // This is enough to support import * from cjs - the '*' field doesn't need to be in exports nor exportsTarget because import will only ever access it via notifiers
    notifiers['*'] = update => {
      update(exportsTarget);
    };
  }

  const localState = {
    activated: false,
  };
  return freeze({
    notifiers,
    exportsProxy,
    execute() {
      if (reflectHas(localState, 'errorFromExecute')) {
        throw localState.errorFromExecute;
      }
      if (!localState.activated) {
        activate();
        localState.activated = true;
        try {
          // eslint-disable-next-line @endo/no-polymorphic-call
          moduleSource.execute(exportsTarget, compartment, resolvedImports);
        } catch (err) {
          localState.errorFromExecute = err;
          throw err;
        }
      }
    },
  });
};

// `makeModuleInstance` takes a module's compartment record, the live import
// namespace, and a global object; and produces a module instance.
// The module instance carries the proxied module exports namespace (the
// "exports"), notifiers to update the module's internal import namespace, and
// an idempotent execute function.
// The module exports namespace is a proxy to the proxied exports namespace
// that the execution of the module instance populates.
$h͏_once.makeVirtualModuleInstance(makeVirtualModuleInstance);const makeModuleInstance=(
  privateFields,
  moduleAliases,
  moduleRecord,
  importedInstances,
) => {
  const {
    compartment,
    moduleSpecifier,
    moduleSource,
    importMeta: moduleRecordMeta,
  } = moduleRecord;
  const {
    reexports: exportAlls = [],
    __syncModuleProgram__: functorSource,
    __fixedExportMap__: fixedExportMap = {},
    __liveExportMap__: liveExportMap = {},
    __reexportMap__: reexportMap = {},
    __needsImport__: needsImport = false,
    __needsImportMeta__: needsImportMeta = false,
    __syncModuleFunctor__,
  } = moduleSource;

  const compartmentFields = weakmapGet(privateFields, compartment);

  const { __shimTransforms__, resolveHook, importMetaHook, compartmentImport } =
    compartmentFields;

  const { exportsProxy, exportsTarget, activate } = getDeferredExports(
    compartment,
    compartmentFields,
    moduleAliases,
    moduleSpecifier,
  );

  // {_exportName_: getter} module exports namespace
  // object (eventually proxied).
  const exportsProps = create(null);

  // {_localName_: accessor} proxy traps for moduleLexicals and live bindings.
  // The moduleLexicals object is frozen and the corresponding properties of
  // moduleLexicals must be immutable, so we copy the descriptors.
  const moduleLexicals = create(null);

  // {_localName_: init(initValue) -> initValue} used by the
  // rewritten code to initialize exported fixed bindings.
  const onceVar = create(null);

  // {_localName_: update(newValue)} used by the rewritten code to
  // both initialize and update live bindings.
  const liveVar = create(null);

  const importMeta = create(null);
  if (moduleRecordMeta) {
    assign(importMeta, moduleRecordMeta);
  }
  if (needsImportMeta && importMetaHook) {
    importMetaHook(moduleSpecifier, importMeta);
  }

  /** @type {(fullSpecifier: string) => Promise<ModuleExportsNamespace>} */
  let dynamicImport;
  if (needsImport) {
    /** @param {string} importSpecifier */
    dynamicImport = async importSpecifier =>
      compartmentImport(resolveHook(importSpecifier, moduleSpecifier));
  }

  // {_localName_: [{get, set, notify}]} used to merge all the export updaters.
  const localGetNotify = create(null);

  // {[importName: string]: notify(update(newValue))} Used by code that imports
  // one of this module's exports, so that their update function will
  // be notified when this binding is initialized or updated.
  const notifiers = create(null);

  arrayForEach(entries(fixedExportMap), ([fixedExportName, [localName]]) => {
    let fixedGetNotify = localGetNotify[localName];
    if (!fixedGetNotify) {
      // fixed binding state
      let value;
      let tdz = true;
      /** @type {null | Array<(value: any) => void>} */
      let optUpdaters = [];

      // tdz sensitive getter
      const get = () => {
        if (tdz) {
          throw ReferenceError(`binding ${q(localName)} not yet initialized`);
        }
        return value;
      };

      // leave tdz once
      const init = freeze(initValue => {
        // init with initValue of a declared const binding, and return
        // it.
        if (!tdz) {
          throw TypeError(
            `Internal: binding ${q(localName)} already initialized`,
          );
        }
        value = initValue;
        const updaters = optUpdaters;
        optUpdaters = null;
        tdz = false;
        for (const updater of updaters || []) {
          updater(initValue);
        }
        return initValue;
      });

      // If still tdz, register update for notification later.
      // Otherwise, update now.
      const notify = updater => {
        if (updater === init) {
          // Prevent recursion.
          return;
        }
        if (tdz) {
          arrayPush(optUpdaters || [], updater);
        } else {
          updater(value);
        }
      };

      // Need these for additional exports of the local variable.
      fixedGetNotify = {
        get,
        notify,
      };
      localGetNotify[localName] = fixedGetNotify;
      onceVar[localName] = init;
    }

    exportsProps[fixedExportName] = {
      get: fixedGetNotify.get,
      set: undefined,
      enumerable: true,
      configurable: false,
    };

    notifiers[fixedExportName] = fixedGetNotify.notify;
  });

  arrayForEach(
    entries(liveExportMap),
    ([liveExportName, [localName, setProxyTrap]]) => {
      let liveGetNotify = localGetNotify[localName];
      if (!liveGetNotify) {
        // live binding state
        let value;
        let tdz = true;
        const updaters = [];

        // tdz sensitive getter
        const get = () => {
          if (tdz) {
            throw ReferenceError(
              `binding ${q(liveExportName)} not yet initialized`,
            );
          }
          return value;
        };

        // This must be usable locally for the translation of initializing
        // a declared local live binding variable.
        //
        // For reexported variable, this is also an update function to
        // register for notification with the downstream import, which we
        // must assume to be live. Thus, it can be called independent of
        // tdz but always leaves tdz. Such reexporting creates a tree of
        // bindings. This lets the tree be hooked up even if the imported
        // module instance isn't initialized yet, as may happen in cycles.
        const update = freeze(newValue => {
          value = newValue;
          tdz = false;
          for (const updater of updaters) {
            updater(newValue);
          }
        });

        // tdz sensitive setter
        const set = newValue => {
          if (tdz) {
            throw ReferenceError(`binding ${q(localName)} not yet initialized`);
          }
          value = newValue;
          for (const updater of updaters) {
            updater(newValue);
          }
        };

        // Always register the updater function.
        // If not in tdz, also update now.
        const notify = updater => {
          if (updater === update) {
            // Prevent recursion.
            return;
          }
          arrayPush(updaters, updater);
          if (!tdz) {
            updater(value);
          }
        };

        liveGetNotify = {
          get,
          notify,
        };

        localGetNotify[localName] = liveGetNotify;
        if (setProxyTrap) {
          defineProperty(moduleLexicals, localName, {
            get,
            set,
            enumerable: true,
            configurable: false,
          });
        }
        liveVar[localName] = update;
      }

      exportsProps[liveExportName] = {
        get: liveGetNotify.get,
        set: undefined,
        enumerable: true,
        configurable: false,
      };

      notifiers[liveExportName] = liveGetNotify.notify;
    },
  );

  const notifyStar = update => {
    update(exportsTarget);
  };
  notifiers['*'] = notifyStar;

  const wireUpExportNotifier = (exportName, notify) => {
    if (!notifiers[exportName] && notify !== false) {
      notifiers[exportName] = notify;

      // exported live binding state
      let value;
      const update = newValue => (value = newValue);
      notify(update);
      exportsProps[exportName] = {
        get() {
          return value;
        },
        set: undefined,
        enumerable: true,
        configurable: false,
      };
    }
  };

  // Per the calling convention for the moduleFunctor generated from
  // an ESM, the `imports` function gets called once up front
  // to populate or arrange the population of imports and reexports.
  // The generated code produces an `updateRecord`: the means for
  // the linker to update the imports and exports of the module.
  // The updateRecord must conform to moduleAnalysis.imports
  // updateRecord = Map<specifier, importUpdaters>
  // importUpdaters = Map<importName, [update(newValue)*]>
  function imports(updateRecord) {
    // By the time imports is called, the importedInstances should already be
    // initialized with module instances that satisfy
    // imports.
    // importedInstances = Map[_specifier_, { notifiers, module, execute }]
    // notifiers = { [importName: string]: notify(update(newValue))}

    // export * cannot export default.
    const candidateAll = create(null);
    candidateAll.default = false;
    for (const [specifier, importUpdaters] of updateRecord) {
      const instance = mapGet(importedInstances, specifier);
      // The module instance object is an internal literal, does not bind this,
      // and never revealed outside the SES shim.
      // There are two instantiation sites for instances and they are both in
      // this module.
      // eslint-disable-next-line @endo/no-polymorphic-call
      instance.execute(); // bottom up cycle tolerant
      const { notifiers: importNotifiers } = instance;
      for (const [importName, updaters] of importUpdaters) {
        const importNotify = importNotifiers[importName];
        if (!importNotify) {
          throw SyntaxError(
            `The requested module '${specifier}' does not provide an export named '${importName}'`,
          );
        }
        for (const updater of updaters) {
          importNotify(updater);
        }
      }
      if (arrayIncludes(exportAlls, specifier)) {
        // Make all these imports candidates.
        // Note names don't change in reexporting all
        for (const [importAndExportName, importNotify] of entries(
          importNotifiers,
        )) {
          if (candidateAll[importAndExportName] === undefined) {
            candidateAll[importAndExportName] = importNotify;
          } else {
            // Already a candidate: remove ambiguity.
            candidateAll[importAndExportName] = false;
          }
        }
      }
      if (reexportMap[specifier]) {
        // Set up reexport notifiers instantly so they are available in cycles.
        for (const [localName, exportedName] of reexportMap[specifier]) {
          wireUpExportNotifier(exportedName, importNotifiers[localName]);
        }
      }
    }

    for (const [exportName, notify] of entries(candidateAll)) {
      wireUpExportNotifier(exportName, notify);
    }

    // Sort the module exports namespace as per spec.
    // The module exports namespace will be wrapped in a module namespace
    // exports proxy which will serve as a "module exports namespace exotic
    // object".
    // Sorting properties is not generally reliable because some properties may
    // be symbols, and symbols do not have an inherent relative order, but
    // since all properties of the exports namespace must be keyed by a string
    // and the string must correspond to a valid identifier, sorting these
    // properties works for this specific case.
    arrayForEach(arraySort(keys(exportsProps)), k =>
      defineProperty(exportsTarget, k, exportsProps[k]),
    );

    freeze(exportsTarget);
    activate();
  }

  let optFunctor;
  if (__syncModuleFunctor__ !== undefined) {
    optFunctor = __syncModuleFunctor__;
  } else {
    optFunctor = compartmentEvaluate(compartmentFields, functorSource, {
      globalObject: compartment.globalThis,
      transforms: __shimTransforms__,
      __moduleShimLexicals__: moduleLexicals,
    });
  }
  let didThrow = false;
  let thrownError;
  function execute() {
    if (optFunctor) {
      // uninitialized
      const functor = optFunctor;
      optFunctor = null;
      // initializing - call with `this` of `undefined`.
      try {
        functor(
          freeze({
            imports: freeze(imports),
            onceVar: freeze(onceVar),
            liveVar: freeze(liveVar),
            import: dynamicImport,
            importMeta,
          }),
        );
      } catch (e) {
        didThrow = true;
        thrownError = e;
      }
      // initialized
    }
    if (didThrow) {
      throw thrownError;
    }
  }

  return freeze({
    notifiers,
    exportsProxy,
    execute,
  });
};$h͏_once.makeModuleInstance(makeModuleInstance);
})()
,
// === 51. ses ./src/module-link.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let assert,makeModuleInstance,makeVirtualModuleInstance,Map,ReferenceError,TypeError,entries,isArray,isPrimitive,mapGet,mapHas,mapSet,weakmapGet;$h͏_imports([["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]]]],["./module-instance.js", [["makeModuleInstance",[$h͏_a => (makeModuleInstance = $h͏_a)]],["makeVirtualModuleInstance",[$h͏_a => (makeVirtualModuleInstance = $h͏_a)]]]],["./commons.js", [["Map",[$h͏_a => (Map = $h͏_a)]],["ReferenceError",[$h͏_a => (ReferenceError = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["entries",[$h͏_a => (entries = $h͏_a)]],["isArray",[$h͏_a => (isArray = $h͏_a)]],["isPrimitive",[$h͏_a => (isPrimitive = $h͏_a)]],["mapGet",[$h͏_a => (mapGet = $h͏_a)]],["mapHas",[$h͏_a => (mapHas = $h͏_a)]],["mapSet",[$h͏_a => (mapSet = $h͏_a)]],["weakmapGet",[$h͏_a => (weakmapGet = $h͏_a)]]]]]);



















const { Fail, quote: q } = assert;

// `link` creates `ModuleInstances` and `ModuleNamespaces` for a module and its
// transitive dependencies and connects their imports and exports.
// After linking, the resulting working set is ready to be executed.
// The linker only concerns itself with module namespaces that are objects with
// property descriptors for their exports, which the Compartment proxies with
// the actual `ModuleNamespace`.
       const link = (
  compartmentPrivateFields,
  moduleAliases,
  compartment,
  moduleSpecifier,
) => {
  const { name: compartmentName, moduleRecords } = weakmapGet(
    compartmentPrivateFields,
    compartment,
  );

  const moduleRecord = mapGet(moduleRecords, moduleSpecifier);
  if (moduleRecord === undefined) {
    throw ReferenceError(
      `Missing link to module ${q(moduleSpecifier)} from compartment ${q(
        compartmentName,
      )}`,
    );
  }

  // Mutual recursion so there's no confusion about which
  // compartment is in context: the module record may be in another
  // compartment, denoted by moduleRecord.compartment.
  // eslint-disable-next-line no-use-before-define
  return instantiate(compartmentPrivateFields, moduleAliases, moduleRecord);
};$h͏_once.link(link);

function mayBePrecompiledModuleSource(moduleSource) {
  return typeof moduleSource.__syncModuleProgram__ === 'string';
}

function validatePrecompiledModuleSource(moduleSource, moduleSpecifier) {
  const { __fixedExportMap__, __liveExportMap__ } = moduleSource;
  !isPrimitive(__fixedExportMap__) ||
    Fail`Property '__fixedExportMap__' of a precompiled module source must be an object, got ${q(
      __fixedExportMap__,
    )}, for module ${q(moduleSpecifier)}`;
  !isPrimitive(__liveExportMap__) ||
    Fail`Property '__liveExportMap__' of a precompiled module source must be an object, got ${q(
      __liveExportMap__,
    )}, for module ${q(moduleSpecifier)}`;
}

function mayBeVirtualModuleSource(moduleSource) {
  return typeof moduleSource.execute === 'function';
}

function validateVirtualModuleSource(moduleSource, moduleSpecifier) {
  const { exports } = moduleSource;
  isArray(exports) ||
    Fail`Invalid module source: 'exports' of a virtual module source must be an array, got ${q(
      exports,
    )}, for module ${q(moduleSpecifier)}`;
}

function validateModuleSource(moduleSource, moduleSpecifier) {
  !isPrimitive(moduleSource) ||
    Fail`Invalid module source: must be of type object, got ${q(
      moduleSource,
    )}, for module ${q(moduleSpecifier)}`;
  const { imports, exports, reexports = [] } = moduleSource;
  isArray(imports) ||
    Fail`Invalid module source: 'imports' must be an array, got ${q(
      imports,
    )}, for module ${q(moduleSpecifier)}`;
  isArray(exports) ||
    Fail`Invalid module source: 'exports' must be an array, got ${q(
      exports,
    )}, for module ${q(moduleSpecifier)}`;
  isArray(reexports) ||
    Fail`Invalid module source: 'reexports' must be an array if present, got ${q(
      reexports,
    )}, for module ${q(moduleSpecifier)}`;
}

       const instantiate = (
  compartmentPrivateFields,
  moduleAliases,
  moduleRecord,
) => {
  const { compartment, moduleSpecifier, resolvedImports, moduleSource } =
    moduleRecord;
  const { instances } = weakmapGet(compartmentPrivateFields, compartment);

  // Memoize.
  if (mapHas(instances, moduleSpecifier)) {
    return mapGet(instances, moduleSpecifier);
  }

  validateModuleSource(moduleSource, moduleSpecifier);

  const importedInstances = new Map();
  let moduleInstance;
  if (mayBePrecompiledModuleSource(moduleSource)) {
    validatePrecompiledModuleSource(moduleSource, moduleSpecifier);
    moduleInstance = makeModuleInstance(
      compartmentPrivateFields,
      moduleAliases,
      moduleRecord,
      importedInstances,
    );
  } else if (mayBeVirtualModuleSource(moduleSource)) {
    validateVirtualModuleSource(moduleSource, moduleSpecifier);
    moduleInstance = makeVirtualModuleInstance(
      compartmentPrivateFields,
      moduleSource,
      compartment,
      moduleAliases,
      moduleSpecifier,
      resolvedImports,
    );
  } else {
    throw TypeError(`Invalid module source, got ${q(moduleSource)}`);
  }

  // Memoize.
  mapSet(instances, moduleSpecifier, moduleInstance);

  // Link dependency modules.
  for (const [importSpecifier, resolvedSpecifier] of entries(resolvedImports)) {
    const importedInstance = link(
      compartmentPrivateFields,
      moduleAliases,
      compartment,
      resolvedSpecifier,
    );
    mapSet(importedInstances, importSpecifier, importedInstance);
  }

  return moduleInstance;
};$h͏_once.instantiate(instantiate);
})()
,
// === 52. ses ./src/compartment.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let Map,TypeError,WeakMap,arrayFlatMap,assign,defineProperties,identity,promiseThen,toStringTagSymbol,weakmapGet,weakmapSet,setGlobalObjectSymbolUnscopables,setGlobalObjectConstantProperties,setGlobalObjectMutableProperties,setGlobalObjectEvaluators,assert,assertEqual,q,sharedGlobalPropertyNames,load,loadNow,link,getDeferredExports,compartmentEvaluate,makeSafeEvaluator;$h͏_imports([["./commons.js", [["Map",[$h͏_a => (Map = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["WeakMap",[$h͏_a => (WeakMap = $h͏_a)]],["arrayFlatMap",[$h͏_a => (arrayFlatMap = $h͏_a)]],["assign",[$h͏_a => (assign = $h͏_a)]],["defineProperties",[$h͏_a => (defineProperties = $h͏_a)]],["identity",[$h͏_a => (identity = $h͏_a)]],["promiseThen",[$h͏_a => (promiseThen = $h͏_a)]],["toStringTagSymbol",[$h͏_a => (toStringTagSymbol = $h͏_a)]],["weakmapGet",[$h͏_a => (weakmapGet = $h͏_a)]],["weakmapSet",[$h͏_a => (weakmapSet = $h͏_a)]]]],["./global-object.js", [["setGlobalObjectSymbolUnscopables",[$h͏_a => (setGlobalObjectSymbolUnscopables = $h͏_a)]],["setGlobalObjectConstantProperties",[$h͏_a => (setGlobalObjectConstantProperties = $h͏_a)]],["setGlobalObjectMutableProperties",[$h͏_a => (setGlobalObjectMutableProperties = $h͏_a)]],["setGlobalObjectEvaluators",[$h͏_a => (setGlobalObjectEvaluators = $h͏_a)]]]],["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]],["assertEqual",[$h͏_a => (assertEqual = $h͏_a)]],["q",[$h͏_a => (q = $h͏_a)]]]],["./permits.js", [["sharedGlobalPropertyNames",[$h͏_a => (sharedGlobalPropertyNames = $h͏_a)]]]],["./module-load.js", [["load",[$h͏_a => (load = $h͏_a)]],["loadNow",[$h͏_a => (loadNow = $h͏_a)]]]],["./module-link.js", [["link",[$h͏_a => (link = $h͏_a)]]]],["./module-proxy.js", [["getDeferredExports",[$h͏_a => (getDeferredExports = $h͏_a)]]]],["./compartment-evaluate.js", [["compartmentEvaluate",[$h͏_a => (compartmentEvaluate = $h͏_a)]]]],["./make-safe-evaluator.js", [["makeSafeEvaluator",[$h͏_a => (makeSafeEvaluator = $h͏_a)]]]]]);




































































/**
 * @import {ImportHook, ImportMetaHook, ImportNowHook, ModuleDescriptor, ModuleExportsNamespace, ModuleMap, ModuleMapHook, ResolveHook, ModuleSource, CompartmentOptions} from '../types.js'
 * @import {Transform} from './lockdown.js'
 * @import {DeferredExports} from './module-proxy.js'
 */

/**
 * Associates every public module exports namespace with its corresponding
 * compartment and specifier so they can be used to link modules across
 * compartments. The mechanism to thread an alias is to use the
 * {@link Compartment.module} function to obtain the exports namespace of a foreign
 * module and pass it into another compartment's `moduleMap` constructor option
 * @type {WeakMap<ModuleExportsNamespace, Compartment>}
 *
 */
const moduleAliases = new WeakMap();

/**
 * Private fields for `Compartment` instances
 * @typedef {object} CompartmentFields
 * @property {string} name
 * @property {object} globalObject
 * @property {Array<Transform>} globalTransforms
 * @property {(source: string, options?: {localTransforms?: Array<Transform>}) => void} safeEvaluate
 * @property {ResolveHook} resolveHook
 * @property {ImportHook} importHook
 * @property {ImportNowHook} importNowHook
 * @property {ModuleMap} moduleMap
 * @property {ModuleMapHook} moduleMapHook
 * @property {ImportMetaHook} importMetaHook
 * @property {Map<string, ModuleSource>} moduleRecords
 * @property {Array<Transform>} __shimTransforms__
 * @property {DeferredExports} deferredExports
 * @property {Map<string, ModuleDescriptor>} instances
 * @property {Compartment} [parentCompartment]
 * @property {boolean} noNamespaceBox
 * @property {(fullSpecifier: string) => Promise<ModuleExportsNamespace>} compartmentImport
 * @property {boolean} [noAggregateLoadErrors]
 */

/**
 * Captures the private state for each {@link Compartment}
 * @type {WeakMap<Compartment, CompartmentFields>}
 */
const privateFields = new WeakMap();

       const InertCompartment = function Compartment(
  _endowments = {},
  _modules = {},
  _options = {},
) {
  throw TypeError(
    'Compartment.prototype.constructor is not a valid constructor.',
  );
};

/**
 * @param {Compartment} compartment
 * @param {string} specifier
 * @returns {{namespace: ModuleExportsNamespace}}
 */$h͏_once.InertCompartment(InertCompartment);
const compartmentImportNow = (compartment, specifier) => {
  const { execute, exportsProxy } = link(
    privateFields,
    moduleAliases,
    compartment,
    specifier,
  );
  execute();
  return exportsProxy;
};

/** @type {Compartment & {constructor: typeof InertCompartment}} */
       const CompartmentPrototype = {
  constructor: InertCompartment,

  get globalThis() {
    return /** @type {CompartmentFields} */ (weakmapGet(privateFields, this))
      .globalObject;
  },

  get name() {
    return /** @type {CompartmentFields} */ (weakmapGet(privateFields, this))
      .name;
  },

  evaluate(source, options = {}) {
    const compartmentFields = weakmapGet(privateFields, this);
    return compartmentEvaluate(compartmentFields, source, options);
  },

  module(specifier) {
    if (typeof specifier !== 'string') {
      throw TypeError('first argument of module() must be a string');
    }

    const { exportsProxy } = getDeferredExports(
      this,
      weakmapGet(privateFields, this),
      moduleAliases,
      specifier,
    );

    return exportsProxy;
  },

  async import(specifier) {
    const { noNamespaceBox, noAggregateLoadErrors } =
      /** @type {CompartmentFields} */ (weakmapGet(privateFields, this));

    if (typeof specifier !== 'string') {
      throw TypeError('first argument of import() must be a string');
    }

    return promiseThen(
      load(privateFields, moduleAliases, this, specifier, {
        noAggregateErrors: noAggregateLoadErrors,
      }),
      () => {
        // The namespace box is a contentious design and likely to be a breaking
        // change in an appropriately numbered future version.
        const namespace = compartmentImportNow(
          /** @type {Compartment} */ (this),
          specifier,
        );
        if (noNamespaceBox) {
          return namespace;
        }
        // Legacy behavior: box the namespace object so that thenable modules
        // do not get coerced into a promise accidentally.
        return { namespace };
      },
    );
  },

  async load(specifier) {
    if (typeof specifier !== 'string') {
      throw TypeError('first argument of load() must be a string');
    }

    const { noAggregateLoadErrors } = /** @type {CompartmentFields} */ (
      weakmapGet(privateFields, this)
    );

    return load(privateFields, moduleAliases, this, specifier, {
      noAggregateErrors: noAggregateLoadErrors,
    });
  },

  importNow(specifier) {
    if (typeof specifier !== 'string') {
      throw TypeError('first argument of importNow() must be a string');
    }
    const { noAggregateLoadErrors } = /** @type {CompartmentFields} */ (
      weakmapGet(privateFields, this)
    );

    loadNow(privateFields, moduleAliases, this, specifier, {
      noAggregateErrors: noAggregateLoadErrors,
    });
    return compartmentImportNow(/** @type {Compartment} */ (this), specifier);
  },
};

// This causes `String(new Compartment())` to evaluate to `[object Compartment]`.
// The descriptor follows the conventions of other globals with @@toStringTag
// properties, e.g. Math.
$h͏_once.CompartmentPrototype(CompartmentPrototype);defineProperties(CompartmentPrototype,{
  [toStringTagSymbol]: {
    value: 'Compartment',
    writable: false,
    enumerable: false,
    configurable: true,
  },
});

defineProperties(InertCompartment, {
  prototype: { value: CompartmentPrototype },
});

/**
 * @callback MakeCompartmentConstructor
 * @param {MakeCompartmentConstructor} targetMakeCompartmentConstructor
 * @param {Record<string, any>} intrinsics
 * @param {(object: object) => void} markVirtualizedNativeFunction
 * @param {object} [options]
 * @param {Compartment} [options.parentCompartment]
 * @param {boolean} [options.enforceNew]
 * @returns {Compartment['constructor']}
 */

/**
 * "Options bag"-style `Compartment` constructor arguments.
 * @typedef {[options?: CompartmentOptions & { __options__: true }]} CompartmentOptionsArgs
 */

/**
 * Legacy `Compartment` constructor arguments.
 *
 * @deprecated
 * @typedef {[globals?: Map<string, any>, modules?: Map<string, ModuleDescriptor>, options?: CompartmentOptions]} LegacyCompartmentOptionsArgs
 */

/**
 * In order to facilitate migration from the deprecated signature of the
 * compartment constructor,
 *
 * `new Compartent(globals?, modules?, options?)`
 *
 * to the new signature:
 *
 * `new Compartment(options?)`
 *
 * ...where globals and modules are expressed in the options bag instead of
 * positional arguments, this function detects the temporary sigil __options__
 * on the first argument and coerces compartments arguments into a single
 * compartments object.
 * @param {CompartmentOptionsArgs|LegacyCompartmentOptionsArgs} args
 * @returns {CompartmentOptions}
 */
       const compartmentOptions = (...args) => {
  if (args.length === 0) {
    return {};
  }
  if (
    args.length === 1 &&
    typeof args[0] === 'object' &&
    args[0] !== null &&
    '__options__' in args[0]
  ) {
    const { __options__, ...options } = args[0];
    assert(
      __options__ === true,
      `Compartment constructor only supports true __options__ sigil, got ${__options__}`,
    );
    return options;
  } else {
    const [
      globals = /** @type {Map<string, any>} */ ({}),
      modules = /** @type {Map<string, ModuleDescriptor>} */ ({}),
      options = {},
    ] = /** @type {LegacyCompartmentOptionsArgs} */ (args);
    assertEqual(
      options.modules,
      undefined,
      `Compartment constructor must receive either a module map argument or modules option, not both`,
    );
    assertEqual(
      options.globals,
      undefined,
      `Compartment constructor must receive either globals argument or option, not both`,
    );
    return {
      ...options,
      globals,
      modules,
    };
  }
};

/** @type {MakeCompartmentConstructor} */$h͏_once.compartmentOptions(compartmentOptions);
       const makeCompartmentConstructor = (
  targetMakeCompartmentConstructor,
  intrinsics,
  markVirtualizedNativeFunction,
  { parentCompartment = undefined, enforceNew = false } = {},
) => {
  /**
   * @this {Compartment}
   * @param {CompartmentOptionsArgs|LegacyCompartmentOptionsArgs} args
   */
  function Compartment(...args) {
    if (enforceNew && new.target === undefined) {
      throw TypeError(
        "Class constructor Compartment cannot be invoked without 'new'",
      );
    }

    // Extract options, and shallow-clone transforms.
    const {
      name = '<unknown>',
      transforms = [],
      __shimTransforms__ = [],
      globals: endowmentsOption = {},
      modules: moduleMapOption = {},
      resolveHook,
      importHook,
      importNowHook,
      moduleMapHook,
      importMetaHook,
      __noNamespaceBox__: noNamespaceBox = false,
      noAggregateLoadErrors = false,
    } = compartmentOptions(
      .../** @type {Parameters<typeof compartmentOptions>} */ (args),
    );
    const globalTransforms = arrayFlatMap(
      [transforms, __shimTransforms__],
      identity,
    );
    const endowments = { __proto__: null, ...endowmentsOption };
    const moduleMap = { __proto__: null, ...moduleMapOption };

    // Map<FullSpecifier, ModuleCompartmentRecord>
    const moduleRecords = new Map();
    // Map<FullSpecifier, ModuleInstance>
    const instances = new Map();
    // Map<FullSpecifier, {ExportsProxy, ProxiedExports, activate()}>
    const deferredExports = new Map();

    const globalObject = {};

    const compartment = /** @type {Compartment} */ (this);

    setGlobalObjectSymbolUnscopables(globalObject);

    // We must initialize all constant properties first because
    // `makeSafeEvaluator` may use them to create optimized bindings
    // in the evaluator.
    // TODO: consider merging into a single initialization if internal
    // evaluator is no longer eagerly created
    setGlobalObjectConstantProperties(globalObject);

    const { safeEvaluate } = makeSafeEvaluator({
      globalObject,
      globalTransforms,
      sloppyGlobalsMode: false,
    });

    setGlobalObjectMutableProperties(globalObject, {
      intrinsics,
      newGlobalPropertyNames: sharedGlobalPropertyNames,
      makeCompartmentConstructor: targetMakeCompartmentConstructor,
      parentCompartment: compartment,
      markVirtualizedNativeFunction,
    });

    // TODO: maybe add evalTaming to the Compartment constructor 3rd options?
    setGlobalObjectEvaluators(
      globalObject,
      safeEvaluate,
      markVirtualizedNativeFunction,
    );

    assign(globalObject, endowments);

    /**
     * In support dynamic import in a module source loaded by this compartment,
     * like `await import(importSpecifier)`, induces this compartment to import
     * a module, returning a promise for the resulting module exports
     * namespace.
     * Unlike `compartment.import`, never creates a box object for the
     * namespace as that behavior is deprecated and inconsistent with the
     * standard behavior of dynamic import.
     * Obliges the caller to resolve import specifiers to their corresponding
     * full specifier.
     * That is, every module must have its own dynamic import function that
     * closes over the surrounding module's full module specifier and calls
     * through to this function.
     * @param {string} fullSpecifier - A full specifier is a key in the
     * compartment's module memo.
     * The method `compartment.import` accepts a full specifier, but dynamic
     * import accepts an import specifier and resolves it to a full specifier
     * relative to the calling module's full specifier.
     * @returns {Promise<ModuleExportsNamespace>}
     */
    const compartmentImport = async fullSpecifier => {
      if (typeof resolveHook !== 'function') {
        throw TypeError(
          `Compartment does not support dynamic import: no configured resolveHook for compartment ${q(name)}`,
        );
      }
      await load(privateFields, moduleAliases, compartment, fullSpecifier, {
        noAggregateErrors: noAggregateLoadErrors,
      });
      const { execute, exportsProxy } = link(
        privateFields,
        moduleAliases,
        compartment,
        fullSpecifier,
      );
      execute();
      return exportsProxy;
    };

    weakmapSet(privateFields, compartment, {
      name: `${name}`,
      globalTransforms,
      globalObject,
      safeEvaluate,
      resolveHook,
      importHook,
      importNowHook,
      moduleMap,
      moduleMapHook,
      importMetaHook,
      moduleRecords,
      __shimTransforms__,
      deferredExports,
      instances,
      parentCompartment,
      noNamespaceBox,
      compartmentImport,
      noAggregateLoadErrors,
    });
  }

  Compartment.prototype = CompartmentPrototype;

  return Compartment;
};$h͏_once.makeCompartmentConstructor(makeCompartmentConstructor);
})()
,
// === 53. ses ./src/get-anonymous-intrinsics.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let FERAL_FUNCTION,FERAL_FLOAT64_ARRAY,Map,Set,String,getOwnPropertyDescriptor,getPrototypeOf,iterateArray,iterateMap,iterateSet,iterateString,matchAllRegExp,matchAllSymbol,regexpPrototype,globalThis,assign,AsyncGeneratorFunctionInstance,ArrayBuffer,InertCompartment;$h͏_imports([["./commons.js", [["FERAL_FUNCTION",[$h͏_a => (FERAL_FUNCTION = $h͏_a)]],["FERAL_FLOAT64_ARRAY",[$h͏_a => (FERAL_FLOAT64_ARRAY = $h͏_a)]],["Map",[$h͏_a => (Map = $h͏_a)]],["Set",[$h͏_a => (Set = $h͏_a)]],["String",[$h͏_a => (String = $h͏_a)]],["getOwnPropertyDescriptor",[$h͏_a => (getOwnPropertyDescriptor = $h͏_a)]],["getPrototypeOf",[$h͏_a => (getPrototypeOf = $h͏_a)]],["iterateArray",[$h͏_a => (iterateArray = $h͏_a)]],["iterateMap",[$h͏_a => (iterateMap = $h͏_a)]],["iterateSet",[$h͏_a => (iterateSet = $h͏_a)]],["iterateString",[$h͏_a => (iterateString = $h͏_a)]],["matchAllRegExp",[$h͏_a => (matchAllRegExp = $h͏_a)]],["matchAllSymbol",[$h͏_a => (matchAllSymbol = $h͏_a)]],["regexpPrototype",[$h͏_a => (regexpPrototype = $h͏_a)]],["globalThis",[$h͏_a => (globalThis = $h͏_a)]],["assign",[$h͏_a => (assign = $h͏_a)]],["AsyncGeneratorFunctionInstance",[$h͏_a => (AsyncGeneratorFunctionInstance = $h͏_a)]],["ArrayBuffer",[$h͏_a => (ArrayBuffer = $h͏_a)]]]],["./compartment.js", [["InertCompartment",[$h͏_a => (InertCompartment = $h͏_a)]]]]]);





















/**
 * Object.getConstructorOf()
 * Helper function to improve readability, similar to Object.getPrototypeOf().
 *
 * @param {object} obj
 */
function getConstructorOf(obj) {
  return getPrototypeOf(obj).constructor;
}

// getAnonymousIntrinsics uses a utility function to construct an arguments
// object, since it cannot have one of its own and also be a const export.
function makeArguments() {
  // eslint-disable-next-line prefer-rest-params
  return arguments;
}

/**
 * getAnonymousIntrinsics()
 * Get the intrinsics not otherwise reachable by named own property
 * traversal from the global object.
 *
 * @returns {object}
 */
       const getAnonymousIntrinsics = () => {
  const InertFunction = FERAL_FUNCTION.prototype.constructor;

  // 9.2.4.1 %ThrowTypeError%

  const argsCalleeDesc = getOwnPropertyDescriptor(makeArguments(), 'callee');
  const ThrowTypeError = argsCalleeDesc && argsCalleeDesc.get;

  // 21.1.5.2 The %StringIteratorPrototype% Object

  // eslint-disable-next-line no-new-wrappers
  const StringIteratorObject = iterateString(new String());
  const StringIteratorPrototype = getPrototypeOf(StringIteratorObject);

  // 21.2.7.1 The %RegExpStringIteratorPrototype% Object
  const RegExpStringIterator =
    regexpPrototype[matchAllSymbol] && matchAllRegExp(/./, '');
  const RegExpStringIteratorPrototype =
    RegExpStringIterator && getPrototypeOf(RegExpStringIterator);

  // 22.1.5.2 The %ArrayIteratorPrototype% Object

  // eslint-disable-next-line no-array-constructor
  const ArrayIteratorObject = iterateArray([]);
  const ArrayIteratorPrototype = getPrototypeOf(ArrayIteratorObject);

  // 22.2.1 The %TypedArray% Intrinsic Object

  const TypedArray = getPrototypeOf(FERAL_FLOAT64_ARRAY);

  // 23.1.5.2 The %MapIteratorPrototype% Object

  const MapIteratorObject = iterateMap(new Map());
  const MapIteratorPrototype = getPrototypeOf(MapIteratorObject);

  // 23.2.5.2 The %SetIteratorPrototype% Object

  const SetIteratorObject = iterateSet(new Set());
  const SetIteratorPrototype = getPrototypeOf(SetIteratorObject);

  // 25.1.2 The %IteratorPrototype% Object

  const IteratorPrototype = getPrototypeOf(ArrayIteratorPrototype);

  // 25.2.1 The GeneratorFunction Constructor

  // eslint-disable-next-line no-empty-function
  function* GeneratorFunctionInstance() {}
  const GeneratorFunction = getConstructorOf(GeneratorFunctionInstance);

  // 25.2.3 Properties of the GeneratorFunction Prototype Object

  const Generator = GeneratorFunction.prototype;

  // 25.7.1 The AsyncFunction Constructor

  // eslint-disable-next-line no-empty-function
  async function AsyncFunctionInstance() {}
  const AsyncFunction = getConstructorOf(AsyncFunctionInstance);

  const intrinsics = {
    '%InertFunction%': InertFunction,
    '%ArrayIteratorPrototype%': ArrayIteratorPrototype,
    '%InertAsyncFunction%': AsyncFunction,
    '%Generator%': Generator,
    '%InertGeneratorFunction%': GeneratorFunction,
    '%IteratorPrototype%': IteratorPrototype,
    '%MapIteratorPrototype%': MapIteratorPrototype,
    '%RegExpStringIteratorPrototype%': RegExpStringIteratorPrototype,
    '%SetIteratorPrototype%': SetIteratorPrototype,
    '%StringIteratorPrototype%': StringIteratorPrototype,
    '%ThrowTypeError%': ThrowTypeError,
    '%TypedArray%': TypedArray,
    '%InertCompartment%': InertCompartment,
  };

  if (AsyncGeneratorFunctionInstance !== undefined) {
    // 25.3.1 The AsyncGeneratorFunction Constructor

    const AsyncGeneratorFunction = getConstructorOf(
      AsyncGeneratorFunctionInstance,
    );

    // 25.3.2.2 AsyncGeneratorFunction.prototype
    const AsyncGenerator = AsyncGeneratorFunction.prototype;
    // 25.5.1 Properties of the AsyncGenerator Prototype Object
    const AsyncGeneratorPrototype = AsyncGenerator.prototype;
    const AsyncIteratorPrototype = getPrototypeOf(AsyncGeneratorPrototype);

    assign(intrinsics, {
      '%AsyncGenerator%': AsyncGenerator,
      '%InertAsyncGeneratorFunction%': AsyncGeneratorFunction,
      '%AsyncGeneratorPrototype%': AsyncGeneratorPrototype,
      '%AsyncIteratorPrototype%': AsyncIteratorPrototype,
    });
  }

  if (globalThis.Iterator) {
    intrinsics['%IteratorHelperPrototype%'] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      globalThis.Iterator.from([]).take(0),
    );
    intrinsics['%WrapForValidIteratorPrototype%'] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      globalThis.Iterator.from({
        next() {
          return { value: undefined };
        },
      }),
    );
  }

  if (globalThis.AsyncIterator) {
    intrinsics['%AsyncIteratorHelperPrototype%'] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      globalThis.AsyncIterator.from([]).take(0),
    );
    intrinsics['%WrapForValidAsyncIteratorPrototype%'] = getPrototypeOf(
      // eslint-disable-next-line @endo/no-polymorphic-call
      globalThis.AsyncIterator.from({ next() {} }),
    );
  }

  const ab = new ArrayBuffer(0);
  // eslint-disable-next-line @endo/no-polymorphic-call
  const iab = ab.sliceToImmutable();
  const iabProto = getPrototypeOf(iab);
  if (iabProto !== ArrayBuffer.prototype) {
    // In a native implementation, these will be the same prototype
    intrinsics['%ImmutableArrayBufferPrototype%'] = iabProto;
  }

  return intrinsics;
};$h͏_once.getAnonymousIntrinsics(getAnonymousIntrinsics);
})()
,
// === 54. ses ./src/tame-harden.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let freeze;$h͏_imports([["./commons.js", [["freeze",[$h͏_a => (freeze = $h͏_a)]]]]]);


/** @import {Harden} from '../types.js'; */

/** @type {(safeHarden: Harden, hardenTaming: 'safe' | 'unsafe') => Harden} */
       const tameHarden = (safeHarden, hardenTaming) => {
  if (hardenTaming === 'safe') {
    return safeHarden;
  }

  // In on the joke
  Object.isExtensible = () => false;
  Object.isFrozen = () => true;
  Object.isSealed = () => true;
  Reflect.isExtensible = () => false;

  // @ts-expect-error secret property
  if (safeHarden.isFake) {
    // The "safe" hardener is already a fake hardener.
    // Just use it.
    return safeHarden;
  }

  const fakeHarden = arg => arg;
  fakeHarden.isFake = true;
  return freeze(fakeHarden);
};$h͏_once.tameHarden(tameHarden);
freeze(tameHarden);
})()
,
// === 55. ses ./src/tame-symbol-constructor.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let Symbol,entries,fromEntries,getOwnPropertyDescriptors,defineProperties,arrayMap,functionBind;$h͏_imports([["./commons.js", [["Symbol",[$h͏_a => (Symbol = $h͏_a)]],["entries",[$h͏_a => (entries = $h͏_a)]],["fromEntries",[$h͏_a => (fromEntries = $h͏_a)]],["getOwnPropertyDescriptors",[$h͏_a => (getOwnPropertyDescriptors = $h͏_a)]],["defineProperties",[$h͏_a => (defineProperties = $h͏_a)]],["arrayMap",[$h͏_a => (arrayMap = $h͏_a)]],["functionBind",[$h͏_a => (functionBind = $h͏_a)]]]]]);









/**
 * This taming provides a tamed alternative to the original `Symbol` constructor
 * that starts off identical, except that all its properties are "temporarily"
 * configurable. The original `Symbol` constructor remains unmodified on
 * the start compartment's global. The tamed alternative is used as the shared
 * `Symbol` constructor on constructed compartments.
 *
 * Starting these properties as configurable assumes two succeeding phases of
 * processing: A permit enforcement phase, that
 * removes all properties not on the permits (which requires them to be
 * configurable) and a global hardening step that freezes all primordials,
 * returning these properties to their expected non-configurable status.
 *
 * The ses shim is constructed to eventually enable vetted shims to run between
 * repair and global hardening. However, such vetted shims would normally
 * run in the start compartment, which continues to use the original unmodified
 * `Symbol`, so they should not normally be affected by the temporary
 * configurability of these properties.
 *
 * Note that the spec refers to the global `Symbol` function as the
 * ["Symbol Constructor"](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-constructor)
 * even though it has a call behavior (can be called as a function) and does not
 * not have a construct behavior (cannot be called with `new`). Accordingly,
 * to tame it, we must replace it with a function without a construct
 * behavior.
 */
       const tameSymbolConstructor = () => {
  const OriginalSymbol = Symbol;
  const SymbolPrototype = OriginalSymbol.prototype;

  // Bypass Hermes bug, fixed in: https://github.com/facebook/hermes/commit/00f18c89c720e1c34592bb85a1a8d311e6e99599
  // Make a "copy" of the primordial [Symbol "constructor"](https://tc39.es/ecma262/#sec-symbol-description) which maintains all observable behavior. The primordial explicitly throws on `[[Construct]]` and has a `[[Call]]` which ignores the receiver. Binding also maintains the `toString` source as a native function. The `name` is restored below when copying own properties.
  const SharedSymbol = functionBind(Symbol, undefined);

  defineProperties(SymbolPrototype, {
    constructor: {
      value: SharedSymbol
      // leave other `constructor` attributes as is
    },
  });

  const originalDescsEntries = entries(
    getOwnPropertyDescriptors(OriginalSymbol),
  );
  const descs = fromEntries(
    arrayMap(originalDescsEntries, ([name, desc]) => [
      name,
      { ...desc, configurable: true },
    ]),
  );
  defineProperties(SharedSymbol, descs);

  return { '%SharedSymbol%': SharedSymbol };
};$h͏_once.tameSymbolConstructor(tameSymbolConstructor);
})()
,
// === 56. ses ./src/tame-faux-data-properties.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let getOwnPropertyDescriptor,apply,defineProperty,toStringTagSymbol;$h͏_imports([["./commons.js", [["getOwnPropertyDescriptor",[$h͏_a => (getOwnPropertyDescriptor = $h͏_a)]],["apply",[$h͏_a => (apply = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["toStringTagSymbol",[$h͏_a => (toStringTagSymbol = $h͏_a)]]]]]);






const throws = thunk => {
  try {
    thunk();
    return false;
  } catch (er) {
    return true;
  }
};

/**
 * Exported for convenience of unit testing. Harmless, but not expected
 * to be useful by itself.
 *
 * @param {any} obj
 * @param {string|symbol} prop
 * @param {any} expectedValue
 * @returns {boolean}
 * Returns whether `tameFauxDataProperty` turned the property in question
 * from an apparent faux data property into the actual data property it
 * seemed to emulate.
 * If this function returns `false`, then we hope no effects happened.
 * However, sniffing out if an accessor property seems to be a faux data
 * property requires invoking the getter and setter functions that might
 * possibly have side effects.
 * `tameFauxDataProperty` is not in a position to tell.
 */
       const tameFauxDataProperty = (obj, prop, expectedValue) => {
  if (obj === undefined) {
    // The object does not exist in this version of the platform
    return false;
  }
  const desc = getOwnPropertyDescriptor(obj, prop);
  if (!desc || 'value' in desc) {
    // The property either doesn't exist, or is already an actual data property.
    return false;
  }
  const { get, set } = desc;
  if (typeof get !== 'function' || typeof set !== 'function') {
    // A faux data property has both a getter and a setter
    return false;
  }
  if (get() !== expectedValue) {
    // The getter called by itself should produce the expectedValue
    return false;
  }
  if (apply(get, obj, []) !== expectedValue) {
    // The getter called with `this === obj` should also return the
    // expectedValue.
    return false;
  }
  const testValue = 'Seems to be a setter';
  const subject1 = { __proto__: null };
  apply(set, subject1, [testValue]);
  if (subject1[prop] !== testValue) {
    // The setter called with an unrelated object as `this` should
    // set the property on the object.
    return false;
  }
  const subject2 = { __proto__: obj };
  apply(set, subject2, [testValue]);
  if (subject2[prop] !== testValue) {
    // The setter called on an object that inherits from `obj` should
    // override the property from `obj` as if by assignment.
    return false;
  }
  if (!throws(() => apply(set, obj, [expectedValue]))) {
    // The setter called with `this === obj` should throw without having
    // caused any effect.
    // This is the test that has the greatest danger of leaving behind some
    // persistent side effect. The most obvious one is to emulate a
    // successful assignment to the property. That's why this test
    // uses `expectedValue`, so that case is likely not to actually
    // change anything.
    return false;
  }
  if ('originalValue' in get) {
    // The ses-shim uniquely, as far as we know, puts an `originalValue`
    // property on the getter, so that reflect property tranversal algorithms,
    // like `harden`, will traverse into the enulated value without
    // calling the getter. That does not happen until `permits-intrinsics.js`
    // which is much later. So if we see one this early, we should
    // not assume we understand what's going on.
    return false;
  }

  // We assume that this code runs before any untrusted code runs, so
  // we do not need to worry about the above conditions passing because of
  // malicious intent. In fact, it runs even before vetted shims are supposed
  // to run, between repair and hardening. Given that, after all these tests
  // pass, we have adequately validated that the property in question is
  // an accessor function whose purpose is suppressing the override mistake,
  // i.e., enabling a non-writable property to be overridden by assignment.
  // In that case, here we *temporarily* turn it into the data property
  // it seems to emulate, but writable so that it does not trigger the
  // override mistake while in this temporary state.

  // For those properties that are also listed in `enablements.js`,
  // that phase will re-enable override for these properties, but
  // via accessor functions that SES controls, so we know what they are
  // doing. In addition, the getter functions installed by
  // `enable-property-overrides.js` have an `originalValue` field
  // enabling meta-traversal code like harden to visit the original value
  // without calling the getter.

  if (desc.configurable === false) {
    // Even though it seems to be a faux data property, we're unable to fix it.
    return false;
  }

  // Many of the `return false;` cases above plausibly should be turned into
  // errors, or an least generate warnings. However, for those, the checks
  // following this phase are likely to signal an error anyway.

  // At this point, we have passed all our sniff checks for validating that
  // it seems to be a faux data property with the expected value. Turn
  // it into the actual data property it emulates, but writable so there is
  // not yet an override mistake problem.

  defineProperty(obj, prop, {
    value: expectedValue,
    writable: true,
    enumerable: desc.enumerable,
    configurable: true,
  });

  return true;
};

/**
 * In JavaScript, the so-called "override mistake" is the inability to
 * override an inherited non-writable data property by assignment. A common
 * workaround is to instead define an accessor property that acts like
 * a non-writable data property, except that it allows an object that
 * inherits this property to override it by assignment. Let's call
 * an access property that acts this way a "faux data property". In this
 * ses-shim, `enable-property-overrides.js` makes the properties listed in
 * `enablements.js` into faux data properties.
 *
 * But the ses-shim is not alone in use of this trick. Starting with the
 * [Iterator Helpers proposal](https://github.com/tc39/proposal-iterator-helpers),
 * some properties are defined as (what we call) faux data properties.
 * Some of these are new properties (`Interator.prototype.constructor`) and
 * some are old data properties converted to accessor properties
 * (`Iterator.prototype[String.toStringTag]`). So the ses-shim needs to be
 * prepared for some enumerated set of properties to already be faux data
 * properties in the platform prior to our initialization.
 *
 * For these possible faux data properties, it is important that
 * `permits.js` describe each as a data property, so that it can further
 * constrain the apparent value (that allegedly would be returned by the
 * getter) according to its own permits.
 *
 * However, at the time of this writing, the precise behavior specified
 * by the iterator-helpers proposal for these faux data properties is
 * novel. We should not be too confident that all further such platform
 * additions do what we would now expect. So, for each of these possible
 * faux data properties, we do some sniffing to see if it behaves as we
 * currently expect a faux data property to act. If not, then
 * `tameFauxDataProperties` tries not to modify it, leaving it to later
 * checks, especially `permits-intrinsics.js`, to error when it sees an
 * unexpected accessor.
 *
 * If one of these enumerated accessor properties does seem to be
 * a faithful faux data property, then `tameFauxDataProperties` itself
 * *tempoarily* turns it into the actual data property that it seems to emulate.
 * This data property starts as writable, so that in this state it will
 * not trigger the override mistake, i.e., assignment to an object inheriting
 * this property is allowed to succeed at overriding this property.
 *
 * For those properties that should be a faux data property rather than an
 * actual one, such as those from the iterator-helpers proposal,
 * they should be listed as such in `enablements.js`, so
 * `enable-property-overrides.js` will turn it back into a faux data property.
 * But one controlled by the ses-shim, whose behavior we understand.
 *
 * `tameFauxDataProperties`, which turns these into actual data properties,
 * happens during the `repairIntrinsics` phase
 * of `lockdown`, before even vetted shim are supposed to run.
 * `enable-property-overrides.js` runs after vetted shims, turning the
 * appropriate ones back into faux data properties. Thus vetted shims
 * can observe the possibly non-conforming state where these are temporarily
 * actual data properties, rather than faux data properties.
 *
 * Coordinate the property enumeration here
 * with `enablements.js`, so the appropriate properties are
 * turned back to faux data properties.
 *
 * @param {Record<any,any>} intrinsics
 */$h͏_once.tameFauxDataProperty(tameFauxDataProperty);
       const tameFauxDataProperties = intrinsics => {
  // https://github.com/tc39/proposal-iterator-helpers
  tameFauxDataProperty(
    intrinsics['%IteratorPrototype%'],
    'constructor',
    intrinsics.Iterator,
  );
  // https://github.com/tc39/proposal-iterator-helpers
  tameFauxDataProperty(
    intrinsics['%IteratorPrototype%'],
    toStringTagSymbol,
    'Iterator',
  );
};$h͏_once.tameFauxDataProperties(tameFauxDataProperties);
})()
,
// === 57. ses ./src/tame-regenerator-runtime.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let defineProperty,iteratorPrototype,iteratorSymbol,hasOwn;$h͏_imports([["./commons.js", [["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]],["iteratorPrototype",[$h͏_a => (iteratorPrototype = $h͏_a)]],["iteratorSymbol",[$h͏_a => (iteratorSymbol = $h͏_a)]],["hasOwn",[$h͏_a => (hasOwn = $h͏_a)]]]]]);






       const tameRegeneratorRuntime = () => {
  const iter = iteratorPrototype[iteratorSymbol];
  defineProperty(iteratorPrototype, iteratorSymbol, {
    configurable: true,
    get() {
      return iter;
    },
    set(value) {
      // ignore the assignment on IteratorPrototype
      if (this === iteratorPrototype) return;
      if (hasOwn(this, iteratorSymbol)) {
        this[iteratorSymbol] = value;
      }
      defineProperty(this, iteratorSymbol, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    },
  });
};$h͏_once.tameRegeneratorRuntime(tameRegeneratorRuntime);
})()
,
// === 58. ses ./src/shim-arraybuffer-transfer.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let ArrayBuffer,arrayBufferPrototype,arrayBufferSlice,arrayBufferGetByteLength,Uint8Array,typedArraySet,globalThis,TypeError,defineProperty;$h͏_imports([["./commons.js", [["ArrayBuffer",[$h͏_a => (ArrayBuffer = $h͏_a)]],["arrayBufferPrototype",[$h͏_a => (arrayBufferPrototype = $h͏_a)]],["arrayBufferSlice",[$h͏_a => (arrayBufferSlice = $h͏_a)]],["arrayBufferGetByteLength",[$h͏_a => (arrayBufferGetByteLength = $h͏_a)]],["Uint8Array",[$h͏_a => (Uint8Array = $h͏_a)]],["typedArraySet",[$h͏_a => (typedArraySet = $h͏_a)]],["globalThis",[$h͏_a => (globalThis = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["defineProperty",[$h͏_a => (defineProperty = $h͏_a)]]]]]);











       const shimArrayBufferTransfer = () => {
  if (typeof arrayBufferPrototype.transfer === 'function') {
    // Assume already exists so does not need to be shimmed.
    // Such conditional shimming is ok in this case since ArrayBuffer.p.transfer
    // is already officially part of JS.
    //
    // Empty object because this shim has nothing for `addIntrinsics` to add.
    return {};
  }
  const clone = globalThis.structuredClone;
  if (typeof clone !== 'function') {
    // On a platform with neither `Array.prototype.transfer`
    // nor `structuredClone`, this shim does nothing.
    // For example, Node <= 16 has neither.
    //
    // Empty object because this shim has nothing for `addIntrinsics` to add.
    return {};
    // TODO Rather than doing nothing, should the endo ses-shim throw
    // in this case?
    // throw TypeError(
    //   `Can only shim missing ArrayBuffer.prototype.transfer on a platform with "structuredClone"`,
    // );
    // For example, endo no longer supports Node <= 16. All browsers have
    // `structuredClone`. XS has `Array.prototype.transfer`. Are there still
    // any platforms without both that Endo should still support?
    // What about Hermes?
  }

  /**
   * @type {ThisType<ArrayBuffer>}
   */
  const methods = {
    /**
     * @param {number} [newLength]
     */
    transfer(newLength = undefined) {
      // Using this builtin getter also ensures that `this` is a genuine
      // ArrayBuffer.
      const oldLength = arrayBufferGetByteLength(this);
      if (newLength === undefined || newLength === oldLength) {
        return clone(this, { transfer: [this] });
      }
      if (typeof newLength !== 'number') {
        throw TypeError(`transfer newLength if provided must be a number`);
      }
      if (newLength > oldLength) {
        const result = new ArrayBuffer(newLength);
        const taOld = new Uint8Array(this);
        const taNew = new Uint8Array(result);
        typedArraySet(taNew, taOld);
        // Using clone only to detach, and only after the copy succeeds
        clone(this, { transfer: [this] });
        return result;
      } else {
        const result = arrayBufferSlice(this, 0, newLength);
        // Using clone only to detach, and only after the slice succeeds
        clone(this, { transfer: [this] });
        return result;
      }
    },
  };

  defineProperty(arrayBufferPrototype, 'transfer', {
    // @ts-expect-error
    value: methods.transfer,
    writable: true,
    enumerable: false,
    configurable: true,
  });

  // Empty object because this shim has nothing for `addIntrinsics` to add.
  return {};
};$h͏_once.shimArrayBufferTransfer(shimArrayBufferTransfer);
})()
,
// === 59. ses ./src/reporting.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let globalThis,assert;$h͏_imports([["./commons.js", [["globalThis",[$h͏_a => (globalThis = $h͏_a)]]]],["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]]]]]);


/**
 * @import {Reporter, GroupReporter} from './reporting-types.js'
 */

/* eslint-disable @endo/no-polymorphic-call */
/**
 * To address https://github.com/endojs/endo/issues/2908,
 * the `consoleReporter` uses the current `console` rather
 * than the original one.
 *
 * @type {GroupReporter}
 */
const consoleReporter = {
  warn(...args) {
    globalThis.console.warn(...args);
  },
  error(...args) {
    globalThis.console.error(...args);
  },
  ...(globalThis.console?.groupCollapsed
    ? {
        groupCollapsed(...args) {
          globalThis.console.groupCollapsed(...args);
        },
      }
    : undefined),
  ...(globalThis.console?.groupEnd
    ? {
        groupEnd() {
          globalThis.console.groupEnd();
        },
      }
    : undefined),
};
/* eslint-enable @endo/no-polymorphic-call */

/**
 * Creates a suitable reporter for internal errors and warnings out of the
 * Node.js console.error to ensure all messages go to stderr, including the
 * group label.
 * Accounts for the extra space introduced by console.error as a delimiter
 * between the indent and subsequent arguments.
 *
 * @param {(...message: Array<any>) => void} print
 */
const makeReportPrinter = print => {
  let indent = false;
  /** @param {Array<any>} args */
  const printIndent = (...args) => {
    if (indent) {
      print(' ', ...args);
    } else {
      print(...args);
    }
  };
  return /** @type {GroupReporter} */ ({
    warn(...args) {
      printIndent(...args);
    },
    error(...args) {
      printIndent(...args);
    },
    groupCollapsed(...args) {
      assert(!indent);
      print(...args);
      indent = true;
    },
    groupEnd() {
      indent = false;
    },
  });
};

const mute = () => {};

/**
 * @param {"platform" | "console" | "none"} reporting
 */
       const chooseReporter = reporting => {
  if (reporting === 'none') {
    return makeReportPrinter(mute);
  }
  if (globalThis.console !== undefined) {
    if (
      reporting === 'console' || // asks for console explicitly
      globalThis.window === globalThis || // likely on browser
      globalThis.importScripts !== undefined // likely on worker
    ) {
      // reporter just delegates directly to the current console
      return consoleReporter;
    }
    assert(reporting === 'platform');
    // On Node.js, we send all feedback to stderr, regardless of purported level.
    // This uses `consoleReporter.error` instead of `console.error` because we
    // want the constructed reporter to use the `console.error` of the current
    // `console`, not the `console` that was installed when the reporter
    // was created.
    return makeReportPrinter(consoleReporter.error);
  }
  if (globalThis.print !== undefined) {
    return makeReportPrinter(globalThis.print);
  }
  return makeReportPrinter(mute);
};

/**
 * @param {string} groupLabel
 * @param {GroupReporter} console
 * @param {(internalConsole: Reporter) => void} callback
 */$h͏_once.chooseReporter(chooseReporter);
       const reportInGroup = (groupLabel, console, callback) => {
  const { warn, error, groupCollapsed, groupEnd } = console;
  const grouping = groupCollapsed && groupEnd;
  let groupStarted = false;
  try {
    return callback({
      warn(...args) {
        if (grouping && !groupStarted) {
          groupCollapsed(groupLabel);
          groupStarted = true;
        }
        warn(...args);
      },
      error(...args) {
        if (grouping && !groupStarted) {
          groupCollapsed(groupLabel);
          groupStarted = true;
        }
        error(...args);
      },
    });
  } finally {
    if (grouping && groupStarted) {
      groupEnd();
      groupStarted = false;
    }
  }
};$h͏_once.reportInGroup(reportInGroup);
})()
,
// === 60. ses ./src/lockdown.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let getenv,FERAL_FUNCTION,FERAL_EVAL,TypeError,arrayFilter,globalThis,is,ownKeys,stringSplit,symbolFor,noEvalEvaluate,getOwnPropertyNames,getPrototypeOf,makeHardener,makeIntrinsicsCollector,removeUnpermittedIntrinsics,tameFunctionConstructors,tameDateConstructor,tameMathObject,tameTemporalObject,tameNaNSideChannel,tameRegExpConstructor,enablePropertyOverrides,tameLocaleMethods,setGlobalObjectConstantProperties,setGlobalObjectMutableProperties,setGlobalObjectEvaluators,makeSafeEvaluator,initialGlobalPropertyNames,tameFunctionToString,tameDomains,tameModuleSource,tameConsole,tameErrorConstructor,assert,makeAssert,getAnonymousIntrinsics,makeCompartmentConstructor,tameHarden,tameSymbolConstructor,tameFauxDataProperties,tameRegeneratorRuntime,shimArrayBufferTransfer,reportInGroup,chooseReporter;$h͏_imports([["@endo/env-options", [["getEnvironmentOption",[$h͏_a => (getenv = $h͏_a)]]]],["@endo/immutable-arraybuffer/shim.js", []],["./commons.js", [["FERAL_FUNCTION",[$h͏_a => (FERAL_FUNCTION = $h͏_a)]],["FERAL_EVAL",[$h͏_a => (FERAL_EVAL = $h͏_a)]],["TypeError",[$h͏_a => (TypeError = $h͏_a)]],["arrayFilter",[$h͏_a => (arrayFilter = $h͏_a)]],["globalThis",[$h͏_a => (globalThis = $h͏_a)]],["is",[$h͏_a => (is = $h͏_a)]],["ownKeys",[$h͏_a => (ownKeys = $h͏_a)]],["stringSplit",[$h͏_a => (stringSplit = $h͏_a)]],["symbolFor",[$h͏_a => (symbolFor = $h͏_a)]],["noEvalEvaluate",[$h͏_a => (noEvalEvaluate = $h͏_a)]],["getOwnPropertyNames",[$h͏_a => (getOwnPropertyNames = $h͏_a)]],["getPrototypeOf",[$h͏_a => (getPrototypeOf = $h͏_a)]]]],["./make-hardener.js", [["makeHardener",[$h͏_a => (makeHardener = $h͏_a)]]]],["./intrinsics.js", [["makeIntrinsicsCollector",[$h͏_a => (makeIntrinsicsCollector = $h͏_a)]]]],["./permits-intrinsics.js", [["default",[$h͏_a => (removeUnpermittedIntrinsics = $h͏_a)]]]],["./tame-function-constructors.js", [["default",[$h͏_a => (tameFunctionConstructors = $h͏_a)]]]],["./tame-date-constructor.js", [["default",[$h͏_a => (tameDateConstructor = $h͏_a)]]]],["./tame-math-object.js", [["default",[$h͏_a => (tameMathObject = $h͏_a)]]]],["./tame-temporal-object.js", [["default",[$h͏_a => (tameTemporalObject = $h͏_a)]]]],["./tame-nan-sidechannel.js", [["tameNaNSideChannel",[$h͏_a => (tameNaNSideChannel = $h͏_a)]]]],["./tame-regexp-constructor.js", [["default",[$h͏_a => (tameRegExpConstructor = $h͏_a)]]]],["./enable-property-overrides.js", [["default",[$h͏_a => (enablePropertyOverrides = $h͏_a)]]]],["./tame-locale-methods.js", [["default",[$h͏_a => (tameLocaleMethods = $h͏_a)]]]],["./global-object.js", [["setGlobalObjectConstantProperties",[$h͏_a => (setGlobalObjectConstantProperties = $h͏_a)]],["setGlobalObjectMutableProperties",[$h͏_a => (setGlobalObjectMutableProperties = $h͏_a)]],["setGlobalObjectEvaluators",[$h͏_a => (setGlobalObjectEvaluators = $h͏_a)]]]],["./make-safe-evaluator.js", [["makeSafeEvaluator",[$h͏_a => (makeSafeEvaluator = $h͏_a)]]]],["./permits.js", [["initialGlobalPropertyNames",[$h͏_a => (initialGlobalPropertyNames = $h͏_a)]]]],["./tame-function-tostring.js", [["tameFunctionToString",[$h͏_a => (tameFunctionToString = $h͏_a)]]]],["./tame-domains.js", [["tameDomains",[$h͏_a => (tameDomains = $h͏_a)]]]],["./tame-module-source.js", [["tameModuleSource",[$h͏_a => (tameModuleSource = $h͏_a)]]]],["./error/tame-console.js", [["tameConsole",[$h͏_a => (tameConsole = $h͏_a)]]]],["./error/tame-error-constructor.js", [["default",[$h͏_a => (tameErrorConstructor = $h͏_a)]]]],["./error/assert.js", [["assert",[$h͏_a => (assert = $h͏_a)]],["makeAssert",[$h͏_a => (makeAssert = $h͏_a)]]]],["./get-anonymous-intrinsics.js", [["getAnonymousIntrinsics",[$h͏_a => (getAnonymousIntrinsics = $h͏_a)]]]],["./compartment.js", [["makeCompartmentConstructor",[$h͏_a => (makeCompartmentConstructor = $h͏_a)]]]],["./tame-harden.js", [["tameHarden",[$h͏_a => (tameHarden = $h͏_a)]]]],["./tame-symbol-constructor.js", [["tameSymbolConstructor",[$h͏_a => (tameSymbolConstructor = $h͏_a)]]]],["./tame-faux-data-properties.js", [["tameFauxDataProperties",[$h͏_a => (tameFauxDataProperties = $h͏_a)]]]],["./tame-regenerator-runtime.js", [["tameRegeneratorRuntime",[$h͏_a => (tameRegeneratorRuntime = $h͏_a)]]]],["./shim-arraybuffer-transfer.js", [["shimArrayBufferTransfer",[$h͏_a => (shimArrayBufferTransfer = $h͏_a)]]]],["./reporting.js", [["reportInGroup",[$h͏_a => (reportInGroup = $h͏_a)]],["chooseReporter",[$h͏_a => (chooseReporter = $h͏_a)]]]]]);

































































/** @import {LockdownOptions} from '../types.js' */

const { Fail, details: X, quote: q } = assert;

/** @type {Error=} */
let priorRepairIntrinsics;

/** @type {Error=} */
let priorHardenIntrinsics;

// Build a harden() with an empty fringe.
// Gate it on lockdown.
/**
 * @template T
 * @param {T} ref
 * @returns {T}
 */
const safeHarden = makeHardener();

/**
 * @callback Transform
 * @param {string} source
 * @returns {string}
 */

/**
 * @callback CompartmentConstructor
 * @param {object} endowments
 * @param {object} moduleMap
 * @param {object} [options]
 * @param {Array<Transform>} [options.transforms]
 * @param {Array<Transform>} [options.__shimTransforms__]
 */

// TODO https://github.com/endojs/endo/issues/814
// Lockdown currently allows multiple calls provided that the specified options
// of every call agree.  With experience, we have observed that lockdown should
// only ever need to be called once and that simplifying lockdown will improve
// the quality of audits.

const probeHostEvaluators = () => {
  let functionAllowed;
  try {
    functionAllowed = FERAL_FUNCTION('return true')();
  } catch (_error) {
    // We reach here if the Function() constructor is outright forbidden by a
    // strict Content Security Policy (containing either a `default-src` or a
    // `script-src` directive), not been implemented in the host, or the host
    // is configured to throw an exception instead of `new Function`.
    functionAllowed = false;
  }

  let evalAllowed;
  try {
    evalAllowed = FERAL_EVAL('true');
  } catch (_error) {
    // We reach here if `eval` is outright forbidden by a strict Content Security Policy,
    // not implemented in the host, or the host is configured to throw an exception.
    // We allow this for SES usage that delegates the responsibility to isolate
    // guest code to production code generation.
    evalAllowed = false;
  }

  let directEvalAllowed;
  if (functionAllowed && evalAllowed) {
    directEvalAllowed = FERAL_FUNCTION(
      'eval',
      'SES_changed',
      `\
        eval("SES_changed = true");
        return SES_changed;
      `,
    )(FERAL_EVAL, false);
    // If we get here and SES_changed stayed false, that means the eval was sloppy
    // and indirect, which generally creates a new global.
    // We are going to throw an exception for failing to initialize SES, but
    // good neighbors clean up.
    if (!directEvalAllowed) {
      delete globalThis.SES_changed;
    }
  }

  return { functionAllowed, evalAllowed, directEvalAllowed };
};

/**
 * @param {LockdownOptions} [options]
 */
       const repairIntrinsics = (options = {}) => {
  // First time, absent options default to 'safe'.
  // Subsequent times, absent options default to first options.
  // Thus, all present options must agree with first options.
  // Reconstructing `option` here also ensures that it is a well
  // behaved record, with only own data properties.
  //
  // The `overrideTaming` is not a safety issue. Rather it is a tradeoff
  // between code compatibility, which is better with the `'moderate'`
  // setting, and tool compatibility, which is better with the `'min'`
  // setting. See
  // https://github.com/Agoric/SES-shim/blob/master/packages/ses/README.md#enabling-override-by-assignment)
  // for an explanation of when to use which.
  //
  // The `stackFiltering` is not a safety issue. Rather it is a tradeoff
  // between relevance and completeness of the stack frames shown on the
  // console. Setting`stackFiltering` to `'verbose'` applies no filters, providing
  // the raw stack frames that can be quite verbose. Setting
  // `stackFrameFiltering` to`'concise'` limits the display to the stack frame
  // information most likely to be relevant, eliminating distracting frames
  // such as those from the infrastructure. However, the bug you're trying to
  // track down might be in the infrastructure, in which case the `'verbose'` setting
  // is useful. See
  // [`stackFiltering` options](https://github.com/Agoric/SES-shim/blob/master/packages/ses/docs/lockdown.md#stackfiltering-options)
  // for an explanation.

  const {
    errorTaming = /** @type {'safe' | 'unsafe' | 'unsafe-debug'} */ (
      getenv('LOCKDOWN_ERROR_TAMING', 'safe', ['unsafe', 'unsafe-debug'])
    ),
    errorTrapping = /** @type {'platform' | 'none' | 'report' | 'abort' | 'exit'} */ (
      getenv('LOCKDOWN_ERROR_TRAPPING', 'platform', [
        'none',
        'report',
        'abort',
        'exit',
      ])
    ),
    reporting = /** @type {'platform' | 'console' | 'none'} */ (
      getenv('LOCKDOWN_REPORTING', 'platform', ['console', 'none'])
    ),
    unhandledRejectionTrapping = /** @type {'none' | 'report'} */ (
      getenv('LOCKDOWN_UNHANDLED_REJECTION_TRAPPING', 'report', ['none'])
    ),
    regExpTaming = /** @type {'safe' | 'unsafe'} */ (
      getenv('LOCKDOWN_REGEXP_TAMING', 'safe', ['unsafe'])
    ),
    localeTaming = /** @type {'safe' | 'unsafe'} */ (
      getenv('LOCKDOWN_LOCALE_TAMING', 'safe', ['unsafe'])
    ),
    consoleTaming = /** @type {'unsafe' | 'safe'} */ (
      getenv('LOCKDOWN_CONSOLE_TAMING', 'safe', ['unsafe'])
    ),
    overrideTaming = /** @type {'moderate' | 'min' | 'severe'} */ (
      getenv('LOCKDOWN_OVERRIDE_TAMING', 'moderate', ['min', 'severe'])
    ),
    stackFiltering = /** @type {'concise' | 'omit-frames' | 'shorten-paths' | 'verbose'} */ (
      getenv('LOCKDOWN_STACK_FILTERING', 'concise', [
        'omit-frames',
        'shorten-paths',
        'verbose',
      ])
    ),
    domainTaming = /** @type {'safe' | 'unsafe'} */ (
      getenv('LOCKDOWN_DOMAIN_TAMING', 'safe', ['unsafe'])
    ),
    evalTaming = /** @type {'safe-eval' | 'unsafe-eval' | 'no-eval'} */ (
      getenv('LOCKDOWN_EVAL_TAMING', 'safe-eval', [
        'unsafe-eval',
        'no-eval',
        // deprecated
        'safeEval',
        'unsafeEval',
        'noEval',
      ])
    ),
    overrideDebug = /** @type {string[]} */ (
      arrayFilter(
        stringSplit(getenv('LOCKDOWN_OVERRIDE_DEBUG', ''), ','),
        /** @param {string} debugName */
        debugName => debugName !== '',
      )
    ),
    legacyRegeneratorRuntimeTaming = /** @type {'safe' | 'unsafe-ignore'} */ (
      getenv('LOCKDOWN_LEGACY_REGENERATOR_RUNTIME_TAMING', 'safe', [
        'unsafe-ignore',
      ])
    ),
    __hardenTaming__ = /** @type {'safe' | 'unsafe'} */ (
      getenv('LOCKDOWN_HARDEN_TAMING', 'safe', ['unsafe'])
    ),
    dateTaming, // deprecated
    mathTaming, // deprecated
    ...extraOptions
  } = options;

  // Assert that only supported options were passed.
  // Use Reflect.ownKeys to reject symbol-named properties as well.
  const extraOptionsNames = ownKeys(extraOptions);
  extraOptionsNames.length === 0 ||
    Fail`lockdown(): non supported option ${q(extraOptionsNames)}`;

  const reporter = chooseReporter(reporting);
  const { warn } = reporter;

  if (dateTaming !== undefined) {
    warn(
      `SES The 'dateTaming' option is deprecated and does nothing. In the future specifying it will be an error.`,
    );
  }
  if (mathTaming !== undefined) {
    warn(
      `SES The 'mathTaming' option is deprecated and does nothing. In the future specifying it will be an error.`,
    );
  }

  priorRepairIntrinsics === undefined ||
    // eslint-disable-next-line @endo/no-polymorphic-call
    assert.fail(
      X`Already locked down at ${priorRepairIntrinsics} (SES_ALREADY_LOCKED_DOWN)`,
      TypeError,
    );
  // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_ALREADY_LOCKED_DOWN.md
  priorRepairIntrinsics = TypeError('Prior lockdown (SES_ALREADY_LOCKED_DOWN)');
  // Tease V8 to generate the stack string and release the closures the stack
  // trace retained:
  priorRepairIntrinsics.stack;

  const { functionAllowed, evalAllowed, directEvalAllowed } =
    probeHostEvaluators();

  if (
    directEvalAllowed === false &&
    evalTaming === 'safe-eval' &&
    (functionAllowed || evalAllowed)
  ) {
    // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_DIRECT_EVAL.md
    throw TypeError(
      "SES cannot initialize unless 'eval' is the original intrinsic 'eval', suitable for direct eval (dynamically scoped eval) (SES_DIRECT_EVAL)",
    );
  }

  /**
   * Because of packagers and bundlers, etc, multiple invocations of lockdown
   * might happen in separate instantiations of the source of this module.
   * In that case, each one sees its own `firstOptions` variable, so the test
   * above will not detect that lockdown has already happened. We
   * unreliably test some telltale signs that lockdown has run, to avoid
   * trying to lock down a locked down environment. Although the test is
   * unreliable, this is consistent with the SES threat model. SES provides
   * security only if it runs first in a given realm, or if everything that
   * runs before it is SES-aware and cooperative. Neither SES nor anything
   * can protect itself from corrupting code that runs first. For these
   * purposes, code that turns a realm into something that passes these
   * tests without actually locking down counts as corrupting code.
   *
   * The specifics of what this tests for may change over time, but it
   * should be consistent with any setting of the lockdown options.
   */
  const seemsToBeLockedDown = () => {
    return (
      globalThis.Function.prototype.constructor !== globalThis.Function &&
      // @ts-ignore harden is absent on globalThis type def.
      typeof globalThis.harden === 'function' &&
      // @ts-ignore lockdown is absent on globalThis type def.
      typeof globalThis.lockdown === 'function' &&
      globalThis.Date.prototype.constructor !== globalThis.Date &&
      typeof globalThis.Date.now === 'function' &&
      // @ts-ignore does not recognize that Date constructor is a special
      // Function.
      // eslint-disable-next-line @endo/no-polymorphic-call
      is(globalThis.Date.prototype.constructor.now(), NaN)
    );
  };

  if (seemsToBeLockedDown()) {
    // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_MULTIPLE_INSTANCES.md
    throw TypeError(
      `Already locked down but not by this SES instance (SES_MULTIPLE_INSTANCES)`,
    );
  }

  /**
   * 1. TAME powers & gather intrinsics first.
   */

  tameDomains(domainTaming);

  // Replace Function.prototype.toString with one that recognizes
  // shimmed functions as honorary native functions.
  const markVirtualizedNativeFunction = tameFunctionToString();

  const { addIntrinsics, completePrototypes, finalIntrinsics } =
    makeIntrinsicsCollector(reporter);

  const tamedHarden = tameHarden(safeHarden, __hardenTaming__);
  addIntrinsics({ harden: tamedHarden });

  addIntrinsics(tameFunctionConstructors());

  addIntrinsics(tameDateConstructor());
  addIntrinsics(tameErrorConstructor(errorTaming, stackFiltering));
  addIntrinsics(tameMathObject());
  addIntrinsics(tameTemporalObject());
  tameNaNSideChannel();
  addIntrinsics(tameRegExpConstructor(regExpTaming));
  addIntrinsics(tameSymbolConstructor());
  addIntrinsics(shimArrayBufferTransfer());
  addIntrinsics(tameModuleSource());

  addIntrinsics(getAnonymousIntrinsics());

  completePrototypes();

  const intrinsics = finalIntrinsics();

  // Install Object[@harden] or abort.
  const symbolForHarden = symbolFor('harden');
  const priorHarden = intrinsics.Object[symbolForHarden];
  if (priorHarden) {
    // By convention, if a module like @endo/harden gets used before lockdown,
    // it will install itself as a non-configurable, non-writable property over
    // Object[@harden] so that versions of SES predating the introduction of
    // Object[@harden] will fail to lockdown because they cannot remove an
    // unknown intrinsic.
    // All newer versions explicitly check for Object[@harden] (here).
    // The @endo/harden implementation additionally captures a stack trace
    // where harden was first used to assist developers in tracking down the
    // hardened module that was initialized before lockdown.
    if (priorHarden.lockdownError) {
      throw priorHarden.lockdownError;
    }
    // And in the event a library installs Object[@harden] without leaving a
    // hint, we fall back to a generic lockdown error.
    throw new TypeError(
      'Cannot lockdown (repairIntrinsics) if a prior harden implementation has been used and installed. Check for libraries using @endo/harden before lockdown.',
    );
  }
  intrinsics.Object[symbolForHarden] = tamedHarden;

  const hostIntrinsics = { __proto__: null };

  // The Node.js Buffer is a derived class of Uint8Array, and as such is often
  // passed around where a Uint8Array is expected.
  if (typeof globalThis.Buffer === 'function') {
    hostIntrinsics.Buffer = globalThis.Buffer;
  }

  /**
   * Wrap console unless suppressed.
   * At the moment, the console is considered a host power in the start
   * compartment, and not a primordial. Hence it is absent from the whilelist
   * and bypasses the intrinsicsCollector.
   *
   * @type {((error: any) => string | undefined) | undefined}
   */
  let optGetStackString;
  if (errorTaming === 'safe') {
    optGetStackString = intrinsics['%InitialGetStackString%'];
  }
  const consoleRecord = tameConsole(
    consoleTaming,
    errorTrapping,
    unhandledRejectionTrapping,
    optGetStackString,
  );
  globalThis.console = /** @type {Console} */ (consoleRecord.console);

  // The untamed Node.js console cannot itself be hardened as it has mutable
  // internal properties, but some of these properties expose internal versions
  // of classes from node's "primordials" concept.
  // eslint-disable-next-line no-underscore-dangle
  if (typeof (/** @type {any} */ (consoleRecord.console)._times) === 'object') {
    // SafeMap is a derived Map class used internally by Node
    // There doesn't seem to be a cleaner way to reach it.
    hostIntrinsics.SafeMap = getPrototypeOf(
      // eslint-disable-next-line no-underscore-dangle
      /** @type {any} */ (consoleRecord.console)._times,
    );
  }

  // The default `assert` installed by `assert-shim.js` does not redact errors,
  // leaving `lockdown` or `repairIntrinsics` with the obligation to replace it
  // with a redacting version, unless the caller opts-out with errorTaming set
  // to `unsafe` or `unsafe-debug`.
  // The inverse was true through version 1.13.0, except the configuration
  // was disregarded and the redacting `assert` left in place if lexical
  // `assert` differed from `globalThis.assert`.
  // @ts-ignore assert is absent on globalThis type def.
  if (errorTaming !== 'unsafe' && errorTaming !== 'unsafe-debug') {
    globalThis.assert = makeAssert();
  }

  // Replace *Locale* methods with their non-locale equivalents
  tameLocaleMethods(intrinsics, localeTaming);

  tameFauxDataProperties(intrinsics);

  /**
   * 2. Enforce PERMITS on shared intrinsics
   */

  // Remove non-standard properties.
  // All remaining functions encountered during whitelisting are
  // branded as honorary native functions.
  reportInGroup(
    'SES Removing unpermitted intrinsics',
    reporter,
    groupReporter =>
      removeUnpermittedIntrinsics(
        intrinsics,
        markVirtualizedNativeFunction,
        groupReporter,
      ),
  );

  // Initialize the powerful initial global, i.e., the global of the
  // start compartment, from the intrinsics.

  setGlobalObjectConstantProperties(globalThis);

  setGlobalObjectMutableProperties(globalThis, {
    intrinsics,
    newGlobalPropertyNames: initialGlobalPropertyNames,
    makeCompartmentConstructor,
    markVirtualizedNativeFunction,
  });

  if (
    evalTaming === 'no-eval' ||
    // deprecated
    evalTaming === 'noEval'
  ) {
    setGlobalObjectEvaluators(
      globalThis,
      noEvalEvaluate,
      markVirtualizedNativeFunction,
    );
  } else if (
    evalTaming === 'safe-eval' ||
    // deprecated
    evalTaming === 'safeEval'
  ) {
    const { safeEvaluate } = makeSafeEvaluator({ globalObject: globalThis });
    setGlobalObjectEvaluators(
      globalThis,
      safeEvaluate,
      markVirtualizedNativeFunction,
    );
  } else if (
    evalTaming === 'unsafe-eval' ||
    // deprecated
    evalTaming === 'unsafeEval'
  ) {
    // Leave eval function and Function constructor of the initial
    // compartment intact.
    // Other compartments will not have access to these evaluators unless a
    // guest program escapes containment.
  }

  /**
   * 3. HARDEN to share the intrinsics.
   *
   * We define hardenIntrinsics here so that options are in scope, but return
   * it to the caller because we intend to eventually allow vetted shims to run
   * between repairs and the hardening of intrinsics and so we can benchmark
   * repair separately from hardening.
   */

  const hardenIntrinsics = () => {
    priorHardenIntrinsics === undefined ||
      // eslint-disable-next-line @endo/no-polymorphic-call
      assert.fail(
        X`Already locked down at ${priorHardenIntrinsics} (SES_ALREADY_LOCKED_DOWN)`,
        TypeError,
      );
    // See https://github.com/endojs/endo/blob/master/packages/ses/error-codes/SES_ALREADY_LOCKED_DOWN.md
    priorHardenIntrinsics = TypeError(
      'Prior lockdown (SES_ALREADY_LOCKED_DOWN)',
    );
    // Tease V8 to generate the stack string and release the closures the stack
    // trace retained:
    priorHardenIntrinsics.stack;

    // Circumvent the override mistake.
    // TODO consider moving this to the end of the repair phase, and
    // therefore before vetted shims rather than afterwards. It is not
    // clear yet which is better.
    // @ts-ignore enablePropertyOverrides does its own input validation
    reportInGroup('SES Enabling property overrides', reporter, groupReporter =>
      enablePropertyOverrides(
        intrinsics,
        overrideTaming,
        groupReporter,
        overrideDebug,
      ),
    );
    if (legacyRegeneratorRuntimeTaming === 'unsafe-ignore') {
      tameRegeneratorRuntime();
    }

    // Finally register and optionally freeze all the intrinsics. This
    // must be the operation that modifies the intrinsics.
    const toHarden = {
      intrinsics,
      hostIntrinsics,
      globals: {
        // Harden evaluators
        Function: globalThis.Function,
        eval: globalThis.eval,
        // @ts-ignore Compartment does exist on globalThis
        Compartment: globalThis.Compartment,

        // Harden Symbol
        Symbol: globalThis.Symbol,
      },
    };

    // Harden Symbol and properties for initialGlobalPropertyNames in the host realm
    for (const prop of getOwnPropertyNames(initialGlobalPropertyNames)) {
      toHarden.globals[prop] = globalThis[prop];
    }

    tamedHarden(toHarden);

    return tamedHarden;
  };

  return hardenIntrinsics;
};$h͏_once.repairIntrinsics(repairIntrinsics);
})()
,
// === 61. ses ./src/lockdown-shim.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let globalThis,repairIntrinsics;$h͏_imports([["./assert-sloppy-mode.js", []],["./commons.js", [["globalThis",[$h͏_a => (globalThis = $h͏_a)]]]],["./lockdown.js", [["repairIntrinsics",[$h͏_a => (repairIntrinsics = $h͏_a)]]]]]);








/** @import {LockdownOptions} from '../types.js' */

/**
 * @param {LockdownOptions} [options]
 */
globalThis.lockdown = options => {
  const hardenIntrinsics = repairIntrinsics(options);
  globalThis.harden = hardenIntrinsics();
};

/**
 * @param {LockdownOptions} [options]
 */
globalThis.repairIntrinsics = options => {
  const hardenIntrinsics = repairIntrinsics(options);
  // Reveal hardenIntrinsics after repairs.
  globalThis.hardenIntrinsics = () => {
    // Reveal harden after hardenIntrinsics.
    // Harden is dangerous before hardenIntrinsics because hardening just
    // about anything will inadvertently render intrinsics irreparable.
    // Also, for modules that must work both before or after lockdown (code
    // that is portable between JS and SES), the existence of harden in global
    // scope signals whether such code should attempt to use harden in the
    // defense of its own API.
    // @ts-ignore harden not yet recognized on globalThis.
    globalThis.harden = hardenIntrinsics();
  };
};
})()
,
// === 62. ses ./src/compartment-shim.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let globalThis,makeCompartmentConstructor,tameFunctionToString,getGlobalIntrinsics,chooseReporter;$h͏_imports([["./commons.js", [["globalThis",[$h͏_a => (globalThis = $h͏_a)]]]],["./compartment.js", [["makeCompartmentConstructor",[$h͏_a => (makeCompartmentConstructor = $h͏_a)]]]],["./tame-function-tostring.js", [["tameFunctionToString",[$h͏_a => (tameFunctionToString = $h͏_a)]]]],["./intrinsics.js", [["getGlobalIntrinsics",[$h͏_a => (getGlobalIntrinsics = $h͏_a)]]]],["./reporting.js", [["chooseReporter",[$h͏_a => (chooseReporter = $h͏_a)]]]]]);





const markVirtualizedNativeFunction = tameFunctionToString();

const muteReporter = chooseReporter('none');

// @ts-ignore Compartment is definitely on globalThis.
globalThis.Compartment = makeCompartmentConstructor(
  makeCompartmentConstructor,
  // Any reporting that would need to be done should have already been done
  // during `lockdown()`.
  // See https://github.com/endojs/endo/pull/2624#discussion_r1840979770
  getGlobalIntrinsics(globalThis, muteReporter),
  markVirtualizedNativeFunction,
  {
    enforceNew: true,
  },
);
})()
,
// === 63. ses ./src/assert-shim.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let globalThis,makeAssert;$h͏_imports([["./commons.js", [["globalThis",[$h͏_a => (globalThis = $h͏_a)]]]],["./error/assert.js", [["makeAssert",[$h͏_a => (makeAssert = $h͏_a)]]]]]);


globalThis.assert = makeAssert(undefined, true);
})()
,
// === 64. ses ./src/console-shim.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';let symbolFor,globalThis,defineCausalConsoleFromLogger,loggedErrorHandler;$h͏_imports([["./commons.js", [["symbolFor",[$h͏_a => (symbolFor = $h͏_a)]],["globalThis",[$h͏_a => (globalThis = $h͏_a)]]]],["./error/console.js", [["defineCausalConsoleFromLogger",[$h͏_a => (defineCausalConsoleFromLogger = $h͏_a)]]]],["./error/assert.js", [["loggedErrorHandler",[$h͏_a => (loggedErrorHandler = $h͏_a)]]]]]);



// TODO possible additional exports. Some are privileged.
// export { loggedErrorHandler };
// export {
//   makeCausalConsole,
//   consoleLevelMethods,
//   consoleOtherMethods,
//   makeLoggingConsoleKit,
//   filterConsole,
//   pumpLogToConsole,
// } from './src/error/console.js';
// export { assertLogs, throwsAndLogs } from './src/error/throws-and-logs.js';

/**
 * Makes a Console like the
 * [SES causal `console`](https://github.com/endojs/endo/blob/master/packages/ses/src/error/README.md)
 * but whose output is redirected to the supplied `logger` function.
 */
const makeCausalConsoleFromLoggerForSesAva =
  defineCausalConsoleFromLogger(loggedErrorHandler);

/**
 *`makeCausalConsoleFromLoggerForSesAva` is privileged because it exposes
 * unredacted error info onto the `Logger` provided by the caller. It
 * should not be made available to non-privileged code.
 *
 * Further, we consider this particular API choice to be experimental
 * and may change in the future. It is currently only intended for use by
 * `@endo/ses-ava`, with which it will be co-maintained.
 *
 * Thus, this `console-shim.js` makes `makeCausalConsoleFromLoggerForSesAva`
 * available on `globalThis` which it *assumes* is the global of the start
 * compartment and is therefore allowed to hold powers that should not be
 * available in constructed compartments. It makes it available as the value of
 * a global property named by a registered symbol named
 * `MAKE_CAUSAL_CONSOLE_FROM_LOGGER_KEY_FOR_SES_AVA`.
 *
 * Anyone accessing this, including `@endo/ses-ava`, should feature test for
 * this and be tolerant of its absence. It may indeed disappear from later
 * versions of the ses-shim.
 */
const MAKE_CAUSAL_CONSOLE_FROM_LOGGER_KEY_FOR_SES_AVA = symbolFor(
  'MAKE_CAUSAL_CONSOLE_FROM_LOGGER_KEY_FOR_SES_AVA',
);

globalThis[MAKE_CAUSAL_CONSOLE_FROM_LOGGER_KEY_FOR_SES_AVA] =
  makeCausalConsoleFromLoggerForSesAva;
})()
,
// === 65. ses ./index.js ===
({imports:$h͏_imports,liveVar:$h͏_live,onceVar:$h͏_once,import:$h͏_import,importMeta:$h͏____meta})=>(function(){'use strict';$h͏_imports([["./src/lockdown-shim.js", []],["./src/compartment-shim.js", []],["./src/assert-shim.js", []],["./src/console-shim.js", []]]);
})()
,
])()
;/*! end SES */
(()=>{"use strict";var __webpack_modules__={};let __webpack_module_cache__={};function __webpack_require__(moduleId){let cachedModule=__webpack_module_cache__[moduleId];if(void 0!==cachedModule)return cachedModule.exports;let module=__webpack_module_cache__[moduleId]={id:moduleId,loaded:!1,exports:{}};return __webpack_modules__[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}__webpack_require__.m=__webpack_modules__,globalThis.location;var setTimeout=globalThis.setTimeout,clearTimeout=globalThis.clearTimeout,document=globalThis.document,self=(globalThis.trustedTypes,globalThis.self);globalThis.importScripts;let LOCKDOWN_SHIMS=[];__webpack_require__.amdO={},(()=>{let deferred=[];__webpack_require__.O=(result,chunkIds,fn)=>{if(chunkIds)return void deferred.push([chunkIds,fn]);for(var i=0;i<deferred.length;i++){let[chunkIds,fn]=deferred[i],fulfilled=!0;for(var j=0;j<chunkIds.length;j++)Object.keys(__webpack_require__.O).every(key=>__webpack_require__.O[key](chunkIds[j]))?chunkIds.splice(j--,1):fulfilled=!1;if(fulfilled){deferred.splice(i--,1);let r=fn();void 0!==r&&(result=r)}}return result}})(),__webpack_require__.n=module=>{let getter=module&&module.__esModule?()=>module.default:()=>module;return __webpack_require__.d(getter,{a:getter}),getter},(()=>{let leafPrototypes,getProto=Object.getPrototypeOf;__webpack_require__.t=function(value,mode){if(1&mode&&(value=this(value)),8&mode||"object"==typeof value&&value&&(4&mode&&value.__esModule||16&mode&&"function"==typeof value.then))return value;let ns=Object.create(null);__webpack_require__.r(ns);let def={};leafPrototypes||=[null,getProto({}),getProto([]),getProto(getProto)];for(var current=2&mode&&value;("object"==typeof current||"function"==typeof current)&&!~leafPrototypes.indexOf(current);current=getProto(current))Object.getOwnPropertyNames(current).forEach(key=>def[key]=()=>value[key]);return def.default=()=>value,__webpack_require__.d(ns,def),ns}})(),__webpack_require__.d=(exports,definition)=>{if(Array.isArray(definition))for(var i=0;i<definition.length;){var key=definition[i++],binding=definition[i++],descriptor=0===binding?{enumerable:!0,value:definition[i++]}:{enumerable:!0,get:binding};__webpack_require__.o(exports,key)||Object.defineProperty(exports,key,descriptor)}else for(var key in definition)__webpack_require__.o(definition,key)&&!__webpack_require__.o(exports,key)&&Object.defineProperty(exports,key,{enumerable:!0,get:definition[key]})},__webpack_require__.f={},__webpack_require__.e=chunkId=>Promise.all(Object.keys(__webpack_require__.f).reduce((promises,key)=>(__webpack_require__.f[key](chunkId,promises),promises),[])),__webpack_require__.u=chunkId=>chunkId+"."+({35:"596753ffe17859b11401",46:"86a453b9187c00ed64cc",110:"84e7a4af96af42e1481c",133:"9a733b03da5c2cab1428",229:"ebade97d179a8ed51265",305:"af35abc32211b57a0366",339:"81622a5f0c153a374799",343:"1de85eeec2bf243f8b55",407:"7d00f58d8340249bc3da",418:"c6cd932cdcc6b34d067f",425:"9d9d31d919c4bd9445ef",427:"5eeed912b088c348ea2b",461:"4b5ff15c4a64990f6b2c",483:"39221d28b0c8fecbde3c",513:"94022e94db6beda470de",659:"6b1e7dc248c82e90a36c",670:"a3fba8610504c925108f",868:"f0dbdf2538390231a9b6",891:"5f0db5f85858f77e6559",904:"73e4295071acd12c6db3",989:"d31a110c456041578672",1039:"1c0b98ecdce707fbaace",1105:"fd3c0debd009468de76e",1122:"d99d8cdb98935aae7dd5",1290:"743a330b059284f6e2bc",1309:"4b056614c51157cb4953",1331:"7f8eae411f87f7e4ba78",1371:"dc812f66ca766404b98f",1391:"7f21bd214d8430a5388b",1474:"3a5a0e320a34df9a7c8e",1476:"a176c65753e9cbfa9d1d",1507:"e7560e38a3de7fb1f08c",1523:"48f6336dd315ae91e052",1598:"1768aededde08b650e9d",1608:"350bbfdd578ac55eebe0",1768:"c4fca6465e732fe88189",1778:"d8f806209e8fa0eebaca",1791:"49b52efb666acb07fccc",1822:"f7c964928f6867b66497",1826:"05c59388c7d376502b39",1864:"46681465906dc23d0e4e",1887:"09fb45a94260c5e751b8",2113:"eff7121fe1753560f4c4",2160:"4f042aa5161f4fa9f969",2186:"86d22c9ec3773ecdbe8a",2189:"2b01b04c360c6cb0f962",2203:"337c4b82f26848d15161",2213:"213cce4c1a92bc105b54",2222:"4ec7c6dce43ca1932260",2335:"ca6d7a2e0e3a12cc5cec",2370:"2455372ce7562c56d861",2445:"2450e950c861792cdd7c",2449:"5fdd06f9e1241e37e32d",2514:"77df88a6f5206829a83f",2584:"ac30480123151fdad271",2598:"61d8a4a1f494e2f89dfe",2638:"5715f645fa32f9e0ad4f",2664:"30a4703da48a75a41915",2710:"72190e4599e3b9f53c83",2721:"9615be06c90aa915de69",2747:"890e9e0848d2c571e22a",2962:"a3688bdd7876c3aadf00",3139:"42383714298c66115f81",3375:"2f7ee88fa563ae2d3042",3404:"a07919f49cc768149d15",3419:"d1d767be4247aeb0ee50",3701:"236ff2f640f3d36bd0bf",3740:"db14ed255c1f29dfd554",3756:"eddfa85e94d0e64673b1",3785:"d2821a5ef01b2dedc46a",3885:"78801597c29ea1a16a50",3930:"92ac7e600f8bb0653359",3931:"af875339fe13ff7dca1c",3956:"c28fb09a7e9c9deee1a0",4052:"d390b7ebbf260568d395",4073:"026f7efc40be3b4fcf1f",4113:"69f77c30eb818fe0e243",4162:"5f1b674cff8cc1e2a230",4268:"a6f1a4617301c4afbf0f",4274:"a7cccd5025518c842d53",4323:"fc50006eadd1926cebd2",4473:"4e4bd3a4b3795bc50fb9",4520:"1880f81b2c4bc8dd212f",4579:"cab64902ede4794cb663",4593:"2fb50d107c9dbbf9ab67",4655:"d82491c3af74368d954f",4666:"a19057d92330816a7099",4753:"513c185d3203fe842483",4781:"aac07a1635a555f80df3",4859:"f0f8c1de2a79bb95d4a3",4910:"df32333e340e06116c9d",4932:"0fbb01359ee66f97809d",5087:"4a6d3d782a72f5bce533",5098:"eac3a5fa8900d33bd78f",5134:"6a471d2a91c031d77aea",5151:"eab3157baf2a19168405",5175:"a3230a6a530f029e843c",5297:"d154430f319a0b6fe5d9",5337:"59a272c0ca3176930a17",5404:"6a994c243588e6009dad",5454:"ff75ab52612d6736f8c5",5458:"ada3fa37d9f06bd40765",5466:"27df48bbed2ddba51e6f",5520:"725a1f102adeff1ae04c",5566:"4f5aafcc92b69b35b64d",5593:"49ca94e17c305445232b",5657:"a9647a24aa44f30394b0",5671:"4b96507362e203b2cf69",5762:"0a15ec9b1a09b1224bc7",5840:"7d0a2e4de019bd71d572",5925:"f30e24f18fbc1702fc96",5964:"f2a056145ea31b22e356",6022:"2e6ea31304dc2be31566",6053:"5eca3b761196182ef135",6091:"103f363e1a4f1a174fbe",6110:"1c7f73894655724e7ba7",6141:"5f496f0aaed010ad2751",6165:"bf434570aedb73005f90",6229:"467ef62af1cf29055921",6266:"c7f3c18348de4c5d4953",6358:"9228a3b013ad3861cb86",6401:"0b0b34eda6344f6dff79",6565:"6e72532250dedfacecd2",6617:"a0fea4ed2d8821e06052",6622:"43a8d54973014a166717",6649:"a1b90eaf67c9c8b81e51",6802:"8025c5c3d5e49d2db1ce",6828:"dbc9d80c38148656aecd",6864:"64fe4fb9be8403ab8ed9",6906:"9ead9db132413fc5cf1c",7064:"55290250f282ec0dc171",7115:"b846553fa132ed117daa",7133:"60bb80dde316cf48d829",7165:"780aa1df0052c3e7a16b",7202:"806be2a36ba76f187dec",7219:"9500a2d885c96e0a5788",7356:"5f5e5ccbd4811b16a954",7359:"a4761dbd4d3da285ecfb",7378:"287514ab76ec4470f389",7449:"865d5ee99911e58fbfb4",7651:"c46f7b9dcb25cbd7b94c",7755:"1387059f5c053491cb73",7899:"9af2ed930a4c999c4d3a",7984:"03512b4d86a2b882e5cb",8015:"f2b0c4bd0d7a71e728aa",8063:"697112eb226006c9d20c",8093:"d28b53313c69f7740f18",8117:"6294e4dd95e66a70b91e",8214:"61a49778abab786eea66",8620:"03ece7a0913de6700270",8650:"4dbaf1c23d27c394b0f2",8734:"19241098168037948e73",8792:"968a49b70021c6a1c6c7",8811:"18aaecffa4432f025c3a",8927:"1d6eb843afbb19f72f9e",8935:"99303aadc9f63ec7883f",8946:"490ebd58c995fac01e76",8986:"af34e3536d00258f41bc",8994:"85aa154fbdc9379ff95e",9038:"afcf76b801ee5fb415ed",9054:"102e8c4059325ea6863b",9060:"f65b7158018e3923e92f",9162:"3d391c085e3b3e454c8d",9165:"a89bf55d18ab6cce1b67",9232:"a012b893da4725692ffd",9251:"dc45ffd0f58049f8dab6",9265:"a347713823a2d8727da4",9289:"9415cb13525577f2cfa2",9354:"357778ae1af03ddf9feb",9471:"dc9fb1037ca6c01dc860",9597:"4a2882d38f3fd9ff0ffe",9689:"ae80684ed0b502b5bf85",9737:"cde7c705b3ce45b145f2",9887:"4905d5fc614db8200135",9949:"d5c38a0f3020e8627c34",9957:"b2fab34c95272cab32d2",9984:"70fa5f9c895a47a748b6"})[chunkId]+".js",__webpack_require__.hmd=module=>((module=Object.create(module)).children||(module.children=[]),Object.defineProperty(module,"exports",{enumerable:!0,set(){throw Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+module.id)}}),module),__webpack_require__.o=(obj,prop)=>Object.hasOwn(obj,prop),(()=>{let inProgress={};__webpack_require__.l=(url,done,key,chunkId)=>{let script,needAttach;if(inProgress[url])return void inProgress[url].push(done);if(void 0!==key){let scripts=document.getElementsByTagName("script");for(var i=0;i<scripts.length;i++){let s=scripts[i];if(s.getAttribute("src")==url){script=s;break}}}script||(needAttach=!0,(script=document.createElement("script")).charset="utf-8",__webpack_require__.nc&&script.setAttribute("nonce",__webpack_require__.nc),script.src=url),inProgress[url]=[done];let onScriptComplete=(prev,event)=>{script.onerror=script.onload=null,clearTimeout(timeout);let doneFns=inProgress[url];if(delete inProgress[url],script.parentNode?.removeChild(script),doneFns?.forEach(fn=>fn(event)),prev)return prev(event)},timeout=setTimeout(onScriptComplete.bind(null,void 0,{type:"timeout",target:script}),12e4);script.onerror=onScriptComplete.bind(null,script.onerror),script.onload=onScriptComplete.bind(null,script.onload),needAttach&&document.head.appendChild(script)}})(),__webpack_require__.r=exports=>{Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(exports,"__esModule",{value:!0})},__webpack_require__.nmd=module=>(module.paths=[],module.children||(module.children=[]),module),__webpack_require__.dn=x=>{var descriptor=Object.getOwnPropertyDescriptor(x,"name");descriptor&&(descriptor.writable||!descriptor.configurable)||Object.defineProperty(x,"name",{value:"default",configurable:!0})},LOCKDOWN_SHIMS.push(LOCKDOWN_SHIMS=>{"function"!=typeof SNOW&&(()=>{let n;var t,e,t1,t2={586:(t,e,n)=>{let r=n(228),{getFramesArray:o,getFrameTag:i}=n(648),{getOnload:c,setOnload:s,removeAttribute:u,addEventListener:a}=n(14);t.exports=function(t){for(let e=0;e<t.length;e++){let r1=o(t[e],!0);for(let t=0;t<r1.length;t++)!function(t){if(!i(t))return;a(t,"load",function(){r(t)});let e=c(t);e&&(s(t,null),u(t,"onload"),s(t,e))}(r1[t])}}},750:(t,e,n)=>{let{Object:r}=n(14);t.exports=function(t){t&&r.getOwnPropertyDescriptor(t,"")}},407:t=>{let e=Object.getOwnPropertyDescriptor(window,"length").get,n=e.bind(window),r=Object.getOwnPropertyDescriptor(Document.prototype,"createElement").value.bind(document),o=Object.getOwnPropertyDescriptor(Node.prototype,"appendChild").value.bind(document.documentElement),i=Object.getOwnPropertyDescriptor(Node.prototype,"removeChild").value.bind(document.documentElement);t.exports={getLength:e,runInNewRealm:function(t){let e=n(),c=r("IFRAME");o(c);let s=t(window[e]);return i(c),s}}},832:(t,e,n)=>{let{Object:r,Function:o}=n(14),{isTagFramable:i}=n(648),{error:c,ERR_EXTENDING_FRAMABLES_BLOCKED:s}=n(312);t.exports=function(t){let e=r.getOwnPropertyDescriptor(t.CustomElementRegistry.prototype,"define");e.configurable=e.writable=!0;let n=e.value;e.value=function(t,e,n1){if(n1&&i(n1.extends+""))throw c(s,t,n1);return o.prototype.call.call(n,this,t,e,n1)},r.defineProperty(t.CustomElementRegistry.prototype,"define",e)}},228:(t,e,n)=>{let r=n(750),{getLength:o}=n(407),{shadows:i,toArray:c,getFramesArray:s,getContentWindowOfFrame:u,getOwnerWindowOfNode:a}=n(648),{Object:p,getFrameElement:l,Function:f,isConnected:g}=n(14),{forEachOpened:y}=n(134);function m(t,e){let n=function d(t,e){var r;let n=f.prototype.call.call(o,t);for(let o=0;o<n;o++){if(r=t[o],null===p.getPrototypeOf.call(t,r))continue;if(l(t[o])===e)return t[o];let n=d(t[o],e);if(n)return n}for(let n=0;n<i.length;n++){let r=i[n];if(!g(r)||a(r)!==t)continue;let o=s(r,!1);for(let t=0;t<o.length;t++){let n=o[t],r=u(n);if(n===e)return r;let i=d(r,e);if(i)return i}}return null}(t,e);return n&&top.SNOW_WINDOW(n),!!n}t.exports=function(t){t=c(t);for(let e=0;e<t.length;e++){let n=t[e];"object"==typeof n&&null!==n&&(r(n),m(top,n)||y(m,n))}}},328:(t,e,n)=>{let{getFramesArray:r,getDeclarativeShadows:o}=n(648),{document:i,getChildElementCount:c,setInnerHTML:s}=n(14),{error:u,ERR_DECLARATIVE_SHADOWS_BLOCKED:a,ERR_HTML_FRAMES_SRCDOC_BLOCKED:p}=n(312);t.exports={assertHTML:function(t){for(let e=0;e<t.length;e++){let n=i.createElement("html");if(s(n,t[e]),c(n)){if(o(n).length>0)throw u(a,t[e]);let i=r(n,!1);for(let r=0;r<i.length;r++){let o=i[r];if(n.getAttribute.call(o,"srcdoc"))throw u(p,t[e])}}}}}},352:(t,e,n)=>{let r=n(228),o=n(716),i=n(832),c=n(583),s=n(278),u=n(459),a=n(58),p=n(744),l=n(294),{hookShadowDOM:f}=n(373),{Array:g,push:y,addEventListener:d,getFrameElement:m}=n(14),{makeDescriptorSetter:w}=n(648),{isMarked:E,mark:O}=n(111),{error:h,ERR_CB_MUST_BE_FUNCTION:v,ERR_MARK_NEW_WINDOW_FAILED:b}=n(312),D=w("SNOW_WINDOW",function(t){T(t)}),P=w("SNOW_FRAME",function(t){r(t)}),L=w("SNOW",C);function T(t,e,n){if(!n&&function R(t){try{let e=!E(t);return e&&O(t),e}catch(e){h(b,t,e)}return R(t)}(t)){L(t),function(t){let e=m(t);d(e,"load",function(){r(e)})}(t),o(t),i(t),c(t),s(t),u(t,"load"),a(t),f(t),l(t),p(t);for(let e=0;e<M.length;e++)if(M[e](t))return}e&&e(t)}let M=new g;function C(t,e){if("function"!=typeof t&&h(v,t))return;D(top),P(top);let n=1===y(M,t),r=e||window;T(r,t,!n&&r===top)}t.exports=C},58:(t,e,n)=>{let{error:r,ERR_NON_TOP_DOCUMENT_WRITE_BLOCKED:o}=n(312),{protectShadows:i}=n(373),c=n(586),{getFramesArray:s,shadows:u}=n(648),{getParentElement:a,getCommonAncestorContainer:p,slice:l,Object:f,Function:g}=n(14),{assertHTML:y}=n(328),d=n(228),m={Range:["insertNode"],DocumentFragment:["replaceChildren","append","prepend"],Document:["replaceChildren","append","prepend","write","writeln","execCommand"],Node:["appendChild","insertBefore","replaceChild"],Element:["innerHTML","outerHTML","insertAdjacentHTML","replaceWith","insertAdjacentElement","append","before","prepend","after","replaceChildren"],ShadowRoot:["innerHTML"],HTMLIFrameElement:["srcdoc"]},w=f.getOwnPropertyNames(m);t.exports=function(t){for(let e=0;e<w.length;e++){let n=w[e],r1=m[n];for(let e=0;e<r1.length;e++){let o1=r1[e],i1=f.getOwnPropertyDescriptor(t[n].prototype,o1);if(!i1)continue;let c1=i1.set?"set":"value",s1="Range"===n,u1="write"===o1||"writeln"===o1;i1[c1]=function(t,e,n){return function(){if(n&&this!==top.document)throw r(o,this);let f=l(arguments),m=e?p(this):a(this)||this;c(f),c(u),y(f);let w=g.prototype.apply.call(t,this,f);return d(s(m,!1)),d(f),i(!0),w}}(i1[c1],s1,u1),i1.configurable=!0,"value"===c1&&(i1.writable=!0),f.defineProperty(t[n].prototype,o1,i1)}}}},459:(t,e,n)=>{let r=n(228),{removeEventListener:o,addEventListener:i,slice:c,Map:s,Object:u}=n(14),a=new s;t.exports=function(t,e){u.defineProperty(t.EventTarget.prototype,"addEventListener",{configurable:!0,writable:!0,value:function(n,o,s){let u=o;return n===e&&(a.has(o)||a.set(o,function(){r(this);let t=c(arguments);o&&(o.handleEvent?o.handleEvent.apply(o,t):o.apply(this,t))}),u=a.get(o)),i(this||t,n,u,s)}}),u.defineProperty(t.EventTarget.prototype,"removeEventListener",{configurable:!0,writable:!0,value:function(n,r,i){let c=r;return n===e&&(c=a.get(r),a.delete(r)),o(this||t,n,c,i)}})}},312:t=>{let{Error:e}=globalThis,{from:n}=Array,r=Function.prototype.apply.bind(console.error,console);function o(t){let o=n(arguments);return r(o),new e(t)}function i(t){return`SNOW ERROR (CODE:${t}):`}t.exports={error:function(t,e,n,r){switch(t){case 7:return o(i(7),`blocking ${n} object:`,e,`of type "${r}" (not in allow list)`,".","if this prevents your application from running correctly, please visit/report at","https://github.com/LavaMoat/snow/issues/87#issuecomment-1586868353",".");case 6:return o(i(6),`blocking extension attempt ("${e}") of framable elements such as provided`,n,".","if this prevents your application from running correctly, please visit/report at","https://github.com/LavaMoat/snow/issues/56#issuecomment-1374899809",".");case 1:return o(i(1),"failed to mark new window:",e,".","if this prevents your application from running correctly, please visit/report at","https://github.com/LavaMoat/snow/issues/33#issuecomment-1239280063",".","in order to maintain a bulletproof defense mechanism, failing to mark a new window typically causes an infinite loop",".","error caught:",n);case 2:return o(i(2),'first argument must be of type "function", instead got:',e,".","therefore, snow bailed and is not applied to the page until this is fixed.");case 3:return o(i(3),'blocking open attempt to "javascript:" url:',e,"by window: ",n,".","if this prevents your application from running correctly, please visit/report at","https://github.com/LavaMoat/snow/issues/44#issuecomment-1369687802",".");case 4:return o(i(4),"blocking access to property:",`"${e}"`,"of opened window: ",n,".","if this prevents your application from running correctly, please visit/report at","https://github.com/LavaMoat/snow/issues/2#issuecomment-1239264255",".");case 5:return o(i(5),"blocking html string that includes a representation of a declarative shadow:",`"${e}"`,".","if this prevents your application from running correctly, please visit/report at","https://github.com/LavaMoat/snow/issues/32#issuecomment-1239273328",".");case 8:return o(i(8),'blocking html string that includes a representation of a framable element with the "srcdoc" attribute:',`"${e}"`,".","if this prevents your application from running correctly, please visit/report at","https://github.com/LavaMoat/snow/issues/???",".");case 9:return o(i(9),"blocking document.write\\ln action on a document that is not the top most document:",e,".","if this prevents your application from running correctly, please visit/report at","https://github.com/LavaMoat/snow/issues/???",".")}},generateErrorMessage:i,ERR_MARK_NEW_WINDOW_FAILED:1,ERR_OPENED_PROP_ACCESS_BLOCKED:4,ERR_OPEN_JS_SCHEME_BLOCKED:3,ERR_CB_MUST_BE_FUNCTION:2,ERR_DECLARATIVE_SHADOWS_BLOCKED:5,ERR_EXTENDING_FRAMABLES_BLOCKED:6,ERR_BLOB_TYPE_BLOCKED:7,ERR_HTML_FRAMES_SRCDOC_BLOCKED:8,ERR_NON_TOP_DOCUMENT_WRITE_BLOCKED:9}},111:(t,e,n)=>{let{Map:r,Object:o,Array:i}=n(14),c=new i,s=new r;t.exports={isMarked:function(t){if(!s.has(t))return!1;let e=o.getOwnPropertyDescriptor(t,"SNOW_ID");if(!e||!o.hasOwnProperty.call(e,"value")||"function"!=typeof e.value)return!1;let n=s.get(t);return e.value(c)===n},mark:function(t){let e=new i,n=o.create(null);n.value=t=>t===c&&e,o.defineProperty(t,"SNOW_ID",n),s.set(t,e)}}},14:(t,e,n)=>{let{runInNewRealm:r}=n(407);t.exports=function(t){let e=function(t){let{EventTarget:e}=t;return r(function(t){let{URL:n,Proxy:r,JSON:o,Attr:i,String:c,Function:s,Map:u,Node:a,Document:p,DocumentFragment:l,Blob:f,ShadowRoot:g,Object:y,Reflect:d,Array:m,Element:w,HTMLElement:E,Range:O,HTMLIFrameElement:h,HTMLFrameElement:v,HTMLObjectElement:b}=t,D={URL:n,Proxy:r,JSON:o,Attr:i,String:c,Function:s,Map:u,Node:a,Document:p,DocumentFragment:l,Blob:f,ShadowRoot:g,Object:y,Reflect:d,Array:m,Element:w,HTMLElement:E,Range:O,EventTarget:e,HTMLIFrameElement:h,HTMLFrameElement:v,HTMLObjectElement:b};return D.document={createElement:t.document.createElement.bind(t.document)},D})}(t),{document:n,Proxy:o,Function:i,String:c,Map:s,Node:u,Document:a,DocumentFragment:p,Blob:l,ShadowRoot:f,Object:g,Reflect:y,Array:d,Element:m,HTMLElement:w,Range:E,EventTarget:O,HTMLIFrameElement:h,HTMLFrameElement:v,HTMLObjectElement:b}=e;return g.assign(e,{iframeContentWindow:g.getOwnPropertyDescriptor(h.prototype,"contentWindow").get,frameContentWindow:g.getOwnPropertyDescriptor(v.prototype,"contentWindow").get,objectContentWindow:g.getOwnPropertyDescriptor(b.prototype,"contentWindow").get,createElement:g.getOwnPropertyDescriptor(a.prototype,"createElement").value,slice:g.getOwnPropertyDescriptor(d.prototype,"slice").value,push:g.getOwnPropertyDescriptor(d.prototype,"push").value,split:g.getOwnPropertyDescriptor(c.prototype,"split").value,nodeType:g.getOwnPropertyDescriptor(u.prototype,"nodeType").get,isConnected:g.getOwnPropertyDescriptor(u.prototype,"isConnected").get,tagName:g.getOwnPropertyDescriptor(m.prototype,"tagName").get,getInnerHTML:g.getOwnPropertyDescriptor(m.prototype,"innerHTML").get,setInnerHTML:g.getOwnPropertyDescriptor(m.prototype,"innerHTML").set,toString:g.getOwnPropertyDescriptor(g.prototype,"toString").value,getOnload:g.getOwnPropertyDescriptor(w.prototype,"onload").get,setOnload:g.getOwnPropertyDescriptor(w.prototype,"onload").set,getAttribute:g.getOwnPropertyDescriptor(m.prototype,"getAttribute").value,setAttribute:g.getOwnPropertyDescriptor(m.prototype,"setAttribute").value,removeAttribute:g.getOwnPropertyDescriptor(m.prototype,"removeAttribute").value,remove:g.getOwnPropertyDescriptor(m.prototype,"remove").value,addEventListener:g.getOwnPropertyDescriptor(O.prototype,"addEventListener").value,removeEventListener:g.getOwnPropertyDescriptor(O.prototype,"removeEventListener").value,getChildElementCount:g.getOwnPropertyDescriptor(m.prototype,"childElementCount").get,getFrameElement:g.getOwnPropertyDescriptor(t,"frameElement").get,getParentElement:g.getOwnPropertyDescriptor(u.prototype,"parentElement").get,getOwnerDocument:g.getOwnPropertyDescriptor(u.prototype,"ownerDocument").get,getDefaultView:g.getOwnPropertyDescriptor(a.prototype,"defaultView").get,getBlobFileType:g.getOwnPropertyDescriptor(l.prototype,"type").get,getPreviousElementSibling:g.getOwnPropertyDescriptor(m.prototype,"previousElementSibling").get,getCommonAncestorContainer:g.getOwnPropertyDescriptor(E.prototype,"commonAncestorContainer").get}),{document:n,Proxy:o,Object:g,Reflect:y,Function:i,Node:u,Element:m,Document:a,DocumentFragment:p,Blob:l,ShadowRoot:f,Array:d,Map:s,getContentWindow:function(t,n){switch(n){case"IFRAME":return e.iframeContentWindow.call(t);case"FRAME":return e.frameContentWindow.call(t);case"OBJECT":return e.objectContentWindow.call(t);default:return null}},stringToLowerCase:function(t){return e.String.prototype.toLowerCase.call(t)},stringStartsWith:function(t,n){return e.String.prototype.startsWith.call(t,n)},parse:function(t,n){return e.JSON.parse(t,n)},stringify:function(t,n,r){return e.JSON.stringify(t,n,r)},slice:function(t,n,r){return e.slice.call(t,n,r)},push:function(t,n){return e.push.call(t,n)},split:function(t,n){return e.split.call(t,n)},nodeType:function(t){return e.nodeType.call(t)},isConnected:function(t){return e.isConnected.call(t)},tagName:function(t){return e.tagName.call(t)},toString:function(t){return e.toString.call(t)},getOnload:function(t){return e.getOnload.call(t)},setOnload:function(t,n){return e.setOnload.call(t,n)},remove:function(t){return e.remove.call(t)},removeAttribute:function(t,n){return e.removeAttribute.call(t,n)},getAttribute:function(t,n){return e.getAttribute.call(t,n)},setAttribute:function(t,n,r){return e.setAttribute.call(t,n,r)},addEventListener:function(t,n,r,o){return e.Function.prototype.call.call(e.addEventListener,t,n,r,o)},removeEventListener:function(t,n,r,o){return e.Function.prototype.call.call(e.removeEventListener,t,n,r,o)},createElement:function(t,n,r){return e.createElement.call(t,n,r)},getInnerHTML:function(t){return e.getInnerHTML.call(t)},setInnerHTML:function(t,n){return e.setInnerHTML.call(t,n)},getChildElementCount:function(t){return e.getChildElementCount.call(t)},getFrameElement:function(t){return e.Function.prototype.call.call(e.getFrameElement,t)},getParentElement:function(t){return e.getParentElement.call(t)},getOwnerDocument:function(t){return e.getOwnerDocument.call(t)},getDefaultView:function(t){return e.getDefaultView.call(t)},getBlobFileType:function(t){return e.getBlobFileType.call(t)},getPreviousElementSibling:function(t){return e.getPreviousElementSibling.call(t)},getCommonAncestorContainer:function(t){return e.getCommonAncestorContainer.call(t)}}}(top)},583:(t,e,n)=>{let{stringToLowerCase:r,stringStartsWith:o,slice:i,Function:c,Object:s}=n(14),{error:u,ERR_OPEN_JS_SCHEME_BLOCKED:a}=n(312),{proxy:p,getProxyByOpened:l}=n(134);function f(t){let e=s.getOwnPropertyDescriptor(t.MessageEvent.prototype,"source"),n=e.get;e.get=function(){let t=n.call(this);return l(t)||t},s.defineProperty(t.MessageEvent.prototype,"source",e)}function g(t,e,n,s){return n(t),function(){let n=i(arguments),l=n[0];if(o(r(l+""),"javascript"))throw u(a,l+"",t);let f=c.prototype.apply.call(e,this,n);return f?!s&&n.length<3?f:p(f):null}}t.exports=function(t){s.defineProperty(t,"open",{value:g(t,t.open,f,!0)}),s.defineProperty(t.Document.prototype,"open",{value:g(t,t.document.open,f,!1)})}},134:(t,e,n)=>{let{Object:r,Proxy:o,Reflect:i,Map:c}=n(14),{error:s,ERR_OPENED_PROP_ACCESS_BLOCKED:u}=n(312),a=new c;function p(t){return a.get(t)}t.exports={proxy:function(t){let e=r.create(null);if(r.defineProperty(e,"closed",{get:function(){return t.closed}}),r.defineProperty(e,"close",{value:function(){return t.close()}}),r.defineProperty(e,"focus",{value:function(){return t.focus()}}),r.defineProperty(e,"postMessage",{value:function(e,n,r){return t.postMessage(e,n,r)}}),!a.has(t)){top.SNOW_WINDOW(t);let n=new o(e,{get:function(e,n){let r=i.get(e,n);if(i.has(e,n))return r;if(i.has(t,n))throw s(u,n,t);return r},set:function(){}});a.set(t,n)}return p(t)},getProxyByOpened:p,forEachOpened:function(t,e){for(let n of a.keys())t(n,e)}}},278:(t,e,n)=>{let{Object:r,slice:o,Function:i}=n(14),{proxy:c}=n(134);function s(t,e){let n=r.getOwnPropertyDescriptor(t[e].prototype,"window"),o=n.get;n.get=function(){return c(o.call(this))},r.defineProperty(t[e].prototype,"window",n)}t.exports=function(t){var e;t?.DocumentPictureInPicture?.prototype?.requestWindow&&(t.DocumentPictureInPicture.prototype.requestWindow=(e=t.DocumentPictureInPicture.prototype.requestWindow,s(t,"DocumentPictureInPictureEvent"),s(t,"DocumentPictureInPicture"),async function(){let t=o(arguments),n=await i.prototype.apply.call(e,this,t);return n?c(n):null}))}},373:(t,e,n)=>{let r=n(228),{getFramesArray:o,shadows:i}=n(648),{Object:c,Function:s,isConnected:u}=n(14);function a(t){for(let e=0;e<i.length;e++){let n=i[e];(!t||u(n))&&r(o(n,!1))}}t.exports={hookShadowDOM:function(t){let e=c.getOwnPropertyDescriptor(t.Element.prototype,"attachShadow");e.configurable=e.writable=!0;let n=e.value;e.value=function(t){let e=s.prototype.call.call(n,this,t);return i.push(e),a(!0),e},c.defineProperty(t.Element.prototype,"attachShadow",e)},protectShadows:a}},294:(t,e,n)=>{let{trustedHTMLs:r}=n(648),{Object:o,Function:i}=n(14);t.exports=function(t){if(void 0===t.TrustedTypePolicy)return;let e=o.getOwnPropertyDescriptor(t.TrustedTypePolicy.prototype,"createHTML");e.configurable=e.writable=!0;let n=e.value;r.push(t.trustedTypes.emptyHTML),e.value=function(t,n1){let o=i.prototype.call.call(n,this,t,n1);return r.push(o),o},o.defineProperty(t.TrustedTypePolicy.prototype,"createHTML",e)}},716:(t,e,n)=>{let{Object:r,Array:o,getBlobFileType:i}=n(14),{error:c,ERR_BLOB_TYPE_BLOCKED:s}=n(312),u="KIND",a="TYPE",p="Blob",l="File",f="MediaSource",g=new o,y=new o("","text/javascript","text/css","application/javascript","application/css","image/jpeg","image/jpg","image/png","audio/ogg; codecs=opus","video/mp4","application/pdf","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");function d(t,e){return function(n,o){let c=new t(n,o);return r.defineProperty(c,u,{value:e}),e!==p&&e!==l||r.defineProperty(c,a,{value:i(c)}),g.push(c),c}}t.exports=function(t){(function(t){let e=t.URL.createObjectURL;r.defineProperty(t.URL,"createObjectURL",{value:function(t){return g.includes(t)&&function(t){let e=t[u];if(e===p||e===l){let n=t[a];if(!y.includes(n))throw c(s,t,e,n)}}(t),e(t)}})})(t),function(t){let e=t[l],n=d(e,l);function o(t,e){return n(t,e)}r.setPrototypeOf(e.prototype,o.prototype),r.setPrototypeOf(o.prototype,t[p].prototype),t[l]=o,r.defineProperty(e.prototype,"constructor",{value:o})}(t),function(t){let e=t[p],n=d(e,p);function o(t,e){return n(t,e)}r.setPrototypeOf(e.prototype,o.prototype),t[p]=o,r.defineProperty(e.prototype,"constructor",{value:o})}(t),function(t){let e=t[f],n=d(e,f);function o(t,e){return n(t,e)}r.setPrototypeOf(o,e),t[f]=o,r.defineProperty(e.prototype,"constructor",{value:o})}(t)}},648:(t,e,n)=>{let{tagName:r,nodeType:o,slice:i,Array:c,parse:s,stringify:u,Node:a,Document:p,DocumentFragment:l,Element:f,ShadowRoot:g,getContentWindow:y,getDefaultView:d,getOwnerDocument:m,stringToLowerCase:w,Object:E}=n(14),O=new c,h=new c;function v(t){return O.includes(t)}function b(t){if(v(t))return g;switch(o(t)){case a.prototype.DOCUMENT_NODE:return p;case a.prototype.DOCUMENT_FRAGMENT_NODE:return l;default:return f}}function D(t){let e=w(t);return"iframe"===e||"frame"===e||"object"===e||"embed"===e}function P(t){if(!t||"object"!=typeof t||o(t)!==f.prototype.ELEMENT_NODE||v(t))return null;let e=r(t);return D(e)?e:null}function L(t){return c.isArray(t)||(t=new c(t)),t}function R(t,e){let n=!1;for(let r=0;r<e.length;r++)t.includes(e[r])||(t.push(e[r]),n=!0);return n}t.exports={getDeclarativeShadows:function(t){return b(t).prototype.querySelectorAll.call(t,"template[shadowroot]")},makeDescriptorSetter:function(t,e){let n=E.create(null);return n.value=e,function(e){E.getOwnPropertyDescriptor(e,t)||E.defineProperty(e,t,n)}},toArray:L,isTagFramable:D,getOwnerWindowOfNode:function(t){return d(m(t))},getContentWindowOfFrame:function(t){return y(t,P(t))},getFramesArray:function(t,e){let n=new c;return null===t||"object"!=typeof t||h.includes(t)||!function(t){if(v(t))return!0;let e=o(t);return e===f.prototype.ELEMENT_NODE||e===f.prototype.DOCUMENT_FRAGMENT_NODE||e===f.prototype.DOCUMENT_NODE}(t)||(R(n,i(b(t).prototype.querySelectorAll.call(t,"iframe,frame,object,embed"))),e&&R(n,L(t))),n},getFrameTag:P,shadows:O,trustedHTMLs:h}},744:(t,e,n)=>{let{runInNewRealm:r}=n(407),{Map:o,toString:i,stringStartsWith:c,Blob:s}=n(14),u=new o,{createObjectURL:a,revokeObjectURL:p}=URL;t.exports=function(t){t.URL.revokeObjectURL=function(t){let e=u.get(t);return e&&(p(e),u.delete(e)),p(t)},function(t){let e=t.Worker;t.Worker=function(t,n){let o="string"==typeof t?t:i(t);return c(o,"blob")?new e(function(t){if(!u.has(t)){let n=`(function() { Object.defineProperty(URL, 'createObjectURL', { value: () => { throw new Error(\`
BLOCKED BY SNOW:
Creating URL objects is not allowed under Snow protection within Web Workers.
If this prevents your application from running correctly, please visit/report at https://github.com/LavaMoat/snow/pull/89#issuecomment-1589359673.
Learn more at https://github.com/LavaMoat/snow/pull/89\`) }}) }())

`+r(function(e){let n,r=new e.XMLHttpRequest;return r.open("GET",t,!1),r.onreadystatechange=function(){4===r.readyState&&200===r.status&&(n=r.responseText)},r.send(),n});u.set(t,a(new s([n],{type:"text/javascript"})))}return u.get(t)}(o),n):new e(o,n)}}(t)}}},e1={};function n1(r){var o=e1[r];if(void 0!==o)return o.exports;var i=e1[r]={exports:{}};return t2[r](i,i.exports,n1),i.exports}n1.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n1.d(e,{a:e}),e},n1.d=(t,e)=>{for(var r in e)n1.o(e,r)&&!n1.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n1.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),t=n1(352),e=n1.n(t),Object.defineProperty(t1=window,"SNOW",{value:function(e,r){n(e,r||t1)}}),n=e(),t1!==top&&(n=top.SNOW,t1.SNOW(()=>{},t1))})()}),LOCKDOWN_SHIMS.push(LOCKDOWN_SHIMS=>{!function(){let log=console.log.bind(console),isWorker=!self.document;Object.defineProperty(self,"SCUTTLER",{value:(realm,scuttle)=>{isWorker?scuttle(realm):self.SNOW(win=>{log("Snow detected a new realm creation attempt in MetaMask. Performing scuttling on new realm.",win),scuttle(win)},realm)}})}()}),Object.freeze(LOCKDOWN_SHIMS),__webpack_require__.p="",(()=>{__webpack_require__.b=void 0!==document&&document.baseURI||self.location.href;let installedChunks={9121:0};__webpack_require__.f.j=(chunkId,promises)=>{let installedChunkData=__webpack_require__.o(installedChunks,chunkId)?installedChunks[chunkId]:void 0;if(0!==installedChunkData)if(installedChunkData)promises.push(installedChunkData[2]);else if(9121!=chunkId){let promise=new Promise((resolve,reject)=>installedChunkData=installedChunks[chunkId]=[resolve,reject]);promises.push(installedChunkData[2]=promise);let error=Error();__webpack_require__.l(__webpack_require__.p+__webpack_require__.u(chunkId),event=>{if(__webpack_require__.o(installedChunks,chunkId)&&(0!==(installedChunkData=installedChunks[chunkId])&&(installedChunks[chunkId]=void 0),installedChunkData)){let errorType=event&&("load"===event.type?"missing":event.type),realSrc=event&&event.target&&event.target.src;error.message="Loading chunk "+chunkId+` failed.
(`+errorType+": "+realSrc+")",error.name="ChunkLoadError",error.type=errorType,error.request=realSrc,error.event=event,installedChunkData[1](error)}},"chunk-"+chunkId,chunkId)}else installedChunks[chunkId]=0},__webpack_require__.O.j=chunkId=>0===installedChunks[chunkId];let webpackJsonpCallback=(parentChunkLoadingFunction,data)=>{let[chunkIds,moreModules,runtime]=data;var moduleId,chunkId,i=0;if(chunkIds.some(id=>0!==installedChunks[id])){for(moduleId in moreModules)__webpack_require__.o(moreModules,moduleId)&&(__webpack_require__.m[moduleId]=moreModules[moduleId]);if(runtime)var result=runtime(__webpack_require__)}for(parentChunkLoadingFunction&&parentChunkLoadingFunction(data);i<chunkIds.length;i++)chunkId=chunkIds[i],__webpack_require__.o(installedChunks,chunkId)&&installedChunks[chunkId]&&installedChunks[chunkId][0](),installedChunks[chunkId]=0;return __webpack_require__.O(result)},chunkLoadingGlobal=globalThis.webpackChunk||=[];chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null,0)),chunkLoadingGlobal.push=webpackJsonpCallback.bind(null,chunkLoadingGlobal.push.bind(chunkLoadingGlobal))})(),(()=>{let LAVAMOAT=Object.create(null);LAVAMOAT.root="$root$",LAVAMOAT.idmap=[["$root$",[100320,100573,100978,101084,101278,101492,101611,101743,101854,101885,10217,102190,102320,102609,102905,102985,103321,103651,104231,104429,104758,105049,105474,105522,105557,10558,106105,106320,106356,106828,107230,107284,107381,107502,107580,107804,107874,107886,108116,108120,108178,108362,108439,108474,108775,108933,109117,109835,110010,110107,110303,110407,110456,110814,110927,111644,111790,111985,111986,112071,112094,11212,112225,112487,11253,112604,112652,113337,113366,11353,113930,114168,114174,114274,114675,115302,115319,115346,115408,115884,115956,116048,116242,116255,116372,116882,117253,117567,117699,11775,117903,11795,118055,118202,118670,118707,118834,118997,119023,119278,119278,119278,119457,119681,120054,120252,120584,120808,120925,121216,121371,121778,121854,122119,122175,122536,122626,123231,123391,123455,12353,123554,12376,123784,123799,123827,124017,124599,124775,124935,12523,125393,125623,12569,12573,125894,126142,126177,126506,126660,127015,127362,127388,127565,127930,128364,128567,129292,130326,130413,130428,130873,130873,130920,131115,13126,131276,131608,131666,13176,131811,131891,132019,132516,132544,13296,133284,133601,133714,133791,134236,134727,135047,136088,136272,136399,136426,136447,136862,136948,137184,137557,137622,137711,137737,137737,137937,137983,138247,138409,138481,138623,138865,138915,139,139019,139019,139019,139019,139229,13927,139284,139354,139422,139742,139833,139842,139976,14029,140456,140613,140775,140778,141045,141057,141188,141382,141573,142002,142498,143195,143394,143472,14416,144586,144944,145034,145102,145451,145502,145657,145865,14600,146188,146194,146659,146759,146802,146806,146869,147133,147143,147278,147599,148249,148496,148608,148730,148887,149040,149177,149235,149235,149235,149235,149861,150270,150350,151092,151243,151255,151327,15151,152256,152336,15250,15289,153059,15319,153197,153294,153692,153753,153875,15392,154404,154505,154565,154862,155180,155246,155388,155862,156132,156323,156540,156549,156760,156762,156852,157234,157310,157311,157395,157479,157794,157962,157966,158093,158221,158259,158265,158308,158332,158374,158637,158637,158637,158792,158843,159163,159229,15923,159307,159315,159472,159629,159768,159815,160087,160099,160237,16026,160461,160873,161236,161356,161413,16179,161839,161863,161872,162444,162560,163305,163310,16342,163636,163723,16415,16467,164684,164777,164899,164983,16512,165304,165404,165454,165851,165937,165972,166133,166352,166455,166782,166879,166939,167048,167290,167344,167472,167484,16750,167643,16809,1681,168475,168671,168798,168994,16930,169727,17e4,170232,170237,170441,170455,170524,170687,17079,170904,170951,171029,171229,17198,172013,172142,172153,172347,173030,173381,173511,173611,173720,173972,174199,174465,174520,17465,174869,174885,174954,175101,17513,175150,175320,175436,175449,175537,176171,176827,17691,177505,177540,177540,177540,177994,178100,178121,178368,17856,178665,178712,179113,179192,1792,179408,179508,17967,179829,179913,179946,180415,180582,181064,181231,181283,181443,181726,181743,181768,182020,182321,182711,182721,182747,182824,183492,18361,183831,183876,184019,184413,184415,184790,18485,184864,184899,185127,185331,185433,185458,185517,185615,185734,185795,185878,186050,186051,186250,186250,186250,186250,186339,186362,186489,186495,186644,186943,187025,187090,187196,187306,187544,188152,188175,188189,188221,188614,18866,18921,189241,189332,189383,189596,189692,189726,190001,190032,190035,190236,190636,191091,191421,191620,191761,192238,192449,192502,19253,19293,193035,193055,19374,193945,193969,194181,194351,194510,194735,195360,195439,195603,195919,195993,196201,196358,196411,196425,196496,19684,196906,197067,197348,197356,197852,197875,197921,198339,198444,198588,199016,199238,199448,199488,199715,199852,200006,20008,200266,200657,200881,201242,201249,201299,201631,202015,202064,202214,202284,202431,202561,202565,202646,20317,203531,204168,20429,204427,20443,20450,204502,204582,204817,205136,205756,206252,206976,206984,207127,207219,207229,20760,207861,207984,208302,208566,209039,209043,209062,209122,209234,209284,209380,209671,209839,210296,210462,210509,210693,210771,21084,211157,211881,212290,212528,212660,212668,212814,212816,212971,213619,213650,213666,213751,213906,214200,214592,214597,214990,21514,215353,215432,215817,216415,216568,216648,216919,217361,217702,217768,217768,217865,218033,218033,218033,218033,218033,21873,218924,219115,21920,219336,219500,220202,220236,220313,220372,220464,220562,220566,220893,220964,220964,220964,221349,221475,221526,221656,221677,222236,222256,222455,22249,222841,223047,22335,223630,224031,224052,224610,224978,225002,225087,225133,225446,225813,226183,226535,226535,226535,226535,22677,226919,227323,227481,227598,227662,227858,227894,22793,227980,228153,228394,228677,228816,229326,22958,229880,2299,230027,230053,231663,231728,232068,232894,232989,23355,233651,234456,234587,234827,234852,234939,234958,235029,235378,23560,23565,235807,236123,236314,236538,236622,236669,236940,237095,237106,237154,237219,23741,237430,237655,237837,237997,238117,238175,238304,238886,239231,239492,239914,240066,240314,240337,240497,240541,240735,240854,24094,241185,242100,242544,24296,243160,243176,243403,243549,243562,243645,243961,244174,244894,244970,245039,245806,24609,24643,246534,246925,24701,247133,247342,247392,247404,247435,247507,247722,247755,247786,247924,247938,24809,248288,248313,248463,248736,248866,249257,250095,250286,250323,25038,250594,250670,250896,251008,25102,251087,251239,251474,25183,251845,251922,252024,252552,253042,253127,253349,253365,253404,253529,253573,253628,253639,2537,253782,253814,254042,254518,25456,254629,254735,254737,255018,255060,255301,255544,255734,256080,256638,256707,256931,256999,257063,257192,257220,257375,257721,257796,258380,25860,258833,259016,25965,25990,260105,260184,260199,260263,260380,260523,260723,261523,261650,262371,262541,262667,263022,26319,263294,263880,264013,264070,264198,264259,264466,264470,264607,264727,265386,265649,266180,266391,266692,266892,266923,267069,267208,267782,268241,268487,268718,268857,268916,268992,26900,269185,269243,269256,269296,26956,269627,26973,270006,270204,27057,270642,270655,270692,271077,271326,271525,271641,271827,272,27223,272323,272342,272491,272675,272703,272721,272849,273136,27335,273404,273573,273978,274584,275024,275059,275148,27519,276203,27633,276814,277121,277315,277336,277423,277450,277463,277473,277727,277933,278072,278332,278441,278457,278672,278827,27906,279170,279237,279323,279623,279836,279856,280063,280560,280821,280838,280889,28089,280916,281050,28117,28117,28117,28117,281753,281768,281995,282078,282644,282834,282835,283003,283010,283042,283659,283756,283875,2844,284500,284523,284687,28469,284999,284999,284999,284999,285053,28508,285133,285217,285412,285749,285820,286418,286434,286524,286545,286831,287094,287108,287731,287838,287867,287961,288157,288166,288516,288563,28865,288827,289498,289561,289648,2899,290185,290254,290476,290944,291319,291323,291517,291680,291960,2920,292106,292485,293442,293460,293463,293885,294150,294151,294180,294366,29438,294585,294660,29472,294777,294777,294777,294935,294938,295256,295494,295627,29563,295857,29595,296053,296260,296311,29667,296780,296947,297075,297292,297541,297773,298079,298136,298191,298298,298538,298789,299150,299150,299211,299401,299539,29963,299871,299950,300046,300047,300110,300268,300306,300425,300652,300652,300833,301622,301865,302684,302745,302764,302876,30294,303124,303293,303339,303374,303643,303727,303879,30394,304002,30426,304473,304614,305220,305399,306073,306075,306120,306213,306214,306294,30642,306585,306639,306650,306814,307136,307201,307464,307486,307553,307685,307718,30799,308203,308206,308515,308734,308876,308989,309013,309026,309037,309114,309172,309198,309281,309471,309724,309750,309950,310311,310728,311441,311734,311734,311736,31213,312332,31234,312584,312641,312680,312710,312787,31290,31309,313400,313418,31342,313484,313535,313666,313847,3139,314704,314793,314876,315282,315313,315368,315439,315485,315723,315816,316153,316221,316358,317021,317095,317161,317191,317525,318338,318443,318630,318768,318808,318828,318993,319381,319424,319555,319961,320059,320091,320337,32052,320765,320821,321194,321505,321521,321602,322064,322170,322244,322369,323261,323291,323741,323957,324039,324357,324396,32441,324457,324575,325135,326162,326325,327253,327563,328436,32851,328746,328861,329444,329635,329904,329937,330519,330771,330965,331118,331134,331276,331351,331629,331651,331722,331822,331855,331949,332028,332427,332471,332567,332647,332764,332764,332764,332831,332831,332831,333062,333332,333391,333450,333459,333530,333592,333711,33397,334111,334205,334265,334823,334836,334990,335336,335517,335683,335725,335784,336572,336576,336680,336742,336795,337214,337735,337736,337938,338028,338184,338917,339169,33922,339251,339566,339745,339829,34045,340687,340737,34121,34125,341441,341616,341695,342598,342830,342902,343405,343415,344531,344617,34474,344807,344827,344895,344931,345297,345661,345791,345949,346375,346464,34666,346667,347343,348228,348264,348826,348826,348826,348826,348826,34899,349450,349465,349723,350072,350241,350527,350527,35091,351309,351794,351806,352088,352136,352489,352996,35305,353183,354250,354699,354779,355816,355852,355933,355984,356743,357470,358254,358343,358623,358736,358805,359016,359358,35986,360402,360448,361507,361548,361705,361713,361719,361734,361890,362254,362418,362705,362705,363198,363910,364289,364679,364756,365161,365337,365521,365919,366260,366546,366756,367058,367149,367611,367699,367726,367736,367760,36779,367806,36842,368648,368656,368872,36915,36915,369747,369920,369981,370236,370473,37083,371052,371312,371314,372171,372222,372363,372494,372587,372908,37315,373177,373301,373472,373492,373748,373889,374046,374064,37408,374195,374470,374753,375185,375425,37557,376012,376059,376127,37615,376577,376594,376906,377109,377129,377163,377652,377946,378033,378247,378456,37855,378645,378831,378831,37902,379049,379277,379738,379755,380076,380127,380643,380855,381122,381265,381511,381567,381739,382043,382045,382158,38235,382583,382898,382926,382926,383010,383026,383046,383073,383145,383280,383280,383280,383687,384043,384168,384184,38439,384455,385672,386019,386344,386522,386645,386691,387192,387311,387517,387651,38780,387831,387892,388205,388296,38893,389097,389316,389345,389610,389726,390340,390764,391049,391163,391610,391614,391677,392275,392667,392705,392838,392968,393038,39321,393740,39377,393824,393980,394251,394435,394468,394579,394749,394810,395006,395134,395244,395715,395947,395962,396132,396277,396602,397171,39719,397361,397773,397881,397937,398011,39847,398612,398778,398785,398991,399151,399431,399451,399475,399695,400566,401135,401138,401379,401515,401781,401864,401870,402458,402735,403225,403416,403619,403634,403803,404186,404499,404945,405593,405970,406370,406515,406639,406832,406861,407227,407711,407740,408359,408537,409325,409493,409629,409787,409823,410006,410111,410327,410716,41073,410931,411290,411360,411419,411449,411684,41189,411926,412522,412974,413100,41348,413700,413802,4142,414410,414454,414580,414744,414753,414774,415221,415344,415527,41601,416211,416352,416584,41695,417893,418092,418363,418410,41849,418635,419309,419362,41937,419654,420142,420151,420497,420736,420765,420959,421008,421584,422009,422113,422132,42250,422545,422607,422638,422909,423533,423694,42395,424068,424073,424075,424696,424727,424727,424727,424731,42475,424898,425195,425337,425348,425348,425348,425415,425462,425490,425784,426021,426171,426195,426439,426613,426639,426898,426939,426959,427290,427437,42768,428386,428484,42885,428907,429120,429184,429589,429758,429780,429866,429891,430167,430177,430560,430679,43073,430801,43089,430900,431218,431423,43145,431625,43186,431877,432121,432337,432477,432514,433123,433285,433917,434024,434062,434062,434062,434062,434268,434296,434424,434663,434718,434768,435e3,435210,435464,435602,435766,43588,435956,435964,436199,436232,436861,436892,436954,437054,43710,437165,437173,437193,437313,4374,437622,437628,438169,438174,438660,438735,438749,438797,438835,438839,439113,439117,439122,439281,439632,439728,439748,439786,439984,440193,440369,440490,440676,440770,440776,440900,440952,440976,441,44135,441670,442058,442104,442326,442535,442722,442722,442801,442938,443068,443186,443507,443543,443634,443780,443820,443900,443957,44438,44438,444504,444655,444868,445272,445272,445272,445274,445495,445498,445591,44585,446068,446084,446353,446649,447068,447077,447213,447238,447614,447879,448138,448139,448350,448557,4486,448611,448648,448849,449098,449367,44970,449802,450060,45062,450861,451069,451083,451249,451305,45181,451881,452038,452272,452614,45294,453189,453248,453450,453643,454050,454293,45452,454587,454704,454735,454744,455122,45519,455478,455581,455918,456401,456447,456614,456641,4568,456825,456827,45779,457965,458156,458261,458416,458417,458446,45851,458527,458606,458726,459059,459766,459979,460333,460383,461052,46127,461297,461386,461487,461612,46164,462893,463059,463885,464011,464183,464478,464734,465188,465243,465412,465573,465581,465594,465944,466199,466199,466213,466817,467468,46754,467648,467835,467907,468303,46847,469104,469496,469819,469819,46988,469910,469951,469964,470072,470797,471326,471501,471620,471641,471685,472037,472147,472961,473025,473265,473327,473377,473385,473543,473550,473625,473907,474185,474637,474666,474787,474787,474787,474862,474862,474862,474862,474892,475112,475252,475274,475281,475308,475993,476407,476637,476813,477055,477082,477164,477232,477305,477479,478106,478110,478271,478367,478420,478976,47913,479248,479343,479376,479447,47988,480021,480242,480480,480907,481049,481108,481343,481382,481394,481654,481753,482118,482133,482177,482442,482465,482730,482747,483064,483388,483405,483459,483596,483625,483801,483885,484157,484302,484308,484332,485516,48569,486840,487115,487135,487208,487429,48750,488347,488669,48873,488862,488951,489019,489060,489076,489220,489871,490319,490335,490388,491305,491576,491698,492334,492334,492334,492840,492949,4930,493059,493063,493070,493332,493404,493701,493816,493820,493860,493999,494006,494142,494162,494329,494508,494640,494750,495560,495749,495958,496017,496324,496775,496920,497023,497305,497325,497825,497913,497946,498103,498387,498603,498624,498784,498970,499129,499749,499985,500023,500207,500330,500655,500855,501047,501056,501100,501115,50130,50133,501662,501735,501981,503157,503344,503968,504222,504386,504423,504507,504580,504622,50468,504732,504782,505071,505270,505478,50550,506484,506652,507003,507090,507096,507206,507307,507321,507335,507408,507475,507493,507837,507850,508112,508406,508538,508874,5092,509289,509486,509910,510243,510248,510353,510888,510995,511357,511475,511486,512494,512563,512664,512755,513449,513853,514229,514254,514715,514753,514800,514804,51484,514919,514981,515232,515405,515672,515835,515850,515923,516020,516452,516463,516776,517186,517299,517452,517846,517899,518176,518332,518684,518706,518805,518833,518992,519128,519136,519166,51953,519632,51966,519740,519862,519939,520124,520143,520169,520425,520769,520803,520803,520989,521112,521128,521276,521282,521308,52158,521607,521640,521649,521751,521981,52212,522317,522442,522488,522855,523162,523311,523315,523391,523414,523681,523891,524182,524278,524512,524670,525126,525721,52599,526049,527011,527122,527160,528630,528804,529,529023,52918,529192,529244,529247,529521,529711,529944,530688,530690,530932,530953,530953,530980,531004,531155,531325,531331,531728,531872,531888,532115,532203,532632,532690,532747,532912,533035,533132,533193,533346,5338,534115,534863,534929,535022,535177,535411,535726,536006,536084,536112,536266,536529,536687,536694,536827,537127,537324,537366,537535,537610,537809,537931,538093,538157,538710,538874,539322,539355,539518,539731,539778,540137,540603,540866,541417,541421,541909,542159,542386,542429,542649,5427,542824,542967,543007,543061,54318,543246,543427,543603,543918,544187,544323,545149,545423,545654,545791,546034,546053,546243,546399,546690,546766,546864,546938,54724,547294,547950,548764,549169,549991,550141,550315,55035,551044,551082,551895,552299,552626,55273,553038,553244,553346,553607,553722,553827,553926,554218,554322,554376,554606,554807,555426,555660,555765,555850,555974,55604,556097,556109,556354,55638,556684,556888,556948,557213,557309,55744,557768,557788,558203,558262,558348,55902,559133,559167,55930,559627,559758,559873,560039,560304,560661,560670,560955,561012,56106,561092,561246,561864,562421,56256,563451,563632,563712,564039,564199,564260,564463,564570,564993,565128,565156,565168,565478,565654,565843,565861,565941,566463,566466,566622,56675,566772,567064,567230,567384,567637,567971,567995,5685,568615,568696,568873,568893,569337,569524,5696,5696,570112,570330,570601,571090,571745,572213,572330,572356,57260,572640,572791,573139,573630,573713,573757,574193,574211,574356,575131,575214,575483,575510,575619,57562,575774,575790,57593,576384,576432,576515,576988,577205,577237,577279,577300,577576,577683,577822,578032,578423,578926,579065,579303,579358,579763,579802,579847,580182,580253,580445,580585,580610,580802,580832,581207,581339,581458,581716,581831,581843,582250,582304,582366,582376,582495,583064,583078,583737,584243,584358,584444,584603,585134,585152,585445,585453,585634,585670,585761,585844,585928,586048,586143,586297,586297,586297,586297,58631,586577,586614,586677,587,587295,587383,588095,588176,588298,588320,58836,588398,588498,588575,588917,589022,58925,589562,589569,589628,589642,589951,590147,590151,590343,590446,590867,591049,591058,591105,591197,591425,592181,592235,592492,592897,59293,592990,593130,593226,593258,593457,593704,594060,594108,594450,594768,595319,595440,595468,595625,596271,596364,596396,596414,596472,596790,596829,597386,597416,597600,598525,598667,598734,599e3,599224,59939,599425,599475,599645,599948,599962,60046,600540,600831,601391,601504,601592,601647,60192,602084,602201,602532,602665,602885,603343,603534,603555,603735,603742,604087,604239,605868,60593,605981,606122,606173,606308,606464,606578,606760,606807,606965,606968,606984,607335,607420,607967,608004,608047,608182,608182,608182,608305,608416,608670,608670,60872,608972,609654,609670,60988,609931,609949,609989,610332,610378,610597,610696,610820,610841,610883,610975,611012,611205,611770,6121,612650,61283,612994,613559,613676,613987,614323,614781,614821,614852,614855,614887,615605,615924,616212,616245,616310,617209,617318,617651,617936,618052,618277,618693,618721,618830,618932,619136,619140,619232,619454,619470,619486,619745,620329,62037,620955,621358,621902,622077,622202,622305,622713,622784,622922,623123,623654,624024,624250,624393,624404,624720,624879,625526,625564,62570,626041,626438,626481,626544,627009,62718,627326,627682,6280,628367,628478,628530,629181,629265,629273,629456,629735,629909,630496,630841,630949,631193,631275,631442,632316,632470,632548,63260,632690,632817,633090,63342,633683,633690,633785,634120,635028,635237,635299,635607,635835,635876,635944,636447,636579,63681,63682,636925,636925,636925,636925,637241,637312,637330,637569,637720,637720,637778,638063,638162,638228,638676,638846,638927,639036,639049,639498,639550,639698,639700,639898,64006,640421,640469,640469,640469,640469,640568,640655,640758,640901,64119,641315,641316,641334,641538,641540,642181,64235,642350,642371,642540,642694,643132,643246,64435,644757,644854,645086,645202,645770,64582,64592,646061,646117,646178,646241,64625,646289,646552,646826,647168,647731,64792,648210,648273,64858,648954,649071,649424,649564,649597,649614,649853,65068,650756,650836,651095,651564,651571,651980,652119,652167,652318,652499,652782,653098,653107,654153,654487,654639,655204,655319,655335,655340,655850,656054,656230,656252,656317,656615,656685,656860,657125,657218,65725,657700,657754,65785,658152,658157,658718,658764,658805,658904,658924,65896,659081,659173,659195,659531,659579,659677,659714,660063,660082,66010,660955,661061,661287,661287,661287,661377,661796,661867,662067,662090,662304,662509,662664,66305,663870,664254,665028,665309,665541,665983,666011,666015,666499,666766,666771,66681,666989,667202,667436,667551,66760,667629,667855,66822,668636,668673,668751,668795,668852,6690,669165,669217,669358,669378,669909,670217,670684,67093,671054,671054,671075,671106,671352,671656,671839,672358,672632,672911,672925,673913,674156,674366,674382,674857,674899,674924,675160,675274,675656,675925,67606,676432,676525,67661,6772,677296,677740,677890,678029,678414,678507,678606,678863,67906,679140,679228,679545,67957,680162,680245,680440,68088,680927,68102,68119,681292,681881,681982,682428,682456,682504,682566,682685,682705,682950,682988,683,68306,683061,683419,683431,683676,683683,683996,684289,684835,684936,685294,685346,685780,685986,686318,686834,686836,687165,687507,6877,68772,68862,688796,689786,689851,690109,690134,690223,690554,691232,691241,691411,691411,691897,692002,692322,692322,692322,69244,69244,692499,693281,694027,694068,694196,694212,695094,695540,695854,695974,696054,696128,696593,696778,696914,697120,697136,697141,697179,69719,697363,697616,697798,697798,697880,698122,698208,69830,698694,699201,699851,699851,699894,700159,700823,700850,700898,700958,700985,701334,701814,701864,702176,70229,702294,702705,702802,703303,703346,703752,704169,70435,704588,704744,704901,705098,705120,705195,705406,705612,705805,706439,706528,706734,706902,706990,706991,707455,707596,707773,707797,708399,70935,709385,709723,709913,709971,710100,7103,710308,710335,710362,710591,710638,710795,711023,711024,711035,711055,711139,711457,711540,711615,711994,712177,712383,71239,712587,712777,712894,713117,713376,71353,713633,713700,713759,713846,71427,714725,714879,71507,715276,715303,715390,715524,715918,716004,716229,716297,717058,71707,71717,717763,717961,717969,71801,718030,718246,71826,718448,719008,72e3,720063,720072,720262,720578,720698,721127,721650,721755,72187,722198,722275,722275,722757,722939,72297,723372,723443,723639,724180,724194,724270,724593,724727,724803,724935,724999,725018,725103,725115,725396,725411,725528,725613,725629,725736,725873,726022,72603,72617,726599,726607,726999,727008,727246,727300,727337,727961,728211,72828,728284,728372,728497,728561,728620,728857,728895,728966,729866,730006,730021,730027,730280,73050,730597,730794,73095,730968,730994,731136,731339,731409,731728,732006,732079,732186,732462,732623,733054,73338,733477,733679,733686,733814,734041,734221,734845,734910,734915,734918,734918,735191,735311,735641,73579,735929,736170,736172,736306,736324,736552,737117,737186,737289,737462,737513,737518,737719,737739,738,738012,738903,739164,73949,739646,740021,740366,740674,740688,740712,740764,741070,741212,741347,74136,741989,742303,743025,743159,743207,743241,743526,743771,743795,743890,744093,744191,744239,74474,744850,744959,745e3,745095,745259,745332,745565,745671,745766,745901,746461,746503,746769,746828,746883,747522,747598,747707,747835,748049,748222,748717,748792,748811,748994,749035,749153,749201,749279,749497,749562,749728,749965,7500,750001,750138,750511,751487,751490,751557,751741,752271,752351,7533,75359,753642,753676,753808,753908,754007,754072,75433,754486,75452,754615,754720,755047,755059,75514,755520,755935,756036,756098,756497,756509,757011,757330,757559,757867,758285,758363,758438,758918,759027,759791,760191,760264,760548,760994,761649,761665,76184,762115,762370,762418,762430,762526,762550,762661,762780,763052,763073,76318,763220,76323,76349,763548,763636,763639,763797,763985,764130,764522,764540,764616,764670,764918,764960,765124,765134,765919,765925,766204,766322,766364,766372,766597,766707,766817,767017,767248,767807,767902,767984,768110,768344,768427,768466,768471,768715,76885,768968,769091,769196,769197,769604,769682,770100,770180,770189,770418,770838,770845,771042,771085,771201,771669,771829,772294,772409,772638,772961,773318,773417,774095,774153,774243,774281,774323,77505,775072,775932,776077,776077,776077,776077,776141,776320,776500,776500,776500,776598,77691,777006,777040,777051,777292,777544,777544,777732,778029,778063,778093,778368,778630,779370,779518,779719,779837,779865,7799,779914,780305,78052,780555,780572,780578,780671,780829,780991,781157,781342,781448,781700,782113,782189,782219,782399,782895,783058,783169,783431,783534,783566,783714,784108,784289,784289,784289,7844,784598,784671,784686,785015,785449,785591,785859,785935,786748,786881,78714,787290,787544,787561,787631,78766,788289,788614,788787,788854,788932,789006,789151,789186,789189,789408,789585,789902,790453,790638,790882,791146,791774,791791,791796,791799,791842,79222,792570,793174,793574,793735,793923,794042,794360,79443,794646,794857,795223,795585,795792,796056,796178,796213,796213,796404,796404,796404,796404,796404,796413,796524,797056,797095,797438,797948,798053,79811,798149,798214,798328,798384,79860,798610,798806,799580,799589,800014,800331,800609,801121,801189,801251,80127,80157,801689,802184,8024,802700,802870,80339,803402,804154,805326,805527,805566,805582,805626,805804,80583,806084,806201,806201,806201,806625,806852,807181,807417,807605,807720,807895,808069,808227,808348,808681,809120,80931,809581,809654,809726,809745,809873,810437,810462,810649,810814,810839,810964,811077,811154,811398,811437,811491,81170,811940,812045,812199,812553,812582,81283,812994,813209,813278,813321,813366,813473,813498,813539,813586,813691,813897,813908,814086,814342,814378,814393,814507,814642,815071,815149,815149,815149,815149,815201,81523,815268,815583,815614,815629,815841,815953,81598,816245,816467,816519,816752,816773,817376,817907,818440,818658,818798,818881,818906,81892,819107,819157,820311,820610,820800,820859,821328,821360,821447,821678,821781,821858,822201,822343,822376,82353,823531,82358,823673,823799,823799,823799,823799,824017,824240,824597,82471,824759,824781,825057,825066,825133,825361,825461,825617,825742,825745,826042,826596,827013,827368,827370,827460,82770,828126,828227,828305,828787,829655,829751,829892,83014,830169,830377,83062,830636,831e3,831125,831329,83149,831553,831681,831703,831878,831987,832065,832353,832430,832514,832653,832678,83276,833205,833304,833878,833961,834018,83432,834923,835391,835467,83555,835729,835738,836293,836401,836441,836658,83679,837112,837151,837287,837316,8375,837844,838134,838269,838420,838517,838621,839680,839680,839689,839704,840374,840420,840483,840662,840840,841103,841759,841929,841972,841993,842004,842048,842634,84274,842856,843579,844056,844165,844418,844587,8456,846442,846973,846974,84701,847258,847993,84852,848587,848843,84886,848896,848896,849117,849177,849443,849518,849533,84955,849617,849963,850089,850891,850998,851365,851389,851711,85184,851887,851987,852837,85292,852991,85317,853249,853619,854029,854110,854353,854598,854737,854792,854912,855232,855451,855635,855637,855769,856034,856187,856385,856928,857073,857111,857172,857208,857243,857665,857745,857991,858032,858067,858235,858323,858493,858572,858653,858718,858753,858863,858928,859469,859504,85965,859689,859830,860007,860081,860339,860538,860603,860974,861029,86111,861614,861929,862191,862862,862932,863294,863373,863459,863566,863635,863635,863663,863798,86428,864468,864834,865137,865210,865797,865985,86652,866625,86664,866708,866766,866971,866991,867092,867168,867343,867405,867465,867825,867975,867978,868415,868917,86907,86965,869782,870087,870445,870543,870721,871008,871008,871251,871291,871660,871763,87191,872104,872200,873084,87314,873166,8737,873702,873749,874088,874604,874619,87488,874921,875057,875258,875372,875450,875532,877258,878066,878202,878875,878946,879011,879271,879336,879429,879850,879872,879958,879974,87998,880009,880416,88060,880687,880724,880795,88087,880909,880909,880909,880933,881061,881232,881245,881270,881882,881887,882016,882137,882298,882409,88247,882584,88320,883682,883775,883931,884858,885175,885276,885662,885711,885830,886067,886125,886251,886363,886376,886418,886418,88667,886705,887281,887590,887717,888120,88834,888867,889767,889814,889988,890051,89013,890154,890194,890223,890437,890845,890985,891309,891445,891545,892014,892263,892267,89279,893081,893269,893638,893967,894123,894193,894521,894521,894521,894521,894521,895075,895175,895279,895448,895462,896090,896290,896336,896686,897097,897097,897277,897360,898005,898440,89881,898837,898851,899104,899184,899210,899497,899819,899869,90004,901306,901506,901773,902299,902315,902407,90260,902635,902820,90317,9035,9038,904120,904247,904249,904346,904438,904445,904497,904573,904678,90507,905687,905883,906057,906153,906283,906309,906588,906980,907109,907508,907545,907606,907824,907830,908226,908355,908881,909122,909344,909381,909478,909521,909581,909764,909904,91050,910606,910689,910709,910894,910919,910935,911026,911134,911361,911455,911485,911552,911873,912047,912231,912445,912996,91348,913620,913702,913887,913893,913897,914125,914475,914515,914703,914826,914827,914878,915699,915742,915785,915925,916174,916272,916398,916595,916824,916926,917214,918190,918227,918540,918886,918935,919074,91909,919344,919388,920038,920117,920122,920342,920427,920499,920540,920623,920684,920906,921828,921836,922455,922749,923106,92326,923286,923381,923484,923682,923956,924056,924066,924327,92491,92513,92531,925365,926266,92627,926412,926745,926791,926912,927038,927166,927359,927737,92786,927893,928062,92807,928710,929063,929354,929366,929371,929838,92984,92988,929992,929992,930171,930171,930171,930445,930531,930574,930626,931025,931385,931507,931830,932586,932791,933887,934381,934460,934644,934682,934812,934837,934899,935082,935276,93534,935488,935603,935614,93583,935885,935892,935988,936007,936112,936276,936280,936854,937380,937403,937510,937625,93769,937746,938191,938603,938685,938732,938742,938936,939041,939195,939284,939343,939722,93990,940409,940898,940956,940962,941186,941311,941503,941543,941581,941920,942236,942895,942946,943202,943398,943627,943804,943819,943912,943971,944220,944496,944661,944674,944833,944976,945028,945042,945103,945519,945693,946177,946235,946251,94630,946502,946554,946802,946899,94722,947266,947276,947290,947446,947472,948121,948156,948362,948569,948835,949047,949230,949249,949320,949816,950230,950544,950659,950887,950913,9510,9510,9510,9510,9510,9510,951700,95180,951903,95290,953118,953215,953542,953626,954280,954349,954376,954726,954870,95516,955706,955944,956166,956313,956452,956517,956761,956853,956861,957355,957449,957604,957830,957854,957948,958163,958345,958374,958709,958871,959519,959588,95960,959614,96005,960085,960117,960178,960315,961379,961683,961819,962331,962728,962728,962857,962986,963232,963266,963493,963689,964451,964779,96537,965519,965639,965657,966021,966374,966383,966849,967142,96735,967684,967746,967746,968055,968255,968565,968829,969210,969210,969402,969617,969716,969866,969893,969898,970276,970945,970962,971158,971301,97171,971919,971997,972160,972238,972380,972679,972818,972865,972866,972896,972962,973258,973629,973802,974209,974280,97441,974415,974535,975186,975269,975480,975762,975908,976210,976907,97695,97719,977222,97740,977441,977728,97813,978428,978512,978969,979536,97966,979715,980062,980342,980385,98043,9805,980749,980749,980785,981129,981344,981834,981909,982029,982211,982287,982587,982622,982629,982773,983113,983375,983556,983736,983916,983954,984409,984423,984688,985076,985132,985691,985728,986290,986848,986998,987462,987701,987724,98804,988110,988381,988398,98878,989052,989288,98934,989433,989472,989504,989810,989885,990087,990105,990193,990233,990265,99027,99076,990790,991074,99131,99157,991697,992377,992396,992565,993304,994044,994291,994682,994864,994888,99490,995302,995477,9957,99643,996623,996697,996788,997100,997403,997468,997595,997783,998797,998879,999156,999394,999443,99981]],["@babel/runtime",[124255,127119,138312,143311,150247,187094,21082,211344,266103,267178,300283,34276,369953,387539,398667,406527,440484,442721,449859,451055,45735,457812,463565,474658,476205,498421,500069,502349,538253,543692,560458,562954,612823,647501,6490,688947,694801,708405,709371,71586,757709,779786,782338,783093,789948,800928,810356,824076,838019,841024,854717,871820,877159,896478,935191,979245,98105,999227]],["@blockaid/ppom_release",[297481,89962]],["@emotion/react",[230908,954541]],["@emotion/react>@emotion/cache",[145319]],["@emotion/react>@emotion/cache>@emotion/memoize",[880657]],["@emotion/react>@emotion/cache>@emotion/sheet",[849159]],["@emotion/react>@emotion/cache>stylis",[176154,272480,292907,709823,857267,985114]],["@emotion/react>@emotion/serialize",[612093]],["@emotion/react>@emotion/serialize>@emotion/hash",[866385]],["@emotion/react>@emotion/serialize>@emotion/unitless",[591217]],["@emotion/react>@emotion/use-insertion-effect-with-fallbacks",[128999]],["@emotion/react>@emotion/utils",[839145]],["@emotion/styled",[44327,551187]],["@emotion/styled>@emotion/is-prop-valid",[262835]],["@ensdomains/content-hash",[711571,763621,90624]],["@ensdomains/content-hash>cids",[648765,88526]],["@ensdomains/content-hash>cids>multibase",[233501,381080,482618,809850,896573]],["@ensdomains/content-hash>cids>multibase>@multiformats/base-x",[20793]],["@ensdomains/content-hash>cids>multihashes",[725041,860834]],["@ensdomains/content-hash>cids>multihashes>uint8arrays",[670298,827652,928753]],["@ensdomains/content-hash>cids>multihashes>varint",[235895,680701,801833,844063]],["@ensdomains/content-hash>cids>uint8arrays",[285918,562037,682578]],["@ensdomains/content-hash>js-base64",[765268]],["@ensdomains/content-hash>multicodec",[343708,392394,519477,660610]],["@ensdomains/content-hash>multicodec>uint8arrays",[14839,152785,314935,439470,580986,845617]],["@ensdomains/content-hash>multihashes",[539420,987551]],["@ensdomains/content-hash>multihashes>buffer",[960382]],["@ensdomains/content-hash>multihashes>multibase",[447008,496255,70852,748470,975895]],["@ensdomains/content-hash>multihashes>multibase>base-x",[627585,874484]],["@ensdomains/content-hash>multihashes>varint",[531372,551085,986270,995062]],["@ensdomains/content-hash>multihashes>web-encoding",[869988]],["@ethereumjs/tx",[100452,126896,127314,127469,155e3,204174,215366,229621,242676,248188,279528,282703,325733,331552,407539,423299,48571,488755,492139,496696,571637,71116,711730,773608,795957,815357,819153,830723,841505,986248,986319,988296]],["@ethereumjs/tx>@ethereumjs/common",[116114,138049,186782,207769,256388,428097,435515,440598,584775,597767,617778,712153,77547,842159,921628,932733]],["@ethereumjs/tx>@ethereumjs/rlp",[340904,626536,971047]],["@ethereumjs/tx>@ethereumjs/util",[121208,160942,18546,197133,199456,211645,213333,220681,262336,268411,29433,296648,310188,311718,336422,341872,349456,380211,384377,388655,416527,437881,448578,478459,47909,482875,487277,528720,543178,554880,555440,580203,586720,596187,601803,623052,632496,657076,671762,67618,700862,73689,741736,783798,794537,836584,83895,855224,874349,881019,888838,890415,892667,898069,899217,906238,932477,986881,99683]],["@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography",[110377,219828,301302,395902,401868,452197,492340,492943,535309,567417,732]],["@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography>@noble/curves",[107004,108099,11988,224981,266786,278956,321706,362528,462089,495448,617072,622643,671003,678298,707428,710609,762871,796262,8279]],["@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography>@noble/hashes",[10780,224683,285861,321705,359750,445115,447856,476244,479679,481449,482559,49331,533968,543657,610068,720684,779289,802349,813303,862335,915253,929920,963426,99072]],["@ethereumjs/tx>ethereum-cryptography",[271465,32063,81446,840174]],["@ethereumjs/tx>ethereum-cryptography>@noble/hashes",[130407,224661,301020,362180,430243,532953,936495,972637]],["@ethersproject/abi",[160782,187698,207619,248560,250722,2720,290117,379705,380106,393718,402741,403119,408505,440340,450337,458109,482055,485050,552281,552364,562009,593735,611782,651911,658511,715904,719910,815222,869209,871050,920407,936830]],["@ethersproject/bignumber",[264186,323489,367302,631229,664386,726731,72742]],["@ethersproject/bytes",[168083,524443,771214,993558]],["@ethersproject/contracts",[143722,264926,295523,391959]],["@ethersproject/hdnode",[42014,563965,91135,986604]],["@ethersproject/providers",[1088,113977,138919,144240,159222,203284,235086,260777,272455,272585,280620,286156,375693,380392,396515,411019,416895,460607,504409,550112,639723,675682,683411,702541,728024,728189,732500,744172,806355,81059,819790,882951,890742,927789,935424,981328,981506,996520]],["@ethersproject/providers>bech32",[579841,855010]],["@ethersproject/transactions",[482925,720839,892890,894e3]],["@fortawesome/fontawesome-free",[1527,1527,1527,1527,411525,411525,411525,411525,70035,70035,70035,70035]],["@google/genai>protobufjs",[119463,151942,179394,19298,218825,230388,233393,241032,263003,265120,275867,277049,28e3,281537,293812,298411,299467,31787,350553,35271,367471,370596,399483,411124,4128,420921,481277,488703,504982,538938,540186,54984,550602,626969,649399,662177,674975,676114,677694,727772,735901,747294,7501,750894,762632,76482,792509,796011,798572,808144,811348,817362,829594,832422,864122,912725,912770,912808,929078,954023,960613,961051,986237,987729]],["@google/genai>protobufjs>@protobufjs/aspromise",[35757,884264]],["@google/genai>protobufjs>@protobufjs/base64",[380567,783712]],["@google/genai>protobufjs>@protobufjs/codegen",[406164,80225]],["@google/genai>protobufjs>@protobufjs/eventemitter",[807179,846230]],["@google/genai>protobufjs>@protobufjs/fetch",[129177,33055,890554,895260]],["@google/genai>protobufjs>@protobufjs/float",[179442,5453]],["@google/genai>protobufjs>@protobufjs/path",[437271,450960]],["@google/genai>protobufjs>@protobufjs/pool",[476366,675811]],["@google/genai>protobufjs>@protobufjs/utf8",[544152,843255]],["@google/genai>protobufjs>long",[35849,742559]],["@hello-pangea/dnd",[300039]],["@hello-pangea/dnd>css-box-model",[200635]],["@hello-pangea/dnd>memoize-one",[62147]],["@hello-pangea/dnd>raf-schd",[930197]],["@hello-pangea/dnd>use-memo-one",[214897]],["@keystonehq/bc-ur-registry-eth",[2593,544829]],["@keystonehq/bc-ur-registry-eth>@keystonehq/bc-ur-registry",[124e3,191052,231626,249615,265655,2977,459024,467722,527355,534855,564315,573995,57636,646539,67798,682001,747747,773884,794735,804119,867283,883483,927029,939286,976399,987339]],["@lavamoat/lavadome-react",[494708]],["@lavamoat/webpack>json-stable-stringify>isarray",[312701,664074,664074,664074]],["@lavamoat/webpack>json-stable-stringify>object-keys",[25880,266165,266165,266165,643408,651180,69051,69051,69051,910229,910229,910229]],["@ledgerhq/device-management-kit",[10885,111900,118616,127639,13911,141397,145227,150879,156087,180803,182192,197430,201402,203160,208643,213659,214279,227293,232047,237419,238640,242038,245289,248014,24841,251585,258796,275048,276246,280616,281402,287569,293543,294942,296391,302852,309765,319126,320277,329078,329392,330243,334551,335132,339104,350500,358608,367386,370347,378563,384653,38977,396729,396740,399081,399134,399373,407312,408560,408717,416435,423158,428690,43987,440541,445568,445584,463903,467987,468086,485758,494882,495695,499700,502071,511273,519341,519952,522507,52363,526216,572724,574960,576310,586454,5889,593113,598150,603557,60781,612249,615729,617005,617621,618209,621710,624750,630224,633423,637832,639243,64149,656793,659815,662745,66788,672954,673208,673996,674237,675469,677936,691469,694839,702476,702893,702928,704445,707475,718009,725777,729702,735888,740224,747247,754130,760349,761416,765512,778696,78149,791372,804623,814711,821804,831925,835035,84007,842385,850911,852506,860257,861756,864350,867694,86974,874196,874780,878760,879520,884265,893279,896317,897651,913848,913991,915758,916604,921905,922978,937089,941569,95146,952768,952884,963181,965775,967012,967104,970402,974217,984485,990988,995684,997185]],["@ledgerhq/device-management-kit>@sentry/minimal",[115699]],["@ledgerhq/device-management-kit>inversify>@inversifyjs/common",[460282]],["@ledgerhq/device-management-kit>inversify>@inversifyjs/container",[371718]],["@ledgerhq/device-management-kit>inversify>@inversifyjs/core",[603364]],["@ledgerhq/device-management-kit>inversify>@inversifyjs/core>@inversifyjs/reflect-metadata-utils",[571366]],["@ledgerhq/device-management-kit>isomorphic-ws",[142557]],["@ledgerhq/device-management-kit>purify-ts",[202554,252085,736464,758343,83987,895039]],["@ledgerhq/device-management-kit>reflect-metadata",[723974]],["@ledgerhq/device-management-kit>semver",[106405,14076,149886,152754,156647,158534,183641,198531,199240,200441,217641,237746,252842,310748,395070,411470,420825,465100,477861,484571,499065,549523,550579,552103,554440,599474,613767,627262,631260,632330,665820,669071,686268,694145,727170,728421,820751,825979,854867,873744,909814,91244,917663,926117,928944]],["@ledgerhq/device-management-kit>uuid",[213490,674992,875142,99461]],["@ledgerhq/device-management-kit>xstate",[104737,192681,559172,572183,682387]],["@ledgerhq/device-transport-kit-web-hid",[132605,261579,281720,368438,871711]],["@ledgerhq/device-transport-kit-web-hid>uuid",[252569,285185,414505,503736]],["@ledgerhq/errors",[30649,315100,441063,927428]],["@ledgerhq/hw-app-eth",[104027,104586,113800,268879,30606,383317,463313,536227,551257,568746,63684,687439,705565,906779]],["@ledgerhq/hw-app-eth>@ledgerhq/cryptoassets-evm-signatures",[116736,116736,124859,124859,163015,163015,169781,169781,199597,199597,210703,210703,230970,236883,236883,248848,248848,250685,250685,255154,255154,258052,258052,274109,274109,322847,322847,334270,334270,347020,347020,366551,366551,369002,37908,37908,384717,384717,404282,404282,416093,416093,419682,419682,443852,443852,462622,462622,477649,477649,480075,480075,518851,518851,519988,519988,524815,524815,527390,527390,545688,545688,579237,579237,590888,590888,591272,591272,594750,594750,605933,605933,610625,610625,616814,616814,626884,626884,668059,668059,672311,672311,67928,67928,696055,696055,730571,730571,743225,743225,745686,745686,762051,762051,765119,78373,78373,787985,787985,819889,819889,835776,835776,848707,848707,867849,867849,89350,89350,895421,895421,902902,902902,908299,908299,9231,9231,938612,938612,950401,950401,95776,95776,983883,983883]],["@ledgerhq/hw-app-eth>@ledgerhq/domain-service",[224675,565967,862553]],["@ledgerhq/hw-app-eth>@ledgerhq/evm-tools",[454077,819304,977702]],["@ledgerhq/hw-app-eth>@ledgerhq/evm-tools>@ledgerhq/live-env",[265370,373941]],["@ledgerhq/hw-app-eth>@ledgerhq/logs",[293263,878528]],["@ledgerhq/hw-app-eth>bignumber.js",[784124]],["@ledgerhq/hw-transport",[425078,912015]],["@ledgerhq/hw-transport-webhid",[53406]],["@ledgerhq/hw-transport-webhid>@ledgerhq/devices",[42324,695006]],["@ledgerhq/hw-transport-webhid>@ledgerhq/devices>semver",[122508,124306,153063,156827,196336,206080,219259,238402,248308,254004,273435,281017,2911,292487,308262,327803,35765,375822,421895,48037,486088,50122,5166,599021,632189,66184,723811,734082,744484,756398,762961,81032,829019,832090,852453,853846,867350,898423,898721,901711,909957,93192,960393,989346,997168]],["@ledgerhq/hw-transport-webhid>@ledgerhq/hw-transport",[127439]],["@metamask/7715-permission-types",[337378]],["@metamask/abi-utils",[104527,163221,180719,181547,252332,29607,311312,31395,352360,364285,367419,374084,479238,502414,506505,542691,543719,548249,553588,561343,56970,577033,578808,601499,627674,635414,713226,743732,756330,785400,808591,833750,838797,883821,894281,933680,961858,968912,974538,986563]],["@metamask/account-api",[268904,360726,365091,413664,462357,531819,549214,571296,629721,673324,674288,689812,716904,809904]],["@metamask/account-tree-controller",[106846,108502,114435,120666,134393,142098,1448,145935,152710,159667,229332,273165,275506,289958,327583,360180,362252,3854,386059,433320,434195,441894,468627,473443,496564,512545,519313,530533,537440,538123,542818,548894,553852,568214,579596,581624,596800,6116,660933,737819,744110,754123,764184,777545,783797,788464,801112,801331,857537,884301,88778,898092,904393,912056,916977,92450,933422,967994,970058,973783,980016,986065,996674,997826]],["@metamask/accounts-controller",[53178,590677,61322,888029]],["@metamask/accounts-controller>@metamask/keyring-controller",[260240,474424,500532]],["@metamask/accounts-controller>ethereum-cryptography",[266988,575454,586390,671508]],["@metamask/accounts-controller>ethereum-cryptography>@noble/hashes",[380393,407105,521377,619894,655163,700931,748103,872574]],["@metamask/analytics-controller",[172382,191124,24682,683405]],["@metamask/analytics-controller>uuid",[735661,809189,833781,860218]],["@metamask/announcement-controller",[207587]],["@metamask/approval-controller",[207291,394813,612619,65997]],["@metamask/assets-controller",[106522,11625,137030,142609,144414,155374,164,18672,203956,213911,218102,229970,243721,247184,253246,255219,256878,275228,275634,278707,294220,359705,368188,382314,400235,400844,41140,424420,439731,444997,451410,459483,461409,474831,486884,518225,519691,528899,536718,548156,562685,56315,565976,566106,582437,586378,616019,619940,621884,628262,631226,640444,648718,649653,65189,661083,688023,690937,705418,711302,726170,728196,76198,772169,796320,802435,809795,816886,828359,84149,847296,848755,852768,855888,883006,884348,910837,926358,928882,931153,942033,949784,949990,951295,952164,953742,959430,969854,974830,982249,982309,991457,99303,993139]],["@metamask/assets-controller>@metamask/controller-utils",[16336,171416,474624,526967,678641,686749,687618,794786,798951,936088]],["@metamask/assets-controller>@metamask/polling-controller",[267262,415727,450585,822966]],["@metamask/assets-controller>bignumber.js",[694204,814948]],["@metamask/assets-controller>lodash-es",[100393,100393,100393,102004,102430,10503,105067,105865,106238,106238,106238,106715,108731,110657,110657,110657,111287,111871,116564,116564,116564,117288,125825,130666,134060,144036,144036,144036,148145,150321,150321,150321,151374,153760,15445,15445,15445,15990,163593,164386,16684,167193,167193,167193,167896,169156,169156,169156,175350,175556,178602,183001,18538,185692,185812,185812,185812,191937,194729,198633,198737,198737,198737,199113,203521,203634,204557,204557,204557,207655,20911,211349,212371,214851,214851,214851,217179,217179,217179,217472,217755,223051,224447,224962,225989,225989,225989,227463,228044,228044,228044,232222,232274,235951,237676,241428,246192,24622,24622,24622,247056,247056,247056,247306,247414,247977,249128,255502,255736,25675,25675,25675,257417,258454,259579,26168,26168,26168,262242,262242,262242,262250,265153,265153,265153,265307,265307,265307,267491,272338,273110,273552,274739,274739,274739,27692,278465,278465,278465,278806,278859,278859,278859,28165,281849,283043,288468,288468,288468,288498,288498,288498,28862,288887,289571,29514,29514,29514,2964,300994,301082,301221,301221,301221,303430,306066,310243,3131,318079,319553,329979,329979,329979,337406,338865,346540,346826,351699,351699,351699,354038,354619,354903,356593,357239,357239,357239,359633,366663,370997,370997,370997,371555,371916,373715,373922,373922,373922,375955,381310,381310,381310,382067,383737,385027,385305,385305,385305,385429,388775,391440,392881,39956,400069,400069,400069,400388,402369,403240,404871,405212,409626,413051,413051,413051,415060,416543,421084,421658,421658,421658,426277,427212,429761,432111,43214,434180,434180,434180,43453,43453,43453,434724,434724,434724,439251,440540,440540,440540,44160,444697,444835,447361,448507,448507,448507,448959,451029,451029,451029,452634,454569,455331,455331,455331,459751,460862,463303,463303,463303,46586,466650,466650,466650,46799,469033,469879,473697,473726,476409,476893,476904,483483,483483,483483,486971,486971,486971,488595,488595,488595,490687,492512,494132,499243,499243,499243,501740,502397,502397,502397,503861,506093,506093,506093,507401,510332,518307,5196,522172,522172,522172,524827,525428,526134,526959,530439,537572,538394,53844,540547,542332,542332,542332,543213,548794,551486,552629,552629,552629,553631,553904,560436,562206,562206,562206,562462,5627,563142,564318,564582,569972,570793,570793,570793,571631,571631,571631,574268,575595,578537,578537,578537,581690,583381,583758,587170,588674,590253,59195,59195,59195,592247,594806,596111,596345,600585,605455,609459,613181,613486,613486,613486,613531,61682,61682,61682,618795,620844,621808,622691,623199,627533,627533,627533,62765,62765,62765,628775,629139,634361,63814,638593,639031,639273,642756,651414,653205,653205,653205,660052,660052,660052,661590,661590,661590,667093,667093,667093,671357,671994,672353,673410,675006,675884,679558,679558,679558,684331,687633,692985,694508,6961,6961,6961,702761,703501,71051,710946,710946,710946,715897,725137,725831,727075,727493,730102,732320,733578,744831,74921,74921,74921,749412,753492,753492,753492,755220,755220,755220,757e3,757450,760189,760189,760189,760302,760701,765958,765958,765958,766227,766798,768397,769505,769505,769505,7704,7704,7704,777763,780275,783616,783616,783616,786944,787114,791212,791212,791212,795446,796734,796867,798249,798800,798800,798800,806150,808601,808788,810248,81088,812658,812658,812658,814753,814753,814753,815151,8160,817611,817611,817611,822353,823353,824508,826032,826032,826032,829372,831178,833402,833800,838851,840184,842581,846412,846412,846412,846953,848348,84929,84929,84929,850293,850293,850293,851627,851627,851627,851891,851891,851891,853228,855905,855905,855905,855992,857223,857223,857223,861319,862254,865164,865164,865164,86613,867522,869361,87087,874988,882565,883828,890192,891711,896938,896938,896938,898424,898906,899119,899390,901385,901385,901385,901624,910349,913495,917525,917525,917525,917789,917863,917863,917863,918636,922399,922399,922399,922860,923197,925285,925285,925285,928153,928967,930731,930848,935269,935507,936484,939622,939622,939622,940528,942140,943048,947894,947894,947894,947912,948735,950533,950533,950533,952532,952941,954813,955659,957300,96291,96291,96291,964454,964641,966981,967200,967200,967200,972876,972876,972876,977234,983178,983178,983178,985429,990435,99080,994982,997829,99871]],["@metamask/assets-controllers",[100343,119098,122088,138217,144273,162442,162652,208810,215503,24552,252108,26737,340135,35453,363487,39296,460634,474795,475907,509319,509960,537313,574405,58770,64199,680737,689240,691027,703805,730092,735878,741180,7441,773689,77745,786826,802161,8183,827083,842330,870791,897943,912837,977539]],["@metamask/assets-controllers>@metamask/abi-utils",[179309,216474,231360,252388,375302,412680,446966,50732,507780,52554,548990,578625,616911,656805,686733,734898,797590,864843,957489,961576]],["@metamask/assets-controllers>@metamask/controller-utils",[171732,172295,261929,300217,342671,388588,415805,888955]],["@metamask/assets-controllers>@metamask/polling-controller",[725374,950779]],["@metamask/assets-controllers>@metamask/polling-controller>uuid",[42854,444349,451963,623906,772053]],["@metamask/assets-controllers>immer",[757627]],["@metamask/assets-controllers>multiformats",[122510,158669,170037,229394,255843,276966,342853,371330,41616,447531,488242,526898,538377,569651,585138,62677,627006,634788,64844,649495,655153,748102,773191,782498,791156,814198,850448,875939,876366,884609,953460,958397,963547]],["@metamask/assets-controllers>reselect",[160805]],["@metamask/assets-controllers>single-call-balance-checker-abi",[429643]],["@metamask/assets-controllers>uuid",[293199,395929,514015,751399,863320]],["@metamask/authenticated-user-storage",[223925,649145,720015,86953]],["@metamask/authenticated-user-storage>@metamask/controller-utils",[613432]],["@metamask/base-controller",[304019,304019,352508,352508,530569,708418,717474,717474,717474,798619,798619,798619]],["@metamask/base-controller>immer",[1970,1970,1970,803748,803748,880594]],["@metamask/base-data-service",[305008,392488,810832,904575]],["@metamask/base-data-service>uuid",[188924,331800,606658,695209]],["@metamask/bitcoin-wallet-snap",[130595]],["@metamask/bitcoin-wallet-standard",[243229,337874,467743,500285,63130,747555,776179,789365,880287,884948,921950,985447]],["@metamask/bitcoin-wallet-standard>@exodus/bitcoin-wallet-standard>@exodus/bitcoin-wallet-standard-core>@exodus/bitcoin-wallet-standard-chains",[467062]],["@metamask/bitcoin-wallet-standard>@exodus/bitcoin-wallet-standard>@exodus/bitcoin-wallet-standard-core>@exodus/bitcoin-wallet-standard-features",[157519]],["@metamask/bitcoin-wallet-standard>@wallet-standard/wallet",[491867,856492]],["@metamask/bridge-controller",[11007,110219,118505,129071,163023,165123,176490,223228,228484,229116,238261,239505,260681,261106,261425,277481,289343,305643,308705,309977,317230,340289,3587,382134,388728,39237,392801,392846,403037,437553,442853,448454,470073,472441,509725,521734,521734,542689,547099,547558,562597,565331,577570,581503,596828,59929,603383,609864,609864,63428,658367,680019,683202,688287,694285,717843,733454,733667,747218,749678,786002,787307,788697,806794,824976,826110,827333,842127,843789,855046,861801,868095,877339,878234,885745,890662,892937,903707,904232,920363,926713,937376,979685,988744,997933]],["@metamask/bridge-controller>@metamask/controller-utils",[453139,650373]],["@metamask/bridge-controller>@metamask/multichain-network-controller",[73780,759884]],["@metamask/bridge-controller>@metamask/polling-controller",[65618,996611]],["@metamask/bridge-controller>@metamask/polling-controller>uuid",[17968,482332,812206,822213,996081]],["@metamask/bridge-controller>bignumber.js",[775880,990088]],["@metamask/bridge-controller>reselect",[545078]],["@metamask/bridge-controller>uuid",[271408,38210,444643,52830]],["@metamask/bridge-status-controller",[125883,168349,170413,241038,308850,327008,360248,378970,413157,431591,470849,541628,557385,559312,56439,618592,633369,635064,649361,650077,685574,705901,749612,752319,780496,802901,811801,863901,882456,901597,905949,915258,946609,968602,971874,976640,988658]],["@metamask/bridge-status-controller>@metamask/controller-utils",[460916]],["@metamask/bridge-status-controller>@metamask/polling-controller",[59206,828003]],["@metamask/bridge-status-controller>@metamask/polling-controller>uuid",[125186,516598,662489,76097,987023]],["@metamask/bridge-status-controller>bignumber.js",[857617]],["@metamask/bridge-status-controller>uuid",[14800,208383,731703,93271]],["@metamask/browser-passworder",[369166]],["@metamask/chain-agnostic-permission",[102844,13318,260782,385382,480996,528188,558350,577668,651308,705951,7700,804048,82417,82417,82417,838180,900425,96631,994272]],["@metamask/chain-agnostic-permission>@metamask/api-specs",[396998,400265,682004,751601,751601,751601,934683,934683,934683,934683,934683,934683,934683,934683,99790,99790,99790,99790,99790,99790,99790,99790]],["@metamask/chain-agnostic-permission>@metamask/controller-utils",[271839,617481]],["@metamask/chomp-api-service",[77214]],["@metamask/claims-controller",[111219,515813]],["@metamask/client-controller",[115419,422089,653262]],["@metamask/client-utils",[126062,252047,262519,466639,466639,466639,535284,550515,570113,917237,937508]],["@metamask/compliance-controller",[197162,332771,361978,713765,74291,768001]],["@metamask/config-registry-controller",[27925,381017,543597,682914,720043,878701,878701,878701,895106,895106,895106]],["@metamask/config-registry-controller>@metamask/controller-utils",[81799,947780]],["@metamask/config-registry-controller>@metamask/polling-controller",[466963,708406]],["@metamask/connectivity-controller",[176094,663169]],["@metamask/contract-metadata",[243179,243179,243179,243179,243179,496300,551513,988313]],["@metamask/controller-utils",[17605,30018,340871,496705,644174,657638,680721,698402,749254,788142,841043]],["@metamask/controller-utils>@metamask/eth-query",[451550,605895,605895,605895]],["@metamask/controller-utils>@metamask/ethjs-unit",[646039,886634,886634,886634]],["@metamask/controller-utils>@metamask/ethjs-unit>@metamask/number-to-bn",[360646,360646,360646,89987]],["@metamask/controller-utils>@spruceid/siwe-parser",[100373,129409,751528,812346,890577,960636]],["@metamask/controller-utils>@spruceid/siwe-parser>apg-js",[106360,118675,1305,133543,135322,151097,158160,174353,190686,196097,204777,207937,216202,245981,249899,252834,269150,283691,337707,341741,360740,397721,410513,431304,442480,46509,469328,488665,548907,560540,570687,58942,597242,606118,622282,670078,810722,811982,820724,872735,897579,905040,928225,936633,952422,953138,965892,979090]],["@metamask/core-backend",[161333,207479,217402,22474,288550,311555,340341,351434,402289,414656,428560,480531,505590,696622,697306,768025,826927]],["@metamask/core-backend>uuid",[385682,688121,80172,988584]],["@metamask/delegation-controller",[221772,30285,405008]],["@metamask/delegation-controller>@metamask/keyring-controller",[127034,507686,700774]],["@metamask/delegation-core",[558620,846404]],["@metamask/delegation-deployments",[59983]],["@metamask/design-system-react",[100791,100791,101545,108379,108379,109220,111700,112038,112038,116520,116791,116791,124856,124856,126528,139911,139911,153108,153108,153472,153472,154468,154468,157783,157783,158250,158250,158317,158317,160687,160687,168743,168743,173556,174795,174795,179218,180781,180781,181657,181657,181902,181902,185194,185194,186304,186304,197951,197951,201718,201718,205278,205278,21292,21292,216346,216346,21875,21875,219384,219384,221371,221371,222496,223901,223901,227485,227485,237405,237405,237457,237457,241686,241686,243877,243877,244569,244569,244701,244701,248477,248477,250778,250778,254465,254465,255196,261181,266965,268870,268870,27150,27150,2762,2762,281051,281051,281244,281244,283931,283931,287002,287002,287721,287721,289055,296263,296263,302175,302175,303362,303362,305955,305955,306392,311698,311698,314356,314756,327468,327468,331498,331498,33539,33539,339262,339262,344809,344809,346414,346414,353438,35721,35721,364588,364588,367792,376193,376193,380917,380917,381150,385780,386745,386745,38898,38914,38914,395528,395528,398412,40106,40106,405165,405165,410701,410701,411275,411275,422744,422744,424341,424341,431037,431037,434186,434186,443273,443273,445973,445973,449565,449565,451902,451902,452304,452304,452668,454831,454831,457302,458646,458646,459182,459182,460390,460390,465560,465560,466770,466770,47233,47265,480116,480116,486359,486359,48845,48845,488581,488581,494800,494800,495171,495171,498658,498658,502676,502676,50627,50627,507803,507803,508323,508323,514816,518206,518206,520430,526447,527442,527442,529775,529775,531462,531462,533632,533632,534408,534408,53669,53669,537119,537119,53784,53784,538324,538324,539783,539783,540463,540463,541292,544020,544020,544944,550110,550110,563376,564250,564250,576040,576040,579952,579952,585701,585701,588156,593902,593902,594664,594664,600838,600838,602435,602435,608887,608887,60938,60938,609415,618485,618485,622832,622832,624869,627871,627871,630125,633400,634850,634850,635860,635860,639263,639263,640713,640713,641816,644493,644493,65093,65093,652230,652230,655301,655301,657580,657580,65874,65874,671492,671492,672421,672992,672992,67493,67493,675319,675319,676513,676513,679968,679968,687949,687949,68940,68940,689401,690034,690034,694394,694394,705776,719082,719082,72180,72180,723576,723576,729079,729079,742351,742351,746005,746005,746812,746812,748507,748507,75451,75451,756741,756741,758832,762644,762644,772737,772737,779749,783088,783088,785016,785016,785427,785427,78990,78990,793216,793216,797460,797460,804968,804968,805600,805600,80649,80649,807592,81120,81120,811571,811571,814520,814520,828116,828116,829471,829471,831404,831404,832190,832190,838175,838175,838490,838490,842111,844326,844326,845417,845417,848365,848365,848558,848558,849803,849803,852336,852336,865740,86660,86660,866927,866927,868118,868118,870677,870677,87288,874176,874176,877291,877291,879575,879575,879638,879638,884056,884056,895370,895370,903273,903273,904306,904306,912629,913802,913802,922726,922726,926968,927951,927951,932540,932540,93278,93278,934509,934509,937069,937069,938132,938132,942959,942959,949098,949098,955662,955662,962428,962428,963245,963245,964414,966455,966872,966872,970443,970443,972938,972938,982635,982635,985268,985268,992088,992164,992164,995163,995163,998246,998246]],["@metamask/design-system-react>@floating-ui/react-dom",[117035]],["@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom",[911295]],["@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom>@floating-ui/core",[316197]],["@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom>@floating-ui/utils",[42847,569725]],["@metamask/design-system-react>@radix-ui/react-slot",[154542,154542]],["@metamask/design-system-react>@radix-ui/react-slot>@radix-ui/react-compose-refs",[769579,769579]],["@metamask/design-system-react>blo",[150609,749193,904710,999084]],["@metamask/design-system-react>tailwind-merge",[704044,704044]],["@metamask/design-system-shared",[152886,206576,206576,24734,305142,305142,365678,506410,520858,520858,556734,568894,568894,584942,610923,683772,683772,706794,706794,73804,75734,789292,789292,79038,79038,807374,807374,831198,848574,848574,918070,918318,994650]],["@metamask/design-tokens",[115312,152301,158967,167203,184382,225344,246336,28509,300784,311204,317309,32803,335287,347861,377043,394478,394689,428132,4796,482988,500944,522686,530159,551572,553616,633612,659249,681561,690548,690691,777440,777855,783158,784672,794401,868103,870912,875644,914025,91504,92071,972017,993766,997238]],["@metamask/eip-5792-middleware",[172936,182912,183501,338412,627228,628102,680796,714249,772029]],["@metamask/eip-7702-internal-rpc-middleware",[119949,38153,391741,733785,738169]],["@metamask/ens-resolver-snap",[502420]],["@metamask/eth-hd-keyring",[142629,357268,739583,780268]],["@metamask/eth-hd-keyring>ethereum-cryptography",[683722,731631,780922,965525]],["@metamask/eth-hd-keyring>ethereum-cryptography>@noble/curves",[187339,275501,354273,380907,502616,624994,654265,862503,862530,86744,90063,987385]],["@metamask/eth-hd-keyring>ethereum-cryptography>@noble/hashes",[109213,137818,147274,248241,315771,459303,474660,536508,536710,537242,546308,553230,59257,592843,612378,628989,64055,701194,705962,775836]],["@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32",[55007,66889]],["@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32>@scure/base",[100912,907904]],["@metamask/eth-json-rpc-filters",[142096,247486,255123,267132,37219,453470,834264,839468,942589]],["@metamask/eth-json-rpc-filters>@metamask/json-rpc-engine",[105216,170300,212024,271274,274030,277267,279298,315347,430005,588372,592970,682250,758196]],["@metamask/eth-json-rpc-middleware",[116559,200770,200770,200770,225924,227352,227405,237780,310347,355626,399418,428568,443118,474396,47489,47489,47489,504418,563391,579052,579052,579052,626472,6424,6424,6424,680772,680772,680772,683625,683625,683625,717276,717276,717276,717568,760656,760656,760656,791621,792444,80091,804517,836167,859779,876072,876072,876072,895322,895322,895322,908125,908125,908125]],["@metamask/eth-json-rpc-middleware>safe-stable-stringify",[330764,330764,330764,612980,612980,612980,754903,911668]],["@metamask/eth-ledger-bridge-keyring",[146110,462175,474790,479655,485977,628590,64822,66256,676012,712450,77378,864507,88665,989609]],["@metamask/eth-ledger-bridge-keyring>@ledgerhq/context-module",[100446,102015,11229,126292,129156,132301,14063,153218,161134,174301,178765,178954,194160,213221,21770,222165,233301,240651,254502,275959,283921,294596,297747,303498,304388,304530,308463,31110,31551,324248,325090,335471,36252,374435,374741,379660,383767,385915,387389,388659,409689,416808,417381,435453,435903,439037,445541,447445,453468,457149,46892,469984,472907,488146,49538,498613,500790,501726,503645,504792,514084,515004,518941,519429,526113,531476,548370,548582,549403,559108,561502,561851,568069,570211,574388,57689,577340,580031,580974,587565,595368,596402,601095,606453,61154,614209,616548,616774,617864,623091,630202,637118,643372,650255,653767,659836,661978,662588,664727,669342,670583,672087,672411,677261,678509,683165,696811,700360,702292,715494,71927,71966,728944,729794,738974,742705,743995,758708,762192,766815,775415,776229,782087,78883,796569,796574,802464,80685,80839,810716,811218,822658,822846,824643,828847,841768,844119,844379,847065,848372,856513,865596,866965,87435,879538,880370,882640,887693,889667,891375,89850,902999,904532,913354,924296,927247,928202,929581,929806,931383,934441,938517,942775,943464,947315,95440,963202,969162,974235,9812,981409,982099,986879,988531,995929,997091,999966]],["@metamask/eth-ledger-bridge-keyring>@ledgerhq/context-module>ethers",[101035,1366,14731,147979,160614,204446,241614,249650,269473,270216,273122,297895,373917,407778,451728,475866,542869,585747,615001,658668,684977,83296,945568]],["@metamask/eth-ledger-bridge-keyring>@ledgerhq/context-module>ethers>@noble/hashes",[112598,403773,494883,997167]],["@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum",[10255,130966,134169,138207,157662,161087,175706,182714,190834,193031,228747,231683,233425,242026,253152,262273,265847,267651,2682,271735,274517,279684,285056,30999,31255,322434,326028,326614,338409,368045,381164,385700,386341,389015,407443,409918,425882,431408,446394,456202,464829,483253,484763,486012,488223,498271,512900,51858,521980,531570,5423,554049,55421,563802,564401,579593,582766,60349,605154,617251,636526,639162,671991,674215,683655,691042,694021,699085,706294,713834,730939,73564,73657,756672,770564,785099,792999,793495,794099,817892,831083,838990,839910,847052,852183,855667,87945,900829,926033,93725,953641,956326,963740,964650,968091,970882,977943,987002,992029]],["@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>@ledgerhq/signer-utils",[239232,395473,430761,556977,757004]],["@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>ethers",[145601,204633,231428,244261,356934,394020,409294,432579,448874,463044,477652,483270,59569,641204,680618,729587,746661,833035,880060,940973,950629]],["@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>ethers>@noble/curves",[133792,165569,168107,38716,82922,955660]],["@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>ethers>@noble/hashes",[130457,139772,155737,25009,428117,710532,827303,881305,998555]],["@metamask/eth-money-keyring",[372751,877760]],["@metamask/eth-money-keyring>@metamask/eth-hd-keyring",[100204]],["@metamask/eth-money-keyring>@metamask/keyring-sdk",[145626,336028,425773,511711]],["@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography",[477269,713290,844093]],["@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@noble/curves",[296935,326754,35385,374552,597391,74411]],["@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@noble/hashes",[236025,317367,45660,501070,53146,659771,706333,757402,865084,903146]],["@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@scure/bip32",[425951]],["@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@scure/bip32>@scure/base",[43e4]],["@metamask/eth-money-keyring>@metamask/keyring-sdk>uuid",[384006,839826,872124,94671]],["@metamask/eth-qr-keyring",[177111,270128,659481,807147,815507,995456]],["@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth",[11448,356471,545448,910187]],["@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util",[106166,107015,129631,184430,189255,202020,227759,242063,287160,304681,317236,365684,413456,416838,422522,451854,463212,48505,499760,512514,650359,832445,841455,900165,910697,924906,935909,943228,943909,977461]],["@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>@ethereumjs/rlp",[195412,506783]],["@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>ethereum-cryptography",[221427,613096,748037,837272,857020,943013]],["@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>ethereum-cryptography>@noble/curves",[158115,23489,255008,291818,397454,435491,445730,449273,546894,588947,712218,774223,889447,933636]],["@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>ethereum-cryptography>@noble/hashes",[157753,245326,274209,307067,402728,408688,492641,562204,655119,772775,778756,793961,804949,860498,898914,9102]],["@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@keystonehq/bc-ur-registry",[109968,115358,117966,122720,133557,154783,161856,177355,182666,185897,204916,235376,261574,272857,28597,304809,381418,41249,450301,451297,456406,461683,470297,470600,550736,589837,636165,639779,648167,655398,659325,67503,675722,700095,748835,755426,782172,791890,816816,879846,887673,895608,926141,934292,934796,949592,961101,969685,983013,987073,99602,996720]],["@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>uuid",[241376,242547,260475,301443,331312,350967,506592,509189,512578,544660,592510,596952,630568,64667,655956,663309,68131,695274,695305,713983,724869,743621,751815,76104,833038,837494,840633,859812,946844,959159]],["@metamask/eth-qr-keyring>hdkey",[821827,942518]],["@metamask/eth-qr-keyring>uuid",[261346,329214,331553,363633,414102,420591,579133,611514,646280,67769,852884,995985]],["@metamask/eth-sig-util",[162924,166243,327081,371046,398434,47994,57209,793940,844654,874235,876521,937867]],["@metamask/eth-sig-util>@ethereumjs/rlp",[42850,799901]],["@metamask/eth-sig-util>@ethereumjs/util",[122265,136513,142565,146175,191914,193298,209472,212876,227526,253553,271935,373347,374639,415846,456703,495838,59170,610843,618068,627626,665027,670186,70081,729945,7824,789337,789352,853979,933932,952208]],["@metamask/eth-sig-util>@scure/base",[846906,96959]],["@metamask/eth-sig-util>ethereum-cryptography",[121732,337164,369916,457095,519021,696063]],["@metamask/eth-sig-util>ethereum-cryptography>@noble/curves",[154145,173752,183896,317475,394542,416989,464749,498307,563246,591346,629229,790586,850513,893506]],["@metamask/eth-sig-util>ethereum-cryptography>@noble/hashes",[108610,122679,173646,215020,24004,242736,2819,295849,337099,351520,570641,59242,755859,760501,842382,845139]],["@metamask/eth-snap-keyring",[198032,314873,510840,565052,586380,647262,692443,765389,850982,896009,912558,971019]],["@metamask/eth-snap-keyring>@metamask/keyring-internal-snap-client",[136545,181106]],["@metamask/eth-snap-keyring>@metamask/keyring-snap-sdk",[439103]],["@metamask/eth-snap-keyring>uuid",[241696,246227,495506,655502]],["@metamask/eth-token-tracker",[255353,521476,767110]],["@metamask/eth-token-tracker>@metamask/eth-block-tracker",[46097,607723,614362,624895,696478]],["@metamask/eth-token-tracker>deep-equal",[747174]],["@metamask/eth-token-tracker>deep-equal>es-get-iterator",[89048]],["@metamask/eth-token-tracker>deep-equal>es-get-iterator>is-map",[107274]],["@metamask/eth-token-tracker>deep-equal>is-date-object",[952632]],["@metamask/eth-token-tracker>deep-equal>which-boxed-primitive",[114003]],["@metamask/eth-token-tracker>deep-equal>which-boxed-primitive>is-bigint",[1771]],["@metamask/eth-token-tracker>deep-equal>which-boxed-primitive>is-boolean-object",[841928]],["@metamask/eth-token-tracker>deep-equal>which-boxed-primitive>is-number-object",[523543]],["@metamask/eth-token-tracker>deep-equal>which-collection",[539681]],["@metamask/eth-token-tracker>deep-equal>which-collection>is-weakmap",[46066]],["@metamask/eth-token-tracker>deep-equal>which-collection>is-weakset",[954136]],["@metamask/eth-trezor-keyring",[164172,218202,310843,412665,413177,449478,855756]],["@metamask/eth-trezor-keyring>@trezor/connect-plugin-ethereum",[576404]],["@metamask/etherscan-link",[254605,314846,331176,386325,450656,455308,633713,64025,647573,759868,878622,896383,947264,971443]],["@metamask/gas-fee-controller",[170777,473163,651658]],["@metamask/gator-permissions-controller",[10222,139086,165518,198592,217449,229308,236753,245754,292184,328346,393992,43461,56702,700051,722883,732031,759010,849108,871250,916647,925545,938154,989420]],["@metamask/gator-permissions-controller>@metamask/abi-utils",[161659,203674,281731,331541,41488,467490,5350,661484,664323,677379,681530,685189,719319,733242,798708,843028,905308,95728,964058,97148]],["@metamask/gator-permissions-controller>@metamask/delegation-deployments",[352008]],["@metamask/gator-permissions-snap",[501707]],["@metamask/geolocation-controller",[153615,472806,909614,969456]],["@metamask/hw-wallet-sdk",[137889,588427,593365,649775,687371,784717,841757,853955]],["@metamask/institutional-wallet-snap",[214494]],["@metamask/jazzicon",[256985,762823,983303]],["@metamask/jazzicon>color",[805512]],["@metamask/jazzicon>color>clone",[901347]],["@metamask/jazzicon>color>color-convert",[39752,812025,982168]],["@metamask/jazzicon>color>color-convert>color-name",[521513]],["@metamask/jazzicon>color>color-string",[362611]],["@metamask/jazzicon>mersenne-twister",[760322]],["@metamask/json-rpc-engine",[10659,10659,10659,144122,144122,144122,183704,213318,240984,240984,240984,243466,243466,243466,244704,259482,370953,398989,398989,398989,41174,553776,608368,608368,608368,619841,649175,649175,649175,827790,827790,827790,839072,868685,876362,888922,943051,982426]],["@metamask/json-rpc-engine>klona",[20219,699479,699479,699479,810045,810045,810045,966056]],["@metamask/json-rpc-middleware-stream",[407394,410102,643984,721920]],["@metamask/json-rpc-middleware-stream>readable-stream",[1024,104760,123210,134796,156997,17144,221179,231821,235139,278031,285372,304983,306788,30763,323247,329687,424983,462397,494081,546165,558254,63063,682145,700528,710347,724843,750965,752314,775370,813254,820213,825326,839868,847866,859321,867208,906781,915142,925777,929561,942412,942755,947558,960094,979496]],["@metamask/keyring-api",[111301,131807,141203,150042,161271,161934,197318,201831,223967,242317,244393,250502,265109,28360,286141,306637,330239,334242,334493,341483,341483,341483,348554,348554,348554,368243,373585,373585,373585,382682,39610,44141,462726,467236,477322,477322,477322,492023,54178,551171,582873,592653,592653,592653,595704,612293,659464,663608,670158,674397,694359,711298,718622,732475,740234,751817,785872,813579,826589,826651,853429,861320,867525,871089,883896,886319,896322,905620,906646,906646,906646,91107,928437,938323,957740,970519,979855,983932]],["@metamask/keyring-controller",[12164,246011,264028,355526,715878,76782,873614]],["@metamask/keyring-controller>@metamask/eth-simple-keyring",[207492,232031,688668,716741]],["@metamask/keyring-controller>@metamask/eth-simple-keyring>ethereum-cryptography",[11305,460532,784908,925631]],["@metamask/keyring-controller>@metamask/eth-simple-keyring>ethereum-cryptography>@noble/hashes",[223880,310270,453512,500916,586102,741197,828940,972107]],["@metamask/keyring-controller>ethereumjs-wallet",[145286,436551,512249,562210,610527,705638]],["@metamask/keyring-controller>ethereumjs-wallet>ethereum-cryptography",[143313,151789,215602,238365,267378,283155,361274,398760,51747,564783,585825,61648,638460,645627,65389,723983,748624,748852,749005,847292,90980,988244]],["@metamask/keyring-controller>ethereumjs-wallet>ethereumjs-util",[191517,206354,227271,255583,303999,363828,388918,468754,531412,648512,681551,681987,690345,701971,702249,71210,75560,828122,831933,851954,888663,892253,916531,945458]],["@metamask/keyring-controller>ethereumjs-wallet>utf8",[670655,730782]],["@metamask/keyring-controller>ulid",[246338,31299,599794,988585]],["@metamask/keyring-internal-api",[693992]],["@metamask/keyring-sdk",[142233,192060,210385,314527,440005,482714,485426,680238,688215,693228,892692,932754,940399]],["@metamask/keyring-sdk>ethereum-cryptography",[103525,525043,783724,824745]],["@metamask/keyring-sdk>ethereum-cryptography>@noble/hashes",[167111,205098,225246,245633,250134,694868,819290,868908]],["@metamask/keyring-sdk>uuid",[236250,280255,345719,394608,43681,474820,682642,905303]],["@metamask/keyring-snap-client",[329212,396571,656228]],["@metamask/keyring-snap-client>uuid",[207956,210603,292899,468320,491914,580723,724414,768145]],["@metamask/keyring-utils",[156635,259691,364524,364524,364524,385586,426708,510930,551277,551277,551277,61683,893513,911633]],["@metamask/logging-controller",[365434,409691]],["@metamask/logo",[663411,739929,844113]],["@metamask/logo>gl-mat4",[58879,717641,733652,740435,974021,979173]],["@metamask/logo>gl-vec3",[239384]],["@metamask/message-manager",[192896,278809,7255,75530]],["@metamask/message-manager>jsonschema",[338038,454579,561845,657206,802569]],["@metamask/message-signing-snap",[35272]],["@metamask/messenger",[394913,394913,394913,495782,495782,495782,567015,633454]],["@metamask/metamask-eth-abis",[115022,285981,285981,409227,409227,571397,571397,623031,632915,632915,697040,751270,785012,785012,85218]],["@metamask/mobile-wallet-protocol-core",[454830]],["@metamask/mobile-wallet-protocol-core>centrifuge",[218725]],["@metamask/mobile-wallet-protocol-core>eventemitter3",[280167]],["@metamask/mobile-wallet-protocol-core>uuid",[290130,34227,426629,43138,440826,478364,485512,527229,542488,574456,622389,635654,686616,714334,728021,849380,879677,889265,912587,920183,957975]],["@metamask/mobile-wallet-protocol-dapp-client",[998611]],["@metamask/mobile-wallet-protocol-dapp-client>uuid",[570794,645413,899037,990133]],["@metamask/money-account-api-data-service",[120582,131287,206073,374044,463449]],["@metamask/money-account-api-data-service>@metamask/controller-utils",[876119]],["@metamask/money-account-balance-service",[124183,343027,398120,461578,69631,716171,859518]],["@metamask/money-account-balance-service>@metamask/controller-utils",[975412]],["@metamask/money-account-controller",[173212,291936,478615]],["@metamask/money-account-controller>@metamask/eth-money-keyring",[523559]],["@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring",[77181]],["@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography",[532495,956158]],["@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@noble/curves",[106080,294103,33737,60452,693930,915732]],["@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@noble/hashes",[339309,393792,402649,449280,478579,532340,673132,691455,838207,840639]],["@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32",[674726]],["@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32>@scure/base",[134119]],["@metamask/money-account-controller>@metamask/keyring-controller",[641270,842038,884010]],["@metamask/money-account-upgrade-controller",[200547,206165,237441,441305,540390,771255,80786,873971]],["@metamask/money-account-upgrade-controller>@metamask/delegation-deployments",[331967]],["@metamask/money-account-upgrade-controller>@metamask/keyring-controller",[237037,410144,662059]],["@metamask/money-account-utils",[383817,497637,52315,809645,939319]],["@metamask/multichain-account-service",[231618,34663,359201,371912,392959,475985,494363,531398,584262,622635,695058,700654,736886,849223,905218,92435,959171,962076,970725]],["@metamask/multichain-api-client",[220677,366196,412454,4712,56710,675768,676687,991999]],["@metamask/multichain-api-middleware",[22054,231253,316756,374018,457740,5135,784979,862719,965714]],["@metamask/multichain-api-middleware>@metamask/api-specs",[349544,496663,989430]],["@metamask/multichain-api-middleware>@metamask/chain-agnostic-permission",[239480,251445,27852,338871,36569,394612,398629,43663,579497,621113,715513,71748,720056]],["@metamask/multichain-api-middleware>@metamask/json-rpc-engine",[632413]],["@metamask/multichain-network-controller",[15549,15549,15549,392858,431035,501203,888813,915877,928711,951493,951493,951493]],["@metamask/multichain-transactions-controller",[37610]],["@metamask/name-controller",[12824,140701,414136,530451,614937,643343,709216,812529,834395,869152]],["@metamask/name-controller>@metamask/controller-utils",[812246,812830]],["@metamask/network-connection-banner-controller",[100456,221849,272913]],["@metamask/network-connection-banner-controller>@metamask/client-controller",[512021]],["@metamask/network-controller",[121205,121205,121205,126099,150835,250702,250702,250702,326265,332893,348133,348133,348133,366018,376651,376651,376651,379047,379047,379047,396355,445367,445367,445367,59388,803758,803758,803758,820293,820293,820293,887394,887394,887394,905828,905828,905828,914278,93126,998637]],["@metamask/network-controller>@metamask/connectivity-controller",[703841,913347,913347,913347]],["@metamask/network-controller>@metamask/controller-utils",[123515,123515,123515,278397,278397,278397,285353,490957,563128,563128,563128,568471,568471,568471,971067,995768]],["@metamask/network-controller>@metamask/eth-block-tracker",[687203,722364,722364,722364,751204,844693,844693,844693]],["@metamask/network-controller>@metamask/eth-json-rpc-infura",[196288,196288,196288,324738,391341,391341,391341,507424,515366,597837,597837,597837,717129,717129,717129,891881,975366,975366,975366,986795]],["@metamask/network-controller>@metamask/eth-json-rpc-infura>@metamask/eth-json-rpc-provider",[139596,139596,139596,139596,139596,139596,139596,139596,163433,163433,163433,163433,163433,163433,163433,163433,215604,357480,357480,357480,357480,357480,357480,357480,357480,394408,666594,666594,666594,666594,666594,666594,666594,666594,973186,996223]],["@metamask/network-controller>@metamask/eth-json-rpc-infura>@metamask/json-rpc-engine",[155760,155978,163901,219719,219719,219719,219719,219719,219719,219719,219719,22349,22349,22349,22349,22349,22349,22349,22349,243812,272166,286098,350146,350146,350146,350146,350146,350146,350146,350146,353402,353402,353402,353402,353402,353402,353402,353402,409044,409044,409044,409044,409044,409044,409044,409044,415996,415996,415996,415996,415996,415996,415996,415996,524994,553492,553492,553492,553492,553492,553492,553492,553492,588224,588224,588224,588224,588224,588224,588224,588224,597e3,597e3,597e3,597e3,597e3,597e3,597e3,597e3,626412,635118,635118,635118,635118,635118,635118,635118,635118,641762,641762,641762,641762,641762,641762,641762,641762,679074,743149,743149,743149,743149,743149,743149,743149,743149,752075,811336,838194,838194,838194,838194,838194,838194,838194,838194,887595,913196]],["@metamask/network-controller>@metamask/eth-json-rpc-provider",[161137,161137,161137,294775,736135,742017,742017,742017]],["@metamask/network-controller>@metamask/swappable-obj-proxy",[101126,101126,101126,31640,480251,480251,480251,554207,821954,832336,832336,832336,871023,871023,871023,906117]],["@metamask/network-controller>immer",[550575,600025,600025,600025]],["@metamask/network-controller>reselect",[275217,275217,275217,343959]],["@metamask/network-controller>uuid",[212077,212077,212077,291115,563675,705003,797997,797997,797997,80932,80932,80932,830268,923997,923997,923997]],["@metamask/network-enablement-controller",[255685,387655,688916,80884,897544]],["@metamask/notification-services-controller",[15804,162889,228511,242493,254039,261131,293009,30776,328690,338948,351765,352123,406633,433151,437582,444708,450366,468281,470007,470274,477842,536850,565947,597298,641182,662859,692898,721335,72886,730709,736120,753037,782294,799985,88005,890865,90799,934276,948157,958044]],["@metamask/notification-services-controller>@contentful/rich-text-html-renderer",[396769,777316]],["@metamask/notification-services-controller>@metamask/controller-utils",[56260,562908,679593,73215]],["@metamask/notification-services-controller>firebase",[168633,634193,888506]],["@metamask/notification-services-controller>firebase>@firebase/app",[810127]],["@metamask/notification-services-controller>firebase>@firebase/app>@firebase/component",[8271]],["@metamask/notification-services-controller>firebase>@firebase/app>@firebase/logger",[320916]],["@metamask/notification-services-controller>firebase>@firebase/app>idb",[131816,470206]],["@metamask/notification-services-controller>firebase>@firebase/installations",[839897]],["@metamask/notification-services-controller>firebase>@firebase/messaging",[228728,321964]],["@metamask/notification-services-controller>firebase>@firebase/util",[873774]],["@metamask/notification-services-controller>uuid",[113327,16177,312951,324904,345983,713385,750425,75112]],["@metamask/object-multiplex",[136940,273538,373445,541726,541726,657887,657887,925275,950169,967744,967744,993027]],["@metamask/object-multiplex>once",[150910,688655,688655,842744]],["@metamask/object-multiplex>once>wrappy",[368616,703854,885067,885067]],["@metamask/object-multiplex>readable-stream",[103508,103508,108694,108694,15394,15394,178079,181531,181531,183588,25387,258565,258565,284911,292787,304208,304208,319353,373654,388658,406385,441713,446267,446267,469856,472387,478633,478633,540031,540031,554907,593545,593545,604196,652767,659909,66066,666688,666688,691259,71293,729063,737465,752333,75284,75284,753921,835990,838926,838926,839488,842809,846686,884578,897252,907776,934344,934344,979662,979662]],["@metamask/obs-store",[22954,311763,335953,530109,533761,942538]],["@metamask/obs-store>readable-stream",[150473,157404,181418,263336,294921,367710,403784,460097,560380,615239,642085,694935,707781,748489,905456]],["@metamask/passkey-controller",[127501,127562,18362,336949,387483,411102,434460,487680,507689,51149,542255,66610,766748,85953,866789,900311,988373]],["@metamask/passkey-controller>@levischuck/tiny-cbor",[21408,423054,53929]],["@metamask/permission-controller",[19762,350434,350434,372002,494063,616958,62088,687938,687938,705624,743458,766792,766792,783761,991188,991188]],["@metamask/permission-controller>@metamask/controller-utils",[361053]],["@metamask/permission-log-controller",[230060,940669]],["@metamask/permissions-kernel-snap",[271657]],["@metamask/perps-controller",[104558,12282,129103,170685,213617,220009,223284,233975,237003,237978,246178,249492,276505,276894,305255,309728,310084,310136,330381,335414,348017,353034,373148,380455,396970,406134,407960,415242,432382,433840,434687,487190,506445,522356,534072,536098,537843,548706,571926,587165,600030,607871,617414,630880,63097,664628,665669,674141,679162,687983,699915,72435,731283,748591,755423,764831,810075,811305,815223,816304,821693,821930,825646,856346,858360,893765,89784,900181,906003,932219,944740,948631,966540,992600]],["@metamask/perps-controller>@metamask/abi-utils",[111264,137012,142182,186069,224747,272812,319695,366721,413373,459134,46185,635465,756610,762350,771722,830360,86560,903852,925850,926394]],["@metamask/perps-controller>@metamask/controller-utils",[314168,886285,896809]],["@metamask/perps-controller>@nktkas/hyperliquid",[101129,102362,104684,105154,1056,106128,109323,125212,129161,129390,130360,136002,137722,141624,142095,156289,158657,159559,162888,174985,175815,176141,176558,181031,181275,185489,186074,192088,193501,193947,221473,228324,229042,240763,24213,245591,247707,247865,248197,251454,259954,261878,262172,262369,263985,271768,273005,285917,286810,293647,298254,307323,309848,312624,318481,323716,327752,328150,335474,335704,346714,352145,370572,382324,383916,385984,390159,39020,400050,401532,401791,408925,410421,434189,446069,44676,453316,453553,458920,469823,471596,472431,472732,482402,485243,499202,502334,507419,51032,51096,51249,519574,53139,532353,537694,538599,539411,541870,545529,548680,55018,554215,563788,564494,566805,56681,569407,572906,575265,583018,584258,585272,585773,590319,59960,603927,611097,616095,626513,636739,640135,643575,643896,650627,659104,660583,660786,670779,671868,674641,678e3,679722,681458,685001,68976,689875,693525,703312,713408,714659,725316,743415,747068,750953,761286,77716,782773,784414,792950,797101,79747,800804,801399,807265,808356,815951,818121,819249,820795,825194,827996,836630,841724,844070,845762,853337,855429,855596,882665,883962,88719,890432,894839,898119,898536,903423,904880,910301,922491,936813,937899,938731,94985,951280,953264,956003,958904,963422,968666,982691,990103,997640,997946]],["@metamask/perps-controller>@nktkas/hyperliquid>@nktkas/rews",[919092]],["@metamask/perps-controller>@nktkas/hyperliquid>@noble/hashes",[52184,708987,933919]],["@metamask/perps-controller>@nktkas/hyperliquid>valibot",[234673]],["@metamask/perps-controller>bignumber.js",[367389]],["@metamask/perps-controller>reselect",[399505]],["@metamask/perps-controller>uuid",[551036,767211,888392,920811]],["@metamask/phishing-controller",[220541,226735,266791,364932,483642,48657,541277,761595,779295,811625]],["@metamask/phishing-controller>@metamask/controller-utils",[36662]],["@metamask/polling-controller",[475754,499945,848418]],["@metamask/post-message-stream",[101274,101274,107927,107927,23400,303501,359799,379148,411515,462271,465868,524382,524382,543433,543474,562582,620498,620498,74883,74883,755593,755593,797866,822105,841953,848351,927785,927785]],["@metamask/post-message-stream>readable-stream",[103082,122587,122587,128093,128093,149890,149890,158647,158647,163119,164196,209528,216795,280932,311931,335992,365149,377228,377228,387923,387923,430723,430723,437116,450432,450862,453036,456224,456224,490137,490137,506348,506348,507330,508142,508142,525366,538997,589202,621123,67395,67395,68193,702682,742819,783385,815245,846471,852894,859028,85990,864992,864992,866345,883886,929012,938361,938361,976199,976199]],["@metamask/ppom-validator",[118001,501054,683914,782496]],["@metamask/ppom-validator>@metamask/controller-utils",[147732,280485,702696,708121,722299,95496,967024]],["@metamask/ppom-validator>await-semaphore",[905433]],["@metamask/ppom-validator>crypto-js",[100757,172160,205706,208141,225127,261390,292580,336868,350067,357329,361567,392374,45750,496292,498934,512397,521035,587891,599379,602347,608774,610647,614664,647486,67012,72983,734486,741309,767002,771511,796566,826321,829757,836858,862264,902959,929783,937614,940658]],["@metamask/ppom-validator>json-rpc-random-id",[275336,84187,84187,84187]],["@metamask/profile-metrics-controller",[315099,36170,551548,77271]],["@metamask/profile-metrics-controller>@metamask/controller-utils",[683635,988718]],["@metamask/profile-metrics-controller>@metamask/polling-controller",[170098,720163]],["@metamask/profile-metrics-controller>@metamask/polling-controller>uuid",[416936,481997,759094,849572,883449]],["@metamask/profile-metrics-controller>uuid",[305482,360160,60884,882001]],["@metamask/profile-sync-controller",[148299,197943,217486,22654,232330,245522,251538,252409,270288,309552,385352,420056,420716,4269,449360,456963,467921,494558,534065,535738,559539,564508,565682,574507,581442,64704,683536,707024,71552,716485,729598,735867,740385,750756,752883,764352,768246,782417,863511,866993,875827,917350,976051]],["@metamask/profile-sync-controller>@signinwithethereum/siwe",[164797,168632,55011,735444,957914]],["@metamask/providers",[116263,152704,178618,482392,604632,611766,683527,725087,733762,748698,78279,798563,944401,946170,946822,958440]],["@metamask/providers>@metamask/json-rpc-engine",[264813,408923,47649,576306,693492,869683]],["@metamask/providers>is-stream",[84773,902544]],["@metamask/providers>readable-stream",[125282,131581,167911,206930,217247,272419,275885,31329,31356,352992,360996,366175,373035,406951,433634,478694,577916,609843,616714,655772,660418,670086,719599,769499,777480,789321,817741,834278,871965,919766]],["@metamask/ramps-controller",[107750,185364,222005,298985,306470,346769,385135,396338,410610,437324,484514,510743,521381,541885,567426,580782,634789,65476,661486,665651,669135,67281,746450,757107,783255,795636,818265,849791,861090,884155,888449,968210,968940,988098]],["@metamask/ramps-controller>@metamask/controller-utils",[143679,163722]],["@metamask/ramps-controller>bignumber.js",[131348,410988]],["@metamask/rate-limit-controller",[200214]],["@metamask/react-data-query",[574018,719013]],["@metamask/remote-feature-flag-controller",[108137,172509,278767,407082,407082,407082,738898,867770,958793]],["@metamask/remote-feature-flag-controller>@metamask/controller-utils",[408615]],["@metamask/rpc-errors",[132002,132002,132002,135299,135299,135299,135299,135299,135299,135299,135299,13592,144008,144008,144008,144008,16905,16905,16905,16905,195057,195057,195057,195057,195057,195057,195057,195057,207534,207534,207534,207534,207534,207534,207534,207534,250101,347336,353959,353959,353959,581327,581327,581327,581327,584553,584553,584553,652016,682977,703640,703640,703640,703640,703640,703640,703640,703640,711210,711210,711210,714679,805248,805248,805248,85568,875088,875088,875088,875088,875088,875088,875088,875088,980191,98790]],["@metamask/rpc-errors>fast-safe-stringify",[101292,101292,101292,408738,754255,754255,754255,754255]],["@metamask/safe-event-emitter",[227198,404705,41633,41633,41633,568935,75574,75574,75574,75574,75574,75574,75574,75574]],["@metamask/scure-bip39",[231971,39617,592190,595876]],["@metamask/scure-bip39>@noble/hashes",[202475,239227,401576,484186,494981,512504,560972,56654,614013,693606,754216,782486,835673,851767,879240,88469,938735,980895]],["@metamask/scure-bip39>@scure/base",[763261,816018]],["@metamask/seedless-onboarding-controller",[193178,401078,404757,404797,426617,436403,4835,484785,715563,744335,97111]],["@metamask/seedless-onboarding-controller>@metamask/auth-network-utils",[822318]],["@metamask/seedless-onboarding-controller>@metamask/auth-network-utils>@toruslabs/constants",[225690]],["@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup",[151556,173516,238842,240737,342496,36100,422680,492933,62051,665947,79948,853205,90171]],["@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@metamask/auth-network-utils",[260238,315073,340862,356228,398517,943898,961703,989259]],["@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/fetch-node-details",[176448]],["@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/fetch-node-details>@toruslabs/fnd-base",[244824,451189,489988,762643]],["@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/fetch-node-details>@toruslabs/http-helpers",[807050]],["@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/http-helpers",[558486]],["@metamask/selected-network-controller",[845003,966035]],["@metamask/sentinel-api-service",[142964,334157,594068,874625,894737,954565]],["@metamask/sentinel-api-service>@metamask/controller-utils",[151698]],["@metamask/shield-controller",[417305,740304,751037,976635]],["@metamask/signature-controller",[415436,443380,443651,693808,77736,786887,827326,851561]],["@metamask/signature-controller>@metamask/keyring-controller",[341654,445418,917682]],["@metamask/signature-controller>@metamask/logging-controller",[673823,954007]],["@metamask/smart-transactions-controller",[176586,198038,217454,478671,492238,502178,543353,54767,590010,652838,734745,884773,891910]],["@metamask/smart-transactions-controller>@metamask/controller-utils",[15691,997116]],["@metamask/smart-transactions-controller>@metamask/polling-controller",[222459,507082]],["@metamask/smart-transactions-controller>bignumber.js",[35040]],["@metamask/snap-account-service",[189141,209648,441819,539294,579136,657769]],["@metamask/snaps-controllers",[100936,13830,159436,186638,197230,278113,296346,2982,302870,365768,37124,479132,585625,592949,624144,640075,65383,685406,737060,758116,792020,800597,821908,881518,886365,958933]],["@metamask/snaps-controllers>@metamask/json-rpc-engine",[189818,536642,536689,589654,796625,800772,970746]],["@metamask/snaps-controllers>@xstate/fsm",[464037]],["@metamask/snaps-controllers>concat-stream",[207552]],["@metamask/snaps-controllers>get-npm-tarball-url",[544627]],["@metamask/snaps-controllers>readable-stream",[151318,151999,163614,18591,352457,371462,379528,387180,473427,631936,644546,668934,908588,911856,95525]],["@metamask/snaps-controllers>readable-web-to-node-stream",[931149]],["@metamask/snaps-controllers>readable-web-to-node-stream>readable-stream",[168302,261736,324144,333048,416003,48390,490661,672710,777866,802799,849252,867751,900609,924693,940258]],["@metamask/snaps-controllers>tar-stream",[462371,597634,612528,75071,861173]],["@metamask/snaps-controllers>tar-stream>b4a",[22010,221286,364148,527062,703600,827088,838641]],["@metamask/snaps-controllers>tar-stream>fast-fifo",[252827,988679]],["@metamask/snaps-controllers>tar-stream>streamx",[26806,314349]],["@metamask/snaps-controllers>tar-stream>streamx>events-universal",[155934]],["@metamask/snaps-controllers>tar-stream>streamx>text-decoder",[587882,727e3,747888]],["@metamask/snaps-execution-environments",[449787,449787,897911]],["@metamask/snaps-registry",[529597,690212]],["@metamask/snaps-rpc-methods",[144945,146546,147860,153901,172643,185355,19138,193993,197682,202511,210734,22086,228644,245798,257657,269716,274423,282522,283044,304925,314585,315290,322997,350994,36294,373268,374054,379968,385026,406625,425998,434878,434878,448292,449485,46547,466022,474822,47964,506763,514127,522251,545190,545679,56730,574772,576712,587268,601247,617736,662344,67770,680320,689132,689132,710032,746875,747359,756782,760650,765442,795174,819766,829418,830111,831028,834786,840672,875706,899342,899345,926697,941560,942800,944476,951597,969885,991882]],["@metamask/snaps-sdk",[102018,11115,115412,128323,129852,157392,157392,159167,159167,171089,174638,174638,175025,186119,186119,188320,188320,208554,208554,215254,229765,254995,254995,264295,286028,28748,292076,300005,300005,306436,307856,308348,32014,32014,323626,328448,329338,33029,33029,335562,335562,382906,382906,392154,409982,414221,414221,426668,434322,434322,443697,443697,45217,45217,453945,453945,461893,461893,473552,473903,484068,484068,499490,499490,503236,509450,511543,515828,515828,533010,544299,544299,554649,554888,5654,5654,578214,586794,589411,597361,597361,599601,609948,609948,614130,614130,624938,631305,63236,633089,633089,647388,647388,676358,676358,678485,689686,689686,694729,694729,706524,706524,707278,708790,721117,721117,722837,722837,728195,728195,763799,7688,772646,773466,781147,78121,78121,797999,797999,80332,80332,814006,814006,814779,818365,818365,833399,833399,833414,833414,841767,861913,861913,865260,869864,869864,879516,879516,879771,879771,904538,936435,936435,937053,937053,947709,951198,955187,955187,962940,965587,971188,971188,976558,98414,984524,984524,988068,988068,989634]],["@metamask/snaps-sdk>@metamask/key-tree",[100468,138991,141769,202060,202535,224378,245476,256046,268988,365834,365983,379669,410574,42491,476536,480601,480665,508238,53921,568607,568870,585793,617862,64263,643988,650475,691816,693932,697917,699078,732112,754560,884797,899105,914309,916003,920131,94947,949840,953152,963624,999736]],["@metamask/snaps-utils",[116243,122017,138526,143996,148812,156828,203116,219701,237825,244499,252164,259024,296252,30260,325631,327256,342548,355897,358e3,366816,392380,399768,431050,440561,444743,464686,470298,501578,504536,524342,541503,54872,549849,569476,58520,593452,619193,62099,622104,627819,630249,631524,650273,650976,676798,685502,705935,725942,744381,761368,761585,809308,81679,828364,833302,849444,877759,895112,90157,90404,914420,941248,968074,973637,988931,988950,99290]],["@metamask/snaps-utils>@metamask/cryptography",[145732,664013,690694,833446]],["@metamask/snaps-utils>@metamask/slip44",[62816,847408,847408,847408,847408,847408]],["@metamask/snaps-utils>fast-xml-parser",[111761,290529,379535,522951,608178,64236,690389,859399,953156]],["@metamask/snaps-utils>fast-xml-parser>@nodable/entities",[493755,743107]],["@metamask/snaps-utils>fast-xml-parser>path-expression-matcher",[263528,371328,766382]],["@metamask/snaps-utils>fast-xml-parser>strnum",[191736]],["@metamask/snaps-utils>marked",[44747,746041]],["@metamask/snaps-utils>rfdc",[397348,945441]],["@metamask/snaps-utils>validate-npm-package-name",[170762,226237]],["@metamask/snaps-utils>validate-npm-package-name>builtins",[264034,81481]],["@metamask/solana-wallet-snap",[990997]],["@metamask/solana-wallet-standard",[158133,29645,309289,819292,876553]],["@metamask/solana-wallet-standard>@solana/wallet-standard-features",[45444,527170,598497,943760]],["@metamask/solana-wallet-standard>@wallet-standard/features",[694718,716207,986059]],["@metamask/solana-wallet-standard>@wallet-standard/wallet",[295412,302163]],["@metamask/stellar-wallet-snap",[25824]],["@metamask/storage-service",[694546]],["@metamask/subscription-controller",[112583,135109,623763,663425,940965]],["@metamask/superstruct",[126717,133777,142827,142827,142827,147698,147698,147698,147698,147698,147698,147698,160064,177809,179379,179379,179379,179379,179379,179379,179379,244231,244231,244231,290266,290266,290266,296422,307059,307059,307059,315560,315560,315560,315560,315560,315560,315560,342672,342672,342672,355608,355608,355608,356583,356583,356583,359066,362066,400619,400619,400619,411554,411554,411554,437527,448967,448967,448967,449070,449070,449070,497177,497177,497177,497177,497177,497177,497177,5136,5136,5136,5136,5136,5136,5136,514728,545203,545203,545203,585186,599805,599805,599805,599805,599805,599805,599805,612815,612815,612815,628674,628674,628674,628674,628674,628674,628674,63015,638737,638737,638737,638737,638737,638737,638737,642240,652825,652825,652825,710429,728522,728522,728522,728522,728522,728522,728522,784225,784225,784225,829528,844377,886639,982944,982944,982944,991163]],["@metamask/test-dapp-solana>@solana/wallet-standard-chains",[826167]],["@metamask/transaction-controller",[102368,10723,122153,143621,150781,163876,167513,168579,172554,184279,190941,219387,223780,226948,243465,255130,256220,256481,297156,303725,312429,32176,331762,345217,350653,365843,366506,375971,384673,389330,397293,408437,422209,426567,452594,452698,470640,484443,495689,505685,507459,507922,511419,533012,539422,542439,553068,556714,563362,563790,570025,580295,590455,599848,603103,605114,620277,642966,646157,651209,71779,74043,746272,761793,764250,770521,777997,786235,787291,795431,8223,823388,829376,834217,844803,845099,853808,859933,866756,872,873218,889953,895920,901820,907895,907895,907895,922203,923607,923772,931691,95787,976028,978307,990826,99654]],["@metamask/transaction-controller>@metamask/controller-utils",[162697,310903,42374,45489,563423,946958]],["@metamask/transaction-controller>@metamask/gas-fee-controller",[441537,470187,487981,603690,925191,994362]],["@metamask/transaction-controller>@metamask/gas-fee-controller>@metamask/polling-controller",[294237,489668,791207,855452]],["@metamask/transaction-controller>@metamask/gas-fee-controller>@metamask/polling-controller>uuid",[109446,290784,300277,548724,570483,654847,68579,730243,751936,918948]],["@metamask/transaction-controller>@metamask/gas-fee-controller>uuid",[128431,142862,167140,28595,384635,594322,666078,788618,932633,950650]],["@metamask/transaction-controller>@metamask/nonce-tracker",[203385,71290,775896,877795]],["@metamask/transaction-controller>bignumber.js",[580891,717341]],["@metamask/transaction-controller>uuid",[150751,182062,208683,211435,330889,410137,432941,507521,526689,600106,737371,813542,816583,828297,902979,910522]],["@metamask/transaction-pay-controller",[114362,13620,154795,177235,182719,183591,18850,190116,223033,233209,248210,266722,298997,308615,338084,348014,377432,399984,401291,40596,405984,406137,42724,439797,457324,459661,475546,513559,516395,527565,532083,532611,537470,537625,544506,548898,568780,57966,579870,598778,606009,620775,666890,683193,687891,688113,710449,715130,71599,724150,744967,754138,768077,771530,777154,780032,815198,830037,842755,848932,861762,890439,900104,907122,911805,941138,952445,955666,969102,978248,979772]],["@metamask/transaction-pay-controller>@metamask/controller-utils",[434554,558781,830806]],["@metamask/transaction-pay-controller>@metamask/ramps-controller",[775105]],["@metamask/transaction-pay-controller>bignumber.js",[951082]],["@metamask/tron-wallet-snap",[500994]],["@metamask/user-operation-controller",[137553,143344,201013,308951,341048,427635,509105,581410,655532,923672,949040,992425]],["@metamask/utils",[11423,119972,137967,141595,141595,141595,14985,15451,17108,18969,18969,18969,191753,191753,223959,223959,223959,276184,300508,300508,30802,30802,30802,363216,511095,511095,511095,518129,518129,518129,526260,52941,542455,544174,544174,544174,549761,566925,578044,578044,578044,587150,587150,587150,587205,621407,658269,658269,658269,724740,724740,724740,748245,748245,748245,751661,753405,753405,761564,764631,764631,764631,768224,768224,768224,768876,768876,768876,82567,82567,854006,854006,854006,928736,938674,939430,957283,998857]],["@metamask/utils>pony-cause",[178430,178430,178430,546899,762565,762565,762565,878070]],["@metamask/wallet",[13103,15571,220827,269697,453059,468631,486883,545415,585007,59251,646205,680423,70923,710007,740527,770630,779291,786165,789259,826353,833551,856107,884775,893686,903315,919630,93795,941587,944483,955755]],["@metamask/wallet>@metamask/address-book-controller",[131178]],["@metamask/wallet>@metamask/approval-controller",[206373,892157]],["@metamask/wallet>@metamask/claims-controller",[210293,406843,649999,691034,810617,981320]],["@metamask/wallet>@metamask/connectivity-controller",[649585,799233]],["@metamask/wallet>@metamask/controller-utils",[221549,312700,370840,582921,857300,876443]],["@metamask/wallet>@metamask/controller-utils>@signinwithethereum/siwe-parser",[838284]],["@metamask/wallet>@metamask/controller-utils>bignumber.js",[553149]],["@metamask/wallet>@metamask/gas-fee-controller",[8952,949349,96765]],["@metamask/wallet>@metamask/gas-fee-controller>@metamask/polling-controller",[224514,540951]],["@metamask/wallet>@metamask/shield-controller",[214221,279571,685432,838982,857101]],["@metamask/wallet>@metamask/shield-controller>@metamask/signature-controller",[728596]],["@metamask/wallet>@metamask/storage-service",[132012,774191,967615]],["@metamask/wallet>@metamask/subscription-controller",[175733,314297,349327,363674,3749,402739,573002,593480,609267,681548,757700,927655,988159]],["@metamask/wallet>@metamask/subscription-controller>@metamask/delegation-deployments",[25130]],["@metamask/wallet>@metamask/subscription-controller>@metamask/money-account-utils",[80616,987375]],["@mui/material",[104312,11577,11847,127519,131770,133546,133610,134295,138369,149615,153167,156273,157655,162330,165360,166451,167754,167889,178627,181078,181235,189302,191831,203048,210303,226316,236307,255651,259731,26139,2653,282411,301846,307879,310781,313877,324435,332447,332703,336669,341331,35299,35395,365663,368447,370166,378470,379241,38422,398360,412251,413825,416935,425277,431563,436002,440400,450283,452141,454296,465673,471225,473091,479487,501597,514651,519621,531344,538827,548057,551018,55753,569241,57703,578155,57903,590551,591867,597805,599115,6059,609711,61123,614039,624277,62485,632116,640422,641503,648848,654282,656872,661831,663415,66571,671692,676437,678803,682879,685075,689227,700221,714326,715498,767335,768420,812063,818175,819181,822498,834867,836235,852735,860482,867615,879514,886401,895557,901045,90255,909476,91357,917195,920763,925855,928405,933304,94413,945520,945831,955653,963413,965979,97417,989167,989507,991447,999946]],["@mui/system",[112307,157747,170487,223596,260499,292499,337791,382928,508125,51009,518028,521462,559495,571389,573633,613431,627531,740860,75139,752367,759456,767479,768766,773517,800001,801105,828135,87567,884047,901626,927296,961052,967443,97900]],["@mui/system>@mui/private-theming",[57094,573456,603025,82634]],["@mui/system>@mui/styled-engine",[184884,472395,669950]],["@mui/system>@mui/utils",[103354,184229,1975,20613,214359,230793,246517,282805,291577,305397,319,331467,331569,394779,418965,439189,448157,486545,487849,498525,503031,510163,540913,554911,557889,599139,632271,650543,711433,727645,768304,781887,79181,843102,850845,856709,875719,902965,958525,991061,996063]],["@mui/system>@mui/utils>react-is",[254918]],["@mui/x-date-pickers",[10168,10283,109947,111395,122804,123803,124083,126836,129352,135,137138,143620,14500,193795,207533,217914,232699,236e3,240425,252109,253626,256113,276833,28014,282147,286591,291798,296702,297337,299813,306965,312931,31307,31610,324552,347478,360213,367588,371017,373436,407675,409265,427557,428868,43945,439705,449361,450172,456280,462684,465385,471109,472329,475479,481776,493444,495730,509819,516586,531919,535112,549645,559442,560807,57035,575472,575759,576361,591276,613923,621225,62313,636789,637605,644658,645967,664886,684598,696035,696877,722351,731545,735574,743304,748043,76734,777039,79095,794182,794335,797343,802198,802583,804689,807381,81821,836036,837819,842867,844151,847094,860107,861581,864041,868232,872762,881645,883161,888956,903160,904440,909821,916237,918664,922167,922940,923449,92574,931514,939733,946300,948710,983447,984247,995814]],["@mui/x-date-pickers>@mui/utils",[119651,197021,248723,261091,302419,340611,352023,365965,48343,529819,586991,63207,646853,676243,677617,73013,77457,789905,803499,86397]],["@ngraveio/bc-ur",[10198,127443,216814,334683,347103,407755,42514,440515,441576,470363,526436,585651,605041,608778,615564,669916,677855,715987,757072,777518,816060,912490,916561,94803]],["@ngraveio/bc-ur>@keystonehq/alias-sampling",[815543,836484]],["@ngraveio/bc-ur>assert",[100734,100734,100734,110254,158196,158196,158196,215851,215851,215851,276499,392615,528896,784333,784333,784333]],["@ngraveio/bc-ur>assert>is-nan",[157383,223141,247643,247643,247643,277973,277973,277973,461010,461010,461010,603758,882710,924544,924544,924544]],["@ngraveio/bc-ur>assert>object-is",[129730,129730,129730,16056,331205,331205,331205,345247,370244,628587,628587,628587,827856,827856,827856,919581]],["@ngraveio/bc-ur>bignumber.js",[107456,574149]],["@ngraveio/bc-ur>cbor-sync",[632362,863475]],["@ngraveio/bc-ur>crc",[117977,136322,164719,173976,217684,219649,232409,274359,355276,389601,457640,520173,524523,538289,633555,640716,683775,739574,761450,76520,825036,852556,858449,871860,878551,888882,946884,94905]],["@ngraveio/bc-ur>crc>buffer",[690678,797843]],["@ngraveio/bc-ur>jsbi",[233128,847743]],["@ngraveio/bc-ur>sha.js",[112801,132806,132806,132806,158146,158146,158146,211859,240184,240184,240184,266803,36036,363368,363368,363368,381195,381195,381195,576585,576585,576585,588986,588986,588986,627106,740154,774747,774747,774747,893961,948953]],["@ngraveio/bc-ur>sha.js>to-buffer",[407116,715425,715425,715425]],["@noble/ciphers",[101476,111073,179606,330590,50599,55527,562386,697680,780376,85518,872133,910068,958071]],["@noble/curves",[140552,145779,177937,17902,195015,215644,240960,275316,322394,357764,36773,413796,419797,425930,446266,470978,539817,578933,58340,589072,600124,610537,610911,625658,792499,824778,905407,927500,956501]],["@noble/hashes",[128961,128961,128961,158357,216243,237402,251754,279307,282974,318449,344524,344863,362108,367013,38578,399502,399502,399502,41903,462900,469688,477964,477964,477964,478639,496064,496153,496153,496153,505886,551278,553668,661330,661330,661330,671955,671955,671955,672780,716070,716070,730375,737542,769570,770999,777636,810410,82357,844842,85428,857074,943940,943940,945794,975651,975651,984530,993173,994550]],["@open-rpc/meta-schema",[513412]],["@open-rpc/schema-utils-js",[410241,517545,859138]],["@open-rpc/schema-utils-js>@json-schema-tools/dereferencer",[313518,627554]],["@open-rpc/schema-utils-js>@json-schema-tools/dereferencer>@json-schema-tools/traverse",[282562]],["@open-rpc/schema-utils-js>@json-schema-tools/meta-schema",[98602]],["@open-rpc/schema-utils-js>@json-schema-tools/reference-resolver",[350138,399262,476835,695517,733650]],["@open-rpc/schema-utils-js>@json-schema-tools/reference-resolver>@json-schema-spec/json-pointer",[648777]],["@open-rpc/schema-utils-js>is-url",[831330]],["@open-rpc/test-coverage>isomorphic-fetch",[971115]],["@open-rpc/test-coverage>isomorphic-fetch>whatwg-fetch",[337329]],["@popperjs/core",[104262,120185,131500,134115,149922,172285,183817,201918,206556,218858,226744,25019,262272,289140,302530,326635,330629,335526,33565,351475,3598,400267,492560,50696,513223,532874,553918,568598,589833,638543,659638,674110,680243,70361,750319,757155,762019,773577,790791,794063,814127,815258,818832,826916,843022,864542,872787,886298,891016,908905,925448,947862,954239,978752]],["@reduxjs/toolkit",[55820]],["@reduxjs/toolkit>reselect",[317341,93958]],["@rive-app/react-canvas",[913965]],["@rive-app/react-canvas>@rive-app/canvas",[236494,236494,236494,236494,236494,888132]],["@scure/base",[54584,54584,54584,75640]],["@segment/analytics-node",[114292,135879,163263,173925,182386,232806,23300,279322,300126,32883,335978,340597,34948,374517,415566,420552,422712,423275,436490,444519,449889,499454,513601,521632,537071,599541,617928,653229,668435,677885,679751,703484,744764,784915,808671,810290,86389,881020,885160,950625]],["@segment/analytics-node>@lukeed/uuid",[43220,650476]],["@segment/analytics-node>@segment/analytics-core",[102925,122822,12916,160021,171519,184523,201210,207015,215256,2368,243329,265654,274166,299891,395707,416644,463599,482259,534481,549325,58131,599055,681279,706813,70932,781258,799074,839404,858693,863234,901844,946716,956877,978616,987212,996346]],["@segment/analytics-node>@segment/analytics-core>dset",[433864,680712]],["@segment/analytics-node>@segment/analytics-generic-utils",[432482,693142,927339,958351]],["@segment/analytics-node>jose",[113566,157827,168315,199954,215815,245079,248013,27314,295902,315363,324589,344550,351150,358409,377316,381180,430950,444746,450049,456598,473539,48534,518820,563118,58512,587182,589067,589507,621843,622310,684493,689825,694072,71284,723862,727785,747809,75377,785269,79719,835002,839195,842080,858552,864833,891637,914849,934567,947596,957879,974076,99230]],["@sentry/browser",[106484,106484,121744,121744,124675,13623,152254,152660,156081,164928,164928,165362,165362,167467,172275,172275,173368,179687,19727,2033,204399,204399,214536,214536,22674,22674,276880,281977,281977,320160,320160,321437,321437,329055,331990,331990,33632,33632,354281,354281,361508,381324,384984,384984,390076,390076,402702,404809,43114,43114,444971,453827,478535,478535,484413,487419,487419,501757,501757,504399,523152,523152,532344,543411,543411,548502,563310,563310,566078,570181,574003,574003,5937,5937,609495,609495,611865,611865,64329,643814,650110,650110,65366,65366,681853,686791,686791,691576,703138,718191,718191,73075,73075,747170,760538,760538,762975,762975,774791,774791,791729,791729,793052,793052,79931,800440,800440,805677,816291,816291,821299,821299,841456,85422,85422,855790,879010,879010,885305,885436,889613,889613,889843,89899,899341,899341,928751,928906,953524,956902,972599,972599,972991,993039,994398]],["@sentry/browser>@sentry-internal/browser-utils",[104168,104168,117127,117127,117529,117529,12796,12796,132076,132076,133481,133481,138716,153799,153799,184748,184748,185335,185335,185746,185746,19467,225669,225669,234512,234598,234598,238559,238559,259463,259463,303818,303818,310529,310529,314408,327140,327140,33040,3321,339535,417860,417860,456247,459517,459517,495242,495242,51450,515400,528962,528962,533858,533858,566632,56680,57324,580436,599534,599534,604160,604160,617067,617067,621827,662925,676979,681747,681747,694581,694581,702053,71337,714599,714599,74342,756025,756025,764651,764651,765698,768571,772879,793419,814601,821396,847768,858586,858586,863531,863531,879954,882555,882555,898026,898026,903217,913111,932294,932294,944117,945582,956354,956742,956742,958084,963334,963334,975431,978802,993671]],["@sentry/browser>@sentry-internal/feedback",[178066,666012,666012]],["@sentry/browser>@sentry-internal/replay",[117172,117172,949306]],["@sentry/browser>@sentry-internal/replay-canvas",[928535,928535,986415]],["@sentry/core",[100873,104403,104403,105388,105388,114765,118644,118840,122411,123532,125617,125617,127022,127022,128485,128485,136244,136244,14072,140722,140722,144770,145834,145834,147687,151011,151011,152198,153836,15505,155682,155682,156398,15797,160312,160312,161562,161562,16278,16278,16462,16462,166105,16686,16686,169869,17072,172900,173177,173177,173345,173345,175384,178061,178130,178130,179184,179184,180121,180739,180739,187474,187763,187763,18898,189193,191895,191895,192279,192279,195612,195612,198066,198066,19891,200019,20945,20945,233817,233817,236175,236175,240647,240647,242391,242391,24708,24708,248609,248609,253523,253523,254759,254759,257357,257357,260516,26584,26584,267276,267276,276277,276277,276435,285459,286343,286343,290134,290134,290264,290264,294970,295088,298556,303065,306981,334726,334726,342741,351996,351996,352158,352745,352745,356313,356313,357180,358496,377271,381699,392316,396102,39859,400273,400273,403378,403378,404770,404770,405971,405971,410464,410464,410710,411335,419142,425294,426886,426886,427581,43701,441227,441227,444284,456403,463580,466737,468417,476745,476745,480303,480303,484945,486023,488560,488897,488897,503053,503053,503206,503206,504855,506820,509279,513234,5152,516223,516223,516431,516431,518727,52018,525162,528713,528713,532725,532725,532756,532756,533837,533837,534098,534098,537464,537464,538979,545407,546155,550664,550866,563023,567074,567074,571268,573091,573091,576883,577102,579010,584222,584222,587044,587044,590041,597014,597014,59824,598723,599573,599573,60184,60184,603373,605816,608119,608119,612717,620697,620772,625919,627413,627413,631918,631918,632356,636534,637748,637748,641729,641729,643826,643826,646083,646083,646093,65251,65251,652751,658257,659976,660483,660483,663834,664746,665016,671480,676108,67904,67904,67912,679351,679356,679356,682631,686595,691963,691963,6929,702742,702742,704776,707808,707808,709356,711403,713966,71409,71409,717231,717231,718385,718385,718800,718800,719509,719509,724666,724666,729815,729815,730074,730074,734289,734289,735784,735784,736733,737010,737010,762018,762018,764006,764006,76427,76427,765695,765695,76838,76838,768881,768881,778552,78463,788241,79203,793111,793111,802518,802518,808106,808106,812842,812842,812863,812863,818747,818747,827284,828564,828564,836164,836164,837113,843379,843379,844822,844822,848294,848795,858481,86429,86429,864807,865961,866319,866319,868307,868307,87776,879085,879085,881167,881167,881635,881635,882688,882688,884405,884405,889462,889736,889736,901814,901814,901889,902309,902470,903226,903226,910140,910140,911216,917009,920938,920942,921305,921305,92376,92376,925075,928431,928431,931263,933190,933190,934379,939543,943924,944887,948643,95069,95069,960196,960196,960767,96219,96219,96331,96331,968721,968721,973234,973234,98154,986746,986746,991688,997858]],["@simplewebauthn/browser",[134797,173983,216354,311050,322193,345592,454807,50783,537185,600306,80287,891367,931567,955988]],["@solana/addresses",[164047,500089,500089,500089]],["@solana/addresses>@solana/codecs-core",[531837,531837,531837,723771]],["@solana/addresses>@solana/codecs-strings",[654344,726472,726472,726472]],["@solana/addresses>@solana/errors",[410059,410059,410059,780217]],["@tanstack/react-query",[105195,217002,21949,268708,374795,401021,525686,783325,827530,94742]],["@tanstack/react-query>@tanstack/query-core",[101148,128197,156121,161171,202888,203094,220168,301866,317159,346991,358746,382985,397849,439038,455135,545476,545940,585839,637584,638423,658570,6592,667857,679660,687070,718390,723159,747931,748346,785697,788309,846127,855729,97691,983043]],["@tanstack/react-virtual",[207896]],["@tanstack/react-virtual>@tanstack/virtual-core",[282889,737520]],["@toruslabs/eccrypto",[613749]],["@toruslabs/eccrypto>elliptic",[13856,16264,174705,206133,206133,206133,311850,31289,31289,31289,33103,385483,385483,385483,431844,431844,431844,439410,439410,439410,504136,505841,505841,505841,506849,520526,520526,520526,56160,56160,56160,57363,595344,595344,595344,598866,598866,598866,627030,62710,671066,671066,671066,754561,756924,756924,756924,831370,834229,834229,834229,847297,915125,917768,917768,917768,917768,917768,917768,917768,917768,917768,917768,938376,975115,97907,97907,97907,995991,995991,995991]],["@toruslabs/eccrypto>elliptic>brorand",[29360,700493,700493,700493]],["@toruslabs/eccrypto>elliptic>hmac-drbg",[178403,178403,178403,467286]],["@toruslabs/eccrypto>elliptic>minimalistic-assert",[147749,147749,147749,579424]],["@toruslabs/eccrypto>elliptic>minimalistic-crypto-utils",[178175,178175,178175,288762]],["@trezor/connect-web",[149934,161947,209064,264637,302088,353076,416962,448771,475227,511005,549365,577703,676994,777401,778803,802974,819815,833940,883249,925614,932425,942600,948414,949662]],["@trezor/connect-web>@trezor/connect",[102356,104752,108752,110145,113801,11766,122517,12260,151165,15811,195279,203181,266718,274388,283080,291552,291598,300706,310250,312737,314251,324564,329191,3467,347648,381398,38310,390491,39245,399160,40275,40574,416188,419495,43960,450719,458572,459154,499050,507351,515009,531360,565501,567771,574206,612950,63117,631525,636408,640660,644936,646784,653595,659703,686693,699158,699779,700328,715952,723595,728359,740975,763543,765486,767847,773642,792108,794554,799799,823473,832029,841885,842718,843037,845438,847e3,85307,854377,860263,869276,876101,878923,879212,880529,896867,900998,912960,92633,941442,945725,947269,95052,960805,965279,989202,996616]],["@trezor/connect-web>@trezor/connect-common",[1424,32142,323221,439606,457455,494623,556102,867503]],["@trezor/connect-web>@trezor/connect-common>@trezor/env-utils",[156541,254129,410764,53958,759514,903021]],["@trezor/connect-web>@trezor/connect-common>@trezor/env-utils>ua-parser-js",[266523,959498]],["@trezor/connect-web>@trezor/connect>@trezor/blockchain-link>@trezor/websocket-client",[34818,47679,487483,664255,735898,98162]],["@trezor/connect-web>@trezor/connect>@trezor/device-utils",[141965,292761,358991,389452,406597,472650,526170,586775,626392,824082,856220,860193,886318,913937]],["@trezor/connect-web>@trezor/connect>@trezor/protobuf",[108069,131253,192040,244192,289533,311145,326711,352879,534276,669094,783184,806218,969356,974893]],["@trezor/connect-web>@trezor/connect>@trezor/protobuf>long",[154388,229996]],["@trezor/connect-web>@trezor/connect>@trezor/schema-utils",[122668,189121,212317,261702,318930,342180,36195,463685,479101,508198,585053,659995,736876,754128,948506,979693]],["@trezor/connect-web>@trezor/connect>@trezor/schema-utils>@sinclair/typebox",[10071,100733,103796,107091,110922,115647,117177,118003,118011,119200,12572,133648,137135,141248,141584,141594,146496,147967,149264,149457,150650,156134,159565,164639,16791,168041,169535,169820,170758,171039,172991,174218,177386,178860,18600,188342,192669,194706,196624,200299,201099,206718,208399,213208,214286,216042,216167,216342,219050,221172,229784,229971,231358,234780,237875,238197,239055,239058,239258,239520,242637,24284,245249,246721,253578,255176,257519,257695,25789,260556,261111,265631,266452,268431,268908,271739,274396,27684,286312,286836,294615,300644,301031,303504,304363,305481,307704,309754,31199,317312,318295,31989,32976,329881,331519,331682,335570,336021,339102,33953,341314,343978,345058,345602,345945,34641,346487,349811,351009,355743,359094,363143,363296,364835,367026,367636,369119,369736,370059,371543,373225,379348,380175,381147,382219,383298,387371,390099,390622,393392,394828,397474,397532,40186,405919,406295,407224,407776,407881,408619,409603,409783,410500,412896,413523,415519,415827,417672,418942,419688,419792,421427,425782,428561,430096,430971,432312,433803,436271,438240,442473,445592,446330,447676,448635,449839,449922,451164,454835,455429,464960,465701,469696,471615,472977,473496,481167,48182,482649,48745,488767,489560,491881,49269,49638,503150,503156,50320,504217,50501,505749,50615,50686,508463,50892,51069,510979,51314,51590,516104,5168,523517,525219,526787,52776,528627,538011,538649,54028,547533,549475,557183,559146,559614,560885,561224,561555,562097,562257,565490,568209,572055,573886,575085,575449,57744,583492,586736,588569,596773,605452,606394,607170,607971,608002,608015,610442,612376,613762,621097,6215,630094,630448,63092,630960,632188,634166,635421,637094,638924,64079,641768,645032,652547,652606,655535,657502,664900,665066,665447,668354,668464,670079,671534,672327,673763,673921,67488,680644,681765,683687,683876,684089,685526,687123,687162,688581,689850,691341,698063,708137,709621,712099,717272,717686,718600,719546,720281,725168,729280,729801,731968,732863,747175,747896,750164,751934,753591,755722,757749,758657,759810,760170,760233,761770,767104,767337,769314,772102,777620,778184,778693,780967,781247,788247,788763,790596,791780,792063,795935,796256,798959,804806,806053,808643,810711,813740,813970,814691,8156,815755,820985,823515,824683,826014,826080,826176,834141,836330,836552,842900,843683,845106,845734,846752,848123,848245,850066,851479,853339,854521,855857,857713,859079,859375,860424,861799,86775,868260,870992,874026,876464,878559,880937,886114,888556,888891,891552,892408,893015,896175,897077,897100,897851,901930,904720,905518,906404,908251,913407,917151,918597,921299,925046,927174,929194,929295,93690,937600,94468,944998,951275,953624,955550,955668,95586,957389,96495,971233,972457,972516,976667,979282,980367,980539,988942,99035,994868,994890,996108,996407,99695]],["@trezor/connect-web>@trezor/connect>@trezor/transport",[10733,825912]],["@trezor/connect-web>@trezor/utils",[105122,10919,114422,118452,121596,126632,140895,147039,151988,152458,163960,168562,169,183583,193114,19345,200971,214941,240990,243683,245471,279971,288252,29281,297908,300795,303251,309599,312634,312898,31374,315922,317344,317668,3283,360391,377702,386474,38717,391697,402625,413391,422349,468313,473116,485286,486057,488143,504558,507929,510717,514914,524017,531436,540608,547102,551151,557099,562303,582966,598574,600242,603297,606149,608262,610477,618189,618301,623666,635766,639474,641718,642137,648889,662552,671958,673885,682727,683481,686691,700160,700816,702946,706191,707446,707804,719025,742497,746311,748577,755685,763770,773861,777833,792310,803866,805328,813058,813155,814213,815236,81812,827145,838364,842779,853776,857425,860442,863786,864786,897150,948037,959930,961652,961998,97101,977779,97924,98944,999764]],["@trezor/connect-web>@trezor/utils>bignumber.js",[457590,549083]],["@zxing/browser",[145953,147414,301448,342264,585117,594168,657902,717209,729074,754576,855256,877446]],["@zxing/library",[102076,104640,105846,10967,118907,130552,131671,135525,13619,137253,147843,148535,157062,161840,162502,165773,173036,177378,177605,181600,182358,1880,192328,200985,204042,211185,214711,217403,220502,222151,225176,226658,226843,231804,245348,245586,256598,265347,267647,281891,283130,283402,290294,290552,292589,30383,305577,30700,312627,313691,318681,322242,326170,330187,33047,331102,342062,344837,344937,348944,350023,350110,353827,35702,358354,36393,364077,366804,367456,37933,382336,38382,384185,389157,391484,395347,398079,398319,403738,410854,413135,414480,420387,426748,429613,447649,448751,448788,452848,454274,467294,470216,475173,476225,480383,48100,4886,490735,491694,495292,511410,512766,51355,517495,520474,524483,533622,543903,545034,550786,5641,567973,568293,576257,579657,58251,595812,599545,602724,604879,605398,606450,608296,618081,618221,628824,628900,633971,633978,636179,638450,639014,643367,643977,651233,659159,66029,670237,674724,689980,690012,693466,696602,696739,701767,702808,70813,7139,715814,717651,720949,723205,726724,731223,731411,73343,734567,739843,744838,754217,762947,764246,770429,77429,781645,795293,805428,805970,809671,810595,812056,812169,826170,845566,84931,849943,853708,862070,863850,865388,879385,881821,887588,887774,888951,895334,902900,907072,923877,935419,935949,939171,943402,946912,959134,96263,964206,966391,972327,978368,980892,981228,992729,993255,993733,99546,996484]],["@zxing/library>ts-custom-error",[325932]],["addons-linter>deepmerge",[239016,239016,239016,494597]],["async-mutex",[126335,1310,34965,350288,424657,460177,553002,563013,570659,718686,906263,936631,946806,983482]],["base32-encode",[564541]],["base32-encode>to-data-view",[947064]],["base64-js",[223159,237877,685590,685590,685590]],["bignumber.js",[60746,60746,60746,964655]],["bitcoin-address-validation",[262686,272909,272909,272909]],["bitcoin-address-validation>bech32",[140322]],["bowser",[598640,598640,752049]],["browserify>concat-stream>buffer-from",[30445]],["browserify>concat-stream>typedarray",[467969]],["browserify>has>function-bind",[384002,500185,500185,500185,819495,819495,819495,86170]],["browserify>string_decoder",[242714,698800,938453,938453,938453]],["browserify>url",[558163,873290]],["browserify>url>punycode",[546495,646246]],["browserify>util",[199472,204191,204191,204191,333961,333961,333961,642801,807928,807928,807928,852144]],["browserify>util>is-arguments",[785857,790588,790588,790588]],["browserify>util>is-generator-function",[386015,664264,664264,664264]],["browserify>util>is-typed-array",[242256,242256,242256,588421]],["browserify>util>which-typed-array",[708759,708759,708759,860610]],["browserify>util>which-typed-array>for-each",[541290,541290,541290,580911]],["browserify>xtend",[445334,445334,445334,45329]],["bs58",[121295,753815,982157]],["bs58>base-x",[452885,772079,908463]],["buffer",[387920,916794,971567,971567,971567]],["buffer>ieee754",[170059,170059,170059,305992,795926]],["chalk",[289568,353616,550169,620047,675473,995050]],["chalk>ansi-styles",[317566,780723]],["chalk>ansi-styles>color-convert",[179422,286427,395354,511073,585797,969867]],["chalk>supports-color",[469146,898797]],["chart.js",[137490,464071]],["chart.js>@kurkle/color",[283251]],["clsx",[92288]],["cockatiel",[119008,132427,142081,229411,229411,229411,266536,286985,286985,286985,301137,324161,324161,324161,36228,380736,380736,380736,424918,492012,496021,496021,496021,50519,50519,50519,507271,507271,507271,519577,519577,519577,544190,595527,606424,606424,606424,66690,690468,690468,690468,737081,755020,755020,755020,791579,791579,791579,826572,826585,826585,826585,836604,836604,836604,86131,869397,91588,921466,962708,973053,991321,991321,991321]],["core-js-pure",[105436,120990,120990,120990,126725,12759,12759,12759,129272,137203,151859,151859,151859,158e3,18656,188366,188366,188366,194094,194094,194094,20560,20560,20560,207845,207845,207845,227267,227607,227607,227607,251242,2530,258224,258224,258224,25884,25884,25884,264629,26932,270856,277064,277064,277064,277389,277389,277389,278892,278892,278892,279840,286840,303606,303606,303606,305727,305727,305727,308832,31814,330035,330035,330035,330636,330636,330636,347527,347599,347599,347599,35086,35086,35086,352945,353883,353883,353883,354189,356579,356579,356579,359997,360330,360330,360330,370579,370579,370579,372433,392512,39718,400874,400874,400874,407322,407322,407322,413491,413491,413491,42848,42848,42848,449294,45914,465210,465210,465210,468876,468876,468876,485365,485365,485365,495678,497108,502337,506546,508591,508591,508591,518976,532810,536708,536708,536708,54840,54840,54840,551946,55696,55696,55696,562061,562352,57343,576773,576773,576773,579725,58616,587510,587510,587510,613408,613408,613408,646878,646878,646878,655559,655559,655559,662482,662482,662482,665216,665216,665216,666050,666050,666050,671814,673319,673319,673319,702630,702630,702630,706080,718422,719418,719418,719418,726335,739256,739256,739256,741560,747440,747440,747440,747601,748841,748841,748841,750338,752223,752223,752223,770833,77614,777274,782214,782214,782214,788100,792385,792385,792385,804550,811989,827764,828095,828095,828095,850958,850958,850958,856768,856768,856768,878832,878832,878832,880912,884024,884024,884024,885109,885109,885109,895202,895202,895202,897744,907471,907471,907471,913653,927049,927773,928937,928937,928937,945814,958467,965413,966053,972435,978775,978775,978775,985456,985456,985456,995454]],["cron-parser",[180793,212712,433256,439869,495081,528063,631724,796683,814724,843470]],["crypto-browserify",[554365,745856]],["crypto-browserify>browserify-cipher",[473156,647133]],["crypto-browserify>browserify-cipher>browserify-des",[213314,419175,769094,925511]],["crypto-browserify>browserify-cipher>browserify-des>des.js",[104109,127821,216938,289008,398216,609466,679344,699112,731279,762931,803859,899967]],["crypto-browserify>browserify-cipher>evp_bytestokey",[626238,774347]],["crypto-browserify>browserify-sign",[184715,184715,184715,184715,184715,184715,184715,210639,330169,364172,370063,373124,540311,634624,643038,661841,661841,661841,661841,661841,661841,661841,750771,791887]],["crypto-browserify>browserify-sign>readable-stream",[207368,221737,24961,338149,34862,389274,400143,49634,501565,520109,542596,579432,728536,85840,882487,892947,923357,954630]],["crypto-browserify>browserify-sign>readable-stream>isarray",[287141,828544]],["crypto-browserify>browserify-sign>readable-stream>safe-buffer",[228612,530523]],["crypto-browserify>browserify-sign>readable-stream>string_decoder",[240696,813931]],["crypto-browserify>browserify-sign>readable-stream>string_decoder>safe-buffer",[66,791641]],["crypto-browserify>create-ecdh",[65084,856947]],["crypto-browserify>create-hmac",[209475,718853,799678,954968]],["crypto-browserify>diffie-hellman",[248663,487876,53365,53365,53365,53365,53365,53365,53365,574293,678158,7702,776323,982225]],["crypto-browserify>diffie-hellman>miller-rabin",[434884,898823]],["crypto-browserify>pbkdf2",[2216,303271,42113,428172,504301,590683,626730,696696,763227,822303,86900,910166]],["crypto-browserify>public-encrypt",[139006,228597,431798,437355,574303,576758,584160,658759,689162,889634,92793,97677]],["crypto-browserify>public-encrypt>browserify-rsa",[172788,23717]],["crypto-browserify>public-encrypt>parse-asn1",[176150,455901,622547,657421,704002,740100,756021,890535,890535,890535,890535,890535,890535,890535,910026,996481]],["crypto-browserify>public-encrypt>parse-asn1>asn1.js",[147352,208103,30820,326570,335890,354951,42905,430576,471853,486602,502048,540274,542561,561461,561813,575188,592225,597323,600205,61716,626144,728554,735793,804506,8083,853593,933023,964662]],["crypto-browserify>randombytes",[883369,883369,883369,906516]],["crypto-browserify>randomfill",[654168,96103]],["currency-formatter",[160041,187270,758533,758533,758533,758533,758533,888624,888624,888624,888624,888624]],["currency-formatter>accounting",[241927]],["currency-formatter>locale-currency",[789077,802055]],["deep-freeze-strict",[627685,627685,627685,703498]],["dompurify",[88174]],["duplexify>inherits",[389629,509847,985738,985738,985738]],["eciesjs",[185661,367701,470884,517408,541560,687391,721017,855423,867881,939891,97856]],["eciesjs>@ecies/ciphers",[264220,70429]],["eslint-plugin-react>array-includes>is-string",[118857]],["eslint-plugin-react>array-includes>math-intrinsics",[23605,439486,439486,439486,512902,568095,608107,608107,608107,620455,662346,662346,662346,687135,712281,742296,742296,742296,779452,779452,779452,79565,877e3,877e3,877e3,963098,963442,963442,963442,96533,96533,96533]],["eslint-plugin-react>es-iterator-helpers>has-property-descriptors",[584368,584368,584368,695605]],["eslint-plugin-react>es-iterator-helpers>has-proto>dunder-proto",[385877,826936,826936,826936]],["eslint-plugin-react>hasown",[464178,704149,704149,704149]],["eslint>ajv",[147172,159721,16295,170097,19949,21581,226861,282833,289148,327767,349128,352705,355338,360178,377397,398680,408145,447226,4537,461238,492109,551155,557638,55850,595687,600286,673936,67713,678772,685283,729835,837021,853174,859414,861933,871063,895411,931967,955642,967140,977228,978651]],["eslint>ajv>json-schema-traverse",[520702]],["eslint>fast-deep-equal",[170210,299808,932993,932993,932993]],["eslint>json-stable-stringify-without-jsonify",[782636]],["eth-chainlist",[275821,39576,405219,445016]],["eth-ens-namehash",[489676,558791,558791,558791]],["eth-ens-namehash>idna-uts46-hx",[160106,593891,593891,593891,683712,683712,683712,841305]],["eth-ens-namehash>idna-uts46-hx>punycode",[33245,33245,33245,407262]],["eth-ens-namehash>js-sha3",[227864,227864,227864,889709]],["eth-lattice-keyring",[404107]],["eth-lattice-keyring>@ethereumjs/util",[136989,175611,209374,289743,31791,347350,401587,441433,513949,516751,647123,68093,798648,896464,932413]],["eth-lattice-keyring>@ethereumjs/util>@ethereumjs/rlp",[782086]],["eth-lattice-keyring>@ethereumjs/util>ethereum-cryptography",[548920,85299,917064]],["eth-lattice-keyring>@ethereumjs/util>ethereum-cryptography>@noble/curves",[240253,383777,44186,477670,662780,728167,748501]],["eth-lattice-keyring>@ethereumjs/util>ethereum-cryptography>@noble/hashes",[1170,13639,583398,683528,717604,811517,919484,928960]],["eth-lattice-keyring>@ethereumjs/util>micro-ftch",[203639,69148]],["eth-lattice-keyring>gridplus-sdk",[723851]],["eth-lattice-keyring>gridplus-sdk>@ethereumjs/rlp",[169651,522074]],["eth-lattice-keyring>gridplus-sdk>aes-js",[782813,972828]],["eth-lattice-keyring>gridplus-sdk>bignumber.js",[143048,434255]],["eth-lattice-keyring>gridplus-sdk>bs58check",[376428,414825]],["eth-lattice-keyring>gridplus-sdk>cbor",[113870,166524,175853,270294,288958,37556,396826,439560,459229,481572,509208,513916,690170]],["eth-lattice-keyring>gridplus-sdk>cbor-bigdecimal",[390582]],["eth-lattice-keyring>gridplus-sdk>cbor>nofilter",[718497]],["eth-lattice-keyring>gridplus-sdk>crc-32",[128947]],["eth-lattice-keyring>gridplus-sdk>ox",[156642,327684,620641,623088,716750,750175,877372,93090]],["eth-lattice-keyring>gridplus-sdk>secp256k1",[411333,49261,945543]],["eth-lattice-keyring>rlp",[377343]],["eth-method-registry",[239820,243922,243922,243922,243922,243922,432999,438386,852032,852032,852032,852032,852032,89008]],["eth-method-registry>@metamask/ethjs-contract",[149490,158371,171151,327729,814390,924868]],["eth-method-registry>@metamask/ethjs-contract>@metamask/ethjs-filter",[436803,9590]],["eth-method-registry>@metamask/ethjs-contract>@metamask/ethjs-util",[73489,820764]],["eth-method-registry>@metamask/ethjs-contract>ethjs-abi",[424783,43470,452332,822873]],["eth-method-registry>@metamask/ethjs-contract>ethjs-abi>number-to-bn",[545984,608417]],["eth-method-registry>@metamask/ethjs-query",[47199,883348]],["eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format",[407843,658808]],["eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format>ethjs-schema",[130530,613122,613122,613122,613122,613122]],["eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format>is-hex-prefixed",[433028,433028,433028,780415]],["eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format>strip-hex-prefix",[140158,341529,341529,341529]],["eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-rpc",[401814,482131]],["eth-method-registry>@metamask/ethjs-query>promise-to-callback",[448483,587668]],["eth-method-registry>@metamask/ethjs-query>promise-to-callback>is-fn",[745755,754084]],["eth-method-registry>@metamask/ethjs-query>promise-to-callback>set-immediate-shim",[149156,408243]],["ethereum-cryptography",[208098,613701,664194,77405,945639]],["ethereumjs-util",[199060,229375,252494,260161,260161,260161,286982,349576,362242,362242,362242,405897,423693,441293,500520,500520,500520,512477,512477,512477,527514,527514,527514,556643,567856,567856,567856,57111,57111,57111,648297,671523,676190,7201,7201,7201,756854,756854,756854,801305,801305,801305,822020,822020,822020,850844,850844,850844]],["ethereumjs-util>bn.js",[416917,461532,461532,461532]],["ethereumjs-util>create-hash",[108619,492439,765236,765236,765236,825936]],["ethereumjs-util>create-hash>cipher-base",[372024,372024,372024,407403]],["ethereumjs-util>create-hash>md5.js",[689828,689828,689828,962913]],["ethereumjs-util>create-hash>md5.js>hash-base",[123287,206408,206408,206408,337073,368942,368942,368942]],["ethereumjs-util>create-hash>md5.js>hash-base>readable-stream",[138273,138273,138273,195995,241236,271873,271873,271873,295891,295891,295891,313481,313481,313481,349836,377502,377502,377502,492274,556543,556543,556543,646997,646997,646997,6626,703581,703581,703581,708830,708830,708830,731966,908596,943289,971662]],["ethereumjs-util>create-hash>md5.js>hash-base>readable-stream>isarray",[36029,36029,36029,767892]],["ethereumjs-util>create-hash>md5.js>hash-base>readable-stream>safe-buffer",[13672,680343,680343,680343]],["ethereumjs-util>create-hash>md5.js>hash-base>readable-stream>string_decoder",[477525,835454,835454,835454]],["ethereumjs-util>create-hash>md5.js>hash-base>readable-stream>string_decoder>safe-buffer",[329195,929944,929944,929944]],["ethereumjs-util>create-hash>ripemd160",[777899,777899,777899,946746]],["ethereumjs-util>create-hash>ripemd160>hash-base",[188184,188386,346203,346203,346203,56105,56105,56105]],["ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream",[223117,337639,357763,379370,379370,379370,43604,43604,43604,438430,438430,438430,493940,493940,493940,516851,516851,516851,567434,567434,567434,59225,634765,770028,770028,770028,779349,786589,816462,816462,816462,887380,952405,952405,952405,975832]],["ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream>isarray",[224612,224612,224612,483221]],["ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream>safe-buffer",[401136,401136,401136,666219]],["ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream>string_decoder",[169928,23207,23207,23207]],["ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream>string_decoder>safe-buffer",[146005,146005,146005,89938]],["ethereumjs-util>ethereum-cryptography",[110404,110404,110404,496988,496988,496988,519915,759953,894002,894002,894002,93915,95453,95453,95453,976081]],["ethereumjs-util>ethereum-cryptography>browserify-aes",[104667,120362,160855,166623,194324,316615,328328,339226,388844,425693,496770,508919,513885,522466,531017,564143,564395,569105,57155,579600,589543,589543,589543,589543,589543,589543,589543,626996,652708,70029,766738,782553,787881,825934,909099,958896,966121,966682,999384,999908]],["ethereumjs-util>ethereum-cryptography>browserify-aes>buffer-xor",[400492,64679]],["ethereumjs-util>ethereum-cryptography>bs58check",[224485,283092,328208,767265]],["ethereumjs-util>ethereum-cryptography>bs58check>bs58",[411447,921602]],["ethereumjs-util>ethereum-cryptography>keccak",[156187,188166,188166,188166,2560,2560,2560,289124,289124,289124,351903,399137,399137,399137,597833,599140,599140,599140,883926,883926,883926,937780,97631,978239]],["ethereumjs-util>ethereum-cryptography>keccak>readable-stream",[120656,141293,141293,141293,163083,200606,201271,234258,234258,234258,236194,236194,236194,261453,261453,261453,364924,364924,364924,427167,43819,43819,43819,507487,511022,527114,527114,527114,535004,535004,535004,576557,611239,611239,611239,618502,618502,618502,62895,716001,7176,7176,7176,722326,722326,722326,731291,731291,731291,751113,751113,751113,76524,786926,833699,833726,860185,972964,972964,972964]],["ethereumjs-util>ethereum-cryptography>secp256k1",[449222,459010,524053,524053,524053,634699,634699,634699,667525,667525,667525,75366]],["ethereumjs-util>rlp",[312945,724840,724840,724840]],["ethers",[100238,164293,49566,518459,60361,621453]],["ethers>@ethersproject/abstract-provider",[136854,211701,337985,445174]],["ethers>@ethersproject/abstract-signer",[230706,514118,642731,654687]],["ethers>@ethersproject/address",[243322,317262,421357,998381]],["ethers>@ethersproject/base64",[116728,384786,447309,893747]],["ethers>@ethersproject/basex",[445759,873202]],["ethers>@ethersproject/constants",[101866,738178,862333,870597,885644,901513,994501]],["ethers>@ethersproject/hash",[102391,130488,14327,229341,248528,375271,410943,412718,449047,578030,580813,646265,653503,691950,789828,79978,886384,974082]],["ethers>@ethersproject/json-wallets",[156057,27263,37426,401097,459908,580226,611720,655343,664514,749805,903739,921036]],["ethers>@ethersproject/json-wallets>aes-js",[302968,306515]],["ethers>@ethersproject/json-wallets>scrypt-js",[198336,305583]],["ethers>@ethersproject/keccak256",[233071,453002]],["ethers>@ethersproject/logger",[192947,329882,697489,883272]],["ethers>@ethersproject/networks",[10405,120216,332071,484058]],["ethers>@ethersproject/pbkdf2",[25643,712740]],["ethers>@ethersproject/properties",[176899,338777,4817,830724]],["ethers>@ethersproject/random",[234605,247023,313864,401282,424574,701504,862331,942107]],["ethers>@ethersproject/rlp",[246420,603988,820707,97991]],["ethers>@ethersproject/sha2",[116409,292750,323064,451058,571115,616008,802099,805929]],["ethers>@ethersproject/sha2>hash.js",[102033,128995,132485,132485,132485,179206,179206,179206,186330,238575,245891,283376,283376,283376,34759,387824,387824,387824,438047,438047,438047,439794,439794,439794,466610,466610,466610,51954,567879,567879,567879,57764,57764,57764,65135,80193,80193,80193,826733,832544,88054,88054,88054,89724,909328,970813,970813,970813]],["ethers>@ethersproject/signing-key",[120607,234380,255468,334645,592936,629441]],["ethers>@ethersproject/solidity",[619679,645682,743720,911877]],["ethers>@ethersproject/strings",[108514,301239,329038,340519,382916,465085,677367,795768,855040,936523]],["ethers>@ethersproject/units",[315087,394691,485374,91170]],["ethers>@ethersproject/wallet",[309353,349147,596598,923412]],["ethers>@ethersproject/web",[129311,247884,254712,55410,699423,738337]],["ethers>@ethersproject/wordlists",[273548,386977,400906,738213,760345,792456,837578,995917]],["extension-port-stream",[283079,283079,345979,452179,48050,48050,610518,679620,770467,770467,803058,803058]],["fast-json-patch",[283026,380569,717649,79551]],["fast-json-stable-stringify",[323260,665857]],["fuse.js",[863985]],["gulp>vinyl-fs>object.assign",[302547,302547,302547,337740,461066,461066,461066,724264,852903,983725]],["he",[106115]],["https-browserify",[428284,965339]],["human-standard-token-abi",[186688,944211]],["humanize-duration",[477355]],["immer",[115691,319222,801881,92365]],["ip-regex",[357910,794469]],["jest-canvas-mock>moo-color>color-name",[469804,934681]],["jsdom>form-data>es-set-tostringtag>has-tostringtag",[136935,197300,197300,197300]],["lightweight-charts",[194859,194859,194859]],["lightweight-charts>fancy-canvas",[128943,128943,128943,243582,243582,243582,418818,418818,418818,443436,443436,443436,631652,631652,631652]],["localforage",[544654,569235]],["lodash",[100323,101488,104045,104300,108041,109528,109528,109528,112437,112551,113743,114787,114787,11616,120960,122368,122368,122368,122932,123673,124162,124162,124842,127300,127750,133527,135471,136471,136471,136471,136571,137234,138115,138942,145831,14601,14786,15361,164325,165238,165238,166136,168474,169811,170623,170906,171118,171118,171577,171577,172113,174506,175458,175458,177356,184084,186049,188312,197614,199676,202665,206566,21199,21937,21937,21937,22114,223116,225953,23126,236872,236872,236872,23879,241297,241421,245780,247835,247835,247835,250846,254517,255991,257776,260153,260153,260393,260393,268882,271916,272175,272424,276617,276617,276617,281596,281657,281657,281657,284431,286093,286210,286210,286210,289577,29025,293628,295215,297868,298730,298730,298730,302407,302407,308731,308903,309292,309292,310326,311588,319805,319805,319805,323304,323304,323304,328821,33586,337087,337087,338971,338971,339886,353313,358633,358825,361178,366931,366931,366931,36833,369940,373754,376972,37766,378768,383565,383714,385115,386042,386042,386042,38620,38620,391602,394939,395464,403448,403448,403616,416456,41989,422966,423,428926,428926,428926,428940,429704,430303,433702,433752,433789,433789,433789,436820,438681,438993,438993,438993,440477,447822,449809,455911,456895,456895,456895,458090,459722,461663,462732,462732,463851,471378,47503,475162,47548,47548,476031,481585,481803,485063,485182,487091,498256,498256,498256,500610,502503,504273,504559,504559,509366,510185,517014,517141,522306,524621,524621,524621,53857,543987,553939,55422,55422,556600,55750,55750,55750,558909,558909,558909,563252,564009,564585,566425,566425,568112,571198,576629,580484,58095,585350,586053,58883,59461,605271,616685,616685,616685,618431,619507,619507,620901,621923,621923,622857,623755,629553,631293,631328,633411,633411,633411,635952,641229,647294,648362,65115,653160,653552,653552,653552,655676,65804,658647,659294,660863,663917,665697,665697,665697,667537,668205,668205,668205,670163,671945,68055,685209,685544,685544,685544,690007,692628,695038,698790,699180,700365,702879,702879,702879,704597,704597,704597,709499,718720,721248,721248,722604,726927,726927,726927,727656,728442,72890,72999,733395,74170,744305,746797,751209,752543,75570,75570,756305,756305,758387,759740,760824,767785,767785,769200,769200,771366,771366,771366,771899,771899,782268,782268,788018,794238,794238,797772,799648,807822,810117,810914,813305,813523,821432,822018,822539,822539,822539,826448,828974,828974,830089,830728,833325,833325,833883,834725,834725,834725,835792,837054,838154,841010,843361,844065,844065,844065,845660,851077,859340,859340,861862,861862,861862,862430,862430,867029,867029,868080,871201,871429,871614,873198,873198,873706,884485,887728,891013,892641,895090,895754,896540,896540,903543,904094,905252,910005,91158,91158,91158,919816,919816,919816,920277,920423,92662,927445,928442,928863,928863,928863,929441,930439,933290,936218,936218,939132,944880,944880,944880,945343,953568,961657,96672,971273,975932,975932,976160,978696,980790,98500,986377,986377,989300,991966,991966,992261,995922,997225,998084,999426]],["loglevel",[171097,171097,171097,186992,681050]],["lottie-web",[908216]],["luxon",[112660,122552,122552,138292,138292,14631,14631,208570,208570,210164,210164,228300,232712,232712,232748,263496,263496,283707,283707,296093,305921,316244,316244,317588,317588,347022,347022,352134,352134,360569,360569,392134,392134,417784,419186,419186,442525,442525,446655,446655,451798,451798,463404,484651,493104,493104,512986,512986,552578,558191,592161,597054,597054,600473,600473,603476,603476,609920,640846,640846,670188,686333,686333,688072,695358,695358,701043,7082,731318,731318,735606,750628,750628,763326,774810,774810,775158,775158,78565,78565,791436,794204,794204,821213,821213,831022,831022,835060,835060,835203,835203,85013,85013,86198,868766,868766,891728,891728,892859,895036,912276,912276,925752,925752,938102,938102,948972,948972,951906,951906,961520,961520,964556,977366,991213,991213,994218]],["mocha>ms",[134281,134281,134281,254660,254660,425626]],["mocha>yargs-unparser>is-plain-obj",[119552]],["mockttp>@httptoolkit/subscriptions-transport-ws>symbol-observable",[795713,992594]],["mockttp>express>qs",[169116,291497,299405,315677,428518,556189,663098,717698,80776,875855]],["mockttp>express>safe-buffer",[107796,495670,677197,677197,677197]],["nanoid",[531589,531589,531589,840019]],["nock>debug",[465273,465273,465273,617648,617648,617648,683075,683075,72092,952574,952574,978406]],["openai>abort-controller",[113795,577345,581808,581808]],["openai>zod",[287536,330714,33231,428332,524675,582090,601833,684703,697022,698064,70957,710256,784309,790526,818716,848709,883823,954755,991827]],["path-browserify",[386023]],["pify",[577564]],["process",[208835,208835,208835,242777,378326,378326,378326]],["prop-types",[557789,787332,991606]],["prop-types>object-assign",[858524]],["punycode",[259278,478759]],["qrcode-generator",[929736]],["qrcode.react",[174799]],["react",[23591,23591,276592,276592,31816,336620,336620,506711,860012,860012]],["react-chartjs-2",[173127]],["react-compiler-runtime",[303280,376775]],["react-devtools-core",[38588]],["react-dom",[1159,1159,879505,879505,9610,9610]],["react-dom>scheduler",[117047,117047,594158,594158]],["react-focus-lock",[124676,171702,304417,59129,679770,921718,977522]],["react-focus-lock>focus-lock",[130680,135719,153956,176839,296640,341413,360116,365187,367975,417071,578063,653567,664882,697295,716734,750025,780392,826111,837793,906089,997295]],["react-focus-lock>react-clientside-effect",[132165]],["react-focus-lock>use-callback-ref",[334392,415976,989992]],["react-focus-lock>use-sidecar",[886509]],["react-hot-toast",[638891]],["react-hot-toast>goober",[656304]],["react-idle-timer",[282382]],["react-markdown",[66117,909295,966680,973839]],["react-markdown>comma-separated-tokens",[395332]],["react-markdown>property-information",[258083,258083,258083,258083,258083,268653,289638,417521,446509,506471,586371,598178,602505,670407,704145,740213,889141,898296,936264,944670,950295,957290,967252]],["react-markdown>react-is",[287916,848688]],["react-markdown>remark-parse",[539368]],["react-markdown>remark-parse>mdast-util-from-markdown",[507116,89175]],["react-markdown>remark-parse>mdast-util-from-markdown>mdast-util-to-string",[395012]],["react-markdown>remark-parse>mdast-util-from-markdown>micromark",[104115,119289,129258,136293,144033,148270,150808,153521,161535,165991,168839,169712,186346,203041,203765,205363,237066,241124,256605,271097,285479,291083,293681,325134,3268,357801,358880,379942,385495,391243,396060,397066,43094,436679,466278,505402,516320,562973,566125,568998,569900,581950,58727,614294,623333,678319,686737,696579,721410,745263,755474,764255,773538,810663,826159,836056,864083,864935,877076,89499,90117,902223,94112,955087,956959,968566,969297,970056,972099,98218,992652]],["react-markdown>remark-parse>mdast-util-from-markdown>parse-entities",[644771]],["react-markdown>remark-rehype",[814592]],["react-markdown>remark-rehype>mdast-util-to-hast",[128826,136921,155539,156914,183517,21666,236413,25889,292670,31929,346282,437620,438767,465723,495019,51991,520863,5583,559428,618096,672584,684746,704491,706803,716806,766394,839288,839981,963917,998075]],["react-markdown>remark-rehype>mdast-util-to-hast>mdast-util-definitions",[603936]],["react-markdown>remark-rehype>mdast-util-to-hast>mdast-util-definitions>unist-util-visit",[914362]],["react-markdown>remark-rehype>mdast-util-to-hast>mdast-util-definitions>unist-util-visit>unist-util-is",[697732]],["react-markdown>remark-rehype>mdast-util-to-hast>mdast-util-definitions>unist-util-visit>unist-util-visit-parents",[390330,961099]],["react-markdown>remark-rehype>mdast-util-to-hast>mdurl",[590387]],["react-markdown>remark-rehype>mdast-util-to-hast>unist-builder",[7900]],["react-markdown>remark-rehype>mdast-util-to-hast>unist-util-generated",[602721]],["react-markdown>remark-rehype>mdast-util-to-hast>unist-util-position",[670554]],["react-markdown>space-separated-tokens",[112207]],["react-markdown>style-to-object",[485077]],["react-markdown>style-to-object>inline-style-parser",[728705]],["react-markdown>unified",[286052]],["react-markdown>unified>bail",[799782]],["react-markdown>unified>extend",[203585]],["react-markdown>unified>trough",[966031]],["react-markdown>unist-util-visit",[29744]],["react-markdown>unist-util-visit>unist-util-is",[835074]],["react-markdown>unist-util-visit>unist-util-visit-parents",[382277,810644]],["react-markdown>vfile",[646578,972887]],["react-markdown>vfile>is-buffer",[661447]],["react-markdown>vfile>replace-ext",[412132]],["react-markdown>vfile>unist-util-stringify-position",[144514]],["react-markdown>vfile>vfile-message",[704688]],["react-popper",[646948,897908]],["react-popper>react-fast-compare",[101875]],["react-redux",[176578,23106,235140,314701,369148,405347,416408,421859,470995,473584,48084,525300,52906,5637,62629,684723,701844,721075,742216,745865,772362,956152]],["react-redux>hoist-non-react-statics",[339394]],["react-redux>hoist-non-react-statics>react-is",[113132,337392]],["react-redux>react-is",[714527,753371]],["react-redux>use-sync-external-store",[11853,837954,897866,941760]],["react-router-dom",[994112]],["react-router-dom>@remix-run/router",[682660]],["react-router-dom>react-router",[83969]],["react-simple-file-input",[742431]],["react-tippy",[971180]],["react-tippy>popper.js",[975427]],["react-toggle-button",[490926]],["react-transition-group",[131350,284003,639130,829556,84954,936137,996331]],["react-transition-group>dom-helpers",[475843,815834,819347]],["readable-stream",[106951,114515,130971,138077,153089,181536,188078,194535,194535,203058,208075,22250,234970,238511,252334,252334,252859,252859,259290,261069,262327,268576,293230,294855,294855,338568,338568,366117,42401,425051,425493,425934,425934,443305,44565,448492,448492,449219,449219,452547,452547,464812,470292,485697,494247,494639,530232,548444,568577,586805,588847,588847,602416,613318,613318,631222,631222,632914,632914,68266,68266,683024,683122,699960,699960,703102,708566,708566,728264,730636,73701,754857,761124,761124,769584,769584,770587,777352,777352,809090,809090,816718,816718,827525,827525,831171,831171,837911,868387,868387,887131,895890,900457,900457,917165,921007,930607,978529,981686,9831]],["readable-stream-2>core-util-is",[711510,711510,711510,867645]],["readable-stream-2>process-nextick-args",[102393,102393,102393,688246]],["readable-stream-2>util-deprecate",[381763,381763,381763,418748,79894]],["redux",[60416]],["redux-thunk",[488961]],["remote-redux-devtools",[120443,398548,417589,712044]],["remote-redux-devtools>jsan",[151109,341696,425053,427767,965556]],["remote-redux-devtools>redux-devtools-core",[172251,650496,778624]],["remote-redux-devtools>redux-devtools-core>get-params",[31908]],["remote-redux-devtools>redux-devtools-core>nanoid",[659269]],["remote-redux-devtools>redux-devtools-core>remotedev-serialize",[205061,274996,464435]],["remote-redux-devtools>redux-devtools-instrument",[217867]],["remote-redux-devtools>rn-host-detect",[653154]],["remote-redux-devtools>socketcluster-client",[280959,46337,672552,701487,844684,94862,963198]],["remote-redux-devtools>socketcluster-client>buffer",[627940]],["remote-redux-devtools>socketcluster-client>clone",[430638]],["remote-redux-devtools>socketcluster-client>component-emitter",[870038]],["remote-redux-devtools>socketcluster-client>linked-list",[262580,759067]],["remote-redux-devtools>socketcluster-client>querystring",[29941,554315,676013]],["remote-redux-devtools>socketcluster-client>sc-channel",[891709]],["remote-redux-devtools>socketcluster-client>sc-channel>component-emitter",[504443]],["remote-redux-devtools>socketcluster-client>sc-errors",[520309,601342]],["remote-redux-devtools>socketcluster-client>sc-formatter",[38652]],["remote-redux-devtools>socketcluster-client>uuid",[107216,192925,648025,905155,998316]],["reselect",[491616,491616,491616,951696]],["rxjs",[102756,114266,123887,134513,157239,166494,17244,181684,189783,200472,200743,236364,246511,251001,260719,284905,288855,290018,291099,291193,303252,318113,328447,330355,331640,333101,352984,383791,386675,387150,392803,398765,401314,423155,437567,442524,445682,455485,473262,516384,526292,534931,545505,545828,551061,565819,569265,571214,594347,596960,598869,600044,607213,620854,652844,662948,66379,668048,668837,681277,691367,706697,733160,770104,792892,811021,817638,829227,847542,849267,855957,861952,876707,878086,881761,890336,892178,914713,924791,93042,949962,980174]],["sass-embedded>varint",[278676,418914,815680,870232]],["semver",[102998,11114,130698,132606,159585,212669,213832,223550,237927,248391,250377,258453,273657,282429,295762,297891,298090,300736,309624,315317,339498,343546,346340,348400,36974,400386,413859,437715,449524,458014,460668,467260,469878,470644,481665,486031,48939,506168,512786,526710,535367,558557,560706,563167,566205,568925,596964,598305,605657,606005,607684,618315,623287,626162,627830,630655,645178,65667,656844,673188,679153,685987,692636,712800,74207,750588,768365,768605,769567,77365,780433,783212,801015,811863,829373,843432,846768,846891,848745,869544,872547,884499,908707,908975,9090,917098,922262,927349,931574,947946,980803,988446]],["storybook>recast>tiny-invariant",[387325]],["stream-browserify",[594950,594950,594950,888781]],["stream-browserify>readable-stream",[109279,109279,109279,151838,204881,272244,305685,305685,305685,311802,311802,311802,312964,312964,312964,324373,472466,476851,48197,500040,500040,500040,522422,522422,522422,525412,525412,525412,52799,52799,52799,536442,588091,588091,588091,64502,64576,69755,69755,69755,699075,699075,699075,719265,719265,719265,74904,794353,794353,794353,836603,836603,836603,898431,909430,92456]],["stream-http",[162465,424492,427182,482901,669741,683392,819935,99248]],["stream-http>builtin-status-codes",[312335,535522]],["stream-http>readable-stream",[113306,156978,184437,189546,193050,195473,200733,201511,238979,253052,263792,290054,306458,322580,331753,365442,375248,408375,410939,4524,493781,512565,626160,654939,665564,790745,79871,874757,930722,960461]],["string.prototype.matchall>call-bind",[161546,567943,567943,567943,705035,705035,705035,996770]],["string.prototype.matchall>call-bind>call-bind-apply-helpers",[105132,170697,195819,26796,26796,26796,288605,635101,635101,635101,647304,647304,647304,653002,653002,653002,870079,870079,870079,873110,873110,873110,893405,918572]],["string.prototype.matchall>call-bind>es-define-property",[661292,861807,861807,861807]],["string.prototype.matchall>call-bind>set-function-length",[874449,874449,874449,957404]],["string.prototype.matchall>call-bound",[481117,727164,727164,727164]],["string.prototype.matchall>define-properties",[581439,919684,919684,919684]],["string.prototype.matchall>define-properties>define-data-property",[557806,562089,562089,562089]],["string.prototype.matchall>es-abstract>array-buffer-byte-length",[664167]],["string.prototype.matchall>es-abstract>available-typed-arrays",[167871,94121,94121,94121]],["string.prototype.matchall>es-abstract>es-to-primitive>is-symbol",[613340]],["string.prototype.matchall>es-abstract>get-proto",[144767,193624,193624,193624,622892,622892,622892,634207,659417,744104,744104,744104]],["string.prototype.matchall>es-abstract>is-array-buffer",[78062]],["string.prototype.matchall>es-abstract>is-callable",[76176,76176,76176,922191]],["string.prototype.matchall>es-abstract>is-regex",[598040,969219,969219,969219]],["string.prototype.matchall>es-abstract>is-set",[275840]],["string.prototype.matchall>es-abstract>is-shared-array-buffer",[610558]],["string.prototype.matchall>es-abstract>object-inspect",[427195,865172]],["string.prototype.matchall>es-abstract>safe-regex-test",[756068,92025,92025,92025]],["string.prototype.matchall>es-abstract>stop-iteration-iterator",[181996]],["string.prototype.matchall>es-abstract>typed-array-buffer",[274013,813364,813364,813364]],["string.prototype.matchall>es-abstract>typed-array-length>possible-typed-array-names",[267058,267058,267058,529107]],["string.prototype.matchall>es-abstract>unbox-primitive>has-bigints",[733838]],["string.prototype.matchall>es-errors",[231436,331300,331300,331300,382711,382711,382711,444699,444699,444699,492449,492449,492449,50102,523869,529354,529354,529354,592005,592005,592005,68025,701026,701026,701026,80974,812937,995452]],["string.prototype.matchall>es-object-atoms",[152963,588684,588684,588684]],["string.prototype.matchall>get-intrinsic",[191720,933,933,933]],["string.prototype.matchall>get-intrinsic>async-function",[254149,779198,779198,779198,846207,939487,939487,939487]],["string.prototype.matchall>get-intrinsic>async-generator-function",[449199,765827,765827,765827,916769,998538,998538,998538]],["string.prototype.matchall>get-intrinsic>generator-function",[19250,19250,19250,538426,6482,735833,735833,735833]],["string.prototype.matchall>gopd",[377379,377379,377379,599968,768613,768613,768613,99180]],["string.prototype.matchall>has-symbols",[160055,160055,160055,431420,49798,694053,694053,694053]],["string.prototype.matchall>internal-slot",[228431]],["string.prototype.matchall>regexp.prototype.flags",[167986,330037,739552,85627]],["string.prototype.matchall>set-function-name",[81814]],["string.prototype.matchall>set-function-name>functions-have-names",[645102]],["string.prototype.matchall>side-channel",[590357,800360]],["string.prototype.matchall>side-channel>side-channel-list",[592227,602442]],["string.prototype.matchall>side-channel>side-channel-map",[344459,547964]],["string.prototype.matchall>side-channel>side-channel-weakmap",[135004,176959]],["stylelint>fastest-levenshtein",[593950]],["ts-mixer",[419108,96481]],["tslib",[344125,92295]],["tweetnacl",[324494,990115]],["unicode-confusables",[531743,531743,531743,531743,531743,540270]],["uri-js",[817502,925475,925475,925475]],["uuid",[106555,112068,112471,112471,112471,123628,123628,123628,131721,16478,16478,16478,299896,301170,301170,301170,348274,38401,485791,485791,485791,516074,516074,516074,575044,585925,586218,607247,609345,620897,621501,659008,659008,659008,739070,739070,739070,761366,834669,834669,834669,849401,921766,921766,921766,923533,923533,923533,951545,951545,951545,975918,995891]],["viem",[108435,110353,120654,125613,126414,134615,135432,136059,141771,142622,142690,144027,145970,149070,152629,153826,154005,15428,155303,159903,162200,16483,165739,168599,17043,17086,17682,177399,179585,180264,180868,180913,182027,183962,185381,185757,186602,192555,193614,196347,198902,20058,201187,20347,206955,211553,216607,224182,226312,230398,231970,240232,244540,248394,253010,253581,253841,258366,26013,262068,263174,267135,269331,271479,272304,276159,278830,280227,281681,283434,284744,289821,290378,293249,293917,298433,301039,305684,307696,308241,309047,316230,318398,320962,322893,324983,33133,342148,345555,345911,348661,348752,353623,35887,359746,362600,365120,366380,370158,37288,373598,376744,37997,382827,385614,38670,388518,39844,408947,412571,418278,422558,423545,425178,43817,439451,443198,447297,451542,451639,456950,464e3,466542,466608,47298,475682,475803,477870,480547,481181,499595,501395,501404,503517,503669,5043,510342,511862,514495,516596,519594,519980,522040,52458,527306,528116,529148,529899,530143,53276,534201,53562,535996,541454,543e3,546971,54916,552343,554196,554850,555027,55547,557757,562631,564990,570610,571837,575147,577,579330,579487,580301,580353,581283,584641,586969,587621,59048,592935,602405,604494,606586,613354,61449,616594,630645,633410,638353,641142,64519,647738,653546,656562,660184,660996,666992,668234,668717,668811,671719,677052,681643,682783,68449,685980,689389,690119,690886,691354,692269,693803,696826,697679,699357,699717,69995,700479,70230,70872,709607,712805,721024,722095,723272,723710,733240,733482,734169,736411,73794,738373,742422,742893,744026,752449,760887,763001,765194,768068,768608,771532,771763,780176,781732,788062,791119,792335,794221,794682,79584,801218,801631,801708,807810,812269,820890,824362,848733,84879,852085,855917,85632,856939,857618,859471,86183,863127,865114,867221,867572,873589,874746,883699,885055,889515,890883,892878,896951,901736,9109,911217,913840,921124,921787,925668,931346,933346,945877,948214,948412,949723,950576,95293,954345,955164,959009,962837,963932,968609,973865,974738,976013,98380,986495,988886,990972,991845,994371,995778,998245,998409,998577,998963]],["viem>@noble/curves",[213283,404052,511008,595296,634550,952925]],["viem>abitype",[126519,155015,168943,364167,378235,37893,452758,462022,564688,611346,7e3,736658,743184,840360,865800,895483,968937,993672]],["viem>isows",[414579,454487]],["viem>ox",[102593,133790,139890,180628,225385,273545,287145,301874,318048,445414,448519,45100,470071,490385,543328,591579,740327,767137,802721,826021,852897,892958,906197,912278,968181,969732,972289,985558]],["viem>ox>@noble/curves",[179431,358576,739028,854009,951428,960346]],["wait-on>axios",[132519,138428,17975,183401,196434,235935,247769,260798,269126,272145,279845,302569,307443,329788,337049,337521,347359,35829,365459,374258,405386,423956,435085,443032,447923,451360,456048,47793,516138,527358,561903,573038,577145,621558,627273,652455,653978,6587,685727,686914,699050,727629,732582,738874,743479,757315,771027,776451,782831,791467,793963,933203]],["web-vitals",[811870]],["webextension-polyfill",[251070,392248,392248,413279,413279,413279]],["webpack>events",[55854,780063,780063,780063,998088]]],LAVAMOAT.unenforceable=[121455,20168,20168,20168,20168,20168,20168,20168,201783,201783,201783,201783,201783,236305,236305,236305,245672,245672,245672,245672,245672,245672,245672,245672,245672,245672,245672,337994,337994,337994,337994,337994,337994,337994,337994,337994,337994,337994,343966,343966,343966,343966,343966,343966,343966,343966,371173,383972,383972,383972,383972,383972,383972,383972,383972,383972,383972,383972,400495,400495,400495,400495,400495,400495,400495,400495,400495,400495,400495,439181,440830,440830,440830,440830,440830,440830,446179,490513,490513,490513,490513,490513,490513,490513,490513,490513,490513,490513,492752,531854,531854,531854,531854,531854,531854,531854,531854,531854,531854,531854,588776,588776,588776,588776,588776,588776,588776,588776,619200,623661,623661,623661,623661,623661,623661,623661,623661,638581,638581,638581,638581,638581,638581,638581,638581,639266,639266,639266,639266,639266,639266,639266,639266,667544,667544,667544,667544,667544,667544,667544,667544,685066,685066,685066,685066,685066,685066,685066,685066,685066,685066,685066,68724,68724,68724,68724,68724,68724,715050,715050,715050,715050,715050,715050,715050,715050,733258,733258,733258,733258,733258,733258,733258,733258,744643,744643,744643,744643,744643,744643,744643,744643,744643,744643,744643,74754,762634,762634,762634,762634,762634,762634,762634,762634,792981,792981,792981,792981,792981,792981,792981,792981,794832,794832,794832,801874,801874,801874,833028,901409,901409,901409,901409,901409,901409,901409,901409,901409,901409,901409,902731,902731,902731,902731,902731,950514,950514,950514,950514,950514,950514,950514,960548,960548,960548,960548,960548,960548,980564,980564,980564,980564,980564,980564,980564,980564,980564,980564,980564,999154,999154,999154],LAVAMOAT.ctxm=[],LAVAMOAT.kch=[1007,1039,1089,110,1105,1122,1245,1290,1309,133,1331,1371,1391,1416,1474,1476,1491,1507,1522,1523,1598,1608,166,1674,1684,1768,1778,1791,1818,1822,1826,1864,1887,2068,2113,2118,2160,2186,2189,2203,2213,2215,2222,229,2335,2370,2445,2449,2514,2584,2598,2638,2664,2669,2710,2721,2747,2776,285,2913,2962,3033,305,3139,3375,339,3404,3419,3423,343,35,3602,3701,3740,3756,3785,388,3885,3930,3931,3951,3956,4016,4052,407,4073,4113,4162,418,425,4268,427,4274,4294,4305,4307,431,4323,4377,4473,4520,4549,4579,4593,46,461,4634,4655,4666,4753,4781,483,4859,4910,4931,4932,497,5087,5098,513,5134,5151,5175,5250,5297,5337,5404,5407,5454,5458,5466,5520,5540,5566,5593,5657,5671,5762,5796,5840,5864,5925,5964,5998,6018,6022,6023,6053,6091,6110,6115,614,6141,6165,6209,6229,6266,6358,6401,6565,659,6617,6622,6649,6660,670,6770,6802,6828,6864,6906,6960,7062,7064,7091,710,7115,7133,7145,7165,7178,7202,7219,7356,7359,7378,7449,7547,7587,7614,7651,7755,7829,7899,7962,7984,7993,8015,8034,8063,8093,8117,8214,8427,8503,8620,8650,868,8734,8789,8792,8811,8849,887,891,8927,8935,8946,8986,8994,9038,904,9054,9060,9121,9162,9165,9232,9251,9265,9289,9297,9313,9354,9390,9471,9566,9597,9689,9737,9887,989,9949,9957,9984],LAVAMOAT.externals={},LAVAMOAT.options={lockdown:{consoleTaming:"unsafe",errorTaming:"unsafe",errorTrapping:"none",localeTaming:"unsafe",overrideTaming:"severe",reporting:"none",stackFiltering:"verbose"},scuttleGlobalThis:{enabled:!0,exceptions:["window","Proxy","toString","getComputedStyle","addEventListener","removeEventListener","ShadowRoot","HTMLElement","HTMLFormElement","Element","pageXOffset","pageYOffset","visualViewport","Reflect","Set","Object","navigator","harden","console","WeakSet","Event","EventTarget","Image","fetch","AbortController","OffscreenCanvas","/cdc_[a-zA-Z0-9]+_[a-zA-Z]+/iu","name","performance","parseFloat","innerWidth","innerHeight","Symbol","Math","DOMRect","Number","Array","crypto","Function","Uint8Array","String","Promise","JSON","Date","RegExp","__SENTRY__","appState","extra","stateHooks","sentryHooks","sentry","logEncryptedVault","WebAssembly","Request","history","getSelection","opr","devicePixelRatio","parent","frameElement","scrollX","scrollY","Node","ResizeObserver","setTimeout","clearTimeout","requestIdleCallback","webpackChunk"],scuttlerName:"SCUTTLER"}},(()=>{let module={exports:{}};module.exports;let{Object:Object1,Array:Array1,Error:Error1,RegExp,Set:Set1,console:console1,Proxy,Reflect:Reflect1}=globalThis,{assign,getOwnPropertyNames,getOwnPropertyDescriptor,create,defineProperty}=Object1,preserveLanguageIntrinsics=function(globalThisCompartment,globalThis1){return Object1.getOwnPropertyNames(globalThisCompartment).filter(a=>globalThisCompartment[a]===globalThis1[a]).concat(["Compartment","Error","globalThis"])}(new Compartment().globalThis,globalThis),{isArray,from}=Array1,{getPrototypeOf}=Reflect1,{warn}=console1,stringSplit=Function.prototype.bind.bind(Function.prototype.call)(String.prototype.split);module.exports={scuttle:function(globalRef,opts){let scuttleOpts=function(globalRef,originalOpts=create(null)){let defaultOpts={enabled:!0,exceptions:[],scuttlerName:""},opts=assign(create(null),!0===originalOpts?defaultOpts:originalOpts,{scuttlerFunc:(globalRef,scuttle)=>scuttle(globalRef)},{exceptions:(originalOpts?.exceptions||defaultOpts.exceptions).map(e=>(function(except){if(!except.startsWith("/"))return except;let parts=except.split("/");return new RegExp(parts.slice(1,-1).join("/"),parts[parts.length-1])})(e))});if(opts.scuttlerName){if(!globalRef[opts.scuttlerName])throw new Error1(`LavaMoat - 'scuttlerName' function "${opts.scuttlerName}" expected on globalRef.To learn more visit https://github.com/LavaMoat/LavaMoat/pull/462.`);opts.scuttlerFunc=globalRef[opts.scuttlerName]}return opts}(globalRef,opts);if(scuttleOpts.enabled){if(!isArray(scuttleOpts.exceptions))throw new Error1(`LavaMoat - exceptions must be an array, got ${typeof scuttleOpts.exceptions}`);scuttleOpts.scuttlerFunc(globalRef,realm=>(function(globalRef,extraPropsToAvoid=[]){let props=[];(function(value){let protoChain=[],current=value;for(;current&&("object"==typeof current||"function"==typeof current);)protoChain.push(current),current=getPrototypeOf(current);return protoChain})(globalRef).forEach(proto=>props.push(...getOwnPropertyNames(proto)));let propsToAvoid=new Set1([...preserveLanguageIntrinsics,...extraPropsToAvoid]),obj=create(null);props.forEach(prop=>{let propsToAvoid1,prop1,{get,set}={get:function(){let err=new Error1(""),msg=`LavaMoat - property "${prop}" of globalThis is inaccessible under scuttling mode. To learn more visit https://github.com/LavaMoat/LavaMoat/issues/2127.`;if(warn(msg),err.stack&&stringSplit(err.stack,`
`).length>2)throw err.message=msg,err},set:function(){warn(`LavaMoat - property "${prop}" of globalThis cannot be set under scuttling mode. To learn more visit https://github.com/LavaMoat/LavaMoat/issues/2127.`)}};if(propsToAvoid1=propsToAvoid,prop1=prop,from(propsToAvoid1).some(avoid=>"string"==typeof avoid&&avoid===prop1||avoid instanceof RegExp&&avoid.test(prop1)))return;let desc=getOwnPropertyDescriptor(globalRef,prop);if(desc?.configurable===!0)desc={configurable:!1,set,get};else{if(desc?.writable!==!0)return;desc={configurable:!1,writable:!1,value:new Proxy(obj,{getPrototypeOf:get,get,set})}}defineProperty(globalRef,prop,desc)})})(realm,scuttleOpts.exceptions))}}},LAVAMOAT.scuttling=module.exports})(),LAVAMOAT.policy={resources:{"@babel/runtime":{globals:{regeneratorRuntime:"write"}},"@emotion/react":{globals:{HTMLElement:!0,"document.querySelector":!0},packages:{"@babel/runtime":!0,"@emotion/react>@emotion/cache":!0,"@emotion/react>@emotion/serialize":!0,"@emotion/react>@emotion/use-insertion-effect-with-fallbacks":!0,"@emotion/react>@emotion/utils":!0,"@emotion/react>@emotion/weak-memoize":!0,react:!0,"react-redux>hoist-non-react-statics":!0}},"@emotion/react>@emotion/cache":{globals:{"document.head":!0,"document.querySelectorAll":!0},packages:{"@emotion/react>@emotion/cache>@emotion/memoize":!0,"@emotion/react>@emotion/cache>@emotion/sheet":!0,"@emotion/react>@emotion/cache>stylis":!0,"@emotion/react>@emotion/weak-memoize":!0}},"@emotion/react>@emotion/cache>@emotion/sheet":{globals:{"document.createElement":!0,"document.createTextNode":!0,"document.styleSheets":!0}},"@emotion/react>@emotion/serialize":{packages:{"@emotion/react>@emotion/cache>@emotion/memoize":!0,"@emotion/react>@emotion/serialize>@emotion/hash":!0,"@emotion/react>@emotion/serialize>@emotion/unitless":!0}},"@emotion/react>@emotion/use-insertion-effect-with-fallbacks":{packages:{react:!0}},"@emotion/styled":{packages:{"@babel/runtime":!0,"@emotion/react":!0,"@emotion/react>@emotion/serialize":!0,"@emotion/react>@emotion/use-insertion-effect-with-fallbacks":!0,"@emotion/react>@emotion/utils":!0,"@emotion/styled>@emotion/is-prop-valid":!0,react:!0}},"@emotion/styled>@emotion/is-prop-valid":{packages:{"@emotion/react>@emotion/cache>@emotion/memoize":!0}},"@ensdomains/content-hash":{globals:{"Buffer.from":!0,"console.warn":!0},packages:{"@ensdomains/content-hash>cids":!0,"@ensdomains/content-hash>js-base64":!0,"@ensdomains/content-hash>multicodec":!0,"@ensdomains/content-hash>multihashes":!0,"@ensdomains/content-hash>multihashes>buffer":!0}},"@ensdomains/content-hash>cids":{packages:{"@ensdomains/content-hash>cids>multibase":!0,"@ensdomains/content-hash>cids>multihashes":!0,"@ensdomains/content-hash>cids>uint8arrays":!0,"@ensdomains/content-hash>multicodec":!0}},"@ensdomains/content-hash>cids>multibase":{globals:{TextDecoder:!0,TextEncoder:!0},packages:{"@ensdomains/content-hash>cids>multibase>@multiformats/base-x":!0}},"@ensdomains/content-hash>cids>multihashes":{packages:{"@ensdomains/content-hash>cids>multibase":!0,"@ensdomains/content-hash>cids>multihashes>uint8arrays":!0,"@ensdomains/content-hash>cids>multihashes>varint":!0}},"@ensdomains/content-hash>cids>multihashes>uint8arrays":{globals:{TextDecoder:!0,TextEncoder:!0},packages:{"@ensdomains/content-hash>cids>multibase":!0}},"@ensdomains/content-hash>cids>uint8arrays":{globals:{TextDecoder:!0},packages:{"@ensdomains/content-hash>cids>multibase":!0}},"@ensdomains/content-hash>js-base64":{globals:{Base64:"write",Buffer:!0,TextDecoder:!0,TextEncoder:!0,atob:!0,btoa:!0,define:!0},packages:{buffer:!0}},"@ensdomains/content-hash>multicodec":{packages:{"@ensdomains/content-hash>multicodec>uint8arrays":!0,"sass-embedded>varint":!0}},"@ensdomains/content-hash>multicodec>uint8arrays":{globals:{Buffer:!0,TextDecoder:!0,TextEncoder:!0},packages:{"@metamask/assets-controllers>multiformats":!0}},"@ensdomains/content-hash>multihashes":{packages:{"@ensdomains/content-hash>multihashes>buffer":!0,"@ensdomains/content-hash>multihashes>multibase":!0,"@ensdomains/content-hash>multihashes>varint":!0,"@ensdomains/content-hash>multihashes>web-encoding":!0}},"@ensdomains/content-hash>multihashes>buffer":{globals:{console:!0},packages:{"base64-js":!0,"buffer>ieee754":!0}},"@ensdomains/content-hash>multihashes>multibase":{packages:{"@ensdomains/content-hash>multihashes>buffer":!0,"@ensdomains/content-hash>multihashes>multibase>base-x":!0,"@ensdomains/content-hash>multihashes>web-encoding":!0}},"@ensdomains/content-hash>multihashes>multibase>base-x":{packages:{"mockttp>express>safe-buffer":!0}},"@ensdomains/content-hash>multihashes>web-encoding":{globals:{TextDecoder:!0,TextEncoder:!0},packages:{"browserify>util":!0}},"@ethereumjs/tx":{packages:{"@ethereumjs/tx>@ethereumjs/common":!0,"@ethereumjs/tx>@ethereumjs/rlp":!0,"@ethereumjs/tx>@ethereumjs/util":!0,"@ethereumjs/tx>ethereum-cryptography":!0}},"@ethereumjs/tx>@ethereumjs/common":{packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"webpack>events":!0}},"@ethereumjs/tx>@ethereumjs/rlp":{globals:{TextEncoder:!0}},"@ethereumjs/tx>@ethereumjs/util":{globals:{"console.warn":!0,fetch:!0},packages:{"@ethereumjs/tx>@ethereumjs/rlp":!0,"@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography":!0,"@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography>@noble/curves":!0,"@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography>@noble/hashes":!0,"@ethereumjs/tx>ethereum-cryptography>@noble/curves":!0,"webpack>events":!0}},"@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography":{globals:{TextDecoder:!0,crypto:!0,module:!0},packages:{"@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography>@noble/curves":!0,"@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography>@noble/hashes":!0}},"@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography>@noble/curves":{globals:{TextEncoder:!0},packages:{"@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography>@noble/hashes":!0}},"@ethereumjs/tx>@ethereumjs/util>ethereum-cryptography>@noble/hashes":{globals:{TextEncoder:!0,crypto:!0}},"@ethereumjs/tx>ethereum-cryptography":{globals:{TextDecoder:!0,crypto:!0,module:!0},packages:{"@ethereumjs/tx>ethereum-cryptography>@noble/hashes":!0}},"@ethereumjs/tx>ethereum-cryptography>@noble/hashes":{globals:{TextEncoder:!0}},"@ethersproject/abi":{globals:{"console.log":!0},packages:{"@ethersproject/bignumber":!0,"@ethersproject/bytes":!0,"ethers>@ethersproject/address":!0,"ethers>@ethersproject/constants":!0,"ethers>@ethersproject/hash":!0,"ethers>@ethersproject/keccak256":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/properties":!0,"ethers>@ethersproject/strings":!0}},"@ethersproject/bignumber":{packages:{"@ethersproject/bytes":!0,"ethereumjs-util>bn.js":!0,"ethers>@ethersproject/logger":!0}},"@ethersproject/bytes":{packages:{"ethers>@ethersproject/logger":!0}},"@ethersproject/contracts":{globals:{setTimeout:!0},packages:{"@ethersproject/abi":!0,"@ethersproject/bignumber":!0,"@ethersproject/bytes":!0,"@ethersproject/transactions":!0,"ethers>@ethersproject/abstract-provider":!0,"ethers>@ethersproject/abstract-signer":!0,"ethers>@ethersproject/address":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/properties":!0}},"@ethersproject/hdnode":{packages:{"@ethersproject/bignumber":!0,"@ethersproject/bytes":!0,"@ethersproject/transactions":!0,"ethers>@ethersproject/basex":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/pbkdf2":!0,"ethers>@ethersproject/properties":!0,"ethers>@ethersproject/sha2":!0,"ethers>@ethersproject/signing-key":!0,"ethers>@ethersproject/strings":!0,"ethers>@ethersproject/wordlists":!0}},"@ethersproject/providers":{globals:{WebSocket:!0,clearInterval:!0,clearTimeout:!0,"console.log":!0,"console.warn":!0,setInterval:!0,setTimeout:!0},packages:{"@ethersproject/bignumber":!0,"@ethersproject/bytes":!0,"@ethersproject/providers>bech32":!0,"@ethersproject/transactions":!0,"ethers>@ethersproject/abstract-provider":!0,"ethers>@ethersproject/abstract-signer":!0,"ethers>@ethersproject/address":!0,"ethers>@ethersproject/base64":!0,"ethers>@ethersproject/basex":!0,"ethers>@ethersproject/constants":!0,"ethers>@ethersproject/hash":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/networks":!0,"ethers>@ethersproject/properties":!0,"ethers>@ethersproject/random":!0,"ethers>@ethersproject/sha2":!0,"ethers>@ethersproject/strings":!0,"ethers>@ethersproject/web":!0}},"@ethersproject/transactions":{packages:{"@ethersproject/bignumber":!0,"@ethersproject/bytes":!0,"ethers>@ethersproject/address":!0,"ethers>@ethersproject/constants":!0,"ethers>@ethersproject/keccak256":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/properties":!0,"ethers>@ethersproject/rlp":!0,"ethers>@ethersproject/signing-key":!0}},"@google/genai>protobufjs":{globals:{process:!0,setTimeout:!0},packages:{"@google/genai>protobufjs>@protobufjs/aspromise":!0,"@google/genai>protobufjs>@protobufjs/base64":!0,"@google/genai>protobufjs>@protobufjs/codegen":!0,"@google/genai>protobufjs>@protobufjs/eventemitter":!0,"@google/genai>protobufjs>@protobufjs/fetch":!0,"@google/genai>protobufjs>@protobufjs/float":!0,"@google/genai>protobufjs>@protobufjs/path":!0,"@google/genai>protobufjs>@protobufjs/pool":!0,"@google/genai>protobufjs>@protobufjs/utf8":!0,"@google/genai>protobufjs>long":!0}},"@google/genai>protobufjs>@protobufjs/codegen":{globals:{"console.log":!0}},"@google/genai>protobufjs>@protobufjs/fetch":{globals:{XMLHttpRequest:!0},packages:{"@google/genai>protobufjs>@protobufjs/aspromise":!0}},"@google/genai>protobufjs>@protobufjs/float":{globals:{Float32Array:!0,Float64Array:!0}},"@google/genai>protobufjs>long":{globals:{"WebAssembly.Instance":!0,"WebAssembly.Module":!0,define:!0}},"@hello-pangea/dnd":{globals:{"Element.prototype":!0,__REDUX_DEVTOOLS_EXTENSION_COMPOSE__:!0,addEventListener:!0,cancelAnimationFrame:!0,clearTimeout:!0,console:!0,document:!0,getComputedStyle:!0,pageXOffset:!0,pageYOffset:!0,removeEventListener:!0,requestAnimationFrame:!0,scrollBy:!0,setTimeout:!0},packages:{"@babel/runtime":!0,"@hello-pangea/dnd>css-box-model":!0,"@hello-pangea/dnd>memoize-one":!0,"@hello-pangea/dnd>raf-schd":!0,"@hello-pangea/dnd>use-memo-one":!0,react:!0,"react-dom":!0,"react-redux":!0,redux:!0}},"@hello-pangea/dnd>css-box-model":{globals:{getComputedStyle:!0,pageXOffset:!0,pageYOffset:!0},packages:{"storybook>recast>tiny-invariant":!0}},"@hello-pangea/dnd>raf-schd":{globals:{cancelAnimationFrame:!0,requestAnimationFrame:!0}},"@hello-pangea/dnd>use-memo-one":{packages:{react:!0}},"@keystonehq/bc-ur-registry-eth":{globals:{"Buffer.from":!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@keystonehq/bc-ur-registry-eth>@keystonehq/bc-ur-registry":!0,"@metamask/eth-qr-keyring>hdkey":!0,buffer:!0,uuid:!0}},"@keystonehq/bc-ur-registry-eth>@keystonehq/bc-ur-registry":{globals:{Buffer:!0,define:!0},packages:{"@ngraveio/bc-ur":!0,buffer:!0,"ethereumjs-util>ethereum-cryptography>bs58check":!0,tslib:!0}},"@lavamoat/lavadome-react":{globals:{Array:!0,Clipboard:!0,Document:!0,DocumentFragment:!0,Element:!0,Event:!0,EventTarget:!0,Function:!0,JSON:!0,NavigateEvent:!0,NavigationDestination:!0,Node:!0,Number:!0,Object:!0,String:!0,Weakmap:!0,"console.warn":!0,document:!0,navigation:!0},packages:{react:!0}},"@ledgerhq/device-management-kit":{globals:{AbortController:!0,Blob:!1,FormData:!1,ReadableStream:!1,TextEncoder:!0,"URL.createObjectURL":!1,URLSearchParams:!1,clearTimeout:!0,"console.debug":!0,"console.error":!0,"console.info":!0,"console.log":!0,"console.warn":!0,document:!1,fetch:!1,setTimeout:!0,"vi.fn":!1},packages:{"@ledgerhq/device-management-kit>inversify":!0,"@ledgerhq/device-management-kit>inversify>@inversifyjs/container":!0,"@ledgerhq/device-management-kit>inversify>@inversifyjs/core":!0,"@ledgerhq/device-management-kit>isomorphic-ws":!0,"@ledgerhq/device-management-kit>purify-ts":!0,"@ledgerhq/device-management-kit>reflect-metadata":!0,"@ledgerhq/device-management-kit>semver":!0,"@ledgerhq/device-management-kit>uuid":!0,"@ledgerhq/device-management-kit>xstate":!0,rxjs:!0}},"@ledgerhq/device-management-kit>inversify>@inversifyjs/container":{packages:{"@ledgerhq/device-management-kit>inversify>@inversifyjs/common":!0,"@ledgerhq/device-management-kit>inversify>@inversifyjs/core":!0,"@ledgerhq/device-management-kit>inversify>@inversifyjs/core>@inversifyjs/reflect-metadata-utils":!0,"@ledgerhq/device-management-kit>reflect-metadata":!0}},"@ledgerhq/device-management-kit>inversify>@inversifyjs/core":{packages:{"@ledgerhq/device-management-kit>inversify>@inversifyjs/common":!0,"@ledgerhq/device-management-kit>inversify>@inversifyjs/core>@inversifyjs/prototype-utils":!0,"@ledgerhq/device-management-kit>inversify>@inversifyjs/core>@inversifyjs/reflect-metadata-utils":!0}},"@ledgerhq/device-management-kit>isomorphic-ws":{globals:{MozWebSocket:!1,WebSocket:!1}},"@ledgerhq/device-management-kit>reflect-metadata":{globals:{crypto:!1,msCrypto:!1}},"@ledgerhq/device-management-kit>semver":{globals:{"console.error":!0,process:!0},packages:{process:!0}},"@ledgerhq/device-management-kit>uuid":{globals:{crypto:!0}},"@ledgerhq/device-management-kit>xstate":{globals:{AbortController:!0,clearTimeout:!0,console:!0,setTimeout:!0}},"@ledgerhq/device-transport-kit-web-hid":{globals:{AbortController:!0,DOMException:!0,clearTimeout:!0,event:!1,"navigator.hid":!0,setTimeout:!0},packages:{"@ledgerhq/device-management-kit":!0,"@ledgerhq/device-management-kit>@sentry/minimal":!0,"@ledgerhq/device-management-kit>purify-ts":!0,"@ledgerhq/device-transport-kit-web-hid>uuid":!0,rxjs:!0}},"@ledgerhq/device-transport-kit-web-hid>uuid":{globals:{crypto:!0}},"@ledgerhq/errors":{globals:{"console.warn":!0}},"@ledgerhq/hw-app-eth":{globals:{"Buffer.alloc":!0,"Buffer.concat":!0,"Buffer.from":!0,"console.warn":!0},packages:{"@ethersproject/abi":!0,"@ethersproject/transactions":!0,"@ledgerhq/errors":!0,"@ledgerhq/hw-app-eth>@ledgerhq/cryptoassets-evm-signatures":!0,"@ledgerhq/hw-app-eth>@ledgerhq/domain-service":!0,"@ledgerhq/hw-app-eth>@ledgerhq/evm-tools":!0,"@ledgerhq/hw-app-eth>@ledgerhq/logs":!0,"@ledgerhq/hw-app-eth>bignumber.js":!0,buffer:!0,"ethers>@ethersproject/rlp":!0,semver:!0,"wait-on>axios":!0}},"@ledgerhq/hw-app-eth>@ledgerhq/domain-service":{packages:{"@ledgerhq/hw-app-eth>@ledgerhq/logs":!0,"wait-on>axios":!0}},"@ledgerhq/hw-app-eth>@ledgerhq/evm-tools":{packages:{"@ledgerhq/hw-app-eth>@ledgerhq/cryptoassets-evm-signatures":!0,"@ledgerhq/hw-app-eth>@ledgerhq/evm-tools>@ledgerhq/live-env":!0,"@metamask/ppom-validator>crypto-js":!0,"ethers>@ethersproject/constants":!0,"ethers>@ethersproject/hash":!0,"wait-on>axios":!0}},"@ledgerhq/hw-app-eth>@ledgerhq/evm-tools>@ledgerhq/live-env":{globals:{"console.warn":!0},packages:{rxjs:!0}},"@ledgerhq/hw-app-eth>@ledgerhq/logs":{globals:{__ledgerLogsListen:"write","console.error":!0}},"@ledgerhq/hw-app-eth>bignumber.js":{globals:{crypto:!0}},"@ledgerhq/hw-transport":{globals:{"Buffer.alloc":!0,"Buffer.concat":!0,"Buffer.from":!0,clearTimeout:!0,"console.warn":!0,setTimeout:!0},packages:{"@ledgerhq/errors":!0,"@ledgerhq/hw-app-eth>@ledgerhq/logs":!0,buffer:!0,"webpack>events":!0}},"@ledgerhq/hw-transport-webhid":{globals:{"Buffer.from":!0,navigator:!0},packages:{"@ledgerhq/errors":!0,"@ledgerhq/hw-app-eth>@ledgerhq/logs":!0,"@ledgerhq/hw-transport-webhid>@ledgerhq/devices":!0,"@ledgerhq/hw-transport-webhid>@ledgerhq/hw-transport":!0,buffer:!0}},"@ledgerhq/hw-transport-webhid>@ledgerhq/devices":{globals:{"Buffer.alloc":!0,"Buffer.concat":!0},packages:{"@ledgerhq/errors":!0,"@ledgerhq/hw-transport-webhid>@ledgerhq/devices>semver":!0,buffer:!0}},"@ledgerhq/hw-transport-webhid>@ledgerhq/devices>semver":{globals:{"console.error":!0,process:!0},packages:{process:!0}},"@ledgerhq/hw-transport-webhid>@ledgerhq/hw-transport":{globals:{"Buffer.alloc":!0,"Buffer.concat":!0,"Buffer.from":!0,clearTimeout:!0,"console.warn":!0,setTimeout:!0},packages:{"@ledgerhq/errors":!0,"@ledgerhq/hw-app-eth>@ledgerhq/logs":!0,buffer:!0,"webpack>events":!0}},"@metamask/7715-permission-types":{packages:{"@metamask/delegation-core":!0,"@metamask/utils":!0}},"@metamask/abi-utils":{packages:{"@metamask/superstruct":!0,"@metamask/utils":!0}},"@metamask/account-api":{packages:{"@metamask/keyring-api":!0,"@metamask/keyring-utils":!0}},"@metamask/account-tree-controller":{globals:{TextDecoder:!0,TextEncoder:!0,"console.error":!0,"console.warn":!0,setTimeout:!0,structuredClone:!0},packages:{"@metamask/account-api":!0,"@metamask/accounts-controller":!0,"@metamask/base-controller":!0,"@metamask/keyring-api":!0,"@metamask/keyring-controller":!0,"@metamask/profile-sync-controller":!0,"@metamask/snaps-utils":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"eslint>fast-deep-equal":!0}},"@metamask/accounts-controller":{globals:{"console.warn":!0},packages:{"@metamask/accounts-controller>@metamask/keyring-controller":!0,"@metamask/accounts-controller>ethereum-cryptography":!0,"@metamask/base-controller":!0,"@metamask/eth-snap-keyring":!0,"@metamask/keyring-api":!0,"@metamask/keyring-sdk":!0,"@metamask/keyring-utils":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,lodash:!0,uuid:!0}},"@metamask/accounts-controller>@metamask/keyring-controller":{globals:{"console.error":!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/base-controller":!0,"@metamask/eth-hd-keyring":!0,"@metamask/eth-sig-util":!0,"@metamask/keyring-controller>@metamask/eth-simple-keyring":!0,"@metamask/keyring-controller>ethereumjs-wallet":!0,"@metamask/keyring-controller>ulid":!0,"@metamask/utils":!0,"async-mutex":!0,lodash:!0}},"@metamask/accounts-controller>ethereum-cryptography":{globals:{TextDecoder:!0,crypto:!0,module:!0},packages:{"@metamask/accounts-controller>ethereum-cryptography>@noble/hashes":!0}},"@metamask/accounts-controller>ethereum-cryptography>@noble/hashes":{globals:{TextEncoder:!0}},"@metamask/analytics-controller":{packages:{"@metamask/analytics-controller>uuid":!0,"@metamask/assets-controller>lodash-es":!0,"@metamask/base-controller":!0,"@metamask/utils":!0}},"@metamask/analytics-controller>uuid":{globals:{crypto:!0}},"@metamask/announcement-controller":{packages:{"@metamask/base-controller":!0}},"@metamask/approval-controller":{globals:{"console.info":!0},packages:{"@metamask/base-controller":!0,"@metamask/rpc-errors":!0,nanoid:!0}},"@metamask/assets-controller":{globals:{clearInterval:!0,clearTimeout:!0,"console.error":!0,"performance.now":!0,"performance.timeOrigin":!0,setInterval:!0,setTimeout:!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@ethersproject/abi":!0,"@ethersproject/providers":!0,"@metamask/assets-controller>@metamask/controller-utils":!0,"@metamask/assets-controller>@metamask/polling-controller":!0,"@metamask/assets-controller>bignumber.js":!0,"@metamask/assets-controller>lodash-es":!0,"@metamask/assets-controllers":!0,"@metamask/base-controller":!0,"@metamask/client-controller":!0,"@metamask/keyring-snap-client":!0,"@metamask/phishing-controller":!0,"@metamask/snaps-utils":!0,"@metamask/utils":!0,"async-mutex":!0}},"@metamask/assets-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@ethersproject/abi":!0,"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,cockatiel:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/assets-controller>@metamask/polling-controller":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"fast-json-stable-stringify":!0,uuid:!0}},"@metamask/assets-controller>bignumber.js":{globals:{crypto:!0}},"@metamask/assets-controller>lodash-es":{globals:{clearTimeout:!0,exports:!0,module:!0,setTimeout:!0}},"@metamask/assets-controllers":{globals:{AbortController:!0,URL:!0,URLSearchParams:!0,clearInterval:!0,clearTimeout:!0,"console.error":!0,"console.log":!0,"console.warn":!0,fetch:!0,setInterval:!0,setTimeout:!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@ethersproject/contracts":!0,"@ethersproject/providers":!0,"@metamask/assets-controller>lodash-es":!0,"@metamask/assets-controllers>@metamask/abi-utils":!0,"@metamask/assets-controllers>@metamask/controller-utils":!0,"@metamask/assets-controllers>@metamask/polling-controller":!0,"@metamask/assets-controllers>immer":!0,"@metamask/assets-controllers>multiformats":!0,"@metamask/assets-controllers>reselect":!0,"@metamask/assets-controllers>single-call-balance-checker-abi":!0,"@metamask/assets-controllers>uuid":!0,"@metamask/base-controller":!0,"@metamask/contract-metadata":!0,"@metamask/controller-utils>@metamask/eth-query":!0,"@metamask/core-backend":!0,"@metamask/keyring-api":!0,"@metamask/keyring-snap-client":!0,"@metamask/metamask-eth-abis":!0,"@metamask/phishing-controller":!0,"@metamask/rpc-errors":!0,"@metamask/snaps-utils":!0,"@metamask/utils":!0,"@tanstack/react-query>@tanstack/query-core":!0,"async-mutex":!0,"ethereumjs-util>bn.js":!0,"ethers>@ethersproject/address":!0}},"@metamask/assets-controllers>@metamask/abi-utils":{packages:{"@metamask/superstruct":!0,"@metamask/utils":!0}},"@metamask/assets-controllers>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,cockatiel:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/assets-controllers>@metamask/polling-controller":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/assets-controllers>@metamask/polling-controller>uuid":!0,"@metamask/base-controller":!0,"fast-json-stable-stringify":!0}},"@metamask/assets-controllers>@metamask/polling-controller>uuid":{globals:{crypto:!0,msCrypto:!0}},"@metamask/assets-controllers>immer":{globals:{Iterator:!0}},"@metamask/assets-controllers>multiformats":{globals:{TextDecoder:!0,TextEncoder:!0,"console.warn":!0,"crypto.subtle.digest":!0}},"@metamask/assets-controllers>reselect":{globals:{WeakRef:!0,"console.warn":!0}},"@metamask/assets-controllers>uuid":{globals:{crypto:!0}},"@metamask/authenticated-user-storage":{globals:{fetch:!0},packages:{"@metamask/authenticated-user-storage>@metamask/controller-utils":!0,"@metamask/base-data-service":!0,"@metamask/superstruct":!0}},"@metamask/authenticated-user-storage>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/base-controller":{globals:{"console.error":!0,"console.warn":!0},packages:{"@metamask/base-controller>immer":!0}},"@metamask/base-controller>immer":{globals:{Iterator:!0}},"@metamask/base-data-service":{packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/base-data-service>uuid":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"@tanstack/react-query>@tanstack/query-core":!0,cockatiel:!0,"eslint>fast-deep-equal":!0}},"@metamask/base-data-service>uuid":{globals:{crypto:!0}},"@metamask/bridge-controller":{globals:{AbortController:!0,"Buffer.from":!0,TextDecoder:!0,URLSearchParams:!0,"console.error":!0,"console.log":!0,"console.warn":!0},packages:{"@ethersproject/bignumber":!0,"@ethersproject/contracts":!0,"@ethersproject/providers":!0,"@metamask/assets-controller>lodash-es":!0,"@metamask/bridge-controller>@metamask/controller-utils":!0,"@metamask/bridge-controller>@metamask/multichain-network-controller":!0,"@metamask/bridge-controller>@metamask/polling-controller":!0,"@metamask/bridge-controller>bignumber.js":!0,"@metamask/bridge-controller>reselect":!0,"@metamask/bridge-controller>uuid":!0,"@metamask/keyring-api":!0,"@metamask/metamask-eth-abis":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,buffer:!0,"ethers>@ethersproject/address":!0,"ethers>@ethersproject/constants":!0}},"@metamask/bridge-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/bridge-controller>@metamask/multichain-network-controller":{packages:{"@metamask/base-controller":!0,"@metamask/bridge-controller>@metamask/multichain-network-controller>@metamask/keyring-api":!0,"@metamask/network-controller":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,lodash:!0}},"@metamask/bridge-controller>@metamask/polling-controller":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"@metamask/bridge-controller>@metamask/polling-controller>uuid":!0,"fast-json-stable-stringify":!0}},"@metamask/bridge-controller>@metamask/polling-controller>uuid":{globals:{crypto:!0,msCrypto:!0}},"@metamask/bridge-controller>bignumber.js":{globals:{crypto:!0}},"@metamask/bridge-controller>reselect":{globals:{WeakRef:!0,"console.warn":!0}},"@metamask/bridge-controller>uuid":{globals:{crypto:!0}},"@metamask/bridge-status-controller":{globals:{URLSearchParams:!0,clearInterval:!0,"console.error":!0,"console.warn":!0,fetch:!0,setInterval:!0,setTimeout:!0},packages:{"@metamask/bridge-controller":!0,"@metamask/bridge-status-controller>@metamask/controller-utils":!0,"@metamask/bridge-status-controller>@metamask/polling-controller":!0,"@metamask/bridge-status-controller>bignumber.js":!0,"@metamask/bridge-status-controller>uuid":!0,"@metamask/keyring-controller":!0,"@metamask/superstruct":!0,"@metamask/transaction-controller":!0,"@metamask/utils":!0}},"@metamask/bridge-status-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/bridge-status-controller>@metamask/polling-controller":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"@metamask/bridge-status-controller>@metamask/polling-controller>uuid":!0,"fast-json-stable-stringify":!0}},"@metamask/bridge-status-controller>@metamask/polling-controller>uuid":{globals:{crypto:!0,msCrypto:!0}},"@metamask/bridge-status-controller>bignumber.js":{globals:{crypto:!0}},"@metamask/bridge-status-controller>uuid":{globals:{crypto:!0}},"@metamask/browser-passworder":{globals:{"Buffer.from":!0,CryptoKey:!0,btoa:!0,"crypto.getRandomValues":!0,"crypto.subtle.decrypt":!0,"crypto.subtle.deriveKey":!0,"crypto.subtle.encrypt":!0,"crypto.subtle.exportKey":!0,"crypto.subtle.importKey":!0},packages:{"@metamask/utils":!0,buffer:!0}},"@metamask/chain-agnostic-permission":{globals:{"console.error":!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/chain-agnostic-permission>@metamask/api-specs":!0,"@metamask/chain-agnostic-permission>@metamask/controller-utils":!0,"@metamask/permission-controller":!0,"@metamask/utils":!0}},"@metamask/chain-agnostic-permission>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/chomp-api-service":{globals:{URL:!0,fetch:!0},packages:{"@metamask/base-data-service":!0,"@metamask/controller-utils":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,cockatiel:!0}},"@metamask/claims-controller":{packages:{"@metamask/controller-utils":!0}},"@metamask/client-controller":{packages:{"@metamask/base-controller":!0}},"@metamask/client-utils":{globals:{"Intl.DateTimeFormat":!0,"Intl.NumberFormat":!0},packages:{"@metamask/contract-metadata":!0,"@metamask/controller-utils":!0,"@metamask/keyring-api":!0,"@metamask/snaps-utils>@metamask/slip44":!0,"@metamask/transaction-controller":!0,"@metamask/utils":!0,"eth-chainlist":!0}},"@metamask/compliance-controller":{globals:{URL:!0},packages:{"@metamask/base-controller":!0,"@metamask/controller-utils":!0,"@metamask/superstruct":!0,reselect:!0}},"@metamask/config-registry-controller":{globals:{fetch:!0},packages:{"@metamask/config-registry-controller>@metamask/controller-utils":!0,"@metamask/config-registry-controller>@metamask/polling-controller":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,reselect:!0}},"@metamask/config-registry-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,cockatiel:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/config-registry-controller>@metamask/polling-controller":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"fast-json-stable-stringify":!0,uuid:!0}},"@metamask/connectivity-controller":{packages:{reselect:!0}},"@metamask/controller-utils":{globals:{"Buffer.from":!0,URL:!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/controller-utils>@spruceid/siwe-parser":!0,"@metamask/utils":!0,buffer:!0,cockatiel:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0,lodash:!0}},"@metamask/controller-utils>@metamask/eth-query":{packages:{"@metamask/ppom-validator>json-rpc-random-id":!0,"browserify>xtend":!0}},"@metamask/controller-utils>@metamask/ethjs-unit":{packages:{"@metamask/controller-utils>@metamask/ethjs-unit>@metamask/number-to-bn":!0,"ethereumjs-util>bn.js":!0}},"@metamask/controller-utils>@metamask/ethjs-unit>@metamask/number-to-bn":{packages:{"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format>strip-hex-prefix":!0,"ethereumjs-util>bn.js":!0}},"@metamask/controller-utils>@spruceid/siwe-parser":{globals:{"console.error":!0,"console.log":!0},packages:{"@metamask/controller-utils>@spruceid/siwe-parser>apg-js":!0,"@noble/hashes":!0}},"@metamask/controller-utils>@spruceid/siwe-parser>apg-js":{packages:{buffer:!0}},"@metamask/core-backend":{globals:{URL:!0,WebSocket:!0,clearTimeout:!0,fetch:!0,setTimeout:!0},packages:{"@metamask/core-backend>@metamask/controller-utils":!0,"@metamask/core-backend>uuid":!0,"@metamask/utils":!0,"@tanstack/react-query>@tanstack/query-core":!0,cockatiel:!0}},"@metamask/core-backend>uuid":{globals:{crypto:!0}},"@metamask/delegation-controller":{packages:{"@metamask/base-controller":!0,"@metamask/delegation-controller>@metamask/keyring-controller":!0,"@metamask/utils":!0}},"@metamask/delegation-controller>@metamask/keyring-controller":{globals:{"console.error":!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/base-controller":!0,"@metamask/eth-hd-keyring":!0,"@metamask/eth-sig-util":!0,"@metamask/keyring-controller>@metamask/eth-simple-keyring":!0,"@metamask/keyring-controller>ethereumjs-wallet":!0,"@metamask/keyring-controller>ulid":!0,"@metamask/utils":!0,"async-mutex":!0,lodash:!0}},"@metamask/delegation-core":{packages:{"@metamask/abi-utils":!0,"@metamask/utils":!0,"@noble/hashes":!0}},"@metamask/design-system-react":{globals:{ResizeObserver:!0,"console.warn":!0,"document.addEventListener":!0,"document.body":!0,"document.removeEventListener":!0},packages:{"@metamask/design-system-react>@floating-ui/react-dom":!0,"@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom":!0,"@metamask/design-system-react>@radix-ui/react-slot":!0,"@metamask/design-system-react>blo":!0,"@metamask/design-system-react>tailwind-merge":!0,"@metamask/design-system-shared":!0,"@metamask/jazzicon":!0,react:!0,"react-dom":!0,"react-focus-lock":!0}},"@metamask/design-system-react>@floating-ui/react-dom":{globals:{document:!0},packages:{"@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom":!0,"@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom>@floating-ui/utils":!0,react:!0,"react-dom":!0}},"@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom":{globals:{IntersectionObserver:!0,ResizeObserver:!0,cancelAnimationFrame:!0,clearTimeout:!0,getComputedStyle:!0,requestAnimationFrame:!0,setTimeout:!0},packages:{"@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom>@floating-ui/core":!0,"@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom>@floating-ui/utils":!0}},"@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom>@floating-ui/core":{packages:{"@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom>@floating-ui/utils":!0}},"@metamask/design-system-react>@floating-ui/react-dom>@floating-ui/dom>@floating-ui/utils":{globals:{CSS:!0,Element:!0,HTMLElement:!0,Node:!0,ShadowRoot:!0,document:!0}},"@metamask/design-system-react>@radix-ui/react-slot":{packages:{"@metamask/design-system-react>@radix-ui/react-slot>@radix-ui/react-compose-refs":!0,react:!0}},"@metamask/design-system-react>@radix-ui/react-slot>@radix-ui/react-compose-refs":{packages:{react:!0}},"@metamask/design-system-react>blo":{globals:{btoa:!0}},"@metamask/design-system-shared":{packages:{"@metamask/utils":!0}},"@metamask/eip-5792-middleware":{packages:{"@metamask/keyring-controller":!0,"@metamask/rpc-errors":!0,"@metamask/superstruct":!0,"@metamask/transaction-controller":!0,"@metamask/utils":!0,lodash:!0,uuid:!0}},"@metamask/eip-7702-internal-rpc-middleware":{packages:{"@metamask/rpc-errors":!0,"@metamask/superstruct":!0,"@metamask/utils":!0}},"@metamask/eth-hd-keyring":{globals:{"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0,TextEncoder:!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/eth-hd-keyring>ethereum-cryptography":!0,"@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32":!0,"@metamask/eth-sig-util":!0,"@metamask/keyring-api":!0,"@metamask/keyring-sdk":!0,"@metamask/scure-bip39":!0,"@metamask/snaps-sdk>@metamask/key-tree":!0,"@metamask/utils":!0,buffer:!0}},"@metamask/eth-hd-keyring>ethereum-cryptography":{globals:{TextDecoder:!0,crypto:!0,module:!0},packages:{"@metamask/eth-hd-keyring>ethereum-cryptography>@noble/hashes":!0}},"@metamask/eth-hd-keyring>ethereum-cryptography>@noble/curves":{globals:{TextEncoder:!0},packages:{"@metamask/eth-hd-keyring>ethereum-cryptography>@noble/hashes":!0}},"@metamask/eth-hd-keyring>ethereum-cryptography>@noble/hashes":{globals:{TextEncoder:!0,crypto:!0}},"@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32":{packages:{"@metamask/eth-hd-keyring>ethereum-cryptography>@noble/curves":!0,"@metamask/eth-hd-keyring>ethereum-cryptography>@noble/hashes":!0,"@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32>@scure/base":!0}},"@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32>@scure/base":{globals:{TextDecoder:!0,TextEncoder:!0}},"@metamask/eth-json-rpc-filters":{globals:{"console.error":!0},packages:{"@metamask/controller-utils>@metamask/eth-query":!0,"@metamask/eth-json-rpc-filters>@metamask/json-rpc-engine":!0,"@metamask/safe-event-emitter":!0,"async-mutex":!0,pify:!0}},"@metamask/eth-json-rpc-filters>@metamask/json-rpc-engine":{packages:{"@metamask/json-rpc-engine>klona":!0,"@metamask/messenger":!0,"@metamask/rpc-errors":!0,"@metamask/safe-event-emitter":!0,"@metamask/utils":!0}},"@metamask/eth-json-rpc-middleware":{globals:{TextEncoder:!0,setTimeout:!0},packages:{"@metamask/eth-json-rpc-middleware>safe-stable-stringify":!0,"@metamask/eth-sig-util":!0,"@metamask/json-rpc-engine":!0,"@metamask/json-rpc-engine>klona":!0,"@metamask/rpc-errors":!0,"@metamask/superstruct":!0,"@metamask/utils":!0}},"@metamask/eth-ledger-bridge-keyring":{globals:{addEventListener:!0,"document.createElement":!0,"document.head.appendChild":!0,fetch:!0,removeEventListener:!0,setTimeout:!0},packages:{"@ethereumjs/tx":!0,"@ethereumjs/tx>@ethereumjs/rlp":!0,"@ethereumjs/tx>@ethereumjs/util":!0,"@ledgerhq/device-management-kit":!0,"@ledgerhq/hw-transport":!0,"@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum":!0,"@metamask/eth-qr-keyring>hdkey":!0,"@metamask/eth-sig-util":!0,"@metamask/hw-wallet-sdk":!0,"@metamask/keyring-api":!0,"@metamask/keyring-sdk":!0,"@metamask/utils":!0,buffer:!0,rxjs:!0}},"@metamask/eth-ledger-bridge-keyring>@ledgerhq/context-module":{packages:{"@ledgerhq/device-management-kit":!0,"@ledgerhq/device-management-kit>inversify":!0,"@ledgerhq/device-management-kit>inversify>@inversifyjs/container":!0,"@ledgerhq/device-management-kit>inversify>@inversifyjs/core":!0,"@ledgerhq/device-management-kit>purify-ts":!0,"@ledgerhq/device-management-kit>reflect-metadata":!0,"@metamask/eth-ledger-bridge-keyring>@ledgerhq/context-module>ethers":!0,"@metamask/ppom-validator>crypto-js":!0,bs58:!0}},"@metamask/eth-ledger-bridge-keyring>@ledgerhq/context-module>ethers":{globals:{"console.log":!0},packages:{"@metamask/eth-ledger-bridge-keyring>@ledgerhq/context-module>ethers>@noble/hashes":!0}},"@metamask/eth-ledger-bridge-keyring>@ledgerhq/context-module>ethers>@noble/hashes":{globals:{TextEncoder:!0}},"@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum":{globals:{TextEncoder:!0},packages:{"@ledgerhq/device-management-kit":!0,"@ledgerhq/device-management-kit>inversify":!0,"@ledgerhq/device-management-kit>inversify>@inversifyjs/container":!0,"@ledgerhq/device-management-kit>inversify>@inversifyjs/core":!0,"@ledgerhq/device-management-kit>purify-ts":!0,"@ledgerhq/device-management-kit>reflect-metadata":!0,"@ledgerhq/device-management-kit>xstate":!0,"@metamask/eth-ledger-bridge-keyring>@ledgerhq/context-module":!0,"@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>@ledgerhq/signer-utils":!0,"@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>ethers":!0}},"@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>@ledgerhq/signer-utils":{packages:{"@ledgerhq/device-management-kit":!0}},"@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>ethers":{packages:{"@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>ethers>@noble/curves":!0,"@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>ethers>@noble/hashes":!0}},"@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>ethers>@noble/curves":{globals:{TextEncoder:!0},packages:{"@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>ethers>@noble/hashes":!0}},"@metamask/eth-ledger-bridge-keyring>@ledgerhq/device-signer-kit-ethereum>ethers>@noble/hashes":{globals:{TextEncoder:!0,crypto:!0}},"@metamask/eth-money-keyring":{packages:{"@metamask/eth-money-keyring>@metamask/eth-hd-keyring":!0,"@metamask/eth-money-keyring>@metamask/keyring-sdk":!0,"@metamask/keyring-api":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"async-mutex":!0}},"@metamask/eth-money-keyring>@metamask/eth-hd-keyring":{globals:{"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0,TextEncoder:!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography":!0,"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@scure/bip32":!0,"@metamask/eth-sig-util":!0,"@metamask/scure-bip39":!0,"@metamask/snaps-sdk>@metamask/key-tree":!0,"@metamask/utils":!0,buffer:!0}},"@metamask/eth-money-keyring>@metamask/keyring-sdk":{packages:{"@ethereumjs/tx":!0,"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography":!0,"@metamask/eth-money-keyring>@metamask/keyring-sdk>uuid":!0,"@metamask/eth-sig-util":!0,"@metamask/keyring-api":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"async-mutex":!0}},"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography":{globals:{TextDecoder:!0,crypto:!0,module:!0},packages:{"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@noble/hashes":!0}},"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@noble/curves":{globals:{TextEncoder:!0},packages:{"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@noble/hashes":!0}},"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@noble/hashes":{globals:{TextEncoder:!0,crypto:!0}},"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@scure/bip32":{packages:{"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@noble/curves":!0,"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@noble/hashes":!0,"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@scure/bip32>@scure/base":!0}},"@metamask/eth-money-keyring>@metamask/keyring-sdk>ethereum-cryptography>@scure/bip32>@scure/base":{globals:{TextDecoder:!0,TextEncoder:!0}},"@metamask/eth-money-keyring>@metamask/keyring-sdk>uuid":{globals:{crypto:!0}},"@metamask/eth-qr-keyring":{globals:{"Buffer.concat":!0,"Buffer.from":!0},packages:{"@ethereumjs/tx":!0,"@ethereumjs/tx>@ethereumjs/rlp":!0,"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth":!0,"@metamask/eth-qr-keyring>hdkey":!0,"@metamask/eth-qr-keyring>uuid":!0,"@metamask/keyring-api":!0,"@metamask/keyring-sdk":!0,"@metamask/utils":!0,buffer:!0}},"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth":{globals:{"Buffer.from":!0},packages:{"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util":!0,"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@keystonehq/bc-ur-registry":!0,"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>uuid":!0,"@metamask/eth-qr-keyring>hdkey":!0,buffer:!0}},"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util":{globals:{"Buffer.alloc":!0,"Buffer.allocUnsafe":!0,"Buffer.byteLength":!0,"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0,"console.warn":!0},packages:{"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>@ethereumjs/rlp":!0,"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>ethereum-cryptography":!0,buffer:!0,"eth-lattice-keyring>@ethereumjs/util>micro-ftch":!0,"webpack>events":!0}},"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>@ethereumjs/rlp":{globals:{TextEncoder:!0}},"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>ethereum-cryptography":{globals:{TextDecoder:!0,crypto:!0},packages:{"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>ethereum-cryptography>@noble/curves":!0,"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>ethereum-cryptography>@noble/hashes":!0}},"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>ethereum-cryptography>@noble/curves":{globals:{TextEncoder:!0},packages:{"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>ethereum-cryptography>@noble/hashes":!0}},"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@ethereumjs/util>ethereum-cryptography>@noble/hashes":{globals:{TextEncoder:!0,crypto:!0}},"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>@keystonehq/bc-ur-registry":{globals:{Buffer:!0,define:!0},packages:{"@ngraveio/bc-ur":!0,buffer:!0,"ethereumjs-util>ethereum-cryptography>bs58check":!0,tslib:!0}},"@metamask/eth-qr-keyring>@keystonehq/bc-ur-registry-eth>uuid":{globals:{crypto:!0,msCrypto:!0}},"@metamask/eth-qr-keyring>hdkey":{packages:{"@ngraveio/bc-ur>assert":!0,"crypto-browserify":!0,"ethereumjs-util>create-hash>ripemd160":!0,"ethereumjs-util>ethereum-cryptography>bs58check":!0,"ethereumjs-util>ethereum-cryptography>secp256k1":!0,"mockttp>express>safe-buffer":!0}},"@metamask/eth-qr-keyring>uuid":{globals:{crypto:!0}},"@metamask/eth-sig-util":{globals:{"Buffer.byteLength":!0,"Buffer.concat":!0,"Buffer.from":!0},packages:{"@metamask/abi-utils":!0,"@metamask/eth-sig-util>@ethereumjs/rlp":!0,"@metamask/eth-sig-util>@ethereumjs/util":!0,"@metamask/eth-sig-util>@scure/base":!0,"@metamask/eth-sig-util>ethereum-cryptography":!0,"@metamask/utils":!0,buffer:!0,tweetnacl:!0}},"@metamask/eth-sig-util>@ethereumjs/rlp":{globals:{TextEncoder:!0}},"@metamask/eth-sig-util>@ethereumjs/util":{globals:{"Buffer.alloc":!0,"Buffer.allocUnsafe":!0,"Buffer.byteLength":!0,"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0,"console.warn":!0},packages:{"@metamask/eth-sig-util>@ethereumjs/rlp":!0,"@metamask/eth-sig-util>ethereum-cryptography":!0,buffer:!0,"eth-lattice-keyring>@ethereumjs/util>micro-ftch":!0,"webpack>events":!0}},"@metamask/eth-sig-util>@scure/base":{globals:{TextDecoder:!0,TextEncoder:!0}},"@metamask/eth-sig-util>ethereum-cryptography":{globals:{TextDecoder:!0,crypto:!0},packages:{"@metamask/eth-sig-util>ethereum-cryptography>@noble/curves":!0,"@metamask/eth-sig-util>ethereum-cryptography>@noble/hashes":!0}},"@metamask/eth-sig-util>ethereum-cryptography>@noble/curves":{globals:{TextEncoder:!0},packages:{"@metamask/eth-sig-util>ethereum-cryptography>@noble/hashes":!0}},"@metamask/eth-sig-util>ethereum-cryptography>@noble/hashes":{globals:{TextEncoder:!0,crypto:!0}},"@metamask/eth-snap-keyring":{globals:{URL:!0,"console.error":!0,"console.info":!0,"console.warn":!0},packages:{"@ethereumjs/tx":!0,"@metamask/eth-sig-util":!0,"@metamask/eth-snap-keyring>@metamask/keyring-internal-snap-client":!0,"@metamask/eth-snap-keyring>@metamask/keyring-snap-sdk":!0,"@metamask/eth-snap-keyring>uuid":!0,"@metamask/keyring-api":!0,"@metamask/keyring-internal-api":!0,"@metamask/keyring-sdk":!0,"@metamask/keyring-utils":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"async-mutex":!0}},"@metamask/eth-snap-keyring>@metamask/keyring-internal-snap-client":{packages:{"@metamask/keyring-api":!0,"@metamask/keyring-internal-api":!0,"@metamask/keyring-snap-client":!0,"@metamask/keyring-utils":!0}},"@metamask/eth-snap-keyring>@metamask/keyring-snap-sdk":{packages:{"@metamask/superstruct":!0}},"@metamask/eth-snap-keyring>uuid":{globals:{crypto:!0}},"@metamask/eth-token-tracker":{globals:{"console.warn":!0},packages:{"@babel/runtime":!0,"@ethersproject/bignumber":!0,"@ethersproject/contracts":!0,"@ethersproject/providers":!0,"@metamask/eth-token-tracker>@metamask/eth-block-tracker":!0,"@metamask/eth-token-tracker>deep-equal":!0,"@metamask/safe-event-emitter":!0,"ethereumjs-util>bn.js":!0,"human-standard-token-abi":!0}},"@metamask/eth-token-tracker>@metamask/eth-block-tracker":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/ppom-validator>json-rpc-random-id":!0,"@metamask/safe-event-emitter":!0,"@metamask/utils":!0}},"@metamask/eth-token-tracker>deep-equal":{packages:{"@lavamoat/webpack>json-stable-stringify>isarray":!0,"@lavamoat/webpack>json-stable-stringify>object-keys":!0,"@metamask/eth-token-tracker>deep-equal>es-get-iterator":!0,"@metamask/eth-token-tracker>deep-equal>is-date-object":!0,"@metamask/eth-token-tracker>deep-equal>which-boxed-primitive":!0,"@metamask/eth-token-tracker>deep-equal>which-collection":!0,"@ngraveio/bc-ur>assert>object-is":!0,"browserify>util>is-arguments":!0,"browserify>util>which-typed-array":!0,"gulp>vinyl-fs>object.assign":!0,"string.prototype.matchall>call-bind":!0,"string.prototype.matchall>es-abstract>array-buffer-byte-length":!0,"string.prototype.matchall>es-abstract>is-array-buffer":!0,"string.prototype.matchall>es-abstract>is-regex":!0,"string.prototype.matchall>es-abstract>is-shared-array-buffer":!0,"string.prototype.matchall>get-intrinsic":!0,"string.prototype.matchall>regexp.prototype.flags":!0,"string.prototype.matchall>side-channel":!0}},"@metamask/eth-token-tracker>deep-equal>es-get-iterator":{globals:{process:!0},packages:{"@lavamoat/webpack>json-stable-stringify>isarray":!0,"@metamask/eth-token-tracker>deep-equal>es-get-iterator>is-map":!0,"browserify>util>is-arguments":!0,"eslint-plugin-react>array-includes>is-string":!0,process:!0,"string.prototype.matchall>call-bind":!0,"string.prototype.matchall>es-abstract>is-set":!0,"string.prototype.matchall>es-abstract>stop-iteration-iterator":!0,"string.prototype.matchall>get-intrinsic":!0,"string.prototype.matchall>has-symbols":!0}},"@metamask/eth-token-tracker>deep-equal>is-date-object":{packages:{"jsdom>form-data>es-set-tostringtag>has-tostringtag":!0,"string.prototype.matchall>call-bound":!0}},"@metamask/eth-token-tracker>deep-equal>which-boxed-primitive":{packages:{"@metamask/eth-token-tracker>deep-equal>which-boxed-primitive>is-bigint":!0,"@metamask/eth-token-tracker>deep-equal>which-boxed-primitive>is-boolean-object":!0,"@metamask/eth-token-tracker>deep-equal>which-boxed-primitive>is-number-object":!0,"eslint-plugin-react>array-includes>is-string":!0,"string.prototype.matchall>es-abstract>es-to-primitive>is-symbol":!0}},"@metamask/eth-token-tracker>deep-equal>which-boxed-primitive>is-bigint":{packages:{"string.prototype.matchall>es-abstract>unbox-primitive>has-bigints":!0}},"@metamask/eth-token-tracker>deep-equal>which-boxed-primitive>is-boolean-object":{packages:{"jsdom>form-data>es-set-tostringtag>has-tostringtag":!0,"string.prototype.matchall>call-bound":!0}},"@metamask/eth-token-tracker>deep-equal>which-boxed-primitive>is-number-object":{packages:{"jsdom>form-data>es-set-tostringtag>has-tostringtag":!0,"string.prototype.matchall>call-bound":!0}},"@metamask/eth-token-tracker>deep-equal>which-collection":{packages:{"@metamask/eth-token-tracker>deep-equal>es-get-iterator>is-map":!0,"@metamask/eth-token-tracker>deep-equal>which-collection>is-weakmap":!0,"@metamask/eth-token-tracker>deep-equal>which-collection>is-weakset":!0,"string.prototype.matchall>es-abstract>is-set":!0}},"@metamask/eth-token-tracker>deep-equal>which-collection>is-weakset":{packages:{"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>get-intrinsic":!0}},"@metamask/eth-trezor-keyring":{globals:{"Buffer.from":!0,setTimeout:!0},packages:{"@ethereumjs/tx":!0,"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/eth-qr-keyring>hdkey":!0,"@metamask/eth-sig-util":!0,"@metamask/eth-trezor-keyring>@trezor/connect-plugin-ethereum":!0,"@metamask/hw-wallet-sdk":!0,"@metamask/keyring-api":!0,"@metamask/keyring-sdk":!0,"@metamask/utils":!0,buffer:!0}},"@metamask/eth-trezor-keyring>@trezor/connect-plugin-ethereum":{packages:{"@metamask/eth-sig-util":!0,tslib:!0}},"@metamask/etherscan-link":{globals:{URL:!0}},"@metamask/gas-fee-controller":{globals:{clearInterval:!0,"console.error":!0,setInterval:!0},packages:{"@metamask/controller-utils":!0,"@metamask/controller-utils>@metamask/eth-query":!0,"@metamask/polling-controller":!0,"ethereumjs-util>bn.js":!0,uuid:!0}},"@metamask/gator-permissions-controller":{globals:{clearTimeout:!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"@metamask/delegation-core":!0,"@metamask/gator-permissions-controller>@metamask/abi-utils":!0,"@metamask/gator-permissions-controller>@metamask/delegation-deployments":!0,"@metamask/snaps-utils":!0,"@metamask/transaction-controller":!0,"@metamask/utils":!0}},"@metamask/gator-permissions-controller>@metamask/abi-utils":{packages:{"@metamask/superstruct":!0,"@metamask/utils":!0}},"@metamask/geolocation-controller":{globals:{fetch:!0},packages:{"@metamask/base-controller":!0,"@metamask/controller-utils":!0}},"@metamask/jazzicon":{globals:{"document.createElement":!0,"document.createElementNS":!0},packages:{"@metamask/jazzicon>color":!0,"@metamask/jazzicon>mersenne-twister":!0}},"@metamask/jazzicon>color":{packages:{"@metamask/jazzicon>color>clone":!0,"@metamask/jazzicon>color>color-convert":!0,"@metamask/jazzicon>color>color-string":!0}},"@metamask/jazzicon>color>clone":{globals:{Buffer:!0},packages:{buffer:!0}},"@metamask/jazzicon>color>color-convert":{packages:{"@metamask/jazzicon>color>color-convert>color-name":!0}},"@metamask/jazzicon>color>color-string":{packages:{"jest-canvas-mock>moo-color>color-name":!0}},"@metamask/json-rpc-engine":{packages:{"@metamask/json-rpc-engine>klona":!0,"@metamask/messenger":!0,"@metamask/rpc-errors":!0,"@metamask/safe-event-emitter":!0,"@metamask/utils":!0,"deep-freeze-strict":!0}},"@metamask/json-rpc-middleware-stream":{globals:{"console.warn":!0,setTimeout:!0},packages:{"@metamask/json-rpc-middleware-stream>readable-stream":!0,"@metamask/safe-event-emitter":!0,"@metamask/utils":!0}},"@metamask/json-rpc-middleware-stream>readable-stream":{globals:{"process.nextTick":!0,"process.stderr":!0,"process.stdout":!0},packages:{"browserify>string_decoder":!0,buffer:!0,"duplexify>inherits":!0,process:!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"@metamask/keyring-api":{packages:{"@metamask/keyring-utils":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"bitcoin-address-validation":!0}},"@metamask/keyring-controller":{globals:{"console.error":!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/assets-controller>lodash-es":!0,"@metamask/base-controller":!0,"@metamask/eth-hd-keyring":!0,"@metamask/eth-sig-util":!0,"@metamask/keyring-controller>@metamask/eth-simple-keyring":!0,"@metamask/keyring-controller>ethereumjs-wallet":!0,"@metamask/keyring-controller>ulid":!0,"@metamask/utils":!0,"async-mutex":!0}},"@metamask/keyring-controller>@metamask/eth-simple-keyring":{globals:{"Buffer.concat":!0,"Buffer.from":!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/eth-sig-util":!0,"@metamask/keyring-api":!0,"@metamask/keyring-controller>@metamask/eth-simple-keyring>ethereum-cryptography":!0,"@metamask/keyring-sdk":!0,"@metamask/utils":!0,buffer:!0,"crypto-browserify>randombytes":!0}},"@metamask/keyring-controller>@metamask/eth-simple-keyring>ethereum-cryptography":{globals:{TextDecoder:!0,crypto:!0,module:!0},packages:{"@metamask/keyring-controller>@metamask/eth-simple-keyring>ethereum-cryptography>@noble/hashes":!0}},"@metamask/keyring-controller>@metamask/eth-simple-keyring>ethereum-cryptography>@noble/hashes":{globals:{TextEncoder:!0}},"@metamask/keyring-controller>ethereumjs-wallet":{globals:{"Buffer.alloc":!0,"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0},packages:{"@metamask/keyring-controller>ethereumjs-wallet>ethereum-cryptography":!0,"@metamask/keyring-controller>ethereumjs-wallet>ethereumjs-util":!0,"@metamask/keyring-controller>ethereumjs-wallet>utf8":!0,buffer:!0,"crypto-browserify":!0,"crypto-browserify>randombytes":!0,"eth-lattice-keyring>gridplus-sdk>aes-js":!0,"ethereumjs-util>ethereum-cryptography>bs58check":!0,"ethers>@ethersproject/json-wallets>scrypt-js":!0,uuid:!0}},"@metamask/keyring-controller>ethereumjs-wallet>ethereum-cryptography":{globals:{"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0},packages:{"@ngraveio/bc-ur>assert":!0,buffer:!0,"crypto-browserify>create-hmac":!0,"crypto-browserify>randombytes":!0,"ethereumjs-util>ethereum-cryptography>bs58check":!0,"ethereumjs-util>ethereum-cryptography>keccak":!0,"ethereumjs-util>ethereum-cryptography>secp256k1":!0,"ethers>@ethersproject/sha2>hash.js":!0,"mockttp>express>safe-buffer":!0}},"@metamask/keyring-controller>ethereumjs-wallet>ethereumjs-util":{globals:{Buffer:!0},packages:{"@metamask/keyring-controller>ethereumjs-wallet>ethereum-cryptography":!0,"@ngraveio/bc-ur>assert":!0,buffer:!0,"ethereumjs-util>bn.js":!0,"ethereumjs-util>create-hash":!0,"ethereumjs-util>rlp":!0}},"@metamask/keyring-controller>ulid":{globals:{"console.error":!0,crypto:!0,require:!0}},"@metamask/keyring-internal-api":{packages:{"@metamask/keyring-api":!0,"@metamask/superstruct":!0}},"@metamask/keyring-sdk":{globals:{TextDecoder:!0,TextEncoder:!0},packages:{"@ethereumjs/tx":!0,"@metamask/eth-sig-util":!0,"@metamask/keyring-api":!0,"@metamask/keyring-sdk>ethereum-cryptography":!0,"@metamask/keyring-sdk>uuid":!0,"@metamask/keyring-utils":!0,"@metamask/scure-bip39":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"@noble/hashes":!0,"async-mutex":!0}},"@metamask/keyring-sdk>ethereum-cryptography":{globals:{TextDecoder:!0,crypto:!0,module:!0},packages:{"@metamask/keyring-sdk>ethereum-cryptography>@noble/hashes":!0}},"@metamask/keyring-sdk>ethereum-cryptography>@noble/hashes":{globals:{TextEncoder:!0}},"@metamask/keyring-sdk>uuid":{globals:{crypto:!0}},"@metamask/keyring-snap-client":{packages:{"@metamask/keyring-api":!0,"@metamask/keyring-snap-client>uuid":!0,"@metamask/keyring-utils":!0,"@metamask/superstruct":!0}},"@metamask/keyring-snap-client>uuid":{globals:{crypto:!0}},"@metamask/keyring-utils":{globals:{URL:!0},packages:{"@metamask/superstruct":!0,"@metamask/utils":!0,"bitcoin-address-validation":!0}},"@metamask/logging-controller":{packages:{"@metamask/base-controller":!0,"@metamask/utils":!0,uuid:!0}},"@metamask/logo":{globals:{Float32Array:!0,addEventListener:!0,"document.body.appendChild":!0,"document.createElementNS":!0,innerHeight:!0,innerWidth:!0,requestAnimationFrame:!0},packages:{"@metamask/logo>gl-mat4":!0,"@metamask/logo>gl-vec3":!0}},"@metamask/message-manager":{globals:{"Buffer.from":!0},packages:{"@metamask/base-controller":!0,"@metamask/controller-utils":!0,"@metamask/utils":!0,buffer:!0,uuid:!0,"webpack>events":!0}},"@metamask/message-manager>jsonschema":{packages:{"browserify>url":!0}},"@metamask/messenger":{globals:{"console.error":!0}},"@metamask/mobile-wallet-protocol-core":{globals:{"Buffer.from":!0,"console.warn":!0,setImmediate:!0,setTimeout:!0},packages:{"@metamask/mobile-wallet-protocol-core>centrifuge":!0,"@metamask/mobile-wallet-protocol-core>eventemitter3":!0,"@metamask/mobile-wallet-protocol-core>uuid":!0,"async-mutex":!0,buffer:!0,"core-js-pure":!0}},"@metamask/mobile-wallet-protocol-core>centrifuge":{globals:{AbortController:!1,Event:!1,EventSource:!1,EventTarget:!1,MessageEvent:!1,ReadableStream:!1,SockJS:!1,SuppressedError:!1,TextDecoder:!0,TextEncoder:!0,URL:!1,WebSocket:!0,WebTransport:!1,addEventListener:!0,clearTimeout:!0,console:!1,"console.warn":!0,document:!1,fetch:!1,localStorage:!1,setTimeout:!0}},"@metamask/mobile-wallet-protocol-core>uuid":{globals:{crypto:!0}},"@metamask/mobile-wallet-protocol-dapp-client":{globals:{clearTimeout:!0,setTimeout:!0},packages:{"@metamask/mobile-wallet-protocol-core":!0,"@metamask/mobile-wallet-protocol-dapp-client>uuid":!0,"@metamask/utils":!0}},"@metamask/mobile-wallet-protocol-dapp-client>uuid":{globals:{crypto:!0}},"@metamask/money-account-api-data-service":{globals:{URL:!0,fetch:!0},packages:{"@metamask/base-data-service":!0,"@metamask/money-account-api-data-service>@metamask/controller-utils":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,cockatiel:!0}},"@metamask/money-account-api-data-service>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/money-account-balance-service":{globals:{URL:!0,fetch:!0},packages:{"@ethersproject/contracts":!0,"@ethersproject/providers":!0,"@metamask/base-data-service":!0,"@metamask/metamask-eth-abis":!0,"@metamask/money-account-balance-service>@metamask/controller-utils":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,cockatiel:!0}},"@metamask/money-account-balance-service>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/money-account-controller":{globals:{"console.warn":!0},packages:{"@metamask/accounts-controller":!0,"@metamask/base-controller":!0,"@metamask/keyring-api":!0,"@metamask/money-account-controller>@metamask/eth-money-keyring":!0,"@metamask/money-account-controller>@metamask/keyring-controller":!0,"@metamask/utils":!0,"async-mutex":!0}},"@metamask/money-account-controller>@metamask/eth-money-keyring":{packages:{"@metamask/keyring-api":!0,"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring":!0,"@metamask/superstruct":!0,"async-mutex":!0}},"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring":{globals:{"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0,TextEncoder:!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/eth-sig-util":!0,"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography":!0,"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32":!0,"@metamask/scure-bip39":!0,"@metamask/snaps-sdk>@metamask/key-tree":!0,"@metamask/utils":!0,buffer:!0}},"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography":{globals:{TextDecoder:!0,crypto:!0,module:!0},packages:{"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@noble/hashes":!0}},"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@noble/curves":{globals:{TextEncoder:!0},packages:{"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@noble/hashes":!0}},"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@noble/hashes":{globals:{TextEncoder:!0,crypto:!0}},"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32":{packages:{"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@noble/curves":!0,"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@noble/hashes":!0,"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32>@scure/base":!0}},"@metamask/money-account-controller>@metamask/eth-money-keyring>@metamask/eth-hd-keyring>ethereum-cryptography>@scure/bip32>@scure/base":{globals:{TextDecoder:!0,TextEncoder:!0}},"@metamask/money-account-controller>@metamask/keyring-controller":{globals:{"console.error":!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/base-controller":!0,"@metamask/eth-hd-keyring":!0,"@metamask/eth-sig-util":!0,"@metamask/keyring-controller>@metamask/eth-simple-keyring":!0,"@metamask/keyring-controller>ethereumjs-wallet":!0,"@metamask/keyring-controller>ulid":!0,"@metamask/utils":!0,"async-mutex":!0,lodash:!0}},"@metamask/money-account-upgrade-controller":{globals:{"crypto.getRandomValues":!0},packages:{"@metamask/base-controller":!0,"@metamask/delegation-core":!0,"@metamask/money-account-upgrade-controller>@metamask/delegation-deployments":!0,"@metamask/money-account-upgrade-controller>@metamask/keyring-controller":!0,"@metamask/money-account-utils":!0,"@metamask/utils":!0}},"@metamask/money-account-upgrade-controller>@metamask/keyring-controller":{globals:{"console.error":!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/base-controller":!0,"@metamask/eth-hd-keyring":!0,"@metamask/eth-sig-util":!0,"@metamask/keyring-controller>@metamask/eth-simple-keyring":!0,"@metamask/keyring-controller>ethereumjs-wallet":!0,"@metamask/keyring-controller>ulid":!0,"@metamask/utils":!0,"async-mutex":!0,lodash:!0}},"@metamask/money-account-utils":{packages:{"@ethersproject/abi":!0,"@ethersproject/contracts":!0,"@metamask/transaction-controller":!0,"@metamask/utils":!0}},"@metamask/multichain-account-service":{globals:{clearTimeout:!0,"console.error":!0,"console.warn":!0,"performance.now":!0,setTimeout:!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/account-api":!0,"@metamask/eth-snap-keyring":!0,"@metamask/keyring-api":!0,"@metamask/keyring-controller":!0,"@metamask/keyring-snap-client":!0,"@metamask/snaps-utils":!0,"@metamask/utils":!0,"async-mutex":!0}},"@metamask/multichain-api-middleware":{globals:{"console.error":!0},packages:{"@metamask/controller-utils":!0,"@metamask/eth-json-rpc-filters":!0,"@metamask/message-manager>jsonschema":!0,"@metamask/multichain-api-middleware>@metamask/api-specs":!0,"@metamask/multichain-api-middleware>@metamask/chain-agnostic-permission":!0,"@metamask/multichain-api-middleware>@metamask/json-rpc-engine":!0,"@metamask/permission-controller":!0,"@metamask/rpc-errors":!0,"@metamask/safe-event-emitter":!0,"@metamask/utils":!0,"@open-rpc/schema-utils-js":!0}},"@metamask/multichain-api-middleware>@metamask/chain-agnostic-permission":{globals:{"console.error":!0},packages:{"@metamask/controller-utils":!0,"@metamask/multichain-api-middleware>@metamask/api-specs":!0,"@metamask/permission-controller":!0,"@metamask/rpc-errors":!0,"@metamask/utils":!0,lodash:!0}},"@metamask/multichain-network-controller":{globals:{URL:!0},packages:{"@metamask/base-controller":!0,"@metamask/keyring-api":!0,"@metamask/multichain-network-controller>@metamask/keyring-api":!0,"@metamask/network-controller":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,lodash:!0}},"@metamask/multichain-transactions-controller":{globals:{"console.error":!0},packages:{"@metamask/base-controller":!0,"@metamask/keyring-api":!0,"@metamask/keyring-snap-client":!0,"@metamask/snaps-utils":!0}},"@metamask/name-controller":{globals:{fetch:!0},packages:{"@metamask/base-controller":!0,"@metamask/name-controller>@metamask/controller-utils":!0,"@metamask/utils":!0,"async-mutex":!0}},"@metamask/name-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0,lodash:!0}},"@metamask/network-connection-banner-controller":{globals:{clearTimeout:!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"@metamask/connectivity-controller":!0,"@metamask/network-connection-banner-controller>@metamask/client-controller":!0,"@metamask/network-controller":!0,"@metamask/network-enablement-controller":!0,"@metamask/utils":!0,reselect:!0}},"@metamask/network-controller":{globals:{"Intl.NumberFormat":!0,URL:!0,btoa:!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/base-controller":!0,"@metamask/config-registry-controller":!0,"@metamask/controller-utils>@metamask/eth-query":!0,"@metamask/eth-json-rpc-middleware":!0,"@metamask/json-rpc-engine":!0,"@metamask/network-controller>@metamask/connectivity-controller":!0,"@metamask/network-controller>@metamask/controller-utils":!0,"@metamask/network-controller>@metamask/eth-block-tracker":!0,"@metamask/network-controller>@metamask/eth-json-rpc-infura":!0,"@metamask/network-controller>@metamask/eth-json-rpc-provider":!0,"@metamask/network-controller>@metamask/swappable-obj-proxy":!0,"@metamask/network-controller>immer":!0,"@metamask/network-controller>reselect":!0,"@metamask/network-controller>uuid":!0,"@metamask/remote-feature-flag-controller":!0,"@metamask/rpc-errors":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"addons-linter>deepmerge":!0,cockatiel:!0,"eslint>fast-deep-equal":!0,"uri-js":!0}},"@metamask/network-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,cockatiel:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/network-controller>@metamask/eth-block-tracker":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/ppom-validator>json-rpc-random-id":!0,"@metamask/safe-event-emitter":!0,"@metamask/utils":!0}},"@metamask/network-controller>@metamask/eth-json-rpc-infura":{globals:{fetch:!0,setTimeout:!0},packages:{"@metamask/network-controller>@metamask/eth-json-rpc-infura>@metamask/eth-json-rpc-provider":!0,"@metamask/network-controller>@metamask/eth-json-rpc-infura>@metamask/json-rpc-engine":!0,"@metamask/rpc-errors":!0,"@metamask/utils":!0}},"@metamask/network-controller>@metamask/eth-json-rpc-infura>@metamask/eth-json-rpc-provider":{packages:{"@metamask/network-controller>@metamask/eth-json-rpc-infura>@metamask/json-rpc-engine":!0,"@metamask/rpc-errors":!0,"@metamask/safe-event-emitter":!0,uuid:!0}},"@metamask/network-controller>@metamask/eth-json-rpc-infura>@metamask/json-rpc-engine":{packages:{"@metamask/json-rpc-engine>klona":!0,"@metamask/messenger":!0,"@metamask/rpc-errors":!0,"@metamask/safe-event-emitter":!0,"@metamask/utils":!0}},"@metamask/network-controller>@metamask/eth-json-rpc-provider":{packages:{"@metamask/json-rpc-engine":!0,nanoid:!0}},"@metamask/network-controller>immer":{globals:{Iterator:!0}},"@metamask/network-controller>reselect":{globals:{WeakRef:!0,"console.warn":!0}},"@metamask/network-controller>uuid":{globals:{crypto:!0}},"@metamask/network-enablement-controller":{packages:{"@metamask/base-controller":!0,"@metamask/controller-utils":!0,"@metamask/keyring-api":!0,"@metamask/multichain-network-controller":!0,"@metamask/snaps-utils>@metamask/slip44":!0,"@metamask/utils":!0,reselect:!0}},"@metamask/notification-services-controller":{globals:{addEventListener:!0,"console.error":!0,fetch:!0,registration:!0,removeEventListener:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/authenticated-user-storage":!0,"@metamask/base-controller":!0,"@metamask/notification-services-controller>@contentful/rich-text-html-renderer":!0,"@metamask/notification-services-controller>@metamask/controller-utils":!0,"@metamask/notification-services-controller>firebase":!0,"@metamask/notification-services-controller>uuid":!0,"@metamask/utils":!0,loglevel:!0,semver:!0}},"@metamask/notification-services-controller>@contentful/rich-text-html-renderer":{globals:{SuppressedError:!0}},"@metamask/notification-services-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,cockatiel:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/notification-services-controller>firebase":{packages:{"@metamask/notification-services-controller>firebase>@firebase/app":!0,"@metamask/notification-services-controller>firebase>@firebase/messaging":!0}},"@metamask/notification-services-controller>firebase>@firebase/app":{globals:{FinalizationRegistry:!0,"console.warn":!0},packages:{"@metamask/notification-services-controller>firebase>@firebase/app>@firebase/component":!0,"@metamask/notification-services-controller>firebase>@firebase/app>@firebase/logger":!0,"@metamask/notification-services-controller>firebase>@firebase/app>idb":!0,"@metamask/notification-services-controller>firebase>@firebase/util":!0}},"@metamask/notification-services-controller>firebase>@firebase/app>@firebase/component":{packages:{"@metamask/notification-services-controller>firebase>@firebase/util":!0}},"@metamask/notification-services-controller>firebase>@firebase/app>@firebase/logger":{globals:{console:!0}},"@metamask/notification-services-controller>firebase>@firebase/app>idb":{globals:{DOMException:!0,IDBCursor:!0,IDBDatabase:!0,IDBIndex:!0,IDBObjectStore:!0,IDBRequest:!0,IDBTransaction:!0,"indexedDB.deleteDatabase":!0,"indexedDB.open":!0}},"@metamask/notification-services-controller>firebase>@firebase/installations":{globals:{BroadcastChannel:!0,Headers:!0,btoa:!0,"console.error":!0,crypto:!0,fetch:!0,msCrypto:!0,"navigator.onLine":!0,setTimeout:!0},packages:{"@metamask/notification-services-controller>firebase>@firebase/app":!0,"@metamask/notification-services-controller>firebase>@firebase/app>@firebase/component":!0,"@metamask/notification-services-controller>firebase>@firebase/app>idb":!0,"@metamask/notification-services-controller>firebase>@firebase/util":!0}},"@metamask/notification-services-controller>firebase>@firebase/messaging":{globals:{Headers:!0,"Notification.maxActions":!0,"Notification.permission":!0,"Notification.requestPermission":!0,PushManager:!0,"PushSubscription.prototype.hasOwnProperty":!0,ServiceWorkerRegistration:!0,URL:!0,addEventListener:!0,atob:!0,btoa:!0,clearTimeout:!0,"clients.matchAll":!0,"clients.openWindow":!0,"console.warn":!0,document:!0,fetch:!0,indexedDB:!0,"location.href":!0,"location.origin":!0,navigator:!0,"origin.replace":!0,"registration.showNotification":!0,setTimeout:!0},packages:{"@metamask/notification-services-controller>firebase>@firebase/app":!0,"@metamask/notification-services-controller>firebase>@firebase/app>@firebase/component":!0,"@metamask/notification-services-controller>firebase>@firebase/app>idb":!0,"@metamask/notification-services-controller>firebase>@firebase/installations":!0,"@metamask/notification-services-controller>firebase>@firebase/util":!0}},"@metamask/notification-services-controller>firebase>@firebase/util":{globals:{WorkerGlobalScope:!0,atob:!0,browser:!0,btoa:!0,chrome:!0,console:!0,document:!0,indexedDB:!0,navigator:!0,process:!0,setTimeout:!0},packages:{process:!0}},"@metamask/notification-services-controller>uuid":{globals:{crypto:!0}},"@metamask/object-multiplex":{globals:{"console.warn":!0},packages:{"@metamask/object-multiplex>once":!0,"@metamask/object-multiplex>readable-stream":!0}},"@metamask/object-multiplex>once":{packages:{"@metamask/object-multiplex>once>wrappy":!0}},"@metamask/object-multiplex>readable-stream":{globals:{"process.nextTick":!0,"process.stderr":!0,"process.stdout":!0},packages:{"browserify>string_decoder":!0,buffer:!0,"duplexify>inherits":!0,process:!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"@metamask/obs-store":{packages:{"@metamask/obs-store>readable-stream":!0,"@metamask/safe-event-emitter":!0}},"@metamask/obs-store>readable-stream":{globals:{"process.nextTick":!0,"process.stderr":!0,"process.stdout":!0},packages:{"browserify>string_decoder":!0,buffer:!0,"duplexify>inherits":!0,process:!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"@metamask/passkey-controller":{globals:{TextDecoder:!0,TextEncoder:!0,"crypto.subtle.importKey":!0,"crypto.subtle.verify":!0},packages:{"@metamask/base-controller":!0,"@metamask/passkey-controller>@levischuck/tiny-cbor":!0,"@metamask/utils":!0,"@noble/ciphers":!0,"@noble/curves":!0,"@noble/hashes":!0,"async-mutex":!0}},"@metamask/passkey-controller>@levischuck/tiny-cbor":{globals:{TextDecoder:!0,TextEncoder:!0}},"@metamask/permission-controller":{globals:{"console.error":!0},packages:{"@metamask/base-controller":!0,"@metamask/json-rpc-engine":!0,"@metamask/messenger":!0,"@metamask/permission-controller>@metamask/controller-utils":!0,"@metamask/rpc-errors":!0,"@metamask/utils":!0,"deep-freeze-strict":!0,immer:!0,nanoid:!0}},"@metamask/permission-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/permission-log-controller":{packages:{"@metamask/base-controller":!0,"@metamask/utils":!0}},"@metamask/perps-controller":{globals:{AbortController:!0,URLSearchParams:!0,clearInterval:!0,clearTimeout:!0,fetch:!0,"performance.now":!0,setInterval:!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"@metamask/perps-controller>@metamask/abi-utils":!0,"@metamask/perps-controller>@metamask/controller-utils":!0,"@metamask/perps-controller>@nktkas/hyperliquid":!0,"@metamask/perps-controller>bignumber.js":!0,"@metamask/perps-controller>reselect":!0,"@metamask/perps-controller>uuid":!0,"@metamask/superstruct":!0,"@metamask/utils":!0}},"@metamask/perps-controller>@metamask/abi-utils":{packages:{"@metamask/superstruct":!0,"@metamask/utils":!0}},"@metamask/perps-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/perps-controller>@nktkas/hyperliquid":{globals:{AbortController:!0,AbortSignal:!0,CustomEvent:!0,DOMException:!0,DecompressionStream:!0,Event:!0,EventTarget:!0,Headers:!0,Response:!0,TextDecoder:!0,TextEncoder:!0,URL:!0,atob:!0,clearInterval:!0,clearTimeout:!0,fetch:!0,setInterval:!0,setTimeout:!0},packages:{"@metamask/perps-controller>@nktkas/hyperliquid>@nktkas/rews":!0,"@metamask/perps-controller>@nktkas/hyperliquid>@noble/hashes":!0,"@metamask/perps-controller>@nktkas/hyperliquid>valibot":!0}},"@metamask/perps-controller>@nktkas/hyperliquid>@nktkas/rews":{globals:{AbortController:!0,Blob:!0,CloseEvent:!0,DOMException:!0,Event:!0,EventTarget:!0,MessageEvent:!0,TextEncoder:!0,URL:!0,WebSocket:!0,clearTimeout:!0,setTimeout:!0}},"@metamask/perps-controller>@nktkas/hyperliquid>@noble/hashes":{globals:{TextEncoder:!0,crypto:!0}},"@metamask/perps-controller>@nktkas/hyperliquid>valibot":{globals:{Blob:!0,File:!0,"Intl.Segmenter":!0,TextEncoder:!0,URL:!0}},"@metamask/perps-controller>bignumber.js":{globals:{crypto:!0}},"@metamask/perps-controller>reselect":{globals:{WeakRef:!0,"console.warn":!0}},"@metamask/perps-controller>uuid":{globals:{crypto:!0}},"@metamask/phishing-controller":{globals:{TextEncoder:!0,URL:!0,"console.error":!0,"console.warn":!0,fetch:!0},packages:{"@metamask/base-controller":!0,"@metamask/phishing-controller>@metamask/controller-utils":!0,"@metamask/transaction-controller":!0,"@noble/hashes":!0,"ethereum-cryptography":!0,punycode:!0,"stylelint>fastest-levenshtein":!0}},"@metamask/phishing-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/polling-controller":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"fast-json-stable-stringify":!0,uuid:!0}},"@metamask/post-message-stream":{globals:{"MessageEvent.prototype":!0,WorkerGlobalScope:!0,addEventListener:!0,browser:!0,chrome:!0,"location.origin":!0,postMessage:!0,removeEventListener:!0},packages:{"@metamask/post-message-stream>readable-stream":!0,"@metamask/utils":!0}},"@metamask/post-message-stream>readable-stream":{globals:{"process.nextTick":!0,"process.stderr":!0,"process.stdout":!0},packages:{"browserify>string_decoder":!0,buffer:!0,"duplexify>inherits":!0,process:!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"@metamask/ppom-validator":{globals:{"Buffer.from":!0,URL:!0,"console.error":!0,crypto:!0},packages:{"@metamask/base-controller":!0,"@metamask/ppom-validator>@metamask/controller-utils":!0,"@metamask/ppom-validator>await-semaphore":!0,"@metamask/ppom-validator>crypto-js":!0,"@metamask/ppom-validator>json-rpc-random-id":!0,"@toruslabs/eccrypto>elliptic":!0,buffer:!0}},"@metamask/ppom-validator>@metamask/controller-utils":{globals:{"Buffer.from":!0,URL:!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/controller-utils>@spruceid/siwe-parser":!0,"@metamask/utils":!0,buffer:!0,cockatiel:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0,lodash:!0}},"@metamask/ppom-validator>await-semaphore":{globals:{process:!0,setImmediate:!0},packages:{"core-js-pure":!0,process:!0}},"@metamask/ppom-validator>crypto-js":{globals:{Float32Array:!0,Float64Array:!0,crypto:!0,define:!0,msCrypto:!0}},"@metamask/profile-metrics-controller":{globals:{URL:!0,"console.error":!0},packages:{"@metamask/keyring-controller":!0,"@metamask/profile-metrics-controller>@metamask/controller-utils":!0,"@metamask/profile-metrics-controller>@metamask/polling-controller":!0,"@metamask/profile-metrics-controller>uuid":!0,"@metamask/profile-sync-controller":!0,"@metamask/snaps-utils":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"async-mutex":!0}},"@metamask/profile-metrics-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,cockatiel:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/profile-metrics-controller>@metamask/polling-controller":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"@metamask/profile-metrics-controller>@metamask/polling-controller>uuid":!0,"fast-json-stable-stringify":!0}},"@metamask/profile-metrics-controller>@metamask/polling-controller>uuid":{globals:{crypto:!0,msCrypto:!0}},"@metamask/profile-metrics-controller>uuid":{globals:{crypto:!0}},"@metamask/profile-sync-controller":{globals:{"Buffer.from":!0,Event:!0,TextDecoder:!0,TextEncoder:!0,URL:!0,URLSearchParams:!0,addEventListener:!0,atob:!0,clearTimeout:!0,"console.error":!0,"console.warn":!0,dispatchEvent:!0,fetch:!0,removeEventListener:!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"@metamask/keyring-controller":!0,"@metamask/profile-sync-controller>@signinwithethereum/siwe":!0,"@metamask/snaps-sdk>@metamask/key-tree":!0,"@metamask/snaps-utils>@metamask/cryptography":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"@noble/curves":!0,"@noble/hashes":!0,buffer:!0,loglevel:!0}},"@metamask/profile-sync-controller>@signinwithethereum/siwe":{globals:{"crypto.getRandomValues":!0},packages:{"@metamask/wallet>@metamask/controller-utils>@signinwithethereum/siwe-parser":!0,ethers:!0,viem:!0}},"@metamask/providers":{globals:{console:!0},packages:{"@metamask/json-rpc-middleware-stream":!0,"@metamask/providers>@metamask/json-rpc-engine":!0,"@metamask/providers>is-stream":!0,"@metamask/providers>readable-stream":!0,"@metamask/rpc-errors":!0,"@metamask/safe-event-emitter":!0,"eslint>fast-deep-equal":!0}},"@metamask/providers>@metamask/json-rpc-engine":{packages:{"@metamask/messenger":!0,"@metamask/rpc-errors":!0,"@metamask/safe-event-emitter":!0,"@metamask/utils":!0}},"@metamask/providers>readable-stream":{globals:{"process.nextTick":!0,"process.stderr":!0,"process.stdout":!0},packages:{"browserify>string_decoder":!0,buffer:!0,"duplexify>inherits":!0,process:!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"@metamask/ramps-controller":{globals:{AbortController:!0,URL:!0,clearInterval:!0,"console.error":!0,crypto:!0,setInterval:!0},packages:{"@metamask/base-controller":!0,"@metamask/ramps-controller>@metamask/controller-utils":!0,"@metamask/ramps-controller>bignumber.js":!0,cockatiel:!0,"eslint>fast-deep-equal":!0}},"@metamask/ramps-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,cockatiel:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/ramps-controller>bignumber.js":{globals:{crypto:!0}},"@metamask/rate-limit-controller":{globals:{setTimeout:!0},packages:{"@metamask/base-controller":!0,"@metamask/rpc-errors":!0,"@metamask/utils":!0}},"@metamask/react-data-query":{packages:{"@metamask/utils":!0,"@tanstack/react-query":!0,"@tanstack/react-query>@tanstack/query-core":!0}},"@metamask/remote-feature-flag-controller":{globals:{TextEncoder:!0},packages:{"@metamask/base-controller":!0,"@metamask/remote-feature-flag-controller>@metamask/controller-utils":!0,"@metamask/utils":!0,uuid:!0}},"@metamask/remote-feature-flag-controller>@metamask/controller-utils":{packages:{cockatiel:!0}},"@metamask/rpc-errors":{packages:{"@metamask/rpc-errors>fast-safe-stringify":!0,"@metamask/utils":!0}},"@metamask/safe-event-emitter":{globals:{setTimeout:!0},packages:{"webpack>events":!0}},"@metamask/scure-bip39":{globals:{TextEncoder:!0},packages:{"@metamask/scure-bip39>@noble/hashes":!0,"@metamask/scure-bip39>@scure/base":!0}},"@metamask/scure-bip39>@noble/hashes":{globals:{TextEncoder:!0,crypto:!0}},"@metamask/scure-bip39>@scure/base":{globals:{TextDecoder:!0,TextEncoder:!0}},"@metamask/seedless-onboarding-controller":{packages:{"@metamask/base-controller":!0,"@metamask/seedless-onboarding-controller>@metamask/auth-network-utils":!0,"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup":!0,"@metamask/utils":!0,"@noble/ciphers":!0,"@noble/curves":!0,"async-mutex":!0}},"@metamask/seedless-onboarding-controller>@metamask/auth-network-utils":{globals:{"Buffer.from":!0,clearTimeout:!0,setTimeout:!0},packages:{"@noble/hashes":!0,buffer:!0,"eslint>json-stable-stringify-without-jsonify":!0,"ethereumjs-util>bn.js":!0}},"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup":{globals:{Buffer:!0,URL:!0,"console.error":!0,fetch:!0},packages:{"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@metamask/auth-network-utils":!0,"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/fetch-node-details":!0,"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/http-helpers":!0,"@noble/ciphers":!0,"@noble/curves":!0,"@noble/hashes":!0,"@toruslabs/eccrypto":!0,buffer:!0,"ethereumjs-util>bn.js":!0}},"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@metamask/auth-network-utils":{globals:{"Buffer.concat":!0,"Buffer.from":!0,clearTimeout:!0,setTimeout:!0},packages:{"@noble/curves":!0,"@noble/hashes":!0,"@toruslabs/eccrypto>elliptic":!0,buffer:!0,"eslint>json-stable-stringify-without-jsonify":!0,"ethereumjs-util>bn.js":!0}},"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/fetch-node-details":{packages:{"@babel/runtime":!0,"@metamask/seedless-onboarding-controller>@metamask/auth-network-utils>@toruslabs/constants":!0,"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/fetch-node-details>@toruslabs/fnd-base":!0,"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/fetch-node-details>@toruslabs/http-helpers":!0,loglevel:!0}},"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/fetch-node-details>@toruslabs/fnd-base":{packages:{"@metamask/seedless-onboarding-controller>@metamask/auth-network-utils>@toruslabs/constants":!0}},"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/fetch-node-details>@toruslabs/http-helpers":{globals:{URL:!0,clearTimeout:!0,fetch:!0,setTimeout:!0},packages:{"@babel/runtime":!0,"addons-linter>deepmerge":!0,loglevel:!0}},"@metamask/seedless-onboarding-controller>@metamask/toprf-secure-backup>@toruslabs/http-helpers":{globals:{URL:!0,clearTimeout:!0,fetch:!0,setTimeout:!0},packages:{"@babel/runtime":!0,"addons-linter>deepmerge":!0,loglevel:!0}},"@metamask/selected-network-controller":{packages:{"@metamask/base-controller":!0,"@metamask/network-controller>@metamask/swappable-obj-proxy":!0}},"@metamask/sentinel-api-service":{globals:{fetch:!0},packages:{"@metamask/base-data-service":!0,"@metamask/sentinel-api-service>@metamask/controller-utils":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,cockatiel:!0}},"@metamask/sentinel-api-service>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/shield-controller":{globals:{AbortController:!0,fetch:!0},packages:{"@metamask/base-data-service":!0,"@metamask/controller-utils":!0,"@metamask/signature-controller":!0,cockatiel:!0}},"@metamask/signature-controller":{globals:{"Buffer.from":!0,fetch:!0},packages:{"@metamask/approval-controller":!0,"@metamask/base-controller":!0,"@metamask/controller-utils":!0,"@metamask/eth-sig-util":!0,"@metamask/message-manager>jsonschema":!0,"@metamask/signature-controller>@metamask/keyring-controller":!0,"@metamask/signature-controller>@metamask/logging-controller":!0,"@metamask/utils":!0,buffer:!0,uuid:!0,"webpack>events":!0}},"@metamask/signature-controller>@metamask/keyring-controller":{globals:{"console.error":!0},packages:{"@ethereumjs/tx>@ethereumjs/util":!0,"@metamask/base-controller":!0,"@metamask/eth-hd-keyring":!0,"@metamask/eth-sig-util":!0,"@metamask/keyring-controller>@metamask/eth-simple-keyring":!0,"@metamask/keyring-controller>ethereumjs-wallet":!0,"@metamask/keyring-controller>ulid":!0,"@metamask/utils":!0,"async-mutex":!0,lodash:!0}},"@metamask/smart-transactions-controller":{globals:{URLSearchParams:!0,clearInterval:!0,"console.error":!0,"console.log":!0,fetch:!0,setInterval:!0},packages:{"@ethersproject/bytes":!0,"@ethersproject/transactions":!0,"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/eth-query":!0,"@metamask/smart-transactions-controller>@metamask/controller-utils":!0,"@metamask/smart-transactions-controller>@metamask/polling-controller":!0,"@metamask/smart-transactions-controller>bignumber.js":!0,"@metamask/superstruct":!0,"@metamask/transaction-controller":!0,"@metamask/utils":!0,"ethers>@ethersproject/keccak256":!0,reselect:!0}},"@metamask/smart-transactions-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/smart-transactions-controller>@metamask/polling-controller":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"fast-json-stable-stringify":!0,uuid:!0}},"@metamask/smart-transactions-controller>bignumber.js":{globals:{crypto:!0}},"@metamask/snap-account-service":{globals:{"console.error":!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/eth-snap-keyring":!0,"@metamask/eth-snap-keyring>@metamask/keyring-internal-snap-client":!0,"@metamask/eth-snap-keyring>@metamask/keyring-snap-sdk":!0,"@metamask/keyring-api":!0,"@metamask/keyring-controller":!0,"@metamask/utils":!0}},"@metamask/snaps-controllers":{globals:{DecompressionStream:!0,URL:!0,WebSocket:!0,clearTimeout:!0,"document.getElementById":!0,"fetch.bind":!0,setTimeout:!0},packages:{"@metamask/approval-controller":!0,"@metamask/base-controller":!0,"@metamask/json-rpc-middleware-stream":!0,"@metamask/object-multiplex":!0,"@metamask/permission-controller":!0,"@metamask/post-message-stream":!0,"@metamask/rpc-errors":!0,"@metamask/snaps-controllers>@metamask/json-rpc-engine":!0,"@metamask/snaps-controllers>@xstate/fsm":!0,"@metamask/snaps-controllers>concat-stream":!0,"@metamask/snaps-controllers>get-npm-tarball-url":!0,"@metamask/snaps-controllers>readable-stream":!0,"@metamask/snaps-controllers>readable-web-to-node-stream":!0,"@metamask/snaps-controllers>tar-stream":!0,"@metamask/snaps-registry":!0,"@metamask/snaps-rpc-methods":!0,"@metamask/snaps-sdk":!0,"@metamask/snaps-utils":!0,"@metamask/utils":!0,"async-mutex":!0,"cron-parser":!0,"eslint>fast-deep-equal":!0,immer:!0,luxon:!0,nanoid:!0,semver:!0}},"@metamask/snaps-controllers>@metamask/json-rpc-engine":{packages:{"@metamask/json-rpc-engine>klona":!0,"@metamask/messenger":!0,"@metamask/rpc-errors":!0,"@metamask/safe-event-emitter":!0,"@metamask/utils":!0,"deep-freeze-strict":!0}},"@metamask/snaps-controllers>concat-stream":{globals:{"Buffer.concat":!0,"Buffer.isBuffer":!0},packages:{"@metamask/snaps-controllers>readable-stream":!0,"browserify>concat-stream>buffer-from":!0,"browserify>concat-stream>typedarray":!0,buffer:!0,"duplexify>inherits":!0}},"@metamask/snaps-controllers>readable-stream":{globals:{"process.nextTick":!0,"process.stderr":!0,"process.stdout":!0},packages:{"browserify>string_decoder":!0,buffer:!0,"duplexify>inherits":!0,process:!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"@metamask/snaps-controllers>readable-web-to-node-stream":{packages:{"@metamask/snaps-controllers>readable-web-to-node-stream>readable-stream":!0}},"@metamask/snaps-controllers>readable-web-to-node-stream>readable-stream":{globals:{"process.nextTick":!0,"process.stderr":!0,"process.stdout":!0},packages:{"browserify>string_decoder":!0,buffer:!0,"duplexify>inherits":!0,process:!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"@metamask/snaps-controllers>tar-stream":{packages:{"@metamask/snaps-controllers>tar-stream>b4a":!0,"@metamask/snaps-controllers>tar-stream>fast-fifo":!0,"@metamask/snaps-controllers>tar-stream>streamx":!0}},"@metamask/snaps-controllers>tar-stream>b4a":{globals:{TextDecoder:!0,TextEncoder:!0}},"@metamask/snaps-controllers>tar-stream>streamx":{globals:{"process.nextTick":!0,queueMicrotask:!0},packages:{"@metamask/snaps-controllers>tar-stream>fast-fifo":!0,"@metamask/snaps-controllers>tar-stream>streamx>events-universal":!0,"@metamask/snaps-controllers>tar-stream>streamx>text-decoder":!0}},"@metamask/snaps-controllers>tar-stream>streamx>events-universal":{packages:{"webpack>events":!0}},"@metamask/snaps-controllers>tar-stream>streamx>text-decoder":{packages:{"@metamask/snaps-controllers>tar-stream>b4a":!0}},"@metamask/snaps-execution-environments":{globals:{"document.getElementById":!0},packages:{"@metamask/post-message-stream":!0,"@metamask/snaps-utils":!0,"@metamask/utils":!0}},"@metamask/snaps-registry":{globals:{crypto:!0},packages:{"@metamask/superstruct":!0,"@metamask/utils":!0,"@noble/curves":!0,"@noble/hashes":!0}},"@metamask/snaps-rpc-methods":{packages:{"@metamask/json-rpc-engine":!0,"@metamask/permission-controller":!0,"@metamask/rpc-errors":!0,"@metamask/snaps-sdk":!0,"@metamask/snaps-sdk>@metamask/key-tree":!0,"@metamask/snaps-utils":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"@noble/hashes":!0,"async-mutex":!0}},"@metamask/snaps-sdk":{globals:{URL:!0},packages:{"@metamask/rpc-errors":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,luxon:!0}},"@metamask/snaps-sdk>@metamask/key-tree":{globals:{"crypto.subtle":!0,ed25519:!0,ed25519Bip32:!0,secp256k1:!0},packages:{"@metamask/scure-bip39":!0,"@metamask/utils":!0,"@noble/curves":!0,"@noble/hashes":!0,"@scure/base":!0}},"@metamask/snaps-utils":{globals:{File:!0,FileReader:!0,TextDecoder:!0,TextEncoder:!0,URL:!0,"console.error":!0,"console.log":!0,"console.warn":!0,"document.body.appendChild":!0,"document.createElement":!0,fetch:!0,navigator:!0},packages:{"@metamask/permission-controller":!0,"@metamask/rpc-errors":!0,"@metamask/snaps-sdk":!0,"@metamask/snaps-sdk>@metamask/key-tree":!0,"@metamask/snaps-utils>@metamask/cryptography":!0,"@metamask/snaps-utils>@metamask/slip44":!0,"@metamask/snaps-utils>fast-xml-parser":!0,"@metamask/snaps-utils>marked":!0,"@metamask/snaps-utils>rfdc":!0,"@metamask/snaps-utils>validate-npm-package-name":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"@scure/base":!0,chalk:!0,"cron-parser":!0,"fast-json-stable-stringify":!0,luxon:!0,semver:!0}},"@metamask/snaps-utils>@metamask/cryptography":{globals:{"crypto.getRandomValues":!0,"crypto.subtle.decrypt":!0,"crypto.subtle.digest":!0,"crypto.subtle.encrypt":!0,"crypto.subtle.importKey":!0}},"@metamask/snaps-utils>fast-xml-parser":{globals:{"exports.isExist":!0},packages:{"@metamask/snaps-utils>fast-xml-parser>@nodable/entities":!0,"@metamask/snaps-utils>fast-xml-parser>path-expression-matcher":!0,"@metamask/snaps-utils>fast-xml-parser>strnum":!0}},"@metamask/snaps-utils>marked":{globals:{"console.error":!0,"console.warn":!0}},"@metamask/snaps-utils>rfdc":{globals:{Buffer:!0},packages:{buffer:!0}},"@metamask/snaps-utils>validate-npm-package-name":{packages:{"@metamask/snaps-utils>validate-npm-package-name>builtins":!0}},"@metamask/snaps-utils>validate-npm-package-name>builtins":{globals:{"process.version":!0},packages:{process:!0,semver:!0}},"@metamask/transaction-controller":{globals:{"Buffer.from":!0,clearInterval:!0,clearTimeout:!0,"console.error":!0,fetch:!0,setInterval:!0,setTimeout:!0},packages:{"@ethereumjs/tx":!0,"@ethereumjs/tx>@ethereumjs/common":!0,"@ethereumjs/tx>@ethereumjs/rlp":!0,"@ethereumjs/tx>@ethereumjs/util":!0,"@ethersproject/abi":!0,"@ethersproject/contracts":!0,"@metamask/assets-controller>lodash-es":!0,"@metamask/base-controller":!0,"@metamask/metamask-eth-abis":!0,"@metamask/network-controller":!0,"@metamask/rpc-errors":!0,"@metamask/transaction-controller>@metamask/controller-utils":!0,"@metamask/transaction-controller>@metamask/gas-fee-controller":!0,"@metamask/transaction-controller>@metamask/nonce-tracker":!0,"@metamask/transaction-controller>bignumber.js":!0,"@metamask/transaction-controller>uuid":!0,"@metamask/utils":!0,"async-mutex":!0,buffer:!0,"eth-method-registry":!0,"ethereum-cryptography":!0,"ethereumjs-util>bn.js":!0,"ethers>@ethersproject/wallet":!0,"webpack>events":!0}},"@metamask/transaction-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/transaction-controller>@metamask/gas-fee-controller":{globals:{clearInterval:!0,"console.error":!0,setInterval:!0},packages:{"@metamask/controller-utils>@metamask/eth-query":!0,"@metamask/transaction-controller>@metamask/controller-utils":!0,"@metamask/transaction-controller>@metamask/gas-fee-controller>@metamask/polling-controller":!0,"@metamask/transaction-controller>@metamask/gas-fee-controller>uuid":!0,"ethereumjs-util>bn.js":!0}},"@metamask/transaction-controller>@metamask/gas-fee-controller>@metamask/polling-controller":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"@metamask/transaction-controller>@metamask/gas-fee-controller>@metamask/polling-controller>uuid":!0,"fast-json-stable-stringify":!0}},"@metamask/transaction-controller>@metamask/gas-fee-controller>@metamask/polling-controller>uuid":{globals:{crypto:!0,msCrypto:!0}},"@metamask/transaction-controller>@metamask/gas-fee-controller>uuid":{globals:{crypto:!0,msCrypto:!0}},"@metamask/transaction-controller>@metamask/nonce-tracker":{packages:{"@ethersproject/providers":!0,"@ngraveio/bc-ur>assert":!0,"async-mutex":!0}},"@metamask/transaction-controller>bignumber.js":{globals:{crypto:!0}},"@metamask/transaction-controller>uuid":{globals:{crypto:!0}},"@metamask/transaction-pay-controller":{globals:{AbortController:!0,URLSearchParams:!0,clearTimeout:!0,fetch:!0,setTimeout:!0},packages:{"@ethersproject/abi":!0,"@metamask/assets-controller>lodash-es":!0,"@metamask/base-controller":!0,"@metamask/keyring-controller":!0,"@metamask/metamask-eth-abis":!0,"@metamask/network-controller":!0,"@metamask/sentinel-api-service":!0,"@metamask/transaction-controller":!0,"@metamask/transaction-pay-controller>@metamask/controller-utils":!0,"@metamask/transaction-pay-controller>@metamask/ramps-controller":!0,"@metamask/transaction-pay-controller>bignumber.js":!0,"@metamask/utils":!0}},"@metamask/transaction-pay-controller>@metamask/controller-utils":{globals:{"Buffer.from":!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,buffer:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/transaction-pay-controller>@metamask/ramps-controller":{globals:{URL:!0},packages:{"@metamask/transaction-pay-controller>@metamask/controller-utils":!0}},"@metamask/transaction-pay-controller>bignumber.js":{globals:{crypto:!0}},"@metamask/user-operation-controller":{globals:{fetch:!0},packages:{"@metamask/base-controller":!0,"@metamask/controller-utils":!0,"@metamask/controller-utils>@metamask/eth-query":!0,"@metamask/gas-fee-controller":!0,"@metamask/polling-controller":!0,"@metamask/rpc-errors":!0,"@metamask/superstruct":!0,"@metamask/transaction-controller":!0,"@metamask/utils":!0,"ethereumjs-util>bn.js":!0,lodash:!0,uuid:!0,"webpack>events":!0}},"@metamask/utils":{globals:{Buffer:!0,TextDecoder:!0,TextEncoder:!0,crypto:!0},packages:{"@metamask/superstruct":!0,"@metamask/utils>pony-cause":!0,"@noble/hashes":!0,"@scure/base":!0,buffer:!0,lodash:!0,"nock>debug":!0,semver:!0}},"@metamask/wallet":{packages:{"@metamask/accounts-controller":!0,"@metamask/base-controller":!0,"@metamask/browser-passworder":!0,"@metamask/client-controller":!0,"@metamask/config-registry-controller":!0,"@metamask/keyring-controller":!0,"@metamask/logging-controller":!0,"@metamask/messenger":!0,"@metamask/network-controller":!0,"@metamask/passkey-controller":!0,"@metamask/permission-controller":!0,"@metamask/remote-feature-flag-controller":!0,"@metamask/seedless-onboarding-controller":!0,"@metamask/selected-network-controller":!0,"@metamask/transaction-controller":!0,"@metamask/utils":!0,"@metamask/wallet>@metamask/address-book-controller":!0,"@metamask/wallet>@metamask/approval-controller":!0,"@metamask/wallet>@metamask/claims-controller":!0,"@metamask/wallet>@metamask/connectivity-controller":!0,"@metamask/wallet>@metamask/controller-utils":!0,"@metamask/wallet>@metamask/gas-fee-controller":!0,"@metamask/wallet>@metamask/shield-controller":!0,"@metamask/wallet>@metamask/storage-service":!0,"@metamask/wallet>@metamask/subscription-controller":!0}},"@metamask/wallet>@metamask/address-book-controller":{packages:{"@metamask/base-controller":!0,"@metamask/wallet>@metamask/controller-utils":!0}},"@metamask/wallet>@metamask/approval-controller":{globals:{"console.info":!0},packages:{"@metamask/base-controller":!0,"@metamask/rpc-errors":!0,nanoid:!0}},"@metamask/wallet>@metamask/claims-controller":{globals:{fetch:!0},packages:{"@metamask/base-controller":!0,"@metamask/base-data-service":!0,"@metamask/superstruct":!0,"@metamask/utils":!0,"@metamask/wallet>@metamask/controller-utils":!0}},"@metamask/wallet>@metamask/connectivity-controller":{packages:{"@metamask/base-controller":!0}},"@metamask/wallet>@metamask/controller-utils":{globals:{"Buffer.from":!0,URL:!0,"console.error":!0,fetch:!0,setTimeout:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/controller-utils>@metamask/ethjs-unit":!0,"@metamask/utils":!0,"@metamask/wallet>@metamask/controller-utils>@signinwithethereum/siwe-parser":!0,buffer:!0,cockatiel:!0,"eslint>fast-deep-equal":!0,"eth-ens-namehash":!0,"ethereumjs-util>bn.js":!0}},"@metamask/wallet>@metamask/controller-utils>@signinwithethereum/siwe-parser":{packages:{"@metamask/controller-utils>@spruceid/siwe-parser>apg-js":!0,"@noble/hashes":!0}},"@metamask/wallet>@metamask/controller-utils>bignumber.js":{globals:{crypto:!0}},"@metamask/wallet>@metamask/gas-fee-controller":{globals:{clearInterval:!0,"console.error":!0,setInterval:!0},packages:{"@metamask/controller-utils>@metamask/eth-query":!0,"@metamask/wallet>@metamask/controller-utils":!0,"@metamask/wallet>@metamask/gas-fee-controller>@metamask/polling-controller":!0,"ethereumjs-util>bn.js":!0,uuid:!0}},"@metamask/wallet>@metamask/gas-fee-controller>@metamask/polling-controller":{globals:{clearTimeout:!0,"console.error":!0,setTimeout:!0},packages:{"@metamask/base-controller":!0,"fast-json-stable-stringify":!0,uuid:!0}},"@metamask/wallet>@metamask/shield-controller":{globals:{AbortController:!0,fetch:!0},packages:{"@metamask/assets-controller>lodash-es":!0,"@metamask/base-controller":!0,"@metamask/base-data-service":!0,"@metamask/transaction-controller":!0,"@metamask/utils":!0,"@metamask/wallet>@metamask/controller-utils":!0,"@metamask/wallet>@metamask/shield-controller>@metamask/signature-controller":!0,cockatiel:!0}},"@metamask/wallet>@metamask/storage-service":{globals:{"console.error":!0,"console.warn":!0}},"@metamask/wallet>@metamask/subscription-controller":{globals:{URL:!0,"crypto.getRandomValues":!0,fetch:!0},packages:{"@ethersproject/abi":!0,"@metamask/base-data-service":!0,"@metamask/delegation-core":!0,"@metamask/superstruct":!0,"@metamask/transaction-controller":!0,"@metamask/utils":!0,"@metamask/wallet>@metamask/controller-utils":!0,"@metamask/wallet>@metamask/controller-utils>bignumber.js":!0,"@metamask/wallet>@metamask/gas-fee-controller>@metamask/polling-controller":!0,"@metamask/wallet>@metamask/subscription-controller>@metamask/delegation-deployments":!0,"@metamask/wallet>@metamask/subscription-controller>@metamask/money-account-utils":!0,cockatiel:!0,"eslint>fast-deep-equal":!0}},"@metamask/wallet>@metamask/subscription-controller>@metamask/money-account-utils":{packages:{"@metamask/transaction-controller":!0,"@metamask/utils":!0}},"@mui/material":{globals:{CSS:!0,DocumentFragment:!0,IntersectionObserver:!0,MutationObserver:!0,ResizeObserver:!0,addEventListener:!0,cancelAnimationFrame:!0,clearInterval:!0,clearTimeout:!0,"console.error":!0,"console.warn":!0,"document.activeElement":!0,"document.body":!0,getSelection:!0,navigator:!0,"performance.now":!0,removeEventListener:!0,requestAnimationFrame:!0,setInterval:!0,setTimeout:!0},packages:{"@babel/runtime":!0,"@emotion/react":!0,"@mui/material>react-is":!0,"@mui/system":!0,"@mui/system>@mui/utils":!0,clsx:!0,"prop-types":!0,react:!0,"react-dom":!0,"react-transition-group":!0}},"@mui/system":{globals:{"console.error":!0,"console.warn":!0,"document.createElement":!0,"document.querySelector":!0,matchMedia:!0},packages:{"@babel/runtime":!0,"@emotion/react":!0,"@mui/system>@mui/private-theming":!0,"@mui/system>@mui/styled-engine":!0,"@mui/system>@mui/utils":!0,"prop-types":!0,react:!0}},"@mui/system>@mui/private-theming":{globals:{"console.error":!0},packages:{"@babel/runtime":!0,"@mui/system>@mui/utils":!0,"prop-types":!0,react:!0}},"@mui/system>@mui/styled-engine":{globals:{"console.error":!0,document:!0},packages:{"@emotion/react":!0,"@emotion/react>@emotion/cache":!0,"@emotion/react>@emotion/serialize":!0,"@emotion/styled":!0,"prop-types":!0,react:!0}},"@mui/system>@mui/utils":{globals:{clearTimeout:!0,"console.error":!0,document:!0,innerWidth:!0,setTimeout:!0},packages:{"@babel/runtime":!0,"@mui/system>@mui/utils>react-is":!0,clsx:!0,react:!0}},"@mui/x-date-pickers":{globals:{Intl:!0,Range:!0,addEventListener:!0,clearTimeout:!0,"console.error":!0,"console.warn":!0,document:!0,innerHeight:!0,navigator:!0,orientation:!0,removeEventListener:!0,screen:!0,setTimeout:!0},packages:{"@babel/runtime":!0,"@mui/material":!0,"@mui/system":!0,"@mui/x-date-pickers>@mui/utils":!0,"@mui/x-date-pickers>@mui/x-internals":!0,clsx:!0,luxon:!0,"prop-types":!0,react:!0,"react-transition-group":!0}},"@mui/x-date-pickers>@mui/utils":{globals:{URL:!0,"console.error":!0},packages:{clsx:!0,"prop-types":!0,react:!0}},"@ngraveio/bc-ur":{globals:{"Buffer.alloc":!0,"Buffer.allocUnsafe":!0,"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0},packages:{"@ngraveio/bc-ur>@keystonehq/alias-sampling":!0,"@ngraveio/bc-ur>assert":!0,"@ngraveio/bc-ur>bignumber.js":!0,"@ngraveio/bc-ur>cbor-sync":!0,"@ngraveio/bc-ur>crc":!0,"@ngraveio/bc-ur>jsbi":!0,"@ngraveio/bc-ur>sha.js":!0,buffer:!0}},"@ngraveio/bc-ur>assert":{globals:{console:!0,"process.emitWarning":!0,"process.stderr":!0},packages:{"@ngraveio/bc-ur>assert>is-nan":!0,"@ngraveio/bc-ur>assert>object-is":!0,"browserify>util":!0,"gulp>vinyl-fs>object.assign":!0,process:!0,"string.prototype.matchall>call-bind":!0}},"@ngraveio/bc-ur>assert>is-nan":{packages:{"string.prototype.matchall>call-bind":!0,"string.prototype.matchall>define-properties":!0}},"@ngraveio/bc-ur>assert>object-is":{packages:{"string.prototype.matchall>call-bind":!0,"string.prototype.matchall>define-properties":!0}},"@ngraveio/bc-ur>bignumber.js":{globals:{crypto:!0,define:!0}},"@ngraveio/bc-ur>cbor-sync":{globals:{Buffer:!0,define:!0},packages:{buffer:!0}},"@ngraveio/bc-ur>crc":{packages:{"@ngraveio/bc-ur>crc>buffer":!0}},"@ngraveio/bc-ur>crc>buffer":{globals:{console:!0},packages:{"base64-js":!0,"buffer>ieee754":!0}},"@ngraveio/bc-ur>jsbi":{globals:{Float64Array:!0,define:!0}},"@ngraveio/bc-ur>sha.js":{packages:{"@ngraveio/bc-ur>sha.js>to-buffer":!0,"duplexify>inherits":!0,"mockttp>express>safe-buffer":!0}},"@ngraveio/bc-ur>sha.js>to-buffer":{packages:{"@lavamoat/webpack>json-stable-stringify>isarray":!0,"mockttp>express>safe-buffer":!0,"string.prototype.matchall>es-abstract>typed-array-buffer":!0}},"@noble/ciphers":{globals:{TextDecoder:!0,TextEncoder:!0,crypto:!0}},"@noble/curves":{packages:{"@noble/hashes":!0}},"@noble/hashes":{globals:{TextDecoder:!0,TextEncoder:!0,crypto:!0}},"@open-rpc/schema-utils-js":{packages:{"@metamask/rpc-errors>fast-safe-stringify":!0,"@open-rpc/meta-schema":!0,"@open-rpc/schema-utils-js>@json-schema-tools/dereferencer":!0,"@open-rpc/schema-utils-js>@json-schema-tools/meta-schema":!0,"@open-rpc/schema-utils-js>@json-schema-tools/reference-resolver":!0,"@open-rpc/schema-utils-js>is-url":!0,"eslint>ajv":!0}},"@open-rpc/schema-utils-js>@json-schema-tools/dereferencer":{packages:{"@metamask/rpc-errors>fast-safe-stringify":!0,"@open-rpc/schema-utils-js>@json-schema-tools/dereferencer>@json-schema-tools/traverse":!0,"@open-rpc/schema-utils-js>@json-schema-tools/reference-resolver":!0}},"@open-rpc/schema-utils-js>@json-schema-tools/reference-resolver":{packages:{"@open-rpc/schema-utils-js>@json-schema-tools/reference-resolver>@json-schema-spec/json-pointer":!0,"@open-rpc/test-coverage>isomorphic-fetch":!0}},"@open-rpc/test-coverage>isomorphic-fetch":{globals:{"fetch.bind":!0},packages:{"@open-rpc/test-coverage>isomorphic-fetch>whatwg-fetch":!0}},"@open-rpc/test-coverage>isomorphic-fetch>whatwg-fetch":{globals:{AbortController:!0,Blob:!0,DOMException:!0,FileReader:!0,FormData:!0,"URLSearchParams.prototype.isPrototypeOf":!0,XMLHttpRequest:!0,"console.warn":!0,fetch:!0,setTimeout:!0}},"@popperjs/core":{globals:{Element:!0,HTMLElement:!0,ShadowRoot:!0,devicePixelRatio:!0,document:!0,"navigator.userAgent":!0,"navigator.userAgentData":!0}},"@reduxjs/toolkit":{globals:{AbortController:!0,__REDUX_DEVTOOLS_EXTENSION_COMPOSE__:!0,__REDUX_DEVTOOLS_EXTENSION__:!0,console:!0,process:!0,queueMicrotask:!0,requestAnimationFrame:!0,setTimeout:!0},packages:{"@reduxjs/toolkit>reselect":!0,immer:!0,process:!0,redux:!0,"redux-thunk":!0}},"@rive-app/react-canvas":{globals:{IntersectionObserver:!0,ResizeObserver:!0,addEventListener:!0,clearTimeout:!0,"console.error":!0,devicePixelRatio:!0,"document.documentElement.clientHeight":!0,"document.documentElement.clientWidth":!0,innerHeight:!0,innerWidth:!0,matchMedia:!0,removeEventListener:!0,setTimeout:!0},packages:{"@rive-app/react-canvas>@rive-app/canvas":!0,react:!0}},"@rive-app/react-canvas>@rive-app/canvas":{globals:{AudioContext:!1,Blob:!0,DOMMatrix:!1,FinalizationRegistry:!1,Float32Array:!0,Float64Array:!0,HTMLCanvasElement:!0,Image:!0,Iterator:!1,MouseEvent:!1,Path2D:!0,Request:!0,ResizeObserver:!1,TextDecoder:!0,"URL.createObjectURL":!0,"URL.revokeObjectURL":!0,WebAssembly:!0,XMLHttpRequest:!1,cancelAnimationFrame:!0,clearInterval:!0,clearTimeout:!0,console:!0,crypto:!1,define:!1,devicePixelRatio:!0,document:!1,"document.createElement":!0,fetch:!1,h:!1,importScripts:!1,location:!1,navigator:!1,"navigator.userAgent":!0,"performance.now":!0,prompt:!1,readline:!1,requestAnimationFrame:!0,setTimeout:!0,webkitAudioContext:!1}},"@scure/base":{globals:{TextDecoder:!0,TextEncoder:!0}},"@segment/analytics-node":{globals:{AbortController:!0,EdgeRuntime:!1,URL:!0,WebSocketPair:!1,WorkerGlobalScope:!1,clearTimeout:!0,"console.warn":!0,fetch:!0,importScripts:!1,process:!0,setTimeout:!0},packages:{"@segment/analytics-node>@lukeed/uuid":!0,"@segment/analytics-node>@segment/analytics-core":!0,"@segment/analytics-node>@segment/analytics-generic-utils":!0,"@segment/analytics-node>jose":!0,process:!0}},"@segment/analytics-node>@segment/analytics-core":{globals:{clearTimeout:!0,console:!0,setTimeout:!0},packages:{"@segment/analytics-node>@lukeed/uuid":!0,"@segment/analytics-node>@segment/analytics-core>dset":!0,"@segment/analytics-node>@segment/analytics-generic-utils":!0,tslib:!0}},"@segment/analytics-node>@segment/analytics-generic-utils":{globals:{"console.warn":!0}},"@segment/analytics-node>jose":{globals:{CryptoKey:!0,TextDecoder:!0,TextEncoder:!0,atob:!0,btoa:!0,crypto:!0}},"@sentry/browser":{globals:{Headers:!0,"PerformanceObserver.supportedEntryTypes":!0,Request:!0,URL:!0,WebAssembly:!0,"XMLHttpRequest.prototype":!0,__SENTRY_DEBUG__:!0,__SENTRY_RELEASE__:!0,addEventListener:!0,clearTimeout:!0,"console.error":!0,fetch:!0,importScripts:!0,"indexedDB.open":!0,"performance.timeOrigin":!0,setTimeout:!0},packages:{"@sentry/browser>@sentry-internal/browser-utils":!0,"@sentry/browser>@sentry-internal/feedback":!0,"@sentry/browser>@sentry-internal/replay":!0,"@sentry/browser>@sentry-internal/replay-canvas":!0,"@sentry/core":!0}},"@sentry/browser>@sentry-internal/browser-utils":{globals:{FormData:!0,PerformanceEventTiming:!0,PerformanceObserver:!0,Request:!0,URL:!0,URLSearchParams:!0,"XMLHttpRequest.prototype":!0,__SENTRY_DEBUG__:!0,addEventListener:!0,clearTimeout:!0,performance:!0,setTimeout:!0},packages:{"@sentry/core":!0}},"@sentry/browser>@sentry-internal/feedback":{globals:{FormData:!0,HTMLFormElement:!0,__SENTRY_DEBUG__:!0,cancelAnimationFrame:!0,clearTimeout:!0,"document.createElement":!0,"document.createElementNS":!0,"document.createTextNode":!0,getComputedStyle:!0,isSecureContext:!0,matchMedia:!0,requestAnimationFrame:!0,setTimeout:!0},packages:{"@sentry/core":!0}},"@sentry/browser>@sentry-internal/replay":{globals:{Blob:!0,CSSConditionRule:!0,CSSGroupingRule:!0,CSSMediaRule:!0,CSSRule:!0,CSSSupportsRule:!0,Document:!0,DragEvent:!0,Element:!0,FormData:!0,HTMLElement:!0,HTMLFormElement:!0,Headers:!0,MouseEvent:!0,MutationObserver:!0,"Node.DOCUMENT_FRAGMENT_NODE":!0,"Node.prototype.contains":!0,PointerEvent:!0,Request:!0,TextEncoder:!0,URL:!0,URLSearchParams:!0,Worker:!0,"Zone.__symbol__":!0,__RRWEB_EXCLUDE_IFRAME__:!0,__RRWEB_EXCLUDE_SHADOW_DOM__:!0,__SENTRY_DEBUG__:!0,__SENTRY_EXCLUDE_REPLAY_WORKER__:!0,__rrMutationObserver:!0,addEventListener:!0,clearTimeout:!0,"console.debug":!0,"console.error":!0,"console.warn":!0,"customElements.get":!0,document:!0,innerHeight:!0,innerWidth:!0,"location.href":!0,"location.origin":!0,parent:!0,setTimeout:!0},packages:{"@sentry/browser>@sentry-internal/browser-utils":!0,"@sentry/core":!0}},"@sentry/browser>@sentry-internal/replay-canvas":{globals:{Blob:!0,Float32Array:!0,Float64Array:!0,HTMLCanvasElement:!0,HTMLImageElement:!0,ImageData:!0,"URL.createObjectURL":!0,WeakRef:!0,Worker:!0,cancelAnimationFrame:!0,"console.debug":!0,"console.error":!0,createImageBitmap:!0,document:!0,"performance.now":!0},packages:{"@sentry/core":!0}},"@sentry/core":{globals:{CustomEvent:!0,DOMError:!0,DOMException:!0,EdgeRuntime:!0,Element:!0,ErrorEvent:!0,Event:!0,HTMLElement:!0,Headers:!0,Request:!0,Response:!0,TextDecoder:!0,TextEncoder:!0,URL:!0,URLSearchParams:!0,__SENTRY_BROWSER_BUNDLE__:!0,__SENTRY_DEBUG__:!0,__SENTRY_TRACING__:!0,clearTimeout:!0,"console.error":!0,"console.warn":!0,document:!0,module:!0,process:!0,setTimeout:!0},packages:{process:!0}},"@simplewebauthn/browser":{globals:{AbortController:!0,AbortSignal:!0,PublicKeyCredential:!0,atob:!0,btoa:!0,"console.warn":!0,"document.querySelectorAll":!0,"location.hostname":!0,"navigator.credentials.create":!0,"navigator.credentials.get":!0}},"@solana/addresses":{globals:{"Intl.Collator":!0,TextEncoder:!0,"crypto.subtle.digest":!0,"crypto.subtle.exportKey":!0},packages:{"@solana/addresses>@solana/assertions":!0,"@solana/addresses>@solana/codecs-core":!0,"@solana/addresses>@solana/codecs-strings":!0,"@solana/addresses>@solana/errors":!0}},"@solana/addresses>@solana/codecs-core":{packages:{"@solana/addresses>@solana/errors":!0}},"@solana/addresses>@solana/codecs-strings":{globals:{TextDecoder:!0,TextEncoder:!0,atob:!0,btoa:!0},packages:{"@solana/addresses>@solana/codecs-core":!0,"@solana/addresses>@solana/errors":!0}},"@solana/addresses>@solana/errors":{globals:{btoa:!0}},"@tanstack/react-query":{globals:{"console.error":!0},packages:{"@tanstack/react-query>@tanstack/query-core":!0,react:!0}},"@tanstack/react-query>@tanstack/query-core":{globals:{AbortController:!0,addEventListener:!1,clearInterval:!0,clearTimeout:!0,"console.error":!0,"console.warn":!0,document:!1,removeEventListener:!0,setInterval:!0,setTimeout:!0}},"@tanstack/react-virtual":{globals:{document:!0,scrollY:!0},packages:{"@tanstack/react-virtual>@tanstack/virtual-core":!0,react:!0,"react-dom":!0}},"@tanstack/react-virtual>@tanstack/virtual-core":{globals:{"console.info":!0,"console.warn":!0,requestAnimationFrame:!0}},"@toruslabs/eccrypto":{globals:{"Buffer.alloc":!0,"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0,crypto:!0,msCrypto:!0},packages:{"@toruslabs/eccrypto>elliptic":!0,buffer:!0}},"@toruslabs/eccrypto>elliptic":{packages:{"@toruslabs/eccrypto>elliptic>brorand":!0,"@toruslabs/eccrypto>elliptic>hmac-drbg":!0,"@toruslabs/eccrypto>elliptic>minimalistic-assert":!0,"@toruslabs/eccrypto>elliptic>minimalistic-crypto-utils":!0,"duplexify>inherits":!0,"ethereumjs-util>bn.js":!0,"ethers>@ethersproject/sha2>hash.js":!0}},"@toruslabs/eccrypto>elliptic>brorand":{globals:{crypto:!0,msCrypto:!0}},"@toruslabs/eccrypto>elliptic>hmac-drbg":{packages:{"@toruslabs/eccrypto>elliptic>minimalistic-assert":!0,"@toruslabs/eccrypto>elliptic>minimalistic-crypto-utils":!0,"ethers>@ethersproject/sha2>hash.js":!0}},"@trezor/connect-web":{globals:{URLSearchParams:!0,__TREZOR_CONNECT_SRC:!0,addEventListener:!0,btoa:!0,chrome:!0,clearInterval:!0,clearTimeout:!0,"console.warn":!0,"document.body":!0,"document.createElement":!0,"document.createTextNode":!0,"document.getElementById":!0,"document.querySelectorAll":!0,"location.origin":!0,navigator:!0,open:!0,origin:!0,removeEventListener:!0,setInterval:!0,setTimeout:!0},packages:{"@trezor/connect-web>@trezor/connect":!0,"@trezor/connect-web>@trezor/connect-common":!0,"@trezor/connect-web>@trezor/connect>@trezor/blockchain-link>@trezor/websocket-client":!0,"@trezor/connect-web>@trezor/utils":!0,tslib:!0,"webpack>events":!0}},"@trezor/connect-web>@trezor/connect":{packages:{"@trezor/connect-web>@trezor/connect>@trezor/device-utils":!0,"@trezor/connect-web>@trezor/connect>@trezor/protobuf":!0,"@trezor/connect-web>@trezor/connect>@trezor/schema-utils":!0,"@trezor/connect-web>@trezor/connect>@trezor/transport":!0,"@trezor/connect-web>@trezor/utils":!0,tslib:!0}},"@trezor/connect-web>@trezor/connect-common":{globals:{"console.warn":!0,"localStorage.getItem":!0,"localStorage.setItem":!0,navigator:!0,setTimeout:!0,window:!0},packages:{"@trezor/connect-web>@trezor/connect-common>@trezor/env-utils":!0,"@trezor/connect-web>@trezor/utils":!0,tslib:!0}},"@trezor/connect-web>@trezor/connect-common>@trezor/env-utils":{globals:{innerHeight:!0,innerWidth:!0,"location.hostname":!0,"location.origin":!0,"navigator.languages":!0,"navigator.platform":!0,"navigator.userAgent":!0,process:!0,"screen.height":!0,"screen.width":!0},packages:{"@trezor/connect-web>@trezor/connect-common>@trezor/env-utils>ua-parser-js":!0,process:!0}},"@trezor/connect-web>@trezor/connect-common>@trezor/env-utils>ua-parser-js":{globals:{define:!0,"navigator.userAgentData":!0}},"@trezor/connect-web>@trezor/connect>@trezor/blockchain-link>@trezor/websocket-client":{globals:{WebSocket:!0,clearTimeout:!0,setTimeout:!0},packages:{"@trezor/connect-web>@trezor/utils":!0,tslib:!0,"webpack>events":!0}},"@trezor/connect-web>@trezor/connect>@trezor/device-utils":{packages:{tslib:!0}},"@trezor/connect-web>@trezor/connect>@trezor/protobuf":{globals:{"Buffer.from":!0},packages:{"@google/genai>protobufjs":!0,"@trezor/connect-web>@trezor/connect>@trezor/protobuf>long":!0,"@trezor/connect-web>@trezor/connect>@trezor/schema-utils":!0,buffer:!0,tslib:!0}},"@trezor/connect-web>@trezor/connect>@trezor/protobuf>long":{globals:{"WebAssembly.Instance":!0,"WebAssembly.Module":!0,define:!0}},"@trezor/connect-web>@trezor/connect>@trezor/schema-utils":{globals:{Buffer:!0,"console.warn":!0},packages:{"@trezor/connect-web>@trezor/connect>@trezor/schema-utils>@sinclair/typebox":!0,buffer:!0,"ts-mixer":!0}},"@trezor/connect-web>@trezor/connect>@trezor/schema-utils>@sinclair/typebox":{globals:{Float32Array:!0,Float64Array:!0}},"@trezor/connect-web>@trezor/utils":{globals:{AbortController:!0,Blob:!0,"Buffer.alloc":!0,"Buffer.allocUnsafe":!0,"Intl.NumberFormat":!0,TextEncoder:!0,clearInterval:!0,clearTimeout:!0,"console.error":!0,"console.info":!0,"console.log":!0,"console.warn":!0,"crypto.getRandomValues":!0,setInterval:!0,setTimeout:!0},packages:{"@trezor/connect-web>@trezor/utils>bignumber.js":!0,buffer:!0,tslib:!0,"webpack>events":!0}},"@trezor/connect-web>@trezor/utils>bignumber.js":{globals:{crypto:!0,define:!0}},"@zxing/browser":{globals:{HTMLElement:!0,HTMLImageElement:!0,HTMLVideoElement:!0,clearTimeout:!0,"console.error":!0,"console.warn":!0,document:!0,navigator:!0,setTimeout:!0},packages:{"@zxing/library":!0}},"@zxing/library":{globals:{Float32Array:!0,HTMLImageElement:!0,HTMLVideoElement:!0,TextDecoder:!0,TextEncoder:!0,"URL.createObjectURL":!0,btoa:!0,"console.log":!0,"console.warn":!0,document:!0,navigator:!0,setTimeout:!0},packages:{"@zxing/library>ts-custom-error":!0}},"async-mutex":{globals:{clearTimeout:!0,setTimeout:!0},packages:{tslib:!0}},"base32-encode":{packages:{"base32-encode>to-data-view":!0}},"bignumber.js":{globals:{crypto:!0,define:!0}},bowser:{globals:{define:!0}},"browserify>concat-stream>buffer-from":{globals:{Buffer:!0},packages:{buffer:!0}},"browserify>string_decoder":{packages:{"mockttp>express>safe-buffer":!0}},"browserify>url":{packages:{"browserify>url>punycode":!0,"mockttp>express>qs":!0}},"browserify>url>punycode":{globals:{define:!0}},"browserify>util":{globals:{SharedArrayBuffer:!0,"console.error":!0,"console.log":!0,"console.trace":!0,process:!0},packages:{"browserify>util>is-arguments":!0,"browserify>util>is-generator-function":!0,"browserify>util>is-typed-array":!0,"browserify>util>which-typed-array":!0,"duplexify>inherits":!0,process:!0}},"browserify>util>is-arguments":{packages:{"jsdom>form-data>es-set-tostringtag>has-tostringtag":!0,"string.prototype.matchall>call-bind":!0}},"browserify>util>is-generator-function":{packages:{"jsdom>form-data>es-set-tostringtag>has-tostringtag":!0,"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>es-abstract>get-proto":!0,"string.prototype.matchall>es-abstract>safe-regex-test":!0,"string.prototype.matchall>get-intrinsic>generator-function":!0}},"browserify>util>is-typed-array":{packages:{"browserify>util>which-typed-array":!0}},"browserify>util>which-typed-array":{packages:{"browserify>util>which-typed-array>for-each":!0,"jsdom>form-data>es-set-tostringtag>has-tostringtag":!0,"string.prototype.matchall>call-bind":!0,"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>es-abstract>available-typed-arrays":!0,"string.prototype.matchall>es-abstract>get-proto":!0,"string.prototype.matchall>gopd":!0}},"browserify>util>which-typed-array>for-each":{packages:{"string.prototype.matchall>es-abstract>is-callable":!0}},bs58:{packages:{"bs58>base-x":!0}},buffer:{globals:{SharedArrayBuffer:!0,console:!0},packages:{"base64-js":!0,"buffer>ieee754":!0}},chalk:{packages:{"chalk>ansi-styles":!0,"chalk>supports-color":!0}},"chalk>ansi-styles":{packages:{"chalk>ansi-styles>color-convert":!0}},"chalk>ansi-styles>color-convert":{packages:{"jest-canvas-mock>moo-color>color-name":!0}},"chart.js":{globals:{"Intl.NumberFormat":!0,MutationObserver:!0,OffscreenCanvas:!0,Path2D:!0,ResizeObserver:!0,addEventListener:!0,clearTimeout:!0,"console.error":!0,"console.warn":!0,devicePixelRatio:!0,document:!0,removeEventListener:!0,requestAnimationFrame:!0,setTimeout:!0},packages:{"chart.js>@kurkle/color":!0}},cockatiel:{globals:{AbortController:!0,AbortSignal:!0,performance:!0,"process.hrtime.bigint":!0,setTimeout:!0},packages:{process:!0}},"core-js-pure":{globals:{"Bun.version":!0,"Deno.version":!0,document:!0,setTimeout:!0}},"cron-parser":{packages:{luxon:!0}},"crypto-browserify":{packages:{"crypto-browserify>browserify-cipher":!0,"crypto-browserify>browserify-sign":!0,"crypto-browserify>create-ecdh":!0,"crypto-browserify>create-hmac":!0,"crypto-browserify>diffie-hellman":!0,"crypto-browserify>pbkdf2":!0,"crypto-browserify>public-encrypt":!0,"crypto-browserify>randombytes":!0,"crypto-browserify>randomfill":!0,"ethereumjs-util>create-hash":!0}},"crypto-browserify>browserify-cipher":{packages:{"crypto-browserify>browserify-cipher>browserify-des":!0,"crypto-browserify>browserify-cipher>evp_bytestokey":!0,"ethereumjs-util>ethereum-cryptography>browserify-aes":!0}},"crypto-browserify>browserify-cipher>browserify-des":{globals:{Buffer:!0},packages:{buffer:!0,"crypto-browserify>browserify-cipher>browserify-des>des.js":!0,"duplexify>inherits":!0,"ethereumjs-util>create-hash>cipher-base":!0}},"crypto-browserify>browserify-cipher>browserify-des>des.js":{packages:{"@toruslabs/eccrypto>elliptic>minimalistic-assert":!0,"duplexify>inherits":!0}},"crypto-browserify>browserify-cipher>evp_bytestokey":{packages:{"ethereumjs-util>create-hash>md5.js":!0,"mockttp>express>safe-buffer":!0}},"crypto-browserify>browserify-sign":{packages:{"@toruslabs/eccrypto>elliptic":!0,"crypto-browserify>browserify-sign>readable-stream":!0,"crypto-browserify>create-hmac":!0,"crypto-browserify>public-encrypt>browserify-rsa":!0,"crypto-browserify>public-encrypt>parse-asn1":!0,"duplexify>inherits":!0,"ethereumjs-util>bn.js":!0,"ethereumjs-util>create-hash":!0,"mockttp>express>safe-buffer":!0}},"crypto-browserify>browserify-sign>readable-stream":{globals:{"process.browser":!0,"process.stderr":!0,"process.stdout":!0,"process.version.slice":!0,setImmediate:!0},packages:{"core-js-pure":!0,"crypto-browserify>browserify-sign>readable-stream>isarray":!0,"crypto-browserify>browserify-sign>readable-stream>safe-buffer":!0,"crypto-browserify>browserify-sign>readable-stream>string_decoder":!0,"duplexify>inherits":!0,process:!0,"readable-stream-2>core-util-is":!0,"readable-stream-2>process-nextick-args":!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"crypto-browserify>browserify-sign>readable-stream>safe-buffer":{packages:{buffer:!0}},"crypto-browserify>browserify-sign>readable-stream>string_decoder":{packages:{"crypto-browserify>browserify-sign>readable-stream>string_decoder>safe-buffer":!0}},"crypto-browserify>browserify-sign>readable-stream>string_decoder>safe-buffer":{packages:{buffer:!0}},"crypto-browserify>create-ecdh":{globals:{Buffer:!0},packages:{"@toruslabs/eccrypto>elliptic":!0,buffer:!0,"ethereumjs-util>bn.js":!0}},"crypto-browserify>create-hmac":{packages:{"@ngraveio/bc-ur>sha.js":!0,"duplexify>inherits":!0,"ethereumjs-util>create-hash":!0,"ethereumjs-util>create-hash>cipher-base":!0,"ethereumjs-util>create-hash>ripemd160":!0,"mockttp>express>safe-buffer":!0}},"crypto-browserify>diffie-hellman":{globals:{Buffer:!0},packages:{buffer:!0,"crypto-browserify>diffie-hellman>miller-rabin":!0,"crypto-browserify>randombytes":!0,"ethereumjs-util>bn.js":!0}},"crypto-browserify>diffie-hellman>miller-rabin":{packages:{"@toruslabs/eccrypto>elliptic>brorand":!0,"ethereumjs-util>bn.js":!0}},"crypto-browserify>pbkdf2":{globals:{crypto:!0,process:!0,queueMicrotask:!0,setImmediate:!0,setTimeout:!0},packages:{"@ngraveio/bc-ur>sha.js":!0,"@ngraveio/bc-ur>sha.js>to-buffer":!0,"ethereumjs-util>create-hash":!0,"ethereumjs-util>create-hash>ripemd160":!0,"mockttp>express>safe-buffer":!0,process:!0}},"crypto-browserify>public-encrypt":{packages:{"crypto-browserify>public-encrypt>browserify-rsa":!0,"crypto-browserify>public-encrypt>parse-asn1":!0,"crypto-browserify>randombytes":!0,"ethereumjs-util>bn.js":!0,"ethereumjs-util>create-hash":!0,"mockttp>express>safe-buffer":!0}},"crypto-browserify>public-encrypt>browserify-rsa":{packages:{"crypto-browserify>randombytes":!0,"ethereumjs-util>bn.js":!0,"mockttp>express>safe-buffer":!0}},"crypto-browserify>public-encrypt>parse-asn1":{packages:{"crypto-browserify>browserify-cipher>evp_bytestokey":!0,"crypto-browserify>pbkdf2":!0,"crypto-browserify>public-encrypt>parse-asn1>asn1.js":!0,"ethereumjs-util>ethereum-cryptography>browserify-aes":!0,"mockttp>express>safe-buffer":!0}},"crypto-browserify>public-encrypt>parse-asn1>asn1.js":{packages:{"@toruslabs/eccrypto>elliptic>minimalistic-assert":!0,buffer:!0,"duplexify>inherits":!0,"ethereumjs-util>bn.js":!0}},"crypto-browserify>randombytes":{globals:{crypto:!0,msCrypto:!0,"process.nextTick":!0},packages:{"mockttp>express>safe-buffer":!0,process:!0}},"crypto-browserify>randomfill":{globals:{crypto:!0,msCrypto:!0,"process.browser":!0,"process.nextTick":!0},packages:{"crypto-browserify>randombytes":!0,"mockttp>express>safe-buffer":!0,process:!0}},"currency-formatter":{packages:{"currency-formatter>accounting":!0,"currency-formatter>locale-currency":!0,"prop-types>object-assign":!0}},"currency-formatter>accounting":{globals:{define:!0}},"currency-formatter>locale-currency":{globals:{countryCode:!0}},dompurify:{globals:{"console.warn":!0}},eciesjs:{packages:{"@noble/ciphers":!0,"@noble/curves":!0,"@noble/hashes":!0,"eciesjs>@ecies/ciphers":!0}},"eciesjs>@ecies/ciphers":{packages:{"@noble/ciphers":!0}},"eslint-plugin-react>array-includes>is-string":{packages:{"jsdom>form-data>es-set-tostringtag>has-tostringtag":!0,"string.prototype.matchall>call-bound":!0}},"eslint-plugin-react>es-iterator-helpers>has-property-descriptors":{packages:{"string.prototype.matchall>call-bind>es-define-property":!0}},"eslint-plugin-react>es-iterator-helpers>has-proto>dunder-proto":{packages:{"string.prototype.matchall>call-bind>call-bind-apply-helpers":!0,"string.prototype.matchall>gopd":!0}},"eslint-plugin-react>hasown":{packages:{"browserify>has>function-bind":!0}},"eslint>ajv":{globals:{console:!0},packages:{"eslint>ajv>json-schema-traverse":!0,"eslint>fast-deep-equal":!0,"fast-json-stable-stringify":!0,"uri-js":!0}},"eth-ens-namehash":{globals:{Buffer:!0,name:"write"},packages:{buffer:!0,"eth-ens-namehash>idna-uts46-hx":!0,"eth-ens-namehash>js-sha3":!0}},"eth-ens-namehash>idna-uts46-hx":{globals:{define:!0},packages:{"eth-ens-namehash>idna-uts46-hx>punycode":!0}},"eth-ens-namehash>js-sha3":{globals:{define:!0,process:!0},packages:{process:!0}},"eth-lattice-keyring":{globals:{"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0,addEventListener:!0,browser:!0,clearInterval:!0,open:!0,setInterval:!0},packages:{"@ethereumjs/tx":!0,buffer:!0,"crypto-browserify":!0,"eth-lattice-keyring>@ethereumjs/util":!0,"eth-lattice-keyring>gridplus-sdk":!0,"eth-lattice-keyring>rlp":!0,"ethereumjs-util>bn.js":!0,"webpack>events":!0}},"eth-lattice-keyring>@ethereumjs/util":{globals:{"Buffer.alloc":!0,"Buffer.allocUnsafe":!0,"Buffer.byteLength":!0,"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0,"console.warn":!0},packages:{buffer:!0,"eth-lattice-keyring>@ethereumjs/util>@ethereumjs/rlp":!0,"eth-lattice-keyring>@ethereumjs/util>ethereum-cryptography":!0,"eth-lattice-keyring>@ethereumjs/util>micro-ftch":!0,"webpack>events":!0}},"eth-lattice-keyring>@ethereumjs/util>@ethereumjs/rlp":{globals:{TextEncoder:!0}},"eth-lattice-keyring>@ethereumjs/util>ethereum-cryptography":{globals:{TextDecoder:!0,crypto:!0},packages:{"eth-lattice-keyring>@ethereumjs/util>ethereum-cryptography>@noble/curves":!0,"eth-lattice-keyring>@ethereumjs/util>ethereum-cryptography>@noble/hashes":!0}},"eth-lattice-keyring>@ethereumjs/util>ethereum-cryptography>@noble/curves":{globals:{TextEncoder:!0},packages:{"eth-lattice-keyring>@ethereumjs/util>ethereum-cryptography>@noble/hashes":!0}},"eth-lattice-keyring>@ethereumjs/util>ethereum-cryptography>@noble/hashes":{globals:{TextEncoder:!0,crypto:!0}},"eth-lattice-keyring>@ethereumjs/util>micro-ftch":{globals:{"Buffer.concat":!0,Headers:!0,TextDecoder:!0,URL:!0,btoa:!0,fetch:!0,process:!0},packages:{"browserify>url":!0,"browserify>util":!0,buffer:!0,"https-browserify":!0,process:!0,"stream-http":!0}},"eth-lattice-keyring>gridplus-sdk":{globals:{AbortController:!0,"Buffer.alloc":!0,"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0,Request:!0,URL:!0,caches:!0,clearTimeout:!0,"console.debug":!0,"console.error":!0,"console.log":!0,"console.warn":!0,fetch:!0,setTimeout:!0,structuredClone:!0},packages:{"@metamask/eth-sig-util":!0,"@toruslabs/eccrypto>elliptic":!0,"bitcoin-address-validation>bech32":!0,buffer:!0,"eth-lattice-keyring>gridplus-sdk>@ethereumjs/rlp":!0,"eth-lattice-keyring>gridplus-sdk>aes-js":!0,"eth-lattice-keyring>gridplus-sdk>bignumber.js":!0,"eth-lattice-keyring>gridplus-sdk>bs58check":!0,"eth-lattice-keyring>gridplus-sdk>cbor":!0,"eth-lattice-keyring>gridplus-sdk>cbor-bigdecimal":!0,"eth-lattice-keyring>gridplus-sdk>crc-32":!0,"eth-lattice-keyring>gridplus-sdk>ox":!0,"eth-lattice-keyring>gridplus-sdk>secp256k1":!0,"ethereumjs-util>bn.js":!0,"ethers>@ethersproject/sha2>hash.js":!0,lodash:!0,"openai>zod":!0,uuid:!0,viem:!0,"viem>abitype":!0}},"eth-lattice-keyring>gridplus-sdk>@ethereumjs/rlp":{globals:{TextEncoder:!0}},"eth-lattice-keyring>gridplus-sdk>aes-js":{globals:{define:!0}},"eth-lattice-keyring>gridplus-sdk>bignumber.js":{globals:{crypto:!0,define:!0}},"eth-lattice-keyring>gridplus-sdk>bs58check":{packages:{"@noble/hashes":!0,bs58:!0}},"eth-lattice-keyring>gridplus-sdk>cbor":{globals:{Float32Array:!0,Float64Array:!0,TextDecoder:!0,URL:!0},packages:{buffer:!0,"eth-lattice-keyring>gridplus-sdk>cbor>nofilter":!0,"stream-browserify":!0}},"eth-lattice-keyring>gridplus-sdk>cbor-bigdecimal":{globals:{define:!0},packages:{"eth-lattice-keyring>gridplus-sdk>bignumber.js":!0}},"eth-lattice-keyring>gridplus-sdk>cbor>nofilter":{globals:{TextDecoder:!0},packages:{buffer:!0,"stream-browserify":!0}},"eth-lattice-keyring>gridplus-sdk>crc-32":{globals:{DO_NOT_EXPORT_CRC:!0,define:!0}},"eth-lattice-keyring>gridplus-sdk>ox":{globals:{TextDecoder:!0,TextEncoder:!0,"crypto.getRandomValues":!0},packages:{"@noble/hashes":!0,"eth-lattice-keyring>gridplus-sdk>ox>@noble/curves":!0}},"eth-lattice-keyring>gridplus-sdk>secp256k1":{packages:{"@toruslabs/eccrypto>elliptic":!0}},"eth-lattice-keyring>rlp":{globals:{TextEncoder:!0}},"eth-method-registry":{packages:{"eth-method-registry>@metamask/ethjs-contract":!0,"eth-method-registry>@metamask/ethjs-query":!0}},"eth-method-registry>@metamask/ethjs-contract":{packages:{"@babel/runtime":!0,"eth-ens-namehash>js-sha3":!0,"eth-method-registry>@metamask/ethjs-contract>@metamask/ethjs-filter":!0,"eth-method-registry>@metamask/ethjs-contract>@metamask/ethjs-util":!0,"eth-method-registry>@metamask/ethjs-contract>ethjs-abi":!0,"eth-method-registry>@metamask/ethjs-query>promise-to-callback":!0}},"eth-method-registry>@metamask/ethjs-contract>@metamask/ethjs-filter":{globals:{clearInterval:!0,setInterval:!0}},"eth-method-registry>@metamask/ethjs-contract>@metamask/ethjs-util":{globals:{"Buffer.byteLength":!0,"Buffer.from":!0},packages:{buffer:!0,"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format>is-hex-prefixed":!0,"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format>strip-hex-prefix":!0}},"eth-method-registry>@metamask/ethjs-contract>ethjs-abi":{globals:{Buffer:!0},packages:{buffer:!0,"eth-ens-namehash>js-sha3":!0,"eth-method-registry>@metamask/ethjs-contract>ethjs-abi>number-to-bn":!0,"ethereumjs-util>bn.js":!0}},"eth-method-registry>@metamask/ethjs-contract>ethjs-abi>number-to-bn":{packages:{"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format>strip-hex-prefix":!0,"ethereumjs-util>bn.js":!0}},"eth-method-registry>@metamask/ethjs-query":{globals:{console:!0},packages:{"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format":!0,"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-rpc":!0,"eth-method-registry>@metamask/ethjs-query>promise-to-callback":!0}},"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format":{packages:{"@metamask/controller-utils>@metamask/ethjs-unit>@metamask/number-to-bn":!0,"eth-method-registry>@metamask/ethjs-contract>@metamask/ethjs-util":!0,"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format>ethjs-schema":!0,"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format>strip-hex-prefix":!0}},"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format>strip-hex-prefix":{packages:{"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-format>is-hex-prefixed":!0}},"eth-method-registry>@metamask/ethjs-query>@metamask/ethjs-rpc":{packages:{"eth-method-registry>@metamask/ethjs-query>promise-to-callback":!0}},"eth-method-registry>@metamask/ethjs-query>promise-to-callback":{packages:{"eth-method-registry>@metamask/ethjs-query>promise-to-callback>is-fn":!0,"eth-method-registry>@metamask/ethjs-query>promise-to-callback>set-immediate-shim":!0}},"eth-method-registry>@metamask/ethjs-query>promise-to-callback>set-immediate-shim":{globals:{setImmediate:!0,"setTimeout.apply":!0},packages:{"core-js-pure":!0}},"ethereum-cryptography":{globals:{TextDecoder:!0},packages:{"@noble/hashes":!0,"ethereum-cryptography>@noble/curves":!0}},"ethereumjs-util":{globals:{Buffer:!0},packages:{"@ngraveio/bc-ur>assert":!0,buffer:!0,"ethereumjs-util>bn.js":!0,"ethereumjs-util>create-hash":!0,"ethereumjs-util>ethereum-cryptography":!0,"ethereumjs-util>rlp":!0}},"ethereumjs-util>bn.js":{globals:{Buffer:!0}},"ethereumjs-util>create-hash":{packages:{"@ngraveio/bc-ur>sha.js":!0,"duplexify>inherits":!0,"ethereumjs-util>create-hash>cipher-base":!0,"ethereumjs-util>create-hash>md5.js":!0,"ethereumjs-util>create-hash>ripemd160":!0}},"ethereumjs-util>create-hash>cipher-base":{packages:{"browserify>string_decoder":!0,"duplexify>inherits":!0,"mockttp>express>safe-buffer":!0,"stream-browserify":!0}},"ethereumjs-util>create-hash>md5.js":{packages:{"duplexify>inherits":!0,"ethereumjs-util>create-hash>md5.js>hash-base":!0,"mockttp>express>safe-buffer":!0}},"ethereumjs-util>create-hash>md5.js>hash-base":{packages:{"@ngraveio/bc-ur>sha.js>to-buffer":!0,"duplexify>inherits":!0,"ethereumjs-util>create-hash>md5.js>hash-base>readable-stream":!0,"mockttp>express>safe-buffer":!0}},"ethereumjs-util>create-hash>md5.js>hash-base>readable-stream":{globals:{"process.browser":!0,"process.stderr":!0,"process.stdout":!0,"process.version.slice":!0,setImmediate:!0},packages:{"core-js-pure":!0,"duplexify>inherits":!0,"ethereumjs-util>create-hash>md5.js>hash-base>readable-stream>isarray":!0,"ethereumjs-util>create-hash>md5.js>hash-base>readable-stream>safe-buffer":!0,"ethereumjs-util>create-hash>md5.js>hash-base>readable-stream>string_decoder":!0,process:!0,"readable-stream-2>core-util-is":!0,"readable-stream-2>process-nextick-args":!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"ethereumjs-util>create-hash>md5.js>hash-base>readable-stream>safe-buffer":{packages:{buffer:!0}},"ethereumjs-util>create-hash>md5.js>hash-base>readable-stream>string_decoder":{packages:{"ethereumjs-util>create-hash>md5.js>hash-base>readable-stream>string_decoder>safe-buffer":!0}},"ethereumjs-util>create-hash>md5.js>hash-base>readable-stream>string_decoder>safe-buffer":{packages:{buffer:!0}},"ethereumjs-util>create-hash>ripemd160":{packages:{buffer:!0,"duplexify>inherits":!0,"ethereumjs-util>create-hash>ripemd160>hash-base":!0}},"ethereumjs-util>create-hash>ripemd160>hash-base":{packages:{"@ngraveio/bc-ur>sha.js>to-buffer":!0,"duplexify>inherits":!0,"ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream":!0,"mockttp>express>safe-buffer":!0}},"ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream":{globals:{"process.browser":!0,"process.stderr":!0,"process.stdout":!0,"process.version.slice":!0,setImmediate:!0},packages:{"core-js-pure":!0,"duplexify>inherits":!0,"ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream>isarray":!0,"ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream>safe-buffer":!0,"ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream>string_decoder":!0,process:!0,"readable-stream-2>core-util-is":!0,"readable-stream-2>process-nextick-args":!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream>safe-buffer":{packages:{buffer:!0}},"ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream>string_decoder":{packages:{"ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream>string_decoder>safe-buffer":!0}},"ethereumjs-util>create-hash>ripemd160>hash-base>readable-stream>string_decoder>safe-buffer":{packages:{buffer:!0}},"ethereumjs-util>ethereum-cryptography":{globals:{"Buffer.from":!0},packages:{buffer:!0,"crypto-browserify>randombytes":!0,"ethereumjs-util>ethereum-cryptography>keccak":!0,"ethereumjs-util>ethereum-cryptography>secp256k1":!0}},"ethereumjs-util>ethereum-cryptography>browserify-aes":{globals:{"Buffer.concat":!0},packages:{buffer:!0,"crypto-browserify>browserify-cipher>evp_bytestokey":!0,"duplexify>inherits":!0,"ethereumjs-util>create-hash>cipher-base":!0,"ethereumjs-util>ethereum-cryptography>browserify-aes>buffer-xor":!0,"mockttp>express>safe-buffer":!0}},"ethereumjs-util>ethereum-cryptography>browserify-aes>buffer-xor":{globals:{Buffer:!0},packages:{buffer:!0}},"ethereumjs-util>ethereum-cryptography>bs58check":{packages:{"ethereumjs-util>create-hash":!0,"ethereumjs-util>ethereum-cryptography>bs58check>bs58":!0,"mockttp>express>safe-buffer":!0}},"ethereumjs-util>ethereum-cryptography>bs58check>bs58":{packages:{"@ensdomains/content-hash>multihashes>multibase>base-x":!0}},"ethereumjs-util>ethereum-cryptography>keccak":{globals:{"Buffer.alloc":!0,"Buffer.from":!0,"Buffer.isBuffer":!0},packages:{buffer:!0,"ethereumjs-util>ethereum-cryptography>keccak>readable-stream":!0}},"ethereumjs-util>ethereum-cryptography>keccak>readable-stream":{globals:{"process.nextTick":!0,"process.stderr":!0,"process.stdout":!0},packages:{"browserify>string_decoder":!0,buffer:!0,"duplexify>inherits":!0,process:!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"ethereumjs-util>ethereum-cryptography>secp256k1":{packages:{"@toruslabs/eccrypto>elliptic":!0}},"ethereumjs-util>rlp":{globals:{"Buffer.concat":!0,"Buffer.from":!0,"Buffer.isBuffer":!0},packages:{buffer:!0,"ethereumjs-util>bn.js":!0}},ethers:{packages:{"@ethersproject/abi":!0,"@ethersproject/bignumber":!0,"@ethersproject/bytes":!0,"@ethersproject/contracts":!0,"@ethersproject/hdnode":!0,"@ethersproject/providers":!0,"@ethersproject/transactions":!0,"ethers>@ethersproject/abstract-signer":!0,"ethers>@ethersproject/address":!0,"ethers>@ethersproject/base64":!0,"ethers>@ethersproject/basex":!0,"ethers>@ethersproject/constants":!0,"ethers>@ethersproject/hash":!0,"ethers>@ethersproject/json-wallets":!0,"ethers>@ethersproject/keccak256":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/properties":!0,"ethers>@ethersproject/random":!0,"ethers>@ethersproject/rlp":!0,"ethers>@ethersproject/sha2":!0,"ethers>@ethersproject/signing-key":!0,"ethers>@ethersproject/solidity":!0,"ethers>@ethersproject/strings":!0,"ethers>@ethersproject/units":!0,"ethers>@ethersproject/wallet":!0,"ethers>@ethersproject/web":!0,"ethers>@ethersproject/wordlists":!0}},"ethers>@ethersproject/abstract-provider":{packages:{"@ethersproject/bignumber":!0,"@ethersproject/bytes":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/properties":!0}},"ethers>@ethersproject/abstract-signer":{packages:{"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/properties":!0}},"ethers>@ethersproject/address":{packages:{"@ethersproject/bignumber":!0,"@ethersproject/bytes":!0,"ethers>@ethersproject/keccak256":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/rlp":!0}},"ethers>@ethersproject/base64":{globals:{atob:!0,btoa:!0},packages:{"@ethersproject/bytes":!0}},"ethers>@ethersproject/basex":{packages:{"@ethersproject/bytes":!0,"ethers>@ethersproject/properties":!0}},"ethers>@ethersproject/constants":{packages:{"@ethersproject/bignumber":!0}},"ethers>@ethersproject/hash":{packages:{"@ethersproject/bignumber":!0,"@ethersproject/bytes":!0,"ethers>@ethersproject/address":!0,"ethers>@ethersproject/base64":!0,"ethers>@ethersproject/keccak256":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/properties":!0,"ethers>@ethersproject/strings":!0}},"ethers>@ethersproject/json-wallets":{packages:{"@ethersproject/bytes":!0,"@ethersproject/hdnode":!0,"@ethersproject/transactions":!0,"ethers>@ethersproject/address":!0,"ethers>@ethersproject/json-wallets>aes-js":!0,"ethers>@ethersproject/json-wallets>scrypt-js":!0,"ethers>@ethersproject/keccak256":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/pbkdf2":!0,"ethers>@ethersproject/properties":!0,"ethers>@ethersproject/random":!0,"ethers>@ethersproject/strings":!0}},"ethers>@ethersproject/json-wallets>aes-js":{globals:{define:!0}},"ethers>@ethersproject/json-wallets>scrypt-js":{globals:{define:!0,setImmediate:!0,setTimeout:!0},packages:{"core-js-pure":!0}},"ethers>@ethersproject/keccak256":{packages:{"@ethersproject/bytes":!0,"eth-ens-namehash>js-sha3":!0}},"ethers>@ethersproject/logger":{globals:{console:!0}},"ethers>@ethersproject/networks":{packages:{"ethers>@ethersproject/logger":!0}},"ethers>@ethersproject/pbkdf2":{packages:{"@ethersproject/bytes":!0,"ethers>@ethersproject/sha2":!0}},"ethers>@ethersproject/properties":{packages:{"ethers>@ethersproject/logger":!0}},"ethers>@ethersproject/random":{globals:{"crypto.getRandomValues":!0},packages:{"@ethersproject/bytes":!0,"ethers>@ethersproject/logger":!0}},"ethers>@ethersproject/rlp":{packages:{"@ethersproject/bytes":!0,"ethers>@ethersproject/logger":!0}},"ethers>@ethersproject/sha2":{packages:{"@ethersproject/bytes":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/sha2>hash.js":!0}},"ethers>@ethersproject/sha2>hash.js":{packages:{"@toruslabs/eccrypto>elliptic>minimalistic-assert":!0,"duplexify>inherits":!0}},"ethers>@ethersproject/signing-key":{packages:{"@ethersproject/bytes":!0,"ethereumjs-util>bn.js":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/properties":!0,"ethers>@ethersproject/sha2>hash.js":!0}},"ethers>@ethersproject/solidity":{packages:{"@ethersproject/bignumber":!0,"@ethersproject/bytes":!0,"ethers>@ethersproject/keccak256":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/sha2":!0,"ethers>@ethersproject/strings":!0}},"ethers>@ethersproject/strings":{packages:{"@ethersproject/bytes":!0,"ethers>@ethersproject/constants":!0,"ethers>@ethersproject/logger":!0}},"ethers>@ethersproject/units":{packages:{"@ethersproject/bignumber":!0,"ethers>@ethersproject/logger":!0}},"ethers>@ethersproject/wallet":{packages:{"@ethersproject/bytes":!0,"@ethersproject/hdnode":!0,"@ethersproject/transactions":!0,"ethers>@ethersproject/abstract-provider":!0,"ethers>@ethersproject/abstract-signer":!0,"ethers>@ethersproject/address":!0,"ethers>@ethersproject/hash":!0,"ethers>@ethersproject/json-wallets":!0,"ethers>@ethersproject/keccak256":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/properties":!0,"ethers>@ethersproject/random":!0,"ethers>@ethersproject/signing-key":!0}},"ethers>@ethersproject/web":{globals:{clearTimeout:!0,fetch:!0,setTimeout:!0},packages:{"@ethersproject/bytes":!0,"ethers>@ethersproject/base64":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/properties":!0,"ethers>@ethersproject/strings":!0}},"ethers>@ethersproject/wordlists":{packages:{"ethers>@ethersproject/hash":!0,"ethers>@ethersproject/logger":!0,"ethers>@ethersproject/properties":!0}},"extension-port-stream":{globals:{AggregateError:!0,"navigator.userAgent.includes":!0,"performance.now":!0,queueMicrotask:!0,scheduler:!0,setTimeout:!0},packages:{"readable-stream":!0}},"fast-json-patch":{globals:{addEventListener:!0,clearTimeout:!0,removeEventListener:!0,setTimeout:!0}},"fuse.js":{globals:{console:!0,define:!0}},"gulp>vinyl-fs>object.assign":{packages:{"@lavamoat/webpack>json-stable-stringify>object-keys":!0,"string.prototype.matchall>call-bind":!0,"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>define-properties":!0,"string.prototype.matchall>es-object-atoms":!0,"string.prototype.matchall>has-symbols":!0}},he:{globals:{define:!0}},"https-browserify":{packages:{"browserify>url":!0,"stream-http":!0}},"humanize-duration":{globals:{define:!0}},"jsdom>form-data>es-set-tostringtag>has-tostringtag":{packages:{"string.prototype.matchall>has-symbols":!0}},"lightweight-charts":{globals:{Image:!0,ResizeObserver:!0,URL:!0,cancelAnimationFrame:!0,chrome:!0,clearTimeout:!0,devicePixelRatio:!0,"document.activeElement":!0,"document.body":!0,"document.createElement":!0,"document.documentElement":!0,"document.getElementById":!0,"document.getSelection":!0,getComputedStyle:!0,"location.href":!0,"navigator.language":!0,"navigator.platform":!0,"navigator.userAgent.toLowerCase":!0,"navigator.userAgentData":!0,"performance.now":!0,queueMicrotask:!0,requestAnimationFrame:!0,setTimeout:!0},packages:{"lightweight-charts>fancy-canvas":!0}},"lightweight-charts>fancy-canvas":{globals:{ResizeObserver:!0,"document.body":!0}},localforage:{globals:{Blob:!0,BlobBuilder:!0,FileReader:!0,Float32Array:!0,Float64Array:!0,IDBKeyRange:!0,MSBlobBuilder:!0,MozBlobBuilder:!0,OIndexedDB:!0,WebKitBlobBuilder:!0,atob:!0,btoa:!0,"console.error":!0,"console.info":!0,"console.warn":!0,define:!0,fetch:!0,indexedDB:!0,localStorage:!0,mozIndexedDB:!0,msIndexedDB:!0,"navigator.platform":!0,"navigator.userAgent":!0,openDatabase:!0,setTimeout:!0,webkitIndexedDB:!0}},lodash:{globals:{_:!0,clearTimeout:!0,define:!0,setTimeout:!0}},loglevel:{globals:{console:!0,define:!0,"document.cookie":!0,localStorage:!0,log:"write",navigator:!0}},"lottie-web":{globals:{Blob:!0,Float32Array:!0,Howl:!0,OffscreenCanvas:!0,"URL.createObjectURL":!0,Worker:!0,XMLHttpRequest:!0,bodymovin:"write",clearInterval:!0,console:!0,define:!0,"document.body":!0,"document.createElement":!0,"document.createElementNS":!0,"document.getElementsByClassName":!0,"document.getElementsByTagName":!0,"document.querySelectorAll":!0,"document.readyState":!0,"location.origin":!0,"location.pathname":!0,navigator:!0,requestAnimationFrame:!0,setInterval:!0,setTimeout:!0}},luxon:{globals:{Intl:!0}},"mockttp>@httptoolkit/subscriptions-transport-ws>symbol-observable":{globals:{module:!0}},"mockttp>express>qs":{packages:{"string.prototype.matchall>call-bind>es-define-property":!0,"string.prototype.matchall>side-channel":!0}},"mockttp>express>safe-buffer":{packages:{buffer:!0}},nanoid:{globals:{"crypto.getRandomValues":!0}},"nock>debug":{globals:{console:!0,document:!0,localStorage:!0,navigator:!0,process:!0},packages:{"mocha>ms":!0,process:!0}},"openai>abort-controller":{globals:{AbortController:!0}},"openai>zod":{globals:{File:!0,URL:!0,__zod_globalConfig:"write",__zod_globalRegistry:"write",atob:!0,btoa:!0,navigator:!0}},"path-browserify":{globals:{"process.cwd":!0},packages:{process:!0}},process:{globals:{clearTimeout:!0,setTimeout:!0}},"qrcode.react":{globals:{Path2D:!0,devicePixelRatio:!0},packages:{react:!0}},"react-chartjs-2":{globals:{setTimeout:!0},packages:{"chart.js":!0,react:!0}},"react-compiler-runtime":{globals:{"console.error":!0},packages:{react:!0}},"react-devtools-core":{globals:{CSSStyleRule:!0,ElementTypeClass:!0,ElementTypeForwardRef:!0,ElementTypeFunction:!0,ElementTypeMemo:!0,ElementTypeVirtual:!0,ErrorEvent:!0,HTMLElement:!0,LOCAL_STORAGE_COMPONENT_FILTER_PREFERENCES_KEY:!0,LOCAL_STORAGE_OPEN_IN_EDITOR_URL:!0,"Node.ELEMENT_NODE":!0,SESSION_STORAGE_RECORD_CHANGE_DESCRIPTIONS_KEY:!0,SESSION_STORAGE_RECORD_TIMELINE_KEY:!0,SESSION_STORAGE_RELOAD_AND_PROFILE_KEY:!0,URL:!0,WebSocket:!0,__REACT_DEVTOOLS_COMPONENT_FILTERS__:!0,__REACT_DEVTOOLS_GLOBAL_HOOK__:!0,__REACT_DEVTOOLS_TARGET_WINDOW__:!0,cancelAnimationFrame:!0,chrome:!0,clearTimeout:!0,console:!0,define:!0,devicePixelRatio:!0,devtoolsJestTestScheduler:!0,dispatchEvent:!0,document:!0,getComputedStyle:!0,getInObject:!0,innerHeight:!0,innerWidth:!0,"localStorage.getItem":!0,"localStorage.removeItem":!0,"localStorage.setItem":!0,localStorageGetItem:!0,localStorageSetItem:!0,"navigator.userAgent":!0,performance:!0,queueMicrotask:!0,"regeneratorRuntime.mark":!0,"regeneratorRuntime.wrap":!0,reportError:!0,requestAnimationFrame:!0,"sessionStorage.getItem":!0,"sessionStorage.removeItem":!0,"sessionStorage.setItem":!0,sessionStorageGetItem:!0,sessionStorageRemoveItem:!0,sessionStorageSetItem:!0,setInObject:!0,setTimeout:!0}},"react-dom":{globals:{HTMLIFrameElement:!0,MSApp:!0,__REACT_DEVTOOLS_GLOBAL_HOOK__:!0,addEventListener:!0,clearTimeout:!0,clipboardData:!0,"console.error":!0,document:!0,event:!1,queueMicrotask:!0,removeEventListener:!0,reportError:!0,setTimeout:!0},packages:{react:!0,"react-dom>scheduler":!0}},"react-dom>scheduler":{globals:{MessageChannel:!0,SharedArrayBuffer:!0,clearTimeout:!0,"console.error":!0,navigator:!0,performance:!0,setImmediate:!0,setTimeout:!0},packages:{"core-js-pure":!0}},"react-focus-lock":{globals:{addEventListener:!0,"console.error":!0,"console.warn":!0,document:!0,removeEventListener:!0,setTimeout:!0},packages:{"@babel/runtime":!0,"prop-types":!0,react:!0,"react-focus-lock>focus-lock":!0,"react-focus-lock>react-clientside-effect":!0,"react-focus-lock>use-callback-ref":!0,"react-focus-lock>use-sidecar":!0}},"react-focus-lock>focus-lock":{globals:{HTMLIFrameElement:!0,"Node.DOCUMENT_FRAGMENT_NODE":!0,"Node.DOCUMENT_NODE":!0,"Node.DOCUMENT_POSITION_CONTAINED_BY":!0,"Node.DOCUMENT_POSITION_CONTAINS":!0,"Node.ELEMENT_NODE":!0,"console.error":!0,"console.warn":!0,document:!0,getComputedStyle:!0,setTimeout:!0}},"react-focus-lock>react-clientside-effect":{packages:{"@babel/runtime":!0,react:!0}},"react-focus-lock>use-callback-ref":{packages:{react:!0}},"react-focus-lock>use-sidecar":{packages:{tslib:!0}},"react-hot-toast":{globals:{MutationObserver:!0,clearTimeout:!0,matchMedia:!0,setTimeout:!0},packages:{react:!0,"react-hot-toast>goober":!0}},"react-hot-toast>goober":{globals:{__nonce__:!0,_goober:!0,"document.createElement":!0,"document.head":!0}},"react-idle-timer":{globals:{clearTimeout:!0,document:!0,setTimeout:!0},packages:{"prop-types":!0,react:!0}},"react-markdown":{globals:{"console.warn":!0},packages:{"prop-types":!0,react:!0,"react-markdown>comma-separated-tokens":!0,"react-markdown>property-information":!0,"react-markdown>react-is":!0,"react-markdown>remark-parse":!0,"react-markdown>remark-rehype":!0,"react-markdown>space-separated-tokens":!0,"react-markdown>style-to-object":!0,"react-markdown>unified":!0,"react-markdown>unist-util-visit":!0,"react-markdown>vfile":!0}},"react-markdown>property-information":{packages:{"browserify>xtend":!0}},"react-markdown>remark-parse":{packages:{"react-markdown>remark-parse>mdast-util-from-markdown":!0}},"react-markdown>remark-parse>mdast-util-from-markdown":{packages:{"react-markdown>remark-parse>mdast-util-from-markdown>mdast-util-to-string":!0,"react-markdown>remark-parse>mdast-util-from-markdown>micromark":!0,"react-markdown>remark-parse>mdast-util-from-markdown>parse-entities":!0,"react-markdown>vfile>unist-util-stringify-position":!0}},"react-markdown>remark-parse>mdast-util-from-markdown>micromark":{packages:{"react-markdown>remark-parse>mdast-util-from-markdown>parse-entities":!0}},"react-markdown>remark-parse>mdast-util-from-markdown>parse-entities":{globals:{"document.createElement":!0}},"react-markdown>remark-rehype":{packages:{"react-markdown>remark-rehype>mdast-util-to-hast":!0}},"react-markdown>remark-rehype>mdast-util-to-hast":{globals:{"console.warn":!0},packages:{"react-markdown>remark-rehype>mdast-util-to-hast>mdast-util-definitions":!0,"react-markdown>remark-rehype>mdast-util-to-hast>mdurl":!0,"react-markdown>remark-rehype>mdast-util-to-hast>unist-builder":!0,"react-markdown>remark-rehype>mdast-util-to-hast>unist-util-generated":!0,"react-markdown>remark-rehype>mdast-util-to-hast>unist-util-position":!0,"react-markdown>unist-util-visit":!0}},"react-markdown>remark-rehype>mdast-util-to-hast>mdast-util-definitions":{packages:{"react-markdown>remark-rehype>mdast-util-to-hast>mdast-util-definitions>unist-util-visit":!0}},"react-markdown>remark-rehype>mdast-util-to-hast>mdast-util-definitions>unist-util-visit":{packages:{"react-markdown>remark-rehype>mdast-util-to-hast>mdast-util-definitions>unist-util-visit>unist-util-visit-parents":!0}},"react-markdown>remark-rehype>mdast-util-to-hast>mdast-util-definitions>unist-util-visit>unist-util-visit-parents":{packages:{"react-markdown>remark-rehype>mdast-util-to-hast>mdast-util-definitions>unist-util-visit>unist-util-is":!0}},"react-markdown>style-to-object":{packages:{"react-markdown>style-to-object>inline-style-parser":!0}},"react-markdown>unified":{packages:{"mocha>yargs-unparser>is-plain-obj":!0,"react-markdown>unified>bail":!0,"react-markdown>unified>extend":!0,"react-markdown>unified>trough":!0,"react-markdown>vfile":!0,"react-markdown>vfile>is-buffer":!0}},"react-markdown>unist-util-visit":{packages:{"react-markdown>unist-util-visit>unist-util-visit-parents":!0}},"react-markdown>unist-util-visit>unist-util-visit-parents":{packages:{"react-markdown>unist-util-visit>unist-util-is":!0}},"react-markdown>vfile":{globals:{"process.cwd":!0},packages:{"path-browserify":!0,process:!0,"react-markdown>vfile>is-buffer":!0,"react-markdown>vfile>replace-ext":!0,"react-markdown>vfile>vfile-message":!0}},"react-markdown>vfile>replace-ext":{packages:{"path-browserify":!0}},"react-markdown>vfile>vfile-message":{packages:{"react-markdown>vfile>unist-util-stringify-position":!0}},"react-popper":{globals:{document:!0},packages:{"@popperjs/core":!0,react:!0,"react-popper>react-fast-compare":!0}},"react-popper>react-fast-compare":{globals:{Element:!0,"console.warn":!0}},"react-redux":{globals:{"console.warn":!0,document:!0},packages:{"@babel/runtime":!0,react:!0,"react-dom":!0,"react-redux>hoist-non-react-statics":!0,"react-redux>react-is":!0,"react-redux>use-sync-external-store":!0}},"react-redux>hoist-non-react-statics":{packages:{"react-redux>hoist-non-react-statics>react-is":!0}},"react-redux>use-sync-external-store":{globals:{document:!0},packages:{react:!0}},"react-router-dom":{globals:{FormData:!0,URL:!0,URLSearchParams:!0,__reactRouterVersion:"write",addEventListener:!0,confirm:!0,document:!0,history:!0,"location.href":!0,removeEventListener:!0,scrollTo:!0,scrollY:!0,"sessionStorage.getItem":!0,"sessionStorage.setItem":!0,setTimeout:!0},packages:{react:!0,"react-dom":!0,"react-router-dom>@remix-run/router":!0,"react-router-dom>react-router":!0}},"react-router-dom>@remix-run/router":{globals:{AbortController:!0,DOMException:!0,FormData:!0,Headers:!0,Request:!0,Response:!0,URL:!0,URLSearchParams:!0,console:!0,"document.defaultView":!0,history:!0}},"react-router-dom>react-router":{globals:{"console.error":!0,"console.warn":!0},packages:{react:!0,"react-router-dom>@remix-run/router":!0}},"react-simple-file-input":{globals:{File:!0,FileReader:!0,"console.warn":!0},packages:{"prop-types":!0,react:!0}},"react-tippy":{globals:{Element:!0,MSStream:!0,MutationObserver:!0,addEventListener:!0,clearTimeout:!0,"console.error":!0,"console.warn":!0,define:!0,document:!0,getComputedStyle:!0,innerHeight:!0,innerWidth:!0,"navigator.maxTouchPoints":!0,"navigator.msMaxTouchPoints":!0,"navigator.userAgent":!0,performance:!0,requestAnimationFrame:!0,setTimeout:!0},packages:{react:!0,"react-dom":!0,"react-tippy>popper.js":!0}},"react-tippy>popper.js":{globals:{MSInputMethodContext:!0,"Node.DOCUMENT_POSITION_FOLLOWING":!0,cancelAnimationFrame:!0,"console.warn":!0,devicePixelRatio:!0,document:!0,getComputedStyle:!0,innerHeight:!0,innerWidth:!0,"navigator.userAgent":!0,requestAnimationFrame:!0,setTimeout:!0}},"react-toggle-button":{globals:{cancelAnimationFrame:!0,clearTimeout:!0,"console.warn":!0,define:!0,performance:!0,requestAnimationFrame:!0,setTimeout:!0},packages:{react:!0}},"react-transition-group":{globals:{Element:!0,setTimeout:!0},packages:{"@babel/runtime":!0,"prop-types":!0,react:!0,"react-dom":!0,"react-transition-group>dom-helpers":!0}},"readable-stream":{globals:{AbortController:!0,AbortSignal:!0,AggregateError:!0,Blob:!0,queueMicrotask:!0},packages:{"browserify>string_decoder":!0,buffer:!0,"openai>abort-controller":!0,process:!0,"webpack>events":!0}},"readable-stream-2>core-util-is":{globals:{"Buffer.isBuffer":!0},packages:{buffer:!0}},"readable-stream-2>process-nextick-args":{globals:{process:!0},packages:{process:!0}},"readable-stream-2>util-deprecate":{globals:{"console.trace":!0,"console.warn":!0,localStorage:!0}},redux:{globals:{console:!0},packages:{"@babel/runtime":!0}},"remote-redux-devtools":{globals:{"console.log":!0,"console.warn":!0,fetch:!0,setTimeout:!0},packages:{"remote-redux-devtools>jsan":!0,"remote-redux-devtools>redux-devtools-core":!0,"remote-redux-devtools>redux-devtools-instrument":!0,"remote-redux-devtools>rn-host-detect":!0,"remote-redux-devtools>socketcluster-client":!0}},"remote-redux-devtools>jsan":{globals:{"console.warn":!0}},"remote-redux-devtools>redux-devtools-core":{globals:{ErrorUtils:!0,console:!0,devToolsOptions:!0,onerror:"write",serializeState:!0},packages:{lodash:!0,"remote-redux-devtools>jsan":!0,"remote-redux-devtools>redux-devtools-core>get-params":!0,"remote-redux-devtools>redux-devtools-core>nanoid":!0,"remote-redux-devtools>redux-devtools-core>remotedev-serialize":!0}},"remote-redux-devtools>redux-devtools-core>get-params":{globals:{GetParams:"write"}},"remote-redux-devtools>redux-devtools-instrument":{globals:{chrome:!0,"console.error":!0,process:!0,setTimeout:!0},packages:{lodash:!0,"mockttp>@httptoolkit/subscriptions-transport-ws>symbol-observable":!0,process:!0}},"remote-redux-devtools>rn-host-detect":{globals:{__DEV__:!0,__fbBatchedBridgeConfig:!0,console:!0}},"remote-redux-devtools>socketcluster-client":{globals:{WebSocket:!0,WorkerGlobalScope:!0,addEventListener:!0,clearTimeout:!0,localStorage:!0,location:!0,removeEventListener:!0,setTimeout:!0},packages:{"remote-redux-devtools>socketcluster-client>buffer":!0,"remote-redux-devtools>socketcluster-client>clone":!0,"remote-redux-devtools>socketcluster-client>component-emitter":!0,"remote-redux-devtools>socketcluster-client>linked-list":!0,"remote-redux-devtools>socketcluster-client>querystring":!0,"remote-redux-devtools>socketcluster-client>sc-channel":!0,"remote-redux-devtools>socketcluster-client>sc-errors":!0,"remote-redux-devtools>socketcluster-client>sc-formatter":!0,"remote-redux-devtools>socketcluster-client>uuid":!0}},"remote-redux-devtools>socketcluster-client>buffer":{globals:{console:!0},packages:{"base64-js":!0,"buffer>ieee754":!0}},"remote-redux-devtools>socketcluster-client>clone":{globals:{Buffer:!0},packages:{"remote-redux-devtools>socketcluster-client>buffer":!0}},"remote-redux-devtools>socketcluster-client>sc-channel":{packages:{"remote-redux-devtools>socketcluster-client>sc-channel>component-emitter":!0}},"remote-redux-devtools>socketcluster-client>sc-formatter":{globals:{Buffer:!0}},"remote-redux-devtools>socketcluster-client>uuid":{globals:{crypto:!0,msCrypto:!0}},reselect:{globals:{WeakRef:!0,"console.warn":!0}},rxjs:{globals:{clearInterval:!0,clearTimeout:!0,"setInterval.apply":!0,"setTimeout.apply":!0},packages:{tslib:!0}},semver:{globals:{"console.error":!0,process:!0},packages:{process:!0}},"stream-browserify":{packages:{"duplexify>inherits":!0,"stream-browserify>readable-stream":!0,"webpack>events":!0}},"stream-browserify>readable-stream":{globals:{"process.nextTick":!0,"process.stderr":!0,"process.stdout":!0},packages:{"browserify>string_decoder":!0,buffer:!0,"duplexify>inherits":!0,process:!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"stream-http":{globals:{AbortController:!0,Blob:!0,"Buffer.alloc":!0,"Buffer.from":!0,MSStreamReader:!0,ReadableStream:!0,WritableStream:!0,XDomainRequest:!0,XMLHttpRequest:!0,clearTimeout:!0,fetch:!0,"location.protocol.search":!0,"process.nextTick":!0,setTimeout:!0},packages:{"browserify>url":!0,"browserify>xtend":!0,buffer:!0,"duplexify>inherits":!0,process:!0,"stream-http>builtin-status-codes":!0,"stream-http>readable-stream":!0}},"stream-http>readable-stream":{globals:{"process.nextTick":!0,"process.stderr":!0,"process.stdout":!0},packages:{"browserify>string_decoder":!0,buffer:!0,"duplexify>inherits":!0,process:!0,"readable-stream-2>util-deprecate":!0,"webpack>events":!0}},"string.prototype.matchall>call-bind":{packages:{"string.prototype.matchall>call-bind>call-bind-apply-helpers":!0,"string.prototype.matchall>call-bind>es-define-property":!0,"string.prototype.matchall>call-bind>set-function-length":!0,"string.prototype.matchall>get-intrinsic":!0}},"string.prototype.matchall>call-bind>call-bind-apply-helpers":{packages:{"browserify>has>function-bind":!0,"string.prototype.matchall>es-errors":!0}},"string.prototype.matchall>call-bind>set-function-length":{packages:{"eslint-plugin-react>es-iterator-helpers>has-property-descriptors":!0,"string.prototype.matchall>define-properties>define-data-property":!0,"string.prototype.matchall>es-errors":!0,"string.prototype.matchall>get-intrinsic":!0,"string.prototype.matchall>gopd":!0}},"string.prototype.matchall>call-bound":{packages:{"string.prototype.matchall>call-bind>call-bind-apply-helpers":!0,"string.prototype.matchall>get-intrinsic":!0}},"string.prototype.matchall>define-properties":{packages:{"@lavamoat/webpack>json-stable-stringify>object-keys":!0,"eslint-plugin-react>es-iterator-helpers>has-property-descriptors":!0,"string.prototype.matchall>define-properties>define-data-property":!0}},"string.prototype.matchall>define-properties>define-data-property":{packages:{"string.prototype.matchall>call-bind>es-define-property":!0,"string.prototype.matchall>es-errors":!0,"string.prototype.matchall>gopd":!0}},"string.prototype.matchall>es-abstract>array-buffer-byte-length":{packages:{"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>es-abstract>is-array-buffer":!0}},"string.prototype.matchall>es-abstract>available-typed-arrays":{packages:{"string.prototype.matchall>es-abstract>typed-array-length>possible-typed-array-names":!0}},"string.prototype.matchall>es-abstract>es-to-primitive>is-symbol":{packages:{"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>es-abstract>safe-regex-test":!0,"string.prototype.matchall>has-symbols":!0}},"string.prototype.matchall>es-abstract>get-proto":{packages:{"eslint-plugin-react>es-iterator-helpers>has-proto>dunder-proto":!0,"string.prototype.matchall>es-object-atoms":!0}},"string.prototype.matchall>es-abstract>is-array-buffer":{packages:{"string.prototype.matchall>call-bind":!0,"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>get-intrinsic":!0}},"string.prototype.matchall>es-abstract>is-callable":{globals:{document:!0}},"string.prototype.matchall>es-abstract>is-regex":{packages:{"eslint-plugin-react>hasown":!0,"jsdom>form-data>es-set-tostringtag>has-tostringtag":!0,"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>gopd":!0}},"string.prototype.matchall>es-abstract>is-shared-array-buffer":{packages:{"string.prototype.matchall>call-bound":!0}},"string.prototype.matchall>es-abstract>object-inspect":{globals:{HTMLElement:!0,WeakRef:!0}},"string.prototype.matchall>es-abstract>safe-regex-test":{packages:{"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>es-abstract>is-regex":!0,"string.prototype.matchall>es-errors":!0}},"string.prototype.matchall>es-abstract>stop-iteration-iterator":{globals:{StopIteration:!0},packages:{"string.prototype.matchall>es-errors":!0,"string.prototype.matchall>internal-slot":!0}},"string.prototype.matchall>es-abstract>typed-array-buffer":{packages:{"browserify>util>is-typed-array":!0,"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>es-errors":!0}},"string.prototype.matchall>get-intrinsic":{globals:{AggregateError:!0,Atomics:!0,FinalizationRegistry:!0,Float16Array:!0,Float32Array:!0,Float64Array:!0,SharedArrayBuffer:!0,WeakRef:!0},packages:{"browserify>has>function-bind":!0,"eslint-plugin-react>array-includes>math-intrinsics":!0,"eslint-plugin-react>hasown":!0,"string.prototype.matchall>call-bind>call-bind-apply-helpers":!0,"string.prototype.matchall>call-bind>es-define-property":!0,"string.prototype.matchall>es-abstract>get-proto":!0,"string.prototype.matchall>es-errors":!0,"string.prototype.matchall>es-object-atoms":!0,"string.prototype.matchall>get-intrinsic>async-function":!0,"string.prototype.matchall>get-intrinsic>async-generator-function":!0,"string.prototype.matchall>get-intrinsic>generator-function":!0,"string.prototype.matchall>gopd":!0,"string.prototype.matchall>has-symbols":!0}},"string.prototype.matchall>internal-slot":{packages:{"eslint-plugin-react>hasown":!0,"string.prototype.matchall>es-errors":!0,"string.prototype.matchall>side-channel":!0}},"string.prototype.matchall>regexp.prototype.flags":{packages:{"string.prototype.matchall>call-bind":!0,"string.prototype.matchall>define-properties":!0,"string.prototype.matchall>es-abstract>get-proto":!0,"string.prototype.matchall>es-errors":!0,"string.prototype.matchall>gopd":!0,"string.prototype.matchall>set-function-name":!0}},"string.prototype.matchall>set-function-name":{packages:{"eslint-plugin-react>es-iterator-helpers>has-property-descriptors":!0,"string.prototype.matchall>define-properties>define-data-property":!0,"string.prototype.matchall>es-errors":!0,"string.prototype.matchall>set-function-name>functions-have-names":!0}},"string.prototype.matchall>side-channel":{packages:{"string.prototype.matchall>es-abstract>object-inspect":!0,"string.prototype.matchall>es-errors":!0,"string.prototype.matchall>side-channel>side-channel-list":!0,"string.prototype.matchall>side-channel>side-channel-map":!0,"string.prototype.matchall>side-channel>side-channel-weakmap":!0}},"string.prototype.matchall>side-channel>side-channel-list":{packages:{"string.prototype.matchall>es-abstract>object-inspect":!0,"string.prototype.matchall>es-errors":!0}},"string.prototype.matchall>side-channel>side-channel-map":{packages:{"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>es-abstract>object-inspect":!0,"string.prototype.matchall>es-errors":!0,"string.prototype.matchall>get-intrinsic":!0}},"string.prototype.matchall>side-channel>side-channel-weakmap":{packages:{"string.prototype.matchall>call-bound":!0,"string.prototype.matchall>es-abstract>object-inspect":!0,"string.prototype.matchall>es-errors":!0,"string.prototype.matchall>get-intrinsic":!0,"string.prototype.matchall>side-channel>side-channel-map":!0}},tslib:{globals:{SuppressedError:!0}},tweetnacl:{globals:{Float64Array:!0,crypto:!0,msCrypto:!0,nacl:"write"}},"uri-js":{globals:{define:!0}},uuid:{globals:{crypto:!0,msCrypto:!0}},viem:{globals:{AbortController:!0,Image:!0,Request:!0,TextDecoder:!0,TextEncoder:!0,URL:!0,atob:!0,btoa:!0,clearInterval:!0,clearTimeout:!0,"console.error":!0,fetch:!0,setInterval:!0,setTimeout:!0},packages:{"@noble/hashes":!0,"viem>@noble/curves":!0,"viem>abitype":!0,"viem>isows":!0,"viem>ox":!0}},"viem>@noble/curves":{globals:{TextEncoder:!0},packages:{"@noble/hashes":!0}},"viem>isows":{globals:{WebSocket:!0}},"viem>ox":{globals:{TextDecoder:!0,TextEncoder:!0,"crypto.getRandomValues":!0},packages:{"@noble/hashes":!0,"viem>abitype":!0,"viem>ox>@noble/curves":!0}},"viem>ox>@noble/curves":{globals:{TextEncoder:!0},packages:{"@noble/hashes":!0}},"wait-on>axios":{globals:{AbortController:!0,Blob:!0,FormData:!0,ReadableStream:!0,Request:!0,Response:!0,TextEncoder:!0,URL:!0,URLSearchParams:!0,WorkerGlobalScope:!0,XMLHttpRequest:!0,btoa:!0,clearTimeout:!0,"console.warn":!0,document:!0,fetch:!0,importScripts:!0,"location.href":!0,navigator:!0,postMessage:!0,process:!0,queueMicrotask:!0,setImmediate:!0,setTimeout:!0},packages:{"core-js-pure":!0,process:!0}},"web-vitals":{globals:{"PerformanceEventTiming.prototype":!0,PerformanceObserver:!0,addEventListener:!0,"document.addEventListener":!0,"document.prerendering":!0,"document.readyState":!0,"document.visibilityState":!0,"document.wasDiscarded":!0,performance:!0,removeEventListener:!0,requestAnimationFrame:!0,requestIdleCallback:!0,setTimeout:!0}},"webextension-polyfill":{globals:{browser:!0,chrome:!0,"console.error":!0,"console.warn":!0,define:!0}},"webpack>events":{globals:{console:!0}}}},LAVAMOAT.ENUM={NAME_globalThis:"G",NAME_scopeTerminator:"ST",NAME_runtimeHandler:"RH",RUNTIME_KEY:"_LM_"},(()=>{let module={exports:{}};function extendPath(visited,next){return visited&&0!==visited.length?`${visited}.${next}`:next}function instrumentDynamicValueAtPath(pathParts,sourceRef,targetRef,wrapFn,unwrapTo,unwrapFrom){let enumerable=Reflect.getOwnPropertyDescriptor(sourceRef,pathParts[0])?.enumerable,initialTopValue=sourceRef[pathParts[0]],wrappedInitialTopV=wrapFn&&unwrapTo&&"function"==typeof initialTopValue?wrapFn(initialTopValue,thisValue=>thisValue===unwrapFrom,unwrapTo):initialTopValue,currentTarget=targetRef,currentPath="";for(let depth=0;depth<pathParts.length-1;depth++){currentPath=extendPath(currentPath,pathParts[depth]);let nextPart=pathParts[depth];if(Reflect.getOwnPropertyDescriptor(currentTarget,nextPart)?.get)throw Error(`LavaMoat - "${pathParts[0]}" is writeable elsewhere and both "${currentPath}" and "${pathParts.join(".")}" are allowed for one package. One of these entries is redundant.`);"object"!=typeof currentTarget[nextPart]&&(currentTarget[nextPart]={}),currentTarget=currentTarget[nextPart]}Reflect.defineProperty(currentTarget,pathParts[pathParts.length-1],{get:()=>{let leaf,parent,dynamicValue=sourceRef[pathParts[0]];leaf="function"==typeof dynamicValue&&dynamicValue===initialTopValue?wrappedInitialTopV:dynamicValue;for(let i=1;i<pathParts.length;i++)parent=leaf,leaf=leaf[pathParts[i]];return"function"==typeof leaf&&pathParts.length>1&&(leaf=leaf.bind(parent)),leaf},writeable:!1,enumerable,configurable:!1})}function defaultCreateFunctionWrapper(sourceValue,unwrapTest,unwrapTo){let newValue=function(){return new.target?Reflect.construct(sourceValue,arguments,new.target):Reflect.apply(sourceValue,unwrapTest(this)?unwrapTo:this,arguments)};return Object.defineProperties(newValue,Object.getOwnPropertyDescriptors(sourceValue)),Reflect.getPrototypeOf(newValue)!==Reflect.getPrototypeOf(sourceValue)&&Object.setPrototypeOf(newValue,Reflect.getPrototypeOf(sourceValue)),newValue}module.exports,module.exports=function({createFunctionWrapper=defaultCreateFunctionWrapper,handleGlobalWrite=!1,knownWritableFields=new Set}={}){return{getEndowmentsForConfig:function(sourceRef,packagePolicy,unwrapTo,unwrapFrom){if(!packagePolicy.globals)return{};let whitelistedReads=[],allowedWriteFields=new Set,explicitlyBanned=[];return Object.entries(packagePolicy.globals).forEach(([path,packagePolicyValue])=>{let pathParts=path.split(".");if(pathParts.some(pathPart=>"__proto__"===pathPart))throw Error(`Lavamoat - "__proto__" disallowed when creating minimal view. saw "${path}"`);if(!1===packagePolicyValue)return void explicitlyBanned.push(path);if(whitelistedReads.push(path),"write"===packagePolicyValue){if(handleGlobalWrite){if(pathParts.length>1)throw Error(`LavaMoat - write access is only allowed at the top level, saw "${path}"`);allowedWriteFields.add(path)}}else if(!0!==packagePolicyValue)throw Error(`LavaMoat - unrecognizable policy value (${typeof packagePolicyValue}) for path "${path}"`)}),whitelistedReads.sort((a,b)=>a.length-b.length),makeMinimalViewOfRef(sourceRef,whitelistedReads,unwrapTo,unwrapFrom,explicitlyBanned,allowedWriteFields)},copyWrappedGlobals:function(globalRef,target,globalThisRefs=["globalThis"]){let globalProtoChain=function(value){let protoChain=[],current=value;for(;current&&("object"==typeof current||"function"==typeof current);)protoChain.push(current),current=Reflect.getPrototypeOf(current);return protoChain}(globalRef),commonPrototypeIndex=globalProtoChain.findIndex(globalProtoChainEntry=>globalProtoChainEntry===Object.prototype),noSharedPrototype=-1===commonPrototypeIndex;noSharedPrototype&&(commonPrototypeIndex=globalProtoChain.length);let endowmentSources=globalProtoChain.slice(0,commonPrototypeIndex);endowmentSources.forEach(source=>{Object.values(Object.getOwnPropertyDescriptors(source)).forEach(desc=>{if("get"in desc&&desc.get)try{Reflect.apply(desc.get,globalRef,[])}catch{}})});let endowmentSourceDescriptors=endowmentSources.map((globalProtoChainEntry,index)=>{let candidateDescriptors=Object.getOwnPropertyDescriptors(globalProtoChainEntry);return noSharedPrototype&&index===endowmentSources.length-1?Object.fromEntries(Object.entries(candidateDescriptors).filter(([key])=>!(key in Object.prototype))):candidateDescriptors});for(let ref of(Object.entries(Object.assign(Object.create(null),...endowmentSourceDescriptors.reverse())).filter(([key])=>!(key in target)).filter(([key])=>!globalThisRefs.includes(key)).forEach(([key,desc])=>{let wrappedPropDesc=applyEndowmentPropDescTransforms(desc,target,globalRef);Reflect.defineProperty(target,key,wrappedPropDesc)}),globalThisRefs))ref in target||(target[ref]=target);return target},getBuiltinForConfig:function(moduleNamespace,moduleId,policyBuiltin){let builtinPaths=[],explicitlyBanned=[];return Object.entries(policyBuiltin).forEach(([packagePath,allowed])=>{let packagePathParts=packagePath.split(".");if(moduleId===packagePathParts[0]){let packagePathWithoutPackage=packagePathParts.slice(1).join(".");!0===allowed?builtinPaths.push(packagePathWithoutPackage):!1===allowed&&explicitlyBanned.push(packagePathWithoutPackage)}}),attenuateBuiltin(moduleNamespace,builtinPaths,explicitlyBanned)},createFunctionWrapper,attenuateBuiltin,makeMinimalViewOfRef,copyValueAtPath,applyGetSetPropDescTransforms,applyEndowmentPropDescTransforms};function makeMinimalViewOfRef(sourceRef,paths,unwrapTo,unwrapFrom,explicitlyBanned=[],allowedWriteFields=new Set){let targetRef={};return paths.forEach(path=>{let pathParts=path.split(".");knownWritableFields.has(pathParts[0])?allowedWriteFields.has(pathParts[0])?function(key,sourceRef,targetRef,wrapFn,unwrapTo,unwrapFrom){let enumerable=Reflect.getOwnPropertyDescriptor(sourceRef,key)?.enumerable,initialValue=sourceRef[key],wrappedInitialValue=wrapFn&&unwrapTo&&"function"==typeof initialValue?wrapFn(initialValue,thisValue=>thisValue===unwrapFrom,unwrapTo):initialValue;Reflect.defineProperty(targetRef,key,{configurable:!1,enumerable,set(newValue){sourceRef[key]=newValue},get:()=>sourceRef[key]===initialValue?wrappedInitialValue:sourceRef[key]})}(pathParts[0],sourceRef,targetRef,createFunctionWrapper,unwrapTo,unwrapFrom||targetRef):instrumentDynamicValueAtPath(pathParts,sourceRef,targetRef,createFunctionWrapper,unwrapTo,unwrapFrom||targetRef):copyValueAtPath("",pathParts,explicitlyBanned,sourceRef,targetRef,unwrapTo,unwrapFrom)}),targetRef}function attenuateBuiltin(moduleNamespace,paths,explicitlyBanned=[]){return makeMinimalViewOfRef(moduleNamespace,paths.sort(),void 0,void 0,explicitlyBanned)}function copyValueAtPath(visitedPath,pathParts,explicitlyBanned,sourceRef,targetRef,unwrapTo=sourceRef,unwrapFrom=targetRef){if(0===pathParts.length)throw Error("unable to copy, must have pathParts, was empty");let[nextPart,...remainingParts]=pathParts,currentPath=extendPath(visitedPath,nextPart),{prop:sourcePropDesc}=function(target,key){let receiver=target;for(;;){if(!receiver)return{prop:null,receiver:null};let typeofReceiver=typeof receiver;if("object"===typeofReceiver||"function"===typeofReceiver){let prop=Reflect.getOwnPropertyDescriptor(receiver,key);if(prop)return{receiver,prop};receiver=Reflect.getPrototypeOf(receiver)}else receiver=receiver.__proto__}}(sourceRef,nextPart);if(!sourcePropDesc)return;let targetPropDesc=Reflect.getOwnPropertyDescriptor(targetRef,nextPart);if(targetPropDesc){if(!("value"in targetPropDesc))throw Error(`unable to copy on to targetRef, targetRef has a getter at "${currentPath}"`);let valueType=typeof targetPropDesc.value;if("object"!==valueType&&"function"!==valueType)throw Error(`unable to copy on to targetRef, targetRef value is not an obj or func at "${currentPath}"`)}if(remainingParts.length>0){let nextTargetRef,{sourceValue,sourceWritable}=getSourceValue(sourcePropDesc);if(targetPropDesc&&!explicitlyBanned.includes(currentPath))nextTargetRef=targetPropDesc.value;else{let containerRef={};Reflect.defineProperty(targetRef,nextPart,{value:containerRef,writable:sourceWritable,enumerable:sourcePropDesc.enumerable,configurable:sourcePropDesc.configurable}),nextTargetRef=containerRef}copyValueAtPath(currentPath,remainingParts,explicitlyBanned,sourceValue,nextTargetRef);return}if(explicitlyBanned.includes(currentPath))return void console.warn(`LavaMoat - conflicting rules exist for "${currentPath}"`);if(!("value"in sourcePropDesc))return void Reflect.defineProperty(targetRef,nextPart,applyGetSetPropDescTransforms(sourcePropDesc,unwrapFrom,unwrapTo));let{sourceValue,sourceWritable}=getSourceValue(sourcePropDesc);if("function"!=typeof sourceValue)return void Reflect.defineProperty(targetRef,nextPart,sourcePropDesc);function getSourceValue(sourcePropDesc){let sourceValue,sourceWritable;if("value"in sourcePropDesc)sourceValue=sourcePropDesc.value,sourceWritable=sourcePropDesc.writable;else if("get"in sourcePropDesc&&sourcePropDesc.get)sourceValue=sourcePropDesc.get.call(unwrapTo),sourceWritable="set"in sourcePropDesc;else throw Error("getEndowmentsForConfig - property descriptor missing a getter");return{sourceValue,sourceWritable}}Reflect.defineProperty(targetRef,nextPart,{value:createFunctionWrapper(sourceValue,thisValue=>thisValue===unwrapFrom,unwrapTo),writable:sourceWritable,enumerable:sourcePropDesc.enumerable,configurable:sourcePropDesc.configurable})}function applyEndowmentPropDescTransforms(propDesc,unwrapFromCompartmentGlobalThis,unwrapToGlobalThis){let newPropDesc=propDesc;return applyGetSetPropDescTransforms(newPropDesc=function(propDesc,unwrapFromCompartmentGlobalThis,unwrapToGlobalThis){if(!("value"in propDesc&&"function"==typeof propDesc.value))return propDesc;let newFn=createFunctionWrapper(propDesc.value,thisValue=>thisValue===unwrapFromCompartmentGlobalThis,unwrapToGlobalThis);return{...propDesc,value:newFn}}(newPropDesc,unwrapFromCompartmentGlobalThis,unwrapToGlobalThis),unwrapFromCompartmentGlobalThis,unwrapToGlobalThis)}function applyGetSetPropDescTransforms(sourcePropDesc,unwrapFromGlobalThis,unwrapToGlobalThis){let wrappedPropDesc={...sourcePropDesc};return sourcePropDesc.get&&(wrappedPropDesc.get=function(){let result=Reflect.apply(sourcePropDesc.get,this===unwrapFromGlobalThis?unwrapToGlobalThis:this,[]);return"function"==typeof result?createFunctionWrapper(result,thisValue=>thisValue===unwrapFromGlobalThis,unwrapToGlobalThis):result}),sourcePropDesc.set&&(wrappedPropDesc.set=function(value){let receiverRef=this===unwrapFromGlobalThis?unwrapToGlobalThis:this;return Reflect.apply(sourcePropDesc.set,receiverRef,[value])}),wrappedPropDesc}},module.exports.defaultCreateFunctionWrapper=defaultCreateFunctionWrapper,module.exports._test={instrumentDynamicValueAtPath},LAVAMOAT.endowmentsToolkit=module.exports})(),(()=>{let module={exports:{}},exports=module.exports;"event"in globalThis&&(globalThis.event=void 0);let{getOwnPropertyNames}=Object;function getPrototypeChain(value){let protoChain=[],current=value;for(;current&&("object"==typeof current||"function"==typeof current);)protoChain.push(current),current=Reflect.getPrototypeOf(current);return protoChain}!function(globalRef){if("window"in globalRef&&"object"==typeof globalRef.window&&globalRef!==globalRef.window){let win=globalRef.window,windowProtoChain=getPrototypeChain(win),globalProtoChain=getPrototypeChain(globalRef);windowProtoChain.pop();let considerKeys=windowProtoChain.flatMap(proto=>getOwnPropertyNames(proto)),globalKeys=new Set(globalProtoChain.flatMap(proto=>getOwnPropertyNames(proto)));for(let key of considerKeys)if(!globalKeys.has(key)&&key in globalThis&&void 0!==win[key])try{globalRef[key]=globalRef[key]}catch{}}}(globalThis);let{defineProperty}=Object,{call}=Function.prototype,messageToGlobalMap=new WeakMap,theRealGlobalThis=globalThis,mep=MessageEvent.prototype,lastResortGlobal=new Compartment().globalThis,original=Object.getOwnPropertyDescriptor(mep,"source");if(original&&original.get){let sourceGetter=call.bind(original.get);defineProperty(mep,"source",{...original,get(){let w=sourceGetter(this);return w===theRealGlobalThis||w===theRealGlobalThis.window?messageToGlobalMap.get(this)||lastResortGlobal:w}})}exports.MessageEvent=(endowments,theRealGlobalThis,packageCompartmentGlobal)=>{let originalConstructor=endowments.MessageEvent;originalConstructor&&(endowments.MessageEvent=function(type,eventInitDict){let nestedResult=new originalConstructor(type,eventInitDict);return messageToGlobalMap.set(nestedResult,packageCompartmentGlobal),nestedResult},endowments.MessageEvent.prototype=originalConstructor.prototype)},exports.addEventListener=(endowments,theRealGlobalThis,packageCompartmentGlobal)=>{let originalListener=endowments.addEventListener;originalListener&&(endowments.addEventListener=(type,listener,options)=>"message"===type?originalListener.call(theRealGlobalThis,type,event=>(messageToGlobalMap.set(event,packageCompartmentGlobal),listener.call(packageCompartmentGlobal,event)),options):originalListener.call(packageCompartmentGlobal,type,listener,options))},LAVAMOAT.repairs=module.exports})(),(()=>{let rootCompartmentGlobalThis,module={exports:{}};module.exports;let{repairIntrinsics}=globalThis,warn="object"==typeof console?console.warn:()=>{},LOCKDOWN_ON=void 0!==repairIntrinsics;LOCKDOWN_ON?(repairIntrinsics(LAVAMOAT.options.lockdown),LOCKDOWN_SHIMS.forEach(shim=>{shim()}),hardenIntrinsics()):warn("LavaMoatPlugin: runtime execution started without SES present, switching to no-op.");let{keys,create,freeze,assign,defineProperty,defineProperties,getOwnPropertyDescriptors,fromEntries,entries,values}=Object,{Proxy,Math,Date}=globalThis,{harden:harden1}=globalThis,knownWritableFields=new Set;values(LAVAMOAT.policy.resources).forEach(resource=>{resource.globals&&"object"==typeof resource.globals&&entries(resource.globals).forEach(([key,value])=>{"write"===value&&knownWritableFields.add(key)})});let{getEndowmentsForConfig,copyWrappedGlobals,getBuiltinForConfig}=LAVAMOAT.endowmentsToolkit({handleGlobalWrite:!0,knownWritableFields}),{NAME_globalThis,NAME_scopeTerminator,NAME_runtimeHandler}=LAVAMOAT.ENUM,stricterScopeTerminator=freeze(new Proxy(freeze(create(null)),freeze({has:freeze(()=>!0)}))),theRealGlobalThis=globalThis,globalAliases=["window","self","global","globalThis","frames"],repairsAvailable=keys(LAVAMOAT.repairs||{}),compartmentMap=new Map,findResourceId=moduleId=>{let found=LAVAMOAT.idmap.find(([,moduleIds])=>moduleIds.includes(moduleId));if(found)return found[0]};LAVAMOAT.defaultExport=freeze((resourceId,runtimeKit)=>{if(!LOCKDOWN_ON)return create(null);if(!compartmentMap.has(resourceId)){let c=new Compartment({Math,Date});((resourceId,packageCompartmentGlobal)=>{if(resourceId===LAVAMOAT.root)copyWrappedGlobals(theRealGlobalThis,rootCompartmentGlobalThis=packageCompartmentGlobal,globalAliases),LAVAMOAT?.scuttling?.scuttle(theRealGlobalThis,LAVAMOAT.options?.scuttleGlobalThis);else{let packagePolicy=LAVAMOAT.policy.resources[resourceId]||{},endowments=getEndowmentsForConfig(rootCompartmentGlobalThis,packagePolicy,globalThis,packageCompartmentGlobal);repairsAvailable.length>0&&packagePolicy.globals&&keys(packagePolicy.globals).length>0&&repairsAvailable.forEach(repairName=>{if(endowments[repairName]){let repair=LAVAMOAT.repairs[repairName];repair&&repair(endowments,theRealGlobalThis,packageCompartmentGlobal)}}),defineProperties(packageCompartmentGlobal,{...getOwnPropertyDescriptors(endowments),...fromEntries(globalAliases.map(alias=>[alias,{value:packageCompartmentGlobal}]))}),LAVAMOAT.debug&&LAVAMOAT.debug.debugProxy(packageCompartmentGlobal,rootCompartmentGlobalThis,resourceId)}})(resourceId,c.globalThis),compartmentMap.set(resourceId,c)}let overrides=create(null),{__webpack_require__}=runtimeKit,{module}=runtimeKit;if(__webpack_require__){let policyRequire=function(specifier,...rest){"number"!=typeof specifier&&(specifier=`${specifier}`);let requireThat=__webpack_require__.bind(this,specifier,...rest);var specifier1=specifier;if(void 0===specifier1)throw Error("Requested specifier is undefined");if(LAVAMOAT.unenforceable.includes(specifier1)||resourceId===LAVAMOAT.root)return requireThat();let referrerPolicy=LAVAMOAT.policy.resources[resourceId]||{};if(LAVAMOAT.externals[specifier1]){let externalName=LAVAMOAT.externals[specifier1];if(referrerPolicy.builtin){if(referrerPolicy.builtin[externalName])return requireThat();if(externalName&&!externalName.includes(".")&&keys(referrerPolicy.builtin).some(key=>key.startsWith(`${externalName}.`)))return getBuiltinForConfig(requireThat(),externalName,referrerPolicy.builtin)}if(referrerPolicy.packages){let requestedResourceId=findResourceId(externalName);if(requestedResourceId&&referrerPolicy.packages[requestedResourceId])return requireThat()}}let requestedResourceId=findResourceId(specifier1);if(!requestedResourceId){if(LAVAMOAT.ctxm.includes(specifier1))throw Error(`'${resourceId}' is trying to load a module dynamically from a dependency it has not been allowed using the following Webpack Context Module: '${specifier1}'`);throw Error(`Requested specifier '${specifier1}' is not allowed as a builtin and is not a known dependency of '${resourceId}'; regenerate policy or add it to policy-override.json.`)}if(requestedResourceId===resourceId||referrerPolicy.packages?.[requestedResourceId])return requireThat();throw Error(`Policy does not allow importing ${requestedResourceId} from ${resourceId}`)};for(let item of(policyRequire.e=chunkId=>{if(!LAVAMOAT.kch.includes(chunkId))throw Error(`Attempt to load a chunk that was not known at compile time: ${chunkId} from ${resourceId}`);return __webpack_require__.e(chunkId)},["O","n","d","o","r","s","t","b","j","dn","ns"]))policyRequire[item]=harden1(__webpack_require__[item]);policyRequire.m=new Proxy({},{has:(target,prop)=>(warn(`A module attempted to read ${String(prop)} directly from webpack's module cache`),!1)}),policyRequire.g=compartmentMap.get(resourceId).globalThis,policyRequire.nmd=moduleReference=>moduleReference===module?__webpack_require__.nmd(module):moduleReference,policyRequire.hmd=moduleReference=>moduleReference===module?__webpack_require__.hmd(module):moduleReference,overrides.__webpack_require__=policyRequire}let runtimeHandler=assign(create(null),runtimeKit,overrides);defineProperty(runtimeHandler,"module",{get:()=>module,set:()=>{}});let exportsReference=runtimeHandler.exports;return defineProperty(runtimeHandler,"exports",{get:()=>exportsReference,set:value=>{exportsReference=value}}),freeze(runtimeHandler),freeze(assign(create(null),{[NAME_scopeTerminator]:stricterScopeTerminator,[NAME_runtimeHandler]:runtimeHandler,[NAME_globalThis]:compartmentMap.get(resourceId).globalThis}))}),LAVAMOAT.runtime=module.exports})(),__webpack_require__._LM_=LAVAMOAT.defaultExport,"undefined"!=typeof harden&&harden(__webpack_require__._LM_)})()})();
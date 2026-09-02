/*!
 * Webflow: Front-end site library
 * @license MIT
 * Inline scripts may access the api using an async handler:
 *   var Webflow = Webflow || [];
 *   Webflow.push(readyFunction);
 */

var ss = Object.create;
var ft = Object.defineProperty;
var as = Object.getOwnPropertyDescriptor;
var ls = Object.getOwnPropertyNames;
var cs = Object.getPrototypeOf,
  us = Object.prototype.hasOwnProperty;
var ds = (n, e, t) =>
  e in n
    ? ft(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
    : (n[e] = t);
var m = (n, e) => () => (e || n((e = { exports: {} }).exports, e), e.exports);
var fs = (n, e, t, r) => {
  if ((e && typeof e == "object") || typeof e == "function")
    for (let o of ls(e))
      !us.call(n, o) &&
        o !== t &&
        ft(n, o, {
          get: () => e[o],
          enumerable: !(r = as(e, o)) || r.enumerable,
        });
  return n;
};
var Fr = (n, e, t) => (
  (t = n != null ? ss(cs(n)) : {}),
  fs(
    e || !n || !n.__esModule
      ? ft(t, "default", { value: n, enumerable: !0 })
      : t,
    n
  )
);
var fe = (n, e, t) => (ds(n, typeof e != "symbol" ? e + "" : e, t), t);
var Dr = m((vt) => {
  "use strict";
  Object.defineProperty(vt, "__esModule", { value: !0 });
  function ps(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  ps(vt, {
    CORE_OPERATORS: function () {
      return ht;
    },
    DEFAULTS: function () {
      return mt;
    },
    DEFAULT_CUSTOM_EASE: function () {
      return vs;
    },
    EASE_DEFAULTS: function () {
      return Lr;
    },
    PERCENT_CANVAS_DURATION_S: function () {
      return ys;
    },
    RELATIONSHIP_TYPES: function () {
      return yt;
    },
    STANDARD_TRIGGER_ALLOWED_CONTROLS: function () {
      return bs;
    },
    TimelineControlType: function () {
      return pt;
    },
    TweenType: function () {
      return gt;
    },
    isValidControlType: function () {
      return gs;
    },
    tweenTypeFromName: function () {
      return hs;
    },
    tweenTypeToName: function () {
      return ms;
    },
  });
  var pt;
  (function (n) {
    (n.STANDARD = "standard"),
      (n.SCROLL = "scroll"),
      (n.LOAD = "load"),
      (n.CONTINUOUS = "continuous");
  })(pt || (pt = {}));
  function gs(n) {
    return (
      n === "standard" || n === "scroll" || n === "load" || n === "continuous"
    );
  }
  var gt;
  (function (n) {
    (n[(n.To = 0)] = "To"),
      (n[(n.From = 1)] = "From"),
      (n[(n.FromTo = 2)] = "FromTo"),
      (n[(n.Set = 3)] = "Set");
  })(gt || (gt = {}));
  function hs(n) {
    switch (n) {
      case "to":
        return 0;
      case "from":
        return 1;
      case "both":
        return 2;
      case "set":
        return 3;
    }
  }
  function ms(n) {
    switch (n) {
      case 0:
        return "to";
      case 1:
        return "from";
      case 2:
        return "both";
      case 3:
        return "set";
      default:
        return null;
    }
  }
  var ht;
  (function (n) {
    (n.AND = "wf:and"), (n.OR = "wf:or");
  })(ht || (ht = {}));
  var mt;
  (function (n) {
    n[(n.DURATION = 0.5)] = "DURATION";
  })(mt || (mt = {}));
  var ys = 1,
    yt;
  (function (n) {
    (n.NONE = "none"),
      (n.WITHIN = "within"),
      (n.DIRECT_CHILD_OF = "direct-child-of"),
      (n.CONTAINS = "contains"),
      (n.DIRECT_PARENT_OF = "direct-parent-of"),
      (n.NEXT_TO = "next-to"),
      (n.NEXT_SIBLING_OF = "next-sibling-of"),
      (n.PREV_SIBLING_OF = "prev-sibling-of");
  })(yt || (yt = {}));
  var Lr = {
      back: { type: "back", curve: "out", power: 1.7 },
      elastic: { type: "elastic", curve: "out", amplitude: 1, period: 0.3 },
      steps: { type: "steps", stepCount: 6 },
      rough: {
        type: "rough",
        templateCurve: "none.inOut",
        points: 20,
        strength: 1,
        taper: "none",
        randomizePoints: !0,
        clampPoints: !1,
      },
      slowMo: { type: "slowMo", linearRatio: 0.7, power: 0.7, yoyoMode: !1 },
      expoScale: {
        type: "expoScale",
        startingScale: 0.05,
        endingScale: 1,
        templateCurve: "none.inOut",
      },
      customWiggle: {
        type: "customWiggle",
        wiggles: 10,
        wiggleType: "easeOut",
      },
      customBounce: {
        type: "customBounce",
        strength: 0.7,
        squash: 1,
        endAtStart: !1,
      },
      customEase: {
        type: "customEase",
        bezierCurve: "M0,160 C40,160 24,96 80,96 136,96 120,0 160,0",
      },
    },
    vs = Lr.back,
    bs = [
      "restart",
      "play",
      "reverse",
      "reverseFlipEase",
      "pause",
      "resume",
      "togglePlayReverse",
      "togglePlayReverseFlipEase",
      "stop",
      "none",
    ];
});
var jr = m((Tt) => {
  "use strict";
  Object.defineProperty(Tt, "__esModule", { value: !0 });
  Object.defineProperty(Tt, "RuntimeBuilder", {
    enumerable: !0,
    get: function () {
      return bt;
    },
  });
  var bt = class {
    baseInfo;
    extensions = [];
    lifecycle = {};
    constructor(e) {
      this.baseInfo = e;
    }
    addTrigger(e, t) {
      let r = `${this.baseInfo.namespace}:${e}`;
      return (
        this.extensions.push({
          extensionPoint: "trigger",
          id: r,
          triggerType: r,
          implementation: t,
        }),
        this
      );
    }
    addAction(e, t) {
      let r = `${this.baseInfo.namespace}:${e}`;
      return (
        this.extensions.push({
          extensionPoint: "action",
          id: r,
          actionType: r,
          implementation: t,
        }),
        this
      );
    }
    addTargetResolver(e, t) {
      let r = `${this.baseInfo.namespace}:${e}`;
      return (
        this.extensions.push({
          extensionPoint: "targetResolver",
          id: r,
          resolverType: r,
          implementation: t,
        }),
        this
      );
    }
    addCondition(e, t) {
      let r = `${this.baseInfo.namespace}:${e}`;
      return (
        this.extensions.push({
          extensionPoint: "condition",
          id: r,
          conditionType: r,
          implementation: t,
        }),
        this
      );
    }
    onInitialize(e) {
      return (this.lifecycle.initialize = e), this;
    }
    onActivate(e) {
      return (this.lifecycle.activate = e), this;
    }
    onDeactivate(e) {
      return (this.lifecycle.deactivate = e), this;
    }
    onDispose(e) {
      return (this.lifecycle.dispose = e), this;
    }
    createManifest() {
      let e = this.extensions.map((t) => `${t.extensionPoint}:${t.id}`);
      return {
        id: [this.baseInfo.namespace, this.baseInfo.pluginId],
        version: this.baseInfo.version,
        name: this.baseInfo.displayName || this.baseInfo.pluginId,
        description: this.baseInfo.description || "",
        dependencies: this.baseInfo.dependencies,
        features: e,
      };
    }
    buildRuntime() {
      return {
        manifest: this.createManifest(),
        extensions: this.extensions,
        ...this.lifecycle,
      };
    }
  };
});
var Vr = m((Ct) => {
  "use strict";
  Object.defineProperty(Ct, "__esModule", { value: !0 });
  function Ts(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Ts(Ct, {
    ConditionCategoryBuilder: function () {
      return Ne;
    },
    DesignBuilder: function () {
      return Et;
    },
    TargetCategoryBuilder: function () {
      return Pe;
    },
    TriggerCategoryBuilder: function () {
      return ke;
    },
  });
  var wt = class {
      categoryBuilder;
      groupConfig;
      properties;
      constructor(e, t) {
        (this.categoryBuilder = e),
          (this.groupConfig = t),
          (this.properties = []);
      }
      addProperty(e, t, r) {
        return (
          this.properties.push({
            id: e,
            schema: { ...t, description: r?.description || t.description },
          }),
          this
        );
      }
      addGroup(e) {
        return (
          this.categoryBuilder.finalizeGroup({
            ...this.groupConfig,
            properties: this.properties,
          }),
          this.categoryBuilder.clearCurrentGroupBuilder(),
          this.categoryBuilder.addGroup(e)
        );
      }
      getGroupData() {
        return { ...this.groupConfig, properties: this.properties };
      }
    },
    St = class {
      categoryId;
      config;
      displayGroups;
      currentGroupBuilder;
      constructor(e, t) {
        (this.categoryId = e),
          (this.config = t),
          (this.displayGroups = []),
          (this.currentGroupBuilder = null);
      }
      addGroup(e) {
        return (
          this.currentGroupBuilder &&
            this.finalizeGroup(this.currentGroupBuilder.getGroupData()),
          (this.currentGroupBuilder = new wt(this, e)),
          this.currentGroupBuilder
        );
      }
      finalizeGroup(e) {
        this.displayGroups.push(e);
      }
      clearCurrentGroupBuilder() {
        this.currentGroupBuilder = null;
      }
      getDefinition() {
        this.currentGroupBuilder &&
          (this.finalizeGroup(this.currentGroupBuilder.getGroupData()),
          (this.currentGroupBuilder = null));
        let e = this.displayGroups.flatMap((t) => t.properties);
        return {
          id: this.categoryId,
          properties: e,
          propertyType: this.config.propertyType || "tween",
          displayGroups: this.displayGroups,
        };
      }
    },
    Pe = class {
      categoryId;
      config;
      targets;
      constructor(e, t) {
        (this.categoryId = e), (this.config = t), (this.targets = []);
      }
      addTargetSchema(e, t) {
        return this.targets.push({ id: e, schema: t }), this;
      }
      getDefinition() {
        return {
          id: this.categoryId,
          label: this.config.label,
          order: this.config.order,
          targets: this.targets,
        };
      }
    },
    ke = class {
      categoryId;
      config;
      triggers;
      constructor(e, t) {
        (this.categoryId = e), (this.config = t), (this.triggers = []);
      }
      addTriggerSchema(e, t) {
        return this.triggers.push({ id: e, schema: t }), this;
      }
      getDefinition() {
        return {
          id: this.categoryId,
          label: this.config.label,
          order: this.config.order,
          triggers: this.triggers,
        };
      }
    },
    Ne = class {
      categoryId;
      config;
      conditions;
      constructor(e, t) {
        (this.categoryId = e), (this.config = t), (this.conditions = []);
      }
      addConditionSchema(e, t) {
        return this.conditions.push({ id: e, schema: t }), this;
      }
      getDefinition() {
        return {
          id: this.categoryId,
          label: this.config.label,
          order: this.config.order,
          conditions: this.conditions,
        };
      }
    },
    Et = class {
      baseInfo;
      categories = new Map();
      targetCategories = new Map();
      triggerCategories = new Map();
      conditionCategories = new Map();
      actionPresets = new Map();
      reducerHooks = [];
      constructor(e) {
        this.baseInfo = e;
      }
      addCategory(e, t = {}) {
        let r = new St(e, t);
        return this.categories.set(e, r), r;
      }
      addTargetCategory(e, t) {
        let r = new Pe(e, t);
        return this.targetCategories.set(e, r), r;
      }
      addTriggerCategory(e, t) {
        let r = new ke(e, t);
        return this.triggerCategories.set(e, r), r;
      }
      addConditionCategory(e, t) {
        let r = new Ne(e, t);
        return this.conditionCategories.set(e, r), r;
      }
      addActionPreset(e, t) {
        let r = `${this.baseInfo.namespace}:${e}`;
        return (
          this.actionPresets.set(r, {
            id: r,
            name: t.name,
            description: t.description,
            icon: t.icon,
            timelineIcon: t.timelineIcon,
            type: "plugin",
            categoryId: t.categoryId,
            action: t.action,
            customEditor: t.customEditor,
            targetFilter: t.targetFilter,
            designerTargetFilter: t.designerTargetFilter,
            customTargetComponent: t.customTargetComponent,
          }),
          this
        );
      }
      addReducerHooks(e) {
        return this.reducerHooks.push(e), this;
      }
      buildDesign() {
        let e = [];
        for (let [, s] of this.categories) e.push(s.getDefinition());
        let t = [];
        for (let [, s] of this.targetCategories) t.push(s.getDefinition());
        let r = [];
        for (let [, s] of this.triggerCategories) r.push(s.getDefinition());
        let o = [];
        for (let [, s] of this.conditionCategories) o.push(s.getDefinition());
        let i = [];
        for (let [, s] of this.actionPresets) i.push(s);
        return {
          namespace: this.baseInfo.namespace,
          pluginId: this.baseInfo.pluginId,
          version: this.baseInfo.version,
          displayName: this.baseInfo.displayName,
          description: this.baseInfo.description,
          categories: e.length > 0 ? e : void 0,
          targetCategories: t.length > 0 ? t : void 0,
          triggerCategories: r.length > 0 ? r : void 0,
          conditionCategories: o.length > 0 ? o : void 0,
          actionPresets: i.length > 0 ? i : void 0,
          reducerHooks:
            this.reducerHooks.length > 0 ? [...this.reducerHooks] : void 0,
        };
      }
    };
});
var Br = m((At) => {
  "use strict";
  Object.defineProperty(At, "__esModule", { value: !0 });
  Object.defineProperty(At, "TransformBuilder", {
    enumerable: !0,
    get: function () {
      return Mt;
    },
  });
  var Mt = class {
    baseInfo;
    triggerTransforms = new Map();
    targetTransforms = new Map();
    conditionTransforms = new Map();
    actionTransforms = new Map();
    constructor(e) {
      this.baseInfo = e;
    }
    addTargetTransform(e, t) {
      return (
        this.targetTransforms.set(
          this.createExtensionKey(e),
          function (o, i, s) {
            return t(o, i, s);
          }
        ),
        this
      );
    }
    addTriggerTransform(e, t) {
      return (
        this.triggerTransforms.set(
          this.createExtensionKey(e),
          function (o, i, s) {
            return t(o, i, s);
          }
        ),
        this
      );
    }
    addConditionTransform(e, t) {
      return (
        this.conditionTransforms.set(
          this.createExtensionKey(e),
          function (o, i, s) {
            return t(o, i, s);
          }
        ),
        this
      );
    }
    addActionTransform(e, t) {
      return (
        this.actionTransforms.set(
          this.createExtensionKey(e),
          function (o, i, s) {
            return t(o, i, s);
          }
        ),
        this
      );
    }
    createExtensionKey(e) {
      return `${this.baseInfo.namespace}:${e}`;
    }
    buildTransform() {
      return {
        namespace: this.baseInfo.namespace,
        pluginId: this.baseInfo.pluginId,
        version: this.baseInfo.version,
        displayName: this.baseInfo.displayName,
        description: this.baseInfo.description,
        triggerTransforms: this.triggerTransforms,
        targetTransforms: this.targetTransforms,
        conditionTransforms: this.conditionTransforms,
        actionTransforms: this.actionTransforms,
      };
    }
  };
});
var qr = m((Ur) => {
  "use strict";
  Object.defineProperty(Ur, "__esModule", { value: !0 });
});
var Y = m((ie) => {
  "use strict";
  Object.defineProperty(ie, "__esModule", { value: !0 });
  function ws(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  ws(ie, {
    CORE_OPERATORS: function () {
      return U.CORE_OPERATORS;
    },
    DEFAULTS: function () {
      return U.DEFAULTS;
    },
    DEFAULT_CUSTOM_EASE: function () {
      return U.DEFAULT_CUSTOM_EASE;
    },
    EASE_DEFAULTS: function () {
      return U.EASE_DEFAULTS;
    },
    PERCENT_CANVAS_DURATION_S: function () {
      return U.PERCENT_CANVAS_DURATION_S;
    },
    RELATIONSHIP_TYPES: function () {
      return U.RELATIONSHIP_TYPES;
    },
    STANDARD_TRIGGER_ALLOWED_CONTROLS: function () {
      return U.STANDARD_TRIGGER_ALLOWED_CONTROLS;
    },
    TimelineControlType: function () {
      return U.TimelineControlType;
    },
    TweenType: function () {
      return U.TweenType;
    },
    isValidControlType: function () {
      return U.isValidControlType;
    },
    tweenTypeFromName: function () {
      return U.tweenTypeFromName;
    },
    tweenTypeToName: function () {
      return U.tweenTypeToName;
    },
  });
  var U = Dr();
  Fe(jr(), ie);
  Fe(Vr(), ie);
  Fe(Br(), ie);
  Fe(qr(), ie);
  function Fe(n, e) {
    return (
      Object.keys(n).forEach(function (t) {
        t !== "default" &&
          !Object.prototype.hasOwnProperty.call(e, t) &&
          Object.defineProperty(e, t, {
            enumerable: !0,
            get: function () {
              return n[t];
            },
          });
      }),
      n
    );
  }
});
var pe = m((It) => {
  "use strict";
  Object.defineProperty(It, "__esModule", { value: !0 });
  function Ss(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Ss(It, {
    EASING_NAMES: function () {
      return Rs;
    },
    buildCustomEaseId: function () {
      return _s;
    },
    buildEaseContextId: function () {
      return Os;
    },
    debounce: function () {
      return As;
    },
    defaultSplitClass: function () {
      return Ms;
    },
    isValidControlType: function () {
      return Es;
    },
    throttle: function () {
      return Is;
    },
    toSeconds: function () {
      return Cs;
    },
  });
  var Le = Y();
  function Es(n) {
    return (
      n === Le.TimelineControlType.STANDARD ||
      n === Le.TimelineControlType.SCROLL ||
      n === Le.TimelineControlType.LOAD ||
      n === Le.TimelineControlType.CONTINUOUS
    );
  }
  function Cs(n) {
    return typeof n == "string" ? parseFloat(n) / 1e3 : n;
  }
  function Ms(n) {
    return `gsap_split_${n}++`;
  }
  var As = (
      n,
      e = 0,
      { leading: t = !1, trailing: r = !0, maxWait: o } = {}
    ) => {
      let i,
        s = 0,
        a,
        l,
        c = () => {
          (s = 0), (i = void 0), r && n.apply(a, l);
        };
      function u(...d) {
        (a = this), (l = d), s || ((s = performance.now()), t && n.apply(a, l));
        let f = performance.now() - s;
        if (o && f >= o) {
          clearTimeout(i), c();
          return;
        }
        clearTimeout(i), (i = setTimeout(c, e));
      }
      return (
        (u.cancel = () => {
          clearTimeout(i), (i = void 0), (s = 0);
        }),
        u
      );
    },
    Is = (n, e = 0, { leading: t = !0, trailing: r = !0, maxWait: o } = {}) => {
      let i = 0,
        s,
        a,
        l,
        c = (d) => {
          (i = d), (s = void 0), n.apply(a, l);
        };
      function u(...d) {
        let f = performance.now();
        !i && !t && (i = f);
        let p = e - (f - i);
        (a = this),
          (l = d),
          p <= 0 || (o && f - i >= o)
            ? (s && (clearTimeout(s), (s = void 0)), c(f))
            : r && !s && (s = setTimeout(() => c(performance.now()), p));
      }
      return (
        (u.cancel = () => {
          clearTimeout(s), (s = void 0), (i = 0);
        }),
        u
      );
    };
  function Os(n, e) {
    return `${n}-${e}`;
  }
  function _s(n, e) {
    return e ? `${n}-${e}` : n;
  }
  var Rs = [
    "none",
    "power1.in",
    "power1.out",
    "power1.inOut",
    "power2.in",
    "power2.out",
    "power2.inOut",
    "power3.in",
    "power3.out",
    "power3.inOut",
    "power4.in",
    "power4.out",
    "power4.inOut",
    "back.in",
    "back.out",
    "back.inOut",
    "bounce.in",
    "bounce.out",
    "bounce.inOut",
    "circ.in",
    "circ.out",
    "circ.inOut",
    "elastic.in",
    "elastic.out",
    "elastic.inOut",
    "expo.in",
    "expo.out",
    "expo.inOut",
    "sine.in",
    "sine.out",
    "sine.inOut",
  ];
});
var $r = m((Ot) => {
  "use strict";
  Object.defineProperty(Ot, "__esModule", { value: !0 });
  Object.defineProperty(Ot, "EventManager", {
    enumerable: !0,
    get: function () {
      return De;
    },
  });
  var we = pe(),
    ge = class {
      elementHandlers = new WeakMap();
      eventTypeHandlers = new Map();
      customEventTypes = new Map();
      delegatedHandlers = new Map();
      batchedEvents = new Map();
      batchFrameId = null;
      defaultMaxBatchSize = 10;
      defaultMaxBatchAge = 100;
      defaultErrorHandler = (e, t) =>
        console.error("[EventManager] Error handling event:", e, t);
      constructor() {}
      static getInstance() {
        return ge.instance || (ge.instance = new ge()), ge.instance;
      }
      addEventListener(e, t, r, o) {
        try {
          let i = o?.kind === "custom",
            s = {
              ...(i ? { delegate: !1, passive: !0, batch: !1 } : Ps[t] || {}),
              ...o,
              errorHandler: o?.errorHandler || this.defaultErrorHandler,
            };
          if (!i && t === "load" && "complete" in e && e.complete)
            return (
              setTimeout(() => {
                try {
                  r(new Event("load"), e);
                } catch (u) {
                  s.errorHandler?.(u, new Event("load"));
                }
              }, 0),
              () => {}
            );
          if (!e || !e.addEventListener)
            throw new Error("Invalid element provided to addEventListener");
          let a = this.createWrappedHandler(r, s, e),
            l = this.registerHandler(e, t, r, a.handler, s, i, a.cleanup);
          if (i)
            return () => {
              this.removeHandler(e, t, r, !0), l.cleanup?.();
            };
          let c = new AbortController();
          return (
            this.ensureDelegatedHandler(t),
            s.delegate ||
              (xs(s) || e).addEventListener(t, l.wrappedHandler, {
                passive: s.passive,
                signal: c.signal,
              }),
            () => {
              c.abort(), this.removeHandler(e, t, r, !1);
            }
          );
        } catch (i) {
          return o?.errorHandler?.(i, new Event(t)), () => {};
        }
      }
      emit(e, t, r, o) {
        try {
          let i = this.customEventTypes.get(e);
          if (!i?.size) return;
          let s = new CustomEvent(e, {
            detail: t,
            bubbles: o?.bubbles ?? !0,
            cancelable: !0,
          });
          for (let a of i)
            if (!r || r === a.element || a.element.contains(r))
              try {
                a.wrappedHandler(s);
              } catch (l) {
                console.error(`[EventManager] Error emitting ${e}:`, l);
              }
        } catch (i) {
          console.error(`[EventManager] Error emitting custom event ${e}:`, i);
        }
      }
      dispose() {
        this.batchFrameId !== null &&
          (cancelAnimationFrame(this.batchFrameId),
          (this.batchFrameId = null),
          this.batchedEvents.clear());
        for (let [, e] of this.delegatedHandlers) e.controller.abort();
        for (let [, e] of this.eventTypeHandlers)
          for (let t of e) t.cleanup?.();
        for (let [, e] of this.customEventTypes) for (let t of e) t.cleanup?.();
        this.delegatedHandlers.clear(),
          (this.elementHandlers = new WeakMap()),
          this.eventTypeHandlers.clear(),
          this.customEventTypes.clear();
      }
      createWrappedHandler(e, t, r) {
        let o = (i) => {
          try {
            let s =
              t.target === "window"
                ? window
                : t.target === "document"
                ? document
                : r;
            e(i, s);
          } catch (s) {
            (t.errorHandler || this.defaultErrorHandler)(s, i);
          }
        };
        if (t.batch) {
          let i = (s) => {
            let a = s.type || "unknown";
            this.batchedEvents.has(a) || this.batchedEvents.set(a, []),
              this.batchedEvents
                .get(a)
                .push({
                  event: s,
                  target: r,
                  timestamp: s.timeStamp || performance.now(),
                }),
              this.batchFrameId == null &&
                (this.batchFrameId = requestAnimationFrame(() =>
                  this.processBatchedEvents()
                ));
          };
          if (t.throttleMs && t.throttleMs > 0) {
            let s = (0, we.throttle)(o, t.throttleMs);
            return { handler: i, cleanup: s.cancel };
          }
          if (t.debounceMs && t.debounceMs > 0) {
            let s = (0, we.debounce)(o, t.debounceMs);
            return { handler: i, cleanup: s.cancel };
          }
          return { handler: i };
        }
        if (t.throttleMs && t.throttleMs > 0) {
          let i = (0, we.throttle)(o, t.throttleMs);
          if (t.debounceMs && t.debounceMs > 0) {
            let s = (0, we.debounce)(i, t.debounceMs);
            return {
              handler: s,
              cleanup: () => {
                s.cancel?.(), i.cancel?.();
              },
            };
          }
          return { handler: i, cleanup: i.cancel };
        }
        if (t.debounceMs && t.debounceMs > 0) {
          let i = (0, we.debounce)(o, t.debounceMs);
          return { handler: i, cleanup: i.cancel };
        }
        return { handler: o };
      }
      processBatchedEvents() {
        if (this.batchFrameId === null) return;
        this.batchFrameId = null;
        let e = performance.now();
        for (let [t, r] of this.batchedEvents) {
          let o = this.eventTypeHandlers.get(t);
          if (!o?.size) continue;
          let i = r.filter((a) => e - a.timestamp < this.defaultMaxBatchAge);
          if (!i.length) continue;
          i.sort((a, l) => a.timestamp - l.timestamp);
          let s =
            i.length <= this.defaultMaxBatchSize
              ? i
              : i.slice(-this.defaultMaxBatchSize);
          for (let { event: a, target: l } of s) {
            let c = a;
            (c.batchTimestamp = e), (c.batchSize = s.length);
            for (let u of o)
              try {
                (u.config.delegate ||
                  u.config.target === "window" ||
                  u.config.target === "document" ||
                  l === a.target ||
                  l.contains(a.target)) &&
                  u.wrappedHandler(c);
              } catch (d) {
                (u.config.errorHandler || this.defaultErrorHandler)(d, c);
              }
          }
        }
        this.batchedEvents.clear();
      }
      ensureDelegatedHandler(e) {
        if (this.delegatedHandlers.has(e)) return;
        let t = new AbortController(),
          r = (i) => {
            let s = this.eventTypeHandlers.get(e);
            if (!s?.size) return;
            let a = i.composedPath
              ? i.composedPath()
              : i.target
              ? [i.target]
              : [];
            for (let l of a)
              if (l instanceof Element) {
                for (let c of s) {
                  if (!c.config.delegate) continue;
                  if (c.element === l || c.element.contains(l))
                    try {
                      c.wrappedHandler(i);
                    } catch (d) {
                      console.error(`[EventDelegator] Error for ${e}:`, d);
                    }
                }
                if (!i.bubbles) break;
              }
          },
          o = [
            "focus",
            "blur",
            "focusin",
            "focusout",
            "mouseenter",
            "mouseleave",
          ].includes(e);
        document.addEventListener(e, r, {
          passive: !1,
          capture: o,
          signal: t.signal,
        }),
          this.delegatedHandlers.set(e, { handler: r, controller: t });
      }
      registerHandler(e, t, r, o, i, s, a) {
        let l = {
          element: e,
          originalHandler: r,
          wrappedHandler: o,
          config: i,
          cleanup: a,
        };
        if (s) {
          let c = this.customEventTypes.get(t) || new Set();
          c.add(l), this.customEventTypes.set(t, c);
        } else {
          let c = this.elementHandlers.get(e) || new Set();
          c.add(l), this.elementHandlers.set(e, c);
          let u = this.eventTypeHandlers.get(t) || new Set();
          u.add(l), this.eventTypeHandlers.set(t, u);
        }
        return l;
      }
      removeHandler(e, t, r, o) {
        if (o) {
          let i = this.customEventTypes.get(t);
          if (!i?.size) return;
          for (let s of i)
            if (s.element === e && s.originalHandler === r) {
              i.delete(s),
                i.size || this.customEventTypes.delete(t),
                s.cleanup?.();
              break;
            }
        } else {
          let i = this.eventTypeHandlers.get(t);
          if (!i?.size) return;
          let s = this.elementHandlers.get(e);
          if (!s?.size) return;
          let a;
          for (let l of s)
            if (l.originalHandler === r) {
              a = l;
              break;
            }
          if (a) {
            if ((s.delete(a), i.delete(a), !i.size)) {
              this.eventTypeHandlers.delete(t);
              let l = this.delegatedHandlers.get(t);
              l && (l.controller.abort(), this.delegatedHandlers.delete(t));
            }
            a.cleanup?.();
          }
        }
      }
    },
    De = ge;
  fe(De, "instance");
  function xs(n) {
    return n.target === "window"
      ? window
      : n.target === "document"
      ? document
      : null;
  }
  var Ps = {
    load: { delegate: !1, passive: !0 },
    DOMContentLoaded: { target: "document", passive: !0 },
    readystatechange: { target: "document", passive: !0 },
    beforeunload: { target: "window", passive: !1 },
    unload: { target: "window", passive: !1 },
    pageshow: { target: "window", passive: !0 },
    pagehide: { target: "window", passive: !0 },
    click: { delegate: !0, passive: !1 },
    dblclick: { delegate: !0, passive: !0 },
    mousedown: { delegate: !0, passive: !0 },
    mouseup: { delegate: !0, passive: !0 },
    mousemove: { delegate: !0, batch: !0, passive: !0 },
    mouseenter: { delegate: !1, passive: !0 },
    mouseleave: { delegate: !1, passive: !0 },
    mouseout: { delegate: !0, passive: !0 },
    contextmenu: { delegate: !0, passive: !1 },
    wheel: { delegate: !0, throttleMs: 16, passive: !0, batch: !0 },
    touchstart: { delegate: !0, passive: !0 },
    touchend: { delegate: !0, passive: !1 },
    touchmove: { delegate: !0, batch: !0, passive: !0 },
    touchcancel: { delegate: !0, passive: !0 },
    pointerdown: { delegate: !0, passive: !0 },
    pointerup: { delegate: !0, passive: !0 },
    pointermove: { delegate: !0, batch: !0, passive: !0 },
    pointerenter: { delegate: !1, passive: !0 },
    pointerleave: { delegate: !1, passive: !0 },
    pointercancel: { delegate: !0, passive: !0 },
    keydown: { delegate: !0, passive: !1 },
    keyup: { delegate: !0, passive: !1 },
    keypress: { delegate: !0, passive: !1 },
    input: { delegate: !0, passive: !1 },
    change: { delegate: !0, passive: !1 },
    focus: { delegate: !1, passive: !0 },
    blur: { delegate: !1, passive: !0 },
    focusin: { delegate: !0, passive: !0 },
    focusout: { delegate: !0, passive: !0 },
    submit: { delegate: !0, passive: !1 },
    reset: { delegate: !0, passive: !1 },
    select: { delegate: !0, passive: !0 },
    selectionchange: { target: "document", passive: !0 },
    dragstart: { delegate: !0, passive: !1 },
    drag: { delegate: !0, passive: !0 },
    dragenter: { delegate: !0, passive: !1 },
    dragleave: { delegate: !0, passive: !0 },
    dragover: { delegate: !0, passive: !1 },
    drop: { delegate: !0, passive: !1 },
    dragend: { delegate: !0, passive: !0 },
    play: { delegate: !0, passive: !0 },
    pause: { delegate: !0, passive: !0 },
    ended: { delegate: !0, passive: !0 },
    timeupdate: { delegate: !0, batch: !0, passive: !0 },
    canplay: { delegate: !0, passive: !0 },
    canplaythrough: { delegate: !0, passive: !0 },
    loadeddata: { delegate: !0, passive: !0 },
    animationstart: { delegate: !0, passive: !0 },
    animationend: { delegate: !0, passive: !0 },
    animationiteration: { delegate: !0, passive: !0 },
    transitionstart: { delegate: !0, passive: !0 },
    transitionend: { delegate: !0, passive: !0 },
    transitionrun: { delegate: !0, passive: !0 },
    transitioncancel: { delegate: !0, passive: !0 },
    scroll: { delegate: !1, throttleMs: 16, passive: !0 },
    resize: { target: "window", throttleMs: 16, passive: !0 },
    intersection: { delegate: !1, passive: !0 },
    orientationchange: { target: "window", passive: !0 },
    visibilitychange: { target: "document", passive: !0 },
    storage: { target: "window", passive: !0 },
    online: { target: "window", passive: !0 },
    offline: { target: "window", passive: !0 },
    hashchange: { target: "window", passive: !0 },
    popstate: { target: "window", passive: !0 },
    copy: { delegate: !0, passive: !1 },
    cut: { delegate: !0, passive: !1 },
    paste: { delegate: !0, passive: !1 },
    compositionstart: { delegate: !0, passive: !1 },
    compositionupdate: { delegate: !0, passive: !1 },
    compositionend: { delegate: !0, passive: !1 },
    beforeinput: { delegate: !0, passive: !1 },
  };
});
var Rt = m((_t) => {
  "use strict";
  Object.defineProperty(_t, "__esModule", { value: !0 });
  function ks(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  ks(_t, {
    convertEaseConfigToGSAP: function () {
      return Hr;
    },
    convertEaseConfigToLinear: function () {
      return Fs;
    },
    isAdvancedEase: function () {
      return Ls;
    },
    isBasicEase: function () {
      return Ds;
    },
  });
  var Se = pe();
  function Gr() {
    return {
      gsap: window.gsap,
      CustomEase: window.CustomEase,
      CustomWiggle: window.CustomWiggle,
      CustomBounce: window.CustomBounce,
    };
  }
  function Hr(n, e = Gr(), t) {
    return n == null
      ? "none"
      : typeof n == "number"
      ? Se.EASING_NAMES[n] || "none"
      : Ns(n, e, t);
  }
  function Ns(n, e, t) {
    switch (n.type) {
      case "back":
        return `back.${n.curve}(${n.power})`;
      case "elastic":
        return `elastic.${n.curve}(${n.amplitude}, ${n.period})`;
      case "steps":
        return `steps(${n.stepCount})`;
      case "rough": {
        let {
          templateCurve: r,
          points: o,
          strength: i,
          taper: s,
          randomizePoints: a,
          clampPoints: l,
        } = n;
        return `rough({ template: ${r}, strength: ${i}, points: ${o}, taper: ${s}, randomize: ${a}, clamp: ${l} })`;
      }
      case "slowMo":
        return `slow(${n.linearRatio}, ${n.power}, ${n.yoyoMode})`;
      case "expoScale":
        return `expoScale(${n.startingScale}, ${n.endingScale}, ${n.templateCurve})`;
      case "customWiggle": {
        let { CustomWiggle: r } = e;
        return r
          ? r.create((0, Se.buildCustomEaseId)("customIX3Wiggle", t), {
              wiggles: n.wiggles,
              type: n.wiggleType,
            })
          : null;
      }
      case "customBounce": {
        let { CustomBounce: r } = e;
        return r
          ? r.create((0, Se.buildCustomEaseId)("customIX3Bounce", t), {
              strength: n.strength,
              endAtStart: n.endAtStart,
              squash: n.squash,
              squashID: (0, Se.buildCustomEaseId)("customIX3Squash", t),
            })
          : null;
      }
      case "customEase": {
        let { CustomEase: r } = e;
        return r
          ? r.create(
              (0, Se.buildCustomEaseId)("customIX3Ease", t),
              n.bezierCurve
            )
          : null;
      }
      default:
        return "none";
    }
  }
  function Fs(n, e = Gr(), t = 20) {
    if (n == null) return "linear";
    let r = Hr(n, e);
    if (r === null) return "linear";
    if (typeof n == "object" && n.type === "steps")
      return `steps(${n.stepCount})`;
    let { gsap: o } = e;
    if (!o) return "linear";
    let i = o.parseEase(r);
    if (typeof i != "function") return "linear";
    let s = [];
    for (let a = 0; a <= t; a++) {
      let l = a / t,
        c = i(l);
      s.push({ t: Number(l.toFixed(4)), value: Number(c.toFixed(4)) });
    }
    return (
      "linear(" +
      s.map((a) => `${a.value} ${Math.round(a.t * 100)}%`).join(", ") +
      ")"
    );
  }
  function Ls(n) {
    return typeof n == "object" && n !== null;
  }
  function Ds(n) {
    return typeof n == "number";
  }
});
var zr = m((Pt) => {
  "use strict";
  Object.defineProperty(Pt, "__esModule", { value: !0 });
  Object.defineProperty(Pt, "PluginRuntimeBridge", {
    enumerable: !0,
    get: function () {
      return xt;
    },
  });
  var xt = class {
    intervalHandlers = new Map();
    channelSubscribers = new Map();
    registerIntervalHandler(e, t) {
      let r = this.intervalHandlers.get(e);
      r !== t &&
        (r !== void 0 &&
          console.warn(
            "IX3: registerIntervalHandler called twice. The previous handler is being replaced; verify the plugin is registered exactly once (or use a unique pluginKey per concurrent handler).",
            { pluginKey: e }
          ),
        this.intervalHandlers.set(e, t));
    }
    fireInterval(e) {
      for (let [t, r] of this.intervalHandlers)
        try {
          r(e);
        } catch (o) {
          console.error(
            "IX3: interval handler threw. Continuing with the remaining handlers. Investigate the plugin to prevent silent data drift.",
            { pluginKey: t },
            o
          );
        }
    }
    publish(e, t, r) {
      let o = this.channelSubscribers.get(e);
      if (o) {
        for (let i of o.values())
          for (let s of i.slice())
            if (!(s.element && r && s.element !== r))
              try {
                s.cb(t);
              } catch (a) {
                console.error(
                  "IX3: channel subscriber threw. Continuing with remaining subscribers.",
                  { channel: e },
                  a
                );
              }
      }
    }
    subscribe(e, t, r, o) {
      let i = this.channelSubscribers.get(t);
      i || ((i = new Map()), this.channelSubscribers.set(t, i));
      let s = i.get(e) ?? [],
        a = { element: r, cb: o };
      return (
        s.push(a),
        i.set(e, s),
        () => {
          let l = this.channelSubscribers.get(t)?.get(e);
          if (!l) return;
          let c = l.indexOf(a);
          c !== -1 && l.splice(c, 1),
            l.length === 0 &&
              (this.channelSubscribers.get(t)?.delete(e),
              this.channelSubscribers.get(t)?.size === 0 &&
                this.channelSubscribers.delete(t));
        }
      );
    }
    destroyTimeline(e) {
      for (let [t, r] of this.channelSubscribers)
        r.delete(e), r.size === 0 && this.channelSubscribers.delete(t);
    }
  };
});
var Wr = m((Nt) => {
  "use strict";
  Object.defineProperty(Nt, "__esModule", { value: !0 });
  Object.defineProperty(Nt, "RuntimeMotionDriver", {
    enumerable: !0,
    get: function () {
      return kt;
    },
  });
  var kt = class {
    env;
    constructor(e) {
      this.env = e;
    }
    hasGsap() {
      return this.env.win.gsap != null;
    }
    hasObserver() {
      return this.env.win.Observer != null;
    }
    timeline() {
      return this.env.win.gsap?.timeline() ?? null;
    }
    to(...e) {
      return this.env.win.gsap?.to(...e) ?? null;
    }
    set(...e) {
      this.env.win.gsap?.set(...e);
    }
    getProperty(...e) {
      return this.env.win.gsap?.getProperty(...e) ?? 0;
    }
    quickSetter(...e) {
      return this.env.win.gsap?.quickSetter(...e) ?? null;
    }
    quickTo(...e) {
      return this.env.win.gsap?.quickTo(...e) ?? null;
    }
    addTicker(e) {
      let t = this.env.win.gsap;
      if (t?.ticker)
        return (
          t.ticker.add(e),
          () => {
            try {
              t.ticker?.remove(e);
            } catch {}
          }
        );
      let r = this.env.win,
        o = 0,
        i = !0,
        s = () => {
          i && (e(), i && (o = r.requestAnimationFrame(s)));
        };
      return (
        (o = r.requestAnimationFrame(s)),
        () => {
          (i = !1), r.cancelAnimationFrame(o);
        }
      );
    }
    createObserver(...e) {
      return this.env.win.Observer?.create(...e) ?? null;
    }
  };
});
var Xr = m((Dt) => {
  "use strict";
  Object.defineProperty(Dt, "__esModule", { value: !0 });
  Object.defineProperty(Dt, "AnimationCoordinator", {
    enumerable: !0,
    get: function () {
      return Ve;
    },
  });
  var Ft = Y(),
    D = pe(),
    Lt = Rt(),
    js = zr(),
    Vs = Wr();
  function Bs(n) {
    return (
      typeof n == "function" ||
      (typeof n == "string" &&
        (n.startsWith("+=") || n.startsWith("-=") || n.startsWith("random(")))
    );
  }
  function Us(n) {
    for (let e of [n.to, n.from])
      if (e) {
        for (let t in e) if (Bs(e[t])) return !0;
      }
    return !1;
  }
  var Be = class {
      timelineDefs;
      getHandler;
      getTargetResolver;
      resolveFn;
      getInteractionForTimeline;
      env;
      subs;
      dynamicFlags;
      cleanupFns;
      scrollTriggers;
      aliases;
      flipEaseBySource;
      pluginRuntimeBridge;
      animation;
      sharedGroups;
      resolveAlias(e, t = 0) {
        if (t > Be.MAX_ALIAS_DEPTH)
          return (
            console.warn(
              `IX3: Timeline alias chain exceeded max depth for "${e}". Possible circular reference.`
            ),
            e
          );
        let r = this.aliases.get(e);
        return r ? this.resolveAlias(r, t + 1) : e;
      }
      shouldFlipEaseForTimeline(e) {
        let t = this.resolveSourceTimelineId(e),
          r = [t];
        for (let [l] of this.timelineDefs)
          l !== t && this.resolveSourceTimelineId(l) === t && r.push(l);
        let o = new Set(r),
          i = !1,
          s = (l) => {
            if (l === "reverseFlipEase" || l === "togglePlayReverseFlipEase")
              i = !0;
            else if (l === "reverse" || l === "togglePlayReverse") return !0;
            return !1;
          },
          a = new Map();
        for (let l of r) {
          let c = this.getInteractionForTimeline(l);
          c && a.set(c.id, c);
        }
        for (let l of a.values()) {
          let c = l.timelineIds ?? [];
          for (let [, u] of l.triggers) {
            let d = u?.assignedGroupId;
            if (d === null) continue;
            let f = u?.assignedTimelineRole,
              p =
                f != null
                  ? c.filter(
                      (y) =>
                        this.timelineDefs.get(y)?.triggerMetadata?.role === f
                    )
                  : null,
              g;
            if (d != null) {
              let y = c.filter((E) => this.timelineDefs.get(E)?.groupId === d);
              if (y.length > 0) g = y;
              else if (
                c.some((E) => this.timelineDefs.get(E)?.triggerMetadata != null)
              )
                g = p;
              else continue;
            } else g = p;
            let h = (y) =>
                (y != null ? [y] : c).filter(
                  (b) => (g == null || g.includes(b)) && o.has(b)
                ),
              v = u?.conditionalLogic;
            if (v) {
              for (let y of [v.ifTrue, v.ifFalse])
                if (
                  y &&
                  h(y.targetTimelineId ?? void 0).length > 0 &&
                  s(y.control)
                )
                  return !1;
            } else
              for (let y of h()) {
                let E = this.timelineDefs.get(y),
                  b = E?.triggerMetadata ? E.settings?.control : u?.control;
                if (s(b)) return !1;
              }
          }
        }
        return i;
      }
      recomputeFlipEaseForSource(e) {
        let t = this.resolveSourceTimelineId(e),
          r = this.subs.get(t);
        if (!r) return;
        let o = this.shouldFlipEaseForTimeline(t);
        if (o !== this.flipEaseBySource.get(t)) {
          this.flipEaseBySource.set(t, o);
          for (let i of r.values()) this.scheduleRebuild(i);
        }
      }
      resolveSourceTimelineId(e) {
        let t = e;
        for (let r = 0; r <= Be.MAX_ALIAS_DEPTH; r++) {
          let i = this.timelineDefs.get(t)?.reuse?.sourceTimelineId;
          if (!i) return t;
          t = i;
        }
        return (
          console.warn(
            `IX3: Timeline reuse chain exceeded max depth for "${e}". Possible circular reference.`
          ),
          t
        );
      }
      globalSplitRegistry;
      timelineTargetsCache;
      constructor(e, t, r, o, i, s) {
        (this.timelineDefs = e),
          (this.getHandler = t),
          (this.getTargetResolver = r),
          (this.resolveFn = o),
          (this.getInteractionForTimeline = i),
          (this.env = s),
          (this.subs = new Map()),
          (this.dynamicFlags = new Map()),
          (this.cleanupFns = new Map()),
          (this.scrollTriggers = new Map()),
          (this.aliases = new Map()),
          (this.flipEaseBySource = new Map()),
          (this.pluginRuntimeBridge = new js.PluginRuntimeBridge()),
          (this.sharedGroups = new Map()),
          (this.globalSplitRegistry = new Map()),
          (this.timelineTargetsCache = new WeakMap()),
          (this.getStaggerConfig = (a, l) => {
            if (!a) return;
            let { ease: c, amount: u, from: d, grid: f, axis: p, each: g } = a,
              h = {};
            if (
              (u != null && (h.amount = (0, D.toSeconds)(u)),
              g != null && (h.each = (0, D.toSeconds)(g)),
              d != null && (h.from = d),
              f != null && (h.grid = f),
              p != null && (h.axis = p),
              c != null)
            ) {
              let v = (0, Lt.convertEaseConfigToGSAP)(c, void 0, l);
              v != null && (h.ease = v);
            }
            return h;
          }),
          (this.animation = new Vs.RuntimeMotionDriver(s));
      }
      registerSharedGroup(e, t) {
        if (t.length < 2) return;
        let r = [e, e];
        for (let o of t)
          this.sharedGroups.set(o, r), o !== e && this.aliases.set(o, e);
      }
      createTimeline(e, t) {
        let r = this.timelineDefs.get(e);
        if (this.aliases.has(e)) return;
        let o = this.sharedGroups.get(e);
        if ((this.destroy(e), !r)) return;
        if ((o && this.sharedGroups.set(e, o), r.reuse?.sourceTimelineId)) {
          this.aliases.set(e, r.reuse.sourceTimelineId),
            this.recomputeFlipEaseForSource(r.reuse.sourceTimelineId);
          return;
        }
        let i = this.isDynamicTimeline(r, t);
        this.dynamicFlags.set(e, i);
        let s = new Set(),
          a = new Set();
        for (let [, l, c] of t.triggers) {
          if (c) for (let d of this.resolveFn(c, {}, t)) a.add(d);
          let u = l?.controlType;
          u && (0, D.isValidControlType)(u) && s.add(u);
        }
        if (!a.size || !i) {
          let l = this.buildSubTimeline(e, null, s);
          l && this.ensureSubs(e).set(null, l);
        }
        if (a.size) {
          let l = this.ensureSubs(e);
          for (let c of a)
            if (!l.has(c)) {
              let u = i ? this.buildSubTimeline(e, c, s) : this.getSub(e, null);
              i && u && l.set(c, u);
            }
        }
        this.flipEaseBySource.set(e, this.shouldFlipEaseForTimeline(e));
      }
      getTimeline(e, t) {
        return this.prepareIfShared(e, t), this.getSub(e, t)?.timeline;
      }
      prepareIfShared(e, t) {
        let r = this.sharedGroups.get(e);
        if (!r || r[1] === e) return;
        let o = this.timelineDefs.get(e);
        if (!o) return;
        let i = this.getSub(r[0], t);
        if (!i) return;
        let s = i.timelineId;
        for (let u of i.cleanupFns ?? []) u();
        i.cleanupFns?.clear();
        let a = this.cleanupFns.get(s);
        if (a) {
          for (let u of a) u();
          a.clear();
        }
        let l = i.timeline;
        l.clear(), l.progress(0);
        let c = this.convertToGsapDefaults(o.settings || {}, e);
        if (
          (l.repeat(typeof c.repeat == "number" ? c.repeat : 0),
          l.repeatDelay(typeof c.repeatDelay == "number" ? c.repeatDelay : 0),
          l.yoyo(c.yoyo === !0),
          l.delay(typeof c.delay == "number" ? c.delay : 0),
          l.reversed(!!o.playInReverse),
          l.timeScale(
            typeof o.settings?.speed == "number" ? o.settings.speed : 1
          ),
          (i.timelineDef = { ...o, actions: o.actions || [] }),
          (i.timelineId = e),
          this.timelineTargetsCache.delete(i),
          this.env.win.SplitText && o.actions?.length)
        ) {
          let u = this.analyzeSplitRequirements(o.actions, t, e);
          for (let [d, { types: f, masks: p }] of u)
            this.doSplitText(
              { type: this.getSplitTypeString(f), mask: this.getMaskString(p) },
              [d],
              i,
              this.env.win.SplitText
            );
        }
        this.buildTimeline(i), (r[1] = e);
      }
      getAllTimelines(e) {
        let t = this.resolveAlias(e),
          r = this.subs.get(t);
        if (!r) return [];
        for (let o of r.keys()) this.prepareIfShared(e, o);
        return Array.from(r.values()).map((o) => o.timeline);
      }
      invalidateVolatileFromStart(e, t) {
        let r = t != null ? t === 0 : e.timeline.progress() === 0;
        e.hasVolatileValues && r && e.timeline.invalidate();
      }
      play(e, t, r) {
        this.prepareIfShared(e, t);
        let o = this.getSub(e, t);
        o &&
          (this.invalidateVolatileFromStart(o, r),
          o.timeline.play(r ?? void 0));
      }
      pause(e, t, r) {
        this.prepareIfShared(e, t);
        let o = this.getSubOrNull(e, t);
        o && (r !== void 0 ? o.timeline.pause(r) : o.timeline.pause());
      }
      resume(e, t, r) {
        this.prepareIfShared(e, t);
        let o = this.getSubOrNull(e, t);
        o && (this.invalidateVolatileFromStart(o, r), o.timeline.resume(r));
      }
      reverse(e, t, r) {
        this.prepareIfShared(e, t), this.getSub(e, t)?.timeline.reverse(r);
      }
      restart(e, t) {
        this.prepareIfShared(e, t);
        let r = this.getSub(e, t);
        r &&
          (r.hasVolatileValues && r.timeline.invalidate(),
          r.timeline.restart());
      }
      getTriggerMetadata(e) {
        return this.timelineDefs.get(e)?.triggerMetadata ?? null;
      }
      fireInterval(e, t, r = {}) {
        this.pluginRuntimeBridge.fireInterval({
          coordinator: this,
          timelineId: e,
          element: t,
          options: r,
          animation: this.animation,
        });
      }
      registerIntervalHandler(e, t) {
        this.pluginRuntimeBridge.registerIntervalHandler(e, t);
      }
      getOneShotTimelineContext(e) {
        let t = this.getTimelineDef(e);
        return t
          ? {
              timelineId: e,
              timelineDef: t,
              getFirstActionTargets: (r) => this.getFirstActionTargets(e, r),
              getActionTweenConfig: (r, o, i) =>
                this.getActionTweenConfig(r, o, i),
              buildActionTimeline: (r) => this.buildOneShotActionTimeline(e, r),
              registerCleanup: (r) => this.registerCleanup(e, r),
            }
          : null;
      }
      getTimelineDef(e) {
        return this.timelineDefs.get(this.resolveAlias(e));
      }
      getFirstActionTargets(e, t) {
        let o = this.getTimelineDef(e)?.actions?.[0];
        return o ? this.collectTargets(o, t, e) : [];
      }
      getActionTweenConfig(e, t, r) {
        let o = this.getHandler(t);
        if (!o?.createTweenConfig) return null;
        let i = e.properties[t] || {};
        return o.createTweenConfig(i, r);
      }
      registerCleanup(e, t) {
        let r = this.cleanupFns.get(e) ?? new Set();
        return (
          this.cleanupFns.set(e, r),
          r.add(t),
          () => {
            r.delete(t);
          }
        );
      }
      publishChannel(e, t, r) {
        this.pluginRuntimeBridge.publish(e, t, r);
      }
      subscribeChannel(e, t, r, o) {
        return this.pluginRuntimeBridge.subscribe(e, t, r, o);
      }
      buildOneShotActionTimeline(e, t) {
        let r = this.getTimelineDef(e);
        if (!r?.actions?.length) return null;
        let o = this.animation.timeline();
        if (!o) return null;
        t.beforeTweens?.(o);
        for (let i of r.actions)
          this.buildTweensForAction(
            i,
            t.targets,
            o,
            e,
            !1,
            t.varsTransform,
            void 0,
            void 0,
            void 0,
            t.cleanupBucket
          );
        return o;
      }
      togglePlayReverse(e, t) {
        this.prepareIfShared(e, t);
        let r = this.getSub(e, t);
        if (!r) return;
        let o = r.timeline,
          i = o.progress();
        this.invalidateVolatileFromStart(r),
          i === 0
            ? o.play()
            : i === 1
            ? o.reverse()
            : o.reversed()
            ? o.play()
            : o.reverse();
      }
      seek(e, t, r) {
        this.getSubOrNull(e, r)?.timeline.seek(t);
      }
      setTimeScale(e, t, r) {
        this.prepareIfShared(e, r),
          this.getSubOrNull(e, r)?.timeline.timeScale(t);
      }
      setTotalProgress(e, t, r) {
        this.getSubOrNull(e, r)?.timeline.totalProgress(t);
      }
      setContinuousProgress(e, t, r) {
        this.getSub(e, r)?.timeline.progress(Math.max(0, Math.min(1, t)));
      }
      isPlaying(e, t) {
        return !!this.getSubOrNull(e, t)?.timeline.isActive();
      }
      isPaused(e, t) {
        return !!this.getSubOrNull(e, t)?.timeline.paused();
      }
      destroy(e) {
        this.aliases.delete(e), this.pluginRuntimeBridge.destroyTimeline(e);
        let t = this.subs.get(e),
          r = new Set();
        if (t) {
          for (let [, o] of t) {
            if (
              (o.timelineId !== e && r.add(o.timelineId),
              (o.rebuildState = "init"),
              o.timeline && (o.timeline.revert(), o.timeline.kill()),
              o.scrollTriggerIds)
            ) {
              for (let i of o.scrollTriggerIds) this.cleanupScrollTrigger(i);
              o.scrollTriggerIds.clear();
            }
            o.scrollTriggerConfigs && o.scrollTriggerConfigs.clear();
            for (let i of o.cleanupFns ?? []) i();
            o.cleanupFns?.clear(), this.timelineTargetsCache.delete(o);
          }
          for (let [, o] of this.globalSplitRegistry) o.splitInstance.revert();
          this.globalSplitRegistry.clear();
        }
        for (let o of this.cleanupFns.get(e) ?? []) o();
        for (let o of r) {
          for (let i of this.cleanupFns.get(o) ?? []) i();
          this.cleanupFns.delete(o);
        }
        this.cleanupFns.delete(e),
          this.subs.delete(e),
          this.dynamicFlags.delete(e),
          this.flipEaseBySource.delete(e),
          this.sharedGroups.delete(e);
      }
      isDynamicTimeline(e, t) {
        let r = t.triggers.some(
          ([, i]) => i?.controlType !== Ft.TimelineControlType.LOAD
        );
        if (t.scope?.type === "component" && r) return !0;
        let o = e.actions;
        if (!o?.length) return !1;
        for (let i of o) {
          for (let s of i.targets ?? []) {
            if (this.getTargetResolver(s)?.isDynamic) return !0;
            if (s.length === 3 && s[2]) {
              let l = s[2];
              if (
                l.filterBy &&
                l.relationship !== "none" &&
                this.getTargetResolver(l.filterBy)?.isDynamic
              )
                return !0;
            }
          }
          if (r) {
            for (let s in i.properties)
              if (this.getHandler(s)?.requiresTriggerElementContext) return !0;
          }
        }
        return !1;
      }
      ensureSubs(e) {
        return (
          this.subs.has(e) || this.subs.set(e, new Map()), this.subs.get(e)
        );
      }
      getSub(e, t) {
        let r = this.resolveAlias(e),
          o = this.ensureSubs(r),
          i = this.dynamicFlags.get(r),
          s = o.get(i ? t : null);
        return (
          s || ((s = this.buildSubTimeline(r, t)), s && o.set(i ? t : null, s)),
          s
        );
      }
      getSubOrNull(e, t) {
        let r = this.resolveAlias(e),
          o = this.dynamicFlags.get(r);
        return this.subs.get(r)?.get(o ? t ?? null : null);
      }
      convertToGsapDefaults(e, t) {
        let r = {},
          o = t ? (0, D.buildEaseContextId)(t, "defaults") : void 0,
          i = t ? (0, D.buildEaseContextId)(t, "defaults-stagger") : void 0;
        if (
          (e.duration != null && (r.duration = (0, D.toSeconds)(e.duration)),
          e.ease != null)
        ) {
          let s = (0, Lt.convertEaseConfigToGSAP)(e.ease, void 0, o);
          s != null && (r.ease = s);
        }
        if (
          (e.delay != null &&
            (r.delay =
              typeof e.delay == "number" ? e.delay : (0, D.toSeconds)(e.delay)),
          e.repeat != null && (r.repeat = e.repeat),
          e.repeatDelay != null &&
            (r.repeatDelay = (0, D.toSeconds)(e.repeatDelay)),
          e.stagger != null)
        ) {
          let s = this.getStaggerConfig(e.stagger, i);
          s && (r.stagger = s);
        }
        return e.yoyo != null && (r.yoyo = e.yoyo), r;
      }
      buildSubTimeline(e, t, r) {
        let o = this.timelineDefs.get(e),
          i = o?.actions,
          s = o?.settings,
          a = this.env.win.gsap;
        if (!a) return;
        let l = a.timeline({
            ...this.convertToGsapDefaults(s || {}, e),
            paused: !0,
            reversed: !!o?.playInReverse,
            data: { id: e, triggerEl: t || void 0 },
          }),
          c = o
            ? { ...o, actions: i || [] }
            : { id: e, pageId: "", deleted: !1, actions: [] },
          u = {
            timeline: l,
            timelineId: e,
            elementContext: t,
            timelineDef: c,
            rebuildState: "init",
            controlTypes: r,
          };
        if (!i?.length) return u;
        if (this.env.win.SplitText) {
          let d = this.analyzeSplitRequirements(i, t, e);
          for (let [f, { types: p, masks: g }] of d) {
            let h = this.getSplitTypeString(p),
              v = this.getMaskString(g);
            this.doSplitText(
              { type: h, mask: v },
              [f],
              u,
              this.env.win.SplitText
            );
          }
        }
        return this.buildTimeline(u), this.padTimelineToCanvas(u), u;
      }
      padTimelineToCanvas(e) {
        let { canvasDuration: t } = e.timelineDef;
        if (t == null) return;
        let r = e.timeline;
        r.duration() < t && r.to({}, { duration: 0 }, t);
      }
      buildTimeline(e) {
        let t = e.timelineDef,
          r = e.elementContext,
          o = e.timeline,
          i = e.timelineId,
          s = new Map();
        for (let a = 0; a < t.actions.length; a++) {
          let l = t.actions[a];
          if (!l) continue;
          let c = JSON.stringify(l.targets),
            u = !0,
            d = Yr(l),
            f = d === "none" ? c : `${c}_split_${d}`,
            p = (l.tt ?? 0) !== 0;
          for (let v of Object.values(l.properties ?? {})) {
            let y = s.get(f) || new Set();
            s.set(f, y);
            for (let E of Object.keys(v || {}))
              y.has(E) ? p && (u = !1) : y.add(E);
          }
          let g = this.collectTargets(l, r, i);
          if (!g.length) {
            let v = !1;
            for (let y in l.properties)
              if (this.getHandler(y)?.createCustomTween) {
                v = !0;
                break;
              }
            if (!v) continue;
          }
          let h = g;
          (d !== "none" &&
            g.length > 0 &&
            this.env.win.SplitText &&
            ((h = this.getSplitElements(g, d)), h.length === 0)) ||
            this.buildTweensForAction(
              l,
              h,
              o,
              i,
              u,
              void 0,
              r,
              t.triggerMetadata?.role,
              e
            );
        }
      }
      collectTargets(e, t, r) {
        if (!e.targets) return [];
        let o = [],
          i = this.getInteractionForTimeline(r);
        for (let s of e.targets ?? []) {
          let a = this.resolveFn(s, t ? { triggerElement: t } : {}, i);
          o.push(...a);
        }
        return o;
      }
      buildTweensForAction(e, t, r, o, i, s, a, l, c, u) {
        let d = this.shouldFlipEaseForTimeline(o),
          f = c?.timelineDef.canvasDuration != null;
        for (let p in e.properties) {
          let g = p,
            h = this.getHandler(g);
          if (!h) continue;
          let v = e.properties[g] || {};
          try {
            let y = e.timing?.position;
            y =
              typeof y == "string" && y.endsWith("ms")
                ? (0, D.toSeconds)(y)
                : y ?? 0;
            let E = e.timing?.duration ?? Ft.DEFAULTS.DURATION,
              b = this.getStaggerConfig(
                e.timing?.stagger,
                (0, D.buildEaseContextId)(e.id, "stagger")
              );
            b && E === 0 && (E = 0.001);
            let M = { id: e.id, presetId: e.presetId, color: e.color },
              w = {
                force3D: !0,
                ...(!i && { immediateRender: i }),
                data: M,
                ...(e.tt !== 3 && { duration: (0, D.toSeconds)(E) }),
                ...(e.timing?.repeat != null && {
                  repeat: f && e.timing.repeat < 0 ? 0 : e.timing.repeat,
                }),
                ...(e.timing?.repeatDelay != null && {
                  repeatDelay: (0, D.toSeconds)(e.timing.repeatDelay),
                }),
                ...(e.timing?.yoyo != null && { yoyo: e.timing.yoyo }),
                ...(b && { stagger: b }),
              };
            if (e.timing?.ease != null) {
              let T = (0, Lt.convertEaseConfigToGSAP)(
                e.timing.ease,
                void 0,
                (0, D.buildEaseContextId)(e.id, "timing")
              );
              T != null && (w.ease = T);
            }
            if ((d && (w.easeReverse = !0), h.createTweenConfig)) {
              let T = h.createTweenConfig(v, t);
              s?.(g, e, T),
                T.modifiers &&
                  (w.modifiers = { ...w.modifiers, ...T.modifiers }),
                c &&
                  !c.hasVolatileValues &&
                  Us(T) &&
                  (c.hasVolatileValues = !0);
              let S = Object.keys(T.from || {}).length > 0,
                _ = Object.keys(T.to || {}).length > 0,
                A = e.tt ?? 0;
              if (A === 0 && !_) continue;
              if (A === 1 && !S) continue;
              if (A === 2 && !S && !_) continue;
              if (A === 3 && !_) continue;
              A === 1
                ? r.from(t, { ...w, ...T.from }, y)
                : A === 2
                ? r.fromTo(t, { ...T.from }, { ...w, ...T.to }, y)
                : A === 3
                ? r.set(t, { ...w, ...T.to }, y)
                : r.to(t, { ...w, ...T.to }, y);
            } else if (h.createCustomTween) {
              let T = h.createCustomTween(r, e, v, w, t, y || 0, {
                triggerElement: a ?? null,
                timelineRole: l,
                subscribeChannel: (S, _) =>
                  this.subscribeChannel(o, S, a ?? null, _),
                animation: this.animation,
              });
              if (T)
                if (u != null) u.add(T);
                else if (c != null) {
                  let S = c.cleanupFns ?? new Set();
                  (c.cleanupFns = S), S.add(T);
                } else {
                  let S = this.cleanupFns.get(o) ?? new Set();
                  this.cleanupFns.set(o, S), S.add(T);
                }
            }
          } catch (y) {
            console.error("Error building tween:", y);
          }
        }
      }
      analyzeSplitRequirements(e, t, r) {
        let o = new Map();
        for (let i of e) {
          let s = Yr(i);
          if (s === "none") continue;
          let a = typeof i.splitText == "object" ? i.splitText.mask : void 0;
          for (let l of this.collectTargets(i, t, r)) {
            if (l === document.body) continue;
            let c = o.get(l) || { types: new Set(), masks: new Set() };
            o.set(l, c), c.types.add(s), a && c.masks.add(a);
          }
        }
        return o;
      }
      getSplitTypeString(e) {
        return (
          e.has("chars") && !e.has("words") && (e = new Set([...e, "words"])),
          ["lines", "words", "chars"].filter((o) => e.has(o)).join(", ")
        );
      }
      getMaskString(e) {
        if (e.size !== 0) {
          if (e.has("lines")) return "lines";
          if (e.has("words")) return "words";
          if (e.has("chars")) return "chars";
        }
      }
      doSplitText(e, t, r, o) {
        try {
          let i = je(e.type);
          for (let s of t) {
            let a = this.globalSplitRegistry.get(s);
            if (a) {
              let f = new Set(je(a.splitTextConfig.type));
              if (i.every((g) => f.has(g))) continue;
              a.splitInstance.revert(),
                this.globalSplitRegistry.delete(s),
                (e = {
                  type: [...new Set([...f, ...i])].join(", "),
                  mask: e.mask || a.splitTextConfig.mask,
                });
            }
            let l = { type: e.type, tag: "span" },
              c = je(e.type),
              { mask: u } = e;
            c.includes("lines") &&
              ((r.timeline.data.splitLines = !0),
              (l.linesClass = (0, D.defaultSplitClass)("line")),
              (l.autoSplit = !0),
              (l.onSplit = (f) => {
                this.applySplitElementStyles(f, u),
                  r.rebuildState !== "init"
                    ? this.scheduleRebuildForElement(s)
                    : (r.rebuildState = "idle");
              })),
              c.includes("words") &&
                (l.wordsClass = (0, D.defaultSplitClass)("word")),
              c.includes("chars") &&
                (l.charsClass = (0, D.defaultSplitClass)("letter")),
              u && (l.mask = u);
            let d = new o([s], l);
            this.applySplitElementStyles(d, u),
              this.globalSplitRegistry.set(s, {
                splitInstance: d,
                splitTextConfig: e,
              }),
              a && this.scheduleRebuildForElement(s);
          }
        } catch (i) {
          console.error("Error splitting text:", i);
        }
      }
      applySplitElementStyles(e, t) {
        let r = [
          [e.lines, "block"],
          [e.words, "inline-block"],
          [e.chars, "inline-block"],
        ];
        t && r.push([e.masks, t === "lines" ? "block" : "inline-block"]);
        for (let [o, i] of r)
          for (let s of o) {
            let { style: a } = s;
            (a.position = "relative"), (a.display = i);
          }
      }
      scheduleRebuild(e) {
        if (
          e.rebuildState === "building" ||
          e.rebuildState === "rebuild_pending"
        ) {
          e.rebuildState = "rebuild_pending";
          return;
        }
        (e.rebuildState = "building"),
          this.timelineTargetsCache.delete(e),
          this.rebuildTimelineOnTheFly(e);
      }
      rebuildTimelineOnTheFly(e) {
        let t = e.timeline.progress(),
          r = e.controlTypes?.has(Ft.TimelineControlType.LOAD) && t !== 1,
          o = e.timeline.isActive() || r;
        e.timeline.pause(), e.timeline.revert(), e.timeline.clear();
        for (let i of e.cleanupFns ?? []) i();
        if (
          (e.cleanupFns?.clear(),
          this.buildTimeline(e),
          this.padTimelineToCanvas(e),
          e.timeline.progress(t),
          e.scrollTriggerIds && e.scrollTriggerConfigs)
        )
          for (let i of e.scrollTriggerIds) {
            let s = this.scrollTriggers.get(i),
              a = e.scrollTriggerConfigs.get(i);
            if (s && a) {
              let l = { ...a, animation: e.timeline };
              if ((s.kill(), this.env.win.ScrollTrigger)) {
                let c = this.env.win.ScrollTrigger.create(l);
                this.scrollTriggers.set(i, c);
              }
            }
          }
        else o && e.timeline.play();
        e.rebuildState === "rebuild_pending"
          ? ((e.rebuildState = "building"), this.rebuildTimelineOnTheFly(e))
          : (e.rebuildState = "idle");
      }
      getStaggerConfig;
      getSplitElements(e, t) {
        let r = [];
        for (let o of e) {
          let i = this.globalSplitRegistry.get(o);
          if (i && je(i.splitTextConfig.type).includes(t)) {
            let a = i.splitInstance[t];
            a?.length && r.push(...a);
          }
        }
        return r.length > 0 ? r : e;
      }
      setupScrollControl(e, t, r, o) {
        if (typeof this.env.win.ScrollTrigger > "u") {
          console.warn("ScrollTrigger plugin is not available.");
          return;
        }
        let i = `st_${e}_${t}_${
          o.id || window.crypto.randomUUID().slice(0, 8)
        }`;
        this.cleanupScrollTrigger(i);
        let s = this.getTimeline(e, o);
        if (!s) {
          console.warn(`Timeline ${e} not found`);
          return;
        }
        let a = Gs(
          r,
          o,
          i,
          s,
          this.resolveFn,
          this.getSubOrNull(e, o)?.hasVolatileValues ?? !1
        );
        try {
          let l = this.env.win.ScrollTrigger.create(a);
          this.scrollTriggers.set(i, l);
          let c = this.getSub(e, o);
          c.scrollTriggerIds || (c.scrollTriggerIds = new Set()),
            c.scrollTriggerConfigs || (c.scrollTriggerConfigs = new Map()),
            c.scrollTriggerIds.add(i),
            c.scrollTriggerConfigs.set(i, a);
        } catch (l) {
          console.error("Failed to create ScrollTrigger:", l);
        }
      }
      cleanupScrollTrigger(e) {
        let t = this.scrollTriggers.get(e);
        t && (t.kill(), this.scrollTriggers.delete(e));
      }
      getScrollTriggers() {
        return this.scrollTriggers;
      }
      getTimelineTargets(e) {
        let t = this.timelineTargetsCache.get(e);
        if (t) return t;
        t = new WeakSet();
        for (let r of e.timelineDef.actions ?? [])
          for (let o of this.collectTargets(r, e.elementContext, e.timelineId))
            t.add(o);
        return this.timelineTargetsCache.set(e, t), t;
      }
      scheduleRebuildForElement(e) {
        for (let [, t] of this.subs)
          for (let [, r] of t)
            this.getTimelineTargets(r).has(e) && this.scheduleRebuild(r);
      }
    },
    Ve = Be;
  fe(Ve, "MAX_ALIAS_DEPTH", 10);
  function qs(n, e, t) {
    let r = {},
      o = (i) =>
        i && (i.parentElement === document.body || i === document.body);
    if (n.pin !== void 0)
      if (typeof n.pin == "boolean") n.pin && !o(e) && (r.pin = n.pin);
      else {
        let i = t(n.pin, { triggerElement: e });
        i.length > 0 && !o(i[0]) && (r.pin = i[0]);
      }
    if (n.endTrigger) {
      let i = t(n.endTrigger, { triggerElement: e });
      i.length > 0 && (r.endTrigger = i[0]);
    }
    if (n.scroller) {
      let i = t(n.scroller, { triggerElement: e });
      i.length > 0 ? (r.scroller = i[0]) : (r.scroller = window);
    }
    return r;
  }
  function $s(n, e, t = !1) {
    let [r, o, i, s] = n,
      a = (c) => () => {
        if (c !== void 0)
          switch (c) {
            case "play":
              t && e.progress() === 0 && e.invalidate(), e.play();
              break;
            case "pause":
              e.pause();
              break;
            case "resume":
              t && e.progress() === 0 && e.invalidate(), e.resume();
              break;
            case "reverse":
              e.reverse();
              break;
            case "restart":
              t && e.invalidate(), e.restart();
              break;
            case "reset":
              e.pause(0);
              break;
            case "complete":
              t && e.progress() === 0 && e.invalidate(), e.progress(1);
              break;
            case "none":
              break;
            default: {
              let u = c;
              break;
            }
          }
      },
      l = {};
    return (
      r !== "none" && (l.onEnter = a(r)),
      o !== "none" && (l.onLeave = a(o)),
      i !== "none" && (l.onEnterBack = a(i)),
      s !== "none" && (l.onLeaveBack = a(s)),
      l
    );
  }
  function Gs(n, e, t, r, o, i = !1) {
    let s = qs(n, e, o),
      a = [
        n.enter || "none",
        n.leave || "none",
        n.enterBack || "none",
        n.leaveBack || "none",
      ],
      l = {
        trigger: e,
        markers: n.showMarkers ?? !1,
        start: n.clamp ? `clamp(${n.start})` : n.start || "top bottom",
        end: n.clamp ? `clamp(${n.end})` : n.end || "bottom top",
        scrub: n.scrub ?? !1,
        horizontal: n.horizontal || !1,
        toggleActions: a.join(" "),
        id: t,
        ...s,
      };
    if (l.scrub !== !1) l.animation = r;
    else {
      let c = $s(a, r, i);
      Object.assign(l, c);
    }
    return l;
  }
  function Yr(n) {
    return n.splitText
      ? typeof n.splitText == "string"
        ? n.splitText
        : n.splitText.type
      : "none";
  }
  function je(n) {
    return n.split(", ");
  }
});
var Kr = m((jt) => {
  "use strict";
  Object.defineProperty(jt, "__esModule", { value: !0 });
  Object.defineProperty(jt, "analyzeSharedTimelineGroups", {
    enumerable: !0,
    get: function () {
      return Hs;
    },
  });
  var Zr = Y();
  function Hs(n, e, t, r, o) {
    let i = n.timelineIds ?? [];
    if (i.length < 2) return [];
    for (let [, c] of n.triggers) {
      if (c?.controlType === Zr.TimelineControlType.CONTINUOUS) return [];
      if (Ys(c)) return [];
    }
    if (Js(n.triggers, t, n)) return [];
    let s = [];
    for (let c of i) {
      let u = e.get(c);
      if (!u || u.reuse || !u.actions?.length || ta(u, r) || o?.(u, n))
        continue;
      let d = new Set();
      for (let f of u.actions)
        if (f.targets)
          for (let p of f.targets) for (let g of t(p, {}, n)) d.add(g);
      s.push({ id: c, targets: d });
    }
    let a = [],
      l = new Set();
    for (let c = 0; c < s.length; c++) {
      if (l.has(c)) continue;
      let u = [s[c].id],
        d = new Set(s[c].targets);
      l.add(c);
      let f = !0;
      for (; f; ) {
        f = !1;
        for (let p = c + 1; p < s.length; p++)
          if (!l.has(p) && Qr(d, s[p].targets)) {
            u.push(s[p].id);
            for (let g of s[p].targets) d.add(g);
            l.add(p), (f = !0);
          }
      }
      if (u.length >= 2) {
        let p = u.findIndex((g) => zs(e.get(g), r));
        if (p > 0) {
          let [g] = u.splice(p, 1);
          u.unshift(g);
        }
        a.push({ primary: u[0], members: u });
      }
    }
    return a;
  }
  function zs(n, e) {
    if (!n?.actions) return !1;
    let t = new Map();
    for (let r of n.actions) {
      if (!r) continue;
      let o = r.tt ?? 0,
        i = r.splitText
          ? typeof r.splitText == "string"
            ? r.splitText
            : r.splitText.type
          : "none",
        s =
          i === "none"
            ? JSON.stringify(r.targets)
            : `${JSON.stringify(r.targets)}_split_${i}`,
        a = t.get(s) ?? new Set();
      t.set(s, a);
      let l = !1;
      for (let c of Object.values(r.properties ?? {}))
        for (let u of Object.keys(c || {})) a.has(u) ? (l = !0) : a.add(u);
      if ((o === 1 || o === 2) && !l && Ws(r, e)) return !0;
    }
    return !1;
  }
  function Ws(n, e) {
    for (let t in n.properties) {
      let r = e(t),
        o = n.properties[t];
      if (!(!r?.createTweenConfig || !o))
        try {
          let i = r.createTweenConfig(o);
          if (Object.keys(i.from ?? {}).length > 0) return !0;
        } catch {}
    }
    return !1;
  }
  function Ys(n) {
    return !n ||
      (n.controlType !== void 0 &&
        n.controlType !== Zr.TimelineControlType.STANDARD)
      ? !0
      : !(
          n.assignedGroupId !== void 0 ||
          n.assignedTimelineRole ||
          Xs(n.pluginConfig)
        );
  }
  function Xs(n) {
    return typeof n == "object" && n !== null && n.multiTimeline === !0;
  }
  function Zs(n) {
    return typeof n?.assignedGroupId == "string" ? n.assignedGroupId : void 0;
  }
  function Qs(n) {
    let e = Zs(n);
    return e !== void 0
      ? `group:${e}`
      : n?.assignedTimelineRole
      ? `role:${n.assignedTimelineRole}`
      : void 0;
  }
  function Ks(n) {
    let e = n?.pluginConfig;
    if (typeof e == "object" && e !== null) {
      let t = e.eventMode;
      return t === "enter" || t === "leave" ? t : void 0;
    }
  }
  function Js(n, e, t) {
    let r = [];
    for (let [, o, i] of n) {
      let s = Qs(o);
      s !== void 0 &&
        r.push({
          route: s,
          eventMode: Ks(o),
          elements: i ? new Set(e(i, {}, t)) : new Set(),
        });
    }
    for (let o = 0; o < r.length; o++)
      for (let i = o + 1; i < r.length; i++) {
        if (r[o].route === r[i].route) continue;
        let s = r[o].eventMode,
          a = r[i].eventMode,
          l = Qr(r[o].elements, r[i].elements),
          c = s !== void 0 && a !== void 0;
        if (l) {
          if (!(c && s !== a)) return !0;
        } else if (c || ea(r[o].elements, r[i].elements)) return !0;
      }
    return !1;
  }
  function Qr(n, e) {
    let [t, r] = n.size <= e.size ? [n, e] : [e, n];
    for (let o of t) if (r.has(o)) return !0;
    return !1;
  }
  function ea(n, e) {
    for (let t of n)
      for (let r of e)
        if (t !== r && (t.contains(r) || r.contains(t))) return !0;
    return !1;
  }
  function ta(n, e) {
    for (let t of n.actions ?? [])
      for (let r in t.properties) if (e(r)?.createCustomTween) return !0;
    return !1;
  }
});
var Jr = m((Bt) => {
  "use strict";
  Object.defineProperty(Bt, "__esModule", { value: !0 });
  Object.defineProperty(Bt, "ConditionEvaluator", {
    enumerable: !0,
    get: function () {
      return Vt;
    },
  });
  var he = Y(),
    Vt = class {
      getConditionEvaluator;
      sharedObservers = new Map();
      conditionCache = new Map();
      CACHE_TTL = 100;
      constructor(e) {
        this.getConditionEvaluator = e;
      }
      evaluateConditionsForTrigger = async (e, t) => {
        if (!e?.length) return !0;
        let r = e.some(([o]) => o === he.CORE_OPERATORS.OR);
        return this.evaluateCondition(
          [r ? he.CORE_OPERATORS.OR : he.CORE_OPERATORS.AND, { conditions: e }],
          t
        );
      };
      observeConditionsForTrigger = (e, t) => {
        if (!e?.length) return () => {};
        let r = [],
          o = [];
        for (let s of e)
          this.getConditionEvaluator(s)?.isReactive ?? !1
            ? r.push(s)
            : o.push(s[0]);
        if (r.length === 0) return () => {};
        let i = r.map((s) => this.getOrCreateSharedObserver(s, t));
        return () => {
          for (let s of i) s();
        };
      };
      disposeSharedObservers = () => {
        for (let [e, t] of this.sharedObservers)
          try {
            t.cleanup();
          } catch (r) {
            console.error("Error disposing shared observer: %s", e, r);
          }
        this.sharedObservers.clear(), this.conditionCache.clear();
      };
      observeCondition = (e, t) => {
        let r = this.getEvaluator(e);
        if (r?.observe)
          try {
            return r.observe(e, t);
          } catch (o) {
            console.error("Error setting up condition observer:", o);
          }
      };
      getEvaluator = (e) => {
        let [t] = e;
        return t === he.CORE_OPERATORS.AND || t === he.CORE_OPERATORS.OR
          ? this.getLogicalEvaluator(t)
          : this.getConditionEvaluator(e);
      };
      getLogicalEvaluator = (e) => ({
        evaluate: async (t, r) => {
          let [, o, i] = t,
            { conditions: s } = o || {};
          if (!Array.isArray(s)) return !1;
          if (!s.length) return !0;
          let a = e === he.CORE_OPERATORS.OR,
            l = i === 1;
          for (let c of s) {
            let u = await this.evaluateCondition(c, r);
            if (a ? u : !u) return a ? !l : !!l;
          }
          return a ? !!l : !l;
        },
        observe: (t, r) => {
          let [, o] = t,
            { conditions: i } = o || {};
          if (!Array.isArray(i)) return () => {};
          let s = i.map((a) =>
            this.observeCondition(a, async () =>
              r(await this.evaluateCondition(t))
            )
          );
          return () => s.forEach((a) => a && a());
        },
      });
      evaluateCondition = async (e, t) => {
        let r = this.generateConditionCacheKey(e, t),
          o = Date.now(),
          i = this.conditionCache.get(r);
        if (i && o - i.timestamp < this.CACHE_TTL) return i.result;
        let s = this.getEvaluator(e);
        if (!s)
          return (
            console.warn(`No evaluator found for condition type '${e[0]}'`), !1
          );
        try {
          let a = await s.evaluate(e, t);
          return this.conditionCache.set(r, { result: a, timestamp: o }), a;
        } catch (a) {
          return console.error("Error evaluating condition:", a), !1;
        }
      };
      generateConditionCacheKey = (e, t) => {
        let [r, o, i] = e,
          s = o ? JSON.stringify(o) : "",
          a = i ? ":negate" : "",
          l = t ? `:ctx:${t.id}` : "";
        return `${r}:${s}${a}${l}`;
      };
      invalidateConditionCache = (e) => {
        let [t] = e,
          r = [];
        for (let o of this.conditionCache.keys())
          o.startsWith(`${t}:`) && r.push(o);
        r.forEach((o) => this.conditionCache.delete(o));
      };
      generateObserverKey = (e) => {
        let [t, r, o] = e,
          i = r ? JSON.stringify(r) : "";
        return `${t}:${i}${o ? ":negate" : ""}`;
      };
      getOrCreateSharedObserver = (e, t) => {
        let r = this.generateObserverKey(e),
          o = this.sharedObservers.get(r);
        if (!o) {
          let i = this.getEvaluator(e);
          if (!i?.observe) return () => {};
          let s = new Set(),
            a = i.observe(e, async () => {
              this.invalidateConditionCache(e);
              let l = Array.from(s, async (c) => {
                try {
                  await c();
                } catch (u) {
                  console.error("Error in shared observer callback:", u);
                }
              });
              await Promise.allSettled(l);
            });
          if (!a) return () => {};
          (o = { cleanup: a, refCount: 0, callbacks: s }),
            this.sharedObservers.set(r, o);
        }
        return (
          o.callbacks.add(t),
          o.refCount++,
          () => this.releaseSharedObserver(r, t)
        );
      };
      releaseSharedObserver = (e, t) => {
        let r = this.sharedObservers.get(e);
        if (
          !(!r || !r.callbacks.delete(t)) &&
          ((r.refCount = Math.max(0, r.refCount - 1)),
          r.refCount <= 0 && r.callbacks.size === 0)
        ) {
          try {
            r.cleanup();
          } catch (i) {
            console.error("Error cleaning up shared observer:", i);
          }
          this.sharedObservers.delete(e);
        }
      };
    };
});
var ei = m((qt) => {
  "use strict";
  Object.defineProperty(qt, "__esModule", { value: !0 });
  Object.defineProperty(qt, "ConditionalPlaybackManager", {
    enumerable: !0,
    get: function () {
      return Ut;
    },
  });
  var na = Y(),
    Ut = class {
      matchMediaInstances = new Map();
      setupConditionalContext = (e, t, r) => {
        let { conditionalPlayback: o, triggers: i, id: s } = e;
        if (!o || o.length === 0) {
          t(null);
          return;
        }
        this.cleanup(s);
        let a = window.gsap?.matchMedia();
        if (!a) {
          t(null);
          return;
        }
        this.matchMediaInstances.set(s, a);
        let l = !0,
          c = i.some(
            ([, { controlType: u }]) => u === na.TimelineControlType.LOAD
          );
        a.add(this.buildConditionsObject(o), (u) => {
          if (c && !l) return !1;
          l = !1;
          let d = this.evaluateConditions(u.conditions || {}, o);
          return (!d || d.behavior === "skip-to-end") && t(d), r;
        });
      };
      cleanup = (e) => {
        let t = this.matchMediaInstances.get(e);
        t && (t.revert(), this.matchMediaInstances.delete(e));
      };
      destroy = () => {
        for (let [e] of this.matchMediaInstances) this.cleanup(e);
        this.matchMediaInstances.clear();
      };
      buildConditionsObject = (e) => {
        let t = {};
        for (let r of e)
          switch (r.type) {
            case "prefers-reduced-motion": {
              t.prefersReduced = "(prefers-reduced-motion: reduce)";
              break;
            }
            case "breakpoint": {
              (r.breakpoints || []).forEach((i) => {
                let s = ra[i];
                s && (t[`breakpoint_${i}`] = s);
              });
              break;
            }
            default:
              break;
          }
        return (t.fallback = "(min-width: 0px)"), t;
      };
      evaluateConditions(e, t) {
        let r = [];
        for (let s of t)
          s.type === "prefers-reduced-motion" &&
            e.prefersReduced &&
            r.push({ condition: s, type: "prefers-reduced-motion" }),
            s.type === "breakpoint" &&
              (s.breakpoints || []).some((c) => e[`breakpoint_${c}`]) &&
              r.push({ condition: s, type: "breakpoint" });
        if (r.length === 0) return null;
        let o = r.find(({ condition: s }) => s.behavior === "dont-animate");
        if (o)
          return {
            behavior: "dont-animate",
            matchedConditions: {
              prefersReduced: o.type === "prefers-reduced-motion",
              breakpointMatched: o.type === "breakpoint",
            },
          };
        let i = r[0];
        return {
          behavior: i.condition.behavior,
          matchedConditions: {
            prefersReduced: i.type === "prefers-reduced-motion",
            breakpointMatched: i.type === "breakpoint",
          },
        };
      }
    },
    ra = {
      tiny: "(max-width: 479px) and (min-width: 0px)",
      small: "(max-width: 767px) and (min-width: 480px)",
      medium: "(max-width: 991px) and (min-width: 768px)",
      main: "(min-width: 992px)",
    };
});
var ni = m((Gt) => {
  "use strict";
  Object.defineProperty(Gt, "__esModule", { value: !0 });
  Object.defineProperty(Gt, "PluginRegistry", {
    enumerable: !0,
    get: function () {
      return $t;
    },
  });
  var $t = class {
    plugins = new Map();
    extensionsByPoint = new Map();
    activePlugins = new Set();
    pluginStorage = new Map();
    constructor() {
      ["trigger", "action", "targetResolver", "condition"].forEach((e) =>
        this.extensionsByPoint.set(e, new Map())
      );
    }
    async registerPlugin(e) {
      let t = ti(e.manifest.id);
      if (this.plugins.has(t))
        throw new Error(`Plugin ${t} is already registered`);
      let r = Object.entries(e.manifest.dependencies ?? {});
      for (let [o] of r)
        if (!this.plugins.has(o))
          throw new Error(`Missing dependency: ${o} required by ${t}`);
      this.plugins.set(t, e), e.initialize && (await e.initialize());
      for (let o of e.extensions) this.registerExtension(o);
      r.length || (await this.activatePlugin(t));
    }
    registerExtension(e) {
      this.extensionsByPoint.has(e.extensionPoint) ||
        this.extensionsByPoint.set(e.extensionPoint, new Map());
      let t = this.extensionsByPoint.get(e.extensionPoint),
        r = e.id;
      if (t.has(r))
        throw new Error(
          `Extension ${r} is already registered for point ${e.extensionPoint}`
        );
      t.set(r, e);
    }
    async activatePlugin(e) {
      if (this.activePlugins.has(e)) return;
      let t = this.plugins.get(e);
      if (!t) throw new Error(`Cannot activate unknown plugin: ${e}`);
      let r = Object.keys(t.manifest.dependencies ?? {});
      for (let o of r) await this.activatePlugin(o);
      t.activate && (await t.activate()), this.activePlugins.add(e);
    }
    async deactivatePlugin(e) {
      if (!this.activePlugins.has(e)) return;
      let t = this.plugins.get(e);
      if (!t) throw new Error(`Cannot deactivate unknown plugin: ${e}`);
      t.deactivate && (await t.deactivate()), this.activePlugins.delete(e);
    }
    async unregisterPlugin(e, t) {
      let r = ti([e, t]),
        o = this.plugins.get(r);
      if (o) {
        this.activePlugins.has(r) && (await this.deactivatePlugin(r));
        for (let i of o.extensions)
          i.extensionPoint === "condition" &&
            i.implementation.dispose &&
            (await i.implementation.dispose()),
            this.extensionsByPoint
              .get(i.extensionPoint)
              ?.delete(`${r}:${i.id}`);
        o.dispose && (await o.dispose()),
          this.plugins.delete(r),
          this.pluginStorage.delete(r);
      }
    }
    getExtensions(e) {
      return this.extensionsByPoint.get(e) || new Map();
    }
    getExtensionImpl(e, t) {
      return this.getExtensions(t).get(e)?.implementation;
    }
    getTriggerHandler([e]) {
      return this.getExtensionImpl(e, "trigger");
    }
    getActionHandler(e) {
      return this.getExtensionImpl(e, "action");
    }
    getTargetResolver([e]) {
      return this.getExtensionImpl(e, "targetResolver");
    }
    getConditionEvaluator([e]) {
      return this.getExtensionImpl(e, "condition");
    }
    getAllPlugins() {
      return this.plugins.values();
    }
  };
  function ti(n) {
    return `${n[0]}:${n[1]}`;
  }
});
var Ee = m((zt) => {
  "use strict";
  Object.defineProperty(zt, "__esModule", { value: !0 });
  Object.defineProperty(zt, "BaseTriggerStrategy", {
    enumerable: !0,
    get: function () {
      return Ht;
    },
  });
  var Ht = class {
    runTrigger;
    runTimelineAction;
    skipToEndState;
    constructor(e, t, r) {
      (this.runTrigger = e),
        (this.runTimelineAction = t),
        (this.skipToEndState = r);
    }
  };
});
var ri = m((Yt) => {
  "use strict";
  Object.defineProperty(Yt, "__esModule", { value: !0 });
  Object.defineProperty(Yt, "StandardTriggerStrategy", {
    enumerable: !0,
    get: function () {
      return Wt;
    },
  });
  var ia = Ee();
  function oa(n) {
    if (!n || typeof n != "object") return !1;
    let e = n;
    return e.type === "timeline-role" && typeof e.role == "string";
  }
  function sa(n) {
    if (!n || typeof n != "object") return !1;
    let e = n;
    return e.type === "playback-control" && typeof e.control == "string";
  }
  var Wt = class extends ia.BaseTriggerStrategy {
    getTimelineIdsForRole;
    resolveAssignedTimelineIds;
    constructor(e, t, r, o, i) {
      super(e, t, r),
        (this.getTimelineIdsForRole = o),
        (this.resolveAssignedTimelineIds = i);
    }
    bind(e, t, r) {
      let {
          interactionId: o,
          elements: i,
          triggerHandler: s,
          eventManager: a,
          conditionalContext: l,
          cleanupMap: c,
          delay: u,
        } = r,
        d = e[1];
      for (let f of i) {
        if (!f) continue;
        let p = c.get(f);
        p || ((p = new Set()), c.set(f, p));
        let g = null,
          h,
          v = s(e, f, a, (y) => {
            let E = sa(y) ? y.control : void 0,
              b;
            if (
              (oa(y)
                ? (b = this.getTimelineIdsForRole(t, y.role))
                : (b = this.resolveAssignedTimelineIds(e, t)),
              b?.length === 0)
            )
              return;
            if (l !== null) {
              l.behavior === "skip-to-end" &&
                this.skipToEndState(t, null, d, b, E);
              return;
            }
            let M = () => {
              this.runTrigger(e, f, o, b, E).catch((w) =>
                console.error("Error in trigger execution:", w)
              );
            };
            d.conditionalLogic || !u
              ? M()
              : (g == null || E !== h) &&
                (g != null && clearTimeout(g),
                (h = E),
                (g = setTimeout(() => {
                  (g = null), M();
                }, u * 1e3)));
          });
        v && p.add(v),
          p.add(() => {
            g != null && (clearTimeout(g), (g = null));
          });
      }
    }
  };
});
var ii = m((Zt) => {
  "use strict";
  Object.defineProperty(Zt, "__esModule", { value: !0 });
  Object.defineProperty(Zt, "LoadTriggerStrategy", {
    enumerable: !0,
    get: function () {
      return Xt;
    },
  });
  var aa = Ee(),
    Xt = class extends aa.BaseTriggerStrategy {
      loadInteractions;
      getTimeline;
      constructor(e, t, r, o, i) {
        super(e, t, r), (this.loadInteractions = o), (this.getTimeline = i);
      }
      bind(e, t, r) {
        if (window.__wf_ix3) return;
        let { conditionalContext: o, delay: i } = r,
          s = e[1];
        this.loadInteractions.push(() => {
          if (o !== null) {
            o.behavior === "skip-to-end" && this.skipToEndState(t, null);
            return;
          }
          let a = () => {
            for (let l of t.timelineIds ?? []) {
              let c = this.getTimeline(l, null);
              c &&
                (c.data.splitLines
                  ? document.fonts.ready.then(() => {
                      this.runTimelineAction(l, s, null);
                    })
                  : this.runTimelineAction(l, s, null));
            }
          };
          i ? setTimeout(a, i * 1e3) : a();
        });
      }
    };
});
var oi = m((Kt) => {
  "use strict";
  Object.defineProperty(Kt, "__esModule", { value: !0 });
  Object.defineProperty(Kt, "ScrollTriggerStrategy", {
    enumerable: !0,
    get: function () {
      return Qt;
    },
  });
  var la = Ee(),
    Qt = class extends la.BaseTriggerStrategy {
      setupScrollControl;
      constructor(e, t, r, o) {
        super(e, t, r), (this.setupScrollControl = o);
      }
      bind(e, t, r) {
        let { interactionId: o, elements: i, conditionalContext: s } = r,
          a = e[1].scrollTriggerConfig;
        if (a) {
          for (let l of i)
            if (l) {
              if (s !== null) {
                s.behavior === "skip-to-end" && this.skipToEndState(t, l);
                continue;
              }
              for (let c of t.timelineIds ?? [])
                this.setupScrollControl(c, o, a, l);
            }
        }
      }
    };
});
var si = m((tn) => {
  "use strict";
  Object.defineProperty(tn, "__esModule", { value: !0 });
  Object.defineProperty(tn, "ContinuousChannelManager", {
    enumerable: !0,
    get: function () {
      return Jt;
    },
  });
  var Jt = class {
      coordinator;
      resolveRole;
      channels;
      animation;
      constructor(e, t) {
        (this.coordinator = e),
          (this.resolveRole = t),
          (this.channels = new Map()),
          (this.animation = e.animation);
      }
      isPreviewEnabled() {
        return !(window.__wf_ix3 && window.__wf_ix3_continuous_preview === !1);
      }
      registerChannel(e) {
        let t = this.resolveRole(e.role);
        if (!t)
          return (
            console.warn(
              `IX3 Continuous: Failed to resolve role '${e.role}' to timeline ID. Channel registration skipped.`
            ),
            null
          );
        let r = new en(
          {
            timelineId: t,
            initialValue: e.initialValue,
            element: e.element,
            smoothing: e.smoothing,
            animation: this.animation,
            isPreviewEnabled: () => this.isPreviewEnabled(),
          },
          this.coordinator
        );
        return this.channels.set(t, r), r;
      }
      fireInterval(e, t) {
        let r = this.resolveRole(e);
        r &&
          this.coordinator.fireInterval(r, t.element ?? null, {
            targetIndex: t.targetIndex,
            pluginPayload: t.pluginPayload,
          });
      }
      registerIntervalHandler(e, t) {
        this.coordinator.registerIntervalHandler(e, t);
      }
      getMetadata(e) {
        let t = this.resolveRole(e);
        return t ? this.coordinator.getTriggerMetadata(t) : null;
      }
      publishChannel(e, t, r) {
        this.coordinator.publishChannel(e, t, r);
      }
      cleanup() {
        for (let e of this.channels.values()) e.destroy();
        this.channels.clear();
      }
    },
    ca = "power2.out",
    en = class {
      coordinator;
      proxy;
      setter;
      timelineId;
      element;
      isPreviewEnabled;
      constructor(e, t) {
        (this.coordinator = t),
          (this.proxy = { p: e.initialValue }),
          (this.timelineId = e.timelineId),
          (this.element = e.element ?? null),
          (this.isPreviewEnabled = e.isPreviewEnabled);
        let r = (e.smoothing ?? 0) / 1e3;
        (this.setter =
          r > 0
            ? e.animation.quickTo(this.proxy, "p", {
                duration: r,
                ease: ca,
                onUpdate: () => this.updateTimeline(this.proxy.p),
              })
            : null),
          this.updateTimeline(e.initialValue);
      }
      setProgress(e) {
        this.setter
          ? this.setter(e)
          : ((this.proxy.p = e), this.updateTimeline(e));
      }
      setImmediate(e) {
        this.setter
          ? this.setter(e, e)
          : ((this.proxy.p = e), this.updateTimeline(e));
      }
      destroy() {
        this.setter?.tween.kill();
      }
      updateTimeline(e) {
        this.isPreviewEnabled() &&
          this.coordinator.setContinuousProgress(
            this.timelineId,
            e,
            this.element
          );
      }
    };
});
var ai = m((rn) => {
  "use strict";
  Object.defineProperty(rn, "__esModule", { value: !0 });
  Object.defineProperty(rn, "ContinuousTriggerStrategy", {
    enumerable: !0,
    get: function () {
      return nn;
    },
  });
  var ua = Ee(),
    da = si();
  function fa(n) {
    return n != null && "type" in n && n.type === "continuous";
  }
  var nn = class extends ua.BaseTriggerStrategy {
    continuousCleanups;
    triggerCleanupFunctions;
    coordinator;
    getTimelineIdForRole;
    constructor(e, t, r, o, i, s, a) {
      super(e, t, r),
        (this.continuousCleanups = o),
        (this.triggerCleanupFunctions = i),
        (this.coordinator = s),
        (this.getTimelineIdForRole = a);
    }
    bind(e, t, r) {
      let {
        interactionId: o,
        elements: i,
        triggerHandler: s,
        conditionalContext: a,
      } = r;
      for (let l of i) {
        if (!l) continue;
        if (a !== null) {
          a.behavior === "skip-to-end" && this.skipToEndState(t, l);
          continue;
        }
        let c = (f) => this.getTimelineIdForRole(t, f),
          u = new da.ContinuousChannelManager(this.coordinator, c),
          d = s(e, l, r.eventManager, (f) => {
            if (fa(f)) {
              let p = f.setup(u),
                g = this.continuousCleanups.get(o);
              g || ((g = new Map()), this.continuousCleanups.set(o, g)),
                g.set(l, () => {
                  p(), u.cleanup();
                });
            }
          });
        if (d) {
          let f = this.triggerCleanupFunctions.get(o);
          f || ((f = new Map()), this.triggerCleanupFunctions.set(o, f));
          let p = f.get(l);
          p || ((p = new Set()), f.set(l, p)), p.add(d);
        }
      }
    }
  };
});
var ci = m((on) => {
  "use strict";
  Object.defineProperty(on, "__esModule", { value: !0 });
  Object.defineProperty(on, "IX3", {
    enumerable: !0,
    get: function () {
      return Ue;
    },
  });
  var oe = Y(),
    pa = $r(),
    ga = Xr(),
    ha = Kr(),
    ma = Jr(),
    ya = ei(),
    va = ni(),
    z = pe(),
    ba = ri(),
    Ta = ii(),
    wa = oi(),
    Sa = ai(),
    Ea = 200,
    li = 210,
    sn = class {
      env;
      pluginReg;
      timelineDefs;
      interactions;
      triggeredElements;
      triggerCleanupFunctions;
      continuousCleanups;
      conditionalPlaybackManager;
      triggerStrategies;
      windowSize;
      prevWindowSize;
      windowResizeSubscribers;
      debouncedWindowResize;
      bodyResizeObserver;
      triggerObservers;
      timelineRefCounts;
      interactionTimelineRefs;
      timelineToInteractionId;
      reactiveCallbackQueues;
      debouncedReactiveCallback;
      pendingReactiveUpdates;
      reactiveExecutionContext;
      componentScopeSelectors;
      eventMgr;
      loadInteractions;
      coordinator;
      conditionEval;
      constructor(e) {
        (this.env = e),
          (this.pluginReg = new va.PluginRegistry()),
          (this.timelineDefs = new Map()),
          (this.interactions = new Map()),
          (this.triggeredElements = new Map()),
          (this.triggerCleanupFunctions = new Map()),
          (this.continuousCleanups = new Map()),
          (this.windowSize = { w: 0, h: 0 }),
          (this.prevWindowSize = { w: 0, h: 0 }),
          (this.windowResizeSubscribers = new Set()),
          (this.debouncedWindowResize = (0, z.debounce)(() => {
            for (let t of this.windowResizeSubscribers) t();
          }, Ea)),
          (this.bodyResizeObserver = null),
          (this.triggerObservers = new Map()),
          (this.timelineRefCounts = new Map()),
          (this.interactionTimelineRefs = new Map()),
          (this.timelineToInteractionId = new Map()),
          (this.reactiveCallbackQueues = new Map()),
          (this.pendingReactiveUpdates = new Map()),
          (this.reactiveExecutionContext = new Set()),
          (this.componentScopeSelectors = new Map()),
          (this.eventMgr = pa.EventManager.getInstance()),
          (this.loadInteractions = []),
          (this.addEventListener = this.eventMgr.addEventListener.bind(
            this.eventMgr
          )),
          (this.emit = this.eventMgr.emit.bind(this.eventMgr)),
          (this.resolveTargets = (t, r, o) => {
            let i = o?.scope?.type === "component" ? o.scope : null,
              s = i?.componentId
                ? this.getComponentScopeSelector(i.componentId)
                : null,
              a = i?.variants?.length ? i.variants : null,
              l = this.resolveTargetsImpl(t, r, o, s),
              c =
                s && r.triggerElement
                  ? this.filterByInstance(l, s, r.triggerElement)
                  : l;
            return a && s ? this.filterByVariant(c, s, a) : c;
          }),
          (this.isTargetDynamic = (t) =>
            !!this.pluginReg.getTargetResolver(t)?.isDynamic),
          (this.getInteractionForTimeline = (t) => {
            let r = this.timelineToInteractionId.get(t);
            if (r) return this.interactions.get(r);
          }),
          window.addEventListener("resize", this.debouncedWindowResize),
          (this.coordinator = new ga.AnimationCoordinator(
            this.timelineDefs,
            this.pluginReg.getActionHandler.bind(this.pluginReg),
            this.pluginReg.getTargetResolver.bind(this.pluginReg),
            this.resolveTargets,
            this.getInteractionForTimeline,
            e
          )),
          (this.conditionEval = new ma.ConditionEvaluator(
            this.pluginReg.getConditionEvaluator.bind(this.pluginReg)
          )),
          (this.conditionalPlaybackManager =
            new ya.ConditionalPlaybackManager()),
          (this.triggerStrategies = new Map([
            [
              oe.TimelineControlType.STANDARD,
              new ba.StandardTriggerStrategy(
                this.runTrigger.bind(this),
                this.runTimelineAction.bind(this),
                this.skipToEndState.bind(this),
                this.getTimelineIdsForRole.bind(this),
                this.resolveAssignedTimelineIds.bind(this)
              ),
            ],
            [
              oe.TimelineControlType.LOAD,
              new Ta.LoadTriggerStrategy(
                this.runTrigger.bind(this),
                this.runTimelineAction.bind(this),
                this.skipToEndState.bind(this),
                this.loadInteractions,
                this.coordinator.getTimeline.bind(this.coordinator)
              ),
            ],
            [
              oe.TimelineControlType.SCROLL,
              new wa.ScrollTriggerStrategy(
                this.runTrigger.bind(this),
                this.runTimelineAction.bind(this),
                this.skipToEndState.bind(this),
                this.coordinator.setupScrollControl.bind(this.coordinator)
              ),
            ],
            [
              oe.TimelineControlType.CONTINUOUS,
              new Sa.ContinuousTriggerStrategy(
                this.runTrigger.bind(this),
                this.runTimelineAction.bind(this),
                this.skipToEndState.bind(this),
                this.continuousCleanups,
                this.triggerCleanupFunctions,
                this.coordinator,
                this.getTimelineIdForRole.bind(this)
              ),
            ],
          ])),
          (this.debouncedReactiveCallback = (0, z.debounce)(
            () => this.processPendingReactiveUpdates(),
            16,
            { leading: !1, trailing: !0, maxWait: 100 }
          ));
      }
      getCoordinator() {
        return this.coordinator;
      }
      addEventListener;
      emit;
      static async init(e) {
        return (this.instance = new sn(e)), this.instance;
      }
      async registerPlugin(e) {
        await this.pluginReg.registerPlugin(e);
      }
      register(e, t) {
        if (t?.length) for (let r of t) this.timelineDefs.set(r.id, r);
        if (e?.length) {
          for (let r of e) {
            if (this.interactions.has(r.id)) {
              console.warn(
                `Interaction with ID ${r.id} already exists. Use update() to modify it.`
              );
              continue;
            }
            this.interactions.set(r.id, r);
            let o = new Set();
            this.interactionTimelineRefs.set(r.id, o),
              this.conditionalPlaybackManager.setupConditionalContext(
                r,
                (i) => {
                  for (let a of r.timelineIds ?? [])
                    o.add(a),
                      this.incrementTimelineRefCount(a),
                      this.timelineToInteractionId.set(a, r.id);
                  let s = (0, ha.analyzeSharedTimelineGroups)(
                    r,
                    this.timelineDefs,
                    this.resolveTargets,
                    this.pluginReg.getActionHandler.bind(this.pluginReg),
                    this.coordinator.isDynamicTimeline.bind(this.coordinator)
                  );
                  for (let a of s)
                    this.coordinator.registerSharedGroup(a.primary, a.members);
                  for (let a of r.timelineIds ?? [])
                    this.coordinator.createTimeline(a, r);
                  for (let a of r.triggers ?? []) this.bindTrigger(a, r, i);
                },
                () => {
                  this.cleanupInteractionAnimations(r.id);
                }
              );
          }
          for (let r of this.loadInteractions) r();
          if (
            ((this.loadInteractions.length = 0),
            this.coordinator.getScrollTriggers().size > 0)
          ) {
            this.windowResizeSubscribers.add(() => {
              (this.windowSize.h = window.innerHeight),
                (this.windowSize.w = window.innerWidth);
            });
            let r = (0, z.debounce)(
                () => {
                  (this.prevWindowSize.h = this.windowSize.h),
                    (this.prevWindowSize.w = this.windowSize.w);
                },
                li,
                { leading: !0, trailing: !1 }
              ),
              o = (0, z.debounce)(() => {
                if (
                  !(
                    this.windowSize.h !== this.prevWindowSize.h ||
                    this.windowSize.w !== this.prevWindowSize.w
                  )
                )
                  for (let a of this.coordinator.getScrollTriggers().values())
                    a.refresh();
              }, li),
              i = (s) => {
                for (let a of s) a.target === document.body && (r(), o());
              };
            (this.bodyResizeObserver = new ResizeObserver(i)),
              document.body && this.bodyResizeObserver.observe(document.body);
          }
        }
        return this;
      }
      remove(e) {
        let t = Array.isArray(e) ? e : [e];
        for (let r of t) {
          if (!this.interactions.has(r)) {
            console.warn(
              `Interaction with ID ${r} not found, skipping removal.`
            );
            continue;
          }
          this.cleanupTriggerObservers(r),
            this.unbindAllTriggers(r),
            this.cleanupContinuousControlsForInteraction(r);
          let o = this.decrementTimelineReferences(r);
          this.cleanupUnusedTimelines(o),
            this.interactions.delete(r),
            this.triggeredElements.delete(r),
            this.interactionTimelineRefs.delete(r),
            this.conditionalPlaybackManager.cleanup(r);
        }
        return this;
      }
      update(e, t) {
        let r = Array.isArray(e) ? e : [e],
          o = t ? (Array.isArray(t) ? t : [t]) : [];
        o.length && this.register([], o);
        for (let i of r) {
          let { id: s } = i;
          if (!this.interactions.has(s)) {
            console.warn(
              `Interaction with ID ${s} not found, registering as new.`
            ),
              this.register([i], []);
            continue;
          }
          this.remove(s), this.register([i], []);
        }
        return this;
      }
      destroyTimelineInstance(e) {
        this.coordinator.destroy(e);
        let t = `st_${e}_`;
        for (let [r, o] of this.coordinator.getScrollTriggers().entries())
          r.startsWith(t) &&
            (o.kill(), this.coordinator.getScrollTriggers().delete(r));
      }
      cleanupUnusedTimelines(e) {
        let t = new Set();
        for (let r of e)
          this.timelineDefs.get(r)?.reuse?.sourceTimelineId &&
            t.add(this.coordinator.resolveSourceTimelineId(r));
        for (let r of e)
          this.destroyTimelineInstance(r), this.timelineDefs.delete(r);
        for (let r of t)
          e.has(r) || this.coordinator.recomputeFlipEaseForSource(r);
      }
      destroy() {
        let e = Array.from(this.interactions.keys());
        this.remove(e),
          (this.loadInteractions.length = 0),
          this.env.win.ScrollTrigger &&
            (this.env.win.ScrollTrigger.getAll().forEach((t) => t.kill()),
            this.bodyResizeObserver?.disconnect(),
            (this.bodyResizeObserver = null)),
          window.removeEventListener("resize", this.debouncedWindowResize),
          this.cleanupAllContinuousControls();
        try {
          this.debouncedReactiveCallback.cancel();
        } catch (t) {
          console.error(
            "Error canceling debounced callback during destroy:",
            t
          );
        }
        this.pendingReactiveUpdates.clear(),
          this.reactiveCallbackQueues.clear(),
          this.reactiveExecutionContext.clear(),
          this.conditionEval.disposeSharedObservers(),
          this.conditionalPlaybackManager.destroy(),
          this.windowResizeSubscribers.clear(),
          this.timelineDefs.clear(),
          this.interactions.clear(),
          this.triggeredElements.clear(),
          this.triggerCleanupFunctions.clear(),
          this.triggerObservers.clear(),
          this.interactionTimelineRefs.clear(),
          this.timelineToInteractionId.clear(),
          this.componentScopeSelectors.clear();
      }
      bindTrigger(e, t, r) {
        let o = t.id,
          i = this.pluginReg.getTriggerHandler(e),
          s = e[1];
        if (!i) {
          console.warn("No trigger handler:", e[0]);
          return;
        }
        let a = this.triggerCleanupFunctions.get(o) || new Map();
        this.triggerCleanupFunctions.set(o, a);
        let { delay: l = 0, controlType: c } = s,
          u = (0, z.toSeconds)(l),
          d = this.eventMgr,
          f = e[2],
          p = [];
        f && (p = this.resolveTargets(f, {}, t));
        let g =
            c && (0, z.isValidControlType)(c)
              ? c
              : oe.TimelineControlType.STANDARD,
          h = this.triggerStrategies.get(g);
        h
          ? h.bind(e, t, {
              interactionId: o,
              elements: p,
              triggerHandler: i,
              eventManager: d,
              conditionalContext: r,
              cleanupMap: a,
              delay: u || 0,
            })
          : console.warn("No strategy found for control type:", c),
          s.conditionalLogic && this.setupTriggerReactiveMonitoring(e, t);
      }
      setupTriggerReactiveMonitoring(e, t) {
        let { conditionalLogic: r } = e[1];
        if (!r) return;
        let o = `${t.id}:${t.triggers.indexOf(e)}`;
        try {
          let i = this.conditionEval.observeConditionsForTrigger(
              r.conditions,
              async () => {
                await this.executeReactiveCallbackSafely(t.id, o, async () => {
                  let l =
                    (await this.conditionEval.evaluateConditionsForTrigger(
                      r.conditions,
                      t
                    ))
                      ? r.ifTrue
                      : r.ifFalse;
                  if (l) {
                    let c = this.triggeredElements.get(t.id);
                    if (!c) return;
                    let u = this.resolveAssignedTimelineIds(e, t);
                    if (u?.length === 0) return;
                    let d = u ?? t.timelineIds ?? [],
                      f = [];
                    for (let p of c)
                      for (let g of d)
                        f.push({
                          timelineId: g,
                          element: p,
                          action: "pause-reset",
                        });
                    await this.executeTimelineOperationsAsync(f),
                      c.forEach((p) => {
                        this.executeConditionalOutcome(l, p, t, u);
                      });
                  }
                });
              }
            ),
            s = this.triggerObservers.get(t.id);
          s || ((s = new Map()), this.triggerObservers.set(t.id, s)),
            s.set(o, i);
        } catch (i) {
          console.error("Error setting up trigger reactive monitoring:", i);
        }
      }
      async executeReactiveCallbackSafely(e, t, r) {
        this.reactiveExecutionContext.has(t) ||
          (this.pendingReactiveUpdates.set(t, r),
          this.debouncedReactiveCallback());
      }
      async processPendingReactiveUpdates() {
        if (this.pendingReactiveUpdates.size === 0) return;
        let e = new Map(this.pendingReactiveUpdates);
        this.pendingReactiveUpdates.clear();
        let t = new Map();
        for (let [r, o] of e) {
          let i = r.split(":")[0];
          t.has(i) || t.set(i, []),
            t.get(i).push({ triggerKey: r, callback: o });
        }
        for (let [r, o] of t)
          await this.processInteractionReactiveUpdates(r, o);
      }
      async processInteractionReactiveUpdates(e, t) {
        let r = this.reactiveCallbackQueues.get(e);
        if (r)
          try {
            await r;
          } catch (i) {
            console.error("Error waiting for pending reactive callback:", i);
          }
        let o = this.executeInteractionUpdates(t);
        this.reactiveCallbackQueues.set(e, o);
        try {
          await o;
        } finally {
          this.reactiveCallbackQueues.get(e) === o &&
            this.reactiveCallbackQueues.delete(e);
        }
      }
      async executeInteractionUpdates(e) {
        for (let { triggerKey: t, callback: r } of e) {
          this.reactiveExecutionContext.add(t);
          try {
            await r();
          } catch (o) {
            console.error("Error in reactive callback for %s:", t, o);
          } finally {
            this.reactiveExecutionContext.delete(t);
          }
        }
      }
      async executeTimelineOperationsAsync(e) {
        if (e.length)
          return new Promise((t) => {
            Promise.resolve().then(() => {
              e.forEach(({ timelineId: r, element: o, action: i }) => {
                try {
                  if (!this.timelineDefs.has(r)) {
                    console.warn(`Timeline ${r} not found, skipping operation`);
                    return;
                  }
                  if (!o.isConnected) {
                    console.warn(
                      "Element no longer in DOM, skipping timeline operation"
                    );
                    return;
                  }
                  switch (i) {
                    case "pause-reset":
                      this.coordinator.pause(r, o, 0);
                      break;
                    default:
                      console.warn(`Unknown timeline action: ${i}`);
                  }
                } catch (s) {
                  console.error(
                    "Error executing timeline operation: %s, %s",
                    i,
                    r,
                    s
                  );
                }
              }),
                t();
            });
          });
      }
      getTimelineIdsForRole(e, t) {
        let r = e.timelineIds ?? [],
          o = r.filter(
            (i) => this.timelineDefs.get(i)?.triggerMetadata?.role === t
          );
        if (o.length === 0 && r.length > 0) {
          let i = r
            .map(
              (s) => this.timelineDefs.get(s)?.triggerMetadata?.role || "none"
            )
            .join(", ");
          console.warn(
            `IX3: No timelines found for role '${t}' in interaction '${e.id}'. Available roles: [${i}]`
          );
        }
        return o;
      }
      getTimelineIdForRole(e, t) {
        return this.getTimelineIdsForRole(e, t)[0];
      }
      getTimelineIdsForGroup(e, t) {
        return (e.timelineIds ?? []).filter(
          (r) => this.timelineDefs.get(r)?.groupId === t
        );
      }
      resolveAssignedTimelineIds(e, t) {
        let r = e[1];
        if (r.assignedGroupId === null) return [];
        if (r.assignedGroupId)
          return this.getTimelineIdsForGroup(t, r.assignedGroupId);
        if (r.assignedTimelineRole)
          return this.getTimelineIdsForRole(t, r.assignedTimelineRole);
      }
      async runTrigger(e, t, r, o, i) {
        if (window.__wf_ix3) return;
        let s = e[1],
          a = this.triggeredElements.get(r);
        a || this.triggeredElements.set(r, (a = new Set())), a.add(t);
        let l = this.interactions.get(r);
        if (!l || !l.triggers.includes(e)) return;
        let c = o ?? l.timelineIds ?? [];
        if (s.conditionalLogic)
          try {
            let d = (await this.conditionEval.evaluateConditionsForTrigger(
              s.conditionalLogic.conditions,
              l
            ))
              ? s.conditionalLogic.ifTrue
              : s.conditionalLogic.ifFalse;
            d && this.executeConditionalOutcome(d, t, l, c);
          } catch (u) {
            console.error("Error evaluating trigger conditional logic:", u),
              c.forEach((d) => this.runTimelineAction(d, s, t, i));
          }
        else c.forEach((u) => this.runTimelineAction(u, s, t, i));
      }
      skipToEndState(e, t, r, o, i) {
        (o ?? e.timelineIds ?? []).forEach((a) => {
          let l = this.coordinator.getTimeline(a, t);
          if (!l) return;
          let c =
            i ?? (r ? this.getEffectivePlaybackConfig(a, r).control : void 0);
          if (c === "pause" || c === "stop" || c === "none") return;
          let u;
          switch (c) {
            case "reverse":
            case "reverseFlipEase":
              u = 0;
              break;
            case "togglePlayReverse":
            case "togglePlayReverseFlipEase":
              u = Math.round(1 - l.totalProgress());
              break;
            case "resume":
              u = l.reversed() ? 0 : 1;
              break;
            case "play":
            case "restart":
            case void 0:
              u = 1;
              break;
            default: {
              let d = c;
              u = 1;
              break;
            }
          }
          this.coordinator.setTotalProgress(a, u, t ?? null);
        });
      }
      executeConditionalOutcome(e, t, r, o) {
        let {
            control: i,
            targetTimelineId: s,
            speed: a,
            jump: l,
            delay: c = 0,
          } = e,
          u = (0, z.toSeconds)(c);
        if (i === "none") return;
        let d = r.timelineIds ?? [],
          f;
        if (s) {
          if (!d.includes(s)) {
            console.warn(
              `Target timeline '${s}' not found in interaction '${
                r.id
              }'. Available timelines: ${d.join(", ")}`
            );
            return;
          }
          f = [s];
        } else f = d;
        if (o) {
          let g = new Set(o);
          f = f.filter((h) => g.has(h));
        }
        if (f.length === 0) return;
        let p = () => {
          f.forEach((g) => {
            a !== void 0 && this.coordinator.setTimeScale(g, a, t);
            let h = (0, z.toSeconds)(l);
            switch (i) {
              case "play":
                this.coordinator.play(g, t, h);
                break;
              case "pause":
                this.coordinator.pause(g, t, h);
                break;
              case "resume":
                this.coordinator.resume(g, t, h);
                break;
              case "reverse":
              case "reverseFlipEase":
                this.coordinator.reverse(g, t, h);
                break;
              case "restart":
                this.coordinator.restart(g, t);
                break;
              case "stop":
                this.coordinator.pause(g, t, h);
                break;
              case "togglePlayReverse":
              case "togglePlayReverseFlipEase":
                this.coordinator.togglePlayReverse(g, t);
                break;
              default: {
                this.coordinator.restart(g, t);
                let v = i;
                break;
              }
            }
          });
        };
        u
          ? setTimeout(() => {
              p();
            }, u * 1e3)
          : p();
      }
      getEffectivePlaybackConfig(e, t) {
        let r = this.timelineDefs.get(e);
        if (r?.triggerMetadata) {
          let i = r.settings;
          return {
            control: i?.control,
            delay: i?.delay,
            jump: i?.jump,
            speed: i?.speed,
          };
        }
        let o =
          t.controlType && (0, z.isValidControlType)(t.controlType)
            ? t.controlType
            : oe.TimelineControlType.STANDARD;
        if (r?.groupId && o === oe.TimelineControlType.STANDARD) {
          let i = r.settings;
          return {
            control: t.control,
            delay: void 0,
            jump: i?.jump,
            speed: i?.speed,
          };
        }
        return {
          control: t.control,
          delay: void 0,
          jump: t.jump,
          speed: t.speed,
        };
      }
      runTimelineAction(e, t, r, o) {
        let {
            control: i,
            delay: s,
            jump: a,
            speed: l,
          } = this.getEffectivePlaybackConfig(e, t),
          c = o ?? i,
          u = this.timelineDefs.get(e);
        if (u?.reuse) {
          let p = u.reuse.sourceTimelineId;
          if (!this.timelineDefs.has(p)) {
            console.warn(`Timeline reuse: source '${p}' not found for '${e}'`);
            return;
          }
          e = p;
        }
        let d = () => {
            this.coordinator.setTimeScale(e, l ?? 1, r);
            let p = (0, z.toSeconds)(a);
            switch (c) {
              case "play":
                this.coordinator.play(e, r, p);
                break;
              case "pause":
                this.coordinator.pause(e, r, p);
                break;
              case "resume":
                this.coordinator.resume(e, r, p);
                break;
              case "reverse":
              case "reverseFlipEase":
                this.coordinator.reverse(e, r, p);
                break;
              case "restart":
                this.coordinator.restart(e, r);
                break;
              case "togglePlayReverse":
              case "togglePlayReverseFlipEase":
                this.coordinator.togglePlayReverse(e, r);
                break;
              case "stop":
                this.coordinator.pause(e, r, p);
                break;
              case "none":
                break;
              case void 0:
                this.coordinator.restart(e, r);
                break;
              default: {
                let g = c;
                this.coordinator.restart(e, r);
                break;
              }
            }
          },
          f = (0, z.toSeconds)(s);
        f && f > 0 ? setTimeout(d, f * 1e3) : d();
      }
      resolveTargets;
      isTargetDynamic;
      getComponentScopeSelector(e) {
        let t = this.componentScopeSelectors.get(e);
        return (
          t ||
            ((t = `[data-wf-component-id="${CSS.escape(e)}"]`),
            this.componentScopeSelectors.set(e, t)),
          t
        );
      }
      resolveTargetsImpl(e, t, r, o) {
        let [i, s, a] = e;
        if (s === "*" && a && a.filterBy) {
          let d = this.resolveUniversalSelectorOptimized(a, t, r, o);
          if (d) return d;
        }
        let l = this.pluginReg.getTargetResolver([i, s]);
        if (!l) return [];
        let c = l.resolve([i, s], t),
          u = o ? this.filterByScope(c, o) : c;
        return !u.length || !a || a.relationship === "none" || !a.filterBy
          ? u
          : this.applyRelationshipFilter(
              u,
              a.relationship,
              this.resolveTargetsImpl(a.filterBy, t, r, o),
              a.firstMatchOnly
            );
      }
      resolveUniversalSelectorOptimized(e, t, r, o) {
        if (!e.filterBy) return null;
        let i = this.resolveTargetsImpl(e.filterBy, t, r, o),
          s = i.length;
        if (!s) return [];
        let a = !!e.firstMatchOnly;
        switch (e.relationship) {
          case "direct-child-of": {
            let l = [];
            for (let c = 0; c < s; c++) {
              let u = i[c];
              if (!u) continue;
              let d = u.children;
              for (let f = 0; f < d.length; f++)
                if ((l.push(d[f]), a)) return l;
            }
            return l;
          }
          case "within": {
            let l = [];
            for (let c = 0; c < s; c++) {
              let u = i[c];
              if (!u) continue;
              let d = u.querySelectorAll("*");
              for (let f = 0; f < d.length; f++)
                if ((l.push(d[f]), a)) return l;
            }
            return l;
          }
          case "direct-parent-of": {
            let l = new Set(),
              c = [];
            for (let u = 0; u < s; u++) {
              let d = i[u];
              if (!d) continue;
              let f = d.parentElement;
              if (f && !l.has(f) && (l.add(f), c.push(f), a)) break;
            }
            return o ? this.filterByScope(c, o) : c;
          }
          case "next-sibling-of": {
            let l = [];
            for (let c = 0; c < s; c++) {
              let u = i[c];
              if (!u) continue;
              let d = u.nextElementSibling;
              if (d && (l.push(d), a)) break;
            }
            return o ? this.filterByScope(l, o) : l;
          }
          case "prev-sibling-of": {
            let l = [];
            for (let c = 0; c < s; c++) {
              let u = i[c];
              if (!u) continue;
              let d = u.previousElementSibling;
              if (d && (l.push(d), a)) break;
            }
            return o ? this.filterByScope(l, o) : l;
          }
          case "next-to": {
            let l = new Set(),
              c = [];
            for (let u = 0; u < s; u++) {
              let d = i[u];
              if (!d) continue;
              let f = d.parentElement;
              if (f) {
                let p = f.children;
                for (let g = 0; g < p.length; g++) {
                  let h = p[g];
                  if (h !== d && !l.has(h) && (l.add(h), c.push(h), a)) break;
                }
                if (a && c.length) break;
              }
            }
            return o ? this.filterByScope(c, o) : c;
          }
          case "contains": {
            let l = new Set(),
              c = [];
            for (let u = 0; u < s; u++) {
              let d = i[u];
              if (!d) continue;
              let f = d.parentElement;
              for (; f && !(l.has(f) || (l.add(f), c.push(f), a)); )
                f = f.parentElement;
              if (a && c.length) break;
            }
            return o ? this.filterByScope(c, o) : c;
          }
          default:
            return null;
        }
      }
      applyRelationshipFilter(e, t, r, o) {
        if (!e.length || !r.length) return [];
        if (t === "none") return e;
        let i = [],
          s = new Set();
        switch (t) {
          case "direct-child-of": {
            let a = new Set(r);
            for (let l = 0; l < e.length; l++) {
              let c = e[l];
              if (
                !s.has(c) &&
                c.parentElement &&
                a.has(c.parentElement) &&
                (s.add(c), i.push(c), o)
              )
                return i;
            }
            return i;
          }
          case "direct-parent-of": {
            let a = new Set();
            for (let l = 0; l < r.length; l++) {
              let c = r[l].parentElement;
              c && a.add(c);
            }
            for (let l = 0; l < e.length; l++) {
              let c = e[l];
              if (!s.has(c) && a.has(c) && (s.add(c), i.push(c), o)) return i;
            }
            return i;
          }
          case "next-sibling-of": {
            let a = new Set(r);
            for (let l = 0; l < e.length; l++) {
              let c = e[l];
              if (s.has(c)) continue;
              let u = c.previousElementSibling;
              if (u && a.has(u) && (s.add(c), i.push(c), o)) return i;
            }
            return i;
          }
          case "prev-sibling-of": {
            let a = new Set(r);
            for (let l = 0; l < e.length; l++) {
              let c = e[l];
              if (s.has(c)) continue;
              let u = c.nextElementSibling;
              if (u && a.has(u) && (s.add(c), i.push(c), o)) return i;
            }
            return i;
          }
          case "next-to": {
            let a = new Set(r),
              l = new Map();
            for (let c = 0; c < r.length; c++) {
              let u = r[c].parentElement;
              u && l.set(u, (l.get(u) ?? 0) + 1);
            }
            for (let c = 0; c < e.length; c++) {
              let u = e[c];
              if (s.has(u) || !u.parentElement) continue;
              let d = l.get(u.parentElement);
              if (d && !(a.has(u) && d <= 1) && (s.add(u), i.push(u), o))
                return i;
            }
            return i;
          }
          case "within": {
            let a = new Set(r);
            for (let l = 0; l < e.length; l++) {
              let c = e[l];
              if (s.has(c)) continue;
              let u = c.parentElement;
              for (; u; ) {
                if (a.has(u)) {
                  if ((s.add(c), i.push(c), o)) return i;
                  break;
                }
                u = u.parentElement;
              }
            }
            return i;
          }
          case "contains": {
            let a = new Set();
            for (let l = 0; l < r.length; l++) {
              let c = r[l].parentElement;
              for (; c && !a.has(c); ) a.add(c), (c = c.parentElement);
            }
            for (let l = 0; l < e.length; l++) {
              let c = e[l];
              if (!s.has(c) && a.has(c) && (s.add(c), i.push(c), o)) return i;
            }
            return i;
          }
          default:
            return [];
        }
      }
      filterByInstance(e, t, r) {
        if (!e.length) return e;
        let o = r.closest(t);
        if (!o) return e;
        let i = -1;
        for (let a = 0; a < e.length; a++)
          if (e[a]?.closest(t) !== o) {
            i = a;
            break;
          }
        if (i === -1) return e;
        let s = e.slice(0, i);
        for (let a = i + 1; a < e.length; a++) {
          let l = e[a];
          l?.closest(t) === o && s.push(l);
        }
        return s;
      }
      filterByScope(e, t) {
        if (!e.length) return e;
        let r = -1;
        for (let i = 0; i < e.length; i++)
          if (!e[i]?.closest(t)) {
            r = i;
            break;
          }
        if (r === -1) return e;
        let o = e.slice(0, r);
        for (let i = r + 1; i < e.length; i++) {
          let s = e[i];
          s?.closest(t) && o.push(s);
        }
        return o;
      }
      filterByVariant(e, t, r) {
        if (!e.length) return e;
        let o = (a) => {
            let l = a.closest(t);
            if (!l) return !1;
            let c = l.getAttribute("data-wf-variant-state");
            return c != null && r.includes(c);
          },
          i = -1;
        for (let a = 0; a < e.length; a++) {
          let l = e[a];
          if (!l || !o(l)) {
            i = a;
            break;
          }
        }
        if (i === -1) return e;
        let s = e.slice(0, i);
        for (let a = i + 1; a < e.length; a++) {
          let l = e[a];
          l && o(l) && s.push(l);
        }
        return s;
      }
      getInteractionForTimeline;
      incrementTimelineRefCount(e) {
        let t = this.timelineRefCounts.get(e) || 0;
        this.timelineRefCounts.set(e, t + 1);
      }
      decrementTimelineRefCount(e) {
        let t = this.timelineRefCounts.get(e) || 0,
          r = Math.max(0, t - 1);
        return this.timelineRefCounts.set(e, r), r;
      }
      decrementTimelineReferences(e) {
        let t = new Set(),
          r = this.interactionTimelineRefs.get(e);
        if (!r) return t;
        for (let o of r) this.decrementTimelineRefCount(o) === 0 && t.add(o);
        return t;
      }
      unbindAllTriggers(e) {
        let t = this.triggerCleanupFunctions.get(e);
        if (t) {
          for (let [, r] of t)
            for (let o of r)
              try {
                o();
              } catch (i) {
                console.error("Error during trigger cleanup:", i);
              }
          this.triggerCleanupFunctions.delete(e);
        }
      }
      cleanupTriggerObservers(e) {
        let t = this.triggerObservers.get(e);
        if (t) {
          for (let [r, o] of t) {
            try {
              o();
            } catch (i) {
              console.error("Error during trigger observer cleanup:", i);
            }
            this.pendingReactiveUpdates.delete(r),
              this.reactiveExecutionContext.delete(r);
          }
          this.reactiveCallbackQueues.delete(e),
            this.triggerObservers.delete(e);
        }
      }
      cleanupContinuousControlsForInteraction(e) {
        let t = this.continuousCleanups.get(e);
        if (t) {
          for (let [, r] of t)
            try {
              r();
            } catch (o) {
              console.error("Error during continuous control cleanup:", o);
            }
          this.continuousCleanups.delete(e);
        }
      }
      cleanupAllContinuousControls() {
        for (let [, e] of this.continuousCleanups)
          for (let [, t] of e)
            try {
              t();
            } catch (r) {
              console.error("Error during continuous control cleanup:", r);
            }
        this.continuousCleanups.clear();
      }
      cleanupInteractionAnimations(e) {
        this.unbindAllTriggers(e),
          this.cleanupContinuousControlsForInteraction(e);
        let t = this.interactionTimelineRefs.get(e);
        if (t)
          for (let r of t)
            this.decrementTimelineRefCount(r) === 0 &&
              this.destroyTimelineInstance(r);
        this.triggeredElements.delete(e);
      }
    },
    Ue = sn;
  fe(Ue, "instance");
});
var di = m((an) => {
  "use strict";
  Object.defineProperty(an, "__esModule", { value: !0 });
  function Ca(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Ca(an, {
    EASING_NAMES: function () {
      return Aa.EASING_NAMES;
    },
    IX3: function () {
      return Ma.IX3;
    },
    convertEaseConfigToGSAP: function () {
      return ui.convertEaseConfigToGSAP;
    },
    convertEaseConfigToLinear: function () {
      return ui.convertEaseConfigToLinear;
    },
  });
  var Ma = ci(),
    Aa = pe(),
    ui = Rt();
});
var dn = m((un) => {
  "use strict";
  Object.defineProperty(un, "__esModule", { value: !0 });
  function Ia(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Ia(un, {
    COMPONENT_TIMELINE_ROLES: function () {
      return $a;
    },
    DEFAULT_MOUSE_FOLLOW_ANCHOR: function () {
      return xa;
    },
    DEFAULT_MOUSE_MOVE_INTERVAL_DISTANCE: function () {
      return Pa;
    },
    HOVER_TIMELINE_ROLES: function () {
      return Ga;
    },
    IX3_WF_EXTENSION_KEYS: function () {
      return ln;
    },
    MOUSE_MOVE_CHANNELS: function () {
      return Ua;
    },
    MOUSE_MOVE_TIMELINE_ROLES: function () {
      return ka;
    },
    TIMELINE_ROLE_NAMES: function () {
      return j;
    },
    TargetScope: function () {
      return cn;
    },
    VELOCITY_CAPABLE_PROPS: function () {
      return fi;
    },
    canUseVelocityInfluenceProperty: function () {
      return Fa;
    },
    getEffectiveFollowMode: function () {
      return _a;
    },
    getMouseFollowConfig: function () {
      return Oa;
    },
    getMouseMoveTimelineContext: function () {
      return qe;
    },
    getOppositeMouseFollowAxis: function () {
      return ja;
    },
    getSingleAxisMouseFollowMode: function () {
      return Ra;
    },
    isMouseMoveIntervalRole: function () {
      return La;
    },
    isVelocityInfluenceEnabled: function () {
      return Na;
    },
    mouseFollowAxisToRole: function () {
      return Va;
    },
    mouseFollowRoleToAxis: function () {
      return Da;
    },
    mouseFollowRoleToSiblingRole: function () {
      return Ba;
    },
    narrowMouseMoveIntervalPayload: function () {
      return qa;
    },
  });
  var ln;
  (function (n) {
    (n.CLASS = "wf:class"),
      (n.BODY = "wf:body"),
      (n.ID = "wf:id"),
      (n.TRIGGER_ONLY = "wf:trigger-only"),
      (n.TRIGGER_ONLY_PARENT = "wf:trigger-only-parent"),
      (n.SELECTOR = "wf:selector"),
      (n.ATTRIBUTE = "wf:attribute"),
      (n.INST = "wf:inst"),
      (n.ANY_ELEMENT = "wf:any-element"),
      (n.VIEWPORT = "wf:viewport"),
      (n.STYLE = "wf:style"),
      (n.TRANSFORM = "wf:transform"),
      (n.LOTTIE = "wf:lottie"),
      (n.SPLINE = "wf:spline"),
      (n.VARIABLE = "wf:variable"),
      (n.RIVE = "wf:rive"),
      (n.ANIMATE_RIVE = "wf:animate-rive"),
      (n.MOUSE_FOLLOW = "wf:mouse-follow"),
      (n.CLICK = "wf:click"),
      (n.HOVER = "wf:hover"),
      (n.LOAD = "wf:load"),
      (n.FOCUS = "wf:focus"),
      (n.BLUR = "wf:blur"),
      (n.SCROLL = "wf:scroll"),
      (n.CUSTOM = "wf:custom"),
      (n.CHANGE = "wf:change"),
      (n.MOUSE_MOVE = "wf:mouse-move"),
      (n.NAVBAR = "wf:navbar"),
      (n.DROPDOWN = "wf:dropdown"),
      (n.PREFERS_REDUCED_MOTION = "wf:prefersReducedMotion"),
      (n.WEBFLOW_BREAKPOINTS = "wf:webflowBreakpoints"),
      (n.CUSTOM_MEDIA_QUERY = "wf:customMediaQuery"),
      (n.COLOR_SCHEME = "wf:colorScheme"),
      (n.ELEMENT_DATA_ATTRIBUTE = "wf:elementDataAttribute"),
      (n.CURRENT_TIME = "wf:currentTime"),
      (n.ELEMENT_STATE = "wf:elementState");
  })(ln || (ln = {}));
  var cn;
  (function (n) {
    (n.ALL = "all"),
      (n.PARENT = "parent"),
      (n.CHILDREN = "children"),
      (n.SIBLINGS = "siblings"),
      (n.NEXT = "next"),
      (n.PREVIOUS = "previous"),
      (n.FIRST_ANCESTOR = "first-ancestor"),
      (n.FIRST_DESCENDANT = "first-descendant"),
      (n.DESCENDANTS = "descendants"),
      (n.ANCESTORS = "ancestors");
  })(cn || (cn = {}));
  function Oa(n) {
    let e = n?.properties?.["wf:mouse-follow"];
    if (!(typeof e != "object" || e === null || Array.isArray(e))) return e;
  }
  function _a(n) {
    return n?.followMode ?? "full";
  }
  function Ra(n) {
    return n === "x" ? "x-only" : "y-only";
  }
  var xa = "50% 50%",
    Pa = 100,
    j = {
      MOUSE_X: "mouseX",
      MOUSE_Y: "mouseY",
      INTERVAL: "interval",
      OPEN: "open",
      CLOSE: "close",
      MOUSE_ENTER: "mouseEnter",
      MOUSE_LEAVE: "mouseLeave",
    };
  function qe(n) {
    return n === j.MOUSE_X
      ? { kind: "mouse-x", role: n, axis: "x", siblingRole: j.MOUSE_Y }
      : n === j.MOUSE_Y
      ? { kind: "mouse-y", role: n, axis: "y", siblingRole: j.MOUSE_X }
      : n === j.INTERVAL
      ? { kind: "interval", role: n }
      : { kind: "other", role: n ?? void 0 };
  }
  var ka = {
      MOUSE_X: { role: j.MOUSE_X, label: "Mouse X", usePercentCanvas: !0 },
      MOUSE_Y: { role: j.MOUSE_Y, label: "Mouse Y", usePercentCanvas: !0 },
      INTERVAL: { role: j.INTERVAL, label: "Interval" },
    },
    fi = new Set([
      "x",
      "y",
      "scale",
      "scaleX",
      "scaleY",
      "rotation",
      "skewX",
      "skewY",
      "opacity",
    ]);
  function Na(n) {
    return (
      n?.pluginConfig?.type === "mouseMove" &&
      !!n.pluginConfig.velocityInfluence
    );
  }
  function Fa(n) {
    return fi.has(n);
  }
  function La(n) {
    return qe(n).kind === "interval";
  }
  function Da(n) {
    let e = qe(n);
    return e.kind === "mouse-x" || e.kind === "mouse-y" ? e.axis : null;
  }
  function ja(n) {
    return n === "x" ? "y" : "x";
  }
  function Va(n) {
    return n === "x" ? j.MOUSE_X : j.MOUSE_Y;
  }
  function Ba(n) {
    let e = qe(n);
    return e.kind === "mouse-x" || e.kind === "mouse-y" ? e.siblingRole : null;
  }
  var Ua = { POSITION: "wf:mouse-move:position", LEAVE: "wf:mouse-move:leave" };
  function qa(n) {
    if (typeof n != "object" || n === null) return {};
    let e = n,
      t = {},
      r = e.cursorPos;
    return (
      typeof r == "object" &&
        r !== null &&
        typeof r.x == "number" &&
        typeof r.y == "number" &&
        (t.cursorPos = { x: r.x, y: r.y }),
      typeof e.velocityFactor == "number" &&
        (t.velocityFactor = e.velocityFactor),
      typeof e.dirX == "number" && (t.dirX = e.dirX),
      typeof e.dirY == "number" && (t.dirY = e.dirY),
      t
    );
  }
  var $a = {
      OPEN: {
        role: j.OPEN,
        label: "Open",
        allowedControls: ["play", "restart"],
        defaultControl: "play",
      },
      CLOSE: {
        role: j.CLOSE,
        label: "Close",
        allowedControls: ["play", "restart", "reverse", "reverseFlipEase"],
        allowedControlsWhenReusing: ["reverse", "reverseFlipEase"],
        defaultControl: "play",
        defaultControlWhenReusing: "reverseFlipEase",
        autoReusesRole: j.OPEN,
      },
    },
    Ga = {
      MOUSE_ENTER: {
        role: j.MOUSE_ENTER,
        label: "Hover in actions",
        allowedControls: ["play", "restart"],
        defaultControl: "play",
      },
      MOUSE_LEAVE: {
        role: j.MOUSE_LEAVE,
        label: "Hover out actions",
        allowedControls: ["play", "restart", "reverse", "reverseFlipEase"],
        defaultControl: "play",
      },
    };
});
var yi = m((gn) => {
  "use strict";
  Object.defineProperty(gn, "__esModule", { value: !0 });
  function Ha(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Ha(gn, {
    createLoadedMouseFollowActionNormalizer: function () {
      return Ja;
    },
    forTestSuite: function () {
      return el;
    },
    getGroupedMouseFollowConfig: function () {
      return pn;
    },
    getUnpairedMouseFollowAction: function () {
      return Ya;
    },
    getUnpairedMouseFollowConfig: function () {
      return pi;
    },
    remapMouseFollowActionGroupsInTimelines: function () {
      return Ka;
    },
    setGroupedMouseFollowActionConfig: function () {
      return Wa;
    },
    setMouseFollowActionConfig: function () {
      return gi;
    },
    stripMouseFollowActionInstanceIds: function () {
      return Xa;
    },
    stripMouseFollowConfigInstanceIds: function () {
      return fn;
    },
  });
  var $e = dn();
  function fn(n) {
    let { groupId: e, syncedActionId: t, ...r } = n;
    return r;
  }
  function za(n, e) {
    return { ...fn(n), groupId: e };
  }
  function pn(n, e, t) {
    let r = za(n, e);
    return (
      t?.axis !== void 0 && (r.axis = t.axis),
      t?.followMode !== void 0 && (r.followMode = t.followMode),
      r
    );
  }
  function pi(n, e = n.axis) {
    let { syncedActionId: t, ...r } = n,
      o =
        r.followMode === "full" && e
          ? (0, $e.getSingleAxisMouseFollowMode)(e)
          : r.followMode;
    return { ...r, ...(o !== void 0 ? { followMode: o } : {}) };
  }
  function Ge(n, e) {
    let t = (0, $e.getMouseFollowConfig)(n);
    if (!t) return n;
    let r = e(t);
    return r === t
      ? n
      : {
          ...n,
          properties: {
            ...n.properties,
            [$e.IX3_WF_EXTENSION_KEYS.MOUSE_FOLLOW]: r,
          },
        };
  }
  function gi(n, e) {
    return {
      ...n,
      properties: {
        ...n.properties,
        [$e.IX3_WF_EXTENSION_KEYS.MOUSE_FOLLOW]: e,
      },
    };
  }
  function Wa(n, e, t, r) {
    return gi(n, pn(e, t, r));
  }
  function Ya(n, e) {
    return Ge(n, (t) => pi(t, e));
  }
  function Xa(n) {
    return Ge(n, fn);
  }
  function Za(n, e, t) {
    return t[e] ? [n, e].sort().join(":") : `single:${n}`;
  }
  function Qa(n, e, t) {
    return (
      e.groupId ??
      (e.syncedActionId ? Za(n, e.syncedActionId, t) : `single:${n}`)
    );
  }
  function hi(n, e) {
    let t = {};
    return (r, o = r.id) =>
      Ge(r, (i) => {
        let s = Qa(o, i, e),
          a = t[s] ?? n(s);
        return (t[s] = a), pn(i, a);
      });
  }
  function mi(n, e, t) {
    let r = t ?? Object.fromEntries(n.map((i) => [i.id, i.id])),
      o = hi(() => e(), r);
    return (i, s) => o(i, s ?? i.id);
  }
  function Ka(
    n,
    { generateGroupId: e, actionIdMap: t, mapAction: r = (o) => o }
  ) {
    let o = mi(
      n.flatMap((i) => i.actions ?? []),
      e,
      t
    );
    return n.map((i) => {
      let s = !1,
        a = i.actions?.map((l) => {
          let c = l.id,
            u = r(l),
            d = o(u, c);
          return (s = s || d !== l), d;
        });
      return s && a ? { ...i, actions: a } : i;
    });
  }
  function Ja(n) {
    let e = Object.fromEntries(n.map((r) => [r.id, r.id])),
      t = hi((r) => r, e);
    return (r, o) => {
      let i = t(r);
      return o ? Ge(i, (s) => (s.axis ? s : { ...s, axis: o })) : i;
    };
  }
  var el = { createMouseFollowActionGroupRemapper: mi };
});
var bi = m((hn) => {
  "use strict";
  Object.defineProperty(hn, "__esModule", { value: !0 });
  function tl(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  tl(hn, {
    TRANSIENT_IX3_CLONE_ATTR: function () {
      return vi;
    },
    isTransientIX3Clone: function () {
      return nl;
    },
  });
  var vi = "data-ix3-clone",
    nl = (n) => !!n.closest?.(`[${vi}]`);
});
var Q = m((me) => {
  "use strict";
  Object.defineProperty(me, "__esModule", { value: !0 });
  Object.defineProperty(me, "CORE_PLUGIN_INFO", {
    enumerable: !0,
    get: function () {
      return rl;
    },
  });
  mn(dn(), me);
  mn(yi(), me);
  mn(bi(), me);
  function mn(n, e) {
    return (
      Object.keys(n).forEach(function (t) {
        t !== "default" &&
          !Object.prototype.hasOwnProperty.call(e, t) &&
          Object.defineProperty(e, t, {
            enumerable: !0,
            get: function () {
              return n[t];
            },
          });
      }),
      n
    );
  }
  var rl = { namespace: "wf", pluginId: "core", version: "1.0.0" };
});
var Ce = m((vn) => {
  "use strict";
  Object.defineProperty(vn, "__esModule", { value: !0 });
  function il(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  il(vn, {
    getScrollY: function () {
      return al;
    },
    initScrollCache: function () {
      return sl;
    },
    noop: function () {
      return ol;
    },
  });
  var ol = () => {},
    yn = 0,
    He = 0,
    ye = null;
  function sl() {
    (He += 1),
      ye ||
        ((ye = () => {
          yn = window.scrollY;
        }),
        (yn = window.scrollY),
        window.addEventListener("scroll", ye, { passive: !0 }));
    let n = !1;
    return () => {
      n ||
        ((n = !0),
        (He = Math.max(0, He - 1)),
        He === 0 &&
          ye &&
          (window.removeEventListener("scroll", ye), (ye = null)));
    };
  }
  function al() {
    return yn;
  }
});
var wi = m((Tn) => {
  "use strict";
  Object.defineProperty(Tn, "__esModule", { value: !0 });
  Object.defineProperty(Tn, "TouchScrollGuard", {
    enumerable: !0,
    get: function () {
      return bn;
    },
  });
  var Ti = Ce();
  function ll(n) {
    let e = n;
    for (; e && e !== document.body && e !== document.documentElement; ) {
      if (e instanceof HTMLElement) {
        let t = getComputedStyle(e).overflowY;
        if (
          (t === "auto" || t === "scroll" || t === "overlay") &&
          e.scrollHeight > e.clientHeight
        )
          return e;
      }
      e = e.parentElement;
    }
    return null;
  }
  var bn = class {
    isScrolling = !1;
    toleranceDeg;
    refX = 0;
    refY = 0;
    lastY = 0;
    locked = null;
    effectFromBoundary = !1;
    scroller = null;
    maxScroll = 0;
    constructor(e, t, r) {
      this.toleranceDeg = r?.tolerance ?? 18;
      let o = (0, Ti.initScrollCache)();
      t.addEventListener("abort", o);
      let i = (l) => {
          let c = l.touches[0];
          c &&
            ((this.refX = c.clientX),
            (this.refY = c.clientY),
            (this.lastY = c.clientY),
            (this.locked = null),
            (this.effectFromBoundary = !1),
            (this.isScrolling = !1),
            (this.scroller = ll(l.target ?? e)),
            (this.maxScroll = this.scroller
              ? this.scroller.scrollHeight - this.scroller.clientHeight
              : document.documentElement.scrollHeight - window.innerHeight));
        },
        s = (l) => {
          let c = l.touches[0];
          if (!c) return;
          let u = c.clientY,
            d = c.clientX - this.refX,
            f = u - this.refY,
            p = u > this.lastY,
            g = u < this.lastY,
            h = this.scroller ? this.scroller.scrollTop : (0, Ti.getScrollY)(),
            v = this.maxScroll,
            y = h <= 1 && p,
            E = v > 0 && h >= v - 1 && g;
          this.locked === null && this.decide(d, f, y || E),
            this.locked === "scroll" &&
              (y || E) &&
              ((this.refX = c.clientX),
              (this.refY = u),
              (this.locked = "effect"),
              (this.effectFromBoundary = !0)),
            this.locked === "effect" &&
              this.effectFromBoundary &&
              !(y || E) &&
              ((this.refX = c.clientX),
              (this.refY = u),
              (this.locked = null),
              (this.effectFromBoundary = !1)),
            (this.lastY = u),
            (this.isScrolling =
              this.locked === "scroll" ||
              this.locked === null ||
              (this.locked === "effect" && !l.cancelable && !(y || E))),
            this.locked === "effect" && l.cancelable && l.preventDefault();
        },
        a = () => {
          (this.locked = null), (this.isScrolling = !1);
        };
      e.addEventListener("touchstart", i, { passive: !0, signal: t }),
        e.addEventListener("touchmove", s, { passive: !1, signal: t }),
        e.addEventListener("touchend", a, { passive: !0, signal: t }),
        e.addEventListener("touchcancel", a, { passive: !0, signal: t });
    }
    decide(e, t, r) {
      if (Math.abs(e) < 10 && Math.abs(t) < 10) return;
      Math.atan2(Math.abs(e), Math.abs(t)) * (180 / Math.PI) > this.toleranceDeg
        ? ((this.locked = "effect"), (this.effectFromBoundary = !1))
        : r
        ? ((this.locked = "effect"), (this.effectFromBoundary = !0))
        : (this.locked = "scroll");
    }
  };
});
var Si = m((Sn) => {
  "use strict";
  Object.defineProperty(Sn, "__esModule", { value: !0 });
  Object.defineProperty(Sn, "VelocityController", {
    enumerable: !0,
    get: function () {
      return wn;
    },
  });
  var cl = {
    adaptiveMax: 2800,
    adaptAlpha: 0.05,
    adaptDecay: 0.99,
    hardMin: 600,
    hardMax: 4e3,
  };
  function ul(n, e) {
    let t = Math.max(e.hardMin, Math.min(e.hardMax, n));
    (e.adaptiveMax = Math.max(t, e.adaptiveMax * e.adaptDecay)),
      (e.adaptiveMax += (t - e.adaptiveMax) * e.adaptAlpha),
      (e.adaptiveMax = Math.max(e.hardMin, Math.min(e.hardMax, e.adaptiveMax)));
  }
  var dl = (n) => n * n;
  function fl(n, e, t, r) {
    let o = Math.hypot(n, e);
    ul(o, t);
    let i = Math.max(1, t.adaptiveMax),
      s = dl(Math.min(1, o / i)),
      a = 0,
      l = 0;
    return (
      r.x && r.y
        ? o > 0 && ((a = n / o), (l = e / o))
        : r.x
        ? n !== 0 && (a = Math.sign(n))
        : r.y && e !== 0 && (l = Math.sign(e)),
      { n: s, dirX: a, dirY: l }
    );
  }
  var wn = class {
    config;
    velState;
    lastDirX;
    lastDirY;
    lastNormVelocity;
    get dirX() {
      return this.lastDirX;
    }
    get dirY() {
      return this.lastDirY;
    }
    constructor(e) {
      (this.config = e),
        (this.velState = { ...cl }),
        (this.lastDirX = 0),
        (this.lastDirY = 0),
        (this.lastNormVelocity = 0);
    }
    update(e, t) {
      let {
        n: r,
        dirX: o,
        dirY: i,
      } = fl(e, t, this.velState, this.config.axes);
      (this.lastNormVelocity = r), (this.lastDirX = o), (this.lastDirY = i);
    }
    reset() {
      (this.lastDirX = 0), (this.lastDirY = 0), (this.lastNormVelocity = 0);
    }
    destroy() {
      this.reset();
    }
  };
});
var Ei = m((Cn) => {
  "use strict";
  Object.defineProperty(Cn, "__esModule", { value: !0 });
  Object.defineProperty(Cn, "IntervalController", {
    enumerable: !0,
    get: function () {
      return En;
    },
  });
  var pl = Q(),
    gl = 16,
    En = class {
      config;
      accum;
      lastX;
      lastY;
      initialized;
      cycleIndex;
      destroyed;
      constructor(e) {
        (this.config = e),
          (this.accum = 0),
          (this.lastX = 0),
          (this.lastY = 0),
          (this.initialized = !1),
          (this.cycleIndex = 0),
          (this.destroyed = !1),
          document.addEventListener(
            "visibilitychange",
            () => {
              document.visibilityState === "visible" && this.reset();
            },
            { signal: this.config.signal }
          );
      }
      get isActive() {
        return this.config.distance > 0;
      }
      update(e) {
        if (this.destroyed || !this.isActive) return;
        let { x: t, y: r, velocityFactor: o, dirX: i, dirY: s } = e;
        if (!this.initialized) {
          (this.lastX = t), (this.lastY = r), (this.initialized = !0);
          return;
        }
        let a = t - this.lastX,
          l = r - this.lastY;
        (this.lastX = t), (this.lastY = r);
        let { axes: c, distance: u } = this.config;
        c.x && c.y
          ? (this.accum += Math.hypot(a, l))
          : c.x
          ? (this.accum += Math.abs(a))
          : c.y && (this.accum += Math.abs(l));
        let d = 0;
        for (; this.accum >= u && d < gl; ) {
          this.accum -= u;
          let f = {
            cursorPos: { x: t, y: r },
            velocityFactor: o,
            dirX: i,
            dirY: s,
          };
          this.config.channelManager.fireInterval?.(
            pl.TIMELINE_ROLE_NAMES.INTERVAL,
            {
              targetIndex: this.cycleIndex++,
              element: this.config.element,
              pluginPayload: f,
            }
          ),
            d++;
        }
        this.accum >= u && (this.accum %= u);
      }
      reset() {
        (this.accum = 0), (this.initialized = !1), (this.cycleIndex = 0);
      }
      destroy() {
        (this.destroyed = !0), this.reset();
      }
    };
});
var ze = m((Mn) => {
  "use strict";
  Object.defineProperty(Mn, "__esModule", { value: !0 });
  function hl(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  hl(Mn, {
    TRANSIENT_IX3_CLONE_ATTR: function () {
      return Ci.TRANSIENT_IX3_CLONE_ATTR;
    },
    isTransientIX3Clone: function () {
      return Ci.isTransientIX3Clone;
    },
  });
  var Ci = Q();
});
var ki = m((In) => {
  "use strict";
  Object.defineProperty(In, "__esModule", { value: !0 });
  Object.defineProperty(In, "fireMouseMoveInterval", {
    enumerable: !0,
    get: function () {
      return _l;
    },
  });
  var ml = Q(),
    Pi = ze(),
    An = new Set(["x", "y"]),
    yl = new Set(["scale", "scaleX", "scaleY"]),
    Mi = new WeakMap(),
    Ai = new WeakMap();
  function vl(n) {
    let e = Mi.get(n);
    return (
      e ||
        ((e = {
          activeIntervalEls: new Map(),
          intervalClones: new Set(),
          baselineValues: new Map(),
        }),
        Mi.set(n, e)),
      e
    );
  }
  function bl(n, e, t, r) {
    let o = Ai.get(n);
    o || ((o = new Set()), Ai.set(n, o)),
      !o.has(t) &&
        (o.add(t),
        r(() => {
          let i = e.activeIntervalEls.get(t);
          if (i)
            for (let s of i)
              e.intervalClones.has(s) &&
                (s.isConnected && s.remove(), e.intervalClones.delete(s));
          e.activeIntervalEls.delete(t),
            e.baselineValues.delete(t),
            o.delete(t);
        }));
  }
  function Ii(n) {
    if (n)
      for (let e in n) {
        if (!An.has(e)) continue;
        let t = n[e];
        (typeof t == "string" && (t.startsWith("+=") || t.startsWith("-="))) ||
          ((typeof t == "number" || typeof t == "string") && (n[e] = `+=${t}`));
      }
  }
  var Tl = /^random\((.*)\)([a-z%]*)$/i,
    wl = /^-?\d*\.?\d+$/;
  function Sl(n, e) {
    let t = Tl.exec(n);
    if (!t) return null;
    let r = t[1] ?? "",
      o = t[2] ?? "",
      i = r.startsWith("[") && r.endsWith("]"),
      a = (i ? r.slice(1, -1) : r).split(",").map((c) => c.trim());
    if (!a.every((c) => wl.test(c))) return null;
    let l = a
      .map((c, u) => {
        let d = Number(c);
        return !i && u >= 2 ? Math.abs(e(d) - e(0)) : e(d);
      })
      .join(", ");
    return `random(${i ? `[${l}]` : l})${o}`;
  }
  function Oi(n, e, t, r) {
    if (n)
      for (let o in n) {
        let i = n[o];
        if (typeof i != "number" && typeof i != "string") continue;
        let s = !1,
          a = typeof i == "string" ? i : "";
        typeof i == "string" &&
          (i.startsWith("+=") || i.startsWith("-=")) &&
          ((s = !0), (a = (i.startsWith("-=") ? "-" : "") + i.slice(2)));
        let l, c;
        if (An.has(o)) {
          let p = o === "y" ? r : t;
          (l = (g) => g * e * p), (c = !0);
        } else if (o === "rotation") {
          let p = Math.abs(t) >= Math.abs(r) ? t : -r;
          (l = (g) => g * e * p), (c = s);
        } else
          yl.has(o)
            ? ((l = s ? (p) => p * e : (p) => 1 + (p - 1) * e), (c = s))
            : ((l = (p) => p * e), (c = s));
        if (typeof i == "string" && a.startsWith("random(")) {
          let p = Sl(a, l);
          if (p == null) continue;
          n[o] = c ? `+=${p}` : p;
          continue;
        }
        let u,
          d = "";
        if (typeof i == "number") u = i;
        else {
          if (((u = parseFloat(a)), isNaN(u))) continue;
          d = a.replace(/^-?[\d.]+/, "");
        }
        let f = l(u);
        n[o] = c ? `+=${f}${d}` : f;
      }
  }
  function El(n, e) {
    let t = n.getOneShotTimelineContext(e),
      r = t?.timelineDef;
    if (!t || !r?.actions?.length) return null;
    let o = r.triggerMetadata,
      i = o?.pluginConfig?.type === "mouseMove" ? o.pluginConfig : void 0;
    return o?.role !== "interval" && !i
      ? null
      : {
          oneShot: t,
          mouseMoveMeta: i ?? { type: "mouseMove" },
          axes: o?.axes,
        };
  }
  function Cl(n, e, t, r, o) {
    let i = n.cloneNode(!0);
    i.removeAttribute("style"),
      i.removeAttribute("id"),
      i.removeAttribute("data-w-id"),
      i.setAttribute(Pi.TRANSIENT_IX3_CLONE_ATTR, "true"),
      (i.style.position = "absolute"),
      (i.style.margin = "0"),
      (i.style.pointerEvents = "none"),
      n.insertAdjacentElement("beforebegin", i);
    let s = e.baselineValues.get(o)?.get(n);
    return s && r.set(i, { ...s }), e.intervalClones.add(i), t.add(i), i;
  }
  function Ml(n, e) {
    let t = [],
      r = new Set();
    for (let o of n.timelineDef.actions)
      for (let i in o.properties) {
        let s = n.getActionTweenConfig(o, i, [e]);
        if (s) {
          for (let a of [s.to, s.from])
            if (a)
              for (let l of Object.keys(a)) An.has(l) ? t.push(l) : r.add(l);
        }
      }
    return { clearProps: t, baselineProps: r };
  }
  function Al(n, e, t, r, o) {
    let { clearProps: i, baselineProps: s } = Ml(n, t);
    if (s.size > 0) {
      let a = {};
      for (let c of s) a[c] = e.getProperty(t, c);
      let l = r.baselineValues.get(o);
      l || ((l = new WeakMap()), r.baselineValues.set(o, l)), l.set(t, a);
    }
    i.length !== 0 && e.set(t, { clearProps: i.join(",") });
  }
  function _i(n) {
    if (n)
      for (let e in n) {
        let t = n[e];
        typeof t == "function" &&
          "legacyExpression" in t &&
          (n[e] = t.legacyExpression);
      }
  }
  function Il(n, e, t) {
    return (r, o, i) => {
      _i(i.to),
        _i(i.from),
        (
          o.pluginConfig?.type === "mouseMove"
            ? o.pluginConfig.velocityInfluence
            : !1
        )
          ? n != null && (Oi(i.to, n, e, t), i.from && Oi(i.from, n, e, t))
          : (Ii(i.to), i.from && Ii(i.from));
    };
  }
  function Ol(n, e, t, r, o, i, s, a) {
    let [l] = t;
    if (l && (n.set(l, { zIndex: r + 1 + o }, 0), !(!i || (!s && !a))))
      for (let c of t) {
        let u = c.getBoundingClientRect(),
          d = {};
        if (s) {
          let f = Number(e.getProperty(c, "x")) || 0;
          d.x = i.x - (u.left + u.width / 2 - f);
        }
        if (a) {
          let f = Number(e.getProperty(c, "y")) || 0;
          d.y = i.y - (u.top + u.height / 2 - f);
        }
        n.set(c, d, 0);
      }
  }
  function Ri(n) {
    for (let e of n) e();
    n.clear();
  }
  function xi(n, e, t) {
    n.activeIntervalEls.get(e)?.delete(t),
      n.intervalClones.has(t) &&
        (t.isConnected && t.remove(), n.intervalClones.delete(t));
  }
  var _l = ({
    coordinator: n,
    timelineId: e,
    element: t,
    options: r,
    animation: o,
  }) => {
    if (!o.hasGsap()) return;
    let i = r.targetIndex;
    if (i == null) return;
    let s = El(n, e);
    if (!s) return;
    let { oneShot: a, mouseMoveMeta: l, axes: c } = s,
      u = vl(n),
      d = a
        .getFirstActionTargets(t)
        .filter((B) => !(0, Pi.isTransientIX3Clone)(B));
    if (!d.length) return;
    let f = [d[i % d.length]],
      p = f,
      g = f[0],
      h = u.activeIntervalEls.get(e);
    h || ((h = new Set()), u.activeIntervalEls.set(e, h)),
      h.has(g) ? (p = [Cl(g, u, h, o, e)]) : (Al(a, o, g, u, e), h.add(g));
    let v = p[0],
      y = c?.x === !1 && c?.y === !1,
      E = y || (c?.x ?? l?.setMouseX ?? !0),
      b = y || (c?.y ?? l?.setMouseY ?? !0),
      M = (0, ml.narrowMouseMoveIntervalPayload)(r.pluginPayload),
      w = M.cursorPos,
      T = M.velocityFactor,
      S = M.dirX ?? 0,
      _ = M.dirY ?? 0,
      A = new Set(),
      x = a.buildActionTimeline({
        targets: p,
        cleanupBucket: A,
        varsTransform: Il(T, S, _),
        beforeTweens: (B) => {
          Ol(B, o, p, d.length, i, w, E, b);
        },
      });
    if (!x) {
      Ri(A), xi(u, e, v);
      return;
    }
    let W = null,
      R = !1,
      I = (B) => {
        R || ((R = !0), W?.(), B && x.kill(), Ri(A), xi(u, e, v));
      };
    (W = a.registerCleanup(() => I(!0))),
      x.eventCallback("onComplete", () => {
        I(!1);
      }),
      bl(n, u, e, a.registerCleanup);
  };
});
var Vi = m((Rn) => {
  "use strict";
  Object.defineProperty(Rn, "__esModule", { value: !0 });
  Object.defineProperty(Rn, "buildMouseMove", {
    enumerable: !0,
    get: function () {
      return Vl;
    },
  });
  var ne = Q(),
    Me = Ce(),
    Rl = wi(),
    xl = Si(),
    Pl = Ei(),
    kl = ki(),
    Nl = 50,
    Ni = 50,
    On = null;
  function Fl() {
    return (
      On === null &&
        (On = "ontouchstart" in window || navigator.maxTouchPoints > 0),
      On
    );
  }
  var Di = 0,
    ji = 0,
    We = 0,
    se = null;
  function Ll() {
    (We += 1),
      se ||
        ((se = () => {
          (Di = window.innerWidth), (ji = window.innerHeight);
        }),
        se(),
        window.addEventListener("resize", se));
    let n = !1;
    return () => {
      n ||
        ((n = !0),
        (We = Math.max(0, We - 1)),
        We === 0 &&
          se &&
          (window.removeEventListener("resize", se), (se = null)));
    };
  }
  var Ye = (n) => Math.max(0, Math.min(1, n));
  function Dl(n, e, t) {
    return e === t || n === t || (n < t && e > t) || (n > t && e < t);
  }
  function Ae(n, e, t) {
    let r = n.tween;
    (n.tween = null),
      (n.takeoverTarget = null),
      (n.proxy.value = e),
      (n.lastValue = e),
      n.channel?.setProgress(e),
      t && r?.kill();
  }
  function Fi(n, e) {
    if (n.tween) {
      if (n.proxy.value === e) {
        Ae(n, e, !0);
        return;
      }
      let t = n.tweenTarget - n.proxy.value,
        r = e - n.proxy.value;
      if (t * r < 0) {
        Ae(n, e, !0);
        return;
      }
      n.takeoverTarget = e;
      return;
    }
    (n.proxy.value = e), (n.lastValue = e), n.channel?.setProgress(e);
  }
  function _n(n) {
    let e = n.tween;
    (n.tween = null), (n.takeoverTarget = null), e?.kill();
  }
  function Li(n, e, t, r) {
    _n(e), (e.lastValue = e.proxy.value), (e.tweenTarget = t);
    let o = n.to(e.proxy, {
      value: t,
      duration: r,
      ease: "power2.out",
      onUpdate: () => {
        let i = e.proxy.value,
          s = e.takeoverTarget;
        if (s != null && Dl(e.lastValue, i, s)) {
          Ae(e, s, !0);
          return;
        }
        (e.lastValue = i), e.channel?.setImmediate(i);
      },
      onComplete: () => {
        let i = e.takeoverTarget;
        (e.tween = null), (e.takeoverTarget = null), i != null && Ae(e, i, !1);
      },
    });
    if (!o) {
      Ae(e, t, !1);
      return;
    }
    e.tween = o;
  }
  function jl(n, e, t, r) {
    let o = Math.abs(t - n),
      i = Math.abs(r - e),
      s = Math.max(o, i);
    return 0.1 + Math.min(s / 0.5, 1) * 0.5;
  }
  function Vl(n) {
    n.addTrigger("mouse-move", (e, t, r, o) => {
      let i = e[1].pluginConfig,
        s = e[2]?.[0] === ne.IX3_WF_EXTENSION_KEYS.VIEWPORT;
      return (
        o({
          type: "continuous",
          setup: (a) => {
            let { animation: l } = a;
            if (!l.hasGsap() || !l.hasObserver()) return Me.noop;
            let c = s ? Ll() : Me.noop;
            a.registerIntervalHandler(
              ne.IX3_WF_EXTENSION_KEYS.MOUSE_MOVE,
              kl.fireMouseMoveInterval
            );
            let u = i?.smoothness ?? Nl,
              d = (i?.restingState?.x ?? Ni) / 100,
              f = (i?.restingState?.y ?? Ni) / 100,
              p = a.registerChannel({
                role: ne.TIMELINE_ROLE_NAMES.MOUSE_X,
                initialValue: d,
                element: t,
                smoothing: u,
              }),
              g = a.registerChannel({
                role: ne.TIMELINE_ROLE_NAMES.MOUSE_Y,
                initialValue: f,
                element: t,
                smoothing: u,
              }),
              h = new AbortController(),
              { signal: v } = h,
              y = a.getMetadata(ne.TIMELINE_ROLE_NAMES.INTERVAL),
              E = {
                x: y?.axes?.x !== !1 || y?.axes?.y === !1,
                y: y?.axes?.y !== !1 || y?.axes?.x === !1,
              },
              b = y
                ? new Pl.IntervalController({
                    distance:
                      y.distance ?? ne.DEFAULT_MOUSE_MOVE_INTERVAL_DISTANCE,
                    axes: E,
                    channelManager: a,
                    element: t,
                    signal: v,
                  })
                : null,
              M = b ? new xl.VelocityController({ axes: E }) : null,
              w = {
                proxy: { value: d },
                channel: p,
                tween: null,
                takeoverTarget: null,
                lastValue: d,
                tweenTarget: d,
              },
              T = {
                proxy: { value: f },
                channel: g,
                tween: null,
                takeoverTarget: null,
                lastValue: f,
                tweenTarget: f,
              },
              S = !1,
              _ = (N, $) => {
                let G = jl(w.proxy.value, T.proxy.value, N, $);
                Li(l, w, N, G), Li(l, T, $, G);
              },
              A = Fl(),
              x = s ? document.documentElement : t,
              W = null;
            A && (W = new Rl.TouchScrollGuard(x, v));
            let R = null,
              I = () => {
                R = null;
              },
              B = () => (R || (R = t.getBoundingClientRect()), R);
            if (!s) {
              let N = new ResizeObserver(I);
              N.observe(t),
                v.addEventListener("abort", () => N.disconnect()),
                window.addEventListener("scroll", I, {
                  passive: !0,
                  capture: !0,
                  signal: v,
                }),
                window.visualViewport &&
                  window.visualViewport.addEventListener("resize", I, {
                    signal: v,
                  });
            }
            let ee;
            try {
              if (
                ((ee = l.createObserver({
                  target: x,
                  type: A ? "pointer,touch" : "pointer",
                  tolerance: 0,
                  onMove: (N) => {
                    if (W?.isScrolling || !a.isPreviewEnabled()) return;
                    let $ = N.x ?? 0,
                      G = N.y ?? 0,
                      H,
                      ue;
                    if (s)
                      (H = Ye($ / Math.max(1, Di))),
                        (ue = Ye(G / Math.max(1, ji)));
                    else {
                      let Z = B();
                      (H = Ye(($ - Z.left) / Math.max(1, Z.width))),
                        (ue = Ye((G - Z.top) / Math.max(1, Z.height)));
                    }
                    S ? (Fi(w, H), Fi(T, ue)) : ((S = !0), _(H, ue)),
                      a.publishChannel(
                        ne.MOUSE_MOVE_CHANNELS.POSITION,
                        { x: $, y: G, triggerEl: t, isViewport: s },
                        t
                      ),
                      M &&
                        (M.update(N.velocityX, N.velocityY),
                        b.update({
                          x: $,
                          y: G,
                          velocityFactor: M.lastNormVelocity,
                          dirX: M.dirX,
                          dirY: M.dirY,
                        }));
                  },
                })),
                !ee)
              )
                return b?.destroy(), M?.destroy(), h.abort(), c(), Me.noop;
            } catch {
              return b?.destroy(), M?.destroy(), h.abort(), c(), Me.noop;
            }
            let q = () => {
              a.isPreviewEnabled() &&
                ((S = !1),
                _(d, f),
                M?.reset(),
                a.publishChannel(ne.MOUSE_MOVE_CHANNELS.LEAVE, void 0, t),
                b?.reset());
            };
            return (
              s
                ? (x.addEventListener("mouseleave", q, { signal: v }),
                  window.addEventListener("blur", q, { signal: v }))
                : t.addEventListener("mouseleave", q, { signal: v }),
              x.addEventListener("touchend", q, { signal: v, passive: !0 }),
              x.addEventListener("touchcancel", q, { signal: v, passive: !0 }),
              () => {
                ee.kill(),
                  h.abort(),
                  _n(w),
                  _n(T),
                  b?.destroy(),
                  M?.destroy(),
                  c();
              }
            );
          },
        }),
        Me.noop
      );
    });
  }
});
var qi = m((xn) => {
  "use strict";
  Object.defineProperty(xn, "__esModule", { value: !0 });
  Object.defineProperty(xn, "build", {
    enumerable: !0,
    get: function () {
      return Ul;
    },
  });
  var Bi = Q(),
    Ie = Ce(),
    Bl = Vi();
  function Ul(n) {
    ql(n),
      $l(n),
      (0, Bl.buildMouseMove)(n),
      Gl(n),
      Hl(n),
      n.addTrigger("load", (e, t, r, o) => {
        let i = e[1],
          s = !1,
          a = () => {
            s || ((s = !0), o({ target: t }));
          };
        switch (i.pluginConfig?.triggerPoint) {
          case "immediate":
            return a(), Ie.noop;
          case "fullyLoaded":
            return document.readyState === "complete"
              ? (a(), Ie.noop)
              : r.addEventListener(window, "load", a);
          case "DOMContentLoaded":
          default:
            return document.readyState === "complete" ||
              document.readyState === "interactive"
              ? (a(), Ie.noop)
              : r.addEventListener(document, "DOMContentLoaded", a);
        }
      }),
      n.addTrigger("focus", (e, t, r, o) => {
        let i = e[1];
        return r.addEventListener(
          t,
          i.pluginConfig?.useFocusWithin ? "focusin" : "focus",
          o,
          { delegate: !i.pluginConfig?.useFocusWithin }
        );
      }),
      n.addTrigger("blur", (e, t, r, o) => {
        let i = e[1];
        return r.addEventListener(
          t,
          i.pluginConfig?.useFocusWithin ? "focusout" : "blur",
          o,
          { delegate: !i.pluginConfig?.useFocusWithin }
        );
      }),
      n.addTrigger("scroll", (e, t, r, o) => (o({ target: t }), Ie.noop)),
      n.addTrigger("custom", (e, t, r, o) => {
        let s = e[1].pluginConfig?.eventName;
        return s
          ? r.addEventListener(t, s, o, { delegate: !1, kind: "custom" })
          : Ie.noop;
      }),
      n.addTrigger("change", (e, t, r, o) =>
        r.addEventListener(t, "change", o)
      );
  }
  function ql(n) {
    let e = new WeakMap();
    n.addTrigger("click", (t, r, o, i) => {
      let [, s] = t,
        a = o.addEventListener(
          r,
          "click",
          (l) => {
            let c = s.pluginConfig?.click,
              u = e.get(r) || new WeakMap();
            e.set(r, u);
            let f = (u.get(t) || 0) + 1;
            switch ((u.set(t, f), c)) {
              case "each": {
                i(l);
                break;
              }
              case "first": {
                f === 1 && i(l);
                break;
              }
              case "second": {
                f === 2 && i(l);
                break;
              }
              case "odd": {
                f % 2 === 1 && i(l);
                break;
              }
              case "even": {
                f % 2 === 0 && i(l);
                break;
              }
              case "custom": {
                let p = s.pluginConfig?.custom;
                p && f === p && i(l);
                break;
              }
              default:
                i(l);
            }
          },
          { delegate: !0 }
        );
      return () => {
        a(), e.delete(r);
      };
    });
  }
  function $l(n) {
    let e = new WeakMap();
    n.addTrigger("hover", (t, r, o, i) => {
      let [, s] = t,
        a = [],
        l = s.pluginConfig?.multiTimeline,
        c = s.pluginConfig?.eventMode,
        u = c !== "leave",
        d = c !== "enter";
      if (l === !0)
        return (
          u &&
            a.push(
              o.addEventListener(r, "mouseenter", () =>
                i({
                  type: "timeline-role",
                  role: Bi.TIMELINE_ROLE_NAMES.MOUSE_ENTER,
                })
              )
            ),
          d &&
            a.push(
              o.addEventListener(r, "mouseleave", () =>
                i({
                  type: "timeline-role",
                  role: Bi.TIMELINE_ROLE_NAMES.MOUSE_LEAVE,
                })
              )
            ),
          () => {
            a.forEach((p) => p()), (a.length = 0);
          }
        );
      if (l === !1) {
        if (
          s.control === void 0 ||
          s.control === "togglePlayReverse" ||
          s.control === "togglePlayReverseFlipEase"
        ) {
          let g =
            s.control === "togglePlayReverseFlipEase"
              ? "reverseFlipEase"
              : "reverse";
          if (
            (u &&
              a.push(
                o.addEventListener(r, "mouseenter", () =>
                  i({ type: "playback-control", control: "play" })
                )
              ),
            d)
          ) {
            let h = u ? g : "play";
            a.push(
              o.addEventListener(r, "mouseleave", () =>
                i({ type: "playback-control", control: h })
              )
            );
          }
        } else
          u && a.push(o.addEventListener(r, "mouseenter", (g) => i(g))),
            d && a.push(o.addEventListener(r, "mouseleave", (g) => i(g)));
        return () => {
          a.forEach((g) => g()), (a.length = 0);
        };
      }
      let f = (p, g) => {
        if ((s.pluginConfig?.type ?? "mouseenter") !== g) return;
        let v = s.pluginConfig?.hover || "each",
          y = e.get(r) || new Map();
        e.set(r, y);
        let b = (y.get(g) || 0) + 1;
        switch ((y.set(g, b), v)) {
          case "each": {
            i(p);
            break;
          }
          case "first": {
            b === 1 && i(p);
            break;
          }
          case "second": {
            b === 2 && i(p);
            break;
          }
          case "odd": {
            b % 2 === 1 && i(p);
            break;
          }
          case "even": {
            b % 2 === 0 && i(p);
            break;
          }
          case "custom": {
            let M = s.pluginConfig?.custom;
            M && b === M && i(p);
            break;
          }
          default:
            i(p);
        }
      };
      return (
        a.push(
          o.addEventListener(r, "mouseenter", (p) => {
            f(p, "mouseenter");
          })
        ),
        a.push(
          o.addEventListener(r, "mouseover", (p) => {
            f(p, "mouseover");
          })
        ),
        a.push(
          o.addEventListener(r, "mouseleave", (p) => {
            f(p, "mouseleave");
          })
        ),
        () => {
          a.forEach((p) => p()), (a.length = 0), e.delete(r);
        }
      );
    });
  }
  function Ui(n, e) {
    n.addTrigger(e, (t, r, o, i) => {
      let s = t[1].pluginConfig?.event,
        a = "IX3_COMPONENT_STATE_CHANGE";
      return o.addEventListener(r, a, (l) => {
        let c = l.detail;
        if (!c || typeof c != "object") return;
        let { component: u, state: d } = c;
        u !== e ||
          !d ||
          (s && d !== s) ||
          i({ type: "timeline-role", role: d });
      });
    });
  }
  function Gl(n) {
    Ui(n, "navbar");
  }
  function Hl(n) {
    Ui(n, "dropdown");
  }
});
var ve = m((Pn) => {
  "use strict";
  Object.defineProperty(Pn, "__esModule", { value: !0 });
  function zl(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  zl(Pn, {
    resolveToNumber: function () {
      return Wl;
    },
    resolveToString: function () {
      return Yl;
    },
  });
  function Wl(n, e) {
    if (typeof n == "number") return n;
    if (typeof n == "string") {
      let t = n;
      if (t.startsWith("var(")) {
        let o = t.slice(4, -1).split(",")[0]?.trim() ?? "";
        if (!o || ((t = getComputedStyle(e).getPropertyValue(o).trim()), !t))
          return;
      }
      let r = parseFloat(t);
      return isNaN(r) ? void 0 : r;
    }
  }
  function Yl(n, e) {
    if (typeof n == "string") {
      if (n.startsWith("var(")) {
        let t = n.slice(4, -1).split(",")[0]?.trim() ?? "";
        return (t && getComputedStyle(e).getPropertyValue(t).trim()) || void 0;
      }
      return n;
    }
  }
});
var zi = m((Fn) => {
  "use strict";
  Object.defineProperty(Fn, "__esModule", { value: !0 });
  function Xl(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Xl(Fn, {
    buildMouseFollowAction: function () {
      return tc;
    },
    forTestSuite: function () {
      return Jl;
    },
  });
  var kn = Q(),
    Xe = Ce(),
    Zl = 0.5,
    Ze = 50;
  function Ql(n) {
    let e = 2166136261;
    for (let t = 0; t < n.length; t++)
      (e ^= n.charCodeAt(t)), (e = Math.imul(e, 16777619));
    return e >>> 0;
  }
  function Kl(n) {
    let e = n >>> 0;
    return () => {
      e = (e + 1831565813) | 0;
      let t = Math.imul(e ^ (e >>> 15), 1 | e);
      return (
        (t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)),
        ((t ^ (t >>> 14)) >>> 0) / 4294967296
      );
    };
  }
  function $i(n, e, t) {
    if (n <= 1) return [0];
    if (typeof e == "number") {
      let r = Math.max(0, Math.min(n - 1, Math.floor(e))),
        o = [r];
      for (let i = 1; o.length < n; i++)
        r + i < n && o.push(r + i), r - i >= 0 && o.push(r - i);
      return o;
    }
    switch (e) {
      case "start":
        return Array.from({ length: n }, (r, o) => o);
      case "center": {
        let r = [],
          o = Math.floor((n - 1) / 2);
        r.push(o);
        for (let i = 1; r.length < n; i++)
          o + i < n && r.push(o + i), o - i >= 0 && r.push(o - i);
        return r;
      }
      case "random": {
        let r = t != null && t !== "" ? Kl(Ql(t)) : Math.random,
          o = Array.from({ length: n }, (i, s) => s);
        for (let i = n - 1; i > 0; i--) {
          let s = Math.floor(r() * (i + 1));
          [o[i], o[s]] = [o[s], o[i]];
        }
        return o;
      }
      case "edges": {
        let r = [],
          o = 0,
          i = n - 1;
        for (; o <= i; ) r.push(o), o !== i && r.push(i), o++, i--;
        return r;
      }
      case "end":
      default:
        return Array.from({ length: n }, (r, o) => n - 1 - o);
    }
  }
  function Nn(n) {
    if (n == null) return Ze;
    let e = typeof n == "number" ? n * 1e3 : parseFloat(n);
    return Number.isFinite(e) && e >= 0 ? e : Ze;
  }
  var Oe = (n) => {
      if (typeof n != "string") return 0.5;
      let e = /^(-?\d+(?:\.\d+)?)%$/.exec(n.trim());
      if (e) return Math.max(0, Math.min(1, parseFloat(e[1]) / 100));
      let t = n.trim().toLowerCase();
      return t === "left" || t === "top"
        ? 0
        : t === "right" || t === "bottom"
        ? 1
        : 0.5;
    },
    Gi = (n, e) => {
      if (n?.amount != null) {
        let t = Nn(n.amount),
          r = e > 1 ? t / (e - 1) : Ze;
        return Math.max(1, r);
      }
      return n?.each != null ? Math.max(1, Nn(n.each)) : 1;
    },
    Hi = (n) => {
      if (!n) return { x: 0.5, y: 0.5 };
      if (typeof n == "string") {
        let [e, t] = n.trim().split(/\s+/);
        return { x: Oe(e ?? "50%"), y: Oe(t ?? "50%") };
      }
      return { x: Oe(n.x), y: Oe(n.y) };
    },
    Jl = {
      DEFAULT_STAGGER_MS: Ze,
      computeMouseFollowSmoothingMs: Gi,
      getChainOrder: $i,
      parseAnchor: Hi,
      parseAnchorAxis: Oe,
      staggerEachToMs: Nn,
    };
  function ec(n, e, t, r) {
    if (!t.length) return;
    let o = r?.animation;
    if (!o?.hasGsap()) return;
    let i =
        typeof window < "u" &&
        typeof window.matchMedia == "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      s = e,
      a = s?.leaveBehavior ?? "return",
      l = s?.onEnter ?? "animate",
      c = r?.timelineRole,
      u = c === "mouseX" ? "x" : c === "mouseY" ? "y" : s?.axis ?? "x",
      d = u,
      f = s?.followMode;
    if (
      f != null &&
      f !== "full" &&
      f !== (0, kn.getSingleAxisMouseFollowMode)(u)
    )
      return;
    let p = Hi(s?.anchor),
      g = u === "x" ? p.x : p.y,
      h = t.map((C) => o.getProperty(C, d)),
      v = t.map((C) => o.quickSetter(C, d, "px"));
    if (v.some((C) => C == null)) return;
    let y = v,
      E = (0, Xe.initScrollCache)(),
      b = t.map((C) => {
        let O = C.getBoundingClientRect();
        return u === "x"
          ? O.left + O.width * g
          : O.top + O.height * g + (0, Xe.getScrollY)();
      }),
      M = n.timing?.stagger,
      w = t.length,
      T = Gi(M, w),
      S = M?.from,
      A = $i(
        w,
        typeof S == "number" ||
          S === "start" ||
          S === "center" ||
          S === "edges" ||
          S === "end" ||
          S === "random"
          ? S
          : "end",
        s?.groupId ?? s?.syncedActionId
      );
    if (A.length === 0) return;
    let x = new Float64Array(w),
      W = A[0],
      R = { value: b[W] ?? 0 },
      I = null,
      B = !1,
      ee = 0,
      q = null,
      N = !1,
      $ = null,
      G = performance.now(),
      H = 0,
      ue = () => {
        let C = performance.now(),
          O = Math.min(C - G, 100);
        G = C;
        let V = 1 - Math.exp(-O / T),
          F = !1;
        for (let L = 0; L < A.length; L++) {
          let k = A[L],
            de;
          if (L === 0) de = R.value;
          else {
            let Nr = A[L - 1];
            de = b[Nr] + x[Nr];
          }
          let kr = de - b[k],
            dt = kr - x[k];
          Math.abs(dt) > Zl
            ? ((x[k] = x[k] + dt * V), y[k](x[k]), (F = !0))
            : dt !== 0 && ((x[k] = kr), y[k](x[k]));
        }
        I?.isActive() && (F = !0), F || Z();
      },
      Z = () => {
        N && ($?.(), ($ = null), (N = !1));
      },
      xr = (C) => {
        I?.kill(), (I = null), (H = 0), (R.value = C);
        for (let O = 0; O < A.length; O++) {
          let V = A[O],
            F = C - b[V];
          (x[V] = F), y[V](F);
        }
        Z();
      },
      Ko = () => {
        I?.kill(), (I = null), (H = 0), (R.value = b[W] ?? 0);
        for (let C = 0; C < A.length; C++) {
          let O = A[C];
          (x[O] = 0), y[O](0);
        }
        Z();
      },
      te = () => {
        N || ((G = performance.now()), ($ = o.addTicker(ue)), (N = !0));
      },
      Jo = (C, O) => {
        (q = C),
          (ee = O
            ? u === "x"
              ? window.innerWidth
              : window.innerHeight
            : u === "x"
            ? C.offsetWidth
            : C.offsetHeight);
      },
      es = (C) => {
        q || Jo(C.triggerEl, C.isViewport);
        let O = u === "x" ? C.x : C.y + (0, Xe.getScrollY)();
        if (i) {
          (B = !0), xr(O);
          return;
        }
        if (B)
          if (I) {
            let V = Math.max(H - performance.now(), 50);
            I.kill();
            let F = o.to(R, {
              value: O,
              duration: V / 1e3,
              ease: "power2.out",
              onUpdate: te,
              onComplete: () => {
                I === F && ((I = null), (H = 0));
              },
            });
            if (!F) {
              (R.value = O), te();
              return;
            }
            I = F;
          } else R.value = O;
        else {
          if (((B = !0), l === "snap")) {
            xr(O);
            return;
          }
          let V = Math.abs(O - R.value),
            L = 0.1 + Math.min(V / (ee || 1), 1) * 0.5;
          (H = performance.now() + L * 1e3), I?.kill();
          let k = o.to(R, {
            value: O,
            duration: L,
            ease: "power2.out",
            onUpdate: te,
            onComplete: () => {
              I === k && ((I = null), (H = 0));
            },
          });
          if (!k) {
            (R.value = O), te();
            return;
          }
          I = k;
        }
        te();
      },
      ts = () => {
        if (((B = !1), a === "stay")) {
          te();
          return;
        }
        if (i) {
          Ko();
          return;
        }
        let C = b[W] ?? 0,
          O = Math.abs(R.value - C),
          F = 0.1 + Math.min(O / (ee || 1), 1) * 0.5;
        I?.kill();
        let L = o.to(R, {
          value: C,
          duration: F,
          ease: "power2.out",
          onUpdate: te,
          onComplete: () => {
            I === L && (I = null);
          },
        });
        if (!L) {
          (R.value = C), te();
          return;
        }
        I = L;
      },
      ns = r?.subscribeChannel?.(kn.MOUSE_MOVE_CHANNELS.POSITION, es),
      rs = r?.subscribeChannel?.(kn.MOUSE_MOVE_CHANNELS.LEAVE, ts),
      Pr = new AbortController(),
      { signal: is } = Pr,
      ut = 0,
      os = () => {
        clearTimeout(ut),
          (ut = window.setTimeout(() => {
            q && (ee = u === "x" ? q.offsetWidth : q.offsetHeight);
            for (let C = 0; C < t.length; C++) {
              let O = t[C],
                V = o.getProperty(O, d),
                F = typeof V == "number" ? V : parseFloat(String(V)),
                L = Number.isFinite(F) ? F : 0,
                k = O.getBoundingClientRect(),
                de = u === "x" ? k.left + k.width * g : k.top + k.height * g;
              (b[C] = u === "x" ? de - L : de - L + (0, Xe.getScrollY)()),
                (x[C] = L);
            }
            if (!B) {
              let C = b[W];
              C !== void 0 &&
                (I?.isActive() && (I.kill(), (I = null)), (R.value = C));
            }
          }, 250));
      };
    return (
      window.addEventListener("resize", os, { signal: is }),
      () => {
        I?.kill(), Z(), clearTimeout(ut), Pr.abort(), ns?.(), rs?.(), E();
        for (let C = 0; C < t.length; C++) o.set(t[C], { [d]: h[C] });
      }
    );
  }
  function tc(n) {
    n.addAction("mouse-follow", {
      requiresTriggerElementContext: !0,
      createCustomTween: (e, t, r, o, i, s, a) => ec(t, r, i, a),
    });
  }
});
var Zi = m((jn) => {
  "use strict";
  Object.defineProperty(jn, "__esModule", { value: !0 });
  function nc(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  nc(jn, {
    applyAdditive: function () {
      return lc;
    },
    formatRandom: function () {
      return Dn;
    },
    formatRandomArray: function () {
      return Yi;
    },
    isAdditiveValue: function () {
      return rc;
    },
    isRandomArrayValue: function () {
      return ic;
    },
    isRandomValue: function () {
      return Ln;
    },
    makeClamp: function () {
      return cc;
    },
    makeRandomArrayPicker: function () {
      return ac;
    },
    makeRandomPicker: function () {
      return sc;
    },
  });
  function Ln(n) {
    if (typeof n != "object" || n === null) return !1;
    let e = n;
    return (
      e.type === "ix3-random" &&
      typeof e.min == "number" &&
      typeof e.max == "number" &&
      (e.step === void 0 || typeof e.step == "number") &&
      (e.unit === void 0 || typeof e.unit == "string")
    );
  }
  function rc(n) {
    if (typeof n != "object" || n === null) return !1;
    let e = n;
    return (
      e.type === "ix3-additive" &&
      (typeof e.value == "number" || Ln(e.value)) &&
      (e.unit === void 0 || typeof e.unit == "string")
    );
  }
  function ic(n) {
    if (typeof n != "object" || n === null) return !1;
    let e = n;
    return (
      e.type === "ix3-random-array" &&
      Array.isArray(e.values) &&
      e.values.every((t) => typeof t == "number" || typeof t == "string") &&
      (e.unit === void 0 || typeof e.unit == "string")
    );
  }
  function Dn(n, e) {
    let t = n.unit ?? e ?? "",
      r = n.step != null ? `, ${n.step}` : "";
    return `random(${n.min}, ${n.max}${r})${t}`;
  }
  function Yi(n, e) {
    let t = n.unit ?? e ?? "";
    return `random([${n.values.join(", ")}])${t}`;
  }
  function Wi(n) {
    let [e = "", t] = String(n).split("e"),
      r = (e.split(".")[1] || "").length;
    return t === void 0 ? r : Math.max(0, r - Number(t));
  }
  function oc(n, e) {
    if (n <= 1) return 0;
    if (e === void 0) return Math.floor(Math.random() * n);
    let t = Math.floor(Math.random() * (n - 1));
    return t < e ? t : t + 1;
  }
  function Xi(n, e, t) {
    let r = new WeakMap(),
      o = (i, s) => {
        let a = oc(n, r.get(s));
        return r.set(s, a), e(a);
      };
    return (o.legacyExpression = t), o;
  }
  function sc(n) {
    let e = n.unit ?? "",
      t = (u) => (e ? `${u}${e}` : u),
      r = Dn(n);
    if (!n.step) {
      let { min: u, max: d } = n,
        f = (p, g) => t(u + Math.random() * (d - u));
      return (f.legacyExpression = r), f;
    }
    let o = Math.abs(n.step),
      i = Math.min(n.min, n.max),
      s = Math.max(n.min, n.max),
      a = Math.round((s - i) / o),
      l = Math.max(Wi(i), Wi(o)),
      c = 10 ** l;
    return Xi(
      a + 1,
      (u) => {
        let d = i + u * o,
          f = l ? Math.round(d * c) / c : d;
        return t(Math.min(s, Math.max(i, f)));
      },
      r
    );
  }
  function ac(n) {
    let e = n.unit ?? "",
      t = [...new Set(n.values)];
    return Xi(
      t.length,
      (r) => {
        let o = t[r] ?? 0;
        return typeof o == "number" && e ? `${o}${e}` : o;
      },
      Yi(n)
    );
  }
  function lc(n, e) {
    let t = n.unit ?? e ?? "";
    return Ln(n.value) ? `+=${Dn(n.value, t)}` : `+=${n.value}${t}`;
  }
  function cc(n, e) {
    let t = (r) => (r < n ? n : r > e ? e : r);
    return (r) => {
      if (typeof r == "number") return t(r);
      let o = parseFloat(r);
      if (Number.isNaN(o)) return r;
      let i = t(o);
      return i === o
        ? r
        : `${i}${r.replace(/^\s*[+-]?[\d.]+(?:e[+-]?\d+)?/i, "")}`;
    };
  }
});
var eo = m((Vn) => {
  "use strict";
  Object.defineProperty(Vn, "__esModule", { value: !0 });
  Object.defineProperty(Vn, "build", {
    enumerable: !0,
    get: function () {
      return gc;
    },
  });
  var _e = ve(),
    uc = zi(),
    P = Zi();
  function Qi(n, e) {
    return e != null && typeof n == "string" && n.startsWith("var(")
      ? (0, _e.resolveToString)(n, e) ?? n
      : n;
  }
  var Ki = new Set(["opacity", "autoAlpha"]),
    dc = new Set(["scale", "scaleX", "scaleY", "z", "transformPerspective"]),
    fc = new Set(["xPercent", "yPercent"]),
    Ji = new Set(["width", "height"]);
  function Qe(n) {
    return n.startsWith("+=") || n.startsWith("-=") || n.startsWith("random(");
  }
  function pc(n) {
    if (Ki.has(n)) return (0, P.makeClamp)(0, 1);
    if (dc.has(n) || Ji.has(n)) return (0, P.makeClamp)(0, Number.MAX_VALUE);
  }
  function Ke(n) {
    return (
      (0, P.isRandomValue)(n) ||
      (0, P.isAdditiveValue)(n) ||
      (0, P.isRandomArrayValue)(n)
    );
  }
  function Je(n, e) {
    let t = Ki.has(n) ? 100 : 1,
      r = t !== 1 || fc.has(n),
      o = (i) => ({
        type: "ix3-random",
        min: i.min / t,
        max: i.max / t,
        step: i.step != null ? i.step / t : void 0,
      });
    if ((0, P.isRandomArrayValue)(e)) {
      let i = r
        ? {
            type: "ix3-random-array",
            values: e.values.map((s) => (typeof s == "number" ? s / t : s)),
          }
        : e;
      return (0, P.makeRandomArrayPicker)(i);
    }
    if ((0, P.isRandomValue)(e)) return (0, P.makeRandomPicker)(r ? o(e) : e);
    if (r) {
      let i = (0, P.isRandomValue)(e.value) ? o(e.value) : e.value / t;
      return (0, P.applyAdditive)({ type: "ix3-additive", value: i });
    }
    return (0, P.applyAdditive)(e);
  }
  function gc(n) {
    (0, uc.buildMouseFollowAction)(n),
      n
        .addAction("class", {
          createCustomTween: (e, t, r, o, i, s) => {
            let a = r.class,
              l = a?.selectors || [],
              c = a?.operation,
              u = l
                ? i.map((f) => ({ element: f, classList: [...f.classList] }))
                : [],
              d = () => {
                if (!(!c || !l))
                  for (let f of i)
                    c === "addClass"
                      ? l.forEach((p) => f.classList.add(p))
                      : c === "removeClass"
                      ? l.forEach((p) => f.classList.remove(p))
                      : c === "toggleClass" &&
                        l.forEach((p) => f.classList.toggle(p));
              };
            return (
              e.to(
                {},
                { duration: 0.001, onComplete: d, onReverseComplete: d },
                !s || s === 0 ? 0.001 : s
              ),
              () => {
                if (l) {
                  for (let f of u)
                    if (
                      f.element &&
                      (f.element instanceof HTMLElement &&
                        (f.element.className = ""),
                      f.element.classList)
                    )
                      for (let p of f.classList) f.element.classList.add(p);
                }
              }
            );
          },
        })
        .addAction("style", {
          createTweenConfig: (e, t) => {
            let r = { to: {}, from: {} },
              o = t?.[0];
            for (let i in e) {
              let s = e[i],
                a = Array.isArray(s) ? s[1] : s,
                l = Array.isArray(s) ? s[0] : void 0,
                c = Ke(a) ? Je(i, a) : Qi(a, o),
                u = Ke(l) ? Je(i, l) : l !== void 0 ? Qi(l, o) : void 0;
              c != null && (r.to[i] = c),
                u != null && !(0, P.isAdditiveValue)(a) && (r.from[i] = u),
                Ji.has(i) &&
                  (Ke(a) || Ke(l)) &&
                  (r.modifiers || (r.modifiers = {}),
                  (r.modifiers[i] = (0, P.makeClamp)(0, Number.MAX_VALUE)));
            }
            return r;
          },
        })
        .addAction("transform", {
          createTweenConfig: (e, t) => {
            let r = { to: {}, from: {} },
              o = t?.[0];
            for (let i in e) {
              let s = e[i],
                a = Array.isArray(s) ? s[1] : s,
                l = Array.isArray(s) ? s[0] : void 0,
                c = (0, P.isAdditiveValue)(a),
                u =
                  (0, P.isRandomValue)(a) || (0, P.isRandomArrayValue)(a) || c,
                d =
                  (0, P.isRandomValue)(l) ||
                  (0, P.isRandomArrayValue)(l) ||
                  (0, P.isAdditiveValue)(l);
              if (u || d) {
                let f = pc(i);
                f &&
                  (r.modifiers || (r.modifiers = {}),
                  (r.modifiers[i] = f),
                  i === "autoAlpha" && (r.modifiers.opacity = f),
                  i === "scale" &&
                    ((r.modifiers.scaleX = f), (r.modifiers.scaleY = f))),
                  u && (a = Je(i, a)),
                  d && (l = Je(i, l));
              }
              switch (i) {
                case "autoAlpha":
                case "opacity": {
                  if (a != null && typeof a == "string" && !Qe(a)) {
                    let f = o ? (0, _e.resolveToNumber)(a, o) : parseFloat(a);
                    a = f !== void 0 ? f / 100 : a;
                  }
                  if (l != null && typeof l == "string" && !Qe(l)) {
                    let f = o ? (0, _e.resolveToNumber)(l, o) : parseFloat(l);
                    l = f !== void 0 ? f / 100 : l;
                  }
                  break;
                }
                case "transformOrigin": {
                  typeof s == "string"
                    ? ((a = a || s), (l = a))
                    : typeof l == "string"
                    ? (a = l)
                    : typeof a == "string" && (l = a);
                  break;
                }
                case "xPercent":
                case "yPercent": {
                  if (a != null && typeof a == "string" && !Qe(a)) {
                    let f = o ? (0, _e.resolveToNumber)(a, o) : parseFloat(a);
                    a = f !== void 0 ? f : a;
                  }
                  if (l != null && typeof l == "string" && !Qe(l)) {
                    let f = o ? (0, _e.resolveToNumber)(l, o) : parseFloat(l);
                    l = f !== void 0 ? f : l;
                  }
                  break;
                }
              }
              a != null && (r.to[i] = a), l != null && !c && (r.from[i] = l);
            }
            return r;
          },
        });
  }
});
var ro = m((Bn) => {
  "use strict";
  Object.defineProperty(Bn, "__esModule", { value: !0 });
  Object.defineProperty(Bn, "buildLottieAction", {
    enumerable: !0,
    get: function () {
      return mc;
    },
  });
  var hc = ve();
  function mc(n) {
    n.addAction("lottie", {
      createCustomTween: (e, t, r, o, i, s) => {
        let a = r.lottie;
        if (!a || !i.length || !window.Webflow) return;
        let l = window.Webflow.require?.("lottie");
        if (!l) return;
        let c = [],
          u = !1;
        for (let d of i) {
          let f = no(a.from, d, to.FROM),
            p = no(a.to, d, to.TO),
            g = l.createInstance(d);
          if (!g) continue;
          c.push(g);
          let h = () => {
            if (u) return;
            let v = g.frames,
              y = Math.round(f * v),
              E = Math.round(p * v);
            g.gsapFrame === null && (g.gsapFrame = y);
            let b = o;
            b.ease || (b = { ...b, ease: "none" }),
              e.fromTo(g, { gsapFrame: y }, { gsapFrame: E, ...b }, s || 0);
          };
          g.isLoaded ? h() : g.onDataReady(h);
        }
        return () => {
          u = !0;
          for (let d of c) d.goToFrameAndStop(0), (d.gsapFrame = null);
        };
      },
    });
  }
  var to = { DURATION: 1, FROM: 0, TO: 1 };
  function no(n, e, t) {
    if (typeof n == "number") return n;
    let r = (0, hc.resolveToNumber)(n, e);
    return r !== void 0 ? r / 100 : t;
  }
});
var qn = m((Un) => {
  "use strict";
  Object.defineProperty(Un, "__esModule", { value: !0 });
  Object.defineProperty(Un, "RIVE_CONSTANTS", {
    enumerable: !0,
    get: function () {
      return yc;
    },
  });
  var yc = { MINIMUM_TIME: 0.001, MAX_BYTE_VALUE: 255 };
});
var Hn = m((Gn) => {
  "use strict";
  Object.defineProperty(Gn, "__esModule", { value: !0 });
  function vc(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  vc(Gn, {
    clearSurfaceCache: function () {
      return bc;
    },
    surfaceCache: function () {
      return $n;
    },
  });
  var $n = new WeakMap();
  function bc(n, e) {
    if (!e) return;
    let t = `${e.name}:${e.instanceName ?? ""}`,
      r = $n.get(n);
    r && (r.delete(t), r.size === 0 && $n.delete(n));
  }
});
var Re = m((zn) => {
  "use strict";
  Object.defineProperty(zn, "__esModule", { value: !0 });
  function Tc(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Tc(zn, {
    parseVmKey: function () {
      return Ec;
    },
    vmKey: function () {
      return wc;
    },
  });
  function wc(n, e, t) {
    return `vm:${n}:${e}:${t}`;
  }
  var Sc = new Set([
    "string",
    "number",
    "boolean",
    "color",
    "enum",
    "trigger",
    "artboard",
  ]);
  function Ec(n) {
    if (!n.startsWith("vm:")) return null;
    let e = n.lastIndexOf(":"),
      t = n.slice(e + 1);
    if (!Sc.has(t)) return null;
    let r = n.slice(3, e),
      o = r.indexOf(":");
    return o === -1
      ? null
      : { vmName: r.slice(0, o), propName: r.slice(o + 1), propType: t };
  }
});
var et = m((Wn) => {
  "use strict";
  Object.defineProperty(Wn, "__esModule", { value: !0 });
  function Cc(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Cc(Wn, {
    getVmiProperty: function () {
      return io;
    },
    storeOriginalValues: function () {
      return Ac;
    },
  });
  var Mc = Re();
  function Ac(n, e) {
    let t = { viewModelProperties: {} };
    for (let r of n) Ic(e, r.propertyName, r.propertyType, t);
    return t;
  }
  function Ic(n, e, t, r) {
    let o = (0, Mc.vmKey)(n.name, e, t);
    if (!(o in r.viewModelProperties)) {
      if (t === "artboard") {
        let s = n.riveInstance.viewModelInstance?.artboard?.(e)?.name;
        s != null && (r.viewModelProperties[o] = s);
        return;
      }
      let i = n.riveInstance.viewModelInstance
        ? Oc(n.riveInstance.viewModelInstance, t, e)
        : null;
      i != null && (r.viewModelProperties[o] = i);
    }
  }
  function io(n, e, t) {
    switch (e) {
      case "number":
        return n.number(t);
      case "boolean":
        return n.boolean(t);
      case "string":
        return n.string(t);
      case "color":
        return n.color(t);
      case "enum":
        return n.enum(t);
      default:
        return null;
    }
  }
  function Oc(n, e, t) {
    let r = io(n, e, t);
    return r ? r.value : void 0;
  }
});
var Xn = m((Yn) => {
  "use strict";
  Object.defineProperty(Yn, "__esModule", { value: !0 });
  Object.defineProperty(Yn, "parseColorToAARRGGBB", {
    enumerable: !0,
    get: function () {
      return Rc;
    },
  });
  var _c = qn();
  function Rc(n) {
    let e = n.trim();
    if (!e) return null;
    try {
      let { red: t, green: r, blue: o, alpha: i } = Pc(e);
      return t === void 0 || r === void 0 || o === void 0
        ? null
        : ((Math.round(i * _c.RIVE_CONSTANTS.MAX_BYTE_VALUE) << 24) |
            (t << 16) |
            (r << 8) |
            o) >>>
            0;
    } catch {
      return null;
    }
  }
  var ae = null;
  function xc(n) {
    if (!ae) {
      let e = document.createElement("canvas");
      if (((e.width = 1), (e.height = 1), (ae = e.getContext("2d")), !ae))
        return null;
    }
    return (
      (ae.fillStyle = "#000000"),
      (ae.fillStyle = n),
      ae.fillStyle === "#000000" && n.toLowerCase() !== "black"
        ? null
        : ae.fillStyle
    );
  }
  function oo(n, e, t) {
    let r = (1 - Math.abs(2 * t - 1)) * e,
      o = r * (1 - Math.abs(((n / 60) % 2) - 1)),
      i = t - r / 2,
      s,
      a,
      l;
    return (
      n >= 0 && n < 60
        ? ((s = r), (a = o), (l = 0))
        : n >= 60 && n < 120
        ? ((s = o), (a = r), (l = 0))
        : n >= 120 && n < 180
        ? ((s = 0), (a = r), (l = o))
        : n >= 180 && n < 240
        ? ((s = 0), (a = o), (l = r))
        : n >= 240 && n < 300
        ? ((s = o), (a = 0), (l = r))
        : ((s = r), (a = 0), (l = o)),
      {
        red: Math.round((s + i) * 255),
        green: Math.round((a + i) * 255),
        blue: Math.round((l + i) * 255),
      }
    );
  }
  function Pc(n) {
    let e,
      t,
      r,
      o = 1,
      i = n.replace(/\s/g, "").toLowerCase(),
      s = i;
    if (!s.startsWith("#") && !s.startsWith("rgb") && !s.startsWith("hsl")) {
      let a = xc(i);
      a && (s = a);
    }
    if (s.startsWith("#")) {
      let a = s.substring(1);
      a.length === 3 || a.length === 4
        ? ((e = parseInt(a.charAt(0) + a.charAt(0), 16)),
          (t = parseInt(a.charAt(1) + a.charAt(1), 16)),
          (r = parseInt(a.charAt(2) + a.charAt(2), 16)),
          a.length === 4 && (o = parseInt(a.charAt(3) + a.charAt(3), 16) / 255))
        : (a.length === 6 || a.length === 8) &&
          ((e = parseInt(a.substring(0, 2), 16)),
          (t = parseInt(a.substring(2, 4), 16)),
          (r = parseInt(a.substring(4, 6), 16)),
          a.length === 8 && (o = parseInt(a.substring(6, 8), 16) / 255));
    } else if (s.startsWith("rgba")) {
      let a = s.match(/rgba\(([^)]+)\)/)?.[1]?.split(",");
      (e = parseInt(a?.[0] ?? "", 10)),
        (t = parseInt(a?.[1] ?? "", 10)),
        (r = parseInt(a?.[2] ?? "", 10)),
        (o = parseFloat(a?.[3] ?? ""));
    } else if (s.startsWith("rgb")) {
      let a = s.match(/rgb\(([^)]+)\)/)?.[1]?.split(",");
      (e = parseInt(a?.[0] ?? "", 10)),
        (t = parseInt(a?.[1] ?? "", 10)),
        (r = parseInt(a?.[2] ?? "", 10));
    } else if (s.startsWith("hsla")) {
      let a = s.match(/hsla\(([^)]+)\)/)?.[1]?.split(","),
        l = parseFloat(a?.[0] ?? ""),
        c = parseFloat(a?.[1]?.replace("%", "") ?? "") / 100,
        u = parseFloat(a?.[2]?.replace("%", "") ?? "") / 100;
      (o = parseFloat(a?.[3] ?? "")),
        ({ red: e, green: t, blue: r } = oo(l, c, u));
    } else if (s.startsWith("hsl")) {
      let a = s.match(/hsl\(([^)]+)\)/)?.[1]?.split(","),
        l = parseFloat(a?.[0] ?? ""),
        c = parseFloat(a?.[1]?.replace("%", "") ?? "") / 100,
        u = parseFloat(a?.[2]?.replace("%", "") ?? "") / 100;
      ({ red: e, green: t, blue: r } = oo(l, c, u));
    }
    if (
      Number.isNaN(e) ||
      Number.isNaN(t) ||
      Number.isNaN(r) ||
      Number.isNaN(o)
    )
      throw new Error(`Invalid color value: '${n}'`);
    return { red: e, green: t, blue: r, alpha: o };
  }
});
var Qn = m((Zn) => {
  "use strict";
  Object.defineProperty(Zn, "__esModule", { value: !0 });
  Object.defineProperty(Zn, "setVmiValue", {
    enumerable: !0,
    get: function () {
      return Lc;
    },
  });
  var kc = Re(),
    Nc = et(),
    Fc = Xn();
  function Lc(n, e, t, r, o, i) {
    let s = n.riveInstance.viewModelInstance;
    if (e === "trigger") {
      if (i) return;
      s?.trigger?.(t)?.fire?.();
      return;
    }
    if (!s) return;
    let a = (0, Nc.getVmiProperty)(s, e, t);
    if (!a) return;
    let l = o?.viewModelProperties[(0, kc.vmKey)(n.name, t, e)],
      c = i ? l ?? r : r,
      u = `${e}:${t}`;
    switch (e) {
      case "number":
        typeof c == "number" && ((a.value = c), (n.currentValues[u] = c));
        return;
      case "boolean":
        typeof c == "boolean" && ((a.value = c), (n.currentValues[u] = c));
        return;
      case "string":
        typeof c == "string" && ((a.value = c), (n.currentValues[u] = c));
        return;
      case "enum":
        typeof c == "string" && ((a.value = c), (n.currentValues[u] = c));
        return;
      case "color": {
        let d =
          typeof c == "number"
            ? c
            : typeof c == "string"
            ? (0, Fc.parseColorToAARRGGBB)(c)
            : null;
        d != null && ((a.value = d), (n.currentValues[u] = d));
        return;
      }
      default:
        return;
    }
  }
});
var ao = m((Kn) => {
  "use strict";
  Object.defineProperty(Kn, "__esModule", { value: !0 });
  function Dc(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Dc(Kn, {
    createCleanupFunction: function () {
      return Uc;
    },
    restoreViewModelProperties: function () {
      return so;
    },
  });
  var jc = Re(),
    Vc = Qn(),
    Bc = Hn();
  function so(n, e, t) {
    let r = n.viewModelInstance ?? null;
    if (r)
      for (let [o, i] of Object.entries(t.viewModelProperties)) {
        let s = (0, jc.parseVmKey)(o);
        if (!s || s.vmName !== e) continue;
        let a = { name: e, riveInstance: n, currentValues: {} };
        if (s.propType === "artboard") {
          if (typeof i != "string") continue;
          let l = r.artboard?.(s.propName),
            c = n.getArtboard?.(i);
          l && c && (l.value = c);
          continue;
        }
        (0, Vc.setVmiValue)(a, s.propType, s.propName, i);
      }
  }
  function Uc(n, e, t) {
    return () => {
      !e || !n || (so(n, e.name, t), (0, Bc.clearSurfaceCache)(n, e));
    };
  }
});
var uo = m((Jn) => {
  "use strict";
  Object.defineProperty(Jn, "__esModule", { value: !0 });
  function qc(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  qc(Jn, {
    interpolateAARRGGBB: function () {
      return co;
    },
    setupAnimateTimeline: function () {
      return Hc;
    },
  });
  var $c = et(),
    Gc = Xn(),
    lo = ve();
  function co(n, e, t) {
    let r = (n >>> 24) & 255,
      o = (n >>> 16) & 255,
      i = (n >>> 8) & 255,
      s = n & 255,
      a = (e >>> 24) & 255,
      l = (e >>> 16) & 255,
      c = (e >>> 8) & 255,
      u = e & 255,
      d = Math.round(r + (a - r) * t),
      f = Math.round(o + (l - o) * t),
      p = Math.round(i + (c - i) * t),
      g = Math.round(s + (u - s) * t);
    return ((d << 24) | (f << 16) | (p << 8) | g) >>> 0;
  }
  function Hc(n, e, t, r, o, i) {
    if (t.length === 0) return;
    let s = e.riveInstance.viewModelInstance;
    if (s)
      for (let a of t) {
        if (
          a.value === null ||
          a.value === void 0 ||
          !(0, $c.getVmiProperty)(s, a.propertyType, a.propertyName)
        )
          continue;
        let c,
          u = a.value;
        if (typeof u == "string" && u.startsWith("var(")) {
          if (
            (a.propertyType === "number"
              ? (c = (0, lo.resolveToNumber)(u, i))
              : a.propertyType === "color" &&
                (c = (0, lo.resolveToString)(u, i)),
            c === void 0)
          )
            continue;
        } else c = u;
        a.propertyType === "number"
          ? zc(e, n, a.propertyName, c, r, o)
          : a.propertyType === "color" && Wc(e, n, a.propertyName, c, r, o);
      }
  }
  function zc(n, e, t, r, o, i) {
    let s = n.riveInstance.viewModelInstance;
    if (!s) return;
    let a = s.number(t);
    if (!a) return;
    let l = typeof r == "number" ? r : parseFloat(String(r));
    if (isNaN(l)) return;
    let c = { v: a.value };
    e.to(
      c,
      {
        ...o,
        v: l,
        onStart() {
          let u = n.currentValues[`number:${t}`];
          (c.v = typeof u == "number" ? u : a.value), this.invalidate();
        },
        onUpdate: () => {
          a.value = c.v;
        },
      },
      i ?? 0
    );
  }
  function Wc(n, e, t, r, o, i) {
    let s = n.riveInstance.viewModelInstance;
    if (!s) return;
    let a = s.color(t);
    if (!a) return;
    let l = typeof r == "number" ? r : (0, Gc.parseColorToAARRGGBB)(String(r));
    if (l == null) return;
    let c = { fromPacked: a.value },
      u = { t: 0 };
    e.fromTo(
      u,
      { t: 0 },
      {
        ...o,
        t: 1,
        onStart() {
          let d = n.currentValues[`color:${t}`];
          (c.fromPacked = typeof d == "number" ? d : a.value),
            this.invalidate();
        },
        onUpdate: () => {
          a.value = co(c.fromPacked, l, u.t);
        },
      },
      i ?? 0
    );
  }
});
var mo = m((nr) => {
  "use strict";
  Object.defineProperty(nr, "__esModule", { value: !0 });
  function Yc(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Yc(nr, {
    resolveSurfaceArea: function () {
      return tr;
    },
    setupAnimateAnimation: function () {
      return eu;
    },
    setupAnimation: function () {
      return Jc;
    },
    setupTimeline: function () {
      return ho;
    },
  });
  var fo = qn(),
    er = Hn(),
    po = et(),
    go = ao(),
    Xc = Qn(),
    Zc = uo(),
    Qc = Re(),
    tt = ve();
  function tr(n, e) {
    if (!e) return null;
    let t = `${e.name}:${e.instanceName ?? ""}`,
      r = er.surfaceCache.get(n)?.get(t);
    if (r) return r;
    let i =
      (n.viewModelByName?.(e.name) ?? void 0)?.instanceByName?.(
        e.instanceName ?? ""
      ) ?? null;
    n.bindViewModelInstance?.(i);
    let s = { name: e.name, riveInstance: n, currentValues: {} },
      a = er.surfaceCache.get(n);
    return a || ((a = new Map()), er.surfaceCache.set(n, a)), a.set(t, s), s;
  }
  function ho(n, e, t, r, o, i) {
    if (t.length === 0) return;
    for (let l of t) {
      if (
        l.propertyType === "trigger" ||
        l.propertyType === "artboard" ||
        l.value === null ||
        l.value === void 0
      )
        continue;
      let c = l.value,
        u;
      typeof c == "string" && c.startsWith("var(")
        ? (u =
            l.propertyType === "number"
              ? (0, tt.resolveToNumber)(c, i)
              : l.propertyType === "color"
              ? (0, tt.resolveToString)(c, i)
              : void 0)
        : (u = c),
        u !== void 0 &&
          (e.currentValues[`${l.propertyType}:${l.propertyName}`] = u);
    }
    let s = (l) => {
        for (let c of t) {
          if (
            (c.propertyType !== "trigger" && c.value === null) ||
            c.value === void 0
          )
            continue;
          let u,
            d = c.value;
          if (typeof d == "string" && d.startsWith("var(")) {
            if (
              (c.propertyType === "number"
                ? (u = (0, tt.resolveToNumber)(d, i))
                : c.propertyType === "color" &&
                  (u = (0, tt.resolveToString)(d, i)),
              u === void 0)
            )
              continue;
          } else u = d;
          Kc(e, c.propertyName, c.propertyType, u, r, l);
        }
      },
      a = { int: 0 };
    n.to(
      a,
      {
        int: 1,
        duration: fo.RIVE_CONSTANTS.MINIMUM_TIME,
        onStart: () => {
          s(!1);
        },
        onReverseComplete: () => {
          s(!0);
        },
      },
      o ?? fo.RIVE_CONSTANTS.MINIMUM_TIME
    );
  }
  function Kc(n, e, t, r, o, i) {
    if (t === "artboard") {
      if (typeof r != "string") return;
      let s = n.riveInstance.viewModelInstance?.artboard?.(e);
      if (!s) return;
      if (i) {
        let l = (0, Qc.vmKey)(n.name, e, t),
          c = o?.viewModelProperties[l];
        if (typeof c == "string") {
          let u = n.riveInstance.getArtboard?.(c);
          u && (s.value = u);
        }
        return;
      }
      let a = n.riveInstance.getArtboard?.(r);
      if (!a) return;
      s.value = a;
      return;
    }
    (0, Xc.setVmiValue)(n, t, e, r, o, i);
  }
  function Jc(n, e, t, r, o) {
    let i = e.animationSource,
      s = tr(n, i);
    if (!s) return;
    let a = e.addedProperties ?? {},
      l = Object.values(a),
      c = (0, po.storeOriginalValues)(l, s);
    return ho(t, s, l, c, r, o), (0, go.createCleanupFunction)(n, i, c);
  }
  function eu(n, e, t, r, o, i) {
    let s = e.animationSource,
      a = tr(n, s);
    if (!a) return;
    let l = e.addedProperties ?? {},
      c = Object.values(l),
      u = (0, po.storeOriginalValues)(c, a);
    return (
      (0, Zc.setupAnimateTimeline)(t, a, c, r, o, i),
      (0, go.createCleanupFunction)(n, s, u)
    );
  }
});
var So = m((rr) => {
  "use strict";
  Object.defineProperty(rr, "__esModule", { value: !0 });
  function tu(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  tu(rr, {
    buildAnimateRiveAction: function () {
      return iu;
    },
    buildRiveAction: function () {
      return ru;
    },
  });
  var bo = mo();
  function yo(n) {
    return (
      typeof n == "object" &&
      n !== null &&
      "loaded" in n &&
      typeof n.loaded == "boolean"
    );
  }
  function vo(n) {
    !n.isPlaying && n.play && n.play();
  }
  function nu(n, e, t) {
    let o = e.getInstance(n)?.rive,
      i = yo(o) ? o : null;
    if (i?.loaded) return vo(i), t(i, n);
    let s,
      a = !1,
      l = () => {
        if (a || !n.isConnected) return;
        let u = e.getInstance(n)?.rive,
          d = yo(u) ? u : null;
        d?.loaded && (vo(d), (s = t(d, n))),
          n.removeEventListener("w-rive-load", l);
      };
    return (
      n.addEventListener("w-rive-load", l),
      () => {
        (a = !0), n.removeEventListener("w-rive-load", l), s?.();
      }
    );
  }
  function To(n, e, t) {
    let r = [];
    for (let o of n) {
      let i = nu(o, e, t);
      i && r.push(i);
    }
    if (r.length !== 0)
      return () => {
        for (let o of r) o();
      };
  }
  function wo() {
    return window.Webflow ? window.Webflow.require?.("rive") ?? null : null;
  }
  function ru(n) {
    n.addAction("rive", {
      createCustomTween: (e, t, r, o, i, s) => {
        let a = r.rive;
        if (!a || !i.length) return;
        let l = wo();
        if (l) return To(i, l, (c, u) => (0, bo.setupAnimation)(c, a, e, s, u));
      },
    });
  }
  function iu(n) {
    n.addAction("animate-rive", {
      createCustomTween: (e, t, r, o, i, s) => {
        let a = r.rive;
        if (!a || !i.length) return;
        let l = wo();
        if (l)
          return To(i, l, (c, u) =>
            (0, bo.setupAnimateAnimation)(c, a, e, o, s, u)
          );
      },
    });
  }
});
var le = m((ir) => {
  "use strict";
  Object.defineProperty(ir, "__esModule", { value: !0 });
  function ou(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  ou(ir, {
    checkTt: function () {
      return uu;
    },
    hasBBoxUpdate: function () {
      return lu;
    },
    hasIntensity: function () {
      return su;
    },
    hasMatrixUpdate: function () {
      return cu;
    },
    hasRenderOrder: function () {
      return au;
    },
  });
  var nt = Y(),
    su = (n) => "intensity" in n,
    au = (n) => "renderOrder" in n,
    lu = (n) => "singleBBoxNeedsUpdate" in n && "recursiveBBoxNeedsUpdate" in n,
    cu = (n) => "updateMatrix" in n && "updateMatrixWorld" in n,
    uu = (n, e) =>
      e === "from"
        ? n === nt.TweenType.From || n === nt.TweenType.FromTo
        : n === nt.TweenType.To || n === nt.TweenType.FromTo;
});
var sr = m((or) => {
  "use strict";
  Object.defineProperty(or, "__esModule", { value: !0 });
  Object.defineProperty(or, "colorDataToCss", {
    enumerable: !0,
    get: function () {
      return du;
    },
  });
  var du = ({ r: n, g: e, b: t, a: r }) => {
    let o = (c) => Math.round(Math.min(1, Math.max(0, c)) * 255),
      i = o(n),
      s = o(e),
      a = o(t);
    if (r === void 0 || r >= 1) return `rgba(${i}, ${s}, ${a}, 1)`;
    let l = Math.min(1, Math.max(0, r));
    return `rgba(${i}, ${s}, ${a}, ${l})`;
  };
});
var Eo = m((ar) => {
  "use strict";
  Object.defineProperty(ar, "__esModule", { value: !0 });
  Object.defineProperty(ar, "storeOriginalState", {
    enumerable: !0,
    get: function () {
      return gu;
    },
  });
  var fu = le(),
    pu = sr(),
    gu = (n, e, t) => {
      let r = n.material,
        o = Array.isArray(r) ? r : r ? [r] : [],
        i = e.spline._scene.entityByUuid[t]?.color,
        s = i ? (0, pu.colorDataToCss)(i) : void 0,
        a = n.rotation;
      return {
        position: { ...n.position },
        rotation: { x: a._x ?? 0, y: a._y ?? 0, z: a._z ?? 0 },
        scale: { ...n.scale },
        ...(s ? { color: s } : {}),
        intensity: n.intensity,
        renderOrder: (0, fu.hasRenderOrder)(n) ? n.renderOrder : void 0,
        materials: o?.map((l) => ({
          transparent: l.transparent,
          depthWrite: l.depthWrite,
          alpha: l.alpha,
          layers: (l.layers ?? []).map((c) => ({
            visible: c.visible,
            alpha: c.alpha,
            alphaOverride: c.alphaOverride,
            ior: c.ior,
            thickness: c.thickness,
          })),
        })),
      };
    };
});
var xe = m((lr) => {
  "use strict";
  Object.defineProperty(lr, "__esModule", { value: !0 });
  Object.defineProperty(lr, "SPLINE_CONSTANTS", {
    enumerable: !0,
    get: function () {
      return hu;
    },
  });
  var hu = {
    OPACITY_RENDER_ORDER: 999,
    TRANSITION_END_OFFSET: 0.001,
    DEFAULT_TRANSITION_DURATION: 0.5,
    OPACITY_TRANSPARENCY_THRESHOLD: 0.01,
    DEFAULT_TRANSMISSION_IOR: 1.3,
    DEFAULT_TRANSMISSION_THICKNESS: 10,
    MIN_ZOOM_VALUE: 1e-4,
  };
});
var rt = m((cr) => {
  "use strict";
  Object.defineProperty(cr, "__esModule", { value: !0 });
  function mu(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  mu(cr, {
    getAppZoom: function () {
      return vu;
    },
    setAppZoom: function () {
      return bu;
    },
  });
  var yu = xe(),
    vu = (n) => {
      let e = n._camera;
      return e._cameraType === "OrthographicCamera"
        ? e.orthoCamera.zoom
        : e.perspCamera.zoom;
    },
    bu = (n, e) => {
      let t = e > 0 ? e : yu.SPLINE_CONSTANTS.MIN_ZOOM_VALUE;
      n.setZoom?.(t);
    };
});
var dr = m((ur) => {
  "use strict";
  Object.defineProperty(ur, "__esModule", { value: !0 });
  Object.defineProperty(ur, "createCleanupFunction", {
    enumerable: !0,
    get: function () {
      return wu;
    },
  });
  var Tu = rt(),
    it = le(),
    wu = (n, e, t, r, o, i) => () => {
      if (!(!n || !t)) {
        if (
          (i && (n.state = void 0),
          Object.assign(n.position, t.position),
          Object.assign(n.rotation, {
            x: t.rotation.x,
            y: t.rotation.y,
            z: t.rotation.z,
          }),
          Object.assign(n.scale, t.scale),
          t.color && (n.color = t.color),
          r.spline?.intensity &&
            typeof r.spline.intensity == "object" &&
            t.intensity !== void 0 &&
            (0, it.hasIntensity)(n) &&
            (n.intensity = t.intensity),
          r.spline?.zoom && typeof r.spline.zoom == "object")
        ) {
          let s = e.spline;
          typeof s?.setZoom == "function" && (0, Tu.setAppZoom)(s, o ?? 1);
        }
        if (t.materials) {
          let s = n.material,
            a = Array.isArray(s) ? s : s ? [s] : [];
          (0, it.hasRenderOrder)(n) && (n.renderOrder = t.renderOrder ?? 0);
          let l = Math.min(a.length, t.materials.length);
          for (let c = 0; c < l; c++) {
            let u = a[c],
              d = t.materials[c];
            if (!u || !d) continue;
            (u.transparent = d.transparent),
              (u.depthWrite = d.depthWrite),
              d.alpha !== void 0 && (u.alpha = d.alpha);
            let f = u.layers ?? [];
            for (let p = 0; p < f.length; p++) {
              let g = f[p],
                h = d.layers[p];
              !g ||
                !h ||
                ((g.visible = h.visible),
                h.alpha !== void 0 && (g.alpha = h.alpha),
                h.alphaOverride !== void 0 &&
                  (g.alphaOverride = h.alphaOverride),
                h.ior !== void 0 && (g.ior = h.ior),
                h.thickness !== void 0 && (g.thickness = h.thickness));
            }
          }
        }
        (0, it.hasMatrixUpdate)(n) &&
          (n.updateMatrix(), n.updateMatrixWorld(!0)),
          (0, it.hasBBoxUpdate)(n) &&
            ((n.singleBBoxNeedsUpdate = !0), (n.recursiveBBoxNeedsUpdate = !0)),
          e.spline.requestRender();
      }
    };
});
var Co = m((fr) => {
  "use strict";
  Object.defineProperty(fr, "__esModule", { value: !0 });
  function Su(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Su(fr, {
    warnNoObjectId: function () {
      return Eu;
    },
    warnNoObjectsFound: function () {
      return Mu;
    },
    warnObjectNotFound: function () {
      return Cu;
    },
  });
  var Eu = () => {},
    Cu = (n) => {},
    Mu = (n) => {};
});
var Io = m((pr) => {
  "use strict";
  Object.defineProperty(pr, "__esModule", { value: !0 });
  Object.defineProperty(pr, "animateStateTransitions", {
    enumerable: !0,
    get: function () {
      return Iu;
    },
  });
  var Mo = xe(),
    Au = dr(),
    Ao = le(),
    Iu = (n, e, t, r, o, i, s, a, l, c) => {
      let u = [];
      n.forEach((f) => {
        if (!f.transition) {
          u.push(null);
          return;
        }
        let p = l.duration ?? Mo.SPLINE_CONSTANTS.DEFAULT_TRANSITION_DURATION,
          g = f.transition({
            from:
              e.stateName?.from && (0, Ao.checkTt)(a, "from")
                ? e.stateName.from
                : void 0,
            to:
              e.stateName?.to && (0, Ao.checkTt)(a, "to")
                ? e.stateName.to
                : null,
            autoPlay: !1,
            duration: p,
            delay: 0,
          });
        u.push(g);
        let h = { time: 0 };
        s.fromTo(
          h,
          { time: 0 },
          {
            ...l,
            time: p - Mo.SPLINE_CONSTANTS.TRANSITION_END_OFFSET,
            onUpdate: () => {
              g.seek(h.time);
            },
          },
          c || 0
        );
      });
      let d = n.map((f, p) =>
        (0, Au.createCleanupFunction)(f, t, r[p], o, i, u[p])
      );
      return () => d.forEach((f) => f?.());
    };
});
var _o = m((gr) => {
  "use strict";
  Object.defineProperty(gr, "__esModule", { value: !0 });
  function Ou(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  Ou(gr, {
    animateColor: function () {
      return Pu;
    },
    animateIntensity: function () {
      return Ru;
    },
    animateZoom: function () {
      return xu;
    },
  });
  var Oo = rt(),
    _u = sr(),
    ce = le(),
    Ru = (n, e, t, r, o, i) => {
      let s = e.intensity;
      if (!s || typeof s != "object") return;
      let a = n.intensity ?? 0,
        l = s.from && (0, ce.checkTt)(r, "from") ? s.from : a,
        c = s.to && (0, ce.checkTt)(r, "to") ? s.to : a,
        u = { v: l };
      t.fromTo(
        u,
        { v: l },
        {
          ...o,
          v: c,
          onUpdate: () => {
            (0, ce.hasIntensity)(n) && (n.intensity = u.v);
          },
        },
        i || 0
      );
    },
    xu = (n, e, t, r, o, i) => {
      let s = e.zoom;
      if (!s || typeof s != "object" || typeof n.spline?.setZoom != "function")
        return;
      let a = (0, Oo.getAppZoom)(n.spline),
        l = s.from && (0, ce.checkTt)(r, "from") ? s.from : a,
        c = s.to && (0, ce.checkTt)(r, "to") ? s.to : a,
        u = { v: l };
      t.fromTo(
        u,
        { v: l },
        {
          ...o,
          v: c,
          onUpdate: () => {
            (0, Oo.setAppZoom)(n.spline, u.v);
          },
        },
        i || 0
      );
    },
    Pu = (n, e, t, r, o, i, s, a) => {
      let l = e.color;
      if (!l || typeof l != "object" || (!l.from && !l.to)) return;
      let c = s.spline._scene.entityByUuid[a]?.color,
        u = (0, _u.colorDataToCss)(c ?? { r: 255, g: 255, b: 255 }),
        d = l.from && (0, ce.checkTt)(r, "from") ? l.from : u,
        f = l.to && (0, ce.checkTt)(r, "to") ? l.to : u,
        p = window.gsap.utils.interpolate(d, f),
        g = { t: 0 };
      t.fromTo(
        g,
        { t: 0 },
        {
          ...o,
          t: 1,
          onUpdate: function () {
            n.color = p(g.t);
          },
        },
        i || 0
      );
    };
});
var xo = m((hr) => {
  "use strict";
  Object.defineProperty(hr, "__esModule", { value: !0 });
  function ku(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  ku(hr, {
    createPropertyObject: function () {
      return Ro;
    },
    createTransformTargets: function () {
      return Nu;
    },
  });
  var Ro = (n, e, t) => {
      let r = {},
        o = t[e];
      return (
        ["X", "Y", "Z"].forEach((i) => {
          let s = `${e}${i}`,
            a = n[s],
            l = i.toLowerCase(),
            c = o[l];
          a &&
            typeof a == "object" &&
            (r[l] = { from: a.from ?? c, to: a.to ?? c });
        }),
        { props: r }
      );
    },
    Nu = (n, e) => {
      let t = ["position", "rotation", "scale"],
        r = [];
      return (
        t.forEach((o) => {
          let { props: i } = Ro(e, o, n);
          Object.keys(i).length > 0 && r.push({ object: n[o], props: i });
        }),
        r
      );
    };
});
var Po = m((yr) => {
  "use strict";
  Object.defineProperty(yr, "__esModule", { value: !0 });
  Object.defineProperty(yr, "fadeObject", {
    enumerable: !0,
    get: function () {
      return Vu;
    },
  });
  var ot = xe(),
    mr = le(),
    Fu = (n, e, t, r, o, i) => {
      r.fromTo(n, { alpha: e }, { ...o, alpha: t }, i);
    },
    Lu = (n, e, t, r, o, i) => {
      let s = n.ior ?? ot.SPLINE_CONSTANTS.DEFAULT_TRANSMISSION_IOR,
        a = n.thickness ?? ot.SPLINE_CONSTANTS.DEFAULT_TRANSMISSION_THICKNESS;
      r.fromTo(
        n,
        { alpha: e, ior: s, thickness: a },
        {
          ...o,
          alpha: 1 - t,
          ior: window.gsap.utils.interpolate(s, 1, 1 - t),
          thickness: window.gsap.utils.interpolate(a, 0, 1 - t),
          onUpdate: () => {
            n.visible =
              n.alpha > ot.SPLINE_CONSTANTS.OPACITY_TRANSPARENCY_THRESHOLD;
          },
        },
        i
      );
    },
    Du = (n, e, t, r, o, i) => {
      n.alphaOverride !== void 0 &&
        r.fromTo(n, { alphaOverride: e }, { ...o, alphaOverride: t }, i);
    },
    ju = (n, e, t, r, o, i) => {
      if (!n.visible) return;
      let s = n.type;
      s === "color" || s === "depth" || s === "outline"
        ? Fu(n, e, t, r, o, i)
        : s === "transmission"
        ? Lu(n, e, t, r, o, i)
        : s === "light" && Du(n, e, t, r, o, i);
    },
    Vu = (n, e, t, r, o, i) => {
      if (!n) return;
      let s = n.material,
        a = s?.layers;
      if (a) {
        (s.transparent = !0),
          (0, mr.hasRenderOrder)(n) &&
            (n.renderOrder = ot.SPLINE_CONSTANTS.OPACITY_RENDER_ORDER);
        for (let l of a) {
          let c = l.type === "light" ? l.alphaOverride ?? 1 : l.alpha ?? 1,
            u = e.from !== void 0 && (0, mr.checkTt)(r, "from") ? e.from : c,
            d = e.to !== void 0 && (0, mr.checkTt)(r, "to") ? e.to : c;
          ju(l, u, d, t, o, i);
        }
      }
    };
});
var No = m((Tr) => {
  "use strict";
  Object.defineProperty(Tr, "__esModule", { value: !0 });
  Object.defineProperty(Tr, "setupAnimation", {
    enumerable: !0,
    get: function () {
      return zu;
    },
  });
  var Bu = Eo(),
    Uu = dr(),
    qu = rt(),
    vr = Co(),
    $u = Io(),
    br = _o(),
    Gu = xo(),
    Hu = Po(),
    st = le(),
    ko = xe(),
    zu = (n, e, t, r, o, i) => {
      t.ease || (t = { ...t, ease: "none" });
      let { force3D: s, ...a } = t;
      if (((t = { ...a }), !n.spline?.findObjectById)) return;
      let l = e.spline,
        c = (e.objectId || "").split(",").filter(Boolean);
      if (c.length === 0) {
        (0, vr.warnNoObjectId)();
        return;
      }
      let u = c.flatMap((h) => {
        let v = n.spline.findObjectById?.(h);
        return v || ((0, vr.warnObjectNotFound)(h), []);
      });
      if (u.length === 0) {
        (0, vr.warnNoObjectsFound)(c);
        return;
      }
      let d = u.map((h) => (0, Bu.storeOriginalState)(h, n, c[0] ?? "")),
        f = (0, qu.getAppZoom)(n.spline);
      if (
        e.animatingState &&
        l?.stateName &&
        (l.stateName.from || l.stateName.to)
      )
        return (0, $u.animateStateTransitions)(u, l, n, d, e, f, r, o, t, i);
      if (!l) return;
      let p = Object.keys(l);
      if (p.length === 0 || (p.length === 1 && p[0] === "stateName")) return;
      u.forEach((h) => {
        (0, br.animateIntensity)(h, l, r, o, t, i),
          (0, br.animateZoom)(n, l, r, o, t, i),
          (0, br.animateColor)(h, l, r, o, t, i, n, c[0] ?? "");
        let v = l.opacity && typeof l.opacity == "object" ? l.opacity : void 0;
        if (v !== void 0) {
          let E = {
              from: v.from !== void 0 ? v.from / 100 : void 0,
              to: v.to !== void 0 ? v.to / 100 : void 0,
            },
            b =
              t.immediateRender !== !1 &&
              E.from !== void 0 &&
              (0, st.checkTt)(o, "from")
                ? E.from
                : void 0;
          if (((0, Hu.fadeObject)(h, E, r, o, t, i), b !== void 0)) {
            let M = h.material,
              w = Array.isArray(M) ? M : M ? [M] : [];
            for (let T of w)
              (T.transparent = !0),
                (T.depthWrite =
                  b > ko.SPLINE_CONSTANTS.OPACITY_TRANSPARENCY_THRESHOLD);
            (0, st.hasRenderOrder)(h) &&
              (h.renderOrder = ko.SPLINE_CONSTANTS.OPACITY_RENDER_ORDER);
          }
        }
        (0, Gu.createTransformTargets)(h, l).forEach(
          ({ object: E, props: b }) => {
            if (Object.keys(b).length === 0) return;
            let M = {},
              w = {};
            Object.keys(b).forEach((T) => {
              let S = b[T];
              S &&
                typeof S == "object" &&
                ((M[T] =
                  (0, st.checkTt)(o, "from") && S.from ? S.from : E[T] ?? 0),
                (w[T] = (0, st.checkTt)(o, "to") && S.to ? S.to : E[T] ?? 0));
            }),
              !(Object.keys(M).length === 0 && Object.keys(w).length === 0) &&
                r.fromTo(E, M, { ...t, ...w }, i || 0);
          }
        );
      });
      let g = u.map((h, v) => (0, Uu.createCleanupFunction)(h, n, d[v], e, f));
      return () => g.forEach((h) => h?.());
    };
});
var Do = m((wr) => {
  "use strict";
  Object.defineProperty(wr, "__esModule", { value: !0 });
  Object.defineProperty(wr, "buildSplineAction", {
    enumerable: !0,
    get: function () {
      return Qu;
    },
  });
  var Fo = No(),
    at = ve(),
    Wu = new Set(["color", "stateName"]),
    Yu = new Set(["rotationX", "rotationY", "rotationZ"]),
    Lo = Math.PI / 180;
  function Xu(n, e) {
    if (!n.spline) return n;
    let t = n.spline,
      r = {},
      o = !1;
    for (let [i, s] of Object.entries(t)) {
      if (!s || typeof s != "object") {
        r[i] = s;
        continue;
      }
      let a = s;
      if (Wu.has(i)) {
        let l = a.from !== void 0 ? (0, at.resolveToString)(a.from, e) : void 0,
          c = a.to !== void 0 ? (0, at.resolveToString)(a.to, e) : void 0;
        (l !== a.from || c !== a.to) && (o = !0), (r[i] = { from: l, to: c });
      } else {
        let l = a.from !== void 0 ? (0, at.resolveToNumber)(a.from, e) : void 0,
          c = a.to !== void 0 ? (0, at.resolveToNumber)(a.to, e) : void 0,
          u = l !== a.from,
          d = c !== a.to;
        (u || d) && (o = !0),
          Yu.has(i)
            ? (r[i] = {
                from: l !== void 0 && u ? l * Lo : l,
                to: c !== void 0 && d ? c * Lo : c,
              })
            : (r[i] = { from: l, to: c });
      }
    }
    return o ? { ...n, spline: r } : n;
  }
  function Zu(n, e, t, r, o, i, s) {
    let a = e.getInstance(n);
    if (a) return (0, Fo.setupAnimation)(a, t, r, o, i, s);
    let l,
      c = () => {
        let u = e.getInstance(n);
        u && (l = (0, Fo.setupAnimation)(u, t, r, o, i, s)),
          n.removeEventListener("w-spline-load", c);
      };
    return (
      n.addEventListener("w-spline-load", c),
      () => {
        n.removeEventListener("w-spline-load", c), l?.();
      }
    );
  }
  function Qu(n) {
    n.addAction("spline", {
      createCustomTween: (e, t, r, o, i, s) => {
        let a = t.tt ?? 0;
        if (!i.length || !window.Webflow || !r.objectId) return;
        let l = window.Webflow.require?.("spline");
        if (!l) return;
        let c = [];
        for (let u of i) {
          let d = Xu(r, u),
            f = Zu(u, l, d, o, e, a, s);
          f && c.push(f);
        }
        if (c.length !== 0)
          return () => {
            for (let u of c) u?.();
          };
      },
    });
  }
});
var $o = m((Er) => {
  "use strict";
  Object.defineProperty(Er, "__esModule", { value: !0 });
  Object.defineProperty(Er, "buildVariableAction", {
    enumerable: !0,
    get: function () {
      return Ku;
    },
  });
  var Sr = Y();
  function Ku(n) {
    n.addAction("variable", {
      createCustomTween: (e, t, r, o, i, s) => {
        let a = r.variable;
        if (!a) return;
        let l = Object.keys(a),
          c = l.length;
        if (c === 0) return;
        let u = (t.targets?.length ?? 0) > 0;
        if (u && i.length === 0) return;
        let d = u ? Array.from(new Set(i)) : Ju(l),
          f = d.length,
          p = new Array(f),
          g = new Array(f);
        for (let w = 0; w < f; w++) {
          let T = d[w].style;
          p[w] = T;
          let S = new Array(c);
          for (let _ = 0; _ < c; _++) {
            let A = l[_];
            (S[_] = T.getPropertyValue(A)), T.removeProperty(A);
          }
          g[w] = S;
        }
        let h = t.tt ?? Sr.TweenType.To,
          v = s || 0,
          { force3D: y, ...E } = o,
          b = l.some((w) => a[w].startsWith("var(")),
          M = (w) => {
            let T = {};
            for (let S = 0; S < c; S++) {
              let _ = l[S],
                A = a[_];
              T[_] =
                (w &&
                  A.startsWith("var(") &&
                  w.getPropertyValue(A.slice(4, -1)).trim()) ||
                A;
            }
            return T;
          };
        if (u)
          for (let w = 0; w < f; w++) {
            let T = d[w],
              S = M(b ? getComputedStyle(T) : null);
            jo(e, h, T, { ...S, ...E }, v);
          }
        else {
          let T = {
            ...M(b ? getComputedStyle(document.documentElement) : null),
            ...E,
          };
          for (let S = 0; S < f; S++) jo(e, h, d[S], T, v);
        }
        return () => {
          for (let w = 0; w < f; w++) {
            let T = p[w],
              S = g[w];
            for (let _ = 0; _ < c; _++) {
              let A = S[_];
              A ? T.setProperty(l[_], A) : T.removeProperty(l[_]);
            }
          }
        };
      },
    });
  }
  function Ju(n) {
    let e = [document.documentElement];
    if (n.length === 0) return e;
    let t = ed(n) ?? td(n);
    for (let r = 0; r < t.length; r++) e.push(t[r]);
    return e;
  }
  function jo(n, e, t, r, o) {
    e === Sr.TweenType.From
      ? n.from(t, r, o)
      : e === Sr.TweenType.Set
      ? n.set(t, r, o)
      : n.to(t, r, o);
  }
  function ed(n) {
    let e = new Set([document.documentElement]),
      t = [],
      r = new Map();
    try {
      let o = document.styleSheets;
      for (let i = 0; i < o.length; i++) Bo(o[i].cssRules, n, t, e, r);
      return t;
    } catch {
      return null;
    }
  }
  function Bo(n, e, t, r, o) {
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (s instanceof CSSMediaRule) {
        let l = s.conditionText,
          c = o.get(l);
        c === void 0 && ((c = matchMedia(l).matches), o.set(l, c)),
          c && Bo(s.cssRules, e, t, r, o);
        continue;
      }
      if (!(s instanceof CSSStyleRule)) continue;
      let a = s.style;
      for (let l = 0; l < e.length; l++)
        if (a.getPropertyValue(e[l])) {
          try {
            let c = document.querySelectorAll(s.selectorText);
            for (let u = 0; u < c.length; u++) {
              let d = c[u];
              r.has(d) || (r.add(d), t.push(d));
            }
          } catch {}
          break;
        }
    }
  }
  var Uo = "__ix3__";
  function td(n) {
    let e = document.documentElement,
      t = document.body,
      r = [],
      o = n.length,
      i = [],
      s = [];
    qo(e, n, o, i, s), Vo(t, n, o, r, i, s);
    let a = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT),
      l;
    for (; (l = a.nextNode()); ) Vo(l, n, o, r, i, s);
    for (let c = 0; c < i.length; c++) {
      let u = i[c].style,
        d = s[c];
      for (let f = 0; f < o; f++) {
        let p = d[f];
        p ? u.setProperty(n[f], p) : u.removeProperty(n[f]);
      }
    }
    return r;
  }
  function qo(n, e, t, r, o) {
    let i = n.style,
      s = new Array(t);
    for (let a = 0; a < t; a++) {
      let l = e[a];
      (s[a] = i.getPropertyValue(l)), i.setProperty(l, Uo);
    }
    r.push(n), o.push(s);
  }
  function Vo(n, e, t, r, o, i) {
    let s = getComputedStyle(n);
    for (let a = 0; a < t; a++)
      if (s.getPropertyValue(e[a]) !== Uo) {
        r.push(n), qo(n, e, t, o, i);
        return;
      }
  }
});
var Go = m((Cr) => {
  "use strict";
  Object.defineProperty(Cr, "__esModule", { value: !0 });
  function nd(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  nd(Cr, {
    getFirst: function () {
      return rd;
    },
    getSecond: function () {
      return id;
    },
    pair: function () {
      return od;
    },
  });
  var rd = (n) => n[0],
    id = (n) => n[1],
    od = (n, e) => [n, e];
});
var Ar = m((Mr) => {
  "use strict";
  Object.defineProperty(Mr, "__esModule", { value: !0 });
  function sd(n, e) {
    for (var t in e) Object.defineProperty(n, t, { enumerable: !0, get: e[t] });
  }
  sd(Mr, {
    elementTargetSelector: function () {
      return fd;
    },
    safeClosest: function () {
      return ud;
    },
    safeGetElementById: function () {
      return ad;
    },
    safeMatches: function () {
      return dd;
    },
    safeQuerySelector: function () {
      return cd;
    },
    safeQuerySelectorAll: function () {
      return ld;
    },
  });
  var lt = ze(),
    ad = (n) => {
      try {
        let e = document.getElementById(n);
        return e && !(0, lt.isTransientIX3Clone)(e) ? e : null;
      } catch {
        return null;
      }
    },
    ld = (n, e) => {
      try {
        let t = e.querySelectorAll(n);
        if (t.length === 0) return [];
        let r = [];
        for (let o of t) (0, lt.isTransientIX3Clone)(o) || r.push(o);
        return r;
      } catch {
        return null;
      }
    },
    cd = (n, e) => {
      try {
        let t = e.querySelector(n);
        if (!t) return null;
        if (!(0, lt.isTransientIX3Clone)(t)) return t;
        let r = e.querySelectorAll(n);
        for (let o of r) if (!(0, lt.isTransientIX3Clone)(o)) return o;
        return null;
      } catch {
        return null;
      }
    },
    ud = (n, e) => {
      try {
        return n.closest(e);
      } catch {
        return null;
      }
    },
    dd = (n, e) => {
      try {
        return n.matches(e);
      } catch {
        return null;
      }
    },
    fd = (n) => `[data-wf-target*="${CSS.escape(`[${JSON.stringify(n)}`)}"]`;
});
var Ho = m((Ir) => {
  "use strict";
  Object.defineProperty(Ir, "__esModule", { value: !0 });
  Object.defineProperty(Ir, "applyScope", {
    enumerable: !0,
    get: function () {
      return gd;
    },
  });
  var K = Q(),
    ct = Ar(),
    pd = ze(),
    X = (n) => n.filter((e) => !(0, pd.isTransientIX3Clone)(e)),
    gd = (n, e) => {
      let t = X(n);
      if (!e) return t;
      if (Array.isArray(e)) {
        let [r, o] = e,
          i = [];
        switch (r) {
          case K.TargetScope.FIRST_ANCESTOR:
            for (let s of t) {
              let a = o ? (0, ct.safeClosest)(s, o) : null;
              a && i.push(a);
            }
            return X(i);
          case K.TargetScope.FIRST_DESCENDANT:
            for (let s of t) {
              let a = o ? (0, ct.safeQuerySelector)(o, s) : s.firstElementChild;
              a && i.push(a);
            }
            return X(i);
          case K.TargetScope.DESCENDANTS:
            for (let s of t)
              i.push(...((0, ct.safeQuerySelectorAll)(o, s) || []));
            return X(i);
          case K.TargetScope.ANCESTORS:
            for (let s of t) {
              let a = s.parentElement;
              for (; a; )
                (!o || (0, ct.safeMatches)(a, o)) && i.push(a),
                  (a = a.parentElement);
            }
            return X(i);
        }
      }
      switch (e) {
        case K.TargetScope.CHILDREN:
          return X(t.flatMap((r) => [...r.children]));
        case K.TargetScope.PARENT:
          return X(t.map((r) => r.parentElement).filter(Boolean));
        case K.TargetScope.SIBLINGS:
          return X(
            t.flatMap((r) =>
              r.parentElement
                ? [...r.parentElement.children].filter((o) => o !== r)
                : []
            )
          );
        case K.TargetScope.NEXT:
          return X(t.flatMap((r) => r.nextElementSibling || []));
        case K.TargetScope.PREVIOUS:
          return X(t.flatMap((r) => r.previousElementSibling || []));
        default:
          return t;
      }
    };
});
var zo = m((Or) => {
  "use strict";
  Object.defineProperty(Or, "__esModule", { value: !0 });
  Object.defineProperty(Or, "build", {
    enumerable: !0,
    get: function () {
      return hd;
    },
  });
  var be = Go(),
    Te = Ar(),
    re = Ho();
  function hd(n) {
    let e = [];
    n.addTargetResolver("id", {
      resolve: ([, t]) => {
        let [r, o] = Array.isArray(t) ? t : [t],
          i = r ? (0, Te.safeGetElementById)(r) : null;
        return i ? (0, re.applyScope)([i], o) : e;
      },
    })
      .addTargetResolver("trigger-only", {
        resolve: ([, t], { triggerElement: r }) =>
          r ? (0, re.applyScope)([r], Array.isArray(t) ? t[1] : void 0) : e,
        isDynamic: !0,
      })
      .addTargetResolver("trigger-only-parent", {
        resolve: ([, t], { triggerElement: r }) => {
          if (!r) return e;
          let o = r.parentElement;
          return o instanceof HTMLElement
            ? (0, re.applyScope)([o], Array.isArray(t) ? t[1] : void 0)
            : e;
        },
        isDynamic: !0,
      })
      .addTargetResolver("inst", {
        resolve: ([, t], { triggerElement: r }) => {
          if (!Array.isArray(t)) return e;
          let [o, i] = t,
            s = Array.isArray(o),
            a = s ? (0, be.pair)(o[0], o[1]) : (0, be.pair)(o, i),
            l = (0, Te.safeQuerySelectorAll)(
              (0, Te.elementTargetSelector)(a),
              document
            );
          if (!l?.length) return e;
          let c = [...l];
          if (!r) return (0, re.applyScope)(c, s ? i : void 0);
          let u = r.dataset.wfTarget;
          if (!u) return c;
          try {
            let d = JSON.parse(u),
              f = (0, be.getFirst)(a),
              p = d.find((g) => (0, be.getFirst)((0, be.getFirst)(g)) === f);
            return p
              ? (0, re.applyScope)(
                  c.filter((g) =>
                    (g.dataset.wfTarget || "").includes(
                      `${JSON.stringify((0, be.getSecond)(p))}]`
                    )
                  ),
                  s ? i : void 0
                )
              : e;
          } catch {
            return e;
          }
        },
        isDynamic: !0,
      })
      .addTargetResolver("class", {
        resolve: ([, t]) => {
          let [r, o] = Array.isArray(t) ? t : [t],
            i = r ? (0, Te.safeQuerySelectorAll)(`.${r}`, document) : null;
          return i ? (0, re.applyScope)([...i], o) : e;
        },
      })
      .addTargetResolver("selector", {
        resolve: ([, t]) => {
          let [r, o] = Array.isArray(t) ? t : [t],
            i = r ? (0, Te.safeQuerySelectorAll)(r, document) : null;
          return i ? (0, re.applyScope)([...i], o) : e;
        },
      })
      .addTargetResolver("body", { resolve: () => [document.body] })
      .addTargetResolver("attribute", {
        resolve: ([, t]) => {
          let [r, o] = Array.isArray(t) ? t : [t],
            i = r ? (0, Te.safeQuerySelectorAll)(r, document) : null;
          return i ? (0, re.applyScope)([...i], o) : e;
        },
      })
      .addTargetResolver("any-element", { resolve: () => e })
      .addTargetResolver("viewport", {
        resolve: () => [document.documentElement],
      });
  }
});
var Yo = m((_r) => {
  "use strict";
  Object.defineProperty(_r, "__esModule", { value: !0 });
  Object.defineProperty(_r, "plugin", {
    enumerable: !0,
    get: function () {
      return Cd;
    },
  });
  var md = qi(),
    yd = eo(),
    vd = ro(),
    Wo = So(),
    bd = Do(),
    Td = $o(),
    wd = zo(),
    Sd = Y(),
    Ed = Q(),
    J = new Sd.RuntimeBuilder(Ed.CORE_PLUGIN_INFO);
  (0, md.build)(J);
  (0, yd.build)(J);
  (0, vd.buildLottieAction)(J);
  (0, Wo.buildRiveAction)(J);
  (0, Wo.buildAnimateRiveAction)(J);
  (0, bd.buildSplineAction)(J);
  (0, Td.buildVariableAction)(J);
  (0, wd.build)(J);
  var Cd = J.buildRuntime();
});
var Xo = m((Rr) => {
  "use strict";
  Object.defineProperty(Rr, "__esModule", { value: !0 });
  Object.defineProperty(Rr, "plugin", {
    enumerable: !0,
    get: function () {
      return Md.plugin;
    },
  });
  var Md = Yo();
});
var Zo = Fr(di()),
  Qo = Fr(Xo());
async function Ad() {
  try {
    let n = await Zo.IX3.init({ doc: document, win: window });
    return (
      await n.registerPlugin(Qo.plugin),
      { register: (e, t) => n.register(e, t), destroy: () => n.destroy() }
    );
  } catch (n) {
    throw (console.error("[Devlink IX3] Engine initialization failed:", n), n);
  }
}
var Xf = { createIX3Engine: Ad };
export { Ad as createIX3Engine, Xf as default };

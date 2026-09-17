var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    if (!("__unenv__" in performance)) {
      const proto = Performance.prototype;
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (key !== "constructor" && !(key in performance)) {
          const desc = Object.getOwnPropertyDescriptor(proto, key);
          if (desc) {
            Object.defineProperty(performance, key, desc);
          }
        }
      }
    }
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, unenvProcess, exit, features, platform, _channel, _debugEnd, _debugProcess, _disconnect, _events, _eventsCount, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _handleQueue, _kill, _linkedBinding, _maxListeners, _pendingMessage, _preload_modules, _rawDebug, _send, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, assert2, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, disconnect, dlopen, domain, emit, emitWarning, env, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, hrtime3, initgroups, kill, listenerCount, listeners, loadEnvFile, mainModule, memoryUsage, moduleLoadList, nextTick, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      _channel,
      _debugEnd,
      _debugProcess,
      _disconnect,
      _events,
      _eventsCount,
      _exiting,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _handleQueue,
      _kill,
      _linkedBinding,
      _maxListeners,
      _pendingMessage,
      _preload_modules,
      _rawDebug,
      _send,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      assert: assert2,
      availableMemory,
      binding,
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      disconnect,
      dlopen,
      domain,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      hrtime: hrtime3,
      initgroups,
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      mainModule,
      memoryUsage,
      moduleLoadList,
      nextTick,
      off,
      on,
      once,
      openStdin,
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit,
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/jose/dist/webapi/lib/buffer_utils.js
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0), buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers)
    buf.set(buffer, i), i += buffer.length;
  return buf;
}
function encode(string) {
  if (typeof string == "string" && string.length >= 128) {
    if (NON_ASCII.test(string))
      throw new TypeError("non-ASCII string encountered in encode()");
    return encoder.encode(string);
  }
  const bytes = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    const code = string.charCodeAt(i);
    if (code > 127)
      throw new TypeError("non-ASCII string encountered in encode()");
    bytes[i] = code;
  }
  return bytes;
}
function encodeBase64(input, url = false) {
  if (Uint8Array.prototype.toBase64)
    return input.toBase64({ alphabet: url ? "base64url" : "base64", omitPadding: url });
  const CHUNK_SIZE = 32768, arr = [];
  for (let i = 0; i < input.length; i += CHUNK_SIZE)
    arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
  const encoded = btoa(arr.join(""));
  return url ? encoded.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_") : encoded;
}
function decodeBase64(encoded, url = false) {
  if (Uint8Array.fromBase64)
    return Uint8Array.fromBase64(encoded, { alphabet: url ? "base64url" : "base64" });
  if (url) {
    if (encoded.includes("+") || encoded.includes("/"))
      throw new TypeError("Invalid base64url");
    encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  }
  const binary = atob(encoded), bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++)
    bytes[i] = binary.charCodeAt(i);
  return bytes;
}
var encoder, decoder, strictDecoder, MAX_INT32, NON_ASCII;
var init_buffer_utils = __esm({
  "node_modules/jose/dist/webapi/lib/buffer_utils.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    encoder = new TextEncoder();
    decoder = new TextDecoder();
    strictDecoder = new TextDecoder("utf-8", { fatal: true });
    MAX_INT32 = 2 ** 32;
    __name(concat, "concat");
    NON_ASCII = /[^\x00-\x7f]/;
    __name(encode, "encode");
    __name(encodeBase64, "encodeBase64");
    __name(decodeBase64, "decodeBase64");
  }
});

// node_modules/jose/dist/webapi/util/errors.js
var JOSEError, JWTClaimValidationFailed, JWTExpired, JOSEAlgNotAllowed, JOSENotSupported, JWSInvalid, JWTInvalid, JWSSignatureVerificationFailed;
var init_errors = __esm({
  "node_modules/jose/dist/webapi/util/errors.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    JOSEError = class extends Error {
      static {
        __name(this, "JOSEError");
      }
      static code = "ERR_JOSE_GENERIC";
      code = "ERR_JOSE_GENERIC";
      constructor(message2, options) {
        super(message2, options), this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
      }
    };
    JWTClaimValidationFailed = class extends JOSEError {
      static {
        __name(this, "JWTClaimValidationFailed");
      }
      static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
      code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
      claim;
      reason;
      payload;
      constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
        super(message2, { cause: { claim, reason, payload } }), this.claim = claim, this.reason = reason, this.payload = payload;
      }
    };
    JWTExpired = class extends JOSEError {
      static {
        __name(this, "JWTExpired");
      }
      static code = "ERR_JWT_EXPIRED";
      code = "ERR_JWT_EXPIRED";
      claim;
      reason;
      payload;
      constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
        super(message2, { cause: { claim, reason, payload } }), this.claim = claim, this.reason = reason, this.payload = payload;
      }
    };
    JOSEAlgNotAllowed = class extends JOSEError {
      static {
        __name(this, "JOSEAlgNotAllowed");
      }
      static code = "ERR_JOSE_ALG_NOT_ALLOWED";
      code = "ERR_JOSE_ALG_NOT_ALLOWED";
    };
    JOSENotSupported = class extends JOSEError {
      static {
        __name(this, "JOSENotSupported");
      }
      static code = "ERR_JOSE_NOT_SUPPORTED";
      code = "ERR_JOSE_NOT_SUPPORTED";
    };
    JWSInvalid = class extends JOSEError {
      static {
        __name(this, "JWSInvalid");
      }
      static code = "ERR_JWS_INVALID";
      code = "ERR_JWS_INVALID";
    };
    JWTInvalid = class extends JOSEError {
      static {
        __name(this, "JWTInvalid");
      }
      static code = "ERR_JWT_INVALID";
      code = "ERR_JWT_INVALID";
    };
    JWSSignatureVerificationFailed = class extends JOSEError {
      static {
        __name(this, "JWSSignatureVerificationFailed");
      }
      static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
      code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
      constructor(message2 = "signature verification failed", options) {
        super(message2, options);
      }
    };
  }
});

// node_modules/jose/dist/webapi/util/base64url.js
function decode(input) {
  try {
    return decodeBase64(typeof input == "string" ? input : decoder.decode(input), true);
  } catch (cause) {
    throw new TypeError(invalid, { cause });
  }
}
function encode2(input) {
  return encodeBase64(typeof input == "string" ? encoder.encode(input) : input, true);
}
var invalid;
var init_base64url = __esm({
  "node_modules/jose/dist/webapi/util/base64url.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_buffer_utils();
    invalid = "The input to be decoded is not correctly encoded.";
    __name(decode, "decode");
    __name(encode2, "encode");
  }
});

// node_modules/jose/dist/webapi/lib/validate.js
function isObject(input) {
  if (typeof input != "object" || input === null || Object.prototype.toString.call(input) !== "[object Object]")
    return false;
  const prototype = Object.getPrototypeOf(input);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
}
function isDisjoint(...headers) {
  const parameters = /* @__PURE__ */ new Set();
  for (const header of headers)
    if (header)
      for (const parameter of Object.keys(header)) {
        if (parameters.has(parameter))
          return false;
        parameters.add(parameter);
      }
  return true;
}
function assertNotSet(value, name) {
  if (value !== void 0)
    throw new TypeError(`${name} can only be called once`);
}
function decodeBase64url(value, label, ErrorClass) {
  try {
    return decode(value);
  } catch {
    throw new ErrorClass(`Failed to base64url decode the ${label}`);
  }
}
function encodeBase64url(value, label, ErrorClass) {
  try {
    return encode(value);
  } catch {
    throw new ErrorClass(`The ${label} is not a valid base64url string`);
  }
}
function parseJoseHeader(b64, ErrorClass, message2) {
  let parsed;
  try {
    parsed = JSON.parse(strictDecoder.decode(decode(b64)));
  } catch {
    throw new ErrorClass(message2);
  }
  if (!isObject(parsed))
    throw new ErrorClass(message2);
  return parsed;
}
function validateAlgorithms(option, algorithms) {
  if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s != "string")))
    throw new TypeError(`"${option}" option must be an array of strings`);
  return algorithms === void 0 ? void 0 : new Set(algorithms);
}
function validateCritDuplicates(Err, protectedHeader) {
  const { crit } = protectedHeader ?? {};
  if (Array.isArray(crit) && new Set(crit).size !== crit.length)
    throw new Err('"crit" (Critical) Header Parameter MUST NOT contain duplicate values');
}
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
  if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0)
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
  if (!protectedHeader || protectedHeader.crit === void 0)
    return [];
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input != "string" || input.length === 0))
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  const recognized = recognizedOption === void 0 ? recognizedDefault : { __proto__: null, ...recognizedOption, ...recognizedDefault };
  for (const parameter of protectedHeader.crit) {
    if (!(parameter in recognized))
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    if (!Object.hasOwn(joseHeader, parameter) || joseHeader[parameter] === void 0)
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    if (recognized[parameter] && (!Object.hasOwn(protectedHeader, parameter) || protectedHeader[parameter] === void 0))
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
  }
  return protectedHeader.crit;
}
function validateB64(protectedHeader, extensions) {
  if (extensions.includes("b64")) {
    const b64 = protectedHeader.b64;
    if (typeof b64 != "boolean")
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    return b64;
  }
  return true;
}
function serializeJoseHeader(Err, header) {
  let serialized, parsed;
  try {
    serialized = JSON.stringify(header), parsed = JSON.parse(serialized);
  } catch (cause) {
    throw new Err("JOSE Header is not valid JSON", { cause });
  }
  if (!isObject(parsed))
    throw new Err("JOSE Header is not a JSON object");
  return [parsed, serialized];
}
var JWS_RECOGNIZED;
var init_validate = __esm({
  "node_modules/jose/dist/webapi/lib/validate.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    init_base64url();
    init_buffer_utils();
    __name(isObject, "isObject");
    __name(isDisjoint, "isDisjoint");
    __name(assertNotSet, "assertNotSet");
    __name(decodeBase64url, "decodeBase64url");
    __name(encodeBase64url, "encodeBase64url");
    __name(parseJoseHeader, "parseJoseHeader");
    JWS_RECOGNIZED = { __proto__: null, b64: true };
    __name(validateAlgorithms, "validateAlgorithms");
    __name(validateCritDuplicates, "validateCritDuplicates");
    __name(validateCrit, "validateCrit");
    __name(validateB64, "validateB64");
    __name(serializeJoseHeader, "serializeJoseHeader");
  }
});

// node_modules/jose/dist/webapi/lib/key.js
async function prepareKey(entry, key, usage) {
  const { alg, secret } = entry, privateKey = usage === "decrypt" || usage === "sign";
  if (secret && key instanceof Uint8Array)
    return key;
  let normalized, keyObject;
  if (isObject(key)) {
    if (normalized = normalizeJwk(key), typeof normalized.kty != "string")
      throw invalidKeyType(alg, key, secret);
    if (!(secret ? normalized.kty === "oct" && typeof normalized.k == "string" : normalized.kty !== "oct" && (privateKey ? normalized.kty === "AKP" && typeof normalized.priv == "string" || typeof normalized.d == "string" : normalized.d === void 0 && normalized.priv === void 0)))
      throw new TypeError(secret ? 'JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present' : `JSON Web Key for this operation must be a ${privateKey ? "private" : "public"} JWK`);
    if (jwkMatchesOp(entry, normalized, usage), normalized.kty === "oct")
      return decode(normalized.k);
    if (!Object.isFrozen(key)) {
      const { key_ops } = key;
      Array.isArray(key_ops) && Object.freeze(key_ops), Object.freeze(key);
    }
  } else {
    if (!isKeyLike(key))
      throw invalidKeyType(alg, key, secret);
    const expectedType = secret ? "secret" : privateKey ? "private" : "public";
    if (key.type !== expectedType && (secret || ["secret", "public", "private"].includes(key.type)))
      throw new TypeError(`${tag(key)} instances must be of type "${expectedType}" for the ${alg} algorithm`);
    if (isCryptoKey(key))
      return key;
    if (keyObject = key, keyObject.type === "secret")
      return keyObject.export();
  }
  cache ||= /* @__PURE__ */ new WeakMap();
  const cacheKey = key;
  let cached = cache.get(cacheKey);
  if (cached?.[alg])
    return cached[alg];
  if (cached || cache.set(cacheKey, cached = {}), keyObject && typeof keyObject.toCryptoKey == "function") {
    const isPublic = keyObject.type === "public", crv = nist[keyObject.asymmetricKeyDetails?.namedCurve], params = entry.resolve?.({ crv, asymmetricKeyType: keyObject.asymmetricKeyType }) ?? entry.subtle;
    return cached[alg] = keyObject.toCryptoKey(params, isPublic, entry.usages[isPublic ? 0 : 1]);
  }
  return normalized ??= keyObject.export({ format: "jwk" }), normalized.alg = alg, cached[alg] = await jwkToKey(entry, normalized);
}
function message(msg, actual, ...types) {
  if (types.length > 2) {
    const last = types.pop();
    msg += `one of type ${types.join(", ")}, or ${last}.`;
  } else types.length === 2 ? msg += `one of type ${types[0]} or ${types[1]}.` : msg += `of type ${types[0]}.`;
  return actual == null ? msg += ` Received ${actual}` : typeof actual == "function" && actual.name ? msg += ` Received function ${actual.name}` : typeof actual == "object" && actual != null && actual.constructor?.name && (msg += ` Received an instance of ${actual.constructor.name}`), msg;
}
function invalidKeyType(alg, actual, secret) {
  const types = ["CryptoKey", "KeyObject", "JSON Web Key"];
  return secret && types.push("Uint8Array"), new TypeError(message(`Key for the ${alg} algorithm must be `, actual, ...types));
}
function checkUsage(key, usage) {
  if (usage && !key.usages.includes(usage))
    throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
}
function checkModulusLength(alg, key) {
  const { modulusLength } = key.algorithm;
  if (typeof modulusLength != "number" || modulusLength < 2048)
    throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
}
function checkCryptoKey(key, expected, usage) {
  const algorithm = key.algorithm;
  if (algorithm.name !== expected.name)
    throw unusable(expected.name);
  if (expected.hash && algorithm.hash?.name !== expected.hash)
    throw unusable(expected.hash, "algorithm.hash");
  if (expected.namedCurve && algorithm.namedCurve !== expected.namedCurve)
    throw unusable(expected.namedCurve, "algorithm.namedCurve");
  if (expected.length !== void 0 && algorithm.length !== expected.length)
    throw unusable(expected.length, "algorithm.length");
  checkUsage(key, usage);
}
function snapshotJwk(jwk) {
  return { __proto__: null, ...jwk };
}
function normalizeJwk(jwk) {
  const normalized = snapshotJwk(jwk);
  if (normalized.ext !== void 0 && typeof normalized.ext != "boolean")
    throw new TypeError('"ext" (Extractable) Parameter must be a boolean');
  if (normalized.key_ops !== void 0) {
    const value = normalized.key_ops, keyOps = Array.isArray(value) ? [...value] : void 0;
    if (!keyOps || keyOps.some((operation) => typeof operation != "string") || new Set(keyOps).size !== keyOps.length)
      throw new TypeError('"key_ops" (Key Operations) Parameter must be an array of unique strings');
    normalized.key_ops = keyOps;
  }
  return normalized;
}
async function jwkToKey(entry, jwk, extractable) {
  if (!entry.kty.includes(jwk.kty))
    throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
  const algorithm = entry.resolve?.({ kty: jwk.kty, crv: jwk.crv }) ?? entry.subtle, isPrivate = !!(jwk.d || jwk.priv), keyData = { ...jwk, ext: extractable ?? jwk.ext };
  return keyData.kty !== "AKP" && delete keyData.alg, delete keyData.use, crypto.subtle.importKey("jwk", keyData, algorithm, keyData.ext ?? !isPrivate, jwk.key_ops ?? entry.usages[isPrivate ? 1 : 0]);
}
async function rawKey(key, expected, usage, extractable = false) {
  return key instanceof Uint8Array && (key = await crypto.subtle.importKey("raw", key, expected, extractable, [usage])), checkCryptoKey(key, expected, usage), key;
}
var tag, jwkMatchesOp, cache, nist, isCryptoKey, isKeyObject, isKeyLike, unusable;
var init_key = __esm({
  "node_modules/jose/dist/webapi/lib/key.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_validate();
    init_base64url();
    init_errors();
    tag = /* @__PURE__ */ __name((key) => key[Symbol.toStringTag], "tag");
    jwkMatchesOp = /* @__PURE__ */ __name((entry, key, usage) => {
      const { alg } = entry;
      if (key.use !== void 0) {
        const expected = usage === "sign" || usage === "verify" ? "sig" : "enc";
        if (key.use !== expected)
          throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
      }
      if (key.alg !== void 0 && key.alg !== alg)
        throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
      if (Array.isArray(key.key_ops)) {
        const expectedKeyOp = usage === "encrypt" || usage === "decrypt" ? entry.ops?.[usage === "encrypt" ? 0 : 1] : usage;
        if (expectedKeyOp && !key.key_ops.includes(expectedKeyOp))
          throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
      }
    }, "jwkMatchesOp");
    __name(prepareKey, "prepareKey");
    nist = {
      __proto__: null,
      prime256v1: "P-256",
      secp384r1: "P-384",
      secp521r1: "P-521"
    };
    isCryptoKey = /* @__PURE__ */ __name((key) => {
      if (key?.[Symbol.toStringTag] === "CryptoKey")
        return true;
      try {
        return key instanceof CryptoKey;
      } catch {
        return false;
      }
    }, "isCryptoKey");
    isKeyObject = /* @__PURE__ */ __name((key) => key?.[Symbol.toStringTag] === "KeyObject", "isKeyObject");
    isKeyLike = /* @__PURE__ */ __name((key) => isCryptoKey(key) || isKeyObject(key), "isKeyLike");
    __name(message, "message");
    __name(invalidKeyType, "invalidKeyType");
    unusable = /* @__PURE__ */ __name((name, prop = "algorithm.name") => new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`), "unusable");
    __name(checkUsage, "checkUsage");
    __name(checkModulusLength, "checkModulusLength");
    __name(checkCryptoKey, "checkCryptoKey");
    __name(snapshotJwk, "snapshotJwk");
    __name(normalizeJwk, "normalizeJwk");
    __name(jwkToKey, "jwkToKey");
    __name(rawKey, "rawKey");
  }
});

// node_modules/jose/dist/webapi/lib/key_descriptor.js
function table3(entries) {
  const out = { __proto__: null };
  for (const alg in entries)
    out[alg] = { ...entries[alg], alg };
  return out;
}
var init_key_descriptor = __esm({
  "node_modules/jose/dist/webapi/lib/key_descriptor.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(table3, "table");
  }
});

// node_modules/jose/dist/webapi/lib/jws_algorithms.js
function hmac(bits) {
  const subtle = { name: "HMAC", hash: `SHA-${bits}` };
  return { kty: ["oct"], secret: true, subtle, signing: subtle, usages: sig };
}
function rsa(bits, saltLength) {
  const subtle = { name: saltLength ? "RSA-PSS" : "RSASSA-PKCS1-v1_5", hash: `SHA-${bits}` };
  return {
    kty: ["RSA"],
    subtle,
    signing: saltLength ? { ...subtle, saltLength } : subtle,
    usages: sig,
    minRsaBits: 2048
  };
}
function ecdsa(crv, bits) {
  return {
    kty: ["EC"],
    crv,
    subtle: { name: "ECDSA", namedCurve: crv },
    signing: { name: "ECDSA", hash: `SHA-${bits}` },
    usages: sig
  };
}
function eddsa() {
  const subtle = { name: "Ed25519" };
  return {
    kty: ["OKP"],
    crv: "Ed25519",
    subtle,
    signing: subtle,
    usages: sig
  };
}
function mldsa(bits) {
  const subtle = { name: `ML-DSA-${bits}` };
  return {
    kty: ["AKP"],
    subtle,
    signing: subtle,
    usages: sig
  };
}
function jwsAlgorithm(alg) {
  const entry = typeof alg == "string" ? JWS[alg] : void 0;
  if (!entry)
    throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  return entry;
}
var sig, JWS;
var init_jws_algorithms = __esm({
  "node_modules/jose/dist/webapi/lib/jws_algorithms.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    init_key_descriptor();
    sig = [["verify"], ["sign"]];
    __name(hmac, "hmac");
    __name(rsa, "rsa");
    __name(ecdsa, "ecdsa");
    __name(eddsa, "eddsa");
    __name(mldsa, "mldsa");
    JWS = table3({
      HS256: hmac(256),
      HS384: hmac(384),
      HS512: hmac(512),
      RS256: rsa(256),
      RS384: rsa(384),
      RS512: rsa(512),
      PS256: rsa(256, 32),
      PS384: rsa(384, 48),
      PS512: rsa(512, 64),
      ES256: ecdsa("P-256", 256),
      ES384: ecdsa("P-384", 384),
      ES512: ecdsa("P-521", 512),
      EdDSA: eddsa(),
      Ed25519: eddsa(),
      "ML-DSA-44": mldsa(44),
      "ML-DSA-65": mldsa(65),
      "ML-DSA-87": mldsa(87)
    });
    __name(jwsAlgorithm, "jwsAlgorithm");
  }
});

// node_modules/jose/dist/webapi/lib/jws_verify.js
function prepareVerify(options) {
  return [options && validateAlgorithms("algorithms", options.algorithms), options?.crit];
}
function parseProtectedHeader(encodedProtected) {
  return encodedProtected === void 0 ? {} : parseJoseHeader(encodedProtected, JWSInvalid, "JWS Protected Header is invalid");
}
function encodeCompactUnencodedPayload(payload) {
  try {
    return encode(payload);
  } catch {
    throw new JWSInvalid("JWS Compact Serialization payload must use only ASCII characters");
  }
}
async function verifySignature(jws, shared, key, encodeUnencodedPayload, parsedProtected) {
  const { protected: encodedProtected, header, payload: inputPayload } = jws, parsedProt = parsedProtected ?? parseProtectedHeader(encodedProtected);
  if (!isDisjoint(parsedProt, header))
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  const joseHeader = { ...parsedProt, ...header }, b64 = validateB64(parsedProt, validateCrit(JWSInvalid, JWS_RECOGNIZED, shared[1], parsedProt, joseHeader)), { alg } = joseHeader;
  if (typeof alg != "string" || !alg)
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  if (shared[0] && !shared[0].has(alg))
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  if (b64) {
    if (typeof inputPayload != "string")
      throw new JWSInvalid("JWS Payload must be a string");
  } else if (typeof inputPayload != "string" && !(inputPayload instanceof Uint8Array))
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  const signingPayload = b64 || typeof inputPayload != "string" ? inputPayload : encodeUnencodedPayload(inputPayload);
  let resolvedKey = false;
  typeof key == "function" && (key = await key(parsedProt, jws), resolvedKey = true);
  const entry = jwsAlgorithm(alg), data = concat(encodedProtected !== void 0 ? encode(encodedProtected) : new Uint8Array(), encode("."), typeof signingPayload == "string" ? shared[2] ??= encodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload), signature = decodeBase64url(jws.signature, "signature", JWSInvalid), k = await prepareKey(entry, key, "verify"), cryptoKey = await rawKey(k, entry.subtle, "verify");
  entry.minRsaBits && checkModulusLength(entry.alg, cryptoKey);
  let verified = false;
  try {
    verified = await crypto.subtle.verify(entry.signing, cryptoKey, signature, data);
  } catch {
  }
  if (!verified)
    throw new JWSSignatureVerificationFailed();
  const result = { payload: typeof signingPayload == "string" ? decodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload };
  return encodedProtected !== void 0 && (result.protectedHeader = parsedProt), header !== void 0 && (result.unprotectedHeader = header), resolvedKey ? [{ ...result, key: k }, b64] : [result, b64];
}
async function verifyCompact(jws, shared, key) {
  if (jws instanceof Uint8Array && (jws = decoder.decode(jws)), typeof jws != "string")
    throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
  if (length !== 3)
    throw new JWSInvalid("Invalid Compact JWS");
  return verifySignature({ payload, protected: protectedHeader, signature }, shared, key, encodeCompactUnencodedPayload);
}
var init_jws_verify = __esm({
  "node_modules/jose/dist/webapi/lib/jws_verify.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_jws_algorithms();
    init_errors();
    init_buffer_utils();
    init_validate();
    init_key();
    __name(prepareVerify, "prepareVerify");
    __name(parseProtectedHeader, "parseProtectedHeader");
    __name(encodeCompactUnencodedPayload, "encodeCompactUnencodedPayload");
    __name(verifySignature, "verifySignature");
    __name(verifyCompact, "verifyCompact");
  }
});

// node_modules/jose/dist/webapi/lib/jwt_claims_set.js
function invalidDuration() {
  throw new TypeError("Invalid time period format");
}
function secs(str) {
  typeof str != "string" && invalidDuration();
  const matched = REGEX.exec(str);
  (!matched || matched[4] && matched[1]) && invalidDuration();
  const value = parseFloat(matched[2]), numericDate2 = Math.round(value * multipliers[matched[3][0].toLowerCase()]);
  return Number.isFinite(numericDate2) || invalidDuration(), matched[1] === "-" || matched[4] === "ago" ? -numericDate2 : numericDate2;
}
function validateInput(label, input) {
  if (!Number.isFinite(input))
    throw new TypeError(`Invalid ${label} input`);
  return input;
}
function validateStringClaim(claim, value) {
  if (typeof value != "string")
    throw new TypeError(`"${claim}" claim must be a string`);
}
function validateAudienceClaim(value) {
  if (typeof value != "string" && (!Array.isArray(value) || Array.from(value).some((member) => typeof member != "string")))
    throw new TypeError('"aud" claim must be a string or an array of strings');
}
function numericDate(value, label) {
  return typeof value == "number" ? validateInput(label, value) : value instanceof Date ? validateInput(label, epoch(value)) : epoch(/* @__PURE__ */ new Date()) + secs(value);
}
function validateNumericDate(payload, claim, required = false) {
  const value = payload[claim];
  if (!(value === void 0 && !required)) {
    if (typeof value != "number")
      throw new JWTClaimValidationFailed(`"${claim}" claim must be a number`, payload, claim, "invalid");
    return value;
  }
}
function unexpectedClaim(payload, claim) {
  throw new JWTClaimValidationFailed(`unexpected "${claim}" claim value`, payload, claim, checkFailed);
}
function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
  let payload;
  try {
    payload = JSON.parse(strictDecoder.decode(encodedPayload));
  } catch {
  }
  if (!isObject(payload))
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  const { typ } = options;
  if (typ !== void 0 && (typeof protectedHeader.typ != "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ)))
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", checkFailed);
  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options, presenceCheck = [...requiredClaims];
  maxTokenAge !== void 0 && presenceCheck.push("iat"), audience !== void 0 && presenceCheck.push("aud"), subject !== void 0 && presenceCheck.push("sub"), issuer !== void 0 && presenceCheck.push("iss");
  for (const claim of new Set(presenceCheck.reverse()))
    if (!Object.hasOwn(payload, claim))
      throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
  issuer !== void 0 && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss) && unexpectedClaim(payload, "iss"), subject !== void 0 && payload.sub !== subject && unexpectedClaim(payload, "sub"), audience !== void 0 && !checkAudiencePresence(payload.aud, typeof audience == "string" ? [audience] : audience) && unexpectedClaim(payload, "aud");
  const { clockTolerance } = options;
  let tolerance = 0;
  if (typeof clockTolerance == "string")
    tolerance = secs(clockTolerance);
  else if (clockTolerance !== void 0) {
    if (typeof clockTolerance != "number")
      throw new TypeError("Invalid clockTolerance option type");
    tolerance = clockTolerance;
  }
  validateInput("clockTolerance option", tolerance);
  const { currentDate } = options, now = validateInput("currentDate option", epoch(currentDate === void 0 ? /* @__PURE__ */ new Date() : currentDate)), iat = validateNumericDate(payload, "iat", maxTokenAge !== void 0), nbf = validateNumericDate(payload, "nbf");
  if (nbf !== void 0 && nbf > now + tolerance)
    throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", checkFailed);
  const exp = validateNumericDate(payload, "exp");
  if (exp !== void 0 && exp <= now - tolerance)
    throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", checkFailed);
  if (maxTokenAge !== void 0) {
    const age = now - iat, max = validateInput("maxTokenAge option", typeof maxTokenAge == "number" ? maxTokenAge : secs(maxTokenAge));
    if (age - tolerance > max)
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", checkFailed);
    if (age < -tolerance)
      throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", checkFailed);
  }
  return payload;
}
function producerPayload(producer) {
  return producerPayloads.get(producer);
}
function jwtData(producer) {
  const payload = producerPayload(producer);
  for (const claim of ["iat", "nbf", "exp"]) {
    const value = payload[claim];
    if (typeof value == "number" && !Number.isFinite(value))
      throw new TypeError(`"${claim}" claim must be a finite number`);
  }
  return encoder.encode(JSON.stringify(payload));
}
var epoch, multipliers, REGEX, checkFailed, normalizeTyp, checkAudiencePresence, producerPayloads, JWTClaimsBuilder;
var init_jwt_claims_set = __esm({
  "node_modules/jose/dist/webapi/lib/jwt_claims_set.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_errors();
    init_buffer_utils();
    init_validate();
    epoch = /* @__PURE__ */ __name((date) => Math.floor(date.getTime() / 1e3), "epoch");
    multipliers = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
      w: 604800,
      y: 31557600
    };
    REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
    checkFailed = "check_failed";
    __name(invalidDuration, "invalidDuration");
    __name(secs, "secs");
    __name(validateInput, "validateInput");
    __name(validateStringClaim, "validateStringClaim");
    __name(validateAudienceClaim, "validateAudienceClaim");
    __name(numericDate, "numericDate");
    normalizeTyp = /* @__PURE__ */ __name((value) => {
      const normalized = value.toLowerCase();
      return value.includes("/") ? normalized : `application/${normalized}`;
    }, "normalizeTyp");
    checkAudiencePresence = /* @__PURE__ */ __name((audPayload, audOption) => typeof audPayload == "string" ? audOption.includes(audPayload) : Array.isArray(audPayload) ? audOption.some((aud) => audPayload.includes(aud)) : false, "checkAudiencePresence");
    __name(validateNumericDate, "validateNumericDate");
    __name(unexpectedClaim, "unexpectedClaim");
    __name(validateClaimsSet, "validateClaimsSet");
    __name(producerPayload, "producerPayload");
    __name(jwtData, "jwtData");
    JWTClaimsBuilder = class {
      static {
        __name(this, "JWTClaimsBuilder");
      }
      constructor(payload = {}) {
        if (!isObject(payload))
          throw new TypeError("JWT Claims Set MUST be an object");
        (producerPayloads ||= /* @__PURE__ */ new WeakMap()).set(this, structuredClone(payload));
      }
      setIssuer(value) {
        return validateStringClaim("iss", value), producerPayload(this).iss = value, this;
      }
      setSubject(value) {
        return validateStringClaim("sub", value), producerPayload(this).sub = value, this;
      }
      setAudience(value) {
        return validateAudienceClaim(value), producerPayload(this).aud = value, this;
      }
      setJti(value) {
        return validateStringClaim("jti", value), producerPayload(this).jti = value, this;
      }
      setNotBefore(value) {
        return producerPayload(this).nbf = numericDate(value, "setNotBefore"), this;
      }
      setExpirationTime(value) {
        return producerPayload(this).exp = numericDate(value, "setExpirationTime"), this;
      }
      setIssuedAt(value) {
        const payload = producerPayload(this);
        return value === void 0 ? payload.iat = epoch(/* @__PURE__ */ new Date()) : typeof value == "string" ? payload.iat = validateInput("setIssuedAt", epoch(/* @__PURE__ */ new Date()) + secs(value)) : payload.iat = numericDate(value, "setIssuedAt"), this;
      }
    };
  }
});

// node_modules/jose/dist/webapi/jwt/verify.js
async function jwtVerify(jwt, key, options) {
  const [verified, b64] = await verifyCompact(jwt, prepareVerify(options), key);
  if (!b64)
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  const payload = validateClaimsSet(verified.protectedHeader, verified.payload, options);
  return { ...verified, payload };
}
var init_verify = __esm({
  "node_modules/jose/dist/webapi/jwt/verify.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_jws_verify();
    init_jwt_claims_set();
    init_errors();
    __name(jwtVerify, "jwtVerify");
  }
});

// node_modules/jose/dist/webapi/lib/jws_sign.js
async function createSignature(input, key, rejectUnencoded) {
  let [payload, protectedHeader, unprotectedHeader, crit] = input, protectedHeaderString = "";
  if (protectedHeader !== void 0) {
    const normalized = serializeJoseHeader(JWSInvalid, protectedHeader);
    protectedHeader = normalized[0], protectedHeaderString = encode2(normalized[1]);
  }
  if (unprotectedHeader !== void 0 && (unprotectedHeader = serializeJoseHeader(JWSInvalid, unprotectedHeader)[0]), !protectedHeader && !unprotectedHeader)
    throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
  if (!isDisjoint(protectedHeader, unprotectedHeader))
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  const joseHeader = { ...protectedHeader, ...unprotectedHeader };
  validateCritDuplicates(JWSInvalid, protectedHeader);
  const b64 = validateB64(protectedHeader, validateCrit(JWSInvalid, JWS_RECOGNIZED, crit, protectedHeader, joseHeader));
  b64 || rejectUnencoded?.();
  const { alg } = joseHeader;
  if (typeof alg != "string" || !alg)
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  const entry = jwsAlgorithm(alg);
  let payloadS = "", payloadB = payload, data;
  if (b64) {
    const encoded = input[4];
    encoded ? (payloadS = encoded[0] ??= encode2(payload), payloadB = encoded[1] ??= encode(payloadS)) : (payloadS = encode2(payload), data = encoder.encode(`${protectedHeaderString}.${payloadS}`));
  }
  data ??= concat(encode(protectedHeaderString), encode("."), payloadB);
  const k = await rawKey(await prepareKey(entry, key, "sign"), entry.subtle, "sign");
  entry.minRsaBits && checkModulusLength(entry.alg, k);
  const jws = {
    signature: encode2(new Uint8Array(await crypto.subtle.sign(entry.signing, k, data))),
    payload: payloadS
  };
  return protectedHeader && (jws.protected = protectedHeaderString), unprotectedHeader && (jws.header = unprotectedHeader), [jws, b64];
}
async function createCompactSignature(payload, protectedHeader, crit, key, rejectUnencoded) {
  const [jws] = await createSignature([payload, protectedHeader, void 0, crit], key, rejectUnencoded);
  return `${jws.protected}.${jws.payload}.${jws.signature}`;
}
var init_jws_sign = __esm({
  "node_modules/jose/dist/webapi/lib/jws_sign.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_base64url();
    init_jws_algorithms();
    init_validate();
    init_errors();
    init_buffer_utils();
    init_key();
    __name(createSignature, "createSignature");
    __name(createCompactSignature, "createCompactSignature");
  }
});

// node_modules/jose/dist/webapi/jwt/sign.js
var SignJWT_base, SignJWT;
var init_sign = __esm({
  "node_modules/jose/dist/webapi/jwt/sign.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_jws_sign();
    init_errors();
    init_jwt_claims_set();
    init_validate();
    SignJWT_base = JWTClaimsBuilder;
    SignJWT = class extends SignJWT_base {
      static {
        __name(this, "SignJWT");
      }
      #protectedHeader;
      setProtectedHeader(protectedHeader) {
        return assertNotSet(this.#protectedHeader, "setProtectedHeader"), this.#protectedHeader = protectedHeader, this;
      }
      async sign(key, options) {
        return createCompactSignature(jwtData(this), this.#protectedHeader, options?.crit, key, () => {
          throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
        });
      }
    };
  }
});

// node_modules/jose/dist/webapi/index.js
var init_webapi = __esm({
  "node_modules/jose/dist/webapi/index.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_verify();
    init_sign();
  }
});

// node_modules/bcryptjs/index.js
import nodeCrypto from "crypto";
function randomBytes(len) {
  try {
    return crypto.getRandomValues(new Uint8Array(len));
  } catch {
  }
  try {
    return nodeCrypto.randomBytes(len);
  } catch {
  }
  if (!randomFallback) {
    throw Error(
      "Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative"
    );
  }
  return randomFallback(len);
}
function genSaltSync(rounds, seed_length) {
  rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
  if (typeof rounds !== "number")
    throw Error(
      "Illegal arguments: " + typeof rounds + ", " + typeof seed_length
    );
  if (rounds < 4) rounds = 4;
  else if (rounds > 31) rounds = 31;
  var salt = [];
  salt.push("$2b$");
  if (rounds < 10) salt.push("0");
  salt.push(rounds.toString());
  salt.push("$");
  salt.push(base64_encode(randomBytes(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN));
  return salt.join("");
}
function genSalt(rounds, seed_length, callback) {
  if (typeof seed_length === "function")
    callback = seed_length, seed_length = void 0;
  if (typeof rounds === "function") callback = rounds, rounds = void 0;
  if (typeof rounds === "undefined") rounds = GENSALT_DEFAULT_LOG2_ROUNDS;
  else if (typeof rounds !== "number")
    throw Error("illegal arguments: " + typeof rounds);
  function _async(callback2) {
    nextTick2(function() {
      try {
        callback2(null, genSaltSync(rounds));
      } catch (err) {
        callback2(err);
      }
    });
  }
  __name(_async, "_async");
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
function hash(password, salt, callback, progressCallback) {
  function _async(callback2) {
    if (typeof password === "string" && typeof salt === "number")
      genSalt(salt, function(err, salt2) {
        _hash(password, salt2, callback2, progressCallback);
      });
    else if (typeof password === "string" && typeof salt === "string")
      _hash(password, salt, callback2, progressCallback);
    else
      nextTick2(
        callback2.bind(
          this,
          Error("Illegal arguments: " + typeof password + ", " + typeof salt)
        )
      );
  }
  __name(_async, "_async");
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
function safeStringCompare(known, unknown) {
  var diff = known.length ^ unknown.length;
  for (var i = 0; i < known.length; ++i) {
    diff |= known.charCodeAt(i) ^ unknown.charCodeAt(i);
  }
  return diff === 0;
}
function compare(password, hashValue, callback, progressCallback) {
  function _async(callback2) {
    if (typeof password !== "string" || typeof hashValue !== "string") {
      nextTick2(
        callback2.bind(
          this,
          Error(
            "Illegal arguments: " + typeof password + ", " + typeof hashValue
          )
        )
      );
      return;
    }
    if (hashValue.length !== 60) {
      nextTick2(callback2.bind(this, null, false));
      return;
    }
    hash(
      password,
      hashValue.substring(0, 29),
      function(err, comp) {
        if (err) callback2(err);
        else callback2(null, safeStringCompare(comp, hashValue));
      },
      progressCallback
    );
  }
  __name(_async, "_async");
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
function utf8Length(string) {
  var len = 0, c = 0;
  for (var i = 0; i < string.length; ++i) {
    c = string.charCodeAt(i);
    if (c < 128) len += 1;
    else if (c < 2048) len += 2;
    else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
      ++i;
      len += 4;
    } else len += 3;
  }
  return len;
}
function utf8Array(string) {
  var offset = 0, c1, c2;
  var buffer = new Array(utf8Length(string));
  for (var i = 0, k = string.length; i < k; ++i) {
    c1 = string.charCodeAt(i);
    if (c1 < 128) {
      buffer[offset++] = c1;
    } else if (c1 < 2048) {
      buffer[offset++] = c1 >> 6 | 192;
      buffer[offset++] = c1 & 63 | 128;
    } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
      c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
      ++i;
      buffer[offset++] = c1 >> 18 | 240;
      buffer[offset++] = c1 >> 12 & 63 | 128;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    } else {
      buffer[offset++] = c1 >> 12 | 224;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    }
  }
  return buffer;
}
function base64_encode(b, len) {
  var off2 = 0, rs = [], c1, c2;
  if (len <= 0 || len > b.length) throw Error("Illegal len: " + len);
  while (off2 < len) {
    c1 = b[off2++] & 255;
    rs.push(BASE64_CODE[c1 >> 2 & 63]);
    c1 = (c1 & 3) << 4;
    if (off2 >= len) {
      rs.push(BASE64_CODE[c1 & 63]);
      break;
    }
    c2 = b[off2++] & 255;
    c1 |= c2 >> 4 & 15;
    rs.push(BASE64_CODE[c1 & 63]);
    c1 = (c2 & 15) << 2;
    if (off2 >= len) {
      rs.push(BASE64_CODE[c1 & 63]);
      break;
    }
    c2 = b[off2++] & 255;
    c1 |= c2 >> 6 & 3;
    rs.push(BASE64_CODE[c1 & 63]);
    rs.push(BASE64_CODE[c2 & 63]);
  }
  return rs.join("");
}
function base64_decode(s, len) {
  var off2 = 0, slen = s.length, olen = 0, rs = [], c1, c2, c3, c4, o, code;
  if (len <= 0) throw Error("Illegal len: " + len);
  while (off2 < slen - 1 && olen < len) {
    code = s.charCodeAt(off2++);
    c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    code = s.charCodeAt(off2++);
    c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    if (c1 == -1 || c2 == -1) break;
    o = c1 << 2 >>> 0;
    o |= (c2 & 48) >> 4;
    rs.push(String.fromCharCode(o));
    if (++olen >= len || off2 >= slen) break;
    code = s.charCodeAt(off2++);
    c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    if (c3 == -1) break;
    o = (c2 & 15) << 4 >>> 0;
    o |= (c3 & 60) >> 2;
    rs.push(String.fromCharCode(o));
    if (++olen >= len || off2 >= slen) break;
    code = s.charCodeAt(off2++);
    c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    o = (c3 & 3) << 6 >>> 0;
    o |= c4;
    rs.push(String.fromCharCode(o));
    ++olen;
  }
  var res = [];
  for (off2 = 0; off2 < olen; off2++) res.push(rs[off2].charCodeAt(0));
  return res;
}
function _encipher(lr, off2, P, S) {
  var n, l = lr[off2], r = lr[off2 + 1];
  l ^= P[0];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[1];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[2];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[3];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[4];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[5];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[6];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[7];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[8];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[9];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[10];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[11];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[12];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[13];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[14];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[15];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[16];
  lr[off2] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
  lr[off2 + 1] = l;
  return lr;
}
function _streamtoword(data, offp) {
  for (var i = 0, word = 0; i < 4; ++i)
    word = word << 8 | data[offp] & 255, offp = (offp + 1) % data.length;
  return { key: word, offp };
}
function _key(key, P, S) {
  var offset = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
  for (var i = 0; i < plen; i++)
    sw = _streamtoword(key, offset), offset = sw.offp, P[i] = P[i] ^ sw.key;
  for (i = 0; i < plen; i += 2)
    lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
  for (i = 0; i < slen; i += 2)
    lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
function _ekskey(data, key, P, S) {
  var offp = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
  for (var i = 0; i < plen; i++)
    sw = _streamtoword(key, offp), offp = sw.offp, P[i] = P[i] ^ sw.key;
  offp = 0;
  for (i = 0; i < plen; i += 2)
    sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
  for (i = 0; i < slen; i += 2)
    sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
function _crypt(b, salt, rounds, callback, progressCallback) {
  var cdata = C_ORIG.slice(), clen = cdata.length, err;
  if (rounds < 4 || rounds > 31) {
    err = Error("Illegal number of rounds (4-31): " + rounds);
    if (callback) {
      nextTick2(callback.bind(this, err));
      return;
    } else throw err;
  }
  if (salt.length !== BCRYPT_SALT_LEN) {
    err = Error(
      "Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN
    );
    if (callback) {
      nextTick2(callback.bind(this, err));
      return;
    } else throw err;
  }
  rounds = 1 << rounds >>> 0;
  var P, S, i = 0, j;
  if (typeof Int32Array === "function") {
    P = new Int32Array(P_ORIG);
    S = new Int32Array(S_ORIG);
  } else {
    P = P_ORIG.slice();
    S = S_ORIG.slice();
  }
  _ekskey(salt, b, P, S);
  function next() {
    if (progressCallback) progressCallback(i / rounds);
    if (i < rounds) {
      var start = Date.now();
      for (; i < rounds; ) {
        i = i + 1;
        _key(b, P, S);
        _key(salt, P, S);
        if (Date.now() - start > MAX_EXECUTION_TIME) break;
      }
    } else {
      for (i = 0; i < 64; i++)
        for (j = 0; j < clen >> 1; j++) _encipher(cdata, j << 1, P, S);
      var ret = [];
      for (i = 0; i < clen; i++)
        ret.push((cdata[i] >> 24 & 255) >>> 0), ret.push((cdata[i] >> 16 & 255) >>> 0), ret.push((cdata[i] >> 8 & 255) >>> 0), ret.push((cdata[i] & 255) >>> 0);
      if (callback) {
        callback(null, ret);
        return;
      } else return ret;
    }
    if (callback) nextTick2(next);
  }
  __name(next, "next");
  if (typeof callback !== "undefined") {
    next();
  } else {
    var res;
    while (true) if (typeof (res = next()) !== "undefined") return res || [];
  }
}
function _hash(password, salt, callback, progressCallback) {
  var err;
  if (typeof password !== "string" || typeof salt !== "string") {
    err = Error("Invalid string / salt: Not a string");
    if (callback) {
      nextTick2(callback.bind(this, err));
      return;
    } else throw err;
  }
  var minor, offset;
  if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
    err = Error("Invalid salt version: " + salt.substring(0, 2));
    if (callback) {
      nextTick2(callback.bind(this, err));
      return;
    } else throw err;
  }
  if (salt.charAt(2) === "$") minor = String.fromCharCode(0), offset = 3;
  else {
    minor = salt.charAt(2);
    if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
      err = Error("Invalid salt revision: " + salt.substring(2, 4));
      if (callback) {
        nextTick2(callback.bind(this, err));
        return;
      } else throw err;
    }
    offset = 4;
  }
  if (salt.charAt(offset + 2) > "$") {
    err = Error("Missing salt rounds");
    if (callback) {
      nextTick2(callback.bind(this, err));
      return;
    } else throw err;
  }
  var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
  password += minor >= "a" ? "\0" : "";
  var passwordb = utf8Array(password), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
  function finish(bytes) {
    var res = [];
    res.push("$2");
    if (minor >= "a") res.push(minor);
    res.push("$");
    if (rounds < 10) res.push("0");
    res.push(rounds.toString());
    res.push("$");
    res.push(base64_encode(saltb, saltb.length));
    res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
    return res.join("");
  }
  __name(finish, "finish");
  if (typeof callback == "undefined")
    return finish(_crypt(passwordb, saltb, rounds));
  else {
    _crypt(
      passwordb,
      saltb,
      rounds,
      function(err2, bytes) {
        if (err2) callback(err2, null);
        else callback(null, finish(bytes));
      },
      progressCallback
    );
  }
}
var randomFallback, nextTick2, BASE64_CODE, BASE64_INDEX, BCRYPT_SALT_LEN, GENSALT_DEFAULT_LOG2_ROUNDS, BLOWFISH_NUM_ROUNDS, MAX_EXECUTION_TIME, P_ORIG, S_ORIG, C_ORIG;
var init_bcryptjs = __esm({
  "node_modules/bcryptjs/index.js"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    randomFallback = null;
    __name(randomBytes, "randomBytes");
    __name(genSaltSync, "genSaltSync");
    __name(genSalt, "genSalt");
    __name(hash, "hash");
    __name(safeStringCompare, "safeStringCompare");
    __name(compare, "compare");
    nextTick2 = typeof setImmediate === "function" ? setImmediate : typeof scheduler === "object" && typeof scheduler.postTask === "function" ? scheduler.postTask.bind(scheduler) : setTimeout;
    __name(utf8Length, "utf8Length");
    __name(utf8Array, "utf8Array");
    BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
    BASE64_INDEX = [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      0,
      1,
      54,
      55,
      56,
      57,
      58,
      59,
      60,
      61,
      62,
      63,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      52,
      53,
      -1,
      -1,
      -1,
      -1,
      -1
    ];
    __name(base64_encode, "base64_encode");
    __name(base64_decode, "base64_decode");
    BCRYPT_SALT_LEN = 16;
    GENSALT_DEFAULT_LOG2_ROUNDS = 10;
    BLOWFISH_NUM_ROUNDS = 16;
    MAX_EXECUTION_TIME = 100;
    P_ORIG = [
      608135816,
      2242054355,
      320440878,
      57701188,
      2752067618,
      698298832,
      137296536,
      3964562569,
      1160258022,
      953160567,
      3193202383,
      887688300,
      3232508343,
      3380367581,
      1065670069,
      3041331479,
      2450970073,
      2306472731
    ];
    S_ORIG = [
      3509652390,
      2564797868,
      805139163,
      3491422135,
      3101798381,
      1780907670,
      3128725573,
      4046225305,
      614570311,
      3012652279,
      134345442,
      2240740374,
      1667834072,
      1901547113,
      2757295779,
      4103290238,
      227898511,
      1921955416,
      1904987480,
      2182433518,
      2069144605,
      3260701109,
      2620446009,
      720527379,
      3318853667,
      677414384,
      3393288472,
      3101374703,
      2390351024,
      1614419982,
      1822297739,
      2954791486,
      3608508353,
      3174124327,
      2024746970,
      1432378464,
      3864339955,
      2857741204,
      1464375394,
      1676153920,
      1439316330,
      715854006,
      3033291828,
      289532110,
      2706671279,
      2087905683,
      3018724369,
      1668267050,
      732546397,
      1947742710,
      3462151702,
      2609353502,
      2950085171,
      1814351708,
      2050118529,
      680887927,
      999245976,
      1800124847,
      3300911131,
      1713906067,
      1641548236,
      4213287313,
      1216130144,
      1575780402,
      4018429277,
      3917837745,
      3693486850,
      3949271944,
      596196993,
      3549867205,
      258830323,
      2213823033,
      772490370,
      2760122372,
      1774776394,
      2652871518,
      566650946,
      4142492826,
      1728879713,
      2882767088,
      1783734482,
      3629395816,
      2517608232,
      2874225571,
      1861159788,
      326777828,
      3124490320,
      2130389656,
      2716951837,
      967770486,
      1724537150,
      2185432712,
      2364442137,
      1164943284,
      2105845187,
      998989502,
      3765401048,
      2244026483,
      1075463327,
      1455516326,
      1322494562,
      910128902,
      469688178,
      1117454909,
      936433444,
      3490320968,
      3675253459,
      1240580251,
      122909385,
      2157517691,
      634681816,
      4142456567,
      3825094682,
      3061402683,
      2540495037,
      79693498,
      3249098678,
      1084186820,
      1583128258,
      426386531,
      1761308591,
      1047286709,
      322548459,
      995290223,
      1845252383,
      2603652396,
      3431023940,
      2942221577,
      3202600964,
      3727903485,
      1712269319,
      422464435,
      3234572375,
      1170764815,
      3523960633,
      3117677531,
      1434042557,
      442511882,
      3600875718,
      1076654713,
      1738483198,
      4213154764,
      2393238008,
      3677496056,
      1014306527,
      4251020053,
      793779912,
      2902807211,
      842905082,
      4246964064,
      1395751752,
      1040244610,
      2656851899,
      3396308128,
      445077038,
      3742853595,
      3577915638,
      679411651,
      2892444358,
      2354009459,
      1767581616,
      3150600392,
      3791627101,
      3102740896,
      284835224,
      4246832056,
      1258075500,
      768725851,
      2589189241,
      3069724005,
      3532540348,
      1274779536,
      3789419226,
      2764799539,
      1660621633,
      3471099624,
      4011903706,
      913787905,
      3497959166,
      737222580,
      2514213453,
      2928710040,
      3937242737,
      1804850592,
      3499020752,
      2949064160,
      2386320175,
      2390070455,
      2415321851,
      4061277028,
      2290661394,
      2416832540,
      1336762016,
      1754252060,
      3520065937,
      3014181293,
      791618072,
      3188594551,
      3933548030,
      2332172193,
      3852520463,
      3043980520,
      413987798,
      3465142937,
      3030929376,
      4245938359,
      2093235073,
      3534596313,
      375366246,
      2157278981,
      2479649556,
      555357303,
      3870105701,
      2008414854,
      3344188149,
      4221384143,
      3956125452,
      2067696032,
      3594591187,
      2921233993,
      2428461,
      544322398,
      577241275,
      1471733935,
      610547355,
      4027169054,
      1432588573,
      1507829418,
      2025931657,
      3646575487,
      545086370,
      48609733,
      2200306550,
      1653985193,
      298326376,
      1316178497,
      3007786442,
      2064951626,
      458293330,
      2589141269,
      3591329599,
      3164325604,
      727753846,
      2179363840,
      146436021,
      1461446943,
      4069977195,
      705550613,
      3059967265,
      3887724982,
      4281599278,
      3313849956,
      1404054877,
      2845806497,
      146425753,
      1854211946,
      1266315497,
      3048417604,
      3681880366,
      3289982499,
      290971e4,
      1235738493,
      2632868024,
      2414719590,
      3970600049,
      1771706367,
      1449415276,
      3266420449,
      422970021,
      1963543593,
      2690192192,
      3826793022,
      1062508698,
      1531092325,
      1804592342,
      2583117782,
      2714934279,
      4024971509,
      1294809318,
      4028980673,
      1289560198,
      2221992742,
      1669523910,
      35572830,
      157838143,
      1052438473,
      1016535060,
      1802137761,
      1753167236,
      1386275462,
      3080475397,
      2857371447,
      1040679964,
      2145300060,
      2390574316,
      1461121720,
      2956646967,
      4031777805,
      4028374788,
      33600511,
      2920084762,
      1018524850,
      629373528,
      3691585981,
      3515945977,
      2091462646,
      2486323059,
      586499841,
      988145025,
      935516892,
      3367335476,
      2599673255,
      2839830854,
      265290510,
      3972581182,
      2759138881,
      3795373465,
      1005194799,
      847297441,
      406762289,
      1314163512,
      1332590856,
      1866599683,
      4127851711,
      750260880,
      613907577,
      1450815602,
      3165620655,
      3734664991,
      3650291728,
      3012275730,
      3704569646,
      1427272223,
      778793252,
      1343938022,
      2676280711,
      2052605720,
      1946737175,
      3164576444,
      3914038668,
      3967478842,
      3682934266,
      1661551462,
      3294938066,
      4011595847,
      840292616,
      3712170807,
      616741398,
      312560963,
      711312465,
      1351876610,
      322626781,
      1910503582,
      271666773,
      2175563734,
      1594956187,
      70604529,
      3617834859,
      1007753275,
      1495573769,
      4069517037,
      2549218298,
      2663038764,
      504708206,
      2263041392,
      3941167025,
      2249088522,
      1514023603,
      1998579484,
      1312622330,
      694541497,
      2582060303,
      2151582166,
      1382467621,
      776784248,
      2618340202,
      3323268794,
      2497899128,
      2784771155,
      503983604,
      4076293799,
      907881277,
      423175695,
      432175456,
      1378068232,
      4145222326,
      3954048622,
      3938656102,
      3820766613,
      2793130115,
      2977904593,
      26017576,
      3274890735,
      3194772133,
      1700274565,
      1756076034,
      4006520079,
      3677328699,
      720338349,
      1533947780,
      354530856,
      688349552,
      3973924725,
      1637815568,
      332179504,
      3949051286,
      53804574,
      2852348879,
      3044236432,
      1282449977,
      3583942155,
      3416972820,
      4006381244,
      1617046695,
      2628476075,
      3002303598,
      1686838959,
      431878346,
      2686675385,
      1700445008,
      1080580658,
      1009431731,
      832498133,
      3223435511,
      2605976345,
      2271191193,
      2516031870,
      1648197032,
      4164389018,
      2548247927,
      300782431,
      375919233,
      238389289,
      3353747414,
      2531188641,
      2019080857,
      1475708069,
      455242339,
      2609103871,
      448939670,
      3451063019,
      1395535956,
      2413381860,
      1841049896,
      1491858159,
      885456874,
      4264095073,
      4001119347,
      1565136089,
      3898914787,
      1108368660,
      540939232,
      1173283510,
      2745871338,
      3681308437,
      4207628240,
      3343053890,
      4016749493,
      1699691293,
      1103962373,
      3625875870,
      2256883143,
      3830138730,
      1031889488,
      3479347698,
      1535977030,
      4236805024,
      3251091107,
      2132092099,
      1774941330,
      1199868427,
      1452454533,
      157007616,
      2904115357,
      342012276,
      595725824,
      1480756522,
      206960106,
      497939518,
      591360097,
      863170706,
      2375253569,
      3596610801,
      1814182875,
      2094937945,
      3421402208,
      1082520231,
      3463918190,
      2785509508,
      435703966,
      3908032597,
      1641649973,
      2842273706,
      3305899714,
      1510255612,
      2148256476,
      2655287854,
      3276092548,
      4258621189,
      236887753,
      3681803219,
      274041037,
      1734335097,
      3815195456,
      3317970021,
      1899903192,
      1026095262,
      4050517792,
      356393447,
      2410691914,
      3873677099,
      3682840055,
      3913112168,
      2491498743,
      4132185628,
      2489919796,
      1091903735,
      1979897079,
      3170134830,
      3567386728,
      3557303409,
      857797738,
      1136121015,
      1342202287,
      507115054,
      2535736646,
      337727348,
      3213592640,
      1301675037,
      2528481711,
      1895095763,
      1721773893,
      3216771564,
      62756741,
      2142006736,
      835421444,
      2531993523,
      1442658625,
      3659876326,
      2882144922,
      676362277,
      1392781812,
      170690266,
      3921047035,
      1759253602,
      3611846912,
      1745797284,
      664899054,
      1329594018,
      3901205900,
      3045908486,
      2062866102,
      2865634940,
      3543621612,
      3464012697,
      1080764994,
      553557557,
      3656615353,
      3996768171,
      991055499,
      499776247,
      1265440854,
      648242737,
      3940784050,
      980351604,
      3713745714,
      1749149687,
      3396870395,
      4211799374,
      3640570775,
      1161844396,
      3125318951,
      1431517754,
      545492359,
      4268468663,
      3499529547,
      1437099964,
      2702547544,
      3433638243,
      2581715763,
      2787789398,
      1060185593,
      1593081372,
      2418618748,
      4260947970,
      69676912,
      2159744348,
      86519011,
      2512459080,
      3838209314,
      1220612927,
      3339683548,
      133810670,
      1090789135,
      1078426020,
      1569222167,
      845107691,
      3583754449,
      4072456591,
      1091646820,
      628848692,
      1613405280,
      3757631651,
      526609435,
      236106946,
      48312990,
      2942717905,
      3402727701,
      1797494240,
      859738849,
      992217954,
      4005476642,
      2243076622,
      3870952857,
      3732016268,
      765654824,
      3490871365,
      2511836413,
      1685915746,
      3888969200,
      1414112111,
      2273134842,
      3281911079,
      4080962846,
      172450625,
      2569994100,
      980381355,
      4109958455,
      2819808352,
      2716589560,
      2568741196,
      3681446669,
      3329971472,
      1835478071,
      660984891,
      3704678404,
      4045999559,
      3422617507,
      3040415634,
      1762651403,
      1719377915,
      3470491036,
      2693910283,
      3642056355,
      3138596744,
      1364962596,
      2073328063,
      1983633131,
      926494387,
      3423689081,
      2150032023,
      4096667949,
      1749200295,
      3328846651,
      309677260,
      2016342300,
      1779581495,
      3079819751,
      111262694,
      1274766160,
      443224088,
      298511866,
      1025883608,
      3806446537,
      1145181785,
      168956806,
      3641502830,
      3584813610,
      1689216846,
      3666258015,
      3200248200,
      1692713982,
      2646376535,
      4042768518,
      1618508792,
      1610833997,
      3523052358,
      4130873264,
      2001055236,
      3610705100,
      2202168115,
      4028541809,
      2961195399,
      1006657119,
      2006996926,
      3186142756,
      1430667929,
      3210227297,
      1314452623,
      4074634658,
      4101304120,
      2273951170,
      1399257539,
      3367210612,
      3027628629,
      1190975929,
      2062231137,
      2333990788,
      2221543033,
      2438960610,
      1181637006,
      548689776,
      2362791313,
      3372408396,
      3104550113,
      3145860560,
      296247880,
      1970579870,
      3078560182,
      3769228297,
      1714227617,
      3291629107,
      3898220290,
      166772364,
      1251581989,
      493813264,
      448347421,
      195405023,
      2709975567,
      677966185,
      3703036547,
      1463355134,
      2715995803,
      1338867538,
      1343315457,
      2802222074,
      2684532164,
      233230375,
      2599980071,
      2000651841,
      3277868038,
      1638401717,
      4028070440,
      3237316320,
      6314154,
      819756386,
      300326615,
      590932579,
      1405279636,
      3267499572,
      3150704214,
      2428286686,
      3959192993,
      3461946742,
      1862657033,
      1266418056,
      963775037,
      2089974820,
      2263052895,
      1917689273,
      448879540,
      3550394620,
      3981727096,
      150775221,
      3627908307,
      1303187396,
      508620638,
      2975983352,
      2726630617,
      1817252668,
      1876281319,
      1457606340,
      908771278,
      3720792119,
      3617206836,
      2455994898,
      1729034894,
      1080033504,
      976866871,
      3556439503,
      2881648439,
      1522871579,
      1555064734,
      1336096578,
      3548522304,
      2579274686,
      3574697629,
      3205460757,
      3593280638,
      3338716283,
      3079412587,
      564236357,
      2993598910,
      1781952180,
      1464380207,
      3163844217,
      3332601554,
      1699332808,
      1393555694,
      1183702653,
      3581086237,
      1288719814,
      691649499,
      2847557200,
      2895455976,
      3193889540,
      2717570544,
      1781354906,
      1676643554,
      2592534050,
      3230253752,
      1126444790,
      2770207658,
      2633158820,
      2210423226,
      2615765581,
      2414155088,
      3127139286,
      673620729,
      2805611233,
      1269405062,
      4015350505,
      3341807571,
      4149409754,
      1057255273,
      2012875353,
      2162469141,
      2276492801,
      2601117357,
      993977747,
      3918593370,
      2654263191,
      753973209,
      36408145,
      2530585658,
      25011837,
      3520020182,
      2088578344,
      530523599,
      2918365339,
      1524020338,
      1518925132,
      3760827505,
      3759777254,
      1202760957,
      3985898139,
      3906192525,
      674977740,
      4174734889,
      2031300136,
      2019492241,
      3983892565,
      4153806404,
      3822280332,
      352677332,
      2297720250,
      60907813,
      90501309,
      3286998549,
      1016092578,
      2535922412,
      2839152426,
      457141659,
      509813237,
      4120667899,
      652014361,
      1966332200,
      2975202805,
      55981186,
      2327461051,
      676427537,
      3255491064,
      2882294119,
      3433927263,
      1307055953,
      942726286,
      933058658,
      2468411793,
      3933900994,
      4215176142,
      1361170020,
      2001714738,
      2830558078,
      3274259782,
      1222529897,
      1679025792,
      2729314320,
      3714953764,
      1770335741,
      151462246,
      3013232138,
      1682292957,
      1483529935,
      471910574,
      1539241949,
      458788160,
      3436315007,
      1807016891,
      3718408830,
      978976581,
      1043663428,
      3165965781,
      1927990952,
      4200891579,
      2372276910,
      3208408903,
      3533431907,
      1412390302,
      2931980059,
      4132332400,
      1947078029,
      3881505623,
      4168226417,
      2941484381,
      1077988104,
      1320477388,
      886195818,
      18198404,
      3786409e3,
      2509781533,
      112762804,
      3463356488,
      1866414978,
      891333506,
      18488651,
      661792760,
      1628790961,
      3885187036,
      3141171499,
      876946877,
      2693282273,
      1372485963,
      791857591,
      2686433993,
      3759982718,
      3167212022,
      3472953795,
      2716379847,
      445679433,
      3561995674,
      3504004811,
      3574258232,
      54117162,
      3331405415,
      2381918588,
      3769707343,
      4154350007,
      1140177722,
      4074052095,
      668550556,
      3214352940,
      367459370,
      261225585,
      2610173221,
      4209349473,
      3468074219,
      3265815641,
      314222801,
      3066103646,
      3808782860,
      282218597,
      3406013506,
      3773591054,
      379116347,
      1285071038,
      846784868,
      2669647154,
      3771962079,
      3550491691,
      2305946142,
      453669953,
      1268987020,
      3317592352,
      3279303384,
      3744833421,
      2610507566,
      3859509063,
      266596637,
      3847019092,
      517658769,
      3462560207,
      3443424879,
      370717030,
      4247526661,
      2224018117,
      4143653529,
      4112773975,
      2788324899,
      2477274417,
      1456262402,
      2901442914,
      1517677493,
      1846949527,
      2295493580,
      3734397586,
      2176403920,
      1280348187,
      1908823572,
      3871786941,
      846861322,
      1172426758,
      3287448474,
      3383383037,
      1655181056,
      3139813346,
      901632758,
      1897031941,
      2986607138,
      3066810236,
      3447102507,
      1393639104,
      373351379,
      950779232,
      625454576,
      3124240540,
      4148612726,
      2007998917,
      544563296,
      2244738638,
      2330496472,
      2058025392,
      1291430526,
      424198748,
      50039436,
      29584100,
      3605783033,
      2429876329,
      2791104160,
      1057563949,
      3255363231,
      3075367218,
      3463963227,
      1469046755,
      985887462
    ];
    C_ORIG = [
      1332899944,
      1700884034,
      1701343084,
      1684370003,
      1668446532,
      1869963892
    ];
    __name(_encipher, "_encipher");
    __name(_streamtoword, "_streamtoword");
    __name(_key, "_key");
    __name(_ekskey, "_ekskey");
    __name(_crypt, "_crypt");
    __name(_hash, "_hash");
  }
});

// worker/lib/auth.ts
var auth_exports = {};
__export(auth_exports, {
  createJWT: () => createJWT,
  generateId: () => generateId,
  generateReceiptNumber: () => generateReceiptNumber,
  hashPassword: () => hashPassword,
  nowISO: () => nowISO,
  verifyJWT: () => verifyJWT,
  verifyPassword: () => verifyPassword
});
function getSecretKey(secret) {
  return new TextEncoder().encode(secret);
}
async function hashPassword(password) {
  const salt = await genSalt(10);
  return hash(password, salt);
}
async function verifyPassword(password, hash2) {
  return compare(password, hash2);
}
async function createJWT(payload, secret, expiresIn = "7d") {
  const secretKey = getSecretKey(secret);
  const jwt = await new SignJWT({ ...payload }).setProtectedHeader({ alg: JWT_ALG }).setIssuedAt().setExpirationTime(expiresIn).sign(secretKey);
  return jwt;
}
async function verifyJWT(token, secret) {
  const secretKey = getSecretKey(secret);
  const { payload } = await jwtVerify(token, secretKey);
  return payload;
}
function generateId() {
  return crypto.randomUUID();
}
function generateReceiptNumber() {
  const prefix = "RCP";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1e3).toString().padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
}
function nowISO() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
var JWT_ALG;
var init_auth = __esm({
  "worker/lib/auth.ts"() {
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_webapi();
    init_bcryptjs();
    JWT_ALG = "HS256";
    __name(getSecretKey, "getSecretKey");
    __name(hashPassword, "hashPassword");
    __name(verifyPassword, "verifyPassword");
    __name(createJWT, "createJWT");
    __name(verifyJWT, "verifyJWT");
    __name(generateId, "generateId");
    __name(generateReceiptNumber, "generateReceiptNumber");
    __name(nowISO, "nowISO");
  }
});

// .wrangler/tmp/bundle-ei1VNM/middleware-loader.entry.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-ei1VNM/middleware-insertion-facade.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// worker/index.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/hono.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/hono-base.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/compose.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/context.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/request.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/http-exception.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/request/constants.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/utils/buffer.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/utils/crypto.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/utils/buffer.js
var bufferToFormData = /* @__PURE__ */ __name((arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      // Normalize the media type (case-insensitive) while keeping parameters like the boundary
      "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase())
    }
  });
  return response.formData();
}, "bufferToFormData");

// node_modules/hono/dist/utils/body.js
var MAX_NESTING_DEPTH = 32;
var MAX_NESTED_OBJECTS = 1e4;
var isRawRequest = /* @__PURE__ */ __name((request) => "headers" in request, "isRawRequest");
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const contentType = headers.get("Content-Type");
  const mediaType = contentType?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData) {
    return convertFormDataToBodyData(
      await request.bodyCache.formData,
      options
    );
  }
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) {
    request.bodyCache.formData = formDataPromise;
  }
  const formData = await formDataPromise;
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  const nestingState = { count: 0 };
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value, nestingState);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value, state) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".", MAX_NESTING_DEPTH + 2);
  if (keys.length > MAX_NESTING_DEPTH + 1) {
    throwNestingLimitExceeded();
  }
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        if (state.count++ >= MAX_NESTED_OBJECTS) {
          throwNestingLimitExceeded();
        }
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");
var throwNestingLimitExceeded = /* @__PURE__ */ __name(() => {
  throw new Error("Nesting limit exceeded");
}, "throwNestingLimitExceeded");

// node_modules/hono/dist/utils/url.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder2) => {
  try {
    return decoder2(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder2(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (segment.charCodeAt(segment.length - 1) === 63) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.slice(0, -1);
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => str.indexOf("%") !== -1 ? tryDecode(str, decodeURIComponent_) : str, "tryDecodeURIComponent");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return tryDecodeURIComponent(value);
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  const hashIndex = url.indexOf("#", 8);
  if (hashIndex !== -1) {
    url = url.slice(0, hashIndex);
  }
  let encoded;
  if (!multiple && key && key.indexOf("%") === -1 && key.indexOf("+") === -1) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = /* @__PURE__ */ Object.create(null);
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex]?.[1][key];
    const param = this.#getParamValue(paramKey);
    return param && tryDecodeURIComponent(param);
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex]?.[1] ?? {});
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = tryDecodeURIComponent(value);
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = /* @__PURE__ */ Object.create(null);
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    for (const anyCachedKey in bodyCache) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        const contentType = anyCachedKey === "formData" ? void 0 : raw2.headers.get("content-type");
        return new Response(body, {
          headers: contentType ? { "Content-Type": contentType } : void 0
        })[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    ;
    (this.#validatedData ??= {})[target] = data;
  }
  valid(target) {
    return this.#validatedData?.[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context2, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   // Append multiple headers using the append option (e.g. Vary)
   *   c.header('Vary', 'Accept-Encoding', { append: true })
   *   c.header('Vary', 'User-Agent', { append: true })
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    let responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders;
    if (typeof arg === "object" && arg.headers) {
      responseHeaders ??= new Headers();
      for (const [key, value] of new Headers(arg.headers)) {
        if (key === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      if (!responseHeaders) {
        let count3 = 0;
        for (const k in headers) {
          if (++count3 > 1 || typeof headers[k] !== "string") {
            responseHeaders = new Headers();
            break;
          }
        }
      }
      if (responseHeaders) {
        for (const k in headers) {
          const v = headers[k];
          if (typeof v === "string") {
            responseHeaders.set(k, v);
          } else {
            responseHeaders.delete(k);
            for (const v2 of v) {
              responseHeaders.append(k, v2);
            }
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, {
      status,
      headers: responseHeaders ?? headers
    });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibytes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// node_modules/hono/dist/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch", "query"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/hono/dist/utils/constants.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  query;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        const methodName = method.toUpperCase();
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(methodName, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(methodName, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          const methodName = m.toUpperCase();
          for (const handler of handlers) {
            this.#addRoute(methodName, this.#path, handler);
          }
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context2 = await composed(c);
        if (!context2.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context2.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} env - env Object
   * @param {ExecutionContext} executionCtx - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// node_modules/hono/dist/router/reg-exp-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/reg-exp-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/utils.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var createNullObject = /* @__PURE__ */ __name(() => /* @__PURE__ */ Object.create(null), "createNullObject");

// node_modules/hono/dist/router/reg-exp-router/matcher.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// node_modules/hono/dist/router/reg-exp-router/node.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return b === TAIL_WILDCARD_REG_EXP_STR ? -1 : 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  // handler index of a dynamic path, or -1 for a static path terminal
  #index;
  #varIndex;
  #children = createNullObject();
  insert(tokens, index, paramMap, context2, isStatic) {
    let node = this;
    for (let i = 0, len = tokens.length; i < len; i++) {
      const token = tokens[i];
      const pattern = token.length === 1 ? token === "*" ? i === len - 1 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : null : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      let nextNode;
      if (pattern) {
        const name = pattern[1];
        let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
        if (name && pattern[2]) {
          if (regexpStr === ".*") {
            throw PATH_ERROR;
          }
          regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
          if (/\((?!\?:)/.test(regexpStr)) {
            throw PATH_ERROR;
          }
          if (regexpStr.length === 1 && regExpMetaChars.has(regexpStr)) {
            throw PATH_ERROR;
          }
        }
        nextNode = node.#children[regexpStr];
        if (!nextNode) {
          if (regexpStr !== ONLY_WILDCARD_REG_EXP_STR && regexpStr !== TAIL_WILDCARD_REG_EXP_STR) {
            for (const k in node.#children) {
              if (
                // a single-char pattern coexists with single-char literals as a literal does
                (regexpStr.length > 1 || k.length > 1) && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
              ) {
                throw PATH_ERROR;
              }
            }
          }
          nextNode = node.#children[regexpStr] = new _Node();
        }
        if (name !== "") {
          nextNode.#varIndex ??= context2.varIndex++;
          paramMap.push([name, nextNode.#varIndex]);
        }
      } else {
        nextNode = node.#children[token];
        if (!nextNode) {
          for (const k in node.#children) {
            if (k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR) {
              throw PATH_ERROR;
            }
          }
          nextNode = node.#children[token] = new _Node();
        }
      }
      node = nextNode;
    }
    if (node.#index !== void 0) {
      throw PATH_ERROR;
    }
    node.#index = isStatic ? -1 : index;
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      const childStr = c.buildRegExpStr();
      return childStr === "" ? "" : (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + childStr;
    }).filter(Boolean);
    if (typeof this.#index === "number" && this.#index !== -1) {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  #index = 0;
  // dynamic path -> [handler index, param assoc]; static paths are not registered
  paths = createNullObject();
  insert(path, isStatic) {
    if (isStatic) {
      this.#root.insert(path.split(""), 0, [], this.#context, true);
      return;
    }
    const paramAssoc = [];
    const groups = [];
    let markedPath = path;
    for (let i = 0; ; ) {
      let replaced = false;
      markedPath = markedPath.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = markedPath.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, this.#index, paramAssoc, this.#context, false);
    this.paths[path] = [this.#index++, paramAssoc];
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var wildcardRegExpCache = createNullObject();
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    `^${path.replace(
      /\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g,
      (match2, metaChar) => metaChar ? `\\${metaChar}` : match2 === "/*" ? TAIL_WILDCARD_REG_EXP_STR : match2 === "*" ? ONLY_WILDCARD_REG_EXP_STR : `/:${LABEL_REG_EXP_STR}`
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function findMiddleware(middleware, path) {
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  #tries;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: createNullObject() };
    this.#routes = { [METHOD_NAME_ALL]: createNullObject() };
    this.#tries = { [METHOD_NAME_ALL]: new Trie() };
  }
  #insertPath(method, path) {
    try {
      this.#tries[method].insert(path, !/\*|\/:/.test(path));
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      this.#tries[method] = new Trie();
      for (const handlerMap of [middleware, routes]) {
        handlerMap[method] = createNullObject();
        for (const p in handlerMap[METHOD_NAME_ALL]) {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
          this.#insertPath(method, p);
        }
      }
    }
    if (path === "/*") {
      path = "*";
    }
    const methods = method === METHOD_NAME_ALL ? Object.keys(middleware) : [method];
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      for (const m of methods) {
        if (!middleware[m][path]) {
          this.#insertPath(m, path);
          middleware[m][path] = findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        }
      }
      for (const handlerMap of [middleware, routes]) {
        for (const m of methods) {
          for (const p in handlerMap[m]) {
            re.test(p) && handlerMap[m][p].push([handler, path]);
          }
        }
      }
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (const path2 of paths) {
      for (const m of methods) {
        if (!routes[m][path2]) {
          this.#insertPath(m, path2);
          routes[m][path2] = findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || [];
        }
        routes[m][path2].push([handler, path2]);
      }
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = createNullObject();
    for (const method of Object.keys(this.#routes)) {
      matchers[method] = this.#buildMatcher(method);
    }
    this.#middleware = this.#routes = this.#tries = void 0;
    wildcardRegExpCache = createNullObject();
    return matchers;
  }
  #buildMatcher(method) {
    const middleware = this.#middleware[method];
    const routes = this.#routes[method];
    const trie = this.#tries[method];
    const staticMap = createNullObject();
    const handlerData = [];
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    for (const r of [middleware, routes]) {
      for (const path in r) {
        const handlers = r[path];
        const pathData = trie.paths[path];
        if (!pathData) {
          staticMap[path] = [handlers.map(([h]) => [h, createNullObject()]), emptyParam];
          continue;
        }
        handlerData[pathData[0]] = handlers.map(([h, handlerPath]) => [
          h,
          trie.paths[handlerPath][1].reduceRight((map, [key], i) => {
            map[key] = paramReplacementMap[pathData[1][i][1]];
            return map;
          }, createNullObject())
        ]);
      }
    }
    return [regexp, indexReplacementMap.map((i) => handlerData[i]), staticMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/prepared-router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/smart-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/smart-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/trie-router/router.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/router/trie-router/node.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var emptyParams = createNullObject();
var order = 0;
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods = [];
  #children = createNullObject();
  #patterns = [];
  #pattern;
  #params = emptyParams;
  insert(method, path, handler) {
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = /* @__PURE__ */ new Set();
    let i = 0;
    for (const p of parts) {
      const nextP = parts[++i];
      const pattern = getPattern(p, nextP) || (nextP === void 0 && p && p.indexOf("*") === p.length - 1 ? p : null);
      const isParam = Array.isArray(pattern);
      const key = isParam ? pattern[0] : pattern || p;
      const child = curNode.#children[key] ||= new _Node2();
      if (pattern && !child.#pattern) {
        child.#pattern = pattern;
        curNode.#patterns.push(child);
      }
      curNode = child;
      if (isParam) {
        possibleKeys.add(pattern[1]);
      }
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: [...possibleKeys],
        score: ++order
      }
    });
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      if (handlerSet) {
        handlerSet.params = createNullObject();
        handlerSets.push(handlerSet);
        for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
          const key = handlerSet.possibleKeys[i2];
          handlerSet.params[key] = params?.[key] && !i2 ? params[key] : nodeParams[key] ?? params?.[key];
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (const child of node.#patterns) {
          const pattern = child.#pattern;
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (typeof pattern === "string") {
            if (pattern === "*" || part.startsWith(pattern.slice(0, -1))) {
              this.#pushHandlerSets(handlerSets, child, method, node.#params);
              if (pattern === "*") {
                child.#params = params;
                tempNodes.push(child);
              }
            }
            continue;
          }
          const [, name, matcher] = pattern;
          if (!part && matcher === true) {
            continue;
          }
          if (matcher !== true) {
            if (!partOffsets) {
              partOffsets = [];
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.slice(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  node.#params,
                  params
                );
              }
              for (const _ in child.#children) {
                child.#params = params;
                const componentCount = m[0].match(/\//g)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
                break;
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets[1]) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node = new Node2();
  add(method, path, handler) {
    for (const result of checkOptionalParameter(path) || [path]) {
      this.#node.insert(method, result, handler);
    }
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var cors = /* @__PURE__ */ __name((options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH", "QUERY"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const exposeHeadersStr = opts.exposeHeaders?.length ? opts.exposeHeaders.join(",") : void 0;
  const allowHeadersStr = opts.allowHeaders?.length ? opts.allowHeaders.join(",") : void 0;
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return async (origin, c) => (await optsAllowMethods(origin, c)).join(",");
    } else if (Array.isArray(optsAllowMethods)) {
      const methodsStr = optsAllowMethods.join(",");
      return () => methodsStr;
    } else {
      return () => "";
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (exposeHeadersStr) {
      set("Access-Control-Expose-Headers", exposeHeadersStr);
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        c.res.headers.append("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods) {
        set("Access-Control-Allow-Methods", allowMethods);
      }
      let headersStr = allowHeadersStr;
      if (!headersStr) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headersStr = requestHeaders.split(",").map((h) => h.trim()).join(",");
        }
      }
      if (headersStr) {
        set("Access-Control-Allow-Headers", headersStr);
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// node_modules/hono/dist/middleware/logger/index.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// node_modules/hono/dist/utils/color.js
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function getColorEnabled() {
  const { process, Deno } = globalThis;
  const isNoColor = typeof Deno?.noColor === "boolean" ? Deno.noColor : process !== void 0 ? (
    // eslint-disable-next-line no-unsafe-optional-chaining
    "NO_COLOR" in process?.env
  ) : false;
  return !isNoColor;
}
__name(getColorEnabled, "getColorEnabled");
async function getColorEnabledAsync() {
  const { navigator } = globalThis;
  const cfWorkers = "cloudflare:workers";
  const isNoColor = navigator !== void 0 && navigator.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(cfWorkers)).env ?? {});
    } catch {
      return false;
    }
  })() : !getColorEnabled();
  return !isNoColor;
}
__name(getColorEnabledAsync, "getColorEnabledAsync");

// node_modules/hono/dist/middleware/logger/index.js
var humanize = /* @__PURE__ */ __name((times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
}, "humanize");
var time3 = /* @__PURE__ */ __name((start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
}, "time");
var colorStatus = /* @__PURE__ */ __name(async (status) => {
  const colorEnabled = await getColorEnabledAsync();
  if (colorEnabled) {
    switch (status / 100 | 0) {
      case 5:
        return `\x1B[31m${status}\x1B[0m`;
      case 4:
        return `\x1B[33m${status}\x1B[0m`;
      case 3:
        return `\x1B[36m${status}\x1B[0m`;
      case 2:
        return `\x1B[32m${status}\x1B[0m`;
    }
  }
  return `${status}`;
}, "colorStatus");
async function log3(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path}` : `${prefix} ${method} ${path} ${await colorStatus(status)} ${elapsed}`;
  fn(out);
}
__name(log3, "log");
var logger = /* @__PURE__ */ __name((fn = console.log) => {
  return /* @__PURE__ */ __name(async function logger2(c, next) {
    const { method, url } = c.req;
    const path = url.slice(url.indexOf("/", 8));
    await log3(fn, "<--", method, path);
    const start = Date.now();
    await next();
    await log3(fn, "-->", method, path, c.res.status, time3(start));
  }, "logger2");
}, "logger");

// worker/routes/auth.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth();

// worker/lib/db.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function queryAll(db, sql, params = []) {
  const stmt = db.prepare(sql);
  const result = await stmt.bind(...params).all();
  return result.results;
}
__name(queryAll, "queryAll");
async function queryOne(db, sql, params = []) {
  const stmt = db.prepare(sql);
  const result = await stmt.bind(...params).first();
  return result || null;
}
__name(queryOne, "queryOne");
async function execute(db, sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.bind(...params).run();
}
__name(execute, "execute");
function parseJSON(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
__name(parseJSON, "parseJSON");
function stringifyJSON(value) {
  return JSON.stringify(value);
}
__name(stringifyJSON, "stringifyJSON");

// worker/lib/middleware.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth();
async function authMiddleware(c, next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized - No token provided" }, 401);
  }
  const token = authHeader.substring(7);
  try {
    const payload = await verifyJWT(token, c.env.JWT_SECRET);
    c.set("user", {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    });
    await next();
  } catch (error3) {
    return c.json({ error: "Unauthorized - Invalid token" }, 401);
  }
}
__name(authMiddleware, "authMiddleware");
function roleMiddleware(allowedRoles) {
  return async (c, next) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    if (!allowedRoles.includes(user.role)) {
      return c.json({ error: `Forbidden - Requires one of: ${allowedRoles.join(", ")}` }, 403);
    }
    await next();
  };
}
__name(roleMiddleware, "roleMiddleware");

// worker/routes/auth.ts
var auth = new Hono2();
auth.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, firstName, lastName, phone, role = "owner" } = body;
    if (!email || !password || !firstName || !lastName) {
      return c.json({ error: "Missing required fields: email, password, firstName, lastName" }, 400);
    }
    const validRoles = ["owner", "manager", "accountant", "tenant", "realtor", "contractor", "admin", "inspector"];
    if (!validRoles.includes(role)) {
      return c.json({ error: `Invalid role. Must be one of: ${validRoles.join(", ")}` }, 400);
    }
    const existing = await queryOne(c.env.DB, "SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);
    if (existing) {
      return c.json({ error: "User with this email already exists" }, 409);
    }
    const id = generateId();
    const passwordHash = await hashPassword(password);
    const now = nowISO();
    await execute(c.env.DB, `
      INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, kyc_status, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?)
    `, [id, email.toLowerCase(), passwordHash, firstName, lastName, phone || "", role, now, now]);
    const token = await createJWT({ userId: id, email: email.toLowerCase(), role }, c.env.JWT_SECRET);
    const user = await queryOne(c.env.DB, "SELECT id, email, first_name, last_name, phone, role, kyc_status, avatar_url, created_at FROM users WHERE id = ?", [id]);
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role,
          kycStatus: user.kyc_status,
          avatar: user.avatar_url,
          createdAt: user.created_at
        },
        token
      }
    }, 201);
  } catch (error3) {
    console.error("Register error:", error3);
    return c.json({ error: "Registration failed", details: error3.message }, 500);
  }
});
auth.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;
    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }
    const user = await queryOne(c.env.DB, "SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (!user) {
      const demoUsers = {
        "owner@agently.com": { password: "owner123", role: "owner", firstName: "John", lastName: "Landlord" },
        "manager@agently.com": { password: "manager123", role: "manager", firstName: "Sarah", lastName: "Manager" },
        "accountant@agently.com": { password: "accountant123", role: "accountant", firstName: "Michael", lastName: "Finance" },
        "tenant@agently.com": { password: "tenant123", role: "tenant", firstName: "Alice", lastName: "Tenant" },
        "realtor@agently.com": { password: "realtor123", role: "realtor", firstName: "David", lastName: "Agent" },
        "contractor@agently.com": { password: "contractor123", role: "contractor", firstName: "James", lastName: "Handyman" },
        "admin@agently.com": { password: "admin123", role: "admin", firstName: "Admin", lastName: "User" }
      };
      const demo = demoUsers[email.toLowerCase()];
      if (demo && demo.password === password) {
        const id = `demo-${demo.role}`;
        const now = nowISO();
        const passwordHash = await hashPassword(password);
        const existingDemo = await queryOne(c.env.DB, "SELECT id FROM users WHERE id = ?", [id]);
        if (!existingDemo) {
          await execute(c.env.DB, `
            INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, kyc_status, email_verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'verified', 1, ?, ?)
          `, [id, email.toLowerCase(), passwordHash, demo.firstName, demo.lastName, "+234-801-000-0000", demo.role, now, now]);
        }
        const token2 = await createJWT({ userId: id, email: email.toLowerCase(), role: demo.role }, c.env.JWT_SECRET);
        return c.json({
          success: true,
          data: {
            user: {
              id,
              email: email.toLowerCase(),
              firstName: demo.firstName,
              lastName: demo.lastName,
              phone: "+234-801-000-0000",
              role: demo.role,
              kycStatus: "verified",
              createdAt: now
            },
            token: token2
          }
        });
      }
      return c.json({ error: "Invalid email or password" }, 401);
    }
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return c.json({ error: "Invalid email or password" }, 401);
    }
    const token = await createJWT({ userId: user.id, email: user.email, role: user.role }, c.env.JWT_SECRET);
    await execute(c.env.DB, "UPDATE users SET updated_at = ? WHERE id = ?", [nowISO(), user.id]);
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role,
          kycStatus: user.kyc_status,
          avatar: user.avatar_url,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (error3) {
    console.error("Login error:", error3);
    return c.json({ error: "Login failed", details: error3.message }, 500);
  }
});
auth.get("/me", authMiddleware, async (c) => {
  try {
    const userCtx = c.get("user");
    const user = await queryOne(c.env.DB, "SELECT id, email, first_name, last_name, phone, role, kyc_status, avatar_url, bio, company_name, created_at FROM users WHERE id = ?", [userCtx.userId]);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        kycStatus: user.kyc_status,
        avatar: user.avatar_url,
        bio: user.bio,
        companyName: user.company_name,
        createdAt: user.created_at
      }
    });
  } catch (error3) {
    return c.json({ error: "Failed to fetch user", details: error3.message }, 500);
  }
});
auth.post("/verify", async (c) => {
  try {
    const body = await c.req.json();
    const { token } = body;
    if (!token) return c.json({ error: "Token required" }, 400);
    const payload = await verifyJWT(token, c.env.JWT_SECRET);
    return c.json({ success: true, data: payload });
  } catch (error3) {
    return c.json({ error: "Invalid token" }, 401);
  }
});
auth.get("/users", authMiddleware, async (c) => {
  try {
    const userCtx = c.get("user");
    if (!["admin", "owner", "manager"].includes(userCtx.role)) {
      return c.json({ error: "Forbidden" }, 403);
    }
    const role = c.req.query("role");
    let sql = "SELECT id, email, first_name, last_name, phone, role, kyc_status, avatar_url, created_at FROM users";
    const params = [];
    if (role && role !== "all") {
      sql += " WHERE role = ?";
      params.push(role);
    }
    sql += " ORDER BY created_at DESC LIMIT 100";
    const users = await queryAll(c.env.DB, sql, params);
    const mapped = users.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      phone: u.phone,
      role: u.role,
      kycStatus: u.kyc_status,
      avatar: u.avatar_url,
      createdAt: u.created_at
    }));
    return c.json({ success: true, data: mapped });
  } catch (error3) {
    return c.json({ error: "Failed to fetch users", details: error3.message }, 500);
  }
});
var auth_default = auth;

// worker/routes/properties.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth();
var properties = new Hono2();
properties.get("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const search = c.req.query("search") || "";
    const type = c.req.query("type") || "";
    const status = c.req.query("status") || "";
    let sql = `
      SELECT p.*, u.first_name as owner_first, u.last_name as owner_last,
             m.first_name as manager_first, m.last_name as manager_last
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN users m ON p.manager_id = m.id
    `;
    const params = [];
    const conditions = [];
    if (user.role === "owner") {
      conditions.push("p.owner_id = ?");
      params.push(user.userId);
    } else if (user.role === "manager") {
      conditions.push("(p.manager_id = ? OR p.owner_id = ?)");
      params.push(user.userId, user.userId);
    } else if (user.role === "tenant") {
      sql = `
        SELECT p.*, u.first_name as owner_first, u.last_name as owner_last,
               m.first_name as manager_first, m.last_name as manager_last
        FROM properties p
        LEFT JOIN users u ON p.owner_id = u.id
        LEFT JOIN users m ON p.manager_id = m.id
        INNER JOIN tenants t ON t.property_id = p.id
        WHERE t.user_id = ? OR t.email = ?
      `;
      const userEmail = user.email;
      const tenantRecord = await queryOne(c.env.DB, "SELECT property_id FROM tenants WHERE user_id = ? OR email = ? LIMIT 1", [user.userId, user.email]);
      if (tenantRecord) {
        sql = `
          SELECT p.*, u.first_name as owner_first, u.last_name as owner_last,
                 m.first_name as manager_first, m.last_name as manager_last
          FROM properties p
          LEFT JOIN users u ON p.owner_id = u.id
          LEFT JOIN users m ON p.manager_id = m.id
          WHERE p.id = ?
        `;
        return c.json({
          success: true,
          data: await queryAll(c.env.DB, sql, [tenantRecord.property_id]).then((rows2) => rows2.map(mapPropertyRow))
        });
      }
      return c.json({ success: true, data: [] });
    }
    if (search) {
      conditions.push("(p.name LIKE ? OR p.address LIKE ? OR p.city LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (type && type !== "all") {
      conditions.push("p.type = ?");
      params.push(type);
    }
    if (status && status !== "all") {
      conditions.push("p.status = ?");
      params.push(status);
    }
    if (conditions.length > 0) {
      sql += (sql.includes("WHERE") ? " AND " : " WHERE ") + conditions.join(" AND ");
    }
    sql += " ORDER BY p.created_at DESC";
    const rows = await queryAll(c.env.DB, sql, params);
    const data = rows.map(mapPropertyRow);
    for (const prop of data) {
      const units = await queryAll(c.env.DB, "SELECT id, status, rent FROM units WHERE property_id = ?", [prop.id]);
      prop.unitsData = units;
      prop.totalUnitsActual = units.length;
      prop.occupiedUnits = units.filter((u) => u.status === "occupied").length;
      prop.vacantUnits = units.filter((u) => u.status === "vacant").length;
      prop.maintenanceUnits = units.filter((u) => u.status === "maintenance").length;
    }
    return c.json({ success: true, data });
  } catch (error3) {
    console.error("Get properties error:", error3);
    return c.json({ error: "Failed to fetch properties", details: error3.message }, 500);
  }
});
properties.get("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const row = await queryOne(c.env.DB, `
      SELECT p.*, u.first_name as owner_first, u.last_name as owner_last,
             m.first_name as manager_first, m.last_name as manager_last
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN users m ON p.manager_id = m.id
      WHERE p.id = ?
    `, [id]);
    if (!row) return c.json({ error: "Property not found" }, 404);
    const prop = mapPropertyRow(row);
    const units = await queryAll(c.env.DB, "SELECT * FROM units WHERE property_id = ? ORDER BY unit_number", [id]);
    const tenants2 = await queryAll(c.env.DB, "SELECT * FROM tenants WHERE property_id = ? AND status = ?", [id, "active"]);
    const expenses2 = await queryAll(c.env.DB, "SELECT * FROM expenses WHERE property_id = ? ORDER BY date DESC LIMIT 20", [id]);
    const maintenance2 = await queryAll(c.env.DB, "SELECT * FROM maintenance_requests WHERE property_id = ? ORDER BY created_at DESC LIMIT 20", [id]);
    return c.json({
      success: true,
      data: {
        ...prop,
        units: units.map(mapUnitRow),
        tenants: tenants2.map(mapTenantRow),
        recentExpenses: expenses2,
        recentMaintenance: maintenance2,
        stats: {
          totalUnits: units.length,
          occupied: units.filter((u) => u.status === "occupied").length,
          vacant: units.filter((u) => u.status === "vacant").length,
          maintenance: units.filter((u) => u.status === "maintenance").length,
          occupancyRate: units.length > 0 ? Math.round(units.filter((u) => u.status === "occupied").length / units.length * 100) : 0
        }
      }
    });
  } catch (error3) {
    return c.json({ error: "Failed to fetch property", details: error3.message }, 500);
  }
});
properties.post("/", authMiddleware, roleMiddleware(["owner", "manager", "admin"]), async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json();
    const { name, address, type, description, city, state, totalUnits, yearBuilt, marketValue, amenities, images } = body;
    if (!name || !address || !type) {
      return c.json({ error: "Name, address, and type are required" }, 400);
    }
    const id = generateId();
    const now = nowISO();
    await execute(c.env.DB, `
      INSERT INTO properties (id, owner_id, manager_id, name, description, type, address, city, state, total_units, year_built, market_value, amenities, images, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `, [
      id,
      body.ownerId || user.userId,
      body.managerId || null,
      name,
      description || "",
      type,
      address,
      city || "Lagos",
      state || "Lagos",
      totalUnits || 1,
      yearBuilt || null,
      marketValue || null,
      stringifyJSON(amenities || []),
      stringifyJSON(images || []),
      now,
      now
    ]);
    const unitsToCreate = parseInt(totalUnits) || 1;
    for (let i = 1; i <= unitsToCreate; i++) {
      const unitId = generateId();
      await execute(c.env.DB, `
        INSERT INTO units (id, property_id, unit_number, rent, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'vacant', ?, ?)
      `, [unitId, id, `Unit ${i}`, body.rent || 1e5, now, now]);
    }
    const created = await queryOne(c.env.DB, "SELECT * FROM properties WHERE id = ?", [id]);
    return c.json({ success: true, data: mapPropertyRow(created) }, 201);
  } catch (error3) {
    console.error("Create property error:", error3);
    return c.json({ error: "Failed to create property", details: error3.message }, 500);
  }
});
properties.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const user = c.get("user");
    const body = await c.req.json();
    const existing = await queryOne(c.env.DB, "SELECT owner_id, manager_id FROM properties WHERE id = ?", [id]);
    if (!existing) return c.json({ error: "Property not found" }, 404);
    if (user.role !== "admin" && existing.owner_id !== user.userId && existing.manager_id !== user.userId) {
      return c.json({ error: "Forbidden - Not owner or manager" }, 403);
    }
    const fields = [];
    const params = [];
    const updatable = ["name", "description", "type", "address", "city", "state", "total_units", "year_built", "market_value", "status", "manager_id"];
    for (const field of updatable) {
      const camel = field.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
      if (body[field] !== void 0 || body[camel] !== void 0) {
        fields.push(`${field} = ?`);
        let val = body[field] ?? body[camel];
        if (field === "amenities" || field === "images") val = stringifyJSON(val);
        params.push(val);
      }
    }
    if (body.amenities) {
      fields.push("amenities = ?");
      params.push(stringifyJSON(body.amenities));
    }
    if (body.images) {
      fields.push("images = ?");
      params.push(stringifyJSON(body.images));
    }
    if (fields.length === 0) {
      return c.json({ error: "No fields to update" }, 400);
    }
    fields.push("updated_at = ?");
    params.push(nowISO());
    params.push(id);
    await execute(c.env.DB, `UPDATE properties SET ${fields.join(", ")} WHERE id = ?`, params);
    const updated = await queryOne(c.env.DB, "SELECT * FROM properties WHERE id = ?", [id]);
    return c.json({ success: true, data: mapPropertyRow(updated) });
  } catch (error3) {
    return c.json({ error: "Failed to update property", details: error3.message }, 500);
  }
});
properties.delete("/:id", authMiddleware, roleMiddleware(["owner", "admin"]), async (c) => {
  try {
    const id = c.req.param("id");
    const user = c.get("user");
    const existing = await queryOne(c.env.DB, "SELECT owner_id FROM properties WHERE id = ?", [id]);
    if (!existing) return c.json({ error: "Property not found" }, 404);
    if (user.role !== "admin" && existing.owner_id !== user.userId) {
      return c.json({ error: "Forbidden" }, 403);
    }
    await execute(c.env.DB, "DELETE FROM properties WHERE id = ?", [id]);
    return c.json({ success: true, message: "Property deleted" });
  } catch (error3) {
    return c.json({ error: "Failed to delete property", details: error3.message }, 500);
  }
});
properties.get("/:id/units", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const units = await queryAll(c.env.DB, "SELECT * FROM units WHERE property_id = ? ORDER BY unit_number", [id]);
    return c.json({ success: true, data: units.map(mapUnitRow) });
  } catch (error3) {
    return c.json({ error: "Failed to fetch units", details: error3.message }, 500);
  }
});
properties.post("/:id/units", authMiddleware, async (c) => {
  try {
    const propertyId = c.req.param("id");
    const body = await c.req.json();
    const { unitNumber, rent, bedrooms, bathrooms, area, status } = body;
    if (!unitNumber || rent === void 0) {
      return c.json({ error: "unitNumber and rent required" }, 400);
    }
    const id = generateId();
    const now = nowISO();
    await execute(c.env.DB, `
      INSERT INTO units (id, property_id, unit_number, rent, bedrooms, bathrooms, area, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, propertyId, unitNumber, rent, bedrooms || null, bathrooms || null, area || null, status || "vacant", now, now]);
    const created = await queryOne(c.env.DB, "SELECT * FROM units WHERE id = ?", [id]);
    return c.json({ success: true, data: mapUnitRow(created) }, 201);
  } catch (error3) {
    return c.json({ error: "Failed to create unit", details: error3.message }, 500);
  }
});
function mapPropertyRow(row) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    managerId: row.manager_id,
    name: row.name,
    description: row.description,
    type: row.type,
    address: row.address,
    city: row.city,
    state: row.state,
    country: row.country,
    zipCode: row.zip_code,
    latitude: row.latitude,
    longitude: row.longitude,
    totalUnits: row.total_units,
    totalArea: row.total_area,
    yearBuilt: row.year_built,
    marketValue: row.market_value,
    status: row.status,
    amenities: parseJSON(row.amenities, []),
    images: parseJSON(row.images, []),
    documents: parseJSON(row.documents, []),
    ownerName: row.owner_first ? `${row.owner_first} ${row.owner_last}` : void 0,
    managerName: row.manager_first ? `${row.manager_first} ${row.manager_last}` : void 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
__name(mapPropertyRow, "mapPropertyRow");
function mapUnitRow(row) {
  return {
    id: row.id,
    propertyId: row.property_id,
    unitNumber: row.unit_number,
    floor: row.floor,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area,
    rent: row.rent,
    securityDeposit: row.security_deposit,
    status: row.status,
    tenantId: row.tenant_id,
    leaseId: row.lease_id,
    amenities: parseJSON(row.amenities, []),
    images: parseJSON(row.images, []),
    virtualTourUrl: row.virtual_tour_url,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
__name(mapUnitRow, "mapUnitRow");
function mapTenantRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    unitId: row.unit_id,
    propertyId: row.property_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    leaseStart: row.lease_start,
    leaseEnd: row.lease_end,
    rentAmount: row.rent_amount,
    rentFrequency: row.rent_frequency,
    paymentDay: row.payment_day,
    securityDeposit: row.security_deposit,
    paymentStatus: row.payment_status,
    balance: row.balance,
    status: row.status,
    emergencyContact: parseJSON(row.emergency_contact, null),
    employmentInfo: parseJSON(row.employment_info, null),
    documents: parseJSON(row.documents, []),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
__name(mapTenantRow, "mapTenantRow");
var properties_default = properties;

// worker/routes/tenants.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth();
var tenants = new Hono2();
tenants.get("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const search = c.req.query("search") || "";
    const status = c.req.query("status") || "";
    const paymentStatus = c.req.query("paymentStatus") || "";
    let sql = `
      SELECT t.*, u.unit_number, p.name as property_name, p.address as property_address
      FROM tenants t
      LEFT JOIN units u ON t.unit_id = u.id
      LEFT JOIN properties p ON t.property_id = p.id
    `;
    const params = [];
    const conditions = [];
    if (user.role === "owner") {
      sql = `
        SELECT t.*, u.unit_number, p.name as property_name, p.address as property_address
        FROM tenants t
        LEFT JOIN units u ON t.unit_id = u.id
        LEFT JOIN properties p ON t.property_id = p.id
        WHERE p.owner_id = ?
      `;
      params.push(user.userId);
      if (search) {
        conditions.push("(t.first_name LIKE ? OR t.last_name LIKE ? OR t.email LIKE ?)");
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
    } else if (user.role === "manager") {
      sql = `
        SELECT t.*, u.unit_number, p.name as property_name, p.address as property_address
        FROM tenants t
        LEFT JOIN units u ON t.unit_id = u.id
        LEFT JOIN properties p ON t.property_id = p.id
        WHERE (p.manager_id = ? OR p.owner_id = ?)
      `;
      params.push(user.userId, user.userId);
      if (search) {
        conditions.push("(t.first_name LIKE ? OR t.last_name LIKE ? OR t.email LIKE ?)");
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
    } else if (user.role === "tenant") {
      sql = `
        SELECT t.*, u.unit_number, p.name as property_name, p.address as property_address
        FROM tenants t
        LEFT JOIN units u ON t.unit_id = u.id
        LEFT JOIN properties p ON t.property_id = p.id
        WHERE t.user_id = ? OR t.email = ?
      `;
      params.push(user.userId, user.email);
    } else {
      if (search) {
        conditions.push("(t.first_name LIKE ? OR t.last_name LIKE ? OR t.email LIKE ?)");
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
    }
    if (status && status !== "all") {
      conditions.push("t.status = ?");
      params.push(status);
    }
    if (paymentStatus && paymentStatus !== "all") {
      conditions.push("t.payment_status = ?");
      params.push(paymentStatus);
    }
    if (conditions.length > 0) {
      const hasWhere = sql.includes("WHERE");
      sql += (hasWhere ? " AND " : " WHERE ") + conditions.join(" AND ");
    }
    sql += " ORDER BY t.created_at DESC LIMIT 100";
    const rows = await queryAll(c.env.DB, sql, params);
    const data = rows.map(mapRow);
    return c.json({ success: true, data });
  } catch (error3) {
    console.error("Get tenants error:", error3);
    return c.json({ error: "Failed to fetch tenants", details: error3.message }, 500);
  }
});
tenants.get("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const row = await queryOne(c.env.DB, `
      SELECT t.*, u.unit_number, u.rent as unit_rent, p.name as property_name, p.address as property_address, p.city, p.state
      FROM tenants t
      LEFT JOIN units u ON t.unit_id = u.id
      LEFT JOIN properties p ON t.property_id = p.id
      WHERE t.id = ?
    `, [id]);
    if (!row) return c.json({ error: "Tenant not found" }, 404);
    const payments2 = await queryAll(c.env.DB, "SELECT * FROM payments WHERE tenant_id = ? ORDER BY payment_date DESC LIMIT 20", [id]);
    const maintenance2 = await queryAll(c.env.DB, "SELECT * FROM maintenance_requests WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 20", [id]);
    return c.json({
      success: true,
      data: {
        ...mapRow(row),
        payments: payments2,
        maintenanceRequests: maintenance2
      }
    });
  } catch (error3) {
    return c.json({ error: "Failed to fetch tenant", details: error3.message }, 500);
  }
});
tenants.post("/", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { unitId, propertyId, firstName, lastName, email, phone, leaseStart, leaseEnd, rentAmount, rentFrequency, securityDeposit } = body;
    if (!unitId || !propertyId || !firstName || !lastName || !email) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    const unit = await queryOne(c.env.DB, "SELECT id, status FROM units WHERE id = ?", [unitId]);
    if (!unit) return c.json({ error: "Unit not found" }, 404);
    const id = generateId();
    const now = nowISO();
    await execute(c.env.DB, `
      INSERT INTO tenants (id, unit_id, property_id, first_name, last_name, email, phone, lease_start, lease_end, rent_amount, rent_frequency, security_deposit, payment_status, balance, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', 0, 'active', ?, ?)
    `, [id, unitId, propertyId, firstName, lastName, email, phone || "", leaseStart || now, leaseEnd || new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString(), rentAmount || 0, rentFrequency || "monthly", securityDeposit || 0, now, now]);
    await execute(c.env.DB, "UPDATE units SET status = ?, tenant_id = ?, updated_at = ? WHERE id = ?", ["occupied", id, now, unitId]);
    const created = await queryOne(c.env.DB, "SELECT * FROM tenants WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow(created) }, 201);
  } catch (error3) {
    console.error("Create tenant error:", error3);
    return c.json({ error: "Failed to create tenant", details: error3.message }, 500);
  }
});
tenants.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await queryOne(c.env.DB, "SELECT id FROM tenants WHERE id = ?", [id]);
    if (!existing) return c.json({ error: "Tenant not found" }, 404);
    const fields = [];
    const params = [];
    const mapping = {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      phone: "phone",
      leaseStart: "lease_start",
      leaseEnd: "lease_end",
      rentAmount: "rent_amount",
      rentFrequency: "rent_frequency",
      paymentStatus: "payment_status",
      balance: "balance",
      status: "status",
      securityDeposit: "security_deposit",
      notes: "notes"
    };
    for (const [key, dbField] of Object.entries(mapping)) {
      if (body[key] !== void 0) {
        fields.push(`${dbField} = ?`);
        params.push(body[key]);
      }
    }
    if (fields.length === 0) return c.json({ error: "No fields to update" }, 400);
    fields.push("updated_at = ?");
    params.push(nowISO());
    params.push(id);
    await execute(c.env.DB, `UPDATE tenants SET ${fields.join(", ")} WHERE id = ?`, params);
    const updated = await queryOne(c.env.DB, "SELECT * FROM tenants WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow(updated) });
  } catch (error3) {
    return c.json({ error: "Failed to update tenant", details: error3.message }, 500);
  }
});
tenants.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const tenant = await queryOne(c.env.DB, "SELECT unit_id FROM tenants WHERE id = ?", [id]);
    if (!tenant) return c.json({ error: "Tenant not found" }, 404);
    await execute(c.env.DB, "DELETE FROM tenants WHERE id = ?", [id]);
    if (tenant.unit_id) {
      await execute(c.env.DB, "UPDATE units SET status = ?, tenant_id = NULL, updated_at = ? WHERE id = ?", ["vacant", nowISO(), tenant.unit_id]);
    }
    return c.json({ success: true, message: "Tenant deleted" });
  } catch (error3) {
    return c.json({ error: "Failed to delete tenant", details: error3.message }, 500);
  }
});
function mapRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    unitId: row.unit_id,
    propertyId: row.property_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    leaseStart: row.lease_start,
    leaseEnd: row.lease_end,
    rentAmount: row.rent_amount,
    rentFrequency: row.rent_frequency,
    paymentDay: row.payment_day,
    securityDeposit: row.security_deposit,
    paymentStatus: row.payment_status,
    balance: row.balance,
    status: row.status,
    unitNumber: row.unit_number,
    unitRent: row.unit_rent,
    propertyName: row.property_name,
    propertyAddress: row.property_address,
    city: row.city,
    state: row.state,
    emergencyContact: parseJSON(row.emergency_contact, null),
    employmentInfo: parseJSON(row.employment_info, null),
    documents: parseJSON(row.documents, []),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
__name(mapRow, "mapRow");
var tenants_default = tenants;

// worker/routes/payments.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth();
var payments = new Hono2();
payments.get("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const search = c.req.query("search") || "";
    const status = c.req.query("status") || "";
    const method = c.req.query("method") || "";
    const propertyId = c.req.query("propertyId") || "";
    const tenantId = c.req.query("tenantId") || "";
    let sql = `
      SELECT p.*, t.first_name as tenant_first, t.last_name as tenant_last,
             u.unit_number, prop.name as property_name
      FROM payments p
      LEFT JOIN tenants t ON p.tenant_id = t.id
      LEFT JOIN units u ON p.unit_id = u.id
      LEFT JOIN properties prop ON p.property_id = prop.id
    `;
    const params = [];
    const conditions = [];
    if (user.role === "owner") {
      conditions.push("prop.owner_id = ?");
      params.push(user.userId);
    } else if (user.role === "manager") {
      conditions.push("(prop.manager_id = ? OR prop.owner_id = ?)");
      params.push(user.userId, user.userId);
    } else if (user.role === "tenant") {
      conditions.push("(p.tenant_id IN (SELECT id FROM tenants WHERE user_id = ? OR email = ?) OR t.email = ?)");
      params.push(user.userId, user.email, user.email);
    }
    if (search) {
      conditions.push("(t.first_name LIKE ? OR t.last_name LIKE ? OR p.receipt_number LIKE ? OR prop.name LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status && status !== "all") {
      conditions.push("p.status = ?");
      params.push(status);
    }
    if (method && method !== "all") {
      conditions.push("p.payment_method = ?");
      params.push(method);
    }
    if (propertyId) {
      conditions.push("p.property_id = ?");
      params.push(propertyId);
    }
    if (tenantId) {
      conditions.push("p.tenant_id = ?");
      params.push(tenantId);
    }
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY p.payment_date DESC LIMIT 100";
    const rows = await queryAll(c.env.DB, sql, params);
    const data = rows.map(mapRow2);
    const totalCompleted = rows.filter((r) => r.status === "completed").reduce((sum, r) => sum + r.amount, 0);
    const totalPending = rows.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0);
    return c.json({
      success: true,
      data,
      summary: {
        totalCompleted,
        totalPending,
        completedCount: rows.filter((r) => r.status === "completed").length,
        pendingCount: rows.filter((r) => r.status === "pending").length,
        failedCount: rows.filter((r) => r.status === "failed").length,
        total: rows.length
      }
    });
  } catch (error3) {
    console.error("Get payments error:", error3);
    return c.json({ error: "Failed to fetch payments", details: error3.message }, 500);
  }
});
payments.get("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const row = await queryOne(c.env.DB, `
      SELECT p.*, t.first_name as tenant_first, t.last_name as tenant_last, t.email as tenant_email,
             u.unit_number, prop.name as property_name, prop.address as property_address
      FROM payments p
      LEFT JOIN tenants t ON p.tenant_id = t.id
      LEFT JOIN units u ON p.unit_id = u.id
      LEFT JOIN properties prop ON p.property_id = prop.id
      WHERE p.id = ?
    `, [id]);
    if (!row) return c.json({ error: "Payment not found" }, 404);
    return c.json({ success: true, data: mapRow2(row) });
  } catch (error3) {
    return c.json({ error: "Failed to fetch payment", details: error3.message }, 500);
  }
});
payments.post("/", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { tenantId, unitId, propertyId, amount, paymentMethod, status, dueDate, paymentDate, leaseId } = body;
    if (!tenantId || !unitId || !propertyId || !amount) {
      return c.json({ error: "tenantId, unitId, propertyId, amount required" }, 400);
    }
    const id = generateId();
    const now = nowISO();
    const receiptNumber = generateReceiptNumber();
    await execute(c.env.DB, `
      INSERT INTO payments (id, tenant_id, unit_id, property_id, lease_id, amount, currency, payment_date, due_date, payment_method, status, receipt_number, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'NGN', ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      tenantId,
      unitId,
      propertyId,
      leaseId || null,
      amount,
      paymentDate || now,
      dueDate || now,
      paymentMethod || "bank_transfer",
      status || "completed",
      receiptNumber,
      now,
      now
    ]);
    if ((status || "completed") === "completed") {
      const tenant = await queryOne(c.env.DB, "SELECT balance, rent_amount FROM tenants WHERE id = ?", [tenantId]);
      if (tenant) {
        const newBalance = Math.max(0, (tenant.balance || 0) - amount);
        const paymentStatus = newBalance <= 0 ? "paid" : newBalance < tenant.rent_amount ? "owing" : "unpaid";
        await execute(c.env.DB, "UPDATE tenants SET balance = ?, payment_status = ?, updated_at = ? WHERE id = ?", [newBalance, paymentStatus, now, tenantId]);
      }
    }
    await execute(c.env.DB, `
      INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, property_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [generateId(), c.get("user").userId, "create", "payment", id, propertyId, JSON.stringify({ amount, method: paymentMethod }), now]);
    const created = await queryOne(c.env.DB, "SELECT * FROM payments WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow2(created) }, 201);
  } catch (error3) {
    console.error("Create payment error:", error3);
    return c.json({ error: "Failed to create payment", details: error3.message }, 500);
  }
});
payments.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await queryOne(c.env.DB, "SELECT id FROM payments WHERE id = ?", [id]);
    if (!existing) return c.json({ error: "Payment not found" }, 404);
    const fields = [];
    const params = [];
    const mapping = {
      amount: "amount",
      paymentMethod: "payment_method",
      status: "status",
      paymentDate: "payment_date",
      dueDate: "due_date",
      notes: "notes"
    };
    for (const [key, dbField] of Object.entries(mapping)) {
      if (body[key] !== void 0) {
        fields.push(`${dbField} = ?`);
        params.push(body[key]);
      }
    }
    if (fields.length === 0) return c.json({ error: "No fields to update" }, 400);
    fields.push("updated_at = ?");
    params.push(nowISO());
    params.push(id);
    await execute(c.env.DB, `UPDATE payments SET ${fields.join(", ")} WHERE id = ?`, params);
    const updated = await queryOne(c.env.DB, "SELECT * FROM payments WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow2(updated) });
  } catch (error3) {
    return c.json({ error: "Failed to update payment", details: error3.message }, 500);
  }
});
payments.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    await execute(c.env.DB, "DELETE FROM payments WHERE id = ?", [id]);
    return c.json({ success: true, message: "Payment deleted" });
  } catch (error3) {
    return c.json({ error: "Failed to delete payment", details: error3.message }, 500);
  }
});
payments.post("/record", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { tenantId, amount, method, date } = body;
    if (!tenantId || !amount) {
      return c.json({ error: "tenantId and amount required" }, 400);
    }
    const tenant = await queryOne(c.env.DB, "SELECT unit_id, property_id FROM tenants WHERE id = ?", [tenantId]);
    if (!tenant) return c.json({ error: "Tenant not found" }, 404);
    const id = generateId();
    const now = nowISO();
    const receiptNumber = generateReceiptNumber();
    await execute(c.env.DB, `
      INSERT INTO payments (id, tenant_id, unit_id, property_id, amount, currency, payment_date, due_date, payment_method, status, receipt_number, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'NGN', ?, ?, ?, 'completed', ?, ?, ?)
    `, [id, tenantId, tenant.unit_id, tenant.property_id, amount, date || now, date || now, method || "bank_transfer", receiptNumber, now, now]);
    const tenantData = await queryOne(c.env.DB, "SELECT balance, rent_amount FROM tenants WHERE id = ?", [tenantId]);
    if (tenantData) {
      const newBalance = Math.max(0, (tenantData.balance || 0) - amount);
      const paymentStatus = newBalance <= 0 ? "paid" : newBalance < tenantData.rent_amount ? "owing" : "unpaid";
      await execute(c.env.DB, "UPDATE tenants SET balance = ?, payment_status = ?, updated_at = ? WHERE id = ?", [newBalance, paymentStatus, now, tenantId]);
    }
    return c.json({ success: true, data: { id, receiptNumber, amount } }, 201);
  } catch (error3) {
    return c.json({ error: "Failed to record payment", details: error3.message }, 500);
  }
});
function mapRow2(row) {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    unitId: row.unit_id,
    propertyId: row.property_id,
    leaseId: row.lease_id,
    amount: row.amount,
    currency: row.currency,
    paymentDate: row.payment_date,
    date: row.payment_date,
    dueDate: row.due_date,
    paymentMethod: row.payment_method,
    method: row.payment_method,
    status: row.status,
    referenceNumber: row.reference_number,
    receiptNumber: row.receipt_number,
    gatewayTransactionId: row.gateway_transaction_id,
    fees: row.fees,
    notes: row.notes,
    processedBy: row.processed_by,
    tenantFirstName: row.tenant_first,
    tenantLastName: row.tenant_last,
    tenantEmail: row.tenant_email,
    unitNumber: row.unit_number,
    propertyName: row.property_name,
    propertyAddress: row.property_address,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
__name(mapRow2, "mapRow");
var payments_default = payments;

// worker/routes/maintenance.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth();
var maintenance = new Hono2();
maintenance.get("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const status = c.req.query("status") || "";
    const priority = c.req.query("priority") || "";
    const propertyId = c.req.query("propertyId") || "";
    const search = c.req.query("search") || "";
    let sql = `
      SELECT mr.*, t.first_name as tenant_first, t.last_name as tenant_last,
             u.unit_number, p.name as property_name, p.address as property_address,
             reporter.first_name as reporter_first, reporter.last_name as reporter_last,
             assignee.first_name as assignee_first, assignee.last_name as assignee_last
      FROM maintenance_requests mr
      LEFT JOIN tenants t ON mr.tenant_id = t.id
      LEFT JOIN units u ON mr.unit_id = u.id
      LEFT JOIN properties p ON mr.property_id = p.id
      LEFT JOIN users reporter ON mr.reported_by = reporter.id
      LEFT JOIN users assignee ON mr.assigned_to = assignee.id
    `;
    const params = [];
    const conditions = [];
    if (user.role === "owner") {
      conditions.push("p.owner_id = ?");
      params.push(user.userId);
    } else if (user.role === "manager") {
      conditions.push("(p.manager_id = ? OR p.owner_id = ?)");
      params.push(user.userId, user.userId);
    } else if (user.role === "tenant") {
      conditions.push("(mr.tenant_id IN (SELECT id FROM tenants WHERE user_id = ? OR email = ?) OR mr.reported_by = ?)");
      params.push(user.userId, user.email, user.userId);
    } else if (user.role === "contractor") {
      conditions.push("(mr.assigned_to = ? OR mr.assigned_to IS NULL)");
      params.push(user.userId);
    }
    if (status && status !== "all") {
      conditions.push("mr.status = ?");
      params.push(status);
    }
    if (priority && priority !== "all") {
      conditions.push("mr.priority = ?");
      params.push(priority);
    }
    if (propertyId) {
      conditions.push("mr.property_id = ?");
      params.push(propertyId);
    }
    if (search) {
      conditions.push("(mr.title LIKE ? OR mr.description LIKE ? OR p.name LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += ' ORDER BY CASE mr.priority WHEN "emergency" THEN 0 WHEN "high" THEN 1 WHEN "medium" THEN 2 ELSE 3 END, mr.created_at DESC LIMIT 100';
    const rows = await queryAll(c.env.DB, sql, params);
    return c.json({ success: true, data: rows.map(mapRow3) });
  } catch (error3) {
    console.error("Get maintenance error:", error3);
    return c.json({ error: "Failed to fetch maintenance requests", details: error3.message }, 500);
  }
});
maintenance.get("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const row = await queryOne(c.env.DB, `
      SELECT mr.*, t.first_name as tenant_first, t.last_name as tenant_last, t.email as tenant_email,
             u.unit_number, p.name as property_name, p.address as property_address,
             reporter.first_name as reporter_first, reporter.last_name as reporter_last,
             assignee.first_name as assignee_first, assignee.last_name as assignee_last
      FROM maintenance_requests mr
      LEFT JOIN tenants t ON mr.tenant_id = t.id
      LEFT JOIN units u ON mr.unit_id = u.id
      LEFT JOIN properties p ON mr.property_id = p.id
      LEFT JOIN users reporter ON mr.reported_by = reporter.id
      LEFT JOIN users assignee ON mr.assigned_to = assignee.id
      WHERE mr.id = ?
    `, [id]);
    if (!row) return c.json({ error: "Maintenance request not found" }, 404);
    return c.json({ success: true, data: mapRow3(row) });
  } catch (error3) {
    return c.json({ error: "Failed to fetch maintenance request", details: error3.message }, 500);
  }
});
maintenance.post("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json();
    const { propertyId, unitId, tenantId, title: title2, description, priority, category, images, estimatedCost } = body;
    if (!propertyId || !unitId || !title2 || !description) {
      return c.json({ error: "propertyId, unitId, title, description required" }, 400);
    }
    const id = generateId();
    const now = nowISO();
    await execute(c.env.DB, `
      INSERT INTO maintenance_requests (id, property_id, unit_id, tenant_id, reported_by, title, description, priority, category, status, images, estimated_cost, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
    `, [
      id,
      propertyId,
      unitId,
      tenantId || null,
      user.userId,
      title2,
      description,
      priority || "medium",
      category || "general",
      stringifyJSON(images || []),
      estimatedCost || null,
      now,
      now
    ]);
    const created = await queryOne(c.env.DB, "SELECT * FROM maintenance_requests WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow3(created) }, 201);
  } catch (error3) {
    console.error("Create maintenance error:", error3);
    return c.json({ error: "Failed to create maintenance request", details: error3.message }, 500);
  }
});
maintenance.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await queryOne(c.env.DB, "SELECT id FROM maintenance_requests WHERE id = ?", [id]);
    if (!existing) return c.json({ error: "Maintenance request not found" }, 404);
    const fields = [];
    const params = [];
    const mapping = {
      title: "title",
      description: "description",
      priority: "priority",
      category: "category",
      status: "status",
      assignedTo: "assigned_to",
      estimatedCost: "estimated_cost",
      actualCost: "actual_cost",
      scheduledDate: "scheduled_date",
      completedDate: "completed_date",
      rating: "rating",
      feedback: "feedback"
    };
    for (const [key, dbField] of Object.entries(mapping)) {
      if (body[key] !== void 0) {
        fields.push(`${dbField} = ?`);
        params.push(body[key]);
      }
    }
    if (body.images) {
      fields.push("images = ?");
      params.push(stringifyJSON(body.images));
    }
    if (fields.length === 0) return c.json({ error: "No fields to update" }, 400);
    fields.push("updated_at = ?");
    params.push(nowISO());
    params.push(id);
    await execute(c.env.DB, `UPDATE maintenance_requests SET ${fields.join(", ")} WHERE id = ?`, params);
    const updated = await queryOne(c.env.DB, "SELECT * FROM maintenance_requests WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow3(updated) });
  } catch (error3) {
    return c.json({ error: "Failed to update maintenance request", details: error3.message }, 500);
  }
});
maintenance.post("/:id/assign", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { contractorId } = body;
    if (!contractorId) return c.json({ error: "contractorId required" }, 400);
    await execute(c.env.DB, "UPDATE maintenance_requests SET assigned_to = ?, status = ?, updated_at = ? WHERE id = ?", [contractorId, "assigned", nowISO(), id]);
    const updated = await queryOne(c.env.DB, "SELECT * FROM maintenance_requests WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow3(updated) });
  } catch (error3) {
    return c.json({ error: "Failed to assign maintenance request", details: error3.message }, 500);
  }
});
maintenance.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    await execute(c.env.DB, "DELETE FROM maintenance_requests WHERE id = ?", [id]);
    return c.json({ success: true, message: "Maintenance request deleted" });
  } catch (error3) {
    return c.json({ error: "Failed to delete", details: error3.message }, 500);
  }
});
function mapRow3(row) {
  return {
    id: row.id,
    propertyId: row.property_id,
    unitId: row.unit_id,
    tenantId: row.tenant_id,
    reportedBy: row.reported_by,
    assignedTo: row.assigned_to,
    title: row.title,
    description: row.description,
    priority: row.priority,
    category: row.category,
    status: row.status,
    images: parseJSON(row.images, []),
    estimatedCost: row.estimated_cost,
    actualCost: row.actual_cost,
    scheduledDate: row.scheduled_date,
    completedDate: row.completed_date,
    rating: row.rating,
    feedback: row.feedback,
    tenantFirstName: row.tenant_first,
    tenantLastName: row.tenant_last,
    tenantEmail: row.tenant_email,
    unitNumber: row.unit_number,
    propertyName: row.property_name,
    propertyAddress: row.property_address,
    reporterFirstName: row.reporter_first,
    reporterLastName: row.reporter_last,
    assigneeFirstName: row.assignee_first,
    assigneeLastName: row.assignee_last,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
__name(mapRow3, "mapRow");
var maintenance_default = maintenance;

// worker/routes/expenses.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth();
var expenses = new Hono2();
expenses.get("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const category = c.req.query("category") || "";
    const propertyId = c.req.query("propertyId") || "";
    const search = c.req.query("search") || "";
    let sql = `
      SELECT e.*, p.name as property_name, p.address as property_address,
             u.unit_number, approver.first_name as approver_first, approver.last_name as approver_last
      FROM expenses e
      LEFT JOIN properties p ON e.property_id = p.id
      LEFT JOIN units u ON e.unit_id = u.id
      LEFT JOIN users approver ON e.approved_by = approver.id
    `;
    const params = [];
    const conditions = [];
    if (user.role === "owner") {
      conditions.push("p.owner_id = ?");
      params.push(user.userId);
    } else if (user.role === "manager") {
      conditions.push("(p.manager_id = ? OR p.owner_id = ?)");
      params.push(user.userId, user.userId);
    }
    if (category && category !== "all") {
      conditions.push("e.category = ?");
      params.push(category);
    }
    if (propertyId) {
      conditions.push("e.property_id = ?");
      params.push(propertyId);
    }
    if (search) {
      conditions.push("(e.description LIKE ? OR e.vendor LIKE ? OR p.name LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY e.date DESC LIMIT 100";
    const rows = await queryAll(c.env.DB, sql, params);
    const total = rows.reduce((sum, r) => sum + r.amount, 0);
    return c.json({
      success: true,
      data: rows.map(mapRow4),
      summary: {
        total,
        count: rows.length,
        byCategory: groupByCategory(rows)
      }
    });
  } catch (error3) {
    return c.json({ error: "Failed to fetch expenses", details: error3.message }, 500);
  }
});
expenses.post("/", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { propertyId, unitId, category, amount, description, date, vendor } = body;
    if (!propertyId || !category || !amount || !description) {
      return c.json({ error: "propertyId, category, amount, description required" }, 400);
    }
    const id = generateId();
    const now = nowISO();
    await execute(c.env.DB, `
      INSERT INTO expenses (id, property_id, unit_id, category, amount, date, description, vendor, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?)
    `, [id, propertyId, unitId || null, category, amount, date || now, description, vendor || null, now, now]);
    const created = await queryOne(c.env.DB, "SELECT * FROM expenses WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow4(created) }, 201);
  } catch (error3) {
    return c.json({ error: "Failed to create expense", details: error3.message }, 500);
  }
});
expenses.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await queryOne(c.env.DB, "SELECT id FROM expenses WHERE id = ?", [id]);
    if (!existing) return c.json({ error: "Expense not found" }, 404);
    const fields = [];
    const params = [];
    const mapping = {
      category: "category",
      amount: "amount",
      description: "description",
      date: "date",
      vendor: "vendor",
      status: "status",
      propertyId: "property_id",
      unitId: "unit_id"
    };
    for (const [key, dbField] of Object.entries(mapping)) {
      if (body[key] !== void 0) {
        fields.push(`${dbField} = ?`);
        params.push(body[key]);
      }
    }
    if (fields.length === 0) return c.json({ error: "No fields to update" }, 400);
    fields.push("updated_at = ?");
    params.push(nowISO());
    params.push(id);
    await execute(c.env.DB, `UPDATE expenses SET ${fields.join(", ")} WHERE id = ?`, params);
    const updated = await queryOne(c.env.DB, "SELECT * FROM expenses WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow4(updated) });
  } catch (error3) {
    return c.json({ error: "Failed to update expense", details: error3.message }, 500);
  }
});
expenses.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    await execute(c.env.DB, "DELETE FROM expenses WHERE id = ?", [id]);
    return c.json({ success: true, message: "Expense deleted" });
  } catch (error3) {
    return c.json({ error: "Failed to delete expense", details: error3.message }, 500);
  }
});
function mapRow4(row) {
  return {
    id: row.id,
    propertyId: row.property_id,
    unitId: row.unit_id,
    category: row.category,
    subcategory: row.subcategory,
    amount: row.amount,
    currency: row.currency,
    date: row.date,
    description: row.description,
    vendor: row.vendor,
    receiptUrl: row.receipt_url,
    approvedBy: row.approved_by,
    status: row.status,
    recurring: !!row.recurring,
    propertyName: row.property_name,
    propertyAddress: row.property_address,
    unitNumber: row.unit_number,
    approverFirstName: row.approver_first,
    approverLastName: row.approver_last,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
__name(mapRow4, "mapRow");
function groupByCategory(rows) {
  const groups = {};
  for (const r of rows) {
    groups[r.category] = (groups[r.category] || 0) + r.amount;
  }
  return groups;
}
__name(groupByCategory, "groupByCategory");
var expenses_default = expenses;

// worker/routes/analytics.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var analytics = new Hono2();
analytics.get("/summary", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    let propertyFilter = "";
    let propertyParams = [];
    if (user.role === "owner") {
      propertyFilter = "WHERE owner_id = ?";
      propertyParams = [user.userId];
    } else if (user.role === "manager") {
      propertyFilter = "WHERE manager_id = ? OR owner_id = ?";
      propertyParams = [user.userId, user.userId];
    }
    const properties2 = await queryAll(c.env.DB, `SELECT id FROM properties ${propertyFilter}`, propertyParams);
    const propertyIds = properties2.map((p) => p.id);
    let propertyIdFilter = "";
    let filterParams = [];
    if (propertyIds.length > 0) {
      propertyIdFilter = `WHERE property_id IN (${propertyIds.map(() => "?").join(",")})`;
      filterParams = propertyIds;
    } else if (user.role === "owner" || user.role === "manager") {
      return c.json({
        success: true,
        data: {
          totalProperties: 0,
          totalUnits: 0,
          occupiedUnits: 0,
          vacantUnits: 0,
          maintenanceUnits: 0,
          occupancyRate: 0,
          totalTenants: 0,
          paidTenants: 0,
          owingTenants: 0,
          unpaidTenants: 0,
          totalRevenue: 0,
          totalExpenses: 0,
          netIncome: 0,
          collectionRate: 0,
          pendingMaintenance: 0,
          inProgressMaintenance: 0,
          completedMaintenance: 0
        }
      });
    }
    const unitsSql = propertyIds.length > 0 ? `SELECT status, rent FROM units WHERE property_id IN (${propertyIds.map(() => "?").join(",")})` : "SELECT status, rent FROM units";
    const units = await queryAll(c.env.DB, unitsSql, propertyIds.length > 0 ? propertyIds : []);
    const totalUnits = units.length;
    const occupiedUnits = units.filter((u) => u.status === "occupied").length;
    const vacantUnits = units.filter((u) => u.status === "vacant").length;
    const maintenanceUnits = units.filter((u) => u.status === "maintenance").length;
    const occupancyRate = totalUnits > 0 ? Math.round(occupiedUnits / totalUnits * 100) : 0;
    const tenantsSql = propertyIds.length > 0 ? `SELECT payment_status, rent_amount, balance FROM tenants WHERE property_id IN (${propertyIds.map(() => "?").join(",")}) AND status = 'active'` : "SELECT payment_status, rent_amount, balance FROM tenants WHERE status = ?";
    const tenantsParams = propertyIds.length > 0 ? propertyIds : ["active"];
    const tenants2 = await queryAll(c.env.DB, tenantsSql, tenantsParams);
    const totalTenants = tenants2.length;
    const paidTenants = tenants2.filter((t) => t.payment_status === "paid").length;
    const owingTenants = tenants2.filter((t) => t.payment_status === "owing").length;
    const unpaidTenants = tenants2.filter((t) => t.payment_status === "unpaid").length;
    const paymentsSql = propertyIds.length > 0 ? `SELECT amount, status FROM payments WHERE property_id IN (${propertyIds.map(() => "?").join(",")})` : "SELECT amount, status FROM payments";
    const payments2 = await queryAll(c.env.DB, paymentsSql, propertyIds.length > 0 ? propertyIds : []);
    const totalRevenue = payments2.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
    const totalRentExpected = tenants2.reduce((sum, t) => sum + (t.rent_amount || 0), 0);
    const collectionRate = totalRentExpected > 0 ? Math.round(totalRevenue / totalRentExpected * 100) : 0;
    const expensesSql = propertyIds.length > 0 ? `SELECT amount FROM expenses WHERE property_id IN (${propertyIds.map(() => "?").join(",")})` : "SELECT amount FROM expenses";
    const expenses2 = await queryAll(c.env.DB, expensesSql, propertyIds.length > 0 ? propertyIds : []);
    const totalExpenses = expenses2.reduce((sum, e) => sum + e.amount, 0);
    const maintenanceSql = propertyIds.length > 0 ? `SELECT status FROM maintenance_requests WHERE property_id IN (${propertyIds.map(() => "?").join(",")})` : "SELECT status FROM maintenance_requests";
    const maintenance2 = await queryAll(c.env.DB, maintenanceSql, propertyIds.length > 0 ? propertyIds : []);
    const pendingMaintenance = maintenance2.filter((m) => m.status === "pending").length;
    const inProgressMaintenance = maintenance2.filter((m) => m.status === "in_progress" || m.status === "assigned").length;
    const completedMaintenance = maintenance2.filter((m) => m.status === "completed").length;
    return c.json({
      success: true,
      data: {
        totalProperties: properties2.length,
        totalUnits,
        occupiedUnits,
        vacantUnits,
        maintenanceUnits,
        occupancyRate,
        totalTenants,
        paidTenants,
        owingTenants,
        unpaidTenants,
        totalRevenue,
        totalExpenses,
        netIncome: totalRevenue - totalExpenses,
        collectionRate,
        pendingMaintenance,
        inProgressMaintenance,
        completedMaintenance,
        totalOutstanding: tenants2.filter((t) => t.payment_status !== "paid").reduce((sum, t) => sum + (t.balance || 0), 0)
      }
    });
  } catch (error3) {
    console.error("Analytics summary error:", error3);
    return c.json({ error: "Failed to fetch analytics", details: error3.message }, 500);
  }
});
analytics.get("/revenue", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const period = c.req.query("period") || "6m";
    let propertyIds = [];
    if (user.role === "owner" || user.role === "manager") {
      const props = await queryAll(
        c.env.DB,
        user.role === "owner" ? "SELECT id FROM properties WHERE owner_id = ?" : "SELECT id FROM properties WHERE manager_id = ? OR owner_id = ?",
        user.role === "owner" ? [user.userId] : [user.userId, user.userId]
      );
      propertyIds = props.map((p) => p.id);
    }
    const months = 6;
    const revenueTrend = [];
    const now = /* @__PURE__ */ new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
      const monthName = date.toLocaleString("default", { month: "short" });
      let paymentSql = "SELECT amount FROM payments WHERE status = ? AND payment_date >= ? AND payment_date <= ?";
      let paymentParams = ["completed", monthStart, monthEnd];
      if (propertyIds.length > 0) {
        paymentSql += ` AND property_id IN (${propertyIds.map(() => "?").join(",")})`;
        paymentParams = [...paymentParams, ...propertyIds];
      }
      const monthPayments = await queryAll(c.env.DB, paymentSql, paymentParams);
      const revenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      let expenseSql = "SELECT amount FROM expenses WHERE date >= ? AND date <= ?";
      let expenseParams = [monthStart, monthEnd];
      if (propertyIds.length > 0) {
        expenseSql += ` AND property_id IN (${propertyIds.map(() => "?").join(",")})`;
        expenseParams = [...expenseParams, ...propertyIds];
      }
      const monthExpenses = await queryAll(c.env.DB, expenseSql, expenseParams);
      const expenses2 = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
      revenueTrend.push({
        month: monthName,
        revenue: Math.round(revenue / 1e3),
        expenses: Math.round(expenses2 / 1e3),
        net: Math.round((revenue - expenses2) / 1e3),
        revenueRaw: revenue,
        expensesRaw: expenses2
      });
    }
    let revenueByProperty = [];
    if (propertyIds.length > 0) {
      const props = await queryAll(c.env.DB, `SELECT id, name FROM properties WHERE id IN (${propertyIds.map(() => "?").join(",")})`, propertyIds);
      for (const prop of props) {
        const propPayments = await queryAll(c.env.DB, "SELECT amount FROM payments WHERE property_id = ? AND status = ?", [prop.id, "completed"]);
        const revenue = propPayments.reduce((sum, p) => sum + p.amount, 0);
        revenueByProperty.push({
          name: prop.name,
          revenue: revenue / 1e3,
          revenueRaw: revenue
        });
      }
    } else {
      const props = await queryAll(c.env.DB, "SELECT id, name FROM properties LIMIT 10", []);
      for (const prop of props) {
        const propPayments = await queryAll(c.env.DB, "SELECT amount FROM payments WHERE property_id = ? AND status = ?", [prop.id, "completed"]);
        const revenue = propPayments.reduce((sum, p) => sum + p.amount, 0);
        revenueByProperty.push({
          name: prop.name,
          revenue: revenue / 1e3,
          revenueRaw: revenue
        });
      }
    }
    return c.json({
      success: true,
      data: {
        revenueTrend,
        revenueByProperty
      }
    });
  } catch (error3) {
    return c.json({ error: "Failed to fetch revenue analytics", details: error3.message }, 500);
  }
});
analytics.get("/occupancy", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    let propertyIds = [];
    if (user.role === "owner" || user.role === "manager") {
      const props = await queryAll(
        c.env.DB,
        user.role === "owner" ? "SELECT id FROM properties WHERE owner_id = ?" : "SELECT id FROM properties WHERE manager_id = ? OR owner_id = ?",
        user.role === "owner" ? [user.userId] : [user.userId, user.userId]
      );
      propertyIds = props.map((p) => p.id);
    }
    const months = 6;
    const occupancyTrend = [];
    const now = /* @__PURE__ */ new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString("default", { month: "short" });
      occupancyTrend.push({
        month: monthName,
        occupancy: 70 + Math.random() * 25
      });
    }
    return c.json({
      success: true,
      data: { occupancyTrend }
    });
  } catch (error3) {
    return c.json({ error: "Failed to fetch occupancy analytics", details: error3.message }, 500);
  }
});
var analytics_default = analytics;

// worker/routes/listings.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth();
var listings = new Hono2();
listings.get("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const status = c.req.query("status") || "";
    let sql = `
      SELECT l.*, p.name as property_name, u.unit_number,
             agent.first_name as agent_first, agent.last_name as agent_last
      FROM listings l
      LEFT JOIN properties p ON l.property_id = p.id
      LEFT JOIN units u ON l.unit_id = u.id
      LEFT JOIN users agent ON l.agent_id = agent.id
    `;
    const params = [];
    const conditions = [];
    if (user.role === "realtor") {
      conditions.push("l.agent_id = ?");
      params.push(user.userId);
    }
    if (status && status !== "all") {
      conditions.push("l.status = ?");
      params.push(status);
    }
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY l.created_at DESC LIMIT 100";
    const rows = await queryAll(c.env.DB, sql, params);
    return c.json({ success: true, data: rows.map(mapRow5) });
  } catch (error3) {
    return c.json({ error: "Failed to fetch listings", details: error3.message }, 500);
  }
});
listings.post("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json();
    const { propertyId, unitId, title: title2, description, rent, images, featured } = body;
    if (!propertyId || !unitId || !title2 || !rent) {
      return c.json({ error: "propertyId, unitId, title, rent required" }, 400);
    }
    const id = generateId();
    const now = nowISO();
    await execute(c.env.DB, `
      INSERT INTO listings (id, property_id, unit_id, agent_id, title, description, rent, images, featured, status, views, leads_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 0, 0, ?, ?)
    `, [id, propertyId, unitId, user.userId, title2, description || "", rent, stringifyJSON(images || []), featured ? 1 : 0, now, now]);
    const created = await queryOne(c.env.DB, "SELECT * FROM listings WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow5(created) }, 201);
  } catch (error3) {
    return c.json({ error: "Failed to create listing", details: error3.message }, 500);
  }
});
listings.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await queryOne(c.env.DB, "SELECT id FROM listings WHERE id = ?", [id]);
    if (!existing) return c.json({ error: "Listing not found" }, 404);
    const fields = [];
    const params = [];
    const mapping = {
      title: "title",
      description: "description",
      rent: "rent",
      status: "status",
      virtualTourUrl: "virtual_tour_url",
      videoUrl: "video_url"
    };
    for (const [key, dbField] of Object.entries(mapping)) {
      if (body[key] !== void 0) {
        fields.push(`${dbField} = ?`);
        params.push(body[key]);
      }
    }
    if (body.images) {
      fields.push("images = ?");
      params.push(stringifyJSON(body.images));
    }
    if (body.featured !== void 0) {
      fields.push("featured = ?");
      params.push(body.featured ? 1 : 0);
    }
    if (fields.length === 0) return c.json({ error: "No fields to update" }, 400);
    fields.push("updated_at = ?");
    params.push(nowISO());
    params.push(id);
    await execute(c.env.DB, `UPDATE listings SET ${fields.join(", ")} WHERE id = ?`, params);
    const updated = await queryOne(c.env.DB, "SELECT * FROM listings WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow5(updated) });
  } catch (error3) {
    return c.json({ error: "Failed to update listing", details: error3.message }, 500);
  }
});
function mapRow5(row) {
  return {
    id: row.id,
    propertyId: row.property_id,
    unitId: row.unit_id,
    agentId: row.agent_id,
    title: row.title,
    description: row.description,
    rent: row.rent,
    images: parseJSON(row.images, []),
    virtualTourUrl: row.virtual_tour_url,
    videoUrl: row.video_url,
    featured: !!row.featured,
    status: row.status,
    verifiedBy: row.verified_by,
    views: row.views,
    leads: row.leads_count,
    leadsCount: row.leads_count,
    amenities: parseJSON(row.amenities, []),
    propertyName: row.property_name,
    unitNumber: row.unit_number,
    agentFirstName: row.agent_first,
    agentLastName: row.agent_last,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
__name(mapRow5, "mapRow");
var listings_default = listings;

// worker/routes/leads.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth();
var leads = new Hono2();
leads.get("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const status = c.req.query("status") || "";
    let sql = `
      SELECT ld.*, l.title as listing_title, p.name as property_name
      FROM leads ld
      LEFT JOIN listings l ON ld.listing_id = l.id
      LEFT JOIN properties p ON l.property_id = p.id
    `;
    const params = [];
    const conditions = [];
    if (user.role === "realtor") {
      conditions.push("ld.agent_id = ?");
      params.push(user.userId);
    }
    if (status && status !== "all") {
      conditions.push("ld.status = ?");
      params.push(status);
    }
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY ld.created_at DESC LIMIT 100";
    const rows = await queryAll(c.env.DB, sql, params);
    return c.json({ success: true, data: rows.map(mapRow6) });
  } catch (error3) {
    return c.json({ error: "Failed to fetch leads", details: error3.message }, 500);
  }
});
leads.post("/", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { listingId, name, email, phone, message: message2, source } = body;
    if (!listingId || !name || !email || !phone) {
      return c.json({ error: "listingId, name, email, phone required" }, 400);
    }
    const listing = await queryOne(c.env.DB, "SELECT agent_id FROM listings WHERE id = ?", [listingId]);
    if (!listing) return c.json({ error: "Listing not found" }, 404);
    const id = generateId();
    const now = nowISO();
    await execute(c.env.DB, `
      INSERT INTO leads (id, listing_id, agent_id, name, email, phone, message, status, source, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)
    `, [id, listingId, listing.agent_id, name, email, phone, message2 || "", source || "website", now, now]);
    await execute(c.env.DB, "UPDATE listings SET leads_count = leads_count + 1, updated_at = ? WHERE id = ?", [now, listingId]);
    const created = await queryOne(c.env.DB, "SELECT * FROM leads WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow6(created) }, 201);
  } catch (error3) {
    return c.json({ error: "Failed to create lead", details: error3.message }, 500);
  }
});
leads.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const existing = await queryOne(c.env.DB, "SELECT id FROM leads WHERE id = ?", [id]);
    if (!existing) return c.json({ error: "Lead not found" }, 404);
    const fields = [];
    const params = [];
    const mapping = {
      status: "status",
      notes: "notes",
      scheduledViewing: "scheduled_viewing",
      name: "name",
      email: "email",
      phone: "phone",
      message: "message"
    };
    for (const [key, dbField] of Object.entries(mapping)) {
      if (body[key] !== void 0) {
        fields.push(`${dbField} = ?`);
        params.push(body[key]);
      }
    }
    if (fields.length === 0) return c.json({ error: "No fields to update" }, 400);
    fields.push("updated_at = ?");
    params.push(nowISO());
    params.push(id);
    await execute(c.env.DB, `UPDATE leads SET ${fields.join(", ")} WHERE id = ?`, params);
    const updated = await queryOne(c.env.DB, "SELECT * FROM leads WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow6(updated) });
  } catch (error3) {
    return c.json({ error: "Failed to update lead", details: error3.message }, 500);
  }
});
function mapRow6(row) {
  return {
    id: row.id,
    listingId: row.listing_id,
    agentId: row.agent_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    status: row.status,
    scheduledViewing: row.scheduled_viewing,
    notes: row.notes,
    source: row.source,
    score: row.score,
    listingTitle: row.listing_title,
    propertyName: row.property_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
__name(mapRow6, "mapRow");
var leads_default = leads;

// worker/routes/applications.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth();
var applications = new Hono2();
applications.get("/", authMiddleware, async (c) => {
  try {
    const status = c.req.query("status") || "";
    let sql = `
      SELECT a.*, p.name as property_name, u.unit_number,
             reviewer.first_name as reviewer_first, reviewer.last_name as reviewer_last
      FROM applications a
      LEFT JOIN properties p ON a.property_id = p.id
      LEFT JOIN units u ON a.unit_id = u.id
      LEFT JOIN users reviewer ON a.reviewed_by = reviewer.id
    `;
    const params = [];
    const conditions = [];
    if (status && status !== "all") {
      conditions.push("a.status = ?");
      params.push(status);
    }
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY a.created_at DESC LIMIT 100";
    const rows = await queryAll(c.env.DB, sql, params);
    return c.json({ success: true, data: rows.map(mapRow7) });
  } catch (error3) {
    return c.json({ error: "Failed to fetch applications", details: error3.message }, 500);
  }
});
applications.get("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const row = await queryOne(c.env.DB, `
      SELECT a.*, p.name as property_name, u.unit_number
      FROM applications a
      LEFT JOIN properties p ON a.property_id = p.id
      LEFT JOIN units u ON a.unit_id = u.id
      WHERE a.id = ?
    `, [id]);
    if (!row) return c.json({ error: "Application not found" }, 404);
    return c.json({ success: true, data: mapRow7(row) });
  } catch (error3) {
    return c.json({ error: "Failed to fetch application", details: error3.message }, 500);
  }
});
applications.post("/", authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { propertyId, unitId, firstName, lastName, email, phone, employmentStatus, monthlyIncome, moveInDate, references } = body;
    if (!propertyId || !unitId || !firstName || !lastName || !email) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    const id = generateId();
    const now = nowISO();
    await execute(c.env.DB, `
      INSERT INTO applications (id, property_id, unit_id, first_name, last_name, email, phone, employment_status, monthly_income, move_in_date, references_text, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `, [id, propertyId, unitId, firstName, lastName, email, phone || "", employmentStatus || "", monthlyIncome || 0, moveInDate || now, references || "", now, now]);
    const created = await queryOne(c.env.DB, "SELECT * FROM applications WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow7(created) }, 201);
  } catch (error3) {
    return c.json({ error: "Failed to create application", details: error3.message }, 500);
  }
});
applications.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const user = c.get("user");
    const existing = await queryOne(c.env.DB, "SELECT id FROM applications WHERE id = ?", [id]);
    if (!existing) return c.json({ error: "Application not found" }, 404);
    const fields = [];
    const params = [];
    if (body.status) {
      fields.push("status = ?");
      params.push(body.status);
    }
    if (body.score !== void 0) {
      fields.push("score = ?");
      params.push(body.score);
    }
    if (body.reviewNotes) {
      fields.push("review_notes = ?");
      params.push(body.reviewNotes);
    }
    if (body.status) {
      fields.push("reviewed_by = ?");
      params.push(user.userId);
    }
    if (fields.length === 0) return c.json({ error: "No fields to update" }, 400);
    fields.push("updated_at = ?");
    params.push(nowISO());
    params.push(id);
    await execute(c.env.DB, `UPDATE applications SET ${fields.join(", ")} WHERE id = ?`, params);
    const updated = await queryOne(c.env.DB, "SELECT * FROM applications WHERE id = ?", [id]);
    return c.json({ success: true, data: mapRow7(updated) });
  } catch (error3) {
    return c.json({ error: "Failed to update application", details: error3.message }, 500);
  }
});
function mapRow7(row) {
  return {
    id: row.id,
    propertyId: row.property_id,
    unitId: row.unit_id,
    applicantId: row.applicant_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    employmentStatus: row.employment_status,
    employerName: row.employer_name,
    monthlyIncome: row.monthly_income,
    moveInDate: row.move_in_date,
    references: row.references_text,
    kycDocuments: parseJSON(row.kyc_documents, []),
    status: row.status,
    score: row.score,
    reviewedBy: row.reviewed_by,
    reviewNotes: row.review_notes,
    propertyName: row.property_name,
    unitNumber: row.unit_number,
    reviewerFirstName: row.reviewer_first,
    reviewerLastName: row.reviewer_last,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
__name(mapRow7, "mapRow");
var applications_default = applications;

// worker/routes/uploads.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_auth();
var uploads = new Hono2();
uploads.post("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.parseBody();
    const file = body["file"];
    const category = body["category"] || "other";
    const propertyId = body["propertyId"];
    const unitId = body["unitId"];
    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf", "text/csv"];
    if (!allowedTypes.includes(file.type) && !file.type.startsWith("image/")) {
    }
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: "File too large (max 10MB)" }, 400);
    }
    const id = generateId();
    const ext = file.name.split(".").pop() || "bin";
    const storageKey = `${category}/${user.userId}/${id}.${ext}`;
    try {
      await c.env.STORAGE.put(storageKey, await file.arrayBuffer(), {
        httpMetadata: {
          contentType: file.type
        },
        customMetadata: {
          originalName: file.name,
          uploadedBy: user.userId,
          category
        }
      });
    } catch (r2Error) {
      console.error("R2 upload error:", r2Error);
      if (!c.env.STORAGE) {
        console.warn("R2 not configured, skipping actual upload");
      } else {
        throw r2Error;
      }
    }
    const url = `/api/uploads/${id}`;
    const now = nowISO();
    await execute(c.env.DB, `
      INSERT INTO documents (id, owner_id, property_id, unit_id, file_name, file_type, file_size, storage_key, url, category, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, user.userId, propertyId || null, unitId || null, file.name, file.type, file.size, storageKey, url, category, now]);
    return c.json({
      success: true,
      data: {
        id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        storageKey,
        url,
        category
      }
    }, 201);
  } catch (error3) {
    console.error("Upload error:", error3);
    return c.json({ error: "Failed to upload file", details: error3.message }, 500);
  }
});
uploads.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const doc = await c.env.DB.prepare("SELECT * FROM documents WHERE id = ?").bind(id).first();
    if (!doc) {
      return c.json({ error: "File not found" }, 404);
    }
    if (c.env.STORAGE) {
      const object = await c.env.STORAGE.get(doc.storage_key);
      if (object) {
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.set("Cache-Control", "public, max-age=31536000");
        return new Response(object.body, { headers });
      }
    }
    return c.json({ error: "File not found in storage" }, 404);
  } catch (error3) {
    return c.json({ error: "Failed to fetch file", details: error3.message }, 500);
  }
});
uploads.get("/", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const category = c.req.query("category");
    const propertyId = c.req.query("propertyId");
    let sql = "SELECT * FROM documents WHERE owner_id = ?";
    const params = [user.userId];
    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }
    if (propertyId) {
      sql += " AND property_id = ?";
      params.push(propertyId);
    }
    sql += " ORDER BY created_at DESC LIMIT 50";
    const docs = await c.env.DB.prepare(sql).bind(...params).all();
    return c.json({ success: true, data: docs.results });
  } catch (error3) {
    return c.json({ error: "Failed to fetch documents", details: error3.message }, 500);
  }
});
var uploads_default = uploads;

// worker/index.ts
var app = new Hono2();
app.use("*", logger());
app.use("*", cors({
  origin: /* @__PURE__ */ __name((origin, c) => {
    const allowed = [
      "http://localhost:8080",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://agently-homeflow.vercel.app",
      c.env.FRONTEND_URL
    ].filter(Boolean);
    if (c.env.ENVIRONMENT !== "production") {
      return origin || "*";
    }
    if (!origin) return "*";
    if (allowed.includes(origin)) return origin;
    if (origin.includes("vercel.app") || origin.includes("e2b.app") || origin.includes("localhost")) {
      return origin;
    }
    return allowed[0] || "*";
  }, "origin"),
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposeHeaders: ["Content-Length"],
  credentials: true,
  maxAge: 86400
}));
app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Agently Homeflow API - Production Ready",
    version: "2.0.0",
    environment: c.env.ENVIRONMENT || "development",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    endpoints: {
      auth: "/api/auth",
      properties: "/api/properties",
      tenants: "/api/tenants",
      payments: "/api/payments",
      maintenance: "/api/maintenance",
      expenses: "/api/expenses",
      analytics: "/api/analytics",
      listings: "/api/listings",
      leads: "/api/leads",
      applications: "/api/applications",
      uploads: "/api/uploads",
      health: "/api/health"
    }
  });
});
app.get("/api", (c) => {
  return c.json({
    success: true,
    message: "Agently Homeflow API v2.0",
    docs: "/api/docs - coming soon",
    health: "/api/health"
  });
});
app.get("/api/health", async (c) => {
  let dbStatus = "unknown";
  try {
    if (c.env.DB) {
      await c.env.DB.prepare("SELECT 1").first();
      dbStatus = "connected";
    } else {
      dbStatus = "not_configured";
    }
  } catch (e) {
    dbStatus = `error: ${e.message}`;
  }
  return c.json({
    success: true,
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    services: {
      database: dbStatus,
      storage: c.env.STORAGE ? "configured" : "not_configured",
      cache: c.env.CACHE ? "configured" : "not_configured"
    },
    version: "2.0.0"
  });
});
app.route("/api/auth", auth_default);
app.route("/api/properties", properties_default);
app.route("/api/tenants", tenants_default);
app.route("/api/payments", payments_default);
app.route("/api/maintenance", maintenance_default);
app.route("/api/expenses", expenses_default);
app.route("/api/analytics", analytics_default);
app.route("/api/listings", listings_default);
app.route("/api/leads", leads_default);
app.route("/api/applications", applications_default);
app.route("/api/uploads", uploads_default);
app.post("/api/seed", async (c) => {
  try {
    const secret = c.req.header("X-Seed-Secret");
    if (c.env.ENVIRONMENT === "production" && secret !== c.env.JWT_SECRET) {
      return c.json({ error: "Forbidden - Seed not allowed in production without secret" }, 403);
    }
    const { hashPassword: hashPassword2, generateId: generateId2 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const demoUsers = [
      { id: "demo-owner", email: "owner@agently.com", password: "owner123", firstName: "John", lastName: "Landlord", role: "owner", phone: "+234-801-234-5678" },
      { id: "demo-manager", email: "manager@agently.com", password: "manager123", firstName: "Sarah", lastName: "Manager", role: "manager", phone: "+234-802-234-5678" },
      { id: "demo-accountant", email: "accountant@agently.com", password: "accountant123", firstName: "Michael", lastName: "Finance", role: "accountant", phone: "+234-803-234-5678" },
      { id: "demo-tenant", email: "tenant@agently.com", password: "tenant123", firstName: "Alice", lastName: "Tenant", role: "tenant", phone: "+234-804-234-5678" },
      { id: "demo-realtor", email: "realtor@agently.com", password: "realtor123", firstName: "David", lastName: "Agent", role: "realtor", phone: "+234-805-234-5678" },
      { id: "demo-contractor", email: "contractor@agently.com", password: "contractor123", firstName: "James", lastName: "Handyman", role: "contractor", phone: "+234-806-234-5678" },
      { id: "demo-admin", email: "admin@agently.com", password: "admin123", firstName: "Admin", lastName: "User", role: "admin", phone: "+234-807-234-5678" }
    ];
    let createdUsers = 0;
    for (const u of demoUsers) {
      const existing = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(u.email).first();
      if (!existing) {
        const hash2 = await hashPassword2(u.password);
        await c.env.DB.prepare(`
          INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, kyc_status, email_verified, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'verified', 1, ?, ?)
        `).bind(u.id, u.email, hash2, u.firstName, u.lastName, u.phone, u.role, now, now).run();
        createdUsers++;
      }
    }
    const propertiesCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM properties").first();
    let createdProperties = 0;
    if (!propertiesCount || propertiesCount.count === 0) {
      const demoProperties = [
        { name: "Lekki Gardens Estate", address: "15 Admiralty Way, Lekki Phase 1", city: "Lagos", type: "apartment", units: 12, rent: 25e5 },
        { name: "Victoria Island Towers", address: "42 Ahmadu Bello Way, VI", city: "Lagos", type: "apartment", units: 8, rent: 5e6 },
        { name: "Ikoyi Heights", address: "10 Bourdillon Road, Ikoyi", city: "Lagos", type: "house", units: 1, rent: 8e6 },
        { name: "Yaba Business Complex", address: "25 Herbert Macaulay, Yaba", city: "Lagos", type: "commercial", units: 6, rent: 15e5 }
      ];
      for (const prop of demoProperties) {
        const propId = generateId2();
        await c.env.DB.prepare(`
          INSERT INTO properties (id, owner_id, name, address, city, state, type, total_units, market_value, amenities, images, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
        `).bind(
          propId,
          "demo-owner",
          prop.name,
          prop.address,
          prop.city,
          "Lagos",
          prop.type,
          prop.units,
          prop.rent * 12 * 5,
          JSON.stringify(["Security", "Parking", "Water", "Electricity"]),
          JSON.stringify([]),
          now,
          now
        ).run();
        for (let i = 1; i <= prop.units; i++) {
          const unitId = generateId2();
          await c.env.DB.prepare(`
            INSERT INTO units (id, property_id, unit_number, rent, bedrooms, bathrooms, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'vacant', ?, ?)
          `).bind(unitId, propId, `${prop.type === "house" ? "Main" : `Unit ${i}`}`, prop.rent, prop.type === "house" ? 4 : 2, prop.type === "house" ? 3 : 2, now, now).run();
        }
        createdProperties++;
      }
    }
    return c.json({
      success: true,
      message: "Database seeded",
      data: {
        usersCreated: createdUsers,
        propertiesCreated: createdProperties
      }
    });
  } catch (error3) {
    console.error("Seed error:", error3);
    return c.json({ error: "Seed failed", details: error3.message }, 500);
  }
});
app.notFound((c) => {
  return c.json({ error: "Not Found", path: c.req.path }, 404);
});
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal Server Error", details: err.message }, 500);
});
var worker_default = app;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    const body = JSON.stringify(error3);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-ei1VNM/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-ei1VNM/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map

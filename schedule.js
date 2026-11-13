var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
    if (a == Array.prototype || a == Object.prototype)
        return a;
    a[b] = c.value;
    return a
}
;
$jscomp.getGlobal = function(a) {
    a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
    for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        if (c && c.Math == Math)
            return c
    }
    throw Error("Cannot find global object");
}
;
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function(a, b, c) {
    if (!c || null != a) {
        c = $jscomp.propertyToPolyfillSymbol[b];
        if (null == c)
            return a[b];
        c = a[c];
        return void 0 !== c ? c : a[b]
    }
};
$jscomp.polyfill = function(a, b, c, d) {
    b && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(a, b, c, d) : $jscomp.polyfillUnisolated(a, b, c, d))
}
;
$jscomp.polyfillUnisolated = function(a, b, c, d) {
    c = $jscomp.global;
    a = a.split(".");
    for (d = 0; d < a.length - 1; d++) {
        var e = a[d];
        if (!(e in c))
            return;
        c = c[e]
    }
    a = a[a.length - 1];
    d = c[a];
    b = b(d);
    b != d && null != b && $jscomp.defineProperty(c, a, {
        configurable: !0,
        writable: !0,
        value: b
    })
}
;
$jscomp.polyfillIsolated = function(a, b, c, d) {
    var e = a.split(".");
    a = 1 === e.length;
    d = e[0];
    d = !a && d in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
    for (var f = 0; f < e.length - 1; f++) {
        var g = e[f];
        if (!(g in d))
            return;
        d = d[g]
    }
    e = e[e.length - 1];
    c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? d[e] : null;
    b = b(c);
    null != b && (a ? $jscomp.defineProperty($jscomp.polyfills, e, {
        configurable: !0,
        writable: !0,
        value: b
    }) : b !== c && (void 0 === $jscomp.propertyToPolyfillSymbol[e] && (c = 1E9 * Math.random() >>> 0,
    $jscomp.propertyToPolyfillSymbol[e] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(e) : $jscomp.POLYFILL_PREFIX + c + "$" + e),
    $jscomp.defineProperty(d, $jscomp.propertyToPolyfillSymbol[e], {
        configurable: !0,
        writable: !0,
        value: b
    })))
}
;
$jscomp.underscoreProtoCanBeSet = function() {
    var a = {
        a: !0
    }
      , b = {};
    try {
        return b.__proto__ = a,
        b.a
    } catch (c) {}
    return !1
}
;
$jscomp.setPrototypeOf = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(a, b) {
    a.__proto__ = b;
    if (a.__proto__ !== b)
        throw new TypeError(a + " is not extensible");
    return a
}
: null;
$jscomp.arrayIteratorImpl = function(a) {
    var b = 0;
    return function() {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        }
    }
}
;
$jscomp.arrayIterator = function(a) {
    return {
        next: $jscomp.arrayIteratorImpl(a)
    }
}
;
$jscomp.makeIterator = function(a) {
    var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    if (b)
        return b.call(a);
    if ("number" == typeof a.length)
        return $jscomp.arrayIterator(a);
    throw Error(String(a) + " is not an iterable or ArrayLike");
}
;
$jscomp.generator = {};
$jscomp.generator.ensureIteratorResultIsObject_ = function(a) {
    if (!(a instanceof Object))
        throw new TypeError("Iterator result " + a + " is not an object");
}
;
$jscomp.generator.Context = function() {
    this.isRunning_ = !1;
    this.yieldAllIterator_ = null;
    this.yieldResult = void 0;
    this.nextAddress = 1;
    this.finallyAddress_ = this.catchAddress_ = 0;
    this.finallyContexts_ = this.abruptCompletion_ = null
}
;
$jscomp.generator.Context.prototype.start_ = function() {
    if (this.isRunning_)
        throw new TypeError("Generator is already running");
    this.isRunning_ = !0
}
;
$jscomp.generator.Context.prototype.stop_ = function() {
    this.isRunning_ = !1
}
;
$jscomp.generator.Context.prototype.jumpToErrorHandler_ = function() {
    this.nextAddress = this.catchAddress_ || this.finallyAddress_
}
;
$jscomp.generator.Context.prototype.next_ = function(a) {
    this.yieldResult = a
}
;
$jscomp.generator.Context.prototype.throw_ = function(a) {
    this.abruptCompletion_ = {
        exception: a,
        isException: !0
    };
    this.jumpToErrorHandler_()
}
;
$jscomp.generator.Context.prototype.return = function(a) {
    this.abruptCompletion_ = {
        return: a
    };
    this.nextAddress = this.finallyAddress_
}
;
$jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function(a) {
    this.abruptCompletion_ = {
        jumpTo: a
    };
    this.nextAddress = this.finallyAddress_
}
;
$jscomp.generator.Context.prototype.yield = function(a, b) {
    this.nextAddress = b;
    return {
        value: a
    }
}
;
$jscomp.generator.Context.prototype.yieldAll = function(a, b) {
    a = $jscomp.makeIterator(a);
    var c = a.next();
    $jscomp.generator.ensureIteratorResultIsObject_(c);
    if (c.done)
        this.yieldResult = c.value,
        this.nextAddress = b;
    else
        return this.yieldAllIterator_ = a,
        this.yield(c.value, b)
}
;
$jscomp.generator.Context.prototype.jumpTo = function(a) {
    this.nextAddress = a
}
;
$jscomp.generator.Context.prototype.jumpToEnd = function() {
    this.nextAddress = 0
}
;
$jscomp.generator.Context.prototype.setCatchFinallyBlocks = function(a, b) {
    this.catchAddress_ = a;
    void 0 != b && (this.finallyAddress_ = b)
}
;
$jscomp.generator.Context.prototype.setFinallyBlock = function(a) {
    this.catchAddress_ = 0;
    this.finallyAddress_ = a || 0
}
;
$jscomp.generator.Context.prototype.leaveTryBlock = function(a, b) {
    this.nextAddress = a;
    this.catchAddress_ = b || 0
}
;
$jscomp.generator.Context.prototype.enterCatchBlock = function(a) {
    this.catchAddress_ = a || 0;
    a = this.abruptCompletion_.exception;
    this.abruptCompletion_ = null;
    return a
}
;
$jscomp.generator.Context.prototype.enterFinallyBlock = function(a, b, c) {
    c ? this.finallyContexts_[c] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
    this.catchAddress_ = a || 0;
    this.finallyAddress_ = b || 0
}
;
$jscomp.generator.Context.prototype.leaveFinallyBlock = function(a, b) {
    b = this.finallyContexts_.splice(b || 0)[0];
    if (b = this.abruptCompletion_ = this.abruptCompletion_ || b) {
        if (b.isException)
            return this.jumpToErrorHandler_();
        void 0 != b.jumpTo && this.finallyAddress_ < b.jumpTo ? (this.nextAddress = b.jumpTo,
        this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_
    } else
        this.nextAddress = a
}
;
$jscomp.generator.Context.prototype.forIn = function(a) {
    return new $jscomp.generator.Context.PropertyIterator(a)
}
;
$jscomp.generator.Context.PropertyIterator = function(a) {
    this.object_ = a;
    this.properties_ = [];
    for (var b in a)
        this.properties_.push(b);
    this.properties_.reverse()
}
;
$jscomp.generator.Context.PropertyIterator.prototype.getNext = function() {
    for (; 0 < this.properties_.length; ) {
        var a = this.properties_.pop();
        if (a in this.object_)
            return a
    }
    return null
}
;
$jscomp.generator.Engine_ = function(a) {
    this.context_ = new $jscomp.generator.Context;
    this.program_ = a
}
;
$jscomp.generator.Engine_.prototype.next_ = function(a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_)
        return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
    this.context_.next_(a);
    return this.nextStep_()
}
;
$jscomp.generator.Engine_.prototype.return_ = function(a) {
    this.context_.start_();
    var b = this.context_.yieldAllIterator_;
    if (b)
        return this.yieldAllStep_("return" in b ? b["return"] : function(c) {
            return {
                value: c,
                done: !0
            }
        }
        , a, this.context_.return);
    this.context_.return(a);
    return this.nextStep_()
}
;
$jscomp.generator.Engine_.prototype.throw_ = function(a) {
    this.context_.start_();
    if (this.context_.yieldAllIterator_)
        return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
    this.context_.throw_(a);
    return this.nextStep_()
}
;
$jscomp.generator.Engine_.prototype.yieldAllStep_ = function(a, b, c) {
    try {
        var d = a.call(this.context_.yieldAllIterator_, b);
        $jscomp.generator.ensureIteratorResultIsObject_(d);
        if (!d.done)
            return this.context_.stop_(),
            d;
        var e = d.value
    } catch (f) {
        return this.context_.yieldAllIterator_ = null,
        this.context_.throw_(f),
        this.nextStep_()
    }
    this.context_.yieldAllIterator_ = null;
    c.call(this.context_, e);
    return this.nextStep_()
}
;
$jscomp.generator.Engine_.prototype.nextStep_ = function() {
    for (; this.context_.nextAddress; )
        try {
            var a = this.program_(this.context_);
            if (a)
                return this.context_.stop_(),
                {
                    value: a.value,
                    done: !1
                }
        } catch (b) {
            this.context_.yieldResult = void 0,
            this.context_.throw_(b)
        }
    this.context_.stop_();
    if (this.context_.abruptCompletion_) {
        a = this.context_.abruptCompletion_;
        this.context_.abruptCompletion_ = null;
        if (a.isException)
            throw a.exception;
        return {
            value: a.return,
            done: !0
        }
    }
    return {
        value: void 0,
        done: !0
    }
}
;
$jscomp.generator.Generator_ = function(a) {
    this.next = function(b) {
        return a.next_(b)
    }
    ;
    this.throw = function(b) {
        return a.throw_(b)
    }
    ;
    this.return = function(b) {
        return a.return_(b)
    }
    ;
    this[Symbol.iterator] = function() {
        return this
    }
}
;
$jscomp.generator.createGenerator = function(a, b) {
    b = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b));
    $jscomp.setPrototypeOf && a.prototype && $jscomp.setPrototypeOf(b, a.prototype);
    return b
}
;
$jscomp.asyncExecutePromiseGenerator = function(a) {
    function b(d) {
        return a.next(d)
    }
    function c(d) {
        return a.throw(d)
    }
    return new Promise(function(d, e) {
        function f(g) {
            g.done ? d(g.value) : Promise.resolve(g.value).then(b, c).then(f, e)
        }
        f(a.next())
    }
    )
}
;
$jscomp.asyncExecutePromiseGeneratorFunction = function(a) {
    return $jscomp.asyncExecutePromiseGenerator(a())
}
;
$jscomp.asyncExecutePromiseGeneratorProgram = function(a) {
    return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(a)))
}
;
var teachers, classes, rooms;
function InitGeneralTab() {
    ScrollPosY = ScrollPosX = 0;
    btns.classes.v = !1;
    btns.teachers.v = !1;
    btns.classrooms.v = !1;
    labels.school.color = TITLE_FONT_COLOR;
    labels.city.color = TITLE_FONT_COLOR;
    labels.school.v = !0;
    labels.city.v = !0;
    __id("go_home").style.color = "#FFFFFF";
    btns.NL.v = !1;
    btns.NLs.v = !0;
    labels.title.v = !0;
    labels.period.v = !1;
    btns.changes.v = !1;
    labels.change_ln1.v = !1;
    labels.change_ln2.v = !1;
    btns.arrow_left.v = !1;
    btns.arrow_right.v = !1;
    labels.prev_week_ln1.v = !1;
    labels.prev_week_ln2.v = !1;
    labels.next_week_ln1.v = !1;
    labels.next_week_ln2.v = !1;
    labels.prev_month_ln1.v = !1;
    labels.prev_month_ln2.v = !1;
    labels.next_month_ln1.v = !1;
    labels.next_month_ln2.v = !1;
    labels.prev_day_ln2.v = !1;
    labels.next_day_ln2.v = !1;
    labels.exp_lab.v = !1;
    labels.exp_dt.v = !1;
    window.NIKA.SHOW_EXPORT_DT && (labels.exp_lab.v = !0,
    labels.exp_dt.v = !0)
}
function ResizeGeneralTab(a, b) {
    var c = Canvas.width - SchoolLabelWidth - 50;
    c < Canvas.width / 2 + 180 / a + 20 && (c = Canvas.width / 2 + 180 / a + 20);
    TOP_HEIGHT = Math.round(140 + 55 * (1 - a));
    labels.school.x = c;
    labels.school.y = .3 * TOP_HEIGHT;
    labels.city.x = c;
    labels.city.y = .5 * TOP_HEIGHT;
    __id("go_home").style.left = c.toString() + "px";
    __id("go_home").style.top = Math.round(.7 * TOP_HEIGHT) + "px";
    btns.NLs.x = 140;
    btns.NLs.y = Canvas.height - BOTTOM_HEIGHT + 10;
    __id("copyright").style.left = (btns.NLs.x + 64).toString() + "px";
    __id("copyright").style.top = (btns.NLs.y + 24).toString() + "px";
    labels.title.x = Canvas.width / 2;
    "RUS" == LangId ? (labels.title.y = TOP_HEIGHT + 78,
    labels.period.y = TOP_HEIGHT + 105) : "ENG" == LangId && (labels.title.y = TOP_HEIGHT + 75,
    labels.period.y = TOP_HEIGHT + 110);
    labels.exp_lab.v && (labels.exp_lab.x = Canvas.width / 2,
    labels.exp_lab.y = Canvas.height - 50,
    labels.exp_dt.x = Canvas.width / 2,
    labels.exp_dt.y = Canvas.height - 50 + 30 / a);
    b && (ScrollBox.y = TOP_HEIGHT + 135,
    ScrollBox.w = Math.round(Canvas.width - 450 + 307 * (a - 1)),
    ScrollBox.w > CL_MAX_WIDTH && (ScrollBox.w = CL_MAX_WIDTH),
    ScrollBox.h = Math.round(CalendarActualHeight * ScrollBox.w / CL_MAX_WIDTH),
    ScrollBox.h > Canvas.height - ScrollBox.y - BOTTOM_HEIGHT - 30 && (ScrollBox.h = Canvas.height - ScrollBox.y - BOTTOM_HEIGHT - 30,
    ScrollBox.w = Math.round(CL_MAX_WIDTH * ScrollBox.h / CalendarActualHeight)),
    ScrollBox.x = Canvas.width / 2 - ScrollBox.w / 2,
    ScrollTotalSizeX = ScrollBox.w,
    ScrollTotalSizeY = ScrollBox.h)
}
function ResizeScrollBtn(a) {
    btns.LeftScrll.x = ScrollBox.x - btns.LeftScrll.w - 15;
    btns.RightScrll.x = ScrollBox.x + ScrollBox.w + 15;
    a ? (btns.LeftScrll.y = ScrollBox.y + ScrollBox.h - 3 * btns.LeftScrll.h,
    btns.RightScrll.y = ScrollBox.y + ScrollBox.h - 3 * btns.RightScrll.h) : (btns.LeftScrll.y = ScrollBox.y + ScrollBox.h / 2 - btns.LeftScrll.h / 2,
    btns.RightScrll.y = ScrollBox.y + ScrollBox.h / 2 - btns.RightScrll.h / 2);
    btns.UpScrll.x = ScrollBox.x + ScrollBox.w + 10;
    btns.UpScrll.y = ScrollBox.y;
    btns.DownScrll.x = ScrollBox.x + ScrollBox.w + 10;
    btns.DownScrll.y = ScrollBox.y + ScrollBox.h - btns.DownScrll.h
}
function DrawBackGeneralTab(a, b) {
    a.fillStyle = "#FFFFFF";
    a.fillRect(0, 0, Canvas.width, Canvas.height);
    for (var c = 0; c < Canvas.width; ) {
        for (var d = TOP_HEIGHT; d < Canvas.height - BOTTOM_HEIGHT; )
            a.drawImage(BackgroundGrid, c, d),
            d += BackgroundGrid.height;
        c += BackgroundGrid.width
    }
    a.fillStyle = BASE_COLOR;
    a.fillRect(0, 0, Canvas.width, TOP_HEIGHT);
    a.fillRect(0, Canvas.height - BOTTOM_HEIGHT, Canvas.width, Canvas.height);
    a.drawImage(TopLineImg, 0, 0, TopLineImg.width, TopLineImg.height, 0, TOP_HEIGHT, Canvas.width, 23 / b);
    a.drawImage(BottomLineImg, 0, 0, BottomLineImg.width, BottomLineImg.height, 0, Canvas.height - BOTTOM_HEIGHT - 16, Canvas.width, 23)
}
function GetWeekTimetableCaption() {
    var a = "";
    if ("RUS" == LangId)
        switch (CurrWeekNum) {
        case 0:
            a = String(NIKA.SCHEDULE_STR.toLowerCase() + " " + NIKA.FOR_WEEK);
            break;
        case 1:
            a = String(NIKA.SCHEDULE_STR.toLowerCase() + " " + NIKA.FOR_1WEEK);
            break;
        case 2:
            a = String(NIKA.SCHEDULE_STR.toLowerCase() + " " + NIKA.FOR_2WEEK)
        }
    else
        a = String(NIKA.FOR_WEEK + " " + NIKA.SCHEDULE_STR.toLowerCase()),
        1 == CurrWeekNum && (a += " " + NIKA.FOR_1WEEK),
        2 == CurrWeekNum && (a += " " + NIKA.FOR_2WEEK);
    return a = a.charAt(0).toUpperCase() + a.slice(1)
}
function getLessonTimeForDay(a, b) {
    var c = NIKA.LESSON_TIMES_BY_DAY || null
      , d = null
      , e = null;
    c && void 0 !== a && null !== a && ((d = c[a]) || "string" == typeof a || (d = c[String(a)]));
    d && ((e = d[b]) || "string" == typeof b || (e = d[String(b)]));
    !e && NIKA.LESSON_TIMES && ((e = NIKA.LESSON_TIMES[b]) || "string" == typeof b || (e = NIKA.LESSON_TIMES[String(b)]));
    return !e || 2 > e.length ? ["", ""] : e
}
function DrawTitleLesson(a) {
    var b = 140 / TOP_HEIGHT;
    a.save();
    a.setTransform(1 / b, 0, 0, 1 / b, 100, 20);
    a.font = "normal 18px Verdana, sans-serif";
    a.textAlign = "center";
    a.textBaseline = "top";
    a.shadowOffsetX = 0;
    a.shadowOffsetY = 0;
    a.fillStyle = TITLE_FONT_COLOR;
    ctLine1 && a.fillText(ctLine1, 64, 0, 80);
    ctLine2 && a.fillText(ctLine2, 64, 20, 80);
    a.font = "bold 34px Arial, sans-serif";
    ctMinutNum && a.fillText(ctMinutNum, 64, 46, 80);
    a.font = "normal 18px Verdana, sans-serif";
    ctMinutes && a.fillText(ctMinutes, 64, 78, 80);
    if (ctLine1 || ctLine2)
        a.strokeStyle = TITLE_FONT_COLOR,
        a.lineWidth = 3,
        a.strokeRect(20, -5, 92, 110);
    a.font = "bold 48px Arial, sans-serif";
    ctTime && a.fillText(ctTime, 192, 0);
    a.font = "bold 48px Times, sans-serif";
    ctTimeColon && ctTime && a.fillText(ctTimeColon, 192, -4);
    a.font = "normal 20px Verdana, sans-serif";
    ctDate && a.fillText(ctDate, 192, 50);
    ctYear && a.fillText(ctYear, 192, 74);
    a.restore()
}
function DrawTitleTeacher(a, b) {
    a.save();
    a.setTransform(1 / b, 0, 0, 1 / b, Canvas.width / 2, TOP_HEIGHT / 2);
    a.fillStyle = TITLE_FONT_COLOR;
    a.fillRect(-180, -55, 360, 110);
    a.font = "bold 20px Verdana, sans-serif";
    a.textAlign = "center";
    a.textBaseline = "top";
    a.fillStyle = BTN_TEXT_COLOR;
    var c = b = NIKA.TEACHERS[CurrTeacher]
      , d = ""
      , e = b.indexOf(" ");
    -1 < e && (d = b.substr(e + 1, b.length),
    7 >= d.length ? d = "" : c = b.substr(0, e));
    d ? (a.fillText(c, 0, -32),
    a.fillText(d, 0, -8),
    b = 20) : (a.fillText(b, 0, -16),
    b = 14);
    CurrTeachSubject && (a.font = "bold 16px Verdana, sans-serif",
    a.textAlign = "center",
    a.fillStyle = BASE_COLOR,
    a.fillText(CurrTeachSubject, 0, b));
    a.fillStyle = YELLOW_LIGHT_COLOR;
    a.save();
    a.translate(-172, -46);
    a.rotate(-.785);
    a.fillRect(-20, -6, 40, 12);
    a.restore();
    a.translate(172, -46);
    a.rotate(.785);
    a.fillRect(-20, -6, 40, 12);
    a.restore()
}
function DrawTitleClass(a, b) {
    a.save();
    a.setTransform(1 / b, 0, 0, 1 / b, Canvas.width / 2, TOP_HEIGHT / 2);
    a.fillStyle = TITLE_FONT_COLOR;
    a.fillRect(-90, -55, 180, 110);
    a.font = "bold 28px Verdana, sans-serif";
    a.textAlign = "center";
    a.textBaseline = "top";
    a.fillStyle = BTN_TEXT_COLOR;
    a.fillText(NIKA.CLASSES[CurrClass], 0, -30);
    a.fillStyle = SCHED_FONT_COLOR;
    a.font = "normal 18px Verdana, sans-serif";
    b = NIKA.CLASS_STR.toLowerCase();
    ":" == b.charAt(b.length - 1) && (b = b.substr(0, b.length - 1));
    a.fillText(b, 0, 5);
    CurrSecondShiftStr && (a.fillStyle = SECOND_SHIFT_COLOR,
    a.fillText(CurrSecondShiftStr, 0, 26));
    a.fillStyle = YELLOW_LIGHT_COLOR;
    a.save();
    a.translate(-82, -46);
    a.rotate(-.785);
    a.fillRect(-20, -6, 40, 12);
    a.restore();
    a.translate(82, -46);
    a.rotate(.785);
    a.fillRect(-20, -6, 40, 12);
    a.restore()
}
function DrawTitleRoom(a, b) {
    a.save();
    a.setTransform(1 / b, 0, 0, 1 / b, Canvas.width / 2, TOP_HEIGHT / 2);
    a.fillStyle = TITLE_FONT_COLOR;
    a.fillRect(-180, -55, 360, 110);
    "any_room" == CurrRoom ? (a.font = "bold 20px Verdana, sans-serif",
    a.textAlign = "center",
    a.textBaseline = "top",
    a.fillStyle = BTN_TEXT_COLOR,
    a.fillText(NIKA.ROOM_STR, 0, -30)) : (a.font = "bold 24px Verdana, sans-serif",
    a.textAlign = "center",
    a.textBaseline = "top",
    a.fillStyle = BTN_TEXT_COLOR,
    b = NIKA.ROOMS[CurrRoom],
    a.fillText(b, 0, -30),
    a.fillStyle = SCHED_FONT_COLOR,
    a.font = "normal 22px Verdana, sans-serif",
    b = NIKA.ROOM_STR.toLowerCase(),
    a.fillText(b, 0, 5));
    a.fillStyle = YELLOW_LIGHT_COLOR;
    a.save();
    a.translate(-172, -46);
    a.rotate(-.785);
    a.fillRect(-20, -6, 40, 12);
    a.restore();
    a.translate(172, -46);
    a.rotate(.785);
    a.fillRect(-20, -6, 40, 12);
    a.restore()
}
window.tabs = {
    home: {
        BackTab: "",
        init: function() {
            InitGeneralTab();
            ScrollBox.x = 0;
            ScrollBox.y = 0;
            ScrollBox.w = 0;
            RoomScrollPosY = TeachScrollPosY = ScrollPosY = ScrollPosX = ScrollBox.h = 0;
            ScrollDelta = {
                x: 0,
                y: 0
            };
            CurrScrollStep = {
                x: 0,
                y: 0
            };
            ScrollTotalSizeY = ScrollTotalSizeX = 0;
            ScrollStepY = ScrollStepX = 1;
            ScrollTranspEdges = 0;
            labels.title.v = !1;
            btns.classes.v = !0;
            btns.teachers.v = NIKA.SHOW_TEACHERS;
            btns.classrooms.v = NIKA.SHOW_CLASSROOMS && NIKA.USEROOMS;
            labels.school.color = "#FFFFFF";
            labels.city.color = "#FFFFFF";
            labels.school.v = !0;
            labels.city.v = !0;
            btns.NL.v = !0;
            btns.NLs.v = !1;
            labels.exp_lab.v = !1;
            labels.exp_dt.v = !1;
            window.NIKA.SHOW_EXPORT_DT && (labels.exp_lab.v = !0,
            labels.exp_dt.v = !0);
            __id("go_home").style.color = "#00FFFF"
        },
        drawback: function(a, b) {
            var c = Canvas.width
              , d = Canvas.height;
            d > BackgroundImg1.height && (c *= BackgroundImg1.height / Canvas.height,
            c > BackgroundImg1.width && (c = BackgroundImg1.width),
            d = BackgroundImg1.height);
            var e = BackgroundImg1.width - Canvas.width;
            0 > e && (e = 0);
            260 < e && (e = 260);
            a.drawImage(BackgroundImg1, e, BackgroundImg1.height - d, c, d, 0, 0, Canvas.width, Canvas.height);
            a.save();
            a.setTransform(1 / b, 0, 0, 1 / b, 100 / b, 30);
            a.rotate(-.04);
            a.drawImage(CalendarImg1, 0, 0, CalendarImg1.width, CalendarImg1.height);
            a.font = "normal 18px Verdana , sans-serif";
            a.textAlign = "center";
            a.textBaseline = "top";
            a.shadowOffsetX = 0;
            a.shadowOffsetY = 0;
            a.fillStyle = "#FFFFFF";
            ctLine1 && a.fillText(ctLine1, 64, 72, 80);
            ctLine2 && a.fillText(ctLine2, 64, 92, 80);
            a.font = "bold 34px Arial, sans-serif";
            ctMinutNum && a.fillText(ctMinutNum, 64, 118, 80);
            a.font = "normal 18px Verdana, sans-serif";
            ctMinutes && a.fillText(ctMinutes, 64, 150, 80);
            a.font = "bold 48px Arial, sans-serif";
            a.fillStyle = "#000";
            ctTime && a.fillText(ctTime, 192, 72);
            a.font = "bold 48px Times, sans-serif";
            ctTimeColon && ctTime && a.fillText(ctTimeColon, 192, 68);
            a.font = "normal 22px Verdana, sans-serif";
            a.fillStyle = "#3B3E3F";
            ctDate && a.fillText(ctDate, 192, 126);
            ctYear && a.fillText(ctYear, 192, 154);
            a.restore();
            "" == HomeScheduleTitle ? a.drawImage(TitleImg1, Canvas.width / 2 - TitleImg1.width / b / 2, 380 / b, TitleImg1.width / b, TitleImg1.height / b) : (a.textBaseline = "top",
            a.textAlign = "center",
            a.font = "bold italic 95px RomanaScript, AlexBrush, sans-serif",
            a.fillStyle = "#FAFAF4",
            a.fillText(HomeScheduleTitle, Canvas.width / 2, 380 / b + .28 * 130 / b, 985 / b))
        },
        resize: function(a) {
            var b = Canvas.width - SchoolLabelWidth - 50;
            labels.school.x = b;
            labels.school.y = 50;
            labels.city.x = b;
            labels.city.y = 76;
            __id("go_home").style.left = b.toString() + "px";
            __id("go_home").style.top = "116px";
            btns.NL.x = 140;
            btns.NL.y = Canvas.height - 127;
            __id("copyright").style.left = (btns.NL.x + 96).toString() + "px";
            __id("copyright").style.top = (btns.NL.y + 60).toString() + "px";
            labels.exp_lab.x = 250 / a;
            labels.exp_lab.y = 30 + 230 / a;
            labels.exp_dt.x = 250 / a;
            labels.exp_dt.y = 30 + 260 / a;
            btns.classes.h = btns.teachers.h = btns.classrooms.h = HOME_BTN_SIZE_Y / a;
            btns.classes.y = btns.teachers.y = btns.classrooms.y = 600 / a;
            b = 0;
            let c = 160 / a;
            btns.classes.hasOwnProperty("caption") && 7 < btns.classes.caption.length ? btns.classes.w = 1.05 * HOME_BTN_SIZE_X * btns.classes.caption.length / (8 * a) : btns.classes.w = HOME_BTN_SIZE_X / a;
            btns.classes.x = 0;
            b += btns.classes.w;
            btns.teachers.v && (btns.teachers.hasOwnProperty("caption") && 7 < btns.teachers.caption.length ? btns.teachers.w = 1.05 * HOME_BTN_SIZE_X * btns.teachers.caption.length / (8 * a) : btns.teachers.w = HOME_BTN_SIZE_X / a,
            btns.teachers.x = b + c,
            b += btns.teachers.w + c);
            btns.classrooms.v && (btns.classrooms.hasOwnProperty("caption") && 7 < btns.classrooms.caption.length ? btns.classrooms.w = 1.05 * HOME_BTN_SIZE_X * btns.classrooms.caption.length / (8 * a) : btns.classrooms.w = HOME_BTN_SIZE_X / a,
            btns.classrooms.x = b + c,
            b += btns.classrooms.w + c);
            btns.classes.x += Canvas.width / 2 - b / 2;
            btns.teachers.x += Canvas.width / 2 - b / 2;
            btns.classrooms.x += Canvas.width / 2 - b / 2
        },
        drawscroll: function(a) {},
        getbtn: function(a) {
            function b(c) {
                return c.v && a.x >= c.x && a.x <= c.x + c.w && a.y >= c.y && a.y <= c.y + c.h
            }
            return b(btns.classes) ? 0 : b(btns.teachers) ? 1 : b(btns.classrooms) ? 2 : -1
        },
        clickbtn: function() {}
    },
    classes: {
        BackTab: "home",
        init: function() {
            InitGeneralTab();
            MaxClsLen = 0;
            for (var a in NIKA.CLASSES)
                NIKA.CLASSES[a].length > MaxClsLen && (MaxClsLen = NIKA.CLASSES[a].substr(0, 12).length);
            CLASS_BTN_FONT = "bold 22px Arial";
            5 < MaxClsLen && (MaxClsLen = 6);
            classes = [];
            for (i in NIKA.CLASSES)
                NIKA.CLASSES.hasOwnProperty(i) && classes.push(i);
            classes.sort(function(b, c) {
                return GetClassNum(b) > GetClassNum(c) ? 1 : GetClassNum(b) < GetClassNum(c) ? -1 : NIKA.CLASSES[b] > NIKA.CLASSES[c] ? 1 : NIKA.CLASSES[b] < NIKA.CLASSES[c] ? -1 : 0
            })
        },
        resize: function(a) {
            ResizeGeneralTab(a, !1);
            ScrollBox.y = TOP_HEIGHT + 100;
            ScrollBox.w = Math.round(Canvas.width - 400 + 357 * (a - 1));
            ScrollBox.h = Canvas.height - ScrollBox.y - BOTTOM_HEIGHT - 30;
            CLASS_GRID_ROW_SIZE = Math.round(ScrollBox.h / 7);
            76 < CLASS_GRID_ROW_SIZE && (CLASS_GRID_ROW_SIZE = 76);
            45 > CLASS_GRID_ROW_SIZE && (CLASS_GRID_ROW_SIZE = 45);
            CLASS_BTN_SIZE_Y = Math.round(.67 * CLASS_GRID_ROW_SIZE);
            CLASS_BTN_SIZE_X = Math.round(24 * CLASS_BTN_SIZE_Y / 76 + 16 * MaxClsLen);
            CLASS_GRID_COL_SIZE = Math.round(ScrollBox.w / 12);
            30 > CLASS_GRID_COL_SIZE - CLASS_BTN_SIZE_X && (CLASS_GRID_COL_SIZE = CLASS_BTN_SIZE_X + 30);
            55 < CLASS_GRID_COL_SIZE - CLASS_BTN_SIZE_X && (CLASS_GRID_COL_SIZE = CLASS_BTN_SIZE_X + 55);
            ScrollTotalSizeX = 0;
            ScrollTotalSizeY = GRID_EDGE;
            ClassListIterator(function(b, c, d) {
                b + CLASS_GRID_COL_SIZE > ScrollTotalSizeX && (ScrollTotalSizeX = b + CLASS_GRID_COL_SIZE);
                c + CLASS_GRID_ROW_SIZE > ScrollTotalSizeY && (ScrollTotalSizeY = c + CLASS_GRID_ROW_SIZE)
            });
            ScrollBox.w > ScrollTotalSizeX ? ScrollBox.w = ScrollTotalSizeX : ScrollTotalSizeX += 2 * GRID_EDGE - (CLASS_GRID_COL_SIZE - CLASS_BTN_SIZE_X);
            300 > Canvas.width - (ScrollBox.x + ScrollBox.w) && (ScrollBox.x = Canvas.width - ScrollBox.w - 300);
            ScrollBox.h > ScrollTotalSizeY && (ScrollBox.h = ScrollTotalSizeY);
            ScrollBox.x = Canvas.width / 2 - ScrollBox.w / 2;
            ScrollStepX = CLASS_GRID_COL_SIZE;
            ScrollStepY = CLASS_GRID_ROW_SIZE;
            ScrollTranspEdges = 15;
            ResizeScrollBtn(!1)
        },
        drawback: function(a, b) {
            var c = String(NIKA.SCHEDULE_STR + " " + NIKA.FOR_CLASS_STR).toLowerCase();
            c = c.charAt(0).toUpperCase() + c.slice(1);
            DrawBackGeneralTab(a, b);
            labels.title.caption = c;
            DrawTitleLesson(a)
        },
        drawscroll: function(a) {
            var b = -1
              , c = 0
              , d = 0;
            ClassListIterator(function(e, f, g) {
                f > c && b++;
                c = f;
                d++;
                HLBtn == g ? (a.fillStyle = BTN_HL_COLOR,
                a.fillRect(e, f, CLASS_BTN_SIZE_X, CLASS_BTN_SIZE_Y)) : (a.fillStyle = CLASSES_COLORS[b % CLASSES_COLORS.length],
                a.fillRect(e, f, CLASS_BTN_SIZE_X, CLASS_BTN_SIZE_Y),
                a.drawImage(CLASSES_BUTTONS[d % CLASSES_BUTTONS.length], 0, 0, 98, 51, e, f, CLASS_BTN_SIZE_X, CLASS_BTN_SIZE_Y))
            });
            a.font = "bold 22px Arial";
            a.textAlign = "center";
            a.textBaseline = "top";
            ClassListIterator(function(e, f, g) {
                a.fillStyle = HLBtn == g ? BTN_HL_TEXT_COLOR : BTN_TEXT_COLOR;
                a.fillText(NIKA.CLASSES[g].substr(0, 11), e + CLASS_BTN_SIZE_X / 2, f + CLASS_BTN_SIZE_Y / 2 - 10)
            })
        },
        getbtn: function(a) {
            if (a.x < GRID_EDGE || a.y < GRID_EDGE || a.x > ScrollTotalSizeX - GRID_EDGE || a.y > ScrollTotalSizeY - GRID_EDGE + 15)
                return -1;
            var b = -1;
            ClassListIterator(function(c, d, e) {
                a.x >= c && a.y >= d && a.x < c + CLASS_BTN_SIZE_X && a.y < d + CLASS_BTN_SIZE_Y && (b = e)
            });
            return b
        },
        clickbtn: function() {
            -1 != HLBtn && (CurrClass = HLBtn,
            GetCurrMonday(new Date),
            GotoTab("classched"))
        }
    },
    teachers: {
        BackTab: "home",
        init: function() {
            InitGeneralTab();
            ScrollPosY = TeachScrollPosY;
            teachers = [];
            for (i in NIKA.TEACHERS)
                NIKA.TEACHERS.hasOwnProperty(i) && teachers.push(i);
            teachers.sort(function(e, f) {
                return NIKA.TEACHERS[e] > NIKA.TEACHERS[f] ? 1 : NIKA.TEACHERS[e] < NIKA.TEACHERS[f] ? -1 : 0
            });
            ScrollTotalSizeX = 0;
            ScrollTotalSizeY = 2 * GRID_EDGE + TEACHERS_GRID_ROW_SIZE;
            MaxTeachLen = 0;
            NIKA.TEACHERS_SHORT = {};
            for (var a in NIKA.TEACHERS) {
                var b = NIKA.TEACHERS[a];
                console.log(b);
                if (17 < b.length) {
                    var c = b.indexOf(" ");
                    if (-1 < c) {
                        var d = b.substr(0, c) + " " + b[c + 1] + ".";
                        c = b.indexOf(" ", c + 1);
                        -1 < c && (d += " " + b[c + 1] + ".");
                        b = d
                    }
                }
                22 < b.length && (b = b.substr(0, 19) + "...");
                NIKA.TEACHERS_SHORT[a] = b;
                b.length > MaxTeachLen && (MaxTeachLen = b.length)
            }
            22 < MaxTeachLen && (MaxTeachLen = 22);
            9 > MaxTeachLen && (MaxTeachLen = 8)
        },
        resize: function(a) {
            ResizeGeneralTab(a, !1);
            ScrollBox.y = TOP_HEIGHT + 100;
            ScrollBox.w = Math.round(Canvas.width - 400 + 357 * (a - 1));
            ScrollBox.h = Canvas.height - ScrollBox.y - BOTTOM_HEIGHT - 30;
            TEACHERS_GRID_ROW_SIZE = Math.round(ScrollBox.h / 7);
            82 < TEACHERS_GRID_ROW_SIZE && (TEACHERS_GRID_ROW_SIZE = 82);
            45 > TEACHERS_GRID_ROW_SIZE && (TEACHERS_GRID_ROW_SIZE = 45);
            TEACHER_BTN_SIZE_Y = Math.round(.62 * CLASS_GRID_ROW_SIZE);
            TEACHER_BTN_SIZE_X = Math.round(24 * TEACHER_BTN_SIZE_Y / 76 + 12 * MaxTeachLen);
            for (MaxTeachColumns = 5; 1 < MaxTeachColumns && 2 * GRID_EDGE + MaxTeachColumns * (TEACHER_BTN_SIZE_X + 30) - 30 > ScrollBox.w; )
                MaxTeachColumns--;
            TEACHERS_GRID_COL_SIZE = Math.round((ScrollBox.w - 2 * GRID_EDGE) / MaxTeachColumns);
            ScrollBox.w = MaxTeachColumns * TEACHERS_GRID_COL_SIZE + 2 * GRID_EDGE - (TEACHERS_GRID_COL_SIZE - TEACHER_BTN_SIZE_X);
            ScrollTotalSizeX = ScrollBox.w;
            ScrollTotalSizeY = GRID_EDGE;
            TeacherListIterator(function(b, c, d) {
                c + TEACHERS_GRID_ROW_SIZE > ScrollTotalSizeY && (ScrollTotalSizeY = c + TEACHERS_GRID_ROW_SIZE)
            });
            300 > Canvas.width - (ScrollBox.x + ScrollBox.w) && (ScrollBox.x = Canvas.width - ScrollBox.w - 300);
            ScrollBox.x = Canvas.width / 2 - ScrollBox.w / 2;
            ScrollStepX = TEACHERS_GRID_COL_SIZE;
            ScrollStepY = TEACHERS_GRID_ROW_SIZE;
            ScrollTranspEdges = 15;
            ResizeScrollBtn(!1)
        },
        drawback: function(a, b) {
            var c = String(NIKA.SCHEDULE_STR + " " + NIKA.FOR_TEACHER_STR).toLowerCase();
            c = c.charAt(0).toUpperCase() + c.slice(1);
            DrawBackGeneralTab(a, b);
            labels.title.caption = c;
            DrawTitleLesson(a)
        },
        drawscroll: function(a) {
            a.lineWidth = 2;
            a.fillStyle = "#FFFFFF";
            var b = 0;
            TeacherListIterator(function(c, d, e) {
                b++;
                a.fillRect(c, d, TEACHER_BTN_SIZE_X, TEACHER_BTN_SIZE_Y);
                HLBtn == e ? (a.strokeStyle = BTN_HL_COLOR,
                a.drawImage(TEACHER_BUTTONS_HL[b % TEACHER_BUTTONS.length], 0, 0, 98, 51, c, d, TEACHER_BTN_SIZE_X, TEACHER_BTN_SIZE_Y)) : (a.strokeStyle = BASE_COLOR,
                a.drawImage(TEACHER_BUTTONS[b % TEACHER_BUTTONS.length], 0, 0, 98, 51, c, d, TEACHER_BTN_SIZE_X, TEACHER_BTN_SIZE_Y));
                a.strokeRect(c, d, TEACHER_BTN_SIZE_X, TEACHER_BTN_SIZE_Y)
            });
            a.font = "bold 22px Arial";
            a.textAlign = "center";
            a.textBaseline = "top";
            a.fillStyle = BTN_TEXT_COLOR;
            TeacherListIterator(function(c, d, e) {
                a.fillText(NIKA.TEACHERS_SHORT[e], c + TEACHER_BTN_SIZE_X / 2, d + TEACHER_BTN_SIZE_Y / 2 - 10)
            })
        },
        getbtn: function(a) {
            if (a.x < GRID_EDGE || a.y < GRID_EDGE || a.x > ScrollTotalSizeX - GRID_EDGE || a.y > ScrollTotalSizeY - GRID_EDGE + 20)
                return -1;
            var b = -1;
            TeacherListIterator(function(c, d, e) {
                a.x >= c && a.y >= d && a.x < c + TEACHER_BTN_SIZE_X && a.y < d + TEACHER_BTN_SIZE_Y && (b = e)
            });
            return b
        },
        clickbtn: function() {
            -1 != HLBtn && (CurrTeacher = HLBtn,
            GetCurrMonday(new Date),
            TeachScrollPosY = ScrollPosY,
            GotoTab("teachsched"))
        }
    },
    teachsched: {
        BackTab: "teachers",
        init: function() {
            InitGeneralTab();
            labels.period.v = !0;
            SetTeacherWeek(0)
        },
        resize: function(a) {
            ResizeGeneralTab(a, !1);
            TS_FIRST_COL_SIZE_X = Math.round(.9 * TS_COL_SIZE_X);
            TS_FIRST_ROW_SIZE_Y = Math.round(.9 * TS_ROW_SIZE_Y);
            ScrollTotalSizeX = TS_FIRST_COL_SIZE_X + TS_COL_SIZE_X * CurrentWeekDays + 1;
            ScrollTotalSizeY = TS_FIRST_ROW_SIZE_Y + TS_ROW_SIZE_Y * NIKA.LESSONSINDAY + 1;
            NIKA.FIRSTLESSONNUM || (ScrollTotalSizeY += TS_ROW_SIZE_Y);
            ScrollStepX = TS_COL_SIZE_X;
            ScrollStepY = TS_ROW_SIZE_Y;
            ScrollBox.w = Math.round(Canvas.width - 450 + 307 * (a - 1));
            ScrollBox.w > ScrollTotalSizeX && (ScrollBox.w = ScrollTotalSizeX);
            ScrollBox.x = Canvas.width / 2 - ScrollBox.w / 2;
            ScrollBox.y = TOP_HEIGHT + 124;
            ScrollBox.h = Canvas.height - ScrollBox.y - BOTTOM_HEIGHT - 30;
            ScrollBox.h > ScrollTotalSizeY && (ScrollBox.h = ScrollTotalSizeY);
            labels.period.x = ScrollBox.x + ScrollBox.w / 2;
            ScrollTranspEdges = 0;
            btns.changes.x = ScrollBox.x - Math.round(160 / a);
            btns.changes.y = ScrollBox.y - Math.round(80 / a);
            btns.changes.w = Math.round(206 / a);
            btns.changes.h = Math.round(206 / a);
            labels.change_ln1.x = btns.changes.x + btns.changes.w / 2;
            labels.change_ln2.x = labels.change_ln1.x;
            labels.change_ln1.y = btns.changes.y + Math.round(.55 * btns.changes.h);
            labels.change_ln2.y = labels.change_ln1.y + Math.round(22 / a);
            ExchangesExist && (btns.arrow_left.x = ScrollBox.x - 87,
            btns.arrow_left.y = ScrollBox.y + ScrollBox.h / 2,
            btns.arrow_right.x = ScrollBox.x + ScrollBox.w + 20,
            btns.arrow_right.y = btns.arrow_left.y,
            labels.prev_week_ln1.x = ScrollBox.x - 110,
            labels.prev_week_ln1.y = btns.arrow_left.y - 30,
            labels.prev_week_ln2.x = ScrollBox.x - 110,
            labels.prev_week_ln2.y = btns.arrow_left.y - 10,
            labels.next_week_ln1.x = btns.arrow_right.x,
            labels.next_week_ln1.y = btns.arrow_right.y - 30,
            labels.next_week_ln2.x = btns.arrow_right.x,
            labels.next_week_ln2.y = btns.arrow_right.y - 10);
            ResizeScrollBtn(!0)
        },
        drawback: function(a, b) {
            var c = GetWeekTimetableCaption();
            DrawBackGeneralTab(a, b);
            labels.title.caption = c;
            DrawTitleLesson(a);
            DrawTitleTeacher(a, b)
        },
        drawscroll: function(a) {
            a.textBaseline = "top";
            a.shadowOffsetX = 0;
            a.shadowOffsetY = 0;
            var b, c, d;
            var e = TS_FIRST_COL_SIZE_X;
            let f = new Date(CurrMonday);
            for (var g = 0; 7 > g; g++) {
                var m = f.getDay() || 7;
                let q = GetPeriod(f)
                  , y = CurrWeekNum;
                const w = DateAsStr(f);
                let n = (b = Holidays[w]) && "vacation" == b.type;
                b && "transfer" == b.type && (m = b.daynum,
                b.weeknum && (y = b.weeknum),
                q = b.period);
                if (m > NIKA.WEEKDAYNUM)
                    f.setDate(f.getDate() + 1);
                else {
                    function k(x, z, A) {
                        a.font = z + " 18px Arial";
                        a.measureText(A).width > TS_COL_SIZE_X - 40 && (a.font = z + " 16px Arial");
                        a.measureText(A).width > TS_COL_SIZE_X - 40 && (a.font = z + " 14px Arial");
                        a.measureText(A).width > TS_COL_SIZE_X - 40 && (a.font = z + " 12px Arial");
                        a.measureText(A).width > TS_COL_SIZE_X - 40 && (A = A.substr(0, 28) + "...");
                        a.fillStyle = ShowExchangesTerm && t ? TS_EXCHANGE_COLOR : x;
                        FreeTeacher ? StrikeOutFreeLsn && (a.fillText(A, e + TS_COL_SIZE_X / 2, p),
                        a.strokeStyle = TS_EXCHANGE_COLOR,
                        a.strokeRect(e + TS_COL_SIZE_X / 2 - a.measureText(A).width / 2, p + 10, a.measureText(A).width, 1)) : a.fillText(A, e + TS_COL_SIZE_X / 2, p);
                        p += 20
                    }
                    b = TS_FIRST_ROW_SIZE_Y;
                    a.textAlign = "center";
                    for (var h = NIKA.FIRSTLESSONNUM; h <= NIKA.LESSONSINDAY; h++) {
                        let x = m.toString() + addZero(h);
                        FreeTeacher = !1;
                        var u = c = d = "";
                        var p = b + 10;
                        var r = "";
                        var t = !1;
                        a.fillStyle = h & 1 ^ g & 1 ? TS_CELL_COLOR2 : TS_CELL_COLOR1;
                        a.fillRect(e, b, TS_COL_SIZE_X, TS_ROW_SIZE_Y);
                        if (!n) {
                            if (window.NIKA.TEACH_EXCHANGE && window.NIKA.TEACH_EXCHANGE[CurrTeacher] && window.NIKA.TEACH_EXCHANGE[CurrTeacher][w] && window.NIKA.TEACH_EXCHANGE[CurrTeacher][w][h] && (t = !0,
                            FreeTeacher = "F" == NIKA.TEACH_EXCHANGE[CurrTeacher][w][h].s,
                            !FreeTeacher)) {
                                for (var v in NIKA.TEACH_EXCHANGE[CurrTeacher][w][h].c)
                                    d && (d += ", "),
                                    d += NIKA.CLASSES[NIKA.TEACH_EXCHANGE[CurrTeacher][w][h].c[v]];
                                NIKA.USEROOMS && window.NIKA.TEACH_EXCHANGE[CurrTeacher][w][h].r && (u = "(" + NIKA.ROOMS[NIKA.TEACH_EXCHANGE[CurrTeacher][w][h].r] + ")",
                                14 > d.length + u.length && (d += " " + u,
                                u = ""));
                                if (window.NIKA.TEACH_EXCHANGE[CurrTeacher][w][h].g)
                                    for (var l in NIKA.TEACH_EXCHANGE[CurrTeacher][w][h].g)
                                        c = NIKA.TEACH_EXCHANGE[CurrTeacher][w][h].g[l],
                                        -1 != c && (c = NIKA.CLASSGROUPS[c],
                                        -1 == r.indexOf(c) && (r && (r += ","),
                                        r += c));
                                c = NIKA.SUBJECTS[NIKA.TEACH_EXCHANGE[CurrTeacher][w][h].s]
                            }
                            if (!t || FreeTeacher)
                                for (; ; )
                                    if (window.NIKA.TEACH_SCHEDULE[q] && window.NIKA.TEACH_SCHEDULE[q][CurrTeacher] && window.NIKA.TEACH_SCHEDULE[q][CurrTeacher][x]) {
                                        if ("M" == window.NIKA.TEACH_SCHEDULE[q][CurrTeacher][x].s)
                                            a.fillStyle = h & 1 ^ g & 1 ? TS_METHOD_COLOR2 : TS_METHOD_COLOR1,
                                            a.fillRect(e, b, TS_COL_SIZE_X, TS_ROW_SIZE_Y);
                                        else {
                                            for (v in NIKA.TEACH_SCHEDULE[q][CurrTeacher][x].c)
                                                d && (d += ", "),
                                                d += NIKA.CLASSES[NIKA.TEACH_SCHEDULE[q][CurrTeacher][x].c[v]];
                                            NIKA.USEROOMS && window.NIKA.TEACH_SCHEDULE[q][CurrTeacher][x].r && (u = "(" + NIKA.ROOMS[NIKA.TEACH_SCHEDULE[q][CurrTeacher][x].r] + ")",
                                            14 > d.length + u.length && (d += " " + u,
                                            u = ""));
                                            if (window.NIKA.TEACH_SCHEDULE[q][CurrTeacher][x].g)
                                                for (l in NIKA.TEACH_SCHEDULE[q][CurrTeacher][x].g)
                                                    c = NIKA.TEACH_SCHEDULE[q][CurrTeacher][x].g[l],
                                                    -1 != c && (c = NIKA.CLASSGROUPS[c],
                                                    -1 == r.indexOf(c) && (r && (r += ","),
                                                    r += c));
                                            c = NIKA.SUBJECTS[NIKA.TEACH_SCHEDULE[q][CurrTeacher][x].s]
                                        }
                                        break
                                    } else if (0 < y && 3 == x.length)
                                        x = y.toString() + x;
                                    else
                                        break;
                            c && (d && k(SCHED_FONT_COLOR, "bold", d),
                            u && k(SCHED_FONT_COLOR, "bold", u),
                            r && k(SCHED_GROUP_COLOR, "italic", r),
                            (-1 == CurrSubject && 50 > p - b - 10 || -1 != CurrSubject && c != CurrSubject) && k(SCHED_FONT_COLOR, "bold", c))
                        }
                        b += TS_ROW_SIZE_Y
                    }
                    f.setDate(f.getDate() + 1);
                    e += TS_COL_SIZE_X
                }
            }
            a.translate(0, ScrollPosY);
            a.fillStyle = "#FFFFFF";
            a.fillRect(0, 0, ScrollTotalSizeX, TS_FIRST_ROW_SIZE_Y);
            a.translate(0, -ScrollPosY);
            f = new Date(CurrMonday);
            a.translate(0, ScrollPosY);
            e = TS_FIRST_COL_SIZE_X;
            for (v = 0; 7 > v; v++)
                l = f.getDay() || 7,
                g = DateAsStr(f),
                m = (g = Holidays[g]) && "vacation" == g.type,
                g && "transfer" == g.type && (l = g.daynum),
                l > NIKA.WEEKDAYNUM ? f.setDate(f.getDate() + 1) : (a.fillStyle = v & 1 ? TS_TITLE_COLOR2 : TS_TITLE_COLOR1,
                a.fillRect(e, 0, TS_COL_SIZE_X, TS_FIRST_ROW_SIZE_Y),
                a.fillStyle = m ? VACATION_FONT_COLOR : BTN_TEXT_COLOR,
                a.font = "bold 22px Arial, sans-serif",
                a.textAlign = "center",
                a.fillText(NIKA.DAY_NAMESH[v], e + TS_COL_SIZE_X / 2, 14),
                a.font = "normal 16px Arial",
                a.fillStyle = m ? VACATION_FONT_COLOR : GRAY_TEXT_COLOR,
                a.fillText(DateAsStr(f), e + TS_COL_SIZE_X / 2, TS_FIRST_ROW_SIZE_Y - 24),
                window.NIKA.TEACH_EXCHANGE && window.NIKA.TEACH_EXCHANGE[CurrTeacher] && window.NIKA.TEACH_EXCHANGE[CurrTeacher][DateAsStr(f)] && (a.strokeStyle = TS_EXCHANGE_COLOR_TITLE,
                a.lineWidth = 2,
                a.strokeRect(e + 1, 2, TS_COL_SIZE_X - 4, TS_FIRST_ROW_SIZE_Y - 2)),
                f.setDate(f.getDate() + 1),
                e += TS_COL_SIZE_X);
            a.translate(0, -ScrollPosY);
            a.translate(ScrollPosX, 0);
            a.fillStyle = "#FFFFFF";
            a.fillRect(0, 0, TS_FIRST_COL_SIZE_X, ScrollTotalSizeY);
            b = TS_FIRST_ROW_SIZE_Y;
            for (h = NIKA.FIRSTLESSONNUM; h <= NIKA.LESSONSINDAY; h++)
                a.fillStyle = h & 1 ? TS_TITLE_COLOR1 : TS_TITLE_COLOR2,
                a.fillRect(0, b, TS_FIRST_COL_SIZE_X, TS_ROW_SIZE_Y),
                a.fillStyle = BTN_TEXT_COLOR,
                a.font = "bold 22px Arial, sans-serif",
                a.textAlign = "center",
                a.fillText(h.toString() + " " + NIKA.LESSON_STR, TS_FIRST_COL_SIZE_X / 2, b + 14),
                a.textAlign = "center",
                a.fillStyle = GRAY_TEXT_COLOR,
                a.font = "normal 16px Arial, sans-serif",
                a.fillText(NIKA.LESSON_TIMES[h][0] + " - " + NIKA.LESSON_TIMES[h][1], TS_FIRST_COL_SIZE_X / 2, b + 42),
                b += TS_ROW_SIZE_Y;
            a.translate(-ScrollPosX, 0);
            a.translate(ScrollPosX, ScrollPosY);
            a.fillStyle = TS_TITLE_COLOR2;
            a.fillRect(0, 0, TS_FIRST_COL_SIZE_X, TS_FIRST_ROW_SIZE_Y);
            a.translate(-ScrollPosX, -ScrollPosY)
        },
        getbtn: function(a) {
            return -1
        },
        toPrev: function() {
            SetTeacherWeek(-7);
            window.onresize()
        },
        toNext: function() {
            SetTeacherWeek(7);
            window.onresize()
        },
        toCalendar: function() {
            GotoTab("teachcalendar")
        }
    },
    teachcalendar: {
        BackTab: "teachsched",
        init: function() {
            InitGeneralTab();
            labels.period.v = !0;
            SetMonth(0);
            labels.prev_month_ln1.v = !0;
            labels.prev_month_ln2.v = !0;
            labels.next_month_ln1.v = !0;
            labels.next_month_ln2.v = !0
        },
        resize: function(a) {
            ResizeGeneralTab(a, !0);
            labels.period.x = ScrollBox.x + ScrollBox.w / 2;
            btns.arrow_left.x = ScrollBox.x - 87;
            btns.arrow_left.y = ScrollBox.y + ScrollBox.h / 2;
            btns.arrow_right.x = ScrollBox.x + ScrollBox.w + 20;
            btns.arrow_right.y = btns.arrow_left.y;
            labels.prev_month_ln1.x = ScrollBox.x - 110;
            labels.prev_month_ln1.y = btns.arrow_left.y - 30;
            labels.prev_month_ln2.x = ScrollBox.x - 110;
            labels.prev_month_ln2.y = btns.arrow_left.y - 10;
            labels.next_month_ln1.x = btns.arrow_right.x;
            labels.next_month_ln1.y = btns.arrow_right.y - 30;
            labels.next_month_ln2.x = btns.arrow_right.x;
            labels.next_month_ln2.y = btns.arrow_right.y - 10;
            ResizeScrollBtn(!0)
        },
        drawback: function(a, b) {
            DrawBackGeneralTab(a, b);
            DrawTitleLesson(a);
            DrawTitleTeacher(a, b)
        },
        drawscroll: function(a) {
            DrawCalendar(a, function(b) {
                return window.NIKA.TEACH_EXCHANGE && window.NIKA.TEACH_EXCHANGE[CurrTeacher] && window.NIKA.TEACH_EXCHANGE[CurrTeacher][DateAsStr(b)] ? !0 : !1
            })
        },
        getbtn: function(a) {
            for (var b, c = StartCalendarDate.getMonth(), d = new Date(StartCalendarDate.getFullYear(),StartCalendarDate.getMonth(),1), e = Math.round(CL_FIRST_ROW_SIZE_Y * ScrollBox.w / CL_MAX_WIDTH); d.getMonth() == c; ) {
                b = (b = d.getDay()) ? b : 7;
                if (a.y >= e && a.y <= e + Math.round(CL_ROW_SIZE_Y * ScrollBox.w / CL_MAX_WIDTH))
                    return d;
                7 == b && (e += Math.round(CL_ROW_SIZE_Y * ScrollBox.w / CL_MAX_WIDTH));
                d.setDate(d.getDate() + 1)
            }
            return -1
        },
        clickbtn: function() {
            -1 != HLBtn && (GetCurrMonday(HLBtn),
            GotoTab("teachsched"))
        },
        toPrev: function() {
            SetMonth(-1)
        },
        toNext: function() {
            SetMonth(1)
        }
    },
    classched: {
        BackTab: "classes",
        init: function() {
            InitGeneralTab();
            labels.period.v = !0;
            SetClassWeek(0);
            CS_BusyDay = []
        },
        resize: function(a) {
            ResizeGeneralTab(a, !1);
            ScrollBox.y = TOP_HEIGHT + 124;
            ScrollBox.w = Math.round(Canvas.width - 450 + 307 * (a - 1));
            ScrollBox.h = Canvas.height - ScrollBox.y - BOTTOM_HEIGHT - 30;
            for (ClassSchedColCount = 3; 1 < ClassSchedColCount; ) {
                RealDayDistanceX = CS_MAX_DAY_DISTANCE;
                ScrollTotalSizeX = ClassSchedColCount * CS_DAY_WIDTH + (ClassSchedColCount - 1) * RealDayDistanceX;
                ScrollBox.w < ScrollTotalSizeX && (RealDayDistanceX = Math.round((ScrollBox.w - 20 - ClassSchedColCount * CS_DAY_WIDTH) / (ClassSchedColCount - 1)),
                RealDayDistanceX < CS_MIN_DAY_DISTANCE && (RealDayDistanceX = CS_MIN_DAY_DISTANCE),
                ScrollTotalSizeX = ClassSchedColCount * CS_DAY_WIDTH + (ClassSchedColCount - 1) * RealDayDistanceX);
                if (ScrollBox.w >= ScrollTotalSizeX) {
                    ScrollBox.w = ScrollTotalSizeX;
                    break
                }
                ClassSchedColCount--
            }
            ScrollBox.x = Canvas.width / 2 - ScrollBox.w / 2;
            for (var b = Math.ceil(CurrentWeekDays / ClassSchedColCount), c = b, d = CS_ADD_BOX_HEIGHT + MaxLessonCount * CS_ROW_SIZE_Y; ; )
                if (1 < c)
                    if (RealDayDistanceY = Math.round((ScrollBox.h - c * d) / (c - 1)),
                    RealDayDistanceY < CS_MIN_DAY_DISTANCE)
                        c--;
                    else
                        break;
                else {
                    RealDayDistanceY = CS_MIN_DAY_DISTANCE;
                    break
                }
            RealDayDistanceY > CS_MAX_DAY_DISTANCE && (RealDayDistanceY = CS_MAX_DAY_DISTANCE);
            ScrollTotalSizeY = b * d + (b - 1) * RealDayDistanceY;
            ScrollBox.h > ScrollTotalSizeY && (ScrollBox.h = ScrollTotalSizeY);
            ScrollStepX = CS_DAY_WIDTH;
            ScrollStepY = d + RealDayDistanceY;
            labels.period.x = ScrollBox.x + ScrollBox.w / 2;
            ScrollTranspEdges = 0;
            btns.changes.x = ScrollBox.x - Math.round(160 / a);
            btns.changes.y = ScrollBox.y - Math.round(80 / a);
            btns.changes.w = Math.round(206 / a);
            btns.changes.h = Math.round(206 / a);
            labels.change_ln1.x = btns.changes.x + btns.changes.w / 2;
            labels.change_ln2.x = labels.change_ln1.x;
            labels.change_ln1.y = btns.changes.y + Math.round(.55 * btns.changes.h);
            labels.change_ln2.y = labels.change_ln1.y + Math.round(22 / a);
            ExchangesExist && (btns.arrow_left.x = ScrollBox.x - 87,
            btns.arrow_left.y = ScrollBox.y + ScrollBox.h / 2,
            btns.arrow_right.x = ScrollBox.x + ScrollBox.w + 20,
            btns.arrow_right.y = btns.arrow_left.y,
            labels.prev_week_ln1.x = ScrollBox.x - 110,
            labels.prev_week_ln1.y = btns.arrow_left.y - 30,
            labels.prev_week_ln2.x = ScrollBox.x - 110,
            labels.prev_week_ln2.y = btns.arrow_left.y - 10,
            labels.next_week_ln1.x = btns.arrow_right.x,
            labels.next_week_ln1.y = btns.arrow_right.y - 30,
            labels.next_week_ln2.x = btns.arrow_right.x,
            labels.next_week_ln2.y = btns.arrow_right.y - 10);
            ResizeScrollBtn(!0)
        },
        drawback: function(a, b) {
            var c = GetWeekTimetableCaption();
            DrawBackGeneralTab(a, b);
            labels.title.caption = c;
            DrawTitleLesson(a);
            DrawTitleClass(a, b)
        },
        drawscroll: function(a) {
            a.textBaseline = "top";
            a.shadowOffsetX = 0;
            a.shadowOffsetY = 0;
            let b, c = 0, d = 0;
            var e, f, g, m;
            let h;
            let u;
            let p = CS_ADD_BOX_HEIGHT + MaxLessonCount * CS_ROW_SIZE_Y
              , r = new Date(CurrMonday);
            for (let D = 0; 7 > D; D++) {
                b = GetPeriod(r);
                const C = DateAsStr(r);
                let B = (e = Holidays[C]) && "vacation" == e.type
                  , G = D + 1
                  , H = CurrWeekNum;
                e && "transfer" == e.type && (G = e.daynum,
                e.weeknum && (H = e.weeknum),
                b = e.period);
                if (!(G > NIKA.WEEKDAYNUM)) {
                    var t = !0;
                    a.drawImage(DayLineImg, c, d, DayLineImg.width, p);
                    a.drawImage(DayBoxImg, c + 4, d - .035 * p, CS_DAY_WIDTH, 1.12 * p);
                    CS_BusyDay[D + 1] = new Date(r);
                    a.font = "bold 18px Arial";
                    a.textAlign = "center";
                    a.fillStyle = B ? VACATION_FONT_COLOR : BTN_TEXT_COLOR;
                    a.fillText(NIKA.DAY_NAMES[D], c + CS_DAY_WIDTH / 2, d + 18);
                    a.font = "normal 14px Arial, sans-serif";
                    a.fillStyle = B ? VACATION_FONT_COLOR : SCHED_FONT_COLOR;
                    a.fillText("(" + r.getDate() + " " + NIKA.MONTHS2[r.getMonth()] + ")", c + CS_DAY_WIDTH / 2, d + 40);
                    e = 60;
                    a.textAlign = "left";
                    var v = !0;
                    var l = !1;
                    u = 1 == SecondShiftNum;
                    for (var q = MinFirstLessonNum; q <= NIKA.LESSONSINDAY; q++)
                        if (!B) {
                            var y = G.toString() + addZero(q);
                            var w = g = f = "";
                            var n = h = m = !1;
                            if (window.NIKA.CLASS_EXCHANGE && window.NIKA.CLASS_EXCHANGE[CurrClass] && window.NIKA.CLASS_EXCHANGE[CurrClass][C] && window.NIKA.CLASS_EXCHANGE[CurrClass][C][q])
                                if (m = !0,
                                h = "F" == NIKA.CLASS_EXCHANGE[CurrClass][C][q].s[0],
                                h)
                                    StrikeOutFreeLsn || (f = NIKA.LESSON_CANCELED_STR);
                                else
                                    for (let F in NIKA.CLASS_EXCHANGE[CurrClass][C][q].s) {
                                        var k = NIKA.SUBJECTS[NIKA.CLASS_EXCHANGE[CurrClass][C][q].s[F]];
                                        k || (k = NIKA.LESSON_CANCELED_STR);
                                        k != g && (f && (f += "/"),
                                        f += k,
                                        g = k);
                                        NIKA.USEROOMS && window.NIKA.CLASS_EXCHANGE[CurrClass][C][q].r && (w && (w += ","),
                                        k = NIKA.ROOMS[NIKA.CLASS_EXCHANGE[CurrClass][C][q].r[F]],
                                        k || (k = NIKA.NO_STR),
                                        w += k)
                                    }
                            if (!m || h && StrikeOutFreeLsn)
                                for (w = g = f = ""; ; )
                                    if (window.NIKA.CLASS_SCHEDULE[b] && window.NIKA.CLASS_SCHEDULE[b][CurrClass] && window.NIKA.CLASS_SCHEDULE[b][CurrClass][y]) {
                                        for (let F in NIKA.CLASS_SCHEDULE[b][CurrClass][y].s)
                                            (k = NIKA.SUBJECTS[NIKA.CLASS_SCHEDULE[b][CurrClass][y].s[F]]) || (k = "(" + NIKA.NO_LESSONS_STR + ")"),
                                            k != g && (f && (f += "/"),
                                            f += k,
                                            g = k),
                                            NIKA.USEROOMS && window.NIKA.CLASS_SCHEDULE[b][CurrClass][y].r && (w && (w += ","),
                                            k = NIKA.ROOMS[NIKA.CLASS_SCHEDULE[b][CurrClass][y].r[F]],
                                            k || (k = NIKA.NO_STR),
                                            w += k);
                                        1 == NIKA.CLASS_SCHEDULE[b][CurrClass][y].s.length && "u" == NIKA.CLASS_SCHEDULE[b][CurrClass][y].s[0][0] && (n = !0);
                                        break
                                    } else if (0 < H && 3 == y.length)
                                        y = H.toString() + y;
                                    else
                                        break;
                            w && f && (f = -1 == w.indexOf("(") ? f + " (" + w + ")" : f + "  " + w);
                            if (f) {
                                t && (t = getLessonTimeForDay(G, q),
                                a.fillStyle = SCHED_GROUP_COLOR,
                                a.strokeStyle = SCHED_GROUP_COLOR,
                                a.font = "underline 12px Arial, sans-serif",
                                a.fillText(t[0], c + CS_LEFT_SHIFT, d + e - 1),
                                a.fillRect(c + CS_LEFT_SHIFT, d + e + 12, a.measureText(t[0]).width, 1),
                                e += CS_ROW_SIZE_Y - 14,
                                t = !1);
                                g = q;
                                w = !1;
                                1 < SecondShiftNum && !u && (q < SecondShiftNum ? u = !0 : (g = q - SecondShiftNum + 1,
                                w = !0));
                                a.fillStyle = ShowExchangesTerm && m && (!h || h && !StrikeOutFreeLsn) ? TS_EXCHANGE_COLOR : h ? SCHED_GROUP_COLOR : n ? UPK_COLOR : BTN_TEXT_COLOR;
                                a.font = "normal 16px Arial, sans-serif";
                                NIKA.SECOND_RELATIVE ? a.fillText(g + ".", c + CS_LEFT_SHIFT, d + e + 5) : a.fillText(q + ".", c + CS_LEFT_SHIFT, d + e + 5);
                                m = 14;
                                a.measureText(f).width > CS_DAY_WIDTH - 64 && (a.font = "normal 14px Arial, sans-serif",
                                m = 14);
                                a.measureText(f).width > CS_DAY_WIDTH - 64 && (a.font = "normal 12px Arial, sans-serif",
                                m = 10);
                                a.measureText(f).width > CS_DAY_WIDTH - 64 && (a.font = "normal 10px Arial, sans-serif",
                                m = 8);
                                if (a.measureText(f).width > CS_DAY_WIDTH - 64) {
                                    f = f.split(" (", 2);
                                    if (a.measureText(f[0]).width > CS_DAY_WIDTH - 64) {
                                        m = f;
                                        n = a;
                                        v = CS_DAY_WIDTH - 64;
                                        l = f[0].split("/");
                                        for (k = 0; k < l.length; k++)
                                            6 < l[k].length && (l[k] = l[k].substring(0, l[k].length - 4) + "..");
                                        y = l.join("/");
                                        for (k = n.measureText(y).width; k > v; ) {
                                            var x = !1
                                              , z = !0;
                                            for (k = 0; k < l.length; k++) {
                                                var A = l[k]
                                                  , E = A.indexOf("..");
                                                6 < (0 <= E ? E : A.length) && (z = !1,
                                                0 < E ? (l[k] = A.substring(0, E - 1) + "..",
                                                x = !0) : 6 < A.length && (l[k] = A.substring(0, A.length - 4) + "..",
                                                x = !0))
                                            }
                                            if (!x || z)
                                                break;
                                            y = l.join("/");
                                            k = n.measureText(y).width
                                        }
                                        m[0] = y
                                    }
                                    a.fillText(f[0], c + CS_LEFT_SHIFT + 22, d + e - 1);
                                    a.fillText("(" + f[1], c + CS_LEFT_SHIFT + 22, d + e + 12);
                                    h && StrikeOutFreeLsn && (a.strokeStyle = SCHED_GROUP_COLOR,
                                    a.fillRect(c + CS_LEFT_SHIFT + 22, d + e + 4, a.measureText(f[0]).width, 1),
                                    a.fillRect(c + CS_LEFT_SHIFT + 22, d + e + 17, a.measureText(f[1]).width, 1))
                                } else
                                    a.fillText(f, c + CS_LEFT_SHIFT + 22, d + e + 5),
                                    h && StrikeOutFreeLsn && (a.strokeStyle = SCHED_GROUP_COLOR,
                                    a.fillRect(c + CS_LEFT_SHIFT + 22, d + e + m, a.measureText(f).width, 1));
                                w && (a.font = "bold 16px Arial",
                                a.fillStyle = SECOND_SHIFT_COLOR,
                                NIKA.SECOND_RELATIVE ? a.fillText("*", c + CS_LEFT_SHIFT + a.measureText(g).width, d + e + 5) : a.fillText("*", c + CS_LEFT_SHIFT + a.measureText(q).width, d + e + 5));
                                e += CS_ROW_SIZE_Y;
                                v = !1;
                                l = !0
                            } else
                                v || (e += CS_ROW_SIZE_Y),
                                v = !0
                        }
                    l ? HLBtn == D + 1 ? a.drawImage(SelectDayHL, c + 16, d + 16) : a.drawImage(SelectDay, c + 16, d + 16) : (CS_BusyDay[D + 1] = void 0,
                    a.textAlign = "center",
                    a.fillStyle = SCHED_GROUP_COLOR,
                    a.font = "bold 16px Arial",
                    a.fillText(NIKA.NO_LESSONS_STR, c + CS_DAY_WIDTH / 2, d + 75),
                    a.textAlign = "left");
                    c += CS_DAY_WIDTH + RealDayDistanceX;
                    0 == (D + 1) % ClassSchedColCount && (d += RealDayDistanceY + p,
                    c = 0)
                }
                r.setDate(r.getDate() + 1)
            }
        },
        getbtn: function(a) {
            for (var b = 0, c = 0, d = CS_ADD_BOX_HEIGHT + MaxLessonCount * CS_ROW_SIZE_Y, e = 0; 7 > e; e++) {
                if (CS_BusyDay[e + 1] && a.x >= b && a.x < b + CS_DAY_WIDTH && a.y >= c && a.y < c + d - 6)
                    return e + 1;
                b += CS_DAY_WIDTH + RealDayDistanceX;
                0 == (e + 1) % ClassSchedColCount && (c += RealDayDistanceY + d,
                b = 0)
            }
            return -1
        },
        toPrev: function() {
            SetClassWeek(-7);
            window.onresize()
        },
        toNext: function() {
            SetClassWeek(7);
            window.onresize()
        },
        clickbtn: function() {
            -1 != HLBtn && CS_BusyDay[HLBtn] && (CurrDay = new Date(CS_BusyDay[HLBtn]),
            GotoTab("classday"))
        },
        toCalendar: function() {
            GotoTab("classcalendar")
        }
    },
    classcalendar: {
        BackTab: "classched",
        init: function() {
            InitGeneralTab();
            labels.period.v = !0;
            SetMonth(0);
            labels.prev_month_ln1.v = !0;
            labels.prev_month_ln2.v = !0;
            labels.next_month_ln1.v = !0;
            labels.next_month_ln2.v = !0
        },
        resize: function(a) {
            ResizeGeneralTab(a, !0);
            labels.period.x = ScrollBox.x + ScrollBox.w / 2;
            btns.arrow_left.x = ScrollBox.x - 87;
            btns.arrow_left.y = ScrollBox.y + ScrollBox.h / 2;
            btns.arrow_right.x = ScrollBox.x + ScrollBox.w + 20;
            btns.arrow_right.y = btns.arrow_left.y;
            labels.prev_month_ln1.x = ScrollBox.x - 110;
            labels.prev_month_ln1.y = btns.arrow_left.y - 30;
            labels.prev_month_ln2.x = ScrollBox.x - 110;
            labels.prev_month_ln2.y = btns.arrow_left.y - 10;
            labels.next_month_ln1.x = btns.arrow_right.x;
            labels.next_month_ln1.y = btns.arrow_right.y - 30;
            labels.next_month_ln2.x = btns.arrow_right.x;
            labels.next_month_ln2.y = btns.arrow_right.y - 10;
            ResizeScrollBtn(!0)
        },
        drawback: function(a, b) {
            DrawBackGeneralTab(a, b);
            DrawTitleLesson(a);
            DrawTitleClass(a, b)
        },
        drawscroll: function(a) {
            DrawCalendar(a, function(b) {
                return window.NIKA.CLASS_EXCHANGE && window.NIKA.CLASS_EXCHANGE[CurrClass] && window.NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(b)] ? !0 : !1
            })
        },
        getbtn: function(a) {
            for (var b, c = StartCalendarDate.getMonth(), d = new Date(StartCalendarDate.getFullYear(),StartCalendarDate.getMonth(),1), e = Math.round(CL_FIRST_ROW_SIZE_Y * ScrollBox.w / CL_MAX_WIDTH); d.getMonth() == c; ) {
                b = (b = d.getDay()) ? b : 7;
                if (a.y >= e && a.y <= e + Math.round(CL_ROW_SIZE_Y * ScrollBox.w / CL_MAX_WIDTH))
                    return d;
                7 == b && (e += Math.round(CL_ROW_SIZE_Y * ScrollBox.w / CL_MAX_WIDTH));
                d.setDate(d.getDate() + 1)
            }
            return -1
        },
        clickbtn: function() {
            -1 != HLBtn && (GetCurrMonday(HLBtn),
            GotoTab("classched"))
        },
        toPrev: function() {
            SetMonth(-1)
        },
        toNext: function() {
            SetMonth(1)
        }
    },
    classday: {
        BackTab: "classched",
        init: function() {
            InitGeneralTab();
            labels.period.v = !1;
            SetClassDay(0)
        },
        calcCellHeight: function(a) {
            var b = GetPeriod(CurrDay), c;
            let d;
            var e = CurrDay.getDay() || 7;
            let f = CurrWeekNum;
            const g = DateAsStr(CurrDay);
            (c = Holidays[g]) && "transfer" == c.type && (e = c.daynum,
            c.weeknum && (f = c.weeknum),
            b = c.period);
            c = e.toString() + addZero(a);
            let m = !1
              , h = !1;
            e = [];
            let u = [];
            if (window.NIKA.CLASS_EXCHANGE && window.NIKA.CLASS_EXCHANGE[CurrClass] && window.NIKA.CLASS_EXCHANGE[CurrClass][g] && window.NIKA.CLASS_EXCHANGE[CurrClass][g][a])
                if (m = !0,
                h = "F" == NIKA.CLASS_EXCHANGE[CurrClass][g][a].s[0])
                    StrikeOutFreeLsn || u.push(NIKA.LESSON_CANCELED_STR);
                else {
                    for (let p in NIKA.CLASS_EXCHANGE[CurrClass][g][a].s)
                        d = NIKA.SUBJECTS[NIKA.CLASS_EXCHANGE[CurrClass][g][a].s[p]],
                        d && void 0 != d || (d = NIKA.LESSON_CANCELED_STR),
                        u.push(d);
                    if (window.NIKA.CLASS_EXCHANGE[CurrClass][g][a].g)
                        for (let p in NIKA.CLASS_EXCHANGE[CurrClass][g][a].g)
                            d = NIKA.CLASSGROUPS[NIKA.CLASS_EXCHANGE[CurrClass][g][a].g[p]],
                            void 0 == d && (d = ""),
                            e.push(d)
                }
            if (!m || h && StrikeOutFreeLsn)
                for (e = [],
                u = []; ; )
                    if (window.NIKA.CLASS_SCHEDULE[b] && window.NIKA.CLASS_SCHEDULE[b][CurrClass] && window.NIKA.CLASS_SCHEDULE[b][CurrClass][c]) {
                        for (let p in window.NIKA.CLASS_SCHEDULE[b][CurrClass][c].s)
                            d = NIKA.SUBJECTS[NIKA.CLASS_SCHEDULE[b][CurrClass][c].s[p]],
                            d && void 0 != d || (d = NIKA.NO_LESSONS_STR),
                            u.push(d);
                        if (window.NIKA.CLASS_SCHEDULE[b][CurrClass][c].g)
                            for (let p in NIKA.CLASS_SCHEDULE[b][CurrClass][c].g)
                                d = NIKA.CLASSGROUPS[NIKA.CLASS_SCHEDULE[b][CurrClass][c].g[p]],
                                void 0 == d && (d = ""),
                                e.push(d);
                        break
                    } else if (0 < f && 3 == c.length)
                        c = f.toString() + c;
                    else
                        break;
            switch (u.length) {
            case 0:
                b = 0;
                a = 70;
                break;
            case 1:
                b = 1;
                a = 82;
                break;
            case 2:
                b = 30;
                a = 58;
                break;
            default:
                b = 22,
                a = 38
            }
            0 < e.length && (a += b * e.length);
            return Math.max(CDS_ROW_HEIGHT, a)
        },
        resize: function(a) {
            ResizeGeneralTab(a, !1);
            ScrollBox.y = TOP_HEIGHT + 124;
            ScrollBox.w = Math.round(Canvas.width - 280);
            ScrollBox.w > CDS_TABLE_WIDTH && (ScrollBox.w = CDS_TABLE_WIDTH);
            ScrollBox.h = Canvas.height - ScrollBox.y - BOTTOM_HEIGHT - 30;
            ScrollBox.x = Canvas.width / 2 - ScrollBox.w / 2;
            ScrollStepX = 1;
            ScrollStepY = CDS_ROW_HEIGHT;
            ScrollTranspEdges = 12;
            ScrollTotalSizeX = ScrollBox.w;
            ScrollTotalSizeY = 0;
            if (-1 == FirstLessonNum)
                ScrollTotalSizeY += CDS_ROW_HEIGHT;
            else
                for (a = FirstLessonNum; a <= LastLessonNum; a++)
                    ScrollTotalSizeY += this.calcCellHeight(a);
            ScrollTotalSizeY += 10;
            ScrollBox.h > ScrollTotalSizeY && (ScrollBox.h = ScrollTotalSizeY);
            btns.arrow_left.x = ScrollBox.x - 87;
            btns.arrow_left.y = ScrollBox.y + ScrollBox.h / 2;
            btns.arrow_right.x = ScrollBox.x + ScrollBox.w + 20;
            btns.arrow_right.y = btns.arrow_left.y;
            labels.prev_month_ln1.x = ScrollBox.x - 110;
            labels.prev_month_ln1.y = btns.arrow_left.y - 30;
            labels.prev_day_ln2.x = ScrollBox.x - 110;
            labels.prev_day_ln2.y = btns.arrow_left.y - 10;
            labels.next_month_ln1.x = btns.arrow_right.x;
            labels.next_month_ln1.y = btns.arrow_right.y - 30;
            labels.next_day_ln2.x = btns.arrow_right.x;
            labels.next_day_ln2.y = btns.arrow_right.y - 10;
            ResizeScrollBtn(!0)
        },
        drawback: function(a, b) {
            var c = CurrDay.getDay() || 7;
            c = String(NIKA.DAY_NAMES[c - 1] + ", " + CurrDay.getDate() + " " + NIKA.MONTHS2[CurrDay.getMonth()]).toLowerCase();
            c = c.charAt(0).toUpperCase() + c.slice(1);
            DrawBackGeneralTab(a, b);
            CurrWeekNum && (c += " (",
            1 == CurrWeekNum && (c += NIKA.FIRSTWEEK_STR),
            2 == CurrWeekNum && (c += NIKA.SECONDWEEK_STR),
            c += ")");
            labels.title.caption = c;
            DrawTitleLesson(a);
            DrawTitleClass(a, b)
        },
        drawscroll: function(a) {
            a.textBaseline = "alphabetic";
            let b = GetPeriod(CurrDay);
            var c;
            let d, e, f;
            let g, m, h = 130 + 12 * SUBJECT_MAX_LENGTH, u = ScrollBox.w - 12 * ROOM_MAX_LENGTH - 20, p = CurrDay.getDay() || 7, r = CurrWeekNum;
            const t = DateAsStr(CurrDay);
            (c = Holidays[t]) && "transfer" == c.type && (p = c.daynum,
            c.weeknum && (r = c.weeknum),
            b = c.period);
            c = 0;
            if (-1 == FirstLessonNum)
                a.fillStyle = SCHED_GROUP_COLOR,
                a.font = "normal 24px Arial, sans-serif",
                a.textAlign = "center",
                a.fillText(NIKA.NO_LESSONS_STR, ScrollBox.w / 2, c + 30);
            else {
                var v = 1 == SecondShiftNum;
                for (let z = FirstLessonNum; z <= LastLessonNum; z++) {
                    var l = p.toString() + addZero(z);
                    var q = !1
                      , y = !1;
                    let A = !1;
                    var w = [];
                    let E = []
                      , D = []
                      , C = [];
                    if (window.NIKA.CLASS_EXCHANGE && window.NIKA.CLASS_EXCHANGE[CurrClass] && window.NIKA.CLASS_EXCHANGE[CurrClass][t] && window.NIKA.CLASS_EXCHANGE[CurrClass][t][z])
                        if (q = !0,
                        y = "F" == NIKA.CLASS_EXCHANGE[CurrClass][t][z].s[0])
                            StrikeOutFreeLsn || E.push(NIKA.LESSON_CANCELED_STR);
                        else {
                            for (let B in NIKA.CLASS_EXCHANGE[CurrClass][t][z].s) {
                                var n = NIKA.SUBJECTS[NIKA.CLASS_EXCHANGE[CurrClass][t][z].s[B]];
                                var k = "";
                                n && void 0 != n ? NIKA.USEROOMS && window.NIKA.CLASS_EXCHANGE[CurrClass][t][z].r && (k = NIKA.ROOMS[NIKA.CLASS_EXCHANGE[CurrClass][t][z].r[B]],
                                void 0 == k && (k = NIKA.NO_STR)) : n = NIKA.LESSON_CANCELED_STR;
                                E.push(n);
                                C.push(k)
                            }
                            if (window.NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(CurrDay)][z].g)
                                for (let B in NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(CurrDay)][z].g)
                                    n = NIKA.CLASSGROUPS[NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(CurrDay)][z].g[B]],
                                    void 0 == n && (n = ""),
                                    w.push(n);
                            if (window.NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(CurrDay)][z].t)
                                for (let B in NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(CurrDay)][z].t)
                                    n = NIKA.TEACHERS[NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(CurrDay)][z].t[B]],
                                    void 0 == n && (n = ""),
                                    D.push(n)
                        }
                    if (!q || y && StrikeOutFreeLsn)
                        for (w = [],
                        E = [],
                        D = [],
                        C = []; ; )
                            if (window.NIKA.CLASS_SCHEDULE[b] && window.NIKA.CLASS_SCHEDULE[b][CurrClass] && window.NIKA.CLASS_SCHEDULE[b][CurrClass][l]) {
                                for (let B in window.NIKA.CLASS_SCHEDULE[b][CurrClass][l].s)
                                    n = NIKA.SUBJECTS[NIKA.CLASS_SCHEDULE[b][CurrClass][l].s[B]],
                                    k = "",
                                    n && void 0 != n ? (NIKA.USEROOMS && window.NIKA.CLASS_SCHEDULE[b][CurrClass][l].r && (k = NIKA.ROOMS[NIKA.CLASS_SCHEDULE[b][CurrClass][l].r[B]]),
                                    void 0 == k && (k = NIKA.NO_STR)) : n = NIKA.NO_LESSONS_STR,
                                    E.push(n),
                                    C.push(k);
                                1 == NIKA.CLASS_SCHEDULE[b][CurrClass][l].s.length && "u" == NIKA.CLASS_SCHEDULE[b][CurrClass][l].s[0][0] && (A = !0);
                                if (window.NIKA.CLASS_SCHEDULE[b][CurrClass][l].g)
                                    for (let B in NIKA.CLASS_SCHEDULE[b][CurrClass][l].g)
                                        n = NIKA.CLASSGROUPS[NIKA.CLASS_SCHEDULE[b][CurrClass][l].g[B]],
                                        void 0 == n && (n = ""),
                                        w.push(n);
                                if (window.NIKA.CLASS_SCHEDULE[b][CurrClass][l].t)
                                    for (let B in NIKA.CLASS_SCHEDULE[b][CurrClass][l].t)
                                        n = NIKA.TEACHERS[NIKA.CLASS_SCHEDULE[b][CurrClass][l].t[B]],
                                        void 0 == n && (n = ""),
                                        D.push(n);
                                break
                            } else if (0 < r && 3 == l.length)
                                l = r.toString() + l;
                            else
                                break;
                    k = z;
                    l = !1;
                    1 < SecondShiftNum && !v && (z < SecondShiftNum ? v = !0 : (k = z - SecondShiftNum + 1,
                    l = !0));
                    a.fillStyle = BTN_TEXT_COLOR;
                    a.font = "bold 18px Arial, sans-serif";
                    a.textAlign = "center";
                    k = NIKA.SECOND_RELATIVE ? k + " " + NIKA.LESSON_STR : z + " " + NIKA.LESSON_STR;
                    a.fillText(k, 55, c + 30);
                    a.fillStyle = SCHED_GROUP_COLOR;
                    a.font = "normal 16px Arial, sans-serif";
                    var x = getLessonTimeForDay(p, z);
                    a.fillText(x[0] + " - " + x[1], 55, c + 60);
                    l && (a.textAlign = "left",
                    a.font = "bold 18px Arial, sans-serif",
                    a.fillStyle = SECOND_SHIFT_COLOR,
                    a.fillText("*", 60 + Math.round(a.measureText(k).width / 2), c + 30));
                    switch (E.length) {
                    case 0:
                        a.fillStyle = SCHED_GROUP_COLOR;
                        a.font = "normal 22px Arial, sans-serif";
                        a.textAlign = "left";
                        a.fillText(NIKA.NO_LESSONS_STR, 120, c + 20);
                        l = 0;
                        f = c + 35;
                        m = 70;
                        break;
                    case 1:
                        d = "22px Arial, sans-serif";
                        e = "16px Arial, sans-serif";
                        l = 1;
                        f = c + 41;
                        m = 82;
                        break;
                    case 2:
                        d = "18px Arial, sans-serif";
                        e = "16px Arial, sans-serif";
                        l = 30;
                        f = c + 29;
                        m = 58;
                        break;
                    default:
                        e = d = "16px Arial, sans-serif",
                        l = 22,
                        f = c + 19,
                        m = 38
                    }
                    a.textAlign = "left";
                    a.textBaseline = "top";
                    x = 0;
                    k = f;
                    if (0 < w.length) {
                        a.font = "italic " + d;
                        a.fillStyle = y && StrikeOutFreeLsn ? SCHED_GROUP_COLOR : ShowExchangesTerm && q ? TS_EXCHANGE_COLOR : BTN_TEXT_COLOR;
                        for (n = 0; n < w.length; n++)
                            x = Math.max(a.measureText(w[n]).width, x),
                            a.fillText(w[n] + ":", 130, k),
                            k += l,
                            m += l;
                        x += 10
                    }
                    k = f;
                    w = 0;
                    if (0 < E.length) {
                        a.font = "normal " + d;
                        a.fillStyle = y && StrikeOutFreeLsn ? SCHED_GROUP_COLOR : ShowExchangesTerm && q ? TS_EXCHANGE_COLOR : A ? UPK_COLOR : BTN_TEXT_COLOR;
                        for (n = 0; n < E.length; n++)
                            a.measureText(E[n]).width > w && (w = a.measureText(E[n]).width),
                            a.fillText(E[n], 130 + x, k),
                            k += l;
                        w += 10
                    }
                    k = f;
                    g = 0;
                    if (0 < D.length) {
                        a.font = "bold " + e;
                        a.fillStyle = y && StrikeOutFreeLsn ? SCHED_GROUP_COLOR : ShowExchangesTerm && q ? TS_EXCHANGE_COLOR : CDS_TEACHER_COLOR;
                        for (let B = 0; B < D.length; B++) {
                            for (n = D[B]; h + a.measureText(n).width > u - 10 && 3 < n.length; )
                                n = n.substr(0, n.length - 5) + "...";
                            a.fillText(n, h, k);
                            g = Math.max(a.measureText(n).width, g);
                            k += l
                        }
                    }
                    k = f;
                    n = 0;
                    if (0 < C.length)
                        for (a.font = "normal " + d,
                        a.fillStyle = y && StrikeOutFreeLsn ? SCHED_GROUP_COLOR : ShowExchangesTerm && q ? TS_EXCHANGE_COLOR : A ? UPK_COLOR : BTN_TEXT_COLOR,
                        q = 0; q < C.length; q++)
                            a.fillText(C[q], u, k),
                            n = Math.max(a.measureText(C[q]).width, n),
                            k += l;
                    if (y && StrikeOutFreeLsn)
                        for (k = f,
                        y = 0; y < E.length; y++)
                            a.beginPath(),
                            a.strokeStyle = SCHED_GROUP_COLOR,
                            a.moveTo(130, k + 10),
                            a.lineTo(130 + x + w, k + 10),
                            D.length > y && "" != D[y] && (a.moveTo(h, k + 10),
                            a.lineTo(h + g, k + 10)),
                            C.length > y && "" != C[y] && (a.moveTo(u, k + 10),
                            a.lineTo(u + n, k + 10)),
                            a.closePath(),
                            a.stroke(),
                            k += l;
                    a.beginPath();
                    a.lineWidth = 2;
                    a.strokeStyle = CDS_ROW_LINE_COLOR;
                    a.moveTo(12, c);
                    a.lineTo(CDS_TABLE_WIDTH - 20, c);
                    a.closePath();
                    a.stroke();
                    z & 1 && (a.fillStyle = CDS_ROW_COLOR_TRNSP,
                    a.fillRect(0, c, ScrollTotalSizeX, m));
                    c += Math.max(CDS_ROW_HEIGHT, m)
                }
            }
        },
        getbtn: function(a) {
            return -1
        },
        toPrev: function() {
            if (ExchangesExist || 1 != CurrDay.getDay())
                SetClassDay(-1),
                window.onresize()
        },
        toNext: function() {
            if (ExchangesExist || CurrDay.getDay() != NIKA.WEEKDAYNUM)
                SetClassDay(1),
                window.onresize()
        }
    },
    classrooms: {
        BackTab: "home",
        init: function() {
            InitGeneralTab();
            ScrollPosY = RoomScrollPosY;
            if ("undefined" == typeof rooms) {
                rooms = ["any_room"];
                for (i in NIKA.ROOMS)
                    NIKA.ROOMS.hasOwnProperty(i) && rooms.push(i);
                rooms.sort(function(c, d) {
                    return NIKA.ROOMS[c] > NIKA.ROOMS[d] ? 1 : NIKA.ROOMS[c] < NIKA.ROOMS[d] ? -1 : 0
                })
            }
            ScrollTotalSizeX = 0;
            ScrollTotalSizeY = 2 * GRID_EDGE + TEACHERS_GRID_ROW_SIZE;
            MaxRoomLen = 0;
            NIKA.ROOMS_SHORT = {};
            for (var a in NIKA.ROOMS) {
                var b = NIKA.ROOMS[a];
                22 < b.length && (b = b.substr(0, 19) + "...");
                NIKA.ROOMS_SHORT[a] = b;
                b.length > MaxRoomLen && (MaxRoomLen = b.length)
            }
            22 < MaxRoomLen && (MaxRoomLen = 22);
            6 > MaxRoomLen && (MaxRoomLen = 6);
            NIKA.ROOMS_SHORT.any_room = NIKA.FIND_ANY_ROOM
        },
        resize: function(a) {
            ResizeGeneralTab(a, !1);
            ScrollBox.y = TOP_HEIGHT + 100;
            ScrollBox.w = Math.round(Canvas.width - 400 + 357 * (a - 1));
            ScrollBox.h = Canvas.height - ScrollBox.y - BOTTOM_HEIGHT - 30;
            ROOMS_GRID_ROW_SIZE = Math.round(ScrollBox.h / 7);
            82 < ROOMS_GRID_ROW_SIZE && (ROOMS_GRID_ROW_SIZE = 82);
            45 > ROOMS_GRID_ROW_SIZE && (ROOMS_GRID_ROW_SIZE = 45);
            ROOM_BTN_SIZE_Y = Math.round(.62 * ROOMS_GRID_ROW_SIZE);
            ROOM_BTN_SIZE_X = Math.round(24 * ROOM_BTN_SIZE_Y / 76 + 12 * MaxRoomLen);
            SEARCH_ROOM_BTN_SIZE_X = Math.round(24 * ROOM_BTN_SIZE_Y / 76 + 12 * (NIKA.FIND_ANY_ROOM.length + 1));
            for (MaxRoomColumns = 8; 1 < MaxRoomColumns && 2 * GRID_EDGE + MaxRoomColumns * (ROOM_BTN_SIZE_X + 30) - 30 > ScrollBox.w; )
                MaxRoomColumns--;
            ROOMS_GRID_COL_SIZE = Math.round((ScrollBox.w - 2 * GRID_EDGE) / MaxRoomColumns);
            ScrollBox.w = MaxRoomColumns * ROOMS_GRID_COL_SIZE + 2 * GRID_EDGE - (ROOMS_GRID_COL_SIZE - ROOM_BTN_SIZE_X);
            ScrollTotalSizeX = ScrollBox.w;
            ScrollTotalSizeY = GRID_EDGE;
            RoomListIterator(function(b, c, d, e) {
                c + ROOMS_GRID_ROW_SIZE > ScrollTotalSizeY && (ScrollTotalSizeY = c + ROOMS_GRID_ROW_SIZE)
            });
            300 > Canvas.width - (ScrollBox.x + ScrollBox.w) && (ScrollBox.x = Canvas.width - ScrollBox.w - 300);
            ScrollBox.x = Canvas.width / 2 - ScrollBox.w / 2;
            ScrollStepX = ROOMS_GRID_COL_SIZE;
            ScrollStepY = ROOMS_GRID_ROW_SIZE;
            ScrollTranspEdges = 15;
            ResizeScrollBtn(!1)
        },
        drawback: function(a, b) {
            var c = String(NIKA.CLASSROOMS_TITLE_STR).toLowerCase();
            c = c.charAt(0).toUpperCase() + c.slice(1);
            DrawBackGeneralTab(a, b);
            labels.title.caption = c;
            DrawTitleLesson(a)
        },
        drawscroll: function(a) {
            a.lineWidth = 2;
            a.fillStyle = "#FFFFFF";
            var b = 0;
            RoomListIterator(function(c, d, e, f) {
                b++;
                a.fillRect(c, d, e, ROOM_BTN_SIZE_Y);
                HLBtn == f ? (a.strokeStyle = BTN_HL_COLOR,
                a.drawImage(TEACHER_BUTTONS_HL[b % TEACHER_BUTTONS.length], 0, 0, 98, 51, c, d, e, ROOM_BTN_SIZE_Y)) : (a.strokeStyle = BASE_COLOR,
                a.drawImage(TEACHER_BUTTONS[b % TEACHER_BUTTONS.length], 0, 0, 98, 51, c, d, e, ROOM_BTN_SIZE_Y));
                a.strokeRect(c, d, e, ROOM_BTN_SIZE_Y)
            });
            a.font = "bold 22px Arial";
            a.textAlign = "center";
            a.textBaseline = "top";
            a.fillStyle = BTN_TEXT_COLOR;
            RoomListIterator(function(c, d, e, f) {
                a.fillText(NIKA.ROOMS_SHORT[f], c + e / 2, d + ROOM_BTN_SIZE_Y / 2 - 10)
            })
        },
        getbtn: function(a) {
            if (a.x < GRID_EDGE || a.y < GRID_EDGE || a.x > ScrollTotalSizeX - GRID_EDGE || a.y > ScrollTotalSizeY - GRID_EDGE + 20)
                return -1;
            var b = -1;
            RoomListIterator(function(c, d, e, f) {
                a.x >= c && a.y >= d && a.x < c + e && a.y < d + ROOM_BTN_SIZE_Y && (b = f)
            });
            return b
        },
        clickbtn: function() {
            -1 != HLBtn && (CurrRoom = HLBtn,
            GetCurrMonday(new Date),
            RoomScrollPosY = ScrollPosY,
            "any_room" == CurrRoom ? GotoTab("freeroomsched") : GotoTab("roomsched"))
        }
    },
    roomsched: {
        BackTab: "classrooms",
        init: function() {
            InitGeneralTab();
            labels.period.v = !0;
            SetRoomWeek(0)
        },
        resize: function(a) {
            ResizeGeneralTab(a, !1);
            TS_FIRST_COL_SIZE_X = Math.round(.9 * TS_COL_SIZE_X);
            TS_FIRST_ROW_SIZE_Y = Math.round(.9 * TS_ROW_SIZE_Y);
            ScrollTotalSizeX = TS_FIRST_COL_SIZE_X + TS_COL_SIZE_X * CurrentWeekDays + 1;
            ScrollTotalSizeY = TS_FIRST_ROW_SIZE_Y + TS_ROW_SIZE_Y * NIKA.LESSONSINDAY + 1;
            NIKA.FIRSTLESSONNUM || (ScrollTotalSizeY += TS_ROW_SIZE_Y);
            ScrollStepX = TS_COL_SIZE_X;
            ScrollStepY = TS_ROW_SIZE_Y;
            ScrollBox.w = Math.round(Canvas.width - 450 + 307 * (a - 1));
            ScrollBox.w > ScrollTotalSizeX && (ScrollBox.w = ScrollTotalSizeX);
            ScrollBox.x = Canvas.width / 2 - ScrollBox.w / 2;
            ScrollBox.y = TOP_HEIGHT + 124;
            ScrollBox.h = Canvas.height - ScrollBox.y - BOTTOM_HEIGHT - 30;
            ScrollBox.h > ScrollTotalSizeY && (ScrollBox.h = ScrollTotalSizeY);
            labels.period.x = ScrollBox.x + ScrollBox.w / 2;
            ScrollTranspEdges = 0;
            ExchangesExist && (btns.arrow_left.x = ScrollBox.x - 87,
            btns.arrow_left.y = ScrollBox.y + ScrollBox.h / 2,
            btns.arrow_right.x = ScrollBox.x + ScrollBox.w + 20,
            btns.arrow_right.y = btns.arrow_left.y,
            labels.prev_week_ln1.x = ScrollBox.x - 110,
            labels.prev_week_ln1.y = btns.arrow_left.y - 30,
            labels.prev_week_ln2.x = ScrollBox.x - 110,
            labels.prev_week_ln2.y = btns.arrow_left.y - 10,
            labels.next_week_ln1.x = btns.arrow_right.x,
            labels.next_week_ln1.y = btns.arrow_right.y - 30,
            labels.next_week_ln2.x = btns.arrow_right.x,
            labels.next_week_ln2.y = btns.arrow_right.y - 10);
            ResizeScrollBtn(!0)
        },
        drawback: function(a, b) {
            var c = GetWeekTimetableCaption();
            DrawBackGeneralTab(a, b);
            labels.title.caption = c;
            DrawTitleLesson(a);
            DrawTitleRoom(a, b)
        },
        drawscroll: function(a) {
            a.textBaseline = "top";
            a.shadowOffsetX = 0;
            a.shadowOffsetY = 0;
            var b, c, d;
            var e = TS_FIRST_COL_SIZE_X;
            let f = new Date(CurrMonday);
            for (var g = 0; 7 > g; g++) {
                var m = f.getDay() || 7
                  , h = GetPeriod(f)
                  , u = CurrWeekNum;
                const q = DateAsStr(f);
                let y = (b = Holidays[q]) && "vacation" == b.type;
                b && "transfer" == b.type && (m = b.daynum,
                b.weeknum && (u = b.weeknum),
                h = b.period);
                if (m > NIKA.WEEKDAYNUM)
                    f.setDate(f.getDate() + 1);
                else {
                    function w(n, k, x) {
                        a.font = k + " 18px Arial";
                        a.measureText(x).width > TS_COL_SIZE_X - 40 && (a.font = k + " 16px Arial");
                        a.measureText(x).width > TS_COL_SIZE_X - 40 && (a.font = k + " 14px Arial");
                        a.measureText(x).width > TS_COL_SIZE_X - 40 && (a.font = k + " 12px Arial");
                        a.measureText(x).width > TS_COL_SIZE_X - 40 && (x = x.substr(0, 28) + "...");
                        a.fillStyle = ShowExchangesTerm && v ? TS_EXCHANGE_COLOR : n;
                        FreeRoom ? StrikeOutFreeLsn && (a.fillText(x, e + TS_COL_SIZE_X / 2, t),
                        a.strokeStyle = TS_EXCHANGE_COLOR,
                        a.strokeRect(e + TS_COL_SIZE_X / 2 - a.measureText(x).width / 2, t + 10, a.measureText(x).width, 1)) : a.fillText(x, e + TS_COL_SIZE_X / 2, t);
                        t += 20
                    }
                    MakeBaseRoomSchedule(CurrRoom, h);
                    MakeExchangesRoomSchedule(CurrRoom, h, u, m, q);
                    b = TS_FIRST_ROW_SIZE_Y;
                    a.textAlign = "center";
                    for (var p = NIKA.FIRSTLESSONNUM; p <= NIKA.LESSONSINDAY; p++) {
                        let n = m.toString() + addZero(p);
                        FreeRoom = !1;
                        var r = d = c = "";
                        var t = b + 10;
                        var v = !1;
                        a.fillStyle = p & 1 ^ g & 1 ? TS_CELL_COLOR2 : TS_CELL_COLOR1;
                        a.fillRect(e, b, TS_COL_SIZE_X, TS_ROW_SIZE_Y);
                        if (!y) {
                            if (window.NIKA.ROOM_EXCHANGE && window.NIKA.ROOM_EXCHANGE[CurrRoom] && window.NIKA.ROOM_EXCHANGE[CurrRoom][q] && window.NIKA.ROOM_EXCHANGE[CurrRoom][q][p] && (v = !0,
                            FreeRoom = "F" == NIKA.ROOM_EXCHANGE[CurrRoom][q][p].s,
                            !FreeRoom)) {
                                for (var l in NIKA.ROOM_EXCHANGE[CurrRoom][q][p].c)
                                    c && (c += ", "),
                                    c += NIKA.CLASSES[NIKA.ROOM_EXCHANGE[CurrRoom][q][p].c[l]];
                                0 < NIKA.ROOM_EXCHANGE[CurrRoom][q][p].t.length && (d = NIKA.TEACHERS[NIKA.ROOM_EXCHANGE[CurrRoom][q][p].t[0]]);
                                1 == NIKA.ROOM_EXCHANGE[CurrRoom][q][p].s.length && (r = NIKA.SUBJECTS[NIKA.ROOM_EXCHANGE[CurrRoom][q][p].s[0]])
                            }
                            if (!v || FreeRoom)
                                for (; ; )
                                    if (window.NIKA.ROOM_SCHEDULE[h] && window.NIKA.ROOM_SCHEDULE[h][CurrRoom] && window.NIKA.ROOM_SCHEDULE[h][CurrRoom][n]) {
                                        for (l in NIKA.ROOM_SCHEDULE[h][CurrRoom][n].c)
                                            c && (c += ", "),
                                            c += NIKA.CLASSES[NIKA.ROOM_SCHEDULE[h][CurrRoom][n].c[l]];
                                        0 < NIKA.ROOM_SCHEDULE[h][CurrRoom][n].t.length && (d = NIKA.TEACHERS[NIKA.ROOM_SCHEDULE[h][CurrRoom][n].t[0]]);
                                        1 == NIKA.ROOM_SCHEDULE[h][CurrRoom][n].s.length && (r = NIKA.SUBJECTS[NIKA.ROOM_SCHEDULE[h][CurrRoom][n].s[0]]);
                                        break
                                    } else if (0 < u && 3 == n.length)
                                        n = u.toString() + n;
                                    else
                                        break;
                            c && (c && w(SCHED_FONT_COLOR, "bold", c),
                            d && w(SCHED_GROUP_COLOR, "italic", d),
                            r && w(SCHED_FONT_COLOR, "bold", r))
                        }
                        b += TS_ROW_SIZE_Y
                    }
                    f.setDate(f.getDate() + 1);
                    e += TS_COL_SIZE_X
                }
            }
            a.translate(0, ScrollPosY);
            a.fillStyle = "#FFFFFF";
            a.fillRect(0, 0, ScrollTotalSizeX, TS_FIRST_ROW_SIZE_Y);
            a.translate(0, -ScrollPosY);
            f = new Date(CurrMonday);
            a.translate(0, ScrollPosY);
            e = TS_FIRST_COL_SIZE_X;
            for (l = 0; 7 > l; l++)
                g = f.getDay() || 7,
                m = DateAsStr(f),
                u = (h = Holidays[m]) && "vacation" == h.type,
                h && "transfer" == h.type && (g = h.daynum),
                g > NIKA.WEEKDAYNUM ? f.setDate(f.getDate() + 1) : (a.fillStyle = l & 1 ? TS_TITLE_COLOR2 : TS_TITLE_COLOR1,
                a.fillRect(e, 0, TS_COL_SIZE_X, TS_FIRST_ROW_SIZE_Y),
                a.fillStyle = u ? VACATION_FONT_COLOR : BTN_TEXT_COLOR,
                a.font = "bold 22px Arial, sans-serif",
                a.textAlign = "center",
                a.fillText(NIKA.DAY_NAMESH[l], e + TS_COL_SIZE_X / 2, 14),
                a.font = "normal 16px Arial",
                a.fillStyle = u ? VACATION_FONT_COLOR : GRAY_TEXT_COLOR,
                a.fillText(m, e + TS_COL_SIZE_X / 2, TS_FIRST_ROW_SIZE_Y - 24),
                window.NIKA.ROOM_EXCHANGE && window.NIKA.ROOM_EXCHANGE[CurrRoom] && window.NIKA.ROOM_EXCHANGE[CurrRoom][m] && (a.strokeStyle = TS_EXCHANGE_COLOR_TITLE,
                a.lineWidth = 2,
                a.strokeRect(e + 1, 2, TS_COL_SIZE_X - 4, TS_FIRST_ROW_SIZE_Y - 2)),
                f.setDate(f.getDate() + 1),
                e += TS_COL_SIZE_X);
            a.translate(0, -ScrollPosY);
            a.translate(ScrollPosX, 0);
            a.fillStyle = "#FFFFFF";
            a.fillRect(0, 0, TS_FIRST_COL_SIZE_X, ScrollTotalSizeY);
            b = TS_FIRST_ROW_SIZE_Y;
            for (p = NIKA.FIRSTLESSONNUM; p <= NIKA.LESSONSINDAY; p++)
                a.fillStyle = p & 1 ? TS_TITLE_COLOR1 : TS_TITLE_COLOR2,
                a.fillRect(0, b, TS_FIRST_COL_SIZE_X, TS_ROW_SIZE_Y),
                a.fillStyle = BTN_TEXT_COLOR,
                a.font = "bold 22px Arial, sans-serif",
                a.textAlign = "center",
                a.fillText(p.toString() + " " + NIKA.LESSON_STR, TS_FIRST_COL_SIZE_X / 2, b + 14),
                a.textAlign = "center",
                a.fillStyle = GRAY_TEXT_COLOR,
                a.font = "normal 16px Arial, sans-serif",
                a.fillText(NIKA.LESSON_TIMES[p][0] + " - " + NIKA.LESSON_TIMES[p][1], TS_FIRST_COL_SIZE_X / 2, b + 42),
                b += TS_ROW_SIZE_Y;
            a.translate(-ScrollPosX, 0);
            a.translate(ScrollPosX, ScrollPosY);
            a.fillStyle = TS_TITLE_COLOR2;
            a.fillRect(0, 0, TS_FIRST_COL_SIZE_X, TS_FIRST_ROW_SIZE_Y);
            a.translate(-ScrollPosX, -ScrollPosY)
        },
        getbtn: function(a) {
            return -1
        },
        toPrev: function() {
            SetRoomWeek(-7);
            window.onresize()
        },
        toNext: function() {
            SetRoomWeek(7);
            window.onresize()
        }
    },
    freeroomsched: {
        BackTab: "classrooms",
        init: function() {
            InitGeneralTab();
            labels.period.v = !0;
            SetRoomWeek(0);
            CS_BusyDay = []
        },
        resize: function(a) {
            ResizeGeneralTab(a, !1);
            ScrollBox.y = TOP_HEIGHT + 124;
            ScrollBox.w = Math.round(Canvas.width - 450 + 307 * (a - 1));
            ScrollBox.h = Canvas.height - ScrollBox.y - BOTTOM_HEIGHT - 30;
            for (ClassSchedColCount = 3; 1 < ClassSchedColCount; ) {
                RealDayDistanceX = CS_MAX_DAY_DISTANCE;
                ScrollTotalSizeX = ClassSchedColCount * CS_DAY_WIDTH + (ClassSchedColCount - 1) * RealDayDistanceX;
                ScrollBox.w < ScrollTotalSizeX && (RealDayDistanceX = Math.round((ScrollBox.w - 20 - ClassSchedColCount * CS_DAY_WIDTH) / (ClassSchedColCount - 1)),
                RealDayDistanceX < CS_MIN_DAY_DISTANCE && (RealDayDistanceX = CS_MIN_DAY_DISTANCE),
                ScrollTotalSizeX = ClassSchedColCount * CS_DAY_WIDTH + (ClassSchedColCount - 1) * RealDayDistanceX);
                if (ScrollBox.w >= ScrollTotalSizeX) {
                    ScrollBox.w = ScrollTotalSizeX;
                    break
                }
                ClassSchedColCount--
            }
            ScrollBox.x = Canvas.width / 2 - ScrollBox.w / 2;
            for (var b = a = Math.ceil(CurrentWeekDays / ClassSchedColCount), c = CS_ADD_BOX_HEIGHT + MaxLessonCount * CS_ROW_SIZE_Y; ; )
                if (1 < b)
                    if (RealDayDistanceY = Math.round((ScrollBox.h - b * c) / (b - 1)),
                    RealDayDistanceY < CS_MIN_DAY_DISTANCE)
                        b--;
                    else
                        break;
                else {
                    RealDayDistanceY = CS_MIN_DAY_DISTANCE;
                    break
                }
            RealDayDistanceY > CS_MAX_DAY_DISTANCE && (RealDayDistanceY = CS_MAX_DAY_DISTANCE);
            ScrollTotalSizeY = a * c + (a - 1) * RealDayDistanceY;
            ScrollBox.h > ScrollTotalSizeY && (ScrollBox.h = ScrollTotalSizeY);
            ScrollStepX = CS_DAY_WIDTH;
            ScrollStepY = c + RealDayDistanceY;
            labels.period.x = ScrollBox.x + ScrollBox.w / 2;
            ScrollTranspEdges = 0;
            ExchangesExist && (btns.arrow_left.x = ScrollBox.x - 87,
            btns.arrow_left.y = ScrollBox.y + ScrollBox.h / 2,
            btns.arrow_right.x = ScrollBox.x + ScrollBox.w + 20,
            btns.arrow_right.y = btns.arrow_left.y,
            labels.prev_week_ln1.x = ScrollBox.x - 110,
            labels.prev_week_ln1.y = btns.arrow_left.y - 30,
            labels.prev_week_ln2.x = ScrollBox.x - 110,
            labels.prev_week_ln2.y = btns.arrow_left.y - 10,
            labels.next_week_ln1.x = btns.arrow_right.x,
            labels.next_week_ln1.y = btns.arrow_right.y - 30,
            labels.next_week_ln2.x = btns.arrow_right.x,
            labels.next_week_ln2.y = btns.arrow_right.y - 10);
            ResizeScrollBtn(!0)
        },
        drawback: function(a, b) {
            DrawBackGeneralTab(a, b);
            labels.title.caption = NIKA.FREE_ROOM_STR;
            DrawTitleLesson(a)
        },
        drawscroll: function(a) {
            function b(p, r, t) {
                a.font = r + " 12px Arial, sans-serif";
                a.fillStyle = p;
                p = CS_DAY_WIDTH - 64;
                r = d + e + 8;
                if ("string" === typeof t)
                    a.fillText(t, c + CS_LEFT_SHIFT + 22, r);
                else if (0 !== t.length) {
                    if (1 === t.length) {
                        var v = NIKA.ROOMS[t[0]];
                        if (a.measureText(v).width > p)
                            for (var l = v.length; 0 < l; l--) {
                                var q = v.substring(0, l) + "...";
                                if (a.measureText(q).width <= p) {
                                    a.fillText(q, c + CS_LEFT_SHIFT + 22, r);
                                    return
                                }
                            }
                        else {
                            a.fillText(v, c + CS_LEFT_SHIFT + 22, r);
                            return
                        }
                    }
                    v = NIKA.ROOMS[t[0]];
                    for (l = 1; l < t.length; ) {
                        q = v + ", " + NIKA.ROOMS[t[l]];
                        if (a.measureText(q + "...").width > p) {
                            v += "...";
                            break
                        }
                        v = q;
                        l++
                    }
                    a.fillText(v, c + CS_LEFT_SHIFT + 22, r)
                }
            }
            a.textBaseline = "top";
            a.shadowOffsetX = 0;
            a.shadowOffsetY = 0;
            let c = 0, d = 0, e;
            var f;
            let g = CS_ADD_BOX_HEIGHT + MaxLessonCount * CS_ROW_SIZE_Y
              , m = new Date(CurrMonday);
            for (let p = 0; 7 > p; p++) {
                var h = GetPeriod(m);
                const r = DateAsStr(m);
                let t = (f = Holidays[r]) && "vacation" == f.type
                  , v = p + 1;
                var u = CurrWeekNum;
                f && "transfer" == f.type && (v = f.daynum,
                f.weeknum && (u = f.weeknum),
                h = f.period);
                if (!(v > NIKA.WEEKDAYNUM)) {
                    MakeFreeRoomSchedule(h, u, v, r);
                    f = !0;
                    a.drawImage(DayLineImg, c, d, DayLineImg.width, g);
                    a.drawImage(DayBoxImg, c + 4, d - .035 * g, CS_DAY_WIDTH, 1.12 * g);
                    CS_BusyDay[p + 1] = new Date(m);
                    a.font = "bold 18px Arial";
                    a.textAlign = "center";
                    a.fillStyle = t ? VACATION_FONT_COLOR : BTN_TEXT_COLOR;
                    a.fillText(NIKA.DAY_NAMES[p], c + CS_DAY_WIDTH / 2, d + 18);
                    a.font = "normal 14px Arial, sans-serif";
                    a.fillStyle = t ? VACATION_FONT_COLOR : SCHED_FONT_COLOR;
                    a.fillText("(" + m.getDate() + " " + NIKA.MONTHS2[m.getMonth()] + ")", c + CS_DAY_WIDTH / 2, d + 40);
                    e = 60;
                    a.textAlign = "left";
                    for (h = MinFirstLessonNum; h <= MinFirstLessonNum + MaxLessonCount - 1; h++)
                        if (!t) {
                            f && (f = getLessonTimeForDay(v, h),
                            a.fillStyle = SCHED_GROUP_COLOR,
                            a.strokeStyle = SCHED_GROUP_COLOR,
                            a.font = "underline 12px Arial, sans-serif",
                            a.fillText(f[0], c + CS_LEFT_SHIFT, d + e - 1),
                            a.fillRect(c + CS_LEFT_SHIFT, d + e + 12, a.measureText(f[0]).width, 1),
                            e += CS_ROW_SIZE_Y - 14,
                            f = !1);
                            a.fillStyle = BTN_TEXT_COLOR;
                            a.font = "normal 16px Arial, sans-serif";
                            a.fillText(h + ".", c + CS_LEFT_SHIFT, d + e + 5);
                            if (NIKA.FREE_ROOMS && NIKA.FREE_ROOMS[r] && NIKA.FREE_ROOMS[r][h]) {
                                u = NIKA.FREE_ROOMS[r][h].r;
                                let l = NIKA.FREE_ROOMS[r][h].a;
                                0 === u.length ? b(VACATION_FONT_COLOR, "normal", NIKA.ALL_BUSY_ROOMS_STR) : l ? b(FREE_ROOM_FONT_COLOR, "normal", NIKA.ALL_FREE_ROOMS_STR) : b(FREE_ROOM_FONT_COLOR, "normal", u)
                            }
                            e += CS_ROW_SIZE_Y
                        }
                    c += CS_DAY_WIDTH + RealDayDistanceX;
                    0 == (p + 1) % ClassSchedColCount && (d += RealDayDistanceY + g,
                    c = 0)
                }
                m.setDate(m.getDate() + 1)
            }
        },
        toPrev: function() {
            SetRoomWeek(-7);
            window.onresize()
        },
        toNext: function() {
            SetRoomWeek(7);
            window.onresize()
        },
        getbtn: function() {
            return -1
        }
    }
};
function GetClassNum(a) {
    if (window.NIKA.CLASS_COURSES)
        return Number(NIKA.CLASS_COURSES[a]);
    let b = new String;
    a = NIKA.CLASSES[a];
    for (let c = 0; c < a.length; c++)
        "0123456789".indexOf(a.charAt(c)) + 1 && (b += a.charAt(c));
    return Number(b)
}
function ClassListIterator(a) {
    let b = GRID_EDGE, c = GRID_EDGE, d = -1, e;
    for (let f = 0; f < classes.length; f++) {
        let g = classes[f];
        e = GetClassNum(g);
        d != e && -1 != d ? (d = e,
        void 0 != NIKA.VERTICAL_CLASSES && NIKA.VERTICAL_CLASSES ? (b = GRID_EDGE,
        c += CLASS_GRID_ROW_SIZE) : (b += CLASS_GRID_COL_SIZE,
        c = GRID_EDGE)) : -1 == d && (d = e);
        a(b, c, g);
        void 0 != NIKA.VERTICAL_CLASSES && NIKA.VERTICAL_CLASSES ? b += CLASS_GRID_COL_SIZE : c += CLASS_GRID_ROW_SIZE
    }
}
function TeacherListIterator(a) {
    let b = GRID_EDGE
      , c = GRID_EDGE
      , d = 0;
    for (let e = 0; e < teachers.length; e++) {
        let f = teachers[e];
        d++;
        d > MaxTeachColumns && (d = 1,
        b = GRID_EDGE,
        c += TEACHERS_GRID_ROW_SIZE);
        a(b, c, f);
        b += TEACHERS_GRID_COL_SIZE
    }
}
function RoomListIterator(a) {
    let b = GRID_EDGE
      , c = GRID_EDGE
      , d = 0;
    a(b, c, SEARCH_ROOM_BTN_SIZE_X, "any_room");
    c += ROOMS_GRID_ROW_SIZE;
    for (let e = 1; e < rooms.length; e++) {
        let f = rooms[e];
        d++;
        d > MaxRoomColumns && (d = 1,
        b = GRID_EDGE,
        c += ROOMS_GRID_ROW_SIZE);
        a(b, c, ROOM_BTN_SIZE_X, f);
        b += ROOMS_GRID_COL_SIZE
    }
}
function GetCurrMonday(a) {
    CurrMonday = new Date(a);
    for (CurrMonday.setHours(0, 0, 0, 0); 1 < CurrMonday.getDay(); )
        CurrMonday.setDate(CurrMonday.getDate() - 1);
    for (; 1 > CurrMonday.getDay(); )
        CurrMonday.setDate(CurrMonday.getDate() + 1)
}
function GetCurrWeekNum(a) {
    window.NIKA.DUALWEEK && -1 != a && window.NIKA.PERIODS[a] && window.NIKA.PERIODS[a].fwm ? (a = new Date(Number(NIKA.PERIODS[a].fwm.substr(6, 4)),Number(NIKA.PERIODS[a].fwm.substr(3, 2)) - 1,Number(NIKA.PERIODS[a].fwm.substr(0, 2))),
    CurrWeekNum = (parseInt(Math.abs((CurrMonday - a) / 864E5).toFixed(0) / 7, 10) & 1) + 1) : CurrWeekNum = 0
}
function SetTeacherWeek(a) {
    function b(g) {
        let m = Object.keys(window.NIKA.TEACH_EXCHANGE[CurrTeacher]);
        for (let h = 0; h < m.length; h++)
            if (StrAsDate(m[h]).getMonth() == g.getMonth())
                return g;
        return -1
    }
    a && (CurrMonday.setDate(CurrMonday.getDate() + a),
    FadeAnim = 5);
    btns.arrow_left.v = ExchangesExist;
    btns.arrow_right.v = ExchangesExist;
    labels.prev_week_ln1.v = ExchangesExist;
    labels.prev_week_ln2.v = ExchangesExist;
    labels.next_week_ln1.v = ExchangesExist;
    labels.next_week_ln2.v = ExchangesExist;
    btns.changes.v = !1;
    labels.change_ln1.v = !1;
    labels.change_ln2.v = !1;
    if (ExchangesExist && window.NIKA.TEACH_EXCHANGE && window.NIKA.TEACH_EXCHANGE[CurrTeacher]) {
        var c = new Date(CurrMonday);
        c.setDate(c.getDate() + 5);
        a = b(c);
        -1 == a && (a = b(CurrMonday));
        -1 != a && (StartCalendarDate = new Date(a.getFullYear(),a.getMonth(),1),
        btns.changes.v = !0,
        labels.change_ln2.caption = "RUS" == LangId ? String(void 0 == NIKA.IN_STR ? "\u0432" : NIKA.IN_STR).toLowerCase() + " " : String(void 0 == NIKA.IN_STR ? "in" : NIKA.IN_STR).toLowerCase() + " ",
        labels.change_ln2.caption = void 0 == NIKA.MONTHS3 ? labels.change_ln2.caption + String(MONTHS3_STR[a.getMonth()]).toLowerCase() : labels.change_ln2.caption + String(NIKA.MONTHS3[a.getMonth()]).toLowerCase(),
        labels.change_ln1.v = !0,
        labels.change_ln2.v = !0)
    }
    a = GetPeriod(CurrMonday);
    var d = 1;
    for (c = new Date(CurrMonday); -1 == a && 6 > d; )
        c.setDate(c.getDate() + 1),
        a = GetPeriod(c),
        d++;
    CurrentWeekDays = 0;
    c = new Date(CurrMonday);
    for (d = 0; 7 > d; d++) {
        let g = c.getDay() || 7;
        var e = DateAsStr(c);
        (e = Holidays[e]) && "transfer" == e.type && (g = e.daynum);
        g > NIKA.WEEKDAYNUM || CurrentWeekDays++;
        c.setDate(c.getDate() + 1)
    }
    GetCurrWeekNum(a);
    -1 != a ? (c = NIKA.PERIOD_STR,
    "\u043d\u0430 " == c.substr(0, 3) && (c = c.substr(3, c.length)),
    labels.period.caption = c + "   " + NIKA.PERIODS[a].name) : labels.period.caption = "";
    CurrTeachSubject = "";
    if (window.NIKA.TEACH_SCHEDULE[a] && window.NIKA.TEACH_SCHEDULE[a][CurrTeacher])
        for (var f in NIKA.TEACH_SCHEDULE[a][CurrTeacher])
            if ("M" != NIKA.TEACH_SCHEDULE[a][CurrTeacher][f].s)
                if (!CurrTeachSubject)
                    CurrTeachSubject = NIKA.SUBJECTS[NIKA.TEACH_SCHEDULE[a][CurrTeacher][f].s];
                else if (CurrTeachSubject != NIKA.SUBJECTS[NIKA.TEACH_SCHEDULE[a][CurrTeacher][f].s]) {
                    CurrTeachSubject = "";
                    break
                }
}
function SetClassWeek(a) {
    function b(g) {
        let m = Object.keys(window.NIKA.CLASS_EXCHANGE[CurrClass]);
        for (let h = 0; h < m.length; h++)
            if (StrAsDate(m[h]).getMonth() == g.getMonth())
                return g;
        return -1
    }
    a && (CurrMonday.setDate(CurrMonday.getDate() + a),
    FadeAnim = 5);
    btns.arrow_left.v = ExchangesExist;
    btns.arrow_right.v = ExchangesExist;
    labels.prev_week_ln1.v = ExchangesExist;
    labels.prev_week_ln2.v = ExchangesExist;
    labels.next_week_ln1.v = ExchangesExist;
    labels.next_week_ln2.v = ExchangesExist;
    btns.changes.v = !1;
    labels.change_ln1.v = !1;
    labels.change_ln2.v = !1;
    ExchangesExist && window.NIKA.CLASS_EXCHANGE && window.NIKA.CLASS_EXCHANGE[CurrClass] && (a = new Date(CurrMonday),
    a.setDate(a.getDate() + 5),
    a = b(a),
    -1 == a && (a = b(CurrMonday)),
    -1 != a && (StartCalendarDate = new Date(a.getFullYear(),a.getMonth(),1),
    btns.changes.v = !0,
    labels.change_ln2.caption = "RUS" == LangId ? String(void 0 == NIKA.IN_STR ? "\u0432" : NIKA.IN_STR).toLowerCase() + " " : String(void 0 == NIKA.IN_STR ? "in" : NIKA.IN_STR).toLowerCase() + " ",
    labels.change_ln2.caption = void 0 == NIKA.MONTHS3 ? labels.change_ln2.caption + String(MONTHS3_STR[a.getMonth()]).toLowerCase() : labels.change_ln2.caption + String(NIKA.MONTHS3[a.getMonth()]).toLowerCase(),
    labels.change_ln1.v = !0,
    labels.change_ln2.v = !0));
    var c = GetPeriod(CurrMonday);
    a = new Date(CurrMonday);
    if (-1 == c) {
        for (var d = 1; -1 == c && 6 > d; )
            a.setDate(a.getDate() + 1),
            c = GetPeriod(a),
            d++;
        a = new Date(CurrMonday)
    }
    GetCurrWeekNum(c);
    -1 != c ? (d = NIKA.PERIOD_STR,
    "\u043d\u0430 " == d.substr(0, 3) && (d = d.substr(3, d.length)),
    labels.period.caption = d + "   " + NIKA.PERIODS[c].name) : labels.period.caption = "";
    MaxLessonCount = 1;
    MinFirstLessonNum = NIKA.LESSONSINDAY;
    CurrentWeekDays = 0;
    for (d = 0; 7 > d; d++) {
        let g = a.getDay() || 7;
        var e = DateAsStr(a);
        (e = Holidays[e]) && "transfer" == e.type && (g = e.daynum);
        if (g > NIKA.WEEKDAYNUM)
            a.setDate(a.getDate() + 1);
        else {
            FirstLessonNum = LastLessonNum = -1;
            CurrentWeekDays++;
            for (var f = NIKA.FIRSTLESSONNUM; f <= NIKA.LESSONSINDAY; f++)
                if (window.NIKA.CLASS_EXCHANGE && window.NIKA.CLASS_EXCHANGE[CurrClass] && window.NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(a)] && window.NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(a)][f] && "F" != window.NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(a)][f].s[0]) {
                    if (-1 == FirstLessonNum || FirstLessonNum > f)
                        FirstLessonNum = f;
                    if (-1 == LastLessonNum || LastLessonNum < f)
                        LastLessonNum = f;
                    MaxLessonCount = Math.max(MaxLessonCount, LastLessonNum - FirstLessonNum + 1)
                } else
                    for (e = g.toString() + addZero(f); ; )
                        if (window.NIKA.CLASS_SCHEDULE[c] && window.NIKA.CLASS_SCHEDULE[c][CurrClass] && window.NIKA.CLASS_SCHEDULE[c][CurrClass][e]) {
                            if (-1 == FirstLessonNum || FirstLessonNum > f)
                                FirstLessonNum = f;
                            if (-1 == LastLessonNum || LastLessonNum < f)
                                LastLessonNum = f;
                            MaxLessonCount = Math.max(MaxLessonCount, LastLessonNum - FirstLessonNum + 1);
                            break
                        } else if (0 < CurrWeekNum && 3 == e.length)
                            e = CurrWeekNum.toString() + e;
                        else
                            break;
            FirstLessonNum < MinFirstLessonNum && -1 != FirstLessonNum && (MinFirstLessonNum = FirstLessonNum);
            a.setDate(a.getDate() + 1);
            c = GetPeriod(a)
        }
    }
    c = GetPeriod(CurrMonday);
    SecondShiftNum = 1;
    window.NIKA.CLASS_SHIFT && window.NIKA.CLASS_SHIFT[c] && window.NIKA.CLASS_SHIFT[c][CurrClass] && (SecondShiftNum = window.NIKA.CLASS_SHIFT[c][CurrClass]);
    CurrSecondShiftStr = "";
    1 < SecondShiftNum && (CurrSecondShiftStr = "(*" + NIKA.SECOND_SHIFT_STR + ")")
}
function SetRoomWeek(a) {
    a && (CurrMonday.setDate(CurrMonday.getDate() + a),
    FadeAnim = 5);
    btns.arrow_left.v = ExchangesExist;
    btns.arrow_right.v = ExchangesExist;
    labels.prev_week_ln1.v = ExchangesExist;
    labels.prev_week_ln2.v = ExchangesExist;
    labels.next_week_ln1.v = ExchangesExist;
    labels.next_week_ln2.v = ExchangesExist;
    btns.changes.v = !1;
    labels.change_ln1.v = !1;
    labels.change_ln2.v = !1;
    a = GetPeriod(CurrMonday);
    var b = 1;
    for (dat = new Date(CurrMonday); -1 == a && 6 > b; )
        dat.setDate(dat.getDate() + 1),
        a = GetPeriod(dat),
        b++;
    CurrentWeekDays = 0;
    dat = new Date(CurrMonday);
    for (b = 0; 7 > b; b++) {
        var c = dat.getDay() || 7
          , d = DateAsStr(dat);
        (d = Holidays[d]) && "transfer" == d.type && (c = d.daynum);
        c > NIKA.WEEKDAYNUM || CurrentWeekDays++;
        dat.setDate(dat.getDate() + 1)
    }
    GetCurrWeekNum(a);
    -1 != a ? (b = NIKA.PERIOD_STR,
    "\u043d\u0430 " == b.substr(0, 3) && (b = b.substr(3, b.length)),
    labels.period.caption = b + "   " + NIKA.PERIODS[a].name) : labels.period.caption = "";
    MaxLessonCount = 1;
    MinFirstLessonNum = NIKA.LESSONSINDAY;
    CurrentWeekDays = 0;
    dat = new Date(CurrMonday);
    for (b = 0; 7 > b; b++) {
        d = dat.getDay() || 7;
        c = DateAsStr(dat);
        const e = Holidays[c];
        a = GetPeriod(dat);
        let f = CurrWeekNum;
        e && "transfer" == e.type && (d = e.daynum);
        if (d > NIKA.WEEKDAYNUM)
            dat.setDate(dat.getDate() + 1);
        else {
            MakeFreeRoomSchedule(a, f, d, c);
            FirstLessonNum = LastLessonNum = -1;
            CurrentWeekDays++;
            for (a = NIKA.FIRSTLESSONNUM; a <= NIKA.LESSONSINDAY; a++)
                if (NIKA.FREE_ROOMS && NIKA.FREE_ROOMS[c] && NIKA.FREE_ROOMS[c][a] && 1 != NIKA.FREE_ROOMS[c][a].a) {
                    if (-1 == FirstLessonNum || FirstLessonNum > a)
                        FirstLessonNum = a;
                    if (-1 == LastLessonNum || LastLessonNum < a)
                        LastLessonNum = a;
                    MaxLessonCount = Math.max(MaxLessonCount, LastLessonNum - FirstLessonNum + 1)
                }
            FirstLessonNum < MinFirstLessonNum && -1 != FirstLessonNum && (MinFirstLessonNum = FirstLessonNum);
            dat.setDate(dat.getDate() + 1);
            GetPeriod(dat)
        }
    }
}
function SetMonth(a) {
    btns.arrow_left.v = !0;
    btns.arrow_right.v = !0;
    labels.period.caption = "RUS" == LangId ? String(void 0 == NIKA.CHANGES_STR ? "\u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f" : NIKA.CHANGES_STR).toLowerCase() + " " + String(void 0 == NIKA.IN_STR ? "\u0432" : NIKA.IN_STR).toLowerCase() + " " + String(void 0 == NIKA.SCHEDULE2_STR ? "\u0440\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0438" : NIKA.SCHEDULE2_STR).toLowerCase() : String(void 0 == NIKA.CHANGES_STR ? "changes" : NIKA.CHANGES_STR).toLowerCase() + " " + String(void 0 == NIKA.IN_STR ? "in" : NIKA.IN_STR).toLowerCase() + " " + String(void 0 == NIKA.SCHEDULE2_STR ? "\u0440\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0438" : NIKA.SCHEDULE2_STR).toLowerCase();
    var b = StartCalendarDate.getMonth() + a;
    if (a) {
        for (-1 == b ? b = 11 : 12 == b && (b = 0); StartCalendarDate.getMonth() != b; )
            StartCalendarDate.setDate(StartCalendarDate.getDate() + 7 * a);
        FadeAnim = 5
    }
    labels.title.caption = NIKA.MONTHS[b] + "  " + StartCalendarDate.getFullYear();
    CalendarActualHeight = 2 * CL_FIRST_ROW_SIZE_Y + CL_ROW_SIZE_Y;
    for (a = new Date(StartCalendarDate.getFullYear(),StartCalendarDate.getMonth(),1); a.getMonth() == b; )
        7 == (a.getDay() || 7) && (CalendarActualHeight += CL_ROW_SIZE_Y),
        a.setDate(a.getDate() + 1)
}
function SetClassDay(a) {
    btns.arrow_left.v = !0;
    btns.arrow_right.v = !0;
    labels.prev_month_ln1.v = !0;
    labels.prev_day_ln2.v = !0;
    labels.next_month_ln1.v = !0;
    labels.next_day_ln2.v = !0;
    a && (CurrDay.setDate(CurrDay.getDate() + a),
    FadeAnim = 5);
    GetCurrMonday(CurrDay);
    LastLessonNum = FirstLessonNum = -1;
    a = GetPeriod(CurrDay);
    var b = CurrDay.getDay() || 7;
    GetCurrWeekNum(a);
    labels.period.caption = -1 != a ? NIKA.PERIOD_STR + "   " + NIKA.PERIODS[a].name : "";
    var c = DateAsStr(CurrDay);
    var d = Holidays[c];
    if (!d || "vacation" != d.type) {
        c = CurrWeekNum;
        d && "transfer" == d.type && (b = d.daynum,
        d.weeknum && (c = d.weeknum),
        a = d.period);
        for (var e = NIKA.FIRSTLESSONNUM; e <= NIKA.LESSONSINDAY; e++)
            if (window.NIKA.CLASS_EXCHANGE && window.NIKA.CLASS_EXCHANGE[CurrClass] && window.NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(CurrDay)] && window.NIKA.CLASS_EXCHANGE[CurrClass][DateAsStr(CurrDay)][e]) {
                if (-1 == FirstLessonNum || FirstLessonNum > e)
                    FirstLessonNum = e;
                if (-1 == LastLessonNum || LastLessonNum < e)
                    LastLessonNum = e
            } else
                for (d = b.toString() + addZero(e); ; )
                    if (window.NIKA.CLASS_SCHEDULE[a] && window.NIKA.CLASS_SCHEDULE[a][CurrClass] && window.NIKA.CLASS_SCHEDULE[a][CurrClass][d]) {
                        if (-1 == FirstLessonNum || FirstLessonNum > e)
                            FirstLessonNum = e;
                        if (-1 == LastLessonNum || LastLessonNum < e)
                            LastLessonNum = e;
                        break
                    } else if (0 < c && 3 == d.length)
                        d = c.toString() + d;
                    else
                        break;
        SecondShiftNum = 1;
        window.NIKA.CLASS_SHIFT && window.NIKA.CLASS_SHIFT[a] && window.NIKA.CLASS_SHIFT[a][CurrClass] && (SecondShiftNum = window.NIKA.CLASS_SHIFT[a][CurrClass]);
        CurrSecondShiftStr = "";
        1 < SecondShiftNum && (CurrSecondShiftStr = "(*" + NIKA.SECOND_SHIFT_STR + ")")
    }
}
function addZero(a) {
    a = a.toString();
    2 > a.length && (a = "0" + a);
    return a
}
function DateAsStr(a) {
    return addZero(a.getDate()) + "." + addZero(a.getMonth() + 1) + "." + a.getFullYear().toString()
}
function StrAsDate(a) {
    return new Date(a[6] + a[7] + a[8] + a[9],a[3] + a[4] - 1,a[0] + a[1])
}
function GetPeriod(a) {
    "undefined" === typeof NIKA.DATE_TO_PERIOD && (NIKA.DATE_TO_PERIOD = {});
    const b = DateAsStr(a);
    if ("undefined" !== typeof NIKA.DATE_TO_PERIOD[b])
        return NIKA.DATE_TO_PERIOD[b];
    var c = -1, d;
    for (d in NIKA.PERIODS) {
        var e = new Date(Number(NIKA.PERIODS[d].b.substr(6, 4)),Number(NIKA.PERIODS[d].b.substr(3, 2)) - 1,Number(NIKA.PERIODS[d].b.substr(0, 2)));
        var f = new Date(Number(NIKA.PERIODS[d].e.substr(6, 4)),Number(NIKA.PERIODS[d].e.substr(3, 2)) - 1,Number(NIKA.PERIODS[d].e.substr(0, 2)));
        if (a >= e && a <= f) {
            c = d;
            break
        }
    }
    return NIKA.DATE_TO_PERIOD[b] = c
}
function DrawCalendar(a, b) {
    var c = StartCalendarDate.getMonth();
    a.save();
    a.scale(ScrollBox.w / CL_MAX_WIDTH, ScrollBox.w / CL_MAX_WIDTH);
    a.fillStyle = "#FFFFFF";
    a.fillRect(0, 0, CL_MAX_WIDTH, CalendarActualHeight);
    a.fillStyle = GRID_LINE_COLOR;
    a.fillRect(0, 0, CL_MAX_WIDTH, CL_FIRST_ROW_SIZE_Y);
    a.fillRect(0, CalendarActualHeight - CL_FIRST_ROW_SIZE_Y, CL_MAX_WIDTH, CL_FIRST_ROW_SIZE_Y);
    a.font = "bold 24px Arial";
    a.textAlign = "center";
    a.textBaseline = "alphabetic";
    a.strokeStyle = GRID_LINE_COLOR;
    a.fillStyle = BTN_TEXT_COLOR;
    for (var d = 0; 7 >= d; d++)
        d && a.fillText(NIKA.DAY_NAMESH[d - 1], d * CL_ROW_SIZE_X - CL_ROW_SIZE_X / 2, CL_FIRST_ROW_SIZE_Y / 2 + 12),
        a.beginPath(),
        a.moveTo(d * CL_ROW_SIZE_X, CL_FIRST_ROW_SIZE_Y),
        a.lineTo(d * CL_ROW_SIZE_X, CalendarActualHeight - CL_FIRST_ROW_SIZE_Y),
        a.closePath(),
        a.stroke();
    a.font = "100 54px Arial, sans-serif";
    d = new Date(StartCalendarDate.getFullYear(),StartCalendarDate.getMonth(),1);
    let e = CL_FIRST_ROW_SIZE_Y, f;
    for (; d.getMonth() == c; ) {
        let g = d.getDay() || 7
          , m = 6 <= g || Holidays[DateAsStr(d)] && "vacation" == Holidays[DateAsStr(d)].type;
        m = m && !(Holidays[DateAsStr(d)] && "transfer" == Holidays[DateAsStr(d)].type);
        f = (g - 1) * CL_ROW_SIZE_X;
        b(d) ? (a.fillStyle = CL_EXCHANGE_COLOR,
        a.fillRect(f, e, CL_ROW_SIZE_X - 1, CL_ROW_SIZE_Y - 1),
        a.fillStyle = "#FFFFFF") : m ? (a.fillStyle = CL_HOLIDAY_BK_COLOR,
        a.fillRect(f, e, CL_ROW_SIZE_X - 1, CL_ROW_SIZE_Y - 1),
        a.fillStyle = CL_HOLIDAY_TEXT_COLOR) : a.fillStyle = BTN_TEXT_COLOR;
        a.fillText(d.getDate(), f + CL_ROW_SIZE_X / 2, e + CL_ROW_SIZE_Y / 2 + 20);
        7 == g && (e += CL_ROW_SIZE_Y,
        a.beginPath(),
        a.moveTo(0, e),
        a.lineTo(CL_MAX_WIDTH, e),
        a.closePath(),
        a.stroke());
        d.setDate(d.getDate() + 1)
    }
    a.restore()
}
function MakeBaseRoomSchedule(a, b) {
    "undefined" === typeof NIKA.ROOM_SCHEDULE && (NIKA.ROOM_SCHEDULE = {});
    if ("undefined" === typeof NIKA.ROOM_SCHEDULE[b] || "undefined" === typeof NIKA.ROOM_SCHEDULE[b][a])
        if ("undefined" === typeof NIKA.ROOM_SCHEDULE[b] && (NIKA.ROOM_SCHEDULE[b] = {}),
        "undefined" === typeof NIKA.ROOM_SCHEDULE[b][a] && (NIKA.ROOM_SCHEDULE[b][a] = {}),
        "undefined" !== typeof NIKA.CLASS_SCHEDULE[b])
            for (var c in NIKA.CLASS_SCHEDULE[b])
                if ("undefined" !== typeof NIKA.CLASS_SCHEDULE[b][c])
                    for (var d in NIKA.CLASS_SCHEDULE[b][c]) {
                        var e = NIKA.CLASS_SCHEDULE[b][c][d];
                        if ("undefined" !== typeof e.r)
                            for (var f in e.r)
                                e.r[f] == a && ("undefined" === typeof NIKA.ROOM_SCHEDULE[b][a][d] && (NIKA.ROOM_SCHEDULE[b][a][d] = {
                                    s: [],
                                    t: [],
                                    c: []
                                }),
                                "undefined" !== typeof e.s[f] && NIKA.ROOM_SCHEDULE[b][a][d].s.push(e.s[f]),
                                "undefined" !== typeof e.t[f] && NIKA.ROOM_SCHEDULE[b][a][d].t.push(e.t[f]),
                                NIKA.ROOM_SCHEDULE[b][a][d].c.push(c))
                    }
}
function MakeExchangesRoomSchedule(a, b, c, d, e) {
    function f() {
        "undefined" === typeof NIKA.ROOM_EXCHANGE[a] && (NIKA.ROOM_EXCHANGE[a] = {});
        "undefined" === typeof NIKA.ROOM_EXCHANGE[a][e] && (NIKA.ROOM_EXCHANGE[a][e] = {})
    }
    if ("undefined" !== typeof NIKA.CLASS_EXCHANGE && ("undefined" === typeof NIKA.ROOM_EXCHANGE && (NIKA.ROOM_EXCHANGE = {}),
    "undefined" === typeof NIKA.ROOM_EXCHANGE[a] || "undefined" === typeof NIKA.ROOM_EXCHANGE[a][e]))
        for (var g in NIKA.CLASS_EXCHANGE)
            if ("undefined" !== typeof NIKA.CLASS_EXCHANGE[g][e])
                for (var m in NIKA.CLASS_EXCHANGE[g][e]) {
                    var h = NIKA.CLASS_EXCHANGE[g][e][m]
                      , u = d.toString() + addZero(m)
                      , p = 0 < c ? c.toString() + u : u;
                    if ("string" === typeof h.s && "F" === h.s) {
                        if ("undefined" !== typeof NIKA.CLASS_SCHEDULE && "undefined" !== typeof NIKA.CLASS_SCHEDULE[b] && "undefined" !== typeof NIKA.CLASS_SCHEDULE[b][g]) {
                            var r = null;
                            0 < c && "undefined" !== typeof NIKA.CLASS_SCHEDULE[b][g][p] ? r = NIKA.CLASS_SCHEDULE[b][g][p] : "undefined" !== typeof NIKA.CLASS_SCHEDULE[b][g][u] && (r = NIKA.CLASS_SCHEDULE[b][g][u]);
                            if (null !== r && "undefined" !== typeof r.r)
                                for (var t in r.r)
                                    r.r[t] == a && (f(),
                                    "undefined" === typeof NIKA.ROOM_EXCHANGE[a][e][m] && (NIKA.ROOM_EXCHANGE[a][e][m] = {
                                        s: "F"
                                    }))
                        }
                    } else if ("object" === typeof h.s && 0 < h.s.length) {
                        if ("undefined" !== typeof h.r)
                            for (var v in h.r)
                                h.r[v] == a && (f(),
                                "undefined" === typeof NIKA.ROOM_EXCHANGE[a][e][m] && (NIKA.ROOM_EXCHANGE[a][e][m] = {
                                    s: [],
                                    t: [],
                                    c: []
                                }),
                                "undefined" !== typeof h.s[v] && (NIKA.ROOM_EXCHANGE[a][e][m].s = [h.s[v]],
                                NIKA.ROOM_EXCHANGE[a][e][m].t = "undefined" !== typeof h.t[v] ? [h.t[v]] : [],
                                NIKA.ROOM_EXCHANGE[a][e][m].c = [g]));
                        if ("undefined" !== typeof NIKA.CLASS_SCHEDULE && "undefined" !== typeof NIKA.CLASS_SCHEDULE[b] && "undefined" !== typeof NIKA.CLASS_SCHEDULE[b][g] && (r = null,
                        0 < c && "undefined" !== typeof NIKA.CLASS_SCHEDULE[b][g][p] ? r = NIKA.CLASS_SCHEDULE[b][g][p] : "undefined" !== typeof NIKA.CLASS_SCHEDULE[b][g][u] && (r = NIKA.CLASS_SCHEDULE[b][g][u]),
                        null !== r && "undefined" !== typeof r.r))
                            for (t in r.r)
                                if (r.r[t] == a) {
                                    u = !1;
                                    if ("undefined" !== typeof h.r)
                                        for (var l in h.r)
                                            if (h.r[l] == a) {
                                                u = !0;
                                                break
                                            }
                                    u || (f(),
                                    "undefined" === typeof NIKA.ROOM_EXCHANGE[a][e][m] && (NIKA.ROOM_EXCHANGE[a][e][m] = {
                                        s: "F"
                                    }))
                                }
                    }
                }
}
function MakeFreeRoomSchedule(a, b, c, d) {
    "undefined" === typeof NIKA.FREE_ROOMS && (NIKA.FREE_ROOMS = {});
    if ("undefined" === typeof NIKA.FREE_ROOMS[d] && -1 != a) {
        NIKA.FREE_ROOMS[d] = {};
        for (var e = c.toString(), f = 0 < b ? b.toString() + e : e, g = NIKA.FIRSTLESSONNUM; g <= NIKA.LESSONSINDAY; g++) {
            for (var m = e + addZero(g), h = 0 < b ? f + addZero(g) : m, u = [], p = !0, r = 0; r < rooms.length; r++) {
                var t = rooms[r];
                if (("undefined" === typeof NIKA.ROOMS_UNLIM_CAPACITY || void 0 === NIKA.ROOMS_UNLIM_CAPACITY[t]) && "any_room" != t) {
                    var v = !0;
                    MakeBaseRoomSchedule(t, a);
                    MakeExchangesRoomSchedule(t, a, b, c, d);
                    if ("undefined" !== typeof NIKA.ROOM_EXCHANGE && "undefined" !== typeof NIKA.ROOM_EXCHANGE[t] && "undefined" !== typeof NIKA.ROOM_EXCHANGE[t][d] && "undefined" !== typeof NIKA.ROOM_EXCHANGE[t][d][g]) {
                        var l = NIKA.ROOM_EXCHANGE[t][d][g];
                        "string" === typeof l.s && "F" === l.s ? v = !0 : "object" === typeof l.s && 0 < l.s.length && (v = !1)
                    } else
                        "undefined" !== typeof NIKA.ROOM_SCHEDULE && "undefined" !== typeof NIKA.ROOM_SCHEDULE[a] && "undefined" !== typeof NIKA.ROOM_SCHEDULE[a][t] && (0 < b && "undefined" !== typeof NIKA.ROOM_SCHEDULE[a][t][h] && 0 < NIKA.ROOM_SCHEDULE[a][t][h].s.length ? p = v = !1 : "undefined" !== typeof NIKA.ROOM_SCHEDULE[a][t][m] && 0 < NIKA.ROOM_SCHEDULE[a][t][m].s.length && (p = v = !1));
                    v && u.push(t)
                }
            }
            NIKA.FREE_ROOMS[d][g] = {
                r: u,
                a: p
            }
        }
    }
}
;var Canvas, CurrentTab = "", CurrMonday, ExchangesExist, btns = {}, labels = {}, ScrollBox = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
}, StrikeOutFreeLsn = !0, ShowExchangesTerm = !0, LangId = "RUS", Holidays = {}, CurrentWeekDays = 0, HOME_BTN_SIZE_X = 304, HOME_BTN_SIZE_Y = 125, HomeScheduleTitle = "", HOME_TITLE_RUS = "\u0420\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0437\u0430\u043d\u044f\u0442\u0438\u0439", HOME_TITLE_ENG = "Timetable", ctLine1 = "", ctLine2 = "", ctMinutNum = "", ctMinutes = "", ctTime = "", ctTimeColon = " ", ctDate = "", ctYear = "", SchoolLabelWidth = 0, SCROLL_DELTA = 5, ScrollTotalSizeX, ScrollTotalSizeY, ScrollStepX, ScrollStepY, ScrollPosX, ScrollPosY, ScrollDelta, CurrScrollStep, ScrollTimeOutId, HoldPos, HoldActive, HoldScrollPos, HandScrollActive, FadeAnim, ScrollTranspEdges = 0, ScrollByHand = !0, GRID_EDGE = 30, GRID_EDGE_COLOR = "rgba(255,255,255,255)", GRID_EDGE_COLOR_TRNSP = "rgba(255,255,255,0)", TOP_HEIGHT = 140, BOTTOM_HEIGHT = 80, ScrollBtnPressed = "", HLBtn = -1, RELOAD_TIMER = 60, RELOAD_TIMER2 = 600, REFRESH_TIMER = 120, IdleTime = 0, RefreshTime = 0, Redraw = !1, FadeOutScreenCnt = 0, FadeOutScreenMax = 20, FadeOutScreen = !1, idFadeOutScreenTimer, VideoSaverMode = !1, BASE_COLOR = "#42825e", TITLE_FONT_COLOR = "#CCFADD", BTN_HL_COLOR = "#3CACC4", YELLOW_LIGHT_COLOR = "#F9FCC3", GRAY_TEXT_COLOR = "#838383", TS_TITLE_COLOR1 = "#CDF7E3", TS_TITLE_COLOR2 = "#BCEAD0", TS_CELL_COLOR1 = "#E6F3C7", TS_CELL_COLOR2 = "#FDFDC7", TS_METHOD_COLOR1 = "#EDBE90", TS_METHOD_COLOR2 = "#FDC690", TS_EXCHANGE_COLOR = "#FB3602", TS_EXCHANGE_COLOR_TITLE = "#FF3004", GRID_LINE_COLOR = "#CACACA", CL_HOLIDAY_BK_COLOR = "#FEFECA", CL_HOLIDAY_TEXT_COLOR = "#FE7446", CL_EXCHANGE_COLOR = "#FF3004", CDS_ROW_COLOR_TRNSP = "rgba(127,239,164,0.18)", CDS_ROW_LINE_COLOR = "#C6EBD4", CDS_TEACHER_COLOR = "#44825D", CLASSES_COLORS = "#D9E4FF #FEFCB1 #E4C8FB #C7FBD4 #FCC2EA #DCFEB1 #C0F6F8 #FCC9C8 #E1ECA7 #FBDFB7 #F6FFAE #DBE0E3 #C6EAFF".split(" "), MONTHS3_STR = "\u044f\u043d\u0432\u0430\u0440\u0435 \u0444\u0435\u0432\u0440\u0430\u043b\u0435 \u043c\u0430\u0440\u0442\u0435 \u0430\u043f\u0440\u0435\u043b\u0435 \u043c\u0430\u0435 \u0438\u044e\u043d\u0435 \u0438\u044e\u043b\u0435 \u0430\u0432\u0433\u0443\u0441\u0442\u0435 \u0441\u0435\u043d\u0442\u044f\u0431\u0440\u0435 \u043e\u043a\u0442\u044f\u0431\u0440\u0435 \u043d\u043e\u044f\u0431\u0440\u0435 \u0434\u0435\u043a\u0430\u0431\u0440\u0435".split(" "), BTN_TEXT_COLOR = "#000000", BTN_HL_TEXT_COLOR = TITLE_FONT_COLOR, SCHED_TITLE_COLOR = "rgb(170,40,30)", SCHED_FONT_COLOR = "rgb(40,40,40)", SCHED_GROUP_COLOR = "rgb(100,100,100)", VACATION_FONT_COLOR = "rgb(153, 29, 20)", FREE_ROOM_FONT_COLOR = "rgb(53, 103, 75)", SECOND_SHIFT_COLOR = "#306030", UPK_COLOR = "rgb(0,137,198)", IMAGE_DIR = "images/", local_host = window.location.host.toLowerCase();
if (0 <= local_host.indexOf("nikasoft.ru") || local_host.startsWith("localhost"))
    IMAGE_DIR = "/static/images/";
var BackgroundImg1 = new Image;
BackgroundImg1.src = IMAGE_DIR + "background1.jpg";
var BackgroundGrid = new Image;
BackgroundGrid.src = IMAGE_DIR + "grid.png";
var CalendarImg1 = new Image;
CalendarImg1.src = IMAGE_DIR + "calendar1.png";
var TitleImg1 = new Image
  , TopLineImg = new Image;
TopLineImg.src = IMAGE_DIR + "top_line.png";
var BottomLineImg = new Image;
BottomLineImg.src = IMAGE_DIR + "bottom_line.png";
var SelectDay = new Image;
SelectDay.src = IMAGE_DIR + "cs_day.png";
var SelectDayHL = new Image;
SelectDayHL.src = IMAGE_DIR + "cs_day_hl.png";
var CLASSES_BUTTONS = [new Image, new Image, new Image, new Image];
CLASSES_BUTTONS[0].src = IMAGE_DIR + "class_btn1.png";
CLASSES_BUTTONS[1].src = IMAGE_DIR + "class_btn2.png";
CLASSES_BUTTONS[2].src = IMAGE_DIR + "class_btn3.png";
CLASSES_BUTTONS[3].src = IMAGE_DIR + "class_btn4.png";
var DayBoxImg = new Image;
DayBoxImg.src = IMAGE_DIR + "day_box.png";
var DayLineImg = new Image;
DayLineImg.src = IMAGE_DIR + "day_line.png";
for (var LastAnimTime, SUBJECT_MAX_LENGTH = 18, ROOM_MAX_LENGTH = 3, CLASS_GRID_COL_SIZE, CLASS_GRID_ROW_SIZE = 76, CLASS_BTN_SIZE_X, CLASS_BTN_SIZE_Y = 51, CLASS_BTN_FONT, MaxClsLen, TEACHERS_GRID_COL_SIZE, TEACHERS_GRID_ROW_SIZE = 54, TEACHER_BTN_SIZE_X, TEACHER_BTN_SIZE_Y = 51, TEACHER_DISTANCE_X = 40, MaxTeachLen, MaxTeachColumns, TeachScrollPosY, FreeTeacher, ROOMS_GRID_COL_SIZE, ROOMS_GRID_ROW_SIZE = 54, ROOM_BTN_SIZE_Y, ROOM_BTN_SIZE_X, SEARCH_ROOM_BTN_SIZE_X, MaxRoomLen, MaxRoomColumns, RoomScrollPosY, CurrRoom, FreeRoom, TEACHER_BUTTONS = [new Image, new Image, new Image, new Image], TEACHER_BUTTONS_HL = [new Image, new Image, new Image, new Image], i = 1; 4 >= i; i++)
    TEACHER_BUTTONS[i - 1].src = IMAGE_DIR + "teach_btn" + String(i) + ".png",
    TEACHER_BUTTONS_HL[i - 1].src = IMAGE_DIR + "teach_btnHL" + String(i) + ".png";
var StartCalendarDate = -1, TS_FIRST_COL_SIZE_X = 100, TS_FIRST_ROW_SIZE_Y = 45, TS_COL_SIZE_X = 128, TS_ROW_SIZE_Y = 70, CurrSubject, CurrTeacher, CurrTeachSubject, CS_DAY_WIDTH = 264, RealDayDistanceX, RealDayDistanceY, ClassSchedColCount, CS_MAX_DAY_DISTANCE = 100, CS_MIN_DAY_DISTANCE = 20, CS_ROW_SIZE_Y = 27, CS_LEFT_SHIFT = 20, CS_ADD_BOX_HEIGHT = 80, MaxLessonCount, MinFirstLessonNum, CurrClass, CurrWeekNum, CurrSecondShiftStr, CS_BusyDay = [], CurrDay, CDS_TABLE_WIDTH = 800, CDS_ROW_HEIGHT = 82, FirstLessonNum, LastLessonNum, SecondShiftNum, CL_FIRST_ROW_SIZE_Y = 50, CL_MAX_WIDTH = 875, CL_MAX_HEIGHT = 590, CL_ROW_SIZE_X = 125, CL_ROW_SIZE_Y = 80, CalendarActualHeight, CookieManager = {
    set: function(a, b, c) {
        var d = "";
        c && (d = new Date,
        d.setTime(d.getTime() + 864E5 * c),
        d = "; expires=" + d.toUTCString());
        document.cookie = a + "=" + b + d + "; path=/"
    },
    get: function(a) {
        return (a = document.cookie.match(new RegExp("(?:^|; )" + a.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"))) ? decodeURIComponent(a[1]) : void 0
    },
    remove: function(a) {
        CookieManager.set(a, "", -1)
    }
}, TouchSupport;
function __id(a) {
    return document.getElementById(a)
}
function CreateBtn(a, b, c, d, e) {
    btns[a] = {
        x: 0,
        y: 0,
        w: b,
        h: c,
        v: !1,
        img: null,
        imgHL: null
    };
    btns[a].img = new Image;
    btns[a].img.src = IMAGE_DIR + d;
    btns[a].imgHL = new Image;
    btns[a].imgHL.src = IMAGE_DIR + e
}
function CreateLabel(a, b, c, d, e, f, g) {
    labels[a] = {
        x: b,
        y: c,
        v: !1,
        caption: d,
        font: e,
        color: f,
        align: g,
        scalable: !1
    }
}
function CursorPosFromEvent(a) {
    void 0 === a && (a = window.event);
    return a.offsetX || 0 == a.offsetX ? {
        x: a.offsetX,
        y: a.offsetY
    } : {
        x: a.pageX - a.target.offsetLeft,
        y: a.pageY - a.target.offsetTop
    }
}
function CursorPosInScrollBox(a) {
    return a.x >= ScrollBox.x && a.x <= ScrollBox.x + ScrollBox.w && a.y >= ScrollBox.y && a.y <= ScrollBox.y + ScrollBox.h
}
function GetBtnFromCursorPos(a) {
    for (var b in btns)
        if (btns[b].v && a.x >= btns[b].x && a.x <= btns[b].x + btns[b].w && a.y >= btns[b].y && a.y <= btns[b].y + btns[b].h)
            return b;
    return -1
}
function str_trim(a, b) {
    a.length > b && (a = a.substr(0, b - 1) + "...");
    return a
}
function GetCurrentRatio() {
    let a = Math.max(BackgroundImg1.width / Canvas.width, 1024 / Canvas.height);
    return a = Math.min(Math.max(a, 1), 1.7)
}
function PrintRefreshDate() {
    var a = new Date
      , b = NIKA.EXPORT_DATE;
    if (void 0 != b) {
        if (a.getDate() == b.substr(0, 2) && a.getMonth() + 1 == b.substr(3, 2) && a.getFullYear() == b.substr(6, 4))
            return String(void 0 == NIKA.TODAY_STR ? "\u0441\u0435\u0433\u043e\u0434\u043d\u044f \u0432" : NIKA.TODAY_STR) + " " + NIKA.EXPORT_TIME.substr(0, 5);
        a.setDate(a.getDate() - 1);
        return a.getDate() == b.substr(0, 2) && a.getMonth() + 1 == b.substr(3, 2) && a.getFullYear() == b.substr(6, 4) ? String(void 0 == NIKA.YESTERDAY_STR ? "\u0432\u0447\u0435\u0440\u0430 \u0432" : NIKA.YESTERDAY_STR) + " " + NIKA.EXPORT_TIME.substr(0, 5) : NIKA.EXPORT_DATE + " " + NIKA.EXPORT_TIME.substr(0, 5)
    }
}
function FadeOutScreenFunc() {
    FadeOutScreenCnt ? FadeOutScreenCnt-- : (window.clearInterval(idFadeOutScreenTimer),
    idFadeOutScreenTimer = void 0,
    FadeOutScreen || (__id("AddElements").style.display = "block"));
    Redraw = !0
}
function SwitchFadeOutScreen(a) {
    if (FadeOutScreen != a) {
        if (FadeOutScreen = a)
            __id("AddElements").style.display = "none",
            SwitchVideoSaver(!1);
        FadeOutScreenCnt = FadeOutScreenMax;
        void 0 == idFadeOutScreenTimer && (idFadeOutScreenTimer = window.setInterval(FadeOutScreenFunc, 30))
    }
}
function SwitchVideoSaver(a) {
    void 0 != NIKA.TERM_VIDEO_SAVER_FILE && void 0 == window.schedule_check_url && VideoSaverMode != a && (a ? FadeOutScreen || (VideoSaverMode = a,
    __id("AddElements").style.display = "none",
    Canvas.style.display = "none",
    void 0 == __id("VideoScreenSaver") && (a = document.createElement("video"),
    a.id = "VideoScreenSaver",
    a.loop = "loop",
    a.autoplay = "autoplay",
    a.muted = "muted",
    a.style.height = "100vh",
    a.style.width = "100%",
    a.style.objectFit = "cover",
    a.style.position = "absolute",
    a.src = NIKA.TERM_VIDEO_SAVER_FILE,
    a.innerHTML = "<p>qwerqwer</p>",
    __id("MainDiv").insertBefore(a, Canvas),
    a.onmousedown = function(b) {
        location.href = location.href
    }
    ,
    TouchSupport && a.addEventListener("touchstart", function(b) {
        location.href = location.href
    }))) : (VideoSaverMode = a,
    __id("AddElements").style.display = "block",
    Canvas.style.display = "block",
    void 0 != __id("VideoScreenSaver") && (__id("VideoScreenSaver").style.display = "none")))
}
function CheckWorkPeriod() {
    if (void 0 != NIKA.TERM_WORK_PERIOD) {
        var a = NIKA.TERM_WORK_PERIOD.split(";");
        if (void 0 != a) {
            var b = new Date, c = b.getDay() ? b.getDay() : 7, d = 60 * b.getHours() + b.getMinutes(), e;
            for (e in a) {
                var f = a[e].match(/\d{2}:\d{2}/g);
                b = a[e].match(/=\d/);
                if (null != f && 2 == f.length && null != b && 1 == b.length) {
                    b = b[0][1];
                    var g = 60 * Number(f[0][0] + f[0][1]) + Number(f[0][3] + f[0][4]);
                    f = 60 * Number(f[1][0] + f[1][1]) + Number(f[1][3] + f[1][4]);
                    if (void 0 != b && b == c) {
                        if (d >= g && d <= f) {
                            SwitchFadeOutScreen(!1);
                            return
                        }
                        break
                    }
                }
            }
            SwitchFadeOutScreen(!0)
        }
    }
}
window.Init = Init;
function Init() {
    return $jscomp.asyncExecutePromiseGeneratorFunction(function*() {
        function a(d) {
            switch (d) {
            case "LeftScrll":
            case "RightScrll":
            case "UpScrll":
            case "DownScrll":
                ScrollBtnUp();
                break;
            case "home":
            case "classes":
            case "teachers":
            case "classrooms":
                GotoTab(d);
                break;
            case "back":
                GotoTab(window.tabs[CurrentTab].BackTab);
                break;
            case "arrow_left":
            case "prev_month":
            case "prev_day":
                window.tabs[CurrentTab].toPrev && window.tabs[CurrentTab].toPrev();
                break;
            case "arrow_right":
            case "next_month":
            case "next_day":
                window.tabs[CurrentTab].toNext && window.tabs[CurrentTab].toNext();
                break;
            case "changes":
                window.tabs[CurrentTab].toCalendar && window.tabs[CurrentTab].toCalendar();
                break;
            case "NL":
            case "NLs":
                "1" != window.NIKA.DISABLE_LINK_LOGO && (location.href = "http://www.nikasoft.ru")
            }
        }
        yield ForceRefreshScheduleOnline();
        if (NIKA.SCHOOL_NAME) {
            var b = NIKA.SCHEDULE_STR.toLowerCase();
            b = b.charAt(0).toUpperCase() + b.slice(1);
            document.title = b + " " + NIKA.SCHOOL_NAME
        }
        if (CheckMobileView())
            yield SwitchToMobileVersion();
        else {
            SwitchToDesktopVersion();
            void 0 != NIKA.LANG && (LangId = NIKA.LANG);
            HomeScheduleTitle = void 0 != NIKA.HOME_TITLE_STR ? NIKA.HOME_TITLE_STR : "RUS" == LangId ? HOME_TITLE_RUS : HOME_TITLE_ENG;
            HomeScheduleTitle == HOME_TITLE_RUS ? (TitleImg1.src = IMAGE_DIR + "title1.png",
            HomeScheduleTitle = "") : HomeScheduleTitle == HOME_TITLE_ENG && (TitleImg1.src = IMAGE_DIR + "title1_eng.png",
            HomeScheduleTitle = "");
            "RUS" == LangId ? (NIKA.FOR_WEEK = void 0 == NIKA.FOR_WEEK ? "\u043d\u0430 \u043d\u0435\u0434\u0435\u043b\u044e" : NIKA.FOR_WEEK,
            window.NIKA.DUALWEEK && (NIKA.FOR_1WEEK = void 0 == NIKA.FOR_1WEEK ? "\u043d\u0430 I \u043d\u0435\u0434\u0435\u043b\u044e" : NIKA.FOR_1WEEK,
            NIKA.FOR_2WEEK = void 0 == NIKA.FOR_2WEEK ? "\u043d\u0430 II \u043d\u0435\u0434\u0435\u043b\u044e" : NIKA.FOR_2WEEK),
            NIKA.CLASSROOMS_BTN = void 0 == NIKA.CLASSROOMS_BTN ? "\u041a\u0410\u0411\u0418\u041d\u0415\u0422\u042b" : NIKA.CLASSROOMS_BTN,
            NIKA.CLASSROOMS_TITLE_STR = void 0 == NIKA.CLASSROOMS_TITLE_STR ? "\u0417\u0430\u043d\u044f\u0442\u043e\u0441\u0442\u044c \u043a\u0430\u0431\u0438\u043d\u0435\u0442\u043e\u0432" : NIKA.CLASSROOMS_TITLE_STR,
            NIKA.FIND_ANY_ROOM = void 0 == NIKA.FIND_ANY_ROOM ? "\u041d\u0430\u0439\u0442\u0438 \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u044b\u0439 \u043a\u0430\u0431\u0438\u043d\u0435\u0442" : NIKA.FIND_ANY_ROOM,
            NIKA.ROOM_STR = void 0 == NIKA.ROOM_STR ? "\u043a\u0430\u0431\u0438\u043d\u0435\u0442" : NIKA.ROOM_STR,
            NIKA.FREE_ROOM_STR = void 0 == NIKA.FREE_ROOM_STR ? "\u0421\u0432\u043e\u0431\u043e\u0434\u043d\u044b\u0435 \u043a\u0430\u0431\u0438\u043d\u0435\u0442\u044b" : NIKA.FREE_ROOM_STR,
            NIKA.ALL_BUSY_ROOMS_STR = void 0 == NIKA.ALL_BUSY_ROOMS_STR ? "\u0412\u0441\u0435 \u0437\u0430\u043d\u044f\u0442\u044b" : NIKA.ALL_BUSY_ROOMS_STR,
            NIKA.ALL_FREE_ROOMS_STR = void 0 == NIKA.ALL_FREE_ROOMS_STR ? "\u0412\u0441\u0435 \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u044b" : NIKA.ALL_FREE_ROOMS_STR) : "ENG" == LangId && (NIKA.FOR_WEEK = void 0 == NIKA.FOR_WEEK ? "weekly" : NIKA.FOR_WEEK,
            window.NIKA.DUALWEEK && (NIKA.FOR_1WEEK = void 0 == NIKA.FOR_1WEEK ? "for odd week" : NIKA.FOR_1WEEK,
            NIKA.FOR_2WEEK = void 0 == NIKA.FOR_2WEEK ? "for even week" : NIKA.FOR_2WEEK),
            NIKA.CLASSROOMS_BTN = void 0 == NIKA.CLASSROOMS_BTN ? "CLASSROOMS" : NIKA.CLASSROOMS_BTN,
            NIKA.CLASSROOMS_TITLE_STR = void 0 == NIKA.CLASSROOMS_TITLE_STR ? "Classrooms occupancy" : NIKA.CLASSROOMS_TITLE_STR,
            NIKA.FIND_ANY_ROOM = void 0 == NIKA.FIND_ANY_ROOM ? "Find a free classroom" : NIKA.FIND_ANY_ROOM,
            NIKA.ROOM_STR = void 0 == NIKA.ROOM_STR ? "classroom" : NIKA.ROOM_STR,
            NIKA.FREE_ROOM_STR = void 0 == NIKA.FREE_ROOM_STR ? "Free classrooms" : NIKA.FREE_ROOM_STR,
            NIKA.ALL_BUSY_ROOMS_STR = void 0 == NIKA.ALL_BUSY_ROOMS_STR ? "All busy" : NIKA.ALL_BUSY_ROOMS_STR,
            NIKA.ALL_FREE_ROOMS_STR = void 0 == NIKA.ALL_FREE_ROOMS_STR ? "All free" : NIKA.ALL_FREE_ROOMS_STR);
            null !== __id("mobile-version") && (__id("go_mobile").onclick = function() {
                -1 == location.href.indexOf("Schedule.html") ? (CookieManager.set("schedule_mobile", "1", 360),
                location.href = location.href.replace(location.hash, "")) : location.href = location.href.replace("Schedule.html", "m.schedule.html")
            }
            );
            __id("go_mobile").innerHTML = void 0 == NIKA.GO_MOBILE_STR ? "RUS" == LangId ? "\u041d\u0430 \u043c\u043e\u0431\u0438\u043b\u044c\u043d\u0443\u044e \u0432\u0435\u0440\u0441\u0438\u044e" : "To mobile version" : NIKA.GO_MOBILE_STR;
            Canvas = __id("MainCanvas");
            TouchSupport = !1;
            "ontouchstart" in window ? TouchSupport = !0 : window.navigator.msPointerEnabled && navigator.msMaxTouchPoints && (TouchSupport = !0);
            Canvas.onmousedown = function(d) {
                SwitchFadeOutScreen(!1);
                var e = CursorPosFromEvent(d);
                "function" === typeof window.ym && "undefined" !== typeof window.desktop_ym && window.ym(window.desktop_ym, "reachGoal", "CLICK_ON_SCHEDULE");
                if (!TouchSupport && CursorPosInScrollBox(e))
                    HoldPos = e,
                    HoldScrollPos = {
                        x: ScrollPosX,
                        y: ScrollPosY
                    },
                    HandScrollActive = !1,
                    HoldActive = !0;
                else
                    switch (e = GetBtnFromCursorPos(e),
                    e) {
                    case "LeftScrll":
                    case "RightScrll":
                    case "UpScrll":
                    case "DownScrll":
                        ScrollBtnDown(e)
                    }
                Canvas.onmousemove(d)
            }
            ;
            TouchSupport && (Canvas.addEventListener("touchstart", function(d) {
                SwitchFadeOutScreen(!1);
                var e = {
                    x: d.changedTouches[0].pageX,
                    y: d.changedTouches[0].pageY
                };
                if (CursorPosInScrollBox(e))
                    HoldPos = e,
                    HoldScrollPos = {
                        x: ScrollPosX,
                        y: ScrollPosY
                    },
                    HandScrollActive = !1,
                    HoldActive = !0;
                else if (HLBtn = GetBtnFromCursorPos(e),
                -1 != HLBtn) {
                    switch (HLBtn) {
                    case "LeftScrll":
                    case "RightScrll":
                    case "UpScrll":
                    case "DownScrll":
                        ScrollBtnDown(HLBtn)
                    }
                    d.preventDefault();
                    Redraw = !0
                }
            }),
            Canvas.addEventListener("touchmove", function(d) {
                var e = {
                    x: d.changedTouches[0].pageX,
                    y: d.changedTouches[0].pageY
                }
                  , f = HLBtn;
                if (CursorPosInScrollBox(e)) {
                    if (HoldActive && ScrollTotalSizeX) {
                        f = !1;
                        if (e.x < HoldPos.x && HoldScrollPos.x + HoldPos.x - e.x + ScrollBox.w < ScrollTotalSizeX + (ScrollStepX >> 1) && ScrollPosX + ScrollBox.w < ScrollTotalSizeX || e.x > HoldPos.x && 0 < HoldScrollPos.x + HoldPos.x - e.x && 0 < ScrollPosX)
                            HandScrollActive = f = !0,
                            ScrollPosX = HoldScrollPos.x + HoldPos.x - e.x;
                        if (e.y < HoldPos.y && HoldScrollPos.y + HoldPos.y - e.y + ScrollBox.h < ScrollTotalSizeY + (ScrollStepY >> 1) && ScrollPosY + ScrollBox.h < ScrollTotalSizeY || e.y > HoldPos.y && 0 < HoldScrollPos.y + HoldPos.y - e.y && 0 < ScrollPosY)
                            HandScrollActive = f = !0,
                            ScrollPosY = HoldScrollPos.y + HoldPos.y - e.y;
                        Redraw = !0;
                        f && d.preventDefault()
                    }
                } else
                    HLBtn = GetBtnFromCursorPos(e),
                    HLBtn != f && (Redraw = !0)
            }),
            Canvas.addEventListener("touchend", function(d) {
                if (CursorPosInScrollBox({
                    x: d.changedTouches[0].pageX,
                    y: d.changedTouches[0].pageY
                }) && HandScrollActive) {
                    var e = ScrollStepX * (ScrollPosX / ScrollStepX >> 0);
                    if (ScrollDelta.x = Math.round(10 * (ScrollPosX - e) / ScrollStepX))
                        5 <= ScrollDelta.x && (ScrollDelta.x -= 10,
                        e += ScrollStepX),
                        CurrScrollStep.x = Math.round((e - ScrollPosX) / ScrollDelta.x);
                    e = ScrollStepY * (ScrollPosY / ScrollStepY >> 0);
                    if (ScrollDelta.y = Math.round(10 * (ScrollPosY - e) / ScrollStepY))
                        5 <= ScrollDelta.y && (ScrollDelta.y -= 10,
                        e += ScrollStepY),
                        CurrScrollStep.y = Math.round((e - ScrollPosY) / ScrollDelta.y);
                    HoldActive = HandScrollActive = !1;
                    Redraw = !0;
                    d.preventDefault()
                } else
                    -1 != HLBtn && (a(HLBtn),
                    HLBtn = void 0,
                    Redraw = !0)
            }));
            Canvas.onmousemove = function(d) {
                if (CurrentTab) {
                    d = CursorPosFromEvent(d);
                    IdleTime = 0;
                    var e = HLBtn;
                    if (CursorPosInScrollBox(d)) {
                        if (HoldActive && ScrollTotalSizeX && (10 < Math.abs(d.x - HoldPos.x) || 10 < Math.abs(d.y - HoldPos.y)))
                            if (ScrollByHand && !TouchSupport)
                                HandScrollActive = !0;
                            else
                                return;
                        if (HandScrollActive) {
                            if (d.x < HoldPos.x && HoldScrollPos.x + HoldPos.x - d.x + ScrollBox.w < ScrollTotalSizeX + (ScrollStepX >> 1) && ScrollPosX + ScrollBox.w < ScrollTotalSizeX || d.x > HoldPos.x && 0 < HoldScrollPos.x + HoldPos.x - d.x && 0 < ScrollPosX)
                                ScrollPosX = HoldScrollPos.x + HoldPos.x - d.x;
                            if (d.y < HoldPos.y && HoldScrollPos.y + HoldPos.y - d.y + ScrollBox.h < ScrollTotalSizeY + (ScrollStepY >> 1) && ScrollPosY + ScrollBox.h < ScrollTotalSizeY || d.y > HoldPos.y && 0 < HoldScrollPos.y + HoldPos.y - d.y && 0 < ScrollPosY)
                                ScrollPosY = HoldScrollPos.y + HoldPos.y - d.y;
                            Redraw = !0;
                            return
                        }
                        if (ScrollDelta.x || ScrollDelta.y || FadeAnim)
                            return;
                        d.x -= ScrollBox.x - ScrollPosX;
                        d.y -= ScrollBox.y - ScrollPosY;
                        HLBtn = window.tabs[CurrentTab].getbtn(d)
                    } else
                        HLBtn = GetBtnFromCursorPos(d);
                    HLBtn != e && (Redraw = !0)
                }
            }
            ;
            Canvas.onmouseup = function(d) {
                if (CurrentTab) {
                    Redraw = !0;
                    d = CursorPosFromEvent(d);
                    if (CursorPosInScrollBox(d))
                        if (HandScrollActive && !TouchSupport) {
                            d = ScrollStepX * (ScrollPosX / ScrollStepX >> 0);
                            if (ScrollDelta.x = Math.round(10 * (ScrollPosX - d) / ScrollStepX))
                                5 <= ScrollDelta.x && (ScrollDelta.x -= 10,
                                d += ScrollStepX),
                                CurrScrollStep.x = Math.round((d - ScrollPosX) / ScrollDelta.x);
                            d = ScrollStepY * (ScrollPosY / ScrollStepY >> 0);
                            if (ScrollDelta.y = Math.round(10 * (ScrollPosY - d) / ScrollStepY))
                                5 <= ScrollDelta.y && (ScrollDelta.y -= 10,
                                d += ScrollStepY),
                                CurrScrollStep.y = Math.round((d - ScrollPosY) / ScrollDelta.y)
                        } else {
                            if (ScrollDelta.x || ScrollDelta.y || FadeAnim)
                                return;
                            d.x -= ScrollBox.x - ScrollPosX;
                            d.y -= ScrollBox.y - ScrollPosY;
                            HLBtn = window.tabs[CurrentTab].getbtn(d);
                            window.tabs[CurrentTab].clickbtn && window.tabs[CurrentTab].clickbtn()
                        }
                    else
                        d = GetBtnFromCursorPos(d),
                        a(d);
                    HoldActive = HandScrollActive = !1
                }
            }
            ;
            Canvas.onmouseout = function(d) {
                Redraw = !0;
                HLBtn = -1;
                HoldActive = HandScrollActive = !1
            }
            ;
            window.onresize = function() {
                Canvas.width = __id("MainDiv").clientWidth;
                Canvas.height = __id("MainDiv").clientHeight;
                __id("go_mobile").style.left = (Canvas.width - 180).toString() + "px";
                __id("go_mobile").style.top = (Canvas.height - 40).toString() + "px";
                "hidden" == window.NIKA.MOBILE_LINK ? __id("go_mobile").style.visibility = "hidden" : "visible" == window.NIKA.MOBILE_LINK && "home" == CurrentTab ? __id("go_mobile").style.visibility = "visible" : "home" == CurrentTab && 1800 > screen.availWidth / (window.devicePixelRatio || 1) && 1800 > screen.availHeight / (window.devicePixelRatio || 1) ? __id("go_mobile").style.visibility = "visible" : __id("go_mobile").style.visibility = "hidden";
                if (CurrentTab) {
                    var d = GetCurrentRatio();
                    window.tabs[CurrentTab].resize(d);
                    btns.back.w = 67;
                    btns.back.h = 68;
                    btns.home.w = btns.back.w;
                    btns.home.h = btns.back.h;
                    btns.back.x = Canvas.width - 2 * btns.back.w - 120;
                    btns.back.y = Canvas.height - BOTTOM_HEIGHT / 2 - btns.back.h / 2;
                    btns.home.x = btns.back.x + btns.back.w + 20;
                    btns.home.y = btns.back.y;
                    ScrollBtnUpdate();
                    Canvas.style.cursor = TouchSupport && window.screen.width == Canvas.width ? "None" : "";
                    animate()
                }
            }
            ;
            b = new Date;
            "RUS" == LangId ? __id("copyright").innerHTML = "&copy; 1997-" + b.getFullYear() + "  \u041d\u0438\u043a\u0430-\u0421\u043e\u0444\u0442 &trade;" : __id("copyright").innerHTML = "&copy; 1997-" + b.getFullYear() + "  Nika-Soft &trade;";
            document.body.style.backgroundColor = BASE_COLOR;
            "\u043a\u043b\u0430\u0441\u0441\u044b" == NIKA.CLASSES_BTN.toLowerCase() && "RUS" == LangId ? CreateBtn("classes", HOME_BTN_SIZE_X, HOME_BTN_SIZE_Y, "classes_btn.png", "classes_hl.png") : "\u0433\u0440\u0443\u043f\u043f\u044b" == NIKA.CLASSES_BTN.toLowerCase() && "RUS" == LangId ? CreateBtn("classes", HOME_BTN_SIZE_X, HOME_BTN_SIZE_Y, "groups_btn.png", "groups_hl.png") : "classes" == NIKA.CLASSES_BTN.toLowerCase() ? CreateBtn("classes", HOME_BTN_SIZE_X, HOME_BTN_SIZE_Y, "classes_btn_eng.png", "classes_hl_eng.png") : (CreateBtn("classes", HOME_BTN_SIZE_X, HOME_BTN_SIZE_Y, "title_btn.png", "title_btnHL.png"),
            btns.classes.caption = NIKA.CLASSES_BTN.substr(0, 14));
            "\u0443\u0447\u0438\u0442\u0435\u043b\u044f" == NIKA.TEACHERS_BTN.toLowerCase() && "RUS" == LangId ? CreateBtn("teachers", HOME_BTN_SIZE_X, HOME_BTN_SIZE_Y, "teachers_btn.png", "teachers_hl.png") : "teachers" == NIKA.TEACHERS_BTN.toLowerCase() ? CreateBtn("teachers", HOME_BTN_SIZE_X, HOME_BTN_SIZE_Y, "teachers_btn_eng.png", "teachers_hl_eng.png") : (CreateBtn("teachers", HOME_BTN_SIZE_X, HOME_BTN_SIZE_Y, "title_btn.png", "title_btnHL.png"),
            btns.teachers.caption = NIKA.TEACHERS_BTN.substr(0, 14));
            "\u043a\u0430\u0431\u0438\u043d\u0435\u0442\u044b" == NIKA.CLASSROOMS_BTN.toLowerCase() && "RUS" == LangId ? CreateBtn("classrooms", HOME_BTN_SIZE_X, HOME_BTN_SIZE_Y, "classrooms_btn.png", "classrooms_hl.png") : (CreateBtn("classrooms", HOME_BTN_SIZE_X, HOME_BTN_SIZE_Y, "title_btn.png", "title_btnHL.png"),
            btns.classrooms.caption = NIKA.CLASSROOMS_BTN.substr(0, 14));
            CreateBtn("LeftScrll", 48, 48, "left_scroll.png", "left_scrollHL.png");
            CreateBtn("RightScrll", 48, 48, "right_scroll.png", "right_scrollHL.png");
            CreateBtn("UpScrll", 48, 48, "up_scroll.png", "up_scrollHL.png");
            CreateBtn("DownScrll", 48, 48, "down_scroll.png", "down_scrollHL.png");
            CreateBtn("NL", 86, 88, "nika.png", "nikaHL.png");
            btns.NL.v = !0;
            btns.NL.x = 0;
            btns.NL.y = 0;
            CreateBtn("NLs", 53, 54, "small_nika.png", "small_nikaHL.png");
            CreateLabel("school", 0, 0, str_trim(NIKA.SCHOOL_NAME, 40), "300 18px Arial, sans-serif", "#FFFFFF", "left");
            CreateLabel("city", 0, 0, str_trim(NIKA.CITY_NAME, 40), "300 18px Arial, sans-serif", "#FFFFFF", "left");
            CreateLabel("title", 0, 0, "", "RUS" == LangId ? "normal 55px RomanaScript" : "normal 65px AlexBrush", BTN_TEXT_COLOR, "center");
            CreateLabel("period", 0, 0, NIKA.PERIOD_STR, "normal 20px Arial, sans-serif", GRAY_TEXT_COLOR, "center");
            CreateLabel("subject", 0, 0, "", "italic bold 24px Arial, sans-serif", SCHED_TITLE_COLOR, "left");
            CreateLabel("exp_lab", 0, 0, void 0 == NIKA.REFRESH_STR ? "\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u043e" : NIKA.REFRESH_STR, "italic 28px Arial, sans-serif", "#FFFFFF", "center");
            CreateLabel("exp_dt", 0, 0, PrintRefreshDate(), "italic 28px Arial, sans-serif", "#FFFFFF", "center");
            labels.exp_lab.scalable = !0;
            labels.exp_dt.scalable = !0;
            CreateBtn("back", 67, 68, "back.png", "backHL.png");
            CreateBtn("home", 67, 68, "home.png", "homeHL.png");
            CreateBtn("arrow_left", 68, 36, "arrow_left.png", "arrow_leftHL.png");
            CreateBtn("arrow_right", 67, 37, "arrow_right.png", "arrow_rightHL.png");
            CreateBtn("changes", 206, 206, "changes.png", "changesHL.png");
            CreateLabel("change_ln1", 0, 0, String(void 0 == NIKA.CHANGES_STR ? "\u0417\u0430\u043c\u0435\u043d\u044b" : NIKA.CHANGES_STR), "normal 20px Arial, sans-serif", "#FFFFFF", "center");
            CreateLabel("change_ln2", 0, 0, "", "normal 20px Arial, sans-serif", "#FFFFFF", "center");
            labels.change_ln1.scalable = !0;
            labels.change_ln2.scalable = !0;
            CreateLabel("prev_week_ln1", 0, 0, String(void 0 == NIKA.PREVIOUS_STR ? "\u041f\u0440\u0435\u0434\u044b\u0434\u0443\u0449\u0430\u044f" : NIKA.PREVIOUS_STR), "normal 16px Arial, sans-serif", BASE_COLOR, "left");
            CreateLabel("prev_week_ln2", 0, 0, String(void 0 == NIKA.WEEK_STR ? "\u043d\u0435\u0434\u0435\u043b\u044f" : NIKA.WEEK_STR), "normal 16px Arial, sans-serif", BASE_COLOR, "left");
            CreateLabel("next_week_ln1", 0, 0, String(void 0 == NIKA.NEXT_STR ? "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0430\u044f" : NIKA.NEXT_STR), "normal 16px Arial, sans-serif", BASE_COLOR, "left");
            CreateLabel("next_week_ln2", 0, 0, String(void 0 == NIKA.WEEK_STR ? "\u043d\u0435\u0434\u0435\u043b\u044f" : NIKA.WEEK_STR), "normal 16px Arial, sans-serif", BASE_COLOR, "left");
            CreateLabel("prev_month_ln1", 0, 0, String(void 0 == NIKA.PREVIOUS2_STR ? "\u041f\u0440\u0435\u0434\u044b\u0434\u0443\u0449\u0438\u0439" : NIKA.PREVIOUS2_STR), "normal 16px Arial, sans-serif", BASE_COLOR, "left");
            CreateLabel("prev_month_ln2", 0, 0, String(void 0 == NIKA.MONTH_STR ? "\u043c\u0435\u0441\u044f\u0446" : NIKA.MONTH_STR), "normal 16px Arial, sans-serif", BASE_COLOR, "left");
            CreateLabel("next_month_ln1", 0, 0, String(void 0 == NIKA.NEXT2_STR ? "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439" : NIKA.NEXT2_STR), "normal 16px Arial, sans-serif", BASE_COLOR, "left");
            CreateLabel("next_month_ln2", 0, 0, String(void 0 == NIKA.MONTH_STR ? "\u043c\u0435\u0441\u044f\u0446" : NIKA.MONTH_STR), "normal 16px Arial, sans-serif", BASE_COLOR, "left");
            CreateLabel("prev_day_ln2", 0, 0, NIKA.DAY_NUM_STR, "normal 16px Arial, sans-serif", BASE_COLOR, "left");
            CreateLabel("next_day_ln2", 0, 0, NIKA.DAY_NUM_STR, "normal 16px Arial, sans-serif", BASE_COLOR, "left");
            (ExchangesExist = window.NIKA.CLASS_EXCHANGE || 1 < window.NIKA.PERIODS.length || window.NIKA.DUALWEEK) && window.NIKA.HOLIDAY_TRANSFER && (Holidays = window.NIKA.HOLIDAY_TRANSFER);
            void 0 != NIKA.STRIKEOUT_FREE_LSN && (StrikeOutFreeLsn = NIKA.STRIKEOUT_FREE_LSN);
            void 0 != NIKA.SHOW_EXCHANGES_TERM && (ShowExchangesTerm = NIKA.SHOW_EXCHANGES_TERM);
            NIKA.HOMEPAGE_BTN && NIKA.HOMEPAGE_URL ? (__id("go_home").style.visibility = "visible",
            __id("go_home").href = NIKA.HOMEPAGE_URL,
            __id("go_home").innerHTML = NIKA.HOMEPAGE_BTN) : __id("go_home").style.visibility = "hidden";
            for (var c in NIKA.SUBJECTS)
                NIKA.SUBJECTS[c].length > SUBJECT_MAX_LENGTH && (SUBJECT_MAX_LENGTH = NIKA.SUBJECTS[c].length);
            18 < SUBJECT_MAX_LENGTH && (CDS_TABLE_WIDTH = 800 + 14 * (SUBJECT_MAX_LENGTH - 18));
            for (c in NIKA.ROOMS)
                NIKA.ROOMS[c].length > ROOM_MAX_LENGTH && (ROOM_MAX_LENGTH = NIKA.ROOMS[c].length);
            28 < SUBJECT_MAX_LENGTH ? (CS_DAY_WIDTH = 44 + 7 * SUBJECT_MAX_LENGTH,
            TS_COL_SIZE_X = 20 + 7 * SUBJECT_MAX_LENGTH,
            128 > TS_COL_SIZE_X && (TS_COL_SIZE_X = 128),
            200 < TS_COL_SIZE_X && (TS_COL_SIZE_X = 200)) : (CS_DAY_WIDTH = 264,
            TS_COL_SIZE_X = 128);
            GotoTab("home");
            FadeAnim = 0;
            window.setInterval(TimeRefresh, 1E3);
            window.onresize()
        }
    })
}
window.requestAnimFrame = function() {
    return window.requestAnimFrame || window.requestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a, b) {
        window.setTimeout(a, 1E3 / 60)
    }
}();
function animate() {
    if (Canvas.getContext && CurrentTab) {
        if (Redraw) {
            var a = Canvas.getContext("2d");
            if (FadeOutScreen && 0 == FadeOutScreenCnt)
                a.fillStyle = "#0",
                a.fillRect(0, 0, Canvas.width, Canvas.height);
            else {
                a.shadowOffsetX = 0;
                a.shadowOffsetY = 0;
                a.lineWidth = 1;
                var b = GetCurrentRatio();
                window.tabs[CurrentTab].drawback(a, b);
                a.textBaseline = "alphabetic";
                for (var c in btns)
                    btns[c].v && (btns[c].hasOwnProperty("caption") && (a.textAlign = "center",
                    btns[c].hasOwnProperty("align") && (a.textAlign = btns[c].align),
                    a.font = 7 > btns[c].caption.length ? "800 42px Arial, sans-serif" : "800 40px Arial, sans-serif",
                    a.fillStyle = c == HLBtn ? BTN_HL_COLOR : BASE_COLOR),
                    c == HLBtn ? a.drawImage(btns[c].imgHL, btns[c].x, btns[c].y, btns[c].w, btns[c].h) : a.drawImage(btns[c].img, btns[c].x, btns[c].y, btns[c].w, btns[c].h),
                    btns[c].hasOwnProperty("caption") && (a.save(),
                    a.setTransform(1 / b, 0, 0, 1.25 / b, btns[c].x + btns[c].w / 2, btns[c].y + btns[c].h / 2 + 22 - 5.5 * b),
                    a.fillText(btns[c].caption, 0, 0),
                    a.restore()));
                0 == SchoolLabelWidth && (a.font = labels.school.font,
                SchoolLabelWidth = a.measureText(labels.school.caption).width + 10,
                a.measureText(labels.city.caption).width + 10 > SchoolLabelWidth && (SchoolLabelWidth = a.measureText(labels.city.caption).width + 10),
                200 > SchoolLabelWidth && (SchoolLabelWidth = 200));
                for (var d in labels)
                    labels[d].v && (a.font = labels[d].font,
                    a.textAlign = labels[d].align,
                    a.fillStyle = labels[d].color,
                    labels[d].scalable ? (a.save(),
                    a.setTransform(1 / b, 0, 0, 1 / b, labels[d].x, labels[d].y),
                    a.fillText(labels[d].caption, 0, 0),
                    a.restore()) : a.fillText(labels[d].caption, labels[d].x, labels[d].y));
                a.save();
                a.beginPath();
                a.moveTo(ScrollBox.x, ScrollBox.y);
                a.lineTo(ScrollBox.x + ScrollBox.w, ScrollBox.y);
                a.lineTo(ScrollBox.x + ScrollBox.w, ScrollBox.y + ScrollBox.h);
                a.lineTo(ScrollBox.x, ScrollBox.y + ScrollBox.h);
                a.closePath();
                a.clip();
                a.translate(-ScrollPosX + ScrollBox.x, -ScrollPosY + ScrollBox.y);
                window.tabs[CurrentTab].drawscroll(a);
                a.restore();
                FadeAnim ? (5 != FadeAnim || LastAnimTime || (LastAnimTime = new Date),
                a.globalAlpha = FadeAnim / 5,
                a.fillStyle = "#FFFFFF",
                a.fillRect(ScrollBox.x, ScrollBox.y, ScrollBox.w, ScrollBox.h),
                b = new Date,
                30 < b.getTime() - LastAnimTime.getTime() && (FadeAnim--,
                LastAnimTime = b),
                FadeAnim || (LastAnimTime = null),
                a.globalAlpha = 1) : (HandScrollActive || !ScrollDelta.x && !ScrollDelta.y && ScrollStepX * Math.round(ScrollPosX / ScrollStepX) == ScrollPosX && ScrollStepY * Math.round(ScrollPosY / ScrollStepY) == ScrollPosY ? Redraw = !1 : ScrollBtnUpdate(),
                0 < ScrollPosX && ScrollTranspEdges & 1 && (a.save(),
                a.translate(ScrollBox.x, ScrollBox.y),
                b = a.createLinearGradient(0, 0, GRID_EDGE, 0),
                b.addColorStop(0, GRID_EDGE_COLOR),
                b.addColorStop(1, GRID_EDGE_COLOR_TRNSP),
                a.fillStyle = b,
                a.fillRect(0, 0, GRID_EDGE, ScrollBox.h),
                a.restore()),
                ScrollPosX + ScrollBox.w < ScrollTotalSizeX && ScrollTranspEdges & 2 && (a.save(),
                a.translate(ScrollBox.x, ScrollBox.y),
                b = a.createLinearGradient(ScrollBox.w - GRID_EDGE, 0, ScrollBox.w, 0),
                b.addColorStop(0, GRID_EDGE_COLOR_TRNSP),
                b.addColorStop(1, GRID_EDGE_COLOR),
                a.fillStyle = b,
                a.fillRect(ScrollBox.w - GRID_EDGE, 0, GRID_EDGE, ScrollBox.h),
                a.restore()),
                0 < ScrollPosY && ScrollTranspEdges & 8 && (a.save(),
                a.translate(ScrollBox.x, ScrollBox.y),
                b = a.createLinearGradient(0, 0, 0, GRID_EDGE),
                b.addColorStop(0, GRID_EDGE_COLOR),
                b.addColorStop(1, GRID_EDGE_COLOR_TRNSP),
                a.fillStyle = b,
                a.fillRect(0, 0, ScrollBox.w, GRID_EDGE),
                a.restore()),
                ScrollPosY + ScrollBox.h < ScrollTotalSizeY && ScrollTranspEdges & 4 && (a.save(),
                a.translate(ScrollBox.x, ScrollBox.y),
                b = a.createLinearGradient(0, ScrollBox.h - GRID_EDGE, 0, ScrollBox.h),
                b.addColorStop(0, GRID_EDGE_COLOR_TRNSP),
                b.addColorStop(1, GRID_EDGE_COLOR),
                a.fillStyle = b,
                a.fillRect(0, ScrollBox.h - GRID_EDGE, ScrollBox.w, GRID_EDGE),
                a.restore()),
                FadeOutScreenCnt && (b = FadeOutScreen ? Math.round(255 * (FadeOutScreenMax - FadeOutScreenCnt) / FadeOutScreenMax).toString(16) : Math.round(255 * FadeOutScreenCnt / FadeOutScreenMax).toString(16),
                1 == b.length && (b = "0" + b),
                a.fillStyle = "#000000" + b,
                a.fillRect(0, 0, Canvas.width, Canvas.height)))
            }
        }
        window.requestAnimFrame(animate)
    }
}
function ScrollBtnUpdate() {
    Redraw = !0;
    0 < ScrollDelta.x && (ScrollPosX += CurrScrollStep.x);
    0 > ScrollDelta.x && 0 < ScrollPosX && (ScrollPosX -= CurrScrollStep.x);
    0 < ScrollDelta.y && (ScrollPosY += CurrScrollStep.y);
    0 > ScrollDelta.y && 0 < ScrollPosY && (ScrollPosY -= CurrScrollStep.y);
    HandScrollActive || ScrollDelta.x || ScrollStepX * Math.round(ScrollPosX / ScrollStepX) == ScrollPosX || (ScrollPosX = ScrollStepX * Math.round(ScrollPosX / ScrollStepX));
    HandScrollActive || ScrollDelta.y || ScrollStepY * Math.round(ScrollPosY / ScrollStepY) == ScrollPosY || (ScrollPosY = ScrollStepY * Math.round(ScrollPosY / ScrollStepY));
    0 < ScrollPosX ? btns.LeftScrll.v = !0 : (btns.LeftScrll.v = !1,
    0 > ScrollDelta.x && ScrollBtnUp());
    0 < ScrollPosY ? btns.UpScrll.v = !0 : (btns.UpScrll.v = !1,
    0 > ScrollDelta.y && ScrollBtnUp());
    ScrollPosX + ScrollBox.w < ScrollTotalSizeX ? btns.RightScrll.v = !0 : (btns.RightScrll.v = !1,
    0 < ScrollDelta.x && ScrollBtnUp());
    ScrollPosY + ScrollBox.h < ScrollTotalSizeY ? btns.DownScrll.v = !0 : (btns.DownScrll.v = !1,
    0 < ScrollDelta.y && ScrollBtnUp());
    0 < ScrollDelta.x && ScrollDelta.x--;
    0 > ScrollDelta.x && ScrollDelta.x++;
    0 < ScrollDelta.y && ScrollDelta.y--;
    0 > ScrollDelta.y && ScrollDelta.y++;
    ScrollDelta.x || ScrollDelta.y || !ScrollBtnPressed || (ScrollTimeOutId = window.setTimeout(function() {
        ScrollBtnDown(ScrollBtnPressed)
    }, 20))
}
function ScrollBtnUp() {
    clearTimeout(ScrollTimeOutId);
    ScrollBtnPressed = "";
    Redraw = !0
}
function ScrollBtnDown(a) {
    Redraw = !0;
    switch (a) {
    case "LeftScrll":
        ScrollDelta.x -= SCROLL_DELTA;
        break;
    case "RightScrll":
        ScrollDelta.x += SCROLL_DELTA;
        break;
    case "UpScrll":
        ScrollDelta.y -= SCROLL_DELTA;
        break;
    case "DownScrll":
        ScrollDelta.y += SCROLL_DELTA;
        break;
    default:
        return
    }
    "" == ScrollBtnPressed && (ScrollTimeOutId = window.setTimeout(function() {
        ScrollBtnDown(ScrollBtnPressed = a)
    }, 400),
    CurrScrollStep = {
        x: Math.round(ScrollStepX / SCROLL_DELTA),
        y: Math.round(ScrollStepY / SCROLL_DELTA)
    })
}
function GotoTab(a) {
    FadeAnim = 5;
    HLBtn = -1;
    CurrentTab = a;
    HoldActive = HandScrollActive = !1;
    ScrollDelta = {
        x: 0,
        y: 0
    };
    window.tabs[CurrentTab].init();
    window.onresize();
    btns.back.v = "home" != CurrentTab;
    btns.home.v = "home" != CurrentTab;
    RefreshScheduleOnline()
}
function GetScheduleCheckUrl() {
    let a, b;
    return null == (a = window.schedule_check_url) ? void 0 : null == (b = a.match(/\/check.*/)) ? void 0 : b[0]
}
function RefreshScheduleOnline() {
    if (void 0 != window.schedule_check_url && void 0 != window.initial_schedule_id) {
        if (RefreshTime > RELOAD_TIMER && "home" != CurrentTab || RefreshTime > RELOAD_TIMER2) {
            RefreshTime = 0;
            var a = new XMLHttpRequest;
            a.onreadystatechange = function() {
                4 == a.readyState && 200 == a.status && window.initial_schedule_id != a.responseText && a.responseText > window.initial_schedule_id && (location.href = location.href)
            }
            ;
            a.open("GET", GetScheduleCheckUrl(), !0);
            a.send()
        }
        return !0
    }
    return !1
}
function ForceRefreshScheduleOnline() {
    return new Promise( (a, b) => {
        if (void 0 !== window.schedule_check_url && void 0 !== window.initial_schedule_id) {
            var c = new XMLHttpRequest;
            c.onreadystatechange = function() {
                if (4 == c.readyState)
                    if (200 == c.status)
                        if (window.initial_schedule_id !== c.responseText && c.responseText > window.initial_schedule_id) {
                            window.initial_schedule_id = c.responseText;
                            var d = document.createElement("script");
                            d.onload = function() {
                                window.NIKA = NIKA;
                                a()
                            }
                            ;
                            d.src = location.origin + "/static/public/" + window.initial_schedule_id;
                            document.head.appendChild(d)
                        } else
                            a();
                    else
                        a()
            }
            ;
            c.open("GET", GetScheduleCheckUrl(), !0);
            c.send()
        } else
            a()
    }
    )
}
function CheckMobileView() {
    return null === document.getElementById("mobile-version") ? !1 : null === document.getElementById("desktop-version") || "1" === CookieManager.get("schedule_mobile") ? !0 : "0" === CookieManager.get("schedule_mobile") ? !1 : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
function SwitchToDesktopVersion() {
    document.getElementById("desktop-version").classList.remove("hidden");
    "function" === typeof window.ym && "undefined" !== typeof window.desktop_ym && window.ym(window.desktop_ym, "init", {
        clickmap: !0,
        trackLinks: !0,
        accurateTrackBounce: !0
    })
}
function SwitchToMobileVersion() {
    return $jscomp.asyncExecutePromiseGeneratorFunction(function*() {
        updateMetaTag("viewport", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0");
        updateMetaTag("apple-touch-fullscreen", "yes");
        updateMetaTag("apple-mobile-web-app-capable", "yes");
        updateMetaTag("mobile-web-app-capable", "yes");
        updateMetaTag("apple-mobile-web-app-status-bar-style", "black");
        var a = ""
          , b = "";
        void 0 !== window.schedule_check_url && void 0 !== window.initial_schedule_id && (a = "/static/css/",
        b = "/static/js/");
        a = [loadScript(b + "m.schedule.js"), loadStylesheet(a + "jquery.mobile.min.css"), loadStylesheet(a + "m.schedule.css")];
        yield Promise.all(a);
        document.getElementById("mobile-version").classList.remove("hidden");
        "function" === typeof window.ym && "undefined" !== typeof window.mobile_ym && window.ym(window.mobile_ym, "init", {
            clickmap: !0,
            trackLinks: !0,
            accurateTrackBounce: !0
        });
        window.InitMob()
    })
}
function loadStylesheet(a) {
    return new Promise( (b, c) => {
        const d = document.createElement("link");
        d.rel = "stylesheet";
        d.href = a;
        d.onload = () => b();
        d.onerror = () => c(Error(`Failed to load stylesheet: ${a}`));
        document.head.appendChild(d)
    }
    )
}
function loadScript(a) {
    return new Promise( (b, c) => {
        const d = document.createElement("script");
        d.type = "text/javascript";
        d.src = a;
        d.onload = () => b();
        d.onerror = () => c(Error(`Failed to load script: ${a}`));
        document.head.appendChild(d)
    }
    )
}
function updateMetaTag(a, b) {
    let c = document.querySelector(`meta[name="${a}"]`);
    c ? c.setAttribute("content", b) : (c = document.createElement("meta"),
    c.name = a,
    c.content = b,
    document.head.appendChild(c))
}
function getLessonTimeForCurrentDay(a, b) {
    var c = NIKA.LESSON_TIMES_BY_DAY || null
      , d = null
      , e = null;
    c && void 0 !== a && null !== a && ((d = c[a]) || "string" == typeof a || (d = c[String(a)]));
    d && ((e = d[b]) || "string" == typeof b || (e = d[String(b)]));
    !e && NIKA.LESSON_TIMES && ((e = NIKA.LESSON_TIMES[b]) || "string" == typeof b || (e = NIKA.LESSON_TIMES[String(b)]));
    return !e || 2 > e.length ? ["0:00", "0:00"] : e
}
function TimeRefresh() {
    ctYear = ctDate = ctTime = ctMinutes = ctMinutNum = ctLine2 = ctLine1 = "";
    RefreshTime++;
    var a = new Date;
    ctTimeColon = ":" == ctTimeColon ? " " : ":";
    ctTime = addZero(a.getHours()) + " " + addZero(a.getMinutes());
    ctDate = String(a.getDate()) + " " + NIKA.MONTHS2[Number(a.getMonth())].toLowerCase();
    ctYear = String(a.getFullYear()) + " " + String(void 0 == NIKA.YEAR_STR ? "\u0433\u043e\u0434\u0430" : NIKA.YEAR_STR);
    var b = !0, c = a.getDay() || 7, d;
    for (d in NIKA.LESSON_TIMES) {
        var e = getLessonTimeForCurrentDay(c, d);
        var f = 60 * a.getHours() + a.getMinutes();
        var g = 60 * Number(String(e[0]).split(":")[0]) + Number(String(e[0]).split(":")[1]);
        e = 60 * Number(String(e[1]).split(":")[0]) + Number(String(e[1]).split(":")[1]);
        if (f < g && (f > g - 15 && b || !b)) {
            a = String(g - f);
            ctLine1 = Number(d) + " " + NIKA.LESSON_STR;
            ctLine2 = void 0 == NIKA.FROM_STR ? "\u0447\u0435\u0440\u0435\u0437" : NIKA.FROM_STR;
            ctMinutNum = a;
            ctMinutes = "RUS" == LangId ? "1" == a.charAt(a.length - 1) && 20 < a || 1 == a ? NIKA.MINUTES1 : "234".indexOf(a.charAt(a.length - 1)) + 1 && (10 > a || 20 < a) ? NIKA.MINUTES2 : ctMinutes + NIKA.MINUTES3 : NIKA.MINUTES1;
            break
        } else if (f >= g && f <= e) {
            ctMinutNum = Number(d);
            "RUS" == LangId ? (ctLine2 = NIKA.TIME_GO,
            ctMinutes = NIKA.LESSON_STR) : "ENG" == LangId && (ctMinutes = NIKA.TIME_GO,
            ctLine2 = NIKA.LESSON_STR);
            break
        }
        if (f < g && b)
            break;
        b = !1
    }
    Redraw = !0;
    IdleTime++;
    IdleTime > REFRESH_TIMER && (IdleTime = 0,
    CheckWorkPeriod(),
    SwitchVideoSaver(!0),
    VideoSaverMode || FadeOutScreen || RefreshScheduleOnline() || (location.href = location.href),
    GotoTab("home"))
}
;

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('fusioncharts-smartlabel')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'fusioncharts-smartlabel'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3));
}(this, (function (exports,d3Selection,SLManager) { 'use strict';

SLManager = 'default' in SLManager ? SLManager['default'] : SLManager;

var util = {
  mergeRecursive: function mergeRecursive(source, sink) {
     var prop;

     for (prop in sink) {

         if (source[prop] instanceof Object) {
             mergeRecursive(source[prop], sink[prop]);
         }
         else {
             source[prop] = sink[prop];
         }
     }
  },
  serialize: function () {

  },
  isObject: function (obj) {
    return typeof obj === 'object';
  },
  extend2: function () {

  }
};

var id = 1;
var UNDEFINED$1;

var defaultConfig = function () {
  return {
    label: {
        customTagName: 'FT',
        customTagClassName: 'custom-label',
        /*text: 'G<br /><FT style="color:blue;">G<FT>C</FT></FT>A<FT>D</FT>',*/
        /*text: 'A<br/>A<FT style="fill:red; font-size:30px;">B<br/>B<FT style="fill:blue;">C'+
        '</FT></FT>D<FT style="fill:green;">E</FT>',*/
        /*text: 'A<FT style="fill:red; font-size:20px;">B<FT style="fill:blue;">C</FT></FT>D'+
        '<FT style="fill:green;">E</FT>',*/
        text: '',
        // text: 'ABC',
        className: 'label',
        style: {
            'font-size': '12px'
        },
        maxDimensions: {
          width: 1600,
          height: 900
        },
        valign: 'middle'
    },
    margin: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    interaction: {
        hide: false,
        listeners: [{
            action: 'click'/*,
            callback: function () {
                console.log('click');
            }*/
        }],
        tooltip: {
            hide: false,
            text: 'ABC'
        },
        className: 'fusioncharts-navigator-standardTimeZone-tracker-rect' + id,
        style: {
            'fill': 'rgba(192,192,192,0)',
            'stroke-width': '0',
            cursor: 'pointer'
        }
    },
    labelBound: {
        hide: true,
        className: 'fusioncharts-navigator-standardTimeZone-label-bound' + id,
        style: {
            'fill': 'NONE',
            'stroke-width': '1',
            'stroke': '#000'
        },
        /*
         * User defined logical space fn.
        */
        customLogicalSpace: UNDEFINED$1,
        /*
         * default configurations - comes handy if user gives wrong or no input.
        */
        defaultConfig: {
            pathFn: function (x, y, width, height) {
                return ['M', x, y, 'L', x + width, y, 'L', x + width, y + height, 'L', x,
                y + height, 'Z'];
            },
            getLogicalSpace: function (width, height, styleObj) {
                var excess = styleObj['stroke-width'] * 2;
                width += excess;
                height += excess;
                return {
                    width: width,
                    height: height
                };
            }
        },
        /*
         * This creates a custom path for the boundary function.
        */
        customPathFn: UNDEFINED$1
    }
  };
};

// Imports the utility functions defined.
// Imports the default configuration for a fusionText generator.
/*eslint-disable */
{
  document && document.write(
   '<script src="http://' + (location.host || 'localhost').split(':')[0] +
   ':35729/livereload.js?snipver=1"></' + 'script>'
  );
}
/*eslint-enable */

var win = window;
var BLANKSTRING = '';
var UNDEFINED;
var HYPHENATE = '-';
var math = Math;
var mathMax = math.max;
var str = win.String;
var toFloat = win.parseFloat;
var getComputedStyle = win.getComputedStyle;

function FusionText() {
  this.config = defaultConfig();
  this.graphics = {};
  this.measurement = {};
}


// Parse the attributes either in a single config object or in the JSON structure
FusionText.prototype.margin = function (obj) {
  obj && util.mergeRecursive(this.config.margin, obj);
  return this;
};

FusionText.prototype.padding = function (obj) {
  obj && util.mergeRecursive(this.config.padding, obj);
  return this;
};

FusionText.prototype.label = function (text, options, callback) {
  var labelConfig = this.config.label;
  text && (labelConfig.text = text);
  options && util.mergeRecursive(labelConfig, options);
  callback && callback.call(this);
  return this;
};
/*FusionText.prototype.interaction = function () {
  util.mergeRecursive(this.config.interaction, config);
  return this;
};
FusionText.prototype.labelBound = function () {
  util.mergeRecursive(this.config.labelBound, config);
  return this;
};*/
FusionText.prototype.getSmartLabelInstance = function (inst) {
  if (!this.smartLabel) {
    this.smartLabel = inst || new SLManager(new Date().getTime());
  }
  return this.smartLabel;
};

FusionText.prototype.getConfig = function (val) {
  return this.config[val];
};




// Compute the logical space for the fusion-text.
FusionText.prototype.getParentSelection = function (selection) {
  if (selection) {
    this.selection = selection;
  }
  return this.selection;
};

FusionText.prototype.getStubSelection = function (parentSelection,
    defaultClassName, style, classNames, index) {
  if (classNames) {
      classNames[1] && (classNames = ' ' + classNames[1]);
    }
    else {
      classNames = BLANKSTRING;
    }

    var className = (defaultClassName + classNames),
      selection;

    if (!this._group) {
      this._group = [];
    }

    if (!this._group[index]) {
      this._group[index] = parentSelection.append('g');
    }

    selection = this._group[index].attr('class', className);



    if (style) {
      if (style[2]) {
        this.recurse(this.normalizeStyle(style[2]), selection, 'style');
      }
    }
    return {
      selection: selection,
      // fetch the computed style. Required for FusionText.
      style: this.getSmartComputedStyle(selection, className)
    };
};

FusionText.prototype.getSmartComputedStyle = function (group, css) {
  var testText = 'W',
    mandatoryStyle = {'fill-opacity': 0},
    className = typeof css === 'string' ? css : undefined,
    svgText,
    computedStyle,
    styleForFusionText;

  svgText = group.append('text').text(testText);

  if (className) {
    svgText.attr('class', className);
  } else if (typeof css === 'object') {
    delete css['fill-opacity'];
    util.extend2(mandatoryStyle, css);
  }

  this.recurse(mandatoryStyle, svgText, 'style');

  computedStyle = window.getComputedStyle(svgText.node());
  styleForFusionText = {
    fontSize: computedStyle.fontSize,
    fontFamily: computedStyle.fontFamily,
    fontWeight: computedStyle.fontWeight,
    fontStyle: computedStyle.fontStyle
  };

  svgText.remove();

  return styleForFusionText;
};

FusionText.prototype.normalizeStyle = function (cssText) {
  var arr = cssText
  .replace(/\s/g,'')
  .split(new RegExp(/([\w\-]+):([a-z\s\d]+);/,'ig')).filter(Boolean),
  i,
  len,
  obj = {};
  for (i = 0, len = arr.length; i < len; i += 1) {
  obj[arr[i]] = arr[++i];
  }
  return obj;
};

FusionText.prototype.recurse = function (obj, elem, attr) {
  var prop;
  for (prop in obj) {
  elem[attr].call(elem, prop, obj[prop]);
  }
};

FusionText.prototype.parsedText = function () {
  var labelConfig = this.config.label,
    titleText = labelConfig.text,
    customTag = labelConfig.customTagName,
    customTagClassName = labelConfig.customTagClassName,
    textArr = this.textArr,
    parentSelection = this.getParentSelection(),
    groupArr = [],
    gIndex = 0,
    count = 0,
    elem,
    g,
    arr,
    openingTag,
    userStr,
    closingTag,
    defaultClassName,
    smartLabel = this.getSmartLabelInstance(),
    i,
    t,
    textDim,
    len;
  textArr = this.textArr = [];
  groupArr.push(this.getStubSelection(parentSelection, labelConfig.className, labelConfig.style, undefined, count));
  // split the entire string into array of strings.
  arr = titleText.split(new RegExp('(<' + customTag + ')([^>]*)>|(</' + customTag + '>)', 'g'));
  openingTag = '<' + customTag;
  closingTag = '</' + customTag + '>';

  smartLabel.useEllipsesOnOverflow(1);

  // on every occurence of the customTag, create a group and apply the inline css to it.
  for (i = 0, len = arr.length; i < len; i += 1) {
    if ((elem = arr[i]) !== UNDEFINED) {
      // the element is a FusionText.
      if (elem === openingTag) {
        // "<FusionText"  -create group.
        // group index increases.
        gIndex += 1;
        // continue the next iteration. - as the style has already been applied inline to the group.
        defaultClassName = customTagClassName + HYPHENATE + count++;
        userStr = arr[++i];
        groupArr[gIndex] = this.getStubSelection(groupArr[gIndex - 1].selection,
          defaultClassName,
          new RegExp('\\sstyle=(["\'])([^\\1]+)\\1', 'g').exec(userStr),
          new RegExp('class=["\']([a-z\\d\\s]+)["\']','gi').exec(userStr),
          count);
      }
      else if (elem === closingTag) {
        // </FusionText> -  subtract the group index.
        gIndex -= 1;
      }
      // the element is not a FusionText tagged.
      else if (elem !== BLANKSTRING){
        g = groupArr[gIndex];
        t = arr[i];
        smartLabel.setStyle(g.style);
        textDim = smartLabel.getOriSize(t || BLANKSTRING);
        textArr.push({
          selection: g.selection,
          oriText: t,
          text: t,
          oriWidth: textDim.width,
          width: textDim.width,
          oriHeight: textDim.height,
          height: textDim.height
        });
      }
    }
  }
  return textArr;
};

FusionText.prototype.getLogicalSpace = function (selection, options) {
  selection && this.getParentSelection(selection);
  var config = this.config,
    smartLabel = this.getSmartLabelInstance(),
    maxDimensions = config.label.maxDimensions,
    margin = config.margin,
    hMargin = margin.left + margin.right,
    vMargin = margin.top + margin.bottom,
    maxWidth = (options && options.width || maxDimensions.width) - hMargin,
    maxHeight = (options && options.height || maxDimensions.height) - vMargin,
    smartText,
    height,
    width,
    i,
    len,
    textObj,
    labelBoundConfig = config.labelBound,
    boundRect = labelBoundConfig.customLogicalSpace || labelBoundConfig.defaultConfig.getLogicalSpace,
    // parse the entire text into seperable enitity.
    textArr = this.parsedText(),
    availableWidth = maxWidth,
    availableHeight = 0;
  // indivually calculate the FusionText text for each entity in textArr.
  for (i = 0, len = textArr.length; i < len; i += 1) {
    textObj = textArr[i];
    // check if it exceeds the available space.
    if (textObj.oriWidth > maxWidth || textObj.oriHeight > maxHeight) {
      smartText = smartLabel.getSmartText(textObj.oriText, availableWidth,
        maxHeight);
      textObj.text = smartText.text;
      textObj.width = smartText.width;
      textObj.height = smartText.height;
    }
    availableWidth -= textObj.width;
    availableHeight = mathMax(availableHeight, textObj.height);
  }

  height = availableHeight;
  width = maxWidth - availableWidth;
  return labelBoundConfig.hide ? {
    width: width + hMargin,
    height: height + vMargin
  } : boundRect(height, width, labelBoundConfig.style);
};

FusionText.prototype.tuneText = function (el, params) {
  var x = +el.attr('x'),
  y = +el.attr('y'),
  computedStyle = getComputedStyle(el.node(), BLANKSTRING),
  texts = str(params.text).split(/\n|<br\s*?\/?>/ig),
  fontSize = computedStyle ? toFloat(computedStyle.getPropertyValue("font-size")) : 10,
  lineHeight = fontSize * 1.2,
  valign = this.config.label.valign,
  bb;
  /*direction = (el.attr('direction') || (computedStyle ?
    computedStyle.getPropertyValue("direction") : "initial")).toLowerCase();*/

  valign = valign === 'top' ? -0.5 : (valign === 'bottom' ? 0.5 : 0);

  el.selectAll('tspan')
  .data(texts)
  .call(this.updateTuning, x, lineHeight, texts, valign)
  .enter()
  .append('tspan')
  .call(this.updateTuning, x, lineHeight, texts, valign);

  bb = el.node().getBBox();

  el.select('tspan')
  .attr('dy', y - (bb.y + bb.height / 2));

  return (texts.length - 1) * lineHeight;
};

FusionText.prototype.updateTuning = function (selection, x, lineHeight, texts, valign) {
  return selection.each(function (d, i) {
  d3Selection.select(this)
  .attr('x', x)
  .attr('dy', i ? lineHeight : lineHeight * texts.length * valign)
  .text(texts[i]);
  });
};









FusionText.prototype.setDrawingConfiguration = function (x, y, width, height) {
  var mes = this.measurement;

  if (util.isObject(x)) {
    y = x.y;
    width = x.width;
    height = x.height;
    x = x.x;
  }

  mes.x = x;
  mes.y = y;
  mes.width = width;
  mes.height = height;
  return this;
};


// Draw the fusion-text.
FusionText.prototype.draw = function () {
  return this
    .drawLabelBound.apply(this, arguments)
    .drawLabel.apply(this, arguments)
    .drawTracker.apply(this, arguments);
};
FusionText.prototype.drawLabelBound = function () {
  return this;
};
FusionText.prototype.drawLabel = function (selection, options) {
  if (options) {
    this.setDrawingConfiguration(options);
  }

  var graphics = this.graphics,
      labelArr = graphics.labelArr || (graphics.labelArr = []),
      measurement = this.measurement,
      margin = this.config.margin,
      x,
      y,
      i,
      len,
      width,
      height,
      textObj,
      label,
      sumX,
      textArr;

    x = x === undefined ? measurement.x : x;
    y = y === undefined ? measurement.y : y;
    width = width === undefined ? measurement.width : width;
    height = height === undefined ? measurement.height : height;

    this.getLogicalSpace(this.getParentSelection(selection), {
      width: width,
      height: height
    });
    textArr = this.textArr;

    x += margin.left;
    y += margin.top;

    sumX = x;
    // donot draw if height asked is 0
    if (width && height && (!isFinite(x) || !isFinite(y))) {
      return;
    }
    for (i = 0, len = textArr.length; i < len; i += 1) {
      textObj = textArr[i];
      if (!(label = labelArr[i])) {
        labelArr[i] = label = textObj.selection.append('text');
      }
      x = sumX;
      /*textObj.parentSelection.append('circle').attr('cx', x).attr('cy', y).attr('r', 3)
      console.log('x: ', x, 'y: ', y);*/
      label.attr('x', x)
      .attr('y', y);
      // .attr('text-anchor', 'top')
      // .text(textObj.text);
      y += this.tuneText(label, textObj);
      sumX += textObj.width;
    }

    return this;
};
FusionText.prototype.drawTracker = function () {
  return this;
};

FusionText.prototype.transform = function (str) {
  return this.getParentSelection()
  .attr('transform', str);
};



// Constructs a new fusionText generator with the default settings.
var fusiontext = function() {
  return new FusionText();
};

exports.fusiontext = fusiontext;

Object.defineProperty(exports, '__esModule', { value: true });

})));

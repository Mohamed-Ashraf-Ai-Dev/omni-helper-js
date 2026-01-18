/**
 * OmniHelper.js - JavaScript Utility Library
 * Version: 1.0.0
 * Description: A comprehensive JavaScript library providing data transformation, smart logging, micro animations, notifications, and utility functions.
 * Author: Mohamed Ashraf
 * Facebook: https://www.facebook.com/share/1Gf47LvFjv/
 * License: MIT
 */

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.OmniHelper = factory());
}(this, function() {
    'use strict';

    /**
     * OmniHelper Core Module
     * Provides a unified interface for all library modules
     */
    const OmniHelper = {
        version: '1.0.0',
        author: 'Mohamed Ashraf',
        facebook: 'https://www.facebook.com/share/1Gf47LvFjv/',
        
        // Modules
        Data: {},
        Log: {},
        Anim: {},
        Notify: {},
        Utils: {}
    };

    /**
     * ==========================================
     * MODULE 1: DATA TRANSFORMER
     * ==========================================
     */
    OmniHelper.Data = {
        /**
         * Transform data using a transformation function
         * @param {*} data - The data to transform
         * @param {Function} transformerFn - The transformation function
         * @returns {*} Transformed data
         */
        transform: function(data, transformerFn) {
            if (typeof transformerFn !== 'function') {
                throw new Error('Transformer function must be a function');
            }
            return transformerFn(data);
        },

        /**
         * Map over an array or object
         * @param {Array|Object} data - The data to map over
         * @param {Function} callback - The callback function
         * @returns {Array|Object} Mapped data
         */
        map: function(data, callback) {
            if (Array.isArray(data)) {
                return data.map(callback);
            } else if (typeof data === 'object' && data !== null) {
                const result = {};
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        result[key] = callback(data[key], key);
                    }
                }
                return result;
            }
            return data;
        },

        /**
         * Filter an array or object
         * @param {Array|Object} data - The data to filter
         * @param {Function} predicate - The predicate function
         * @returns {Array|Object} Filtered data
         */
        filter: function(data, predicate) {
            if (Array.isArray(data)) {
                return data.filter(predicate);
            } else if (typeof data === 'object' && data !== null) {
                const result = {};
                for (const key in data) {
                    if (data.hasOwnProperty(key) && predicate(data[key], key)) {
                        result[key] = data[key];
                    }
                }
                return result;
            }
            return data;
        },

        /**
         * Flatten nested data structures
         * @param {Array|Object} data - The data to flatten
         * @param {number} depth - The depth to flatten to (default: Infinity)
         * @returns {Array} Flattened array
         */
        flatten: function(data, depth) {
            depth = depth || Infinity;
            
            function flattenRecursive(item, currentDepth) {
                if (currentDepth >= depth) {
                    return [item];
                }
                
                if (Array.isArray(item)) {
                    let result = [];
                    for (let i = 0; i < item.length; i++) {
                        result = result.concat(flattenRecursive(item[i], currentDepth + 1));
                    }
                    return result;
                } else if (typeof item === 'object' && item !== null) {
                    let result = [];
                    for (const key in item) {
                        if (item.hasOwnProperty(key)) {
                            result = result.concat(flattenRecursive(item[key], currentDepth + 1));
                        }
                    }
                    return result;
                }
                return [item];
            }
            
            return flattenRecursive(data, 0);
        },

        /**
         * Flatten an array only
         * @param {Array} array - The array to flatten
         * @param {number} depth - The depth to flatten to
         * @returns {Array} Flattened array
         */
        flattenArray: function(array, depth) {
            if (!Array.isArray(array)) {
                throw new Error('Input must be an array');
            }
            return this.flatten(array, depth);
        },

        /**
         * Group data by a key
         * @param {Array} array - The array to group
         * @param {string|Function} key - The key to group by or a function
         * @returns {Object} Grouped object
         */
        groupBy: function(array, key) {
            if (!Array.isArray(array)) {
                throw new Error('Input must be an array');
            }
            
            const result = {};
            const getKey = typeof key === 'function' ? key : function(item) {
                return item[key];
            };
            
            for (let i = 0; i < array.length; i++) {
                const groupKey = getKey(array[i]);
                if (!result[groupKey]) {
                    result[groupKey] = [];
                }
                result[groupKey].push(array[i]);
            }
            
            return result;
        },

        /**
         * Sort array by key(s)
         * @param {Array} array - The array to sort
         * @param {string|Array} key - The key(s) to sort by
         * @param {string|Array} order - The order(s) ('asc' or 'desc')
         * @returns {Array} Sorted array
         */
        sortBy: function(array, key, order) {
            if (!Array.isArray(array)) {
                throw new Error('Input must be an array');
            }
            
            const keys = Array.isArray(key) ? key : [key];
            const orders = Array.isArray(order) ? order : [order || 'asc'];
            
            const sorted = array.slice();
            
            sorted.sort(function(a, b) {
                for (let i = 0; i < keys.length; i++) {
                    const k = keys[i];
                    const o = orders[i] || 'asc';
                    
                    let valA = a[k];
                    let valB = b[k];
                    
                    if (typeof valA === 'string') valA = valA.toLowerCase();
                    if (typeof valB === 'string') valB = valB.toLowerCase();
                    
                    if (valA < valB) return o === 'asc' ? -1 : 1;
                    if (valA > valB) return o === 'asc' ? 1 : -1;
                }
                return 0;
            });
            
            return sorted;
        },

        /**
         * Parse JSON with error handling
         * @param {string} jsonString - The JSON string to parse
         * @param {*} defaultValue - The default value if parsing fails
         * @returns {*} Parsed object or default value
         */
        deepParse: function(jsonString, defaultValue) {
            if (typeof jsonString !== 'string') {
                return defaultValue !== undefined ? defaultValue : jsonString;
            }
            
            try {
                return JSON.parse(jsonString);
            } catch (e) {
                console.warn('OmniHelper: Failed to parse JSON', e);
                return defaultValue !== undefined ? defaultValue : null;
            }
        },

        /**
         * Serialize data to JSON string
         * @param {*} data - The data to serialize
         * @param {number} indent - The indentation (pretty print)
         * @returns {string} JSON string
         */
        serialize: function(data, indent) {
            if (indent !== undefined) {
                return JSON.stringify(data, null, indent);
            }
            return JSON.stringify(data);
        },

        /**
         * Convert a value to a specific type
         * @param {*} value - The value to convert
         * @param {string} targetType - The target type ('string', 'number', 'boolean', 'array', 'object')
         * @returns {*} Converted value
         */
        convertType: function(value, targetType) {
            const type = targetType.toLowerCase();
            
            switch (type) {
                case 'string':
                    if (value === null || value === undefined) return '';
                    if (Array.isArray(value)) return JSON.stringify(value);
                    if (typeof value === 'object') return JSON.stringify(value);
                    return String(value);
                
                case 'number':
                    const num = Number(value);
                    return isNaN(num) ? 0 : num;
                
                case 'boolean':
                    if (value === 'true' || value === '1' || value === 1) return true;
                    if (value === 'false' || value === '0' || value === 0) return false;
                    return Boolean(value);
                
                case 'array':
                    if (Array.isArray(value)) return value;
                    if (value === null || value === undefined) return [];
                    if (typeof value === 'string') {
                        try {
                            return JSON.parse(value);
                        } catch (e) {
                            return [value];
                        }
                    }
                    return [value];
                
                case 'object':
                    if (value === null || value === undefined) return {};
                    if (typeof value === 'object') return value;
                    if (typeof value === 'string') {
                        try {
                            return JSON.parse(value);
                        } catch (e) {
                            return { value: value };
                        }
                    }
                    return { value: value };
                
                default:
                    return value;
            }
        },

        /**
         * Create a pipeline of transformations
         * @param {...Function} functions - The transformation functions
         * @returns {Function} Combined transformation function
         */
        pipe: function() {
            const functions = Array.prototype.slice.call(arguments);
            
            return function(value) {
                return functions.reduce(function(acc, fn) {
                    return fn(acc);
                }, value);
            };
        },

        /**
         * Extract specific fields from objects
         * @param {Array} array - The array of objects
         * @param {...string} keys - The keys to extract
         * @returns {Array} Array with only specified keys
         */
        pluck: function(array) {
            if (!Array.isArray(array)) {
                throw new Error('Input must be an array');
            }
            
            const keys = Array.prototype.slice.call(arguments, 1);
            
            if (keys.length === 0) {
                return array;
            }
            
            return array.map(function(item) {
                const result = {};
                for (let i = 0; i < keys.length; i++) {
                    if (item.hasOwnProperty(keys[i])) {
                        result[keys[i]] = item[keys[i]];
                    }
                }
                return result;
            });
        },

        /**
         * Reduce data to a single value
         * @param {Array} array - The array to reduce
         * @param {Function} callback - The reduce callback
         * @param {*} initialValue - The initial value
         * @returns {*} The reduced value
         */
        reduce: function(array, callback, initialValue) {
            if (!Array.isArray(array)) {
                throw new Error('Input must be an array');
            }
            return array.reduce(callback, initialValue);
        }
    };

    /**
     * ==========================================
     * MODULE 2: SMART LOGGER
     * ==========================================
     */
    OmniHelper.Log = {
        // Styles for different log types
        styles: {
            info: 'color: #3B82F6; background: #EBF5FF; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
            success: 'color: #10B981; background: #ECFDF5; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
            warning: 'color: #F59E0B; background: #FFFBEB; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
            error: 'color: #EF4444; background: #FEF2F2; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
            debug: 'color: #8B5CF6; background: #F5F3FF; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
            trace: 'color: #6B7280; font-style: italic;',
            custom: 'color: #374151; background: #F9FAFB; padding: 4px 8px; border-radius: 4px;'
        },

        /**
         * Check if running in browser or Node.js
         */
        isBrowser: function() {
            return typeof window !== 'undefined';
        },

        /**
         * Log a message with optional data
         * @param {string} message - The message to log
         * @param {string} type - The log type (info, success, warning, error, debug)
         * @param {*} data - Optional data to log
         */
        log: function(message, type, data) {
            const logType = type || 'info';
            const style = this.styles[logType] || this.styles.custom;
            
            if (this.isBrowser()) {
                console.log(`%c[${logType.toUpperCase()}]%c ${message}`, style, 'color: inherit;', data);
            } else {
                const colors = {
                    info: '\x1b[34m',
                    success: '\x1b[32m',
                    warning: '\x1b[33m',
                    error: '\x1b[31m',
                    debug: '\x1b[35m'
                };
                const color = colors[logType] || '\x1b[0m';
                console.log(`${color}[${logType.toUpperCase()}]${color} ${message}\x1b[0m`, data);
            }
        },

        /**
         * Log info message
         * @param {string} message - The message
         * @param {*} data - Optional data
         */
        info: function(message, data) {
            this.log(message, 'info', data);
        },

        /**
         * Log success message
         * @param {string} message - The message
         * @param {*} data - Optional data
         */
        success: function(message, data) {
            this.log(message, 'success', data);
        },

        /**
         * Log warning message
         * @param {string} message - The message
         * @param {*} data - Optional data
         */
        warn: function(message, data) {
            this.log(message, 'warning', data);
        },

        /**
         * Log error message
         * @param {string} message - The message
         * @param {*} data - Optional data
         */
        error: function(message, data) {
            this.log(message, 'error', data);
        },

        /**
         * Log debug message
         * @param {string} message - The message
         * @param {*} data - Optional data
         */
        debug: function(message, data) {
            this.log(message, 'debug', data);
        },

        /**
         * Log data as a table
         * @param {Array|Object} data - The data to display
         * @param {Array} columns - Optional column names
         */
        table: function(data, columns) {
            if (columns && Array.isArray(data)) {
                const tableData = data.map(function(item) {
                    const row = {};
                    columns.forEach(function(col) {
                        row[col] = item[col];
                    });
                    return row;
                });
                console.table(tableData);
            } else {
                console.table(data);
            }
        },

        /**
         * Start a log group
         * @param {string} name - The group name
         * @param {boolean} collapsed - Whether the group should be collapsed
         */
        group: function(name, collapsed) {
            if (collapsed) {
                console.groupCollapsed(name);
            } else {
                console.group(name);
            }
        },

        /**
         * End a log group
         */
        groupEnd: function() {
            console.groupEnd();
        },

        /**
         * Start a timer
         * @param {string} name - The timer name
         */
        time: function(name) {
            console.time(name);
        },

        /**
         * End a timer
         * @param {string} name - The timer name
         */
        timeEnd: function(name) {
            console.timeEnd(name);
        },

        /**
         * Log stack trace
         */
        trace: function() {
            console.trace();
        },

        /**
         * Clear console
         */
        clear: function() {
            console.clear();
        },

        /**
         * Assert a condition
         * @param {boolean} condition - The condition to assert
         * @param {string} message - The message if assertion fails
         */
        assert: function(condition, message) {
            console.assert(condition, message);
        },

        /**
         * Count occurrences
         * @param {string} label - The label
         * @returns {number} The count
         */
        count: function(label) {
            console.count(label);
            return console.count(label);
        },

        /**
         * Reset a counter
         * @param {string} label - The label
         */
        countReset: function(label) {
            console.countReset(label);
        },

        /**
         * Log with custom style
         * @param {string} message - The message
         * @param {string} style - The CSS style string
         * @param {*} data - Optional data
         */
        custom: function(message, style, data) {
            if (this.isBrowser()) {
                console.log(`%c ${message}`, style, data);
            } else {
                console.log(message, data);
            }
        }
    };

    /**
     * ==========================================
     * MODULE 3: MICRO ANIMATIONS
     * ==========================================
     */
    OmniHelper.Anim = {
        // Easing functions
        easings: {
            linear: 'linear',
            ease: 'ease',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out',
            cubicBezier: function(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            },
            elastic: function(t) {
                const c4 = (2 * Math.PI) / 3;
                return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
            },
            bounce: function(t) {
                const n1 = 7.5625;
                const d1 = 2.75;
                if (t < 1 / d1) {
                    return n1 * t * t;
                } else if (t < 2 / d1) {
                    return n1 * (t -= 1.5 / d1) * t + 0.75;
                } else if (t < 2.5 / d1) {
                    return n1 * (t -= 2.25 / d1) * t + 0.9375;
                } else {
                    return n1 * (t -= 2.625 / d1) * t + 0.984375;
                }
            }
        },

        /**
         * Get element (works with selector or element)
         * @param {string|Element} element - The element or selector
         * @returns {Element} The DOM element
         */
        getElement: function(element) {
            if (typeof element === 'string') {
                return document.querySelector(element);
            }
            return element;
        },

        /**
         * Apply CSS custom properties for animation
         * @param {Element} el - The element
         * @param {Object} properties - The CSS properties
         */
        applyAnimationStyles: function(el, properties) {
            const prefix = '--omni-anim-';
            for (const key in properties) {
                if (properties.hasOwnProperty(key)) {
                    el.style.setProperty(prefix + key, properties[key]);
                }
            }
        },

        /**
         * Main animation function
         * @param {string|Element} element - The element or selector
         * @param {Object} properties - The CSS properties to animate
         * @param {number} duration - Duration in milliseconds
         * @param {string|Function} easing - The easing function
         * @param {Function} callback - Callback when animation completes
         */
        animate: function(element, properties, duration, easing, callback) {
            const el = this.getElement(element);
            if (!el) {
                console.warn('OmniHelper.Anim: Element not found');
                return;
            }

            duration = duration || 300;
            easing = easing || 'ease';

            const animationProperties = {
                duration: duration + 'ms',
                easing: typeof easing === 'function' ? 'linear' : easing,
                fill: 'forwards'
            };

            const cssProperties = {};
            for (const prop in properties) {
                if (properties.hasOwnProperty(prop)) {
                    cssProperties[prop] = properties[prop];
                }
            }

            if (typeof easing === 'function') {
                // Custom easing - use CSS animation with keyframes
                const animationName = 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                this.createKeyframes(animationName, duration, easing);
                el.style.animation = `${animationName} ${duration}ms linear forwards`;
                
                setTimeout(function() {
                    el.style.animation = '';
                    if (typeof callback === 'function') {
                        callback();
                    }
                }, duration);
            } else {
                // Standard easing - use Web Animations API
                if (el.animate) {
                    el.animate(cssProperties, animationProperties).onfinish = function() {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    };
                } else {
                    // Fallback to CSS transitions
                    el.style.transition = `all ${duration}ms ${easing}`;
                    for (const prop in cssProperties) {
                        if (cssProperties.hasOwnProperty(prop)) {
                            el.style[prop] = cssProperties[prop];
                        }
                    }
                    setTimeout(function() {
                        el.style.transition = '';
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }, duration);
                }
            }
        },

        /**
         * Create CSS keyframes for custom easing
         * @param {string} name - Animation name
         * @param {number} duration - Duration in ms
         * @param {Function} easing - Easing function
         */
        createKeyframes: function(name, duration, easing) {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ${name} {
                    ${Array.from({ length: 101 }, function(_, i) {
                        const t = i / 100;
                        const value = easing(t);
                        return `${i}% { transform: scaleX(${value}); }`;
                    }).join('\n')}
                }
            `;
            document.head.appendChild(style);
        },

        /**
         * Fade in element
         * @param {string|Element} element - The element or selector
         * @param {number} duration - Duration in milliseconds
         * @param {Function} callback - Callback when complete
         */
        fadeIn: function(element, duration, callback) {
            const el = this.getElement(element);
            if (!el) return;

            const currentOpacity = parseFloat(window.getComputedStyle(el).opacity) || 0;
            
            if (currentOpacity === 1) {
                if (typeof callback === 'function') callback();
                return;
            }

            el.style.opacity = currentOpacity;
            el.style.display = '';
            
            this.animate(el, { opacity: 1 }, duration || 300, 'ease', callback);
        },

        /**
         * Fade out element
         * @param {string|Element} element - The element or selector
         * @param {number} duration - Duration in milliseconds
         * @param {Function} callback - Callback when complete
         */
        fadeOut: function(element, duration, callback) {
            const el = this.getElement(element);
            if (!el) return;

            el.style.display = 'block';
            
            this.animate(el, { opacity: 0 }, duration || 300, 'ease', function() {
                el.style.display = 'none';
                el.style.opacity = '';
                if (typeof callback === 'function') callback();
            });
        },

        /**
         * Slide element down
         * @param {string|Element} element - The element or selector
         * @param {number} duration - Duration in milliseconds
         * @param {Function} callback - Callback when complete
         */
        slideDown: function(element, duration, callback) {
            const el = this.getElement(element);
            if (!el) return;

            el.style.display = '';
            el.style.overflow = 'hidden';
            
            const height = el.offsetHeight;
            el.style.height = '0';
            
            this.animate(el, { height: height + 'px' }, duration || 300, 'ease', function() {
                el.style.height = '';
                el.style.overflow = '';
                if (typeof callback === 'function') callback();
            });
        },

        /**
         * Slide element up
         * @param {string|Element} element - The element or selector
         * @param {number} duration - Duration in milliseconds
         * @param {Function} callback - Callback when complete
         */
        slideUp: function(element, duration, callback) {
            const el = this.getElement(element);
            if (!el) return;

            const height = el.offsetHeight;
            el.style.height = height + 'px';
            el.style.overflow = 'hidden';
            
            this.animate(el, { height: '0' }, duration || 300, 'ease', function() {
                el.style.display = 'none';
                el.style.height = '';
                el.style.overflow = '';
                if (typeof callback === 'function') callback();
            });
        },

        /**
         * Toggle slide animation
         * @param {string|Element} element - The element or selector
         * @param {number} duration - Duration in milliseconds
         * @param {Function} callback - Callback when complete
         */
        slideToggle: function(element, duration, callback) {
            const el = this.getElement(element);
            if (!el) return;

            const computedStyle = window.getComputedStyle(el);
            const display = computedStyle.display;
            
            if (display === 'none' || display === '') {
                this.slideDown(el, duration, callback);
            } else {
                this.slideUp(el, duration, callback);
            }
        },

        /**
         * Bounce animation
         * @param {string|Element} element - The element or selector
         * @param {number} times - Number of bounces
         * @param {number} duration - Duration per bounce
         * @param {Function} callback - Callback when complete
         */
        bounce: function(element, times, duration, callback) {
            const el = this.getElement(element);
            if (!el) return;

            times = times || 3;
            duration = duration || 500;
            const singleDuration = duration / (times * 2);
            let count = 0;
            const self = this;

            function doBounce() {
                if (count < times) {
                    self.animate(el, { transform: 'translateY(-20px)' }, singleDuration, 'easeOutQuad', function() {
                        self.animate(el, { transform: 'translateY(0)' }, singleDuration, 'easeInQuad', function() {
                            count++;
                            doBounce();
                        });
                    });
                } else {
                    if (typeof callback === 'function') callback();
                }
            }
            
            doBounce();
        },

        /**
         * Shake animation
         * @param {string|Element} element - The element or selector
         * @param {number} times - Number of shakes
         * @param {number} duration - Duration per shake
         * @param {Function} callback - Callback when complete
         */
        shake: function(element, times, duration, callback) {
            const el = this.getElement(element);
            if (!el) return;

            times = times || 3;
            duration = duration || 500;
            const singleDuration = duration / (times * 4);
            let count = 0;
            const self = this;

            function doShake() {
                if (count < times) {
                    self.animate(el, { transform: 'translateX(-10px)' }, singleDuration, 'linear', function() {
                        self.animate(el, { transform: 'translateX(10px)' }, singleDuration, 'linear', function() {
                            self.animate(el, { transform: 'translateX(-10px)' }, singleDuration, 'linear', function() {
                                self.animate(el, { transform: 'translateX(0)' }, singleDuration, 'linear', function() {
                                    count++;
                                    doShake();
                                });
                            });
                        });
                    });
                } else {
                    if (typeof callback === 'function') callback();
                }
            }
            
            doShake();
        },

        /**
         * Pulse animation
         * @param {string|Element} element - The element or selector
         * @param {number} times - Number of pulses
         * @param {number} duration - Duration per pulse
         * @param {Function} callback - Callback when complete
         */
        pulse: function(element, times, duration, callback) {
            const el = this.getElement(element);
            if (!el) return;

            times = times || 2;
            duration = duration || 1000;
            const singleDuration = duration / (times * 2);
            let count = 0;
            const self = this;

            function doPulse() {
                if (count < times) {
                    self.animate(el, { transform: 'scale(1.05)' }, singleDuration, 'ease', function() {
                        self.animate(el, { transform: 'scale(1)' }, singleDuration, 'ease', function() {
                            count++;
                            doPulse();
                        });
                    });
                } else {
                    if (typeof callback === 'function') callback();
                }
            }
            
            doPulse();
        },

        /**
         * Zoom in animation
         * @param {string|Element} element - The element or selector
         * @param {number} duration - Duration in milliseconds
         * @param {Function} callback - Callback when complete
         */
        zoomIn: function(element, duration, callback) {
            const el = this.getElement(element);
            if (!el) return;

            el.style.display = '';
            el.style.opacity = '0';
            el.style.transform = 'scale(0.5)';
            
            this.animate(el, { opacity: 1, transform: 'scale(1)' }, duration || 300, 'ease', callback);
        },

        /**
         * Zoom out animation
         * @param {string|Element} element - The element or selector
         * @param {number} duration - Duration in milliseconds
         * @param {Function} callback - Callback when complete
         */
        zoomOut: function(element, duration, callback) {
            const el = this.getElement(element);
            if (!el) return;

            this.animate(el, { opacity: 0, transform: 'scale(0.5)' }, duration || 300, 'ease', function() {
                el.style.display = 'none';
                el.style.opacity = '';
                el.style.transform = '';
                if (typeof callback === 'function') callback();
            });
        },

        /**
         * Rotate animation
         * @param {string|Element} element - The element or selector
         * @param {number} degrees - Degrees to rotate
         * @param {number} duration - Duration in milliseconds
         * @param {Function} callback - Callback when complete
         */
        rotate: function(element, degrees, duration, callback) {
            this.animate(element, { transform: 'rotate(' + degrees + 'deg)' }, duration || 300, 'ease', callback);
        },

        /**
         * Translate animation
         * @param {string|Element} element - The element or selector
         * @param {number} x - X translation in pixels
         * @param {number} y - Y translation in pixels
         * @param {number} duration - Duration in milliseconds
         * @param {Function} callback - Callback when complete
         */
        translate: function(element, x, y, duration, callback) {
            this.animate(element, { transform: 'translate(' + x + 'px, ' + y + 'px)' }, duration || 300, 'ease', callback);
        },

        /**
         * Scale animation
         * @param {string|Element} element - The element or selector
         * @param {number} scale - Scale factor
         * @param {number} duration - Duration in milliseconds
         * @param {Function} callback - Callback when complete
         */
        scale: function(element, scale, duration, callback) {
            this.animate(element, { transform: 'scale(' + scale + ')' }, duration || 300, 'ease', callback);
        },

        /**
         * Animate CSS properties using JavaScript
         * @param {string|Element} element - The element or selector
         * @param {string} animationName - The animation name
         * @param {number} duration - Duration in milliseconds
         * @param {Function} callback - Callback when complete
         */
        animateCSS: function(element, animationName, duration, callback) {
            const el = this.getElement(element);
            if (!el) return;

            // Remove existing animation classes
            el.classList.remove('omni-animate');
            
            // Force reflow
            void el.offsetWidth;
            
            // Add animation class with inline styles
            const animId = 'omni-anim-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            const style = document.createElement('style');
            style.textContent = `
                .${animId} {
                    animation: ${animationName} ${duration || 300}ms ease forwards;
                }
                @keyframes ${animationName} {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            el.classList.add(animId);
            
            setTimeout(function() {
                el.classList.remove(animId);
                style.remove();
                if (typeof callback === 'function') callback();
            }, duration || 300);
        },

        /**
         * Stop all animations on an element
         * @param {string|Element} element - The element or selector
         */
        stop: function(element) {
            const el = this.getElement(element);
            if (!el) return;

            el.style.animation = '';
            el.style.transition = '';
            el.style.transform = '';
            el.style.opacity = '';
            el.style.height = '';
            el.style.width = '';
        }
    };

    /**
     * ==========================================
     * MODULE 4: NOTIFIER (Toast Notifications)
     * ==========================================
     */
    OmniHelper.Notify = {
        // Notification types and their configurations
        types: {
            info: { background: '#3B82F6', icon: 'ℹ️' },
            success: { background: '#10B981', icon: '✓' },
            warning: { background: '#F59E0B', icon: '⚠️' },
            error: { background: '#EF4444', icon: '✕' }
        },

        // Container for notifications
        container: null,
        queue: [],
        activeCount: 0,

        /**
         * Initialize notification container
         */
        initContainer: function() {
            if (this.container) return;

            this.container = document.createElement('div');
            this.container.id = 'omni-notify-container';
            this.container.innerHTML = this.getContainerStyles();
            document.body.appendChild(this.container);
        },

        /**
         * Get container styles
         */
        getContainerStyles: function() {
            return '';
        },

        /**
         * Show a notification
         * @param {string} message - The notification message
         * @param {string} type - The notification type (info, success, warning, error)
         * @param {number} duration - Duration in milliseconds
         * @param {string} position - Position (top-right, top-left, bottom-right, bottom-left)
         */
        notify: function(message, type, duration, position) {
            const self = this;
            const config = this.types[type] || this.types.info;
            
            // Initialize container if needed
            this.initContainer();

            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'omni-notify-toast';
            notification.style.cssText = this.getToastStyles(config, position);
            
            notification.innerHTML = `
                <div class="omni-notify-icon">${config.icon}</div>
                <div class="omni-notify-message">${message}</div>
                <div class="omni-notify-close">×</div>
            `;

            // Add to container
            this.container.appendChild(notification);

            // Click to close
            notification.querySelector('.omni-notify-close').addEventListener('click', function() {
                self.removeNotification(notification);
            });

            // Auto remove after duration
            duration = duration || 3000;
            if (duration > 0) {
                notification.timeoutId = setTimeout(function() {
                    self.removeNotification(notification);
                }, duration);
            }

            // Add entrance animation
            requestAnimationFrame(function() {
                notification.style.transform = 'translateX(0)';
                notification.style.opacity = '1';
            });

            this.activeCount++;
        },

        /**
         * Get toast styles
         * @param {Object} config - Notification config
         * @param {string} position - Position
         */
        getToastStyles: function(config, position) {
            const pos = position || 'top-right';
            let horizontal = 'right';
            let vertical = 'top';
            
            if (pos.indexOf('left') !== -1) horizontal = 'left';
            if (pos.indexOf('bottom') !== -1) vertical = 'bottom';

            return `
                position: fixed;
                ${vertical}: 20px;
                ${horizontal}: 20px;
                display: flex;
                align-items: center;
                padding: 12px 16px;
                background: ${config.background};
                color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                z-index: 99999;
                min-width: 250px;
                max-width: 400px;
                transform: translateX(${horizontal === 'right' ? '120%' : '-120%'});
                opacity: 0;
                transition: all 0.3s ease;
                margin-bottom: 10px;
            `;
        },

        /**
         * Remove a notification
         * @param {Element} notification - The notification element
         */
        removeNotification: function(notification) {
            if (notification.timeoutId) {
                clearTimeout(notification.timeoutId);
            }

            notification.style.transform = notification.style.right !== '' 
                ? 'translateX(120%)' 
                : 'translateX(-120%)';
            notification.style.opacity = '0';

            const self = this;
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                self.activeCount = Math.max(0, self.activeCount - 1);
                self.processQueue();
            }, 300);
        },

        /**
         * Process notification queue
         */
        processQueue: function() {
            // Reserved for future queue processing
        },

        /**
         * Show info notification
         * @param {string} message - The message
         * @param {number} duration - Duration
         */
        info: function(message, duration) {
            this.notify(message, 'info', duration);
        },

        /**
         * Show success notification
         * @param {string} message - The message
         * @param {number} duration - Duration
         */
        success: function(message, duration) {
            this.notify(message, 'success', duration);
        },

        /**
         * Show warning notification
         * @param {string} message - The message
         * @param {number} duration - Duration
         */
        warning: function(message, duration) {
            this.notify(message, 'warning', duration);
        },

        /**
         * Show error notification
         * @param {string} message - The message
         * @param {number} duration - Duration
         */
        error: function(message, duration) {
            this.notify(message, 'error', duration);
        },

        /**
         * Remove all notifications
         */
        removeAll: function() {
            if (!this.container) return;

            const toasts = this.container.querySelectorAll('.omni-notify-toast');
            for (let i = 0; i < toasts.length; i++) {
                this.removeNotification(toasts[i]);
            }
        },

        /**
         * Set default options
         * @param {Object} options - Default options
         */
        setDefaultOptions: function(options) {
            if (options.duration) {
                this.defaultDuration = options.duration;
            }
            if (options.position) {
                this.defaultPosition = options.position;
            }
        }
    };

    /**
     * ==========================================
     * MODULE 5: UTILITY FUNCTIONS
     * ==========================================
     */
    OmniHelper.Utils = {
        /**
         * Debounce a function
         * @param {Function} fn - The function to debounce
         * @param {number} delay - Delay in milliseconds
         * @returns {Function} Debounced function
         */
        debounce: function(fn, delay) {
            let timeoutId;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            };
        },

        /**
         * Throttle a function
         * @param {Function} fn - The function to throttle
         * @param {number} limit - Time limit in milliseconds
         * @returns {Function} Throttled function
         */
        throttle: function(fn, limit) {
            let inThrottle;
            let lastResult;
            return function() {
                const context = this;
                const args = arguments;
                if (!inThrottle) {
                    lastResult = fn.apply(context, args);
                    inThrottle = true;
                    setTimeout(function() {
                        inThrottle = false;
                    }, limit);
                }
                return lastResult;
            };
        },

        /**
         * Deep clone an object
         * @param {*} obj - The object to clone
         * @returns {*} Cloned object
         */
        deepClone: function(obj) {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }

            if (obj instanceof Date) {
                return new Date(obj.getTime());
            }

            if (obj instanceof Array) {
                return obj.map(function(item) {
                    return this.deepClone(item);
                }, this);
            }

            if (typeof obj === 'object') {
                const cloned = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        cloned[key] = this.deepClone(obj[key]);
                    }
                }
                return cloned;
            }

            return obj;
        },

        /**
         * Deep merge two objects
         * @param {Object} target - Target object
         * @param {Object} source - Source object
         * @returns {Object} Merged object
         */
        deepMerge: function(target, source) {
            const self = this;
            const result = this.deepClone(target);

            if (this.isObject(target) && this.isObject(source)) {
                for (const key in source) {
                    if (source.hasOwnProperty(key)) {
                        if (this.isObject(source[key])) {
                            if (!target[key]) {
                                result[key] = {};
                            }
                            result[key] = self.deepMerge(target[key], source[key]);
                        } else {
                            result[key] = source[key];
                        }
                    }
                }
            }

            return result;
        },

        /**
         * Pick specific keys from an object
         * @param {Object} obj - The object
         * @param {Array} keys - The keys to pick
         * @returns {Object} New object with picked keys
         */
        pick: function(obj, keys) {
            if (!this.isObject(obj)) return {};
            if (!Array.isArray(keys)) keys = [keys];

            const result = {};
            keys.forEach(function(key) {
                if (obj.hasOwnProperty(key)) {
                    result[key] = obj[key];
                }
            });
            return result;
        },

        /**
         * Omit specific keys from an object
         * @param {Object} obj - The object
         * @param {Array} keys - The keys to omit
         * @returns {Object} New object without omitted keys
         */
        omit: function(obj, keys) {
            if (!this.isObject(obj)) return {};
            if (!Array.isArray(keys)) keys = [keys];

            const result = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key) && keys.indexOf(key) === -1) {
                    result[key] = obj[key];
                }
            }
            return result;
        },

        /**
         * Get value from nested object using dot notation
         * @param {Object} obj - The object
         * @param {string} path - The path (e.g., 'user.profile.name')
         * @param {*} defaultValue - Default value if path not found
         * @returns {*} The value
         */
        get: function(obj, path, defaultValue) {
            if (!this.isObject(obj)) return defaultValue;

            const keys = path.split('.');
            let current = obj;

            for (let i = 0; i < keys.length; i++) {
                if (current === null || current === undefined) {
                    return defaultValue;
                }
                current = current[keys[i]];
            }

            return current !== undefined ? current : defaultValue;
        },

        /**
         * Set value in nested object using dot notation
         * @param {Object} obj - The object
         * @param {string} path - The path
         * @param {*} value - The value to set
         * @returns {Object} The modified object
         */
        set: function(obj, path, value) {
            if (!this.isObject(obj)) return obj;

            const keys = path.split('.');
            let current = obj;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return obj;
        },

        /**
         * Delete value from nested object
         * @param {Object} obj - The object
         * @param {string} path - The path
         * @returns {boolean} Whether deletion was successful
         */
        delete: function(obj, path) {
            if (!this.isObject(obj)) return false;

            const keys = path.split('.');
            let current = obj;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) return false;
                current = current[keys[i]];
            }

            return delete current[keys[keys.length - 1]];
        },

        /**
         * Check if path exists in object
         * @param {Object} obj - The object
         * @param {string} path - The path
         * @returns {boolean} Whether path exists
         */
        has: function(obj, path) {
            if (!this.isObject(obj)) return false;

            const keys = path.split('.');
            let current = obj;

            for (let i = 0; i < keys.length; i++) {
                if (current === null || current === undefined) {
                    return false;
                }
                if (!current.hasOwnProperty(keys[i])) {
                    return false;
                }
                current = current[keys[i]];
            }

            return true;
        },

        /**
         * Check if value is empty
         * @param {*} value - The value
         * @returns {boolean} Whether value is empty
         */
        isEmpty: function(value) {
            if (value === null || value === undefined) return true;
            if (typeof value === 'string' && value.trim() === '') return true;
            if (Array.isArray(value) && value.length === 0) return true;
            if (typeof value === 'object' && Object.keys(value).length === 0) return true;
            return false;
        },

        /**
         * Check if two values are equal
         * @param {*} a - First value
         * @param {*} b - Second value
         * @returns {boolean} Whether values are equal
         */
        isEqual: function(a, b) {
            if (a === b) return true;
            if (a === null || b === null) return a === b;
            if (typeof a !== typeof b) return false;

            if (typeof a === 'object') {
                if (Array.isArray(a) !== Array.isArray(b)) return false;
                if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
                if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();

                const keysA = Object.keys(a);
                const keysB = Object.keys(b);

                if (keysA.length !== keysB.length) return false;

                for (let i = 0; i < keysA.length; i++) {
                    if (!b.hasOwnProperty(keysA[i])) return false;
                    if (!this.isEqual(a[keysA[i]], b[keysA[i]])) return false;
                }

                return true;
            }

            return false;
        },

        /**
         * Generate random number between min and max
         * @param {number} min - Minimum
         * @param {number} max - Maximum
         * @returns {number} Random number
         */
        random: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * Generate random hex color
         * @returns {string} Random hex color
         */
        randomColor: function() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

        /**
         * Shuffle an array
         * @param {Array} array - The array
         * @returns {Array} Shuffled array
         */
        shuffle: function(array) {
            if (!Array.isArray(array)) return [];
            
            const shuffled = array.slice();
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        /**
         * Get unique values from array
         * @param {Array} array - The array
         * @returns {Array} Array with unique values
         */
        unique: function(array) {
            if (!Array.isArray(array)) return [];
            return array.filter(function(value, index, self) {
                return self.indexOf(value) === index;
            });
        },

        /**
         * Split array into chunks
         * @param {Array} array - The array
         * @param {number} size - Chunk size
         * @returns {Array} Array of chunks
         */
        chunk: function(array, size) {
            if (!Array.isArray(array)) return [];
            size = size || 1;

            const chunks = [];
            for (let i = 0; i < array.length; i += size) {
                chunks.push(array.slice(i, i + size));
            }
            return chunks;
        },

        /**
         * Remove falsy values from array
         * @param {Array} array - The array
         * @returns {Array} Compacted array
         */
        compact: function(array) {
            if (!Array.isArray(array)) return [];
            return array.filter(function(value) {
                return value !== null && value !== undefined && value !== false && value !== 0 && value !== '';
            });
        },

        /**
         * Sum array values
         * @param {Array} array - The array
         * @returns {number} Sum
         */
        sum: function(array) {
            if (!Array.isArray(array)) return 0;
            return array.reduce(function(acc, val) {
                return acc + (Number(val) || 0);
            }, 0);
        },

        /**
         * Calculate mean of array
         * @param {Array} array - The array
         * @returns {number} Mean
         */
        mean: function(array) {
            if (!Array.isArray(array) || array.length === 0) return 0;
            return this.sum(array) / array.length;
        },

        /**
         * Key array by a property
         * @param {Array} array - The array
         * @param {string} key - The key property
         * @returns {Object} Object keyed by property
         */
        keyBy: function(array, key) {
            if (!Array.isArray(array)) return {};
            
            const result = {};
            array.forEach(function(item) {
                result[item[key]] = item;
            });
            return result;
        },

        /**
         * Capitalize string
         * @param {string} str - The string
         * @returns {string} Capitalized string
         */
        capitalize: function(str) {
            if (typeof str !== 'string' || str === '') return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        },

        /**
         * Convert to camelCase
         * @param {string} str - The string
         * @returns {string} camelCase string
         */
        camelCase: function(str) {
            if (typeof str !== 'string') return '';
            return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
                if (+match === 0) return '';
                return index === 0 ? match.toLowerCase() : match.toUpperCase();
            });
        },

        /**
         * Convert to kebab-case
         * @param {string} str - The string
         * @returns {string} kebab-case string
         */
        kebabCase: function(str) {
            if (typeof str !== 'string') return '';
            return str.replace(/([a-z])([A-Z])/g, '$1-$2')
                      .replace(/[\s_]+/g, '-')
                      .toLowerCase();
        },

        /**
         * Convert to snake_case
         * @param {string} str - The string
         * @returns {string} snake_case string
         */
        snakeCase: function(str) {
            if (typeof str !== 'string') return '';
            return str.replace(/([a-z])([A-Z])/g, '$1_$2')
                      .replace(/[\s-]+/g, '_')
                      .toLowerCase();
        },

        /**
         * Convert to Start Case
         * @param {string} str - The string
         * @returns {string} Start Case string
         */
        startCase: function(str) {
            if (typeof str !== 'string') return '';
            return str.replace(/_|-|\s+/g, ' ')
                      .replace(/\w\S*/g, function(txt) {
                          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                      });
        },

        /**
         * Truncate string
         * @param {string} str - The string
         * @param {number} length - Maximum length
         * @param {string} suffix - Suffix to add
         * @returns {string} Truncated string
         */
        truncate: function(str, length, suffix) {
            if (typeof str !== 'string') return '';
            if (str.length <= length) return str;
            
            suffix = suffix || '...';
            return str.substring(0, length - suffix.length) + suffix;
        },

        /**
         * Repeat string
         * @param {string} str - The string
         * @param {number} times - Number of times
         * @returns {string} Repeated string
         */
        repeat: function(str, times) {
            if (typeof str !== 'string') return '';
            return str.repeat(times);
        },

        /**
         * Pad string
         * @param {string} str - The string
         * @param {number} length - Target length
         * @param {string} chars - Padding characters
         * @returns {string} Padded string
         */
        pad: function(str, length, chars) {
            if (typeof str !== 'string') return '';
            chars = chars || ' ';
            
            const padLength = length - str.length;
            if (padLength <= 0) return str;
            
            const left = Math.floor(padLength / 2);
            const right = padLength - left;
            
            return chars.repeat(left) + str + chars.repeat(right);
        },

        /**
         * Sleep/delay
         * @param {number} ms - Milliseconds
         * @returns {Promise} Promise that resolves after delay
         */
        sleep: function(ms) {
            return new Promise(function(resolve) {
                setTimeout(resolve, ms);
            });
        },

        /**
         * Retry a function
         * @param {Function} fn - The function
         * @param {number} retries - Number of retries
         * @param {number} delay - Delay between retries
         * @returns {Promise} Promise that resolves with result
         */
        retry: function(fn, retries, delay) {
            retries = retries || 3;
            delay = delay || 1000;

            return new Promise(function(resolve, reject) {
                function attempt() {
                    Promise.resolve(fn())
                        .then(resolve)
                        .catch(function(error) {
                            if (retries <= 0) {
                                reject(error);
                            } else {
                                retries--;
                                setTimeout(attempt, delay);
                            }
                        });
                }
                attempt();
            });
        },

        /**
         * Memoize a function
         * @param {Function} fn - The function
         * @returns {Function} Memoized function
         */
        memoize: function(fn) {
            const cache = {};
            return function() {
                const key = JSON.stringify(arguments);
                if (cache.hasOwnProperty(key)) {
                    return cache[key];
                }
                const result = fn.apply(this, arguments);
                cache[key] = result;
                return result;
            };
        },

        /**
         * Create a one-time use function
         * @param {Function} fn - The function
         * @returns {Function} Function that can only be called once
         */
        once: function(fn) {
            let called = false;
            return function() {
                if (called) return;
                called = true;
                return fn.apply(this, arguments);
            };
        },

        /**
         * Wait for a condition
         * @param {Function} conditionFn - Condition function
         * @param {number} timeout - Timeout in milliseconds
         * @param {number} interval - Check interval
         * @returns {Promise} Promise that resolves when condition is met
         */
        waitFor: function(conditionFn, timeout, interval) {
            timeout = timeout || 5000;
            interval = interval || 100;

            return new Promise(function(resolve, reject) {
                const startTime = Date.now();

                function check() {
                    if (conditionFn()) {
                        resolve(true);
                    } else if (Date.now() - startTime > timeout) {
                        reject(new Error('Timeout waiting for condition'));
                    } else {
                        setTimeout(check, interval);
                    }
                }

                check();
            });
        },

        /**
         * Generate UUID
         * @returns {string} UUID
         */
        generateUUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        /**
         * Validate email
         * @param {string} email - Email to validate
         * @returns {boolean} Whether valid
         */
        isValidEmail: function(email) {
            if (typeof email !== 'string') return false;
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        /**
         * Validate URL
         * @param {string} url - URL to validate
         * @returns {boolean} Whether valid
         */
        isValidURL: function(url) {
            if (typeof url !== 'string') return false;
            try {
                new URL(url);
                return true;
            } catch (e) {
                return false;
            }
        },

        /**
         * Validate phone number (basic)
         * @param {string} phone - Phone number
         * @returns {boolean} Whether valid
         */
        isValidPhone: function(phone) {
            if (typeof phone !== 'string') return false;
            const regex = /^[\d\s\-\+\(\)]{7,}$/;
            return regex.test(phone);
        },

        /**
         * Validate date
         * @param {string|Date} date - Date to validate
         * @returns {boolean} Whether valid
         */
        isValidDate: function(date) {
            if (date instanceof Date) {
                return !isNaN(date.getTime());
            }
            if (typeof date === 'string') {
                const parsed = new Date(date);
                return !isNaN(parsed.getTime());
            }
            return false;
        },

        /**
         * Format date
         * @param {Date|string} date - Date
         * @param {string} format - Format string (YYYY-MM-DD, DD/MM/YYYY, etc.)
         * @returns {string} Formatted date
         */
        formatDate: function(date, format) {
            const d = date instanceof Date ? date : new Date(date);
            if (isNaN(d.getTime())) return '';

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const seconds = String(d.getSeconds()).padStart(2, '0');

            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds);
        },

        /**
         * Format number
         * @param {number} num - Number
         * @param {number} decimals - Decimal places
         * @returns {string} Formatted number
         */
        formatNumber: function(num, decimals) {
            if (typeof num !== 'number') return '0';
            return num.toFixed(decimals || 0);
        },

        /**
         * Format currency
         * @param {number} amount - Amount
         * @param {string} currency - Currency code
         * @param {string} locale - Locale
         * @returns {string} Formatted currency
         */
        formatCurrency: function(amount, currency, locale) {
            currency = currency || 'USD';
            locale = locale || 'en-US';
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency
            }).format(amount);
        },

        /**
         * Format percentage
         * @param {number} value - Value
         * @param {number} decimals - Decimal places
         * @returns {string} Formatted percentage
         */
        formatPercent: function(value, decimals) {
            if (typeof value !== 'number') return '0%';
            return (value * 100).toFixed(decimals || 0) + '%';
        },

        /**
         * Encode to Base64
         * @param {string} str - String to encode
         * @returns {string} Base64 encoded string
         */
        encodeBase64: function(str) {
            if (typeof str !== 'string') return '';
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
        },

        /**
         * Decode from Base64
         * @param {string} str - Base64 string
         * @returns {string} Decoded string
         */
        decodeBase64: function(str) {
            if (typeof str !== 'string') return '';
            try {
                return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            } catch (e) {
                return atob(str);
            }
        },

        /**
         * Escape HTML
         * @param {string} str - String to escape
         * @returns {string} Escaped string
         */
        escapeHtml: function(str) {
            if (typeof str !== 'string') return '';
            const htmlEscapes = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
            };
            return str.replace(/[&<>"'`=/]/g, function(c) {
                return htmlEscapes[c];
            });
        },

        /**
         * Unescape HTML
         * @param {string} str - String to unescape
         * @returns {string} Unescaped string
         */
        unescapeHtml: function(str) {
            if (typeof str !== 'string') return '';
            const htmlUnescapes = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#39;': "'",
                '&#x2F;': '/',
                '&#x60;': '`',
                '&#x3D;': '='
            };
            return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;|&#x60;|&#x3D;/g, function(c) {
                return htmlUnescapes[c];
            });
        },

        /**
         * Detect browser
         * @returns {string} Browser name
         */
        detectBrowser: function() {
            if (typeof window === 'undefined') return 'Node.js';
            
            const ua = navigator.userAgent;
            if (ua.indexOf('Chrome') > -1) return 'Chrome';
            if (ua.indexOf('Safari') > -1) return 'Safari';
            if (ua.indexOf('Firefox') > -1) return 'Firefox';
            if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) return 'IE';
            return 'Unknown';
        },

        /**
         * Detect OS
         * @returns {string} OS name
         */
        detectOS: function() {
            if (typeof window === 'undefined') return 'Node.js';
            
            const ua = navigator.userAgent;
            if (ua.indexOf('Win') > -1) return 'Windows';
            if (ua.indexOf('Mac') > -1) return 'macOS';
            if (ua.indexOf('Linux') > -1) return 'Linux';
            if (ua.indexOf('Android') > -1) return 'Android';
            if (ua.indexOf('like Mac') > -1) return 'iOS';
            return 'Unknown';
        },

        /**
         * Detect device type
         * @returns {string} Device type
         */
        detectDevice: function() {
            if (typeof window === 'undefined') return 'Server';
            
            const ua = navigator.userAgent;
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
                return 'Tablet';
            }
            if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
                return 'Mobile';
            }
            return 'Desktop';
        },

        /**
         * Get cookie value
         * @param {string} name - Cookie name
         * @returns {string|null} Cookie value
         */
        getCookie: function(name) {
            if (typeof document === 'undefined') return null;
            
            const value = '; ' + document.cookie;
            const parts = value.split('; ' + name + '=');
            
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
            return null;
        },

        /**
         * Set cookie
         * @param {string} name - Cookie name
         * @param {string} value - Cookie value
         * @param {number} days - Days to expire
         */
        setCookie: function(name, value, days) {
            if (typeof document === 'undefined') return;
            
            const expires = new Date();
            expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
        },

        /**
         * Delete cookie
         * @param {string} name - Cookie name
         */
        deleteCookie: function(name) {
            if (typeof document === 'undefined') return;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        },

        /**
         * Get storage value
         * @param {string} type - Storage type ('local' or 'session')
         * @param {string} key - Storage key
         * @returns {*} Stored value
         */
        getStorage: function(type, key) {
            if (typeof window === 'undefined') return null;
            
            const storage = type === 'session' ? window.sessionStorage : window.localStorage;
            try {
                const item = storage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                return storage.getItem(key);
            }
        },

        /**
         * Set storage value
         * @param {string} type - Storage type ('local' or 'session')
         * @param {string} key - Storage key
         * @param {*} value - Value to store
         */
        setStorage: function(type, key, value) {
            if (typeof window === 'undefined') return;
            
            const storage = type === 'session' ? window.sessionStorage : window.localStorage;
            try {
                storage.setItem(key, JSON.stringify(value));
            } catch (e) {
                storage.setItem(key, String(value));
            }
        },

        /**
         * Remove storage item
         * @param {string} type - Storage type
         * @param {string} key - Storage key
         */
        removeStorage: function(type, key) {
            if (typeof window === 'undefined') return;
            
            const storage = type === 'session' ? window.sessionStorage : window.localStorage;
            storage.removeItem(key);
        },

        /**
         * Clear storage
         * @param {string} type - Storage type
         */
        clearStorage: function(type) {
            if (typeof window === 'undefined') return;
            
            const storage = type === 'session' ? window.sessionStorage : window.localStorage;
            storage.clear();
        },

        /**
         * Download file
         * @param {string|Blob} data - File data
         * @param {string} filename - Filename
         * @param {string} type - MIME type
         */
        downloadFile: function(data, filename, type) {
            if (typeof window === 'undefined') return;
            
            const blob = data instanceof Blob ? data : new Blob([data], { type: type || 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        /**
         * Copy text to clipboard
         * @param {string} text - Text to copy
         * @returns {Promise} Promise that resolves when copied
         */
        copyToClipboard: function(text) {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                return navigator.clipboard.writeText(text);
            }
            
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return Promise.resolve();
        },

        /**
         * Get selected text
         * @returns {string} Selected text
         */
        getSelectionText: function() {
            if (typeof window === 'undefined') return '';
            let text = '';
            if (window.getSelection) {
                text = window.getSelection().toString();
            }
            return text;
        },

        /**
         * Add event listener
         * @param {Element|string} element - Element or selector
         * @param {string} event - Event name
         * @param {Function} handler - Event handler
         * @param {Object} options - Options
         * @returns {Element} The element
         */
        addEventListener: function(element, event, handler, options) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (el) {
                el.addEventListener(event, handler, options);
            }
            return el;
        },

        /**
         * Remove event listener
         * @param {Element|string} element - Element or selector
         * @param {string} event - Event name
         * @param {Function} handler - Event handler
         * @param {Object} options - Options
         * @returns {Element} The element
         */
        removeEventListener: function(element, event, handler, options) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (el) {
                el.removeEventListener(event, handler, options);
            }
            return el;
        },

        /**
         * Create custom event
         * @param {string} name - Event name
         * @param {Object} detail - Event detail
         * @returns {CustomEvent} Custom event
         */
        createEvent: function(name, detail) {
            return new CustomEvent(name, { detail: detail });
        },

        /**
         * Dispatch event
         * @param {Element} element - Element
         * @param {Event} event - Event
         */
        dispatchEvent: function(element, event) {
            if (element) {
                element.dispatchEvent(event);
            }
        },

        /**
         * Query selector
         * @param {string} selector - CSS selector
         * @param {Element} context - Context element
         * @returns {Element|null} Matched element
         */
        querySelector: function(selector, context) {
            const ctx = context || document;
            return ctx.querySelector(selector);
        },

        /**
         * Query selector all
         * @param {string} selector - CSS selector
         * @param {Element} context - Context element
         * @returns {NodeList} Matched elements
         */
        querySelectorAll: function(selector, context) {
            const ctx = context || document;
            return ctx.querySelectorAll(selector);
        },

        /**
         * Find closest ancestor
         * @param {Element} element - Starting element
         * @param {string} selector - CSS selector
         * @returns {Element|null} Closest element
         */
        closest: function(element, selector) {
            if (element.closest) {
                return element.closest(selector);
            }
            
            let current = element;
            while (current) {
                if (current.matches(selector)) {
                    return current;
                }
                current = current.parentElement;
            }
            return null;
        },

        /**
         * Get all parents
         * @param {Element} element - Starting element
         * @param {string} selector - Optional selector filter
         * @returns {Array} Array of parent elements
         */
        parents: function(element, selector) {
            const result = [];
            let current = element.parentElement;
            
            while (current) {
                if (!selector || current.matches(selector)) {
                    result.push(current);
                }
                current = current.parentElement;
            }
            return result;
        },

        /**
         * Get sibling elements
         * @param {Element} element - The element
         * @param {string} selector - Optional selector filter
         * @returns {Array} Array of sibling elements
         */
        siblings: function(element, selector) {
            const siblings = Array.prototype.filter.call(
                element.parentElement.children,
                function(child) {
                    return child !== element;
                }
            );
            
            if (selector) {
                return siblings.filter(function(sib) {
                    return sib.matches(selector);
                });
            }
            return siblings;
        },

        /**
         * Get previous sibling
         * @param {Element} element - The element
         * @param {string} selector - Optional selector
         * @returns {Element|null} Previous sibling
         */
        prev: function(element, selector) {
            let sibling = element.previousElementSibling;
            if (selector && sibling) {
                while (sibling) {
                    if (sibling.matches(selector)) {
                        return sibling;
                    }
                    sibling = sibling.previousElementSibling;
                }
                return null;
            }
            return sibling;
        },

        /**
         * Get next sibling
         * @param {Element} element - The element
         * @param {string} selector - Optional selector
         * @returns {Element|null} Next sibling
         */
        next: function(element, selector) {
            let sibling = element.nextElementSibling;
            if (selector && sibling) {
                while (sibling) {
                    if (sibling.matches(selector)) {
                        return sibling;
                    }
                    sibling = sibling.nextElementSibling;
                }
                return null;
            }
            return sibling;
        },

        /**
         * Create DOM element
         * @param {string} tag - Tag name
         * @param {Object} attributes - Attributes object
         * @param {string|Array} children - Child elements or text
         * @returns {Element} Created element
         */
        createElement: function(tag, attributes, children) {
            const el = document.createElement(tag);
            
            if (attributes && typeof attributes === 'object') {
                this.setAttributes(el, attributes);
            }
            
            if (children !== undefined) {
                if (Array.isArray(children)) {
                    children.forEach(function(child) {
                        if (typeof child === 'string') {
                            el.appendChild(document.createTextNode(child));
                        } else if (child instanceof Node) {
                            el.appendChild(child);
                        }
                    });
                } else if (typeof children === 'string') {
                    el.textContent = children;
                } else if (children instanceof Node) {
                    el.appendChild(children);
                }
            }
            
            return el;
        },

        /**
         * Set element attributes
         * @param {Element} element - The element
         * @param {Object} attributes - Attributes object
         * @returns {Element} The element
         */
        setAttributes: function(element, attributes) {
            for (const key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    const value = attributes[key];
                    
                    if (key === 'class' || key === 'className') {
                        element.className = value;
                    } else if (key === 'style' && typeof value === 'object') {
                        for (const prop in value) {
                            if (value.hasOwnProperty(prop)) {
                                element.style[prop] = value[prop];
                            }
                        }
                    } else if (key.startsWith('on') && typeof value === 'function') {
                        const event = key.slice(2).toLowerCase();
                        element.addEventListener(event, value);
                    } else if (key === 'dataset' && typeof value === 'object') {
                        for (const dataKey in value) {
                            if (value.hasOwnProperty(dataKey)) {
                                element.dataset[dataKey] = value[dataKey];
                            }
                        }
                    } else if (value === null || value === undefined) {
                        element.removeAttribute(key);
                    } else {
                        element.setAttribute(key, value);
                    }
                }
            }
            return element;
        },

        /**
         * Get element attributes
         * @param {Element} element - The element
         * @param {Array} keys - Keys to get
         * @returns {Object} Attributes object
         */
        getAttributes: function(element, keys) {
            const result = {};
            if (!Array.isArray(keys)) keys = [keys];
            
            keys.forEach(function(key) {
                result[key] = element.getAttribute(key);
            });
            return result;
        },

        /**
         * Remove element attributes
         * @param {Element} element - The element
         * @param {Array} keys - Keys to remove
         * @returns {Element} The element
         */
        removeAttributes: function(element, keys) {
            if (!Array.isArray(keys)) keys = [keys];
            
            keys.forEach(function(key) {
                element.removeAttribute(key);
            });
            return element;
        },

        /**
         * Add CSS class(es)
         * @param {Element|string} element - Element or selector
         * @param {string|Array} classes - Class(es) to add
         * @returns {Element} The element
         */
        addClass: function(element, classes) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return null;
            
            const classList = Array.isArray(classes) ? classes : classes.split(/\s+/);
            classList.forEach(function(cls) {
                if (cls) el.classList.add(cls);
            });
            return el;
        },

        /**
         * Remove CSS class(es)
         * @param {Element|string} element - Element or selector
         * @param {string|Array} classes - Class(es) to remove
         * @returns {Element} The element
         */
        removeClass: function(element, classes) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return null;
            
            const classList = Array.isArray(classes) ? classes : classes.split(/\s+/);
            classList.forEach(function(cls) {
                if (cls) el.classList.remove(cls);
            });
            return el;
        },

        /**
         * Toggle CSS class(es)
         * @param {Element|string} element - Element or selector
         * @param {string|Array} classes - Class(es) to toggle
         * @returns {Element} The element
         */
        toggleClass: function(element, classes) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return null;
            
            const classList = Array.isArray(classes) ? classes : classes.split(/\s+/);
            classList.forEach(function(cls) {
                if (cls) el.classList.toggle(cls);
            });
            return el;
        },

        /**
         * Check if element has class
         * @param {Element|string} element - Element or selector
         * @param {string} className - Class name
         * @returns {boolean} Whether element has class
         */
        hasClass: function(element, className) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return false;
            return el.classList.contains(className);
        },

        /**
         * Get data attribute
         * @param {Element|string} element - Element or selector
         * @param {string} key - Data key
         * @returns {*} Data value
         */
        getData: function(element, key) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return null;
            return el.dataset[key];
        },

        /**
         * Set data attribute
         * @param {Element|string} element - Element or selector
         * @param {string} key - Data key
         * @param {*} value - Value
         * @returns {Element} The element
         */
        setData: function(element, key, value) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return null;
            el.dataset[key] = value;
            return el;
        },

        /**
         * Remove data attribute
         * @param {Element|string} element - Element or selector
         * @param {string} key - Data key
         * @returns {Element} The element
         */
        removeData: function(element, key) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return null;
            delete el.dataset[key];
            return el;
        },

        /**
         * Get computed style
         * @param {Element|string} element - Element or selector
         * @param {string} property - CSS property
         * @returns {string} Style value
         */
        getStyle: function(element, property) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return '';
            return window.getComputedStyle(el).getPropertyValue(property);
        },

        /**
         * Set CSS styles
         * @param {Element|string} element - Element or selector
         * @param {Object} properties - CSS properties
         * @returns {Element} The element
         */
        setStyle: function(element, properties) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return null;
            
            for (const prop in properties) {
                if (properties.hasOwnProperty(prop)) {
                    el.style[prop] = properties[prop];
                }
            }
            return el;
        },

        /**
         * Get element dimensions
         * @param {Element|string} element - Element or selector
         * @returns {Object} Dimensions object
         */
        getDimensions: function(element) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return null;
            
            const rect = el.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left,
                x: rect.x,
                y: rect.y
            };
        },

        /**
         * Set element dimensions
         * @param {Element|string} element - Element or selector
         * @param {Object} dimensions - Dimensions object
         * @returns {Element} The element
         */
        setDimensions: function(element, dimensions) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return null;
            
            if (dimensions.width) el.style.width = typeof dimensions.width === 'number' ? dimensions.width + 'px' : dimensions.width;
            if (dimensions.height) el.style.height = typeof dimensions.height === 'number' ? dimensions.height + 'px' : dimensions.height;
            return el;
        },

        /**
         * Get element position
         * @param {Element|string} element - Element or selector
         * @returns {Object} Position object
         */
        getPosition: function(element) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return null;
            
            return {
                top: el.offsetTop,
                left: el.offsetLeft
            };
        },

        /**
         * Set element position
         * @param {Element|string} element - Element or selector
         * @param {Object} position - Position object
         * @returns {Element} The element
         */
        setPosition: function(element, position) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return null;
            
            if (position.top !== undefined) el.style.top = typeof position.top === 'number' ? position.top + 'px' : position.top;
            if (position.left !== undefined) el.style.left = typeof position.left === 'number' ? position.left + 'px' : position.left;
            if (position.bottom !== undefined) el.style.bottom = typeof position.bottom === 'number' ? position.bottom + 'px' : position.bottom;
            if (position.right !== undefined) el.style.right = typeof position.right === 'number' ? position.right + 'px' : position.right;
            return el;
        },

        /**
         * Check if element is visible
         * @param {Element|string} element - Element or selector
         * @returns {boolean} Whether visible
         */
        isVisible: function(element) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return false;
            
            return el.offsetWidth > 0 && el.offsetHeight > 0 && el.style.visibility !== 'hidden';
        },

        /**
         * Check if element is in viewport
         * @param {Element|string} element - Element or selector
         * @returns {boolean} Whether in viewport
         */
        isInViewport: function(element) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return false;
            
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth
            );
        },

        /**
         * Check if element is above fold (visible without scrolling)
         * @param {Element|string} element - Element or selector
         * @returns {boolean} Whether above fold
         */
        isAboveFold: function(element) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return false;
            
            const rect = el.getBoundingClientRect();
            return rect.top >= 0 && rect.top < window.innerHeight;
        },

        /**
         * Execute callback when page loads
         * @param {Function} callback - Callback function
         */
        onLoad: function(callback) {
            if (document.readyState === 'complete') {
                callback();
            } else {
                window.addEventListener('load', callback);
            }
        },

        /**
         * Execute callback when DOM is ready
         * @param {Function} callback - Callback function
         */
        onDOMReady: function(callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
            } else {
                callback();
            }
        },

        /**
         * Check if value is an object
         * @param {*} value - Value to check
         * @returns {boolean} Whether object
         */
        isObject: function(value) {
            return value !== null && typeof value === 'object' && !Array.isArray(value);
        }
    };

    return OmniHelper;
}));

# Visibility Libirary Structure

## 0. Public Methods
- isSupport();
- state();
- onChange();
- offChange([id]);
- onceVisible();
- onceHidden();
- afterprerender();

## 1. Fallback
- visibilitychange event
- onFocus and onBlur, trigger visibilitychange event, and send hidden or visible state param

## 2. Compatibility
- browser prefix

## 3. Timer
暂时不提供

## 4. Remark
### 4.1. Base on
[ai/visibilityjs](https://github.com/ai/visibilityjs)

### 4.2. Differences
1. 增加CMD 模块加载支持；
2. 事件监听逻辑优化，只监听一次visibilitychange 事件，并将callback 添加到回调数组中；
3. 添加更多浏览器前缀兼容性；
4. 暂时Timer 支持未提供；
5. Fallback 逻辑与主体逻辑合并，不在独立开来；